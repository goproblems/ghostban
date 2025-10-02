
  /**
   * @license
   * author: BAI TIANLIANG
   * ghostban.js v3.0.0-alpha.143
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
function buildPropertyValueRanges(sgf, keys) {
    if (keys === void 0) { keys = ['C', 'TM', 'GN', 'PC']; }
    var ranges = [];
    var pattern = new RegExp("\\b(".concat(keys.join('|'), ")\\["), 'g');
    var match;
    var _loop_1 = function () {
        var propStart = match.index;
        var valueStart = propStart + match[1].length + 1; // +1 for '['
        // Check if this match is inside any existing range
        var isInsideExistingRange = ranges.some(function (_a) {
            var _b = tslib.__read(_a, 2), start = _b[0], end = _b[1];
            return propStart >= start && propStart <= end;
        });
        if (isInsideExistingRange) {
            return "continue";
        }
        // Find the first unescaped closing bracket
        var i = valueStart;
        var escaped = false;
        while (i < sgf.length) {
            var char = sgf[i];
            if (escaped) {
                escaped = false;
            }
            else if (char === '\\') {
                escaped = true;
            }
            else if (char === ']') {
                // Found unescaped closing bracket
                break;
            }
            i++;
        }
        if (i < sgf.length) {
            ranges.push([valueStart, i]);
        }
    };
    while ((match = pattern.exec(sgf)) !== null) {
        _loop_1();
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
// Updated regex to handle escaped brackets properly for Text type properties
// (?:[^\]\\]|\\.)* matches any char except ] and \, OR any escaped char
var TOKEN_REGEX_WITH_ESCAPES = new RegExp(/([A-Z]*)\[((?:[^\]\\]|\\.)*)\]/);
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
        var match = str.match(TOKEN_REGEX_WITH_ESCAPES);
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
    /**
     * Escapes unescaped right brackets in SGF property values
     * Only escapes brackets that are not already escaped
     */
    NodeAnnotationProp.prototype.escapeValue = function (value) {
        // Replace ] with \] only if it's not already escaped
        // This regex looks for ] that is NOT preceded by \
        return value.replace(/(?<!\\)\]/g, '\\]');
    };
    NodeAnnotationProp.prototype.toString = function () {
        var _this = this;
        return "".concat(this.token).concat(this._values
            .map(function (v) { return "[".concat(_this.escapeValue(v), "]"); })
            .join(''));
    };
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
        var match = str.match(TOKEN_REGEX_WITH_ESCAPES);
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
        var match = str.match(TOKEN_REGEX_WITH_ESCAPES);
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
        var match = str.match(TOKEN_REGEX_WITH_ESCAPES);
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
        var match = str.match(TOKEN_REGEX_WITH_ESCAPES);
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
/**
 * Compare if two board states are completely identical
 */
var boardStatesEqual = function (board1, board2) {
    if (board1.length !== board2.length)
        return false;
    for (var i = 0; i < board1.length; i++) {
        if (board1[i].length !== board2[i].length)
            return false;
        for (var j = 0; j < board1[i].length; j++) {
            if (board1[i][j] !== board2[i][j])
                return false;
        }
    }
    return true;
};
/**
 * Simulate the board state after making a move at specified position (including captures)
 */
var simulateMoveWithCapture = function (mat, i, j, ki) {
    var newMat = lodash.cloneDeep(mat);
    newMat[i][j] = ki;
    // Execute captures
    return execCapture(newMat, i, j, -ki);
};
var canMove = function (mat, i, j, ki, previousBoardState) {
    var _a, _b;
    if (i < 0 || j < 0 || i >= mat.length || j >= ((_b = (_a = mat[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0)) {
        return false;
    }
    if (mat[i][j] !== 0) {
        return false;
    }
    // Simulate the board state after the move (including captures)
    var boardStateAfterMove = simulateMoveWithCapture(mat, i, j, ki);
    // Ko rule check: if the board state after move is identical to previous state, it violates ko rule
    if (previousBoardState &&
        boardStatesEqual(boardStateAfterMove, previousBoardState)) {
        return false;
    }
    // Check suicide rule: if after placing the stone it has no liberties and cannot capture opponent stones, it's illegal
    var newArray = lodash.cloneDeep(mat);
    newArray[i][j] = ki;
    var liberty = calcLiberty(newArray, i, j, ki).liberty;
    if (canCapture(newArray, i, j, -ki)) {
        return true; // Can capture opponent stones, legal move
    }
    if (canCapture(newArray, i, j, ki)) {
        return false; // Own stones would be captured, illegal move
    }
    if (liberty === 0) {
        return false; // No liberties and cannot capture, illegal move
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
        var e_1, _a;
        if (!sgf)
            return;
        // First, get all property value ranges from the original string
        // Use all known SGF property keys from the constants
        var allPropertyKeys = tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray([], tslib.__read(ROOT_PROP_LIST), false), tslib.__read(MOVE_PROP_LIST), false), tslib.__read(SETUP_PROP_LIST), false), tslib.__read(MARKUP_PROP_LIST), false), tslib.__read(NODE_ANNOTATION_PROP_LIST), false), tslib.__read(MOVE_ANNOTATION_PROP_LIST), false), tslib.__read(GAME_INFO_PROP_LIST), false), tslib.__read(CUSTOM_PROP_LIST), false);
        var propertyValueRanges = buildPropertyValueRanges(sgf, allPropertyKeys).sort(function (a, b) { return a[0] - b[0]; });
        // Remove spaces only outside property value ranges
        var processedSgf = '';
        var lastIndex = 0;
        try {
            for (var propertyValueRanges_1 = tslib.__values(propertyValueRanges), propertyValueRanges_1_1 = propertyValueRanges_1.next(); !propertyValueRanges_1_1.done; propertyValueRanges_1_1 = propertyValueRanges_1.next()) {
                var _b = tslib.__read(propertyValueRanges_1_1.value, 2), start = _b[0], end = _b[1];
                // Process text before this property value (remove spaces)
                var beforeProp = sgf.slice(lastIndex, start);
                processedSgf += beforeProp.replace(/\s+/gm, '');
                // Keep property value as-is (preserve spaces)
                var propValue = sgf.slice(start, end);
                processedSgf += propValue;
                lastIndex = end;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (propertyValueRanges_1_1 && !propertyValueRanges_1_1.done && (_a = propertyValueRanges_1.return)) _a.call(propertyValueRanges_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Process remaining text after last property value (remove spaces)
        var remaining = sgf.slice(lastIndex);
        processedSgf += remaining.replace(/\s+/gm, '');
        // Now use the processed SGF for parsing
        sgf = processedSgf;
        var nodeStart = 0;
        var counter = 0;
        var stack = [];
        var inNodeRanges = buildPropertyValueRanges(sgf).sort(function (a, b) { return a[0] - b[0]; });
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
                    // Simplified regex to handle escaped brackets properly
                    // [^\]\\]|\\.  matches: any char except ] and \, OR any escaped char (\.)
                    RegExp(/\w+(?:\[(?:[^\]\\]|\\.)*\])+/g))), false);
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
var addMoveToCurrentNode = function (currentNode, mat, i, j, ki, previousBoardState) {
    if (ki === exports.Ki.Empty)
        return;
    var node;
    if (canMove(mat, i, j, ki, previousBoardState)) {
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
        this.previousBoardState = null;
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
                var allowMove = canMove(mat, cursorPosition[0], cursorPosition[1], _this.turn, _this.previousBoardState) && preventMoveMat[cursorPosition[0]][cursorPosition[1]] === 0;
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
    GhostBan.prototype.setPreviousBoardState = function (boardState) {
        this.previousBoardState = boardState;
    };
    GhostBan.prototype.getPreviousBoardState = function () {
        return this.previousBoardState;
    };
    /**
     * Record current board state as history state for ko rule checking in next move
     */
    GhostBan.prototype.recordCurrentBoardState = function () {
        this.previousBoardState = this.mat.map(function (row) { return tslib.__spreadArray([], tslib.__read(row), false); });
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
exports.buildPropertyValueRanges = buildPropertyValueRanges;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL2NvcmUvbWVyZ2Vzb3J0LnRzIiwiLi4vLi4vY29yZS90cmVlLnRzIiwiLi4vLi4vY29yZS9oZWxwZXJzLnRzIiwiLi4vLi4vdHlwZXMudHMiLCIuLi8uLi9jb25zdC50cyIsIi4uLy4uL2NvcmUvcHJvcHMudHMiLCIuLi8uLi9ib2FyZGNvcmUudHMiLCIuLi8uLi9jb3JlL3NnZi50cyIsIi4uLy4uL2hlbHBlci50cyIsIi4uLy4uL3N0b25lcy9iYXNlLnRzIiwiLi4vLi4vc3RvbmVzL0ZsYXRTdG9uZS50cyIsIi4uLy4uL3N0b25lcy9JbWFnZVN0b25lLnRzIiwiLi4vLi4vc3RvbmVzL0FuYWx5c2lzUG9pbnQudHMiLCIuLi8uLi9tYXJrdXBzL01hcmt1cEJhc2UudHMiLCIuLi8uLi9tYXJrdXBzL0NpcmNsZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvQ3Jvc3NNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL1RleHRNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL1NxdWFyZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvVHJpYW5nbGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL05vZGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL0FjdGl2ZU5vZGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL0NpcmNsZVNvbGlkTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9IaWdobGlnaHRNYXJrdXAudHMiLCIuLi8uLi9lZmZlY3RzL0VmZmVjdEJhc2UudHMiLCIuLi8uLi9lZmZlY3RzL0JhbkVmZmVjdC50cyIsIi4uLy4uL2dob3N0YmFuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB0eXBlIENvbXBhcmF0b3I8VD4gPSAoYTogVCwgYjogVCkgPT4gbnVtYmVyO1xuXG4vKipcbiAqIFNvcnQgYW4gYXJyYXkgdXNpbmcgdGhlIG1lcmdlIHNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSBjb21wYXJhdG9yRm4gVGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYXJyIFRoZSBhcnJheSB0byBzb3J0LlxuICogQHJldHVybnMgVGhlIHNvcnRlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VTb3J0PFQ+KGNvbXBhcmF0b3JGbjogQ29tcGFyYXRvcjxUPiwgYXJyOiBUW10pOiBUW10ge1xuICBjb25zdCBsZW4gPSBhcnIubGVuZ3RoO1xuICBpZiAobGVuID49IDIpIHtcbiAgICBjb25zdCBmaXJzdEhhbGYgPSBhcnIuc2xpY2UoMCwgbGVuIC8gMik7XG4gICAgY29uc3Qgc2Vjb25kSGFsZiA9IGFyci5zbGljZShsZW4gLyAyLCBsZW4pO1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIGNvbXBhcmF0b3JGbixcbiAgICAgIG1lcmdlU29ydChjb21wYXJhdG9yRm4sIGZpcnN0SGFsZiksXG4gICAgICBtZXJnZVNvcnQoY29tcGFyYXRvckZuLCBzZWNvbmRIYWxmKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFyci5zbGljZSgpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIG1lcmdlIHBhcnQgb2YgdGhlIG1lcmdlIHNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSBjb21wYXJhdG9yRm4gVGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYXJyMSBUaGUgZmlyc3Qgc29ydGVkIGFycmF5LlxuICogQHBhcmFtIGFycjIgVGhlIHNlY29uZCBzb3J0ZWQgYXJyYXkuXG4gKiBAcmV0dXJucyBUaGUgbWVyZ2VkIGFuZCBzb3J0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlPFQ+KGNvbXBhcmF0b3JGbjogQ29tcGFyYXRvcjxUPiwgYXJyMTogVFtdLCBhcnIyOiBUW10pOiBUW10ge1xuICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xuICBsZXQgbGVmdDEgPSBhcnIxLmxlbmd0aDtcbiAgbGV0IGxlZnQyID0gYXJyMi5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlZnQxID4gMCAmJiBsZWZ0MiA+IDApIHtcbiAgICBpZiAoY29tcGFyYXRvckZuKGFycjFbMF0sIGFycjJbMF0pIDw9IDApIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFycjEuc2hpZnQoKSEpOyAvLyBub24tbnVsbCBhc3NlcnRpb246IHNhZmUgc2luY2Ugd2UganVzdCBjaGVja2VkIGxlbmd0aFxuICAgICAgbGVmdDEtLTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goYXJyMi5zaGlmdCgpISk7XG4gICAgICBsZWZ0Mi0tO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsZWZ0MSA+IDApIHtcbiAgICByZXN1bHQucHVzaCguLi5hcnIxKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucHVzaCguLi5hcnIyKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlU29ydDtcbiIsImltcG9ydCBtZXJnZVNvcnQgZnJvbSAnLi9tZXJnZXNvcnQnO1xuaW1wb3J0IHtTZ2ZOb2RlfSBmcm9tICcuL3R5cGVzJztcblxuZnVuY3Rpb24gZmluZEluc2VydEluZGV4PFQ+KFxuICBjb21wYXJhdG9yRm46IChhOiBULCBiOiBUKSA9PiBudW1iZXIsXG4gIGFycjogVFtdLFxuICBlbDogVFxuKTogbnVtYmVyIHtcbiAgbGV0IGk6IG51bWJlcjtcbiAgY29uc3QgbGVuID0gYXJyLmxlbmd0aDtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGNvbXBhcmF0b3JGbihhcnJbaV0sIGVsKSA+IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaTtcbn1cblxudHlwZSBDb21wYXJhdG9yPFQ+ID0gKGE6IFQsIGI6IFQpID0+IG51bWJlcjtcblxuaW50ZXJmYWNlIFRyZWVNb2RlbENvbmZpZzxUPiB7XG4gIGNoaWxkcmVuUHJvcGVydHlOYW1lPzogc3RyaW5nO1xuICBtb2RlbENvbXBhcmF0b3JGbj86IENvbXBhcmF0b3I8VD47XG59XG5cbmNsYXNzIFROb2RlIHtcbiAgY29uZmlnOiBUcmVlTW9kZWxDb25maWc8U2dmTm9kZT47XG4gIG1vZGVsOiBTZ2ZOb2RlO1xuICBjaGlsZHJlbjogVE5vZGVbXSA9IFtdO1xuICBwYXJlbnQ/OiBUTm9kZTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPiwgbW9kZWw6IFNnZk5vZGUpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICBpc1Jvb3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICB9XG5cbiAgYWRkQ2hpbGQoY2hpbGQ6IFROb2RlKTogVE5vZGUge1xuICAgIHJldHVybiBhZGRDaGlsZCh0aGlzLCBjaGlsZCk7XG4gIH1cblxuICBhZGRDaGlsZEF0SW5kZXgoY2hpbGQ6IFROb2RlLCBpbmRleDogbnVtYmVyKTogVE5vZGUge1xuICAgIGlmICh0aGlzLmNvbmZpZy5tb2RlbENvbXBhcmF0b3JGbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCBjaGlsZCBhdCBpbmRleCB3aGVuIHVzaW5nIGEgY29tcGFyYXRvciBmdW5jdGlvbi4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3AgPSB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nO1xuICAgIGlmICghKHRoaXMubW9kZWwgYXMgYW55KVtwcm9wXSkge1xuICAgICAgKHRoaXMubW9kZWwgYXMgYW55KVtwcm9wXSA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsQ2hpbGRyZW4gPSAodGhpcy5tb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICBtb2RlbENoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQubW9kZWwpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZCk7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH1cblxuICBnZXRQYXRoKCk6IFROb2RlW10ge1xuICAgIGNvbnN0IHBhdGg6IFROb2RlW10gPSBbXTtcbiAgICBsZXQgY3VycmVudDogVE5vZGUgfCB1bmRlZmluZWQgPSB0aGlzO1xuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBwYXRoLnVuc2hpZnQoY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgZ2V0SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pc1Jvb3QoKSA/IDAgOiB0aGlzLnBhcmVudCEuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgfVxuXG4gIHNldEluZGV4KGluZGV4OiBudW1iZXIpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBzZXQgbm9kZSBpbmRleCB3aGVuIHVzaW5nIGEgY29tcGFyYXRvciBmdW5jdGlvbi4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnBhcmVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIGhhcyBubyBwYXJlbnQuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLnBhcmVudC5jaGlsZHJlbjtcbiAgICBjb25zdCBtb2RlbFNpYmxpbmdzID0gKHRoaXMucGFyZW50Lm1vZGVsIGFzIGFueSlbXG4gICAgICB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nXG4gICAgXTtcblxuICAgIGNvbnN0IG9sZEluZGV4ID0gc2libGluZ3MuaW5kZXhPZih0aGlzKTtcblxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc2libGluZ3MubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXguJyk7XG4gICAgfVxuXG4gICAgc2libGluZ3Muc3BsaWNlKGluZGV4LCAwLCBzaWJsaW5ncy5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcbiAgICBtb2RlbFNpYmxpbmdzLnNwbGljZShpbmRleCwgMCwgbW9kZWxTaWJsaW5ncy5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgd2FsayhmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuIHwgdm9pZCk6IHZvaWQge1xuICAgIGNvbnN0IHdhbGtSZWN1cnNpdmUgPSAobm9kZTogVE5vZGUpOiBib29sZWFuID0+IHtcbiAgICAgIGlmIChmbihub2RlKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAod2Fsa1JlY3Vyc2l2ZShjaGlsZCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIHdhbGtSZWN1cnNpdmUodGhpcyk7XG4gIH1cblxuICBmaXJzdChmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuKTogVE5vZGUgfCB1bmRlZmluZWQge1xuICAgIGxldCByZXN1bHQ6IFROb2RlIHwgdW5kZWZpbmVkO1xuICAgIHRoaXMud2Fsayhub2RlID0+IHtcbiAgICAgIGlmIChmbihub2RlKSkge1xuICAgICAgICByZXN1bHQgPSBub2RlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGFsbChmbjogKG5vZGU6IFROb2RlKSA9PiBib29sZWFuKTogVE5vZGVbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBUTm9kZVtdID0gW107XG4gICAgdGhpcy53YWxrKG5vZGUgPT4ge1xuICAgICAgaWYgKGZuKG5vZGUpKSByZXN1bHQucHVzaChub2RlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZHJvcCgpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIGNvbnN0IHByb3AgPSB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nO1xuICAgICAgICAodGhpcy5wYXJlbnQubW9kZWwgYXMgYW55KVtwcm9wXS5zcGxpY2UoaWR4LCAxKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDaGlsZChwYXJlbnQ6IFROb2RlLCBjaGlsZDogVE5vZGUpOiBUTm9kZSB7XG4gIGNvbnN0IHByb3AgPSBwYXJlbnQuY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lIHx8ICdjaGlsZHJlbic7XG4gIGlmICghKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdKSB7XG4gICAgKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdID0gW107XG4gIH1cblxuICBjb25zdCBtb2RlbENoaWxkcmVuID0gKHBhcmVudC5tb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gIGNoaWxkLnBhcmVudCA9IHBhcmVudDtcbiAgaWYgKHBhcmVudC5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICBjb25zdCBpbmRleCA9IGZpbmRJbnNlcnRJbmRleChcbiAgICAgIHBhcmVudC5jb25maWcubW9kZWxDb21wYXJhdG9yRm4sXG4gICAgICBtb2RlbENoaWxkcmVuLFxuICAgICAgY2hpbGQubW9kZWxcbiAgICApO1xuICAgIG1vZGVsQ2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZC5tb2RlbCk7XG4gICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuICB9IGVsc2Uge1xuICAgIG1vZGVsQ2hpbGRyZW4ucHVzaChjaGlsZC5tb2RlbCk7XG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5jbGFzcyBUcmVlTW9kZWwge1xuICBjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPjtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRyZWVNb2RlbENvbmZpZzxTZ2ZOb2RlPiA9IHt9KSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBjaGlsZHJlblByb3BlcnR5TmFtZTogY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lIHx8ICdjaGlsZHJlbicsXG4gICAgICBtb2RlbENvbXBhcmF0b3JGbjogY29uZmlnLm1vZGVsQ29tcGFyYXRvckZuLFxuICAgIH07XG4gIH1cblxuICBwYXJzZShtb2RlbDogU2dmTm9kZSk6IFROb2RlIHtcbiAgICBpZiAodHlwZW9mIG1vZGVsICE9PSAnb2JqZWN0JyB8fCBtb2RlbCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTW9kZWwgbXVzdCBiZSBvZiB0eXBlIG9iamVjdC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlID0gbmV3IFROb2RlKHRoaXMuY29uZmlnLCBtb2RlbCk7XG4gICAgY29uc3QgcHJvcCA9IHRoaXMuY29uZmlnLmNoaWxkcmVuUHJvcGVydHlOYW1lITtcbiAgICBjb25zdCBjaGlsZHJlbiA9IChtb2RlbCBhcyBhbnkpW3Byb3BdO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgICBpZiAodGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICAgICAgKG1vZGVsIGFzIGFueSlbcHJvcF0gPSBtZXJnZVNvcnQoXG4gICAgICAgICAgdGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4sXG4gICAgICAgICAgY2hpbGRyZW5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgY2hpbGRNb2RlbCBvZiAobW9kZWwgYXMgYW55KVtwcm9wXSkge1xuICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSB0aGlzLnBhcnNlKGNoaWxkTW9kZWwpO1xuICAgICAgICBhZGRDaGlsZChub2RlLCBjaGlsZE5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG59XG5cbmV4cG9ydCB7VHJlZU1vZGVsLCBUTm9kZSwgVHJlZU1vZGVsQ29uZmlnfTtcbiIsImltcG9ydCB7ZmlsdGVyLCBmaW5kTGFzdEluZGV4fSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtUTm9kZX0gZnJvbSAnLi90cmVlJztcbmltcG9ydCB7TW92ZVByb3AsIFNnZlByb3BCYXNlfSBmcm9tICcuL3Byb3BzJztcblxuY29uc3QgU3BhcmtNRDUgPSByZXF1aXJlKCdzcGFyay1tZDUnKTtcblxuZXhwb3J0IGNvbnN0IGNhbGNIYXNoID0gKFxuICBub2RlOiBUTm9kZSB8IG51bGwgfCB1bmRlZmluZWQsXG4gIG1vdmVQcm9wczogTW92ZVByb3BbXSA9IFtdXG4pOiBzdHJpbmcgPT4ge1xuICBsZXQgZnVsbG5hbWUgPSAnbic7XG4gIGlmIChtb3ZlUHJvcHMubGVuZ3RoID4gMCkge1xuICAgIGZ1bGxuYW1lICs9IGAke21vdmVQcm9wc1swXS50b2tlbn0ke21vdmVQcm9wc1swXS52YWx1ZX1gO1xuICB9XG4gIGlmIChub2RlKSB7XG4gICAgY29uc3QgcGF0aCA9IG5vZGUuZ2V0UGF0aCgpO1xuICAgIGlmIChwYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIGZ1bGxuYW1lID0gcGF0aC5tYXAobiA9PiBuLm1vZGVsLmlkKS5qb2luKCc9PicpICsgYD0+JHtmdWxsbmFtZX1gO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBTcGFya01ENS5oYXNoKGZ1bGxuYW1lKS5zbGljZSgwLCA2KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NoYXJhY3RlckluTm9kZShcbiAgc2dmOiBzdHJpbmcsXG4gIG46IG51bWJlcixcbiAgbm9kZXMgPSBbJ0MnLCAnVE0nLCAnR04nLCAnUEMnXVxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGAoJHtub2Rlcy5qb2luKCd8Jyl9KVxcXFxbKFteXFxcXF1dKilcXFxcXWAsICdnJyk7XG4gIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcblxuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKHNnZikpICE9PSBudWxsKSB7XG4gICAgY29uc3QgY29udGVudFN0YXJ0ID0gbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGggKyAxOyAvLyArMSBmb3IgdGhlICdbJ1xuICAgIGNvbnN0IGNvbnRlbnRFbmQgPSBjb250ZW50U3RhcnQgKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgaWYgKG4gPj0gY29udGVudFN0YXJ0ICYmIG4gPD0gY29udGVudEVuZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG50eXBlIFJhbmdlID0gW251bWJlciwgbnVtYmVyXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUHJvcGVydHlWYWx1ZVJhbmdlcyhcbiAgc2dmOiBzdHJpbmcsXG4gIGtleXM6IHN0cmluZ1tdID0gWydDJywgJ1RNJywgJ0dOJywgJ1BDJ11cbik6IFJhbmdlW10ge1xuICBjb25zdCByYW5nZXM6IFJhbmdlW10gPSBbXTtcbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoYFxcXFxiKCR7a2V5cy5qb2luKCd8Jyl9KVxcXFxbYCwgJ2cnKTtcblxuICBsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG4gIHdoaWxlICgobWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoc2dmKSkgIT09IG51bGwpIHtcbiAgICBjb25zdCBwcm9wU3RhcnQgPSBtYXRjaC5pbmRleDtcbiAgICBjb25zdCB2YWx1ZVN0YXJ0ID0gcHJvcFN0YXJ0ICsgbWF0Y2hbMV0ubGVuZ3RoICsgMTsgLy8gKzEgZm9yICdbJ1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhpcyBtYXRjaCBpcyBpbnNpZGUgYW55IGV4aXN0aW5nIHJhbmdlXG4gICAgY29uc3QgaXNJbnNpZGVFeGlzdGluZ1JhbmdlID0gcmFuZ2VzLnNvbWUoXG4gICAgICAoW3N0YXJ0LCBlbmRdKSA9PiBwcm9wU3RhcnQgPj0gc3RhcnQgJiYgcHJvcFN0YXJ0IDw9IGVuZFxuICAgICk7XG5cbiAgICBpZiAoaXNJbnNpZGVFeGlzdGluZ1JhbmdlKSB7XG4gICAgICBjb250aW51ZTsgLy8gU2tpcCB0aGlzIG1hdGNoIGFzIGl0J3MgaW5zaWRlIGFub3RoZXIgcHJvcGVydHkgdmFsdWVcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBmaXJzdCB1bmVzY2FwZWQgY2xvc2luZyBicmFja2V0XG4gICAgbGV0IGkgPSB2YWx1ZVN0YXJ0O1xuICAgIGxldCBlc2NhcGVkID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoaSA8IHNnZi5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNoYXIgPSBzZ2ZbaV07XG5cbiAgICAgIGlmIChlc2NhcGVkKSB7XG4gICAgICAgIGVzY2FwZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhciA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIGVzY2FwZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChjaGFyID09PSAnXScpIHtcbiAgICAgICAgLy8gRm91bmQgdW5lc2NhcGVkIGNsb3NpbmcgYnJhY2tldFxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaSsrO1xuICAgIH1cblxuICAgIGlmIChpIDwgc2dmLmxlbmd0aCkge1xuICAgICAgcmFuZ2VzLnB1c2goW3ZhbHVlU3RhcnQsIGldKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmFuZ2VzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbkFueVJhbmdlKGluZGV4OiBudW1iZXIsIHJhbmdlczogUmFuZ2VbXSk6IGJvb2xlYW4ge1xuICAvLyByYW5nZXMgbXVzdCBiZSBzb3J0ZWRcbiAgbGV0IGxlZnQgPSAwO1xuICBsZXQgcmlnaHQgPSByYW5nZXMubGVuZ3RoIC0gMTtcblxuICB3aGlsZSAobGVmdCA8PSByaWdodCkge1xuICAgIGNvbnN0IG1pZCA9IChsZWZ0ICsgcmlnaHQpID4+IDE7XG4gICAgY29uc3QgW3N0YXJ0LCBlbmRdID0gcmFuZ2VzW21pZF07XG5cbiAgICBpZiAoaW5kZXggPCBzdGFydCkge1xuICAgICAgcmlnaHQgPSBtaWQgLSAxO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPiBlbmQpIHtcbiAgICAgIGxlZnQgPSBtaWQgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBnZXREZWR1cGxpY2F0ZWRQcm9wcyA9ICh0YXJnZXRQcm9wczogU2dmUHJvcEJhc2VbXSkgPT4ge1xuICByZXR1cm4gZmlsdGVyKFxuICAgIHRhcmdldFByb3BzLFxuICAgIChwcm9wOiBTZ2ZQcm9wQmFzZSwgaW5kZXg6IG51bWJlcikgPT5cbiAgICAgIGluZGV4ID09PVxuICAgICAgZmluZExhc3RJbmRleChcbiAgICAgICAgdGFyZ2V0UHJvcHMsXG4gICAgICAgIChsYXN0UHJvOiBTZ2ZQcm9wQmFzZSkgPT5cbiAgICAgICAgICBwcm9wLnRva2VuID09PSBsYXN0UHJvLnRva2VuICYmIHByb3AudmFsdWUgPT09IGxhc3RQcm8udmFsdWVcbiAgICAgIClcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc01vdmVOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIHJldHVybiBuLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUm9vdE5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgcmV0dXJuIG4ubW9kZWwucm9vdFByb3BzLmxlbmd0aCA+IDAgfHwgbi5pc1Jvb3QoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1NldHVwTm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICByZXR1cm4gbi5tb2RlbC5zZXR1cFByb3BzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZU51bWJlciA9IChuOiBUTm9kZSwgcGFyZW50PzogVE5vZGUpID0+IHtcbiAgY29uc3QgcGF0aCA9IG4uZ2V0UGF0aCgpO1xuICBsZXQgbW92ZXNDb3VudCA9IHBhdGguZmlsdGVyKG4gPT4gaXNNb3ZlTm9kZShuKSkubGVuZ3RoO1xuICBpZiAocGFyZW50KSB7XG4gICAgbW92ZXNDb3VudCArPSBwYXJlbnQuZ2V0UGF0aCgpLmZpbHRlcihuID0+IGlzTW92ZU5vZGUobikpLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gbW92ZXNDb3VudDtcbn07XG4iLCIvKipcbiAqIFRoZW1lIHByb3BlcnR5IGtleXMgZm9yIHR5cGUtc2FmZSBhY2Nlc3MgdG8gdGhlbWUgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgZW51bSBUaGVtZVByb3BlcnR5S2V5IHtcbiAgUG9zaXRpdmVOb2RlQ29sb3IgPSAncG9zaXRpdmVOb2RlQ29sb3InLFxuICBOZWdhdGl2ZU5vZGVDb2xvciA9ICduZWdhdGl2ZU5vZGVDb2xvcicsXG4gIE5ldXRyYWxOb2RlQ29sb3IgPSAnbmV1dHJhbE5vZGVDb2xvcicsXG4gIERlZmF1bHROb2RlQ29sb3IgPSAnZGVmYXVsdE5vZGVDb2xvcicsXG4gIFdhcm5pbmdOb2RlQ29sb3IgPSAnd2FybmluZ05vZGVDb2xvcicsXG4gIFNoYWRvd0NvbG9yID0gJ3NoYWRvd0NvbG9yJyxcbiAgQm9hcmRMaW5lQ29sb3IgPSAnYm9hcmRMaW5lQ29sb3InLFxuICBBY3RpdmVDb2xvciA9ICdhY3RpdmVDb2xvcicsXG4gIEluYWN0aXZlQ29sb3IgPSAnaW5hY3RpdmVDb2xvcicsXG4gIEJvYXJkQmFja2dyb3VuZENvbG9yID0gJ2JvYXJkQmFja2dyb3VuZENvbG9yJyxcbiAgRmxhdEJsYWNrQ29sb3IgPSAnZmxhdEJsYWNrQ29sb3InLFxuICBGbGF0QmxhY2tDb2xvckFsdCA9ICdmbGF0QmxhY2tDb2xvckFsdCcsXG4gIEZsYXRXaGl0ZUNvbG9yID0gJ2ZsYXRXaGl0ZUNvbG9yJyxcbiAgRmxhdFdoaXRlQ29sb3JBbHQgPSAnZmxhdFdoaXRlQ29sb3JBbHQnLFxuICBCb2FyZEVkZ2VMaW5lV2lkdGggPSAnYm9hcmRFZGdlTGluZVdpZHRoJyxcbiAgQm9hcmRMaW5lV2lkdGggPSAnYm9hcmRMaW5lV2lkdGgnLFxuICBCb2FyZExpbmVFeHRlbnQgPSAnYm9hcmRMaW5lRXh0ZW50JyxcbiAgU3RhclNpemUgPSAnc3RhclNpemUnLFxuICBNYXJrdXBMaW5lV2lkdGggPSAnbWFya3VwTGluZVdpZHRoJyxcbiAgSGlnaGxpZ2h0Q29sb3IgPSAnaGlnaGxpZ2h0Q29sb3InLFxufVxuXG4vKipcbiAqIFRoZW1lIGNvbnRleHQgZm9yIG1hcmt1cCByZW5kZXJpbmdcbiAqL1xuZXhwb3J0IHR5cGUgVGhlbWVDb250ZXh0ID0ge1xuICB0aGVtZTogVGhlbWU7XG4gIHRoZW1lT3B0aW9uczogVGhlbWVPcHRpb25zO1xufTtcblxuLyoqXG4gKiBPcHRpb25zIGZvciBjb25maWd1cmluZyBHaG9zdEJhbi5cbiAqL1xuZXhwb3J0IHR5cGUgR2hvc3RCYW5PcHRpb25zID0ge1xuICBib2FyZFNpemU6IG51bWJlcjtcbiAgc2l6ZT86IG51bWJlcjtcbiAgZHluYW1pY1BhZGRpbmc6IGJvb2xlYW47XG4gIHBhZGRpbmc6IG51bWJlcjtcbiAgem9vbT86IGJvb2xlYW47XG4gIGV4dGVudDogbnVtYmVyO1xuICB0aGVtZTogVGhlbWU7XG4gIGFuYWx5c2lzUG9pbnRUaGVtZTogQW5hbHlzaXNQb2ludFRoZW1lO1xuICBjb29yZGluYXRlOiBib29sZWFuO1xuICBpbnRlcmFjdGl2ZTogYm9vbGVhbjtcbiAgYmFja2dyb3VuZDogYm9vbGVhbjtcbiAgc2hvd0FuYWx5c2lzOiBib29sZWFuO1xuICBhZGFwdGl2ZUJvYXJkTGluZTogYm9vbGVhbjtcbiAgdGhlbWVPcHRpb25zOiBUaGVtZU9wdGlvbnM7XG4gIHRoZW1lUmVzb3VyY2VzOiBUaGVtZVJlc291cmNlcztcbiAgbW92ZVNvdW5kOiBib29sZWFuO1xuICBhZGFwdGl2ZVN0YXJTaXplOiBib29sZWFuO1xuICBtb2JpbGVJbmRpY2F0b3JPZmZzZXQ6IG51bWJlcjtcbiAgZm9yY2VBbmFseXNpc0JvYXJkU2l6ZT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEdob3N0QmFuT3B0aW9uc1BhcmFtcyA9IHtcbiAgYm9hcmRTaXplPzogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBkeW5hbWljUGFkZGluZz86IGJvb2xlYW47XG4gIHBhZGRpbmc/OiBudW1iZXI7XG4gIHpvb20/OiBib29sZWFuO1xuICBleHRlbnQ/OiBudW1iZXI7XG4gIHRoZW1lPzogVGhlbWU7XG4gIGFuYWx5c2lzUG9pbnRUaGVtZT86IEFuYWx5c2lzUG9pbnRUaGVtZTtcbiAgY29vcmRpbmF0ZT86IGJvb2xlYW47XG4gIGludGVyYWN0aXZlPzogYm9vbGVhbjtcbiAgYmFja2dyb3VuZD86IGJvb2xlYW47XG4gIHNob3dBbmFseXNpcz86IGJvb2xlYW47XG4gIGFkYXB0aXZlQm9hcmRMaW5lPzogYm9vbGVhbjtcbiAgdGhlbWVPcHRpb25zPzogUGFydGlhbDxUaGVtZU9wdGlvbnM+O1xuICB0aGVtZVJlc291cmNlcz86IFRoZW1lUmVzb3VyY2VzO1xuICBtb3ZlU291bmQ/OiBib29sZWFuO1xuICBhZGFwdGl2ZVN0YXJTaXplPzogYm9vbGVhbjtcbiAgZm9yY2VBbmFseXNpc0JvYXJkU2l6ZT86IG51bWJlcjtcbiAgbW9iaWxlSW5kaWNhdG9yT2Zmc2V0PzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgVGhlbWVDb25maWcgPSB7XG4gIHBvc2l0aXZlTm9kZUNvbG9yOiBzdHJpbmc7XG4gIG5lZ2F0aXZlTm9kZUNvbG9yOiBzdHJpbmc7XG4gIG5ldXRyYWxOb2RlQ29sb3I6IHN0cmluZztcbiAgZGVmYXVsdE5vZGVDb2xvcjogc3RyaW5nO1xuICB3YXJuaW5nTm9kZUNvbG9yOiBzdHJpbmc7XG4gIHNoYWRvd0NvbG9yOiBzdHJpbmc7XG4gIGJvYXJkTGluZUNvbG9yOiBzdHJpbmc7XG4gIGFjdGl2ZUNvbG9yOiBzdHJpbmc7XG4gIGluYWN0aXZlQ29sb3I6IHN0cmluZztcbiAgYm9hcmRCYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcbiAgLy8gTWFya3VwIGNvbG9ycyBmb3IgZmxhdCB0aGVtZXNcbiAgZmxhdEJsYWNrQ29sb3I6IHN0cmluZztcbiAgZmxhdEJsYWNrQ29sb3JBbHQ6IHN0cmluZztcbiAgZmxhdFdoaXRlQ29sb3I6IHN0cmluZztcbiAgZmxhdFdoaXRlQ29sb3JBbHQ6IHN0cmluZztcbiAgLy8gQm9hcmQgZGlzcGxheSBwcm9wZXJ0aWVzXG4gIGJvYXJkRWRnZUxpbmVXaWR0aDogbnVtYmVyO1xuICBib2FyZExpbmVXaWR0aDogbnVtYmVyO1xuICBib2FyZExpbmVFeHRlbnQ6IG51bWJlcjtcbiAgc3RhclNpemU6IG51bWJlcjtcbiAgbWFya3VwTGluZVdpZHRoOiBudW1iZXI7XG4gIGhpZ2hsaWdodENvbG9yOiBzdHJpbmc7XG4gIHN0b25lUmF0aW86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFRoZW1lT3B0aW9ucyA9IHtcbiAgW2tleSBpbiBUaGVtZV0/OiBQYXJ0aWFsPFRoZW1lQ29uZmlnPjtcbn0gJiB7XG4gIGRlZmF1bHQ6IFRoZW1lQ29uZmlnO1xufTtcblxuZXhwb3J0IHR5cGUgVGhlbWVSZXNvdXJjZXMgPSB7XG4gIFtrZXkgaW4gVGhlbWVdOiB7Ym9hcmQ/OiBzdHJpbmc7IGJsYWNrczogc3RyaW5nW107IHdoaXRlczogc3RyaW5nW119O1xufTtcblxuZXhwb3J0IHR5cGUgQ29uc3VtZWRBbmFseXNpcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNlcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaXNEdXJpbmdTZWFyY2g6IGJvb2xlYW47XG4gIG1vdmVJbmZvczogTW92ZUluZm9bXTtcbiAgcm9vdEluZm86IFJvb3RJbmZvO1xuICBwb2xpY3k6IG51bWJlcltdO1xuICBvd25lcnNoaXA6IG51bWJlcltdO1xuICB0dXJuTnVtYmVyOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpc1BhcmFtcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaW5pdGlhbFBsYXllcjogc3RyaW5nO1xuICBtb3ZlczogYW55W107XG4gIHJ1bGVzOiBzdHJpbmc7XG4gIGtvbWk6IHN0cmluZztcbiAgYm9hcmRYU2l6ZTogbnVtYmVyO1xuICBib2FyZFlTaXplOiBudW1iZXI7XG4gIGluY2x1ZGVQb2xpY3k6IGJvb2xlYW47XG4gIHByaW9yaXR5OiBudW1iZXI7XG4gIG1heFZpc2l0czogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgTW92ZUluZm8gPSB7XG4gIGlzU3ltbWV0cnlPZjogc3RyaW5nO1xuICBsY2I6IG51bWJlcjtcbiAgbW92ZTogc3RyaW5nO1xuICBvcmRlcjogbnVtYmVyO1xuICBwcmlvcjogbnVtYmVyO1xuICBwdjogc3RyaW5nW107XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZU1lYW46IG51bWJlcjtcbiAgc2NvcmVTZWxmUGxheTogbnVtYmVyO1xuICBzY29yZVN0ZGV2OiBudW1iZXI7XG4gIHV0aWxpdHk6IG51bWJlcjtcbiAgdXRpbGl0eUxjYjogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFJvb3RJbmZvID0ge1xuICAvLyBjdXJyZW50UGxheWVyIGlzIG5vdCBvZmZpY2lhbGx5IHBhcnQgb2YgdGhlIEdUUCByZXN1bHRzIGJ1dCBpdCBpcyBoZWxwZnVsIHRvIGhhdmUgaXQgaGVyZSB0byBhdm9pZCBwYXNzaW5nIGl0IHRocm91Z2ggdGhlIGFyZ3VtZW50c1xuICBjdXJyZW50UGxheWVyOiBzdHJpbmc7XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZVNlbGZwbGF5OiBudW1iZXI7XG4gIHNjb3JlU3RkZXY6IG51bWJlcjtcbiAgdXRpbGl0eTogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ/OiBudW1iZXI7XG4gIHJhd1N0V3JFcnJvcj86IG51bWJlcjtcbiAgcmF3U3RTY29yZUVycm9yPzogbnVtYmVyO1xuICByYXdWYXJUaW1lTGVmdD86IG51bWJlcjtcbiAgLy8gR1RQIHJlc3VsdHMgZG9uJ3QgaW5jbHVkZSB0aGUgZm9sbG93aW5nIGZpZWxkc1xuICBsY2I/OiBudW1iZXI7XG4gIHN5bUhhc2g/OiBzdHJpbmc7XG4gIHRoaXNIYXNoPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQW5hbHlzaXNQb2ludE9wdGlvbnMgPSB7XG4gIHNob3dPcmRlcj86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZW51bSBLaSB7XG4gIEJsYWNrID0gMSxcbiAgV2hpdGUgPSAtMSxcbiAgRW1wdHkgPSAwLFxufVxuXG5leHBvcnQgZW51bSBUaGVtZSB7XG4gIEJsYWNrQW5kV2hpdGUgPSAnYmxhY2tfYW5kX3doaXRlJyxcbiAgRmxhdCA9ICdmbGF0JyxcbiAgU3ViZHVlZCA9ICdzdWJkdWVkJyxcbiAgU2hlbGxTdG9uZSA9ICdzaGVsbF9zdG9uZScsXG4gIFNsYXRlQW5kU2hlbGwgPSAnc2xhdGVfYW5kX3NoZWxsJyxcbiAgV2FsbnV0ID0gJ3dhbG51dCcsXG4gIFBob3RvcmVhbGlzdGljID0gJ3Bob3RvcmVhbGlzdGljJyxcbiAgRGFyayA9ICdkYXJrJyxcbiAgV2FybSA9ICd3YXJtJyxcbiAgWXVuemlNb25rZXlEYXJrID0gJ3l1bnppX21vbmtleV9kYXJrJyxcbiAgSGlnaENvbnRyYXN0ID0gJ2hpZ2hfY29udHJhc3QnLFxufVxuXG5leHBvcnQgZW51bSBBbmFseXNpc1BvaW50VGhlbWUge1xuICBEZWZhdWx0ID0gJ2RlZmF1bHQnLFxuICBQcm9ibGVtID0gJ3Byb2JsZW0nLFxufVxuXG5leHBvcnQgZW51bSBDZW50ZXIge1xuICBMZWZ0ID0gJ2wnLFxuICBSaWdodCA9ICdyJyxcbiAgVG9wID0gJ3QnLFxuICBCb3R0b20gPSAnYicsXG4gIFRvcFJpZ2h0ID0gJ3RyJyxcbiAgVG9wTGVmdCA9ICd0bCcsXG4gIEJvdHRvbUxlZnQgPSAnYmwnLFxuICBCb3R0b21SaWdodCA9ICdicicsXG4gIENlbnRlciA9ICdjJyxcbn1cblxuZXhwb3J0IGVudW0gRWZmZWN0IHtcbiAgTm9uZSA9ICcnLFxuICBCYW4gPSAnYmFuJyxcbiAgRGltID0gJ2RpbScsXG4gIEhpZ2hsaWdodCA9ICdoaWdobGlnaHQnLFxufVxuXG5leHBvcnQgZW51bSBNYXJrdXAge1xuICBDdXJyZW50ID0gJ2N1JyxcbiAgQ2lyY2xlID0gJ2NpJyxcbiAgQ2lyY2xlU29saWQgPSAnY2lzJyxcbiAgU3F1YXJlID0gJ3NxJyxcbiAgU3F1YXJlU29saWQgPSAnc3FzJyxcbiAgVHJpYW5nbGUgPSAndHJpJyxcbiAgQ3Jvc3MgPSAnY3InLFxuICBOdW1iZXIgPSAnbnVtJyxcbiAgTGV0dGVyID0gJ2xlJyxcbiAgUG9zaXRpdmVOb2RlID0gJ3BvcycsXG4gIFBvc2l0aXZlQWN0aXZlTm9kZSA9ICdwb3NhJyxcbiAgUG9zaXRpdmVEYXNoZWROb2RlID0gJ3Bvc2RhJyxcbiAgUG9zaXRpdmVEb3R0ZWROb2RlID0gJ3Bvc2R0JyxcbiAgUG9zaXRpdmVEYXNoZWRBY3RpdmVOb2RlID0gJ3Bvc2RhYScsXG4gIFBvc2l0aXZlRG90dGVkQWN0aXZlTm9kZSA9ICdwb3NkdGEnLFxuICBOZWdhdGl2ZU5vZGUgPSAnbmVnJyxcbiAgTmVnYXRpdmVBY3RpdmVOb2RlID0gJ25lZ2EnLFxuICBOZWdhdGl2ZURhc2hlZE5vZGUgPSAnbmVnZGEnLFxuICBOZWdhdGl2ZURvdHRlZE5vZGUgPSAnbmVnZHQnLFxuICBOZWdhdGl2ZURhc2hlZEFjdGl2ZU5vZGUgPSAnbmVnZGFhJyxcbiAgTmVnYXRpdmVEb3R0ZWRBY3RpdmVOb2RlID0gJ25lZ2R0YScsXG4gIE5ldXRyYWxOb2RlID0gJ25ldScsXG4gIE5ldXRyYWxBY3RpdmVOb2RlID0gJ25ldWEnLFxuICBOZXV0cmFsRGFzaGVkTm9kZSA9ICduZXVkYScsXG4gIE5ldXRyYWxEb3R0ZWROb2RlID0gJ25ldWR0JyxcbiAgTmV1dHJhbERhc2hlZEFjdGl2ZU5vZGUgPSAnbmV1ZHRhJyxcbiAgTmV1dHJhbERvdHRlZEFjdGl2ZU5vZGUgPSAnbmV1ZGFhJyxcbiAgV2FybmluZ05vZGUgPSAnd2EnLFxuICBXYXJuaW5nQWN0aXZlTm9kZSA9ICd3YWEnLFxuICBXYXJuaW5nRGFzaGVkTm9kZSA9ICd3YWRhJyxcbiAgV2FybmluZ0RvdHRlZE5vZGUgPSAnd2FkdCcsXG4gIFdhcm5pbmdEYXNoZWRBY3RpdmVOb2RlID0gJ3dhZGFhJyxcbiAgV2FybmluZ0RvdHRlZEFjdGl2ZU5vZGUgPSAnd2FkdGEnLFxuICBEZWZhdWx0Tm9kZSA9ICdkZScsXG4gIERlZmF1bHRBY3RpdmVOb2RlID0gJ2RlYScsXG4gIERlZmF1bHREYXNoZWROb2RlID0gJ2RlZGEnLFxuICBEZWZhdWx0RG90dGVkTm9kZSA9ICdkZWR0JyxcbiAgRGVmYXVsdERhc2hlZEFjdGl2ZU5vZGUgPSAnZGVkYWEnLFxuICBEZWZhdWx0RG90dGVkQWN0aXZlTm9kZSA9ICdkZWR0YScsXG4gIE5vZGUgPSAnbm9kZScsXG4gIERhc2hlZE5vZGUgPSAnZGFub2RlJyxcbiAgRG90dGVkTm9kZSA9ICdkdG5vZGUnLFxuICBBY3RpdmVOb2RlID0gJ2Fub2RlJyxcbiAgRGFzaGVkQWN0aXZlTm9kZSA9ICdkYW5vZGUnLFxuICBIaWdobGlnaHQgPSAnaGwnLFxuICBOb25lID0gJycsXG59XG5cbmV4cG9ydCBlbnVtIEN1cnNvciB7XG4gIE5vbmUgPSAnJyxcbiAgQmxhY2tTdG9uZSA9ICdiJyxcbiAgV2hpdGVTdG9uZSA9ICd3JyxcbiAgQ2lyY2xlID0gJ2MnLFxuICBTcXVhcmUgPSAncycsXG4gIFRyaWFuZ2xlID0gJ3RyaScsXG4gIENyb3NzID0gJ2NyJyxcbiAgQ2xlYXIgPSAnY2wnLFxuICBUZXh0ID0gJ3QnLFxufVxuXG5leHBvcnQgZW51bSBQcm9ibGVtQW5zd2VyVHlwZSB7XG4gIFJpZ2h0ID0gJzEnLFxuICBXcm9uZyA9ICcyJyxcbiAgVmFyaWFudCA9ICczJyxcbn1cblxuZXhwb3J0IGVudW0gUGF0aERldGVjdGlvblN0cmF0ZWd5IHtcbiAgUG9zdCA9ICdwb3N0JyxcbiAgUHJlID0gJ3ByZScsXG4gIEJvdGggPSAnYm90aCcsXG59XG4iLCJpbXBvcnQge2NodW5rfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtUaGVtZSwgVGhlbWVDb25maWd9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBzZXR0aW5ncyA9IHtjZG46ICdodHRwczovL3Muc2hhb3dxLmNvbSd9O1xuXG5leHBvcnQgY29uc3QgQkFTRV9USEVNRV9DT05GSUc6IFRoZW1lQ29uZmlnID0ge1xuICBwb3NpdGl2ZU5vZGVDb2xvcjogJyM0ZDdjMGYnLFxuICBuZWdhdGl2ZU5vZGVDb2xvcjogJyNiOTFjMWMnLFxuICBuZXV0cmFsTm9kZUNvbG9yOiAnI2ExNjIwNycsXG4gIGRlZmF1bHROb2RlQ29sb3I6ICcjNDA0MDQwJyxcbiAgd2FybmluZ05vZGVDb2xvcjogJyNmZmRmMjAnLFxuICBzaGFkb3dDb2xvcjogJyM1NTU1NTUnLFxuICBib2FyZExpbmVDb2xvcjogJyMwMDAwMDAnLFxuICBhY3RpdmVDb2xvcjogJyMwMDAwMDAnLFxuICBpbmFjdGl2ZUNvbG9yOiAnIzY2NjY2NicsXG4gIGJvYXJkQmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRicsXG4gIGZsYXRCbGFja0NvbG9yOiAnIzAwMDAwMCcsXG4gIGZsYXRCbGFja0NvbG9yQWx0OiAnIzAwMDAwMCcsIC8vIEFsdGVybmF0aXZlLCB0ZW1wb3JhcmlseSBzYW1lIGFzIG1haW4gY29sb3JcbiAgZmxhdFdoaXRlQ29sb3I6ICcjRkZGRkZGJyxcbiAgZmxhdFdoaXRlQ29sb3JBbHQ6ICcjRkZGRkZGJywgLy8gQWx0ZXJuYXRpdmUsIHRlbXBvcmFyaWx5IHNhbWUgYXMgbWFpbiBjb2xvclxuICBib2FyZEVkZ2VMaW5lV2lkdGg6IDIsXG4gIGJvYXJkTGluZVdpZHRoOiAxLjIsXG4gIGJvYXJkTGluZUV4dGVudDogMC41LFxuICBzdGFyU2l6ZTogMyxcbiAgbWFya3VwTGluZVdpZHRoOiAyLFxuICBoaWdobGlnaHRDb2xvcjogJyNmZmViNjQnLFxuICBzdG9uZVJhdGlvOiAwLjQ1LFxufTtcblxuZXhwb3J0IGNvbnN0IE1BWF9CT0FSRF9TSVpFID0gMjk7XG5leHBvcnQgY29uc3QgREVGQVVMVF9CT0FSRF9TSVpFID0gMTk7XG5leHBvcnQgY29uc3QgQTFfTEVUVEVSUyA9IFtcbiAgJ0EnLFxuICAnQicsXG4gICdDJyxcbiAgJ0QnLFxuICAnRScsXG4gICdGJyxcbiAgJ0cnLFxuICAnSCcsXG4gICdKJyxcbiAgJ0snLFxuICAnTCcsXG4gICdNJyxcbiAgJ04nLFxuICAnTycsXG4gICdQJyxcbiAgJ1EnLFxuICAnUicsXG4gICdTJyxcbiAgJ1QnLFxuXTtcbmV4cG9ydCBjb25zdCBBMV9MRVRURVJTX1dJVEhfSSA9IFtcbiAgJ0EnLFxuICAnQicsXG4gICdDJyxcbiAgJ0QnLFxuICAnRScsXG4gICdGJyxcbiAgJ0cnLFxuICAnSCcsXG4gICdJJyxcbiAgJ0onLFxuICAnSycsXG4gICdMJyxcbiAgJ00nLFxuICAnTicsXG4gICdPJyxcbiAgJ1AnLFxuICAnUScsXG4gICdSJyxcbiAgJ1MnLFxuXTtcbmV4cG9ydCBjb25zdCBBMV9OVU1CRVJTID0gW1xuICAxOSwgMTgsIDE3LCAxNiwgMTUsIDE0LCAxMywgMTIsIDExLCAxMCwgOSwgOCwgNywgNiwgNSwgNCwgMywgMiwgMSxcbl07XG5leHBvcnQgY29uc3QgU0dGX0xFVFRFUlMgPSBbXG4gICdhJyxcbiAgJ2InLFxuICAnYycsXG4gICdkJyxcbiAgJ2UnLFxuICAnZicsXG4gICdnJyxcbiAgJ2gnLFxuICAnaScsXG4gICdqJyxcbiAgJ2snLFxuICAnbCcsXG4gICdtJyxcbiAgJ24nLFxuICAnbycsXG4gICdwJyxcbiAgJ3EnLFxuICAncicsXG4gICdzJyxcbl07XG4vLyBleHBvcnQgY29uc3QgQkxBTktfQVJSQVkgPSBjaHVuayhuZXcgQXJyYXkoMzYxKS5maWxsKDApLCAxOSk7XG5leHBvcnQgY29uc3QgRE9UX1NJWkUgPSAzO1xuZXhwb3J0IGNvbnN0IEVYUEFORF9IID0gNTtcbmV4cG9ydCBjb25zdCBFWFBBTkRfViA9IDU7XG5leHBvcnQgY29uc3QgUkVTUE9OU0VfVElNRSA9IDEwMDtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgYm9hcmRTaXplOiAxOSxcbiAgcGFkZGluZzogMTUsXG4gIGV4dGVudDogMixcbiAgaW50ZXJhY3RpdmU6IGZhbHNlLFxuICBjb29yZGluYXRlOiB0cnVlLFxuICB0aGVtZTogVGhlbWUuRmxhdCxcbiAgYmFja2dyb3VuZDogZmFsc2UsXG4gIHpvb206IGZhbHNlLFxuICBzaG93QW5hbHlzaXM6IGZhbHNlLFxufTtcblxuZXhwb3J0IGNvbnN0IFRIRU1FX1JFU09VUkNFUzoge1xuICBba2V5IGluIFRoZW1lXToge1xuICAgIGJvYXJkPzogc3RyaW5nO1xuICAgIGJsYWNrczogc3RyaW5nW107XG4gICAgd2hpdGVzOiBzdHJpbmdbXTtcbiAgICBsb3dSZXM/OiB7XG4gICAgICBib2FyZD86IHN0cmluZztcbiAgICAgIGJsYWNrczogc3RyaW5nW107XG4gICAgICB3aGl0ZXM6IHN0cmluZ1tdO1xuICAgIH07XG4gICAgbWljcm9SZXM/OiB7XG4gICAgICBib2FyZD86IHN0cmluZztcbiAgICAgIGJsYWNrczogc3RyaW5nW107XG4gICAgICB3aGl0ZXM6IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59ID0ge1xuICBbVGhlbWUuQmxhY2tBbmRXaGl0ZV06IHtcbiAgICBibGFja3M6IFtdLFxuICAgIHdoaXRlczogW10sXG4gIH0sXG4gIFtUaGVtZS5TdWJkdWVkXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zdWJkdWVkL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc3ViZHVlZC9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zdWJkdWVkL3doaXRlLnBuZ2BdLFxuICB9LFxuICBbVGhlbWUuU2hlbGxTdG9uZV06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMC5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUxLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTIucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMy5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGU0LnBuZ2AsXG4gICAgXSxcbiAgfSxcbiAgW1RoZW1lLlNsYXRlQW5kU2hlbGxdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlMS5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlMi5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlMy5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlNC5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlNS5wbmdgLFxuICAgIF0sXG4gICAgd2hpdGVzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGwxLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGwyLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGwzLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGw0LnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGw1LnBuZ2AsXG4gICAgXSxcbiAgfSxcbiAgW1RoZW1lLldhbG51dF06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvd2FsbnV0L2JvYXJkLmpwZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvd2FsbnV0L2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3dhbG51dC93aGl0ZS5wbmdgXSxcbiAgfSxcbiAgW1RoZW1lLlBob3RvcmVhbGlzdGljXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9waG90b3JlYWxpc3RpYy9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3Bob3RvcmVhbGlzdGljL2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3Bob3RvcmVhbGlzdGljL3doaXRlLnBuZ2BdLFxuICB9LFxuICBbVGhlbWUuRmxhdF06IHtcbiAgICBibGFja3M6IFtdLFxuICAgIHdoaXRlczogW10sXG4gIH0sXG4gIFtUaGVtZS5XYXJtXToge1xuICAgIGJsYWNrczogW10sXG4gICAgd2hpdGVzOiBbXSxcbiAgfSxcbiAgW1RoZW1lLkRhcmtdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxuICBbVGhlbWUuWXVuemlNb25rZXlEYXJrXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQveXVuemktbW9ua2V5LWRhcmsvWU1ELUJvLVYxMF9sZXNzYm9yZGVyMTkyMHB4LnBuZ2AsXG4gICAgYmxhY2tzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQveXVuemktbW9ua2V5LWRhcmsvWU1ELUItdjE0LTMzOHB4LnBuZ2AsXG4gICAgXSxcbiAgICB3aGl0ZXM6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3ltZC95dW56aS1tb25rZXktZGFyay9ZTUQtVy12MTQtMzM4cHgucG5nYCxcbiAgICBdLFxuICAgIGxvd1Jlczoge1xuICAgICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3ltZC95dW56aS1tb25rZXktZGFyay9ZTUQtQm8tVjEwX2xlc3Nib3JkZXItOTYwcHgucG5nYCxcbiAgICAgIGJsYWNrczogW1xuICAgICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQveXVuemktbW9ua2V5LWRhcmsvWU1ELUItdjE0LTEzNXB4LnBuZ2AsXG4gICAgICBdLFxuICAgICAgd2hpdGVzOiBbXG4gICAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3ltZC95dW56aS1tb25rZXktZGFyay9ZTUQtVy12MTQtMTM1cHgucG5nYCxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBtaWNyb1Jlczoge1xuICAgICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3ltZC9ZTUQtQm8tVjEwX2xlc3Nib3JkZXItOTYwcHgucG5nYCxcbiAgICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3ltZC9ZTUQtQl8xOTd0bzU5cHgucG5nYF0sXG4gICAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS95bWQvWU1ELVdfMTk3dG81OXB4LnBuZ2BdLFxuICAgIH0sXG4gIH0sXG4gIFtUaGVtZS5IaWdoQ29udHJhc3RdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IExJR0hUX0dSRUVOX1JHQiA9ICdyZ2JhKDEzNiwgMTcwLCA2MCwgMSknO1xuZXhwb3J0IGNvbnN0IExJR0hUX1lFTExPV19SR0IgPSAncmdiYSgyMDYsIDIxMCwgODMsIDEpJztcbmV4cG9ydCBjb25zdCBZRUxMT1dfUkdCID0gJ3JnYmEoMjQyLCAyMTcsIDYwLCAxKSc7XG5leHBvcnQgY29uc3QgTElHSFRfUkVEX1JHQiA9ICdyZ2JhKDIzNiwgMTQ2LCA3MywgMSknO1xuIiwiZXhwb3J0IGNvbnN0IE1PVkVfUFJPUF9MSVNUID0gW1xuICAnQicsXG4gIC8vIEtPIGlzIHN0YW5kYXJkIGluIG1vdmUgbGlzdCBidXQgdXN1YWxseSBiZSB1c2VkIGZvciBrb21pIGluIGdhbWVpbmZvIHByb3BzXG4gIC8vICdLTycsXG4gICdNTicsXG4gICdXJyxcbl07XG5leHBvcnQgY29uc3QgU0VUVVBfUFJPUF9MSVNUID0gW1xuICAnQUInLFxuICAnQUUnLFxuICAnQVcnLFxuICAvL1RPRE86IFBMIGlzIGEgdmFsdWUgb2YgY29sb3IgdHlwZVxuICAvLyAnUEwnXG5dO1xuZXhwb3J0IGNvbnN0IE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QgPSBbXG4gICdBJyxcbiAgJ0MnLFxuICAnRE0nLFxuICAnR0InLFxuICAnR1cnLFxuICAnSE8nLFxuICAnTicsXG4gICdVQycsXG4gICdWJyxcbl07XG5leHBvcnQgY29uc3QgTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCA9IFtcbiAgJ0JNJyxcbiAgJ0RPJyxcbiAgJ0lUJyxcbiAgLy8gVEUgaXMgc3RhbmRhcmQgaW4gbW92ZSBhbm5vdGF0aW9uIGZvciB0ZXN1amlcbiAgLy8gJ1RFJyxcbl07XG5leHBvcnQgY29uc3QgTUFSS1VQX1BST1BfTElTVCA9IFtcbiAgJ0FSJyxcbiAgJ0NSJyxcbiAgJ0xCJyxcbiAgJ0xOJyxcbiAgJ01BJyxcbiAgJ1NMJyxcbiAgJ1NRJyxcbiAgJ1RSJyxcbl07XG5cbmV4cG9ydCBjb25zdCBST09UX1BST1BfTElTVCA9IFsnQVAnLCAnQ0EnLCAnRkYnLCAnR00nLCAnU1QnLCAnU1onXTtcbmV4cG9ydCBjb25zdCBHQU1FX0lORk9fUFJPUF9MSVNUID0gW1xuICAvL1RFIE5vbi1zdGFuZGFyZFxuICAnVEUnLFxuICAvL0tPIE5vbi1zdGFuZGFyZFxuICAnS08nLFxuICAnQU4nLFxuICAnQlInLFxuICAnQlQnLFxuICAnQ1AnLFxuICAnRFQnLFxuICAnRVYnLFxuICAnR04nLFxuICAnR0MnLFxuICAnT04nLFxuICAnT1QnLFxuICAnUEInLFxuICAnUEMnLFxuICAnUFcnLFxuICAnUkUnLFxuICAnUk8nLFxuICAnUlUnLFxuICAnU08nLFxuICAnVE0nLFxuICAnVVMnLFxuICAnV1InLFxuICAnV1QnLFxuXTtcbmV4cG9ydCBjb25zdCBUSU1JTkdfUFJPUF9MSVNUID0gWydCTCcsICdPQicsICdPVycsICdXTCddO1xuZXhwb3J0IGNvbnN0IE1JU0NFTExBTkVPVVNfUFJPUF9MSVNUID0gWydGRycsICdQTScsICdWVyddO1xuXG5leHBvcnQgY29uc3QgQ1VTVE9NX1BST1BfTElTVCA9IFsnUEknLCAnUEFJJywgJ05JRCcsICdQQVQnXTtcblxuZXhwb3J0IGNvbnN0IExJU1RfT0ZfUE9JTlRTX1BST1AgPSBbJ0FCJywgJ0FFJywgJ0FXJywgJ01BJywgJ1NMJywgJ1NRJywgJ1RSJ107XG5cbmNvbnN0IFRPS0VOX1JFR0VYID0gbmV3IFJlZ0V4cCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbi8vIFVwZGF0ZWQgcmVnZXggdG8gaGFuZGxlIGVzY2FwZWQgYnJhY2tldHMgcHJvcGVybHkgZm9yIFRleHQgdHlwZSBwcm9wZXJ0aWVzXG4vLyAoPzpbXlxcXVxcXFxdfFxcXFwuKSogbWF0Y2hlcyBhbnkgY2hhciBleGNlcHQgXSBhbmQgXFwsIE9SIGFueSBlc2NhcGVkIGNoYXJcbmNvbnN0IFRPS0VOX1JFR0VYX1dJVEhfRVNDQVBFUyA9IG5ldyBSZWdFeHAoLyhbQS1aXSopXFxbKCg/OlteXFxdXFxcXF18XFxcXC4pKilcXF0vKTtcblxuZXhwb3J0IGNsYXNzIFNnZlByb3BCYXNlIHtcbiAgcHVibGljIHRva2VuOiBzdHJpbmc7XG4gIHB1YmxpYyB0eXBlOiBzdHJpbmcgPSAnLSc7XG4gIHByb3RlY3RlZCBfdmFsdWU6IHN0cmluZyA9ICcnO1xuICBwcm90ZWN0ZWQgX3ZhbHVlczogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSBhcyBzdHJpbmc7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYCR7dGhpcy50b2tlbn0ke3RoaXMuX3ZhbHVlcy5tYXAodiA9PiBgWyR7dn1dYCkuam9pbignJyl9YDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW92ZVByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdtb3ZlJztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE1vdmVQcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE1vdmVQcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0dXBQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdzZXR1cCc7XG4gIH1cblxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IHRva2VuTWF0Y2ggPSBzdHIubWF0Y2goVE9LRU5fUkVHRVgpO1xuICAgIGNvbnN0IHZhbE1hdGNoZXMgPSBzdHIubWF0Y2hBbGwoL1xcWyhbXFxzXFxTXSo/KVxcXS9nKTtcblxuICAgIGxldCB0b2tlbiA9ICcnO1xuICAgIGNvbnN0IHZhbHMgPSBbLi4udmFsTWF0Y2hlc10ubWFwKG0gPT4gbVsxXSk7XG4gICAgaWYgKHRva2VuTWF0Y2gpIHRva2VuID0gdG9rZW5NYXRjaFsxXTtcbiAgICByZXR1cm4gbmV3IFNldHVwUHJvcCh0b2tlbiwgdmFscyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9kZUFubm90YXRpb25Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbm9kZS1hbm5vdGF0aW9uJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKFRPS0VOX1JFR0VYX1dJVEhfRVNDQVBFUyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE5vZGVBbm5vdGF0aW9uUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOb2RlQW5ub3RhdGlvblByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVzY2FwZXMgdW5lc2NhcGVkIHJpZ2h0IGJyYWNrZXRzIGluIFNHRiBwcm9wZXJ0eSB2YWx1ZXNcbiAgICogT25seSBlc2NhcGVzIGJyYWNrZXRzIHRoYXQgYXJlIG5vdCBhbHJlYWR5IGVzY2FwZWRcbiAgICovXG4gIHByaXZhdGUgZXNjYXBlVmFsdWUodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgLy8gUmVwbGFjZSBdIHdpdGggXFxdIG9ubHkgaWYgaXQncyBub3QgYWxyZWFkeSBlc2NhcGVkXG4gICAgLy8gVGhpcyByZWdleCBsb29rcyBmb3IgXSB0aGF0IGlzIE5PVCBwcmVjZWRlZCBieSBcXFxuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oPzwhXFxcXClcXF0vZywgJ1xcXFxdJyk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYCR7dGhpcy50b2tlbn0ke3RoaXMuX3ZhbHVlc1xuICAgICAgLm1hcCh2ID0+IGBbJHt0aGlzLmVzY2FwZVZhbHVlKHYpfV1gKVxuICAgICAgLmpvaW4oJycpfWA7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vdmVBbm5vdGF0aW9uUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ21vdmUtYW5ub3RhdGlvbic7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaChUT0tFTl9SRUdFWF9XSVRIX0VTQ0FQRVMpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBNb3ZlQW5ub3RhdGlvblByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTW92ZUFubm90YXRpb25Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7fVxuZXhwb3J0IGNsYXNzIE1hcmt1cFByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ21hcmt1cCc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0b2tlbk1hdGNoID0gc3RyLm1hdGNoKFRPS0VOX1JFR0VYKTtcbiAgICBjb25zdCB2YWxNYXRjaGVzID0gc3RyLm1hdGNoQWxsKC9cXFsoW1xcc1xcU10qPylcXF0vZyk7XG5cbiAgICBsZXQgdG9rZW4gPSAnJztcbiAgICBjb25zdCB2YWxzID0gWy4uLnZhbE1hdGNoZXNdLm1hcChtID0+IG1bMV0pO1xuICAgIGlmICh0b2tlbk1hdGNoKSB0b2tlbiA9IHRva2VuTWF0Y2hbMV07XG4gICAgcmV0dXJuIG5ldyBNYXJrdXBQcm9wKHRva2VuLCB2YWxzKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb290UHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ3Jvb3QnO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goVE9LRU5fUkVHRVhfV0lUSF9FU0NBUEVTKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgUm9vdFByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUm9vdFByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHYW1lSW5mb1Byb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdnYW1lLWluZm8nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goVE9LRU5fUkVHRVhfV0lUSF9FU0NBUEVTKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgR2FtZUluZm9Qcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEdhbWVJbmZvUHJvcCgnJywgJycpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnY3VzdG9tJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKFRPS0VOX1JFR0VYX1dJVEhfRVNDQVBFUyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IEN1c3RvbVByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ3VzdG9tUHJvcCgnJywgJycpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1pbmdQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnVGltaW5nJztcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWlzY2VsbGFuZW91c1Byb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7fVxuIiwiaW1wb3J0IHtjbG9uZURlZXB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1NHRl9MRVRURVJTfSBmcm9tICcuL2NvbnN0JztcblxuLy8gVE9ETzogRHVwbGljYXRlIHdpdGggaGVscGVycy50cyB0byBhdm9pZCBjaXJjdWxhciBkZXBlbmRlbmN5XG5leHBvcnQgY29uc3Qgc2dmVG9Qb3MgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qga2kgPSBzdHJbMF0gPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3QgdGVtcFN0ciA9IC9cXFsoLiopXFxdLy5leGVjKHN0cik7XG4gIGlmICh0ZW1wU3RyKSB7XG4gICAgY29uc3QgcG9zID0gdGVtcFN0clsxXTtcbiAgICBjb25zdCB4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihwb3NbMF0pO1xuICAgIGNvbnN0IHkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1sxXSk7XG4gICAgcmV0dXJuIHt4LCB5LCBraX07XG4gIH1cbiAgcmV0dXJuIHt4OiAtMSwgeTogLTEsIGtpOiAwfTtcbn07XG5cbmxldCBsaWJlcnRpZXMgPSAwO1xubGV0IHJlY3Vyc2lvblBhdGg6IHN0cmluZ1tdID0gW107XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc2l6ZSBvZiBhIG1hdHJpeC5cbiAqIEBwYXJhbSBtYXQgVGhlIG1hdHJpeCB0byBjYWxjdWxhdGUgdGhlIHNpemUgb2YuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1iZXIgb2Ygcm93cyBhbmQgY29sdW1ucyBpbiB0aGUgbWF0cml4LlxuICovXG5jb25zdCBjYWxjU2l6ZSA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgY29uc3Qgcm93c1NpemUgPSBtYXQubGVuZ3RoO1xuICBjb25zdCBjb2x1bW5zU2l6ZSA9IG1hdC5sZW5ndGggPiAwID8gbWF0WzBdLmxlbmd0aCA6IDA7XG4gIHJldHVybiBbcm93c1NpemUsIGNvbHVtbnNTaXplXTtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbGliZXJ0eSBvZiBhIHN0b25lIG9uIHRoZSBib2FyZC5cbiAqIEBwYXJhbSBtYXQgLSBUaGUgYm9hcmQgbWF0cml4LlxuICogQHBhcmFtIHggLSBUaGUgeC1jb29yZGluYXRlIG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSB5IC0gVGhlIHktY29vcmRpbmF0ZSBvZiB0aGUgc3RvbmUuXG4gKiBAcGFyYW0ga2kgLSBUaGUgdmFsdWUgb2YgdGhlIHN0b25lLlxuICovXG5jb25zdCBjYWxjTGliZXJ0eUNvcmUgPSAobWF0OiBudW1iZXJbXVtdLCB4OiBudW1iZXIsIHk6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCBzaXplID0gY2FsY1NpemUobWF0KTtcbiAgaWYgKHggPj0gMCAmJiB4IDwgc2l6ZVsxXSAmJiB5ID49IDAgJiYgeSA8IHNpemVbMF0pIHtcbiAgICBpZiAobWF0W3hdW3ldID09PSBraSAmJiAhcmVjdXJzaW9uUGF0aC5pbmNsdWRlcyhgJHt4fSwke3l9YCkpIHtcbiAgICAgIHJlY3Vyc2lvblBhdGgucHVzaChgJHt4fSwke3l9YCk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4IC0gMSwgeSwga2kpO1xuICAgICAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCArIDEsIHksIGtpKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHgsIHkgLSAxLCBraSk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4LCB5ICsgMSwga2kpO1xuICAgIH0gZWxzZSBpZiAobWF0W3hdW3ldID09PSAwKSB7XG4gICAgICBsaWJlcnRpZXMgKz0gMTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGNhbGNMaWJlcnR5ID0gKG1hdDogbnVtYmVyW11bXSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3Qgc2l6ZSA9IGNhbGNTaXplKG1hdCk7XG4gIGxpYmVydGllcyA9IDA7XG4gIHJlY3Vyc2lvblBhdGggPSBbXTtcblxuICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+IHNpemVbMV0gLSAxIHx8IHkgPiBzaXplWzBdIC0gMSkge1xuICAgIHJldHVybiB7XG4gICAgICBsaWJlcnR5OiA0LFxuICAgICAgcmVjdXJzaW9uUGF0aDogW10sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChtYXRbeF1beV0gPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGliZXJ0eTogNCxcbiAgICAgIHJlY3Vyc2lvblBhdGg6IFtdLFxuICAgIH07XG4gIH1cbiAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCwgeSwga2kpO1xuICByZXR1cm4ge1xuICAgIGxpYmVydHk6IGxpYmVydGllcyxcbiAgICByZWN1cnNpb25QYXRoLFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGV4ZWNDYXB0dXJlID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogbnVtYmVyXG4pID0+IHtcbiAgY29uc3QgbmV3QXJyYXkgPSBtYXQ7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5VXAsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhVcH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSxcbiAgICBqIC0gMSxcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eURvd24sIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhEb3dufSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogKyAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5TGVmdCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aExlZnR9ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGkgLSAxLFxuICAgIGosXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlSaWdodCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFJpZ2h0fSA9XG4gICAgY2FsY0xpYmVydHkobWF0LCBpICsgMSwgaiwga2kpO1xuICBpZiAobGliZXJ0eVVwID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aFVwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGl0ZW0uc3BsaXQoJywnKTtcbiAgICAgIG5ld0FycmF5W3BhcnNlSW50KGNvb3JkWzBdKV1bcGFyc2VJbnQoY29vcmRbMV0pXSA9IDA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGxpYmVydHlEb3duID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aERvd24uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICBpZiAobGliZXJ0eUxlZnQgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoTGVmdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdBcnJheVtwYXJzZUludChjb29yZFswXSldW3BhcnNlSW50KGNvb3JkWzFdKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIGlmIChsaWJlcnR5UmlnaHQgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoUmlnaHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbmV3QXJyYXk7XG59O1xuXG5jb25zdCBjYW5DYXB0dXJlID0gKG1hdDogbnVtYmVyW11bXSwgaTogbnVtYmVyLCBqOiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlVcCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFVwfSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogLSAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5RG93biwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aERvd259ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiArIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlMZWZ0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoTGVmdH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSAtIDEsXG4gICAgaixcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVJpZ2h0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoUmlnaHR9ID1cbiAgICBjYWxjTGliZXJ0eShtYXQsIGkgKyAxLCBqLCBraSk7XG4gIGlmIChsaWJlcnR5VXAgPT09IDAgJiYgcmVjdXJzaW9uUGF0aFVwLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobGliZXJ0eURvd24gPT09IDAgJiYgcmVjdXJzaW9uUGF0aERvd24ubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChsaWJlcnR5TGVmdCA9PT0gMCAmJiByZWN1cnNpb25QYXRoTGVmdC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGxpYmVydHlSaWdodCA9PT0gMCAmJiByZWN1cnNpb25QYXRoUmlnaHQubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogQ29tcGFyZSBpZiB0d28gYm9hcmQgc3RhdGVzIGFyZSBjb21wbGV0ZWx5IGlkZW50aWNhbFxuICovXG5leHBvcnQgY29uc3QgYm9hcmRTdGF0ZXNFcXVhbCA9IChcbiAgYm9hcmQxOiBudW1iZXJbXVtdLFxuICBib2FyZDI6IG51bWJlcltdW11cbik6IGJvb2xlYW4gPT4ge1xuICBpZiAoYm9hcmQxLmxlbmd0aCAhPT0gYm9hcmQyLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQxLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGJvYXJkMVtpXS5sZW5ndGggIT09IGJvYXJkMltpXS5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkMVtpXS5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKGJvYXJkMVtpXVtqXSAhPT0gYm9hcmQyW2ldW2pdKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFNpbXVsYXRlIHRoZSBib2FyZCBzdGF0ZSBhZnRlciBtYWtpbmcgYSBtb3ZlIGF0IHNwZWNpZmllZCBwb3NpdGlvbiAoaW5jbHVkaW5nIGNhcHR1cmVzKVxuICovXG5leHBvcnQgY29uc3Qgc2ltdWxhdGVNb3ZlV2l0aENhcHR1cmUgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgaTogbnVtYmVyLFxuICBqOiBudW1iZXIsXG4gIGtpOiBudW1iZXJcbik6IG51bWJlcltdW10gPT4ge1xuICBjb25zdCBuZXdNYXQgPSBjbG9uZURlZXAobWF0KTtcbiAgbmV3TWF0W2ldW2pdID0ga2k7XG5cbiAgLy8gRXhlY3V0ZSBjYXB0dXJlc1xuICByZXR1cm4gZXhlY0NhcHR1cmUobmV3TWF0LCBpLCBqLCAta2kpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbk1vdmUgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgaTogbnVtYmVyLFxuICBqOiBudW1iZXIsXG4gIGtpOiBudW1iZXIsXG4gIHByZXZpb3VzQm9hcmRTdGF0ZT86IG51bWJlcltdW10gfCBudWxsXG4pID0+IHtcbiAgaWYgKGkgPCAwIHx8IGogPCAwIHx8IGkgPj0gbWF0Lmxlbmd0aCB8fCBqID49IChtYXRbMF0/Lmxlbmd0aCA/PyAwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChtYXRbaV1bal0gIT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBTaW11bGF0ZSB0aGUgYm9hcmQgc3RhdGUgYWZ0ZXIgdGhlIG1vdmUgKGluY2x1ZGluZyBjYXB0dXJlcylcbiAgY29uc3QgYm9hcmRTdGF0ZUFmdGVyTW92ZSA9IHNpbXVsYXRlTW92ZVdpdGhDYXB0dXJlKG1hdCwgaSwgaiwga2kpO1xuXG4gIC8vIEtvIHJ1bGUgY2hlY2s6IGlmIHRoZSBib2FyZCBzdGF0ZSBhZnRlciBtb3ZlIGlzIGlkZW50aWNhbCB0byBwcmV2aW91cyBzdGF0ZSwgaXQgdmlvbGF0ZXMga28gcnVsZVxuICBpZiAoXG4gICAgcHJldmlvdXNCb2FyZFN0YXRlICYmXG4gICAgYm9hcmRTdGF0ZXNFcXVhbChib2FyZFN0YXRlQWZ0ZXJNb3ZlLCBwcmV2aW91c0JvYXJkU3RhdGUpXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIENoZWNrIHN1aWNpZGUgcnVsZTogaWYgYWZ0ZXIgcGxhY2luZyB0aGUgc3RvbmUgaXQgaGFzIG5vIGxpYmVydGllcyBhbmQgY2Fubm90IGNhcHR1cmUgb3Bwb25lbnQgc3RvbmVzLCBpdCdzIGlsbGVnYWxcbiAgY29uc3QgbmV3QXJyYXkgPSBjbG9uZURlZXAobWF0KTtcbiAgbmV3QXJyYXlbaV1bal0gPSBraTtcbiAgY29uc3Qge2xpYmVydHl9ID0gY2FsY0xpYmVydHkobmV3QXJyYXksIGksIGosIGtpKTtcblxuICBpZiAoY2FuQ2FwdHVyZShuZXdBcnJheSwgaSwgaiwgLWtpKSkge1xuICAgIHJldHVybiB0cnVlOyAvLyBDYW4gY2FwdHVyZSBvcHBvbmVudCBzdG9uZXMsIGxlZ2FsIG1vdmVcbiAgfVxuICBpZiAoY2FuQ2FwdHVyZShuZXdBcnJheSwgaSwgaiwga2kpKSB7XG4gICAgcmV0dXJuIGZhbHNlOyAvLyBPd24gc3RvbmVzIHdvdWxkIGJlIGNhcHR1cmVkLCBpbGxlZ2FsIG1vdmVcbiAgfVxuICBpZiAobGliZXJ0eSA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTsgLy8gTm8gbGliZXJ0aWVzIGFuZCBjYW5ub3QgY2FwdHVyZSwgaWxsZWdhbCBtb3ZlXG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hvd0tpID0gKFxuICBhcnJheTogbnVtYmVyW11bXSxcbiAgc3RlcHM6IHN0cmluZ1tdLFxuICBpc0NhcHR1cmVkID0gdHJ1ZVxuKSA9PiB7XG4gIGxldCBuZXdNYXQgPSBjbG9uZURlZXAoYXJyYXkpO1xuICBsZXQgaGFzTW92ZWQgPSBmYWxzZTtcbiAgc3RlcHMuZm9yRWFjaChzdHIgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAga2ksXG4gICAgfToge1xuICAgICAgeDogbnVtYmVyO1xuICAgICAgeTogbnVtYmVyO1xuICAgICAga2k6IG51bWJlcjtcbiAgICB9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgICBpZiAoaXNDYXB0dXJlZCkge1xuICAgICAgaWYgKGNhbk1vdmUobmV3TWF0LCB4LCB5LCBraSkpIHtcbiAgICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICAgIG5ld01hdCA9IGV4ZWNDYXB0dXJlKG5ld01hdCwgeCwgeSwgLWtpKTtcbiAgICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJyYW5nZW1lbnQ6IG5ld01hdCxcbiAgICBoYXNNb3ZlZCxcbiAgfTtcbn07XG4iLCJpbXBvcnQge2NvbXBhY3QsIHJlcGxhY2V9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBidWlsZFByb3BlcnR5VmFsdWVSYW5nZXMsXG4gIGlzSW5BbnlSYW5nZSxcbiAgY2FsY0hhc2gsXG4gIGdldERlZHVwbGljYXRlZFByb3BzLFxuICBnZXROb2RlTnVtYmVyLFxufSBmcm9tICcuL2hlbHBlcnMnO1xuXG5pbXBvcnQge1RyZWVNb2RlbCwgVE5vZGV9IGZyb20gJy4vdHJlZSc7XG5pbXBvcnQge1xuICBNb3ZlUHJvcCxcbiAgU2V0dXBQcm9wLFxuICBSb290UHJvcCxcbiAgR2FtZUluZm9Qcm9wLFxuICBTZ2ZQcm9wQmFzZSxcbiAgTm9kZUFubm90YXRpb25Qcm9wLFxuICBNb3ZlQW5ub3RhdGlvblByb3AsXG4gIE1hcmt1cFByb3AsXG4gIEN1c3RvbVByb3AsXG4gIFJPT1RfUFJPUF9MSVNULFxuICBNT1ZFX1BST1BfTElTVCxcbiAgU0VUVVBfUFJPUF9MSVNULFxuICBNQVJLVVBfUFJPUF9MSVNULFxuICBOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBHQU1FX0lORk9fUFJPUF9MSVNULFxuICBDVVNUT01fUFJPUF9MSVNULFxufSBmcm9tICcuL3Byb3BzJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIFNHRiAoU21hcnQgR2FtZSBGb3JtYXQpIGZpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZ2Yge1xuICBORVdfTk9ERSA9ICc7JztcbiAgQlJBTkNISU5HID0gWycoJywgJyknXTtcbiAgUFJPUEVSVFkgPSBbJ1snLCAnXSddO1xuICBMSVNUX0lERU5USVRJRVMgPSBbXG4gICAgJ0FXJyxcbiAgICAnQUInLFxuICAgICdBRScsXG4gICAgJ0FSJyxcbiAgICAnQ1InLFxuICAgICdERCcsXG4gICAgJ0xCJyxcbiAgICAnTE4nLFxuICAgICdNQScsXG4gICAgJ1NMJyxcbiAgICAnU1EnLFxuICAgICdUUicsXG4gICAgJ1ZXJyxcbiAgICAnVEInLFxuICAgICdUVycsXG4gIF07XG4gIE5PREVfREVMSU1JVEVSUyA9IFt0aGlzLk5FV19OT0RFXS5jb25jYXQodGhpcy5CUkFOQ0hJTkcpO1xuXG4gIHRyZWU6IFRyZWVNb2RlbCA9IG5ldyBUcmVlTW9kZWwoKTtcbiAgcm9vdDogVE5vZGUgfCBudWxsID0gbnVsbDtcbiAgbm9kZTogVE5vZGUgfCBudWxsID0gbnVsbDtcbiAgY3VycmVudE5vZGU6IFROb2RlIHwgbnVsbCA9IG51bGw7XG4gIHBhcmVudE5vZGU6IFROb2RlIHwgbnVsbCA9IG51bGw7XG4gIG5vZGVQcm9wczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgU2dmIGNsYXNzLlxuICAgKiBAcGFyYW0gY29udGVudCBUaGUgY29udGVudCBvZiB0aGUgU2dmLCBlaXRoZXIgYXMgYSBzdHJpbmcgb3IgYXMgYSBUTm9kZShSb290IG5vZGUpLlxuICAgKiBAcGFyYW0gcGFyc2VPcHRpb25zIFRoZSBvcHRpb25zIGZvciBwYXJzaW5nIHRoZSBTZ2YgY29udGVudC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY29udGVudD86IHN0cmluZyB8IFROb2RlLFxuICAgIHByaXZhdGUgcGFyc2VPcHRpb25zID0ge1xuICAgICAgaWdub3JlUHJvcExpc3Q6IFtdLFxuICAgIH1cbiAgKSB7XG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5wYXJzZShjb250ZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5zZXRSb290KGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSByb290IG5vZGUgb2YgdGhlIFNHRiB0cmVlLlxuICAgKlxuICAgKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCBub2RlIHRvIHNldC5cbiAgICogQHJldHVybnMgVGhlIHVwZGF0ZWQgU0dGIGluc3RhbmNlLlxuICAgKi9cbiAgc2V0Um9vdChyb290OiBUTm9kZSkge1xuICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGN1cnJlbnQgU0dGIHRyZWUgdG8gYW4gU0dGIHN0cmluZyByZXByZXNlbnRhdGlvbi5cbiAgICogQHJldHVybnMgVGhlIFNHRiBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyZWUuXG4gICAqL1xuICB0b1NnZigpIHtcbiAgICByZXR1cm4gYCgke3RoaXMubm9kZVRvU3RyaW5nKHRoaXMucm9vdCl9KWA7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGdhbWUgdHJlZSB0byBTR0YgZm9ybWF0IHdpdGhvdXQgaW5jbHVkaW5nIGFuYWx5c2lzIGRhdGEuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBTR0YgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWUgdHJlZS5cbiAgICovXG4gIHRvU2dmV2l0aG91dEFuYWx5c2lzKCkge1xuICAgIGNvbnN0IHNnZiA9IGAoJHt0aGlzLm5vZGVUb1N0cmluZyh0aGlzLnJvb3QpfSlgO1xuICAgIHJldHVybiByZXBsYWNlKHNnZiwgL10oQVxcWy4qP1xcXSkvZywgJ10nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZXMgdGhlIGdpdmVuIFNHRiAoU21hcnQgR2FtZSBGb3JtYXQpIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHNnZiAtIFRoZSBTR0Ygc3RyaW5nIHRvIHBhcnNlLlxuICAgKi9cbiAgcGFyc2Uoc2dmOiBzdHJpbmcpIHtcbiAgICBpZiAoIXNnZikgcmV0dXJuO1xuXG4gICAgLy8gRmlyc3QsIGdldCBhbGwgcHJvcGVydHkgdmFsdWUgcmFuZ2VzIGZyb20gdGhlIG9yaWdpbmFsIHN0cmluZ1xuICAgIC8vIFVzZSBhbGwga25vd24gU0dGIHByb3BlcnR5IGtleXMgZnJvbSB0aGUgY29uc3RhbnRzXG4gICAgY29uc3QgYWxsUHJvcGVydHlLZXlzID0gW1xuICAgICAgLi4uUk9PVF9QUk9QX0xJU1QsXG4gICAgICAuLi5NT1ZFX1BST1BfTElTVCxcbiAgICAgIC4uLlNFVFVQX1BST1BfTElTVCxcbiAgICAgIC4uLk1BUktVUF9QUk9QX0xJU1QsXG4gICAgICAuLi5OT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICAgICAgLi4uTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgICAgIC4uLkdBTUVfSU5GT19QUk9QX0xJU1QsXG4gICAgICAuLi5DVVNUT01fUFJPUF9MSVNULFxuICAgIF07XG5cbiAgICBjb25zdCBwcm9wZXJ0eVZhbHVlUmFuZ2VzID0gYnVpbGRQcm9wZXJ0eVZhbHVlUmFuZ2VzKFxuICAgICAgc2dmLFxuICAgICAgYWxsUHJvcGVydHlLZXlzXG4gICAgKS5zb3J0KChhLCBiKSA9PiBhWzBdIC0gYlswXSk7XG5cbiAgICAvLyBSZW1vdmUgc3BhY2VzIG9ubHkgb3V0c2lkZSBwcm9wZXJ0eSB2YWx1ZSByYW5nZXNcbiAgICBsZXQgcHJvY2Vzc2VkU2dmID0gJyc7XG4gICAgbGV0IGxhc3RJbmRleCA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IFtzdGFydCwgZW5kXSBvZiBwcm9wZXJ0eVZhbHVlUmFuZ2VzKSB7XG4gICAgICAvLyBQcm9jZXNzIHRleHQgYmVmb3JlIHRoaXMgcHJvcGVydHkgdmFsdWUgKHJlbW92ZSBzcGFjZXMpXG4gICAgICBjb25zdCBiZWZvcmVQcm9wID0gc2dmLnNsaWNlKGxhc3RJbmRleCwgc3RhcnQpO1xuICAgICAgcHJvY2Vzc2VkU2dmICs9IGJlZm9yZVByb3AucmVwbGFjZSgvXFxzKy9nbSwgJycpO1xuXG4gICAgICAvLyBLZWVwIHByb3BlcnR5IHZhbHVlIGFzLWlzIChwcmVzZXJ2ZSBzcGFjZXMpXG4gICAgICBjb25zdCBwcm9wVmFsdWUgPSBzZ2Yuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgICBwcm9jZXNzZWRTZ2YgKz0gcHJvcFZhbHVlO1xuXG4gICAgICBsYXN0SW5kZXggPSBlbmQ7XG4gICAgfVxuXG4gICAgLy8gUHJvY2VzcyByZW1haW5pbmcgdGV4dCBhZnRlciBsYXN0IHByb3BlcnR5IHZhbHVlIChyZW1vdmUgc3BhY2VzKVxuICAgIGNvbnN0IHJlbWFpbmluZyA9IHNnZi5zbGljZShsYXN0SW5kZXgpO1xuICAgIHByb2Nlc3NlZFNnZiArPSByZW1haW5pbmcucmVwbGFjZSgvXFxzKy9nbSwgJycpO1xuXG4gICAgLy8gTm93IHVzZSB0aGUgcHJvY2Vzc2VkIFNHRiBmb3IgcGFyc2luZ1xuICAgIHNnZiA9IHByb2Nlc3NlZFNnZjtcbiAgICBsZXQgbm9kZVN0YXJ0ID0gMDtcbiAgICBsZXQgY291bnRlciA9IDA7XG4gICAgY29uc3Qgc3RhY2s6IFROb2RlW10gPSBbXTtcblxuICAgIGNvbnN0IGluTm9kZVJhbmdlcyA9IGJ1aWxkUHJvcGVydHlWYWx1ZVJhbmdlcyhzZ2YpLnNvcnQoXG4gICAgICAoYSwgYikgPT4gYVswXSAtIGJbMF1cbiAgICApO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZ2YubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGMgPSBzZ2ZbaV07XG4gICAgICBjb25zdCBpbnNpZGVQcm9wID0gaXNJbkFueVJhbmdlKGksIGluTm9kZVJhbmdlcyk7XG5cbiAgICAgIGlmICh0aGlzLk5PREVfREVMSU1JVEVSUy5pbmNsdWRlcyhjKSAmJiAhaW5zaWRlUHJvcCkge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gc2dmLnNsaWNlKG5vZGVTdGFydCwgaSk7XG4gICAgICAgIGlmIChjb250ZW50ICE9PSAnJykge1xuICAgICAgICAgIGNvbnN0IG1vdmVQcm9wczogTW92ZVByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IHNldHVwUHJvcHM6IFNldHVwUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3Qgcm9vdFByb3BzOiBSb290UHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgbWFya3VwUHJvcHM6IE1hcmt1cFByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IGdhbWVJbmZvUHJvcHM6IEdhbWVJbmZvUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3Qgbm9kZUFubm90YXRpb25Qcm9wczogTm9kZUFubm90YXRpb25Qcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBtb3ZlQW5ub3RhdGlvblByb3BzOiBNb3ZlQW5ub3RhdGlvblByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IGN1c3RvbVByb3BzOiBDdXN0b21Qcm9wW10gPSBbXTtcblxuICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSBbXG4gICAgICAgICAgICAuLi5jb250ZW50Lm1hdGNoQWxsKFxuICAgICAgICAgICAgICAvLyBSZWdFeHAoLyhbQS1aXStcXFtbYS16XFxbXFxdXSpcXF0rKS8sICdnJylcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC8oW0EtWl0rXFxbLio/XFxdKykvLCAnZycpXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvW0EtWl0rKFxcWy4qP1xcXSl7MSx9LywgJ2cnKVxuICAgICAgICAgICAgICAvLyBSZWdFeHAoL1tBLVpdKyhcXFtbXFxzXFxTXSo/XFxdKXsxLH0vLCAnZycpLFxuICAgICAgICAgICAgICAvLyBTaW1wbGlmaWVkIHJlZ2V4IHRvIGhhbmRsZSBlc2NhcGVkIGJyYWNrZXRzIHByb3Blcmx5XG4gICAgICAgICAgICAgIC8vIFteXFxdXFxcXF18XFxcXC4gIG1hdGNoZXM6IGFueSBjaGFyIGV4Y2VwdCBdIGFuZCBcXCwgT1IgYW55IGVzY2FwZWQgY2hhciAoXFwuKVxuICAgICAgICAgICAgICBSZWdFeHAoL1xcdysoPzpcXFsoPzpbXlxcXVxcXFxdfFxcXFwuKSpcXF0pKy9nKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgbWF0Y2hlcy5mb3JFYWNoKG0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdG9rZW5NYXRjaCA9IG1bMF0ubWF0Y2goLyhbQS1aXSspXFxbLyk7XG4gICAgICAgICAgICBpZiAodG9rZW5NYXRjaCkge1xuICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2VuTWF0Y2hbMV07XG4gICAgICAgICAgICAgIGlmIChNT1ZFX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBtb3ZlUHJvcHMucHVzaChNb3ZlUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoU0VUVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHNldHVwUHJvcHMucHVzaChTZXR1cFByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKFJPT1RfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHJvb3RQcm9wcy5wdXNoKFJvb3RQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG1hcmt1cFByb3BzLnB1c2goTWFya3VwUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoR0FNRV9JTkZPX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBnYW1lSW5mb1Byb3BzLnB1c2goR2FtZUluZm9Qcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG5vZGVBbm5vdGF0aW9uUHJvcHMucHVzaChOb2RlQW5ub3RhdGlvblByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcy5wdXNoKE1vdmVBbm5vdGF0aW9uUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoQ1VTVE9NX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBjdXN0b21Qcm9wcy5wdXNoKEN1c3RvbVByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc2ggPSBjYWxjSGFzaCh0aGlzLmN1cnJlbnROb2RlLCBtb3ZlUHJvcHMpO1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMudHJlZS5wYXJzZSh7XG4gICAgICAgICAgICAgIGlkOiBoYXNoLFxuICAgICAgICAgICAgICBuYW1lOiBoYXNoLFxuICAgICAgICAgICAgICBpbmRleDogY291bnRlcixcbiAgICAgICAgICAgICAgbnVtYmVyOiAwLFxuICAgICAgICAgICAgICBtb3ZlUHJvcHMsXG4gICAgICAgICAgICAgIHNldHVwUHJvcHMsXG4gICAgICAgICAgICAgIHJvb3RQcm9wcyxcbiAgICAgICAgICAgICAgbWFya3VwUHJvcHMsXG4gICAgICAgICAgICAgIGdhbWVJbmZvUHJvcHMsXG4gICAgICAgICAgICAgIG5vZGVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgICAgICAgIG1vdmVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgICAgICAgIGN1c3RvbVByb3BzLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlKSB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgICAgbm9kZS5tb2RlbC5udW1iZXIgPSBnZXROb2RlTnVtYmVyKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5yb290ID0gbm9kZTtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcoJyAmJiB0aGlzLmN1cnJlbnROb2RlICYmICFpbnNpZGVQcm9wKSB7XG4gICAgICAgIHN0YWNrLnB1c2godGhpcy5jdXJyZW50Tm9kZSk7XG4gICAgICB9XG4gICAgICBpZiAoYyA9PT0gJyknICYmICFpbnNpZGVQcm9wICYmIHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLk5PREVfREVMSU1JVEVSUy5pbmNsdWRlcyhjKSAmJiAhaW5zaWRlUHJvcCkge1xuICAgICAgICBub2RlU3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIG5vZGUgdG8gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBub2RlIC0gVGhlIG5vZGUgdG8gY29udmVydC5cbiAgICogQHJldHVybnMgVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbm9kZS5cbiAgICovXG4gIHByaXZhdGUgbm9kZVRvU3RyaW5nKG5vZGU6IGFueSkge1xuICAgIGxldCBjb250ZW50ID0gJyc7XG4gICAgbm9kZS53YWxrKChuOiBUTm9kZSkgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICByb290UHJvcHMsXG4gICAgICAgIG1vdmVQcm9wcyxcbiAgICAgICAgY3VzdG9tUHJvcHMsXG4gICAgICAgIHNldHVwUHJvcHMsXG4gICAgICAgIG1hcmt1cFByb3BzLFxuICAgICAgICBub2RlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICBtb3ZlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICBnYW1lSW5mb1Byb3BzLFxuICAgICAgfSA9IG4ubW9kZWw7XG4gICAgICBjb25zdCBub2RlcyA9IGNvbXBhY3QoW1xuICAgICAgICAuLi5yb290UHJvcHMsXG4gICAgICAgIC4uLmN1c3RvbVByb3BzLFxuICAgICAgICAuLi5tb3ZlUHJvcHMsXG4gICAgICAgIC4uLmdldERlZHVwbGljYXRlZFByb3BzKHNldHVwUHJvcHMpLFxuICAgICAgICAuLi5nZXREZWR1cGxpY2F0ZWRQcm9wcyhtYXJrdXBQcm9wcyksXG4gICAgICAgIC4uLmdhbWVJbmZvUHJvcHMsXG4gICAgICAgIC4uLm5vZGVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgIC4uLm1vdmVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICBdKTtcbiAgICAgIGNvbnRlbnQgKz0gJzsnO1xuICAgICAgbm9kZXMuZm9yRWFjaCgobjogU2dmUHJvcEJhc2UpID0+IHtcbiAgICAgICAgY29udGVudCArPSBuLnRvU3RyaW5nKCk7XG4gICAgICB9KTtcbiAgICAgIGlmIChuLmNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbi5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogVE5vZGUpID0+IHtcbiAgICAgICAgICBjb250ZW50ICs9IGAoJHt0aGlzLm5vZGVUb1N0cmluZyhjaGlsZCl9KWA7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG4uY2hpbGRyZW4ubGVuZ3RoIDwgMjtcbiAgICB9KTtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxufVxuIiwiaW1wb3J0IHtUcmVlTW9kZWwsIFROb2RlfSBmcm9tICcuL2NvcmUvdHJlZSc7XG5pbXBvcnQge2Nsb25lRGVlcCwgZmxhdHRlbkRlcHRoLCBjbG9uZSwgc3VtLCBjb21wYWN0LCBzYW1wbGV9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1NnZk5vZGUsIFNnZk5vZGVPcHRpb25zfSBmcm9tICcuL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHtcbiAgaXNNb3ZlTm9kZSxcbiAgaXNTZXR1cE5vZGUsXG4gIGNhbGNIYXNoLFxuICBnZXROb2RlTnVtYmVyLFxuICBpc1Jvb3ROb2RlLFxufSBmcm9tICcuL2NvcmUvaGVscGVycyc7XG5leHBvcnQge2lzTW92ZU5vZGUsIGlzU2V0dXBOb2RlLCBjYWxjSGFzaCwgZ2V0Tm9kZU51bWJlciwgaXNSb290Tm9kZX07XG5pbXBvcnQge1xuICBBMV9MRVRURVJTLFxuICBBMV9OVU1CRVJTLFxuICBTR0ZfTEVUVEVSUyxcbiAgTUFYX0JPQVJEX1NJWkUsXG4gIExJR0hUX0dSRUVOX1JHQixcbiAgTElHSFRfWUVMTE9XX1JHQixcbiAgTElHSFRfUkVEX1JHQixcbiAgWUVMTE9XX1JHQixcbiAgREVGQVVMVF9CT0FSRF9TSVpFLFxufSBmcm9tICcuL2NvbnN0JztcbmltcG9ydCB7XG4gIFNldHVwUHJvcCxcbiAgTW92ZVByb3AsXG4gIEN1c3RvbVByb3AsXG4gIFNnZlByb3BCYXNlLFxuICBOb2RlQW5ub3RhdGlvblByb3AsXG4gIEdhbWVJbmZvUHJvcCxcbiAgTW92ZUFubm90YXRpb25Qcm9wLFxuICBSb290UHJvcCxcbiAgTWFya3VwUHJvcCxcbiAgTU9WRV9QUk9QX0xJU1QsXG4gIFNFVFVQX1BST1BfTElTVCxcbiAgTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgTUFSS1VQX1BST1BfTElTVCxcbiAgUk9PVF9QUk9QX0xJU1QsXG4gIEdBTUVfSU5GT19QUk9QX0xJU1QsXG4gIFRJTUlOR19QUk9QX0xJU1QsXG4gIE1JU0NFTExBTkVPVVNfUFJPUF9MSVNULFxuICBDVVNUT01fUFJPUF9MSVNULFxufSBmcm9tICcuL2NvcmUvcHJvcHMnO1xuaW1wb3J0IHtcbiAgQW5hbHlzaXMsXG4gIEdob3N0QmFuT3B0aW9ucyxcbiAgS2ksXG4gIE1vdmVJbmZvLFxuICBQcm9ibGVtQW5zd2VyVHlwZSBhcyBQQVQsXG4gIFJvb3RJbmZvLFxuICBNYXJrdXAsXG4gIFBhdGhEZXRlY3Rpb25TdHJhdGVneSxcbn0gZnJvbSAnLi90eXBlcyc7XG5cbmltcG9ydCB7Q2VudGVyfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7Y2FuTW92ZSwgZXhlY0NhcHR1cmV9IGZyb20gJy4vYm9hcmRjb3JlJztcbmV4cG9ydCB7Y2FuTW92ZSwgZXhlY0NhcHR1cmV9O1xuXG5pbXBvcnQge1NnZn0gZnJvbSAnLi9jb3JlL3NnZic7XG5cbnR5cGUgU3RyYXRlZ3kgPSAncG9zdCcgfCAncHJlJyB8ICdib3RoJztcblxuY29uc3QgU3BhcmtNRDUgPSByZXF1aXJlKCdzcGFyay1tZDUnKTtcblxuZXhwb3J0IGNvbnN0IGNhbGNEb3VidGZ1bE1vdmVzVGhyZXNob2xkUmFuZ2UgPSAodGhyZXNob2xkOiBudW1iZXIpID0+IHtcbiAgLy8gOEQtOURcbiAgaWYgKHRocmVzaG9sZCA+PSAyNSkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjE1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0zXX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4xNSwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMywgLTJdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wNV0sIHNjb3JlUmFuZ2U6IFstMiwgLTFdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDUsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0xLCAtMC41XX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1RC03RFxuICBpZiAodGhyZXNob2xkID49IDIzICYmIHRocmVzaG9sZCA8IDI1KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMl0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtOF19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMiwgLTAuMTVdLCBzY29yZVJhbmdlOiBbLTgsIC00XX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTUsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy00LCAtMl19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTIsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuXG4gIC8vIDNELTVEXG4gIGlmICh0aHJlc2hvbGQgPj0gMjAgJiYgdGhyZXNob2xkIDwgMjMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4yNV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMTJdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjI1LCAtMC4xXSwgc2NvcmVSYW5nZTogWy0xMiwgLTVdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wNV0sIHNjb3JlUmFuZ2U6IFstNSwgLTJdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDUsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0yLCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gMUQtM0RcbiAgaWYgKHRocmVzaG9sZCA+PSAxOCAmJiB0aHJlc2hvbGQgPCAyMCkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjNdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTE1XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zLCAtMC4xXSwgc2NvcmVSYW5nZTogWy0xNSwgLTddfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wNV0sIHNjb3JlUmFuZ2U6IFstNywgLTVdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDUsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy01LCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gNUstMUtcbiAgaWYgKHRocmVzaG9sZCA+PSAxMyAmJiB0aHJlc2hvbGQgPCAxOCkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjM1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0yMF19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMzUsIC0wLjEyXSwgc2NvcmVSYW5nZTogWy0yMCwgLTEwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTIsIC0wLjA4XSwgc2NvcmVSYW5nZTogWy0xMCwgLTVdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDgsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy01LCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gNUstMTBLXG4gIGlmICh0aHJlc2hvbGQgPj0gOCAmJiB0aHJlc2hvbGQgPCAxMykge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjRdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTI1XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC40LCAtMC4xNV0sIHNjb3JlUmFuZ2U6IFstMjUsIC0xMF19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjE1LCAtMC4xXSwgc2NvcmVSYW5nZTogWy0xMCwgLTVdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyAxOEstMTBLXG4gIGlmICh0aHJlc2hvbGQgPj0gMCAmJiB0aHJlc2hvbGQgPCA4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuNDVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTM1XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC40NSwgLTAuMl0sIHNjb3JlUmFuZ2U6IFstMzUsIC0yMF19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjIsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTEwLCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjNdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTMwXX0sXG4gICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMywgLTAuMl0sIHNjb3JlUmFuZ2U6IFstMzAsIC0yMF19LFxuICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4yLCAtMC4xXSwgc2NvcmVSYW5nZTogWy0yMCwgLTEwXX0sXG4gICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMTAsIC0xXX0sXG4gICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByb3VuZDIgPSAodjogbnVtYmVyLCBzY2FsZSA9IDEsIGZpeGVkID0gMikgPT4ge1xuICByZXR1cm4gKChNYXRoLnJvdW5kKHYgKiAxMDApIC8gMTAwKSAqIHNjYWxlKS50b0ZpeGVkKGZpeGVkKTtcbn07XG5cbmV4cG9ydCBjb25zdCByb3VuZDMgPSAodjogbnVtYmVyLCBzY2FsZSA9IDEsIGZpeGVkID0gMykgPT4ge1xuICByZXR1cm4gKChNYXRoLnJvdW5kKHYgKiAxMDAwKSAvIDEwMDApICogc2NhbGUpLnRvRml4ZWQoZml4ZWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQW5zd2VyTm9kZSA9IChuOiBUTm9kZSwga2luZDogUEFUKSA9PiB7XG4gIGNvbnN0IHBhdCA9IG4ubW9kZWwuY3VzdG9tUHJvcHM/LmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQVQnKTtcbiAgcmV0dXJuIHBhdD8udmFsdWUgPT09IGtpbmQ7XG59O1xuXG5leHBvcnQgY29uc3QgaXNDaG9pY2VOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiAhIWM/LnZhbHVlLmluY2x1ZGVzKCdDSE9JQ0UnKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1RhcmdldE5vZGUgPSBpc0Nob2ljZU5vZGU7XG5cbmV4cG9ydCBjb25zdCBpc0ZvcmNlTm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gYz8udmFsdWUuaW5jbHVkZXMoJ0ZPUkNFJyk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNQcmV2ZW50TW92ZU5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuIGM/LnZhbHVlLmluY2x1ZGVzKCdOT1RUSElTJyk7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgaXNSaWdodExlYWYgPSAobjogVE5vZGUpID0+IHtcbi8vICAgcmV0dXJuIGlzUmlnaHROb2RlKG4pICYmICFuLmhhc0NoaWxkcmVuKCk7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaXNSaWdodE5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuICEhYz8udmFsdWUuaW5jbHVkZXMoJ1JJR0hUJyk7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgaXNGaXJzdFJpZ2h0TGVhZiA9IChuOiBUTm9kZSkgPT4ge1xuLy8gICBjb25zdCByb290ID0gbi5nZXRQYXRoKClbMF07XG4vLyAgIGNvbnN0IGZpcnN0UmlnaHRMZWF2ZSA9IHJvb3QuZmlyc3QoKG46IFROb2RlKSA9PlxuLy8gICAgIGlzUmlnaHRMZWFmKG4pXG4vLyAgICk7XG4vLyAgIHJldHVybiBmaXJzdFJpZ2h0TGVhdmU/Lm1vZGVsLmlkID09PSBuLm1vZGVsLmlkO1xuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGlzRmlyc3RSaWdodE5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3Qgcm9vdCA9IG4uZ2V0UGF0aCgpWzBdO1xuICBjb25zdCBmaXJzdFJpZ2h0Tm9kZSA9IHJvb3QuZmlyc3QobiA9PiBpc1JpZ2h0Tm9kZShuKSk7XG4gIHJldHVybiBmaXJzdFJpZ2h0Tm9kZT8ubW9kZWwuaWQgPT09IG4ubW9kZWwuaWQ7XG59O1xuXG5leHBvcnQgY29uc3QgaXNWYXJpYW50Tm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gISFjPy52YWx1ZS5pbmNsdWRlcygnVkFSSUFOVCcpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzVmFyaWFudExlYWYgPSAobjogVE5vZGUpID0+IHtcbi8vICAgcmV0dXJuIGlzVmFyaWFudE5vZGUobikgJiYgIW4uaGFzQ2hpbGRyZW4oKTtcbi8vIH07XG5cbmV4cG9ydCBjb25zdCBpc1dyb25nTm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gKCFjPy52YWx1ZS5pbmNsdWRlcygnVkFSSUFOVCcpICYmICFjPy52YWx1ZS5pbmNsdWRlcygnUklHSFQnKSkgfHwgIWM7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgaXNXcm9uZ0xlYWYgPSAobjogVE5vZGUpID0+IHtcbi8vICAgcmV0dXJuIGlzV3JvbmdOb2RlKG4pICYmICFuLmhhc0NoaWxkcmVuKCk7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaW5QYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgZGV0ZWN0aW9uTWV0aG9kOiAobjogVE5vZGUpID0+IGJvb2xlYW4sXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdXG4pID0+IHtcbiAgY29uc3QgcGF0aCA9IHByZU5vZGVzID8/IG5vZGUuZ2V0UGF0aCgpO1xuICBjb25zdCBwb3N0UmlnaHROb2RlcyA9XG4gICAgcG9zdE5vZGVzPy5maWx0ZXIoKG46IFROb2RlKSA9PiBkZXRlY3Rpb25NZXRob2QobikpID8/XG4gICAgbm9kZS5hbGwoKG46IFROb2RlKSA9PiBkZXRlY3Rpb25NZXRob2QobikpO1xuICBjb25zdCBwcmVSaWdodE5vZGVzID0gcGF0aC5maWx0ZXIoKG46IFROb2RlKSA9PiBkZXRlY3Rpb25NZXRob2QobikpO1xuXG4gIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0OlxuICAgICAgcmV0dXJuIHBvc3RSaWdodE5vZGVzLmxlbmd0aCA+IDA7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUHJlOlxuICAgICAgcmV0dXJuIHByZVJpZ2h0Tm9kZXMubGVuZ3RoID4gMDtcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Cb3RoOlxuICAgICAgcmV0dXJuIHByZVJpZ2h0Tm9kZXMubGVuZ3RoID4gMCB8fCBwb3N0UmlnaHROb2Rlcy5sZW5ndGggPiAwO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpblJpZ2h0UGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc1JpZ2h0Tm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGluRmlyc3RSaWdodFBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNGaXJzdFJpZ2h0Tm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGluRmlyc3RCcmFuY2hSaWdodFBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlByZSxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgaWYgKCFpblJpZ2h0UGF0aChub2RlKSkgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IHBhdGggPSBwcmVOb2RlcyA/PyBub2RlLmdldFBhdGgoKTtcbiAgY29uc3QgcG9zdFJpZ2h0Tm9kZXMgPSBwb3N0Tm9kZXMgPz8gbm9kZS5hbGwoKCkgPT4gdHJ1ZSk7XG5cbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdDpcbiAgICAgIHJlc3VsdCA9IHBvc3RSaWdodE5vZGVzLmZpbHRlcihuID0+IG4uZ2V0SW5kZXgoKSA+IDApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUHJlOlxuICAgICAgcmVzdWx0ID0gcGF0aC5maWx0ZXIobiA9PiBuLmdldEluZGV4KCkgPiAwKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LkJvdGg6XG4gICAgICByZXN1bHQgPSBwYXRoLmNvbmNhdChwb3N0UmlnaHROb2RlcykuZmlsdGVyKG4gPT4gbi5nZXRJbmRleCgpID4gMCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQubGVuZ3RoID09PSAwO1xufTtcblxuZXhwb3J0IGNvbnN0IGluQ2hvaWNlUGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc0Nob2ljZU5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpblRhcmdldFBhdGggPSBpbkNob2ljZVBhdGg7XG5cbmV4cG9ydCBjb25zdCBpblZhcmlhbnRQYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gaW5QYXRoKG5vZGUsIGlzVmFyaWFudE5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbldyb25nUGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc1dyb25nTm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IG5Gb3JtYXR0ZXIgPSAobnVtOiBudW1iZXIsIGZpeGVkID0gMSkgPT4ge1xuICBjb25zdCBsb29rdXAgPSBbXG4gICAge3ZhbHVlOiAxLCBzeW1ib2w6ICcnfSxcbiAgICB7dmFsdWU6IDFlMywgc3ltYm9sOiAnayd9LFxuICAgIHt2YWx1ZTogMWU2LCBzeW1ib2w6ICdNJ30sXG4gICAge3ZhbHVlOiAxZTksIHN5bWJvbDogJ0cnfSxcbiAgICB7dmFsdWU6IDFlMTIsIHN5bWJvbDogJ1QnfSxcbiAgICB7dmFsdWU6IDFlMTUsIHN5bWJvbDogJ1AnfSxcbiAgICB7dmFsdWU6IDFlMTgsIHN5bWJvbDogJ0UnfSxcbiAgXTtcbiAgY29uc3QgcnggPSAvXFwuMCskfChcXC5bMC05XSpbMS05XSkwKyQvO1xuICBjb25zdCBpdGVtID0gbG9va3VwXG4gICAgLnNsaWNlKClcbiAgICAucmV2ZXJzZSgpXG4gICAgLmZpbmQoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gbnVtID49IGl0ZW0udmFsdWU7XG4gICAgfSk7XG4gIHJldHVybiBpdGVtXG4gICAgPyAobnVtIC8gaXRlbS52YWx1ZSkudG9GaXhlZChmaXhlZCkucmVwbGFjZShyeCwgJyQxJykgKyBpdGVtLnN5bWJvbFxuICAgIDogJzAnO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhdGhUb0luZGV4ZXMgPSAocGF0aDogVE5vZGVbXSk6IHN0cmluZ1tdID0+IHtcbiAgcmV0dXJuIHBhdGgubWFwKG4gPT4gbi5tb2RlbC5pZCk7XG59O1xuXG5leHBvcnQgY29uc3QgcGF0aFRvSW5pdGlhbFN0b25lcyA9IChcbiAgcGF0aDogVE5vZGVbXSxcbiAgeE9mZnNldCA9IDAsXG4gIHlPZmZzZXQgPSAwXG4pOiBzdHJpbmdbXSA9PiB7XG4gIGNvbnN0IGluaXRzID0gcGF0aFxuICAgIC5maWx0ZXIobiA9PiBuLm1vZGVsLnNldHVwUHJvcHMubGVuZ3RoID4gMClcbiAgICAubWFwKG4gPT4ge1xuICAgICAgcmV0dXJuIG4ubW9kZWwuc2V0dXBQcm9wcy5tYXAoKHNldHVwOiBTZXR1cFByb3ApID0+IHtcbiAgICAgICAgcmV0dXJuIHNldHVwLnZhbHVlcy5tYXAoKHY6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IGEgPSBBMV9MRVRURVJTW1NHRl9MRVRURVJTLmluZGV4T2YodlswXSkgKyB4T2Zmc2V0XTtcbiAgICAgICAgICBjb25zdCBiID0gQTFfTlVNQkVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHZbMV0pICsgeU9mZnNldF07XG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBzZXR1cC50b2tlbiA9PT0gJ0FCJyA/ICdCJyA6ICdXJztcbiAgICAgICAgICByZXR1cm4gW3Rva2VuLCBhICsgYl07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIHJldHVybiBmbGF0dGVuRGVwdGgoaW5pdHNbMF0sIDEpO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhdGhUb0FpTW92ZXMgPSAocGF0aDogVE5vZGVbXSwgeE9mZnNldCA9IDAsIHlPZmZzZXQgPSAwKSA9PiB7XG4gIGNvbnN0IG1vdmVzID0gcGF0aFxuICAgIC5maWx0ZXIobiA9PiBuLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPiAwKVxuICAgIC5tYXAobiA9PiB7XG4gICAgICBjb25zdCBwcm9wID0gbi5tb2RlbC5tb3ZlUHJvcHNbMF07XG4gICAgICBjb25zdCBhID0gQTFfTEVUVEVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHByb3AudmFsdWVbMF0pICsgeE9mZnNldF07XG4gICAgICBjb25zdCBiID0gQTFfTlVNQkVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHByb3AudmFsdWVbMV0pICsgeU9mZnNldF07XG4gICAgICByZXR1cm4gW3Byb3AudG9rZW4sIGEgKyBiXTtcbiAgICB9KTtcbiAgcmV0dXJuIG1vdmVzO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4RnJvbUFuYWx5c2lzID0gKGE6IEFuYWx5c2lzKSA9PiB7XG4gIGlmICgvaW5kZXhlcy8udGVzdChhLmlkKSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGEuaWQpLmluZGV4ZXNbMF07XG4gIH1cbiAgcmV0dXJuICcnO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTWFpblBhdGggPSAobm9kZTogVE5vZGUpID0+IHtcbiAgcmV0dXJuIHN1bShub2RlLmdldFBhdGgoKS5tYXAobiA9PiBuLmdldEluZGV4KCkpKSA9PT0gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZUb1BvcyA9IChzdHI6IHN0cmluZykgPT4ge1xuICBjb25zdCBraSA9IHN0clswXSA9PT0gJ0InID8gMSA6IC0xO1xuICBjb25zdCB0ZW1wU3RyID0gL1xcWyguKilcXF0vLmV4ZWMoc3RyKTtcbiAgaWYgKHRlbXBTdHIpIHtcbiAgICBjb25zdCBwb3MgPSB0ZW1wU3RyWzFdO1xuICAgIGNvbnN0IHggPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1swXSk7XG4gICAgY29uc3QgeSA9IFNHRl9MRVRURVJTLmluZGV4T2YocG9zWzFdKTtcbiAgICByZXR1cm4ge3gsIHksIGtpfTtcbiAgfVxuICByZXR1cm4ge3g6IC0xLCB5OiAtMSwga2k6IDB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHNnZlRvQTEgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qge3gsIHl9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgcmV0dXJuIEExX0xFVFRFUlNbeF0gKyBBMV9OVU1CRVJTW3ldO1xufTtcblxuZXhwb3J0IGNvbnN0IGExVG9Qb3MgPSAobW92ZTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHggPSBBMV9MRVRURVJTLmluZGV4T2YobW92ZVswXSk7XG4gIGNvbnN0IHkgPSBBMV9OVU1CRVJTLmluZGV4T2YocGFyc2VJbnQobW92ZS5zdWJzdHIoMSksIDApKTtcbiAgcmV0dXJuIHt4LCB5fTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvSW5kZXggPSAobW92ZTogc3RyaW5nLCBib2FyZFNpemUgPSAxOSkgPT4ge1xuICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pO1xuICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSk7XG4gIHJldHVybiB4ICogYm9hcmRTaXplICsgeTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZPZmZzZXQgPSAoc2dmOiBhbnksIG9mZnNldCA9IDApID0+IHtcbiAgaWYgKG9mZnNldCA9PT0gMCkgcmV0dXJuIHNnZjtcbiAgY29uc3QgcmVzID0gY2xvbmUoc2dmKTtcbiAgY29uc3QgY2hhckluZGV4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihzZ2ZbMl0pIC0gb2Zmc2V0O1xuICByZXR1cm4gcmVzLnN1YnN0cigwLCAyKSArIFNHRl9MRVRURVJTW2NoYXJJbmRleF0gKyByZXMuc3Vic3RyKDIgKyAxKTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvU0dGID0gKHN0cjogYW55LCB0eXBlID0gJ0InLCBvZmZzZXRYID0gMCwgb2Zmc2V0WSA9IDApID0+IHtcbiAgaWYgKHN0ciA9PT0gJ3Bhc3MnKSByZXR1cm4gYCR7dHlwZX1bXWA7XG4gIGNvbnN0IGlueCA9IEExX0xFVFRFUlMuaW5kZXhPZihzdHJbMF0pICsgb2Zmc2V0WDtcbiAgY29uc3QgaW55ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KHN0ci5zdWJzdHIoMSksIDApKSArIG9mZnNldFk7XG4gIGNvbnN0IHNnZiA9IGAke3R5cGV9WyR7U0dGX0xFVFRFUlNbaW54XX0ke1NHRl9MRVRURVJTW2lueV19XWA7XG4gIHJldHVybiBzZ2Y7XG59O1xuXG5leHBvcnQgY29uc3QgcG9zVG9TZ2YgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3QgYXggPSBTR0ZfTEVUVEVSU1t4XTtcbiAgY29uc3QgYXkgPSBTR0ZfTEVUVEVSU1t5XTtcbiAgaWYgKGtpID09PSBLaS5FbXB0eSkgcmV0dXJuICcnO1xuICBpZiAoa2kgPT09IEtpLldoaXRlKSByZXR1cm4gYEJbJHtheH0ke2F5fV1gO1xuICBpZiAoa2kgPT09IEtpLkJsYWNrKSByZXR1cm4gYFdbJHtheH0ke2F5fV1gO1xuICByZXR1cm4gJyc7XG59O1xuXG5leHBvcnQgY29uc3QgbWF0VG9Qb3NpdGlvbiA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICB4T2Zmc2V0PzogbnVtYmVyLFxuICB5T2Zmc2V0PzogbnVtYmVyXG4pID0+IHtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICB4T2Zmc2V0ID0geE9mZnNldCA/PyAwO1xuICB5T2Zmc2V0ID0geU9mZnNldCA/PyBERUZBVUxUX0JPQVJEX1NJWkUgLSBtYXQubGVuZ3RoO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG1hdFtpXVtqXTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICBjb25zdCB4ID0gQTFfTEVUVEVSU1tpICsgeE9mZnNldF07XG4gICAgICAgIGNvbnN0IHkgPSBBMV9OVU1CRVJTW2ogKyB5T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgY29sb3IgPSB2YWx1ZSA9PT0gMSA/ICdiJyA6ICd3JztcbiAgICAgICAgcmVzdWx0ICs9IGAke2NvbG9yfSAke3h9JHt5fSBgO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IG1hdFRvTGlzdE9mVHVwbGVzID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIHhPZmZzZXQgPSAwLFxuICB5T2Zmc2V0ID0gMFxuKSA9PiB7XG4gIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBtYXRbaV1bal07XG4gICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgY29uc3QgeCA9IEExX0xFVFRFUlNbaSArIHhPZmZzZXRdO1xuICAgICAgICBjb25zdCB5ID0gQTFfTlVNQkVSU1tqICsgeU9mZnNldF07XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdmFsdWUgPT09IDEgPyAnQicgOiAnVyc7XG4gICAgICAgIHJlc3VsdHMucHVzaChbY29sb3IsIHggKyB5XSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnRTdG9uZVR5cGVUb1N0cmluZyA9ICh0eXBlOiBhbnkpID0+ICh0eXBlID09PSAxID8gJ0InIDogJ1cnKTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnRTdGVwc0ZvckFJID0gKHN0ZXBzOiBhbnksIG9mZnNldCA9IDApID0+IHtcbiAgbGV0IHJlcyA9IGNsb25lKHN0ZXBzKTtcbiAgcmVzID0gcmVzLm1hcCgoczogYW55KSA9PiBzZ2ZPZmZzZXQocywgb2Zmc2V0KSk7XG4gIGNvbnN0IGhlYWRlciA9IGAoO0ZGWzRdR01bMV1TWlske1xuICAgIDE5IC0gb2Zmc2V0XG4gIH1dR05bMjI2XVBCW0JsYWNrXUhBWzBdUFdbV2hpdGVdS01bNy41XURUWzIwMTctMDgtMDFdVE1bMTgwMF1SVVtDaGluZXNlXUNQW0NvcHlyaWdodCBnaG9zdC1nby5jb21dQVBbZ2hvc3QtZ28uY29tXVBMW0JsYWNrXTtgO1xuICBsZXQgY291bnQgPSAwO1xuICBsZXQgcHJldiA9ICcnO1xuICBzdGVwcy5mb3JFYWNoKChzdGVwOiBhbnksIGluZGV4OiBhbnkpID0+IHtcbiAgICBpZiAoc3RlcFswXSA9PT0gcHJldlswXSkge1xuICAgICAgaWYgKHN0ZXBbMF0gPT09ICdCJykge1xuICAgICAgICByZXMuc3BsaWNlKGluZGV4ICsgY291bnQsIDAsICdXW3R0XScpO1xuICAgICAgICBjb3VudCArPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLnNwbGljZShpbmRleCArIGNvdW50LCAwLCAnQlt0dF0nKTtcbiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcHJldiA9IHN0ZXA7XG4gIH0pO1xuICByZXR1cm4gYCR7aGVhZGVyfSR7cmVzLmpvaW4oJzsnKX0pYDtcbn07XG5cbmV4cG9ydCBjb25zdCBvZmZzZXRBMU1vdmUgPSAobW92ZTogc3RyaW5nLCBveCA9IDAsIG95ID0gMCkgPT4ge1xuICBpZiAobW92ZSA9PT0gJ3Bhc3MnKSByZXR1cm4gbW92ZTtcbiAgLy8gY29uc29sZS5sb2coJ294eScsIG94LCBveSk7XG4gIGNvbnN0IGlueCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKSArIG94O1xuICBjb25zdCBpbnkgPSBBMV9OVU1CRVJTLmluZGV4T2YocGFyc2VJbnQobW92ZS5zdWJzdHIoMSksIDApKSArIG95O1xuICAvLyBjb25zb2xlLmxvZygnaW54eScsIGlueCwgaW55LCBgJHtBMV9MRVRURVJTW2lueF19JHtBMV9OVU1CRVJTW2lueV19YCk7XG4gIHJldHVybiBgJHtBMV9MRVRURVJTW2lueF19JHtBMV9OVU1CRVJTW2lueV19YDtcbn07XG5cbmV4cG9ydCBjb25zdCByZXZlcnNlT2Zmc2V0QTFNb3ZlID0gKFxuICBtb3ZlOiBzdHJpbmcsXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgYW5hbHlzaXM6IEFuYWx5c2lzLFxuICBib2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGlmIChtb3ZlID09PSAncGFzcycpIHJldHVybiBtb3ZlO1xuICBjb25zdCBpZE9iaiA9IEpTT04ucGFyc2UoYW5hbHlzaXMuaWQpO1xuICBjb25zdCB7eCwgeX0gPSByZXZlcnNlT2Zmc2V0KG1hdCwgaWRPYmouYngsIGlkT2JqLmJ5LCBib2FyZFNpemUpO1xuICBjb25zdCBpbnggPSBBMV9MRVRURVJTLmluZGV4T2YobW92ZVswXSkgKyB4O1xuICBjb25zdCBpbnkgPSBBMV9OVU1CRVJTLmluZGV4T2YocGFyc2VJbnQobW92ZS5zdWJzdHIoMSksIDApKSArIHk7XG4gIHJldHVybiBgJHtBMV9MRVRURVJTW2lueF19JHtBMV9OVU1CRVJTW2lueV19YDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjU2NvcmVEaWZmVGV4dCA9IChcbiAgcm9vdEluZm8/OiBSb290SW5mbyB8IG51bGwsXG4gIGN1cnJJbmZvPzogTW92ZUluZm8gfCBSb290SW5mbyB8IG51bGwsXG4gIGZpeGVkID0gMSxcbiAgcmV2ZXJzZSA9IGZhbHNlXG4pID0+IHtcbiAgaWYgKCFyb290SW5mbyB8fCAhY3VyckluZm8pIHJldHVybiAnJztcbiAgbGV0IHNjb3JlID0gY2FsY1Njb3JlRGlmZihyb290SW5mbywgY3VyckluZm8pO1xuICBpZiAocmV2ZXJzZSkgc2NvcmUgPSAtc2NvcmU7XG4gIGNvbnN0IGZpeGVkU2NvcmUgPSBzY29yZS50b0ZpeGVkKGZpeGVkKTtcblxuICByZXR1cm4gc2NvcmUgPiAwID8gYCske2ZpeGVkU2NvcmV9YCA6IGAke2ZpeGVkU2NvcmV9YDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjV2lucmF0ZURpZmZUZXh0ID0gKFxuICByb290SW5mbz86IFJvb3RJbmZvIHwgbnVsbCxcbiAgY3VyckluZm8/OiBNb3ZlSW5mbyB8IFJvb3RJbmZvIHwgbnVsbCxcbiAgZml4ZWQgPSAxLFxuICByZXZlcnNlID0gZmFsc2VcbikgPT4ge1xuICBpZiAoIXJvb3RJbmZvIHx8ICFjdXJySW5mbykgcmV0dXJuICcnO1xuICBsZXQgd2lucmF0ZSA9IGNhbGNXaW5yYXRlRGlmZihyb290SW5mbywgY3VyckluZm8pO1xuICBpZiAocmV2ZXJzZSkgd2lucmF0ZSA9IC13aW5yYXRlO1xuICBjb25zdCBmaXhlZFdpbnJhdGUgPSB3aW5yYXRlLnRvRml4ZWQoZml4ZWQpO1xuXG4gIHJldHVybiB3aW5yYXRlID49IDAgPyBgKyR7Zml4ZWRXaW5yYXRlfSVgIDogYCR7Zml4ZWRXaW5yYXRlfSVgO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNTY29yZURpZmYgPSAoXG4gIHJvb3RJbmZvOiBSb290SW5mbyxcbiAgY3VyckluZm86IE1vdmVJbmZvIHwgUm9vdEluZm9cbikgPT4ge1xuICBjb25zdCBzaWduID0gcm9vdEluZm8uY3VycmVudFBsYXllciA9PT0gJ0InID8gMSA6IC0xO1xuICBjb25zdCBzY29yZSA9XG4gICAgTWF0aC5yb3VuZCgoY3VyckluZm8uc2NvcmVMZWFkIC0gcm9vdEluZm8uc2NvcmVMZWFkKSAqIHNpZ24gKiAxMDAwKSAvIDEwMDA7XG5cbiAgcmV0dXJuIHNjb3JlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNXaW5yYXRlRGlmZiA9IChcbiAgcm9vdEluZm86IFJvb3RJbmZvLFxuICBjdXJySW5mbzogTW92ZUluZm8gfCBSb290SW5mb1xuKSA9PiB7XG4gIGNvbnN0IHNpZ24gPSByb290SW5mby5jdXJyZW50UGxheWVyID09PSAnQicgPyAxIDogLTE7XG4gIGNvbnN0IHNjb3JlID1cbiAgICBNYXRoLnJvdW5kKChjdXJySW5mby53aW5yYXRlIC0gcm9vdEluZm8ud2lucmF0ZSkgKiBzaWduICogMTAwMCAqIDEwMCkgL1xuICAgIDEwMDA7XG5cbiAgcmV0dXJuIHNjb3JlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNBbmFseXNpc1BvaW50Q29sb3IgPSAoXG4gIHJvb3RJbmZvOiBSb290SW5mbyxcbiAgbW92ZUluZm86IE1vdmVJbmZvXG4pID0+IHtcbiAgY29uc3Qge3ByaW9yLCBvcmRlcn0gPSBtb3ZlSW5mbztcbiAgY29uc3Qgc2NvcmUgPSBjYWxjU2NvcmVEaWZmKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gIGxldCBwb2ludENvbG9yID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC41KSc7XG4gIGlmIChcbiAgICBwcmlvciA+PSAwLjUgfHxcbiAgICAocHJpb3IgPj0gMC4xICYmIG9yZGVyIDwgMyAmJiBzY29yZSA+IC0wLjMpIHx8XG4gICAgb3JkZXIgPT09IDAgfHxcbiAgICBzY29yZSA+PSAwXG4gICkge1xuICAgIHBvaW50Q29sb3IgPSBMSUdIVF9HUkVFTl9SR0I7XG4gIH0gZWxzZSBpZiAoKHByaW9yID4gMC4wNSAmJiBzY29yZSA+IC0wLjUpIHx8IChwcmlvciA+IDAuMDEgJiYgc2NvcmUgPiAtMC4xKSkge1xuICAgIHBvaW50Q29sb3IgPSBMSUdIVF9ZRUxMT1dfUkdCO1xuICB9IGVsc2UgaWYgKHByaW9yID4gMC4wMSAmJiBzY29yZSA+IC0xKSB7XG4gICAgcG9pbnRDb2xvciA9IFlFTExPV19SR0I7XG4gIH0gZWxzZSB7XG4gICAgcG9pbnRDb2xvciA9IExJR0hUX1JFRF9SR0I7XG4gIH1cbiAgcmV0dXJuIHBvaW50Q29sb3I7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgR29CYW5EZXRlY3Rpb24gPSAocGl4ZWxEYXRhLCBjYW52YXMpID0+IHtcbi8vIGNvbnN0IGNvbHVtbnMgPSBjYW52YXMud2lkdGg7XG4vLyBjb25zdCByb3dzID0gY2FudmFzLmhlaWdodDtcbi8vIGNvbnN0IGRhdGFUeXBlID0gSnNGZWF0LlU4QzFfdDtcbi8vIGNvbnN0IGRpc3RNYXRyaXhUID0gbmV3IEpzRmVhdC5tYXRyaXhfdChjb2x1bW5zLCByb3dzLCBkYXRhVHlwZSk7XG4vLyBKc0ZlYXQuaW1ncHJvYy5ncmF5c2NhbGUocGl4ZWxEYXRhLCBjb2x1bW5zLCByb3dzLCBkaXN0TWF0cml4VCk7XG4vLyBKc0ZlYXQuaW1ncHJvYy5nYXVzc2lhbl9ibHVyKGRpc3RNYXRyaXhULCBkaXN0TWF0cml4VCwgMiwgMCk7XG4vLyBKc0ZlYXQuaW1ncHJvYy5jYW5ueShkaXN0TWF0cml4VCwgZGlzdE1hdHJpeFQsIDUwLCA1MCk7XG5cbi8vIGNvbnN0IG5ld1BpeGVsRGF0YSA9IG5ldyBVaW50MzJBcnJheShwaXhlbERhdGEuYnVmZmVyKTtcbi8vIGNvbnN0IGFscGhhID0gKDB4ZmYgPDwgMjQpO1xuLy8gbGV0IGkgPSBkaXN0TWF0cml4VC5jb2xzICogZGlzdE1hdHJpeFQucm93cztcbi8vIGxldCBwaXggPSAwO1xuLy8gd2hpbGUgKGkgPj0gMCkge1xuLy8gICBwaXggPSBkaXN0TWF0cml4VC5kYXRhW2ldO1xuLy8gICBuZXdQaXhlbERhdGFbaV0gPSBhbHBoYSB8IChwaXggPDwgMTYpIHwgKHBpeCA8PCA4KSB8IHBpeDtcbi8vICAgaSAtPSAxO1xuLy8gfVxuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RQQUkgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgcGFpID0gbi5tb2RlbC5jdXN0b21Qcm9wcy5maW5kKChwOiBDdXN0b21Qcm9wKSA9PiBwLnRva2VuID09PSAnUEFJJyk7XG4gIGlmICghcGFpKSByZXR1cm47XG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHBhaS52YWx1ZSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEFuc3dlclR5cGUgPSAobjogVE5vZGUpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICBjb25zdCBwYXQgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQVQnKTtcbiAgcmV0dXJuIHBhdD8udmFsdWU7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFBJID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IHBpID0gbi5tb2RlbC5jdXN0b21Qcm9wcy5maW5kKChwOiBDdXN0b21Qcm9wKSA9PiBwLnRva2VuID09PSAnUEknKTtcbiAgaWYgKCFwaSkgcmV0dXJuO1xuICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShwaS52YWx1ZSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdE5vZGVEYXRhID0gKHNoYTogc3RyaW5nLCBudW1iZXI/OiBudW1iZXIpOiBTZ2ZOb2RlID0+IHtcbiAgcmV0dXJuIHtcbiAgICBpZDogc2hhLFxuICAgIG5hbWU6IHNoYSxcbiAgICBudW1iZXI6IG51bWJlciB8fCAwLFxuICAgIHJvb3RQcm9wczogW10sXG4gICAgbW92ZVByb3BzOiBbXSxcbiAgICBzZXR1cFByb3BzOiBbXSxcbiAgICBtYXJrdXBQcm9wczogW10sXG4gICAgZ2FtZUluZm9Qcm9wczogW10sXG4gICAgbm9kZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgbW92ZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgY3VzdG9tUHJvcHM6IFtdLFxuICB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBpbml0aWFsIHJvb3Qgbm9kZSBvZiB0aGUgdHJlZS5cbiAqXG4gKiBAcGFyYW0gcm9vdFByb3BzIC0gVGhlIHJvb3QgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIFRoZSBpbml0aWFsIHJvb3Qgbm9kZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGluaXRpYWxSb290Tm9kZSA9IChcbiAgcm9vdFByb3BzID0gW1xuICAgICdGRls0XScsXG4gICAgJ0dNWzFdJyxcbiAgICAnQ0FbVVRGLThdJyxcbiAgICAnQVBbZ2hvc3RnbzowLjEuMF0nLFxuICAgICdTWlsxOV0nLFxuICAgICdTVFswXScsXG4gIF1cbikgPT4ge1xuICBjb25zdCB0cmVlID0gbmV3IFRyZWVNb2RlbCgpO1xuICBjb25zdCByb290ID0gdHJlZS5wYXJzZSh7XG4gICAgLy8gJzFiMTZiMScgaXMgdGhlIFNIQTI1NiBoYXNoIG9mIHRoZSAnbidcbiAgICBpZDogJycsXG4gICAgbmFtZTogJycsXG4gICAgaW5kZXg6IDAsXG4gICAgbnVtYmVyOiAwLFxuICAgIHJvb3RQcm9wczogcm9vdFByb3BzLm1hcChwID0+IFJvb3RQcm9wLmZyb20ocCkpLFxuICAgIG1vdmVQcm9wczogW10sXG4gICAgc2V0dXBQcm9wczogW10sXG4gICAgbWFya3VwUHJvcHM6IFtdLFxuICAgIGdhbWVJbmZvUHJvcHM6IFtdLFxuICAgIG5vZGVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIG1vdmVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIGN1c3RvbVByb3BzOiBbXSxcbiAgfSk7XG4gIGNvbnN0IGhhc2ggPSBjYWxjSGFzaChyb290KTtcbiAgcm9vdC5tb2RlbC5pZCA9IGhhc2g7XG5cbiAgcmV0dXJuIHJvb3Q7XG59O1xuXG4vKipcbiAqIEJ1aWxkcyBhIG5ldyB0cmVlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gbW92ZSwgcGFyZW50IG5vZGUsIGFuZCBhZGRpdGlvbmFsIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIG1vdmUgLSBUaGUgbW92ZSB0byBiZSBhZGRlZCB0byB0aGUgbm9kZS5cbiAqIEBwYXJhbSBwYXJlbnROb2RlIC0gVGhlIHBhcmVudCBub2RlIG9mIHRoZSBuZXcgbm9kZS4gT3B0aW9uYWwuXG4gKiBAcGFyYW0gcHJvcHMgLSBBZGRpdGlvbmFsIHByb3BlcnRpZXMgdG8gYmUgYWRkZWQgdG8gdGhlIG5ldyBub2RlLiBPcHRpb25hbC5cbiAqIEByZXR1cm5zIFRoZSBuZXdseSBjcmVhdGVkIHRyZWUgbm9kZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkTW92ZU5vZGUgPSAoXG4gIG1vdmU6IHN0cmluZyxcbiAgcGFyZW50Tm9kZT86IFROb2RlLFxuICBwcm9wcz86IFNnZk5vZGVPcHRpb25zXG4pID0+IHtcbiAgY29uc3QgdHJlZSA9IG5ldyBUcmVlTW9kZWwoKTtcbiAgY29uc3QgbW92ZVByb3AgPSBNb3ZlUHJvcC5mcm9tKG1vdmUpO1xuICBjb25zdCBoYXNoID0gY2FsY0hhc2gocGFyZW50Tm9kZSwgW21vdmVQcm9wXSk7XG4gIGxldCBudW1iZXIgPSAxO1xuICBpZiAocGFyZW50Tm9kZSkgbnVtYmVyID0gZ2V0Tm9kZU51bWJlcihwYXJlbnROb2RlKSArIDE7XG4gIGNvbnN0IG5vZGVEYXRhID0gaW5pdE5vZGVEYXRhKGhhc2gsIG51bWJlcik7XG4gIG5vZGVEYXRhLm1vdmVQcm9wcyA9IFttb3ZlUHJvcF07XG5cbiAgY29uc3Qgbm9kZSA9IHRyZWUucGFyc2Uoe1xuICAgIC4uLm5vZGVEYXRhLFxuICAgIC4uLnByb3BzLFxuICB9KTtcbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TGFzdEluZGV4ID0gKHJvb3Q6IFROb2RlKSA9PiB7XG4gIGxldCBsYXN0Tm9kZSA9IHJvb3Q7XG4gIHJvb3Qud2Fsayhub2RlID0+IHtcbiAgICAvLyBIYWx0IHRoZSB0cmF2ZXJzYWwgYnkgcmV0dXJuaW5nIGZhbHNlXG4gICAgbGFzdE5vZGUgPSBub2RlO1xuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbiAgcmV0dXJuIGxhc3ROb2RlLm1vZGVsLmluZGV4O1xufTtcblxuZXhwb3J0IGNvbnN0IGN1dE1vdmVOb2RlcyA9IChyb290OiBUTm9kZSwgcmV0dXJuUm9vdD86IGJvb2xlYW4pID0+IHtcbiAgbGV0IG5vZGUgPSBjbG9uZURlZXAocm9vdCk7XG4gIHdoaWxlIChub2RlICYmIG5vZGUuaGFzQ2hpbGRyZW4oKSAmJiBub2RlLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICBub2RlLmNoaWxkcmVuID0gW107XG4gIH1cblxuICBpZiAocmV0dXJuUm9vdCkge1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUucGFyZW50ICYmICFub2RlLmlzUm9vdCgpKSB7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Um9vdCA9IChub2RlOiBUTm9kZSkgPT4ge1xuICBsZXQgcm9vdCA9IG5vZGU7XG4gIHdoaWxlIChyb290ICYmIHJvb3QucGFyZW50ICYmICFyb290LmlzUm9vdCgpKSB7XG4gICAgcm9vdCA9IHJvb3QucGFyZW50O1xuICB9XG4gIHJldHVybiByb290O1xufTtcblxuZXhwb3J0IGNvbnN0IHplcm9zID0gKHNpemU6IFtudW1iZXIsIG51bWJlcl0pOiBudW1iZXJbXVtdID0+XG4gIG5ldyBBcnJheShzaXplWzBdKS5maWxsKDApLm1hcCgoKSA9PiBuZXcgQXJyYXkoc2l6ZVsxXSkuZmlsbCgwKSk7XG5cbmV4cG9ydCBjb25zdCBlbXB0eSA9IChzaXplOiBbbnVtYmVyLCBudW1iZXJdKTogc3RyaW5nW11bXSA9PlxuICBuZXcgQXJyYXkoc2l6ZVswXSkuZmlsbCgnJykubWFwKCgpID0+IG5ldyBBcnJheShzaXplWzFdKS5maWxsKCcnKSk7XG5cbmV4cG9ydCBjb25zdCBjYWxjTW9zdCA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGxldCBsZWZ0TW9zdDogbnVtYmVyID0gYm9hcmRTaXplIC0gMTtcbiAgbGV0IHJpZ2h0TW9zdCA9IDA7XG4gIGxldCB0b3BNb3N0OiBudW1iZXIgPSBib2FyZFNpemUgLSAxO1xuICBsZXQgYm90dG9tTW9zdCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGlmIChsZWZ0TW9zdCA+IGkpIGxlZnRNb3N0ID0gaTtcbiAgICAgICAgaWYgKHJpZ2h0TW9zdCA8IGkpIHJpZ2h0TW9zdCA9IGk7XG4gICAgICAgIGlmICh0b3BNb3N0ID4gaikgdG9wTW9zdCA9IGo7XG4gICAgICAgIGlmIChib3R0b21Nb3N0IDwgaikgYm90dG9tTW9zdCA9IGo7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH07XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0NlbnRlciA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGNvbnN0IHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fSA9IGNhbGNNb3N0KG1hdCwgYm9hcmRTaXplKTtcbiAgY29uc3QgdG9wID0gdG9wTW9zdCA8IGJvYXJkU2l6ZSAtIDEgLSBib3R0b21Nb3N0O1xuICBjb25zdCBsZWZ0ID0gbGVmdE1vc3QgPCBib2FyZFNpemUgLSAxIC0gcmlnaHRNb3N0O1xuICBpZiAodG9wICYmIGxlZnQpIHJldHVybiBDZW50ZXIuVG9wTGVmdDtcbiAgaWYgKCF0b3AgJiYgbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21MZWZ0O1xuICBpZiAodG9wICYmICFsZWZ0KSByZXR1cm4gQ2VudGVyLlRvcFJpZ2h0O1xuICBpZiAoIXRvcCAmJiAhbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21SaWdodDtcbiAgcmV0dXJuIENlbnRlci5DZW50ZXI7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0JvYXJkU2l6ZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBib2FyZFNpemUgPSAxOSxcbiAgZXh0ZW50ID0gMlxuKTogbnVtYmVyW10gPT4ge1xuICBjb25zdCByZXN1bHQgPSBbMTksIDE5XTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQsIGJvYXJkU2l6ZSk7XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0KSB7XG4gICAgcmVzdWx0WzBdID0gcmlnaHRNb3N0ICsgZXh0ZW50ICsgMTtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW50ICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVudDtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW50ICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCkge1xuICAgIHJlc3VsdFswXSA9IHJpZ2h0TW9zdCArIGV4dGVudCArIDE7XG4gICAgcmVzdWx0WzFdID0gYm9hcmRTaXplIC0gdG9wTW9zdCArIGV4dGVudDtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVudDtcbiAgICByZXN1bHRbMV0gPSBib2FyZFNpemUgLSB0b3BNb3N0ICsgZXh0ZW50O1xuICB9XG4gIHJlc3VsdFswXSA9IE1hdGgubWluKHJlc3VsdFswXSwgYm9hcmRTaXplKTtcbiAgcmVzdWx0WzFdID0gTWF0aC5taW4ocmVzdWx0WzFdLCBib2FyZFNpemUpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1BhcnRpYWxBcmVhID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGV4dGVudCA9IDIsXG4gIGJvYXJkU2l6ZSA9IDE5XG4pOiBbW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXV0gPT4ge1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQpO1xuXG4gIGNvbnN0IHNpemUgPSBib2FyZFNpemUgLSAxO1xuICBjb25zdCB4MSA9IGxlZnRNb3N0IC0gZXh0ZW50IDwgMCA/IDAgOiBsZWZ0TW9zdCAtIGV4dGVudDtcbiAgY29uc3QgeTEgPSB0b3BNb3N0IC0gZXh0ZW50IDwgMCA/IDAgOiB0b3BNb3N0IC0gZXh0ZW50O1xuICBjb25zdCB4MiA9IHJpZ2h0TW9zdCArIGV4dGVudCA+IHNpemUgPyBzaXplIDogcmlnaHRNb3N0ICsgZXh0ZW50O1xuICBjb25zdCB5MiA9IGJvdHRvbU1vc3QgKyBleHRlbnQgPiBzaXplID8gc2l6ZSA6IGJvdHRvbU1vc3QgKyBleHRlbnQ7XG5cbiAgcmV0dXJuIFtcbiAgICBbeDEsIHkxXSxcbiAgICBbeDIsIHkyXSxcbiAgXTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQXZvaWRNb3Zlc0ZvclBhcnRpYWxBbmFseXNpcyA9IChcbiAgcGFydGlhbEFyZWE6IFtbbnVtYmVyLCBudW1iZXJdLCBbbnVtYmVyLCBudW1iZXJdXSxcbiAgYm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3QgW1t4MSwgeTFdLCBbeDIsIHkyXV0gPSBwYXJ0aWFsQXJlYTtcblxuICBmb3IgKGNvbnN0IGNvbCBvZiBBMV9MRVRURVJTLnNsaWNlKDAsIGJvYXJkU2l6ZSkpIHtcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiBBMV9OVU1CRVJTLnNsaWNlKC1ib2FyZFNpemUpKSB7XG4gICAgICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKGNvbCk7XG4gICAgICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHJvdyk7XG5cbiAgICAgIGlmICh4IDwgeDEgfHwgeCA+IHgyIHx8IHkgPCB5MSB8fCB5ID4geTIpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYCR7Y29sfSR7cm93fWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1RzdW1lZ29GcmFtZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBleHRlbnQ6IG51bWJlcixcbiAgYm9hcmRTaXplID0gMTksXG4gIGtvbWkgPSA3LjUsXG4gIHR1cm46IEtpID0gS2kuQmxhY2ssXG4gIGtvID0gZmFsc2Vcbik6IG51bWJlcltdW10gPT4ge1xuICBjb25zdCByZXN1bHQgPSBjbG9uZURlZXAobWF0KTtcbiAgY29uc3QgcGFydGlhbEFyZWEgPSBjYWxjUGFydGlhbEFyZWEobWF0LCBleHRlbnQsIGJvYXJkU2l6ZSk7XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcbiAgY29uc3QgcHV0Qm9yZGVyID0gKG1hdDogbnVtYmVyW11bXSkgPT4ge1xuICAgIGNvbnN0IFt4MSwgeTFdID0gcGFydGlhbEFyZWFbMF07XG4gICAgY29uc3QgW3gyLCB5Ml0gPSBwYXJ0aWFsQXJlYVsxXTtcbiAgICBmb3IgKGxldCBpID0geDE7IGkgPD0geDI7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IHkxOyBqIDw9IHkyOyBqKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAoKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCAmJlxuICAgICAgICAgICgoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAoKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCAmJlxuICAgICAgICAgICgoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApIHx8XG4gICAgICAgICAgICAoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGNlbnRlciA9PT0gQ2VudGVyLkNlbnRlcikge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHB1dE91dHNpZGUgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gICAgY29uc3Qgb2ZmZW5jZVRvV2luID0gMTA7XG4gICAgY29uc3Qgb2ZmZW5zZUtvbWkgPSB0dXJuICoga29taTtcbiAgICBjb25zdCBbeDEsIHkxXSA9IHBhcnRpYWxBcmVhWzBdO1xuICAgIGNvbnN0IFt4MiwgeTJdID0gcGFydGlhbEFyZWFbMV07XG4gICAgLy8gVE9ETzogSGFyZCBjb2RlIGZvciBub3dcbiAgICAvLyBjb25zdCBibGFja1RvQXR0YWNrID0gdHVybiA9PT0gS2kuQmxhY2s7XG4gICAgY29uc3QgYmxhY2tUb0F0dGFjayA9IHR1cm4gPT09IEtpLkJsYWNrO1xuICAgIGNvbnN0IGlzaXplID0geDIgLSB4MTtcbiAgICBjb25zdCBqc2l6ZSA9IHkyIC0geTE7XG4gICAgLy8gVE9ETzogMzYxIGlzIGhhcmRjb2RlZFxuICAgIC8vIGNvbnN0IGRlZmVuc2VBcmVhID0gTWF0aC5mbG9vcihcbiAgICAvLyAgICgzNjEgLSBpc2l6ZSAqIGpzaXplIC0gb2ZmZW5zZUtvbWkgLSBvZmZlbmNlVG9XaW4pIC8gMlxuICAgIC8vICk7XG4gICAgY29uc3QgZGVmZW5zZUFyZWEgPVxuICAgICAgTWF0aC5mbG9vcigoMzYxIC0gaXNpemUgKiBqc2l6ZSkgLyAyKSAtIG9mZmVuc2VLb21pIC0gb2ZmZW5jZVRvV2luO1xuXG4gICAgLy8gY29uc3QgZGVmZW5zZUFyZWEgPSAzMDtcblxuICAgIC8vIG91dHNpZGUgdGhlIGZyYW1lXG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkU2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkU2l6ZTsgaisrKSB7XG4gICAgICAgIGlmIChpIDwgeDEgfHwgaSA+IHgyIHx8IGogPCB5MSB8fCBqID4geTIpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIGxldCBraSA9IEtpLkVtcHR5O1xuICAgICAgICAgIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0IHx8IGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQpIHtcbiAgICAgICAgICAgIGtpID0gYmxhY2tUb0F0dGFjayAhPT0gY291bnQgPD0gZGVmZW5zZUFyZWEgPyBLaS5XaGl0ZSA6IEtpLkJsYWNrO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGtpID0gYmxhY2tUb0F0dGFjayAhPT0gY291bnQgPD0gZGVmZW5zZUFyZWEgPyBLaS5CbGFjayA6IEtpLldoaXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKGkgKyBqKSAlIDIgPT09IDAgJiYgTWF0aC5hYnMoY291bnQgLSBkZWZlbnNlQXJlYSkgPiBib2FyZFNpemUpIHtcbiAgICAgICAgICAgIGtpID0gS2kuRW1wdHk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWF0W2ldW2pdID0ga2k7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8vIFRPRE86XG4gIGNvbnN0IHB1dEtvVGhyZWF0ID0gKG1hdDogbnVtYmVyW11bXSwga286IGJvb2xlYW4pID0+IHt9O1xuXG4gIHB1dEJvcmRlcihyZXN1bHQpO1xuICBwdXRPdXRzaWRlKHJlc3VsdCk7XG5cbiAgLy8gY29uc3QgZmxpcFNwZWMgPVxuICAvLyAgIGltaW4gPCBqbWluXG4gIC8vICAgICA/IFtmYWxzZSwgZmFsc2UsIHRydWVdXG4gIC8vICAgICA6IFtuZWVkRmxpcChpbWluLCBpbWF4LCBpc2l6ZSksIG5lZWRGbGlwKGptaW4sIGptYXgsIGpzaXplKSwgZmFsc2VdO1xuXG4gIC8vIGlmIChmbGlwU3BlYy5pbmNsdWRlcyh0cnVlKSkge1xuICAvLyAgIGNvbnN0IGZsaXBwZWQgPSBmbGlwU3RvbmVzKHN0b25lcywgZmxpcFNwZWMpO1xuICAvLyAgIGNvbnN0IGZpbGxlZCA9IHRzdW1lZ29GcmFtZVN0b25lcyhmbGlwcGVkLCBrb21pLCBibGFja1RvUGxheSwga28sIG1hcmdpbik7XG4gIC8vICAgcmV0dXJuIGZsaXBTdG9uZXMoZmlsbGVkLCBmbGlwU3BlYyk7XG4gIC8vIH1cblxuICAvLyBjb25zdCBpMCA9IGltaW4gLSBtYXJnaW47XG4gIC8vIGNvbnN0IGkxID0gaW1heCArIG1hcmdpbjtcbiAgLy8gY29uc3QgajAgPSBqbWluIC0gbWFyZ2luO1xuICAvLyBjb25zdCBqMSA9IGptYXggKyBtYXJnaW47XG4gIC8vIGNvbnN0IGZyYW1lUmFuZ2U6IFJlZ2lvbiA9IFtpMCwgaTEsIGowLCBqMV07XG4gIC8vIGNvbnN0IGJsYWNrVG9BdHRhY2sgPSBndWVzc0JsYWNrVG9BdHRhY2soXG4gIC8vICAgW3RvcCwgYm90dG9tLCBsZWZ0LCByaWdodF0sXG4gIC8vICAgW2lzaXplLCBqc2l6ZV1cbiAgLy8gKTtcblxuICAvLyBwdXRCb3JkZXIobWF0LCBbaXNpemUsIGpzaXplXSwgZnJhbWVSYW5nZSwgYmxhY2tUb0F0dGFjayk7XG4gIC8vIHB1dE91dHNpZGUoXG4gIC8vICAgc3RvbmVzLFxuICAvLyAgIFtpc2l6ZSwganNpemVdLFxuICAvLyAgIGZyYW1lUmFuZ2UsXG4gIC8vICAgYmxhY2tUb0F0dGFjayxcbiAgLy8gICBibGFja1RvUGxheSxcbiAgLy8gICBrb21pXG4gIC8vICk7XG4gIC8vIHB1dEtvVGhyZWF0KFxuICAvLyAgIHN0b25lcyxcbiAgLy8gICBbaXNpemUsIGpzaXplXSxcbiAgLy8gICBmcmFtZVJhbmdlLFxuICAvLyAgIGJsYWNrVG9BdHRhY2ssXG4gIC8vICAgYmxhY2tUb1BsYXksXG4gIC8vICAga29cbiAgLy8gKTtcbiAgLy8gcmV0dXJuIHN0b25lcztcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNPZmZzZXQgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gIGNvbnN0IGJvYXJkU2l6ZSA9IGNhbGNCb2FyZFNpemUobWF0KTtcbiAgY29uc3Qgb3ggPSAxOSAtIGJvYXJkU2l6ZVswXTtcbiAgY29uc3Qgb3kgPSAxOSAtIGJvYXJkU2l6ZVsxXTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuXG4gIGxldCBvb3ggPSBveDtcbiAgbGV0IG9veSA9IG95O1xuICBzd2l0Y2ggKGNlbnRlcikge1xuICAgIGNhc2UgQ2VudGVyLlRvcExlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSBveTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Ub3BSaWdodDoge1xuICAgICAgb294ID0gLW94O1xuICAgICAgb295ID0gb3k7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tTGVmdDoge1xuICAgICAgb294ID0gMDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tUmlnaHQ6IHtcbiAgICAgIG9veCA9IC1veDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt4OiBvb3gsIHk6IG9veX07XG59O1xuXG5leHBvcnQgY29uc3QgcmV2ZXJzZU9mZnNldCA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBieCA9IDE5LFxuICBieSA9IDE5LFxuICBib2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGNvbnN0IG94ID0gYm9hcmRTaXplIC0gYng7XG4gIGNvbnN0IG95ID0gYm9hcmRTaXplIC0gYnk7XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcblxuICBsZXQgb294ID0gb3g7XG4gIGxldCBvb3kgPSBveTtcbiAgc3dpdGNoIChjZW50ZXIpIHtcbiAgICBjYXNlIENlbnRlci5Ub3BMZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gLW95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLlRvcFJpZ2h0OiB7XG4gICAgICBvb3ggPSBveDtcbiAgICAgIG9veSA9IC1veTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21MZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21SaWdodDoge1xuICAgICAgb294ID0gb3g7XG4gICAgICBvb3kgPSAwO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB7eDogb294LCB5OiBvb3l9O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNWaXNpYmxlQXJlYShcbiAgbWF0OiBudW1iZXJbXVtdID0gemVyb3MoWzE5LCAxOV0pLFxuICBleHRlbnQ6IG51bWJlcixcbiAgYWxsb3dSZWN0YW5nbGUgPSBmYWxzZVxuKTogbnVtYmVyW11bXSB7XG4gIGxldCBtaW5Sb3cgPSBtYXQubGVuZ3RoO1xuICBsZXQgbWF4Um93ID0gMDtcbiAgbGV0IG1pbkNvbCA9IG1hdFswXS5sZW5ndGg7XG4gIGxldCBtYXhDb2wgPSAwO1xuXG4gIGxldCBlbXB0eSA9IHRydWU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFswXS5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKG1hdFtpXVtqXSAhPT0gMCkge1xuICAgICAgICBlbXB0eSA9IGZhbHNlO1xuICAgICAgICBtaW5Sb3cgPSBNYXRoLm1pbihtaW5Sb3csIGkpO1xuICAgICAgICBtYXhSb3cgPSBNYXRoLm1heChtYXhSb3csIGkpO1xuICAgICAgICBtaW5Db2wgPSBNYXRoLm1pbihtaW5Db2wsIGopO1xuICAgICAgICBtYXhDb2wgPSBNYXRoLm1heChtYXhDb2wsIGopO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChlbXB0eSkge1xuICAgIHJldHVybiBbXG4gICAgICBbMCwgbWF0Lmxlbmd0aCAtIDFdLFxuICAgICAgWzAsIG1hdFswXS5sZW5ndGggLSAxXSxcbiAgICBdO1xuICB9XG5cbiAgaWYgKCFhbGxvd1JlY3RhbmdsZSkge1xuICAgIGNvbnN0IG1pblJvd1dpdGhFeHRlbnQgPSBNYXRoLm1heChtaW5Sb3cgLSBleHRlbnQsIDApO1xuICAgIGNvbnN0IG1heFJvd1dpdGhFeHRlbnQgPSBNYXRoLm1pbihtYXhSb3cgKyBleHRlbnQsIG1hdC5sZW5ndGggLSAxKTtcbiAgICBjb25zdCBtaW5Db2xXaXRoRXh0ZW50ID0gTWF0aC5tYXgobWluQ29sIC0gZXh0ZW50LCAwKTtcbiAgICBjb25zdCBtYXhDb2xXaXRoRXh0ZW50ID0gTWF0aC5taW4obWF4Q29sICsgZXh0ZW50LCBtYXRbMF0ubGVuZ3RoIC0gMSk7XG5cbiAgICBjb25zdCBtYXhSYW5nZSA9IE1hdGgubWF4KFxuICAgICAgbWF4Um93V2l0aEV4dGVudCAtIG1pblJvd1dpdGhFeHRlbnQsXG4gICAgICBtYXhDb2xXaXRoRXh0ZW50IC0gbWluQ29sV2l0aEV4dGVudFxuICAgICk7XG5cbiAgICBtaW5Sb3cgPSBtaW5Sb3dXaXRoRXh0ZW50O1xuICAgIG1heFJvdyA9IG1pblJvdyArIG1heFJhbmdlO1xuXG4gICAgaWYgKG1heFJvdyA+PSBtYXQubGVuZ3RoKSB7XG4gICAgICBtYXhSb3cgPSBtYXQubGVuZ3RoIC0gMTtcbiAgICAgIG1pblJvdyA9IG1heFJvdyAtIG1heFJhbmdlO1xuICAgIH1cblxuICAgIG1pbkNvbCA9IG1pbkNvbFdpdGhFeHRlbnQ7XG4gICAgbWF4Q29sID0gbWluQ29sICsgbWF4UmFuZ2U7XG4gICAgaWYgKG1heENvbCA+PSBtYXRbMF0ubGVuZ3RoKSB7XG4gICAgICBtYXhDb2wgPSBtYXRbMF0ubGVuZ3RoIC0gMTtcbiAgICAgIG1pbkNvbCA9IG1heENvbCAtIG1heFJhbmdlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBtaW5Sb3cgPSBNYXRoLm1heCgwLCBtaW5Sb3cgLSBleHRlbnQpO1xuICAgIG1heFJvdyA9IE1hdGgubWluKG1hdC5sZW5ndGggLSAxLCBtYXhSb3cgKyBleHRlbnQpO1xuICAgIG1pbkNvbCA9IE1hdGgubWF4KDAsIG1pbkNvbCAtIGV4dGVudCk7XG4gICAgbWF4Q29sID0gTWF0aC5taW4obWF0WzBdLmxlbmd0aCAtIDEsIG1heENvbCArIGV4dGVudCk7XG4gIH1cblxuICByZXR1cm4gW1xuICAgIFttaW5Sb3csIG1heFJvd10sXG4gICAgW21pbkNvbCwgbWF4Q29sXSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmUobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikge1xuICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybiBtYXQ7XG4gIGNvbnN0IG5ld01hdCA9IGNsb25lRGVlcChtYXQpO1xuICBuZXdNYXRbaV1bal0gPSBraTtcbiAgcmV0dXJuIGV4ZWNDYXB0dXJlKG5ld01hdCwgaSwgaiwgLWtpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dLaShtYXQ6IG51bWJlcltdW10sIHN0ZXBzOiBzdHJpbmdbXSwgaXNDYXB0dXJlZCA9IHRydWUpIHtcbiAgbGV0IG5ld01hdCA9IGNsb25lRGVlcChtYXQpO1xuICBsZXQgaGFzTW92ZWQgPSBmYWxzZTtcbiAgc3RlcHMuZm9yRWFjaChzdHIgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAga2ksXG4gICAgfToge1xuICAgICAgeDogbnVtYmVyO1xuICAgICAgeTogbnVtYmVyO1xuICAgICAga2k6IG51bWJlcjtcbiAgICB9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgICBpZiAoaXNDYXB0dXJlZCkge1xuICAgICAgaWYgKGNhbk1vdmUobmV3TWF0LCB4LCB5LCBraSkpIHtcbiAgICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICAgIG5ld01hdCA9IGV4ZWNDYXB0dXJlKG5ld01hdCwgeCwgeSwgLWtpKTtcbiAgICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJyYW5nZW1lbnQ6IG5ld01hdCxcbiAgICBoYXNNb3ZlZCxcbiAgfTtcbn1cblxuLy8gVE9ETzpcbmV4cG9ydCBjb25zdCBoYW5kbGVNb3ZlID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICB0dXJuOiBLaSxcbiAgY3VycmVudE5vZGU6IFROb2RlLFxuICBvbkFmdGVyTW92ZTogKG5vZGU6IFROb2RlLCBpc01vdmVkOiBib29sZWFuKSA9PiB2b2lkXG4pID0+IHtcbiAgaWYgKHR1cm4gPT09IEtpLkVtcHR5KSByZXR1cm47XG4gIGlmIChjYW5Nb3ZlKG1hdCwgaSwgaiwgdHVybikpIHtcbiAgICAvLyBkaXNwYXRjaCh1aVNsaWNlLmFjdGlvbnMuc2V0VHVybigtdHVybikpO1xuICAgIGNvbnN0IHZhbHVlID0gU0dGX0xFVFRFUlNbaV0gKyBTR0ZfTEVUVEVSU1tqXTtcbiAgICBjb25zdCB0b2tlbiA9IHR1cm4gPT09IEtpLkJsYWNrID8gJ0InIDogJ1cnO1xuICAgIGNvbnN0IGhhc2ggPSBjYWxjSGFzaChjdXJyZW50Tm9kZSwgW01vdmVQcm9wLmZyb20oYCR7dG9rZW59WyR7dmFsdWV9XWApXSk7XG4gICAgY29uc3QgZmlsdGVyZWQgPSBjdXJyZW50Tm9kZS5jaGlsZHJlbi5maWx0ZXIoXG4gICAgICAobjogVE5vZGUpID0+IG4ubW9kZWwuaWQgPT09IGhhc2hcbiAgICApO1xuICAgIGxldCBub2RlOiBUTm9kZTtcbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgbm9kZSA9IGZpbHRlcmVkWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gYnVpbGRNb3ZlTm9kZShgJHt0b2tlbn1bJHt2YWx1ZX1dYCwgY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGlmIChvbkFmdGVyTW92ZSkgb25BZnRlck1vdmUobm9kZSwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9uQWZ0ZXJNb3ZlKSBvbkFmdGVyTW92ZShjdXJyZW50Tm9kZSwgZmFsc2UpO1xuICB9XG59O1xuXG4vKipcbiAqIENsZWFyIHN0b25lIGZyb20gdGhlIGN1cnJlbnROb2RlXG4gKiBAcGFyYW0gY3VycmVudE5vZGVcbiAqIEBwYXJhbSB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgY2xlYXJTdG9uZUZyb21DdXJyZW50Tm9kZSA9IChcbiAgY3VycmVudE5vZGU6IFROb2RlLFxuICB2YWx1ZTogc3RyaW5nXG4pID0+IHtcbiAgY29uc3QgcGF0aCA9IGN1cnJlbnROb2RlLmdldFBhdGgoKTtcbiAgcGF0aC5mb3JFYWNoKG5vZGUgPT4ge1xuICAgIGNvbnN0IHtzZXR1cFByb3BzfSA9IG5vZGUubW9kZWw7XG4gICAgaWYgKHNldHVwUHJvcHMuZmlsdGVyKChzOiBTZXR1cFByb3ApID0+IHMudmFsdWUgPT09IHZhbHVlKS5sZW5ndGggPiAwKSB7XG4gICAgICBub2RlLm1vZGVsLnNldHVwUHJvcHMgPSBzZXR1cFByb3BzLmZpbHRlcigoczogYW55KSA9PiBzLnZhbHVlICE9PSB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldHVwUHJvcHMuZm9yRWFjaCgoczogU2V0dXBQcm9wKSA9PiB7XG4gICAgICAgIHMudmFsdWVzID0gcy52YWx1ZXMuZmlsdGVyKHYgPT4gdiAhPT0gdmFsdWUpO1xuICAgICAgICBpZiAocy52YWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgbm9kZS5tb2RlbC5zZXR1cFByb3BzID0gbm9kZS5tb2RlbC5zZXR1cFByb3BzLmZpbHRlcihcbiAgICAgICAgICAgIChwOiBTZXR1cFByb3ApID0+IHAudG9rZW4gIT09IHMudG9rZW5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBBZGRzIGEgc3RvbmUgdG8gdGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqXG4gKiBAcGFyYW0gY3VycmVudE5vZGUgVGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIEBwYXJhbSBtYXQgVGhlIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIGJvYXJkLlxuICogQHBhcmFtIGkgVGhlIHJvdyBpbmRleCBvZiB0aGUgc3RvbmUuXG4gKiBAcGFyYW0gaiBUaGUgY29sdW1uIGluZGV4IG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSBraSBUaGUgY29sb3Igb2YgdGhlIHN0b25lIChLaS5XaGl0ZSBvciBLaS5CbGFjaykuXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBzdG9uZSB3YXMgcmVtb3ZlZCBmcm9tIHByZXZpb3VzIG5vZGVzLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRTdG9uZVRvQ3VycmVudE5vZGUgPSAoXG4gIGN1cnJlbnROb2RlOiBUTm9kZSxcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBpOiBudW1iZXIsXG4gIGo6IG51bWJlcixcbiAga2k6IEtpXG4pID0+IHtcbiAgY29uc3QgdmFsdWUgPSBTR0ZfTEVUVEVSU1tpXSArIFNHRl9MRVRURVJTW2pdO1xuICBjb25zdCB0b2tlbiA9IGtpID09PSBLaS5XaGl0ZSA/ICdBVycgOiAnQUInO1xuICBjb25zdCBwcm9wID0gZmluZFByb3AoY3VycmVudE5vZGUsIHRva2VuKTtcbiAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICBpZiAobWF0W2ldW2pdICE9PSBLaS5FbXB0eSkge1xuICAgIGNsZWFyU3RvbmVGcm9tQ3VycmVudE5vZGUoY3VycmVudE5vZGUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvcCkge1xuICAgICAgcHJvcC52YWx1ZXMgPSBbLi4ucHJvcC52YWx1ZXMsIHZhbHVlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE5vZGUubW9kZWwuc2V0dXBQcm9wcyA9IFtcbiAgICAgICAgLi4uY3VycmVudE5vZGUubW9kZWwuc2V0dXBQcm9wcyxcbiAgICAgICAgbmV3IFNldHVwUHJvcCh0b2tlbiwgdmFsdWUpLFxuICAgICAgXTtcbiAgICB9XG4gICAgcmVzdWx0ID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBBZGRzIGEgbW92ZSB0byB0aGUgZ2l2ZW4gbWF0cml4IGFuZCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBJZiB0aGUga2kgaXMgZW1wdHksIG5vIG1vdmUgaXMgYWRkZWQgYW5kIG51bGwgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIG1hdCAtIFRoZSBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSBnYW1lIGJvYXJkLlxuICogQHBhcmFtIGN1cnJlbnROb2RlIC0gVGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIEBwYXJhbSBpIC0gVGhlIHJvdyBpbmRleCBvZiB0aGUgbW92ZS5cbiAqIEBwYXJhbSBqIC0gVGhlIGNvbHVtbiBpbmRleCBvZiB0aGUgbW92ZS5cbiAqIEBwYXJhbSBraSAtIFRoZSB0eXBlIG9mIG1vdmUgKEtpKS5cbiAqIEByZXR1cm5zIFRoZSBjb3JyZXNwb25kaW5nIG5vZGUgaW4gdGhlIHRyZWUsIG9yIG51bGwgaWYgbm8gbW92ZSBpcyBhZGRlZC5cbiAqL1xuLy8gVE9ETzogVGhlIHBhcmFtcyBoZXJlIGlzIHdlaXJkXG5leHBvcnQgY29uc3QgYWRkTW92ZVRvQ3VycmVudE5vZGUgPSAoXG4gIGN1cnJlbnROb2RlOiBUTm9kZSxcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBpOiBudW1iZXIsXG4gIGo6IG51bWJlcixcbiAga2k6IEtpLFxuICBwcmV2aW91c0JvYXJkU3RhdGU/OiBudW1iZXJbXVtdIHwgbnVsbFxuKSA9PiB7XG4gIGlmIChraSA9PT0gS2kuRW1wdHkpIHJldHVybjtcbiAgbGV0IG5vZGU7XG4gIGlmIChjYW5Nb3ZlKG1hdCwgaSwgaiwga2ksIHByZXZpb3VzQm9hcmRTdGF0ZSkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IFNHRl9MRVRURVJTW2ldICsgU0dGX0xFVFRFUlNbal07XG4gICAgY29uc3QgdG9rZW4gPSBraSA9PT0gS2kuQmxhY2sgPyAnQicgOiAnVyc7XG4gICAgY29uc3QgaGFzaCA9IGNhbGNIYXNoKGN1cnJlbnROb2RlLCBbTW92ZVByb3AuZnJvbShgJHt0b2tlbn1bJHt2YWx1ZX1dYCldKTtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IGN1cnJlbnROb2RlLmNoaWxkcmVuLmZpbHRlcihcbiAgICAgIChuOiBUTm9kZSkgPT4gbi5tb2RlbC5pZCA9PT0gaGFzaFxuICAgICk7XG4gICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vZGUgPSBmaWx0ZXJlZFswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IGJ1aWxkTW92ZU5vZGUoYCR7dG9rZW59WyR7dmFsdWV9XWAsIGN1cnJlbnROb2RlKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKG5vZGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjUHJldmVudE1vdmVNYXRGb3JEaXNwbGF5T25seSA9IChcbiAgbm9kZTogVE5vZGUsXG4gIGRlZmF1bHRCb2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGlmICghbm9kZSkgcmV0dXJuIHplcm9zKFtkZWZhdWx0Qm9hcmRTaXplLCBkZWZhdWx0Qm9hcmRTaXplXSk7XG4gIGNvbnN0IHNpemUgPSBleHRyYWN0Qm9hcmRTaXplKG5vZGUsIGRlZmF1bHRCb2FyZFNpemUpO1xuICBjb25zdCBwcmV2ZW50TW92ZU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG5cbiAgcHJldmVudE1vdmVNYXQuZm9yRWFjaChyb3cgPT4gcm93LmZpbGwoMSkpO1xuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChuOiBUTm9kZSkgPT4ge1xuICAgICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgIHByZXZlbnRNb3ZlTWF0W2ldW2pdID0gMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHByZXZlbnRNb3ZlTWF0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNQcmV2ZW50TW92ZU1hdCA9IChub2RlOiBUTm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGlmICghbm9kZSkgcmV0dXJuIHplcm9zKFtkZWZhdWx0Qm9hcmRTaXplLCBkZWZhdWx0Qm9hcmRTaXplXSk7XG4gIGNvbnN0IHNpemUgPSBleHRyYWN0Qm9hcmRTaXplKG5vZGUsIGRlZmF1bHRCb2FyZFNpemUpO1xuICBjb25zdCBwcmV2ZW50TW92ZU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IGZvcmNlTm9kZXMgPSBbXTtcbiAgbGV0IHByZXZlbnRNb3ZlTm9kZXM6IFROb2RlW10gPSBbXTtcbiAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSkge1xuICAgIHByZXZlbnRNb3ZlTm9kZXMgPSBub2RlLmNoaWxkcmVuLmZpbHRlcigobjogVE5vZGUpID0+IGlzUHJldmVudE1vdmVOb2RlKG4pKTtcbiAgfVxuXG4gIGlmIChpc0ZvcmNlTm9kZShub2RlKSkge1xuICAgIHByZXZlbnRNb3ZlTWF0LmZvckVhY2gocm93ID0+IHJvdy5maWxsKDEpKTtcbiAgICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFROb2RlKSA9PiB7XG4gICAgICAgIG4ubW9kZWwubW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICAgIHByZXZlbnRNb3ZlTWF0W2ldW2pdID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJldmVudE1vdmVOb2Rlcy5mb3JFYWNoKChuOiBUTm9kZSkgPT4ge1xuICAgIG4ubW9kZWwubW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgcHJldmVudE1vdmVNYXRbaV1bal0gPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJldmVudE1vdmVNYXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIG1hcmt1cCBtYXRyaXggZm9yIHZhcmlhdGlvbnMgaW4gYSBnaXZlbiBTR0Ygbm9kZS5cbiAqXG4gKiBAcGFyYW0gbm9kZSAtIFRoZSBTR0Ygbm9kZSB0byBjYWxjdWxhdGUgdGhlIG1hcmt1cCBmb3IuXG4gKiBAcGFyYW0gcG9saWN5IC0gVGhlIHBvbGljeSBmb3IgaGFuZGxpbmcgdGhlIG1hcmt1cC4gRGVmYXVsdHMgdG8gJ2FwcGVuZCcuXG4gKiBAcmV0dXJucyBUaGUgY2FsY3VsYXRlZCBtYXJrdXAgZm9yIHRoZSB2YXJpYXRpb25zLlxuICovXG5leHBvcnQgY29uc3QgY2FsY1ZhcmlhdGlvbnNNYXJrdXAgPSAoXG4gIG5vZGU6IFROb2RlLFxuICBwb2xpY3k6ICdhcHBlbmQnIHwgJ3ByZXBlbmQnIHwgJ3JlcGxhY2UnID0gJ2FwcGVuZCcsXG4gIGFjdGl2ZUluZGV4OiBudW1iZXIgPSAwLFxuICBkZWZhdWx0Qm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBjb25zdCByZXMgPSBjYWxjTWF0QW5kTWFya3VwKG5vZGUpO1xuICBjb25zdCB7bWF0LCBtYXJrdXB9ID0gcmVzO1xuICBjb25zdCBzaXplID0gZXh0cmFjdEJvYXJkU2l6ZShub2RlLCBkZWZhdWx0Qm9hcmRTaXplKTtcblxuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChuOiBUTm9kZSkgPT4ge1xuICAgICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgbGV0IG1hcmsgPSBNYXJrdXAuTmV1dHJhbE5vZGU7XG4gICAgICAgICAgaWYgKGluV3JvbmdQYXRoKG4pKSB7XG4gICAgICAgICAgICBtYXJrID1cbiAgICAgICAgICAgICAgbi5nZXRJbmRleCgpID09PSBhY3RpdmVJbmRleFxuICAgICAgICAgICAgICAgID8gTWFya3VwLk5lZ2F0aXZlQWN0aXZlTm9kZVxuICAgICAgICAgICAgICAgIDogTWFya3VwLk5lZ2F0aXZlTm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluUmlnaHRQYXRoKG4pKSB7XG4gICAgICAgICAgICBtYXJrID1cbiAgICAgICAgICAgICAgbi5nZXRJbmRleCgpID09PSBhY3RpdmVJbmRleFxuICAgICAgICAgICAgICAgID8gTWFya3VwLlBvc2l0aXZlQWN0aXZlTm9kZVxuICAgICAgICAgICAgICAgIDogTWFya3VwLlBvc2l0aXZlTm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1hdFtpXVtqXSA9PT0gS2kuRW1wdHkpIHtcbiAgICAgICAgICAgIHN3aXRjaCAocG9saWN5KSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3ByZXBlbmQnOlxuICAgICAgICAgICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcmsgKyAnfCcgKyBtYXJrdXBbaV1bal07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2UnOlxuICAgICAgICAgICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcms7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcGVuZCc6XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbWFya3VwW2ldW2pdICs9ICd8JyArIG1hcms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBtYXJrdXA7XG59O1xuXG5leHBvcnQgY29uc3QgZGV0ZWN0U1QgPSAobm9kZTogVE5vZGUpID0+IHtcbiAgLy8gUmVmZXJlbmNlOiBodHRwczovL3d3dy5yZWQtYmVhbi5jb20vc2dmL3Byb3BlcnRpZXMuaHRtbCNTVFxuICBjb25zdCByb290ID0gbm9kZS5nZXRQYXRoKClbMF07XG4gIGNvbnN0IHN0UHJvcCA9IHJvb3QubW9kZWwucm9vdFByb3BzLmZpbmQoKHA6IFJvb3RQcm9wKSA9PiBwLnRva2VuID09PSAnU1QnKTtcbiAgbGV0IHNob3dWYXJpYXRpb25zTWFya3VwID0gZmFsc2U7XG4gIGxldCBzaG93Q2hpbGRyZW5NYXJrdXAgPSBmYWxzZTtcbiAgbGV0IHNob3dTaWJsaW5nc01hcmt1cCA9IGZhbHNlO1xuXG4gIGNvbnN0IHN0ID0gc3RQcm9wPy52YWx1ZSB8fCAnMCc7XG4gIGlmIChzdCkge1xuICAgIGlmIChzdCA9PT0gJzAnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IHRydWU7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzEnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSB0cnVlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gZmFsc2U7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzInKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IHRydWU7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoc3QgPT09ICczJykge1xuICAgICAgc2hvd1NpYmxpbmdzTWFya3VwID0gdHJ1ZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IGZhbHNlO1xuICAgICAgc2hvd1ZhcmlhdGlvbnNNYXJrdXAgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtzaG93VmFyaWF0aW9uc01hcmt1cCwgc2hvd0NoaWxkcmVuTWFya3VwLCBzaG93U2libGluZ3NNYXJrdXB9O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBtYXQgYW5kIG1hcmt1cCBhcnJheXMgYmFzZWQgb24gdGhlIGN1cnJlbnROb2RlIGFuZCBkZWZhdWx0Qm9hcmRTaXplLlxuICogQHBhcmFtIGN1cnJlbnROb2RlIFRoZSBjdXJyZW50IG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBAcGFyYW0gZGVmYXVsdEJvYXJkU2l6ZSBUaGUgZGVmYXVsdCBzaXplIG9mIHRoZSBib2FyZCAob3B0aW9uYWwsIGRlZmF1bHQgaXMgMTkpLlxuICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hdC92aXNpYmxlQXJlYU1hdC9tYXJrdXAvbnVtTWFya3VwIGFycmF5cy5cbiAqL1xuZXhwb3J0IGNvbnN0IGNhbGNNYXRBbmRNYXJrdXAgPSAoY3VycmVudE5vZGU6IFROb2RlLCBkZWZhdWx0Qm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3QgcGF0aCA9IGN1cnJlbnROb2RlLmdldFBhdGgoKTtcbiAgY29uc3Qgcm9vdCA9IHBhdGhbMF07XG5cbiAgbGV0IGxpLCBsajtcbiAgbGV0IHNldHVwQ291bnQgPSAwO1xuICBjb25zdCBzaXplID0gZXh0cmFjdEJvYXJkU2l6ZShjdXJyZW50Tm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGxldCBtYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICBjb25zdCB2aXNpYmxlQXJlYU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IG1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IG51bU1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG5cbiAgcGF0aC5mb3JFYWNoKChub2RlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHttb3ZlUHJvcHMsIHNldHVwUHJvcHMsIHJvb3RQcm9wc30gPSBub2RlLm1vZGVsO1xuICAgIGlmIChzZXR1cFByb3BzLmxlbmd0aCA+IDApIHNldHVwQ291bnQgKz0gMTtcblxuICAgIG1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgIGxpID0gaTtcbiAgICAgICAgbGogPSBqO1xuICAgICAgICBtYXQgPSBtb3ZlKG1hdCwgaSwgaiwgbS50b2tlbiA9PT0gJ0InID8gS2kuQmxhY2sgOiBLaS5XaGl0ZSk7XG5cbiAgICAgICAgaWYgKGxpICE9PSB1bmRlZmluZWQgJiYgbGogIT09IHVuZGVmaW5lZCAmJiBsaSA+PSAwICYmIGxqID49IDApIHtcbiAgICAgICAgICBudW1NYXJrdXBbbGldW2xqXSA9IChcbiAgICAgICAgICAgIG5vZGUubW9kZWwubnVtYmVyIHx8IGluZGV4IC0gc2V0dXBDb3VudFxuICAgICAgICAgICkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCA9PT0gcGF0aC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgbWFya3VwW2xpXVtsal0gPSBNYXJrdXAuQ3VycmVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2V0dXAgcHJvcHMgc2hvdWxkIG92ZXJyaWRlIG1vdmUgcHJvcHNcbiAgICBzZXR1cFByb3BzLmZvckVhY2goKHNldHVwOiBhbnkpID0+IHtcbiAgICAgIHNldHVwLnZhbHVlcy5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgbGkgPSBpO1xuICAgICAgICAgIGxqID0gajtcbiAgICAgICAgICBtYXRbaV1bal0gPSBzZXR1cC50b2tlbiA9PT0gJ0FCJyA/IDEgOiAtMTtcbiAgICAgICAgICBpZiAoc2V0dXAudG9rZW4gPT09ICdBRScpIG1hdFtpXVtqXSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gSWYgdGhlIHJvb3Qgbm9kZSBkb2VzIG5vdCBpbmNsdWRlIGFueSBzZXR1cCBwcm9wZXJ0aWVzXG4gICAgLy8gY2hlY2sgd2hldGhlciBpdHMgZmlyc3QgY2hpbGQgaXMgYSBzZXR1cCBub2RlIChpLmUuLCBhIG5vbi1tb3ZlIG5vZGUpXG4gICAgLy8gYW5kIGFwcGx5IGl0cyBzZXR1cCBwcm9wZXJ0aWVzIGluc3RlYWRcbiAgICBpZiAoc2V0dXBQcm9wcy5sZW5ndGggPT09IDAgJiYgY3VycmVudE5vZGUuaXNSb290KCkpIHtcbiAgICAgIGNvbnN0IGZpcnN0Q2hpbGROb2RlID0gY3VycmVudE5vZGUuY2hpbGRyZW5bMF07XG4gICAgICBpZiAoXG4gICAgICAgIGZpcnN0Q2hpbGROb2RlICYmXG4gICAgICAgIGlzU2V0dXBOb2RlKGZpcnN0Q2hpbGROb2RlKSAmJlxuICAgICAgICAhaXNNb3ZlTm9kZShmaXJzdENoaWxkTm9kZSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBzZXR1cFByb3BzID0gZmlyc3RDaGlsZE5vZGUubW9kZWwuc2V0dXBQcm9wcztcbiAgICAgICAgc2V0dXBQcm9wcy5mb3JFYWNoKChzZXR1cDogYW55KSA9PiB7XG4gICAgICAgICAgc2V0dXAudmFsdWVzLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzBdKTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzFdKTtcbiAgICAgICAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgICAgIGxpID0gaTtcbiAgICAgICAgICAgICAgbGogPSBqO1xuICAgICAgICAgICAgICBtYXRbaV1bal0gPSBzZXR1cC50b2tlbiA9PT0gJ0FCJyA/IDEgOiAtMTtcbiAgICAgICAgICAgICAgaWYgKHNldHVwLnRva2VuID09PSAnQUUnKSBtYXRbaV1bal0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDbGVhciBudW1iZXIgd2hlbiBzdG9uZXMgYXJlIGNhcHR1cmVkXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGlmIChtYXRbaV1bal0gPT09IDApIG51bU1hcmt1cFtpXVtqXSA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gQ2FsY3VsYXRpbmcgdGhlIHZpc2libGUgYXJlYVxuICBpZiAocm9vdCkge1xuICAgIHJvb3QuYWxsKChub2RlOiBUTm9kZSkgPT4ge1xuICAgICAgY29uc3Qge21vdmVQcm9wcywgc2V0dXBQcm9wcywgcm9vdFByb3BzfSA9IG5vZGUubW9kZWw7XG4gICAgICBpZiAoc2V0dXBQcm9wcy5sZW5ndGggPiAwKSBzZXR1cENvdW50ICs9IDE7XG4gICAgICBzZXR1cFByb3BzLmZvckVhY2goKHNldHVwOiBhbnkpID0+IHtcbiAgICAgICAgc2V0dXAudmFsdWVzLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVswXSk7XG4gICAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMV0pO1xuICAgICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgICB2aXNpYmxlQXJlYU1hdFtpXVtqXSA9IEtpLkJsYWNrO1xuICAgICAgICAgICAgaWYgKHNldHVwLnRva2VuID09PSAnQUUnKSB2aXNpYmxlQXJlYU1hdFtpXVtqXSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBtb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgIHZpc2libGVBcmVhTWF0W2ldW2pdID0gS2kuQmxhY2s7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG1hcmt1cFByb3BzID0gY3VycmVudE5vZGUubW9kZWwubWFya3VwUHJvcHM7XG4gIG1hcmt1cFByb3BzLmZvckVhY2goKG06IE1hcmt1cFByb3ApID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IG0udG9rZW47XG4gICAgY29uc3QgdmFsdWVzID0gbS52YWx1ZXM7XG4gICAgdmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMF0pO1xuICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMV0pO1xuICAgICAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm47XG4gICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgbGV0IG1hcms7XG4gICAgICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgICBjYXNlICdDUic6XG4gICAgICAgICAgICBtYXJrID0gTWFya3VwLkNpcmNsZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1NRJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuU3F1YXJlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnVFInOlxuICAgICAgICAgICAgbWFyayA9IE1hcmt1cC5UcmlhbmdsZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ01BJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuQ3Jvc3M7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBtYXJrID0gdmFsdWUuc3BsaXQoJzonKVsxXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWFya3VwW2ldW2pdID0gbWFyaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gaWYgKFxuICAvLyAgIGxpICE9PSB1bmRlZmluZWQgJiZcbiAgLy8gICBsaiAhPT0gdW5kZWZpbmVkICYmXG4gIC8vICAgbGkgPj0gMCAmJlxuICAvLyAgIGxqID49IDAgJiZcbiAgLy8gICAhbWFya3VwW2xpXVtsal1cbiAgLy8gKSB7XG4gIC8vICAgbWFya3VwW2xpXVtsal0gPSBNYXJrdXAuQ3VycmVudDtcbiAgLy8gfVxuXG4gIHJldHVybiB7bWF0LCB2aXNpYmxlQXJlYU1hdCwgbWFya3VwLCBudW1NYXJrdXB9O1xufTtcblxuLyoqXG4gKiBGaW5kcyBhIHByb3BlcnR5IGluIHRoZSBnaXZlbiBub2RlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAqIEBwYXJhbSBub2RlIFRoZSBub2RlIHRvIHNlYXJjaCBmb3IgdGhlIHByb3BlcnR5LlxuICogQHBhcmFtIHRva2VuIFRoZSB0b2tlbiBvZiB0aGUgcHJvcGVydHkgdG8gZmluZC5cbiAqIEByZXR1cm5zIFRoZSBmb3VuZCBwcm9wZXJ0eSBvciBudWxsIGlmIG5vdCBmb3VuZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGZpbmRQcm9wID0gKG5vZGU6IFROb2RlLCB0b2tlbjogc3RyaW5nKSA9PiB7XG4gIGlmICghbm9kZSkgcmV0dXJuO1xuICBpZiAoTU9WRV9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubW92ZVByb3BzLmZpbmQoKHA6IE1vdmVQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcy5maW5kKFxuICAgICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVBbm5vdGF0aW9uUHJvcHMuZmluZChcbiAgICAgIChwOiBNb3ZlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICBpZiAoUk9PVF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwucm9vdFByb3BzLmZpbmQoKHA6IFJvb3RQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKFNFVFVQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5zZXR1cFByb3BzLmZpbmQoKHA6IFNldHVwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1hcmt1cFByb3BzLmZpbmQoKHA6IE1hcmt1cFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoR0FNRV9JTkZPX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5nYW1lSW5mb1Byb3BzLmZpbmQoXG4gICAgICAocDogR2FtZUluZm9Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIEZpbmRzIHByb3BlcnRpZXMgaW4gYSBnaXZlbiBub2RlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAqIEBwYXJhbSBub2RlIC0gVGhlIG5vZGUgdG8gc2VhcmNoIGZvciBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHRva2VuIC0gVGhlIHRva2VuIHRvIG1hdGNoIGFnYWluc3QgdGhlIHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBwcm9wZXJ0aWVzIHRoYXQgbWF0Y2ggdGhlIHByb3ZpZGVkIHRva2VuLlxuICovXG5leHBvcnQgY29uc3QgZmluZFByb3BzID0gKG5vZGU6IFROb2RlLCB0b2tlbjogc3RyaW5nKSA9PiB7XG4gIGlmIChNT1ZFX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tb3ZlUHJvcHMuZmlsdGVyKChwOiBNb3ZlUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHMuZmlsdGVyKFxuICAgICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVBbm5vdGF0aW9uUHJvcHMuZmlsdGVyKFxuICAgICAgKHA6IE1vdmVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChST09UX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5yb290UHJvcHMuZmlsdGVyKChwOiBSb290UHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChTRVRVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwuc2V0dXBQcm9wcy5maWx0ZXIoKHA6IFNldHVwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1hcmt1cFByb3BzLmZpbHRlcigocDogTWFya3VwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChHQU1FX0lORk9fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLmdhbWVJbmZvUHJvcHMuZmlsdGVyKFxuICAgICAgKHA6IEdhbWVJbmZvUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZW5Nb3ZlID0gKFxuICBub2RlOiBUTm9kZSxcbiAgb25SaWdodDogKHBhdGg6IHN0cmluZykgPT4gdm9pZCxcbiAgb25Xcm9uZzogKHBhdGg6IHN0cmluZykgPT4gdm9pZCxcbiAgb25WYXJpYW50OiAocGF0aDogc3RyaW5nKSA9PiB2b2lkLFxuICBvbk9mZlBhdGg6IChwYXRoOiBzdHJpbmcpID0+IHZvaWRcbik6IFROb2RlIHwgdW5kZWZpbmVkID0+IHtcbiAgbGV0IG5leHROb2RlO1xuICBjb25zdCBnZXRQYXRoID0gKG5vZGU6IFROb2RlKSA9PiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IGNvbXBhY3QoXG4gICAgICBub2RlLmdldFBhdGgoKS5tYXAobiA9PiBuLm1vZGVsLm1vdmVQcm9wc1swXT8udG9TdHJpbmcoKSlcbiAgICApLmpvaW4oJzsnKTtcbiAgICByZXR1cm4gbmV3UGF0aDtcbiAgfTtcblxuICBjb25zdCBjaGVja1Jlc3VsdCA9IChub2RlOiBUTm9kZSkgPT4ge1xuICAgIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHJldHVybjtcblxuICAgIGNvbnN0IHBhdGggPSBnZXRQYXRoKG5vZGUpO1xuICAgIGlmIChpc1JpZ2h0Tm9kZShub2RlKSkge1xuICAgICAgaWYgKG9uUmlnaHQpIG9uUmlnaHQocGF0aCk7XG4gICAgfSBlbHNlIGlmIChpc1ZhcmlhbnROb2RlKG5vZGUpKSB7XG4gICAgICBpZiAob25WYXJpYW50KSBvblZhcmlhbnQocGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvbldyb25nKSBvbldyb25nKHBhdGgpO1xuICAgIH1cbiAgfTtcblxuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgY29uc3QgcmlnaHROb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUTm9kZSkgPT4gaW5SaWdodFBhdGgobikpO1xuICAgIGNvbnN0IHdyb25nTm9kZXMgPSBub2RlLmNoaWxkcmVuLmZpbHRlcigobjogVE5vZGUpID0+IGluV3JvbmdQYXRoKG4pKTtcbiAgICBjb25zdCB2YXJpYW50Tm9kZXMgPSBub2RlLmNoaWxkcmVuLmZpbHRlcigobjogVE5vZGUpID0+IGluVmFyaWFudFBhdGgobikpO1xuXG4gICAgbmV4dE5vZGUgPSBub2RlO1xuXG4gICAgaWYgKGluUmlnaHRQYXRoKG5vZGUpICYmIHJpZ2h0Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgbmV4dE5vZGUgPSBzYW1wbGUocmlnaHROb2Rlcyk7XG4gICAgfSBlbHNlIGlmIChpbldyb25nUGF0aChub2RlKSAmJiB3cm9uZ05vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5leHROb2RlID0gc2FtcGxlKHdyb25nTm9kZXMpO1xuICAgIH0gZWxzZSBpZiAoaW5WYXJpYW50UGF0aChub2RlKSAmJiB2YXJpYW50Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgbmV4dE5vZGUgPSBzYW1wbGUodmFyaWFudE5vZGVzKTtcbiAgICB9IGVsc2UgaWYgKGlzUmlnaHROb2RlKG5vZGUpKSB7XG4gICAgICBvblJpZ2h0KGdldFBhdGgobmV4dE5vZGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb25Xcm9uZyhnZXRQYXRoKG5leHROb2RlKSk7XG4gICAgfVxuICAgIGlmIChuZXh0Tm9kZSkgY2hlY2tSZXN1bHQobmV4dE5vZGUpO1xuICB9IGVsc2Uge1xuICAgIGNoZWNrUmVzdWx0KG5vZGUpO1xuICB9XG4gIHJldHVybiBuZXh0Tm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0Qm9hcmRTaXplID0gKG5vZGU6IFROb2RlLCBkZWZhdWx0Qm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3Qgcm9vdCA9IG5vZGUuZ2V0UGF0aCgpWzBdO1xuICBjb25zdCBzaXplID0gTWF0aC5taW4oXG4gICAgcGFyc2VJbnQoU3RyaW5nKGZpbmRQcm9wKHJvb3QsICdTWicpPy52YWx1ZSB8fCBkZWZhdWx0Qm9hcmRTaXplKSksXG4gICAgTUFYX0JPQVJEX1NJWkVcbiAgKTtcbiAgcmV0dXJuIHNpemU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Rmlyc3RUb01vdmVDb2xvckZyb21Sb290ID0gKFxuICByb290OiBUTm9kZSB8IHVuZGVmaW5lZCB8IG51bGwsXG4gIGRlZmF1bHRNb3ZlQ29sb3I6IEtpID0gS2kuQmxhY2tcbikgPT4ge1xuICBpZiAocm9vdCkge1xuICAgIGNvbnN0IHNldHVwTm9kZSA9IHJvb3QuZmlyc3QobiA9PiBpc1NldHVwTm9kZShuKSk7XG4gICAgaWYgKHNldHVwTm9kZSkge1xuICAgICAgY29uc3QgZmlyc3RNb3ZlTm9kZSA9IHNldHVwTm9kZS5maXJzdChuID0+IGlzTW92ZU5vZGUobikpO1xuICAgICAgaWYgKCFmaXJzdE1vdmVOb2RlKSByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbiAgICAgIHJldHVybiBnZXRNb3ZlQ29sb3IoZmlyc3RNb3ZlTm9kZSk7XG4gICAgfVxuICB9XG4gIC8vIGNvbnNvbGUud2FybignRGVmYXVsdCBmaXJzdCB0byBtb3ZlIGNvbG9yJywgZGVmYXVsdE1vdmVDb2xvcik7XG4gIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpcnN0VG9Nb3ZlQ29sb3JGcm9tU2dmID0gKFxuICBzZ2Y6IHN0cmluZyxcbiAgZGVmYXVsdE1vdmVDb2xvcjogS2kgPSBLaS5CbGFja1xuKSA9PiB7XG4gIGNvbnN0IHNnZlBhcnNlciA9IG5ldyBTZ2Yoc2dmKTtcbiAgaWYgKHNnZlBhcnNlci5yb290KVxuICAgIGdldEZpcnN0VG9Nb3ZlQ29sb3JGcm9tUm9vdChzZ2ZQYXJzZXIucm9vdCwgZGVmYXVsdE1vdmVDb2xvcik7XG4gIC8vIGNvbnNvbGUud2FybignRGVmYXVsdCBmaXJzdCB0byBtb3ZlIGNvbG9yJywgZGVmYXVsdE1vdmVDb2xvcik7XG4gIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE1vdmVDb2xvciA9IChub2RlOiBUTm9kZSwgZGVmYXVsdE1vdmVDb2xvcjogS2kgPSBLaS5CbGFjaykgPT4ge1xuICBjb25zdCBtb3ZlUHJvcCA9IG5vZGUubW9kZWw/Lm1vdmVQcm9wcz8uWzBdO1xuICBzd2l0Y2ggKG1vdmVQcm9wPy50b2tlbikge1xuICAgIGNhc2UgJ1cnOlxuICAgICAgcmV0dXJuIEtpLldoaXRlO1xuICAgIGNhc2UgJ0InOlxuICAgICAgcmV0dXJuIEtpLkJsYWNrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ0RlZmF1bHQgbW92ZSBjb2xvciBpcycsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICAgICAgcmV0dXJuIGRlZmF1bHRNb3ZlQ29sb3I7XG4gIH1cbn07XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9uZSB7XG4gIHByb3RlY3RlZCBnbG9iYWxBbHBoYSA9IDE7XG4gIHByb3RlY3RlZCBzaXplID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcHJvdGVjdGVkIHg6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgeTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge31cbiAgZHJhdygpIHtcbiAgICAvLyBCYXNlIGRyYXcgbWV0aG9kIC0gdG8gYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3Nlc1xuICB9XG5cbiAgc2V0R2xvYmFsQWxwaGEoYWxwaGE6IG51bWJlcikge1xuICAgIHRoaXMuZ2xvYmFsQWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIHNldFNpemUoc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgfVxufVxuIiwiaW1wb3J0IFN0b25lIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge0tpLCBUaGVtZUNvbmZpZywgVGhlbWVDb250ZXh0fSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge0JBU0VfVEhFTUVfQ09ORklHfSBmcm9tICcuLi9jb25zdCc7XG5cbmV4cG9ydCBjbGFzcyBGbGF0U3RvbmUgZXh0ZW5kcyBTdG9uZSB7XG4gIHByb3RlY3RlZCB0aGVtZUNvbnRleHQ/OiBUaGVtZUNvbnRleHQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBraTogbnVtYmVyLFxuICAgIHRoZW1lQ29udGV4dD86IFRoZW1lQ29udGV4dFxuICApIHtcbiAgICBzdXBlcihjdHgsIHgsIHksIGtpKTtcbiAgICB0aGlzLnRoZW1lQ29udGV4dCA9IHRoZW1lQ29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSB0aGVtZSBwcm9wZXJ0eSB2YWx1ZSB3aXRoIGZhbGxiYWNrXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VGhlbWVQcm9wZXJ0eTxLIGV4dGVuZHMga2V5b2YgVGhlbWVDb25maWc+KFxuICAgIGtleTogS1xuICApOiBUaGVtZUNvbmZpZ1tLXSB7XG4gICAgaWYgKCF0aGlzLnRoZW1lQ29udGV4dCkge1xuICAgICAgcmV0dXJuIEJBU0VfVEhFTUVfQ09ORklHW2tleV07XG4gICAgfVxuXG4gICAgY29uc3Qge3RoZW1lLCB0aGVtZU9wdGlvbnN9ID0gdGhpcy50aGVtZUNvbnRleHQ7XG4gICAgY29uc3QgdGhlbWVTcGVjaWZpYyA9IHRoZW1lT3B0aW9uc1t0aGVtZV07XG4gICAgY29uc3QgZGVmYXVsdENvbmZpZyA9IHRoZW1lT3B0aW9ucy5kZWZhdWx0O1xuXG4gICAgLy8gVHJ5IHRoZW1lLXNwZWNpZmljIHZhbHVlIGZpcnN0LCB0aGVuIGRlZmF1bHRcbiAgICBjb25zdCByZXN1bHQgPSAodGhlbWVTcGVjaWZpYz8uW2tleV0gPz9cbiAgICAgIGRlZmF1bHRDb25maWdba2V5XSkgYXMgVGhlbWVDb25maWdbS107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgc2l6ZSwga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgaWYgKHNpemUgPD0gMCkgcmV0dXJuO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICBjdHgubGluZVdpZHRoID0gMTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2JvYXJkTGluZUNvbG9yJyk7XG4gICAgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IFN0b25lIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge0tpLCBUaGVtZUNvbnRleHR9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7RmxhdFN0b25lfSBmcm9tICcuL0ZsYXRTdG9uZSc7XG5cbmV4cG9ydCBjbGFzcyBJbWFnZVN0b25lIGV4dGVuZHMgU3RvbmUge1xuICBwcml2YXRlIGZhbGxiYWNrU3RvbmU/OiBGbGF0U3RvbmU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBraTogbnVtYmVyLFxuICAgIHByaXZhdGUgbW9kOiBudW1iZXIsXG4gICAgcHJpdmF0ZSBibGFja3M6IGFueSxcbiAgICBwcml2YXRlIHdoaXRlczogYW55LFxuICAgIHByaXZhdGUgdGhlbWVDb250ZXh0PzogVGhlbWVDb250ZXh0XG4gICkge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwga2kpO1xuXG4gICAgLy8gQ3JlYXRlIEZsYXRTdG9uZSBhcyBmYWxsYmFjayBvcHRpb25cbiAgICBpZiAodGhlbWVDb250ZXh0KSB7XG4gICAgICB0aGlzLmZhbGxiYWNrU3RvbmUgPSBuZXcgRmxhdFN0b25lKGN0eCwgeCwgeSwga2ksIHRoZW1lQ29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBraSwgYmxhY2tzLCB3aGl0ZXMsIG1vZH0gPSB0aGlzO1xuICAgIGlmIChzaXplIDw9IDApIHJldHVybjtcblxuICAgIGxldCBpbWc7XG4gICAgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgaW1nID0gYmxhY2tzW21vZCAlIGJsYWNrcy5sZW5ndGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbWcgPSB3aGl0ZXNbbW9kICUgd2hpdGVzLmxlbmd0aF07XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgaW1hZ2UgaXMgbG9hZGVkIGNvbXBsZXRlbHlcbiAgICBpZiAoaW1nICYmIGltZy5jb21wbGV0ZSAmJiBpbWcubmF0dXJhbEhlaWdodCAhPT0gMCkge1xuICAgICAgLy8gSW1hZ2UgbG9hZGVkLCByZW5kZXIgd2l0aCBpbWFnZVxuICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW1hZ2Ugbm90IGxvYWRlZCBvciBsb2FkIGZhaWxlZCwgdXNlIEZsYXRTdG9uZSBhcyBmYWxsYmFja1xuICAgICAgaWYgKHRoaXMuZmFsbGJhY2tTdG9uZSkge1xuICAgICAgICB0aGlzLmZhbGxiYWNrU3RvbmUuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgdGhpcy5mYWxsYmFja1N0b25lLmRyYXcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRTaXplKHNpemU6IG51bWJlcikge1xuICAgIHN1cGVyLnNldFNpemUoc2l6ZSk7XG4gICAgLy8gU3luY2hyb25vdXNseSB1cGRhdGUgZmFsbGJhY2tTdG9uZSBzaXplXG4gICAgaWYgKHRoaXMuZmFsbGJhY2tTdG9uZSkge1xuICAgICAgdGhpcy5mYWxsYmFja1N0b25lLnNldFNpemUoc2l6ZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0FuYWx5c2lzUG9pbnRUaGVtZSwgTW92ZUluZm8sIFJvb3RJbmZvfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICBjYWxjQW5hbHlzaXNQb2ludENvbG9yLFxuICBjYWxjU2NvcmVEaWZmLFxuICBjYWxjU2NvcmVEaWZmVGV4dCxcbiAgbkZvcm1hdHRlcixcbiAgcm91bmQzLFxufSBmcm9tICcuLi9oZWxwZXInO1xuaW1wb3J0IHtcbiAgTElHSFRfR1JFRU5fUkdCLFxuICBMSUdIVF9SRURfUkdCLFxuICBMSUdIVF9ZRUxMT1dfUkdCLFxuICBZRUxMT1dfUkdCLFxufSBmcm9tICcuLi9jb25zdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuYWx5c2lzUG9pbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByaXZhdGUgeDogbnVtYmVyLFxuICAgIHByaXZhdGUgeTogbnVtYmVyLFxuICAgIHByaXZhdGUgcjogbnVtYmVyLFxuICAgIHByaXZhdGUgcm9vdEluZm86IFJvb3RJbmZvLFxuICAgIHByaXZhdGUgbW92ZUluZm86IE1vdmVJbmZvLFxuICAgIHByaXZhdGUgdGhlbWU6IEFuYWx5c2lzUG9pbnRUaGVtZSA9IEFuYWx5c2lzUG9pbnRUaGVtZS5EZWZhdWx0LFxuICAgIHByaXZhdGUgb3V0bGluZUNvbG9yPzogc3RyaW5nXG4gICkge31cblxuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHIsIHJvb3RJbmZvLCBtb3ZlSW5mbywgdGhlbWV9ID0gdGhpcztcbiAgICBpZiAociA8IDApIHJldHVybjtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICBjdHguc2hhZG93Q29sb3IgPSAnI2ZmZic7XG4gICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xuXG4gICAgLy8gdGhpcy5kcmF3RGVmYXVsdEFuYWx5c2lzUG9pbnQoKTtcbiAgICBpZiAodGhlbWUgPT09IEFuYWx5c2lzUG9pbnRUaGVtZS5EZWZhdWx0KSB7XG4gICAgICB0aGlzLmRyYXdEZWZhdWx0QW5hbHlzaXNQb2ludCgpO1xuICAgIH0gZWxzZSBpZiAodGhlbWUgPT09IEFuYWx5c2lzUG9pbnRUaGVtZS5Qcm9ibGVtKSB7XG4gICAgICB0aGlzLmRyYXdQcm9ibGVtQW5hbHlzaXNQb2ludCgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdQcm9ibGVtQW5hbHlzaXNQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm8sIG91dGxpbmVDb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHtvcmRlcn0gPSBtb3ZlSW5mbztcblxuICAgIGxldCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG5cbiAgICBpZiAob3JkZXIgPCA1KSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuOSwgeCwgeSwgcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjksICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBpZiAob3V0bGluZUNvbG9yKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSA0O1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBvdXRsaW5lQ29sb3I7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm9udFNpemUgPSByIC8gMS41O1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplICogMC44fXB4IFRhaG9tYWA7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZX1weCBUYWhvbWFgO1xuICAgICAgY29uc3Qgc2NvcmVUZXh0ID0gY2FsY1Njb3JlRGlmZlRleHQocm9vdEluZm8sIG1vdmVJbmZvKTtcbiAgICAgIGN0eC5maWxsVGV4dChzY29yZVRleHQsIHgsIHkpO1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplICogMC44fXB4IFRhaG9tYWA7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgIGN0eC5maWxsVGV4dChuRm9ybWF0dGVyKG1vdmVJbmZvLnZpc2l0cyksIHgsIHkgKyByIC8gMiArIGZvbnRTaXplIC8gOCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhd0NhbmRpZGF0ZVBvaW50KCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgZHJhd0RlZmF1bHRBbmFseXNpc1BvaW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHIsIHJvb3RJbmZvLCBtb3ZlSW5mb30gPSB0aGlzO1xuICAgIGNvbnN0IHtvcmRlcn0gPSBtb3ZlSW5mbztcblxuICAgIGxldCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG5cbiAgICBpZiAob3JkZXIgPCA1KSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuOSwgeCwgeSwgcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjksICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGN0eC5maWxsKCk7XG5cbiAgICAgIGNvbnN0IGZvbnRTaXplID0gciAvIDEuNTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgIGNvbnN0IHdpbnJhdGUgPVxuICAgICAgICByb290SW5mby5jdXJyZW50UGxheWVyID09PSAnQidcbiAgICAgICAgICA/IG1vdmVJbmZvLndpbnJhdGVcbiAgICAgICAgICA6IDEgLSBtb3ZlSW5mby53aW5yYXRlO1xuXG4gICAgICBjdHguZmlsbFRleHQocm91bmQzKHdpbnJhdGUsIDEwMCwgMSksIHgsIHkgLSByIC8gMiArIGZvbnRTaXplIC8gNSk7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggVGFob21hYDtcbiAgICAgIGNvbnN0IHNjb3JlVGV4dCA9IGNhbGNTY29yZURpZmZUZXh0KHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgICBjdHguZmlsbFRleHQoc2NvcmVUZXh0LCB4LCB5ICsgZm9udFNpemUgLyAzKTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHguZmlsbFRleHQobkZvcm1hdHRlcihtb3ZlSW5mby52aXNpdHMpLCB4LCB5ICsgciAvIDIgKyBmb250U2l6ZSAvIDMpO1xuXG4gICAgICBjb25zdCBvcmRlciA9IG1vdmVJbmZvLm9yZGVyO1xuICAgICAgY3R4LmZpbGxUZXh0KChvcmRlciArIDEpLnRvU3RyaW5nKCksIHggKyByLCB5IC0gciAvIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXdDYW5kaWRhdGVQb2ludCgpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGRyYXdDYW5kaWRhdGVQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm99ID0gdGhpcztcbiAgICBjb25zdCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoeCwgeSwgciAqIDAuNiwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICBjb25zdCBncmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCByICogMC40LCB4LCB5LCByKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45NSwgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCcpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7VGhlbWUsIFRoZW1lUHJvcGVydHlLZXksIFRoZW1lQ29udGV4dCwgVGhlbWVDb25maWd9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7QkFTRV9USEVNRV9DT05GSUd9IGZyb20gJy4uL2NvbnN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya3VwIHtcbiAgcHJvdGVjdGVkIGdsb2JhbEFscGhhID0gMTtcbiAgcHJvdGVjdGVkIGNvbG9yID0gJyc7XG4gIHByb3RlY3RlZCBsaW5lRGFzaDogbnVtYmVyW10gPSBbXTtcbiAgcHJvdGVjdGVkIHRoZW1lQ29udGV4dD86IFRoZW1lQ29udGV4dDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcHJvdGVjdGVkIHg6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgeTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBzOiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIGtpOiBudW1iZXIsXG4gICAgdGhlbWVDb250ZXh0PzogVGhlbWVDb250ZXh0LFxuICAgIHByb3RlY3RlZCB2YWw6IHN0cmluZyB8IG51bWJlciA9ICcnXG4gICkge1xuICAgIHRoaXMudGhlbWVDb250ZXh0ID0gdGhlbWVDb250ZXh0O1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICAvLyBCYXNlIGRyYXcgbWV0aG9kIC0gdG8gYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3Nlc1xuICB9XG5cbiAgc2V0R2xvYmFsQWxwaGEoYWxwaGE6IG51bWJlcikge1xuICAgIHRoaXMuZ2xvYmFsQWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gIH1cblxuICBzZXRMaW5lRGFzaChsaW5lRGFzaDogbnVtYmVyW10pIHtcbiAgICB0aGlzLmxpbmVEYXNoID0gbGluZURhc2g7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgdGhlbWUgcHJvcGVydHkgdmFsdWUgd2l0aCBmYWxsYmFja1xuICAgKi9cbiAgcHJvdGVjdGVkIGdldFRoZW1lUHJvcGVydHk8SyBleHRlbmRzIGtleW9mIFRoZW1lQ29uZmlnPihcbiAgICBrZXk6IEtcbiAgKTogVGhlbWVDb25maWdbS10ge1xuICAgIGlmICghdGhpcy50aGVtZUNvbnRleHQpIHtcbiAgICAgIHJldHVybiBCQVNFX1RIRU1FX0NPTkZJR1trZXldO1xuICAgIH1cblxuICAgIGNvbnN0IHt0aGVtZSwgdGhlbWVPcHRpb25zfSA9IHRoaXMudGhlbWVDb250ZXh0O1xuICAgIGNvbnN0IHRoZW1lU3BlY2lmaWMgPSB0aGVtZU9wdGlvbnNbdGhlbWVdO1xuICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSB0aGVtZU9wdGlvbnMuZGVmYXVsdDtcblxuICAgIC8vIFRyeSB0aGVtZS1zcGVjaWZpYyB2YWx1ZSBmaXJzdCwgdGhlbiBkZWZhdWx0XG4gICAgY29uc3QgcmVzdWx0ID0gKHRoZW1lU3BlY2lmaWM/LltrZXldID8/XG4gICAgICBkZWZhdWx0Q29uZmlnW2tleV0pIGFzIFRoZW1lQ29uZmlnW0tdO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIENpcmNsZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhLCBjb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjY1O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ21hcmt1cExpbmVXaWR0aCcpO1xuICAgIGN0eC5zZXRMaW5lRGFzaCh0aGlzLmxpbmVEYXNoKTtcbiAgICBpZiAoa2kgPT09IEtpLldoaXRlKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRCbGFja0NvbG9yJyk7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdib2FyZExpbmVDb2xvcicpO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgfVxuICAgIGlmIChjb2xvcikgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuaW1wb3J0IHtLaX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgQ3Jvc3NNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIHNpemUgPSByYWRpdXMgKiAwLjU4O1xuICAgIH1cbiAgICBjdHgubW92ZVRvKHggLSBzaXplLCB5IC0gc2l6ZSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgc2l6ZSwgeSArIHNpemUpO1xuICAgIGN0eC5tb3ZlVG8oeCArIHNpemUsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggLSBzaXplLCB5ICsgc2l6ZSk7XG5cbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFRleHRNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCB2YWwsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3Qgc2l6ZSA9IHMgKiAwLjg7XG4gICAgbGV0IGZvbnRTaXplID0gc2l6ZSAvIDEuNTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuXG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICB9XG4gICAgLy8gZWxzZSB7XG4gICAgLy8gICBjdHguY2xlYXJSZWN0KHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICAvLyB9XG4gICAgaWYgKHZhbC50b1N0cmluZygpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZm9udFNpemUgPSBzaXplIC8gMS41O1xuICAgIH0gZWxzZSBpZiAodmFsLnRvU3RyaW5nKCkubGVuZ3RoID09PSAyKSB7XG4gICAgICBmb250U2l6ZSA9IHNpemUgLyAxLjg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvbnRTaXplID0gc2l6ZSAvIDIuMDtcbiAgICB9XG4gICAgY3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IFRhaG9tYWA7XG4gICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICBjdHguZmlsbFRleHQodmFsLnRvU3RyaW5nKCksIHgsIHkgKyAyKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5pbXBvcnQge0tpfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBTcXVhcmVNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ21hcmt1cExpbmVXaWR0aCcpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGxldCBzaXplID0gcyAqIDAuNTU7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBjdHgucmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcbmltcG9ydCB7S2l9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC43NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubW92ZVRvKHgsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggLSBzaXplICogTWF0aC5jb3MoMC41MjMpLCB5ICsgc2l6ZSAqIE1hdGguc2luKDAuNTIzKSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgc2l6ZSAqIE1hdGguY29zKDAuNTIzKSwgeSArIHNpemUgKiBNYXRoLnNpbigwLjUyMykpO1xuXG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnbWFya3VwTGluZVdpZHRoJyk7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdmbGF0QmxhY2tDb2xvcicpO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkJsYWNrKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2ZsYXRXaGl0ZUNvbG9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgICAgc2l6ZSA9IHJhZGl1cyAqIDAuNztcbiAgICB9XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBOb2RlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgY29sb3IsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNDtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gNDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgQWN0aXZlTm9kZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGNvbG9yLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5zZXRMaW5lRGFzaCh0aGlzLmxpbmVEYXNoKTtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplICogMC40LCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQge0tpfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBDaXJjbGVTb2xpZE1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhLCBjb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjI1O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC42NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdtYXJrdXBMaW5lV2lkdGgnKTtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKGtpID09PSBLaS5CbGFjaykge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdFdoaXRlQ29sb3InKTtcbiAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5XaGl0ZSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnZmxhdEJsYWNrQ29sb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBpZiAoY29sb3IpIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuaW1wb3J0IHtLaX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0TWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdtYXJrdXBMaW5lV2lkdGgnKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjY7XG4gICAgbGV0IHNpemUgPSBzICogMC40O1xuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ2hpZ2hsaWdodENvbG9yJyk7XG4gICAgaWYgKGtpID09PSBLaS5XaGl0ZSB8fCBraSA9PT0gS2kuQmxhY2spIHtcbiAgICAgIHNpemUgPSBzICogMC4zNTtcbiAgICB9XG4gICAgY3R4LmFyYyh4LCB5LCBzaXplLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBFZmZlY3RCYXNlIHtcbiAgcHJvdGVjdGVkIGdsb2JhbEFscGhhID0gMTtcbiAgcHJvdGVjdGVkIGNvbG9yID0gJyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgc2l6ZTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge31cblxuICBwbGF5KCkge1xuICAgIC8vIEJhc2UgcGxheSBtZXRob2QgLSB0byBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzc2VzXG4gIH1cbn1cbiIsImltcG9ydCBFZmZlY3RCYXNlIGZyb20gJy4vRWZmZWN0QmFzZSc7XG5pbXBvcnQge2VuY29kZX0gZnJvbSAnanMtYmFzZTY0JztcblxuY29uc3QgYmFuU3ZnID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBjbGFzcz1cImJpIGJpLWJhblwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj5cbiAgPHBhdGggZD1cIk0xNSA4YTYuOTcgNi45NyAwIDAgMC0xLjcxLTQuNTg0bC05Ljg3NCA5Ljg3NUE3IDcgMCAwIDAgMTUgOE0yLjcxIDEyLjU4NGw5Ljg3NC05Ljg3NWE3IDcgMCAwIDAtOS44NzQgOS44NzRaTTE2IDhBOCA4IDAgMSAxIDAgOGE4IDggMCAwIDEgMTYgMFwiLz5cbjwvc3ZnPmA7XG5cbmV4cG9ydCBjbGFzcyBCYW5FZmZlY3QgZXh0ZW5kcyBFZmZlY3RCYXNlIHtcbiAgcHJpdmF0ZSBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgcHJpdmF0ZSBhbHBoYSA9IDA7XG4gIHByaXZhdGUgZmFkZUluRHVyYXRpb24gPSAyMDA7XG4gIHByaXZhdGUgZmFkZU91dER1cmF0aW9uID0gMTUwO1xuICBwcml2YXRlIHN0YXlEdXJhdGlvbiA9IDQwMDtcbiAgcHJpdmF0ZSBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICBwcml2YXRlIGlzRmFkaW5nT3V0ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgc2l6ZTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwgc2l6ZSwga2kpO1xuXG4gICAgLy8gQ29udmVydCBTVkcgc3RyaW5nIHRvIGEgZGF0YSBVUkxcbiAgICBjb25zdCBzdmdCbG9iID0gbmV3IEJsb2IoW2JhblN2Z10sIHt0eXBlOiAnaW1hZ2Uvc3ZnK3htbCd9KTtcblxuICAgIGNvbnN0IHN2Z0RhdGFVcmwgPSBgZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwke2VuY29kZShiYW5TdmcpfWA7XG5cbiAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgIHRoaXMuaW1nLnNyYyA9IHN2Z0RhdGFVcmw7XG4gIH1cblxuICBwbGF5ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5pbWcuY29tcGxldGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBpbWcsIGZhZGVJbkR1cmF0aW9uLCBmYWRlT3V0RHVyYXRpb259ID0gdGhpcztcblxuICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgaWYgKCF0aGlzLnN0YXJ0VGltZSkge1xuICAgICAgdGhpcy5zdGFydFRpbWUgPSBub3c7XG4gICAgfVxuXG4gICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5hbHBoYTtcbiAgICBjdHguZHJhd0ltYWdlKGltZywgeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XG5cbiAgICBjb25zdCBlbGFwc2VkID0gbm93IC0gdGhpcy5zdGFydFRpbWU7XG5cbiAgICBpZiAoIXRoaXMuaXNGYWRpbmdPdXQpIHtcbiAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1pbihlbGFwc2VkIC8gZmFkZUluRHVyYXRpb24sIDEpO1xuICAgICAgaWYgKGVsYXBzZWQgPj0gZmFkZUluRHVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaXNGYWRpbmdPdXQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIH0sIHRoaXMuc3RheUR1cmF0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZmFkZUVsYXBzZWQgPSBub3cgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1heCgxIC0gZmFkZUVsYXBzZWQgLyBmYWRlT3V0RHVyYXRpb24sIDApO1xuICAgICAgaWYgKGZhZGVFbGFwc2VkID49IGZhZGVPdXREdXJhdGlvbikge1xuICAgICAgICB0aGlzLmFscGhhID0gMDtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wbGF5KTtcbiAgfTtcbn1cbiIsImltcG9ydCB7Y29tcGFjdH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGNhbGNWaXNpYmxlQXJlYSxcbiAgcmV2ZXJzZU9mZnNldCxcbiAgemVyb3MsXG4gIGVtcHR5LFxuICBhMVRvUG9zLFxuICBvZmZzZXRBMU1vdmUsXG4gIGNhbk1vdmUsXG59IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB7XG4gIEExX0xFVFRFUlMsXG4gIEExX05VTUJFUlMsXG4gIERFRkFVTFRfT1BUSU9OUyxcbiAgTUFYX0JPQVJEX1NJWkUsXG4gIFRIRU1FX1JFU09VUkNFUyxcbiAgQkFTRV9USEVNRV9DT05GSUcsXG59IGZyb20gJy4vY29uc3QnO1xuaW1wb3J0IHtcbiAgQ3Vyc29yLFxuICBNYXJrdXAsXG4gIFRoZW1lLFxuICBLaSxcbiAgQW5hbHlzaXMsXG4gIEdob3N0QmFuT3B0aW9ucyxcbiAgR2hvc3RCYW5PcHRpb25zUGFyYW1zLFxuICBDZW50ZXIsXG4gIEFuYWx5c2lzUG9pbnRUaGVtZSxcbiAgRWZmZWN0LFxuICBUaGVtZU9wdGlvbnMsXG4gIFRoZW1lQ29uZmlnLFxuICBUaGVtZVByb3BlcnR5S2V5LFxuICBUaGVtZUNvbnRleHQsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQge0ltYWdlU3RvbmUsIEZsYXRTdG9uZX0gZnJvbSAnLi9zdG9uZXMnO1xuaW1wb3J0IEFuYWx5c2lzUG9pbnQgZnJvbSAnLi9zdG9uZXMvQW5hbHlzaXNQb2ludCc7XG5cbmltcG9ydCB7XG4gIENpcmNsZU1hcmt1cCxcbiAgQ3Jvc3NNYXJrdXAsXG4gIFRleHRNYXJrdXAsXG4gIFNxdWFyZU1hcmt1cCxcbiAgVHJpYW5nbGVNYXJrdXAsXG4gIE5vZGVNYXJrdXAsXG4gIEFjdGl2ZU5vZGVNYXJrdXAsXG4gIENpcmNsZVNvbGlkTWFya3VwLFxuICBIaWdobGlnaHRNYXJrdXAsXG59IGZyb20gJy4vbWFya3Vwcyc7XG5pbXBvcnQge0JhbkVmZmVjdH0gZnJvbSAnLi9lZmZlY3RzJztcblxuY29uc3QgZ2V0VGhlbWVSZXNvdXJjZXMgPSAoXG4gIHRoZW1lOiBUaGVtZSxcbiAgdGhlbWVSZXNvdXJjZXM6IGFueSxcbiAgYm9hcmRTaXplOiBudW1iZXIgPSA1MTJcbikgPT4ge1xuICBjb25zdCByZXNvdXJjZXMgPSB0aGVtZVJlc291cmNlc1t0aGVtZV07XG4gIGlmICghcmVzb3VyY2VzKSByZXR1cm4gbnVsbDtcblxuICAvLyBJZiBib2FyZCBzaXplIDwgMjU2IGFuZCBtaWNyb1JlcyBleGlzdHMsIHVzZSBtaWNyb1JlcyByZXNvdXJjZXNcbiAgaWYgKGJvYXJkU2l6ZSA8IDI1NiAmJiByZXNvdXJjZXMubWljcm9SZXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYm9hcmQ6IHJlc291cmNlcy5taWNyb1Jlcy5ib2FyZCB8fCByZXNvdXJjZXMuYm9hcmQsXG4gICAgICBibGFja3M6XG4gICAgICAgIHJlc291cmNlcy5taWNyb1Jlcy5ibGFja3M/Lmxlbmd0aCA+IDBcbiAgICAgICAgICA/IHJlc291cmNlcy5taWNyb1Jlcy5ibGFja3NcbiAgICAgICAgICA6IHJlc291cmNlcy5ibGFja3MsXG4gICAgICB3aGl0ZXM6XG4gICAgICAgIHJlc291cmNlcy5taWNyb1Jlcy53aGl0ZXM/Lmxlbmd0aCA+IDBcbiAgICAgICAgICA/IHJlc291cmNlcy5taWNyb1Jlcy53aGl0ZXNcbiAgICAgICAgICA6IHJlc291cmNlcy53aGl0ZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8vIElmIGJvYXJkIHNpemUgPCA1MTIgYW5kIGxvd1JlcyBleGlzdHMsIHVzZSBsb3dSZXMgcmVzb3VyY2VzXG4gIGlmIChib2FyZFNpemUgPCA1MTIgJiYgcmVzb3VyY2VzLmxvd1Jlcykge1xuICAgIHJldHVybiB7XG4gICAgICBib2FyZDogcmVzb3VyY2VzLmxvd1Jlcy5ib2FyZCB8fCByZXNvdXJjZXMuYm9hcmQsXG4gICAgICBibGFja3M6XG4gICAgICAgIHJlc291cmNlcy5sb3dSZXMuYmxhY2tzPy5sZW5ndGggPiAwXG4gICAgICAgICAgPyByZXNvdXJjZXMubG93UmVzLmJsYWNrc1xuICAgICAgICAgIDogcmVzb3VyY2VzLmJsYWNrcyxcbiAgICAgIHdoaXRlczpcbiAgICAgICAgcmVzb3VyY2VzLmxvd1Jlcy53aGl0ZXM/Lmxlbmd0aCA+IDBcbiAgICAgICAgICA/IHJlc291cmNlcy5sb3dSZXMud2hpdGVzXG4gICAgICAgICAgOiByZXNvdXJjZXMud2hpdGVzLFxuICAgIH07XG4gIH1cblxuICAvLyBPdGhlcndpc2UgdXNlIHJlZ3VsYXIgcmVzb3VyY2VzXG4gIHJldHVybiB7XG4gICAgYm9hcmQ6IHJlc291cmNlcy5ib2FyZCxcbiAgICBibGFja3M6IHJlc291cmNlcy5ibGFja3MsXG4gICAgd2hpdGVzOiByZXNvdXJjZXMud2hpdGVzLFxuICB9O1xufTtcblxuLy8gR2V0IGFsbCB0aGVtZSByZXNvdXJjZXMgZm9yIHByZWxvYWRpbmcgKGFsbCByZXNvbHV0aW9ucylcbmNvbnN0IGdldEFsbFRoZW1lUmVzb3VyY2VzID0gKHRoZW1lOiBUaGVtZSwgdGhlbWVSZXNvdXJjZXM6IGFueSkgPT4ge1xuICBjb25zdCByZXNvdXJjZXMgPSB0aGVtZVJlc291cmNlc1t0aGVtZV07XG4gIGlmICghcmVzb3VyY2VzKSByZXR1cm4gW107XG5cbiAgY29uc3QgYWxsSW1hZ2VzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8vIEFkZCByZWd1bGFyIHJlc29sdXRpb24gcmVzb3VyY2VzXG4gIGlmIChyZXNvdXJjZXMuYm9hcmQpIGFsbEltYWdlcy5wdXNoKHJlc291cmNlcy5ib2FyZCk7XG4gIGlmIChyZXNvdXJjZXMuYmxhY2tzKSBhbGxJbWFnZXMucHVzaCguLi5yZXNvdXJjZXMuYmxhY2tzKTtcbiAgaWYgKHJlc291cmNlcy53aGl0ZXMpIGFsbEltYWdlcy5wdXNoKC4uLnJlc291cmNlcy53aGl0ZXMpO1xuXG4gIC8vIEFkZCBsb3dSZXMgcmVzb3VyY2VzIGlmIHRoZXkgZXhpc3RcbiAgaWYgKHJlc291cmNlcy5sb3dSZXMpIHtcbiAgICBpZiAocmVzb3VyY2VzLmxvd1Jlcy5ib2FyZCkgYWxsSW1hZ2VzLnB1c2gocmVzb3VyY2VzLmxvd1Jlcy5ib2FyZCk7XG4gICAgaWYgKHJlc291cmNlcy5sb3dSZXMuYmxhY2tzKSBhbGxJbWFnZXMucHVzaCguLi5yZXNvdXJjZXMubG93UmVzLmJsYWNrcyk7XG4gICAgaWYgKHJlc291cmNlcy5sb3dSZXMud2hpdGVzKSBhbGxJbWFnZXMucHVzaCguLi5yZXNvdXJjZXMubG93UmVzLndoaXRlcyk7XG4gIH1cblxuICAvLyBBZGQgbWljcm9SZXMgcmVzb3VyY2VzIGlmIHRoZXkgZXhpc3RcbiAgaWYgKHJlc291cmNlcy5taWNyb1Jlcykge1xuICAgIGlmIChyZXNvdXJjZXMubWljcm9SZXMuYm9hcmQpIGFsbEltYWdlcy5wdXNoKHJlc291cmNlcy5taWNyb1Jlcy5ib2FyZCk7XG4gICAgaWYgKHJlc291cmNlcy5taWNyb1Jlcy5ibGFja3MpIGFsbEltYWdlcy5wdXNoKC4uLnJlc291cmNlcy5taWNyb1Jlcy5ibGFja3MpO1xuICAgIGlmIChyZXNvdXJjZXMubWljcm9SZXMud2hpdGVzKSBhbGxJbWFnZXMucHVzaCguLi5yZXNvdXJjZXMubWljcm9SZXMud2hpdGVzKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBkdXBsaWNhdGVzXG4gIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoYWxsSW1hZ2VzKSk7XG59O1xuXG5jb25zdCBpbWFnZXM6IHtcbiAgW2tleTogc3RyaW5nXTogSFRNTEltYWdlRWxlbWVudDtcbn0gPSB7fTtcblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIHNldCBoaWdoLXF1YWxpdHkgaW1hZ2Ugc21vb3RoaW5nIGZvciBjYW52YXMgY29udGV4dFxuY29uc3Qgc2V0SW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gKFxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgfCB1bmRlZmluZWRcbikgPT4ge1xuICBpZiAoY3R4KSB7XG4gICAgY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XG4gICAgY3R4LmltYWdlU21vb3RoaW5nUXVhbGl0eSA9ICdoaWdoJztcbiAgfVxufTtcblxuZnVuY3Rpb24gaXNNb2JpbGVEZXZpY2UoKSB7XG4gIHJldHVybiAvTW9iaXxBbmRyb2lkfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChcbiAgICBuYXZpZ2F0b3IudXNlckFnZW50XG4gICk7XG59XG5cbmZ1bmN0aW9uIHByZWxvYWQoXG4gIHVybHM6IHN0cmluZ1tdLFxuICBkb25lOiAoKSA9PiB2b2lkLFxuICBvbkltYWdlTG9hZGVkPzogKHVybDogc3RyaW5nKSA9PiB2b2lkXG4pIHtcbiAgbGV0IGxvYWRlZCA9IDA7XG4gIGNvbnN0IGltYWdlTG9hZGVkID0gKCkgPT4ge1xuICAgIGxvYWRlZCsrO1xuICAgIGlmIChsb2FkZWQgPT09IHVybHMubGVuZ3RoKSB7XG4gICAgICBkb25lKCk7XG4gICAgfVxuICB9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHVybHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIWltYWdlc1t1cmxzW2ldXSkge1xuICAgICAgaW1hZ2VzW3VybHNbaV1dID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWFnZXNbdXJsc1tpXV0uc3JjID0gdXJsc1tpXTtcbiAgICAgIGltYWdlc1t1cmxzW2ldXS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGltYWdlTG9hZGVkKCk7XG4gICAgICAgIC8vIENhbGxiYWNrIHdoZW4gc2luZ2xlIGltYWdlIGxvYWQgY29tcGxldGVzXG4gICAgICAgIGlmIChvbkltYWdlTG9hZGVkKSB7XG4gICAgICAgICAgb25JbWFnZUxvYWRlZCh1cmxzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGltYWdlc1t1cmxzW2ldXS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZUxvYWRlZCgpO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGltYWdlc1t1cmxzW2ldXS5jb21wbGV0ZSkge1xuICAgICAgLy8gSW1hZ2UgYWxyZWFkeSBsb2FkZWRcbiAgICAgIGltYWdlTG9hZGVkKCk7XG4gICAgfVxuICB9XG59XG5cbmxldCBkcHIgPSAxLjA7XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMS4wO1xufVxuXG5jb25zdCBERUZBVUxUX1RIRU1FX09QVElPTlM6IFRoZW1lT3B0aW9ucyA9IHtcbiAgZGVmYXVsdDogQkFTRV9USEVNRV9DT05GSUcsXG4gIFtUaGVtZS5GbGF0XToge1xuICAgIGJvYXJkQmFja2dyb3VuZENvbG9yOiAnI2U2YmI4NScsXG4gIH0sXG4gIFtUaGVtZS5XYXJtXToge1xuICAgIGJvYXJkQmFja2dyb3VuZENvbG9yOiAnI0MxOEI1MCcsXG4gIH0sXG4gIFtUaGVtZS5EYXJrXToge1xuICAgIGFjdGl2ZUNvbG9yOiAnIzlDQTNBRicsXG4gICAgaW5hY3RpdmVDb2xvcjogJyM2NjY2NjYnLFxuICAgIGJvYXJkTGluZUNvbG9yOiAnIzlDQTNBRicsXG4gICAgYm9hcmRCYWNrZ3JvdW5kQ29sb3I6ICcjMkIzMDM1JyxcbiAgfSxcbiAgW1RoZW1lLll1bnppTW9ua2V5RGFya106IHtcbiAgICBhY3RpdmVDb2xvcjogJyNBMUM5QUYnLFxuICAgIGluYWN0aXZlQ29sb3I6ICcjQTFDOUFGJyxcbiAgICBib2FyZExpbmVDb2xvcjogJyNBMUM5QUYnLFxuICAgIGZsYXRCbGFja0NvbG9yOiAnIzBFMjAxOScsXG4gICAgZmxhdEJsYWNrQ29sb3JBbHQ6ICcjMDIxRDExJyxcbiAgICBmbGF0V2hpdGVDb2xvcjogJyNBMkM4QjQnLFxuICAgIGZsYXRXaGl0ZUNvbG9yQWx0OiAnI0FGQ0JCQycsXG4gICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuMSknLFxuICAgIHN0b25lUmF0aW86IDAuNTExNSxcbiAgfSxcbiAgW1RoZW1lLkhpZ2hDb250cmFzdF06IHtcbiAgICAvLyBIaWdoIGNvbnRyYXN0IHRoZW1lLCBmcmllbmRseSBmb3IgYWxsIHR5cGVzIG9mIGNvbG9yIGJsaW5kbmVzc1xuICAgIGJvYXJkQmFja2dyb3VuZENvbG9yOiAnI0Y1RjVEQycsIC8vIEJlaWdlIGJhY2tncm91bmQsIGdlbnRsZSBvbiBleWVzXG4gICAgYm9hcmRMaW5lQ29sb3I6ICcjMkY0RjRGJywgLy8gRGFyayBzbGF0ZSBncmF5IGxpbmVzIGZvciBoaWdoIGNvbnRyYXN0XG4gICAgYWN0aXZlQ29sb3I6ICcjMkY0RjRGJyxcbiAgICBpbmFjdGl2ZUNvbG9yOiAnIzgwODA4MCcsXG5cbiAgICAvLyBTdG9uZSBjb2xvcnM6IHRyYWRpdGlvbmFsIGJsYWNrIGFuZCB3aGl0ZSBmb3IgbWF4aW11bSBjb250cmFzdCBhbmQgY29sb3IgYmxpbmQgZnJpZW5kbGluZXNzXG4gICAgZmxhdEJsYWNrQ29sb3I6ICcjMDAwMDAwJywgLy8gUHVyZSBibGFjayAtIHVuaXZlcnNhbGx5IGFjY2Vzc2libGVcbiAgICBmbGF0QmxhY2tDb2xvckFsdDogJyMxQTFBMUEnLCAvLyBWZXJ5IGRhcmsgZ3JheSB2YXJpYW50XG4gICAgZmxhdFdoaXRlQ29sb3I6ICcjRkZGRkZGJywgLy8gUHVyZSB3aGl0ZSAtIG1heGltdW0gY29udHJhc3Qgd2l0aCBibGFja1xuICAgIGZsYXRXaGl0ZUNvbG9yQWx0OiAnI0Y4RjhGOCcsIC8vIFZlcnkgbGlnaHQgZ3JheSB2YXJpYW50XG5cbiAgICAvLyBOb2RlIGFuZCBtYXJrdXAgY29sb3JzIC0gdXNpbmcgY29sb3JibGluZC1mcmllbmRseSBjb2xvcnMgdGhhdCBhdm9pZCByZWQtZ3JlZW4gY29tYmluYXRpb25zXG4gICAgcG9zaXRpdmVOb2RlQ29sb3I6ICcjMDI4NEM3JywgLy8gQmx1ZSAocG9zaXRpdmUpIC0gc2FmZSBmb3IgYWxsIGNvbG9yIGJsaW5kbmVzcyB0eXBlc1xuICAgIG5lZ2F0aXZlTm9kZUNvbG9yOiAnI0VBNTgwQycsIC8vIE9yYW5nZSAobmVnYXRpdmUpIC0gZGlzdGluZ3Vpc2hhYmxlIGZyb20gYmx1ZSBmb3IgYWxsIHVzZXJzXG4gICAgbmV1dHJhbE5vZGVDb2xvcjogJyM3QzJEMTInLCAvLyBCcm93biAobmV1dHJhbCkgLSBhbHRlcm5hdGl2ZSB0byBwcm9ibGVtYXRpYyBjb2xvcnNcbiAgICBkZWZhdWx0Tm9kZUNvbG9yOiAnIzRCNTU2MycsIC8vIERhcmsgZ3JheVxuICAgIHdhcm5pbmdOb2RlQ29sb3I6ICcjRkJCRjI0JywgLy8gQnJpZ2h0IHllbGxvdyB3YXJuaW5nXG5cbiAgICAvLyBIaWdobGlnaHQgYW5kIHNoYWRvd1xuICAgIGhpZ2hsaWdodENvbG9yOiAnI0ZERTA0NycsIC8vIEJyaWdodCB5ZWxsb3cgaGlnaGxpZ2h0XG4gICAgc2hhZG93Q29sb3I6ICcjMzc0MTUxJywgLy8gRGFyayBncmF5IHNoYWRvd1xuICB9LFxufTtcblxuZXhwb3J0IGNsYXNzIEdob3N0QmFuIHtcbiAgZGVmYXVsdE9wdGlvbnM6IEdob3N0QmFuT3B0aW9ucyA9IHtcbiAgICBib2FyZFNpemU6IDE5LFxuICAgIGR5bmFtaWNQYWRkaW5nOiBmYWxzZSxcbiAgICBwYWRkaW5nOiAxMCxcbiAgICBleHRlbnQ6IDMsXG4gICAgaW50ZXJhY3RpdmU6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGU6IHRydWUsXG4gICAgdGhlbWU6IFRoZW1lLkJsYWNrQW5kV2hpdGUsXG4gICAgYW5hbHlzaXNQb2ludFRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCxcbiAgICBiYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICBzaG93QW5hbHlzaXM6IGZhbHNlLFxuICAgIGFkYXB0aXZlQm9hcmRMaW5lOiB0cnVlLFxuICAgIHRoZW1lT3B0aW9uczogREVGQVVMVF9USEVNRV9PUFRJT05TLFxuICAgIHRoZW1lUmVzb3VyY2VzOiBUSEVNRV9SRVNPVVJDRVMsXG4gICAgbW92ZVNvdW5kOiBmYWxzZSxcbiAgICBhZGFwdGl2ZVN0YXJTaXplOiB0cnVlLFxuICAgIG1vYmlsZUluZGljYXRvck9mZnNldDogMCxcbiAgfTtcbiAgb3B0aW9uczogR2hvc3RCYW5PcHRpb25zO1xuICBkb206IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuICBjYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgYm9hcmQ/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgYW5hbHlzaXNDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgY3Vyc29yQ2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIG1hcmt1cENhbnZhcz86IEhUTUxDYW52YXNFbGVtZW50O1xuICBlZmZlY3RDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgbW92ZVNvdW5kQXVkaW8/OiBIVE1MQXVkaW9FbGVtZW50O1xuICB0dXJuOiBLaTtcbiAgcHJpdmF0ZSBjdXJzb3I6IEN1cnNvciA9IEN1cnNvci5Ob25lO1xuICBwcml2YXRlIGN1cnNvclZhbHVlOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSB0b3VjaE1vdmluZyA9IGZhbHNlO1xuICBwcml2YXRlIHRvdWNoU3RhcnRQb2ludDogRE9NUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgcHVibGljIGN1cnNvclBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdO1xuICBwdWJsaWMgYWN0dWFsQ3Vyc29yUG9zaXRpb246IFtudW1iZXIsIG51bWJlcl07XG4gIHB1YmxpYyBjdXJzb3JQb2ludDogRE9NUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgcHVibGljIGFjdHVhbEN1cnNvclBvaW50OiBET01Qb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICBwdWJsaWMgbWF0OiBudW1iZXJbXVtdO1xuICBwdWJsaWMgbWFya3VwOiBzdHJpbmdbXVtdO1xuICBwdWJsaWMgdmlzaWJsZUFyZWFNYXQ6IG51bWJlcltdW10gfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBwcmV2ZW50TW92ZU1hdDogbnVtYmVyW11bXTtcbiAgcHVibGljIGVmZmVjdE1hdDogc3RyaW5nW11bXTtcbiAgcHJpdmF0ZSBwcmV2aW91c0JvYXJkU3RhdGU6IG51bWJlcltdW10gfCBudWxsID0gbnVsbDtcbiAgbWF4aHY6IG51bWJlcjtcbiAgdHJhbnNNYXQ6IERPTU1hdHJpeDtcbiAgYW5hbHlzaXM6IEFuYWx5c2lzIHwgbnVsbDtcbiAgdmlzaWJsZUFyZWE6IG51bWJlcltdW107XG4gIG5vZGVNYXJrdXBTdHlsZXM6IHtcbiAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICBjb2xvcjogc3RyaW5nO1xuICAgICAgbGluZURhc2g6IG51bWJlcltdO1xuICAgIH07XG4gIH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBHaG9zdEJhbk9wdGlvbnNQYXJhbXMgPSB7fSkge1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMuZGVmYXVsdE9wdGlvbnMsXG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgdGhlbWVPcHRpb25zOiB7XG4gICAgICAgIC4uLnRoaXMuZGVmYXVsdE9wdGlvbnMudGhlbWVPcHRpb25zLFxuICAgICAgICAuLi4ob3B0aW9ucy50aGVtZU9wdGlvbnMgfHwge30pLFxuICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplO1xuICAgIHRoaXMubWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLnByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLm1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy5lZmZlY3RNYXQgPSBlbXB0eShbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMudHVybiA9IEtpLkJsYWNrO1xuICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBbLTEsIC0xXTtcbiAgICB0aGlzLmFjdHVhbEN1cnNvclBvc2l0aW9uID0gWy0xLCAtMV07XG4gICAgdGhpcy5tYXhodiA9IHNpemU7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICB0aGlzLmFuYWx5c2lzID0gbnVsbDtcbiAgICB0aGlzLnZpc2libGVBcmVhID0gW1xuICAgICAgWzAsIHNpemUgLSAxXSxcbiAgICAgIFswLCBzaXplIC0gMV0sXG4gICAgXTtcblxuICAgIHRoaXMudXBkYXRlTm9kZU1hcmt1cFN0eWxlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUaGVtZVByb3BlcnR5PFQgZXh0ZW5kcyBrZXlvZiBUaGVtZUNvbmZpZz4oXG4gICAgcHJvcGVydHlLZXk6IFRcbiAgKTogVGhlbWVDb25maWdbVF07XG4gIHByaXZhdGUgZ2V0VGhlbWVQcm9wZXJ0eShwcm9wZXJ0eUtleTogVGhlbWVQcm9wZXJ0eUtleSk6IHN0cmluZyB8IG51bWJlcjtcbiAgcHJpdmF0ZSBnZXRUaGVtZVByb3BlcnR5PFQgZXh0ZW5kcyBrZXlvZiBUaGVtZUNvbmZpZz4oXG4gICAgcHJvcGVydHlLZXk6IFQgfCBUaGVtZVByb3BlcnR5S2V5XG4gICk6IFRoZW1lQ29uZmlnW1RdIHwgc3RyaW5nIHwgbnVtYmVyIHtcbiAgICBjb25zdCBrZXkgPVxuICAgICAgdHlwZW9mIHByb3BlcnR5S2V5ID09PSAnc3RyaW5nJyA/IHByb3BlcnR5S2V5IDogKHByb3BlcnR5S2V5IGFzIHN0cmluZyk7XG4gICAgY29uc3QgY3VycmVudFRoZW1lID0gdGhpcy5vcHRpb25zLnRoZW1lO1xuICAgIGNvbnN0IHRoZW1lQ29uZmlnID0gdGhpcy5vcHRpb25zLnRoZW1lT3B0aW9uc1tjdXJyZW50VGhlbWVdIHx8IHt9O1xuICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSB0aGlzLm9wdGlvbnMudGhlbWVPcHRpb25zLmRlZmF1bHQgfHwge307XG5cbiAgICBjb25zdCByZXN1bHQgPSAodGhlbWVDb25maWdba2V5IGFzIGtleW9mIFRoZW1lQ29uZmlnXSB8fFxuICAgICAgZGVmYXVsdENvbmZpZ1trZXkgYXMga2V5b2YgVGhlbWVDb25maWddKSBhcyBUaGVtZUNvbmZpZ1tUXTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZW1lIGNvbnRleHQgZm9yIG1hcmt1cCBjb21wb25lbnRzXG4gICAqL1xuICBwcml2YXRlIGNyZWF0ZVRoZW1lQ29udGV4dCgpOiBUaGVtZUNvbnRleHQge1xuICAgIHJldHVybiB7XG4gICAgICB0aGVtZTogdGhpcy5vcHRpb25zLnRoZW1lLFxuICAgICAgdGhlbWVPcHRpb25zOiB0aGlzLm9wdGlvbnMudGhlbWVPcHRpb25zLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU5vZGVNYXJrdXBTdHlsZXMoKSB7XG4gICAgY29uc3QgZGVmYXVsdERhc2hlZExpbmVEYXNoID0gWzgsIDZdO1xuICAgIGNvbnN0IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCA9IFs0LCA0XTtcblxuICAgIHRoaXMubm9kZU1hcmt1cFN0eWxlcyA9IHtcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuUG9zaXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuRGVmYXVsdE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuV2FybmluZ05vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlRGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlRGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5lZ2F0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxEYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0RGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkRlZmF1bHROb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0Rhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5XYXJuaW5nTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlRG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlRG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5lZ2F0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxEb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmV1dHJhbE5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0RG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkRlZmF1bHROb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0RvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5XYXJuaW5nTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlBvc2l0aXZlTm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuTmVnYXRpdmVOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0QWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkRlZmF1bHROb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lldhcm5pbmdOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZURhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5Qb3NpdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZURhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsRGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdERhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5EZWZhdWx0Tm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdEYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuV2FybmluZ05vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZURvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5Qb3NpdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZURvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZWdhdGl2ZU5vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsRG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5Lk5ldXRyYWxOb2RlQ29sb3IpLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdERvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5EZWZhdWx0Tm9kZUNvbG9yKSxcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdEb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuV2FybmluZ05vZGVDb2xvciksXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBzZXRUdXJuKHR1cm46IEtpKSB7XG4gICAgdGhpcy50dXJuID0gdHVybjtcbiAgfVxuXG4gIHNldFByZXZpb3VzQm9hcmRTdGF0ZShib2FyZFN0YXRlOiBudW1iZXJbXVtdIHwgbnVsbCkge1xuICAgIHRoaXMucHJldmlvdXNCb2FyZFN0YXRlID0gYm9hcmRTdGF0ZTtcbiAgfVxuXG4gIGdldFByZXZpb3VzQm9hcmRTdGF0ZSgpOiBudW1iZXJbXVtdIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXNCb2FyZFN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY29yZCBjdXJyZW50IGJvYXJkIHN0YXRlIGFzIGhpc3Rvcnkgc3RhdGUgZm9yIGtvIHJ1bGUgY2hlY2tpbmcgaW4gbmV4dCBtb3ZlXG4gICAqL1xuICByZWNvcmRDdXJyZW50Qm9hcmRTdGF0ZSgpIHtcbiAgICB0aGlzLnByZXZpb3VzQm9hcmRTdGF0ZSA9IHRoaXMubWF0Lm1hcChyb3cgPT4gWy4uLnJvd10pO1xuICB9XG5cbiAgc2V0Qm9hcmRTaXplKHNpemU6IG51bWJlcikge1xuICAgIHRoaXMub3B0aW9ucy5ib2FyZFNpemUgPSBNYXRoLm1pbihzaXplLCBNQVhfQk9BUkRfU0laRSk7XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuY2FudmFzIHx8XG4gICAgICAhdGhpcy5jdXJzb3JDYW52YXMgfHxcbiAgICAgICF0aGlzLmRvbSB8fFxuICAgICAgIXRoaXMuYm9hcmQgfHxcbiAgICAgICF0aGlzLm1hcmt1cENhbnZhcyB8fFxuICAgICAgIXRoaXMuYW5hbHlzaXNDYW52YXMgfHxcbiAgICAgICF0aGlzLmVmZmVjdENhbnZhc1xuICAgIClcbiAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGNhbnZhc2VzID0gW1xuICAgICAgdGhpcy5ib2FyZCxcbiAgICAgIHRoaXMuY2FudmFzLFxuICAgICAgdGhpcy5tYXJrdXBDYW52YXMsXG4gICAgICB0aGlzLmN1cnNvckNhbnZhcyxcbiAgICAgIHRoaXMuYW5hbHlzaXNDYW52YXMsXG4gICAgICB0aGlzLmVmZmVjdENhbnZhcyxcbiAgICBdO1xuXG4gICAgY29uc3Qge3NpemV9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHtjbGllbnRXaWR0aH0gPSB0aGlzLmRvbTtcblxuICAgIGNhbnZhc2VzLmZvckVhY2goY2FudmFzID0+IHtcbiAgICAgIGlmIChzaXplKSB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHNpemUgKiBkcHI7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBzaXplICogZHByO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMud2lkdGggPSBNYXRoLmZsb29yKGNsaWVudFdpZHRoICogZHByKTtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ2FudmFzKGlkOiBzdHJpbmcsIHBvaW50ZXJFdmVudHMgPSB0cnVlKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgY2FudmFzLmlkID0gaWQ7XG4gICAgaWYgKCFwb2ludGVyRXZlbnRzKSB7XG4gICAgICBjYW52YXMuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICB9XG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxuXG4gIGluaXQoZG9tOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplO1xuICAgIHRoaXMubWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLm1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcblxuICAgIHRoaXMuYm9hcmQgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tYm9hcmQnKTtcbiAgICB0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1jYW52YXMnKTtcbiAgICB0aGlzLm1hcmt1cENhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1tYXJrdXAnLCBmYWxzZSk7XG4gICAgdGhpcy5jdXJzb3JDYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tY3Vyc29yJyk7XG4gICAgdGhpcy5hbmFseXNpc0NhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1hbmFseXNpcycsIGZhbHNlKTtcbiAgICB0aGlzLmVmZmVjdENhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1lZmZlY3QnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmRvbSA9IGRvbTtcbiAgICBkb20uaW5uZXJIVE1MID0gJyc7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuYm9hcmQpO1xuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMubWFya3VwQ2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5hbmFseXNpc0NhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuY3Vyc29yQ2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5lZmZlY3RDYW52YXMpO1xuXG4gICAgdGhpcy5yZXNpemUoKTtcbiAgICB0aGlzLnJlbmRlckludGVyYWN0aXZlKCk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXRPcHRpb25zKG9wdGlvbnM6IEdob3N0QmFuT3B0aW9uc1BhcmFtcykge1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB0aGVtZU9wdGlvbnM6IHtcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLnRoZW1lT3B0aW9ucyxcbiAgICAgICAgLi4uKG9wdGlvbnMudGhlbWVPcHRpb25zIHx8IHt9KSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZU5vZGVNYXJrdXBTdHlsZXMoKTtcbiAgICB0aGlzLnJlbmRlckludGVyYWN0aXZlKCk7XG4gIH1cblxuICBzZXRNYXQobWF0OiBudW1iZXJbXVtdKSB7XG4gICAgdGhpcy5tYXQgPSBtYXQ7XG4gICAgaWYgKCF0aGlzLnZpc2libGVBcmVhTWF0KSB7XG4gICAgICB0aGlzLnZpc2libGVBcmVhTWF0ID0gbWF0O1xuICAgIH1cbiAgfVxuXG4gIHNldFZpc2libGVBcmVhTWF0KG1hdDogbnVtYmVyW11bXSkge1xuICAgIHRoaXMudmlzaWJsZUFyZWFNYXQgPSBtYXQ7XG4gIH1cblxuICBzZXRQcmV2ZW50TW92ZU1hdChtYXQ6IG51bWJlcltdW10pIHtcbiAgICB0aGlzLnByZXZlbnRNb3ZlTWF0ID0gbWF0O1xuICB9XG5cbiAgc2V0RWZmZWN0TWF0KG1hdDogc3RyaW5nW11bXSkge1xuICAgIHRoaXMuZWZmZWN0TWF0ID0gbWF0O1xuICB9XG5cbiAgc2V0TWFya3VwKG1hcmt1cDogc3RyaW5nW11bXSkge1xuICAgIHRoaXMubWFya3VwID0gbWFya3VwO1xuICB9XG5cbiAgc2V0Q3Vyc29yKGN1cnNvcjogQ3Vyc29yLCB2YWx1ZSA9ICcnKSB7XG4gICAgdGhpcy5jdXJzb3IgPSBjdXJzb3I7XG4gICAgdGhpcy5jdXJzb3JWYWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgc2V0Q3Vyc29yV2l0aFJlbmRlciA9IChkb21Qb2ludDogRE9NUG9pbnQsIG9mZnNldFkgPSAwKSA9PiB7XG4gICAgY29uc3Qge3BhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHtzcGFjZX0gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMudHJhbnNNYXQuaW52ZXJzZSgpLnRyYW5zZm9ybVBvaW50KGRvbVBvaW50KTtcbiAgICBjb25zdCBpZHggPSBNYXRoLnJvdW5kKChwb2ludC54IC0gcGFkZGluZyArIHNwYWNlIC8gMikgLyBzcGFjZSk7XG4gICAgY29uc3QgaWR5ID0gTWF0aC5yb3VuZCgocG9pbnQueSAtIHBhZGRpbmcgKyBzcGFjZSAvIDIpIC8gc3BhY2UpICsgb2Zmc2V0WTtcbiAgICBjb25zdCB4eCA9IGlkeCAqIHNwYWNlO1xuICAgIGNvbnN0IHl5ID0gaWR5ICogc3BhY2U7XG4gICAgY29uc3QgcG9pbnRPbkNhbnZhcyA9IG5ldyBET01Qb2ludCh4eCwgeXkpO1xuICAgIGNvbnN0IHAgPSB0aGlzLnRyYW5zTWF0LnRyYW5zZm9ybVBvaW50KHBvaW50T25DYW52YXMpO1xuICAgIHRoaXMuYWN0dWFsQ3Vyc29yUG9pbnQgPSBwO1xuICAgIHRoaXMuYWN0dWFsQ3Vyc29yUG9zaXRpb24gPSBbaWR4IC0gMSwgaWR5IC0gMV07XG5cbiAgICBpZiAodGhpcy5wcmV2ZW50TW92ZU1hdD8uW2lkeCAtIDFdPy5baWR5IC0gMV0gPT09IDEpIHtcbiAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBbLTEsIC0xXTtcbiAgICAgIHRoaXMuY3Vyc29yUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgICAgIHRoaXMuZHJhd0N1cnNvcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY3Vyc29yUG9pbnQgPSBwO1xuICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBbaWR4IC0gMSwgaWR5IC0gMV07XG4gICAgdGhpcy5kcmF3Q3Vyc29yKCk7XG5cbiAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgfTtcblxuICBwcml2YXRlIG9uTW91c2VNb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHBvaW50ID0gbmV3IERPTVBvaW50KGUub2Zmc2V0WCAqIGRwciwgZS5vZmZzZXRZICogZHByKTtcbiAgICB0aGlzLnNldEN1cnNvcldpdGhSZW5kZXIocG9pbnQpO1xuICB9O1xuXG4gIHByaXZhdGUgY2FsY1RvdWNoUG9pbnQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgIGxldCBwb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm4gcG9pbnQ7XG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0b3VjaGVzID0gZS5jaGFuZ2VkVG91Y2hlcztcbiAgICBwb2ludCA9IG5ldyBET01Qb2ludChcbiAgICAgICh0b3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQpICogZHByLFxuICAgICAgKHRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wKSAqIGRwclxuICAgICk7XG4gICAgcmV0dXJuIHBvaW50O1xuICB9O1xuXG4gIHByaXZhdGUgb25Ub3VjaFN0YXJ0ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudG91Y2hNb3ZpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHBvaW50ID0gdGhpcy5jYWxjVG91Y2hQb2ludChlKTtcbiAgICB0aGlzLnRvdWNoU3RhcnRQb2ludCA9IHBvaW50O1xuICAgIHRoaXMuc2V0Q3Vyc29yV2l0aFJlbmRlcihwb2ludCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBvblRvdWNoTW92ZSA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnRvdWNoTW92aW5nID0gdHJ1ZTtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMuY2FsY1RvdWNoUG9pbnQoZSk7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgbGV0IGRpc3RhbmNlID0gMTA7XG4gICAgaWYgKFxuICAgICAgTWF0aC5hYnMocG9pbnQueCAtIHRoaXMudG91Y2hTdGFydFBvaW50LngpID4gZGlzdGFuY2UgfHxcbiAgICAgIE1hdGguYWJzKHBvaW50LnkgLSB0aGlzLnRvdWNoU3RhcnRQb2ludC55KSA+IGRpc3RhbmNlXG4gICAgKSB7XG4gICAgICBvZmZzZXQgPSB0aGlzLm9wdGlvbnMubW9iaWxlSW5kaWNhdG9yT2Zmc2V0O1xuICAgIH1cbiAgICB0aGlzLnNldEN1cnNvcldpdGhSZW5kZXIocG9pbnQsIG9mZnNldCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBvblRvdWNoRW5kID0gKCkgPT4ge1xuICAgIHRoaXMudG91Y2hNb3ZpbmcgPSBmYWxzZTtcbiAgfTtcblxuICByZW5kZXJJbnRlcmFjdGl2ZSgpIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCk7XG4gICAgfVxuICB9XG5cbiAgc2V0QW5hbHlzaXMoYW5hbHlzaXM6IEFuYWx5c2lzIHwgbnVsbCkge1xuICAgIHRoaXMuYW5hbHlzaXMgPSBhbmFseXNpcztcbiAgICBpZiAoIWFuYWx5c2lzKSB7XG4gICAgICB0aGlzLmNsZWFyQW5hbHlzaXNDYW52YXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93QW5hbHlzaXMpIHRoaXMuZHJhd0FuYWx5c2lzKGFuYWx5c2lzKTtcbiAgfVxuXG4gIHNldFRoZW1lKHRoZW1lOiBUaGVtZSwgb3B0aW9uczogUGFydGlhbDxHaG9zdEJhbk9wdGlvbnNQYXJhbXM+ID0ge30pIHtcbiAgICBjb25zdCB7dGhlbWVSZXNvdXJjZXN9ID0gdGhpcy5vcHRpb25zO1xuICAgIGlmICghdGhlbWVSZXNvdXJjZXNbdGhlbWVdKSByZXR1cm47XG5cbiAgICAvLyBHZXQgYWxsIHRoZW1lIHJlc291cmNlcyBmb3IgcHJlbG9hZGluZyAoYWxsIHJlc29sdXRpb25zKVxuICAgIGNvbnN0IGFsbFRoZW1lSW1hZ2VzID0gZ2V0QWxsVGhlbWVSZXNvdXJjZXModGhlbWUsIHRoZW1lUmVzb3VyY2VzKTtcblxuICAgIHRoaXMub3B0aW9ucy50aGVtZSA9IHRoZW1lO1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgIHRoZW1lLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHRoZW1lT3B0aW9uczoge1xuICAgICAgICAuLi50aGlzLm9wdGlvbnMudGhlbWVPcHRpb25zLFxuICAgICAgICAuLi4ob3B0aW9ucy50aGVtZU9wdGlvbnMgfHwge30pLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlTm9kZU1hcmt1cFN0eWxlcygpO1xuXG4gICAgLy8gUmVkcmF3IGNhbGxiYWNrIGFmdGVyIGltYWdlIGxvYWRpbmcgY29tcGxldGVzXG4gICAgY29uc3Qgb25JbWFnZUxvYWRlZCA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgICAgIHRoaXMuZHJhd1N0b25lcygpO1xuICAgIH07XG5cbiAgICAvLyBQcmVsb2FkIGFsbCB0aGVtZSByZXNvdXJjZXMgKGFsbCByZXNvbHV0aW9ucylcbiAgICBwcmVsb2FkKFxuICAgICAgYWxsVGhlbWVJbWFnZXMsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuZHJhd0JvYXJkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgb25JbWFnZUxvYWRlZFxuICAgICk7XG5cbiAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBjYWxjQ2VudGVyID0gKCk6IENlbnRlciA9PiB7XG4gICAgY29uc3Qge3Zpc2libGVBcmVhfSA9IHRoaXM7XG4gICAgY29uc3Qge2JvYXJkU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAoXG4gICAgICAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiYgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbiAgICB9XG5cbiAgICBpZiAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDApIHtcbiAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCkgcmV0dXJuIENlbnRlci5Ub3BMZWZ0O1xuICAgICAgZWxzZSBpZiAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHJldHVybiBDZW50ZXIuQm90dG9tTGVmdDtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5MZWZ0O1xuICAgIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCkgcmV0dXJuIENlbnRlci5Ub3BSaWdodDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbVJpZ2h0O1xuICAgICAgZWxzZSByZXR1cm4gQ2VudGVyLlJpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wO1xuICAgICAgZWxzZSBpZiAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHJldHVybiBDZW50ZXIuQm90dG9tO1xuICAgICAgZWxzZSByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbiAgICB9XG4gIH07XG5cbiAgY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZTogbnVtYmVyKSB7XG4gICAgY29uc3Qge2Nvb3JkaW5hdGV9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgY29uc3Qge2NhbnZhc30gPSB0aGlzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgcGFkZGluZyA9IGNhbnZhcy53aWR0aCAvICh2aXNpYmxlQXJlYVNpemUgKyAyKSAvIDI7XG4gICAgY29uc3QgcGFkZGluZ1dpdGhvdXRDb29yZGluYXRlID0gY2FudmFzLndpZHRoIC8gKHZpc2libGVBcmVhU2l6ZSArIDIpIC8gNDtcblxuICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gY29vcmRpbmF0ZSA/IHBhZGRpbmcgOiBwYWRkaW5nV2l0aG91dENvb3JkaW5hdGU7XG4gIH1cblxuICB6b29tQm9hcmQoem9vbSA9IGZhbHNlKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2FudmFzLFxuICAgICAgYW5hbHlzaXNDYW52YXMsXG4gICAgICBib2FyZCxcbiAgICAgIGN1cnNvckNhbnZhcyxcbiAgICAgIG1hcmt1cENhbnZhcyxcbiAgICAgIGVmZmVjdENhbnZhcyxcbiAgICB9ID0gdGhpcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IHtib2FyZFNpemUsIGV4dGVudCwgcGFkZGluZywgZHluYW1pY1BhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IGJvYXJkTGluZUV4dGVudCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShcbiAgICAgIFRoZW1lUHJvcGVydHlLZXkuQm9hcmRMaW5lRXh0ZW50XG4gICAgKTtcbiAgICBjb25zdCB6b29tZWRWaXNpYmxlQXJlYSA9IGNhbGNWaXNpYmxlQXJlYShcbiAgICAgIHRoaXMudmlzaWJsZUFyZWFNYXQsXG4gICAgICBleHRlbnQsXG4gICAgICBmYWxzZVxuICAgICk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGJvYXJkQ3R4ID0gYm9hcmQ/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgY3Vyc29yQ3R4ID0gY3Vyc29yQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IG1hcmt1cEN0eCA9IG1hcmt1cENhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBhbmFseXNpc0N0eCA9IGFuYWx5c2lzQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGVmZmVjdEN0eCA9IGVmZmVjdENhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCB2aXNpYmxlQXJlYSA9IHpvb21cbiAgICAgID8gem9vbWVkVmlzaWJsZUFyZWFcbiAgICAgIDogW1xuICAgICAgICAgIFswLCBib2FyZFNpemUgLSAxXSxcbiAgICAgICAgICBbMCwgYm9hcmRTaXplIC0gMV0sXG4gICAgICAgIF07XG5cbiAgICB0aGlzLnZpc2libGVBcmVhID0gdmlzaWJsZUFyZWE7XG4gICAgY29uc3QgdmlzaWJsZUFyZWFTaXplID0gTWF0aC5tYXgoXG4gICAgICB2aXNpYmxlQXJlYVswXVsxXSAtIHZpc2libGVBcmVhWzBdWzBdLFxuICAgICAgdmlzaWJsZUFyZWFbMV1bMV0gLSB2aXNpYmxlQXJlYVsxXVswXVxuICAgICk7XG5cbiAgICBpZiAoZHluYW1pY1BhZGRpbmcpIHtcbiAgICAgIHRoaXMuY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gREVGQVVMVF9PUFRJT05TLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgaWYgKHpvb20pIHtcbiAgICAgIGNvbnN0IHtzcGFjZX0gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuY2FsY0NlbnRlcigpO1xuXG4gICAgICBpZiAoZHluYW1pY1BhZGRpbmcpIHtcbiAgICAgICAgdGhpcy5jYWxjRHluYW1pY1BhZGRpbmcodmlzaWJsZUFyZWFTaXplKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gREVGQVVMVF9PUFRJT05TLnBhZGRpbmc7XG4gICAgICB9XG5cbiAgICAgIGxldCBleHRyYVZpc2libGVTaXplID0gYm9hcmRMaW5lRXh0ZW50ICogMiArIDE7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCB8fFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0XG4gICAgICApIHtcbiAgICAgICAgZXh0cmFWaXNpYmxlU2l6ZSA9IGJvYXJkTGluZUV4dGVudCArIDAuNTtcbiAgICAgIH1cbiAgICAgIGxldCB6b29tZWRCb2FyZFNpemUgPSB2aXNpYmxlQXJlYVNpemUgKyBleHRyYVZpc2libGVTaXplO1xuXG4gICAgICBpZiAoem9vbWVkQm9hcmRTaXplIDwgYm9hcmRTaXplKSB7XG4gICAgICAgIGxldCBzY2FsZSA9IChjYW52YXMud2lkdGggLSBwYWRkaW5nICogMikgLyAoem9vbWVkQm9hcmRTaXplICogc3BhY2UpO1xuXG4gICAgICAgIGxldCBvZmZzZXRYID1cbiAgICAgICAgICB2aXNpYmxlQXJlYVswXVswXSAqIHNwYWNlICogc2NhbGUgK1xuICAgICAgICAgIHBhZGRpbmcgKiBzY2FsZSAtXG4gICAgICAgICAgcGFkZGluZyAtXG4gICAgICAgICAgKHNwYWNlICogZXh0cmFWaXNpYmxlU2l6ZSAqIHNjYWxlKSAvIDIgK1xuICAgICAgICAgIChzcGFjZSAqIHNjYWxlKSAvIDI7XG5cbiAgICAgICAgbGV0IG9mZnNldFkgPVxuICAgICAgICAgIHZpc2libGVBcmVhWzFdWzBdICogc3BhY2UgKiBzY2FsZSArXG4gICAgICAgICAgcGFkZGluZyAqIHNjYWxlIC1cbiAgICAgICAgICBwYWRkaW5nIC1cbiAgICAgICAgICAoc3BhY2UgKiBleHRyYVZpc2libGVTaXplICogc2NhbGUpIC8gMiArXG4gICAgICAgICAgKHNwYWNlICogc2NhbGUpIC8gMjtcblxuICAgICAgICB0aGlzLnRyYW5zTWF0ID0gbmV3IERPTU1hdHJpeCgpO1xuICAgICAgICB0aGlzLnRyYW5zTWF0LnRyYW5zbGF0ZVNlbGYoLW9mZnNldFgsIC1vZmZzZXRZKTtcbiAgICAgICAgdGhpcy50cmFuc01hdC5zY2FsZVNlbGYoc2NhbGUsIHNjYWxlKTtcbiAgICAgICAgY3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIGJvYXJkQ3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIGFuYWx5c2lzQ3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIGN1cnNvckN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBtYXJrdXBDdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgICAgZWZmZWN0Q3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICB9XG4gIH1cblxuICBjYWxjQm9hcmRWaXNpYmxlQXJlYSh6b29tID0gZmFsc2UpIHtcbiAgICB0aGlzLnpvb21Cb2FyZCh0aGlzLm9wdGlvbnMuem9vbSk7XG4gIH1cblxuICByZXNldFRyYW5zZm9ybSgpIHtcbiAgICBjb25zdCB7XG4gICAgICBjYW52YXMsXG4gICAgICBhbmFseXNpc0NhbnZhcyxcbiAgICAgIGJvYXJkLFxuICAgICAgY3Vyc29yQ2FudmFzLFxuICAgICAgbWFya3VwQ2FudmFzLFxuICAgICAgZWZmZWN0Q2FudmFzLFxuICAgIH0gPSB0aGlzO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBib2FyZEN0eCA9IGJvYXJkPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGN1cnNvckN0eCA9IGN1cnNvckNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBtYXJrdXBDdHggPSBtYXJrdXBDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgYW5hbHlzaXNDdHggPSBhbmFseXNpc0NhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBlZmZlY3RDdHggPSBlZmZlY3RDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICBjdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgYm9hcmRDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgYW5hbHlzaXNDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgY3Vyc29yQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIG1hcmt1cEN0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICBlZmZlY3RDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hdH0gPSB0aGlzO1xuICAgIGlmICh0aGlzLm1hdCAmJiBtYXRbMF0pIHRoaXMub3B0aW9ucy5ib2FyZFNpemUgPSBtYXRbMF0ubGVuZ3RoO1xuXG4gICAgdGhpcy56b29tQm9hcmQodGhpcy5vcHRpb25zLnpvb20pO1xuICAgIHRoaXMuem9vbUJvYXJkKHRoaXMub3B0aW9ucy56b29tKTtcbiAgICB0aGlzLmNsZWFyQWxsQ2FudmFzKCk7XG4gICAgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgICB0aGlzLmRyYXdTdG9uZXMoKTtcbiAgICB0aGlzLmRyYXdNYXJrdXAoKTtcbiAgICB0aGlzLmRyYXdDdXJzb3IoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dBbmFseXNpcykgdGhpcy5kcmF3QW5hbHlzaXMoKTtcbiAgfVxuXG4gIHJlbmRlckluT25lQ2FudmFzKGNhbnZhcyA9IHRoaXMuY2FudmFzKSB7XG4gICAgdGhpcy5jbGVhckFsbENhbnZhcygpO1xuICAgIHRoaXMuZHJhd0JvYXJkKGNhbnZhcywgZmFsc2UpO1xuICAgIHRoaXMuZHJhd1N0b25lcyh0aGlzLm1hdCwgY2FudmFzLCBmYWxzZSk7XG4gICAgdGhpcy5kcmF3TWFya3VwKHRoaXMubWF0LCB0aGlzLm1hcmt1cCwgY2FudmFzLCBmYWxzZSk7XG4gIH1cblxuICBjbGVhckFsbENhbnZhcyA9ICgpID0+IHtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKHRoaXMuYm9hcmQpO1xuICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKHRoaXMubWFya3VwQ2FudmFzKTtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKHRoaXMuZWZmZWN0Q2FudmFzKTtcbiAgICB0aGlzLmNsZWFyQ3Vyc29yQ2FudmFzKCk7XG4gICAgdGhpcy5jbGVhckFuYWx5c2lzQ2FudmFzKCk7XG4gIH07XG5cbiAgY2xlYXJCb2FyZCA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuYm9hcmQpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSB0aGlzLmJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyQ2FudmFzID0gKGNhbnZhcyA9IHRoaXMuY2FudmFzKSA9PiB7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyTWFya3VwQ2FudmFzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5tYXJrdXBDYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSB0aGlzLm1hcmt1cENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLm1hcmt1cENhbnZhcy53aWR0aCwgdGhpcy5tYXJrdXBDYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyQ3Vyc29yQ2FudmFzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5jdXJzb3JDYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBzaXplID0gdGhpcy5vcHRpb25zLmJvYXJkU2l6ZTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN1cnNvckNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmN1cnNvckNhbnZhcy53aWR0aCwgdGhpcy5jdXJzb3JDYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyQW5hbHlzaXNDYW52YXMgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmFuYWx5c2lzQ2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gdGhpcy5hbmFseXNpc0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdChcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGhpcy5hbmFseXNpc0NhbnZhcy53aWR0aCxcbiAgICAgICAgdGhpcy5hbmFseXNpc0NhbnZhcy5oZWlnaHRcbiAgICAgICk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBkcmF3QW5hbHlzaXMgPSAoYW5hbHlzaXMgPSB0aGlzLmFuYWx5c2lzKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5hbmFseXNpc0NhbnZhcztcbiAgICBjb25zdCB7XG4gICAgICB0aGVtZSA9IFRoZW1lLkJsYWNrQW5kV2hpdGUsXG4gICAgICBhbmFseXNpc1BvaW50VGhlbWUsXG4gICAgICBib2FyZFNpemUsXG4gICAgICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplLFxuICAgIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qge21hdCwgbWFya3VwfSA9IHRoaXM7XG4gICAgaWYgKCFjYW52YXMgfHwgIWFuYWx5c2lzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKCFjdHgpIHJldHVybjtcbiAgICB0aGlzLmNsZWFyQW5hbHlzaXNDYW52YXMoKTtcbiAgICBjb25zdCB7cm9vdEluZm99ID0gYW5hbHlzaXM7XG5cbiAgICBhbmFseXNpcy5tb3ZlSW5mb3MuZm9yRWFjaChtID0+IHtcbiAgICAgIGlmIChtLm1vdmUgPT09ICdwYXNzJykgcmV0dXJuO1xuICAgICAgY29uc3QgaWRPYmogPSBKU09OLnBhcnNlKGFuYWx5c2lzLmlkKTtcbiAgICAgIGxldCBhbmFseXNpc0JvYXJkU2l6ZSA9IGJvYXJkU2l6ZTtcbiAgICAgIGNvbnN0IG9mZnNldGVkTW92ZSA9IG9mZnNldEExTW92ZShcbiAgICAgICAgbS5tb3ZlLFxuICAgICAgICAwLFxuICAgICAgICBhbmFseXNpc0JvYXJkU2l6ZSAtIGlkT2JqLmJ5XG4gICAgICApO1xuICAgICAgbGV0IHt4OiBpLCB5OiBqfSA9IGExVG9Qb3Mob2Zmc2V0ZWRNb3ZlKTtcbiAgICAgIGlmIChtYXRbaV1bal0gIT09IDApIHJldHVybjtcbiAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgY29uc3QgeSA9IHNjYWxlZFBhZGRpbmcgKyBqICogc3BhY2U7XG4gICAgICBjb25zdCByYXRpbyA9IDAuNDY7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgaWYgKFxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuU3ViZHVlZCAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuQmxhY2tBbmRXaGl0ZSAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRmxhdCAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuV2FybSAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRGFya1xuICAgICAgKSB7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMzA7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMzA7XG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LlNoYWRvd0NvbG9yKTtcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSA4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDA7XG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICcjZmZmJztcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xuICAgICAgfVxuXG4gICAgICBsZXQgb3V0bGluZUNvbG9yO1xuICAgICAgaWYgKG1hcmt1cFtpXVtqXS5pbmNsdWRlcyhNYXJrdXAuUG9zaXRpdmVOb2RlKSkge1xuICAgICAgICBvdXRsaW5lQ29sb3IgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICAgICAgVGhlbWVQcm9wZXJ0eUtleS5Qb3NpdGl2ZU5vZGVDb2xvclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAobWFya3VwW2ldW2pdLmluY2x1ZGVzKE1hcmt1cC5OZWdhdGl2ZU5vZGUpKSB7XG4gICAgICAgIG91dGxpbmVDb2xvciA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShcbiAgICAgICAgICBUaGVtZVByb3BlcnR5S2V5Lk5lZ2F0aXZlTm9kZUNvbG9yXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXJrdXBbaV1bal0uaW5jbHVkZXMoTWFya3VwLk5ldXRyYWxOb2RlKSkge1xuICAgICAgICBvdXRsaW5lQ29sb3IgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5OZXV0cmFsTm9kZUNvbG9yKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcG9pbnQgPSBuZXcgQW5hbHlzaXNQb2ludChcbiAgICAgICAgY3R4LFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICBzcGFjZSAqIHJhdGlvLFxuICAgICAgICByb290SW5mbyxcbiAgICAgICAgbSxcbiAgICAgICAgYW5hbHlzaXNQb2ludFRoZW1lLFxuICAgICAgICBvdXRsaW5lQ29sb3JcbiAgICAgICk7XG4gICAgICBwb2ludC5kcmF3KCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGRyYXdNYXJrdXAgPSAoXG4gICAgbWF0ID0gdGhpcy5tYXQsXG4gICAgbWFya3VwID0gdGhpcy5tYXJrdXAsXG4gICAgbWFya3VwQ2FudmFzID0gdGhpcy5tYXJrdXBDYW52YXMsXG4gICAgY2xlYXIgPSB0cnVlXG4gICkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IG1hcmt1cENhbnZhcztcbiAgICBjb25zdCB7dGhlbWV9ID0gdGhpcy5vcHRpb25zO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIGlmIChjbGVhcikgdGhpcy5jbGVhckNhbnZhcyhjYW52YXMpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJrdXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXJrdXBbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBtYXJrdXBbaV1bal07XG4gICAgICAgICAgdmFsdWVzPy5zcGxpdCgnfCcpLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICAgICAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgICAgICAgICBjb25zdCB5ID0gc2NhbGVkUGFkZGluZyArIGogKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3Qga2kgPSBtYXRbaV1bal07XG4gICAgICAgICAgICAgIGxldCBtYXJrdXA7XG4gICAgICAgICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5DaXJjbGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IENpcmNsZU1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5DdXJyZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBDaXJjbGVTb2xpZE1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZUFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZURhc2hlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZURvdHRlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZWdhdGl2ZUFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZWdhdGl2ZURhc2hlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZWdhdGl2ZURvdHRlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxEYXNoZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbERvdHRlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdEYXNoZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0RvdHRlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0QWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHREYXNoZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdERvdHRlZEFjdGl2ZU5vZGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtjb2xvciwgbGluZURhc2h9ID0gdGhpcy5ub2RlTWFya3VwU3R5bGVzW3ZhbHVlXTtcblxuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgQWN0aXZlTm9kZU1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCksXG4gICAgICAgICAgICAgICAgICAgICAgTWFya3VwLkNpcmNsZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAuc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAuc2V0TGluZURhc2gobGluZURhc2gpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlRGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlRG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlRGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlRG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbERhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsRG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0Rhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nRG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdERhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0RG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5vZGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtjb2xvciwgbGluZURhc2h9ID0gdGhpcy5ub2RlTWFya3VwU3R5bGVzW3ZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IE5vZGVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpLFxuICAgICAgICAgICAgICAgICAgICAgIE1hcmt1cC5DaXJjbGVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwLnNldExpbmVEYXNoKGxpbmVEYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5TcXVhcmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IFNxdWFyZU1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5UcmlhbmdsZToge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgVHJpYW5nbGVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuQ3Jvc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IENyb3NzTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkhpZ2hsaWdodDoge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgSGlnaGxpZ2h0TWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBUZXh0TWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWFya3VwPy5kcmF3KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3Qm9hcmQgPSAoYm9hcmQgPSB0aGlzLmJvYXJkLCBjbGVhciA9IHRydWUpID0+IHtcbiAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoYm9hcmQpO1xuICAgIHRoaXMuZHJhd0Jhbihib2FyZCk7XG4gICAgdGhpcy5kcmF3Qm9hcmRMaW5lKGJvYXJkKTtcbiAgICB0aGlzLmRyYXdTdGFycyhib2FyZCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb29yZGluYXRlKSB7XG4gICAgICB0aGlzLmRyYXdDb29yZGluYXRlKCk7XG4gICAgfVxuICB9O1xuXG4gIGRyYXdCYW4gPSAoYm9hcmQgPSB0aGlzLmJvYXJkKSA9PiB7XG4gICAgY29uc3Qge3RoZW1lLCB0aGVtZVJlc291cmNlcywgcGFkZGluZ30gPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKGJvYXJkKSB7XG4gICAgICBib2FyZC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnMnB4JztcbiAgICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBpZiAoY3R4KSB7XG4gICAgICAgIHNldEltYWdlU21vb3RoaW5nUXVhbGl0eShjdHgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgfHxcbiAgICAgICAgICB0aGVtZSA9PT0gVGhlbWUuRmxhdCB8fFxuICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5XYXJtIHx8XG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLkRhcmsgfHxcbiAgICAgICAgICB0aGVtZSA9PT0gVGhlbWUuSGlnaENvbnRyYXN0XG4gICAgICAgICkge1xuICAgICAgICAgIGJvYXJkLnN0eWxlLmJveFNoYWRvdyA9XG4gICAgICAgICAgICB0aGVtZSA9PT0gVGhlbWUuQmxhY2tBbmRXaGl0ZSA/ICcwcHggMHB4IDBweCAjMDAwMDAwJyA6ICcnO1xuXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShcbiAgICAgICAgICAgIFRoZW1lUHJvcGVydHlLZXkuQm9hcmRCYWNrZ3JvdW5kQ29sb3JcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIGN0eC5maWxsUmVjdChcbiAgICAgICAgICAvLyAgIC1wYWRkaW5nLFxuICAgICAgICAgIC8vICAgLXBhZGRpbmcsXG4gICAgICAgICAgLy8gICBib2FyZC53aWR0aCArIHBhZGRpbmcsXG4gICAgICAgICAgLy8gICBib2FyZC5oZWlnaHQgKyBwYWRkaW5nXG4gICAgICAgICAgLy8gKTtcbiAgICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgYm9hcmQud2lkdGgsIGJvYXJkLmhlaWdodCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgYm9hcmRQaXhlbFNpemUgPSBib2FyZC53aWR0aDtcbiAgICAgICAgICBjb25zdCByZXNvdXJjZXMgPSBnZXRUaGVtZVJlc291cmNlcyhcbiAgICAgICAgICAgIHRoZW1lLFxuICAgICAgICAgICAgdGhlbWVSZXNvdXJjZXMsXG4gICAgICAgICAgICBib2FyZFBpeGVsU2l6ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHJlc291cmNlcyAmJiByZXNvdXJjZXMuYm9hcmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvYXJkVXJsID0gcmVzb3VyY2VzLmJvYXJkO1xuICAgICAgICAgICAgY29uc3QgYm9hcmRSZXMgPSBpbWFnZXNbYm9hcmRVcmxdO1xuICAgICAgICAgICAgaWYgKGJvYXJkUmVzKSB7XG4gICAgICAgICAgICAgIGlmICh0aGVtZSA9PT0gVGhlbWUuV2FsbnV0IHx8IHRoZW1lID09PSBUaGVtZS5ZdW56aU1vbmtleURhcmspIHtcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGJvYXJkUmVzLCAwLCAwLCBib2FyZC53aWR0aCwgYm9hcmQuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXR0ZXJuID0gY3R4LmNyZWF0ZVBhdHRlcm4oYm9hcmRSZXMsICdyZXBlYXQnKTtcbiAgICAgICAgICAgICAgICBpZiAocGF0dGVybikge1xuICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHBhdHRlcm47XG4gICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgYm9hcmQud2lkdGgsIGJvYXJkLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRyYXdCb2FyZExpbmUgPSAoYm9hcmQgPSB0aGlzLmJvYXJkKSA9PiB7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGNvbnN0IHt2aXNpYmxlQXJlYSwgb3B0aW9ucywgbWF0LCBwcmV2ZW50TW92ZU1hdCwgY3Vyc29yUG9zaXRpb259ID0gdGhpcztcbiAgICBjb25zdCB7em9vbSwgYm9hcmRTaXplLCBhZGFwdGl2ZUJvYXJkTGluZSwgdGhlbWV9ID0gb3B0aW9ucztcbiAgICBjb25zdCBib2FyZExpbmVXaWR0aCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShcbiAgICAgIFRoZW1lUHJvcGVydHlLZXkuQm9hcmRMaW5lV2lkdGhcbiAgICApO1xuICAgIGNvbnN0IGJvYXJkRWRnZUxpbmVXaWR0aCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShcbiAgICAgIFRoZW1lUHJvcGVydHlLZXkuQm9hcmRFZGdlTGluZVdpZHRoXG4gICAgKTtcbiAgICBjb25zdCBib2FyZExpbmVFeHRlbnQgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoXG4gICAgICBUaGVtZVByb3BlcnR5S2V5LkJvYXJkTGluZUV4dGVudFxuICAgICk7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG5cbiAgICAgIGNvbnN0IGV4dGVuZFNwYWNlID0gem9vbSA/IGJvYXJkTGluZUV4dGVudCAqIHNwYWNlIDogMDtcbiAgICAgIGxldCBhY3RpdmVDb2xvciA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eShUaGVtZVByb3BlcnR5S2V5LkFjdGl2ZUNvbG9yKTtcbiAgICAgIGxldCBpbmFjdGl2ZUNvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KFRoZW1lUHJvcGVydHlLZXkuSW5hY3RpdmVDb2xvcik7XG5cbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5Cb2FyZExpbmVDb2xvcik7XG5cbiAgICAgIGNvbnN0IGFkYXB0aXZlRmFjdG9yID0gMC4wMDE7XG4gICAgICBjb25zdCB0b3VjaGluZ0ZhY3RvciA9IDIuNTtcbiAgICAgIGxldCBlZGdlTGluZVdpZHRoID0gYWRhcHRpdmVCb2FyZExpbmVcbiAgICAgICAgPyBib2FyZC53aWR0aCAqIGFkYXB0aXZlRmFjdG9yICogMlxuICAgICAgICA6IGJvYXJkRWRnZUxpbmVXaWR0aDtcblxuICAgICAgbGV0IGxpbmVXaWR0aCA9IGFkYXB0aXZlQm9hcmRMaW5lXG4gICAgICAgID8gYm9hcmQud2lkdGggKiBhZGFwdGl2ZUZhY3RvclxuICAgICAgICA6IGJvYXJkTGluZVdpZHRoO1xuXG4gICAgICBjb25zdCBhbGxvd01vdmUgPVxuICAgICAgICBjYW5Nb3ZlKFxuICAgICAgICAgIG1hdCxcbiAgICAgICAgICBjdXJzb3JQb3NpdGlvblswXSxcbiAgICAgICAgICBjdXJzb3JQb3NpdGlvblsxXSxcbiAgICAgICAgICB0aGlzLnR1cm4sXG4gICAgICAgICAgdGhpcy5wcmV2aW91c0JvYXJkU3RhdGVcbiAgICAgICAgKSAmJiBwcmV2ZW50TW92ZU1hdFtjdXJzb3JQb3NpdGlvblswXV1bY3Vyc29yUG9zaXRpb25bMV1dID09PSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gdmlzaWJsZUFyZWFbMF1bMF07IGkgPD0gdmlzaWJsZUFyZWFbMF1bMV07IGkrKykge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiYgaSA9PT0gMCkgfHxcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEgJiYgaSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGVkZ2VMaW5lV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNNb2JpbGVEZXZpY2UoKSAmJlxuICAgICAgICAgIGkgPT09IHRoaXMuY3Vyc29yUG9zaXRpb25bMF0gJiZcbiAgICAgICAgICB0aGlzLnRvdWNoTW92aW5nXG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBjdHgubGluZVdpZHRoICogdG91Y2hpbmdGYWN0b3I7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYWxsb3dNb3ZlID8gYWN0aXZlQ29sb3IgOiBpbmFjdGl2ZUNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGFjdGl2ZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdGFydFBvaW50WSA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNjYWxlZFBhZGRpbmcgKyB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlIC0gZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzFdWzBdICogc3BhY2U7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgc3RhcnRQb2ludFkgKz0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kUG9pbnRZID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc3BhY2UgKiB2aXNpYmxlQXJlYVsxXVsxXSArIHNjYWxlZFBhZGRpbmcgKyBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzcGFjZSAqIHZpc2libGVBcmVhWzFdWzFdICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICBlbmRQb2ludFkgLT0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPiAwKSBzdGFydFBvaW50WSAtPSBleHRlbmRTcGFjZTtcbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzFdWzFdIDwgYm9hcmRTaXplIC0gMSkgZW5kUG9pbnRZICs9IGV4dGVuZFNwYWNlO1xuICAgICAgICBjdHgubW92ZVRvKGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcsIHN0YXJ0UG9pbnRZKTtcbiAgICAgICAgY3R4LmxpbmVUbyhpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nLCBlbmRQb2ludFkpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSB2aXNpYmxlQXJlYVsxXVswXTsgaSA8PSB2aXNpYmxlQXJlYVsxXVsxXTsgaSsrKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCAmJiBpID09PSAwKSB8fFxuICAgICAgICAgICh2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSAmJiBpID09PSBib2FyZFNpemUgLSAxKVxuICAgICAgICApIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gZWRnZUxpbmVXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc01vYmlsZURldmljZSgpICYmXG4gICAgICAgICAgaSA9PT0gdGhpcy5jdXJzb3JQb3NpdGlvblsxXSAmJlxuICAgICAgICAgIHRoaXMudG91Y2hNb3ZpbmdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGN0eC5saW5lV2lkdGggKiB0b3VjaGluZ0ZhY3RvcjtcbiAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBhbGxvd01vdmUgPyBhY3RpdmVDb2xvciA6IGluYWN0aXZlQ29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYWN0aXZlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0YXJ0UG9pbnRYID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzBdWzBdICogc3BhY2UgLSBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzY2FsZWRQYWRkaW5nICsgdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZTtcbiAgICAgICAgbGV0IGVuZFBvaW50WCA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNwYWNlICogdmlzaWJsZUFyZWFbMF1bMV0gKyBzY2FsZWRQYWRkaW5nICsgZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc3BhY2UgKiB2aXNpYmxlQXJlYVswXVsxXSArIHNjYWxlZFBhZGRpbmc7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgc3RhcnRQb2ludFggKz0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgIGVuZFBvaW50WCAtPSBkcHIgLyAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzBdWzBdID4gMCkgc3RhcnRQb2ludFggLT0gZXh0ZW5kU3BhY2U7XG4gICAgICAgIGlmICh2aXNpYmxlQXJlYVswXVsxXSA8IGJvYXJkU2l6ZSAtIDEpIGVuZFBvaW50WCArPSBleHRlbmRTcGFjZTtcbiAgICAgICAgY3R4Lm1vdmVUbyhzdGFydFBvaW50WCwgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyk7XG4gICAgICAgIGN0eC5saW5lVG8oZW5kUG9pbnRYLCBpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3U3RhcnMgPSAoYm9hcmQgPSB0aGlzLmJvYXJkKSA9PiB7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYm9hcmRTaXplICE9PSAxOSkgcmV0dXJuO1xuXG4gICAgbGV0IHthZGFwdGl2ZVN0YXJTaXplfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCBzdGFyU2l6ZU9wdGlvbnMgPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoVGhlbWVQcm9wZXJ0eUtleS5TdGFyU2l6ZSk7XG5cbiAgICBjb25zdCB2aXNpYmxlQXJlYSA9IHRoaXMudmlzaWJsZUFyZWE7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBsZXQgc3RhclNpemUgPSBhZGFwdGl2ZVN0YXJTaXplID8gYm9hcmQud2lkdGggKiAwLjAwMzUgOiBzdGFyU2l6ZU9wdGlvbnM7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgWzMsIDksIDE1XS5mb3JFYWNoKGkgPT4ge1xuICAgICAgICBbMywgOSwgMTVdLmZvckVhY2goaiA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaSA+PSB2aXNpYmxlQXJlYVswXVswXSAmJlxuICAgICAgICAgICAgaSA8PSB2aXNpYmxlQXJlYVswXVsxXSAmJlxuICAgICAgICAgICAgaiA+PSB2aXNpYmxlQXJlYVsxXVswXSAmJlxuICAgICAgICAgICAgaiA8PSB2aXNpYmxlQXJlYVsxXVsxXVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmFyYyhcbiAgICAgICAgICAgICAgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyxcbiAgICAgICAgICAgICAgaiAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyxcbiAgICAgICAgICAgICAgc3RhclNpemUsXG4gICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgIDIgKiBNYXRoLlBJLFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBkcmF3Q29vcmRpbmF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7Ym9hcmQsIG9wdGlvbnMsIHZpc2libGVBcmVhfSA9IHRoaXM7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGNvbnN0IHtib2FyZFNpemUsIHpvb20sIHBhZGRpbmcsIHRoZW1lfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgYm9hcmRMaW5lRXh0ZW50ID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdib2FyZExpbmVFeHRlbnQnKTtcbiAgICBsZXQgem9vbWVkQm9hcmRTaXplID0gdmlzaWJsZUFyZWFbMF1bMV0gLSB2aXNpYmxlQXJlYVswXVswXSArIDE7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lQ29sb3InKTtcblxuICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke3NwYWNlIC8gM31weCBIZWx2ZXRpY2FgO1xuXG4gICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmNhbGNDZW50ZXIoKTtcbiAgICAgIGxldCBvZmZzZXQgPSBzcGFjZSAvIDEuNTtcblxuICAgICAgaWYgKFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5DZW50ZXIgJiZcbiAgICAgICAgdmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiZcbiAgICAgICAgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICkge1xuICAgICAgICBvZmZzZXQgLT0gc2NhbGVkUGFkZGluZyAvIDI7XG4gICAgICB9XG5cbiAgICAgIEExX0xFVFRFUlMuZm9yRWFjaCgobCwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgeCA9IHNwYWNlICogaW5kZXggKyBzY2FsZWRQYWRkaW5nO1xuICAgICAgICBsZXQgb2Zmc2V0VG9wID0gb2Zmc2V0O1xuICAgICAgICBsZXQgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0O1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wXG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldFRvcCAtPSBzcGFjZSAqIGJvYXJkTGluZUV4dGVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tXG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldEJvdHRvbSAtPSAoc3BhY2UgKiBib2FyZExpbmVFeHRlbnQpIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeTEgPSB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlICsgcGFkZGluZyAtIG9mZnNldFRvcDtcbiAgICAgICAgbGV0IHkyID0geTEgKyB6b29tZWRCb2FyZFNpemUgKiBzcGFjZSArIG9mZnNldEJvdHRvbSAqIDI7XG4gICAgICAgIGlmIChpbmRleCA+PSB2aXNpYmxlQXJlYVswXVswXSAmJiBpbmRleCA8PSB2aXNpYmxlQXJlYVswXVsxXSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbVJpZ2h0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLCB4LCB5MSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wTGVmdCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGwsIHgsIHkyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBBMV9OVU1CRVJTLnNsaWNlKC10aGlzLm9wdGlvbnMuYm9hcmRTaXplKS5mb3JFYWNoKChsOiBudW1iZXIsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHkgPSBzcGFjZSAqIGluZGV4ICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgbGV0IG9mZnNldExlZnQgPSBvZmZzZXQ7XG4gICAgICAgIGxldCBvZmZzZXRSaWdodCA9IG9mZnNldDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICBvZmZzZXRMZWZ0IC09IHNwYWNlICogYm9hcmRMaW5lRXh0ZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuUmlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2Zmc2V0UmlnaHQgLT0gKHNwYWNlICogYm9hcmRMaW5lRXh0ZW50KSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHgxID0gdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZSArIHBhZGRpbmcgLSBvZmZzZXRMZWZ0O1xuICAgICAgICBsZXQgeDIgPSB4MSArIHpvb21lZEJvYXJkU2l6ZSAqIHNwYWNlICsgMiAqIG9mZnNldFJpZ2h0O1xuICAgICAgICBpZiAoaW5kZXggPj0gdmlzaWJsZUFyZWFbMV1bMF0gJiYgaW5kZXggPD0gdmlzaWJsZUFyZWFbMV1bMV0pIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BSaWdodCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuQm90dG9tUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlJpZ2h0XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobC50b1N0cmluZygpLCB4MSwgeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkxlZnRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLnRvU3RyaW5nKCksIHgyLCB5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBjYWxjU3BhY2VBbmRQYWRkaW5nID0gKGNhbnZhcyA9IHRoaXMuY2FudmFzKSA9PiB7XG4gICAgbGV0IHNwYWNlID0gMDtcbiAgICBsZXQgc2NhbGVkUGFkZGluZyA9IDA7XG4gICAgbGV0IHNjYWxlZEJvYXJkRXh0ZW50ID0gMDtcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBjb25zdCB7cGFkZGluZywgYm9hcmRTaXplLCB6b29tfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGJvYXJkTGluZUV4dGVudCA9IHRoaXMuZ2V0VGhlbWVQcm9wZXJ0eSgnYm9hcmRMaW5lRXh0ZW50Jyk7XG4gICAgICBjb25zdCB7dmlzaWJsZUFyZWF9ID0gdGhpcztcblxuICAgICAgaWYgKFxuICAgICAgICAodmlzaWJsZUFyZWFbMF1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICh2aXNpYmxlQXJlYVsxXVswXSAhPT0gMCAmJiB2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICkge1xuICAgICAgICBzY2FsZWRCb2FyZEV4dGVudCA9IGJvYXJkTGluZUV4dGVudDtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgKHZpc2libGVBcmVhWzBdWzBdICE9PSAwICYmIHZpc2libGVBcmVhWzBdWzFdICE9PSBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAodmlzaWJsZUFyZWFbMV1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gIT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgICApIHtcbiAgICAgICAgc2NhbGVkQm9hcmRFeHRlbnQgPSBib2FyZExpbmVFeHRlbnQgKiAyO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkaXZpc29yID0gem9vbSA/IGJvYXJkU2l6ZSArIHNjYWxlZEJvYXJkRXh0ZW50IDogYm9hcmRTaXplO1xuICAgICAgc3BhY2UgPSAoY2FudmFzLndpZHRoIC0gcGFkZGluZyAqIDIpIC8gTWF0aC5jZWlsKGRpdmlzb3IpO1xuICAgICAgc2NhbGVkUGFkZGluZyA9IHBhZGRpbmcgKyBzcGFjZSAvIDI7XG4gICAgfVxuICAgIHJldHVybiB7c3BhY2UsIHNjYWxlZFBhZGRpbmcsIHNjYWxlZEJvYXJkRXh0ZW50fTtcbiAgfTtcblxuICBwbGF5RWZmZWN0ID0gKG1hdCA9IHRoaXMubWF0LCBlZmZlY3RNYXQgPSB0aGlzLmVmZmVjdE1hdCwgY2xlYXIgPSB0cnVlKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5lZmZlY3RDYW52YXM7XG5cbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoY2FudmFzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWZmZWN0TWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZWZmZWN0TWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBlZmZlY3RNYXRbaV1bal07XG4gICAgICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgICAgIGNvbnN0IGtpID0gbWF0W2ldW2pdO1xuICAgICAgICAgIGxldCBlZmZlY3Q7XG4gICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGNhc2UgRWZmZWN0LkJhbjoge1xuICAgICAgICAgICAgICAgIGVmZmVjdCA9IG5ldyBCYW5FZmZlY3QoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgICAgICAgIGVmZmVjdC5wbGF5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVmZmVjdE1hdFtpXVtqXSA9IEVmZmVjdC5Ob25lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qge2JvYXJkU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLnNldEVmZmVjdE1hdChlbXB0eShbYm9hcmRTaXplLCBib2FyZFNpemVdKSk7XG4gICAgfVxuICB9O1xuXG4gIGRyYXdDdXJzb3IgPSAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgdGhpcy5jbGVhckN1cnNvckNhbnZhcygpO1xuICAgICAgaWYgKHRoaXMuY3Vyc29yID09PSBDdXJzb3IuTm9uZSkgcmV0dXJuO1xuICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkgJiYgIXRoaXMudG91Y2hNb3ZpbmcpIHJldHVybjtcblxuICAgICAgY29uc3Qge3BhZGRpbmcsIHRoZW1lfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY29uc3Qge3NwYWNlfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgY29uc3Qge3Zpc2libGVBcmVhLCBjdXJzb3IsIGN1cnNvclZhbHVlfSA9IHRoaXM7XG5cbiAgICAgIGNvbnN0IFtpZHgsIGlkeV0gPSB0aGlzLmN1cnNvclBvc2l0aW9uO1xuICAgICAgaWYgKGlkeCA8IHZpc2libGVBcmVhWzBdWzBdIHx8IGlkeCA+IHZpc2libGVBcmVhWzBdWzFdKSByZXR1cm47XG4gICAgICBpZiAoaWR5IDwgdmlzaWJsZUFyZWFbMV1bMF0gfHwgaWR5ID4gdmlzaWJsZUFyZWFbMV1bMV0pIHJldHVybjtcbiAgICAgIGNvbnN0IHggPSBpZHggKiBzcGFjZSArIHNwYWNlIC8gMiArIHBhZGRpbmc7XG4gICAgICBjb25zdCB5ID0gaWR5ICogc3BhY2UgKyBzcGFjZSAvIDIgKyBwYWRkaW5nO1xuICAgICAgY29uc3Qga2kgPSB0aGlzLm1hdD8uW2lkeF0/LltpZHldIHx8IEtpLkVtcHR5O1xuXG4gICAgICBpZiAoY3R4KSB7XG4gICAgICAgIGxldCBjdXI7XG4gICAgICAgIGNvbnN0IHNpemUgPSBzcGFjZSAqIDAuODtcbiAgICAgICAgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLkNpcmNsZSkge1xuICAgICAgICAgIGN1ciA9IG5ldyBDaXJjbGVNYXJrdXAoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAga2ksXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5TcXVhcmUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgU3F1YXJlTWFya3VwKFxuICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHksXG4gICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuVHJpYW5nbGUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgVHJpYW5nbGVNYXJrdXAoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAga2ksXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5Dcm9zcykge1xuICAgICAgICAgIGN1ciA9IG5ldyBDcm9zc01hcmt1cChcbiAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5LFxuICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICBraSxcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICApO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLlRleHQpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgVGV4dE1hcmt1cChcbiAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5LFxuICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICBraSxcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCksXG4gICAgICAgICAgICBjdXJzb3JWYWx1ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkVtcHR5ICYmIGN1cnNvciA9PT0gQ3Vyc29yLkJsYWNrU3RvbmUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgRmxhdFN0b25lKGN0eCwgeCwgeSwgS2kuQmxhY2ssIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KCkpO1xuICAgICAgICAgIGN1ci5zZXRTaXplKHNpemUpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5FbXB0eSAmJiBjdXJzb3IgPT09IEN1cnNvci5XaGl0ZVN0b25lKSB7XG4gICAgICAgICAgY3VyID0gbmV3IEZsYXRTdG9uZShjdHgsIHgsIHksIEtpLldoaXRlLCB0aGlzLmNyZWF0ZVRoZW1lQ29udGV4dCgpKTtcbiAgICAgICAgICBjdXIuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC41KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5DbGVhcikge1xuICAgICAgICAgIGN1ciA9IG5ldyBGbGF0U3RvbmUoY3R4LCB4LCB5LCBLaS5FbXB0eSwgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKSk7XG4gICAgICAgICAgY3VyLnNldFNpemUoc2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VyPy5kcmF3KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRyYXdTdG9uZXMgPSAoXG4gICAgbWF0OiBudW1iZXJbXVtdID0gdGhpcy5tYXQsXG4gICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgY2xlYXIgPSB0cnVlXG4gICkgPT4ge1xuICAgIGNvbnN0IHt0aGVtZSA9IFRoZW1lLkJsYWNrQW5kV2hpdGUsIHRoZW1lUmVzb3VyY2VzfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoKTtcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICAgIHNldEltYWdlU21vb3RoaW5nUXVhbGl0eShjdHgpO1xuICAgICAgICAgICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICAgICAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgICAgICAgICBjb25zdCB5ID0gc2NhbGVkUGFkZGluZyArIGogKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLmdldFRoZW1lUHJvcGVydHkoJ3N0b25lUmF0aW8nKTtcbiAgICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5TdWJkdWVkICYmXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRmxhdCAmJlxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5XYXJtICYmXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLkRhcmsgJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuSGlnaENvbnRyYXN0XG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMztcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDM7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gdGhpcy5nZXRUaGVtZVByb3BlcnR5KCdzaGFkb3dDb2xvcicpO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gODtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDA7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAwO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgc3RvbmU7XG5cbiAgICAgICAgICAgICAgc3dpdGNoICh0aGVtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgVGhlbWUuQmxhY2tBbmRXaGl0ZTpcbiAgICAgICAgICAgICAgICBjYXNlIFRoZW1lLkZsYXQ6XG4gICAgICAgICAgICAgICAgY2FzZSBUaGVtZS5XYXJtOlxuICAgICAgICAgICAgICAgIGNhc2UgVGhlbWUuSGlnaENvbnRyYXN0OiB7XG4gICAgICAgICAgICAgICAgICBzdG9uZSA9IG5ldyBGbGF0U3RvbmUoXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhlbWVDb250ZXh0KClcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBzdG9uZS5zZXRTaXplKHNwYWNlICogcmF0aW8gKiAyKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFRoZW1lLkRhcms6IHtcbiAgICAgICAgICAgICAgICAgIHN0b25lID0gbmV3IEZsYXRTdG9uZShcbiAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIHN0b25lLnNldFNpemUoc3BhY2UgKiByYXRpbyAqIDIpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGJvYXJkUGl4ZWxTaXplID0gY2FudmFzPy53aWR0aCB8fCA1MTI7XG4gICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZXMgPSBnZXRUaGVtZVJlc291cmNlcyhcbiAgICAgICAgICAgICAgICAgICAgdGhlbWUsXG4gICAgICAgICAgICAgICAgICAgIHRoZW1lUmVzb3VyY2VzLFxuICAgICAgICAgICAgICAgICAgICBib2FyZFBpeGVsU2l6ZVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxhY2tzID0gcmVzb3VyY2VzLmJsYWNrcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgKGk6IHN0cmluZykgPT4gaW1hZ2VzW2ldXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHdoaXRlcyA9IHJlc291cmNlcy53aGl0ZXMubWFwKFxuICAgICAgICAgICAgICAgICAgICAgIChpOiBzdHJpbmcpID0+IGltYWdlc1tpXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2QgPSBpICsgMTAgKyBqO1xuICAgICAgICAgICAgICAgICAgICBzdG9uZSA9IG5ldyBJbWFnZVN0b25lKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgbW9kLFxuICAgICAgICAgICAgICAgICAgICAgIGJsYWNrcyxcbiAgICAgICAgICAgICAgICAgICAgICB3aGl0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGVtZUNvbnRleHQoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBzdG9uZS5zZXRTaXplKHNwYWNlICogcmF0aW8gKiAyKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RvbmU/LmRyYXcoKTtcbiAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiX19zcHJlYWRBcnJheSIsIl9fcmVhZCIsIl9fdmFsdWVzIiwiZmlsdGVyIiwiZmluZExhc3RJbmRleCIsIlRoZW1lUHJvcGVydHlLZXkiLCJLaSIsIlRoZW1lIiwiQW5hbHlzaXNQb2ludFRoZW1lIiwiQ2VudGVyIiwiRWZmZWN0IiwiTWFya3VwIiwiQ3Vyc29yIiwiUHJvYmxlbUFuc3dlclR5cGUiLCJQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kiLCJfYSIsIl9fZXh0ZW5kcyIsImNsb25lRGVlcCIsInJlcGxhY2UiLCJjb21wYWN0IiwiZmxhdHRlbkRlcHRoIiwic3VtIiwiY2xvbmUiLCJzYW1wbGUiLCJlbmNvZGUiLCJfX2Fzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUc7QUFDSCxTQUFTLFNBQVMsQ0FBSSxZQUEyQixFQUFFLEdBQVEsRUFBQTtBQUN6RCxJQUFBLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDdkIsSUFBQSxJQUFJLEdBQUcsSUFBSSxD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QUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7QUFDMUQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN4RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBR0QsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3pELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMzRCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDM0QsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDcEMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUN6RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN2RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1FBQ25DLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDtJQUNELE9BQU87UUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1FBQ3pELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztRQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsUUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsUUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0tBQ3BELENBQUM7QUFDSixFQUFFO0lBRVcsTUFBTSxHQUFHLFVBQUMsQ0FBUyxFQUFFLEtBQVMsRUFBRSxLQUFTLEVBQUE7QUFBcEIsSUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVMsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUFFLElBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFTLEdBQUEsQ0FBQSxDQUFBLEVBQUE7SUFDcEQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUQsRUFBRTtJQUVXLE1BQU0sR0FBRyxVQUFDLENBQVMsRUFBRSxLQUFTLEVBQUUsS0FBUyxFQUFBO0FBQXBCLElBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFTLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFBRSxJQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBUyxHQUFBLENBQUEsQ0FBQSxFQUFBO0lBQ3BELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hFLEVBQUU7QUFFVyxJQUFBLFlBQVksR0FBRyxVQUFDLENBQVEsRUFBRSxJQUFTLEVBQUE7O0lBQzlDLElBQU0sR0FBRyxHQUFHLENBQUEsRUFBQSxHQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLElBQUksQ0FBQyxVQUFDLENBQWEsRUFBQSxFQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUEsRUFBQSxDQUFDLENBQUM7SUFDNUUsT0FBTyxDQUFBLEdBQUcsS0FBQSxJQUFBLElBQUgsR0FBRyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFILEdBQUcsQ0FBRSxLQUFLLE1BQUssSUFBSSxDQUFDO0FBQzdCLEVBQUU7QUFFSyxJQUFNLFlBQVksR0FBRyxVQUFDLENBQVEsRUFBQTs7SUFDbkMsSUFBTSxDQUFDLEdBQUcsQ0FBQSxFQUFBLEdBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxJQUFJLENBQ3pDLFVBQUMsQ0FBcUIsRUFBQSxFQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUEsRUFBQSxDQUMzQyxDQUFDO0FBQ0YsSUFBQSxPQUFPLENBQUMsRUFBQyxDQUFDLEtBQUEsSUFBQSxJQUFELENBQUMsS0FBRCxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxDQUFDLENBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFDO0FBQ3ZDLEVBQUU7QUFFSyxJQUFNLFlBQVksR0FBRyxhQUFhO0FBRWxDLElBQU0sV0FBVyxHQUFHLFVBQUMsQ0FBUSxFQUFBOztJQUNsQyxJQUFNLENBQUMsR0FBRyxDQUFBLEVBQUEsR0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLG1CQUFtQixNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLElBQUksQ0FDekMsVUFBQyxDQUFxQixFQUFBLEVBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQSxFQUFBLENBQzNDLENBQUM7QUFDRixJQUFBLE9BQU8sQ0FBQyxLQUFBLElBQUEsSUFBRCxDQUFDLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEMsRUFBRTtBQUVLLElBQU0saUJBQWlCLEdBQUcsVUFBQyxDQUFRLEVBQUE7O0lBQ3hDLElBQU0sQ0FBQyxHQUFHLENBQUEsRUFBQSxHQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsSUFBSSxDQUN6QyxVQUFDLENBQXFCLEVBQUEsRUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFBLEVBQUEsQ0FDM0MsQ0FBQztBQUNGLElBQUEsT0FBTyxDQUFDLEtBQUEsSUFBQSxJQUFELENBQUMsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBRCxDQUFDLENBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0QyxFQUFFO0FBRUY7QUFDQTtBQUNBO0FBRU8sSUFBTSxXQUFXLEdBQUcsVUFBQyxDQUFRLEVBQUE7O0lBQ2xDLElBQU0sQ0FBQyxHQUFHLENBQUEsRUFBQSxHQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsSUFBSSxDQUN6QyxVQUFDLENBQXFCLEVBQUEsRUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFBLEVBQUEsQ0FDM0MsQ0FBQztBQUNGLElBQUEsT0FBTyxDQUFDLEVBQUMsQ0FBQyxLQUFBLElBQUEsSUFBRCxDQUFDLEtBQUQsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQyxDQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQztBQUN0QyxFQUFFO0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFTyxJQUFNLGdCQUFnQixHQUFHLFVBQUMsQ0FBUSxFQUFBO0lBQ3ZDLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixJQUFBLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBQSxDQUFDLEVBQUksRUFBQSxPQUFBLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBZCxFQUFjLENBQUMsQ0FBQztBQUN2RCxJQUFBLE9BQU8sQ0FBQSxjQUFjLEtBQUEsSUFBQSxJQUFkLGNBQWMsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBZCxjQUFjLENBQUUsS0FBSyxDQUFDLEVBQUUsTUFBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztBQUNqRCxFQUFFO0FBRUssSUFBTSxhQUFhLEdBQUcsVUFBQyxDQUFRLEVBQUE7O0lBQ3BDLElBQU0sQ0FBQyxHQUFHLENBQUEsRUFBQSxHQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsSUFBSSxDQUN6QyxVQUFDLENBQXFCLEVBQUEsRUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFBLEVBQUEsQ0FDM0MsQ0FBQztBQUNGLElBQUEsT0FBTyxDQUFDLEVBQUMsQ0FBQyxLQUFBLElBQUEsSUFBRCxDQUFDLEtBQUQsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQyxDQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUEsQ0FBQztBQUN4QyxFQUFFO0FBRUY7QUFDQTtBQUNBO0FBRU8sSUFBTSxXQUFXLEdBQUcsVUFBQyxDQUFRLEVBQUE7O0lBQ2xDLElBQU0sQ0FBQyxHQUFHLENBQUEsRUFBQSxHQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsSUFBSSxDQUN6QyxVQUFDLENBQXFCLEVBQUEsRUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFBLEVBQUEsQ0FDM0MsQ0FBQztBQUNGLElBQUEsT0FBTyxDQUFDLEVBQUMsQ0FBQyxLQUFBLElBQUEsSUFBRCxDQUFDLEtBQUQsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQyxDQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUEsSUFBSSxFQUFDLENBQUMsYUFBRCxDQUFDLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM5RSxFQUFFO0FBRUY7QUFDQTtBQUNBO0FBRU8sSUFBTSxNQUFNLEdBQUcsVUFDcEIsSUFBVyxFQUNYLGVBQXNDLEVBQ3RDLFFBQTRELEVBQzVELFFBQWtCLEVBQ2xCLFNBQW1CLEVBQUE7O0FBRm5CLElBQUEsSUFBQSxRQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLEdBQWtDYSw2QkFBcUIsQ0FBQyxJQUFJLENBQUEsRUFBQTtBQUk1RCxJQUFBLElBQU0sSUFBSSxHQUFHLFFBQVEsS0FBQSxJQUFBLElBQVIsUUFBUSxLQUFBLEtBQUEsQ0FBQSxHQUFSLFFBQVEsR0FBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEMsSUFBQSxJQUFNLGNBQWMsR0FDbEIsQ0FBQSxFQUFBLEdBQUEsU0FBUyxLQUFBLElBQUEsSUFBVCxTQUFTLEtBQVQsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsU0FBUyxDQUFFLE1BQU0sQ0FBQyxVQUFDLENBQVEsSUFBSyxPQUFBLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBbEIsRUFBa0IsQ0FBQyxNQUNuRCxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBUSxFQUFLLEVBQUEsT0FBQSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQWxCLEVBQWtCLENBQUMsQ0FBQztBQUM3QyxJQUFBLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFRLEVBQUssRUFBQSxPQUFBLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBbEIsRUFBa0IsQ0FBQyxDQUFDO0lBRXBFLFFBQVEsUUFBUTtRQUNkLEtBQUtBLDZCQUFxQixDQUFDLElBQUk7QUFDN0IsWUFBQSxPQUFPLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLEtBQUtBLDZCQUFxQixDQUFDLEdBQUc7QUFDNUIsWUFBQSxPQUFPLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLEtBQUtBLDZCQUFxQixDQUFDLElBQUk7WUFDN0IsT0FBTyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUMvRCxRQUFBO0FBQ0UsWUFBQSxPQUFPLEtBQUssQ0FBQztLQUNoQjtBQUNILEVBQUU7QUFFVyxJQUFBLFdBQVcsR0FBRyxVQUN6QixJQUFXLEVBQ1gsUUFBNEQsRUFDNUQsUUFBOEIsRUFDOUIsU0FBK0IsRUFBQTtBQUYvQixJQUFBLElBQUEsUUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsUUFBQSxHQUFrQ0EsNkJBQXFCLENBQUMsSUFBSSxDQUFBLEVBQUE7QUFJNUQsSUFBQSxPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbEUsRUFBRTtBQUVXLElBQUEsZ0JBQWdCLEdBQUcsVUFDOUIsSUFBVyxFQUNYLFFBQTRELEVBQzVELFFBQThCLEVBQzlCLFNBQStCLEVBQUE7QUFGL0IsSUFBQSxJQUFBLFFBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsR0FBa0NBLDZCQUFxQixDQUFDLElBQUksQ0FBQSxFQUFBO0FBSTVELElBQUEsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdkUsRUFBRTtBQUVXLElBQUEsc0JBQXNCLEdBQUcsVUFDcEMsSUFBVyxFQUNYLFFBQTJELEVBQzNELFFBQThCLEVBQzlCLFNBQStCLEVBQUE7QUFGL0IsSUFBQSxJQUFBLFFBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsR0FBa0NBLDZCQUFxQixDQUFDLEdBQUcsQ0FBQSxFQUFBO0FBSTNELElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7QUFBRSxRQUFBLE9BQU8sS0FBSyxDQUFDO0FBRXJDLElBQUEsSUFBTSxJQUFJLEdBQUcsUUFBUSxLQUFBLElBQUEsSUFBUixRQUFRLEtBQUEsS0FBQSxDQUFBLEdBQVIsUUFBUSxHQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN4QyxJQUFBLElBQU0sY0FBYyxHQUFHLFNBQVMsYUFBVCxTQUFTLEtBQUEsS0FBQSxDQUFBLEdBQVQsU0FBUyxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBTSxFQUFBLE9BQUEsSUFBSSxDQUFKLEVBQUksQ0FBQyxDQUFDO0lBRXpELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixRQUFRLFFBQVE7UUFDZCxLQUFLQSw2QkFBcUIsQ0FBQyxJQUFJO0FBQzdCLFlBQUEsTUFBTSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLEVBQUksRUFBQSxPQUFBLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQWhCLEVBQWdCLENBQUMsQ0FBQztZQUN0RCxNQUFNO1FBQ1IsS0FBS0EsNkJBQXFCLENBQUMsR0FBRztBQUM1QixZQUFBLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxFQUFJLEVBQUEsT0FBQSxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFoQixFQUFnQixDQUFDLENBQUM7WUFDNUMsTUFBTTtRQUNSLEtBQUtBLDZCQUFxQixDQUFDLElBQUk7WUFDN0IsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxFQUFJLEVBQUEsT0FBQSxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFBLEVBQUEsQ0FBQyxDQUFDO1lBQ25FLE1BQU07S0FDVDtBQUVELElBQUEsT0FBTyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUM3QixFQUFFO0FBRVcsSUFBQSxZQUFZLEdBQUcsVUFDMUIsSUFBVyxFQUNYLFFBQTRELEVBQzVELFFBQThCLEVBQzlCLFNBQStCLEVBQUE7QUFGL0IsSUFBQSxJQUFBLFFBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsR0FBa0NBLDZCQUFxQixDQUFDLElBQUksQ0FBQSxFQUFBO0FBSTVELElBQUEsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ25FLEVBQUU7QUFFSyxJQUFNLFlBQVksR0FBRyxhQUFhO0FBRTVCLElBQUEsYUFBYSxHQUFHLFVBQzNCLElBQVcsRUFDWCxRQUE0RCxFQUM1RCxRQUE4QixFQUM5QixTQUErQixFQUFBO0FBRi9CLElBQUEsSUFBQSxRQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLEdBQWtDQSw2QkFBcUIsQ0FBQyxJQUFJLENBQUEsRUFBQTtBQUk1RCxJQUFBLE9BQU8sTUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNwRSxFQUFFO0FBRVcsSUFBQSxXQUFXLEdBQUcsVUFDekIsSUFBVyxFQUNYLFFBQTRELEVBQzVELFFBQThCLEVBQzlCLFNBQStCLEVBQUE7QUFGL0IsSUFBQSxJQUFBLFFBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsR0FBa0NBLDZCQUFxQixDQUFDLElBQUksQ0FBQSxFQUFBO0FBSTVELElBQUEsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2xFLEVBQUU7QUFFVyxJQUFBLFVBQVUsR0FBRyxVQUFDLEdBQVcsRUFBRSxLQUFTLEVBQUE7QUFBVCxJQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBUyxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQy9DLElBQUEsSUFBTSxNQUFNLEdBQUc7QUFDYixRQUFBLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDO0FBQ3RCLFFBQUEsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUM7QUFDekIsUUFBQSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQztBQUN6QixRQUFBLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDO0FBQ3pCLFFBQUEsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUM7QUFDMUIsUUFBQSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQztBQUMxQixRQUFBLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDO0tBQzNCLENBQUM7SUFDRixJQUFNLEVBQUUsR0FBRywwQkFBMEIsQ0FBQztJQUN0QyxJQUFNLElBQUksR0FBRyxNQUFNO0FBQ2hCLFNBQUEsS0FBSyxFQUFFO0FBQ1AsU0FBQSxPQUFPLEVBQUU7U0FDVCxJQUFJLENBQUMsVUFBQSxJQUFJLEVBQUE7QUFDUixRQUFBLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDM0IsS0FBQyxDQUFDLENBQUM7QUFDTCxJQUFBLE9BQU8sSUFBSTtVQUNQLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU07VUFDakUsR0FBRyxDQUFDO0FBQ1YsRUFBRTtBQUVLLElBQU0sYUFBYSxHQUFHLFVBQUMsSUFBYSxFQUFBO0FBQ3pDLElBQUEsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxFQUFJLEVBQUEsT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBVixFQUFVLENBQUMsQ0FBQztBQUNuQyxFQUFFO0lBRVcsbUJBQW1CLEdBQUcsVUFDakMsSUFBYSxFQUNiLE9BQVcsRUFDWCxPQUFXLEVBQUE7QUFEWCxJQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBVyxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ1gsSUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQVcsR0FBQSxDQUFBLENBQUEsRUFBQTtJQUVYLElBQU0sS0FBSyxHQUFHLElBQUk7QUFDZixTQUFBLE1BQU0sQ0FBQyxVQUFBLENBQUMsRUFBSSxFQUFBLE9BQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxFQUFBLENBQUM7U0FDMUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxFQUFBO1FBQ0osT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFnQixFQUFBO0FBQzdDLFlBQUEsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQVMsRUFBQTtBQUNoQyxnQkFBQSxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUMxRCxnQkFBQSxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUMxRCxnQkFBQSxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQy9DLGdCQUFBLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLGFBQUMsQ0FBQyxDQUFDO0FBQ0wsU0FBQyxDQUFDLENBQUM7QUFDTCxLQUFDLENBQUMsQ0FBQztJQUNMLE9BQU9NLG1CQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25DLEVBQUU7SUFFVyxhQUFhLEdBQUcsVUFBQyxJQUFhLEVBQUUsT0FBVyxFQUFFLE9BQVcsRUFBQTtBQUF4QixJQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBVyxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQUUsSUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQVcsR0FBQSxDQUFBLENBQUEsRUFBQTtJQUNuRSxJQUFNLEtBQUssR0FBRyxJQUFJO0FBQ2YsU0FBQSxNQUFNLENBQUMsVUFBQSxDQUFDLEVBQUksRUFBQSxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsRUFBQSxDQUFDO1NBQ3pDLEdBQUcsQ0FBQyxVQUFBLENBQUMsRUFBQTtRQUNKLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ25FLFFBQUEsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3QixLQUFDLENBQUMsQ0FBQztBQUNMLElBQUEsT0FBTyxLQUFLLENBQUM7QUFDZixFQUFFO0FBRUssSUFBTSxvQkFBb0IsR0FBRyxVQUFDLENBQVcsRUFBQTtJQUM5QyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3hCLFFBQUEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEM7QUFDRCxJQUFBLE9BQU8sRUFBRSxDQUFDO0FBQ1osRUFBRTtBQUVLLElBQU0sVUFBVSxHQUFHLFVBQUMsSUFBVyxFQUFBO0lBQ3BDLE9BQU9DLFVBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBLEVBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFELEVBQUU7QUFFSyxJQUFNLFFBQVEsR0FBRyxVQUFDLEdBQVcsRUFBQTtBQUNsQyxJQUFBLElBQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25DLElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsSUFBSSxPQUFPLEVBQUU7QUFDWCxRQUFBLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsT0FBTyxFQUFDLENBQUMsRUFBQSxDQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsRUFBRSxFQUFBLEVBQUEsRUFBQyxDQUFDO0tBQ25CO0FBQ0QsSUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUM7QUFDL0IsRUFBRTtBQUVLLElBQU0sT0FBTyxHQUFHLFVBQUMsR0FBVyxFQUFBO0lBQzNCLElBQUEsRUFBQSxHQUFTLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBckIsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFpQixDQUFDO0lBQzdCLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QyxFQUFFO0FBRUssSUFBTSxPQUFPLEdBQUcsVUFBQyxJQUFZLEVBQUE7SUFDbEMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxJQUFBLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxJQUFBLE9BQU8sRUFBQyxDQUFDLEVBQUEsQ0FBQSxFQUFFLENBQUMsRUFBQSxDQUFBLEVBQUMsQ0FBQztBQUNoQixFQUFFO0FBRVcsSUFBQSxTQUFTLEdBQUcsVUFBQyxJQUFZLEVBQUUsU0FBYyxFQUFBO0FBQWQsSUFBQSxJQUFBLFNBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFNBQWMsR0FBQSxFQUFBLENBQUEsRUFBQTtJQUNwRCxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLElBQUEsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELElBQUEsT0FBTyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUMzQixFQUFFO0FBRVcsSUFBQSxTQUFTLEdBQUcsVUFBQyxHQUFRLEVBQUUsTUFBVSxFQUFBO0FBQVYsSUFBQSxJQUFBLE1BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE1BQVUsR0FBQSxDQUFBLENBQUEsRUFBQTtJQUM1QyxJQUFJLE1BQU0sS0FBSyxDQUFDO0FBQUUsUUFBQSxPQUFPLEdBQUcsQ0FBQztBQUM3QixJQUFBLElBQU0sR0FBRyxHQUFHQyxZQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsSUFBQSxJQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUN2RCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2RSxFQUFFO0FBRVcsSUFBQSxPQUFPLEdBQUcsVUFBQyxHQUFRLEVBQUUsSUFBVSxFQUFFLE9BQVcsRUFBRSxPQUFXLEVBQUE7QUFBcEMsSUFBQSxJQUFBLElBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLElBQVUsR0FBQSxHQUFBLENBQUEsRUFBQTtBQUFFLElBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxPQUFXLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFBRSxJQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBVyxHQUFBLENBQUEsQ0FBQSxFQUFBO0lBQ3BFLElBQUksR0FBRyxLQUFLLE1BQU07UUFBRSxPQUFPLEVBQUEsQ0FBQSxNQUFBLENBQUcsSUFBSSxFQUFBLElBQUEsQ0FBSSxDQUFDO0FBQ3ZDLElBQUEsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDakQsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUNyRSxJQUFBLElBQU0sR0FBRyxHQUFHLEVBQUcsQ0FBQSxNQUFBLENBQUEsSUFBSSxjQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQUcsQ0FBQztBQUM5RCxJQUFBLE9BQU8sR0FBRyxDQUFDO0FBQ2IsRUFBRTtJQUVXLFFBQVEsR0FBRyxVQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBVSxFQUFBO0FBQ3ZELElBQUEsSUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUEsSUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUEsSUFBSSxFQUFFLEtBQUtoQixVQUFFLENBQUMsS0FBSztBQUFFLFFBQUEsT0FBTyxFQUFFLENBQUM7QUFDL0IsSUFBQSxJQUFJLEVBQUUsS0FBS0EsVUFBRSxDQUFDLEtBQUs7QUFBRSxRQUFBLE9BQU8sSUFBSyxDQUFBLE1BQUEsQ0FBQSxFQUFFLENBQUcsQ0FBQSxNQUFBLENBQUEsRUFBRSxNQUFHLENBQUM7QUFDNUMsSUFBQSxJQUFJLEVBQUUsS0FBS0EsVUFBRSxDQUFDLEtBQUs7QUFBRSxRQUFBLE9BQU8sSUFBSyxDQUFBLE1BQUEsQ0FBQSxFQUFFLENBQUcsQ0FBQSxNQUFBLENBQUEsRUFBRSxNQUFHLENBQUM7QUFDNUMsSUFBQSxPQUFPLEVBQUUsQ0FBQztBQUNaLEVBQUU7SUFFVyxhQUFhLEdBQUcsVUFDM0IsR0FBZSxFQUNmLE9BQWdCLEVBQ2hCLE9BQWdCLEVBQUE7SUFFaEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLE9BQU8sR0FBRyxPQUFPLEtBQVAsSUFBQSxJQUFBLE9BQU8sY0FBUCxPQUFPLEdBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUEsT0FBTyxHQUFHLE9BQU8sS0FBUCxJQUFBLElBQUEsT0FBTyxLQUFQLEtBQUEsQ0FBQSxHQUFBLE9BQU8sR0FBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3JELElBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkMsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsWUFBQSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ2YsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztnQkFDbEMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNsQyxnQkFBQSxJQUFNLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7Z0JBQ3RDLE1BQU0sSUFBSSxVQUFHLEtBQUssRUFBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUksQ0FBQyxDQUFHLENBQUEsTUFBQSxDQUFBLENBQUMsTUFBRyxDQUFDO2FBQ2hDO1NBQ0Y7S0FDRjtBQUNELElBQUEsT0FBTyxNQUFNLENBQUM7QUFDaEIsRUFBRTtJQUVXLGlCQUFpQixHQUFHLFVBQy9CLEdBQWUsRUFDZixPQUFXLEVBQ1gsT0FBVyxFQUFBO0FBRFgsSUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQVcsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUNYLElBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxPQUFXLEdBQUEsQ0FBQSxDQUFBLEVBQUE7SUFFWCxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbkIsSUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuQyxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixZQUFBLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDZixJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO2dCQUNsQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ2xDLGdCQUFBLElBQU0sS0FBSyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztnQkFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5QjtTQUNGO0tBQ0Y7QUFDRCxJQUFBLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLEVBQUU7SUFFVyx3QkFBd0IsR0FBRyxVQUFDLElBQVMsRUFBQSxFQUFLLFFBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUF2QixHQUF5QjtBQUVuRSxJQUFBLGlCQUFpQixHQUFHLFVBQUMsS0FBVSxFQUFFLE1BQVUsRUFBQTtBQUFWLElBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFVLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDdEQsSUFBQSxJQUFJLEdBQUcsR0FBR2dCLFlBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixJQUFBLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBTSxFQUFLLEVBQUEsT0FBQSxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFwQixFQUFvQixDQUFDLENBQUM7QUFDaEQsSUFBQSxJQUFNLE1BQU0sR0FBRyxpQkFBQSxDQUFBLE1BQUEsQ0FDYixFQUFFLEdBQUcsTUFBTSxnSUFDZ0gsQ0FBQztJQUM5SCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxJQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFTLEVBQUUsS0FBVSxFQUFBO1FBQ2xDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUN2QixZQUFBLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtnQkFDbkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdEMsS0FBSyxJQUFJLENBQUMsQ0FBQzthQUNaO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3RDLEtBQUssSUFBSSxDQUFDLENBQUM7YUFDWjtTQUNGO1FBQ0QsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNkLEtBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxFQUFBLENBQUEsTUFBQSxDQUFHLE1BQU0sQ0FBQSxDQUFBLE1BQUEsQ0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFBLEdBQUEsQ0FBRyxDQUFDO0FBQ3RDLEVBQUU7SUFFVyxZQUFZLEdBQUcsVUFBQyxJQUFZLEVBQUUsRUFBTSxFQUFFLEVBQU0sRUFBQTtBQUFkLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxFQUFNLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFBRSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBTSxHQUFBLENBQUEsQ0FBQSxFQUFBO0lBQ3ZELElBQUksSUFBSSxLQUFLLE1BQU07QUFBRSxRQUFBLE9BQU8sSUFBSSxDQUFDOztBQUVqQyxJQUFBLElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzdDLElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7O0lBRWpFLE9BQU8sRUFBQSxDQUFBLE1BQUEsQ0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUcsQ0FBQSxNQUFBLENBQUEsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7QUFDaEQsRUFBRTtBQUVXLElBQUEsbUJBQW1CLEdBQUcsVUFDakMsSUFBWSxFQUNaLEdBQWUsRUFDZixRQUFrQixFQUNsQixTQUFjLEVBQUE7QUFBZCxJQUFBLElBQUEsU0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsU0FBYyxHQUFBLEVBQUEsQ0FBQSxFQUFBO0lBRWQsSUFBSSxJQUFJLEtBQUssTUFBTTtBQUFFLFFBQUEsT0FBTyxJQUFJLENBQUM7SUFDakMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsSUFBQSxFQUFBLEdBQVMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLEVBQXpELENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBcUQsQ0FBQztBQUNqRSxJQUFBLElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEUsT0FBTyxFQUFBLENBQUEsTUFBQSxDQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBRyxDQUFBLE1BQUEsQ0FBQSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQztBQUNoRCxFQUFFO0FBRVcsSUFBQSxpQkFBaUIsR0FBRyxVQUMvQixRQUEwQixFQUMxQixRQUFxQyxFQUNyQyxLQUFTLEVBQ1QsT0FBZSxFQUFBO0FBRGYsSUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVMsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUNULElBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxPQUFlLEdBQUEsS0FBQSxDQUFBLEVBQUE7QUFFZixJQUFBLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRO0FBQUUsUUFBQSxPQUFPLEVBQUUsQ0FBQztJQUN0QyxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLElBQUEsSUFBSSxPQUFPO1FBQUUsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQzVCLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFeEMsSUFBQSxPQUFPLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBQSxDQUFBLE1BQUEsQ0FBSSxVQUFVLENBQUUsR0FBRyxFQUFHLENBQUEsTUFBQSxDQUFBLFVBQVUsQ0FBRSxDQUFDO0FBQ3hELEVBQUU7QUFFVyxJQUFBLG1CQUFtQixHQUFHLFVBQ2pDLFFBQTBCLEVBQzFCLFFBQXFDLEVBQ3JDLEtBQVMsRUFDVCxPQUFlLEVBQUE7QUFEZixJQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBUyxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ1QsSUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQWUsR0FBQSxLQUFBLENBQUEsRUFBQTtBQUVmLElBQUEsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVE7QUFBRSxRQUFBLE9BQU8sRUFBRSxDQUFDO0lBQ3RDLElBQUksT0FBTyxHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEQsSUFBQSxJQUFJLE9BQU87UUFBRSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDaEMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUU1QyxJQUFBLE9BQU8sT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFBLENBQUEsTUFBQSxDQUFJLFlBQVksRUFBQSxHQUFBLENBQUcsR0FBRyxFQUFHLENBQUEsTUFBQSxDQUFBLFlBQVksTUFBRyxDQUFDO0FBQ2pFLEVBQUU7QUFFVyxJQUFBLGFBQWEsR0FBRyxVQUMzQixRQUFrQixFQUNsQixRQUE2QixFQUFBO0FBRTdCLElBQUEsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3JELElBQU0sS0FBSyxHQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztBQUU3RSxJQUFBLE9BQU8sS0FBSyxDQUFDO0FBQ2YsRUFBRTtBQUVXLElBQUEsZUFBZSxHQUFHLFVBQzdCLFFBQWtCLEVBQ2xCLFFBQTZCLEVBQUE7QUFFN0IsSUFBQSxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDckQsSUFBTSxLQUFLLEdBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUNyRSxRQUFBLElBQUksQ0FBQztBQUVQLElBQUEsT0FBTyxLQUFLLENBQUM7QUFDZixFQUFFO0FBRVcsSUFBQSxzQkFBc0IsR0FBRyxVQUNwQyxRQUFrQixFQUNsQixRQUFrQixFQUFBO0lBRVgsSUFBQSxLQUFLLEdBQVcsUUFBUSxDQUFBLEtBQW5CLEVBQUUsS0FBSyxHQUFJLFFBQVEsQ0FBQSxLQUFaLENBQWE7SUFDaEMsSUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxJQUFJLFVBQVUsR0FBRywwQkFBMEIsQ0FBQztJQUM1QyxJQUNFLEtBQUssSUFBSSxHQUFHO0FBQ1osU0FBQyxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQzNDLFFBQUEsS0FBSyxLQUFLLENBQUM7UUFDWCxLQUFLLElBQUksQ0FBQyxFQUNWO1FBQ0EsVUFBVSxHQUFHLGVBQWUsQ0FBQztLQUM5QjtTQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzNFLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztLQUMvQjtTQUFNLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDckMsVUFBVSxHQUFHLFVBQVUsQ0FBQztLQUN6QjtTQUFNO1FBQ0wsVUFBVSxHQUFHLGFBQWEsQ0FBQztLQUM1QjtBQUNELElBQUEsT0FBTyxVQUFVLENBQUM7QUFDcEIsRUFBRTtBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVPLElBQU0sVUFBVSxHQUFHLFVBQUMsQ0FBUSxFQUFBO0lBQ2pDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQWEsRUFBSyxFQUFBLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUEsRUFBQSxDQUFDLENBQUM7QUFDM0UsSUFBQSxJQUFJLENBQUMsR0FBRztRQUFFLE9BQU87SUFDakIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFbkMsSUFBQSxPQUFPLElBQUksQ0FBQztBQUNkLEVBQUU7QUFFSyxJQUFNLGlCQUFpQixHQUFHLFVBQUMsQ0FBUSxFQUFBO0lBQ3hDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQWEsRUFBSyxFQUFBLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUEsRUFBQSxDQUFDLENBQUM7QUFDM0UsSUFBQSxPQUFPLEdBQUcsS0FBSCxJQUFBLElBQUEsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSyxDQUFDO0FBQ3BCLEVBQUU7QUFFSyxJQUFNLFNBQVMsR0FBRyxVQUFDLENBQVEsRUFBQTtJQUNoQyxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFhLEVBQUssRUFBQSxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFBLEVBQUEsQ0FBQyxDQUFDO0FBQ3pFLElBQUEsSUFBSSxDQUFDLEVBQUU7UUFBRSxPQUFPO0lBQ2hCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRWxDLElBQUEsT0FBTyxJQUFJLENBQUM7QUFDZCxFQUFFO0FBRVcsSUFBQSxZQUFZLEdBQUcsVUFBQyxHQUFXLEVBQUUsTUFBZSxFQUFBO0lBQ3ZELE9BQU87QUFDTCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULE1BQU0sRUFBRSxNQUFNLElBQUksQ0FBQztBQUNuQixRQUFBLFNBQVMsRUFBRSxFQUFFO0FBQ2IsUUFBQSxTQUFTLEVBQUUsRUFBRTtBQUNiLFFBQUEsVUFBVSxFQUFFLEVBQUU7QUFDZCxRQUFBLFdBQVcsRUFBRSxFQUFFO0FBQ2YsUUFBQSxhQUFhLEVBQUUsRUFBRTtBQUNqQixRQUFBLG1CQUFtQixFQUFFLEVBQUU7QUFDdkIsUUFBQSxtQkFBbUIsRUFBRSxFQUFFO0FBQ3ZCLFFBQUEsV0FBVyxFQUFFLEVBQUU7S0FDaEIsQ0FBQztBQUNKLEVBQUU7QUFFRjs7Ozs7QUFLRztBQUNJLElBQU0sZUFBZSxHQUFHLFVBQzdCLFNBT0MsRUFBQTtBQVBELElBQUEsSUFBQSxTQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxTQUFBLEdBQUE7UUFDRSxPQUFPO1FBQ1AsT0FBTztRQUNQLFdBQVc7UUFDWCxtQkFBbUI7UUFDbkIsUUFBUTtRQUNSLE9BQU87QUFDUixLQUFBLENBQUEsRUFBQTtBQUVELElBQUEsSUFBTSxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUM3QixJQUFBLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7O0FBRXRCLFFBQUEsRUFBRSxFQUFFLEVBQUU7QUFDTixRQUFBLElBQUksRUFBRSxFQUFFO0FBQ1IsUUFBQSxLQUFLLEVBQUUsQ0FBQztBQUNSLFFBQUEsTUFBTSxFQUFFLENBQUM7QUFDVCxRQUFBLFNBQVMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxFQUFBLEVBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUEsQ0FBQztBQUMvQyxRQUFBLFNBQVMsRUFBRSxFQUFFO0FBQ2IsUUFBQSxVQUFVLEVBQUUsRUFBRTtBQUNkLFFBQUEsV0FBVyxFQUFFLEVBQUU7QUFDZixRQUFBLGFBQWEsRUFBRSxFQUFFO0FBQ2pCLFFBQUEsbUJBQW1CLEVBQUUsRUFBRTtBQUN2QixRQUFBLG1CQUFtQixFQUFFLEVBQUU7QUFDdkIsUUFBQSxXQUFXLEVBQUUsRUFBRTtBQUNoQixLQUFBLENBQUMsQ0FBQztBQUNILElBQUEsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLElBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBRXJCLElBQUEsT0FBTyxJQUFJLENBQUM7QUFDZCxFQUFFO0FBRUY7Ozs7Ozs7QUFPRztJQUNVLGFBQWEsR0FBRyxVQUMzQixJQUFZLEVBQ1osVUFBa0IsRUFDbEIsS0FBc0IsRUFBQTtBQUV0QixJQUFBLElBQU0sSUFBSSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7SUFDN0IsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM5QyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDZixJQUFBLElBQUksVUFBVTtBQUFFLFFBQUEsTUFBTSxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkQsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1QyxJQUFBLFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVoQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxtQ0FDbEIsUUFBUSxDQUFBLEVBQ1IsS0FBSyxDQUFBLENBQ1IsQ0FBQztBQUNILElBQUEsT0FBTyxJQUFJLENBQUM7QUFDZCxFQUFFO0FBRUssSUFBTSxZQUFZLEdBQUcsVUFBQyxJQUFXLEVBQUE7SUFDdEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksRUFBQTs7UUFFWixRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUEsT0FBTyxJQUFJLENBQUM7QUFDZCxLQUFDLENBQUMsQ0FBQztBQUNILElBQUEsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUM5QixFQUFFO0FBRVcsSUFBQSxZQUFZLEdBQUcsVUFBQyxJQUFXLEVBQUUsVUFBb0IsRUFBQTtBQUM1RCxJQUFBLElBQUksSUFBSSxHQUFHTCxnQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLElBQUEsT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDdEUsUUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixRQUFBLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0tBQ3BCO0lBRUQsSUFBSSxVQUFVLEVBQUU7QUFDZCxRQUFBLE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDNUMsWUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjtLQUNGO0FBRUQsSUFBQSxPQUFPLElBQUksQ0FBQztBQUNkLEVBQUU7QUFFSyxJQUFNLE9BQU8sR0FBRyxVQUFDLElBQVcsRUFBQTtJQUNqQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsSUFBQSxPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQzVDLFFBQUEsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDcEI7QUFDRCxJQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsRUFBRTtBQUVLLElBQU0sS0FBSyxHQUFHLFVBQUMsSUFBc0IsRUFBQTtBQUMxQyxJQUFBLE9BQUEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFNLEVBQUEsT0FBQSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUEsRUFBQSxDQUFDLENBQUE7QUFBaEUsRUFBaUU7QUFFNUQsSUFBTSxLQUFLLEdBQUcsVUFBQyxJQUFzQixFQUFBO0FBQzFDLElBQUEsT0FBQSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQU0sRUFBQSxPQUFBLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQSxFQUFBLENBQUMsQ0FBQTtBQUFsRSxFQUFtRTtBQUV4RCxJQUFBLFFBQVEsR0FBRyxVQUFDLEdBQWUsRUFBRSxTQUFjLEVBQUE7QUFBZCxJQUFBLElBQUEsU0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsU0FBYyxHQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQ3RELElBQUEsSUFBSSxRQUFRLEdBQVcsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNyQyxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsSUFBQSxJQUFJLE9BQU8sR0FBVyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixJQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLFlBQUEsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO2dCQUNmLElBQUksUUFBUSxHQUFHLENBQUM7b0JBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxTQUFTLEdBQUcsQ0FBQztvQkFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLE9BQU8sR0FBRyxDQUFDO29CQUFFLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQzdCLElBQUksVUFBVSxHQUFHLENBQUM7b0JBQUUsVUFBVSxHQUFHLENBQUMsQ0FBQzthQUNwQztTQUNGO0tBQ0Y7QUFDRCxJQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUEsUUFBQSxFQUFFLFNBQVMsRUFBQSxTQUFBLEVBQUUsT0FBTyxFQUFBLE9BQUEsRUFBRSxVQUFVLEVBQUEsVUFBQSxFQUFDLENBQUM7QUFDcEQsRUFBRTtBQUVXLElBQUEsVUFBVSxHQUFHLFVBQUMsR0FBZSxFQUFFLFNBQWMsRUFBQTtBQUFkLElBQUEsSUFBQSxTQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxTQUFjLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFDbEQsSUFBQSxJQUFBLEtBQTZDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQXBFLFFBQVEsY0FBQSxFQUFFLFNBQVMsZUFBQSxFQUFFLE9BQU8sYUFBQSxFQUFFLFVBQVUsZ0JBQTRCLENBQUM7SUFDNUUsSUFBTSxHQUFHLEdBQUcsT0FBTyxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO0lBQ2pELElBQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxTQUFTLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNsRCxJQUFJLEdBQUcsSUFBSSxJQUFJO1FBQUUsT0FBT1IsY0FBTSxDQUFDLE9BQU8sQ0FBQztJQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUk7UUFBRSxPQUFPQSxjQUFNLENBQUMsVUFBVSxDQUFDO0lBQzNDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU9BLGNBQU0sQ0FBQyxRQUFRLENBQUM7QUFDekMsSUFBQSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU9BLGNBQU0sQ0FBQyxXQUFXLENBQUM7SUFDN0MsT0FBT0EsY0FBTSxDQUFDLE1BQU0sQ0FBQztBQUN2QixFQUFFO0lBRVcsYUFBYSxHQUFHLFVBQzNCLEdBQWUsRUFDZixTQUFjLEVBQ2QsTUFBVSxFQUFBO0FBRFYsSUFBQSxJQUFBLFNBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFNBQWMsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUNkLElBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFVLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFFVixJQUFBLElBQU0sTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLElBQUEsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLElBQUEsSUFBQSxLQUE2QyxRQUFRLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxFQUFwRSxRQUFRLGNBQUEsRUFBRSxTQUFTLGVBQUEsRUFBRSxPQUFPLGFBQUEsRUFBRSxVQUFVLGdCQUE0QixDQUFDO0FBQzVFLElBQUEsSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxPQUFPLEVBQUU7UUFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUNyQztBQUNELElBQUEsSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxRQUFRLEVBQUU7UUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUNyQztBQUNELElBQUEsSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxVQUFVLEVBQUU7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQztLQUMxQztBQUNELElBQUEsSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxXQUFXLEVBQUU7UUFDakMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQztLQUMxQztBQUNELElBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNDLElBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRTNDLElBQUEsT0FBTyxNQUFNLENBQUM7QUFDaEIsRUFBRTtJQUVXLGVBQWUsR0FBRyxVQUM3QixHQUFlLEVBQ2YsTUFBVSxFQUNWLFNBQWMsRUFBQTtBQURkLElBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFVLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDVixJQUFBLElBQUEsU0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsU0FBYyxHQUFBLEVBQUEsQ0FBQSxFQUFBO0FBRVIsSUFBQSxJQUFBLEtBQTZDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBekQsUUFBUSxHQUFBLEVBQUEsQ0FBQSxRQUFBLEVBQUUsU0FBUyxlQUFBLEVBQUUsT0FBTyxhQUFBLEVBQUUsVUFBVSxnQkFBaUIsQ0FBQztBQUVqRSxJQUFBLElBQU0sSUFBSSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDM0IsSUFBQSxJQUFNLEVBQUUsR0FBRyxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUN6RCxJQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3ZELElBQUEsSUFBTSxFQUFFLEdBQUcsU0FBUyxHQUFHLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDakUsSUFBQSxJQUFNLEVBQUUsR0FBRyxVQUFVLEdBQUcsTUFBTSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsVUFBVSxHQUFHLE1BQU0sQ0FBQztJQUVuRSxPQUFPO1FBQ0wsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ1IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0tBQ1QsQ0FBQztBQUNKLEVBQUU7QUFFVyxJQUFBLGdDQUFnQyxHQUFHLFVBQzlDLFdBQWlELEVBQ2pELFNBQWMsRUFBQTs7QUFBZCxJQUFBLElBQUEsU0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsU0FBYyxHQUFBLEVBQUEsQ0FBQSxFQUFBO0lBRWQsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBRXRCLElBQUEsRUFBQSxHQUFBUixhQUF1QixXQUFXLEVBQUEsQ0FBQSxDQUFBLEVBQWpDLEVBQUEsR0FBQUEsWUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQVEsRUFBUCxFQUFFLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFFLEVBQUUsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUcsS0FBQUEsWUFBUSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBUCxFQUFFLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFFLEVBQUUsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFnQixDQUFDOztBQUV6QyxRQUFBLEtBQWtCLElBQUEsRUFBQSxHQUFBQyxjQUFBLENBQUEsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsRUFBQSw0QkFBRTtBQUE3QyxZQUFBLElBQU0sR0FBRyxHQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUE7O0FBQ1osZ0JBQUEsS0FBa0IsSUFBQSxFQUFBLElBQUEsR0FBQSxHQUFBLEtBQUEsQ0FBQSxFQUFBQSxjQUFBLENBQUEsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsRUFBQSw0QkFBRTtBQUEzQyxvQkFBQSxJQUFNLEdBQUcsR0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBO29CQUNaLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2xDLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFbEMsb0JBQUEsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO3dCQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUEsQ0FBQSxNQUFBLENBQUcsR0FBRyxDQUFHLENBQUEsTUFBQSxDQUFBLEdBQUcsQ0FBRSxDQUFDLENBQUM7cUJBQzdCO2lCQUNGOzs7Ozs7Ozs7U0FDRjs7Ozs7Ozs7O0FBRUQsSUFBQSxPQUFPLE1BQU0sQ0FBQztBQUNoQixFQUFFO0FBRUssSUFBTSxnQkFBZ0IsR0FBRyxVQUM5QixHQUFlLEVBQ2YsTUFBYyxFQUNkLFNBQWMsRUFDZCxJQUFVLEVBQ1YsSUFBbUIsRUFDbkIsRUFBVSxFQUFBO0FBSFYsSUFBQSxJQUFBLFNBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFNBQWMsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUNkLElBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxJQUFVLEdBQUEsR0FBQSxDQUFBLEVBQUE7QUFDVixJQUFBLElBQUEsSUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsSUFBQSxHQUFXSSxVQUFFLENBQUMsS0FBSyxDQUFBLEVBQUE7QUFHbkIsSUFBQSxJQUFNLE1BQU0sR0FBR1csZ0JBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixJQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM1RCxJQUFBLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixJQUFNLFNBQVMsR0FBRyxVQUFDLEdBQWUsRUFBQTtBQUMxQixRQUFBLElBQUEsRUFBQSxHQUFBaEIsWUFBQSxDQUFXLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQSxDQUFBLENBQUEsRUFBeEIsRUFBRSxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBRSxFQUFFLFFBQWtCLENBQUM7QUFDMUIsUUFBQSxJQUFBLEVBQUEsR0FBQUEsWUFBQSxDQUFXLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQSxDQUFBLENBQUEsRUFBeEIsRUFBRSxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBRSxFQUFFLFFBQWtCLENBQUM7QUFDaEMsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdCLFlBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM3QixnQkFBQSxJQUNFLE1BQU0sS0FBS1EsY0FBTSxDQUFDLE9BQU87cUJBQ3hCLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUM7eUJBQzVCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDL0IseUJBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUNsQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUN0QjtvQkFDQSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUNsQjtBQUFNLHFCQUFBLElBQ0wsTUFBTSxLQUFLQSxjQUFNLENBQUMsUUFBUTtxQkFDekIsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDO3lCQUNoQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO3lCQUM5QixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO3lCQUM5QixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUN0QjtvQkFDQSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUNsQjtBQUFNLHFCQUFBLElBQ0wsTUFBTSxLQUFLQSxjQUFNLENBQUMsVUFBVTtxQkFDM0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQztBQUM3Qix5QkFBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIseUJBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLHlCQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUNsQztvQkFDQSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUNsQjtBQUFNLHFCQUFBLElBQ0wsTUFBTSxLQUFLQSxjQUFNLENBQUMsV0FBVztxQkFDNUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2pCLHlCQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDbEIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUMvQix5QkFBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFDbEM7b0JBQ0EsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDbEI7QUFBTSxxQkFBQSxJQUFJLE1BQU0sS0FBS0EsY0FBTSxDQUFDLE1BQU0sRUFBRTtvQkFDbkMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDbEI7YUFDRjtTQUNGO0FBQ0gsS0FBQyxDQUFDO0lBQ0YsSUFBTSxVQUFVLEdBQUcsVUFBQyxHQUFlLEVBQUE7UUFDakMsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQUEsSUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztBQUMxQixRQUFBLElBQUEsRUFBQSxHQUFBUixZQUFBLENBQVcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFBLENBQUEsQ0FBQSxFQUF4QixFQUFFLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFFLEVBQUUsUUFBa0IsQ0FBQztBQUMxQixRQUFBLElBQUEsRUFBQSxHQUFBQSxZQUFBLENBQVcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFBLENBQUEsQ0FBQSxFQUF4QixFQUFFLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFFLEVBQUUsUUFBa0IsQ0FBQzs7O0FBR2hDLFFBQUEsSUFBTSxhQUFhLEdBQUcsSUFBSSxLQUFLSyxVQUFFLENBQUMsS0FBSyxDQUFDO0FBQ3hDLFFBQUEsSUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFBLElBQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7Ozs7O1FBS3RCLElBQU0sV0FBVyxHQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxXQUFXLEdBQUcsWUFBWSxDQUFDOzs7UUFLckUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xDLFlBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsQyxnQkFBQSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUU7QUFDeEMsb0JBQUEsS0FBSyxFQUFFLENBQUM7QUFDUixvQkFBQSxJQUFJLEVBQUUsR0FBR0EsVUFBRSxDQUFDLEtBQUssQ0FBQztBQUNsQixvQkFBQSxJQUFJLE1BQU0sS0FBS0csY0FBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxVQUFVLEVBQUU7QUFDN0Qsd0JBQUEsRUFBRSxHQUFHLGFBQWEsS0FBSyxLQUFLLElBQUksV0FBVyxHQUFHSCxVQUFFLENBQUMsS0FBSyxHQUFHQSxVQUFFLENBQUMsS0FBSyxDQUFDO3FCQUNuRTtBQUFNLHlCQUFBLElBQ0wsTUFBTSxLQUFLRyxjQUFNLENBQUMsUUFBUTtBQUMxQix3QkFBQSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxXQUFXLEVBQzdCO0FBQ0Esd0JBQUEsRUFBRSxHQUFHLGFBQWEsS0FBSyxLQUFLLElBQUksV0FBVyxHQUFHSCxVQUFFLENBQUMsS0FBSyxHQUFHQSxVQUFFLENBQUMsS0FBSyxDQUFDO3FCQUNuRTtvQkFDRCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFNBQVMsRUFBRTtBQUNsRSx3QkFBQSxFQUFFLEdBQUdBLFVBQUUsQ0FBQyxLQUFLLENBQUM7cUJBQ2Y7b0JBRUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztpQkFDaEI7YUFDRjtTQUNGO0FBQ0gsS0FBQyxDQUFDO0lBSUYsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xCLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBDbkIsSUFBQSxPQUFPLE1BQU0sQ0FBQztBQUNoQixFQUFFO0FBRUssSUFBTSxVQUFVLEdBQUcsVUFBQyxHQUFlLEVBQUE7QUFDeEMsSUFBQSxJQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsSUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixJQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLElBQUEsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRS9CLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLFFBQVEsTUFBTTtBQUNaLFFBQUEsS0FBS0csY0FBTSxDQUFDLE9BQU8sRUFBRTtZQUNuQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNULE1BQU07U0FDUDtBQUNELFFBQUEsS0FBS0EsY0FBTSxDQUFDLFFBQVEsRUFBRTtZQUNwQixHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDVixHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ1QsTUFBTTtTQUNQO0FBQ0QsUUFBQSxLQUFLQSxjQUFNLENBQUMsVUFBVSxFQUFFO1lBQ3RCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDUixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsTUFBTTtTQUNQO0FBQ0QsUUFBQSxLQUFLQSxjQUFNLENBQUMsV0FBVyxFQUFFO1lBQ3ZCLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNWLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDUixNQUFNO1NBQ1A7S0FDRjtJQUNELE9BQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztBQUMxQixFQUFFO0FBRVcsSUFBQSxhQUFhLEdBQUcsVUFDM0IsR0FBZSxFQUNmLEVBQU8sRUFDUCxFQUFPLEVBQ1AsU0FBYyxFQUFBO0FBRmQsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEVBQU8sR0FBQSxFQUFBLENBQUEsRUFBQTtBQUNQLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxFQUFPLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFDUCxJQUFBLElBQUEsU0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsU0FBYyxHQUFBLEVBQUEsQ0FBQSxFQUFBO0FBRWQsSUFBQSxJQUFNLEVBQUUsR0FBRyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUEsSUFBTSxFQUFFLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFBLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUUvQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixRQUFRLE1BQU07QUFDWixRQUFBLEtBQUtBLGNBQU0sQ0FBQyxPQUFPLEVBQUU7WUFDbkIsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNSLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNWLE1BQU07U0FDUDtBQUNELFFBQUEsS0FBS0EsY0FBTSxDQUFDLFFBQVEsRUFBRTtZQUNwQixHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ1QsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ1YsTUFBTTtTQUNQO0FBQ0QsUUFBQSxLQUFLQSxjQUFNLENBQUMsVUFBVSxFQUFFO1lBQ3RCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDUixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsTUFBTTtTQUNQO0FBQ0QsUUFBQSxLQUFLQSxjQUFNLENBQUMsV0FBVyxFQUFFO1lBQ3ZCLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDVCxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsTUFBTTtTQUNQO0tBQ0Y7SUFDRCxPQUFPLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUM7QUFDMUIsRUFBRTtTQUVjLGVBQWUsQ0FDN0IsR0FBaUMsRUFDakMsTUFBYyxFQUNkLGNBQXNCLEVBQUE7SUFGdEIsSUFBQSxHQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFrQixLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQSxFQUFBO0FBRWpDLElBQUEsSUFBQSxjQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxjQUFzQixHQUFBLEtBQUEsQ0FBQSxFQUFBO0FBRXRCLElBQUEsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzNCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUVqQixJQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNuQixLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNkLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM5QjtTQUNGO0tBQ0Y7SUFFRCxJQUFJLEtBQUssRUFBRTtRQUNULE9BQU87QUFDTCxZQUFBLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZCLENBQUM7S0FDSDtJQUVELElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDbkIsUUFBQSxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RCxRQUFBLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkUsUUFBQSxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RCxRQUFBLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFFdEUsUUFBQSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUN2QixnQkFBZ0IsR0FBRyxnQkFBZ0IsRUFDbkMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQ3BDLENBQUM7UUFFRixNQUFNLEdBQUcsZ0JBQWdCLENBQUM7QUFDMUIsUUFBQSxNQUFNLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUUzQixRQUFBLElBQUksTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7QUFDeEIsWUFBQSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDeEIsWUFBQSxNQUFNLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztTQUM1QjtRQUVELE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztBQUMxQixRQUFBLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQzNCLElBQUksTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDM0IsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLFlBQUEsTUFBTSxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUM7U0FDNUI7S0FDRjtTQUFNO1FBQ0wsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztBQUN0QyxRQUFBLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztRQUNuRCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLFFBQUEsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQsT0FBTztRQUNMLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztRQUNoQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7S0FDakIsQ0FBQztBQUNKLENBQUM7QUFFSyxTQUFVLElBQUksQ0FBQyxHQUFlLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxFQUFVLEVBQUE7QUFDcEUsSUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFBRSxRQUFBLE9BQU8sR0FBRyxDQUFDO0FBQy9CLElBQUEsSUFBTSxNQUFNLEdBQUdRLGdCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNsQixPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7U0FFZSxNQUFNLENBQUMsR0FBZSxFQUFFLEtBQWUsRUFBRSxVQUFpQixFQUFBO0FBQWpCLElBQUEsSUFBQSxVQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxVQUFpQixHQUFBLElBQUEsQ0FBQSxFQUFBO0FBQ3hFLElBQUEsSUFBSSxNQUFNLEdBQUdBLGdCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLElBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsRUFBQTtBQUNULFFBQUEsSUFBQSxFQVFGLEdBQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQVBmLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUNELENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUNELEVBQUUsUUFLYSxDQUFDO1FBQ2xCLElBQUksVUFBVSxFQUFFO1lBQ2QsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbEIsZ0JBQUEsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QyxRQUFRLEdBQUcsSUFBSSxDQUFDO2FBQ2pCO1NBQ0Y7YUFBTTtZQUNMLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDbEIsUUFBUSxHQUFHLElBQUksQ0FBQztTQUNqQjtBQUNILEtBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTztBQUNMLFFBQUEsV0FBVyxFQUFFLE1BQU07QUFDbkIsUUFBQSxRQUFRLEVBQUEsUUFBQTtLQUNULENBQUM7QUFDSixDQUFDO0FBRUQ7QUFDTyxJQUFNLFVBQVUsR0FBRyxVQUN4QixHQUFlLEVBQ2YsQ0FBUyxFQUNULENBQVMsRUFDVCxJQUFRLEVBQ1IsV0FBa0IsRUFDbEIsV0FBb0QsRUFBQTtBQUVwRCxJQUFBLElBQUksSUFBSSxLQUFLWCxVQUFFLENBQUMsS0FBSztRQUFFLE9BQU87SUFDOUIsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7O1FBRTVCLElBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUMsUUFBQSxJQUFNLEtBQUssR0FBRyxJQUFJLEtBQUtBLFVBQUUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUM1QyxRQUFBLElBQU0sTUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUEsQ0FBQSxNQUFBLENBQUcsS0FBSyxFQUFJLEdBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFLLE1BQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDMUMsVUFBQyxDQUFRLEVBQUEsRUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLE1BQUksQ0FBQSxFQUFBLENBQ2xDLENBQUM7UUFDRixJQUFJLElBQUksU0FBTyxDQUFDO0FBQ2hCLFFBQUEsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN2QixZQUFBLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEI7YUFBTTtZQUNMLElBQUksR0FBRyxhQUFhLENBQUMsRUFBRyxDQUFBLE1BQUEsQ0FBQSxLQUFLLEVBQUksR0FBQSxDQUFBLENBQUEsTUFBQSxDQUFBLEtBQUssRUFBRyxHQUFBLENBQUEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN4RCxZQUFBLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7QUFDRCxRQUFBLElBQUksV0FBVztBQUFFLFlBQUEsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMxQztTQUFNO0FBQ0wsUUFBQSxJQUFJLFdBQVc7QUFBRSxZQUFBLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDbEQ7QUFDSCxFQUFFO0FBRUY7Ozs7QUFJRztBQUNVLElBQUEseUJBQXlCLEdBQUcsVUFDdkMsV0FBa0IsRUFDbEIsS0FBYSxFQUFBO0FBRWIsSUFBQSxJQUFNLElBQUksR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkMsSUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFBO0FBQ1IsUUFBQSxJQUFBLFVBQVUsR0FBSSxJQUFJLENBQUMsS0FBSyxXQUFkLENBQWU7UUFDaEMsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBWSxFQUFBLEVBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssR0FBQSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBTSxFQUFLLEVBQUEsT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQSxFQUFBLENBQUMsQ0FBQztTQUMxRTthQUFNO0FBQ0wsWUFBQSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBWSxFQUFBO0FBQzlCLGdCQUFBLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLEVBQUEsRUFBSSxPQUFBLENBQUMsS0FBSyxLQUFLLENBQVgsRUFBVyxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ2xELFVBQUMsQ0FBWSxFQUFLLEVBQUEsT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUEsRUFBQSxDQUN0QyxDQUFDO2lCQUNIO0FBQ0gsYUFBQyxDQUFDLENBQUM7U0FDSjtBQUNILEtBQUMsQ0FBQyxDQUFDO0FBQ0wsRUFBRTtBQUVGOzs7Ozs7Ozs7QUFTRztBQUNJLElBQU0scUJBQXFCLEdBQUcsVUFDbkMsV0FBa0IsRUFDbEIsR0FBZSxFQUNmLENBQVMsRUFDVCxDQUFTLEVBQ1QsRUFBTSxFQUFBO0lBRU4sSUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxJQUFBLElBQU0sS0FBSyxHQUFHLEVBQUUsS0FBS0EsVUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQzVDLElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUMsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ25CLElBQUEsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUtBLFVBQUUsQ0FBQyxLQUFLLEVBQUU7QUFDMUIsUUFBQSx5QkFBeUIsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDL0M7U0FBTTtRQUNMLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBT04sbUJBQUEsQ0FBQUEsbUJBQUEsQ0FBQSxFQUFBLEVBQUFDLFlBQUEsQ0FBQSxJQUFJLENBQUMsTUFBTSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsQ0FBRSxLQUFLLENBQUEsRUFBQSxLQUFBLENBQUMsQ0FBQztTQUN2QzthQUFNO1lBQ0wsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLDREQUN2QixXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBO0FBQy9CLGdCQUFBLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7cUJBQzVCLENBQUM7U0FDSDtRQUNELE1BQU0sR0FBRyxJQUFJLENBQUM7S0FDZjtBQUNELElBQUEsT0FBTyxNQUFNLENBQUM7QUFDaEIsRUFBRTtBQUVGOzs7Ozs7Ozs7O0FBVUc7QUFDSDtBQUNPLElBQU0sb0JBQW9CLEdBQUcsVUFDbEMsV0FBa0IsRUFDbEIsR0FBZSxFQUNmLENBQVMsRUFDVCxDQUFTLEVBQ1QsRUFBTSxFQUNOLGtCQUFzQyxFQUFBO0FBRXRDLElBQUEsSUFBSSxFQUFFLEtBQUtLLFVBQUUsQ0FBQyxLQUFLO1FBQUUsT0FBTztBQUM1QixJQUFBLElBQUksSUFBSSxDQUFDO0FBQ1QsSUFBQSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsRUFBRTtRQUM5QyxJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFFBQUEsSUFBTSxLQUFLLEdBQUcsRUFBRSxLQUFLQSxVQUFFLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDMUMsUUFBQSxJQUFNLE1BQUksR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFBLENBQUEsTUFBQSxDQUFHLEtBQUssRUFBSSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsS0FBSyxNQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQzFDLFVBQUMsQ0FBUSxFQUFBLEVBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxNQUFJLENBQUEsRUFBQSxDQUNsQyxDQUFDO0FBQ0YsUUFBQSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZCLFlBQUEsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQjthQUFNO1lBQ0wsSUFBSSxHQUFHLGFBQWEsQ0FBQyxFQUFHLENBQUEsTUFBQSxDQUFBLEtBQUssRUFBSSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsS0FBSyxFQUFHLEdBQUEsQ0FBQSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3hELFlBQUEsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtLQUNGO0FBQ0QsSUFBQSxPQUFPLElBQUksQ0FBQztBQUNkLEVBQUU7QUFFVyxJQUFBLGdDQUFnQyxHQUFHLFVBQzlDLElBQVcsRUFDWCxnQkFBcUIsRUFBQTtBQUFyQixJQUFBLElBQUEsZ0JBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLGdCQUFxQixHQUFBLEVBQUEsQ0FBQSxFQUFBO0FBRXJCLElBQUEsSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUM5RCxJQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RCxJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUUzQyxJQUFBLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFYLEVBQVcsQ0FBQyxDQUFDO0FBQzNDLElBQUEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDdEIsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVEsRUFBQTtZQUM3QixDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFXLEVBQUE7QUFDcEMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO29CQUM1QyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUMxQjtBQUNILGFBQUMsQ0FBQyxDQUFDO0FBQ0wsU0FBQyxDQUFDLENBQUM7S0FDSjtBQUNELElBQUEsT0FBTyxjQUFjLENBQUM7QUFDeEIsRUFBRTtBQUVXLElBQUEsa0JBQWtCLEdBQUcsVUFBQyxJQUFXLEVBQUUsZ0JBQXFCLEVBQUE7QUFBckIsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBcUIsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUNuRSxJQUFBLElBQUksQ0FBQyxJQUFJO1FBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDOUQsSUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDdEQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFM0MsSUFBSSxnQkFBZ0IsR0FBWSxFQUFFLENBQUM7QUFDbkMsSUFBQSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN0QixRQUFBLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBUSxFQUFLLEVBQUEsT0FBQSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBcEIsRUFBb0IsQ0FBQyxDQUFDO0tBQzdFO0FBRUQsSUFBQSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNyQixRQUFBLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFYLEVBQVcsQ0FBQyxDQUFDO0FBQzNDLFFBQUEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDdEIsWUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVEsRUFBQTtnQkFDN0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBVyxFQUFBO0FBQ3BDLG9CQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLG9CQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLG9CQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTt3QkFDNUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDMUI7QUFDSCxpQkFBQyxDQUFDLENBQUM7QUFDTCxhQUFDLENBQUMsQ0FBQztTQUNKO0tBQ0Y7QUFFRCxJQUFBLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVEsRUFBQTtRQUNoQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFXLEVBQUE7QUFDcEMsWUFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxZQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO2dCQUM1QyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzFCO0FBQ0gsU0FBQyxDQUFDLENBQUM7QUFDTCxLQUFDLENBQUMsQ0FBQztBQUVILElBQUEsT0FBTyxjQUFjLENBQUM7QUFDeEIsRUFBRTtBQUVGOzs7Ozs7QUFNRztBQUNVLElBQUEsb0JBQW9CLEdBQUcsVUFDbEMsSUFBVyxFQUNYLE1BQW1ELEVBQ25ELFdBQXVCLEVBQ3ZCLGdCQUFxQixFQUFBO0FBRnJCLElBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFtRCxHQUFBLFFBQUEsQ0FBQSxFQUFBO0FBQ25ELElBQUEsSUFBQSxXQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxXQUF1QixHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ3ZCLElBQUEsSUFBQSxnQkFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsZ0JBQXFCLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFFckIsSUFBQSxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixJQUFBLEdBQUcsR0FBWSxHQUFHLENBQUEsR0FBZixFQUFFLE1BQU0sR0FBSSxHQUFHLENBQUEsTUFBUCxDQUFRO0lBQzFCLElBQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRXRELElBQUEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDdEIsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVEsRUFBQTtZQUM3QixDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFXLEVBQUE7QUFDcEMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO29CQUFFLE9BQU87Z0JBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO0FBQ3hCLG9CQUFBLElBQUksSUFBSSxHQUFHSyxjQUFNLENBQUMsV0FBVyxDQUFDO0FBQzlCLG9CQUFBLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNsQixJQUFJO0FBQ0YsNEJBQUEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLFdBQVc7a0NBQ3hCQSxjQUFNLENBQUMsa0JBQWtCO0FBQzNCLGtDQUFFQSxjQUFNLENBQUMsWUFBWSxDQUFDO3FCQUMzQjtBQUNELG9CQUFBLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNsQixJQUFJO0FBQ0YsNEJBQUEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLFdBQVc7a0NBQ3hCQSxjQUFNLENBQUMsa0JBQWtCO0FBQzNCLGtDQUFFQSxjQUFNLENBQUMsWUFBWSxDQUFDO3FCQUMzQjtBQUNELG9CQUFBLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLTCxVQUFFLENBQUMsS0FBSyxFQUFFO3dCQUMxQixRQUFRLE1BQU07QUFDWiw0QkFBQSxLQUFLLFNBQVM7QUFDWixnQ0FBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3pDLE1BQU07QUFDUiw0QkFBQSxLQUFLLFNBQVM7Z0NBQ1osTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQ0FDcEIsTUFBTTtBQUNSLDRCQUFBLEtBQUssUUFBUSxDQUFDO0FBQ2QsNEJBQUE7Z0NBQ0UsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7eUJBQzlCO3FCQUNGO2lCQUNGO0FBQ0gsYUFBQyxDQUFDLENBQUM7QUFDTCxTQUFDLENBQUMsQ0FBQztLQUNKO0FBRUQsSUFBQSxPQUFPLE1BQU0sQ0FBQztBQUNoQixFQUFFO0FBRUssSUFBTSxRQUFRLEdBQUcsVUFBQyxJQUFXLEVBQUE7O0lBRWxDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFXLEVBQUssRUFBQSxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFBLEVBQUEsQ0FBQyxDQUFDO0lBQzVFLElBQUksb0JBQW9CLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBQy9CLElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0FBRS9CLElBQUEsSUFBTSxFQUFFLEdBQUcsQ0FBQSxNQUFNLEtBQU4sSUFBQSxJQUFBLE1BQU0sS0FBTixLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxNQUFNLENBQUUsS0FBSyxLQUFJLEdBQUcsQ0FBQztJQUNoQyxJQUFJLEVBQUUsRUFBRTtBQUNOLFFBQUEsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFO1lBQ2Qsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQzNCLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMxQixvQkFBb0IsR0FBRyxJQUFJLENBQUM7U0FDN0I7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRTtZQUNyQixrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFDMUIsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQzNCLG9CQUFvQixHQUFHLElBQUksQ0FBQztTQUM3QjtBQUFNLGFBQUEsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFO1lBQ3JCLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUMzQixrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFDMUIsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO1NBQzlCO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBSyxHQUFHLEVBQUU7WUFDckIsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQzFCLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUMzQixvQkFBb0IsR0FBRyxLQUFLLENBQUM7U0FDOUI7S0FDRjtJQUNELE9BQU8sRUFBQyxvQkFBb0IsRUFBQSxvQkFBQSxFQUFFLGtCQUFrQixvQkFBQSxFQUFFLGtCQUFrQixFQUFBLGtCQUFBLEVBQUMsQ0FBQztBQUN4RSxFQUFFO0FBRUY7Ozs7O0FBS0c7QUFDVSxJQUFBLGdCQUFnQixHQUFHLFVBQUMsV0FBa0IsRUFBRSxnQkFBcUIsRUFBQTtBQUFyQixJQUFBLElBQUEsZ0JBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLGdCQUFxQixHQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQ3hFLElBQUEsSUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ25DLElBQUEsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXJCLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUNYLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNuQixJQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUM3RCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5QixJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzQyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuQyxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUV0QyxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFBO0FBQ2pCLFFBQUEsSUFBQSxFQUFxQyxHQUFBLElBQUksQ0FBQyxLQUFLLENBQTlDLENBQUEsU0FBUyxHQUFBLEVBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBRSxVQUFVLEdBQUEsRUFBQSxDQUFBLFVBQUEsQ0FBRSxjQUF3QjtBQUN0RCxRQUFBLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQUUsVUFBVSxJQUFJLENBQUMsQ0FBQztBQUUzQyxRQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFXLEVBQUE7QUFDNUIsWUFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxZQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUFFLE9BQU87WUFDM0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7Z0JBQ3hCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ1AsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDUCxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxHQUFHQSxVQUFFLENBQUMsS0FBSyxHQUFHQSxVQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFN0QsZ0JBQUEsSUFBSSxFQUFFLEtBQUssU0FBUyxJQUFJLEVBQUUsS0FBSyxTQUFTLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUM5RCxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxHQUFHLFVBQVUsRUFDdkMsUUFBUSxFQUFFLENBQUM7aUJBQ2Q7Z0JBRUQsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzdCLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBR0ssY0FBTSxDQUFDLE9BQU8sQ0FBQztpQkFDakM7YUFDRjtBQUNILFNBQUMsQ0FBQyxDQUFDOztBQUdILFFBQUEsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQVUsRUFBQTtBQUM1QixZQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVSxFQUFBO2dCQUM5QixJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPO2dCQUMzQixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtvQkFDeEIsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDUCxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNQLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUMsb0JBQUEsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUk7d0JBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDekM7QUFDSCxhQUFDLENBQUMsQ0FBQztBQUNMLFNBQUMsQ0FBQyxDQUFDOzs7O1FBS0gsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDbkQsSUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQyxZQUFBLElBQ0UsY0FBYztnQkFDZCxXQUFXLENBQUMsY0FBYyxDQUFDO0FBQzNCLGdCQUFBLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxFQUMzQjtBQUNBLGdCQUFBLElBQU0sWUFBVSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO0FBQ25ELGdCQUFBLFlBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFVLEVBQUE7QUFDNUIsb0JBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFVLEVBQUE7d0JBQzlCLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3hDLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsd0JBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDOzRCQUFFLE9BQU87d0JBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFOzRCQUN4QixFQUFFLEdBQUcsQ0FBQyxDQUFDOzRCQUNQLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ1AsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxQyw0QkFBQSxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSTtnQ0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUN6QztBQUNILHFCQUFDLENBQUMsQ0FBQztBQUNMLGlCQUFDLENBQUMsQ0FBQzthQUNKO1NBQ0Y7O0FBR0QsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdCLFlBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0IsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQzNDO1NBQ0Y7QUFDSCxLQUFDLENBQUMsQ0FBQzs7SUFHSCxJQUFJLElBQUksRUFBRTtBQUNSLFFBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQVcsRUFBQTtBQUNiLFlBQUEsSUFBQSxFQUFxQyxHQUFBLElBQUksQ0FBQyxLQUFLLENBQTlDLENBQUEsU0FBUyxHQUFBLEVBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBRSxVQUFVLEdBQUEsRUFBQSxDQUFBLFVBQUEsQ0FBRSxjQUF3QjtBQUN0RCxZQUFBLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUFFLFVBQVUsSUFBSSxDQUFDLENBQUM7QUFDM0MsWUFBQSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVSxFQUFBO0FBQzVCLGdCQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVSxFQUFBO29CQUM5QixJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLG9CQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTt3QkFDNUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHTCxVQUFFLENBQUMsS0FBSyxDQUFDO0FBQ2hDLHdCQUFBLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJOzRCQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3BEO0FBQ0gsaUJBQUMsQ0FBQyxDQUFDO0FBQ0wsYUFBQyxDQUFDLENBQUM7QUFFSCxZQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFXLEVBQUE7QUFDNUIsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO29CQUM1QyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUdBLFVBQUUsQ0FBQyxLQUFLLENBQUM7aUJBQ2pDO0FBQ0gsYUFBQyxDQUFDLENBQUM7QUFFSCxZQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsU0FBQyxDQUFDLENBQUM7S0FDSjtBQUVELElBQUEsSUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7QUFDbEQsSUFBQSxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBYSxFQUFBO0FBQ2hDLFFBQUEsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN0QixRQUFBLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsUUFBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxFQUFBO1lBQ2xCLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFBRSxPQUFPO1lBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO2dCQUN4QixJQUFJLElBQUksU0FBQSxDQUFDO2dCQUNULFFBQVEsS0FBSztBQUNYLG9CQUFBLEtBQUssSUFBSTtBQUNQLHdCQUFBLElBQUksR0FBR0ssY0FBTSxDQUFDLE1BQU0sQ0FBQzt3QkFDckIsTUFBTTtBQUNSLG9CQUFBLEtBQUssSUFBSTtBQUNQLHdCQUFBLElBQUksR0FBR0EsY0FBTSxDQUFDLE1BQU0sQ0FBQzt3QkFDckIsTUFBTTtBQUNSLG9CQUFBLEtBQUssSUFBSTtBQUNQLHdCQUFBLElBQUksR0FBR0EsY0FBTSxDQUFDLFFBQVEsQ0FBQzt3QkFDdkIsTUFBTTtBQUNSLG9CQUFBLEtBQUssSUFBSTtBQUNQLHdCQUFBLElBQUksR0FBR0EsY0FBTSxDQUFDLEtBQUssQ0FBQzt3QkFDcEIsTUFBTTtvQkFDUixTQUFTO3dCQUNQLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM1QjtpQkFDRjtnQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQ3JCO0FBQ0gsU0FBQyxDQUFDLENBQUM7QUFDTCxLQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7OztBQVlILElBQUEsT0FBTyxFQUFDLEdBQUcsRUFBQSxHQUFBLEVBQUUsY0FBYyxFQUFBLGNBQUEsRUFBRSxNQUFNLEVBQUEsTUFBQSxFQUFFLFNBQVMsRUFBQSxTQUFBLEVBQUMsQ0FBQztBQUNsRCxFQUFFO0FBRUY7Ozs7O0FBS0c7QUFDVSxJQUFBLFFBQVEsR0FBRyxVQUFDLElBQVcsRUFBRSxLQUFhLEVBQUE7QUFDakQsSUFBQSxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU87QUFDbEIsSUFBQSxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFXLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQ3RFO0FBQ0QsSUFBQSxJQUFJLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUN4QyxVQUFDLENBQXFCLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FDN0MsQ0FBQztLQUNIO0FBQ0QsSUFBQSxJQUFJLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUN4QyxVQUFDLENBQXFCLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FDN0MsQ0FBQztLQUNIO0FBQ0QsSUFBQSxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFXLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQ3RFO0FBQ0QsSUFBQSxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFZLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQ3hFO0FBQ0QsSUFBQSxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQWEsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUFDLENBQUM7S0FDMUU7QUFDRCxJQUFBLElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNsQyxVQUFDLENBQWUsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUN2QyxDQUFDO0tBQ0g7QUFDRCxJQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsRUFBRTtBQUVGOzs7OztBQUtHO0FBQ1UsSUFBQSxTQUFTLEdBQUcsVUFBQyxJQUFXLEVBQUUsS0FBYSxFQUFBO0FBQ2xELElBQUEsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBVyxJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQUMsQ0FBQztLQUN4RTtBQUNELElBQUEsSUFBSSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDN0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FDMUMsVUFBQyxDQUFxQixJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQzdDLENBQUM7S0FDSDtBQUNELElBQUEsSUFBSSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDN0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FDMUMsVUFBQyxDQUFxQixJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQzdDLENBQUM7S0FDSDtBQUNELElBQUEsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBVyxJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQUMsQ0FBQztLQUN4RTtBQUNELElBQUEsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25DLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBWSxJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQUMsQ0FBQztLQUMxRTtBQUNELElBQUEsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFhLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQzVFO0FBQ0QsSUFBQSxJQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN2QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FDcEMsVUFBQyxDQUFlLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FDdkMsQ0FBQztLQUNIO0FBQ0QsSUFBQSxPQUFPLEVBQUUsQ0FBQztBQUNaLEVBQUU7QUFFSyxJQUFNLE9BQU8sR0FBRyxVQUNyQixJQUFXLEVBQ1gsT0FBK0IsRUFDL0IsT0FBK0IsRUFDL0IsU0FBaUMsRUFDakMsU0FBaUMsRUFBQTtBQUVqQyxJQUFBLElBQUksUUFBUSxDQUFDO0lBQ2IsSUFBTSxPQUFPLEdBQUcsVUFBQyxJQUFXLEVBQUE7QUFDMUIsUUFBQSxJQUFNLE9BQU8sR0FBR1EsY0FBTyxDQUNyQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxFQUFJLEVBQUEsSUFBQSxFQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsUUFBUSxFQUFFLENBQUEsRUFBQSxDQUFDLENBQzFELENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osUUFBQSxPQUFPLE9BQU8sQ0FBQztBQUNqQixLQUFDLENBQUM7SUFFRixJQUFNLFdBQVcsR0FBRyxVQUFDLElBQVcsRUFBQTtRQUM5QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFBRSxPQUFPO0FBRS9CLFFBQUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLFFBQUEsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDckIsWUFBQSxJQUFJLE9BQU87Z0JBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0FBQU0sYUFBQSxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM5QixZQUFBLElBQUksU0FBUztnQkFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEM7YUFBTTtBQUNMLFlBQUEsSUFBSSxPQUFPO2dCQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtBQUNILEtBQUMsQ0FBQztBQUVGLElBQUEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDdEIsUUFBQSxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQVEsRUFBSyxFQUFBLE9BQUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFkLEVBQWMsQ0FBQyxDQUFDO0FBQ3RFLFFBQUEsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFRLEVBQUssRUFBQSxPQUFBLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBZCxFQUFjLENBQUMsQ0FBQztBQUN0RSxRQUFBLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBUSxFQUFLLEVBQUEsT0FBQSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQWhCLEVBQWdCLENBQUMsQ0FBQztRQUUxRSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRWhCLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzlDLFlBQUEsUUFBUSxHQUFHSSxhQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDL0I7YUFBTSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyRCxZQUFBLFFBQVEsR0FBR0EsYUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQy9CO2FBQU0sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekQsWUFBQSxRQUFRLEdBQUdBLGFBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNqQztBQUFNLGFBQUEsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDNUIsWUFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDNUI7YUFBTTtBQUNMLFlBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQzVCO0FBQ0QsUUFBQSxJQUFJLFFBQVE7WUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDckM7U0FBTTtRQUNMLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQjtBQUNELElBQUEsT0FBTyxRQUFRLENBQUM7QUFDbEIsRUFBRTtBQUVXLElBQUEsZ0JBQWdCLEdBQUcsVUFBQyxJQUFXLEVBQUUsZ0JBQXFCLEVBQUE7O0FBQXJCLElBQUEsSUFBQSxnQkFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsZ0JBQXFCLEdBQUEsRUFBQSxDQUFBLEVBQUE7SUFDakUsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQ25CLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFBLEVBQUEsR0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLEtBQUssS0FBSSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQ2pFLGNBQWMsQ0FDZixDQUFDO0FBQ0YsSUFBQSxPQUFPLElBQUksQ0FBQztBQUNkLEVBQUU7QUFFVyxJQUFBLDJCQUEyQixHQUFHLFVBQ3pDLElBQThCLEVBQzlCLGdCQUErQixFQUFBO0FBQS9CLElBQUEsSUFBQSxnQkFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsZ0JBQUEsR0FBdUJqQixVQUFFLENBQUMsS0FBSyxDQUFBLEVBQUE7SUFFL0IsSUFBSSxJQUFJLEVBQUU7QUFDUixRQUFBLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBQSxDQUFDLEVBQUksRUFBQSxPQUFBLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBZCxFQUFjLENBQUMsQ0FBQztRQUNsRCxJQUFJLFNBQVMsRUFBRTtBQUNiLFlBQUEsSUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUMsRUFBSSxFQUFBLE9BQUEsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFiLEVBQWEsQ0FBQyxDQUFDO0FBQzFELFlBQUEsSUFBSSxDQUFDLGFBQWE7QUFBRSxnQkFBQSxPQUFPLGdCQUFnQixDQUFDO0FBQzVDLFlBQUEsT0FBTyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDcEM7S0FDRjs7QUFFRCxJQUFBLE9BQU8sZ0JBQWdCLENBQUM7QUFDMUIsRUFBRTtBQUVXLElBQUEsMEJBQTBCLEdBQUcsVUFDeEMsR0FBVyxFQUNYLGdCQUErQixFQUFBO0FBQS9CLElBQUEsSUFBQSxnQkFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsZ0JBQUEsR0FBdUJBLFVBQUUsQ0FBQyxLQUFLLENBQUEsRUFBQTtBQUUvQixJQUFBLElBQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLElBQUksU0FBUyxDQUFDLElBQUk7QUFDaEIsUUFBQSwyQkFBMkIsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7O0FBRWhFLElBQUEsT0FBTyxnQkFBZ0IsQ0FBQztBQUMxQixFQUFFO0FBRVcsSUFBQSxZQUFZLEdBQUcsVUFBQyxJQUFXLEVBQUUsZ0JBQStCLEVBQUE7O0FBQS9CLElBQUEsSUFBQSxnQkFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsZ0JBQUEsR0FBdUJBLFVBQUUsQ0FBQyxLQUFLLENBQUEsRUFBQTtBQUN2RSxJQUFBLElBQU0sUUFBUSxHQUFHLENBQUEsRUFBQSxHQUFBLENBQUEsRUFBQSxHQUFBLElBQUksQ0FBQyxLQUFLLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsU0FBUyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLFFBQVEsUUFBUSxhQUFSLFFBQVEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBUixRQUFRLENBQUUsS0FBSztBQUNyQixRQUFBLEtBQUssR0FBRztZQUNOLE9BQU9BLFVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDbEIsUUFBQSxLQUFLLEdBQUc7WUFDTixPQUFPQSxVQUFFLENBQUMsS0FBSyxDQUFDO0FBQ2xCLFFBQUE7O0FBRUUsWUFBQSxPQUFPLGdCQUFnQixDQUFDO0tBQzNCO0FBQ0g7O0FDMXlEQSxJQUFBLEtBQUEsa0JBQUEsWUFBQTtBQUlFLElBQUEsU0FBQSxLQUFBLENBQ1ksR0FBNkIsRUFDN0IsQ0FBUyxFQUNULENBQVMsRUFDVCxFQUFVLEVBQUE7UUFIVixJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBMEI7UUFDN0IsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUUsQ0FBQSxFQUFBLEdBQUYsRUFBRSxDQUFRO1FBUFosSUFBVyxDQUFBLFdBQUEsR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFBLElBQUEsR0FBRyxDQUFDLENBQUM7S0FPZjtBQUNKLElBQUEsS0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTs7S0FFQyxDQUFBO0lBRUQsS0FBYyxDQUFBLFNBQUEsQ0FBQSxjQUFBLEdBQWQsVUFBZSxLQUFhLEVBQUE7QUFDMUIsUUFBQSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztLQUMxQixDQUFBO0lBRUQsS0FBTyxDQUFBLFNBQUEsQ0FBQSxPQUFBLEdBQVAsVUFBUSxJQUFZLEVBQUE7QUFDbEIsUUFBQSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNsQixDQUFBO0lBQ0gsT0FBQyxLQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUNqQkQsSUFBQSxTQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQStCVSxlQUFLLENBQUEsU0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0lBR2xDLFNBQ0UsU0FBQSxDQUFBLEdBQTZCLEVBQzdCLENBQVMsRUFDVCxDQUFTLEVBQ1QsRUFBVSxFQUNWLFlBQTJCLEVBQUE7UUFFM0IsSUFBQSxLQUFBLEdBQUEsTUFBSyxDQUFDLElBQUEsQ0FBQSxJQUFBLEVBQUEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUMsSUFBQSxDQUFBO0FBQ3JCLFFBQUEsS0FBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7O0tBQ2xDO0FBRUQ7O0FBRUc7SUFDTyxTQUFnQixDQUFBLFNBQUEsQ0FBQSxnQkFBQSxHQUExQixVQUNFLEdBQU0sRUFBQTs7QUFFTixRQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3RCLFlBQUEsT0FBTyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMvQjtRQUVLLElBQUEsRUFBQSxHQUF3QixJQUFJLENBQUMsWUFBWSxFQUF4QyxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxZQUFZLEdBQUEsRUFBQSxDQUFBLFlBQXFCLENBQUM7QUFDaEQsUUFBQSxJQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUMsUUFBQSxJQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDOztBQUczQyxRQUFBLElBQU0sTUFBTSxJQUFJLE1BQUEsYUFBYSxLQUFBLElBQUEsSUFBYixhQUFhLEtBQWIsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsYUFBYSxDQUFHLEdBQUcsQ0FBQyxNQUNsQyxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBQSxhQUFhLENBQUMsR0FBRyxDQUFDLENBQW1CLENBQUM7QUFDeEMsUUFBQSxPQUFPLE1BQU0sQ0FBQztLQUNmLENBQUE7QUFFRCxJQUFBLFNBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBcUMsSUFBSSxFQUF4QyxHQUFHLFNBQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxJQUFJLFVBQUEsRUFBRSxFQUFFLFFBQUEsRUFBRSxXQUFXLGlCQUFRLENBQUM7UUFDaEQsSUFBSSxJQUFJLElBQUksQ0FBQztZQUFFLE9BQU87UUFDdEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDOUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlDLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbEIsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMxRCxRQUFBLElBQUksRUFBRSxLQUFLVixVQUFFLENBQUMsS0FBSyxFQUFFO1lBQ25CLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDekQ7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLQSxVQUFFLENBQUMsS0FBSyxFQUFFO1lBQzFCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDekQ7UUFDRCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxTQUFBLENBQUE7QUFBRCxDQXBEQSxDQUErQixLQUFLLENBb0RuQyxDQUFBOztBQ3BERCxJQUFBLFVBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBZ0NVLGVBQUssQ0FBQSxVQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFHbkMsSUFBQSxTQUFBLFVBQUEsQ0FDRSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULEVBQVUsRUFDRixHQUFXLEVBQ1gsTUFBVyxFQUNYLE1BQVcsRUFDWCxZQUEyQixFQUFBO1FBRW5DLElBQUEsS0FBQSxHQUFBLE1BQUssQ0FBQyxJQUFBLENBQUEsSUFBQSxFQUFBLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFDLElBQUEsQ0FBQTtRQUxiLEtBQUcsQ0FBQSxHQUFBLEdBQUgsR0FBRyxDQUFRO1FBQ1gsS0FBTSxDQUFBLE1BQUEsR0FBTixNQUFNLENBQUs7UUFDWCxLQUFNLENBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBSztRQUNYLEtBQVksQ0FBQSxZQUFBLEdBQVosWUFBWSxDQUFlOztRQUtuQyxJQUFJLFlBQVksRUFBRTtBQUNoQixZQUFBLEtBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQ2pFOztLQUNGO0FBRUQsSUFBQSxVQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQTZDLElBQUksRUFBaEQsR0FBRyxHQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUUsSUFBSSxVQUFBLEVBQUUsRUFBRSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUUsTUFBTSxHQUFBLEVBQUEsQ0FBQSxNQUFBLEVBQUUsTUFBTSxHQUFBLEVBQUEsQ0FBQSxNQUFBLEVBQUUsR0FBRyxHQUFBLEVBQUEsQ0FBQSxHQUFRLENBQUM7UUFDeEQsSUFBSSxJQUFJLElBQUksQ0FBQztZQUFFLE9BQU87QUFFdEIsUUFBQSxJQUFJLEdBQUcsQ0FBQztBQUNSLFFBQUEsSUFBSSxFQUFFLEtBQUtWLFVBQUUsQ0FBQyxLQUFLLEVBQUU7WUFDbkIsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25DO2FBQU07WUFDTCxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkM7O0FBR0QsUUFBQSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxhQUFhLEtBQUssQ0FBQyxFQUFFOztZQUVsRCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDNUQ7YUFBTTs7QUFFTCxZQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixnQkFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxnQkFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCO1NBQ0Y7S0FDRixDQUFBO0lBRUQsVUFBTyxDQUFBLFNBQUEsQ0FBQSxPQUFBLEdBQVAsVUFBUSxJQUFZLEVBQUE7QUFDbEIsUUFBQSxNQUFBLENBQUEsU0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLENBQUEsSUFBQSxFQUFBLElBQUksQ0FBQyxDQUFDOztBQUVwQixRQUFBLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xDO0tBQ0YsQ0FBQTtJQUNILE9BQUMsVUFBQSxDQUFBO0FBQUQsQ0FwREEsQ0FBZ0MsS0FBSyxDQW9EcEMsQ0FBQTs7QUN6Q0QsSUFBQSxhQUFBLGtCQUFBLFlBQUE7QUFDRSxJQUFBLFNBQUEsYUFBQSxDQUNVLEdBQTZCLEVBQzdCLENBQVMsRUFDVCxDQUFTLEVBQ1QsQ0FBUyxFQUNULFFBQWtCLEVBQ2xCLFFBQWtCLEVBQ2xCLEtBQXNELEVBQ3RELFlBQXFCLEVBQUE7QUFEckIsUUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsR0FBNEJFLDBCQUFrQixDQUFDLE9BQU8sQ0FBQSxFQUFBO1FBUGhFLElBU0ksS0FBQSxHQUFBLElBQUEsQ0FBQTtRQVJNLElBQUcsQ0FBQSxHQUFBLEdBQUgsR0FBRyxDQUEwQjtRQUM3QixJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFRLENBQUEsUUFBQSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixJQUFRLENBQUEsUUFBQSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixJQUFLLENBQUEsS0FBQSxHQUFMLEtBQUssQ0FBaUQ7UUFDdEQsSUFBWSxDQUFBLFlBQUEsR0FBWixZQUFZLENBQVM7QUF1QnZCLFFBQUEsSUFBQSxDQUFBLHdCQUF3QixHQUFHLFlBQUE7WUFDM0IsSUFBQSxFQUFBLEdBQW1ELEtBQUksRUFBdEQsR0FBRyxTQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUUsUUFBUSxHQUFBLEVBQUEsQ0FBQSxRQUFBLEVBQUUsUUFBUSxHQUFBLEVBQUEsQ0FBQSxRQUFBLEVBQUUsWUFBWSxHQUFBLEVBQUEsQ0FBQSxZQUFRLENBQUM7QUFDdkQsWUFBQSxJQUFBLEtBQUssR0FBSSxRQUFRLENBQUEsS0FBWixDQUFhO1lBRXpCLElBQUksTUFBTSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUV4RCxZQUFBLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtnQkFDYixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsZ0JBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsZ0JBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQztnQkFDeEMsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLGdCQUFBLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLGdCQUFBLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFDcEQsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDWCxJQUFJLFlBQVksRUFBRTtvQkFDaEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLG9CQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLG9CQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLG9CQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO29CQUMvQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2Q7QUFFRCxnQkFBQSxJQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUV6QixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUEsQ0FBQSxNQUFBLENBQUcsUUFBUSxHQUFHLEdBQUcsY0FBVyxDQUFDO0FBQ3hDLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQ3hCLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBRXpCLGdCQUFBLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLGNBQVcsQ0FBQztnQkFDbEMsSUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN4RCxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRTlCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBQSxDQUFBLE1BQUEsQ0FBRyxRQUFRLEdBQUcsR0FBRyxjQUFXLENBQUM7QUFDeEMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDeEIsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3hFO2lCQUFNO2dCQUNMLEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2FBQzNCO0FBQ0gsU0FBQyxDQUFDO0FBRU0sUUFBQSxJQUFBLENBQUEsd0JBQXdCLEdBQUcsWUFBQTtZQUMzQixJQUFBLEVBQUEsR0FBcUMsS0FBSSxFQUF4QyxHQUFHLFNBQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxRQUFRLGNBQUEsRUFBRSxRQUFRLGNBQVEsQ0FBQztBQUN6QyxZQUFBLElBQUEsS0FBSyxHQUFJLFFBQVEsQ0FBQSxLQUFaLENBQWE7WUFFekIsSUFBSSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRXhELFlBQUEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixnQkFBQSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2QyxnQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixnQkFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDO2dCQUN4QyxJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEUsZ0JBQUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDakMsZ0JBQUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztBQUNwRCxnQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztnQkFDekIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBRVgsZ0JBQUEsSUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFFekIsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsR0FBRyxHQUFHLGNBQVcsQ0FBQztBQUN4QyxnQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUN4QixnQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUV6QixnQkFBQSxJQUFNLE9BQU8sR0FDWCxRQUFRLENBQUMsYUFBYSxLQUFLLEdBQUc7c0JBQzFCLFFBQVEsQ0FBQyxPQUFPO0FBQ2xCLHNCQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUUzQixHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFFbkUsZ0JBQUEsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsY0FBVyxDQUFDO2dCQUNsQyxJQUFNLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDeEQsZ0JBQUEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRTdDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBQSxDQUFBLE1BQUEsQ0FBRyxRQUFRLEdBQUcsR0FBRyxjQUFXLENBQUM7QUFDeEMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDeEIsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRXZFLGdCQUFBLElBQU0sT0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQzdCLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFLLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4RDtpQkFBTTtnQkFDTCxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzthQUMzQjtBQUNILFNBQUMsQ0FBQztBQUVNLFFBQUEsSUFBQSxDQUFBLGtCQUFrQixHQUFHLFlBQUE7WUFDckIsSUFBQSxFQUFBLEdBQXFDLEtBQUksRUFBeEMsR0FBRyxTQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsUUFBUSxjQUFBLEVBQUUsUUFBUSxjQUFRLENBQUM7WUFDaEQsSUFBTSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzFELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcscUJBQXFCLENBQUM7WUFDeEMsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLFlBQUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDakMsWUFBQSxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JELFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7WUFDekIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1gsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2YsU0FBQyxDQUFDO0tBNUhFO0FBRUosSUFBQSxhQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQTRDLElBQUksQ0FBL0MsQ0FBQSxHQUFHLFNBQUEsQ0FBRSxDQUFDLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxFQUFBLENBQUEsQ0FBQSxNQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFFLENBQVEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFVLEVBQUEsQ0FBQSxRQUFBLENBQUEsS0FBRSxLQUFLLEdBQUEsRUFBQSxDQUFBLE1BQVM7UUFDdkQsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU87UUFFbEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsUUFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixRQUFBLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDekIsUUFBQSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzs7QUFHbkIsUUFBQSxJQUFJLEtBQUssS0FBS0EsMEJBQWtCLENBQUMsT0FBTyxFQUFFO1lBQ3hDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1NBQ2pDO0FBQU0sYUFBQSxJQUFJLEtBQUssS0FBS0EsMEJBQWtCLENBQUMsT0FBTyxFQUFFO1lBQy9DLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1NBQ2pDO1FBRUQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2YsQ0FBQTtJQXlHSCxPQUFDLGFBQUEsQ0FBQTtBQUFELENBQUMsRUFBQSxDQUFBOztBQ25KRCxJQUFBLE1BQUEsa0JBQUEsWUFBQTtBQU1FLElBQUEsU0FBQSxNQUFBLENBQ1ksR0FBNkIsRUFDN0IsQ0FBUyxFQUNULENBQVMsRUFDVCxDQUFTLEVBQ1QsRUFBVSxFQUNwQixZQUEyQixFQUNqQixHQUF5QixFQUFBO0FBQXpCLFFBQUEsSUFBQSxHQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxHQUF5QixHQUFBLEVBQUEsQ0FBQSxFQUFBO1FBTnpCLElBQUcsQ0FBQSxHQUFBLEdBQUgsR0FBRyxDQUEwQjtRQUM3QixJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFFLENBQUEsRUFBQSxHQUFGLEVBQUUsQ0FBUTtRQUVWLElBQUcsQ0FBQSxHQUFBLEdBQUgsR0FBRyxDQUFzQjtRQVozQixJQUFXLENBQUEsV0FBQSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFLLENBQUEsS0FBQSxHQUFHLEVBQUUsQ0FBQztRQUNYLElBQVEsQ0FBQSxRQUFBLEdBQWEsRUFBRSxDQUFDO0FBWWhDLFFBQUEsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7S0FDbEM7QUFFRCxJQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7O0tBRUMsQ0FBQTtJQUVELE1BQWMsQ0FBQSxTQUFBLENBQUEsY0FBQSxHQUFkLFVBQWUsS0FBYSxFQUFBO0FBQzFCLFFBQUEsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7S0FDMUIsQ0FBQTtJQUVELE1BQVEsQ0FBQSxTQUFBLENBQUEsUUFBQSxHQUFSLFVBQVMsS0FBYSxFQUFBO0FBQ3BCLFFBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEIsQ0FBQTtJQUVELE1BQVcsQ0FBQSxTQUFBLENBQUEsV0FBQSxHQUFYLFVBQVksUUFBa0IsRUFBQTtBQUM1QixRQUFBLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0tBQzFCLENBQUE7QUFFRDs7QUFFRztJQUNPLE1BQWdCLENBQUEsU0FBQSxDQUFBLGdCQUFBLEdBQTFCLFVBQ0UsR0FBTSxFQUFBOztBQUVOLFFBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDdEIsWUFBQSxPQUFPLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQy9CO1FBRUssSUFBQSxFQUFBLEdBQXdCLElBQUksQ0FBQyxZQUFZLEVBQXhDLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLFlBQVksR0FBQSxFQUFBLENBQUEsWUFBcUIsQ0FBQztBQUNoRCxRQUFBLElBQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxRQUFBLElBQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUM7O0FBRzNDLFFBQUEsSUFBTSxNQUFNLElBQUksTUFBQSxhQUFhLEtBQUEsSUFBQSxJQUFiLGFBQWEsS0FBYixLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxhQUFhLENBQUcsR0FBRyxDQUFDLE1BQ2xDLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxHQUFBLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBbUIsQ0FBQztBQUN4QyxRQUFBLE9BQU8sTUFBTSxDQUFDO0tBQ2YsQ0FBQTtJQUNILE9BQUMsTUFBQSxDQUFBO0FBQUQsQ0FBQyxFQUFBLENBQUE7O0FDckRELElBQUEsWUFBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFrQ1EsZUFBTSxDQUFBLFlBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUF4QyxJQUFBLFNBQUEsWUFBQSxHQUFBOztLQXlCQztBQXhCQyxJQUFBLFlBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBeUMsSUFBSSxFQUE1QyxHQUFHLFNBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxFQUFFLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBRSxXQUFXLEdBQUEsRUFBQSxDQUFBLFdBQUEsRUFBRSxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQVEsQ0FBQztBQUNwRCxRQUFBLElBQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdkIsUUFBQSxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDekQsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksRUFBRSxLQUFLVixVQUFFLENBQUMsS0FBSyxFQUFFO1lBQ25CLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDM0Q7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLQSxVQUFFLENBQUMsS0FBSyxFQUFFO1lBQzFCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDM0Q7YUFBTTtZQUNMLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUQsWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztTQUNuQjtBQUNELFFBQUEsSUFBSSxLQUFLO0FBQUUsWUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUNuQyxRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7UUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxZQUFBLENBQUE7QUFBRCxDQXpCQSxDQUFrQyxNQUFNLENBeUJ2QyxDQUFBOztBQ3pCRCxJQUFBLFdBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBaUNVLGVBQU0sQ0FBQSxXQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFBdkMsSUFBQSxTQUFBLFdBQUEsR0FBQTs7S0EwQkM7QUF6QkMsSUFBQSxXQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQWtDLElBQUksRUFBckMsR0FBRyxTQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsRUFBRSxRQUFBLEVBQUUsV0FBVyxpQkFBUSxDQUFDO0FBQzdDLFFBQUEsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN2QixRQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDeEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM5QixRQUFBLElBQUksRUFBRSxLQUFLVixVQUFFLENBQUMsS0FBSyxFQUFFO1lBQ25CLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDM0Q7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLQSxVQUFFLENBQUMsS0FBSyxFQUFFO1lBQzFCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDM0Q7YUFBTTtZQUNMLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUQsWUFBQSxJQUFJLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztTQUN0QjtRQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUMvQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFL0IsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUFDSCxPQUFDLFdBQUEsQ0FBQTtBQUFELENBMUJBLENBQWlDLE1BQU0sQ0EwQnRDLENBQUE7O0FDMUJELElBQUEsVUFBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFnQ1UsZUFBTSxDQUFBLFVBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUF0QyxJQUFBLFNBQUEsVUFBQSxHQUFBOztLQStCQztBQTlCQyxJQUFBLFVBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBdUMsSUFBSSxFQUExQyxHQUFHLFNBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxFQUFFLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBRSxHQUFHLEdBQUEsRUFBQSxDQUFBLEdBQUEsRUFBRSxXQUFXLEdBQUEsRUFBQSxDQUFBLFdBQVEsQ0FBQztBQUNsRCxRQUFBLElBQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDckIsUUFBQSxJQUFJLFFBQVEsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFFOUIsUUFBQSxJQUFJLEVBQUUsS0FBS1YsVUFBRSxDQUFDLEtBQUssRUFBRTtZQUNuQixHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3pEO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBS0EsVUFBRSxDQUFDLEtBQUssRUFBRTtZQUMxQixHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3pEO2FBQU07WUFDTCxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3pEOzs7O1FBSUQsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMvQixZQUFBLFFBQVEsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ3ZCO2FBQU0sSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN0QyxZQUFBLFFBQVEsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ3ZCO2FBQU07QUFDTCxZQUFBLFFBQVEsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ3ZCO0FBQ0QsUUFBQSxHQUFHLENBQUMsSUFBSSxHQUFHLE9BQVEsQ0FBQSxNQUFBLENBQUEsUUFBUSxjQUFXLENBQUM7QUFDdkMsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFBLEdBQUcsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO0FBQzVCLFFBQUEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxVQUFBLENBQUE7QUFBRCxDQS9CQSxDQUFnQyxNQUFNLENBK0JyQyxDQUFBOztBQy9CRCxJQUFBLFlBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBa0NVLGVBQU0sQ0FBQSxZQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFBeEMsSUFBQSxTQUFBLFlBQUEsR0FBQTs7S0FvQkM7QUFuQkMsSUFBQSxZQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQWtDLElBQUksRUFBckMsR0FBRyxTQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsRUFBRSxRQUFBLEVBQUUsV0FBVyxpQkFBUSxDQUFDO1FBQzdDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3pELFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBQSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFFBQUEsSUFBSSxFQUFFLEtBQUtWLFVBQUUsQ0FBQyxLQUFLLEVBQUU7WUFDbkIsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUMzRDtBQUFNLGFBQUEsSUFBSSxFQUFFLEtBQUtBLFVBQUUsQ0FBQyxLQUFLLEVBQUU7WUFDMUIsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUMzRDthQUFNO1lBQ0wsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMxRCxZQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1NBQ25CO0FBQ0QsUUFBQSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqRCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxZQUFBLENBQUE7QUFBRCxDQXBCQSxDQUFrQyxNQUFNLENBb0J2QyxDQUFBOztBQ3BCRCxJQUFBLGNBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBb0NVLGVBQU0sQ0FBQSxjQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFBMUMsSUFBQSxTQUFBLGNBQUEsR0FBQTs7S0EwQkM7QUF6QkMsSUFBQSxjQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQWtDLElBQUksRUFBckMsR0FBRyxTQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsRUFBRSxRQUFBLEVBQUUsV0FBVyxpQkFBUSxDQUFDO0FBQzdDLFFBQUEsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN2QixRQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDekIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25FLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRW5FLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDekQsUUFBQSxJQUFJLEVBQUUsS0FBS1YsVUFBRSxDQUFDLEtBQUssRUFBRTtZQUNuQixHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQzNEO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBS0EsVUFBRSxDQUFDLEtBQUssRUFBRTtZQUMxQixHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQzNEO2FBQU07WUFDTCxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFELFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBQSxJQUFJLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztTQUNyQjtRQUNELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxjQUFBLENBQUE7QUFBRCxDQTFCQSxDQUFvQyxNQUFNLENBMEJ6QyxDQUFBOztBQzNCRCxJQUFBLFVBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBZ0NVLGVBQU0sQ0FBQSxVQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFBdEMsSUFBQSxTQUFBLFVBQUEsR0FBQTs7S0FpQkM7QUFoQkMsSUFBQSxVQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQXlDLElBQUksQ0FBNUMsQ0FBQSxHQUFHLFNBQUEsQ0FBRSxDQUFBLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBRSxFQUFBLENBQUEsRUFBQSxDQUFBLEtBQUUsS0FBSyxHQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBRSxXQUFXLEdBQUEsRUFBQSxDQUFBLFlBQVM7QUFDcEQsUUFBQSxJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFFBQUEsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUN4QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM5QixRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDeEIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7UUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxVQUFBLENBQUE7QUFBRCxDQWpCQSxDQUFnQyxNQUFNLENBaUJyQyxDQUFBOztBQ2pCRCxJQUFBLGdCQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQXNDQSxlQUFNLENBQUEsZ0JBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUE1QyxJQUFBLFNBQUEsZ0JBQUEsR0FBQTs7S0EyQkM7QUExQkMsSUFBQSxnQkFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUF5QyxJQUFJLENBQTVDLENBQUEsR0FBRyxTQUFBLENBQUUsQ0FBQSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFFLENBQUUsRUFBQSxDQUFBLEVBQUEsQ0FBQSxLQUFFLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBLENBQUUsV0FBVyxHQUFBLEVBQUEsQ0FBQSxZQUFTO0FBQ3BELFFBQUEsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN2QixRQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDeEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdEIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7UUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFZCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN0QixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNaLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDWjtRQUNELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUFDSCxPQUFDLGdCQUFBLENBQUE7QUFBRCxDQTNCQSxDQUFzQyxNQUFNLENBMkIzQyxDQUFBOztBQzFCRCxJQUFBLGlCQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQXVDQSxlQUFNLENBQUEsaUJBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUE3QyxJQUFBLFNBQUEsaUJBQUEsR0FBQTs7S0F5QkM7QUF4QkMsSUFBQSxpQkFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUF5QyxJQUFJLEVBQTVDLEdBQUcsU0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLEVBQUUsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFFLFdBQVcsR0FBQSxFQUFBLENBQUEsV0FBQSxFQUFFLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBUSxDQUFDO0FBQ3BELFFBQUEsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDekIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDOUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN6RCxRQUFBLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLFFBQUEsSUFBSSxFQUFFLEtBQUtWLFVBQUUsQ0FBQyxLQUFLLEVBQUU7WUFDbkIsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUN6RDtBQUFNLGFBQUEsSUFBSSxFQUFFLEtBQUtBLFVBQUUsQ0FBQyxLQUFLLEVBQUU7WUFDMUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUN6RDthQUFNO1lBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4RCxZQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1NBQ25CO0FBQ0QsUUFBQSxJQUFJLEtBQUs7QUFBRSxZQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ2pDLFFBQUEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO0FBQ1osWUFBQSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDWjtRQUNELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUFDSCxPQUFDLGlCQUFBLENBQUE7QUFBRCxDQXpCQSxDQUF1QyxNQUFNLENBeUI1QyxDQUFBOztBQ3pCRCxJQUFBLGVBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBcUNVLGVBQU0sQ0FBQSxlQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFBM0MsSUFBQSxTQUFBLGVBQUEsR0FBQTs7S0FnQkM7QUFmQyxJQUFBLGVBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBa0MsSUFBSSxDQUFyQyxDQUFBLEdBQUcsU0FBQSxDQUFFLENBQUEsQ0FBQyxPQUFBLENBQUUsQ0FBQSxDQUFDLE9BQUEsQ0FBRSxDQUFBLENBQUMsT0FBQSxDQUFFLENBQUEsRUFBRSxRQUFBLENBQUUsZ0JBQW9CO1FBQzdDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3pELFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDdEIsUUFBQSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ25CLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEQsUUFBQSxJQUFJLEVBQUUsS0FBS1YsVUFBRSxDQUFDLEtBQUssSUFBSSxFQUFFLEtBQUtBLFVBQUUsQ0FBQyxLQUFLLEVBQUU7QUFDdEMsWUFBQSxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUNqQjtBQUNELFFBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2YsQ0FBQTtJQUNILE9BQUMsZUFBQSxDQUFBO0FBQUQsQ0FoQkEsQ0FBcUMsTUFBTSxDQWdCMUMsQ0FBQTs7QUNuQkQsSUFBQSxVQUFBLGtCQUFBLFlBQUE7SUFJRSxTQUNZLFVBQUEsQ0FBQSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULElBQVksRUFDWixFQUFVLEVBQUE7UUFKVixJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBMEI7UUFDN0IsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUksQ0FBQSxJQUFBLEdBQUosSUFBSSxDQUFRO1FBQ1osSUFBRSxDQUFBLEVBQUEsR0FBRixFQUFFLENBQVE7UUFSWixJQUFXLENBQUEsV0FBQSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFLLENBQUEsS0FBQSxHQUFHLEVBQUUsQ0FBQztLQVFqQjtBQUVKLElBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTs7S0FFQyxDQUFBO0lBQ0gsT0FBQyxVQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUNaRCxJQUFNLE1BQU0sR0FBRyw4U0FFUixDQUFDO0FBRVIsSUFBQSxTQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQStCVSxlQUFVLENBQUEsU0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0lBVXZDLFNBQ1ksU0FBQSxDQUFBLEdBQTZCLEVBQzdCLENBQVMsRUFDVCxDQUFTLEVBQ1QsSUFBWSxFQUNaLEVBQVUsRUFBQTtBQUVwQixRQUFBLElBQUEsS0FBQSxHQUFBLE1BQUssQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBQyxJQUFBLENBQUE7UUFOakIsS0FBRyxDQUFBLEdBQUEsR0FBSCxHQUFHLENBQTBCO1FBQzdCLEtBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsS0FBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxLQUFJLENBQUEsSUFBQSxHQUFKLElBQUksQ0FBUTtRQUNaLEtBQUUsQ0FBQSxFQUFBLEdBQUYsRUFBRSxDQUFRO0FBZGQsUUFBQSxLQUFBLENBQUEsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDbEIsS0FBSyxDQUFBLEtBQUEsR0FBRyxDQUFDLENBQUM7UUFDVixLQUFjLENBQUEsY0FBQSxHQUFHLEdBQUcsQ0FBQztRQUNyQixLQUFlLENBQUEsZUFBQSxHQUFHLEdBQUcsQ0FBQztRQUN0QixLQUFZLENBQUEsWUFBQSxHQUFHLEdBQUcsQ0FBQztBQUNuQixRQUFBLEtBQUEsQ0FBQSxTQUFTLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRTlCLEtBQVcsQ0FBQSxXQUFBLEdBQUcsS0FBSyxDQUFDO0FBb0I1QixRQUFBLEtBQUEsQ0FBQSxJQUFJLEdBQUcsWUFBQTtBQUNMLFlBQUEsSUFBSSxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUN0QixPQUFPO2FBQ1I7WUFFSyxJQUFBLEVBQUEsR0FBMEQsS0FBSSxFQUE3RCxHQUFHLFNBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxJQUFJLEdBQUEsRUFBQSxDQUFBLElBQUEsRUFBRSxHQUFHLEdBQUEsRUFBQSxDQUFBLEdBQUEsRUFBRSxjQUFjLEdBQUEsRUFBQSxDQUFBLGNBQUEsRUFBRSxlQUFlLEdBQUEsRUFBQSxDQUFBLGVBQVEsQ0FBQztBQUVyRSxZQUFBLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUU5QixZQUFBLElBQUksQ0FBQyxLQUFJLENBQUMsU0FBUyxFQUFFO0FBQ25CLGdCQUFBLEtBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO2FBQ3RCO0FBRUQsWUFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RCxZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQztZQUM3QixHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsWUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUVwQixZQUFBLElBQU0sT0FBTyxHQUFHLEdBQUcsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDO0FBRXJDLFlBQUEsSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUU7QUFDckIsZ0JBQUEsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkQsZ0JBQUEsSUFBSSxPQUFPLElBQUksY0FBYyxFQUFFO0FBQzdCLG9CQUFBLEtBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2Ysb0JBQUEsVUFBVSxDQUFDLFlBQUE7QUFDVCx3QkFBQSxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4Qix3QkFBQSxLQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQyxxQkFBQyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDdkI7YUFDRjtpQkFBTTtBQUNMLGdCQUFBLElBQU0sV0FBVyxHQUFHLEdBQUcsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3pDLGdCQUFBLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxHQUFHLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1RCxnQkFBQSxJQUFJLFdBQVcsSUFBSSxlQUFlLEVBQUU7QUFDbEMsb0JBQUEsS0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixvQkFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdEQsT0FBTztpQkFDUjthQUNGO0FBRUQsWUFBQSxxQkFBcUIsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsU0FBQyxDQUFDOztBQWhEQSxRQUFnQixJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLGVBQWUsRUFBQyxFQUFFO1FBRTVELElBQU0sVUFBVSxHQUFHLDRCQUE2QixDQUFBLE1BQUEsQ0FBQVEsZUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFFLENBQUM7QUFFakUsUUFBQSxLQUFJLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDdkIsUUFBQSxLQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUM7O0tBQzNCO0lBMkNILE9BQUMsU0FBQSxDQUFBO0FBQUQsQ0FyRUEsQ0FBK0IsVUFBVSxDQXFFeEMsQ0FBQTs7O0FDekJELElBQU0saUJBQWlCLEdBQUcsVUFDeEIsS0FBWSxFQUNaLGNBQW1CLEVBQ25CLFNBQXVCLEVBQUE7O0FBQXZCLElBQUEsSUFBQSxTQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxTQUF1QixHQUFBLEdBQUEsQ0FBQSxFQUFBO0FBRXZCLElBQUEsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLElBQUEsSUFBSSxDQUFDLFNBQVM7QUFBRSxRQUFBLE9BQU8sSUFBSSxDQUFDOztJQUc1QixJQUFJLFNBQVMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRTtRQUN6QyxPQUFPO1lBQ0wsS0FBSyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxLQUFLO1lBQ2xELE1BQU0sRUFDSixDQUFBLENBQUEsRUFBQSxHQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLE1BQU0sSUFBRyxDQUFDO0FBQ25DLGtCQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTTtrQkFDekIsU0FBUyxDQUFDLE1BQU07WUFDdEIsTUFBTSxFQUNKLENBQUEsQ0FBQSxFQUFBLEdBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsTUFBTSxJQUFHLENBQUM7QUFDbkMsa0JBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNO2tCQUN6QixTQUFTLENBQUMsTUFBTTtTQUN2QixDQUFDO0tBQ0g7O0lBR0QsSUFBSSxTQUFTLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7UUFDdkMsT0FBTztZQUNMLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsS0FBSztZQUNoRCxNQUFNLEVBQ0osQ0FBQSxDQUFBLEVBQUEsR0FBQSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxNQUFNLElBQUcsQ0FBQztBQUNqQyxrQkFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU07a0JBQ3ZCLFNBQVMsQ0FBQyxNQUFNO1lBQ3RCLE1BQU0sRUFDSixDQUFBLENBQUEsRUFBQSxHQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLE1BQU0sSUFBRyxDQUFDO0FBQ2pDLGtCQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTTtrQkFDdkIsU0FBUyxDQUFDLE1BQU07U0FDdkIsQ0FBQztLQUNIOztJQUdELE9BQU87UUFDTCxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUs7UUFDdEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNO1FBQ3hCLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTTtLQUN6QixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUY7QUFDQSxJQUFNLG9CQUFvQixHQUFHLFVBQUMsS0FBWSxFQUFFLGNBQW1CLEVBQUE7QUFDN0QsSUFBQSxJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsSUFBQSxJQUFJLENBQUMsU0FBUztBQUFFLFFBQUEsT0FBTyxFQUFFLENBQUM7SUFFMUIsSUFBTSxTQUFTLEdBQWEsRUFBRSxDQUFDOztJQUcvQixJQUFJLFNBQVMsQ0FBQyxLQUFLO0FBQUUsUUFBQSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyRCxJQUFJLFNBQVMsQ0FBQyxNQUFNO1FBQUUsU0FBUyxDQUFDLElBQUksQ0FBZCxLQUFBLENBQUEsU0FBUyx1Q0FBUyxTQUFTLENBQUMsTUFBTSxDQUFFLEVBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQTtJQUMxRCxJQUFJLFNBQVMsQ0FBQyxNQUFNO1FBQUUsU0FBUyxDQUFDLElBQUksQ0FBZCxLQUFBLENBQUEsU0FBUyx1Q0FBUyxTQUFTLENBQUMsTUFBTSxDQUFFLEVBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQTs7QUFHMUQsSUFBQSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFDcEIsUUFBQSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSztZQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRSxRQUFBLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNO1lBQUUsU0FBUyxDQUFDLElBQUksQ0FBQSxLQUFBLENBQWQsU0FBUyxFQUFBeEIsbUJBQUEsQ0FBQSxFQUFBLEVBQUFDLFlBQUEsQ0FBUyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxFQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUE7QUFDeEUsUUFBQSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTTtZQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUEsS0FBQSxDQUFkLFNBQVMsRUFBQUQsbUJBQUEsQ0FBQSxFQUFBLEVBQUFDLFlBQUEsQ0FBUyxTQUFTLENBQUMsTUFBTSxDQUFD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UUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtnQkFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtnQkFDM0IsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsaUJBQWlCLENBQUM7QUFDaEUsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtnQkFDM0IsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsaUJBQWlCLENBQUM7QUFDaEUsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtnQkFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtnQkFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtnQkFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtnQkFDM0IsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsaUJBQWlCLENBQUM7QUFDaEUsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtnQkFDM0IsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsaUJBQWlCLENBQUM7QUFDaEUsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtnQkFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtnQkFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtnQkFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtnQkFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsaUJBQWlCLENBQUM7QUFDaEUsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtnQkFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsaUJBQWlCLENBQUM7QUFDaEUsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtnQkFDaEMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtnQkFDaEMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtnQkFDaEMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtnQkFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsaUJBQWlCLENBQUM7QUFDaEUsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtnQkFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQ04sd0JBQWdCLENBQUMsaUJBQWlCLENBQUM7QUFDaEUsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBTSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FB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
