
  /**
   * @license
   * author: BAI TIANLIANG
   * ghostban.js v3.0.0-alpha.126
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

var _a;
var settings = { cdn: 'https://s.shaowq.com' };
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
var THEME_RESOURCES = (_a = {},
    _a[exports.Theme.BlackAndWhite] = {
        blacks: [],
        whites: [],
    },
    _a[exports.Theme.Subdued] = {
        board: "".concat(settings.cdn, "/assets/theme/subdued/board.png"),
        blacks: ["".concat(settings.cdn, "/assets/theme/subdued/black.png")],
        whites: ["".concat(settings.cdn, "/assets/theme/subdued/white.png")],
    },
    _a[exports.Theme.ShellStone] = {
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
    _a[exports.Theme.SlateAndShell] = {
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
    _a[exports.Theme.Walnut] = {
        board: "".concat(settings.cdn, "/assets/theme/walnut/board.jpg"),
        blacks: ["".concat(settings.cdn, "/assets/theme/walnut/black.png")],
        whites: ["".concat(settings.cdn, "/assets/theme/walnut/white.png")],
    },
    _a[exports.Theme.Photorealistic] = {
        board: "".concat(settings.cdn, "/assets/theme/photorealistic/board.png"),
        blacks: ["".concat(settings.cdn, "/assets/theme/photorealistic/black.png")],
        whites: ["".concat(settings.cdn, "/assets/theme/photorealistic/white.png")],
    },
    _a[exports.Theme.Flat] = {
        blacks: [],
        whites: [],
    },
    _a);
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
    var newArray = lodash.cloneDeep(mat);
    if (i < 0 || j < 0)
        return false;
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
    if (ki === 0)
        return '';
    if (ki === 1)
        return "B[".concat(ax).concat(ay, "]");
    if (ki === -1)
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

var ColorStone = /** @class */ (function (_super) {
    tslib.__extends(ColorStone, _super);
    function ColorStone(ctx, x, y, ki) {
        return _super.call(this, ctx, x, y, ki) || this;
    }
    ColorStone.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, size = _a.size, ki = _a.ki, globalAlpha = _a.globalAlpha;
        if (size <= 0)
            return;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = globalAlpha;
        ctx.arc(x, y, size / 2, 0, 2 * Math.PI, true);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        if (ki === 1) {
            ctx.fillStyle = '#000';
        }
        else if (ki === -1) {
            ctx.fillStyle = '#fff';
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    };
    return ColorStone;
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
        if (ki === 1) {
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
    function Markup(ctx, x, y, s, ki, val) {
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
        ctx.lineWidth = 2;
        ctx.setLineDash(this.lineDash);
        if (ki === 1) {
            ctx.strokeStyle = '#fff';
        }
        else if (ki === -1) {
            ctx.strokeStyle = '#000';
        }
        else {
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
        if (ki === 1) {
            ctx.strokeStyle = '#fff';
        }
        else if (ki === -1) {
            ctx.strokeStyle = '#000';
        }
        else {
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
        if (ki === 1) {
            ctx.fillStyle = '#fff';
        }
        else if (ki === -1) {
            ctx.fillStyle = '#000';
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
        ctx.lineWidth = 2;
        ctx.globalAlpha = globalAlpha;
        var size = s * 0.55;
        if (ki === 1) {
            ctx.strokeStyle = '#fff';
        }
        else if (ki === -1) {
            ctx.strokeStyle = '#000';
        }
        else {
            ctx.strokeStyle = '#000';
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
        ctx.lineWidth = 2;
        if (ki === 1) {
            ctx.strokeStyle = '#fff';
        }
        else if (ki === -1) {
            ctx.strokeStyle = '#000';
        }
        else {
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
        ctx.lineWidth = 2;
        ctx.setLineDash(this.lineDash);
        if (ki === 1) {
            ctx.fillStyle = '#fff';
        }
        else if (ki === -1) {
            ctx.fillStyle = '#000';
        }
        else {
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
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        var size = s * 0.4;
        ctx.fillStyle = '#ffeb64';
        if (ki === 1 || ki === -1) {
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
// browser code
if (typeof window !== 'undefined') {
    dpr = window.devicePixelRatio || 1.0;
}
var GhostBan = /** @class */ (function () {
    function GhostBan(options) {
        var _a;
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
            boardEdgeLineWidth: 5,
            boardLineWidth: 1,
            boardLineExtent: 0.5,
            themeFlatBoardColor: '#ECB55A',
            positiveNodeColor: '#4d7c0f',
            negativeNodeColor: '#b91c1c',
            neutralNodeColor: '#a16207',
            defaultNodeColor: '#404040',
            warningNodeColor: '#ffdf20',
            themeResources: THEME_RESOURCES,
            moveSound: false,
            adaptiveStarSize: true,
            starSize: 3,
            mobileIndicatorOffset: 0,
        };
        this.cursor = exports.Cursor.None;
        this.cursorValue = '';
        this.touchMoving = false;
        this.touchStartPoint = new DOMPoint();
        this.cursorPoint = new DOMPoint();
        this.actualCursorPoint = new DOMPoint();
        this.setCursorWithRender = function (domPoint, offsetY) {
            var _a, _b;
            if (offsetY === void 0) { offsetY = 0; }
            // space need recalculate every time
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
            // if (
            //   !isMobileDevice() ||
            //   (isMobileDevice() && this.mat?.[idx - 1]?.[idy - 1] === 0)
            // ) {
            // }
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
                // Will always clear the right space
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
                // const {x: ox, y: oy} = reverseOffset(mat, idObj.bx, idObj.by);
                // let {x: i, y: j} = a1ToPos(m.move);
                // i += ox;
                // j += oy;
                // let analysisBoardSize = forceAnalysisBoardSize || boardSize;
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
                    theme !== exports.Theme.Flat) {
                    ctx.shadowOffsetX = 3;
                    ctx.shadowOffsetY = 3;
                    ctx.shadowColor = '#555';
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
                    outlineColor = _this.options.positiveNodeColor;
                }
                if (markup[i][j].includes(exports.Markup.NegativeNode)) {
                    outlineColor = _this.options.negativeNodeColor;
                }
                if (markup[i][j].includes(exports.Markup.NeutralNode)) {
                    outlineColor = _this.options.neutralNodeColor;
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
                                            markup_1 = new CircleMarkup(ctx, x, y, space, ki);
                                            break;
                                        }
                                        case exports.Markup.Current: {
                                            markup_1 = new CircleSolidMarkup(ctx, x, y, space, ki);
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
                                            markup_1 = new ActiveNodeMarkup(ctx, x, y, space, ki, exports.Markup.Circle);
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
                                            markup_1 = new NodeMarkup(ctx, x, y, space, ki, exports.Markup.Circle);
                                            markup_1.setColor(color);
                                            markup_1.setLineDash(lineDash);
                                            break;
                                        }
                                        case exports.Markup.Square: {
                                            markup_1 = new SquareMarkup(ctx, x, y, space, ki);
                                            break;
                                        }
                                        case exports.Markup.Triangle: {
                                            markup_1 = new TriangleMarkup(ctx, x, y, space, ki);
                                            break;
                                        }
                                        case exports.Markup.Cross: {
                                            markup_1 = new CrossMarkup(ctx, x, y, space, ki);
                                            break;
                                        }
                                        case exports.Markup.Highlight: {
                                            markup_1 = new HighlightMarkup(ctx, x, y, space, ki);
                                            break;
                                        }
                                        default: {
                                            if (value !== '') {
                                                markup_1 = new TextMarkup(ctx, x, y, space, ki, value);
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
                    if (theme === exports.Theme.BlackAndWhite) {
                        board.style.boxShadow = '0px 0px 0px #000000';
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(-padding, -padding, board.width + padding, board.height + padding);
                    }
                    else if (theme === exports.Theme.Flat) {
                        ctx.fillStyle = _this.options.themeFlatBoardColor;
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
            var _a = _this, visibleArea = _a.visibleArea, options = _a.options;
            var zoom = options.zoom, boardSize = options.boardSize, boardLineWidth = options.boardLineWidth, boardEdgeLineWidth = options.boardEdgeLineWidth, boardLineExtent = options.boardLineExtent, adaptiveBoardLine = options.adaptiveBoardLine;
            var ctx = board.getContext('2d');
            if (ctx) {
                var _b = _this.calcSpaceAndPadding(), space = _b.space, scaledPadding = _b.scaledPadding;
                var extendSpace = zoom ? boardLineExtent * space : 0;
                ctx.fillStyle = '#000000';
                var edgeLineWidth = adaptiveBoardLine
                    ? board.width * 0.002
                    : boardEdgeLineWidth;
                // if (adaptiveBoardLine || (!adaptiveBoardLine && !isMobileDevice())) {
                //  edgeLineWidth *= dpr;
                // }
                var lineWidth = adaptiveBoardLine ? board.width * 0.001 : boardLineWidth;
                // if (adaptiveBoardLine ||  (!adaptiveBoardLine && !isMobileDevice())) {
                //   lineWidth *= dpr;
                // }
                // vertical
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
                        ctx.lineWidth = ctx.lineWidth * 2;
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
                // horizontal
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
                        ctx.lineWidth = ctx.lineWidth * 2;
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
            var _a = _this.options, starSizeOptions = _a.starSize, adaptiveStarSize = _a.adaptiveStarSize;
            var visibleArea = _this.visibleArea;
            var ctx = board.getContext('2d');
            var starSize = adaptiveStarSize ? board.width * 0.0035 : starSizeOptions;
            // if (!isMobileDevice() || !adaptiveStarSize) {
            //   starSize = starSize * dpr;
            // }
            if (ctx) {
                var _b = _this.calcSpaceAndPadding(), space_1 = _b.space, scaledPadding_1 = _b.scaledPadding;
                // Drawing star
                ctx.stroke();
                [3, 9, 15].forEach(function (i) {
                    [3, 9, 15].forEach(function (j) {
                        if (i >= visibleArea[0][0] &&
                            i <= visibleArea[0][1] &&
                            j >= visibleArea[1][0] &&
                            j <= visibleArea[1][1]) {
                            ctx.beginPath();
                            ctx.arc(i * space_1 + scaledPadding_1, j * space_1 + scaledPadding_1, starSize, 0, 2 * Math.PI, true);
                            ctx.fillStyle = 'black';
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
            var boardSize = options.boardSize; options.zoom; var padding = options.padding, boardLineExtent = options.boardLineExtent;
            var zoomedBoardSize = visibleArea[0][1] - visibleArea[0][0] + 1;
            var ctx = board.getContext('2d');
            var _b = _this.calcSpaceAndPadding(), space = _b.space, scaledPadding = _b.scaledPadding;
            if (ctx) {
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#000000';
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
                var _a = _this.options, padding = _a.padding, boardSize = _a.boardSize, boardLineExtent = _a.boardLineExtent, zoom = _a.zoom;
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
                // const divisor = boardSize;
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
                var padding = _this.options.padding;
                var ctx = canvas.getContext('2d');
                var space = _this.calcSpaceAndPadding().space;
                var _c = _this, visibleArea = _c.visibleArea, cursor = _c.cursor, cursorValue = _c.cursorValue;
                var _d = tslib.__read(_this.cursorPosition, 2), idx = _d[0], idy = _d[1];
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
                        cur = new CircleMarkup(ctx, x, y, space, ki);
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (cursor === exports.Cursor.Square) {
                        cur = new SquareMarkup(ctx, x, y, space, ki);
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (cursor === exports.Cursor.Triangle) {
                        cur = new TriangleMarkup(ctx, x, y, space, ki);
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (cursor === exports.Cursor.Cross) {
                        cur = new CrossMarkup(ctx, x, y, space, ki);
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (cursor === exports.Cursor.Text) {
                        cur = new TextMarkup(ctx, x, y, space, ki, cursorValue);
                        cur.setGlobalAlpha(0.8);
                    }
                    else if (ki === exports.Ki.Empty && cursor === exports.Cursor.BlackStone) {
                        cur = new ColorStone(ctx, x, y, exports.Ki.Black);
                        cur.setSize(size);
                        cur.setGlobalAlpha(0.5);
                    }
                    else if (ki === exports.Ki.Empty && cursor === exports.Cursor.WhiteStone) {
                        cur = new ColorStone(ctx, x, y, exports.Ki.White);
                        cur.setSize(size);
                        cur.setGlobalAlpha(0.5);
                    }
                    else if (cursor === exports.Cursor.Clear) {
                        cur = new ColorStone(ctx, x, y, exports.Ki.Empty);
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
                                    theme !== exports.Theme.Flat) {
                                    ctx.shadowOffsetX = 3;
                                    ctx.shadowOffsetY = 3;
                                    ctx.shadowColor = '#555';
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
                                    case exports.Theme.Flat: {
                                        stone = new ColorStone(ctx, x, y, value);
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
        this.options = tslib.__assign(tslib.__assign({}, this.defaultOptions), options);
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
        var defaultDashedLineDash = [8, 6];
        var defaultDottedLineDash = [4, 4];
        this.nodeMarkupStyles = (_a = {},
            _a[exports.Markup.PositiveNode] = {
                color: this.options.positiveNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.NegativeNode] = {
                color: this.options.negativeNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.NeutralNode] = {
                color: this.options.neutralNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.DefaultNode] = {
                color: this.options.defaultNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.WarningNode] = {
                color: this.options.warningNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.PositiveDashedNode] = {
                color: this.options.positiveNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.NegativeDashedNode] = {
                color: this.options.negativeNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.NeutralDashedNode] = {
                color: this.options.neutralNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.DefaultDashedNode] = {
                color: this.options.defaultNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.WarningDashedNode] = {
                color: this.options.warningNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.PositiveDottedNode] = {
                color: this.options.positiveNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.NegativeDottedNode] = {
                color: this.options.negativeNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.NeutralDottedNode] = {
                color: this.options.neutralNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.DefaultDottedNode] = {
                color: this.options.defaultNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.WarningDottedNode] = {
                color: this.options.warningNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.PositiveActiveNode] = {
                color: this.options.positiveNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.NegativeActiveNode] = {
                color: this.options.negativeNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.NeutralActiveNode] = {
                color: this.options.neutralNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.DefaultActiveNode] = {
                color: this.options.defaultNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.WarningActiveNode] = {
                color: this.options.warningNodeColor,
                lineDash: [],
            },
            _a[exports.Markup.PositiveDashedActiveNode] = {
                color: this.options.positiveNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.NegativeDashedActiveNode] = {
                color: this.options.negativeNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.NeutralDashedActiveNode] = {
                color: this.options.neutralNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.DefaultDashedActiveNode] = {
                color: this.options.defaultNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.WarningDashedActiveNode] = {
                color: this.options.warningNodeColor,
                lineDash: defaultDashedLineDash,
            },
            _a[exports.Markup.PositiveDottedActiveNode] = {
                color: this.options.positiveNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.NegativeDottedActiveNode] = {
                color: this.options.negativeNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.NeutralDottedActiveNode] = {
                color: this.options.neutralNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.DefaultDottedActiveNode] = {
                color: this.options.defaultNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a[exports.Markup.WarningDottedActiveNode] = {
                color: this.options.warningNodeColor,
                lineDash: defaultDottedLineDash,
            },
            _a);
    }
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
        dom.innerHTML = ''; // Clear existing children
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
        this.options = tslib.__assign(tslib.__assign({}, this.options), options);
        // The onMouseMove event needs to be re-added after the options are updated
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
        this.options = tslib.__assign(tslib.__assign(tslib.__assign({}, this.options), { theme: theme }), options);
        preload(lodash.compact(tslib.__spreadArray(tslib.__spreadArray([board], tslib.__read(blacks), false), tslib.__read(whites), false)), function () {
            _this.drawBoard();
            _this.render();
        });
        this.drawBoard();
        this.render();
    };
    GhostBan.prototype.calcDynamicPadding = function (visibleAreaSize) {
        var coordinate = this.options.coordinate;
        // let padding = 30;
        // if (visibleAreaSize <= 3) {
        //   padding = coordinate ? 120 : 100;
        // } else if (visibleAreaSize <= 6) {
        //   padding = coordinate ? 80 : 60;
        // } else if (visibleAreaSize <= 9) {
        //   padding = coordinate ? 60 : 50;
        // } else if (visibleAreaSize <= 12) {
        //   padding = coordinate ? 50 : 40;
        // } else if (visibleAreaSize <= 15) {
        //   padding = coordinate ? 40 : 30;
        // } else if (visibleAreaSize <= 17) {
        //   padding = coordinate ? 35 : 25;
        // } else if (visibleAreaSize <= 19) {
        //   padding = coordinate ? 30 : 20;
        // }
        var canvas = this.canvas;
        if (!canvas)
            return;
        var padding = canvas.width / (visibleAreaSize + 2) / 2;
        var paddingWithoutCoordinate = canvas.width / (visibleAreaSize + 2) / 4;
        this.options.padding = coordinate ? padding : paddingWithoutCoordinate;
        // this.renderInteractive();
    };
    GhostBan.prototype.zoomBoard = function (zoom) {
        if (zoom === void 0) { zoom = false; }
        var _a = this, canvas = _a.canvas, analysisCanvas = _a.analysisCanvas, board = _a.board, cursorCanvas = _a.cursorCanvas, markupCanvas = _a.markupCanvas, effectCanvas = _a.effectCanvas;
        if (!canvas)
            return;
        var _b = this.options, boardSize = _b.boardSize, extent = _b.extent, boardLineExtent = _b.boardLineExtent, padding = _b.padding, dynamicPadding = _b.dynamicPadding;
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
                    // for padding
                    padding * scale -
                    padding -
                    // for board line extent
                    (space * extraVisibleSize * scale) / 2 +
                    (space * scale) / 2;
                var offsetY = visibleArea[1][0] * space * scale +
                    // for padding
                    padding * scale -
                    padding -
                    // for board line extent
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
        // TODO: calc visible area twice is not good, need to refactor
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL2NvcmUvbWVyZ2Vzb3J0LnRzIiwiLi4vLi4vY29yZS90cmVlLnRzIiwiLi4vLi4vY29yZS9oZWxwZXJzLnRzIiwiLi4vLi4vdHlwZXMudHMiLCIuLi8uLi9jb25zdC50cyIsIi4uLy4uL2NvcmUvcHJvcHMudHMiLCIuLi8uLi9ib2FyZGNvcmUudHMiLCIuLi8uLi9jb3JlL3NnZi50cyIsIi4uLy4uL2hlbHBlci50cyIsIi4uLy4uL3N0b25lcy9iYXNlLnRzIiwiLi4vLi4vc3RvbmVzL0NvbG9yU3RvbmUudHMiLCIuLi8uLi9zdG9uZXMvSW1hZ2VTdG9uZS50cyIsIi4uLy4uL3N0b25lcy9BbmFseXNpc1BvaW50LnRzIiwiLi4vLi4vbWFya3Vwcy9NYXJrdXBCYXNlLnRzIiwiLi4vLi4vbWFya3Vwcy9DaXJjbGVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL0Nyb3NzTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9UZXh0TWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9TcXVhcmVNYXJrdXAudHMiLCIuLi8uLi9tYXJrdXBzL1RyaWFuZ2xlTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9Ob2RlTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9BY3RpdmVOb2RlTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9DaXJjbGVTb2xpZE1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvSGlnaGxpZ2h0TWFya3VwLnRzIiwiLi4vLi4vZWZmZWN0cy9FZmZlY3RCYXNlLnRzIiwiLi4vLi4vZWZmZWN0cy9CYW5FZmZlY3QudHMiLCIuLi8uLi9naG9zdGJhbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBDb21wYXJhdG9yPFQ+ID0gKGE6IFQsIGI6IFQpID0+IG51bWJlcjtcblxuLyoqXG4gKiBTb3J0IGFuIGFycmF5IHVzaW5nIHRoZSBtZXJnZSBzb3J0IGFsZ29yaXRobS5cbiAqXG4gKiBAcGFyYW0gY29tcGFyYXRvckZuIFRoZSBjb21wYXJhdG9yIGZ1bmN0aW9uLlxuICogQHBhcmFtIGFyciBUaGUgYXJyYXkgdG8gc29ydC5cbiAqIEByZXR1cm5zIFRoZSBzb3J0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlU29ydDxUPihjb21wYXJhdG9yRm46IENvbXBhcmF0b3I8VD4sIGFycjogVFtdKTogVFtdIHtcbiAgY29uc3QgbGVuID0gYXJyLmxlbmd0aDtcbiAgaWYgKGxlbiA+PSAyKSB7XG4gICAgY29uc3QgZmlyc3RIYWxmID0gYXJyLnNsaWNlKDAsIGxlbiAvIDIpO1xuICAgIGNvbnN0IHNlY29uZEhhbGYgPSBhcnIuc2xpY2UobGVuIC8gMiwgbGVuKTtcbiAgICByZXR1cm4gbWVyZ2UoXG4gICAgICBjb21wYXJhdG9yRm4sXG4gICAgICBtZXJnZVNvcnQoY29tcGFyYXRvckZuLCBmaXJzdEhhbGYpLFxuICAgICAgbWVyZ2VTb3J0KGNvbXBhcmF0b3JGbiwgc2Vjb25kSGFsZilcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhcnIuc2xpY2UoKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBtZXJnZSBwYXJ0IG9mIHRoZSBtZXJnZSBzb3J0IGFsZ29yaXRobS5cbiAqXG4gKiBAcGFyYW0gY29tcGFyYXRvckZuIFRoZSBjb21wYXJhdG9yIGZ1bmN0aW9uLlxuICogQHBhcmFtIGFycjEgVGhlIGZpcnN0IHNvcnRlZCBhcnJheS5cbiAqIEBwYXJhbSBhcnIyIFRoZSBzZWNvbmQgc29ydGVkIGFycmF5LlxuICogQHJldHVybnMgVGhlIG1lcmdlZCBhbmQgc29ydGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBtZXJnZTxUPihjb21wYXJhdG9yRm46IENvbXBhcmF0b3I8VD4sIGFycjE6IFRbXSwgYXJyMjogVFtdKTogVFtdIHtcbiAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcbiAgbGV0IGxlZnQxID0gYXJyMS5sZW5ndGg7XG4gIGxldCBsZWZ0MiA9IGFycjIubGVuZ3RoO1xuXG4gIHdoaWxlIChsZWZ0MSA+IDAgJiYgbGVmdDIgPiAwKSB7XG4gICAgaWYgKGNvbXBhcmF0b3JGbihhcnIxWzBdLCBhcnIyWzBdKSA8PSAwKSB7XG4gICAgICByZXN1bHQucHVzaChhcnIxLnNoaWZ0KCkhKTsgLy8gbm9uLW51bGwgYXNzZXJ0aW9uOiBzYWZlIHNpbmNlIHdlIGp1c3QgY2hlY2tlZCBsZW5ndGhcbiAgICAgIGxlZnQxLS07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFycjIuc2hpZnQoKSEpO1xuICAgICAgbGVmdDItLTtcbiAgICB9XG4gIH1cblxuICBpZiAobGVmdDEgPiAwKSB7XG4gICAgcmVzdWx0LnB1c2goLi4uYXJyMSk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0LnB1c2goLi4uYXJyMik7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtZXJnZVNvcnQ7XG4iLCJpbXBvcnQgbWVyZ2VTb3J0IGZyb20gJy4vbWVyZ2Vzb3J0JztcbmltcG9ydCB7U2dmTm9kZX0gZnJvbSAnLi90eXBlcyc7XG5cbmZ1bmN0aW9uIGZpbmRJbnNlcnRJbmRleDxUPihcbiAgY29tcGFyYXRvckZuOiAoYTogVCwgYjogVCkgPT4gbnVtYmVyLFxuICBhcnI6IFRbXSxcbiAgZWw6IFRcbik6IG51bWJlciB7XG4gIGxldCBpOiBudW1iZXI7XG4gIGNvbnN0IGxlbiA9IGFyci5sZW5ndGg7XG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChjb21wYXJhdG9yRm4oYXJyW2ldLCBlbCkgPiAwKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGk7XG59XG5cbnR5cGUgQ29tcGFyYXRvcjxUPiA9IChhOiBULCBiOiBUKSA9PiBudW1iZXI7XG5cbmludGVyZmFjZSBUcmVlTW9kZWxDb25maWc8VD4ge1xuICBjaGlsZHJlblByb3BlcnR5TmFtZT86IHN0cmluZztcbiAgbW9kZWxDb21wYXJhdG9yRm4/OiBDb21wYXJhdG9yPFQ+O1xufVxuXG5jbGFzcyBUTm9kZSB7XG4gIGNvbmZpZzogVHJlZU1vZGVsQ29uZmlnPFNnZk5vZGU+O1xuICBtb2RlbDogU2dmTm9kZTtcbiAgY2hpbGRyZW46IFROb2RlW10gPSBbXTtcbiAgcGFyZW50PzogVE5vZGU7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUcmVlTW9kZWxDb25maWc8U2dmTm9kZT4sIG1vZGVsOiBTZ2ZOb2RlKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICB9XG5cbiAgaXNSb290KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgfVxuXG4gIGFkZENoaWxkKGNoaWxkOiBUTm9kZSk6IFROb2RlIHtcbiAgICByZXR1cm4gYWRkQ2hpbGQodGhpcywgY2hpbGQpO1xuICB9XG5cbiAgYWRkQ2hpbGRBdEluZGV4KGNoaWxkOiBUTm9kZSwgaW5kZXg6IG51bWJlcik6IFROb2RlIHtcbiAgICBpZiAodGhpcy5jb25maWcubW9kZWxDb21wYXJhdG9yRm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhZGQgY2hpbGQgYXQgaW5kZXggd2hlbiB1c2luZyBhIGNvbXBhcmF0b3IgZnVuY3Rpb24uJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wID0gdGhpcy5jb25maWcuY2hpbGRyZW5Qcm9wZXJ0eU5hbWUgfHwgJ2NoaWxkcmVuJztcbiAgICBpZiAoISh0aGlzLm1vZGVsIGFzIGFueSlbcHJvcF0pIHtcbiAgICAgICh0aGlzLm1vZGVsIGFzIGFueSlbcHJvcF0gPSBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RlbENoaWxkcmVuID0gKHRoaXMubW9kZWwgYXMgYW55KVtwcm9wXTtcblxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGluZGV4LicpO1xuICAgIH1cblxuICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgbW9kZWxDaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNoaWxkLm1vZGVsKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9XG5cbiAgZ2V0UGF0aCgpOiBUTm9kZVtdIHtcbiAgICBjb25zdCBwYXRoOiBUTm9kZVtdID0gW107XG4gICAgbGV0IGN1cnJlbnQ6IFROb2RlIHwgdW5kZWZpbmVkID0gdGhpcztcbiAgICB3aGlsZSAoY3VycmVudCkge1xuICAgICAgcGF0aC51bnNoaWZ0KGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gcGF0aDtcbiAgfVxuXG4gIGdldEluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaXNSb290KCkgPyAwIDogdGhpcy5wYXJlbnQhLmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gIH1cblxuICBzZXRJbmRleChpbmRleDogbnVtYmVyKTogdGhpcyB7XG4gICAgaWYgKHRoaXMuY29uZmlnLm1vZGVsQ29tcGFyYXRvckZuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDYW5ub3Qgc2V0IG5vZGUgaW5kZXggd2hlbiB1c2luZyBhIGNvbXBhcmF0b3IgZnVuY3Rpb24uJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGluZGV4LicpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm9kZSBoYXMgbm8gcGFyZW50LicpO1xuICAgIH1cblxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5wYXJlbnQuY2hpbGRyZW47XG4gICAgY29uc3QgbW9kZWxTaWJsaW5ncyA9ICh0aGlzLnBhcmVudC5tb2RlbCBhcyBhbnkpW1xuICAgICAgdGhpcy5jb25maWcuY2hpbGRyZW5Qcm9wZXJ0eU5hbWUgfHwgJ2NoaWxkcmVuJ1xuICAgIF07XG5cbiAgICBjb25zdCBvbGRJbmRleCA9IHNpYmxpbmdzLmluZGV4T2YodGhpcyk7XG5cbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHNpYmxpbmdzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGluZGV4LicpO1xuICAgIH1cblxuICAgIHNpYmxpbmdzLnNwbGljZShpbmRleCwgMCwgc2libGluZ3Muc3BsaWNlKG9sZEluZGV4LCAxKVswXSk7XG4gICAgbW9kZWxTaWJsaW5ncy5zcGxpY2UoaW5kZXgsIDAsIG1vZGVsU2libGluZ3Muc3BsaWNlKG9sZEluZGV4LCAxKVswXSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHdhbGsoZm46IChub2RlOiBUTm9kZSkgPT4gYm9vbGVhbiB8IHZvaWQpOiB2b2lkIHtcbiAgICBjb25zdCB3YWxrUmVjdXJzaXZlID0gKG5vZGU6IFROb2RlKTogYm9vbGVhbiA9PiB7XG4gICAgICBpZiAoZm4obm9kZSkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHdhbGtSZWN1cnNpdmUoY2hpbGQpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICB3YWxrUmVjdXJzaXZlKHRoaXMpO1xuICB9XG5cbiAgZmlyc3QoZm46IChub2RlOiBUTm9kZSkgPT4gYm9vbGVhbik6IFROb2RlIHwgdW5kZWZpbmVkIHtcbiAgICBsZXQgcmVzdWx0OiBUTm9kZSB8IHVuZGVmaW5lZDtcbiAgICB0aGlzLndhbGsobm9kZSA9PiB7XG4gICAgICBpZiAoZm4obm9kZSkpIHtcbiAgICAgICAgcmVzdWx0ID0gbm9kZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBhbGwoZm46IChub2RlOiBUTm9kZSkgPT4gYm9vbGVhbik6IFROb2RlW10ge1xuICAgIGNvbnN0IHJlc3VsdDogVE5vZGVbXSA9IFtdO1xuICAgIHRoaXMud2Fsayhub2RlID0+IHtcbiAgICAgIGlmIChmbihub2RlKSkgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGRyb3AoKTogdGhpcyB7XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBjb25zdCBpZHggPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuICAgICAgICBjb25zdCBwcm9wID0gdGhpcy5jb25maWcuY2hpbGRyZW5Qcm9wZXJ0eU5hbWUgfHwgJ2NoaWxkcmVuJztcbiAgICAgICAgKHRoaXMucGFyZW50Lm1vZGVsIGFzIGFueSlbcHJvcF0uc3BsaWNlKGlkeCwgMSk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkQ2hpbGQocGFyZW50OiBUTm9kZSwgY2hpbGQ6IFROb2RlKTogVE5vZGUge1xuICBjb25zdCBwcm9wID0gcGFyZW50LmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nO1xuICBpZiAoIShwYXJlbnQubW9kZWwgYXMgYW55KVtwcm9wXSkge1xuICAgIChwYXJlbnQubW9kZWwgYXMgYW55KVtwcm9wXSA9IFtdO1xuICB9XG5cbiAgY29uc3QgbW9kZWxDaGlsZHJlbiA9IChwYXJlbnQubW9kZWwgYXMgYW55KVtwcm9wXTtcblxuICBjaGlsZC5wYXJlbnQgPSBwYXJlbnQ7XG4gIGlmIChwYXJlbnQuY29uZmlnLm1vZGVsQ29tcGFyYXRvckZuKSB7XG4gICAgY29uc3QgaW5kZXggPSBmaW5kSW5zZXJ0SW5kZXgoXG4gICAgICBwYXJlbnQuY29uZmlnLm1vZGVsQ29tcGFyYXRvckZuLFxuICAgICAgbW9kZWxDaGlsZHJlbixcbiAgICAgIGNoaWxkLm1vZGVsXG4gICAgKTtcbiAgICBtb2RlbENoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQubW9kZWwpO1xuICAgIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNoaWxkKTtcbiAgfSBlbHNlIHtcbiAgICBtb2RlbENoaWxkcmVuLnB1c2goY2hpbGQubW9kZWwpO1xuICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuY2xhc3MgVHJlZU1vZGVsIHtcbiAgY29uZmlnOiBUcmVlTW9kZWxDb25maWc8U2dmTm9kZT47XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUcmVlTW9kZWxDb25maWc8U2dmTm9kZT4gPSB7fSkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgY2hpbGRyZW5Qcm9wZXJ0eU5hbWU6IGNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSB8fCAnY2hpbGRyZW4nLFxuICAgICAgbW9kZWxDb21wYXJhdG9yRm46IGNvbmZpZy5tb2RlbENvbXBhcmF0b3JGbixcbiAgICB9O1xuICB9XG5cbiAgcGFyc2UobW9kZWw6IFNnZk5vZGUpOiBUTm9kZSB7XG4gICAgaWYgKHR5cGVvZiBtb2RlbCAhPT0gJ29iamVjdCcgfHwgbW9kZWwgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ01vZGVsIG11c3QgYmUgb2YgdHlwZSBvYmplY3QuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZSA9IG5ldyBUTm9kZSh0aGlzLmNvbmZpZywgbW9kZWwpO1xuICAgIGNvbnN0IHByb3AgPSB0aGlzLmNvbmZpZy5jaGlsZHJlblByb3BlcnR5TmFtZSE7XG4gICAgY29uc3QgY2hpbGRyZW4gPSAobW9kZWwgYXMgYW55KVtwcm9wXTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLm1vZGVsQ29tcGFyYXRvckZuKSB7XG4gICAgICAgIChtb2RlbCBhcyBhbnkpW3Byb3BdID0gbWVyZ2VTb3J0KFxuICAgICAgICAgIHRoaXMuY29uZmlnLm1vZGVsQ29tcGFyYXRvckZuLFxuICAgICAgICAgIGNoaWxkcmVuXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGNoaWxkTW9kZWwgb2YgKG1vZGVsIGFzIGFueSlbcHJvcF0pIHtcbiAgICAgICAgY29uc3QgY2hpbGROb2RlID0gdGhpcy5wYXJzZShjaGlsZE1vZGVsKTtcbiAgICAgICAgYWRkQ2hpbGQobm9kZSwgY2hpbGROb2RlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxufVxuXG5leHBvcnQge1RyZWVNb2RlbCwgVE5vZGUsIFRyZWVNb2RlbENvbmZpZ307XG4iLCJpbXBvcnQge2ZpbHRlciwgZmluZExhc3RJbmRleH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7VE5vZGV9IGZyb20gJy4vdHJlZSc7XG5pbXBvcnQge01vdmVQcm9wLCBTZ2ZQcm9wQmFzZX0gZnJvbSAnLi9wcm9wcyc7XG5cbmNvbnN0IFNwYXJrTUQ1ID0gcmVxdWlyZSgnc3BhcmstbWQ1Jyk7XG5cbmV4cG9ydCBjb25zdCBjYWxjSGFzaCA9IChcbiAgbm9kZTogVE5vZGUgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBtb3ZlUHJvcHM6IE1vdmVQcm9wW10gPSBbXVxuKTogc3RyaW5nID0+IHtcbiAgbGV0IGZ1bGxuYW1lID0gJ24nO1xuICBpZiAobW92ZVByb3BzLmxlbmd0aCA+IDApIHtcbiAgICBmdWxsbmFtZSArPSBgJHttb3ZlUHJvcHNbMF0udG9rZW59JHttb3ZlUHJvcHNbMF0udmFsdWV9YDtcbiAgfVxuICBpZiAobm9kZSkge1xuICAgIGNvbnN0IHBhdGggPSBub2RlLmdldFBhdGgoKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICBmdWxsbmFtZSA9IHBhdGgubWFwKG4gPT4gbi5tb2RlbC5pZCkuam9pbignPT4nKSArIGA9PiR7ZnVsbG5hbWV9YDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gU3BhcmtNRDUuaGFzaChmdWxsbmFtZSkuc2xpY2UoMCwgNik7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDaGFyYWN0ZXJJbk5vZGUoXG4gIHNnZjogc3RyaW5nLFxuICBuOiBudW1iZXIsXG4gIG5vZGVzID0gWydDJywgJ1RNJywgJ0dOJywgJ1BDJ11cbik6IGJvb2xlYW4ge1xuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cChgKCR7bm9kZXMuam9pbignfCcpfSlcXFxcWyhbXlxcXFxdXSopXFxcXF1gLCAnZycpO1xuICBsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG5cbiAgd2hpbGUgKChtYXRjaCA9IHBhdHRlcm4uZXhlYyhzZ2YpKSAhPT0gbnVsbCkge1xuICAgIGNvbnN0IGNvbnRlbnRTdGFydCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMV0ubGVuZ3RoICsgMTsgLy8gKzEgZm9yIHRoZSAnWydcbiAgICBjb25zdCBjb250ZW50RW5kID0gY29udGVudFN0YXJ0ICsgbWF0Y2hbMl0ubGVuZ3RoO1xuICAgIGlmIChuID49IGNvbnRlbnRTdGFydCAmJiBuIDw9IGNvbnRlbnRFbmQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxudHlwZSBSYW5nZSA9IFtudW1iZXIsIG51bWJlcl07XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE5vZGVSYW5nZXMoXG4gIHNnZjogc3RyaW5nLFxuICBrZXlzOiBzdHJpbmdbXSA9IFsnQycsICdUTScsICdHTicsICdQQyddXG4pOiBSYW5nZVtdIHtcbiAgY29uc3QgcmFuZ2VzOiBSYW5nZVtdID0gW107XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGBcXFxcYigke2tleXMuam9pbignfCcpfSlcXFxcWyhbXlxcXFxdXSopXFxcXF1gLCAnZycpO1xuXG4gIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcbiAgd2hpbGUgKChtYXRjaCA9IHBhdHRlcm4uZXhlYyhzZ2YpKSAhPT0gbnVsbCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGggKyAxO1xuICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgbWF0Y2hbMl0ubGVuZ3RoO1xuICAgIHJhbmdlcy5wdXNoKFtzdGFydCwgZW5kXSk7XG4gIH1cblxuICByZXR1cm4gcmFuZ2VzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbkFueVJhbmdlKGluZGV4OiBudW1iZXIsIHJhbmdlczogUmFuZ2VbXSk6IGJvb2xlYW4ge1xuICAvLyByYW5nZXMgbXVzdCBiZSBzb3J0ZWRcbiAgbGV0IGxlZnQgPSAwO1xuICBsZXQgcmlnaHQgPSByYW5nZXMubGVuZ3RoIC0gMTtcblxuICB3aGlsZSAobGVmdCA8PSByaWdodCkge1xuICAgIGNvbnN0IG1pZCA9IChsZWZ0ICsgcmlnaHQpID4+IDE7XG4gICAgY29uc3QgW3N0YXJ0LCBlbmRdID0gcmFuZ2VzW21pZF07XG5cbiAgICBpZiAoaW5kZXggPCBzdGFydCkge1xuICAgICAgcmlnaHQgPSBtaWQgLSAxO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPiBlbmQpIHtcbiAgICAgIGxlZnQgPSBtaWQgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBnZXREZWR1cGxpY2F0ZWRQcm9wcyA9ICh0YXJnZXRQcm9wczogU2dmUHJvcEJhc2VbXSkgPT4ge1xuICByZXR1cm4gZmlsdGVyKFxuICAgIHRhcmdldFByb3BzLFxuICAgIChwcm9wOiBTZ2ZQcm9wQmFzZSwgaW5kZXg6IG51bWJlcikgPT5cbiAgICAgIGluZGV4ID09PVxuICAgICAgZmluZExhc3RJbmRleChcbiAgICAgICAgdGFyZ2V0UHJvcHMsXG4gICAgICAgIChsYXN0UHJvOiBTZ2ZQcm9wQmFzZSkgPT5cbiAgICAgICAgICBwcm9wLnRva2VuID09PSBsYXN0UHJvLnRva2VuICYmIHByb3AudmFsdWUgPT09IGxhc3RQcm8udmFsdWVcbiAgICAgIClcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc01vdmVOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIHJldHVybiBuLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUm9vdE5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgcmV0dXJuIG4ubW9kZWwucm9vdFByb3BzLmxlbmd0aCA+IDAgfHwgbi5pc1Jvb3QoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1NldHVwTm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICByZXR1cm4gbi5tb2RlbC5zZXR1cFByb3BzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZU51bWJlciA9IChuOiBUTm9kZSwgcGFyZW50PzogVE5vZGUpID0+IHtcbiAgY29uc3QgcGF0aCA9IG4uZ2V0UGF0aCgpO1xuICBsZXQgbW92ZXNDb3VudCA9IHBhdGguZmlsdGVyKG4gPT4gaXNNb3ZlTm9kZShuKSkubGVuZ3RoO1xuICBpZiAocGFyZW50KSB7XG4gICAgbW92ZXNDb3VudCArPSBwYXJlbnQuZ2V0UGF0aCgpLmZpbHRlcihuID0+IGlzTW92ZU5vZGUobikpLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gbW92ZXNDb3VudDtcbn07XG4iLCIvKipcbiAqIE9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIEdob3N0QmFuLlxuICovXG5leHBvcnQgdHlwZSBHaG9zdEJhbk9wdGlvbnMgPSB7XG4gIGJvYXJkU2l6ZTogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBkeW5hbWljUGFkZGluZzogYm9vbGVhbjtcbiAgcGFkZGluZzogbnVtYmVyO1xuICB6b29tPzogYm9vbGVhbjtcbiAgZXh0ZW50OiBudW1iZXI7XG4gIHRoZW1lOiBUaGVtZTtcbiAgYW5hbHlzaXNQb2ludFRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWU7XG4gIGNvb3JkaW5hdGU6IGJvb2xlYW47XG4gIGludGVyYWN0aXZlOiBib29sZWFuO1xuICBiYWNrZ3JvdW5kOiBib29sZWFuO1xuICBzaG93QW5hbHlzaXM6IGJvb2xlYW47XG4gIGFkYXB0aXZlQm9hcmRMaW5lOiBib29sZWFuO1xuICBib2FyZEVkZ2VMaW5lV2lkdGg6IG51bWJlcjtcbiAgYm9hcmRMaW5lV2lkdGg6IG51bWJlcjtcbiAgYm9hcmRMaW5lRXh0ZW50OiBudW1iZXI7XG4gIHRoZW1lRmxhdEJvYXJkQ29sb3I6IHN0cmluZztcbiAgcG9zaXRpdmVOb2RlQ29sb3I6IHN0cmluZztcbiAgbmVnYXRpdmVOb2RlQ29sb3I6IHN0cmluZztcbiAgbmV1dHJhbE5vZGVDb2xvcjogc3RyaW5nO1xuICBkZWZhdWx0Tm9kZUNvbG9yOiBzdHJpbmc7XG4gIHdhcm5pbmdOb2RlQ29sb3I6IHN0cmluZztcbiAgdGhlbWVSZXNvdXJjZXM6IFRoZW1lUmVzb3VyY2VzO1xuICBtb3ZlU291bmQ6IGJvb2xlYW47XG4gIHN0YXJTaXplOiBudW1iZXI7XG4gIGFkYXB0aXZlU3RhclNpemU6IGJvb2xlYW47XG4gIG1vYmlsZUluZGljYXRvck9mZnNldDogbnVtYmVyO1xuICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgR2hvc3RCYW5PcHRpb25zUGFyYW1zID0ge1xuICBib2FyZFNpemU/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIGR5bmFtaWNQYWRkaW5nPzogYm9vbGVhbjtcbiAgcGFkZGluZz86IG51bWJlcjtcbiAgem9vbT86IGJvb2xlYW47XG4gIGV4dGVudD86IG51bWJlcjtcbiAgdGhlbWU/OiBUaGVtZTtcbiAgYW5hbHlzaXNQb2ludFRoZW1lPzogQW5hbHlzaXNQb2ludFRoZW1lO1xuICBjb29yZGluYXRlPzogYm9vbGVhbjtcbiAgaW50ZXJhY3RpdmU/OiBib29sZWFuO1xuICBiYWNrZ3JvdW5kPzogYm9vbGVhbjtcbiAgc2hvd0FuYWx5c2lzPzogYm9vbGVhbjtcbiAgYWRhcHRpdmVCb2FyZExpbmU/OiBib29sZWFuO1xuICBib2FyZEVkZ2VMaW5lV2lkdGg/OiBudW1iZXI7XG4gIGJvYXJkTGluZVdpZHRoPzogbnVtYmVyO1xuICB0aGVtZUZsYXRCb2FyZENvbG9yPzogc3RyaW5nO1xuICBwb3NpdGl2ZU5vZGVDb2xvcj86IHN0cmluZztcbiAgbmVnYXRpdmVOb2RlQ29sb3I/OiBzdHJpbmc7XG4gIG5ldXRyYWxOb2RlQ29sb3I/OiBzdHJpbmc7XG4gIGRlZmF1bHROb2RlQ29sb3I/OiBzdHJpbmc7XG4gIHdhcm5pbmdOb2RlQ29sb3I/OiBzdHJpbmc7XG4gIHRoZW1lUmVzb3VyY2VzPzogVGhlbWVSZXNvdXJjZXM7XG4gIG1vdmVTb3VuZD86IGJvb2xlYW47XG4gIHN0YXJTaXplPzogbnVtYmVyO1xuICBhZGFwdGl2ZVN0YXJTaXplPzogYm9vbGVhbjtcbiAgZm9yY2VBbmFseXNpc0JvYXJkU2l6ZT86IG51bWJlcjtcbiAgbW9iaWxlSW5kaWNhdG9yT2Zmc2V0PzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgVGhlbWVSZXNvdXJjZXMgPSB7XG4gIFtrZXkgaW4gVGhlbWVdOiB7Ym9hcmQ/OiBzdHJpbmc7IGJsYWNrczogc3RyaW5nW107IHdoaXRlczogc3RyaW5nW119O1xufTtcblxuZXhwb3J0IHR5cGUgQ29uc3VtZWRBbmFseXNpcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNlcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaXNEdXJpbmdTZWFyY2g6IGJvb2xlYW47XG4gIG1vdmVJbmZvczogTW92ZUluZm9bXTtcbiAgcm9vdEluZm86IFJvb3RJbmZvO1xuICBwb2xpY3k6IG51bWJlcltdO1xuICBvd25lcnNoaXA6IG51bWJlcltdO1xuICB0dXJuTnVtYmVyOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpc1BhcmFtcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaW5pdGlhbFBsYXllcjogc3RyaW5nO1xuICBtb3ZlczogYW55W107XG4gIHJ1bGVzOiBzdHJpbmc7XG4gIGtvbWk6IHN0cmluZztcbiAgYm9hcmRYU2l6ZTogbnVtYmVyO1xuICBib2FyZFlTaXplOiBudW1iZXI7XG4gIGluY2x1ZGVQb2xpY3k6IGJvb2xlYW47XG4gIHByaW9yaXR5OiBudW1iZXI7XG4gIG1heFZpc2l0czogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgTW92ZUluZm8gPSB7XG4gIGlzU3ltbWV0cnlPZjogc3RyaW5nO1xuICBsY2I6IG51bWJlcjtcbiAgbW92ZTogc3RyaW5nO1xuICBvcmRlcjogbnVtYmVyO1xuICBwcmlvcjogbnVtYmVyO1xuICBwdjogc3RyaW5nW107XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZU1lYW46IG51bWJlcjtcbiAgc2NvcmVTZWxmUGxheTogbnVtYmVyO1xuICBzY29yZVN0ZGV2OiBudW1iZXI7XG4gIHV0aWxpdHk6IG51bWJlcjtcbiAgdXRpbGl0eUxjYjogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFJvb3RJbmZvID0ge1xuICAvLyBjdXJyZW50UGxheWVyIGlzIG5vdCBvZmZpY2lhbGx5IHBhcnQgb2YgdGhlIEdUUCByZXN1bHRzIGJ1dCBpdCBpcyBoZWxwZnVsIHRvIGhhdmUgaXQgaGVyZSB0byBhdm9pZCBwYXNzaW5nIGl0IHRocm91Z2ggdGhlIGFyZ3VtZW50c1xuICBjdXJyZW50UGxheWVyOiBzdHJpbmc7XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZVNlbGZwbGF5OiBudW1iZXI7XG4gIHNjb3JlU3RkZXY6IG51bWJlcjtcbiAgdXRpbGl0eTogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ/OiBudW1iZXI7XG4gIHJhd1N0V3JFcnJvcj86IG51bWJlcjtcbiAgcmF3U3RTY29yZUVycm9yPzogbnVtYmVyO1xuICByYXdWYXJUaW1lTGVmdD86IG51bWJlcjtcbiAgLy8gR1RQIHJlc3VsdHMgZG9uJ3QgaW5jbHVkZSB0aGUgZm9sbG93aW5nIGZpZWxkc1xuICBsY2I/OiBudW1iZXI7XG4gIHN5bUhhc2g/OiBzdHJpbmc7XG4gIHRoaXNIYXNoPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQW5hbHlzaXNQb2ludE9wdGlvbnMgPSB7XG4gIHNob3dPcmRlcj86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZW51bSBLaSB7XG4gIEJsYWNrID0gMSxcbiAgV2hpdGUgPSAtMSxcbiAgRW1wdHkgPSAwLFxufVxuXG5leHBvcnQgZW51bSBUaGVtZSB7XG4gIEJsYWNrQW5kV2hpdGUgPSAnYmxhY2tfYW5kX3doaXRlJyxcbiAgRmxhdCA9ICdmbGF0JyxcbiAgU3ViZHVlZCA9ICdzdWJkdWVkJyxcbiAgU2hlbGxTdG9uZSA9ICdzaGVsbF9zdG9uZScsXG4gIFNsYXRlQW5kU2hlbGwgPSAnc2xhdGVfYW5kX3NoZWxsJyxcbiAgV2FsbnV0ID0gJ3dhbG51dCcsXG4gIFBob3RvcmVhbGlzdGljID0gJ3Bob3RvcmVhbGlzdGljJyxcbn1cblxuZXhwb3J0IGVudW0gQW5hbHlzaXNQb2ludFRoZW1lIHtcbiAgRGVmYXVsdCA9ICdkZWZhdWx0JyxcbiAgUHJvYmxlbSA9ICdwcm9ibGVtJyxcbn1cblxuZXhwb3J0IGVudW0gQ2VudGVyIHtcbiAgTGVmdCA9ICdsJyxcbiAgUmlnaHQgPSAncicsXG4gIFRvcCA9ICd0JyxcbiAgQm90dG9tID0gJ2InLFxuICBUb3BSaWdodCA9ICd0cicsXG4gIFRvcExlZnQgPSAndGwnLFxuICBCb3R0b21MZWZ0ID0gJ2JsJyxcbiAgQm90dG9tUmlnaHQgPSAnYnInLFxuICBDZW50ZXIgPSAnYycsXG59XG5cbmV4cG9ydCBlbnVtIEVmZmVjdCB7XG4gIE5vbmUgPSAnJyxcbiAgQmFuID0gJ2JhbicsXG4gIERpbSA9ICdkaW0nLFxuICBIaWdobGlnaHQgPSAnaGlnaGxpZ2h0Jyxcbn1cblxuZXhwb3J0IGVudW0gTWFya3VwIHtcbiAgQ3VycmVudCA9ICdjdScsXG4gIENpcmNsZSA9ICdjaScsXG4gIENpcmNsZVNvbGlkID0gJ2NpcycsXG4gIFNxdWFyZSA9ICdzcScsXG4gIFNxdWFyZVNvbGlkID0gJ3NxcycsXG4gIFRyaWFuZ2xlID0gJ3RyaScsXG4gIENyb3NzID0gJ2NyJyxcbiAgTnVtYmVyID0gJ251bScsXG4gIExldHRlciA9ICdsZScsXG4gIFBvc2l0aXZlTm9kZSA9ICdwb3MnLFxuICBQb3NpdGl2ZUFjdGl2ZU5vZGUgPSAncG9zYScsXG4gIFBvc2l0aXZlRGFzaGVkTm9kZSA9ICdwb3NkYScsXG4gIFBvc2l0aXZlRG90dGVkTm9kZSA9ICdwb3NkdCcsXG4gIFBvc2l0aXZlRGFzaGVkQWN0aXZlTm9kZSA9ICdwb3NkYWEnLFxuICBQb3NpdGl2ZURvdHRlZEFjdGl2ZU5vZGUgPSAncG9zZHRhJyxcbiAgTmVnYXRpdmVOb2RlID0gJ25lZycsXG4gIE5lZ2F0aXZlQWN0aXZlTm9kZSA9ICduZWdhJyxcbiAgTmVnYXRpdmVEYXNoZWROb2RlID0gJ25lZ2RhJyxcbiAgTmVnYXRpdmVEb3R0ZWROb2RlID0gJ25lZ2R0JyxcbiAgTmVnYXRpdmVEYXNoZWRBY3RpdmVOb2RlID0gJ25lZ2RhYScsXG4gIE5lZ2F0aXZlRG90dGVkQWN0aXZlTm9kZSA9ICduZWdkdGEnLFxuICBOZXV0cmFsTm9kZSA9ICduZXUnLFxuICBOZXV0cmFsQWN0aXZlTm9kZSA9ICduZXVhJyxcbiAgTmV1dHJhbERhc2hlZE5vZGUgPSAnbmV1ZGEnLFxuICBOZXV0cmFsRG90dGVkTm9kZSA9ICduZXVkdCcsXG4gIE5ldXRyYWxEYXNoZWRBY3RpdmVOb2RlID0gJ25ldWR0YScsXG4gIE5ldXRyYWxEb3R0ZWRBY3RpdmVOb2RlID0gJ25ldWRhYScsXG4gIFdhcm5pbmdOb2RlID0gJ3dhJyxcbiAgV2FybmluZ0FjdGl2ZU5vZGUgPSAnd2FhJyxcbiAgV2FybmluZ0Rhc2hlZE5vZGUgPSAnd2FkYScsXG4gIFdhcm5pbmdEb3R0ZWROb2RlID0gJ3dhZHQnLFxuICBXYXJuaW5nRGFzaGVkQWN0aXZlTm9kZSA9ICd3YWRhYScsXG4gIFdhcm5pbmdEb3R0ZWRBY3RpdmVOb2RlID0gJ3dhZHRhJyxcbiAgRGVmYXVsdE5vZGUgPSAnZGUnLFxuICBEZWZhdWx0QWN0aXZlTm9kZSA9ICdkZWEnLFxuICBEZWZhdWx0RGFzaGVkTm9kZSA9ICdkZWRhJyxcbiAgRGVmYXVsdERvdHRlZE5vZGUgPSAnZGVkdCcsXG4gIERlZmF1bHREYXNoZWRBY3RpdmVOb2RlID0gJ2RlZGFhJyxcbiAgRGVmYXVsdERvdHRlZEFjdGl2ZU5vZGUgPSAnZGVkdGEnLFxuICBOb2RlID0gJ25vZGUnLFxuICBEYXNoZWROb2RlID0gJ2Rhbm9kZScsXG4gIERvdHRlZE5vZGUgPSAnZHRub2RlJyxcbiAgQWN0aXZlTm9kZSA9ICdhbm9kZScsXG4gIERhc2hlZEFjdGl2ZU5vZGUgPSAnZGFub2RlJyxcbiAgSGlnaGxpZ2h0ID0gJ2hsJyxcbiAgTm9uZSA9ICcnLFxufVxuXG5leHBvcnQgZW51bSBDdXJzb3Ige1xuICBOb25lID0gJycsXG4gIEJsYWNrU3RvbmUgPSAnYicsXG4gIFdoaXRlU3RvbmUgPSAndycsXG4gIENpcmNsZSA9ICdjJyxcbiAgU3F1YXJlID0gJ3MnLFxuICBUcmlhbmdsZSA9ICd0cmknLFxuICBDcm9zcyA9ICdjcicsXG4gIENsZWFyID0gJ2NsJyxcbiAgVGV4dCA9ICd0Jyxcbn1cblxuZXhwb3J0IGVudW0gUHJvYmxlbUFuc3dlclR5cGUge1xuICBSaWdodCA9ICcxJyxcbiAgV3JvbmcgPSAnMicsXG4gIFZhcmlhbnQgPSAnMycsXG59XG5cbmV4cG9ydCBlbnVtIFBhdGhEZXRlY3Rpb25TdHJhdGVneSB7XG4gIFBvc3QgPSAncG9zdCcsXG4gIFByZSA9ICdwcmUnLFxuICBCb3RoID0gJ2JvdGgnLFxufVxuIiwiaW1wb3J0IHtjaHVua30gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7VGhlbWV9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBzZXR0aW5ncyA9IHtjZG46ICdodHRwczovL3Muc2hhb3dxLmNvbSd9O1xuXG5leHBvcnQgY29uc3QgTUFYX0JPQVJEX1NJWkUgPSAyOTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0JPQVJEX1NJWkUgPSAxOTtcbmV4cG9ydCBjb25zdCBBMV9MRVRURVJTID0gW1xuICAnQScsXG4gICdCJyxcbiAgJ0MnLFxuICAnRCcsXG4gICdFJyxcbiAgJ0YnLFxuICAnRycsXG4gICdIJyxcbiAgJ0onLFxuICAnSycsXG4gICdMJyxcbiAgJ00nLFxuICAnTicsXG4gICdPJyxcbiAgJ1AnLFxuICAnUScsXG4gICdSJyxcbiAgJ1MnLFxuICAnVCcsXG5dO1xuZXhwb3J0IGNvbnN0IEExX0xFVFRFUlNfV0lUSF9JID0gW1xuICAnQScsXG4gICdCJyxcbiAgJ0MnLFxuICAnRCcsXG4gICdFJyxcbiAgJ0YnLFxuICAnRycsXG4gICdIJyxcbiAgJ0knLFxuICAnSicsXG4gICdLJyxcbiAgJ0wnLFxuICAnTScsXG4gICdOJyxcbiAgJ08nLFxuICAnUCcsXG4gICdRJyxcbiAgJ1InLFxuICAnUycsXG5dO1xuZXhwb3J0IGNvbnN0IEExX05VTUJFUlMgPSBbXG4gIDE5LCAxOCwgMTcsIDE2LCAxNSwgMTQsIDEzLCAxMiwgMTEsIDEwLCA5LCA4LCA3LCA2LCA1LCA0LCAzLCAyLCAxLFxuXTtcbmV4cG9ydCBjb25zdCBTR0ZfTEVUVEVSUyA9IFtcbiAgJ2EnLFxuICAnYicsXG4gICdjJyxcbiAgJ2QnLFxuICAnZScsXG4gICdmJyxcbiAgJ2cnLFxuICAnaCcsXG4gICdpJyxcbiAgJ2onLFxuICAnaycsXG4gICdsJyxcbiAgJ20nLFxuICAnbicsXG4gICdvJyxcbiAgJ3AnLFxuICAncScsXG4gICdyJyxcbiAgJ3MnLFxuXTtcbi8vIGV4cG9ydCBjb25zdCBCTEFOS19BUlJBWSA9IGNodW5rKG5ldyBBcnJheSgzNjEpLmZpbGwoMCksIDE5KTtcbmV4cG9ydCBjb25zdCBET1RfU0laRSA9IDM7XG5leHBvcnQgY29uc3QgRVhQQU5EX0ggPSA1O1xuZXhwb3J0IGNvbnN0IEVYUEFORF9WID0gNTtcbmV4cG9ydCBjb25zdCBSRVNQT05TRV9USU1FID0gMTAwO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBib2FyZFNpemU6IDE5LFxuICBwYWRkaW5nOiAxNSxcbiAgZXh0ZW50OiAyLFxuICBpbnRlcmFjdGl2ZTogZmFsc2UsXG4gIGNvb3JkaW5hdGU6IHRydWUsXG4gIHRoZW1lOiBUaGVtZS5GbGF0LFxuICBiYWNrZ3JvdW5kOiBmYWxzZSxcbiAgem9vbTogZmFsc2UsXG4gIHNob3dBbmFseXNpczogZmFsc2UsXG59O1xuXG5leHBvcnQgY29uc3QgVEhFTUVfUkVTT1VSQ0VTOiB7XG4gIFtrZXkgaW4gVGhlbWVdOiB7Ym9hcmQ/OiBzdHJpbmc7IGJsYWNrczogc3RyaW5nW107IHdoaXRlczogc3RyaW5nW119O1xufSA9IHtcbiAgW1RoZW1lLkJsYWNrQW5kV2hpdGVdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxuICBbVGhlbWUuU3ViZHVlZF06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc3ViZHVlZC9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3N1YmR1ZWQvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc3ViZHVlZC93aGl0ZS5wbmdgXSxcbiAgfSxcbiAgW1RoZW1lLlNoZWxsU3RvbmVdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTAucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMS5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUyLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTMucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlNC5wbmdgLFxuICAgIF0sXG4gIH0sXG4gIFtUaGVtZS5TbGF0ZUFuZFNoZWxsXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTEucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTIucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTMucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTQucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTUucG5nYCxcbiAgICBdLFxuICAgIHdoaXRlczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsMS5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsMi5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsMy5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsNC5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsNS5wbmdgLFxuICAgIF0sXG4gIH0sXG4gIFtUaGVtZS5XYWxudXRdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3dhbG51dC9ib2FyZC5qcGdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3dhbG51dC9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS93YWxudXQvd2hpdGUucG5nYF0sXG4gIH0sXG4gIFtUaGVtZS5QaG90b3JlYWxpc3RpY106IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvcGhvdG9yZWFsaXN0aWMvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9waG90b3JlYWxpc3RpYy9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9waG90b3JlYWxpc3RpYy93aGl0ZS5wbmdgXSxcbiAgfSxcbiAgW1RoZW1lLkZsYXRdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IExJR0hUX0dSRUVOX1JHQiA9ICdyZ2JhKDEzNiwgMTcwLCA2MCwgMSknO1xuZXhwb3J0IGNvbnN0IExJR0hUX1lFTExPV19SR0IgPSAncmdiYSgyMDYsIDIxMCwgODMsIDEpJztcbmV4cG9ydCBjb25zdCBZRUxMT1dfUkdCID0gJ3JnYmEoMjQyLCAyMTcsIDYwLCAxKSc7XG5leHBvcnQgY29uc3QgTElHSFRfUkVEX1JHQiA9ICdyZ2JhKDIzNiwgMTQ2LCA3MywgMSknO1xuIiwiZXhwb3J0IGNvbnN0IE1PVkVfUFJPUF9MSVNUID0gW1xuICAnQicsXG4gIC8vIEtPIGlzIHN0YW5kYXJkIGluIG1vdmUgbGlzdCBidXQgdXN1YWxseSBiZSB1c2VkIGZvciBrb21pIGluIGdhbWVpbmZvIHByb3BzXG4gIC8vICdLTycsXG4gICdNTicsXG4gICdXJyxcbl07XG5leHBvcnQgY29uc3QgU0VUVVBfUFJPUF9MSVNUID0gW1xuICAnQUInLFxuICAnQUUnLFxuICAnQVcnLFxuICAvL1RPRE86IFBMIGlzIGEgdmFsdWUgb2YgY29sb3IgdHlwZVxuICAvLyAnUEwnXG5dO1xuZXhwb3J0IGNvbnN0IE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QgPSBbXG4gICdBJyxcbiAgJ0MnLFxuICAnRE0nLFxuICAnR0InLFxuICAnR1cnLFxuICAnSE8nLFxuICAnTicsXG4gICdVQycsXG4gICdWJyxcbl07XG5leHBvcnQgY29uc3QgTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCA9IFtcbiAgJ0JNJyxcbiAgJ0RPJyxcbiAgJ0lUJyxcbiAgLy8gVEUgaXMgc3RhbmRhcmQgaW4gbW92ZSBhbm5vdGF0aW9uIGZvciB0ZXN1amlcbiAgLy8gJ1RFJyxcbl07XG5leHBvcnQgY29uc3QgTUFSS1VQX1BST1BfTElTVCA9IFtcbiAgJ0FSJyxcbiAgJ0NSJyxcbiAgJ0xCJyxcbiAgJ0xOJyxcbiAgJ01BJyxcbiAgJ1NMJyxcbiAgJ1NRJyxcbiAgJ1RSJyxcbl07XG5cbmV4cG9ydCBjb25zdCBST09UX1BST1BfTElTVCA9IFsnQVAnLCAnQ0EnLCAnRkYnLCAnR00nLCAnU1QnLCAnU1onXTtcbmV4cG9ydCBjb25zdCBHQU1FX0lORk9fUFJPUF9MSVNUID0gW1xuICAvL1RFIE5vbi1zdGFuZGFyZFxuICAnVEUnLFxuICAvL0tPIE5vbi1zdGFuZGFyZFxuICAnS08nLFxuICAnQU4nLFxuICAnQlInLFxuICAnQlQnLFxuICAnQ1AnLFxuICAnRFQnLFxuICAnRVYnLFxuICAnR04nLFxuICAnR0MnLFxuICAnT04nLFxuICAnT1QnLFxuICAnUEInLFxuICAnUEMnLFxuICAnUFcnLFxuICAnUkUnLFxuICAnUk8nLFxuICAnUlUnLFxuICAnU08nLFxuICAnVE0nLFxuICAnVVMnLFxuICAnV1InLFxuICAnV1QnLFxuXTtcbmV4cG9ydCBjb25zdCBUSU1JTkdfUFJPUF9MSVNUID0gWydCTCcsICdPQicsICdPVycsICdXTCddO1xuZXhwb3J0IGNvbnN0IE1JU0NFTExBTkVPVVNfUFJPUF9MSVNUID0gWydGRycsICdQTScsICdWVyddO1xuXG5leHBvcnQgY29uc3QgQ1VTVE9NX1BST1BfTElTVCA9IFsnUEknLCAnUEFJJywgJ05JRCcsICdQQVQnXTtcblxuZXhwb3J0IGNvbnN0IExJU1RfT0ZfUE9JTlRTX1BST1AgPSBbJ0FCJywgJ0FFJywgJ0FXJywgJ01BJywgJ1NMJywgJ1NRJywgJ1RSJ107XG5cbmNvbnN0IFRPS0VOX1JFR0VYID0gbmV3IFJlZ0V4cCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcblxuZXhwb3J0IGNsYXNzIFNnZlByb3BCYXNlIHtcbiAgcHVibGljIHRva2VuOiBzdHJpbmc7XG4gIHB1YmxpYyB0eXBlOiBzdHJpbmcgPSAnLSc7XG4gIHByb3RlY3RlZCBfdmFsdWU6IHN0cmluZyA9ICcnO1xuICBwcm90ZWN0ZWQgX3ZhbHVlczogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSBhcyBzdHJpbmc7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYCR7dGhpcy50b2tlbn0ke3RoaXMuX3ZhbHVlcy5tYXAodiA9PiBgWyR7dn1dYCkuam9pbignJyl9YDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW92ZVByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdtb3ZlJztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE1vdmVQcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE1vdmVQcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0dXBQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdzZXR1cCc7XG4gIH1cblxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IHRva2VuTWF0Y2ggPSBzdHIubWF0Y2goVE9LRU5fUkVHRVgpO1xuICAgIGNvbnN0IHZhbE1hdGNoZXMgPSBzdHIubWF0Y2hBbGwoL1xcWyhbXFxzXFxTXSo/KVxcXS9nKTtcblxuICAgIGxldCB0b2tlbiA9ICcnO1xuICAgIGNvbnN0IHZhbHMgPSBbLi4udmFsTWF0Y2hlc10ubWFwKG0gPT4gbVsxXSk7XG4gICAgaWYgKHRva2VuTWF0Y2gpIHRva2VuID0gdG9rZW5NYXRjaFsxXTtcbiAgICByZXR1cm4gbmV3IFNldHVwUHJvcCh0b2tlbiwgdmFscyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9kZUFubm90YXRpb25Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbm9kZS1hbm5vdGF0aW9uJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBOb2RlQW5ub3RhdGlvblByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZUFubm90YXRpb25Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW92ZUFubm90YXRpb25Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbW92ZS1hbm5vdGF0aW9uJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBNb3ZlQW5ub3RhdGlvblByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTW92ZUFubm90YXRpb25Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7fVxuZXhwb3J0IGNsYXNzIE1hcmt1cFByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ21hcmt1cCc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0b2tlbk1hdGNoID0gc3RyLm1hdGNoKFRPS0VOX1JFR0VYKTtcbiAgICBjb25zdCB2YWxNYXRjaGVzID0gc3RyLm1hdGNoQWxsKC9cXFsoW1xcc1xcU10qPylcXF0vZyk7XG5cbiAgICBsZXQgdG9rZW4gPSAnJztcbiAgICBjb25zdCB2YWxzID0gWy4uLnZhbE1hdGNoZXNdLm1hcChtID0+IG1bMV0pO1xuICAgIGlmICh0b2tlbk1hdGNoKSB0b2tlbiA9IHRva2VuTWF0Y2hbMV07XG4gICAgcmV0dXJuIG5ldyBNYXJrdXBQcm9wKHRva2VuLCB2YWxzKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb290UHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ3Jvb3QnO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IFJvb3RQcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJvb3RQcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2FtZUluZm9Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnZ2FtZS1pbmZvJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBHYW1lSW5mb1Byb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgR2FtZUluZm9Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbVByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdjdXN0b20nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IEN1c3RvbVByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ3VzdG9tUHJvcCgnJywgJycpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1pbmdQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnVGltaW5nJztcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWlzY2VsbGFuZW91c1Byb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7fVxuIiwiaW1wb3J0IHtjbG9uZURlZXB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1NHRl9MRVRURVJTfSBmcm9tICcuL2NvbnN0JztcblxuLy8gVE9ETzogRHVwbGljYXRlIHdpdGggaGVscGVycy50cyB0byBhdm9pZCBjaXJjdWxhciBkZXBlbmRlbmN5XG5leHBvcnQgY29uc3Qgc2dmVG9Qb3MgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qga2kgPSBzdHJbMF0gPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3QgdGVtcFN0ciA9IC9cXFsoLiopXFxdLy5leGVjKHN0cik7XG4gIGlmICh0ZW1wU3RyKSB7XG4gICAgY29uc3QgcG9zID0gdGVtcFN0clsxXTtcbiAgICBjb25zdCB4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihwb3NbMF0pO1xuICAgIGNvbnN0IHkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1sxXSk7XG4gICAgcmV0dXJuIHt4LCB5LCBraX07XG4gIH1cbiAgcmV0dXJuIHt4OiAtMSwgeTogLTEsIGtpOiAwfTtcbn07XG5cbmxldCBsaWJlcnRpZXMgPSAwO1xubGV0IHJlY3Vyc2lvblBhdGg6IHN0cmluZ1tdID0gW107XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc2l6ZSBvZiBhIG1hdHJpeC5cbiAqIEBwYXJhbSBtYXQgVGhlIG1hdHJpeCB0byBjYWxjdWxhdGUgdGhlIHNpemUgb2YuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1iZXIgb2Ygcm93cyBhbmQgY29sdW1ucyBpbiB0aGUgbWF0cml4LlxuICovXG5jb25zdCBjYWxjU2l6ZSA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgY29uc3Qgcm93c1NpemUgPSBtYXQubGVuZ3RoO1xuICBjb25zdCBjb2x1bW5zU2l6ZSA9IG1hdC5sZW5ndGggPiAwID8gbWF0WzBdLmxlbmd0aCA6IDA7XG4gIHJldHVybiBbcm93c1NpemUsIGNvbHVtbnNTaXplXTtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbGliZXJ0eSBvZiBhIHN0b25lIG9uIHRoZSBib2FyZC5cbiAqIEBwYXJhbSBtYXQgLSBUaGUgYm9hcmQgbWF0cml4LlxuICogQHBhcmFtIHggLSBUaGUgeC1jb29yZGluYXRlIG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSB5IC0gVGhlIHktY29vcmRpbmF0ZSBvZiB0aGUgc3RvbmUuXG4gKiBAcGFyYW0ga2kgLSBUaGUgdmFsdWUgb2YgdGhlIHN0b25lLlxuICovXG5jb25zdCBjYWxjTGliZXJ0eUNvcmUgPSAobWF0OiBudW1iZXJbXVtdLCB4OiBudW1iZXIsIHk6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCBzaXplID0gY2FsY1NpemUobWF0KTtcbiAgaWYgKHggPj0gMCAmJiB4IDwgc2l6ZVsxXSAmJiB5ID49IDAgJiYgeSA8IHNpemVbMF0pIHtcbiAgICBpZiAobWF0W3hdW3ldID09PSBraSAmJiAhcmVjdXJzaW9uUGF0aC5pbmNsdWRlcyhgJHt4fSwke3l9YCkpIHtcbiAgICAgIHJlY3Vyc2lvblBhdGgucHVzaChgJHt4fSwke3l9YCk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4IC0gMSwgeSwga2kpO1xuICAgICAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCArIDEsIHksIGtpKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHgsIHkgLSAxLCBraSk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4LCB5ICsgMSwga2kpO1xuICAgIH0gZWxzZSBpZiAobWF0W3hdW3ldID09PSAwKSB7XG4gICAgICBsaWJlcnRpZXMgKz0gMTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGNhbGNMaWJlcnR5ID0gKG1hdDogbnVtYmVyW11bXSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3Qgc2l6ZSA9IGNhbGNTaXplKG1hdCk7XG4gIGxpYmVydGllcyA9IDA7XG4gIHJlY3Vyc2lvblBhdGggPSBbXTtcblxuICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+IHNpemVbMV0gLSAxIHx8IHkgPiBzaXplWzBdIC0gMSkge1xuICAgIHJldHVybiB7XG4gICAgICBsaWJlcnR5OiA0LFxuICAgICAgcmVjdXJzaW9uUGF0aDogW10sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChtYXRbeF1beV0gPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGliZXJ0eTogNCxcbiAgICAgIHJlY3Vyc2lvblBhdGg6IFtdLFxuICAgIH07XG4gIH1cbiAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCwgeSwga2kpO1xuICByZXR1cm4ge1xuICAgIGxpYmVydHk6IGxpYmVydGllcyxcbiAgICByZWN1cnNpb25QYXRoLFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGV4ZWNDYXB0dXJlID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogbnVtYmVyXG4pID0+IHtcbiAgY29uc3QgbmV3QXJyYXkgPSBtYXQ7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5VXAsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhVcH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSxcbiAgICBqIC0gMSxcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eURvd24sIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhEb3dufSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogKyAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5TGVmdCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aExlZnR9ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGkgLSAxLFxuICAgIGosXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlSaWdodCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFJpZ2h0fSA9XG4gICAgY2FsY0xpYmVydHkobWF0LCBpICsgMSwgaiwga2kpO1xuICBpZiAobGliZXJ0eVVwID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aFVwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGl0ZW0uc3BsaXQoJywnKTtcbiAgICAgIG5ld0FycmF5W3BhcnNlSW50KGNvb3JkWzBdKV1bcGFyc2VJbnQoY29vcmRbMV0pXSA9IDA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGxpYmVydHlEb3duID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aERvd24uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICBpZiAobGliZXJ0eUxlZnQgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoTGVmdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdBcnJheVtwYXJzZUludChjb29yZFswXSldW3BhcnNlSW50KGNvb3JkWzFdKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIGlmIChsaWJlcnR5UmlnaHQgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoUmlnaHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbmV3QXJyYXk7XG59O1xuXG5jb25zdCBjYW5DYXB0dXJlID0gKG1hdDogbnVtYmVyW11bXSwgaTogbnVtYmVyLCBqOiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlVcCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFVwfSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogLSAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5RG93biwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aERvd259ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiArIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlMZWZ0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoTGVmdH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSAtIDEsXG4gICAgaixcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVJpZ2h0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoUmlnaHR9ID1cbiAgICBjYWxjTGliZXJ0eShtYXQsIGkgKyAxLCBqLCBraSk7XG4gIGlmIChsaWJlcnR5VXAgPT09IDAgJiYgcmVjdXJzaW9uUGF0aFVwLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobGliZXJ0eURvd24gPT09IDAgJiYgcmVjdXJzaW9uUGF0aERvd24ubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChsaWJlcnR5TGVmdCA9PT0gMCAmJiByZWN1cnNpb25QYXRoTGVmdC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGxpYmVydHlSaWdodCA9PT0gMCAmJiByZWN1cnNpb25QYXRoUmlnaHQubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYW5Nb3ZlID0gKG1hdDogbnVtYmVyW11bXSwgaTogbnVtYmVyLCBqOiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3QgbmV3QXJyYXkgPSBjbG9uZURlZXAobWF0KTtcbiAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm4gZmFsc2U7XG4gIGlmIChtYXRbaV1bal0gIT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBuZXdBcnJheVtpXVtqXSA9IGtpO1xuICBjb25zdCB7bGliZXJ0eX0gPSBjYWxjTGliZXJ0eShuZXdBcnJheSwgaSwgaiwga2kpO1xuICBpZiAoY2FuQ2FwdHVyZShuZXdBcnJheSwgaSwgaiwgLWtpKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChjYW5DYXB0dXJlKG5ld0FycmF5LCBpLCBqLCBraSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGxpYmVydHkgPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hvd0tpID0gKFxuICBhcnJheTogbnVtYmVyW11bXSxcbiAgc3RlcHM6IHN0cmluZ1tdLFxuICBpc0NhcHR1cmVkID0gdHJ1ZVxuKSA9PiB7XG4gIGxldCBuZXdNYXQgPSBjbG9uZURlZXAoYXJyYXkpO1xuICBsZXQgaGFzTW92ZWQgPSBmYWxzZTtcbiAgc3RlcHMuZm9yRWFjaChzdHIgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAga2ksXG4gICAgfToge1xuICAgICAgeDogbnVtYmVyO1xuICAgICAgeTogbnVtYmVyO1xuICAgICAga2k6IG51bWJlcjtcbiAgICB9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgICBpZiAoaXNDYXB0dXJlZCkge1xuICAgICAgaWYgKGNhbk1vdmUobmV3TWF0LCB4LCB5LCBraSkpIHtcbiAgICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICAgIG5ld01hdCA9IGV4ZWNDYXB0dXJlKG5ld01hdCwgeCwgeSwgLWtpKTtcbiAgICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJyYW5nZW1lbnQ6IG5ld01hdCxcbiAgICBoYXNNb3ZlZCxcbiAgfTtcbn07XG4iLCJpbXBvcnQge2NvbXBhY3QsIHJlcGxhY2V9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBidWlsZE5vZGVSYW5nZXMsXG4gIGlzSW5BbnlSYW5nZSxcbiAgY2FsY0hhc2gsXG4gIGdldERlZHVwbGljYXRlZFByb3BzLFxuICBnZXROb2RlTnVtYmVyLFxufSBmcm9tICcuL2hlbHBlcnMnO1xuXG5pbXBvcnQge1RyZWVNb2RlbCwgVE5vZGV9IGZyb20gJy4vdHJlZSc7XG5pbXBvcnQge1xuICBNb3ZlUHJvcCxcbiAgU2V0dXBQcm9wLFxuICBSb290UHJvcCxcbiAgR2FtZUluZm9Qcm9wLFxuICBTZ2ZQcm9wQmFzZSxcbiAgTm9kZUFubm90YXRpb25Qcm9wLFxuICBNb3ZlQW5ub3RhdGlvblByb3AsXG4gIE1hcmt1cFByb3AsXG4gIEN1c3RvbVByb3AsXG4gIFJPT1RfUFJPUF9MSVNULFxuICBNT1ZFX1BST1BfTElTVCxcbiAgU0VUVVBfUFJPUF9MSVNULFxuICBNQVJLVVBfUFJPUF9MSVNULFxuICBOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBHQU1FX0lORk9fUFJPUF9MSVNULFxuICBDVVNUT01fUFJPUF9MSVNULFxufSBmcm9tICcuL3Byb3BzJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIFNHRiAoU21hcnQgR2FtZSBGb3JtYXQpIGZpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZ2Yge1xuICBORVdfTk9ERSA9ICc7JztcbiAgQlJBTkNISU5HID0gWycoJywgJyknXTtcbiAgUFJPUEVSVFkgPSBbJ1snLCAnXSddO1xuICBMSVNUX0lERU5USVRJRVMgPSBbXG4gICAgJ0FXJyxcbiAgICAnQUInLFxuICAgICdBRScsXG4gICAgJ0FSJyxcbiAgICAnQ1InLFxuICAgICdERCcsXG4gICAgJ0xCJyxcbiAgICAnTE4nLFxuICAgICdNQScsXG4gICAgJ1NMJyxcbiAgICAnU1EnLFxuICAgICdUUicsXG4gICAgJ1ZXJyxcbiAgICAnVEInLFxuICAgICdUVycsXG4gIF07XG4gIE5PREVfREVMSU1JVEVSUyA9IFt0aGlzLk5FV19OT0RFXS5jb25jYXQodGhpcy5CUkFOQ0hJTkcpO1xuXG4gIHRyZWU6IFRyZWVNb2RlbCA9IG5ldyBUcmVlTW9kZWwoKTtcbiAgcm9vdDogVE5vZGUgfCBudWxsID0gbnVsbDtcbiAgbm9kZTogVE5vZGUgfCBudWxsID0gbnVsbDtcbiAgY3VycmVudE5vZGU6IFROb2RlIHwgbnVsbCA9IG51bGw7XG4gIHBhcmVudE5vZGU6IFROb2RlIHwgbnVsbCA9IG51bGw7XG4gIG5vZGVQcm9wczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgU2dmIGNsYXNzLlxuICAgKiBAcGFyYW0gY29udGVudCBUaGUgY29udGVudCBvZiB0aGUgU2dmLCBlaXRoZXIgYXMgYSBzdHJpbmcgb3IgYXMgYSBUTm9kZShSb290IG5vZGUpLlxuICAgKiBAcGFyYW0gcGFyc2VPcHRpb25zIFRoZSBvcHRpb25zIGZvciBwYXJzaW5nIHRoZSBTZ2YgY29udGVudC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY29udGVudD86IHN0cmluZyB8IFROb2RlLFxuICAgIHByaXZhdGUgcGFyc2VPcHRpb25zID0ge1xuICAgICAgaWdub3JlUHJvcExpc3Q6IFtdLFxuICAgIH1cbiAgKSB7XG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5wYXJzZShjb250ZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5zZXRSb290KGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSByb290IG5vZGUgb2YgdGhlIFNHRiB0cmVlLlxuICAgKlxuICAgKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCBub2RlIHRvIHNldC5cbiAgICogQHJldHVybnMgVGhlIHVwZGF0ZWQgU0dGIGluc3RhbmNlLlxuICAgKi9cbiAgc2V0Um9vdChyb290OiBUTm9kZSkge1xuICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGN1cnJlbnQgU0dGIHRyZWUgdG8gYW4gU0dGIHN0cmluZyByZXByZXNlbnRhdGlvbi5cbiAgICogQHJldHVybnMgVGhlIFNHRiBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyZWUuXG4gICAqL1xuICB0b1NnZigpIHtcbiAgICByZXR1cm4gYCgke3RoaXMubm9kZVRvU3RyaW5nKHRoaXMucm9vdCl9KWA7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGdhbWUgdHJlZSB0byBTR0YgZm9ybWF0IHdpdGhvdXQgaW5jbHVkaW5nIGFuYWx5c2lzIGRhdGEuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBTR0YgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWUgdHJlZS5cbiAgICovXG4gIHRvU2dmV2l0aG91dEFuYWx5c2lzKCkge1xuICAgIGNvbnN0IHNnZiA9IGAoJHt0aGlzLm5vZGVUb1N0cmluZyh0aGlzLnJvb3QpfSlgO1xuICAgIHJldHVybiByZXBsYWNlKHNnZiwgL10oQVxcWy4qP1xcXSkvZywgJ10nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZXMgdGhlIGdpdmVuIFNHRiAoU21hcnQgR2FtZSBGb3JtYXQpIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHNnZiAtIFRoZSBTR0Ygc3RyaW5nIHRvIHBhcnNlLlxuICAgKi9cbiAgcGFyc2Uoc2dmOiBzdHJpbmcpIHtcbiAgICBpZiAoIXNnZikgcmV0dXJuO1xuICAgIHNnZiA9IHNnZi5yZXBsYWNlKC9cXHMrKD8hW15cXFtcXF1dKl0pL2dtLCAnJyk7XG4gICAgbGV0IG5vZGVTdGFydCA9IDA7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGNvbnN0IHN0YWNrOiBUTm9kZVtdID0gW107XG5cbiAgICBjb25zdCBpbk5vZGVSYW5nZXMgPSBidWlsZE5vZGVSYW5nZXMoc2dmKS5zb3J0KChhLCBiKSA9PiBhWzBdIC0gYlswXSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNnZi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYyA9IHNnZltpXTtcbiAgICAgIGNvbnN0IGluc2lkZVByb3AgPSBpc0luQW55UmFuZ2UoaSwgaW5Ob2RlUmFuZ2VzKTtcblxuICAgICAgaWYgKHRoaXMuTk9ERV9ERUxJTUlURVJTLmluY2x1ZGVzKGMpICYmICFpbnNpZGVQcm9wKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBzZ2Yuc2xpY2Uobm9kZVN0YXJ0LCBpKTtcbiAgICAgICAgaWYgKGNvbnRlbnQgIT09ICcnKSB7XG4gICAgICAgICAgY29uc3QgbW92ZVByb3BzOiBNb3ZlUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3Qgc2V0dXBQcm9wczogU2V0dXBQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCByb290UHJvcHM6IFJvb3RQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBtYXJrdXBQcm9wczogTWFya3VwUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgZ2FtZUluZm9Qcm9wczogR2FtZUluZm9Qcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBub2RlQW5ub3RhdGlvblByb3BzOiBOb2RlQW5ub3RhdGlvblByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IG1vdmVBbm5vdGF0aW9uUHJvcHM6IE1vdmVBbm5vdGF0aW9uUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgY3VzdG9tUHJvcHM6IEN1c3RvbVByb3BbXSA9IFtdO1xuXG4gICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IFtcbiAgICAgICAgICAgIC4uLmNvbnRlbnQubWF0Y2hBbGwoXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvKFtBLVpdK1xcW1thLXpcXFtcXF1dKlxcXSspLywgJ2cnKVxuICAgICAgICAgICAgICAvLyBSZWdFeHAoLyhbQS1aXStcXFsuKj9cXF0rKS8sICdnJylcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC9bQS1aXSsoXFxbLio/XFxdKXsxLH0vLCAnZycpXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvW0EtWl0rKFxcW1tcXHNcXFNdKj9cXF0pezEsfS8sICdnJyksXG4gICAgICAgICAgICAgIFJlZ0V4cCgvXFx3KyhcXFtbXlxcXV0qP1xcXSg/Olxccj9cXG4/XFxzW15cXF1dKj8pKil7MSx9LywgJ2cnKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgbWF0Y2hlcy5mb3JFYWNoKG0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdG9rZW5NYXRjaCA9IG1bMF0ubWF0Y2goLyhbQS1aXSspXFxbLyk7XG4gICAgICAgICAgICBpZiAodG9rZW5NYXRjaCkge1xuICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2VuTWF0Y2hbMV07XG4gICAgICAgICAgICAgIGlmIChNT1ZFX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBtb3ZlUHJvcHMucHVzaChNb3ZlUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoU0VUVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHNldHVwUHJvcHMucHVzaChTZXR1cFByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKFJPT1RfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHJvb3RQcm9wcy5wdXNoKFJvb3RQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG1hcmt1cFByb3BzLnB1c2goTWFya3VwUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoR0FNRV9JTkZPX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBnYW1lSW5mb1Byb3BzLnB1c2goR2FtZUluZm9Qcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG5vZGVBbm5vdGF0aW9uUHJvcHMucHVzaChOb2RlQW5ub3RhdGlvblByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcy5wdXNoKE1vdmVBbm5vdGF0aW9uUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoQ1VTVE9NX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBjdXN0b21Qcm9wcy5wdXNoKEN1c3RvbVByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc2ggPSBjYWxjSGFzaCh0aGlzLmN1cnJlbnROb2RlLCBtb3ZlUHJvcHMpO1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMudHJlZS5wYXJzZSh7XG4gICAgICAgICAgICAgIGlkOiBoYXNoLFxuICAgICAgICAgICAgICBuYW1lOiBoYXNoLFxuICAgICAgICAgICAgICBpbmRleDogY291bnRlcixcbiAgICAgICAgICAgICAgbnVtYmVyOiAwLFxuICAgICAgICAgICAgICBtb3ZlUHJvcHMsXG4gICAgICAgICAgICAgIHNldHVwUHJvcHMsXG4gICAgICAgICAgICAgIHJvb3RQcm9wcyxcbiAgICAgICAgICAgICAgbWFya3VwUHJvcHMsXG4gICAgICAgICAgICAgIGdhbWVJbmZvUHJvcHMsXG4gICAgICAgICAgICAgIG5vZGVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgICAgICAgIG1vdmVBbm5vdGF0aW9uUHJvcHMsXG4gICAgICAgICAgICAgIGN1c3RvbVByb3BzLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlKSB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgICAgbm9kZS5tb2RlbC5udW1iZXIgPSBnZXROb2RlTnVtYmVyKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5yb290ID0gbm9kZTtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcoJyAmJiB0aGlzLmN1cnJlbnROb2RlICYmICFpbnNpZGVQcm9wKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3NnZltpXX0ke3NnZltpICsgMV19JHtzZ2ZbaSArIDJdfWApO1xuICAgICAgICBzdGFjay5wdXNoKHRoaXMuY3VycmVudE5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcpJyAmJiAhaW5zaWRlUHJvcCAmJiBzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5OT0RFX0RFTElNSVRFUlMuaW5jbHVkZXMoYykgJiYgIWluc2lkZVByb3ApIHtcbiAgICAgICAgbm9kZVN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBub2RlIHRvIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSAtIFRoZSBub2RlIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5vZGUuXG4gICAqL1xuICBwcml2YXRlIG5vZGVUb1N0cmluZyhub2RlOiBhbnkpIHtcbiAgICBsZXQgY29udGVudCA9ICcnO1xuICAgIG5vZGUud2FsaygobjogVE5vZGUpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcm9vdFByb3BzLFxuICAgICAgICBtb3ZlUHJvcHMsXG4gICAgICAgIGN1c3RvbVByb3BzLFxuICAgICAgICBzZXR1cFByb3BzLFxuICAgICAgICBtYXJrdXBQcm9wcyxcbiAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgZ2FtZUluZm9Qcm9wcyxcbiAgICAgIH0gPSBuLm1vZGVsO1xuICAgICAgY29uc3Qgbm9kZXMgPSBjb21wYWN0KFtcbiAgICAgICAgLi4ucm9vdFByb3BzLFxuICAgICAgICAuLi5jdXN0b21Qcm9wcyxcbiAgICAgICAgLi4ubW92ZVByb3BzLFxuICAgICAgICAuLi5nZXREZWR1cGxpY2F0ZWRQcm9wcyhzZXR1cFByb3BzKSxcbiAgICAgICAgLi4uZ2V0RGVkdXBsaWNhdGVkUHJvcHMobWFya3VwUHJvcHMpLFxuICAgICAgICAuLi5nYW1lSW5mb1Byb3BzLFxuICAgICAgICAuLi5ub2RlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICAuLi5tb3ZlQW5ub3RhdGlvblByb3BzLFxuICAgICAgXSk7XG4gICAgICBjb250ZW50ICs9ICc7JztcbiAgICAgIG5vZGVzLmZvckVhY2goKG46IFNnZlByb3BCYXNlKSA9PiB7XG4gICAgICAgIGNvbnRlbnQgKz0gbi50b1N0cmluZygpO1xuICAgICAgfSk7XG4gICAgICBpZiAobi5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgIG4uY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IFROb2RlKSA9PiB7XG4gICAgICAgICAgY29udGVudCArPSBgKCR7dGhpcy5ub2RlVG9TdHJpbmcoY2hpbGQpfSlgO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuLmNoaWxkcmVuLmxlbmd0aCA8IDI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbn1cbiIsImltcG9ydCB7VHJlZU1vZGVsLCBUTm9kZX0gZnJvbSAnLi9jb3JlL3RyZWUnO1xuaW1wb3J0IHtjbG9uZURlZXAsIGZsYXR0ZW5EZXB0aCwgY2xvbmUsIHN1bSwgY29tcGFjdCwgc2FtcGxlfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtTZ2ZOb2RlLCBTZ2ZOb2RlT3B0aW9uc30gZnJvbSAnLi9jb3JlL3R5cGVzJztcbmltcG9ydCB7XG4gIGlzTW92ZU5vZGUsXG4gIGlzU2V0dXBOb2RlLFxuICBjYWxjSGFzaCxcbiAgZ2V0Tm9kZU51bWJlcixcbiAgaXNSb290Tm9kZSxcbn0gZnJvbSAnLi9jb3JlL2hlbHBlcnMnO1xuZXhwb3J0IHtpc01vdmVOb2RlLCBpc1NldHVwTm9kZSwgY2FsY0hhc2gsIGdldE5vZGVOdW1iZXIsIGlzUm9vdE5vZGV9O1xuaW1wb3J0IHtcbiAgQTFfTEVUVEVSUyxcbiAgQTFfTlVNQkVSUyxcbiAgU0dGX0xFVFRFUlMsXG4gIE1BWF9CT0FSRF9TSVpFLFxuICBMSUdIVF9HUkVFTl9SR0IsXG4gIExJR0hUX1lFTExPV19SR0IsXG4gIExJR0hUX1JFRF9SR0IsXG4gIFlFTExPV19SR0IsXG4gIERFRkFVTFRfQk9BUkRfU0laRSxcbn0gZnJvbSAnLi9jb25zdCc7XG5pbXBvcnQge1xuICBTZXR1cFByb3AsXG4gIE1vdmVQcm9wLFxuICBDdXN0b21Qcm9wLFxuICBTZ2ZQcm9wQmFzZSxcbiAgTm9kZUFubm90YXRpb25Qcm9wLFxuICBHYW1lSW5mb1Byb3AsXG4gIE1vdmVBbm5vdGF0aW9uUHJvcCxcbiAgUm9vdFByb3AsXG4gIE1hcmt1cFByb3AsXG4gIE1PVkVfUFJPUF9MSVNULFxuICBTRVRVUF9QUk9QX0xJU1QsXG4gIE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QsXG4gIE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QsXG4gIE1BUktVUF9QUk9QX0xJU1QsXG4gIFJPT1RfUFJPUF9MSVNULFxuICBHQU1FX0lORk9fUFJPUF9MSVNULFxuICBUSU1JTkdfUFJPUF9MSVNULFxuICBNSVNDRUxMQU5FT1VTX1BST1BfTElTVCxcbiAgQ1VTVE9NX1BST1BfTElTVCxcbn0gZnJvbSAnLi9jb3JlL3Byb3BzJztcbmltcG9ydCB7XG4gIEFuYWx5c2lzLFxuICBHaG9zdEJhbk9wdGlvbnMsXG4gIEtpLFxuICBNb3ZlSW5mbyxcbiAgUHJvYmxlbUFuc3dlclR5cGUgYXMgUEFULFxuICBSb290SW5mbyxcbiAgTWFya3VwLFxuICBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQge0NlbnRlcn0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge2Nhbk1vdmUsIGV4ZWNDYXB0dXJlfSBmcm9tICcuL2JvYXJkY29yZSc7XG5leHBvcnQge2Nhbk1vdmUsIGV4ZWNDYXB0dXJlfTtcblxuaW1wb3J0IHtTZ2Z9IGZyb20gJy4vY29yZS9zZ2YnO1xuXG50eXBlIFN0cmF0ZWd5ID0gJ3Bvc3QnIHwgJ3ByZScgfCAnYm90aCc7XG5cbmNvbnN0IFNwYXJrTUQ1ID0gcmVxdWlyZSgnc3BhcmstbWQ1Jyk7XG5cbmV4cG9ydCBjb25zdCBjYWxjRG91YnRmdWxNb3Zlc1RocmVzaG9sZFJhbmdlID0gKHRocmVzaG9sZDogbnVtYmVyKSA9PiB7XG4gIC8vIDhELTlEXG4gIGlmICh0aHJlc2hvbGQgPj0gMjUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4xNV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtM119LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTMsIC0yXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTIsIC0xXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMSwgLTAuNV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gNUQtN0RcbiAgaWYgKHRocmVzaG9sZCA+PSAyMyAmJiB0aHJlc2hvbGQgPCAyNSkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjJdLCBzY29yZVJhbmdlOiBbLTEwMCwgLThdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjIsIC0wLjE1XSwgc2NvcmVSYW5nZTogWy04LCAtNF19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjE1LCAtMC4wNV0sIHNjb3JlUmFuZ2U6IFstNCwgLTJdfSxcbiAgICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDUsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0yLCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cblxuICAvLyAzRC01RFxuICBpZiAodGhyZXNob2xkID49IDIwICYmIHRocmVzaG9sZCA8IDIzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMjVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTEyXX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4yNSwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMTIsIC01XX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTUsIC0yXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMiwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDFELTNEXG4gIGlmICh0aHJlc2hvbGQgPj0gMTggJiYgdGhyZXNob2xkIDwgMjApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4zXSwgc2NvcmVSYW5nZTogWy0xMDAsIC0xNV19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMywgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMTUsIC03XX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTcsIC01XX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstNSwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDVLLTFLXG4gIGlmICh0aHJlc2hvbGQgPj0gMTMgJiYgdGhyZXNob2xkIDwgMTgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4zNV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMjBdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjM1LCAtMC4xMl0sIHNjb3JlUmFuZ2U6IFstMjAsIC0xMF19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEyLCAtMC4wOF0sIHNjb3JlUmFuZ2U6IFstMTAsIC01XX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA4LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstNSwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDVLLTEwS1xuICBpZiAodGhyZXNob2xkID49IDggJiYgdGhyZXNob2xkIDwgMTMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC40XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0yNV19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuNCwgLTAuMTVdLCBzY29yZVJhbmdlOiBbLTI1LCAtMTBdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xNSwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMTAsIC01XX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy01LCAtMV19LFxuICAgICAgZ29vZDoge3dpbnJhdGVSYW5nZTogWy0wLjAyLCAwXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICAgIH07XG4gIH1cbiAgLy8gMThLLTEwS1xuICBpZiAodGhyZXNob2xkID49IDAgJiYgdGhyZXNob2xkIDwgOCkge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjQ1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0zNV19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuNDUsIC0wLjJdLCBzY29yZVJhbmdlOiBbLTM1LCAtMjBdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4yLCAtMC4xXSwgc2NvcmVSYW5nZTogWy0yMCwgLTEwXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0xMCwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIHJldHVybiB7XG4gICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4zXSwgc2NvcmVSYW5nZTogWy0xMDAsIC0zMF19LFxuICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjMsIC0wLjJdLCBzY29yZVJhbmdlOiBbLTMwLCAtMjBdfSxcbiAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMiwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMjAsIC0xMF19LFxuICAgIG9rOiB7d2lucmF0ZVJhbmdlOiBbLTAuMSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTEwLCAtMV19LFxuICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3Qgcm91bmQyID0gKHY6IG51bWJlciwgc2NhbGUgPSAxLCBmaXhlZCA9IDIpID0+IHtcbiAgcmV0dXJuICgoTWF0aC5yb3VuZCh2ICogMTAwKSAvIDEwMCkgKiBzY2FsZSkudG9GaXhlZChmaXhlZCk7XG59O1xuXG5leHBvcnQgY29uc3Qgcm91bmQzID0gKHY6IG51bWJlciwgc2NhbGUgPSAxLCBmaXhlZCA9IDMpID0+IHtcbiAgcmV0dXJuICgoTWF0aC5yb3VuZCh2ICogMTAwMCkgLyAxMDAwKSAqIHNjYWxlKS50b0ZpeGVkKGZpeGVkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc0Fuc3dlck5vZGUgPSAobjogVE5vZGUsIGtpbmQ6IFBBVCkgPT4ge1xuICBjb25zdCBwYXQgPSBuLm1vZGVsLmN1c3RvbVByb3BzPy5maW5kKChwOiBDdXN0b21Qcm9wKSA9PiBwLnRva2VuID09PSAnUEFUJyk7XG4gIHJldHVybiBwYXQ/LnZhbHVlID09PSBraW5kO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQ2hvaWNlTm9kZSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gISFjPy52YWx1ZS5pbmNsdWRlcygnQ0hPSUNFJyk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNUYXJnZXROb2RlID0gaXNDaG9pY2VOb2RlO1xuXG5leHBvcnQgY29uc3QgaXNGb3JjZU5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuIGM/LnZhbHVlLmluY2x1ZGVzKCdGT1JDRScpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUHJldmVudE1vdmVOb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnTk9UVEhJUycpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzUmlnaHRMZWFmID0gKG46IFROb2RlKSA9PiB7XG4vLyAgIHJldHVybiBpc1JpZ2h0Tm9kZShuKSAmJiAhbi5oYXNDaGlsZHJlbigpO1xuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGlzUmlnaHROb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiAhIWM/LnZhbHVlLmluY2x1ZGVzKCdSSUdIVCcpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzRmlyc3RSaWdodExlYWYgPSAobjogVE5vZGUpID0+IHtcbi8vICAgY29uc3Qgcm9vdCA9IG4uZ2V0UGF0aCgpWzBdO1xuLy8gICBjb25zdCBmaXJzdFJpZ2h0TGVhdmUgPSByb290LmZpcnN0KChuOiBUTm9kZSkgPT5cbi8vICAgICBpc1JpZ2h0TGVhZihuKVxuLy8gICApO1xuLy8gICByZXR1cm4gZmlyc3RSaWdodExlYXZlPy5tb2RlbC5pZCA9PT0gbi5tb2RlbC5pZDtcbi8vIH07XG5cbmV4cG9ydCBjb25zdCBpc0ZpcnN0UmlnaHROb2RlID0gKG46IFROb2RlKSA9PiB7XG4gIGNvbnN0IHJvb3QgPSBuLmdldFBhdGgoKVswXTtcbiAgY29uc3QgZmlyc3RSaWdodE5vZGUgPSByb290LmZpcnN0KG4gPT4gaXNSaWdodE5vZGUobikpO1xuICByZXR1cm4gZmlyc3RSaWdodE5vZGU/Lm1vZGVsLmlkID09PSBuLm1vZGVsLmlkO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzVmFyaWFudE5vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuICEhYz8udmFsdWUuaW5jbHVkZXMoJ1ZBUklBTlQnKTtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBpc1ZhcmlhbnRMZWFmID0gKG46IFROb2RlKSA9PiB7XG4vLyAgIHJldHVybiBpc1ZhcmlhbnROb2RlKG4pICYmICFuLmhhc0NoaWxkcmVuKCk7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaXNXcm9uZ05vZGUgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuICghYz8udmFsdWUuaW5jbHVkZXMoJ1ZBUklBTlQnKSAmJiAhYz8udmFsdWUuaW5jbHVkZXMoJ1JJR0hUJykpIHx8ICFjO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzV3JvbmdMZWFmID0gKG46IFROb2RlKSA9PiB7XG4vLyAgIHJldHVybiBpc1dyb25nTm9kZShuKSAmJiAhbi5oYXNDaGlsZHJlbigpO1xuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGluUGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIGRldGVjdGlvbk1ldGhvZDogKG46IFROb2RlKSA9PiBib29sZWFuLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXVxuKSA9PiB7XG4gIGNvbnN0IHBhdGggPSBwcmVOb2RlcyA/PyBub2RlLmdldFBhdGgoKTtcbiAgY29uc3QgcG9zdFJpZ2h0Tm9kZXMgPVxuICAgIHBvc3ROb2Rlcz8uZmlsdGVyKChuOiBUTm9kZSkgPT4gZGV0ZWN0aW9uTWV0aG9kKG4pKSA/P1xuICAgIG5vZGUuYWxsKChuOiBUTm9kZSkgPT4gZGV0ZWN0aW9uTWV0aG9kKG4pKTtcbiAgY29uc3QgcHJlUmlnaHROb2RlcyA9IHBhdGguZmlsdGVyKChuOiBUTm9kZSkgPT4gZGV0ZWN0aW9uTWV0aG9kKG4pKTtcblxuICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdDpcbiAgICAgIHJldHVybiBwb3N0UmlnaHROb2Rlcy5sZW5ndGggPiAwO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlByZTpcbiAgICAgIHJldHVybiBwcmVSaWdodE5vZGVzLmxlbmd0aCA+IDA7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuQm90aDpcbiAgICAgIHJldHVybiBwcmVSaWdodE5vZGVzLmxlbmd0aCA+IDAgfHwgcG9zdFJpZ2h0Tm9kZXMubGVuZ3RoID4gMDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5SaWdodFBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKSA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNSaWdodE5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbkZpcnN0UmlnaHRQYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFROb2RlW10gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gaW5QYXRoKG5vZGUsIGlzRmlyc3RSaWdodE5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbkZpcnN0QnJhbmNoUmlnaHRQYXRoID0gKFxuICBub2RlOiBUTm9kZSxcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5QcmUsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIGlmICghaW5SaWdodFBhdGgobm9kZSkpIHJldHVybiBmYWxzZTtcblxuICBjb25zdCBwYXRoID0gcHJlTm9kZXMgPz8gbm9kZS5nZXRQYXRoKCk7XG4gIGNvbnN0IHBvc3RSaWdodE5vZGVzID0gcG9zdE5vZGVzID8/IG5vZGUuYWxsKCgpID0+IHRydWUpO1xuXG4gIGxldCByZXN1bHQgPSBbXTtcbiAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3Q6XG4gICAgICByZXN1bHQgPSBwb3N0UmlnaHROb2Rlcy5maWx0ZXIobiA9PiBuLmdldEluZGV4KCkgPiAwKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlByZTpcbiAgICAgIHJlc3VsdCA9IHBhdGguZmlsdGVyKG4gPT4gbi5nZXRJbmRleCgpID4gMCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Cb3RoOlxuICAgICAgcmVzdWx0ID0gcGF0aC5jb25jYXQocG9zdFJpZ2h0Tm9kZXMpLmZpbHRlcihuID0+IG4uZ2V0SW5kZXgoKSA+IDApO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA9PT0gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBpbkNob2ljZVBhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNDaG9pY2VOb2RlLCBzdHJhdGVneSwgcHJlTm9kZXMsIHBvc3ROb2Rlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5UYXJnZXRQYXRoID0gaW5DaG9pY2VQYXRoO1xuXG5leHBvcnQgY29uc3QgaW5WYXJpYW50UGF0aCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUTm9kZVtdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc1ZhcmlhbnROb2RlLCBzdHJhdGVneSwgcHJlTm9kZXMsIHBvc3ROb2Rlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5Xcm9uZ1BhdGggPSAoXG4gIG5vZGU6IFROb2RlLFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVE5vZGVbXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNXcm9uZ05vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBuRm9ybWF0dGVyID0gKG51bTogbnVtYmVyLCBmaXhlZCA9IDEpID0+IHtcbiAgY29uc3QgbG9va3VwID0gW1xuICAgIHt2YWx1ZTogMSwgc3ltYm9sOiAnJ30sXG4gICAge3ZhbHVlOiAxZTMsIHN5bWJvbDogJ2snfSxcbiAgICB7dmFsdWU6IDFlNiwgc3ltYm9sOiAnTSd9LFxuICAgIHt2YWx1ZTogMWU5LCBzeW1ib2w6ICdHJ30sXG4gICAge3ZhbHVlOiAxZTEyLCBzeW1ib2w6ICdUJ30sXG4gICAge3ZhbHVlOiAxZTE1LCBzeW1ib2w6ICdQJ30sXG4gICAge3ZhbHVlOiAxZTE4LCBzeW1ib2w6ICdFJ30sXG4gIF07XG4gIGNvbnN0IHJ4ID0gL1xcLjArJHwoXFwuWzAtOV0qWzEtOV0pMCskLztcbiAgY29uc3QgaXRlbSA9IGxvb2t1cFxuICAgIC5zbGljZSgpXG4gICAgLnJldmVyc2UoKVxuICAgIC5maW5kKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIG51bSA+PSBpdGVtLnZhbHVlO1xuICAgIH0pO1xuICByZXR1cm4gaXRlbVxuICAgID8gKG51bSAvIGl0ZW0udmFsdWUpLnRvRml4ZWQoZml4ZWQpLnJlcGxhY2UocngsICckMScpICsgaXRlbS5zeW1ib2xcbiAgICA6ICcwJztcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9JbmRleGVzID0gKHBhdGg6IFROb2RlW10pOiBzdHJpbmdbXSA9PiB7XG4gIHJldHVybiBwYXRoLm1hcChuID0+IG4ubW9kZWwuaWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhdGhUb0luaXRpYWxTdG9uZXMgPSAoXG4gIHBhdGg6IFROb2RlW10sXG4gIHhPZmZzZXQgPSAwLFxuICB5T2Zmc2V0ID0gMFxuKTogc3RyaW5nW10gPT4ge1xuICBjb25zdCBpbml0cyA9IHBhdGhcbiAgICAuZmlsdGVyKG4gPT4gbi5tb2RlbC5zZXR1cFByb3BzLmxlbmd0aCA+IDApXG4gICAgLm1hcChuID0+IHtcbiAgICAgIHJldHVybiBuLm1vZGVsLnNldHVwUHJvcHMubWFwKChzZXR1cDogU2V0dXBQcm9wKSA9PiB7XG4gICAgICAgIHJldHVybiBzZXR1cC52YWx1ZXMubWFwKCh2OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjb25zdCBhID0gQTFfTEVUVEVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHZbMF0pICsgeE9mZnNldF07XG4gICAgICAgICAgY29uc3QgYiA9IEExX05VTUJFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZih2WzFdKSArIHlPZmZzZXRdO1xuICAgICAgICAgIGNvbnN0IHRva2VuID0gc2V0dXAudG9rZW4gPT09ICdBQicgPyAnQicgOiAnVyc7XG4gICAgICAgICAgcmV0dXJuIFt0b2tlbiwgYSArIGJdO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICByZXR1cm4gZmxhdHRlbkRlcHRoKGluaXRzWzBdLCAxKTtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9BaU1vdmVzID0gKHBhdGg6IFROb2RlW10sIHhPZmZzZXQgPSAwLCB5T2Zmc2V0ID0gMCkgPT4ge1xuICBjb25zdCBtb3ZlcyA9IHBhdGhcbiAgICAuZmlsdGVyKG4gPT4gbi5tb2RlbC5tb3ZlUHJvcHMubGVuZ3RoID4gMClcbiAgICAubWFwKG4gPT4ge1xuICAgICAgY29uc3QgcHJvcCA9IG4ubW9kZWwubW92ZVByb3BzWzBdO1xuICAgICAgY29uc3QgYSA9IEExX0xFVFRFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZihwcm9wLnZhbHVlWzBdKSArIHhPZmZzZXRdO1xuICAgICAgY29uc3QgYiA9IEExX05VTUJFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZihwcm9wLnZhbHVlWzFdKSArIHlPZmZzZXRdO1xuICAgICAgcmV0dXJuIFtwcm9wLnRva2VuLCBhICsgYl07XG4gICAgfSk7XG4gIHJldHVybiBtb3Zlcztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEZyb21BbmFseXNpcyA9IChhOiBBbmFseXNpcykgPT4ge1xuICBpZiAoL2luZGV4ZXMvLnRlc3QoYS5pZCkpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhLmlkKS5pbmRleGVzWzBdO1xuICB9XG4gIHJldHVybiAnJztcbn07XG5cbmV4cG9ydCBjb25zdCBpc01haW5QYXRoID0gKG5vZGU6IFROb2RlKSA9PiB7XG4gIHJldHVybiBzdW0obm9kZS5nZXRQYXRoKCkubWFwKG4gPT4gbi5nZXRJbmRleCgpKSkgPT09IDA7XG59O1xuXG5leHBvcnQgY29uc3Qgc2dmVG9Qb3MgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qga2kgPSBzdHJbMF0gPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3QgdGVtcFN0ciA9IC9cXFsoLiopXFxdLy5leGVjKHN0cik7XG4gIGlmICh0ZW1wU3RyKSB7XG4gICAgY29uc3QgcG9zID0gdGVtcFN0clsxXTtcbiAgICBjb25zdCB4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihwb3NbMF0pO1xuICAgIGNvbnN0IHkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1sxXSk7XG4gICAgcmV0dXJuIHt4LCB5LCBraX07XG4gIH1cbiAgcmV0dXJuIHt4OiAtMSwgeTogLTEsIGtpOiAwfTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZUb0ExID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHt4LCB5fSA9IHNnZlRvUG9zKHN0cik7XG4gIHJldHVybiBBMV9MRVRURVJTW3hdICsgQTFfTlVNQkVSU1t5XTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvUG9zID0gKG1vdmU6IHN0cmluZykgPT4ge1xuICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pO1xuICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSk7XG4gIHJldHVybiB7eCwgeX07XG59O1xuXG5leHBvcnQgY29uc3QgYTFUb0luZGV4ID0gKG1vdmU6IHN0cmluZywgYm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3QgeCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKTtcbiAgY29uc3QgeSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpO1xuICByZXR1cm4geCAqIGJvYXJkU2l6ZSArIHk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2dmT2Zmc2V0ID0gKHNnZjogYW55LCBvZmZzZXQgPSAwKSA9PiB7XG4gIGlmIChvZmZzZXQgPT09IDApIHJldHVybiBzZ2Y7XG4gIGNvbnN0IHJlcyA9IGNsb25lKHNnZik7XG4gIGNvbnN0IGNoYXJJbmRleCA9IFNHRl9MRVRURVJTLmluZGV4T2Yoc2dmWzJdKSAtIG9mZnNldDtcbiAgcmV0dXJuIHJlcy5zdWJzdHIoMCwgMikgKyBTR0ZfTEVUVEVSU1tjaGFySW5kZXhdICsgcmVzLnN1YnN0cigyICsgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgYTFUb1NHRiA9IChzdHI6IGFueSwgdHlwZSA9ICdCJywgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwKSA9PiB7XG4gIGlmIChzdHIgPT09ICdwYXNzJykgcmV0dXJuIGAke3R5cGV9W11gO1xuICBjb25zdCBpbnggPSBBMV9MRVRURVJTLmluZGV4T2Yoc3RyWzBdKSArIG9mZnNldFg7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChzdHIuc3Vic3RyKDEpLCAwKSkgKyBvZmZzZXRZO1xuICBjb25zdCBzZ2YgPSBgJHt0eXBlfVske1NHRl9MRVRURVJTW2lueF19JHtTR0ZfTEVUVEVSU1tpbnldfV1gO1xuICByZXR1cm4gc2dmO1xufTtcblxuZXhwb3J0IGNvbnN0IHBvc1RvU2dmID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBraTogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGF4ID0gU0dGX0xFVFRFUlNbeF07XG4gIGNvbnN0IGF5ID0gU0dGX0xFVFRFUlNbeV07XG4gIGlmIChraSA9PT0gMCkgcmV0dXJuICcnO1xuICBpZiAoa2kgPT09IDEpIHJldHVybiBgQlske2F4fSR7YXl9XWA7XG4gIGlmIChraSA9PT0gLTEpIHJldHVybiBgV1ske2F4fSR7YXl9XWA7XG4gIHJldHVybiAnJztcbn07XG5cbmV4cG9ydCBjb25zdCBtYXRUb1Bvc2l0aW9uID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIHhPZmZzZXQ/OiBudW1iZXIsXG4gIHlPZmZzZXQ/OiBudW1iZXJcbikgPT4ge1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIHhPZmZzZXQgPSB4T2Zmc2V0ID8/IDA7XG4gIHlPZmZzZXQgPSB5T2Zmc2V0ID8/IERFRkFVTFRfQk9BUkRfU0laRSAtIG1hdC5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IHggPSBBMV9MRVRURVJTW2kgKyB4T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgeSA9IEExX05VTUJFUlNbaiArIHlPZmZzZXRdO1xuICAgICAgICBjb25zdCBjb2xvciA9IHZhbHVlID09PSAxID8gJ2InIDogJ3cnO1xuICAgICAgICByZXN1bHQgKz0gYCR7Y29sb3J9ICR7eH0ke3l9IGA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgbWF0VG9MaXN0T2ZUdXBsZXMgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgeE9mZnNldCA9IDAsXG4gIHlPZmZzZXQgPSAwXG4pID0+IHtcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG1hdFtpXVtqXTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICBjb25zdCB4ID0gQTFfTEVUVEVSU1tpICsgeE9mZnNldF07XG4gICAgICAgIGNvbnN0IHkgPSBBMV9OVU1CRVJTW2ogKyB5T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgY29sb3IgPSB2YWx1ZSA9PT0gMSA/ICdCJyA6ICdXJztcbiAgICAgICAgcmVzdWx0cy5wdXNoKFtjb2xvciwgeCArIHldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG5leHBvcnQgY29uc3QgY29udmVydFN0b25lVHlwZVRvU3RyaW5nID0gKHR5cGU6IGFueSkgPT4gKHR5cGUgPT09IDEgPyAnQicgOiAnVycpO1xuXG5leHBvcnQgY29uc3QgY29udmVydFN0ZXBzRm9yQUkgPSAoc3RlcHM6IGFueSwgb2Zmc2V0ID0gMCkgPT4ge1xuICBsZXQgcmVzID0gY2xvbmUoc3RlcHMpO1xuICByZXMgPSByZXMubWFwKChzOiBhbnkpID0+IHNnZk9mZnNldChzLCBvZmZzZXQpKTtcbiAgY29uc3QgaGVhZGVyID0gYCg7RkZbNF1HTVsxXVNaWyR7XG4gICAgMTkgLSBvZmZzZXRcbiAgfV1HTlsyMjZdUEJbQmxhY2tdSEFbMF1QV1tXaGl0ZV1LTVs3LjVdRFRbMjAxNy0wOC0wMV1UTVsxODAwXVJVW0NoaW5lc2VdQ1BbQ29weXJpZ2h0IGdob3N0LWdvLmNvbV1BUFtnaG9zdC1nby5jb21dUExbQmxhY2tdO2A7XG4gIGxldCBjb3VudCA9IDA7XG4gIGxldCBwcmV2ID0gJyc7XG4gIHN0ZXBzLmZvckVhY2goKHN0ZXA6IGFueSwgaW5kZXg6IGFueSkgPT4ge1xuICAgIGlmIChzdGVwWzBdID09PSBwcmV2WzBdKSB7XG4gICAgICBpZiAoc3RlcFswXSA9PT0gJ0InKSB7XG4gICAgICAgIHJlcy5zcGxpY2UoaW5kZXggKyBjb3VudCwgMCwgJ1dbdHRdJyk7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc3BsaWNlKGluZGV4ICsgY291bnQsIDAsICdCW3R0XScpO1xuICAgICAgICBjb3VudCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBwcmV2ID0gc3RlcDtcbiAgfSk7XG4gIHJldHVybiBgJHtoZWFkZXJ9JHtyZXMuam9pbignOycpfSlgO1xufTtcblxuZXhwb3J0IGNvbnN0IG9mZnNldEExTW92ZSA9IChtb3ZlOiBzdHJpbmcsIG94ID0gMCwgb3kgPSAwKSA9PiB7XG4gIGlmIChtb3ZlID09PSAncGFzcycpIHJldHVybiBtb3ZlO1xuICAvLyBjb25zb2xlLmxvZygnb3h5Jywgb3gsIG95KTtcbiAgY29uc3QgaW54ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pICsgb3g7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpICsgb3k7XG4gIC8vIGNvbnNvbGUubG9nKCdpbnh5JywgaW54LCBpbnksIGAke0ExX0xFVFRFUlNbaW54XX0ke0ExX05VTUJFUlNbaW55XX1gKTtcbiAgcmV0dXJuIGAke0ExX0xFVFRFUlNbaW54XX0ke0ExX05VTUJFUlNbaW55XX1gO1xufTtcblxuZXhwb3J0IGNvbnN0IHJldmVyc2VPZmZzZXRBMU1vdmUgPSAoXG4gIG1vdmU6IHN0cmluZyxcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBhbmFseXNpczogQW5hbHlzaXMsXG4gIGJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgaWYgKG1vdmUgPT09ICdwYXNzJykgcmV0dXJuIG1vdmU7XG4gIGNvbnN0IGlkT2JqID0gSlNPTi5wYXJzZShhbmFseXNpcy5pZCk7XG4gIGNvbnN0IHt4LCB5fSA9IHJldmVyc2VPZmZzZXQobWF0LCBpZE9iai5ieCwgaWRPYmouYnksIGJvYXJkU2l6ZSk7XG4gIGNvbnN0IGlueCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKSArIHg7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpICsgeTtcbiAgcmV0dXJuIGAke0ExX0xFVFRFUlNbaW54XX0ke0ExX05VTUJFUlNbaW55XX1gO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNTY29yZURpZmZUZXh0ID0gKFxuICByb290SW5mbz86IFJvb3RJbmZvIHwgbnVsbCxcbiAgY3VyckluZm8/OiBNb3ZlSW5mbyB8IFJvb3RJbmZvIHwgbnVsbCxcbiAgZml4ZWQgPSAxLFxuICByZXZlcnNlID0gZmFsc2VcbikgPT4ge1xuICBpZiAoIXJvb3RJbmZvIHx8ICFjdXJySW5mbykgcmV0dXJuICcnO1xuICBsZXQgc2NvcmUgPSBjYWxjU2NvcmVEaWZmKHJvb3RJbmZvLCBjdXJySW5mbyk7XG4gIGlmIChyZXZlcnNlKSBzY29yZSA9IC1zY29yZTtcbiAgY29uc3QgZml4ZWRTY29yZSA9IHNjb3JlLnRvRml4ZWQoZml4ZWQpO1xuXG4gIHJldHVybiBzY29yZSA+IDAgPyBgKyR7Zml4ZWRTY29yZX1gIDogYCR7Zml4ZWRTY29yZX1gO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNXaW5yYXRlRGlmZlRleHQgPSAoXG4gIHJvb3RJbmZvPzogUm9vdEluZm8gfCBudWxsLFxuICBjdXJySW5mbz86IE1vdmVJbmZvIHwgUm9vdEluZm8gfCBudWxsLFxuICBmaXhlZCA9IDEsXG4gIHJldmVyc2UgPSBmYWxzZVxuKSA9PiB7XG4gIGlmICghcm9vdEluZm8gfHwgIWN1cnJJbmZvKSByZXR1cm4gJyc7XG4gIGxldCB3aW5yYXRlID0gY2FsY1dpbnJhdGVEaWZmKHJvb3RJbmZvLCBjdXJySW5mbyk7XG4gIGlmIChyZXZlcnNlKSB3aW5yYXRlID0gLXdpbnJhdGU7XG4gIGNvbnN0IGZpeGVkV2lucmF0ZSA9IHdpbnJhdGUudG9GaXhlZChmaXhlZCk7XG5cbiAgcmV0dXJuIHdpbnJhdGUgPj0gMCA/IGArJHtmaXhlZFdpbnJhdGV9JWAgOiBgJHtmaXhlZFdpbnJhdGV9JWA7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1Njb3JlRGlmZiA9IChcbiAgcm9vdEluZm86IFJvb3RJbmZvLFxuICBjdXJySW5mbzogTW92ZUluZm8gfCBSb290SW5mb1xuKSA9PiB7XG4gIGNvbnN0IHNpZ24gPSByb290SW5mby5jdXJyZW50UGxheWVyID09PSAnQicgPyAxIDogLTE7XG4gIGNvbnN0IHNjb3JlID1cbiAgICBNYXRoLnJvdW5kKChjdXJySW5mby5zY29yZUxlYWQgLSByb290SW5mby5zY29yZUxlYWQpICogc2lnbiAqIDEwMDApIC8gMTAwMDtcblxuICByZXR1cm4gc2NvcmU7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1dpbnJhdGVEaWZmID0gKFxuICByb290SW5mbzogUm9vdEluZm8sXG4gIGN1cnJJbmZvOiBNb3ZlSW5mbyB8IFJvb3RJbmZvXG4pID0+IHtcbiAgY29uc3Qgc2lnbiA9IHJvb3RJbmZvLmN1cnJlbnRQbGF5ZXIgPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3Qgc2NvcmUgPVxuICAgIE1hdGgucm91bmQoKGN1cnJJbmZvLndpbnJhdGUgLSByb290SW5mby53aW5yYXRlKSAqIHNpZ24gKiAxMDAwICogMTAwKSAvXG4gICAgMTAwMDtcblxuICByZXR1cm4gc2NvcmU7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0FuYWx5c2lzUG9pbnRDb2xvciA9IChcbiAgcm9vdEluZm86IFJvb3RJbmZvLFxuICBtb3ZlSW5mbzogTW92ZUluZm9cbikgPT4ge1xuICBjb25zdCB7cHJpb3IsIG9yZGVyfSA9IG1vdmVJbmZvO1xuICBjb25zdCBzY29yZSA9IGNhbGNTY29yZURpZmYocm9vdEluZm8sIG1vdmVJbmZvKTtcbiAgbGV0IHBvaW50Q29sb3IgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpJztcbiAgaWYgKFxuICAgIHByaW9yID49IDAuNSB8fFxuICAgIChwcmlvciA+PSAwLjEgJiYgb3JkZXIgPCAzICYmIHNjb3JlID4gLTAuMykgfHxcbiAgICBvcmRlciA9PT0gMCB8fFxuICAgIHNjb3JlID49IDBcbiAgKSB7XG4gICAgcG9pbnRDb2xvciA9IExJR0hUX0dSRUVOX1JHQjtcbiAgfSBlbHNlIGlmICgocHJpb3IgPiAwLjA1ICYmIHNjb3JlID4gLTAuNSkgfHwgKHByaW9yID4gMC4wMSAmJiBzY29yZSA+IC0wLjEpKSB7XG4gICAgcG9pbnRDb2xvciA9IExJR0hUX1lFTExPV19SR0I7XG4gIH0gZWxzZSBpZiAocHJpb3IgPiAwLjAxICYmIHNjb3JlID4gLTEpIHtcbiAgICBwb2ludENvbG9yID0gWUVMTE9XX1JHQjtcbiAgfSBlbHNlIHtcbiAgICBwb2ludENvbG9yID0gTElHSFRfUkVEX1JHQjtcbiAgfVxuICByZXR1cm4gcG9pbnRDb2xvcjtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBHb0JhbkRldGVjdGlvbiA9IChwaXhlbERhdGEsIGNhbnZhcykgPT4ge1xuLy8gY29uc3QgY29sdW1ucyA9IGNhbnZhcy53aWR0aDtcbi8vIGNvbnN0IHJvd3MgPSBjYW52YXMuaGVpZ2h0O1xuLy8gY29uc3QgZGF0YVR5cGUgPSBKc0ZlYXQuVThDMV90O1xuLy8gY29uc3QgZGlzdE1hdHJpeFQgPSBuZXcgSnNGZWF0Lm1hdHJpeF90KGNvbHVtbnMsIHJvd3MsIGRhdGFUeXBlKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmdyYXlzY2FsZShwaXhlbERhdGEsIGNvbHVtbnMsIHJvd3MsIGRpc3RNYXRyaXhUKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmdhdXNzaWFuX2JsdXIoZGlzdE1hdHJpeFQsIGRpc3RNYXRyaXhULCAyLCAwKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmNhbm55KGRpc3RNYXRyaXhULCBkaXN0TWF0cml4VCwgNTAsIDUwKTtcblxuLy8gY29uc3QgbmV3UGl4ZWxEYXRhID0gbmV3IFVpbnQzMkFycmF5KHBpeGVsRGF0YS5idWZmZXIpO1xuLy8gY29uc3QgYWxwaGEgPSAoMHhmZiA8PCAyNCk7XG4vLyBsZXQgaSA9IGRpc3RNYXRyaXhULmNvbHMgKiBkaXN0TWF0cml4VC5yb3dzO1xuLy8gbGV0IHBpeCA9IDA7XG4vLyB3aGlsZSAoaSA+PSAwKSB7XG4vLyAgIHBpeCA9IGRpc3RNYXRyaXhULmRhdGFbaV07XG4vLyAgIG5ld1BpeGVsRGF0YVtpXSA9IGFscGhhIHwgKHBpeCA8PCAxNikgfCAocGl4IDw8IDgpIHwgcGl4O1xuLy8gICBpIC09IDE7XG4vLyB9XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFBBSSA9IChuOiBUTm9kZSkgPT4ge1xuICBjb25zdCBwYWkgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQUknKTtcbiAgaWYgKCFwYWkpIHJldHVybjtcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocGFpLnZhbHVlKTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0QW5zd2VyVHlwZSA9IChuOiBUTm9kZSk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gIGNvbnN0IHBhdCA9IG4ubW9kZWwuY3VzdG9tUHJvcHMuZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BBVCcpO1xuICByZXR1cm4gcGF0Py52YWx1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0UEkgPSAobjogVE5vZGUpID0+IHtcbiAgY29uc3QgcGkgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQSScpO1xuICBpZiAoIXBpKSByZXR1cm47XG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHBpLnZhbHVlKTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbml0Tm9kZURhdGEgPSAoc2hhOiBzdHJpbmcsIG51bWJlcj86IG51bWJlcik6IFNnZk5vZGUgPT4ge1xuICByZXR1cm4ge1xuICAgIGlkOiBzaGEsXG4gICAgbmFtZTogc2hhLFxuICAgIG51bWJlcjogbnVtYmVyIHx8IDAsXG4gICAgcm9vdFByb3BzOiBbXSxcbiAgICBtb3ZlUHJvcHM6IFtdLFxuICAgIHNldHVwUHJvcHM6IFtdLFxuICAgIG1hcmt1cFByb3BzOiBbXSxcbiAgICBnYW1lSW5mb1Byb3BzOiBbXSxcbiAgICBub2RlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBtb3ZlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBjdXN0b21Qcm9wczogW10sXG4gIH07XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGluaXRpYWwgcm9vdCBub2RlIG9mIHRoZSB0cmVlLlxuICpcbiAqIEBwYXJhbSByb290UHJvcHMgLSBUaGUgcm9vdCBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMgVGhlIGluaXRpYWwgcm9vdCBub2RlLlxuICovXG5leHBvcnQgY29uc3QgaW5pdGlhbFJvb3ROb2RlID0gKFxuICByb290UHJvcHMgPSBbXG4gICAgJ0ZGWzRdJyxcbiAgICAnR01bMV0nLFxuICAgICdDQVtVVEYtOF0nLFxuICAgICdBUFtnaG9zdGdvOjAuMS4wXScsXG4gICAgJ1NaWzE5XScsXG4gICAgJ1NUWzBdJyxcbiAgXVxuKSA9PiB7XG4gIGNvbnN0IHRyZWUgPSBuZXcgVHJlZU1vZGVsKCk7XG4gIGNvbnN0IHJvb3QgPSB0cmVlLnBhcnNlKHtcbiAgICAvLyAnMWIxNmIxJyBpcyB0aGUgU0hBMjU2IGhhc2ggb2YgdGhlICduJ1xuICAgIGlkOiAnJyxcbiAgICBuYW1lOiAnJyxcbiAgICBpbmRleDogMCxcbiAgICBudW1iZXI6IDAsXG4gICAgcm9vdFByb3BzOiByb290UHJvcHMubWFwKHAgPT4gUm9vdFByb3AuZnJvbShwKSksXG4gICAgbW92ZVByb3BzOiBbXSxcbiAgICBzZXR1cFByb3BzOiBbXSxcbiAgICBtYXJrdXBQcm9wczogW10sXG4gICAgZ2FtZUluZm9Qcm9wczogW10sXG4gICAgbm9kZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgbW92ZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgY3VzdG9tUHJvcHM6IFtdLFxuICB9KTtcbiAgY29uc3QgaGFzaCA9IGNhbGNIYXNoKHJvb3QpO1xuICByb290Lm1vZGVsLmlkID0gaGFzaDtcblxuICByZXR1cm4gcm9vdDtcbn07XG5cbi8qKlxuICogQnVpbGRzIGEgbmV3IHRyZWUgbm9kZSB3aXRoIHRoZSBnaXZlbiBtb3ZlLCBwYXJlbnQgbm9kZSwgYW5kIGFkZGl0aW9uYWwgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0gbW92ZSAtIFRoZSBtb3ZlIHRvIGJlIGFkZGVkIHRvIHRoZSBub2RlLlxuICogQHBhcmFtIHBhcmVudE5vZGUgLSBUaGUgcGFyZW50IG5vZGUgb2YgdGhlIG5ldyBub2RlLiBPcHRpb25hbC5cbiAqIEBwYXJhbSBwcm9wcyAtIEFkZGl0aW9uYWwgcHJvcGVydGllcyB0byBiZSBhZGRlZCB0byB0aGUgbmV3IG5vZGUuIE9wdGlvbmFsLlxuICogQHJldHVybnMgVGhlIG5ld2x5IGNyZWF0ZWQgdHJlZSBub2RlLlxuICovXG5leHBvcnQgY29uc3QgYnVpbGRNb3ZlTm9kZSA9IChcbiAgbW92ZTogc3RyaW5nLFxuICBwYXJlbnROb2RlPzogVE5vZGUsXG4gIHByb3BzPzogU2dmTm9kZU9wdGlvbnNcbikgPT4ge1xuICBjb25zdCB0cmVlID0gbmV3IFRyZWVNb2RlbCgpO1xuICBjb25zdCBtb3ZlUHJvcCA9IE1vdmVQcm9wLmZyb20obW92ZSk7XG4gIGNvbnN0IGhhc2ggPSBjYWxjSGFzaChwYXJlbnROb2RlLCBbbW92ZVByb3BdKTtcbiAgbGV0IG51bWJlciA9IDE7XG4gIGlmIChwYXJlbnROb2RlKSBudW1iZXIgPSBnZXROb2RlTnVtYmVyKHBhcmVudE5vZGUpICsgMTtcbiAgY29uc3Qgbm9kZURhdGEgPSBpbml0Tm9kZURhdGEoaGFzaCwgbnVtYmVyKTtcbiAgbm9kZURhdGEubW92ZVByb3BzID0gW21vdmVQcm9wXTtcblxuICBjb25zdCBub2RlID0gdHJlZS5wYXJzZSh7XG4gICAgLi4ubm9kZURhdGEsXG4gICAgLi4ucHJvcHMsXG4gIH0pO1xuICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMYXN0SW5kZXggPSAocm9vdDogVE5vZGUpID0+IHtcbiAgbGV0IGxhc3ROb2RlID0gcm9vdDtcbiAgcm9vdC53YWxrKG5vZGUgPT4ge1xuICAgIC8vIEhhbHQgdGhlIHRyYXZlcnNhbCBieSByZXR1cm5pbmcgZmFsc2VcbiAgICBsYXN0Tm9kZSA9IG5vZGU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuICByZXR1cm4gbGFzdE5vZGUubW9kZWwuaW5kZXg7XG59O1xuXG5leHBvcnQgY29uc3QgY3V0TW92ZU5vZGVzID0gKHJvb3Q6IFROb2RlLCByZXR1cm5Sb290PzogYm9vbGVhbikgPT4ge1xuICBsZXQgbm9kZSA9IGNsb25lRGVlcChyb290KTtcbiAgd2hpbGUgKG5vZGUgJiYgbm9kZS5oYXNDaGlsZHJlbigpICYmIG5vZGUubW9kZWwubW92ZVByb3BzLmxlbmd0aCA9PT0gMCkge1xuICAgIG5vZGUgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgIG5vZGUuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIGlmIChyZXR1cm5Sb290KSB7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZS5wYXJlbnQgJiYgIW5vZGUuaXNSb290KCkpIHtcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSb290ID0gKG5vZGU6IFROb2RlKSA9PiB7XG4gIGxldCByb290ID0gbm9kZTtcbiAgd2hpbGUgKHJvb3QgJiYgcm9vdC5wYXJlbnQgJiYgIXJvb3QuaXNSb290KCkpIHtcbiAgICByb290ID0gcm9vdC5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIHJvb3Q7XG59O1xuXG5leHBvcnQgY29uc3QgemVyb3MgPSAoc2l6ZTogW251bWJlciwgbnVtYmVyXSk6IG51bWJlcltdW10gPT5cbiAgbmV3IEFycmF5KHNpemVbMF0pLmZpbGwoMCkubWFwKCgpID0+IG5ldyBBcnJheShzaXplWzFdKS5maWxsKDApKTtcblxuZXhwb3J0IGNvbnN0IGVtcHR5ID0gKHNpemU6IFtudW1iZXIsIG51bWJlcl0pOiBzdHJpbmdbXVtdID0+XG4gIG5ldyBBcnJheShzaXplWzBdKS5maWxsKCcnKS5tYXAoKCkgPT4gbmV3IEFycmF5KHNpemVbMV0pLmZpbGwoJycpKTtcblxuZXhwb3J0IGNvbnN0IGNhbGNNb3N0ID0gKG1hdDogbnVtYmVyW11bXSwgYm9hcmRTaXplID0gMTkpID0+IHtcbiAgbGV0IGxlZnRNb3N0OiBudW1iZXIgPSBib2FyZFNpemUgLSAxO1xuICBsZXQgcmlnaHRNb3N0ID0gMDtcbiAgbGV0IHRvcE1vc3Q6IG51bWJlciA9IGJvYXJkU2l6ZSAtIDE7XG4gIGxldCBib3R0b21Nb3N0ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBtYXRbaV1bal07XG4gICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgaWYgKGxlZnRNb3N0ID4gaSkgbGVmdE1vc3QgPSBpO1xuICAgICAgICBpZiAocmlnaHRNb3N0IDwgaSkgcmlnaHRNb3N0ID0gaTtcbiAgICAgICAgaWYgKHRvcE1vc3QgPiBqKSB0b3BNb3N0ID0gajtcbiAgICAgICAgaWYgKGJvdHRvbU1vc3QgPCBqKSBib3R0b21Nb3N0ID0gajtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQ2VudGVyID0gKG1hdDogbnVtYmVyW11bXSwgYm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3Qge2xlZnRNb3N0LCByaWdodE1vc3QsIHRvcE1vc3QsIGJvdHRvbU1vc3R9ID0gY2FsY01vc3QobWF0LCBib2FyZFNpemUpO1xuICBjb25zdCB0b3AgPSB0b3BNb3N0IDwgYm9hcmRTaXplIC0gMSAtIGJvdHRvbU1vc3Q7XG4gIGNvbnN0IGxlZnQgPSBsZWZ0TW9zdCA8IGJvYXJkU2l6ZSAtIDEgLSByaWdodE1vc3Q7XG4gIGlmICh0b3AgJiYgbGVmdCkgcmV0dXJuIENlbnRlci5Ub3BMZWZ0O1xuICBpZiAoIXRvcCAmJiBsZWZ0KSByZXR1cm4gQ2VudGVyLkJvdHRvbUxlZnQ7XG4gIGlmICh0b3AgJiYgIWxlZnQpIHJldHVybiBDZW50ZXIuVG9wUmlnaHQ7XG4gIGlmICghdG9wICYmICFsZWZ0KSByZXR1cm4gQ2VudGVyLkJvdHRvbVJpZ2h0O1xuICByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQm9hcmRTaXplID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGJvYXJkU2l6ZSA9IDE5LFxuICBleHRlbnQgPSAyXG4pOiBudW1iZXJbXSA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IFsxOSwgMTldO1xuICBjb25zdCBjZW50ZXIgPSBjYWxjQ2VudGVyKG1hdCk7XG4gIGNvbnN0IHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fSA9IGNhbGNNb3N0KG1hdCwgYm9hcmRTaXplKTtcbiAgaWYgKGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQpIHtcbiAgICByZXN1bHRbMF0gPSByaWdodE1vc3QgKyBleHRlbnQgKyAxO1xuICAgIHJlc3VsdFsxXSA9IGJvdHRvbU1vc3QgKyBleHRlbnQgKyAxO1xuICB9XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCkge1xuICAgIHJlc3VsdFswXSA9IGJvYXJkU2l6ZSAtIGxlZnRNb3N0ICsgZXh0ZW50O1xuICAgIHJlc3VsdFsxXSA9IGJvdHRvbU1vc3QgKyBleHRlbnQgKyAxO1xuICB9XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0KSB7XG4gICAgcmVzdWx0WzBdID0gcmlnaHRNb3N0ICsgZXh0ZW50ICsgMTtcbiAgICByZXN1bHRbMV0gPSBib2FyZFNpemUgLSB0b3BNb3N0ICsgZXh0ZW50O1xuICB9XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCkge1xuICAgIHJlc3VsdFswXSA9IGJvYXJkU2l6ZSAtIGxlZnRNb3N0ICsgZXh0ZW50O1xuICAgIHJlc3VsdFsxXSA9IGJvYXJkU2l6ZSAtIHRvcE1vc3QgKyBleHRlbnQ7XG4gIH1cbiAgcmVzdWx0WzBdID0gTWF0aC5taW4ocmVzdWx0WzBdLCBib2FyZFNpemUpO1xuICByZXN1bHRbMV0gPSBNYXRoLm1pbihyZXN1bHRbMV0sIGJvYXJkU2l6ZSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjUGFydGlhbEFyZWEgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgZXh0ZW50ID0gMixcbiAgYm9hcmRTaXplID0gMTlcbik6IFtbbnVtYmVyLCBudW1iZXJdLCBbbnVtYmVyLCBudW1iZXJdXSA9PiB7XG4gIGNvbnN0IHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fSA9IGNhbGNNb3N0KG1hdCk7XG5cbiAgY29uc3Qgc2l6ZSA9IGJvYXJkU2l6ZSAtIDE7XG4gIGNvbnN0IHgxID0gbGVmdE1vc3QgLSBleHRlbnQgPCAwID8gMCA6IGxlZnRNb3N0IC0gZXh0ZW50O1xuICBjb25zdCB5MSA9IHRvcE1vc3QgLSBleHRlbnQgPCAwID8gMCA6IHRvcE1vc3QgLSBleHRlbnQ7XG4gIGNvbnN0IHgyID0gcmlnaHRNb3N0ICsgZXh0ZW50ID4gc2l6ZSA/IHNpemUgOiByaWdodE1vc3QgKyBleHRlbnQ7XG4gIGNvbnN0IHkyID0gYm90dG9tTW9zdCArIGV4dGVudCA+IHNpemUgPyBzaXplIDogYm90dG9tTW9zdCArIGV4dGVudDtcblxuICByZXR1cm4gW1xuICAgIFt4MSwgeTFdLFxuICAgIFt4MiwgeTJdLFxuICBdO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNBdm9pZE1vdmVzRm9yUGFydGlhbEFuYWx5c2lzID0gKFxuICBwYXJ0aWFsQXJlYTogW1tudW1iZXIsIG51bWJlcl0sIFtudW1iZXIsIG51bWJlcl1dLFxuICBib2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGNvbnN0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdCBbW3gxLCB5MV0sIFt4MiwgeTJdXSA9IHBhcnRpYWxBcmVhO1xuXG4gIGZvciAoY29uc3QgY29sIG9mIEExX0xFVFRFUlMuc2xpY2UoMCwgYm9hcmRTaXplKSkge1xuICAgIGZvciAoY29uc3Qgcm93IG9mIEExX05VTUJFUlMuc2xpY2UoLWJvYXJkU2l6ZSkpIHtcbiAgICAgIGNvbnN0IHggPSBBMV9MRVRURVJTLmluZGV4T2YoY29sKTtcbiAgICAgIGNvbnN0IHkgPSBBMV9OVU1CRVJTLmluZGV4T2Yocm93KTtcblxuICAgICAgaWYgKHggPCB4MSB8fCB4ID4geDIgfHwgeSA8IHkxIHx8IHkgPiB5Mikge1xuICAgICAgICByZXN1bHQucHVzaChgJHtjb2x9JHtyb3d9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjVHN1bWVnb0ZyYW1lID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGV4dGVudDogbnVtYmVyLFxuICBib2FyZFNpemUgPSAxOSxcbiAga29taSA9IDcuNSxcbiAgdHVybjogS2kgPSBLaS5CbGFjayxcbiAga28gPSBmYWxzZVxuKTogbnVtYmVyW11bXSA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IGNsb25lRGVlcChtYXQpO1xuICBjb25zdCBwYXJ0aWFsQXJlYSA9IGNhbGNQYXJ0aWFsQXJlYShtYXQsIGV4dGVudCwgYm9hcmRTaXplKTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuICBjb25zdCBwdXRCb3JkZXIgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gICAgY29uc3QgW3gxLCB5MV0gPSBwYXJ0aWFsQXJlYVswXTtcbiAgICBjb25zdCBbeDIsIHkyXSA9IHBhcnRpYWxBcmVhWzFdO1xuICAgIGZvciAobGV0IGkgPSB4MTsgaSA8PSB4MjsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0geTE7IGogPD0geTI7IGorKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCAmJlxuICAgICAgICAgICgoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0ICYmXG4gICAgICAgICAgKChpID09PSB4MSAmJiBpID4gMCkgfHxcbiAgICAgICAgICAgIChqID09PSB5MiAmJiBqIDwgYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgICAgIChpID09PSB4MiAmJiBpIDwgYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgICAgIChqID09PSB5MSAmJiBqID4gMCkpXG4gICAgICAgICkge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCAmJlxuICAgICAgICAgICgoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApIHx8XG4gICAgICAgICAgICAoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0ICYmXG4gICAgICAgICAgKChpID09PSB4MSAmJiBpID4gMCkgfHxcbiAgICAgICAgICAgIChqID09PSB5MSAmJiBqID4gMCkgfHxcbiAgICAgICAgICAgIChpID09PSB4MiAmJiBpIDwgYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgICAgIChqID09PSB5MiAmJiBqIDwgYm9hcmRTaXplIC0gMSkpXG4gICAgICAgICkge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoY2VudGVyID09PSBDZW50ZXIuQ2VudGVyKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgcHV0T3V0c2lkZSA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgICBjb25zdCBvZmZlbmNlVG9XaW4gPSAxMDtcbiAgICBjb25zdCBvZmZlbnNlS29taSA9IHR1cm4gKiBrb21pO1xuICAgIGNvbnN0IFt4MSwgeTFdID0gcGFydGlhbEFyZWFbMF07XG4gICAgY29uc3QgW3gyLCB5Ml0gPSBwYXJ0aWFsQXJlYVsxXTtcbiAgICAvLyBUT0RPOiBIYXJkIGNvZGUgZm9yIG5vd1xuICAgIC8vIGNvbnN0IGJsYWNrVG9BdHRhY2sgPSB0dXJuID09PSBLaS5CbGFjaztcbiAgICBjb25zdCBibGFja1RvQXR0YWNrID0gdHVybiA9PT0gS2kuQmxhY2s7XG4gICAgY29uc3QgaXNpemUgPSB4MiAtIHgxO1xuICAgIGNvbnN0IGpzaXplID0geTIgLSB5MTtcbiAgICAvLyBUT0RPOiAzNjEgaXMgaGFyZGNvZGVkXG4gICAgLy8gY29uc3QgZGVmZW5zZUFyZWEgPSBNYXRoLmZsb29yKFxuICAgIC8vICAgKDM2MSAtIGlzaXplICoganNpemUgLSBvZmZlbnNlS29taSAtIG9mZmVuY2VUb1dpbikgLyAyXG4gICAgLy8gKTtcbiAgICBjb25zdCBkZWZlbnNlQXJlYSA9XG4gICAgICBNYXRoLmZsb29yKCgzNjEgLSBpc2l6ZSAqIGpzaXplKSAvIDIpIC0gb2ZmZW5zZUtvbWkgLSBvZmZlbmNlVG9XaW47XG5cbiAgICAvLyBjb25zdCBkZWZlbnNlQXJlYSA9IDMwO1xuXG4gICAgLy8gb3V0c2lkZSB0aGUgZnJhbWVcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmRTaXplOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRTaXplOyBqKyspIHtcbiAgICAgICAgaWYgKGkgPCB4MSB8fCBpID4geDIgfHwgaiA8IHkxIHx8IGogPiB5Mikge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgbGV0IGtpID0gS2kuRW1wdHk7XG4gICAgICAgICAgaWYgKGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHwgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCkge1xuICAgICAgICAgICAga2kgPSBibGFja1RvQXR0YWNrICE9PSBjb3VudCA8PSBkZWZlbnNlQXJlYSA/IEtpLldoaXRlIDogS2kuQmxhY2s7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodFxuICAgICAgICAgICkge1xuICAgICAgICAgICAga2kgPSBibGFja1RvQXR0YWNrICE9PSBjb3VudCA8PSBkZWZlbnNlQXJlYSA/IEtpLkJsYWNrIDogS2kuV2hpdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgoaSArIGopICUgMiA9PT0gMCAmJiBNYXRoLmFicyhjb3VudCAtIGRlZmVuc2VBcmVhKSA+IGJvYXJkU2l6ZSkge1xuICAgICAgICAgICAga2kgPSBLaS5FbXB0eTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYXRbaV1bal0gPSBraTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLy8gVE9ETzpcbiAgY29uc3QgcHV0S29UaHJlYXQgPSAobWF0OiBudW1iZXJbXVtdLCBrbzogYm9vbGVhbikgPT4ge307XG5cbiAgcHV0Qm9yZGVyKHJlc3VsdCk7XG4gIHB1dE91dHNpZGUocmVzdWx0KTtcblxuICAvLyBjb25zdCBmbGlwU3BlYyA9XG4gIC8vICAgaW1pbiA8IGptaW5cbiAgLy8gICAgID8gW2ZhbHNlLCBmYWxzZSwgdHJ1ZV1cbiAgLy8gICAgIDogW25lZWRGbGlwKGltaW4sIGltYXgsIGlzaXplKSwgbmVlZEZsaXAoam1pbiwgam1heCwganNpemUpLCBmYWxzZV07XG5cbiAgLy8gaWYgKGZsaXBTcGVjLmluY2x1ZGVzKHRydWUpKSB7XG4gIC8vICAgY29uc3QgZmxpcHBlZCA9IGZsaXBTdG9uZXMoc3RvbmVzLCBmbGlwU3BlYyk7XG4gIC8vICAgY29uc3QgZmlsbGVkID0gdHN1bWVnb0ZyYW1lU3RvbmVzKGZsaXBwZWQsIGtvbWksIGJsYWNrVG9QbGF5LCBrbywgbWFyZ2luKTtcbiAgLy8gICByZXR1cm4gZmxpcFN0b25lcyhmaWxsZWQsIGZsaXBTcGVjKTtcbiAgLy8gfVxuXG4gIC8vIGNvbnN0IGkwID0gaW1pbiAtIG1hcmdpbjtcbiAgLy8gY29uc3QgaTEgPSBpbWF4ICsgbWFyZ2luO1xuICAvLyBjb25zdCBqMCA9IGptaW4gLSBtYXJnaW47XG4gIC8vIGNvbnN0IGoxID0gam1heCArIG1hcmdpbjtcbiAgLy8gY29uc3QgZnJhbWVSYW5nZTogUmVnaW9uID0gW2kwLCBpMSwgajAsIGoxXTtcbiAgLy8gY29uc3QgYmxhY2tUb0F0dGFjayA9IGd1ZXNzQmxhY2tUb0F0dGFjayhcbiAgLy8gICBbdG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0XSxcbiAgLy8gICBbaXNpemUsIGpzaXplXVxuICAvLyApO1xuXG4gIC8vIHB1dEJvcmRlcihtYXQsIFtpc2l6ZSwganNpemVdLCBmcmFtZVJhbmdlLCBibGFja1RvQXR0YWNrKTtcbiAgLy8gcHV0T3V0c2lkZShcbiAgLy8gICBzdG9uZXMsXG4gIC8vICAgW2lzaXplLCBqc2l6ZV0sXG4gIC8vICAgZnJhbWVSYW5nZSxcbiAgLy8gICBibGFja1RvQXR0YWNrLFxuICAvLyAgIGJsYWNrVG9QbGF5LFxuICAvLyAgIGtvbWlcbiAgLy8gKTtcbiAgLy8gcHV0S29UaHJlYXQoXG4gIC8vICAgc3RvbmVzLFxuICAvLyAgIFtpc2l6ZSwganNpemVdLFxuICAvLyAgIGZyYW1lUmFuZ2UsXG4gIC8vICAgYmxhY2tUb0F0dGFjayxcbiAgLy8gICBibGFja1RvUGxheSxcbiAgLy8gICBrb1xuICAvLyApO1xuICAvLyByZXR1cm4gc3RvbmVzO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY09mZnNldCA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgY29uc3QgYm9hcmRTaXplID0gY2FsY0JvYXJkU2l6ZShtYXQpO1xuICBjb25zdCBveCA9IDE5IC0gYm9hcmRTaXplWzBdO1xuICBjb25zdCBveSA9IDE5IC0gYm9hcmRTaXplWzFdO1xuICBjb25zdCBjZW50ZXIgPSBjYWxjQ2VudGVyKG1hdCk7XG5cbiAgbGV0IG9veCA9IG94O1xuICBsZXQgb295ID0gb3k7XG4gIHN3aXRjaCAoY2VudGVyKSB7XG4gICAgY2FzZSBDZW50ZXIuVG9wTGVmdDoge1xuICAgICAgb294ID0gMDtcbiAgICAgIG9veSA9IG95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLlRvcFJpZ2h0OiB7XG4gICAgICBvb3ggPSAtb3g7XG4gICAgICBvb3kgPSBveTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21MZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21SaWdodDoge1xuICAgICAgb294ID0gLW94O1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge3g6IG9veCwgeTogb295fTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXZlcnNlT2Zmc2V0ID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGJ4ID0gMTksXG4gIGJ5ID0gMTksXG4gIGJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgY29uc3Qgb3ggPSBib2FyZFNpemUgLSBieDtcbiAgY29uc3Qgb3kgPSBib2FyZFNpemUgLSBieTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuXG4gIGxldCBvb3ggPSBveDtcbiAgbGV0IG9veSA9IG95O1xuICBzd2l0Y2ggKGNlbnRlcikge1xuICAgIGNhc2UgQ2VudGVyLlRvcExlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSAtb3k7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuVG9wUmlnaHQ6IHtcbiAgICAgIG9veCA9IG94O1xuICAgICAgb295ID0gLW95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLkJvdHRvbUxlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSAwO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLkJvdHRvbVJpZ2h0OiB7XG4gICAgICBvb3ggPSBveDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt4OiBvb3gsIHk6IG9veX07XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2FsY1Zpc2libGVBcmVhKFxuICBtYXQ6IG51bWJlcltdW10gPSB6ZXJvcyhbMTksIDE5XSksXG4gIGV4dGVudDogbnVtYmVyLFxuICBhbGxvd1JlY3RhbmdsZSA9IGZhbHNlXG4pOiBudW1iZXJbXVtdIHtcbiAgbGV0IG1pblJvdyA9IG1hdC5sZW5ndGg7XG4gIGxldCBtYXhSb3cgPSAwO1xuICBsZXQgbWluQ29sID0gbWF0WzBdLmxlbmd0aDtcbiAgbGV0IG1heENvbCA9IDA7XG5cbiAgbGV0IGVtcHR5ID0gdHJ1ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0WzBdLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAobWF0W2ldW2pdICE9PSAwKSB7XG4gICAgICAgIGVtcHR5ID0gZmFsc2U7XG4gICAgICAgIG1pblJvdyA9IE1hdGgubWluKG1pblJvdywgaSk7XG4gICAgICAgIG1heFJvdyA9IE1hdGgubWF4KG1heFJvdywgaSk7XG4gICAgICAgIG1pbkNvbCA9IE1hdGgubWluKG1pbkNvbCwgaik7XG4gICAgICAgIG1heENvbCA9IE1hdGgubWF4KG1heENvbCwgaik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGVtcHR5KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIFswLCBtYXQubGVuZ3RoIC0gMV0sXG4gICAgICBbMCwgbWF0WzBdLmxlbmd0aCAtIDFdLFxuICAgIF07XG4gIH1cblxuICBpZiAoIWFsbG93UmVjdGFuZ2xlKSB7XG4gICAgY29uc3QgbWluUm93V2l0aEV4dGVudCA9IE1hdGgubWF4KG1pblJvdyAtIGV4dGVudCwgMCk7XG4gICAgY29uc3QgbWF4Um93V2l0aEV4dGVudCA9IE1hdGgubWluKG1heFJvdyArIGV4dGVudCwgbWF0Lmxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IG1pbkNvbFdpdGhFeHRlbnQgPSBNYXRoLm1heChtaW5Db2wgLSBleHRlbnQsIDApO1xuICAgIGNvbnN0IG1heENvbFdpdGhFeHRlbnQgPSBNYXRoLm1pbihtYXhDb2wgKyBleHRlbnQsIG1hdFswXS5sZW5ndGggLSAxKTtcblxuICAgIGNvbnN0IG1heFJhbmdlID0gTWF0aC5tYXgoXG4gICAgICBtYXhSb3dXaXRoRXh0ZW50IC0gbWluUm93V2l0aEV4dGVudCxcbiAgICAgIG1heENvbFdpdGhFeHRlbnQgLSBtaW5Db2xXaXRoRXh0ZW50XG4gICAgKTtcblxuICAgIG1pblJvdyA9IG1pblJvd1dpdGhFeHRlbnQ7XG4gICAgbWF4Um93ID0gbWluUm93ICsgbWF4UmFuZ2U7XG5cbiAgICBpZiAobWF4Um93ID49IG1hdC5sZW5ndGgpIHtcbiAgICAgIG1heFJvdyA9IG1hdC5sZW5ndGggLSAxO1xuICAgICAgbWluUm93ID0gbWF4Um93IC0gbWF4UmFuZ2U7XG4gICAgfVxuXG4gICAgbWluQ29sID0gbWluQ29sV2l0aEV4dGVudDtcbiAgICBtYXhDb2wgPSBtaW5Db2wgKyBtYXhSYW5nZTtcbiAgICBpZiAobWF4Q29sID49IG1hdFswXS5sZW5ndGgpIHtcbiAgICAgIG1heENvbCA9IG1hdFswXS5sZW5ndGggLSAxO1xuICAgICAgbWluQ29sID0gbWF4Q29sIC0gbWF4UmFuZ2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1pblJvdyA9IE1hdGgubWF4KDAsIG1pblJvdyAtIGV4dGVudCk7XG4gICAgbWF4Um93ID0gTWF0aC5taW4obWF0Lmxlbmd0aCAtIDEsIG1heFJvdyArIGV4dGVudCk7XG4gICAgbWluQ29sID0gTWF0aC5tYXgoMCwgbWluQ29sIC0gZXh0ZW50KTtcbiAgICBtYXhDb2wgPSBNYXRoLm1pbihtYXRbMF0ubGVuZ3RoIC0gMSwgbWF4Q29sICsgZXh0ZW50KTtcbiAgfVxuXG4gIHJldHVybiBbXG4gICAgW21pblJvdywgbWF4Um93XSxcbiAgICBbbWluQ29sLCBtYXhDb2xdLFxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbW92ZShtYXQ6IG51bWJlcltdW10sIGk6IG51bWJlciwgajogbnVtYmVyLCBraTogbnVtYmVyKSB7XG4gIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuIG1hdDtcbiAgY29uc3QgbmV3TWF0ID0gY2xvbmVEZWVwKG1hdCk7XG4gIG5ld01hdFtpXVtqXSA9IGtpO1xuICByZXR1cm4gZXhlY0NhcHR1cmUobmV3TWF0LCBpLCBqLCAta2kpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0tpKG1hdDogbnVtYmVyW11bXSwgc3RlcHM6IHN0cmluZ1tdLCBpc0NhcHR1cmVkID0gdHJ1ZSkge1xuICBsZXQgbmV3TWF0ID0gY2xvbmVEZWVwKG1hdCk7XG4gIGxldCBoYXNNb3ZlZCA9IGZhbHNlO1xuICBzdGVwcy5mb3JFYWNoKHN0ciA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBraSxcbiAgICB9OiB7XG4gICAgICB4OiBudW1iZXI7XG4gICAgICB5OiBudW1iZXI7XG4gICAgICBraTogbnVtYmVyO1xuICAgIH0gPSBzZ2ZUb1BvcyhzdHIpO1xuICAgIGlmIChpc0NhcHR1cmVkKSB7XG4gICAgICBpZiAoY2FuTW92ZShuZXdNYXQsIHgsIHksIGtpKSkge1xuICAgICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgICAgbmV3TWF0ID0gZXhlY0NhcHR1cmUobmV3TWF0LCB4LCB5LCAta2kpO1xuICAgICAgICBoYXNNb3ZlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld01hdFt4XVt5XSA9IGtpO1xuICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBhcnJhbmdlbWVudDogbmV3TWF0LFxuICAgIGhhc01vdmVkLFxuICB9O1xufVxuXG4vLyBUT0RPOlxuZXhwb3J0IGNvbnN0IGhhbmRsZU1vdmUgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgaTogbnVtYmVyLFxuICBqOiBudW1iZXIsXG4gIHR1cm46IEtpLFxuICBjdXJyZW50Tm9kZTogVE5vZGUsXG4gIG9uQWZ0ZXJNb3ZlOiAobm9kZTogVE5vZGUsIGlzTW92ZWQ6IGJvb2xlYW4pID0+IHZvaWRcbikgPT4ge1xuICBpZiAodHVybiA9PT0gS2kuRW1wdHkpIHJldHVybjtcbiAgaWYgKGNhbk1vdmUobWF0LCBpLCBqLCB0dXJuKSkge1xuICAgIC8vIGRpc3BhdGNoKHVpU2xpY2UuYWN0aW9ucy5zZXRUdXJuKC10dXJuKSk7XG4gICAgY29uc3QgdmFsdWUgPSBTR0ZfTEVUVEVSU1tpXSArIFNHRl9MRVRURVJTW2pdO1xuICAgIGNvbnN0IHRva2VuID0gdHVybiA9PT0gS2kuQmxhY2sgPyAnQicgOiAnVyc7XG4gICAgY29uc3QgaGFzaCA9IGNhbGNIYXNoKGN1cnJlbnROb2RlLCBbTW92ZVByb3AuZnJvbShgJHt0b2tlbn1bJHt2YWx1ZX1dYCldKTtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IGN1cnJlbnROb2RlLmNoaWxkcmVuLmZpbHRlcihcbiAgICAgIChuOiBUTm9kZSkgPT4gbi5tb2RlbC5pZCA9PT0gaGFzaFxuICAgICk7XG4gICAgbGV0IG5vZGU6IFROb2RlO1xuICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICBub2RlID0gZmlsdGVyZWRbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSBidWlsZE1vdmVOb2RlKGAke3Rva2VufVske3ZhbHVlfV1gLCBjdXJyZW50Tm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChub2RlKTtcbiAgICB9XG4gICAgaWYgKG9uQWZ0ZXJNb3ZlKSBvbkFmdGVyTW92ZShub2RlLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob25BZnRlck1vdmUpIG9uQWZ0ZXJNb3ZlKGN1cnJlbnROb2RlLCBmYWxzZSk7XG4gIH1cbn07XG5cbi8qKlxuICogQ2xlYXIgc3RvbmUgZnJvbSB0aGUgY3VycmVudE5vZGVcbiAqIEBwYXJhbSBjdXJyZW50Tm9kZVxuICogQHBhcmFtIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBjbGVhclN0b25lRnJvbUN1cnJlbnROb2RlID0gKFxuICBjdXJyZW50Tm9kZTogVE5vZGUsXG4gIHZhbHVlOiBzdHJpbmdcbikgPT4ge1xuICBjb25zdCBwYXRoID0gY3VycmVudE5vZGUuZ2V0UGF0aCgpO1xuICBwYXRoLmZvckVhY2gobm9kZSA9PiB7XG4gICAgY29uc3Qge3NldHVwUHJvcHN9ID0gbm9kZS5tb2RlbDtcbiAgICBpZiAoc2V0dXBQcm9wcy5maWx0ZXIoKHM6IFNldHVwUHJvcCkgPT4gcy52YWx1ZSA9PT0gdmFsdWUpLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vZGUubW9kZWwuc2V0dXBQcm9wcyA9IHNldHVwUHJvcHMuZmlsdGVyKChzOiBhbnkpID0+IHMudmFsdWUgIT09IHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dXBQcm9wcy5mb3JFYWNoKChzOiBTZXR1cFByb3ApID0+IHtcbiAgICAgICAgcy52YWx1ZXMgPSBzLnZhbHVlcy5maWx0ZXIodiA9PiB2ICE9PSB2YWx1ZSk7XG4gICAgICAgIGlmIChzLnZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBub2RlLm1vZGVsLnNldHVwUHJvcHMgPSBub2RlLm1vZGVsLnNldHVwUHJvcHMuZmlsdGVyKFxuICAgICAgICAgICAgKHA6IFNldHVwUHJvcCkgPT4gcC50b2tlbiAhPT0gcy50b2tlblxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBzdG9uZSB0byB0aGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICpcbiAqIEBwYXJhbSBjdXJyZW50Tm9kZSBUaGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICogQHBhcmFtIG1hdCBUaGUgbWF0cml4IHJlcHJlc2VudGluZyB0aGUgYm9hcmQuXG4gKiBAcGFyYW0gaSBUaGUgcm93IGluZGV4IG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSBqIFRoZSBjb2x1bW4gaW5kZXggb2YgdGhlIHN0b25lLlxuICogQHBhcmFtIGtpIFRoZSBjb2xvciBvZiB0aGUgc3RvbmUgKEtpLldoaXRlIG9yIEtpLkJsYWNrKS5cbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHN0b25lIHdhcyByZW1vdmVkIGZyb20gcHJldmlvdXMgbm9kZXMsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGFkZFN0b25lVG9DdXJyZW50Tm9kZSA9IChcbiAgY3VycmVudE5vZGU6IFROb2RlLFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogS2lcbikgPT4ge1xuICBjb25zdCB2YWx1ZSA9IFNHRl9MRVRURVJTW2ldICsgU0dGX0xFVFRFUlNbal07XG4gIGNvbnN0IHRva2VuID0ga2kgPT09IEtpLldoaXRlID8gJ0FXJyA6ICdBQic7XG4gIGNvbnN0IHByb3AgPSBmaW5kUHJvcChjdXJyZW50Tm9kZSwgdG9rZW4pO1xuICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gIGlmIChtYXRbaV1bal0gIT09IEtpLkVtcHR5KSB7XG4gICAgY2xlYXJTdG9uZUZyb21DdXJyZW50Tm9kZShjdXJyZW50Tm9kZSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChwcm9wKSB7XG4gICAgICBwcm9wLnZhbHVlcyA9IFsuLi5wcm9wLnZhbHVlcywgdmFsdWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50Tm9kZS5tb2RlbC5zZXR1cFByb3BzID0gW1xuICAgICAgICAuLi5jdXJyZW50Tm9kZS5tb2RlbC5zZXR1cFByb3BzLFxuICAgICAgICBuZXcgU2V0dXBQcm9wKHRva2VuLCB2YWx1ZSksXG4gICAgICBdO1xuICAgIH1cbiAgICByZXN1bHQgPSB0cnVlO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBtb3ZlIHRvIHRoZSBnaXZlbiBtYXRyaXggYW5kIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIElmIHRoZSBraSBpcyBlbXB0eSwgbm8gbW92ZSBpcyBhZGRlZCBhbmQgbnVsbCBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0gbWF0IC0gVGhlIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIGdhbWUgYm9hcmQuXG4gKiBAcGFyYW0gY3VycmVudE5vZGUgLSBUaGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICogQHBhcmFtIGkgLSBUaGUgcm93IGluZGV4IG9mIHRoZSBtb3ZlLlxuICogQHBhcmFtIGogLSBUaGUgY29sdW1uIGluZGV4IG9mIHRoZSBtb3ZlLlxuICogQHBhcmFtIGtpIC0gVGhlIHR5cGUgb2YgbW92ZSAoS2kpLlxuICogQHJldHVybnMgVGhlIGNvcnJlc3BvbmRpbmcgbm9kZSBpbiB0aGUgdHJlZSwgb3IgbnVsbCBpZiBubyBtb3ZlIGlzIGFkZGVkLlxuICovXG4vLyBUT0RPOiBUaGUgcGFyYW1zIGhlcmUgaXMgd2VpcmRcbmV4cG9ydCBjb25zdCBhZGRNb3ZlVG9DdXJyZW50Tm9kZSA9IChcbiAgY3VycmVudE5vZGU6IFROb2RlLFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogS2lcbikgPT4ge1xuICBpZiAoa2kgPT09IEtpLkVtcHR5KSByZXR1cm47XG4gIGxldCBub2RlO1xuICBpZiAoY2FuTW92ZShtYXQsIGksIGosIGtpKSkge1xuICAgIGNvbnN0IHZhbHVlID0gU0dGX0xFVFRFUlNbaV0gKyBTR0ZfTEVUVEVSU1tqXTtcbiAgICBjb25zdCB0b2tlbiA9IGtpID09PSBLaS5CbGFjayA/ICdCJyA6ICdXJztcbiAgICBjb25zdCBoYXNoID0gY2FsY0hhc2goY3VycmVudE5vZGUsIFtNb3ZlUHJvcC5mcm9tKGAke3Rva2VufVske3ZhbHVlfV1gKV0pO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gY3VycmVudE5vZGUuY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgKG46IFROb2RlKSA9PiBuLm1vZGVsLmlkID09PSBoYXNoXG4gICAgKTtcbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgbm9kZSA9IGZpbHRlcmVkWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gYnVpbGRNb3ZlTm9kZShgJHt0b2tlbn1bJHt2YWx1ZX1dYCwgY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNQcmV2ZW50TW92ZU1hdEZvckRpc3BsYXlPbmx5ID0gKFxuICBub2RlOiBUTm9kZSxcbiAgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgaWYgKCFub2RlKSByZXR1cm4gemVyb3MoW2RlZmF1bHRCb2FyZFNpemUsIGRlZmF1bHRCb2FyZFNpemVdKTtcbiAgY29uc3Qgc2l6ZSA9IGV4dHJhY3RCb2FyZFNpemUobm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGNvbnN0IHByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcblxuICBwcmV2ZW50TW92ZU1hdC5mb3JFYWNoKHJvdyA9PiByb3cuZmlsbCgxKSk7XG4gIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFROb2RlKSA9PiB7XG4gICAgICBuLm1vZGVsLm1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgcHJldmVudE1vdmVNYXRbaV1bal0gPSAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcHJldmVudE1vdmVNYXQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1ByZXZlbnRNb3ZlTWF0ID0gKG5vZGU6IFROb2RlLCBkZWZhdWx0Qm9hcmRTaXplID0gMTkpID0+IHtcbiAgaWYgKCFub2RlKSByZXR1cm4gemVyb3MoW2RlZmF1bHRCb2FyZFNpemUsIGRlZmF1bHRCb2FyZFNpemVdKTtcbiAgY29uc3Qgc2l6ZSA9IGV4dHJhY3RCb2FyZFNpemUobm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGNvbnN0IHByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgY29uc3QgZm9yY2VOb2RlcyA9IFtdO1xuICBsZXQgcHJldmVudE1vdmVOb2RlczogVE5vZGVbXSA9IFtdO1xuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgcHJldmVudE1vdmVOb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUTm9kZSkgPT4gaXNQcmV2ZW50TW92ZU5vZGUobikpO1xuICB9XG5cbiAgaWYgKGlzRm9yY2VOb2RlKG5vZGUpKSB7XG4gICAgcHJldmVudE1vdmVNYXQuZm9yRWFjaChyb3cgPT4gcm93LmZpbGwoMSkpO1xuICAgIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgobjogVE5vZGUpID0+IHtcbiAgICAgICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgICAgcHJldmVudE1vdmVNYXRbaV1bal0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcmV2ZW50TW92ZU5vZGVzLmZvckVhY2goKG46IFROb2RlKSA9PiB7XG4gICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMF0pO1xuICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICBwcmV2ZW50TW92ZU1hdFtpXVtqXSA9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBwcmV2ZW50TW92ZU1hdDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbWFya3VwIG1hdHJpeCBmb3IgdmFyaWF0aW9ucyBpbiBhIGdpdmVuIFNHRiBub2RlLlxuICpcbiAqIEBwYXJhbSBub2RlIC0gVGhlIFNHRiBub2RlIHRvIGNhbGN1bGF0ZSB0aGUgbWFya3VwIGZvci5cbiAqIEBwYXJhbSBwb2xpY3kgLSBUaGUgcG9saWN5IGZvciBoYW5kbGluZyB0aGUgbWFya3VwLiBEZWZhdWx0cyB0byAnYXBwZW5kJy5cbiAqIEByZXR1cm5zIFRoZSBjYWxjdWxhdGVkIG1hcmt1cCBmb3IgdGhlIHZhcmlhdGlvbnMuXG4gKi9cbmV4cG9ydCBjb25zdCBjYWxjVmFyaWF0aW9uc01hcmt1cCA9IChcbiAgbm9kZTogVE5vZGUsXG4gIHBvbGljeTogJ2FwcGVuZCcgfCAncHJlcGVuZCcgfCAncmVwbGFjZScgPSAnYXBwZW5kJyxcbiAgYWN0aXZlSW5kZXg6IG51bWJlciA9IDAsXG4gIGRlZmF1bHRCb2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGNvbnN0IHJlcyA9IGNhbGNNYXRBbmRNYXJrdXAobm9kZSk7XG4gIGNvbnN0IHttYXQsIG1hcmt1cH0gPSByZXM7XG4gIGNvbnN0IHNpemUgPSBleHRyYWN0Qm9hcmRTaXplKG5vZGUsIGRlZmF1bHRCb2FyZFNpemUpO1xuXG4gIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFROb2RlKSA9PiB7XG4gICAgICBuLm1vZGVsLm1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICBsZXQgbWFyayA9IE1hcmt1cC5OZXV0cmFsTm9kZTtcbiAgICAgICAgICBpZiAoaW5Xcm9uZ1BhdGgobikpIHtcbiAgICAgICAgICAgIG1hcmsgPVxuICAgICAgICAgICAgICBuLmdldEluZGV4KCkgPT09IGFjdGl2ZUluZGV4XG4gICAgICAgICAgICAgICAgPyBNYXJrdXAuTmVnYXRpdmVBY3RpdmVOb2RlXG4gICAgICAgICAgICAgICAgOiBNYXJrdXAuTmVnYXRpdmVOb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaW5SaWdodFBhdGgobikpIHtcbiAgICAgICAgICAgIG1hcmsgPVxuICAgICAgICAgICAgICBuLmdldEluZGV4KCkgPT09IGFjdGl2ZUluZGV4XG4gICAgICAgICAgICAgICAgPyBNYXJrdXAuUG9zaXRpdmVBY3RpdmVOb2RlXG4gICAgICAgICAgICAgICAgOiBNYXJrdXAuUG9zaXRpdmVOb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWF0W2ldW2pdID09PSBLaS5FbXB0eSkge1xuICAgICAgICAgICAgc3dpdGNoIChwb2xpY3kpIHtcbiAgICAgICAgICAgICAgY2FzZSAncHJlcGVuZCc6XG4gICAgICAgICAgICAgICAgbWFya3VwW2ldW2pdID0gbWFyayArICd8JyArIG1hcmt1cFtpXVtqXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAncmVwbGFjZSc6XG4gICAgICAgICAgICAgICAgbWFya3VwW2ldW2pdID0gbWFyaztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwZW5kJzpcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtYXJrdXBbaV1bal0gKz0gJ3wnICsgbWFyaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG1hcmt1cDtcbn07XG5cbmV4cG9ydCBjb25zdCBkZXRlY3RTVCA9IChub2RlOiBUTm9kZSkgPT4ge1xuICAvLyBSZWZlcmVuY2U6IGh0dHBzOi8vd3d3LnJlZC1iZWFuLmNvbS9zZ2YvcHJvcGVydGllcy5odG1sI1NUXG4gIGNvbnN0IHJvb3QgPSBub2RlLmdldFBhdGgoKVswXTtcbiAgY29uc3Qgc3RQcm9wID0gcm9vdC5tb2RlbC5yb290UHJvcHMuZmluZCgocDogUm9vdFByb3ApID0+IHAudG9rZW4gPT09ICdTVCcpO1xuICBsZXQgc2hvd1ZhcmlhdGlvbnNNYXJrdXAgPSBmYWxzZTtcbiAgbGV0IHNob3dDaGlsZHJlbk1hcmt1cCA9IGZhbHNlO1xuICBsZXQgc2hvd1NpYmxpbmdzTWFya3VwID0gZmFsc2U7XG5cbiAgY29uc3Qgc3QgPSBzdFByb3A/LnZhbHVlIHx8ICcwJztcbiAgaWYgKHN0KSB7XG4gICAgaWYgKHN0ID09PSAnMCcpIHtcbiAgICAgIHNob3dTaWJsaW5nc01hcmt1cCA9IGZhbHNlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gdHJ1ZTtcbiAgICAgIHNob3dWYXJpYXRpb25zTWFya3VwID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHN0ID09PSAnMScpIHtcbiAgICAgIHNob3dTaWJsaW5nc01hcmt1cCA9IHRydWU7XG4gICAgICBzaG93Q2hpbGRyZW5NYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dWYXJpYXRpb25zTWFya3VwID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHN0ID09PSAnMicpIHtcbiAgICAgIHNob3dTaWJsaW5nc01hcmt1cCA9IGZhbHNlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gdHJ1ZTtcbiAgICAgIHNob3dWYXJpYXRpb25zTWFya3VwID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzMnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSB0cnVlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gZmFsc2U7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge3Nob3dWYXJpYXRpb25zTWFya3VwLCBzaG93Q2hpbGRyZW5NYXJrdXAsIHNob3dTaWJsaW5nc01hcmt1cH07XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIG1hdCBhbmQgbWFya3VwIGFycmF5cyBiYXNlZCBvbiB0aGUgY3VycmVudE5vZGUgYW5kIGRlZmF1bHRCb2FyZFNpemUuXG4gKiBAcGFyYW0gY3VycmVudE5vZGUgVGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIEBwYXJhbSBkZWZhdWx0Qm9hcmRTaXplIFRoZSBkZWZhdWx0IHNpemUgb2YgdGhlIGJvYXJkIChvcHRpb25hbCwgZGVmYXVsdCBpcyAxOSkuXG4gKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWF0L3Zpc2libGVBcmVhTWF0L21hcmt1cC9udW1NYXJrdXAgYXJyYXlzLlxuICovXG5leHBvcnQgY29uc3QgY2FsY01hdEFuZE1hcmt1cCA9IChjdXJyZW50Tm9kZTogVE5vZGUsIGRlZmF1bHRCb2FyZFNpemUgPSAxOSkgPT4ge1xuICBjb25zdCBwYXRoID0gY3VycmVudE5vZGUuZ2V0UGF0aCgpO1xuICBjb25zdCByb290ID0gcGF0aFswXTtcblxuICBsZXQgbGksIGxqO1xuICBsZXQgc2V0dXBDb3VudCA9IDA7XG4gIGNvbnN0IHNpemUgPSBleHRyYWN0Qm9hcmRTaXplKGN1cnJlbnROb2RlLCBkZWZhdWx0Qm9hcmRTaXplKTtcbiAgbGV0IG1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IHZpc2libGVBcmVhTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgY29uc3QgbWFya3VwID0gZW1wdHkoW3NpemUsIHNpemVdKTtcbiAgY29uc3QgbnVtTWFya3VwID0gZW1wdHkoW3NpemUsIHNpemVdKTtcblxuICBwYXRoLmZvckVhY2goKG5vZGUsIGluZGV4KSA9PiB7XG4gICAgY29uc3Qge21vdmVQcm9wcywgc2V0dXBQcm9wcywgcm9vdFByb3BzfSA9IG5vZGUubW9kZWw7XG4gICAgaWYgKHNldHVwUHJvcHMubGVuZ3RoID4gMCkgc2V0dXBDb3VudCArPSAxO1xuXG4gICAgc2V0dXBQcm9wcy5mb3JFYWNoKChzZXR1cDogYW55KSA9PiB7XG4gICAgICBzZXR1cC52YWx1ZXMuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzFdKTtcbiAgICAgICAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm47XG4gICAgICAgIGlmIChpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgIGxpID0gaTtcbiAgICAgICAgICBsaiA9IGo7XG4gICAgICAgICAgbWF0W2ldW2pdID0gc2V0dXAudG9rZW4gPT09ICdBQicgPyAxIDogLTE7XG4gICAgICAgICAgaWYgKHNldHVwLnRva2VuID09PSAnQUUnKSBtYXRbaV1bal0gPSAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIG1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgIGxpID0gaTtcbiAgICAgICAgbGogPSBqO1xuICAgICAgICBtYXQgPSBtb3ZlKG1hdCwgaSwgaiwgbS50b2tlbiA9PT0gJ0InID8gS2kuQmxhY2sgOiBLaS5XaGl0ZSk7XG5cbiAgICAgICAgaWYgKGxpICE9PSB1bmRlZmluZWQgJiYgbGogIT09IHVuZGVmaW5lZCAmJiBsaSA+PSAwICYmIGxqID49IDApIHtcbiAgICAgICAgICBudW1NYXJrdXBbbGldW2xqXSA9IChcbiAgICAgICAgICAgIG5vZGUubW9kZWwubnVtYmVyIHx8IGluZGV4IC0gc2V0dXBDb3VudFxuICAgICAgICAgICkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCA9PT0gcGF0aC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgbWFya3VwW2xpXVtsal0gPSBNYXJrdXAuQ3VycmVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ2xlYXIgbnVtYmVyIHdoZW4gc3RvbmVzIGFyZSBjYXB0dXJlZFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgICBpZiAobWF0W2ldW2pdID09PSAwKSBudW1NYXJrdXBbaV1bal0gPSAnJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIENhbGN1bGF0aW5nIHRoZSB2aXNpYmxlIGFyZWFcbiAgaWYgKHJvb3QpIHtcbiAgICByb290LmFsbCgobm9kZTogVE5vZGUpID0+IHtcbiAgICAgIGNvbnN0IHttb3ZlUHJvcHMsIHNldHVwUHJvcHMsIHJvb3RQcm9wc30gPSBub2RlLm1vZGVsO1xuICAgICAgaWYgKHNldHVwUHJvcHMubGVuZ3RoID4gMCkgc2V0dXBDb3VudCArPSAxO1xuICAgICAgc2V0dXBQcm9wcy5mb3JFYWNoKChzZXR1cDogYW55KSA9PiB7XG4gICAgICAgIHNldHVwLnZhbHVlcy5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMF0pO1xuICAgICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzFdKTtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgICAgdmlzaWJsZUFyZWFNYXRbaV1bal0gPSBLaS5CbGFjaztcbiAgICAgICAgICAgIGlmIChzZXR1cC50b2tlbiA9PT0gJ0FFJykgdmlzaWJsZUFyZWFNYXRbaV1bal0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgbW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMF0pO1xuICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzFdKTtcbiAgICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICB2aXNpYmxlQXJlYU1hdFtpXVtqXSA9IEtpLkJsYWNrO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBtYXJrdXBQcm9wcyA9IGN1cnJlbnROb2RlLm1vZGVsLm1hcmt1cFByb3BzO1xuICBtYXJrdXBQcm9wcy5mb3JFYWNoKChtOiBNYXJrdXBQcm9wKSA9PiB7XG4gICAgY29uc3QgdG9rZW4gPSBtLnRva2VuO1xuICAgIGNvbnN0IHZhbHVlcyA9IG0udmFsdWVzO1xuICAgIHZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzBdKTtcbiAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzFdKTtcbiAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgIGxldCBtYXJrO1xuICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAgICAgY2FzZSAnQ1InOlxuICAgICAgICAgICAgbWFyayA9IE1hcmt1cC5DaXJjbGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdTUSc6XG4gICAgICAgICAgICBtYXJrID0gTWFya3VwLlNxdWFyZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1RSJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuVHJpYW5nbGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdNQSc6XG4gICAgICAgICAgICBtYXJrID0gTWFya3VwLkNyb3NzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgbWFyayA9IHZhbHVlLnNwbGl0KCc6JylbMV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcms7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIGlmIChcbiAgLy8gICBsaSAhPT0gdW5kZWZpbmVkICYmXG4gIC8vICAgbGogIT09IHVuZGVmaW5lZCAmJlxuICAvLyAgIGxpID49IDAgJiZcbiAgLy8gICBsaiA+PSAwICYmXG4gIC8vICAgIW1hcmt1cFtsaV1bbGpdXG4gIC8vICkge1xuICAvLyAgIG1hcmt1cFtsaV1bbGpdID0gTWFya3VwLkN1cnJlbnQ7XG4gIC8vIH1cblxuICByZXR1cm4ge21hdCwgdmlzaWJsZUFyZWFNYXQsIG1hcmt1cCwgbnVtTWFya3VwfTtcbn07XG5cbi8qKlxuICogRmluZHMgYSBwcm9wZXJ0eSBpbiB0aGUgZ2l2ZW4gbm9kZSBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgdG9rZW4uXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byBzZWFyY2ggZm9yIHRoZSBwcm9wZXJ0eS5cbiAqIEBwYXJhbSB0b2tlbiBUaGUgdG9rZW4gb2YgdGhlIHByb3BlcnR5IHRvIGZpbmQuXG4gKiBAcmV0dXJucyBUaGUgZm91bmQgcHJvcGVydHkgb3IgbnVsbCBpZiBub3QgZm91bmQuXG4gKi9cbmV4cG9ydCBjb25zdCBmaW5kUHJvcCA9IChub2RlOiBUTm9kZSwgdG9rZW46IHN0cmluZykgPT4ge1xuICBpZiAoIW5vZGUpIHJldHVybjtcbiAgaWYgKE1PVkVfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVQcm9wcy5maW5kKChwOiBNb3ZlUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHMuZmluZChcbiAgICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICBpZiAoTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tb3ZlQW5ub3RhdGlvblByb3BzLmZpbmQoXG4gICAgICAocDogTW92ZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgaWYgKFJPT1RfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLnJvb3RQcm9wcy5maW5kKChwOiBSb290UHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChTRVRVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwuc2V0dXBQcm9wcy5maW5kKChwOiBTZXR1cFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoTUFSS1VQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tYXJrdXBQcm9wcy5maW5kKChwOiBNYXJrdXBQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKEdBTUVfSU5GT19QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwuZ2FtZUluZm9Qcm9wcy5maW5kKFxuICAgICAgKHA6IEdhbWVJbmZvUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBGaW5kcyBwcm9wZXJ0aWVzIGluIGEgZ2l2ZW4gbm9kZSBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgdG9rZW4uXG4gKiBAcGFyYW0gbm9kZSAtIFRoZSBub2RlIHRvIHNlYXJjaCBmb3IgcHJvcGVydGllcy5cbiAqIEBwYXJhbSB0b2tlbiAtIFRoZSB0b2tlbiB0byBtYXRjaCBhZ2FpbnN0IHRoZSBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMgQW4gYXJyYXkgb2YgcHJvcGVydGllcyB0aGF0IG1hdGNoIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAqL1xuZXhwb3J0IGNvbnN0IGZpbmRQcm9wcyA9IChub2RlOiBUTm9kZSwgdG9rZW46IHN0cmluZykgPT4ge1xuICBpZiAoTU9WRV9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubW92ZVByb3BzLmZpbHRlcigocDogTW92ZVByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzLmZpbHRlcihcbiAgICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICBpZiAoTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tb3ZlQW5ub3RhdGlvblByb3BzLmZpbHRlcihcbiAgICAgIChwOiBNb3ZlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICBpZiAoUk9PVF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwucm9vdFByb3BzLmZpbHRlcigocDogUm9vdFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoU0VUVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLnNldHVwUHJvcHMuZmlsdGVyKChwOiBTZXR1cFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoTUFSS1VQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tYXJrdXBQcm9wcy5maWx0ZXIoKHA6IE1hcmt1cFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoR0FNRV9JTkZPX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5nYW1lSW5mb1Byb3BzLmZpbHRlcihcbiAgICAgIChwOiBHYW1lSW5mb1Byb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5leHBvcnQgY29uc3QgZ2VuTW92ZSA9IChcbiAgbm9kZTogVE5vZGUsXG4gIG9uUmlnaHQ6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQsXG4gIG9uV3Jvbmc6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQsXG4gIG9uVmFyaWFudDogKHBhdGg6IHN0cmluZykgPT4gdm9pZCxcbiAgb25PZmZQYXRoOiAocGF0aDogc3RyaW5nKSA9PiB2b2lkXG4pOiBUTm9kZSB8IHVuZGVmaW5lZCA9PiB7XG4gIGxldCBuZXh0Tm9kZTtcbiAgY29uc3QgZ2V0UGF0aCA9IChub2RlOiBUTm9kZSkgPT4ge1xuICAgIGNvbnN0IG5ld1BhdGggPSBjb21wYWN0KFxuICAgICAgbm9kZS5nZXRQYXRoKCkubWFwKG4gPT4gbi5tb2RlbC5tb3ZlUHJvcHNbMF0/LnRvU3RyaW5nKCkpXG4gICAgKS5qb2luKCc7Jyk7XG4gICAgcmV0dXJuIG5ld1BhdGg7XG4gIH07XG5cbiAgY29uc3QgY2hlY2tSZXN1bHQgPSAobm9kZTogVE5vZGUpID0+IHtcbiAgICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSByZXR1cm47XG5cbiAgICBjb25zdCBwYXRoID0gZ2V0UGF0aChub2RlKTtcbiAgICBpZiAoaXNSaWdodE5vZGUobm9kZSkpIHtcbiAgICAgIGlmIChvblJpZ2h0KSBvblJpZ2h0KHBhdGgpO1xuICAgIH0gZWxzZSBpZiAoaXNWYXJpYW50Tm9kZShub2RlKSkge1xuICAgICAgaWYgKG9uVmFyaWFudCkgb25WYXJpYW50KHBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob25Xcm9uZykgb25Xcm9uZyhwYXRoKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSkge1xuICAgIGNvbnN0IHJpZ2h0Tm9kZXMgPSBub2RlLmNoaWxkcmVuLmZpbHRlcigobjogVE5vZGUpID0+IGluUmlnaHRQYXRoKG4pKTtcbiAgICBjb25zdCB3cm9uZ05vZGVzID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKG46IFROb2RlKSA9PiBpbldyb25nUGF0aChuKSk7XG4gICAgY29uc3QgdmFyaWFudE5vZGVzID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKG46IFROb2RlKSA9PiBpblZhcmlhbnRQYXRoKG4pKTtcblxuICAgIG5leHROb2RlID0gbm9kZTtcblxuICAgIGlmIChpblJpZ2h0UGF0aChub2RlKSAmJiByaWdodE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5leHROb2RlID0gc2FtcGxlKHJpZ2h0Tm9kZXMpO1xuICAgIH0gZWxzZSBpZiAoaW5Xcm9uZ1BhdGgobm9kZSkgJiYgd3JvbmdOb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBuZXh0Tm9kZSA9IHNhbXBsZSh3cm9uZ05vZGVzKTtcbiAgICB9IGVsc2UgaWYgKGluVmFyaWFudFBhdGgobm9kZSkgJiYgdmFyaWFudE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5leHROb2RlID0gc2FtcGxlKHZhcmlhbnROb2Rlcyk7XG4gICAgfSBlbHNlIGlmIChpc1JpZ2h0Tm9kZShub2RlKSkge1xuICAgICAgb25SaWdodChnZXRQYXRoKG5leHROb2RlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uV3JvbmcoZ2V0UGF0aChuZXh0Tm9kZSkpO1xuICAgIH1cbiAgICBpZiAobmV4dE5vZGUpIGNoZWNrUmVzdWx0KG5leHROb2RlKTtcbiAgfSBlbHNlIHtcbiAgICBjaGVja1Jlc3VsdChub2RlKTtcbiAgfVxuICByZXR1cm4gbmV4dE5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEJvYXJkU2l6ZSA9IChub2RlOiBUTm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGNvbnN0IHJvb3QgPSBub2RlLmdldFBhdGgoKVswXTtcbiAgY29uc3Qgc2l6ZSA9IE1hdGgubWluKFxuICAgIHBhcnNlSW50KFN0cmluZyhmaW5kUHJvcChyb290LCAnU1onKT8udmFsdWUgfHwgZGVmYXVsdEJvYXJkU2l6ZSkpLFxuICAgIE1BWF9CT0FSRF9TSVpFXG4gICk7XG4gIHJldHVybiBzaXplO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpcnN0VG9Nb3ZlQ29sb3JGcm9tUm9vdCA9IChcbiAgcm9vdDogVE5vZGUgfCB1bmRlZmluZWQgfCBudWxsLFxuICBkZWZhdWx0TW92ZUNvbG9yOiBLaSA9IEtpLkJsYWNrXG4pID0+IHtcbiAgaWYgKHJvb3QpIHtcbiAgICBjb25zdCBzZXR1cE5vZGUgPSByb290LmZpcnN0KG4gPT4gaXNTZXR1cE5vZGUobikpO1xuICAgIGlmIChzZXR1cE5vZGUpIHtcbiAgICAgIGNvbnN0IGZpcnN0TW92ZU5vZGUgPSBzZXR1cE5vZGUuZmlyc3QobiA9PiBpc01vdmVOb2RlKG4pKTtcbiAgICAgIGlmICghZmlyc3RNb3ZlTm9kZSkgcmV0dXJuIGRlZmF1bHRNb3ZlQ29sb3I7XG4gICAgICByZXR1cm4gZ2V0TW92ZUNvbG9yKGZpcnN0TW92ZU5vZGUpO1xuICAgIH1cbiAgfVxuICAvLyBjb25zb2xlLndhcm4oJ0RlZmF1bHQgZmlyc3QgdG8gbW92ZSBjb2xvcicsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGaXJzdFRvTW92ZUNvbG9yRnJvbVNnZiA9IChcbiAgc2dmOiBzdHJpbmcsXG4gIGRlZmF1bHRNb3ZlQ29sb3I6IEtpID0gS2kuQmxhY2tcbikgPT4ge1xuICBjb25zdCBzZ2ZQYXJzZXIgPSBuZXcgU2dmKHNnZik7XG4gIGlmIChzZ2ZQYXJzZXIucm9vdClcbiAgICBnZXRGaXJzdFRvTW92ZUNvbG9yRnJvbVJvb3Qoc2dmUGFyc2VyLnJvb3QsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICAvLyBjb25zb2xlLndhcm4oJ0RlZmF1bHQgZmlyc3QgdG8gbW92ZSBjb2xvcicsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRNb3ZlQ29sb3IgPSAobm9kZTogVE5vZGUsIGRlZmF1bHRNb3ZlQ29sb3I6IEtpID0gS2kuQmxhY2spID0+IHtcbiAgY29uc3QgbW92ZVByb3AgPSBub2RlLm1vZGVsPy5tb3ZlUHJvcHM/LlswXTtcbiAgc3dpdGNoIChtb3ZlUHJvcD8udG9rZW4pIHtcbiAgICBjYXNlICdXJzpcbiAgICAgIHJldHVybiBLaS5XaGl0ZTtcbiAgICBjYXNlICdCJzpcbiAgICAgIHJldHVybiBLaS5CbGFjaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gY29uc29sZS53YXJuKCdEZWZhdWx0IG1vdmUgY29sb3IgaXMnLCBkZWZhdWx0TW92ZUNvbG9yKTtcbiAgICAgIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xuICB9XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvbmUge1xuICBwcm90ZWN0ZWQgZ2xvYmFsQWxwaGEgPSAxO1xuICBwcm90ZWN0ZWQgc2l6ZSA9IDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQga2k6IG51bWJlclxuICApIHt9XG4gIGRyYXcoKSB7XG4gICAgY29uc29sZS5sb2coJ1RCRCcpO1xuICB9XG5cbiAgc2V0R2xvYmFsQWxwaGEoYWxwaGE6IG51bWJlcikge1xuICAgIHRoaXMuZ2xvYmFsQWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIHNldFNpemUoc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgfVxufVxuIiwiaW1wb3J0IFN0b25lIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBDb2xvclN0b25lIGV4dGVuZHMgU3RvbmUge1xuICBjb25zdHJ1Y3RvcihjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpIHtcbiAgICBzdXBlcihjdHgsIHgsIHksIGtpKTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgc2l6ZSwga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgaWYgKHNpemUgPD0gMCkgcmV0dXJuO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICBjdHgubGluZVdpZHRoID0gMTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgaWYgKGtpID09PSAxKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmYnO1xuICAgIH1cbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgU3RvbmUgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGNsYXNzIEltYWdlU3RvbmUgZXh0ZW5kcyBTdG9uZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAga2k6IG51bWJlcixcbiAgICBwcml2YXRlIG1vZDogbnVtYmVyLFxuICAgIHByaXZhdGUgYmxhY2tzOiBhbnksXG4gICAgcHJpdmF0ZSB3aGl0ZXM6IGFueVxuICApIHtcbiAgICBzdXBlcihjdHgsIHgsIHksIGtpKTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgc2l6ZSwga2ksIGJsYWNrcywgd2hpdGVzLCBtb2R9ID0gdGhpcztcbiAgICBpZiAoc2l6ZSA8PSAwKSByZXR1cm47XG4gICAgbGV0IGltZztcbiAgICBpZiAoa2kgPT09IDEpIHtcbiAgICAgIGltZyA9IGJsYWNrc1ttb2QgJSBibGFja3MubGVuZ3RoXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW1nID0gd2hpdGVzW21vZCAlIHdoaXRlcy5sZW5ndGhdO1xuICAgIH1cbiAgICBpZiAoaW1nKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKGltZywgeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtBbmFseXNpc1BvaW50VGhlbWUsIE1vdmVJbmZvLCBSb290SW5mb30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgY2FsY0FuYWx5c2lzUG9pbnRDb2xvcixcbiAgY2FsY1Njb3JlRGlmZixcbiAgY2FsY1Njb3JlRGlmZlRleHQsXG4gIG5Gb3JtYXR0ZXIsXG4gIHJvdW5kMyxcbn0gZnJvbSAnLi4vaGVscGVyJztcbmltcG9ydCB7XG4gIExJR0hUX0dSRUVOX1JHQixcbiAgTElHSFRfUkVEX1JHQixcbiAgTElHSFRfWUVMTE9XX1JHQixcbiAgWUVMTE9XX1JHQixcbn0gZnJvbSAnLi4vY29uc3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmFseXNpc1BvaW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBwcml2YXRlIHg6IG51bWJlcixcbiAgICBwcml2YXRlIHk6IG51bWJlcixcbiAgICBwcml2YXRlIHI6IG51bWJlcixcbiAgICBwcml2YXRlIHJvb3RJbmZvOiBSb290SW5mbyxcbiAgICBwcml2YXRlIG1vdmVJbmZvOiBNb3ZlSW5mbyxcbiAgICBwcml2YXRlIHRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWUgPSBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCxcbiAgICBwcml2YXRlIG91dGxpbmVDb2xvcj86IHN0cmluZ1xuICApIHt9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm8sIHRoZW1lfSA9IHRoaXM7XG4gICAgaWYgKHIgPCAwKSByZXR1cm47XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcbiAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDA7XG4gICAgY3R4LnNoYWRvd0NvbG9yID0gJyNmZmYnO1xuICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcblxuICAgIC8vIHRoaXMuZHJhd0RlZmF1bHRBbmFseXNpc1BvaW50KCk7XG4gICAgaWYgKHRoZW1lID09PSBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCkge1xuICAgICAgdGhpcy5kcmF3RGVmYXVsdEFuYWx5c2lzUG9pbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoZW1lID09PSBBbmFseXNpc1BvaW50VGhlbWUuUHJvYmxlbSkge1xuICAgICAgdGhpcy5kcmF3UHJvYmxlbUFuYWx5c2lzUG9pbnQoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3UHJvYmxlbUFuYWx5c2lzUG9pbnQgPSAoKSA9PiB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgciwgcm9vdEluZm8sIG1vdmVJbmZvLCBvdXRsaW5lQ29sb3J9ID0gdGhpcztcbiAgICBjb25zdCB7b3JkZXJ9ID0gbW92ZUluZm87XG5cbiAgICBsZXQgcENvbG9yID0gY2FsY0FuYWx5c2lzUG9pbnRDb2xvcihyb290SW5mbywgbW92ZUluZm8pO1xuXG4gICAgaWYgKG9yZGVyIDwgNSkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gMDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIHIgKiAwLjksIHgsIHksIHIpO1xuICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHBDb2xvcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45LCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwJyk7XG4gICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBjdHguZmlsbCgpO1xuICAgICAgaWYgKG91dGxpbmVDb2xvcikge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMoeCwgeSwgciwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgICBjdHgubGluZVdpZHRoID0gNDtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gb3V0bGluZUNvbG9yO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvbnRTaXplID0gciAvIDEuNTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggVGFob21hYDtcbiAgICAgIGNvbnN0IHNjb3JlVGV4dCA9IGNhbGNTY29yZURpZmZUZXh0KHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgICBjdHguZmlsbFRleHQoc2NvcmVUZXh0LCB4LCB5KTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHguZmlsbFRleHQobkZvcm1hdHRlcihtb3ZlSW5mby52aXNpdHMpLCB4LCB5ICsgciAvIDIgKyBmb250U2l6ZSAvIDgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXdDYW5kaWRhdGVQb2ludCgpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGRyYXdEZWZhdWx0QW5hbHlzaXNQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm99ID0gdGhpcztcbiAgICBjb25zdCB7b3JkZXJ9ID0gbW92ZUluZm87XG5cbiAgICBsZXQgcENvbG9yID0gY2FsY0FuYWx5c2lzUG9pbnRDb2xvcihyb290SW5mbywgbW92ZUluZm8pO1xuXG4gICAgaWYgKG9yZGVyIDwgNSkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gMDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIHIgKiAwLjksIHgsIHksIHIpO1xuICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHBDb2xvcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45LCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwJyk7XG4gICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBjdHguZmlsbCgpO1xuXG4gICAgICBjb25zdCBmb250U2l6ZSA9IHIgLyAxLjU7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemUgKiAwLjh9cHggVGFob21hYDtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICBjb25zdCB3aW5yYXRlID1cbiAgICAgICAgcm9vdEluZm8uY3VycmVudFBsYXllciA9PT0gJ0InXG4gICAgICAgICAgPyBtb3ZlSW5mby53aW5yYXRlXG4gICAgICAgICAgOiAxIC0gbW92ZUluZm8ud2lucmF0ZTtcblxuICAgICAgY3R4LmZpbGxUZXh0KHJvdW5kMyh3aW5yYXRlLCAxMDAsIDEpLCB4LCB5IC0gciAvIDIgKyBmb250U2l6ZSAvIDUpO1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplfXB4IFRhaG9tYWA7XG4gICAgICBjb25zdCBzY29yZVRleHQgPSBjYWxjU2NvcmVEaWZmVGV4dChyb290SW5mbywgbW92ZUluZm8pO1xuICAgICAgY3R4LmZpbGxUZXh0KHNjb3JlVGV4dCwgeCwgeSArIGZvbnRTaXplIC8gMyk7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemUgKiAwLjh9cHggVGFob21hYDtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgY3R4LmZpbGxUZXh0KG5Gb3JtYXR0ZXIobW92ZUluZm8udmlzaXRzKSwgeCwgeSArIHIgLyAyICsgZm9udFNpemUgLyAzKTtcblxuICAgICAgY29uc3Qgb3JkZXIgPSBtb3ZlSW5mby5vcmRlcjtcbiAgICAgIGN0eC5maWxsVGV4dCgob3JkZXIgKyAxKS50b1N0cmluZygpLCB4ICsgciwgeSAtIHIgLyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kcmF3Q2FuZGlkYXRlUG9pbnQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBkcmF3Q2FuZGlkYXRlUG9pbnQgPSAoKSA9PiB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgciwgcm9vdEluZm8sIG1vdmVJbmZvfSA9IHRoaXM7XG4gICAgY29uc3QgcENvbG9yID0gY2FsY0FuYWx5c2lzUG9pbnRDb2xvcihyb290SW5mbywgbW92ZUluZm8pO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKHgsIHksIHIgKiAwLjYsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICBjdHgubGluZVdpZHRoID0gMDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG4gICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuNCwgeCwgeSwgcik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHBDb2xvcik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuOTUsICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrdXAge1xuICBwcm90ZWN0ZWQgZ2xvYmFsQWxwaGEgPSAxO1xuICBwcm90ZWN0ZWQgY29sb3IgPSAnJztcbiAgcHJvdGVjdGVkIGxpbmVEYXNoOiBudW1iZXJbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBwcm90ZWN0ZWQgeDogbnVtYmVyLFxuICAgIHByb3RlY3RlZCB5OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHM6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQga2k6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgdmFsOiBzdHJpbmcgfCBudW1iZXIgPSAnJ1xuICApIHt9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zb2xlLmxvZygnVEJEJyk7XG4gIH1cblxuICBzZXRHbG9iYWxBbHBoYShhbHBoYTogbnVtYmVyKSB7XG4gICAgdGhpcy5nbG9iYWxBbHBoYSA9IGFscGhhO1xuICB9XG5cbiAgc2V0Q29sb3IoY29sb3I6IHN0cmluZykge1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgfVxuXG4gIHNldExpbmVEYXNoKGxpbmVEYXNoOiBudW1iZXJbXSkge1xuICAgIHRoaXMubGluZURhc2ggPSBsaW5lRGFzaDtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgQ2lyY2xlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGEsIGNvbG9yfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgY3R4LnNldExpbmVEYXNoKHRoaXMubGluZURhc2gpO1xuICAgIGlmIChraSA9PT0gMSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBpZiAoY29sb3IpIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIENyb3NzTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC41O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGlmIChraSA9PT0gMSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpemUgPSByYWRpdXMgKiAwLjU4O1xuICAgIH1cbiAgICBjdHgubW92ZVRvKHggLSBzaXplLCB5IC0gc2l6ZSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgc2l6ZSwgeSArIHNpemUpO1xuICAgIGN0eC5tb3ZlVG8oeCArIHNpemUsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggLSBzaXplLCB5ICsgc2l6ZSk7XG5cbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIFRleHRNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCB2YWwsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3Qgc2l6ZSA9IHMgKiAwLjg7XG4gICAgbGV0IGZvbnRTaXplID0gc2l6ZSAvIDEuNTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuXG4gICAgaWYgKGtpID09PSAxKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICAgIH1cbiAgICAvLyBlbHNlIHtcbiAgICAvLyAgIGN0eC5jbGVhclJlY3QoeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIC8vIH1cbiAgICBpZiAodmFsLnRvU3RyaW5nKCkubGVuZ3RoID09PSAxKSB7XG4gICAgICBmb250U2l6ZSA9IHNpemUgLyAxLjU7XG4gICAgfSBlbHNlIGlmICh2YWwudG9TdHJpbmcoKS5sZW5ndGggPT09IDIpIHtcbiAgICAgIGZvbnRTaXplID0gc2l6ZSAvIDEuODtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9udFNpemUgPSBzaXplIC8gMi4wO1xuICAgIH1cbiAgICBjdHguZm9udCA9IGBib2xkICR7Zm9udFNpemV9cHggVGFob21hYDtcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgIGN0eC5maWxsVGV4dCh2YWwudG9TdHJpbmcoKSwgeCwgeSArIDIpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIFNxdWFyZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgbGV0IHNpemUgPSBzICogMC41NTtcbiAgICBpZiAoa2kgPT09IDEpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjZmZmJztcbiAgICB9IGVsc2UgaWYgKGtpID09PSAtMSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMwMDAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgICBjdHgubGluZVdpZHRoID0gMztcbiAgICB9XG4gICAgY3R4LnJlY3QoeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBUcmlhbmdsZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNzU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4Lm1vdmVUbyh4LCB5IC0gc2l6ZSk7XG4gICAgY3R4LmxpbmVUbyh4IC0gc2l6ZSAqIE1hdGguY29zKDAuNTIzKSwgeSArIHNpemUgKiBNYXRoLnNpbigwLjUyMykpO1xuICAgIGN0eC5saW5lVG8oeCArIHNpemUgKiBNYXRoLmNvcygwLjUyMyksIHkgKyBzaXplICogTWF0aC5zaW4oMC41MjMpKTtcblxuICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgIGlmIChraSA9PT0gMSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgICAgc2l6ZSA9IHJhZGl1cyAqIDAuNztcbiAgICB9XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBOb2RlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgY29sb3IsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNDtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gNDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgQWN0aXZlTm9kZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGNvbG9yLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5zZXRMaW5lRGFzaCh0aGlzLmxpbmVEYXNoKTtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplICogMC40LCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBDaXJjbGVTb2xpZE1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhLCBjb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjI1O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC42NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKGtpID09PSAxKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHgubGluZVdpZHRoID0gMztcbiAgICB9XG4gICAgaWYgKGNvbG9yKSBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodE1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMC42O1xuICAgIGxldCBzaXplID0gcyAqIDAuNDtcbiAgICBjdHguZmlsbFN0eWxlID0gJyNmZmViNjQnO1xuICAgIGlmIChraSA9PT0gMSB8fCBraSA9PT0gLTEpIHtcbiAgICAgIHNpemUgPSBzICogMC4zNTtcbiAgICB9XG4gICAgY3R4LmFyYyh4LCB5LCBzaXplLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBFZmZlY3RCYXNlIHtcbiAgcHJvdGVjdGVkIGdsb2JhbEFscGhhID0gMTtcbiAgcHJvdGVjdGVkIGNvbG9yID0gJyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgc2l6ZTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge31cblxuICBwbGF5KCkge1xuICAgIGNvbnNvbGUubG9nKCdUQkQnKTtcbiAgfVxufVxuIiwiaW1wb3J0IEVmZmVjdEJhc2UgZnJvbSAnLi9FZmZlY3RCYXNlJztcbmltcG9ydCB7ZW5jb2RlfSBmcm9tICdqcy1iYXNlNjQnO1xuXG5jb25zdCBiYW5TdmcgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIGNsYXNzPVwiYmkgYmktYmFuXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPlxuICA8cGF0aCBkPVwiTTE1IDhhNi45NyA2Ljk3IDAgMCAwLTEuNzEtNC41ODRsLTkuODc0IDkuODc1QTcgNyAwIDAgMCAxNSA4TTIuNzEgMTIuNTg0bDkuODc0LTkuODc1YTcgNyAwIDAgMC05Ljg3NCA5Ljg3NFpNMTYgOEE4IDggMCAxIDEgMCA4YTggOCAwIDAgMSAxNiAwXCIvPlxuPC9zdmc+YDtcblxuZXhwb3J0IGNsYXNzIEJhbkVmZmVjdCBleHRlbmRzIEVmZmVjdEJhc2Uge1xuICBwcml2YXRlIGltZyA9IG5ldyBJbWFnZSgpO1xuICBwcml2YXRlIGFscGhhID0gMDtcbiAgcHJpdmF0ZSBmYWRlSW5EdXJhdGlvbiA9IDIwMDtcbiAgcHJpdmF0ZSBmYWRlT3V0RHVyYXRpb24gPSAxNTA7XG4gIHByaXZhdGUgc3RheUR1cmF0aW9uID0gNDAwO1xuICBwcml2YXRlIHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIHByaXZhdGUgaXNGYWRpbmdPdXQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcHJvdGVjdGVkIHg6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgeTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBzaXplOiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIGtpOiBudW1iZXJcbiAgKSB7XG4gICAgc3VwZXIoY3R4LCB4LCB5LCBzaXplLCBraSk7XG5cbiAgICAvLyBDb252ZXJ0IFNWRyBzdHJpbmcgdG8gYSBkYXRhIFVSTFxuICAgIGNvbnN0IHN2Z0Jsb2IgPSBuZXcgQmxvYihbYmFuU3ZnXSwge3R5cGU6ICdpbWFnZS9zdmcreG1sJ30pO1xuXG4gICAgY29uc3Qgc3ZnRGF0YVVybCA9IGBkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCR7ZW5jb2RlKGJhblN2Zyl9YDtcblxuICAgIHRoaXMuaW1nID0gbmV3IEltYWdlKCk7XG4gICAgdGhpcy5pbWcuc3JjID0gc3ZnRGF0YVVybDtcbiAgfVxuXG4gIHBsYXkgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmltZy5jb21wbGV0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtjdHgsIHgsIHksIHNpemUsIGltZywgZmFkZUluRHVyYXRpb24sIGZhZGVPdXREdXJhdGlvbn0gPSB0aGlzO1xuXG4gICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBpZiAoIXRoaXMuc3RhcnRUaW1lKSB7XG4gICAgICB0aGlzLnN0YXJ0VGltZSA9IG5vdztcbiAgICB9XG5cbiAgICBjdHguY2xlYXJSZWN0KHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSB0aGlzLmFscGhhO1xuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCB4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcblxuICAgIGNvbnN0IGVsYXBzZWQgPSBub3cgLSB0aGlzLnN0YXJ0VGltZTtcblxuICAgIGlmICghdGhpcy5pc0ZhZGluZ091dCkge1xuICAgICAgdGhpcy5hbHBoYSA9IE1hdGgubWluKGVsYXBzZWQgLyBmYWRlSW5EdXJhdGlvbiwgMSk7XG4gICAgICBpZiAoZWxhcHNlZCA+PSBmYWRlSW5EdXJhdGlvbikge1xuICAgICAgICB0aGlzLmFscGhhID0gMTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pc0ZhZGluZ091dCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfSwgdGhpcy5zdGF5RHVyYXRpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmYWRlRWxhcHNlZCA9IG5vdyAtIHRoaXMuc3RhcnRUaW1lO1xuICAgICAgdGhpcy5hbHBoYSA9IE1hdGgubWF4KDEgLSBmYWRlRWxhcHNlZCAvIGZhZGVPdXREdXJhdGlvbiwgMCk7XG4gICAgICBpZiAoZmFkZUVsYXBzZWQgPj0gZmFkZU91dER1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMuYWxwaGEgPSAwO1xuICAgICAgICBjdHguY2xlYXJSZWN0KHggLSBzaXplIC8gMiwgeSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnBsYXkpO1xuICB9O1xufVxuIiwiaW1wb3J0IHtjb21wYWN0fSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgY2FsY1Zpc2libGVBcmVhLFxuICByZXZlcnNlT2Zmc2V0LFxuICB6ZXJvcyxcbiAgZW1wdHksXG4gIGExVG9Qb3MsXG4gIG9mZnNldEExTW92ZSxcbn0gZnJvbSAnLi9oZWxwZXInO1xuaW1wb3J0IHtcbiAgQTFfTEVUVEVSUyxcbiAgQTFfTlVNQkVSUyxcbiAgREVGQVVMVF9PUFRJT05TLFxuICBNQVhfQk9BUkRfU0laRSxcbiAgVEhFTUVfUkVTT1VSQ0VTLFxufSBmcm9tICcuL2NvbnN0JztcbmltcG9ydCB7XG4gIEN1cnNvcixcbiAgTWFya3VwLFxuICBUaGVtZSxcbiAgS2ksXG4gIEFuYWx5c2lzLFxuICBHaG9zdEJhbk9wdGlvbnMsXG4gIEdob3N0QmFuT3B0aW9uc1BhcmFtcyxcbiAgQ2VudGVyLFxuICBBbmFseXNpc1BvaW50VGhlbWUsXG4gIEVmZmVjdCxcbn0gZnJvbSAnLi90eXBlcyc7XG5cbmltcG9ydCB7SW1hZ2VTdG9uZSwgQ29sb3JTdG9uZX0gZnJvbSAnLi9zdG9uZXMnO1xuaW1wb3J0IEFuYWx5c2lzUG9pbnQgZnJvbSAnLi9zdG9uZXMvQW5hbHlzaXNQb2ludCc7XG4vLyBpbXBvcnQge2NyZWF0ZSwgbWVhbkRlcGVuZGVuY2llcywgc3RkRGVwZW5kZW5jaWVzfSBmcm9tICdtYXRoanMnO1xuXG4vLyBjb25zdCBjb25maWcgPSB7fTtcbi8vIGNvbnN0IHtzdGQsIG1lYW59ID0gY3JlYXRlKHttZWFuRGVwZW5kZW5jaWVzLCBzdGREZXBlbmRlbmNpZXN9LCBjb25maWcpO1xuXG5pbXBvcnQge1xuICBDaXJjbGVNYXJrdXAsXG4gIENyb3NzTWFya3VwLFxuICBUZXh0TWFya3VwLFxuICBTcXVhcmVNYXJrdXAsXG4gIFRyaWFuZ2xlTWFya3VwLFxuICBOb2RlTWFya3VwLFxuICBBY3RpdmVOb2RlTWFya3VwLFxuICBDaXJjbGVTb2xpZE1hcmt1cCxcbiAgSGlnaGxpZ2h0TWFya3VwLFxufSBmcm9tICcuL21hcmt1cHMnO1xuaW1wb3J0IHtCYW5FZmZlY3R9IGZyb20gJy4vZWZmZWN0cyc7XG5cbmNvbnN0IGltYWdlczoge1xuICBba2V5OiBzdHJpbmddOiBIVE1MSW1hZ2VFbGVtZW50O1xufSA9IHt9O1xuXG5mdW5jdGlvbiBpc01vYmlsZURldmljZSgpIHtcbiAgcmV0dXJuIC9Nb2JpfEFuZHJvaWR8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KFxuICAgIG5hdmlnYXRvci51c2VyQWdlbnRcbiAgKTtcbn1cblxuZnVuY3Rpb24gcHJlbG9hZCh1cmxzOiBzdHJpbmdbXSwgZG9uZTogKCkgPT4gdm9pZCkge1xuICBsZXQgbG9hZGVkID0gMDtcbiAgY29uc3QgaW1hZ2VMb2FkZWQgPSAoKSA9PiB7XG4gICAgbG9hZGVkKys7XG4gICAgaWYgKGxvYWRlZCA9PT0gdXJscy5sZW5ndGgpIHtcbiAgICAgIGRvbmUoKTtcbiAgICB9XG4gIH07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdXJscy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghaW1hZ2VzW3VybHNbaV1dKSB7XG4gICAgICBpbWFnZXNbdXJsc1tpXV0gPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltYWdlc1t1cmxzW2ldXS5zcmMgPSB1cmxzW2ldO1xuICAgICAgaW1hZ2VzW3VybHNbaV1dLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW1hZ2VMb2FkZWQoKTtcbiAgICAgIH07XG4gICAgICBpbWFnZXNbdXJsc1tpXV0ub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW1hZ2VMb2FkZWQoKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59XG5cbmxldCBkcHIgPSAxLjA7XG4vLyBicm93c2VyIGNvZGVcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLjA7XG59XG5cbmV4cG9ydCBjbGFzcyBHaG9zdEJhbiB7XG4gIGRlZmF1bHRPcHRpb25zOiBHaG9zdEJhbk9wdGlvbnMgPSB7XG4gICAgYm9hcmRTaXplOiAxOSxcbiAgICBkeW5hbWljUGFkZGluZzogZmFsc2UsXG4gICAgcGFkZGluZzogMTAsXG4gICAgZXh0ZW50OiAzLFxuICAgIGludGVyYWN0aXZlOiBmYWxzZSxcbiAgICBjb29yZGluYXRlOiB0cnVlLFxuICAgIHRoZW1lOiBUaGVtZS5CbGFja0FuZFdoaXRlLFxuICAgIGFuYWx5c2lzUG9pbnRUaGVtZTogQW5hbHlzaXNQb2ludFRoZW1lLkRlZmF1bHQsXG4gICAgYmFja2dyb3VuZDogZmFsc2UsXG4gICAgc2hvd0FuYWx5c2lzOiBmYWxzZSxcbiAgICBhZGFwdGl2ZUJvYXJkTGluZTogdHJ1ZSxcbiAgICBib2FyZEVkZ2VMaW5lV2lkdGg6IDUsXG4gICAgYm9hcmRMaW5lV2lkdGg6IDEsXG4gICAgYm9hcmRMaW5lRXh0ZW50OiAwLjUsXG4gICAgdGhlbWVGbGF0Qm9hcmRDb2xvcjogJyNFQ0I1NUEnLFxuICAgIHBvc2l0aXZlTm9kZUNvbG9yOiAnIzRkN2MwZicsXG4gICAgbmVnYXRpdmVOb2RlQ29sb3I6ICcjYjkxYzFjJyxcbiAgICBuZXV0cmFsTm9kZUNvbG9yOiAnI2ExNjIwNycsXG4gICAgZGVmYXVsdE5vZGVDb2xvcjogJyM0MDQwNDAnLFxuICAgIHdhcm5pbmdOb2RlQ29sb3I6ICcjZmZkZjIwJyxcbiAgICB0aGVtZVJlc291cmNlczogVEhFTUVfUkVTT1VSQ0VTLFxuICAgIG1vdmVTb3VuZDogZmFsc2UsXG4gICAgYWRhcHRpdmVTdGFyU2l6ZTogdHJ1ZSxcbiAgICBzdGFyU2l6ZTogMyxcbiAgICBtb2JpbGVJbmRpY2F0b3JPZmZzZXQ6IDAsXG4gIH07XG4gIG9wdGlvbnM6IEdob3N0QmFuT3B0aW9ucztcbiAgZG9tOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcbiAgY2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGJvYXJkPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGFuYWx5c2lzQ2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGN1cnNvckNhbnZhcz86IEhUTUxDYW52YXNFbGVtZW50O1xuICBtYXJrdXBDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgZWZmZWN0Q2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIG1vdmVTb3VuZEF1ZGlvPzogSFRNTEF1ZGlvRWxlbWVudDtcbiAgdHVybjogS2k7XG4gIHByaXZhdGUgY3Vyc29yOiBDdXJzb3IgPSBDdXJzb3IuTm9uZTtcbiAgcHJpdmF0ZSBjdXJzb3JWYWx1ZTogc3RyaW5nID0gJyc7XG4gIHByaXZhdGUgdG91Y2hNb3ZpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSB0b3VjaFN0YXJ0UG9pbnQ6IERPTVBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gIHB1YmxpYyBjdXJzb3JQb3NpdGlvbjogW251bWJlciwgbnVtYmVyXTtcbiAgcHVibGljIGFjdHVhbEN1cnNvclBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdO1xuICBwdWJsaWMgY3Vyc29yUG9pbnQ6IERPTVBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gIHB1YmxpYyBhY3R1YWxDdXJzb3JQb2ludDogRE9NUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgcHVibGljIG1hdDogbnVtYmVyW11bXTtcbiAgcHVibGljIG1hcmt1cDogc3RyaW5nW11bXTtcbiAgcHVibGljIHZpc2libGVBcmVhTWF0OiBudW1iZXJbXVtdIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgcHJldmVudE1vdmVNYXQ6IG51bWJlcltdW107XG4gIHB1YmxpYyBlZmZlY3RNYXQ6IHN0cmluZ1tdW107XG4gIG1heGh2OiBudW1iZXI7XG4gIHRyYW5zTWF0OiBET01NYXRyaXg7XG4gIGFuYWx5c2lzOiBBbmFseXNpcyB8IG51bGw7XG4gIHZpc2libGVBcmVhOiBudW1iZXJbXVtdO1xuICBub2RlTWFya3VwU3R5bGVzOiB7XG4gICAgW2tleTogc3RyaW5nXToge1xuICAgICAgY29sb3I6IHN0cmluZztcbiAgICAgIGxpbmVEYXNoOiBudW1iZXJbXTtcbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEdob3N0QmFuT3B0aW9uc1BhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLi4udGhpcy5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcbiAgICBjb25zdCBzaXplID0gdGhpcy5vcHRpb25zLmJvYXJkU2l6ZTtcbiAgICB0aGlzLm1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy5wcmV2ZW50TW92ZU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy5tYXJrdXAgPSBlbXB0eShbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMuZWZmZWN0TWF0ID0gZW1wdHkoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLnR1cm4gPSBLaS5CbGFjaztcbiAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gWy0xLCAtMV07XG4gICAgdGhpcy5hY3R1YWxDdXJzb3JQb3NpdGlvbiA9IFstMSwgLTFdO1xuICAgIHRoaXMubWF4aHYgPSBzaXplO1xuICAgIHRoaXMudHJhbnNNYXQgPSBuZXcgRE9NTWF0cml4KCk7XG4gICAgdGhpcy5hbmFseXNpcyA9IG51bGw7XG4gICAgdGhpcy52aXNpYmxlQXJlYSA9IFtcbiAgICAgIFswLCBzaXplIC0gMV0sXG4gICAgICBbMCwgc2l6ZSAtIDFdLFxuICAgIF07XG5cbiAgICBjb25zdCBkZWZhdWx0RGFzaGVkTGluZURhc2ggPSBbOCwgNl07XG4gICAgY29uc3QgZGVmYXVsdERvdHRlZExpbmVEYXNoID0gWzQsIDRdO1xuXG4gICAgdGhpcy5ub2RlTWFya3VwU3R5bGVzID0ge1xuICAgICAgW01hcmt1cC5Qb3NpdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMucG9zaXRpdmVOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5uZWdhdGl2ZU5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMubmV1dHJhbE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ05vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMud2FybmluZ05vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVEYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLnBvc2l0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVEYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLm5lZ2F0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbERhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMubmV1dHJhbE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHREYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nRGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy53YXJuaW5nTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVEb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLnBvc2l0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVEb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLm5lZ2F0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbERvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMubmV1dHJhbE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHREb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nRG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy53YXJuaW5nTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLnBvc2l0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZUFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMubmVnYXRpdmVOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLm5ldXRyYWxOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLndhcm5pbmdOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlRGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5wb3NpdGl2ZU5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlRGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5uZWdhdGl2ZU5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxEYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLm5ldXRyYWxOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0RGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5kZWZhdWx0Tm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0Rhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMud2FybmluZ05vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLlBvc2l0aXZlRG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5wb3NpdGl2ZU5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlRG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5uZWdhdGl2ZU5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5ldXRyYWxEb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLm5ldXRyYWxOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0RG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5kZWZhdWx0Tm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0RvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMud2FybmluZ05vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHNldFR1cm4odHVybjogS2kpIHtcbiAgICB0aGlzLnR1cm4gPSB0dXJuO1xuICB9XG5cbiAgc2V0Qm9hcmRTaXplKHNpemU6IG51bWJlcikge1xuICAgIHRoaXMub3B0aW9ucy5ib2FyZFNpemUgPSBNYXRoLm1pbihzaXplLCBNQVhfQk9BUkRfU0laRSk7XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuY2FudmFzIHx8XG4gICAgICAhdGhpcy5jdXJzb3JDYW52YXMgfHxcbiAgICAgICF0aGlzLmRvbSB8fFxuICAgICAgIXRoaXMuYm9hcmQgfHxcbiAgICAgICF0aGlzLm1hcmt1cENhbnZhcyB8fFxuICAgICAgIXRoaXMuYW5hbHlzaXNDYW52YXMgfHxcbiAgICAgICF0aGlzLmVmZmVjdENhbnZhc1xuICAgIClcbiAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGNhbnZhc2VzID0gW1xuICAgICAgdGhpcy5ib2FyZCxcbiAgICAgIHRoaXMuY2FudmFzLFxuICAgICAgdGhpcy5tYXJrdXBDYW52YXMsXG4gICAgICB0aGlzLmN1cnNvckNhbnZhcyxcbiAgICAgIHRoaXMuYW5hbHlzaXNDYW52YXMsXG4gICAgICB0aGlzLmVmZmVjdENhbnZhcyxcbiAgICBdO1xuXG4gICAgY29uc3Qge3NpemV9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHtjbGllbnRXaWR0aH0gPSB0aGlzLmRvbTtcblxuICAgIGNhbnZhc2VzLmZvckVhY2goY2FudmFzID0+IHtcbiAgICAgIGlmIChzaXplKSB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHNpemUgKiBkcHI7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBzaXplICogZHByO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMud2lkdGggPSBNYXRoLmZsb29yKGNsaWVudFdpZHRoICogZHByKTtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ2FudmFzKGlkOiBzdHJpbmcsIHBvaW50ZXJFdmVudHMgPSB0cnVlKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgY2FudmFzLmlkID0gaWQ7XG4gICAgaWYgKCFwb2ludGVyRXZlbnRzKSB7XG4gICAgICBjYW52YXMuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICB9XG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxuXG4gIGluaXQoZG9tOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplO1xuICAgIHRoaXMubWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLm1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcblxuICAgIHRoaXMuYm9hcmQgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tYm9hcmQnKTtcbiAgICB0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1jYW52YXMnKTtcbiAgICB0aGlzLm1hcmt1cENhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1tYXJrdXAnLCBmYWxzZSk7XG4gICAgdGhpcy5jdXJzb3JDYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tY3Vyc29yJyk7XG4gICAgdGhpcy5hbmFseXNpc0NhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1hbmFseXNpcycsIGZhbHNlKTtcbiAgICB0aGlzLmVmZmVjdENhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1lZmZlY3QnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmRvbSA9IGRvbTtcbiAgICBkb20uaW5uZXJIVE1MID0gJyc7IC8vIENsZWFyIGV4aXN0aW5nIGNoaWxkcmVuXG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuYm9hcmQpO1xuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMubWFya3VwQ2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5hbmFseXNpc0NhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuY3Vyc29yQ2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5lZmZlY3RDYW52YXMpO1xuXG4gICAgdGhpcy5yZXNpemUoKTtcbiAgICB0aGlzLnJlbmRlckludGVyYWN0aXZlKCk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXRPcHRpb25zKG9wdGlvbnM6IEdob3N0QmFuT3B0aW9uc1BhcmFtcykge1xuICAgIHRoaXMub3B0aW9ucyA9IHsuLi50aGlzLm9wdGlvbnMsIC4uLm9wdGlvbnN9O1xuICAgIC8vIFRoZSBvbk1vdXNlTW92ZSBldmVudCBuZWVkcyB0byBiZSByZS1hZGRlZCBhZnRlciB0aGUgb3B0aW9ucyBhcmUgdXBkYXRlZFxuICAgIHRoaXMucmVuZGVySW50ZXJhY3RpdmUoKTtcbiAgfVxuXG4gIHNldE1hdChtYXQ6IG51bWJlcltdW10pIHtcbiAgICB0aGlzLm1hdCA9IG1hdDtcbiAgICBpZiAoIXRoaXMudmlzaWJsZUFyZWFNYXQpIHtcbiAgICAgIHRoaXMudmlzaWJsZUFyZWFNYXQgPSBtYXQ7XG4gICAgfVxuICB9XG5cbiAgc2V0VmlzaWJsZUFyZWFNYXQobWF0OiBudW1iZXJbXVtdKSB7XG4gICAgdGhpcy52aXNpYmxlQXJlYU1hdCA9IG1hdDtcbiAgfVxuXG4gIHNldFByZXZlbnRNb3ZlTWF0KG1hdDogbnVtYmVyW11bXSkge1xuICAgIHRoaXMucHJldmVudE1vdmVNYXQgPSBtYXQ7XG4gIH1cblxuICBzZXRFZmZlY3RNYXQobWF0OiBzdHJpbmdbXVtdKSB7XG4gICAgdGhpcy5lZmZlY3RNYXQgPSBtYXQ7XG4gIH1cblxuICBzZXRNYXJrdXAobWFya3VwOiBzdHJpbmdbXVtdKSB7XG4gICAgdGhpcy5tYXJrdXAgPSBtYXJrdXA7XG4gIH1cblxuICBzZXRDdXJzb3IoY3Vyc29yOiBDdXJzb3IsIHZhbHVlID0gJycpIHtcbiAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgICB0aGlzLmN1cnNvclZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBzZXRDdXJzb3JXaXRoUmVuZGVyID0gKGRvbVBvaW50OiBET01Qb2ludCwgb2Zmc2V0WSA9IDApID0+IHtcbiAgICAvLyBzcGFjZSBuZWVkIHJlY2FsY3VsYXRlIGV2ZXJ5IHRpbWVcbiAgICBjb25zdCB7cGFkZGluZ30gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qge3NwYWNlfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgIGNvbnN0IHBvaW50ID0gdGhpcy50cmFuc01hdC5pbnZlcnNlKCkudHJhbnNmb3JtUG9pbnQoZG9tUG9pbnQpO1xuICAgIGNvbnN0IGlkeCA9IE1hdGgucm91bmQoKHBvaW50LnggLSBwYWRkaW5nICsgc3BhY2UgLyAyKSAvIHNwYWNlKTtcbiAgICBjb25zdCBpZHkgPSBNYXRoLnJvdW5kKChwb2ludC55IC0gcGFkZGluZyArIHNwYWNlIC8gMikgLyBzcGFjZSkgKyBvZmZzZXRZO1xuICAgIGNvbnN0IHh4ID0gaWR4ICogc3BhY2U7XG4gICAgY29uc3QgeXkgPSBpZHkgKiBzcGFjZTtcbiAgICBjb25zdCBwb2ludE9uQ2FudmFzID0gbmV3IERPTVBvaW50KHh4LCB5eSk7XG4gICAgY29uc3QgcCA9IHRoaXMudHJhbnNNYXQudHJhbnNmb3JtUG9pbnQocG9pbnRPbkNhbnZhcyk7XG4gICAgdGhpcy5hY3R1YWxDdXJzb3JQb2ludCA9IHA7XG4gICAgdGhpcy5hY3R1YWxDdXJzb3JQb3NpdGlvbiA9IFtpZHggLSAxLCBpZHkgLSAxXTtcblxuICAgIGlmICh0aGlzLnByZXZlbnRNb3ZlTWF0Py5baWR4IC0gMV0/LltpZHkgLSAxXSA9PT0gMSkge1xuICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IFstMSwgLTFdO1xuICAgICAgdGhpcy5jdXJzb3JQb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICAgICAgdGhpcy5kcmF3Q3Vyc29yKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaWYgKFxuICAgIC8vICAgIWlzTW9iaWxlRGV2aWNlKCkgfHxcbiAgICAvLyAgIChpc01vYmlsZURldmljZSgpICYmIHRoaXMubWF0Py5baWR4IC0gMV0/LltpZHkgLSAxXSA9PT0gMClcbiAgICAvLyApIHtcbiAgICAvLyB9XG4gICAgdGhpcy5jdXJzb3JQb2ludCA9IHA7XG4gICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IFtpZHggLSAxLCBpZHkgLSAxXTtcbiAgICB0aGlzLmRyYXdDdXJzb3IoKTtcblxuICAgIGlmIChpc01vYmlsZURldmljZSgpKSB0aGlzLmRyYXdCb2FyZCgpO1xuICB9O1xuXG4gIHByaXZhdGUgb25Nb3VzZU1vdmUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgcG9pbnQgPSBuZXcgRE9NUG9pbnQoZS5vZmZzZXRYICogZHByLCBlLm9mZnNldFkgKiBkcHIpO1xuICAgIHRoaXMuc2V0Q3Vyc29yV2l0aFJlbmRlcihwb2ludCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBjYWxjVG91Y2hQb2ludCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgbGV0IHBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybiBwb2ludDtcbiAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRvdWNoZXMgPSBlLmNoYW5nZWRUb3VjaGVzO1xuICAgIHBvaW50ID0gbmV3IERPTVBvaW50KFxuICAgICAgKHRvdWNoZXNbMF0uY2xpZW50WCAtIHJlY3QubGVmdCkgKiBkcHIsXG4gICAgICAodG91Y2hlc1swXS5jbGllbnRZIC0gcmVjdC50b3ApICogZHByXG4gICAgKTtcbiAgICByZXR1cm4gcG9pbnQ7XG4gIH07XG5cbiAgcHJpdmF0ZSBvblRvdWNoU3RhcnQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy50b3VjaE1vdmluZyA9IHRydWU7XG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLmNhbGNUb3VjaFBvaW50KGUpO1xuICAgIHRoaXMudG91Y2hTdGFydFBvaW50ID0gcG9pbnQ7XG4gICAgdGhpcy5zZXRDdXJzb3JXaXRoUmVuZGVyKHBvaW50KTtcbiAgfTtcblxuICBwcml2YXRlIG9uVG91Y2hNb3ZlID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudG91Y2hNb3ZpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHBvaW50ID0gdGhpcy5jYWxjVG91Y2hQb2ludChlKTtcbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBsZXQgZGlzdGFuY2UgPSAxMDtcbiAgICBpZiAoXG4gICAgICBNYXRoLmFicyhwb2ludC54IC0gdGhpcy50b3VjaFN0YXJ0UG9pbnQueCkgPiBkaXN0YW5jZSB8fFxuICAgICAgTWF0aC5hYnMocG9pbnQueSAtIHRoaXMudG91Y2hTdGFydFBvaW50LnkpID4gZGlzdGFuY2VcbiAgICApIHtcbiAgICAgIG9mZnNldCA9IHRoaXMub3B0aW9ucy5tb2JpbGVJbmRpY2F0b3JPZmZzZXQ7XG4gICAgfVxuICAgIHRoaXMuc2V0Q3Vyc29yV2l0aFJlbmRlcihwb2ludCwgb2Zmc2V0KTtcbiAgfTtcblxuICBwcml2YXRlIG9uVG91Y2hFbmQgPSAoKSA9PiB7XG4gICAgdGhpcy50b3VjaE1vdmluZyA9IGZhbHNlO1xuICB9O1xuXG4gIHJlbmRlckludGVyYWN0aXZlKCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG5cbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kKTtcbiAgICB9XG4gIH1cblxuICBzZXRBbmFseXNpcyhhbmFseXNpczogQW5hbHlzaXMgfCBudWxsKSB7XG4gICAgdGhpcy5hbmFseXNpcyA9IGFuYWx5c2lzO1xuICAgIGlmICghYW5hbHlzaXMpIHtcbiAgICAgIHRoaXMuY2xlYXJBbmFseXNpc0NhbnZhcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dBbmFseXNpcykgdGhpcy5kcmF3QW5hbHlzaXMoYW5hbHlzaXMpO1xuICB9XG5cbiAgc2V0VGhlbWUodGhlbWU6IFRoZW1lLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7dGhlbWVSZXNvdXJjZXN9ID0gdGhpcy5vcHRpb25zO1xuICAgIGlmICghdGhlbWVSZXNvdXJjZXNbdGhlbWVdKSByZXR1cm47XG4gICAgY29uc3Qge2JvYXJkLCBibGFja3MsIHdoaXRlc30gPSB0aGVtZVJlc291cmNlc1t0aGVtZV07XG4gICAgdGhpcy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgdGhlbWUsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG4gICAgcHJlbG9hZChjb21wYWN0KFtib2FyZCwgLi4uYmxhY2tzLCAuLi53aGl0ZXNdKSwgKCkgPT4ge1xuICAgICAgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSk7XG4gICAgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgY2FsY0NlbnRlciA9ICgpOiBDZW50ZXIgPT4ge1xuICAgIGNvbnN0IHt2aXNpYmxlQXJlYX0gPSB0aGlzO1xuICAgIGNvbnN0IHtib2FyZFNpemV9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKFxuICAgICAgKHZpc2libGVBcmVhWzBdWzBdID09PSAwICYmIHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgKHZpc2libGVBcmVhWzFdWzBdID09PSAwICYmIHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKVxuICAgICkge1xuICAgICAgcmV0dXJuIENlbnRlci5DZW50ZXI7XG4gICAgfVxuXG4gICAgaWYgKHZpc2libGVBcmVhWzBdWzBdID09PSAwKSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wTGVmdDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbUxlZnQ7XG4gICAgICBlbHNlIHJldHVybiBDZW50ZXIuTGVmdDtcbiAgICB9IGVsc2UgaWYgKHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxKSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wUmlnaHQ7XG4gICAgICBlbHNlIGlmICh2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSkgcmV0dXJuIENlbnRlci5Cb3R0b21SaWdodDtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5SaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZpc2libGVBcmVhWzFdWzBdID09PSAwKSByZXR1cm4gQ2VudGVyLlRvcDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbTtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5DZW50ZXI7XG4gICAgfVxuICB9O1xuXG4gIGNhbGNEeW5hbWljUGFkZGluZyh2aXNpYmxlQXJlYVNpemU6IG51bWJlcikge1xuICAgIGNvbnN0IHtjb29yZGluYXRlfSA9IHRoaXMub3B0aW9ucztcbiAgICAvLyBsZXQgcGFkZGluZyA9IDMwO1xuICAgIC8vIGlmICh2aXNpYmxlQXJlYVNpemUgPD0gMykge1xuICAgIC8vICAgcGFkZGluZyA9IGNvb3JkaW5hdGUgPyAxMjAgOiAxMDA7XG4gICAgLy8gfSBlbHNlIGlmICh2aXNpYmxlQXJlYVNpemUgPD0gNikge1xuICAgIC8vICAgcGFkZGluZyA9IGNvb3JkaW5hdGUgPyA4MCA6IDYwO1xuICAgIC8vIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFTaXplIDw9IDkpIHtcbiAgICAvLyAgIHBhZGRpbmcgPSBjb29yZGluYXRlID8gNjAgOiA1MDtcbiAgICAvLyB9IGVsc2UgaWYgKHZpc2libGVBcmVhU2l6ZSA8PSAxMikge1xuICAgIC8vICAgcGFkZGluZyA9IGNvb3JkaW5hdGUgPyA1MCA6IDQwO1xuICAgIC8vIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFTaXplIDw9IDE1KSB7XG4gICAgLy8gICBwYWRkaW5nID0gY29vcmRpbmF0ZSA/IDQwIDogMzA7XG4gICAgLy8gfSBlbHNlIGlmICh2aXNpYmxlQXJlYVNpemUgPD0gMTcpIHtcbiAgICAvLyAgIHBhZGRpbmcgPSBjb29yZGluYXRlID8gMzUgOiAyNTtcbiAgICAvLyB9IGVsc2UgaWYgKHZpc2libGVBcmVhU2l6ZSA8PSAxOSkge1xuICAgIC8vICAgcGFkZGluZyA9IGNvb3JkaW5hdGUgPyAzMCA6IDIwO1xuICAgIC8vIH1cblxuICAgIGNvbnN0IHtjYW52YXN9ID0gdGhpcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IHBhZGRpbmcgPSBjYW52YXMud2lkdGggLyAodmlzaWJsZUFyZWFTaXplICsgMikgLyAyO1xuICAgIGNvbnN0IHBhZGRpbmdXaXRob3V0Q29vcmRpbmF0ZSA9IGNhbnZhcy53aWR0aCAvICh2aXNpYmxlQXJlYVNpemUgKyAyKSAvIDQ7XG5cbiAgICB0aGlzLm9wdGlvbnMucGFkZGluZyA9IGNvb3JkaW5hdGUgPyBwYWRkaW5nIDogcGFkZGluZ1dpdGhvdXRDb29yZGluYXRlO1xuICAgIC8vIHRoaXMucmVuZGVySW50ZXJhY3RpdmUoKTtcbiAgfVxuXG4gIHpvb21Cb2FyZCh6b29tID0gZmFsc2UpIHtcbiAgICBjb25zdCB7XG4gICAgICBjYW52YXMsXG4gICAgICBhbmFseXNpc0NhbnZhcyxcbiAgICAgIGJvYXJkLFxuICAgICAgY3Vyc29yQ2FudmFzLFxuICAgICAgbWFya3VwQ2FudmFzLFxuICAgICAgZWZmZWN0Q2FudmFzLFxuICAgIH0gPSB0aGlzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3Qge2JvYXJkU2l6ZSwgZXh0ZW50LCBib2FyZExpbmVFeHRlbnQsIHBhZGRpbmcsIGR5bmFtaWNQYWRkaW5nfSA9XG4gICAgICB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qgem9vbWVkVmlzaWJsZUFyZWEgPSBjYWxjVmlzaWJsZUFyZWEoXG4gICAgICB0aGlzLnZpc2libGVBcmVhTWF0LFxuICAgICAgZXh0ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBib2FyZEN0eCA9IGJvYXJkPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGN1cnNvckN0eCA9IGN1cnNvckNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBtYXJrdXBDdHggPSBtYXJrdXBDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgYW5hbHlzaXNDdHggPSBhbmFseXNpc0NhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBlZmZlY3RDdHggPSBlZmZlY3RDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgdmlzaWJsZUFyZWEgPSB6b29tXG4gICAgICA/IHpvb21lZFZpc2libGVBcmVhXG4gICAgICA6IFtcbiAgICAgICAgICBbMCwgYm9hcmRTaXplIC0gMV0sXG4gICAgICAgICAgWzAsIGJvYXJkU2l6ZSAtIDFdLFxuICAgICAgICBdO1xuXG4gICAgdGhpcy52aXNpYmxlQXJlYSA9IHZpc2libGVBcmVhO1xuICAgIGNvbnN0IHZpc2libGVBcmVhU2l6ZSA9IE1hdGgubWF4KFxuICAgICAgdmlzaWJsZUFyZWFbMF1bMV0gLSB2aXNpYmxlQXJlYVswXVswXSxcbiAgICAgIHZpc2libGVBcmVhWzFdWzFdIC0gdmlzaWJsZUFyZWFbMV1bMF1cbiAgICApO1xuXG4gICAgaWYgKGR5bmFtaWNQYWRkaW5nKSB7XG4gICAgICB0aGlzLmNhbGNEeW5hbWljUGFkZGluZyh2aXNpYmxlQXJlYVNpemUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMucGFkZGluZyA9IERFRkFVTFRfT1BUSU9OUy5wYWRkaW5nO1xuICAgIH1cblxuICAgIGlmICh6b29tKSB7XG4gICAgICBjb25zdCB7c3BhY2V9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmNhbGNDZW50ZXIoKTtcblxuICAgICAgaWYgKGR5bmFtaWNQYWRkaW5nKSB7XG4gICAgICAgIHRoaXMuY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnMucGFkZGluZyA9IERFRkFVTFRfT1BUSU9OUy5wYWRkaW5nO1xuICAgICAgfVxuXG4gICAgICBsZXQgZXh0cmFWaXNpYmxlU2l6ZSA9IGJvYXJkTGluZUV4dGVudCAqIDIgKyAxO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdFxuICAgICAgKSB7XG4gICAgICAgIGV4dHJhVmlzaWJsZVNpemUgPSBib2FyZExpbmVFeHRlbnQgKyAwLjU7XG4gICAgICB9XG4gICAgICBsZXQgem9vbWVkQm9hcmRTaXplID0gdmlzaWJsZUFyZWFTaXplICsgZXh0cmFWaXNpYmxlU2l6ZTtcblxuICAgICAgaWYgKHpvb21lZEJvYXJkU2l6ZSA8IGJvYXJkU2l6ZSkge1xuICAgICAgICBsZXQgc2NhbGUgPSAoY2FudmFzLndpZHRoIC0gcGFkZGluZyAqIDIpIC8gKHpvb21lZEJvYXJkU2l6ZSAqIHNwYWNlKTtcblxuICAgICAgICBsZXQgb2Zmc2V0WCA9XG4gICAgICAgICAgdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZSAqIHNjYWxlICtcbiAgICAgICAgICAvLyBmb3IgcGFkZGluZ1xuICAgICAgICAgIHBhZGRpbmcgKiBzY2FsZSAtXG4gICAgICAgICAgcGFkZGluZyAtXG4gICAgICAgICAgLy8gZm9yIGJvYXJkIGxpbmUgZXh0ZW50XG4gICAgICAgICAgKHNwYWNlICogZXh0cmFWaXNpYmxlU2l6ZSAqIHNjYWxlKSAvIDIgK1xuICAgICAgICAgIChzcGFjZSAqIHNjYWxlKSAvIDI7XG5cbiAgICAgICAgbGV0IG9mZnNldFkgPVxuICAgICAgICAgIHZpc2libGVBcmVhWzFdWzBdICogc3BhY2UgKiBzY2FsZSArXG4gICAgICAgICAgLy8gZm9yIHBhZGRpbmdcbiAgICAgICAgICBwYWRkaW5nICogc2NhbGUgLVxuICAgICAgICAgIHBhZGRpbmcgLVxuICAgICAgICAgIC8vIGZvciBib2FyZCBsaW5lIGV4dGVudFxuICAgICAgICAgIChzcGFjZSAqIGV4dHJhVmlzaWJsZVNpemUgKiBzY2FsZSkgLyAyICtcbiAgICAgICAgICAoc3BhY2UgKiBzY2FsZSkgLyAyO1xuXG4gICAgICAgIHRoaXMudHJhbnNNYXQgPSBuZXcgRE9NTWF0cml4KCk7XG4gICAgICAgIHRoaXMudHJhbnNNYXQudHJhbnNsYXRlU2VsZigtb2Zmc2V0WCwgLW9mZnNldFkpO1xuICAgICAgICB0aGlzLnRyYW5zTWF0LnNjYWxlU2VsZihzY2FsZSwgc2NhbGUpO1xuICAgICAgICBjdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgICAgYm9hcmRDdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgICAgYW5hbHlzaXNDdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgICAgY3Vyc29yQ3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIG1hcmt1cEN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBlZmZlY3RDdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXNldFRyYW5zZm9ybSgpO1xuICAgIH1cbiAgfVxuXG4gIGNhbGNCb2FyZFZpc2libGVBcmVhKHpvb20gPSBmYWxzZSkge1xuICAgIHRoaXMuem9vbUJvYXJkKHRoaXMub3B0aW9ucy56b29tKTtcbiAgfVxuXG4gIHJlc2V0VHJhbnNmb3JtKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNhbnZhcyxcbiAgICAgIGFuYWx5c2lzQ2FudmFzLFxuICAgICAgYm9hcmQsXG4gICAgICBjdXJzb3JDYW52YXMsXG4gICAgICBtYXJrdXBDYW52YXMsXG4gICAgICBlZmZlY3RDYW52YXMsXG4gICAgfSA9IHRoaXM7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGJvYXJkQ3R4ID0gYm9hcmQ/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgY3Vyc29yQ3R4ID0gY3Vyc29yQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IG1hcmt1cEN0eCA9IG1hcmt1cENhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBhbmFseXNpc0N0eCA9IGFuYWx5c2lzQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGVmZmVjdEN0eCA9IGVmZmVjdENhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLnRyYW5zTWF0ID0gbmV3IERPTU1hdHJpeCgpO1xuICAgIGN0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICBib2FyZEN0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICBhbmFseXNpc0N0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICBjdXJzb3JDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgbWFya3VwQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGVmZmVjdEN0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWF0fSA9IHRoaXM7XG4gICAgaWYgKHRoaXMubWF0ICYmIG1hdFswXSkgdGhpcy5vcHRpb25zLmJvYXJkU2l6ZSA9IG1hdFswXS5sZW5ndGg7XG5cbiAgICAvLyBUT0RPOiBjYWxjIHZpc2libGUgYXJlYSB0d2ljZSBpcyBub3QgZ29vZCwgbmVlZCB0byByZWZhY3RvclxuICAgIHRoaXMuem9vbUJvYXJkKHRoaXMub3B0aW9ucy56b29tKTtcbiAgICB0aGlzLnpvb21Cb2FyZCh0aGlzLm9wdGlvbnMuem9vbSk7XG4gICAgdGhpcy5jbGVhckFsbENhbnZhcygpO1xuICAgIHRoaXMuZHJhd0JvYXJkKCk7XG4gICAgdGhpcy5kcmF3U3RvbmVzKCk7XG4gICAgdGhpcy5kcmF3TWFya3VwKCk7XG4gICAgdGhpcy5kcmF3Q3Vyc29yKCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93QW5hbHlzaXMpIHRoaXMuZHJhd0FuYWx5c2lzKCk7XG4gIH1cblxuICByZW5kZXJJbk9uZUNhbnZhcyhjYW52YXMgPSB0aGlzLmNhbnZhcykge1xuICAgIHRoaXMuY2xlYXJBbGxDYW52YXMoKTtcbiAgICB0aGlzLmRyYXdCb2FyZChjYW52YXMsIGZhbHNlKTtcbiAgICB0aGlzLmRyYXdTdG9uZXModGhpcy5tYXQsIGNhbnZhcywgZmFsc2UpO1xuICAgIHRoaXMuZHJhd01hcmt1cCh0aGlzLm1hdCwgdGhpcy5tYXJrdXAsIGNhbnZhcywgZmFsc2UpO1xuICB9XG5cbiAgY2xlYXJBbGxDYW52YXMgPSAoKSA9PiB7XG4gICAgdGhpcy5jbGVhckNhbnZhcyh0aGlzLmJvYXJkKTtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XG4gICAgdGhpcy5jbGVhckNhbnZhcyh0aGlzLm1hcmt1cENhbnZhcyk7XG4gICAgdGhpcy5jbGVhckNhbnZhcyh0aGlzLmVmZmVjdENhbnZhcyk7XG4gICAgdGhpcy5jbGVhckN1cnNvckNhbnZhcygpO1xuICAgIHRoaXMuY2xlYXJBbmFseXNpc0NhbnZhcygpO1xuICB9O1xuXG4gIGNsZWFyQm9hcmQgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmJvYXJkKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gdGhpcy5ib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgLy8gV2lsbCBhbHdheXMgY2xlYXIgdGhlIHJpZ2h0IHNwYWNlXG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyQ2FudmFzID0gKGNhbnZhcyA9IHRoaXMuY2FudmFzKSA9PiB7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyTWFya3VwQ2FudmFzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5tYXJrdXBDYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSB0aGlzLm1hcmt1cENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLm1hcmt1cENhbnZhcy53aWR0aCwgdGhpcy5tYXJrdXBDYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyQ3Vyc29yQ2FudmFzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5jdXJzb3JDYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBzaXplID0gdGhpcy5vcHRpb25zLmJvYXJkU2l6ZTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN1cnNvckNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmN1cnNvckNhbnZhcy53aWR0aCwgdGhpcy5jdXJzb3JDYW52YXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNsZWFyQW5hbHlzaXNDYW52YXMgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmFuYWx5c2lzQ2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gdGhpcy5hbmFseXNpc0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdChcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGhpcy5hbmFseXNpc0NhbnZhcy53aWR0aCxcbiAgICAgICAgdGhpcy5hbmFseXNpc0NhbnZhcy5oZWlnaHRcbiAgICAgICk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBkcmF3QW5hbHlzaXMgPSAoYW5hbHlzaXMgPSB0aGlzLmFuYWx5c2lzKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5hbmFseXNpc0NhbnZhcztcbiAgICBjb25zdCB7XG4gICAgICB0aGVtZSA9IFRoZW1lLkJsYWNrQW5kV2hpdGUsXG4gICAgICBhbmFseXNpc1BvaW50VGhlbWUsXG4gICAgICBib2FyZFNpemUsXG4gICAgICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplLFxuICAgIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qge21hdCwgbWFya3VwfSA9IHRoaXM7XG4gICAgaWYgKCFjYW52YXMgfHwgIWFuYWx5c2lzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKCFjdHgpIHJldHVybjtcbiAgICB0aGlzLmNsZWFyQW5hbHlzaXNDYW52YXMoKTtcbiAgICBjb25zdCB7cm9vdEluZm99ID0gYW5hbHlzaXM7XG5cbiAgICBhbmFseXNpcy5tb3ZlSW5mb3MuZm9yRWFjaChtID0+IHtcbiAgICAgIGlmIChtLm1vdmUgPT09ICdwYXNzJykgcmV0dXJuO1xuICAgICAgY29uc3QgaWRPYmogPSBKU09OLnBhcnNlKGFuYWx5c2lzLmlkKTtcbiAgICAgIC8vIGNvbnN0IHt4OiBveCwgeTogb3l9ID0gcmV2ZXJzZU9mZnNldChtYXQsIGlkT2JqLmJ4LCBpZE9iai5ieSk7XG4gICAgICAvLyBsZXQge3g6IGksIHk6IGp9ID0gYTFUb1BvcyhtLm1vdmUpO1xuICAgICAgLy8gaSArPSBveDtcbiAgICAgIC8vIGogKz0gb3k7XG4gICAgICAvLyBsZXQgYW5hbHlzaXNCb2FyZFNpemUgPSBmb3JjZUFuYWx5c2lzQm9hcmRTaXplIHx8IGJvYXJkU2l6ZTtcbiAgICAgIGxldCBhbmFseXNpc0JvYXJkU2l6ZSA9IGJvYXJkU2l6ZTtcbiAgICAgIGNvbnN0IG9mZnNldGVkTW92ZSA9IG9mZnNldEExTW92ZShcbiAgICAgICAgbS5tb3ZlLFxuICAgICAgICAwLFxuICAgICAgICBhbmFseXNpc0JvYXJkU2l6ZSAtIGlkT2JqLmJ5XG4gICAgICApO1xuICAgICAgbGV0IHt4OiBpLCB5OiBqfSA9IGExVG9Qb3Mob2Zmc2V0ZWRNb3ZlKTtcbiAgICAgIGlmIChtYXRbaV1bal0gIT09IDApIHJldHVybjtcbiAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgY29uc3QgeSA9IHNjYWxlZFBhZGRpbmcgKyBqICogc3BhY2U7XG4gICAgICBjb25zdCByYXRpbyA9IDAuNDY7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgaWYgKFxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuU3ViZHVlZCAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuQmxhY2tBbmRXaGl0ZSAmJlxuICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRmxhdFxuICAgICAgKSB7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMztcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAzO1xuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSAnIzU1NSc7XG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gODtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAwO1xuICAgICAgICBjdHguc2hhZG93Q29sb3IgPSAnI2ZmZic7XG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcbiAgICAgIH1cblxuICAgICAgbGV0IG91dGxpbmVDb2xvcjtcbiAgICAgIGlmIChtYXJrdXBbaV1bal0uaW5jbHVkZXMoTWFya3VwLlBvc2l0aXZlTm9kZSkpIHtcbiAgICAgICAgb3V0bGluZUNvbG9yID0gdGhpcy5vcHRpb25zLnBvc2l0aXZlTm9kZUNvbG9yO1xuICAgICAgfVxuXG4gICAgICBpZiAobWFya3VwW2ldW2pdLmluY2x1ZGVzKE1hcmt1cC5OZWdhdGl2ZU5vZGUpKSB7XG4gICAgICAgIG91dGxpbmVDb2xvciA9IHRoaXMub3B0aW9ucy5uZWdhdGl2ZU5vZGVDb2xvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKG1hcmt1cFtpXVtqXS5pbmNsdWRlcyhNYXJrdXAuTmV1dHJhbE5vZGUpKSB7XG4gICAgICAgIG91dGxpbmVDb2xvciA9IHRoaXMub3B0aW9ucy5uZXV0cmFsTm9kZUNvbG9yO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwb2ludCA9IG5ldyBBbmFseXNpc1BvaW50KFxuICAgICAgICBjdHgsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHNwYWNlICogcmF0aW8sXG4gICAgICAgIHJvb3RJbmZvLFxuICAgICAgICBtLFxuICAgICAgICBhbmFseXNpc1BvaW50VGhlbWUsXG4gICAgICAgIG91dGxpbmVDb2xvclxuICAgICAgKTtcbiAgICAgIHBvaW50LmRyYXcoKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZHJhd01hcmt1cCA9IChcbiAgICBtYXQgPSB0aGlzLm1hdCxcbiAgICBtYXJrdXAgPSB0aGlzLm1hcmt1cCxcbiAgICBtYXJrdXBDYW52YXMgPSB0aGlzLm1hcmt1cENhbnZhcyxcbiAgICBjbGVhciA9IHRydWVcbiAgKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gbWFya3VwQ2FudmFzO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIGlmIChjbGVhcikgdGhpcy5jbGVhckNhbnZhcyhjYW52YXMpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJrdXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXJrdXBbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBtYXJrdXBbaV1bal07XG4gICAgICAgICAgdmFsdWVzPy5zcGxpdCgnfCcpLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICAgICAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgICAgICAgICBjb25zdCB5ID0gc2NhbGVkUGFkZGluZyArIGogKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3Qga2kgPSBtYXRbaV1bal07XG4gICAgICAgICAgICAgIGxldCBtYXJrdXA7XG4gICAgICAgICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5DaXJjbGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IENpcmNsZU1hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuQ3VycmVudDoge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgQ2lyY2xlU29saWRNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlRG90dGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlRG90dGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbERhc2hlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsRG90dGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0Rhc2hlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nRG90dGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdERhc2hlZEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0RG90dGVkQWN0aXZlTm9kZToge1xuICAgICAgICAgICAgICAgICAgICBsZXQge2NvbG9yLCBsaW5lRGFzaH0gPSB0aGlzLm5vZGVNYXJrdXBTdHlsZXNbdmFsdWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBBY3RpdmVOb2RlTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgTWFya3VwLkNpcmNsZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAuc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAuc2V0TGluZURhc2gobGluZURhc2gpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlRGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlBvc2l0aXZlRG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlRGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5lZ2F0aXZlRG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbERhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsRG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0Rhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nRG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdERhc2hlZE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0RG90dGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5vZGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtjb2xvciwgbGluZURhc2h9ID0gdGhpcy5ub2RlTWFya3VwU3R5bGVzW3ZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IE5vZGVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICBNYXJrdXAuQ2lyY2xlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRMaW5lRGFzaChsaW5lRGFzaCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuU3F1YXJlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBTcXVhcmVNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlRyaWFuZ2xlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBUcmlhbmdsZU1hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuQ3Jvc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IENyb3NzTWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5IaWdobGlnaHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IEhpZ2hsaWdodE1hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IFRleHRNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2ksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWFya3VwPy5kcmF3KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3Qm9hcmQgPSAoYm9hcmQgPSB0aGlzLmJvYXJkLCBjbGVhciA9IHRydWUpID0+IHtcbiAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoYm9hcmQpO1xuICAgIHRoaXMuZHJhd0Jhbihib2FyZCk7XG4gICAgdGhpcy5kcmF3Qm9hcmRMaW5lKGJvYXJkKTtcbiAgICB0aGlzLmRyYXdTdGFycyhib2FyZCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb29yZGluYXRlKSB7XG4gICAgICB0aGlzLmRyYXdDb29yZGluYXRlKCk7XG4gICAgfVxuICB9O1xuXG4gIGRyYXdCYW4gPSAoYm9hcmQgPSB0aGlzLmJvYXJkKSA9PiB7XG4gICAgY29uc3Qge3RoZW1lLCB0aGVtZVJlc291cmNlcywgcGFkZGluZ30gPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKGJvYXJkKSB7XG4gICAgICBib2FyZC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnMnB4JztcbiAgICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBpZiAoY3R4KSB7XG4gICAgICAgIGlmICh0aGVtZSA9PT0gVGhlbWUuQmxhY2tBbmRXaGl0ZSkge1xuICAgICAgICAgIGJvYXJkLnN0eWxlLmJveFNoYWRvdyA9ICcwcHggMHB4IDBweCAjMDAwMDAwJztcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xuICAgICAgICAgIGN0eC5maWxsUmVjdChcbiAgICAgICAgICAgIC1wYWRkaW5nLFxuICAgICAgICAgICAgLXBhZGRpbmcsXG4gICAgICAgICAgICBib2FyZC53aWR0aCArIHBhZGRpbmcsXG4gICAgICAgICAgICBib2FyZC5oZWlnaHQgKyBwYWRkaW5nXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGVtZSA9PT0gVGhlbWUuRmxhdCkge1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLm9wdGlvbnMudGhlbWVGbGF0Qm9hcmRDb2xvcjtcbiAgICAgICAgICBjdHguZmlsbFJlY3QoXG4gICAgICAgICAgICAtcGFkZGluZyxcbiAgICAgICAgICAgIC1wYWRkaW5nLFxuICAgICAgICAgICAgYm9hcmQud2lkdGggKyBwYWRkaW5nLFxuICAgICAgICAgICAgYm9hcmQuaGVpZ2h0ICsgcGFkZGluZ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLldhbG51dCAmJlxuICAgICAgICAgIHRoZW1lUmVzb3VyY2VzW3RoZW1lXS5ib2FyZCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IGJvYXJkVXJsID0gdGhlbWVSZXNvdXJjZXNbdGhlbWVdLmJvYXJkIHx8ICcnO1xuICAgICAgICAgIGNvbnN0IGJvYXJkUmVzID0gaW1hZ2VzW2JvYXJkVXJsXTtcbiAgICAgICAgICBpZiAoYm9hcmRSZXMpIHtcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICAgIGJvYXJkUmVzLFxuICAgICAgICAgICAgICAtcGFkZGluZyxcbiAgICAgICAgICAgICAgLXBhZGRpbmcsXG4gICAgICAgICAgICAgIGJvYXJkLndpZHRoICsgcGFkZGluZyxcbiAgICAgICAgICAgICAgYm9hcmQuaGVpZ2h0ICsgcGFkZGluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgYm9hcmRVcmwgPSB0aGVtZVJlc291cmNlc1t0aGVtZV0uYm9hcmQgfHwgJyc7XG4gICAgICAgICAgY29uc3QgaW1hZ2UgPSBpbWFnZXNbYm9hcmRVcmxdO1xuICAgICAgICAgIGlmIChpbWFnZSkge1xuICAgICAgICAgICAgY29uc3QgcGF0dGVybiA9IGN0eC5jcmVhdGVQYXR0ZXJuKGltYWdlLCAncmVwZWF0Jyk7XG4gICAgICAgICAgICBpZiAocGF0dGVybikge1xuICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gcGF0dGVybjtcbiAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIGJvYXJkLndpZHRoLCBib2FyZC5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3Qm9hcmRMaW5lID0gKGJvYXJkID0gdGhpcy5ib2FyZCkgPT4ge1xuICAgIGlmICghYm9hcmQpIHJldHVybjtcbiAgICBjb25zdCB7dmlzaWJsZUFyZWEsIG9wdGlvbnN9ID0gdGhpcztcbiAgICBjb25zdCB7XG4gICAgICB6b29tLFxuICAgICAgYm9hcmRTaXplLFxuICAgICAgYm9hcmRMaW5lV2lkdGgsXG4gICAgICBib2FyZEVkZ2VMaW5lV2lkdGgsXG4gICAgICBib2FyZExpbmVFeHRlbnQsXG4gICAgICBhZGFwdGl2ZUJvYXJkTGluZSxcbiAgICB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBjdHggPSBib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcblxuICAgICAgY29uc3QgZXh0ZW5kU3BhY2UgPSB6b29tID8gYm9hcmRMaW5lRXh0ZW50ICogc3BhY2UgOiAwO1xuXG4gICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xuXG4gICAgICBsZXQgZWRnZUxpbmVXaWR0aCA9IGFkYXB0aXZlQm9hcmRMaW5lXG4gICAgICAgID8gYm9hcmQud2lkdGggKiAwLjAwMlxuICAgICAgICA6IGJvYXJkRWRnZUxpbmVXaWR0aDtcblxuICAgICAgLy8gaWYgKGFkYXB0aXZlQm9hcmRMaW5lIHx8ICghYWRhcHRpdmVCb2FyZExpbmUgJiYgIWlzTW9iaWxlRGV2aWNlKCkpKSB7XG4gICAgICAvLyAgZWRnZUxpbmVXaWR0aCAqPSBkcHI7XG4gICAgICAvLyB9XG5cbiAgICAgIGxldCBsaW5lV2lkdGggPSBhZGFwdGl2ZUJvYXJkTGluZSA/IGJvYXJkLndpZHRoICogMC4wMDEgOiBib2FyZExpbmVXaWR0aDtcblxuICAgICAgLy8gaWYgKGFkYXB0aXZlQm9hcmRMaW5lIHx8ICAoIWFkYXB0aXZlQm9hcmRMaW5lICYmICFpc01vYmlsZURldmljZSgpKSkge1xuICAgICAgLy8gICBsaW5lV2lkdGggKj0gZHByO1xuICAgICAgLy8gfVxuXG4gICAgICAvLyB2ZXJ0aWNhbFxuICAgICAgZm9yIChsZXQgaSA9IHZpc2libGVBcmVhWzBdWzBdOyBpIDw9IHZpc2libGVBcmVhWzBdWzFdOyBpKyspIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKHZpc2libGVBcmVhWzBdWzBdID09PSAwICYmIGkgPT09IDApIHx8XG4gICAgICAgICAgKHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxICYmIGkgPT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBlZGdlTGluZVdpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGlzTW9iaWxlRGV2aWNlKCkgJiZcbiAgICAgICAgICBpID09PSB0aGlzLmN1cnNvclBvc2l0aW9uWzBdICYmXG4gICAgICAgICAgdGhpcy50b3VjaE1vdmluZ1xuICAgICAgICApIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gY3R4LmxpbmVXaWR0aCAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0YXJ0UG9pbnRZID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzFdWzBdICogc3BhY2UgLSBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzY2FsZWRQYWRkaW5nICsgdmlzaWJsZUFyZWFbMV1bMF0gKiBzcGFjZTtcbiAgICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICBzdGFydFBvaW50WSArPSBkcHIgLyAyO1xuICAgICAgICB9XG4gICAgICAgIGxldCBlbmRQb2ludFkgPVxuICAgICAgICAgIGkgPT09IDAgfHwgaSA9PT0gYm9hcmRTaXplIC0gMVxuICAgICAgICAgICAgPyBzcGFjZSAqIHZpc2libGVBcmVhWzFdWzFdICsgc2NhbGVkUGFkZGluZyArIGVkZ2VMaW5lV2lkdGggLyAyXG4gICAgICAgICAgICA6IHNwYWNlICogdmlzaWJsZUFyZWFbMV1bMV0gKyBzY2FsZWRQYWRkaW5nO1xuICAgICAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgIGVuZFBvaW50WSAtPSBkcHIgLyAyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVswXSA+IDApIHN0YXJ0UG9pbnRZIC09IGV4dGVuZFNwYWNlO1xuICAgICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMV0gPCBib2FyZFNpemUgLSAxKSBlbmRQb2ludFkgKz0gZXh0ZW5kU3BhY2U7XG4gICAgICAgIGN0eC5tb3ZlVG8oaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZywgc3RhcnRQb2ludFkpO1xuICAgICAgICBjdHgubGluZVRvKGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcsIGVuZFBvaW50WSk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cblxuICAgICAgLy8gaG9yaXpvbnRhbFxuICAgICAgZm9yIChsZXQgaSA9IHZpc2libGVBcmVhWzFdWzBdOyBpIDw9IHZpc2libGVBcmVhWzFdWzFdOyBpKyspIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKHZpc2libGVBcmVhWzFdWzBdID09PSAwICYmIGkgPT09IDApIHx8XG4gICAgICAgICAgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxICYmIGkgPT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBlZGdlTGluZVdpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGlzTW9iaWxlRGV2aWNlKCkgJiZcbiAgICAgICAgICBpID09PSB0aGlzLmN1cnNvclBvc2l0aW9uWzFdICYmXG4gICAgICAgICAgdGhpcy50b3VjaE1vdmluZ1xuICAgICAgICApIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gY3R4LmxpbmVXaWR0aCAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0YXJ0UG9pbnRYID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzBdWzBdICogc3BhY2UgLSBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzY2FsZWRQYWRkaW5nICsgdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZTtcbiAgICAgICAgbGV0IGVuZFBvaW50WCA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNwYWNlICogdmlzaWJsZUFyZWFbMF1bMV0gKyBzY2FsZWRQYWRkaW5nICsgZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc3BhY2UgKiB2aXNpYmxlQXJlYVswXVsxXSArIHNjYWxlZFBhZGRpbmc7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgc3RhcnRQb2ludFggKz0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgIGVuZFBvaW50WCAtPSBkcHIgLyAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzBdWzBdID4gMCkgc3RhcnRQb2ludFggLT0gZXh0ZW5kU3BhY2U7XG4gICAgICAgIGlmICh2aXNpYmxlQXJlYVswXVsxXSA8IGJvYXJkU2l6ZSAtIDEpIGVuZFBvaW50WCArPSBleHRlbmRTcGFjZTtcbiAgICAgICAgY3R4Lm1vdmVUbyhzdGFydFBvaW50WCwgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyk7XG4gICAgICAgIGN0eC5saW5lVG8oZW5kUG9pbnRYLCBpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3U3RhcnMgPSAoYm9hcmQgPSB0aGlzLmJvYXJkKSA9PiB7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYm9hcmRTaXplICE9PSAxOSkgcmV0dXJuO1xuXG4gICAgbGV0IHtzdGFyU2l6ZTogc3RhclNpemVPcHRpb25zLCBhZGFwdGl2ZVN0YXJTaXplfSA9IHRoaXMub3B0aW9ucztcblxuICAgIGNvbnN0IHZpc2libGVBcmVhID0gdGhpcy52aXNpYmxlQXJlYTtcbiAgICBjb25zdCBjdHggPSBib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGxldCBzdGFyU2l6ZSA9IGFkYXB0aXZlU3RhclNpemUgPyBib2FyZC53aWR0aCAqIDAuMDAzNSA6IHN0YXJTaXplT3B0aW9ucztcbiAgICAvLyBpZiAoIWlzTW9iaWxlRGV2aWNlKCkgfHwgIWFkYXB0aXZlU3RhclNpemUpIHtcbiAgICAvLyAgIHN0YXJTaXplID0gc3RhclNpemUgKiBkcHI7XG4gICAgLy8gfVxuICAgIGlmIChjdHgpIHtcbiAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIC8vIERyYXdpbmcgc3RhclxuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgWzMsIDksIDE1XS5mb3JFYWNoKGkgPT4ge1xuICAgICAgICBbMywgOSwgMTVdLmZvckVhY2goaiA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaSA+PSB2aXNpYmxlQXJlYVswXVswXSAmJlxuICAgICAgICAgICAgaSA8PSB2aXNpYmxlQXJlYVswXVsxXSAmJlxuICAgICAgICAgICAgaiA+PSB2aXNpYmxlQXJlYVsxXVswXSAmJlxuICAgICAgICAgICAgaiA8PSB2aXNpYmxlQXJlYVsxXVsxXVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmFyYyhcbiAgICAgICAgICAgICAgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyxcbiAgICAgICAgICAgICAgaiAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyxcbiAgICAgICAgICAgICAgc3RhclNpemUsXG4gICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgIDIgKiBNYXRoLlBJLFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgZHJhd0Nvb3JkaW5hdGUgPSAoKSA9PiB7XG4gICAgY29uc3Qge2JvYXJkLCBvcHRpb25zLCB2aXNpYmxlQXJlYX0gPSB0aGlzO1xuICAgIGlmICghYm9hcmQpIHJldHVybjtcbiAgICBjb25zdCB7Ym9hcmRTaXplLCB6b29tLCBwYWRkaW5nLCBib2FyZExpbmVFeHRlbnR9ID0gb3B0aW9ucztcbiAgICBsZXQgem9vbWVkQm9hcmRTaXplID0gdmlzaWJsZUFyZWFbMF1bMV0gLSB2aXNpYmxlQXJlYVswXVswXSArIDE7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcbiAgICAgIGN0eC5mb250ID0gYGJvbGQgJHtzcGFjZSAvIDN9cHggSGVsdmV0aWNhYDtcblxuICAgICAgY29uc3QgY2VudGVyID0gdGhpcy5jYWxjQ2VudGVyKCk7XG4gICAgICBsZXQgb2Zmc2V0ID0gc3BhY2UgLyAxLjU7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQ2VudGVyICYmXG4gICAgICAgIHZpc2libGVBcmVhWzBdWzBdID09PSAwICYmXG4gICAgICAgIHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxXG4gICAgICApIHtcbiAgICAgICAgb2Zmc2V0IC09IHNjYWxlZFBhZGRpbmcgLyAyO1xuICAgICAgfVxuXG4gICAgICBBMV9MRVRURVJTLmZvckVhY2goKGwsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHggPSBzcGFjZSAqIGluZGV4ICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgbGV0IG9mZnNldFRvcCA9IG9mZnNldDtcbiAgICAgICAgbGV0IG9mZnNldEJvdHRvbSA9IG9mZnNldDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFxuICAgICAgICApIHtcbiAgICAgICAgICBvZmZzZXRUb3AgLT0gc3BhY2UgKiBib2FyZExpbmVFeHRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVxuICAgICAgICApIHtcbiAgICAgICAgICBvZmZzZXRCb3R0b20gLT0gKHNwYWNlICogYm9hcmRMaW5lRXh0ZW50KSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHkxID0gdmlzaWJsZUFyZWFbMV1bMF0gKiBzcGFjZSArIHBhZGRpbmcgLSBvZmZzZXRUb3A7XG4gICAgICAgIGxldCB5MiA9IHkxICsgem9vbWVkQm9hcmRTaXplICogc3BhY2UgKyBvZmZzZXRCb3R0b20gKiAyO1xuICAgICAgICBpZiAoaW5kZXggPj0gdmlzaWJsZUFyZWFbMF1bMF0gJiYgaW5kZXggPD0gdmlzaWJsZUFyZWFbMF1bMV0pIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21MZWZ0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21SaWdodCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuQm90dG9tXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobCwgeCwgeTEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcFJpZ2h0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLCB4LCB5Mik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgQTFfTlVNQkVSUy5zbGljZSgtdGhpcy5vcHRpb25zLmJvYXJkU2l6ZSkuZm9yRWFjaCgobDogbnVtYmVyLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCB5ID0gc3BhY2UgKiBpbmRleCArIHNjYWxlZFBhZGRpbmc7XG4gICAgICAgIGxldCBvZmZzZXRMZWZ0ID0gb2Zmc2V0O1xuICAgICAgICBsZXQgb2Zmc2V0UmlnaHQgPSBvZmZzZXQ7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2Zmc2V0TGVmdCAtPSBzcGFjZSAqIGJvYXJkTGluZUV4dGVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlJpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldFJpZ2h0IC09IChzcGFjZSAqIGJvYXJkTGluZUV4dGVudCkgLyAyO1xuICAgICAgICB9XG4gICAgICAgIGxldCB4MSA9IHZpc2libGVBcmVhWzBdWzBdICogc3BhY2UgKyBwYWRkaW5nIC0gb2Zmc2V0TGVmdDtcbiAgICAgICAgbGV0IHgyID0geDEgKyB6b29tZWRCb2FyZFNpemUgKiBzcGFjZSArIDIgKiBvZmZzZXRSaWdodDtcbiAgICAgICAgaWYgKGluZGV4ID49IHZpc2libGVBcmVhWzFdWzBdICYmIGluZGV4IDw9IHZpc2libGVBcmVhWzFdWzFdKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbVJpZ2h0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5SaWdodFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGwudG9TdHJpbmcoKSwgeDEsIHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BMZWZ0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21MZWZ0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5MZWZ0XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobC50b1N0cmluZygpLCB4MiwgeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgY2FsY1NwYWNlQW5kUGFkZGluZyA9IChjYW52YXMgPSB0aGlzLmNhbnZhcykgPT4ge1xuICAgIGxldCBzcGFjZSA9IDA7XG4gICAgbGV0IHNjYWxlZFBhZGRpbmcgPSAwO1xuICAgIGxldCBzY2FsZWRCb2FyZEV4dGVudCA9IDA7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgY29uc3Qge3BhZGRpbmcsIGJvYXJkU2l6ZSwgYm9hcmRMaW5lRXh0ZW50LCB6b29tfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IHt2aXNpYmxlQXJlYX0gPSB0aGlzO1xuXG4gICAgICBpZiAoXG4gICAgICAgICh2aXNpYmxlQXJlYVswXVswXSAhPT0gMCAmJiB2aXNpYmxlQXJlYVswXVsxXSA9PT0gYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgKHZpc2libGVBcmVhWzFdWzBdICE9PSAwICYmIHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKVxuICAgICAgKSB7XG4gICAgICAgIHNjYWxlZEJvYXJkRXh0ZW50ID0gYm9hcmRMaW5lRXh0ZW50O1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICAodmlzaWJsZUFyZWFbMF1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMF1bMV0gIT09IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICh2aXNpYmxlQXJlYVsxXVswXSAhPT0gMCAmJiB2aXNpYmxlQXJlYVsxXVsxXSAhPT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICkge1xuICAgICAgICBzY2FsZWRCb2FyZEV4dGVudCA9IGJvYXJkTGluZUV4dGVudCAqIDI7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRpdmlzb3IgPSB6b29tID8gYm9hcmRTaXplICsgc2NhbGVkQm9hcmRFeHRlbnQgOiBib2FyZFNpemU7XG4gICAgICAvLyBjb25zdCBkaXZpc29yID0gYm9hcmRTaXplO1xuICAgICAgc3BhY2UgPSAoY2FudmFzLndpZHRoIC0gcGFkZGluZyAqIDIpIC8gTWF0aC5jZWlsKGRpdmlzb3IpO1xuICAgICAgc2NhbGVkUGFkZGluZyA9IHBhZGRpbmcgKyBzcGFjZSAvIDI7XG4gICAgfVxuICAgIHJldHVybiB7c3BhY2UsIHNjYWxlZFBhZGRpbmcsIHNjYWxlZEJvYXJkRXh0ZW50fTtcbiAgfTtcblxuICBwbGF5RWZmZWN0ID0gKG1hdCA9IHRoaXMubWF0LCBlZmZlY3RNYXQgPSB0aGlzLmVmZmVjdE1hdCwgY2xlYXIgPSB0cnVlKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5lZmZlY3RDYW52YXM7XG5cbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoY2FudmFzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWZmZWN0TWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZWZmZWN0TWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBlZmZlY3RNYXRbaV1bal07XG4gICAgICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgICAgIGNvbnN0IHggPSBzY2FsZWRQYWRkaW5nICsgaSAqIHNwYWNlO1xuICAgICAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgICAgIGNvbnN0IGtpID0gbWF0W2ldW2pdO1xuICAgICAgICAgIGxldCBlZmZlY3Q7XG4gICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGNhc2UgRWZmZWN0LkJhbjoge1xuICAgICAgICAgICAgICAgIGVmZmVjdCA9IG5ldyBCYW5FZmZlY3QoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgICAgICAgIGVmZmVjdC5wbGF5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVmZmVjdE1hdFtpXVtqXSA9IEVmZmVjdC5Ob25lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qge2JvYXJkU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLnNldEVmZmVjdE1hdChlbXB0eShbYm9hcmRTaXplLCBib2FyZFNpemVdKSk7XG4gICAgfVxuICB9O1xuXG4gIGRyYXdDdXJzb3IgPSAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgdGhpcy5jbGVhckN1cnNvckNhbnZhcygpO1xuICAgICAgaWYgKHRoaXMuY3Vyc29yID09PSBDdXJzb3IuTm9uZSkgcmV0dXJuO1xuICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkgJiYgIXRoaXMudG91Y2hNb3ZpbmcpIHJldHVybjtcblxuICAgICAgY29uc3Qge3BhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBjb25zdCB7c3BhY2V9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICBjb25zdCB7dmlzaWJsZUFyZWEsIGN1cnNvciwgY3Vyc29yVmFsdWV9ID0gdGhpcztcblxuICAgICAgY29uc3QgW2lkeCwgaWR5XSA9IHRoaXMuY3Vyc29yUG9zaXRpb247XG4gICAgICBpZiAoaWR4IDwgdmlzaWJsZUFyZWFbMF1bMF0gfHwgaWR4ID4gdmlzaWJsZUFyZWFbMF1bMV0pIHJldHVybjtcbiAgICAgIGlmIChpZHkgPCB2aXNpYmxlQXJlYVsxXVswXSB8fCBpZHkgPiB2aXNpYmxlQXJlYVsxXVsxXSkgcmV0dXJuO1xuICAgICAgY29uc3QgeCA9IGlkeCAqIHNwYWNlICsgc3BhY2UgLyAyICsgcGFkZGluZztcbiAgICAgIGNvbnN0IHkgPSBpZHkgKiBzcGFjZSArIHNwYWNlIC8gMiArIHBhZGRpbmc7XG4gICAgICBjb25zdCBraSA9IHRoaXMubWF0Py5baWR4XT8uW2lkeV0gfHwgS2kuRW1wdHk7XG5cbiAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgbGV0IGN1cjtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHNwYWNlICogMC44O1xuICAgICAgICBpZiAoY3Vyc29yID09PSBDdXJzb3IuQ2lyY2xlKSB7XG4gICAgICAgICAgY3VyID0gbmV3IENpcmNsZU1hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuU3F1YXJlKSB7XG4gICAgICAgICAgY3VyID0gbmV3IFNxdWFyZU1hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuVHJpYW5nbGUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgVHJpYW5nbGVNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLkNyb3NzKSB7XG4gICAgICAgICAgY3VyID0gbmV3IENyb3NzTWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5UZXh0KSB7XG4gICAgICAgICAgY3VyID0gbmV3IFRleHRNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2ksIGN1cnNvclZhbHVlKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChraSA9PT0gS2kuRW1wdHkgJiYgY3Vyc29yID09PSBDdXJzb3IuQmxhY2tTdG9uZSkge1xuICAgICAgICAgIGN1ciA9IG5ldyBDb2xvclN0b25lKGN0eCwgeCwgeSwgS2kuQmxhY2spO1xuICAgICAgICAgIGN1ci5zZXRTaXplKHNpemUpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5FbXB0eSAmJiBjdXJzb3IgPT09IEN1cnNvci5XaGl0ZVN0b25lKSB7XG4gICAgICAgICAgY3VyID0gbmV3IENvbG9yU3RvbmUoY3R4LCB4LCB5LCBLaS5XaGl0ZSk7XG4gICAgICAgICAgY3VyLnNldFNpemUoc2l6ZSk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuNSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuQ2xlYXIpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgQ29sb3JTdG9uZShjdHgsIHgsIHksIEtpLkVtcHR5KTtcbiAgICAgICAgICBjdXIuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgfVxuICAgICAgICBjdXI/LmRyYXcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZHJhd1N0b25lcyA9IChcbiAgICBtYXQ6IG51bWJlcltdW10gPSB0aGlzLm1hdCxcbiAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICBjbGVhciA9IHRydWVcbiAgKSA9PiB7XG4gICAgY29uc3Qge3RoZW1lID0gVGhlbWUuQmxhY2tBbmRXaGl0ZSwgdGhlbWVSZXNvdXJjZXN9ID0gdGhpcy5vcHRpb25zO1xuICAgIGlmIChjbGVhcikgdGhpcy5jbGVhckNhbnZhcygpO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBtYXRbaV1bal07XG4gICAgICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgICAgICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3QgeSA9IHNjYWxlZFBhZGRpbmcgKyBqICogc3BhY2U7XG4gICAgICAgICAgICAgIGNvbnN0IHJhdGlvID0gMC40NTtcbiAgICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5TdWJkdWVkICYmXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRmxhdFxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDM7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAzO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICcjNTU1JztcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDg7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IHN0b25lO1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoZW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBUaGVtZS5CbGFja0FuZFdoaXRlOlxuICAgICAgICAgICAgICAgIGNhc2UgVGhlbWUuRmxhdDoge1xuICAgICAgICAgICAgICAgICAgc3RvbmUgPSBuZXcgQ29sb3JTdG9uZShjdHgsIHgsIHksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIHN0b25lLnNldFNpemUoc3BhY2UgKiByYXRpbyAqIDIpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGJsYWNrcyA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXS5ibGFja3MubWFwKFxuICAgICAgICAgICAgICAgICAgICBpID0+IGltYWdlc1tpXVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHdoaXRlcyA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXS53aGl0ZXMubWFwKFxuICAgICAgICAgICAgICAgICAgICBpID0+IGltYWdlc1tpXVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZCA9IGkgKyAxMCArIGo7XG4gICAgICAgICAgICAgICAgICBzdG9uZSA9IG5ldyBJbWFnZVN0b25lKGN0eCwgeCwgeSwgdmFsdWUsIG1vZCwgYmxhY2tzLCB3aGl0ZXMpO1xuICAgICAgICAgICAgICAgICAgc3RvbmUuc2V0U2l6ZShzcGFjZSAqIHJhdGlvICogMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN0b25lLmRyYXcoKTtcbiAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiX19zcHJlYWRBcnJheSIsIl9fcmVhZCIsIl9fdmFsdWVzIiwiZmlsdGVyIiwiZmluZExhc3RJbmRleCIsIktpIiwiVGhlbWUiLCJBbmFseXNpc1BvaW50VGhlbWUiLCJDZW50ZXIiLCJFZmZlY3QiLCJNYXJrdXAiLCJDdXJzb3IiLCJQcm9ibGVtQW5zd2VyVHlwZSIsIlBhdGhEZXRlY3Rpb25TdHJhdGVneSIsIl9fZXh0ZW5kcyIsImNsb25lRGVlcCIsInJlcGxhY2UiLCJjb21wYWN0IiwiZmxhdHRlbkRlcHRoIiwic3VtIiwiY2xvbmUiLCJzYW1wbGUiLCJlbmNvZGUiLCJfX2Fzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUc7QUFDSCxTQUFTLFNBQVMsQ0FBSSxZQUEyQixFQUFFLEdBQVEsRUFBQTtBQUN6RCxJQUFBLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDdkIsSUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7QUFDWixRQUFB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LENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN4RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBR0QsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3pELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMzRCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDM0QsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDcEMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUN6RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN2RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1FBQ25DLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDtJQUNELE9BQU87UUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1FBQ3pELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztRQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsUUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsUUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0tBQ3BELENBQUM7QUFDSixFQUFFO0lBRVcsTUFBTSxHQUFHLFVBQUMsQ0FBUyxFQUFFLEtBQVMsRUFBRSxLQUFTLEVBQUE7QUFBcEIsSUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVMsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUFFLElBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFTLEdBQUEsQ0FBQSxDQUFBLEVBQUE7SUFDcEQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUQsRUFBRTtJQUVXLE1BQU0sR0FBRyxVQUFDLENBQVMsRUFBRSxLQUFTLEVBQUUsS0FBUyxFQUFBO0FBQXBCLElBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFTLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFBRSxJQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBUyxHQUFBLENBQUEsQ0FBQSxFQUFBO0lBQ3BELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hFLEVBQUU7QUFFVyxJQUFBLFlBQVksR0FBRyxVQUFDLENBQVEsRUFBRSxJQUFTLEVBQUE7O0lBQzlDLElBQU0sR0FBRyxHQUFHLENBQUEsRUFBQSxHQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLElBQUksQ0FBQyxVQUFDLENBQWEsRUFBQSxFQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUEsRUFBQSxDQUFDLENBQUM7SUFDNUUsT0FBTyxDQUFBLEdBQUcsS0FBQSxJQUFBLElBQUgsR0FBRyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFILEdBQUcsQ0FBRSxLQUFLLE1BQUssSUFBSSxDQUFDO0FBQzdCLEVBQUU7QUFFSyxJQUFNLFlBQVksR0FBRyxVQUFDLENB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QUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUMzQixFQUFFO0FBRVcsSUFBQSxTQUFTLEdBQUcsVUFBQyxHQUFRLEVBQUUsTUFBVSxFQUFBO0FBQVYsSUFBQSxJQUFBLE1BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE1BQVUsR0FBQSxDQUFBLENBQUEsRUFBQTtJQUM1QyxJQUFJLE1BQU0sS0FBSyxDQUFDO0FBQUUsUUFBQSxPQUFPLEdBQUcsQ0FBQztBQUM3QixJQUFBLElBQU0sR0FBRyxHQUFHQyxZQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsSUFBQSxJQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUN2RCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2RSxFQUFFO0FBRVcsSUFBQSxPQUFPLEdBQUcsVUFBQyxHQUFRLEVBQUUsSUFBVSxFQUFFLE9BQVcsRUFBRSxPQUFXLEVBQUE7QUFBcEMsSUFBQSxJQUFBLElBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLElBQVUsR0FBQSxHQUFBLENBQUEsRUFBQTtBQUFFLElBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxPQUFXLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFBRSxJQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBVyxHQUFBLENBQUEsQ0FBQSxFQUFBO0lBQ3BFLElBQUksR0FBRyxLQUFLLE1BQU07UUFBRSxPQUFPLEVBQUEsQ0FBQSxNQUFBLENBQUcsSUFBSSxFQUFBLElBQUEsQ0FBSSxDQUFDO0FBQ3ZDLElBQUEsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxD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UUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUNyQztBQUNELElBQUEsSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxVQUFVLEVBQUU7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQztLQUMxQztBQUNELElBQUEsSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxXQUFXLEVBQUU7UUFDakMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQztLQUMxQztBQUNELElBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNDLElBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRTNDLElBQUEsT0FBTyxNQUFNLENBQUM7QUFDaEIsRUFBRTtJQUVXLGVBQWUsR0FBRyxVQUM3QixHQUFlLEVBQ2YsTUFBVSxFQUNWLFNBQWMsRUFBQTtBQURkLElBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFVLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDVixJQUFBLElBQUEsU0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsU0FBYyxHQUFBLEVBQUEsQ0FBQSxFQUFBO0FBRVIs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RyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuRSxRQUFBLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RELFFBQUEsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUV0RSxRQUFBLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQ3ZCLGdCQUFnQixHQUFHLGdCQUFnQixFQUNuQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FDcEMsQ0FBQztRQUVGLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztBQUMxQixRQUFBLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBRTNCLFFBQUEsSUFBSSxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtBQUN4QixZQUFBLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN4QixZQUFBLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO1NBQzVCO1FBRUQsTUFBTSxHQUFHLGdCQUFnQixDQUFDO0FBQzFCLFFBQUEsTUFBTSxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDM0IsSUFBSSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUMzQixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDM0IsWUFBQSxNQUFNLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztTQUM1QjtLQUNGO1NBQU07UUFDTCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLFFBQUEsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDdEMsUUFBQSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7S0FDdkQ7SUFFRCxPQUFPO1FBQ0wsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1FBQ2hCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztLQUNqQixDQUFDO0FBQ0osQ0FBQztBQUVLLFNBQVUsSUFBSSxDQUFDLEdBQWUsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEVBQVUsRUFBQTtBQUNwRSxJQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUFFLFFBQUEsT0FBTyxHQUFHLENBQUM7QUFDL0IsSUFBQSxJQUFNLE1BQU0sR0FBR08sZ0JBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLE9BQU8sV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEMsQ0FBQztTQUVlLE1BQU0sQ0FBQyxHQUFlLEVBQUUsS0FBZSxFQUFFLFVBQWlCLEVBQUE7QUFBakIsSUFBQSxJQUFBLFVBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFVBQWlCLEdBQUEsSUFBQSxDQUFBLEVBQUE7QUFDeEUsSUFBQSxJQUFJLE1BQU0sR0FBR0EsZ0JBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDckIsSUFBQSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxFQUFBO0FBQ1QsUUFBQSxJQUFBLEVBUUYsR0FBQSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBUGYsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQ0QsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQ0QsRUFBRSxRQUthLENBQUM7UUFDbEIsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNsQixnQkFBQSxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDakI7U0FDRjthQUFNO1lBQ0wsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNsQixRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO0FBQ0gsS0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPO0FBQ0wsUUFBQSxXQUFXLEVBQUUsTUFBTTtBQUNuQixRQUFBLFFBQVEsRUFBQSxRQUFBO0tBQ1QsQ0FBQztBQUNKLENBQUM7QUFFRDtBQUNPLElBQU0sVUFBVSxHQUFHLFVBQ3hCLEdBQWUsRUFDZixDQUFTLEVBQ1QsQ0FBUyxFQUNULElBQVEsRUFDUixXQUFrQixFQUNsQixXQUFvRCxFQUFBO0FBRXBELElBQUEsSUFBSSxJQUFJLEtBQUtWLFVBQUUsQ0FBQyxLQUFLO1FBQUUsT0FBTztJQUM5QixJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTs7UUFFNUIsSUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxRQUFBLElBQU0sS0FBSyxHQUFHLElBQUksS0FBS0EsVUFBRSxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQzVDLFFBQUEsSUFBTSxNQUFJLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQSxDQUFBLE1BQUEsQ0FBRyxLQUFLLEVBQUksR0FBQSxDQUFBLENBQUEsTUFBQSxDQUFBLEtBQUssTUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUMxQyxVQUFDLENBQVEsRUFBQSxFQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssTUFBSSxDQUFBLEVBQUEsQ0FDbEMsQ0FBQztRQUNGLElBQUksSUFBSSxTQUFPLENBQUM7QUFDaEIsUUFBQSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZCLFlBQUEsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQjthQUFNO1lBQ0wsSUFBSSxHQUFHLGFBQWEsQ0FBQyxFQUFHLENBQUEsTUFBQSxDQUFBLEtBQUssRUFBSSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsS0FBSyxFQUFHLEdBQUEsQ0FBQSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3hELFlBQUEsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtBQUNELFFBQUEsSUFBSSxXQUFXO0FBQUUsWUFBQSxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzFDO1NBQU07QUFDTCxRQUFBLElBQUksV0FBVztBQUFFLFlBQUEsV0FBVyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNsRDtBQUNILEVBQUU7QUFFRjs7OztBQUlHO0FBQ1UsSUFBQSx5QkFBeUIsR0FBRyxVQUN2QyxXQUFrQixFQUNsQixLQUFhLEVBQUE7QUFFYixJQUFBLElBQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuQyxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUE7QUFDUixRQUFBLElBQUEsVUFBVSxHQUFJLElBQUksQ0FBQyxLQUFLLFdBQWQsQ0FBZTtRQUNoQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFZLEVBQUEsRUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxHQUFBLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFNLEVBQUssRUFBQSxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFBLEVBQUEsQ0FBQyxDQUFDO1NBQzFFO2FBQU07QUFDTCxZQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFZLEVBQUE7QUFDOUIsZ0JBQUEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsRUFBQSxFQUFJLE9BQUEsQ0FBQyxLQUFLLEtBQUssQ0FBWCxFQUFXLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FDbEQsVUFBQyxDQUFZLEVBQUssRUFBQSxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQSxFQUFBLENBQ3RDLENBQUM7aUJBQ0g7QUFDSCxhQUFDLENBQUMsQ0FBQztTQUNKO0FBQ0gsS0FBQyxDQUFDLENBQUM7QUFDTCxFQUFFO0FBRUY7Ozs7Ozs7OztBQVNHO0FBQ0ksSUFBTSxxQkFBcUIsR0FBRyxVQUNuQyxXQUFrQixFQUNsQixHQUFlLEVBQ2YsQ0FBUyxFQUNULENBQVMsRUFDVCxFQUFNLEVBQUE7SUFFTixJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlDLElBQUEsSUFBTSxLQUFLLEdBQUcsRUFBRSxLQUFLQSxVQUFFLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7SUFDNUMsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDbkIsSUFBQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBS0EsVUFBRSxDQUFDLEtBQUssRUFBRTtBQUMxQixRQUFBLHlCQUF5QixDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMvQztTQUFNO1FBQ0wsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsTUFBTSxHQUFPTCxtQkFBQSxDQUFBQSxtQkFBQSxDQUFBLEVBQUEsRUFBQUMsWUFBQSxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxDQUFFLEtBQUssQ0FBQSxFQUFBLEtBQUEsQ0FBQyxDQUFDO1NBQ3ZDO2FBQU07WUFDTCxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsNERBQ3ZCLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUE7QUFDL0IsZ0JBQUEsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztxQkFDNUIsQ0FBQztTQUNIO1FBQ0QsTUFBTSxHQUFHLElBQUksQ0FBQztLQUNmO0FBQ0QsSUFBQSxPQUFPLE1BQU0sQ0FBQztBQUNoQixFQUFFO0FBRUY7Ozs7Ozs7Ozs7QUFVRztBQUNIO0FBQ08sSUFBTSxvQkFBb0IsR0FBRyxVQUNsQyxXQUFrQixFQUNsQixHQUFlLEVBQ2YsQ0FBUyxFQUNULENBQVMsRUFDVCxFQUFNLEVBQUE7QUFFTixJQUFBLElBQUksRUFBRSxLQUFLSSxVQUFFLENBQUMsS0FBSztRQUFFLE9BQU87QUFDNUIsSUFBQSxJQUFJLElBQUksQ0FBQztJQUNULElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzFCLElBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUMsUUFBQSxJQUFNLEtBQUssR0FBRyxFQUFFLEtBQUtBLFVBQUUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUMxQyxRQUFBLElBQU0sTUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUEsQ0FBQSxNQUFBLENBQUcsS0FBSyxFQUFJLEdBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFLLE1BQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDMUMsVUFBQyxDQUFRLEVBQUEsRUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLE1BQUksQ0FBQSxFQUFBLENBQ2xDLENBQUM7QUFDRixRQUFBLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdkIsWUFBQSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BCO2FBQU07WUFDTCxJQUFJLEdBQUcsYUFBYSxDQUFDLEVBQUcsQ0FBQSxNQUFBLENBQUEsS0FBSyxFQUFJLEdBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFLLEVBQUcsR0FBQSxDQUFBLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDeEQsWUFBQSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0tBQ0Y7QUFDRCxJQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsRUFBRTtBQUVXLElBQUEsZ0NBQWdDLEdBQUcsVUFDOUMsSUFBVyxFQUNYLGdCQUFxQixFQUFBO0FBQXJCLElBQUEsSUFBQSxnQkFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsZ0JBQXFCLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFFckIsSUFBQSxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQzlELElBQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RELElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTNDLElBQUEsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQVgsRUFBVyxDQUFDLENBQUM7QUFDM0MsSUFBQSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN0QixRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBUSxFQUFBO1lBQzdCLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVcsRUFBQTtBQUNwQyxnQkFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7b0JBQzVDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzFCO0FBQ0gsYUFBQyxDQUFDLENBQUM7QUFDTCxTQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0QsSUFBQSxPQUFPLGNBQWMsQ0FBQztBQUN4QixFQUFFO0FBRVcsSUFBQSxrQkFBa0IsR0FBRyxVQUFDLElBQVcsRUFBRSxnQkFBcUIsRUFBQTtBQUFyQixJQUFBLElBQUEsZ0JBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLGdCQUFxQixHQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQ25FLElBQUEsSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUM5RCxJQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RCxJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUUzQyxJQUFJLGdCQUFnQixHQUFZLEVBQUUsQ0FBQztBQUNuQyxJQUFBLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3RCLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFRLEVBQUssRUFBQSxPQUFBLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFwQixFQUFvQixDQUFDLENBQUM7S0FDN0U7QUFFRCxJQUFBLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3JCLFFBQUEsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQVgsRUFBVyxDQUFDLENBQUM7QUFDM0MsUUFBQSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN0QixZQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBUSxFQUFBO2dCQUM3QixDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFXLEVBQUE7QUFDcEMsb0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsb0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsb0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO3dCQUM1QyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMxQjtBQUNILGlCQUFDLENBQUMsQ0FBQztBQUNMLGFBQUMsQ0FBQyxDQUFDO1NBQ0o7S0FDRjtBQUVELElBQUEsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBUSxFQUFBO1FBQ2hDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVcsRUFBQTtBQUNwQyxZQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsWUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7Z0JBQzVDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDMUI7QUFDSCxTQUFDLENBQUMsQ0FBQztBQUNMLEtBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBQSxPQUFPLGNBQWMsQ0FBQztBQUN4QixFQUFFO0FBRUY7Ozs7OztBQU1HO0FBQ1UsSUFBQSxvQkFBb0IsR0FBRyxVQUNsQyxJQUFXLEVBQ1gsTUFBbUQsRUFDbkQsV0FBdUIsRUFDdkIsZ0JBQXFCLEVBQUE7QUFGckIsSUFBQSxJQUFBLE1BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE1BQW1ELEdBQUEsUUFBQSxDQUFBLEVBQUE7QUFDbkQsSUFBQSxJQUFBLFdBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFdBQXVCLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDdkIsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBcUIsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUVyQixJQUFBLElBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLElBQUEsR0FBRyxHQUFZLEdBQUcsQ0FBQSxHQUFmLEVBQUUsTUFBTSxHQUFJLEdBQUcsQ0FBQSxNQUFQLENBQVE7SUFDMUIsSUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFFdEQsSUFBQSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN0QixRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBUSxFQUFBO1lBQzdCLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVcsRUFBQTtBQUNwQyxnQkFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7b0JBQUUsT0FBTztnQkFDM0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDeEIsb0JBQUEsSUFBSSxJQUFJLEdBQUdLLGNBQU0sQ0FBQyxXQUFXLENBQUM7QUFDOUIsb0JBQUEsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ2xCLElBQUk7QUFDRiw0QkFBQSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssV0FBVztrQ0FDeEJBLGNBQU0sQ0FBQyxrQkFBa0I7QUFDM0Isa0NBQUVBLGNBQU0sQ0FBQyxZQUFZLENBQUM7cUJBQzNCO0FBQ0Qsb0JBQUEsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ2xCLElBQUk7QUFDRiw0QkFBQSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssV0FBVztrQ0FDeEJBLGNBQU0sQ0FBQyxrQkFBa0I7QUFDM0Isa0NBQUVBLGNBQU0sQ0FBQyxZQUFZLENBQUM7cUJBQzNCO0FBQ0Qsb0JBQUEsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUtMLFVBQUUsQ0FBQyxLQUFLLEVBQUU7d0JBQzFCLFFBQVEsTUFBTTtBQUNaLDRCQUFBLEtBQUssU0FBUztBQUNaLGdDQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDekMsTUFBTTtBQUNSLDRCQUFBLEtBQUssU0FBUztnQ0FDWixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dDQUNwQixNQUFNO0FBQ1IsNEJBQUEsS0FBSyxRQUFRLENBQUM7QUFDZCw0QkFBQTtnQ0FDRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQzt5QkFDOUI7cUJBQ0Y7aUJBQ0Y7QUFDSCxhQUFDLENBQUMsQ0FBQztBQUNMLFNBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFFRCxJQUFBLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLEVBQUU7QUFFSyxJQUFNLFFBQVEsR0FBRyxVQUFDLElBQVcsRUFBQTs7SUFFbEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQVcsRUFBSyxFQUFBLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUEsRUFBQSxDQUFDLENBQUM7SUFDNUUsSUFBSSxvQkFBb0IsR0FBRyxLQUFLLENBQUM7SUFDakMsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDL0IsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFFL0IsSUFBQSxJQUFNLEVBQUUsR0FBRyxDQUFBLE1BQU0sS0FBTixJQUFBLElBQUEsTUFBTSxLQUFOLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLE1BQU0sQ0FBRSxLQUFLLEtBQUksR0FBRyxDQUFDO0lBQ2hDLElBQUksRUFBRSxFQUFFO0FBQ04sUUFBQSxJQUFJLEVBQUUsS0FBSyxHQUFHLEVBQUU7WUFDZCxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDM0Isa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQzFCLG9CQUFvQixHQUFHLElBQUksQ0FBQztTQUM3QjtBQUFNLGFBQUEsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFO1lBQ3JCLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMxQixrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDM0Isb0JBQW9CLEdBQUcsSUFBSSxDQUFDO1NBQzdCO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBSyxHQUFHLEVBQUU7WUFDckIsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQzNCLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMxQixvQkFBb0IsR0FBRyxLQUFLLENBQUM7U0FDOUI7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRTtZQUNyQixrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFDMUIsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQzNCLG9CQUFvQixHQUFHLEtBQUssQ0FBQztTQUM5QjtLQUNGO0lBQ0QsT0FBTyxFQUFDLG9CQUFvQixFQUFBLG9CQUFBLEVBQUUsa0JBQWtCLG9CQUFBLEVBQUUsa0JBQWtCLEVBQUEsa0JBQUEsRUFBQyxDQUFDO0FBQ3hFLEVBQUU7QUFFRjs7Ozs7QUFLRztBQUNVLElBQUEsZ0JBQWdCLEdBQUcsVUFBQyxXQUFrQixFQUFFLGdCQUFxQixFQUFBO0FBQXJCLElBQUEsSUFBQSxnQkFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsZ0JBQXFCLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFDeEUsSUFBQSxJQUFNLElBQUksR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkMsSUFBQSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckIsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ1gsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLElBQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzdELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzlCLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25DLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRXRDLElBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUE7QUFDakIsUUFBQSxJQUFBLEVBQXFDLEdBQUEsSUFBSSxDQUFDLEtBQUssQ0FBOUMsQ0FBQSxTQUFTLEdBQUEsRUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFFLFVBQVUsR0FBQSxFQUFBLENBQUEsVUFBQSxDQUFFLGNBQXdCO0FBQ3RELFFBQUEsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUM7WUFBRSxVQUFVLElBQUksQ0FBQyxDQUFDO0FBRTNDLFFBQUEsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQVUsRUFBQTtBQUM1QixZQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVSxFQUFBO2dCQUM5QixJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPO2dCQUMzQixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtvQkFDeEIsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDUCxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNQLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUMsb0JBQUEsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUk7d0JBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDekM7QUFDSCxhQUFDLENBQUMsQ0FBQztBQUNMLFNBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBQSxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBVyxFQUFBO0FBQzVCLFlBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsWUFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxZQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFBRSxPQUFPO1lBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO2dCQUN4QixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNQLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ1AsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLEdBQUcsR0FBR0EsVUFBRSxDQUFDLEtBQUssR0FBR0EsVUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRTdELGdCQUFBLElBQUksRUFBRSxLQUFLLFNBQVMsSUFBSSxFQUFFLEtBQUssU0FBUyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDOUQsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssR0FBRyxVQUFVLEVBQ3ZDLFFBQVEsRUFBRSxDQUFDO2lCQUNkO2dCQUVELElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUM3QixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUdLLGNBQU0sQ0FBQyxPQUFPLENBQUM7aUJBQ2pDO2FBQ0Y7QUFDSCxTQUFDLENBQUMsQ0FBQzs7QUFHSCxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0IsWUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDM0M7U0FDRjtBQUNILEtBQUMsQ0FBQyxDQUFDOztJQUdILElBQUksSUFBSSxFQUFFO0FBQ1IsUUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBVyxFQUFBO0FBQ2IsWUFBQSxJQUFBLEVBQXFDLEdBQUEsSUFBSSxDQUFDLEtBQUssQ0FBOUMsQ0FBQSxTQUFTLEdBQUEsRUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFFLFVBQVUsR0FBQSxFQUFBLENBQUEsVUFBQSxDQUFFLGNBQXdCO0FBQ3RELFlBQUEsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQUUsVUFBVSxJQUFJLENBQUMsQ0FBQztBQUMzQyxZQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFVLEVBQUE7QUFDNUIsZ0JBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFVLEVBQUE7b0JBQzlCLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsb0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO3dCQUM1QyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUdMLFVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDaEMsd0JBQUEsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUk7NEJBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDcEQ7QUFDSCxpQkFBQyxDQUFDLENBQUM7QUFDTCxhQUFDLENBQUMsQ0FBQztBQUVILFlBQUEsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVcsRUFBQTtBQUM1QixnQkFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7b0JBQzVDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBR0EsVUFBRSxDQUFDLEtBQUssQ0FBQztpQkFDakM7QUFDSCxhQUFDLENBQUMsQ0FBQztBQUVILFlBQUEsT0FBTyxJQUFJLENBQUM7QUFDZCxTQUFDLENBQUMsQ0FBQztLQUNKO0FBRUQsSUFBQSxJQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUNsRCxJQUFBLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFhLEVBQUE7QUFDaEMsUUFBQSxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RCLFFBQUEsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixRQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUE7WUFDbEIsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUFFLE9BQU87WUFDM0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7Z0JBQ3hCLElBQUksSUFBSSxTQUFBLENBQUM7Z0JBQ1QsUUFBUSxLQUFLO0FBQ1gsb0JBQUEsS0FBSyxJQUFJO0FBQ1Asd0JBQUEsSUFBSSxHQUFHSyxjQUFNLENBQUMsTUFBTSxDQUFDO3dCQUNyQixNQUFNO0FBQ1Isb0JBQUEsS0FBSyxJQUFJO0FBQ1Asd0JBQUEsSUFBSSxHQUFHQSxjQUFNLENBQUMsTUFBTSxDQUFDO3dCQUNyQixNQUFNO0FBQ1Isb0JBQUEsS0FBSyxJQUFJO0FBQ1Asd0JBQUEsSUFBSSxHQUFHQSxjQUFNLENBQUMsUUFBUSxDQUFDO3dCQUN2QixNQUFNO0FBQ1Isb0JBQUEsS0FBSyxJQUFJO0FBQ1Asd0JBQUEsSUFBSSxHQUFHQSxjQUFNLENBQUMsS0FBSyxDQUFDO3dCQUNwQixNQUFNO29CQUNSLFNBQVM7d0JBQ1AsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzVCO2lCQUNGO2dCQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDckI7QUFDSCxTQUFDLENBQUMsQ0FBQztBQUNMLEtBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0FBWUgsSUFBQSxPQUFPLEVBQUMsR0FBRyxFQUFBLEdBQUEsRUFBRSxjQUFjLEVBQUEsY0FBQSxFQUFFLE1BQU0sRUFBQSxNQUFBLEVBQUUsU0FBUyxFQUFBLFNBQUEsRUFBQyxDQUFDO0FBQ2xELEVBQUU7QUFFRjs7Ozs7QUFLRztBQUNVLElBQUEsUUFBUSxHQUFHLFVBQUMsSUFBVyxFQUFFLEtBQWEsRUFBQTtBQUNqRCxJQUFBLElBQUksQ0FBQyxJQUFJO1FBQUUsT0FBTztBQUNsQixJQUFBLElBQUksY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQVcsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUFDLENBQUM7S0FDdEU7QUFDRCxJQUFBLElBQUkseUJBQXlCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzdDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQ3hDLFVBQUMsQ0FBcUIsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUM3QyxDQUFDO0tBQ0g7QUFDRCxJQUFBLElBQUkseUJBQXlCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzdDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQ3hDLFVBQUMsQ0FBcUIsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUM3QyxDQUFDO0tBQ0g7QUFDRCxJQUFBLElBQUksY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQVcsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUFDLENBQUM7S0FDdEU7QUFDRCxJQUFBLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNuQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQVksSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUFDLENBQUM7S0FDeEU7QUFDRCxJQUFBLElBQUksZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBYSxJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQUMsQ0FBQztLQUMxRTtBQUNELElBQUEsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ2xDLFVBQUMsQ0FBZSxJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQ3ZDLENBQUM7S0FDSDtBQUNELElBQUEsT0FBTyxJQUFJLENBQUM7QUFDZCxFQUFFO0FBRUY7Ozs7O0FBS0c7QUFDVSxJQUFBLFNBQVMsR0FBRyxVQUFDLElBQVcsRUFBRSxLQUFhLEVBQUE7QUFDbEQsSUFBQSxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFXLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQ3hFO0FBQ0QsSUFBQSxJQUFJLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUMxQyxVQUFDLENBQXFCLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FDN0MsQ0FBQztLQUNIO0FBQ0QsSUFBQSxJQUFJLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUMxQyxVQUFDLENBQXFCLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FDN0MsQ0FBQztLQUNIO0FBQ0QsSUFBQSxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFXLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQ3hFO0FBQ0QsSUFBQSxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFZLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQzFFO0FBQ0QsSUFBQSxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQWEsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUFDLENBQUM7S0FDNUU7QUFDRCxJQUFBLElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUNwQyxVQUFDLENBQWUsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUN2QyxDQUFDO0tBQ0g7QUFDRCxJQUFBLE9BQU8sRUFBRSxDQUFDO0FBQ1osRUFBRTtBQUVLLElBQU0sT0FBTyxHQUFHLFVBQ3JCLElBQVcsRUFDWCxPQUErQixFQUMvQixPQUErQixFQUMvQixTQUFpQyxFQUNqQyxTQUFpQyxFQUFBO0FBRWpDLElBQUEsSUFBSSxRQUFRLENBQUM7SUFDYixJQUFNLE9BQU8sR0FBRyxVQUFDLElBQVcsRUFBQTtBQUMxQixRQUFBLElBQU0sT0FBTyxHQUFHTyxjQUFPLENBQ3JCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLEVBQUksRUFBQSxJQUFBLEVBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxRQUFRLEVBQUUsQ0FBQSxFQUFBLENBQUMsQ0FDMUQsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWixRQUFBLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLEtBQUMsQ0FBQztJQUVGLElBQU0sV0FBVyxHQUFHLFVBQUMsSUFBVyxFQUFBO1FBQzlCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUFFLE9BQU87QUFFL0IsUUFBQSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0IsUUFBQSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNyQixZQUFBLElBQUksT0FBTztnQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7QUFBTSxhQUFBLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlCLFlBQUEsSUFBSSxTQUFTO2dCQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQzthQUFNO0FBQ0wsWUFBQSxJQUFJLE9BQU87Z0JBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0FBQ0gsS0FBQyxDQUFDO0FBRUYsSUFBQSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN0QixRQUFBLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBUSxFQUFLLEVBQUEsT0FBQSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQWQsRUFBYyxDQUFDLENBQUM7QUFDdEUsUUFBQSxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQVEsRUFBSyxFQUFBLE9BQUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFkLEVBQWMsQ0FBQyxDQUFDO0FBQ3RFLFFBQUEsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFRLEVBQUssRUFBQSxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBaEIsRUFBZ0IsQ0FBQyxDQUFDO1FBRTFFLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFaEIsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDOUMsWUFBQSxRQUFRLEdBQUdJLGFBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMvQjthQUFNLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JELFlBQUEsUUFBUSxHQUFHQSxhQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDL0I7YUFBTSxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN6RCxZQUFBLFFBQVEsR0FBR0EsYUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2pDO0FBQU0sYUFBQSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM1QixZQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUM1QjthQUFNO0FBQ0wsWUFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDNUI7QUFDRCxRQUFBLElBQUksUUFBUTtZQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNyQztTQUFNO1FBQ0wsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CO0FBQ0QsSUFBQSxPQUFPLFFBQVEsQ0FBQztBQUNsQixFQUFFO0FBRVcsSUFBQSxnQkFBZ0IsR0FBRyxVQUFDLElBQVcsRUFBRSxnQkFBcUIsRUFBQTs7QUFBckIsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBcUIsR0FBQSxFQUFBLENBQUEsRUFBQTtJQUNqRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDbkIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUEsRUFBQSxHQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsS0FBSyxLQUFJLGdCQUFnQixDQUFDLENBQUMsRUFDakUsY0FBYyxDQUNmLENBQUM7QUFDRixJQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsRUFBRTtBQUVXLElBQUEsMkJBQTJCLEdBQUcsVUFDekMsSUFBOEIsRUFDOUIsZ0JBQStCLEVBQUE7QUFBL0IsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUF1QmhCLFVBQUUsQ0FBQyxLQUFLLENBQUEsRUFBQTtJQUUvQixJQUFJLElBQUksRUFBRTtBQUNSLFFBQUEsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUMsRUFBSSxFQUFBLE9BQUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFkLEVBQWMsQ0FBQyxDQUFDO1FBQ2xELElBQUksU0FBUyxFQUFFO0FBQ2IsWUFBQSxJQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQyxFQUFJLEVBQUEsT0FBQSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQWIsRUFBYSxDQUFDLENBQUM7QUFDMUQsWUFBQSxJQUFJLENBQUMsYUFBYTtBQUFFLGdCQUFBLE9BQU8sZ0JBQWdCLENBQUM7QUFDNUMsWUFBQSxPQUFPLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNwQztLQUNGOztBQUVELElBQUEsT0FBTyxnQkFBZ0IsQ0FBQztBQUMxQixFQUFFO0FBRVcsSUFBQSwwQkFBMEIsR0FBRyxVQUN4QyxHQUFXLEVBQ1gsZ0JBQStCLEVBQUE7QUFBL0IsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUF1QkEsVUFBRSxDQUFDLEtBQUssQ0FBQSxFQUFBO0FBRS9CLElBQUEsSUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsSUFBSSxTQUFTLENBQUMsSUFBSTtBQUNoQixRQUFBLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFaEUsSUFBQSxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLEVBQUU7QUFFVyxJQUFBLFlBQVksR0FBRyxVQUFDLElBQVcsRUFBRSxnQkFBK0IsRUFBQTs7QUFBL0IsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUF1QkEsVUFBRSxDQUFDLEtBQUssQ0FBQSxFQUFBO0FBQ3ZFLElBQUEsSUFBTSxRQUFRLEdBQUcsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsSUFBSSxDQUFDLEtBQUssTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxTQUFTLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsUUFBUSxRQUFRLGFBQVIsUUFBUSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFSLFFBQVEsQ0FBRSxLQUFLO0FBQ3JCLFFBQUEsS0FBSyxHQUFHO1lBQ04sT0FBT0EsVUFBRSxDQUFDLEtBQUssQ0FBQztBQUNsQixRQUFBLEtBQUssR0FBRztZQUNOLE9BQU9BLFVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDbEIsUUFBQTs7QUFFRSxZQUFBLE9BQU8sZ0JBQWdCLENBQUM7S0FDM0I7QUFDSDs7QUM3d0RBLElBQUEsS0FBQSxrQkFBQSxZQUFBO0FBSUUsSUFBQSxTQUFBLEtBQUEsQ0FDWSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULEVBQVUsRUFBQTtRQUhWLElBQUcsQ0FBQSxHQUFBLEdBQUgsR0FBRyxDQUEwQjtRQUM3QixJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsSUFBRSxDQUFBLEVBQUEsR0FBRixFQUFFLENBQVE7UUFQWixJQUFXLENBQUEsV0FBQSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUEsSUFBQSxHQUFHLENBQUMsQ0FBQztLQU9mO0FBQ0osSUFBQSxLQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO0FBQ0UsUUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3BCLENBQUE7SUFFRCxLQUFjLENBQUEsU0FBQSxDQUFBLGNBQUEsR0FBZCxVQUFlLEtBQWEsRUFBQTtBQUMxQixRQUFBLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0tBQzFCLENBQUE7SUFFRCxLQUFPLENBQUEsU0FBQSxDQUFBLE9BQUEsR0FBUCxVQUFRLElBQVksRUFBQTtBQUNsQixRQUFBLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCLENBQUE7SUFDSCxPQUFDLEtBQUEsQ0FBQTtBQUFELENBQUMsRUFBQSxDQUFBOztBQ25CRCxJQUFBLFVBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBZ0NTLGVBQUssQ0FBQSxVQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFDbkMsSUFBQSxTQUFBLFVBQUEsQ0FBWSxHQUE2QixFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBVSxFQUFBO1FBQ3pFLE9BQUEsTUFBSyxDQUFDLElBQUEsQ0FBQSxJQUFBLEVBQUEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUMsSUFBQSxDQUFBO0tBQ3RCO0FBRUQsSUFBQSxVQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQXFDLElBQUksRUFBeEMsR0FBRyxTQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsSUFBSSxVQUFBLEVBQUUsRUFBRSxRQUFBLEVBQUUsV0FBVyxpQkFBUSxDQUFDO1FBQ2hELElBQUksSUFBSSxJQUFJLENBQUM7WUFBRSxPQUFPO1FBQ3RCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5QyxRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDekIsUUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDWixZQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1NBQ3hCO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNwQixZQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1NBQ3hCO1FBQ0QsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2YsQ0FBQTtJQUNILE9BQUMsVUFBQSxDQUFBO0FBQUQsQ0F2QkEsQ0FBZ0MsS0FBSyxDQXVCcEMsQ0FBQTs7QUN2QkQsSUFBQSxVQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQWdDQSxlQUFLLENBQUEsVUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQ25DLElBQUEsU0FBQSxVQUFBLENBQ0UsR0FBNkIsRUFDN0IsQ0FBUyxFQUNULENBQVMsRUFDVCxFQUFVLEVBQ0YsR0FBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQUE7UUFFbkIsSUFBQSxLQUFBLEdBQUEsTUFBSyxDQUFDLElBQUEsQ0FBQSxJQUFBLEVBQUEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUMsSUFBQSxDQUFBO1FBSmIsS0FBRyxDQUFBLEdBQUEsR0FBSCxHQUFHLENBQVE7UUFDWCxLQUFNLENBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBSztRQUNYLEtBQU0sQ0FBQSxNQUFBLEdBQU4sTUFBTSxDQUFLOztLQUdwQjtBQUVELElBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUE2QyxJQUFJLEVBQWhELEdBQUcsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLEVBQUUsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFFLE1BQU0sR0FBQSxFQUFBLENBQUEsTUFBQSxFQUFFLE1BQU0sR0FBQSxFQUFBLENBQUEsTUFBQSxFQUFFLEdBQUcsR0FBQSxFQUFBLENBQUEsR0FBUSxDQUFDO1FBQ3hELElBQUksSUFBSSxJQUFJLENBQUM7WUFBRSxPQUFPO0FBQ3RCLFFBQUEsSUFBSSxHQUFHLENBQUM7QUFDUixRQUFBLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNaLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuQzthQUFNO1lBQ0wsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxHQUFHLEVBQUU7WUFDUCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDNUQ7S0FDRixDQUFBO0lBQ0gsT0FBQyxVQUFBLENBQUE7QUFBRCxDQTFCQSxDQUFnQyxLQUFLLENBMEJwQyxDQUFBOztBQ2JELElBQUEsYUFBQSxrQkFBQSxZQUFBO0FBQ0UsSUFBQSxTQUFBLGFBQUEsQ0FDVSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxRQUFrQixFQUNsQixRQUFrQixFQUNsQixLQUFzRCxFQUN0RCxZQUFxQixFQUFBO0FBRHJCLFFBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLEdBQTRCUCwwQkFBa0IsQ0FBQyxPQUFPLENBQUEsRUFBQTtRQVBoRSxJQVNJLEtBQUEsR0FBQSxJQUFBLENBQUE7UUFSTSxJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBMEI7UUFDN0IsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsSUFBUSxDQUFBLFFBQUEsR0FBUixRQUFRLENBQVU7UUFDbEIsSUFBUSxDQUFBLFFBQUEsR0FBUixRQUFRLENBQVU7UUFDbEIsSUFBSyxDQUFBLEtBQUEsR0FBTCxLQUFLLENBQWlEO1FBQ3RELElBQVksQ0FBQSxZQUFBLEdBQVosWUFBWSxDQUFTO0FBdUJ2QixRQUFBLElBQUEsQ0FBQSx3QkFBd0IsR0FBRyxZQUFBO1lBQzNCLElBQUEsRUFBQSxHQUFtRCxLQUFJLEVBQXRELEdBQUcsU0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLFFBQVEsR0FBQSxFQUFBLENBQUEsUUFBQSxFQUFFLFFBQVEsR0FBQSxFQUFBLENBQUEsUUFBQSxFQUFFLFlBQVksR0FBQSxFQUFBLENBQUEsWUFBUSxDQUFDO0FBQ3ZELFlBQUEsSUFBQSxLQUFLLEdBQUksUUFBUSxDQUFBLEtBQVosQ0FBYTtZQUV6QixJQUFJLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFeEQsWUFBQSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLGdCQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcscUJBQXFCLENBQUM7Z0JBQ3hDLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRSxnQkFBQSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNqQyxnQkFBQSxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3BELGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUN6QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1gsSUFBSSxZQUFZLEVBQUU7b0JBQ2hCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixvQkFBQSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2QyxvQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixvQkFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztvQkFDL0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUNkO0FBRUQsZ0JBQUEsSUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFFekIsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsR0FBRyxHQUFHLGNBQVcsQ0FBQztBQUN4QyxnQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUN4QixnQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUV6QixnQkFBQSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxjQUFXLENBQUM7Z0JBQ2xDLElBQU0sU0FBUyxHQUFHLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDeEQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUU5QixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUEsQ0FBQSxNQUFBLENBQUcsUUFBUSxHQUFHLEdBQUcsY0FBVyxDQUFDO0FBQ3hDLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQ3hCLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUN6QixHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4RTtpQkFBTTtnQkFDTCxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzthQUMzQjtBQUNILFNBQUMsQ0FBQztBQUVNLFFBQUEsSUFBQSxDQUFBLHdCQUF3QixHQUFHLFlBQUE7WUFDM0IsSUFBQSxFQUFBLEdBQXFDLEtBQUksRUFBeEMsR0FBRyxTQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsUUFBUSxjQUFBLEVBQUUsUUFBUSxjQUFRLENBQUM7QUFDekMsWUFBQSxJQUFBLEtBQUssR0FBSSxRQUFRLENBQUEsS0FBWixDQUFhO1lBRXpCLElBQUksTUFBTSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUV4RCxZQUFBLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtnQkFDYixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsZ0JBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsZ0JBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQztnQkFDeEMsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLGdCQUFBLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLGdCQUFBLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFDcEQsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUVYLGdCQUFBLElBQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBRXpCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBQSxDQUFBLE1BQUEsQ0FBRyxRQUFRLEdBQUcsR0FBRyxjQUFXLENBQUM7QUFDeEMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDeEIsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFFekIsZ0JBQUEsSUFBTSxPQUFPLEdBQ1gsUUFBUSxDQUFDLGFBQWEsS0FBSyxHQUFHO3NCQUMxQixRQUFRLENBQUMsT0FBTztBQUNsQixzQkFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztnQkFFM0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRW5FLGdCQUFBLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLGNBQVcsQ0FBQztnQkFDbEMsSUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELGdCQUFBLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUU3QyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUEsQ0FBQSxNQUFBLENBQUcsUUFBUSxHQUFHLEdBQUcsY0FBVyxDQUFDO0FBQ3hDLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQ3hCLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUN6QixHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUV2RSxnQkFBQSxJQUFNLE9BQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUM3QixHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBSyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7aUJBQU07Z0JBQ0wsS0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7YUFDM0I7QUFDSCxTQUFDLENBQUM7QUFFTSxRQUFBLElBQUEsQ0FBQSxrQkFBa0IsR0FBRyxZQUFBO1lBQ3JCLElBQUEsRUFBQSxHQUFxQyxLQUFJLEVBQXhDLEdBQUcsU0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLFFBQVEsY0FBQSxFQUFFLFFBQVEsY0FBUSxDQUFDO1lBQ2hELElBQU0sTUFBTSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxRCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdDLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDO1lBQ3hDLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRSxZQUFBLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLFlBQUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztBQUNyRCxZQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNYLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNmLFNBQUMsQ0FBQztLQTVIRTtBQUVKLElBQUEsYUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUE0QyxJQUFJLENBQS9DLENBQUEsR0FBRyxTQUFBLENBQUUsQ0FBQyxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsRUFBQSxDQUFBLENBQUEsTUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBRSxDQUFRLEVBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBVSxFQUFBLENBQUEsUUFBQSxDQUFBLEtBQUUsS0FBSyxHQUFBLEVBQUEsQ0FBQSxNQUFTO1FBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPO1FBRWxCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFFBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsUUFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLFFBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7O0FBR25CLFFBQUEsSUFBSSxLQUFLLEtBQUtBLDBCQUFrQixDQUFDLE9BQU8sRUFBRTtZQUN4QyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztTQUNqQztBQUFNLGFBQUEsSUFBSSxLQUFLLEtBQUtBLDBCQUFrQixDQUFDLE9BQU8sRUFBRTtZQUMvQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztTQUNqQztRQUVELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUF5R0gsT0FBQyxhQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUN0SkQsSUFBQSxNQUFBLGtCQUFBLFlBQUE7SUFLRSxTQUNZLE1BQUEsQ0FBQSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxFQUFVLEVBQ1YsR0FBeUIsRUFBQTtBQUF6QixRQUFBLElBQUEsR0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBeUIsR0FBQSxFQUFBLENBQUEsRUFBQTtRQUx6QixJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBMEI7UUFDN0IsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsSUFBRSxDQUFBLEVBQUEsR0FBRixFQUFFLENBQVE7UUFDVixJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBc0I7UUFWM0IsSUFBVyxDQUFBLFdBQUEsR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSyxDQUFBLEtBQUEsR0FBRyxFQUFFLENBQUM7UUFDWCxJQUFRLENBQUEsUUFBQSxHQUFhLEVBQUUsQ0FBQztLQVM5QjtBQUVKLElBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtBQUNFLFFBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQixDQUFBO0lBRUQsTUFBYyxDQUFBLFNBQUEsQ0FBQSxjQUFBLEdBQWQsVUFBZSxLQUFhLEVBQUE7QUFDMUIsUUFBQSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztLQUMxQixDQUFBO0lBRUQsTUFBUSxDQUFBLFNBQUEsQ0FBQSxRQUFBLEdBQVIsVUFBUyxLQUFhLEVBQUE7QUFDcEIsUUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQixDQUFBO0lBRUQsTUFBVyxDQUFBLFNBQUEsQ0FBQSxXQUFBLEdBQVgsVUFBWSxRQUFrQixFQUFBO0FBQzVCLFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7S0FDMUIsQ0FBQTtJQUNILE9BQUMsTUFBQSxDQUFBO0FBQUQsQ0FBQyxFQUFBLENBQUE7O0FDM0JELElBQUEsWUFBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFrQ08sZUFBTSxDQUFBLFlBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUF4QyxJQUFBLFNBQUEsWUFBQSxHQUFBOztLQXdCQztBQXZCQyxJQUFBLFlBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBeUMsSUFBSSxFQUE1QyxHQUFHLFNBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxFQUFFLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBRSxXQUFXLEdBQUEsRUFBQSxDQUFBLFdBQUEsRUFBRSxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQVEsQ0FBQztBQUNwRCxRQUFBLElBQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdkIsUUFBQSxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQzlCLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDMUI7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3BCLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDMUI7YUFBTTtBQUNMLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDbkI7QUFDRCxRQUFBLElBQUksS0FBSztBQUFFLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDbkMsUUFBQSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7QUFDWixZQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNkO1FBQ0QsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2YsQ0FBQTtJQUNILE9BQUMsWUFBQSxDQUFBO0FBQUQsQ0F4QkEsQ0FBa0MsTUFBTSxDQXdCdkMsQ0FBQTs7QUN4QkQsSUFBQSxXQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQWlDQSxlQUFNLENBQUEsV0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQXZDLElBQUEsU0FBQSxXQUFBLEdBQUE7O0tBeUJDO0FBeEJDLElBQUEsV0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUFrQyxJQUFJLEVBQXJDLEdBQUcsU0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLEVBQUUsUUFBQSxFQUFFLFdBQVcsaUJBQVEsQ0FBQztBQUM3QyxRQUFBLElBQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdkIsUUFBQSxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDWixZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQzFCO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNwQixZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQzFCO2FBQU07QUFDTCxZQUFBLElBQUksR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3RCO1FBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUMvQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUUvQixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2YsQ0FBQTtJQUNILE9BQUMsV0FBQSxDQUFBO0FBQUQsQ0F6QkEsQ0FBaUMsTUFBTSxDQXlCdEMsQ0FBQTs7QUN6QkQsSUFBQSxVQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQWdDQSxlQUFNLENBQUEsVUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQXRDLElBQUEsU0FBQSxVQUFBLEdBQUE7O0tBNkJDO0FBNUJDLElBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUF1QyxJQUFJLEVBQTFDLEdBQUcsU0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLEVBQUUsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFFLEdBQUcsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFFLFdBQVcsR0FBQSxFQUFBLENBQUEsV0FBUSxDQUFDO0FBQ2xELFFBQUEsSUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNyQixRQUFBLElBQUksUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7UUFDMUIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUU5QixRQUFBLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7U0FDeEI7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3BCLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7U0FDeEI7Ozs7UUFJRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQy9CLFlBQUEsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7U0FDdkI7YUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3RDLFlBQUEsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7U0FDdkI7YUFBTTtBQUNMLFlBQUEsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7U0FDdkI7QUFDRCxRQUFBLEdBQUcsQ0FBQyxJQUFJLEdBQUcsT0FBUSxDQUFBLE1BQUEsQ0FBQSxRQUFRLGNBQVcsQ0FBQztBQUN2QyxRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUEsR0FBRyxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7QUFDNUIsUUFBQSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUFDSCxPQUFDLFVBQUEsQ0FBQTtBQUFELENBN0JBLENBQWdDLE1BQU0sQ0E2QnJDLENBQUE7O0FDN0JELElBQUEsWUFBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFrQ0EsZUFBTSxDQUFBLFlBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUF4QyxJQUFBLFNBQUEsWUFBQSxHQUFBOztLQW9CQztBQW5CQyxJQUFBLFlBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBa0MsSUFBSSxFQUFyQyxHQUFHLFNBQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxFQUFFLFFBQUEsRUFBRSxXQUFXLGlCQUFRLENBQUM7UUFDN0MsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM5QixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDWixZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQzFCO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNwQixZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQzFCO2FBQU07QUFDTCxZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDbkI7QUFDRCxRQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUFDSCxPQUFDLFlBQUEsQ0FBQTtBQUFELENBcEJBLENBQWtDLE1BQU0sQ0FvQnZDLENBQUE7O0FDcEJELElBQUEsY0FBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFvQ0EsZUFBTSxDQUFBLGNBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUExQyxJQUFBLFNBQUEsY0FBQSxHQUFBOztLQXlCQztBQXhCQyxJQUFBLGNBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBa0MsSUFBSSxFQUFyQyxHQUFHLFNBQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxFQUFFLFFBQUEsRUFBRSxXQUFXLGlCQUFRLENBQUM7QUFDN0MsUUFBQSxJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFFBQUEsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN6QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFFbkUsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFBLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDMUI7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3BCLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDMUI7YUFBTTtBQUNMLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBQSxJQUFJLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztTQUNyQjtRQUNELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxjQUFBLENBQUE7QUFBRCxDQXpCQSxDQUFvQyxNQUFNLENBeUJ6QyxDQUFBOztBQ3pCRCxJQUFBLFVBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBZ0NBLGVBQU0sQ0FBQSxVQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFBdEMsSUFBQSxTQUFBLFVBQUEsR0FBQTs7S0FpQkM7QUFoQkMsSUFBQSxVQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQXlDLElBQUksQ0FBNUMsQ0FBQSxHQUFHLFNBQUEsQ0FBRSxDQUFBLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBRSxFQUFBLENBQUEsRUFBQSxDQUFBLEtBQUUsS0FBSyxHQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBRSxXQUFXLEdBQUEsRUFBQSxDQUFBLFlBQVM7QUFDcEQsUUFBQSxJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFFBQUEsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUN4QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM5QixRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDeEIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7UUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxVQUFBLENBQUE7QUFBRCxDQWpCQSxDQUFnQyxNQUFNLENBaUJyQyxDQUFBOztBQ2pCRCxJQUFBLGdCQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQXNDQSxlQUFNLENBQUEsZ0JBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUE1QyxJQUFBLFNBQUEsZ0JBQUEsR0FBQTs7S0EyQkM7QUExQkMsSUFBQSxnQkFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUF5QyxJQUFJLENBQTVDLENBQUEsR0FBRyxTQUFBLENBQUUsQ0FBQSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFFLENBQUUsRUFBQSxDQUFBLEVBQUEsQ0FBQSxLQUFFLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBLENBQUUsV0FBVyxHQUFBLEVBQUEsQ0FBQSxZQUFTO0FBQ3BELFFBQUEsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN2QixRQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDeEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdEIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7UUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFZCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN0QixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNaLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDWjtRQUNELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUFDSCxPQUFDLGdCQUFBLENBQUE7QUFBRCxDQTNCQSxDQUFzQyxNQUFNLENBMkIzQyxDQUFBOztBQzNCRCxJQUFBLGlCQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQXVDQSxlQUFNLENBQUEsaUJBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUE3QyxJQUFBLFNBQUEsaUJBQUEsR0FBQTs7S0F3QkM7QUF2QkMsSUFBQSxpQkFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUF5QyxJQUFJLEVBQTVDLEdBQUcsU0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLEVBQUUsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFFLFdBQVcsR0FBQSxFQUFBLENBQUEsV0FBQSxFQUFFLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBUSxDQUFDO0FBQ3BELFFBQUEsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDekIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFBLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLFFBQUEsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ1osWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztTQUN4QjtBQUFNLGFBQUEsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDcEIsWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztTQUN4QjthQUFNO0FBQ0wsWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztTQUNuQjtBQUNELFFBQUEsSUFBSSxLQUFLO0FBQUUsWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUNqQyxRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ1o7UUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxpQkFBQSxDQUFBO0FBQUQsQ0F4QkEsQ0FBdUMsTUFBTSxDQXdCNUMsQ0FBQTs7QUN4QkQsSUFBQSxlQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQXFDQSxlQUFNLENBQUEsZUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQTNDLElBQUEsU0FBQSxlQUFBLEdBQUE7O0tBZ0JDO0FBZkMsSUFBQSxlQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQWtDLElBQUksQ0FBckMsQ0FBQSxHQUFHLFNBQUEsQ0FBRSxDQUFBLENBQUMsT0FBQSxDQUFFLENBQUEsQ0FBQyxPQUFBLENBQUUsQ0FBQSxDQUFDLE9BQUEsQ0FBRSxDQUFBLEVBQUUsUUFBQSxDQUFFLGdCQUFvQjtRQUM3QyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO0FBQ3RCLFFBQUEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNuQixRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzFCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDekIsWUFBQSxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUNqQjtBQUNELFFBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2YsQ0FBQTtJQUNILE9BQUMsZUFBQSxDQUFBO0FBQUQsQ0FoQkEsQ0FBcUMsTUFBTSxDQWdCMUMsQ0FBQTs7QUNsQkQsSUFBQSxVQUFBLGtCQUFBLFlBQUE7SUFJRSxTQUNZLFVBQUEsQ0FBQSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULElBQVksRUFDWixFQUFVLEVBQUE7UUFKVixJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBMEI7UUFDN0IsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUksQ0FBQSxJQUFBLEdBQUosSUFBSSxDQUFRO1FBQ1osSUFBRSxDQUFBLEVBQUEsR0FBRixFQUFFLENBQVE7UUFSWixJQUFXLENBQUEsV0FBQSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFLLENBQUEsS0FBQSxHQUFHLEVBQUUsQ0FBQztLQVFqQjtBQUVKLElBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtBQUNFLFFBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQixDQUFBO0lBQ0gsT0FBQyxVQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUNaRCxJQUFNLE1BQU0sR0FBRyw4U0FFUixDQUFDO0FBRVIsSUFBQSxTQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQStCQSxlQUFVLENBQUEsU0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0lBVXZDLFNBQ1ksU0FBQSxDQUFBLEdBQTZCLEVBQzdCLENBQVMsRUFDVCxDQUFTLEVBQ1QsSUFBWSxFQUNaLEVBQVUsRUFBQTtBQUVwQixRQUFBLElBQUEsS0FBQSxHQUFBLE1BQUssQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBQyxJQUFBLENBQUE7UUFOakIsS0FBRyxDQUFBLEdBQUEsR0FBSCxHQUFHLENBQTBCO1FBQzdCLEtBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsS0FBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxLQUFJLENBQUEsSUFBQSxHQUFKLElBQUksQ0FBUTtRQUNaLEtBQUUsQ0FBQSxFQUFBLEdBQUYsRUFBRSxDQUFRO0FBZGQsUUFBQSxLQUFBLENBQUEsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDbEIsS0FBSyxDQUFBLEtBQUEsR0FBRyxDQUFDLENBQUM7UUFDVixLQUFjLENBQUEsY0FBQSxHQUFHLEdBQUcsQ0FBQztRQUNyQixLQUFlLENBQUEsZUFBQSxHQUFHLEdBQUcsQ0FBQztRQUN0QixLQUFZLENBQUEsWUFBQSxHQUFHLEdBQUcsQ0FBQztBQUNuQixRQUFBLEtBQUEsQ0FBQSxTQUFTLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRTlCLEtBQVcsQ0FBQSxXQUFBLEdBQUcsS0FBSyxDQUFDO0FBb0I1QixRQUFBLEtBQUEsQ0FBQSxJQUFJLEdBQUcsWUFBQTtBQUNMLFlBQUEsSUFBSSxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUN0QixPQUFPO2FBQ1I7WUFFSyxJQUFBLEVBQUEsR0FBMEQsS0FBSSxFQUE3RCxHQUFHLFNBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxJQUFJLEdBQUEsRUFBQSxDQUFBLElBQUEsRUFBRSxHQUFHLEdBQUEsRUFBQSxDQUFBLEdBQUEsRUFBRSxjQUFjLEdBQUEsRUFBQSxDQUFBLGNBQUEsRUFBRSxlQUFlLEdBQUEsRUFBQSxDQUFBLGVBQVEsQ0FBQztBQUVyRSxZQUFBLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUU5QixZQUFBLElBQUksQ0FBQyxLQUFJLENBQUMsU0FBUyxFQUFFO0FBQ25CLGdCQUFBLEtBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO2FBQ3RCO0FBRUQsWUFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RCxZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQztZQUM3QixHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsWUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUVwQixZQUFBLElBQU0sT0FBTyxHQUFHLEdBQUcsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDO0FBRXJDLFlBQUEsSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUU7QUFDckIsZ0JBQUEsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkQsZ0JBQUEsSUFBSSxPQUFPLElBQUksY0FBYyxFQUFFO0FBQzdCLG9CQUFBLEtBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2Ysb0JBQUEsVUFBVSxDQUFDLFlBQUE7QUFDVCx3QkFBQSxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4Qix3QkFBQSxLQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQyxxQkFBQyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDdkI7YUFDRjtpQkFBTTtBQUNMLGdCQUFBLElBQU0sV0FBVyxHQUFHLEdBQUcsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3pDLGdCQUFBLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxHQUFHLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1RCxnQkFBQSxJQUFJLFdBQVcsSUFBSSxlQUFlLEVBQUU7QUFDbEMsb0JBQUEsS0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixvQkFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdEQsT0FBTztpQkFDUjthQUNGO0FBRUQsWUFBQSxxQkFBcUIsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsU0FBQyxDQUFDOztBQWhEQSxRQUFnQixJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLGVBQWUsRUFBQyxFQUFFO1FBRTVELElBQU0sVUFBVSxHQUFHLDRCQUE2QixDQUFBLE1BQUEsQ0FBQVEsZUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFFLENBQUM7QUFFakUsUUFBQSxLQUFJLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDdkIsUUFBQSxLQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUM7O0tBQzNCO0lBMkNILE9BQUMsU0FBQSxDQUFBO0FBQUQsQ0FyRUEsQ0FBK0IsVUFBVSxDQXFFeEMsQ0FBQTs7QUMzQkQsSUFBTSxNQUFNLEdBRVIsRUFBRSxDQUFDO0FBRVAsU0FBUyxjQUFjLEdBQUE7SUFDckIsT0FBTywrREFBK0QsQ0FBQyxJQUFJLENBQ3pFLFNBQVMsQ0FBQyxTQUFTLENBQ3BCLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsSUFBYyxFQUFFLElBQWdCLEVBQUE7SUFDL0MsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsSUFBQSxJQUFNLFdBQVcsR0FBRyxZQUFBO0FBQ2xCLFFBQUEsTUFBTSxFQUFFLENBQUM7QUFDVCxRQUFBLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDMUIsWUFBQSxJQUFJLEVBQUUsQ0FBQztTQUNSO0FBQ0gsS0FBQyxDQUFDO0FBQ0YsSUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQzlCLFlBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxZQUFBO0FBQ3ZCLGdCQUFBLFdBQVcsRUFBRSxDQUFDO0FBQ2hCLGFBQUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsWUFBQTtBQUN4QixnQkFBQSxXQUFXLEVBQUUsQ0FBQztBQUNoQixhQUFDLENBQUM7U0FDSDtLQUNGO0FBQ0gsQ0FBQztBQUVELElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNkO0FBQ0EsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDakMsSUFBQSxHQUFHLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixJQUFJLEdBQUcsQ0FBQztBQUN2QyxDQUFDO0FBRUQsSUFBQSxRQUFBLGtCQUFBLFlBQUE7QUE4REUsSUFBQSxTQUFBLFFBQUEsQ0FBWSxPQUFtQyxFQUFBOztBQUFuQyxRQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBbUMsR0FBQSxFQUFBLENBQUEsRUFBQTtRQUEvQyxJQWtKQyxLQUFBLEdBQUEsSUFBQSxDQUFBO0FBL01ELFFBQUEsSUFBQSxDQUFBLGNBQWMsR0FBb0I7QUFDaEMsWUFBQSxTQUFTLEVBQUUsRUFBRTtBQUNiLFlBQUEsY0FBYyxFQUFFLEtBQUs7QUFDckIsWUFBQSxPQUFPLEVBQUUsRUFBRTtBQUNYLFlBQUEsTUFBTSxFQUFFLENBQUM7QUFDVCxZQUFBLFdBQVcsRUFBRSxLQUFLO0FBQ2xCLFlBQUEsVUFBVSxFQUFFLElBQUk7WUFDaEIsS0FBSyxFQUFFaEIsYUFBSyxDQUFDLGFBQWE7WUFDMUIsa0JBQWtCLEVBQUVDLDBCQUFrQixDQUFDLE9BQU87QUFDOUMsWUFBQSxVQUFVLEVBQUUsS0FBSztBQUNqQixZQUFBLFlBQVksRUFBRSxLQUFLO0FBQ25CLFlBQUEsaUJBQWlCLEVBQUUsSUFBSTtBQUN2QixZQUFBLGtCQUFrQixFQUFFLENBQUM7QUFDckIsWUFBQSxjQUFjLEVBQUUsQ0FBQztBQUNqQixZQUFBLGVBQWUsRUFBRSxHQUFHO0FBQ3BCLFlBQUEsbUJBQW1CLEVBQUUsU0FBUztBQUM5QixZQUFBLGlCQUFpQixFQUFFLFNBQVM7QUFDNUIsWUFBQSxpQkFBaUIsRUFBRSxTQUFTO0FBQzVCLFlBQUEsZ0JBQWdCLEVBQUUsU0FBUztBQUMzQixZQUFBLGdCQUFnQixFQUFFLFNBQVM7QUFDM0IsWUFBQSxnQkFBZ0IsRUFBRSxTQUFTO0FBQzNCLFlBQUEsY0FBYyxFQUFFLGVBQWU7QUFDL0IsWUFBQSxTQUFTLEVBQUUsS0FBSztBQUNoQixZQUFBLGdCQUFnQixFQUFFLElBQUk7QUFDdEIsWUFBQSxRQUFRLEVBQUUsQ0FBQztBQUNYLFlBQUEscUJBQXFCLEVBQUUsQ0FBQztTQUN6QixDQUFDO0FBV00sUUFBQSxJQUFBLENBQUEsTUFBTSxHQUFXSSxjQUFNLENBQUMsSUFBSSxDQUFDO1FBQzdCLElBQVcsQ0FBQSxXQUFBLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLElBQVcsQ0FBQSxXQUFBLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFFBQUEsSUFBQSxDQUFBLGVBQWUsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBRzVDLFFBQUEsSUFBQSxDQUFBLFdBQVcsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ3ZDLFFBQUEsSUFBQSxDQUFBLGlCQUFpQixHQUFhLElBQUksUUFBUSxFQUFFLENBQUM7QUFnU3BELFFBQUEsSUFBQSxDQUFBLG1CQUFtQixHQUFHLFVBQUMsUUFBa0IsRUFBRSxPQUFXLEVBQUE7O0FBQVgsWUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQVcsR0FBQSxDQUFBLENBQUEsRUFBQTs7QUFFN0MsWUFBQSxJQUFBLE9BQU8sR0FBSSxLQUFJLENBQUMsT0FBTyxRQUFoQixDQUFpQjtBQUN4QixZQUFBLElBQUEsS0FBSyxHQUFJLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxNQUE5QixDQUErQjtBQUMzQyxZQUFBLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9ELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO1lBQ2hFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUMxRSxZQUFBLElBQU0sRUFBRSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDdkIsWUFBQSxJQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQU0sYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzQyxJQUFNLENBQUMsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN0RCxZQUFBLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDM0IsWUFBQSxLQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUUvQyxZQUFBLElBQUksQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxLQUFJLENBQUMsY0FBYywwQ0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFLLENBQUMsRUFBRTtnQkFDbkQsS0FBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsZ0JBQUEsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNsQyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xCLE9BQU87YUFDUjs7Ozs7O0FBT0QsWUFBQSxLQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNyQixZQUFBLEtBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6QyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFFbEIsWUFBQSxJQUFJLGNBQWMsRUFBRTtnQkFBRSxLQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDekMsU0FBQyxDQUFDO1FBRU0sSUFBVyxDQUFBLFdBQUEsR0FBRyxVQUFDLENBQWEsRUFBQTtBQUNsQyxZQUFBLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsWUFBQSxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRXBCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQixZQUFBLElBQU0sS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDN0QsWUFBQSxLQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEMsU0FBQyxDQUFDO1FBRU0sSUFBYyxDQUFBLGNBQUEsR0FBRyxVQUFDLENBQWEsRUFBQTtBQUNyQyxZQUFBLElBQUksS0FBSyxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDM0IsWUFBQSxJQUFNLE1BQU0sR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDO0FBQ2pDLFlBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxnQkFBQSxPQUFPLEtBQUssQ0FBQztBQUMxQixZQUFBLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzVDLFlBQUEsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQztBQUNqQyxZQUFBLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FDbEIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUN0QyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQ3RDLENBQUM7QUFDRixZQUFBLE9BQU8sS0FBSyxDQUFDO0FBQ2YsU0FBQyxDQUFDO1FBRU0sSUFBWSxDQUFBLFlBQUEsR0FBRyxVQUFDLENBQWEsRUFBQTtBQUNuQyxZQUFBLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsWUFBQSxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRXBCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQixZQUFBLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsWUFBQSxLQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztBQUM3QixZQUFBLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxTQUFDLENBQUM7UUFFTSxJQUFXLENBQUEsV0FBQSxHQUFHLFVBQUMsQ0FBYSxFQUFBO0FBQ2xDLFlBQUEsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQztBQUNqQyxZQUFBLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU87WUFFcEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLFlBQUEsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDZixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsWUFBQSxJQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVE7QUFDckQsZ0JBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUNyRDtBQUNBLGdCQUFBLE1BQU0sR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO2FBQzdDO0FBQ0QsWUFBQSxLQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLFNBQUMsQ0FBQztBQUVNLFFBQUEsSUFBQSxDQUFBLFVBQVUsR0FBRyxZQUFBO0FBQ25CLFlBQUEsS0FBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDM0IsU0FBQyxDQUFDO0FBZ0RGLFFBQUEsSUFBQSxDQUFBLFVBQVUsR0FBRyxZQUFBO0FBQ0osWUFBQSxJQUFBLFdBQVcsR0FBSSxLQUFJLENBQUEsV0FBUixDQUFTO0FBQ3BCLFlBQUEsSUFBQSxTQUFTLEdBQUksS0FBSSxDQUFDLE9BQU8sVUFBaEIsQ0FBaUI7WUFFakMsSUFDRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDO2lCQUM5RCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQ2hFO2dCQUNBLE9BQU9ILGNBQU0sQ0FBQyxNQUFNLENBQUM7YUFDdEI7WUFFRCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzNCLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQUUsT0FBT0EsY0FBTSxDQUFDLE9BQU8sQ0FBQztxQkFDOUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUM7b0JBQUUsT0FBT0EsY0FBTSxDQUFDLFVBQVUsQ0FBQzs7b0JBQ2xFLE9BQU9BLGNBQU0sQ0FBQyxJQUFJLENBQUM7YUFDekI7QUFBTSxpQkFBQSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQyxFQUFFO2dCQUM5QyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUFFLE9BQU9BLGNBQU0sQ0FBQyxRQUFRLENBQUM7cUJBQy9DLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDO29CQUFFLE9BQU9BLGNBQU0sQ0FBQyxXQUFXLENBQUM7O29CQUNuRSxPQUFPQSxjQUFNLENBQUMsS0FBSyxDQUFDO2FBQzFCO2lCQUFNO2dCQUNMLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQUUsT0FBT0EsY0FBTSxDQUFDLEdBQUcsQ0FBQztxQkFDMUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUM7b0JBQUUsT0FBT0EsY0FBTSxDQUFDLE1BQU0sQ0FBQzs7b0JBQzlELE9BQU9BLGNBQU0sQ0FBQyxNQUFNLENBQUM7YUFDM0I7QUFDSCxTQUFDLENBQUM7QUFzTEYsUUFBQSxJQUFBLENBQUEsY0FBYyxHQUFHLFlBQUE7QUFDZixZQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixZQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFlBQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEMsS0FBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDekIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDN0IsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsVUFBVSxHQUFHLFlBQUE7WUFDWCxJQUFJLENBQUMsS0FBSSxDQUFDLEtBQUs7Z0JBQUUsT0FBTztZQUN4QixJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxnQkFBQSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRW5DLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6RCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDZjtBQUNILFNBQUMsQ0FBQztRQUVGLElBQVcsQ0FBQSxXQUFBLEdBQUcsVUFBQyxNQUFvQixFQUFBO0FBQXBCLFlBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFBLEdBQVMsS0FBSSxDQUFDLE1BQU0sQ0FBQSxFQUFBO0FBQ2pDLFlBQUEsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUNwQixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLElBQUksR0FBRyxFQUFFO2dCQUNQLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLGdCQUFBLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQyxnQkFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2pELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNmO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsaUJBQWlCLEdBQUcsWUFBQTtZQUNsQixJQUFJLENBQUMsS0FBSSxDQUFDLFlBQVk7Z0JBQUUsT0FBTztZQUMvQixJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxnQkFBQSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3ZFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNmO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsaUJBQWlCLEdBQUcsWUFBQTtZQUNsQixJQUFJLENBQUMsS0FBSSxDQUFDLFlBQVk7Z0JBQUUsT0FBTztBQUMvQixZQUFhLEtBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNwQyxJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxnQkFBQSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3ZFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNmO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsbUJBQW1CLEdBQUcsWUFBQTtZQUNwQixJQUFJLENBQUMsS0FBSSxDQUFDLGNBQWM7Z0JBQUUsT0FBTztZQUNqQyxJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxnQkFBQSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsQ0FDWCxDQUFDLEVBQ0QsQ0FBQyxFQUNELEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUN6QixLQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FDM0IsQ0FBQztnQkFDRixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDZjtBQUNILFNBQUMsQ0FBQztRQUVGLElBQVksQ0FBQSxZQUFBLEdBQUcsVUFBQyxRQUF3QixFQUFBO0FBQXhCLFlBQUEsSUFBQSxRQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLEdBQVcsS0FBSSxDQUFDLFFBQVEsQ0FBQSxFQUFBO0FBQ3RDLFlBQUEsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQztZQUM3QixJQUFBLEVBQUEsR0FLRixLQUFJLENBQUMsT0FBTyxFQUpkLEVBQTJCLEdBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUEzQixLQUFLLEdBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFHRixhQUFLLENBQUMsYUFBYSxHQUFBLEVBQUEsQ0FBQSxDQUMzQixrQkFBa0IsR0FBQSxFQUFBLENBQUEsa0JBQUEsQ0FBQSxDQUNsQixTQUFTLEdBQUEsRUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUNhLEVBQUEsQ0FBQSx1QkFDUDtZQUNYLElBQUEsRUFBQSxHQUFnQixLQUFJLEVBQW5CLEdBQUcsU0FBQSxFQUFFLE1BQU0sWUFBUSxDQUFDO0FBQzNCLFlBQUEsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVE7Z0JBQUUsT0FBTztZQUNqQyxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLFlBQUEsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTztZQUNqQixLQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUNwQixZQUFBLElBQUEsUUFBUSxHQUFJLFFBQVEsQ0FBQSxRQUFaLENBQWE7QUFFNUIsWUFBQSxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsRUFBQTtBQUMxQixnQkFBQSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTTtvQkFBRSxPQUFPO2dCQUM5QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7Ozs7O2dCQU10QyxJQUFJLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztBQUNsQyxnQkFBQSxJQUFNLFlBQVksR0FBRyxZQUFZLENBQy9CLENBQUMsQ0FBQyxJQUFJLEVBQ04sQ0FBQyxFQUNELGlCQUFpQixHQUFHLEtBQUssQ0FBQyxFQUFFLENBQzdCLENBQUM7Z0JBQ0UsSUFBQSxFQUFBLEdBQWUsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFoQyxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBSyxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQXlCLENBQUM7Z0JBQ3pDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQUUsT0FBTztnQkFDdEIsSUFBQSxFQUFBLEdBQXlCLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFsRCxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxhQUFhLEdBQUEsRUFBQSxDQUFBLGFBQThCLENBQUM7QUFDMUQsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsYUFBYSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDcEMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsYUFBYSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3BDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDbkIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsZ0JBQUEsSUFDRSxLQUFLLEtBQUtBLGFBQUssQ0FBQyxPQUFPO29CQUN2QixLQUFLLEtBQUtBLGFBQUssQ0FBQyxhQUFhO0FBQzdCLG9CQUFBLEtBQUssS0FBS0EsYUFBSyxDQUFDLElBQUksRUFDcEI7QUFDQSxvQkFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixvQkFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixvQkFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUN6QixvQkFBQSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztpQkFDcEI7cUJBQU07QUFDTCxvQkFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixvQkFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixvQkFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUN6QixvQkFBQSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztpQkFDcEI7QUFFRCxnQkFBQSxJQUFJLFlBQVksQ0FBQztBQUNqQixnQkFBQSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNJLGNBQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUM5QyxvQkFBQSxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztpQkFDL0M7QUFFRCxnQkFBQSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNBLGNBQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUM5QyxvQkFBQSxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztpQkFDL0M7QUFFRCxnQkFBQSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNBLGNBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUM3QyxvQkFBQSxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDOUM7Z0JBRUQsSUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFhLENBQzdCLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxFQUNELEtBQUssR0FBRyxLQUFLLEVBQ2IsUUFBUSxFQUNSLENBQUMsRUFDRCxrQkFBa0IsRUFDbEIsWUFBWSxDQUNiLENBQUM7Z0JBQ0YsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQixhQUFDLENBQUMsQ0FBQztBQUNMLFNBQUMsQ0FBQztRQUVGLElBQVUsQ0FBQSxVQUFBLEdBQUcsVUFDWCxHQUFjLEVBQ2QsTUFBb0IsRUFDcEIsWUFBZ0MsRUFDaEMsS0FBWSxFQUFBO0FBSFosWUFBQSxJQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEdBQUEsR0FBTSxLQUFJLENBQUMsR0FBRyxDQUFBLEVBQUE7QUFDZCxZQUFBLElBQUEsTUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsTUFBQSxHQUFTLEtBQUksQ0FBQyxNQUFNLENBQUEsRUFBQTtBQUNwQixZQUFBLElBQUEsWUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsWUFBQSxHQUFlLEtBQUksQ0FBQyxZQUFZLENBQUEsRUFBQTtBQUNoQyxZQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBWSxHQUFBLElBQUEsQ0FBQSxFQUFBO1lBRVosSUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDO1lBQzVCLElBQUksTUFBTSxFQUFFO0FBQ1YsZ0JBQUEsSUFBSSxLQUFLO0FBQUUsb0JBQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3Q0FDM0IsQ0FBQyxFQUFBOzRDQUNDLENBQUMsRUFBQTt3QkFDUixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsd0JBQUEsTUFBTSxLQUFOLElBQUEsSUFBQSxNQUFNLEtBQU4sS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQSxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUE7NEJBQzlCLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO2dDQUM1QixJQUFBLEVBQUEsR0FBeUIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEVBQWxELEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGFBQWEsR0FBQSxFQUFBLENBQUEsYUFBOEIsQ0FBQztBQUMxRCxnQ0FBQSxJQUFNLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNwQyxnQ0FBQSxJQUFNLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQ0FDcEMsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLGdDQUFBLElBQUksUUFBTSxDQUFDO2dDQUNYLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBRXBDLElBQUksR0FBRyxFQUFFO29DQUNQLFFBQVEsS0FBSztBQUNYLHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxNQUFNLEVBQUU7QUFDbEIsNENBQUEsUUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0Q0FDaEQsTUFBTTt5Q0FDUDtBQUNELHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxPQUFPLEVBQUU7QUFDbkIsNENBQUEsUUFBTSxHQUFHLElBQUksaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzRDQUNyRCxNQUFNO3lDQUNQO3dDQUNELEtBQUtBLGNBQU0sQ0FBQyxrQkFBa0IsQ0FBQzt3Q0FDL0IsS0FBS0EsY0FBTSxDQUFDLHdCQUF3QixDQUFDO3dDQUNyQyxLQUFLQSxjQUFNLENBQUMsd0JBQXdCLENBQUM7d0NBQ3JDLEtBQUtBLGNBQU0sQ0FBQyxrQkFBa0IsQ0FBQzt3Q0FDL0IsS0FBS0EsY0FBTSxDQUFDLHdCQUF3QixDQUFDO3dDQUNyQyxLQUFLQSxjQUFNLENBQUMsd0JBQXdCLENBQUM7d0NBQ3JDLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLHVCQUF1QixDQUFDO3dDQUNwQyxLQUFLQSxjQUFNLENBQUMsdUJBQXVCLENBQUM7d0NBQ3BDLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLHVCQUF1QixDQUFDO3dDQUNwQyxLQUFLQSxjQUFNLENBQUMsdUJBQXVCLENBQUM7d0NBQ3BDLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLHVCQUF1QixDQUFDO0FBQ3BDLHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyx1QkFBdUIsRUFBRTtBQUMvQiw0Q0FBQSxJQUFBLEVBQW9CLEdBQUEsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUEvQyxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxRQUFRLGNBQWdDLENBQUM7QUFFckQsNENBQUEsUUFBTSxHQUFHLElBQUksZ0JBQWdCLENBQzNCLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxFQUNELEtBQUssRUFDTCxFQUFFLEVBQ0ZBLGNBQU0sQ0FBQyxNQUFNLENBQ2QsQ0FBQztBQUNGLDRDQUFBLFFBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsNENBQUEsUUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0Q0FDN0IsTUFBTTt5Q0FDUDt3Q0FDRCxLQUFLQSxjQUFNLENBQUMsWUFBWSxDQUFDO3dDQUN6QixLQUFLQSxjQUFNLENBQUMsa0JBQWtCLENBQUM7d0NBQy9CLEtBQUtBLGNBQU0sQ0FBQyxrQkFBa0IsQ0FBQzt3Q0FDL0IsS0FBS0EsY0FBTSxDQUFDLFlBQVksQ0FBQzt3Q0FDekIsS0FBS0EsY0FBTSxDQUFDLGtCQUFrQixDQUFDO3dDQUMvQixLQUFLQSxjQUFNLENBQUMsa0JBQWtCLENBQUM7d0NBQy9CLEtBQUtBLGNBQU0sQ0FBQyxXQUFXLENBQUM7d0NBQ3hCLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLGlCQUFpQixDQUFDO3dDQUM5QixLQUFLQSxjQUFNLENBQUMsV0FBVyxDQUFDO3dDQUN4QixLQUFLQSxjQUFNLENBQUMsaUJBQWlCLENBQUM7d0NBQzlCLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLFdBQVcsQ0FBQzt3Q0FDeEIsS0FBS0EsY0FBTSxDQUFDLGlCQUFpQixDQUFDO3dDQUM5QixLQUFLQSxjQUFNLENBQUMsaUJBQWlCLENBQUM7QUFDOUIsd0NBQUEsS0FBS0EsY0FBTSxDQUFDLElBQUksRUFBRTtBQUNaLDRDQUFBLElBQUEsRUFBb0IsR0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQS9DLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLFFBQVEsY0FBZ0MsQ0FBQztBQUNyRCw0Q0FBQSxRQUFNLEdBQUcsSUFBSSxVQUFVLENBQ3JCLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxFQUNELEtBQUssRUFDTCxFQUFFLEVBQ0ZBLGNBQU0sQ0FBQyxNQUFNLENBQ2QsQ0FBQztBQUNGLDRDQUFBLFFBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsNENBQUEsUUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0Q0FDN0IsTUFBTTt5Q0FDUDtBQUNELHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxNQUFNLEVBQUU7QUFDbEIsNENBQUEsUUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0Q0FDaEQsTUFBTTt5Q0FDUDtBQUNELHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxRQUFRLEVBQUU7QUFDcEIsNENBQUEsUUFBTSxHQUFHLElBQUksY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0Q0FDbEQsTUFBTTt5Q0FDUDtBQUNELHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxLQUFLLEVBQUU7QUFDakIsNENBQUEsUUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0Q0FDL0MsTUFBTTt5Q0FDUDtBQUNELHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxTQUFTLEVBQUU7QUFDckIsNENBQUEsUUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0Q0FDbkQsTUFBTTt5Q0FDUDt3Q0FDRCxTQUFTO0FBQ1AsNENBQUEsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO0FBQ2hCLGdEQUFBLFFBQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOzZDQUN0RDs0Q0FDRCxNQUFNO3lDQUNQO3FDQUNGO0FBQ0Qsb0NBQUEsUUFBTSxhQUFOLFFBQU0sS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBTixRQUFNLENBQUUsSUFBSSxFQUFFLENBQUM7aUNBQ2hCOzZCQUNGO0FBQ0gseUJBQUMsQ0FBQyxDQUFDOztBQXpHTCxvQkFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQTtnQ0FBaEMsQ0FBQyxDQUFBLENBQUE7QUEwR1QscUJBQUE7O0FBM0dILGdCQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFBOzRCQUE3QixDQUFDLENBQUEsQ0FBQTtBQTRHVCxpQkFBQTthQUNGO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsU0FBUyxHQUFHLFVBQUMsS0FBa0IsRUFBRSxLQUFZLEVBQUE7QUFBaEMsWUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsR0FBUSxLQUFJLENBQUMsS0FBSyxDQUFBLEVBQUE7QUFBRSxZQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBWSxHQUFBLElBQUEsQ0FBQSxFQUFBO0FBQzNDLFlBQUEsSUFBSSxLQUFLO0FBQUUsZ0JBQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxZQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEIsWUFBQSxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLFlBQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QixZQUFBLElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQzNCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN2QjtBQUNILFNBQUMsQ0FBQztRQUVGLElBQU8sQ0FBQSxPQUFBLEdBQUcsVUFBQyxLQUFrQixFQUFBO0FBQWxCLFlBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLEdBQVEsS0FBSSxDQUFDLEtBQUssQ0FBQSxFQUFBO0FBQ3JCLFlBQUEsSUFBQSxFQUFtQyxHQUFBLEtBQUksQ0FBQyxPQUFPLEVBQTlDLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGNBQWMsR0FBQSxFQUFBLENBQUEsY0FBQSxFQUFFLE9BQU8sYUFBZ0IsQ0FBQztZQUN0RCxJQUFJLEtBQUssRUFBRTtBQUNULGdCQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDakMsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxHQUFHLEVBQUU7QUFDUCxvQkFBQSxJQUFJLEtBQUssS0FBS0osYUFBSyxDQUFDLGFBQWEsRUFBRTtBQUNqQyx3QkFBQSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztBQUM5Qyx3QkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzt3QkFDMUIsR0FBRyxDQUFDLFFBQVEsQ0FDVixDQUFDLE9BQU8sRUFDUixDQUFDLE9BQU8sRUFDUixLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sRUFDckIsS0FBSyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQ3ZCLENBQUM7cUJBQ0g7QUFBTSx5QkFBQSxJQUFJLEtBQUssS0FBS0EsYUFBSyxDQUFDLElBQUksRUFBRTt3QkFDL0IsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO3dCQUNqRCxHQUFHLENBQUMsUUFBUSxDQUNWLENBQUMsT0FBTyxFQUNSLENBQUMsT0FBTyxFQUNSLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxFQUNyQixLQUFLLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FDdkIsQ0FBQztxQkFDSDtBQUFNLHlCQUFBLElBQ0wsS0FBSyxLQUFLQSxhQUFLLENBQUMsTUFBTTt3QkFDdEIsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQ3pDO3dCQUNBLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQ25ELHdCQUFBLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDbEMsSUFBSSxRQUFRLEVBQUU7NEJBQ1osR0FBRyxDQUFDLFNBQVMsQ0FDWCxRQUFRLEVBQ1IsQ0FBQyxPQUFPLEVBQ1IsQ0FBQyxPQUFPLEVBQ1IsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLEVBQ3JCLEtBQUssQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUN2QixDQUFDO3lCQUNIO3FCQUNGO3lCQUFNO3dCQUNMLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQ25ELHdCQUFBLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxLQUFLLEVBQUU7NEJBQ1QsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7NEJBQ25ELElBQUksT0FBTyxFQUFFO0FBQ1gsZ0NBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDeEIsZ0NBQUEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzZCQUMvQzt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO0FBQ0gsU0FBQyxDQUFDO1FBRUYsSUFBYSxDQUFBLGFBQUEsR0FBRyxVQUFDLEtBQWtCLEVBQUE7QUFBbEIsWUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsR0FBUSxLQUFJLENBQUMsS0FBSyxDQUFBLEVBQUE7QUFDakMsWUFBQSxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPO1lBQ2IsSUFBQSxFQUFBLEdBQXlCLEtBQUksRUFBNUIsV0FBVyxpQkFBQSxFQUFFLE9BQU8sYUFBUSxDQUFDO0FBRWxDLFlBQUEsSUFBQSxJQUFJLEdBTUYsT0FBTyxDQUFBLElBTkwsRUFDSixTQUFTLEdBS1AsT0FBTyxDQUxBLFNBQUEsRUFDVCxjQUFjLEdBSVosT0FBTyxDQUFBLGNBSkssRUFDZCxrQkFBa0IsR0FHaEIsT0FBTyxDQUhTLGtCQUFBLEVBQ2xCLGVBQWUsR0FFYixPQUFPLENBQUEsZUFGTSxFQUNmLGlCQUFpQixHQUNmLE9BQU8sa0JBRFEsQ0FDUDtZQUNaLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsSUFBSSxHQUFHLEVBQUU7Z0JBQ0QsSUFBQSxFQUFBLEdBQXlCLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFsRCxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxhQUFhLEdBQUEsRUFBQSxDQUFBLGFBQThCLENBQUM7QUFFMUQsZ0JBQUEsSUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLGVBQWUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBRXZELGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUUxQixJQUFJLGFBQWEsR0FBRyxpQkFBaUI7QUFDbkMsc0JBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLO3NCQUNuQixrQkFBa0IsQ0FBQzs7OztBQU12QixnQkFBQSxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxjQUFjLENBQUM7Ozs7O2dCQU96RSxLQUFLLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUMzRCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsb0JBQUEsSUFDRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDbkMseUJBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFDNUQ7QUFDQSx3QkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztxQkFDL0I7eUJBQU07QUFDTCx3QkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztxQkFDM0I7QUFDRCxvQkFBQSxJQUNFLGNBQWMsRUFBRTtBQUNoQix3QkFBQSxDQUFDLEtBQUssS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQzVCLEtBQUksQ0FBQyxXQUFXLEVBQ2hCO3dCQUNBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7cUJBQ25DO29CQUNELElBQUksV0FBVyxHQUNiLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDO0FBQzVCLDBCQUFFLGFBQWEsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLGFBQWEsR0FBRyxDQUFDO0FBQy9ELDBCQUFFLGFBQWEsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUNoRCxJQUFJLGNBQWMsRUFBRSxFQUFFO0FBQ3BCLHdCQUFBLFdBQVcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO3FCQUN4QjtvQkFDRCxJQUFJLFNBQVMsR0FDWCxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQztBQUM1QiwwQkFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsR0FBRyxhQUFhLEdBQUcsQ0FBQztBQUMvRCwwQkFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztvQkFDaEQsSUFBSSxjQUFjLEVBQUUsRUFBRTtBQUNwQix3QkFBQSxTQUFTLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztxQkFDdEI7b0JBQ0QsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFBRSxXQUFXLElBQUksV0FBVyxDQUFDO29CQUN0RCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQzt3QkFBRSxTQUFTLElBQUksV0FBVyxDQUFDO29CQUNoRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO29CQUNuRCxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUNqRCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2Q7O2dCQUdELEtBQUssSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzNELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixvQkFBQSxJQUNFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNuQyx5QkFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUM1RDtBQUNBLHdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO3FCQUMvQjt5QkFBTTtBQUNMLHdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO3FCQUMzQjtBQUNELG9CQUFBLElBQ0UsY0FBYyxFQUFFO0FBQ2hCLHdCQUFBLENBQUMsS0FBSyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsS0FBSSxDQUFDLFdBQVcsRUFDaEI7d0JBQ0EsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztxQkFDbkM7b0JBQ0QsSUFBSSxXQUFXLEdBQ2IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUM7QUFDNUIsMEJBQUUsYUFBYSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxHQUFHLENBQUM7QUFDL0QsMEJBQUUsYUFBYSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7b0JBQ2hELElBQUksU0FBUyxHQUNYLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDO0FBQzVCLDBCQUFFLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxHQUFHLGFBQWEsR0FBRyxDQUFDO0FBQy9ELDBCQUFFLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO29CQUNoRCxJQUFJLGNBQWMsRUFBRSxFQUFFO0FBQ3BCLHdCQUFBLFdBQVcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO3FCQUN4QjtvQkFDRCxJQUFJLGNBQWMsRUFBRSxFQUFFO0FBQ3BCLHdCQUFBLFNBQVMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO3FCQUN0QjtvQkFFRCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUFFLFdBQVcsSUFBSSxXQUFXLENBQUM7b0JBQ3RELElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDO3dCQUFFLFNBQVMsSUFBSSxXQUFXLENBQUM7b0JBQ2hFLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDLENBQUM7b0JBQ2pELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDZDthQUNGO0FBQ0gsU0FBQyxDQUFDO1FBRUYsSUFBUyxDQUFBLFNBQUEsR0FBRyxVQUFDLEtBQWtCLEVBQUE7QUFBbEIsWUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsR0FBUSxLQUFJLENBQUMsS0FBSyxDQUFBLEVBQUE7QUFDN0IsWUFBQSxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPO0FBQ25CLFlBQUEsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFO2dCQUFFLE9BQU87WUFFdEMsSUFBQSxFQUFBLEdBQWdELEtBQUksQ0FBQyxPQUFPLEVBQWpELGVBQWUsR0FBQSxFQUFBLENBQUEsUUFBQSxFQUFFLGdCQUFnQixHQUFBLEVBQUEsQ0FBQSxnQkFBZ0IsQ0FBQztBQUVqRSxZQUFBLElBQU0sV0FBVyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUM7WUFDckMsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQyxZQUFBLElBQUksUUFBUSxHQUFHLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLGVBQWUsQ0FBQzs7OztZQUl6RSxJQUFJLEdBQUcsRUFBRTtnQkFDRCxJQUFBLEVBQUEsR0FBeUIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEVBQWxELE9BQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGVBQWEsR0FBQSxFQUFBLENBQUEsYUFBOEIsQ0FBQzs7Z0JBRTFELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDYixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxFQUFBO29CQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxFQUFBO3dCQUNsQixJQUNFLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLDRCQUFBLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLDRCQUFBLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN0QixDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN0Qjs0QkFDQSxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7NEJBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQ0wsQ0FBQyxHQUFHLE9BQUssR0FBRyxlQUFhLEVBQ3pCLENBQUMsR0FBRyxPQUFLLEdBQUcsZUFBYSxFQUN6QixRQUFRLEVBQ1IsQ0FBQyxFQUNELENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUNYLElBQUksQ0FDTCxDQUFDO0FBQ0YsNEJBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7NEJBQ3hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt5QkFDWjtBQUNILHFCQUFDLENBQUMsQ0FBQztBQUNMLGlCQUFDLENBQUMsQ0FBQzthQUNKO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsY0FBYyxHQUFHLFlBQUE7WUFDVCxJQUFBLEVBQUEsR0FBZ0MsS0FBSSxFQUFuQyxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxPQUFPLEdBQUEsRUFBQSxDQUFBLE9BQUEsRUFBRSxXQUFXLEdBQUEsRUFBQSxDQUFBLFdBQVEsQ0FBQztBQUMzQyxZQUFBLElBQUksQ0FBQyxLQUFLO2dCQUFFLE9BQU87QUFDWixZQUFBLElBQUEsU0FBUyxHQUFvQyxPQUFPLFVBQTNDLENBQUUsQ0FBa0MsT0FBTyxDQUFBLElBQXJDLE1BQUUsT0FBTyxHQUFxQixPQUFPLENBQTVCLE9BQUEsQ0FBQSxDQUFFLGVBQWUsR0FBSSxPQUFPLGlCQUFDO0FBQzVELFlBQUEsSUFBSSxlQUFlLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEUsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFBLEVBQUEsR0FBeUIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEVBQWxELEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGFBQWEsR0FBQSxFQUFBLENBQUEsYUFBOEIsQ0FBQztZQUMxRCxJQUFJLEdBQUcsRUFBRTtBQUNQLGdCQUFBLEdBQUcsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO0FBQzVCLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUMxQixHQUFHLENBQUMsSUFBSSxHQUFHLE9BQUEsQ0FBQSxNQUFBLENBQVEsS0FBSyxHQUFHLENBQUMsaUJBQWMsQ0FBQztBQUUzQyxnQkFBQSxJQUFNLFFBQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDakMsZ0JBQUEsSUFBSSxRQUFNLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUV6QixnQkFBQSxJQUNFLFFBQU0sS0FBS0UsY0FBTSxDQUFDLE1BQU07QUFDeEIsb0JBQUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ3ZCLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQyxFQUNuQztBQUNBLG9CQUFBLFFBQU0sSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO2lCQUM3QjtBQUVELGdCQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFBO0FBQzFCLG9CQUFBLElBQU0sQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDO29CQUN4QyxJQUFJLFNBQVMsR0FBRyxRQUFNLENBQUM7b0JBQ3ZCLElBQUksWUFBWSxHQUFHLFFBQU0sQ0FBQztBQUMxQixvQkFBQSxJQUNFLFFBQU0sS0FBS0EsY0FBTSxDQUFDLE9BQU87d0JBQ3pCLFFBQU0sS0FBS0EsY0FBTSxDQUFDLFFBQVE7QUFDMUIsd0JBQUEsUUFBTSxLQUFLQSxjQUFNLENBQUMsR0FBRyxFQUNyQjtBQUNBLHdCQUFBLFNBQVMsSUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDO3FCQUN0QztBQUNELG9CQUFBLElBQ0UsUUFBTSxLQUFLQSxjQUFNLENBQUMsVUFBVTt3QkFDNUIsUUFBTSxLQUFLQSxjQUFNLENBQUMsV0FBVztBQUM3Qix3QkFBQSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxNQUFNLEVBQ3hCO3dCQUNBLFlBQVksSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLElBQUksQ0FBQyxDQUFDO3FCQUMvQztBQUNELG9CQUFBLElBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztvQkFDekQsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLGVBQWUsR0FBRyxLQUFLLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztvQkFDekQsSUFBSSxLQUFLLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDNUQsd0JBQUEsSUFDRSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxVQUFVOzRCQUM1QixRQUFNLEtBQUtBLGNBQU0sQ0FBQyxXQUFXO0FBQzdCLDRCQUFBLFFBQU0sS0FBS0EsY0FBTSxDQUFDLE1BQU0sRUFDeEI7NEJBQ0EsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3lCQUN4QjtBQUVELHdCQUFBLElBQ0UsUUFBTSxLQUFLQSxjQUFNLENBQUMsT0FBTzs0QkFDekIsUUFBTSxLQUFLQSxjQUFNLENBQUMsUUFBUTtBQUMxQiw0QkFBQSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxHQUFHLEVBQ3JCOzRCQUNBLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzt5QkFDeEI7cUJBQ0Y7QUFDSCxpQkFBQyxDQUFDLENBQUM7QUFFSCxnQkFBQSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFTLEVBQUUsS0FBSyxFQUFBO0FBQ2pFLG9CQUFBLElBQU0sQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDO29CQUN4QyxJQUFJLFVBQVUsR0FBRyxRQUFNLENBQUM7b0JBQ3hCLElBQUksV0FBVyxHQUFHLFFBQU0sQ0FBQztBQUN6QixvQkFBQSxJQUNFLFFBQU0sS0FBS0EsY0FBTSxDQUFDLE9BQU87d0JBQ3pCLFFBQU0sS0FBS0EsY0FBTSxDQUFDLFVBQVU7QUFDNUIsd0JBQUEsUUFBTSxLQUFLQSxjQUFNLENBQUMsSUFBSSxFQUN0QjtBQUNBLHdCQUFBLFVBQVUsSUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDO3FCQUN2QztBQUNELG9CQUFBLElBQ0UsUUFBTSxLQUFLQSxjQUFNLENBQUMsUUFBUTt3QkFDMUIsUUFBTSxLQUFLQSxjQUFNLENBQUMsV0FBVztBQUM3Qix3QkFBQSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxLQUFLLEVBQ3ZCO3dCQUNBLFdBQVcsSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLElBQUksQ0FBQyxDQUFDO3FCQUM5QztBQUNELG9CQUFBLElBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLFVBQVUsQ0FBQztvQkFDMUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLGVBQWUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztvQkFDeEQsSUFBSSxLQUFLLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDNUQsd0JBQUEsSUFDRSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxRQUFROzRCQUMxQixRQUFNLEtBQUtBLGNBQU0sQ0FBQyxXQUFXO0FBQzdCLDRCQUFBLFFBQU0sS0FBS0EsY0FBTSxDQUFDLEtBQUssRUFDdkI7QUFDQSw0QkFBQSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ25DO0FBQ0Qsd0JBQUEsSUFDRSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxPQUFPOzRCQUN6QixRQUFNLEtBQUtBLGNBQU0sQ0FBQyxVQUFVO0FBQzVCLDRCQUFBLFFBQU0sS0FBS0EsY0FBTSxDQUFDLElBQUksRUFDdEI7QUFDQSw0QkFBQSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ25DO3FCQUNGO0FBQ0gsaUJBQUMsQ0FBQyxDQUFDO2FBQ0o7QUFDSCxTQUFDLENBQUM7UUFFRixJQUFtQixDQUFBLG1CQUFBLEdBQUcsVUFBQyxNQUFvQixFQUFBO0FBQXBCLFlBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFBLEdBQVMsS0FBSSxDQUFDLE1BQU0sQ0FBQSxFQUFBO1lBQ3pDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztZQUN0QixJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLE1BQU0sRUFBRTtBQUNKLGdCQUFBLElBQUEsS0FBOEMsS0FBSSxDQUFDLE9BQU8sRUFBekQsT0FBTyxHQUFBLEVBQUEsQ0FBQSxPQUFBLEVBQUUsU0FBUyxHQUFBLEVBQUEsQ0FBQSxTQUFBLEVBQUUsZUFBZSxHQUFBLEVBQUEsQ0FBQSxlQUFBLEVBQUUsSUFBSSxVQUFnQixDQUFDO0FBQzFELGdCQUFBLElBQUEsV0FBVyxHQUFJLEtBQUksQ0FBQSxXQUFSLENBQVM7Z0JBRTNCLElBQ0UsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQztxQkFDOUQsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUNoRTtvQkFDQSxpQkFBaUIsR0FBRyxlQUFlLENBQUM7aUJBQ3JDO2dCQUNELElBQ0UsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQztxQkFDOUQsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUNoRTtBQUNBLG9CQUFBLGlCQUFpQixHQUFHLGVBQWUsR0FBRyxDQUFDLENBQUM7aUJBQ3pDO0FBRUQsZ0JBQUEsSUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLFNBQVMsR0FBRyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7O0FBRWpFLGdCQUFBLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFELGdCQUFBLGFBQWEsR0FBRyxPQUFPLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUNyQztZQUNELE9BQU8sRUFBQyxLQUFLLEVBQUEsS0FBQSxFQUFFLGFBQWEsZUFBQSxFQUFFLGlCQUFpQixFQUFBLGlCQUFBLEVBQUMsQ0FBQztBQUNuRCxTQUFDLENBQUM7QUFFRixRQUFBLElBQUEsQ0FBQSxVQUFVLEdBQUcsVUFBQyxHQUFjLEVBQUUsU0FBMEIsRUFBRSxLQUFZLEVBQUE7QUFBeEQsWUFBQSxJQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEdBQUEsR0FBTSxLQUFJLENBQUMsR0FBRyxDQUFBLEVBQUE7QUFBRSxZQUFBLElBQUEsU0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsU0FBQSxHQUFZLEtBQUksQ0FBQyxTQUFTLENBQUEsRUFBQTtBQUFFLFlBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFZLEdBQUEsSUFBQSxDQUFBLEVBQUE7QUFDcEUsWUFBQSxJQUFNLE1BQU0sR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDO1lBRWpDLElBQUksTUFBTSxFQUFFO0FBQ1YsZ0JBQUEsSUFBSSxLQUFLO0FBQUUsb0JBQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxnQkFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxvQkFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDNUMsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixJQUFBLEVBQUEsR0FBeUIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEVBQWxELEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGFBQWEsR0FBQSxFQUFBLENBQUEsYUFBOEIsQ0FBQztBQUMxRCx3QkFBQSxJQUFNLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNwQyx3QkFBQSxJQUFNLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQzt3QkFDcEMsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixJQUFJLE1BQU0sU0FBQSxDQUFDO3dCQUNYLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRXBDLElBQUksR0FBRyxFQUFFOzRCQUNQLFFBQVEsS0FBSztBQUNYLGdDQUFBLEtBQUtDLGNBQU0sQ0FBQyxHQUFHLEVBQUU7QUFDZixvQ0FBQSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29DQUM3QyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ2QsTUFBTTtpQ0FDUDs2QkFDRjs0QkFDRCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUdBLGNBQU0sQ0FBQyxJQUFJLENBQUM7eUJBQy9CO3FCQUNGO2lCQUNGO0FBQ00sZ0JBQUEsSUFBQSxTQUFTLEdBQUksS0FBSSxDQUFDLE9BQU8sVUFBaEIsQ0FBaUI7QUFDakMsZ0JBQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xEO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsVUFBVSxHQUFHLFlBQUE7O0FBQ1gsWUFBQSxJQUFNLE1BQU0sR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDO1lBQ2pDLElBQUksTUFBTSxFQUFFO2dCQUNWLEtBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3pCLGdCQUFBLElBQUksS0FBSSxDQUFDLE1BQU0sS0FBS0UsY0FBTSxDQUFDLElBQUk7b0JBQUUsT0FBTztBQUN4QyxnQkFBQSxJQUFJLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVc7b0JBQUUsT0FBTztBQUUzQyxnQkFBQSxJQUFBLE9BQU8sR0FBSSxLQUFJLENBQUMsT0FBTyxRQUFoQixDQUFpQjtnQkFDL0IsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixnQkFBQSxJQUFBLEtBQUssR0FBSSxLQUFJLENBQUMsbUJBQW1CLEVBQUUsTUFBOUIsQ0FBK0I7Z0JBQ3JDLElBQUEsRUFBQSxHQUFxQyxLQUFJLEVBQXhDLFdBQVcsR0FBQSxFQUFBLENBQUEsV0FBQSxFQUFFLE1BQU0sR0FBQSxFQUFBLENBQUEsTUFBQSxFQUFFLFdBQVcsR0FBQSxFQUFBLENBQUEsV0FBUSxDQUFDO0FBRTFDLGdCQUFBLElBQUEsRUFBQSxHQUFBVixZQUFBLENBQWEsS0FBSSxDQUFDLGNBQWMsRUFBQSxDQUFBLENBQUEsRUFBL0IsR0FBRyxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBRSxHQUFHLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBdUIsQ0FBQztBQUN2QyxnQkFBQSxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUUsT0FBTztBQUMvRCxnQkFBQSxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUUsT0FBTztnQkFDL0QsSUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDNUMsSUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUM1QyxnQkFBQSxJQUFNLEVBQUUsR0FBRyxDQUFBLE1BQUEsQ0FBQSxFQUFBLEdBQUEsS0FBSSxDQUFDLEdBQUcsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRyxHQUFHLENBQUMsMENBQUcsR0FBRyxDQUFDLEtBQUlJLFVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBRTlDLElBQUksR0FBRyxFQUFFO29CQUNQLElBQUksR0FBRyxTQUFBLENBQUM7QUFDUixvQkFBQSxJQUFNLElBQUksR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLG9CQUFBLElBQUksTUFBTSxLQUFLTSxjQUFNLENBQUMsTUFBTSxFQUFFO0FBQzVCLHdCQUFBLEdBQUcsR0FBRyxJQUFJLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDN0Msd0JBQUEsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDekI7QUFBTSx5QkFBQSxJQUFJLE1BQU0sS0FBS0EsY0FBTSxDQUFDLE1BQU0sRUFBRTtBQUNuQyx3QkFBQSxHQUFHLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLHdCQUFBLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3pCO0FBQU0seUJBQUEsSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxRQUFRLEVBQUU7QUFDckMsd0JBQUEsR0FBRyxHQUFHLElBQUksY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvQyx3QkFBQSxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN6QjtBQUFNLHlCQUFBLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsS0FBSyxFQUFFO0FBQ2xDLHdCQUFBLEdBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDNUMsd0JBQUEsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDekI7QUFBTSx5QkFBQSxJQUFJLE1BQU0sS0FBS0EsY0FBTSxDQUFDLElBQUksRUFBRTtBQUNqQyx3QkFBQSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN4RCx3QkFBQSxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN6QjtBQUFNLHlCQUFBLElBQUksRUFBRSxLQUFLTixVQUFFLENBQUMsS0FBSyxJQUFJLE1BQU0sS0FBS00sY0FBTSxDQUFDLFVBQVUsRUFBRTtBQUMxRCx3QkFBQSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUVOLFVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyx3QkFBQSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xCLHdCQUFBLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3pCO0FBQU0seUJBQUEsSUFBSSxFQUFFLEtBQUtBLFVBQUUsQ0FBQyxLQUFLLElBQUksTUFBTSxLQUFLTSxjQUFNLENBQUMsVUFBVSxFQUFFO0FBQzFELHdCQUFBLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRU4sVUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLHdCQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsd0JBQUEsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDekI7QUFBTSx5QkFBQSxJQUFJLE1BQU0sS0FBS00sY0FBTSxDQUFDLEtBQUssRUFBRTtBQUNsQyx3QkFBQSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUVOLFVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyx3QkFBQSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNuQjtBQUNELG9CQUFBLEdBQUcsYUFBSCxHQUFHLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUgsR0FBRyxDQUFFLElBQUksRUFBRSxDQUFDO2lCQUNiO2FBQ0Y7QUFDSCxTQUFDLENBQUM7QUFFRixRQUFBLElBQUEsQ0FBQSxVQUFVLEdBQUcsVUFDWCxHQUEwQixFQUMxQixNQUFvQixFQUNwQixLQUFZLEVBQUE7QUFGWixZQUFBLElBQUEsR0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBQSxHQUFrQixLQUFJLENBQUMsR0FBRyxDQUFBLEVBQUE7QUFDMUIsWUFBQSxJQUFBLE1BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE1BQUEsR0FBUyxLQUFJLENBQUMsTUFBTSxDQUFBLEVBQUE7QUFDcEIsWUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVksR0FBQSxJQUFBLENBQUEsRUFBQTtBQUVOLFlBQUEsSUFBQSxLQUFnRCxLQUFJLENBQUMsT0FBTyxFQUEzRCxhQUEyQixFQUEzQixLQUFLLEdBQUcsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBQyxhQUFLLENBQUMsYUFBYSxHQUFBLEVBQUEsRUFBRSxjQUFjLG9CQUFnQixDQUFDO0FBQ25FLFlBQUEsSUFBSSxLQUFLO2dCQUFFLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM5QixJQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLG9CQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUN0QyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsd0JBQUEsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFOzRCQUNmLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ3BDLElBQUksR0FBRyxFQUFFO2dDQUNELElBQUEsRUFBQSxHQUF5QixLQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBbEQsS0FBSyxHQUFBLEVBQUEsQ0FBQSxLQUFBLEVBQUUsYUFBYSxHQUFBLEVBQUEsQ0FBQSxhQUE4QixDQUFDO0FBQzFELGdDQUFBLElBQU0sQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3BDLGdDQUFBLElBQU0sQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dDQUNwQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7Z0NBQ25CLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLGdDQUFBLElBQ0UsS0FBSyxLQUFLQSxhQUFLLENBQUMsT0FBTztvQ0FDdkIsS0FBSyxLQUFLQSxhQUFLLENBQUMsYUFBYTtBQUM3QixvQ0FBQSxLQUFLLEtBQUtBLGFBQUssQ0FBQyxJQUFJLEVBQ3BCO0FBQ0Esb0NBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsb0NBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsb0NBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDekIsb0NBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7aUNBQ3BCO3FDQUFNO0FBQ0wsb0NBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsb0NBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsb0NBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7aUNBQ3BCO2dDQUNELElBQUksS0FBSyxTQUFBLENBQUM7Z0NBQ1YsUUFBUSxLQUFLO29DQUNYLEtBQUtBLGFBQUssQ0FBQyxhQUFhLENBQUM7QUFDekIsb0NBQUEsS0FBS0EsYUFBSyxDQUFDLElBQUksRUFBRTtBQUNmLHdDQUFBLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3Q0FDekMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dDQUNqQyxNQUFNO3FDQUNQO29DQUNELFNBQVM7d0NBQ1AsSUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQzdDLFVBQUEsQ0FBQyxFQUFBLEVBQUksT0FBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUEsRUFBQSxDQUNmLENBQUM7d0NBQ0YsSUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQzdDLFVBQUEsQ0FBQyxFQUFBLEVBQUksT0FBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUEsRUFBQSxDQUNmLENBQUM7QUFDRix3Q0FBQSxJQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2Qix3Q0FBQSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7d0NBQzlELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztxQ0FDbEM7aUNBQ0Y7Z0NBQ0QsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dDQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs2QkFDZjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO0FBQ0gsU0FBQyxDQUFDO1FBbDJDQSxJQUFJLENBQUMsT0FBTyxHQUNQaUIsY0FBQSxDQUFBQSxjQUFBLENBQUEsRUFBQSxFQUFBLElBQUksQ0FBQyxjQUFjLENBQUEsRUFDbkIsT0FBTyxDQUNYLENBQUM7QUFDRixRQUFBLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDckMsUUFBQSxJQUFJLENBQUMsSUFBSSxHQUFHbEIsVUFBRSxDQUFDLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFFBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7QUFDaEMsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHO0FBQ2pCLFlBQUEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNiLFlBQUEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNkLENBQUM7QUFFRixRQUFBLElBQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckMsUUFBQSxJQUFNLHFCQUFxQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBRXJDLFFBQUEsSUFBSSxDQUFDLGdCQUFnQixJQUFBLEVBQUEsR0FBQSxFQUFBO1lBQ25CLEVBQUMsQ0FBQUssY0FBTSxDQUFDLFlBQVksQ0FBRyxHQUFBO0FBQ3JCLGdCQUFBLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQjtBQUNyQyxnQkFBQSxRQUFRLEVBQUUsRUFBRTtBQUNiLGFBQUE7WUFDRCxFQUFDLENBQUFBLGNBQU0sQ0FBQyxZQUFZLENBQUcsR0FBQTtBQUNyQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsV0FBVyxDQUFHLEdBQUE7QUFDcEIsZ0JBQUEsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCO0FBQ3BDLGdCQUFBLFFBQVEsRUFBRSxFQUFFO0FBQ2IsYUFBQTtZQUNELEVBQUMsQ0FBQUEsY0FBTSxDQUFDLFdBQVcsQ0FBRyxHQUFBO0FBQ3BCLGdCQUFBLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtBQUNwQyxnQkFBQSxRQUFRLEVBQUUsRUFBRTtBQUNiLGFBQUE7WUFDRCxFQUFDLENBQUFBLGNBQU0sQ0FBQyxXQUFXLENBQUcsR0FBQTtBQUNwQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtBQUNqQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtBQUNqQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtBQUNqQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtBQUNqQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO2VBQ0YsQ0FBQztLQUNIO0lBRUQsUUFBTyxDQUFBLFNBQUEsQ0FBQSxPQUFBLEdBQVAsVUFBUSxJQUFRLEVBQUE7QUFDZCxRQUFBLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCLENBQUE7SUFFRCxRQUFZLENBQUEsU0FBQSxDQUFBLFlBQUEsR0FBWixVQUFhLElBQVksRUFBQTtBQUN2QixRQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQ3pELENBQUE7QUFFRCxJQUFBLFFBQUEsQ0FBQSxTQUFBLENBQUEsTUFBTSxHQUFOLFlBQUE7UUFDRSxJQUNFLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDWixDQUFDLElBQUksQ0FBQyxZQUFZO1lBQ2xCLENBQUMsSUFBSSxDQUFDLEdBQUc7WUFDVCxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ1gsQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUNsQixDQUFDLElBQUksQ0FBQyxjQUFjO1lBQ3BCLENBQUMsSUFBSSxDQUFDLFlBQVk7WUFFbEIsT0FBTztBQUVULFFBQUEsSUFBTSxRQUFRLEdBQUc7QUFDZixZQUFBLElBQUksQ0FBQyxLQUFLO0FBQ1YsWUFBQSxJQUFJLENBQUMsTUFBTTtBQUNYLFlBQUEsSUFBSSxDQUFDLFlBQVk7QUFDakIsWUFBQSxJQUFJLENBQUMsWUFBWTtBQUNqQixZQUFBLElBQUksQ0FBQyxjQUFjO0FBQ25CLFlBQUEsSUFBSSxDQUFDLFlBQVk7U0FDbEIsQ0FBQztBQUVLLFFBQUEsSUFBQSxJQUFJLEdBQUksSUFBSSxDQUFDLE9BQU8sS0FBaEIsQ0FBaUI7QUFDckIsUUFBQSxJQUFBLFdBQVcsR0FBSSxJQUFJLENBQUMsR0FBRyxZQUFaLENBQWE7QUFFL0IsUUFBQSxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxFQUFBO1lBQ3JCLElBQUksSUFBSSxFQUFFO0FBQ1IsZ0JBQUEsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQzFCLGdCQUFBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQzthQUM1QjtpQkFBTTtnQkFDTCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN6QyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQy9DO0FBQ0gsU0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZixDQUFBO0FBRU8sSUFBQSxRQUFBLENBQUEsU0FBQSxDQUFBLFlBQVksR0FBcEIsVUFBcUIsRUFBVSxFQUFFLGFBQW9CLEVBQUE7QUFBcEIsUUFBQSxJQUFBLGFBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLGFBQW9CLEdBQUEsSUFBQSxDQUFBLEVBQUE7UUFDbkQsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoRCxRQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUNuQyxRQUFBLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUNsQixZQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztTQUNyQztBQUNELFFBQUEsT0FBTyxNQUFNLENBQUM7S0FDZixDQUFBO0lBRUQsUUFBSSxDQUFBLFNBQUEsQ0FBQSxJQUFBLEdBQUosVUFBSyxHQUFnQixFQUFBO1FBQXJCLElBOEJDLEtBQUEsR0FBQSxJQUFBLENBQUE7QUE3QkMsUUFBQSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFFaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFFaEUsUUFBQSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixRQUFBLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFFBQUEsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkMsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyQyxRQUFBLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25DLFFBQUEsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFFekIsUUFBQSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtBQUNqQyxZQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBQTtnQkFDaEMsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2hCLGFBQUMsQ0FBQyxDQUFDO1NBQ0o7S0FDRixDQUFBO0lBRUQsUUFBVSxDQUFBLFNBQUEsQ0FBQSxVQUFBLEdBQVYsVUFBVyxPQUE4QixFQUFBO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQU9hLGNBQUEsQ0FBQUEsY0FBQSxDQUFBLEVBQUEsRUFBQSxJQUFJLENBQUMsT0FBTyxDQUFBLEVBQUssT0FBTyxDQUFDLENBQUM7O1FBRTdDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0tBQzFCLENBQUE7SUFFRCxRQUFNLENBQUEsU0FBQSxDQUFBLE1BQUEsR0FBTixVQUFPLEdBQWUsRUFBQTtBQUNwQixRQUFBLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsUUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN4QixZQUFBLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO1NBQzNCO0tBQ0YsQ0FBQTtJQUVELFFBQWlCLENBQUEsU0FBQSxDQUFBLGlCQUFBLEdBQWpCLFVBQWtCLEdBQWUsRUFBQTtBQUMvQixRQUFBLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO0tBQzNCLENBQUE7SUFFRCxRQUFpQixDQUFBLFNBQUEsQ0FBQSxpQkFBQSxHQUFqQixVQUFrQixHQUFlLEVBQUE7QUFDL0IsUUFBQSxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztLQUMzQixDQUFBO0lBRUQsUUFBWSxDQUFBLFNBQUEsQ0FBQSxZQUFBLEdBQVosVUFBYSxHQUFlLEVBQUE7QUFDMUIsUUFBQSxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztLQUN0QixDQUFBO0lBRUQsUUFBUyxDQUFBLFNBQUEsQ0FBQSxTQUFBLEdBQVQsVUFBVSxNQUFrQixFQUFBO0FBQzFCLFFBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDdEIsQ0FBQTtBQUVELElBQUEsUUFBQSxDQUFBLFNBQUEsQ0FBQSxTQUFTLEdBQVQsVUFBVSxNQUFjLEVBQUUsS0FBVSxFQUFBO0FBQVYsUUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVUsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUNsQyxRQUFBLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUEsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7S0FDMUIsQ0FBQTtBQTBGRCxJQUFBLFFBQUEsQ0FBQSxTQUFBLENBQUEsaUJBQWlCLEdBQWpCLFlBQUE7QUFDRSxRQUFBLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsUUFBQSxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU87UUFFcEIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFeEQsUUFBQSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQzVCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3pELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3REO0tBQ0YsQ0FBQTtJQUVELFFBQVcsQ0FBQSxTQUFBLENBQUEsV0FBQSxHQUFYLFVBQVksUUFBeUIsRUFBQTtBQUNuQyxRQUFBLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixPQUFPO1NBQ1I7QUFDRCxRQUFBLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZO0FBQUUsWUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzVELENBQUE7QUFFRCxJQUFBLFFBQUEsQ0FBQSxTQUFBLENBQUEsUUFBUSxHQUFSLFVBQVMsS0FBWSxFQUFFLE9BQVksRUFBQTtRQUFuQyxJQWdCQyxLQUFBLEdBQUEsSUFBQSxDQUFBO0FBaEJzQixRQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBWSxHQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQzFCLFFBQUEsSUFBQSxjQUFjLEdBQUksSUFBSSxDQUFDLE9BQU8sZUFBaEIsQ0FBaUI7QUFDdEMsUUFBQSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU87QUFDN0IsUUFBQSxJQUFBLEVBQTBCLEdBQUEsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUE5QyxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxNQUFNLEdBQUEsRUFBQSxDQUFBLE1BQUEsRUFBRSxNQUFNLFlBQXlCLENBQUM7QUFDdEQsUUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDM0IsUUFBQSxJQUFJLENBQUMsT0FBTyxHQUNQQSxjQUFBLENBQUFBLGNBQUEsQ0FBQUEsY0FBQSxDQUFBLEVBQUEsRUFBQSxJQUFJLENBQUMsT0FBTyxDQUNmLEVBQUEsRUFBQSxLQUFLLEVBQUEsS0FBQSxFQUFBLENBQUEsRUFDRixPQUFPLENBQ1gsQ0FBQztRQUNGLE9BQU8sQ0FBQ04sY0FBTyxDQUFFakIsbUJBQUEsQ0FBQUEsbUJBQUEsQ0FBQSxDQUFBLEtBQUssZ0JBQUssTUFBTSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUFDLFlBQUEsQ0FBSyxNQUFNLENBQUEsRUFBQSxLQUFBLENBQUEsQ0FBRSxFQUFFLFlBQUE7WUFDOUMsS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQixTQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZixDQUFBO0lBNEJELFFBQWtCLENBQUEsU0FBQSxDQUFBLGtCQUFBLEdBQWxCLFVBQW1CLGVBQXVCLEVBQUE7QUFDakMsUUFBQSxJQUFBLFVBQVUsR0FBSSxJQUFJLENBQUMsT0FBTyxXQUFoQixDQUFpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQjNCLFFBQUEsSUFBQSxNQUFNLEdBQUksSUFBSSxDQUFBLE1BQVIsQ0FBUztBQUN0QixRQUFBLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTztBQUNwQixRQUFBLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RCxRQUFBLElBQU0sd0JBQXdCLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRTFFLFFBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQzs7S0FFeEUsQ0FBQTtJQUVELFFBQVMsQ0FBQSxTQUFBLENBQUEsU0FBQSxHQUFULFVBQVUsSUFBWSxFQUFBO0FBQVosUUFBQSxJQUFBLElBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLElBQVksR0FBQSxLQUFBLENBQUEsRUFBQTtRQUNkLElBQUEsRUFBQSxHQU9GLElBQUksRUFOTixNQUFNLFlBQUEsRUFDTixjQUFjLG9CQUFBLEVBQ2QsS0FBSyxXQUFBLEVBQ0wsWUFBWSxrQkFBQSxFQUNaLFlBQVksa0JBQUEsRUFDWixZQUFZLGtCQUNOLENBQUM7QUFDVCxRQUFBLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTztBQUNkLFFBQUEsSUFBQSxLQUNKLElBQUksQ0FBQyxPQUFPLEVBRFAsU0FBUyxlQUFBLEVBQUUsTUFBTSxZQUFBLEVBQUUsZUFBZSxxQkFBQSxFQUFFLE9BQU8sYUFBQSxFQUFFLGNBQWMsb0JBQ3BELENBQUM7QUFDZixRQUFBLElBQU0saUJBQWlCLEdBQUcsZUFBZSxDQUN2QyxJQUFJLENBQUMsY0FBYyxFQUNuQixNQUFNLEVBQ04sS0FBSyxDQUNOLENBQUM7QUFDRixRQUFBLElBQU0sR0FBRyxHQUFHLE1BQU0sS0FBQSxJQUFBLElBQU4sTUFBTSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFOLE1BQU0sQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsUUFBQSxJQUFNLFFBQVEsR0FBRyxLQUFLLEtBQUEsSUFBQSxJQUFMLEtBQUssS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBTCxLQUFLLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFFBQUEsSUFBTSxTQUFTLEdBQUcsWUFBWSxLQUFBLElBQUEsSUFBWixZQUFZLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVosWUFBWSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxRQUFBLElBQU0sU0FBUyxHQUFHLFlBQVksS0FBQSxJQUFBLElBQVosWUFBWSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFaLFlBQVksQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsUUFBQSxJQUFNLFdBQVcsR0FBRyxjQUFjLEtBQUEsSUFBQSxJQUFkLGNBQWMsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBZCxjQUFjLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JELFFBQUEsSUFBTSxTQUFTLEdBQUcsWUFBWSxLQUFBLElBQUEsSUFBWixZQUFZLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVosWUFBWSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFNLFdBQVcsR0FBRyxJQUFJO0FBQ3RCLGNBQUUsaUJBQWlCO0FBQ25CLGNBQUU7QUFDRSxnQkFBQSxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFBLENBQUMsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLENBQUM7YUFDbkIsQ0FBQztBQUVOLFFBQUEsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDL0IsUUFBQSxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUM5QixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNyQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN0QyxDQUFDO1FBRUYsSUFBSSxjQUFjLEVBQUU7QUFDbEIsWUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUM7U0FDaEQ7UUFFRCxJQUFJLElBQUksRUFBRTtBQUNELFlBQUEsSUFBQSxLQUFLLEdBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLE1BQTlCLENBQStCO0FBQzNDLFlBQUEsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRWpDLElBQUksY0FBYyxFQUFFO0FBQ2xCLGdCQUFBLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUMxQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDO2FBQ2hEO0FBRUQsWUFBQSxJQUFJLGdCQUFnQixHQUFHLGVBQWUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRS9DLFlBQUEsSUFDRSxNQUFNLEtBQUtPLGNBQU0sQ0FBQyxRQUFRO2dCQUMxQixNQUFNLEtBQUtBLGNBQU0sQ0FBQyxPQUFPO2dCQUN6QixNQUFNLEtBQUtBLGNBQU0sQ0FBQyxXQUFXO0FBQzdCLGdCQUFBLE1BQU0sS0FBS0EsY0FBTSxDQUFDLFVBQVUsRUFDNUI7QUFDQSxnQkFBQSxnQkFBZ0IsR0FBRyxlQUFlLEdBQUcsR0FBRyxDQUFDO2FBQzFDO0FBQ0QsWUFBQSxJQUFJLGVBQWUsR0FBRyxlQUFlLEdBQUcsZ0JBQWdCLENBQUM7QUFFekQsWUFBQSxJQUFJLGVBQWUsR0FBRyxTQUFTLEVBQUU7QUFDL0IsZ0JBQUEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE9BQU8sR0FBRyxDQUFDLEtBQUssZUFBZSxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBRXJFLGdCQUFBLElBQUksT0FBTyxHQUNULFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSzs7QUFFakMsb0JBQUEsT0FBTyxHQUFHLEtBQUs7b0JBQ2YsT0FBTzs7QUFFUCxvQkFBQSxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsR0FBRyxLQUFLLElBQUksQ0FBQztBQUN0QyxvQkFBQSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBRXRCLGdCQUFBLElBQUksT0FBTyxHQUNULFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSzs7QUFFakMsb0JBQUEsT0FBTyxHQUFHLEtBQUs7b0JBQ2YsT0FBTzs7QUFFUCxvQkFBQSxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsR0FBRyxLQUFLLElBQUksQ0FBQztBQUN0QyxvQkFBQSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBRXRCLGdCQUFBLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLEtBQUEsSUFBQSxJQUFILEdBQUcsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBSCxHQUFHLENBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakMsUUFBUSxLQUFBLElBQUEsSUFBUixRQUFRLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVIsUUFBUSxDQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RDLFdBQVcsS0FBQSxJQUFBLElBQVgsV0FBVyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFYLFdBQVcsQ0FBRSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QyxTQUFTLEtBQUEsSUFBQSxJQUFULFNBQVMsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBVCxTQUFTLENBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkMsU0FBUyxLQUFBLElBQUEsSUFBVCxTQUFTLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVQsU0FBUyxDQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZDLFNBQVMsS0FBQSxJQUFBLElBQVQsU0FBUyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFULFNBQVMsQ0FBRSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3hDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN2QjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdkI7S0FDRixDQUFBO0lBRUQsUUFBb0IsQ0FBQSxTQUFBLENBQUEsb0JBQUEsR0FBcEIsVUFBcUIsSUFBWSxFQUFBO1FBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQyxDQUFBO0FBRUQsSUFBQSxRQUFBLENBQUEsU0FBQSxDQUFBLGNBQWMsR0FBZCxZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBT0YsSUFBSSxFQU5OLE1BQU0sWUFBQSxFQUNOLGNBQWMsb0JBQUEsRUFDZCxLQUFLLFdBQUEsRUFDTCxZQUFZLGtCQUFBLEVBQ1osWUFBWSxrQkFBQSxFQUNaLFlBQVksa0JBQ04sQ0FBQztBQUNULFFBQUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQU4sTUFBTSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxRQUFBLElBQU0sUUFBUSxHQUFHLEtBQUssS0FBQSxJQUFBLElBQUwsS0FBSyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFMLEtBQUssQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsUUFBQSxJQUFNLFNBQVMsR0FBRyxZQUFZLEtBQUEsSUFBQSxJQUFaLFlBQVksS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBWixZQUFZLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFFBQUEsSUFBTSxTQUFTLEdBQUcsWUFBWSxLQUFBLElBQUEsSUFBWixZQUFZLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVosWUFBWSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxRQUFBLElBQU0sV0FBVyxHQUFHLGNBQWMsS0FBQSxJQUFBLElBQWQsY0FBYyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFkLGNBQWMsQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsUUFBQSxJQUFNLFNBQVMsR0FBRyxZQUFZLEtBQUEsSUFBQSxJQUFaLFlBQVksS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBWixZQUFZLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQ2hDLFFBQUEsR0FBRyxhQUFILEdBQUcsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBSCxHQUFHLENBQUUsY0FBYyxFQUFFLENBQUM7QUFDdEIsUUFBQSxRQUFRLGFBQVIsUUFBUSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFSLFFBQVEsQ0FBRSxjQUFjLEVBQUUsQ0FBQztBQUMzQixRQUFBLFdBQVcsYUFBWCxXQUFXLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVgsV0FBVyxDQUFFLGNBQWMsRUFBRSxDQUFDO0FBQzlCLFFBQUEsU0FBUyxhQUFULFNBQVMsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBVCxTQUFTLENBQUUsY0FBYyxFQUFFLENBQUM7QUFDNUIsUUFBQSxTQUFTLGFBQVQsU0FBUyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFULFNBQVMsQ0FBRSxjQUFjLEVBQUUsQ0FBQztBQUM1QixRQUFBLFNBQVMsYUFBVCxTQUFTLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVQsU0FBUyxDQUFFLGNBQWMsRUFBRSxDQUFDO0tBQzdCLENBQUE7QUFFRCxJQUFBLFFBQUEsQ0FBQSxTQUFBLENBQUEsTUFBTSxHQUFOLFlBQUE7QUFDUyxRQUFBLElBQUEsR0FBRyxHQUFJLElBQUksQ0FBQSxHQUFSLENBQVM7QUFDbkIsUUFBQSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7O1FBRy9ELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixRQUFBLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZO1lBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3BELENBQUE7SUFFRCxRQUFpQixDQUFBLFNBQUEsQ0FBQSxpQkFBQSxHQUFqQixVQUFrQixNQUFvQixFQUFBO0FBQXBCLFFBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQSxFQUFBO1FBQ3BDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN0QixRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekMsUUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDdkQsQ0FBQTtJQW13QkgsT0FBQyxRQUFBLENBQUE7QUFBRCxDQUFDLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
