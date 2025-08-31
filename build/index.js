
  /**
   * @license
   * author: BAI TIANLIANG
   * ghostban.js v3.0.0-alpha.131
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
    // Markup colors for flat themes
    flatBlackColor: '#000000',
    flatBlackColorAlt: '#000000', // 备用，暂时与主要颜色相同
    flatWhiteColor: '#FFFFFF',
    flatWhiteColorAlt: '#FFFFFF', // 备用，暂时与主要颜色相同
    // Board display properties
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
            "".concat(settings.cdn, "/assets/theme/ymd/yunzi-monkey-dark/YMD-B-v14-1350px.png"),
        ],
        whites: [
            "".concat(settings.cdn, "/assets/theme/ymd/yunzi-monkey-dark/YMD-W-v5-1350px.png"),
        ],
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
    function ImageStone(ctx, x, y, ki, mod, blacks, whites) {
        var _this = _super.call(this, ctx, x, y, ki) || this;
        _this.mod = mod;
        _this.blacks = blacks;
        _this.whites = whites;
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
        if (img) {
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
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
var images = {};
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function preload(urls, done) {
    var loaded = 0;
    var imageLoaded = function () {
        loaded++;
        if (loaded === urls.length) {
            done();
        }
    };
    for (var i = 0; i < urls.length; i++) {
        if (!images[urls[i]]) {
            images[urls[i]] = new Image();
            images[urls[i]].src = urls[i];
            images[urls[i]].onload = function () {
                imageLoaded();
            };
            images[urls[i]].onerror = function () {
                imageLoaded();
            };
        }
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
                var _loop_1 = function (i) {
                    var _loop_2 = function (j) {
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
                        _loop_2(j);
                    }
                };
                for (var i = 0; i < markup.length; i++) {
                    _loop_1(i);
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
                        theme === exports.Theme.Dark) {
                        board.style.boxShadow =
                            theme === exports.Theme.BlackAndWhite ? '0px 0px 0px #000000' : '';
                        ctx.fillStyle = _this.getThemeProperty(exports.ThemePropertyKey.BoardBackgroundColor);
                        ctx.fillRect(-padding, -padding, board.width + padding, board.height + padding);
                    }
                    else if (theme === exports.Theme.Walnut &&
                        themeResources[theme].board !== undefined) {
                        var boardUrl = themeResources[theme].board || '';
                        var boardRes = images[boardUrl];
                        if (boardRes) {
                            ctx.drawImage(boardRes, -padding, -padding, board.width + padding, board.height + padding);
                        }
                    }
                    else if (theme === exports.Theme.YunziMonkeyDark &&
                        themeResources[theme].board !== undefined) {
                        var boardUrl = themeResources[theme].board || '';
                        var boardRes = images[boardUrl];
                        if (boardRes) {
                            ctx.drawImage(boardRes, -padding, -padding, board.width + padding, board.height + padding);
                        }
                    }
                    else {
                        var boardUrl = themeResources[theme].board || '';
                        var image = images[boardUrl];
                        if (image) {
                            var pattern = ctx.createPattern(image, 'repeat');
                            if (pattern) {
                                ctx.fillStyle = pattern;
                                ctx.fillRect(0, 0, board.width, board.height);
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
                                    theme !== exports.Theme.Dark) {
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
                                    case exports.Theme.Warm: {
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
                                        var blacks = themeResources[theme].blacks.map(function (i) { return images[i]; });
                                        var whites = themeResources[theme].whites.map(function (i) { return images[i]; });
                                        var mod = i + 10 + j;
                                        stone = new ImageStone(ctx, x, y, value, mod, blacks, whites);
                                        stone.setSize(space * ratio * 2);
                                    }
                                }
                                stone.draw();
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
        var _a = themeResources[theme], board = _a.board, blacks = _a.blacks, whites = _a.whites;
        this.options.theme = theme;
        this.options = tslib.__assign(tslib.__assign(tslib.__assign(tslib.__assign({}, this.options), { theme: theme }), options), { themeOptions: tslib.__assign(tslib.__assign({}, this.options.themeOptions), (options.themeOptions || {})) });
        this.updateNodeMarkupStyles();
        preload(lodash.compact(tslib.__spreadArray(tslib.__spreadArray([board], tslib.__read(blacks), false), tslib.__read(whites), false)), function () {
            _this.drawBoard();
            _this.render();
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL2NvcmUvbWVyZ2Vzb3J0LnRzIiwiLi4vLi4vY29yZS90cmVlLnRzIiwiLi4vLi4vY29yZS9oZWxwZXJzLnRzIiwiLi4vLi4vdHlwZXMudHMiLCIuLi8uLi9jb25zdC50cyIsIi4uLy4uL2NvcmUvcHJvcHMudHMiLCIuLi8uLi9ib2FyZGNvcmUudHMiLCIuLi8uLi9jb3JlL3NnZi50cyIsIi4uLy4uL2hlbHBlci50cyIsIi4uLy4uL3N0b25lcy9iYXNlLnRzIiwiLi4vLi4vc3RvbmVzL0ZsYXRTdG9uZS50cyIsIi4uLy4uL3N0b25lcy9JbWFnZVN0b25lLnRzIiwiLi4vLi4vc3RvbmVzL0FuYWx5c2lzUG9pbnQudHMiLCIuLi8uLi9tYXJrdXBzL01hcmt1cEJhc2UudHMiLCIuLi8uLi9tYXJrdXBzL0NpcmNsZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvQ3Jvc3NNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL1RleHRNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL1NxdWFyZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvVHJpYW5nbGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL05vZGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL0FjdGl2ZU5vZGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL0NpcmNsZVNvbGlkTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9IaWdobGlnaHRNYXJrdXAudHMiLCIuLi8uLi9lZmZlY3RzL0VmZmVjdEJhc2UudHMiLCIuLi8uLi9lZmZlY3RzL0JhbkVmZmVjdC50cyIsIi4uLy4uL2dob3N0YmFuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB0eXBlIENvbXBhcmF0b3I8VD4gPSAoYTogVCwgYjogVCkgPT4gbnVtYmVyO1xuXG4vKipcbiAqIFNvcnQgYW4gYXJyYXkgdXNpbmcgdGhlIG1lcmdlIHNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSBjb21wYXJhdG9yRm4gVGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYXJyIFRoZSBhcnJheSB0byBzb3J0LlxuICogQHJldHVybnMgVGhlIHNvcnRlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VTb3J0PFQ+KGNvbXBhcmF0b3JGbjogQ29tcGFyYXRvcjxUPiwgYXJyOiBUW10pOiBUW10ge1xuICBjb25zdCBsZW4gPSBhcnIubGVuZ3RoO1xuICBpZiAobGVuID49IDIpIHtcbiAgICBjb25zdCBmaXJzdEhhbGYgPSBhcnIuc2xpY2UoMCwgbGVuIC8gMik7XG4gICAgY29uc3Qgc2Vjb25kSGFsZiA9IGFyci5zbGljZShsZW4gLyAyLCBsZW4pO1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIGNvbXBhcmF0b3JGbixcbiAgICAgIG1lcmdlU29ydChjb21wYXJhdG9yRm4sIGZpcnN0SGFsZiksXG4gICAgICBtZXJnZVNvcnQoY29tcGFyYXRvckZuLCBzZWNvbmRIYWxmKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFyci5zbGljZSgpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIG1lcmdlIHBhcnQgb2YgdGhlIG1lcmdlIHNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSBjb21wYXJhdG9yRm4gVGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYXJyMSBUaGUgZmlyc3Qgc29ydGVkIGFycmF5LlxuICogQHBhcmFtIGFycjIgVGhlIHNlY29uZCBzb3J0ZWQgYXJyYXkuXG4gKiBAcmV0dXJucyBUaGUgbWVyZ2VkIGFuZCBzb3J0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlPFQ+KGNvbXBhcmF0b3JGbjogQ29tcGFyYXRvcjxUPiwgYXJyMTogVFtdLCBhcnIyOiBUW10pOiBUW10ge1xuICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xuICBsZXQgbGVmdDEgPSBhcnIxLmxlbmd0aDtcbiAgbGV0IGxlZnQyID0gYXJyMi5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlZnQxID4gMCAmJiBsZWZ0MiA+IDApIHtcbiAgICBpZiAoY29tcGFyYXRvckZuKGFycjFbMF0sIGFycjJbMF0pIDw9IDApIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFycjEuc2hpZnQoKSEpOyAvLyBub24tbnVsbCBhc3NlcnRpb246IHNhZmUgc2luY2Ugd2UganVzdCBjaGVja2VkIGxlbmd0aFxuICAgICAgbGVmdDEtLTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goYXJyMi5zaGlmdCgpISk7XG4gICAgICBsZWZ0Mi0tO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsZWZ0MSA+IDApIHtcbiAgICByZXN1bHQucHVzaCguLi5hcnIxKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucHVzaCguLi5hcnIyKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlU29ydDtcbiIsImltcG9ydCBtZXJnZVNvcnQgZnJvbSAnLi9tZXJnZXNvcnQnO1xuaW1wb3J0IHtTZ2ZOb2RlfSBmcm9tICcuL3R5cGVzJztcblxuZnVuY3Rpb24gZmluZEluc2VydEluZGV4PFQ+KFxuICBjb21wYXJhdG9yRm46IChhOiBULCBiOiBUKSA9PiBudW1iZXIsXG4gIGFycjogVFtdLFxuICBlbDogVFxuKTogbnVtYmVyIHtcbiAgbGV0IGk6IG51bWJlcjtcbiAgY29uc3QgbGVuID0gYXJyLmxlbmd0aDtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGNvbXBhcmF0b3JGbihhcnJbaV0sIGVsKSA+IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaTtcbn1cblxudHlwZSBDb21wYXJhdG9yPFQ+ID0gKGE6IFQsIGI6IFQpID0+IG51bWJlcjtcblxuaW50ZXJmYWNlIFRyZWVNb2RlbENvbmZpZzxUPiB7XG4gIGNoaWxkcmVuUHJvcGVydHlOYW1lPzogc3RyaW5nO1xuICBtb2RlbENvbXBhcmF0b3JGbj86IENvbXBhcmF0b3I8VD47XG59XG5cbmNsYXNzIFROb2RlIHtcbiAgY29uZmlnOiBUcmVlTW9kZWxDb25maWc8U2dmTm9kZT47XG4gIG1vZGVsOiBTZ2ZOb2RlO1xuICBjaGlsZHJlbjogVE5vZGVbXSA9IFtdO1xuICBwYXJlbnQ/OiBUTm9kZTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPiwgbW9kZWw6IFNnZk5vZGUpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICBpc1Jvb3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICB9XG5cbiAgYWRkQ2hpbGQoY2hpbGQ6IFROb2RlKTogVE5vZGUge1xuICAgIHJldHVybiBhZGRDaGlsZCh0aGlzLCBjaGlsZCk7XG4gIH1cblxuICBhZGRDaGlsZEF0SW5kZXgoY2hpbGQ6IFROb2RlLCBpbmRleDogbnVtYmVyKTogVE5vZGUge1xuICAgIGlmICh0aGlzLmNvbmZpZy5tb2RlbENvbXBhcmF0b3JGbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCBjaGlsZCBhdCBpbmRleCB3aGVuIHVzaW5nIGEgY29tcGFyYXRvciBmdW5jdGlvbi4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3AgPSB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nO1xuICAgIGlmICghKHRoaXMubW9kZWwgYXMgYW55KVtwcm9wXSkge1xuICAgICAgKHRoaXMubW9kZWwgYXMgYW55KVtwcm9wXSA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsQ2hpbGRyZW4gPSAodGhpcy5tb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICBtb2RlbENoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQubW9kZWwpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZCk7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH1cblxuICBnZXRQYXRoKCk6IFROb2RlW10ge1xuICAgIGNvbnN0IHBhdGg6IFROb2RlW10gPSBbXTtcbiAgICBsZXQgY3VycmVudDogVE5vZGUgfCB1bmRlZmluZWQgPSB0aGlzO1xuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBwYXRoLnVuc2hpZnQoY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgZ2V0SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pc1Jvb3QoKSA/IDAgOiB0aGlzLnBhcmVudCEuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgfVxuXG4gIHNldEluZGV4KGluZGV4OiBudW1iZXIpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBzZXQgbm9kZSBpbmRleCB3aGVuIHVzaW5nIGEgY29tcGFyYXRvciBmdW5jdGlvbi4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnBhcmVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIGhhcyBubyBwYXJlbnQuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLnBhcmVudC5jaGlsZHJlbjtcbiAgICBjb25zdCBtb2RlbFNpYmxpbmdzID0gKHRoaXMucGFyZW50Lm1vZGVsIGFzIGFueSlbXG4gICAgICB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nXG4gICAgXTtcblxuICAgIGNvbnN0IG9sZEluZGV4ID0gc2libGluZ3MuaW5kZXhPZih0aGlzKTtcblxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc2libGluZ3MubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgc2libGluZ3Muc3BsaWNlKGluZGV4LCAwLCBzaWJsaW5ncy5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcbiAgICBtb2RlbFNpYmxpbmdzLnNwbGljZShpbmRleCwgMCwgbW9kZWxTaWJsaW5ncy5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgd2FsayhmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuIHwgdm9pZCk6IHZvaWQge1xuICAgIGNvbnN0IHdhbGtSZWN1cnNpdmUgPSAobm9kZTogVE5vZGUpOiBib29sZWFuID0+IHtcbiAgICAgIGlmIChmbihub2RlKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAod2Fsa1JlY3Vyc2l2ZShjaGlsZCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIHdhbGtSZWN1cnNpdmUodGhpcyk7XG4gIH1cblxuICBmaXJzdChmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuKTogVE5vZGUgfCB1bmRlZmluZWQge1xuICAgIGxldCByZXN1bHQ6IFROb2RlIHwgdW5kZWZpbmVkO1xuICAgIHRoaXMud2Fsayhub2RlID0+IHtcbiAgICAgIGlmIChmbihub2RlKSkge1xuICAgICAgICByZXN1bHQgPSBub2RlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGFsbChmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuKTogVE5vZGVbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBUTm9kZVtdID0gW107XG4gICAgdGhpcy53YWxrKG5vZGUgPT4ge1xuICAgICAgaWYgKGZuKG5vZGUpKSByZXN1bHQucHVzaChub2RlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZHJvcCgpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIGNvbnN0IHByb3AgPSB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nO1xuICAgICAgICAodGhpcy5wYXJlbnQubW9kZWwgYXMgYW55KVtwcm9wXS5zcGxpY2UoaWR4LCAxKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDaGlsZChwYXJlbnQ6IFROb2RlLCBjaGlsZDogVE5vZGUpOiBUTm9kZSB7XG4gIGNvbnN0IHByb3AgPSBwYXJlbnQuY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lIHx8ICdjaGlsZHJlbic7XG4gIGlmICghKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdKSB7XG4gICAgKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdID0gW107XG4gIH1cblxuICBjb25zdCBtb2RlbENoaWxkcmVuID0gKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gIGNoaWxkLnBhcmVudCA9IHBhcmVudDtcbiAgaWYgKHBhcmVudC5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICBjb25zdCBpbmRleCA9IGZpbmRJbnNlcnRJbmRleChcbiAgICAgIHBhcmVudC5jb25maWcubW9kZWxDb21wYXJhdG9yRm4sXG4gICAgICBtb2RlbENoaWxkcmVuLFxuICAgICAgY2hpbGQubW9kZWxcbiAgICApO1xuICAgIG1vZGVsQ2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZC5tb2RlbCk7XG4gICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuICB9IGVsc2Uge1xuICAgIG1vZGVsQ2hpbGRyZW4ucHVzaChjaGlsZC5tb2RlbCk7XG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5jbGFzcyBUcmVlTW9kZWwge1xuICBjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPjtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPiA9IHt9KSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBjaGlsZHJlblByb3BlcnR5TmFtZTogY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lIHx8ICdjaGlsZHJlbicsXG4gICAgICBtb2RlbENvbXBhcmF0b3JGbjogY29uZmlnLm1vZGVsQ29tcGFyYXRvckZuLFxuICAgIH07XG4gIH1cblxuICBwYXJzZShtb2RlbDogU2dmTm9kZSk6IFROb2RlIHtcbiAgICBpZiAodHlwZW9mIG1vZGVsICE9PSAnb2JqZWN0JyB8fCBtb2RlbCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTW9kZWwgbXVzdCBiZSBvZiB0eXBlIG9iamVjdC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlID0gbmV3IFROb2RlKHRoaXMuY29uZmlnLCBtb2RlbCk7XG4gICAgY29uc3QgcHJvcCA9IHRoaXMuY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lITtcbiAgICBjb25zdCBjaGlsZHJlbiA9IChtb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgICBpZiAodGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICAgICAgKG1vZGVsIGFzIGFueSlbcHJvcF0gPSBtZXJnZVNvcnQoXG4gICAgICAgICAgdGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4sXG4gICAgICAgICAgY2hpbGRyZW5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgY2hpbGRNb2RlbCBvZiAobW9kZWwgYXMgYW55KVtwcm9wXSkge1xuICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSB0aGlzLnBhcnNlKGNoaWxkTW9kZWwpO1xuICAgICAgICBhZGRDaGlsZChub2RlLCBjaGlsZE5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG59XG5cbmV4cG9ydCB7VHJlZU1vZGVsLCBUTm9kZSwgVHJlZU1vZGVsQ29uZmlnfTtcbiIsImltcG9ydCB7ZmlsdGVyLCBmaW5kTGFzdEluZGV4fSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtUTm9kZX0gZnJvbSAnLi90cmVlJztcbmltcG9ydCB7TW92ZVByb3AsIFNnZlByb3BCYXNlfSBmcm9tICcuL3Byb3BzJztcblxuY29uc3QgU3BhcmtNRDUgPSByZXF1aXJlKCdzcGFyay1tZDUnKTtcblxuZXhwb3J0IGNvbnN0IGNhbGNIYXNoID0gKFxuICBub2RlOiBUTm9kZSB8IG51bGwgfCB1bmRlZmluZWQsXG4gIG1vdmVQcm9wczogTW92ZVByb3BbXSA9IFtdXG4pOiBzdHJpbmcgPT4ge1xuICBsZXQgZnVsbG5hbWUgPSAnbic7XG4gIGlmIChtb3ZlUHJvcHMubGVuZ3RoID4gMCkge1xuICAgIGZ1bGxuYW1lICs9IGAke21vdmVQcm9wc1swXS50b2tlbn0ke21vdmVQcm9wc1swXS52YWx1ZX1gO1xuICB9XG4gIGlmIChub2RlKSB7XG4gICAgY29uc3QgcGF0aCA9IG5vZGUuZ2V0UGF0aCgpO1xuICAgIGlmIChwYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIGZ1bGxuYW1lID0gcGF0aC5tYXAobiA9PiBuLm1vZGVsLmlkKS5qb2luKCc9PicpICsgYD0+JHtmdWxsbmFtZX1gO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBTcGFya01ENS5oYXNoKGZ1bGxuYW1lKS5zbGljZSgwLCA2KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NoYXJhY3RlckluTm9kZShcbiAgc2dmOiBzdHJpbmcsXG4gIG46IG51bWJlcixcbiAgbm9kZXMgPSBbJ0MnLCAnVE0nLCAnR04nLCAnUEMnXVxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGAoJHtub2Rlcy5qb2luKCd8Jyl9KVxcXFxbKFteXFxcXF1dKilcXFxcXWAsICdnJyk7XG4gIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcblxuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKHNnZikpICE9PSBudWxsKSB7XG4gICAgY29uc3QgY29udGVudFN0YXJ0ID0gbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGggKyAxOyAvLyArMSBmb3IgdGhlICdbJ1xuICAgIGNvbnN0IGNvbnRlbnRFbmQgPSBjb250ZW50U3RhcnQgKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgaWYgKG4gPj0gY29udGVudFN0YXJ0ICYmIG4gPD0gY29udGVudEVuZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG50eXBlIFJhbmdlID0gW251bWJlciwgbnVtYmVyXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTm9kZVJhbmdlcyhcbiAgc2dmOiBzdHJpbmcsXG4gIGtleXM6IHN0cmluZ1tdID0gWydDJywgJ1RNJywgJ0dOJywgJ1BDJ11cbik6IFJhbmdlW10ge1xuICBjb25zdCByYW5nZXM6IFJhbmdlW10gPSBbXTtcbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoYFxcXFxiKCR7a2V5cy5qb2luKCd8Jyl9KVxcXFxbKFteXFxcXF1dKilcXFxcXWAsICdnJyk7XG5cbiAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKHNnZikpICE9PSBudWxsKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBtYXRjaC5pbmRleCArIG1hdGNoWzFdLmxlbmd0aCArIDE7XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgcmFuZ2VzLnB1c2goW3N0YXJ0LCBlbmRdKTtcbiAgfVxuXG4gIHJldHVybiByYW5nZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luQW55UmFuZ2UoaW5kZXg6IG51bWJlciwgcmFuZ2VzOiBSYW5nZVtdKTogYm9vbGVhbiB7XG4gIC8vIHJhbmdlcyBtdXN0IGJlIHNvcnRlZFxuICBsZXQgbGVmdCA9IDA7XG4gIGxldCByaWdodCA9IHJhbmdlcy5sZW5ndGggLSAxO1xuXG4gIHdoaWxlIChsZWZ0IDw9IHJpZ2h0KSB7XG4gICAgY29uc3QgbWlkID0gKGxlZnQgKyByaWdodCkgPj4gMTtcbiAgICBjb25zdCBbc3RhcnQsIGVuZF0gPSByYW5nZXNbbWlkXTtcblxuICAgIGlmIChpbmRleCA8IHN0YXJ0KSB7XG4gICAgICByaWdodCA9IG1pZCAtIDE7XG4gICAgfSBlbHNlIGlmIChpbmRleCA+IGVuZCkge1xuICAgICAgbGVmdCA9IG1pZCArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldERlZHVwbGljYXRlZFByb3BzID0gKHRhcmdldFByb3BzOiBTZ2ZQcm9wQmFzZVtdKSA9PiB7XG4gIHJldHVybiBmaWx0ZXIoXG4gICAgdGFyZ2V0UHJvcHMsXG4gICAgKHByb3A6IFNnZlByb3BCYXNlLCBpbmRleDogbnVtYmVyKSA9PlxuICAgICAgaW5kZXggPT09XG4gICAgICBmaW5kTGFzdEluZGV4KFxuICAgICAgICB0YXJnZXRQcm9wcyxcbiAgICAgICAgKGxhc3RQcm86IFNnZlByb3BCYXNlKSA9PlxuICAgICAgICAgIHByb3AudG9rZW4gPT09IGxhc3RQcm8udG9rZW4gJiYgcHJvcC52YWx1ZSA9PT0gbGFzdFByby52YWx1ZVxuICAgICAgKVxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTW92ZU5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgcmV0dXJuIG4ubW9kZWwubW92ZVByb3BzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnQgY29uc3QgaXNSb290Tm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICByZXR1cm4gbi5tb2RlbC5yb290UHJvcHMubGVuZ3RoID4gMCB8fCBuLmlzUm9vdCgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzU2V0dXBOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIHJldHVybiBuLm1vZGVsLnNldHVwUHJvcHMubGVuZ3RoID4gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlTnVtYmVyID0gKG46IFROb2RlLCBwYXJlbnQ/OiBUTm9kZSkgPT4ge1xuICBjb25zdCBwYXRoID0gbi5nZXRQYXRoKCk7XG4gIGxldCBtb3Zlc0NvdW50ID0gcGF0aC5maWx0ZXIobiA9PiBpc01vdmVOb2RlKG4pKS5sZW5ndGg7XG4gIGlmIChwYXJlbnQpIHtcbiAgICBtb3Zlc0NvdW50ICs9IHBhcmVudC5nZXRQYXRoKCkuZmlsdGVyKG4gPT4gaXNNb3ZlTm9kZShuKSkubGVuZ3RoO1xuICB9XG4gIHJldHVybiBtb3Zlc0NvdW50O1xufTtcbiIsIi8qKlxuICogVGhlbWUgcHJvcGVydHkga2V5cyBmb3IgdHlwZS1zYWZlIGFjY2VzcyB0byB0aGVtZSBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBlbnVtIFRoZW1lUHJvcGVydHlLZXkge1xuICBQb3NpdGl2ZU5vZGVDb2xvciA9ICdwb3NpdGl2ZU5vZGVDb2xvcicsXG4gIE5lZ2F0aXZlTm9kZUNvbG9yID0gJ25lZ2F0aXZlTm9kZUNvbG9yJyxcbiAgTmV1dHJhbE5vZGVDb2xvciA9ICduZXV0cmFsTm9kZUNvbG9yJyxcbiAgRGVmYXVsdE5vZGVDb2xvciA9ICdkZWZhdWx0Tm9kZUNvbG9yJyxcbiAgV2FybmluZ05vZGVDb2xvciA9ICd3YXJuaW5nTm9kZUNvbG9yJyxcbiAgU2hhZG93Q29sb3IgPSAnc2hhZG93Q29sb3InLFxuICBCb2FyZExpbmVDb2xvciA9ICdib2FyZExpbmVDb2xvcicsXG4gIEFjdGl2ZUNvbG9yID0gJ2FjdGl2ZUNvbG9yJyxcbiAgSW5hY3RpdmVDb2xvciA9ICdpbmFjdGl2ZUNvbG9yJyxcbiAgQm9hcmRCYWNrZ3JvdW5kQ29sb3IgPSAnYm9hcmRCYWNrZ3JvdW5kQ29sb3InLFxuICBGbGF0QmxhY2tDb2xvciA9ICdmbGF0QmxhY2tDb2xvcicsXG4gIEZsYXRCbGFja0NvbG9yQWx0ID0gJ2ZsYXRCbGFja0NvbG9yQWx0JyxcbiAgRmxhdFdoaXRlQ29sb3IgPSAnZmxhdFdoaXRlQ29sb3InLFxuICBGbGF0V2hpdGVDb2xvckFsdCA9ICdmbGF0V2hpdGVDb2xvckFsdCcsXG4gIEJvYXJkRWRnZUxpbmVXaWR0aCA9ICdib2FyZEVkZ2VMaW5lV2lkdGgnLFxuICBCb2FyZExpbmVXaWR0aCA9ICdib2FyZExpbmVXaWR0aCcsXG4gIEJvYXJkTGluZUV4dGVudCA9ICdib2FyZExpbmVFeHRlbnQnLFxuICBTdGFyU2l6ZSA9ICdzdGFyU2l6ZScsXG4gIE1hcmt1cExpbmVXaWR0aCA9ICdtYXJrdXBMaW5lV2lkdGgnLFxuICBIaWdobGlnaHRDb2xvciA9ICdoaWdobGlnaHRDb2xvcicsXG59XG5cbi8qKlxuICogVGhlbWUgY29udGV4dCBmb3IgbWFya3VwIHJlbmRlcmluZ1xuICovXG5leHBvcnQgdHlwZSBUaGVtZUNvbnRleHQgPSB7XG4gIHRoZW1lOiBUaGVtZTtcbiAgdGhlbWVPcHRpb25zOiBUaGVtZU9wdGlvbnM7XG59O1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIEdob3N0QmFuLlxuICovXG5leHBvcnQgdHlwZSBHaG9zdEJhbk9wdGlvbnMgPSB7XG4gIGJvYXJkU2l6ZTogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBkeW5hbWljUGFkZGluZzogYm9vbGVhbjtcbiAgcGFkZGluZzogbnVtYmVyO1xuICB6b29tPzogYm9vbGVhbjtcbiAgZXh0ZW50OiBudW1iZXI7XG4gIHRoZW1lOiBUaGVtZTtcbiAgYW5hbHlzaXNQb2ludFRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWU7XG4gIGNvb3JkaW5hdGU6IGJvb2xlYW47XG4gIGludGVyYWN0aXZlOiBib29sZWFuO1xuICBiYWNrZ3JvdW5kOiBib29sZWFuO1xuICBzaG93QW5hbHlzaXM6IGJvb2xlYW47XG4gIGFkYXB0aXZlQm9hcmRMaW5lOiBib29sZWFuO1xuICB0aGVtZU9wdGlvbnM6IFRoZW1lT3B0aW9ucztcbiAgdGhlbWVSZXNvdXJjZXM6IFRoZW1lUmVzb3VyY2VzO1xuICBtb3ZlU291bmQ6IGJvb2xlYW47XG4gIGFkYXB0aXZlU3RhclNpemU6IGJvb2xlYW47XG4gIG1vYmlsZUluZGljYXRvck9mZnNldDogbnVtYmVyO1xuICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgR2hvc3RCYW5PcHRpb25zUGFyYW1zID0ge1xuICBib2FyZFNpemU/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIGR5bmFtaWNQYWRkaW5nPzogYm9vbGVhbjtcbiAgcGFkZGluZz86IG51bWJlcjtcbiAgem9vbT86IGJvb2xlYW47XG4gIGV4dGVudD86IG51bWJlcjtcbiAgdGhlbWU/OiBUaGVtZTtcbiAgYW5hbHlzaXNQb2ludFRoZW1lPzogQW5hbHlzaXNQb2ludFRoZW1lO1xuICBjb29yZGluYXRlPzogYm9vbGVhbjtcbiAgaW50ZXJhY3RpdmU/OiBib29sZWFuO1xuICBiYWNrZ3JvdW5kPzogYm9vbGVhbjtcbiAgc2hvd0FuYWx5c2lzPzogYm9vbGVhbjtcbiAgYWRhcHRpdmVCb2FyZExpbmU/OiBib29sZWFuO1xuICB0aGVtZU9wdGlvbnM/OiBQYXJ0aWFsPFRoZW1lT3B0aW9ucz47XG4gIHRoZW1lUmVzb3VyY2VzPzogVGhlbWVSZXNvdXJjZXM7XG4gIG1vdmVTb3VuZD86IGJvb2xlYW47XG4gIGFkYXB0aXZlU3RhclNpemU/OiBib29sZWFuO1xuICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplPzogbnVtYmVyO1xuICBtb2JpbGVJbmRpY2F0b3JPZmZzZXQ/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBUaGVtZUNvbmZpZyA9IHtcbiAgcG9zaXRpdmVOb2RlQ29sb3I6IHN0cmluZztcbiAgbmVnYXRpdmVOb2RlQ29sb3I6IHN0cmluZztcbiAgbmV1dHJhbE5vZGVDb2xvcjogc3RyaW5nO1xuICBkZWZhdWx0Tm9kZUNvbG9yOiBzdHJpbmc7XG4gIHdhcm5pbmdOb2RlQ29sb3I6IHN0cmluZztcbiAgc2hhZG93Q29sb3I6IHN0cmluZztcbiAgYm9hcmRMaW5lQ29sb3I6IHN0cmluZztcbiAgYWN0aXZlQ29sb3I6IHN0cmluZztcbiAgaW5hY3RpdmVDb2xvcjogc3RyaW5nO1xuICBib2FyZEJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xuICAvLyBNYXJrdXAgY29sb3JzIGZvciBmbGF0IHRoZW1lc1xuICBmbGF0QmxhY2tDb2xvcjogc3RyaW5nO1xuICBmbGF0QmxhY2tDb2xvckFsdDogc3RyaW5nO1xuICBmbGF0V2hpdGVDb2xvcjogc3RyaW5nO1xuICBmbGF0V2hpdGVDb2xvckFsdDogc3RyaW5nO1xuICAvLyBCb2FyZCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgYm9hcmRFZGdlTGluZVdpZHRoOiBudW1iZXI7XG4gIGJvYXJkTGluZVdpZHRoOiBudW1iZXI7XG4gIGJvYXJkTGluZUV4dGVudDogbnVtYmVyO1xuICBzdGFyU2l6ZTogbnVtYmVyO1xuICBtYXJrdXBMaW5lV2lkdGg6IG51bWJlcjtcbiAgaGlnaGxpZ2h0Q29sb3I6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFRoZW1lT3B0aW9ucyA9IHtcbiAgW2tleSBpbiBUaGVtZV0/OiBQYXJ0aWFsPFRoZW1lQ29uZmlnPjtcbn0gJiB7XG4gIGRlZmF1bHQ6IFRoZW1lQ29uZmlnO1xufTtcblxuZXhwb3J0IHR5cGUgVGhlbWVSZXNvdXJjZXMgPSB7XG4gIFtrZXkgaW4gVGhlbWVdOiB7Ym9hcmQ/OiBzdHJpbmc7IGJsYWNrczogc3RyaW5nW107IHdoaXRlczogc3RyaW5nW119O1xufTtcblxuZXhwb3J0IHR5cGUgQ29uc3VtZWRBbmFseXNpcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNlcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaXNEdXJpbmdTZWFyY2g6IGJvb2xlYW47XG4gIG1vdmVJbmZvczogTW92ZUluZm9bXTtcbiAgcm9vdEluZm86IFJvb3RJbmZvO1xuICBwb2xpY3k6IG51bWJlcltdO1xuICBvd25lcnNoaXA6IG51bWJlcltdO1xuICB0dXJuTnVtYmVyOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpc1BhcmFtcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaW5pdGlhbFBsYXllcjogc3RyaW5nO1xuICBtb3ZlczogYW55W107XG4gIHJ1bGVzOiBzdHJpbmc7XG4gIGtvbWk6IHN0cmluZztcbiAgYm9hcmRYU2l6ZTogbnVtYmVyO1xuICBib2FyZFlTaXplOiBudW1iZXI7XG4gIGluY2x1ZGVQb2xpY3k6IGJvb2xlYW47XG4gIHByaW9yaXR5OiBudW1iZXI7XG4gIG1heFZpc2l0czogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgTW92ZUluZm8gPSB7XG4gIGlzU3ltbWV0cnlPZjogc3RyaW5nO1xuICBsY2I6IG51bWJlcjtcbiAgbW92ZTogc3RyaW5nO1xuICBvcmRlcjogbnVtYmVyO1xuICBwcmlvcjogbnVtYmVyO1xuICBwdjogc3RyaW5nW107XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZU1lYW46IG51bWJlcjtcbiAgc2NvcmVTZWxmUGxheTogbnVtYmVyO1xuICBzY29yZVN0ZGV2OiBudW1iZXI7XG4gIHV0aWxpdHk6IG51bWJlcjtcbiAgdXRpbGl0eUxjYjogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFJvb3RJbmZvID0ge1xuICAvLyBjdXJyZW50UGxheWVyIGlzIG5vdCBvZmZpY2lhbGx5IHBhcnQgb2YgdGhlIEdUUCByZXN1bHRzIGJ1dCBpdCBpcyBoZWxwZnVsIHRvIGhhdmUgaXQgaGVyZSB0byBhdm9pZCBwYXNzaW5nIGl0IHRocm91Z2ggdGhlIGFyZ3VtZW50c1xuICBjdXJyZW50UGxheWVyOiBzdHJpbmc7XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZVNlbGZwbGF5OiBudW1iZXI7XG4gIHNjb3JlU3RkZXY6IG51bWJlcjtcbiAgdXRpbGl0eTogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ/OiBudW1iZXI7XG4gIHJhd1N0V3JFcnJvcj86IG51bWJlcjtcbiAgcmF3U3RTY29yZUVycm9yPzogbnVtYmVyO1xuICByYXdWYXJUaW1lTGVmdD86IG51bWJlcjtcbiAgLy8gR1RQIHJlc3VsdHMgZG9uJ3QgaW5jbHVkZSB0aGUgZm9sbG93aW5nIGZpZWxkc1xuICBsY2I/OiBudW1iZXI7XG4gIHN5bUhhc2g/OiBzdHJpbmc7XG4gIHRoaXNIYXNoPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQW5hbHlzaXNQb2ludE9wdGlvbnMgPSB7XG4gIHNob3dPcmRlcj86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZW51bSBLaSB7XG4gIEJsYWNrID0gMSxcbiAgV2hpdGUgPSAtMSxcbiAgRW1wdHkgPSAwLFxufVxuXG5leHBvcnQgZW51bSBUaGVtZSB7XG4gIEJsYWNrQW5kV2hpdGUgPSAnYmxhY2tfYW5kX3doaXRlJyxcbiAgRmxhdCA9ICdmbGF0JyxcbiAgU3ViZHVlZCA9ICdzdWJkdWVkJyxcbiAgU2hlbGxTdG9uZSA9ICdzaGVsbF9zdG9uZScsXG4gIFNsYXRlQW5kU2hlbGwgPSAnc2xhdGVfYW5kX3NoZWxsJyxcbiAgV2FsbnV0ID0gJ3dhbG51dCcsXG4gIFBob3RvcmVhbGlzdGljID0gJ3Bob3RvcmVhbGlzdGljJyxcbiAgRGFyayA9ICdkYXJrJyxcbiAgV2FybSA9ICd3YXJtJyxcbiAgWXVuemlNb25rZXlEYXJrID0gJ3l1bnppX21vbmtleV9kYXJrJyxcbn1cblxuZXhwb3J0IGVudW0gQW5hbHlzaXNQb2ludFRoZW1lIHtcbiAgRGVmYXVsdCA9ICdkZWZhdWx0JyxcbiAgUHJvYmxlbSA9ICdwcm9ibGVtJyxcbn1cblxuZXhwb3J0IGVudW0gQ2VudGVyIHtcbiAgTGVmdCA9ICdsJyxcbiAgUmlnaHQgPSAncicsXG4gIFRvcCA9ICd0JyxcbiAgQm90dG9tID0gJ2InLFxuICBUb3BSaWdodCA9ICd0cicsXG4gIFRvcExlZnQgPSAndGwnLFxuICBCb3R0b21MZWZ0ID0gJ2JsJyxcbiAgQm90dG9tUmlnaHQgPSAnYnInLFxuICBDZW50ZXIgPSAnYycsXG59XG5cbmV4cG9ydCBlbnVtIEVmZmVjdCB7XG4gIE5vbmUgPSAnJyxcbiAgQmFuID0gJ2JhbicsXG4gIERpbSA9ICdkaW0nLFxuICBIaWdobGlnaHQgPSAnaGlnaGxpZ2h0Jyxcbn1cblxuZXhwb3J0IGVudW0gTWFya3VwIHtcbiAgQ3VycmVudCA9ICdjdScsXG4gIENpcmNsZSA9ICdjaScsXG4gIENpcmNsZVNvbGlkID0gJ2NpcycsXG4gIFNxdWFyZSA9ICdzcScsXG4gIFNxdWFyZVNvbGlkID0gJ3NxcycsXG4gIFRyaWFuZ2xlID0gJ3RyaScsXG4gIENyb3NzID0gJ2NyJyxcbiAgTnVtYmVyID0gJ251bScsXG4gIExldHRlciA9ICdsZScsXG4gIFBvc2l0aXZlTm9kZSA9ICdwb3MnLFxuICBQb3NpdGl2ZUFjdGl2ZU5vZGUgPSAncG9zYScsXG4gIFBvc2l0aXZlRGFzaGVkTm9kZSA9ICdwb3NkYScsXG4gIFBvc2l0aXZlRG90dGVkTm9kZSA9ICdwb3NkdCcsXG4gIFBvc2l0aXZlRGFzaGVkQWN0aXZlTm9kZSA9ICdwb3NkYWEnLFxuICBQb3NpdGl2ZURvdHRlZEFjdGl2ZU5vZGUgPSAncG9zZHRhJyxcbiAgTmVnYXRpdmVOb2RlID0gJ25lZycsXG4gIE5lZ2F0aXZlQWN0aXZlTm9kZSA9ICduZWdhJyxcbiAgTmVnYXRpdmVEYXNoZWROb2RlID0gJ25lZ2RhJyxcbiAgTmVnYXRpdmVEb3R0ZWROb2RlID0gJ25lZ2R0JyxcbiAgTmVnYXRpdmVEYXNoZWRBY3RpdmVOb2RlID0gJ25lZ2RhYScsXG4gIE5lZ2F0aXZlRG90dGVkQWN0aXZlTm9kZSA9ICduZWdkdGEnLFxuICBOZXV0cmFsTm9kZSA9ICduZXUnLFxuICBOZXV0cmFsQWN0aXZlTm9kZSA9ICduZXVhJyxcbiAgTmV1dHJhbERhc2hlZE5vZGUgPSAnbmV1ZGEnLFxuICBOZXV0cmFsRG90dGVkTm9kZSA9ICduZXVkdCcsXG4gIE5ldXRyYWxEYXNoZWRBY3RpdmVOb2RlID0gJ25ldWR0YScsXG4gIE5ldXRyYWxEb3R0ZWRBY3RpdmVOb2RlID0gJ25ldWRhYScsXG4gIFdhcm5pbmdOb2RlID0gJ3dhJyxcbiAgV2FybmluZ0FjdGl2ZU5vZGUgPSAnd2FhJyxcbiAgV2FybmluZ0Rhc2hlZE5vZGUgPSAnd2FkYScsXG4gIFdhcm5pbmdEb3R0ZWROb2RlID0gJ3dhZHQnLFxuICBXYXJuaW5nRGFzaGVkQWN0aXZlTm9kZSA9ICd3YWRhYScsXG4gIFdhcm5pbmdEb3R0ZWRBY3RpdmVOb2RlID0gJ3dhZHRhJyxcbiAgRGVmYXVsdE5vZGUgPSAnZGUnLFxuICBEZWZhdWx0QWN0aXZlTm9kZSA9ICdkZWEnLFxuICBEZWZhdWx0RGFzaGVkTm9kZSA9ICdkZWRhJyxcbiAgRGVmYXVsdERvdHRlZE5vZGUgPSAnZGVkdCcsXG4gIERlZmF1bHREYXNoZWRBY3RpdmVOb2RlID0gJ2RlZGFhJyxcbiAgRGVmYXVsdERvdHRlZEFjdGl2ZU5vZGUgPSAnZGVkdGEnLFxuICBOb2RlID0gJ25vZGUnLFxuICBEYXNoZWROb2RlID0gJ2Rhbm9kZScsXG4gIERvdHRlZE5vZGUgPSAnZHRub2RlJyxcbiAgQWN0aXZlTm9kZSA9ICdhbm9kZScsXG4gIERhc2hlZEFjdGl2ZU5vZGUgPSAnZGFub2RlJyxcbiAgSGlnaGxpZ2h0ID0gJ2hsJyxcbiAgTm9uZSA9ICcnLFxufVxuXG5leHBvcnQgZW51bSBDdXJzb3Ige1xuICBOb25lID0gJycsXG4gIEJsYWNrU3RvbmUgPSAnYicsXG4gIFdoaXRlU3RvbmUgPSAndycsXG4gIENpcmNsZSA9ICdjJyxcbiAgU3F1YXJlID0gJ3MnLFxuICBUcmlhbmdsZSA9ICd0cmknLFxuICBDcm9zcyA9ICdjcicsXG4gIENsZWFyID0gJ2NsJyxcbiAgVGV4dCA9ICd0Jyxcbn1cblxuZXhwb3J0IGVudW0gUHJvYmxlbUFuc3dlclR5cGUge1xuICBSaWdodCA9ICcxJyxcbiAgV3JvbmcgPSAnMicsXG4gIFZhcmlhbnQgPSAnMycsXG59XG5cbmV4cG9ydCBlbnVtIFBhdGhEZXRlY3Rpb25TdHJhdGVneSB7XG4gIFBvc3QgPSAncG9zdCcsXG4gIFByZSA9ICdwcmUnLFxuICBCb3RoID0gJ2JvdGgnLFxufVxuIiwiaW1wb3J0IHtjaHVua30gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7VGhlbWUsIFRoZW1lQ29uZmlnfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3Qgc2V0dGluZ3MgPSB7Y2RuOiAnaHR0cHM6Ly9zLnNoYW93cS5jb20nfTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfVEhFTUVfQ09MT1JfQ09ORklHOiBUaGVtZUNvbmZpZyA9IHtcbiAgcG9zaXRpdmVOb2RlQ29sb3I6ICcjNGQ3YzBmJyxcbiAgbmVnYXRpdmVOb2RlQ29sb3I6ICcjYjkxYzFjJyxcbiAgbmV1dHJhbE5vZGVDb2xvcjogJyNhMTYyMDcnLFxuICBkZWZhdWx0Tm9kZUNvbG9yOiAnIzQwNDA0MCcsXG4gIHdhcm5pbmdOb2RlQ29sb3I6ICcjZmZkZjIwJyxcbiAgc2hhZG93Q29sb3I6ICcjNTU1JyxcbiAgYm9hcmRMaW5lQ29sb3I6ICcjMDAwMDAwJyxcbiAgYWN0aXZlQ29sb3I6ICcjMDAwMDAwJyxcbiAgaW5hY3RpdmVDb2xvcjogJyM2NjY2NjYnLFxuICBib2FyZEJhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnLFxuICAvLyBNYXJrdXAgY29sb3JzIGZvciBmbGF0IHRoZW1lc1xuICBmbGF0QmxhY2tDb2xvcjogJyMwMDAwMDAnLFxuICBmbGF0QmxhY2tDb2xvckFsdDogJyMwMDAwMDAnLCAvLyDlpIfnlKjvvIzmmoLml7bkuI7kuLvopoHpopzoibLnm7jlkIxcbiAgZmxhdFdoaXRlQ29sb3I6ICcjRkZGRkZGJyxcbiAgZmxhdFdoaXRlQ29sb3JBbHQ6ICcjRkZGRkZGJywgLy8g5aSH55So77yM5pqC5pe25LiO5Li76KaB6aKc6Imy55u45ZCMXG4gIC8vIEJvYXJkIGRpc3BsYXkgcHJvcGVydGllc1xuICBib2FyZEVkZ2VMaW5lV2lkdGg6IDUsXG4gIGJvYXJkTGluZVdpZHRoOiAxLFxuICBib2FyZExpbmVFeHRlbnQ6IDAuNSxcbiAgc3RhclNpemU6IDMsXG4gIG1hcmt1cExpbmVXaWR0aDogMixcbiAgaGlnaGxpZ2h0Q29sb3I6ICcjZmZlYjY0Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBNQVhfQk9BUkRfU0laRSA9IDI5O1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQk9BUkRfU0laRSA9IDE5O1xuZXhwb3J0IGNvbnN0IEExX0xFVFRFUlMgPSBbXG4gICdBJyxcbiAgJ0InLFxuICAnQycsXG4gICdEJyxcbiAgJ0UnLFxuICAnRicsXG4gICdHJyxcbiAgJ0gnLFxuICAnSicsXG4gICdLJyxcbiAgJ0wnLFxuICAnTScsXG4gICdOJyxcbiAgJ08nLFxuICAnUCcsXG4gICdRJyxcbiAgJ1InLFxuICAnUycsXG4gICdUJyxcbl07XG5leHBvcnQgY29uc3QgQTFfTEVUVEVSU19XSVRIX0kgPSBbXG4gICdBJyxcbiAgJ0InLFxuICAnQycsXG4gICdEJyxcbiAgJ0UnLFxuICAnRicsXG4gICdHJyxcbiAgJ0gnLFxuICAnSScsXG4gICdKJyxcbiAgJ0snLFxuICAnTCcsXG4gICdNJyxcbiAgJ04nLFxuICAnTycsXG4gICdQJyxcbiAgJ1EnLFxuICAnUicsXG4gICdTJyxcbl07XG5leHBvcnQgY29uc3QgQTFfTlVNQkVSUyA9IFtcbiAgMTksIDE4LCAxNywgMTYsIDE1LCAxNCwgMTMsIDEyLCAxMSwgMTAsIDksIDgsIDcsIDYsIDUsIDQsIDMsIDIsIDEsXG5dO1xuZXhwb3J0IGNvbnN0IFNHRl9MRVRURVJTID0gW1xuICAnYScsXG4gICdiJyxcbiAgJ2MnLFxuICAnZCcsXG4gICdlJyxcbiAgJ2YnLFxuICAnZycsXG4gICdoJyxcbiAgJ2knLFxuICAnaicsXG4gICdrJyxcbiAgJ2wnLFxuICAnbScsXG4gICduJyxcbiAgJ28nLFxuICAncCcsXG4gICdxJyxcbiAgJ3InLFxuICAncycsXG5dO1xuLy8gZXhwb3J0IGNvbnN0IEJMQU5LX0FSUkFZID0gY2h1bmsobmV3IEFycmF5KDM2MSkuZmlsbCgwKSwgMTkpO1xuZXhwb3J0IGNvbnN0IERPVF9TSVpFID0gMztcbmV4cG9ydCBjb25zdCBFWFBBTkRfSCA9IDU7XG5leHBvcnQgY29uc3QgRVhQQU5EX1YgPSA1O1xuZXhwb3J0IGNvbnN0IFJFU1BPTlNFX1RJTUUgPSAxMDA7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIGJvYXJkU2l6ZTogMTksXG4gIHBhZGRpbmc6IDE1LFxuICBleHRlbnQ6IDIsXG4gIGludGVyYWN0aXZlOiBmYWxzZSxcbiAgY29vcmRpbmF0ZTogdHJ1ZSxcbiAgdGhlbWU6IFRoZW1lLkZsYXQsXG4gIGJhY2tncm91bmQ6IGZhbHNlLFxuICB6b29tOiBmYWxzZSxcbiAgc2hvd0FuYWx5c2lzOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBjb25zdCBUSEVNRV9SRVNPVVJDRVM6IHtcbiAgW2tleSBpbiBUaGVtZV06IHtib2FyZD86IHN0cmluZzsgYmxhY2tzOiBzdHJpbmdbXTsgd2hpdGVzOiBzdHJpbmdbXX07XG59ID0ge1xuICBbVGhlbWUuQmxhY2tBbmRXaGl0ZV06IHtcbiAgICBibGFja3M6IFtdLFxuICAgIHdoaXRlczogW10sXG4gIH0sXG4gIFtUaGVtZS5TdWJkdWVkXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zdWJkdWVkL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc3ViZHVlZC9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zdWJkdWVkL3doaXRlLnBuZ2BdLFxuICB9LFxuICBbVGhlbWUuU2hlbGxTdG9uZV06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMC5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUxLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTIucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMy5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGU0LnBuZ2AsXG4gICAgXSxcbiAgfSxcbiAgW1RoZW1lLlNsYXRlQW5kU2hlbGxdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlMS5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlMi5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlMy5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlNC5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlNS5wbmdgLFxuICAgIF0sXG4gICAgd2hpdGVzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGwxLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGwyLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGwzLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGw0LnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGw1LnBuZ2AsXG4gICAgXSxcbiAgfSxcbiAgW1RoZW1lLldhbG51dF06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvd2FsbnV0L2JvYXJkLmpwZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvd2FsbnV0L2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3dhbG51dC93aGl0ZS5wbmdgXSxcbiAgfSxcbiAgW1RoZW1lLlBob3RvcmVhbGlzdGljXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9waG90b3JlYWxpc3RpYy9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3Bob3RvcmVhbGlzdGljL2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3Bob3RvcmVhbGlzdGljL3doaXRlLnBuZ2BdLFxuICB9LFxuICBbVGhlbWUuRmxhdF06IHtcbiAgICBibGFja3M6IFtdLFxuICAgIHdoaXRlczogW10sXG4gIH0sXG4gIFtUaGVtZS5XYXJtXToge1xuICAgIGJsYWNrczogW10sXG4gICAgd2hpdGVzOiBbXSxcbiAgfSxcbiAgW1RoZW1lLkRhcmtdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxuICBbVGhlbWUuWXVuemlNb25rZXlEYXJrXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQveXVuemktbW9ua2V5LWRhcmsvWU1ELUJvLVYxMF9sZXNzYm9yZGVyMTkyMHB4LnBuZ2AsXG4gICAgYmxhY2tzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQveXVuemktbW9ua2V5LWRhcmsvWU1ELUItdjE0LTEzNTBweC5wbmdgLFxuICAgIF0sXG4gICAgd2hpdGVzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQveXVuemktbW9ua2V5LWRhcmsvWU1ELVctdjUtMTM1MHB4LnBuZ2AsXG4gICAgXSxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBMSUdIVF9HUkVFTl9SR0IgPSAncmdiYSgxMzYsIDE3MCwgNjAsIDEpJztcbmV4cG9ydCBjb25zdCBMSUdIVF9ZRUxMT1dfUkdCID0gJ3JnYmEoMjA2LCAyMTAsIDgzLCAxKSc7XG5leHBvcnQgY29uc3QgWUVMTE9XX1JHQiA9ICdyZ2JhKDI0MiwgMjE3LCA2MCwgMSknO1xuZXhwb3J0IGNvbnN0IExJR0hUX1JFRF9SR0IgPSAncmdiYSgyMzYsIDE0NiwgNzMsIDEpJztcbiIsImV4cG9ydCBjb25zdCBNT1ZFX1BST1BfTElTVCA9IFtcbiAgJ0InLFxuICAvLyBLTyBpcyBzdGFuZGFyZCBpbiBtb3ZlIGxpc3QgYnV0IHVzdWFsbHkgYmUgdXNlZCBmb3Iga29taSBpbiBnYW1laW5mbyBwcm9wc1xuICAvLyAnS08nLFxuICAnTU4nLFxuICAnVycsXG5dO1xuZXhwb3J0IGNvbnN0IFNFVFVQX1BST1BfTElTVCA9IFtcbiAgJ0FCJyxcbiAgJ0FFJyxcbiAgJ0FXJyxcbiAgLy9UT0RPOiBQTCBpcyBhIHZhbHVlIG9mIGNvbG9yIHR5cGVcbiAgLy8gJ1BMJ1xuXTtcbmV4cG9ydCBjb25zdCBOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNUID0gW1xuICAnQScsXG4gICdDJyxcbiAgJ0RNJyxcbiAgJ0dCJyxcbiAgJ0dXJyxcbiAgJ0hPJyxcbiAgJ04nLFxuICAnVUMnLFxuICAnVicsXG5dO1xuZXhwb3J0IGNvbnN0IE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QgPSBbXG4gICdCTScsXG4gICdETycsXG4gICdJVCcsXG4gIC8vIFRFIGlzIHN0YW5kYXJkIGluIG1vdmUgYW5ub3RhdGlvbiBmb3IgdGVzdWppXG4gIC8vICdURScsXG5dO1xuZXhwb3J0IGNvbnN0IE1BUktVUF9QUk9QX0xJU1QgPSBbXG4gICdBUicsXG4gICdDUicsXG4gICdMQicsXG4gICdMTicsXG4gICdNQScsXG4gICdTTCcsXG4gICdTUScsXG4gICdUUicsXG5dO1xuXG5leHBvcnQgY29uc3QgUk9PVF9QUk9QX0xJU1QgPSBbJ0FQJywgJ0NBJywgJ0ZGJywgJ0dNJywgJ1NUJywgJ1NaJ107XG5leHBvcnQgY29uc3QgR0FNRV9JTkZPX1BST1BfTElTVCA9IFtcbiAgLy9URSBOb24tc3RhbmRhcmRcbiAgJ1RFJyxcbiAgLy9LTyBOb24tc3RhbmRhcmRcbiAgJ0tPJyxcbiAgJ0FOJyxcbiAgJ0JSJyxcbiAgJ0JUJyxcbiAgJ0NQJyxcbiAgJ0RUJyxcbiAgJ0VWJyxcbiAgJ0dOJyxcbiAgJ0dDJyxcbiAgJ09OJyxcbiAgJ09UJyxcbiAgJ1BCJyxcbiAgJ1BDJyxcbiAgJ1BXJyxcbiAgJ1JFJyxcbiAgJ1JPJyxcbiAgJ1JVJyxcbiAgJ1NPJyxcbiAgJ1RNJyxcbiAgJ1VTJyxcbiAgJ1dSJyxcbiAgJ1dUJyxcbl07XG5leHBvcnQgY29uc3QgVElNSU5HX1BST1BfTElTVCA9IFsnQkwnLCAnT0InLCAnT1cnLCAnV0wnXTtcbmV4cG9ydCBjb25zdCBNSVNDRUxMQU5FT1VTX1BST1BfTElTVCA9IFsnRkcnLCAnUE0nLCAnVlcnXTtcblxuZXhwb3J0IGNvbnN0IENVU1RPTV9QUk9QX0xJU1QgPSBbJ1BJJywgJ1BBSScsICdOSUQnLCAnUEFUJ107XG5cbmV4cG9ydCBjb25zdCBMSVNUX09GX1BPSU5UU19QUk9QID0gWydBQicsICdBRScsICdBVycsICdNQScsICdTTCcsICdTUScsICdUUiddO1xuXG5jb25zdCBUT0tFTl9SRUdFWCA9IG5ldyBSZWdFeHAoLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG5cbmV4cG9ydCBjbGFzcyBTZ2ZQcm9wQmFzZSB7XG4gIHB1YmxpYyB0b2tlbjogc3RyaW5nO1xuICBwdWJsaWMgdHlwZTogc3RyaW5nID0gJy0nO1xuICBwcm90ZWN0ZWQgX3ZhbHVlOiBzdHJpbmcgPSAnJztcbiAgcHJvdGVjdGVkIF92YWx1ZXM6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWUgYXMgc3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHRoaXMudmFsdWVzID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMudG9rZW59JHt0aGlzLl92YWx1ZXMubWFwKHYgPT4gYFske3Z9XWApLmpvaW4oJycpfWA7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vdmVQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbW92ZSc7XG4gIH1cblxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBNb3ZlUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBNb3ZlUHJvcCgnJywgJycpO1xuICB9XG5cbiAgLy8gRHVwbGljYXRlZCBjb2RlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzMzOFxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldHVwUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnc2V0dXAnO1xuICB9XG5cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0b2tlbk1hdGNoID0gc3RyLm1hdGNoKFRPS0VOX1JFR0VYKTtcbiAgICBjb25zdCB2YWxNYXRjaGVzID0gc3RyLm1hdGNoQWxsKC9cXFsoW1xcc1xcU10qPylcXF0vZyk7XG5cbiAgICBsZXQgdG9rZW4gPSAnJztcbiAgICBjb25zdCB2YWxzID0gWy4uLnZhbE1hdGNoZXNdLm1hcChtID0+IG1bMV0pO1xuICAgIGlmICh0b2tlbk1hdGNoKSB0b2tlbiA9IHRva2VuTWF0Y2hbMV07XG4gICAgcmV0dXJuIG5ldyBTZXR1cFByb3AodG9rZW4sIHZhbHMpO1xuICB9XG5cbiAgLy8gRHVwbGljYXRlZCBjb2RlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzMzOFxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vZGVBbm5vdGF0aW9uUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ25vZGUtYW5ub3RhdGlvbic7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgTm9kZUFubm90YXRpb25Qcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGVBbm5vdGF0aW9uUHJvcCgnJywgJycpO1xuICB9XG5cbiAgLy8gRHVwbGljYXRlZCBjb2RlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzMzOFxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vdmVBbm5vdGF0aW9uUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ21vdmUtYW5ub3RhdGlvbic7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgTW92ZUFubm90YXRpb25Qcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE1vdmVBbm5vdGF0aW9uUHJvcCgnJywgJycpO1xuICB9XG5cbiAgLy8gRHVwbGljYXRlZCBjb2RlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzMzOFxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFubm90YXRpb25Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge31cbmV4cG9ydCBjbGFzcyBNYXJrdXBQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdtYXJrdXAnO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgdG9rZW5NYXRjaCA9IHN0ci5tYXRjaChUT0tFTl9SRUdFWCk7XG4gICAgY29uc3QgdmFsTWF0Y2hlcyA9IHN0ci5tYXRjaEFsbCgvXFxbKFtcXHNcXFNdKj8pXFxdL2cpO1xuXG4gICAgbGV0IHRva2VuID0gJyc7XG4gICAgY29uc3QgdmFscyA9IFsuLi52YWxNYXRjaGVzXS5tYXAobSA9PiBtWzFdKTtcbiAgICBpZiAodG9rZW5NYXRjaCkgdG9rZW4gPSB0b2tlbk1hdGNoWzFdO1xuICAgIHJldHVybiBuZXcgTWFya3VwUHJvcCh0b2tlbiwgdmFscyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUm9vdFByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdyb290JztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBSb290UHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSb290UHJvcCgnJywgJycpO1xuICB9XG5cbiAgLy8gRHVwbGljYXRlZCBjb2RlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzMzOFxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdhbWVJbmZvUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ2dhbWUtaW5mbyc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgR2FtZUluZm9Qcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEdhbWVJbmZvUHJvcCgnJywgJycpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnY3VzdG9tJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBDdXN0b21Qcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEN1c3RvbVByb3AoJycsICcnKTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGltaW5nUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ1RpbWluZyc7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1pc2NlbGxhbmVvdXNQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge31cbiIsImltcG9ydCB7Y2xvbmVEZWVwfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtTR0ZfTEVUVEVSU30gZnJvbSAnLi9jb25zdCc7XG5cbi8vIFRPRE86IER1cGxpY2F0ZSB3aXRoIGhlbHBlcnMudHMgdG8gYXZvaWQgY2lyY3VsYXIgZGVwZW5kZW5jeVxuZXhwb3J0IGNvbnN0IHNnZlRvUG9zID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGtpID0gc3RyWzBdID09PSAnQicgPyAxIDogLTE7XG4gIGNvbnN0IHRlbXBTdHIgPSAvXFxbKC4qKVxcXS8uZXhlYyhzdHIpO1xuICBpZiAodGVtcFN0cikge1xuICAgIGNvbnN0IHBvcyA9IHRlbXBTdHJbMV07XG4gICAgY29uc3QgeCA9IFNHRl9MRVRURVJTLmluZGV4T2YocG9zWzBdKTtcbiAgICBjb25zdCB5ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihwb3NbMV0pO1xuICAgIHJldHVybiB7eCwgeSwga2l9O1xuICB9XG4gIHJldHVybiB7eDogLTEsIHk6IC0xLCBraTogMH07XG59O1xuXG5sZXQgbGliZXJ0aWVzID0gMDtcbmxldCByZWN1cnNpb25QYXRoOiBzdHJpbmdbXSA9IFtdO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHNpemUgb2YgYSBtYXRyaXguXG4gKiBAcGFyYW0gbWF0IFRoZSBtYXRyaXggdG8gY2FsY3VsYXRlIHRoZSBzaXplIG9mLlxuICogQHJldHVybnMgQW4gYXJyYXkgY29udGFpbmluZyB0aGUgbnVtYmVyIG9mIHJvd3MgYW5kIGNvbHVtbnMgaW4gdGhlIG1hdHJpeC5cbiAqL1xuY29uc3QgY2FsY1NpemUgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gIGNvbnN0IHJvd3NTaXplID0gbWF0Lmxlbmd0aDtcbiAgY29uc3QgY29sdW1uc1NpemUgPSBtYXQubGVuZ3RoID4gMCA/IG1hdFswXS5sZW5ndGggOiAwO1xuICByZXR1cm4gW3Jvd3NTaXplLCBjb2x1bW5zU2l6ZV07XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGxpYmVydHkgb2YgYSBzdG9uZSBvbiB0aGUgYm9hcmQuXG4gKiBAcGFyYW0gbWF0IC0gVGhlIGJvYXJkIG1hdHJpeC5cbiAqIEBwYXJhbSB4IC0gVGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgc3RvbmUuXG4gKiBAcGFyYW0geSAtIFRoZSB5LWNvb3JkaW5hdGUgb2YgdGhlIHN0b25lLlxuICogQHBhcmFtIGtpIC0gVGhlIHZhbHVlIG9mIHRoZSBzdG9uZS5cbiAqL1xuY29uc3QgY2FsY0xpYmVydHlDb3JlID0gKG1hdDogbnVtYmVyW11bXSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3Qgc2l6ZSA9IGNhbGNTaXplKG1hdCk7XG4gIGlmICh4ID49IDAgJiYgeCA8IHNpemVbMV0gJiYgeSA+PSAwICYmIHkgPCBzaXplWzBdKSB7XG4gICAgaWYgKG1hdFt4XVt5XSA9PT0ga2kgJiYgIXJlY3Vyc2lvblBhdGguaW5jbHVkZXMoYCR7eH0sJHt5fWApKSB7XG4gICAgICByZWN1cnNpb25QYXRoLnB1c2goYCR7eH0sJHt5fWApO1xuICAgICAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCAtIDEsIHksIGtpKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHggKyAxLCB5LCBraSk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4LCB5IC0gMSwga2kpO1xuICAgICAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCwgeSArIDEsIGtpKTtcbiAgICB9IGVsc2UgaWYgKG1hdFt4XVt5XSA9PT0gMCkge1xuICAgICAgbGliZXJ0aWVzICs9IDE7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBjYWxjTGliZXJ0eSA9IChtYXQ6IG51bWJlcltdW10sIHg6IG51bWJlciwgeTogbnVtYmVyLCBraTogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IHNpemUgPSBjYWxjU2l6ZShtYXQpO1xuICBsaWJlcnRpZXMgPSAwO1xuICByZWN1cnNpb25QYXRoID0gW107XG5cbiAgaWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPiBzaXplWzFdIC0gMSB8fCB5ID4gc2l6ZVswXSAtIDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGliZXJ0eTogNCxcbiAgICAgIHJlY3Vyc2lvblBhdGg6IFtdLFxuICAgIH07XG4gIH1cblxuICBpZiAobWF0W3hdW3ldID09PSAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpYmVydHk6IDQsXG4gICAgICByZWN1cnNpb25QYXRoOiBbXSxcbiAgICB9O1xuICB9XG4gIGNhbGNMaWJlcnR5Q29yZShtYXQsIHgsIHksIGtpKTtcbiAgcmV0dXJuIHtcbiAgICBsaWJlcnR5OiBsaWJlcnRpZXMsXG4gICAgcmVjdXJzaW9uUGF0aCxcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBleGVjQ2FwdHVyZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBpOiBudW1iZXIsXG4gIGo6IG51bWJlcixcbiAga2k6IG51bWJlclxuKSA9PiB7XG4gIGNvbnN0IG5ld0FycmF5ID0gbWF0O1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVVwLCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoVXB9ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiAtIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlEb3duLCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoRG93bn0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSxcbiAgICBqICsgMSxcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eUxlZnQsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhMZWZ0fSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpIC0gMSxcbiAgICBqLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5UmlnaHQsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhSaWdodH0gPVxuICAgIGNhbGNMaWJlcnR5KG1hdCwgaSArIDEsIGosIGtpKTtcbiAgaWYgKGxpYmVydHlVcCA9PT0gMCkge1xuICAgIHJlY3Vyc2lvblBhdGhVcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdBcnJheVtwYXJzZUludChjb29yZFswXSldW3BhcnNlSW50KGNvb3JkWzFdKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIGlmIChsaWJlcnR5RG93biA9PT0gMCkge1xuICAgIHJlY3Vyc2lvblBhdGhEb3duLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGl0ZW0uc3BsaXQoJywnKTtcbiAgICAgIG5ld0FycmF5W3BhcnNlSW50KGNvb3JkWzBdKV1bcGFyc2VJbnQoY29vcmRbMV0pXSA9IDA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGxpYmVydHlMZWZ0ID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aExlZnQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICBpZiAobGliZXJ0eVJpZ2h0ID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aFJpZ2h0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGl0ZW0uc3BsaXQoJywnKTtcbiAgICAgIG5ld0FycmF5W3BhcnNlSW50KGNvb3JkWzBdKV1bcGFyc2VJbnQoY29vcmRbMV0pXSA9IDA7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG5ld0FycmF5O1xufTtcblxuY29uc3QgY2FuQ2FwdHVyZSA9IChtYXQ6IG51bWJlcltdW10sIGk6IG51bWJlciwgajogbnVtYmVyLCBraTogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5VXAsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhVcH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSxcbiAgICBqIC0gMSxcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eURvd24sIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhEb3dufSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogKyAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5TGVmdCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aExlZnR9ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGkgLSAxLFxuICAgIGosXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlSaWdodCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFJpZ2h0fSA9XG4gICAgY2FsY0xpYmVydHkobWF0LCBpICsgMSwgaiwga2kpO1xuICBpZiAobGliZXJ0eVVwID09PSAwICYmIHJlY3Vyc2lvblBhdGhVcC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGxpYmVydHlEb3duID09PSAwICYmIHJlY3Vyc2lvblBhdGhEb3duLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobGliZXJ0eUxlZnQgPT09IDAgJiYgcmVjdXJzaW9uUGF0aExlZnQubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChsaWJlcnR5UmlnaHQgPT09IDAgJiYgcmVjdXJzaW9uUGF0aFJpZ2h0Lmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgY2FuTW92ZSA9IChtYXQ6IG51bWJlcltdW10sIGk6IG51bWJlciwgajogbnVtYmVyLCBraTogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IG5ld0FycmF5ID0gY2xvbmVEZWVwKG1hdCk7XG4gIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBpID49IG1hdC5sZW5ndGggfHwgaiA+PSAobWF0WzBdPy5sZW5ndGggPz8gMCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAobWF0W2ldW2pdICE9PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbmV3QXJyYXlbaV1bal0gPSBraTtcbiAgY29uc3Qge2xpYmVydHl9ID0gY2FsY0xpYmVydHkobmV3QXJyYXksIGksIGosIGtpKTtcbiAgaWYgKGNhbkNhcHR1cmUobmV3QXJyYXksIGksIGosIC1raSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoY2FuQ2FwdHVyZShuZXdBcnJheSwgaSwgaiwga2kpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChsaWJlcnR5ID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGNvbnN0IHNob3dLaSA9IChcbiAgYXJyYXk6IG51bWJlcltdW10sXG4gIHN0ZXBzOiBzdHJpbmdbXSxcbiAgaXNDYXB0dXJlZCA9IHRydWVcbikgPT4ge1xuICBsZXQgbmV3TWF0ID0gY2xvbmVEZWVwKGFycmF5KTtcbiAgbGV0IGhhc01vdmVkID0gZmFsc2U7XG4gIHN0ZXBzLmZvckVhY2goc3RyID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIGtpLFxuICAgIH06IHtcbiAgICAgIHg6IG51bWJlcjtcbiAgICAgIHk6IG51bWJlcjtcbiAgICAgIGtpOiBudW1iZXI7XG4gICAgfSA9IHNnZlRvUG9zKHN0cik7XG4gICAgaWYgKGlzQ2FwdHVyZWQpIHtcbiAgICAgIGlmIChjYW5Nb3ZlKG5ld01hdCwgeCwgeSwga2kpKSB7XG4gICAgICAgIG5ld01hdFt4XVt5XSA9IGtpO1xuICAgICAgICBuZXdNYXQgPSBleGVjQ2FwdHVyZShuZXdNYXQsIHgsIHksIC1raSk7XG4gICAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICBoYXNNb3ZlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGFycmFuZ2VtZW50OiBuZXdNYXQsXG4gICAgaGFzTW92ZWQsXG4gIH07XG59O1xuIiwiaW1wb3J0IHtjb21wYWN0LCByZXBsYWNlfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgYnVpbGROb2RlUmFuZ2VzLFxuICBpc0luQW55UmFuZ2UsXG4gIGNhbGNIYXNoLFxuICBnZXREZWR1cGxpY2F0ZWRQcm9wcyxcbiAgZ2V0Tm9kZU51bWJlcixcbn0gZnJvbSAnLi9oZWxwZXJzJztcblxuaW1wb3J0IHtUcmVlTW9kZWwsIFROb2RlfSBmcm9tICcuL3RyZWUnO1xuaW1wb3J0IHtcbiAgTW92ZVByb3AsXG4gIFNldHVwUHJvcCxcbiAgUm9vdFByb3AsXG4gIEdhbWVJbmZvUHJvcCxcbiAgU2dmUHJvcEJhc2UsXG4gIE5vZGVBbm5vdGF0aW9uUHJvcCxcbiAgTW92ZUFubm90YXRpb25Qcm9wLFxuICBNYXJrdXBQcm9wLFxuICBDdXN0b21Qcm9wLFxuICBST09UX1BST1BfTElTVCxcbiAgTU9WRV9QUk9QX0xJU1QsXG4gIFNFVFVQX1BST1BfTElTVCxcbiAgTUFSS1VQX1BST1BfTElTVCxcbiAgTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgR0FNRV9JTkZPX1BST1BfTElTVCxcbiAgQ1VTVE9NX1BST1BfTElTVCxcbn0gZnJvbSAnLi9wcm9wcyc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBTR0YgKFNtYXJ0IEdhbWUgRm9ybWF0KSBmaWxlLlxuICovXG5leHBvcnQgY2xhc3MgU2dmIHtcbiAgTkVXX05PREUgPSAnOyc7XG4gIEJSQU5DSElORyA9IFsnKCcsICcpJ107XG4gIFBST1BFUlRZID0gWydbJywgJ10nXTtcbiAgTElTVF9JREVOVElUSUVTID0gW1xuICAgICdBVycsXG4gICAgJ0FCJyxcbiAgICAnQUUnLFxuICAgICdBUicsXG4gICAgJ0NSJyxcbiAgICAnREQnLFxuICAgICdMQicsXG4gICAgJ0xOJyxcbiAgICAnTUEnLFxuICAgICdTTCcsXG4gICAgJ1NRJyxcbiAgICAnVFInLFxuICAgICdWVycsXG4gICAgJ1RCJyxcbiAgICAnVFcnLFxuICBdO1xuICBOT0RFX0RFTElNSVRFUlMgPSBbdGhpcy5ORVdfTk9ERV0uY29uY2F0KHRoaXMuQlJBTkNISU5HKTtcblxuICB0cmVlOiBUcmVlTW9kZWwgPSBuZXcgVHJlZU1vZGVsKCk7XG4gIHJvb3Q6IFROb2RlIHwgbnVsbCA9IG51bGw7XG4gIG5vZGU6IFROb2RlIHwgbnVsbCA9IG51bGw7XG4gIGN1cnJlbnROb2RlOiBUTm9kZSB8IG51bGwgPSBudWxsO1xuICBwYXJlbnROb2RlOiBUTm9kZSB8IG51bGwgPSBudWxsO1xuICBub2RlUHJvcHM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFNnZiBjbGFzcy5cbiAgICogQHBhcmFtIGNvbnRlbnQgVGhlIGNvbnRlbnQgb2YgdGhlIFNnZiwgZWl0aGVyIGFzIGEgc3RyaW5nIG9yIGFzIGEgVE5vZGUoUm9vdCBub2RlKS5cbiAgICogQHBhcmFtIHBhcnNlT3B0aW9ucyBUaGUgb3B0aW9ucyBmb3IgcGFyc2luZyB0aGUgU2dmIGNvbnRlbnQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNvbnRlbnQ/OiBzdHJpbmcgfCBUTm9kZSxcbiAgICBwcml2YXRlIHBhcnNlT3B0aW9ucyA9IHtcbiAgICAgIGlnbm9yZVByb3BMaXN0OiBbXSxcbiAgICB9XG4gICkge1xuICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMucGFyc2UoY29udGVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuc2V0Um9vdChjb250ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcm9vdCBub2RlIG9mIHRoZSBTR0YgdHJlZS5cbiAgICpcbiAgICogQHBhcmFtIHJvb3QgVGhlIHJvb3Qgbm9kZSB0byBzZXQuXG4gICAqIEByZXR1cm5zIFRoZSB1cGRhdGVkIFNHRiBpbnN0YW5jZS5cbiAgICovXG4gIHNldFJvb3Qocm9vdDogVE5vZGUpIHtcbiAgICB0aGlzLnJvb3QgPSByb290O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBjdXJyZW50IFNHRiB0cmVlIHRvIGFuIFNHRiBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG4gICAqIEByZXR1cm5zIFRoZSBTR0Ygc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0cmVlLlxuICAgKi9cbiAgdG9TZ2YoKSB7XG4gICAgcmV0dXJuIGAoJHt0aGlzLm5vZGVUb1N0cmluZyh0aGlzLnJvb3QpfSlgO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBnYW1lIHRyZWUgdG8gU0dGIGZvcm1hdCB3aXRob3V0IGluY2x1ZGluZyBhbmFseXNpcyBkYXRhLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgU0dGIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1lIHRyZWUuXG4gICAqL1xuICB0b1NnZldpdGhvdXRBbmFseXNpcygpIHtcbiAgICBjb25zdCBzZ2YgPSBgKCR7dGhpcy5ub2RlVG9TdHJpbmcodGhpcy5yb290KX0pYDtcbiAgICByZXR1cm4gcmVwbGFjZShzZ2YsIC9dKEFcXFsuKj9cXF0pL2csICddJyk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2VzIHRoZSBnaXZlbiBTR0YgKFNtYXJ0IEdhbWUgRm9ybWF0KSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBzZ2YgLSBUaGUgU0dGIHN0cmluZyB0byBwYXJzZS5cbiAgICovXG4gIHBhcnNlKHNnZjogc3RyaW5nKSB7XG4gICAgaWYgKCFzZ2YpIHJldHVybjtcbiAgICBzZ2YgPSBzZ2YucmVwbGFjZSgvXFxzKyg/IVteXFxbXFxdXSpdKS9nbSwgJycpO1xuICAgIGxldCBub2RlU3RhcnQgPSAwO1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBjb25zdCBzdGFjazogVE5vZGVbXSA9IFtdO1xuXG4gICAgY29uc3QgaW5Ob2RlUmFuZ2VzID0gYnVpbGROb2RlUmFuZ2VzKHNnZikuc29ydCgoYSwgYikgPT4gYVswXSAtIGJbMF0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZ2YubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGMgPSBzZ2ZbaV07XG4gICAgICBjb25zdCBpbnNpZGVQcm9wID0gaXNJbkFueVJhbmdlKGksIGluTm9kZVJhbmdlcyk7XG5cbiAgICAgIGlmICh0aGlzLk5PREVfREVMSU1JVEVSUy5pbmNsdWRlcyhjKSAmJiAhaW5zaWRlUHJvcCkge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gc2dmLnNsaWNlKG5vZGVTdGFydCwgaSk7XG4gICAgICAgIGlmIChjb250ZW50ICE9PSAnJykge1xuICAgICAgICAgIGNvbnN0IG1vdmVQcm9wczogTW92ZVByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IHNldHVwUHJvcHM6IFNldHVwUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3Qgcm9vdFByb3BzOiBSb290UHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgbWFya3VwUHJvcHM6IE1hcmt1cFByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IGdhbWVJbmZvUHJvcHM6IEdhbWVJbmZvUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3Qgbm9kZUFubm90YXRpb25Qcm9wczogTm9kZUFubm90YXRpb25Qcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBtb3ZlQW5ub3RhdGlvblByb3BzOiBNb3ZlQW5ub3RhdGlvblByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IGN1c3RvbVByb3BzOiBDdXN0b21Qcm9wW10gPSBbXTtcblxuICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSBbXG4gICAgICAgICAgICAuLi5jb250ZW50Lm1hdGNoQWxsKFxuICAgICAgICAgICAgICAvLyBSZWdFeHAoLyhbQS1aXStcXFtbYS16XFxbXFxdXSpcXF0rKS8sICdnJylcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC8oW0EtWl0rXFxbLio/XFxdKykvLCAnZycpXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvW0EtWl0rKFxcWy4qP1xcXSl7MSx9LywgJ2cnKVxuICAgICAgICAgICAgICAvLyBSZWdFeHAoL1tBLVpdKyhcXFtbXFxzXFxTXSo/XFxdKXsxLH0vLCAnZycpLFxuICAgICAgICAgICAgICBSZWdFeHAoL1xcdysoXFxbW15cXF1dKj9cXF0oPzpcXHI/XFxuP1xcc1teXFxdXSo/KSopezEsfS8sICdnJylcbiAgICAgICAgICAgICksXG4gICAgICAgICAgXTtcblxuICAgICAgICAgIG1hdGNoZXMuZm9yRWFjaChtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuTWF0Y2ggPSBtWzBdLm1hdGNoKC8oW0EtWl0rKVxcWy8pO1xuICAgICAgICAgICAgaWYgKHRva2VuTWF0Y2gpIHtcbiAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbk1hdGNoWzFdO1xuICAgICAgICAgICAgICBpZiAoTU9WRV9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbW92ZVByb3BzLnB1c2goTW92ZVByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKFNFVFVQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBzZXR1cFByb3BzLnB1c2goU2V0dXBQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChST09UX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICByb290UHJvcHMucHVzaChSb290UHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoTUFSS1VQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBtYXJrdXBQcm9wcy5wdXNoKE1hcmt1cFByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKEdBTUVfSU5GT19QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm9Qcm9wcy5wdXNoKEdhbWVJbmZvUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBub2RlQW5ub3RhdGlvblByb3BzLnB1c2goTm9kZUFubm90YXRpb25Qcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG1vdmVBbm5vdGF0aW9uUHJvcHMucHVzaChNb3ZlQW5ub3RhdGlvblByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKENVU1RPTV9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgY3VzdG9tUHJvcHMucHVzaChDdXN0b21Qcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBoYXNoID0gY2FsY0hhc2godGhpcy5jdXJyZW50Tm9kZSwgbW92ZVByb3BzKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnRyZWUucGFyc2Uoe1xuICAgICAgICAgICAgICBpZDogaGFzaCxcbiAgICAgICAgICAgICAgbmFtZTogaGFzaCxcbiAgICAgICAgICAgICAgaW5kZXg6IGNvdW50ZXIsXG4gICAgICAgICAgICAgIG51bWJlcjogMCxcbiAgICAgICAgICAgICAgbW92ZVByb3BzLFxuICAgICAgICAgICAgICBzZXR1cFByb3BzLFxuICAgICAgICAgICAgICByb290UHJvcHMsXG4gICAgICAgICAgICAgIG1hcmt1cFByb3BzLFxuICAgICAgICAgICAgICBnYW1lSW5mb1Byb3BzLFxuICAgICAgICAgICAgICBub2RlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICAgICAgICBtb3ZlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICAgICAgICBjdXN0b21Qcm9wcyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Tm9kZSkge1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlLmFkZENoaWxkKG5vZGUpO1xuXG4gICAgICAgICAgICAgIG5vZGUubW9kZWwubnVtYmVyID0gZ2V0Tm9kZU51bWJlcihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMucm9vdCA9IG5vZGU7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjID09PSAnKCcgJiYgdGhpcy5jdXJyZW50Tm9kZSAmJiAhaW5zaWRlUHJvcCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHtzZ2ZbaV19JHtzZ2ZbaSArIDFdfSR7c2dmW2kgKyAyXX1gKTtcbiAgICAgICAgc3RhY2sucHVzaCh0aGlzLmN1cnJlbnROb2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChjID09PSAnKScgJiYgIWluc2lkZVByb3AgJiYgc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBub2RlID0gc3RhY2sucG9wKCk7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuTk9ERV9ERUxJTUlURVJTLmluY2x1ZGVzKGMpICYmICFpbnNpZGVQcm9wKSB7XG4gICAgICAgIG5vZGVTdGFydCA9IGk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgbm9kZSB0byBhIHN0cmluZyByZXByZXNlbnRhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIG5vZGUgLSBUaGUgbm9kZSB0byBjb252ZXJ0LlxuICAgKiBAcmV0dXJucyBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBub2RlLlxuICAgKi9cbiAgcHJpdmF0ZSBub2RlVG9TdHJpbmcobm9kZTogYW55KSB7XG4gICAgbGV0IGNvbnRlbnQgPSAnJztcbiAgICBub2RlLndhbGsoKG46IFROb2RlKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHJvb3RQcm9wcyxcbiAgICAgICAgbW92ZVByb3BzLFxuICAgICAgICBjdXN0b21Qcm9wcyxcbiAgICAgICAgc2V0dXBQcm9wcyxcbiAgICAgICAgbWFya3VwUHJvcHMsXG4gICAgICAgIG5vZGVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgIG1vdmVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgIGdhbWVJbmZvUHJvcHMsXG4gICAgICB9ID0gbi5tb2RlbDtcbiAgICAgIGNvbnN0IG5vZGVzID0gY29tcGFjdChbXG4gICAgICAgIC4uLnJvb3RQcm9wcyxcbiAgICAgICAgLi4uY3VzdG9tUHJvcHMsXG4gICAgICAgIC4uLm1vdmVQcm9wcyxcbiAgICAgICAgLi4uZ2V0RGVkdXBsaWNhdGVkUHJvcHMoc2V0dXBQcm9wcyksXG4gICAgICAgIC4uLmdldERlZHVwbGljYXRlZFByb3BzKG1hcmt1cFByb3BzKSxcbiAgICAgICAgLi4uZ2FtZUluZm9Qcm9wcyxcbiAgICAgICAgLi4ubm9kZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgLi4ubW92ZUFubm90YXRpb25Qcm9wcyxcbiAgICAgIF0pO1xuICAgICAgY29udGVudCArPSAnOyc7XG4gICAgICBub2Rlcy5mb3JFYWNoKChuOiBTZ2ZQcm9wQmFzZSkgPT4ge1xuICAgICAgICBjb250ZW50ICs9IG4udG9TdHJpbmcoKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKG4uY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xuICAgICAgICBuLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBUTm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnRlbnQgKz0gYCgke3RoaXMubm9kZVRvU3RyaW5nKGNoaWxkKX0pYDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbi5jaGlsZHJlbi5sZW5ndGggPCAyO1xuICAgIH0pO1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG59XG4iLCJpbXBvcnQge1RyZWVNb2RlbCwgVE5vZGV9IGZyb20gJy4vY29yZS90cmVlJztcbmltcG9ydCB7Y2xvbmVEZWVwLCBmbGF0dGVuRGVwdGgsIGNsb25lLCBzdW0sIGNvbXBhY3QsIHNhbXBsZX0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7U2dmTm9kZSwgU2dmTm9kZU9wdGlvbnN9IGZyb20gJy4vY29yZS90eXBlcyc7XG5pbXBvcnQge1xuICBpc01vdmVOb2RlLFxuICBpc1NldHVwTm9kZSxcbiAgY2FsY0hhc2gsXG4gIGdldE5vZGVOdW1iZXIsXG4gIGlzUm9vdE5vZGUsXG59IGZyb20gJy4vY29yZS9oZWxwZXJzJztcbmV4cG9ydCB7aXNNb3ZlTm9kZSwgaXNTZXR1cE5vZGUsIGNhbGNIYXNoLCBnZXROb2RlTnVtYmVyLCBpc1Jvb3ROb2RlfTtcbmltcG9ydCB7XG4gIEExX0xFVFRFUlMsXG4gIEExX05VTUJFUlMsXG4gIFNHRl9MRVRURVJTLFxuICBNQVhfQk9BUkRfU0laRSxcbiAgTElHSFRfR1JFRU5fUkdCLFxuICBMSUdIVF9ZRUxMT1dfUkdCLFxuICBMSUdIVF9SRURfUkdCLFxuICBZRUxMT1dfUkdCLFxuICBERUZBVUxUX0JPQVJEX1NJWkUsXG59IGZyb20gJy4vY29uc3QnO1xuaW1wb3J0IHtcbiAgU2V0dXBQcm9wLFxuICBNb3ZlUHJvcCxcbiAgQ3VzdG9tUHJvcCxcbiAgU2dmUHJvcEJhc2UsXG4gIE5vZGVBbm5vdGF0aW9uUHJvcCxcbiAgR2FtZUluZm9Qcm9wLFxuICBNb3ZlQW5ub3RhdGlvblByb3AsXG4gIFJvb3RQcm9wLFxuICBNYXJrdXBQcm9wLFxuICBNT1ZFX1BST1BfTElTVCxcbiAgU0VUVVBfUFJPUF9MSVNULFxuICBOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBNQVJLVVBfUFJPUF9MSVNULFxuICBST09UX1BST1BfTElTVCxcbiAgR0FNRV9JTkZPX1BST1BfTElTVCxcbiAgVElNSU5HX1BST1BfTElTVCxcbiAgTUlTQ0VMTEFORU9VU19QUk9QX0xJU1QsXG4gIENVU1RPTV9QUk9QX0xJU1QsXG59IGZyb20gJy4vY29yZS9wcm9wcyc7XG5pbXBvcnQge1xuICBBbmFseXNpcyxcbiAgR2hvc3RCYW5PcHRpb25zLFxuICBLaSxcbiAgTW92ZUluZm8sXG4gIFByb2JsZW1BbnN3ZXJUeXBlIGFzIFBBVCxcbiAgUm9vdEluZm8sXG4gIE1hcmt1cCxcbiAgUGF0aERldGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICcuL3R5cGVzJztcblxuaW1wb3J0IHtDZW50ZXJ9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHtjYW5Nb3ZlLCBleGVjQ2FwdHVyZX0gZnJvbSAnLi9ib2FyZGNvcmUnO1xuZXhwb3J0IHtjYW5Nb3ZlLCBleGVjQ2FwdHVyZX07XG5cbmltcG9ydCB7U2dmfSBmcm9tICcuL2NvcmUvc2dmJztcblxudHlwZSBTdHJhdGVneSA9ICdwb3N0JyB8ICdwcmUnIHwgJ2JvdGgnO1xuXG5jb25zdCBTcGFya01ENSA9IHJlcXVpcmUoJ3NwYXJrLW1kNScpO1xuXG5leHBvcnQgY29uc3QgY2FsY0RvdWJ0ZnVsTW92ZXNUaHJlc2hvbGRSYW5nZSA9ICh0aHJlc2hvbGQ6IG51bWJlcikgPT4ge1xuICAvLyA4RC05RFxuICBpZiAodGhyZXNob2xkID49IDI1KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMTVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTNdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjE1LCAtMC4xXSwgc2NvcmVSYW5nZTogWy0zLCAtMl19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy0yLCAtMV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTEsIC0wLjVdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDVELTdEXG4gIGlmICh0aHJlc2hvbGQgPj0gMjMgJiYgdGhyZXNob2xkIDwgMjUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4yXSwgc2NvcmVSYW5nZTogWy0xMDAsIC04XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4yLCAtMC4xNV0sIHNjb3JlUmFuZ2U6IFstOCwgLTRdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xNSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTQsIC0yXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMiwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG5cbiAgLy8gM0QtNURcbiAgaWYgKHRocmVzaG9sZCA+PSAyMCAmJiB0aHJlc2hvbGQgPCAyMykge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjI1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0xMl19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMjUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTEyLCAtNV19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy01LCAtMl19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTIsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyAxRC0zRFxuICBpZiAodGhyZXNob2xkID49IDE4ICYmIHRocmVzaG9sZCA8IDIwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuM10sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMTVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjMsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTE1LCAtN119LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy03LCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1Sy0xS1xuICBpZiAodGhyZXNob2xkID49IDEzICYmIHRocmVzaG9sZCA8IDE4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMzVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTIwXX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zNSwgLTAuMTJdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xMiwgLTAuMDhdLCBzY29yZVJhbmdlOiBbLTEwLCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wOCwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1Sy0xMEtcbiAgaWYgKHRocmVzaG9sZCA+PSA4ICYmIHRocmVzaG9sZCA8IDEzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuNF0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMjVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjQsIC0wLjE1XSwgc2NvcmVSYW5nZTogWy0yNSwgLTEwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTEwLCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstNSwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDE4Sy0xMEtcbiAgaWYgKHRocmVzaG9sZCA+PSAwICYmIHRocmVzaG9sZCA8IDgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC40NV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMzVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjQ1LCAtMC4yXSwgc2NvcmVSYW5nZTogWy0zNSwgLTIwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMiwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMjAsIC0xMF19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMTAsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuM10sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMzBdfSxcbiAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zLCAtMC4yXSwgc2NvcmVSYW5nZTogWy0zMCwgLTIwXX0sXG4gICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjIsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0xMCwgLTFdfSxcbiAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kMiA9ICh2OiBudW1iZXIsIHNjYWxlID0gMSwgZml4ZWQgPSAyKSA9PiB7XG4gIHJldHVybiAoKE1hdGgucm91bmQodiAqIDEwMCkgLyAxMDApICogc2NhbGUpLnRvRml4ZWQoZml4ZWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kMyA9ICh2OiBudW1iZXIsIHNjYWxlID0gMSwgZml4ZWQgPSAzKSA9PiB7XG4gIHJldHVybiAoKE1hdGgucm91bmQodiAqIDEwMDApIC8gMTAwMCkgKiBzY2FsZSkudG9GaXhlZChmaXhlZCk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNBbnN3ZXJOb2RlID0gKG46IFROb2RlLCBraW5kOiBQQVQpID0+IHtcbiAgY29uc3QgcGF0ID0gbi5tb2RlbC5jdXN0b21Qcm9wcz8uZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BBVCcpO1xuICByZXR1cm4gcGF0Py52YWx1ZSA9PT0ga2luZDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc0Nob2ljZU5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuICEhYz8udmFsdWUuaW5jbHVkZXMoJ0NIT0lDRScpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzVGFyZ2V0Tm9kZSA9IGlzQ2hvaWNlTm9kZTtcblxuZXhwb3J0IGNvbnN0IGlzRm9yY2VOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnRk9SQ0UnKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ByZXZlbnRNb3ZlTm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gYz8udmFsdWUuaW5jbHVkZXMoJ05PVFRISVMnKTtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBpc1JpZ2h0TGVhZiA9IChuOiBUTm9kZSkgPT4ge1xuLy8gICByZXR1cm4gaXNSaWdodE5vZGUobikgJiYgIW4uaGFzQ2hpbGRyZW4oKTtcbi8vIH07XG5cbmV4cG9ydCBjb25zdCBpc1JpZ2h0Tm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gISFjPy52YWx1ZS5pbmNsdWRlcygnUklHSFQnKTtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBpc0ZpcnN0UmlnaHRMZWFmID0gKG46IFROb2RlKSA9PiB7XG4vLyAgIGNvbnN0IHJvb3QgPSBuLmdldFBhdGgoKVswXTtcbi8vICAgY29uc3QgZmlyc3RSaWdodExlYXZlID0gcm9vdC5maXJzdCgobjogVE5vZGUpID0+XG4vLyAgICAgaXNSaWdodExlYWYobilcbi8vICAgKTtcbi8vICAgcmV0dXJuIGZpcnN0UmlnaHRMZWF2ZT8ubW9kZWwuaWQgPT09IG4ubW9kZWwuaWQ7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaXNGaXJzdFJpZ2h0Tm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCByb290ID0gbi5nZXRQYXRoKClbMF07XG4gIGNvbnN0IGZpcnN0UmlnaHROb2RlID0gcm9vdC5maXJzdChuID0+IGlzUmlnaHROb2RlKG4pKTtcbiAgcmV0dXJuIGZpcnN0UmlnaHROb2RlPy5tb2RlbC5pZCA9PT0gbi5tb2RlbC5pZDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ZhcmlhbnROb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiAhIWM/LnZhbHVlLmluY2x1ZGVzKCdWQVJJQU5UJyk7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgaXNWYXJpYW50TGVhZiA9IChuOiBUTm9kZSkgPT4ge1xuLy8gICByZXR1cm4gaXNWYXJpYW50Tm9kZShuKSAmJiAhbi5oYXNDaGlsZHJlbigpO1xuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGlzV3JvbmdOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiAoIWM/LnZhbHVlLmluY2x1ZGVzKCdWQVJJQU5UJykgJiYgIWM/LnZhbHVlLmluY2x1ZGVzKCdSSUdIVCcpKSB8fCAhYztcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBpc1dyb25nTGVhZiA9IChuOiBUTm9kZSkgPT4ge1xuLy8gICByZXR1cm4gaXNXcm9uZ05vZGUobikgJiYgIW4uaGFzQ2hpbGRyZW4oKTtcbi8vIH07XG5cbmV4cG9ydCBjb25zdCBpblBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBkZXRlY3Rpb25NZXRob2Q6IChuOiBUTm9kZSkgPT4gYm9vbGVhbixcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFROb2RlW10sXG4gIHBvc3ROb2Rlcz86IFROb2RlW11cbikgPT4ge1xuICBjb25zdCBwYXRoID0gcHJlTm9kZXMgPz8gbm9kZS5nZXRQYXRoKCk7XG4gIGNvbnN0IHBvc3RSaWdodE5vZGVzID1cbiAgICBwb3N0Tm9kZXM/LmZpbHRlcigobjogVE5vZGUpID0+IGRldGVjdGlvbk1ldGhvZChuKSkgPz9cbiAgICBub2RlLmFsbCgobjogVE5vZGUpID0+IGRldGVjdGlvbk1ldGhvZChuKSk7XG4gIGNvbnN0IHByZVJpZ2h0Tm9kZXMgPSBwYXRoLmZpbHRlcigobjogVE5vZGUpID0+IGRldGVjdGlvbk1ldGhvZChuKSk7XG5cbiAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3Q6XG4gICAgICByZXR1cm4gcG9zdFJpZ2h0Tm9kZXMubGVuZ3RoID4gMDtcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5QcmU6XG4gICAgICByZXR1cm4gcHJlUmlnaHROb2Rlcy5sZW5ndGggPiAwO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LkJvdGg6XG4gICAgICByZXR1cm4gcHJlUmlnaHROb2Rlcy5sZW5ndGggPiAwIHx8IHBvc3RSaWdodE5vZGVzLmxlbmd0aCA+IDA7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGluUmlnaHRQYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWRcbikgPT4ge1xuICByZXR1cm4gaW5QYXRoKG5vZGUsIGlzUmlnaHROb2RlLCBzdHJhdGVneSwgcHJlTm9kZXMsIHBvc3ROb2Rlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5GaXJzdFJpZ2h0UGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc0ZpcnN0UmlnaHROb2RlLCBzdHJhdGVneSwgcHJlTm9kZXMsIHBvc3ROb2Rlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5GaXJzdEJyYW5jaFJpZ2h0UGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUHJlLFxuICBwcmVOb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICBpZiAoIWluUmlnaHRQYXRoKG5vZGUpKSByZXR1cm4gZmFsc2U7XG5cbiAgY29uc3QgcGF0aCA9IHByZU5vZGVzID8/IG5vZGUuZ2V0UGF0aCgpO1xuICBjb25zdCBwb3N0UmlnaHROb2RlcyA9IHBvc3ROb2RlcyA/PyBub2RlLmFsbCgoKSA9PiB0cnVlKTtcblxuICBsZXQgcmVzdWx0ID0gW107XG4gIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0OlxuICAgICAgcmVzdWx0ID0gcG9zdFJpZ2h0Tm9kZXMuZmlsdGVyKG4gPT4gbi5nZXRJbmRleCgpID4gMCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5QcmU6XG4gICAgICByZXN1bHQgPSBwYXRoLmZpbHRlcihuID0+IG4uZ2V0SW5kZXgoKSA+IDApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuQm90aDpcbiAgICAgIHJlc3VsdCA9IHBhdGguY29uY2F0KHBvc3RSaWdodE5vZGVzKS5maWx0ZXIobiA9PiBuLmdldEluZGV4KCkgPiAwKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPT09IDA7XG59O1xuXG5leHBvcnQgY29uc3QgaW5DaG9pY2VQYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gaW5QYXRoKG5vZGUsIGlzQ2hvaWNlTm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGluVGFyZ2V0UGF0aCA9IGluQ2hvaWNlUGF0aDtcblxuZXhwb3J0IGNvbnN0IGluVmFyaWFudFBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNWYXJpYW50Tm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGluV3JvbmdQYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gaW5QYXRoKG5vZGUsIGlzV3JvbmdOb2RlLCBzdHJhdGVneSwgcHJlTm9kZXMsIHBvc3ROb2Rlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgbkZvcm1hdHRlciA9IChudW06IG51bWJlciwgZml4ZWQgPSAxKSA9PiB7XG4gIGNvbnN0IGxvb2t1cCA9IFtcbiAgICB7dmFsdWU6IDEsIHN5bWJvbDogJyd9LFxuICAgIHt2YWx1ZTogMWUzLCBzeW1ib2w6ICdrJ30sXG4gICAge3ZhbHVlOiAxZTYsIHN5bWJvbDogJ00nfSxcbiAgICB7dmFsdWU6IDFlOSwgc3ltYm9sOiAnRyd9LFxuICAgIHt2YWx1ZTogMWUxMiwgc3ltYm9sOiAnVCd9LFxuICAgIHt2YWx1ZTogMWUxNSwgc3ltYm9sOiAnUCd9LFxuICAgIHt2YWx1ZTogMWUxOCwgc3ltYm9sOiAnRSd9LFxuICBdO1xuICBjb25zdCByeCA9IC9cXC4wKyR8KFxcLlswLTldKlsxLTldKTArJC87XG4gIGNvbnN0IGl0ZW0gPSBsb29rdXBcbiAgICAuc2xpY2UoKVxuICAgIC5yZXZlcnNlKClcbiAgICAuZmluZChpdGVtID0+IHtcbiAgICAgIHJldHVybiBudW0gPj0gaXRlbS52YWx1ZTtcbiAgICB9KTtcbiAgcmV0dXJuIGl0ZW1cbiAgICA/IChudW0gLyBpdGVtLnZhbHVlKS50b0ZpeGVkKGZpeGVkKS5yZXBsYWNlKHJ4LCAnJDEnKSArIGl0ZW0uc3ltYm9sXG4gICAgOiAnMCc7XG59O1xuXG5leHBvcnQgY29uc3QgcGF0aFRvSW5kZXhlcyA9IChwYXRoOiBUTm9kZVtdKTogc3RyaW5nW10gPT4ge1xuICByZXR1cm4gcGF0aC5tYXAobiA9PiBuLm1vZGVsLmlkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9Jbml0aWFsU3RvbmVzID0gKFxuICBwYXRoOiBUTm9kZVtdLFxuICB4T2Zmc2V0ID0gMCxcbiAgeU9mZnNldCA9IDBcbik6IHN0cmluZ1tdID0+IHtcbiAgY29uc3QgaW5pdHMgPSBwYXRoXG4gICAgLmZpbHRlcihuID0+IG4ubW9kZWwuc2V0dXBQcm9wcy5sZW5ndGggPiAwKVxuICAgIC5tYXAobiA9PiB7XG4gICAgICByZXR1cm4gbi5tb2RlbC5zZXR1cFByb3BzLm1hcCgoc2V0dXA6IFNldHVwUHJvcCkgPT4ge1xuICAgICAgICByZXR1cm4gc2V0dXAudmFsdWVzLm1hcCgodjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3QgYSA9IEExX0xFVFRFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZih2WzBdKSArIHhPZmZzZXRdO1xuICAgICAgICAgIGNvbnN0IGIgPSBBMV9OVU1CRVJTW1NHRl9MRVRURVJTLmluZGV4T2YodlsxXSkgKyB5T2Zmc2V0XTtcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IHNldHVwLnRva2VuID09PSAnQUInID8gJ0InIDogJ1cnO1xuICAgICAgICAgIHJldHVybiBbdG9rZW4sIGEgKyBiXTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgcmV0dXJuIGZsYXR0ZW5EZXB0aChpbml0c1swXSwgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgcGF0aFRvQWlNb3ZlcyA9IChwYXRoOiBUTm9kZVtdLCB4T2Zmc2V0ID0gMCwgeU9mZnNldCA9IDApID0+IHtcbiAgY29uc3QgbW92ZXMgPSBwYXRoXG4gICAgLmZpbHRlcihuID0+IG4ubW9kZWwubW92ZVByb3BzLmxlbmd0aCA+IDApXG4gICAgLm1hcChuID0+IHtcbiAgICAgIGNvbnN0IHByb3AgPSBuLm1vZGVsLm1vdmVQcm9wc1swXTtcbiAgICAgIGNvbnN0IGEgPSBBMV9MRVRURVJTW1NHRl9MRVRURVJTLmluZGV4T2YocHJvcC52YWx1ZVswXSkgKyB4T2Zmc2V0XTtcbiAgICAgIGNvbnN0IGIgPSBBMV9OVU1CRVJTW1NHRl9MRVRURVJTLmluZGV4T2YocHJvcC52YWx1ZVsxXSkgKyB5T2Zmc2V0XTtcbiAgICAgIHJldHVybiBbcHJvcC50b2tlbiwgYSArIGJdO1xuICAgIH0pO1xuICByZXR1cm4gbW92ZXM7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhGcm9tQW5hbHlzaXMgPSAoYTogQW5hbHlzaXMpID0+IHtcbiAgaWYgKC9pbmRleGVzLy50ZXN0KGEuaWQpKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYS5pZCkuaW5kZXhlc1swXTtcbiAgfVxuICByZXR1cm4gJyc7XG59O1xuXG5leHBvcnQgY29uc3QgaXNNYWluUGF0aCA9IChub2RlOiBUTm9kZSkgPT4ge1xuICByZXR1cm4gc3VtKG5vZGUuZ2V0UGF0aCgpLm1hcChuID0+IG4uZ2V0SW5kZXgoKSkpID09PSAwO1xufTtcblxuZXhwb3J0IGNvbnN0IHNnZlRvUG9zID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGtpID0gc3RyWzBdID09PSAnQicgPyAxIDogLTE7XG4gIGNvbnN0IHRlbXBTdHIgPSAvXFxbKC4qKVxcXS8uZXhlYyhzdHIpO1xuICBpZiAodGVtcFN0cikge1xuICAgIGNvbnN0IHBvcyA9IHRlbXBTdHJbMV07XG4gICAgY29uc3QgeCA9IFNHRl9MRVRURVJTLmluZGV4T2YocG9zWzBdKTtcbiAgICBjb25zdCB5ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihwb3NbMV0pO1xuICAgIHJldHVybiB7eCwgeSwga2l9O1xuICB9XG4gIHJldHVybiB7eDogLTEsIHk6IC0xLCBraTogMH07XG59O1xuXG5leHBvcnQgY29uc3Qgc2dmVG9BMSA9IChzdHI6IHN0cmluZykgPT4ge1xuICBjb25zdCB7eCwgeX0gPSBzZ2ZUb1BvcyhzdHIpO1xuICByZXR1cm4gQTFfTEVUVEVSU1t4XSArIEExX05VTUJFUlNbeV07XG59O1xuXG5leHBvcnQgY29uc3QgYTFUb1BvcyA9IChtb3ZlOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgeCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKTtcbiAgY29uc3QgeSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpO1xuICByZXR1cm4ge3gsIHl9O1xufTtcblxuZXhwb3J0IGNvbnN0IGExVG9JbmRleCA9IChtb3ZlOiBzdHJpbmcsIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGNvbnN0IHggPSBBMV9MRVRURVJTLmluZGV4T2YobW92ZVswXSk7XG4gIGNvbnN0IHkgPSBBMV9OVU1CRVJTLmluZGV4T2YocGFyc2VJbnQobW92ZS5zdWJzdHIoMSksIDApKTtcbiAgcmV0dXJuIHggKiBib2FyZFNpemUgKyB5O1xufTtcblxuZXhwb3J0IGNvbnN0IHNnZk9mZnNldCA9IChzZ2Y6IGFueSwgb2Zmc2V0ID0gMCkgPT4ge1xuICBpZiAob2Zmc2V0ID09PSAwKSByZXR1cm4gc2dmO1xuICBjb25zdCByZXMgPSBjbG9uZShzZ2YpO1xuICBjb25zdCBjaGFySW5kZXggPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHNnZlsyXSkgLSBvZmZzZXQ7XG4gIHJldHVybiByZXMuc3Vic3RyKDAsIDIpICsgU0dGX0xFVFRFUlNbY2hhckluZGV4XSArIHJlcy5zdWJzdHIoMiArIDEpO1xufTtcblxuZXhwb3J0IGNvbnN0IGExVG9TR0YgPSAoc3RyOiBhbnksIHR5cGUgPSAnQicsIG9mZnNldFggPSAwLCBvZmZzZXRZID0gMCkgPT4ge1xuICBpZiAoc3RyID09PSAncGFzcycpIHJldHVybiBgJHt0eXBlfVtdYDtcbiAgY29uc3QgaW54ID0gQTFfTEVUVEVSUy5pbmRleE9mKHN0clswXSkgKyBvZmZzZXRYO1xuICBjb25zdCBpbnkgPSBBMV9OVU1CRVJTLmluZGV4T2YocGFyc2VJbnQoc3RyLnN1YnN0cigxKSwgMCkpICsgb2Zmc2V0WTtcbiAgY29uc3Qgc2dmID0gYCR7dHlwZX1bJHtTR0ZfTEVUVEVSU1tpbnhdfSR7U0dGX0xFVFRFUlNbaW55XX1dYDtcbiAgcmV0dXJuIHNnZjtcbn07XG5cbmV4cG9ydCBjb25zdCBwb3NUb1NnZiA9ICh4OiBudW1iZXIsIHk6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCBheCA9IFNHRl9MRVRURVJTW3hdO1xuICBjb25zdCBheSA9IFNHRl9MRVRURVJTW3ldO1xuICBpZiAoa2kgPT09IEtpLkVtcHR5KSByZXR1cm4gJyc7XG4gIGlmIChraSA9PT0gS2kuV2hpdGUpIHJldHVybiBgQlske2F4fSR7YXl9XWA7XG4gIGlmIChraSA9PT0gS2kuQmxhY2spIHJldHVybiBgV1ske2F4fSR7YXl9XWA7XG4gIHJldHVybiAnJztcbn07XG5cbmV4cG9ydCBjb25zdCBtYXRUb1Bvc2l0aW9uID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIHhPZmZzZXQ/OiBudW1iZXIsXG4gIHlPZmZzZXQ/OiBudW1iZXJcbikgPT4ge1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIHhPZmZzZXQgPSB4T2Zmc2V0ID8/IDA7XG4gIHlPZmZzZXQgPSB5T2Zmc2V0ID8/IERFRkFVTFRfQk9BUkRfU0laRSAtIG1hdC5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IHggPSBBMV9MRVRURVJTW2kgKyB4T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgeSA9IEExX05VTUJFUlNbaiArIHlPZmZzZXRdO1xuICAgICAgICBjb25zdCBjb2xvciA9IHZhbHVlID09PSAxID8gJ2InIDogJ3cnO1xuICAgICAgICByZXN1bHQgKz0gYCR7Y29sb3J9ICR7eH0ke3l9IGA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgbWF0VG9MaXN0T2ZUdXBsZXMgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgeE9mZnNldCA9IDAsXG4gIHlPZmZzZXQgPSAwXG4pID0+IHtcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG1hdFtpXVtqXTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICBjb25zdCB4ID0gQTFfTEVUVEVSU1tpICsgeE9mZnNldF07XG4gICAgICAgIGNvbnN0IHkgPSBBMV9OVU1CRVJTW2ogKyB5T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgY29sb3IgPSB2YWx1ZSA9PT0gMSA/ICdCJyA6ICdXJztcbiAgICAgICAgcmVzdWx0cy5wdXNoKFtjb2xvciwgeCArIHldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG5leHBvcnQgY29uc3QgY29udmVydFN0b25lVHlwZVRvU3RyaW5nID0gKHR5cGU6IGFueSkgPT4gKHR5cGUgPT09IDEgPyAnQicgOiAnVycpO1xuXG5leHBvcnQgY29uc3QgY29udmVydFN0ZXBzRm9yQUkgPSAoc3RlcHM6IGFueSwgb2Zmc2V0ID0gMCkgPT4ge1xuICBsZXQgcmVzID0gY2xvbmUoc3RlcHMpO1xuICByZXMgPSByZXMubWFwKChzOiBhbnkpID0+IHNnZk9mZnNldChzLCBvZmZzZXQpKTtcbiAgY29uc3QgaGVhZGVyID0gYCg7RkZbNF1HTVsxXVNaWyR7XG4gICAgMTkgLSBvZmZzZXRcbiAgfV1HTlsyMjZdUEJbQmxhY2tdSEFbMF1QV1tXaGl0ZV1LTVs3LjVdRFRbMjAxNy0wOC0wMV1UTVsxODAwXVJVW0NoaW5lc2VdQ1BbQ29weXJpZ2h0IGdob3N0LWdvLmNvbV1BUFtnaG9zdC1nby5jb21dUExbQmxhY2tdO2A7XG4gIGxldCBjb3VudCA9IDA7XG4gIGxldCBwcmV2ID0gJyc7XG4gIHN0ZXBzLmZvckVhY2goKHN0ZXA6IGFueSwgaW5kZXg6IGFueSkgPT4ge1xuICAgIGlmIChzdGVwWzBdID09PSBwcmV2WzBdKSB7XG4gICAgICBpZiAoc3RlcFswXSA9PT0gJ0InKSB7XG4gICAgICAgIHJlcy5zcGxpY2UoaW5kZXggKyBjb3VudCwgMCwgJ1dbdHRdJyk7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc3BsaWNlKGluZGV4ICsgY291bnQsIDAsICdCW3R0XScpO1xuICAgICAgICBjb3VudCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBwcmV2ID0gc3RlcDtcbiAgfSk7XG4gIHJldHVybiBgJHtoZWFkZXJ9JHtyZXMuam9pbignOycpfSlgO1xufTtcblxuZXhwb3J0IGNvbnN0IG9mZnNldEExTW92ZSA9IChtb3ZlOiBzdHJpbmcsIG94ID0gMCwgb3kgPSAwKSA9PiB7XG4gIGlmIChtb3ZlID09PSAncGFzcycpIHJldHVybiBtb3ZlO1xuICAvLyBjb25zb2xlLmxvZygnb3h5Jywgb3gsIG95KTtcbiAgY29uc3QgaW54ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pICsgb3g7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpICsgb3k7XG4gIC8vIGNvbnNvbGUubG9nKCdpbnh5JywgaW54LCBpbnksIGAke0ExX0xFVFRFUlNbaW54XX0ke0ExX05VTUJFUlNbaW55XX1gKTtcbiAgcmV0dXJuIGAke0ExX0xFVFRFUlNbaW54XX0ke0ExX05VTUJFUlNbaW55XX1gO1xufTtcblxuZXhwb3J0IGNvbnN0IHJldmVyc2VPZmZzZXRBMU1vdmUgPSAoXG4gIG1vdmU6IHN0cmluZyxcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBhbmFseXNpczogQW5hbHlzaXMsXG4gIGJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgaWYgKG1vdmUgPT09ICdwYXNzJykgcmV0dXJuIG1vdmU7XG4gIGNvbnN0IGlkT2JqID0gSlNPTi5wYXJzZShhbmFseXNpcy5pZCk7XG4gIGNvbnN0IHt4LCB5fSA9IHJldmVyc2VPZmZzZXQobWF0LCBpZE9iai5ieCwgaWRPYmouYnksIGJvYXJkU2l6ZSk7XG4gIGNvbnN0IGlueCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKSArIHg7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpICsgeTtcbiAgcmV0dXJuIGAke0ExX0xFVFRFUlNbaW54XX0ke0ExX05VTUJFUlNbaW55XX1gO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNTY29yZURpZmZUZXh0ID0gKFxuICByb290SW5mbz86IFJvb3RJbmZvIHwgbnVsbCxcbiAgY3VyckluZm8/OiBNb3ZlSW5mbyB8IFJvb3RJbmZvIHwgbnVsbCxcbiAgZml4ZWQgPSAxLFxuICByZXZlcnNlID0gZmFsc2VcbikgPT4ge1xuICBpZiAoIXJvb3RJbmZvIHx8ICFjdXJySW5mbykgcmV0dXJuICcnO1xuICBsZXQgc2NvcmUgPSBjYWxjU2NvcmVEaWZmKHJvb3RJbmZvLCBjdXJySW5mbyk7XG4gIGlmIChyZXZlcnNlKSBzY29yZSA9IC1zY29yZTtcbiAgY29uc3QgZml4ZWRTY29yZSA9IHNjb3JlLnRvRml4ZWQoZml4ZWQpO1xuXG4gIHJldHVybiBzY29yZSA+IDAgPyBgKyR7Zml4ZWRTY29yZX1gIDogYCR7Zml4ZWRTY29yZX1gO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNXaW5yYXRlRGlmZlRleHQgPSAoXG4gIHJvb3RJbmZvPzogUm9vdEluZm8gfCBudWxsLFxuICBjdXJySW5mbz86IE1vdmVJbmZvIHwgUm9vdEluZm8gfCBudWxsLFxuICBmaXhlZCA9IDEsXG4gIHJldmVyc2UgPSBmYWxzZVxuKSA9PiB7XG4gIGlmICghcm9vdEluZm8gfHwgIWN1cnJJbmZvKSByZXR1cm4gJyc7XG4gIGxldCB3aW5yYXRlID0gY2FsY1dpbnJhdGVEaWZmKHJvb3RJbmZvLCBjdXJySW5mbyk7XG4gIGlmIChyZXZlcnNlKSB3aW5yYXRlID0gLXdpbnJhdGU7XG4gIGNvbnN0IGZpeGVkV2lucmF0ZSA9IHdpbnJhdGUudG9GaXhlZChmaXhlZCk7XG5cbiAgcmV0dXJuIHdpbnJhdGUgPj0gMCA/IGArJHtmaXhlZFdpbnJhdGV9JWAgOiBgJHtmaXhlZFdpbnJhdGV9JWA7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1Njb3JlRGlmZiA9IChcbiAgcm9vdEluZm86IFJvb3RJbmZvLFxuICBjdXJySW5mbzogTW92ZUluZm8gfCBSb290SW5mb1xuKSA9PiB7XG4gIGNvbnN0IHNpZ24gPSByb290SW5mby5jdXJyZW50UGxheWVyID09PSAnQicgPyAxIDogLTE7XG4gIGNvbnN0IHNjb3JlID1cbiAgICBNYXRoLnJvdW5kKChjdXJySW5mby5zY29yZUxlYWQgLSByb290SW5mby5zY29yZUxlYWQpICogc2lnbiAqIDEwMDApIC8gMTAwMDtcblxuICByZXR1cm4gc2NvcmU7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1dpbnJhdGVEaWZmID0gKFxuICByb290SW5mbzogUm9vdEluZm8sXG4gIGN1cnJJbmZvOiBNb3ZlSW5mbyB8IFJvb3RJbmZvXG4pID0+IHtcbiAgY29uc3Qgc2lnbiA9IHJvb3RJbmZvLmN1cnJlbnRQbGF5ZXIgPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3Qgc2NvcmUgPVxuICAgIE1hdGgucm91bmQoKGN1cnJJbmZvLndpbnJhdGUgLSByb290SW5mby53aW5yYXRlKSAqIHNpZ24gKiAxMDAwICogMTAwKSAvXG4gICAgMTAwMDtcblxuICByZXR1cm4gc2NvcmU7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0FuYWx5c2lzUG9pbnRDb2xvciA9IChcbiAgcm9vdEluZm86IFJvb3RJbmZvLFxuICBtb3ZlSW5mbzogTW92ZUluZm9cbikgPT4ge1xuICBjb25zdCB7cHJpb3IsIG9yZGVyfSA9IG1vdmVJbmZvO1xuICBjb25zdCBzY29yZSA9IGNhbGNTY29yZURpZmYocm9vdEluZm8sIG1vdmVJbmZvKTtcbiAgbGV0IHBvaW50Q29sb3IgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpJztcbiAgaWYgKFxuICAgIHByaW9yID49IDAuNSB8fFxuICAgIChwcmlvciA+PSAwLjEgJiYgb3JkZXIgPCAzICYmIHNjb3JlID4gLTAuMykgfHxcbiAgICBvcmRlciA9PT0gMCB8fFxuICAgIHNjb3JlID49IDBcbiAgKSB7XG4gICAgcG9pbnRDb2xvciA9IExJR0hUX0dSRUVOX1JHQjtcbiAgfSBlbHNlIGlmICgocHJpb3IgPiAwLjA1ICYmIHNjb3JlID4gLTAuNSkgfHwgKHByaW9yID4gMC4wMSAmJiBzY29yZSA+IC0wLjEpKSB7XG4gICAgcG9pbnRDb2xvciA9IExJR0hUX1lFTExPV19SR0I7XG4gIH0gZWxzZSBpZiAocHJpb3IgPiAwLjAxICYmIHNjb3JlID4gLTEpIHtcbiAgICBwb2ludENvbG9yID0gWUVMTE9XX1JHQjtcbiAgfSBlbHNlIHtcbiAgICBwb2ludENvbG9yID0gTElHSFRfUkVEX1JHQjtcbiAgfVxuICByZXR1cm4gcG9pbnRDb2xvcjtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBHb0JhbkRldGVjdGlvbiA9IChwaXhlbERhdGEsIGNhbnZhcykgPT4ge1xuLy8gY29uc3QgY29sdW1ucyA9IGNhbnZhcy53aWR0aDtcbi8vIGNvbnN0IHJvd3MgPSBjYW52YXMuaGVpZ2h0O1xuLy8gY29uc3QgZGF0YVR5cGUgPSBKc0ZlYXQuVThDMV90O1xuLy8gY29uc3QgZGlzdE1hdHJpeFQgPSBuZXcgSnNGZWF0Lm1hdHJpeF90KGNvbHVtbnMsIHJvd3MsIGRhdGFUeXBlKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmdyYXlzY2FsZShwaXhlbERhdGEsIGNvbHVtbnMsIHJvd3MsIGRpc3RNYXRyaXhUKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmdhdXNzaWFuX2JsdXIoZGlzdE1hdHJpeFQsIGRpc3RNYXRyaXhULCAyLCAwKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmNhbm55KGRpc3RNYXRyaXhULCBkaXN0TWF0cml4VCwgNTAsIDUwKTtcblxuLy8gY29uc3QgbmV3UGl4ZWxEYXRhID0gbmV3IFVpbnQzMkFycmF5KHBpeGVsRGF0YS5idWZmZXIpO1xuLy8gY29uc3QgYWxwaGEgPSAoMHhmZiA8PCAyNCk7XG4vLyBsZXQgaSA9IGRpc3RNYXRyaXhULmNvbHMgKiBkaXN0TWF0cml4VC5yb3dzO1xuLy8gbGV0IHBpeCA9IDA7XG4vLyB3aGlsZSAoaSA+PSAwKSB7XG4vLyAgIHBpeCA9IGRpc3RNYXRyaXhULmRhdGFbaV07XG4vLyAgIG5ld1BpeGVsRGF0YVtpXSA9IGFscGhhIHwgKHBpeCA8PCAxNikgfCAocGl4IDw8IDgpIHwgcGl4O1xuLy8gICBpIC09IDE7XG4vLyB9XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFBBSSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBwYWkgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQUknKTtcbiAgaWYgKCFwYWkpIHJldHVybjtcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocGFpLnZhbHVlKTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0QW5zd2VyVHlwZSA9IChuOiBUTm9kZSk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gIGNvbnN0IHBhdCA9IG4ubW9kZWwuY3VzdG9tUHJvcHMuZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BBVCcpO1xuICByZXR1cm4gcGF0Py52YWx1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0UEkgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgcGkgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQSScpO1xuICBpZiAoIXBpKSByZXR1cm47XG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHBpLnZhbHVlKTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbml0Tm9kZURhdGEgPSAoc2hhOiBzdHJpbmcsIG51bWJlcj86IG51bWJlcik6IFNnZk5vZGUgPT4ge1xuICByZXR1cm4ge1xuICAgIGlkOiBzaGEsXG4gICAgbmFtZTogc2hhLFxuICAgIG51bWJlcjogbnVtYmVyIHx8IDAsXG4gICAgcm9vdFByb3BzOiBbXSxcbiAgICBtb3ZlUHJvcHM6IFtdLFxuICAgIHNldHVwUHJvcHM6IFtdLFxuICAgIG1hcmt1cFByb3BzOiBbXSxcbiAgICBnYW1lSW5mb1Byb3BzOiBbXSxcbiAgICBub2RlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBtb3ZlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBjdXN0b21Qcm9wczogW10sXG4gIH07XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGluaXRpYWwgcm9vdCBub2RlIG9mIHRoZSB0cmVlLlxuICpcbiAqIEBwYXJhbSByb290UHJvcHMgLSBUaGUgcm9vdCBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMgVGhlIGluaXRpYWwgcm9vdCBub2RlLlxuICovXG5leHBvcnQgY29uc3QgaW5pdGlhbFJvb3ROb2RlID0gKFxuICByb290UHJvcHMgPSBbXG4gICAgJ0ZGWzRdJyxcbiAgICAnR01bMV0nLFxuICAgICdDQVtVVEYtOF0nLFxuICAgICdBUFtnaG9zdGdvOjAuMS4wXScsXG4gICAgJ1NaWzE5XScsXG4gICAgJ1NUWzBdJyxcbiAgXVxuKSA9PiB7XG4gIGNvbnN0IHRyZWUgPSBuZXcgVHJlZU1vZGVsKCk7XG4gIGNvbnN0IHJvb3QgPSB0cmVlLnBhcnNlKHtcbiAgICAvLyAnMWIxNmIxJyBpcyB0aGUgU0hBMjU2IGhhc2ggb2YgdGhlICduJ1xuICAgIGlkOiAnJyxcbiAgICBuYW1lOiAnJyxcbiAgICBpbmRleDogMCxcbiAgICBudW1iZXI6IDAsXG4gICAgcm9vdFByb3BzOiByb290UHJvcHMubWFwKHAgPT4gUm9vdFByb3AuZnJvbShwKSksXG4gICAgbW92ZVByb3BzOiBbXSxcbiAgICBzZXR1cFByb3BzOiBbXSxcbiAgICBtYXJrdXBQcm9wczogW10sXG4gICAgZ2FtZUluZm9Qcm9wczogW10sXG4gICAgbm9kZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgbW92ZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgY3VzdG9tUHJvcHM6IFtdLFxuICB9KTtcbiAgY29uc3QgaGFzaCA9IGNhbGNIYXNoKHJvb3QpO1xuICByb290Lm1vZGVsLmlkID0gaGFzaDtcblxuICByZXR1cm4gcm9vdDtcbn07XG5cbi8qKlxuICogQnVpbGRzIGEgbmV3IHRyZWUgbm9kZSB3aXRoIHRoZSBnaXZlbiBtb3ZlLCBwYXJlbnQgbm9kZSwgYW5kIGFkZGl0aW9uYWwgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0gbW92ZSAtIFRoZSBtb3ZlIHRvIGJlIGFkZGVkIHRvIHRoZSBub2RlLlxuICogQHBhcmFtIHBhcmVudE5vZGUgLSBUaGUgcGFyZW50IG5vZGUgb2YgdGhlIG5ldyBub2RlLiBPcHRpb25hbC5cbiAqIEBwYXJhbSBwcm9wcyAtIEFkZGl0aW9uYWwgcHJvcGVydGllcyB0byBiZSBhZGRlZCB0byB0aGUgbmV3IG5vZGUuIE9wdGlvbmFsLlxuICogQHJldHVybnMgVGhlIG5ld2x5IGNyZWF0ZWQgdHJlZSBub2RlLlxuICovXG5leHBvcnQgY29uc3QgYnVpbGRNb3ZlTm9kZSA9IChcbiAgbW92ZTogc3RyaW5nLFxuICBwYXJlbnROb2RlPzogVE5vZGUsXG4gIHByb3BzPzogU2dmTm9kZU9wdGlvbnNcbikgPT4ge1xuICBjb25zdCB0cmVlID0gbmV3IFRyZWVNb2RlbCgpO1xuICBjb25zdCBtb3ZlUHJvcCA9IE1vdmVQcm9wLmZyb20obW92ZSk7XG4gIGNvbnN0IGhhc2ggPSBjYWxjSGFzaChwYXJlbnROb2RlLCBbbW92ZVByb3BdKTtcbiAgbGV0IG51bWJlciA9IDE7XG4gIGlmIChwYXJlbnROb2RlKSBudW1iZXIgPSBnZXROb2RlTnVtYmVyKHBhcmVudE5vZGUpICsgMTtcbiAgY29uc3Qgbm9kZURhdGEgPSBpbml0Tm9kZURhdGEoaGFzaCwgbnVtYmVyKTtcbiAgbm9kZURhdGEubW92ZVByb3BzID0gW21vdmVQcm9wXTtcblxuICBjb25zdCBub2RlID0gdHJlZS5wYXJzZSh7XG4gICAgLi4ubm9kZURhdGEsXG4gICAgLi4ucHJvcHMsXG4gIH0pO1xuICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMYXN0SW5kZXggPSAocm9vdDogVE5vZGUpID0+IHtcbiAgbGV0IGxhc3ROb2RlID0gcm9vdDtcbiAgcm9vdC53YWxrKG5vZGUgPT4ge1xuICAgIC8vIEhhbHQgdGhlIHRyYXZlcnNhbCBieSByZXR1cm5pbmcgZmFsc2VcbiAgICBsYXN0Tm9kZSA9IG5vZGU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuICByZXR1cm4gbGFzdE5vZGUubW9kZWwuaW5kZXg7XG59O1xuXG5leHBvcnQgY29uc3QgY3V0TW92ZU5vZGVzID0gKHJvb3Q6IFROb2RlLCByZXR1cm5Sb290PzogYm9vbGVhbikgPT4ge1xuICBsZXQgbm9kZSA9IGNsb25lRGVlcChyb290KTtcbiAgd2hpbGUgKG5vZGUgJiYgbm9kZS5oYXNDaGlsZHJlbigpICYmIG5vZGUubW9kZWwubW92ZVByb3BzLmxlbmd0aCA9PT0gMCkge1xuICAgIG5vZGUgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgIG5vZGUuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIGlmIChyZXR1cm5Sb290KSB7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZS5wYXJlbnQgJiYgIW5vZGUuaXNSb290KCkpIHtcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSb290ID0gKG5vZGU6IFROb2RlKSA9PiB7XG4gIGxldCByb290ID0gbm9kZTtcbiAgd2hpbGUgKHJvb3QgJiYgcm9vdC5wYXJlbnQgJiYgIXJvb3QuaXNSb290KCkpIHtcbiAgICByb290ID0gcm9vdC5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIHJvb3Q7XG59O1xuXG5leHBvcnQgY29uc3QgemVyb3MgPSAoc2l6ZTogW251bWJlciwgbnVtYmVyXSk6IG51bWJlcltdW10gPT5cbiAgbmV3IEFycmF5KHNpemVbMF0pLmZpbGwoMCkubWFwKCgpID0+IG5ldyBBcnJheShzaXplWzFdKS5maWxsKDApKTtcblxuZXhwb3J0IGNvbnN0IGVtcHR5ID0gKHNpemU6IFtudW1iZXIsIG51bWJlcl0pOiBzdHJpbmdbXVtdID0+XG4gIG5ldyBBcnJheShzaXplWzBdKS5maWxsKCcnKS5tYXAoKCkgPT4gbmV3IEFycmF5KHNpemVbMV0pLmZpbGwoJycpKTtcblxuZXhwb3J0IGNvbnN0IGNhbGNNb3N0ID0gKG1hdDogbnVtYmVyW11bXSwgYm9hcmRTaXplID0gMTkpID0+IHtcbiAgbGV0IGxlZnRNb3N0OiBudW1iZXIgPSBib2FyZFNpemUgLSAxO1xuICBsZXQgcmlnaHRNb3N0ID0gMDtcbiAgbGV0IHRvcE1vc3Q6IG51bWJlciA9IGJvYXJkU2l6ZSAtIDE7XG4gIGxldCBib3R0b21Nb3N0ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBtYXRbaV1bal07XG4gICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgaWYgKGxlZnRNb3N0ID4gaSkgbGVmdE1vc3QgPSBpO1xuICAgICAgICBpZiAocmlnaHRNb3N0IDwgaSkgcmlnaHRNb3N0ID0gaTtcbiAgICAgICAgaWYgKHRvcE1vc3QgPiBqKSB0b3BNb3N0ID0gajtcbiAgICAgICAgaWYgKGJvdHRvbU1vc3QgPCBqKSBib3R0b21Nb3N0ID0gajtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQ2VudGVyID0gKG1hdDogbnVtYmVyW11bXSwgYm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3Qge2xlZnRNb3N0LCByaWdodE1vc3QsIHRvcE1vc3QsIGJvdHRvbU1vc3R9ID0gY2FsY01vc3QobWF0LCBib2FyZFNpemUpO1xuICBjb25zdCB0b3AgPSB0b3BNb3N0IDwgYm9hcmRTaXplIC0gMSAtIGJvdHRvbU1vc3Q7XG4gIGNvbnN0IGxlZnQgPSBsZWZ0TW9zdCA8IGJvYXJkU2l6ZSAtIDEgLSByaWdodE1vc3Q7XG4gIGlmICh0b3AgJiYgbGVmdCkgcmV0dXJuIENlbnRlci5Ub3BMZWZ0O1xuICBpZiAoIXRvcCAmJiBsZWZ0KSByZXR1cm4gQ2VudGVyLkJvdHRvbUxlZnQ7XG4gIGlmICh0b3AgJiYgIWxlZnQpIHJldHVybiBDZW50ZXIuVG9wUmlnaHQ7XG4gIGlmICghdG9wICYmICFsZWZ0KSByZXR1cm4gQ2VudGVyLkJvdHRvbVJpZ2h0O1xuICByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQm9hcmRTaXplID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGJvYXJkU2l6ZSA9IDE5LFxuICBleHRlbnQgPSAyXG4pOiBudW1iZXJbXSA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IFsxOSwgMTldO1xuICBjb25zdCBjZW50ZXIgPSBjYWxjQ2VudGVyKG1hdCk7XG4gIGNvbnN0IHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fSA9IGNhbGNNb3N0KG1hdCwgYm9hcmRTaXplKTtcbiAgaWYgKGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQpIHtcbiAgICByZXN1bHRbMF0gPSByaWdodE1vc3QgKyBleHRlbnQgKyAxO1xuICAgIHJlc3VsdFsxXSA9IGJvdHRvbU1vc3QgKyBleHRlbnQgKyAxO1xuICB9XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCkge1xuICAgIHJlc3VsdFswXSA9IGJvYXJkU2l6ZSAtIGxlZnRNb3N0ICsgZXh0ZW50O1xuICAgIHJlc3VsdFsxXSA9IGJvdHRvbU1vc3QgKyBleHRlbnQgKyAxO1xuICB9XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0KSB7XG4gICAgcmVzdWx0WzBdID0gcmlnaHRNb3N0ICsgZXh0ZW50ICsgMTtcbiAgICByZXN1bHRbMV0gPSBib2FyZFNpemUgLSB0b3BNb3N0ICsgZXh0ZW50O1xuICB9XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCkge1xuICAgIHJlc3VsdFswXSA9IGJvYXJkU2l6ZSAtIGxlZnRNb3N0ICsgZXh0ZW50O1xuICAgIHJlc3VsdFsxXSA9IGJvYXJkU2l6ZSAtIHRvcE1vc3QgKyBleHRlbnQ7XG4gIH1cbiAgcmVzdWx0WzBdID0gTWF0aC5taW4ocmVzdWx0WzBdLCBib2FyZFNpemUpO1xuICByZXN1bHRbMV0gPSBNYXRoLm1pbihyZXN1bHRbMV0sIGJvYXJkU2l6ZSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjUGFydGlhbEFyZWEgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgZXh0ZW50ID0gMixcbiAgYm9hcmRTaXplID0gMTlcbik6IFtbbnVtYmVyLCBudW1iZXJdLCBbbnVtYmVyLCBudW1iZXJdXSA9PiB7XG4gIGNvbnN0IHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fSA9IGNhbGNNb3N0KG1hdCk7XG5cbiAgY29uc3Qgc2l6ZSA9IGJvYXJkU2l6ZSAtIDE7XG4gIGNvbnN0IHgxID0gbGVmdE1vc3QgLSBleHRlbnQgPCAwID8gMCA6IGxlZnRNb3N0IC0gZXh0ZW50O1xuICBjb25zdCB5MSA9IHRvcE1vc3QgLSBleHRlbnQgPCAwID8gMCA6IHRvcE1vc3QgLSBleHRlbnQ7XG4gIGNvbnN0IHgyID0gcmlnaHRNb3N0ICsgZXh0ZW50ID4gc2l6ZSA/IHNpemUgOiByaWdodE1vc3QgKyBleHRlbnQ7XG4gIGNvbnN0IHkyID0gYm90dG9tTW9zdCArIGV4dGVudCA+IHNpemUgPyBzaXplIDogYm90dG9tTW9zdCArIGV4dGVudDtcblxuICByZXR1cm4gW1xuICAgIFt4MSwgeTFdLFxuICAgIFt4MiwgeTJdLFxuICBdO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNBdm9pZE1vdmVzRm9yUGFydGlhbEFuYWx5c2lzID0gKFxuICBwYXJ0aWFsQXJlYTogW1tudW1iZXIsIG51bWJlcl0sIFtudW1iZXIsIG51bWJlcl1dLFxuICBib2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGNvbnN0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdCBbW3gxLCB5MV0sIFt4MiwgeTJdXSA9IHBhcnRpYWxBcmVhO1xuXG4gIGZvciAoY29uc3QgY29sIG9mIEExX0xFVFRFUlMuc2xpY2UoMCwgYm9hcmRTaXplKSkge1xuICAgIGZvciAoY29uc3Qgcm93IG9mIEExX05VTUJFUlMuc2xpY2UoLWJvYXJkU2l6ZSkpIHtcbiAgICAgIGNvbnN0IHggPSBBMV9MRVRURVJTLmluZGV4T2YoY29sKTtcbiAgICAgIGNvbnN0IHkgPSBBMV9OVU1CRVJTLmluZGV4T2Yocm93KTtcblxuICAgICAgaWYgKHggPCB4MSB8fCB4ID4geDIgfHwgeSA8IHkxIHx8IHkgPiB5Mikge1xuICAgICAgICByZXN1bHQucHVzaChgJHtjb2x9JHtyb3d9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjVHN1bWVnb0ZyYW1lID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGV4dGVudDogbnVtYmVyLFxuICBib2FyZFNpemUgPSAxOSxcbiAga29taSA9IDcuNSxcbiAgdHVybjogS2kgPSBLaS5CbGFjayxcbiAga28gPSBmYWxzZVxuKTogbnVtYmVyW11bXSA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IGNsb25lRGVlcChtYXQpO1xuICBjb25zdCBwYXJ0aWFsQXJlYSA9IGNhbGNQYXJ0aWFsQXJlYShtYXQsIGV4dGVudCwgYm9hcmRTaXplKTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuICBjb25zdCBwdXRCb3JkZXIgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gICAgY29uc3QgW3gxLCB5MV0gPSBwYXJ0aWFsQXJlYVswXTtcbiAgICBjb25zdCBbeDIsIHkyXSA9IHBhcnRpYWxBcmVhWzFdO1xuICAgIGZvciAobGV0IGkgPSB4MTsgaSA8PSB4MjsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0geTE7IGogPD0geTI7IGorKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCAmJlxuICAgICAgICAgICgoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0ICYmXG4gICAgICAgICAgKChpID09PSB4MSAmJiBpID4gMCkgfHxcbiAgICAgICAgICAgIChqID09PSB5MiAmJiBqIDwgYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgICAgIChpID09PSB4MiAmJiBpIDwgYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgICAgIChqID09PSB5MSAmJiBqID4gMCkpXG4gICAgICAgICkge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCAmJlxuICAgICAgICAgICgoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApIHx8XG4gICAgICAgICAgICAoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0ICYmXG4gICAgICAgICAgKChpID09PSB4MSAmJiBpID4gMCkgfHxcbiAgICAgICAgICAgIChqID09PSB5MSAmJiBqID4gMCkgfHxcbiAgICAgICAgICAgIChpID09PSB4MiAmJiBpIDwgYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgICAgIChqID09PSB5MiAmJiBqIDwgYm9hcmRTaXplIC0gMSkpXG4gICAgICAgICkge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoY2VudGVyID09PSBDZW50ZXIuQ2VudGVyKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgcHV0T3V0c2lkZSA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgICBjb25zdCBvZmZlbmNlVG9XaW4gPSAxMDtcbiAgICBjb25zdCBvZmZlbnNlS29taSA9IHR1cm4gKiBrb21pO1xuICAgIGNvbnN0IFt4MSwgeTFdID0gcGFydGlhbEFyZWFbMF07XG4gICAgY29uc3QgW3gyLCB5Ml0gPSBwYXJ0aWFsQXJlYVsxXTtcbiAgICAvLyBUT0RPOiBIYXJkIGNvZGUgZm9yIG5vd1xuICAgIC8vIGNvbnN0IGJsYWNrVG9BdHRhY2sgPSB0dXJuID09PSBLaS5CbGFjaztcbiAgICBjb25zdCBibGFja1RvQXR0YWNrID0gdHVybiA9PT0gS2kuQmxhY2s7XG4gICAgY29uc3QgaXNpemUgPSB4MiAtIHgxO1xuICAgIGNvbnN0IGpzaXplID0geTIgLSB5MTtcbiAgICAvLyBUT0RPOiAzNjEgaXMgaGFyZGNvZGVkXG4gICAgLy8gY29uc3QgZGVmZW5zZUFyZWEgPSBNYXRoLmZsb29yKFxuICAgIC8vICAgKDM2MSAtIGlzaXplICoganNpemUgLSBvZmZlbnNlS29taSAtIG9mZmVuY2VUb1dpbikgLyAyXG4gICAgLy8gKTtcbiAgICBjb25zdCBkZWZlbnNlQXJlYSA9XG4gICAgICBNYXRoLmZsb29yKCgzNjEgLSBpc2l6ZSAqIGpzaXplKSAvIDIpIC0gb2ZmZW5zZUtvbWkgLSBvZmZlbmNlVG9XaW47XG5cbiAgICAvLyBjb25zdCBkZWZlbnNlQXJlYSA9IDMwO1xuXG4gICAgLy8gb3V0c2lkZSB0aGUgZnJhbWVcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmRTaXplOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRTaXplOyBqKyspIHtcbiAgICAgICAgaWYgKGkgPCB4MSB8fCBpID4geDIgfHwgaiA8IHkxIHx8IGogPiB5Mikge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgbGV0IGtpID0gS2kuRW1wdHk7XG4gICAgICAgICAgaWYgKGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHwgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCkge1xuICAgICAgICAgICAga2kgPSBibGFja1RvQXR0YWNrICE9PSBjb3VudCA8PSBkZWZlbnNlQXJlYSA/IEtpLldoaXRlIDogS2kuQmxhY2s7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodFxuICAgICAgICAgICkge1xuICAgICAgICAgICAga2kgPSBibGFja1RvQXR0YWNrICE9PSBjb3VudCA8PSBkZWZlbnNlQXJlYSA/IEtpLkJsYWNrIDogS2kuV2hpdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgoaSArIGopICUgMiA9PT0gMCAmJiBNYXRoLmFicyhjb3VudCAtIGRlZmVuc2VBcmVhKSA+IGJvYXJkU2l6ZSkge1xuICAgICAgICAgICAga2kgPSBLaS5FbXB0eTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYXRbaV1bal0gPSBraTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLy8gVE9ETzpcbiAgY29uc3QgcHV0S29UaHJlYXQgPSAobWF0OiBudW1iZXJbXVtdLCBrbzogYm9vbGVhbikgPT4ge307XG5cbiAgcHV0Qm9yZGVyKHJlc3VsdCk7XG4gIHB1dE91dHNpZGUocmVzdWx0KTtcblxuICAvLyBjb25zdCBmbGlwU3BlYyA9XG4gIC8vICAgaW1pbiA8IGptaW5cbiAgLy8gICAgID8gW2ZhbHNlLCBmYWxzZSwgdHJ1ZV1cbiAgLy8gICAgIDogW25lZWRGbGlwKGltaW4sIGltYXgsIGlzaXplKSwgbmVlZEZsaXAoam1pbiwgam1heCwganNpemUpLCBmYWxzZV07XG5cbiAgLy8gaWYgKGZsaXBTcGVjLmluY2x1ZGVzKHRydWUpKSB7XG4gIC8vICAgY29uc3QgZmxpcHBlZCA9IGZsaXBTdG9uZXMoc3RvbmVzLCBmbGlwU3BlYyk7XG4gIC8vICAgY29uc3QgZmlsbGVkID0gdHN1bWVnb0ZyYW1lU3RvbmVzKGZsaXBwZWQsIGtvbWksIGJsYWNrVG9QbGF5LCBrbywgbWFyZ2luKTtcbiAgLy8gICByZXR1cm4gZmxpcFN0b25lcyhmaWxsZWQsIGZsaXBTcGVjKTtcbiAgLy8gfVxuXG4gIC8vIGNvbnN0IGkwID0gaW1pbiAtIG1hcmdpbjtcbiAgLy8gY29uc3QgaTEgPSBpbWF4ICsgbWFyZ2luO1xuICAvLyBjb25zdCBqMCA9IGptaW4gLSBtYXJnaW47XG4gIC8vIGNvbnN0IGoxID0gam1heCArIG1hcmdpbjtcbiAgLy8gY29uc3QgZnJhbWVSYW5nZTogUmVnaW9uID0gW2kwLCBpMSwgajAsIGoxXTtcbiAgLy8gY29uc3QgYmxhY2tUb0F0dGFjayA9IGd1ZXNzQmxhY2tUb0F0dGFjayhcbiAgLy8gICBbdG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0XSxcbiAgLy8gICBbaXNpemUsIGpzaXplXVxuICAvLyApO1xuXG4gIC8vIHB1dEJvcmRlcihtYXQsIFtpc2l6ZSwganNpemVdLCBmcmFtZVJhbmdlLCBibGFja1RvQXR0YWNrKTtcbiAgLy8gcHV0T3V0c2lkZShcbiAgLy8gICBzdG9uZXMsXG4gIC8vICAgW2lzaXplLCBqc2l6ZV0sXG4gIC8vICAgZnJhbWVSYW5nZSxcbiAgLy8gICBibGFja1RvQXR0YWNrLFxuICAvLyAgIGJsYWNrVG9QbGF5LFxuICAvLyAgIGtvbWlcbiAgLy8gKTtcbiAgLy8gcHV0S29UaHJlYXQoXG4gIC8vICAgc3RvbmVzLFxuICAvLyAgIFtpc2l6ZSwganNpemVdLFxuICAvLyAgIGZyYW1lUmFuZ2UsXG4gIC8vICAgYmxhY2tUb0F0dGFjayxcbiAgLy8gICBibGFja1RvUGxheSxcbiAgLy8gICBrb1xuICAvLyApO1xuICAvLyByZXR1cm4gc3RvbmVzO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY09mZnNldCA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgY29uc3QgYm9hcmRTaXplID0gY2FsY0JvYXJkU2l6ZShtYXQpO1xuICBjb25zdCBveCA9IDE5IC0gYm9hcmRTaXplWzBdO1xuICBjb25zdCBveSA9IDE5IC0gYm9hcmRTaXplWzFdO1xuICBjb25zdCBjZW50ZXIgPSBjYWxjQ2VudGVyKG1hdCk7XG5cbiAgbGV0IG9veCA9IG94O1xuICBsZXQgb295ID0gb3k7XG4gIHN3aXRjaCAoY2VudGVyKSB7XG4gICAgY2FzZSBDZW50ZXIuVG9wTGVmdDoge1xuICAgICAgb294ID0gMDtcbiAgICAgIG9veSA9IG95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLlRvcFJpZ2h0OiB7XG4gICAgICBvb3ggPSAtb3g7XG4gICAgICBvb3kgPSBveTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21MZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21SaWdodDoge1xuICAgICAgb294ID0gLW94O1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge3g6IG9veCwgeTogb295fTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXZlcnNlT2Zmc2V0ID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGJ4ID0gMTksXG4gIGJ5ID0gMTksXG4gIGJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgY29uc3Qgb3ggPSBib2FyZFNpemUgLSBieDtcbiAgY29uc3Qgb3kgPSBib2FyZFNpemUgLSBieTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuXG4gIGxldCBvb3ggPSBveDtcbiAgbGV0IG9veSA9IG95O1xuICBzd2l0Y2ggKGNlbnRlcikge1xuICAgIGNhc2UgQ2VudGVyLlRvcExlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSAtb3k7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuVG9wUmlnaHQ6IHtcbiAgICAgIG9veCA9IG94O1xuICAgICAgb295ID0gLW95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLkJvdHRvbUxlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSAwO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLkJvdHRvbVJpZ2h0OiB7XG4gICAgICBvb3ggPSBveDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt4OiBvb3gsIHk6IG9veX07XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2FsY1Zpc2libGVBcmVhKFxuICBtYXQ6IG51bWJlcltdW10gPSB6ZXJvcyhbMTksIDE5XSksXG4gIGV4dGVudDogbnVtYmVyLFxuICBhbGxvd1JlY3RhbmdsZSA9IGZhbHNlXG4pOiBudW1iZXJbXVtdIHtcbiAgbGV0IG1pblJvdyA9IG1hdC5sZW5ndGg7XG4gIGxldCBtYXhSb3cgPSAwO1xuICBsZXQgbWluQ29sID0gbWF0WzBdLmxlbmd0aDtcbiAgbGV0IG1heENvbCA9IDA7XG5cbiAgbGV0IGVtcHR5ID0gdHJ1ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0WzBdLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAobWF0W2ldW2pdICE9PSAwKSB7XG4gICAgICAgIGVtcHR5ID0gZmFsc2U7XG4gICAgICAgIG1pblJvdyA9IE1hdGgubWluKG1pblJvdywgaSk7XG4gICAgICAgIG1heFJvdyA9IE1hdGgubWF4KG1heFJvdywgaSk7XG4gICAgICAgIG1pbkNvbCA9IE1hdGgubWluKG1pbkNvbCwgaik7XG4gICAgICAgIG1heENvbCA9IE1hdGgubWF4KG1heENvbCwgaik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGVtcHR5KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIFswLCBtYXQubGVuZ3RoIC0gMV0sXG4gICAgICBbMCwgbWF0WzBdLmxlbmd0aCAtIDFdLFxuICAgIF07XG4gIH1cblxuICBpZiAoIWFsbG93UmVjdGFuZ2xlKSB7XG4gICAgY29uc3QgbWluUm93V2l0aEV4dGVudCA9IE1hdGgubWF4KG1pblJvdyAtIGV4dGVudCwgMCk7XG4gICAgY29uc3QgbWF4Um93V2l0aEV4dGVudCA9IE1hdGgubWluKG1heFJvdyArIGV4dGVudCwgbWF0Lmxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IG1pbkNvbFdpdGhFeHRlbnQgPSBNYXRoLm1heChtaW5Db2wgLSBleHRlbnQsIDApO1xuICAgIGNvbnN0IG1heENvbFdpdGhFeHRlbnQgPSBNYXRoLm1pbihtYXhDb2wgKyBleHRlbnQsIG1hdFswXS5sZW5ndGggLSAxKTtcblxuICAgIGNvbnN0IG1heFJhbmdlID0gTWF0aC5tYXgoXG4gICAgICBtYXhSb3dXaXRoRXh0ZW50IC0gbWluUm93V2l0aEV4dGVudCxcbiAgICAgIG1heENvbFdpdGhFeHRlbnQgLSBtaW5Db2xXaXRoRXh0ZW50XG4gICAgKTtcblxuICAgIG1pblJvdyA9IG1pblJvd1dpdGhFeHRlbnQ7XG4gICAgbWF4Um93ID0gbWluUm93ICsgbWF4UmFuZ2U7XG5cbiAgICBpZiAobWF4Um93ID49IG1hdC5sZW5ndGgpIHtcbiAgICAgIG1heFJvdyA9IG1hdC5sZW5ndGggLSAxO1xuICAgICAgbWluUm93ID0gbWF4Um93IC0gbWF4UmFuZ2U7XG4gICAgfVxuXG4gICAgbWluQ29sID0gbWluQ29sV2l0aEV4dGVudDtcbiAgICBtYXhDb2wgPSBtaW5Db2wgKyBtYXhSYW5nZTtcbiAgICBpZiAobWF4Q29sID49IG1hdFswXS5sZW5ndGgpIHtcbiAgICAgIG1heENvbCA9IG1hdFswXS5sZW5ndGggLSAxO1xuICAgICAgbWluQ29sID0gbWF4Q29sIC0gbWF4UmFuZ2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1pblJvdyA9IE1hdGgubWF4KDAsIG1pblJvdyAtIGV4dGVudCk7XG4gICAgbWF4Um93ID0gTWF0aC5taW4obWF0Lmxlbmd0aCAtIDEsIG1heFJvdyArIGV4dGVudCk7XG4gICAgbWluQ29sID0gTWF0aC5tYXgoMCwgbWluQ29sIC0gZXh0ZW50KTtcbiAgICBtYXhDb2wgPSBNYXRoLm1pbihtYXRbMF0ubGVuZ3RoIC0gMSwgbWF4Q29sICsgZXh0ZW50KTtcbiAgfVxuXG4gIHJldHVybiBbXG4gICAgW21pblJvdywgbWF4Um93XSxcbiAgICBbbWluQ29sLCBtYXhDb2xdLFxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbW92ZShtYXQ6IG51bWJlcltdW10sIGk6IG51bWJlciwgajogbnVtYmVyLCBraTogbnVtYmVyKSB7XG4gIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuIG1hdDtcbiAgY29uc3QgbmV3TWF0ID0gY2xvbmVEZWVwKG1hdCk7XG4gIG5ld01hdFtpXVtqXSA9IGtpO1xuICByZXR1cm4gZXhlY0NhcHR1cmUobmV3TWF0LCBpLCBqLCAta2kpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0tpKG1hdDogbnVtYmVyW11bXSwgc3RlcHM6IHN0cmluZ1tdLCBpc0NhcHR1cmVkID0gdHJ1ZSkge1xuICBsZXQgbmV3TWF0ID0gY2xvbmVEZWVwKG1hdCk7XG4gIGxldCBoYXNNb3ZlZCA9IGZhbHNlO1xuICBzdGVwcy5mb3JFYWNoKHN0ciA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBraSxcbiAgICB9OiB7XG4gICAgICB4OiBudW1iZXI7XG4gICAgICB5OiBudW1iZXI7XG4gICAgICBraTogbnVtYmVyO1xuICAgIH0gPSBzZ2ZUb1BvcyhzdHIpO1xuICAgIGlmIChpc0NhcHR1cmVkKSB7XG4gICAgICBpZiAoY2FuTW92ZShuZXdNYXQsIHgsIHksIGtpKSkge1xuICAgICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgICAgbmV3TWF0ID0gZXhlY0NhcHR1cmUobmV3TWF0LCB4LCB5LCAta2kpO1xuICAgICAgICBoYXNNb3ZlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld01hdFt4XVt5XSA9IGtpO1xuICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBhcnJhbmdlbWVudDogbmV3TWF0LFxuICAgIGhhc01vdmVkLFxuICB9O1xufVxuXG4vLyBUT0RPOlxuZXhwb3J0IGNvbnN0IGhhbmRsZU1vdmUgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgaTogbnVtYmVyLFxuICBqOiBudW1iZXIsXG4gIHR1cm46IEtpLFxuICBjdXJyZW50Tm9kZTogVE5vZGUsXG4gIG9uQWZ0ZXJNb3ZlOiAobm9kZTogVE5vZGUsIGlzTW92ZWQ6IGJvb2xlYW4pID0+IHZvaWRcbikgPT4ge1xuICBpZiAodHVybiA9PT0gS2kuRW1wdHkpIHJldHVybjtcbiAgaWYgKGNhbk1vdmUobWF0LCBpLCBqLCB0dXJuKSkge1xuICAgIC8vIGRpc3BhdGNoKHVpU2xpY2UuYWN0aW9ucy5zZXRUdXJuKC10dXJuKSk7XG4gICAgY29uc3QgdmFsdWUgPSBTR0ZfTEVUVEVSU1tpXSArIFNHRl9MRVRURVJTW2pdO1xuICAgIGNvbnN0IHRva2VuID0gdHVybiA9PT0gS2kuQmxhY2sgPyAnQicgOiAnVyc7XG4gICAgY29uc3QgaGFzaCA9IGNhbGNIYXNoKGN1cnJlbnROb2RlLCBbTW92ZVByb3AuZnJvbShgJHt0b2tlbn1bJHt2YWx1ZX1dYCldKTtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IGN1cnJlbnROb2RlLmNoaWxkcmVuLmZpbHRlcihcbiAgICAgIChuOiBUTm9kZSkgPT4gbi5tb2RlbC5pZCA9PT0gaGFzaFxuICAgICk7XG4gICAgbGV0IG5vZGU6IFROb2RlO1xuICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICBub2RlID0gZmlsdGVyZWRbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSBidWlsZE1vdmVOb2RlKGAke3Rva2VufVske3ZhbHVlfV1gLCBjdXJyZW50Tm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChub2RlKTtcbiAgICB9XG4gICAgaWYgKG9uQWZ0ZXJNb3ZlKSBvbkFmdGVyTW92ZShub2RlLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob25BZnRlck1vdmUpIG9uQWZ0ZXJNb3ZlKGN1cnJlbnROb2RlLCBmYWxzZSk7XG4gIH1cbn07XG5cbi8qKlxuICogQ2xlYXIgc3RvbmUgZnJvbSB0aGUgY3VycmVudE5vZGVcbiAqIEBwYXJhbSBjdXJyZW50Tm9kZVxuICogQHBhcmFtIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBjbGVhclN0b25lRnJvbUN1cnJlbnROb2RlID0gKFxuICBjdXJyZW50Tm9kZTogVE5vZGUsXG4gIHZhbHVlOiBzdHJpbmdcbikgPT4ge1xuICBjb25zdCBwYXRoID0gY3VycmVudE5vZGUuZ2V0UGF0aCgpO1xuICBwYXRoLmZvckVhY2gobm9kZSA9PiB7XG4gICAgY29uc3Qge3NldHVwUHJvcHN9ID0gbm9kZS5tb2RlbDtcbiAgICBpZiAoc2V0dXBQcm9wcy5maWx0ZXIoKHM6IFNldHVwUHJvcCkgPT4gcy52YWx1ZSA9PT0gdmFsdWUpLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vZGUubW9kZWwuc2V0dXBQcm9wcyA9IHNldHVwUHJvcHMuZmlsdGVyKChzOiBhbnkpID0+IHMudmFsdWUgIT09IHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dXBQcm9wcy5mb3JFYWNoKChzOiBTZXR1cFByb3ApID0+IHtcbiAgICAgICAgcy52YWx1ZXMgPSBzLnZhbHVlcy5maWx0ZXIodiA9PiB2ICE9PSB2YWx1ZSk7XG4gICAgICAgIGlmIChzLnZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBub2RlLm1vZGVsLnNldHVwUHJvcHMgPSBub2RlLm1vZGVsLnNldHVwUHJvcHMuZmlsdGVyKFxuICAgICAgICAgICAgKHA6IFNldHVwUHJvcCkgPT4gcC50b2tlbiAhPT0gcy50b2tlblxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBzdG9uZSB0byB0aGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICpcbiAqIEBwYXJhbSBjdXJyZW50Tm9kZSBUaGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICogQHBhcmFtIG1hdCBUaGUgbWF0cml4IHJlcHJlc2VudGluZyB0aGUgYm9hcmQuXG4gKiBAcGFyYW0gaSBUaGUgcm93IGluZGV4IG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSBqIFRoZSBjb2x1bW4gaW5kZXggb2YgdGhlIHN0b25lLlxuICogQHBhcmFtIGtpIFRoZSBjb2xvciBvZiB0aGUgc3RvbmUgKEtpLldoaXRlIG9yIEtpLkJsYWNrKS5cbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHN0b25lIHdhcyByZW1vdmVkIGZyb20gcHJldmlvdXMgbm9kZXMsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGFkZFN0b25lVG9DdXJyZW50Tm9kZSA9IChcbiAgY3VycmVudE5vZGU6IFROb2RlLFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogS2lcbikgPT4ge1xuICBjb25zdCB2YWx1ZSA9IFNHRl9MRVRURVJTW2ldICsgU0dGX0xFVFRFUlNbal07XG4gIGNvbnN0IHRva2VuID0ga2kgPT09IEtpLldoaXRlID8gJ0FXJyA6ICdBQic7XG4gIGNvbnN0IHByb3AgPSBmaW5kUHJvcChjdXJyZW50Tm9kZSwgdG9rZW4pO1xuICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gIGlmIChtYXRbaV1bal0gIT09IEtpLkVtcHR5KSB7XG4gICAgY2xlYXJTdG9uZUZyb21DdXJyZW50Tm9kZShjdXJyZW50Tm9kZSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChwcm9wKSB7XG4gICAgICBwcm9wLnZhbHVlcyA9IFsuLi5wcm9wLnZhbHVlcywgdmFsdWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50Tm9kZS5tb2RlbC5zZXR1cFByb3BzID0gW1xuICAgICAgICAuLi5jdXJyZW50Tm9kZS5tb2RlbC5zZXR1cFByb3BzLFxuICAgICAgICBuZXcgU2V0dXBQcm9wKHRva2VuLCB2YWx1ZSksXG4gICAgICBdO1xuICAgIH1cbiAgICByZXN1bHQgPSB0cnVlO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBtb3ZlIHRvIHRoZSBnaXZlbiBtYXRyaXggYW5kIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIElmIHRoZSBraSBpcyBlbXB0eSwgbm8gbW92ZSBpcyBhZGRlZCBhbmQgbnVsbCBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0gbWF0IC0gVGhlIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIGdhbWUgYm9hcmQuXG4gKiBAcGFyYW0gY3VycmVudE5vZGUgLSBUaGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICogQHBhcmFtIGkgLSBUaGUgcm93IGluZGV4IG9mIHRoZSBtb3ZlLlxuICogQHBhcmFtIGogLSBUaGUgY29sdW1uIGluZGV4IG9mIHRoZSBtb3ZlLlxuICogQHBhcmFtIGtpIC0gVGhlIHR5cGUgb2YgbW92ZSAoS2kpLlxuICogQHJldHVybnMgVGhlIGNvcnJlc3BvbmRpbmcgbm9kZSBpbiB0aGUgdHJlZSwgb3IgbnVsbCBpZiBubyBtb3ZlIGlzIGFkZGVkLlxuICovXG4vLyBUT0RPOiBUaGUgcGFyYW1zIGhlcmUgaXMgd2VpcmRcbmV4cG9ydCBjb25zdCBhZGRNb3ZlVG9DdXJyZW50Tm9kZSA9IChcbiAgY3VycmVudE5vZGU6IFROb2RlLFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogS2lcbikgPT4ge1xuICBpZiAoa2kgPT09IEtpLkVtcHR5KSByZXR1cm47XG4gIGxldCBub2RlO1xuICBpZiAoY2FuTW92ZShtYXQsIGksIGosIGtpKSkge1xuICAgIGNvbnN0IHZhbHVlID0gU0dGX0xFVFRFUlNbaV0gKyBTR0ZfTEVUVEVSU1tqXTtcbiAgICBjb25zdCB0b2tlbiA9IGtpID09PSBLaS5CbGFjayA/ICdCJyA6ICdXJztcbiAgICBjb25zdCBoYXNoID0gY2FsY0hhc2goY3VycmVudE5vZGUsIFtNb3ZlUHJvcC5mcm9tKGAke3Rva2VufVske3ZhbHVlfV1gKV0pO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gY3VycmVudE5vZGUuY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgKG46IFROb2RlKSA9PiBuLm1vZGVsLmlkID09PSBoYXNoXG4gICAgKTtcbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgbm9kZSA9IGZpbHRlcmVkWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gYnVpbGRNb3ZlTm9kZShgJHt0b2tlbn1bJHt2YWx1ZX1dYCwgY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNQcmV2ZW50TW92ZU1hdEZvckRpc3BsYXlPbmx5ID0gKFxuICBub2RlOiBUTm9kZSxcbiAgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgaWYgKCFub2RlKSByZXR1cm4gemVyb3MoW2RlZmF1bHRCb2FyZFNpemUsIGRlZmF1bHRCb2FyZFNpemVdKTtcbiAgY29uc3Qgc2l6ZSA9IGV4dHJhY3RCb2FyZFNpemUobm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGNvbnN0IHByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcblxuICBwcmV2ZW50TW92ZU1hdC5mb3JFYWNoKHJvdyA9PiByb3cuZmlsbCgxKSk7XG4gIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFROb2RlKSA9PiB7XG4gICAgICBuLm1vZGVsLm1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgcHJldmVudE1vdmVNYXRbaV1bal0gPSAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcHJldmVudE1vdmVNYXQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1ByZXZlbnRNb3ZlTWF0ID0gKG5vZGU6IFROb2RlLCBkZWZhdWx0Qm9hcmRTaXplID0gMTkpID0+IHtcbiAgaWYgKCFub2RlKSByZXR1cm4gemVyb3MoW2RlZmF1bHRCb2FyZFNpemUsIGRlZmF1bHRCb2FyZFNpemVdKTtcbiAgY29uc3Qgc2l6ZSA9IGV4dHJhY3RCb2FyZFNpemUobm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGNvbnN0IHByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgY29uc3QgZm9yY2VOb2RlcyA9IFtdO1xuICBsZXQgcHJldmVudE1vdmVOb2RlczogVE5vZGVbXSA9IFtdO1xuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgcHJldmVudE1vdmVOb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUTm9kZSkgPT4gaXNQcmV2ZW50TW92ZU5vZGUobikpO1xuICB9XG5cbiAgaWYgKGlzRm9yY2VOb2RlKG5vZGUpKSB7XG4gICAgcHJldmVudE1vdmVNYXQuZm9yRWFjaChyb3cgPT4gcm93LmZpbGwoMSkpO1xuICAgIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgobjogVE5vZGUpID0+IHtcbiAgICAgICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgICAgcHJldmVudE1vdmVNYXRbaV1bal0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcmV2ZW50TW92ZU5vZGVzLmZvckVhY2goKG46IFROb2RlKSA9PiB7XG4gICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMF0pO1xuICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICBwcmV2ZW50TW92ZU1hdFtpXVtqXSA9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBwcmV2ZW50TW92ZU1hdDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbWFya3VwIG1hdHJpeCBmb3IgdmFyaWF0aW9ucyBpbiBhIGdpdmVuIFNHRiBub2RlLlxuICpcbiAqIEBwYXJhbSBub2RlIC0gVGhlIFNHRiBub2RlIHRvIGNhbGN1bGF0ZSB0aGUgbWFya3VwIGZvci5cbiAqIEBwYXJhbSBwb2xpY3kgLSBUaGUgcG9saWN5IGZvciBoYW5kbGluZyB0aGUgbWFya3VwLiBEZWZhdWx0cyB0byAnYXBwZW5kJy5cbiAqIEByZXR1cm5zIFRoZSBjYWxjdWxhdGVkIG1hcmt1cCBmb3IgdGhlIHZhcmlhdGlvbnMuXG4gKi9cbmV4cG9ydCBjb25zdCBjYWxjVmFyaWF0aW9uc01hcmt1cCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHBvbGljeTogJ2FwcGVuZCcgfCAncHJlcGVuZCcgfCAncmVwbGFjZScgPSAnYXBwZW5kJyxcbiAgYWN0aXZlSW5kZXg6IG51bWJlciA9IDAsXG4gIGRlZmF1bHRCb2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGNvbnN0IHJlcyA9IGNhbGNNYXRBbmRNYXJrdXAobm9kZSk7XG4gIGNvbnN0IHttYXQsIG1hcmt1cH0gPSByZXM7XG4gIGNvbnN0IHNpemUgPSBleHRyYWN0Qm9hcmRTaXplKG5vZGUsIGRlZmF1bHRCb2FyZFNpemUpO1xuXG4gIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFROb2RlKSA9PiB7XG4gICAgICBuLm1vZGVsLm1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICBsZXQgbWFyayA9IE1hcmt1cC5OZXV0cmFsTm9kZTtcbiAgICAgICAgICBpZiAoaW5Xcm9uZ1BhdGgobikpIHtcbiAgICAgICAgICAgIG1hcmsgPVxuICAgICAgICAgICAgICBuLmdldEluZGV4KCkgPT09IGFjdGl2ZUluZGV4XG4gICAgICAgICAgICAgICAgPyBNYXJrdXAuTmVnYXRpdmVBY3RpdmVOb2RlXG4gICAgICAgICAgICAgICAgOiBNYXJrdXAuTmVnYXRpdmVOb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaW5SaWdodFBhdGgobikpIHtcbiAgICAgICAgICAgIG1hcmsgPVxuICAgICAgICAgICAgICBuLmdldEluZGV4KCkgPT09IGFjdGl2ZUluZGV4XG4gICAgICAgICAgICAgICAgPyBNYXJrdXAuUG9zaXRpdmVBY3RpdmVOb2RlXG4gICAgICAgICAgICAgICAgOiBNYXJrdXAuUG9zaXRpdmVOb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWF0W2ldW2pdID09PSBLaS5FbXB0eSkge1xuICAgICAgICAgICAgc3dpdGNoIChwb2xpY3kpIHtcbiAgICAgICAgICAgICAgY2FzZSAncHJlcGVuZCc6XG4gICAgICAgICAgICAgICAgbWFya3VwW2ldW2pdID0gbWFyayArICd8JyArIG1hcmt1cFtpXVtqXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAncmVwbGFjZSc6XG4gICAgICAgICAgICAgICAgbWFya3VwW2ldW2pdID0gbWFyaztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwZW5kJzpcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtYXJrdXBbaV1bal0gKz0gJ3wnICsgbWFyaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG1hcmt1cDtcbn07XG5cbmV4cG9ydCBjb25zdCBkZXRlY3RTVCA9IChub2RlOiBUTm9kZSkgPT4ge1xuICAvLyBSZWZlcmVuY2U6IGh0dHBzOi8vd3d3LnJlZC1iZWFuLmNvbS9zZ2YvcHJvcGVydGllcy5odG1sI1NUXG4gIGNvbnN0IHJvb3QgPSBub2RlLmdldFBhdGgoKVswXTtcbiAgY29uc3Qgc3RQcm9wID0gcm9vdC5tb2RlbC5yb290UHJvcHMuZmluZCgocDogUm9vdFByb3ApID0+IHAudG9rZW4gPT09ICdTVCcpO1xuICBsZXQgc2hvd1ZhcmlhdGlvbnNNYXJrdXAgPSBmYWxzZTtcbiAgbGV0IHNob3dDaGlsZHJlbk1hcmt1cCA9IGZhbHNlO1xuICBsZXQgc2hvd1NpYmxpbmdzTWFya3VwID0gZmFsc2U7XG5cbiAgY29uc3Qgc3QgPSBzdFByb3A/LnZhbHVlIHx8ICcwJztcbiAgaWYgKHN0KSB7XG4gICAgaWYgKHN0ID09PSAnMCcpIHtcbiAgICAgIHNob3dTaWJsaW5nc01hcmt1cCA9IGZhbHNlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gdHJ1ZTtcbiAgICAgIHNob3dWYXJpYXRpb25zTWFya3VwID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHN0ID09PSAnMScpIHtcbiAgICAgIHNob3dTaWJsaW5nc01hcmt1cCA9IHRydWU7XG4gICAgICBzaG93Q2hpbGRyZW5NYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dWYXJpYXRpb25zTWFya3VwID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHN0ID09PSAnMicpIHtcbiAgICAgIHNob3dTaWJsaW5nc01hcmt1cCA9IGZhbHNlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gdHJ1ZTtcbiAgICAgIHNob3dWYXJpYXRpb25zTWFya3VwID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzMnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSB0cnVlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gZmFsc2U7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge3Nob3dWYXJpYXRpb25zTWFya3VwLCBzaG93Q2hpbGRyZW5NYXJrdXAsIHNob3dTaWJsaW5nc01hcmt1cH07XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIG1hdCBhbmQgbWFya3VwIGFycmF5cyBiYXNlZCBvbiB0aGUgY3VycmVudE5vZGUgYW5kIGRlZmF1bHRCb2FyZFNpemUuXG4gKiBAcGFyYW0gY3VycmVudE5vZGUgVGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIEBwYXJhbSBkZWZhdWx0Qm9hcmRTaXplIFRoZSBkZWZhdWx0IHNpemUgb2YgdGhlIGJvYXJkIChvcHRpb25hbCwgZGVmYXVsdCBpcyAxOSkuXG4gKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWF0L3Zpc2libGVBcmVhTWF0L21hcmt1cC9udW1NYXJrdXAgYXJyYXlzLlxuICovXG5leHBvcnQgY29uc3QgY2FsY01hdEFuZE1hcmt1cCA9IChjdXJyZW50Tm9kZTogVE5vZGUsIGRlZmF1bHRCb2FyZFNpemUgPSAxOSkgPT4ge1xuICBjb25zdCBwYXRoID0gY3VycmVudE5vZGUuZ2V0UGF0aCgpO1xuICBjb25zdCByb290ID0gcGF0aFswXTtcblxuICBsZXQgbGksIGxqO1xuICBsZXQgc2V0dXBDb3VudCA9IDA7XG4gIGNvbnN0IHNpemUgPSBleHRyYWN0Qm9hcmRTaXplKGN1cnJlbnROb2RlLCBkZWZhdWx0Qm9hcmRTaXplKTtcbiAgbGV0IG1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IHZpc2libGVBcmVhTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgY29uc3QgbWFya3VwID0gZW1wdHkoW3NpemUsIHNpemVdKTtcbiAgY29uc3QgbnVtTWFya3VwID0gZW1wdHkoW3NpemUsIHNpemVdKTtcblxuICBwYXRoLmZvckVhY2goKG5vZGUsIGluZGV4KSA9PiB7XG4gICAgY29uc3Qge21vdmVQcm9wcywgc2V0dXBQcm9wcywgcm9vdFByb3BzfSA9IG5vZGUubW9kZWw7XG4gICAgaWYgKHNldHVwUHJvcHMubGVuZ3RoID4gMCkgc2V0dXBDb3VudCArPSAxO1xuXG4gICAgbW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm47XG4gICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgbGkgPSBpO1xuICAgICAgICBsaiA9IGo7XG4gICAgICAgIG1hdCA9IG1vdmUobWF0LCBpLCBqLCBtLnRva2VuID09PSAnQicgPyBLaS5CbGFjayA6IEtpLldoaXRlKTtcblxuICAgICAgICBpZiAobGkgIT09IHVuZGVmaW5lZCAmJiBsaiAhPT0gdW5kZWZpbmVkICYmIGxpID49IDAgJiYgbGogPj0gMCkge1xuICAgICAgICAgIG51bU1hcmt1cFtsaV1bbGpdID0gKFxuICAgICAgICAgICAgbm9kZS5tb2RlbC5udW1iZXIgfHwgaW5kZXggLSBzZXR1cENvdW50XG4gICAgICAgICAgKS50b1N0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSBwYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBtYXJrdXBbbGldW2xqXSA9IE1hcmt1cC5DdXJyZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTZXR1cCBwcm9wcyBzaG91bGQgb3ZlcnJpZGUgbW92ZSBwcm9wc1xuICAgIHNldHVwUHJvcHMuZm9yRWFjaCgoc2V0dXA6IGFueSkgPT4ge1xuICAgICAgc2V0dXAudmFsdWVzLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMF0pO1xuICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICBsaSA9IGk7XG4gICAgICAgICAgbGogPSBqO1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHNldHVwLnRva2VuID09PSAnQUInID8gMSA6IC0xO1xuICAgICAgICAgIGlmIChzZXR1cC50b2tlbiA9PT0gJ0FFJykgbWF0W2ldW2pdID0gMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBJZiB0aGUgcm9vdCBub2RlIGRvZXMgbm90IGluY2x1ZGUgYW55IHNldHVwIHByb3BlcnRpZXNcbiAgICAvLyBjaGVjayB3aGV0aGVyIGl0cyBmaXJzdCBjaGlsZCBpcyBhIHNldHVwIG5vZGUgKGkuZS4sIGEgbm9uLW1vdmUgbm9kZSlcbiAgICAvLyBhbmQgYXBwbHkgaXRzIHNldHVwIHByb3BlcnRpZXMgaW5zdGVhZFxuICAgIGlmIChzZXR1cFByb3BzLmxlbmd0aCA9PT0gMCAmJiBjdXJyZW50Tm9kZS5pc1Jvb3QoKSkge1xuICAgICAgY29uc3QgZmlyc3RDaGlsZE5vZGUgPSBjdXJyZW50Tm9kZS5jaGlsZHJlblswXTtcbiAgICAgIGlmIChcbiAgICAgICAgZmlyc3RDaGlsZE5vZGUgJiZcbiAgICAgICAgaXNTZXR1cE5vZGUoZmlyc3RDaGlsZE5vZGUpICYmXG4gICAgICAgICFpc01vdmVOb2RlKGZpcnN0Q2hpbGROb2RlKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IHNldHVwUHJvcHMgPSBmaXJzdENoaWxkTm9kZS5tb2RlbC5zZXR1cFByb3BzO1xuICAgICAgICBzZXR1cFByb3BzLmZvckVhY2goKHNldHVwOiBhbnkpID0+IHtcbiAgICAgICAgICBzZXR1cC52YWx1ZXMuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMF0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMV0pO1xuICAgICAgICAgICAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm47XG4gICAgICAgICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICAgICAgbGkgPSBpO1xuICAgICAgICAgICAgICBsaiA9IGo7XG4gICAgICAgICAgICAgIG1hdFtpXVtqXSA9IHNldHVwLnRva2VuID09PSAnQUInID8gMSA6IC0xO1xuICAgICAgICAgICAgICBpZiAoc2V0dXAudG9rZW4gPT09ICdBRScpIG1hdFtpXVtqXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENsZWFyIG51bWJlciB3aGVuIHN0b25lcyBhcmUgY2FwdHVyZWRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgaWYgKG1hdFtpXVtqXSA9PT0gMCkgbnVtTWFya3VwW2ldW2pdID0gJyc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBDYWxjdWxhdGluZyB0aGUgdmlzaWJsZSBhcmVhXG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5hbGwoKG5vZGU6IFROb2RlKSA9PiB7XG4gICAgICBjb25zdCB7bW92ZVByb3BzLCBzZXR1cFByb3BzLCByb290UHJvcHN9ID0gbm9kZS5tb2RlbDtcbiAgICAgIGlmIChzZXR1cFByb3BzLmxlbmd0aCA+IDApIHNldHVwQ291bnQgKz0gMTtcbiAgICAgIHNldHVwUHJvcHMuZm9yRWFjaCgoc2V0dXA6IGFueSkgPT4ge1xuICAgICAgICBzZXR1cC52YWx1ZXMuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzBdKTtcbiAgICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVsxXSk7XG4gICAgICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICAgIHZpc2libGVBcmVhTWF0W2ldW2pdID0gS2kuQmxhY2s7XG4gICAgICAgICAgICBpZiAoc2V0dXAudG9rZW4gPT09ICdBRScpIHZpc2libGVBcmVhTWF0W2ldW2pdID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIG1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgdmlzaWJsZUFyZWFNYXRbaV1bal0gPSBLaS5CbGFjaztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgbWFya3VwUHJvcHMgPSBjdXJyZW50Tm9kZS5tb2RlbC5tYXJrdXBQcm9wcztcbiAgbWFya3VwUHJvcHMuZm9yRWFjaCgobTogTWFya3VwUHJvcCkgPT4ge1xuICAgIGNvbnN0IHRva2VuID0gbS50b2tlbjtcbiAgICBjb25zdCB2YWx1ZXMgPSBtLnZhbHVlcztcbiAgICB2YWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVswXSk7XG4gICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVsxXSk7XG4gICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgIGlmIChpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICBsZXQgbWFyaztcbiAgICAgICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgICAgIGNhc2UgJ0NSJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuQ2lyY2xlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnU1EnOlxuICAgICAgICAgICAgbWFyayA9IE1hcmt1cC5TcXVhcmU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdUUic6XG4gICAgICAgICAgICBtYXJrID0gTWFya3VwLlRyaWFuZ2xlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnTUEnOlxuICAgICAgICAgICAgbWFyayA9IE1hcmt1cC5Dcm9zcztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIG1hcmsgPSB2YWx1ZS5zcGxpdCgnOicpWzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtYXJrdXBbaV1bal0gPSBtYXJrO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAvLyBpZiAoXG4gIC8vICAgbGkgIT09IHVuZGVmaW5lZCAmJlxuICAvLyAgIGxqICE9PSB1bmRlZmluZWQgJiZcbiAgLy8gICBsaSA+PSAwICYmXG4gIC8vICAgbGogPj0gMCAmJlxuICAvLyAgICFtYXJrdXBbbGldW2xqXVxuICAvLyApIHtcbiAgLy8gICBtYXJrdXBbbGldW2xqXSA9IE1hcmt1cC5DdXJyZW50O1xuICAvLyB9XG5cbiAgcmV0dXJuIHttYXQsIHZpc2libGVBcmVhTWF0LCBtYXJrdXAsIG51bU1hcmt1cH07XG59O1xuXG4vKipcbiAqIEZpbmRzIGEgcHJvcGVydHkgaW4gdGhlIGdpdmVuIG5vZGUgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHRva2VuLlxuICogQHBhcmFtIG5vZGUgVGhlIG5vZGUgdG8gc2VhcmNoIGZvciB0aGUgcHJvcGVydHkuXG4gKiBAcGFyYW0gdG9rZW4gVGhlIHRva2VuIG9mIHRoZSBwcm9wZXJ0eSB0byBmaW5kLlxuICogQHJldHVybnMgVGhlIGZvdW5kIHByb3BlcnR5IG9yIG51bGwgaWYgbm90IGZvdW5kLlxuICovXG5leHBvcnQgY29uc3QgZmluZFByb3AgPSAobm9kZTogVE5vZGUsIHRva2VuOiBzdHJpbmcpID0+IHtcbiAgaWYgKCFub2RlKSByZXR1cm47XG4gIGlmIChNT1ZFX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tb3ZlUHJvcHMuZmluZCgocDogTW92ZVByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzLmZpbmQoXG4gICAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgaWYgKE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubW92ZUFubm90YXRpb25Qcm9wcy5maW5kKFxuICAgICAgKHA6IE1vdmVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChST09UX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5yb290UHJvcHMuZmluZCgocDogUm9vdFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoU0VUVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLnNldHVwUHJvcHMuZmluZCgocDogU2V0dXBQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKE1BUktVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubWFya3VwUHJvcHMuZmluZCgocDogTWFya3VwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChHQU1FX0lORk9fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLmdhbWVJbmZvUHJvcHMuZmluZChcbiAgICAgIChwOiBHYW1lSW5mb1Byb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogRmluZHMgcHJvcGVydGllcyBpbiBhIGdpdmVuIG5vZGUgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHRva2VuLlxuICogQHBhcmFtIG5vZGUgLSBUaGUgbm9kZSB0byBzZWFyY2ggZm9yIHByb3BlcnRpZXMuXG4gKiBAcGFyYW0gdG9rZW4gLSBUaGUgdG9rZW4gdG8gbWF0Y2ggYWdhaW5zdCB0aGUgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHByb3BlcnRpZXMgdGhhdCBtYXRjaCB0aGUgcHJvdmlkZWQgdG9rZW4uXG4gKi9cbmV4cG9ydCBjb25zdCBmaW5kUHJvcHMgPSAobm9kZTogVE5vZGUsIHRva2VuOiBzdHJpbmcpID0+IHtcbiAgaWYgKE1PVkVfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVQcm9wcy5maWx0ZXIoKHA6IE1vdmVQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcy5maWx0ZXIoXG4gICAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgaWYgKE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubW92ZUFubm90YXRpb25Qcm9wcy5maWx0ZXIoXG4gICAgICAocDogTW92ZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgaWYgKFJPT1RfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLnJvb3RQcm9wcy5maWx0ZXIoKHA6IFJvb3RQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKFNFVFVQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5zZXR1cFByb3BzLmZpbHRlcigocDogU2V0dXBQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKE1BUktVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubWFya3VwUHJvcHMuZmlsdGVyKChwOiBNYXJrdXBQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKEdBTUVfSU5GT19QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwuZ2FtZUluZm9Qcm9wcy5maWx0ZXIoXG4gICAgICAocDogR2FtZUluZm9Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuZXhwb3J0IGNvbnN0IGdlbk1vdmUgPSAoXG4gIG5vZGU6IFROb2RlLFxuICBvblJpZ2h0OiAocGF0aDogc3RyaW5nKSA9PiB2b2lkLFxuICBvbldyb25nOiAocGF0aDogc3RyaW5nKSA9PiB2b2lkLFxuICBvblZhcmlhbnQ6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQsXG4gIG9uT2ZmUGF0aDogKHBhdGg6IHN0cmluZykgPT4gdm9pZFxuKTogVE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuICBsZXQgbmV4dE5vZGU7XG4gIGNvbnN0IGdldFBhdGggPSAobm9kZTogVE5vZGUpID0+IHtcbiAgICBjb25zdCBuZXdQYXRoID0gY29tcGFjdChcbiAgICAgIG5vZGUuZ2V0UGF0aCgpLm1hcChuID0+IG4ubW9kZWwubW92ZVByb3BzWzBdPy50b1N0cmluZygpKVxuICAgICkuam9pbignOycpO1xuICAgIHJldHVybiBuZXdQYXRoO1xuICB9O1xuXG4gIGNvbnN0IGNoZWNrUmVzdWx0ID0gKG5vZGU6IFROb2RlKSA9PiB7XG4gICAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgcGF0aCA9IGdldFBhdGgobm9kZSk7XG4gICAgaWYgKGlzUmlnaHROb2RlKG5vZGUpKSB7XG4gICAgICBpZiAob25SaWdodCkgb25SaWdodChwYXRoKTtcbiAgICB9IGVsc2UgaWYgKGlzVmFyaWFudE5vZGUobm9kZSkpIHtcbiAgICAgIGlmIChvblZhcmlhbnQpIG9uVmFyaWFudChwYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9uV3JvbmcpIG9uV3JvbmcocGF0aCk7XG4gICAgfVxuICB9O1xuXG4gIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICBjb25zdCByaWdodE5vZGVzID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKG46IFROb2RlKSA9PiBpblJpZ2h0UGF0aChuKSk7XG4gICAgY29uc3Qgd3JvbmdOb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUTm9kZSkgPT4gaW5Xcm9uZ1BhdGgobikpO1xuICAgIGNvbnN0IHZhcmlhbnROb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUTm9kZSkgPT4gaW5WYXJpYW50UGF0aChuKSk7XG5cbiAgICBuZXh0Tm9kZSA9IG5vZGU7XG5cbiAgICBpZiAoaW5SaWdodFBhdGgobm9kZSkgJiYgcmlnaHROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBuZXh0Tm9kZSA9IHNhbXBsZShyaWdodE5vZGVzKTtcbiAgICB9IGVsc2UgaWYgKGluV3JvbmdQYXRoKG5vZGUpICYmIHdyb25nTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgbmV4dE5vZGUgPSBzYW1wbGUod3JvbmdOb2Rlcyk7XG4gICAgfSBlbHNlIGlmIChpblZhcmlhbnRQYXRoKG5vZGUpICYmIHZhcmlhbnROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBuZXh0Tm9kZSA9IHNhbXBsZSh2YXJpYW50Tm9kZXMpO1xuICAgIH0gZWxzZSBpZiAoaXNSaWdodE5vZGUobm9kZSkpIHtcbiAgICAgIG9uUmlnaHQoZ2V0UGF0aChuZXh0Tm9kZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbldyb25nKGdldFBhdGgobmV4dE5vZGUpKTtcbiAgICB9XG4gICAgaWYgKG5leHROb2RlKSBjaGVja1Jlc3VsdChuZXh0Tm9kZSk7XG4gIH0gZWxzZSB7XG4gICAgY2hlY2tSZXN1bHQobm9kZSk7XG4gIH1cbiAgcmV0dXJuIG5leHROb2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RCb2FyZFNpemUgPSAobm9kZTogVE5vZGUsIGRlZmF1bHRCb2FyZFNpemUgPSAxOSkgPT4ge1xuICBjb25zdCByb290ID0gbm9kZS5nZXRQYXRoKClbMF07XG4gIGNvbnN0IHNpemUgPSBNYXRoLm1pbihcbiAgICBwYXJzZUludChTdHJpbmcoZmluZFByb3Aocm9vdCwgJ1NaJyk/LnZhbHVlIHx8IGRlZmF1bHRCb2FyZFNpemUpKSxcbiAgICBNQVhfQk9BUkRfU0laRVxuICApO1xuICByZXR1cm4gc2l6ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGaXJzdFRvTW92ZUNvbG9yRnJvbVJvb3QgPSAoXG4gIHJvb3Q6IFROb2RlIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgZGVmYXVsdE1vdmVDb2xvcjogS2kgPSBLaS5CbGFja1xuKSA9PiB7XG4gIGlmIChyb290KSB7XG4gICAgY29uc3Qgc2V0dXBOb2RlID0gcm9vdC5maXJzdChuID0+IGlzU2V0dXBOb2RlKG4pKTtcbiAgICBpZiAoc2V0dXBOb2RlKSB7XG4gICAgICBjb25zdCBmaXJzdE1vdmVOb2RlID0gc2V0dXBOb2RlLmZpcnN0KG4gPT4gaXNNb3ZlTm9kZShuKSk7XG4gICAgICBpZiAoIWZpcnN0TW92ZU5vZGUpIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xuICAgICAgcmV0dXJuIGdldE1vdmVDb2xvcihmaXJzdE1vdmVOb2RlKTtcbiAgICB9XG4gIH1cbiAgLy8gY29uc29sZS53YXJuKCdEZWZhdWx0IGZpcnN0IHRvIG1vdmUgY29sb3InLCBkZWZhdWx0TW92ZUNvbG9yKTtcbiAgcmV0dXJuIGRlZmF1bHRNb3ZlQ29sb3I7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Rmlyc3RUb01vdmVDb2xvckZyb21TZ2YgPSAoXG4gIHNnZjogc3RyaW5nLFxuICBkZWZhdWx0TW92ZUNvbG9yOiBLaSA9IEtpLkJsYWNrXG4pID0+IHtcbiAgY29uc3Qgc2dmUGFyc2VyID0gbmV3IFNnZihzZ2YpO1xuICBpZiAoc2dmUGFyc2VyLnJvb3QpXG4gICAgZ2V0Rmlyc3RUb01vdmVDb2xvckZyb21Sb290KHNnZlBhcnNlci5yb290LCBkZWZhdWx0TW92ZUNvbG9yKTtcbiAgLy8gY29uc29sZS53YXJuKCdEZWZhdWx0IGZpcnN0IHRvIG1vdmUgY29sb3InLCBkZWZhdWx0TW92ZUNvbG9yKTtcbiAgcmV0dXJuIGRlZmF1bHRNb3ZlQ29sb3I7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TW92ZUNvbG9yID0gKG5vZGU6IFROb2RlLCBkZWZhdWx0TW92ZUNvbG9yOiBLaSA9IEtpLkJsYWNrKSA9PiB7XG4gIGNvbnN0IG1vdmVQcm9wID0gbm9kZS5tb2RlbD8ubW92ZVByb3BzPy5bMF07XG4gIHN3aXRjaCAobW92ZVByb3A/LnRva2VuKSB7XG4gICAgY2FzZSAnVyc6XG4gICAgICByZXR1cm4gS2kuV2hpdGU7XG4gICAgY2FzZSAnQic6XG4gICAgICByZXR1cm4gS2kuQmxhY2s7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIGNvbnNvbGUud2FybignRGVmYXVsdCBtb3ZlIGNvbG9yIGlzJywgZGVmYXVsdE1vdmVDb2xvcik7XG4gICAgICByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbiAgfVxufTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b25lIHtcbiAgcHJvdGVjdGVkIGdsb2JhbEFscGhhID0gMTtcbiAgcHJvdGVjdGVkIHNpemUgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBwcm90ZWN0ZWQgeDogbnVtYmVyLFxuICAgIHByb3RlY3RlZCB5OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIGtpOiBudW1iZXJcbiAgKSB7fVxuICBkcmF3KCkge1xuICAgIGNvbnNvbGUubG9nKCdUQkQnKTtcbiAgfVxuXG4gIHNldEdsb2JhbEFscGhhKGFscGhhOiBudW1iZXIpIHtcbiAgICB0aGlzLmdsb2JhbEFscGhhID0gYWxwaGE7XG4gIH1cblxuICBzZXRTaXplKHNpemU6IG51bWJlcikge1xuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gIH1cbn1cbiIsImltcG9ydCBTdG9uZSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtLaSwgVGhlbWVDb250ZXh0LCBUaGVtZUNvbmZpZ30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtERUZBVUxUX1RIRU1FX0NPTE9SX0NPTkZJR30gZnJvbSAnLi4vY29uc3QnO1xuXG5leHBvcnQgY2xhc3MgRmxhdFN0b25lIGV4dGVuZHMgU3RvbmUge1xuICBwcm90ZWN0ZWQgdGhlbWVDb250ZXh0PzogVGhlbWVDb250ZXh0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAga2k6IG51bWJlcixcbiAgICB0aGVtZUNvbnRleHQ/OiBUaGVtZUNvbnRleHRcbiAgKSB7XG4gICAgc3VwZXIoY3R4LCB4LCB5LCBraSk7XG4gICAgdGhpcy50aGVtZUNvbnRleHQgPSB0aGVtZUNvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgdGhlbWUgcHJvcGVydHkgdmFsdWUgd2l0aCBmYWxsYmFja1xuICAgKi9cbiAgcHJvdGVjdGVkIGdldFRoZW1lUHJvcGVydHk8SyBleHRlbmRzIGtleW9mIFRoZW1lQ29uZmlnPihcbiAgICBrZXk6IEtcbiAgKTogVGhlbWVDb25maWdbS10ge1xuICAgIGlmICghdGhpcy50aGVtZUNvbnRleHQpIHtcbiAgICAgIHJldHVybiBERUZBVUxUX1RIRU1FX0NPTE9SX0NPTkZJR1trZXldO1xuICAgIH1cblxuICAgIGNvbnN0IHt0aGVtZSwgdGhlbWVPcHRpb25zfSA9IHRoaXMudGhlbWVDb250ZXh0O1xuICAgIGNvbnN0IHRoZW1lU3BlY2lmaWMgPSB0aGVtZU9wdGlvbnNbdGhlbWVdO1xuICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSB0aGVtZU9wdGlvbnMuZGVmYXVsdDtcblxuICAgIC8vIFRyeSB0aGVtZS1zcGVjaWZpYyB2YWx1ZSBmaXJzdCwgdGhlbiBkZWZhdWx0XG4gICAgY29uc3QgcmVzdWx0ID0gKHRoZW1lU3BlY2lmaWM/LltrZXldID8/XG4gICAgICBkZWZhdWx0Q29uZmlnW2tleV0pIGFzIFRoZW1lQ29uZmlnW0tdO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHNpemUsIGtpLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGlmIChzaXplIDw9IDApIHJldHVybjtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHguYXJjKHgsIHksIHNpemUgLyAyLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDE7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdib2FyZExpbmVDb2xvcicpO1xuICAgIGlmIChraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRCbGFja0NvbG9yJyk7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gS2kuV2hpdGUpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfVxuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBTdG9uZSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtLaX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgSW1hZ2VTdG9uZSBleHRlbmRzIFN0b25lIHtcbiAgY29uc3RydWN0b3IoXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBraTogbnVtYmVyLFxuICAgIHByaXZhdGUgbW9kOiBudW1iZXIsXG4gICAgcHJpdmF0ZSBibGFja3M6IGFueSxcbiAgICBwcml2YXRlIHdoaXRlczogYW55XG4gICkge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwga2kpO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBraSwgYmxhY2tzLCB3aGl0ZXMsIG1vZH0gPSB0aGlzO1xuICAgIGlmIChzaXplIDw9IDApIHJldHVybjtcbiAgICBsZXQgaW1nO1xuICAgIGlmIChraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIGltZyA9IGJsYWNrc1ttb2QgJSBibGFja3MubGVuZ3RoXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW1nID0gd2hpdGVzW21vZCAlIHdoaXRlcy5sZW5ndGhdO1xuICAgIH1cbiAgICBpZiAoaW1nKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKGltZywgeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtBbmFseXNpc1BvaW50VGhlbWUsIE1vdmVJbmZvLCBSb290SW5mb30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgY2FsY0FuYWx5c2lzUG9pbnRDb2xvcixcbiAgY2FsY1Njb3JlRGlmZixcbiAgY2FsY1Njb3JlRGlmZlRleHQsXG4gIG5Gb3JtYXR0ZXIsXG4gIHJvdW5kMyxcbn0gZnJvbSAnLi4vaGVscGVyJztcbmltcG9ydCB7XG4gIExJR0hUX0dSRUVOX1JHQixcbiAgTElHSFRfUkVEX1JHQixcbiAgTElHSFRfWUVMTE9XX1JHQixcbiAgWUVMTE9XX1JHQixcbn0gZnJvbSAnLi4vY29uc3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmFseXNpc1BvaW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBwcml2YXRlIHg6IG51bWJlcixcbiAgICBwcml2YXRlIHk6IG51bWJlcixcbiAgICBwcml2YXRlIHI6IG51bWJlcixcbiAgICBwcml2YXRlIHJvb3RJbmZvOiBSb290SW5mbyxcbiAgICBwcml2YXRlIG1vdmVJbmZvOiBNb3ZlSW5mbyxcbiAgICBwcml2YXRlIHRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWUgPSBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCxcbiAgICBwcml2YXRlIG91dGxpbmVDb2xvcj86IHN0cmluZ1xuICApIHt9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm8sIHRoZW1lfSA9IHRoaXM7XG4gICAgaWYgKHIgPCAwKSByZXR1cm47XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcbiAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDA7XG4gICAgY3R4LnNoYWRvd0NvbG9yID0gJyNmZmYnO1xuICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcblxuICAgIC8vIHRoaXMuZHJhd0RlZmF1bHRBbmFseXNpc1BvaW50KCk7XG4gICAgaWYgKHRoZW1lID09PSBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCkge1xuICAgICAgdGhpcy5kcmF3RGVmYXVsdEFuYWx5c2lzUG9pbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoZW1lID09PSBBbmFseXNpc1BvaW50VGhlbWUuUHJvYmxlbSkge1xuICAgICAgdGhpcy5kcmF3UHJvYmxlbUFuYWx5c2lzUG9pbnQoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3UHJvYmxlbUFuYWx5c2lzUG9pbnQgPSAoKSA9PiB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgciwgcm9vdEluZm8sIG1vdmVJbmZvLCBvdXRsaW5lQ29sb3J9ID0gdGhpcztcbiAgICBjb25zdCB7b3JkZXJ9ID0gbW92ZUluZm87XG5cbiAgICBsZXQgcENvbG9yID0gY2FsY0FuYWx5c2lzUG9pbnRDb2xvcihyb290SW5mbywgbW92ZUluZm8pO1xuXG4gICAgaWYgKG9yZGVyIDwgNSkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gMDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIHIgKiAwLjksIHgsIHksIHIpO1xuICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHBDb2xvcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45LCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwJyk7XG4gICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBjdHguZmlsbCgpO1xuICAgICAgaWYgKG91dGxpbmVDb2xvcikge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMoeCwgeSwgciwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgICBjdHgubGluZVdpZHRoID0gNDtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gb3V0bGluZUNvbG9yO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvbnRTaXplID0gciAvIDEuNTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggVGFob21hYDtcbiAgICAgIGNvbnN0IHNjb3JlVGV4dCA9IGNhbGNTY29yZURpZmZUZXh0KHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgICBjdHguZmlsbFRleHQoc2NvcmVUZXh0LCB4LCB5KTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHguZmlsbFRleHQobkZvcm1hdHRlcihtb3ZlSW5mby52aXNpdHMpLCB4LCB5ICsgciAvIDIgKyBmb250U2l6ZSAvIDgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXdDYW5kaWRhdGVQb2ludCgpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGRyYXdEZWZhdWx0QW5hbHlzaXNQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm99ID0gdGhpcztcbiAgICBjb25zdCB7b3JkZXJ9ID0gbW92ZUluZm87XG5cbiAgICBsZXQgcENvbG9yID0gY2FsY0FuYWx5c2lzUG9pbnRDb2xvcihyb290SW5mbywgbW92ZUluZm8pO1xuXG4gICAgaWYgKG9yZGVyIDwgNSkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gMDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIHIgKiAwLjksIHgsIHksIHIpO1xuICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHBDb2xvcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45LCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwJyk7XG4gICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBjdHguZmlsbCgpO1xuXG4gICAgICBjb25zdCBmb250U2l6ZSA9IHIgLyAxLjU7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemUgKiAwLjh9cHggVGFob21hYDtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICBjb25zdCB3aW5yYXRlID1cbiAgICAgICAgcm9vdEluZm8uY3VycmVudFBsYXllciA9PT0gJ0InXG4gICAgICAgICAgPyBtb3ZlSW5mby53aW5yYXRlXG4gICAgICAgICAgOiAxIC0gbW92ZUluZm8ud2lucmF0ZTtcblxuICAgICAgY3R4LmZpbGxUZXh0KHJvdW5kMyh3aW5yYXRlLCAxMDAsIDEpLCB4LCB5IC0gciAvIDIgKyBmb250U2l6ZSAvIDUpO1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplfXB4IFRhaG9tYWA7XG4gICAgICBjb25zdCBzY29yZVRleHQgPSBjYWxjU2NvcmVEaWZmVGV4dChyb290SW5mbywgbW92ZUluZm8pO1xuICAgICAgY3R4LmZpbGxUZXh0KHNjb3JlVGV4dCwgeCwgeSArIGZvbnRTaXplIC8gMyk7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemUgKiAwLjh9cHggVGFob21hYDtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgY3R4LmZpbGxUZXh0KG5Gb3JtYXR0ZXIobW92ZUluZm8udmlzaXRzKSwgeCwgeSArIHIgLyAyICsgZm9udFNpemUgLyAzKTtcblxuICAgICAgY29uc3Qgb3JkZXIgPSBtb3ZlSW5mby5vcmRlcjtcbiAgICAgIGN0eC5maWxsVGV4dCgob3JkZXIgKyAxKS50b1N0cmluZygpLCB4ICsgciwgeSAtIHIgLyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kcmF3Q2FuZGlkYXRlUG9pbnQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBkcmF3Q2FuZGlkYXRlUG9pbnQgPSAoKSA9PiB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgciwgcm9vdEluZm8sIG1vdmVJbmZvfSA9IHRoaXM7XG4gICAgY29uc3QgcENvbG9yID0gY2FsY0FuYWx5c2lzUG9pbnRDb2xvcihyb290SW5mbywgbW92ZUluZm8pO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKHgsIHksIHIgKiAwLjYsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICBjdHgubGluZVdpZHRoID0gMDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG4gICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuNCwgeCwgeSwgcik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHBDb2xvcik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuOTUsICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH07XG59XG4iLCJpbXBvcnQge1RoZW1lLCBUaGVtZVByb3BlcnR5S2V5LCBUaGVtZUNvbnRleHQsIFRoZW1lQ29uZmlnfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge0RFRkFVTFRfVEhFTUVfQ09MT1JfQ09ORklHfSBmcm9tICcuLi9jb25zdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmt1cCB7XG4gIHByb3RlY3RlZCBnbG9iYWxBbHBoYSA9IDE7XG4gIHByb3RlY3RlZCBjb2xvciA9ICcnO1xuICBwcm90ZWN0ZWQgbGluZURhc2g6IG51bWJlcltdID0gW107XG4gIHByb3RlY3RlZCB0aGVtZUNvbnRleHQ/OiBUaGVtZUNvbnRleHQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgczogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyLFxuICAgIHRoZW1lQ29udGV4dD86IFRoZW1lQ29udGV4dCxcbiAgICBwcm90ZWN0ZWQgdmFsOiBzdHJpbmcgfCBudW1iZXIgPSAnJ1xuICApIHtcbiAgICB0aGlzLnRoZW1lQ29udGV4dCA9IHRoZW1lQ29udGV4dDtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgY29uc29sZS5sb2coJ1RCRCcpO1xuICB9XG5cbiAgc2V0R2xvYmFsQWxwaGEoYWxwaGE6IG51bWJlcikge1xuICAgIHRoaXMuZ2xvYmFsQWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gIH1cblxuICBzZXRMaW5lRGFzaChsaW5lRGFzaDogbnVtYmVyW10pIHtcbiAgICB0aGlzLmxpbmVEYXNoID0gbGluZURhc2g7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgdGhlbWUgcHJvcGVydHkgdmFsdWUgd2l0aCBmYWxsYmFja1xuICAgKi9cbiAgcHJvdGVjdGVkIGdldFRoZW1lUHJvcGVydHk8SyBleHRlbmRzIGtleW9mIFRoZW1lQ29uZmlnPihcbiAgICBrZXk6IEtcbiAgKTogVGhlbWVDb25maWdbS10ge1xuICAgIGlmICghdGhpcy50aGVtZUNvbnRleHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbREVCVUddIE5vIHRoZW1lIGNvbnRleHQgZm9yIGtleTogJHtrZXl9LCB1c2luZyBkZWZhdWx0YCk7XG4gICAgICByZXR1cm4gREVGQVVMVF9USEVNRV9DT0xPUl9DT05GSUdba2V5XTtcbiAgICB9XG5cbiAgICBjb25zdCB7dGhlbWUsIHRoZW1lT3B0aW9uc30gPSB0aGlzLnRoZW1lQ29udGV4dDtcbiAgICBjb25zdCB0aGVtZVNwZWNpZmljID0gdGhlbWVPcHRpb25zW3RoZW1lXTtcbiAgICBjb25zdCBkZWZhdWx0Q29uZmlnID0gdGhlbWVPcHRpb25zLmRlZmF1bHQ7XG5cbiAgICBjb25zb2xlLmxvZyhgW0RFQlVHXSBHZXR0aW5nIHRoZW1lIHByb3BlcnR5OmAsIHtcbiAgICAgIGtleSxcbiAgICAgIHRoZW1lLFxuICAgICAgdGhlbWVTcGVjaWZpYzogdGhlbWVTcGVjaWZpYz8uW2tleV0sXG4gICAgICBkZWZhdWx0Q29uZmlnOiBkZWZhdWx0Q29uZmlnW2tleV0sXG4gICAgICBoYXNUaGVtZVNwZWNpZmljOiAhIXRoZW1lU3BlY2lmaWM/LltrZXldLFxuICAgIH0pO1xuXG4gICAgLy8gVHJ5IHRoZW1lLXNwZWNpZmljIHZhbHVlIGZpcnN0LCB0aGVuIGRlZmF1bHRcbiAgICBjb25zdCByZXN1bHQgPSAodGhlbWVTcGVjaWZpYz8uW2tleV0gPz9cbiAgICAgIGRlZmF1bHRDb25maWdba2V5XSkgYXMgVGhlbWVDb25maWdbS107XG4gICAgY29uc29sZS5sb2coYFtERUJVR10gUmVzdWx0IGZvciAke2tleX06YCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5pbXBvcnQge0tpfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBDaXJjbGVNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYSwgY29sb3J9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC42NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdtYXJrdXBMaW5lV2lkdGgnKTtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBpZiAoY29sb3IpIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIENyb3NzTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC41O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGlmIChraSA9PT0gS2kuV2hpdGUpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0V2hpdGVDb2xvcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG4gICAgICBzaXplID0gcmFkaXVzICogMC41ODtcbiAgICB9XG4gICAgY3R4Lm1vdmVUbyh4IC0gc2l6ZSwgeSAtIHNpemUpO1xuICAgIGN0eC5saW5lVG8oeCArIHNpemUsIHkgKyBzaXplKTtcbiAgICBjdHgubW92ZVRvKHggKyBzaXplLCB5IC0gc2l6ZSk7XG4gICAgY3R4LmxpbmVUbyh4IC0gc2l6ZSwgeSArIHNpemUpO1xuXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5pbXBvcnQge0tpfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBUZXh0TWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgdmFsLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHNpemUgPSBzICogMC44O1xuICAgIGxldCBmb250U2l6ZSA9IHNpemUgLyAxLjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcblxuICAgIGlmIChraSA9PT0gS2kuV2hpdGUpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRCbGFja0NvbG9yJyk7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG4gICAgfVxuICAgIC8vIGVsc2Uge1xuICAgIC8vICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgLy8gfVxuICAgIGlmICh2YWwudG9TdHJpbmcoKS5sZW5ndGggPT09IDEpIHtcbiAgICAgIGZvbnRTaXplID0gc2l6ZSAvIDEuNTtcbiAgICB9IGVsc2UgaWYgKHZhbC50b1N0cmluZygpLmxlbmd0aCA9PT0gMikge1xuICAgICAgZm9udFNpemUgPSBzaXplIC8gMS44O1xuICAgIH0gZWxzZSB7XG4gICAgICBmb250U2l6ZSA9IHNpemUgLyAyLjA7XG4gICAgfVxuICAgIGN0eC5mb250ID0gYGJvbGQgJHtmb250U2l6ZX1weCBUYWhvbWFgO1xuICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgY3R4LmZpbGxUZXh0KHZhbC50b1N0cmluZygpLCB4LCB5ICsgMik7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuaW1wb3J0IHtLaX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgU3F1YXJlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdtYXJrdXBMaW5lV2lkdGgnKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBsZXQgc2l6ZSA9IHMgKiAwLjU1O1xuICAgIGlmIChraSA9PT0gS2kuV2hpdGUpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0V2hpdGVDb2xvcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG4gICAgICBjdHgubGluZVdpZHRoID0gMztcbiAgICB9XG4gICAgY3R4LnJlY3QoeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5pbXBvcnQge0tpfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBUcmlhbmdsZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNzU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4Lm1vdmVUbyh4LCB5IC0gc2l6ZSk7XG4gICAgY3R4LmxpbmVUbyh4IC0gc2l6ZSAqIE1hdGguY29zKDAuNTIzKSwgeSArIHNpemUgKiBNYXRoLnNpbigwLjUyMykpO1xuICAgIGN0eC5saW5lVG8oeCArIHNpemUgKiBNYXRoLmNvcygwLjUyMyksIHkgKyBzaXplICogTWF0aC5zaW4oMC41MjMpKTtcblxuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ21hcmt1cExpbmVXaWR0aCcpO1xuICAgIGlmIChraSA9PT0gS2kuV2hpdGUpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0V2hpdGVDb2xvcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG4gICAgICBjdHgubGluZVdpZHRoID0gMztcbiAgICAgIHNpemUgPSByYWRpdXMgKiAwLjc7XG4gICAgfVxuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgTm9kZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGNvbG9yLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjQ7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY3R4LnNldExpbmVEYXNoKHRoaXMubGluZURhc2gpO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIEFjdGl2ZU5vZGVNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBjb2xvciwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC41O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5saW5lV2lkdGggPSA0O1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSAqIDAuNCwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtLaX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgQ2lyY2xlU29saWRNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYSwgY29sb3J9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC4yNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnbWFya3VwTGluZVdpZHRoJyk7XG4gICAgY3R4LnNldExpbmVEYXNoKHRoaXMubGluZURhc2gpO1xuICAgIGlmIChraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gS2kuV2hpdGUpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRCbGFja0NvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG4gICAgICBjdHgubGluZVdpZHRoID0gMztcbiAgICB9XG4gICAgaWYgKGNvbG9yKSBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodE1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnbWFya3VwTGluZVdpZHRoJyk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMC42O1xuICAgIGxldCBzaXplID0gcyAqIDAuNDtcbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdoaWdobGlnaHRDb2xvcicpO1xuICAgIGlmIChraSA9PT0gS2kuV2hpdGUgfHwga2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBzaXplID0gcyAqIDAuMzU7XG4gICAgfVxuICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWZmZWN0QmFzZSB7XG4gIHByb3RlY3RlZCBnbG9iYWxBbHBoYSA9IDE7XG4gIHByb3RlY3RlZCBjb2xvciA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBwcm90ZWN0ZWQgeDogbnVtYmVyLFxuICAgIHByb3RlY3RlZCB5OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHNpemU6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQga2k6IG51bWJlclxuICApIHt9XG5cbiAgcGxheSgpIHtcbiAgICBjb25zb2xlLmxvZygnVEJEJyk7XG4gIH1cbn1cbiIsImltcG9ydCBFZmZlY3RCYXNlIGZyb20gJy4vRWZmZWN0QmFzZSc7XG5pbXBvcnQge2VuY29kZX0gZnJvbSAnanMtYmFzZTY0JztcblxuY29uc3QgYmFuU3ZnID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBjbGFzcz1cImJpIGJpLWJhblwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj5cbiAgPHBhdGggZD1cIk0xNSA4YTYuOTcgNi45NyAwIDAgMC0xLjcxLTQuNTg0bC05Ljg3NCA5Ljg3NUE3IDcgMCAwIDAgMTUgOE0yLjcxIDEyLjU4NGw5Ljg3NC05Ljg3NWE3IDcgMCAwIDAtOS44NzQgOS44NzRaTTE2IDhBOCA4IDAgMSAxIDAgOGE4IDggMCAwIDEgMTYgMFwiLz5cbjwvc3ZnPmA7XG5cbmV4cG9ydCBjbGFzcyBCYW5FZmZlY3QgZXh0ZW5kcyBFZmZlY3RCYXNlIHtcbiAgcHJpdmF0ZSBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgcHJpdmF0ZSBhbHBoYSA9IDA7XG4gIHByaXZhdGUgZmFkZUluRHVyYXRpb24gPSAyMDA7XG4gIHByaXZhdGUgZmFkZU91dER1cmF0aW9uID0gMTUwO1xuICBwcml2YXRlIHN0YXlEdXJhdGlvbiA9IDQwMDtcbiAgcHJpdmF0ZSBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICBwcml2YXRlIGlzRmFkaW5nT3V0ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgc2l6ZTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwgc2l6ZSwga2kpO1xuXG4gICAgLy8gQ29udmVydCBTVkcgc3RyaW5nIHRvIGEgZGF0YSBVUkxcbiAgICBjb25zdCBzdmdCbG9iID0gbmV3IEJsb2IoW2JhblN2Z10sIHt0eXBlOiAnaW1hZ2Uvc3ZnK3htbCd9KTtcblxuICAgIGNvbnN0IHN2Z0RhdGFVcmwgPSBgZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwke2VuY29kZShiYW5TdmcpfWA7XG5cbiAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgIHRoaXMuaW1nLnNyYyA9IHN2Z0RhdGFVcmw7XG4gIH1cblxuICBwbGF5ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5pbWcuY29tcGxldGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBpbWcsIGZhZGVJbkR1cmF0aW9uLCBmYWRlT3V0RHVyYXRpb259ID0gdGhpcztcblxuICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgaWYgKCF0aGlzLnN0YXJ0VGltZSkge1xuICAgICAgdGhpcy5zdGFydFRpbWUgPSBub3c7XG4gICAgfVxuXG4gICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5hbHBoYTtcbiAgICBjdHguZHJhd0ltYWdlKGltZywgeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XG5cbiAgICBjb25zdCBlbGFwc2VkID0gbm93IC0gdGhpcy5zdGFydFRpbWU7XG5cbiAgICBpZiAoIXRoaXMuaXNGYWRpbmdPdXQpIHtcbiAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1pbihlbGFwc2VkIC8gZmFkZUluRHVyYXRpb24sIDEpO1xuICAgICAgaWYgKGVsYXBzZWQgPj0gZmFkZUluRHVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaXNGYWRpbmdPdXQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIH0sIHRoaXMuc3RheUR1cmF0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZmFkZUVsYXBzZWQgPSBub3cgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1heCgxIC0gZmFkZUVsYXBzZWQgLyBmYWRlT3V0RHVyYXRpb24sIDApO1xuICAgICAgaWYgKGZhZGVFbGFwc2VkID49IGZhZGVPdXREdXJhdGlvbikge1xuICAgICAgICB0aGlzLmFscGhhID0gMDtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wbGF5KTtcbiAgfTtcbn1cbiIsImltcG9ydCB7Y29tcGFjdH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGNhbGNWaXNpYmxlQXJlYSxcbiAgcmV2ZXJzZU9mZnNldCxcbiAgemVyb3MsXG4gIGVtcHR5LFxuICBhMVRvUG9zLFxuICBvZmZzZXRBMU1vdmUsXG4gIGNhbk1vdmUsXG59IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB7XG4gIEExX0xFVFRFUlMsXG4gIEExX05VTUJFUlMsXG4gIERFRkFVTFRfT1BUSU9OUyxcbiAgTUFYX0JPQVJEX1NJWkUsXG4gIFRIRU1FX1JFU09VUkNFUyxcbiAgREVGQVVMVF9USEVNRV9DT0xPUl9DT05GSUcsXG59IGZyb20gJy4vY29uc3QnO1xuaW1wb3J0IHtcbiAgQ3Vyc29yLFxuICBNYXJrdXAsXG4gIFRoZW1lLFxuICBLaSxcbiAgQW5hbHlzaXMsXG4gIEdob3N0QmFuT3B0aW9ucyxcbiAgR2hvc3RCYW5PcHRpb25zUGFyYW1zLFxuICBDZW50ZXIsXG4gIEFuYWx5c2lzUG9pbnRUaGVtZSxcbiAgRWZmZWN0LFxuICBUaGVtZU9wdGlvbnMsXG4gIFRoZW1lQ29uZmlnLFxuICBUaGVtZVByb3BlcnR5S2V5LFxuICBUaGVtZUNvbnRleHQsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQge0ltYWdlU3RvbmUsIEZsYXRTdG9uZX0gZnJvbSAnLi9zdG9uZXMnO1xuaW1wb3J0IEFuYWx5c2lzUG9pbnQgZnJvbSAnLi9zdG9uZXMvQW5hbHlzaXNQb2ludCc7XG5cbmltcG9ydCB7XG4gIENpcmNsZU1hcmt1cCxcbiAgQ3Jvc3NNYXJrdXAsXG4gIFRleHRNYXJrdXAsXG4gIFNxdWFyZU1hcmt1cCxcbiAgVHJpYW5nbGVNYXJrdXAsXG4gIE5vZGVNYXJrdXAsXG4gIEFjdGl2ZU5vZGVNYXJrdXAsXG4gIENpcmNsZVNvbGlkTWFya3VwLFxuICBIaWdobGlnaHRNYXJrdXAsXG59IGZyb20gJy4vbWFya3Vwcyc7XG5pbXBvcnQge0JhbkVmZmVjdH0gZnJvbSAnLi9lZmZlY3RzJztcblxuY29uc3QgaW1hZ2VzOiB7XG4gIFtrZXk6IHN0cmluZ106IEhUTUxJbWFnZUVsZW1lbnQ7XG59ID0ge307XG5cbmZ1bmN0aW9uIGlzTW9iaWxlRGV2aWNlKCkge1xuICByZXR1cm4gL01vYml8QW5kcm9pZHxpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QoXG4gICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICApO1xufVxuXG5mdW5jdGlvbiBwcmVsb2FkKHVybHM6IHN0cmluZ1tdLCBkb25lOiAoKSA9PiB2b2lkKSB7XG4gIGxldCBsb2FkZWQgPSAwO1xuICBjb25zdCBpbWFnZUxvYWRlZCA9ICgpID0+IHtcbiAgICBsb2FkZWQrKztcbiAgICBpZiAobG9hZGVkID09PSB1cmxzLmxlbmd0aCkge1xuICAgICAgZG9uZSgpO1xuICAgIH1cbiAgfTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cmxzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFpbWFnZXNbdXJsc1tpXV0pIHtcbiAgICAgIGltYWdlc1t1cmxzW2ldXSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2VzW3VybHNbaV1dLnNyYyA9IHVybHNbaV07XG4gICAgICBpbWFnZXNbdXJsc1tpXV0ub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZUxvYWRlZCgpO1xuICAgICAgfTtcbiAgICAgIGltYWdlc1t1cmxzW2ldXS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZUxvYWRlZCgpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cblxubGV0IGRwciA9IDEuMDtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLjA7XG59XG5cbmNvbnN0IERFRkFVTFRfVEhFTUVfT1BUSU9OUzogVGhlbWVPcHRpb25zID0ge1xuICBkZWZhdWx0OiBERUZBVUxUX1RIRU1FX0NPTE9SX0NPTkZJRyxcbiAgW1RoZW1lLkZsYXRdOiB7XG4gICAgYm9hcmRCYWNrZ3JvdW5kQ29sb3I6ICcjRUNCNTVBJyxcbiAgfSxcbiAgW1RoZW1lLldhcm1dOiB7XG4gICAgYm9hcmRCYWNrZ3JvdW5kQ29sb3I6ICcjQzE4QjUwJyxcbiAgfSxcbiAgW1RoZW1lLkRhcmtdOiB7XG4gICAgYWN0aXZlQ29sb3I6ICcjOUNBM0FGJyxcbiAgICBpbmFjdGl2ZUNvbG9yOiAnIzY2NjY2NicsXG4gICAgYm9hcmRMaW5lQ29sb3I6ICcjOUNBM0FGJyxcbiAgICBib2FyZEJhY2tncm91bmRDb2xvcjogJyMyQjMwMzUnLFxuICB9LFxuICBbVGhlbWUuWXVuemlNb25rZXlEYXJrXToge1xuICAgIGFjdGl2ZUNvbG9yOiAnI0ExQzlBRicsXG4gICAgaW5hY3RpdmVDb2xvcjogJyNBMUM5QUYnLFxuICAgIGJvYXJkTGluZUNvbG9yOiAnI0ExQzlBRicsXG4gICAgZmxhdEJsYWNrQ29sb3I6ICcjMEUyMDE5JyxcbiAgICBmbGF0QmxhY2tDb2xvckFsdDogJyMwMjFEMTEnLFxuICAgIGZsYXRXaGl0ZUNvbG9yOiAnI0EyQzhCNCcsXG4gICAgZmxhdFdoaXRlQ29sb3JBbHQ6ICcjQUZDQkJDJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBjbGFzcyBHaG9zdEJhbiB7XG4gIGRlZmF1bHRPcHRpb25zOiBHaG9zdEJhbk9wdGlvbnMgPSB7XG4gICAgYm9hcmRTaXplOiAxOSxcbiAgICBkeW5hbWljUGFkZGluZzogZmFsc2UsXG4gICAgcGFkZGluZzogMTAsXG4gICAgZXh0ZW50OiAzLFxuICAgIGludGVyYWN0aXZlOiBmYWxzZSxcbiAgICBjb29yZGluYXRlOiB0cnVlLFxuICAgIHRoZW1lOiBUaGVtZS5CbGFja0FuZFdoaXRlLFxuICAgIGFuYWx5c2lzUG9pbnRUaGVtZTogQW5hbHlzaXNQb2ludFRoZW1lLkRlZmF1bHQsXG4gICAgYmFja2dyb3VuZDogZmFsc2UsXG4gICAgc2hvd0FuYWx5c2lzOiBmYWxzZSxcbiAgICBhZGFwdGl2ZUJvYXJkTGluZTogdHJ1ZSxcbiAgICB0aGVtZU9wdGlvbnM6IERFRkFVTFRfVEhFTUVfT1BUSU9OUyxcbiAgICB0aGVtZVJlc291cmNlczogVEhFTUVfUkVTT1VSQ0VTLFxuICAgIG1vdmVTb3VuZDogZmFsc2UsXG4gICAgYWRhcHRpdmVTdGFyU2l6ZTogdHJ1ZSxcbiAgICBtb2JpbGVJbmRpY2F0b3JPZmZzZXQ6IDAsXG4gIH07XG4gIG9wdGlvbnM6IEdob3N0QmFuT3B0aW9ucztcbiAgZG9tOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcbiAgY2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGJvYXJkPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGFuYWx5c2lzQ2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGN1cnNvckNhbnZhcz86IEhUTUxDYW52YXNFbGVtZW50O1xuICBtYXJrdXBDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgZWZmZWN0Q2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIG1vdmVTb3VuZEF1ZGlvPzogSFRNTEF1ZGlvRWxlbWVudDtcbiAgdHVybjogS2k7XG4gIHByaXZhdGUgY3Vyc29yOiBDdXJzb3IgPSBDdXJzb3IuTm9uZTtcbiAgcHJpdmF0ZSBjdXJzb3JWYWx1ZTogc3RyaW5nID0gJyc7XG4gIHByaXZhdGUgdG91Y2hNb3ZpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSB0b3VjaFN0YXJ0UG9pbnQ6IERPTVBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gIHB1YmxpYyBjdXJzb3JQb3NpdGlvbjogW251bWJlciwgbnVtYmVyXTtcbiAgcHVibGljIGFjdHVhbEN1cnNvclBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdO1xuICBwdWJsaWMgY3Vyc29yUG9pbnQ6IERPTVBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gIHB1YmxpYyBhY3R1YWxDdXJzb3JQb2ludDogRE9NUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgcHVibGljIG1hdDogbnVtYmVyW11bXTtcbiAgcHVibGljIG1hcmt1cDogc3RyaW5nW11bXTtcbiAgcHVibGljIHZpc2libGVBcmVhTWF0OiBudW1iZXJbXVtdIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgcHJldmVudE1vdmVNYXQ6IG51bWJlcltdW107XG4gIHB1YmxpYyBlZmZlY3RNYXQ6IHN0cmluZ1tdW107XG4gIG1heGh2OiBudW1iZXI7XG4gIHRyYW5zTWF0OiBET01NYXRyaXg7XG4gIGFuYWx5c2lzOiBBbmFseXNpcyB8IG51bGw7XG4gIHZpc2libGVBcmVhOiBudW1iZXJbXVtdO1xuICBub2RlTWFya3VwU3R5bGVzOiB7XG4gICAgW2tleTogc3RyaW5nXToge1xuICAgICAgY29sb3I6IHN0cmluZztcbiAgICAgIGxpbmVEYXNoOiBudW1iZXJbXTtcbiAgICB9O1xuICB9ID0ge307XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogR2hvc3RCYW5PcHRpb25zUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLmRlZmF1bHRPcHRpb25zLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHRoZW1lT3B0aW9uczoge1xuICAgICAgICAuLi50aGlzLmRlZmF1bHRPcHRpb25zLnRoZW1lT3B0aW9ucyxcbiAgICAgICAgLi4uKG9wdGlvbnMudGhlbWVPcHRpb25zIHx8IHt9KSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCBzaXplID0gdGhpcy5vcHRpb25zLmJvYXJkU2l6ZTtcbiAgICB0aGlzLm1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy5wcmV2ZW50TW92ZU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy5tYXJrdXAgPSBlbXB0eShbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMuZWZmZWN0TWF0ID0gZW1wdHkoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLnR1cm4gPSBLaS5CbGFjaztcbiAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gWy0xLCAtMV07XG4gICAgdGhpcy5hY3R1YWxDdXJzb3JQb3NpdGlvbiA9IFstMSwgLTFdO1xuICAgIHRoaXMubWF4aHYgPSBzaXplO1xuICAgIHRoaXMudHJhbnNNYXQgPSBuZXcgRE9NTWF0cml4KCk7XG4gICAgdGhpcy5hbmFseXNpcyA9IG51bGw7XG4gICAgdGhpcy52aXNpYmxlQXJlYSA9IFtcbiAgICAgIFswLCBzaXplIC0gMV0sXG4gICAgICBbMCwgc2l6ZSAtIDFdLFxuICAgIF07XG5cbiAgICB0aGlzLnVwZGF0ZU5vZGVNYXJrdXBTdHlsZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VGhlbWVQcm9wZXJ0eTxUIGV4dGVuZHMga2V5b2YgVGhlbWVDb25maWc+KFxuICAgIHByb3BlcnR5S2V5OiBUXG4gICk6IFRoZW1lQ29uZmlnW1RdO1xuICBwcml2YXRlIGdldFRoZW1lUHJvcGVydHkocHJvcGVydHlLZXk6IFRoZW1lUHJvcGVydHlLZXkpOiBzdHJpbmcgfCBudW1iZXI7XG4gIHByaXZhdGUgZ2V0VGhlbWVQcm9wZXJ0eTxUIGV4dGVuZHMga2V5b2YgVGhlbWVDb25maWc+KFxuICAgIHByb3BlcnR5S2V5OiBUIHwgVGhlbWVQcm9wZXJ0eUtleVxuICApOiBUaGVtZUNvbmZpZ1tUXSB8IHN0cmluZyB8IG51bWJlciB7XG4gICAgY29uc3Qga2V5ID1cbiAgICAgIHR5cGVvZiBwcm9wZXJ0eUtleSA9PT0gJ3N0cmluZycgPyBwcm9wZXJ0eUtleSA6IChwcm9wZXJ0eUtleSBhcyBzdHJpbmcpO1xuICAgIGNvbnN0IGN1cnJlbnRUaGVtZSA9IHRoaXMub3B0aW9ucy50aGVtZTtcbiAgICBjb25zdCB0aGVtZUNvbmZpZyA9IHRoaXMub3B0aW9ucy50aGVtZU9wdGlvbnNbY3VycmVudFRoZW1lXSB8fCB7fTtcbiAgICBjb25zdCBkZWZhdWx0Q29uZmlnID0gdGhpcy5vcHRpb25zLnRoZW1lT3B0aW9ucy5kZWZhdWx0IHx8IHt9O1xuXG4gICAgY29uc3QgcmVzdWx0ID0gKHRoZW1lQ29uZmlnW2tleSBhcyBrZXlvZiBUaGVtZUNvbmZpZ10gfHxcbiAgICAgIGRlZmF1bHRDb25maWdba2V5IGFzIGtleW9mIFRoZW1lQ29uZmlnXSkgYXMgVGhlbWVDb25maWdbVF07XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGVtZSBjb250ZXh0IGZvciBtYXJrdXAgY29tcG9uZW50c1xuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVUaGVtZUNvbnRleHQoKTogVGhlbWVDb250ZXh0IHtcbiAgICByZXR1cm4ge1xuICAgICAgdGhlbWU6IHRoaXMub3B0aW9ucy50aGVtZSxcbiAgICAgIHRoZW1lT3B0aW9uczogdGhpcy5vcHRpb25zLnRoZW1lT3B0aW9ucyxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVOb2RlTWFya3VwU3R5bGVzKCkge1xuICAgIGNvbnN0IGRlZmF1bHREYXNoZWRMaW5lRGFzaCA9IFs4LCA2XTtcbiAgICBjb25zdCBkZWZhdWx0RG90dGVkTGluZURhc2ggPSBbNCwgNF07XG5cbiAgICB0aGlzLm5vZGVNYXJrdXBTdHlsZXMgPSB7XG4gICAgICBbTWFya3VwLlBvc2l0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmVnYXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0Tm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkRlZmF1bHROb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lldhcm5pbmdOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZURhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5Qb3NpdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZURhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsRGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdERhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5EZWZhdWx0Tm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdEYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuV2FybmluZ05vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZURvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5Qb3NpdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZURvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsRG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdERvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5EZWZhdWx0Tm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdEb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuV2FybmluZ05vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZUFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5Qb3NpdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5lZ2F0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZXV0cmFsTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5EZWZhdWx0Tm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0FjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5XYXJuaW5nTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVEYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuUG9zaXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVEYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmVnYXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbERhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZXV0cmFsTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHREYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuRGVmYXVsdE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nRGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lldhcm5pbmdOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVEb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuUG9zaXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVEb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmVnYXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbERvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZXV0cmFsTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHREb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuRGVmYXVsdE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nRG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lldhcm5pbmdOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc2V0VHVybih0dXJuOiBLaSkge1xuICAgIHRoaXMudHVybiA9IHR1cm47XG4gIH1cblxuICBzZXRCb2FyZFNpemUoc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5vcHRpb25zLmJvYXJkU2l6ZSA9IE1hdGgubWluKHNpemUsIE1BWF9CT0FSRF9TSVpFKTtcbiAgfVxuXG4gIHJlc2l6ZSgpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5jYW52YXMgfHxcbiAgICAgICF0aGlzLmN1cnNvckNhbnZhcyB8fFxuICAgICAgIXRoaXMuZG9tIHx8XG4gICAgICAhdGhpcy5ib2FyZCB8fFxuICAgICAgIXRoaXMubWFya3VwQ2FudmFzIHx8XG4gICAgICAhdGhpcy5hbmFseXNpc0NhbnZhcyB8fFxuICAgICAgIXRoaXMuZWZmZWN0Q2FudmFzXG4gICAgKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgY2FudmFzZXMgPSBbXG4gICAgICB0aGlzLmJvYXJkLFxuICAgICAgdGhpcy5jYW52YXMsXG4gICAgICB0aGlzLm1hcmt1cENhbnZhcyxcbiAgICAgIHRoaXMuY3Vyc29yQ2FudmFzLFxuICAgICAgdGhpcy5hbmFseXNpc0NhbnZhcyxcbiAgICAgIHRoaXMuZWZmZWN0Q2FudmFzLFxuICAgIF07XG5cbiAgICBjb25zdCB7c2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qge2NsaWVudFdpZHRofSA9IHRoaXMuZG9tO1xuXG4gICAgY2FudmFzZXMuZm9yRWFjaChjYW52YXMgPT4ge1xuICAgICAgaWYgKHNpemUpIHtcbiAgICAgICAgY2FudmFzLndpZHRoID0gc2l6ZSAqIGRwcjtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IHNpemUgKiBkcHI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBjbGllbnRXaWR0aCArICdweCc7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBjbGllbnRXaWR0aCArICdweCc7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gTWF0aC5mbG9vcihjbGllbnRXaWR0aCAqIGRwcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDYW52YXMoaWQ6IHN0cmluZywgcG9pbnRlckV2ZW50cyA9IHRydWUpOiBIVE1MQ2FudmFzRWxlbWVudCB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBjYW52YXMuaWQgPSBpZDtcbiAgICBpZiAoIXBvaW50ZXJFdmVudHMpIHtcbiAgICAgIGNhbnZhcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIH1cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgaW5pdChkb206IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMub3B0aW9ucy5ib2FyZFNpemU7XG4gICAgdGhpcy5tYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMubWFya3VwID0gZW1wdHkoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLnRyYW5zTWF0ID0gbmV3IERPTU1hdHJpeCgpO1xuXG4gICAgdGhpcy5ib2FyZCA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1ib2FyZCcpO1xuICAgIHRoaXMuY2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXMoJ2dob3N0YmFuLWNhbnZhcycpO1xuICAgIHRoaXMubWFya3VwQ2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXMoJ2dob3N0YmFuLW1hcmt1cCcsIGZhbHNlKTtcbiAgICB0aGlzLmN1cnNvckNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1jdXJzb3InKTtcbiAgICB0aGlzLmFuYWx5c2lzQ2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXMoJ2dob3N0YmFuLWFuYWx5c2lzJywgZmFsc2UpO1xuICAgIHRoaXMuZWZmZWN0Q2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXMoJ2dob3N0YmFuLWVmZmVjdCcsIGZhbHNlKTtcblxuICAgIHRoaXMuZG9tID0gZG9tO1xuICAgIGRvbS5pbm5lckhUTUwgPSAnJztcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5ib2FyZCk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5tYXJrdXBDYW52YXMpO1xuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmFuYWx5c2lzQ2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5jdXJzb3JDYW52YXMpO1xuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmVmZmVjdENhbnZhcyk7XG5cbiAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIHRoaXMucmVuZGVySW50ZXJhY3RpdmUoKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNldE9wdGlvbnMob3B0aW9uczogR2hvc3RCYW5PcHRpb25zUGFyYW1zKSB7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHRoZW1lT3B0aW9uczoge1xuICAgICAgICAuLi50aGlzLm9wdGlvbnMudGhlbWVPcHRpb25zLFxuICAgICAgICAuLi4ob3B0aW9ucy50aGVtZU9wdGlvbnMgfHwge30pLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlTm9kZU1hcmt1cFN0eWxlcygpO1xuICAgIHRoaXMucmVuZGVySW50ZXJhY3RpdmUoKTtcbiAgfVxuXG4gIHNldE1hdChtYXQ6IG51bWJlcltdW10pIHtcbiAgICB0aGlzLm1hdCA9IG1hdDtcbiAgICBpZiAoIXRoaXMudmlzaWJsZUFyZWFNYXQpIHtcbiAgICAgIHRoaXMudmlzaWJsZUFyZWFNYXQgPSBtYXQ7XG4gICAgfVxuICB9XG5cbiAgc2V0VmlzaWJsZUFyZWFNYXQobWF0OiBudW1iZXJbXVtdKSB7XG4gICAgdGhpcy52aXNpYmxlQXJlYU1hdCA9IG1hdDtcbiAgfVxuXG4gIHNldFByZXZlbnRNb3ZlTWF0KG1hdDogbnVtYmVyW11bXSkge1xuICAgIHRoaXMucHJldmVudE1vdmVNYXQgPSBtYXQ7XG4gIH1cblxuICBzZXRFZmZlY3RNYXQobWF0OiBzdHJpbmdbXVtdKSB7XG4gICAgdGhpcy5lZmZlY3RNYXQgPSBtYXQ7XG4gIH1cblxuICBzZXRNYXJrdXAobWFya3VwOiBzdHJpbmdbXVtdKSB7XG4gICAgdGhpcy5tYXJrdXAgPSBtYXJrdXA7XG4gIH1cblxuICBzZXRDdXJzb3IoY3Vyc29yOiBDdXJzb3IsIHZhbHVlID0gJycpIHtcbiAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgICB0aGlzLmN1cnNvclZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBzZXRDdXJzb3JXaXRoUmVuZGVyID0gKGRvbVBvaW50OiBET01Qb2ludCwgb2Zmc2V0WSA9IDApID0+IHtcbiAgICBjb25zdCB7cGFkZGluZ30gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qge3NwYWNlfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgIGNvbnN0IHBvaW50ID0gdGhpcy50cmFuc01hdC5pbnZlcnNlKCkudHJhbnNmb3JtUG9pbnQoZG9tUG9pbnQpO1xuICAgIGNvbnN0IGlkeCA9IE1hdGgucm91bmQoKHBvaW50LnggLSBwYWRkaW5nICsgc3BhY2UgLyAyKSAvIHNwYWNlKTtcbiAgICBjb25zdCBpZHkgPSBNYXRoLnJvdW5kKChwb2ludC55IC0gcGFkZGluZyArIHNwYWNlIC8gMikgLyBzcGFjZSkgKyBvZmZzZXRZO1xuICAgIGNvbnN0IHh4ID0gaWR4ICogc3BhY2U7XG4gICAgY29uc3QgeXkgPSBpZHkgKiBzcGFjZTtcbiAgICBjb25zdCBwb2ludE9uQ2FudmFzID0gbmV3IERPTVBvaW50KHh4LCB5eSk7XG4gICAgY29uc3QgcCA9IHRoaXMudHJhbnNNYXQudHJhbnNmb3JtUG9pbnQocG9pbnRPbkNhbnZhcyk7XG4gICAgdGhpcy5hY3R1YWxDdXJzb3JQb2ludCA9IHA7XG4gICAgdGhpcy5hY3R1YWxDdXJzb3JQb3NpdGlvbiA9IFtpZHggLSAxLCBpZHkgLSAxXTtcblxuICAgIGlmICh0aGlzLnByZXZlbnRNb3ZlTWF0Py5baWR4IC0gMV0/LltpZHkgLSAxXSA9PT0gMSkge1xuICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IFstMSwgLTFdO1xuICAgICAgdGhpcy5jdXJzb3JQb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICAgICAgdGhpcy5kcmF3Q3Vyc29yKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jdXJzb3JQb2ludCA9IHA7XG4gICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IFtpZHggLSAxLCBpZHkgLSAxXTtcbiAgICB0aGlzLmRyYXdDdXJzb3IoKTtcblxuICAgIGlmIChpc01vYmlsZURldmljZSgpKSB0aGlzLmRyYXdCb2FyZCgpO1xuICB9O1xuXG4gIHByaXZhdGUgb25Nb3VzZU1vdmUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgcG9pbnQgPSBuZXcgRE9NUG9pbnQoZS5vZmZzZXRYICogZHByLCBlLm9mZnNldFkgKiBkcHIpO1xuICAgIHRoaXMuc2V0Q3Vyc29yV2l0aFJlbmRlcihwb2ludCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBjYWxjVG91Y2hQb2ludCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgbGV0IHBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybiBwb2ludDtcbiAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRvdWNoZXMgPSBlLmNoYW5nZWRUb3VjaGVzO1xuICAgIHBvaW50ID0gbmV3IERPTVBvaW50KFxuICAgICAgKHRvdWNoZXNbMF0uY2xpZW50WCAtIHJlY3QubGVmdCkgKiBkcHIsXG4gICAgICAodG91Y2hlc1swXS5jbGllbnRZIC0gcmVjdC50b3ApICogZHByXG4gICAgKTtcbiAgICByZXR1cm4gcG9pbnQ7XG4gIH07XG5cbiAgcHJpdmF0ZSBvblRvdWNoU3RhcnQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy50b3VjaE1vdmluZyA9IHRydWU7XG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLmNhbGNUb3VjaFBvaW50KGUpO1xuICAgIHRoaXMudG91Y2hTdGFydFBvaW50ID0gcG9pbnQ7XG4gICAgdGhpcy5zZXRDdXJzb3JXaXRoUmVuZGVyKHBvaW50KTtcbiAgfTtcblxuICBwcml2YXRlIG9uVG91Y2hNb3ZlID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudG91Y2hNb3ZpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHBvaW50ID0gdGhpcy5jYWxjVG91Y2hQb2ludChlKTtcbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBsZXQgZGlzdGFuY2UgPSAxMDtcbiAgICBpZiAoXG4gICAgICBNYXRoLmFicyhwb2ludC54IC0gdGhpcy50b3VjaFN0YXJ0UG9pbnQueCkgPiBkaXN0YW5jZSB8fFxuICAgICAgTWF0aC5hYnMocG9pbnQueSAtIHRoaXMudG91Y2hTdGFydFBvaW50LnkpID4gZGlzdGFuY2VcbiAgICApIHtcbiAgICAgIG9mZnNldCA9IHRoaXMub3B0aW9ucy5tb2JpbGVJbmRpY2F0b3JPZmZzZXQ7XG4gICAgfVxuICAgIHRoaXMuc2V0Q3Vyc29yV2l0aFJlbmRlcihwb2ludCwgb2Zmc2V0KTtcbiAgfTtcblxuICBwcml2YXRlIG9uVG91Y2hFbmQgPSAoKSA9PiB7XG4gICAgdGhpcy50b3VjaE1vdmluZyA9IGZhbHNlO1xuICB9O1xuXG4gIHJlbmRlckludGVyYWN0aXZlKCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG5cbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kKTtcbiAgICB9XG4gIH1cblxuICBzZXRBbmFseXNpcyhhbmFseXNpczogQW5hbHlzaXMgfCBudWxsKSB7XG4gICAgdGhpcy5hbmFseXNpcyA9IGFuYWx5c2lzO1xuICAgIGlmICghYW5hbHlzaXMpIHtcbiAgICAgIHRoaXMuY2xlYXJBbmFseXNpc0NhbnZhcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dBbmFseXNpcykgdGhpcy5kcmF3QW5hbHlzaXMoYW5hbHlzaXMpO1xuICB9XG5cbiAgc2V0VGhlbWUodGhlbWU6IFRoZW1lLCBvcHRpb25zOiBQYXJ0aWFsPEdob3N0QmFuT3B0aW9uc1BhcmFtcz4gPSB7fSkge1xuICAgIGNvbnN0IHt0aGVtZVJlc291cmNlc30gPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKCF0aGVtZVJlc291cmNlc1t0aGVtZV0pIHJldHVybjtcbiAgICBjb25zdCB7Ym9hcmQsIGJsYWNrcywgd2hpdGVzfSA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXTtcbiAgICB0aGlzLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgICB0aGVtZSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB0aGVtZU9wdGlvbnM6IHtcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLnRoZW1lT3B0aW9ucyxcbiAgICAgICAgLi4uKG9wdGlvbnMudGhlbWVPcHRpb25zIHx8IHt9KSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZU5vZGVNYXJrdXBTdHlsZXMoKTtcbiAgICBwcmVsb2FkKGNvbXBhY3QoW2JvYXJkLCAuLi5ibGFja3MsIC4uLndoaXRlc10pLCAoKSA9PiB7XG4gICAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBjYWxjQ2VudGVyID0gKCk6IENlbnRlciA9PiB7XG4gICAgY29uc3Qge3Zpc2libGVBcmVhfSA9IHRoaXM7XG4gICAgY29uc3Qge2JvYXJkU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAoXG4gICAgICAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiYgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbiAgICB9XG5cbiAgICBpZiAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDApIHtcbiAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCkgcmV0dXJuIENlbnRlci5Ub3BMZWZ0O1xuICAgICAgZWxzZSBpZiAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHJldHVybiBDZW50ZXIuQm90dG9tTGVmdDtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5MZWZ0O1xuICAgIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCkgcmV0dXJuIENlbnRlci5Ub3BSaWdodDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbVJpZ2h0O1xuICAgICAgZWxzZSByZXR1cm4gQ2VudGVyLlJpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wO1xuICAgICAgZWxzZSBpZiAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHJldHVybiBDZW50ZXIuQm90dG9tO1xuICAgICAgZWxzZSByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbiAgICB9XG4gIH07XG5cbiAgY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZTogbnVtYmVyKSB7XG4gICAgY29uc3Qge2Nvb3JkaW5hdGV9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgY29uc3Qge2NhbnZhc30gPSB0aGlzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgcGFkZGluZyA9IGNhbnZhcy53aWR0aCAvICh2aXNpYmxlQXJlYVNpemUgKyAyKSAvIDI7XG4gICAgY29uc3QgcGFkZGluZ1dpdGhvdXRDb29yZGluYXRlID0gY2FudmFzLndpZHRoIC8gKHZpc2libGVBcmVhU2l6ZSArIDIpIC8gNDtcblxuICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gY29vcmRpbmF0ZSA/IHBhZGRpbmcgOiBwYWRkaW5nV2l0aG91dENvb3JkaW5hdGU7XG4gIH1cblxuICB6b29tQm9hcmQoem9vbSA9IGZhbHNlKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2FudmFzLFxuICAgICAgYW5hbHlzaXNDYW52YXMsXG4gICAgICBib2FyZCxcbiAgICAgIGN1cnNvckNhbnZhcyxcbiAgICAgIG1hcmt1cENhbnZhcyxcbiAgICAgIGVmZmVjdENhbnZhcyxcbiAgICB9ID0gdGhpcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IHtib2FyZFNpemUsIGV4dGVudCwgcGFkZGluZywgZHluYW1pY1BhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IGJvYXJkTGluZUV4dGVudCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShcbiAgICAgIFRoZW1lUHJvcGVydHlLZXkuQm9hcmRMaW5lRXh0ZW50XG4gICAgKTtcbiAgICBjb25zdCB6b29tZWRWaXNpYmxlQXJlYSA9IGNhbGNWaXNpYmxlQXJlYShcbiAgICAgIHRoaXMudmlzaWJsZUFyZWFNYXQsXG4gICAgICBleHRlbnQsXG4gICAgICBmYWxzZVxuICAgICk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGJvYXJkQ3R4ID0gYm9hcmQ/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgY3Vyc29yQ3R4ID0gY3Vyc29yQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IG1hcmt1cEN0eCA9IG1hcmt1cENhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBhbmFseXNpc0N0eCA9IGFuYWx5c2lzQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGVmZmVjdEN0eCA9IGVmZmVjdENhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCB2aXNpYmxlQXJlYSA9IHpvb21cbiAgICAgID8gem9vbWVkVmlzaWJsZUFyZWFcbiAgICAgIDogW1xuICAgICAgICAgIFswLCBib2FyZFNpemUgLSAxXSxcbiAgICAgICAgICBbMCwgYm9hcmRTaXplIC0gMV0sXG4gICAgICAgIF07XG5cbiAgICB0aGlzLnZpc2libGVBcmVhID0gdmlzaWJsZUFyZWE7XG4gICAgY29uc3QgdmlzaWJsZUFyZWFTaXplID0gTWF0aC5tYXgoXG4gICAgICB2aXNpYmxlQXJlYVswXVsxXSAtIHZpc2libGVBcmVhWzBdWzBdLFxuICAgICAgdmlzaWJsZUFyZWFbMV1bMV0gLSB2aXNpYmxlQXJlYVsxXVswXVxuICAgICk7XG5cbiAgICBpZiAoZHluYW1pY1BhZGRpbmcpIHtcbiAgICAgIHRoaXMuY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gREVGQVVMVF9PUFRJT05TLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgaWYgKHpvb20pIHtcbiAgICAgIGNvbnN0IHtzcGFjZX0gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuY2FsY0NlbnRlcigpO1xuXG4gICAgICBpZiAoZHluYW1pY1BhZGRpbmcpIHtcbiAgICAgICAgdGhpcy5jYWxjRHluYW1pY1BhZGRpbmcodmlzaWJsZUFyZWFTaXplKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gREVGQVVMVF9PUFRJT05TLnBhZGRpbmc7XG4gICAgICB9XG5cbiAgICAgIGxldCBleHRyYVZpc2libGVTaXplID0gYm9hcmRMaW5lRXh0ZW50ICogMiArIDE7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCB8fFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0XG4gICAgICApIHtcbiAgICAgICAgZXh0cmFWaXNpYmxlU2l6ZSA9IGJvYXJkTGluZUV4dGVudCArIDAuNTtcbiAgICAgIH1cbiAgICAgIGxldCB6b29tZWRCb2FyZFNpemUgPSB2aXNpYmxlQXJlYVNpemUgKyBleHRyYVZpc2libGVTaXplO1xuXG4gICAgICBpZiAoem9vbWVkQm9hcmRTaXplIDwgYm9hcmRTaXplKSB7XG4gICAgICAgIGxldCBzY2FsZSA9IChjYW52YXMud2lkdGggLSBwYWRkaW5nICogMikgLyAoem9vbWVkQm9hcmRTaXplICogc3BhY2UpO1xuXG4gICAgICAgIGxldCBvZmZzZXRYID1cbiAgICAgICAgICB2aXNpYmxlQXJlYVswXVswXSAqIHNwYWNlICogc2NhbGUgK1xuICAgICAgICAgIHBhZGRpbmcgKiBzY2FsZSAtXG4gICAgICAgICAgcGFkZGluZyAtXG4gICAgICAgICAgKHNwYWNlICogZXh0cmFWaXNpYmxlU2l6ZSAqIHNjYWxlKSAvIDIgK1xuICAgICAgICAgIChzcGFjZSAqIHNjYWxlKSAvIDI7XG5cbiAgICAgICAgbGV0IG9mZnNldFkgPVxuICAgICAgICAgIHZpc2libGVBcmVhWzFdWzBdICogc3BhY2UgKiBzY2FsZSArXG4gICAgICAgICAgcGFkZGluZyAqIHNjYWxlIC1cbiAgICAgICAgICBwYWRkaW5nIC1cbiAgICAgICAgICAoc3BhY2UgKiBleHRyYVZpc2libGVTaXplICogc2NhbGUpIC8gMiArXG4gICAgICAgICAgKHNwYWNlICogc2NhbGUpIC8gMjtcblxuICAgICAgICB0aGlzLnRyYW5zTWF0ID0gbmV3IERPTU1hdHJpeCgpO1xuICAgICAgICB0aGlzLnRyYW5zTWF0LnRyYW5zbGF0ZVNlbGYoLW9mZnNldFgsIC1vZmZzZXRZKTtcbiAgICAgICAgdGhpcy50cmFuc01hdC5zY2FsZVNlbGYoc2NhbGUsIHNjYWxlKTtcbiAgICAgICAgY3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIGJvYXJkQ3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIGFuYWx5c2lzQ3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIGN1cnNvckN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBtYXJrdXBDdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgICAgZWZmZWN0Q3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICB9XG4gIH1cblxuICBjYWxjQm9hcmRWaXNpYmxlQXJlYSh6b29tID0gZmFsc2UpIHtcbiAgICB0aGlzLnpvb21Cb2FyZCh0aGlzLm9wdGlvbnMuem9vbSk7XG4gIH1cblxuICByZXNldFRyYW5zZm9ybSgpIHtcbiAgICBjb25zdCB7XG4gICAgICBjYW52YXMsXG4gICAgICBhbmFseXNpc0NhbnZhcyxcbiAgICAgIGJvYXJkLFxuICAgICAgY3Vyc29yQ2FudmFzLFxuICAgICAgbWFya3VwQ2FudmFzLFxuICAgICAgZWZmZWN0Q2FudmFzLFxuICAgIH0gPSB0aGlzO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBib2FyZEN0eCA9IGJvYXJkPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGN1cnNvckN0eCA9IGN1cnNvckNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBtYXJrdXBDdHggPSBtYXJrdXBDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgYW5hbHlzaXNDdHggPSBhbmFseXNpc0NhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBlZmZlY3RDdHggPSBlZmZlY3RDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICBjdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgYm9hcmRDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgYW5hbHlzaXNDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgY3Vyc29yQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIG1hcmt1cEN0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICBlZmZlY3RDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hdH0gPSB0aGlzO1xuICAgIGlmICh0aGlzLm1hdCAmJiBtYXRbMF0pIHRoaXMub3B0aW9ucy5ib2FyZFNpemUgPSBtYXRbMF0ubGVuZ3RoO1xuXG4gICAgdGhpcy56b29tQm9hcmQodGhpcy5vcHRpb25zLnpvb20pO1xuICAgIHRoaXMuem9vbUJvYXJkKHRoaXMub3B0aW9ucy56b29tKTtcbiAgICB0aGlzLmNsZWFyQWxsQ2FudmFzKCk7XG4gICAgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgICB0aGlzLmRyYXdTdG9uZXMoKTtcbiAgICB0aGlzLmRyYXdNYXJrdXAoKTtcbiAgICB0aGlzLmRyYXdDdXJzb3IoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dBbmFseXNpcykgdGhpcy5kcmF3QW5hbHlzaXMoKTtcbiAgfVxuXG4gIHJlbmRlckluT25lQ2FudmFzKGNhbnZhcyA9IHRoaXMuY2FudmFzKSB7XG4gICAgdGhpcy5jbGVhckFsbENhbnZhcygpO1xuICAgIHRoaXMuZHJhd0JvYXJkKGNhbnZhcywgZmFsc2UpO1xuICAgIHRoaXMuZHJhd1N0b25lcyh0aGlzLm1hdCwgY2FudmFzLCBmYWxzZSk7XG4gICAgdGhpcy5kcmF3TWFya3VwKHRoaXMubWF0LCB0aGlzLm1hcmt1cCwgY2FudmFzLCBmYWxzZSk7XG4gIH1cblxuICBjbGVhckFsbENhbnZhcyA9ICgpID0+IHtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKHRoaXMuYm9hcmQpO1xuICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKHRoaXMubWFya3VwQ2FudmFzKTtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKHRoaXMuZWZmZWN0Q2FudmFzKTtcbiAgICB0aGlzLmNsZWFyQ3Vyc29yQ2FudmFzKCk7XG4gICAgdGhpcy5jbGVhckFuYWx5c2lzQ2FudmFzKCk7XG4gIH07XG5cbiAgY2xlYXJCb2FyZCA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuYm9hcmQpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSB0aGlzLmJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyQ2FudmFzID0gKGNhbnZhcyA9IHRoaXMuY2FudmFzKSA9PiB7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyTWFya3VwQ2FudmFzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5tYXJrdXBDYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSB0aGlzLm1hcmt1cENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLm1hcmt1cENhbnZhcy53aWR0aCwgdGhpcy5tYXJrdXBDYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyQ3Vyc29yQ2FudmFzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5jdXJzb3JDYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBzaXplID0gdGhpcy5vcHRpb25zLmJvYXJkU2l6ZTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN1cnNvckNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmN1cnNvckNhbnZhcy53aWR0aCwgdGhpcy5jdXJzb3JDYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyQW5hbHlzaXNDYW52YXMgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmFuYWx5c2lzQ2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gdGhpcy5hbmFseXNpc0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdChcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGhpcy5hbmFseXNpc0NhbnZhcy53aWR0aCxcbiAgICAgICAgdGhpcy5hbmFseXNpc0NhbnZhcy5oZWlnaHRcbiAgICAgICk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBkcmF3QW5hbHlzaXMgPSAoYW5hbHlzaXMgPSB0aGlzLmFuYWx5c2lzKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5hbmFseXNpc0NhbnZhcztcbiAgICBjb25zdCB7XG4gICAgICB0aGVtZSA9IFRoZW1lLkJsYWNrQW5kV2hpdGUsXG4gICAgICBhbmFseXNpc1BvaW50VGhlbWUsXG4gICAgICBib2FyZFNpemUsXG4gICAgICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplLFxuICAgIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qge21hdCwgbWFya3VwfSA9IHRoaXM7XG4gICAgaWYgKCFjYW52YXMgfHwgIWFuYWx5c2lzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKCFjdHgpIHJldHVybjtcbiAgICB0aGlzLmNsZWFyQW5hbHlzaXNDYW52YXMoKTtcbiAgICBjb25zdCB7cm9vdEluZm99ID0gYW5hbHlzaXM7XG5cbiAgICBhbmFseXNpcy5tb3ZlSW5mb3MuZm9yRWFjaChtID0+IHtcbiAgICAgIGlmIChtLm1vdmUgPT09ICdwYXNzJykgcmV0dXJuO1xuICAgICAgY29uc3QgaWRPYmogPSBKU09OLnBhcnNlKGFuYWx5c2lzLmlkKTtcbiAgICAgIGxldCBhbmFseXNpc0JvYXJkU2l6ZSA9IGJvYXJkU2l6ZTtcbiAgICAgIGNvbnN0IG9mZnNldGVkTW92ZSA9IG9mZnNldEExTW92ZShcbiAgICAgICAgbS5tb3ZlLFxuICAgICAgICAwLFxuICAgICAgICBhbmFseXNpc0JvYXJkU2l6ZSAtIGlkT2JqLmJ5XG4gICAgICApO1xuICAgICAgbGV0IHt4OiBpLCB5OiBqfSA9IGExVG9Qb3Mob2Zmc2V0ZWRNb3ZlKTtcbiAgICAgIGlmIChtYXRbaV1bal0gIT09IDApIHJldHVybjtcbiAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgY29uc3QgeSA9IHNjYWxlZFBhZGRpbmcgKyBqICogc3BhY2U7XG4gICAgICBjb25zdCByYXRpbyA9IDAuNDY7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgaWYgKFxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuU3ViZHVlZCAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuQmxhY2tBbmRXaGl0ZSAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRmxhdCAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuV2FybSAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRGFya1xuICAgICAgKSB7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMztcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAzO1xuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5TaGFkb3dDb2xvcik7XG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gODtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAwO1xuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSAnI2ZmZic7XG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcbiAgICAgIH1cblxuICAgICAgbGV0IG91dGxpbmVDb2xvcjtcbiAgICAgIGlmIChtYXJrdXBbaV1bal0uaW5jbHVkZXMoTWFya3VwLlBvc2l0aXZlTm9kZSkpIHtcbiAgICAgICAgb3V0bGluZUNvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFxuICAgICAgICAgIFRoZW1lUHJvcGVydHlLZXkuUG9zaXRpdmVOb2RlQ29sb3JcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1hcmt1cFtpXVtqXS5pbmNsdWRlcyhNYXJrdXAuTmVnYXRpdmVOb2RlKSkge1xuICAgICAgICBvdXRsaW5lQ29sb3IgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICAgICAgVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAobWFya3VwW2ldW2pdLmluY2x1ZGVzKE1hcmt1cC5OZXV0cmFsTm9kZSkpIHtcbiAgICAgICAgb3V0bGluZUNvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBvaW50ID0gbmV3IEFuYWx5c2lzUG9pbnQoXG4gICAgICAgIGN0eCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgc3BhY2UgKiByYXRpbyxcbiAgICAgICAgcm9vdEluZm8sXG4gICAgICAgIG0sXG4gICAgICAgIGFuYWx5c2lzUG9pbnRUaGVtZSxcbiAgICAgICAgb3V0bGluZUNvbG9yXG4gICAgICApO1xuICAgICAgcG9pbnQuZHJhdygpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9KTtcbiAgfTtcblxuICBkcmF3TWFya3VwID0gKFxuICAgIG1hdCA9IHRoaXMubWF0LFxuICAgIG1hcmt1cCA9IHRoaXMubWFya3VwLFxuICAgIG1hcmt1cENhbnZhcyA9IHRoaXMubWFya3VwQ2FudmFzLFxuICAgIGNsZWFyID0gdHJ1ZVxuICApID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBtYXJrdXBDYW52YXM7XG4gICAgY29uc3Qge3RoZW1lfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoY2FudmFzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3VwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWFya3VwW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gbWFya3VwW2ldW2pdO1xuICAgICAgICAgIHZhbHVlcz8uc3BsaXQoJ3wnKS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgICAgICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3QgeSA9IHNjYWxlZFBhZGRpbmcgKyBqICogc3BhY2U7XG4gICAgICAgICAgICAgIGNvbnN0IGtpID0gbWF0W2ldW2pdO1xuICAgICAgICAgICAgICBsZXQgbWFya3VwO1xuICAgICAgICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuQ2lyY2xlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBDaXJjbGVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuQ3VycmVudDoge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgQ2lyY2xlU29saWRNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEYXNoZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEYXNoZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0FjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0RGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHREb3R0ZWRBY3RpdmVOb2RlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7Y29sb3IsIGxpbmVEYXNofSA9IHRoaXMubm9kZU1hcmt1cFN0eWxlc1t2YWx1ZV07XG5cbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IEFjdGl2ZU5vZGVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpLFxuICAgICAgICAgICAgICAgICAgICAgIE1hcmt1cC5DaXJjbGVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwLnNldExpbmVEYXNoKGxpbmVEYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZURhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZURvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZWdhdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZWdhdGl2ZURhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZWdhdGl2ZURvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxEYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbERvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdEYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0RvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0Tm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHREYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdERvdHRlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Ob2RlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7Y29sb3IsIGxpbmVEYXNofSA9IHRoaXMubm9kZU1hcmt1cFN0eWxlc1t2YWx1ZV07XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBOb2RlTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgICBNYXJrdXAuQ2lyY2xlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRMaW5lRGFzaChsaW5lRGFzaCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuU3F1YXJlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBTcXVhcmVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuVHJpYW5nbGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IFRyaWFuZ2xlTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkNyb3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBDcm9zc01hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5IaWdobGlnaHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IEhpZ2hsaWdodE1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgVGV4dE1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1hcmt1cD8uZHJhdygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZHJhd0JvYXJkID0gKGJvYXJkID0gdGhpcy5ib2FyZCwgY2xlYXIgPSB0cnVlKSA9PiB7XG4gICAgaWYgKGNsZWFyKSB0aGlzLmNsZWFyQ2FudmFzKGJvYXJkKTtcbiAgICB0aGlzLmRyYXdCYW4oYm9hcmQpO1xuICAgIHRoaXMuZHJhd0JvYXJkTGluZShib2FyZCk7XG4gICAgdGhpcy5kcmF3U3RhcnMoYm9hcmQpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29vcmRpbmF0ZSkge1xuICAgICAgdGhpcy5kcmF3Q29vcmRpbmF0ZSgpO1xuICAgIH1cbiAgfTtcblxuICBkcmF3QmFuID0gKGJvYXJkID0gdGhpcy5ib2FyZCkgPT4ge1xuICAgIGNvbnN0IHt0aGVtZSwgdGhlbWVSZXNvdXJjZXMsIHBhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgIGlmIChib2FyZCkge1xuICAgICAgYm9hcmQuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzJweCc7XG4gICAgICBjb25zdCBjdHggPSBib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgaWYgKGN0eCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgfHxcbiAgICAgICAgICB0aGVtZSA9PT0gVGhlbWUuRmxhdCB8fFxuICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5XYXJtIHx8XG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkRhcmtcbiAgICAgICAgKSB7XG4gICAgICAgICAgYm9hcmQuc3R5bGUuYm94U2hhZG93ID1cbiAgICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5CbGFja0FuZFdoaXRlID8gJzBweCAwcHggMHB4ICMwMDAwMDAnIDogJyc7XG5cbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFxuICAgICAgICAgICAgVGhlbWVQcm9wZXJ0eUtleS5Cb2FyZEJhY2tncm91bmRDb2xvclxuICAgICAgICAgICk7XG4gICAgICAgICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICAgICAgLXBhZGRpbmcsXG4gICAgICAgICAgICAtcGFkZGluZyxcbiAgICAgICAgICAgIGJvYXJkLndpZHRoICsgcGFkZGluZyxcbiAgICAgICAgICAgIGJvYXJkLmhlaWdodCArIHBhZGRpbmdcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5XYWxudXQgJiZcbiAgICAgICAgICB0aGVtZVJlc291cmNlc1t0aGVtZV0uYm9hcmQgIT09IHVuZGVmaW5lZFxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCBib2FyZFVybCA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXS5ib2FyZCB8fCAnJztcbiAgICAgICAgICBjb25zdCBib2FyZFJlcyA9IGltYWdlc1tib2FyZFVybF07XG4gICAgICAgICAgaWYgKGJvYXJkUmVzKSB7XG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgICBib2FyZFJlcyxcbiAgICAgICAgICAgICAgLXBhZGRpbmcsXG4gICAgICAgICAgICAgIC1wYWRkaW5nLFxuICAgICAgICAgICAgICBib2FyZC53aWR0aCArIHBhZGRpbmcsXG4gICAgICAgICAgICAgIGJvYXJkLmhlaWdodCArIHBhZGRpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5ZdW56aU1vbmtleURhcmsgJiZcbiAgICAgICAgICB0aGVtZVJlc291cmNlc1t0aGVtZV0uYm9hcmQgIT09IHVuZGVmaW5lZFxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCBib2FyZFVybCA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXS5ib2FyZCB8fCAnJztcbiAgICAgICAgICBjb25zdCBib2FyZFJlcyA9IGltYWdlc1tib2FyZFVybF07XG4gICAgICAgICAgaWYgKGJvYXJkUmVzKSB7XG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgICBib2FyZFJlcyxcbiAgICAgICAgICAgICAgLXBhZGRpbmcsXG4gICAgICAgICAgICAgIC1wYWRkaW5nLFxuICAgICAgICAgICAgICBib2FyZC53aWR0aCArIHBhZGRpbmcsXG4gICAgICAgICAgICAgIGJvYXJkLmhlaWdodCArIHBhZGRpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGJvYXJkVXJsID0gdGhlbWVSZXNvdXJjZXNbdGhlbWVdLmJvYXJkIHx8ICcnO1xuICAgICAgICAgIGNvbnN0IGltYWdlID0gaW1hZ2VzW2JvYXJkVXJsXTtcbiAgICAgICAgICBpZiAoaW1hZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdHRlcm4gPSBjdHguY3JlYXRlUGF0dGVybihpbWFnZSwgJ3JlcGVhdCcpO1xuICAgICAgICAgICAgaWYgKHBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHBhdHRlcm47XG4gICAgICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCBib2FyZC53aWR0aCwgYm9hcmQuaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZHJhd0JvYXJkTGluZSA9IChib2FyZCA9IHRoaXMuYm9hcmQpID0+IHtcbiAgICBpZiAoIWJvYXJkKSByZXR1cm47XG4gICAgY29uc3Qge3Zpc2libGVBcmVhLCBvcHRpb25zLCBtYXQsIHByZXZlbnRNb3ZlTWF0LCBjdXJzb3JQb3NpdGlvbn0gPSB0aGlzO1xuICAgIGNvbnN0IHt6b29tLCBib2FyZFNpemUsIGFkYXB0aXZlQm9hcmRMaW5lLCB0aGVtZX0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGJvYXJkTGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFxuICAgICAgVGhlbWVQcm9wZXJ0eUtleS5Cb2FyZExpbmVXaWR0aFxuICAgICk7XG4gICAgY29uc3QgYm9hcmRFZGdlTGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFxuICAgICAgVGhlbWVQcm9wZXJ0eUtleS5Cb2FyZEVkZ2VMaW5lV2lkdGhcbiAgICApO1xuICAgIGNvbnN0IGJvYXJkTGluZUV4dGVudCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShcbiAgICAgIFRoZW1lUHJvcGVydHlLZXkuQm9hcmRMaW5lRXh0ZW50XG4gICAgKTtcbiAgICBjb25zdCBjdHggPSBib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcblxuICAgICAgY29uc3QgZXh0ZW5kU3BhY2UgPSB6b29tID8gYm9hcmRMaW5lRXh0ZW50ICogc3BhY2UgOiAwO1xuICAgICAgbGV0IGFjdGl2ZUNvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuQWN0aXZlQ29sb3IpO1xuICAgICAgbGV0IGluYWN0aXZlQ29sb3IgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5JbmFjdGl2ZUNvbG9yKTtcblxuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkJvYXJkTGluZUNvbG9yKTtcblxuICAgICAgY29uc3QgYWRhcHRpdmVGYWN0b3IgPSAwLjAwMTtcbiAgICAgIGNvbnN0IHRvdWNoaW5nRmFjdG9yID0gMi41O1xuICAgICAgbGV0IGVkZ2VMaW5lV2lkdGggPSBhZGFwdGl2ZUJvYXJkTGluZVxuICAgICAgICA/IGJvYXJkLndpZHRoICogYWRhcHRpdmVGYWN0b3IgKiAyXG4gICAgICAgIDogYm9hcmRFZGdlTGluZVdpZHRoO1xuXG4gICAgICBsZXQgbGluZVdpZHRoID0gYWRhcHRpdmVCb2FyZExpbmVcbiAgICAgICAgPyBib2FyZC53aWR0aCAqIGFkYXB0aXZlRmFjdG9yXG4gICAgICAgIDogYm9hcmRMaW5lV2lkdGg7XG5cbiAgICAgIGNvbnN0IGFsbG93TW92ZSA9XG4gICAgICAgIGNhbk1vdmUobWF0LCBjdXJzb3JQb3NpdGlvblswXSwgY3Vyc29yUG9zaXRpb25bMV0sIHRoaXMudHVybikgJiZcbiAgICAgICAgcHJldmVudE1vdmVNYXRbY3Vyc29yUG9zaXRpb25bMF1dW2N1cnNvclBvc2l0aW9uWzFdXSA9PT0gMDtcblxuICAgICAgZm9yIChsZXQgaSA9IHZpc2libGVBcmVhWzBdWzBdOyBpIDw9IHZpc2libGVBcmVhWzBdWzFdOyBpKyspIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKHZpc2libGVBcmVhWzBdWzBdID09PSAwICYmIGkgPT09IDApIHx8XG4gICAgICAgICAgKHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxICYmIGkgPT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBlZGdlTGluZVdpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGlzTW9iaWxlRGV2aWNlKCkgJiZcbiAgICAgICAgICBpID09PSB0aGlzLmN1cnNvclBvc2l0aW9uWzBdICYmXG4gICAgICAgICAgdGhpcy50b3VjaE1vdmluZ1xuICAgICAgICApIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gY3R4LmxpbmVXaWR0aCAqIHRvdWNoaW5nRmFjdG9yO1xuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGFsbG93TW92ZSA/IGFjdGl2ZUNvbG9yIDogaW5hY3RpdmVDb2xvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBhY3RpdmVDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3RhcnRQb2ludFkgPVxuICAgICAgICAgIGkgPT09IDAgfHwgaSA9PT0gYm9hcmRTaXplIC0gMVxuICAgICAgICAgICAgPyBzY2FsZWRQYWRkaW5nICsgdmlzaWJsZUFyZWFbMV1bMF0gKiBzcGFjZSAtIGVkZ2VMaW5lV2lkdGggLyAyXG4gICAgICAgICAgICA6IHNjYWxlZFBhZGRpbmcgKyB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlO1xuICAgICAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgIHN0YXJ0UG9pbnRZICs9IGRwciAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVuZFBvaW50WSA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNwYWNlICogdmlzaWJsZUFyZWFbMV1bMV0gKyBzY2FsZWRQYWRkaW5nICsgZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc3BhY2UgKiB2aXNpYmxlQXJlYVsxXVsxXSArIHNjYWxlZFBhZGRpbmc7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgZW5kUG9pbnRZIC09IGRwciAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzFdWzBdID4gMCkgc3RhcnRQb2ludFkgLT0gZXh0ZW5kU3BhY2U7XG4gICAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVsxXSA8IGJvYXJkU2l6ZSAtIDEpIGVuZFBvaW50WSArPSBleHRlbmRTcGFjZTtcbiAgICAgICAgY3R4Lm1vdmVUbyhpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nLCBzdGFydFBvaW50WSk7XG4gICAgICAgIGN0eC5saW5lVG8oaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZywgZW5kUG9pbnRZKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gdmlzaWJsZUFyZWFbMV1bMF07IGkgPD0gdmlzaWJsZUFyZWFbMV1bMV07IGkrKykge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDAgJiYgaSA9PT0gMCkgfHxcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEgJiYgaSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGVkZ2VMaW5lV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNNb2JpbGVEZXZpY2UoKSAmJlxuICAgICAgICAgIGkgPT09IHRoaXMuY3Vyc29yUG9zaXRpb25bMV0gJiZcbiAgICAgICAgICB0aGlzLnRvdWNoTW92aW5nXG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBjdHgubGluZVdpZHRoICogdG91Y2hpbmdGYWN0b3I7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYWxsb3dNb3ZlID8gYWN0aXZlQ29sb3IgOiBpbmFjdGl2ZUNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGFjdGl2ZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdGFydFBvaW50WCA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNjYWxlZFBhZGRpbmcgKyB2aXNpYmxlQXJlYVswXVswXSAqIHNwYWNlIC0gZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzBdWzBdICogc3BhY2U7XG4gICAgICAgIGxldCBlbmRQb2ludFggPVxuICAgICAgICAgIGkgPT09IDAgfHwgaSA9PT0gYm9hcmRTaXplIC0gMVxuICAgICAgICAgICAgPyBzcGFjZSAqIHZpc2libGVBcmVhWzBdWzFdICsgc2NhbGVkUGFkZGluZyArIGVkZ2VMaW5lV2lkdGggLyAyXG4gICAgICAgICAgICA6IHNwYWNlICogdmlzaWJsZUFyZWFbMF1bMV0gKyBzY2FsZWRQYWRkaW5nO1xuICAgICAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgIHN0YXJ0UG9pbnRYICs9IGRwciAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICBlbmRQb2ludFggLT0gZHByIC8gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2aXNpYmxlQXJlYVswXVswXSA+IDApIHN0YXJ0UG9pbnRYIC09IGV4dGVuZFNwYWNlO1xuICAgICAgICBpZiAodmlzaWJsZUFyZWFbMF1bMV0gPCBib2FyZFNpemUgLSAxKSBlbmRQb2ludFggKz0gZXh0ZW5kU3BhY2U7XG4gICAgICAgIGN0eC5tb3ZlVG8oc3RhcnRQb2ludFgsIGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcpO1xuICAgICAgICBjdHgubGluZVRvKGVuZFBvaW50WCwgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZHJhd1N0YXJzID0gKGJvYXJkID0gdGhpcy5ib2FyZCkgPT4ge1xuICAgIGlmICghYm9hcmQpIHJldHVybjtcbiAgICBpZiAodGhpcy5vcHRpb25zLmJvYXJkU2l6ZSAhPT0gMTkpIHJldHVybjtcblxuICAgIGxldCB7YWRhcHRpdmVTdGFyU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qgc3RhclNpemVPcHRpb25zID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuU3RhclNpemUpO1xuXG4gICAgY29uc3QgdmlzaWJsZUFyZWEgPSB0aGlzLnZpc2libGVBcmVhO1xuICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgbGV0IHN0YXJTaXplID0gYWRhcHRpdmVTdGFyU2l6ZSA/IGJvYXJkLndpZHRoICogMC4wMDM1IDogc3RhclNpemVPcHRpb25zO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIFszLCA5LCAxNV0uZm9yRWFjaChpID0+IHtcbiAgICAgICAgWzMsIDksIDE1XS5mb3JFYWNoKGogPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGkgPj0gdmlzaWJsZUFyZWFbMF1bMF0gJiZcbiAgICAgICAgICAgIGkgPD0gdmlzaWJsZUFyZWFbMF1bMV0gJiZcbiAgICAgICAgICAgIGogPj0gdmlzaWJsZUFyZWFbMV1bMF0gJiZcbiAgICAgICAgICAgIGogPD0gdmlzaWJsZUFyZWFbMV1bMV1cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5hcmMoXG4gICAgICAgICAgICAgIGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcsXG4gICAgICAgICAgICAgIGogKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcsXG4gICAgICAgICAgICAgIHN0YXJTaXplLFxuICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAyICogTWF0aC5QSSxcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgZHJhd0Nvb3JkaW5hdGUgPSAoKSA9PiB7XG4gICAgY29uc3Qge2JvYXJkLCBvcHRpb25zLCB2aXNpYmxlQXJlYX0gPSB0aGlzO1xuICAgIGlmICghYm9hcmQpIHJldHVybjtcbiAgICBjb25zdCB7Ym9hcmRTaXplLCB6b29tLCBwYWRkaW5nLCB0aGVtZX0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGJvYXJkTGluZUV4dGVudCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lRXh0ZW50Jyk7XG4gICAgbGV0IHpvb21lZEJvYXJkU2l6ZSA9IHZpc2libGVBcmVhWzBdWzFdIC0gdmlzaWJsZUFyZWFbMF1bMF0gKyAxO1xuICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG5cbiAgICAgIGN0eC5mb250ID0gYGJvbGQgJHtzcGFjZSAvIDN9cHggSGVsdmV0aWNhYDtcblxuICAgICAgY29uc3QgY2VudGVyID0gdGhpcy5jYWxjQ2VudGVyKCk7XG4gICAgICBsZXQgb2Zmc2V0ID0gc3BhY2UgLyAxLjU7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQ2VudGVyICYmXG4gICAgICAgIHZpc2libGVBcmVhWzBdWzBdID09PSAwICYmXG4gICAgICAgIHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxXG4gICAgICApIHtcbiAgICAgICAgb2Zmc2V0IC09IHNjYWxlZFBhZGRpbmcgLyAyO1xuICAgICAgfVxuXG4gICAgICBBMV9MRVRURVJTLmZvckVhY2goKGwsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHggPSBzcGFjZSAqIGluZGV4ICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgbGV0IG9mZnNldFRvcCA9IG9mZnNldDtcbiAgICAgICAgbGV0IG9mZnNldEJvdHRvbSA9IG9mZnNldDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFxuICAgICAgICApIHtcbiAgICAgICAgICBvZmZzZXRUb3AgLT0gc3BhY2UgKiBib2FyZExpbmVFeHRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVxuICAgICAgICApIHtcbiAgICAgICAgICBvZmZzZXRCb3R0b20gLT0gKHNwYWNlICogYm9hcmRMaW5lRXh0ZW50KSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHkxID0gdmlzaWJsZUFyZWFbMV1bMF0gKiBzcGFjZSArIHBhZGRpbmcgLSBvZmZzZXRUb3A7XG4gICAgICAgIGxldCB5MiA9IHkxICsgem9vbWVkQm9hcmRTaXplICogc3BhY2UgKyBvZmZzZXRCb3R0b20gKiAyO1xuICAgICAgICBpZiAoaW5kZXggPj0gdmlzaWJsZUFyZWFbMF1bMF0gJiYgaW5kZXggPD0gdmlzaWJsZUFyZWFbMF1bMV0pIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21MZWZ0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21SaWdodCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuQm90dG9tXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobCwgeCwgeTEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcFJpZ2h0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLCB4LCB5Mik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgQTFfTlVNQkVSUy5zbGljZSgtdGhpcy5vcHRpb25zLmJvYXJkU2l6ZSkuZm9yRWFjaCgobDogbnVtYmVyLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCB5ID0gc3BhY2UgKiBpbmRleCArIHNjYWxlZFBhZGRpbmc7XG4gICAgICAgIGxldCBvZmZzZXRMZWZ0ID0gb2Zmc2V0O1xuICAgICAgICBsZXQgb2Zmc2V0UmlnaHQgPSBvZmZzZXQ7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2Zmc2V0TGVmdCAtPSBzcGFjZSAqIGJvYXJkTGluZUV4dGVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlJpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldFJpZ2h0IC09IChzcGFjZSAqIGJvYXJkTGluZUV4dGVudCkgLyAyO1xuICAgICAgICB9XG4gICAgICAgIGxldCB4MSA9IHZpc2libGVBcmVhWzBdWzBdICogc3BhY2UgKyBwYWRkaW5nIC0gb2Zmc2V0TGVmdDtcbiAgICAgICAgbGV0IHgyID0geDEgKyB6b29tZWRCb2FyZFNpemUgKiBzcGFjZSArIDIgKiBvZmZzZXRSaWdodDtcbiAgICAgICAgaWYgKGluZGV4ID49IHZpc2libGVBcmVhWzFdWzBdICYmIGluZGV4IDw9IHZpc2libGVBcmVhWzFdWzFdKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbVJpZ2h0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5SaWdodFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGwudG9TdHJpbmcoKSwgeDEsIHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BMZWZ0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21MZWZ0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5MZWZ0XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobC50b1N0cmluZygpLCB4MiwgeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgY2FsY1NwYWNlQW5kUGFkZGluZyA9IChjYW52YXMgPSB0aGlzLmNhbnZhcykgPT4ge1xuICAgIGxldCBzcGFjZSA9IDA7XG4gICAgbGV0IHNjYWxlZFBhZGRpbmcgPSAwO1xuICAgIGxldCBzY2FsZWRCb2FyZEV4dGVudCA9IDA7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgY29uc3Qge3BhZGRpbmcsIGJvYXJkU2l6ZSwgem9vbX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBjb25zdCBib2FyZExpbmVFeHRlbnQgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUV4dGVudCcpO1xuICAgICAgY29uc3Qge3Zpc2libGVBcmVhfSA9IHRoaXM7XG5cbiAgICAgIGlmIChcbiAgICAgICAgKHZpc2libGVBcmVhWzBdWzBdICE9PSAwICYmIHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAodmlzaWJsZUFyZWFbMV1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgICApIHtcbiAgICAgICAgc2NhbGVkQm9hcmRFeHRlbnQgPSBib2FyZExpbmVFeHRlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgICh2aXNpYmxlQXJlYVswXVswXSAhPT0gMCAmJiB2aXNpYmxlQXJlYVswXVsxXSAhPT0gYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgKHZpc2libGVBcmVhWzFdWzBdICE9PSAwICYmIHZpc2libGVBcmVhWzFdWzFdICE9PSBib2FyZFNpemUgLSAxKVxuICAgICAgKSB7XG4gICAgICAgIHNjYWxlZEJvYXJkRXh0ZW50ID0gYm9hcmRMaW5lRXh0ZW50ICogMjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGl2aXNvciA9IHpvb20gPyBib2FyZFNpemUgKyBzY2FsZWRCb2FyZEV4dGVudCA6IGJvYXJkU2l6ZTtcbiAgICAgIHNwYWNlID0gKGNhbnZhcy53aWR0aCAtIHBhZGRpbmcgKiAyKSAvIE1hdGguY2VpbChkaXZpc29yKTtcbiAgICAgIHNjYWxlZFBhZGRpbmcgPSBwYWRkaW5nICsgc3BhY2UgLyAyO1xuICAgIH1cbiAgICByZXR1cm4ge3NwYWNlLCBzY2FsZWRQYWRkaW5nLCBzY2FsZWRCb2FyZEV4dGVudH07XG4gIH07XG5cbiAgcGxheUVmZmVjdCA9IChtYXQgPSB0aGlzLm1hdCwgZWZmZWN0TWF0ID0gdGhpcy5lZmZlY3RNYXQsIGNsZWFyID0gdHJ1ZSkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuZWZmZWN0Q2FudmFzO1xuXG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgaWYgKGNsZWFyKSB0aGlzLmNsZWFyQ2FudmFzKGNhbnZhcyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVmZmVjdE1hdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVmZmVjdE1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gZWZmZWN0TWF0W2ldW2pdO1xuICAgICAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgICAgICBjb25zdCB5ID0gc2NhbGVkUGFkZGluZyArIGogKiBzcGFjZTtcbiAgICAgICAgICBjb25zdCBraSA9IG1hdFtpXVtqXTtcbiAgICAgICAgICBsZXQgZWZmZWN0O1xuICAgICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgICAgICBjYXNlIEVmZmVjdC5CYW46IHtcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSBuZXcgQmFuRWZmZWN0KGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICAgICAgICBlZmZlY3QucGxheSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlZmZlY3RNYXRbaV1bal0gPSBFZmZlY3QuTm9uZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHtib2FyZFNpemV9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgdGhpcy5zZXRFZmZlY3RNYXQoZW1wdHkoW2JvYXJkU2l6ZSwgYm9hcmRTaXplXSkpO1xuICAgIH1cbiAgfTtcblxuICBkcmF3Q3Vyc29yID0gKCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIHRoaXMuY2xlYXJDdXJzb3JDYW52YXMoKTtcbiAgICAgIGlmICh0aGlzLmN1cnNvciA9PT0gQ3Vyc29yLk5vbmUpIHJldHVybjtcbiAgICAgIGlmIChpc01vYmlsZURldmljZSgpICYmICF0aGlzLnRvdWNoTW92aW5nKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHtwYWRkaW5nLCB0aGVtZX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIGNvbnN0IHtzcGFjZX0gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIGNvbnN0IHt2aXNpYmxlQXJlYSwgY3Vyc29yLCBjdXJzb3JWYWx1ZX0gPSB0aGlzO1xuXG4gICAgICBjb25zdCBbaWR4LCBpZHldID0gdGhpcy5jdXJzb3JQb3NpdGlvbjtcbiAgICAgIGlmIChpZHggPCB2aXNpYmxlQXJlYVswXVswXSB8fCBpZHggPiB2aXNpYmxlQXJlYVswXVsxXSkgcmV0dXJuO1xuICAgICAgaWYgKGlkeSA8IHZpc2libGVBcmVhWzFdWzBdIHx8IGlkeSA+IHZpc2libGVBcmVhWzFdWzFdKSByZXR1cm47XG4gICAgICBjb25zdCB4ID0gaWR4ICogc3BhY2UgKyBzcGFjZSAvIDIgKyBwYWRkaW5nO1xuICAgICAgY29uc3QgeSA9IGlkeSAqIHNwYWNlICsgc3BhY2UgLyAyICsgcGFkZGluZztcbiAgICAgIGNvbnN0IGtpID0gdGhpcy5tYXQ/LltpZHhdPy5baWR5XSB8fCBLaS5FbXB0eTtcblxuICAgICAgaWYgKGN0eCkge1xuICAgICAgICBsZXQgY3VyO1xuICAgICAgICBjb25zdCBzaXplID0gc3BhY2UgKiAwLjg7XG4gICAgICAgIGlmIChjdXJzb3IgPT09IEN1cnNvci5DaXJjbGUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgQ2lyY2xlTWFya3VwKFxuICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHksXG4gICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuU3F1YXJlKSB7XG4gICAgICAgICAgY3VyID0gbmV3IFNxdWFyZU1hcmt1cChcbiAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5LFxuICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICBraSxcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICApO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLlRyaWFuZ2xlKSB7XG4gICAgICAgICAgY3VyID0gbmV3IFRyaWFuZ2xlTWFya3VwKFxuICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHksXG4gICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuQ3Jvc3MpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgQ3Jvc3NNYXJrdXAoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAga2ksXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5UZXh0KSB7XG4gICAgICAgICAgY3VyID0gbmV3IFRleHRNYXJrdXAoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAga2ksXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpLFxuICAgICAgICAgICAgY3Vyc29yVmFsdWVcbiAgICAgICAgICApO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjgpO1xuICAgICAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5FbXB0eSAmJiBjdXJzb3IgPT09IEN1cnNvci5CbGFja1N0b25lKSB7XG4gICAgICAgICAgY3VyID0gbmV3IEZsYXRTdG9uZShjdHgsIHgsIHksIEtpLkJsYWNrLCB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpKTtcbiAgICAgICAgICBjdXIuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC41KTtcbiAgICAgICAgfSBlbHNlIGlmIChraSA9PT0gS2kuRW1wdHkgJiYgY3Vyc29yID09PSBDdXJzb3IuV2hpdGVTdG9uZSkge1xuICAgICAgICAgIGN1ciA9IG5ldyBGbGF0U3RvbmUoY3R4LCB4LCB5LCBLaS5XaGl0ZSwgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKSk7XG4gICAgICAgICAgY3VyLnNldFNpemUoc2l6ZSk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuNSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuQ2xlYXIpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgRmxhdFN0b25lKGN0eCwgeCwgeSwgS2kuRW1wdHksIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCkpO1xuICAgICAgICAgIGN1ci5zZXRTaXplKHNpemUpO1xuICAgICAgICB9XG4gICAgICAgIGN1cj8uZHJhdygpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3U3RvbmVzID0gKFxuICAgIG1hdDogbnVtYmVyW11bXSA9IHRoaXMubWF0LFxuICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgIGNsZWFyID0gdHJ1ZVxuICApID0+IHtcbiAgICBjb25zdCB7dGhlbWUgPSBUaGVtZS5CbGFja0FuZFdoaXRlLCB0aGVtZVJlc291cmNlc30gPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKGNsZWFyKSB0aGlzLmNsZWFyQ2FudmFzKCk7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG1hdFtpXVtqXTtcbiAgICAgICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICAgICAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgICAgICAgICBjb25zdCB5ID0gc2NhbGVkUGFkZGluZyArIGogKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3QgcmF0aW8gPSAwLjQ1O1xuICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLlN1YmR1ZWQgJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuQmxhY2tBbmRXaGl0ZSAmJlxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5GbGF0ICYmXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLldhcm0gJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRGFya1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDM7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAzO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnc2hhZG93Q29sb3InKTtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDg7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IHN0b25lO1xuXG4gICAgICAgICAgICAgIHN3aXRjaCAodGhlbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFRoZW1lLkJsYWNrQW5kV2hpdGU6XG4gICAgICAgICAgICAgICAgY2FzZSBUaGVtZS5GbGF0OlxuICAgICAgICAgICAgICAgIGNhc2UgVGhlbWUuV2FybToge1xuICAgICAgICAgICAgICAgICAgc3RvbmUgPSBuZXcgRmxhdFN0b25lKFxuICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgc3RvbmUuc2V0U2l6ZShzcGFjZSAqIHJhdGlvICogMik7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBUaGVtZS5EYXJrOiB7XG4gICAgICAgICAgICAgICAgICBzdG9uZSA9IG5ldyBGbGF0U3RvbmUoXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBzdG9uZS5zZXRTaXplKHNwYWNlICogcmF0aW8gKiAyKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBibGFja3MgPSB0aGVtZVJlc291cmNlc1t0aGVtZV0uYmxhY2tzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgaSA9PiBpbWFnZXNbaV1cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBjb25zdCB3aGl0ZXMgPSB0aGVtZVJlc291cmNlc1t0aGVtZV0ud2hpdGVzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgaSA9PiBpbWFnZXNbaV1cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBtb2QgPSBpICsgMTAgKyBqO1xuICAgICAgICAgICAgICAgICAgc3RvbmUgPSBuZXcgSW1hZ2VTdG9uZShjdHgsIHgsIHksIHZhbHVlLCBtb2QsIGJsYWNrcywgd2hpdGVzKTtcbiAgICAgICAgICAgICAgICAgIHN0b25lLnNldFNpemUoc3BhY2UgKiByYXRpbyAqIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzdG9uZS5kcmF3KCk7XG4gICAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIl0sIm5hbWVzIjpbIl9fc3ByZWFkQXJyYXkiLCJfX3JlYWQiLCJfX3ZhbHVlcyIsImZpbHRlciIsImZpbmRMYXN0SW5kZXgiLCJUaGVtZVByb3BlcnR5S2V5IiwiS2kiLCJUaGVtZSIsIkFuYWx5c2lzUG9pbnRUaGVtZSIsIkNlbnRlciIsIkVmZmVjdCIsIk1hcmt1cCIsIkN1cnNvciIsIlByb2JsZW1BbnN3ZXJUeXBlIiwiUGF0aERldGVjdGlvblN0cmF0ZWd5IiwiX2EiLCJfX2V4dGVuZHMiLCJjbG9uZURlZXAiLCJyZXBsYWNlIiwiY29tcGFjdCIsImZsYXR0ZW5EZXB0aCIsInN1bSIsImNsb25lIiwic2FtcGxlIiwiZW5jb2RlIiwiX19hc3NpZ24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7OztBQU1HO0FBQ0gsU0FBUyxTQUFTLENBQUksWUFBMkIsRUFBRSxHQUFRLEVBQUE7QUFDekQsSUFBQSxJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3ZCLElBQUEsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO0FBQ1osUUFBQSxJQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEMsUUFBQSxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0MsUUFBQSxPQUFPLEtBQUssQ0FDVixZQUFZLEVBQ1osU0FBUyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsRUFDbEMsU0FBUyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FDcEMsQ0FBQztLQUNIO1NBQU07QUFDTCxRQUFBLE9BQU8sR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3BCO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7O0FBT0c7QUFDSCxTQUFTLEtBQUssQ0FBSSxZQUEyQixFQUFFLElBQVMsRUFBRSxJQUFTLEVBQUE7SUFDakUsSUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO0FBQ3ZCLElBQUEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN4QixJQUFBLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFeEIsT0FBTyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDN0IsUUFBQSxJQUFJLFlBQVksQ0FB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QyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDeEQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFHRCxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUN6RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDeEQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3pELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzNELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUMzRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxDQUFDLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNwQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQ3pELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3ZELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7UUFDbkMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIO0lBQ0QsT0FBTztRQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztRQUN6RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDekQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1FBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxRQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxRQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFD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LENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsSUFBQSxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsSUFBQSxPQUFPLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLEVBQUU7QUFFVyxJQUFBLFNBQVMsR0FBRyxVQUFDLEdBQVEsRUFBRSxNQUFVLEVBQUE7QUFBVixJQUFBLElBQUEsTUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsTUFBVSxHQUFBLENBQUEsQ0FBQSxFQUFBO0lBQzVDLElBQUksTUFBTSxLQUFLLENBQUM7QUFBRSxRQUFBLE9BQU8sR0FBRyxDQUFDO0FBQzdCLElBQUEsSUFBTSxHQUFHLEdBQUdDLFlBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixJQUFBLElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3ZELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLEVBQUU7QUFFVyxJQUFBLE9BQU8sR0FBRyxVQUFDLEdBQVEsRUFBRSxJQUFVLEVBQUUsT0FBVyxFQUFFLE9BQVcsRUFBQTtBQUFwQyxJQUFBLElBQUEsSUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsSUFBVSxHQUFBLEdBQUEsQ0FBQSxFQUFBO0FBQUUsSUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQVcsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUFFLElBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxPQUFX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QUFJLE1BQU0sS0FBS0EsY0FBTSxDQUFDLE9BQU8sRUFBRTtRQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3JDO0FBQ0QsSUFBQSxJQUFJLE1BQU0sS0FBS0EsY0FBTSxDQUFDLFFBQVEsRUFBRTtRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDMUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3JDO0FBQ0QsSUFBQSxJQUFJLE1BQU0sS0FBS0EsY0FBTSxDQUFDLFVBQVUsRUFBRTtRQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO0tBQzFDO0FBQ0QsSUFBQSxJQUFJLE1BQU0sS0FBS0EsY0FBTSxDQUFDLFdBQVcsRUFBRTtRQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDMUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO0tBQzFDO0FBQ0QsSUFBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDM0MsSUFBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFM0MsSUFBQSxPQUFPLE1BQU0sQ0FB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Q0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDdkIsQ0FBQztLQUNIO0lBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUNuQixRQUFBLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RELFFBQUEsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuRSxRQUFBLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RELFFBQUEsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUV0RSxRQUFBLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQ3ZCLGdCQUFnQixHQUFHLGdCQUFnQixFQUNuQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FDcEMsQ0FBQztRQUVGLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztBQUMxQixRQUFBLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBRTNCLFFBQUEsSUFBSSxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtBQUN4QixZQUFBLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN4QixZQUFBLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO1NBQzVCO1FBRUQsTUFBTSxHQUFHLGdCQUFnQixDQUFDO0FBQzFCLFFBQUEsTUFBTSxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDM0IsSUFBSSxNQUFNLElBQUksR0FBRyxDQUFD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
