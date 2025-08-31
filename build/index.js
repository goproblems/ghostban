
  /**
   * @license
   * author: BAI TIANLIANG
   * ghostban.js v3.0.0-alpha.133
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
var DEFAULT_THEME_COLOR_CONFIG = {
    positiveNodeColor: '#4d7c0f',
    negativeNodeColor: '#b91c1c',
    neutralNodeColor: '#a16207',
    defaultNodeColor: '#404040',
    warningNodeColor: '#ffdf20',
    shadowColor: '#555',
    boardLineColor: '#000000',
    activeColor: '#000000',
    inactiveColor: '#666666',
    boardBackgroundColor: '#FFFFFF',
    flatBlackColor: '#000000',
    flatBlackColorAlt: '#000000', // Alternative, temporarily same as main color
    flatWhiteColor: '#FFFFFF',
    flatWhiteColorAlt: '#FFFFFF', // Alternative, temporarily same as main color
    boardEdgeLineWidth: 5,
    boardLineWidth: 1,
    boardLineExtent: 0.5,
    starSize: 3,
    markupLineWidth: 2,
    highlightColor: '#ffeb64',
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
        console.log('TBD');
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
            return DEFAULT_THEME_COLOR_CONFIG[key];
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
        console.log('TBD');
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
            console.log("[DEBUG] No theme context for key: ".concat(key, ", using default"));
            return DEFAULT_THEME_COLOR_CONFIG[key];
        }
        var _b = this.themeContext, theme = _b.theme, themeOptions = _b.themeOptions;
        var themeSpecific = themeOptions[theme];
        var defaultConfig = themeOptions.default;
        console.log("[DEBUG] Getting theme property:", {
            key: key,
            theme: theme,
            themeSpecific: themeSpecific === null || themeSpecific === void 0 ? void 0 : themeSpecific[key],
            defaultConfig: defaultConfig[key],
            hasThemeSpecific: !!(themeSpecific === null || themeSpecific === void 0 ? void 0 : themeSpecific[key]),
        });
        // Try theme-specific value first, then default
        var result = ((_a = themeSpecific === null || themeSpecific === void 0 ? void 0 : themeSpecific[key]) !== null && _a !== void 0 ? _a : defaultConfig[key]);
        console.log("[DEBUG] Result for ".concat(key, ":"), result);
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
        console.log('TBD');
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
// Utility functions for mobile detection and resource selection
var isMobile = function () {
    if (typeof window === 'undefined')
        return false;
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768);
};
var getThemeResources = function (theme, themeResources) {
    var resources = themeResources[theme];
    if (!resources)
        return null;
    // If on mobile and lowRes exists, use lowRes resources
    if (isMobile() && resources.lowRes) {
        return {
            board: resources.lowRes.board || resources.board,
            blacks: resources.lowRes.blacks.length > 0
                ? resources.lowRes.blacks
                : resources.blacks,
            whites: resources.lowRes.whites.length > 0
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
var images = {};
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
        default: DEFAULT_THEME_COLOR_CONFIG
    },
    _a[exports.Theme.Flat] = {
        boardBackgroundColor: '#ECB55A',
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
                    ctx.shadowOffsetX = 3;
                    ctx.shadowOffsetY = 3;
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
            var _a = _this.options, theme = _a.theme, themeResources = _a.themeResources, padding = _a.padding;
            if (board) {
                board.style.borderRadius = '2px';
                var ctx = board.getContext('2d');
                if (ctx) {
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
                        var resources = getThemeResources(theme, themeResources);
                        if (resources && resources.board) {
                            var boardUrl = resources.board;
                            var boardRes = images[boardUrl];
                            if (boardRes) {
                                if (theme === exports.Theme.Walnut || theme === exports.Theme.YunziMonkeyDark) {
                                    ctx.drawImage(boardRes, -padding, -padding, board.width + padding, board.height + padding);
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
                                var _c = _this.calcSpaceAndPadding(), space = _c.space, scaledPadding = _c.scaledPadding;
                                var x = scaledPadding + i * space;
                                var y = scaledPadding + j * space;
                                var ratio = 0.45;
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
                                        var resources = getThemeResources(theme, themeResources);
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
        var resources = getThemeResources(theme, themeResources);
        if (!resources)
            return;
        var board = resources.board, blacks = resources.blacks, whites = resources.whites;
        this.options.theme = theme;
        this.options = tslib.__assign(tslib.__assign(tslib.__assign(tslib.__assign({}, this.options), { theme: theme }), options), { themeOptions: tslib.__assign(tslib.__assign({}, this.options.themeOptions), (options.themeOptions || {})) });
        this.updateNodeMarkupStyles();
        // Redraw callback after image loading completes
        var onImageLoaded = function (url) {
            _this.drawBan();
            _this.drawStones();
        };
        preload(lodash.compact(tslib.__spreadArray(tslib.__spreadArray([board], tslib.__read(blacks), false), tslib.__read(whites), false)), function () {
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
exports.CUSTOM_PROP_LIST = CUSTOM_PROP_LIST;
exports.CustomProp = CustomProp;
exports.DEFAULT_BOARD_SIZE = DEFAULT_BOARD_SIZE;
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
exports.DEFAULT_THEME_COLOR_CONFIG = DEFAULT_THEME_COLOR_CONFIG;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL2NvcmUvbWVyZ2Vzb3J0LnRzIiwiLi4vLi4vY29yZS90cmVlLnRzIiwiLi4vLi4vY29yZS9oZWxwZXJzLnRzIiwiLi4vLi4vdHlwZXMudHMiLCIuLi8uLi9jb25zdC50cyIsIi4uLy4uL2NvcmUvcHJvcHMudHMiLCIuLi8uLi9ib2FyZGNvcmUudHMiLCIuLi8uLi9jb3JlL3NnZi50cyIsIi4uLy4uL2hlbHBlci50cyIsIi4uLy4uL3N0b25lcy9iYXNlLnRzIiwiLi4vLi4vc3RvbmVzL0ZsYXRTdG9uZS50cyIsIi4uLy4uL3N0b25lcy9JbWFnZVN0b25lLnRzIiwiLi4vLi4vc3RvbmVzL0FuYWx5c2lzUG9pbnQudHMiLCIuLi8uLi9tYXJrdXBzL01hcmt1cEJhc2UudHMiLCIuLi8uLi9tYXJrdXBzL0NpcmNsZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvQ3Jvc3NNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL1RleHRNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL1NxdWFyZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvVHJpYW5nbGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL05vZGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL0FjdGl2ZU5vZGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL0NpcmNsZVNvbGlkTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9IaWdobGlnaHRNYXJrdXAudHMiLCIuLi8uLi9lZmZlY3RzL0VmZmVjdEJhc2UudHMiLCIuLi8uLi9lZmZlY3RzL0JhbkVmZmVjdC50cyIsIi4uLy4uL2dob3N0YmFuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB0eXBlIENvbXBhcmF0b3I8VD4gPSAoYTogVCwgYjogVCkgPT4gbnVtYmVyO1xuXG4vKipcbiAqIFNvcnQgYW4gYXJyYXkgdXNpbmcgdGhlIG1lcmdlIHNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSBjb21wYXJhdG9yRm4gVGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYXJyIFRoZSBhcnJheSB0byBzb3J0LlxuICogQHJldHVybnMgVGhlIHNvcnRlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VTb3J0PFQ+KGNvbXBhcmF0b3JGbjogQ29tcGFyYXRvcjxUPiwgYXJyOiBUW10pOiBUW10ge1xuICBjb25zdCBsZW4gPSBhcnIubGVuZ3RoO1xuICBpZiAobGVuID49IDIpIHtcbiAgICBjb25zdCBmaXJzdEhhbGYgPSBhcnIuc2xpY2UoMCwgbGVuIC8gMik7XG4gICAgY29uc3Qgc2Vjb25kSGFsZiA9IGFyci5zbGljZShsZW4gLyAyLCBsZW4pO1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIGNvbXBhcmF0b3JGbixcbiAgICAgIG1lcmdlU29ydChjb21wYXJhdG9yRm4sIGZpcnN0SGFsZiksXG4gICAgICBtZXJnZVNvcnQoY29tcGFyYXRvckZuLCBzZWNvbmRIYWxmKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFyci5zbGljZSgpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIG1lcmdlIHBhcnQgb2YgdGhlIG1lcmdlIHNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSBjb21wYXJhdG9yRm4gVGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYXJyMSBUaGUgZmlyc3Qgc29ydGVkIGFycmF5LlxuICogQHBhcmFtIGFycjIgVGhlIHNlY29uZCBzb3J0ZWQgYXJyYXkuXG4gKiBAcmV0dXJucyBUaGUgbWVyZ2VkIGFuZCBzb3J0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlPFQ+KGNvbXBhcmF0b3JGbjogQ29tcGFyYXRvcjxUPiwgYXJyMTogVFtdLCBhcnIyOiBUW10pOiBUW10ge1xuICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xuICBsZXQgbGVmdDEgPSBhcnIxLmxlbmd0aDtcbiAgbGV0IGxlZnQyID0gYXJyMi5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlZnQxID4gMCAmJiBsZWZ0MiA+IDApIHtcbiAgICBpZiAoY29tcGFyYXRvckZuKGFycjFbMF0sIGFycjJbMF0pIDw9IDApIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFycjEuc2hpZnQoKSEpOyAvLyBub24tbnVsbCBhc3NlcnRpb246IHNhZmUgc2luY2Ugd2UganVzdCBjaGVja2VkIGxlbmd0aFxuICAgICAgbGVmdDEtLTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goYXJyMi5zaGlmdCgpISk7XG4gICAgICBsZWZ0Mi0tO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsZWZ0MSA+IDApIHtcbiAgICByZXN1bHQucHVzaCguLi5hcnIxKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucHVzaCguLi5hcnIyKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlU29ydDtcbiIsImltcG9ydCBtZXJnZVNvcnQgZnJvbSAnLi9tZXJnZXNvcnQnO1xuaW1wb3J0IHtTZ2ZOb2RlfSBmcm9tICcuL3R5cGVzJztcblxuZnVuY3Rpb24gZmluZEluc2VydEluZGV4PFQ+KFxuICBjb21wYXJhdG9yRm46IChhOiBULCBiOiBUKSA9PiBudW1iZXIsXG4gIGFycjogVFtdLFxuICBlbDogVFxuKTogbnVtYmVyIHtcbiAgbGV0IGk6IG51bWJlcjtcbiAgY29uc3QgbGVuID0gYXJyLmxlbmd0aDtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGNvbXBhcmF0b3JGbihhcnJbaV0sIGVsKSA+IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaTtcbn1cblxudHlwZSBDb21wYXJhdG9yPFQ+ID0gKGE6IFQsIGI6IFQpID0+IG51bWJlcjtcblxuaW50ZXJmYWNlIFRyZWVNb2RlbENvbmZpZzxUPiB7XG4gIGNoaWxkcmVuUHJvcGVydHlOYW1lPzogc3RyaW5nO1xuICBtb2RlbENvbXBhcmF0b3JGbj86IENvbXBhcmF0b3I8VD47XG59XG5cbmNsYXNzIFROb2RlIHtcbiAgY29uZmlnOiBUcmVlTW9kZWxDb25maWc8U2dmTm9kZT47XG4gIG1vZGVsOiBTZ2ZOb2RlO1xuICBjaGlsZHJlbjogVE5vZGVbXSA9IFtdO1xuICBwYXJlbnQ/OiBUTm9kZTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPiwgbW9kZWw6IFNnZk5vZGUpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICBpc1Jvb3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICB9XG5cbiAgYWRkQ2hpbGQoY2hpbGQ6IFROb2RlKTogVE5vZGUge1xuICAgIHJldHVybiBhZGRDaGlsZCh0aGlzLCBjaGlsZCk7XG4gIH1cblxuICBhZGRDaGlsZEF0SW5kZXgoY2hpbGQ6IFROb2RlLCBpbmRleDogbnVtYmVyKTogVE5vZGUge1xuICAgIGlmICh0aGlzLmNvbmZpZy5tb2RlbENvbXBhcmF0b3JGbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCBjaGlsZCBhdCBpbmRleCB3aGVuIHVzaW5nIGEgY29tcGFyYXRvciBmdW5jdGlvbi4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3AgPSB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nO1xuICAgIGlmICghKHRoaXMubW9kZWwgYXMgYW55KVtwcm9wXSkge1xuICAgICAgKHRoaXMubW9kZWwgYXMgYW55KVtwcm9wXSA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsQ2hpbGRyZW4gPSAodGhpcy5tb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICBtb2RlbENoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQubW9kZWwpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZCk7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH1cblxuICBnZXRQYXRoKCk6IFROb2RlW10ge1xuICAgIGNvbnN0IHBhdGg6IFROb2RlW10gPSBbXTtcbiAgICBsZXQgY3VycmVudDogVE5vZGUgfCB1bmRlZmluZWQgPSB0aGlzO1xuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBwYXRoLnVuc2hpZnQoY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgZ2V0SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pc1Jvb3QoKSA/IDAgOiB0aGlzLnBhcmVudCEuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgfVxuXG4gIHNldEluZGV4KGluZGV4OiBudW1iZXIpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBzZXQgbm9kZSBpbmRleCB3aGVuIHVzaW5nIGEgY29tcGFyYXRvciBmdW5jdGlvbi4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnBhcmVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIGhhcyBubyBwYXJlbnQuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLnBhcmVudC5jaGlsZHJlbjtcbiAgICBjb25zdCBtb2RlbFNpYmxpbmdzID0gKHRoaXMucGFyZW50Lm1vZGVsIGFzIGFueSlbXG4gICAgICB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nXG4gICAgXTtcblxuICAgIGNvbnN0IG9sZEluZGV4ID0gc2libGluZ3MuaW5kZXhPZih0aGlzKTtcblxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc2libGluZ3MubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgc2libGluZ3Muc3BsaWNlKGluZGV4LCAwLCBzaWJsaW5ncy5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcbiAgICBtb2RlbFNpYmxpbmdzLnNwbGljZShpbmRleCwgMCwgbW9kZWxTaWJsaW5ncy5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgd2FsayhmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuIHwgdm9pZCk6IHZvaWQge1xuICAgIGNvbnN0IHdhbGtSZWN1cnNpdmUgPSAobm9kZTogVE5vZGUpOiBib29sZWFuID0+IHtcbiAgICAgIGlmIChmbihub2RlKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAod2Fsa1JlY3Vyc2l2ZShjaGlsZCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIHdhbGtSZWN1cnNpdmUodGhpcyk7XG4gIH1cblxuICBmaXJzdChmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuKTogVE5vZGUgfCB1bmRlZmluZWQge1xuICAgIGxldCByZXN1bHQ6IFROb2RlIHwgdW5kZWZpbmVkO1xuICAgIHRoaXMud2Fsayhub2RlID0+IHtcbiAgICAgIGlmIChmbihub2RlKSkge1xuICAgICAgICByZXN1bHQgPSBub2RlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGFsbChmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuKTogVE5vZGVbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBUTm9kZVtdID0gW107XG4gICAgdGhpcy53YWxrKG5vZGUgPT4ge1xuICAgICAgaWYgKGZuKG5vZGUpKSByZXN1bHQucHVzaChub2RlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZHJvcCgpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIGNvbnN0IHByb3AgPSB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nO1xuICAgICAgICAodGhpcy5wYXJlbnQubW9kZWwgYXMgYW55KVtwcm9wXS5zcGxpY2UoaWR4LCAxKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDaGlsZChwYXJlbnQ6IFROb2RlLCBjaGlsZDogVE5vZGUpOiBUTm9kZSB7XG4gIGNvbnN0IHByb3AgPSBwYXJlbnQuY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lIHx8ICdjaGlsZHJlbic7XG4gIGlmICghKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdKSB7XG4gICAgKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdID0gW107XG4gIH1cblxuICBjb25zdCBtb2RlbENoaWxkcmVuID0gKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gIGNoaWxkLnBhcmVudCA9IHBhcmVudDtcbiAgaWYgKHBhcmVudC5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICBjb25zdCBpbmRleCA9IGZpbmRJbnNlcnRJbmRleChcbiAgICAgIHBhcmVudC5jb25maWcubW9kZWxDb21wYXJhdG9yRm4sXG4gICAgICBtb2RlbENoaWxkcmVuLFxuICAgICAgY2hpbGQubW9kZWxcbiAgICApO1xuICAgIG1vZGVsQ2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZC5tb2RlbCk7XG4gICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuICB9IGVsc2Uge1xuICAgIG1vZGVsQ2hpbGRyZW4ucHVzaChjaGlsZC5tb2RlbCk7XG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5jbGFzcyBUcmVlTW9kZWwge1xuICBjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPjtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPiA9IHt9KSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBjaGlsZHJlblByb3BlcnR5TmFtZTogY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lIHx8ICdjaGlsZHJlbicsXG4gICAgICBtb2RlbENvbXBhcmF0b3JGbjogY29uZmlnLm1vZGVsQ29tcGFyYXRvckZuLFxuICAgIH07XG4gIH1cblxuICBwYXJzZShtb2RlbDogU2dmTm9kZSk6IFROb2RlIHtcbiAgICBpZiAodHlwZW9mIG1vZGVsICE9PSAnb2JqZWN0JyB8fCBtb2RlbCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTW9kZWwgbXVzdCBiZSBvZiB0eXBlIG9iamVjdC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlID0gbmV3IFROb2RlKHRoaXMuY29uZmlnLCBtb2RlbCk7XG4gICAgY29uc3QgcHJvcCA9IHRoaXMuY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lITtcbiAgICBjb25zdCBjaGlsZHJlbiA9IChtb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgICBpZiAodGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICAgICAgKG1vZGVsIGFzIGFueSlbcHJvcF0gPSBtZXJnZVNvcnQoXG4gICAgICAgICAgdGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4sXG4gICAgICAgICAgY2hpbGRyZW5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgY2hpbGRNb2RlbCBvZiAobW9kZWwgYXMgYW55KVtwcm9wXSkge1xuICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSB0aGlzLnBhcnNlKGNoaWxkTW9kZWwpO1xuICAgICAgICBhZGRDaGlsZChub2RlLCBjaGlsZE5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG59XG5cbmV4cG9ydCB7VHJlZU1vZGVsLCBUTm9kZSwgVHJlZU1vZGVsQ29uZmlnfTtcbiIsImltcG9ydCB7ZmlsdGVyLCBmaW5kTGFzdEluZGV4fSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtUTm9kZX0gZnJvbSAnLi90cmVlJztcbmltcG9ydCB7TW92ZVByb3AsIFNnZlByb3BCYXNlfSBmcm9tICcuL3Byb3BzJztcblxuY29uc3QgU3BhcmtNRDUgPSByZXF1aXJlKCdzcGFyay1tZDUnKTtcblxuZXhwb3J0IGNvbnN0IGNhbGNIYXNoID0gKFxuICBub2RlOiBUTm9kZSB8IG51bGwgfCB1bmRlZmluZWQsXG4gIG1vdmVQcm9wczogTW92ZVByb3BbXSA9IFtdXG4pOiBzdHJpbmcgPT4ge1xuICBsZXQgZnVsbG5hbWUgPSAnbic7XG4gIGlmIChtb3ZlUHJvcHMubGVuZ3RoID4gMCkge1xuICAgIGZ1bGxuYW1lICs9IGAke21vdmVQcm9wc1swXS50b2tlbn0ke21vdmVQcm9wc1swXS52YWx1ZX1gO1xuICB9XG4gIGlmIChub2RlKSB7XG4gICAgY29uc3QgcGF0aCA9IG5vZGUuZ2V0UGF0aCgpO1xuICAgIGlmIChwYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIGZ1bGxuYW1lID0gcGF0aC5tYXAobiA9PiBuLm1vZGVsLmlkKS5qb2luKCc9PicpICsgYD0+JHtmdWxsbmFtZX1gO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBTcGFya01ENS5oYXNoKGZ1bGxuYW1lKS5zbGljZSgwLCA2KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NoYXJhY3RlckluTm9kZShcbiAgc2dmOiBzdHJpbmcsXG4gIG46IG51bWJlcixcbiAgbm9kZXMgPSBbJ0MnLCAnVE0nLCAnR04nLCAnUEMnXVxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGAoJHtub2Rlcy5qb2luKCd8Jyl9KVxcXFxbKFteXFxcXF1dKilcXFxcXWAsICdnJyk7XG4gIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcblxuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKHNnZikpICE9PSBudWxsKSB7XG4gICAgY29uc3QgY29udGVudFN0YXJ0ID0gbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGggKyAxOyAvLyArMSBmb3IgdGhlICdbJ1xuICAgIGNvbnN0IGNvbnRlbnRFbmQgPSBjb250ZW50U3RhcnQgKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgaWYgKG4gPj0gY29udGVudFN0YXJ0ICYmIG4gPD0gY29udGVudEVuZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG50eXBlIFJhbmdlID0gW251bWJlciwgbnVtYmVyXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTm9kZVJhbmdlcyhcbiAgc2dmOiBzdHJpbmcsXG4gIGtleXM6IHN0cmluZ1tdID0gWydDJywgJ1RNJywgJ0dOJywgJ1BDJ11cbik6IFJhbmdlW10ge1xuICBjb25zdCByYW5nZXM6IFJhbmdlW10gPSBbXTtcbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoYFxcXFxiKCR7a2V5cy5qb2luKCd8Jyl9KVxcXFxbKFteXFxcXF1dKilcXFxcXWAsICdnJyk7XG5cbiAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKHNnZikpICE9PSBudWxsKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBtYXRjaC5pbmRleCArIG1hdGNoWzFdLmxlbmd0aCArIDE7XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgcmFuZ2VzLnB1c2goW3N0YXJ0LCBlbmRdKTtcbiAgfVxuXG4gIHJldHVybiByYW5nZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luQW55UmFuZ2UoaW5kZXg6IG51bWJlciwgcmFuZ2VzOiBSYW5nZVtdKTogYm9vbGVhbiB7XG4gIC8vIHJhbmdlcyBtdXN0IGJlIHNvcnRlZFxuICBsZXQgbGVmdCA9IDA7XG4gIGxldCByaWdodCA9IHJhbmdlcy5sZW5ndGggLSAxO1xuXG4gIHdoaWxlIChsZWZ0IDw9IHJpZ2h0KSB7XG4gICAgY29uc3QgbWlkID0gKGxlZnQgKyByaWdodCkgPj4gMTtcbiAgICBjb25zdCBbc3RhcnQsIGVuZF0gPSByYW5nZXNbbWlkXTtcblxuICAgIGlmIChpbmRleCA8IHN0YXJ0KSB7XG4gICAgICByaWdodCA9IG1pZCAtIDE7XG4gICAgfSBlbHNlIGlmIChpbmRleCA+IGVuZCkge1xuICAgICAgbGVmdCA9IG1pZCArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldERlZHVwbGljYXRlZFByb3BzID0gKHRhcmdldFByb3BzOiBTZ2ZQcm9wQmFzZVtdKSA9PiB7XG4gIHJldHVybiBmaWx0ZXIoXG4gICAgdGFyZ2V0UHJvcHMsXG4gICAgKHByb3A6IFNnZlByb3BCYXNlLCBpbmRleDogbnVtYmVyKSA9PlxuICAgICAgaW5kZXggPT09XG4gICAgICBmaW5kTGFzdEluZGV4KFxuICAgICAgICB0YXJnZXRQcm9wcyxcbiAgICAgICAgKGxhc3RQcm86IFNnZlByb3BCYXNlKSA9PlxuICAgICAgICAgIHByb3AudG9rZW4gPT09IGxhc3RQcm8udG9rZW4gJiYgcHJvcC52YWx1ZSA9PT0gbGFzdFByby52YWx1ZVxuICAgICAgKVxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTW92ZU5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgcmV0dXJuIG4ubW9kZWwubW92ZVByb3BzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnQgY29uc3QgaXNSb290Tm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICByZXR1cm4gbi5tb2RlbC5yb290UHJvcHMubGVuZ3RoID4gMCB8fCBuLmlzUm9vdCgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzU2V0dXBOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIHJldHVybiBuLm1vZGVsLnNldHVwUHJvcHMubGVuZ3RoID4gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlTnVtYmVyID0gKG46IFROb2RlLCBwYXJlbnQ/OiBUTm9kZSkgPT4ge1xuICBjb25zdCBwYXRoID0gbi5nZXRQYXRoKCk7XG4gIGxldCBtb3Zlc0NvdW50ID0gcGF0aC5maWx0ZXIobiA9PiBpc01vdmVOb2RlKG4pKS5sZW5ndGg7XG4gIGlmIChwYXJlbnQpIHtcbiAgICBtb3Zlc0NvdW50ICs9IHBhcmVudC5nZXRQYXRoKCkuZmlsdGVyKG4gPT4gaXNNb3ZlTm9kZShuKSkubGVuZ3RoO1xuICB9XG4gIHJldHVybiBtb3Zlc0NvdW50O1xufTtcbiIsIi8qKlxuICogVGhlbWUgcHJvcGVydHkga2V5cyBmb3IgdHlwZS1zYWZlIGFjY2VzcyB0byB0aGVtZSBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBlbnVtIFRoZW1lUHJvcGVydHlLZXkge1xuICBQb3NpdGl2ZU5vZGVDb2xvciA9ICdwb3NpdGl2ZU5vZGVDb2xvcicsXG4gIE5lZ2F0aXZlTm9kZUNvbG9yID0gJ25lZ2F0aXZlTm9kZUNvbG9yJyxcbiAgTmV1dHJhbE5vZGVDb2xvciA9ICduZXV0cmFsTm9kZUNvbG9yJyxcbiAgRGVmYXVsdE5vZGVDb2xvciA9ICdkZWZhdWx0Tm9kZUNvbG9yJyxcbiAgV2FybmluZ05vZGVDb2xvciA9ICd3YXJuaW5nTm9kZUNvbG9yJyxcbiAgU2hhZG93Q29sb3IgPSAnc2hhZG93Q29sb3InLFxuICBCb2FyZExpbmVDb2xvciA9ICdib2FyZExpbmVDb2xvcicsXG4gIEFjdGl2ZUNvbG9yID0gJ2FjdGl2ZUNvbG9yJyxcbiAgSW5hY3RpdmVDb2xvciA9ICdpbmFjdGl2ZUNvbG9yJyxcbiAgQm9hcmRCYWNrZ3JvdW5kQ29sb3IgPSAnYm9hcmRCYWNrZ3JvdW5kQ29sb3InLFxuICBGbGF0QmxhY2tDb2xvciA9ICdmbGF0QmxhY2tDb2xvcicsXG4gIEZsYXRCbGFja0NvbG9yQWx0ID0gJ2ZsYXRCbGFja0NvbG9yQWx0JyxcbiAgRmxhdFdoaXRlQ29sb3IgPSAnZmxhdFdoaXRlQ29sb3InLFxuICBGbGF0V2hpdGVDb2xvckFsdCA9ICdmbGF0V2hpdGVDb2xvckFsdCcsXG4gIEJvYXJkRWRnZUxpbmVXaWR0aCA9ICdib2FyZEVkZ2VMaW5lV2lkdGgnLFxuICBCb2FyZExpbmVXaWR0aCA9ICdib2FyZExpbmVXaWR0aCcsXG4gIEJvYXJkTGluZUV4dGVudCA9ICdib2FyZExpbmVFeHRlbnQnLFxuICBTdGFyU2l6ZSA9ICdzdGFyU2l6ZScsXG4gIE1hcmt1cExpbmVXaWR0aCA9ICdtYXJrdXBMaW5lV2lkdGgnLFxuICBIaWdobGlnaHRDb2xvciA9ICdoaWdobGlnaHRDb2xvcicsXG59XG5cbi8qKlxuICogVGhlbWUgY29udGV4dCBmb3IgbWFya3VwIHJlbmRlcmluZ1xuICovXG5leHBvcnQgdHlwZSBUaGVtZUNvbnRleHQgPSB7XG4gIHRoZW1lOiBUaGVtZTtcbiAgdGhlbWVPcHRpb25zOiBUaGVtZU9wdGlvbnM7XG59O1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIEdob3N0QmFuLlxuICovXG5leHBvcnQgdHlwZSBHaG9zdEJhbk9wdGlvbnMgPSB7XG4gIGJvYXJkU2l6ZTogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBkeW5hbWljUGFkZGluZzogYm9vbGVhbjtcbiAgcGFkZGluZzogbnVtYmVyO1xuICB6b29tPzogYm9vbGVhbjtcbiAgZXh0ZW50OiBudW1iZXI7XG4gIHRoZW1lOiBUaGVtZTtcbiAgYW5hbHlzaXNQb2ludFRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWU7XG4gIGNvb3JkaW5hdGU6IGJvb2xlYW47XG4gIGludGVyYWN0aXZlOiBib29sZWFuO1xuICBiYWNrZ3JvdW5kOiBib29sZWFuO1xuICBzaG93QW5hbHlzaXM6IGJvb2xlYW47XG4gIGFkYXB0aXZlQm9hcmRMaW5lOiBib29sZWFuO1xuICB0aGVtZU9wdGlvbnM6IFRoZW1lT3B0aW9ucztcbiAgdGhlbWVSZXNvdXJjZXM6IFRoZW1lUmVzb3VyY2VzO1xuICBtb3ZlU291bmQ6IGJvb2xlYW47XG4gIGFkYXB0aXZlU3RhclNpemU6IGJvb2xlYW47XG4gIG1vYmlsZUluZGljYXRvck9mZnNldDogbnVtYmVyO1xuICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgR2hvc3RCYW5PcHRpb25zUGFyYW1zID0ge1xuICBib2FyZFNpemU/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIGR5bmFtaWNQYWRkaW5nPzogYm9vbGVhbjtcbiAgcGFkZGluZz86IG51bWJlcjtcbiAgem9vbT86IGJvb2xlYW47XG4gIGV4dGVudD86IG51bWJlcjtcbiAgdGhlbWU/OiBUaGVtZTtcbiAgYW5hbHlzaXNQb2ludFRoZW1lPzogQW5hbHlzaXNQb2ludFRoZW1lO1xuICBjb29yZGluYXRlPzogYm9vbGVhbjtcbiAgaW50ZXJhY3RpdmU/OiBib29sZWFuO1xuICBiYWNrZ3JvdW5kPzogYm9vbGVhbjtcbiAgc2hvd0FuYWx5c2lzPzogYm9vbGVhbjtcbiAgYWRhcHRpdmVCb2FyZExpbmU/OiBib29sZWFuO1xuICB0aGVtZU9wdGlvbnM/OiBQYXJ0aWFsPFRoZW1lT3B0aW9ucz47XG4gIHRoZW1lUmVzb3VyY2VzPzogVGhlbWVSZXNvdXJjZXM7XG4gIG1vdmVTb3VuZD86IGJvb2xlYW47XG4gIGFkYXB0aXZlU3RhclNpemU/OiBib29sZWFuO1xuICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplPzogbnVtYmVyO1xuICBtb2JpbGVJbmRpY2F0b3JPZmZzZXQ/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBUaGVtZUNvbmZpZyA9IHtcbiAgcG9zaXRpdmVOb2RlQ29sb3I6IHN0cmluZztcbiAgbmVnYXRpdmVOb2RlQ29sb3I6IHN0cmluZztcbiAgbmV1dHJhbE5vZGVDb2xvcjogc3RyaW5nO1xuICBkZWZhdWx0Tm9kZUNvbG9yOiBzdHJpbmc7XG4gIHdhcm5pbmdOb2RlQ29sb3I6IHN0cmluZztcbiAgc2hhZG93Q29sb3I6IHN0cmluZztcbiAgYm9hcmRMaW5lQ29sb3I6IHN0cmluZztcbiAgYWN0aXZlQ29sb3I6IHN0cmluZztcbiAgaW5hY3RpdmVDb2xvcjogc3RyaW5nO1xuICBib2FyZEJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xuICAvLyBNYXJrdXAgY29sb3JzIGZvciBmbGF0IHRoZW1lc1xuICBmbGF0QmxhY2tDb2xvcjogc3RyaW5nO1xuICBmbGF0QmxhY2tDb2xvckFsdDogc3RyaW5nO1xuICBmbGF0V2hpdGVDb2xvcjogc3RyaW5nO1xuICBmbGF0V2hpdGVDb2xvckFsdDogc3RyaW5nO1xuICAvLyBCb2FyZCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgYm9hcmRFZGdlTGluZVdpZHRoOiBudW1iZXI7XG4gIGJvYXJkTGluZVdpZHRoOiBudW1iZXI7XG4gIGJvYXJkTGluZUV4dGVudDogbnVtYmVyO1xuICBzdGFyU2l6ZTogbnVtYmVyO1xuICBtYXJrdXBMaW5lV2lkdGg6IG51bWJlcjtcbiAgaGlnaGxpZ2h0Q29sb3I6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFRoZW1lT3B0aW9ucyA9IHtcbiAgW2tleSBpbiBUaGVtZV0/OiBQYXJ0aWFsPFRoZW1lQ29uZmlnPjtcbn0gJiB7XG4gIGRlZmF1bHQ6IFRoZW1lQ29uZmlnO1xufTtcblxuZXhwb3J0IHR5cGUgVGhlbWVSZXNvdXJjZXMgPSB7XG4gIFtrZXkgaW4gVGhlbWVdOiB7Ym9hcmQ/OiBzdHJpbmc7IGJsYWNrczogc3RyaW5nW107IHdoaXRlczogc3RyaW5nW119O1xufTtcblxuZXhwb3J0IHR5cGUgQ29uc3VtZWRBbmFseXNpcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNlcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaXNEdXJpbmdTZWFyY2g6IGJvb2xlYW47XG4gIG1vdmVJbmZvczogTW92ZUluZm9bXTtcbiAgcm9vdEluZm86IFJvb3RJbmZvO1xuICBwb2xpY3k6IG51bWJlcltdO1xuICBvd25lcnNoaXA6IG51bWJlcltdO1xuICB0dXJuTnVtYmVyOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpc1BhcmFtcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaW5pdGlhbFBsYXllcjogc3RyaW5nO1xuICBtb3ZlczogYW55W107XG4gIHJ1bGVzOiBzdHJpbmc7XG4gIGtvbWk6IHN0cmluZztcbiAgYm9hcmRYU2l6ZTogbnVtYmVyO1xuICBib2FyZFlTaXplOiBudW1iZXI7XG4gIGluY2x1ZGVQb2xpY3k6IGJvb2xlYW47XG4gIHByaW9yaXR5OiBudW1iZXI7XG4gIG1heFZpc2l0czogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgTW92ZUluZm8gPSB7XG4gIGlzU3ltbWV0cnlPZjogc3RyaW5nO1xuICBsY2I6IG51bWJlcjtcbiAgbW92ZTogc3RyaW5nO1xuICBvcmRlcjogbnVtYmVyO1xuICBwcmlvcjogbnVtYmVyO1xuICBwdjogc3RyaW5nW107XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZU1lYW46IG51bWJlcjtcbiAgc2NvcmVTZWxmUGxheTogbnVtYmVyO1xuICBzY29yZVN0ZGV2OiBudW1iZXI7XG4gIHV0aWxpdHk6IG51bWJlcjtcbiAgdXRpbGl0eUxjYjogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFJvb3RJbmZvID0ge1xuICAvLyBjdXJyZW50UGxheWVyIGlzIG5vdCBvZmZpY2lhbGx5IHBhcnQgb2YgdGhlIEdUUCByZXN1bHRzIGJ1dCBpdCBpcyBoZWxwZnVsIHRvIGhhdmUgaXQgaGVyZSB0byBhdm9pZCBwYXNzaW5nIGl0IHRocm91Z2ggdGhlIGFyZ3VtZW50c1xuICBjdXJyZW50UGxheWVyOiBzdHJpbmc7XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZVNlbGZwbGF5OiBudW1iZXI7XG4gIHNjb3JlU3RkZXY6IG51bWJlcjtcbiAgdXRpbGl0eTogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ/OiBudW1iZXI7XG4gIHJhd1N0V3JFcnJvcj86IG51bWJlcjtcbiAgcmF3U3RTY29yZUVycm9yPzogbnVtYmVyO1xuICByYXdWYXJUaW1lTGVmdD86IG51bWJlcjtcbiAgLy8gR1RQIHJlc3VsdHMgZG9uJ3QgaW5jbHVkZSB0aGUgZm9sbG93aW5nIGZpZWxkc1xuICBsY2I/OiBudW1iZXI7XG4gIHN5bUhhc2g/OiBzdHJpbmc7XG4gIHRoaXNIYXNoPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQW5hbHlzaXNQb2ludE9wdGlvbnMgPSB7XG4gIHNob3dPcmRlcj86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZW51bSBLaSB7XG4gIEJsYWNrID0gMSxcbiAgV2hpdGUgPSAtMSxcbiAgRW1wdHkgPSAwLFxufVxuXG5leHBvcnQgZW51bSBUaGVtZSB7XG4gIEJsYWNrQW5kV2hpdGUgPSAnYmxhY2tfYW5kX3doaXRlJyxcbiAgRmxhdCA9ICdmbGF0JyxcbiAgU3ViZHVlZCA9ICdzdWJkdWVkJyxcbiAgU2hlbGxTdG9uZSA9ICdzaGVsbF9zdG9uZScsXG4gIFNsYXRlQW5kU2hlbGwgPSAnc2xhdGVfYW5kX3NoZWxsJyxcbiAgV2FsbnV0ID0gJ3dhbG51dCcsXG4gIFBob3RvcmVhbGlzdGljID0gJ3Bob3RvcmVhbGlzdGljJyxcbiAgRGFyayA9ICdkYXJrJyxcbiAgV2FybSA9ICd3YXJtJyxcbiAgWXVuemlNb25rZXlEYXJrID0gJ3l1bnppX21vbmtleV9kYXJrJyxcbiAgSGlnaENvbnRyYXN0ID0gJ2hpZ2hfY29udHJhc3QnLFxufVxuXG5leHBvcnQgZW51bSBBbmFseXNpc1BvaW50VGhlbWUge1xuICBEZWZhdWx0ID0gJ2RlZmF1bHQnLFxuICBQcm9ibGVtID0gJ3Byb2JsZW0nLFxufVxuXG5leHBvcnQgZW51bSBDZW50ZXIge1xuICBMZWZ0ID0gJ2wnLFxuICBSaWdodCA9ICdyJyxcbiAgVG9wID0gJ3QnLFxuICBCb3R0b20gPSAnYicsXG4gIFRvcFJpZ2h0ID0gJ3RyJyxcbiAgVG9wTGVmdCA9ICd0bCcsXG4gIEJvdHRvbUxlZnQgPSAnYmwnLFxuICBCb3R0b21SaWdodCA9ICdicicsXG4gIENlbnRlciA9ICdjJyxcbn1cblxuZXhwb3J0IGVudW0gRWZmZWN0IHtcbiAgTm9uZSA9ICcnLFxuICBCYW4gPSAnYmFuJyxcbiAgRGltID0gJ2RpbScsXG4gIEhpZ2hsaWdodCA9ICdoaWdobGlnaHQnLFxufVxuXG5leHBvcnQgZW51bSBNYXJrdXAge1xuICBDdXJyZW50ID0gJ2N1JyxcbiAgQ2lyY2xlID0gJ2NpJyxcbiAgQ2lyY2xlU29saWQgPSAnY2lzJyxcbiAgU3F1YXJlID0gJ3NxJyxcbiAgU3F1YXJlU29saWQgPSAnc3FzJyxcbiAgVHJpYW5nbGUgPSAndHJpJyxcbiAgQ3Jvc3MgPSAnY3InLFxuICBOdW1iZXIgPSAnbnVtJyxcbiAgTGV0dGVyID0gJ2xlJyxcbiAgUG9zaXRpdmVOb2RlID0gJ3BvcycsXG4gIFBvc2l0aXZlQWN0aXZlTm9kZSA9ICdwb3NhJyxcbiAgUG9zaXRpdmVEYXNoZWROb2RlID0gJ3Bvc2RhJyxcbiAgUG9zaXRpdmVEb3R0ZWROb2RlID0gJ3Bvc2R0JyxcbiAgUG9zaXRpdmVEYXNoZWRBY3RpdmVOb2RlID0gJ3Bvc2RhYScsXG4gIFBvc2l0aXZlRG90dGVkQWN0aXZlTm9kZSA9ICdwb3NkdGEnLFxuICBOZWdhdGl2ZU5vZGUgPSAnbmVnJyxcbiAgTmVnYXRpdmVBY3RpdmVOb2RlID0gJ25lZ2EnLFxuICBOZWdhdGl2ZURhc2hlZE5vZGUgPSAnbmVnZGEnLFxuICBOZWdhdGl2ZURvdHRlZE5vZGUgPSAnbmVnZHQnLFxuICBOZWdhdGl2ZURhc2hlZEFjdGl2ZU5vZGUgPSAnbmVnZGFhJyxcbiAgTmVnYXRpdmVEb3R0ZWRBY3RpdmVOb2RlID0gJ25lZ2R0YScsXG4gIE5ldXRyYWxOb2RlID0gJ25ldScsXG4gIE5ldXRyYWxBY3RpdmVOb2RlID0gJ25ldWEnLFxuICBOZXV0cmFsRGFzaGVkTm9kZSA9ICduZXVkYScsXG4gIE5ldXRyYWxEb3R0ZWROb2RlID0gJ25ldWR0JyxcbiAgTmV1dHJhbERhc2hlZEFjdGl2ZU5vZGUgPSAnbmV1ZHRhJyxcbiAgTmV1dHJhbERvdHRlZEFjdGl2ZU5vZGUgPSAnbmV1ZGFhJyxcbiAgV2FybmluZ05vZGUgPSAnd2EnLFxuICBXYXJuaW5nQWN0aXZlTm9kZSA9ICd3YWEnLFxuICBXYXJuaW5nRGFzaGVkTm9kZSA9ICd3YWRhJyxcbiAgV2FybmluZ0RvdHRlZE5vZGUgPSAnd2FkdCcsXG4gIFdhcm5pbmdEYXNoZWRBY3RpdmVOb2RlID0gJ3dhZGFhJyxcbiAgV2FybmluZ0RvdHRlZEFjdGl2ZU5vZGUgPSAnd2FkdGEnLFxuICBEZWZhdWx0Tm9kZSA9ICdkZScsXG4gIERlZmF1bHRBY3RpdmVOb2RlID0gJ2RlYScsXG4gIERlZmF1bHREYXNoZWROb2RlID0gJ2RlZGEnLFxuICBEZWZhdWx0RG90dGVkTm9kZSA9ICdkZWR0JyxcbiAgRGVmYXVsdERhc2hlZEFjdGl2ZU5vZGUgPSAnZGVkYWEnLFxuICBEZWZhdWx0RG90dGVkQWN0aXZlTm9kZSA9ICdkZWR0YScsXG4gIE5vZGUgPSAnbm9kZScsXG4gIERhc2hlZE5vZGUgPSAnZGFub2RlJyxcbiAgRG90dGVkTm9kZSA9ICdkdG5vZGUnLFxuICBBY3RpdmVOb2RlID0gJ2Fub2RlJyxcbiAgRGFzaGVkQWN0aXZlTm9kZSA9ICdkYW5vZGUnLFxuICBIaWdobGlnaHQgPSAnaGwnLFxuICBOb25lID0gJycsXG59XG5cbmV4cG9ydCBlbnVtIEN1cnNvciB7XG4gIE5vbmUgPSAnJyxcbiAgQmxhY2tTdG9uZSA9ICdiJyxcbiAgV2hpdGVTdG9uZSA9ICd3JyxcbiAgQ2lyY2xlID0gJ2MnLFxuICBTcXVhcmUgPSAncycsXG4gIFRyaWFuZ2xlID0gJ3RyaScsXG4gIENyb3NzID0gJ2NyJyxcbiAgQ2xlYXIgPSAnY2wnLFxuICBUZXh0ID0gJ3QnLFxufVxuXG5leHBvcnQgZW51bSBQcm9ibGVtQW5zd2VyVHlwZSB7XG4gIFJpZ2h0ID0gJzEnLFxuICBXcm9uZyA9ICcyJyxcbiAgVmFyaWFudCA9ICczJyxcbn1cblxuZXhwb3J0IGVudW0gUGF0aERldGVjdGlvblN0cmF0ZWd5IHtcbiAgUG9zdCA9ICdwb3N0JyxcbiAgUHJlID0gJ3ByZScsXG4gIEJvdGggPSAnYm90aCcsXG59XG4iLCJpbXBvcnQge2NodW5rfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtUaGVtZSwgVGhlbWVDb25maWd9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBzZXR0aW5ncyA9IHtjZG46ICdodHRwczovL3Muc2hhb3dxLmNvbSd9O1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9USEVNRV9DT0xPUl9DT05GSUc6IFRoZW1lQ29uZmlnID0ge1xuICBwb3NpdGl2ZU5vZGVDb2xvcjogJyM0ZDdjMGYnLFxuICBuZWdhdGl2ZU5vZGVDb2xvcjogJyNiOTFjMWMnLFxuICBuZXV0cmFsTm9kZUNvbG9yOiAnI2ExNjIwNycsXG4gIGRlZmF1bHROb2RlQ29sb3I6ICcjNDA0MDQwJyxcbiAgd2FybmluZ05vZGVDb2xvcjogJyNmZmRmMjAnLFxuICBzaGFkb3dDb2xvcjogJyM1NTUnLFxuICBib2FyZExpbmVDb2xvcjogJyMwMDAwMDAnLFxuICBhY3RpdmVDb2xvcjogJyMwMDAwMDAnLFxuICBpbmFjdGl2ZUNvbG9yOiAnIzY2NjY2NicsXG4gIGJvYXJkQmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRicsXG4gIGZsYXRCbGFja0NvbG9yOiAnIzAwMDAwMCcsXG4gIGZsYXRCbGFja0NvbG9yQWx0OiAnIzAwMDAwMCcsIC8vIEFsdGVybmF0aXZlLCB0ZW1wb3JhcmlseSBzYW1lIGFzIG1haW4gY29sb3JcbiAgZmxhdFdoaXRlQ29sb3I6ICcjRkZGRkZGJyxcbiAgZmxhdFdoaXRlQ29sb3JBbHQ6ICcjRkZGRkZGJywgLy8gQWx0ZXJuYXRpdmUsIHRlbXBvcmFyaWx5IHNhbWUgYXMgbWFpbiBjb2xvclxuICBib2FyZEVkZ2VMaW5lV2lkdGg6IDUsXG4gIGJvYXJkTGluZVdpZHRoOiAxLFxuICBib2FyZExpbmVFeHRlbnQ6IDAuNSxcbiAgc3RhclNpemU6IDMsXG4gIG1hcmt1cExpbmVXaWR0aDogMixcbiAgaGlnaGxpZ2h0Q29sb3I6ICcjZmZlYjY0Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBNQVhfQk9BUkRfU0laRSA9IDI5O1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQk9BUkRfU0laRSA9IDE5O1xuZXhwb3J0IGNvbnN0IEExX0xFVFRFUlMgPSBbXG4gICdBJyxcbiAgJ0InLFxuICAnQycsXG4gICdEJyxcbiAgJ0UnLFxuICAnRicsXG4gICdHJyxcbiAgJ0gnLFxuICAnSicsXG4gICdLJyxcbiAgJ0wnLFxuICAnTScsXG4gICdOJyxcbiAgJ08nLFxuICAnUCcsXG4gICdRJyxcbiAgJ1InLFxuICAnUycsXG4gICdUJyxcbl07XG5leHBvcnQgY29uc3QgQTFfTEVUVEVSU19XSVRIX0kgPSBbXG4gICdBJyxcbiAgJ0InLFxuICAnQycsXG4gICdEJyxcbiAgJ0UnLFxuICAnRicsXG4gICdHJyxcbiAgJ0gnLFxuICAnSScsXG4gICdKJyxcbiAgJ0snLFxuICAnTCcsXG4gICdNJyxcbiAgJ04nLFxuICAnTycsXG4gICdQJyxcbiAgJ1EnLFxuICAnUicsXG4gICdTJyxcbl07XG5leHBvcnQgY29uc3QgQTFfTlVNQkVSUyA9IFtcbiAgMTksIDE4LCAxNywgMTYsIDE1LCAxNCwgMTMsIDEyLCAxMSwgMTAsIDksIDgsIDcsIDYsIDUsIDQsIDMsIDIsIDEsXG5dO1xuZXhwb3J0IGNvbnN0IFNHRl9MRVRURVJTID0gW1xuICAnYScsXG4gICdiJyxcbiAgJ2MnLFxuICAnZCcsXG4gICdlJyxcbiAgJ2YnLFxuICAnZycsXG4gICdoJyxcbiAgJ2knLFxuICAnaicsXG4gICdrJyxcbiAgJ2wnLFxuICAnbScsXG4gICduJyxcbiAgJ28nLFxuICAncCcsXG4gICdxJyxcbiAgJ3InLFxuICAncycsXG5dO1xuLy8gZXhwb3J0IGNvbnN0IEJMQU5LX0FSUkFZID0gY2h1bmsobmV3IEFycmF5KDM2MSkuZmlsbCgwKSwgMTkpO1xuZXhwb3J0IGNvbnN0IERPVF9TSVpFID0gMztcbmV4cG9ydCBjb25zdCBFWFBBTkRfSCA9IDU7XG5leHBvcnQgY29uc3QgRVhQQU5EX1YgPSA1O1xuZXhwb3J0IGNvbnN0IFJFU1BPTlNFX1RJTUUgPSAxMDA7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIGJvYXJkU2l6ZTogMTksXG4gIHBhZGRpbmc6IDE1LFxuICBleHRlbnQ6IDIsXG4gIGludGVyYWN0aXZlOiBmYWxzZSxcbiAgY29vcmRpbmF0ZTogdHJ1ZSxcbiAgdGhlbWU6IFRoZW1lLkZsYXQsXG4gIGJhY2tncm91bmQ6IGZhbHNlLFxuICB6b29tOiBmYWxzZSxcbiAgc2hvd0FuYWx5c2lzOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBjb25zdCBUSEVNRV9SRVNPVVJDRVM6IHtcbiAgW2tleSBpbiBUaGVtZV06IHtcbiAgICBib2FyZD86IHN0cmluZztcbiAgICBibGFja3M6IHN0cmluZ1tdO1xuICAgIHdoaXRlczogc3RyaW5nW107XG4gICAgbG93UmVzPzoge1xuICAgICAgYm9hcmQ/OiBzdHJpbmc7XG4gICAgICBibGFja3M6IHN0cmluZ1tdO1xuICAgICAgd2hpdGVzOiBzdHJpbmdbXTtcbiAgICB9O1xuICB9O1xufSA9IHtcbiAgW1RoZW1lLkJsYWNrQW5kV2hpdGVdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxuICBbVGhlbWUuU3ViZHVlZF06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc3ViZHVlZC9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3N1YmR1ZWQvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc3ViZHVlZC93aGl0ZS5wbmdgXSxcbiAgfSxcbiAgW1RoZW1lLlNoZWxsU3RvbmVdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTAucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMS5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUyLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTMucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlNC5wbmdgLFxuICAgIF0sXG4gIH0sXG4gIFtUaGVtZS5TbGF0ZUFuZFNoZWxsXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTEucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTIucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTMucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTQucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTUucG5nYCxcbiAgICBdLFxuICAgIHdoaXRlczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsMS5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsMi5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsMy5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsNC5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsNS5wbmdgLFxuICAgIF0sXG4gIH0sXG4gIFtUaGVtZS5XYWxudXRdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3dhbG51dC9ib2FyZC5qcGdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3dhbG51dC9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS93YWxudXQvd2hpdGUucG5nYF0sXG4gIH0sXG4gIFtUaGVtZS5QaG90b3JlYWxpc3RpY106IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvcGhvdG9yZWFsaXN0aWMvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9waG90b3JlYWxpc3RpYy9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9waG90b3JlYWxpc3RpYy93aGl0ZS5wbmdgXSxcbiAgfSxcbiAgW1RoZW1lLkZsYXRdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxuICBbVGhlbWUuV2FybV06IHtcbiAgICBibGFja3M6IFtdLFxuICAgIHdoaXRlczogW10sXG4gIH0sXG4gIFtUaGVtZS5EYXJrXToge1xuICAgIGJsYWNrczogW10sXG4gICAgd2hpdGVzOiBbXSxcbiAgfSxcbiAgW1RoZW1lLll1bnppTW9ua2V5RGFya106IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUveW1kL3l1bnppLW1vbmtleS1kYXJrL1lNRC1Cby1WMTBfbGVzc2JvcmRlcjE5MjBweC5wbmdgLFxuICAgIGJsYWNrczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUveW1kL3l1bnppLW1vbmtleS1kYXJrL1lNRC1CLXYxNC0zMzhweC5wbmdgLFxuICAgIF0sXG4gICAgd2hpdGVzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQveXVuemktbW9ua2V5LWRhcmsvWU1ELVctdjE0LTMzOHB4LnBuZ2AsXG4gICAgXSxcbiAgICBsb3dSZXM6IHtcbiAgICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQveXVuemktbW9ua2V5LWRhcmsvWU1ELUJvLVYxMF9sZXNzYm9yZGVyLTk2MHB4LnBuZ2AsXG4gICAgICBibGFja3M6IFtcbiAgICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUveW1kL3l1bnppLW1vbmtleS1kYXJrL1lNRC1CLXYxNC0xMzVweC5wbmdgLFxuICAgICAgXSxcbiAgICAgIHdoaXRlczogW1xuICAgICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQveXVuemktbW9ua2V5LWRhcmsvWU1ELVctdjE0LTEzNXB4LnBuZ2AsXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG4gIFtUaGVtZS5IaWdoQ29udHJhc3RdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IExJR0hUX0dSRUVOX1JHQiA9ICdyZ2JhKDEzNiwgMTcwLCA2MCwgMSknO1xuZXhwb3J0IGNvbnN0IExJR0hUX1lFTExPV19SR0IgPSAncmdiYSgyMDYsIDIxMCwgODMsIDEpJztcbmV4cG9ydCBjb25zdCBZRUxMT1dfUkdCID0gJ3JnYmEoMjQyLCAyMTcsIDYwLCAxKSc7XG5leHBvcnQgY29uc3QgTElHSFRfUkVEX1JHQiA9ICdyZ2JhKDIzNiwgMTQ2LCA3MywgMSknO1xuIiwiZXhwb3J0IGNvbnN0IE1PVkVfUFJPUF9MSVNUID0gW1xuICAnQicsXG4gIC8vIEtPIGlzIHN0YW5kYXJkIGluIG1vdmUgbGlzdCBidXQgdXN1YWxseSBiZSB1c2VkIGZvciBrb21pIGluIGdhbWVpbmZvIHByb3BzXG4gIC8vICdLTycsXG4gICdNTicsXG4gICdXJyxcbl07XG5leHBvcnQgY29uc3QgU0VUVVBfUFJPUF9MSVNUID0gW1xuICAnQUInLFxuICAnQUUnLFxuICAnQVcnLFxuICAvL1RPRE86IFBMIGlzIGEgdmFsdWUgb2YgY29sb3IgdHlwZVxuICAvLyAnUEwnXG5dO1xuZXhwb3J0IGNvbnN0IE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QgPSBbXG4gICdBJyxcbiAgJ0MnLFxuICAnRE0nLFxuICAnR0InLFxuICAnR1cnLFxuICAnSE8nLFxuICAnTicsXG4gICdVQycsXG4gICdWJyxcbl07XG5leHBvcnQgY29uc3QgTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCA9IFtcbiAgJ0JNJyxcbiAgJ0RPJyxcbiAgJ0lUJyxcbiAgLy8gVEUgaXMgc3RhbmRhcmQgaW4gbW92ZSBhbm5vdGF0aW9uIGZvciB0ZXN1amlcbiAgLy8gJ1RFJyxcbl07XG5leHBvcnQgY29uc3QgTUFSS1VQX1BST1BfTElTVCA9IFtcbiAgJ0FSJyxcbiAgJ0NSJyxcbiAgJ0xCJyxcbiAgJ0xOJyxcbiAgJ01BJyxcbiAgJ1NMJyxcbiAgJ1NRJyxcbiAgJ1RSJyxcbl07XG5cbmV4cG9ydCBjb25zdCBST09UX1BST1BfTElTVCA9IFsnQVAnLCAnQ0EnLCAnRkYnLCAnR00nLCAnU1QnLCAnU1onXTtcbmV4cG9ydCBjb25zdCBHQU1FX0lORk9fUFJPUF9MSVNUID0gW1xuICAvL1RFIE5vbi1zdGFuZGFyZFxuICAnVEUnLFxuICAvL0tPIE5vbi1zdGFuZGFyZFxuICAnS08nLFxuICAnQU4nLFxuICAnQlInLFxuICAnQlQnLFxuICAnQ1AnLFxuICAnRFQnLFxuICAnRVYnLFxuICAnR04nLFxuICAnR0MnLFxuICAnT04nLFxuICAnT1QnLFxuICAnUEInLFxuICAnUEMnLFxuICAnUFcnLFxuICAnUkUnLFxuICAnUk8nLFxuICAnUlUnLFxuICAnU08nLFxuICAnVE0nLFxuICAnVVMnLFxuICAnV1InLFxuICAnV1QnLFxuXTtcbmV4cG9ydCBjb25zdCBUSU1JTkdfUFJPUF9MSVNUID0gWydCTCcsICdPQicsICdPVycsICdXTCddO1xuZXhwb3J0IGNvbnN0IE1JU0NFTExBTkVPVVNfUFJPUF9MSVNUID0gWydGRycsICdQTScsICdWVyddO1xuXG5leHBvcnQgY29uc3QgQ1VTVE9NX1BST1BfTElTVCA9IFsnUEknLCAnUEFJJywgJ05JRCcsICdQQVQnXTtcblxuZXhwb3J0IGNvbnN0IExJU1RfT0ZfUE9JTlRTX1BST1AgPSBbJ0FCJywgJ0FFJywgJ0FXJywgJ01BJywgJ1NMJywgJ1NRJywgJ1RSJ107XG5cbmNvbnN0IFRPS0VOX1JFR0VYID0gbmV3IFJlZ0V4cCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcblxuZXhwb3J0IGNsYXNzIFNnZlByb3BCYXNlIHtcbiAgcHVibGljIHRva2VuOiBzdHJpbmc7XG4gIHB1YmxpYyB0eXBlOiBzdHJpbmcgPSAnLSc7XG4gIHByb3RlY3RlZCBfdmFsdWU6IHN0cmluZyA9ICcnO1xuICBwcm90ZWN0ZWQgX3ZhbHVlczogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSBhcyBzdHJpbmc7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYCR7dGhpcy50b2tlbn0ke3RoaXMuX3ZhbHVlcy5tYXAodiA9PiBgWyR7dn1dYCkuam9pbignJyl9YDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW92ZVByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdtb3ZlJztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE1vdmVQcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE1vdmVQcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0dXBQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdzZXR1cCc7XG4gIH1cblxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IHRva2VuTWF0Y2ggPSBzdHIubWF0Y2goVE9LRU5fUkVHRVgpO1xuICAgIGNvbnN0IHZhbE1hdGNoZXMgPSBzdHIubWF0Y2hBbGwoL1xcWyhbXFxzXFxTXSo/KVxcXS9nKTtcblxuICAgIGxldCB0b2tlbiA9ICcnO1xuICAgIGNvbnN0IHZhbHMgPSBbLi4udmFsTWF0Y2hlc10ubWFwKG0gPT4gbVsxXSk7XG4gICAgaWYgKHRva2VuTWF0Y2gpIHRva2VuID0gdG9rZW5NYXRjaFsxXTtcbiAgICByZXR1cm4gbmV3IFNldHVwUHJvcCh0b2tlbiwgdmFscyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9kZUFubm90YXRpb25Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbm9kZS1hbm5vdGF0aW9uJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBOb2RlQW5ub3RhdGlvblByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZUFubm90YXRpb25Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW92ZUFubm90YXRpb25Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbW92ZS1hbm5vdGF0aW9uJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBNb3ZlQW5ub3RhdGlvblByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTW92ZUFubm90YXRpb25Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7fVxuZXhwb3J0IGNsYXNzIE1hcmt1cFByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ21hcmt1cCc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0b2tlbk1hdGNoID0gc3RyLm1hdGNoKFRPS0VOX1JFR0VYKTtcbiAgICBjb25zdCB2YWxNYXRjaGVzID0gc3RyLm1hdGNoQWxsKC9cXFsoW1xcc1xcU10qPylcXF0vZyk7XG5cbiAgICBsZXQgdG9rZW4gPSAnJztcbiAgICBjb25zdCB2YWxzID0gWy4uLnZhbE1hdGNoZXNdLm1hcChtID0+IG1bMV0pO1xuICAgIGlmICh0b2tlbk1hdGNoKSB0b2tlbiA9IHRva2VuTWF0Y2hbMV07XG4gICAgcmV0dXJuIG5ldyBNYXJrdXBQcm9wKHRva2VuLCB2YWxzKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb290UHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ3Jvb3QnO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IFJvb3RQcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJvb3RQcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2FtZUluZm9Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnZ2FtZS1pbmZvJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBHYW1lSW5mb1Byb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgR2FtZUluZm9Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbVByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdjdXN0b20nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IEN1c3RvbVByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ3VzdG9tUHJvcCgnJywgJycpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1pbmdQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnVGltaW5nJztcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWlzY2VsbGFuZW91c1Byb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7fVxuIiwiaW1wb3J0IHtjbG9uZURlZXB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1NHRl9MRVRURVJTfSBmcm9tICcuL2NvbnN0JztcblxuLy8gVE9ETzogRHVwbGljYXRlIHdpdGggaGVscGVycy50cyB0byBhdm9pZCBjaXJjdWxhciBkZXBlbmRlbmN5XG5leHBvcnQgY29uc3Qgc2dmVG9Qb3MgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qga2kgPSBzdHJbMF0gPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3QgdGVtcFN0ciA9IC9cXFsoLiopXFxdLy5leGVjKHN0cik7XG4gIGlmICh0ZW1wU3RyKSB7XG4gICAgY29uc3QgcG9zID0gdGVtcFN0clsxXTtcbiAgICBjb25zdCB4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihwb3NbMF0pO1xuICAgIGNvbnN0IHkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1sxXSk7XG4gICAgcmV0dXJuIHt4LCB5LCBraX07XG4gIH1cbiAgcmV0dXJuIHt4OiAtMSwgeTogLTEsIGtpOiAwfTtcbn07XG5cbmxldCBsaWJlcnRpZXMgPSAwO1xubGV0IHJlY3Vyc2lvblBhdGg6IHN0cmluZ1tdID0gW107XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc2l6ZSBvZiBhIG1hdHJpeC5cbiAqIEBwYXJhbSBtYXQgVGhlIG1hdHJpeCB0byBjYWxjdWxhdGUgdGhlIHNpemUgb2YuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1iZXIgb2Ygcm93cyBhbmQgY29sdW1ucyBpbiB0aGUgbWF0cml4LlxuICovXG5jb25zdCBjYWxjU2l6ZSA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgY29uc3Qgcm93c1NpemUgPSBtYXQubGVuZ3RoO1xuICBjb25zdCBjb2x1bW5zU2l6ZSA9IG1hdC5sZW5ndGggPiAwID8gbWF0WzBdLmxlbmd0aCA6IDA7XG4gIHJldHVybiBbcm93c1NpemUsIGNvbHVtbnNTaXplXTtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbGliZXJ0eSBvZiBhIHN0b25lIG9uIHRoZSBib2FyZC5cbiAqIEBwYXJhbSBtYXQgLSBUaGUgYm9hcmQgbWF0cml4LlxuICogQHBhcmFtIHggLSBUaGUgeC1jb29yZGluYXRlIG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSB5IC0gVGhlIHktY29vcmRpbmF0ZSBvZiB0aGUgc3RvbmUuXG4gKiBAcGFyYW0ga2kgLSBUaGUgdmFsdWUgb2YgdGhlIHN0b25lLlxuICovXG5jb25zdCBjYWxjTGliZXJ0eUNvcmUgPSAobWF0OiBudW1iZXJbXVtdLCB4OiBudW1iZXIsIHk6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCBzaXplID0gY2FsY1NpemUobWF0KTtcbiAgaWYgKHggPj0gMCAmJiB4IDwgc2l6ZVsxXSAmJiB5ID49IDAgJiYgeSA8IHNpemVbMF0pIHtcbiAgICBpZiAobWF0W3hdW3ldID09PSBraSAmJiAhcmVjdXJzaW9uUGF0aC5pbmNsdWRlcyhgJHt4fSwke3l9YCkpIHtcbiAgICAgIHJlY3Vyc2lvblBhdGgucHVzaChgJHt4fSwke3l9YCk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4IC0gMSwgeSwga2kpO1xuICAgICAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCArIDEsIHksIGtpKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHgsIHkgLSAxLCBraSk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4LCB5ICsgMSwga2kpO1xuICAgIH0gZWxzZSBpZiAobWF0W3hdW3ldID09PSAwKSB7XG4gICAgICBsaWJlcnRpZXMgKz0gMTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGNhbGNMaWJlcnR5ID0gKG1hdDogbnVtYmVyW11bXSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3Qgc2l6ZSA9IGNhbGNTaXplKG1hdCk7XG4gIGxpYmVydGllcyA9IDA7XG4gIHJlY3Vyc2lvblBhdGggPSBbXTtcblxuICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+IHNpemVbMV0gLSAxIHx8IHkgPiBzaXplWzBdIC0gMSkge1xuICAgIHJldHVybiB7XG4gICAgICBsaWJlcnR5OiA0LFxuICAgICAgcmVjdXJzaW9uUGF0aDogW10sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChtYXRbeF1beV0gPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGliZXJ0eTogNCxcbiAgICAgIHJlY3Vyc2lvblBhdGg6IFtdLFxuICAgIH07XG4gIH1cbiAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCwgeSwga2kpO1xuICByZXR1cm4ge1xuICAgIGxpYmVydHk6IGxpYmVydGllcyxcbiAgICByZWN1cnNpb25QYXRoLFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGV4ZWNDYXB0dXJlID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogbnVtYmVyXG4pID0+IHtcbiAgY29uc3QgbmV3QXJyYXkgPSBtYXQ7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5VXAsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhVcH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSxcbiAgICBqIC0gMSxcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eURvd24sIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhEb3dufSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogKyAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5TGVmdCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aExlZnR9ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGkgLSAxLFxuICAgIGosXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlSaWdodCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFJpZ2h0fSA9XG4gICAgY2FsY0xpYmVydHkobWF0LCBpICsgMSwgaiwga2kpO1xuICBpZiAobGliZXJ0eVVwID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aFVwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGl0ZW0uc3BsaXQoJywnKTtcbiAgICAgIG5ld0FycmF5W3BhcnNlSW50KGNvb3JkWzBdKV1bcGFyc2VJbnQoY29vcmRbMV0pXSA9IDA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGxpYmVydHlEb3duID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aERvd24uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICBpZiAobGliZXJ0eUxlZnQgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoTGVmdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdBcnJheVtwYXJzZUludChjb29yZFswXSldW3BhcnNlSW50KGNvb3JkWzFdKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIGlmIChsaWJlcnR5UmlnaHQgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoUmlnaHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbmV3QXJyYXk7XG59O1xuXG5jb25zdCBjYW5DYXB0dXJlID0gKG1hdDogbnVtYmVyW11bXSwgaTogbnVtYmVyLCBqOiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlVcCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFVwfSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogLSAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5RG93biwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aERvd259ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiArIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlMZWZ0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoTGVmdH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSAtIDEsXG4gICAgaixcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVJpZ2h0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoUmlnaHR9ID1cbiAgICBjYWxjTGliZXJ0eShtYXQsIGkgKyAxLCBqLCBraSk7XG4gIGlmIChsaWJlcnR5VXAgPT09IDAgJiYgcmVjdXJzaW9uUGF0aFVwLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobGliZXJ0eURvd24gPT09IDAgJiYgcmVjdXJzaW9uUGF0aERvd24ubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChsaWJlcnR5TGVmdCA9PT0gMCAmJiByZWN1cnNpb25QYXRoTGVmdC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGxpYmVydHlSaWdodCA9PT0gMCAmJiByZWN1cnNpb25QYXRoUmlnaHQubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYW5Nb3ZlID0gKG1hdDogbnVtYmVyW11bXSwgaTogbnVtYmVyLCBqOiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3QgbmV3QXJyYXkgPSBjbG9uZURlZXAobWF0KTtcbiAgaWYgKGkgPCAwIHx8IGogPCAwIHx8IGkgPj0gbWF0Lmxlbmd0aCB8fCBqID49IChtYXRbMF0/Lmxlbmd0aCA/PyAwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChtYXRbaV1bal0gIT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBuZXdBcnJheVtpXVtqXSA9IGtpO1xuICBjb25zdCB7bGliZXJ0eX0gPSBjYWxjTGliZXJ0eShuZXdBcnJheSwgaSwgaiwga2kpO1xuICBpZiAoY2FuQ2FwdHVyZShuZXdBcnJheSwgaSwgaiwgLWtpKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChjYW5DYXB0dXJlKG5ld0FycmF5LCBpLCBqLCBraSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGxpYmVydHkgPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hvd0tpID0gKFxuICBhcnJheTogbnVtYmVyW11bXSxcbiAgc3RlcHM6IHN0cmluZ1tdLFxuICBpc0NhcHR1cmVkID0gdHJ1ZVxuKSA9PiB7XG4gIGxldCBuZXdNYXQgPSBjbG9uZURlZXAoYXJyYXkpO1xuICBsZXQgaGFzTW92ZWQgPSBmYWxzZTtcbiAgc3RlcHMuZm9yRWFjaChzdHIgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAga2ksXG4gICAgfToge1xuICAgICAgeDogbnVtYmVyO1xuICAgICAgeTogbnVtYmVyO1xuICAgICAga2k6IG51bWJlcjtcbiAgICB9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgICBpZiAoaXNDYXB0dXJlZCkge1xuICAgICAgaWYgKGNhbk1vdmUobmV3TWF0LCB4LCB5LCBraSkpIHtcbiAgICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICAgIG5ld01hdCA9IGV4ZWNDYXB0dXJlKG5ld01hdCwgeCwgeSwgLWtpKTtcbiAgICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJyYW5nZW1lbnQ6IG5ld01hdCxcbiAgICBoYXNNb3ZlZCxcbiAgfTtcbn07XG4iLCJpbXBvcnQge2NvbXBhY3QsIHJlcGxhY2V9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBidWlsZE5vZGVSYW5nZXMsXG4gIGlzSW5BbnlSYW5nZSxcbiAgY2FsY0hhc2gsXG4gIGdldERlZHVwbGljYXRlZFByb3BzLFxuICBnZXROb2RlTnVtYmVyLFxufSBmcm9tICcuL2hlbHBlcnMnO1xuXG5pbXBvcnQge1RyZWVNb2RlbCwgVE5vZGV9IGZyb20gJy4vdHJlZSc7XG5pbXBvcnQge1xuICBNb3ZlUHJvcCxcbiAgU2V0dXBQcm9wLFxuICBSb290UHJvcCxcbiAgR2FtZUluZm9Qcm9wLFxuICBTZ2ZQcm9wQmFzZSxcbiAgTm9kZUFubm90YXRpb25Qcm9wLFxuICBNb3ZlQW5ub3RhdGlvblByb3AsXG4gIE1hcmt1cFByb3AsXG4gIEN1c3RvbVByb3AsXG4gIFJPT1RfUFJPUF9MSVNULFxuICBNT1ZFX1BST1BfTElTVCxcbiAgU0VUVVBfUFJPUF9MSVNULFxuICBNQVJLVVBfUFJPUF9MSVNULFxuICBOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBHQU1FX0lORk9fUFJPUF9MSVNULFxuICBDVVNUT01fUFJPUF9MSVNULFxufSBmcm9tICcuL3Byb3BzJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIFNHRiAoU21hcnQgR2FtZSBGb3JtYXQpIGZpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZ2Yge1xuICBORVdfTk9ERSA9ICc7JztcbiAgQlJBTkNISU5HID0gWycoJywgJyknXTtcbiAgUFJPUEVSVFkgPSBbJ1snLCAnXSddO1xuICBMSVNUX0lERU5USVRJRVMgPSBbXG4gICAgJ0FXJyxcbiAgICAnQUInLFxuICAgICdBRScsXG4gICAgJ0FSJyxcbiAgICAnQ1InLFxuICAgICdERCcsXG4gICAgJ0xCJyxcbiAgICAnTE4nLFxuICAgICdNQScsXG4gICAgJ1NMJyxcbiAgICAnU1EnLFxuICAgICdUUicsXG4gICAgJ1ZXJyxcbiAgICAnVEInLFxuICAgICdUVycsXG4gIF07XG4gIE5PREVfREVMSU1JVEVSUyA9IFt0aGlzLk5FV19OT0RFXS5jb25jYXQodGhpcy5CUkFOQ0hJTkcpO1xuXG4gIHRyZWU6IFRyZWVNb2RlbCA9IG5ldyBUcmVlTW9kZWwoKTtcbiAgcm9vdDogVE5vZGUgfCBudWxsID0gbnVsbDtcbiAgbm9kZTogVE5vZGUgfCBudWxsID0gbnVsbDtcbiAgY3VycmVudE5vZGU6IFROb2RlIHwgbnVsbCA9IG51bGw7XG4gIHBhcmVudE5vZGU6IFROb2RlIHwgbnVsbCA9IG51bGw7XG4gIG5vZGVQcm9wczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgU2dmIGNsYXNzLlxuICAgKiBAcGFyYW0gY29udGVudCBUaGUgY29udGVudCBvZiB0aGUgU2dmLCBlaXRoZXIgYXMgYSBzdHJpbmcgb3IgYXMgYSBUTm9kZShSb290IG5vZGUpLlxuICAgKiBAcGFyYW0gcGFyc2VPcHRpb25zIFRoZSBvcHRpb25zIGZvciBwYXJzaW5nIHRoZSBTZ2YgY29udGVudC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY29udGVudD86IHN0cmluZyB8IFROb2RlLFxuICAgIHByaXZhdGUgcGFyc2VPcHRpb25zID0ge1xuICAgICAgaWdub3JlUHJvcExpc3Q6IFtdLFxuICAgIH1cbiAgKSB7XG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5wYXJzZShjb250ZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5zZXRSb290KGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSByb290IG5vZGUgb2YgdGhlIFNHRiB0cmVlLlxuICAgKlxuICAgKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCBub2RlIHRvIHNldC5cbiAgICogQHJldHVybnMgVGhlIHVwZGF0ZWQgU0dGIGluc3RhbmNlLlxuICAgKi9cbiAgc2V0Um9vdChyb290OiBUTm9kZSkge1xuICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGN1cnJlbnQgU0dGIHRyZWUgdG8gYW4gU0dGIHN0cmluZyByZXByZXNlbnRhdGlvbi5cbiAgICogQHJldHVybnMgVGhlIFNHRiBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyZWUuXG4gICAqL1xuICB0b1NnZigpIHtcbiAgICByZXR1cm4gYCgke3RoaXMubm9kZVRvU3RyaW5nKHRoaXMucm9vdCl9KWA7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGdhbWUgdHJlZSB0byBTR0YgZm9ybWF0IHdpdGhvdXQgaW5jbHVkaW5nIGFuYWx5c2lzIGRhdGEuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBTR0YgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWUgdHJlZS5cbiAgICovXG4gIHRvU2dmV2l0aG91dEFuYWx5c2lzKCkge1xuICAgIGNvbnN0IHNnZiA9IGAoJHt0aGlzLm5vZGVUb1N0cmluZyh0aGlzLnJvb3QpfSlgO1xuICAgIHJldHVybiByZXBsYWNlKHNnZiwgL10oQVxcWy4qP1xcXSkvZywgJ10nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZXMgdGhlIGdpdmVuIFNHRiAoU21hcnQgR2FtZSBGb3JtYXQpIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHNnZiAtIFRoZSBTR0Ygc3RyaW5nIHRvIHBhcnNlLlxuICAgKi9cbiAgcGFyc2Uoc2dmOiBzdHJpbmcpIHtcbiAgICBpZiAoIXNnZikgcmV0dXJuO1xuICAgIHNnZiA9IHNnZi5yZXBsYWNlKC9cXHMrKD8hW15cXFtcXF1dKl0pL2dtLCAnJyk7XG4gICAgbGV0IG5vZGVTdGFydCA9IDA7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGNvbnN0IHN0YWNrOiBUTm9kZVtdID0gW107XG5cbiAgICBjb25zdCBpbk5vZGVSYW5nZXMgPSBidWlsZE5vZGVSYW5nZXMoc2dmKS5zb3J0KChhLCBiKSA9PiBhWzBdIC0gYlswXSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNnZi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYyA9IHNnZltpXTtcbiAgICAgIGNvbnN0IGluc2lkZVByb3AgPSBpc0luQW55UmFuZ2UoaSwgaW5Ob2RlUmFuZ2VzKTtcblxuICAgICAgaWYgKHRoaXMuTk9ERV9ERUxJTUlURVJTLmluY2x1ZGVzKGMpICYmICFpbnNpZGVQcm9wKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBzZ2Yuc2xpY2Uobm9kZVN0YXJ0LCBpKTtcbiAgICAgICAgaWYgKGNvbnRlbnQgIT09ICcnKSB7XG4gICAgICAgICAgY29uc3QgbW92ZVByb3BzOiBNb3ZlUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3Qgc2V0dXBQcm9wczogU2V0dXBQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCByb290UHJvcHM6IFJvb3RQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBtYXJrdXBQcm9wczogTWFya3VwUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgZ2FtZUluZm9Qcm9wczogR2FtZUluZm9Qcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBub2RlQW5ub3RhdGlvblByb3BzOiBOb2RlQW5ub3RhdGlvblByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IG1vdmVBbm5vdGF0aW9uUHJvcHM6IE1vdmVBbm5vdGF0aW9uUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgY3VzdG9tUHJvcHM6IEN1c3RvbVByb3BbXSA9IFtdO1xuXG4gICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IFtcbiAgICAgICAgICAgIC4uLmNvbnRlbnQubWF0Y2hBbGwoXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvKFtBLVpdK1xcW1thLXpcXFtcXF1dKlxcXSspLywgJ2cnKVxuICAgICAgICAgICAgICAvLyBSZWdFeHAoLyhbQS1aXStcXFsuKj9cXF0rKS8sICdnJylcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC9bQS1aXSsoXFxbLio/XFxdKXsxLH0vLCAnZycpXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvW0EtWl0rKFxcW1tcXHNcXFNdKj9cXF0pezEsfS8sICdnJyksXG4gICAgICAgICAgICAgIFJlZ0V4cCgvXFx3KyhcXFtbXlxcXV0qP1xcXSg/Olxccj9cXG4/XFxzW15cXF1dKj8pKil7MSx9LywgJ2cnKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgbWF0Y2hlcy5mb3JFYWNoKG0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdG9rZW5NYXRjaCA9IG1bMF0ubWF0Y2goLyhbQS1aXSspXFxbLyk7XG4gICAgICAgICAgICBpZiAodG9rZW5NYXRjaCkge1xuICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2VuTWF0Y2hbMV07XG4gICAgICAgICAgICAgIGlmIChNT1ZFX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBtb3ZlUHJvcHMucHVzaChNb3ZlUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoU0VUVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHNldHVwUHJvcHMucHVzaChTZXR1cFByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKFJPT1RfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHJvb3RQcm9wcy5wdXNoKFJvb3RQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG1hcmt1cFByb3BzLnB1c2goTWFya3VwUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoR0FNRV9JTkZPX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBnYW1lSW5mb1Byb3BzLnB1c2goR2FtZUluZm9Qcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG5vZGVBbm5vdGF0aW9uUHJvcHMucHVzaChOb2RlQW5ub3RhdGlvblByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcy5wdXNoKE1vdmVBbm5vdGF0aW9uUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoQ1VTVE9NX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBjdXN0b21Qcm9wcy5wdXNoKEN1c3RvbVByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc2ggPSBjYWxjSGFzaCh0aGlzLmN1cnJlbnROb2RlLCBtb3ZlUHJvcHMpO1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMudHJlZS5wYXJzZSh7XG4gICAgICAgICAgICAgIGlkOiBoYXNoLFxuICAgICAgICAgICAgICBuYW1lOiBoYXNoLFxuICAgICAgICAgICAgICBpbmRleDogY291bnRlcixcbiAgICAgICAgICAgICAgbnVtYmVyOiAwLFxuICAgICAgICAgICAgICBtb3ZlUHJvcHMsXG4gICAgICAgICAgICAgIHNldHVwUHJvcHMsXG4gICAgICAgICAgICAgIHJvb3RQcm9wcyxcbiAgICAgICAgICAgICAgbWFya3VwUHJvcHMsXG4gICAgICAgICAgICAgIGdhbWVJbmZvUHJvcHMsXG4gICAgICAgICAgICAgIG5vZGVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgICAgICAgIG1vdmVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgICAgICAgIGN1c3RvbVByb3BzLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlKSB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgICAgbm9kZS5tb2RlbC5udW1iZXIgPSBnZXROb2RlTnVtYmVyKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5yb290ID0gbm9kZTtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcoJyAmJiB0aGlzLmN1cnJlbnROb2RlICYmICFpbnNpZGVQcm9wKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3NnZltpXX0ke3NnZltpICsgMV19JHtzZ2ZbaSArIDJdfWApO1xuICAgICAgICBzdGFjay5wdXNoKHRoaXMuY3VycmVudE5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcpJyAmJiAhaW5zaWRlUHJvcCAmJiBzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5OT0RFX0RFTElNSVRFUlMuaW5jbHVkZXMoYykgJiYgIWluc2lkZVByb3ApIHtcbiAgICAgICAgbm9kZVN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBub2RlIHRvIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSAtIFRoZSBub2RlIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5vZGUuXG4gICAqL1xuICBwcml2YXRlIG5vZGVUb1N0cmluZyhub2RlOiBhbnkpIHtcbiAgICBsZXQgY29udGVudCA9ICcnO1xuICAgIG5vZGUud2FsaygobjogVE5vZGUpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcm9vdFByb3BzLFxuICAgICAgICBtb3ZlUHJvcHMsXG4gICAgICAgIGN1c3RvbVByb3BzLFxuICAgICAgICBzZXR1cFByb3BzLFxuICAgICAgICBtYXJrdXBQcm9wcyxcbiAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgZ2FtZUluZm9Qcm9wcyxcbiAgICAgIH0gPSBuLm1vZGVsO1xuICAgICAgY29uc3Qgbm9kZXMgPSBjb21wYWN0KFtcbiAgICAgICAgLi4ucm9vdFByb3BzLFxuICAgICAgICAuLi5jdXN0b21Qcm9wcyxcbiAgICAgICAgLi4ubW92ZVByb3BzLFxuICAgICAgICAuLi5nZXREZWR1cGxpY2F0ZWRQcm9wcyhzZXR1cFByb3BzKSxcbiAgICAgICAgLi4uZ2V0RGVkdXBsaWNhdGVkUHJvcHMobWFya3VwUHJvcHMpLFxuICAgICAgICAuLi5nYW1lSW5mb1Byb3BzLFxuICAgICAgICAuLi5ub2RlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICAuLi5tb3ZlQW5ub3RhdGlvblByb3BzLFxuICAgICAgXSk7XG4gICAgICBjb250ZW50ICs9ICc7JztcbiAgICAgIG5vZGVzLmZvckVhY2goKG46IFNnZlByb3BCYXNlKSA9PiB7XG4gICAgICAgIGNvbnRlbnQgKz0gbi50b1N0cmluZygpO1xuICAgICAgfSk7XG4gICAgICBpZiAobi5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgIG4uY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IFROb2RlKSA9PiB7XG4gICAgICAgICAgY29udGVudCArPSBgKCR7dGhpcy5ub2RlVG9TdHJpbmcoY2hpbGQpfSlgO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuLmNoaWxkcmVuLmxlbmd0aCA8IDI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbn1cbiIsImltcG9ydCB7VHJlZU1vZGVsLCBUTm9kZX0gZnJvbSAnLi9jb3JlL3RyZWUnO1xuaW1wb3J0IHtjbG9uZURlZXAsIGZsYXR0ZW5EZXB0aCwgY2xvbmUsIHN1bSwgY29tcGFjdCwgc2FtcGxlfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtTZ2ZOb2RlLCBTZ2ZOb2RlT3B0aW9uc30gZnJvbSAnLi9jb3JlL3R5cGVzJztcbmltcG9ydCB7XG4gIGlzTW92ZU5vZGUsXG4gIGlzU2V0dXBOb2RlLFxuICBjYWxjSGFzaCxcbiAgZ2V0Tm9kZU51bWJlcixcbiAgaXNSb290Tm9kZSxcbn0gZnJvbSAnLi9jb3JlL2hlbHBlcnMnO1xuZXhwb3J0IHtpc01vdmVOb2RlLCBpc1NldHVwTm9kZSwgY2FsY0hhc2gsIGdldE5vZGVOdW1iZXIsIGlzUm9vdE5vZGV9O1xuaW1wb3J0IHtcbiAgQTFfTEVUVEVSUyxcbiAgQTFfTlVNQkVSUyxcbiAgU0dGX0xFVFRFUlMsXG4gIE1BWF9CT0FSRF9TSVpFLFxuICBMSUdIVF9HUkVFTl9SR0IsXG4gIExJR0hUX1lFTExPV19SR0IsXG4gIExJR0hUX1JFRF9SR0IsXG4gIFlFTExPV19SR0IsXG4gIERFRkFVTFRfQk9BUkRfU0laRSxcbn0gZnJvbSAnLi9jb25zdCc7XG5pbXBvcnQge1xuICBTZXR1cFByb3AsXG4gIE1vdmVQcm9wLFxuICBDdXN0b21Qcm9wLFxuICBTZ2ZQcm9wQmFzZSxcbiAgTm9kZUFubm90YXRpb25Qcm9wLFxuICBHYW1lSW5mb1Byb3AsXG4gIE1vdmVBbm5vdGF0aW9uUHJvcCxcbiAgUm9vdFByb3AsXG4gIE1hcmt1cFByb3AsXG4gIE1PVkVfUFJPUF9MSVNULFxuICBTRVRVUF9QUk9QX0xJU1QsXG4gIE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QsXG4gIE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QsXG4gIE1BUktVUF9QUk9QX0xJU1QsXG4gIFJPT1RfUFJPUF9MSVNULFxuICBHQU1FX0lORk9fUFJPUF9MSVNULFxuICBUSU1JTkdfUFJPUF9MSVNULFxuICBNSVNDRUxMQU5FT1VTX1BST1BfTElTVCxcbiAgQ1VTVE9NX1BST1BfTElTVCxcbn0gZnJvbSAnLi9jb3JlL3Byb3BzJztcbmltcG9ydCB7XG4gIEFuYWx5c2lzLFxuICBHaG9zdEJhbk9wdGlvbnMsXG4gIEtpLFxuICBNb3ZlSW5mbyxcbiAgUHJvYmxlbUFuc3dlclR5cGUgYXMgUEFULFxuICBSb290SW5mbyxcbiAgTWFya3VwLFxuICBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQge0NlbnRlcn0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge2Nhbk1vdmUsIGV4ZWNDYXB0dXJlfSBmcm9tICcuL2JvYXJkY29yZSc7XG5leHBvcnQge2Nhbk1vdmUsIGV4ZWNDYXB0dXJlfTtcblxuaW1wb3J0IHtTZ2Z9IGZyb20gJy4vY29yZS9zZ2YnO1xuXG50eXBlIFN0cmF0ZWd5ID0gJ3Bvc3QnIHwgJ3ByZScgfCAnYm90aCc7XG5cbmNvbnN0IFNwYXJrTUQ1ID0gcmVxdWlyZSgnc3BhcmstbWQ1Jyk7XG5cbmV4cG9ydCBjb25zdCBjYWxjRG91YnRmdWxNb3Zlc1RocmVzaG9sZFJhbmdlID0gKHRocmVzaG9sZDogbnVtYmVyKSA9PiB7XG4gIC8vIDhELTlEXG4gIGlmICh0aHJlc2hvbGQgPj0gMjUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4xNV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtM119LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTMsIC0yXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTIsIC0xXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMSwgLTAuNV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gNUQtN0RcbiAgaWYgKHRocmVzaG9sZCA+PSAyMyAmJiB0aHJlc2hvbGQgPCAyNSkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjJdLCBzY29yZVJhbmdlOiBbLTEwMCwgLThdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjIsIC0wLjE1XSwgc2NvcmVSYW5nZTogWy04LCAtNF19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjE1LCAtMC4wNV0sIHNjb3JlUmFuZ2U6IFstNCwgLTJdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDUsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0yLCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cblxuICAvLyAzRC01RFxuICBpZiAodGhyZXNob2xkID49IDIwICYmIHRocmVzaG9sZCA8IDIzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMjVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTEyXX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4yNSwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMTIsIC01XX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTUsIC0yXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMiwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDFELTNEXG4gIGlmICh0aHJlc2hvbGQgPj0gMTggJiYgdGhyZXNob2xkIDwgMjApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4zXSwgc2NvcmVSYW5nZTogWy0xMDAsIC0xNV19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMywgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMTUsIC03XX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTcsIC01XX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstNSwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDVLLTFLXG4gIGlmICh0aHJlc2hvbGQgPj0gMTMgJiYgdGhyZXNob2xkIDwgMTgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4zNV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMjBdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjM1LCAtMC4xMl0sIHNjb3JlUmFuZ2U6IFstMjAsIC0xMF19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEyLCAtMC4wOF0sIHNjb3JlUmFuZ2U6IFstMTAsIC01XX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA4LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstNSwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDVLLTEwS1xuICBpZiAodGhyZXNob2xkID49IDggJiYgdGhyZXNob2xkIDwgMTMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC40XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0yNV19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuNCwgLTAuMTVdLCBzY29yZVJhbmdlOiBbLTI1LCAtMTBdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xNSwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMTAsIC01XX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy01LCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gMThLLTEwS1xuICBpZiAodGhyZXNob2xkID49IDAgJiYgdGhyZXNob2xkIDwgOCkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjQ1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0zNV19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuNDUsIC0wLjJdLCBzY29yZVJhbmdlOiBbLTM1LCAtMjBdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4yLCAtMC4xXSwgc2NvcmVSYW5nZTogWy0yMCwgLTEwXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0xMCwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIHJldHVybiB7XG4gICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4zXSwgc2NvcmVSYW5nZTogWy0xMDAsIC0zMF19LFxuICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjMsIC0wLjJdLCBzY29yZVJhbmdlOiBbLTMwLCAtMjBdfSxcbiAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMiwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMjAsIC0xMF19LFxuICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTEwLCAtMV19LFxuICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3Qgcm91bmQyID0gKHY6IG51bWJlciwgc2NhbGUgPSAxLCBmaXhlZCA9IDIpID0+IHtcbiAgcmV0dXJuICgoTWF0aC5yb3VuZCh2ICogMTAwKSAvIDEwMCkgKiBzY2FsZSkudG9GaXhlZChmaXhlZCk7XG59O1xuXG5leHBvcnQgY29uc3Qgcm91bmQzID0gKHY6IG51bWJlciwgc2NhbGUgPSAxLCBmaXhlZCA9IDMpID0+IHtcbiAgcmV0dXJuICgoTWF0aC5yb3VuZCh2ICogMTAwMCkgLyAxMDAwKSAqIHNjYWxlKS50b0ZpeGVkKGZpeGVkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc0Fuc3dlck5vZGUgPSAobjogVE5vZGUsIGtpbmQ6IFBBVCkgPT4ge1xuICBjb25zdCBwYXQgPSBuLm1vZGVsLmN1c3RvbVByb3BzPy5maW5kKChwOiBDdXN0b21Qcm9wKSA9PiBwLnRva2VuID09PSAnUEFUJyk7XG4gIHJldHVybiBwYXQ/LnZhbHVlID09PSBraW5kO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQ2hvaWNlTm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gISFjPy52YWx1ZS5pbmNsdWRlcygnQ0hPSUNFJyk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNUYXJnZXROb2RlID0gaXNDaG9pY2VOb2RlO1xuXG5leHBvcnQgY29uc3QgaXNGb3JjZU5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuIGM/LnZhbHVlLmluY2x1ZGVzKCdGT1JDRScpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUHJldmVudE1vdmVOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnTk9UVEhJUycpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzUmlnaHRMZWFmID0gKG46IFROb2RlKSA9PiB7XG4vLyAgIHJldHVybiBpc1JpZ2h0Tm9kZShuKSAmJiAhbi5oYXNDaGlsZHJlbigpO1xuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGlzUmlnaHROb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiAhIWM/LnZhbHVlLmluY2x1ZGVzKCdSSUdIVCcpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzRmlyc3RSaWdodExlYWYgPSAobjogVE5vZGUpID0+IHtcbi8vICAgY29uc3Qgcm9vdCA9IG4uZ2V0UGF0aCgpWzBdO1xuLy8gICBjb25zdCBmaXJzdFJpZ2h0TGVhdmUgPSByb290LmZpcnN0KChuOiBUTm9kZSkgPT5cbi8vICAgICBpc1JpZ2h0TGVhZihuKVxuLy8gICApO1xuLy8gICByZXR1cm4gZmlyc3RSaWdodExlYXZlPy5tb2RlbC5pZCA9PT0gbi5tb2RlbC5pZDtcbi8vIH07XG5cbmV4cG9ydCBjb25zdCBpc0ZpcnN0UmlnaHROb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IHJvb3QgPSBuLmdldFBhdGgoKVswXTtcbiAgY29uc3QgZmlyc3RSaWdodE5vZGUgPSByb290LmZpcnN0KG4gPT4gaXNSaWdodE5vZGUobikpO1xuICByZXR1cm4gZmlyc3RSaWdodE5vZGU/Lm1vZGVsLmlkID09PSBuLm1vZGVsLmlkO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzVmFyaWFudE5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuICEhYz8udmFsdWUuaW5jbHVkZXMoJ1ZBUklBTlQnKTtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBpc1ZhcmlhbnRMZWFmID0gKG46IFROb2RlKSA9PiB7XG4vLyAgIHJldHVybiBpc1ZhcmlhbnROb2RlKG4pICYmICFuLmhhc0NoaWxkcmVuKCk7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaXNXcm9uZ05vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuICghYz8udmFsdWUuaW5jbHVkZXMoJ1ZBUklBTlQnKSAmJiAhYz8udmFsdWUuaW5jbHVkZXMoJ1JJR0hUJykpIHx8ICFjO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzV3JvbmdMZWFmID0gKG46IFROb2RlKSA9PiB7XG4vLyAgIHJldHVybiBpc1dyb25nTm9kZShuKSAmJiAhbi5oYXNDaGlsZHJlbigpO1xuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGluUGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIGRldGVjdGlvbk1ldGhvZDogKG46IFROb2RlKSA9PiBib29sZWFuLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXVxuKSA9PiB7XG4gIGNvbnN0IHBhdGggPSBwcmVOb2RlcyA/PyBub2RlLmdldFBhdGgoKTtcbiAgY29uc3QgcG9zdFJpZ2h0Tm9kZXMgPVxuICAgIHBvc3ROb2Rlcz8uZmlsdGVyKChuOiBUTm9kZSkgPT4gZGV0ZWN0aW9uTWV0aG9kKG4pKSA/P1xuICAgIG5vZGUuYWxsKChuOiBUTm9kZSkgPT4gZGV0ZWN0aW9uTWV0aG9kKG4pKTtcbiAgY29uc3QgcHJlUmlnaHROb2RlcyA9IHBhdGguZmlsdGVyKChuOiBUTm9kZSkgPT4gZGV0ZWN0aW9uTWV0aG9kKG4pKTtcblxuICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdDpcbiAgICAgIHJldHVybiBwb3N0UmlnaHROb2Rlcy5sZW5ndGggPiAwO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlByZTpcbiAgICAgIHJldHVybiBwcmVSaWdodE5vZGVzLmxlbmd0aCA+IDA7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuQm90aDpcbiAgICAgIHJldHVybiBwcmVSaWdodE5vZGVzLmxlbmd0aCA+IDAgfHwgcG9zdFJpZ2h0Tm9kZXMubGVuZ3RoID4gMDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5SaWdodFBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKSA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNSaWdodE5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbkZpcnN0UmlnaHRQYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gaW5QYXRoKG5vZGUsIGlzRmlyc3RSaWdodE5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbkZpcnN0QnJhbmNoUmlnaHRQYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5QcmUsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIGlmICghaW5SaWdodFBhdGgobm9kZSkpIHJldHVybiBmYWxzZTtcblxuICBjb25zdCBwYXRoID0gcHJlTm9kZXMgPz8gbm9kZS5nZXRQYXRoKCk7XG4gIGNvbnN0IHBvc3RSaWdodE5vZGVzID0gcG9zdE5vZGVzID8/IG5vZGUuYWxsKCgpID0+IHRydWUpO1xuXG4gIGxldCByZXN1bHQgPSBbXTtcbiAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3Q6XG4gICAgICByZXN1bHQgPSBwb3N0UmlnaHROb2Rlcy5maWx0ZXIobiA9PiBuLmdldEluZGV4KCkgPiAwKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlByZTpcbiAgICAgIHJlc3VsdCA9IHBhdGguZmlsdGVyKG4gPT4gbi5nZXRJbmRleCgpID4gMCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Cb3RoOlxuICAgICAgcmVzdWx0ID0gcGF0aC5jb25jYXQocG9zdFJpZ2h0Tm9kZXMpLmZpbHRlcihuID0+IG4uZ2V0SW5kZXgoKSA+IDApO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA9PT0gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBpbkNob2ljZVBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNDaG9pY2VOb2RlLCBzdHJhdGVneSwgcHJlTm9kZXMsIHBvc3ROb2Rlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5UYXJnZXRQYXRoID0gaW5DaG9pY2VQYXRoO1xuXG5leHBvcnQgY29uc3QgaW5WYXJpYW50UGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc1ZhcmlhbnROb2RlLCBzdHJhdGVneSwgcHJlTm9kZXMsIHBvc3ROb2Rlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5Xcm9uZ1BhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNXcm9uZ05vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBuRm9ybWF0dGVyID0gKG51bTogbnVtYmVyLCBmaXhlZCA9IDEpID0+IHtcbiAgY29uc3QgbG9va3VwID0gW1xuICAgIHt2YWx1ZTogMSwgc3ltYm9sOiAnJ30sXG4gICAge3ZhbHVlOiAxZTMsIHN5bWJvbDogJ2snfSxcbiAgICB7dmFsdWU6IDFlNiwgc3ltYm9sOiAnTSd9LFxuICAgIHt2YWx1ZTogMWU5LCBzeW1ib2w6ICdHJ30sXG4gICAge3ZhbHVlOiAxZTEyLCBzeW1ib2w6ICdUJ30sXG4gICAge3ZhbHVlOiAxZTE1LCBzeW1ib2w6ICdQJ30sXG4gICAge3ZhbHVlOiAxZTE4LCBzeW1ib2w6ICdFJ30sXG4gIF07XG4gIGNvbnN0IHJ4ID0gL1xcLjArJHwoXFwuWzAtOV0qWzEtOV0pMCskLztcbiAgY29uc3QgaXRlbSA9IGxvb2t1cFxuICAgIC5zbGljZSgpXG4gICAgLnJldmVyc2UoKVxuICAgIC5maW5kKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIG51bSA+PSBpdGVtLnZhbHVlO1xuICAgIH0pO1xuICByZXR1cm4gaXRlbVxuICAgID8gKG51bSAvIGl0ZW0udmFsdWUpLnRvRml4ZWQoZml4ZWQpLnJlcGxhY2UocngsICckMScpICsgaXRlbS5zeW1ib2xcbiAgICA6ICcwJztcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9JbmRleGVzID0gKHBhdGg6IFROb2RlW10pOiBzdHJpbmdbXSA9PiB7XG4gIHJldHVybiBwYXRoLm1hcChuID0+IG4ubW9kZWwuaWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhdGhUb0luaXRpYWxTdG9uZXMgPSAoXG4gIHBhdGg6IFROb2RlW10sXG4gIHhPZmZzZXQgPSAwLFxuICB5T2Zmc2V0ID0gMFxuKTogc3RyaW5nW10gPT4ge1xuICBjb25zdCBpbml0cyA9IHBhdGhcbiAgICAuZmlsdGVyKG4gPT4gbi5tb2RlbC5zZXR1cFByb3BzLmxlbmd0aCA+IDApXG4gICAgLm1hcChuID0+IHtcbiAgICAgIHJldHVybiBuLm1vZGVsLnNldHVwUHJvcHMubWFwKChzZXR1cDogU2V0dXBQcm9wKSA9PiB7XG4gICAgICAgIHJldHVybiBzZXR1cC52YWx1ZXMubWFwKCh2OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjb25zdCBhID0gQTFfTEVUVEVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHZbMF0pICsgeE9mZnNldF07XG4gICAgICAgICAgY29uc3QgYiA9IEExX05VTUJFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZih2WzFdKSArIHlPZmZzZXRdO1xuICAgICAgICAgIGNvbnN0IHRva2VuID0gc2V0dXAudG9rZW4gPT09ICdBQicgPyAnQicgOiAnVyc7XG4gICAgICAgICAgcmV0dXJuIFt0b2tlbiwgYSArIGJdO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICByZXR1cm4gZmxhdHRlbkRlcHRoKGluaXRzWzBdLCAxKTtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9BaU1vdmVzID0gKHBhdGg6IFROb2RlW10sIHhPZmZzZXQgPSAwLCB5T2Zmc2V0ID0gMCkgPT4ge1xuICBjb25zdCBtb3ZlcyA9IHBhdGhcbiAgICAuZmlsdGVyKG4gPT4gbi5tb2RlbC5tb3ZlUHJvcHMubGVuZ3RoID4gMClcbiAgICAubWFwKG4gPT4ge1xuICAgICAgY29uc3QgcHJvcCA9IG4ubW9kZWwubW92ZVByb3BzWzBdO1xuICAgICAgY29uc3QgYSA9IEExX0xFVFRFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZihwcm9wLnZhbHVlWzBdKSArIHhPZmZzZXRdO1xuICAgICAgY29uc3QgYiA9IEExX05VTUJFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZihwcm9wLnZhbHVlWzFdKSArIHlPZmZzZXRdO1xuICAgICAgcmV0dXJuIFtwcm9wLnRva2VuLCBhICsgYl07XG4gICAgfSk7XG4gIHJldHVybiBtb3Zlcztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEZyb21BbmFseXNpcyA9IChhOiBBbmFseXNpcykgPT4ge1xuICBpZiAoL2luZGV4ZXMvLnRlc3QoYS5pZCkpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhLmlkKS5pbmRleGVzWzBdO1xuICB9XG4gIHJldHVybiAnJztcbn07XG5cbmV4cG9ydCBjb25zdCBpc01haW5QYXRoID0gKG5vZGU6IFROb2RlKSA9PiB7XG4gIHJldHVybiBzdW0obm9kZS5nZXRQYXRoKCkubWFwKG4gPT4gbi5nZXRJbmRleCgpKSkgPT09IDA7XG59O1xuXG5leHBvcnQgY29uc3Qgc2dmVG9Qb3MgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qga2kgPSBzdHJbMF0gPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3QgdGVtcFN0ciA9IC9cXFsoLiopXFxdLy5leGVjKHN0cik7XG4gIGlmICh0ZW1wU3RyKSB7XG4gICAgY29uc3QgcG9zID0gdGVtcFN0clsxXTtcbiAgICBjb25zdCB4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihwb3NbMF0pO1xuICAgIGNvbnN0IHkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1sxXSk7XG4gICAgcmV0dXJuIHt4LCB5LCBraX07XG4gIH1cbiAgcmV0dXJuIHt4OiAtMSwgeTogLTEsIGtpOiAwfTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZUb0ExID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHt4LCB5fSA9IHNnZlRvUG9zKHN0cik7XG4gIHJldHVybiBBMV9MRVRURVJTW3hdICsgQTFfTlVNQkVSU1t5XTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvUG9zID0gKG1vdmU6IHN0cmluZykgPT4ge1xuICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pO1xuICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSk7XG4gIHJldHVybiB7eCwgeX07XG59O1xuXG5leHBvcnQgY29uc3QgYTFUb0luZGV4ID0gKG1vdmU6IHN0cmluZywgYm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3QgeCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKTtcbiAgY29uc3QgeSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpO1xuICByZXR1cm4geCAqIGJvYXJkU2l6ZSArIHk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2dmT2Zmc2V0ID0gKHNnZjogYW55LCBvZmZzZXQgPSAwKSA9PiB7XG4gIGlmIChvZmZzZXQgPT09IDApIHJldHVybiBzZ2Y7XG4gIGNvbnN0IHJlcyA9IGNsb25lKHNnZik7XG4gIGNvbnN0IGNoYXJJbmRleCA9IFNHRl9MRVRURVJTLmluZGV4T2Yoc2dmWzJdKSAtIG9mZnNldDtcbiAgcmV0dXJuIHJlcy5zdWJzdHIoMCwgMikgKyBTR0ZfTEVUVEVSU1tjaGFySW5kZXhdICsgcmVzLnN1YnN0cigyICsgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgYTFUb1NHRiA9IChzdHI6IGFueSwgdHlwZSA9ICdCJywgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwKSA9PiB7XG4gIGlmIChzdHIgPT09ICdwYXNzJykgcmV0dXJuIGAke3R5cGV9W11gO1xuICBjb25zdCBpbnggPSBBMV9MRVRURVJTLmluZGV4T2Yoc3RyWzBdKSArIG9mZnNldFg7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChzdHIuc3Vic3RyKDEpLCAwKSkgKyBvZmZzZXRZO1xuICBjb25zdCBzZ2YgPSBgJHt0eXBlfVske1NHRl9MRVRURVJTW2lueF19JHtTR0ZfTEVUVEVSU1tpbnldfV1gO1xuICByZXR1cm4gc2dmO1xufTtcblxuZXhwb3J0IGNvbnN0IHBvc1RvU2dmID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBraTogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGF4ID0gU0dGX0xFVFRFUlNbeF07XG4gIGNvbnN0IGF5ID0gU0dGX0xFVFRFUlNbeV07XG4gIGlmIChraSA9PT0gS2kuRW1wdHkpIHJldHVybiAnJztcbiAgaWYgKGtpID09PSBLaS5XaGl0ZSkgcmV0dXJuIGBCWyR7YXh9JHtheX1dYDtcbiAgaWYgKGtpID09PSBLaS5CbGFjaykgcmV0dXJuIGBXWyR7YXh9JHtheX1dYDtcbiAgcmV0dXJuICcnO1xufTtcblxuZXhwb3J0IGNvbnN0IG1hdFRvUG9zaXRpb24gPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgeE9mZnNldD86IG51bWJlcixcbiAgeU9mZnNldD86IG51bWJlclxuKSA9PiB7XG4gIGxldCByZXN1bHQgPSAnJztcbiAgeE9mZnNldCA9IHhPZmZzZXQgPz8gMDtcbiAgeU9mZnNldCA9IHlPZmZzZXQgPz8gREVGQVVMVF9CT0FSRF9TSVpFIC0gbWF0Lmxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBtYXRbaV1bal07XG4gICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgY29uc3QgeCA9IEExX0xFVFRFUlNbaSArIHhPZmZzZXRdO1xuICAgICAgICBjb25zdCB5ID0gQTFfTlVNQkVSU1tqICsgeU9mZnNldF07XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdmFsdWUgPT09IDEgPyAnYicgOiAndyc7XG4gICAgICAgIHJlc3VsdCArPSBgJHtjb2xvcn0gJHt4fSR7eX0gYDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBtYXRUb0xpc3RPZlR1cGxlcyA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICB4T2Zmc2V0ID0gMCxcbiAgeU9mZnNldCA9IDBcbikgPT4ge1xuICBjb25zdCByZXN1bHRzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IHggPSBBMV9MRVRURVJTW2kgKyB4T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgeSA9IEExX05VTUJFUlNbaiArIHlPZmZzZXRdO1xuICAgICAgICBjb25zdCBjb2xvciA9IHZhbHVlID09PSAxID8gJ0InIDogJ1cnO1xuICAgICAgICByZXN1bHRzLnB1c2goW2NvbG9yLCB4ICsgeV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbmV4cG9ydCBjb25zdCBjb252ZXJ0U3RvbmVUeXBlVG9TdHJpbmcgPSAodHlwZTogYW55KSA9PiAodHlwZSA9PT0gMSA/ICdCJyA6ICdXJyk7XG5cbmV4cG9ydCBjb25zdCBjb252ZXJ0U3RlcHNGb3JBSSA9IChzdGVwczogYW55LCBvZmZzZXQgPSAwKSA9PiB7XG4gIGxldCByZXMgPSBjbG9uZShzdGVwcyk7XG4gIHJlcyA9IHJlcy5tYXAoKHM6IGFueSkgPT4gc2dmT2Zmc2V0KHMsIG9mZnNldCkpO1xuICBjb25zdCBoZWFkZXIgPSBgKDtGRls0XUdNWzFdU1pbJHtcbiAgICAxOSAtIG9mZnNldFxuICB9XUdOWzIyNl1QQltCbGFja11IQVswXVBXW1doaXRlXUtNWzcuNV1EVFsyMDE3LTA4LTAxXVRNWzE4MDBdUlVbQ2hpbmVzZV1DUFtDb3B5cmlnaHQgZ2hvc3QtZ28uY29tXUFQW2dob3N0LWdvLmNvbV1QTFtCbGFja107YDtcbiAgbGV0IGNvdW50ID0gMDtcbiAgbGV0IHByZXYgPSAnJztcbiAgc3RlcHMuZm9yRWFjaCgoc3RlcDogYW55LCBpbmRleDogYW55KSA9PiB7XG4gICAgaWYgKHN0ZXBbMF0gPT09IHByZXZbMF0pIHtcbiAgICAgIGlmIChzdGVwWzBdID09PSAnQicpIHtcbiAgICAgICAgcmVzLnNwbGljZShpbmRleCArIGNvdW50LCAwLCAnV1t0dF0nKTtcbiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5zcGxpY2UoaW5kZXggKyBjb3VudCwgMCwgJ0JbdHRdJyk7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHByZXYgPSBzdGVwO1xuICB9KTtcbiAgcmV0dXJuIGAke2hlYWRlcn0ke3Jlcy5qb2luKCc7Jyl9KWA7XG59O1xuXG5leHBvcnQgY29uc3Qgb2Zmc2V0QTFNb3ZlID0gKG1vdmU6IHN0cmluZywgb3ggPSAwLCBveSA9IDApID0+IHtcbiAgaWYgKG1vdmUgPT09ICdwYXNzJykgcmV0dXJuIG1vdmU7XG4gIC8vIGNvbnNvbGUubG9nKCdveHknLCBveCwgb3kpO1xuICBjb25zdCBpbnggPSBBMV9MRVRURVJTLmluZGV4T2YobW92ZVswXSkgKyBveDtcbiAgY29uc3QgaW55ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSkgKyBveTtcbiAgLy8gY29uc29sZS5sb2coJ2lueHknLCBpbngsIGlueSwgYCR7QTFfTEVUVEVSU1tpbnhdfSR7QTFfTlVNQkVSU1tpbnldfWApO1xuICByZXR1cm4gYCR7QTFfTEVUVEVSU1tpbnhdfSR7QTFfTlVNQkVSU1tpbnldfWA7XG59O1xuXG5leHBvcnQgY29uc3QgcmV2ZXJzZU9mZnNldEExTW92ZSA9IChcbiAgbW92ZTogc3RyaW5nLFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGFuYWx5c2lzOiBBbmFseXNpcyxcbiAgYm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBpZiAobW92ZSA9PT0gJ3Bhc3MnKSByZXR1cm4gbW92ZTtcbiAgY29uc3QgaWRPYmogPSBKU09OLnBhcnNlKGFuYWx5c2lzLmlkKTtcbiAgY29uc3Qge3gsIHl9ID0gcmV2ZXJzZU9mZnNldChtYXQsIGlkT2JqLmJ4LCBpZE9iai5ieSwgYm9hcmRTaXplKTtcbiAgY29uc3QgaW54ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pICsgeDtcbiAgY29uc3QgaW55ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSkgKyB5O1xuICByZXR1cm4gYCR7QTFfTEVUVEVSU1tpbnhdfSR7QTFfTlVNQkVSU1tpbnldfWA7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1Njb3JlRGlmZlRleHQgPSAoXG4gIHJvb3RJbmZvPzogUm9vdEluZm8gfCBudWxsLFxuICBjdXJySW5mbz86IE1vdmVJbmZvIHwgUm9vdEluZm8gfCBudWxsLFxuICBmaXhlZCA9IDEsXG4gIHJldmVyc2UgPSBmYWxzZVxuKSA9PiB7XG4gIGlmICghcm9vdEluZm8gfHwgIWN1cnJJbmZvKSByZXR1cm4gJyc7XG4gIGxldCBzY29yZSA9IGNhbGNTY29yZURpZmYocm9vdEluZm8sIGN1cnJJbmZvKTtcbiAgaWYgKHJldmVyc2UpIHNjb3JlID0gLXNjb3JlO1xuICBjb25zdCBmaXhlZFNjb3JlID0gc2NvcmUudG9GaXhlZChmaXhlZCk7XG5cbiAgcmV0dXJuIHNjb3JlID4gMCA/IGArJHtmaXhlZFNjb3JlfWAgOiBgJHtmaXhlZFNjb3JlfWA7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1dpbnJhdGVEaWZmVGV4dCA9IChcbiAgcm9vdEluZm8/OiBSb290SW5mbyB8IG51bGwsXG4gIGN1cnJJbmZvPzogTW92ZUluZm8gfCBSb290SW5mbyB8IG51bGwsXG4gIGZpeGVkID0gMSxcbiAgcmV2ZXJzZSA9IGZhbHNlXG4pID0+IHtcbiAgaWYgKCFyb290SW5mbyB8fCAhY3VyckluZm8pIHJldHVybiAnJztcbiAgbGV0IHdpbnJhdGUgPSBjYWxjV2lucmF0ZURpZmYocm9vdEluZm8sIGN1cnJJbmZvKTtcbiAgaWYgKHJldmVyc2UpIHdpbnJhdGUgPSAtd2lucmF0ZTtcbiAgY29uc3QgZml4ZWRXaW5yYXRlID0gd2lucmF0ZS50b0ZpeGVkKGZpeGVkKTtcblxuICByZXR1cm4gd2lucmF0ZSA+PSAwID8gYCske2ZpeGVkV2lucmF0ZX0lYCA6IGAke2ZpeGVkV2lucmF0ZX0lYDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjU2NvcmVEaWZmID0gKFxuICByb290SW5mbzogUm9vdEluZm8sXG4gIGN1cnJJbmZvOiBNb3ZlSW5mbyB8IFJvb3RJbmZvXG4pID0+IHtcbiAgY29uc3Qgc2lnbiA9IHJvb3RJbmZvLmN1cnJlbnRQbGF5ZXIgPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3Qgc2NvcmUgPVxuICAgIE1hdGgucm91bmQoKGN1cnJJbmZvLnNjb3JlTGVhZCAtIHJvb3RJbmZvLnNjb3JlTGVhZCkgKiBzaWduICogMTAwMCkgLyAxMDAwO1xuXG4gIHJldHVybiBzY29yZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjV2lucmF0ZURpZmYgPSAoXG4gIHJvb3RJbmZvOiBSb290SW5mbyxcbiAgY3VyckluZm86IE1vdmVJbmZvIHwgUm9vdEluZm9cbikgPT4ge1xuICBjb25zdCBzaWduID0gcm9vdEluZm8uY3VycmVudFBsYXllciA9PT0gJ0InID8gMSA6IC0xO1xuICBjb25zdCBzY29yZSA9XG4gICAgTWF0aC5yb3VuZCgoY3VyckluZm8ud2lucmF0ZSAtIHJvb3RJbmZvLndpbnJhdGUpICogc2lnbiAqIDEwMDAgKiAxMDApIC9cbiAgICAxMDAwO1xuXG4gIHJldHVybiBzY29yZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQW5hbHlzaXNQb2ludENvbG9yID0gKFxuICByb290SW5mbzogUm9vdEluZm8sXG4gIG1vdmVJbmZvOiBNb3ZlSW5mb1xuKSA9PiB7XG4gIGNvbnN0IHtwcmlvciwgb3JkZXJ9ID0gbW92ZUluZm87XG4gIGNvbnN0IHNjb3JlID0gY2FsY1Njb3JlRGlmZihyb290SW5mbywgbW92ZUluZm8pO1xuICBsZXQgcG9pbnRDb2xvciA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSknO1xuICBpZiAoXG4gICAgcHJpb3IgPj0gMC41IHx8XG4gICAgKHByaW9yID49IDAuMSAmJiBvcmRlciA8IDMgJiYgc2NvcmUgPiAtMC4zKSB8fFxuICAgIG9yZGVyID09PSAwIHx8XG4gICAgc2NvcmUgPj0gMFxuICApIHtcbiAgICBwb2ludENvbG9yID0gTElHSFRfR1JFRU5fUkdCO1xuICB9IGVsc2UgaWYgKChwcmlvciA+IDAuMDUgJiYgc2NvcmUgPiAtMC41KSB8fCAocHJpb3IgPiAwLjAxICYmIHNjb3JlID4gLTAuMSkpIHtcbiAgICBwb2ludENvbG9yID0gTElHSFRfWUVMTE9XX1JHQjtcbiAgfSBlbHNlIGlmIChwcmlvciA+IDAuMDEgJiYgc2NvcmUgPiAtMSkge1xuICAgIHBvaW50Q29sb3IgPSBZRUxMT1dfUkdCO1xuICB9IGVsc2Uge1xuICAgIHBvaW50Q29sb3IgPSBMSUdIVF9SRURfUkdCO1xuICB9XG4gIHJldHVybiBwb2ludENvbG9yO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IEdvQmFuRGV0ZWN0aW9uID0gKHBpeGVsRGF0YSwgY2FudmFzKSA9PiB7XG4vLyBjb25zdCBjb2x1bW5zID0gY2FudmFzLndpZHRoO1xuLy8gY29uc3Qgcm93cyA9IGNhbnZhcy5oZWlnaHQ7XG4vLyBjb25zdCBkYXRhVHlwZSA9IEpzRmVhdC5VOEMxX3Q7XG4vLyBjb25zdCBkaXN0TWF0cml4VCA9IG5ldyBKc0ZlYXQubWF0cml4X3QoY29sdW1ucywgcm93cywgZGF0YVR5cGUpO1xuLy8gSnNGZWF0LmltZ3Byb2MuZ3JheXNjYWxlKHBpeGVsRGF0YSwgY29sdW1ucywgcm93cywgZGlzdE1hdHJpeFQpO1xuLy8gSnNGZWF0LmltZ3Byb2MuZ2F1c3NpYW5fYmx1cihkaXN0TWF0cml4VCwgZGlzdE1hdHJpeFQsIDIsIDApO1xuLy8gSnNGZWF0LmltZ3Byb2MuY2FubnkoZGlzdE1hdHJpeFQsIGRpc3RNYXRyaXhULCA1MCwgNTApO1xuXG4vLyBjb25zdCBuZXdQaXhlbERhdGEgPSBuZXcgVWludDMyQXJyYXkocGl4ZWxEYXRhLmJ1ZmZlcik7XG4vLyBjb25zdCBhbHBoYSA9ICgweGZmIDw8IDI0KTtcbi8vIGxldCBpID0gZGlzdE1hdHJpeFQuY29scyAqIGRpc3RNYXRyaXhULnJvd3M7XG4vLyBsZXQgcGl4ID0gMDtcbi8vIHdoaWxlIChpID49IDApIHtcbi8vICAgcGl4ID0gZGlzdE1hdHJpeFQuZGF0YVtpXTtcbi8vICAgbmV3UGl4ZWxEYXRhW2ldID0gYWxwaGEgfCAocGl4IDw8IDE2KSB8IChwaXggPDwgOCkgfCBwaXg7XG4vLyAgIGkgLT0gMTtcbi8vIH1cbi8vIH07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0UEFJID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IHBhaSA9IG4ubW9kZWwuY3VzdG9tUHJvcHMuZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BBSScpO1xuICBpZiAoIXBhaSkgcmV0dXJuO1xuICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShwYWkudmFsdWUpO1xuXG4gIHJldHVybiBkYXRhO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RBbnN3ZXJUeXBlID0gKG46IFROb2RlKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgY29uc3QgcGF0ID0gbi5tb2RlbC5jdXN0b21Qcm9wcy5maW5kKChwOiBDdXN0b21Qcm9wKSA9PiBwLnRva2VuID09PSAnUEFUJyk7XG4gIHJldHVybiBwYXQ/LnZhbHVlO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RQSSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBwaSA9IG4ubW9kZWwuY3VzdG9tUHJvcHMuZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BJJyk7XG4gIGlmICghcGkpIHJldHVybjtcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocGkudmFsdWUpO1xuXG4gIHJldHVybiBkYXRhO1xufTtcblxuZXhwb3J0IGNvbnN0IGluaXROb2RlRGF0YSA9IChzaGE6IHN0cmluZywgbnVtYmVyPzogbnVtYmVyKTogU2dmTm9kZSA9PiB7XG4gIHJldHVybiB7XG4gICAgaWQ6IHNoYSxcbiAgICBuYW1lOiBzaGEsXG4gICAgbnVtYmVyOiBudW1iZXIgfHwgMCxcbiAgICByb290UHJvcHM6IFtdLFxuICAgIG1vdmVQcm9wczogW10sXG4gICAgc2V0dXBQcm9wczogW10sXG4gICAgbWFya3VwUHJvcHM6IFtdLFxuICAgIGdhbWVJbmZvUHJvcHM6IFtdLFxuICAgIG5vZGVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIG1vdmVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIGN1c3RvbVByb3BzOiBbXSxcbiAgfTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgaW5pdGlhbCByb290IG5vZGUgb2YgdGhlIHRyZWUuXG4gKlxuICogQHBhcmFtIHJvb3RQcm9wcyAtIFRoZSByb290IHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyBUaGUgaW5pdGlhbCByb290IG5vZGUuXG4gKi9cbmV4cG9ydCBjb25zdCBpbml0aWFsUm9vdE5vZGUgPSAoXG4gIHJvb3RQcm9wcyA9IFtcbiAgICAnRkZbNF0nLFxuICAgICdHTVsxXScsXG4gICAgJ0NBW1VURi04XScsXG4gICAgJ0FQW2dob3N0Z286MC4xLjBdJyxcbiAgICAnU1pbMTldJyxcbiAgICAnU1RbMF0nLFxuICBdXG4pID0+IHtcbiAgY29uc3QgdHJlZSA9IG5ldyBUcmVlTW9kZWwoKTtcbiAgY29uc3Qgcm9vdCA9IHRyZWUucGFyc2Uoe1xuICAgIC8vICcxYjE2YjEnIGlzIHRoZSBTSEEyNTYgaGFzaCBvZiB0aGUgJ24nXG4gICAgaWQ6ICcnLFxuICAgIG5hbWU6ICcnLFxuICAgIGluZGV4OiAwLFxuICAgIG51bWJlcjogMCxcbiAgICByb290UHJvcHM6IHJvb3RQcm9wcy5tYXAocCA9PiBSb290UHJvcC5mcm9tKHApKSxcbiAgICBtb3ZlUHJvcHM6IFtdLFxuICAgIHNldHVwUHJvcHM6IFtdLFxuICAgIG1hcmt1cFByb3BzOiBbXSxcbiAgICBnYW1lSW5mb1Byb3BzOiBbXSxcbiAgICBub2RlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBtb3ZlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBjdXN0b21Qcm9wczogW10sXG4gIH0pO1xuICBjb25zdCBoYXNoID0gY2FsY0hhc2gocm9vdCk7XG4gIHJvb3QubW9kZWwuaWQgPSBoYXNoO1xuXG4gIHJldHVybiByb290O1xufTtcblxuLyoqXG4gKiBCdWlsZHMgYSBuZXcgdHJlZSBub2RlIHdpdGggdGhlIGdpdmVuIG1vdmUsIHBhcmVudCBub2RlLCBhbmQgYWRkaXRpb25hbCBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSBtb3ZlIC0gVGhlIG1vdmUgdG8gYmUgYWRkZWQgdG8gdGhlIG5vZGUuXG4gKiBAcGFyYW0gcGFyZW50Tm9kZSAtIFRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgbmV3IG5vZGUuIE9wdGlvbmFsLlxuICogQHBhcmFtIHByb3BzIC0gQWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRvIGJlIGFkZGVkIHRvIHRoZSBuZXcgbm9kZS4gT3B0aW9uYWwuXG4gKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCB0cmVlIG5vZGUuXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZE1vdmVOb2RlID0gKFxuICBtb3ZlOiBzdHJpbmcsXG4gIHBhcmVudE5vZGU/OiBUTm9kZSxcbiAgcHJvcHM/OiBTZ2ZOb2RlT3B0aW9uc1xuKSA9PiB7XG4gIGNvbnN0IHRyZWUgPSBuZXcgVHJlZU1vZGVsKCk7XG4gIGNvbnN0IG1vdmVQcm9wID0gTW92ZVByb3AuZnJvbShtb3ZlKTtcbiAgY29uc3QgaGFzaCA9IGNhbGNIYXNoKHBhcmVudE5vZGUsIFttb3ZlUHJvcF0pO1xuICBsZXQgbnVtYmVyID0gMTtcbiAgaWYgKHBhcmVudE5vZGUpIG51bWJlciA9IGdldE5vZGVOdW1iZXIocGFyZW50Tm9kZSkgKyAxO1xuICBjb25zdCBub2RlRGF0YSA9IGluaXROb2RlRGF0YShoYXNoLCBudW1iZXIpO1xuICBub2RlRGF0YS5tb3ZlUHJvcHMgPSBbbW92ZVByb3BdO1xuXG4gIGNvbnN0IG5vZGUgPSB0cmVlLnBhcnNlKHtcbiAgICAuLi5ub2RlRGF0YSxcbiAgICAuLi5wcm9wcyxcbiAgfSk7XG4gIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldExhc3RJbmRleCA9IChyb290OiBUTm9kZSkgPT4ge1xuICBsZXQgbGFzdE5vZGUgPSByb290O1xuICByb290LndhbGsobm9kZSA9PiB7XG4gICAgLy8gSGFsdCB0aGUgdHJhdmVyc2FsIGJ5IHJldHVybmluZyBmYWxzZVxuICAgIGxhc3ROb2RlID0gbm9kZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG4gIHJldHVybiBsYXN0Tm9kZS5tb2RlbC5pbmRleDtcbn07XG5cbmV4cG9ydCBjb25zdCBjdXRNb3ZlTm9kZXMgPSAocm9vdDogVE5vZGUsIHJldHVyblJvb3Q/OiBib29sZWFuKSA9PiB7XG4gIGxldCBub2RlID0gY2xvbmVEZWVwKHJvb3QpO1xuICB3aGlsZSAobm9kZSAmJiBub2RlLmhhc0NoaWxkcmVuKCkgJiYgbm9kZS5tb2RlbC5tb3ZlUHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgbm9kZSA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgbm9kZS5jaGlsZHJlbiA9IFtdO1xuICB9XG5cbiAgaWYgKHJldHVyblJvb3QpIHtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlLnBhcmVudCAmJiAhbm9kZS5pc1Jvb3QoKSkge1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFJvb3QgPSAobm9kZTogVE5vZGUpID0+IHtcbiAgbGV0IHJvb3QgPSBub2RlO1xuICB3aGlsZSAocm9vdCAmJiByb290LnBhcmVudCAmJiAhcm9vdC5pc1Jvb3QoKSkge1xuICAgIHJvb3QgPSByb290LnBhcmVudDtcbiAgfVxuICByZXR1cm4gcm9vdDtcbn07XG5cbmV4cG9ydCBjb25zdCB6ZXJvcyA9IChzaXplOiBbbnVtYmVyLCBudW1iZXJdKTogbnVtYmVyW11bXSA9PlxuICBuZXcgQXJyYXkoc2l6ZVswXSkuZmlsbCgwKS5tYXAoKCkgPT4gbmV3IEFycmF5KHNpemVbMV0pLmZpbGwoMCkpO1xuXG5leHBvcnQgY29uc3QgZW1wdHkgPSAoc2l6ZTogW251bWJlciwgbnVtYmVyXSk6IHN0cmluZ1tdW10gPT5cbiAgbmV3IEFycmF5KHNpemVbMF0pLmZpbGwoJycpLm1hcCgoKSA9PiBuZXcgQXJyYXkoc2l6ZVsxXSkuZmlsbCgnJykpO1xuXG5leHBvcnQgY29uc3QgY2FsY01vc3QgPSAobWF0OiBudW1iZXJbXVtdLCBib2FyZFNpemUgPSAxOSkgPT4ge1xuICBsZXQgbGVmdE1vc3Q6IG51bWJlciA9IGJvYXJkU2l6ZSAtIDE7XG4gIGxldCByaWdodE1vc3QgPSAwO1xuICBsZXQgdG9wTW9zdDogbnVtYmVyID0gYm9hcmRTaXplIC0gMTtcbiAgbGV0IGJvdHRvbU1vc3QgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG1hdFtpXVtqXTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICBpZiAobGVmdE1vc3QgPiBpKSBsZWZ0TW9zdCA9IGk7XG4gICAgICAgIGlmIChyaWdodE1vc3QgPCBpKSByaWdodE1vc3QgPSBpO1xuICAgICAgICBpZiAodG9wTW9zdCA+IGopIHRvcE1vc3QgPSBqO1xuICAgICAgICBpZiAoYm90dG9tTW9zdCA8IGopIGJvdHRvbU1vc3QgPSBqO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ge2xlZnRNb3N0LCByaWdodE1vc3QsIHRvcE1vc3QsIGJvdHRvbU1vc3R9O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNDZW50ZXIgPSAobWF0OiBudW1iZXJbXVtdLCBib2FyZFNpemUgPSAxOSkgPT4ge1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQsIGJvYXJkU2l6ZSk7XG4gIGNvbnN0IHRvcCA9IHRvcE1vc3QgPCBib2FyZFNpemUgLSAxIC0gYm90dG9tTW9zdDtcbiAgY29uc3QgbGVmdCA9IGxlZnRNb3N0IDwgYm9hcmRTaXplIC0gMSAtIHJpZ2h0TW9zdDtcbiAgaWYgKHRvcCAmJiBsZWZ0KSByZXR1cm4gQ2VudGVyLlRvcExlZnQ7XG4gIGlmICghdG9wICYmIGxlZnQpIHJldHVybiBDZW50ZXIuQm90dG9tTGVmdDtcbiAgaWYgKHRvcCAmJiAhbGVmdCkgcmV0dXJuIENlbnRlci5Ub3BSaWdodDtcbiAgaWYgKCF0b3AgJiYgIWxlZnQpIHJldHVybiBDZW50ZXIuQm90dG9tUmlnaHQ7XG4gIHJldHVybiBDZW50ZXIuQ2VudGVyO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNCb2FyZFNpemUgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgYm9hcmRTaXplID0gMTksXG4gIGV4dGVudCA9IDJcbik6IG51bWJlcltdID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gWzE5LCAxOV07XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcbiAgY29uc3Qge2xlZnRNb3N0LCByaWdodE1vc3QsIHRvcE1vc3QsIGJvdHRvbU1vc3R9ID0gY2FsY01vc3QobWF0LCBib2FyZFNpemUpO1xuICBpZiAoY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCkge1xuICAgIHJlc3VsdFswXSA9IHJpZ2h0TW9zdCArIGV4dGVudCArIDE7XG4gICAgcmVzdWx0WzFdID0gYm90dG9tTW9zdCArIGV4dGVudCArIDE7XG4gIH1cbiAgaWYgKGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0KSB7XG4gICAgcmVzdWx0WzBdID0gYm9hcmRTaXplIC0gbGVmdE1vc3QgKyBleHRlbnQ7XG4gICAgcmVzdWx0WzFdID0gYm90dG9tTW9zdCArIGV4dGVudCArIDE7XG4gIH1cbiAgaWYgKGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQpIHtcbiAgICByZXN1bHRbMF0gPSByaWdodE1vc3QgKyBleHRlbnQgKyAxO1xuICAgIHJlc3VsdFsxXSA9IGJvYXJkU2l6ZSAtIHRvcE1vc3QgKyBleHRlbnQ7XG4gIH1cbiAgaWYgKGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0KSB7XG4gICAgcmVzdWx0WzBdID0gYm9hcmRTaXplIC0gbGVmdE1vc3QgKyBleHRlbnQ7XG4gICAgcmVzdWx0WzFdID0gYm9hcmRTaXplIC0gdG9wTW9zdCArIGV4dGVudDtcbiAgfVxuICByZXN1bHRbMF0gPSBNYXRoLm1pbihyZXN1bHRbMF0sIGJvYXJkU2l6ZSk7XG4gIHJlc3VsdFsxXSA9IE1hdGgubWluKHJlc3VsdFsxXSwgYm9hcmRTaXplKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNQYXJ0aWFsQXJlYSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBleHRlbnQgPSAyLFxuICBib2FyZFNpemUgPSAxOVxuKTogW1tudW1iZXIsIG51bWJlcl0sIFtudW1iZXIsIG51bWJlcl1dID0+IHtcbiAgY29uc3Qge2xlZnRNb3N0LCByaWdodE1vc3QsIHRvcE1vc3QsIGJvdHRvbU1vc3R9ID0gY2FsY01vc3QobWF0KTtcblxuICBjb25zdCBzaXplID0gYm9hcmRTaXplIC0gMTtcbiAgY29uc3QgeDEgPSBsZWZ0TW9zdCAtIGV4dGVudCA8IDAgPyAwIDogbGVmdE1vc3QgLSBleHRlbnQ7XG4gIGNvbnN0IHkxID0gdG9wTW9zdCAtIGV4dGVudCA8IDAgPyAwIDogdG9wTW9zdCAtIGV4dGVudDtcbiAgY29uc3QgeDIgPSByaWdodE1vc3QgKyBleHRlbnQgPiBzaXplID8gc2l6ZSA6IHJpZ2h0TW9zdCArIGV4dGVudDtcbiAgY29uc3QgeTIgPSBib3R0b21Nb3N0ICsgZXh0ZW50ID4gc2l6ZSA/IHNpemUgOiBib3R0b21Nb3N0ICsgZXh0ZW50O1xuXG4gIHJldHVybiBbXG4gICAgW3gxLCB5MV0sXG4gICAgW3gyLCB5Ml0sXG4gIF07XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0F2b2lkTW92ZXNGb3JQYXJ0aWFsQW5hbHlzaXMgPSAoXG4gIHBhcnRpYWxBcmVhOiBbW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXV0sXG4gIGJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgY29uc3QgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0IFtbeDEsIHkxXSwgW3gyLCB5Ml1dID0gcGFydGlhbEFyZWE7XG5cbiAgZm9yIChjb25zdCBjb2wgb2YgQTFfTEVUVEVSUy5zbGljZSgwLCBib2FyZFNpemUpKSB7XG4gICAgZm9yIChjb25zdCByb3cgb2YgQTFfTlVNQkVSUy5zbGljZSgtYm9hcmRTaXplKSkge1xuICAgICAgY29uc3QgeCA9IEExX0xFVFRFUlMuaW5kZXhPZihjb2wpO1xuICAgICAgY29uc3QgeSA9IEExX05VTUJFUlMuaW5kZXhPZihyb3cpO1xuXG4gICAgICBpZiAoeCA8IHgxIHx8IHggPiB4MiB8fCB5IDwgeTEgfHwgeSA+IHkyKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGAke2NvbH0ke3Jvd31gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNUc3VtZWdvRnJhbWUgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgZXh0ZW50OiBudW1iZXIsXG4gIGJvYXJkU2l6ZSA9IDE5LFxuICBrb21pID0gNy41LFxuICB0dXJuOiBLaSA9IEtpLkJsYWNrLFxuICBrbyA9IGZhbHNlXG4pOiBudW1iZXJbXVtdID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gY2xvbmVEZWVwKG1hdCk7XG4gIGNvbnN0IHBhcnRpYWxBcmVhID0gY2FsY1BhcnRpYWxBcmVhKG1hdCwgZXh0ZW50LCBib2FyZFNpemUpO1xuICBjb25zdCBjZW50ZXIgPSBjYWxjQ2VudGVyKG1hdCk7XG4gIGNvbnN0IHB1dEJvcmRlciA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgICBjb25zdCBbeDEsIHkxXSA9IHBhcnRpYWxBcmVhWzBdO1xuICAgIGNvbnN0IFt4MiwgeTJdID0gcGFydGlhbEFyZWFbMV07XG4gICAgZm9yIChsZXQgaSA9IHgxOyBpIDw9IHgyOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSB5MTsgaiA8PSB5MjsgaisrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0ICYmXG4gICAgICAgICAgKChpID09PSB4MiAmJiBpIDwgYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgICAgIChqID09PSB5MiAmJiBqIDwgYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgICAgIChpID09PSB4MSAmJiBpID4gMCkgfHxcbiAgICAgICAgICAgIChqID09PSB5MSAmJiBqID4gMCkpXG4gICAgICAgICkge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQgJiZcbiAgICAgICAgICAoKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0ICYmXG4gICAgICAgICAgKChpID09PSB4MiAmJiBpIDwgYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgICAgIChqID09PSB5MSAmJiBqID4gMCkgfHxcbiAgICAgICAgICAgIChpID09PSB4MSAmJiBpID4gMCkgfHxcbiAgICAgICAgICAgIChqID09PSB5MiAmJiBqIDwgYm9hcmRTaXplIC0gMSkpXG4gICAgICAgICkge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQgJiZcbiAgICAgICAgICAoKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChjZW50ZXIgPT09IENlbnRlci5DZW50ZXIpIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBwdXRPdXRzaWRlID0gKG1hdDogbnVtYmVyW11bXSkgPT4ge1xuICAgIGNvbnN0IG9mZmVuY2VUb1dpbiA9IDEwO1xuICAgIGNvbnN0IG9mZmVuc2VLb21pID0gdHVybiAqIGtvbWk7XG4gICAgY29uc3QgW3gxLCB5MV0gPSBwYXJ0aWFsQXJlYVswXTtcbiAgICBjb25zdCBbeDIsIHkyXSA9IHBhcnRpYWxBcmVhWzFdO1xuICAgIC8vIFRPRE86IEhhcmQgY29kZSBmb3Igbm93XG4gICAgLy8gY29uc3QgYmxhY2tUb0F0dGFjayA9IHR1cm4gPT09IEtpLkJsYWNrO1xuICAgIGNvbnN0IGJsYWNrVG9BdHRhY2sgPSB0dXJuID09PSBLaS5CbGFjaztcbiAgICBjb25zdCBpc2l6ZSA9IHgyIC0geDE7XG4gICAgY29uc3QganNpemUgPSB5MiAtIHkxO1xuICAgIC8vIFRPRE86IDM2MSBpcyBoYXJkY29kZWRcbiAgICAvLyBjb25zdCBkZWZlbnNlQXJlYSA9IE1hdGguZmxvb3IoXG4gICAgLy8gICAoMzYxIC0gaXNpemUgKiBqc2l6ZSAtIG9mZmVuc2VLb21pIC0gb2ZmZW5jZVRvV2luKSAvIDJcbiAgICAvLyApO1xuICAgIGNvbnN0IGRlZmVuc2VBcmVhID1cbiAgICAgIE1hdGguZmxvb3IoKDM2MSAtIGlzaXplICoganNpemUpIC8gMikgLSBvZmZlbnNlS29taSAtIG9mZmVuY2VUb1dpbjtcblxuICAgIC8vIGNvbnN0IGRlZmVuc2VBcmVhID0gMzA7XG5cbiAgICAvLyBvdXRzaWRlIHRoZSBmcmFtZVxuICAgIGxldCBjb3VudCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZFNpemU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBib2FyZFNpemU7IGorKykge1xuICAgICAgICBpZiAoaSA8IHgxIHx8IGkgPiB4MiB8fCBqIDwgeTEgfHwgaiA+IHkyKSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgICBsZXQga2kgPSBLaS5FbXB0eTtcbiAgICAgICAgICBpZiAoY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fCBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0KSB7XG4gICAgICAgICAgICBraSA9IGJsYWNrVG9BdHRhY2sgIT09IGNvdW50IDw9IGRlZmVuc2VBcmVhID8gS2kuV2hpdGUgOiBLaS5CbGFjaztcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQgfHxcbiAgICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBraSA9IGJsYWNrVG9BdHRhY2sgIT09IGNvdW50IDw9IGRlZmVuc2VBcmVhID8gS2kuQmxhY2sgOiBLaS5XaGl0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKChpICsgaikgJSAyID09PSAwICYmIE1hdGguYWJzKGNvdW50IC0gZGVmZW5zZUFyZWEpID4gYm9hcmRTaXplKSB7XG4gICAgICAgICAgICBraSA9IEtpLkVtcHR5O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1hdFtpXVtqXSA9IGtpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAvLyBUT0RPOlxuICBjb25zdCBwdXRLb1RocmVhdCA9IChtYXQ6IG51bWJlcltdW10sIGtvOiBib29sZWFuKSA9PiB7fTtcblxuICBwdXRCb3JkZXIocmVzdWx0KTtcbiAgcHV0T3V0c2lkZShyZXN1bHQpO1xuXG4gIC8vIGNvbnN0IGZsaXBTcGVjID1cbiAgLy8gICBpbWluIDwgam1pblxuICAvLyAgICAgPyBbZmFsc2UsIGZhbHNlLCB0cnVlXVxuICAvLyAgICAgOiBbbmVlZEZsaXAoaW1pbiwgaW1heCwgaXNpemUpLCBuZWVkRmxpcChqbWluLCBqbWF4LCBqc2l6ZSksIGZhbHNlXTtcblxuICAvLyBpZiAoZmxpcFNwZWMuaW5jbHVkZXModHJ1ZSkpIHtcbiAgLy8gICBjb25zdCBmbGlwcGVkID0gZmxpcFN0b25lcyhzdG9uZXMsIGZsaXBTcGVjKTtcbiAgLy8gICBjb25zdCBmaWxsZWQgPSB0c3VtZWdvRnJhbWVTdG9uZXMoZmxpcHBlZCwga29taSwgYmxhY2tUb1BsYXksIGtvLCBtYXJnaW4pO1xuICAvLyAgIHJldHVybiBmbGlwU3RvbmVzKGZpbGxlZCwgZmxpcFNwZWMpO1xuICAvLyB9XG5cbiAgLy8gY29uc3QgaTAgPSBpbWluIC0gbWFyZ2luO1xuICAvLyBjb25zdCBpMSA9IGltYXggKyBtYXJnaW47XG4gIC8vIGNvbnN0IGowID0gam1pbiAtIG1hcmdpbjtcbiAgLy8gY29uc3QgajEgPSBqbWF4ICsgbWFyZ2luO1xuICAvLyBjb25zdCBmcmFtZVJhbmdlOiBSZWdpb24gPSBbaTAsIGkxLCBqMCwgajFdO1xuICAvLyBjb25zdCBibGFja1RvQXR0YWNrID0gZ3Vlc3NCbGFja1RvQXR0YWNrKFxuICAvLyAgIFt0b3AsIGJvdHRvbSwgbGVmdCwgcmlnaHRdLFxuICAvLyAgIFtpc2l6ZSwganNpemVdXG4gIC8vICk7XG5cbiAgLy8gcHV0Qm9yZGVyKG1hdCwgW2lzaXplLCBqc2l6ZV0sIGZyYW1lUmFuZ2UsIGJsYWNrVG9BdHRhY2spO1xuICAvLyBwdXRPdXRzaWRlKFxuICAvLyAgIHN0b25lcyxcbiAgLy8gICBbaXNpemUsIGpzaXplXSxcbiAgLy8gICBmcmFtZVJhbmdlLFxuICAvLyAgIGJsYWNrVG9BdHRhY2ssXG4gIC8vICAgYmxhY2tUb1BsYXksXG4gIC8vICAga29taVxuICAvLyApO1xuICAvLyBwdXRLb1RocmVhdChcbiAgLy8gICBzdG9uZXMsXG4gIC8vICAgW2lzaXplLCBqc2l6ZV0sXG4gIC8vICAgZnJhbWVSYW5nZSxcbiAgLy8gICBibGFja1RvQXR0YWNrLFxuICAvLyAgIGJsYWNrVG9QbGF5LFxuICAvLyAgIGtvXG4gIC8vICk7XG4gIC8vIHJldHVybiBzdG9uZXM7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjT2Zmc2V0ID0gKG1hdDogbnVtYmVyW11bXSkgPT4ge1xuICBjb25zdCBib2FyZFNpemUgPSBjYWxjQm9hcmRTaXplKG1hdCk7XG4gIGNvbnN0IG94ID0gMTkgLSBib2FyZFNpemVbMF07XG4gIGNvbnN0IG95ID0gMTkgLSBib2FyZFNpemVbMV07XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcblxuICBsZXQgb294ID0gb3g7XG4gIGxldCBvb3kgPSBveTtcbiAgc3dpdGNoIChjZW50ZXIpIHtcbiAgICBjYXNlIENlbnRlci5Ub3BMZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gb3k7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuVG9wUmlnaHQ6IHtcbiAgICAgIG9veCA9IC1veDtcbiAgICAgIG9veSA9IG95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLkJvdHRvbUxlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSAwO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLkJvdHRvbVJpZ2h0OiB7XG4gICAgICBvb3ggPSAtb3g7XG4gICAgICBvb3kgPSAwO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB7eDogb294LCB5OiBvb3l9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJldmVyc2VPZmZzZXQgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgYnggPSAxOSxcbiAgYnkgPSAxOSxcbiAgYm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBjb25zdCBveCA9IGJvYXJkU2l6ZSAtIGJ4O1xuICBjb25zdCBveSA9IGJvYXJkU2l6ZSAtIGJ5O1xuICBjb25zdCBjZW50ZXIgPSBjYWxjQ2VudGVyKG1hdCk7XG5cbiAgbGV0IG9veCA9IG94O1xuICBsZXQgb295ID0gb3k7XG4gIHN3aXRjaCAoY2VudGVyKSB7XG4gICAgY2FzZSBDZW50ZXIuVG9wTGVmdDoge1xuICAgICAgb294ID0gMDtcbiAgICAgIG9veSA9IC1veTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Ub3BSaWdodDoge1xuICAgICAgb294ID0gb3g7XG4gICAgICBvb3kgPSAtb3k7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tTGVmdDoge1xuICAgICAgb294ID0gMDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tUmlnaHQ6IHtcbiAgICAgIG9veCA9IG94O1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge3g6IG9veCwgeTogb295fTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxjVmlzaWJsZUFyZWEoXG4gIG1hdDogbnVtYmVyW11bXSA9IHplcm9zKFsxOSwgMTldKSxcbiAgZXh0ZW50OiBudW1iZXIsXG4gIGFsbG93UmVjdGFuZ2xlID0gZmFsc2Vcbik6IG51bWJlcltdW10ge1xuICBsZXQgbWluUm93ID0gbWF0Lmxlbmd0aDtcbiAgbGV0IG1heFJvdyA9IDA7XG4gIGxldCBtaW5Db2wgPSBtYXRbMF0ubGVuZ3RoO1xuICBsZXQgbWF4Q29sID0gMDtcblxuICBsZXQgZW1wdHkgPSB0cnVlO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbMF0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChtYXRbaV1bal0gIT09IDApIHtcbiAgICAgICAgZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgbWluUm93ID0gTWF0aC5taW4obWluUm93LCBpKTtcbiAgICAgICAgbWF4Um93ID0gTWF0aC5tYXgobWF4Um93LCBpKTtcbiAgICAgICAgbWluQ29sID0gTWF0aC5taW4obWluQ29sLCBqKTtcbiAgICAgICAgbWF4Q29sID0gTWF0aC5tYXgobWF4Q29sLCBqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZW1wdHkpIHtcbiAgICByZXR1cm4gW1xuICAgICAgWzAsIG1hdC5sZW5ndGggLSAxXSxcbiAgICAgIFswLCBtYXRbMF0ubGVuZ3RoIC0gMV0sXG4gICAgXTtcbiAgfVxuXG4gIGlmICghYWxsb3dSZWN0YW5nbGUpIHtcbiAgICBjb25zdCBtaW5Sb3dXaXRoRXh0ZW50ID0gTWF0aC5tYXgobWluUm93IC0gZXh0ZW50LCAwKTtcbiAgICBjb25zdCBtYXhSb3dXaXRoRXh0ZW50ID0gTWF0aC5taW4obWF4Um93ICsgZXh0ZW50LCBtYXQubGVuZ3RoIC0gMSk7XG4gICAgY29uc3QgbWluQ29sV2l0aEV4dGVudCA9IE1hdGgubWF4KG1pbkNvbCAtIGV4dGVudCwgMCk7XG4gICAgY29uc3QgbWF4Q29sV2l0aEV4dGVudCA9IE1hdGgubWluKG1heENvbCArIGV4dGVudCwgbWF0WzBdLmxlbmd0aCAtIDEpO1xuXG4gICAgY29uc3QgbWF4UmFuZ2UgPSBNYXRoLm1heChcbiAgICAgIG1heFJvd1dpdGhFeHRlbnQgLSBtaW5Sb3dXaXRoRXh0ZW50LFxuICAgICAgbWF4Q29sV2l0aEV4dGVudCAtIG1pbkNvbFdpdGhFeHRlbnRcbiAgICApO1xuXG4gICAgbWluUm93ID0gbWluUm93V2l0aEV4dGVudDtcbiAgICBtYXhSb3cgPSBtaW5Sb3cgKyBtYXhSYW5nZTtcblxuICAgIGlmIChtYXhSb3cgPj0gbWF0Lmxlbmd0aCkge1xuICAgICAgbWF4Um93ID0gbWF0Lmxlbmd0aCAtIDE7XG4gICAgICBtaW5Sb3cgPSBtYXhSb3cgLSBtYXhSYW5nZTtcbiAgICB9XG5cbiAgICBtaW5Db2wgPSBtaW5Db2xXaXRoRXh0ZW50O1xuICAgIG1heENvbCA9IG1pbkNvbCArIG1heFJhbmdlO1xuICAgIGlmIChtYXhDb2wgPj0gbWF0WzBdLmxlbmd0aCkge1xuICAgICAgbWF4Q29sID0gbWF0WzBdLmxlbmd0aCAtIDE7XG4gICAgICBtaW5Db2wgPSBtYXhDb2wgLSBtYXhSYW5nZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbWluUm93ID0gTWF0aC5tYXgoMCwgbWluUm93IC0gZXh0ZW50KTtcbiAgICBtYXhSb3cgPSBNYXRoLm1pbihtYXQubGVuZ3RoIC0gMSwgbWF4Um93ICsgZXh0ZW50KTtcbiAgICBtaW5Db2wgPSBNYXRoLm1heCgwLCBtaW5Db2wgLSBleHRlbnQpO1xuICAgIG1heENvbCA9IE1hdGgubWluKG1hdFswXS5sZW5ndGggLSAxLCBtYXhDb2wgKyBleHRlbnQpO1xuICB9XG5cbiAgcmV0dXJuIFtcbiAgICBbbWluUm93LCBtYXhSb3ddLFxuICAgIFttaW5Db2wsIG1heENvbF0sXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlKG1hdDogbnVtYmVyW11bXSwgaTogbnVtYmVyLCBqOiBudW1iZXIsIGtpOiBudW1iZXIpIHtcbiAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm4gbWF0O1xuICBjb25zdCBuZXdNYXQgPSBjbG9uZURlZXAobWF0KTtcbiAgbmV3TWF0W2ldW2pdID0ga2k7XG4gIHJldHVybiBleGVjQ2FwdHVyZShuZXdNYXQsIGksIGosIC1raSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93S2kobWF0OiBudW1iZXJbXVtdLCBzdGVwczogc3RyaW5nW10sIGlzQ2FwdHVyZWQgPSB0cnVlKSB7XG4gIGxldCBuZXdNYXQgPSBjbG9uZURlZXAobWF0KTtcbiAgbGV0IGhhc01vdmVkID0gZmFsc2U7XG4gIHN0ZXBzLmZvckVhY2goc3RyID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIGtpLFxuICAgIH06IHtcbiAgICAgIHg6IG51bWJlcjtcbiAgICAgIHk6IG51bWJlcjtcbiAgICAgIGtpOiBudW1iZXI7XG4gICAgfSA9IHNnZlRvUG9zKHN0cik7XG4gICAgaWYgKGlzQ2FwdHVyZWQpIHtcbiAgICAgIGlmIChjYW5Nb3ZlKG5ld01hdCwgeCwgeSwga2kpKSB7XG4gICAgICAgIG5ld01hdFt4XVt5XSA9IGtpO1xuICAgICAgICBuZXdNYXQgPSBleGVjQ2FwdHVyZShuZXdNYXQsIHgsIHksIC1raSk7XG4gICAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICBoYXNNb3ZlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGFycmFuZ2VtZW50OiBuZXdNYXQsXG4gICAgaGFzTW92ZWQsXG4gIH07XG59XG5cbi8vIFRPRE86XG5leHBvcnQgY29uc3QgaGFuZGxlTW92ZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBpOiBudW1iZXIsXG4gIGo6IG51bWJlcixcbiAgdHVybjogS2ksXG4gIGN1cnJlbnROb2RlOiBUTm9kZSxcbiAgb25BZnRlck1vdmU6IChub2RlOiBUTm9kZSwgaXNNb3ZlZDogYm9vbGVhbikgPT4gdm9pZFxuKSA9PiB7XG4gIGlmICh0dXJuID09PSBLaS5FbXB0eSkgcmV0dXJuO1xuICBpZiAoY2FuTW92ZShtYXQsIGksIGosIHR1cm4pKSB7XG4gICAgLy8gZGlzcGF0Y2godWlTbGljZS5hY3Rpb25zLnNldFR1cm4oLXR1cm4pKTtcbiAgICBjb25zdCB2YWx1ZSA9IFNHRl9MRVRURVJTW2ldICsgU0dGX0xFVFRFUlNbal07XG4gICAgY29uc3QgdG9rZW4gPSB0dXJuID09PSBLaS5CbGFjayA/ICdCJyA6ICdXJztcbiAgICBjb25zdCBoYXNoID0gY2FsY0hhc2goY3VycmVudE5vZGUsIFtNb3ZlUHJvcC5mcm9tKGAke3Rva2VufVske3ZhbHVlfV1gKV0pO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gY3VycmVudE5vZGUuY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgKG46IFROb2RlKSA9PiBuLm1vZGVsLmlkID09PSBoYXNoXG4gICAgKTtcbiAgICBsZXQgbm9kZTogVE5vZGU7XG4gICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vZGUgPSBmaWx0ZXJlZFswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IGJ1aWxkTW92ZU5vZGUoYCR7dG9rZW59WyR7dmFsdWV9XWAsIGN1cnJlbnROb2RlKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKG5vZGUpO1xuICAgIH1cbiAgICBpZiAob25BZnRlck1vdmUpIG9uQWZ0ZXJNb3ZlKG5vZGUsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvbkFmdGVyTW92ZSkgb25BZnRlck1vdmUoY3VycmVudE5vZGUsIGZhbHNlKTtcbiAgfVxufTtcblxuLyoqXG4gKiBDbGVhciBzdG9uZSBmcm9tIHRoZSBjdXJyZW50Tm9kZVxuICogQHBhcmFtIGN1cnJlbnROb2RlXG4gKiBAcGFyYW0gdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IGNsZWFyU3RvbmVGcm9tQ3VycmVudE5vZGUgPSAoXG4gIGN1cnJlbnROb2RlOiBUTm9kZSxcbiAgdmFsdWU6IHN0cmluZ1xuKSA9PiB7XG4gIGNvbnN0IHBhdGggPSBjdXJyZW50Tm9kZS5nZXRQYXRoKCk7XG4gIHBhdGguZm9yRWFjaChub2RlID0+IHtcbiAgICBjb25zdCB7c2V0dXBQcm9wc30gPSBub2RlLm1vZGVsO1xuICAgIGlmIChzZXR1cFByb3BzLmZpbHRlcigoczogU2V0dXBQcm9wKSA9PiBzLnZhbHVlID09PSB2YWx1ZSkubGVuZ3RoID4gMCkge1xuICAgICAgbm9kZS5tb2RlbC5zZXR1cFByb3BzID0gc2V0dXBQcm9wcy5maWx0ZXIoKHM6IGFueSkgPT4gcy52YWx1ZSAhPT0gdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXR1cFByb3BzLmZvckVhY2goKHM6IFNldHVwUHJvcCkgPT4ge1xuICAgICAgICBzLnZhbHVlcyA9IHMudmFsdWVzLmZpbHRlcih2ID0+IHYgIT09IHZhbHVlKTtcbiAgICAgICAgaWYgKHMudmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIG5vZGUubW9kZWwuc2V0dXBQcm9wcyA9IG5vZGUubW9kZWwuc2V0dXBQcm9wcy5maWx0ZXIoXG4gICAgICAgICAgICAocDogU2V0dXBQcm9wKSA9PiBwLnRva2VuICE9PSBzLnRva2VuXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbi8qKlxuICogQWRkcyBhIHN0b25lIHRvIHRoZSBjdXJyZW50IG5vZGUgaW4gdGhlIHRyZWUuXG4gKlxuICogQHBhcmFtIGN1cnJlbnROb2RlIFRoZSBjdXJyZW50IG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBAcGFyYW0gbWF0IFRoZSBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSBib2FyZC5cbiAqIEBwYXJhbSBpIFRoZSByb3cgaW5kZXggb2YgdGhlIHN0b25lLlxuICogQHBhcmFtIGogVGhlIGNvbHVtbiBpbmRleCBvZiB0aGUgc3RvbmUuXG4gKiBAcGFyYW0ga2kgVGhlIGNvbG9yIG9mIHRoZSBzdG9uZSAoS2kuV2hpdGUgb3IgS2kuQmxhY2spLlxuICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgc3RvbmUgd2FzIHJlbW92ZWQgZnJvbSBwcmV2aW91cyBub2RlcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5leHBvcnQgY29uc3QgYWRkU3RvbmVUb0N1cnJlbnROb2RlID0gKFxuICBjdXJyZW50Tm9kZTogVE5vZGUsXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgaTogbnVtYmVyLFxuICBqOiBudW1iZXIsXG4gIGtpOiBLaVxuKSA9PiB7XG4gIGNvbnN0IHZhbHVlID0gU0dGX0xFVFRFUlNbaV0gKyBTR0ZfTEVUVEVSU1tqXTtcbiAgY29uc3QgdG9rZW4gPSBraSA9PT0gS2kuV2hpdGUgPyAnQVcnIDogJ0FCJztcbiAgY29uc3QgcHJvcCA9IGZpbmRQcm9wKGN1cnJlbnROb2RlLCB0b2tlbik7XG4gIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgaWYgKG1hdFtpXVtqXSAhPT0gS2kuRW1wdHkpIHtcbiAgICBjbGVhclN0b25lRnJvbUN1cnJlbnROb2RlKGN1cnJlbnROb2RlLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb3ApIHtcbiAgICAgIHByb3AudmFsdWVzID0gWy4uLnByb3AudmFsdWVzLCB2YWx1ZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlLm1vZGVsLnNldHVwUHJvcHMgPSBbXG4gICAgICAgIC4uLmN1cnJlbnROb2RlLm1vZGVsLnNldHVwUHJvcHMsXG4gICAgICAgIG5ldyBTZXR1cFByb3AodG9rZW4sIHZhbHVlKSxcbiAgICAgIF07XG4gICAgfVxuICAgIHJlc3VsdCA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQWRkcyBhIG1vdmUgdG8gdGhlIGdpdmVuIG1hdHJpeCBhbmQgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBub2RlIGluIHRoZSB0cmVlLlxuICogSWYgdGhlIGtpIGlzIGVtcHR5LCBubyBtb3ZlIGlzIGFkZGVkIGFuZCBudWxsIGlzIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSBtYXQgLSBUaGUgbWF0cml4IHJlcHJlc2VudGluZyB0aGUgZ2FtZSBib2FyZC5cbiAqIEBwYXJhbSBjdXJyZW50Tm9kZSAtIFRoZSBjdXJyZW50IG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBAcGFyYW0gaSAtIFRoZSByb3cgaW5kZXggb2YgdGhlIG1vdmUuXG4gKiBAcGFyYW0gaiAtIFRoZSBjb2x1bW4gaW5kZXggb2YgdGhlIG1vdmUuXG4gKiBAcGFyYW0ga2kgLSBUaGUgdHlwZSBvZiBtb3ZlIChLaSkuXG4gKiBAcmV0dXJucyBUaGUgY29ycmVzcG9uZGluZyBub2RlIGluIHRoZSB0cmVlLCBvciBudWxsIGlmIG5vIG1vdmUgaXMgYWRkZWQuXG4gKi9cbi8vIFRPRE86IFRoZSBwYXJhbXMgaGVyZSBpcyB3ZWlyZFxuZXhwb3J0IGNvbnN0IGFkZE1vdmVUb0N1cnJlbnROb2RlID0gKFxuICBjdXJyZW50Tm9kZTogVE5vZGUsXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgaTogbnVtYmVyLFxuICBqOiBudW1iZXIsXG4gIGtpOiBLaVxuKSA9PiB7XG4gIGlmIChraSA9PT0gS2kuRW1wdHkpIHJldHVybjtcbiAgbGV0IG5vZGU7XG4gIGlmIChjYW5Nb3ZlKG1hdCwgaSwgaiwga2kpKSB7XG4gICAgY29uc3QgdmFsdWUgPSBTR0ZfTEVUVEVSU1tpXSArIFNHRl9MRVRURVJTW2pdO1xuICAgIGNvbnN0IHRva2VuID0ga2kgPT09IEtpLkJsYWNrID8gJ0InIDogJ1cnO1xuICAgIGNvbnN0IGhhc2ggPSBjYWxjSGFzaChjdXJyZW50Tm9kZSwgW01vdmVQcm9wLmZyb20oYCR7dG9rZW59WyR7dmFsdWV9XWApXSk7XG4gICAgY29uc3QgZmlsdGVyZWQgPSBjdXJyZW50Tm9kZS5jaGlsZHJlbi5maWx0ZXIoXG4gICAgICAobjogVE5vZGUpID0+IG4ubW9kZWwuaWQgPT09IGhhc2hcbiAgICApO1xuICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICBub2RlID0gZmlsdGVyZWRbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSBidWlsZE1vdmVOb2RlKGAke3Rva2VufVske3ZhbHVlfV1gLCBjdXJyZW50Tm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChub2RlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1ByZXZlbnRNb3ZlTWF0Rm9yRGlzcGxheU9ubHkgPSAoXG4gIG5vZGU6IFROb2RlLFxuICBkZWZhdWx0Qm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBpZiAoIW5vZGUpIHJldHVybiB6ZXJvcyhbZGVmYXVsdEJvYXJkU2l6ZSwgZGVmYXVsdEJvYXJkU2l6ZV0pO1xuICBjb25zdCBzaXplID0gZXh0cmFjdEJvYXJkU2l6ZShub2RlLCBkZWZhdWx0Qm9hcmRTaXplKTtcbiAgY29uc3QgcHJldmVudE1vdmVNYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuXG4gIHByZXZlbnRNb3ZlTWF0LmZvckVhY2gocm93ID0+IHJvdy5maWxsKDEpKTtcbiAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSkge1xuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgobjogVE5vZGUpID0+IHtcbiAgICAgIG4ubW9kZWwubW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMF0pO1xuICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICBwcmV2ZW50TW92ZU1hdFtpXVtqXSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBwcmV2ZW50TW92ZU1hdDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjUHJldmVudE1vdmVNYXQgPSAobm9kZTogVE5vZGUsIGRlZmF1bHRCb2FyZFNpemUgPSAxOSkgPT4ge1xuICBpZiAoIW5vZGUpIHJldHVybiB6ZXJvcyhbZGVmYXVsdEJvYXJkU2l6ZSwgZGVmYXVsdEJvYXJkU2l6ZV0pO1xuICBjb25zdCBzaXplID0gZXh0cmFjdEJvYXJkU2l6ZShub2RlLCBkZWZhdWx0Qm9hcmRTaXplKTtcbiAgY29uc3QgcHJldmVudE1vdmVNYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICBjb25zdCBmb3JjZU5vZGVzID0gW107XG4gIGxldCBwcmV2ZW50TW92ZU5vZGVzOiBUTm9kZVtdID0gW107XG4gIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICBwcmV2ZW50TW92ZU5vZGVzID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKG46IFROb2RlKSA9PiBpc1ByZXZlbnRNb3ZlTm9kZShuKSk7XG4gIH1cblxuICBpZiAoaXNGb3JjZU5vZGUobm9kZSkpIHtcbiAgICBwcmV2ZW50TW92ZU1hdC5mb3JFYWNoKHJvdyA9PiByb3cuZmlsbCgxKSk7XG4gICAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChuOiBUTm9kZSkgPT4ge1xuICAgICAgICBuLm1vZGVsLm1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMF0pO1xuICAgICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgICBwcmV2ZW50TW92ZU1hdFtpXVtqXSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByZXZlbnRNb3ZlTm9kZXMuZm9yRWFjaCgobjogVE5vZGUpID0+IHtcbiAgICBuLm1vZGVsLm1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgIHByZXZlbnRNb3ZlTWF0W2ldW2pdID0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHByZXZlbnRNb3ZlTWF0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBtYXJrdXAgbWF0cml4IGZvciB2YXJpYXRpb25zIGluIGEgZ2l2ZW4gU0dGIG5vZGUuXG4gKlxuICogQHBhcmFtIG5vZGUgLSBUaGUgU0dGIG5vZGUgdG8gY2FsY3VsYXRlIHRoZSBtYXJrdXAgZm9yLlxuICogQHBhcmFtIHBvbGljeSAtIFRoZSBwb2xpY3kgZm9yIGhhbmRsaW5nIHRoZSBtYXJrdXAuIERlZmF1bHRzIHRvICdhcHBlbmQnLlxuICogQHJldHVybnMgVGhlIGNhbGN1bGF0ZWQgbWFya3VwIGZvciB0aGUgdmFyaWF0aW9ucy5cbiAqL1xuZXhwb3J0IGNvbnN0IGNhbGNWYXJpYXRpb25zTWFya3VwID0gKFxuICBub2RlOiBUTm9kZSxcbiAgcG9saWN5OiAnYXBwZW5kJyB8ICdwcmVwZW5kJyB8ICdyZXBsYWNlJyA9ICdhcHBlbmQnLFxuICBhY3RpdmVJbmRleDogbnVtYmVyID0gMCxcbiAgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgY29uc3QgcmVzID0gY2FsY01hdEFuZE1hcmt1cChub2RlKTtcbiAgY29uc3Qge21hdCwgbWFya3VwfSA9IHJlcztcbiAgY29uc3Qgc2l6ZSA9IGV4dHJhY3RCb2FyZFNpemUobm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG5cbiAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSkge1xuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgobjogVE5vZGUpID0+IHtcbiAgICAgIG4ubW9kZWwubW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMF0pO1xuICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgICAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm47XG4gICAgICAgIGlmIChpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgIGxldCBtYXJrID0gTWFya3VwLk5ldXRyYWxOb2RlO1xuICAgICAgICAgIGlmIChpbldyb25nUGF0aChuKSkge1xuICAgICAgICAgICAgbWFyayA9XG4gICAgICAgICAgICAgIG4uZ2V0SW5kZXgoKSA9PT0gYWN0aXZlSW5kZXhcbiAgICAgICAgICAgICAgICA/IE1hcmt1cC5OZWdhdGl2ZUFjdGl2ZU5vZGVcbiAgICAgICAgICAgICAgICA6IE1hcmt1cC5OZWdhdGl2ZU5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpblJpZ2h0UGF0aChuKSkge1xuICAgICAgICAgICAgbWFyayA9XG4gICAgICAgICAgICAgIG4uZ2V0SW5kZXgoKSA9PT0gYWN0aXZlSW5kZXhcbiAgICAgICAgICAgICAgICA/IE1hcmt1cC5Qb3NpdGl2ZUFjdGl2ZU5vZGVcbiAgICAgICAgICAgICAgICA6IE1hcmt1cC5Qb3NpdGl2ZU5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtYXRbaV1bal0gPT09IEtpLkVtcHR5KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBvbGljeSkge1xuICAgICAgICAgICAgICBjYXNlICdwcmVwZW5kJzpcbiAgICAgICAgICAgICAgICBtYXJrdXBbaV1bal0gPSBtYXJrICsgJ3wnICsgbWFya3VwW2ldW2pdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdyZXBsYWNlJzpcbiAgICAgICAgICAgICAgICBtYXJrdXBbaV1bal0gPSBtYXJrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHBlbmQnOlxuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG1hcmt1cFtpXVtqXSArPSAnfCcgKyBtYXJrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbWFya3VwO1xufTtcblxuZXhwb3J0IGNvbnN0IGRldGVjdFNUID0gKG5vZGU6IFROb2RlKSA9PiB7XG4gIC8vIFJlZmVyZW5jZTogaHR0cHM6Ly93d3cucmVkLWJlYW4uY29tL3NnZi9wcm9wZXJ0aWVzLmh0bWwjU1RcbiAgY29uc3Qgcm9vdCA9IG5vZGUuZ2V0UGF0aCgpWzBdO1xuICBjb25zdCBzdFByb3AgPSByb290Lm1vZGVsLnJvb3RQcm9wcy5maW5kKChwOiBSb290UHJvcCkgPT4gcC50b2tlbiA9PT0gJ1NUJyk7XG4gIGxldCBzaG93VmFyaWF0aW9uc01hcmt1cCA9IGZhbHNlO1xuICBsZXQgc2hvd0NoaWxkcmVuTWFya3VwID0gZmFsc2U7XG4gIGxldCBzaG93U2libGluZ3NNYXJrdXAgPSBmYWxzZTtcblxuICBjb25zdCBzdCA9IHN0UHJvcD8udmFsdWUgfHwgJzAnO1xuICBpZiAoc3QpIHtcbiAgICBpZiAoc3QgPT09ICcwJykge1xuICAgICAgc2hvd1NpYmxpbmdzTWFya3VwID0gZmFsc2U7XG4gICAgICBzaG93Q2hpbGRyZW5NYXJrdXAgPSB0cnVlO1xuICAgICAgc2hvd1ZhcmlhdGlvbnNNYXJrdXAgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoc3QgPT09ICcxJykge1xuICAgICAgc2hvd1NpYmxpbmdzTWFya3VwID0gdHJ1ZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IGZhbHNlO1xuICAgICAgc2hvd1ZhcmlhdGlvbnNNYXJrdXAgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoc3QgPT09ICcyJykge1xuICAgICAgc2hvd1NpYmxpbmdzTWFya3VwID0gZmFsc2U7XG4gICAgICBzaG93Q2hpbGRyZW5NYXJrdXAgPSB0cnVlO1xuICAgICAgc2hvd1ZhcmlhdGlvbnNNYXJrdXAgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHN0ID09PSAnMycpIHtcbiAgICAgIHNob3dTaWJsaW5nc01hcmt1cCA9IHRydWU7XG4gICAgICBzaG93Q2hpbGRyZW5NYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dWYXJpYXRpb25zTWFya3VwID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB7c2hvd1ZhcmlhdGlvbnNNYXJrdXAsIHNob3dDaGlsZHJlbk1hcmt1cCwgc2hvd1NpYmxpbmdzTWFya3VwfTtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbWF0IGFuZCBtYXJrdXAgYXJyYXlzIGJhc2VkIG9uIHRoZSBjdXJyZW50Tm9kZSBhbmQgZGVmYXVsdEJvYXJkU2l6ZS5cbiAqIEBwYXJhbSBjdXJyZW50Tm9kZSBUaGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICogQHBhcmFtIGRlZmF1bHRCb2FyZFNpemUgVGhlIGRlZmF1bHQgc2l6ZSBvZiB0aGUgYm9hcmQgKG9wdGlvbmFsLCBkZWZhdWx0IGlzIDE5KS5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBtYXQvdmlzaWJsZUFyZWFNYXQvbWFya3VwL251bU1hcmt1cCBhcnJheXMuXG4gKi9cbmV4cG9ydCBjb25zdCBjYWxjTWF0QW5kTWFya3VwID0gKGN1cnJlbnROb2RlOiBUTm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGNvbnN0IHBhdGggPSBjdXJyZW50Tm9kZS5nZXRQYXRoKCk7XG4gIGNvbnN0IHJvb3QgPSBwYXRoWzBdO1xuXG4gIGxldCBsaSwgbGo7XG4gIGxldCBzZXR1cENvdW50ID0gMDtcbiAgY29uc3Qgc2l6ZSA9IGV4dHJhY3RCb2FyZFNpemUoY3VycmVudE5vZGUsIGRlZmF1bHRCb2FyZFNpemUpO1xuICBsZXQgbWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgY29uc3QgdmlzaWJsZUFyZWFNYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICBjb25zdCBtYXJrdXAgPSBlbXB0eShbc2l6ZSwgc2l6ZV0pO1xuICBjb25zdCBudW1NYXJrdXAgPSBlbXB0eShbc2l6ZSwgc2l6ZV0pO1xuXG4gIHBhdGguZm9yRWFjaCgobm9kZSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB7bW92ZVByb3BzLCBzZXR1cFByb3BzLCByb290UHJvcHN9ID0gbm9kZS5tb2RlbDtcbiAgICBpZiAoc2V0dXBQcm9wcy5sZW5ndGggPiAwKSBzZXR1cENvdW50ICs9IDE7XG5cbiAgICBtb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMF0pO1xuICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgIGlmIChpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICBsaSA9IGk7XG4gICAgICAgIGxqID0gajtcbiAgICAgICAgbWF0ID0gbW92ZShtYXQsIGksIGosIG0udG9rZW4gPT09ICdCJyA/IEtpLkJsYWNrIDogS2kuV2hpdGUpO1xuXG4gICAgICAgIGlmIChsaSAhPT0gdW5kZWZpbmVkICYmIGxqICE9PSB1bmRlZmluZWQgJiYgbGkgPj0gMCAmJiBsaiA+PSAwKSB7XG4gICAgICAgICAgbnVtTWFya3VwW2xpXVtsal0gPSAoXG4gICAgICAgICAgICBub2RlLm1vZGVsLm51bWJlciB8fCBpbmRleCAtIHNldHVwQ291bnRcbiAgICAgICAgICApLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5kZXggPT09IHBhdGgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIG1hcmt1cFtsaV1bbGpdID0gTWFya3VwLkN1cnJlbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNldHVwIHByb3BzIHNob3VsZCBvdmVycmlkZSBtb3ZlIHByb3BzXG4gICAgc2V0dXBQcm9wcy5mb3JFYWNoKChzZXR1cDogYW55KSA9PiB7XG4gICAgICBzZXR1cC52YWx1ZXMuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzFdKTtcbiAgICAgICAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm47XG4gICAgICAgIGlmIChpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgIGxpID0gaTtcbiAgICAgICAgICBsaiA9IGo7XG4gICAgICAgICAgbWF0W2ldW2pdID0gc2V0dXAudG9rZW4gPT09ICdBQicgPyAxIDogLTE7XG4gICAgICAgICAgaWYgKHNldHVwLnRva2VuID09PSAnQUUnKSBtYXRbaV1bal0gPSAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIElmIHRoZSByb290IG5vZGUgZG9lcyBub3QgaW5jbHVkZSBhbnkgc2V0dXAgcHJvcGVydGllc1xuICAgIC8vIGNoZWNrIHdoZXRoZXIgaXRzIGZpcnN0IGNoaWxkIGlzIGEgc2V0dXAgbm9kZSAoaS5lLiwgYSBub24tbW92ZSBub2RlKVxuICAgIC8vIGFuZCBhcHBseSBpdHMgc2V0dXAgcHJvcGVydGllcyBpbnN0ZWFkXG4gICAgaWYgKHNldHVwUHJvcHMubGVuZ3RoID09PSAwICYmIGN1cnJlbnROb2RlLmlzUm9vdCgpKSB7XG4gICAgICBjb25zdCBmaXJzdENoaWxkTm9kZSA9IGN1cnJlbnROb2RlLmNoaWxkcmVuWzBdO1xuICAgICAgaWYgKFxuICAgICAgICBmaXJzdENoaWxkTm9kZSAmJlxuICAgICAgICBpc1NldHVwTm9kZShmaXJzdENoaWxkTm9kZSkgJiZcbiAgICAgICAgIWlzTW92ZU5vZGUoZmlyc3RDaGlsZE5vZGUpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qgc2V0dXBQcm9wcyA9IGZpcnN0Q2hpbGROb2RlLm1vZGVsLnNldHVwUHJvcHM7XG4gICAgICAgIHNldHVwUHJvcHMuZm9yRWFjaCgoc2V0dXA6IGFueSkgPT4ge1xuICAgICAgICAgIHNldHVwLnZhbHVlcy5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVswXSk7XG4gICAgICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVsxXSk7XG4gICAgICAgICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgICAgICAgIGlmIChpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgICAgICBsaSA9IGk7XG4gICAgICAgICAgICAgIGxqID0gajtcbiAgICAgICAgICAgICAgbWF0W2ldW2pdID0gc2V0dXAudG9rZW4gPT09ICdBQicgPyAxIDogLTE7XG4gICAgICAgICAgICAgIGlmIChzZXR1cC50b2tlbiA9PT0gJ0FFJykgbWF0W2ldW2pdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgbnVtYmVyIHdoZW4gc3RvbmVzIGFyZSBjYXB0dXJlZFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgICBpZiAobWF0W2ldW2pdID09PSAwKSBudW1NYXJrdXBbaV1bal0gPSAnJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIENhbGN1bGF0aW5nIHRoZSB2aXNpYmxlIGFyZWFcbiAgaWYgKHJvb3QpIHtcbiAgICByb290LmFsbCgobm9kZTogVE5vZGUpID0+IHtcbiAgICAgIGNvbnN0IHttb3ZlUHJvcHMsIHNldHVwUHJvcHMsIHJvb3RQcm9wc30gPSBub2RlLm1vZGVsO1xuICAgICAgaWYgKHNldHVwUHJvcHMubGVuZ3RoID4gMCkgc2V0dXBDb3VudCArPSAxO1xuICAgICAgc2V0dXBQcm9wcy5mb3JFYWNoKChzZXR1cDogYW55KSA9PiB7XG4gICAgICAgIHNldHVwLnZhbHVlcy5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMF0pO1xuICAgICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzFdKTtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgICAgdmlzaWJsZUFyZWFNYXRbaV1bal0gPSBLaS5CbGFjaztcbiAgICAgICAgICAgIGlmIChzZXR1cC50b2tlbiA9PT0gJ0FFJykgdmlzaWJsZUFyZWFNYXRbaV1bal0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgbW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMF0pO1xuICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICB2aXNpYmxlQXJlYU1hdFtpXVtqXSA9IEtpLkJsYWNrO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBtYXJrdXBQcm9wcyA9IGN1cnJlbnROb2RlLm1vZGVsLm1hcmt1cFByb3BzO1xuICBtYXJrdXBQcm9wcy5mb3JFYWNoKChtOiBNYXJrdXBQcm9wKSA9PiB7XG4gICAgY29uc3QgdG9rZW4gPSBtLnRva2VuO1xuICAgIGNvbnN0IHZhbHVlcyA9IG0udmFsdWVzO1xuICAgIHZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzBdKTtcbiAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzFdKTtcbiAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgIGxldCBtYXJrO1xuICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAgICAgY2FzZSAnQ1InOlxuICAgICAgICAgICAgbWFyayA9IE1hcmt1cC5DaXJjbGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdTUSc6XG4gICAgICAgICAgICBtYXJrID0gTWFya3VwLlNxdWFyZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1RSJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuVHJpYW5nbGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdNQSc6XG4gICAgICAgICAgICBtYXJrID0gTWFya3VwLkNyb3NzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgbWFyayA9IHZhbHVlLnNwbGl0KCc6JylbMV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcms7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIGlmIChcbiAgLy8gICBsaSAhPT0gdW5kZWZpbmVkICYmXG4gIC8vICAgbGogIT09IHVuZGVmaW5lZCAmJlxuICAvLyAgIGxpID49IDAgJiZcbiAgLy8gICBsaiA+PSAwICYmXG4gIC8vICAgIW1hcmt1cFtsaV1bbGpdXG4gIC8vICkge1xuICAvLyAgIG1hcmt1cFtsaV1bbGpdID0gTWFya3VwLkN1cnJlbnQ7XG4gIC8vIH1cblxuICByZXR1cm4ge21hdCwgdmlzaWJsZUFyZWFNYXQsIG1hcmt1cCwgbnVtTWFya3VwfTtcbn07XG5cbi8qKlxuICogRmluZHMgYSBwcm9wZXJ0eSBpbiB0aGUgZ2l2ZW4gbm9kZSBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgdG9rZW4uXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byBzZWFyY2ggZm9yIHRoZSBwcm9wZXJ0eS5cbiAqIEBwYXJhbSB0b2tlbiBUaGUgdG9rZW4gb2YgdGhlIHByb3BlcnR5IHRvIGZpbmQuXG4gKiBAcmV0dXJucyBUaGUgZm91bmQgcHJvcGVydHkgb3IgbnVsbCBpZiBub3QgZm91bmQuXG4gKi9cbmV4cG9ydCBjb25zdCBmaW5kUHJvcCA9IChub2RlOiBUTm9kZSwgdG9rZW46IHN0cmluZykgPT4ge1xuICBpZiAoIW5vZGUpIHJldHVybjtcbiAgaWYgKE1PVkVfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVQcm9wcy5maW5kKChwOiBNb3ZlUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHMuZmluZChcbiAgICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICBpZiAoTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tb3ZlQW5ub3RhdGlvblByb3BzLmZpbmQoXG4gICAgICAocDogTW92ZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgaWYgKFJPT1RfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLnJvb3RQcm9wcy5maW5kKChwOiBSb290UHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChTRVRVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwuc2V0dXBQcm9wcy5maW5kKChwOiBTZXR1cFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoTUFSS1VQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tYXJrdXBQcm9wcy5maW5kKChwOiBNYXJrdXBQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKEdBTUVfSU5GT19QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwuZ2FtZUluZm9Qcm9wcy5maW5kKFxuICAgICAgKHA6IEdhbWVJbmZvUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBGaW5kcyBwcm9wZXJ0aWVzIGluIGEgZ2l2ZW4gbm9kZSBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgdG9rZW4uXG4gKiBAcGFyYW0gbm9kZSAtIFRoZSBub2RlIHRvIHNlYXJjaCBmb3IgcHJvcGVydGllcy5cbiAqIEBwYXJhbSB0b2tlbiAtIFRoZSB0b2tlbiB0byBtYXRjaCBhZ2FpbnN0IHRoZSBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMgQW4gYXJyYXkgb2YgcHJvcGVydGllcyB0aGF0IG1hdGNoIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAqL1xuZXhwb3J0IGNvbnN0IGZpbmRQcm9wcyA9IChub2RlOiBUTm9kZSwgdG9rZW46IHN0cmluZykgPT4ge1xuICBpZiAoTU9WRV9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubW92ZVByb3BzLmZpbHRlcigocDogTW92ZVByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzLmZpbHRlcihcbiAgICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICBpZiAoTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tb3ZlQW5ub3RhdGlvblByb3BzLmZpbHRlcihcbiAgICAgIChwOiBNb3ZlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICBpZiAoUk9PVF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwucm9vdFByb3BzLmZpbHRlcigocDogUm9vdFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoU0VUVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLnNldHVwUHJvcHMuZmlsdGVyKChwOiBTZXR1cFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoTUFSS1VQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tYXJrdXBQcm9wcy5maWx0ZXIoKHA6IE1hcmt1cFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoR0FNRV9JTkZPX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5nYW1lSW5mb1Byb3BzLmZpbHRlcihcbiAgICAgIChwOiBHYW1lSW5mb1Byb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5leHBvcnQgY29uc3QgZ2VuTW92ZSA9IChcbiAgbm9kZTogVE5vZGUsXG4gIG9uUmlnaHQ6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQsXG4gIG9uV3Jvbmc6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQsXG4gIG9uVmFyaWFudDogKHBhdGg6IHN0cmluZykgPT4gdm9pZCxcbiAgb25PZmZQYXRoOiAocGF0aDogc3RyaW5nKSA9PiB2b2lkXG4pOiBUTm9kZSB8IHVuZGVmaW5lZCA9PiB7XG4gIGxldCBuZXh0Tm9kZTtcbiAgY29uc3QgZ2V0UGF0aCA9IChub2RlOiBUTm9kZSkgPT4ge1xuICAgIGNvbnN0IG5ld1BhdGggPSBjb21wYWN0KFxuICAgICAgbm9kZS5nZXRQYXRoKCkubWFwKG4gPT4gbi5tb2RlbC5tb3ZlUHJvcHNbMF0/LnRvU3RyaW5nKCkpXG4gICAgKS5qb2luKCc7Jyk7XG4gICAgcmV0dXJuIG5ld1BhdGg7XG4gIH07XG5cbiAgY29uc3QgY2hlY2tSZXN1bHQgPSAobm9kZTogVE5vZGUpID0+IHtcbiAgICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSByZXR1cm47XG5cbiAgICBjb25zdCBwYXRoID0gZ2V0UGF0aChub2RlKTtcbiAgICBpZiAoaXNSaWdodE5vZGUobm9kZSkpIHtcbiAgICAgIGlmIChvblJpZ2h0KSBvblJpZ2h0KHBhdGgpO1xuICAgIH0gZWxzZSBpZiAoaXNWYXJpYW50Tm9kZShub2RlKSkge1xuICAgICAgaWYgKG9uVmFyaWFudCkgb25WYXJpYW50KHBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob25Xcm9uZykgb25Xcm9uZyhwYXRoKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSkge1xuICAgIGNvbnN0IHJpZ2h0Tm9kZXMgPSBub2RlLmNoaWxkcmVuLmZpbHRlcigobjogVE5vZGUpID0+IGluUmlnaHRQYXRoKG4pKTtcbiAgICBjb25zdCB3cm9uZ05vZGVzID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKG46IFROb2RlKSA9PiBpbldyb25nUGF0aChuKSk7XG4gICAgY29uc3QgdmFyaWFudE5vZGVzID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKG46IFROb2RlKSA9PiBpblZhcmlhbnRQYXRoKG4pKTtcblxuICAgIG5leHROb2RlID0gbm9kZTtcblxuICAgIGlmIChpblJpZ2h0UGF0aChub2RlKSAmJiByaWdodE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5leHROb2RlID0gc2FtcGxlKHJpZ2h0Tm9kZXMpO1xuICAgIH0gZWxzZSBpZiAoaW5Xcm9uZ1BhdGgobm9kZSkgJiYgd3JvbmdOb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBuZXh0Tm9kZSA9IHNhbXBsZSh3cm9uZ05vZGVzKTtcbiAgICB9IGVsc2UgaWYgKGluVmFyaWFudFBhdGgobm9kZSkgJiYgdmFyaWFudE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5leHROb2RlID0gc2FtcGxlKHZhcmlhbnROb2Rlcyk7XG4gICAgfSBlbHNlIGlmIChpc1JpZ2h0Tm9kZShub2RlKSkge1xuICAgICAgb25SaWdodChnZXRQYXRoKG5leHROb2RlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uV3JvbmcoZ2V0UGF0aChuZXh0Tm9kZSkpO1xuICAgIH1cbiAgICBpZiAobmV4dE5vZGUpIGNoZWNrUmVzdWx0KG5leHROb2RlKTtcbiAgfSBlbHNlIHtcbiAgICBjaGVja1Jlc3VsdChub2RlKTtcbiAgfVxuICByZXR1cm4gbmV4dE5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEJvYXJkU2l6ZSA9IChub2RlOiBUTm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGNvbnN0IHJvb3QgPSBub2RlLmdldFBhdGgoKVswXTtcbiAgY29uc3Qgc2l6ZSA9IE1hdGgubWluKFxuICAgIHBhcnNlSW50KFN0cmluZyhmaW5kUHJvcChyb290LCAnU1onKT8udmFsdWUgfHwgZGVmYXVsdEJvYXJkU2l6ZSkpLFxuICAgIE1BWF9CT0FSRF9TSVpFXG4gICk7XG4gIHJldHVybiBzaXplO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpcnN0VG9Nb3ZlQ29sb3JGcm9tUm9vdCA9IChcbiAgcm9vdDogVE5vZGUgfCB1bmRlZmluZWQgfCBudWxsLFxuICBkZWZhdWx0TW92ZUNvbG9yOiBLaSA9IEtpLkJsYWNrXG4pID0+IHtcbiAgaWYgKHJvb3QpIHtcbiAgICBjb25zdCBzZXR1cE5vZGUgPSByb290LmZpcnN0KG4gPT4gaXNTZXR1cE5vZGUobikpO1xuICAgIGlmIChzZXR1cE5vZGUpIHtcbiAgICAgIGNvbnN0IGZpcnN0TW92ZU5vZGUgPSBzZXR1cE5vZGUuZmlyc3QobiA9PiBpc01vdmVOb2RlKG4pKTtcbiAgICAgIGlmICghZmlyc3RNb3ZlTm9kZSkgcmV0dXJuIGRlZmF1bHRNb3ZlQ29sb3I7XG4gICAgICByZXR1cm4gZ2V0TW92ZUNvbG9yKGZpcnN0TW92ZU5vZGUpO1xuICAgIH1cbiAgfVxuICAvLyBjb25zb2xlLndhcm4oJ0RlZmF1bHQgZmlyc3QgdG8gbW92ZSBjb2xvcicsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGaXJzdFRvTW92ZUNvbG9yRnJvbVNnZiA9IChcbiAgc2dmOiBzdHJpbmcsXG4gIGRlZmF1bHRNb3ZlQ29sb3I6IEtpID0gS2kuQmxhY2tcbikgPT4ge1xuICBjb25zdCBzZ2ZQYXJzZXIgPSBuZXcgU2dmKHNnZik7XG4gIGlmIChzZ2ZQYXJzZXIucm9vdClcbiAgICBnZXRGaXJzdFRvTW92ZUNvbG9yRnJvbVJvb3Qoc2dmUGFyc2VyLnJvb3QsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICAvLyBjb25zb2xlLndhcm4oJ0RlZmF1bHQgZmlyc3QgdG8gbW92ZSBjb2xvcicsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRNb3ZlQ29sb3IgPSAobm9kZTogVE5vZGUsIGRlZmF1bHRNb3ZlQ29sb3I6IEtpID0gS2kuQmxhY2spID0+IHtcbiAgY29uc3QgbW92ZVByb3AgPSBub2RlLm1vZGVsPy5tb3ZlUHJvcHM/LlswXTtcbiAgc3dpdGNoIChtb3ZlUHJvcD8udG9rZW4pIHtcbiAgICBjYXNlICdXJzpcbiAgICAgIHJldHVybiBLaS5XaGl0ZTtcbiAgICBjYXNlICdCJzpcbiAgICAgIHJldHVybiBLaS5CbGFjaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gY29uc29sZS53YXJuKCdEZWZhdWx0IG1vdmUgY29sb3IgaXMnLCBkZWZhdWx0TW92ZUNvbG9yKTtcbiAgICAgIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xuICB9XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvbmUge1xuICBwcm90ZWN0ZWQgZ2xvYmFsQWxwaGEgPSAxO1xuICBwcm90ZWN0ZWQgc2l6ZSA9IDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQga2k6IG51bWJlclxuICApIHt9XG4gIGRyYXcoKSB7XG4gICAgY29uc29sZS5sb2coJ1RCRCcpO1xuICB9XG5cbiAgc2V0R2xvYmFsQWxwaGEoYWxwaGE6IG51bWJlcikge1xuICAgIHRoaXMuZ2xvYmFsQWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIHNldFNpemUoc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgfVxufVxuIiwiaW1wb3J0IFN0b25lIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge0tpLCBUaGVtZUNvbnRleHQsIFRoZW1lQ29uZmlnfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge0RFRkFVTFRfVEhFTUVfQ09MT1JfQ09ORklHfSBmcm9tICcuLi9jb25zdCc7XG5cbmV4cG9ydCBjbGFzcyBGbGF0U3RvbmUgZXh0ZW5kcyBTdG9uZSB7XG4gIHByb3RlY3RlZCB0aGVtZUNvbnRleHQ/OiBUaGVtZUNvbnRleHQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBraTogbnVtYmVyLFxuICAgIHRoZW1lQ29udGV4dD86IFRoZW1lQ29udGV4dFxuICApIHtcbiAgICBzdXBlcihjdHgsIHgsIHksIGtpKTtcbiAgICB0aGlzLnRoZW1lQ29udGV4dCA9IHRoZW1lQ29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSB0aGVtZSBwcm9wZXJ0eSB2YWx1ZSB3aXRoIGZhbGxiYWNrXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VGhlbWVQcm9wZXJ0eTxLIGV4dGVuZHMga2V5b2YgVGhlbWVDb25maWc+KFxuICAgIGtleTogS1xuICApOiBUaGVtZUNvbmZpZ1tLXSB7XG4gICAgaWYgKCF0aGlzLnRoZW1lQ29udGV4dCkge1xuICAgICAgcmV0dXJuIERFRkFVTFRfVEhFTUVfQ09MT1JfQ09ORklHW2tleV07XG4gICAgfVxuXG4gICAgY29uc3Qge3RoZW1lLCB0aGVtZU9wdGlvbnN9ID0gdGhpcy50aGVtZUNvbnRleHQ7XG4gICAgY29uc3QgdGhlbWVTcGVjaWZpYyA9IHRoZW1lT3B0aW9uc1t0aGVtZV07XG4gICAgY29uc3QgZGVmYXVsdENvbmZpZyA9IHRoZW1lT3B0aW9ucy5kZWZhdWx0O1xuXG4gICAgLy8gVHJ5IHRoZW1lLXNwZWNpZmljIHZhbHVlIGZpcnN0LCB0aGVuIGRlZmF1bHRcbiAgICBjb25zdCByZXN1bHQgPSAodGhlbWVTcGVjaWZpYz8uW2tleV0gPz9cbiAgICAgIGRlZmF1bHRDb25maWdba2V5XSkgYXMgVGhlbWVDb25maWdbS107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgc2l6ZSwga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgaWYgKHNpemUgPD0gMCkgcmV0dXJuO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICBjdHgubGluZVdpZHRoID0gMTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG4gICAgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IFN0b25lIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge0tpLCBUaGVtZUNvbnRleHR9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7RmxhdFN0b25lfSBmcm9tICcuL0ZsYXRTdG9uZSc7XG5cbmV4cG9ydCBjbGFzcyBJbWFnZVN0b25lIGV4dGVuZHMgU3RvbmUge1xuICBwcml2YXRlIGZhbGxiYWNrU3RvbmU/OiBGbGF0U3RvbmU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBraTogbnVtYmVyLFxuICAgIHByaXZhdGUgbW9kOiBudW1iZXIsXG4gICAgcHJpdmF0ZSBibGFja3M6IGFueSxcbiAgICBwcml2YXRlIHdoaXRlczogYW55LFxuICAgIHByaXZhdGUgdGhlbWVDb250ZXh0PzogVGhlbWVDb250ZXh0XG4gICkge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwga2kpO1xuXG4gICAgLy8gQ3JlYXRlIEZsYXRTdG9uZSBhcyBmYWxsYmFjayBvcHRpb25cbiAgICBpZiAodGhlbWVDb250ZXh0KSB7XG4gICAgICB0aGlzLmZhbGxiYWNrU3RvbmUgPSBuZXcgRmxhdFN0b25lKGN0eCwgeCwgeSwga2ksIHRoZW1lQ29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBraSwgYmxhY2tzLCB3aGl0ZXMsIG1vZH0gPSB0aGlzO1xuICAgIGlmIChzaXplIDw9IDApIHJldHVybjtcblxuICAgIGxldCBpbWc7XG4gICAgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgaW1nID0gYmxhY2tzW21vZCAlIGJsYWNrcy5sZW5ndGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbWcgPSB3aGl0ZXNbbW9kICUgd2hpdGVzLmxlbmd0aF07XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgaW1hZ2UgaXMgbG9hZGVkIGNvbXBsZXRlbHlcbiAgICBpZiAoaW1nICYmIGltZy5jb21wbGV0ZSAmJiBpbWcubmF0dXJhbEhlaWdodCAhPT0gMCkge1xuICAgICAgLy8gSW1hZ2UgbG9hZGVkLCByZW5kZXIgd2l0aCBpbWFnZVxuICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW1hZ2Ugbm90IGxvYWRlZCBvciBsb2FkIGZhaWxlZCwgdXNlIEZsYXRTdG9uZSBhcyBmYWxsYmFja1xuICAgICAgaWYgKHRoaXMuZmFsbGJhY2tTdG9uZSkge1xuICAgICAgICB0aGlzLmZhbGxiYWNrU3RvbmUuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgdGhpcy5mYWxsYmFja1N0b25lLmRyYXcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRTaXplKHNpemU6IG51bWJlcikge1xuICAgIHN1cGVyLnNldFNpemUoc2l6ZSk7XG4gICAgLy8gU3luY2hyb25vdXNseSB1cGRhdGUgZmFsbGJhY2tTdG9uZSBzaXplXG4gICAgaWYgKHRoaXMuZmFsbGJhY2tTdG9uZSkge1xuICAgICAgdGhpcy5mYWxsYmFja1N0b25lLnNldFNpemUoc2l6ZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0FuYWx5c2lzUG9pbnRUaGVtZSwgTW92ZUluZm8sIFJvb3RJbmZvfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICBjYWxjQW5hbHlzaXNQb2ludENvbG9yLFxuICBjYWxjU2NvcmVEaWZmLFxuICBjYWxjU2NvcmVEaWZmVGV4dCxcbiAgbkZvcm1hdHRlcixcbiAgcm91bmQzLFxufSBmcm9tICcuLi9oZWxwZXInO1xuaW1wb3J0IHtcbiAgTElHSFRfR1JFRU5fUkdCLFxuICBMSUdIVF9SRURfUkdCLFxuICBMSUdIVF9ZRUxMT1dfUkdCLFxuICBZRUxMT1dfUkdCLFxufSBmcm9tICcuLi9jb25zdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuYWx5c2lzUG9pbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByaXZhdGUgeDogbnVtYmVyLFxuICAgIHByaXZhdGUgeTogbnVtYmVyLFxuICAgIHByaXZhdGUgcjogbnVtYmVyLFxuICAgIHByaXZhdGUgcm9vdEluZm86IFJvb3RJbmZvLFxuICAgIHByaXZhdGUgbW92ZUluZm86IE1vdmVJbmZvLFxuICAgIHByaXZhdGUgdGhlbWU6IEFuYWx5c2lzUG9pbnRUaGVtZSA9IEFuYWx5c2lzUG9pbnRUaGVtZS5EZWZhdWx0LFxuICAgIHByaXZhdGUgb3V0bGluZUNvbG9yPzogc3RyaW5nXG4gICkge31cblxuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHIsIHJvb3RJbmZvLCBtb3ZlSW5mbywgdGhlbWV9ID0gdGhpcztcbiAgICBpZiAociA8IDApIHJldHVybjtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICBjdHguc2hhZG93Q29sb3IgPSAnI2ZmZic7XG4gICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xuXG4gICAgLy8gdGhpcy5kcmF3RGVmYXVsdEFuYWx5c2lzUG9pbnQoKTtcbiAgICBpZiAodGhlbWUgPT09IEFuYWx5c2lzUG9pbnRUaGVtZS5EZWZhdWx0KSB7XG4gICAgICB0aGlzLmRyYXdEZWZhdWx0QW5hbHlzaXNQb2ludCgpO1xuICAgIH0gZWxzZSBpZiAodGhlbWUgPT09IEFuYWx5c2lzUG9pbnRUaGVtZS5Qcm9ibGVtKSB7XG4gICAgICB0aGlzLmRyYXdQcm9ibGVtQW5hbHlzaXNQb2ludCgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdQcm9ibGVtQW5hbHlzaXNQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm8sIG91dGxpbmVDb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHtvcmRlcn0gPSBtb3ZlSW5mbztcblxuICAgIGxldCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG5cbiAgICBpZiAob3JkZXIgPCA1KSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuOSwgeCwgeSwgcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjksICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBpZiAob3V0bGluZUNvbG9yKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSA0O1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBvdXRsaW5lQ29sb3I7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm9udFNpemUgPSByIC8gMS41O1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplICogMC44fXB4IFRhaG9tYWA7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZX1weCBUYWhvbWFgO1xuICAgICAgY29uc3Qgc2NvcmVUZXh0ID0gY2FsY1Njb3JlRGlmZlRleHQocm9vdEluZm8sIG1vdmVJbmZvKTtcbiAgICAgIGN0eC5maWxsVGV4dChzY29yZVRleHQsIHgsIHkpO1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplICogMC44fXB4IFRhaG9tYWA7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgIGN0eC5maWxsVGV4dChuRm9ybWF0dGVyKG1vdmVJbmZvLnZpc2l0cyksIHgsIHkgKyByIC8gMiArIGZvbnRTaXplIC8gOCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhd0NhbmRpZGF0ZVBvaW50KCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgZHJhd0RlZmF1bHRBbmFseXNpc1BvaW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHIsIHJvb3RJbmZvLCBtb3ZlSW5mb30gPSB0aGlzO1xuICAgIGNvbnN0IHtvcmRlcn0gPSBtb3ZlSW5mbztcblxuICAgIGxldCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG5cbiAgICBpZiAob3JkZXIgPCA1KSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuOSwgeCwgeSwgcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjksICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGN0eC5maWxsKCk7XG5cbiAgICAgIGNvbnN0IGZvbnRTaXplID0gciAvIDEuNTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgIGNvbnN0IHdpbnJhdGUgPVxuICAgICAgICByb290SW5mby5jdXJyZW50UGxheWVyID09PSAnQidcbiAgICAgICAgICA/IG1vdmVJbmZvLndpbnJhdGVcbiAgICAgICAgICA6IDEgLSBtb3ZlSW5mby53aW5yYXRlO1xuXG4gICAgICBjdHguZmlsbFRleHQocm91bmQzKHdpbnJhdGUsIDEwMCwgMSksIHgsIHkgLSByIC8gMiArIGZvbnRTaXplIC8gNSk7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggVGFob21hYDtcbiAgICAgIGNvbnN0IHNjb3JlVGV4dCA9IGNhbGNTY29yZURpZmZUZXh0KHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgICBjdHguZmlsbFRleHQoc2NvcmVUZXh0LCB4LCB5ICsgZm9udFNpemUgLyAzKTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHguZmlsbFRleHQobkZvcm1hdHRlcihtb3ZlSW5mby52aXNpdHMpLCB4LCB5ICsgciAvIDIgKyBmb250U2l6ZSAvIDMpO1xuXG4gICAgICBjb25zdCBvcmRlciA9IG1vdmVJbmZvLm9yZGVyO1xuICAgICAgY3R4LmZpbGxUZXh0KChvcmRlciArIDEpLnRvU3RyaW5nKCksIHggKyByLCB5IC0gciAvIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXdDYW5kaWRhdGVQb2ludCgpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGRyYXdDYW5kaWRhdGVQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm99ID0gdGhpcztcbiAgICBjb25zdCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoeCwgeSwgciAqIDAuNiwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICBjb25zdCBncmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCByICogMC40LCB4LCB5LCByKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45NSwgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCcpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7VGhlbWUsIFRoZW1lUHJvcGVydHlLZXksIFRoZW1lQ29udGV4dCwgVGhlbWVDb25maWd9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7REVGQVVMVF9USEVNRV9DT0xPUl9DT05GSUd9IGZyb20gJy4uL2NvbnN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya3VwIHtcbiAgcHJvdGVjdGVkIGdsb2JhbEFscGhhID0gMTtcbiAgcHJvdGVjdGVkIGNvbG9yID0gJyc7XG4gIHByb3RlY3RlZCBsaW5lRGFzaDogbnVtYmVyW10gPSBbXTtcbiAgcHJvdGVjdGVkIHRoZW1lQ29udGV4dD86IFRoZW1lQ29udGV4dDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcHJvdGVjdGVkIHg6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgeTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBzOiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIGtpOiBudW1iZXIsXG4gICAgdGhlbWVDb250ZXh0PzogVGhlbWVDb250ZXh0LFxuICAgIHByb3RlY3RlZCB2YWw6IHN0cmluZyB8IG51bWJlciA9ICcnXG4gICkge1xuICAgIHRoaXMudGhlbWVDb250ZXh0ID0gdGhlbWVDb250ZXh0O1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zb2xlLmxvZygnVEJEJyk7XG4gIH1cblxuICBzZXRHbG9iYWxBbHBoYShhbHBoYTogbnVtYmVyKSB7XG4gICAgdGhpcy5nbG9iYWxBbHBoYSA9IGFscGhhO1xuICB9XG5cbiAgc2V0Q29sb3IoY29sb3I6IHN0cmluZykge1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgfVxuXG4gIHNldExpbmVEYXNoKGxpbmVEYXNoOiBudW1iZXJbXSkge1xuICAgIHRoaXMubGluZURhc2ggPSBsaW5lRGFzaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSB0aGVtZSBwcm9wZXJ0eSB2YWx1ZSB3aXRoIGZhbGxiYWNrXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VGhlbWVQcm9wZXJ0eTxLIGV4dGVuZHMga2V5b2YgVGhlbWVDb25maWc+KFxuICAgIGtleTogS1xuICApOiBUaGVtZUNvbmZpZ1tLXSB7XG4gICAgaWYgKCF0aGlzLnRoZW1lQ29udGV4dCkge1xuICAgICAgY29uc29sZS5sb2coYFtERUJVR10gTm8gdGhlbWUgY29udGV4dCBmb3Iga2V5OiAke2tleX0sIHVzaW5nIGRlZmF1bHRgKTtcbiAgICAgIHJldHVybiBERUZBVUxUX1RIRU1FX0NPTE9SX0NPTkZJR1trZXldO1xuICAgIH1cblxuICAgIGNvbnN0IHt0aGVtZSwgdGhlbWVPcHRpb25zfSA9IHRoaXMudGhlbWVDb250ZXh0O1xuICAgIGNvbnN0IHRoZW1lU3BlY2lmaWMgPSB0aGVtZU9wdGlvbnNbdGhlbWVdO1xuICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSB0aGVtZU9wdGlvbnMuZGVmYXVsdDtcblxuICAgIGNvbnNvbGUubG9nKGBbREVCVUddIEdldHRpbmcgdGhlbWUgcHJvcGVydHk6YCwge1xuICAgICAga2V5LFxuICAgICAgdGhlbWUsXG4gICAgICB0aGVtZVNwZWNpZmljOiB0aGVtZVNwZWNpZmljPy5ba2V5XSxcbiAgICAgIGRlZmF1bHRDb25maWc6IGRlZmF1bHRDb25maWdba2V5XSxcbiAgICAgIGhhc1RoZW1lU3BlY2lmaWM6ICEhdGhlbWVTcGVjaWZpYz8uW2tleV0sXG4gICAgfSk7XG5cbiAgICAvLyBUcnkgdGhlbWUtc3BlY2lmaWMgdmFsdWUgZmlyc3QsIHRoZW4gZGVmYXVsdFxuICAgIGNvbnN0IHJlc3VsdCA9ICh0aGVtZVNwZWNpZmljPy5ba2V5XSA/P1xuICAgICAgZGVmYXVsdENvbmZpZ1trZXldKSBhcyBUaGVtZUNvbmZpZ1tLXTtcbiAgICBjb25zb2xlLmxvZyhgW0RFQlVHXSBSZXN1bHQgZm9yICR7a2V5fTpgLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIENpcmNsZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhLCBjb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjY1O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ21hcmt1cExpbmVXaWR0aCcpO1xuICAgIGN0eC5zZXRMaW5lRGFzaCh0aGlzLmxpbmVEYXNoKTtcbiAgICBpZiAoa2kgPT09IEtpLldoaXRlKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRCbGFja0NvbG9yJyk7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdib2FyZExpbmVDb2xvcicpO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgfVxuICAgIGlmIChjb2xvcikgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuaW1wb3J0IHtLaX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgQ3Jvc3NNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIHNpemUgPSByYWRpdXMgKiAwLjU4O1xuICAgIH1cbiAgICBjdHgubW92ZVRvKHggLSBzaXplLCB5IC0gc2l6ZSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgc2l6ZSwgeSArIHNpemUpO1xuICAgIGN0eC5tb3ZlVG8oeCArIHNpemUsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggLSBzaXplLCB5ICsgc2l6ZSk7XG5cbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFRleHRNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCB2YWwsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3Qgc2l6ZSA9IHMgKiAwLjg7XG4gICAgbGV0IGZvbnRTaXplID0gc2l6ZSAvIDEuNTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuXG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICB9XG4gICAgLy8gZWxzZSB7XG4gICAgLy8gICBjdHguY2xlYXJSZWN0KHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICAvLyB9XG4gICAgaWYgKHZhbC50b1N0cmluZygpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZm9udFNpemUgPSBzaXplIC8gMS41O1xuICAgIH0gZWxzZSBpZiAodmFsLnRvU3RyaW5nKCkubGVuZ3RoID09PSAyKSB7XG4gICAgICBmb250U2l6ZSA9IHNpemUgLyAxLjg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvbnRTaXplID0gc2l6ZSAvIDIuMDtcbiAgICB9XG4gICAgY3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IFRhaG9tYWA7XG4gICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICBjdHguZmlsbFRleHQodmFsLnRvU3RyaW5nKCksIHgsIHkgKyAyKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5pbXBvcnQge0tpfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBTcXVhcmVNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ21hcmt1cExpbmVXaWR0aCcpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGxldCBzaXplID0gcyAqIDAuNTU7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBjdHgucmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC43NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubW92ZVRvKHgsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggLSBzaXplICogTWF0aC5jb3MoMC41MjMpLCB5ICsgc2l6ZSAqIE1hdGguc2luKDAuNTIzKSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgc2l6ZSAqIE1hdGguY29zKDAuNTIzKSwgeSArIHNpemUgKiBNYXRoLnNpbigwLjUyMykpO1xuXG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnbWFya3VwTGluZVdpZHRoJyk7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgICAgc2l6ZSA9IHJhZGl1cyAqIDAuNztcbiAgICB9XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBOb2RlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgY29sb3IsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNDtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gNDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgQWN0aXZlTm9kZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGNvbG9yLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5zZXRMaW5lRGFzaCh0aGlzLmxpbmVEYXNoKTtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplICogMC40LCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQge0tpfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBDaXJjbGVTb2xpZE1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhLCBjb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjI1O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC42NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdtYXJrdXBMaW5lV2lkdGgnKTtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBpZiAoY29sb3IpIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuaW1wb3J0IHtLaX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0TWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdtYXJrdXBMaW5lV2lkdGgnKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjY7XG4gICAgbGV0IHNpemUgPSBzICogMC40O1xuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2hpZ2hsaWdodENvbG9yJyk7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSB8fCBraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIHNpemUgPSBzICogMC4zNTtcbiAgICB9XG4gICAgY3R4LmFyYyh4LCB5LCBzaXplLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBFZmZlY3RCYXNlIHtcbiAgcHJvdGVjdGVkIGdsb2JhbEFscGhhID0gMTtcbiAgcHJvdGVjdGVkIGNvbG9yID0gJyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgc2l6ZTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge31cblxuICBwbGF5KCkge1xuICAgIGNvbnNvbGUubG9nKCdUQkQnKTtcbiAgfVxufVxuIiwiaW1wb3J0IEVmZmVjdEJhc2UgZnJvbSAnLi9FZmZlY3RCYXNlJztcbmltcG9ydCB7ZW5jb2RlfSBmcm9tICdqcy1iYXNlNjQnO1xuXG5jb25zdCBiYW5TdmcgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIGNsYXNzPVwiYmkgYmktYmFuXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPlxuICA8cGF0aCBkPVwiTTE1IDhhNi45NyA2Ljk3IDAgMCAwLTEuNzEtNC41ODRsLTkuODc0IDkuODc1QTcgNyAwIDAgMCAxNSA4TTIuNzEgMTIuNTg0bDkuODc0LTkuODc1YTcgNyAwIDAgMC05Ljg3NCA5Ljg3NFpNMTYgOEE4IDggMCAxIDEgMCA4YTggOCAwIDAgMSAxNiAwXCIvPlxuPC9zdmc+YDtcblxuZXhwb3J0IGNsYXNzIEJhbkVmZmVjdCBleHRlbmRzIEVmZmVjdEJhc2Uge1xuICBwcml2YXRlIGltZyA9IG5ldyBJbWFnZSgpO1xuICBwcml2YXRlIGFscGhhID0gMDtcbiAgcHJpdmF0ZSBmYWRlSW5EdXJhdGlvbiA9IDIwMDtcbiAgcHJpdmF0ZSBmYWRlT3V0RHVyYXRpb24gPSAxNTA7XG4gIHByaXZhdGUgc3RheUR1cmF0aW9uID0gNDAwO1xuICBwcml2YXRlIHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIHByaXZhdGUgaXNGYWRpbmdPdXQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcHJvdGVjdGVkIHg6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgeTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBzaXplOiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIGtpOiBudW1iZXJcbiAgKSB7XG4gICAgc3VwZXIoY3R4LCB4LCB5LCBzaXplLCBraSk7XG5cbiAgICAvLyBDb252ZXJ0IFNWRyBzdHJpbmcgdG8gYSBkYXRhIFVSTFxuICAgIGNvbnN0IHN2Z0Jsb2IgPSBuZXcgQmxvYihbYmFuU3ZnXSwge3R5cGU6ICdpbWFnZS9zdmcreG1sJ30pO1xuXG4gICAgY29uc3Qgc3ZnRGF0YVVybCA9IGBkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCR7ZW5jb2RlKGJhblN2Zyl9YDtcblxuICAgIHRoaXMuaW1nID0gbmV3IEltYWdlKCk7XG4gICAgdGhpcy5pbWcuc3JjID0gc3ZnRGF0YVVybDtcbiAgfVxuXG4gIHBsYXkgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmltZy5jb21wbGV0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtjdHgsIHgsIHksIHNpemUsIGltZywgZmFkZUluRHVyYXRpb24sIGZhZGVPdXREdXJhdGlvbn0gPSB0aGlzO1xuXG4gICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBpZiAoIXRoaXMuc3RhcnRUaW1lKSB7XG4gICAgICB0aGlzLnN0YXJ0VGltZSA9IG5vdztcbiAgICB9XG5cbiAgICBjdHguY2xlYXJSZWN0KHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSB0aGlzLmFscGhhO1xuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCB4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcblxuICAgIGNvbnN0IGVsYXBzZWQgPSBub3cgLSB0aGlzLnN0YXJ0VGltZTtcblxuICAgIGlmICghdGhpcy5pc0ZhZGluZ091dCkge1xuICAgICAgdGhpcy5hbHBoYSA9IE1hdGgubWluKGVsYXBzZWQgLyBmYWRlSW5EdXJhdGlvbiwgMSk7XG4gICAgICBpZiAoZWxhcHNlZCA+PSBmYWRlSW5EdXJhdGlvbikge1xuICAgICAgICB0aGlzLmFscGhhID0gMTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pc0ZhZGluZ091dCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfSwgdGhpcy5zdGF5RHVyYXRpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmYWRlRWxhcHNlZCA9IG5vdyAtIHRoaXMuc3RhcnRUaW1lO1xuICAgICAgdGhpcy5hbHBoYSA9IE1hdGgubWF4KDEgLSBmYWRlRWxhcHNlZCAvIGZhZGVPdXREdXJhdGlvbiwgMCk7XG4gICAgICBpZiAoZmFkZUVsYXBzZWQgPj0gZmFkZU91dER1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMuYWxwaGEgPSAwO1xuICAgICAgICBjdHguY2xlYXJSZWN0KHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnBsYXkpO1xuICB9O1xufVxuIiwiaW1wb3J0IHtjb21wYWN0fSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgY2FsY1Zpc2libGVBcmVhLFxuICByZXZlcnNlT2Zmc2V0LFxuICB6ZXJvcyxcbiAgZW1wdHksXG4gIGExVG9Qb3MsXG4gIG9mZnNldEExTW92ZSxcbiAgY2FuTW92ZSxcbn0gZnJvbSAnLi9oZWxwZXInO1xuaW1wb3J0IHtcbiAgQTFfTEVUVEVSUyxcbiAgQTFfTlVNQkVSUyxcbiAgREVGQVVMVF9PUFRJT05TLFxuICBNQVhfQk9BUkRfU0laRSxcbiAgVEhFTUVfUkVTT1VSQ0VTLFxuICBERUZBVUxUX1RIRU1FX0NPTE9SX0NPTkZJRyxcbn0gZnJvbSAnLi9jb25zdCc7XG5pbXBvcnQge1xuICBDdXJzb3IsXG4gIE1hcmt1cCxcbiAgVGhlbWUsXG4gIEtpLFxuICBBbmFseXNpcyxcbiAgR2hvc3RCYW5PcHRpb25zLFxuICBHaG9zdEJhbk9wdGlvbnNQYXJhbXMsXG4gIENlbnRlcixcbiAgQW5hbHlzaXNQb2ludFRoZW1lLFxuICBFZmZlY3QsXG4gIFRoZW1lT3B0aW9ucyxcbiAgVGhlbWVDb25maWcsXG4gIFRoZW1lUHJvcGVydHlLZXksXG4gIFRoZW1lQ29udGV4dCxcbn0gZnJvbSAnLi90eXBlcyc7XG5cbmltcG9ydCB7SW1hZ2VTdG9uZSwgRmxhdFN0b25lfSBmcm9tICcuL3N0b25lcyc7XG5pbXBvcnQgQW5hbHlzaXNQb2ludCBmcm9tICcuL3N0b25lcy9BbmFseXNpc1BvaW50JztcblxuaW1wb3J0IHtcbiAgQ2lyY2xlTWFya3VwLFxuICBDcm9zc01hcmt1cCxcbiAgVGV4dE1hcmt1cCxcbiAgU3F1YXJlTWFya3VwLFxuICBUcmlhbmdsZU1hcmt1cCxcbiAgTm9kZU1hcmt1cCxcbiAgQWN0aXZlTm9kZU1hcmt1cCxcbiAgQ2lyY2xlU29saWRNYXJrdXAsXG4gIEhpZ2hsaWdodE1hcmt1cCxcbn0gZnJvbSAnLi9tYXJrdXBzJztcbmltcG9ydCB7QmFuRWZmZWN0fSBmcm9tICcuL2VmZmVjdHMnO1xuXG4vLyBVdGlsaXR5IGZ1bmN0aW9ucyBmb3IgbW9iaWxlIGRldGVjdGlvbiBhbmQgcmVzb3VyY2Ugc2VsZWN0aW9uXG5jb25zdCBpc01vYmlsZSA9ICgpOiBib29sZWFuID0+IHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAoXG4gICAgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KFxuICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgICkgfHwgd2luZG93LmlubmVyV2lkdGggPD0gNzY4XG4gICk7XG59O1xuXG5jb25zdCBnZXRUaGVtZVJlc291cmNlcyA9ICh0aGVtZTogVGhlbWUsIHRoZW1lUmVzb3VyY2VzOiBhbnkpID0+IHtcbiAgY29uc3QgcmVzb3VyY2VzID0gdGhlbWVSZXNvdXJjZXNbdGhlbWVdO1xuICBpZiAoIXJlc291cmNlcykgcmV0dXJuIG51bGw7XG5cbiAgLy8gSWYgb24gbW9iaWxlIGFuZCBsb3dSZXMgZXhpc3RzLCB1c2UgbG93UmVzIHJlc291cmNlc1xuICBpZiAoaXNNb2JpbGUoKSAmJiByZXNvdXJjZXMubG93UmVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJvYXJkOiByZXNvdXJjZXMubG93UmVzLmJvYXJkIHx8IHJlc291cmNlcy5ib2FyZCxcbiAgICAgIGJsYWNrczpcbiAgICAgICAgcmVzb3VyY2VzLmxvd1Jlcy5ibGFja3MubGVuZ3RoID4gMFxuICAgICAgICAgID8gcmVzb3VyY2VzLmxvd1Jlcy5ibGFja3NcbiAgICAgICAgICA6IHJlc291cmNlcy5ibGFja3MsXG4gICAgICB3aGl0ZXM6XG4gICAgICAgIHJlc291cmNlcy5sb3dSZXMud2hpdGVzLmxlbmd0aCA+IDBcbiAgICAgICAgICA/IHJlc291cmNlcy5sb3dSZXMud2hpdGVzXG4gICAgICAgICAgOiByZXNvdXJjZXMud2hpdGVzLFxuICAgIH07XG4gIH1cblxuICAvLyBPdGhlcndpc2UgdXNlIHJlZ3VsYXIgcmVzb3VyY2VzXG4gIHJldHVybiB7XG4gICAgYm9hcmQ6IHJlc291cmNlcy5ib2FyZCxcbiAgICBibGFja3M6IHJlc291cmNlcy5ibGFja3MsXG4gICAgd2hpdGVzOiByZXNvdXJjZXMud2hpdGVzLFxuICB9O1xufTtcblxuY29uc3QgaW1hZ2VzOiB7XG4gIFtrZXk6IHN0cmluZ106IEhUTUxJbWFnZUVsZW1lbnQ7XG59ID0ge307XG5cbmZ1bmN0aW9uIGlzTW9iaWxlRGV2aWNlKCkge1xuICByZXR1cm4gL01vYml8QW5kcm9pZHxpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QoXG4gICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICApO1xufVxuXG5mdW5jdGlvbiBwcmVsb2FkKFxuICB1cmxzOiBzdHJpbmdbXSxcbiAgZG9uZTogKCkgPT4gdm9pZCxcbiAgb25JbWFnZUxvYWRlZD86ICh1cmw6IHN0cmluZykgPT4gdm9pZFxuKSB7XG4gIGxldCBsb2FkZWQgPSAwO1xuICBjb25zdCBpbWFnZUxvYWRlZCA9ICgpID0+IHtcbiAgICBsb2FkZWQrKztcbiAgICBpZiAobG9hZGVkID09PSB1cmxzLmxlbmd0aCkge1xuICAgICAgZG9uZSgpO1xuICAgIH1cbiAgfTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cmxzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFpbWFnZXNbdXJsc1tpXV0pIHtcbiAgICAgIGltYWdlc1t1cmxzW2ldXSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2VzW3VybHNbaV1dLnNyYyA9IHVybHNbaV07XG4gICAgICBpbWFnZXNbdXJsc1tpXV0ub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZUxvYWRlZCgpO1xuICAgICAgICAvLyBDYWxsYmFjayB3aGVuIHNpbmdsZSBpbWFnZSBsb2FkIGNvbXBsZXRlc1xuICAgICAgICBpZiAob25JbWFnZUxvYWRlZCkge1xuICAgICAgICAgIG9uSW1hZ2VMb2FkZWQodXJsc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpbWFnZXNbdXJsc1tpXV0ub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW1hZ2VMb2FkZWQoKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChpbWFnZXNbdXJsc1tpXV0uY29tcGxldGUpIHtcbiAgICAgIC8vIEltYWdlIGFscmVhZHkgbG9hZGVkXG4gICAgICBpbWFnZUxvYWRlZCgpO1xuICAgIH1cbiAgfVxufVxuXG5sZXQgZHByID0gMS4wO1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEuMDtcbn1cblxuY29uc3QgREVGQVVMVF9USEVNRV9PUFRJT05TOiBUaGVtZU9wdGlvbnMgPSB7XG4gIGRlZmF1bHQ6IERFRkFVTFRfVEhFTUVfQ09MT1JfQ09ORklHLFxuICBbVGhlbWUuRmxhdF06IHtcbiAgICBib2FyZEJhY2tncm91bmRDb2xvcjogJyNFQ0I1NUEnLFxuICB9LFxuICBbVGhlbWUuV2FybV06IHtcbiAgICBib2FyZEJhY2tncm91bmRDb2xvcjogJyNDMThCNTAnLFxuICB9LFxuICBbVGhlbWUuRGFya106IHtcbiAgICBhY3RpdmVDb2xvcjogJyM5Q0EzQUYnLFxuICAgIGluYWN0aXZlQ29sb3I6ICcjNjY2NjY2JyxcbiAgICBib2FyZExpbmVDb2xvcjogJyM5Q0EzQUYnLFxuICAgIGJvYXJkQmFja2dyb3VuZENvbG9yOiAnIzJCMzAzNScsXG4gIH0sXG4gIFtUaGVtZS5ZdW56aU1vbmtleURhcmtdOiB7XG4gICAgYWN0aXZlQ29sb3I6ICcjQTFDOUFGJyxcbiAgICBpbmFjdGl2ZUNvbG9yOiAnI0ExQzlBRicsXG4gICAgYm9hcmRMaW5lQ29sb3I6ICcjQTFDOUFGJyxcbiAgICBmbGF0QmxhY2tDb2xvcjogJyMwRTIwMTknLFxuICAgIGZsYXRCbGFja0NvbG9yQWx0OiAnIzAyMUQxMScsXG4gICAgZmxhdFdoaXRlQ29sb3I6ICcjQTJDOEI0JyxcbiAgICBmbGF0V2hpdGVDb2xvckFsdDogJyNBRkNCQkMnLFxuICB9LFxuICBbVGhlbWUuSGlnaENvbnRyYXN0XToge1xuICAgIC8vIEhpZ2ggY29udHJhc3QgdGhlbWUsIGZyaWVuZGx5IGZvciBhbGwgdHlwZXMgb2YgY29sb3IgYmxpbmRuZXNzXG4gICAgYm9hcmRCYWNrZ3JvdW5kQ29sb3I6ICcjRjVGNURDJywgLy8gQmVpZ2UgYmFja2dyb3VuZCwgZ2VudGxlIG9uIGV5ZXNcbiAgICBib2FyZExpbmVDb2xvcjogJyMyRjRGNEYnLCAvLyBEYXJrIHNsYXRlIGdyYXkgbGluZXMgZm9yIGhpZ2ggY29udHJhc3RcbiAgICBhY3RpdmVDb2xvcjogJyMyRjRGNEYnLFxuICAgIGluYWN0aXZlQ29sb3I6ICcjODA4MDgwJyxcblxuICAgIC8vIFN0b25lIGNvbG9yczogdHJhZGl0aW9uYWwgYmxhY2sgYW5kIHdoaXRlIGZvciBtYXhpbXVtIGNvbnRyYXN0IGFuZCBjb2xvciBibGluZCBmcmllbmRsaW5lc3NcbiAgICBmbGF0QmxhY2tDb2xvcjogJyMwMDAwMDAnLCAvLyBQdXJlIGJsYWNrIC0gdW5pdmVyc2FsbHkgYWNjZXNzaWJsZVxuICAgIGZsYXRCbGFja0NvbG9yQWx0OiAnIzFBMUExQScsIC8vIFZlcnkgZGFyayBncmF5IHZhcmlhbnRcbiAgICBmbGF0V2hpdGVDb2xvcjogJyNGRkZGRkYnLCAvLyBQdXJlIHdoaXRlIC0gbWF4aW11bSBjb250cmFzdCB3aXRoIGJsYWNrXG4gICAgZmxhdFdoaXRlQ29sb3JBbHQ6ICcjRjhGOEY4JywgLy8gVmVyeSBsaWdodCBncmF5IHZhcmlhbnRcblxuICAgIC8vIE5vZGUgYW5kIG1hcmt1cCBjb2xvcnMgLSB1c2luZyBjb2xvcmJsaW5kLWZyaWVuZGx5IGNvbG9ycyB0aGF0IGF2b2lkIHJlZC1ncmVlbiBjb21iaW5hdGlvbnNcbiAgICBwb3NpdGl2ZU5vZGVDb2xvcjogJyMwMjg0QzcnLCAvLyBCbHVlIChwb3NpdGl2ZSkgLSBzYWZlIGZvciBhbGwgY29sb3IgYmxpbmRuZXNzIHR5cGVzXG4gICAgbmVnYXRpdmVOb2RlQ29sb3I6ICcjRUE1ODBDJywgLy8gT3JhbmdlIChuZWdhdGl2ZSkgLSBkaXN0aW5ndWlzaGFibGUgZnJvbSBibHVlIGZvciBhbGwgdXNlcnNcbiAgICBuZXV0cmFsTm9kZUNvbG9yOiAnIzdDMkQxMicsIC8vIEJyb3duIChuZXV0cmFsKSAtIGFsdGVybmF0aXZlIHRvIHByb2JsZW1hdGljIGNvbG9yc1xuICAgIGRlZmF1bHROb2RlQ29sb3I6ICcjNEI1NTYzJywgLy8gRGFyayBncmF5XG4gICAgd2FybmluZ05vZGVDb2xvcjogJyNGQkJGMjQnLCAvLyBCcmlnaHQgeWVsbG93IHdhcm5pbmdcblxuICAgIC8vIEhpZ2hsaWdodCBhbmQgc2hhZG93XG4gICAgaGlnaGxpZ2h0Q29sb3I6ICcjRkRFMDQ3JywgLy8gQnJpZ2h0IHllbGxvdyBoaWdobGlnaHRcbiAgICBzaGFkb3dDb2xvcjogJyMzNzQxNTEnLCAvLyBEYXJrIGdyYXkgc2hhZG93XG4gIH0sXG59O1xuXG5leHBvcnQgY2xhc3MgR2hvc3RCYW4ge1xuICBkZWZhdWx0T3B0aW9uczogR2hvc3RCYW5PcHRpb25zID0ge1xuICAgIGJvYXJkU2l6ZTogMTksXG4gICAgZHluYW1pY1BhZGRpbmc6IGZhbHNlLFxuICAgIHBhZGRpbmc6IDEwLFxuICAgIGV4dGVudDogMyxcbiAgICBpbnRlcmFjdGl2ZTogZmFsc2UsXG4gICAgY29vcmRpbmF0ZTogdHJ1ZSxcbiAgICB0aGVtZTogVGhlbWUuQmxhY2tBbmRXaGl0ZSxcbiAgICBhbmFseXNpc1BvaW50VGhlbWU6IEFuYWx5c2lzUG9pbnRUaGVtZS5EZWZhdWx0LFxuICAgIGJhY2tncm91bmQ6IGZhbHNlLFxuICAgIHNob3dBbmFseXNpczogZmFsc2UsXG4gICAgYWRhcHRpdmVCb2FyZExpbmU6IHRydWUsXG4gICAgdGhlbWVPcHRpb25zOiBERUZBVUxUX1RIRU1FX09QVElPTlMsXG4gICAgdGhlbWVSZXNvdXJjZXM6IFRIRU1FX1JFU09VUkNFUyxcbiAgICBtb3ZlU291bmQ6IGZhbHNlLFxuICAgIGFkYXB0aXZlU3RhclNpemU6IHRydWUsXG4gICAgbW9iaWxlSW5kaWNhdG9yT2Zmc2V0OiAwLFxuICB9O1xuICBvcHRpb25zOiBHaG9zdEJhbk9wdGlvbnM7XG4gIGRvbTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gIGNhbnZhcz86IEhUTUxDYW52YXNFbGVtZW50O1xuICBib2FyZD86IEhUTUxDYW52YXNFbGVtZW50O1xuICBhbmFseXNpc0NhbnZhcz86IEhUTUxDYW52YXNFbGVtZW50O1xuICBjdXJzb3JDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgbWFya3VwQ2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGVmZmVjdENhbnZhcz86IEhUTUxDYW52YXNFbGVtZW50O1xuICBtb3ZlU291bmRBdWRpbz86IEhUTUxBdWRpb0VsZW1lbnQ7XG4gIHR1cm46IEtpO1xuICBwcml2YXRlIGN1cnNvcjogQ3Vyc29yID0gQ3Vyc29yLk5vbmU7XG4gIHByaXZhdGUgY3Vyc29yVmFsdWU6IHN0cmluZyA9ICcnO1xuICBwcml2YXRlIHRvdWNoTW92aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgdG91Y2hTdGFydFBvaW50OiBET01Qb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICBwdWJsaWMgY3Vyc29yUG9zaXRpb246IFtudW1iZXIsIG51bWJlcl07XG4gIHB1YmxpYyBhY3R1YWxDdXJzb3JQb3NpdGlvbjogW251bWJlciwgbnVtYmVyXTtcbiAgcHVibGljIGN1cnNvclBvaW50OiBET01Qb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICBwdWJsaWMgYWN0dWFsQ3Vyc29yUG9pbnQ6IERPTVBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gIHB1YmxpYyBtYXQ6IG51bWJlcltdW107XG4gIHB1YmxpYyBtYXJrdXA6IHN0cmluZ1tdW107XG4gIHB1YmxpYyB2aXNpYmxlQXJlYU1hdDogbnVtYmVyW11bXSB8IHVuZGVmaW5lZDtcbiAgcHVibGljIHByZXZlbnRNb3ZlTWF0OiBudW1iZXJbXVtdO1xuICBwdWJsaWMgZWZmZWN0TWF0OiBzdHJpbmdbXVtdO1xuICBtYXhodjogbnVtYmVyO1xuICB0cmFuc01hdDogRE9NTWF0cml4O1xuICBhbmFseXNpczogQW5hbHlzaXMgfCBudWxsO1xuICB2aXNpYmxlQXJlYTogbnVtYmVyW11bXTtcbiAgbm9kZU1hcmt1cFN0eWxlczoge1xuICAgIFtrZXk6IHN0cmluZ106IHtcbiAgICAgIGNvbG9yOiBzdHJpbmc7XG4gICAgICBsaW5lRGFzaDogbnVtYmVyW107XG4gICAgfTtcbiAgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEdob3N0QmFuT3B0aW9uc1BhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLi4udGhpcy5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB0aGVtZU9wdGlvbnM6IHtcbiAgICAgICAgLi4udGhpcy5kZWZhdWx0T3B0aW9ucy50aGVtZU9wdGlvbnMsXG4gICAgICAgIC4uLihvcHRpb25zLnRoZW1lT3B0aW9ucyB8fCB7fSksXG4gICAgICB9LFxuICAgIH07XG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMub3B0aW9ucy5ib2FyZFNpemU7XG4gICAgdGhpcy5tYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMucHJldmVudE1vdmVNYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMubWFya3VwID0gZW1wdHkoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLmVmZmVjdE1hdCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy50dXJuID0gS2kuQmxhY2s7XG4gICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IFstMSwgLTFdO1xuICAgIHRoaXMuYWN0dWFsQ3Vyc29yUG9zaXRpb24gPSBbLTEsIC0xXTtcbiAgICB0aGlzLm1heGh2ID0gc2l6ZTtcbiAgICB0aGlzLnRyYW5zTWF0ID0gbmV3IERPTU1hdHJpeCgpO1xuICAgIHRoaXMuYW5hbHlzaXMgPSBudWxsO1xuICAgIHRoaXMudmlzaWJsZUFyZWEgPSBbXG4gICAgICBbMCwgc2l6ZSAtIDFdLFxuICAgICAgWzAsIHNpemUgLSAxXSxcbiAgICBdO1xuXG4gICAgdGhpcy51cGRhdGVOb2RlTWFya3VwU3R5bGVzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldFRoZW1lUHJvcGVydHk8VCBleHRlbmRzIGtleW9mIFRoZW1lQ29uZmlnPihcbiAgICBwcm9wZXJ0eUtleTogVFxuICApOiBUaGVtZUNvbmZpZ1tUXTtcbiAgcHJpdmF0ZSBnZXRUaGVtZVByb3BlcnR5KHByb3BlcnR5S2V5OiBUaGVtZVByb3BlcnR5S2V5KTogc3RyaW5nIHwgbnVtYmVyO1xuICBwcml2YXRlIGdldFRoZW1lUHJvcGVydHk8VCBleHRlbmRzIGtleW9mIFRoZW1lQ29uZmlnPihcbiAgICBwcm9wZXJ0eUtleTogVCB8IFRoZW1lUHJvcGVydHlLZXlcbiAgKTogVGhlbWVDb25maWdbVF0gfCBzdHJpbmcgfCBudW1iZXIge1xuICAgIGNvbnN0IGtleSA9XG4gICAgICB0eXBlb2YgcHJvcGVydHlLZXkgPT09ICdzdHJpbmcnID8gcHJvcGVydHlLZXkgOiAocHJvcGVydHlLZXkgYXMgc3RyaW5nKTtcbiAgICBjb25zdCBjdXJyZW50VGhlbWUgPSB0aGlzLm9wdGlvbnMudGhlbWU7XG4gICAgY29uc3QgdGhlbWVDb25maWcgPSB0aGlzLm9wdGlvbnMudGhlbWVPcHRpb25zW2N1cnJlbnRUaGVtZV0gfHwge307XG4gICAgY29uc3QgZGVmYXVsdENvbmZpZyA9IHRoaXMub3B0aW9ucy50aGVtZU9wdGlvbnMuZGVmYXVsdCB8fCB7fTtcblxuICAgIGNvbnN0IHJlc3VsdCA9ICh0aGVtZUNvbmZpZ1trZXkgYXMga2V5b2YgVGhlbWVDb25maWddIHx8XG4gICAgICBkZWZhdWx0Q29uZmlnW2tleSBhcyBrZXlvZiBUaGVtZUNvbmZpZ10pIGFzIFRoZW1lQ29uZmlnW1RdO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlbWUgY29udGV4dCBmb3IgbWFya3VwIGNvbXBvbmVudHNcbiAgICovXG4gIHByaXZhdGUgY3JlYXRlVGhlbWVDb250ZXh0KCk6IFRoZW1lQ29udGV4dCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRoZW1lOiB0aGlzLm9wdGlvbnMudGhlbWUsXG4gICAgICB0aGVtZU9wdGlvbnM6IHRoaXMub3B0aW9ucy50aGVtZU9wdGlvbnMsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTm9kZU1hcmt1cFN0eWxlcygpIHtcbiAgICBjb25zdCBkZWZhdWx0RGFzaGVkTGluZURhc2ggPSBbOCwgNl07XG4gICAgY29uc3QgZGVmYXVsdERvdHRlZExpbmVEYXNoID0gWzQsIDRdO1xuXG4gICAgdGhpcy5ub2RlTWFya3VwU3R5bGVzID0ge1xuICAgICAgW01hcmt1cC5Qb3NpdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5Qb3NpdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5lZ2F0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZXV0cmFsTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5EZWZhdWx0Tm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ05vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5XYXJuaW5nTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVEYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuUG9zaXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVEYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmVnYXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbERhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZXV0cmFsTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHREYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuRGVmYXVsdE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nRGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lldhcm5pbmdOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVEb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuUG9zaXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVEb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmVnYXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbERvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZXV0cmFsTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHREb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuRGVmYXVsdE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nRG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lldhcm5pbmdOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuUG9zaXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZUFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuRGVmYXVsdE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuV2FybmluZ05vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlRGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlRGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5lZ2F0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxEYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0RGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkRlZmF1bHROb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0Rhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5XYXJuaW5nTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlRG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlRG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5lZ2F0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxEb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0RG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkRlZmF1bHROb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0RvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5XYXJuaW5nTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHNldFR1cm4odHVybjogS2kpIHtcbiAgICB0aGlzLnR1cm4gPSB0dXJuO1xuICB9XG5cbiAgc2V0Qm9hcmRTaXplKHNpemU6IG51bWJlcikge1xuICAgIHRoaXMub3B0aW9ucy5ib2FyZFNpemUgPSBNYXRoLm1pbihzaXplLCBNQVhfQk9BUkRfU0laRSk7XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuY2FudmFzIHx8XG4gICAgICAhdGhpcy5jdXJzb3JDYW52YXMgfHxcbiAgICAgICF0aGlzLmRvbSB8fFxuICAgICAgIXRoaXMuYm9hcmQgfHxcbiAgICAgICF0aGlzLm1hcmt1cENhbnZhcyB8fFxuICAgICAgIXRoaXMuYW5hbHlzaXNDYW52YXMgfHxcbiAgICAgICF0aGlzLmVmZmVjdENhbnZhc1xuICAgIClcbiAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGNhbnZhc2VzID0gW1xuICAgICAgdGhpcy5ib2FyZCxcbiAgICAgIHRoaXMuY2FudmFzLFxuICAgICAgdGhpcy5tYXJrdXBDYW52YXMsXG4gICAgICB0aGlzLmN1cnNvckNhbnZhcyxcbiAgICAgIHRoaXMuYW5hbHlzaXNDYW52YXMsXG4gICAgICB0aGlzLmVmZmVjdENhbnZhcyxcbiAgICBdO1xuXG4gICAgY29uc3Qge3NpemV9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHtjbGllbnRXaWR0aH0gPSB0aGlzLmRvbTtcblxuICAgIGNhbnZhc2VzLmZvckVhY2goY2FudmFzID0+IHtcbiAgICAgIGlmIChzaXplKSB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHNpemUgKiBkcHI7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBzaXplICogZHByO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMud2lkdGggPSBNYXRoLmZsb29yKGNsaWVudFdpZHRoICogZHByKTtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ2FudmFzKGlkOiBzdHJpbmcsIHBvaW50ZXJFdmVudHMgPSB0cnVlKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgY2FudmFzLmlkID0gaWQ7XG4gICAgaWYgKCFwb2ludGVyRXZlbnRzKSB7XG4gICAgICBjYW52YXMuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICB9XG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxuXG4gIGluaXQoZG9tOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplO1xuICAgIHRoaXMubWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLm1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcblxuICAgIHRoaXMuYm9hcmQgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tYm9hcmQnKTtcbiAgICB0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1jYW52YXMnKTtcbiAgICB0aGlzLm1hcmt1cENhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1tYXJrdXAnLCBmYWxzZSk7XG4gICAgdGhpcy5jdXJzb3JDYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tY3Vyc29yJyk7XG4gICAgdGhpcy5hbmFseXNpc0NhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1hbmFseXNpcycsIGZhbHNlKTtcbiAgICB0aGlzLmVmZmVjdENhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1lZmZlY3QnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmRvbSA9IGRvbTtcbiAgICBkb20uaW5uZXJIVE1MID0gJyc7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuYm9hcmQpO1xuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMubWFya3VwQ2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5hbmFseXNpc0NhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuY3Vyc29yQ2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5lZmZlY3RDYW52YXMpO1xuXG4gICAgdGhpcy5yZXNpemUoKTtcbiAgICB0aGlzLnJlbmRlckludGVyYWN0aXZlKCk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXRPcHRpb25zKG9wdGlvbnM6IEdob3N0QmFuT3B0aW9uc1BhcmFtcykge1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB0aGVtZU9wdGlvbnM6IHtcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLnRoZW1lT3B0aW9ucyxcbiAgICAgICAgLi4uKG9wdGlvbnMudGhlbWVPcHRpb25zIHx8IHt9KSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZU5vZGVNYXJrdXBTdHlsZXMoKTtcbiAgICB0aGlzLnJlbmRlckludGVyYWN0aXZlKCk7XG4gIH1cblxuICBzZXRNYXQobWF0OiBudW1iZXJbXVtdKSB7XG4gICAgdGhpcy5tYXQgPSBtYXQ7XG4gICAgaWYgKCF0aGlzLnZpc2libGVBcmVhTWF0KSB7XG4gICAgICB0aGlzLnZpc2libGVBcmVhTWF0ID0gbWF0O1xuICAgIH1cbiAgfVxuXG4gIHNldFZpc2libGVBcmVhTWF0KG1hdDogbnVtYmVyW11bXSkge1xuICAgIHRoaXMudmlzaWJsZUFyZWFNYXQgPSBtYXQ7XG4gIH1cblxuICBzZXRQcmV2ZW50TW92ZU1hdChtYXQ6IG51bWJlcltdW10pIHtcbiAgICB0aGlzLnByZXZlbnRNb3ZlTWF0ID0gbWF0O1xuICB9XG5cbiAgc2V0RWZmZWN0TWF0KG1hdDogc3RyaW5nW11bXSkge1xuICAgIHRoaXMuZWZmZWN0TWF0ID0gbWF0O1xuICB9XG5cbiAgc2V0TWFya3VwKG1hcmt1cDogc3RyaW5nW11bXSkge1xuICAgIHRoaXMubWFya3VwID0gbWFya3VwO1xuICB9XG5cbiAgc2V0Q3Vyc29yKGN1cnNvcjogQ3Vyc29yLCB2YWx1ZSA9ICcnKSB7XG4gICAgdGhpcy5jdXJzb3IgPSBjdXJzb3I7XG4gICAgdGhpcy5jdXJzb3JWYWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgc2V0Q3Vyc29yV2l0aFJlbmRlciA9IChkb21Qb2ludDogRE9NUG9pbnQsIG9mZnNldFkgPSAwKSA9PiB7XG4gICAgY29uc3Qge3BhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHtzcGFjZX0gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMudHJhbnNNYXQuaW52ZXJzZSgpLnRyYW5zZm9ybVBvaW50KGRvbVBvaW50KTtcbiAgICBjb25zdCBpZHggPSBNYXRoLnJvdW5kKChwb2ludC54IC0gcGFkZGluZyArIHNwYWNlIC8gMikgLyBzcGFjZSk7XG4gICAgY29uc3QgaWR5ID0gTWF0aC5yb3VuZCgocG9pbnQueSAtIHBhZGRpbmcgKyBzcGFjZSAvIDIpIC8gc3BhY2UpICsgb2Zmc2V0WTtcbiAgICBjb25zdCB4eCA9IGlkeCAqIHNwYWNlO1xuICAgIGNvbnN0IHl5ID0gaWR5ICogc3BhY2U7XG4gICAgY29uc3QgcG9pbnRPbkNhbnZhcyA9IG5ldyBET01Qb2ludCh4eCwgeXkpO1xuICAgIGNvbnN0IHAgPSB0aGlzLnRyYW5zTWF0LnRyYW5zZm9ybVBvaW50KHBvaW50T25DYW52YXMpO1xuICAgIHRoaXMuYWN0dWFsQ3Vyc29yUG9pbnQgPSBwO1xuICAgIHRoaXMuYWN0dWFsQ3Vyc29yUG9zaXRpb24gPSBbaWR4IC0gMSwgaWR5IC0gMV07XG5cbiAgICBpZiAodGhpcy5wcmV2ZW50TW92ZU1hdD8uW2lkeCAtIDFdPy5baWR5IC0gMV0gPT09IDEpIHtcbiAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBbLTEsIC0xXTtcbiAgICAgIHRoaXMuY3Vyc29yUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgICAgIHRoaXMuZHJhd0N1cnNvcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY3Vyc29yUG9pbnQgPSBwO1xuICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBbaWR4IC0gMSwgaWR5IC0gMV07XG4gICAgdGhpcy5kcmF3Q3Vyc29yKCk7XG5cbiAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgfTtcblxuICBwcml2YXRlIG9uTW91c2VNb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHBvaW50ID0gbmV3IERPTVBvaW50KGUub2Zmc2V0WCAqIGRwciwgZS5vZmZzZXRZICogZHByKTtcbiAgICB0aGlzLnNldEN1cnNvcldpdGhSZW5kZXIocG9pbnQpO1xuICB9O1xuXG4gIHByaXZhdGUgY2FsY1RvdWNoUG9pbnQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgIGxldCBwb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm4gcG9pbnQ7XG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0b3VjaGVzID0gZS5jaGFuZ2VkVG91Y2hlcztcbiAgICBwb2ludCA9IG5ldyBET01Qb2ludChcbiAgICAgICh0b3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQpICogZHByLFxuICAgICAgKHRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wKSAqIGRwclxuICAgICk7XG4gICAgcmV0dXJuIHBvaW50O1xuICB9O1xuXG4gIHByaXZhdGUgb25Ub3VjaFN0YXJ0ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudG91Y2hNb3ZpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHBvaW50ID0gdGhpcy5jYWxjVG91Y2hQb2ludChlKTtcbiAgICB0aGlzLnRvdWNoU3RhcnRQb2ludCA9IHBvaW50O1xuICAgIHRoaXMuc2V0Q3Vyc29yV2l0aFJlbmRlcihwb2ludCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBvblRvdWNoTW92ZSA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnRvdWNoTW92aW5nID0gdHJ1ZTtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMuY2FsY1RvdWNoUG9pbnQoZSk7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgbGV0IGRpc3RhbmNlID0gMTA7XG4gICAgaWYgKFxuICAgICAgTWF0aC5hYnMocG9pbnQueCAtIHRoaXMudG91Y2hTdGFydFBvaW50LngpID4gZGlzdGFuY2UgfHxcbiAgICAgIE1hdGguYWJzKHBvaW50LnkgLSB0aGlzLnRvdWNoU3RhcnRQb2ludC55KSA+IGRpc3RhbmNlXG4gICAgKSB7XG4gICAgICBvZmZzZXQgPSB0aGlzLm9wdGlvbnMubW9iaWxlSW5kaWNhdG9yT2Zmc2V0O1xuICAgIH1cbiAgICB0aGlzLnNldEN1cnNvcldpdGhSZW5kZXIocG9pbnQsIG9mZnNldCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBvblRvdWNoRW5kID0gKCkgPT4ge1xuICAgIHRoaXMudG91Y2hNb3ZpbmcgPSBmYWxzZTtcbiAgfTtcblxuICByZW5kZXJJbnRlcmFjdGl2ZSgpIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCk7XG4gICAgfVxuICB9XG5cbiAgc2V0QW5hbHlzaXMoYW5hbHlzaXM6IEFuYWx5c2lzIHwgbnVsbCkge1xuICAgIHRoaXMuYW5hbHlzaXMgPSBhbmFseXNpcztcbiAgICBpZiAoIWFuYWx5c2lzKSB7XG4gICAgICB0aGlzLmNsZWFyQW5hbHlzaXNDYW52YXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93QW5hbHlzaXMpIHRoaXMuZHJhd0FuYWx5c2lzKGFuYWx5c2lzKTtcbiAgfVxuXG4gIHNldFRoZW1lKHRoZW1lOiBUaGVtZSwgb3B0aW9uczogUGFydGlhbDxHaG9zdEJhbk9wdGlvbnNQYXJhbXM+ID0ge30pIHtcbiAgICBjb25zdCB7dGhlbWVSZXNvdXJjZXN9ID0gdGhpcy5vcHRpb25zO1xuICAgIGlmICghdGhlbWVSZXNvdXJjZXNbdGhlbWVdKSByZXR1cm47XG4gICAgY29uc3QgcmVzb3VyY2VzID0gZ2V0VGhlbWVSZXNvdXJjZXModGhlbWUsIHRoZW1lUmVzb3VyY2VzKTtcbiAgICBpZiAoIXJlc291cmNlcykgcmV0dXJuO1xuICAgIGNvbnN0IHtib2FyZCwgYmxhY2tzLCB3aGl0ZXN9ID0gcmVzb3VyY2VzO1xuICAgIHRoaXMub3B0aW9ucy50aGVtZSA9IHRoZW1lO1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgIHRoZW1lLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHRoZW1lT3B0aW9uczoge1xuICAgICAgICAuLi50aGlzLm9wdGlvbnMudGhlbWVPcHRpb25zLFxuICAgICAgICAuLi4ob3B0aW9ucy50aGVtZU9wdGlvbnMgfHwge30pLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlTm9kZU1hcmt1cFN0eWxlcygpO1xuXG4gICAgLy8gUmVkcmF3IGNhbGxiYWNrIGFmdGVyIGltYWdlIGxvYWRpbmcgY29tcGxldGVzXG4gICAgY29uc3Qgb25JbWFnZUxvYWRlZCA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy5kcmF3QmFuKCk7XG4gICAgICB0aGlzLmRyYXdTdG9uZXMoKTtcbiAgICB9O1xuXG4gICAgcHJlbG9hZChcbiAgICAgIGNvbXBhY3QoW2JvYXJkLCAuLi5ibGFja3MsIC4uLndoaXRlc10pLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9uSW1hZ2VMb2FkZWRcbiAgICApO1xuXG4gICAgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgY2FsY0NlbnRlciA9ICgpOiBDZW50ZXIgPT4ge1xuICAgIGNvbnN0IHt2aXNpYmxlQXJlYX0gPSB0aGlzO1xuICAgIGNvbnN0IHtib2FyZFNpemV9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKFxuICAgICAgKHZpc2libGVBcmVhWzBdWzBdID09PSAwICYmIHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgKHZpc2libGVBcmVhWzFdWzBdID09PSAwICYmIHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKVxuICAgICkge1xuICAgICAgcmV0dXJuIENlbnRlci5DZW50ZXI7XG4gICAgfVxuXG4gICAgaWYgKHZpc2libGVBcmVhWzBdWzBdID09PSAwKSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wTGVmdDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbUxlZnQ7XG4gICAgICBlbHNlIHJldHVybiBDZW50ZXIuTGVmdDtcbiAgICB9IGVsc2UgaWYgKHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxKSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wUmlnaHQ7XG4gICAgICBlbHNlIGlmICh2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSkgcmV0dXJuIENlbnRlci5Cb3R0b21SaWdodDtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5SaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZpc2libGVBcmVhWzFdWzBdID09PSAwKSByZXR1cm4gQ2VudGVyLlRvcDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbTtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5DZW50ZXI7XG4gICAgfVxuICB9O1xuXG4gIGNhbGNEeW5hbWljUGFkZGluZyh2aXNpYmxlQXJlYVNpemU6IG51bWJlcikge1xuICAgIGNvbnN0IHtjb29yZGluYXRlfSA9IHRoaXMub3B0aW9ucztcblxuICAgIGNvbnN0IHtjYW52YXN9ID0gdGhpcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IHBhZGRpbmcgPSBjYW52YXMud2lkdGggLyAodmlzaWJsZUFyZWFTaXplICsgMikgLyAyO1xuICAgIGNvbnN0IHBhZGRpbmdXaXRob3V0Q29vcmRpbmF0ZSA9IGNhbnZhcy53aWR0aCAvICh2aXNpYmxlQXJlYVNpemUgKyAyKSAvIDQ7XG5cbiAgICB0aGlzLm9wdGlvbnMucGFkZGluZyA9IGNvb3JkaW5hdGUgPyBwYWRkaW5nIDogcGFkZGluZ1dpdGhvdXRDb29yZGluYXRlO1xuICB9XG5cbiAgem9vbUJvYXJkKHpvb20gPSBmYWxzZSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNhbnZhcyxcbiAgICAgIGFuYWx5c2lzQ2FudmFzLFxuICAgICAgYm9hcmQsXG4gICAgICBjdXJzb3JDYW52YXMsXG4gICAgICBtYXJrdXBDYW52YXMsXG4gICAgICBlZmZlY3RDYW52YXMsXG4gICAgfSA9IHRoaXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcbiAgICBjb25zdCB7Ym9hcmRTaXplLCBleHRlbnQsIHBhZGRpbmcsIGR5bmFtaWNQYWRkaW5nfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCBib2FyZExpbmVFeHRlbnQgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICBUaGVtZVByb3BlcnR5S2V5LkJvYXJkTGluZUV4dGVudFxuICAgICk7XG4gICAgY29uc3Qgem9vbWVkVmlzaWJsZUFyZWEgPSBjYWxjVmlzaWJsZUFyZWEoXG4gICAgICB0aGlzLnZpc2libGVBcmVhTWF0LFxuICAgICAgZXh0ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBib2FyZEN0eCA9IGJvYXJkPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGN1cnNvckN0eCA9IGN1cnNvckNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBtYXJrdXBDdHggPSBtYXJrdXBDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgYW5hbHlzaXNDdHggPSBhbmFseXNpc0NhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBlZmZlY3RDdHggPSBlZmZlY3RDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgdmlzaWJsZUFyZWEgPSB6b29tXG4gICAgICA/IHpvb21lZFZpc2libGVBcmVhXG4gICAgICA6IFtcbiAgICAgICAgICBbMCwgYm9hcmRTaXplIC0gMV0sXG4gICAgICAgICAgWzAsIGJvYXJkU2l6ZSAtIDFdLFxuICAgICAgICBdO1xuXG4gICAgdGhpcy52aXNpYmxlQXJlYSA9IHZpc2libGVBcmVhO1xuICAgIGNvbnN0IHZpc2libGVBcmVhU2l6ZSA9IE1hdGgubWF4KFxuICAgICAgdmlzaWJsZUFyZWFbMF1bMV0gLSB2aXNpYmxlQXJlYVswXVswXSxcbiAgICAgIHZpc2libGVBcmVhWzFdWzFdIC0gdmlzaWJsZUFyZWFbMV1bMF1cbiAgICApO1xuXG4gICAgaWYgKGR5bmFtaWNQYWRkaW5nKSB7XG4gICAgICB0aGlzLmNhbGNEeW5hbWljUGFkZGluZyh2aXNpYmxlQXJlYVNpemUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMucGFkZGluZyA9IERFRkFVTFRfT1BUSU9OUy5wYWRkaW5nO1xuICAgIH1cblxuICAgIGlmICh6b29tKSB7XG4gICAgICBjb25zdCB7c3BhY2V9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmNhbGNDZW50ZXIoKTtcblxuICAgICAgaWYgKGR5bmFtaWNQYWRkaW5nKSB7XG4gICAgICAgIHRoaXMuY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnMucGFkZGluZyA9IERFRkFVTFRfT1BUSU9OUy5wYWRkaW5nO1xuICAgICAgfVxuXG4gICAgICBsZXQgZXh0cmFWaXNpYmxlU2l6ZSA9IGJvYXJkTGluZUV4dGVudCAqIDIgKyAxO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdFxuICAgICAgKSB7XG4gICAgICAgIGV4dHJhVmlzaWJsZVNpemUgPSBib2FyZExpbmVFeHRlbnQgKyAwLjU7XG4gICAgICB9XG4gICAgICBsZXQgem9vbWVkQm9hcmRTaXplID0gdmlzaWJsZUFyZWFTaXplICsgZXh0cmFWaXNpYmxlU2l6ZTtcblxuICAgICAgaWYgKHpvb21lZEJvYXJkU2l6ZSA8IGJvYXJkU2l6ZSkge1xuICAgICAgICBsZXQgc2NhbGUgPSAoY2FudmFzLndpZHRoIC0gcGFkZGluZyAqIDIpIC8gKHpvb21lZEJvYXJkU2l6ZSAqIHNwYWNlKTtcblxuICAgICAgICBsZXQgb2Zmc2V0WCA9XG4gICAgICAgICAgdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZSAqIHNjYWxlICtcbiAgICAgICAgICBwYWRkaW5nICogc2NhbGUgLVxuICAgICAgICAgIHBhZGRpbmcgLVxuICAgICAgICAgIChzcGFjZSAqIGV4dHJhVmlzaWJsZVNpemUgKiBzY2FsZSkgLyAyICtcbiAgICAgICAgICAoc3BhY2UgKiBzY2FsZSkgLyAyO1xuXG4gICAgICAgIGxldCBvZmZzZXRZID1cbiAgICAgICAgICB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlICogc2NhbGUgK1xuICAgICAgICAgIHBhZGRpbmcgKiBzY2FsZSAtXG4gICAgICAgICAgcGFkZGluZyAtXG4gICAgICAgICAgKHNwYWNlICogZXh0cmFWaXNpYmxlU2l6ZSAqIHNjYWxlKSAvIDIgK1xuICAgICAgICAgIChzcGFjZSAqIHNjYWxlKSAvIDI7XG5cbiAgICAgICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICAgICAgdGhpcy50cmFuc01hdC50cmFuc2xhdGVTZWxmKC1vZmZzZXRYLCAtb2Zmc2V0WSk7XG4gICAgICAgIHRoaXMudHJhbnNNYXQuc2NhbGVTZWxmKHNjYWxlLCBzY2FsZSk7XG4gICAgICAgIGN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBib2FyZEN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBhbmFseXNpc0N0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBjdXJzb3JDdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgICAgbWFya3VwQ3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIGVmZmVjdEN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXNldFRyYW5zZm9ybSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgfVxuICB9XG5cbiAgY2FsY0JvYXJkVmlzaWJsZUFyZWEoem9vbSA9IGZhbHNlKSB7XG4gICAgdGhpcy56b29tQm9hcmQodGhpcy5vcHRpb25zLnpvb20pO1xuICB9XG5cbiAgcmVzZXRUcmFuc2Zvcm0oKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2FudmFzLFxuICAgICAgYW5hbHlzaXNDYW52YXMsXG4gICAgICBib2FyZCxcbiAgICAgIGN1cnNvckNhbnZhcyxcbiAgICAgIG1hcmt1cENhbnZhcyxcbiAgICAgIGVmZmVjdENhbnZhcyxcbiAgICB9ID0gdGhpcztcbiAgICBjb25zdCBjdHggPSBjYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgYm9hcmRDdHggPSBib2FyZD8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBjdXJzb3JDdHggPSBjdXJzb3JDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgbWFya3VwQ3R4ID0gbWFya3VwQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGFuYWx5c2lzQ3R4ID0gYW5hbHlzaXNDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgZWZmZWN0Q3R4ID0gZWZmZWN0Q2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMudHJhbnNNYXQgPSBuZXcgRE9NTWF0cml4KCk7XG4gICAgY3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGJvYXJkQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGFuYWx5c2lzQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGN1cnNvckN0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICBtYXJrdXBDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgZWZmZWN0Q3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXR9ID0gdGhpcztcbiAgICBpZiAodGhpcy5tYXQgJiYgbWF0WzBdKSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplID0gbWF0WzBdLmxlbmd0aDtcblxuICAgIHRoaXMuem9vbUJvYXJkKHRoaXMub3B0aW9ucy56b29tKTtcbiAgICB0aGlzLnpvb21Cb2FyZCh0aGlzLm9wdGlvbnMuem9vbSk7XG4gICAgdGhpcy5jbGVhckFsbENhbnZhcygpO1xuICAgIHRoaXMuZHJhd0JvYXJkKCk7XG4gICAgdGhpcy5kcmF3U3RvbmVzKCk7XG4gICAgdGhpcy5kcmF3TWFya3VwKCk7XG4gICAgdGhpcy5kcmF3Q3Vyc29yKCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93QW5hbHlzaXMpIHRoaXMuZHJhd0FuYWx5c2lzKCk7XG4gIH1cblxuICByZW5kZXJJbk9uZUNhbnZhcyhjYW52YXMgPSB0aGlzLmNhbnZhcykge1xuICAgIHRoaXMuY2xlYXJBbGxDYW52YXMoKTtcbiAgICB0aGlzLmRyYXdCb2FyZChjYW52YXMsIGZhbHNlKTtcbiAgICB0aGlzLmRyYXdTdG9uZXModGhpcy5tYXQsIGNhbnZhcywgZmFsc2UpO1xuICAgIHRoaXMuZHJhd01hcmt1cCh0aGlzLm1hdCwgdGhpcy5tYXJrdXAsIGNhbnZhcywgZmFsc2UpO1xuICB9XG5cbiAgY2xlYXJBbGxDYW52YXMgPSAoKSA9PiB7XG4gICAgdGhpcy5jbGVhckNhbnZhcyh0aGlzLmJvYXJkKTtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XG4gICAgdGhpcy5jbGVhckNhbnZhcyh0aGlzLm1hcmt1cENhbnZhcyk7XG4gICAgdGhpcy5jbGVhckNhbnZhcyh0aGlzLmVmZmVjdENhbnZhcyk7XG4gICAgdGhpcy5jbGVhckN1cnNvckNhbnZhcygpO1xuICAgIHRoaXMuY2xlYXJBbmFseXNpc0NhbnZhcygpO1xuICB9O1xuXG4gIGNsZWFyQm9hcmQgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmJvYXJkKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gdGhpcy5ib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhckNhbnZhcyA9IChjYW52YXMgPSB0aGlzLmNhbnZhcykgPT4ge1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhck1hcmt1cENhbnZhcyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMubWFya3VwQ2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gdGhpcy5tYXJrdXBDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5tYXJrdXBDYW52YXMud2lkdGgsIHRoaXMubWFya3VwQ2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhckN1cnNvckNhbnZhcyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuY3Vyc29yQ2FudmFzKSByZXR1cm47XG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMub3B0aW9ucy5ib2FyZFNpemU7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdXJzb3JDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jdXJzb3JDYW52YXMud2lkdGgsIHRoaXMuY3Vyc29yQ2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhckFuYWx5c2lzQ2FudmFzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5hbmFseXNpc0NhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuYW5hbHlzaXNDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRoaXMuYW5hbHlzaXNDYW52YXMud2lkdGgsXG4gICAgICAgIHRoaXMuYW5hbHlzaXNDYW52YXMuaGVpZ2h0XG4gICAgICApO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH07XG5cbiAgZHJhd0FuYWx5c2lzID0gKGFuYWx5c2lzID0gdGhpcy5hbmFseXNpcykgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuYW5hbHlzaXNDYW52YXM7XG4gICAgY29uc3Qge1xuICAgICAgdGhlbWUgPSBUaGVtZS5CbGFja0FuZFdoaXRlLFxuICAgICAgYW5hbHlzaXNQb2ludFRoZW1lLFxuICAgICAgYm9hcmRTaXplLFxuICAgICAgZm9yY2VBbmFseXNpc0JvYXJkU2l6ZSxcbiAgICB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHttYXQsIG1hcmt1cH0gPSB0aGlzO1xuICAgIGlmICghY2FudmFzIHx8ICFhbmFseXNpcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmICghY3R4KSByZXR1cm47XG4gICAgdGhpcy5jbGVhckFuYWx5c2lzQ2FudmFzKCk7XG4gICAgY29uc3Qge3Jvb3RJbmZvfSA9IGFuYWx5c2lzO1xuXG4gICAgYW5hbHlzaXMubW92ZUluZm9zLmZvckVhY2gobSA9PiB7XG4gICAgICBpZiAobS5tb3ZlID09PSAncGFzcycpIHJldHVybjtcbiAgICAgIGNvbnN0IGlkT2JqID0gSlNPTi5wYXJzZShhbmFseXNpcy5pZCk7XG4gICAgICBsZXQgYW5hbHlzaXNCb2FyZFNpemUgPSBib2FyZFNpemU7XG4gICAgICBjb25zdCBvZmZzZXRlZE1vdmUgPSBvZmZzZXRBMU1vdmUoXG4gICAgICAgIG0ubW92ZSxcbiAgICAgICAgMCxcbiAgICAgICAgYW5hbHlzaXNCb2FyZFNpemUgLSBpZE9iai5ieVxuICAgICAgKTtcbiAgICAgIGxldCB7eDogaSwgeTogan0gPSBhMVRvUG9zKG9mZnNldGVkTW92ZSk7XG4gICAgICBpZiAobWF0W2ldW2pdICE9PSAwKSByZXR1cm47XG4gICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgY29uc3QgcmF0aW8gPSAwLjQ2O1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGlmIChcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLlN1YmR1ZWQgJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLkZsYXQgJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLldhcm0gJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLkRhcmtcbiAgICAgICkge1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDM7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMztcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuU2hhZG93Q29sb3IpO1xuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDA7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gJyNmZmYnO1xuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDA7XG4gICAgICB9XG5cbiAgICAgIGxldCBvdXRsaW5lQ29sb3I7XG4gICAgICBpZiAobWFya3VwW2ldW2pdLmluY2x1ZGVzKE1hcmt1cC5Qb3NpdGl2ZU5vZGUpKSB7XG4gICAgICAgIG91dGxpbmVDb2xvciA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShcbiAgICAgICAgICBUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXJrdXBbaV1bal0uaW5jbHVkZXMoTWFya3VwLk5lZ2F0aXZlTm9kZSkpIHtcbiAgICAgICAgb3V0bGluZUNvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFxuICAgICAgICAgIFRoZW1lUHJvcGVydHlLZXkuTmVnYXRpdmVOb2RlQ29sb3JcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1hcmt1cFtpXVtqXS5pbmNsdWRlcyhNYXJrdXAuTmV1dHJhbE5vZGUpKSB7XG4gICAgICAgIG91dGxpbmVDb2xvciA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwb2ludCA9IG5ldyBBbmFseXNpc1BvaW50KFxuICAgICAgICBjdHgsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHNwYWNlICogcmF0aW8sXG4gICAgICAgIHJvb3RJbmZvLFxuICAgICAgICBtLFxuICAgICAgICBhbmFseXNpc1BvaW50VGhlbWUsXG4gICAgICAgIG91dGxpbmVDb2xvclxuICAgICAgKTtcbiAgICAgIHBvaW50LmRyYXcoKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZHJhd01hcmt1cCA9IChcbiAgICBtYXQgPSB0aGlzLm1hdCxcbiAgICBtYXJrdXAgPSB0aGlzLm1hcmt1cCxcbiAgICBtYXJrdXBDYW52YXMgPSB0aGlzLm1hcmt1cENhbnZhcyxcbiAgICBjbGVhciA9IHRydWVcbiAgKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gbWFya3VwQ2FudmFzO1xuICAgIGNvbnN0IHt0aGVtZX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgaWYgKGNsZWFyKSB0aGlzLmNsZWFyQ2FudmFzKGNhbnZhcyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcmt1cC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hcmt1cFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IG1hcmt1cFtpXVtqXTtcbiAgICAgICAgICB2YWx1ZXM/LnNwbGl0KCd8JykuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgICAgICAgICAgY29uc3QgeCA9IHNjYWxlZFBhZGRpbmcgKyBpICogc3BhY2U7XG4gICAgICAgICAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgICAgICAgICBjb25zdCBraSA9IG1hdFtpXVtqXTtcbiAgICAgICAgICAgICAgbGV0IG1hcmt1cDtcbiAgICAgICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkNpcmNsZToge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgQ2lyY2xlTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkN1cnJlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IENpcmNsZVNvbGlkTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlRG90dGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlRG90dGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbERhc2hlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsRG90dGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0Rhc2hlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nRG90dGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdERhc2hlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0RG90dGVkQWN0aXZlTm9kZToge1xuICAgICAgICAgICAgICAgICAgICBsZXQge2NvbG9yLCBsaW5lRGFzaH0gPSB0aGlzLm5vZGVNYXJrdXBTdHlsZXNbdmFsdWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBBY3RpdmVOb2RlTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgICBNYXJrdXAuQ2lyY2xlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRMaW5lRGFzaChsaW5lRGFzaCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsRGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxEb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ05vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nRGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdEb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0RGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHREb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTm9kZToge1xuICAgICAgICAgICAgICAgICAgICBsZXQge2NvbG9yLCBsaW5lRGFzaH0gPSB0aGlzLm5vZGVNYXJrdXBTdHlsZXNbdmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgTm9kZU1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCksXG4gICAgICAgICAgICAgICAgICAgICAgTWFya3VwLkNpcmNsZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAuc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAuc2V0TGluZURhc2gobGluZURhc2gpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlNxdWFyZToge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgU3F1YXJlTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlRyaWFuZ2xlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBUcmlhbmdsZU1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Dcm9zczoge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgQ3Jvc3NNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuSGlnaGxpZ2h0OiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBIaWdobGlnaHRNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IFRleHRNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXJrdXA/LmRyYXcoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRyYXdCb2FyZCA9IChib2FyZCA9IHRoaXMuYm9hcmQsIGNsZWFyID0gdHJ1ZSkgPT4ge1xuICAgIGlmIChjbGVhcikgdGhpcy5jbGVhckNhbnZhcyhib2FyZCk7XG4gICAgdGhpcy5kcmF3QmFuKGJvYXJkKTtcbiAgICB0aGlzLmRyYXdCb2FyZExpbmUoYm9hcmQpO1xuICAgIHRoaXMuZHJhd1N0YXJzKGJvYXJkKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNvb3JkaW5hdGUpIHtcbiAgICAgIHRoaXMuZHJhd0Nvb3JkaW5hdGUoKTtcbiAgICB9XG4gIH07XG5cbiAgZHJhd0JhbiA9IChib2FyZCA9IHRoaXMuYm9hcmQpID0+IHtcbiAgICBjb25zdCB7dGhlbWUsIHRoZW1lUmVzb3VyY2VzLCBwYWRkaW5nfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAoYm9hcmQpIHtcbiAgICAgIGJvYXJkLnN0eWxlLmJvcmRlclJhZGl1cyA9ICcycHgnO1xuICAgICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5CbGFja0FuZFdoaXRlIHx8XG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkZsYXQgfHxcbiAgICAgICAgICB0aGVtZSA9PT0gVGhlbWUuV2FybSB8fFxuICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5EYXJrIHx8XG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkhpZ2hDb250cmFzdFxuICAgICAgICApIHtcbiAgICAgICAgICBib2FyZC5zdHlsZS5ib3hTaGFkb3cgPVxuICAgICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgPyAnMHB4IDBweCAwcHggIzAwMDAwMCcgOiAnJztcblxuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICAgICAgICBUaGVtZVByb3BlcnR5S2V5LkJvYXJkQmFja2dyb3VuZENvbG9yXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBjdHguZmlsbFJlY3QoXG4gICAgICAgICAgLy8gICAtcGFkZGluZyxcbiAgICAgICAgICAvLyAgIC1wYWRkaW5nLFxuICAgICAgICAgIC8vICAgYm9hcmQud2lkdGggKyBwYWRkaW5nLFxuICAgICAgICAgIC8vICAgYm9hcmQuaGVpZ2h0ICsgcGFkZGluZ1xuICAgICAgICAgIC8vICk7XG4gICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIGJvYXJkLndpZHRoLCBib2FyZC5oZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHJlc291cmNlcyA9IGdldFRoZW1lUmVzb3VyY2VzKHRoZW1lLCB0aGVtZVJlc291cmNlcyk7XG4gICAgICAgICAgaWYgKHJlc291cmNlcyAmJiByZXNvdXJjZXMuYm9hcmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvYXJkVXJsID0gcmVzb3VyY2VzLmJvYXJkO1xuICAgICAgICAgICAgY29uc3QgYm9hcmRSZXMgPSBpbWFnZXNbYm9hcmRVcmxdO1xuICAgICAgICAgICAgaWYgKGJvYXJkUmVzKSB7XG4gICAgICAgICAgICAgIGlmICh0aGVtZSA9PT0gVGhlbWUuV2FsbnV0IHx8IHRoZW1lID09PSBUaGVtZS5ZdW56aU1vbmtleURhcmspIHtcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgICAgICAgYm9hcmRSZXMsXG4gICAgICAgICAgICAgICAgICAtcGFkZGluZyxcbiAgICAgICAgICAgICAgICAgIC1wYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgYm9hcmQud2lkdGggKyBwYWRkaW5nLFxuICAgICAgICAgICAgICAgICAgYm9hcmQuaGVpZ2h0ICsgcGFkZGluZ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0dGVybiA9IGN0eC5jcmVhdGVQYXR0ZXJuKGJvYXJkUmVzLCAncmVwZWF0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBwYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIGJvYXJkLndpZHRoLCBib2FyZC5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3Qm9hcmRMaW5lID0gKGJvYXJkID0gdGhpcy5ib2FyZCkgPT4ge1xuICAgIGlmICghYm9hcmQpIHJldHVybjtcbiAgICBjb25zdCB7dmlzaWJsZUFyZWEsIG9wdGlvbnMsIG1hdCwgcHJldmVudE1vdmVNYXQsIGN1cnNvclBvc2l0aW9ufSA9IHRoaXM7XG4gICAgY29uc3Qge3pvb20sIGJvYXJkU2l6ZSwgYWRhcHRpdmVCb2FyZExpbmUsIHRoZW1lfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgYm9hcmRMaW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICBUaGVtZVByb3BlcnR5S2V5LkJvYXJkTGluZVdpZHRoXG4gICAgKTtcbiAgICBjb25zdCBib2FyZEVkZ2VMaW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICBUaGVtZVByb3BlcnR5S2V5LkJvYXJkRWRnZUxpbmVXaWR0aFxuICAgICk7XG4gICAgY29uc3QgYm9hcmRMaW5lRXh0ZW50ID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFxuICAgICAgVGhlbWVQcm9wZXJ0eUtleS5Cb2FyZExpbmVFeHRlbnRcbiAgICApO1xuICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuXG4gICAgICBjb25zdCBleHRlbmRTcGFjZSA9IHpvb20gPyBib2FyZExpbmVFeHRlbnQgKiBzcGFjZSA6IDA7XG4gICAgICBsZXQgYWN0aXZlQ29sb3IgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5BY3RpdmVDb2xvcik7XG4gICAgICBsZXQgaW5hY3RpdmVDb2xvciA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkluYWN0aXZlQ29sb3IpO1xuXG4gICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuQm9hcmRMaW5lQ29sb3IpO1xuXG4gICAgICBjb25zdCBhZGFwdGl2ZUZhY3RvciA9IDAuMDAxO1xuICAgICAgY29uc3QgdG91Y2hpbmdGYWN0b3IgPSAyLjU7XG4gICAgICBsZXQgZWRnZUxpbmVXaWR0aCA9IGFkYXB0aXZlQm9hcmRMaW5lXG4gICAgICAgID8gYm9hcmQud2lkdGggKiBhZGFwdGl2ZUZhY3RvciAqIDJcbiAgICAgICAgOiBib2FyZEVkZ2VMaW5lV2lkdGg7XG5cbiAgICAgIGxldCBsaW5lV2lkdGggPSBhZGFwdGl2ZUJvYXJkTGluZVxuICAgICAgICA/IGJvYXJkLndpZHRoICogYWRhcHRpdmVGYWN0b3JcbiAgICAgICAgOiBib2FyZExpbmVXaWR0aDtcblxuICAgICAgY29uc3QgYWxsb3dNb3ZlID1cbiAgICAgICAgY2FuTW92ZShtYXQsIGN1cnNvclBvc2l0aW9uWzBdLCBjdXJzb3JQb3NpdGlvblsxXSwgdGhpcy50dXJuKSAmJlxuICAgICAgICBwcmV2ZW50TW92ZU1hdFtjdXJzb3JQb3NpdGlvblswXV1bY3Vyc29yUG9zaXRpb25bMV1dID09PSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gdmlzaWJsZUFyZWFbMF1bMF07IGkgPD0gdmlzaWJsZUFyZWFbMF1bMV07IGkrKykge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiYgaSA9PT0gMCkgfHxcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEgJiYgaSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGVkZ2VMaW5lV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNNb2JpbGVEZXZpY2UoKSAmJlxuICAgICAgICAgIGkgPT09IHRoaXMuY3Vyc29yUG9zaXRpb25bMF0gJiZcbiAgICAgICAgICB0aGlzLnRvdWNoTW92aW5nXG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBjdHgubGluZVdpZHRoICogdG91Y2hpbmdGYWN0b3I7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYWxsb3dNb3ZlID8gYWN0aXZlQ29sb3IgOiBpbmFjdGl2ZUNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGFjdGl2ZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdGFydFBvaW50WSA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNjYWxlZFBhZGRpbmcgKyB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlIC0gZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzFdWzBdICogc3BhY2U7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgc3RhcnRQb2ludFkgKz0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kUG9pbnRZID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc3BhY2UgKiB2aXNpYmxlQXJlYVsxXVsxXSArIHNjYWxlZFBhZGRpbmcgKyBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzcGFjZSAqIHZpc2libGVBcmVhWzFdWzFdICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICBlbmRQb2ludFkgLT0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPiAwKSBzdGFydFBvaW50WSAtPSBleHRlbmRTcGFjZTtcbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzFdWzFdIDwgYm9hcmRTaXplIC0gMSkgZW5kUG9pbnRZICs9IGV4dGVuZFNwYWNlO1xuICAgICAgICBjdHgubW92ZVRvKGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcsIHN0YXJ0UG9pbnRZKTtcbiAgICAgICAgY3R4LmxpbmVUbyhpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nLCBlbmRQb2ludFkpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSB2aXNpYmxlQXJlYVsxXVswXTsgaSA8PSB2aXNpYmxlQXJlYVsxXVsxXTsgaSsrKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCAmJiBpID09PSAwKSB8fFxuICAgICAgICAgICh2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSAmJiBpID09PSBib2FyZFNpemUgLSAxKVxuICAgICAgICApIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gZWRnZUxpbmVXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc01vYmlsZURldmljZSgpICYmXG4gICAgICAgICAgaSA9PT0gdGhpcy5jdXJzb3JQb3NpdGlvblsxXSAmJlxuICAgICAgICAgIHRoaXMudG91Y2hNb3ZpbmdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGN0eC5saW5lV2lkdGggKiB0b3VjaGluZ0ZhY3RvcjtcbiAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBhbGxvd01vdmUgPyBhY3RpdmVDb2xvciA6IGluYWN0aXZlQ29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYWN0aXZlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0YXJ0UG9pbnRYID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzBdWzBdICogc3BhY2UgLSBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzY2FsZWRQYWRkaW5nICsgdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZTtcbiAgICAgICAgbGV0IGVuZFBvaW50WCA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNwYWNlICogdmlzaWJsZUFyZWFbMF1bMV0gKyBzY2FsZWRQYWRkaW5nICsgZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc3BhY2UgKiB2aXNpYmxlQXJlYVswXVsxXSArIHNjYWxlZFBhZGRpbmc7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgc3RhcnRQb2ludFggKz0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgIGVuZFBvaW50WCAtPSBkcHIgLyAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzBdWzBdID4gMCkgc3RhcnRQb2ludFggLT0gZXh0ZW5kU3BhY2U7XG4gICAgICAgIGlmICh2aXNpYmxlQXJlYVswXVsxXSA8IGJvYXJkU2l6ZSAtIDEpIGVuZFBvaW50WCArPSBleHRlbmRTcGFjZTtcbiAgICAgICAgY3R4Lm1vdmVUbyhzdGFydFBvaW50WCwgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyk7XG4gICAgICAgIGN0eC5saW5lVG8oZW5kUG9pbnRYLCBpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3U3RhcnMgPSAoYm9hcmQgPSB0aGlzLmJvYXJkKSA9PiB7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYm9hcmRTaXplICE9PSAxOSkgcmV0dXJuO1xuXG4gICAgbGV0IHthZGFwdGl2ZVN0YXJTaXplfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCBzdGFyU2l6ZU9wdGlvbnMgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5TdGFyU2l6ZSk7XG5cbiAgICBjb25zdCB2aXNpYmxlQXJlYSA9IHRoaXMudmlzaWJsZUFyZWE7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBsZXQgc3RhclNpemUgPSBhZGFwdGl2ZVN0YXJTaXplID8gYm9hcmQud2lkdGggKiAwLjAwMzUgOiBzdGFyU2l6ZU9wdGlvbnM7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgWzMsIDksIDE1XS5mb3JFYWNoKGkgPT4ge1xuICAgICAgICBbMywgOSwgMTVdLmZvckVhY2goaiA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaSA+PSB2aXNpYmxlQXJlYVswXVswXSAmJlxuICAgICAgICAgICAgaSA8PSB2aXNpYmxlQXJlYVswXVsxXSAmJlxuICAgICAgICAgICAgaiA+PSB2aXNpYmxlQXJlYVsxXVswXSAmJlxuICAgICAgICAgICAgaiA8PSB2aXNpYmxlQXJlYVsxXVsxXVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmFyYyhcbiAgICAgICAgICAgICAgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyxcbiAgICAgICAgICAgICAgaiAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyxcbiAgICAgICAgICAgICAgc3RhclNpemUsXG4gICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgIDIgKiBNYXRoLlBJLFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBkcmF3Q29vcmRpbmF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7Ym9hcmQsIG9wdGlvbnMsIHZpc2libGVBcmVhfSA9IHRoaXM7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGNvbnN0IHtib2FyZFNpemUsIHpvb20sIHBhZGRpbmcsIHRoZW1lfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgYm9hcmRMaW5lRXh0ZW50ID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdib2FyZExpbmVFeHRlbnQnKTtcbiAgICBsZXQgem9vbWVkQm9hcmRTaXplID0gdmlzaWJsZUFyZWFbMF1bMV0gLSB2aXNpYmxlQXJlYVswXVswXSArIDE7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcblxuICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke3NwYWNlIC8gM31weCBIZWx2ZXRpY2FgO1xuXG4gICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmNhbGNDZW50ZXIoKTtcbiAgICAgIGxldCBvZmZzZXQgPSBzcGFjZSAvIDEuNTtcblxuICAgICAgaWYgKFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5DZW50ZXIgJiZcbiAgICAgICAgdmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiZcbiAgICAgICAgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICkge1xuICAgICAgICBvZmZzZXQgLT0gc2NhbGVkUGFkZGluZyAvIDI7XG4gICAgICB9XG5cbiAgICAgIEExX0xFVFRFUlMuZm9yRWFjaCgobCwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgeCA9IHNwYWNlICogaW5kZXggKyBzY2FsZWRQYWRkaW5nO1xuICAgICAgICBsZXQgb2Zmc2V0VG9wID0gb2Zmc2V0O1xuICAgICAgICBsZXQgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0O1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wXG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldFRvcCAtPSBzcGFjZSAqIGJvYXJkTGluZUV4dGVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tXG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldEJvdHRvbSAtPSAoc3BhY2UgKiBib2FyZExpbmVFeHRlbnQpIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeTEgPSB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlICsgcGFkZGluZyAtIG9mZnNldFRvcDtcbiAgICAgICAgbGV0IHkyID0geTEgKyB6b29tZWRCb2FyZFNpemUgKiBzcGFjZSArIG9mZnNldEJvdHRvbSAqIDI7XG4gICAgICAgIGlmIChpbmRleCA+PSB2aXNpYmxlQXJlYVswXVswXSAmJiBpbmRleCA8PSB2aXNpYmxlQXJlYVswXVsxXSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbVJpZ2h0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLCB4LCB5MSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wTGVmdCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGwsIHgsIHkyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBBMV9OVU1CRVJTLnNsaWNlKC10aGlzLm9wdGlvbnMuYm9hcmRTaXplKS5mb3JFYWNoKChsOiBudW1iZXIsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHkgPSBzcGFjZSAqIGluZGV4ICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgbGV0IG9mZnNldExlZnQgPSBvZmZzZXQ7XG4gICAgICAgIGxldCBvZmZzZXRSaWdodCA9IG9mZnNldDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICBvZmZzZXRMZWZ0IC09IHNwYWNlICogYm9hcmRMaW5lRXh0ZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuUmlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2Zmc2V0UmlnaHQgLT0gKHNwYWNlICogYm9hcmRMaW5lRXh0ZW50KSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHgxID0gdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZSArIHBhZGRpbmcgLSBvZmZzZXRMZWZ0O1xuICAgICAgICBsZXQgeDIgPSB4MSArIHpvb21lZEJvYXJkU2l6ZSAqIHNwYWNlICsgMiAqIG9mZnNldFJpZ2h0O1xuICAgICAgICBpZiAoaW5kZXggPj0gdmlzaWJsZUFyZWFbMV1bMF0gJiYgaW5kZXggPD0gdmlzaWJsZUFyZWFbMV1bMV0pIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BSaWdodCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuQm90dG9tUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlJpZ2h0XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobC50b1N0cmluZygpLCB4MSwgeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkxlZnRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLnRvU3RyaW5nKCksIHgyLCB5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBjYWxjU3BhY2VBbmRQYWRkaW5nID0gKGNhbnZhcyA9IHRoaXMuY2FudmFzKSA9PiB7XG4gICAgbGV0IHNwYWNlID0gMDtcbiAgICBsZXQgc2NhbGVkUGFkZGluZyA9IDA7XG4gICAgbGV0IHNjYWxlZEJvYXJkRXh0ZW50ID0gMDtcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBjb25zdCB7cGFkZGluZywgYm9hcmRTaXplLCB6b29tfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGJvYXJkTGluZUV4dGVudCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lRXh0ZW50Jyk7XG4gICAgICBjb25zdCB7dmlzaWJsZUFyZWF9ID0gdGhpcztcblxuICAgICAgaWYgKFxuICAgICAgICAodmlzaWJsZUFyZWFbMF1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICh2aXNpYmxlQXJlYVsxXVswXSAhPT0gMCAmJiB2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICkge1xuICAgICAgICBzY2FsZWRCb2FyZEV4dGVudCA9IGJvYXJkTGluZUV4dGVudDtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgKHZpc2libGVBcmVhWzBdWzBdICE9PSAwICYmIHZpc2libGVBcmVhWzBdWzFdICE9PSBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAodmlzaWJsZUFyZWFbMV1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gIT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgICApIHtcbiAgICAgICAgc2NhbGVkQm9hcmRFeHRlbnQgPSBib2FyZExpbmVFeHRlbnQgKiAyO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkaXZpc29yID0gem9vbSA/IGJvYXJkU2l6ZSArIHNjYWxlZEJvYXJkRXh0ZW50IDogYm9hcmRTaXplO1xuICAgICAgc3BhY2UgPSAoY2FudmFzLndpZHRoIC0gcGFkZGluZyAqIDIpIC8gTWF0aC5jZWlsKGRpdmlzb3IpO1xuICAgICAgc2NhbGVkUGFkZGluZyA9IHBhZGRpbmcgKyBzcGFjZSAvIDI7XG4gICAgfVxuICAgIHJldHVybiB7c3BhY2UsIHNjYWxlZFBhZGRpbmcsIHNjYWxlZEJvYXJkRXh0ZW50fTtcbiAgfTtcblxuICBwbGF5RWZmZWN0ID0gKG1hdCA9IHRoaXMubWF0LCBlZmZlY3RNYXQgPSB0aGlzLmVmZmVjdE1hdCwgY2xlYXIgPSB0cnVlKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5lZmZlY3RDYW52YXM7XG5cbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoY2FudmFzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWZmZWN0TWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZWZmZWN0TWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBlZmZlY3RNYXRbaV1bal07XG4gICAgICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgICAgIGNvbnN0IGtpID0gbWF0W2ldW2pdO1xuICAgICAgICAgIGxldCBlZmZlY3Q7XG4gICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGNhc2UgRWZmZWN0LkJhbjoge1xuICAgICAgICAgICAgICAgIGVmZmVjdCA9IG5ldyBCYW5FZmZlY3QoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgICAgICAgIGVmZmVjdC5wbGF5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVmZmVjdE1hdFtpXVtqXSA9IEVmZmVjdC5Ob25lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qge2JvYXJkU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLnNldEVmZmVjdE1hdChlbXB0eShbYm9hcmRTaXplLCBib2FyZFNpemVdKSk7XG4gICAgfVxuICB9O1xuXG4gIGRyYXdDdXJzb3IgPSAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgdGhpcy5jbGVhckN1cnNvckNhbnZhcygpO1xuICAgICAgaWYgKHRoaXMuY3Vyc29yID09PSBDdXJzb3IuTm9uZSkgcmV0dXJuO1xuICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkgJiYgIXRoaXMudG91Y2hNb3ZpbmcpIHJldHVybjtcblxuICAgICAgY29uc3Qge3BhZGRpbmcsIHRoZW1lfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY29uc3Qge3NwYWNlfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgY29uc3Qge3Zpc2libGVBcmVhLCBjdXJzb3IsIGN1cnNvclZhbHVlfSA9IHRoaXM7XG5cbiAgICAgIGNvbnN0IFtpZHgsIGlkeV0gPSB0aGlzLmN1cnNvclBvc2l0aW9uO1xuICAgICAgaWYgKGlkeCA8IHZpc2libGVBcmVhWzBdWzBdIHx8IGlkeCA+IHZpc2libGVBcmVhWzBdWzFdKSByZXR1cm47XG4gICAgICBpZiAoaWR5IDwgdmlzaWJsZUFyZWFbMV1bMF0gfHwgaWR5ID4gdmlzaWJsZUFyZWFbMV1bMV0pIHJldHVybjtcbiAgICAgIGNvbnN0IHggPSBpZHggKiBzcGFjZSArIHNwYWNlIC8gMiArIHBhZGRpbmc7XG4gICAgICBjb25zdCB5ID0gaWR5ICogc3BhY2UgKyBzcGFjZSAvIDIgKyBwYWRkaW5nO1xuICAgICAgY29uc3Qga2kgPSB0aGlzLm1hdD8uW2lkeF0/LltpZHldIHx8IEtpLkVtcHR5O1xuXG4gICAgICBpZiAoY3R4KSB7XG4gICAgICAgIGxldCBjdXI7XG4gICAgICAgIGNvbnN0IHNpemUgPSBzcGFjZSAqIDAuODtcbiAgICAgICAgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLkNpcmNsZSkge1xuICAgICAgICAgIGN1ciA9IG5ldyBDaXJjbGVNYXJrdXAoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAga2ksXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5TcXVhcmUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgU3F1YXJlTWFya3VwKFxuICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHksXG4gICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuVHJpYW5nbGUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgVHJpYW5nbGVNYXJrdXAoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAga2ksXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5Dcm9zcykge1xuICAgICAgICAgIGN1ciA9IG5ldyBDcm9zc01hcmt1cChcbiAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5LFxuICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICBraSxcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICApO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLlRleHQpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgVGV4dE1hcmt1cChcbiAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5LFxuICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICBraSxcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCksXG4gICAgICAgICAgICBjdXJzb3JWYWx1ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkVtcHR5ICYmIGN1cnNvciA9PT0gQ3Vyc29yLkJsYWNrU3RvbmUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgRmxhdFN0b25lKGN0eCwgeCwgeSwgS2kuQmxhY2ssIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCkpO1xuICAgICAgICAgIGN1ci5zZXRTaXplKHNpemUpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5FbXB0eSAmJiBjdXJzb3IgPT09IEN1cnNvci5XaGl0ZVN0b25lKSB7XG4gICAgICAgICAgY3VyID0gbmV3IEZsYXRTdG9uZShjdHgsIHgsIHksIEtpLldoaXRlLCB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpKTtcbiAgICAgICAgICBjdXIuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC41KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5DbGVhcikge1xuICAgICAgICAgIGN1ciA9IG5ldyBGbGF0U3RvbmUoY3R4LCB4LCB5LCBLaS5FbXB0eSwgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKSk7XG4gICAgICAgICAgY3VyLnNldFNpemUoc2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VyPy5kcmF3KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRyYXdTdG9uZXMgPSAoXG4gICAgbWF0OiBudW1iZXJbXVtdID0gdGhpcy5tYXQsXG4gICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgY2xlYXIgPSB0cnVlXG4gICkgPT4ge1xuICAgIGNvbnN0IHt0aGVtZSA9IFRoZW1lLkJsYWNrQW5kV2hpdGUsIHRoZW1lUmVzb3VyY2VzfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoKTtcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgICAgICAgICAgY29uc3QgeCA9IHNjYWxlZFBhZGRpbmcgKyBpICogc3BhY2U7XG4gICAgICAgICAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgICAgICAgICBjb25zdCByYXRpbyA9IDAuNDU7XG4gICAgICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuU3ViZHVlZCAmJlxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5CbGFja0FuZFdoaXRlICYmXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLkZsYXQgJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuV2FybSAmJlxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5EYXJrICYmXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLkhpZ2hDb250cmFzdFxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDM7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAzO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnc2hhZG93Q29sb3InKTtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDg7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IHN0b25lO1xuXG4gICAgICAgICAgICAgIHN3aXRjaCAodGhlbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFRoZW1lLkJsYWNrQW5kV2hpdGU6XG4gICAgICAgICAgICAgICAgY2FzZSBUaGVtZS5GbGF0OlxuICAgICAgICAgICAgICAgIGNhc2UgVGhlbWUuV2FybTpcbiAgICAgICAgICAgICAgICBjYXNlIFRoZW1lLkhpZ2hDb250cmFzdDoge1xuICAgICAgICAgICAgICAgICAgc3RvbmUgPSBuZXcgRmxhdFN0b25lKFxuICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgc3RvbmUuc2V0U2l6ZShzcGFjZSAqIHJhdGlvICogMik7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBUaGVtZS5EYXJrOiB7XG4gICAgICAgICAgICAgICAgICBzdG9uZSA9IG5ldyBGbGF0U3RvbmUoXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBzdG9uZS5zZXRTaXplKHNwYWNlICogcmF0aW8gKiAyKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZXMgPSBnZXRUaGVtZVJlc291cmNlcyh0aGVtZSwgdGhlbWVSZXNvdXJjZXMpO1xuICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBibGFja3MgPSByZXNvdXJjZXMuYmxhY2tzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAoaTogc3RyaW5nKSA9PiBpbWFnZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2hpdGVzID0gcmVzb3VyY2VzLndoaXRlcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgKGk6IHN0cmluZykgPT4gaW1hZ2VzW2ldXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZCA9IGkgKyAxMCArIGo7XG4gICAgICAgICAgICAgICAgICAgIHN0b25lID0gbmV3IEltYWdlU3RvbmUoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICBtb2QsXG4gICAgICAgICAgICAgICAgICAgICAgYmxhY2tzLFxuICAgICAgICAgICAgICAgICAgICAgIHdoaXRlcyxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHN0b25lLnNldFNpemUoc3BhY2UgKiByYXRpbyAqIDIpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzdG9uZT8uZHJhdygpO1xuICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJfX3NwcmVhZEFycmF5IiwiX19yZWFkIiwiX192YWx1ZXMiLCJmaWx0ZXIiLCJmaW5kTGFzdEluZGV4IiwiVGhlbWVQcm9wZXJ0eUtleSIsIktpIiwiVGhlbWUiLCJBbmFseXNpc1BvaW50VGhlbWUiLCJDZW50ZXIiLCJFZmZlY3QiLCJNYXJrdXAiLCJDdXJzb3IiLCJQcm9ibGVtQW5zd2VyVHlwZSIsIlBhdGhEZXRlY3Rpb25TdHJhdGVneSIsIl9hIiwiX19leHRlbmRzIiwiY2xvbmVEZWVwIiwicmVwbGFjZSIsImNvbXBhY3QiLCJmbGF0dGVuRGVwdGgiLCJzdW0iLCJjbG9uZSIs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QyxDQUFDLENBQUMsRUFBQztZQUN6RCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7QUFDMUQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN4RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBR0QsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3pELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMzRCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDM0QsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDcEMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUN6RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN2RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1FBQ25DLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDtJQUNELE9BQU87UUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1FBQ3pELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztRQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsUUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsUUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0tBQ3BELENBQUM7QUFDSixFQUFFO0lBRVcsTUFBTSxHQUFHLFVBQUMsQ0FBUyxFQUFFLEtBQVMsRUFBRSxLQUFTLEVBQUE7QUFBcEIsSUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVMsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUFFLElBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFTLEdBQUEsQ0FBQSxDQUFBLEVBQUE7SUFDcEQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUQsRUFBRTtJQUVXLE1BQU0sR0FBRyxVQUFDLENBQVMsRUFBRSxLQUFTLEVBQUUsS0FBUyxFQUFBO0FBQXBCLElBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFTLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFBRSxJQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBUyxHQUFBLENBQUEsQ0FBQSxFQUFBO0lBQ3BELE9BQU8sQ0FBQyxDQUFDLElBQUks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
