import { TreeModel, TNode } from './tree';
/**
 * Represents an SGF (Smart Game Format) file.
 */
export declare class Sgf {
    private content?;
    private parseOptions;
    NEW_NODE: string;
    BRANCHING: string[];
    PROPERTY: string[];
    LIST_IDENTITIES: string[];
    NODE_DELIMITERS: string[];
    tree: TreeModel;
    root: TNode | null;
    node: TNode | null;
    currentNode: TNode | null;
    parentNode: TNode | null;
    nodeProps: Map<string, string>;
    /**
     * Constructs a new instance of the Sgf class.
     * @param content The content of the Sgf, either as a string or as a TNode(Root node).
     * @param parseOptions The options for parsing the Sgf content.
     */
    constructor(content?: string | TNode | undefined, parseOptions?: {
        ignorePropList: never[];
    });
    /**
     * Sets the root node of the SGF tree.
     *
     * @param root The root node to set.
     * @returns The updated SGF instance.
     */
    setRoot(root: TNode): this;
    /**
     * Converts the current SGF tree to an SGF string representation.
     * @returns The SGF string representation of the tree.
     */
    toSgf(): string;
    /**
     * Converts the game tree to SGF format without including analysis data.
     *
     * @returns The SGF representation of the game tree.
     */
    toSgfWithoutAnalysis(): string;
    /**
     * Parses the given SGF (Smart Game Format) string.
     *
     * @param sgf - The SGF string to parse.
     */
    parse(sgf: string): void;
    /**
     * Converts a node to a string representation.
     *
     * @param node - The node to convert.
     * @returns The string representation of the node.
     */
    private nodeToString;
}
