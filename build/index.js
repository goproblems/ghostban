
  /**
   * @license
   * author: BAI TIANLIANG
   * ghostban.js v3.0.0-alpha.141
   * Released under the MIT license.
   */

'use strict';

var tslib = require('tslib');
var lodash = require('lodash');
var jsBase64 = require('js-base64');

/**
 * Sort an array using the merge sort algorithm.
 *
 * @param comparatorFn The comparator function.
 * @param arr The array to sort.
 * @returns The sorted array.
 */
function mergeSort(comparatorFn, arr) {
    var len = arr.length;
    if (len >= 2) {
        var firstHalf = arr.slice(0, len / 2);
        var secondHalf = arr.slice(len / 2, len);
        return merge(comparatorFn, mergeSort(comparatorFn, firstHalf), mergeSort(comparatorFn, secondHalf));
    }
    else {
        return arr.slice();
    }
}
/**
 * The merge part of the merge sort algorithm.
 *
 * @param comparatorFn The comparator function.
 * @param arr1 The first sorted array.
 * @param arr2 The second sorted array.
 * @returns The merged and sorted array.
 */
function merge(comparatorFn, arr1, arr2) {
    var result = [];
    var left1 = arr1.length;
    var left2 = arr2.length;
    while (left1 > 0 && left2 > 0) {
        if (comparatorFn(arr1[0], arr2[0]) <= 0) {
            result.push(arr1.shift()); // non-null assertion: safe since we just checked length
            left1--;
        }
        else {
            result.push(arr2.shift());
            left2--;
        }
    }
    if (left1 > 0) {
        result.push.apply(result, tslib.__spreadArray([], tslib.__read(arr1), false));
    }
    else {
        result.push.apply(result, tslib.__spreadArray([], tslib.__read(arr2), false));
    }
    return result;
}

function findInsertIndex(comparatorFn, arr, el) {
    var i;
    var len = arr.length;
    for (i = 0; i < len; i++) {
        if (comparatorFn(arr[i], el) > 0) {
            break;
        }
    }
    return i;
}
var TNode = /** @class */ (function () {
    function TNode(config, model) {
        this.children = [];
        this.config = config;
        this.model = model;
    }
    TNode.prototype.isRoot = function () {
        return this.parent === undefined;
    };
    TNode.prototype.hasChildren = function () {
        return this.children.length > 0;
    };
    TNode.prototype.addChild = function (child) {
        return addChild(this, child);
    };
    TNode.prototype.addChildAtIndex = function (child, index) {
        if (this.config.modelComparatorFn) {
            throw new Error('Cannot add child at index when using a comparator function.');
        }
        var prop = this.config.childrenPropertyName || 'children';
        if (!this.model[prop]) {
            this.model[prop] = [];
        }
        var modelChildren = this.model[prop];
        if (index < 0 || index > this.children.length) {
            throw new Error('Invalid index.');
        }
        child.parent = this;
        modelChildren.splice(index, 0, child.model);
        this.children.splice(index, 0, child);
        return child;
    };
    TNode.prototype.getPath = function () {
        var path = [];
        var current = this;
        while (current) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    };
    TNode.prototype.getIndex = function () {
        return this.isRoot() ? 0 : this.parent.children.indexOf(this);
    };
    TNode.prototype.setIndex = function (index) {
        if (this.config.modelComparatorFn) {
            throw new Error('Cannot set node index when using a comparator function.');
        }
        if (this.isRoot()) {
            if (index === 0) {
                return this;
            }
            throw new Error('Invalid index.');
        }
        if (!this.parent) {
            throw new Error('Node has no parent.');
        }
        var siblings = this.parent.children;
        var modelSiblings = this.parent.model[this.config.childrenPropertyName || 'children'];
        var oldIndex = siblings.indexOf(this);
        if (index < 0 || index >= siblings.length) {
            throw new Error('Invalid index.');
        }
        siblings.splice(index, 0, siblings.splice(oldIndex, 1)[0]);
        modelSiblings.splice(index, 0, modelSiblings.splice(oldIndex, 1)[0]);
        return this;
    };
    TNode.prototype.walk = function (fn) {
        var walkRecursive = function (node) {
            var e_1, _a;
            if (fn(node) === false)
                return false;
            try {
                for (var _b = tslib.__values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (walkRecursive(child) === false)
                        return false;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
        };
        walkRecursive(this);
    };
    TNode.prototype.first = function (fn) {
        var result;
        this.walk(function (node) {
            if (fn(node)) {
                result = node;
                return false;
            }
        });
        return result;
    };
    TNode.prototype.all = function (fn) {
        var result = [];
        this.walk(function (node) {
            if (fn(node))
                result.push(node);
        });
        return result;
    };
    TNode.prototype.drop = function () {
        if (this.parent) {
            var idx = this.parent.children.indexOf(this);
            if (idx >= 0) {
                this.parent.children.splice(idx, 1);
                var prop = this.config.childrenPropertyName || 'children';
                this.parent.model[prop].splice(idx, 1);
            }
            this.parent = undefined;
        }
        return this;
    };
    return TNode;
}());
function addChild(parent, child) {
    var prop = parent.config.childrenPropertyName || 'children';
    if (!parent.model[prop]) {
        parent.model[prop] = [];
    }
    var modelChildren = parent.model[prop];
    child.parent = parent;
    if (parent.config.modelComparatorFn) {
        var index = findInsertIndex(parent.config.modelComparatorFn, modelChildren, child.model);
        modelChildren.splice(index, 0, child.model);
        parent.children.splice(index, 0, child);
    }
    else {
        modelChildren.push(child.model);
        parent.children.push(child);
    }
    return child;
}
var TreeModel = /** @class */ (function () {
    function TreeModel(config) {
        if (config === void 0) { config = {}; }
        this.config = {
            childrenPropertyName: config.childrenPropertyName || 'children',
            modelComparatorFn: config.modelComparatorFn,
        };
    }
    TreeModel.prototype.parse = function (model) {
        var e_2, _a;
        if (typeof model !== 'object' || model === null) {
            throw new TypeError('Model must be of type object.');
        }
        var node = new TNode(this.config, model);
        var prop = this.config.childrenPropertyName;
        var children = model[prop];
        if (Array.isArray(children)) {
            if (this.config.modelComparatorFn) {
                model[prop] = mergeSort(this.config.modelComparatorFn, children);
            }
            try {
                for (var _b = tslib.__values(model[prop]), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var childModel = _c.value;
                    var childNode = this.parse(childModel);
                    addChild(node, childNode);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return node;
    };
    return TreeModel;
}());

var SparkMD5 = require('spark-md5');
var calcHash = function (node, moveProps) {
    if (moveProps === void 0) { moveProps = []; }
    var fullname = 'n';
    if (moveProps.length > 0) {
        fullname += "".concat(moveProps[0].token).concat(moveProps[0].value);
    }
    if (node) {
        var path = node.getPath();
        if (path.length > 0) {
            fullname = path.map(function (n) { return n.model.id; }).join('=>') + "=>".concat(fullname);
        }
    }
    return SparkMD5.hash(fullname).slice(0, 6);
};
function isCharacterInNode(sgf, n, nodes) {
    if (nodes === void 0) { nodes = ['C', 'TM', 'GN', 'PC']; }
    var pattern = new RegExp("(".concat(nodes.join('|'), ")\\[([^\\]]*)\\]"), 'g');
    var match;
    while ((match = pattern.exec(sgf)) !== null) {
        var contentStart = match.index + match[1].length + 1; // +1 for the '['
        var contentEnd = contentStart + match[2].length;
        if (n >= contentStart && n <= contentEnd) {
            return true;
        }
    }
    return false;
}
function buildNodeRanges(sgf, keys) {
    if (keys === void 0) { keys = ['C', 'TM', 'GN', 'PC']; }
    var ranges = [];
    var pattern = new RegExp("\\b(".concat(keys.join('|'), ")\\[([^\\]]*)\\]"), 'g');
    var match;
    while ((match = pattern.exec(sgf)) !== null) {
        var start = match.index + match[1].length + 1;
        var end = start + match[2].length;
        ranges.push([start, end]);
    }
    return ranges;
}
function isInAnyRange(index, ranges) {
    // ranges must be sorted
    var left = 0;
    var right = ranges.length - 1;
    while (left <= right) {
        var mid = (left + right) >> 1;
        var _a = tslib.__read(ranges[mid], 2), start = _a[0], end = _a[1];
        if (index < start) {
            right = mid - 1;
        }
        else if (index > end) {
            left = mid + 1;
        }
        else {
            return true;
        }
    }
    return false;
}
var getDeduplicatedProps = function (targetProps) {
    return lodash.filter(targetProps, function (prop, index) {
        return index ===
            lodash.findLastIndex(targetProps, function (lastPro) {
                return prop.token === lastPro.token && prop.value === lastPro.value;
            });
    });
};
var isMoveNode = function (n) {
    return n.model.moveProps.length > 0;
};
var isRootNode = function (n) {
    return n.model.rootProps.length > 0 || n.isRoot();
};
var isSetupNode = function (n) {
    return n.model.setupProps.length > 0;
};
var getNodeNumber = function (n, parent) {
    var path = n.getPath();
    var movesCount = path.filter(function (n) { return isMoveNode(n); }).length;
    if (parent) {
        movesCount += parent.getPath().filter(function (n) { return isMoveNode(n); }).length;
    }
    return movesCount;
};

/**
 * Theme property keys for type-safe access to theme configuration
 */
exports.ThemePropertyKey = void 0;
(function (ThemePropertyKey) {
    ThemePropertyKey["PositiveNodeColor"] = "positiveNodeColor";
    ThemePropertyKey["NegativeNodeColor"] = "negativeNodeColor";
    ThemePropertyKey["NeutralNodeColor"] = "neutralNodeColor";
    ThemePropertyKey["DefaultNodeColor"] = "defaultNodeColor";
    ThemePropertyKey["WarningNodeColor"] = "warningNodeColor";
    ThemePropertyKey["ShadowColor"] = "shadowColor";
    ThemePropertyKey["BoardLineColor"] = "boardLineColor";
    ThemePropertyKey["ActiveColor"] = "activeColor";
    ThemePropertyKey["InactiveColor"] = "inactiveColor";
    ThemePropertyKey["BoardBackgroundColor"] = "boardBackgroundColor";
    ThemePropertyKey["FlatBlackColor"] = "flatBlackColor";
    ThemePropertyKey["FlatBlackColorAlt"] = "flatBlackColorAlt";
    ThemePropertyKey["FlatWhiteColor"] = "flatWhiteColor";
    ThemePropertyKey["FlatWhiteColorAlt"] = "flatWhiteColorAlt";
    ThemePropertyKey["BoardEdgeLineWidth"] = "boardEdgeLineWidth";
    ThemePropertyKey["BoardLineWidth"] = "boardLineWidth";
    ThemePropertyKey["BoardLineExtent"] = "boardLineExtent";
    ThemePropertyKey["StarSize"] = "starSize";
    ThemePropertyKey["MarkupLineWidth"] = "markupLineWidth";
    ThemePropertyKey["HighlightColor"] = "highlightColor";
})(exports.ThemePropertyKey || (exports.ThemePropertyKey = {}));
exports.Ki = void 0;
(function (Ki) {
    Ki[Ki["Black"] = 1] = "Black";
    Ki[Ki["White"] = -1] = "White";
    Ki[Ki["Empty"] = 0] = "Empty";
})(exports.Ki || (exports.Ki = {}));
exports.Theme = void 0;
(function (Theme) {
    Theme["BlackAndWhite"] = "black_and_white";
    Theme["Flat"] = "flat";
    Theme["Subdued"] = "subdued";
    Theme["ShellStone"] = "shell_stone";
    Theme["SlateAndShell"] = "slate_and_shell";
    Theme["Walnut"] = "walnut";
    Theme["Photorealistic"] = "photorealistic";
    Theme["Dark"] = "dark";
    Theme["Warm"] = "warm";
    Theme["YunziMonkeyDark"] = "yunzi_monkey_dark";
    Theme["HighContrast"] = "high_contrast";
})(exports.Theme || (exports.Theme = {}));
exports.AnalysisPointTheme = void 0;
(function (AnalysisPointTheme) {
    AnalysisPointTheme["Default"] = "default";
    AnalysisPointTheme["Problem"] = "problem";
})(exports.AnalysisPointTheme || (exports.AnalysisPointTheme = {}));
exports.Center = void 0;
(function (Center) {
    Center["Left"] = "l";
    Center["Right"] = "r";
    Center["Top"] = "t";
    Center["Bottom"] = "b";
    Center["TopRight"] = "tr";
    Center["TopLeft"] = "tl";
    Center["BottomLeft"] = "bl";
    Center["BottomRight"] = "br";
    Center["Center"] = "c";
})(exports.Center || (exports.Center = {}));
exports.Effect = void 0;
(function (Effect) {
    Effect["None"] = "";
    Effect["Ban"] = "ban";
    Effect["Dim"] = "dim";
    Effect["Highlight"] = "highlight";
})(exports.Effect || (exports.Effect = {}));
exports.Markup = void 0;
(function (Markup) {
    Markup["Current"] = "cu";
    Markup["Circle"] = "ci";
    Markup["CircleSolid"] = "cis";
    Markup["Square"] = "sq";
    Markup["SquareSolid"] = "sqs";
    Markup["Triangle"] = "tri";
    Markup["Cross"] = "cr";
    Markup["Number"] = "num";
    Markup["Letter"] = "le";
    Markup["PositiveNode"] = "pos";
    Markup["PositiveActiveNode"] = "posa";
    Markup["PositiveDashedNode"] = "posda";
    Markup["PositiveDottedNode"] = "posdt";
    Markup["PositiveDashedActiveNode"] = "posdaa";
    Markup["PositiveDottedActiveNode"] = "posdta";
    Markup["NegativeNode"] = "neg";
    Markup["NegativeActiveNode"] = "nega";
    Markup["NegativeDashedNode"] = "negda";
    Markup["NegativeDottedNode"] = "negdt";
    Markup["NegativeDashedActiveNode"] = "negdaa";
    Markup["NegativeDottedActiveNode"] = "negdta";
    Markup["NeutralNode"] = "neu";
    Markup["NeutralActiveNode"] = "neua";
    Markup["NeutralDashedNode"] = "neuda";
    Markup["NeutralDottedNode"] = "neudt";
    Markup["NeutralDashedActiveNode"] = "neudta";
    Markup["NeutralDottedActiveNode"] = "neudaa";
    Markup["WarningNode"] = "wa";
    Markup["WarningActiveNode"] = "waa";
    Markup["WarningDashedNode"] = "wada";
    Markup["WarningDottedNode"] = "wadt";
    Markup["WarningDashedActiveNode"] = "wadaa";
    Markup["WarningDottedActiveNode"] = "wadta";
    Markup["DefaultNode"] = "de";
    Markup["DefaultActiveNode"] = "dea";
    Markup["DefaultDashedNode"] = "deda";
    Markup["DefaultDottedNode"] = "dedt";
    Markup["DefaultDashedActiveNode"] = "dedaa";
    Markup["DefaultDottedActiveNode"] = "dedta";
    Markup["Node"] = "node";
    Markup["DashedNode"] = "danode";
    Markup["DottedNode"] = "dtnode";
    Markup["ActiveNode"] = "anode";
    Markup["DashedActiveNode"] = "danode";
    Markup["Highlight"] = "hl";
    Markup["None"] = "";
})(exports.Markup || (exports.Markup = {}));
exports.Cursor = void 0;
(function (Cursor) {
    Cursor["None"] = "";
    Cursor["BlackStone"] = "b";
    Cursor["WhiteStone"] = "w";
    Cursor["Circle"] = "c";
    Cursor["Square"] = "s";
    Cursor["Triangle"] = "tri";
    Cursor["Cross"] = "cr";
    Cursor["Clear"] = "cl";
    Cursor["Text"] = "t";
})(exports.Cursor || (exports.Cursor = {}));
exports.ProblemAnswerType = void 0;
(function (ProblemAnswerType) {
    ProblemAnswerType["Right"] = "1";
    ProblemAnswerType["Wrong"] = "2";
    ProblemAnswerType["Variant"] = "3";
})(exports.ProblemAnswerType || (exports.ProblemAnswerType = {}));
exports.PathDetectionStrategy = void 0;
(function (PathDetectionStrategy) {
    PathDetectionStrategy["Post"] = "post";
    PathDetectionStrategy["Pre"] = "pre";
    PathDetectionStrategy["Both"] = "both";
})(exports.PathDetectionStrategy || (exports.PathDetectionStrategy = {}));

var _a$1;
var settings = { cdn: 'https://s.shaowq.com' };
var BASE_THEME_CONFIG = {
    positiveNodeColor: '#4d7c0f',
    negativeNodeColor: '#b91c1c',
    neutralNodeColor: '#a16207',
    defaultNodeColor: '#404040',
    warningNodeColor: '#ffdf20',
    shadowColor: '#555555',
    boardLineColor: '#000000',
    activeColor: '#000000',
    inactiveColor: '#666666',
    boardBackgroundColor: '#FFFFFF',
    flatBlackColor: '#000000',
    flatBlackColorAlt: '#000000', // Alternative, temporarily same as main color
    flatWhiteColor: '#FFFFFF',
    flatWhiteColorAlt: '#FFFFFF', // Alternative, temporarily same as main color
    boardEdgeLineWidth: 2,
    boardLineWidth: 1.2,
    boardLineExtent: 0.5,
    starSize: 3,
    markupLineWidth: 2,
    highlightColor: '#ffeb64',
    stoneRatio: 0.45,
};
var MAX_BOARD_SIZE = 29;
var DEFAULT_BOARD_SIZE = 19;
var A1_LETTERS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
];
var A1_LETTERS_WITH_I = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
];
var A1_NUMBERS = [
    19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];
var SGF_LETTERS = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
];
// export const BLANK_ARRAY = chunk(new Array(361).fill(0), 19);
var DOT_SIZE = 3;
var EXPAND_H = 5;
var EXPAND_V = 5;
var RESPONSE_TIME = 100;
var DEFAULT_OPTIONS = {
    boardSize: 19,
    padding: 15,
    extent: 2,
    interactive: false,
    coordinate: true,
    theme: exports.Theme.Flat,
    background: false,
    zoom: false,
    showAnalysis: false,
};
var THEME_RESOURCES = (_a$1 = {},
    _a$1[exports.Theme.BlackAndWhite] = {
        blacks: [],
        whites: [],
    },
    _a$1[exports.Theme.Subdued] = {
        board: "".concat(settings.cdn, "/assets/theme/subdued/board.png"),
        blacks: ["".concat(settings.cdn, "/assets/theme/subdued/black.png")],
        whites: ["".concat(settings.cdn, "/assets/theme/subdued/white.png")],
    },
    _a$1[exports.Theme.ShellStone] = {
        board: "".concat(settings.cdn, "/assets/theme/shell-stone/board.png"),
        blacks: ["".concat(settings.cdn, "/assets/theme/shell-stone/black.png")],
        whites: [
            "".concat(settings.cdn, "/assets/theme/shell-stone/white0.png"),
            "".concat(settings.cdn, "/assets/theme/shell-stone/white1.png"),
            "".concat(settings.cdn, "/assets/theme/shell-stone/white2.png"),
            "".concat(settings.cdn, "/assets/theme/shell-stone/white3.png"),
            "".concat(settings.cdn, "/assets/theme/shell-stone/white4.png"),
        ],
    },
    _a$1[exports.Theme.SlateAndShell] = {
        board: "".concat(settings.cdn, "/assets/theme/slate-and-shell/board.png"),
        blacks: [
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/slate1.png"),
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/slate2.png"),
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/slate3.png"),
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/slate4.png"),
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/slate5.png"),
        ],
        whites: [
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/shell1.png"),
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/shell2.png"),
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/shell3.png"),
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/shell4.png"),
            "".concat(settings.cdn, "/assets/theme/slate-and-shell/shell5.png"),
        ],
    },
    _a$1[exports.Theme.Walnut] = {
        board: "".concat(settings.cdn, "/assets/theme/walnut/board.jpg"),
        blacks: ["".concat(settings.cdn, "/assets/theme/walnut/black.png")],
        whites: ["".concat(settings.cdn, "/assets/theme/walnut/white.png")],
    },
    _a$1[exports.Theme.Photorealistic] = {
        board: "".concat(settings.cdn, "/assets/theme/photorealistic/board.png"),
        blacks: ["".concat(settings.cdn, "/assets/theme/photorealistic/black.png")],
        whites: ["".concat(settings.cdn, "/assets/theme/photorealistic/white.png")],
    },
    _a$1[exports.Theme.Flat] = {
        blacks: [],
        whites: [],
    },
    _a$1[exports.Theme.Warm] = {
        blacks: [],
        whites: [],
    },
    _a$1[exports.Theme.Dark] = {
        blacks: [],
        whites: [],
    },
    _a$1[exports.Theme.YunziMonkeyDark] = {
        board: "".concat(settings.cdn, "/assets/theme/ymd/yunzi-monkey-dark/YMD-Bo-V10_lessborder1920px.png"),
        blacks: [
            "".concat(settings.cdn, "/assets/theme/ymd/yunzi-monkey-dark/YMD-B-v14-338px.png"),
        ],
        whites: [
            "".concat(settings.cdn, "/assets/theme/ymd/yunzi-monkey-dark/YMD-W-v14-338px.png"),
        ],
        lowRes: {
            board: "".concat(settings.cdn, "/assets/theme/ymd/yunzi-monkey-dark/YMD-Bo-V10_lessborder-960px.png"),
            blacks: [
                "".concat(settings.cdn, "/assets/theme/ymd/yunzi-monkey-dark/YMD-B-v14-135px.png"),
            ],
            whites: [
                "".concat(settings.cdn, "/assets/theme/ymd/yunzi-monkey-dark/YMD-W-v14-135px.png"),
            ],
        },
        microRes: {
            board: "".concat(settings.cdn, "/assets/theme/ymd/YMD-Bo-V10_lessborder-960px.png"),
            blacks: ["".concat(settings.cdn, "/assets/theme/ymd/YMD-B_197to59px.png")],
            whites: ["".concat(settings.cdn, "/assets/theme/ymd/YMD-W_197to59px.png")],
        },
    },
    _a$1[exports.Theme.HighContrast] = {
        blacks: [],
        whites: [],
    },
    _a$1);
var LIGHT_GREEN_RGB = 'rgba(136, 170, 60, 1)';
var LIGHT_YELLOW_RGB = 'rgba(206, 210, 83, 1)';
var YELLOW_RGB = 'rgba(242, 217, 60, 1)';
var LIGHT_RED_RGB = 'rgba(236, 146, 73, 1)';

var MOVE_PROP_LIST = [
    'B',
    // KO is standard in move list but usually be used for komi in gameinfo props
    // 'KO',
    'MN',
    'W',
];
var SETUP_PROP_LIST = [
    'AB',
    'AE',
    'AW',
    //TODO: PL is a value of color type
    // 'PL'
];
var NODE_ANNOTATION_PROP_LIST = [
    'A',
    'C',
    'DM',
    'GB',
    'GW',
    'HO',
    'N',
    'UC',
    'V',
];
var MOVE_ANNOTATION_PROP_LIST = [
    'BM',
    'DO',
    'IT',
    // TE is standard in move annotation for tesuji
    // 'TE',
];
var MARKUP_PROP_LIST = [
    'AR',
    'CR',
    'LB',
    'LN',
    'MA',
    'SL',
    'SQ',
    'TR',
];
var ROOT_PROP_LIST = ['AP', 'CA', 'FF', 'GM', 'ST', 'SZ'];
var GAME_INFO_PROP_LIST = [
    //TE Non-standard
    'TE',
    //KO Non-standard
    'KO',
    'AN',
    'BR',
    'BT',
    'CP',
    'DT',
    'EV',
    'GN',
    'GC',
    'ON',
    'OT',
    'PB',
    'PC',
    'PW',
    'RE',
    'RO',
    'RU',
    'SO',
    'TM',
    'US',
    'WR',
    'WT',
];
var TIMING_PROP_LIST = ['BL', 'OB', 'OW', 'WL'];
var MISCELLANEOUS_PROP_LIST = ['FG', 'PM', 'VW'];
var CUSTOM_PROP_LIST = ['PI', 'PAI', 'NID', 'PAT'];
var LIST_OF_POINTS_PROP = ['AB', 'AE', 'AW', 'MA', 'SL', 'SQ', 'TR'];
var TOKEN_REGEX = new RegExp(/([A-Z]*)\[([\s\S]*?)\]/);
var SgfPropBase = /** @class */ (function () {
    function SgfPropBase(token, value) {
        this.type = '-';
        this._value = '';
        this._values = [];
        this.token = token;
        if (typeof value === 'string' || value instanceof String) {
            this.value = value;
        }
        else if (Array.isArray(value)) {
            this.values = value;
        }
    }
    Object.defineProperty(SgfPropBase.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SgfPropBase.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    SgfPropBase.prototype.toString = function () {
        return "".concat(this.token).concat(this._values.map(function (v) { return "[".concat(v, "]"); }).join(''));
    };
    return SgfPropBase;
}());
var MoveProp = /** @class */ (function (_super) {
    tslib.__extends(MoveProp, _super);
    function MoveProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'move';
        return _this;
    }
    MoveProp.from = function (str) {
        var match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
        if (match) {
            var token = match[1];
            var val = match[2];
            return new MoveProp(token, val);
        }
        return new MoveProp('', '');
    };
    Object.defineProperty(MoveProp.prototype, "value", {
        // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MoveProp.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    return MoveProp;
}(SgfPropBase));
var SetupProp = /** @class */ (function (_super) {
    tslib.__extends(SetupProp, _super);
    function SetupProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'setup';
        return _this;
    }
    SetupProp.from = function (str) {
        var tokenMatch = str.match(TOKEN_REGEX);
        var valMatches = str.matchAll(/\[([\s\S]*?)\]/g);
        var token = '';
        var vals = tslib.__spreadArray([], tslib.__read(valMatches), false).map(function (m) { return m[1]; });
        if (tokenMatch)
            token = tokenMatch[1];
        return new SetupProp(token, vals);
    };
    Object.defineProperty(SetupProp.prototype, "value", {
        // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SetupProp.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    return SetupProp;
}(SgfPropBase));
var NodeAnnotationProp = /** @class */ (function (_super) {
    tslib.__extends(NodeAnnotationProp, _super);
    function NodeAnnotationProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'node-annotation';
        return _this;
    }
    NodeAnnotationProp.from = function (str) {
        var match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
        if (match) {
            var token = match[1];
            var val = match[2];
            return new NodeAnnotationProp(token, val);
        }
        return new NodeAnnotationProp('', '');
    };
    Object.defineProperty(NodeAnnotationProp.prototype, "value", {
        // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeAnnotationProp.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    return NodeAnnotationProp;
}(SgfPropBase));
var MoveAnnotationProp = /** @class */ (function (_super) {
    tslib.__extends(MoveAnnotationProp, _super);
    function MoveAnnotationProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'move-annotation';
        return _this;
    }
    MoveAnnotationProp.from = function (str) {
        var match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
        if (match) {
            var token = match[1];
            var val = match[2];
            return new MoveAnnotationProp(token, val);
        }
        return new MoveAnnotationProp('', '');
    };
    Object.defineProperty(MoveAnnotationProp.prototype, "value", {
        // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MoveAnnotationProp.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    return MoveAnnotationProp;
}(SgfPropBase));
var AnnotationProp = /** @class */ (function (_super) {
    tslib.__extends(AnnotationProp, _super);
    function AnnotationProp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnnotationProp;
}(SgfPropBase));
var MarkupProp = /** @class */ (function (_super) {
    tslib.__extends(MarkupProp, _super);
    function MarkupProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'markup';
        return _this;
    }
    MarkupProp.from = function (str) {
        var tokenMatch = str.match(TOKEN_REGEX);
        var valMatches = str.matchAll(/\[([\s\S]*?)\]/g);
        var token = '';
        var vals = tslib.__spreadArray([], tslib.__read(valMatches), false).map(function (m) { return m[1]; });
        if (tokenMatch)
            token = tokenMatch[1];
        return new MarkupProp(token, vals);
    };
    Object.defineProperty(MarkupProp.prototype, "value", {
        // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MarkupProp.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    return MarkupProp;
}(SgfPropBase));
var RootProp = /** @class */ (function (_super) {
    tslib.__extends(RootProp, _super);
    function RootProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'root';
        return _this;
    }
    RootProp.from = function (str) {
        var match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
        if (match) {
            var token = match[1];
            var val = match[2];
            return new RootProp(token, val);
        }
        return new RootProp('', '');
    };
    Object.defineProperty(RootProp.prototype, "value", {
        // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootProp.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    return RootProp;
}(SgfPropBase));
var GameInfoProp = /** @class */ (function (_super) {
    tslib.__extends(GameInfoProp, _super);
    function GameInfoProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'game-info';
        return _this;
    }
    GameInfoProp.from = function (str) {
        var match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
        if (match) {
            var token = match[1];
            var val = match[2];
            return new GameInfoProp(token, val);
        }
        return new GameInfoProp('', '');
    };
    Object.defineProperty(GameInfoProp.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameInfoProp.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    return GameInfoProp;
}(SgfPropBase));
var CustomProp = /** @class */ (function (_super) {
    tslib.__extends(CustomProp, _super);
    function CustomProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'custom';
        return _this;
    }
    CustomProp.from = function (str) {
        var match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
        if (match) {
            var token = match[1];
            var val = match[2];
            return new CustomProp(token, val);
        }
        return new CustomProp('', '');
    };
    Object.defineProperty(CustomProp.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomProp.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    return CustomProp;
}(SgfPropBase));
var TimingProp = /** @class */ (function (_super) {
    tslib.__extends(TimingProp, _super);
    function TimingProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'Timing';
        return _this;
    }
    Object.defineProperty(TimingProp.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            if (LIST_OF_POINTS_PROP.includes(this.token)) {
                this._values = newValue.split(',');
            }
            else {
                this._values = [newValue];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TimingProp.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (newValues) {
            this._values = newValues;
            this._value = newValues.join(',');
        },
        enumerable: false,
        configurable: true
    });
    return TimingProp;
}(SgfPropBase));
var MiscellaneousProp = /** @class */ (function (_super) {
    tslib.__extends(MiscellaneousProp, _super);
    function MiscellaneousProp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MiscellaneousProp;
}(SgfPropBase));

var liberties = 0;
var recursionPath = [];
/**
 * Calculates the size of a matrix.
 * @param mat The matrix to calculate the size of.
 * @returns An array containing the number of rows and columns in the matrix.
 */
var calcSize = function (mat) {
    var rowsSize = mat.length;
    var columnsSize = mat.length > 0 ? mat[0].length : 0;
    return [rowsSize, columnsSize];
};
/**
 * Calculates the liberty of a stone on the board.
 * @param mat - The board matrix.
 * @param x - The x-coordinate of the stone.
 * @param y - The y-coordinate of the stone.
 * @param ki - The value of the stone.
 */
var calcLibertyCore = function (mat, x, y, ki) {
    var size = calcSize(mat);
    if (x >= 0 && x < size[1] && y >= 0 && y < size[0]) {
        if (mat[x][y] === ki && !recursionPath.includes("".concat(x, ",").concat(y))) {
            recursionPath.push("".concat(x, ",").concat(y));
            calcLibertyCore(mat, x - 1, y, ki);
            calcLibertyCore(mat, x + 1, y, ki);
            calcLibertyCore(mat, x, y - 1, ki);
            calcLibertyCore(mat, x, y + 1, ki);
        }
        else if (mat[x][y] === 0) {
            liberties += 1;
        }
    }
};
var calcLiberty = function (mat, x, y, ki) {
    var size = calcSize(mat);
    liberties = 0;
    recursionPath = [];
    if (x < 0 || y < 0 || x > size[1] - 1 || y > size[0] - 1) {
        return {
            liberty: 4,
            recursionPath: [],
        };
    }
    if (mat[x][y] === 0) {
        return {
            liberty: 4,
            recursionPath: [],
        };
    }
    calcLibertyCore(mat, x, y, ki);
    return {
        liberty: liberties,
        recursionPath: recursionPath,
    };
};
var execCapture = function (mat, i, j, ki) {
    var newArray = mat;
    var _a = calcLiberty(mat, i, j - 1, ki), libertyUp = _a.liberty, recursionPathUp = _a.recursionPath;
    var _b = calcLiberty(mat, i, j + 1, ki), libertyDown = _b.liberty, recursionPathDown = _b.recursionPath;
    var _c = calcLiberty(mat, i - 1, j, ki), libertyLeft = _c.liberty, recursionPathLeft = _c.recursionPath;
    var _d = calcLiberty(mat, i + 1, j, ki), libertyRight = _d.liberty, recursionPathRight = _d.recursionPath;
    if (libertyUp === 0) {
        recursionPathUp.forEach(function (item) {
            var coord = item.split(',');
            newArray[parseInt(coord[0])][parseInt(coord[1])] = 0;
        });
    }
    if (libertyDown === 0) {
        recursionPathDown.forEach(function (item) {
            var coord = item.split(',');
            newArray[parseInt(coord[0])][parseInt(coord[1])] = 0;
        });
    }
    if (libertyLeft === 0) {
        recursionPathLeft.forEach(function (item) {
            var coord = item.split(',');
            newArray[parseInt(coord[0])][parseInt(coord[1])] = 0;
        });
    }
    if (libertyRight === 0) {
        recursionPathRight.forEach(function (item) {
            var coord = item.split(',');
            newArray[parseInt(coord[0])][parseInt(coord[1])] = 0;
        });
    }
    return newArray;
};
var canCapture = function (mat, i, j, ki) {
    var _a = calcLiberty(mat, i, j - 1, ki), libertyUp = _a.liberty, recursionPathUp = _a.recursionPath;
    var _b = calcLiberty(mat, i, j + 1, ki), libertyDown = _b.liberty, recursionPathDown = _b.recursionPath;
    var _c = calcLiberty(mat, i - 1, j, ki), libertyLeft = _c.liberty, recursionPathLeft = _c.recursionPath;
    var _d = calcLiberty(mat, i + 1, j, ki), libertyRight = _d.liberty, recursionPathRight = _d.recursionPath;
    if (libertyUp === 0 && recursionPathUp.length > 0) {
        return true;
    }
    if (libertyDown === 0 && recursionPathDown.length > 0) {
        return true;
    }
    if (libertyLeft === 0 && recursionPathLeft.length > 0) {
        return true;
    }
    if (libertyRight === 0 && recursionPathRight.length > 0) {
        return true;
    }
    return false;
};
var canMove = function (mat, i, j, ki) {
    var _a, _b;
    var newArray = lodash.cloneDeep(mat);
    if (i < 0 || j < 0 || i >= mat.length || j >= ((_b = (_a = mat[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0)) {
        return false;
    }
    if (mat[i][j] !== 0) {
        return false;
    }
    newArray[i][j] = ki;
    var liberty = calcLiberty(newArray, i, j, ki).liberty;
    if (canCapture(newArray, i, j, -ki)) {
        return true;
    }
    if (canCapture(newArray, i, j, ki)) {
        return false;
    }
    if (liberty === 0) {
        return false;
    }
    return true;
};

/**
 * Represents an SGF (Smart Game Format) file.
 */
var Sgf = /** @class */ (function () {
    /**
     * Constructs a new instance of the Sgf class.
     * @param content The content of the Sgf, either as a string or as a TNode(Root node).
     * @param parseOptions The options for parsing the Sgf content.
     */
    function Sgf(content, parseOptions) {
        if (parseOptions === void 0) { parseOptions = {
            ignorePropList: [],
        }; }
        this.content = content;
        this.parseOptions = parseOptions;
        this.NEW_NODE = ';';
        this.BRANCHING = ['(', ')'];
        this.PROPERTY = ['[', ']'];
        this.LIST_IDENTITIES = [
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
        this.NODE_DELIMITERS = [this.NEW_NODE].concat(this.BRANCHING);
        this.tree = new TreeModel();
        this.root = null;
        this.node = null;
        this.currentNode = null;
        this.parentNode = null;
        this.nodeProps = new Map();
        if (typeof content === 'string') {
            this.parse(content);
        }
        else if (typeof content === 'object') {
            this.setRoot(content);
        }
    }
    /**
     * Sets the root node of the SGF tree.
     *
     * @param root The root node to set.
     * @returns The updated SGF instance.
     */
    Sgf.prototype.setRoot = function (root) {
        this.root = root;
        return this;
    };
    /**
     * Converts the current SGF tree to an SGF string representation.
     * @returns The SGF string representation of the tree.
     */
    Sgf.prototype.toSgf = function () {
        return "(".concat(this.nodeToString(this.root), ")");
    };
    /**
     * Converts the game tree to SGF format without including analysis data.
     *
     * @returns The SGF representation of the game tree.
     */
    Sgf.prototype.toSgfWithoutAnalysis = function () {
        var sgf = "(".concat(this.nodeToString(this.root), ")");
        return lodash.replace(sgf, /](A\[.*?\])/g, ']');
    };
    /**
     * Parses the given SGF (Smart Game Format) string.
     *
     * @param sgf - The SGF string to parse.
     */
    Sgf.prototype.parse = function (sgf) {
        if (!sgf)
            return;
        sgf = sgf.replace(/\s+(?![^\[\]]*])/gm, '');
        var nodeStart = 0;
        var counter = 0;
        var stack = [];
        var inNodeRanges = buildNodeRanges(sgf).sort(function (a, b) { return a[0] - b[0]; });
        var _loop_1 = function (i) {
            var c = sgf[i];
            var insideProp = isInAnyRange(i, inNodeRanges);
            if (this_1.NODE_DELIMITERS.includes(c) && !insideProp) {
                var content = sgf.slice(nodeStart, i);
                if (content !== '') {
                    var moveProps_1 = [];
                    var setupProps_1 = [];
                    var rootProps_1 = [];
                    var markupProps_1 = [];
                    var gameInfoProps_1 = [];
                    var nodeAnnotationProps_1 = [];
                    var moveAnnotationProps_1 = [];
                    var customProps_1 = [];
                    var matches = tslib.__spreadArray([], tslib.__read(content.matchAll(
                    // RegExp(/([A-Z]+\[[a-z\[\]]*\]+)/, 'g')
                    // RegExp(/([A-Z]+\[.*?\]+)/, 'g')
                    // RegExp(/[A-Z]+(\[.*?\]){1,}/, 'g')
                    // RegExp(/[A-Z]+(\[[\s\S]*?\]){1,}/, 'g'),
                    RegExp(/\w+(\[[^\]]*?\](?:\r?\n?\s[^\]]*?)*){1,}/, 'g'))), false);
                    matches.forEach(function (m) {
                        var tokenMatch = m[0].match(/([A-Z]+)\[/);
                        if (tokenMatch) {
                            var token = tokenMatch[1];
                            if (MOVE_PROP_LIST.includes(token)) {
                                moveProps_1.push(MoveProp.from(m[0]));
                            }
                            if (SETUP_PROP_LIST.includes(token)) {
                                setupProps_1.push(SetupProp.from(m[0]));
                            }
                            if (ROOT_PROP_LIST.includes(token)) {
                                rootProps_1.push(RootProp.from(m[0]));
                            }
                            if (MARKUP_PROP_LIST.includes(token)) {
                                markupProps_1.push(MarkupProp.from(m[0]));
                            }
                            if (GAME_INFO_PROP_LIST.includes(token)) {
                                gameInfoProps_1.push(GameInfoProp.from(m[0]));
                            }
                            if (NODE_ANNOTATION_PROP_LIST.includes(token)) {
                                nodeAnnotationProps_1.push(NodeAnnotationProp.from(m[0]));
                            }
                            if (MOVE_ANNOTATION_PROP_LIST.includes(token)) {
                                moveAnnotationProps_1.push(MoveAnnotationProp.from(m[0]));
                            }
                            if (CUSTOM_PROP_LIST.includes(token)) {
                                customProps_1.push(CustomProp.from(m[0]));
                            }
                        }
                    });
                    if (matches.length > 0) {
                        var hash = calcHash(this_1.currentNode, moveProps_1);
                        var node = this_1.tree.parse({
                            id: hash,
                            name: hash,
                            index: counter,
                            number: 0,
                            moveProps: moveProps_1,
                            setupProps: setupProps_1,
                            rootProps: rootProps_1,
                            markupProps: markupProps_1,
                            gameInfoProps: gameInfoProps_1,
                            nodeAnnotationProps: nodeAnnotationProps_1,
                            moveAnnotationProps: moveAnnotationProps_1,
                            customProps: customProps_1,
                        });
                        if (this_1.currentNode) {
                            this_1.currentNode.addChild(node);
                            node.model.number = getNodeNumber(node);
                        }
                        else {
                            this_1.root = node;
                            this_1.parentNode = node;
                        }
                        this_1.currentNode = node;
                        counter += 1;
                    }
                }
            }
            if (c === '(' && this_1.currentNode && !insideProp) {
                // console.log(`${sgf[i]}${sgf[i + 1]}${sgf[i + 2]}`);
                stack.push(this_1.currentNode);
            }
            if (c === ')' && !insideProp && stack.length > 0) {
                var node = stack.pop();
                if (node) {
                    this_1.currentNode = node;
                }
            }
            if (this_1.NODE_DELIMITERS.includes(c) && !insideProp) {
                nodeStart = i;
            }
        };
        var this_1 = this;
        for (var i = 0; i < sgf.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * Converts a node to a string representation.
     *
     * @param node - The node to convert.
     * @returns The string representation of the node.
     */
    Sgf.prototype.nodeToString = function (node) {
        var _this = this;
        var content = '';
        node.walk(function (n) {
            var _a = n.model, rootProps = _a.rootProps, moveProps = _a.moveProps, customProps = _a.customProps, setupProps = _a.setupProps, markupProps = _a.markupProps, nodeAnnotationProps = _a.nodeAnnotationProps, moveAnnotationProps = _a.moveAnnotationProps, gameInfoProps = _a.gameInfoProps;
            var nodes = lodash.compact(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray([], tslib.__read(rootProps), false), tslib.__read(customProps), false), tslib.__read(moveProps), false), tslib.__read(getDeduplicatedProps(setupProps)), false), tslib.__read(getDeduplicatedProps(markupProps)), false), tslib.__read(gameInfoProps), false), tslib.__read(nodeAnnotationProps), false), tslib.__read(moveAnnotationProps), false));
            content += ';';
            nodes.forEach(function (n) {
                content += n.toString();
            });
            if (n.children.length > 1) {
                n.children.forEach(function (child) {
                    content += "(".concat(_this.nodeToString(child), ")");
                });
            }
            return n.children.length < 2;
        });
        return content;
    };
    return Sgf;
}());

require('spark-md5');
var calcDoubtfulMovesThresholdRange = function (threshold) {
    // 8D-9D
    if (threshold >= 25) {
        return {
            evil: { winrateRange: [-1, -0.15], scoreRange: [-100, -3] },
            bad: { winrateRange: [-0.15, -0.1], scoreRange: [-3, -2] },
            poor: { winrateRange: [-0.1, -0.05], scoreRange: [-2, -1] },
            ok: { winrateRange: [-0.05, -0.02], scoreRange: [-1, -0.5] },
            good: { winrateRange: [-0.02, 0], scoreRange: [0, 100] },
            great: { winrateRange: [0, 1], scoreRange: [0, 100] },
        };
    }
    // 5D-7D
    if (threshold >= 23 && threshold < 25) {
        return {
            evil: { winrateRange: [-1, -0.2], scoreRange: [-100, -8] },
            bad: { winrateRange: [-0.2, -0.15], scoreRange: [-8, -4] },
            poor: { winrateRange: [-0.15, -0.05], scoreRange: [-4, -2] },
            ok: { winrateRange: [-0.05, -0.02], scoreRange: [-2, -1] },
            good: { winrateRange: [-0.02, 0], scoreRange: [0, 100] },
            great: { winrateRange: [0, 1], scoreRange: [0, 100] },
        };
    }
    // 3D-5D
    if (threshold >= 20 && threshold < 23) {
        return {
            evil: { winrateRange: [-1, -0.25], scoreRange: [-100, -12] },
            bad: { winrateRange: [-0.25, -0.1], scoreRange: [-12, -5] },
            poor: { winrateRange: [-0.1, -0.05], scoreRange: [-5, -2] },
            ok: { winrateRange: [-0.05, -0.02], scoreRange: [-2, -1] },
            good: { winrateRange: [-0.02, 0], scoreRange: [0, 100] },
            great: { winrateRange: [0, 1], scoreRange: [0, 100] },
        };
    }
    // 1D-3D
    if (threshold >= 18 && threshold < 20) {
        return {
            evil: { winrateRange: [-1, -0.3], scoreRange: [-100, -15] },
            bad: { winrateRange: [-0.3, -0.1], scoreRange: [-15, -7] },
            poor: { winrateRange: [-0.1, -0.05], scoreRange: [-7, -5] },
            ok: { winrateRange: [-0.05, -0.02], scoreRange: [-5, -1] },
            good: { winrateRange: [-0.02, 0], scoreRange: [0, 100] },
            great: { winrateRange: [0, 1], scoreRange: [0, 100] },
        };
    }
    // 5K-1K
    if (threshold >= 13 && threshold < 18) {
        return {
            evil: { winrateRange: [-1, -0.35], scoreRange: [-100, -20] },
            bad: { winrateRange: [-0.35, -0.12], scoreRange: [-20, -10] },
            poor: { winrateRange: [-0.12, -0.08], scoreRange: [-10, -5] },
            ok: { winrateRange: [-0.08, -0.02], scoreRange: [-5, -1] },
            good: { winrateRange: [-0.02, 0], scoreRange: [0, 100] },
            great: { winrateRange: [0, 1], scoreRange: [0, 100] },
        };
    }
    // 5K-10K
    if (threshold >= 8 && threshold < 13) {
        return {
            evil: { winrateRange: [-1, -0.4], scoreRange: [-100, -25] },
            bad: { winrateRange: [-0.4, -0.15], scoreRange: [-25, -10] },
            poor: { winrateRange: [-0.15, -0.1], scoreRange: [-10, -5] },
            ok: { winrateRange: [-0.1, -0.02], scoreRange: [-5, -1] },
            good: { winrateRange: [-0.02, 0], scoreRange: [0, 100] },
            great: { winrateRange: [0, 1], scoreRange: [0, 100] },
        };
    }
    // 18K-10K
    if (threshold >= 0 && threshold < 8) {
        return {
            evil: { winrateRange: [-1, -0.45], scoreRange: [-100, -35] },
            bad: { winrateRange: [-0.45, -0.2], scoreRange: [-35, -20] },
            poor: { winrateRange: [-0.2, -0.1], scoreRange: [-20, -10] },
            ok: { winrateRange: [-0.1, -0.02], scoreRange: [-10, -1] },
            good: { winrateRange: [-0.02, 0], scoreRange: [0, 100] },
            great: { winrateRange: [0, 1], scoreRange: [0, 100] },
        };
    }
    return {
        evil: { winrateRange: [-1, -0.3], scoreRange: [-100, -30] },
        bad: { winrateRange: [-0.3, -0.2], scoreRange: [-30, -20] },
        poor: { winrateRange: [-0.2, -0.1], scoreRange: [-20, -10] },
        ok: { winrateRange: [-0.1, -0.02], scoreRange: [-10, -1] },
        good: { winrateRange: [-0.02, 0], scoreRange: [0, 100] },
        great: { winrateRange: [0, 1], scoreRange: [0, 100] },
    };
};
var round2 = function (v, scale, fixed) {
    if (scale === void 0) { scale = 1; }
    if (fixed === void 0) { fixed = 2; }
    return ((Math.round(v * 100) / 100) * scale).toFixed(fixed);
};
var round3 = function (v, scale, fixed) {
    if (scale === void 0) { scale = 1; }
    if (fixed === void 0) { fixed = 3; }
    return ((Math.round(v * 1000) / 1000) * scale).toFixed(fixed);
};
var isAnswerNode = function (n, kind) {
    var _a;
    var pat = (_a = n.model.customProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'PAT'; });
    return (pat === null || pat === void 0 ? void 0 : pat.value) === kind;
};
var isChoiceNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return !!(c === null || c === void 0 ? void 0 : c.value.includes('CHOICE'));
};
var isTargetNode = isChoiceNode;
var isForceNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return c === null || c === void 0 ? void 0 : c.value.includes('FORCE');
};
var isPreventMoveNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return c === null || c === void 0 ? void 0 : c.value.includes('NOTTHIS');
};
// export const isRightLeaf = (n: TNode) => {
//   return isRightNode(n) && !n.hasChildren();
// };
var isRightNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return !!(c === null || c === void 0 ? void 0 : c.value.includes('RIGHT'));
};
// export const isFirstRightLeaf = (n: TNode) => {
//   const root = n.getPath()[0];
//   const firstRightLeave = root.first((n: TNode) =>
//     isRightLeaf(n)
//   );
//   return firstRightLeave?.model.id === n.model.id;
// };
var isFirstRightNode = function (n) {
    var root = n.getPath()[0];
    var firstRightNode = root.first(function (n) { return isRightNode(n); });
    return (firstRightNode === null || firstRightNode === void 0 ? void 0 : firstRightNode.model.id) === n.model.id;
};
var isVariantNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return !!(c === null || c === void 0 ? void 0 : c.value.includes('VARIANT'));
};
// export const isVariantLeaf = (n: TNode) => {
//   return isVariantNode(n) && !n.hasChildren();
// };
var isWrongNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return (!(c === null || c === void 0 ? void 0 : c.value.includes('VARIANT')) && !(c === null || c === void 0 ? void 0 : c.value.includes('RIGHT'))) || !c;
};
// export const isWrongLeaf = (n: TNode) => {
//   return isWrongNode(n) && !n.hasChildren();
// };
var inPath = function (node, detectionMethod, strategy, preNodes, postNodes) {
    var _a;
    if (strategy === void 0) { strategy = exports.PathDetectionStrategy.Post; }
    var path = preNodes !== null && preNodes !== void 0 ? preNodes : node.getPath();
    var postRightNodes = (_a = postNodes === null || postNodes === void 0 ? void 0 : postNodes.filter(function (n) { return detectionMethod(n); })) !== null && _a !== void 0 ? _a : node.all(function (n) { return detectionMethod(n); });
    var preRightNodes = path.filter(function (n) { return detectionMethod(n); });
    switch (strategy) {
        case exports.PathDetectionStrategy.Post:
            return postRightNodes.length > 0;
        case exports.PathDetectionStrategy.Pre:
            return preRightNodes.length > 0;
        case exports.PathDetectionStrategy.Both:
            return preRightNodes.length > 0 || postRightNodes.length > 0;
        default:
            return false;
    }
};
var inRightPath = function (node, strategy, preNodes, postNodes) {
    if (strategy === void 0) { strategy = exports.PathDetectionStrategy.Post; }
    return inPath(node, isRightNode, strategy, preNodes, postNodes);
};
var inFirstRightPath = function (node, strategy, preNodes, postNodes) {
    if (strategy === void 0) { strategy = exports.PathDetectionStrategy.Post; }
    return inPath(node, isFirstRightNode, strategy, preNodes, postNodes);
};
var inFirstBranchRightPath = function (node, strategy, preNodes, postNodes) {
    if (strategy === void 0) { strategy = exports.PathDetectionStrategy.Pre; }
    if (!inRightPath(node))
        return false;
    var path = preNodes !== null && preNodes !== void 0 ? preNodes : node.getPath();
    var postRightNodes = postNodes !== null && postNodes !== void 0 ? postNodes : node.all(function () { return true; });
    var result = [];
    switch (strategy) {
        case exports.PathDetectionStrategy.Post:
            result = postRightNodes.filter(function (n) { return n.getIndex() > 0; });
            break;
        case exports.PathDetectionStrategy.Pre:
            result = path.filter(function (n) { return n.getIndex() > 0; });
            break;
        case exports.PathDetectionStrategy.Both:
            result = path.concat(postRightNodes).filter(function (n) { return n.getIndex() > 0; });
            break;
    }
    return result.length === 0;
};
var inChoicePath = function (node, strategy, preNodes, postNodes) {
    if (strategy === void 0) { strategy = exports.PathDetectionStrategy.Post; }
    return inPath(node, isChoiceNode, strategy, preNodes, postNodes);
};
var inTargetPath = inChoicePath;
var inVariantPath = function (node, strategy, preNodes, postNodes) {
    if (strategy === void 0) { strategy = exports.PathDetectionStrategy.Post; }
    return inPath(node, isVariantNode, strategy, preNodes, postNodes);
};
var inWrongPath = function (node, strategy, preNodes, postNodes) {
    if (strategy === void 0) { strategy = exports.PathDetectionStrategy.Post; }
    return inPath(node, isWrongNode, strategy, preNodes, postNodes);
};
var nFormatter = function (num, fixed) {
    if (fixed === void 0) { fixed = 1; }
    var lookup = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
        return num >= item.value;
    });
    return item
        ? (num / item.value).toFixed(fixed).replace(rx, '$1') + item.symbol
        : '0';
};
var pathToIndexes = function (path) {
    return path.map(function (n) { return n.model.id; });
};
var pathToInitialStones = function (path, xOffset, yOffset) {
    if (xOffset === void 0) { xOffset = 0; }
    if (yOffset === void 0) { yOffset = 0; }
    var inits = path
        .filter(function (n) { return n.model.setupProps.length > 0; })
        .map(function (n) {
        return n.model.setupProps.map(function (setup) {
            return setup.values.map(function (v) {
                var a = A1_LETTERS[SGF_LETTERS.indexOf(v[0]) + xOffset];
                var b = A1_NUMBERS[SGF_LETTERS.indexOf(v[1]) + yOffset];
                var token = setup.token === 'AB' ? 'B' : 'W';
                return [token, a + b];
            });
        });
    });
    return lodash.flattenDepth(inits[0], 1);
};
var pathToAiMoves = function (path, xOffset, yOffset) {
    if (xOffset === void 0) { xOffset = 0; }
    if (yOffset === void 0) { yOffset = 0; }
    var moves = path
        .filter(function (n) { return n.model.moveProps.length > 0; })
        .map(function (n) {
        var prop = n.model.moveProps[0];
        var a = A1_LETTERS[SGF_LETTERS.indexOf(prop.value[0]) + xOffset];
        var b = A1_NUMBERS[SGF_LETTERS.indexOf(prop.value[1]) + yOffset];
        return [prop.token, a + b];
    });
    return moves;
};
var getIndexFromAnalysis = function (a) {
    if (/indexes/.test(a.id)) {
        return JSON.parse(a.id).indexes[0];
    }
    return '';
};
var isMainPath = function (node) {
    return lodash.sum(node.getPath().map(function (n) { return n.getIndex(); })) === 0;
};
var sgfToPos = function (str) {
    var ki = str[0] === 'B' ? 1 : -1;
    var tempStr = /\[(.*)\]/.exec(str);
    if (tempStr) {
        var pos = tempStr[1];
        var x = SGF_LETTERS.indexOf(pos[0]);
        var y = SGF_LETTERS.indexOf(pos[1]);
        return { x: x, y: y, ki: ki };
    }
    return { x: -1, y: -1, ki: 0 };
};
var sgfToA1 = function (str) {
    var _a = sgfToPos(str), x = _a.x, y = _a.y;
    return A1_LETTERS[x] + A1_NUMBERS[y];
};
var a1ToPos = function (move) {
    var x = A1_LETTERS.indexOf(move[0]);
    var y = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0));
    return { x: x, y: y };
};
var a1ToIndex = function (move, boardSize) {
    if (boardSize === void 0) { boardSize = 19; }
    var x = A1_LETTERS.indexOf(move[0]);
    var y = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0));
    return x * boardSize + y;
};
var sgfOffset = function (sgf, offset) {
    if (offset === void 0) { offset = 0; }
    if (offset === 0)
        return sgf;
    var res = lodash.clone(sgf);
    var charIndex = SGF_LETTERS.indexOf(sgf[2]) - offset;
    return res.substr(0, 2) + SGF_LETTERS[charIndex] + res.substr(2 + 1);
};
var a1ToSGF = function (str, type, offsetX, offsetY) {
    if (type === void 0) { type = 'B'; }
    if (offsetX === void 0) { offsetX = 0; }
    if (offsetY === void 0) { offsetY = 0; }
    if (str === 'pass')
        return "".concat(type, "[]");
    var inx = A1_LETTERS.indexOf(str[0]) + offsetX;
    var iny = A1_NUMBERS.indexOf(parseInt(str.substr(1), 0)) + offsetY;
    var sgf = "".concat(type, "[").concat(SGF_LETTERS[inx]).concat(SGF_LETTERS[iny], "]");
    return sgf;
};
var posToSgf = function (x, y, ki) {
    var ax = SGF_LETTERS[x];
    var ay = SGF_LETTERS[y];
    if (ki === exports.Ki.Empty)
        return '';
    if (ki === exports.Ki.White)
        return "B[".concat(ax).concat(ay, "]");
    if (ki === exports.Ki.Black)
        return "W[".concat(ax).concat(ay, "]");
    return '';
};
var matToPosition = function (mat, xOffset, yOffset) {
    var result = '';
    xOffset = xOffset !== null && xOffset !== void 0 ? xOffset : 0;
    yOffset = yOffset !== null && yOffset !== void 0 ? yOffset : DEFAULT_BOARD_SIZE - mat.length;
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[i].length; j++) {
            var value = mat[i][j];
            if (value !== 0) {
                var x = A1_LETTERS[i + xOffset];
                var y = A1_NUMBERS[j + yOffset];
                var color = value === 1 ? 'b' : 'w';
                result += "".concat(color, " ").concat(x).concat(y, " ");
            }
        }
    }
    return result;
};
var matToListOfTuples = function (mat, xOffset, yOffset) {
    if (xOffset === void 0) { xOffset = 0; }
    if (yOffset === void 0) { yOffset = 0; }
    var results = [];
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[i].length; j++) {
            var value = mat[i][j];
            if (value !== 0) {
                var x = A1_LETTERS[i + xOffset];
                var y = A1_NUMBERS[j + yOffset];
                var color = value === 1 ? 'B' : 'W';
                results.push([color, x + y]);
            }
        }
    }
    return results;
};
var convertStoneTypeToString = function (type) { return (type === 1 ? 'B' : 'W'); };
var convertStepsForAI = function (steps, offset) {
    if (offset === void 0) { offset = 0; }
    var res = lodash.clone(steps);
    res = res.map(function (s) { return sgfOffset(s, offset); });
    var header = "(;FF[4]GM[1]SZ[".concat(19 - offset, "]GN[226]PB[Black]HA[0]PW[White]KM[7.5]DT[2017-08-01]TM[1800]RU[Chinese]CP[Copyright ghost-go.com]AP[ghost-go.com]PL[Black];");
    var count = 0;
    var prev = '';
    steps.forEach(function (step, index) {
        if (step[0] === prev[0]) {
            if (step[0] === 'B') {
                res.splice(index + count, 0, 'W[tt]');
                count += 1;
            }
            else {
                res.splice(index + count, 0, 'B[tt]');
                count += 1;
            }
        }
        prev = step;
    });
    return "".concat(header).concat(res.join(';'), ")");
};
var offsetA1Move = function (move, ox, oy) {
    if (ox === void 0) { ox = 0; }
    if (oy === void 0) { oy = 0; }
    if (move === 'pass')
        return move;
    // console.log('oxy', ox, oy);
    var inx = A1_LETTERS.indexOf(move[0]) + ox;
    var iny = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0)) + oy;
    // console.log('inxy', inx, iny, `${A1_LETTERS[inx]}${A1_NUMBERS[iny]}`);
    return "".concat(A1_LETTERS[inx]).concat(A1_NUMBERS[iny]);
};
var reverseOffsetA1Move = function (move, mat, analysis, boardSize) {
    if (boardSize === void 0) { boardSize = 19; }
    if (move === 'pass')
        return move;
    var idObj = JSON.parse(analysis.id);
    var _a = reverseOffset(mat, idObj.bx, idObj.by, boardSize), x = _a.x, y = _a.y;
    var inx = A1_LETTERS.indexOf(move[0]) + x;
    var iny = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0)) + y;
    return "".concat(A1_LETTERS[inx]).concat(A1_NUMBERS[iny]);
};
var calcScoreDiffText = function (rootInfo, currInfo, fixed, reverse) {
    if (fixed === void 0) { fixed = 1; }
    if (reverse === void 0) { reverse = false; }
    if (!rootInfo || !currInfo)
        return '';
    var score = calcScoreDiff(rootInfo, currInfo);
    if (reverse)
        score = -score;
    var fixedScore = score.toFixed(fixed);
    return score > 0 ? "+".concat(fixedScore) : "".concat(fixedScore);
};
var calcWinrateDiffText = function (rootInfo, currInfo, fixed, reverse) {
    if (fixed === void 0) { fixed = 1; }
    if (reverse === void 0) { reverse = false; }
    if (!rootInfo || !currInfo)
        return '';
    var winrate = calcWinrateDiff(rootInfo, currInfo);
    if (reverse)
        winrate = -winrate;
    var fixedWinrate = winrate.toFixed(fixed);
    return winrate >= 0 ? "+".concat(fixedWinrate, "%") : "".concat(fixedWinrate, "%");
};
var calcScoreDiff = function (rootInfo, currInfo) {
    var sign = rootInfo.currentPlayer === 'B' ? 1 : -1;
    var score = Math.round((currInfo.scoreLead - rootInfo.scoreLead) * sign * 1000) / 1000;
    return score;
};
var calcWinrateDiff = function (rootInfo, currInfo) {
    var sign = rootInfo.currentPlayer === 'B' ? 1 : -1;
    var score = Math.round((currInfo.winrate - rootInfo.winrate) * sign * 1000 * 100) /
        1000;
    return score;
};
var calcAnalysisPointColor = function (rootInfo, moveInfo) {
    var prior = moveInfo.prior, order = moveInfo.order;
    var score = calcScoreDiff(rootInfo, moveInfo);
    var pointColor = 'rgba(255, 255, 255, 0.5)';
    if (prior >= 0.5 ||
        (prior >= 0.1 && order < 3 && score > -0.3) ||
        order === 0 ||
        score >= 0) {
        pointColor = LIGHT_GREEN_RGB;
    }
    else if ((prior > 0.05 && score > -0.5) || (prior > 0.01 && score > -0.1)) {
        pointColor = LIGHT_YELLOW_RGB;
    }
    else if (prior > 0.01 && score > -1) {
        pointColor = YELLOW_RGB;
    }
    else {
        pointColor = LIGHT_RED_RGB;
    }
    return pointColor;
};
// export const GoBanDetection = (pixelData, canvas) => {
// const columns = canvas.width;
// const rows = canvas.height;
// const dataType = JsFeat.U8C1_t;
// const distMatrixT = new JsFeat.matrix_t(columns, rows, dataType);
// JsFeat.imgproc.grayscale(pixelData, columns, rows, distMatrixT);
// JsFeat.imgproc.gaussian_blur(distMatrixT, distMatrixT, 2, 0);
// JsFeat.imgproc.canny(distMatrixT, distMatrixT, 50, 50);
// const newPixelData = new Uint32Array(pixelData.buffer);
// const alpha = (0xff << 24);
// let i = distMatrixT.cols * distMatrixT.rows;
// let pix = 0;
// while (i >= 0) {
//   pix = distMatrixT.data[i];
//   newPixelData[i] = alpha | (pix << 16) | (pix << 8) | pix;
//   i -= 1;
// }
// };
var extractPAI = function (n) {
    var pai = n.model.customProps.find(function (p) { return p.token === 'PAI'; });
    if (!pai)
        return;
    var data = JSON.parse(pai.value);
    return data;
};
var extractAnswerType = function (n) {
    var pat = n.model.customProps.find(function (p) { return p.token === 'PAT'; });
    return pat === null || pat === void 0 ? void 0 : pat.value;
};
var extractPI = function (n) {
    var pi = n.model.customProps.find(function (p) { return p.token === 'PI'; });
    if (!pi)
        return;
    var data = JSON.parse(pi.value);
    return data;
};
var initNodeData = function (sha, number) {
    return {
        id: sha,
        name: sha,
        number: number || 0,
        rootProps: [],
        moveProps: [],
        setupProps: [],
        markupProps: [],
        gameInfoProps: [],
        nodeAnnotationProps: [],
        moveAnnotationProps: [],
        customProps: [],
    };
};
/**
 * Creates the initial root node of the tree.
 *
 * @param rootProps - The root properties.
 * @returns The initial root node.
 */
var initialRootNode = function (rootProps) {
    if (rootProps === void 0) { rootProps = [
        'FF[4]',
        'GM[1]',
        'CA[UTF-8]',
        'AP[ghostgo:0.1.0]',
        'SZ[19]',
        'ST[0]',
    ]; }
    var tree = new TreeModel();
    var root = tree.parse({
        // '1b16b1' is the SHA256 hash of the 'n'
        id: '',
        name: '',
        index: 0,
        number: 0,
        rootProps: rootProps.map(function (p) { return RootProp.from(p); }),
        moveProps: [],
        setupProps: [],
        markupProps: [],
        gameInfoProps: [],
        nodeAnnotationProps: [],
        moveAnnotationProps: [],
        customProps: [],
    });
    var hash = calcHash(root);
    root.model.id = hash;
    return root;
};
/**
 * Builds a new tree node with the given move, parent node, and additional properties.
 *
 * @param move - The move to be added to the node.
 * @param parentNode - The parent node of the new node. Optional.
 * @param props - Additional properties to be added to the new node. Optional.
 * @returns The newly created tree node.
 */
var buildMoveNode = function (move, parentNode, props) {
    var tree = new TreeModel();
    var moveProp = MoveProp.from(move);
    var hash = calcHash(parentNode, [moveProp]);
    var number = 1;
    if (parentNode)
        number = getNodeNumber(parentNode) + 1;
    var nodeData = initNodeData(hash, number);
    nodeData.moveProps = [moveProp];
    var node = tree.parse(tslib.__assign(tslib.__assign({}, nodeData), props));
    return node;
};
var getLastIndex = function (root) {
    var lastNode = root;
    root.walk(function (node) {
        // Halt the traversal by returning false
        lastNode = node;
        return true;
    });
    return lastNode.model.index;
};
var cutMoveNodes = function (root, returnRoot) {
    var node = lodash.cloneDeep(root);
    while (node && node.hasChildren() && node.model.moveProps.length === 0) {
        node = node.children[0];
        node.children = [];
    }
    if (returnRoot) {
        while (node && node.parent && !node.isRoot()) {
            node = node.parent;
        }
    }
    return node;
};
var getRoot = function (node) {
    var root = node;
    while (root && root.parent && !root.isRoot()) {
        root = root.parent;
    }
    return root;
};
var zeros = function (size) {
    return new Array(size[0]).fill(0).map(function () { return new Array(size[1]).fill(0); });
};
var empty = function (size) {
    return new Array(size[0]).fill('').map(function () { return new Array(size[1]).fill(''); });
};
var calcMost = function (mat, boardSize) {
    if (boardSize === void 0) { boardSize = 19; }
    var leftMost = boardSize - 1;
    var rightMost = 0;
    var topMost = boardSize - 1;
    var bottomMost = 0;
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[i].length; j++) {
            var value = mat[i][j];
            if (value !== 0) {
                if (leftMost > i)
                    leftMost = i;
                if (rightMost < i)
                    rightMost = i;
                if (topMost > j)
                    topMost = j;
                if (bottomMost < j)
                    bottomMost = j;
            }
        }
    }
    return { leftMost: leftMost, rightMost: rightMost, topMost: topMost, bottomMost: bottomMost };
};
var calcCenter = function (mat, boardSize) {
    if (boardSize === void 0) { boardSize = 19; }
    var _a = calcMost(mat, boardSize), leftMost = _a.leftMost, rightMost = _a.rightMost, topMost = _a.topMost, bottomMost = _a.bottomMost;
    var top = topMost < boardSize - 1 - bottomMost;
    var left = leftMost < boardSize - 1 - rightMost;
    if (top && left)
        return exports.Center.TopLeft;
    if (!top && left)
        return exports.Center.BottomLeft;
    if (top && !left)
        return exports.Center.TopRight;
    if (!top && !left)
        return exports.Center.BottomRight;
    return exports.Center.Center;
};
var calcBoardSize = function (mat, boardSize, extent) {
    if (boardSize === void 0) { boardSize = 19; }
    if (extent === void 0) { extent = 2; }
    var result = [19, 19];
    var center = calcCenter(mat);
    var _a = calcMost(mat, boardSize), leftMost = _a.leftMost, rightMost = _a.rightMost, topMost = _a.topMost, bottomMost = _a.bottomMost;
    if (center === exports.Center.TopLeft) {
        result[0] = rightMost + extent + 1;
        result[1] = bottomMost + extent + 1;
    }
    if (center === exports.Center.TopRight) {
        result[0] = boardSize - leftMost + extent;
        result[1] = bottomMost + extent + 1;
    }
    if (center === exports.Center.BottomLeft) {
        result[0] = rightMost + extent + 1;
        result[1] = boardSize - topMost + extent;
    }
    if (center === exports.Center.BottomRight) {
        result[0] = boardSize - leftMost + extent;
        result[1] = boardSize - topMost + extent;
    }
    result[0] = Math.min(result[0], boardSize);
    result[1] = Math.min(result[1], boardSize);
    return result;
};
var calcPartialArea = function (mat, extent, boardSize) {
    if (extent === void 0) { extent = 2; }
    if (boardSize === void 0) { boardSize = 19; }
    var _a = calcMost(mat), leftMost = _a.leftMost, rightMost = _a.rightMost, topMost = _a.topMost, bottomMost = _a.bottomMost;
    var size = boardSize - 1;
    var x1 = leftMost - extent < 0 ? 0 : leftMost - extent;
    var y1 = topMost - extent < 0 ? 0 : topMost - extent;
    var x2 = rightMost + extent > size ? size : rightMost + extent;
    var y2 = bottomMost + extent > size ? size : bottomMost + extent;
    return [
        [x1, y1],
        [x2, y2],
    ];
};
var calcAvoidMovesForPartialAnalysis = function (partialArea, boardSize) {
    var e_1, _a, e_2, _b;
    if (boardSize === void 0) { boardSize = 19; }
    var result = [];
    var _c = tslib.__read(partialArea, 2), _d = tslib.__read(_c[0], 2), x1 = _d[0], y1 = _d[1], _e = tslib.__read(_c[1], 2), x2 = _e[0], y2 = _e[1];
    try {
        for (var _f = tslib.__values(A1_LETTERS.slice(0, boardSize)), _g = _f.next(); !_g.done; _g = _f.next()) {
            var col = _g.value;
            try {
                for (var _h = (e_2 = void 0, tslib.__values(A1_NUMBERS.slice(-boardSize))), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var row = _j.value;
                    var x = A1_LETTERS.indexOf(col);
                    var y = A1_NUMBERS.indexOf(row);
                    if (x < x1 || x > x2 || y < y1 || y > y2) {
                        result.push("".concat(col).concat(row));
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
};
var calcTsumegoFrame = function (mat, extent, boardSize, komi, turn, ko) {
    if (boardSize === void 0) { boardSize = 19; }
    if (komi === void 0) { komi = 7.5; }
    if (turn === void 0) { turn = exports.Ki.Black; }
    var result = lodash.cloneDeep(mat);
    var partialArea = calcPartialArea(mat, extent, boardSize);
    var center = calcCenter(mat);
    var putBorder = function (mat) {
        var _a = tslib.__read(partialArea[0], 2), x1 = _a[0], y1 = _a[1];
        var _b = tslib.__read(partialArea[1], 2), x2 = _b[0], y2 = _b[1];
        for (var i = x1; i <= x2; i++) {
            for (var j = y1; j <= y2; j++) {
                if (center === exports.Center.TopLeft &&
                    ((i === x2 && i < boardSize - 1) ||
                        (j === y2 && j < boardSize - 1) ||
                        (i === x1 && i > 0) ||
                        (j === y1 && j > 0))) {
                    mat[i][j] = turn;
                }
                else if (center === exports.Center.TopRight &&
                    ((i === x1 && i > 0) ||
                        (j === y2 && j < boardSize - 1) ||
                        (i === x2 && i < boardSize - 1) ||
                        (j === y1 && j > 0))) {
                    mat[i][j] = turn;
                }
                else if (center === exports.Center.BottomLeft &&
                    ((i === x2 && i < boardSize - 1) ||
                        (j === y1 && j > 0) ||
                        (i === x1 && i > 0) ||
                        (j === y2 && j < boardSize - 1))) {
                    mat[i][j] = turn;
                }
                else if (center === exports.Center.BottomRight &&
                    ((i === x1 && i > 0) ||
                        (j === y1 && j > 0) ||
                        (i === x2 && i < boardSize - 1) ||
                        (j === y2 && j < boardSize - 1))) {
                    mat[i][j] = turn;
                }
                else if (center === exports.Center.Center) {
                    mat[i][j] = turn;
                }
            }
        }
    };
    var putOutside = function (mat) {
        var offenceToWin = 10;
        var offenseKomi = turn * komi;
        var _a = tslib.__read(partialArea[0], 2), x1 = _a[0], y1 = _a[1];
        var _b = tslib.__read(partialArea[1], 2), x2 = _b[0], y2 = _b[1];
        // TODO: Hard code for now
        // const blackToAttack = turn === Ki.Black;
        var blackToAttack = turn === exports.Ki.Black;
        var isize = x2 - x1;
        var jsize = y2 - y1;
        // TODO: 361 is hardcoded
        // const defenseArea = Math.floor(
        //   (361 - isize * jsize - offenseKomi - offenceToWin) / 2
        // );
        var defenseArea = Math.floor((361 - isize * jsize) / 2) - offenseKomi - offenceToWin;
        // const defenseArea = 30;
        // outside the frame
        var count = 0;
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                if (i < x1 || i > x2 || j < y1 || j > y2) {
                    count++;
                    var ki = exports.Ki.Empty;
                    if (center === exports.Center.TopLeft || center === exports.Center.BottomLeft) {
                        ki = blackToAttack !== count <= defenseArea ? exports.Ki.White : exports.Ki.Black;
                    }
                    else if (center === exports.Center.TopRight ||
                        center === exports.Center.BottomRight) {
                        ki = blackToAttack !== count <= defenseArea ? exports.Ki.Black : exports.Ki.White;
                    }
                    if ((i + j) % 2 === 0 && Math.abs(count - defenseArea) > boardSize) {
                        ki = exports.Ki.Empty;
                    }
                    mat[i][j] = ki;
                }
            }
        }
    };
    putBorder(result);
    putOutside(result);
    // const flipSpec =
    //   imin < jmin
    //     ? [false, false, true]
    //     : [needFlip(imin, imax, isize), needFlip(jmin, jmax, jsize), false];
    // if (flipSpec.includes(true)) {
    //   const flipped = flipStones(stones, flipSpec);
    //   const filled = tsumegoFrameStones(flipped, komi, blackToPlay, ko, margin);
    //   return flipStones(filled, flipSpec);
    // }
    // const i0 = imin - margin;
    // const i1 = imax + margin;
    // const j0 = jmin - margin;
    // const j1 = jmax + margin;
    // const frameRange: Region = [i0, i1, j0, j1];
    // const blackToAttack = guessBlackToAttack(
    //   [top, bottom, left, right],
    //   [isize, jsize]
    // );
    // putBorder(mat, [isize, jsize], frameRange, blackToAttack);
    // putOutside(
    //   stones,
    //   [isize, jsize],
    //   frameRange,
    //   blackToAttack,
    //   blackToPlay,
    //   komi
    // );
    // putKoThreat(
    //   stones,
    //   [isize, jsize],
    //   frameRange,
    //   blackToAttack,
    //   blackToPlay,
    //   ko
    // );
    // return stones;
    return result;
};
var calcOffset = function (mat) {
    var boardSize = calcBoardSize(mat);
    var ox = 19 - boardSize[0];
    var oy = 19 - boardSize[1];
    var center = calcCenter(mat);
    var oox = ox;
    var ooy = oy;
    switch (center) {
        case exports.Center.TopLeft: {
            oox = 0;
            ooy = oy;
            break;
        }
        case exports.Center.TopRight: {
            oox = -ox;
            ooy = oy;
            break;
        }
        case exports.Center.BottomLeft: {
            oox = 0;
            ooy = 0;
            break;
        }
        case exports.Center.BottomRight: {
            oox = -ox;
            ooy = 0;
            break;
        }
    }
    return { x: oox, y: ooy };
};
var reverseOffset = function (mat, bx, by, boardSize) {
    if (bx === void 0) { bx = 19; }
    if (by === void 0) { by = 19; }
    if (boardSize === void 0) { boardSize = 19; }
    var ox = boardSize - bx;
    var oy = boardSize - by;
    var center = calcCenter(mat);
    var oox = ox;
    var ooy = oy;
    switch (center) {
        case exports.Center.TopLeft: {
            oox = 0;
            ooy = -oy;
            break;
        }
        case exports.Center.TopRight: {
            oox = ox;
            ooy = -oy;
            break;
        }
        case exports.Center.BottomLeft: {
            oox = 0;
            ooy = 0;
            break;
        }
        case exports.Center.BottomRight: {
            oox = ox;
            ooy = 0;
            break;
        }
    }
    return { x: oox, y: ooy };
};
function calcVisibleArea(mat, extent, allowRectangle) {
    if (mat === void 0) { mat = zeros([19, 19]); }
    if (allowRectangle === void 0) { allowRectangle = false; }
    var minRow = mat.length;
    var maxRow = 0;
    var minCol = mat[0].length;
    var maxCol = 0;
    var empty = true;
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            if (mat[i][j] !== 0) {
                empty = false;
                minRow = Math.min(minRow, i);
                maxRow = Math.max(maxRow, i);
                minCol = Math.min(minCol, j);
                maxCol = Math.max(maxCol, j);
            }
        }
    }
    if (empty) {
        return [
            [0, mat.length - 1],
            [0, mat[0].length - 1],
        ];
    }
    if (!allowRectangle) {
        var minRowWithExtent = Math.max(minRow - extent, 0);
        var maxRowWithExtent = Math.min(maxRow + extent, mat.length - 1);
        var minColWithExtent = Math.max(minCol - extent, 0);
        var maxColWithExtent = Math.min(maxCol + extent, mat[0].length - 1);
        var maxRange = Math.max(maxRowWithExtent - minRowWithExtent, maxColWithExtent - minColWithExtent);
        minRow = minRowWithExtent;
        maxRow = minRow + maxRange;
        if (maxRow >= mat.length) {
            maxRow = mat.length - 1;
            minRow = maxRow - maxRange;
        }
        minCol = minColWithExtent;
        maxCol = minCol + maxRange;
        if (maxCol >= mat[0].length) {
            maxCol = mat[0].length - 1;
            minCol = maxCol - maxRange;
        }
    }
    else {
        minRow = Math.max(0, minRow - extent);
        maxRow = Math.min(mat.length - 1, maxRow + extent);
        minCol = Math.max(0, minCol - extent);
        maxCol = Math.min(mat[0].length - 1, maxCol + extent);
    }
    return [
        [minRow, maxRow],
        [minCol, maxCol],
    ];
}
function move(mat, i, j, ki) {
    if (i < 0 || j < 0)
        return mat;
    var newMat = lodash.cloneDeep(mat);
    newMat[i][j] = ki;
    return execCapture(newMat, i, j, -ki);
}
function showKi(mat, steps, isCaptured) {
    if (isCaptured === void 0) { isCaptured = true; }
    var newMat = lodash.cloneDeep(mat);
    var hasMoved = false;
    steps.forEach(function (str) {
        var _a = sgfToPos(str), x = _a.x, y = _a.y, ki = _a.ki;
        if (isCaptured) {
            if (canMove(newMat, x, y, ki)) {
                newMat[x][y] = ki;
                newMat = execCapture(newMat, x, y, -ki);
                hasMoved = true;
            }
        }
        else {
            newMat[x][y] = ki;
            hasMoved = true;
        }
    });
    return {
        arrangement: newMat,
        hasMoved: hasMoved,
    };
}
// TODO:
var handleMove = function (mat, i, j, turn, currentNode, onAfterMove) {
    if (turn === exports.Ki.Empty)
        return;
    if (canMove(mat, i, j, turn)) {
        // dispatch(uiSlice.actions.setTurn(-turn));
        var value = SGF_LETTERS[i] + SGF_LETTERS[j];
        var token = turn === exports.Ki.Black ? 'B' : 'W';
        var hash_1 = calcHash(currentNode, [MoveProp.from("".concat(token, "[").concat(value, "]"))]);
        var filtered = currentNode.children.filter(function (n) { return n.model.id === hash_1; });
        var node = void 0;
        if (filtered.length > 0) {
            node = filtered[0];
        }
        else {
            node = buildMoveNode("".concat(token, "[").concat(value, "]"), currentNode);
            currentNode.addChild(node);
        }
        if (onAfterMove)
            onAfterMove(node, true);
    }
    else {
        if (onAfterMove)
            onAfterMove(currentNode, false);
    }
};
/**
 * Clear stone from the currentNode
 * @param currentNode
 * @param value
 */
var clearStoneFromCurrentNode = function (currentNode, value) {
    var path = currentNode.getPath();
    path.forEach(function (node) {
        var setupProps = node.model.setupProps;
        if (setupProps.filter(function (s) { return s.value === value; }).length > 0) {
            node.model.setupProps = setupProps.filter(function (s) { return s.value !== value; });
        }
        else {
            setupProps.forEach(function (s) {
                s.values = s.values.filter(function (v) { return v !== value; });
                if (s.values.length === 0) {
                    node.model.setupProps = node.model.setupProps.filter(function (p) { return p.token !== s.token; });
                }
            });
        }
    });
};
/**
 * Adds a stone to the current node in the tree.
 *
 * @param currentNode The current node in the tree.
 * @param mat The matrix representing the board.
 * @param i The row index of the stone.
 * @param j The column index of the stone.
 * @param ki The color of the stone (Ki.White or Ki.Black).
 * @returns True if the stone was removed from previous nodes, false otherwise.
 */
var addStoneToCurrentNode = function (currentNode, mat, i, j, ki) {
    var value = SGF_LETTERS[i] + SGF_LETTERS[j];
    var token = ki === exports.Ki.White ? 'AW' : 'AB';
    var prop = findProp(currentNode, token);
    var result = false;
    if (mat[i][j] !== exports.Ki.Empty) {
        clearStoneFromCurrentNode(currentNode, value);
    }
    else {
        if (prop) {
            prop.values = tslib.__spreadArray(tslib.__spreadArray([], tslib.__read(prop.values), false), [value], false);
        }
        else {
            currentNode.model.setupProps = tslib.__spreadArray(tslib.__spreadArray([], tslib.__read(currentNode.model.setupProps), false), [
                new SetupProp(token, value),
            ], false);
        }
        result = true;
    }
    return result;
};
/**
 * Adds a move to the given matrix and returns the corresponding node in the tree.
 * If the ki is empty, no move is added and null is returned.
 *
 * @param mat - The matrix representing the game board.
 * @param currentNode - The current node in the tree.
 * @param i - The row index of the move.
 * @param j - The column index of the move.
 * @param ki - The type of move (Ki).
 * @returns The corresponding node in the tree, or null if no move is added.
 */
// TODO: The params here is weird
var addMoveToCurrentNode = function (currentNode, mat, i, j, ki) {
    if (ki === exports.Ki.Empty)
        return;
    var node;
    if (canMove(mat, i, j, ki)) {
        var value = SGF_LETTERS[i] + SGF_LETTERS[j];
        var token = ki === exports.Ki.Black ? 'B' : 'W';
        var hash_2 = calcHash(currentNode, [MoveProp.from("".concat(token, "[").concat(value, "]"))]);
        var filtered = currentNode.children.filter(function (n) { return n.model.id === hash_2; });
        if (filtered.length > 0) {
            node = filtered[0];
        }
        else {
            node = buildMoveNode("".concat(token, "[").concat(value, "]"), currentNode);
            currentNode.addChild(node);
        }
    }
    return node;
};
var calcPreventMoveMatForDisplayOnly = function (node, defaultBoardSize) {
    if (defaultBoardSize === void 0) { defaultBoardSize = 19; }
    if (!node)
        return zeros([defaultBoardSize, defaultBoardSize]);
    var size = extractBoardSize(node, defaultBoardSize);
    var preventMoveMat = zeros([size, size]);
    preventMoveMat.forEach(function (row) { return row.fill(1); });
    if (node.hasChildren()) {
        node.children.forEach(function (n) {
            n.model.moveProps.forEach(function (m) {
                var i = SGF_LETTERS.indexOf(m.value[0]);
                var j = SGF_LETTERS.indexOf(m.value[1]);
                if (i >= 0 && j >= 0 && i < size && j < size) {
                    preventMoveMat[i][j] = 0;
                }
            });
        });
    }
    return preventMoveMat;
};
var calcPreventMoveMat = function (node, defaultBoardSize) {
    if (defaultBoardSize === void 0) { defaultBoardSize = 19; }
    if (!node)
        return zeros([defaultBoardSize, defaultBoardSize]);
    var size = extractBoardSize(node, defaultBoardSize);
    var preventMoveMat = zeros([size, size]);
    var preventMoveNodes = [];
    if (node.hasChildren()) {
        preventMoveNodes = node.children.filter(function (n) { return isPreventMoveNode(n); });
    }
    if (isForceNode(node)) {
        preventMoveMat.forEach(function (row) { return row.fill(1); });
        if (node.hasChildren()) {
            node.children.forEach(function (n) {
                n.model.moveProps.forEach(function (m) {
                    var i = SGF_LETTERS.indexOf(m.value[0]);
                    var j = SGF_LETTERS.indexOf(m.value[1]);
                    if (i >= 0 && j >= 0 && i < size && j < size) {
                        preventMoveMat[i][j] = 0;
                    }
                });
            });
        }
    }
    preventMoveNodes.forEach(function (n) {
        n.model.moveProps.forEach(function (m) {
            var i = SGF_LETTERS.indexOf(m.value[0]);
            var j = SGF_LETTERS.indexOf(m.value[1]);
            if (i >= 0 && j >= 0 && i < size && j < size) {
                preventMoveMat[i][j] = 1;
            }
        });
    });
    return preventMoveMat;
};
/**
 * Calculates the markup matrix for variations in a given SGF node.
 *
 * @param node - The SGF node to calculate the markup for.
 * @param policy - The policy for handling the markup. Defaults to 'append'.
 * @returns The calculated markup for the variations.
 */
var calcVariationsMarkup = function (node, policy, activeIndex, defaultBoardSize) {
    if (policy === void 0) { policy = 'append'; }
    if (activeIndex === void 0) { activeIndex = 0; }
    if (defaultBoardSize === void 0) { defaultBoardSize = 19; }
    var res = calcMatAndMarkup(node);
    var mat = res.mat, markup = res.markup;
    var size = extractBoardSize(node, defaultBoardSize);
    if (node.hasChildren()) {
        node.children.forEach(function (n) {
            n.model.moveProps.forEach(function (m) {
                var i = SGF_LETTERS.indexOf(m.value[0]);
                var j = SGF_LETTERS.indexOf(m.value[1]);
                if (i < 0 || j < 0)
                    return;
                if (i < size && j < size) {
                    var mark = exports.Markup.NeutralNode;
                    if (inWrongPath(n)) {
                        mark =
                            n.getIndex() === activeIndex
                                ? exports.Markup.NegativeActiveNode
                                : exports.Markup.NegativeNode;
                    }
                    if (inRightPath(n)) {
                        mark =
                            n.getIndex() === activeIndex
                                ? exports.Markup.PositiveActiveNode
                                : exports.Markup.PositiveNode;
                    }
                    if (mat[i][j] === exports.Ki.Empty) {
                        switch (policy) {
                            case 'prepend':
                                markup[i][j] = mark + '|' + markup[i][j];
                                break;
                            case 'replace':
                                markup[i][j] = mark;
                                break;
                            case 'append':
                            default:
                                markup[i][j] += '|' + mark;
                        }
                    }
                }
            });
        });
    }
    return markup;
};
var detectST = function (node) {
    // Reference: https://www.red-bean.com/sgf/properties.html#ST
    var root = node.getPath()[0];
    var stProp = root.model.rootProps.find(function (p) { return p.token === 'ST'; });
    var showVariationsMarkup = false;
    var showChildrenMarkup = false;
    var showSiblingsMarkup = false;
    var st = (stProp === null || stProp === void 0 ? void 0 : stProp.value) || '0';
    if (st) {
        if (st === '0') {
            showSiblingsMarkup = false;
            showChildrenMarkup = true;
            showVariationsMarkup = true;
        }
        else if (st === '1') {
            showSiblingsMarkup = true;
            showChildrenMarkup = false;
            showVariationsMarkup = true;
        }
        else if (st === '2') {
            showSiblingsMarkup = false;
            showChildrenMarkup = true;
            showVariationsMarkup = false;
        }
        else if (st === '3') {
            showSiblingsMarkup = true;
            showChildrenMarkup = false;
            showVariationsMarkup = false;
        }
    }
    return { showVariationsMarkup: showVariationsMarkup, showChildrenMarkup: showChildrenMarkup, showSiblingsMarkup: showSiblingsMarkup };
};
/**
 * Calculates the mat and markup arrays based on the currentNode and defaultBoardSize.
 * @param currentNode The current node in the tree.
 * @param defaultBoardSize The default size of the board (optional, default is 19).
 * @returns An object containing the mat/visibleAreaMat/markup/numMarkup arrays.
 */
var calcMatAndMarkup = function (currentNode, defaultBoardSize) {
    if (defaultBoardSize === void 0) { defaultBoardSize = 19; }
    var path = currentNode.getPath();
    var root = path[0];
    var li, lj;
    var setupCount = 0;
    var size = extractBoardSize(currentNode, defaultBoardSize);
    var mat = zeros([size, size]);
    var visibleAreaMat = zeros([size, size]);
    var markup = empty([size, size]);
    var numMarkup = empty([size, size]);
    path.forEach(function (node, index) {
        var _a = node.model, moveProps = _a.moveProps, setupProps = _a.setupProps; _a.rootProps;
        if (setupProps.length > 0)
            setupCount += 1;
        moveProps.forEach(function (m) {
            var i = SGF_LETTERS.indexOf(m.value[0]);
            var j = SGF_LETTERS.indexOf(m.value[1]);
            if (i < 0 || j < 0)
                return;
            if (i < size && j < size) {
                li = i;
                lj = j;
                mat = move(mat, i, j, m.token === 'B' ? exports.Ki.Black : exports.Ki.White);
                if (li !== undefined && lj !== undefined && li >= 0 && lj >= 0) {
                    numMarkup[li][lj] = (node.model.number || index - setupCount).toString();
                }
                if (index === path.length - 1) {
                    markup[li][lj] = exports.Markup.Current;
                }
            }
        });
        // Setup props should override move props
        setupProps.forEach(function (setup) {
            setup.values.forEach(function (value) {
                var i = SGF_LETTERS.indexOf(value[0]);
                var j = SGF_LETTERS.indexOf(value[1]);
                if (i < 0 || j < 0)
                    return;
                if (i < size && j < size) {
                    li = i;
                    lj = j;
                    mat[i][j] = setup.token === 'AB' ? 1 : -1;
                    if (setup.token === 'AE')
                        mat[i][j] = 0;
                }
            });
        });
        // If the root node does not include any setup properties
        // check whether its first child is a setup node (i.e., a non-move node)
        // and apply its setup properties instead
        if (setupProps.length === 0 && currentNode.isRoot()) {
            var firstChildNode = currentNode.children[0];
            if (firstChildNode &&
                isSetupNode(firstChildNode) &&
                !isMoveNode(firstChildNode)) {
                var setupProps_1 = firstChildNode.model.setupProps;
                setupProps_1.forEach(function (setup) {
                    setup.values.forEach(function (value) {
                        var i = SGF_LETTERS.indexOf(value[0]);
                        var j = SGF_LETTERS.indexOf(value[1]);
                        if (i < 0 || j < 0)
                            return;
                        if (i < size && j < size) {
                            li = i;
                            lj = j;
                            mat[i][j] = setup.token === 'AB' ? 1 : -1;
                            if (setup.token === 'AE')
                                mat[i][j] = 0;
                        }
                    });
                });
            }
        }
        // Clear number when stones are captured
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (mat[i][j] === 0)
                    numMarkup[i][j] = '';
            }
        }
    });
    // Calculating the visible area
    if (root) {
        root.all(function (node) {
            var _a = node.model, moveProps = _a.moveProps, setupProps = _a.setupProps; _a.rootProps;
            if (setupProps.length > 0)
                setupCount += 1;
            setupProps.forEach(function (setup) {
                setup.values.forEach(function (value) {
                    var i = SGF_LETTERS.indexOf(value[0]);
                    var j = SGF_LETTERS.indexOf(value[1]);
                    if (i >= 0 && j >= 0 && i < size && j < size) {
                        visibleAreaMat[i][j] = exports.Ki.Black;
                        if (setup.token === 'AE')
                            visibleAreaMat[i][j] = 0;
                    }
                });
            });
            moveProps.forEach(function (m) {
                var i = SGF_LETTERS.indexOf(m.value[0]);
                var j = SGF_LETTERS.indexOf(m.value[1]);
                if (i >= 0 && j >= 0 && i < size && j < size) {
                    visibleAreaMat[i][j] = exports.Ki.Black;
                }
            });
            return true;
        });
    }
    var markupProps = currentNode.model.markupProps;
    markupProps.forEach(function (m) {
        var token = m.token;
        var values = m.values;
        values.forEach(function (value) {
            var i = SGF_LETTERS.indexOf(value[0]);
            var j = SGF_LETTERS.indexOf(value[1]);
            if (i < 0 || j < 0)
                return;
            if (i < size && j < size) {
                var mark = void 0;
                switch (token) {
                    case 'CR':
                        mark = exports.Markup.Circle;
                        break;
                    case 'SQ':
                        mark = exports.Markup.Square;
                        break;
                    case 'TR':
                        mark = exports.Markup.Triangle;
                        break;
                    case 'MA':
                        mark = exports.Markup.Cross;
                        break;
                    default: {
                        mark = value.split(':')[1];
                    }
                }
                markup[i][j] = mark;
            }
        });
    });
    // if (
    //   li !== undefined &&
    //   lj !== undefined &&
    //   li >= 0 &&
    //   lj >= 0 &&
    //   !markup[li][lj]
    // ) {
    //   markup[li][lj] = Markup.Current;
    // }
    return { mat: mat, visibleAreaMat: visibleAreaMat, markup: markup, numMarkup: numMarkup };
};
/**
 * Finds a property in the given node based on the provided token.
 * @param node The node to search for the property.
 * @param token The token of the property to find.
 * @returns The found property or null if not found.
 */
var findProp = function (node, token) {
    if (!node)
        return;
    if (MOVE_PROP_LIST.includes(token)) {
        return node.model.moveProps.find(function (p) { return p.token === token; });
    }
    if (NODE_ANNOTATION_PROP_LIST.includes(token)) {
        return node.model.nodeAnnotationProps.find(function (p) { return p.token === token; });
    }
    if (MOVE_ANNOTATION_PROP_LIST.includes(token)) {
        return node.model.moveAnnotationProps.find(function (p) { return p.token === token; });
    }
    if (ROOT_PROP_LIST.includes(token)) {
        return node.model.rootProps.find(function (p) { return p.token === token; });
    }
    if (SETUP_PROP_LIST.includes(token)) {
        return node.model.setupProps.find(function (p) { return p.token === token; });
    }
    if (MARKUP_PROP_LIST.includes(token)) {
        return node.model.markupProps.find(function (p) { return p.token === token; });
    }
    if (GAME_INFO_PROP_LIST.includes(token)) {
        return node.model.gameInfoProps.find(function (p) { return p.token === token; });
    }
    return null;
};
/**
 * Finds properties in a given node based on the provided token.
 * @param node - The node to search for properties.
 * @param token - The token to match against the properties.
 * @returns An array of properties that match the provided token.
 */
var findProps = function (node, token) {
    if (MOVE_PROP_LIST.includes(token)) {
        return node.model.moveProps.filter(function (p) { return p.token === token; });
    }
    if (NODE_ANNOTATION_PROP_LIST.includes(token)) {
        return node.model.nodeAnnotationProps.filter(function (p) { return p.token === token; });
    }
    if (MOVE_ANNOTATION_PROP_LIST.includes(token)) {
        return node.model.moveAnnotationProps.filter(function (p) { return p.token === token; });
    }
    if (ROOT_PROP_LIST.includes(token)) {
        return node.model.rootProps.filter(function (p) { return p.token === token; });
    }
    if (SETUP_PROP_LIST.includes(token)) {
        return node.model.setupProps.filter(function (p) { return p.token === token; });
    }
    if (MARKUP_PROP_LIST.includes(token)) {
        return node.model.markupProps.filter(function (p) { return p.token === token; });
    }
    if (GAME_INFO_PROP_LIST.includes(token)) {
        return node.model.gameInfoProps.filter(function (p) { return p.token === token; });
    }
    return [];
};
var genMove = function (node, onRight, onWrong, onVariant, onOffPath) {
    var nextNode;
    var getPath = function (node) {
        var newPath = lodash.compact(node.getPath().map(function (n) { var _a; return (_a = n.model.moveProps[0]) === null || _a === void 0 ? void 0 : _a.toString(); })).join(';');
        return newPath;
    };
    var checkResult = function (node) {
        if (node.hasChildren())
            return;
        var path = getPath(node);
        if (isRightNode(node)) {
            if (onRight)
                onRight(path);
        }
        else if (isVariantNode(node)) {
            if (onVariant)
                onVariant(path);
        }
        else {
            if (onWrong)
                onWrong(path);
        }
    };
    if (node.hasChildren()) {
        var rightNodes = node.children.filter(function (n) { return inRightPath(n); });
        var wrongNodes = node.children.filter(function (n) { return inWrongPath(n); });
        var variantNodes = node.children.filter(function (n) { return inVariantPath(n); });
        nextNode = node;
        if (inRightPath(node) && rightNodes.length > 0) {
            nextNode = lodash.sample(rightNodes);
        }
        else if (inWrongPath(node) && wrongNodes.length > 0) {
            nextNode = lodash.sample(wrongNodes);
        }
        else if (inVariantPath(node) && variantNodes.length > 0) {
            nextNode = lodash.sample(variantNodes);
        }
        else if (isRightNode(node)) {
            onRight(getPath(nextNode));
        }
        else {
            onWrong(getPath(nextNode));
        }
        if (nextNode)
            checkResult(nextNode);
    }
    else {
        checkResult(node);
    }
    return nextNode;
};
var extractBoardSize = function (node, defaultBoardSize) {
    var _a;
    if (defaultBoardSize === void 0) { defaultBoardSize = 19; }
    var root = node.getPath()[0];
    var size = Math.min(parseInt(String(((_a = findProp(root, 'SZ')) === null || _a === void 0 ? void 0 : _a.value) || defaultBoardSize)), MAX_BOARD_SIZE);
    return size;
};
var getFirstToMoveColorFromRoot = function (root, defaultMoveColor) {
    if (defaultMoveColor === void 0) { defaultMoveColor = exports.Ki.Black; }
    if (root) {
        var setupNode = root.first(function (n) { return isSetupNode(n); });
        if (setupNode) {
            var firstMoveNode = setupNode.first(function (n) { return isMoveNode(n); });
            if (!firstMoveNode)
                return defaultMoveColor;
            return getMoveColor(firstMoveNode);
        }
    }
    // console.warn('Default first to move color', defaultMoveColor);
    return defaultMoveColor;
};
var getFirstToMoveColorFromSgf = function (sgf, defaultMoveColor) {
    if (defaultMoveColor === void 0) { defaultMoveColor = exports.Ki.Black; }
    var sgfParser = new Sgf(sgf);
    if (sgfParser.root)
        getFirstToMoveColorFromRoot(sgfParser.root, defaultMoveColor);
    // console.warn('Default first to move color', defaultMoveColor);
    return defaultMoveColor;
};
var getMoveColor = function (node, defaultMoveColor) {
    var _a, _b;
    if (defaultMoveColor === void 0) { defaultMoveColor = exports.Ki.Black; }
    var moveProp = (_b = (_a = node.model) === null || _a === void 0 ? void 0 : _a.moveProps) === null || _b === void 0 ? void 0 : _b[0];
    switch (moveProp === null || moveProp === void 0 ? void 0 : moveProp.token) {
        case 'W':
            return exports.Ki.White;
        case 'B':
            return exports.Ki.Black;
        default:
            // console.warn('Default move color is', defaultMoveColor);
            return defaultMoveColor;
    }
};

var Stone = /** @class */ (function () {
    function Stone(ctx, x, y, ki) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.ki = ki;
        this.globalAlpha = 1;
        this.size = 0;
    }
    Stone.prototype.draw = function () {
        // Base draw method - to be implemented by subclasses
    };
    Stone.prototype.setGlobalAlpha = function (alpha) {
        this.globalAlpha = alpha;
    };
    Stone.prototype.setSize = function (size) {
        this.size = size;
    };
    return Stone;
}());

var FlatStone = /** @class */ (function (_super) {
    tslib.__extends(FlatStone, _super);
    function FlatStone(ctx, x, y, ki, themeContext) {
        var _this = _super.call(this, ctx, x, y, ki) || this;
        _this.themeContext = themeContext;
        return _this;
    }
    /**
     * Get a theme property value with fallback
     */
    FlatStone.prototype.getThemeProperty = function (key) {
        var _a;
        if (!this.themeContext) {
            return BASE_THEME_CONFIG[key];
        }
        var _b = this.themeContext, theme = _b.theme, themeOptions = _b.themeOptions;
        var themeSpecific = themeOptions[theme];
        var defaultConfig = themeOptions.default;
        // Try theme-specific value first, then default
        var result = ((_a = themeSpecific === null || themeSpecific === void 0 ? void 0 : themeSpecific[key]) !== null && _a !== void 0 ? _a : defaultConfig[key]);
        return result;
    };
    FlatStone.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, size = _a.size, ki = _a.ki, globalAlpha = _a.globalAlpha;
        if (size <= 0)
            return;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = globalAlpha;
        ctx.arc(x, y, size / 2, 0, 2 * Math.PI, true);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.getThemeProperty('boardLineColor');
        if (ki === exports.Ki.Black) {
            ctx.fillStyle = this.getThemeProperty('flatBlackColor');
        }
        else if (ki === exports.Ki.White) {
            ctx.fillStyle = this.getThemeProperty('flatWhiteColor');
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    };
    return FlatStone;
}(Stone));

var ImageStone = /** @class */ (function (_super) {
    tslib.__extends(ImageStone, _super);
    function ImageStone(ctx, x, y, ki, mod, blacks, whites, themeContext) {
        var _this = _super.call(this, ctx, x, y, ki) || this;
        _this.mod = mod;
        _this.blacks = blacks;
        _this.whites = whites;
        _this.themeContext = themeContext;
        // Create FlatStone as fallback option
        if (themeContext) {
            _this.fallbackStone = new FlatStone(ctx, x, y, ki, themeContext);
        }
        return _this;
    }
    ImageStone.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, size = _a.size, ki = _a.ki, blacks = _a.blacks, whites = _a.whites, mod = _a.mod;
        if (size <= 0)
            return;
        var img;
        if (ki === exports.Ki.Black) {
            img = blacks[mod % blacks.length];
        }
        else {
            img = whites[mod % whites.length];
        }
        // Check if image is loaded completely
        if (img && img.complete && img.naturalHeight !== 0) {
            // Image loaded, render with image
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        }
        else {
            // Image not loaded or load failed, use FlatStone as fallback
            if (this.fallbackStone) {
                this.fallbackStone.setSize(size);
                this.fallbackStone.draw();
            }
        }
    };
    ImageStone.prototype.setSize = function (size) {
        _super.prototype.setSize.call(this, size);
        // Synchronously update fallbackStone size
        if (this.fallbackStone) {
            this.fallbackStone.setSize(size);
        }
    };
    return ImageStone;
}(Stone));

var AnalysisPoint = /** @class */ (function () {
    function AnalysisPoint(ctx, x, y, r, rootInfo, moveInfo, theme, outlineColor) {
        if (theme === void 0) { theme = exports.AnalysisPointTheme.Default; }
        var _this = this;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.r = r;
        this.rootInfo = rootInfo;
        this.moveInfo = moveInfo;
        this.theme = theme;
        this.outlineColor = outlineColor;
        this.drawProblemAnalysisPoint = function () {
            var _a = _this, ctx = _a.ctx, x = _a.x, y = _a.y, r = _a.r, rootInfo = _a.rootInfo, moveInfo = _a.moveInfo, outlineColor = _a.outlineColor;
            var order = moveInfo.order;
            var pColor = calcAnalysisPointColor(rootInfo, moveInfo);
            if (order < 5) {
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI, true);
                ctx.lineWidth = 0;
                ctx.strokeStyle = 'rgba(255,255,255,0)';
                var gradient = ctx.createRadialGradient(x, y, r * 0.9, x, y, r);
                gradient.addColorStop(0, pColor);
                gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0');
                ctx.fillStyle = gradient;
                ctx.fill();
                if (outlineColor) {
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, 2 * Math.PI, true);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = outlineColor;
                    ctx.stroke();
                }
                var fontSize = r / 1.5;
                ctx.font = "".concat(fontSize * 0.8, "px Tahoma");
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.font = "".concat(fontSize, "px Tahoma");
                var scoreText = calcScoreDiffText(rootInfo, moveInfo);
                ctx.fillText(scoreText, x, y);
                ctx.font = "".concat(fontSize * 0.8, "px Tahoma");
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText(nFormatter(moveInfo.visits), x, y + r / 2 + fontSize / 8);
            }
            else {
                _this.drawCandidatePoint();
            }
        };
        this.drawDefaultAnalysisPoint = function () {
            var _a = _this, ctx = _a.ctx, x = _a.x, y = _a.y, r = _a.r, rootInfo = _a.rootInfo, moveInfo = _a.moveInfo;
            var order = moveInfo.order;
            var pColor = calcAnalysisPointColor(rootInfo, moveInfo);
            if (order < 5) {
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI, true);
                ctx.lineWidth = 0;
                ctx.strokeStyle = 'rgba(255,255,255,0)';
                var gradient = ctx.createRadialGradient(x, y, r * 0.9, x, y, r);
                gradient.addColorStop(0, pColor);
                gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0');
                ctx.fillStyle = gradient;
                ctx.fill();
                var fontSize = r / 1.5;
                ctx.font = "".concat(fontSize * 0.8, "px Tahoma");
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                var winrate = rootInfo.currentPlayer === 'B'
                    ? moveInfo.winrate
                    : 1 - moveInfo.winrate;
                ctx.fillText(round3(winrate, 100, 1), x, y - r / 2 + fontSize / 5);
                ctx.font = "".concat(fontSize, "px Tahoma");
                var scoreText = calcScoreDiffText(rootInfo, moveInfo);
                ctx.fillText(scoreText, x, y + fontSize / 3);
                ctx.font = "".concat(fontSize * 0.8, "px Tahoma");
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText(nFormatter(moveInfo.visits), x, y + r / 2 + fontSize / 3);
                var order_1 = moveInfo.order;
                ctx.fillText((order_1 + 1).toString(), x + r, y - r / 2);
            }
            else {
                _this.drawCandidatePoint();
            }
        };
        this.drawCandidatePoint = function () {
            var _a = _this, ctx = _a.ctx, x = _a.x, y = _a.y, r = _a.r, rootInfo = _a.rootInfo, moveInfo = _a.moveInfo;
            var pColor = calcAnalysisPointColor(rootInfo, moveInfo);
            ctx.beginPath();
            ctx.arc(x, y, r * 0.6, 0, 2 * Math.PI, true);
            ctx.lineWidth = 0;
            ctx.strokeStyle = 'rgba(255,255,255,0)';
            var gradient = ctx.createRadialGradient(x, y, r * 0.4, x, y, r);
            gradient.addColorStop(0, pColor);
            gradient.addColorStop(0.95, 'rgba(255, 255, 255, 0');
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.stroke();
        };
    }
    AnalysisPoint.prototype.draw = function () {
        var _a = this, ctx = _a.ctx; _a.x; _a.y; var r = _a.r; _a.rootInfo; _a.moveInfo; var theme = _a.theme;
        if (r < 0)
            return;
        ctx.save();
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 0;
        // this.drawDefaultAnalysisPoint();
        if (theme === exports.AnalysisPointTheme.Default) {
            this.drawDefaultAnalysisPoint();
        }
        else if (theme === exports.AnalysisPointTheme.Problem) {
            this.drawProblemAnalysisPoint();
        }
        ctx.restore();
    };
    return AnalysisPoint;
}());

var Markup = /** @class */ (function () {
    function Markup(ctx, x, y, s, ki, themeContext, val) {
        if (val === void 0) { val = ''; }
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.s = s;
        this.ki = ki;
        this.val = val;
        this.globalAlpha = 1;
        this.color = '';
        this.lineDash = [];
        this.themeContext = themeContext;
    }
    Markup.prototype.draw = function () {
        // Base draw method - to be implemented by subclasses
    };
    Markup.prototype.setGlobalAlpha = function (alpha) {
        this.globalAlpha = alpha;
    };
    Markup.prototype.setColor = function (color) {
        this.color = color;
    };
    Markup.prototype.setLineDash = function (lineDash) {
        this.lineDash = lineDash;
    };
    /**
     * Get a theme property value with fallback
     */
    Markup.prototype.getThemeProperty = function (key) {
        var _a;
        if (!this.themeContext) {
            return BASE_THEME_CONFIG[key];
        }
        var _b = this.themeContext, theme = _b.theme, themeOptions = _b.themeOptions;
        var themeSpecific = themeOptions[theme];
        var defaultConfig = themeOptions.default;
        // Try theme-specific value first, then default
        var result = ((_a = themeSpecific === null || themeSpecific === void 0 ? void 0 : themeSpecific[key]) !== null && _a !== void 0 ? _a : defaultConfig[key]);
        return result;
    };
    return Markup;
}());

var CircleMarkup = /** @class */ (function (_super) {
    tslib.__extends(CircleMarkup, _super);
    function CircleMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CircleMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s, ki = _a.ki, globalAlpha = _a.globalAlpha, color = _a.color;
        var radius = s * 0.5;
        var size = radius * 0.65;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = globalAlpha;
        ctx.lineWidth = this.getThemeProperty('markupLineWidth');
        ctx.setLineDash(this.lineDash);
        if (ki === exports.Ki.White) {
            ctx.strokeStyle = this.getThemeProperty('flatBlackColor');
        }
        else if (ki === exports.Ki.Black) {
            ctx.strokeStyle = this.getThemeProperty('flatWhiteColor');
        }
        else {
            ctx.strokeStyle = this.getThemeProperty('boardLineColor');
            ctx.lineWidth = 3;
        }
        if (color)
            ctx.strokeStyle = color;
        if (size > 0) {
            ctx.arc(x, y, size, 0, 2 * Math.PI, true);
            ctx.stroke();
        }
        ctx.restore();
    };
    return CircleMarkup;
}(Markup));

var CrossMarkup = /** @class */ (function (_super) {
    tslib.__extends(CrossMarkup, _super);
    function CrossMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CrossMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s, ki = _a.ki, globalAlpha = _a.globalAlpha;
        var radius = s * 0.5;
        var size = radius * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.globalAlpha = globalAlpha;
        if (ki === exports.Ki.White) {
            ctx.strokeStyle = this.getThemeProperty('flatBlackColor');
        }
        else if (ki === exports.Ki.Black) {
            ctx.strokeStyle = this.getThemeProperty('flatWhiteColor');
        }
        else {
            ctx.strokeStyle = this.getThemeProperty('boardLineColor');
            size = radius * 0.58;
        }
        ctx.moveTo(x - size, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.moveTo(x + size, y - size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };
    return CrossMarkup;
}(Markup));

var TextMarkup = /** @class */ (function (_super) {
    tslib.__extends(TextMarkup, _super);
    function TextMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s, ki = _a.ki, val = _a.val, globalAlpha = _a.globalAlpha;
        var size = s * 0.8;
        var fontSize = size / 1.5;
        ctx.save();
        ctx.globalAlpha = globalAlpha;
        if (ki === exports.Ki.White) {
            ctx.fillStyle = this.getThemeProperty('flatBlackColor');
        }
        else if (ki === exports.Ki.Black) {
            ctx.fillStyle = this.getThemeProperty('flatWhiteColor');
        }
        else {
            ctx.fillStyle = this.getThemeProperty('boardLineColor');
        }
        // else {
        //   ctx.clearRect(x - size / 2, y - size / 2, size, size);
        // }
        if (val.toString().length === 1) {
            fontSize = size / 1.5;
        }
        else if (val.toString().length === 2) {
            fontSize = size / 1.8;
        }
        else {
            fontSize = size / 2.0;
        }
        ctx.font = "bold ".concat(fontSize, "px Tahoma");
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toString(), x, y + 2);
        ctx.restore();
    };
    return TextMarkup;
}(Markup));

var SquareMarkup = /** @class */ (function (_super) {
    tslib.__extends(SquareMarkup, _super);
    function SquareMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SquareMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s, ki = _a.ki, globalAlpha = _a.globalAlpha;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = this.getThemeProperty('markupLineWidth');
        ctx.globalAlpha = globalAlpha;
        var size = s * 0.55;
        if (ki === exports.Ki.White) {
            ctx.strokeStyle = this.getThemeProperty('flatBlackColor');
        }
        else if (ki === exports.Ki.Black) {
            ctx.strokeStyle = this.getThemeProperty('flatWhiteColor');
        }
        else {
            ctx.strokeStyle = this.getThemeProperty('boardLineColor');
            ctx.lineWidth = 3;
        }
        ctx.rect(x - size / 2, y - size / 2, size, size);
        ctx.stroke();
        ctx.restore();
    };
    return SquareMarkup;
}(Markup));

var TriangleMarkup = /** @class */ (function (_super) {
    tslib.__extends(TriangleMarkup, _super);
    function TriangleMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TriangleMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s, ki = _a.ki, globalAlpha = _a.globalAlpha;
        var radius = s * 0.5;
        var size = radius * 0.75;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = globalAlpha;
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size * Math.cos(0.523), y + size * Math.sin(0.523));
        ctx.lineTo(x + size * Math.cos(0.523), y + size * Math.sin(0.523));
        ctx.lineWidth = this.getThemeProperty('markupLineWidth');
        if (ki === exports.Ki.White) {
            ctx.strokeStyle = this.getThemeProperty('flatBlackColor');
        }
        else if (ki === exports.Ki.Black) {
            ctx.strokeStyle = this.getThemeProperty('flatWhiteColor');
        }
        else {
            ctx.strokeStyle = this.getThemeProperty('boardLineColor');
            ctx.lineWidth = 3;
            size = radius * 0.7;
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };
    return TriangleMarkup;
}(Markup));

var NodeMarkup = /** @class */ (function (_super) {
    tslib.__extends(NodeMarkup, _super);
    function NodeMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodeMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s; _a.ki; var color = _a.color, globalAlpha = _a.globalAlpha;
        var radius = s * 0.5;
        var size = radius * 0.4;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = globalAlpha;
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.setLineDash(this.lineDash);
        if (size > 0) {
            ctx.arc(x, y, size, 0, 2 * Math.PI, true);
            ctx.stroke();
        }
        ctx.restore();
    };
    return NodeMarkup;
}(Markup));

var ActiveNodeMarkup = /** @class */ (function (_super) {
    tslib.__extends(ActiveNodeMarkup, _super);
    function ActiveNodeMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActiveNodeMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s; _a.ki; var color = _a.color, globalAlpha = _a.globalAlpha;
        var radius = s * 0.5;
        var size = radius * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = globalAlpha;
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.setLineDash(this.lineDash);
        if (size > 0) {
            ctx.arc(x, y, size, 0, 2 * Math.PI, true);
            ctx.stroke();
        }
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = color;
        if (size > 0) {
            ctx.arc(x, y, size * 0.4, 0, 2 * Math.PI, true);
            ctx.fill();
        }
        ctx.restore();
    };
    return ActiveNodeMarkup;
}(Markup));

var CircleSolidMarkup = /** @class */ (function (_super) {
    tslib.__extends(CircleSolidMarkup, _super);
    function CircleSolidMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CircleSolidMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s, ki = _a.ki, globalAlpha = _a.globalAlpha, color = _a.color;
        var radius = s * 0.25;
        var size = radius * 0.65;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = globalAlpha;
        ctx.lineWidth = this.getThemeProperty('markupLineWidth');
        ctx.setLineDash(this.lineDash);
        if (ki === exports.Ki.Black) {
            ctx.fillStyle = this.getThemeProperty('flatWhiteColor');
        }
        else if (ki === exports.Ki.White) {
            ctx.fillStyle = this.getThemeProperty('flatBlackColor');
        }
        else {
            ctx.fillStyle = this.getThemeProperty('boardLineColor');
            ctx.lineWidth = 3;
        }
        if (color)
            ctx.fillStyle = color;
        if (size > 0) {
            ctx.arc(x, y, size, 0, 2 * Math.PI, true);
            ctx.fill();
        }
        ctx.restore();
    };
    return CircleSolidMarkup;
}(Markup));

var HighlightMarkup = /** @class */ (function (_super) {
    tslib.__extends(HighlightMarkup, _super);
    function HighlightMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HighlightMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s, ki = _a.ki; _a.globalAlpha;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = this.getThemeProperty('markupLineWidth');
        ctx.globalAlpha = 0.6;
        var size = s * 0.4;
        ctx.fillStyle = this.getThemeProperty('highlightColor');
        if (ki === exports.Ki.White || ki === exports.Ki.Black) {
            size = s * 0.35;
        }
        ctx.arc(x, y, size, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.restore();
    };
    return HighlightMarkup;
}(Markup));

var EffectBase = /** @class */ (function () {
    function EffectBase(ctx, x, y, size, ki) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = size;
        this.ki = ki;
        this.globalAlpha = 1;
        this.color = '';
    }
    EffectBase.prototype.play = function () {
        // Base play method - to be implemented by subclasses
    };
    return EffectBase;
}());

var banSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-ban\" viewBox=\"0 0 16 16\">\n  <path d=\"M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0\"/>\n</svg>";
var BanEffect = /** @class */ (function (_super) {
    tslib.__extends(BanEffect, _super);
    function BanEffect(ctx, x, y, size, ki) {
        var _this = _super.call(this, ctx, x, y, size, ki) || this;
        _this.ctx = ctx;
        _this.x = x;
        _this.y = y;
        _this.size = size;
        _this.ki = ki;
        _this.img = new Image();
        _this.alpha = 0;
        _this.fadeInDuration = 200;
        _this.fadeOutDuration = 150;
        _this.stayDuration = 400;
        _this.startTime = performance.now();
        _this.isFadingOut = false;
        _this.play = function () {
            if (!_this.img.complete) {
                return;
            }
            var _a = _this, ctx = _a.ctx, x = _a.x, y = _a.y, size = _a.size, img = _a.img, fadeInDuration = _a.fadeInDuration, fadeOutDuration = _a.fadeOutDuration;
            var now = performance.now();
            if (!_this.startTime) {
                _this.startTime = now;
            }
            ctx.clearRect(x - size / 2, y - size / 2, size, size);
            ctx.globalAlpha = _this.alpha;
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
            ctx.globalAlpha = 1;
            var elapsed = now - _this.startTime;
            if (!_this.isFadingOut) {
                _this.alpha = Math.min(elapsed / fadeInDuration, 1);
                if (elapsed >= fadeInDuration) {
                    _this.alpha = 1;
                    setTimeout(function () {
                        _this.isFadingOut = true;
                        _this.startTime = performance.now();
                    }, _this.stayDuration);
                }
            }
            else {
                var fadeElapsed = now - _this.startTime;
                _this.alpha = Math.max(1 - fadeElapsed / fadeOutDuration, 0);
                if (fadeElapsed >= fadeOutDuration) {
                    _this.alpha = 0;
                    ctx.clearRect(x - size / 2, y - size / 2, size, size);
                    return;
                }
            }
            requestAnimationFrame(_this.play);
        };
        // Convert SVG string to a data URL
        new Blob([banSvg], { type: 'image/svg+xml' });
        var svgDataUrl = "data:image/svg+xml;base64,".concat(jsBase64.encode(banSvg));
        _this.img = new Image();
        _this.img.src = svgDataUrl;
        return _this;
    }
    return BanEffect;
}(EffectBase));

var _a;
var getThemeResources = function (theme, themeResources, boardSize) {
    var _a, _b, _c, _d;
    if (boardSize === void 0) { boardSize = 512; }
    var resources = themeResources[theme];
    if (!resources)
        return null;
    // If board size < 256 and microRes exists, use microRes resources
    if (boardSize < 256 && resources.microRes) {
        return {
            board: resources.microRes.board || resources.board,
            blacks: ((_a = resources.microRes.blacks) === null || _a === void 0 ? void 0 : _a.length) > 0
                ? resources.microRes.blacks
                : resources.blacks,
            whites: ((_b = resources.microRes.whites) === null || _b === void 0 ? void 0 : _b.length) > 0
                ? resources.microRes.whites
                : resources.whites,
        };
    }
    // If board size < 512 and lowRes exists, use lowRes resources
    if (boardSize < 512 && resources.lowRes) {
        return {
            board: resources.lowRes.board || resources.board,
            blacks: ((_c = resources.lowRes.blacks) === null || _c === void 0 ? void 0 : _c.length) > 0
                ? resources.lowRes.blacks
                : resources.blacks,
            whites: ((_d = resources.lowRes.whites) === null || _d === void 0 ? void 0 : _d.length) > 0
                ? resources.lowRes.whites
                : resources.whites,
        };
    }
    // Otherwise use regular resources
    return {
        board: resources.board,
        blacks: resources.blacks,
        whites: resources.whites,
    };
};
// Get all theme resources for preloading (all resolutions)
var getAllThemeResources = function (theme, themeResources) {
    var resources = themeResources[theme];
    if (!resources)
        return [];
    var allImages = [];
    // Add regular resolution resources
    if (resources.board)
        allImages.push(resources.board);
    if (resources.blacks)
        allImages.push.apply(allImages, tslib.__spreadArray([], tslib.__read(resources.blacks), false));
    if (resources.whites)
        allImages.push.apply(allImages, tslib.__spreadArray([], tslib.__read(resources.whites), false));
    // Add lowRes resources if they exist
    if (resources.lowRes) {
        if (resources.lowRes.board)
            allImages.push(resources.lowRes.board);
        if (resources.lowRes.blacks)
            allImages.push.apply(allImages, tslib.__spreadArray([], tslib.__read(resources.lowRes.blacks), false));
        if (resources.lowRes.whites)
            allImages.push.apply(allImages, tslib.__spreadArray([], tslib.__read(resources.lowRes.whites), false));
    }
    // Add microRes resources if they exist
    if (resources.microRes) {
        if (resources.microRes.board)
            allImages.push(resources.microRes.board);
        if (resources.microRes.blacks)
            allImages.push.apply(allImages, tslib.__spreadArray([], tslib.__read(resources.microRes.blacks), false));
        if (resources.microRes.whites)
            allImages.push.apply(allImages, tslib.__spreadArray([], tslib.__read(resources.microRes.whites), false));
    }
    // Remove duplicates
    return Array.from(new Set(allImages));
};
var images = {};
// Helper function to set high-quality image smoothing for canvas context
var setImageSmoothingQuality = function (ctx) {
    if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
    }
};
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function preload(urls, done, onImageLoaded) {
    var loaded = 0;
    var imageLoaded = function () {
        loaded++;
        if (loaded === urls.length) {
            done();
        }
    };
    var _loop_1 = function (i) {
        if (!images[urls[i]]) {
            images[urls[i]] = new Image();
            images[urls[i]].src = urls[i];
            images[urls[i]].onload = function () {
                imageLoaded();
                // Callback when single image load completes
                if (onImageLoaded) {
                    onImageLoaded(urls[i]);
                }
            };
            images[urls[i]].onerror = function () {
                imageLoaded();
            };
        }
        else if (images[urls[i]].complete) {
            // Image already loaded
            imageLoaded();
        }
    };
    for (var i = 0; i < urls.length; i++) {
        _loop_1(i);
    }
}
var dpr = 1.0;
if (typeof window !== 'undefined') {
    dpr = window.devicePixelRatio || 1.0;
}
var DEFAULT_THEME_OPTIONS = (_a = {
        default: BASE_THEME_CONFIG
    },
    _a[exports.Theme.Flat] = {
        boardBackgroundColor: '#e6bb85',
    },
    _a[exports.Theme.Warm] = {
        boardBackgroundColor: '#C18B50',
    },
    _a[exports.Theme.Dark] = {
        activeColor: '#9CA3AF',
        inactiveColor: '#666666',
        boardLineColor: '#9CA3AF',
        boardBackgroundColor: '#2B3035',
    },
    _a[exports.Theme.YunziMonkeyDark] = {
        activeColor: '#A1C9AF',
        inactiveColor: '#A1C9AF',
        boardLineColor: '#A1C9AF',
        flatBlackColor: '#0E2019',
        flatBlackColorAlt: '#021D11',
        flatWhiteColor: '#A2C8B4',
        flatWhiteColorAlt: '#AFCBBC',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        stoneRatio: 0.5115,
    },
    _a[exports.Theme.HighContrast] = {
        // High contrast theme, friendly for all types of color blindness
        boardBackgroundColor: '#F5F5DC', // Beige background, gentle on eyes
        boardLineColor: '#2F4F4F', // Dark slate gray lines for high contrast
        activeColor: '#2F4F4F',
        inactiveColor: '#808080',
        // Stone colors: traditional black and white for maximum contrast and color blind friendliness
        flatBlackColor: '#000000', // Pure black - universally accessible
        flatBlackColorAlt: '#1A1A1A', // Very dark gray variant
        flatWhiteColor: '#FFFFFF', // Pure white - maximum contrast with black
        flatWhiteColorAlt: '#F8F8F8', // Very light gray variant
        // Node and markup colors - using colorblind-friendly colors that avoid red-green combinations
        positiveNodeColor: '#0284C7', // Blue (positive) - safe for all color blindness types
        negativeNodeColor: '#EA580C', // Orange (negative) - distinguishable from blue for all users
        neutralNodeColor: '#7C2D12', // Brown (neutral) - alternative to problematic colors
        defaultNodeColor: '#4B5563', // Dark gray
        warningNodeColor: '#FBBF24', // Bright yellow warning
        // Highlight and shadow
        highlightColor: '#FDE047', // Bright yellow highlight
        shadowColor: '#374151', // Dark gray shadow
    },
    _a);
var GhostBan = /** @class */ (function () {
    function GhostBan(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.defaultOptions = {
            boardSize: 19,
            dynamicPadding: false,
            padding: 10,
            extent: 3,
            interactive: false,
            coordinate: true,
            theme: exports.Theme.BlackAndWhite,
            analysisPointTheme: exports.AnalysisPointTheme.Default,
            background: false,
            showAnalysis: false,
            adaptiveBoardLine: true,
            themeOptions: DEFAULT_THEME_OPTIONS,
            themeResources: THEME_RESOURCES,
            moveSound: false,
            adaptiveStarSize: true,
            mobileIndicatorOffset: 0,
        };
        this.cursor = exports.Cursor.None;
        this.cursorValue = '';
        this.touchMoving = false;
        this.touchStartPoint = new DOMPoint();
        this.cursorPoint = new DOMPoint();
        this.actualCursorPoint = new DOMPoint();
        this.nodeMarkupStyles = {};
        this.setCursorWithRender = function (domPoint, offsetY) {
            var _a, _b;
            if (offsetY === void 0) { offsetY = 0; }
            var padding = _this.options.padding;
            var space = _this.calcSpaceAndPadding().space;
            var point = _this.transMat.inverse().transformPoint(domPoint);
            var idx = Math.round((point.x - padding + space / 2) / space);
            var idy = Math.round((point.y - padding + space / 2) / space) + offsetY;
            var xx = idx * space;
            var yy = idy * space;
            var pointOnCanvas = new DOMPoint(xx, yy);
            var p = _this.transMat.transformPoint(pointOnCanvas);
            _this.actualCursorPoint = p;
            _this.actualCursorPosition = [idx - 1, idy - 1];
            if (((_b = (_a = _this.preventMoveMat) === null || _a === void 0 ? void 0 : _a[idx - 1]) === null || _b === void 0 ? void 0 : _b[idy - 1]) === 1) {
                _this.cursorPosition = [-1, -1];
                _this.cursorPoint = new DOMPoint();
                _this.drawCursor();
                return;
            }
            _this.cursorPoint = p;
            _this.cursorPosition = [idx - 1, idy - 1];
            _this.drawCursor();
            if (isMobileDevice())
                _this.drawBoard();
        };
        this.onMouseMove = function (e) {
            var canvas = _this.cursorCanvas;
            if (!canvas)
                return;
            e.preventDefault();
            var point = new DOMPoint(e.offsetX * dpr, e.offsetY * dpr);
            _this.setCursorWithRender(point);
        };
        this.calcTouchPoint = function (e) {
            var point = new DOMPoint();
            var canvas = _this.cursorCanvas;
            if (!canvas)
                return point;
            var rect = canvas.getBoundingClientRect();
            var touches = e.changedTouches;
            point = new DOMPoint((touches[0].clientX - rect.left) * dpr, (touches[0].clientY - rect.top) * dpr);
            return point;
        };
        this.onTouchStart = function (e) {
            var canvas = _this.cursorCanvas;
            if (!canvas)
                return;
            e.preventDefault();
            _this.touchMoving = true;
            var point = _this.calcTouchPoint(e);
            _this.touchStartPoint = point;
            _this.setCursorWithRender(point);
        };
        this.onTouchMove = function (e) {
            var canvas = _this.cursorCanvas;
            if (!canvas)
                return;
            e.preventDefault();
            _this.touchMoving = true;
            var point = _this.calcTouchPoint(e);
            var offset = 0;
            var distance = 10;
            if (Math.abs(point.x - _this.touchStartPoint.x) > distance ||
                Math.abs(point.y - _this.touchStartPoint.y) > distance) {
                offset = _this.options.mobileIndicatorOffset;
            }
            _this.setCursorWithRender(point, offset);
        };
        this.onTouchEnd = function () {
            _this.touchMoving = false;
        };
        this.calcCenter = function () {
            var visibleArea = _this.visibleArea;
            var boardSize = _this.options.boardSize;
            if ((visibleArea[0][0] === 0 && visibleArea[0][1] === boardSize - 1) ||
                (visibleArea[1][0] === 0 && visibleArea[1][1] === boardSize - 1)) {
                return exports.Center.Center;
            }
            if (visibleArea[0][0] === 0) {
                if (visibleArea[1][0] === 0)
                    return exports.Center.TopLeft;
                else if (visibleArea[1][1] === boardSize - 1)
                    return exports.Center.BottomLeft;
                else
                    return exports.Center.Left;
            }
            else if (visibleArea[0][1] === boardSize - 1) {
                if (visibleArea[1][0] === 0)
                    return exports.Center.TopRight;
                else if (visibleArea[1][1] === boardSize - 1)
                    return exports.Center.BottomRight;
                else
                    return exports.Center.Right;
            }
            else {
                if (visibleArea[1][0] === 0)
                    return exports.Center.Top;
                else if (visibleArea[1][1] === boardSize - 1)
                    return exports.Center.Bottom;
                else
                    return exports.Center.Center;
            }
        };
        this.clearAllCanvas = function () {
            _this.clearCanvas(_this.board);
            _this.clearCanvas();
            _this.clearCanvas(_this.markupCanvas);
            _this.clearCanvas(_this.effectCanvas);
            _this.clearCursorCanvas();
            _this.clearAnalysisCanvas();
        };
        this.clearBoard = function () {
            if (!_this.board)
                return;
            var ctx = _this.board.getContext('2d');
            if (ctx) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.restore();
            }
        };
        this.clearCanvas = function (canvas) {
            if (canvas === void 0) { canvas = _this.canvas; }
            if (!canvas)
                return;
            var ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }
        };
        this.clearMarkupCanvas = function () {
            if (!_this.markupCanvas)
                return;
            var ctx = _this.markupCanvas.getContext('2d');
            if (ctx) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, _this.markupCanvas.width, _this.markupCanvas.height);
                ctx.restore();
            }
        };
        this.clearCursorCanvas = function () {
            if (!_this.cursorCanvas)
                return;
            _this.options.boardSize;
            var ctx = _this.cursorCanvas.getContext('2d');
            if (ctx) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, _this.cursorCanvas.width, _this.cursorCanvas.height);
                ctx.restore();
            }
        };
        this.clearAnalysisCanvas = function () {
            if (!_this.analysisCanvas)
                return;
            var ctx = _this.analysisCanvas.getContext('2d');
            if (ctx) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, _this.analysisCanvas.width, _this.analysisCanvas.height);
                ctx.restore();
            }
        };
        this.drawAnalysis = function (analysis) {
            if (analysis === void 0) { analysis = _this.analysis; }
            var canvas = _this.analysisCanvas;
            var _a = _this.options, _b = _a.theme, theme = _b === void 0 ? exports.Theme.BlackAndWhite : _b, analysisPointTheme = _a.analysisPointTheme, boardSize = _a.boardSize; _a.forceAnalysisBoardSize;
            var _c = _this, mat = _c.mat, markup = _c.markup;
            if (!canvas || !analysis)
                return;
            var ctx = canvas.getContext('2d');
            if (!ctx)
                return;
            _this.clearAnalysisCanvas();
            var rootInfo = analysis.rootInfo;
            analysis.moveInfos.forEach(function (m) {
                if (m.move === 'pass')
                    return;
                var idObj = JSON.parse(analysis.id);
                var analysisBoardSize = boardSize;
                var offsetedMove = offsetA1Move(m.move, 0, analysisBoardSize - idObj.by);
                var _a = a1ToPos(offsetedMove), i = _a.x, j = _a.y;
                if (mat[i][j] !== 0)
                    return;
                var _b = _this.calcSpaceAndPadding(), space = _b.space, scaledPadding = _b.scaledPadding;
                var x = scaledPadding + i * space;
                var y = scaledPadding + j * space;
                var ratio = 0.46;
                ctx.save();
                if (theme !== exports.Theme.Subdued &&
                    theme !== exports.Theme.BlackAndWhite &&
                    theme !== exports.Theme.Flat &&
                    theme !== exports.Theme.Warm &&
                    theme !== exports.Theme.Dark) {
                    ctx.shadowOffsetX = 30;
                    ctx.shadowOffsetY = 30;
                    ctx.shadowColor = _this.getThemeProperty(exports.ThemePropertyKey.ShadowColor);
                    ctx.shadowBlur = 8;
                }
                else {
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowColor = '#fff';
                    ctx.shadowBlur = 0;
                }
                var outlineColor;
                if (markup[i][j].includes(exports.Markup.PositiveNode)) {
                    outlineColor = _this.getThemeProperty(exports.ThemePropertyKey.PositiveNodeColor);
                }
                if (markup[i][j].includes(exports.Markup.NegativeNode)) {
                    outlineColor = _this.getThemeProperty(exports.ThemePropertyKey.NegativeNodeColor);
                }
                if (markup[i][j].includes(exports.Markup.NeutralNode)) {
                    outlineColor = _this.getThemeProperty(exports.ThemePropertyKey.NeutralNodeColor);
                }
                var point = new AnalysisPoint(ctx, x, y, space * ratio, rootInfo, m, analysisPointTheme, outlineColor);
                point.draw();
                ctx.restore();
            });
        };
        this.drawMarkup = function (mat, markup, markupCanvas, clear) {
            if (mat === void 0) { mat = _this.mat; }
            if (markup === void 0) { markup = _this.markup; }
            if (markupCanvas === void 0) { markupCanvas = _this.markupCanvas; }
            if (clear === void 0) { clear = true; }
            var canvas = markupCanvas;
            _this.options.theme;
            if (canvas) {
                if (clear)
                    _this.clearCanvas(canvas);
                var _loop_2 = function (i) {
                    var _loop_3 = function (j) {
                        var values = markup[i][j];
                        values === null || values === void 0 ? void 0 : values.split('|').forEach(function (value) {
                            if (value !== null && value !== '') {
                                var _a = _this.calcSpaceAndPadding(), space = _a.space, scaledPadding = _a.scaledPadding;
                                var x = scaledPadding + i * space;
                                var y = scaledPadding + j * space;
                                var ki = mat[i][j];
                                var markup_1;
                                var ctx = canvas.getContext('2d');
                                if (ctx) {
                                    switch (value) {
                                        case exports.Markup.Circle: {
                                            markup_1 = new CircleMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                                            break;
                                        }
                                        case exports.Markup.Current: {
                                            markup_1 = new CircleSolidMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                                            break;
                                        }
                                        case exports.Markup.PositiveActiveNode:
                                        case exports.Markup.PositiveDashedActiveNode:
                                        case exports.Markup.PositiveDottedActiveNode:
                                        case exports.Markup.NegativeActiveNode:
                                        case exports.Markup.NegativeDashedActiveNode:
                                        case exports.Markup.NegativeDottedActiveNode:
                                        case exports.Markup.NeutralActiveNode:
                                        case exports.Markup.NeutralDashedActiveNode:
                                        case exports.Markup.NeutralDottedActiveNode:
                                        case exports.Markup.WarningActiveNode:
                                        case exports.Markup.WarningDashedActiveNode:
                                        case exports.Markup.WarningDottedActiveNode:
                                        case exports.Markup.DefaultActiveNode:
                                        case exports.Markup.DefaultDashedActiveNode:
                                        case exports.Markup.DefaultDottedActiveNode: {
                                            var _b = _this.nodeMarkupStyles[value], color = _b.color, lineDash = _b.lineDash;
                                            markup_1 = new ActiveNodeMarkup(ctx, x, y, space, ki, _this.createThemeContext(), exports.Markup.Circle);
                                            markup_1.setColor(color);
                                            markup_1.setLineDash(lineDash);
                                            break;
                                        }
                                        case exports.Markup.PositiveNode:
                                        case exports.Markup.PositiveDashedNode:
                                        case exports.Markup.PositiveDottedNode:
                                        case exports.Markup.NegativeNode:
                                        case exports.Markup.NegativeDashedNode:
                                        case exports.Markup.NegativeDottedNode:
                                        case exports.Markup.NeutralNode:
                                        case exports.Markup.NeutralDashedNode:
                                        case exports.Markup.NeutralDottedNode:
                                        case exports.Markup.WarningNode:
                                        case exports.Markup.WarningDashedNode:
                                        case exports.Markup.WarningDottedNode:
                                        case exports.Markup.DefaultNode:
                                        case exports.Markup.DefaultDashedNode:
                                        case exports.Markup.DefaultDottedNode:
                                        case exports.Markup.Node: {
                                            var _c = _this.nodeMarkupStyles[value], color = _c.color, lineDash = _c.lineDash;
                                            markup_1 = new NodeMarkup(ctx, x, y, space, ki, _this.createThemeContext(), exports.Markup.Circle);
                                            markup_1.setColor(color);
                                            markup_1.setLineDash(lineDash);
                                            break;
                                        }
                                        case exports.Markup.Square: {
                                            markup_1 = new SquareMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                                            break;
                                        }
                                        case exports.Markup.Triangle: {
                                            markup_1 = new TriangleMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                                            break;
                                        }
                                        case exports.Markup.Cross: {
                                            markup_1 = new CrossMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                                            break;
                                        }
                                        case exports.Markup.Highlight: {
                                            markup_1 = new HighlightMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                                            break;
                                        }
                                        default: {
                                            if (value !== '') {
                                                markup_1 = new TextMarkup(ctx, x, y, space, ki, _this.createThemeContext(), value);
                                            }
                                            break;
                                        }
                                    }
                                    markup_1 === null || markup_1 === void 0 ? void 0 : markup_1.draw();
                                }
                            }
                        });
                    };
                    for (var j = 0; j < markup[i].length; j++) {
                        _loop_3(j);
                    }
                };
                for (var i = 0; i < markup.length; i++) {
                    _loop_2(i);
                }
            }
        };
        this.drawBoard = function (board, clear) {
            if (board === void 0) { board = _this.board; }
            if (clear === void 0) { clear = true; }
            if (clear)
                _this.clearCanvas(board);
            _this.drawBan(board);
            _this.drawBoardLine(board);
            _this.drawStars(board);
            if (_this.options.coordinate) {
                _this.drawCoordinate();
            }
        };
        this.drawBan = function (board) {
            if (board === void 0) { board = _this.board; }
            var _a = _this.options, theme = _a.theme, themeResources = _a.themeResources; _a.padding;
            if (board) {
                board.style.borderRadius = '2px';
                var ctx = board.getContext('2d');
                if (ctx) {
                    setImageSmoothingQuality(ctx);
                    if (theme === exports.Theme.BlackAndWhite ||
                        theme === exports.Theme.Flat ||
                        theme === exports.Theme.Warm ||
                        theme === exports.Theme.Dark ||
                        theme === exports.Theme.HighContrast) {
                        board.style.boxShadow =
                            theme === exports.Theme.BlackAndWhite ? '0px 0px 0px #000000' : '';
                        ctx.fillStyle = _this.getThemeProperty(exports.ThemePropertyKey.BoardBackgroundColor);
                        // ctx.fillRect(
                        //   -padding,
                        //   -padding,
                        //   board.width + padding,
                        //   board.height + padding
                        // );
                        ctx.fillRect(0, 0, board.width, board.height);
                    }
                    else {
                        var boardPixelSize = board.width;
                        var resources = getThemeResources(theme, themeResources, boardPixelSize);
                        if (resources && resources.board) {
                            var boardUrl = resources.board;
                            var boardRes = images[boardUrl];
                            if (boardRes) {
                                if (theme === exports.Theme.Walnut || theme === exports.Theme.YunziMonkeyDark) {
                                    ctx.drawImage(boardRes, 0, 0, board.width, board.height);
                                }
                                else {
                                    var pattern = ctx.createPattern(boardRes, 'repeat');
                                    if (pattern) {
                                        ctx.fillStyle = pattern;
                                        ctx.fillRect(0, 0, board.width, board.height);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        this.drawBoardLine = function (board) {
            if (board === void 0) { board = _this.board; }
            if (!board)
                return;
            var _a = _this, visibleArea = _a.visibleArea, options = _a.options, mat = _a.mat, preventMoveMat = _a.preventMoveMat, cursorPosition = _a.cursorPosition;
            var zoom = options.zoom, boardSize = options.boardSize, adaptiveBoardLine = options.adaptiveBoardLine; options.theme;
            var boardLineWidth = _this.getThemeProperty(exports.ThemePropertyKey.BoardLineWidth);
            var boardEdgeLineWidth = _this.getThemeProperty(exports.ThemePropertyKey.BoardEdgeLineWidth);
            var boardLineExtent = _this.getThemeProperty(exports.ThemePropertyKey.BoardLineExtent);
            var ctx = board.getContext('2d');
            if (ctx) {
                var _b = _this.calcSpaceAndPadding(), space = _b.space, scaledPadding = _b.scaledPadding;
                var extendSpace = zoom ? boardLineExtent * space : 0;
                var activeColor = _this.getThemeProperty(exports.ThemePropertyKey.ActiveColor);
                var inactiveColor = _this.getThemeProperty(exports.ThemePropertyKey.InactiveColor);
                ctx.fillStyle = _this.getThemeProperty(exports.ThemePropertyKey.BoardLineColor);
                var adaptiveFactor = 0.001;
                var touchingFactor = 2.5;
                var edgeLineWidth = adaptiveBoardLine
                    ? board.width * adaptiveFactor * 2
                    : boardEdgeLineWidth;
                var lineWidth = adaptiveBoardLine
                    ? board.width * adaptiveFactor
                    : boardLineWidth;
                var allowMove = canMove(mat, cursorPosition[0], cursorPosition[1], _this.turn) &&
                    preventMoveMat[cursorPosition[0]][cursorPosition[1]] === 0;
                for (var i = visibleArea[0][0]; i <= visibleArea[0][1]; i++) {
                    ctx.beginPath();
                    if ((visibleArea[0][0] === 0 && i === 0) ||
                        (visibleArea[0][1] === boardSize - 1 && i === boardSize - 1)) {
                        ctx.lineWidth = edgeLineWidth;
                    }
                    else {
                        ctx.lineWidth = lineWidth;
                    }
                    if (isMobileDevice() &&
                        i === _this.cursorPosition[0] &&
                        _this.touchMoving) {
                        ctx.lineWidth = ctx.lineWidth * touchingFactor;
                        ctx.strokeStyle = allowMove ? activeColor : inactiveColor;
                    }
                    else {
                        ctx.strokeStyle = activeColor;
                    }
                    var startPointY = i === 0 || i === boardSize - 1
                        ? scaledPadding + visibleArea[1][0] * space - edgeLineWidth / 2
                        : scaledPadding + visibleArea[1][0] * space;
                    if (isMobileDevice()) {
                        startPointY += dpr / 2;
                    }
                    var endPointY = i === 0 || i === boardSize - 1
                        ? space * visibleArea[1][1] + scaledPadding + edgeLineWidth / 2
                        : space * visibleArea[1][1] + scaledPadding;
                    if (isMobileDevice()) {
                        endPointY -= dpr / 2;
                    }
                    if (visibleArea[1][0] > 0)
                        startPointY -= extendSpace;
                    if (visibleArea[1][1] < boardSize - 1)
                        endPointY += extendSpace;
                    ctx.moveTo(i * space + scaledPadding, startPointY);
                    ctx.lineTo(i * space + scaledPadding, endPointY);
                    ctx.stroke();
                }
                for (var i = visibleArea[1][0]; i <= visibleArea[1][1]; i++) {
                    ctx.beginPath();
                    if ((visibleArea[1][0] === 0 && i === 0) ||
                        (visibleArea[1][1] === boardSize - 1 && i === boardSize - 1)) {
                        ctx.lineWidth = edgeLineWidth;
                    }
                    else {
                        ctx.lineWidth = lineWidth;
                    }
                    if (isMobileDevice() &&
                        i === _this.cursorPosition[1] &&
                        _this.touchMoving) {
                        ctx.lineWidth = ctx.lineWidth * touchingFactor;
                        ctx.strokeStyle = allowMove ? activeColor : inactiveColor;
                    }
                    else {
                        ctx.strokeStyle = activeColor;
                    }
                    var startPointX = i === 0 || i === boardSize - 1
                        ? scaledPadding + visibleArea[0][0] * space - edgeLineWidth / 2
                        : scaledPadding + visibleArea[0][0] * space;
                    var endPointX = i === 0 || i === boardSize - 1
                        ? space * visibleArea[0][1] + scaledPadding + edgeLineWidth / 2
                        : space * visibleArea[0][1] + scaledPadding;
                    if (isMobileDevice()) {
                        startPointX += dpr / 2;
                    }
                    if (isMobileDevice()) {
                        endPointX -= dpr / 2;
                    }
                    if (visibleArea[0][0] > 0)
                        startPointX -= extendSpace;
                    if (visibleArea[0][1] < boardSize - 1)
                        endPointX += extendSpace;
                    ctx.moveTo(startPointX, i * space + scaledPadding);
                    ctx.lineTo(endPointX, i * space + scaledPadding);
                    ctx.stroke();
                }
            }
        };
        this.drawStars = function (board) {
            if (board === void 0) { board = _this.board; }
            if (!board)
                return;
            if (_this.options.boardSize !== 19)
                return;
            var adaptiveStarSize = _this.options.adaptiveStarSize;
            var starSizeOptions = _this.getThemeProperty(exports.ThemePropertyKey.StarSize);
            var visibleArea = _this.visibleArea;
            var ctx = board.getContext('2d');
            var starSize = adaptiveStarSize ? board.width * 0.0035 : starSizeOptions;
            if (ctx) {
                var _a = _this.calcSpaceAndPadding(), space_1 = _a.space, scaledPadding_1 = _a.scaledPadding;
                ctx.stroke();
                [3, 9, 15].forEach(function (i) {
                    [3, 9, 15].forEach(function (j) {
                        if (i >= visibleArea[0][0] &&
                            i <= visibleArea[0][1] &&
                            j >= visibleArea[1][0] &&
                            j <= visibleArea[1][1]) {
                            ctx.beginPath();
                            ctx.arc(i * space_1 + scaledPadding_1, j * space_1 + scaledPadding_1, starSize, 0, 2 * Math.PI, true);
                            ctx.fillStyle = _this.getThemeProperty('boardLineColor');
                            ctx.fill();
                        }
                    });
                });
            }
        };
        this.drawCoordinate = function () {
            var _a = _this, board = _a.board, options = _a.options, visibleArea = _a.visibleArea;
            if (!board)
                return;
            var boardSize = options.boardSize; options.zoom; var padding = options.padding; options.theme;
            var boardLineExtent = _this.getThemeProperty('boardLineExtent');
            var zoomedBoardSize = visibleArea[0][1] - visibleArea[0][0] + 1;
            var ctx = board.getContext('2d');
            var _b = _this.calcSpaceAndPadding(), space = _b.space, scaledPadding = _b.scaledPadding;
            if (ctx) {
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillStyle = _this.getThemeProperty('boardLineColor');
                ctx.font = "bold ".concat(space / 3, "px Helvetica");
                var center_1 = _this.calcCenter();
                var offset_1 = space / 1.5;
                if (center_1 === exports.Center.Center &&
                    visibleArea[0][0] === 0 &&
                    visibleArea[0][1] === boardSize - 1) {
                    offset_1 -= scaledPadding / 2;
                }
                A1_LETTERS.forEach(function (l, index) {
                    var x = space * index + scaledPadding;
                    var offsetTop = offset_1;
                    var offsetBottom = offset_1;
                    if (center_1 === exports.Center.TopLeft ||
                        center_1 === exports.Center.TopRight ||
                        center_1 === exports.Center.Top) {
                        offsetTop -= space * boardLineExtent;
                    }
                    if (center_1 === exports.Center.BottomLeft ||
                        center_1 === exports.Center.BottomRight ||
                        center_1 === exports.Center.Bottom) {
                        offsetBottom -= (space * boardLineExtent) / 2;
                    }
                    var y1 = visibleArea[1][0] * space + padding - offsetTop;
                    var y2 = y1 + zoomedBoardSize * space + offsetBottom * 2;
                    if (index >= visibleArea[0][0] && index <= visibleArea[0][1]) {
                        if (center_1 !== exports.Center.BottomLeft &&
                            center_1 !== exports.Center.BottomRight &&
                            center_1 !== exports.Center.Bottom) {
                            ctx.fillText(l, x, y1);
                        }
                        if (center_1 !== exports.Center.TopLeft &&
                            center_1 !== exports.Center.TopRight &&
                            center_1 !== exports.Center.Top) {
                            ctx.fillText(l, x, y2);
                        }
                    }
                });
                A1_NUMBERS.slice(-_this.options.boardSize).forEach(function (l, index) {
                    var y = space * index + scaledPadding;
                    var offsetLeft = offset_1;
                    var offsetRight = offset_1;
                    if (center_1 === exports.Center.TopLeft ||
                        center_1 === exports.Center.BottomLeft ||
                        center_1 === exports.Center.Left) {
                        offsetLeft -= space * boardLineExtent;
                    }
                    if (center_1 === exports.Center.TopRight ||
                        center_1 === exports.Center.BottomRight ||
                        center_1 === exports.Center.Right) {
                        offsetRight -= (space * boardLineExtent) / 2;
                    }
                    var x1 = visibleArea[0][0] * space + padding - offsetLeft;
                    var x2 = x1 + zoomedBoardSize * space + 2 * offsetRight;
                    if (index >= visibleArea[1][0] && index <= visibleArea[1][1]) {
                        if (center_1 !== exports.Center.TopRight &&
                            center_1 !== exports.Center.BottomRight &&
                            center_1 !== exports.Center.Right) {
                            ctx.fillText(l.toString(), x1, y);
                        }
                        if (center_1 !== exports.Center.TopLeft &&
                            center_1 !== exports.Center.BottomLeft &&
                            center_1 !== exports.Center.Left) {
                            ctx.fillText(l.toString(), x2, y);
                        }
                    }
                });
            }
        };
        this.calcSpaceAndPadding = function (canvas) {
            if (canvas === void 0) { canvas = _this.canvas; }
            var space = 0;
            var scaledPadding = 0;
            var scaledBoardExtent = 0;
            if (canvas) {
                var _a = _this.options, padding = _a.padding, boardSize = _a.boardSize, zoom = _a.zoom;
                var boardLineExtent = _this.getThemeProperty('boardLineExtent');
                var visibleArea = _this.visibleArea;
                if ((visibleArea[0][0] !== 0 && visibleArea[0][1] === boardSize - 1) ||
                    (visibleArea[1][0] !== 0 && visibleArea[1][1] === boardSize - 1)) {
                    scaledBoardExtent = boardLineExtent;
                }
                if ((visibleArea[0][0] !== 0 && visibleArea[0][1] !== boardSize - 1) ||
                    (visibleArea[1][0] !== 0 && visibleArea[1][1] !== boardSize - 1)) {
                    scaledBoardExtent = boardLineExtent * 2;
                }
                var divisor = zoom ? boardSize + scaledBoardExtent : boardSize;
                space = (canvas.width - padding * 2) / Math.ceil(divisor);
                scaledPadding = padding + space / 2;
            }
            return { space: space, scaledPadding: scaledPadding, scaledBoardExtent: scaledBoardExtent };
        };
        this.playEffect = function (mat, effectMat, clear) {
            if (mat === void 0) { mat = _this.mat; }
            if (effectMat === void 0) { effectMat = _this.effectMat; }
            if (clear === void 0) { clear = true; }
            var canvas = _this.effectCanvas;
            if (canvas) {
                if (clear)
                    _this.clearCanvas(canvas);
                for (var i = 0; i < effectMat.length; i++) {
                    for (var j = 0; j < effectMat[i].length; j++) {
                        var value = effectMat[i][j];
                        var _a = _this.calcSpaceAndPadding(), space = _a.space, scaledPadding = _a.scaledPadding;
                        var x = scaledPadding + i * space;
                        var y = scaledPadding + j * space;
                        var ki = mat[i][j];
                        var effect = void 0;
                        var ctx = canvas.getContext('2d');
                        if (ctx) {
                            switch (value) {
                                case exports.Effect.Ban: {
                                    effect = new BanEffect(ctx, x, y, space, ki);
                                    effect.play();
                                    break;
                                }
                            }
                            effectMat[i][j] = exports.Effect.None;
                        }
                    }
                }
                var boardSize = _this.options.boardSize;
                _this.setEffectMat(empty([boardSize, boardSize]));
            }
        };
        this.drawCursor = function () {
            var _a, _b;
            var canvas = _this.cursorCanvas;
            if (canvas) {
                _this.clearCursorCanvas();
                if (_this.cursor === exports.Cursor.None)
                    return;
                if (isMobileDevice() && !_this.touchMoving)
                    return;
                var _c = _this.options, padding = _c.padding; _c.theme;
                var ctx = canvas.getContext('2d');
                var space = _this.calcSpaceAndPadding().space;
                var _d = _this, visibleArea = _d.visibleArea, cursor = _d.cursor, cursorValue = _d.cursorValue;
                var _e = tslib.__read(_this.cursorPosition, 2), idx = _e[0], idy = _e[1];
                if (idx < visibleArea[0][0] || idx > visibleArea[0][1])
                    return;
                if (idy < visibleArea[1][0] || idy > visibleArea[1][1])
                    return;
                var x = idx * space + space / 2 + padding;
                var y = idy * space + space / 2 + padding;
                var ki = ((_b = (_a = _this.mat) === null || _a === void 0 ? void 0 : _a[idx]) === null || _b === void 0 ? void 0 : _b[idy]) || exports.Ki.Empty;
                if (ctx) {
                    var cur = void 0;
                    var size = space * 0.8;
                    if (cursor === exports.Cursor.Circle) {
                        cur = new CircleMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (cursor === exports.Cursor.Square) {
                        cur = new SquareMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (cursor === exports.Cursor.Triangle) {
                        cur = new TriangleMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (cursor === exports.Cursor.Cross) {
                        cur = new CrossMarkup(ctx, x, y, space, ki, _this.createThemeContext());
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (cursor === exports.Cursor.Text) {
                        cur = new TextMarkup(ctx, x, y, space, ki, _this.createThemeContext(), cursorValue);
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (ki === exports.Ki.Empty && cursor === exports.Cursor.BlackStone) {
                        cur = new FlatStone(ctx, x, y, exports.Ki.Black, _this.createThemeContext());
                        cur.setSize(size);
                        cur.setGlobalAlpha(0.5);
                    }
                    else if (ki === exports.Ki.Empty && cursor === exports.Cursor.WhiteStone) {
                        cur = new FlatStone(ctx, x, y, exports.Ki.White, _this.createThemeContext());
                        cur.setSize(size);
                        cur.setGlobalAlpha(0.5);
                    }
                    else if (cursor === exports.Cursor.Clear) {
                        cur = new FlatStone(ctx, x, y, exports.Ki.Empty, _this.createThemeContext());
                        cur.setSize(size);
                    }
                    cur === null || cur === void 0 ? void 0 : cur.draw();
                }
            }
        };
        this.drawStones = function (mat, canvas, clear) {
            if (mat === void 0) { mat = _this.mat; }
            if (canvas === void 0) { canvas = _this.canvas; }
            if (clear === void 0) { clear = true; }
            var _a = _this.options, _b = _a.theme, theme = _b === void 0 ? exports.Theme.BlackAndWhite : _b, themeResources = _a.themeResources;
            if (clear)
                _this.clearCanvas();
            if (canvas) {
                for (var i = 0; i < mat.length; i++) {
                    for (var j = 0; j < mat[i].length; j++) {
                        var value = mat[i][j];
                        if (value !== 0) {
                            var ctx = canvas.getContext('2d');
                            if (ctx) {
                                setImageSmoothingQuality(ctx);
                                var _c = _this.calcSpaceAndPadding(), space = _c.space, scaledPadding = _c.scaledPadding;
                                var x = scaledPadding + i * space;
                                var y = scaledPadding + j * space;
                                var ratio = _this.getThemeProperty('stoneRatio');
                                ctx.save();
                                if (theme !== exports.Theme.Subdued &&
                                    theme !== exports.Theme.BlackAndWhite &&
                                    theme !== exports.Theme.Flat &&
                                    theme !== exports.Theme.Warm &&
                                    theme !== exports.Theme.Dark &&
                                    theme !== exports.Theme.HighContrast) {
                                    ctx.shadowOffsetX = 3;
                                    ctx.shadowOffsetY = 3;
                                    ctx.shadowColor = _this.getThemeProperty('shadowColor');
                                    ctx.shadowBlur = 8;
                                }
                                else {
                                    ctx.shadowOffsetX = 0;
                                    ctx.shadowOffsetY = 0;
                                    ctx.shadowBlur = 0;
                                }
                                var stone = void 0;
                                switch (theme) {
                                    case exports.Theme.BlackAndWhite:
                                    case exports.Theme.Flat:
                                    case exports.Theme.Warm:
                                    case exports.Theme.HighContrast: {
                                        stone = new FlatStone(ctx, x, y, value, _this.createThemeContext());
                                        stone.setSize(space * ratio * 2);
                                        break;
                                    }
                                    case exports.Theme.Dark: {
                                        stone = new FlatStone(ctx, x, y, value, _this.createThemeContext());
                                        stone.setSize(space * ratio * 2);
                                        break;
                                    }
                                    default: {
                                        var boardPixelSize = (canvas === null || canvas === void 0 ? void 0 : canvas.width) || 512;
                                        var resources = getThemeResources(theme, themeResources, boardPixelSize);
                                        if (resources) {
                                            var blacks = resources.blacks.map(function (i) { return images[i]; });
                                            var whites = resources.whites.map(function (i) { return images[i]; });
                                            var mod = i + 10 + j;
                                            stone = new ImageStone(ctx, x, y, value, mod, blacks, whites, _this.createThemeContext());
                                            stone.setSize(space * ratio * 2);
                                        }
                                    }
                                }
                                stone === null || stone === void 0 ? void 0 : stone.draw();
                                ctx.restore();
                            }
                        }
                    }
                }
            }
        };
        this.options = tslib.__assign(tslib.__assign(tslib.__assign({}, this.defaultOptions), options), { themeOptions: tslib.__assign(tslib.__assign({}, this.defaultOptions.themeOptions), (options.themeOptions || {})) });
        var size = this.options.boardSize;
        this.mat = zeros([size, size]);
        this.preventMoveMat = zeros([size, size]);
        this.markup = empty([size, size]);
        this.effectMat = empty([size, size]);
        this.turn = exports.Ki.Black;
        this.cursorPosition = [-1, -1];
        this.actualCursorPosition = [-1, -1];
        this.maxhv = size;
        this.transMat = new DOMMatrix();
        this.analysis = null;
        this.visibleArea = [
            [0, size - 1],
            [0, size - 1],
        ];
        this.updateNodeMarkupStyles();
    }
    GhostBan.prototype.getThemeProperty = function (propertyKey) {
        var key = typeof propertyKey === 'string' ? propertyKey : propertyKey;
        var currentTheme = this.options.theme;
        var themeConfig = this.options.themeOptions[currentTheme] || {};
        var defaultConfig = this.options.themeOptions.default || {};
        var result = (themeConfig[key] ||
            defaultConfig[key]);
        return result;
    };
    /**
     * Create theme context for markup components
     */
    GhostBan.prototype.createThemeContext = function () {
        return {
            theme: this.options.theme,
            themeOptions: this.options.themeOptions,
        };
    };
    GhostBan.prototype.updateNodeMarkupStyles = function () {
        var _a;
        var defaultDashedLineDash = [8, 6];
        var defaultDottedLineDash = [4, 4];
        this.nodeMarkupStyles = (_a = {},
            _a[exports.Markup.PositiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.PositiveNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.NegativeNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NegativeNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.NeutralNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NeutralNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.DefaultNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.DefaultNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.WarningNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.WarningNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.PositiveDashedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.PositiveNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.NegativeDashedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NegativeNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.NeutralDashedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NeutralNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.DefaultDashedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.DefaultNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.WarningDashedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.WarningNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.PositiveDottedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.PositiveNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.NegativeDottedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NegativeNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.NeutralDottedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NeutralNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.DefaultDottedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.DefaultNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.WarningDottedNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.WarningNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.PositiveActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.PositiveNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.NegativeActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NegativeNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.NeutralActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NeutralNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.DefaultActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.DefaultNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.WarningActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.WarningNodeColor),
                lineDash: [],
            },
            _a[exports.Markup.PositiveDashedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.PositiveNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.NegativeDashedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NegativeNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.NeutralDashedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NeutralNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.DefaultDashedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.DefaultNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.WarningDashedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.WarningNodeColor),
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.PositiveDottedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.PositiveNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.NegativeDottedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NegativeNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.NeutralDottedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.NeutralNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.DefaultDottedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.DefaultNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.WarningDottedActiveNode] = {
                color: this.getThemeProperty(exports.ThemePropertyKey.WarningNodeColor),
                lineDash: defaultDottedLineDash,
            },
            _a);
    };
    GhostBan.prototype.setTurn = function (turn) {
        this.turn = turn;
    };
    GhostBan.prototype.setBoardSize = function (size) {
        this.options.boardSize = Math.min(size, MAX_BOARD_SIZE);
    };
    GhostBan.prototype.resize = function () {
        if (!this.canvas ||
            !this.cursorCanvas ||
            !this.dom ||
            !this.board ||
            !this.markupCanvas ||
            !this.analysisCanvas ||
            !this.effectCanvas)
            return;
        var canvases = [
            this.board,
            this.canvas,
            this.markupCanvas,
            this.cursorCanvas,
            this.analysisCanvas,
            this.effectCanvas,
        ];
        var size = this.options.size;
        var clientWidth = this.dom.clientWidth;
        canvases.forEach(function (canvas) {
            if (size) {
                canvas.width = size * dpr;
                canvas.height = size * dpr;
            }
            else {
                canvas.style.width = clientWidth + 'px';
                canvas.style.height = clientWidth + 'px';
                canvas.width = Math.floor(clientWidth * dpr);
                canvas.height = Math.floor(clientWidth * dpr);
            }
        });
        this.render();
    };
    GhostBan.prototype.createCanvas = function (id, pointerEvents) {
        if (pointerEvents === void 0) { pointerEvents = true; }
        var canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.id = id;
        if (!pointerEvents) {
            canvas.style.pointerEvents = 'none';
        }
        return canvas;
    };
    GhostBan.prototype.init = function (dom) {
        var _this = this;
        var size = this.options.boardSize;
        this.mat = zeros([size, size]);
        this.markup = empty([size, size]);
        this.transMat = new DOMMatrix();
        this.board = this.createCanvas('ghostban-board');
        this.canvas = this.createCanvas('ghostban-canvas');
        this.markupCanvas = this.createCanvas('ghostban-markup', false);
        this.cursorCanvas = this.createCanvas('ghostban-cursor');
        this.analysisCanvas = this.createCanvas('ghostban-analysis', false);
        this.effectCanvas = this.createCanvas('ghostban-effect', false);
        this.dom = dom;
        dom.innerHTML = '';
        dom.appendChild(this.board);
        dom.appendChild(this.canvas);
        dom.appendChild(this.markupCanvas);
        dom.appendChild(this.analysisCanvas);
        dom.appendChild(this.cursorCanvas);
        dom.appendChild(this.effectCanvas);
        this.resize();
        this.renderInteractive();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', function () {
                _this.resize();
            });
        }
    };
    GhostBan.prototype.setOptions = function (options) {
        this.options = tslib.__assign(tslib.__assign(tslib.__assign({}, this.options), options), { themeOptions: tslib.__assign(tslib.__assign({}, this.options.themeOptions), (options.themeOptions || {})) });
        this.updateNodeMarkupStyles();
        this.renderInteractive();
    };
    GhostBan.prototype.setMat = function (mat) {
        this.mat = mat;
        if (!this.visibleAreaMat) {
            this.visibleAreaMat = mat;
        }
    };
    GhostBan.prototype.setVisibleAreaMat = function (mat) {
        this.visibleAreaMat = mat;
    };
    GhostBan.prototype.setPreventMoveMat = function (mat) {
        this.preventMoveMat = mat;
    };
    GhostBan.prototype.setEffectMat = function (mat) {
        this.effectMat = mat;
    };
    GhostBan.prototype.setMarkup = function (markup) {
        this.markup = markup;
    };
    GhostBan.prototype.setCursor = function (cursor, value) {
        if (value === void 0) { value = ''; }
        this.cursor = cursor;
        this.cursorValue = value;
    };
    GhostBan.prototype.renderInteractive = function () {
        var canvas = this.cursorCanvas;
        if (!canvas)
            return;
        canvas.removeEventListener('mousemove', this.onMouseMove);
        canvas.removeEventListener('mouseout', this.onMouseMove);
        canvas.removeEventListener('touchstart', this.onTouchStart);
        canvas.removeEventListener('touchmove', this.onTouchMove);
        canvas.removeEventListener('touchend', this.onTouchEnd);
        if (this.options.interactive) {
            canvas.addEventListener('mousemove', this.onMouseMove);
            canvas.addEventListener('mouseout', this.onMouseMove);
            canvas.addEventListener('touchstart', this.onTouchStart);
            canvas.addEventListener('touchmove', this.onTouchMove);
            canvas.addEventListener('touchend', this.onTouchEnd);
        }
    };
    GhostBan.prototype.setAnalysis = function (analysis) {
        this.analysis = analysis;
        if (!analysis) {
            this.clearAnalysisCanvas();
            return;
        }
        if (this.options.showAnalysis)
            this.drawAnalysis(analysis);
    };
    GhostBan.prototype.setTheme = function (theme, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var themeResources = this.options.themeResources;
        if (!themeResources[theme])
            return;
        // Get all theme resources for preloading (all resolutions)
        var allThemeImages = getAllThemeResources(theme, themeResources);
        this.options.theme = theme;
        this.options = tslib.__assign(tslib.__assign(tslib.__assign(tslib.__assign({}, this.options), { theme: theme }), options), { themeOptions: tslib.__assign(tslib.__assign({}, this.options.themeOptions), (options.themeOptions || {})) });
        this.updateNodeMarkupStyles();
        // Redraw callback after image loading completes
        var onImageLoaded = function (url) {
            _this.drawBoard();
            _this.drawStones();
        };
        // Preload all theme resources (all resolutions)
        preload(allThemeImages, function () {
            _this.drawBoard();
            _this.render();
        }, onImageLoaded);
        this.drawBoard();
        this.render();
    };
    GhostBan.prototype.calcDynamicPadding = function (visibleAreaSize) {
        var coordinate = this.options.coordinate;
        var canvas = this.canvas;
        if (!canvas)
            return;
        var padding = canvas.width / (visibleAreaSize + 2) / 2;
        var paddingWithoutCoordinate = canvas.width / (visibleAreaSize + 2) / 4;
        this.options.padding = coordinate ? padding : paddingWithoutCoordinate;
    };
    GhostBan.prototype.zoomBoard = function (zoom) {
        if (zoom === void 0) { zoom = false; }
        var _a = this, canvas = _a.canvas, analysisCanvas = _a.analysisCanvas, board = _a.board, cursorCanvas = _a.cursorCanvas, markupCanvas = _a.markupCanvas, effectCanvas = _a.effectCanvas;
        if (!canvas)
            return;
        var _b = this.options, boardSize = _b.boardSize, extent = _b.extent, padding = _b.padding, dynamicPadding = _b.dynamicPadding;
        var boardLineExtent = this.getThemeProperty(exports.ThemePropertyKey.BoardLineExtent);
        var zoomedVisibleArea = calcVisibleArea(this.visibleAreaMat, extent, false);
        var ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
        var boardCtx = board === null || board === void 0 ? void 0 : board.getContext('2d');
        var cursorCtx = cursorCanvas === null || cursorCanvas === void 0 ? void 0 : cursorCanvas.getContext('2d');
        var markupCtx = markupCanvas === null || markupCanvas === void 0 ? void 0 : markupCanvas.getContext('2d');
        var analysisCtx = analysisCanvas === null || analysisCanvas === void 0 ? void 0 : analysisCanvas.getContext('2d');
        var effectCtx = effectCanvas === null || effectCanvas === void 0 ? void 0 : effectCanvas.getContext('2d');
        var visibleArea = zoom
            ? zoomedVisibleArea
            : [
                [0, boardSize - 1],
                [0, boardSize - 1],
            ];
        this.visibleArea = visibleArea;
        var visibleAreaSize = Math.max(visibleArea[0][1] - visibleArea[0][0], visibleArea[1][1] - visibleArea[1][0]);
        if (dynamicPadding) {
            this.calcDynamicPadding(visibleAreaSize);
        }
        else {
            this.options.padding = DEFAULT_OPTIONS.padding;
        }
        if (zoom) {
            var space = this.calcSpaceAndPadding().space;
            var center = this.calcCenter();
            if (dynamicPadding) {
                this.calcDynamicPadding(visibleAreaSize);
            }
            else {
                this.options.padding = DEFAULT_OPTIONS.padding;
            }
            var extraVisibleSize = boardLineExtent * 2 + 1;
            if (center === exports.Center.TopRight ||
                center === exports.Center.TopLeft ||
                center === exports.Center.BottomRight ||
                center === exports.Center.BottomLeft) {
                extraVisibleSize = boardLineExtent + 0.5;
            }
            var zoomedBoardSize = visibleAreaSize + extraVisibleSize;
            if (zoomedBoardSize < boardSize) {
                var scale = (canvas.width - padding * 2) / (zoomedBoardSize * space);
                var offsetX = visibleArea[0][0] * space * scale +
                    padding * scale -
                    padding -
                    (space * extraVisibleSize * scale) / 2 +
                    (space * scale) / 2;
                var offsetY = visibleArea[1][0] * space * scale +
                    padding * scale -
                    padding -
                    (space * extraVisibleSize * scale) / 2 +
                    (space * scale) / 2;
                this.transMat = new DOMMatrix();
                this.transMat.translateSelf(-offsetX, -offsetY);
                this.transMat.scaleSelf(scale, scale);
                ctx === null || ctx === void 0 ? void 0 : ctx.setTransform(this.transMat);
                boardCtx === null || boardCtx === void 0 ? void 0 : boardCtx.setTransform(this.transMat);
                analysisCtx === null || analysisCtx === void 0 ? void 0 : analysisCtx.setTransform(this.transMat);
                cursorCtx === null || cursorCtx === void 0 ? void 0 : cursorCtx.setTransform(this.transMat);
                markupCtx === null || markupCtx === void 0 ? void 0 : markupCtx.setTransform(this.transMat);
                effectCtx === null || effectCtx === void 0 ? void 0 : effectCtx.setTransform(this.transMat);
            }
            else {
                this.resetTransform();
            }
        }
        else {
            this.resetTransform();
        }
    };
    GhostBan.prototype.calcBoardVisibleArea = function (zoom) {
        this.zoomBoard(this.options.zoom);
    };
    GhostBan.prototype.resetTransform = function () {
        var _a = this, canvas = _a.canvas, analysisCanvas = _a.analysisCanvas, board = _a.board, cursorCanvas = _a.cursorCanvas, markupCanvas = _a.markupCanvas, effectCanvas = _a.effectCanvas;
        var ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
        var boardCtx = board === null || board === void 0 ? void 0 : board.getContext('2d');
        var cursorCtx = cursorCanvas === null || cursorCanvas === void 0 ? void 0 : cursorCanvas.getContext('2d');
        var markupCtx = markupCanvas === null || markupCanvas === void 0 ? void 0 : markupCanvas.getContext('2d');
        var analysisCtx = analysisCanvas === null || analysisCanvas === void 0 ? void 0 : analysisCanvas.getContext('2d');
        var effectCtx = effectCanvas === null || effectCanvas === void 0 ? void 0 : effectCanvas.getContext('2d');
        this.transMat = new DOMMatrix();
        ctx === null || ctx === void 0 ? void 0 : ctx.resetTransform();
        boardCtx === null || boardCtx === void 0 ? void 0 : boardCtx.resetTransform();
        analysisCtx === null || analysisCtx === void 0 ? void 0 : analysisCtx.resetTransform();
        cursorCtx === null || cursorCtx === void 0 ? void 0 : cursorCtx.resetTransform();
        markupCtx === null || markupCtx === void 0 ? void 0 : markupCtx.resetTransform();
        effectCtx === null || effectCtx === void 0 ? void 0 : effectCtx.resetTransform();
    };
    GhostBan.prototype.render = function () {
        var mat = this.mat;
        if (this.mat && mat[0])
            this.options.boardSize = mat[0].length;
        this.zoomBoard(this.options.zoom);
        this.zoomBoard(this.options.zoom);
        this.clearAllCanvas();
        this.drawBoard();
        this.drawStones();
        this.drawMarkup();
        this.drawCursor();
        if (this.options.showAnalysis)
            this.drawAnalysis();
    };
    GhostBan.prototype.renderInOneCanvas = function (canvas) {
        if (canvas === void 0) { canvas = this.canvas; }
        this.clearAllCanvas();
        this.drawBoard(canvas, false);
        this.drawStones(this.mat, canvas, false);
        this.drawMarkup(this.mat, this.markup, canvas, false);
    };
    return GhostBan;
}());

exports.A1_LETTERS = A1_LETTERS;
exports.A1_LETTERS_WITH_I = A1_LETTERS_WITH_I;
exports.A1_NUMBERS = A1_NUMBERS;
exports.AnnotationProp = AnnotationProp;
exports.BASE_THEME_CONFIG = BASE_THEME_CONFIG;
exports.CUSTOM_PROP_LIST = CUSTOM_PROP_LIST;
exports.CustomProp = CustomProp;
exports.DEFAULT_BOARD_SIZE = DEFAULT_BOARD_SIZE;
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
exports.DOT_SIZE = DOT_SIZE;
exports.EXPAND_H = EXPAND_H;
exports.EXPAND_V = EXPAND_V;
exports.GAME_INFO_PROP_LIST = GAME_INFO_PROP_LIST;
exports.GameInfoProp = GameInfoProp;
exports.GhostBan = GhostBan;
exports.LIGHT_GREEN_RGB = LIGHT_GREEN_RGB;
exports.LIGHT_RED_RGB = LIGHT_RED_RGB;
exports.LIGHT_YELLOW_RGB = LIGHT_YELLOW_RGB;
exports.LIST_OF_POINTS_PROP = LIST_OF_POINTS_PROP;
exports.MARKUP_PROP_LIST = MARKUP_PROP_LIST;
exports.MAX_BOARD_SIZE = MAX_BOARD_SIZE;
exports.MISCELLANEOUS_PROP_LIST = MISCELLANEOUS_PROP_LIST;
exports.MOVE_ANNOTATION_PROP_LIST = MOVE_ANNOTATION_PROP_LIST;
exports.MOVE_PROP_LIST = MOVE_PROP_LIST;
exports.MarkupProp = MarkupProp;
exports.MiscellaneousProp = MiscellaneousProp;
exports.MoveAnnotationProp = MoveAnnotationProp;
exports.MoveProp = MoveProp;
exports.NODE_ANNOTATION_PROP_LIST = NODE_ANNOTATION_PROP_LIST;
exports.NodeAnnotationProp = NodeAnnotationProp;
exports.RESPONSE_TIME = RESPONSE_TIME;
exports.ROOT_PROP_LIST = ROOT_PROP_LIST;
exports.RootProp = RootProp;
exports.SETUP_PROP_LIST = SETUP_PROP_LIST;
exports.SGF_LETTERS = SGF_LETTERS;
exports.SetupProp = SetupProp;
exports.Sgf = Sgf;
exports.SgfPropBase = SgfPropBase;
exports.THEME_RESOURCES = THEME_RESOURCES;
exports.TIMING_PROP_LIST = TIMING_PROP_LIST;
exports.TNode = TNode;
exports.TimingProp = TimingProp;
exports.TreeModel = TreeModel;
exports.YELLOW_RGB = YELLOW_RGB;
exports.a1ToIndex = a1ToIndex;
exports.a1ToPos = a1ToPos;
exports.a1ToSGF = a1ToSGF;
exports.addMoveToCurrentNode = addMoveToCurrentNode;
exports.addStoneToCurrentNode = addStoneToCurrentNode;
exports.buildMoveNode = buildMoveNode;
exports.buildNodeRanges = buildNodeRanges;
exports.calcAnalysisPointColor = calcAnalysisPointColor;
exports.calcAvoidMovesForPartialAnalysis = calcAvoidMovesForPartialAnalysis;
exports.calcBoardSize = calcBoardSize;
exports.calcCenter = calcCenter;
exports.calcDoubtfulMovesThresholdRange = calcDoubtfulMovesThresholdRange;
exports.calcHash = calcHash;
exports.calcMatAndMarkup = calcMatAndMarkup;
exports.calcMost = calcMost;
exports.calcOffset = calcOffset;
exports.calcPartialArea = calcPartialArea;
exports.calcPreventMoveMat = calcPreventMoveMat;
exports.calcPreventMoveMatForDisplayOnly = calcPreventMoveMatForDisplayOnly;
exports.calcScoreDiff = calcScoreDiff;
exports.calcScoreDiffText = calcScoreDiffText;
exports.calcTsumegoFrame = calcTsumegoFrame;
exports.calcVariationsMarkup = calcVariationsMarkup;
exports.calcVisibleArea = calcVisibleArea;
exports.calcWinrateDiff = calcWinrateDiff;
exports.calcWinrateDiffText = calcWinrateDiffText;
exports.canMove = canMove;
exports.clearStoneFromCurrentNode = clearStoneFromCurrentNode;
exports.convertStepsForAI = convertStepsForAI;
exports.convertStoneTypeToString = convertStoneTypeToString;
exports.cutMoveNodes = cutMoveNodes;
exports.detectST = detectST;
exports.empty = empty;
exports.execCapture = execCapture;
exports.extractAnswerType = extractAnswerType;
exports.extractBoardSize = extractBoardSize;
exports.extractPAI = extractPAI;
exports.extractPI = extractPI;
exports.findProp = findProp;
exports.findProps = findProps;
exports.genMove = genMove;
exports.getDeduplicatedProps = getDeduplicatedProps;
exports.getFirstToMoveColorFromRoot = getFirstToMoveColorFromRoot;
exports.getFirstToMoveColorFromSgf = getFirstToMoveColorFromSgf;
exports.getIndexFromAnalysis = getIndexFromAnalysis;
exports.getLastIndex = getLastIndex;
exports.getMoveColor = getMoveColor;
exports.getNodeNumber = getNodeNumber;
exports.getRoot = getRoot;
exports.handleMove = handleMove;
exports.inChoicePath = inChoicePath;
exports.inFirstBranchRightPath = inFirstBranchRightPath;
exports.inFirstRightPath = inFirstRightPath;
exports.inPath = inPath;
exports.inRightPath = inRightPath;
exports.inTargetPath = inTargetPath;
exports.inVariantPath = inVariantPath;
exports.inWrongPath = inWrongPath;
exports.initNodeData = initNodeData;
exports.initialRootNode = initialRootNode;
exports.isAnswerNode = isAnswerNode;
exports.isCharacterInNode = isCharacterInNode;
exports.isChoiceNode = isChoiceNode;
exports.isFirstRightNode = isFirstRightNode;
exports.isForceNode = isForceNode;
exports.isInAnyRange = isInAnyRange;
exports.isMainPath = isMainPath;
exports.isMoveNode = isMoveNode;
exports.isPreventMoveNode = isPreventMoveNode;
exports.isRightNode = isRightNode;
exports.isRootNode = isRootNode;
exports.isSetupNode = isSetupNode;
exports.isTargetNode = isTargetNode;
exports.isVariantNode = isVariantNode;
exports.isWrongNode = isWrongNode;
exports.matToListOfTuples = matToListOfTuples;
exports.matToPosition = matToPosition;
exports.move = move;
exports.nFormatter = nFormatter;
exports.offsetA1Move = offsetA1Move;
exports.pathToAiMoves = pathToAiMoves;
exports.pathToIndexes = pathToIndexes;
exports.pathToInitialStones = pathToInitialStones;
exports.posToSgf = posToSgf;
exports.reverseOffset = reverseOffset;
exports.reverseOffsetA1Move = reverseOffsetA1Move;
exports.round2 = round2;
exports.round3 = round3;
exports.sgfOffset = sgfOffset;
exports.sgfToA1 = sgfToA1;
exports.sgfToPos = sgfToPos;
exports.showKi = showKi;
exports.zeros = zeros;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL2NvcmUvbWVyZ2Vzb3J0LnRzIiwiLi4vLi4vY29yZS90cmVlLnRzIiwiLi4vLi4vY29yZS9oZWxwZXJzLnRzIiwiLi4vLi4vdHlwZXMudHMiLCIuLi8uLi9jb25zdC50cyIsIi4uLy4uL2NvcmUvcHJvcHMudHMiLCIuLi8uLi9ib2FyZGNvcmUudHMiLCIuLi8uLi9jb3JlL3NnZi50cyIsIi4uLy4uL2hlbHBlci50cyIsIi4uLy4uL3N0b25lcy9iYXNlLnRzIiwiLi4vLi4vc3RvbmVzL0ZsYXRTdG9uZS50cyIsIi4uLy4uL3N0b25lcy9JbWFnZVN0b25lLnRzIiwiLi4vLi4vc3RvbmVzL0FuYWx5c2lzUG9pbnQudHMiLCIuLi8uLi9tYXJrdXBzL01hcmt1cEJhc2UudHMiLCIuLi8uLi9tYXJrdXBzL0NpcmNsZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvQ3Jvc3NNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL1RleHRNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL1NxdWFyZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvVHJpYW5nbGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL05vZGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL0FjdGl2ZU5vZGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL0NpcmNsZVNvbGlkTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9IaWdobGlnaHRNYXJrdXAudHMiLCIuLi8uLi9lZmZlY3RzL0VmZmVjdEJhc2UudHMiLCIuLi8uLi9lZmZlY3RzL0JhbkVmZmVjdC50cyIsIi4uLy4uL2dob3N0YmFuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB0eXBlIENvbXBhcmF0b3I8VD4gPSAoYTogVCwgYjogVCkgPT4gbnVtYmVyO1xuXG4vKipcbiAqIFNvcnQgYW4gYXJyYXkgdXNpbmcgdGhlIG1lcmdlIHNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSBjb21wYXJhdG9yRm4gVGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYXJyIFRoZSBhcnJheSB0byBzb3J0LlxuICogQHJldHVybnMgVGhlIHNvcnRlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VTb3J0PFQ+KGNvbXBhcmF0b3JGbjogQ29tcGFyYXRvcjxUPiwgYXJyOiBUW10pOiBUW10ge1xuICBjb25zdCBsZW4gPSBhcnIubGVuZ3RoO1xuICBpZiAobGVuID49IDIpIHtcbiAgICBjb25zdCBmaXJzdEhhbGYgPSBhcnIuc2xpY2UoMCwgbGVuIC8gMik7XG4gICAgY29uc3Qgc2Vjb25kSGFsZiA9IGFyci5zbGljZShsZW4gLyAyLCBsZW4pO1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIGNvbXBhcmF0b3JGbixcbiAgICAgIG1lcmdlU29ydChjb21wYXJhdG9yRm4sIGZpcnN0SGFsZiksXG4gICAgICBtZXJnZVNvcnQoY29tcGFyYXRvckZuLCBzZWNvbmRIYWxmKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFyci5zbGljZSgpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIG1lcmdlIHBhcnQgb2YgdGhlIG1lcmdlIHNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSBjb21wYXJhdG9yRm4gVGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYXJyMSBUaGUgZmlyc3Qgc29ydGVkIGFycmF5LlxuICogQHBhcmFtIGFycjIgVGhlIHNlY29uZCBzb3J0ZWQgYXJyYXkuXG4gKiBAcmV0dXJucyBUaGUgbWVyZ2VkIGFuZCBzb3J0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlPFQ+KGNvbXBhcmF0b3JGbjogQ29tcGFyYXRvcjxUPiwgYXJyMTogVFtdLCBhcnIyOiBUW10pOiBUW10ge1xuICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xuICBsZXQgbGVmdDEgPSBhcnIxLmxlbmd0aDtcbiAgbGV0IGxlZnQyID0gYXJyMi5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlZnQxID4gMCAmJiBsZWZ0MiA+IDApIHtcbiAgICBpZiAoY29tcGFyYXRvckZuKGFycjFbMF0sIGFycjJbMF0pIDw9IDApIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFycjEuc2hpZnQoKSEpOyAvLyBub24tbnVsbCBhc3NlcnRpb246IHNhZmUgc2luY2Ugd2UganVzdCBjaGVja2VkIGxlbmd0aFxuICAgICAgbGVmdDEtLTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goYXJyMi5zaGlmdCgpISk7XG4gICAgICBsZWZ0Mi0tO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsZWZ0MSA+IDApIHtcbiAgICByZXN1bHQucHVzaCguLi5hcnIxKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucHVzaCguLi5hcnIyKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlU29ydDtcbiIsImltcG9ydCBtZXJnZVNvcnQgZnJvbSAnLi9tZXJnZXNvcnQnO1xuaW1wb3J0IHtTZ2ZOb2RlfSBmcm9tICcuL3R5cGVzJztcblxuZnVuY3Rpb24gZmluZEluc2VydEluZGV4PFQ+KFxuICBjb21wYXJhdG9yRm46IChhOiBULCBiOiBUKSA9PiBudW1iZXIsXG4gIGFycjogVFtdLFxuICBlbDogVFxuKTogbnVtYmVyIHtcbiAgbGV0IGk6IG51bWJlcjtcbiAgY29uc3QgbGVuID0gYXJyLmxlbmd0aDtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGNvbXBhcmF0b3JGbihhcnJbaV0sIGVsKSA+IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaTtcbn1cblxudHlwZSBDb21wYXJhdG9yPFQ+ID0gKGE6IFQsIGI6IFQpID0+IG51bWJlcjtcblxuaW50ZXJmYWNlIFRyZWVNb2RlbENvbmZpZzxUPiB7XG4gIGNoaWxkcmVuUHJvcGVydHlOYW1lPzogc3RyaW5nO1xuICBtb2RlbENvbXBhcmF0b3JGbj86IENvbXBhcmF0b3I8VD47XG59XG5cbmNsYXNzIFROb2RlIHtcbiAgY29uZmlnOiBUcmVlTW9kZWxDb25maWc8U2dmTm9kZT47XG4gIG1vZGVsOiBTZ2ZOb2RlO1xuICBjaGlsZHJlbjogVE5vZGVbXSA9IFtdO1xuICBwYXJlbnQ/OiBUTm9kZTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPiwgbW9kZWw6IFNnZk5vZGUpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICBpc1Jvb3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICB9XG5cbiAgYWRkQ2hpbGQoY2hpbGQ6IFROb2RlKTogVE5vZGUge1xuICAgIHJldHVybiBhZGRDaGlsZCh0aGlzLCBjaGlsZCk7XG4gIH1cblxuICBhZGRDaGlsZEF0SW5kZXgoY2hpbGQ6IFROb2RlLCBpbmRleDogbnVtYmVyKTogVE5vZGUge1xuICAgIGlmICh0aGlzLmNvbmZpZy5tb2RlbENvbXBhcmF0b3JGbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCBjaGlsZCBhdCBpbmRleCB3aGVuIHVzaW5nIGEgY29tcGFyYXRvciBmdW5jdGlvbi4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3AgPSB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nO1xuICAgIGlmICghKHRoaXMubW9kZWwgYXMgYW55KVtwcm9wXSkge1xuICAgICAgKHRoaXMubW9kZWwgYXMgYW55KVtwcm9wXSA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsQ2hpbGRyZW4gPSAodGhpcy5tb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICBtb2RlbENoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQubW9kZWwpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZCk7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH1cblxuICBnZXRQYXRoKCk6IFROb2RlW10ge1xuICAgIGNvbnN0IHBhdGg6IFROb2RlW10gPSBbXTtcbiAgICBsZXQgY3VycmVudDogVE5vZGUgfCB1bmRlZmluZWQgPSB0aGlzO1xuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBwYXRoLnVuc2hpZnQoY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgZ2V0SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pc1Jvb3QoKSA/IDAgOiB0aGlzLnBhcmVudCEuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgfVxuXG4gIHNldEluZGV4KGluZGV4OiBudW1iZXIpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBzZXQgbm9kZSBpbmRleCB3aGVuIHVzaW5nIGEgY29tcGFyYXRvciBmdW5jdGlvbi4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnBhcmVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIGhhcyBubyBwYXJlbnQuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLnBhcmVudC5jaGlsZHJlbjtcbiAgICBjb25zdCBtb2RlbFNpYmxpbmdzID0gKHRoaXMucGFyZW50Lm1vZGVsIGFzIGFueSlbXG4gICAgICB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nXG4gICAgXTtcblxuICAgIGNvbnN0IG9sZEluZGV4ID0gc2libGluZ3MuaW5kZXhPZih0aGlzKTtcblxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc2libGluZ3MubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgc2libGluZ3Muc3BsaWNlKGluZGV4LCAwLCBzaWJsaW5ncy5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcbiAgICBtb2RlbFNpYmxpbmdzLnNwbGljZShpbmRleCwgMCwgbW9kZWxTaWJsaW5ncy5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgd2FsayhmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuIHwgdm9pZCk6IHZvaWQge1xuICAgIGNvbnN0IHdhbGtSZWN1cnNpdmUgPSAobm9kZTogVE5vZGUpOiBib29sZWFuID0+IHtcbiAgICAgIGlmIChmbihub2RlKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAod2Fsa1JlY3Vyc2l2ZShjaGlsZCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIHdhbGtSZWN1cnNpdmUodGhpcyk7XG4gIH1cblxuICBmaXJzdChmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuKTogVE5vZGUgfCB1bmRlZmluZWQge1xuICAgIGxldCByZXN1bHQ6IFROb2RlIHwgdW5kZWZpbmVkO1xuICAgIHRoaXMud2Fsayhub2RlID0+IHtcbiAgICAgIGlmIChmbihub2RlKSkge1xuICAgICAgICByZXN1bHQgPSBub2RlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGFsbChmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuKTogVE5vZGVbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBUTm9kZVtdID0gW107XG4gICAgdGhpcy53YWxrKG5vZGUgPT4ge1xuICAgICAgaWYgKGZuKG5vZGUpKSByZXN1bHQucHVzaChub2RlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZHJvcCgpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIGNvbnN0IHByb3AgPSB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nO1xuICAgICAgICAodGhpcy5wYXJlbnQubW9kZWwgYXMgYW55KVtwcm9wXS5zcGxpY2UoaWR4LCAxKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDaGlsZChwYXJlbnQ6IFROb2RlLCBjaGlsZDogVE5vZGUpOiBUTm9kZSB7XG4gIGNvbnN0IHByb3AgPSBwYXJlbnQuY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lIHx8ICdjaGlsZHJlbic7XG4gIGlmICghKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdKSB7XG4gICAgKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdID0gW107XG4gIH1cblxuICBjb25zdCBtb2RlbENoaWxkcmVuID0gKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gIGNoaWxkLnBhcmVudCA9IHBhcmVudDtcbiAgaWYgKHBhcmVudC5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICBjb25zdCBpbmRleCA9IGZpbmRJbnNlcnRJbmRleChcbiAgICAgIHBhcmVudC5jb25maWcubW9kZWxDb21wYXJhdG9yRm4sXG4gICAgICBtb2RlbENoaWxkcmVuLFxuICAgICAgY2hpbGQubW9kZWxcbiAgICApO1xuICAgIG1vZGVsQ2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZC5tb2RlbCk7XG4gICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuICB9IGVsc2Uge1xuICAgIG1vZGVsQ2hpbGRyZW4ucHVzaChjaGlsZC5tb2RlbCk7XG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5jbGFzcyBUcmVlTW9kZWwge1xuICBjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPjtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPiA9IHt9KSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBjaGlsZHJlblByb3BlcnR5TmFtZTogY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lIHx8ICdjaGlsZHJlbicsXG4gICAgICBtb2RlbENvbXBhcmF0b3JGbjogY29uZmlnLm1vZGVsQ29tcGFyYXRvckZuLFxuICAgIH07XG4gIH1cblxuICBwYXJzZShtb2RlbDogU2dmTm9kZSk6IFROb2RlIHtcbiAgICBpZiAodHlwZW9mIG1vZGVsICE9PSAnb2JqZWN0JyB8fCBtb2RlbCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTW9kZWwgbXVzdCBiZSBvZiB0eXBlIG9iamVjdC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlID0gbmV3IFROb2RlKHRoaXMuY29uZmlnLCBtb2RlbCk7XG4gICAgY29uc3QgcHJvcCA9IHRoaXMuY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lITtcbiAgICBjb25zdCBjaGlsZHJlbiA9IChtb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgICBpZiAodGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICAgICAgKG1vZGVsIGFzIGFueSlbcHJvcF0gPSBtZXJnZVNvcnQoXG4gICAgICAgICAgdGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4sXG4gICAgICAgICAgY2hpbGRyZW5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgY2hpbGRNb2RlbCBvZiAobW9kZWwgYXMgYW55KVtwcm9wXSkge1xuICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSB0aGlzLnBhcnNlKGNoaWxkTW9kZWwpO1xuICAgICAgICBhZGRDaGlsZChub2RlLCBjaGlsZE5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG59XG5cbmV4cG9ydCB7VHJlZU1vZGVsLCBUTm9kZSwgVHJlZU1vZGVsQ29uZmlnfTtcbiIsImltcG9ydCB7ZmlsdGVyLCBmaW5kTGFzdEluZGV4fSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtUTm9kZX0gZnJvbSAnLi90cmVlJztcbmltcG9ydCB7TW92ZVByb3AsIFNnZlByb3BCYXNlfSBmcm9tICcuL3Byb3BzJztcblxuY29uc3QgU3BhcmtNRDUgPSByZXF1aXJlKCdzcGFyay1tZDUnKTtcblxuZXhwb3J0IGNvbnN0IGNhbGNIYXNoID0gKFxuICBub2RlOiBUTm9kZSB8IG51bGwgfCB1bmRlZmluZWQsXG4gIG1vdmVQcm9wczogTW92ZVByb3BbXSA9IFtdXG4pOiBzdHJpbmcgPT4ge1xuICBsZXQgZnVsbG5hbWUgPSAnbic7XG4gIGlmIChtb3ZlUHJvcHMubGVuZ3RoID4gMCkge1xuICAgIGZ1bGxuYW1lICs9IGAke21vdmVQcm9wc1swXS50b2tlbn0ke21vdmVQcm9wc1swXS52YWx1ZX1gO1xuICB9XG4gIGlmIChub2RlKSB7XG4gICAgY29uc3QgcGF0aCA9IG5vZGUuZ2V0UGF0aCgpO1xuICAgIGlmIChwYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIGZ1bGxuYW1lID0gcGF0aC5tYXAobiA9PiBuLm1vZGVsLmlkKS5qb2luKCc9PicpICsgYD0+JHtmdWxsbmFtZX1gO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBTcGFya01ENS5oYXNoKGZ1bGxuYW1lKS5zbGljZSgwLCA2KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NoYXJhY3RlckluTm9kZShcbiAgc2dmOiBzdHJpbmcsXG4gIG46IG51bWJlcixcbiAgbm9kZXMgPSBbJ0MnLCAnVE0nLCAnR04nLCAnUEMnXVxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGAoJHtub2Rlcy5qb2luKCd8Jyl9KVxcXFxbKFteXFxcXF1dKilcXFxcXWAsICdnJyk7XG4gIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcblxuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKHNnZikpICE9PSBudWxsKSB7XG4gICAgY29uc3QgY29udGVudFN0YXJ0ID0gbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGggKyAxOyAvLyArMSBmb3IgdGhlICdbJ1xuICAgIGNvbnN0IGNvbnRlbnRFbmQgPSBjb250ZW50U3RhcnQgKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgaWYgKG4gPj0gY29udGVudFN0YXJ0ICYmIG4gPD0gY29udGVudEVuZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG50eXBlIFJhbmdlID0gW251bWJlciwgbnVtYmVyXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTm9kZVJhbmdlcyhcbiAgc2dmOiBzdHJpbmcsXG4gIGtleXM6IHN0cmluZ1tdID0gWydDJywgJ1RNJywgJ0dOJywgJ1BDJ11cbik6IFJhbmdlW10ge1xuICBjb25zdCByYW5nZXM6IFJhbmdlW10gPSBbXTtcbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoYFxcXFxiKCR7a2V5cy5qb2luKCd8Jyl9KVxcXFxbKFteXFxcXF1dKilcXFxcXWAsICdnJyk7XG5cbiAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKHNnZikpICE9PSBudWxsKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBtYXRjaC5pbmRleCArIG1hdGNoWzFdLmxlbmd0aCArIDE7XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgcmFuZ2VzLnB1c2goW3N0YXJ0LCBlbmRdKTtcbiAgfVxuXG4gIHJldHVybiByYW5nZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luQW55UmFuZ2UoaW5kZXg6IG51bWJlciwgcmFuZ2VzOiBSYW5nZVtdKTogYm9vbGVhbiB7XG4gIC8vIHJhbmdlcyBtdXN0IGJlIHNvcnRlZFxuICBsZXQgbGVmdCA9IDA7XG4gIGxldCByaWdodCA9IHJhbmdlcy5sZW5ndGggLSAxO1xuXG4gIHdoaWxlIChsZWZ0IDw9IHJpZ2h0KSB7XG4gICAgY29uc3QgbWlkID0gKGxlZnQgKyByaWdodCkgPj4gMTtcbiAgICBjb25zdCBbc3RhcnQsIGVuZF0gPSByYW5nZXNbbWlkXTtcblxuICAgIGlmIChpbmRleCA8IHN0YXJ0KSB7XG4gICAgICByaWdodCA9IG1pZCAtIDE7XG4gICAgfSBlbHNlIGlmIChpbmRleCA+IGVuZCkge1xuICAgICAgbGVmdCA9IG1pZCArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldERlZHVwbGljYXRlZFByb3BzID0gKHRhcmdldFByb3BzOiBTZ2ZQcm9wQmFzZVtdKSA9PiB7XG4gIHJldHVybiBmaWx0ZXIoXG4gICAgdGFyZ2V0UHJvcHMsXG4gICAgKHByb3A6IFNnZlByb3BCYXNlLCBpbmRleDogbnVtYmVyKSA9PlxuICAgICAgaW5kZXggPT09XG4gICAgICBmaW5kTGFzdEluZGV4KFxuICAgICAgICB0YXJnZXRQcm9wcyxcbiAgICAgICAgKGxhc3RQcm86IFNnZlByb3BCYXNlKSA9PlxuICAgICAgICAgIHByb3AudG9rZW4gPT09IGxhc3RQcm8udG9rZW4gJiYgcHJvcC52YWx1ZSA9PT0gbGFzdFByby52YWx1ZVxuICAgICAgKVxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTW92ZU5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgcmV0dXJuIG4ubW9kZWwubW92ZVByb3BzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnQgY29uc3QgaXNSb290Tm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICByZXR1cm4gbi5tb2RlbC5yb290UHJvcHMubGVuZ3RoID4gMCB8fCBuLmlzUm9vdCgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzU2V0dXBOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIHJldHVybiBuLm1vZGVsLnNldHVwUHJvcHMubGVuZ3RoID4gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlTnVtYmVyID0gKG46IFROb2RlLCBwYXJlbnQ/OiBUTm9kZSkgPT4ge1xuICBjb25zdCBwYXRoID0gbi5nZXRQYXRoKCk7XG4gIGxldCBtb3Zlc0NvdW50ID0gcGF0aC5maWx0ZXIobiA9PiBpc01vdmVOb2RlKG4pKS5sZW5ndGg7XG4gIGlmIChwYXJlbnQpIHtcbiAgICBtb3Zlc0NvdW50ICs9IHBhcmVudC5nZXRQYXRoKCkuZmlsdGVyKG4gPT4gaXNNb3ZlTm9kZShuKSkubGVuZ3RoO1xuICB9XG4gIHJldHVybiBtb3Zlc0NvdW50O1xufTtcbiIsIi8qKlxuICogVGhlbWUgcHJvcGVydHkga2V5cyBmb3IgdHlwZS1zYWZlIGFjY2VzcyB0byB0aGVtZSBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBlbnVtIFRoZW1lUHJvcGVydHlLZXkge1xuICBQb3NpdGl2ZU5vZGVDb2xvciA9ICdwb3NpdGl2ZU5vZGVDb2xvcicsXG4gIE5lZ2F0aXZlTm9kZUNvbG9yID0gJ25lZ2F0aXZlTm9kZUNvbG9yJyxcbiAgTmV1dHJhbE5vZGVDb2xvciA9ICduZXV0cmFsTm9kZUNvbG9yJyxcbiAgRGVmYXVsdE5vZGVDb2xvciA9ICdkZWZhdWx0Tm9kZUNvbG9yJyxcbiAgV2FybmluZ05vZGVDb2xvciA9ICd3YXJuaW5nTm9kZUNvbG9yJyxcbiAgU2hhZG93Q29sb3IgPSAnc2hhZG93Q29sb3InLFxuICBCb2FyZExpbmVDb2xvciA9ICdib2FyZExpbmVDb2xvcicsXG4gIEFjdGl2ZUNvbG9yID0gJ2FjdGl2ZUNvbG9yJyxcbiAgSW5hY3RpdmVDb2xvciA9ICdpbmFjdGl2ZUNvbG9yJyxcbiAgQm9hcmRCYWNrZ3JvdW5kQ29sb3IgPSAnYm9hcmRCYWNrZ3JvdW5kQ29sb3InLFxuICBGbGF0QmxhY2tDb2xvciA9ICdmbGF0QmxhY2tDb2xvcicsXG4gIEZsYXRCbGFja0NvbG9yQWx0ID0gJ2ZsYXRCbGFja0NvbG9yQWx0JyxcbiAgRmxhdFdoaXRlQ29sb3IgPSAnZmxhdFdoaXRlQ29sb3InLFxuICBGbGF0V2hpdGVDb2xvckFsdCA9ICdmbGF0V2hpdGVDb2xvckFsdCcsXG4gIEJvYXJkRWRnZUxpbmVXaWR0aCA9ICdib2FyZEVkZ2VMaW5lV2lkdGgnLFxuICBCb2FyZExpbmVXaWR0aCA9ICdib2FyZExpbmVXaWR0aCcsXG4gIEJvYXJkTGluZUV4dGVudCA9ICdib2FyZExpbmVFeHRlbnQnLFxuICBTdGFyU2l6ZSA9ICdzdGFyU2l6ZScsXG4gIE1hcmt1cExpbmVXaWR0aCA9ICdtYXJrdXBMaW5lV2lkdGgnLFxuICBIaWdobGlnaHRDb2xvciA9ICdoaWdobGlnaHRDb2xvcicsXG59XG5cbi8qKlxuICogVGhlbWUgY29udGV4dCBmb3IgbWFya3VwIHJlbmRlcmluZ1xuICovXG5leHBvcnQgdHlwZSBUaGVtZUNvbnRleHQgPSB7XG4gIHRoZW1lOiBUaGVtZTtcbiAgdGhlbWVPcHRpb25zOiBUaGVtZU9wdGlvbnM7XG59O1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIEdob3N0QmFuLlxuICovXG5leHBvcnQgdHlwZSBHaG9zdEJhbk9wdGlvbnMgPSB7XG4gIGJvYXJkU2l6ZTogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBkeW5hbWljUGFkZGluZzogYm9vbGVhbjtcbiAgcGFkZGluZzogbnVtYmVyO1xuICB6b29tPzogYm9vbGVhbjtcbiAgZXh0ZW50OiBudW1iZXI7XG4gIHRoZW1lOiBUaGVtZTtcbiAgYW5hbHlzaXNQb2ludFRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWU7XG4gIGNvb3JkaW5hdGU6IGJvb2xlYW47XG4gIGludGVyYWN0aXZlOiBib29sZWFuO1xuICBiYWNrZ3JvdW5kOiBib29sZWFuO1xuICBzaG93QW5hbHlzaXM6IGJvb2xlYW47XG4gIGFkYXB0aXZlQm9hcmRMaW5lOiBib29sZWFuO1xuICB0aGVtZU9wdGlvbnM6IFRoZW1lT3B0aW9ucztcbiAgdGhlbWVSZXNvdXJjZXM6IFRoZW1lUmVzb3VyY2VzO1xuICBtb3ZlU291bmQ6IGJvb2xlYW47XG4gIGFkYXB0aXZlU3RhclNpemU6IGJvb2xlYW47XG4gIG1vYmlsZUluZGljYXRvck9mZnNldDogbnVtYmVyO1xuICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgR2hvc3RCYW5PcHRpb25zUGFyYW1zID0ge1xuICBib2FyZFNpemU/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIGR5bmFtaWNQYWRkaW5nPzogYm9vbGVhbjtcbiAgcGFkZGluZz86IG51bWJlcjtcbiAgem9vbT86IGJvb2xlYW47XG4gIGV4dGVudD86IG51bWJlcjtcbiAgdGhlbWU/OiBUaGVtZTtcbiAgYW5hbHlzaXNQb2ludFRoZW1lPzogQW5hbHlzaXNQb2ludFRoZW1lO1xuICBjb29yZGluYXRlPzogYm9vbGVhbjtcbiAgaW50ZXJhY3RpdmU/OiBib29sZWFuO1xuICBiYWNrZ3JvdW5kPzogYm9vbGVhbjtcbiAgc2hvd0FuYWx5c2lzPzogYm9vbGVhbjtcbiAgYWRhcHRpdmVCb2FyZExpbmU/OiBib29sZWFuO1xuICB0aGVtZU9wdGlvbnM/OiBQYXJ0aWFsPFRoZW1lT3B0aW9ucz47XG4gIHRoZW1lUmVzb3VyY2VzPzogVGhlbWVSZXNvdXJjZXM7XG4gIG1vdmVTb3VuZD86IGJvb2xlYW47XG4gIGFkYXB0aXZlU3RhclNpemU/OiBib29sZWFuO1xuICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplPzogbnVtYmVyO1xuICBtb2JpbGVJbmRpY2F0b3JPZmZzZXQ/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBUaGVtZUNvbmZpZyA9IHtcbiAgcG9zaXRpdmVOb2RlQ29sb3I6IHN0cmluZztcbiAgbmVnYXRpdmVOb2RlQ29sb3I6IHN0cmluZztcbiAgbmV1dHJhbE5vZGVDb2xvcjogc3RyaW5nO1xuICBkZWZhdWx0Tm9kZUNvbG9yOiBzdHJpbmc7XG4gIHdhcm5pbmdOb2RlQ29sb3I6IHN0cmluZztcbiAgc2hhZG93Q29sb3I6IHN0cmluZztcbiAgYm9hcmRMaW5lQ29sb3I6IHN0cmluZztcbiAgYWN0aXZlQ29sb3I6IHN0cmluZztcbiAgaW5hY3RpdmVDb2xvcjogc3RyaW5nO1xuICBib2FyZEJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xuICAvLyBNYXJrdXAgY29sb3JzIGZvciBmbGF0IHRoZW1lc1xuICBmbGF0QmxhY2tDb2xvcjogc3RyaW5nO1xuICBmbGF0QmxhY2tDb2xvckFsdDogc3RyaW5nO1xuICBmbGF0V2hpdGVDb2xvcjogc3RyaW5nO1xuICBmbGF0V2hpdGVDb2xvckFsdDogc3RyaW5nO1xuICAvLyBCb2FyZCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgYm9hcmRFZGdlTGluZVdpZHRoOiBudW1iZXI7XG4gIGJvYXJkTGluZVdpZHRoOiBudW1iZXI7XG4gIGJvYXJkTGluZUV4dGVudDogbnVtYmVyO1xuICBzdGFyU2l6ZTogbnVtYmVyO1xuICBtYXJrdXBMaW5lV2lkdGg6IG51bWJlcjtcbiAgaGlnaGxpZ2h0Q29sb3I6IHN0cmluZztcbiAgc3RvbmVSYXRpbzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgVGhlbWVPcHRpb25zID0ge1xuICBba2V5IGluIFRoZW1lXT86IFBhcnRpYWw8VGhlbWVDb25maWc+O1xufSAmIHtcbiAgZGVmYXVsdDogVGhlbWVDb25maWc7XG59O1xuXG5leHBvcnQgdHlwZSBUaGVtZVJlc291cmNlcyA9IHtcbiAgW2tleSBpbiBUaGVtZV06IHtib2FyZD86IHN0cmluZzsgYmxhY2tzOiBzdHJpbmdbXTsgd2hpdGVzOiBzdHJpbmdbXX07XG59O1xuXG5leHBvcnQgdHlwZSBDb25zdW1lZEFuYWx5c2lzID0ge1xuICByZXN1bHRzOiBBbmFseXNpc1tdO1xuICBwYXJhbXM6IEFuYWx5c2lzUGFyYW1zIHwgbnVsbDtcbn07XG5cbmV4cG9ydCB0eXBlIEFuYWx5c2VzID0ge1xuICByZXN1bHRzOiBBbmFseXNpc1tdO1xuICBwYXJhbXM6IEFuYWx5c2lzUGFyYW1zIHwgbnVsbDtcbn07XG5cbmV4cG9ydCB0eXBlIEFuYWx5c2lzID0ge1xuICBpZDogc3RyaW5nO1xuICBpc0R1cmluZ1NlYXJjaDogYm9vbGVhbjtcbiAgbW92ZUluZm9zOiBNb3ZlSW5mb1tdO1xuICByb290SW5mbzogUm9vdEluZm87XG4gIHBvbGljeTogbnVtYmVyW107XG4gIG93bmVyc2hpcDogbnVtYmVyW107XG4gIHR1cm5OdW1iZXI6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEFuYWx5c2lzUGFyYW1zID0ge1xuICBpZDogc3RyaW5nO1xuICBpbml0aWFsUGxheWVyOiBzdHJpbmc7XG4gIG1vdmVzOiBhbnlbXTtcbiAgcnVsZXM6IHN0cmluZztcbiAga29taTogc3RyaW5nO1xuICBib2FyZFhTaXplOiBudW1iZXI7XG4gIGJvYXJkWVNpemU6IG51bWJlcjtcbiAgaW5jbHVkZVBvbGljeTogYm9vbGVhbjtcbiAgcHJpb3JpdHk6IG51bWJlcjtcbiAgbWF4VmlzaXRzOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBNb3ZlSW5mbyA9IHtcbiAgaXNTeW1tZXRyeU9mOiBzdHJpbmc7XG4gIGxjYjogbnVtYmVyO1xuICBtb3ZlOiBzdHJpbmc7XG4gIG9yZGVyOiBudW1iZXI7XG4gIHByaW9yOiBudW1iZXI7XG4gIHB2OiBzdHJpbmdbXTtcbiAgc2NvcmVMZWFkOiBudW1iZXI7XG4gIHNjb3JlTWVhbjogbnVtYmVyO1xuICBzY29yZVNlbGZQbGF5OiBudW1iZXI7XG4gIHNjb3JlU3RkZXY6IG51bWJlcjtcbiAgdXRpbGl0eTogbnVtYmVyO1xuICB1dGlsaXR5TGNiOiBudW1iZXI7XG4gIHZpc2l0czogbnVtYmVyO1xuICB3aW5yYXRlOiBudW1iZXI7XG4gIHdlaWdodDogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgUm9vdEluZm8gPSB7XG4gIC8vIGN1cnJlbnRQbGF5ZXIgaXMgbm90IG9mZmljaWFsbHkgcGFydCBvZiB0aGUgR1RQIHJlc3VsdHMgYnV0IGl0IGlzIGhlbHBmdWwgdG8gaGF2ZSBpdCBoZXJlIHRvIGF2b2lkIHBhc3NpbmcgaXQgdGhyb3VnaCB0aGUgYXJndW1lbnRzXG4gIGN1cnJlbnRQbGF5ZXI6IHN0cmluZztcbiAgc2NvcmVMZWFkOiBudW1iZXI7XG4gIHNjb3JlU2VsZnBsYXk6IG51bWJlcjtcbiAgc2NvcmVTdGRldjogbnVtYmVyO1xuICB1dGlsaXR5OiBudW1iZXI7XG4gIHZpc2l0czogbnVtYmVyO1xuICB3aW5yYXRlOiBudW1iZXI7XG4gIHdlaWdodD86IG51bWJlcjtcbiAgcmF3U3RXckVycm9yPzogbnVtYmVyO1xuICByYXdTdFNjb3JlRXJyb3I/OiBudW1iZXI7XG4gIHJhd1ZhclRpbWVMZWZ0PzogbnVtYmVyO1xuICAvLyBHVFAgcmVzdWx0cyBkb24ndCBpbmNsdWRlIHRoZSBmb2xsb3dpbmcgZmllbGRzXG4gIGxjYj86IG51bWJlcjtcbiAgc3ltSGFzaD86IHN0cmluZztcbiAgdGhpc0hhc2g/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpc1BvaW50T3B0aW9ucyA9IHtcbiAgc2hvd09yZGVyPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBlbnVtIEtpIHtcbiAgQmxhY2sgPSAxLFxuICBXaGl0ZSA9IC0xLFxuICBFbXB0eSA9IDAsXG59XG5cbmV4cG9ydCBlbnVtIFRoZW1lIHtcbiAgQmxhY2tBbmRXaGl0ZSA9ICdibGFja19hbmRfd2hpdGUnLFxuICBGbGF0ID0gJ2ZsYXQnLFxuICBTdWJkdWVkID0gJ3N1YmR1ZWQnLFxuICBTaGVsbFN0b25lID0gJ3NoZWxsX3N0b25lJyxcbiAgU2xhdGVBbmRTaGVsbCA9ICdzbGF0ZV9hbmRfc2hlbGwnLFxuICBXYWxudXQgPSAnd2FsbnV0JyxcbiAgUGhvdG9yZWFsaXN0aWMgPSAncGhvdG9yZWFsaXN0aWMnLFxuICBEYXJrID0gJ2RhcmsnLFxuICBXYXJtID0gJ3dhcm0nLFxuICBZdW56aU1vbmtleURhcmsgPSAneXVuemlfbW9ua2V5X2RhcmsnLFxuICBIaWdoQ29udHJhc3QgPSAnaGlnaF9jb250cmFzdCcsXG59XG5cbmV4cG9ydCBlbnVtIEFuYWx5c2lzUG9pbnRUaGVtZSB7XG4gIERlZmF1bHQgPSAnZGVmYXVsdCcsXG4gIFByb2JsZW0gPSAncHJvYmxlbScsXG59XG5cbmV4cG9ydCBlbnVtIENlbnRlciB7XG4gIExlZnQgPSAnbCcsXG4gIFJpZ2h0ID0gJ3InLFxuICBUb3AgPSAndCcsXG4gIEJvdHRvbSA9ICdiJyxcbiAgVG9wUmlnaHQgPSAndHInLFxuICBUb3BMZWZ0ID0gJ3RsJyxcbiAgQm90dG9tTGVmdCA9ICdibCcsXG4gIEJvdHRvbVJpZ2h0ID0gJ2JyJyxcbiAgQ2VudGVyID0gJ2MnLFxufVxuXG5leHBvcnQgZW51bSBFZmZlY3Qge1xuICBOb25lID0gJycsXG4gIEJhbiA9ICdiYW4nLFxuICBEaW0gPSAnZGltJyxcbiAgSGlnaGxpZ2h0ID0gJ2hpZ2hsaWdodCcsXG59XG5cbmV4cG9ydCBlbnVtIE1hcmt1cCB7XG4gIEN1cnJlbnQgPSAnY3UnLFxuICBDaXJjbGUgPSAnY2knLFxuICBDaXJjbGVTb2xpZCA9ICdjaXMnLFxuICBTcXVhcmUgPSAnc3EnLFxuICBTcXVhcmVTb2xpZCA9ICdzcXMnLFxuICBUcmlhbmdsZSA9ICd0cmknLFxuICBDcm9zcyA9ICdjcicsXG4gIE51bWJlciA9ICdudW0nLFxuICBMZXR0ZXIgPSAnbGUnLFxuICBQb3NpdGl2ZU5vZGUgPSAncG9zJyxcbiAgUG9zaXRpdmVBY3RpdmVOb2RlID0gJ3Bvc2EnLFxuICBQb3NpdGl2ZURhc2hlZE5vZGUgPSAncG9zZGEnLFxuICBQb3NpdGl2ZURvdHRlZE5vZGUgPSAncG9zZHQnLFxuICBQb3NpdGl2ZURhc2hlZEFjdGl2ZU5vZGUgPSAncG9zZGFhJyxcbiAgUG9zaXRpdmVEb3R0ZWRBY3RpdmVOb2RlID0gJ3Bvc2R0YScsXG4gIE5lZ2F0aXZlTm9kZSA9ICduZWcnLFxuICBOZWdhdGl2ZUFjdGl2ZU5vZGUgPSAnbmVnYScsXG4gIE5lZ2F0aXZlRGFzaGVkTm9kZSA9ICduZWdkYScsXG4gIE5lZ2F0aXZlRG90dGVkTm9kZSA9ICduZWdkdCcsXG4gIE5lZ2F0aXZlRGFzaGVkQWN0aXZlTm9kZSA9ICduZWdkYWEnLFxuICBOZWdhdGl2ZURvdHRlZEFjdGl2ZU5vZGUgPSAnbmVnZHRhJyxcbiAgTmV1dHJhbE5vZGUgPSAnbmV1JyxcbiAgTmV1dHJhbEFjdGl2ZU5vZGUgPSAnbmV1YScsXG4gIE5ldXRyYWxEYXNoZWROb2RlID0gJ25ldWRhJyxcbiAgTmV1dHJhbERvdHRlZE5vZGUgPSAnbmV1ZHQnLFxuICBOZXV0cmFsRGFzaGVkQWN0aXZlTm9kZSA9ICduZXVkdGEnLFxuICBOZXV0cmFsRG90dGVkQWN0aXZlTm9kZSA9ICduZXVkYWEnLFxuICBXYXJuaW5nTm9kZSA9ICd3YScsXG4gIFdhcm5pbmdBY3RpdmVOb2RlID0gJ3dhYScsXG4gIFdhcm5pbmdEYXNoZWROb2RlID0gJ3dhZGEnLFxuICBXYXJuaW5nRG90dGVkTm9kZSA9ICd3YWR0JyxcbiAgV2FybmluZ0Rhc2hlZEFjdGl2ZU5vZGUgPSAnd2FkYWEnLFxuICBXYXJuaW5nRG90dGVkQWN0aXZlTm9kZSA9ICd3YWR0YScsXG4gIERlZmF1bHROb2RlID0gJ2RlJyxcbiAgRGVmYXVsdEFjdGl2ZU5vZGUgPSAnZGVhJyxcbiAgRGVmYXVsdERhc2hlZE5vZGUgPSAnZGVkYScsXG4gIERlZmF1bHREb3R0ZWROb2RlID0gJ2RlZHQnLFxuICBEZWZhdWx0RGFzaGVkQWN0aXZlTm9kZSA9ICdkZWRhYScsXG4gIERlZmF1bHREb3R0ZWRBY3RpdmVOb2RlID0gJ2RlZHRhJyxcbiAgTm9kZSA9ICdub2RlJyxcbiAgRGFzaGVkTm9kZSA9ICdkYW5vZGUnLFxuICBEb3R0ZWROb2RlID0gJ2R0bm9kZScsXG4gIEFjdGl2ZU5vZGUgPSAnYW5vZGUnLFxuICBEYXNoZWRBY3RpdmVOb2RlID0gJ2Rhbm9kZScsXG4gIEhpZ2hsaWdodCA9ICdobCcsXG4gIE5vbmUgPSAnJyxcbn1cblxuZXhwb3J0IGVudW0gQ3Vyc29yIHtcbiAgTm9uZSA9ICcnLFxuICBCbGFja1N0b25lID0gJ2InLFxuICBXaGl0ZVN0b25lID0gJ3cnLFxuICBDaXJjbGUgPSAnYycsXG4gIFNxdWFyZSA9ICdzJyxcbiAgVHJpYW5nbGUgPSAndHJpJyxcbiAgQ3Jvc3MgPSAnY3InLFxuICBDbGVhciA9ICdjbCcsXG4gIFRleHQgPSAndCcsXG59XG5cbmV4cG9ydCBlbnVtIFByb2JsZW1BbnN3ZXJUeXBlIHtcbiAgUmlnaHQgPSAnMScsXG4gIFdyb25nID0gJzInLFxuICBWYXJpYW50ID0gJzMnLFxufVxuXG5leHBvcnQgZW51bSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kge1xuICBQb3N0ID0gJ3Bvc3QnLFxuICBQcmUgPSAncHJlJyxcbiAgQm90aCA9ICdib3RoJyxcbn1cbiIsImltcG9ydCB7Y2h1bmt9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1RoZW1lLCBUaGVtZUNvbmZpZ30gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IHNldHRpbmdzID0ge2NkbjogJ2h0dHBzOi8vcy5zaGFvd3EuY29tJ307XG5cbmV4cG9ydCBjb25zdCBCQVNFX1RIRU1FX0NPTkZJRzogVGhlbWVDb25maWcgPSB7XG4gIHBvc2l0aXZlTm9kZUNvbG9yOiAnIzRkN2MwZicsXG4gIG5lZ2F0aXZlTm9kZUNvbG9yOiAnI2I5MWMxYycsXG4gIG5ldXRyYWxOb2RlQ29sb3I6ICcjYTE2MjA3JyxcbiAgZGVmYXVsdE5vZGVDb2xvcjogJyM0MDQwNDAnLFxuICB3YXJuaW5nTm9kZUNvbG9yOiAnI2ZmZGYyMCcsXG4gIHNoYWRvd0NvbG9yOiAnIzU1NTU1NScsXG4gIGJvYXJkTGluZUNvbG9yOiAnIzAwMDAwMCcsXG4gIGFjdGl2ZUNvbG9yOiAnIzAwMDAwMCcsXG4gIGluYWN0aXZlQ29sb3I6ICcjNjY2NjY2JyxcbiAgYm9hcmRCYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJyxcbiAgZmxhdEJsYWNrQ29sb3I6ICcjMDAwMDAwJyxcbiAgZmxhdEJsYWNrQ29sb3JBbHQ6ICcjMDAwMDAwJywgLy8gQWx0ZXJuYXRpdmUsIHRlbXBvcmFyaWx5IHNhbWUgYXMgbWFpbiBjb2xvclxuICBmbGF0V2hpdGVDb2xvcjogJyNGRkZGRkYnLFxuICBmbGF0V2hpdGVDb2xvckFsdDogJyNGRkZGRkYnLCAvLyBBbHRlcm5hdGl2ZSwgdGVtcG9yYXJpbHkgc2FtZSBhcyBtYWluIGNvbG9yXG4gIGJvYXJkRWRnZUxpbmVXaWR0aDogMixcbiAgYm9hcmRMaW5lV2lkdGg6IDEuMixcbiAgYm9hcmRMaW5lRXh0ZW50OiAwLjUsXG4gIHN0YXJTaXplOiAzLFxuICBtYXJrdXBMaW5lV2lkdGg6IDIsXG4gIGhpZ2hsaWdodENvbG9yOiAnI2ZmZWI2NCcsXG4gIHN0b25lUmF0aW86IDAuNDUsXG59O1xuXG5leHBvcnQgY29uc3QgTUFYX0JPQVJEX1NJWkUgPSAyOTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0JPQVJEX1NJWkUgPSAxOTtcbmV4cG9ydCBjb25zdCBBMV9MRVRURVJTID0gW1xuICAnQScsXG4gICdCJyxcbiAgJ0MnLFxuICAnRCcsXG4gICdFJyxcbiAgJ0YnLFxuICAnRycsXG4gICdIJyxcbiAgJ0onLFxuICAnSycsXG4gICdMJyxcbiAgJ00nLFxuICAnTicsXG4gICdPJyxcbiAgJ1AnLFxuICAnUScsXG4gICdSJyxcbiAgJ1MnLFxuICAnVCcsXG5dO1xuZXhwb3J0IGNvbnN0IEExX0xFVFRFUlNfV0lUSF9JID0gW1xuICAnQScsXG4gICdCJyxcbiAgJ0MnLFxuICAnRCcsXG4gICdFJyxcbiAgJ0YnLFxuICAnRycsXG4gICdIJyxcbiAgJ0knLFxuICAnSicsXG4gICdLJyxcbiAgJ0wnLFxuICAnTScsXG4gICdOJyxcbiAgJ08nLFxuICAnUCcsXG4gICdRJyxcbiAgJ1InLFxuICAnUycsXG5dO1xuZXhwb3J0IGNvbnN0IEExX05VTUJFUlMgPSBbXG4gIDE5LCAxOCwgMTcsIDE2LCAxNSwgMTQsIDEzLCAxMiwgMTEsIDEwLCA5LCA4LCA3LCA2LCA1LCA0LCAzLCAyLCAxLFxuXTtcbmV4cG9ydCBjb25zdCBTR0ZfTEVUVEVSUyA9IFtcbiAgJ2EnLFxuICAnYicsXG4gICdjJyxcbiAgJ2QnLFxuICAnZScsXG4gICdmJyxcbiAgJ2cnLFxuICAnaCcsXG4gICdpJyxcbiAgJ2onLFxuICAnaycsXG4gICdsJyxcbiAgJ20nLFxuICAnbicsXG4gICdvJyxcbiAgJ3AnLFxuICAncScsXG4gICdyJyxcbiAgJ3MnLFxuXTtcbi8vIGV4cG9ydCBjb25zdCBCTEFOS19BUlJBWSA9IGNodW5rKG5ldyBBcnJheSgzNjEpLmZpbGwoMCksIDE5KTtcbmV4cG9ydCBjb25zdCBET1RfU0laRSA9IDM7XG5leHBvcnQgY29uc3QgRVhQQU5EX0ggPSA1O1xuZXhwb3J0IGNvbnN0IEVYUEFORF9WID0gNTtcbmV4cG9ydCBjb25zdCBSRVNQT05TRV9USU1FID0gMTAwO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBib2FyZFNpemU6IDE5LFxuICBwYWRkaW5nOiAxNSxcbiAgZXh0ZW50OiAyLFxuICBpbnRlcmFjdGl2ZTogZmFsc2UsXG4gIGNvb3JkaW5hdGU6IHRydWUsXG4gIHRoZW1lOiBUaGVtZS5GbGF0LFxuICBiYWNrZ3JvdW5kOiBmYWxzZSxcbiAgem9vbTogZmFsc2UsXG4gIHNob3dBbmFseXNpczogZmFsc2UsXG59O1xuXG5leHBvcnQgY29uc3QgVEhFTUVfUkVTT1VSQ0VTOiB7XG4gIFtrZXkgaW4gVGhlbWVdOiB7XG4gICAgYm9hcmQ/OiBzdHJpbmc7XG4gICAgYmxhY2tzOiBzdHJpbmdbXTtcbiAgICB3aGl0ZXM6IHN0cmluZ1tdO1xuICAgIGxvd1Jlcz86IHtcbiAgICAgIGJvYXJkPzogc3RyaW5nO1xuICAgICAgYmxhY2tzOiBzdHJpbmdbXTtcbiAgICAgIHdoaXRlczogc3RyaW5nW107XG4gICAgfTtcbiAgICBtaWNyb1Jlcz86IHtcbiAgICAgIGJvYXJkPzogc3RyaW5nO1xuICAgICAgYmxhY2tzOiBzdHJpbmdbXTtcbiAgICAgIHdoaXRlczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn0gPSB7XG4gIFtUaGVtZS5CbGFja0FuZFdoaXRlXToge1xuICAgIGJsYWNrczogW10sXG4gICAgd2hpdGVzOiBbXSxcbiAgfSxcbiAgW1RoZW1lLlN1YmR1ZWRdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3N1YmR1ZWQvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zdWJkdWVkL2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3N1YmR1ZWQvd2hpdGUucG5nYF0sXG4gIH0sXG4gIFtUaGVtZS5TaGVsbFN0b25lXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUwLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTEucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMi5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUzLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTQucG5nYCxcbiAgICBdLFxuICB9LFxuICBbVGhlbWUuU2xhdGVBbmRTaGVsbF06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGUxLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGUyLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGUzLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGU0LnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGU1LnBuZ2AsXG4gICAgXSxcbiAgICB3aGl0ZXM6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDEucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDIucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDMucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDQucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDUucG5nYCxcbiAgICBdLFxuICB9LFxuICBbVGhlbWUuV2FsbnV0XToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS93YWxudXQvYm9hcmQuanBnYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS93YWxudXQvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvd2FsbnV0L3doaXRlLnBuZ2BdLFxuICB9LFxuICBbVGhlbWUuUGhvdG9yZWFsaXN0aWNdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3Bob3RvcmVhbGlzdGljL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvcGhvdG9yZWFsaXN0aWMvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvcGhvdG9yZWFsaXN0aWMvd2hpdGUucG5nYF0sXG4gIH0sXG4gIFtUaGVtZS5GbGF0XToge1xuICAgIGJsYWNrczogW10sXG4gICAgd2hpdGVzOiBbXSxcbiAgfSxcbiAgW1RoZW1lLldhcm1dOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxuICBbVGhlbWUuRGFya106IHtcbiAgICBibGFja3M6IFtdLFxuICAgIHdoaXRlczogW10sXG4gIH0sXG4gIFtUaGVtZS5ZdW56aU1vbmtleURhcmtdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3ltZC95dW56aS1tb25rZXktZGFyay9ZTUQtQm8tVjEwX2xlc3Nib3JkZXIxOTIwcHgucG5nYCxcbiAgICBibGFja3M6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3ltZC95dW56aS1tb25rZXktZGFyay9ZTUQtQi12MTQtMzM4cHgucG5nYCxcbiAgICBdLFxuICAgIHdoaXRlczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUveW1kL3l1bnppLW1vbmtleS1kYXJrL1lNRC1XLXYxNC0zMzhweC5wbmdgLFxuICAgIF0sXG4gICAgbG93UmVzOiB7XG4gICAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUveW1kL3l1bnppLW1vbmtleS1kYXJrL1lNRC1Cby1WMTBfbGVzc2JvcmRlci05NjBweC5wbmdgLFxuICAgICAgYmxhY2tzOiBbXG4gICAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3ltZC95dW56aS1tb25rZXktZGFyay9ZTUQtQi12MTQtMTM1cHgucG5nYCxcbiAgICAgIF0sXG4gICAgICB3aGl0ZXM6IFtcbiAgICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUveW1kL3l1bnppLW1vbmtleS1kYXJrL1lNRC1XLXYxNC0xMzVweC5wbmdgLFxuICAgICAgXSxcbiAgICB9LFxuICAgIG1pY3JvUmVzOiB7XG4gICAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUveW1kL1lNRC1Cby1WMTBfbGVzc2JvcmRlci05NjBweC5wbmdgLFxuICAgICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUveW1kL1lNRC1CXzE5N3RvNTlweC5wbmdgXSxcbiAgICAgIHdoaXRlczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3ltZC9ZTUQtV18xOTd0bzU5cHgucG5nYF0sXG4gICAgfSxcbiAgfSxcbiAgW1RoZW1lLkhpZ2hDb250cmFzdF06IHtcbiAgICBibGFja3M6IFtdLFxuICAgIHdoaXRlczogW10sXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgTElHSFRfR1JFRU5fUkdCID0gJ3JnYmEoMTM2LCAxNzAsIDYwLCAxKSc7XG5leHBvcnQgY29uc3QgTElHSFRfWUVMTE9XX1JHQiA9ICdyZ2JhKDIwNiwgMjEwLCA4MywgMSknO1xuZXhwb3J0IGNvbnN0IFlFTExPV19SR0IgPSAncmdiYSgyNDIsIDIxNywgNjAsIDEpJztcbmV4cG9ydCBjb25zdCBMSUdIVF9SRURfUkdCID0gJ3JnYmEoMjM2LCAxNDYsIDczLCAxKSc7XG4iLCJleHBvcnQgY29uc3QgTU9WRV9QUk9QX0xJU1QgPSBbXG4gICdCJyxcbiAgLy8gS08gaXMgc3RhbmRhcmQgaW4gbW92ZSBsaXN0IGJ1dCB1c3VhbGx5IGJlIHVzZWQgZm9yIGtvbWkgaW4gZ2FtZWluZm8gcHJvcHNcbiAgLy8gJ0tPJyxcbiAgJ01OJyxcbiAgJ1cnLFxuXTtcbmV4cG9ydCBjb25zdCBTRVRVUF9QUk9QX0xJU1QgPSBbXG4gICdBQicsXG4gICdBRScsXG4gICdBVycsXG4gIC8vVE9ETzogUEwgaXMgYSB2YWx1ZSBvZiBjb2xvciB0eXBlXG4gIC8vICdQTCdcbl07XG5leHBvcnQgY29uc3QgTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVCA9IFtcbiAgJ0EnLFxuICAnQycsXG4gICdETScsXG4gICdHQicsXG4gICdHVycsXG4gICdITycsXG4gICdOJyxcbiAgJ1VDJyxcbiAgJ1YnLFxuXTtcbmV4cG9ydCBjb25zdCBNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNUID0gW1xuICAnQk0nLFxuICAnRE8nLFxuICAnSVQnLFxuICAvLyBURSBpcyBzdGFuZGFyZCBpbiBtb3ZlIGFubm90YXRpb24gZm9yIHRlc3VqaVxuICAvLyAnVEUnLFxuXTtcbmV4cG9ydCBjb25zdCBNQVJLVVBfUFJPUF9MSVNUID0gW1xuICAnQVInLFxuICAnQ1InLFxuICAnTEInLFxuICAnTE4nLFxuICAnTUEnLFxuICAnU0wnLFxuICAnU1EnLFxuICAnVFInLFxuXTtcblxuZXhwb3J0IGNvbnN0IFJPT1RfUFJPUF9MSVNUID0gWydBUCcsICdDQScsICdGRicsICdHTScsICdTVCcsICdTWiddO1xuZXhwb3J0IGNvbnN0IEdBTUVfSU5GT19QUk9QX0xJU1QgPSBbXG4gIC8vVEUgTm9uLXN0YW5kYXJkXG4gICdURScsXG4gIC8vS08gTm9uLXN0YW5kYXJkXG4gICdLTycsXG4gICdBTicsXG4gICdCUicsXG4gICdCVCcsXG4gICdDUCcsXG4gICdEVCcsXG4gICdFVicsXG4gICdHTicsXG4gICdHQycsXG4gICdPTicsXG4gICdPVCcsXG4gICdQQicsXG4gICdQQycsXG4gICdQVycsXG4gICdSRScsXG4gICdSTycsXG4gICdSVScsXG4gICdTTycsXG4gICdUTScsXG4gICdVUycsXG4gICdXUicsXG4gICdXVCcsXG5dO1xuZXhwb3J0IGNvbnN0IFRJTUlOR19QUk9QX0xJU1QgPSBbJ0JMJywgJ09CJywgJ09XJywgJ1dMJ107XG5leHBvcnQgY29uc3QgTUlTQ0VMTEFORU9VU19QUk9QX0xJU1QgPSBbJ0ZHJywgJ1BNJywgJ1ZXJ107XG5cbmV4cG9ydCBjb25zdCBDVVNUT01fUFJPUF9MSVNUID0gWydQSScsICdQQUknLCAnTklEJywgJ1BBVCddO1xuXG5leHBvcnQgY29uc3QgTElTVF9PRl9QT0lOVFNfUFJPUCA9IFsnQUInLCAnQUUnLCAnQVcnLCAnTUEnLCAnU0wnLCAnU1EnLCAnVFInXTtcblxuY29uc3QgVE9LRU5fUkVHRVggPSBuZXcgUmVnRXhwKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuXG5leHBvcnQgY2xhc3MgU2dmUHJvcEJhc2Uge1xuICBwdWJsaWMgdG9rZW46IHN0cmluZztcbiAgcHVibGljIHR5cGU6IHN0cmluZyA9ICctJztcbiAgcHJvdGVjdGVkIF92YWx1ZTogc3RyaW5nID0gJyc7XG4gIHByb3RlY3RlZCBfdmFsdWVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIGFzIHN0cmluZztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgJHt0aGlzLnRva2VufSR7dGhpcy5fdmFsdWVzLm1hcCh2ID0+IGBbJHt2fV1gKS5qb2luKCcnKX1gO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ21vdmUnO1xuICB9XG5cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgTW92ZVByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTW92ZVByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXR1cFByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ3NldHVwJztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgdG9rZW5NYXRjaCA9IHN0ci5tYXRjaChUT0tFTl9SRUdFWCk7XG4gICAgY29uc3QgdmFsTWF0Y2hlcyA9IHN0ci5tYXRjaEFsbCgvXFxbKFtcXHNcXFNdKj8pXFxdL2cpO1xuXG4gICAgbGV0IHRva2VuID0gJyc7XG4gICAgY29uc3QgdmFscyA9IFsuLi52YWxNYXRjaGVzXS5tYXAobSA9PiBtWzFdKTtcbiAgICBpZiAodG9rZW5NYXRjaCkgdG9rZW4gPSB0b2tlbk1hdGNoWzFdO1xuICAgIHJldHVybiBuZXcgU2V0dXBQcm9wKHRva2VuLCB2YWxzKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb2RlQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdub2RlLWFubm90YXRpb24nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE5vZGVBbm5vdGF0aW9uUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOb2RlQW5ub3RhdGlvblByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdtb3ZlLWFubm90YXRpb24nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE1vdmVBbm5vdGF0aW9uUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBNb3ZlQW5ub3RhdGlvblByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBbm5vdGF0aW9uUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHt9XG5leHBvcnQgY2xhc3MgTWFya3VwUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbWFya3VwJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IHRva2VuTWF0Y2ggPSBzdHIubWF0Y2goVE9LRU5fUkVHRVgpO1xuICAgIGNvbnN0IHZhbE1hdGNoZXMgPSBzdHIubWF0Y2hBbGwoL1xcWyhbXFxzXFxTXSo/KVxcXS9nKTtcblxuICAgIGxldCB0b2tlbiA9ICcnO1xuICAgIGNvbnN0IHZhbHMgPSBbLi4udmFsTWF0Y2hlc10ubWFwKG0gPT4gbVsxXSk7XG4gICAgaWYgKHRva2VuTWF0Y2gpIHRva2VuID0gdG9rZW5NYXRjaFsxXTtcbiAgICByZXR1cm4gbmV3IE1hcmt1cFByb3AodG9rZW4sIHZhbHMpO1xuICB9XG5cbiAgLy8gRHVwbGljYXRlZCBjb2RlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzMzOFxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvb3RQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAncm9vdCc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgUm9vdFByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUm9vdFByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHYW1lSW5mb1Byb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdnYW1lLWluZm8nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IEdhbWVJbmZvUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBHYW1lSW5mb1Byb3AoJycsICcnKTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ2N1c3RvbSc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgQ3VzdG9tUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDdXN0b21Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRpbWluZ1Byb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdUaW1pbmcnO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNaXNjZWxsYW5lb3VzUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHt9XG4iLCJpbXBvcnQge2Nsb25lRGVlcH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7U0dGX0xFVFRFUlN9IGZyb20gJy4vY29uc3QnO1xuXG4vLyBUT0RPOiBEdXBsaWNhdGUgd2l0aCBoZWxwZXJzLnRzIHRvIGF2b2lkIGNpcmN1bGFyIGRlcGVuZGVuY3lcbmV4cG9ydCBjb25zdCBzZ2ZUb1BvcyA9IChzdHI6IHN0cmluZykgPT4ge1xuICBjb25zdCBraSA9IHN0clswXSA9PT0gJ0InID8gMSA6IC0xO1xuICBjb25zdCB0ZW1wU3RyID0gL1xcWyguKilcXF0vLmV4ZWMoc3RyKTtcbiAgaWYgKHRlbXBTdHIpIHtcbiAgICBjb25zdCBwb3MgPSB0ZW1wU3RyWzFdO1xuICAgIGNvbnN0IHggPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1swXSk7XG4gICAgY29uc3QgeSA9IFNHRl9MRVRURVJTLmluZGV4T2YocG9zWzFdKTtcbiAgICByZXR1cm4ge3gsIHksIGtpfTtcbiAgfVxuICByZXR1cm4ge3g6IC0xLCB5OiAtMSwga2k6IDB9O1xufTtcblxubGV0IGxpYmVydGllcyA9IDA7XG5sZXQgcmVjdXJzaW9uUGF0aDogc3RyaW5nW10gPSBbXTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzaXplIG9mIGEgbWF0cml4LlxuICogQHBhcmFtIG1hdCBUaGUgbWF0cml4IHRvIGNhbGN1bGF0ZSB0aGUgc2l6ZSBvZi5cbiAqIEByZXR1cm5zIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIG51bWJlciBvZiByb3dzIGFuZCBjb2x1bW5zIGluIHRoZSBtYXRyaXguXG4gKi9cbmNvbnN0IGNhbGNTaXplID0gKG1hdDogbnVtYmVyW11bXSkgPT4ge1xuICBjb25zdCByb3dzU2l6ZSA9IG1hdC5sZW5ndGg7XG4gIGNvbnN0IGNvbHVtbnNTaXplID0gbWF0Lmxlbmd0aCA+IDAgPyBtYXRbMF0ubGVuZ3RoIDogMDtcbiAgcmV0dXJuIFtyb3dzU2l6ZSwgY29sdW1uc1NpemVdO1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBsaWJlcnR5IG9mIGEgc3RvbmUgb24gdGhlIGJvYXJkLlxuICogQHBhcmFtIG1hdCAtIFRoZSBib2FyZCBtYXRyaXguXG4gKiBAcGFyYW0geCAtIFRoZSB4LWNvb3JkaW5hdGUgb2YgdGhlIHN0b25lLlxuICogQHBhcmFtIHkgLSBUaGUgeS1jb29yZGluYXRlIG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSBraSAtIFRoZSB2YWx1ZSBvZiB0aGUgc3RvbmUuXG4gKi9cbmNvbnN0IGNhbGNMaWJlcnR5Q29yZSA9IChtYXQ6IG51bWJlcltdW10sIHg6IG51bWJlciwgeTogbnVtYmVyLCBraTogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IHNpemUgPSBjYWxjU2l6ZShtYXQpO1xuICBpZiAoeCA+PSAwICYmIHggPCBzaXplWzFdICYmIHkgPj0gMCAmJiB5IDwgc2l6ZVswXSkge1xuICAgIGlmIChtYXRbeF1beV0gPT09IGtpICYmICFyZWN1cnNpb25QYXRoLmluY2x1ZGVzKGAke3h9LCR7eX1gKSkge1xuICAgICAgcmVjdXJzaW9uUGF0aC5wdXNoKGAke3h9LCR7eX1gKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHggLSAxLCB5LCBraSk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4ICsgMSwgeSwga2kpO1xuICAgICAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCwgeSAtIDEsIGtpKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHgsIHkgKyAxLCBraSk7XG4gICAgfSBlbHNlIGlmIChtYXRbeF1beV0gPT09IDApIHtcbiAgICAgIGxpYmVydGllcyArPSAxO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgY2FsY0xpYmVydHkgPSAobWF0OiBudW1iZXJbXVtdLCB4OiBudW1iZXIsIHk6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCBzaXplID0gY2FsY1NpemUobWF0KTtcbiAgbGliZXJ0aWVzID0gMDtcbiAgcmVjdXJzaW9uUGF0aCA9IFtdO1xuXG4gIGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID4gc2l6ZVsxXSAtIDEgfHwgeSA+IHNpemVbMF0gLSAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpYmVydHk6IDQsXG4gICAgICByZWN1cnNpb25QYXRoOiBbXSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKG1hdFt4XVt5XSA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBsaWJlcnR5OiA0LFxuICAgICAgcmVjdXJzaW9uUGF0aDogW10sXG4gICAgfTtcbiAgfVxuICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4LCB5LCBraSk7XG4gIHJldHVybiB7XG4gICAgbGliZXJ0eTogbGliZXJ0aWVzLFxuICAgIHJlY3Vyc2lvblBhdGgsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgZXhlY0NhcHR1cmUgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgaTogbnVtYmVyLFxuICBqOiBudW1iZXIsXG4gIGtpOiBudW1iZXJcbikgPT4ge1xuICBjb25zdCBuZXdBcnJheSA9IG1hdDtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlVcCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFVwfSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogLSAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5RG93biwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aERvd259ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiArIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlMZWZ0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoTGVmdH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSAtIDEsXG4gICAgaixcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVJpZ2h0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoUmlnaHR9ID1cbiAgICBjYWxjTGliZXJ0eShtYXQsIGkgKyAxLCBqLCBraSk7XG4gIGlmIChsaWJlcnR5VXAgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoVXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICBpZiAobGliZXJ0eURvd24gPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoRG93bi5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdBcnJheVtwYXJzZUludChjb29yZFswXSldW3BhcnNlSW50KGNvb3JkWzFdKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIGlmIChsaWJlcnR5TGVmdCA9PT0gMCkge1xuICAgIHJlY3Vyc2lvblBhdGhMZWZ0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGl0ZW0uc3BsaXQoJywnKTtcbiAgICAgIG5ld0FycmF5W3BhcnNlSW50KGNvb3JkWzBdKV1bcGFyc2VJbnQoY29vcmRbMV0pXSA9IDA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGxpYmVydHlSaWdodCA9PT0gMCkge1xuICAgIHJlY3Vyc2lvblBhdGhSaWdodC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdBcnJheVtwYXJzZUludChjb29yZFswXSldW3BhcnNlSW50KGNvb3JkWzFdKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBuZXdBcnJheTtcbn07XG5cbmNvbnN0IGNhbkNhcHR1cmUgPSAobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVVwLCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoVXB9ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiAtIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlEb3duLCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoRG93bn0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSxcbiAgICBqICsgMSxcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eUxlZnQsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhMZWZ0fSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpIC0gMSxcbiAgICBqLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5UmlnaHQsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhSaWdodH0gPVxuICAgIGNhbGNMaWJlcnR5KG1hdCwgaSArIDEsIGosIGtpKTtcbiAgaWYgKGxpYmVydHlVcCA9PT0gMCAmJiByZWN1cnNpb25QYXRoVXAubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChsaWJlcnR5RG93biA9PT0gMCAmJiByZWN1cnNpb25QYXRoRG93bi5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGxpYmVydHlMZWZ0ID09PSAwICYmIHJlY3Vyc2lvblBhdGhMZWZ0Lmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobGliZXJ0eVJpZ2h0ID09PSAwICYmIHJlY3Vyc2lvblBhdGhSaWdodC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbk1vdmUgPSAobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCBuZXdBcnJheSA9IGNsb25lRGVlcChtYXQpO1xuICBpZiAoaSA8IDAgfHwgaiA8IDAgfHwgaSA+PSBtYXQubGVuZ3RoIHx8IGogPj0gKG1hdFswXT8ubGVuZ3RoID8/IDApKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKG1hdFtpXVtqXSAhPT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG5ld0FycmF5W2ldW2pdID0ga2k7XG4gIGNvbnN0IHtsaWJlcnR5fSA9IGNhbGNMaWJlcnR5KG5ld0FycmF5LCBpLCBqLCBraSk7XG4gIGlmIChjYW5DYXB0dXJlKG5ld0FycmF5LCBpLCBqLCAta2kpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGNhbkNhcHR1cmUobmV3QXJyYXksIGksIGosIGtpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAobGliZXJ0eSA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBzaG93S2kgPSAoXG4gIGFycmF5OiBudW1iZXJbXVtdLFxuICBzdGVwczogc3RyaW5nW10sXG4gIGlzQ2FwdHVyZWQgPSB0cnVlXG4pID0+IHtcbiAgbGV0IG5ld01hdCA9IGNsb25lRGVlcChhcnJheSk7XG4gIGxldCBoYXNNb3ZlZCA9IGZhbHNlO1xuICBzdGVwcy5mb3JFYWNoKHN0ciA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBraSxcbiAgICB9OiB7XG4gICAgICB4OiBudW1iZXI7XG4gICAgICB5OiBudW1iZXI7XG4gICAgICBraTogbnVtYmVyO1xuICAgIH0gPSBzZ2ZUb1BvcyhzdHIpO1xuICAgIGlmIChpc0NhcHR1cmVkKSB7XG4gICAgICBpZiAoY2FuTW92ZShuZXdNYXQsIHgsIHksIGtpKSkge1xuICAgICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgICAgbmV3TWF0ID0gZXhlY0NhcHR1cmUobmV3TWF0LCB4LCB5LCAta2kpO1xuICAgICAgICBoYXNNb3ZlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld01hdFt4XVt5XSA9IGtpO1xuICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBhcnJhbmdlbWVudDogbmV3TWF0LFxuICAgIGhhc01vdmVkLFxuICB9O1xufTtcbiIsImltcG9ydCB7Y29tcGFjdCwgcmVwbGFjZX0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGJ1aWxkTm9kZVJhbmdlcyxcbiAgaXNJbkFueVJhbmdlLFxuICBjYWxjSGFzaCxcbiAgZ2V0RGVkdXBsaWNhdGVkUHJvcHMsXG4gIGdldE5vZGVOdW1iZXIsXG59IGZyb20gJy4vaGVscGVycyc7XG5cbmltcG9ydCB7VHJlZU1vZGVsLCBUTm9kZX0gZnJvbSAnLi90cmVlJztcbmltcG9ydCB7XG4gIE1vdmVQcm9wLFxuICBTZXR1cFByb3AsXG4gIFJvb3RQcm9wLFxuICBHYW1lSW5mb1Byb3AsXG4gIFNnZlByb3BCYXNlLFxuICBOb2RlQW5ub3RhdGlvblByb3AsXG4gIE1vdmVBbm5vdGF0aW9uUHJvcCxcbiAgTWFya3VwUHJvcCxcbiAgQ3VzdG9tUHJvcCxcbiAgUk9PVF9QUk9QX0xJU1QsXG4gIE1PVkVfUFJPUF9MSVNULFxuICBTRVRVUF9QUk9QX0xJU1QsXG4gIE1BUktVUF9QUk9QX0xJU1QsXG4gIE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QsXG4gIE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QsXG4gIEdBTUVfSU5GT19QUk9QX0xJU1QsXG4gIENVU1RPTV9QUk9QX0xJU1QsXG59IGZyb20gJy4vcHJvcHMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gU0dGIChTbWFydCBHYW1lIEZvcm1hdCkgZmlsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNnZiB7XG4gIE5FV19OT0RFID0gJzsnO1xuICBCUkFOQ0hJTkcgPSBbJygnLCAnKSddO1xuICBQUk9QRVJUWSA9IFsnWycsICddJ107XG4gIExJU1RfSURFTlRJVElFUyA9IFtcbiAgICAnQVcnLFxuICAgICdBQicsXG4gICAgJ0FFJyxcbiAgICAnQVInLFxuICAgICdDUicsXG4gICAgJ0REJyxcbiAgICAnTEInLFxuICAgICdMTicsXG4gICAgJ01BJyxcbiAgICAnU0wnLFxuICAgICdTUScsXG4gICAgJ1RSJyxcbiAgICAnVlcnLFxuICAgICdUQicsXG4gICAgJ1RXJyxcbiAgXTtcbiAgTk9ERV9ERUxJTUlURVJTID0gW3RoaXMuTkVXX05PREVdLmNvbmNhdCh0aGlzLkJSQU5DSElORyk7XG5cbiAgdHJlZTogVHJlZU1vZGVsID0gbmV3IFRyZWVNb2RlbCgpO1xuICByb290OiBUTm9kZSB8IG51bGwgPSBudWxsO1xuICBub2RlOiBUTm9kZSB8IG51bGwgPSBudWxsO1xuICBjdXJyZW50Tm9kZTogVE5vZGUgfCBudWxsID0gbnVsbDtcbiAgcGFyZW50Tm9kZTogVE5vZGUgfCBudWxsID0gbnVsbDtcbiAgbm9kZVByb3BzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBTZ2YgY2xhc3MuXG4gICAqIEBwYXJhbSBjb250ZW50IFRoZSBjb250ZW50IG9mIHRoZSBTZ2YsIGVpdGhlciBhcyBhIHN0cmluZyBvciBhcyBhIFROb2RlKFJvb3Qgbm9kZSkuXG4gICAqIEBwYXJhbSBwYXJzZU9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHBhcnNpbmcgdGhlIFNnZiBjb250ZW50LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjb250ZW50Pzogc3RyaW5nIHwgVE5vZGUsXG4gICAgcHJpdmF0ZSBwYXJzZU9wdGlvbnMgPSB7XG4gICAgICBpZ25vcmVQcm9wTGlzdDogW10sXG4gICAgfVxuICApIHtcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnBhcnNlKGNvbnRlbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLnNldFJvb3QoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgU0dGIHRyZWUuXG4gICAqXG4gICAqIEBwYXJhbSByb290IFRoZSByb290IG5vZGUgdG8gc2V0LlxuICAgKiBAcmV0dXJucyBUaGUgdXBkYXRlZCBTR0YgaW5zdGFuY2UuXG4gICAqL1xuICBzZXRSb290KHJvb3Q6IFROb2RlKSB7XG4gICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgY3VycmVudCBTR0YgdHJlZSB0byBhbiBTR0Ygc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgKiBAcmV0dXJucyBUaGUgU0dGIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJlZS5cbiAgICovXG4gIHRvU2dmKCkge1xuICAgIHJldHVybiBgKCR7dGhpcy5ub2RlVG9TdHJpbmcodGhpcy5yb290KX0pYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgZ2FtZSB0cmVlIHRvIFNHRiBmb3JtYXQgd2l0aG91dCBpbmNsdWRpbmcgYW5hbHlzaXMgZGF0YS5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIFNHRiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZSB0cmVlLlxuICAgKi9cbiAgdG9TZ2ZXaXRob3V0QW5hbHlzaXMoKSB7XG4gICAgY29uc3Qgc2dmID0gYCgke3RoaXMubm9kZVRvU3RyaW5nKHRoaXMucm9vdCl9KWA7XG4gICAgcmV0dXJuIHJlcGxhY2Uoc2dmLCAvXShBXFxbLio/XFxdKS9nLCAnXScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlcyB0aGUgZ2l2ZW4gU0dGIChTbWFydCBHYW1lIEZvcm1hdCkgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gc2dmIC0gVGhlIFNHRiBzdHJpbmcgdG8gcGFyc2UuXG4gICAqL1xuICBwYXJzZShzZ2Y6IHN0cmluZykge1xuICAgIGlmICghc2dmKSByZXR1cm47XG4gICAgc2dmID0gc2dmLnJlcGxhY2UoL1xccysoPyFbXlxcW1xcXV0qXSkvZ20sICcnKTtcbiAgICBsZXQgbm9kZVN0YXJ0ID0gMDtcbiAgICBsZXQgY291bnRlciA9IDA7XG4gICAgY29uc3Qgc3RhY2s6IFROb2RlW10gPSBbXTtcblxuICAgIGNvbnN0IGluTm9kZVJhbmdlcyA9IGJ1aWxkTm9kZVJhbmdlcyhzZ2YpLnNvcnQoKGEsIGIpID0+IGFbMF0gLSBiWzBdKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2dmLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjID0gc2dmW2ldO1xuICAgICAgY29uc3QgaW5zaWRlUHJvcCA9IGlzSW5BbnlSYW5nZShpLCBpbk5vZGVSYW5nZXMpO1xuXG4gICAgICBpZiAodGhpcy5OT0RFX0RFTElNSVRFUlMuaW5jbHVkZXMoYykgJiYgIWluc2lkZVByb3ApIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHNnZi5zbGljZShub2RlU3RhcnQsIGkpO1xuICAgICAgICBpZiAoY29udGVudCAhPT0gJycpIHtcbiAgICAgICAgICBjb25zdCBtb3ZlUHJvcHM6IE1vdmVQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBzZXR1cFByb3BzOiBTZXR1cFByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IHJvb3RQcm9wczogUm9vdFByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IG1hcmt1cFByb3BzOiBNYXJrdXBQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBnYW1lSW5mb1Byb3BzOiBHYW1lSW5mb1Byb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IG5vZGVBbm5vdGF0aW9uUHJvcHM6IE5vZGVBbm5vdGF0aW9uUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgbW92ZUFubm90YXRpb25Qcm9wczogTW92ZUFubm90YXRpb25Qcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBjdXN0b21Qcm9wczogQ3VzdG9tUHJvcFtdID0gW107XG5cbiAgICAgICAgICBjb25zdCBtYXRjaGVzID0gW1xuICAgICAgICAgICAgLi4uY29udGVudC5tYXRjaEFsbChcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC8oW0EtWl0rXFxbW2EtelxcW1xcXV0qXFxdKykvLCAnZycpXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvKFtBLVpdK1xcWy4qP1xcXSspLywgJ2cnKVxuICAgICAgICAgICAgICAvLyBSZWdFeHAoL1tBLVpdKyhcXFsuKj9cXF0pezEsfS8sICdnJylcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC9bQS1aXSsoXFxbW1xcc1xcU10qP1xcXSl7MSx9LywgJ2cnKSxcbiAgICAgICAgICAgICAgUmVnRXhwKC9cXHcrKFxcW1teXFxdXSo/XFxdKD86XFxyP1xcbj9cXHNbXlxcXV0qPykqKXsxLH0vLCAnZycpXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF07XG5cbiAgICAgICAgICBtYXRjaGVzLmZvckVhY2gobSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbk1hdGNoID0gbVswXS5tYXRjaCgvKFtBLVpdKylcXFsvKTtcbiAgICAgICAgICAgIGlmICh0b2tlbk1hdGNoKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5NYXRjaFsxXTtcbiAgICAgICAgICAgICAgaWYgKE1PVkVfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG1vdmVQcm9wcy5wdXNoKE1vdmVQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChTRVRVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgc2V0dXBQcm9wcy5wdXNoKFNldHVwUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoUk9PVF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgcm9vdFByb3BzLnB1c2goUm9vdFByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE1BUktVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbWFya3VwUHJvcHMucHVzaChNYXJrdXBQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChHQU1FX0lORk9fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvUHJvcHMucHVzaChHYW1lSW5mb1Byb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcy5wdXNoKE5vZGVBbm5vdGF0aW9uUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBtb3ZlQW5ub3RhdGlvblByb3BzLnB1c2goTW92ZUFubm90YXRpb25Qcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChDVVNUT01fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIGN1c3RvbVByb3BzLnB1c2goQ3VzdG9tUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgaGFzaCA9IGNhbGNIYXNoKHRoaXMuY3VycmVudE5vZGUsIG1vdmVQcm9wcyk7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy50cmVlLnBhcnNlKHtcbiAgICAgICAgICAgICAgaWQ6IGhhc2gsXG4gICAgICAgICAgICAgIG5hbWU6IGhhc2gsXG4gICAgICAgICAgICAgIGluZGV4OiBjb3VudGVyLFxuICAgICAgICAgICAgICBudW1iZXI6IDAsXG4gICAgICAgICAgICAgIG1vdmVQcm9wcyxcbiAgICAgICAgICAgICAgc2V0dXBQcm9wcyxcbiAgICAgICAgICAgICAgcm9vdFByb3BzLFxuICAgICAgICAgICAgICBtYXJrdXBQcm9wcyxcbiAgICAgICAgICAgICAgZ2FtZUluZm9Qcm9wcyxcbiAgICAgICAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgICAgICAgY3VzdG9tUHJvcHMsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICAgICAgICBub2RlLm1vZGVsLm51bWJlciA9IGdldE5vZGVOdW1iZXIobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBub2RlO1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoYyA9PT0gJygnICYmIHRoaXMuY3VycmVudE5vZGUgJiYgIWluc2lkZVByb3ApIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYCR7c2dmW2ldfSR7c2dmW2kgKyAxXX0ke3NnZltpICsgMl19YCk7XG4gICAgICAgIHN0YWNrLnB1c2godGhpcy5jdXJyZW50Tm9kZSk7XG4gICAgICB9XG4gICAgICBpZiAoYyA9PT0gJyknICYmICFpbnNpZGVQcm9wICYmIHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLk5PREVfREVMSU1JVEVSUy5pbmNsdWRlcyhjKSAmJiAhaW5zaWRlUHJvcCkge1xuICAgICAgICBub2RlU3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIG5vZGUgdG8gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBub2RlIC0gVGhlIG5vZGUgdG8gY29udmVydC5cbiAgICogQHJldHVybnMgVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbm9kZS5cbiAgICovXG4gIHByaXZhdGUgbm9kZVRvU3RyaW5nKG5vZGU6IGFueSkge1xuICAgIGxldCBjb250ZW50ID0gJyc7XG4gICAgbm9kZS53YWxrKChuOiBUTm9kZSkgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICByb290UHJvcHMsXG4gICAgICAgIG1vdmVQcm9wcyxcbiAgICAgICAgY3VzdG9tUHJvcHMsXG4gICAgICAgIHNldHVwUHJvcHMsXG4gICAgICAgIG1hcmt1cFByb3BzLFxuICAgICAgICBub2RlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICBtb3ZlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICBnYW1lSW5mb1Byb3BzLFxuICAgICAgfSA9IG4ubW9kZWw7XG4gICAgICBjb25zdCBub2RlcyA9IGNvbXBhY3QoW1xuICAgICAgICAuLi5yb290UHJvcHMsXG4gICAgICAgIC4uLmN1c3RvbVByb3BzLFxuICAgICAgICAuLi5tb3ZlUHJvcHMsXG4gICAgICAgIC4uLmdldERlZHVwbGljYXRlZFByb3BzKHNldHVwUHJvcHMpLFxuICAgICAgICAuLi5nZXREZWR1cGxpY2F0ZWRQcm9wcyhtYXJrdXBQcm9wcyksXG4gICAgICAgIC4uLmdhbWVJbmZvUHJvcHMsXG4gICAgICAgIC4uLm5vZGVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgIC4uLm1vdmVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICBdKTtcbiAgICAgIGNvbnRlbnQgKz0gJzsnO1xuICAgICAgbm9kZXMuZm9yRWFjaCgobjogU2dmUHJvcEJhc2UpID0+IHtcbiAgICAgICAgY29udGVudCArPSBuLnRvU3RyaW5nKCk7XG4gICAgICB9KTtcbiAgICAgIGlmIChuLmNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbi5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogVE5vZGUpID0+IHtcbiAgICAgICAgICBjb250ZW50ICs9IGAoJHt0aGlzLm5vZGVUb1N0cmluZyhjaGlsZCl9KWA7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG4uY2hpbGRyZW4ubGVuZ3RoIDwgMjtcbiAgICB9KTtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxufVxuIiwiaW1wb3J0IHtUcmVlTW9kZWwsIFROb2RlfSBmcm9tICcuL2NvcmUvdHJlZSc7XG5pbXBvcnQge2Nsb25lRGVlcCwgZmxhdHRlbkRlcHRoLCBjbG9uZSwgc3VtLCBjb21wYWN0LCBzYW1wbGV9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1NnZk5vZGUsIFNnZk5vZGVPcHRpb25zfSBmcm9tICcuL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHtcbiAgaXNNb3ZlTm9kZSxcbiAgaXNTZXR1cE5vZGUsXG4gIGNhbGNIYXNoLFxuICBnZXROb2RlTnVtYmVyLFxuICBpc1Jvb3ROb2RlLFxufSBmcm9tICcuL2NvcmUvaGVscGVycyc7XG5leHBvcnQge2lzTW92ZU5vZGUsIGlzU2V0dXBOb2RlLCBjYWxjSGFzaCwgZ2V0Tm9kZU51bWJlciwgaXNSb290Tm9kZX07XG5pbXBvcnQge1xuICBBMV9MRVRURVJTLFxuICBBMV9OVU1CRVJTLFxuICBTR0ZfTEVUVEVSUyxcbiAgTUFYX0JPQVJEX1NJWkUsXG4gIExJR0hUX0dSRUVOX1JHQixcbiAgTElHSFRfWUVMTE9XX1JHQixcbiAgTElHSFRfUkVEX1JHQixcbiAgWUVMTE9XX1JHQixcbiAgREVGQVVMVF9CT0FSRF9TSVpFLFxufSBmcm9tICcuL2NvbnN0JztcbmltcG9ydCB7XG4gIFNldHVwUHJvcCxcbiAgTW92ZVByb3AsXG4gIEN1c3RvbVByb3AsXG4gIFNnZlByb3BCYXNlLFxuICBOb2RlQW5ub3RhdGlvblByb3AsXG4gIEdhbWVJbmZvUHJvcCxcbiAgTW92ZUFubm90YXRpb25Qcm9wLFxuICBSb290UHJvcCxcbiAgTWFya3VwUHJvcCxcbiAgTU9WRV9QUk9QX0xJU1QsXG4gIFNFVFVQX1BST1BfTElTVCxcbiAgTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgTUFSS1VQX1BST1BfTElTVCxcbiAgUk9PVF9QUk9QX0xJU1QsXG4gIEdBTUVfSU5GT19QUk9QX0xJU1QsXG4gIFRJTUlOR19QUk9QX0xJU1QsXG4gIE1JU0NFTExBTkVPVVNfUFJPUF9MSVNULFxuICBDVVNUT01fUFJPUF9MSVNULFxufSBmcm9tICcuL2NvcmUvcHJvcHMnO1xuaW1wb3J0IHtcbiAgQW5hbHlzaXMsXG4gIEdob3N0QmFuT3B0aW9ucyxcbiAgS2ksXG4gIE1vdmVJbmZvLFxuICBQcm9ibGVtQW5zd2VyVHlwZSBhcyBQQVQsXG4gIFJvb3RJbmZvLFxuICBNYXJrdXAsXG4gIFBhdGhEZXRlY3Rpb25TdHJhdGVneSxcbn0gZnJvbSAnLi90eXBlcyc7XG5cbmltcG9ydCB7Q2VudGVyfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7Y2FuTW92ZSwgZXhlY0NhcHR1cmV9IGZyb20gJy4vYm9hcmRjb3JlJztcbmV4cG9ydCB7Y2FuTW92ZSwgZXhlY0NhcHR1cmV9O1xuXG5pbXBvcnQge1NnZn0gZnJvbSAnLi9jb3JlL3NnZic7XG5cbnR5cGUgU3RyYXRlZ3kgPSAncG9zdCcgfCAncHJlJyB8ICdib3RoJztcblxuY29uc3QgU3BhcmtNRDUgPSByZXF1aXJlKCdzcGFyay1tZDUnKTtcblxuZXhwb3J0IGNvbnN0IGNhbGNEb3VidGZ1bE1vdmVzVGhyZXNob2xkUmFuZ2UgPSAodGhyZXNob2xkOiBudW1iZXIpID0+IHtcbiAgLy8gOEQtOURcbiAgaWYgKHRocmVzaG9sZCA+PSAyNSkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjE1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0zXX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4xNSwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMywgLTJdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wNV0sIHNjb3JlUmFuZ2U6IFstMiwgLTFdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDUsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0xLCAtMC41XX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1RC03RFxuICBpZiAodGhyZXNob2xkID49IDIzICYmIHRocmVzaG9sZCA8IDI1KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMl0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtOF19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMiwgLTAuMTVdLCBzY29yZVJhbmdlOiBbLTgsIC00XX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTUsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy00LCAtMl19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTIsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuXG4gIC8vIDNELTVEXG4gIGlmICh0aHJlc2hvbGQgPj0gMjAgJiYgdGhyZXNob2xkIDwgMjMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4yNV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMTJdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjI1LCAtMC4xXSwgc2NvcmVSYW5nZTogWy0xMiwgLTVdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wNV0sIHNjb3JlUmFuZ2U6IFstNSwgLTJdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDUsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0yLCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gMUQtM0RcbiAgaWYgKHRocmVzaG9sZCA+PSAxOCAmJiB0aHJlc2hvbGQgPCAyMCkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjNdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTE1XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zLCAtMC4xXSwgc2NvcmVSYW5nZTogWy0xNSwgLTddfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wNV0sIHNjb3JlUmFuZ2U6IFstNywgLTVdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDUsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy01LCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gNUstMUtcbiAgaWYgKHRocmVzaG9sZCA+PSAxMyAmJiB0aHJlc2hvbGQgPCAxOCkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjM1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0yMF19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMzUsIC0wLjEyXSwgc2NvcmVSYW5nZTogWy0yMCwgLTEwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTIsIC0wLjA4XSwgc2NvcmVSYW5nZTogWy0xMCwgLTVdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDgsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy01LCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gNUstMTBLXG4gIGlmICh0aHJlc2hvbGQgPj0gOCAmJiB0aHJlc2hvbGQgPCAxMykge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjRdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTI1XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC40LCAtMC4xNV0sIHNjb3JlUmFuZ2U6IFstMjUsIC0xMF19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjE1LCAtMC4xXSwgc2NvcmVSYW5nZTogWy0xMCwgLTVdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyAxOEstMTBLXG4gIGlmICh0aHJlc2hvbGQgPj0gMCAmJiB0aHJlc2hvbGQgPCA4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuNDVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTM1XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC40NSwgLTAuMl0sIHNjb3JlUmFuZ2U6IFstMzUsIC0yMF19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjIsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTEwLCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjNdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTMwXX0sXG4gICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMywgLTAuMl0sIHNjb3JlUmFuZ2U6IFstMzAsIC0yMF19LFxuICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4yLCAtMC4xXSwgc2NvcmVSYW5nZTogWy0yMCwgLTEwXX0sXG4gICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMTAsIC0xXX0sXG4gICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByb3VuZDIgPSAodjogbnVtYmVyLCBzY2FsZSA9IDEsIGZpeGVkID0gMikgPT4ge1xuICByZXR1cm4gKChNYXRoLnJvdW5kKHYgKiAxMDApIC8gMTAwKSAqIHNjYWxlKS50b0ZpeGVkKGZpeGVkKTtcbn07XG5cbmV4cG9ydCBjb25zdCByb3VuZDMgPSAodjogbnVtYmVyLCBzY2FsZSA9IDEsIGZpeGVkID0gMykgPT4ge1xuICByZXR1cm4gKChNYXRoLnJvdW5kKHYgKiAxMDAwKSAvIDEwMDApICogc2NhbGUpLnRvRml4ZWQoZml4ZWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQW5zd2VyTm9kZSA9IChuOiBUTm9kZSwga2luZDogUEFUKSA9PiB7XG4gIGNvbnN0IHBhdCA9IG4ubW9kZWwuY3VzdG9tUHJvcHM/LmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQVQnKTtcbiAgcmV0dXJuIHBhdD8udmFsdWUgPT09IGtpbmQ7XG59O1xuXG5leHBvcnQgY29uc3QgaXNDaG9pY2VOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiAhIWM/LnZhbHVlLmluY2x1ZGVzKCdDSE9JQ0UnKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1RhcmdldE5vZGUgPSBpc0Nob2ljZU5vZGU7XG5cbmV4cG9ydCBjb25zdCBpc0ZvcmNlTm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gYz8udmFsdWUuaW5jbHVkZXMoJ0ZPUkNFJyk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNQcmV2ZW50TW92ZU5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuIGM/LnZhbHVlLmluY2x1ZGVzKCdOT1RUSElTJyk7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgaXNSaWdodExlYWYgPSAobjogVE5vZGUpID0+IHtcbi8vICAgcmV0dXJuIGlzUmlnaHROb2RlKG4pICYmICFuLmhhc0NoaWxkcmVuKCk7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaXNSaWdodE5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuICEhYz8udmFsdWUuaW5jbHVkZXMoJ1JJR0hUJyk7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgaXNGaXJzdFJpZ2h0TGVhZiA9IChuOiBUTm9kZSkgPT4ge1xuLy8gICBjb25zdCByb290ID0gbi5nZXRQYXRoKClbMF07XG4vLyAgIGNvbnN0IGZpcnN0UmlnaHRMZWF2ZSA9IHJvb3QuZmlyc3QoKG46IFROb2RlKSA9PlxuLy8gICAgIGlzUmlnaHRMZWFmKG4pXG4vLyAgICk7XG4vLyAgIHJldHVybiBmaXJzdFJpZ2h0TGVhdmU/Lm1vZGVsLmlkID09PSBuLm1vZGVsLmlkO1xuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGlzRmlyc3RSaWdodE5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3Qgcm9vdCA9IG4uZ2V0UGF0aCgpWzBdO1xuICBjb25zdCBmaXJzdFJpZ2h0Tm9kZSA9IHJvb3QuZmlyc3QobiA9PiBpc1JpZ2h0Tm9kZShuKSk7XG4gIHJldHVybiBmaXJzdFJpZ2h0Tm9kZT8ubW9kZWwuaWQgPT09IG4ubW9kZWwuaWQ7XG59O1xuXG5leHBvcnQgY29uc3QgaXNWYXJpYW50Tm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gISFjPy52YWx1ZS5pbmNsdWRlcygnVkFSSUFOVCcpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzVmFyaWFudExlYWYgPSAobjogVE5vZGUpID0+IHtcbi8vICAgcmV0dXJuIGlzVmFyaWFudE5vZGUobikgJiYgIW4uaGFzQ2hpbGRyZW4oKTtcbi8vIH07XG5cbmV4cG9ydCBjb25zdCBpc1dyb25nTm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gKCFjPy52YWx1ZS5pbmNsdWRlcygnVkFSSUFOVCcpICYmICFjPy52YWx1ZS5pbmNsdWRlcygnUklHSFQnKSkgfHwgIWM7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgaXNXcm9uZ0xlYWYgPSAobjogVE5vZGUpID0+IHtcbi8vICAgcmV0dXJuIGlzV3JvbmdOb2RlKG4pICYmICFuLmhhc0NoaWxkcmVuKCk7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaW5QYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgZGV0ZWN0aW9uTWV0aG9kOiAobjogVE5vZGUpID0+IGJvb2xlYW4sXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdXG4pID0+IHtcbiAgY29uc3QgcGF0aCA9IHByZU5vZGVzID8/IG5vZGUuZ2V0UGF0aCgpO1xuICBjb25zdCBwb3N0UmlnaHROb2RlcyA9XG4gICAgcG9zdE5vZGVzPy5maWx0ZXIoKG46IFROb2RlKSA9PiBkZXRlY3Rpb25NZXRob2QobikpID8/XG4gICAgbm9kZS5hbGwoKG46IFROb2RlKSA9PiBkZXRlY3Rpb25NZXRob2QobikpO1xuICBjb25zdCBwcmVSaWdodE5vZGVzID0gcGF0aC5maWx0ZXIoKG46IFROb2RlKSA9PiBkZXRlY3Rpb25NZXRob2QobikpO1xuXG4gIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0OlxuICAgICAgcmV0dXJuIHBvc3RSaWdodE5vZGVzLmxlbmd0aCA+IDA7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUHJlOlxuICAgICAgcmV0dXJuIHByZVJpZ2h0Tm9kZXMubGVuZ3RoID4gMDtcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Cb3RoOlxuICAgICAgcmV0dXJuIHByZVJpZ2h0Tm9kZXMubGVuZ3RoID4gMCB8fCBwb3N0UmlnaHROb2Rlcy5sZW5ndGggPiAwO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpblJpZ2h0UGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc1JpZ2h0Tm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGluRmlyc3RSaWdodFBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNGaXJzdFJpZ2h0Tm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGluRmlyc3RCcmFuY2hSaWdodFBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlByZSxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgaWYgKCFpblJpZ2h0UGF0aChub2RlKSkgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IHBhdGggPSBwcmVOb2RlcyA/PyBub2RlLmdldFBhdGgoKTtcbiAgY29uc3QgcG9zdFJpZ2h0Tm9kZXMgPSBwb3N0Tm9kZXMgPz8gbm9kZS5hbGwoKCkgPT4gdHJ1ZSk7XG5cbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdDpcbiAgICAgIHJlc3VsdCA9IHBvc3RSaWdodE5vZGVzLmZpbHRlcihuID0+IG4uZ2V0SW5kZXgoKSA+IDApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUHJlOlxuICAgICAgcmVzdWx0ID0gcGF0aC5maWx0ZXIobiA9PiBuLmdldEluZGV4KCkgPiAwKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LkJvdGg6XG4gICAgICByZXN1bHQgPSBwYXRoLmNvbmNhdChwb3N0UmlnaHROb2RlcykuZmlsdGVyKG4gPT4gbi5nZXRJbmRleCgpID4gMCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQubGVuZ3RoID09PSAwO1xufTtcblxuZXhwb3J0IGNvbnN0IGluQ2hvaWNlUGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc0Nob2ljZU5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpblRhcmdldFBhdGggPSBpbkNob2ljZVBhdGg7XG5cbmV4cG9ydCBjb25zdCBpblZhcmlhbnRQYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gaW5QYXRoKG5vZGUsIGlzVmFyaWFudE5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbldyb25nUGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc1dyb25nTm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IG5Gb3JtYXR0ZXIgPSAobnVtOiBudW1iZXIsIGZpeGVkID0gMSkgPT4ge1xuICBjb25zdCBsb29rdXAgPSBbXG4gICAge3ZhbHVlOiAxLCBzeW1ib2w6ICcnfSxcbiAgICB7dmFsdWU6IDFlMywgc3ltYm9sOiAnayd9LFxuICAgIHt2YWx1ZTogMWU2LCBzeW1ib2w6ICdNJ30sXG4gICAge3ZhbHVlOiAxZTksIHN5bWJvbDogJ0cnfSxcbiAgICB7dmFsdWU6IDFlMTIsIHN5bWJvbDogJ1QnfSxcbiAgICB7dmFsdWU6IDFlMTUsIHN5bWJvbDogJ1AnfSxcbiAgICB7dmFsdWU6IDFlMTgsIHN5bWJvbDogJ0UnfSxcbiAgXTtcbiAgY29uc3QgcnggPSAvXFwuMCskfChcXC5bMC05XSpbMS05XSkwKyQvO1xuICBjb25zdCBpdGVtID0gbG9va3VwXG4gICAgLnNsaWNlKClcbiAgICAucmV2ZXJzZSgpXG4gICAgLmZpbmQoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gbnVtID49IGl0ZW0udmFsdWU7XG4gICAgfSk7XG4gIHJldHVybiBpdGVtXG4gICAgPyAobnVtIC8gaXRlbS52YWx1ZSkudG9GaXhlZChmaXhlZCkucmVwbGFjZShyeCwgJyQxJykgKyBpdGVtLnN5bWJvbFxuICAgIDogJzAnO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhdGhUb0luZGV4ZXMgPSAocGF0aDogVE5vZGVbXSk6IHN0cmluZ1tdID0+IHtcbiAgcmV0dXJuIHBhdGgubWFwKG4gPT4gbi5tb2RlbC5pZCk7XG59O1xuXG5leHBvcnQgY29uc3QgcGF0aFRvSW5pdGlhbFN0b25lcyA9IChcbiAgcGF0aDogVE5vZGVbXSxcbiAgeE9mZnNldCA9IDAsXG4gIHlPZmZzZXQgPSAwXG4pOiBzdHJpbmdbXSA9PiB7XG4gIGNvbnN0IGluaXRzID0gcGF0aFxuICAgIC5maWx0ZXIobiA9PiBuLm1vZGVsLnNldHVwUHJvcHMubGVuZ3RoID4gMClcbiAgICAubWFwKG4gPT4ge1xuICAgICAgcmV0dXJuIG4ubW9kZWwuc2V0dXBQcm9wcy5tYXAoKHNldHVwOiBTZXR1cFByb3ApID0+IHtcbiAgICAgICAgcmV0dXJuIHNldHVwLnZhbHVlcy5tYXAoKHY6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IGEgPSBBMV9MRVRURVJTW1NHRl9MRVRURVJTLmluZGV4T2YodlswXSkgKyB4T2Zmc2V0XTtcbiAgICAgICAgICBjb25zdCBiID0gQTFfTlVNQkVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHZbMV0pICsgeU9mZnNldF07XG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBzZXR1cC50b2tlbiA9PT0gJ0FCJyA/ICdCJyA6ICdXJztcbiAgICAgICAgICByZXR1cm4gW3Rva2VuLCBhICsgYl07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIHJldHVybiBmbGF0dGVuRGVwdGgoaW5pdHNbMF0sIDEpO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhdGhUb0FpTW92ZXMgPSAocGF0aDogVE5vZGVbXSwgeE9mZnNldCA9IDAsIHlPZmZzZXQgPSAwKSA9PiB7XG4gIGNvbnN0IG1vdmVzID0gcGF0aFxuICAgIC5maWx0ZXIobiA9PiBuLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPiAwKVxuICAgIC5tYXAobiA9PiB7XG4gICAgICBjb25zdCBwcm9wID0gbi5tb2RlbC5tb3ZlUHJvcHNbMF07XG4gICAgICBjb25zdCBhID0gQTFfTEVUVEVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHByb3AudmFsdWVbMF0pICsgeE9mZnNldF07XG4gICAgICBjb25zdCBiID0gQTFfTlVNQkVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHByb3AudmFsdWVbMV0pICsgeU9mZnNldF07XG4gICAgICByZXR1cm4gW3Byb3AudG9rZW4sIGEgKyBiXTtcbiAgICB9KTtcbiAgcmV0dXJuIG1vdmVzO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4RnJvbUFuYWx5c2lzID0gKGE6IEFuYWx5c2lzKSA9PiB7XG4gIGlmICgvaW5kZXhlcy8udGVzdChhLmlkKSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGEuaWQpLmluZGV4ZXNbMF07XG4gIH1cbiAgcmV0dXJuICcnO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTWFpblBhdGggPSAobm9kZTogVE5vZGUpID0+IHtcbiAgcmV0dXJuIHN1bShub2RlLmdldFBhdGgoKS5tYXAobiA9PiBuLmdldEluZGV4KCkpKSA9PT0gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZUb1BvcyA9IChzdHI6IHN0cmluZykgPT4ge1xuICBjb25zdCBraSA9IHN0clswXSA9PT0gJ0InID8gMSA6IC0xO1xuICBjb25zdCB0ZW1wU3RyID0gL1xcWyguKilcXF0vLmV4ZWMoc3RyKTtcbiAgaWYgKHRlbXBTdHIpIHtcbiAgICBjb25zdCBwb3MgPSB0ZW1wU3RyWzFdO1xuICAgIGNvbnN0IHggPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1swXSk7XG4gICAgY29uc3QgeSA9IFNHRl9MRVRURVJTLmluZGV4T2YocG9zWzFdKTtcbiAgICByZXR1cm4ge3gsIHksIGtpfTtcbiAgfVxuICByZXR1cm4ge3g6IC0xLCB5OiAtMSwga2k6IDB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHNnZlRvQTEgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qge3gsIHl9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgcmV0dXJuIEExX0xFVFRFUlNbeF0gKyBBMV9OVU1CRVJTW3ldO1xufTtcblxuZXhwb3J0IGNvbnN0IGExVG9Qb3MgPSAobW92ZTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHggPSBBMV9MRVRURVJTLmluZGV4T2YobW92ZVswXSk7XG4gIGNvbnN0IHkgPSBBMV9OVU1CRVJTLmluZGV4T2YocGFyc2VJbnQobW92ZS5zdWJzdHIoMSksIDApKTtcbiAgcmV0dXJuIHt4LCB5fTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvSW5kZXggPSAobW92ZTogc3RyaW5nLCBib2FyZFNpemUgPSAxOSkgPT4ge1xuICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pO1xuICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSk7XG4gIHJldHVybiB4ICogYm9hcmRTaXplICsgeTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZPZmZzZXQgPSAoc2dmOiBhbnksIG9mZnNldCA9IDApID0+IHtcbiAgaWYgKG9mZnNldCA9PT0gMCkgcmV0dXJuIHNnZjtcbiAgY29uc3QgcmVzID0gY2xvbmUoc2dmKTtcbiAgY29uc3QgY2hhckluZGV4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihzZ2ZbMl0pIC0gb2Zmc2V0O1xuICByZXR1cm4gcmVzLnN1YnN0cigwLCAyKSArIFNHRl9MRVRURVJTW2NoYXJJbmRleF0gKyByZXMuc3Vic3RyKDIgKyAxKTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvU0dGID0gKHN0cjogYW55LCB0eXBlID0gJ0InLCBvZmZzZXRYID0gMCwgb2Zmc2V0WSA9IDApID0+IHtcbiAgaWYgKHN0ciA9PT0gJ3Bhc3MnKSByZXR1cm4gYCR7dHlwZX1bXWA7XG4gIGNvbnN0IGlueCA9IEExX0xFVFRFUlMuaW5kZXhPZihzdHJbMF0pICsgb2Zmc2V0WDtcbiAgY29uc3QgaW55ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KHN0ci5zdWJzdHIoMSksIDApKSArIG9mZnNldFk7XG4gIGNvbnN0IHNnZiA9IGAke3R5cGV9WyR7U0dGX0xFVFRFUlNbaW54XX0ke1NHRl9MRVRURVJTW2lueV19XWA7XG4gIHJldHVybiBzZ2Y7XG59O1xuXG5leHBvcnQgY29uc3QgcG9zVG9TZ2YgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3QgYXggPSBTR0ZfTEVUVEVSU1t4XTtcbiAgY29uc3QgYXkgPSBTR0ZfTEVUVEVSU1t5XTtcbiAgaWYgKGtpID09PSBLaS5FbXB0eSkgcmV0dXJuICcnO1xuICBpZiAoa2kgPT09IEtpLldoaXRlKSByZXR1cm4gYEJbJHtheH0ke2F5fV1gO1xuICBpZiAoa2kgPT09IEtpLkJsYWNrKSByZXR1cm4gYFdbJHtheH0ke2F5fV1gO1xuICByZXR1cm4gJyc7XG59O1xuXG5leHBvcnQgY29uc3QgbWF0VG9Qb3NpdGlvbiA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICB4T2Zmc2V0PzogbnVtYmVyLFxuICB5T2Zmc2V0PzogbnVtYmVyXG4pID0+IHtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICB4T2Zmc2V0ID0geE9mZnNldCA/PyAwO1xuICB5T2Zmc2V0ID0geU9mZnNldCA/PyBERUZBVUxUX0JPQVJEX1NJWkUgLSBtYXQubGVuZ3RoO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG1hdFtpXVtqXTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICBjb25zdCB4ID0gQTFfTEVUVEVSU1tpICsgeE9mZnNldF07XG4gICAgICAgIGNvbnN0IHkgPSBBMV9OVU1CRVJTW2ogKyB5T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgY29sb3IgPSB2YWx1ZSA9PT0gMSA/ICdiJyA6ICd3JztcbiAgICAgICAgcmVzdWx0ICs9IGAke2NvbG9yfSAke3h9JHt5fSBgO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IG1hdFRvTGlzdE9mVHVwbGVzID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIHhPZmZzZXQgPSAwLFxuICB5T2Zmc2V0ID0gMFxuKSA9PiB7XG4gIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBtYXRbaV1bal07XG4gICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgY29uc3QgeCA9IEExX0xFVFRFUlNbaSArIHhPZmZzZXRdO1xuICAgICAgICBjb25zdCB5ID0gQTFfTlVNQkVSU1tqICsgeU9mZnNldF07XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdmFsdWUgPT09IDEgPyAnQicgOiAnVyc7XG4gICAgICAgIHJlc3VsdHMucHVzaChbY29sb3IsIHggKyB5XSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnRTdG9uZVR5cGVUb1N0cmluZyA9ICh0eXBlOiBhbnkpID0+ICh0eXBlID09PSAxID8gJ0InIDogJ1cnKTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnRTdGVwc0ZvckFJID0gKHN0ZXBzOiBhbnksIG9mZnNldCA9IDApID0+IHtcbiAgbGV0IHJlcyA9IGNsb25lKHN0ZXBzKTtcbiAgcmVzID0gcmVzLm1hcCgoczogYW55KSA9PiBzZ2ZPZmZzZXQocywgb2Zmc2V0KSk7XG4gIGNvbnN0IGhlYWRlciA9IGAoO0ZGWzRdR01bMV1TWlske1xuICAgIDE5IC0gb2Zmc2V0XG4gIH1dR05bMjI2XVBCW0JsYWNrXUhBWzBdUFdbV2hpdGVdS01bNy41XURUWzIwMTctMDgtMDFdVE1bMTgwMF1SVVtDaGluZXNlXUNQW0NvcHlyaWdodCBnaG9zdC1nby5jb21dQVBbZ2hvc3QtZ28uY29tXVBMW0JsYWNrXTtgO1xuICBsZXQgY291bnQgPSAwO1xuICBsZXQgcHJldiA9ICcnO1xuICBzdGVwcy5mb3JFYWNoKChzdGVwOiBhbnksIGluZGV4OiBhbnkpID0+IHtcbiAgICBpZiAoc3RlcFswXSA9PT0gcHJldlswXSkge1xuICAgICAgaWYgKHN0ZXBbMF0gPT09ICdCJykge1xuICAgICAgICByZXMuc3BsaWNlKGluZGV4ICsgY291bnQsIDAsICdXW3R0XScpO1xuICAgICAgICBjb3VudCArPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLnNwbGljZShpbmRleCArIGNvdW50LCAwLCAnQlt0dF0nKTtcbiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcHJldiA9IHN0ZXA7XG4gIH0pO1xuICByZXR1cm4gYCR7aGVhZGVyfSR7cmVzLmpvaW4oJzsnKX0pYDtcbn07XG5cbmV4cG9ydCBjb25zdCBvZmZzZXRBMU1vdmUgPSAobW92ZTogc3RyaW5nLCBveCA9IDAsIG95ID0gMCkgPT4ge1xuICBpZiAobW92ZSA9PT0gJ3Bhc3MnKSByZXR1cm4gbW92ZTtcbiAgLy8gY29uc29sZS5sb2coJ294eScsIG94LCBveSk7XG4gIGNvbnN0IGlueCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKSArIG94O1xuICBjb25zdCBpbnkgPSBBMV9OVU1CRVJTLmluZGV4T2YocGFyc2VJbnQobW92ZS5zdWJzdHIoMSksIDApKSArIG95O1xuICAvLyBjb25zb2xlLmxvZygnaW54eScsIGlueCwgaW55LCBgJHtBMV9MRVRURVJTW2lueF19JHtBMV9OVU1CRVJTW2lueV19YCk7XG4gIHJldHVybiBgJHtBMV9MRVRURVJTW2lueF19JHtBMV9OVU1CRVJTW2lueV19YDtcbn07XG5cbmV4cG9ydCBjb25zdCByZXZlcnNlT2Zmc2V0QTFNb3ZlID0gKFxuICBtb3ZlOiBzdHJpbmcsXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgYW5hbHlzaXM6IEFuYWx5c2lzLFxuICBib2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGlmIChtb3ZlID09PSAncGFzcycpIHJldHVybiBtb3ZlO1xuICBjb25zdCBpZE9iaiA9IEpTT04ucGFyc2UoYW5hbHlzaXMuaWQpO1xuICBjb25zdCB7eCwgeX0gPSByZXZlcnNlT2Zmc2V0KG1hdCwgaWRPYmouYngsIGlkT2JqLmJ5LCBib2FyZFNpemUpO1xuICBjb25zdCBpbnggPSBBMV9MRVRURVJTLmluZGV4T2YobW92ZVswXSkgKyB4O1xuICBjb25zdCBpbnkgPSBBMV9OVU1CRVJTLmluZGV4T2YocGFyc2VJbnQobW92ZS5zdWJzdHIoMSksIDApKSArIHk7XG4gIHJldHVybiBgJHtBMV9MRVRURVJTW2lueF19JHtBMV9OVU1CRVJTW2lueV19YDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjU2NvcmVEaWZmVGV4dCA9IChcbiAgcm9vdEluZm8/OiBSb290SW5mbyB8IG51bGwsXG4gIGN1cnJJbmZvPzogTW92ZUluZm8gfCBSb290SW5mbyB8IG51bGwsXG4gIGZpeGVkID0gMSxcbiAgcmV2ZXJzZSA9IGZhbHNlXG4pID0+IHtcbiAgaWYgKCFyb290SW5mbyB8fCAhY3VyckluZm8pIHJldHVybiAnJztcbiAgbGV0IHNjb3JlID0gY2FsY1Njb3JlRGlmZihyb290SW5mbywgY3VyckluZm8pO1xuICBpZiAocmV2ZXJzZSkgc2NvcmUgPSAtc2NvcmU7XG4gIGNvbnN0IGZpeGVkU2NvcmUgPSBzY29yZS50b0ZpeGVkKGZpeGVkKTtcblxuICByZXR1cm4gc2NvcmUgPiAwID8gYCske2ZpeGVkU2NvcmV9YCA6IGAke2ZpeGVkU2NvcmV9YDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjV2lucmF0ZURpZmZUZXh0ID0gKFxuICByb290SW5mbz86IFJvb3RJbmZvIHwgbnVsbCxcbiAgY3VyckluZm8/OiBNb3ZlSW5mbyB8IFJvb3RJbmZvIHwgbnVsbCxcbiAgZml4ZWQgPSAxLFxuICByZXZlcnNlID0gZmFsc2VcbikgPT4ge1xuICBpZiAoIXJvb3RJbmZvIHx8ICFjdXJySW5mbykgcmV0dXJuICcnO1xuICBsZXQgd2lucmF0ZSA9IGNhbGNXaW5yYXRlRGlmZihyb290SW5mbywgY3VyckluZm8pO1xuICBpZiAocmV2ZXJzZSkgd2lucmF0ZSA9IC13aW5yYXRlO1xuICBjb25zdCBmaXhlZFdpbnJhdGUgPSB3aW5yYXRlLnRvRml4ZWQoZml4ZWQpO1xuXG4gIHJldHVybiB3aW5yYXRlID49IDAgPyBgKyR7Zml4ZWRXaW5yYXRlfSVgIDogYCR7Zml4ZWRXaW5yYXRlfSVgO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNTY29yZURpZmYgPSAoXG4gIHJvb3RJbmZvOiBSb290SW5mbyxcbiAgY3VyckluZm86IE1vdmVJbmZvIHwgUm9vdEluZm9cbikgPT4ge1xuICBjb25zdCBzaWduID0gcm9vdEluZm8uY3VycmVudFBsYXllciA9PT0gJ0InID8gMSA6IC0xO1xuICBjb25zdCBzY29yZSA9XG4gICAgTWF0aC5yb3VuZCgoY3VyckluZm8uc2NvcmVMZWFkIC0gcm9vdEluZm8uc2NvcmVMZWFkKSAqIHNpZ24gKiAxMDAwKSAvIDEwMDA7XG5cbiAgcmV0dXJuIHNjb3JlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNXaW5yYXRlRGlmZiA9IChcbiAgcm9vdEluZm86IFJvb3RJbmZvLFxuICBjdXJySW5mbzogTW92ZUluZm8gfCBSb290SW5mb1xuKSA9PiB7XG4gIGNvbnN0IHNpZ24gPSByb290SW5mby5jdXJyZW50UGxheWVyID09PSAnQicgPyAxIDogLTE7XG4gIGNvbnN0IHNjb3JlID1cbiAgICBNYXRoLnJvdW5kKChjdXJySW5mby53aW5yYXRlIC0gcm9vdEluZm8ud2lucmF0ZSkgKiBzaWduICogMTAwMCAqIDEwMCkgL1xuICAgIDEwMDA7XG5cbiAgcmV0dXJuIHNjb3JlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNBbmFseXNpc1BvaW50Q29sb3IgPSAoXG4gIHJvb3RJbmZvOiBSb290SW5mbyxcbiAgbW92ZUluZm86IE1vdmVJbmZvXG4pID0+IHtcbiAgY29uc3Qge3ByaW9yLCBvcmRlcn0gPSBtb3ZlSW5mbztcbiAgY29uc3Qgc2NvcmUgPSBjYWxjU2NvcmVEaWZmKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gIGxldCBwb2ludENvbG9yID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC41KSc7XG4gIGlmIChcbiAgICBwcmlvciA+PSAwLjUgfHxcbiAgICAocHJpb3IgPj0gMC4xICYmIG9yZGVyIDwgMyAmJiBzY29yZSA+IC0wLjMpIHx8XG4gICAgb3JkZXIgPT09IDAgfHxcbiAgICBzY29yZSA+PSAwXG4gICkge1xuICAgIHBvaW50Q29sb3IgPSBMSUdIVF9HUkVFTl9SR0I7XG4gIH0gZWxzZSBpZiAoKHByaW9yID4gMC4wNSAmJiBzY29yZSA+IC0wLjUpIHx8IChwcmlvciA+IDAuMDEgJiYgc2NvcmUgPiAtMC4xKSkge1xuICAgIHBvaW50Q29sb3IgPSBMSUdIVF9ZRUxMT1dfUkdCO1xuICB9IGVsc2UgaWYgKHByaW9yID4gMC4wMSAmJiBzY29yZSA+IC0xKSB7XG4gICAgcG9pbnRDb2xvciA9IFlFTExPV19SR0I7XG4gIH0gZWxzZSB7XG4gICAgcG9pbnRDb2xvciA9IExJR0hUX1JFRF9SR0I7XG4gIH1cbiAgcmV0dXJuIHBvaW50Q29sb3I7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgR29CYW5EZXRlY3Rpb24gPSAocGl4ZWxEYXRhLCBjYW52YXMpID0+IHtcbi8vIGNvbnN0IGNvbHVtbnMgPSBjYW52YXMud2lkdGg7XG4vLyBjb25zdCByb3dzID0gY2FudmFzLmhlaWdodDtcbi8vIGNvbnN0IGRhdGFUeXBlID0gSnNGZWF0LlU4QzFfdDtcbi8vIGNvbnN0IGRpc3RNYXRyaXhUID0gbmV3IEpzRmVhdC5tYXRyaXhfdChjb2x1bW5zLCByb3dzLCBkYXRhVHlwZSk7XG4vLyBKc0ZlYXQuaW1ncHJvYy5ncmF5c2NhbGUocGl4ZWxEYXRhLCBjb2x1bW5zLCByb3dzLCBkaXN0TWF0cml4VCk7XG4vLyBKc0ZlYXQuaW1ncHJvYy5nYXVzc2lhbl9ibHVyKGRpc3RNYXRyaXhULCBkaXN0TWF0cml4VCwgMiwgMCk7XG4vLyBKc0ZlYXQuaW1ncHJvYy5jYW5ueShkaXN0TWF0cml4VCwgZGlzdE1hdHJpeFQsIDUwLCA1MCk7XG5cbi8vIGNvbnN0IG5ld1BpeGVsRGF0YSA9IG5ldyBVaW50MzJBcnJheShwaXhlbERhdGEuYnVmZmVyKTtcbi8vIGNvbnN0IGFscGhhID0gKDB4ZmYgPDwgMjQpO1xuLy8gbGV0IGkgPSBkaXN0TWF0cml4VC5jb2xzICogZGlzdE1hdHJpeFQucm93cztcbi8vIGxldCBwaXggPSAwO1xuLy8gd2hpbGUgKGkgPj0gMCkge1xuLy8gICBwaXggPSBkaXN0TWF0cml4VC5kYXRhW2ldO1xuLy8gICBuZXdQaXhlbERhdGFbaV0gPSBhbHBoYSB8IChwaXggPDwgMTYpIHwgKHBpeCA8PCA4KSB8IHBpeDtcbi8vICAgaSAtPSAxO1xuLy8gfVxuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RQQUkgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgcGFpID0gbi5tb2RlbC5jdXN0b21Qcm9wcy5maW5kKChwOiBDdXN0b21Qcm9wKSA9PiBwLnRva2VuID09PSAnUEFJJyk7XG4gIGlmICghcGFpKSByZXR1cm47XG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHBhaS52YWx1ZSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEFuc3dlclR5cGUgPSAobjogVE5vZGUpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICBjb25zdCBwYXQgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQVQnKTtcbiAgcmV0dXJuIHBhdD8udmFsdWU7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFBJID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IHBpID0gbi5tb2RlbC5jdXN0b21Qcm9wcy5maW5kKChwOiBDdXN0b21Qcm9wKSA9PiBwLnRva2VuID09PSAnUEknKTtcbiAgaWYgKCFwaSkgcmV0dXJuO1xuICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShwaS52YWx1ZSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdE5vZGVEYXRhID0gKHNoYTogc3RyaW5nLCBudW1iZXI/OiBudW1iZXIpOiBTZ2ZOb2RlID0+IHtcbiAgcmV0dXJuIHtcbiAgICBpZDogc2hhLFxuICAgIG5hbWU6IHNoYSxcbiAgICBudW1iZXI6IG51bWJlciB8fCAwLFxuICAgIHJvb3RQcm9wczogW10sXG4gICAgbW92ZVByb3BzOiBbXSxcbiAgICBzZXR1cFByb3BzOiBbXSxcbiAgICBtYXJrdXBQcm9wczogW10sXG4gICAgZ2FtZUluZm9Qcm9wczogW10sXG4gICAgbm9kZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgbW92ZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgY3VzdG9tUHJvcHM6IFtdLFxuICB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBpbml0aWFsIHJvb3Qgbm9kZSBvZiB0aGUgdHJlZS5cbiAqXG4gKiBAcGFyYW0gcm9vdFByb3BzIC0gVGhlIHJvb3QgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIFRoZSBpbml0aWFsIHJvb3Qgbm9kZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGluaXRpYWxSb290Tm9kZSA9IChcbiAgcm9vdFByb3BzID0gW1xuICAgICdGRls0XScsXG4gICAgJ0dNWzFdJyxcbiAgICAnQ0FbVVRGLThdJyxcbiAgICAnQVBbZ2hvc3RnbzowLjEuMF0nLFxuICAgICdTWlsxOV0nLFxuICAgICdTVFswXScsXG4gIF1cbikgPT4ge1xuICBjb25zdCB0cmVlID0gbmV3IFRyZWVNb2RlbCgpO1xuICBjb25zdCByb290ID0gdHJlZS5wYXJzZSh7XG4gICAgLy8gJzFiMTZiMScgaXMgdGhlIFNIQTI1NiBoYXNoIG9mIHRoZSAnbidcbiAgICBpZDogJycsXG4gICAgbmFtZTogJycsXG4gICAgaW5kZXg6IDAsXG4gICAgbnVtYmVyOiAwLFxuICAgIHJvb3RQcm9wczogcm9vdFByb3BzLm1hcChwID0+IFJvb3RQcm9wLmZyb20ocCkpLFxuICAgIG1vdmVQcm9wczogW10sXG4gICAgc2V0dXBQcm9wczogW10sXG4gICAgbWFya3VwUHJvcHM6IFtdLFxuICAgIGdhbWVJbmZvUHJvcHM6IFtdLFxuICAgIG5vZGVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIG1vdmVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIGN1c3RvbVByb3BzOiBbXSxcbiAgfSk7XG4gIGNvbnN0IGhhc2ggPSBjYWxjSGFzaChyb290KTtcbiAgcm9vdC5tb2RlbC5pZCA9IGhhc2g7XG5cbiAgcmV0dXJuIHJvb3Q7XG59O1xuXG4vKipcbiAqIEJ1aWxkcyBhIG5ldyB0cmVlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gbW92ZSwgcGFyZW50IG5vZGUsIGFuZCBhZGRpdGlvbmFsIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIG1vdmUgLSBUaGUgbW92ZSB0byBiZSBhZGRlZCB0byB0aGUgbm9kZS5cbiAqIEBwYXJhbSBwYXJlbnROb2RlIC0gVGhlIHBhcmVudCBub2RlIG9mIHRoZSBuZXcgbm9kZS4gT3B0aW9uYWwuXG4gKiBAcGFyYW0gcHJvcHMgLSBBZGRpdGlvbmFsIHByb3BlcnRpZXMgdG8gYmUgYWRkZWQgdG8gdGhlIG5ldyBub2RlLiBPcHRpb25hbC5cbiAqIEByZXR1cm5zIFRoZSBuZXdseSBjcmVhdGVkIHRyZWUgbm9kZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkTW92ZU5vZGUgPSAoXG4gIG1vdmU6IHN0cmluZyxcbiAgcGFyZW50Tm9kZT86IFROb2RlLFxuICBwcm9wcz86IFNnZk5vZGVPcHRpb25zXG4pID0+IHtcbiAgY29uc3QgdHJlZSA9IG5ldyBUcmVlTW9kZWwoKTtcbiAgY29uc3QgbW92ZVByb3AgPSBNb3ZlUHJvcC5mcm9tKG1vdmUpO1xuICBjb25zdCBoYXNoID0gY2FsY0hhc2gocGFyZW50Tm9kZSwgW21vdmVQcm9wXSk7XG4gIGxldCBudW1iZXIgPSAxO1xuICBpZiAocGFyZW50Tm9kZSkgbnVtYmVyID0gZ2V0Tm9kZU51bWJlcihwYXJlbnROb2RlKSArIDE7XG4gIGNvbnN0IG5vZGVEYXRhID0gaW5pdE5vZGVEYXRhKGhhc2gsIG51bWJlcik7XG4gIG5vZGVEYXRhLm1vdmVQcm9wcyA9IFttb3ZlUHJvcF07XG5cbiAgY29uc3Qgbm9kZSA9IHRyZWUucGFyc2Uoe1xuICAgIC4uLm5vZGVEYXRhLFxuICAgIC4uLnByb3BzLFxuICB9KTtcbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TGFzdEluZGV4ID0gKHJvb3Q6IFROb2RlKSA9PiB7XG4gIGxldCBsYXN0Tm9kZSA9IHJvb3Q7XG4gIHJvb3Qud2Fsayhub2RlID0+IHtcbiAgICAvLyBIYWx0IHRoZSB0cmF2ZXJzYWwgYnkgcmV0dXJuaW5nIGZhbHNlXG4gICAgbGFzdE5vZGUgPSBub2RlO1xuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbiAgcmV0dXJuIGxhc3ROb2RlLm1vZGVsLmluZGV4O1xufTtcblxuZXhwb3J0IGNvbnN0IGN1dE1vdmVOb2RlcyA9IChyb290OiBUTm9kZSwgcmV0dXJuUm9vdD86IGJvb2xlYW4pID0+IHtcbiAgbGV0IG5vZGUgPSBjbG9uZURlZXAocm9vdCk7XG4gIHdoaWxlIChub2RlICYmIG5vZGUuaGFzQ2hpbGRyZW4oKSAmJiBub2RlLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICBub2RlLmNoaWxkcmVuID0gW107XG4gIH1cblxuICBpZiAocmV0dXJuUm9vdCkge1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUucGFyZW50ICYmICFub2RlLmlzUm9vdCgpKSB7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Um9vdCA9IChub2RlOiBUTm9kZSkgPT4ge1xuICBsZXQgcm9vdCA9IG5vZGU7XG4gIHdoaWxlIChyb290ICYmIHJvb3QucGFyZW50ICYmICFyb290LmlzUm9vdCgpKSB7XG4gICAgcm9vdCA9IHJvb3QucGFyZW50O1xuICB9XG4gIHJldHVybiByb290O1xufTtcblxuZXhwb3J0IGNvbnN0IHplcm9zID0gKHNpemU6IFtudW1iZXIsIG51bWJlcl0pOiBudW1iZXJbXVtdID0+XG4gIG5ldyBBcnJheShzaXplWzBdKS5maWxsKDApLm1hcCgoKSA9PiBuZXcgQXJyYXkoc2l6ZVsxXSkuZmlsbCgwKSk7XG5cbmV4cG9ydCBjb25zdCBlbXB0eSA9IChzaXplOiBbbnVtYmVyLCBudW1iZXJdKTogc3RyaW5nW11bXSA9PlxuICBuZXcgQXJyYXkoc2l6ZVswXSkuZmlsbCgnJykubWFwKCgpID0+IG5ldyBBcnJheShzaXplWzFdKS5maWxsKCcnKSk7XG5cbmV4cG9ydCBjb25zdCBjYWxjTW9zdCA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGxldCBsZWZ0TW9zdDogbnVtYmVyID0gYm9hcmRTaXplIC0gMTtcbiAgbGV0IHJpZ2h0TW9zdCA9IDA7XG4gIGxldCB0b3BNb3N0OiBudW1iZXIgPSBib2FyZFNpemUgLSAxO1xuICBsZXQgYm90dG9tTW9zdCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGlmIChsZWZ0TW9zdCA+IGkpIGxlZnRNb3N0ID0gaTtcbiAgICAgICAgaWYgKHJpZ2h0TW9zdCA8IGkpIHJpZ2h0TW9zdCA9IGk7XG4gICAgICAgIGlmICh0b3BNb3N0ID4gaikgdG9wTW9zdCA9IGo7XG4gICAgICAgIGlmIChib3R0b21Nb3N0IDwgaikgYm90dG9tTW9zdCA9IGo7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH07XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0NlbnRlciA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGNvbnN0IHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fSA9IGNhbGNNb3N0KG1hdCwgYm9hcmRTaXplKTtcbiAgY29uc3QgdG9wID0gdG9wTW9zdCA8IGJvYXJkU2l6ZSAtIDEgLSBib3R0b21Nb3N0O1xuICBjb25zdCBsZWZ0ID0gbGVmdE1vc3QgPCBib2FyZFNpemUgLSAxIC0gcmlnaHRNb3N0O1xuICBpZiAodG9wICYmIGxlZnQpIHJldHVybiBDZW50ZXIuVG9wTGVmdDtcbiAgaWYgKCF0b3AgJiYgbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21MZWZ0O1xuICBpZiAodG9wICYmICFsZWZ0KSByZXR1cm4gQ2VudGVyLlRvcFJpZ2h0O1xuICBpZiAoIXRvcCAmJiAhbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21SaWdodDtcbiAgcmV0dXJuIENlbnRlci5DZW50ZXI7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0JvYXJkU2l6ZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBib2FyZFNpemUgPSAxOSxcbiAgZXh0ZW50ID0gMlxuKTogbnVtYmVyW10gPT4ge1xuICBjb25zdCByZXN1bHQgPSBbMTksIDE5XTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQsIGJvYXJkU2l6ZSk7XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0KSB7XG4gICAgcmVzdWx0WzBdID0gcmlnaHRNb3N0ICsgZXh0ZW50ICsgMTtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW50ICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVudDtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW50ICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCkge1xuICAgIHJlc3VsdFswXSA9IHJpZ2h0TW9zdCArIGV4dGVudCArIDE7XG4gICAgcmVzdWx0WzFdID0gYm9hcmRTaXplIC0gdG9wTW9zdCArIGV4dGVudDtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVudDtcbiAgICByZXN1bHRbMV0gPSBib2FyZFNpemUgLSB0b3BNb3N0ICsgZXh0ZW50O1xuICB9XG4gIHJlc3VsdFswXSA9IE1hdGgubWluKHJlc3VsdFswXSwgYm9hcmRTaXplKTtcbiAgcmVzdWx0WzFdID0gTWF0aC5taW4ocmVzdWx0WzFdLCBib2FyZFNpemUpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1BhcnRpYWxBcmVhID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGV4dGVudCA9IDIsXG4gIGJvYXJkU2l6ZSA9IDE5XG4pOiBbW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXV0gPT4ge1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQpO1xuXG4gIGNvbnN0IHNpemUgPSBib2FyZFNpemUgLSAxO1xuICBjb25zdCB4MSA9IGxlZnRNb3N0IC0gZXh0ZW50IDwgMCA/IDAgOiBsZWZ0TW9zdCAtIGV4dGVudDtcbiAgY29uc3QgeTEgPSB0b3BNb3N0IC0gZXh0ZW50IDwgMCA/IDAgOiB0b3BNb3N0IC0gZXh0ZW50O1xuICBjb25zdCB4MiA9IHJpZ2h0TW9zdCArIGV4dGVudCA+IHNpemUgPyBzaXplIDogcmlnaHRNb3N0ICsgZXh0ZW50O1xuICBjb25zdCB5MiA9IGJvdHRvbU1vc3QgKyBleHRlbnQgPiBzaXplID8gc2l6ZSA6IGJvdHRvbU1vc3QgKyBleHRlbnQ7XG5cbiAgcmV0dXJuIFtcbiAgICBbeDEsIHkxXSxcbiAgICBbeDIsIHkyXSxcbiAgXTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQXZvaWRNb3Zlc0ZvclBhcnRpYWxBbmFseXNpcyA9IChcbiAgcGFydGlhbEFyZWE6IFtbbnVtYmVyLCBudW1iZXJdLCBbbnVtYmVyLCBudW1iZXJdXSxcbiAgYm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3QgW1t4MSwgeTFdLCBbeDIsIHkyXV0gPSBwYXJ0aWFsQXJlYTtcblxuICBmb3IgKGNvbnN0IGNvbCBvZiBBMV9MRVRURVJTLnNsaWNlKDAsIGJvYXJkU2l6ZSkpIHtcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiBBMV9OVU1CRVJTLnNsaWNlKC1ib2FyZFNpemUpKSB7XG4gICAgICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKGNvbCk7XG4gICAgICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHJvdyk7XG5cbiAgICAgIGlmICh4IDwgeDEgfHwgeCA+IHgyIHx8IHkgPCB5MSB8fCB5ID4geTIpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYCR7Y29sfSR7cm93fWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1RzdW1lZ29GcmFtZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBleHRlbnQ6IG51bWJlcixcbiAgYm9hcmRTaXplID0gMTksXG4gIGtvbWkgPSA3LjUsXG4gIHR1cm46IEtpID0gS2kuQmxhY2ssXG4gIGtvID0gZmFsc2Vcbik6IG51bWJlcltdW10gPT4ge1xuICBjb25zdCByZXN1bHQgPSBjbG9uZURlZXAobWF0KTtcbiAgY29uc3QgcGFydGlhbEFyZWEgPSBjYWxjUGFydGlhbEFyZWEobWF0LCBleHRlbnQsIGJvYXJkU2l6ZSk7XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcbiAgY29uc3QgcHV0Qm9yZGVyID0gKG1hdDogbnVtYmVyW11bXSkgPT4ge1xuICAgIGNvbnN0IFt4MSwgeTFdID0gcGFydGlhbEFyZWFbMF07XG4gICAgY29uc3QgW3gyLCB5Ml0gPSBwYXJ0aWFsQXJlYVsxXTtcbiAgICBmb3IgKGxldCBpID0geDE7IGkgPD0geDI7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IHkxOyBqIDw9IHkyOyBqKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAoKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCAmJlxuICAgICAgICAgICgoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAoKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCAmJlxuICAgICAgICAgICgoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApIHx8XG4gICAgICAgICAgICAoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGNlbnRlciA9PT0gQ2VudGVyLkNlbnRlcikge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHB1dE91dHNpZGUgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gICAgY29uc3Qgb2ZmZW5jZVRvV2luID0gMTA7XG4gICAgY29uc3Qgb2ZmZW5zZUtvbWkgPSB0dXJuICoga29taTtcbiAgICBjb25zdCBbeDEsIHkxXSA9IHBhcnRpYWxBcmVhWzBdO1xuICAgIGNvbnN0IFt4MiwgeTJdID0gcGFydGlhbEFyZWFbMV07XG4gICAgLy8gVE9ETzogSGFyZCBjb2RlIGZvciBub3dcbiAgICAvLyBjb25zdCBibGFja1RvQXR0YWNrID0gdHVybiA9PT0gS2kuQmxhY2s7XG4gICAgY29uc3QgYmxhY2tUb0F0dGFjayA9IHR1cm4gPT09IEtpLkJsYWNrO1xuICAgIGNvbnN0IGlzaXplID0geDIgLSB4MTtcbiAgICBjb25zdCBqc2l6ZSA9IHkyIC0geTE7XG4gICAgLy8gVE9ETzogMzYxIGlzIGhhcmRjb2RlZFxuICAgIC8vIGNvbnN0IGRlZmVuc2VBcmVhID0gTWF0aC5mbG9vcihcbiAgICAvLyAgICgzNjEgLSBpc2l6ZSAqIGpzaXplIC0gb2ZmZW5zZUtvbWkgLSBvZmZlbmNlVG9XaW4pIC8gMlxuICAgIC8vICk7XG4gICAgY29uc3QgZGVmZW5zZUFyZWEgPVxuICAgICAgTWF0aC5mbG9vcigoMzYxIC0gaXNpemUgKiBqc2l6ZSkgLyAyKSAtIG9mZmVuc2VLb21pIC0gb2ZmZW5jZVRvV2luO1xuXG4gICAgLy8gY29uc3QgZGVmZW5zZUFyZWEgPSAzMDtcblxuICAgIC8vIG91dHNpZGUgdGhlIGZyYW1lXG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkU2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkU2l6ZTsgaisrKSB7XG4gICAgICAgIGlmIChpIDwgeDEgfHwgaSA+IHgyIHx8IGogPCB5MSB8fCBqID4geTIpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIGxldCBraSA9IEtpLkVtcHR5O1xuICAgICAgICAgIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0IHx8IGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQpIHtcbiAgICAgICAgICAgIGtpID0gYmxhY2tUb0F0dGFjayAhPT0gY291bnQgPD0gZGVmZW5zZUFyZWEgPyBLaS5XaGl0ZSA6IEtpLkJsYWNrO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGtpID0gYmxhY2tUb0F0dGFjayAhPT0gY291bnQgPD0gZGVmZW5zZUFyZWEgPyBLaS5CbGFjayA6IEtpLldoaXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKGkgKyBqKSAlIDIgPT09IDAgJiYgTWF0aC5hYnMoY291bnQgLSBkZWZlbnNlQXJlYSkgPiBib2FyZFNpemUpIHtcbiAgICAgICAgICAgIGtpID0gS2kuRW1wdHk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWF0W2ldW2pdID0ga2k7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8vIFRPRE86XG4gIGNvbnN0IHB1dEtvVGhyZWF0ID0gKG1hdDogbnVtYmVyW11bXSwga286IGJvb2xlYW4pID0+IHt9O1xuXG4gIHB1dEJvcmRlcihyZXN1bHQpO1xuICBwdXRPdXRzaWRlKHJlc3VsdCk7XG5cbiAgLy8gY29uc3QgZmxpcFNwZWMgPVxuICAvLyAgIGltaW4gPCBqbWluXG4gIC8vICAgICA/IFtmYWxzZSwgZmFsc2UsIHRydWVdXG4gIC8vICAgICA6IFtuZWVkRmxpcChpbWluLCBpbWF4LCBpc2l6ZSksIG5lZWRGbGlwKGptaW4sIGptYXgsIGpzaXplKSwgZmFsc2VdO1xuXG4gIC8vIGlmIChmbGlwU3BlYy5pbmNsdWRlcyh0cnVlKSkge1xuICAvLyAgIGNvbnN0IGZsaXBwZWQgPSBmbGlwU3RvbmVzKHN0b25lcywgZmxpcFNwZWMpO1xuICAvLyAgIGNvbnN0IGZpbGxlZCA9IHRzdW1lZ29GcmFtZVN0b25lcyhmbGlwcGVkLCBrb21pLCBibGFja1RvUGxheSwga28sIG1hcmdpbik7XG4gIC8vICAgcmV0dXJuIGZsaXBTdG9uZXMoZmlsbGVkLCBmbGlwU3BlYyk7XG4gIC8vIH1cblxuICAvLyBjb25zdCBpMCA9IGltaW4gLSBtYXJnaW47XG4gIC8vIGNvbnN0IGkxID0gaW1heCArIG1hcmdpbjtcbiAgLy8gY29uc3QgajAgPSBqbWluIC0gbWFyZ2luO1xuICAvLyBjb25zdCBqMSA9IGptYXggKyBtYXJnaW47XG4gIC8vIGNvbnN0IGZyYW1lUmFuZ2U6IFJlZ2lvbiA9IFtpMCwgaTEsIGowLCBqMV07XG4gIC8vIGNvbnN0IGJsYWNrVG9BdHRhY2sgPSBndWVzc0JsYWNrVG9BdHRhY2soXG4gIC8vICAgW3RvcCwgYm90dG9tLCBsZWZ0LCByaWdodF0sXG4gIC8vICAgW2lzaXplLCBqc2l6ZV1cbiAgLy8gKTtcblxuICAvLyBwdXRCb3JkZXIobWF0LCBbaXNpemUsIGpzaXplXSwgZnJhbWVSYW5nZSwgYmxhY2tUb0F0dGFjayk7XG4gIC8vIHB1dE91dHNpZGUoXG4gIC8vICAgc3RvbmVzLFxuICAvLyAgIFtpc2l6ZSwganNpemVdLFxuICAvLyAgIGZyYW1lUmFuZ2UsXG4gIC8vICAgYmxhY2tUb0F0dGFjayxcbiAgLy8gICBibGFja1RvUGxheSxcbiAgLy8gICBrb21pXG4gIC8vICk7XG4gIC8vIHB1dEtvVGhyZWF0KFxuICAvLyAgIHN0b25lcyxcbiAgLy8gICBbaXNpemUsIGpzaXplXSxcbiAgLy8gICBmcmFtZVJhbmdlLFxuICAvLyAgIGJsYWNrVG9BdHRhY2ssXG4gIC8vICAgYmxhY2tUb1BsYXksXG4gIC8vICAga29cbiAgLy8gKTtcbiAgLy8gcmV0dXJuIHN0b25lcztcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNPZmZzZXQgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gIGNvbnN0IGJvYXJkU2l6ZSA9IGNhbGNCb2FyZFNpemUobWF0KTtcbiAgY29uc3Qgb3ggPSAxOSAtIGJvYXJkU2l6ZVswXTtcbiAgY29uc3Qgb3kgPSAxOSAtIGJvYXJkU2l6ZVsxXTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuXG4gIGxldCBvb3ggPSBveDtcbiAgbGV0IG9veSA9IG95O1xuICBzd2l0Y2ggKGNlbnRlcikge1xuICAgIGNhc2UgQ2VudGVyLlRvcExlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSBveTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Ub3BSaWdodDoge1xuICAgICAgb294ID0gLW94O1xuICAgICAgb295ID0gb3k7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tTGVmdDoge1xuICAgICAgb294ID0gMDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tUmlnaHQ6IHtcbiAgICAgIG9veCA9IC1veDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt4OiBvb3gsIHk6IG9veX07XG59O1xuXG5leHBvcnQgY29uc3QgcmV2ZXJzZU9mZnNldCA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBieCA9IDE5LFxuICBieSA9IDE5LFxuICBib2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGNvbnN0IG94ID0gYm9hcmRTaXplIC0gYng7XG4gIGNvbnN0IG95ID0gYm9hcmRTaXplIC0gYnk7XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcblxuICBsZXQgb294ID0gb3g7XG4gIGxldCBvb3kgPSBveTtcbiAgc3dpdGNoIChjZW50ZXIpIHtcbiAgICBjYXNlIENlbnRlci5Ub3BMZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gLW95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLlRvcFJpZ2h0OiB7XG4gICAgICBvb3ggPSBveDtcbiAgICAgIG9veSA9IC1veTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21MZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21SaWdodDoge1xuICAgICAgb294ID0gb3g7XG4gICAgICBvb3kgPSAwO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB7eDogb294LCB5OiBvb3l9O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNWaXNpYmxlQXJlYShcbiAgbWF0OiBudW1iZXJbXVtdID0gemVyb3MoWzE5LCAxOV0pLFxuICBleHRlbnQ6IG51bWJlcixcbiAgYWxsb3dSZWN0YW5nbGUgPSBmYWxzZVxuKTogbnVtYmVyW11bXSB7XG4gIGxldCBtaW5Sb3cgPSBtYXQubGVuZ3RoO1xuICBsZXQgbWF4Um93ID0gMDtcbiAgbGV0IG1pbkNvbCA9IG1hdFswXS5sZW5ndGg7XG4gIGxldCBtYXhDb2wgPSAwO1xuXG4gIGxldCBlbXB0eSA9IHRydWU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFswXS5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKG1hdFtpXVtqXSAhPT0gMCkge1xuICAgICAgICBlbXB0eSA9IGZhbHNlO1xuICAgICAgICBtaW5Sb3cgPSBNYXRoLm1pbihtaW5Sb3csIGkpO1xuICAgICAgICBtYXhSb3cgPSBNYXRoLm1heChtYXhSb3csIGkpO1xuICAgICAgICBtaW5Db2wgPSBNYXRoLm1pbihtaW5Db2wsIGopO1xuICAgICAgICBtYXhDb2wgPSBNYXRoLm1heChtYXhDb2wsIGopO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChlbXB0eSkge1xuICAgIHJldHVybiBbXG4gICAgICBbMCwgbWF0Lmxlbmd0aCAtIDFdLFxuICAgICAgWzAsIG1hdFswXS5sZW5ndGggLSAxXSxcbiAgICBdO1xuICB9XG5cbiAgaWYgKCFhbGxvd1JlY3RhbmdsZSkge1xuICAgIGNvbnN0IG1pblJvd1dpdGhFeHRlbnQgPSBNYXRoLm1heChtaW5Sb3cgLSBleHRlbnQsIDApO1xuICAgIGNvbnN0IG1heFJvd1dpdGhFeHRlbnQgPSBNYXRoLm1pbihtYXhSb3cgKyBleHRlbnQsIG1hdC5sZW5ndGggLSAxKTtcbiAgICBjb25zdCBtaW5Db2xXaXRoRXh0ZW50ID0gTWF0aC5tYXgobWluQ29sIC0gZXh0ZW50LCAwKTtcbiAgICBjb25zdCBtYXhDb2xXaXRoRXh0ZW50ID0gTWF0aC5taW4obWF4Q29sICsgZXh0ZW50LCBtYXRbMF0ubGVuZ3RoIC0gMSk7XG5cbiAgICBjb25zdCBtYXhSYW5nZSA9IE1hdGgubWF4KFxuICAgICAgbWF4Um93V2l0aEV4dGVudCAtIG1pblJvd1dpdGhFeHRlbnQsXG4gICAgICBtYXhDb2xXaXRoRXh0ZW50IC0gbWluQ29sV2l0aEV4dGVudFxuICAgICk7XG5cbiAgICBtaW5Sb3cgPSBtaW5Sb3dXaXRoRXh0ZW50O1xuICAgIG1heFJvdyA9IG1pblJvdyArIG1heFJhbmdlO1xuXG4gICAgaWYgKG1heFJvdyA+PSBtYXQubGVuZ3RoKSB7XG4gICAgICBtYXhSb3cgPSBtYXQubGVuZ3RoIC0gMTtcbiAgICAgIG1pblJvdyA9IG1heFJvdyAtIG1heFJhbmdlO1xuICAgIH1cblxuICAgIG1pbkNvbCA9IG1pbkNvbFdpdGhFeHRlbnQ7XG4gICAgbWF4Q29sID0gbWluQ29sICsgbWF4UmFuZ2U7XG4gICAgaWYgKG1heENvbCA+PSBtYXRbMF0ubGVuZ3RoKSB7XG4gICAgICBtYXhDb2wgPSBtYXRbMF0ubGVuZ3RoIC0gMTtcbiAgICAgIG1pbkNvbCA9IG1heENvbCAtIG1heFJhbmdlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBtaW5Sb3cgPSBNYXRoLm1heCgwLCBtaW5Sb3cgLSBleHRlbnQpO1xuICAgIG1heFJvdyA9IE1hdGgubWluKG1hdC5sZW5ndGggLSAxLCBtYXhSb3cgKyBleHRlbnQpO1xuICAgIG1pbkNvbCA9IE1hdGgubWF4KDAsIG1pbkNvbCAtIGV4dGVudCk7XG4gICAgbWF4Q29sID0gTWF0aC5taW4obWF0WzBdLmxlbmd0aCAtIDEsIG1heENvbCArIGV4dGVudCk7XG4gIH1cblxuICByZXR1cm4gW1xuICAgIFttaW5Sb3csIG1heFJvd10sXG4gICAgW21pbkNvbCwgbWF4Q29sXSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmUobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikge1xuICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybiBtYXQ7XG4gIGNvbnN0IG5ld01hdCA9IGNsb25lRGVlcChtYXQpO1xuICBuZXdNYXRbaV1bal0gPSBraTtcbiAgcmV0dXJuIGV4ZWNDYXB0dXJlKG5ld01hdCwgaSwgaiwgLWtpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dLaShtYXQ6IG51bWJlcltdW10sIHN0ZXBzOiBzdHJpbmdbXSwgaXNDYXB0dXJlZCA9IHRydWUpIHtcbiAgbGV0IG5ld01hdCA9IGNsb25lRGVlcChtYXQpO1xuICBsZXQgaGFzTW92ZWQgPSBmYWxzZTtcbiAgc3RlcHMuZm9yRWFjaChzdHIgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAga2ksXG4gICAgfToge1xuICAgICAgeDogbnVtYmVyO1xuICAgICAgeTogbnVtYmVyO1xuICAgICAga2k6IG51bWJlcjtcbiAgICB9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgICBpZiAoaXNDYXB0dXJlZCkge1xuICAgICAgaWYgKGNhbk1vdmUobmV3TWF0LCB4LCB5LCBraSkpIHtcbiAgICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICAgIG5ld01hdCA9IGV4ZWNDYXB0dXJlKG5ld01hdCwgeCwgeSwgLWtpKTtcbiAgICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJyYW5nZW1lbnQ6IG5ld01hdCxcbiAgICBoYXNNb3ZlZCxcbiAgfTtcbn1cblxuLy8gVE9ETzpcbmV4cG9ydCBjb25zdCBoYW5kbGVNb3ZlID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICB0dXJuOiBLaSxcbiAgY3VycmVudE5vZGU6IFROb2RlLFxuICBvbkFmdGVyTW92ZTogKG5vZGU6IFROb2RlLCBpc01vdmVkOiBib29sZWFuKSA9PiB2b2lkXG4pID0+IHtcbiAgaWYgKHR1cm4gPT09IEtpLkVtcHR5KSByZXR1cm47XG4gIGlmIChjYW5Nb3ZlKG1hdCwgaSwgaiwgdHVybikpIHtcbiAgICAvLyBkaXNwYXRjaCh1aVNsaWNlLmFjdGlvbnMuc2V0VHVybigtdHVybikpO1xuICAgIGNvbnN0IHZhbHVlID0gU0dGX0xFVFRFUlNbaV0gKyBTR0ZfTEVUVEVSU1tqXTtcbiAgICBjb25zdCB0b2tlbiA9IHR1cm4gPT09IEtpLkJsYWNrID8gJ0InIDogJ1cnO1xuICAgIGNvbnN0IGhhc2ggPSBjYWxjSGFzaChjdXJyZW50Tm9kZSwgW01vdmVQcm9wLmZyb20oYCR7dG9rZW59WyR7dmFsdWV9XWApXSk7XG4gICAgY29uc3QgZmlsdGVyZWQgPSBjdXJyZW50Tm9kZS5jaGlsZHJlbi5maWx0ZXIoXG4gICAgICAobjogVE5vZGUpID0+IG4ubW9kZWwuaWQgPT09IGhhc2hcbiAgICApO1xuICAgIGxldCBub2RlOiBUTm9kZTtcbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgbm9kZSA9IGZpbHRlcmVkWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gYnVpbGRNb3ZlTm9kZShgJHt0b2tlbn1bJHt2YWx1ZX1dYCwgY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGlmIChvbkFmdGVyTW92ZSkgb25BZnRlck1vdmUobm9kZSwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9uQWZ0ZXJNb3ZlKSBvbkFmdGVyTW92ZShjdXJyZW50Tm9kZSwgZmFsc2UpO1xuICB9XG59O1xuXG4vKipcbiAqIENsZWFyIHN0b25lIGZyb20gdGhlIGN1cnJlbnROb2RlXG4gKiBAcGFyYW0gY3VycmVudE5vZGVcbiAqIEBwYXJhbSB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgY2xlYXJTdG9uZUZyb21DdXJyZW50Tm9kZSA9IChcbiAgY3VycmVudE5vZGU6IFROb2RlLFxuICB2YWx1ZTogc3RyaW5nXG4pID0+IHtcbiAgY29uc3QgcGF0aCA9IGN1cnJlbnROb2RlLmdldFBhdGgoKTtcbiAgcGF0aC5mb3JFYWNoKG5vZGUgPT4ge1xuICAgIGNvbnN0IHtzZXR1cFByb3BzfSA9IG5vZGUubW9kZWw7XG4gICAgaWYgKHNldHVwUHJvcHMuZmlsdGVyKChzOiBTZXR1cFByb3ApID0+IHMudmFsdWUgPT09IHZhbHVlKS5sZW5ndGggPiAwKSB7XG4gICAgICBub2RlLm1vZGVsLnNldHVwUHJvcHMgPSBzZXR1cFByb3BzLmZpbHRlcigoczogYW55KSA9PiBzLnZhbHVlICE9PSB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldHVwUHJvcHMuZm9yRWFjaCgoczogU2V0dXBQcm9wKSA9PiB7XG4gICAgICAgIHMudmFsdWVzID0gcy52YWx1ZXMuZmlsdGVyKHYgPT4gdiAhPT0gdmFsdWUpO1xuICAgICAgICBpZiAocy52YWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgbm9kZS5tb2RlbC5zZXR1cFByb3BzID0gbm9kZS5tb2RlbC5zZXR1cFByb3BzLmZpbHRlcihcbiAgICAgICAgICAgIChwOiBTZXR1cFByb3ApID0+IHAudG9rZW4gIT09IHMudG9rZW5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBBZGRzIGEgc3RvbmUgdG8gdGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqXG4gKiBAcGFyYW0gY3VycmVudE5vZGUgVGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIEBwYXJhbSBtYXQgVGhlIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIGJvYXJkLlxuICogQHBhcmFtIGkgVGhlIHJvdyBpbmRleCBvZiB0aGUgc3RvbmUuXG4gKiBAcGFyYW0gaiBUaGUgY29sdW1uIGluZGV4IG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSBraSBUaGUgY29sb3Igb2YgdGhlIHN0b25lIChLaS5XaGl0ZSBvciBLaS5CbGFjaykuXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBzdG9uZSB3YXMgcmVtb3ZlZCBmcm9tIHByZXZpb3VzIG5vZGVzLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRTdG9uZVRvQ3VycmVudE5vZGUgPSAoXG4gIGN1cnJlbnROb2RlOiBUTm9kZSxcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBpOiBudW1iZXIsXG4gIGo6IG51bWJlcixcbiAga2k6IEtpXG4pID0+IHtcbiAgY29uc3QgdmFsdWUgPSBTR0ZfTEVUVEVSU1tpXSArIFNHRl9MRVRURVJTW2pdO1xuICBjb25zdCB0b2tlbiA9IGtpID09PSBLaS5XaGl0ZSA/ICdBVycgOiAnQUInO1xuICBjb25zdCBwcm9wID0gZmluZFByb3AoY3VycmVudE5vZGUsIHRva2VuKTtcbiAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICBpZiAobWF0W2ldW2pdICE9PSBLaS5FbXB0eSkge1xuICAgIGNsZWFyU3RvbmVGcm9tQ3VycmVudE5vZGUoY3VycmVudE5vZGUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvcCkge1xuICAgICAgcHJvcC52YWx1ZXMgPSBbLi4ucHJvcC52YWx1ZXMsIHZhbHVlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE5vZGUubW9kZWwuc2V0dXBQcm9wcyA9IFtcbiAgICAgICAgLi4uY3VycmVudE5vZGUubW9kZWwuc2V0dXBQcm9wcyxcbiAgICAgICAgbmV3IFNldHVwUHJvcCh0b2tlbiwgdmFsdWUpLFxuICAgICAgXTtcbiAgICB9XG4gICAgcmVzdWx0ID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBBZGRzIGEgbW92ZSB0byB0aGUgZ2l2ZW4gbWF0cml4IGFuZCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBJZiB0aGUga2kgaXMgZW1wdHksIG5vIG1vdmUgaXMgYWRkZWQgYW5kIG51bGwgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIG1hdCAtIFRoZSBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSBnYW1lIGJvYXJkLlxuICogQHBhcmFtIGN1cnJlbnROb2RlIC0gVGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIEBwYXJhbSBpIC0gVGhlIHJvdyBpbmRleCBvZiB0aGUgbW92ZS5cbiAqIEBwYXJhbSBqIC0gVGhlIGNvbHVtbiBpbmRleCBvZiB0aGUgbW92ZS5cbiAqIEBwYXJhbSBraSAtIFRoZSB0eXBlIG9mIG1vdmUgKEtpKS5cbiAqIEByZXR1cm5zIFRoZSBjb3JyZXNwb25kaW5nIG5vZGUgaW4gdGhlIHRyZWUsIG9yIG51bGwgaWYgbm8gbW92ZSBpcyBhZGRlZC5cbiAqL1xuLy8gVE9ETzogVGhlIHBhcmFtcyBoZXJlIGlzIHdlaXJkXG5leHBvcnQgY29uc3QgYWRkTW92ZVRvQ3VycmVudE5vZGUgPSAoXG4gIGN1cnJlbnROb2RlOiBUTm9kZSxcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBpOiBudW1iZXIsXG4gIGo6IG51bWJlcixcbiAga2k6IEtpXG4pID0+IHtcbiAgaWYgKGtpID09PSBLaS5FbXB0eSkgcmV0dXJuO1xuICBsZXQgbm9kZTtcbiAgaWYgKGNhbk1vdmUobWF0LCBpLCBqLCBraSkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IFNHRl9MRVRURVJTW2ldICsgU0dGX0xFVFRFUlNbal07XG4gICAgY29uc3QgdG9rZW4gPSBraSA9PT0gS2kuQmxhY2sgPyAnQicgOiAnVyc7XG4gICAgY29uc3QgaGFzaCA9IGNhbGNIYXNoKGN1cnJlbnROb2RlLCBbTW92ZVByb3AuZnJvbShgJHt0b2tlbn1bJHt2YWx1ZX1dYCldKTtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IGN1cnJlbnROb2RlLmNoaWxkcmVuLmZpbHRlcihcbiAgICAgIChuOiBUTm9kZSkgPT4gbi5tb2RlbC5pZCA9PT0gaGFzaFxuICAgICk7XG4gICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vZGUgPSBmaWx0ZXJlZFswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IGJ1aWxkTW92ZU5vZGUoYCR7dG9rZW59WyR7dmFsdWV9XWAsIGN1cnJlbnROb2RlKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKG5vZGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjUHJldmVudE1vdmVNYXRGb3JEaXNwbGF5T25seSA9IChcbiAgbm9kZTogVE5vZGUsXG4gIGRlZmF1bHRCb2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGlmICghbm9kZSkgcmV0dXJuIHplcm9zKFtkZWZhdWx0Qm9hcmRTaXplLCBkZWZhdWx0Qm9hcmRTaXplXSk7XG4gIGNvbnN0IHNpemUgPSBleHRyYWN0Qm9hcmRTaXplKG5vZGUsIGRlZmF1bHRCb2FyZFNpemUpO1xuICBjb25zdCBwcmV2ZW50TW92ZU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG5cbiAgcHJldmVudE1vdmVNYXQuZm9yRWFjaChyb3cgPT4gcm93LmZpbGwoMSkpO1xuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChuOiBUTm9kZSkgPT4ge1xuICAgICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgIHByZXZlbnRNb3ZlTWF0W2ldW2pdID0gMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHByZXZlbnRNb3ZlTWF0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNQcmV2ZW50TW92ZU1hdCA9IChub2RlOiBUTm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGlmICghbm9kZSkgcmV0dXJuIHplcm9zKFtkZWZhdWx0Qm9hcmRTaXplLCBkZWZhdWx0Qm9hcmRTaXplXSk7XG4gIGNvbnN0IHNpemUgPSBleHRyYWN0Qm9hcmRTaXplKG5vZGUsIGRlZmF1bHRCb2FyZFNpemUpO1xuICBjb25zdCBwcmV2ZW50TW92ZU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IGZvcmNlTm9kZXMgPSBbXTtcbiAgbGV0IHByZXZlbnRNb3ZlTm9kZXM6IFROb2RlW10gPSBbXTtcbiAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSkge1xuICAgIHByZXZlbnRNb3ZlTm9kZXMgPSBub2RlLmNoaWxkcmVuLmZpbHRlcigobjogVE5vZGUpID0+IGlzUHJldmVudE1vdmVOb2RlKG4pKTtcbiAgfVxuXG4gIGlmIChpc0ZvcmNlTm9kZShub2RlKSkge1xuICAgIHByZXZlbnRNb3ZlTWF0LmZvckVhY2gocm93ID0+IHJvdy5maWxsKDEpKTtcbiAgICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFROb2RlKSA9PiB7XG4gICAgICAgIG4ubW9kZWwubW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICAgIHByZXZlbnRNb3ZlTWF0W2ldW2pdID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJldmVudE1vdmVOb2Rlcy5mb3JFYWNoKChuOiBUTm9kZSkgPT4ge1xuICAgIG4ubW9kZWwubW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgcHJldmVudE1vdmVNYXRbaV1bal0gPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJldmVudE1vdmVNYXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIG1hcmt1cCBtYXRyaXggZm9yIHZhcmlhdGlvbnMgaW4gYSBnaXZlbiBTR0Ygbm9kZS5cbiAqXG4gKiBAcGFyYW0gbm9kZSAtIFRoZSBTR0Ygbm9kZSB0byBjYWxjdWxhdGUgdGhlIG1hcmt1cCBmb3IuXG4gKiBAcGFyYW0gcG9saWN5IC0gVGhlIHBvbGljeSBmb3IgaGFuZGxpbmcgdGhlIG1hcmt1cC4gRGVmYXVsdHMgdG8gJ2FwcGVuZCcuXG4gKiBAcmV0dXJucyBUaGUgY2FsY3VsYXRlZCBtYXJrdXAgZm9yIHRoZSB2YXJpYXRpb25zLlxuICovXG5leHBvcnQgY29uc3QgY2FsY1ZhcmlhdGlvbnNNYXJrdXAgPSAoXG4gIG5vZGU6IFROb2RlLFxuICBwb2xpY3k6ICdhcHBlbmQnIHwgJ3ByZXBlbmQnIHwgJ3JlcGxhY2UnID0gJ2FwcGVuZCcsXG4gIGFjdGl2ZUluZGV4OiBudW1iZXIgPSAwLFxuICBkZWZhdWx0Qm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBjb25zdCByZXMgPSBjYWxjTWF0QW5kTWFya3VwKG5vZGUpO1xuICBjb25zdCB7bWF0LCBtYXJrdXB9ID0gcmVzO1xuICBjb25zdCBzaXplID0gZXh0cmFjdEJvYXJkU2l6ZShub2RlLCBkZWZhdWx0Qm9hcmRTaXplKTtcblxuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChuOiBUTm9kZSkgPT4ge1xuICAgICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgbGV0IG1hcmsgPSBNYXJrdXAuTmV1dHJhbE5vZGU7XG4gICAgICAgICAgaWYgKGluV3JvbmdQYXRoKG4pKSB7XG4gICAgICAgICAgICBtYXJrID1cbiAgICAgICAgICAgICAgbi5nZXRJbmRleCgpID09PSBhY3RpdmVJbmRleFxuICAgICAgICAgICAgICAgID8gTWFya3VwLk5lZ2F0aXZlQWN0aXZlTm9kZVxuICAgICAgICAgICAgICAgIDogTWFya3VwLk5lZ2F0aXZlTm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluUmlnaHRQYXRoKG4pKSB7XG4gICAgICAgICAgICBtYXJrID1cbiAgICAgICAgICAgICAgbi5nZXRJbmRleCgpID09PSBhY3RpdmVJbmRleFxuICAgICAgICAgICAgICAgID8gTWFya3VwLlBvc2l0aXZlQWN0aXZlTm9kZVxuICAgICAgICAgICAgICAgIDogTWFya3VwLlBvc2l0aXZlTm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1hdFtpXVtqXSA9PT0gS2kuRW1wdHkpIHtcbiAgICAgICAgICAgIHN3aXRjaCAocG9saWN5KSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3ByZXBlbmQnOlxuICAgICAgICAgICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcmsgKyAnfCcgKyBtYXJrdXBbaV1bal07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2UnOlxuICAgICAgICAgICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcms7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcGVuZCc6XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbWFya3VwW2ldW2pdICs9ICd8JyArIG1hcms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBtYXJrdXA7XG59O1xuXG5leHBvcnQgY29uc3QgZGV0ZWN0U1QgPSAobm9kZTogVE5vZGUpID0+IHtcbiAgLy8gUmVmZXJlbmNlOiBodHRwczovL3d3dy5yZWQtYmVhbi5jb20vc2dmL3Byb3BlcnRpZXMuaHRtbCNTVFxuICBjb25zdCByb290ID0gbm9kZS5nZXRQYXRoKClbMF07XG4gIGNvbnN0IHN0UHJvcCA9IHJvb3QubW9kZWwucm9vdFByb3BzLmZpbmQoKHA6IFJvb3RQcm9wKSA9PiBwLnRva2VuID09PSAnU1QnKTtcbiAgbGV0IHNob3dWYXJpYXRpb25zTWFya3VwID0gZmFsc2U7XG4gIGxldCBzaG93Q2hpbGRyZW5NYXJrdXAgPSBmYWxzZTtcbiAgbGV0IHNob3dTaWJsaW5nc01hcmt1cCA9IGZhbHNlO1xuXG4gIGNvbnN0IHN0ID0gc3RQcm9wPy52YWx1ZSB8fCAnMCc7XG4gIGlmIChzdCkge1xuICAgIGlmIChzdCA9PT0gJzAnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IHRydWU7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzEnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSB0cnVlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gZmFsc2U7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzInKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IHRydWU7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoc3QgPT09ICczJykge1xuICAgICAgc2hvd1NpYmxpbmdzTWFya3VwID0gdHJ1ZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IGZhbHNlO1xuICAgICAgc2hvd1ZhcmlhdGlvbnNNYXJrdXAgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtzaG93VmFyaWF0aW9uc01hcmt1cCwgc2hvd0NoaWxkcmVuTWFya3VwLCBzaG93U2libGluZ3NNYXJrdXB9O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBtYXQgYW5kIG1hcmt1cCBhcnJheXMgYmFzZWQgb24gdGhlIGN1cnJlbnROb2RlIGFuZCBkZWZhdWx0Qm9hcmRTaXplLlxuICogQHBhcmFtIGN1cnJlbnROb2RlIFRoZSBjdXJyZW50IG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBAcGFyYW0gZGVmYXVsdEJvYXJkU2l6ZSBUaGUgZGVmYXVsdCBzaXplIG9mIHRoZSBib2FyZCAob3B0aW9uYWwsIGRlZmF1bHQgaXMgMTkpLlxuICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hdC92aXNpYmxlQXJlYU1hdC9tYXJrdXAvbnVtTWFya3VwIGFycmF5cy5cbiAqL1xuZXhwb3J0IGNvbnN0IGNhbGNNYXRBbmRNYXJrdXAgPSAoY3VycmVudE5vZGU6IFROb2RlLCBkZWZhdWx0Qm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3QgcGF0aCA9IGN1cnJlbnROb2RlLmdldFBhdGgoKTtcbiAgY29uc3Qgcm9vdCA9IHBhdGhbMF07XG5cbiAgbGV0IGxpLCBsajtcbiAgbGV0IHNldHVwQ291bnQgPSAwO1xuICBjb25zdCBzaXplID0gZXh0cmFjdEJvYXJkU2l6ZShjdXJyZW50Tm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGxldCBtYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICBjb25zdCB2aXNpYmxlQXJlYU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IG1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IG51bU1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG5cbiAgcGF0aC5mb3JFYWNoKChub2RlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHttb3ZlUHJvcHMsIHNldHVwUHJvcHMsIHJvb3RQcm9wc30gPSBub2RlLm1vZGVsO1xuICAgIGlmIChzZXR1cFByb3BzLmxlbmd0aCA+IDApIHNldHVwQ291bnQgKz0gMTtcblxuICAgIG1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgIGxpID0gaTtcbiAgICAgICAgbGogPSBqO1xuICAgICAgICBtYXQgPSBtb3ZlKG1hdCwgaSwgaiwgbS50b2tlbiA9PT0gJ0InID8gS2kuQmxhY2sgOiBLaS5XaGl0ZSk7XG5cbiAgICAgICAgaWYgKGxpICE9PSB1bmRlZmluZWQgJiYgbGogIT09IHVuZGVmaW5lZCAmJiBsaSA+PSAwICYmIGxqID49IDApIHtcbiAgICAgICAgICBudW1NYXJrdXBbbGldW2xqXSA9IChcbiAgICAgICAgICAgIG5vZGUubW9kZWwubnVtYmVyIHx8IGluZGV4IC0gc2V0dXBDb3VudFxuICAgICAgICAgICkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCA9PT0gcGF0aC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgbWFya3VwW2xpXVtsal0gPSBNYXJrdXAuQ3VycmVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2V0dXAgcHJvcHMgc2hvdWxkIG92ZXJyaWRlIG1vdmUgcHJvcHNcbiAgICBzZXR1cFByb3BzLmZvckVhY2goKHNldHVwOiBhbnkpID0+IHtcbiAgICAgIHNldHVwLnZhbHVlcy5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgbGkgPSBpO1xuICAgICAgICAgIGxqID0gajtcbiAgICAgICAgICBtYXRbaV1bal0gPSBzZXR1cC50b2tlbiA9PT0gJ0FCJyA/IDEgOiAtMTtcbiAgICAgICAgICBpZiAoc2V0dXAudG9rZW4gPT09ICdBRScpIG1hdFtpXVtqXSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gSWYgdGhlIHJvb3Qgbm9kZSBkb2VzIG5vdCBpbmNsdWRlIGFueSBzZXR1cCBwcm9wZXJ0aWVzXG4gICAgLy8gY2hlY2sgd2hldGhlciBpdHMgZmlyc3QgY2hpbGQgaXMgYSBzZXR1cCBub2RlIChpLmUuLCBhIG5vbi1tb3ZlIG5vZGUpXG4gICAgLy8gYW5kIGFwcGx5IGl0cyBzZXR1cCBwcm9wZXJ0aWVzIGluc3RlYWRcbiAgICBpZiAoc2V0dXBQcm9wcy5sZW5ndGggPT09IDAgJiYgY3VycmVudE5vZGUuaXNSb290KCkpIHtcbiAgICAgIGNvbnN0IGZpcnN0Q2hpbGROb2RlID0gY3VycmVudE5vZGUuY2hpbGRyZW5bMF07XG4gICAgICBpZiAoXG4gICAgICAgIGZpcnN0Q2hpbGROb2RlICYmXG4gICAgICAgIGlzU2V0dXBOb2RlKGZpcnN0Q2hpbGROb2RlKSAmJlxuICAgICAgICAhaXNNb3ZlTm9kZShmaXJzdENoaWxkTm9kZSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBzZXR1cFByb3BzID0gZmlyc3RDaGlsZE5vZGUubW9kZWwuc2V0dXBQcm9wcztcbiAgICAgICAgc2V0dXBQcm9wcy5mb3JFYWNoKChzZXR1cDogYW55KSA9PiB7XG4gICAgICAgICAgc2V0dXAudmFsdWVzLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzBdKTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzFdKTtcbiAgICAgICAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgICAgIGxpID0gaTtcbiAgICAgICAgICAgICAgbGogPSBqO1xuICAgICAgICAgICAgICBtYXRbaV1bal0gPSBzZXR1cC50b2tlbiA9PT0gJ0FCJyA/IDEgOiAtMTtcbiAgICAgICAgICAgICAgaWYgKHNldHVwLnRva2VuID09PSAnQUUnKSBtYXRbaV1bal0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDbGVhciBudW1iZXIgd2hlbiBzdG9uZXMgYXJlIGNhcHR1cmVkXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGlmIChtYXRbaV1bal0gPT09IDApIG51bU1hcmt1cFtpXVtqXSA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gQ2FsY3VsYXRpbmcgdGhlIHZpc2libGUgYXJlYVxuICBpZiAocm9vdCkge1xuICAgIHJvb3QuYWxsKChub2RlOiBUTm9kZSkgPT4ge1xuICAgICAgY29uc3Qge21vdmVQcm9wcywgc2V0dXBQcm9wcywgcm9vdFByb3BzfSA9IG5vZGUubW9kZWw7XG4gICAgICBpZiAoc2V0dXBQcm9wcy5sZW5ndGggPiAwKSBzZXR1cENvdW50ICs9IDE7XG4gICAgICBzZXR1cFByb3BzLmZvckVhY2goKHNldHVwOiBhbnkpID0+IHtcbiAgICAgICAgc2V0dXAudmFsdWVzLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVswXSk7XG4gICAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMV0pO1xuICAgICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgICB2aXNpYmxlQXJlYU1hdFtpXVtqXSA9IEtpLkJsYWNrO1xuICAgICAgICAgICAgaWYgKHNldHVwLnRva2VuID09PSAnQUUnKSB2aXNpYmxlQXJlYU1hdFtpXVtqXSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBtb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgIHZpc2libGVBcmVhTWF0W2ldW2pdID0gS2kuQmxhY2s7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG1hcmt1cFByb3BzID0gY3VycmVudE5vZGUubW9kZWwubWFya3VwUHJvcHM7XG4gIG1hcmt1cFByb3BzLmZvckVhY2goKG06IE1hcmt1cFByb3ApID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IG0udG9rZW47XG4gICAgY29uc3QgdmFsdWVzID0gbS52YWx1ZXM7XG4gICAgdmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMF0pO1xuICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMV0pO1xuICAgICAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm47XG4gICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgbGV0IG1hcms7XG4gICAgICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgICBjYXNlICdDUic6XG4gICAgICAgICAgICBtYXJrID0gTWFya3VwLkNpcmNsZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1NRJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuU3F1YXJlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnVFInOlxuICAgICAgICAgICAgbWFyayA9IE1hcmt1cC5UcmlhbmdsZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ01BJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuQ3Jvc3M7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBtYXJrID0gdmFsdWUuc3BsaXQoJzonKVsxXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWFya3VwW2ldW2pdID0gbWFyaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gaWYgKFxuICAvLyAgIGxpICE9PSB1bmRlZmluZWQgJiZcbiAgLy8gICBsaiAhPT0gdW5kZWZpbmVkICYmXG4gIC8vICAgbGkgPj0gMCAmJlxuICAvLyAgIGxqID49IDAgJiZcbiAgLy8gICAhbWFya3VwW2xpXVtsal1cbiAgLy8gKSB7XG4gIC8vICAgbWFya3VwW2xpXVtsal0gPSBNYXJrdXAuQ3VycmVudDtcbiAgLy8gfVxuXG4gIHJldHVybiB7bWF0LCB2aXNpYmxlQXJlYU1hdCwgbWFya3VwLCBudW1NYXJrdXB9O1xufTtcblxuLyoqXG4gKiBGaW5kcyBhIHByb3BlcnR5IGluIHRoZSBnaXZlbiBub2RlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAqIEBwYXJhbSBub2RlIFRoZSBub2RlIHRvIHNlYXJjaCBmb3IgdGhlIHByb3BlcnR5LlxuICogQHBhcmFtIHRva2VuIFRoZSB0b2tlbiBvZiB0aGUgcHJvcGVydHkgdG8gZmluZC5cbiAqIEByZXR1cm5zIFRoZSBmb3VuZCBwcm9wZXJ0eSBvciBudWxsIGlmIG5vdCBmb3VuZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGZpbmRQcm9wID0gKG5vZGU6IFROb2RlLCB0b2tlbjogc3RyaW5nKSA9PiB7XG4gIGlmICghbm9kZSkgcmV0dXJuO1xuICBpZiAoTU9WRV9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubW92ZVByb3BzLmZpbmQoKHA6IE1vdmVQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcy5maW5kKFxuICAgICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVBbm5vdGF0aW9uUHJvcHMuZmluZChcbiAgICAgIChwOiBNb3ZlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICBpZiAoUk9PVF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwucm9vdFByb3BzLmZpbmQoKHA6IFJvb3RQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKFNFVFVQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5zZXR1cFByb3BzLmZpbmQoKHA6IFNldHVwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1hcmt1cFByb3BzLmZpbmQoKHA6IE1hcmt1cFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoR0FNRV9JTkZPX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5nYW1lSW5mb1Byb3BzLmZpbmQoXG4gICAgICAocDogR2FtZUluZm9Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIEZpbmRzIHByb3BlcnRpZXMgaW4gYSBnaXZlbiBub2RlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAqIEBwYXJhbSBub2RlIC0gVGhlIG5vZGUgdG8gc2VhcmNoIGZvciBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHRva2VuIC0gVGhlIHRva2VuIHRvIG1hdGNoIGFnYWluc3QgdGhlIHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBwcm9wZXJ0aWVzIHRoYXQgbWF0Y2ggdGhlIHByb3ZpZGVkIHRva2VuLlxuICovXG5leHBvcnQgY29uc3QgZmluZFByb3BzID0gKG5vZGU6IFROb2RlLCB0b2tlbjogc3RyaW5nKSA9PiB7XG4gIGlmIChNT1ZFX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tb3ZlUHJvcHMuZmlsdGVyKChwOiBNb3ZlUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHMuZmlsdGVyKFxuICAgICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVBbm5vdGF0aW9uUHJvcHMuZmlsdGVyKFxuICAgICAgKHA6IE1vdmVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChST09UX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5yb290UHJvcHMuZmlsdGVyKChwOiBSb290UHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChTRVRVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwuc2V0dXBQcm9wcy5maWx0ZXIoKHA6IFNldHVwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1hcmt1cFByb3BzLmZpbHRlcigocDogTWFya3VwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChHQU1FX0lORk9fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLmdhbWVJbmZvUHJvcHMuZmlsdGVyKFxuICAgICAgKHA6IEdhbWVJbmZvUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZW5Nb3ZlID0gKFxuICBub2RlOiBUTm9kZSxcbiAgb25SaWdodDogKHBhdGg6IHN0cmluZykgPT4gdm9pZCxcbiAgb25Xcm9uZzogKHBhdGg6IHN0cmluZykgPT4gdm9pZCxcbiAgb25WYXJpYW50OiAocGF0aDogc3RyaW5nKSA9PiB2b2lkLFxuICBvbk9mZlBhdGg6IChwYXRoOiBzdHJpbmcpID0+IHZvaWRcbik6IFROb2RlIHwgdW5kZWZpbmVkID0+IHtcbiAgbGV0IG5leHROb2RlO1xuICBjb25zdCBnZXRQYXRoID0gKG5vZGU6IFROb2RlKSA9PiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IGNvbXBhY3QoXG4gICAgICBub2RlLmdldFBhdGgoKS5tYXAobiA9PiBuLm1vZGVsLm1vdmVQcm9wc1swXT8udG9TdHJpbmcoKSlcbiAgICApLmpvaW4oJzsnKTtcbiAgICByZXR1cm4gbmV3UGF0aDtcbiAgfTtcblxuICBjb25zdCBjaGVja1Jlc3VsdCA9IChub2RlOiBUTm9kZSkgPT4ge1xuICAgIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHJldHVybjtcblxuICAgIGNvbnN0IHBhdGggPSBnZXRQYXRoKG5vZGUpO1xuICAgIGlmIChpc1JpZ2h0Tm9kZShub2RlKSkge1xuICAgICAgaWYgKG9uUmlnaHQpIG9uUmlnaHQocGF0aCk7XG4gICAgfSBlbHNlIGlmIChpc1ZhcmlhbnROb2RlKG5vZGUpKSB7XG4gICAgICBpZiAob25WYXJpYW50KSBvblZhcmlhbnQocGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvbldyb25nKSBvbldyb25nKHBhdGgpO1xuICAgIH1cbiAgfTtcblxuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgY29uc3QgcmlnaHROb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUTm9kZSkgPT4gaW5SaWdodFBhdGgobikpO1xuICAgIGNvbnN0IHdyb25nTm9kZXMgPSBub2RlLmNoaWxkcmVuLmZpbHRlcigobjogVE5vZGUpID0+IGluV3JvbmdQYXRoKG4pKTtcbiAgICBjb25zdCB2YXJpYW50Tm9kZXMgPSBub2RlLmNoaWxkcmVuLmZpbHRlcigobjogVE5vZGUpID0+IGluVmFyaWFudFBhdGgobikpO1xuXG4gICAgbmV4dE5vZGUgPSBub2RlO1xuXG4gICAgaWYgKGluUmlnaHRQYXRoKG5vZGUpICYmIHJpZ2h0Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgbmV4dE5vZGUgPSBzYW1wbGUocmlnaHROb2Rlcyk7XG4gICAgfSBlbHNlIGlmIChpbldyb25nUGF0aChub2RlKSAmJiB3cm9uZ05vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5leHROb2RlID0gc2FtcGxlKHdyb25nTm9kZXMpO1xuICAgIH0gZWxzZSBpZiAoaW5WYXJpYW50UGF0aChub2RlKSAmJiB2YXJpYW50Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgbmV4dE5vZGUgPSBzYW1wbGUodmFyaWFudE5vZGVzKTtcbiAgICB9IGVsc2UgaWYgKGlzUmlnaHROb2RlKG5vZGUpKSB7XG4gICAgICBvblJpZ2h0KGdldFBhdGgobmV4dE5vZGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb25Xcm9uZyhnZXRQYXRoKG5leHROb2RlKSk7XG4gICAgfVxuICAgIGlmIChuZXh0Tm9kZSkgY2hlY2tSZXN1bHQobmV4dE5vZGUpO1xuICB9IGVsc2Uge1xuICAgIGNoZWNrUmVzdWx0KG5vZGUpO1xuICB9XG4gIHJldHVybiBuZXh0Tm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0Qm9hcmRTaXplID0gKG5vZGU6IFROb2RlLCBkZWZhdWx0Qm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3Qgcm9vdCA9IG5vZGUuZ2V0UGF0aCgpWzBdO1xuICBjb25zdCBzaXplID0gTWF0aC5taW4oXG4gICAgcGFyc2VJbnQoU3RyaW5nKGZpbmRQcm9wKHJvb3QsICdTWicpPy52YWx1ZSB8fCBkZWZhdWx0Qm9hcmRTaXplKSksXG4gICAgTUFYX0JPQVJEX1NJWkVcbiAgKTtcbiAgcmV0dXJuIHNpemU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Rmlyc3RUb01vdmVDb2xvckZyb21Sb290ID0gKFxuICByb290OiBUTm9kZSB8IHVuZGVmaW5lZCB8IG51bGwsXG4gIGRlZmF1bHRNb3ZlQ29sb3I6IEtpID0gS2kuQmxhY2tcbikgPT4ge1xuICBpZiAocm9vdCkge1xuICAgIGNvbnN0IHNldHVwTm9kZSA9IHJvb3QuZmlyc3QobiA9PiBpc1NldHVwTm9kZShuKSk7XG4gICAgaWYgKHNldHVwTm9kZSkge1xuICAgICAgY29uc3QgZmlyc3RNb3ZlTm9kZSA9IHNldHVwTm9kZS5maXJzdChuID0+IGlzTW92ZU5vZGUobikpO1xuICAgICAgaWYgKCFmaXJzdE1vdmVOb2RlKSByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbiAgICAgIHJldHVybiBnZXRNb3ZlQ29sb3IoZmlyc3RNb3ZlTm9kZSk7XG4gICAgfVxuICB9XG4gIC8vIGNvbnNvbGUud2FybignRGVmYXVsdCBmaXJzdCB0byBtb3ZlIGNvbG9yJywgZGVmYXVsdE1vdmVDb2xvcik7XG4gIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpcnN0VG9Nb3ZlQ29sb3JGcm9tU2dmID0gKFxuICBzZ2Y6IHN0cmluZyxcbiAgZGVmYXVsdE1vdmVDb2xvcjogS2kgPSBLaS5CbGFja1xuKSA9PiB7XG4gIGNvbnN0IHNnZlBhcnNlciA9IG5ldyBTZ2Yoc2dmKTtcbiAgaWYgKHNnZlBhcnNlci5yb290KVxuICAgIGdldEZpcnN0VG9Nb3ZlQ29sb3JGcm9tUm9vdChzZ2ZQYXJzZXIucm9vdCwgZGVmYXVsdE1vdmVDb2xvcik7XG4gIC8vIGNvbnNvbGUud2FybignRGVmYXVsdCBmaXJzdCB0byBtb3ZlIGNvbG9yJywgZGVmYXVsdE1vdmVDb2xvcik7XG4gIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE1vdmVDb2xvciA9IChub2RlOiBUTm9kZSwgZGVmYXVsdE1vdmVDb2xvcjogS2kgPSBLaS5CbGFjaykgPT4ge1xuICBjb25zdCBtb3ZlUHJvcCA9IG5vZGUubW9kZWw/Lm1vdmVQcm9wcz8uWzBdO1xuICBzd2l0Y2ggKG1vdmVQcm9wPy50b2tlbikge1xuICAgIGNhc2UgJ1cnOlxuICAgICAgcmV0dXJuIEtpLldoaXRlO1xuICAgIGNhc2UgJ0InOlxuICAgICAgcmV0dXJuIEtpLkJsYWNrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ0RlZmF1bHQgbW92ZSBjb2xvciBpcycsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICAgICAgcmV0dXJuIGRlZmF1bHRNb3ZlQ29sb3I7XG4gIH1cbn07XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9uZSB7XG4gIHByb3RlY3RlZCBnbG9iYWxBbHBoYSA9IDE7XG4gIHByb3RlY3RlZCBzaXplID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcHJvdGVjdGVkIHg6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgeTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge31cbiAgZHJhdygpIHtcbiAgICAvLyBCYXNlIGRyYXcgbWV0aG9kIC0gdG8gYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3Nlc1xuICB9XG5cbiAgc2V0R2xvYmFsQWxwaGEoYWxwaGE6IG51bWJlcikge1xuICAgIHRoaXMuZ2xvYmFsQWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIHNldFNpemUoc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgfVxufVxuIiwiaW1wb3J0IFN0b25lIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge0tpLCBUaGVtZUNvbmZpZywgVGhlbWVDb250ZXh0fSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge0JBU0VfVEhFTUVfQ09ORklHfSBmcm9tICcuLi9jb25zdCc7XG5cbmV4cG9ydCBjbGFzcyBGbGF0U3RvbmUgZXh0ZW5kcyBTdG9uZSB7XG4gIHByb3RlY3RlZCB0aGVtZUNvbnRleHQ/OiBUaGVtZUNvbnRleHQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBraTogbnVtYmVyLFxuICAgIHRoZW1lQ29udGV4dD86IFRoZW1lQ29udGV4dFxuICApIHtcbiAgICBzdXBlcihjdHgsIHgsIHksIGtpKTtcbiAgICB0aGlzLnRoZW1lQ29udGV4dCA9IHRoZW1lQ29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSB0aGVtZSBwcm9wZXJ0eSB2YWx1ZSB3aXRoIGZhbGxiYWNrXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VGhlbWVQcm9wZXJ0eTxLIGV4dGVuZHMga2V5b2YgVGhlbWVDb25maWc+KFxuICAgIGtleTogS1xuICApOiBUaGVtZUNvbmZpZ1tLXSB7XG4gICAgaWYgKCF0aGlzLnRoZW1lQ29udGV4dCkge1xuICAgICAgcmV0dXJuIEJBU0VfVEhFTUVfQ09ORklHW2tleV07XG4gICAgfVxuXG4gICAgY29uc3Qge3RoZW1lLCB0aGVtZU9wdGlvbnN9ID0gdGhpcy50aGVtZUNvbnRleHQ7XG4gICAgY29uc3QgdGhlbWVTcGVjaWZpYyA9IHRoZW1lT3B0aW9uc1t0aGVtZV07XG4gICAgY29uc3QgZGVmYXVsdENvbmZpZyA9IHRoZW1lT3B0aW9ucy5kZWZhdWx0O1xuXG4gICAgLy8gVHJ5IHRoZW1lLXNwZWNpZmljIHZhbHVlIGZpcnN0LCB0aGVuIGRlZmF1bHRcbiAgICBjb25zdCByZXN1bHQgPSAodGhlbWVTcGVjaWZpYz8uW2tleV0gPz9cbiAgICAgIGRlZmF1bHRDb25maWdba2V5XSkgYXMgVGhlbWVDb25maWdbS107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgc2l6ZSwga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgaWYgKHNpemUgPD0gMCkgcmV0dXJuO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICBjdHgubGluZVdpZHRoID0gMTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG4gICAgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IFN0b25lIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge0tpLCBUaGVtZUNvbnRleHR9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7RmxhdFN0b25lfSBmcm9tICcuL0ZsYXRTdG9uZSc7XG5cbmV4cG9ydCBjbGFzcyBJbWFnZVN0b25lIGV4dGVuZHMgU3RvbmUge1xuICBwcml2YXRlIGZhbGxiYWNrU3RvbmU/OiBGbGF0U3RvbmU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBraTogbnVtYmVyLFxuICAgIHByaXZhdGUgbW9kOiBudW1iZXIsXG4gICAgcHJpdmF0ZSBibGFja3M6IGFueSxcbiAgICBwcml2YXRlIHdoaXRlczogYW55LFxuICAgIHByaXZhdGUgdGhlbWVDb250ZXh0PzogVGhlbWVDb250ZXh0XG4gICkge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwga2kpO1xuXG4gICAgLy8gQ3JlYXRlIEZsYXRTdG9uZSBhcyBmYWxsYmFjayBvcHRpb25cbiAgICBpZiAodGhlbWVDb250ZXh0KSB7XG4gICAgICB0aGlzLmZhbGxiYWNrU3RvbmUgPSBuZXcgRmxhdFN0b25lKGN0eCwgeCwgeSwga2ksIHRoZW1lQ29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBraSwgYmxhY2tzLCB3aGl0ZXMsIG1vZH0gPSB0aGlzO1xuICAgIGlmIChzaXplIDw9IDApIHJldHVybjtcblxuICAgIGxldCBpbWc7XG4gICAgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgaW1nID0gYmxhY2tzW21vZCAlIGJsYWNrcy5sZW5ndGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbWcgPSB3aGl0ZXNbbW9kICUgd2hpdGVzLmxlbmd0aF07XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgaW1hZ2UgaXMgbG9hZGVkIGNvbXBsZXRlbHlcbiAgICBpZiAoaW1nICYmIGltZy5jb21wbGV0ZSAmJiBpbWcubmF0dXJhbEhlaWdodCAhPT0gMCkge1xuICAgICAgLy8gSW1hZ2UgbG9hZGVkLCByZW5kZXIgd2l0aCBpbWFnZVxuICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW1hZ2Ugbm90IGxvYWRlZCBvciBsb2FkIGZhaWxlZCwgdXNlIEZsYXRTdG9uZSBhcyBmYWxsYmFja1xuICAgICAgaWYgKHRoaXMuZmFsbGJhY2tTdG9uZSkge1xuICAgICAgICB0aGlzLmZhbGxiYWNrU3RvbmUuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgdGhpcy5mYWxsYmFja1N0b25lLmRyYXcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRTaXplKHNpemU6IG51bWJlcikge1xuICAgIHN1cGVyLnNldFNpemUoc2l6ZSk7XG4gICAgLy8gU3luY2hyb25vdXNseSB1cGRhdGUgZmFsbGJhY2tTdG9uZSBzaXplXG4gICAgaWYgKHRoaXMuZmFsbGJhY2tTdG9uZSkge1xuICAgICAgdGhpcy5mYWxsYmFja1N0b25lLnNldFNpemUoc2l6ZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0FuYWx5c2lzUG9pbnRUaGVtZSwgTW92ZUluZm8sIFJvb3RJbmZvfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICBjYWxjQW5hbHlzaXNQb2ludENvbG9yLFxuICBjYWxjU2NvcmVEaWZmLFxuICBjYWxjU2NvcmVEaWZmVGV4dCxcbiAgbkZvcm1hdHRlcixcbiAgcm91bmQzLFxufSBmcm9tICcuLi9oZWxwZXInO1xuaW1wb3J0IHtcbiAgTElHSFRfR1JFRU5fUkdCLFxuICBMSUdIVF9SRURfUkdCLFxuICBMSUdIVF9ZRUxMT1dfUkdCLFxuICBZRUxMT1dfUkdCLFxufSBmcm9tICcuLi9jb25zdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuYWx5c2lzUG9pbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByaXZhdGUgeDogbnVtYmVyLFxuICAgIHByaXZhdGUgeTogbnVtYmVyLFxuICAgIHByaXZhdGUgcjogbnVtYmVyLFxuICAgIHByaXZhdGUgcm9vdEluZm86IFJvb3RJbmZvLFxuICAgIHByaXZhdGUgbW92ZUluZm86IE1vdmVJbmZvLFxuICAgIHByaXZhdGUgdGhlbWU6IEFuYWx5c2lzUG9pbnRUaGVtZSA9IEFuYWx5c2lzUG9pbnRUaGVtZS5EZWZhdWx0LFxuICAgIHByaXZhdGUgb3V0bGluZUNvbG9yPzogc3RyaW5nXG4gICkge31cblxuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHIsIHJvb3RJbmZvLCBtb3ZlSW5mbywgdGhlbWV9ID0gdGhpcztcbiAgICBpZiAociA8IDApIHJldHVybjtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICBjdHguc2hhZG93Q29sb3IgPSAnI2ZmZic7XG4gICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xuXG4gICAgLy8gdGhpcy5kcmF3RGVmYXVsdEFuYWx5c2lzUG9pbnQoKTtcbiAgICBpZiAodGhlbWUgPT09IEFuYWx5c2lzUG9pbnRUaGVtZS5EZWZhdWx0KSB7XG4gICAgICB0aGlzLmRyYXdEZWZhdWx0QW5hbHlzaXNQb2ludCgpO1xuICAgIH0gZWxzZSBpZiAodGhlbWUgPT09IEFuYWx5c2lzUG9pbnRUaGVtZS5Qcm9ibGVtKSB7XG4gICAgICB0aGlzLmRyYXdQcm9ibGVtQW5hbHlzaXNQb2ludCgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdQcm9ibGVtQW5hbHlzaXNQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm8sIG91dGxpbmVDb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHtvcmRlcn0gPSBtb3ZlSW5mbztcblxuICAgIGxldCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG5cbiAgICBpZiAob3JkZXIgPCA1KSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuOSwgeCwgeSwgcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjksICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBpZiAob3V0bGluZUNvbG9yKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSA0O1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBvdXRsaW5lQ29sb3I7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm9udFNpemUgPSByIC8gMS41O1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplICogMC44fXB4IFRhaG9tYWA7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZX1weCBUYWhvbWFgO1xuICAgICAgY29uc3Qgc2NvcmVUZXh0ID0gY2FsY1Njb3JlRGlmZlRleHQocm9vdEluZm8sIG1vdmVJbmZvKTtcbiAgICAgIGN0eC5maWxsVGV4dChzY29yZVRleHQsIHgsIHkpO1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplICogMC44fXB4IFRhaG9tYWA7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgIGN0eC5maWxsVGV4dChuRm9ybWF0dGVyKG1vdmVJbmZvLnZpc2l0cyksIHgsIHkgKyByIC8gMiArIGZvbnRTaXplIC8gOCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhd0NhbmRpZGF0ZVBvaW50KCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgZHJhd0RlZmF1bHRBbmFseXNpc1BvaW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHIsIHJvb3RJbmZvLCBtb3ZlSW5mb30gPSB0aGlzO1xuICAgIGNvbnN0IHtvcmRlcn0gPSBtb3ZlSW5mbztcblxuICAgIGxldCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG5cbiAgICBpZiAob3JkZXIgPCA1KSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuOSwgeCwgeSwgcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjksICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGN0eC5maWxsKCk7XG5cbiAgICAgIGNvbnN0IGZvbnRTaXplID0gciAvIDEuNTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgIGNvbnN0IHdpbnJhdGUgPVxuICAgICAgICByb290SW5mby5jdXJyZW50UGxheWVyID09PSAnQidcbiAgICAgICAgICA/IG1vdmVJbmZvLndpbnJhdGVcbiAgICAgICAgICA6IDEgLSBtb3ZlSW5mby53aW5yYXRlO1xuXG4gICAgICBjdHguZmlsbFRleHQocm91bmQzKHdpbnJhdGUsIDEwMCwgMSksIHgsIHkgLSByIC8gMiArIGZvbnRTaXplIC8gNSk7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggVGFob21hYDtcbiAgICAgIGNvbnN0IHNjb3JlVGV4dCA9IGNhbGNTY29yZURpZmZUZXh0KHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgICBjdHguZmlsbFRleHQoc2NvcmVUZXh0LCB4LCB5ICsgZm9udFNpemUgLyAzKTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHguZmlsbFRleHQobkZvcm1hdHRlcihtb3ZlSW5mby52aXNpdHMpLCB4LCB5ICsgciAvIDIgKyBmb250U2l6ZSAvIDMpO1xuXG4gICAgICBjb25zdCBvcmRlciA9IG1vdmVJbmZvLm9yZGVyO1xuICAgICAgY3R4LmZpbGxUZXh0KChvcmRlciArIDEpLnRvU3RyaW5nKCksIHggKyByLCB5IC0gciAvIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXdDYW5kaWRhdGVQb2ludCgpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGRyYXdDYW5kaWRhdGVQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm99ID0gdGhpcztcbiAgICBjb25zdCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoeCwgeSwgciAqIDAuNiwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICBjb25zdCBncmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCByICogMC40LCB4LCB5LCByKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45NSwgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCcpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7VGhlbWUsIFRoZW1lUHJvcGVydHlLZXksIFRoZW1lQ29udGV4dCwgVGhlbWVDb25maWd9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7QkFTRV9USEVNRV9DT05GSUd9IGZyb20gJy4uL2NvbnN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya3VwIHtcbiAgcHJvdGVjdGVkIGdsb2JhbEFscGhhID0gMTtcbiAgcHJvdGVjdGVkIGNvbG9yID0gJyc7XG4gIHByb3RlY3RlZCBsaW5lRGFzaDogbnVtYmVyW10gPSBbXTtcbiAgcHJvdGVjdGVkIHRoZW1lQ29udGV4dD86IFRoZW1lQ29udGV4dDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcHJvdGVjdGVkIHg6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgeTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBzOiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIGtpOiBudW1iZXIsXG4gICAgdGhlbWVDb250ZXh0PzogVGhlbWVDb250ZXh0LFxuICAgIHByb3RlY3RlZCB2YWw6IHN0cmluZyB8IG51bWJlciA9ICcnXG4gICkge1xuICAgIHRoaXMudGhlbWVDb250ZXh0ID0gdGhlbWVDb250ZXh0O1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICAvLyBCYXNlIGRyYXcgbWV0aG9kIC0gdG8gYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3Nlc1xuICB9XG5cbiAgc2V0R2xvYmFsQWxwaGEoYWxwaGE6IG51bWJlcikge1xuICAgIHRoaXMuZ2xvYmFsQWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gIH1cblxuICBzZXRMaW5lRGFzaChsaW5lRGFzaDogbnVtYmVyW10pIHtcbiAgICB0aGlzLmxpbmVEYXNoID0gbGluZURhc2g7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgdGhlbWUgcHJvcGVydHkgdmFsdWUgd2l0aCBmYWxsYmFja1xuICAgKi9cbiAgcHJvdGVjdGVkIGdldFRoZW1lUHJvcGVydHk8SyBleHRlbmRzIGtleW9mIFRoZW1lQ29uZmlnPihcbiAgICBrZXk6IEtcbiAgKTogVGhlbWVDb25maWdbS10ge1xuICAgIGlmICghdGhpcy50aGVtZUNvbnRleHQpIHtcbiAgICAgIHJldHVybiBCQVNFX1RIRU1FX0NPTkZJR1trZXldO1xuICAgIH1cblxuICAgIGNvbnN0IHt0aGVtZSwgdGhlbWVPcHRpb25zfSA9IHRoaXMudGhlbWVDb250ZXh0O1xuICAgIGNvbnN0IHRoZW1lU3BlY2lmaWMgPSB0aGVtZU9wdGlvbnNbdGhlbWVdO1xuICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSB0aGVtZU9wdGlvbnMuZGVmYXVsdDtcblxuICAgIC8vIFRyeSB0aGVtZS1zcGVjaWZpYyB2YWx1ZSBmaXJzdCwgdGhlbiBkZWZhdWx0XG4gICAgY29uc3QgcmVzdWx0ID0gKHRoZW1lU3BlY2lmaWM/LltrZXldID8/XG4gICAgICBkZWZhdWx0Q29uZmlnW2tleV0pIGFzIFRoZW1lQ29uZmlnW0tdO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIENpcmNsZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhLCBjb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjY1O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ21hcmt1cExpbmVXaWR0aCcpO1xuICAgIGN0eC5zZXRMaW5lRGFzaCh0aGlzLmxpbmVEYXNoKTtcbiAgICBpZiAoa2kgPT09IEtpLldoaXRlKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRCbGFja0NvbG9yJyk7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdib2FyZExpbmVDb2xvcicpO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgfVxuICAgIGlmIChjb2xvcikgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuaW1wb3J0IHtLaX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgQ3Jvc3NNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIHNpemUgPSByYWRpdXMgKiAwLjU4O1xuICAgIH1cbiAgICBjdHgubW92ZVRvKHggLSBzaXplLCB5IC0gc2l6ZSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgc2l6ZSwgeSArIHNpemUpO1xuICAgIGN0eC5tb3ZlVG8oeCArIHNpemUsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggLSBzaXplLCB5ICsgc2l6ZSk7XG5cbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFRleHRNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCB2YWwsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3Qgc2l6ZSA9IHMgKiAwLjg7XG4gICAgbGV0IGZvbnRTaXplID0gc2l6ZSAvIDEuNTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuXG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICB9XG4gICAgLy8gZWxzZSB7XG4gICAgLy8gICBjdHguY2xlYXJSZWN0KHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICAvLyB9XG4gICAgaWYgKHZhbC50b1N0cmluZygpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZm9udFNpemUgPSBzaXplIC8gMS41O1xuICAgIH0gZWxzZSBpZiAodmFsLnRvU3RyaW5nKCkubGVuZ3RoID09PSAyKSB7XG4gICAgICBmb250U2l6ZSA9IHNpemUgLyAxLjg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvbnRTaXplID0gc2l6ZSAvIDIuMDtcbiAgICB9XG4gICAgY3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IFRhaG9tYWA7XG4gICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICBjdHguZmlsbFRleHQodmFsLnRvU3RyaW5nKCksIHgsIHkgKyAyKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5pbXBvcnQge0tpfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBTcXVhcmVNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ21hcmt1cExpbmVXaWR0aCcpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGxldCBzaXplID0gcyAqIDAuNTU7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBjdHgucmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC43NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubW92ZVRvKHgsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggLSBzaXplICogTWF0aC5jb3MoMC41MjMpLCB5ICsgc2l6ZSAqIE1hdGguc2luKDAuNTIzKSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgc2l6ZSAqIE1hdGguY29zKDAuNTIzKSwgeSArIHNpemUgKiBNYXRoLnNpbigwLjUyMykpO1xuXG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnbWFya3VwTGluZVdpZHRoJyk7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgICAgc2l6ZSA9IHJhZGl1cyAqIDAuNztcbiAgICB9XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBOb2RlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgY29sb3IsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNDtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gNDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgQWN0aXZlTm9kZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGNvbG9yLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5zZXRMaW5lRGFzaCh0aGlzLmxpbmVEYXNoKTtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplICogMC40LCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQge0tpfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBDaXJjbGVTb2xpZE1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhLCBjb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjI1O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC42NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdtYXJrdXBMaW5lV2lkdGgnKTtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBpZiAoY29sb3IpIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuaW1wb3J0IHtLaX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0TWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdtYXJrdXBMaW5lV2lkdGgnKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjY7XG4gICAgbGV0IHNpemUgPSBzICogMC40O1xuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2hpZ2hsaWdodENvbG9yJyk7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSB8fCBraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIHNpemUgPSBzICogMC4zNTtcbiAgICB9XG4gICAgY3R4LmFyYyh4LCB5LCBzaXplLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBFZmZlY3RCYXNlIHtcbiAgcHJvdGVjdGVkIGdsb2JhbEFscGhhID0gMTtcbiAgcHJvdGVjdGVkIGNvbG9yID0gJyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgc2l6ZTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge31cblxuICBwbGF5KCkge1xuICAgIC8vIEJhc2UgcGxheSBtZXRob2QgLSB0byBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzc2VzXG4gIH1cbn1cbiIsImltcG9ydCBFZmZlY3RCYXNlIGZyb20gJy4vRWZmZWN0QmFzZSc7XG5pbXBvcnQge2VuY29kZX0gZnJvbSAnanMtYmFzZTY0JztcblxuY29uc3QgYmFuU3ZnID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBjbGFzcz1cImJpIGJpLWJhblwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj5cbiAgPHBhdGggZD1cIk0xNSA4YTYuOTcgNi45NyAwIDAgMC0xLjcxLTQuNTg0bC05Ljg3NCA5Ljg3NUE3IDcgMCAwIDAgMTUgOE0yLjcxIDEyLjU4NGw5Ljg3NC05Ljg3NWE3IDcgMCAwIDAtOS44NzQgOS44NzRaTTE2IDhBOCA4IDAgMSAxIDAgOGE4IDggMCAwIDEgMTYgMFwiLz5cbjwvc3ZnPmA7XG5cbmV4cG9ydCBjbGFzcyBCYW5FZmZlY3QgZXh0ZW5kcyBFZmZlY3RCYXNlIHtcbiAgcHJpdmF0ZSBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgcHJpdmF0ZSBhbHBoYSA9IDA7XG4gIHByaXZhdGUgZmFkZUluRHVyYXRpb24gPSAyMDA7XG4gIHByaXZhdGUgZmFkZU91dER1cmF0aW9uID0gMTUwO1xuICBwcml2YXRlIHN0YXlEdXJhdGlvbiA9IDQwMDtcbiAgcHJpdmF0ZSBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICBwcml2YXRlIGlzRmFkaW5nT3V0ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgc2l6ZTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwgc2l6ZSwga2kpO1xuXG4gICAgLy8gQ29udmVydCBTVkcgc3RyaW5nIHRvIGEgZGF0YSBVUkxcbiAgICBjb25zdCBzdmdCbG9iID0gbmV3IEJsb2IoW2JhblN2Z10sIHt0eXBlOiAnaW1hZ2Uvc3ZnK3htbCd9KTtcblxuICAgIGNvbnN0IHN2Z0RhdGFVcmwgPSBgZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwke2VuY29kZShiYW5TdmcpfWA7XG5cbiAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgIHRoaXMuaW1nLnNyYyA9IHN2Z0RhdGFVcmw7XG4gIH1cblxuICBwbGF5ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5pbWcuY29tcGxldGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBpbWcsIGZhZGVJbkR1cmF0aW9uLCBmYWRlT3V0RHVyYXRpb259ID0gdGhpcztcblxuICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgaWYgKCF0aGlzLnN0YXJ0VGltZSkge1xuICAgICAgdGhpcy5zdGFydFRpbWUgPSBub3c7XG4gICAgfVxuXG4gICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5hbHBoYTtcbiAgICBjdHguZHJhd0ltYWdlKGltZywgeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XG5cbiAgICBjb25zdCBlbGFwc2VkID0gbm93IC0gdGhpcy5zdGFydFRpbWU7XG5cbiAgICBpZiAoIXRoaXMuaXNGYWRpbmdPdXQpIHtcbiAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1pbihlbGFwc2VkIC8gZmFkZUluRHVyYXRpb24sIDEpO1xuICAgICAgaWYgKGVsYXBzZWQgPj0gZmFkZUluRHVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaXNGYWRpbmdPdXQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIH0sIHRoaXMuc3RheUR1cmF0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZmFkZUVsYXBzZWQgPSBub3cgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1heCgxIC0gZmFkZUVsYXBzZWQgLyBmYWRlT3V0RHVyYXRpb24sIDApO1xuICAgICAgaWYgKGZhZGVFbGFwc2VkID49IGZhZGVPdXREdXJhdGlvbikge1xuICAgICAgICB0aGlzLmFscGhhID0gMDtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wbGF5KTtcbiAgfTtcbn1cbiIsImltcG9ydCB7Y29tcGFjdH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGNhbGNWaXNpYmxlQXJlYSxcbiAgcmV2ZXJzZU9mZnNldCxcbiAgemVyb3MsXG4gIGVtcHR5LFxuICBhMVRvUG9zLFxuICBvZmZzZXRBMU1vdmUsXG4gIGNhbk1vdmUsXG59IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB7XG4gIEExX0xFVFRFUlMsXG4gIEExX05VTUJFUlMsXG4gIERFRkFVTFRfT1BUSU9OUyxcbiAgTUFYX0JPQVJEX1NJWkUsXG4gIFRIRU1FX1JFU09VUkNFUyxcbiAgQkFTRV9USEVNRV9DT05GSUcsXG59IGZyb20gJy4vY29uc3QnO1xuaW1wb3J0IHtcbiAgQ3Vyc29yLFxuICBNYXJrdXAsXG4gIFRoZW1lLFxuICBLaSxcbiAgQW5hbHlzaXMsXG4gIEdob3N0QmFuT3B0aW9ucyxcbiAgR2hvc3RCYW5PcHRpb25zUGFyYW1zLFxuICBDZW50ZXIsXG4gIEFuYWx5c2lzUG9pbnRUaGVtZSxcbiAgRWZmZWN0LFxuICBUaGVtZU9wdGlvbnMsXG4gIFRoZW1lQ29uZmlnLFxuICBUaGVtZVByb3BlcnR5S2V5LFxuICBUaGVtZUNvbnRleHQsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQge0ltYWdlU3RvbmUsIEZsYXRTdG9uZX0gZnJvbSAnLi9zdG9uZXMnO1xuaW1wb3J0IEFuYWx5c2lzUG9pbnQgZnJvbSAnLi9zdG9uZXMvQW5hbHlzaXNQb2ludCc7XG5cbmltcG9ydCB7XG4gIENpcmNsZU1hcmt1cCxcbiAgQ3Jvc3NNYXJrdXAsXG4gIFRleHRNYXJrdXAsXG4gIFNxdWFyZU1hcmt1cCxcbiAgVHJpYW5nbGVNYXJrdXAsXG4gIE5vZGVNYXJrdXAsXG4gIEFjdGl2ZU5vZGVNYXJrdXAsXG4gIENpcmNsZVNvbGlkTWFya3VwLFxuICBIaWdobGlnaHRNYXJrdXAsXG59IGZyb20gJy4vbWFya3Vwcyc7XG5pbXBvcnQge0JhbkVmZmVjdH0gZnJvbSAnLi9lZmZlY3RzJztcblxuY29uc3QgZ2V0VGhlbWVSZXNvdXJjZXMgPSAoXG4gIHRoZW1lOiBUaGVtZSxcbiAgdGhlbWVSZXNvdXJjZXM6IGFueSxcbiAgYm9hcmRTaXplOiBudW1iZXIgPSA1MTJcbikgPT4ge1xuICBjb25zdCByZXNvdXJjZXMgPSB0aGVtZVJlc291cmNlc1t0aGVtZV07XG4gIGlmICghcmVzb3VyY2VzKSByZXR1cm4gbnVsbDtcblxuICAvLyBJZiBib2FyZCBzaXplIDwgMjU2IGFuZCBtaWNyb1JlcyBleGlzdHMsIHVzZSBtaWNyb1JlcyByZXNvdXJjZXNcbiAgaWYgKGJvYXJkU2l6ZSA8IDI1NiAmJiByZXNvdXJjZXMubWljcm9SZXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYm9hcmQ6IHJlc291cmNlcy5taWNyb1Jlcy5ib2FyZCB8fCByZXNvdXJjZXMuYm9hcmQsXG4gICAgICBibGFja3M6XG4gICAgICAgIHJlc291cmNlcy5taWNyb1Jlcy5ibGFja3M/Lmxlbmd0aCA+IDBcbiAgICAgICAgICA/IHJlc291cmNlcy5taWNyb1Jlcy5ibGFja3NcbiAgICAgICAgICA6IHJlc291cmNlcy5ibGFja3MsXG4gICAgICB3aGl0ZXM6XG4gICAgICAgIHJlc291cmNlcy5taWNyb1Jlcy53aGl0ZXM/Lmxlbmd0aCA+IDBcbiAgICAgICAgICA/IHJlc291cmNlcy5taWNyb1Jlcy53aGl0ZXNcbiAgICAgICAgICA6IHJlc291cmNlcy53aGl0ZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8vIElmIGJvYXJkIHNpemUgPCA1MTIgYW5kIGxvd1JlcyBleGlzdHMsIHVzZSBsb3dSZXMgcmVzb3VyY2VzXG4gIGlmIChib2FyZFNpemUgPCA1MTIgJiYgcmVzb3VyY2VzLmxvd1Jlcykge1xuICAgIHJldHVybiB7XG4gICAgICBib2FyZDogcmVzb3VyY2VzLmxvd1Jlcy5ib2FyZCB8fCByZXNvdXJjZXMuYm9hcmQsXG4gICAgICBibGFja3M6XG4gICAgICAgIHJlc291cmNlcy5sb3dSZXMuYmxhY2tzPy5sZW5ndGggPiAwXG4gICAgICAgICAgPyByZXNvdXJjZXMubG93UmVzLmJsYWNrc1xuICAgICAgICAgIDogcmVzb3VyY2VzLmJsYWNrcyxcbiAgICAgIHdoaXRlczpcbiAgICAgICAgcmVzb3VyY2VzLmxvd1Jlcy53aGl0ZXM/Lmxlbmd0aCA+IDBcbiAgICAgICAgICA/IHJlc291cmNlcy5sb3dSZXMud2hpdGVzXG4gICAgICAgICAgOiByZXNvdXJjZXMud2hpdGVzLFxuICAgIH07XG4gIH1cblxuICAvLyBPdGhlcndpc2UgdXNlIHJlZ3VsYXIgcmVzb3VyY2VzXG4gIHJldHVybiB7XG4gICAgYm9hcmQ6IHJlc291cmNlcy5ib2FyZCxcbiAgICBibGFja3M6IHJlc291cmNlcy5ibGFja3MsXG4gICAgd2hpdGVzOiByZXNvdXJjZXMud2hpdGVzLFxuICB9O1xufTtcblxuLy8gR2V0IGFsbCB0aGVtZSByZXNvdXJjZXMgZm9yIHByZWxvYWRpbmcgKGFsbCByZXNvbHV0aW9ucylcbmNvbnN0IGdldEFsbFRoZW1lUmVzb3VyY2VzID0gKHRoZW1lOiBUaGVtZSwgdGhlbWVSZXNvdXJjZXM6IGFueSkgPT4ge1xuICBjb25zdCByZXNvdXJjZXMgPSB0aGVtZVJlc291cmNlc1t0aGVtZV07XG4gIGlmICghcmVzb3VyY2VzKSByZXR1cm4gW107XG5cbiAgY29uc3QgYWxsSW1hZ2VzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8vIEFkZCByZWd1bGFyIHJlc29sdXRpb24gcmVzb3VyY2VzXG4gIGlmIChyZXNvdXJjZXMuYm9hcmQpIGFsbEltYWdlcy5wdXNoKHJlc291cmNlcy5ib2FyZCk7XG4gIGlmIChyZXNvdXJjZXMuYmxhY2tzKSBhbGxJbWFnZXMucHVzaCguLi5yZXNvdXJjZXMuYmxhY2tzKTtcbiAgaWYgKHJlc291cmNlcy53aGl0ZXMpIGFsbEltYWdlcy5wdXNoKC4uLnJlc291cmNlcy53aGl0ZXMpO1xuXG4gIC8vIEFkZCBsb3dSZXMgcmVzb3VyY2VzIGlmIHRoZXkgZXhpc3RcbiAgaWYgKHJlc291cmNlcy5sb3dSZXMpIHtcbiAgICBpZiAocmVzb3VyY2VzLmxvd1Jlcy5ib2FyZCkgYWxsSW1hZ2VzLnB1c2gocmVzb3VyY2VzLmxvd1Jlcy5ib2FyZCk7XG4gICAgaWYgKHJlc291cmNlcy5sb3dSZXMuYmxhY2tzKSBhbGxJbWFnZXMucHVzaCguLi5yZXNvdXJjZXMubG93UmVzLmJsYWNrcyk7XG4gICAgaWYgKHJlc291cmNlcy5sb3dSZXMud2hpdGVzKSBhbGxJbWFnZXMucHVzaCguLi5yZXNvdXJjZXMubG93UmVzLndoaXRlcyk7XG4gIH1cblxuICAvLyBBZGQgbWljcm9SZXMgcmVzb3VyY2VzIGlmIHRoZXkgZXhpc3RcbiAgaWYgKHJlc291cmNlcy5taWNyb1Jlcykge1xuICAgIGlmIChyZXNvdXJjZXMubWljcm9SZXMuYm9hcmQpIGFsbEltYWdlcy5wdXNoKHJlc291cmNlcy5taWNyb1Jlcy5ib2FyZCk7XG4gICAgaWYgKHJlc291cmNlcy5taWNyb1Jlcy5ibGFja3MpIGFsbEltYWdlcy5wdXNoKC4uLnJlc291cmNlcy5taWNyb1Jlcy5ibGFja3MpO1xuICAgIGlmIChyZXNvdXJjZXMubWljcm9SZXMud2hpdGVzKSBhbGxJbWFnZXMucHVzaCguLi5yZXNvdXJjZXMubWljcm9SZXMud2hpdGVzKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBkdXBsaWNhdGVzXG4gIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoYWxsSW1hZ2VzKSk7XG59O1xuXG5jb25zdCBpbWFnZXM6IHtcbiAgW2tleTogc3RyaW5nXTogSFRNTEltYWdlRWxlbWVudDtcbn0gPSB7fTtcblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIHNldCBoaWdoLXF1YWxpdHkgaW1hZ2Ugc21vb3RoaW5nIGZvciBjYW52YXMgY29udGV4dFxuY29uc3Qgc2V0SW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gKFxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgfCB1bmRlZmluZWRcbikgPT4ge1xuICBpZiAoY3R4KSB7XG4gICAgY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XG4gICAgY3R4LmltYWdlU21vb3RoaW5nUXVhbGl0eSA9ICdoaWdoJztcbiAgfVxufTtcblxuZnVuY3Rpb24gaXNNb2JpbGVEZXZpY2UoKSB7XG4gIHJldHVybiAvTW9iaXxBbmRyb2lkfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChcbiAgICBuYXZpZ2F0b3IudXNlckFnZW50XG4gICk7XG59XG5cbmZ1bmN0aW9uIHByZWxvYWQoXG4gIHVybHM6IHN0cmluZ1tdLFxuICBkb25lOiAoKSA9PiB2b2lkLFxuICBvbkltYWdlTG9hZGVkPzogKHVybDogc3RyaW5nKSA9PiB2b2lkXG4pIHtcbiAgbGV0IGxvYWRlZCA9IDA7XG4gIGNvbnN0IGltYWdlTG9hZGVkID0gKCkgPT4ge1xuICAgIGxvYWRlZCsrO1xuICAgIGlmIChsb2FkZWQgPT09IHVybHMubGVuZ3RoKSB7XG4gICAgICBkb25lKCk7XG4gICAgfVxuICB9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHVybHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIWltYWdlc1t1cmxzW2ldXSkge1xuICAgICAgaW1hZ2VzW3VybHNbaV1dID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWFnZXNbdXJsc1tpXV0uc3JjID0gdXJsc1tpXTtcbiAgICAgIGltYWdlc1t1cmxzW2ldXS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGltYWdlTG9hZGVkKCk7XG4gICAgICAgIC8vIENhbGxiYWNrIHdoZW4gc2luZ2xlIGltYWdlIGxvYWQgY29tcGxldGVzXG4gICAgICAgIGlmIChvbkltYWdlTG9hZGVkKSB7XG4gICAgICAgICAgb25JbWFnZUxvYWRlZCh1cmxzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGltYWdlc1t1cmxzW2ldXS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZUxvYWRlZCgpO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGltYWdlc1t1cmxzW2ldXS5jb21wbGV0ZSkge1xuICAgICAgLy8gSW1hZ2UgYWxyZWFkeSBsb2FkZWRcbiAgICAgIGltYWdlTG9hZGVkKCk7XG4gICAgfVxuICB9XG59XG5cbmxldCBkcHIgPSAxLjA7XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMS4wO1xufVxuXG5jb25zdCBERUZBVUxUX1RIRU1FX09QVElPTlM6IFRoZW1lT3B0aW9ucyA9IHtcbiAgZGVmYXVsdDogQkFTRV9USEVNRV9DT05GSUcsXG4gIFtUaGVtZS5GbGF0XToge1xuICAgIGJvYXJkQmFja2dyb3VuZENvbG9yOiAnI2U2YmI4NScsXG4gIH0sXG4gIFtUaGVtZS5XYXJtXToge1xuICAgIGJvYXJkQmFja2dyb3VuZENvbG9yOiAnI0MxOEI1MCcsXG4gIH0sXG4gIFtUaGVtZS5EYXJrXToge1xuICAgIGFjdGl2ZUNvbG9yOiAnIzlDQTNBRicsXG4gICAgaW5hY3RpdmVDb2xvcjogJyM2NjY2NjYnLFxuICAgIGJvYXJkTGluZUNvbG9yOiAnIzlDQTNBRicsXG4gICAgYm9hcmRCYWNrZ3JvdW5kQ29sb3I6ICcjMkIzMDM1JyxcbiAgfSxcbiAgW1RoZW1lLll1bnppTW9ua2V5RGFya106IHtcbiAgICBhY3RpdmVDb2xvcjogJyNBMUM5QUYnLFxuICAgIGluYWN0aXZlQ29sb3I6ICcjQTFDOUFGJyxcbiAgICBib2FyZExpbmVDb2xvcjogJyNBMUM5QUYnLFxuICAgIGZsYXRCbGFja0NvbG9yOiAnIzBFMjAxOScsXG4gICAgZmxhdEJsYWNrQ29sb3JBbHQ6ICcjMDIxRDExJyxcbiAgICBmbGF0V2hpdGVDb2xvcjogJyNBMkM4QjQnLFxuICAgIGZsYXRXaGl0ZUNvbG9yQWx0OiAnI0FGQ0JCQycsXG4gICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuMSknLFxuICAgIHN0b25lUmF0aW86IDAuNTExNSxcbiAgfSxcbiAgW1RoZW1lLkhpZ2hDb250cmFzdF06IHtcbiAgICAvLyBIaWdoIGNvbnRyYXN0IHRoZW1lLCBmcmllbmRseSBmb3IgYWxsIHR5cGVzIG9mIGNvbG9yIGJsaW5kbmVzc1xuICAgIGJvYXJkQmFja2dyb3VuZENvbG9yOiAnI0Y1RjVEQycsIC8vIEJlaWdlIGJhY2tncm91bmQsIGdlbnRsZSBvbiBleWVzXG4gICAgYm9hcmRMaW5lQ29sb3I6ICcjMkY0RjRGJywgLy8gRGFyayBzbGF0ZSBncmF5IGxpbmVzIGZvciBoaWdoIGNvbnRyYXN0XG4gICAgYWN0aXZlQ29sb3I6ICcjMkY0RjRGJyxcbiAgICBpbmFjdGl2ZUNvbG9yOiAnIzgwODA4MCcsXG5cbiAgICAvLyBTdG9uZSBjb2xvcnM6IHRyYWRpdGlvbmFsIGJsYWNrIGFuZCB3aGl0ZSBmb3IgbWF4aW11bSBjb250cmFzdCBhbmQgY29sb3IgYmxpbmQgZnJpZW5kbGluZXNzXG4gICAgZmxhdEJsYWNrQ29sb3I6ICcjMDAwMDAwJywgLy8gUHVyZSBibGFjayAtIHVuaXZlcnNhbGx5IGFjY2Vzc2libGVcbiAgICBmbGF0QmxhY2tDb2xvckFsdDogJyMxQTFBMUEnLCAvLyBWZXJ5IGRhcmsgZ3JheSB2YXJpYW50XG4gICAgZmxhdFdoaXRlQ29sb3I6ICcjRkZGRkZGJywgLy8gUHVyZSB3aGl0ZSAtIG1heGltdW0gY29udHJhc3Qgd2l0aCBibGFja1xuICAgIGZsYXRXaGl0ZUNvbG9yQWx0OiAnI0Y4RjhGOCcsIC8vIFZlcnkgbGlnaHQgZ3JheSB2YXJpYW50XG5cbiAgICAvLyBOb2RlIGFuZCBtYXJrdXAgY29sb3JzIC0gdXNpbmcgY29sb3JibGluZC1mcmllbmRseSBjb2xvcnMgdGhhdCBhdm9pZCByZWQtZ3JlZW4gY29tYmluYXRpb25zXG4gICAgcG9zaXRpdmVOb2RlQ29sb3I6ICcjMDI4NEM3JywgLy8gQmx1ZSAocG9zaXRpdmUpIC0gc2FmZSBmb3IgYWxsIGNvbG9yIGJsaW5kbmVzcyB0eXBlc1xuICAgIG5lZ2F0aXZlTm9kZUNvbG9yOiAnI0VBNTgwQycsIC8vIE9yYW5nZSAobmVnYXRpdmUpIC0gZGlzdGluZ3Vpc2hhYmxlIGZyb20gYmx1ZSBmb3IgYWxsIHVzZXJzXG4gICAgbmV1dHJhbE5vZGVDb2xvcjogJyM3QzJEMTInLCAvLyBCcm93biAobmV1dHJhbCkgLSBhbHRlcm5hdGl2ZSB0byBwcm9ibGVtYXRpYyBjb2xvcnNcbiAgICBkZWZhdWx0Tm9kZUNvbG9yOiAnIzRCNTU2MycsIC8vIERhcmsgZ3JheVxuICAgIHdhcm5pbmdOb2RlQ29sb3I6ICcjRkJCRjI0JywgLy8gQnJpZ2h0IHllbGxvdyB3YXJuaW5nXG5cbiAgICAvLyBIaWdobGlnaHQgYW5kIHNoYWRvd1xuICAgIGhpZ2hsaWdodENvbG9yOiAnI0ZERTA0NycsIC8vIEJyaWdodCB5ZWxsb3cgaGlnaGxpZ2h0XG4gICAgc2hhZG93Q29sb3I6ICcjMzc0MTUxJywgLy8gRGFyayBncmF5IHNoYWRvd1xuICB9LFxufTtcblxuZXhwb3J0IGNsYXNzIEdob3N0QmFuIHtcbiAgZGVmYXVsdE9wdGlvbnM6IEdob3N0QmFuT3B0aW9ucyA9IHtcbiAgICBib2FyZFNpemU6IDE5LFxuICAgIGR5bmFtaWNQYWRkaW5nOiBmYWxzZSxcbiAgICBwYWRkaW5nOiAxMCxcbiAgICBleHRlbnQ6IDMsXG4gICAgaW50ZXJhY3RpdmU6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGU6IHRydWUsXG4gICAgdGhlbWU6IFRoZW1lLkJsYWNrQW5kV2hpdGUsXG4gICAgYW5hbHlzaXNQb2ludFRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCxcbiAgICBiYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICBzaG93QW5hbHlzaXM6IGZhbHNlLFxuICAgIGFkYXB0aXZlQm9hcmRMaW5lOiB0cnVlLFxuICAgIHRoZW1lT3B0aW9uczogREVGQVVMVF9USEVNRV9PUFRJT05TLFxuICAgIHRoZW1lUmVzb3VyY2VzOiBUSEVNRV9SRVNPVVJDRVMsXG4gICAgbW92ZVNvdW5kOiBmYWxzZSxcbiAgICBhZGFwdGl2ZVN0YXJTaXplOiB0cnVlLFxuICAgIG1vYmlsZUluZGljYXRvck9mZnNldDogMCxcbiAgfTtcbiAgb3B0aW9uczogR2hvc3RCYW5PcHRpb25zO1xuICBkb206IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuICBjYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgYm9hcmQ/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgYW5hbHlzaXNDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgY3Vyc29yQ2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIG1hcmt1cENhbnZhcz86IEhUTUxDYW52YXNFbGVtZW50O1xuICBlZmZlY3RDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgbW92ZVNvdW5kQXVkaW8/OiBIVE1MQXVkaW9FbGVtZW50O1xuICB0dXJuOiBLaTtcbiAgcHJpdmF0ZSBjdXJzb3I6IEN1cnNvciA9IEN1cnNvci5Ob25lO1xuICBwcml2YXRlIGN1cnNvclZhbHVlOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSB0b3VjaE1vdmluZyA9IGZhbHNlO1xuICBwcml2YXRlIHRvdWNoU3RhcnRQb2ludDogRE9NUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgcHVibGljIGN1cnNvclBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdO1xuICBwdWJsaWMgYWN0dWFsQ3Vyc29yUG9zaXRpb246IFtudW1iZXIsIG51bWJlcl07XG4gIHB1YmxpYyBjdXJzb3JQb2ludDogRE9NUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgcHVibGljIGFjdHVhbEN1cnNvclBvaW50OiBET01Qb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICBwdWJsaWMgbWF0OiBudW1iZXJbXVtdO1xuICBwdWJsaWMgbWFya3VwOiBzdHJpbmdbXVtdO1xuICBwdWJsaWMgdmlzaWJsZUFyZWFNYXQ6IG51bWJlcltdW10gfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBwcmV2ZW50TW92ZU1hdDogbnVtYmVyW11bXTtcbiAgcHVibGljIGVmZmVjdE1hdDogc3RyaW5nW11bXTtcbiAgbWF4aHY6IG51bWJlcjtcbiAgdHJhbnNNYXQ6IERPTU1hdHJpeDtcbiAgYW5hbHlzaXM6IEFuYWx5c2lzIHwgbnVsbDtcbiAgdmlzaWJsZUFyZWE6IG51bWJlcltdW107XG4gIG5vZGVNYXJrdXBTdHlsZXM6IHtcbiAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICBjb2xvcjogc3RyaW5nO1xuICAgICAgbGluZURhc2g6IG51bWJlcltdO1xuICAgIH07XG4gIH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBHaG9zdEJhbk9wdGlvbnNQYXJhbXMgPSB7fSkge1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMuZGVmYXVsdE9wdGlvbnMsXG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgdGhlbWVPcHRpb25zOiB7XG4gICAgICAgIC4uLnRoaXMuZGVmYXVsdE9wdGlvbnMudGhlbWVPcHRpb25zLFxuICAgICAgICAuLi4ob3B0aW9ucy50aGVtZU9wdGlvbnMgfHwge30pLFxuICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplO1xuICAgIHRoaXMubWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLnByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLm1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy5lZmZlY3RNYXQgPSBlbXB0eShbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMudHVybiA9IEtpLkJsYWNrO1xuICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBbLTEsIC0xXTtcbiAgICB0aGlzLmFjdHVhbEN1cnNvclBvc2l0aW9uID0gWy0xLCAtMV07XG4gICAgdGhpcy5tYXhodiA9IHNpemU7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICB0aGlzLmFuYWx5c2lzID0gbnVsbDtcbiAgICB0aGlzLnZpc2libGVBcmVhID0gW1xuICAgICAgWzAsIHNpemUgLSAxXSxcbiAgICAgIFswLCBzaXplIC0gMV0sXG4gICAgXTtcblxuICAgIHRoaXMudXBkYXRlTm9kZU1hcmt1cFN0eWxlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUaGVtZVByb3BlcnR5PFQgZXh0ZW5kcyBrZXlvZiBUaGVtZUNvbmZpZz4oXG4gICAgcHJvcGVydHlLZXk6IFRcbiAgKTogVGhlbWVDb25maWdbVF07XG4gIHByaXZhdGUgZ2V0VGhlbWVQcm9wZXJ0eShwcm9wZXJ0eUtleTogVGhlbWVQcm9wZXJ0eUtleSk6IHN0cmluZyB8IG51bWJlcjtcbiAgcHJpdmF0ZSBnZXRUaGVtZVByb3BlcnR5PFQgZXh0ZW5kcyBrZXlvZiBUaGVtZUNvbmZpZz4oXG4gICAgcHJvcGVydHlLZXk6IFQgfCBUaGVtZVByb3BlcnR5S2V5XG4gICk6IFRoZW1lQ29uZmlnW1RdIHwgc3RyaW5nIHwgbnVtYmVyIHtcbiAgICBjb25zdCBrZXkgPVxuICAgICAgdHlwZW9mIHByb3BlcnR5S2V5ID09PSAnc3RyaW5nJyA/IHByb3BlcnR5S2V5IDogKHByb3BlcnR5S2V5IGFzIHN0cmluZyk7XG4gICAgY29uc3QgY3VycmVudFRoZW1lID0gdGhpcy5vcHRpb25zLnRoZW1lO1xuICAgIGNvbnN0IHRoZW1lQ29uZmlnID0gdGhpcy5vcHRpb25zLnRoZW1lT3B0aW9uc1tjdXJyZW50VGhlbWVdIHx8IHt9O1xuICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSB0aGlzLm9wdGlvbnMudGhlbWVPcHRpb25zLmRlZmF1bHQgfHwge307XG5cbiAgICBjb25zdCByZXN1bHQgPSAodGhlbWVDb25maWdba2V5IGFzIGtleW9mIFRoZW1lQ29uZmlnXSB8fFxuICAgICAgZGVmYXVsdENvbmZpZ1trZXkgYXMga2V5b2YgVGhlbWVDb25maWddKSBhcyBUaGVtZUNvbmZpZ1tUXTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZW1lIGNvbnRleHQgZm9yIG1hcmt1cCBjb21wb25lbnRzXG4gICAqL1xuICBwcml2YXRlIGNyZWF0ZVRoZW1lQ29udGV4dCgpOiBUaGVtZUNvbnRleHQge1xuICAgIHJldHVybiB7XG4gICAgICB0aGVtZTogdGhpcy5vcHRpb25zLnRoZW1lLFxuICAgICAgdGhlbWVPcHRpb25zOiB0aGlzLm9wdGlvbnMudGhlbWVPcHRpb25zLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU5vZGVNYXJrdXBTdHlsZXMoKSB7XG4gICAgY29uc3QgZGVmYXVsdERhc2hlZExpbmVEYXNoID0gWzgsIDZdO1xuICAgIGNvbnN0IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCA9IFs0LCA0XTtcblxuICAgIHRoaXMubm9kZU1hcmt1cFN0eWxlcyA9IHtcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuUG9zaXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuRGVmYXVsdE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuV2FybmluZ05vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlRGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlRGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5lZ2F0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxEYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0RGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkRlZmF1bHROb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0Rhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5XYXJuaW5nTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlRG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlRG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5lZ2F0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxEb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0RG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkRlZmF1bHROb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0RvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5XYXJuaW5nTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmVnYXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0QWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkRlZmF1bHROb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lldhcm5pbmdOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZURhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5Qb3NpdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZURhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsRGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdERhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5EZWZhdWx0Tm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdEYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuV2FybmluZ05vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZURvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5Qb3NpdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZURvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsRG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdERvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5EZWZhdWx0Tm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdEb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuV2FybmluZ05vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBzZXRUdXJuKHR1cm46IEtpKSB7XG4gICAgdGhpcy50dXJuID0gdHVybjtcbiAgfVxuXG4gIHNldEJvYXJkU2l6ZShzaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLm9wdGlvbnMuYm9hcmRTaXplID0gTWF0aC5taW4oc2l6ZSwgTUFYX0JPQVJEX1NJWkUpO1xuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLmNhbnZhcyB8fFxuICAgICAgIXRoaXMuY3Vyc29yQ2FudmFzIHx8XG4gICAgICAhdGhpcy5kb20gfHxcbiAgICAgICF0aGlzLmJvYXJkIHx8XG4gICAgICAhdGhpcy5tYXJrdXBDYW52YXMgfHxcbiAgICAgICF0aGlzLmFuYWx5c2lzQ2FudmFzIHx8XG4gICAgICAhdGhpcy5lZmZlY3RDYW52YXNcbiAgICApXG4gICAgICByZXR1cm47XG5cbiAgICBjb25zdCBjYW52YXNlcyA9IFtcbiAgICAgIHRoaXMuYm9hcmQsXG4gICAgICB0aGlzLmNhbnZhcyxcbiAgICAgIHRoaXMubWFya3VwQ2FudmFzLFxuICAgICAgdGhpcy5jdXJzb3JDYW52YXMsXG4gICAgICB0aGlzLmFuYWx5c2lzQ2FudmFzLFxuICAgICAgdGhpcy5lZmZlY3RDYW52YXMsXG4gICAgXTtcblxuICAgIGNvbnN0IHtzaXplfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCB7Y2xpZW50V2lkdGh9ID0gdGhpcy5kb207XG5cbiAgICBjYW52YXNlcy5mb3JFYWNoKGNhbnZhcyA9PiB7XG4gICAgICBpZiAoc2l6ZSkge1xuICAgICAgICBjYW52YXMud2lkdGggPSBzaXplICogZHByO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gc2l6ZSAqIGRwcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IGNsaWVudFdpZHRoICsgJ3B4JztcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGNsaWVudFdpZHRoICsgJ3B4JztcbiAgICAgICAgY2FudmFzLndpZHRoID0gTWF0aC5mbG9vcihjbGllbnRXaWR0aCAqIGRwcik7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBNYXRoLmZsb29yKGNsaWVudFdpZHRoICogZHByKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNhbnZhcyhpZDogc3RyaW5nLCBwb2ludGVyRXZlbnRzID0gdHJ1ZSk6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGNhbnZhcy5pZCA9IGlkO1xuICAgIGlmICghcG9pbnRlckV2ZW50cykge1xuICAgICAgY2FudmFzLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgfVxuICAgIHJldHVybiBjYW52YXM7XG4gIH1cblxuICBpbml0KGRvbTogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBzaXplID0gdGhpcy5vcHRpb25zLmJvYXJkU2l6ZTtcbiAgICB0aGlzLm1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy5tYXJrdXAgPSBlbXB0eShbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMudHJhbnNNYXQgPSBuZXcgRE9NTWF0cml4KCk7XG5cbiAgICB0aGlzLmJvYXJkID0gdGhpcy5jcmVhdGVDYW52YXMoJ2dob3N0YmFuLWJvYXJkJyk7XG4gICAgdGhpcy5jYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tY2FudmFzJyk7XG4gICAgdGhpcy5tYXJrdXBDYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tbWFya3VwJywgZmFsc2UpO1xuICAgIHRoaXMuY3Vyc29yQ2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXMoJ2dob3N0YmFuLWN1cnNvcicpO1xuICAgIHRoaXMuYW5hbHlzaXNDYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tYW5hbHlzaXMnLCBmYWxzZSk7XG4gICAgdGhpcy5lZmZlY3RDYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tZWZmZWN0JywgZmFsc2UpO1xuXG4gICAgdGhpcy5kb20gPSBkb207XG4gICAgZG9tLmlubmVySFRNTCA9ICcnO1xuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmJvYXJkKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLm1hcmt1cENhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuYW5hbHlzaXNDYW52YXMpO1xuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmN1cnNvckNhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuZWZmZWN0Q2FudmFzKTtcblxuICAgIHRoaXMucmVzaXplKCk7XG4gICAgdGhpcy5yZW5kZXJJbnRlcmFjdGl2ZSgpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0T3B0aW9ucyhvcHRpb25zOiBHaG9zdEJhbk9wdGlvbnNQYXJhbXMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgdGhlbWVPcHRpb25zOiB7XG4gICAgICAgIC4uLnRoaXMub3B0aW9ucy50aGVtZU9wdGlvbnMsXG4gICAgICAgIC4uLihvcHRpb25zLnRoZW1lT3B0aW9ucyB8fCB7fSksXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVOb2RlTWFya3VwU3R5bGVzKCk7XG4gICAgdGhpcy5yZW5kZXJJbnRlcmFjdGl2ZSgpO1xuICB9XG5cbiAgc2V0TWF0KG1hdDogbnVtYmVyW11bXSkge1xuICAgIHRoaXMubWF0ID0gbWF0O1xuICAgIGlmICghdGhpcy52aXNpYmxlQXJlYU1hdCkge1xuICAgICAgdGhpcy52aXNpYmxlQXJlYU1hdCA9IG1hdDtcbiAgICB9XG4gIH1cblxuICBzZXRWaXNpYmxlQXJlYU1hdChtYXQ6IG51bWJlcltdW10pIHtcbiAgICB0aGlzLnZpc2libGVBcmVhTWF0ID0gbWF0O1xuICB9XG5cbiAgc2V0UHJldmVudE1vdmVNYXQobWF0OiBudW1iZXJbXVtdKSB7XG4gICAgdGhpcy5wcmV2ZW50TW92ZU1hdCA9IG1hdDtcbiAgfVxuXG4gIHNldEVmZmVjdE1hdChtYXQ6IHN0cmluZ1tdW10pIHtcbiAgICB0aGlzLmVmZmVjdE1hdCA9IG1hdDtcbiAgfVxuXG4gIHNldE1hcmt1cChtYXJrdXA6IHN0cmluZ1tdW10pIHtcbiAgICB0aGlzLm1hcmt1cCA9IG1hcmt1cDtcbiAgfVxuXG4gIHNldEN1cnNvcihjdXJzb3I6IEN1cnNvciwgdmFsdWUgPSAnJykge1xuICAgIHRoaXMuY3Vyc29yID0gY3Vyc29yO1xuICAgIHRoaXMuY3Vyc29yVmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldEN1cnNvcldpdGhSZW5kZXIgPSAoZG9tUG9pbnQ6IERPTVBvaW50LCBvZmZzZXRZID0gMCkgPT4ge1xuICAgIGNvbnN0IHtwYWRkaW5nfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCB7c3BhY2V9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLnRyYW5zTWF0LmludmVyc2UoKS50cmFuc2Zvcm1Qb2ludChkb21Qb2ludCk7XG4gICAgY29uc3QgaWR4ID0gTWF0aC5yb3VuZCgocG9pbnQueCAtIHBhZGRpbmcgKyBzcGFjZSAvIDIpIC8gc3BhY2UpO1xuICAgIGNvbnN0IGlkeSA9IE1hdGgucm91bmQoKHBvaW50LnkgLSBwYWRkaW5nICsgc3BhY2UgLyAyKSAvIHNwYWNlKSArIG9mZnNldFk7XG4gICAgY29uc3QgeHggPSBpZHggKiBzcGFjZTtcbiAgICBjb25zdCB5eSA9IGlkeSAqIHNwYWNlO1xuICAgIGNvbnN0IHBvaW50T25DYW52YXMgPSBuZXcgRE9NUG9pbnQoeHgsIHl5KTtcbiAgICBjb25zdCBwID0gdGhpcy50cmFuc01hdC50cmFuc2Zvcm1Qb2ludChwb2ludE9uQ2FudmFzKTtcbiAgICB0aGlzLmFjdHVhbEN1cnNvclBvaW50ID0gcDtcbiAgICB0aGlzLmFjdHVhbEN1cnNvclBvc2l0aW9uID0gW2lkeCAtIDEsIGlkeSAtIDFdO1xuXG4gICAgaWYgKHRoaXMucHJldmVudE1vdmVNYXQ/LltpZHggLSAxXT8uW2lkeSAtIDFdID09PSAxKSB7XG4gICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gWy0xLCAtMV07XG4gICAgICB0aGlzLmN1cnNvclBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gICAgICB0aGlzLmRyYXdDdXJzb3IoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnNvclBvaW50ID0gcDtcbiAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gW2lkeCAtIDEsIGlkeSAtIDFdO1xuICAgIHRoaXMuZHJhd0N1cnNvcigpO1xuXG4gICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHRoaXMuZHJhd0JvYXJkKCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBvbk1vdXNlTW92ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBwb2ludCA9IG5ldyBET01Qb2ludChlLm9mZnNldFggKiBkcHIsIGUub2Zmc2V0WSAqIGRwcik7XG4gICAgdGhpcy5zZXRDdXJzb3JXaXRoUmVuZGVyKHBvaW50KTtcbiAgfTtcblxuICBwcml2YXRlIGNhbGNUb3VjaFBvaW50ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBsZXQgcG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuIHBvaW50O1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdG91Y2hlcyA9IGUuY2hhbmdlZFRvdWNoZXM7XG4gICAgcG9pbnQgPSBuZXcgRE9NUG9pbnQoXG4gICAgICAodG91Y2hlc1swXS5jbGllbnRYIC0gcmVjdC5sZWZ0KSAqIGRwcixcbiAgICAgICh0b3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcCkgKiBkcHJcbiAgICApO1xuICAgIHJldHVybiBwb2ludDtcbiAgfTtcblxuICBwcml2YXRlIG9uVG91Y2hTdGFydCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnRvdWNoTW92aW5nID0gdHJ1ZTtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMuY2FsY1RvdWNoUG9pbnQoZSk7XG4gICAgdGhpcy50b3VjaFN0YXJ0UG9pbnQgPSBwb2ludDtcbiAgICB0aGlzLnNldEN1cnNvcldpdGhSZW5kZXIocG9pbnQpO1xuICB9O1xuXG4gIHByaXZhdGUgb25Ub3VjaE1vdmUgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy50b3VjaE1vdmluZyA9IHRydWU7XG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLmNhbGNUb3VjaFBvaW50KGUpO1xuICAgIGxldCBvZmZzZXQgPSAwO1xuICAgIGxldCBkaXN0YW5jZSA9IDEwO1xuICAgIGlmIChcbiAgICAgIE1hdGguYWJzKHBvaW50LnggLSB0aGlzLnRvdWNoU3RhcnRQb2ludC54KSA+IGRpc3RhbmNlIHx8XG4gICAgICBNYXRoLmFicyhwb2ludC55IC0gdGhpcy50b3VjaFN0YXJ0UG9pbnQueSkgPiBkaXN0YW5jZVxuICAgICkge1xuICAgICAgb2Zmc2V0ID0gdGhpcy5vcHRpb25zLm1vYmlsZUluZGljYXRvck9mZnNldDtcbiAgICB9XG4gICAgdGhpcy5zZXRDdXJzb3JXaXRoUmVuZGVyKHBvaW50LCBvZmZzZXQpO1xuICB9O1xuXG4gIHByaXZhdGUgb25Ub3VjaEVuZCA9ICgpID0+IHtcbiAgICB0aGlzLnRvdWNoTW92aW5nID0gZmFsc2U7XG4gIH07XG5cbiAgcmVuZGVySW50ZXJhY3RpdmUoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQpO1xuICAgIH1cbiAgfVxuXG4gIHNldEFuYWx5c2lzKGFuYWx5c2lzOiBBbmFseXNpcyB8IG51bGwpIHtcbiAgICB0aGlzLmFuYWx5c2lzID0gYW5hbHlzaXM7XG4gICAgaWYgKCFhbmFseXNpcykge1xuICAgICAgdGhpcy5jbGVhckFuYWx5c2lzQ2FudmFzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0FuYWx5c2lzKSB0aGlzLmRyYXdBbmFseXNpcyhhbmFseXNpcyk7XG4gIH1cblxuICBzZXRUaGVtZSh0aGVtZTogVGhlbWUsIG9wdGlvbnM6IFBhcnRpYWw8R2hvc3RCYW5PcHRpb25zUGFyYW1zPiA9IHt9KSB7XG4gICAgY29uc3Qge3RoZW1lUmVzb3VyY2VzfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAoIXRoZW1lUmVzb3VyY2VzW3RoZW1lXSkgcmV0dXJuO1xuXG4gICAgLy8gR2V0IGFsbCB0aGVtZSByZXNvdXJjZXMgZm9yIHByZWxvYWRpbmcgKGFsbCByZXNvbHV0aW9ucylcbiAgICBjb25zdCBhbGxUaGVtZUltYWdlcyA9IGdldEFsbFRoZW1lUmVzb3VyY2VzKHRoZW1lLCB0aGVtZVJlc291cmNlcyk7XG5cbiAgICB0aGlzLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgICB0aGVtZSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB0aGVtZU9wdGlvbnM6IHtcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLnRoZW1lT3B0aW9ucyxcbiAgICAgICAgLi4uKG9wdGlvbnMudGhlbWVPcHRpb25zIHx8IHt9KSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZU5vZGVNYXJrdXBTdHlsZXMoKTtcblxuICAgIC8vIFJlZHJhdyBjYWxsYmFjayBhZnRlciBpbWFnZSBsb2FkaW5nIGNvbXBsZXRlc1xuICAgIGNvbnN0IG9uSW1hZ2VMb2FkZWQgPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuZHJhd0JvYXJkKCk7XG4gICAgICB0aGlzLmRyYXdTdG9uZXMoKTtcbiAgICB9O1xuXG4gICAgLy8gUHJlbG9hZCBhbGwgdGhlbWUgcmVzb3VyY2VzIChhbGwgcmVzb2x1dGlvbnMpXG4gICAgcHJlbG9hZChcbiAgICAgIGFsbFRoZW1lSW1hZ2VzLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9uSW1hZ2VMb2FkZWRcbiAgICApO1xuXG4gICAgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgY2FsY0NlbnRlciA9ICgpOiBDZW50ZXIgPT4ge1xuICAgIGNvbnN0IHt2aXNpYmxlQXJlYX0gPSB0aGlzO1xuICAgIGNvbnN0IHtib2FyZFNpemV9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKFxuICAgICAgKHZpc2libGVBcmVhWzBdWzBdID09PSAwICYmIHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgKHZpc2libGVBcmVhWzFdWzBdID09PSAwICYmIHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKVxuICAgICkge1xuICAgICAgcmV0dXJuIENlbnRlci5DZW50ZXI7XG4gICAgfVxuXG4gICAgaWYgKHZpc2libGVBcmVhWzBdWzBdID09PSAwKSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wTGVmdDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbUxlZnQ7XG4gICAgICBlbHNlIHJldHVybiBDZW50ZXIuTGVmdDtcbiAgICB9IGVsc2UgaWYgKHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxKSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wUmlnaHQ7XG4gICAgICBlbHNlIGlmICh2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSkgcmV0dXJuIENlbnRlci5Cb3R0b21SaWdodDtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5SaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZpc2libGVBcmVhWzFdWzBdID09PSAwKSByZXR1cm4gQ2VudGVyLlRvcDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbTtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5DZW50ZXI7XG4gICAgfVxuICB9O1xuXG4gIGNhbGNEeW5hbWljUGFkZGluZyh2aXNpYmxlQXJlYVNpemU6IG51bWJlcikge1xuICAgIGNvbnN0IHtjb29yZGluYXRlfSA9IHRoaXMub3B0aW9ucztcblxuICAgIGNvbnN0IHtjYW52YXN9ID0gdGhpcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IHBhZGRpbmcgPSBjYW52YXMud2lkdGggLyAodmlzaWJsZUFyZWFTaXplICsgMikgLyAyO1xuICAgIGNvbnN0IHBhZGRpbmdXaXRob3V0Q29vcmRpbmF0ZSA9IGNhbnZhcy53aWR0aCAvICh2aXNpYmxlQXJlYVNpemUgKyAyKSAvIDQ7XG5cbiAgICB0aGlzLm9wdGlvbnMucGFkZGluZyA9IGNvb3JkaW5hdGUgPyBwYWRkaW5nIDogcGFkZGluZ1dpdGhvdXRDb29yZGluYXRlO1xuICB9XG5cbiAgem9vbUJvYXJkKHpvb20gPSBmYWxzZSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNhbnZhcyxcbiAgICAgIGFuYWx5c2lzQ2FudmFzLFxuICAgICAgYm9hcmQsXG4gICAgICBjdXJzb3JDYW52YXMsXG4gICAgICBtYXJrdXBDYW52YXMsXG4gICAgICBlZmZlY3RDYW52YXMsXG4gICAgfSA9IHRoaXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcbiAgICBjb25zdCB7Ym9hcmRTaXplLCBleHRlbnQsIHBhZGRpbmcsIGR5bmFtaWNQYWRkaW5nfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCBib2FyZExpbmVFeHRlbnQgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICBUaGVtZVByb3BlcnR5S2V5LkJvYXJkTGluZUV4dGVudFxuICAgICk7XG4gICAgY29uc3Qgem9vbWVkVmlzaWJsZUFyZWEgPSBjYWxjVmlzaWJsZUFyZWEoXG4gICAgICB0aGlzLnZpc2libGVBcmVhTWF0LFxuICAgICAgZXh0ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBib2FyZEN0eCA9IGJvYXJkPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGN1cnNvckN0eCA9IGN1cnNvckNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBtYXJrdXBDdHggPSBtYXJrdXBDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgYW5hbHlzaXNDdHggPSBhbmFseXNpc0NhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBlZmZlY3RDdHggPSBlZmZlY3RDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgdmlzaWJsZUFyZWEgPSB6b29tXG4gICAgICA/IHpvb21lZFZpc2libGVBcmVhXG4gICAgICA6IFtcbiAgICAgICAgICBbMCwgYm9hcmRTaXplIC0gMV0sXG4gICAgICAgICAgWzAsIGJvYXJkU2l6ZSAtIDFdLFxuICAgICAgICBdO1xuXG4gICAgdGhpcy52aXNpYmxlQXJlYSA9IHZpc2libGVBcmVhO1xuICAgIGNvbnN0IHZpc2libGVBcmVhU2l6ZSA9IE1hdGgubWF4KFxuICAgICAgdmlzaWJsZUFyZWFbMF1bMV0gLSB2aXNpYmxlQXJlYVswXVswXSxcbiAgICAgIHZpc2libGVBcmVhWzFdWzFdIC0gdmlzaWJsZUFyZWFbMV1bMF1cbiAgICApO1xuXG4gICAgaWYgKGR5bmFtaWNQYWRkaW5nKSB7XG4gICAgICB0aGlzLmNhbGNEeW5hbWljUGFkZGluZyh2aXNpYmxlQXJlYVNpemUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMucGFkZGluZyA9IERFRkFVTFRfT1BUSU9OUy5wYWRkaW5nO1xuICAgIH1cblxuICAgIGlmICh6b29tKSB7XG4gICAgICBjb25zdCB7c3BhY2V9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmNhbGNDZW50ZXIoKTtcblxuICAgICAgaWYgKGR5bmFtaWNQYWRkaW5nKSB7XG4gICAgICAgIHRoaXMuY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnMucGFkZGluZyA9IERFRkFVTFRfT1BUSU9OUy5wYWRkaW5nO1xuICAgICAgfVxuXG4gICAgICBsZXQgZXh0cmFWaXNpYmxlU2l6ZSA9IGJvYXJkTGluZUV4dGVudCAqIDIgKyAxO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdFxuICAgICAgKSB7XG4gICAgICAgIGV4dHJhVmlzaWJsZVNpemUgPSBib2FyZExpbmVFeHRlbnQgKyAwLjU7XG4gICAgICB9XG4gICAgICBsZXQgem9vbWVkQm9hcmRTaXplID0gdmlzaWJsZUFyZWFTaXplICsgZXh0cmFWaXNpYmxlU2l6ZTtcblxuICAgICAgaWYgKHpvb21lZEJvYXJkU2l6ZSA8IGJvYXJkU2l6ZSkge1xuICAgICAgICBsZXQgc2NhbGUgPSAoY2FudmFzLndpZHRoIC0gcGFkZGluZyAqIDIpIC8gKHpvb21lZEJvYXJkU2l6ZSAqIHNwYWNlKTtcblxuICAgICAgICBsZXQgb2Zmc2V0WCA9XG4gICAgICAgICAgdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZSAqIHNjYWxlICtcbiAgICAgICAgICBwYWRkaW5nICogc2NhbGUgLVxuICAgICAgICAgIHBhZGRpbmcgLVxuICAgICAgICAgIChzcGFjZSAqIGV4dHJhVmlzaWJsZVNpemUgKiBzY2FsZSkgLyAyICtcbiAgICAgICAgICAoc3BhY2UgKiBzY2FsZSkgLyAyO1xuXG4gICAgICAgIGxldCBvZmZzZXRZID1cbiAgICAgICAgICB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlICogc2NhbGUgK1xuICAgICAgICAgIHBhZGRpbmcgKiBzY2FsZSAtXG4gICAgICAgICAgcGFkZGluZyAtXG4gICAgICAgICAgKHNwYWNlICogZXh0cmFWaXNpYmxlU2l6ZSAqIHNjYWxlKSAvIDIgK1xuICAgICAgICAgIChzcGFjZSAqIHNjYWxlKSAvIDI7XG5cbiAgICAgICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICAgICAgdGhpcy50cmFuc01hdC50cmFuc2xhdGVTZWxmKC1vZmZzZXRYLCAtb2Zmc2V0WSk7XG4gICAgICAgIHRoaXMudHJhbnNNYXQuc2NhbGVTZWxmKHNjYWxlLCBzY2FsZSk7XG4gICAgICAgIGN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBib2FyZEN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBhbmFseXNpc0N0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBjdXJzb3JDdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgICAgbWFya3VwQ3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIGVmZmVjdEN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXNldFRyYW5zZm9ybSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgfVxuICB9XG5cbiAgY2FsY0JvYXJkVmlzaWJsZUFyZWEoem9vbSA9IGZhbHNlKSB7XG4gICAgdGhpcy56b29tQm9hcmQodGhpcy5vcHRpb25zLnpvb20pO1xuICB9XG5cbiAgcmVzZXRUcmFuc2Zvcm0oKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2FudmFzLFxuICAgICAgYW5hbHlzaXNDYW52YXMsXG4gICAgICBib2FyZCxcbiAgICAgIGN1cnNvckNhbnZhcyxcbiAgICAgIG1hcmt1cENhbnZhcyxcbiAgICAgIGVmZmVjdENhbnZhcyxcbiAgICB9ID0gdGhpcztcbiAgICBjb25zdCBjdHggPSBjYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgYm9hcmRDdHggPSBib2FyZD8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBjdXJzb3JDdHggPSBjdXJzb3JDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgbWFya3VwQ3R4ID0gbWFya3VwQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGFuYWx5c2lzQ3R4ID0gYW5hbHlzaXNDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgZWZmZWN0Q3R4ID0gZWZmZWN0Q2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMudHJhbnNNYXQgPSBuZXcgRE9NTWF0cml4KCk7XG4gICAgY3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGJvYXJkQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGFuYWx5c2lzQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGN1cnNvckN0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICBtYXJrdXBDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgZWZmZWN0Q3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXR9ID0gdGhpcztcbiAgICBpZiAodGhpcy5tYXQgJiYgbWF0WzBdKSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplID0gbWF0WzBdLmxlbmd0aDtcblxuICAgIHRoaXMuem9vbUJvYXJkKHRoaXMub3B0aW9ucy56b29tKTtcbiAgICB0aGlzLnpvb21Cb2FyZCh0aGlzLm9wdGlvbnMuem9vbSk7XG4gICAgdGhpcy5jbGVhckFsbENhbnZhcygpO1xuICAgIHRoaXMuZHJhd0JvYXJkKCk7XG4gICAgdGhpcy5kcmF3U3RvbmVzKCk7XG4gICAgdGhpcy5kcmF3TWFya3VwKCk7XG4gICAgdGhpcy5kcmF3Q3Vyc29yKCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93QW5hbHlzaXMpIHRoaXMuZHJhd0FuYWx5c2lzKCk7XG4gIH1cblxuICByZW5kZXJJbk9uZUNhbnZhcyhjYW52YXMgPSB0aGlzLmNhbnZhcykge1xuICAgIHRoaXMuY2xlYXJBbGxDYW52YXMoKTtcbiAgICB0aGlzLmRyYXdCb2FyZChjYW52YXMsIGZhbHNlKTtcbiAgICB0aGlzLmRyYXdTdG9uZXModGhpcy5tYXQsIGNhbnZhcywgZmFsc2UpO1xuICAgIHRoaXMuZHJhd01hcmt1cCh0aGlzLm1hdCwgdGhpcy5tYXJrdXAsIGNhbnZhcywgZmFsc2UpO1xuICB9XG5cbiAgY2xlYXJBbGxDYW52YXMgPSAoKSA9PiB7XG4gICAgdGhpcy5jbGVhckNhbnZhcyh0aGlzLmJvYXJkKTtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XG4gICAgdGhpcy5jbGVhckNhbnZhcyh0aGlzLm1hcmt1cENhbnZhcyk7XG4gICAgdGhpcy5jbGVhckNhbnZhcyh0aGlzLmVmZmVjdENhbnZhcyk7XG4gICAgdGhpcy5jbGVhckN1cnNvckNhbnZhcygpO1xuICAgIHRoaXMuY2xlYXJBbmFseXNpc0NhbnZhcygpO1xuICB9O1xuXG4gIGNsZWFyQm9hcmQgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmJvYXJkKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gdGhpcy5ib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhckNhbnZhcyA9IChjYW52YXMgPSB0aGlzLmNhbnZhcykgPT4ge1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhck1hcmt1cENhbnZhcyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMubWFya3VwQ2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gdGhpcy5tYXJrdXBDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5tYXJrdXBDYW52YXMud2lkdGgsIHRoaXMubWFya3VwQ2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhckN1cnNvckNhbnZhcyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuY3Vyc29yQ2FudmFzKSByZXR1cm47XG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMub3B0aW9ucy5ib2FyZFNpemU7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdXJzb3JDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jdXJzb3JDYW52YXMud2lkdGgsIHRoaXMuY3Vyc29yQ2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhckFuYWx5c2lzQ2FudmFzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5hbmFseXNpc0NhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuYW5hbHlzaXNDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRoaXMuYW5hbHlzaXNDYW52YXMud2lkdGgsXG4gICAgICAgIHRoaXMuYW5hbHlzaXNDYW52YXMuaGVpZ2h0XG4gICAgICApO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH07XG5cbiAgZHJhd0FuYWx5c2lzID0gKGFuYWx5c2lzID0gdGhpcy5hbmFseXNpcykgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuYW5hbHlzaXNDYW52YXM7XG4gICAgY29uc3Qge1xuICAgICAgdGhlbWUgPSBUaGVtZS5CbGFja0FuZFdoaXRlLFxuICAgICAgYW5hbHlzaXNQb2ludFRoZW1lLFxuICAgICAgYm9hcmRTaXplLFxuICAgICAgZm9yY2VBbmFseXNpc0JvYXJkU2l6ZSxcbiAgICB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHttYXQsIG1hcmt1cH0gPSB0aGlzO1xuICAgIGlmICghY2FudmFzIHx8ICFhbmFseXNpcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmICghY3R4KSByZXR1cm47XG4gICAgdGhpcy5jbGVhckFuYWx5c2lzQ2FudmFzKCk7XG4gICAgY29uc3Qge3Jvb3RJbmZvfSA9IGFuYWx5c2lzO1xuXG4gICAgYW5hbHlzaXMubW92ZUluZm9zLmZvckVhY2gobSA9PiB7XG4gICAgICBpZiAobS5tb3ZlID09PSAncGFzcycpIHJldHVybjtcbiAgICAgIGNvbnN0IGlkT2JqID0gSlNPTi5wYXJzZShhbmFseXNpcy5pZCk7XG4gICAgICBsZXQgYW5hbHlzaXNCb2FyZFNpemUgPSBib2FyZFNpemU7XG4gICAgICBjb25zdCBvZmZzZXRlZE1vdmUgPSBvZmZzZXRBMU1vdmUoXG4gICAgICAgIG0ubW92ZSxcbiAgICAgICAgMCxcbiAgICAgICAgYW5hbHlzaXNCb2FyZFNpemUgLSBpZE9iai5ieVxuICAgICAgKTtcbiAgICAgIGxldCB7eDogaSwgeTogan0gPSBhMVRvUG9zKG9mZnNldGVkTW92ZSk7XG4gICAgICBpZiAobWF0W2ldW2pdICE9PSAwKSByZXR1cm47XG4gICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgY29uc3QgcmF0aW8gPSAwLjQ2O1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGlmIChcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLlN1YmR1ZWQgJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLkZsYXQgJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLldhcm0gJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLkRhcmtcbiAgICAgICkge1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDMwO1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDMwO1xuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5TaGFkb3dDb2xvcik7XG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gODtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAwO1xuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSAnI2ZmZic7XG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcbiAgICAgIH1cblxuICAgICAgbGV0IG91dGxpbmVDb2xvcjtcbiAgICAgIGlmIChtYXJrdXBbaV1bal0uaW5jbHVkZXMoTWFya3VwLlBvc2l0aXZlTm9kZSkpIHtcbiAgICAgICAgb3V0bGluZUNvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFxuICAgICAgICAgIFRoZW1lUHJvcGVydHlLZXkuUG9zaXRpdmVOb2RlQ29sb3JcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1hcmt1cFtpXVtqXS5pbmNsdWRlcyhNYXJrdXAuTmVnYXRpdmVOb2RlKSkge1xuICAgICAgICBvdXRsaW5lQ29sb3IgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICAgICAgVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAobWFya3VwW2ldW2pdLmluY2x1ZGVzKE1hcmt1cC5OZXV0cmFsTm9kZSkpIHtcbiAgICAgICAgb3V0bGluZUNvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBvaW50ID0gbmV3IEFuYWx5c2lzUG9pbnQoXG4gICAgICAgIGN0eCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgc3BhY2UgKiByYXRpbyxcbiAgICAgICAgcm9vdEluZm8sXG4gICAgICAgIG0sXG4gICAgICAgIGFuYWx5c2lzUG9pbnRUaGVtZSxcbiAgICAgICAgb3V0bGluZUNvbG9yXG4gICAgICApO1xuICAgICAgcG9pbnQuZHJhdygpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9KTtcbiAgfTtcblxuICBkcmF3TWFya3VwID0gKFxuICAgIG1hdCA9IHRoaXMubWF0LFxuICAgIG1hcmt1cCA9IHRoaXMubWFya3VwLFxuICAgIG1hcmt1cENhbnZhcyA9IHRoaXMubWFya3VwQ2FudmFzLFxuICAgIGNsZWFyID0gdHJ1ZVxuICApID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBtYXJrdXBDYW52YXM7XG4gICAgY29uc3Qge3RoZW1lfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoY2FudmFzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3VwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWFya3VwW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gbWFya3VwW2ldW2pdO1xuICAgICAgICAgIHZhbHVlcz8uc3BsaXQoJ3wnKS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgICAgICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3QgeSA9IHNjYWxlZFBhZGRpbmcgKyBqICogc3BhY2U7XG4gICAgICAgICAgICAgIGNvbnN0IGtpID0gbWF0W2ldW2pdO1xuICAgICAgICAgICAgICBsZXQgbWFya3VwO1xuICAgICAgICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuQ2lyY2xlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBDaXJjbGVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuQ3VycmVudDoge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgQ2lyY2xlU29saWRNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEYXNoZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEYXNoZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0FjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0RGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHREb3R0ZWRBY3RpdmVOb2RlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7Y29sb3IsIGxpbmVEYXNofSA9IHRoaXMubm9kZU1hcmt1cFN0eWxlc1t2YWx1ZV07XG5cbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IEFjdGl2ZU5vZGVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpLFxuICAgICAgICAgICAgICAgICAgICAgIE1hcmt1cC5DaXJjbGVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwLnNldExpbmVEYXNoKGxpbmVEYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZURhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZURvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZWdhdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZWdhdGl2ZURhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZWdhdGl2ZURvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxEYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbERvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdEYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0RvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0Tm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHREYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdERvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Ob2RlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7Y29sb3IsIGxpbmVEYXNofSA9IHRoaXMubm9kZU1hcmt1cFN0eWxlc1t2YWx1ZV07XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBOb2RlTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgICBNYXJrdXAuQ2lyY2xlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRMaW5lRGFzaChsaW5lRGFzaCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuU3F1YXJlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBTcXVhcmVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuVHJpYW5nbGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IFRyaWFuZ2xlTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkNyb3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBDcm9zc01hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5IaWdobGlnaHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IEhpZ2hsaWdodE1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgVGV4dE1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1hcmt1cD8uZHJhdygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZHJhd0JvYXJkID0gKGJvYXJkID0gdGhpcy5ib2FyZCwgY2xlYXIgPSB0cnVlKSA9PiB7XG4gICAgaWYgKGNsZWFyKSB0aGlzLmNsZWFyQ2FudmFzKGJvYXJkKTtcbiAgICB0aGlzLmRyYXdCYW4oYm9hcmQpO1xuICAgIHRoaXMuZHJhd0JvYXJkTGluZShib2FyZCk7XG4gICAgdGhpcy5kcmF3U3RhcnMoYm9hcmQpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29vcmRpbmF0ZSkge1xuICAgICAgdGhpcy5kcmF3Q29vcmRpbmF0ZSgpO1xuICAgIH1cbiAgfTtcblxuICBkcmF3QmFuID0gKGJvYXJkID0gdGhpcy5ib2FyZCkgPT4ge1xuICAgIGNvbnN0IHt0aGVtZSwgdGhlbWVSZXNvdXJjZXMsIHBhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgIGlmIChib2FyZCkge1xuICAgICAgYm9hcmQuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzJweCc7XG4gICAgICBjb25zdCBjdHggPSBib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgaWYgKGN0eCkge1xuICAgICAgICBzZXRJbWFnZVNtb290aGluZ1F1YWxpdHkoY3R4KTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5CbGFja0FuZFdoaXRlIHx8XG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkZsYXQgfHxcbiAgICAgICAgICB0aGVtZSA9PT0gVGhlbWUuV2FybSB8fFxuICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5EYXJrIHx8XG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkhpZ2hDb250cmFzdFxuICAgICAgICApIHtcbiAgICAgICAgICBib2FyZC5zdHlsZS5ib3hTaGFkb3cgPVxuICAgICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgPyAnMHB4IDBweCAwcHggIzAwMDAwMCcgOiAnJztcblxuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICAgICAgICBUaGVtZVByb3BlcnR5S2V5LkJvYXJkQmFja2dyb3VuZENvbG9yXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBjdHguZmlsbFJlY3QoXG4gICAgICAgICAgLy8gICAtcGFkZGluZyxcbiAgICAgICAgICAvLyAgIC1wYWRkaW5nLFxuICAgICAgICAgIC8vICAgYm9hcmQud2lkdGggKyBwYWRkaW5nLFxuICAgICAgICAgIC8vICAgYm9hcmQuaGVpZ2h0ICsgcGFkZGluZ1xuICAgICAgICAgIC8vICk7XG4gICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIGJvYXJkLndpZHRoLCBib2FyZC5oZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGJvYXJkUGl4ZWxTaXplID0gYm9hcmQud2lkdGg7XG4gICAgICAgICAgY29uc3QgcmVzb3VyY2VzID0gZ2V0VGhlbWVSZXNvdXJjZXMoXG4gICAgICAgICAgICB0aGVtZSxcbiAgICAgICAgICAgIHRoZW1lUmVzb3VyY2VzLFxuICAgICAgICAgICAgYm9hcmRQaXhlbFNpemVcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChyZXNvdXJjZXMgJiYgcmVzb3VyY2VzLmJvYXJkKSB7XG4gICAgICAgICAgICBjb25zdCBib2FyZFVybCA9IHJlc291cmNlcy5ib2FyZDtcbiAgICAgICAgICAgIGNvbnN0IGJvYXJkUmVzID0gaW1hZ2VzW2JvYXJkVXJsXTtcbiAgICAgICAgICAgIGlmIChib2FyZFJlcykge1xuICAgICAgICAgICAgICBpZiAodGhlbWUgPT09IFRoZW1lLldhbG51dCB8fCB0aGVtZSA9PT0gVGhlbWUuWXVuemlNb25rZXlEYXJrKSB7XG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShib2FyZFJlcywgMCwgMCwgYm9hcmQud2lkdGgsIGJvYXJkLmhlaWdodCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0dGVybiA9IGN0eC5jcmVhdGVQYXR0ZXJuKGJvYXJkUmVzLCAncmVwZWF0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBwYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIGJvYXJkLndpZHRoLCBib2FyZC5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3Qm9hcmRMaW5lID0gKGJvYXJkID0gdGhpcy5ib2FyZCkgPT4ge1xuICAgIGlmICghYm9hcmQpIHJldHVybjtcbiAgICBjb25zdCB7dmlzaWJsZUFyZWEsIG9wdGlvbnMsIG1hdCwgcHJldmVudE1vdmVNYXQsIGN1cnNvclBvc2l0aW9ufSA9IHRoaXM7XG4gICAgY29uc3Qge3pvb20sIGJvYXJkU2l6ZSwgYWRhcHRpdmVCb2FyZExpbmUsIHRoZW1lfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgYm9hcmRMaW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICBUaGVtZVByb3BlcnR5S2V5LkJvYXJkTGluZVdpZHRoXG4gICAgKTtcbiAgICBjb25zdCBib2FyZEVkZ2VMaW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICBUaGVtZVByb3BlcnR5S2V5LkJvYXJkRWRnZUxpbmVXaWR0aFxuICAgICk7XG4gICAgY29uc3QgYm9hcmRMaW5lRXh0ZW50ID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFxuICAgICAgVGhlbWVQcm9wZXJ0eUtleS5Cb2FyZExpbmVFeHRlbnRcbiAgICApO1xuICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuXG4gICAgICBjb25zdCBleHRlbmRTcGFjZSA9IHpvb20gPyBib2FyZExpbmVFeHRlbnQgKiBzcGFjZSA6IDA7XG4gICAgICBsZXQgYWN0aXZlQ29sb3IgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5BY3RpdmVDb2xvcik7XG4gICAgICBsZXQgaW5hY3RpdmVDb2xvciA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkluYWN0aXZlQ29sb3IpO1xuXG4gICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuQm9hcmRMaW5lQ29sb3IpO1xuXG4gICAgICBjb25zdCBhZGFwdGl2ZUZhY3RvciA9IDAuMDAxO1xuICAgICAgY29uc3QgdG91Y2hpbmdGYWN0b3IgPSAyLjU7XG4gICAgICBsZXQgZWRnZUxpbmVXaWR0aCA9IGFkYXB0aXZlQm9hcmRMaW5lXG4gICAgICAgID8gYm9hcmQud2lkdGggKiBhZGFwdGl2ZUZhY3RvciAqIDJcbiAgICAgICAgOiBib2FyZEVkZ2VMaW5lV2lkdGg7XG5cbiAgICAgIGxldCBsaW5lV2lkdGggPSBhZGFwdGl2ZUJvYXJkTGluZVxuICAgICAgICA/IGJvYXJkLndpZHRoICogYWRhcHRpdmVGYWN0b3JcbiAgICAgICAgOiBib2FyZExpbmVXaWR0aDtcblxuICAgICAgY29uc3QgYWxsb3dNb3ZlID1cbiAgICAgICAgY2FuTW92ZShtYXQsIGN1cnNvclBvc2l0aW9uWzBdLCBjdXJzb3JQb3NpdGlvblsxXSwgdGhpcy50dXJuKSAmJlxuICAgICAgICBwcmV2ZW50TW92ZU1hdFtjdXJzb3JQb3NpdGlvblswXV1bY3Vyc29yUG9zaXRpb25bMV1dID09PSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gdmlzaWJsZUFyZWFbMF1bMF07IGkgPD0gdmlzaWJsZUFyZWFbMF1bMV07IGkrKykge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiYgaSA9PT0gMCkgfHxcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEgJiYgaSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGVkZ2VMaW5lV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNNb2JpbGVEZXZpY2UoKSAmJlxuICAgICAgICAgIGkgPT09IHRoaXMuY3Vyc29yUG9zaXRpb25bMF0gJiZcbiAgICAgICAgICB0aGlzLnRvdWNoTW92aW5nXG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBjdHgubGluZVdpZHRoICogdG91Y2hpbmdGYWN0b3I7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYWxsb3dNb3ZlID8gYWN0aXZlQ29sb3IgOiBpbmFjdGl2ZUNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGFjdGl2ZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdGFydFBvaW50WSA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNjYWxlZFBhZGRpbmcgKyB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlIC0gZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzFdWzBdICogc3BhY2U7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgc3RhcnRQb2ludFkgKz0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kUG9pbnRZID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc3BhY2UgKiB2aXNpYmxlQXJlYVsxXVsxXSArIHNjYWxlZFBhZGRpbmcgKyBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzcGFjZSAqIHZpc2libGVBcmVhWzFdWzFdICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICBlbmRQb2ludFkgLT0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPiAwKSBzdGFydFBvaW50WSAtPSBleHRlbmRTcGFjZTtcbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzFdWzFdIDwgYm9hcmRTaXplIC0gMSkgZW5kUG9pbnRZICs9IGV4dGVuZFNwYWNlO1xuICAgICAgICBjdHgubW92ZVRvKGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcsIHN0YXJ0UG9pbnRZKTtcbiAgICAgICAgY3R4LmxpbmVUbyhpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nLCBlbmRQb2ludFkpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSB2aXNpYmxlQXJlYVsxXVswXTsgaSA8PSB2aXNpYmxlQXJlYVsxXVsxXTsgaSsrKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCAmJiBpID09PSAwKSB8fFxuICAgICAgICAgICh2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSAmJiBpID09PSBib2FyZFNpemUgLSAxKVxuICAgICAgICApIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gZWRnZUxpbmVXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc01vYmlsZURldmljZSgpICYmXG4gICAgICAgICAgaSA9PT0gdGhpcy5jdXJzb3JQb3NpdGlvblsxXSAmJlxuICAgICAgICAgIHRoaXMudG91Y2hNb3ZpbmdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGN0eC5saW5lV2lkdGggKiB0b3VjaGluZ0ZhY3RvcjtcbiAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBhbGxvd01vdmUgPyBhY3RpdmVDb2xvciA6IGluYWN0aXZlQ29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYWN0aXZlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0YXJ0UG9pbnRYID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzBdWzBdICogc3BhY2UgLSBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzY2FsZWRQYWRkaW5nICsgdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZTtcbiAgICAgICAgbGV0IGVuZFBvaW50WCA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNwYWNlICogdmlzaWJsZUFyZWFbMF1bMV0gKyBzY2FsZWRQYWRkaW5nICsgZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc3BhY2UgKiB2aXNpYmxlQXJlYVswXVsxXSArIHNjYWxlZFBhZGRpbmc7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgc3RhcnRQb2ludFggKz0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgIGVuZFBvaW50WCAtPSBkcHIgLyAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzBdWzBdID4gMCkgc3RhcnRQb2ludFggLT0gZXh0ZW5kU3BhY2U7XG4gICAgICAgIGlmICh2aXNpYmxlQXJlYVswXVsxXSA8IGJvYXJkU2l6ZSAtIDEpIGVuZFBvaW50WCArPSBleHRlbmRTcGFjZTtcbiAgICAgICAgY3R4Lm1vdmVUbyhzdGFydFBvaW50WCwgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyk7XG4gICAgICAgIGN0eC5saW5lVG8oZW5kUG9pbnRYLCBpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3U3RhcnMgPSAoYm9hcmQgPSB0aGlzLmJvYXJkKSA9PiB7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYm9hcmRTaXplICE9PSAxOSkgcmV0dXJuO1xuXG4gICAgbGV0IHthZGFwdGl2ZVN0YXJTaXplfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCBzdGFyU2l6ZU9wdGlvbnMgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5TdGFyU2l6ZSk7XG5cbiAgICBjb25zdCB2aXNpYmxlQXJlYSA9IHRoaXMudmlzaWJsZUFyZWE7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBsZXQgc3RhclNpemUgPSBhZGFwdGl2ZVN0YXJTaXplID8gYm9hcmQud2lkdGggKiAwLjAwMzUgOiBzdGFyU2l6ZU9wdGlvbnM7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgWzMsIDksIDE1XS5mb3JFYWNoKGkgPT4ge1xuICAgICAgICBbMywgOSwgMTVdLmZvckVhY2goaiA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaSA+PSB2aXNpYmxlQXJlYVswXVswXSAmJlxuICAgICAgICAgICAgaSA8PSB2aXNpYmxlQXJlYVswXVsxXSAmJlxuICAgICAgICAgICAgaiA+PSB2aXNpYmxlQXJlYVsxXVswXSAmJlxuICAgICAgICAgICAgaiA8PSB2aXNpYmxlQXJlYVsxXVsxXVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmFyYyhcbiAgICAgICAgICAgICAgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyxcbiAgICAgICAgICAgICAgaiAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyxcbiAgICAgICAgICAgICAgc3RhclNpemUsXG4gICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgIDIgKiBNYXRoLlBJLFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBkcmF3Q29vcmRpbmF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7Ym9hcmQsIG9wdGlvbnMsIHZpc2libGVBcmVhfSA9IHRoaXM7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGNvbnN0IHtib2FyZFNpemUsIHpvb20sIHBhZGRpbmcsIHRoZW1lfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgYm9hcmRMaW5lRXh0ZW50ID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdib2FyZExpbmVFeHRlbnQnKTtcbiAgICBsZXQgem9vbWVkQm9hcmRTaXplID0gdmlzaWJsZUFyZWFbMF1bMV0gLSB2aXNpYmxlQXJlYVswXVswXSArIDE7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcblxuICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke3NwYWNlIC8gM31weCBIZWx2ZXRpY2FgO1xuXG4gICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmNhbGNDZW50ZXIoKTtcbiAgICAgIGxldCBvZmZzZXQgPSBzcGFjZSAvIDEuNTtcblxuICAgICAgaWYgKFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5DZW50ZXIgJiZcbiAgICAgICAgdmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiZcbiAgICAgICAgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICkge1xuICAgICAgICBvZmZzZXQgLT0gc2NhbGVkUGFkZGluZyAvIDI7XG4gICAgICB9XG5cbiAgICAgIEExX0xFVFRFUlMuZm9yRWFjaCgobCwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgeCA9IHNwYWNlICogaW5kZXggKyBzY2FsZWRQYWRkaW5nO1xuICAgICAgICBsZXQgb2Zmc2V0VG9wID0gb2Zmc2V0O1xuICAgICAgICBsZXQgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0O1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wXG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldFRvcCAtPSBzcGFjZSAqIGJvYXJkTGluZUV4dGVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tXG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldEJvdHRvbSAtPSAoc3BhY2UgKiBib2FyZExpbmVFeHRlbnQpIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeTEgPSB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlICsgcGFkZGluZyAtIG9mZnNldFRvcDtcbiAgICAgICAgbGV0IHkyID0geTEgKyB6b29tZWRCb2FyZFNpemUgKiBzcGFjZSArIG9mZnNldEJvdHRvbSAqIDI7XG4gICAgICAgIGlmIChpbmRleCA+PSB2aXNpYmxlQXJlYVswXVswXSAmJiBpbmRleCA8PSB2aXNpYmxlQXJlYVswXVsxXSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbVJpZ2h0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLCB4LCB5MSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wTGVmdCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGwsIHgsIHkyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBBMV9OVU1CRVJTLnNsaWNlKC10aGlzLm9wdGlvbnMuYm9hcmRTaXplKS5mb3JFYWNoKChsOiBudW1iZXIsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHkgPSBzcGFjZSAqIGluZGV4ICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgbGV0IG9mZnNldExlZnQgPSBvZmZzZXQ7XG4gICAgICAgIGxldCBvZmZzZXRSaWdodCA9IG9mZnNldDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICBvZmZzZXRMZWZ0IC09IHNwYWNlICogYm9hcmRMaW5lRXh0ZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuUmlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2Zmc2V0UmlnaHQgLT0gKHNwYWNlICogYm9hcmRMaW5lRXh0ZW50KSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHgxID0gdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZSArIHBhZGRpbmcgLSBvZmZzZXRMZWZ0O1xuICAgICAgICBsZXQgeDIgPSB4MSArIHpvb21lZEJvYXJkU2l6ZSAqIHNwYWNlICsgMiAqIG9mZnNldFJpZ2h0O1xuICAgICAgICBpZiAoaW5kZXggPj0gdmlzaWJsZUFyZWFbMV1bMF0gJiYgaW5kZXggPD0gdmlzaWJsZUFyZWFbMV1bMV0pIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BSaWdodCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuQm90dG9tUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlJpZ2h0XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobC50b1N0cmluZygpLCB4MSwgeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkxlZnRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLnRvU3RyaW5nKCksIHgyLCB5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBjYWxjU3BhY2VBbmRQYWRkaW5nID0gKGNhbnZhcyA9IHRoaXMuY2FudmFzKSA9PiB7XG4gICAgbGV0IHNwYWNlID0gMDtcbiAgICBsZXQgc2NhbGVkUGFkZGluZyA9IDA7XG4gICAgbGV0IHNjYWxlZEJvYXJkRXh0ZW50ID0gMDtcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBjb25zdCB7cGFkZGluZywgYm9hcmRTaXplLCB6b29tfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGJvYXJkTGluZUV4dGVudCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lRXh0ZW50Jyk7XG4gICAgICBjb25zdCB7dmlzaWJsZUFyZWF9ID0gdGhpcztcblxuICAgICAgaWYgKFxuICAgICAgICAodmlzaWJsZUFyZWFbMF1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICh2aXNpYmxlQXJlYVsxXVswXSAhPT0gMCAmJiB2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICkge1xuICAgICAgICBzY2FsZWRCb2FyZEV4dGVudCA9IGJvYXJkTGluZUV4dGVudDtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgKHZpc2libGVBcmVhWzBdWzBdICE9PSAwICYmIHZpc2libGVBcmVhWzBdWzFdICE9PSBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAodmlzaWJsZUFyZWFbMV1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gIT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgICApIHtcbiAgICAgICAgc2NhbGVkQm9hcmRFeHRlbnQgPSBib2FyZExpbmVFeHRlbnQgKiAyO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkaXZpc29yID0gem9vbSA/IGJvYXJkU2l6ZSArIHNjYWxlZEJvYXJkRXh0ZW50IDogYm9hcmRTaXplO1xuICAgICAgc3BhY2UgPSAoY2FudmFzLndpZHRoIC0gcGFkZGluZyAqIDIpIC8gTWF0aC5jZWlsKGRpdmlzb3IpO1xuICAgICAgc2NhbGVkUGFkZGluZyA9IHBhZGRpbmcgKyBzcGFjZSAvIDI7XG4gICAgfVxuICAgIHJldHVybiB7c3BhY2UsIHNjYWxlZFBhZGRpbmcsIHNjYWxlZEJvYXJkRXh0ZW50fTtcbiAgfTtcblxuICBwbGF5RWZmZWN0ID0gKG1hdCA9IHRoaXMubWF0LCBlZmZlY3RNYXQgPSB0aGlzLmVmZmVjdE1hdCwgY2xlYXIgPSB0cnVlKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5lZmZlY3RDYW52YXM7XG5cbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoY2FudmFzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWZmZWN0TWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZWZmZWN0TWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBlZmZlY3RNYXRbaV1bal07XG4gICAgICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgICAgIGNvbnN0IGtpID0gbWF0W2ldW2pdO1xuICAgICAgICAgIGxldCBlZmZlY3Q7XG4gICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGNhc2UgRWZmZWN0LkJhbjoge1xuICAgICAgICAgICAgICAgIGVmZmVjdCA9IG5ldyBCYW5FZmZlY3QoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgICAgICAgIGVmZmVjdC5wbGF5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVmZmVjdE1hdFtpXVtqXSA9IEVmZmVjdC5Ob25lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qge2JvYXJkU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLnNldEVmZmVjdE1hdChlbXB0eShbYm9hcmRTaXplLCBib2FyZFNpemVdKSk7XG4gICAgfVxuICB9O1xuXG4gIGRyYXdDdXJzb3IgPSAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgdGhpcy5jbGVhckN1cnNvckNhbnZhcygpO1xuICAgICAgaWYgKHRoaXMuY3Vyc29yID09PSBDdXJzb3IuTm9uZSkgcmV0dXJuO1xuICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkgJiYgIXRoaXMudG91Y2hNb3ZpbmcpIHJldHVybjtcblxuICAgICAgY29uc3Qge3BhZGRpbmcsIHRoZW1lfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY29uc3Qge3NwYWNlfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgY29uc3Qge3Zpc2libGVBcmVhLCBjdXJzb3IsIGN1cnNvclZhbHVlfSA9IHRoaXM7XG5cbiAgICAgIGNvbnN0IFtpZHgsIGlkeV0gPSB0aGlzLmN1cnNvclBvc2l0aW9uO1xuICAgICAgaWYgKGlkeCA8IHZpc2libGVBcmVhWzBdWzBdIHx8IGlkeCA+IHZpc2libGVBcmVhWzBdWzFdKSByZXR1cm47XG4gICAgICBpZiAoaWR5IDwgdmlzaWJsZUFyZWFbMV1bMF0gfHwgaWR5ID4gdmlzaWJsZUFyZWFbMV1bMV0pIHJldHVybjtcbiAgICAgIGNvbnN0IHggPSBpZHggKiBzcGFjZSArIHNwYWNlIC8gMiArIHBhZGRpbmc7XG4gICAgICBjb25zdCB5ID0gaWR5ICogc3BhY2UgKyBzcGFjZSAvIDIgKyBwYWRkaW5nO1xuICAgICAgY29uc3Qga2kgPSB0aGlzLm1hdD8uW2lkeF0/LltpZHldIHx8IEtpLkVtcHR5O1xuXG4gICAgICBpZiAoY3R4KSB7XG4gICAgICAgIGxldCBjdXI7XG4gICAgICAgIGNvbnN0IHNpemUgPSBzcGFjZSAqIDAuODtcbiAgICAgICAgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLkNpcmNsZSkge1xuICAgICAgICAgIGN1ciA9IG5ldyBDaXJjbGVNYXJrdXAoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAga2ksXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5TcXVhcmUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgU3F1YXJlTWFya3VwKFxuICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHksXG4gICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuVHJpYW5nbGUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgVHJpYW5nbGVNYXJrdXAoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAga2ksXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5Dcm9zcykge1xuICAgICAgICAgIGN1ciA9IG5ldyBDcm9zc01hcmt1cChcbiAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5LFxuICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICBraSxcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICApO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLlRleHQpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgVGV4dE1hcmt1cChcbiAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5LFxuICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICBraSxcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCksXG4gICAgICAgICAgICBjdXJzb3JWYWx1ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkVtcHR5ICYmIGN1cnNvciA9PT0gQ3Vyc29yLkJsYWNrU3RvbmUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgRmxhdFN0b25lKGN0eCwgeCwgeSwgS2kuQmxhY2ssIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCkpO1xuICAgICAgICAgIGN1ci5zZXRTaXplKHNpemUpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5FbXB0eSAmJiBjdXJzb3IgPT09IEN1cnNvci5XaGl0ZVN0b25lKSB7XG4gICAgICAgICAgY3VyID0gbmV3IEZsYXRTdG9uZShjdHgsIHgsIHksIEtpLldoaXRlLCB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpKTtcbiAgICAgICAgICBjdXIuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC41KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5DbGVhcikge1xuICAgICAgICAgIGN1ciA9IG5ldyBGbGF0U3RvbmUoY3R4LCB4LCB5LCBLaS5FbXB0eSwgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKSk7XG4gICAgICAgICAgY3VyLnNldFNpemUoc2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VyPy5kcmF3KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRyYXdTdG9uZXMgPSAoXG4gICAgbWF0OiBudW1iZXJbXVtdID0gdGhpcy5tYXQsXG4gICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgY2xlYXIgPSB0cnVlXG4gICkgPT4ge1xuICAgIGNvbnN0IHt0aGVtZSA9IFRoZW1lLkJsYWNrQW5kV2hpdGUsIHRoZW1lUmVzb3VyY2VzfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoKTtcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICAgIHNldEltYWdlU21vb3RoaW5nUXVhbGl0eShjdHgpO1xuICAgICAgICAgICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICAgICAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgICAgICAgICBjb25zdCB5ID0gc2NhbGVkUGFkZGluZyArIGogKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ3N0b25lUmF0aW8nKTtcbiAgICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5TdWJkdWVkICYmXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRmxhdCAmJlxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5XYXJtICYmXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLkRhcmsgJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuSGlnaENvbnRyYXN0XG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMztcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDM7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdzaGFkb3dDb2xvcicpO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gODtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDA7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAwO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgc3RvbmU7XG5cbiAgICAgICAgICAgICAgc3dpdGNoICh0aGVtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgVGhlbWUuQmxhY2tBbmRXaGl0ZTpcbiAgICAgICAgICAgICAgICBjYXNlIFRoZW1lLkZsYXQ6XG4gICAgICAgICAgICAgICAgY2FzZSBUaGVtZS5XYXJtOlxuICAgICAgICAgICAgICAgIGNhc2UgVGhlbWUuSGlnaENvbnRyYXN0OiB7XG4gICAgICAgICAgICAgICAgICBzdG9uZSA9IG5ldyBGbGF0U3RvbmUoXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBzdG9uZS5zZXRTaXplKHNwYWNlICogcmF0aW8gKiAyKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFRoZW1lLkRhcms6IHtcbiAgICAgICAgICAgICAgICAgIHN0b25lID0gbmV3IEZsYXRTdG9uZShcbiAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIHN0b25lLnNldFNpemUoc3BhY2UgKiByYXRpbyAqIDIpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGJvYXJkUGl4ZWxTaXplID0gY2FudmFzPy53aWR0aCB8fCA1MTI7XG4gICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZXMgPSBnZXRUaGVtZVJlc291cmNlcyhcbiAgICAgICAgICAgICAgICAgICAgdGhlbWUsXG4gICAgICAgICAgICAgICAgICAgIHRoZW1lUmVzb3VyY2VzLFxuICAgICAgICAgICAgICAgICAgICBib2FyZFBpeGVsU2l6ZVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxhY2tzID0gcmVzb3VyY2VzLmJsYWNrcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgKGk6IHN0cmluZykgPT4gaW1hZ2VzW2ldXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHdoaXRlcyA9IHJlc291cmNlcy53aGl0ZXMubWFwKFxuICAgICAgICAgICAgICAgICAgICAgIChpOiBzdHJpbmcpID0+IGltYWdlc1tpXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2QgPSBpICsgMTAgKyBqO1xuICAgICAgICAgICAgICAgICAgICBzdG9uZSA9IG5ldyBJbWFnZVN0b25lKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgbW9kLFxuICAgICAgICAgICAgICAgICAgICAgIGJsYWNrcyxcbiAgICAgICAgICAgICAgICAgICAgICB3aGl0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBzdG9uZS5zZXRTaXplKHNwYWNlICogcmF0aW8gKiAyKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RvbmU/LmRyYXcoKTtcbiAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiX19zcHJlYWRBcnJheSIsIl9fcmVhZCIsIl9fdmFsdWVzIiwiZmlsdGVyIiwiZmluZExhc3RJbmRleCIsIlRoZW1lUHJvcGVydHlLZXkiLCJLaSIsIlRoZW1lIiwiQW5hbHlzaXNQb2ludFRoZW1lIiwiQ2VudGVyIiwiRWZmZWN0IiwiTWFya3VwIiwiQ3Vyc29yIiwiUHJvYmxlbUFuc3dlclR5cGUiLCJQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kiLCJfYSIsIl9fZXh0ZW5kcyIsImNsb25lRGVlcCIsInJlcGxhY2UiLCJjb21wYWN0IiwiZmxhdHRlbkRlcHRoIiwic3VtIiwiY2xvbmUiLCJzYW1wbGUiLCJlbmNvZGUiLCJfX2Fzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUc7QUFDSCxTQUFTLFNBQVMsQ0FBSSxZQUEyQixFQUFFLEdBQVEsRUFBQTtBQUN6RCxJQUFBLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDdkIsSUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7QUFDWixRQUFBLElBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4QyxRQUFBLElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQyxRQUFBLE9BQU8sS0FBSyxDQUNWLFlBQVksRUFDWixTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxFQUNsQyxTQUFTLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUNwQyxDQUFDO0tBQ0g7U0FBTTtBQUNMLFFBQUEsT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDcEI7QUFDSCxDQUFDO0FBRUQ7Ozs7Ozs7QUFPRztBQUNILFNBQVMsS0FBSyxDQUFJLFlBQTJCLEVBQUUsSUFBUyxFQUFFLElBQVMsRUFBQTtJQUNqRSxJQUFNLE1BQU0sR0FBUSxFQUFFLENB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QixJQUFBLFVBQVUsR0FBRztJQUN4QixHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0VBQ0g7QUFDVyxJQUFBLGlCQUFpQixHQUFHO0lBQy9CLEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7RUFDSDtBQUNXLElBQUEsVUFBVSxHQUFHO0FBQ3hCLElBQUEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztFQUNqRTtBQUNXLElBQUEsV0FBVyxHQUFHO0lBQ3pCLEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7RUFDSDtBQUNGO0FBQ08sSUFBTSxRQUFRLEdBQUcsRUFBRTtB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QztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN4RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDeEQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUdELElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3pELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQ3pELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN4RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDM0QsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQzNELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3BDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDdkQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxDQUFDLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTtRQUNuQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7SUFDRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1FBQ3pELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztRQUN6RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFFBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFFBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztLQUNw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LENBQUMsQ0FBQztBQUN0QyxJQUFBLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxJQUFBLE9BQU8sQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDM0IsRUFBRTtBQUVXLElBQUEsU0FBUyxHQUFHLFVBQUMsR0FBUSxFQUFFLE1BQVUsRUFBQTtBQUFWLElBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFVLEdBQUEsQ0FBQSxDQUFBLEVBQUE7SUFDNUMsSUFBSSxNQUFNLEtBQUssQ0FBQztBQUFFLFFBQUEsT0FBTyxHQUFHLENBQUM7QUFDN0IsSUFBQSxJQUFNLEdBQUcsR0FBR0MsWUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLElBQUEsSUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDdkQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkUsRUFBRTtBQUVXLElBQUEsT0FBTyxHQUFHLFVBQUMsR0FBUSxFQUFFLElBQVUsRUFBRSxPQUFXLEVBQUUsT0FBVyxFQUFBO0FBQXBDLElBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxJQUFVLEdBQUEsR0FBQSxDQUFBLEVBQUE7QUFBRSxJQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBVyxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQUUsSUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQVcsR0FBQSxDQUFBLENBQUEsRUFBQTtJQUNwRSxJQUFJLEdBQUcsS0FBSyxNQUFNO1FBQUUsT0FBTyxFQUFBLENBQUEsTUFBQSxDQUFHLElBQUksRUFBQSxJQUFBLENBQUksQ0FBQztBQUN2QyxJQUFBLElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ2pELElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7QUFDckUsSUFBQSxJQUFNLEdBQUcsR0FBRyxFQUFHLENBQUEsTUFBQSxDQUFBLElBQUksY0FBSSxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFHLENBQUM7QUFDOUQsSUFBQSxPQUFPLEdBQUcsQ0FBQztBQUNiLEVBQUU7SUFFVyxRQUFRLEdBQUcsVUFBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLEVBQVUsRUFBQTtBQUN2RCxJQUFBLElBQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixJQUFBLElBQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixJQUFBLElBQUksRUFBRSxLQUFLaEIsVUFBRSxDQUFDLEtBQUs7QUFBRSxRQUFBLE9BQU8sRUFBRSxDQUFDO0FBQy9CLElBQUEsSUFBSSxFQUFFLEtBQUtBLFVBQUUsQ0FBQyxLQUFLO0FBQUUsUUFBQSxPQUFPLElBQUssQ0FBQSxNQUFBLENBQUEsRUFBRSxDQUFHLENBQUEsTUFBQSxDQUFBLEVBQUUsTUFBRyxDQUFDO0FBQzVDLElBQUEsSUFBSSxFQUFFLEtBQUtBLFVBQUUsQ0FBQyxLQUFLO0FBQUUsUUFBQSxPQUFPLElBQUssQ0FBQSxNQUFBLENBQUEsRUFBRSxDQUFHLENBQUEsTUFBQSxDQUFBLEVBQUUsTUFBRyxDQUFDO0FBQzVDLElBQUEsT0FBTyxFQUFF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T0FBTyxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDckM7QUFDRCxJQUFBLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsUUFBUSxFQUFFO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDckM7QUFDRCxJQUFBLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsVUFBVSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7S0FDMUM7QUFDRCxJQUFBLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsV0FBVyxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7S0FDMUM7QUFDRCxJQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzQyxJQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUUzQyxJQUFBLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLEVBQUU7SUFFVyxlQUFlLEdB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TUFBTTtRQUFFLFNBQVMsQ0FBQyxJQUFJLENBQWQsS0FBQSxDQUFBLFNBQVMsdUNBQVMsU0FBUyxDQUFDLE1BQU0sQ0FBRSxFQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUE7O0FBRzFELElBQUEsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3BCLFFBQUEsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkUsUUFBQSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTTtZQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUEsS0FBQSxDQUFkLFNBQVMsRUFBQXhCLG1CQUFBLENBQUEsRUFBQSxFQUFBQyxZQUFBLENBQVMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUUsRUFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ3hFLFFBQUEsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU07WUFBRSxTQUFTLENBQUMsSUFBSSxDQUFBLEtBQUEsQ0FBZCxTQUFTLEVBQUFELG1CQUFBLENBQUEsRUFBQSxFQUFBQyxZQUFBLENBQVMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUUsRUFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBO0tBQ3pFOztBQUdELElBQUEsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFO0FBQ3RCLFFBQUEsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUs7WUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkUsUUFBQSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTTtZQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUEsS0FBQSxDQUFkLFNBQVMsRUFBQUQsbUJBQUEsQ0FBQSxFQUFBLEVBQUFDLFlBQUEsQ0FBUyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBRSxFQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUE7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
