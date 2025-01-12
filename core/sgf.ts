import {compact, replace} from 'lodash';
import {isCharacterInNode} from './helpers';

import TreeModel from 'tree-model';
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
import type {SgfNode} from './types';
import {getDeduplicatedProps, getNodeNumber} from '../helper';
import {calcSHA} from '../helper';

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
  root: TreeModel.Node<SgfNode> | null = null;
  node: TreeModel.Node<SgfNode> | null = null;
  currentNode: TreeModel.Node<SgfNode> | null = null;
  parentNode: TreeModel.Node<SgfNode> | null = null;
  nodeProps: Map<string, string> = new Map();

  /**
   * Constructs a new instance of the Sgf class.
   * @param content The content of the Sgf, either as a string or as a TreeModel.Node<SgfNode>(Root node).
   * @param parseOptions The options for parsing the Sgf content.
   */
  constructor(
    private content?: string | TreeModel.Node<SgfNode>,
    private parseOptions = {
      ignorePropList: [],
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
  setRoot(root: TreeModel.Node<SgfNode>) {
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
    sgf = sgf.replace(/\s+(?![^\[\]]*])/gm, '');
    let nodeStart = 0;
    let counter = 0;
    const stack: TreeModel.Node<SgfNode>[] = [];

    for (let i = 0; i < sgf.length; i++) {
      const c = sgf[i];
      if (this.NODE_DELIMITERS.includes(c) && !isCharacterInNode(sgf, i)) {
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
              RegExp(/\w+(\[[^\]]*?\](?:\r?\n?\s[^\]]*?)*){1,}/, 'g')
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
            const sha = calcSHA(this.currentNode, moveProps);
            const node = this.tree.parse<SgfNode>({
              id: sha,
              name: sha,
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
              // TODO: maybe unnecessary?
              node.model.children = [node];
            } else {
              this.root = node;
              this.parentNode = node;
            }
            this.currentNode = node;
            counter += 1;
          }
        }
      }
      if (c === '(' && this.currentNode && !isCharacterInNode(sgf, i)) {
        // console.log(`${sgf[i]}${sgf[i + 1]}${sgf[i + 2]}`);
        stack.push(this.currentNode);
      }
      if (c === ')' && !isCharacterInNode(sgf, i) && stack.length > 0) {
        const node = stack.pop();
        if (node) {
          this.currentNode = node;
        }
      }

      if (this.NODE_DELIMITERS.includes(c) && !isCharacterInNode(sgf, i)) {
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
    node.walk((n: TreeModel.Node<SgfNode>) => {
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
        n.children.forEach((child: SgfPropBase) => {
          content += `(${this.nodeToString(child)})`;
        });
      }
      return n.children.length < 2;
    });
    return content;
  }
}
