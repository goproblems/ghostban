import {compact, replace} from 'lodash';
import {
  buildPropertyValueRanges,
  isInAnyRange,
  calcHash,
  getDeduplicatedProps,
  getNodeNumber,
} from './helpers';

import {TreeModel, TNode} from './tree';
import {
  MoveProp,
  SetupProp,
  RootProp,
  GameInfoProp,
  SgfPropBase,
  NodeAnnotationProp,
  MoveAnnotationProp,
  MarkupProp,
  CustomProp,
  ROOT_PROP_LIST,
  MOVE_PROP_LIST,
  SETUP_PROP_LIST,
  MARKUP_PROP_LIST,
  NODE_ANNOTATION_PROP_LIST,
  MOVE_ANNOTATION_PROP_LIST,
  GAME_INFO_PROP_LIST,
  CUSTOM_PROP_LIST,
} from './props';

/**
 * Represents an SGF (Smart Game Format) file.
 */
export class Sgf {
  NEW_NODE = ';';
  BRANCHING = ['(', ')'];
  PROPERTY = ['[', ']'];
  LIST_IDENTITIES = [
    'AW',
    'AB',
    'AE',
    'AR',
    'CR',
    'DD',
    'LB',
    'LN',
    'MA',
    'SL',
    'SQ',
    'TR',
    'VW',
    'TB',
    'TW',
  ];
  NODE_DELIMITERS = [this.NEW_NODE].concat(this.BRANCHING);

  tree: TreeModel = new TreeModel();
  root: TNode | null = null;
  node: TNode | null = null;
  currentNode: TNode | null = null;
  parentNode: TNode | null = null;
  nodeProps: Map<string, string> = new Map();
  nodeMap: Map<string, TNode> = new Map();
  pathMap: Map<string, TNode[]> = new Map();

  /**
   * Constructs a new instance of the Sgf class.
   * @param content The content of the Sgf, either as a string or as a TNode(Root node).
   * @param parseOptions The options for parsing the Sgf content.
   */
  constructor(
    private content?: string | TNode,
    private parseOptions = {
      ignorePropList: [],
      enableNodeMap: false,
      enablePathMap: false,
    }
  ) {
    if (typeof content === 'string') {
      this.parse(content);
    } else if (typeof content === 'object') {
      this.setRoot(content);
    }
  }

  /**
   * Sets the root node of the SGF tree.
   *
   * @param root The root node to set.
   * @returns The updated SGF instance.
   */
  setRoot(root: TNode) {
    this.root = root;
    return this;
  }

  /**
   * Converts the current SGF tree to an SGF string representation.
   * @returns The SGF string representation of the tree.
   */
  toSgf() {
    return `(${this.nodeToString(this.root)})`;
  }

  /**
   * Converts the game tree to SGF format without including analysis data.
   *
   * @returns The SGF representation of the game tree.
   */
  toSgfWithoutAnalysis() {
    const sgf = `(${this.nodeToString(this.root)})`;
    return replace(sgf, /](A\[.*?\])/g, ']');
  }

  /**
   * Parses the given SGF (Smart Game Format) string.
   *
   * @param sgf - The SGF string to parse.
   */
  parse(sgf: string) {
    if (!sgf) return;

    // First, get all property value ranges from the original string
    // Use all known SGF property keys from the constants
    const allPropertyKeys = [
      ...ROOT_PROP_LIST,
      ...MOVE_PROP_LIST,
      ...SETUP_PROP_LIST,
      ...MARKUP_PROP_LIST,
      ...NODE_ANNOTATION_PROP_LIST,
      ...MOVE_ANNOTATION_PROP_LIST,
      ...GAME_INFO_PROP_LIST,
      ...CUSTOM_PROP_LIST,
    ];

    const propertyValueRanges = buildPropertyValueRanges(
      sgf,
      allPropertyKeys
    ).sort((a, b) => a[0] - b[0]);

    // Remove spaces only outside property value ranges
    let processedSgf = '';
    let lastIndex = 0;

    for (const [start, end] of propertyValueRanges) {
      // Process text before this property value (remove spaces)
      const beforeProp = sgf.slice(lastIndex, start);
      processedSgf += beforeProp.replace(/\s+/gm, '');

      // Keep property value as-is (preserve spaces)
      const propValue = sgf.slice(start, end);
      processedSgf += propValue;

      lastIndex = end;
    }

    // Process remaining text after last property value (remove spaces)
    const remaining = sgf.slice(lastIndex);
    processedSgf += remaining.replace(/\s+/gm, '');

    // Now use the processed SGF for parsing
    sgf = processedSgf;
    let nodeStart = 0;
    let counter = 0;
    const stack: TNode[] = [];

    const inNodeRanges = buildPropertyValueRanges(sgf).sort(
      (a, b) => a[0] - b[0]
    );

    for (let i = 0; i < sgf.length; i++) {
      const c = sgf[i];
      const insideProp = isInAnyRange(i, inNodeRanges);

      if (this.NODE_DELIMITERS.includes(c) && !insideProp) {
        const content = sgf.slice(nodeStart, i);
        if (content !== '') {
          const moveProps: MoveProp[] = [];
          const setupProps: SetupProp[] = [];
          const rootProps: RootProp[] = [];
          const markupProps: MarkupProp[] = [];
          const gameInfoProps: GameInfoProp[] = [];
          const nodeAnnotationProps: NodeAnnotationProp[] = [];
          const moveAnnotationProps: MoveAnnotationProp[] = [];
          const customProps: CustomProp[] = [];

          const matches = [
            ...content.matchAll(
              // RegExp(/([A-Z]+\[[a-z\[\]]*\]+)/, 'g')
              // RegExp(/([A-Z]+\[.*?\]+)/, 'g')
              // RegExp(/[A-Z]+(\[.*?\]){1,}/, 'g')
              // RegExp(/[A-Z]+(\[[\s\S]*?\]){1,}/, 'g'),
              // Simplified regex to handle escaped brackets properly
              // [^\]\\]|\\.  matches: any char except ] and \, OR any escaped char (\.)
              RegExp(/\w+(?:\[(?:[^\]\\]|\\.)*\])+/g)
            ),
          ];

          matches.forEach(m => {
            const tokenMatch = m[0].match(/([A-Z]+)\[/);
            if (tokenMatch) {
              const token = tokenMatch[1];
              if (MOVE_PROP_LIST.includes(token)) {
                moveProps.push(MoveProp.from(m[0]));
              }
              if (SETUP_PROP_LIST.includes(token)) {
                setupProps.push(SetupProp.from(m[0]));
              }
              if (ROOT_PROP_LIST.includes(token)) {
                rootProps.push(RootProp.from(m[0]));
              }
              if (MARKUP_PROP_LIST.includes(token)) {
                markupProps.push(MarkupProp.from(m[0]));
              }
              if (GAME_INFO_PROP_LIST.includes(token)) {
                gameInfoProps.push(GameInfoProp.from(m[0]));
              }
              if (NODE_ANNOTATION_PROP_LIST.includes(token)) {
                nodeAnnotationProps.push(NodeAnnotationProp.from(m[0]));
              }
              if (MOVE_ANNOTATION_PROP_LIST.includes(token)) {
                moveAnnotationProps.push(MoveAnnotationProp.from(m[0]));
              }
              if (CUSTOM_PROP_LIST.includes(token)) {
                customProps.push(CustomProp.from(m[0]));
              }
            }
          });

          if (matches.length > 0) {
            const hash = calcHash(this.currentNode, moveProps);
            const node = this.tree.parse({
              id: hash,
              name: hash,
              index: counter,
              number: 0,
              moveProps,
              setupProps,
              rootProps,
              markupProps,
              gameInfoProps,
              nodeAnnotationProps,
              moveAnnotationProps,
              customProps,
            });

            if (this.currentNode) {
              this.currentNode.addChild(node);

              node.model.number = getNodeNumber(node);
            } else {
              this.root = node;
              this.parentNode = node;
            }
            this.currentNode = node;

            if (this.parseOptions.enableNodeMap) {
              this.nodeMap.set(node.model.id, node);
            }

            if (this.parseOptions.enablePathMap) {
              if (node.parent) {
                const parentPath = this.pathMap.get(node.parent.model.id);
                if (parentPath) {
                  this.pathMap.set(node.model.id, [...parentPath, node]);
                }
              } else {
                this.pathMap.set(node.model.id, [node]);
              }
            }

            counter += 1;
          }
        }
      }
      if (c === '(' && this.currentNode && !insideProp) {
        stack.push(this.currentNode);
      }
      if (c === ')' && !insideProp && stack.length > 0) {
        const node = stack.pop();
        if (node) {
          this.currentNode = node;
        }
      }

      if (this.NODE_DELIMITERS.includes(c) && !insideProp) {
        nodeStart = i;
      }
    }
  }

  /**
   * Converts a node to a string representation.
   *
   * @param node - The node to convert.
   * @returns The string representation of the node.
   */
  private nodeToString(node: any) {
    let content = '';
    node.walk((n: TNode) => {
      const {
        rootProps,
        moveProps,
        customProps,
        setupProps,
        markupProps,
        nodeAnnotationProps,
        moveAnnotationProps,
        gameInfoProps,
      } = n.model;
      const nodes = compact([
        ...rootProps,
        ...customProps,
        ...moveProps,
        ...getDeduplicatedProps(setupProps),
        ...getDeduplicatedProps(markupProps),
        ...gameInfoProps,
        ...nodeAnnotationProps,
        ...moveAnnotationProps,
      ]);
      content += ';';
      nodes.forEach((n: SgfPropBase) => {
        content += n.toString();
      });
      if (n.children.length > 1) {
        n.children.forEach((child: TNode) => {
          content += `(${this.nodeToString(child)})`;
        });
      }
      return n.children.length < 2;
    });
    return content;
  }
}
