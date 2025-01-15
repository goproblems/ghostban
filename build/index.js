
  /**
   * @license
   * author: BAI TIANLIANG
   * ghostban.js v3.0.0-alpha.104
   * Released under the MIT license.
   */

'use strict';

var tslib = require('tslib');
var TreeModel = require('tree-model');
var lodash = require('lodash');

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
    Markup["NegativeNode"] = "neg";
    Markup["NeutralNode"] = "neu";
    Markup["Node"] = "node";
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

new TreeModel();
function isCharacterInNode(sgf, n, nodes) {
    if (nodes === void 0) { nodes = ['C', 'TM', 'GN']; }
    var res = nodes.map(function (node) {
        var indexOf = sgf.slice(0, n).lastIndexOf(node);
        if (indexOf === -1)
            return false;
        var startIndex = indexOf + node.length;
        var endIndex = sgf.indexOf(']', startIndex);
        if (endIndex === -1)
            return false;
        return n >= startIndex && n <= endIndex;
    });
    return res.includes(true);
}

/**
 * Represents an SGF (Smart Game Format) file.
 */
var Sgf = /** @class */ (function () {
    /**
     * Constructs a new instance of the Sgf class.
     * @param content The content of the Sgf, either as a string or as a TreeModel.Node<SgfNode>(Root node).
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
        var _loop_1 = function (i) {
            var c = sgf[i];
            if (this_1.NODE_DELIMITERS.includes(c) && !isCharacterInNode(sgf, i)) {
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
                        var sha = calcSHA(this_1.currentNode, moveProps_1);
                        var node = this_1.tree.parse({
                            id: sha,
                            name: sha,
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
                            // TODO: maybe unnecessary?
                            node.model.children = [node];
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
            if (c === '(' && this_1.currentNode && !isCharacterInNode(sgf, i)) {
                // console.log(`${sgf[i]}${sgf[i + 1]}${sgf[i + 2]}`);
                stack.push(this_1.currentNode);
            }
            if (c === ')' && !isCharacterInNode(sgf, i) && stack.length > 0) {
                var node = stack.pop();
                if (node) {
                    this_1.currentNode = node;
                }
            }
            if (this_1.NODE_DELIMITERS.includes(c) && !isCharacterInNode(sgf, i)) {
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

// export * from './boardcore';
// es6 import style sometimes trigger error 'gg/ghostban/build/index.js" contains a reference to the file "crypto'
// use require instead
// import sha256 from 'crypto-js/sha256';
var sha256 = require('crypto-js/sha256');
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
var isAnswerNode = function (n, kind) {
    var _a;
    var pat = (_a = n.model.customProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'PAT'; });
    return (pat === null || pat === void 0 ? void 0 : pat.value) === kind;
};
var isChoiceNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return c === null || c === void 0 ? void 0 : c.value.includes('CHOICE');
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
// export const isRightLeaf = (n: TreeModel.Node<SgfNode>) => {
//   return isRightNode(n) && !n.hasChildren();
// };
var isRightNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return c === null || c === void 0 ? void 0 : c.value.includes('RIGHT');
};
// export const isFirstRightLeaf = (n: TreeModel.Node<SgfNode>) => {
//   const root = n.getPath()[0];
//   const firstRightLeave = root.first((n: TreeModel.Node<SgfNode>) =>
//     isRightLeaf(n)
//   );
//   return firstRightLeave?.model.id === n.model.id;
// };
var isFirstRightNode = function (n) {
    var root = n.getPath()[0];
    var firstRightNode = root.first(function (n) {
        return isRightNode(n);
    });
    return (firstRightNode === null || firstRightNode === void 0 ? void 0 : firstRightNode.model.id) === n.model.id;
};
var isVariantNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return c === null || c === void 0 ? void 0 : c.value.includes('VARIANT');
};
// export const isVariantLeaf = (n: TreeModel.Node<SgfNode>) => {
//   return isVariantNode(n) && !n.hasChildren();
// };
var isWrongNode = function (n) {
    var _a;
    var c = (_a = n.model.nodeAnnotationProps) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.token === 'C'; });
    return (!(c === null || c === void 0 ? void 0 : c.value.includes('VARIANT')) && !(c === null || c === void 0 ? void 0 : c.value.includes('RIGHT'))) || !c;
};
// export const isWrongLeaf = (n: TreeModel.Node<SgfNode>) => {
//   return isWrongNode(n) && !n.hasChildren();
// };
var inPath = function (node, detectionMethod, strategy, preNodes, postNodes) {
    var _a;
    if (strategy === void 0) { strategy = exports.PathDetectionStrategy.Post; }
    var path = preNodes !== null && preNodes !== void 0 ? preNodes : node.getPath();
    var postRightNodes = (_a = postNodes === null || postNodes === void 0 ? void 0 : postNodes.filter(function (n) { return detectionMethod(n); })) !== null && _a !== void 0 ? _a : node.all(function (n) { return detectionMethod(n); });
    var preRightNodes = path.filter(function (n) {
        return detectionMethod(n);
    });
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
var getNodeNumber = function (n, parent) {
    var path = n.getPath();
    var movesCount = path.filter(function (n) { return isMoveNode(n); }).length;
    if (parent) {
        movesCount += parent.getPath().filter(function (n) { return isMoveNode(n); }).length;
    }
    return movesCount;
};
var calcSHA = function (node, moveProps) {
    if (moveProps === void 0) { moveProps = []; }
    var fullname = 'n';
    if (moveProps.length > 0) {
        fullname += "".concat(moveProps[0].token).concat(moveProps[0].value);
    }
    if (node) {
        var path = node.getPath();
        if (path.length > 0) {
            fullname =
                path.map(function (n) { return n.model.id; }).join('=>') +
                    "=>".concat(fullname);
        }
    }
    var sha = sha256(fullname).toString().slice(0, 6);
    return sha;
};
var __calcSHA_Deprecated = function (node, moveProps, setupProps) {
    if (moveProps === void 0) { moveProps = []; }
    if (setupProps === void 0) { setupProps = []; }
    var nodeType = 'r';
    if (moveProps.length > 0)
        nodeType = 'm';
    if (setupProps.length > 0)
        nodeType = 's';
    var n = "".concat(nodeType);
    if (moveProps.length > 0)
        n += "".concat(moveProps[0].token).concat(moveProps[0].value);
    var fullname = n;
    if (node) {
        fullname =
            node
                .getPath()
                .map(function (n) { return n.model.id; })
                .join('=>') +
                '=>' +
                n;
    }
    var sha = sha256(fullname).toString().slice(0, 6);
    return sha;
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
        id: '1b16b1',
        name: 0,
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
    // const sha = calcSHA(root);
    // root.model.id = sha;
    // console.log('root', root);
    // console.log(sha);
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
    var sha = calcSHA(parentNode, [moveProp]);
    var number = 1;
    if (parentNode)
        number = getNodeNumber(parentNode) + 1;
    var nodeData = initNodeData(sha, number);
    nodeData.moveProps = [moveProp];
    // TODO: Should I add this?
    // nodeData.nodeAnnotationProps = [NodeAnnotationProp.from(`N[${sha}]`)];
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
        var sha_1 = calcSHA(currentNode, [MoveProp.from("".concat(token, "[").concat(value, "]"))]);
        var filtered = currentNode.children.filter(function (n) { return n.model.id === sha_1; });
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
        var sha_2 = calcSHA(currentNode, [MoveProp.from("".concat(token, "[").concat(value, "]"))]);
        var filtered = currentNode.children.filter(function (n) { return n.model.id === sha_2; });
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
var calcPreventMoveMat = function (node, defaultBoardSize) {
    if (defaultBoardSize === void 0) { defaultBoardSize = 19; }
    if (!node)
        return zeros([defaultBoardSize, defaultBoardSize]);
    var size = extractBoardSize(node, defaultBoardSize);
    var preventMoveMat = zeros([size, size]);
    var preventMoveNodes = [];
    if (node.hasChildren()) {
        preventMoveNodes = node.children.filter(function (n) {
            return isPreventMoveNode(n);
        });
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
        preventMoveNodes.forEach(function (n) {
            n.model.moveProps.forEach(function (m) {
                var i = SGF_LETTERS.indexOf(m.value[0]);
                var j = SGF_LETTERS.indexOf(m.value[1]);
                if (i >= 0 && j >= 0 && i < size && j < size) {
                    preventMoveMat[i][j] = 1;
                }
            });
        });
    }
    return preventMoveMat;
};
/**
 * Calculates the markup matrix for variations in a given SGF node.
 *
 * @param node - The SGF node to calculate the markup for.
 * @param policy - The policy for handling the markup. Defaults to 'append'.
 * @returns The calculated markup for the variations.
 */
var calcVariationsMarkup = function (node, policy, defaultBoardSize) {
    if (policy === void 0) { policy = 'append'; }
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
                    if (inWrongPath(n))
                        mark = exports.Markup.NegativeNode;
                    if (inRightPath(n))
                        mark = exports.Markup.PositiveNode;
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
                li = i;
                lj = j;
                if (i < size && j < size) {
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
        var rightNodes = node.children.filter(function (n) {
            return inRightPath(n);
        });
        var wrongNodes = node.children.filter(function (n) {
            return inWrongPath(n);
        });
        var variantNodes = node.children.filter(function (n) {
            return inVariantPath(n);
        });
        nextNode = node;
        if (inRightPath(node) && rightNodes.length > 0) {
            nextNode = lodash.sample(rightNodes);
        }
        else if (inWrongPath(node) && wrongNodes.length > 0) {
            nextNode = lodash.sample(wrongNodes);
        }
        else if (inVariantPath(variantNodes) && variantNodes.length > 0) {
            nextNode = lodash.sample(variantNodes);
        }
        else if (isRightNode(node)) {
            onRight(getPath(nextNode));
        }
        else {
            onWrong(getPath(nextNode));
        }
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
    var size = Math.min(parseInt(((_a = findProp(root, 'SZ')) === null || _a === void 0 ? void 0 : _a.value) || defaultBoardSize), MAX_BOARD_SIZE);
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
    console.warn('Default first to move color', defaultMoveColor);
    return defaultMoveColor;
};
var getFirstToMoveColorFromSgf = function (sgf, defaultMoveColor) {
    if (defaultMoveColor === void 0) { defaultMoveColor = exports.Ki.Black; }
    var sgfParser = new Sgf(sgf);
    if (sgfParser.root)
        getFirstToMoveColorFromRoot(sgfParser.root, defaultMoveColor);
    console.warn('Default first to move color', defaultMoveColor);
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
        if (size > 0) {
            ctx.arc(x, y, size, 0, 2 * Math.PI, true);
            ctx.stroke();
        }
        ctx.restore();
    };
    return NodeMarkup;
}(Markup));

var PositiveNodeMarkup = /** @class */ (function (_super) {
    tslib.__extends(PositiveNodeMarkup, _super);
    function PositiveNodeMarkup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PositiveNodeMarkup.prototype.draw = function () {
        var _a = this, ctx = _a.ctx, x = _a.x, y = _a.y, s = _a.s; _a.ki; var color = _a.color, globalAlpha = _a.globalAlpha;
        var radius = s * 0.5;
        var size = radius * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = globalAlpha;
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
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
    return PositiveNodeMarkup;
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
            themeResources: THEME_RESOURCES,
            moveSound: false,
            adaptiveStarSize: true,
            starSize: 3,
        };
        this.cursor = exports.Cursor.None;
        this.cursorValue = '';
        this.touchMoving = false;
        this.touchStartPoint = new DOMPoint();
        this.cursorPoint = new DOMPoint();
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
            var p = _this.transMat.transformPoint(new DOMPoint(xx, yy));
            if (((_b = (_a = _this.preventMoveMat) === null || _a === void 0 ? void 0 : _a[idx - 1]) === null || _b === void 0 ? void 0 : _b[idy - 1]) === 1) {
                _this.cursorPosition = [-1, -1];
                _this.cursorPoint = new DOMPoint();
                _this.drawCursor();
                return;
            }
            if (!isMobileDevice() ||
                (isMobileDevice() && _this.mat[idx - 1][idy - 1] === 0)) {
                _this.cursorPoint = p;
                _this.cursorPosition = [idx - 1, idy - 1];
            }
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
                offset = -3;
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
                                        case exports.Markup.PositiveNode: {
                                            markup_1 = new PositiveNodeMarkup(ctx, x, y, space, ki, exports.Markup.Circle);
                                            markup_1.setColor(_this.options.positiveNodeColor);
                                            break;
                                        }
                                        case exports.Markup.NegativeNode:
                                        case exports.Markup.NeutralNode:
                                        case exports.Markup.Node: {
                                            var color = _this.options.defaultNodeColor;
                                            if (value === exports.Markup.NegativeNode) {
                                                color = _this.options.negativeNodeColor;
                                            }
                                            else if (value === exports.Markup.NeutralNode) {
                                                color = _this.options.neutralNodeColor;
                                            }
                                            markup_1 = new NodeMarkup(ctx, x, y, space, ki, exports.Markup.Circle);
                                            markup_1.setColor(color);
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
            var _a = _this.options, theme = _a.theme, themeResources = _a.themeResources;
            if (board) {
                board.style.borderRadius = '2px';
                var ctx = board.getContext('2d');
                if (ctx) {
                    if (theme === exports.Theme.BlackAndWhite) {
                        board.style.boxShadow = '0px 0px 0px #000000';
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, board.width, board.height);
                    }
                    else if (theme === exports.Theme.Flat) {
                        ctx.fillStyle = _this.options.themeFlatBoardColor;
                        ctx.fillRect(0, 0, board.width, board.height);
                    }
                    else if (theme === exports.Theme.Walnut &&
                        themeResources[theme].board !== undefined) {
                        var boardUrl = themeResources[theme].board || '';
                        var boardRes = images[boardUrl];
                        if (boardRes) {
                            ctx.drawImage(boardRes, 0, 0, board.width, board.height);
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
                ctx.font = "bold ".concat(space / 2.8, "px Helvetica");
                var center_1 = _this.calcCenter();
                var offset_1 = space / 2;
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
        this.turn = exports.Ki.Black;
        this.cursorPosition = [-1, -1];
        this.maxhv = size;
        this.transMat = new DOMMatrix();
        this.analysis = null;
        this.visibleArea = [
            [0, size - 1],
            [0, size - 1],
        ];
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
            !this.analysisCanvas)
            return;
        var _a = this, board = _a.board, canvas = _a.canvas, markupCanvas = _a.markupCanvas, cursorCanvas = _a.cursorCanvas, analysisCanvas = _a.analysisCanvas;
        var _b = this.options, size = _b.size; _b.zoom;
        if (size) {
            board.width = size * dpr;
            board.height = size * dpr;
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            markupCanvas.width = size * dpr;
            markupCanvas.height = size * dpr;
            cursorCanvas.width = size * dpr;
            cursorCanvas.height = size * dpr;
            analysisCanvas.width = size * dpr;
            analysisCanvas.height = size * dpr;
        }
        else {
            var clientWidth = this.dom.clientWidth;
            board.style.width = clientWidth + 'px';
            board.style.height = clientWidth + 'px';
            board.width = Math.floor(clientWidth * dpr);
            board.height = Math.floor(clientWidth * dpr);
            canvas.style.width = clientWidth + 'px';
            canvas.style.height = clientWidth + 'px';
            canvas.width = Math.floor(clientWidth * dpr);
            canvas.height = Math.floor(clientWidth * dpr);
            markupCanvas.style.width = clientWidth + 'px';
            markupCanvas.style.height = clientWidth + 'px';
            markupCanvas.width = Math.floor(clientWidth * dpr);
            markupCanvas.height = Math.floor(clientWidth * dpr);
            cursorCanvas.style.width = clientWidth + 'px';
            cursorCanvas.style.height = clientWidth + 'px';
            cursorCanvas.width = Math.floor(clientWidth * dpr);
            cursorCanvas.height = Math.floor(clientWidth * dpr);
            analysisCanvas.style.width = clientWidth + 'px';
            analysisCanvas.style.height = clientWidth + 'px';
            analysisCanvas.width = Math.floor(clientWidth * dpr);
            analysisCanvas.height = Math.floor(clientWidth * dpr);
        }
        this.render();
    };
    GhostBan.prototype.init = function (dom) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        var size = this.options.boardSize;
        this.mat = zeros([size, size]);
        this.markup = empty([size, size]);
        this.transMat = new DOMMatrix();
        var board = document.createElement('canvas');
        board.style.position = 'absolute';
        board.id = 'ghostban-board';
        this.board = board;
        var canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.id = 'ghostban-canvas';
        this.canvas = canvas;
        var markupCanvas = document.createElement('canvas');
        markupCanvas.style.position = 'absolute';
        markupCanvas.id = 'ghostban-markup';
        markupCanvas.style.pointerEvents = 'none';
        this.markupCanvas = markupCanvas;
        var cursorCanvas = document.createElement('canvas');
        cursorCanvas.style.position = 'absolute';
        cursorCanvas.id = 'ghostban-cursor';
        this.cursorCanvas = cursorCanvas;
        var analysisCanvas = document.createElement('canvas');
        analysisCanvas.style.position = 'absolute';
        analysisCanvas.style.pointerEvents = 'none';
        analysisCanvas.id = 'ghostban-analysis';
        this.analysisCanvas = analysisCanvas;
        this.dom = dom;
        (_a = dom.firstChild) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = dom.firstChild) === null || _b === void 0 ? void 0 : _b.remove();
        (_c = dom.firstChild) === null || _c === void 0 ? void 0 : _c.remove();
        (_d = dom.firstChild) === null || _d === void 0 ? void 0 : _d.remove();
        (_e = dom.firstChild) === null || _e === void 0 ? void 0 : _e.remove();
        dom.appendChild(board);
        dom.appendChild(canvas);
        dom.appendChild(markupCanvas);
        dom.appendChild(analysisCanvas);
        dom.appendChild(cursorCanvas);
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
        this.render();
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
        this.clearCursorCanvas();
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
        var padding = 30;
        if (visibleAreaSize <= 3) {
            padding = coordinate ? 120 : 100;
        }
        else if (visibleAreaSize <= 6) {
            padding = coordinate ? 80 : 60;
        }
        else if (visibleAreaSize <= 9) {
            padding = coordinate ? 60 : 50;
        }
        else if (visibleAreaSize <= 12) {
            padding = coordinate ? 50 : 40;
        }
        else if (visibleAreaSize <= 15) {
            padding = coordinate ? 40 : 30;
        }
        else if (visibleAreaSize <= 17) {
            padding = coordinate ? 35 : 25;
        }
        else if (visibleAreaSize <= 19) {
            padding = coordinate ? 30 : 20;
        }
        this.options.padding = padding;
        // this.renderInteractive();
    };
    GhostBan.prototype.zoomBoard = function (zoom) {
        if (zoom === void 0) { zoom = false; }
        var _a = this, canvas = _a.canvas, analysisCanvas = _a.analysisCanvas, board = _a.board, cursorCanvas = _a.cursorCanvas, markupCanvas = _a.markupCanvas;
        if (!canvas)
            return;
        var _b = this.options, boardSize = _b.boardSize, extent = _b.extent, boardLineExtent = _b.boardLineExtent, padding = _b.padding, dynamicPadding = _b.dynamicPadding;
        var zoomedVisibleArea = calcVisibleArea(this.visibleAreaMat, extent, false);
        var ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
        var boardCtx = board === null || board === void 0 ? void 0 : board.getContext('2d');
        var cursorCtx = cursorCanvas === null || cursorCanvas === void 0 ? void 0 : cursorCanvas.getContext('2d');
        var markupCtx = markupCanvas === null || markupCanvas === void 0 ? void 0 : markupCanvas.getContext('2d');
        var analysisCtx = analysisCanvas === null || analysisCanvas === void 0 ? void 0 : analysisCanvas.getContext('2d');
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
        var _a = this, canvas = _a.canvas, analysisCanvas = _a.analysisCanvas, board = _a.board, cursorCanvas = _a.cursorCanvas, markupCanvas = _a.markupCanvas;
        var ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
        var boardCtx = board === null || board === void 0 ? void 0 : board.getContext('2d');
        var cursorCtx = cursorCanvas === null || cursorCanvas === void 0 ? void 0 : cursorCanvas.getContext('2d');
        var markupCtx = markupCanvas === null || markupCanvas === void 0 ? void 0 : markupCanvas.getContext('2d');
        var analysisCtx = analysisCanvas === null || analysisCanvas === void 0 ? void 0 : analysisCanvas.getContext('2d');
        this.transMat = new DOMMatrix();
        ctx === null || ctx === void 0 ? void 0 : ctx.resetTransform();
        boardCtx === null || boardCtx === void 0 ? void 0 : boardCtx.resetTransform();
        analysisCtx === null || analysisCtx === void 0 ? void 0 : analysisCtx.resetTransform();
        cursorCtx === null || cursorCtx === void 0 ? void 0 : cursorCtx.resetTransform();
        markupCtx === null || markupCtx === void 0 ? void 0 : markupCtx.resetTransform();
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
exports.TimingProp = TimingProp;
exports.YELLOW_RGB = YELLOW_RGB;
exports.__calcSHA_Deprecated = __calcSHA_Deprecated;
exports.a1ToIndex = a1ToIndex;
exports.a1ToPos = a1ToPos;
exports.a1ToSGF = a1ToSGF;
exports.addMoveToCurrentNode = addMoveToCurrentNode;
exports.addStoneToCurrentNode = addStoneToCurrentNode;
exports.buildMoveNode = buildMoveNode;
exports.calcAnalysisPointColor = calcAnalysisPointColor;
exports.calcAvoidMovesForPartialAnalysis = calcAvoidMovesForPartialAnalysis;
exports.calcBoardSize = calcBoardSize;
exports.calcCenter = calcCenter;
exports.calcDoubtfulMovesThresholdRange = calcDoubtfulMovesThresholdRange;
exports.calcMatAndMarkup = calcMatAndMarkup;
exports.calcMost = calcMost;
exports.calcOffset = calcOffset;
exports.calcPartialArea = calcPartialArea;
exports.calcPreventMoveMat = calcPreventMoveMat;
exports.calcSHA = calcSHA;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzLnRzIiwiLi4vLi4vY29uc3QudHMiLCIuLi8uLi9jb3JlL3Byb3BzLnRzIiwiLi4vLi4vYm9hcmRjb3JlLnRzIiwiLi4vLi4vY29yZS9oZWxwZXJzLnRzIiwiLi4vLi4vY29yZS9zZ2YudHMiLCIuLi8uLi9oZWxwZXIudHMiLCIuLi8uLi9zdG9uZXMvYmFzZS50cyIsIi4uLy4uL3N0b25lcy9Db2xvclN0b25lLnRzIiwiLi4vLi4vc3RvbmVzL0ltYWdlU3RvbmUudHMiLCIuLi8uLi9zdG9uZXMvQW5hbHlzaXNQb2ludC50cyIsIi4uLy4uL21hcmt1cHMvTWFya3VwQmFzZS50cyIsIi4uLy4uL21hcmt1cHMvQ2lyY2xlTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9Dcm9zc01hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvVGV4dE1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvU3F1YXJlTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9UcmlhbmdsZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvTm9kZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvUG9zaXRpdmVOb2RlTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9DaXJjbGVTb2xpZE1hcmt1cC50cyIsIi4uLy4uL2dob3N0YmFuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogT3B0aW9ucyBmb3IgY29uZmlndXJpbmcgR2hvc3RCYW4uXG4gKi9cbmV4cG9ydCB0eXBlIEdob3N0QmFuT3B0aW9ucyA9IHtcbiAgYm9hcmRTaXplOiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIGR5bmFtaWNQYWRkaW5nOiBib29sZWFuO1xuICBwYWRkaW5nOiBudW1iZXI7XG4gIHpvb20/OiBib29sZWFuO1xuICBleHRlbnQ6IG51bWJlcjtcbiAgdGhlbWU6IFRoZW1lO1xuICBhbmFseXNpc1BvaW50VGhlbWU6IEFuYWx5c2lzUG9pbnRUaGVtZTtcbiAgY29vcmRpbmF0ZTogYm9vbGVhbjtcbiAgaW50ZXJhY3RpdmU6IGJvb2xlYW47XG4gIGJhY2tncm91bmQ6IGJvb2xlYW47XG4gIHNob3dBbmFseXNpczogYm9vbGVhbjtcbiAgYWRhcHRpdmVCb2FyZExpbmU6IGJvb2xlYW47XG4gIGJvYXJkRWRnZUxpbmVXaWR0aDogbnVtYmVyO1xuICBib2FyZExpbmVXaWR0aDogbnVtYmVyO1xuICBib2FyZExpbmVFeHRlbnQ6IG51bWJlcjtcbiAgdGhlbWVGbGF0Qm9hcmRDb2xvcjogc3RyaW5nO1xuICBwb3NpdGl2ZU5vZGVDb2xvcjogc3RyaW5nO1xuICBuZWdhdGl2ZU5vZGVDb2xvcjogc3RyaW5nO1xuICBuZXV0cmFsTm9kZUNvbG9yOiBzdHJpbmc7XG4gIGRlZmF1bHROb2RlQ29sb3I6IHN0cmluZztcbiAgdGhlbWVSZXNvdXJjZXM6IFRoZW1lUmVzb3VyY2VzO1xuICBtb3ZlU291bmQ6IGJvb2xlYW47XG4gIHN0YXJTaXplOiBudW1iZXI7XG4gIGFkYXB0aXZlU3RhclNpemU6IGJvb2xlYW47XG4gIGZvcmNlQW5hbHlzaXNCb2FyZFNpemU/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBHaG9zdEJhbk9wdGlvbnNQYXJhbXMgPSB7XG4gIGJvYXJkU2l6ZT86IG51bWJlcjtcbiAgc2l6ZT86IG51bWJlcjtcbiAgZHluYW1pY1BhZGRpbmc/OiBib29sZWFuO1xuICBwYWRkaW5nPzogbnVtYmVyO1xuICB6b29tPzogYm9vbGVhbjtcbiAgZXh0ZW50PzogbnVtYmVyO1xuICB0aGVtZT86IFRoZW1lO1xuICBhbmFseXNpc1BvaW50VGhlbWU/OiBBbmFseXNpc1BvaW50VGhlbWU7XG4gIGNvb3JkaW5hdGU/OiBib29sZWFuO1xuICBpbnRlcmFjdGl2ZT86IGJvb2xlYW47XG4gIGJhY2tncm91bmQ/OiBib29sZWFuO1xuICBzaG93QW5hbHlzaXM/OiBib29sZWFuO1xuICBhZGFwdGl2ZUJvYXJkTGluZT86IGJvb2xlYW47XG4gIGJvYXJkRWRnZUxpbmVXaWR0aD86IG51bWJlcjtcbiAgYm9hcmRMaW5lV2lkdGg/OiBudW1iZXI7XG4gIHRoZW1lRmxhdEJvYXJkQ29sb3I/OiBzdHJpbmc7XG4gIHBvc2l0aXZlTm9kZUNvbG9yPzogc3RyaW5nO1xuICBuZWdhdGl2ZU5vZGVDb2xvcj86IHN0cmluZztcbiAgbmV1dHJhbE5vZGVDb2xvcj86IHN0cmluZztcbiAgZGVmYXVsdE5vZGVDb2xvcj86IHN0cmluZztcbiAgdGhlbWVSZXNvdXJjZXM/OiBUaGVtZVJlc291cmNlcztcbiAgbW92ZVNvdW5kPzogYm9vbGVhbjtcbiAgc3RhclNpemU/OiBudW1iZXI7XG4gIGFkYXB0aXZlU3RhclNpemU/OiBib29sZWFuO1xuICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgVGhlbWVSZXNvdXJjZXMgPSB7XG4gIFtrZXkgaW4gVGhlbWVdOiB7Ym9hcmQ/OiBzdHJpbmc7IGJsYWNrczogc3RyaW5nW107IHdoaXRlczogc3RyaW5nW119O1xufTtcblxuZXhwb3J0IHR5cGUgQ29uc3VtZWRBbmFseXNpcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNlcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaXNEdXJpbmdTZWFyY2g6IGJvb2xlYW47XG4gIG1vdmVJbmZvczogTW92ZUluZm9bXTtcbiAgcm9vdEluZm86IFJvb3RJbmZvO1xuICBwb2xpY3k6IG51bWJlcltdO1xuICBvd25lcnNoaXA6IG51bWJlcltdO1xuICB0dXJuTnVtYmVyOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpc1BhcmFtcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaW5pdGlhbFBsYXllcjogc3RyaW5nO1xuICBtb3ZlczogYW55W107XG4gIHJ1bGVzOiBzdHJpbmc7XG4gIGtvbWk6IHN0cmluZztcbiAgYm9hcmRYU2l6ZTogbnVtYmVyO1xuICBib2FyZFlTaXplOiBudW1iZXI7XG4gIGluY2x1ZGVQb2xpY3k6IGJvb2xlYW47XG4gIHByaW9yaXR5OiBudW1iZXI7XG4gIG1heFZpc2l0czogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgTW92ZUluZm8gPSB7XG4gIGlzU3ltbWV0cnlPZjogc3RyaW5nO1xuICBsY2I6IG51bWJlcjtcbiAgbW92ZTogc3RyaW5nO1xuICBvcmRlcjogbnVtYmVyO1xuICBwcmlvcjogbnVtYmVyO1xuICBwdjogc3RyaW5nW107XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZU1lYW46IG51bWJlcjtcbiAgc2NvcmVTZWxmUGxheTogbnVtYmVyO1xuICBzY29yZVN0ZGV2OiBudW1iZXI7XG4gIHV0aWxpdHk6IG51bWJlcjtcbiAgdXRpbGl0eUxjYjogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFJvb3RJbmZvID0ge1xuICAvLyBjdXJyZW50UGxheWVyIGlzIG5vdCBvZmZpY2lhbGx5IHBhcnQgb2YgdGhlIEdUUCByZXN1bHRzIGJ1dCBpdCBpcyBoZWxwZnVsIHRvIGhhdmUgaXQgaGVyZSB0byBhdm9pZCBwYXNzaW5nIGl0IHRocm91Z2ggdGhlIGFyZ3VtZW50c1xuICBjdXJyZW50UGxheWVyOiBzdHJpbmc7XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZVNlbGZwbGF5OiBudW1iZXI7XG4gIHNjb3JlU3RkZXY6IG51bWJlcjtcbiAgdXRpbGl0eTogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ/OiBudW1iZXI7XG4gIHJhd1N0V3JFcnJvcj86IG51bWJlcjtcbiAgcmF3U3RTY29yZUVycm9yPzogbnVtYmVyO1xuICByYXdWYXJUaW1lTGVmdD86IG51bWJlcjtcbiAgLy8gR1RQIHJlc3VsdHMgZG9uJ3QgaW5jbHVkZSB0aGUgZm9sbG93aW5nIGZpZWxkc1xuICBsY2I/OiBudW1iZXI7XG4gIHN5bUhhc2g/OiBzdHJpbmc7XG4gIHRoaXNIYXNoPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQW5hbHlzaXNQb2ludE9wdGlvbnMgPSB7XG4gIHNob3dPcmRlcj86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZW51bSBLaSB7XG4gIEJsYWNrID0gMSxcbiAgV2hpdGUgPSAtMSxcbiAgRW1wdHkgPSAwLFxufVxuXG5leHBvcnQgZW51bSBUaGVtZSB7XG4gIEJsYWNrQW5kV2hpdGUgPSAnYmxhY2tfYW5kX3doaXRlJyxcbiAgRmxhdCA9ICdmbGF0JyxcbiAgU3ViZHVlZCA9ICdzdWJkdWVkJyxcbiAgU2hlbGxTdG9uZSA9ICdzaGVsbF9zdG9uZScsXG4gIFNsYXRlQW5kU2hlbGwgPSAnc2xhdGVfYW5kX3NoZWxsJyxcbiAgV2FsbnV0ID0gJ3dhbG51dCcsXG4gIFBob3RvcmVhbGlzdGljID0gJ3Bob3RvcmVhbGlzdGljJyxcbn1cblxuZXhwb3J0IGVudW0gQW5hbHlzaXNQb2ludFRoZW1lIHtcbiAgRGVmYXVsdCA9ICdkZWZhdWx0JyxcbiAgUHJvYmxlbSA9ICdwcm9ibGVtJyxcbn1cblxuZXhwb3J0IGVudW0gQ2VudGVyIHtcbiAgTGVmdCA9ICdsJyxcbiAgUmlnaHQgPSAncicsXG4gIFRvcCA9ICd0JyxcbiAgQm90dG9tID0gJ2InLFxuICBUb3BSaWdodCA9ICd0cicsXG4gIFRvcExlZnQgPSAndGwnLFxuICBCb3R0b21MZWZ0ID0gJ2JsJyxcbiAgQm90dG9tUmlnaHQgPSAnYnInLFxuICBDZW50ZXIgPSAnYycsXG59XG5cbmV4cG9ydCBlbnVtIE1hcmt1cCB7XG4gIEN1cnJlbnQgPSAnY3UnLFxuICBDaXJjbGUgPSAnY2knLFxuICBDaXJjbGVTb2xpZCA9ICdjaXMnLFxuICBTcXVhcmUgPSAnc3EnLFxuICBTcXVhcmVTb2xpZCA9ICdzcXMnLFxuICBUcmlhbmdsZSA9ICd0cmknLFxuICBDcm9zcyA9ICdjcicsXG4gIE51bWJlciA9ICdudW0nLFxuICBMZXR0ZXIgPSAnbGUnLFxuICBQb3NpdGl2ZU5vZGUgPSAncG9zJyxcbiAgTmVnYXRpdmVOb2RlID0gJ25lZycsXG4gIE5ldXRyYWxOb2RlID0gJ25ldScsXG4gIE5vZGUgPSAnbm9kZScsXG5cbiAgTm9uZSA9ICcnLFxufVxuXG5leHBvcnQgZW51bSBDdXJzb3Ige1xuICBOb25lID0gJycsXG4gIEJsYWNrU3RvbmUgPSAnYicsXG4gIFdoaXRlU3RvbmUgPSAndycsXG4gIENpcmNsZSA9ICdjJyxcbiAgU3F1YXJlID0gJ3MnLFxuICBUcmlhbmdsZSA9ICd0cmknLFxuICBDcm9zcyA9ICdjcicsXG4gIENsZWFyID0gJ2NsJyxcbiAgVGV4dCA9ICd0Jyxcbn1cblxuZXhwb3J0IGVudW0gUHJvYmxlbUFuc3dlclR5cGUge1xuICBSaWdodCA9ICcxJyxcbiAgV3JvbmcgPSAnMicsXG4gIFZhcmlhbnQgPSAnMycsXG59XG5cbmV4cG9ydCBlbnVtIFBhdGhEZXRlY3Rpb25TdHJhdGVneSB7XG4gIFBvc3QgPSAncG9zdCcsXG4gIFByZSA9ICdwcmUnLFxuICBCb3RoID0gJ2JvdGgnLFxufVxuIiwiaW1wb3J0IHtjaHVua30gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7VGhlbWV9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBzZXR0aW5ncyA9IHtjZG46ICdodHRwczovL3Muc2hhb3dxLmNvbSd9O1xuXG5leHBvcnQgY29uc3QgTUFYX0JPQVJEX1NJWkUgPSAyOTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0JPQVJEX1NJWkUgPSAxOTtcbmV4cG9ydCBjb25zdCBBMV9MRVRURVJTID0gW1xuICAnQScsXG4gICdCJyxcbiAgJ0MnLFxuICAnRCcsXG4gICdFJyxcbiAgJ0YnLFxuICAnRycsXG4gICdIJyxcbiAgJ0onLFxuICAnSycsXG4gICdMJyxcbiAgJ00nLFxuICAnTicsXG4gICdPJyxcbiAgJ1AnLFxuICAnUScsXG4gICdSJyxcbiAgJ1MnLFxuICAnVCcsXG5dO1xuZXhwb3J0IGNvbnN0IEExX0xFVFRFUlNfV0lUSF9JID0gW1xuICAnQScsXG4gICdCJyxcbiAgJ0MnLFxuICAnRCcsXG4gICdFJyxcbiAgJ0YnLFxuICAnRycsXG4gICdIJyxcbiAgJ0knLFxuICAnSicsXG4gICdLJyxcbiAgJ0wnLFxuICAnTScsXG4gICdOJyxcbiAgJ08nLFxuICAnUCcsXG4gICdRJyxcbiAgJ1InLFxuICAnUycsXG5dO1xuZXhwb3J0IGNvbnN0IEExX05VTUJFUlMgPSBbXG4gIDE5LCAxOCwgMTcsIDE2LCAxNSwgMTQsIDEzLCAxMiwgMTEsIDEwLCA5LCA4LCA3LCA2LCA1LCA0LCAzLCAyLCAxLFxuXTtcbmV4cG9ydCBjb25zdCBTR0ZfTEVUVEVSUyA9IFtcbiAgJ2EnLFxuICAnYicsXG4gICdjJyxcbiAgJ2QnLFxuICAnZScsXG4gICdmJyxcbiAgJ2cnLFxuICAnaCcsXG4gICdpJyxcbiAgJ2onLFxuICAnaycsXG4gICdsJyxcbiAgJ20nLFxuICAnbicsXG4gICdvJyxcbiAgJ3AnLFxuICAncScsXG4gICdyJyxcbiAgJ3MnLFxuXTtcbi8vIGV4cG9ydCBjb25zdCBCTEFOS19BUlJBWSA9IGNodW5rKG5ldyBBcnJheSgzNjEpLmZpbGwoMCksIDE5KTtcbmV4cG9ydCBjb25zdCBET1RfU0laRSA9IDM7XG5leHBvcnQgY29uc3QgRVhQQU5EX0ggPSA1O1xuZXhwb3J0IGNvbnN0IEVYUEFORF9WID0gNTtcbmV4cG9ydCBjb25zdCBSRVNQT05TRV9USU1FID0gMTAwO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBib2FyZFNpemU6IDE5LFxuICBwYWRkaW5nOiAxNSxcbiAgZXh0ZW50OiAyLFxuICBpbnRlcmFjdGl2ZTogZmFsc2UsXG4gIGNvb3JkaW5hdGU6IHRydWUsXG4gIHRoZW1lOiBUaGVtZS5GbGF0LFxuICBiYWNrZ3JvdW5kOiBmYWxzZSxcbiAgem9vbTogZmFsc2UsXG4gIHNob3dBbmFseXNpczogZmFsc2UsXG59O1xuXG5leHBvcnQgY29uc3QgVEhFTUVfUkVTT1VSQ0VTOiB7XG4gIFtrZXkgaW4gVGhlbWVdOiB7Ym9hcmQ/OiBzdHJpbmc7IGJsYWNrczogc3RyaW5nW107IHdoaXRlczogc3RyaW5nW119O1xufSA9IHtcbiAgW1RoZW1lLkJsYWNrQW5kV2hpdGVdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxuICBbVGhlbWUuU3ViZHVlZF06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc3ViZHVlZC9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3N1YmR1ZWQvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc3ViZHVlZC93aGl0ZS5wbmdgXSxcbiAgfSxcbiAgW1RoZW1lLlNoZWxsU3RvbmVdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTAucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMS5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUyLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTMucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlNC5wbmdgLFxuICAgIF0sXG4gIH0sXG4gIFtUaGVtZS5TbGF0ZUFuZFNoZWxsXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTEucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTIucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTMucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTQucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zbGF0ZTUucG5nYCxcbiAgICBdLFxuICAgIHdoaXRlczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsMS5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsMi5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsMy5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsNC5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NoZWxsNS5wbmdgLFxuICAgIF0sXG4gIH0sXG4gIFtUaGVtZS5XYWxudXRdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3dhbG51dC9ib2FyZC5qcGdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3dhbG51dC9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS93YWxudXQvd2hpdGUucG5nYF0sXG4gIH0sXG4gIFtUaGVtZS5QaG90b3JlYWxpc3RpY106IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvcGhvdG9yZWFsaXN0aWMvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9waG90b3JlYWxpc3RpYy9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9waG90b3JlYWxpc3RpYy93aGl0ZS5wbmdgXSxcbiAgfSxcbiAgW1RoZW1lLkZsYXRdOiB7XG4gICAgYmxhY2tzOiBbXSxcbiAgICB3aGl0ZXM6IFtdLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IExJR0hUX0dSRUVOX1JHQiA9ICdyZ2JhKDEzNiwgMTcwLCA2MCwgMSknO1xuZXhwb3J0IGNvbnN0IExJR0hUX1lFTExPV19SR0IgPSAncmdiYSgyMDYsIDIxMCwgODMsIDEpJztcbmV4cG9ydCBjb25zdCBZRUxMT1dfUkdCID0gJ3JnYmEoMjQyLCAyMTcsIDYwLCAxKSc7XG5leHBvcnQgY29uc3QgTElHSFRfUkVEX1JHQiA9ICdyZ2JhKDIzNiwgMTQ2LCA3MywgMSknO1xuIiwiZXhwb3J0IGNvbnN0IE1PVkVfUFJPUF9MSVNUID0gW1xuICAnQicsXG4gIC8vIEtPIGlzIHN0YW5kYXJkIGluIG1vdmUgbGlzdCBidXQgdXN1YWxseSBiZSB1c2VkIGZvciBrb21pIGluIGdhbWVpbmZvIHByb3BzXG4gIC8vICdLTycsXG4gICdNTicsXG4gICdXJyxcbl07XG5leHBvcnQgY29uc3QgU0VUVVBfUFJPUF9MSVNUID0gW1xuICAnQUInLFxuICAnQUUnLFxuICAnQVcnLFxuICAvL1RPRE86IFBMIGlzIGEgdmFsdWUgb2YgY29sb3IgdHlwZVxuICAvLyAnUEwnXG5dO1xuZXhwb3J0IGNvbnN0IE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QgPSBbXG4gICdBJyxcbiAgJ0MnLFxuICAnRE0nLFxuICAnR0InLFxuICAnR1cnLFxuICAnSE8nLFxuICAnTicsXG4gICdVQycsXG4gICdWJyxcbl07XG5leHBvcnQgY29uc3QgTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCA9IFtcbiAgJ0JNJyxcbiAgJ0RPJyxcbiAgJ0lUJyxcbiAgLy8gVEUgaXMgc3RhbmRhcmQgaW4gbW92ZSBhbm5vdGF0aW9uIGZvciB0ZXN1amlcbiAgLy8gJ1RFJyxcbl07XG5leHBvcnQgY29uc3QgTUFSS1VQX1BST1BfTElTVCA9IFtcbiAgJ0FSJyxcbiAgJ0NSJyxcbiAgJ0xCJyxcbiAgJ0xOJyxcbiAgJ01BJyxcbiAgJ1NMJyxcbiAgJ1NRJyxcbiAgJ1RSJyxcbl07XG5cbmV4cG9ydCBjb25zdCBST09UX1BST1BfTElTVCA9IFsnQVAnLCAnQ0EnLCAnRkYnLCAnR00nLCAnU1QnLCAnU1onXTtcbmV4cG9ydCBjb25zdCBHQU1FX0lORk9fUFJPUF9MSVNUID0gW1xuICAvL1RFIE5vbi1zdGFuZGFyZFxuICAnVEUnLFxuICAvL0tPIE5vbi1zdGFuZGFyZFxuICAnS08nLFxuICAnQU4nLFxuICAnQlInLFxuICAnQlQnLFxuICAnQ1AnLFxuICAnRFQnLFxuICAnRVYnLFxuICAnR04nLFxuICAnR0MnLFxuICAnT04nLFxuICAnT1QnLFxuICAnUEInLFxuICAnUEMnLFxuICAnUFcnLFxuICAnUkUnLFxuICAnUk8nLFxuICAnUlUnLFxuICAnU08nLFxuICAnVE0nLFxuICAnVVMnLFxuICAnV1InLFxuICAnV1QnLFxuXTtcbmV4cG9ydCBjb25zdCBUSU1JTkdfUFJPUF9MSVNUID0gWydCTCcsICdPQicsICdPVycsICdXTCddO1xuZXhwb3J0IGNvbnN0IE1JU0NFTExBTkVPVVNfUFJPUF9MSVNUID0gWydGRycsICdQTScsICdWVyddO1xuXG5leHBvcnQgY29uc3QgQ1VTVE9NX1BST1BfTElTVCA9IFsnUEknLCAnUEFJJywgJ05JRCcsICdQQVQnXTtcblxuZXhwb3J0IGNvbnN0IExJU1RfT0ZfUE9JTlRTX1BST1AgPSBbJ0FCJywgJ0FFJywgJ0FXJywgJ01BJywgJ1NMJywgJ1NRJywgJ1RSJ107XG5cbmNvbnN0IFRPS0VOX1JFR0VYID0gbmV3IFJlZ0V4cCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcblxuZXhwb3J0IGNsYXNzIFNnZlByb3BCYXNlIHtcbiAgcHVibGljIHRva2VuOiBzdHJpbmc7XG4gIHB1YmxpYyB0eXBlOiBzdHJpbmcgPSAnLSc7XG4gIHByb3RlY3RlZCBfdmFsdWU6IHN0cmluZyA9ICcnO1xuICBwcm90ZWN0ZWQgX3ZhbHVlczogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSBhcyBzdHJpbmc7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYCR7dGhpcy50b2tlbn0ke3RoaXMuX3ZhbHVlcy5tYXAodiA9PiBgWyR7dn1dYCkuam9pbignJyl9YDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW92ZVByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdtb3ZlJztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE1vdmVQcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE1vdmVQcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0dXBQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdzZXR1cCc7XG4gIH1cblxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IHRva2VuTWF0Y2ggPSBzdHIubWF0Y2goVE9LRU5fUkVHRVgpO1xuICAgIGNvbnN0IHZhbE1hdGNoZXMgPSBzdHIubWF0Y2hBbGwoL1xcWyhbXFxzXFxTXSo/KVxcXS9nKTtcblxuICAgIGxldCB0b2tlbiA9ICcnO1xuICAgIGNvbnN0IHZhbHMgPSBbLi4udmFsTWF0Y2hlc10ubWFwKG0gPT4gbVsxXSk7XG4gICAgaWYgKHRva2VuTWF0Y2gpIHRva2VuID0gdG9rZW5NYXRjaFsxXTtcbiAgICByZXR1cm4gbmV3IFNldHVwUHJvcCh0b2tlbiwgdmFscyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9kZUFubm90YXRpb25Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbm9kZS1hbm5vdGF0aW9uJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBOb2RlQW5ub3RhdGlvblByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZUFubm90YXRpb25Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW92ZUFubm90YXRpb25Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbW92ZS1hbm5vdGF0aW9uJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBNb3ZlQW5ub3RhdGlvblByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTW92ZUFubm90YXRpb25Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7fVxuZXhwb3J0IGNsYXNzIE1hcmt1cFByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ21hcmt1cCc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0b2tlbk1hdGNoID0gc3RyLm1hdGNoKFRPS0VOX1JFR0VYKTtcbiAgICBjb25zdCB2YWxNYXRjaGVzID0gc3RyLm1hdGNoQWxsKC9cXFsoW1xcc1xcU10qPylcXF0vZyk7XG5cbiAgICBsZXQgdG9rZW4gPSAnJztcbiAgICBjb25zdCB2YWxzID0gWy4uLnZhbE1hdGNoZXNdLm1hcChtID0+IG1bMV0pO1xuICAgIGlmICh0b2tlbk1hdGNoKSB0b2tlbiA9IHRva2VuTWF0Y2hbMV07XG4gICAgcmV0dXJuIG5ldyBNYXJrdXBQcm9wKHRva2VuLCB2YWxzKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb290UHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ3Jvb3QnO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IFJvb3RQcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJvb3RQcm9wKCcnLCAnJyk7XG4gIH1cblxuICAvLyBEdXBsaWNhdGVkIGNvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzM4XG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2FtZUluZm9Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnZ2FtZS1pbmZvJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBHYW1lSW5mb1Byb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgR2FtZUluZm9Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbVByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdjdXN0b20nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IEN1c3RvbVByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ3VzdG9tUHJvcCgnJywgJycpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1pbmdQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnVGltaW5nJztcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWlzY2VsbGFuZW91c1Byb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7fVxuIiwiaW1wb3J0IHtjbG9uZURlZXB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge3NnZlRvUG9zfSBmcm9tICcuL2hlbHBlcic7XG5cbmxldCBsaWJlcnRpZXMgPSAwO1xubGV0IHJlY3Vyc2lvblBhdGg6IHN0cmluZ1tdID0gW107XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc2l6ZSBvZiBhIG1hdHJpeC5cbiAqIEBwYXJhbSBtYXQgVGhlIG1hdHJpeCB0byBjYWxjdWxhdGUgdGhlIHNpemUgb2YuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1iZXIgb2Ygcm93cyBhbmQgY29sdW1ucyBpbiB0aGUgbWF0cml4LlxuICovXG5jb25zdCBjYWxjU2l6ZSA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgY29uc3Qgcm93c1NpemUgPSBtYXQubGVuZ3RoO1xuICBjb25zdCBjb2x1bW5zU2l6ZSA9IG1hdC5sZW5ndGggPiAwID8gbWF0WzBdLmxlbmd0aCA6IDA7XG4gIHJldHVybiBbcm93c1NpemUsIGNvbHVtbnNTaXplXTtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbGliZXJ0eSBvZiBhIHN0b25lIG9uIHRoZSBib2FyZC5cbiAqIEBwYXJhbSBtYXQgLSBUaGUgYm9hcmQgbWF0cml4LlxuICogQHBhcmFtIHggLSBUaGUgeC1jb29yZGluYXRlIG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSB5IC0gVGhlIHktY29vcmRpbmF0ZSBvZiB0aGUgc3RvbmUuXG4gKiBAcGFyYW0ga2kgLSBUaGUgdmFsdWUgb2YgdGhlIHN0b25lLlxuICovXG5jb25zdCBjYWxjTGliZXJ0eUNvcmUgPSAobWF0OiBudW1iZXJbXVtdLCB4OiBudW1iZXIsIHk6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCBzaXplID0gY2FsY1NpemUobWF0KTtcbiAgaWYgKHggPj0gMCAmJiB4IDwgc2l6ZVsxXSAmJiB5ID49IDAgJiYgeSA8IHNpemVbMF0pIHtcbiAgICBpZiAobWF0W3hdW3ldID09PSBraSAmJiAhcmVjdXJzaW9uUGF0aC5pbmNsdWRlcyhgJHt4fSwke3l9YCkpIHtcbiAgICAgIHJlY3Vyc2lvblBhdGgucHVzaChgJHt4fSwke3l9YCk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4IC0gMSwgeSwga2kpO1xuICAgICAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCArIDEsIHksIGtpKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHgsIHkgLSAxLCBraSk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4LCB5ICsgMSwga2kpO1xuICAgIH0gZWxzZSBpZiAobWF0W3hdW3ldID09PSAwKSB7XG4gICAgICBsaWJlcnRpZXMgKz0gMTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGNhbGNMaWJlcnR5ID0gKG1hdDogbnVtYmVyW11bXSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3Qgc2l6ZSA9IGNhbGNTaXplKG1hdCk7XG4gIGxpYmVydGllcyA9IDA7XG4gIHJlY3Vyc2lvblBhdGggPSBbXTtcblxuICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+IHNpemVbMV0gLSAxIHx8IHkgPiBzaXplWzBdIC0gMSkge1xuICAgIHJldHVybiB7XG4gICAgICBsaWJlcnR5OiA0LFxuICAgICAgcmVjdXJzaW9uUGF0aDogW10sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChtYXRbeF1beV0gPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGliZXJ0eTogNCxcbiAgICAgIHJlY3Vyc2lvblBhdGg6IFtdLFxuICAgIH07XG4gIH1cbiAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCwgeSwga2kpO1xuICByZXR1cm4ge1xuICAgIGxpYmVydHk6IGxpYmVydGllcyxcbiAgICByZWN1cnNpb25QYXRoLFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGV4ZWNDYXB0dXJlID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogbnVtYmVyXG4pID0+IHtcbiAgY29uc3QgbmV3QXJyYXkgPSBtYXQ7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5VXAsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhVcH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSxcbiAgICBqIC0gMSxcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eURvd24sIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhEb3dufSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogKyAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5TGVmdCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aExlZnR9ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGkgLSAxLFxuICAgIGosXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlSaWdodCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFJpZ2h0fSA9XG4gICAgY2FsY0xpYmVydHkobWF0LCBpICsgMSwgaiwga2kpO1xuICBpZiAobGliZXJ0eVVwID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aFVwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGl0ZW0uc3BsaXQoJywnKTtcbiAgICAgIG5ld0FycmF5W3BhcnNlSW50KGNvb3JkWzBdKV1bcGFyc2VJbnQoY29vcmRbMV0pXSA9IDA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGxpYmVydHlEb3duID09PSAwKSB7XG4gICAgcmVjdXJzaW9uUGF0aERvd24uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICBpZiAobGliZXJ0eUxlZnQgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoTGVmdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdBcnJheVtwYXJzZUludChjb29yZFswXSldW3BhcnNlSW50KGNvb3JkWzFdKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIGlmIChsaWJlcnR5UmlnaHQgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoUmlnaHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbmV3QXJyYXk7XG59O1xuXG5jb25zdCBjYW5DYXB0dXJlID0gKG1hdDogbnVtYmVyW11bXSwgaTogbnVtYmVyLCBqOiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlVcCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFVwfSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogLSAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5RG93biwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aERvd259ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiArIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlMZWZ0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoTGVmdH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSAtIDEsXG4gICAgaixcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVJpZ2h0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoUmlnaHR9ID1cbiAgICBjYWxjTGliZXJ0eShtYXQsIGkgKyAxLCBqLCBraSk7XG4gIGlmIChsaWJlcnR5VXAgPT09IDAgJiYgcmVjdXJzaW9uUGF0aFVwLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobGliZXJ0eURvd24gPT09IDAgJiYgcmVjdXJzaW9uUGF0aERvd24ubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChsaWJlcnR5TGVmdCA9PT0gMCAmJiByZWN1cnNpb25QYXRoTGVmdC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGxpYmVydHlSaWdodCA9PT0gMCAmJiByZWN1cnNpb25QYXRoUmlnaHQubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYW5Nb3ZlID0gKG1hdDogbnVtYmVyW11bXSwgaTogbnVtYmVyLCBqOiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3QgbmV3QXJyYXkgPSBjbG9uZURlZXAobWF0KTtcbiAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm4gZmFsc2U7XG4gIGlmIChtYXRbaV1bal0gIT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBuZXdBcnJheVtpXVtqXSA9IGtpO1xuICBjb25zdCB7bGliZXJ0eX0gPSBjYWxjTGliZXJ0eShuZXdBcnJheSwgaSwgaiwga2kpO1xuICBpZiAoY2FuQ2FwdHVyZShuZXdBcnJheSwgaSwgaiwgLWtpKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChjYW5DYXB0dXJlKG5ld0FycmF5LCBpLCBqLCBraSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGxpYmVydHkgPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hvd0tpID0gKFxuICBhcnJheTogbnVtYmVyW11bXSxcbiAgc3RlcHM6IHN0cmluZ1tdLFxuICBpc0NhcHR1cmVkID0gdHJ1ZVxuKSA9PiB7XG4gIGxldCBuZXdNYXQgPSBjbG9uZURlZXAoYXJyYXkpO1xuICBsZXQgaGFzTW92ZWQgPSBmYWxzZTtcbiAgc3RlcHMuZm9yRWFjaChzdHIgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAga2ksXG4gICAgfToge1xuICAgICAgeDogbnVtYmVyO1xuICAgICAgeTogbnVtYmVyO1xuICAgICAga2k6IG51bWJlcjtcbiAgICB9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgICBpZiAoaXNDYXB0dXJlZCkge1xuICAgICAgaWYgKGNhbk1vdmUobmV3TWF0LCB4LCB5LCBraSkpIHtcbiAgICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICAgIG5ld01hdCA9IGV4ZWNDYXB0dXJlKG5ld01hdCwgeCwgeSwgLWtpKTtcbiAgICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJyYW5nZW1lbnQ6IG5ld01hdCxcbiAgICBoYXNNb3ZlZCxcbiAgfTtcbn07XG4iLCJpbXBvcnQgVHJlZU1vZGVsIGZyb20gJ3RyZWUtbW9kZWwnO1xuaW1wb3J0IHtSb290UHJvcH0gZnJvbSAnLi9wcm9wcyc7XG5pbXBvcnQge1NnZk5vZGV9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCB0cmVlOiBUcmVlTW9kZWwgPSBuZXcgVHJlZU1vZGVsKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NoYXJhY3RlckluTm9kZShcbiAgc2dmOiBzdHJpbmcsXG4gIG46IG51bWJlcixcbiAgbm9kZXMgPSBbJ0MnLCAnVE0nLCAnR04nXVxuKSB7XG4gIGNvbnN0IHJlcyA9IG5vZGVzLm1hcChub2RlID0+IHtcbiAgICBjb25zdCBpbmRleE9mID0gc2dmLnNsaWNlKDAsIG4pLmxhc3RJbmRleE9mKG5vZGUpO1xuICAgIGlmIChpbmRleE9mID09PSAtMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IGluZGV4T2YgKyBub2RlLmxlbmd0aDtcbiAgICBjb25zdCBlbmRJbmRleCA9IHNnZi5pbmRleE9mKCddJywgc3RhcnRJbmRleCk7XG5cbiAgICBpZiAoZW5kSW5kZXggPT09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gbiA+PSBzdGFydEluZGV4ICYmIG4gPD0gZW5kSW5kZXg7XG4gIH0pO1xuXG4gIHJldHVybiByZXMuaW5jbHVkZXModHJ1ZSk7XG59XG4iLCJpbXBvcnQge2NvbXBhY3QsIHJlcGxhY2V9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge2lzQ2hhcmFjdGVySW5Ob2RlfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5pbXBvcnQgVHJlZU1vZGVsIGZyb20gJ3RyZWUtbW9kZWwnO1xuaW1wb3J0IHtcbiAgTW92ZVByb3AsXG4gIFNldHVwUHJvcCxcbiAgUm9vdFByb3AsXG4gIEdhbWVJbmZvUHJvcCxcbiAgU2dmUHJvcEJhc2UsXG4gIE5vZGVBbm5vdGF0aW9uUHJvcCxcbiAgTW92ZUFubm90YXRpb25Qcm9wLFxuICBNYXJrdXBQcm9wLFxuICBDdXN0b21Qcm9wLFxuICBST09UX1BST1BfTElTVCxcbiAgTU9WRV9QUk9QX0xJU1QsXG4gIFNFVFVQX1BST1BfTElTVCxcbiAgTUFSS1VQX1BST1BfTElTVCxcbiAgTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgR0FNRV9JTkZPX1BST1BfTElTVCxcbiAgQ1VTVE9NX1BST1BfTElTVCxcbn0gZnJvbSAnLi9wcm9wcyc7XG5pbXBvcnQgdHlwZSB7U2dmTm9kZX0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge2dldERlZHVwbGljYXRlZFByb3BzLCBnZXROb2RlTnVtYmVyfSBmcm9tICcuLi9oZWxwZXInO1xuaW1wb3J0IHtjYWxjU0hBfSBmcm9tICcuLi9oZWxwZXInO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gU0dGIChTbWFydCBHYW1lIEZvcm1hdCkgZmlsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNnZiB7XG4gIE5FV19OT0RFID0gJzsnO1xuICBCUkFOQ0hJTkcgPSBbJygnLCAnKSddO1xuICBQUk9QRVJUWSA9IFsnWycsICddJ107XG4gIExJU1RfSURFTlRJVElFUyA9IFtcbiAgICAnQVcnLFxuICAgICdBQicsXG4gICAgJ0FFJyxcbiAgICAnQVInLFxuICAgICdDUicsXG4gICAgJ0REJyxcbiAgICAnTEInLFxuICAgICdMTicsXG4gICAgJ01BJyxcbiAgICAnU0wnLFxuICAgICdTUScsXG4gICAgJ1RSJyxcbiAgICAnVlcnLFxuICAgICdUQicsXG4gICAgJ1RXJyxcbiAgXTtcbiAgTk9ERV9ERUxJTUlURVJTID0gW3RoaXMuTkVXX05PREVdLmNvbmNhdCh0aGlzLkJSQU5DSElORyk7XG5cbiAgdHJlZTogVHJlZU1vZGVsID0gbmV3IFRyZWVNb2RlbCgpO1xuICByb290OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiB8IG51bGwgPSBudWxsO1xuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiB8IG51bGwgPSBudWxsO1xuICBjdXJyZW50Tm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4gfCBudWxsID0gbnVsbDtcbiAgcGFyZW50Tm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4gfCBudWxsID0gbnVsbDtcbiAgbm9kZVByb3BzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBTZ2YgY2xhc3MuXG4gICAqIEBwYXJhbSBjb250ZW50IFRoZSBjb250ZW50IG9mIHRoZSBTZ2YsIGVpdGhlciBhcyBhIHN0cmluZyBvciBhcyBhIFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KFJvb3Qgbm9kZSkuXG4gICAqIEBwYXJhbSBwYXJzZU9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHBhcnNpbmcgdGhlIFNnZiBjb250ZW50LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjb250ZW50Pzogc3RyaW5nIHwgVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gICAgcHJpdmF0ZSBwYXJzZU9wdGlvbnMgPSB7XG4gICAgICBpZ25vcmVQcm9wTGlzdDogW10sXG4gICAgfVxuICApIHtcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnBhcnNlKGNvbnRlbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLnNldFJvb3QoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgU0dGIHRyZWUuXG4gICAqXG4gICAqIEBwYXJhbSByb290IFRoZSByb290IG5vZGUgdG8gc2V0LlxuICAgKiBAcmV0dXJucyBUaGUgdXBkYXRlZCBTR0YgaW5zdGFuY2UuXG4gICAqL1xuICBzZXRSb290KHJvb3Q6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSB7XG4gICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgY3VycmVudCBTR0YgdHJlZSB0byBhbiBTR0Ygc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgKiBAcmV0dXJucyBUaGUgU0dGIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJlZS5cbiAgICovXG4gIHRvU2dmKCkge1xuICAgIHJldHVybiBgKCR7dGhpcy5ub2RlVG9TdHJpbmcodGhpcy5yb290KX0pYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgZ2FtZSB0cmVlIHRvIFNHRiBmb3JtYXQgd2l0aG91dCBpbmNsdWRpbmcgYW5hbHlzaXMgZGF0YS5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIFNHRiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZSB0cmVlLlxuICAgKi9cbiAgdG9TZ2ZXaXRob3V0QW5hbHlzaXMoKSB7XG4gICAgY29uc3Qgc2dmID0gYCgke3RoaXMubm9kZVRvU3RyaW5nKHRoaXMucm9vdCl9KWA7XG4gICAgcmV0dXJuIHJlcGxhY2Uoc2dmLCAvXShBXFxbLio/XFxdKS9nLCAnXScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlcyB0aGUgZ2l2ZW4gU0dGIChTbWFydCBHYW1lIEZvcm1hdCkgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gc2dmIC0gVGhlIFNHRiBzdHJpbmcgdG8gcGFyc2UuXG4gICAqL1xuICBwYXJzZShzZ2Y6IHN0cmluZykge1xuICAgIGlmICghc2dmKSByZXR1cm47XG4gICAgc2dmID0gc2dmLnJlcGxhY2UoL1xccysoPyFbXlxcW1xcXV0qXSkvZ20sICcnKTtcbiAgICBsZXQgbm9kZVN0YXJ0ID0gMDtcbiAgICBsZXQgY291bnRlciA9IDA7XG4gICAgY29uc3Qgc3RhY2s6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2dmLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjID0gc2dmW2ldO1xuICAgICAgaWYgKHRoaXMuTk9ERV9ERUxJTUlURVJTLmluY2x1ZGVzKGMpICYmICFpc0NoYXJhY3RlckluTm9kZShzZ2YsIGkpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBzZ2Yuc2xpY2Uobm9kZVN0YXJ0LCBpKTtcbiAgICAgICAgaWYgKGNvbnRlbnQgIT09ICcnKSB7XG4gICAgICAgICAgY29uc3QgbW92ZVByb3BzOiBNb3ZlUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3Qgc2V0dXBQcm9wczogU2V0dXBQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCByb290UHJvcHM6IFJvb3RQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBtYXJrdXBQcm9wczogTWFya3VwUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgZ2FtZUluZm9Qcm9wczogR2FtZUluZm9Qcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBub2RlQW5ub3RhdGlvblByb3BzOiBOb2RlQW5ub3RhdGlvblByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IG1vdmVBbm5vdGF0aW9uUHJvcHM6IE1vdmVBbm5vdGF0aW9uUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgY3VzdG9tUHJvcHM6IEN1c3RvbVByb3BbXSA9IFtdO1xuXG4gICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IFtcbiAgICAgICAgICAgIC4uLmNvbnRlbnQubWF0Y2hBbGwoXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvKFtBLVpdK1xcW1thLXpcXFtcXF1dKlxcXSspLywgJ2cnKVxuICAgICAgICAgICAgICAvLyBSZWdFeHAoLyhbQS1aXStcXFsuKj9cXF0rKS8sICdnJylcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC9bQS1aXSsoXFxbLio/XFxdKXsxLH0vLCAnZycpXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvW0EtWl0rKFxcW1tcXHNcXFNdKj9cXF0pezEsfS8sICdnJyksXG4gICAgICAgICAgICAgIFJlZ0V4cCgvXFx3KyhcXFtbXlxcXV0qP1xcXSg/Olxccj9cXG4/XFxzW15cXF1dKj8pKil7MSx9LywgJ2cnKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgbWF0Y2hlcy5mb3JFYWNoKG0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdG9rZW5NYXRjaCA9IG1bMF0ubWF0Y2goLyhbQS1aXSspXFxbLyk7XG4gICAgICAgICAgICBpZiAodG9rZW5NYXRjaCkge1xuICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2VuTWF0Y2hbMV07XG4gICAgICAgICAgICAgIGlmIChNT1ZFX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBtb3ZlUHJvcHMucHVzaChNb3ZlUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoU0VUVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHNldHVwUHJvcHMucHVzaChTZXR1cFByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKFJPT1RfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHJvb3RQcm9wcy5wdXNoKFJvb3RQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG1hcmt1cFByb3BzLnB1c2goTWFya3VwUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoR0FNRV9JTkZPX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBnYW1lSW5mb1Byb3BzLnB1c2goR2FtZUluZm9Qcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG5vZGVBbm5vdGF0aW9uUHJvcHMucHVzaChOb2RlQW5ub3RhdGlvblByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcy5wdXNoKE1vdmVBbm5vdGF0aW9uUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoQ1VTVE9NX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBjdXN0b21Qcm9wcy5wdXNoKEN1c3RvbVByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNoYSA9IGNhbGNTSEEodGhpcy5jdXJyZW50Tm9kZSwgbW92ZVByb3BzKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnRyZWUucGFyc2U8U2dmTm9kZT4oe1xuICAgICAgICAgICAgICBpZDogc2hhLFxuICAgICAgICAgICAgICBuYW1lOiBzaGEsXG4gICAgICAgICAgICAgIGluZGV4OiBjb3VudGVyLFxuICAgICAgICAgICAgICBudW1iZXI6IDAsXG4gICAgICAgICAgICAgIG1vdmVQcm9wcyxcbiAgICAgICAgICAgICAgc2V0dXBQcm9wcyxcbiAgICAgICAgICAgICAgcm9vdFByb3BzLFxuICAgICAgICAgICAgICBtYXJrdXBQcm9wcyxcbiAgICAgICAgICAgICAgZ2FtZUluZm9Qcm9wcyxcbiAgICAgICAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgICAgICAgY3VzdG9tUHJvcHMsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICAgICAgICBub2RlLm1vZGVsLm51bWJlciA9IGdldE5vZGVOdW1iZXIobm9kZSk7XG4gICAgICAgICAgICAgIC8vIFRPRE86IG1heWJlIHVubmVjZXNzYXJ5P1xuICAgICAgICAgICAgICBub2RlLm1vZGVsLmNoaWxkcmVuID0gW25vZGVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5yb290ID0gbm9kZTtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcoJyAmJiB0aGlzLmN1cnJlbnROb2RlICYmICFpc0NoYXJhY3RlckluTm9kZShzZ2YsIGkpKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3NnZltpXX0ke3NnZltpICsgMV19JHtzZ2ZbaSArIDJdfWApO1xuICAgICAgICBzdGFjay5wdXNoKHRoaXMuY3VycmVudE5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcpJyAmJiAhaXNDaGFyYWN0ZXJJbk5vZGUoc2dmLCBpKSAmJiBzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5OT0RFX0RFTElNSVRFUlMuaW5jbHVkZXMoYykgJiYgIWlzQ2hhcmFjdGVySW5Ob2RlKHNnZiwgaSkpIHtcbiAgICAgICAgbm9kZVN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBub2RlIHRvIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSAtIFRoZSBub2RlIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5vZGUuXG4gICAqL1xuICBwcml2YXRlIG5vZGVUb1N0cmluZyhub2RlOiBhbnkpIHtcbiAgICBsZXQgY29udGVudCA9ICcnO1xuICAgIG5vZGUud2FsaygobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcm9vdFByb3BzLFxuICAgICAgICBtb3ZlUHJvcHMsXG4gICAgICAgIGN1c3RvbVByb3BzLFxuICAgICAgICBzZXR1cFByb3BzLFxuICAgICAgICBtYXJrdXBQcm9wcyxcbiAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgZ2FtZUluZm9Qcm9wcyxcbiAgICAgIH0gPSBuLm1vZGVsO1xuICAgICAgY29uc3Qgbm9kZXMgPSBjb21wYWN0KFtcbiAgICAgICAgLi4ucm9vdFByb3BzLFxuICAgICAgICAuLi5jdXN0b21Qcm9wcyxcbiAgICAgICAgLi4ubW92ZVByb3BzLFxuICAgICAgICAuLi5nZXREZWR1cGxpY2F0ZWRQcm9wcyhzZXR1cFByb3BzKSxcbiAgICAgICAgLi4uZ2V0RGVkdXBsaWNhdGVkUHJvcHMobWFya3VwUHJvcHMpLFxuICAgICAgICAuLi5nYW1lSW5mb1Byb3BzLFxuICAgICAgICAuLi5ub2RlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICAuLi5tb3ZlQW5ub3RhdGlvblByb3BzLFxuICAgICAgXSk7XG4gICAgICBjb250ZW50ICs9ICc7JztcbiAgICAgIG5vZGVzLmZvckVhY2goKG46IFNnZlByb3BCYXNlKSA9PiB7XG4gICAgICAgIGNvbnRlbnQgKz0gbi50b1N0cmluZygpO1xuICAgICAgfSk7XG4gICAgICBpZiAobi5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgIG4uY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IFNnZlByb3BCYXNlKSA9PiB7XG4gICAgICAgICAgY29udGVudCArPSBgKCR7dGhpcy5ub2RlVG9TdHJpbmcoY2hpbGQpfSlgO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuLmNoaWxkcmVuLmxlbmd0aCA8IDI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbn1cbiIsImltcG9ydCBUcmVlTW9kZWwgZnJvbSAndHJlZS1tb2RlbCc7XG5pbXBvcnQge1xuICBjbG9uZURlZXAsXG4gIGZsYXR0ZW5EZXB0aCxcbiAgY2xvbmUsXG4gIHN1bSxcbiAgZmlsdGVyLFxuICBmaW5kTGFzdEluZGV4LFxuICBjb21wYWN0LFxuICBzYW1wbGUsXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1NnZk5vZGUsIFNnZk5vZGVPcHRpb25zfSBmcm9tICcuL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHtcbiAgQTFfTEVUVEVSUyxcbiAgQTFfTlVNQkVSUyxcbiAgU0dGX0xFVFRFUlMsXG4gIE1BWF9CT0FSRF9TSVpFLFxuICBMSUdIVF9HUkVFTl9SR0IsXG4gIExJR0hUX1lFTExPV19SR0IsXG4gIExJR0hUX1JFRF9SR0IsXG4gIFlFTExPV19SR0IsXG4gIERFRkFVTFRfQk9BUkRfU0laRSxcbn0gZnJvbSAnLi9jb25zdCc7XG5pbXBvcnQge1xuICBTZXR1cFByb3AsXG4gIE1vdmVQcm9wLFxuICBDdXN0b21Qcm9wLFxuICBTZ2ZQcm9wQmFzZSxcbiAgTm9kZUFubm90YXRpb25Qcm9wLFxuICBHYW1lSW5mb1Byb3AsXG4gIE1vdmVBbm5vdGF0aW9uUHJvcCxcbiAgUm9vdFByb3AsXG4gIE1hcmt1cFByb3AsXG4gIE1PVkVfUFJPUF9MSVNULFxuICBTRVRVUF9QUk9QX0xJU1QsXG4gIE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QsXG4gIE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QsXG4gIE1BUktVUF9QUk9QX0xJU1QsXG4gIFJPT1RfUFJPUF9MSVNULFxuICBHQU1FX0lORk9fUFJPUF9MSVNULFxuICBUSU1JTkdfUFJPUF9MSVNULFxuICBNSVNDRUxMQU5FT1VTX1BST1BfTElTVCxcbiAgQ1VTVE9NX1BST1BfTElTVCxcbn0gZnJvbSAnLi9jb3JlL3Byb3BzJztcbmltcG9ydCB7XG4gIEFuYWx5c2lzLFxuICBHaG9zdEJhbk9wdGlvbnMsXG4gIEtpLFxuICBNb3ZlSW5mbyxcbiAgUHJvYmxlbUFuc3dlclR5cGUgYXMgUEFULFxuICBSb290SW5mbyxcbiAgTWFya3VwLFxuICBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQge0NlbnRlcn0gZnJvbSAnLi90eXBlcyc7XG5cbmltcG9ydCB7Y2FuTW92ZSwgZXhlY0NhcHR1cmV9IGZyb20gJy4vYm9hcmRjb3JlJztcbmV4cG9ydCB7Y2FuTW92ZSwgZXhlY0NhcHR1cmV9O1xuLy8gZXhwb3J0ICogZnJvbSAnLi9ib2FyZGNvcmUnO1xuXG4vLyBlczYgaW1wb3J0IHN0eWxlIHNvbWV0aW1lcyB0cmlnZ2VyIGVycm9yICdnZy9naG9zdGJhbi9idWlsZC9pbmRleC5qc1wiIGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIHRoZSBmaWxlIFwiY3J5cHRvJ1xuLy8gdXNlIHJlcXVpcmUgaW5zdGVhZFxuLy8gaW1wb3J0IHNoYTI1NiBmcm9tICdjcnlwdG8tanMvc2hhMjU2JztcbmNvbnN0IHNoYTI1NiA9IHJlcXVpcmUoJ2NyeXB0by1qcy9zaGEyNTYnKTtcbmltcG9ydCB7U2dmfSBmcm9tICcuL2NvcmUvc2dmJztcblxudHlwZSBTdHJhdGVneSA9ICdwb3N0JyB8ICdwcmUnIHwgJ2JvdGgnO1xuXG5leHBvcnQgY29uc3QgY2FsY0RvdWJ0ZnVsTW92ZXNUaHJlc2hvbGRSYW5nZSA9ICh0aHJlc2hvbGQ6IG51bWJlcikgPT4ge1xuICAvLyA4RC05RFxuICBpZiAodGhyZXNob2xkID49IDI1KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMTVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTNdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjE1LCAtMC4xXSwgc2NvcmVSYW5nZTogWy0zLCAtMl19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy0yLCAtMV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTEsIC0wLjVdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDVELTdEXG4gIGlmICh0aHJlc2hvbGQgPj0gMjMgJiYgdGhyZXNob2xkIDwgMjUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4yXSwgc2NvcmVSYW5nZTogWy0xMDAsIC04XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4yLCAtMC4xNV0sIHNjb3JlUmFuZ2U6IFstOCwgLTRdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xNSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTQsIC0yXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMiwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG5cbiAgLy8gM0QtNURcbiAgaWYgKHRocmVzaG9sZCA+PSAyMCAmJiB0aHJlc2hvbGQgPCAyMykge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjI1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0xMl19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMjUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTEyLCAtNV19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy01LCAtMl19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTIsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyAxRC0zRFxuICBpZiAodGhyZXNob2xkID49IDE4ICYmIHRocmVzaG9sZCA8IDIwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuM10sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMTVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjMsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTE1LCAtN119LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy03LCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1Sy0xS1xuICBpZiAodGhyZXNob2xkID49IDEzICYmIHRocmVzaG9sZCA8IDE4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMzVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTIwXX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zNSwgLTAuMTJdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xMiwgLTAuMDhdLCBzY29yZVJhbmdlOiBbLTEwLCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wOCwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1Sy0xMEtcbiAgaWYgKHRocmVzaG9sZCA+PSA4ICYmIHRocmVzaG9sZCA8IDEzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuNF0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMjVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjQsIC0wLjE1XSwgc2NvcmVSYW5nZTogWy0yNSwgLTEwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTEwLCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstNSwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDE4Sy0xMEtcbiAgaWYgKHRocmVzaG9sZCA+PSAwICYmIHRocmVzaG9sZCA8IDgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC40NV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMzVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjQ1LCAtMC4yXSwgc2NvcmVSYW5nZTogWy0zNSwgLTIwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMiwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMjAsIC0xMF19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMTAsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuM10sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMzBdfSxcbiAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zLCAtMC4yXSwgc2NvcmVSYW5nZTogWy0zMCwgLTIwXX0sXG4gICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjIsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0xMCwgLTFdfSxcbiAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kMiA9ICh2OiBudW1iZXIsIHNjYWxlID0gMSwgZml4ZWQgPSAyKSA9PiB7XG4gIHJldHVybiAoKE1hdGgucm91bmQodiAqIDEwMCkgLyAxMDApICogc2NhbGUpLnRvRml4ZWQoZml4ZWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kMyA9ICh2OiBudW1iZXIsIHNjYWxlID0gMSwgZml4ZWQgPSAzKSA9PiB7XG4gIHJldHVybiAoKE1hdGgucm91bmQodiAqIDEwMDApIC8gMTAwMCkgKiBzY2FsZSkudG9GaXhlZChmaXhlZCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RGVkdXBsaWNhdGVkUHJvcHMgPSAodGFyZ2V0UHJvcHM6IFNnZlByb3BCYXNlW10pID0+IHtcbiAgcmV0dXJuIGZpbHRlcihcbiAgICB0YXJnZXRQcm9wcyxcbiAgICAocHJvcDogU2dmUHJvcEJhc2UsIGluZGV4OiBudW1iZXIpID0+XG4gICAgICBpbmRleCA9PT1cbiAgICAgIGZpbmRMYXN0SW5kZXgoXG4gICAgICAgIHRhcmdldFByb3BzLFxuICAgICAgICAobGFzdFBybzogU2dmUHJvcEJhc2UpID0+XG4gICAgICAgICAgcHJvcC50b2tlbiA9PT0gbGFzdFByby50b2tlbiAmJiBwcm9wLnZhbHVlID09PSBsYXN0UHJvLnZhbHVlXG4gICAgICApXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNNb3ZlTm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICByZXR1cm4gbi5tb2RlbC5tb3ZlUHJvcHMubGVuZ3RoID4gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1Jvb3ROb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIHJldHVybiBuLm1vZGVsLnJvb3RQcm9wcy5sZW5ndGggPiAwIHx8IG4uaXNSb290KCk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNTZXR1cE5vZGUgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgcmV0dXJuIG4ubW9kZWwuc2V0dXBQcm9wcy5sZW5ndGggPiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQW5zd2VyTm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiwga2luZDogUEFUKSA9PiB7XG4gIGNvbnN0IHBhdCA9IG4ubW9kZWwuY3VzdG9tUHJvcHM/LmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQVQnKTtcbiAgcmV0dXJuIHBhdD8udmFsdWUgPT09IGtpbmQ7XG59O1xuXG5leHBvcnQgY29uc3QgaXNDaG9pY2VOb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnQ0hPSUNFJyk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNUYXJnZXROb2RlID0gaXNDaG9pY2VOb2RlO1xuXG5leHBvcnQgY29uc3QgaXNGb3JjZU5vZGUgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuIGM/LnZhbHVlLmluY2x1ZGVzKCdGT1JDRScpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUHJldmVudE1vdmVOb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnTk9UVEhJUycpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzUmlnaHRMZWFmID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4vLyAgIHJldHVybiBpc1JpZ2h0Tm9kZShuKSAmJiAhbi5oYXNDaGlsZHJlbigpO1xuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGlzUmlnaHROb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnUklHSFQnKTtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBpc0ZpcnN0UmlnaHRMZWFmID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4vLyAgIGNvbnN0IHJvb3QgPSBuLmdldFBhdGgoKVswXTtcbi8vICAgY29uc3QgZmlyc3RSaWdodExlYXZlID0gcm9vdC5maXJzdCgobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+XG4vLyAgICAgaXNSaWdodExlYWYobilcbi8vICAgKTtcbi8vICAgcmV0dXJuIGZpcnN0UmlnaHRMZWF2ZT8ubW9kZWwuaWQgPT09IG4ubW9kZWwuaWQ7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaXNGaXJzdFJpZ2h0Tm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICBjb25zdCByb290ID0gbi5nZXRQYXRoKClbMF07XG4gIGNvbnN0IGZpcnN0UmlnaHROb2RlID0gcm9vdC5maXJzdCgobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+XG4gICAgaXNSaWdodE5vZGUobilcbiAgKTtcbiAgcmV0dXJuIGZpcnN0UmlnaHROb2RlPy5tb2RlbC5pZCA9PT0gbi5tb2RlbC5pZDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ZhcmlhbnROb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnVkFSSUFOVCcpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzVmFyaWFudExlYWYgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbi8vICAgcmV0dXJuIGlzVmFyaWFudE5vZGUobikgJiYgIW4uaGFzQ2hpbGRyZW4oKTtcbi8vIH07XG5cbmV4cG9ydCBjb25zdCBpc1dyb25nTm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gKCFjPy52YWx1ZS5pbmNsdWRlcygnVkFSSUFOVCcpICYmICFjPy52YWx1ZS5pbmNsdWRlcygnUklHSFQnKSkgfHwgIWM7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgaXNXcm9uZ0xlYWYgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbi8vICAgcmV0dXJuIGlzV3JvbmdOb2RlKG4pICYmICFuLmhhc0NoaWxkcmVuKCk7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaW5QYXRoID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgZGV0ZWN0aW9uTWV0aG9kOiAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IGJvb2xlYW4sXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2RlczogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZFxuKSA9PiB7XG4gIGNvbnN0IHBhdGggPSBwcmVOb2RlcyA/PyBub2RlLmdldFBhdGgoKTtcbiAgY29uc3QgcG9zdFJpZ2h0Tm9kZXMgPVxuICAgIHBvc3ROb2Rlcz8uZmlsdGVyKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4gZGV0ZWN0aW9uTWV0aG9kKG4pKSA/P1xuICAgIG5vZGUuYWxsKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4gZGV0ZWN0aW9uTWV0aG9kKG4pKTtcbiAgY29uc3QgcHJlUmlnaHROb2RlcyA9IHBhdGguZmlsdGVyKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT5cbiAgICBkZXRlY3Rpb25NZXRob2QobilcbiAgKTtcblxuICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdDpcbiAgICAgIHJldHVybiBwb3N0UmlnaHROb2Rlcy5sZW5ndGggPiAwO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlByZTpcbiAgICAgIHJldHVybiBwcmVSaWdodE5vZGVzLmxlbmd0aCA+IDA7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuQm90aDpcbiAgICAgIHJldHVybiBwcmVSaWdodE5vZGVzLmxlbmd0aCA+IDAgfHwgcG9zdFJpZ2h0Tm9kZXMubGVuZ3RoID4gMDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5SaWdodFBhdGggPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZFxuKSA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNSaWdodE5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbkZpcnN0UmlnaHRQYXRoID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gaW5QYXRoKG5vZGUsIGlzRmlyc3RSaWdodE5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbkZpcnN0QnJhbmNoUmlnaHRQYXRoID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5QcmUsXG4gIHByZU5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIGlmICghaW5SaWdodFBhdGgobm9kZSkpIHJldHVybiBmYWxzZTtcblxuICBjb25zdCBwYXRoID0gcHJlTm9kZXMgPz8gbm9kZS5nZXRQYXRoKCk7XG4gIGNvbnN0IHBvc3RSaWdodE5vZGVzID0gcG9zdE5vZGVzID8/IG5vZGUuYWxsKCgpID0+IHRydWUpO1xuXG4gIGxldCByZXN1bHQgPSBbXTtcbiAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3Q6XG4gICAgICByZXN1bHQgPSBwb3N0UmlnaHROb2Rlcy5maWx0ZXIobiA9PiBuLmdldEluZGV4KCkgPiAwKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LlByZTpcbiAgICAgIHJlc3VsdCA9IHBhdGguZmlsdGVyKG4gPT4gbi5nZXRJbmRleCgpID4gMCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Cb3RoOlxuICAgICAgcmVzdWx0ID0gcGF0aC5jb25jYXQocG9zdFJpZ2h0Tm9kZXMpLmZpbHRlcihuID0+IG4uZ2V0SW5kZXgoKSA+IDApO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA9PT0gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBpbkNob2ljZVBhdGggPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNDaG9pY2VOb2RlLCBzdHJhdGVneSwgcHJlTm9kZXMsIHBvc3ROb2Rlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5UYXJnZXRQYXRoID0gaW5DaG9pY2VQYXRoO1xuXG5leHBvcnQgY29uc3QgaW5WYXJpYW50UGF0aCA9IChcbiAgbm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc1ZhcmlhbnROb2RlLCBzdHJhdGVneSwgcHJlTm9kZXMsIHBvc3ROb2Rlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5Xcm9uZ1BhdGggPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNXcm9uZ05vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlTnVtYmVyID0gKFxuICBuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgcGFyZW50PzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5cbikgPT4ge1xuICBjb25zdCBwYXRoID0gbi5nZXRQYXRoKCk7XG4gIGxldCBtb3Zlc0NvdW50ID0gcGF0aC5maWx0ZXIobiA9PiBpc01vdmVOb2RlKG4pKS5sZW5ndGg7XG4gIGlmIChwYXJlbnQpIHtcbiAgICBtb3Zlc0NvdW50ICs9IHBhcmVudC5nZXRQYXRoKCkuZmlsdGVyKG4gPT4gaXNNb3ZlTm9kZShuKSkubGVuZ3RoO1xuICB9XG4gIHJldHVybiBtb3Zlc0NvdW50O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNTSEEgPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgbW92ZVByb3BzOiBNb3ZlUHJvcFtdID0gW11cbikgPT4ge1xuICBsZXQgZnVsbG5hbWUgPSAnbic7XG4gIGlmIChtb3ZlUHJvcHMubGVuZ3RoID4gMCkge1xuICAgIGZ1bGxuYW1lICs9IGAke21vdmVQcm9wc1swXS50b2tlbn0ke21vdmVQcm9wc1swXS52YWx1ZX1gO1xuICB9XG5cbiAgaWYgKG5vZGUpIHtcbiAgICBjb25zdCBwYXRoID0gbm9kZS5nZXRQYXRoKCk7XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICBmdWxsbmFtZSA9XG4gICAgICAgIHBhdGgubWFwKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4gbi5tb2RlbC5pZCkuam9pbignPT4nKSArXG4gICAgICAgIGA9PiR7ZnVsbG5hbWV9YDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzaGEgPSBzaGEyNTYoZnVsbG5hbWUpLnRvU3RyaW5nKCkuc2xpY2UoMCwgNik7XG4gIHJldHVybiBzaGE7XG59O1xuXG5leHBvcnQgY29uc3QgX19jYWxjU0hBX0RlcHJlY2F0ZWQgPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgbW92ZVByb3BzOiBhbnkgPSBbXSxcbiAgc2V0dXBQcm9wczogYW55ID0gW11cbikgPT4ge1xuICBsZXQgbm9kZVR5cGUgPSAncic7XG4gIGlmIChtb3ZlUHJvcHMubGVuZ3RoID4gMCkgbm9kZVR5cGUgPSAnbSc7XG4gIGlmIChzZXR1cFByb3BzLmxlbmd0aCA+IDApIG5vZGVUeXBlID0gJ3MnO1xuXG4gIGxldCBuID0gYCR7bm9kZVR5cGV9YDtcbiAgaWYgKG1vdmVQcm9wcy5sZW5ndGggPiAwKSBuICs9IGAke21vdmVQcm9wc1swXS50b2tlbn0ke21vdmVQcm9wc1swXS52YWx1ZX1gO1xuXG4gIGxldCBmdWxsbmFtZSA9IG47XG4gIGlmIChub2RlKSB7XG4gICAgZnVsbG5hbWUgPVxuICAgICAgbm9kZVxuICAgICAgICAuZ2V0UGF0aCgpXG4gICAgICAgIC5tYXAoKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiBuLm1vZGVsLmlkKVxuICAgICAgICAuam9pbignPT4nKSArXG4gICAgICAnPT4nICtcbiAgICAgIG47XG4gIH1cblxuICBjb25zdCBzaGEgPSBzaGEyNTYoZnVsbG5hbWUpLnRvU3RyaW5nKCkuc2xpY2UoMCwgNik7XG4gIHJldHVybiBzaGE7XG59O1xuXG5leHBvcnQgY29uc3QgbkZvcm1hdHRlciA9IChudW06IG51bWJlciwgZml4ZWQgPSAxKSA9PiB7XG4gIGNvbnN0IGxvb2t1cCA9IFtcbiAgICB7dmFsdWU6IDEsIHN5bWJvbDogJyd9LFxuICAgIHt2YWx1ZTogMWUzLCBzeW1ib2w6ICdrJ30sXG4gICAge3ZhbHVlOiAxZTYsIHN5bWJvbDogJ00nfSxcbiAgICB7dmFsdWU6IDFlOSwgc3ltYm9sOiAnRyd9LFxuICAgIHt2YWx1ZTogMWUxMiwgc3ltYm9sOiAnVCd9LFxuICAgIHt2YWx1ZTogMWUxNSwgc3ltYm9sOiAnUCd9LFxuICAgIHt2YWx1ZTogMWUxOCwgc3ltYm9sOiAnRSd9LFxuICBdO1xuICBjb25zdCByeCA9IC9cXC4wKyR8KFxcLlswLTldKlsxLTldKTArJC87XG4gIGNvbnN0IGl0ZW0gPSBsb29rdXBcbiAgICAuc2xpY2UoKVxuICAgIC5yZXZlcnNlKClcbiAgICAuZmluZChpdGVtID0+IHtcbiAgICAgIHJldHVybiBudW0gPj0gaXRlbS52YWx1ZTtcbiAgICB9KTtcbiAgcmV0dXJuIGl0ZW1cbiAgICA/IChudW0gLyBpdGVtLnZhbHVlKS50b0ZpeGVkKGZpeGVkKS5yZXBsYWNlKHJ4LCAnJDEnKSArIGl0ZW0uc3ltYm9sXG4gICAgOiAnMCc7XG59O1xuXG5leHBvcnQgY29uc3QgcGF0aFRvSW5kZXhlcyA9IChwYXRoOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdKTogbnVtYmVyW10gPT4ge1xuICByZXR1cm4gcGF0aC5tYXAobiA9PiBuLm1vZGVsLmlkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9Jbml0aWFsU3RvbmVzID0gKFxuICBwYXRoOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdLFxuICB4T2Zmc2V0ID0gMCxcbiAgeU9mZnNldCA9IDBcbik6IHN0cmluZ1tdW10gPT4ge1xuICBjb25zdCBpbml0cyA9IHBhdGhcbiAgICAuZmlsdGVyKG4gPT4gbi5tb2RlbC5zZXR1cFByb3BzLmxlbmd0aCA+IDApXG4gICAgLm1hcChuID0+IHtcbiAgICAgIHJldHVybiBuLm1vZGVsLnNldHVwUHJvcHMubWFwKChzZXR1cDogU2V0dXBQcm9wKSA9PiB7XG4gICAgICAgIHJldHVybiBzZXR1cC52YWx1ZXMubWFwKCh2OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjb25zdCBhID0gQTFfTEVUVEVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHZbMF0pICsgeE9mZnNldF07XG4gICAgICAgICAgY29uc3QgYiA9IEExX05VTUJFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZih2WzFdKSArIHlPZmZzZXRdO1xuICAgICAgICAgIGNvbnN0IHRva2VuID0gc2V0dXAudG9rZW4gPT09ICdBQicgPyAnQicgOiAnVyc7XG4gICAgICAgICAgcmV0dXJuIFt0b2tlbiwgYSArIGJdO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICByZXR1cm4gZmxhdHRlbkRlcHRoKGluaXRzWzBdLCAxKTtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9BaU1vdmVzID0gKFxuICBwYXRoOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdLFxuICB4T2Zmc2V0ID0gMCxcbiAgeU9mZnNldCA9IDBcbikgPT4ge1xuICBjb25zdCBtb3ZlcyA9IHBhdGhcbiAgICAuZmlsdGVyKG4gPT4gbi5tb2RlbC5tb3ZlUHJvcHMubGVuZ3RoID4gMClcbiAgICAubWFwKG4gPT4ge1xuICAgICAgY29uc3QgcHJvcCA9IG4ubW9kZWwubW92ZVByb3BzWzBdO1xuICAgICAgY29uc3QgYSA9IEExX0xFVFRFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZihwcm9wLnZhbHVlWzBdKSArIHhPZmZzZXRdO1xuICAgICAgY29uc3QgYiA9IEExX05VTUJFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZihwcm9wLnZhbHVlWzFdKSArIHlPZmZzZXRdO1xuICAgICAgcmV0dXJuIFtwcm9wLnRva2VuLCBhICsgYl07XG4gICAgfSk7XG4gIHJldHVybiBtb3Zlcztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEZyb21BbmFseXNpcyA9IChhOiBBbmFseXNpcykgPT4ge1xuICBpZiAoL2luZGV4ZXMvLnRlc3QoYS5pZCkpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhLmlkKS5pbmRleGVzWzBdO1xuICB9XG4gIHJldHVybiAnJztcbn07XG5cbmV4cG9ydCBjb25zdCBpc01haW5QYXRoID0gKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIHJldHVybiBzdW0obm9kZS5nZXRQYXRoKCkubWFwKG4gPT4gbi5nZXRJbmRleCgpKSkgPT09IDA7XG59O1xuXG5leHBvcnQgY29uc3Qgc2dmVG9Qb3MgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qga2kgPSBzdHJbMF0gPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3QgdGVtcFN0ciA9IC9cXFsoLiopXFxdLy5leGVjKHN0cik7XG4gIGlmICh0ZW1wU3RyKSB7XG4gICAgY29uc3QgcG9zID0gdGVtcFN0clsxXTtcbiAgICBjb25zdCB4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihwb3NbMF0pO1xuICAgIGNvbnN0IHkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1sxXSk7XG4gICAgcmV0dXJuIHt4LCB5LCBraX07XG4gIH1cbiAgcmV0dXJuIHt4OiAtMSwgeTogLTEsIGtpOiAwfTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZUb0ExID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHt4LCB5fSA9IHNnZlRvUG9zKHN0cik7XG4gIHJldHVybiBBMV9MRVRURVJTW3hdICsgQTFfTlVNQkVSU1t5XTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvUG9zID0gKG1vdmU6IHN0cmluZykgPT4ge1xuICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pO1xuICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSk7XG4gIHJldHVybiB7eCwgeX07XG59O1xuXG5leHBvcnQgY29uc3QgYTFUb0luZGV4ID0gKG1vdmU6IHN0cmluZywgYm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3QgeCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKTtcbiAgY29uc3QgeSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpO1xuICByZXR1cm4geCAqIGJvYXJkU2l6ZSArIHk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2dmT2Zmc2V0ID0gKHNnZjogYW55LCBvZmZzZXQgPSAwKSA9PiB7XG4gIGlmIChvZmZzZXQgPT09IDApIHJldHVybiBzZ2Y7XG4gIGNvbnN0IHJlcyA9IGNsb25lKHNnZik7XG4gIGNvbnN0IGNoYXJJbmRleCA9IFNHRl9MRVRURVJTLmluZGV4T2Yoc2dmWzJdKSAtIG9mZnNldDtcbiAgcmV0dXJuIHJlcy5zdWJzdHIoMCwgMikgKyBTR0ZfTEVUVEVSU1tjaGFySW5kZXhdICsgcmVzLnN1YnN0cigyICsgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgYTFUb1NHRiA9IChzdHI6IGFueSwgdHlwZSA9ICdCJywgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwKSA9PiB7XG4gIGlmIChzdHIgPT09ICdwYXNzJykgcmV0dXJuIGAke3R5cGV9W11gO1xuICBjb25zdCBpbnggPSBBMV9MRVRURVJTLmluZGV4T2Yoc3RyWzBdKSArIG9mZnNldFg7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChzdHIuc3Vic3RyKDEpLCAwKSkgKyBvZmZzZXRZO1xuICBjb25zdCBzZ2YgPSBgJHt0eXBlfVske1NHRl9MRVRURVJTW2lueF19JHtTR0ZfTEVUVEVSU1tpbnldfV1gO1xuICByZXR1cm4gc2dmO1xufTtcblxuZXhwb3J0IGNvbnN0IHBvc1RvU2dmID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBraTogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGF4ID0gU0dGX0xFVFRFUlNbeF07XG4gIGNvbnN0IGF5ID0gU0dGX0xFVFRFUlNbeV07XG4gIGlmIChraSA9PT0gMCkgcmV0dXJuICcnO1xuICBpZiAoa2kgPT09IDEpIHJldHVybiBgQlske2F4fSR7YXl9XWA7XG4gIGlmIChraSA9PT0gLTEpIHJldHVybiBgV1ske2F4fSR7YXl9XWA7XG4gIHJldHVybiAnJztcbn07XG5cbmV4cG9ydCBjb25zdCBtYXRUb1Bvc2l0aW9uID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIHhPZmZzZXQ/OiBudW1iZXIsXG4gIHlPZmZzZXQ/OiBudW1iZXJcbikgPT4ge1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIHhPZmZzZXQgPSB4T2Zmc2V0ID8/IDA7XG4gIHlPZmZzZXQgPSB5T2Zmc2V0ID8/IERFRkFVTFRfQk9BUkRfU0laRSAtIG1hdC5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IHggPSBBMV9MRVRURVJTW2kgKyB4T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgeSA9IEExX05VTUJFUlNbaiArIHlPZmZzZXRdO1xuICAgICAgICBjb25zdCBjb2xvciA9IHZhbHVlID09PSAxID8gJ2InIDogJ3cnO1xuICAgICAgICByZXN1bHQgKz0gYCR7Y29sb3J9ICR7eH0ke3l9IGA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgbWF0VG9MaXN0T2ZUdXBsZXMgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgeE9mZnNldCA9IDAsXG4gIHlPZmZzZXQgPSAwXG4pID0+IHtcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG1hdFtpXVtqXTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICBjb25zdCB4ID0gQTFfTEVUVEVSU1tpICsgeE9mZnNldF07XG4gICAgICAgIGNvbnN0IHkgPSBBMV9OVU1CRVJTW2ogKyB5T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgY29sb3IgPSB2YWx1ZSA9PT0gMSA/ICdCJyA6ICdXJztcbiAgICAgICAgcmVzdWx0cy5wdXNoKFtjb2xvciwgeCArIHldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG5leHBvcnQgY29uc3QgY29udmVydFN0b25lVHlwZVRvU3RyaW5nID0gKHR5cGU6IGFueSkgPT4gKHR5cGUgPT09IDEgPyAnQicgOiAnVycpO1xuXG5leHBvcnQgY29uc3QgY29udmVydFN0ZXBzRm9yQUkgPSAoc3RlcHM6IGFueSwgb2Zmc2V0ID0gMCkgPT4ge1xuICBsZXQgcmVzID0gY2xvbmUoc3RlcHMpO1xuICByZXMgPSByZXMubWFwKChzOiBhbnkpID0+IHNnZk9mZnNldChzLCBvZmZzZXQpKTtcbiAgY29uc3QgaGVhZGVyID0gYCg7RkZbNF1HTVsxXVNaWyR7XG4gICAgMTkgLSBvZmZzZXRcbiAgfV1HTlsyMjZdUEJbQmxhY2tdSEFbMF1QV1tXaGl0ZV1LTVs3LjVdRFRbMjAxNy0wOC0wMV1UTVsxODAwXVJVW0NoaW5lc2VdQ1BbQ29weXJpZ2h0IGdob3N0LWdvLmNvbV1BUFtnaG9zdC1nby5jb21dUExbQmxhY2tdO2A7XG4gIGxldCBjb3VudCA9IDA7XG4gIGxldCBwcmV2ID0gJyc7XG4gIHN0ZXBzLmZvckVhY2goKHN0ZXA6IGFueSwgaW5kZXg6IGFueSkgPT4ge1xuICAgIGlmIChzdGVwWzBdID09PSBwcmV2WzBdKSB7XG4gICAgICBpZiAoc3RlcFswXSA9PT0gJ0InKSB7XG4gICAgICAgIHJlcy5zcGxpY2UoaW5kZXggKyBjb3VudCwgMCwgJ1dbdHRdJyk7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc3BsaWNlKGluZGV4ICsgY291bnQsIDAsICdCW3R0XScpO1xuICAgICAgICBjb3VudCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBwcmV2ID0gc3RlcDtcbiAgfSk7XG4gIHJldHVybiBgJHtoZWFkZXJ9JHtyZXMuam9pbignOycpfSlgO1xufTtcblxuZXhwb3J0IGNvbnN0IG9mZnNldEExTW92ZSA9IChtb3ZlOiBzdHJpbmcsIG94ID0gMCwgb3kgPSAwKSA9PiB7XG4gIGlmIChtb3ZlID09PSAncGFzcycpIHJldHVybiBtb3ZlO1xuICAvLyBjb25zb2xlLmxvZygnb3h5Jywgb3gsIG95KTtcbiAgY29uc3QgaW54ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pICsgb3g7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpICsgb3k7XG4gIC8vIGNvbnNvbGUubG9nKCdpbnh5JywgaW54LCBpbnksIGAke0ExX0xFVFRFUlNbaW54XX0ke0ExX05VTUJFUlNbaW55XX1gKTtcbiAgcmV0dXJuIGAke0ExX0xFVFRFUlNbaW54XX0ke0ExX05VTUJFUlNbaW55XX1gO1xufTtcblxuZXhwb3J0IGNvbnN0IHJldmVyc2VPZmZzZXRBMU1vdmUgPSAoXG4gIG1vdmU6IHN0cmluZyxcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBhbmFseXNpczogQW5hbHlzaXMsXG4gIGJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgaWYgKG1vdmUgPT09ICdwYXNzJykgcmV0dXJuIG1vdmU7XG4gIGNvbnN0IGlkT2JqID0gSlNPTi5wYXJzZShhbmFseXNpcy5pZCk7XG4gIGNvbnN0IHt4LCB5fSA9IHJldmVyc2VPZmZzZXQobWF0LCBpZE9iai5ieCwgaWRPYmouYnksIGJvYXJkU2l6ZSk7XG4gIGNvbnN0IGlueCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKSArIHg7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpICsgeTtcbiAgcmV0dXJuIGAke0ExX0xFVFRFUlNbaW54XX0ke0ExX05VTUJFUlNbaW55XX1gO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNTY29yZURpZmZUZXh0ID0gKFxuICByb290SW5mbz86IFJvb3RJbmZvIHwgbnVsbCxcbiAgY3VyckluZm8/OiBNb3ZlSW5mbyB8IFJvb3RJbmZvIHwgbnVsbCxcbiAgZml4ZWQgPSAxLFxuICByZXZlcnNlID0gZmFsc2VcbikgPT4ge1xuICBpZiAoIXJvb3RJbmZvIHx8ICFjdXJySW5mbykgcmV0dXJuICcnO1xuICBsZXQgc2NvcmUgPSBjYWxjU2NvcmVEaWZmKHJvb3RJbmZvLCBjdXJySW5mbyk7XG4gIGlmIChyZXZlcnNlKSBzY29yZSA9IC1zY29yZTtcbiAgY29uc3QgZml4ZWRTY29yZSA9IHNjb3JlLnRvRml4ZWQoZml4ZWQpO1xuXG4gIHJldHVybiBzY29yZSA+IDAgPyBgKyR7Zml4ZWRTY29yZX1gIDogYCR7Zml4ZWRTY29yZX1gO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNXaW5yYXRlRGlmZlRleHQgPSAoXG4gIHJvb3RJbmZvPzogUm9vdEluZm8gfCBudWxsLFxuICBjdXJySW5mbz86IE1vdmVJbmZvIHwgUm9vdEluZm8gfCBudWxsLFxuICBmaXhlZCA9IDEsXG4gIHJldmVyc2UgPSBmYWxzZVxuKSA9PiB7XG4gIGlmICghcm9vdEluZm8gfHwgIWN1cnJJbmZvKSByZXR1cm4gJyc7XG4gIGxldCB3aW5yYXRlID0gY2FsY1dpbnJhdGVEaWZmKHJvb3RJbmZvLCBjdXJySW5mbyk7XG4gIGlmIChyZXZlcnNlKSB3aW5yYXRlID0gLXdpbnJhdGU7XG4gIGNvbnN0IGZpeGVkV2lucmF0ZSA9IHdpbnJhdGUudG9GaXhlZChmaXhlZCk7XG5cbiAgcmV0dXJuIHdpbnJhdGUgPj0gMCA/IGArJHtmaXhlZFdpbnJhdGV9JWAgOiBgJHtmaXhlZFdpbnJhdGV9JWA7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1Njb3JlRGlmZiA9IChcbiAgcm9vdEluZm86IFJvb3RJbmZvLFxuICBjdXJySW5mbzogTW92ZUluZm8gfCBSb290SW5mb1xuKSA9PiB7XG4gIGNvbnN0IHNpZ24gPSByb290SW5mby5jdXJyZW50UGxheWVyID09PSAnQicgPyAxIDogLTE7XG4gIGNvbnN0IHNjb3JlID1cbiAgICBNYXRoLnJvdW5kKChjdXJySW5mby5zY29yZUxlYWQgLSByb290SW5mby5zY29yZUxlYWQpICogc2lnbiAqIDEwMDApIC8gMTAwMDtcblxuICByZXR1cm4gc2NvcmU7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1dpbnJhdGVEaWZmID0gKFxuICByb290SW5mbzogUm9vdEluZm8sXG4gIGN1cnJJbmZvOiBNb3ZlSW5mbyB8IFJvb3RJbmZvXG4pID0+IHtcbiAgY29uc3Qgc2lnbiA9IHJvb3RJbmZvLmN1cnJlbnRQbGF5ZXIgPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3Qgc2NvcmUgPVxuICAgIE1hdGgucm91bmQoKGN1cnJJbmZvLndpbnJhdGUgLSByb290SW5mby53aW5yYXRlKSAqIHNpZ24gKiAxMDAwICogMTAwKSAvXG4gICAgMTAwMDtcblxuICByZXR1cm4gc2NvcmU7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0FuYWx5c2lzUG9pbnRDb2xvciA9IChcbiAgcm9vdEluZm86IFJvb3RJbmZvLFxuICBtb3ZlSW5mbzogTW92ZUluZm9cbikgPT4ge1xuICBjb25zdCB7cHJpb3IsIG9yZGVyfSA9IG1vdmVJbmZvO1xuICBjb25zdCBzY29yZSA9IGNhbGNTY29yZURpZmYocm9vdEluZm8sIG1vdmVJbmZvKTtcbiAgbGV0IHBvaW50Q29sb3IgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpJztcbiAgaWYgKFxuICAgIHByaW9yID49IDAuNSB8fFxuICAgIChwcmlvciA+PSAwLjEgJiYgb3JkZXIgPCAzICYmIHNjb3JlID4gLTAuMykgfHxcbiAgICBvcmRlciA9PT0gMCB8fFxuICAgIHNjb3JlID49IDBcbiAgKSB7XG4gICAgcG9pbnRDb2xvciA9IExJR0hUX0dSRUVOX1JHQjtcbiAgfSBlbHNlIGlmICgocHJpb3IgPiAwLjA1ICYmIHNjb3JlID4gLTAuNSkgfHwgKHByaW9yID4gMC4wMSAmJiBzY29yZSA+IC0wLjEpKSB7XG4gICAgcG9pbnRDb2xvciA9IExJR0hUX1lFTExPV19SR0I7XG4gIH0gZWxzZSBpZiAocHJpb3IgPiAwLjAxICYmIHNjb3JlID4gLTEpIHtcbiAgICBwb2ludENvbG9yID0gWUVMTE9XX1JHQjtcbiAgfSBlbHNlIHtcbiAgICBwb2ludENvbG9yID0gTElHSFRfUkVEX1JHQjtcbiAgfVxuICByZXR1cm4gcG9pbnRDb2xvcjtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBHb0JhbkRldGVjdGlvbiA9IChwaXhlbERhdGEsIGNhbnZhcykgPT4ge1xuLy8gY29uc3QgY29sdW1ucyA9IGNhbnZhcy53aWR0aDtcbi8vIGNvbnN0IHJvd3MgPSBjYW52YXMuaGVpZ2h0O1xuLy8gY29uc3QgZGF0YVR5cGUgPSBKc0ZlYXQuVThDMV90O1xuLy8gY29uc3QgZGlzdE1hdHJpeFQgPSBuZXcgSnNGZWF0Lm1hdHJpeF90KGNvbHVtbnMsIHJvd3MsIGRhdGFUeXBlKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmdyYXlzY2FsZShwaXhlbERhdGEsIGNvbHVtbnMsIHJvd3MsIGRpc3RNYXRyaXhUKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmdhdXNzaWFuX2JsdXIoZGlzdE1hdHJpeFQsIGRpc3RNYXRyaXhULCAyLCAwKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmNhbm55KGRpc3RNYXRyaXhULCBkaXN0TWF0cml4VCwgNTAsIDUwKTtcblxuLy8gY29uc3QgbmV3UGl4ZWxEYXRhID0gbmV3IFVpbnQzMkFycmF5KHBpeGVsRGF0YS5idWZmZXIpO1xuLy8gY29uc3QgYWxwaGEgPSAoMHhmZiA8PCAyNCk7XG4vLyBsZXQgaSA9IGRpc3RNYXRyaXhULmNvbHMgKiBkaXN0TWF0cml4VC5yb3dzO1xuLy8gbGV0IHBpeCA9IDA7XG4vLyB3aGlsZSAoaSA+PSAwKSB7XG4vLyAgIHBpeCA9IGRpc3RNYXRyaXhULmRhdGFbaV07XG4vLyAgIG5ld1BpeGVsRGF0YVtpXSA9IGFscGhhIHwgKHBpeCA8PCAxNikgfCAocGl4IDw8IDgpIHwgcGl4O1xuLy8gICBpIC09IDE7XG4vLyB9XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFBBSSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICBjb25zdCBwYWkgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQUknKTtcbiAgaWYgKCFwYWkpIHJldHVybjtcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocGFpLnZhbHVlKTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0QW5zd2VyVHlwZSA9IChcbiAgbjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5cbik6IFBBVCB8IHVuZGVmaW5lZCA9PiB7XG4gIGNvbnN0IHBhdCA9IG4ubW9kZWwuY3VzdG9tUHJvcHMuZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BBVCcpO1xuICByZXR1cm4gcGF0Py52YWx1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0UEkgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgY29uc3QgcGkgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQSScpO1xuICBpZiAoIXBpKSByZXR1cm47XG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHBpLnZhbHVlKTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbml0Tm9kZURhdGEgPSAoc2hhOiBzdHJpbmcsIG51bWJlcj86IG51bWJlcik6IFNnZk5vZGUgPT4ge1xuICByZXR1cm4ge1xuICAgIGlkOiBzaGEsXG4gICAgbmFtZTogc2hhLFxuICAgIG51bWJlcjogbnVtYmVyIHx8IDAsXG4gICAgcm9vdFByb3BzOiBbXSxcbiAgICBtb3ZlUHJvcHM6IFtdLFxuICAgIHNldHVwUHJvcHM6IFtdLFxuICAgIG1hcmt1cFByb3BzOiBbXSxcbiAgICBnYW1lSW5mb1Byb3BzOiBbXSxcbiAgICBub2RlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBtb3ZlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBjdXN0b21Qcm9wczogW10sXG4gIH07XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGluaXRpYWwgcm9vdCBub2RlIG9mIHRoZSB0cmVlLlxuICpcbiAqIEBwYXJhbSByb290UHJvcHMgLSBUaGUgcm9vdCBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMgVGhlIGluaXRpYWwgcm9vdCBub2RlLlxuICovXG5leHBvcnQgY29uc3QgaW5pdGlhbFJvb3ROb2RlID0gKFxuICByb290UHJvcHMgPSBbXG4gICAgJ0ZGWzRdJyxcbiAgICAnR01bMV0nLFxuICAgICdDQVtVVEYtOF0nLFxuICAgICdBUFtnaG9zdGdvOjAuMS4wXScsXG4gICAgJ1NaWzE5XScsXG4gICAgJ1NUWzBdJyxcbiAgXVxuKSA9PiB7XG4gIGNvbnN0IHRyZWU6IFRyZWVNb2RlbCA9IG5ldyBUcmVlTW9kZWwoKTtcbiAgY29uc3Qgcm9vdCA9IHRyZWUucGFyc2Uoe1xuICAgIC8vICcxYjE2YjEnIGlzIHRoZSBTSEEyNTYgaGFzaCBvZiB0aGUgJ24nXG4gICAgaWQ6ICcxYjE2YjEnLFxuICAgIG5hbWU6IDAsXG4gICAgaW5kZXg6IDAsXG4gICAgbnVtYmVyOiAwLFxuICAgIHJvb3RQcm9wczogcm9vdFByb3BzLm1hcChwID0+IFJvb3RQcm9wLmZyb20ocCkpLFxuICAgIG1vdmVQcm9wczogW10sXG4gICAgc2V0dXBQcm9wczogW10sXG4gICAgbWFya3VwUHJvcHM6IFtdLFxuICAgIGdhbWVJbmZvUHJvcHM6IFtdLFxuICAgIG5vZGVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIG1vdmVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIGN1c3RvbVByb3BzOiBbXSxcbiAgfSk7XG4gIC8vIGNvbnN0IHNoYSA9IGNhbGNTSEEocm9vdCk7XG4gIC8vIHJvb3QubW9kZWwuaWQgPSBzaGE7XG4gIC8vIGNvbnNvbGUubG9nKCdyb290Jywgcm9vdCk7XG4gIC8vIGNvbnNvbGUubG9nKHNoYSk7XG4gIHJldHVybiByb290O1xufTtcblxuLyoqXG4gKiBCdWlsZHMgYSBuZXcgdHJlZSBub2RlIHdpdGggdGhlIGdpdmVuIG1vdmUsIHBhcmVudCBub2RlLCBhbmQgYWRkaXRpb25hbCBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSBtb3ZlIC0gVGhlIG1vdmUgdG8gYmUgYWRkZWQgdG8gdGhlIG5vZGUuXG4gKiBAcGFyYW0gcGFyZW50Tm9kZSAtIFRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgbmV3IG5vZGUuIE9wdGlvbmFsLlxuICogQHBhcmFtIHByb3BzIC0gQWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRvIGJlIGFkZGVkIHRvIHRoZSBuZXcgbm9kZS4gT3B0aW9uYWwuXG4gKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCB0cmVlIG5vZGUuXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZE1vdmVOb2RlID0gKFxuICBtb3ZlOiBzdHJpbmcsXG4gIHBhcmVudE5vZGU/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgcHJvcHM/OiBTZ2ZOb2RlT3B0aW9uc1xuKSA9PiB7XG4gIGNvbnN0IHRyZWU6IFRyZWVNb2RlbCA9IG5ldyBUcmVlTW9kZWwoKTtcbiAgY29uc3QgbW92ZVByb3AgPSBNb3ZlUHJvcC5mcm9tKG1vdmUpO1xuICBjb25zdCBzaGEgPSBjYWxjU0hBKHBhcmVudE5vZGUsIFttb3ZlUHJvcF0pO1xuICBsZXQgbnVtYmVyID0gMTtcbiAgaWYgKHBhcmVudE5vZGUpIG51bWJlciA9IGdldE5vZGVOdW1iZXIocGFyZW50Tm9kZSkgKyAxO1xuICBjb25zdCBub2RlRGF0YSA9IGluaXROb2RlRGF0YShzaGEsIG51bWJlcik7XG4gIG5vZGVEYXRhLm1vdmVQcm9wcyA9IFttb3ZlUHJvcF07XG4gIC8vIFRPRE86IFNob3VsZCBJIGFkZCB0aGlzP1xuICAvLyBub2RlRGF0YS5ub2RlQW5ub3RhdGlvblByb3BzID0gW05vZGVBbm5vdGF0aW9uUHJvcC5mcm9tKGBOWyR7c2hhfV1gKV07XG5cbiAgY29uc3Qgbm9kZSA9IHRyZWUucGFyc2Uoe1xuICAgIC4uLm5vZGVEYXRhLFxuICAgIC4uLnByb3BzLFxuICB9KTtcbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TGFzdEluZGV4ID0gKHJvb3Q6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGxldCBsYXN0Tm9kZSA9IHJvb3Q7XG4gIHJvb3Qud2Fsayhub2RlID0+IHtcbiAgICAvLyBIYWx0IHRoZSB0cmF2ZXJzYWwgYnkgcmV0dXJuaW5nIGZhbHNlXG4gICAgbGFzdE5vZGUgPSBub2RlO1xuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbiAgcmV0dXJuIGxhc3ROb2RlLm1vZGVsLmluZGV4O1xufTtcblxuZXhwb3J0IGNvbnN0IGN1dE1vdmVOb2RlcyA9IChcbiAgcm9vdDogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIHJldHVyblJvb3Q/OiBib29sZWFuXG4pID0+IHtcbiAgbGV0IG5vZGUgPSBjbG9uZURlZXAocm9vdCk7XG4gIHdoaWxlIChub2RlICYmIG5vZGUuaGFzQ2hpbGRyZW4oKSAmJiBub2RlLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICBub2RlLmNoaWxkcmVuID0gW107XG4gIH1cblxuICBpZiAocmV0dXJuUm9vdCkge1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUucGFyZW50ICYmICFub2RlLmlzUm9vdCgpKSB7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Um9vdCA9IChub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICBsZXQgcm9vdCA9IG5vZGU7XG4gIHdoaWxlIChyb290ICYmIHJvb3QucGFyZW50ICYmICFyb290LmlzUm9vdCgpKSB7XG4gICAgcm9vdCA9IHJvb3QucGFyZW50O1xuICB9XG4gIHJldHVybiByb290O1xufTtcblxuZXhwb3J0IGNvbnN0IHplcm9zID0gKHNpemU6IFtudW1iZXIsIG51bWJlcl0pOiBudW1iZXJbXVtdID0+XG4gIG5ldyBBcnJheShzaXplWzBdKS5maWxsKDApLm1hcCgoKSA9PiBuZXcgQXJyYXkoc2l6ZVsxXSkuZmlsbCgwKSk7XG5cbmV4cG9ydCBjb25zdCBlbXB0eSA9IChzaXplOiBbbnVtYmVyLCBudW1iZXJdKTogc3RyaW5nW11bXSA9PlxuICBuZXcgQXJyYXkoc2l6ZVswXSkuZmlsbCgnJykubWFwKCgpID0+IG5ldyBBcnJheShzaXplWzFdKS5maWxsKCcnKSk7XG5cbmV4cG9ydCBjb25zdCBjYWxjTW9zdCA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGxldCBsZWZ0TW9zdDogbnVtYmVyID0gYm9hcmRTaXplIC0gMTtcbiAgbGV0IHJpZ2h0TW9zdCA9IDA7XG4gIGxldCB0b3BNb3N0OiBudW1iZXIgPSBib2FyZFNpemUgLSAxO1xuICBsZXQgYm90dG9tTW9zdCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGlmIChsZWZ0TW9zdCA+IGkpIGxlZnRNb3N0ID0gaTtcbiAgICAgICAgaWYgKHJpZ2h0TW9zdCA8IGkpIHJpZ2h0TW9zdCA9IGk7XG4gICAgICAgIGlmICh0b3BNb3N0ID4gaikgdG9wTW9zdCA9IGo7XG4gICAgICAgIGlmIChib3R0b21Nb3N0IDwgaikgYm90dG9tTW9zdCA9IGo7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH07XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0NlbnRlciA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGNvbnN0IHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fSA9IGNhbGNNb3N0KG1hdCwgYm9hcmRTaXplKTtcbiAgY29uc3QgdG9wID0gdG9wTW9zdCA8IGJvYXJkU2l6ZSAtIDEgLSBib3R0b21Nb3N0O1xuICBjb25zdCBsZWZ0ID0gbGVmdE1vc3QgPCBib2FyZFNpemUgLSAxIC0gcmlnaHRNb3N0O1xuICBpZiAodG9wICYmIGxlZnQpIHJldHVybiBDZW50ZXIuVG9wTGVmdDtcbiAgaWYgKCF0b3AgJiYgbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21MZWZ0O1xuICBpZiAodG9wICYmICFsZWZ0KSByZXR1cm4gQ2VudGVyLlRvcFJpZ2h0O1xuICBpZiAoIXRvcCAmJiAhbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21SaWdodDtcbiAgcmV0dXJuIENlbnRlci5DZW50ZXI7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0JvYXJkU2l6ZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBib2FyZFNpemUgPSAxOSxcbiAgZXh0ZW50ID0gMlxuKTogbnVtYmVyW10gPT4ge1xuICBjb25zdCByZXN1bHQgPSBbMTksIDE5XTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQsIGJvYXJkU2l6ZSk7XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0KSB7XG4gICAgcmVzdWx0WzBdID0gcmlnaHRNb3N0ICsgZXh0ZW50ICsgMTtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW50ICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVudDtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW50ICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCkge1xuICAgIHJlc3VsdFswXSA9IHJpZ2h0TW9zdCArIGV4dGVudCArIDE7XG4gICAgcmVzdWx0WzFdID0gYm9hcmRTaXplIC0gdG9wTW9zdCArIGV4dGVudDtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVudDtcbiAgICByZXN1bHRbMV0gPSBib2FyZFNpemUgLSB0b3BNb3N0ICsgZXh0ZW50O1xuICB9XG4gIHJlc3VsdFswXSA9IE1hdGgubWluKHJlc3VsdFswXSwgYm9hcmRTaXplKTtcbiAgcmVzdWx0WzFdID0gTWF0aC5taW4ocmVzdWx0WzFdLCBib2FyZFNpemUpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1BhcnRpYWxBcmVhID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGV4dGVudCA9IDIsXG4gIGJvYXJkU2l6ZSA9IDE5XG4pOiBbW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXV0gPT4ge1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQpO1xuXG4gIGNvbnN0IHNpemUgPSBib2FyZFNpemUgLSAxO1xuICBjb25zdCB4MSA9IGxlZnRNb3N0IC0gZXh0ZW50IDwgMCA/IDAgOiBsZWZ0TW9zdCAtIGV4dGVudDtcbiAgY29uc3QgeTEgPSB0b3BNb3N0IC0gZXh0ZW50IDwgMCA/IDAgOiB0b3BNb3N0IC0gZXh0ZW50O1xuICBjb25zdCB4MiA9IHJpZ2h0TW9zdCArIGV4dGVudCA+IHNpemUgPyBzaXplIDogcmlnaHRNb3N0ICsgZXh0ZW50O1xuICBjb25zdCB5MiA9IGJvdHRvbU1vc3QgKyBleHRlbnQgPiBzaXplID8gc2l6ZSA6IGJvdHRvbU1vc3QgKyBleHRlbnQ7XG5cbiAgcmV0dXJuIFtcbiAgICBbeDEsIHkxXSxcbiAgICBbeDIsIHkyXSxcbiAgXTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQXZvaWRNb3Zlc0ZvclBhcnRpYWxBbmFseXNpcyA9IChcbiAgcGFydGlhbEFyZWE6IFtbbnVtYmVyLCBudW1iZXJdLCBbbnVtYmVyLCBudW1iZXJdXSxcbiAgYm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3QgW1t4MSwgeTFdLCBbeDIsIHkyXV0gPSBwYXJ0aWFsQXJlYTtcblxuICBmb3IgKGNvbnN0IGNvbCBvZiBBMV9MRVRURVJTLnNsaWNlKDAsIGJvYXJkU2l6ZSkpIHtcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiBBMV9OVU1CRVJTLnNsaWNlKC1ib2FyZFNpemUpKSB7XG4gICAgICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKGNvbCk7XG4gICAgICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHJvdyk7XG5cbiAgICAgIGlmICh4IDwgeDEgfHwgeCA+IHgyIHx8IHkgPCB5MSB8fCB5ID4geTIpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYCR7Y29sfSR7cm93fWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1RzdW1lZ29GcmFtZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBleHRlbnQ6IG51bWJlcixcbiAgYm9hcmRTaXplID0gMTksXG4gIGtvbWkgPSA3LjUsXG4gIHR1cm46IEtpID0gS2kuQmxhY2ssXG4gIGtvID0gZmFsc2Vcbik6IG51bWJlcltdW10gPT4ge1xuICBjb25zdCByZXN1bHQgPSBjbG9uZURlZXAobWF0KTtcbiAgY29uc3QgcGFydGlhbEFyZWEgPSBjYWxjUGFydGlhbEFyZWEobWF0LCBleHRlbnQsIGJvYXJkU2l6ZSk7XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcbiAgY29uc3QgcHV0Qm9yZGVyID0gKG1hdDogbnVtYmVyW11bXSkgPT4ge1xuICAgIGNvbnN0IFt4MSwgeTFdID0gcGFydGlhbEFyZWFbMF07XG4gICAgY29uc3QgW3gyLCB5Ml0gPSBwYXJ0aWFsQXJlYVsxXTtcbiAgICBmb3IgKGxldCBpID0geDE7IGkgPD0geDI7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IHkxOyBqIDw9IHkyOyBqKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAoKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCAmJlxuICAgICAgICAgICgoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAoKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCAmJlxuICAgICAgICAgICgoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApIHx8XG4gICAgICAgICAgICAoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGNlbnRlciA9PT0gQ2VudGVyLkNlbnRlcikge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHB1dE91dHNpZGUgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gICAgY29uc3Qgb2ZmZW5jZVRvV2luID0gMTA7XG4gICAgY29uc3Qgb2ZmZW5zZUtvbWkgPSB0dXJuICoga29taTtcbiAgICBjb25zdCBbeDEsIHkxXSA9IHBhcnRpYWxBcmVhWzBdO1xuICAgIGNvbnN0IFt4MiwgeTJdID0gcGFydGlhbEFyZWFbMV07XG4gICAgLy8gVE9ETzogSGFyZCBjb2RlIGZvciBub3dcbiAgICAvLyBjb25zdCBibGFja1RvQXR0YWNrID0gdHVybiA9PT0gS2kuQmxhY2s7XG4gICAgY29uc3QgYmxhY2tUb0F0dGFjayA9IHR1cm4gPT09IEtpLkJsYWNrO1xuICAgIGNvbnN0IGlzaXplID0geDIgLSB4MTtcbiAgICBjb25zdCBqc2l6ZSA9IHkyIC0geTE7XG4gICAgLy8gVE9ETzogMzYxIGlzIGhhcmRjb2RlZFxuICAgIC8vIGNvbnN0IGRlZmVuc2VBcmVhID0gTWF0aC5mbG9vcihcbiAgICAvLyAgICgzNjEgLSBpc2l6ZSAqIGpzaXplIC0gb2ZmZW5zZUtvbWkgLSBvZmZlbmNlVG9XaW4pIC8gMlxuICAgIC8vICk7XG4gICAgY29uc3QgZGVmZW5zZUFyZWEgPVxuICAgICAgTWF0aC5mbG9vcigoMzYxIC0gaXNpemUgKiBqc2l6ZSkgLyAyKSAtIG9mZmVuc2VLb21pIC0gb2ZmZW5jZVRvV2luO1xuXG4gICAgLy8gY29uc3QgZGVmZW5zZUFyZWEgPSAzMDtcblxuICAgIC8vIG91dHNpZGUgdGhlIGZyYW1lXG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkU2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkU2l6ZTsgaisrKSB7XG4gICAgICAgIGlmIChpIDwgeDEgfHwgaSA+IHgyIHx8IGogPCB5MSB8fCBqID4geTIpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIGxldCBraSA9IEtpLkVtcHR5O1xuICAgICAgICAgIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0IHx8IGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQpIHtcbiAgICAgICAgICAgIGtpID0gYmxhY2tUb0F0dGFjayAhPT0gY291bnQgPD0gZGVmZW5zZUFyZWEgPyBLaS5XaGl0ZSA6IEtpLkJsYWNrO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGtpID0gYmxhY2tUb0F0dGFjayAhPT0gY291bnQgPD0gZGVmZW5zZUFyZWEgPyBLaS5CbGFjayA6IEtpLldoaXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKGkgKyBqKSAlIDIgPT09IDAgJiYgTWF0aC5hYnMoY291bnQgLSBkZWZlbnNlQXJlYSkgPiBib2FyZFNpemUpIHtcbiAgICAgICAgICAgIGtpID0gS2kuRW1wdHk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWF0W2ldW2pdID0ga2k7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8vIFRPRE86XG4gIGNvbnN0IHB1dEtvVGhyZWF0ID0gKG1hdDogbnVtYmVyW11bXSwga286IGJvb2xlYW4pID0+IHt9O1xuXG4gIHB1dEJvcmRlcihyZXN1bHQpO1xuICBwdXRPdXRzaWRlKHJlc3VsdCk7XG5cbiAgLy8gY29uc3QgZmxpcFNwZWMgPVxuICAvLyAgIGltaW4gPCBqbWluXG4gIC8vICAgICA/IFtmYWxzZSwgZmFsc2UsIHRydWVdXG4gIC8vICAgICA6IFtuZWVkRmxpcChpbWluLCBpbWF4LCBpc2l6ZSksIG5lZWRGbGlwKGptaW4sIGptYXgsIGpzaXplKSwgZmFsc2VdO1xuXG4gIC8vIGlmIChmbGlwU3BlYy5pbmNsdWRlcyh0cnVlKSkge1xuICAvLyAgIGNvbnN0IGZsaXBwZWQgPSBmbGlwU3RvbmVzKHN0b25lcywgZmxpcFNwZWMpO1xuICAvLyAgIGNvbnN0IGZpbGxlZCA9IHRzdW1lZ29GcmFtZVN0b25lcyhmbGlwcGVkLCBrb21pLCBibGFja1RvUGxheSwga28sIG1hcmdpbik7XG4gIC8vICAgcmV0dXJuIGZsaXBTdG9uZXMoZmlsbGVkLCBmbGlwU3BlYyk7XG4gIC8vIH1cblxuICAvLyBjb25zdCBpMCA9IGltaW4gLSBtYXJnaW47XG4gIC8vIGNvbnN0IGkxID0gaW1heCArIG1hcmdpbjtcbiAgLy8gY29uc3QgajAgPSBqbWluIC0gbWFyZ2luO1xuICAvLyBjb25zdCBqMSA9IGptYXggKyBtYXJnaW47XG4gIC8vIGNvbnN0IGZyYW1lUmFuZ2U6IFJlZ2lvbiA9IFtpMCwgaTEsIGowLCBqMV07XG4gIC8vIGNvbnN0IGJsYWNrVG9BdHRhY2sgPSBndWVzc0JsYWNrVG9BdHRhY2soXG4gIC8vICAgW3RvcCwgYm90dG9tLCBsZWZ0LCByaWdodF0sXG4gIC8vICAgW2lzaXplLCBqc2l6ZV1cbiAgLy8gKTtcblxuICAvLyBwdXRCb3JkZXIobWF0LCBbaXNpemUsIGpzaXplXSwgZnJhbWVSYW5nZSwgYmxhY2tUb0F0dGFjayk7XG4gIC8vIHB1dE91dHNpZGUoXG4gIC8vICAgc3RvbmVzLFxuICAvLyAgIFtpc2l6ZSwganNpemVdLFxuICAvLyAgIGZyYW1lUmFuZ2UsXG4gIC8vICAgYmxhY2tUb0F0dGFjayxcbiAgLy8gICBibGFja1RvUGxheSxcbiAgLy8gICBrb21pXG4gIC8vICk7XG4gIC8vIHB1dEtvVGhyZWF0KFxuICAvLyAgIHN0b25lcyxcbiAgLy8gICBbaXNpemUsIGpzaXplXSxcbiAgLy8gICBmcmFtZVJhbmdlLFxuICAvLyAgIGJsYWNrVG9BdHRhY2ssXG4gIC8vICAgYmxhY2tUb1BsYXksXG4gIC8vICAga29cbiAgLy8gKTtcbiAgLy8gcmV0dXJuIHN0b25lcztcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNPZmZzZXQgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gIGNvbnN0IGJvYXJkU2l6ZSA9IGNhbGNCb2FyZFNpemUobWF0KTtcbiAgY29uc3Qgb3ggPSAxOSAtIGJvYXJkU2l6ZVswXTtcbiAgY29uc3Qgb3kgPSAxOSAtIGJvYXJkU2l6ZVsxXTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuXG4gIGxldCBvb3ggPSBveDtcbiAgbGV0IG9veSA9IG95O1xuICBzd2l0Y2ggKGNlbnRlcikge1xuICAgIGNhc2UgQ2VudGVyLlRvcExlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSBveTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Ub3BSaWdodDoge1xuICAgICAgb294ID0gLW94O1xuICAgICAgb295ID0gb3k7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tTGVmdDoge1xuICAgICAgb294ID0gMDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tUmlnaHQ6IHtcbiAgICAgIG9veCA9IC1veDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt4OiBvb3gsIHk6IG9veX07XG59O1xuXG5leHBvcnQgY29uc3QgcmV2ZXJzZU9mZnNldCA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBieCA9IDE5LFxuICBieSA9IDE5LFxuICBib2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGNvbnN0IG94ID0gYm9hcmRTaXplIC0gYng7XG4gIGNvbnN0IG95ID0gYm9hcmRTaXplIC0gYnk7XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcblxuICBsZXQgb294ID0gb3g7XG4gIGxldCBvb3kgPSBveTtcbiAgc3dpdGNoIChjZW50ZXIpIHtcbiAgICBjYXNlIENlbnRlci5Ub3BMZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gLW95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLlRvcFJpZ2h0OiB7XG4gICAgICBvb3ggPSBveDtcbiAgICAgIG9veSA9IC1veTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21MZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21SaWdodDoge1xuICAgICAgb294ID0gb3g7XG4gICAgICBvb3kgPSAwO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB7eDogb294LCB5OiBvb3l9O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNWaXNpYmxlQXJlYShcbiAgbWF0OiBudW1iZXJbXVtdID0gemVyb3MoWzE5LCAxOV0pLFxuICBleHRlbnQ6IG51bWJlcixcbiAgYWxsb3dSZWN0YW5nbGUgPSBmYWxzZVxuKTogbnVtYmVyW11bXSB7XG4gIGxldCBtaW5Sb3cgPSBtYXQubGVuZ3RoO1xuICBsZXQgbWF4Um93ID0gMDtcbiAgbGV0IG1pbkNvbCA9IG1hdFswXS5sZW5ndGg7XG4gIGxldCBtYXhDb2wgPSAwO1xuXG4gIGxldCBlbXB0eSA9IHRydWU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFswXS5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKG1hdFtpXVtqXSAhPT0gMCkge1xuICAgICAgICBlbXB0eSA9IGZhbHNlO1xuICAgICAgICBtaW5Sb3cgPSBNYXRoLm1pbihtaW5Sb3csIGkpO1xuICAgICAgICBtYXhSb3cgPSBNYXRoLm1heChtYXhSb3csIGkpO1xuICAgICAgICBtaW5Db2wgPSBNYXRoLm1pbihtaW5Db2wsIGopO1xuICAgICAgICBtYXhDb2wgPSBNYXRoLm1heChtYXhDb2wsIGopO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChlbXB0eSkge1xuICAgIHJldHVybiBbXG4gICAgICBbMCwgbWF0Lmxlbmd0aCAtIDFdLFxuICAgICAgWzAsIG1hdFswXS5sZW5ndGggLSAxXSxcbiAgICBdO1xuICB9XG5cbiAgaWYgKCFhbGxvd1JlY3RhbmdsZSkge1xuICAgIGNvbnN0IG1pblJvd1dpdGhFeHRlbnQgPSBNYXRoLm1heChtaW5Sb3cgLSBleHRlbnQsIDApO1xuICAgIGNvbnN0IG1heFJvd1dpdGhFeHRlbnQgPSBNYXRoLm1pbihtYXhSb3cgKyBleHRlbnQsIG1hdC5sZW5ndGggLSAxKTtcbiAgICBjb25zdCBtaW5Db2xXaXRoRXh0ZW50ID0gTWF0aC5tYXgobWluQ29sIC0gZXh0ZW50LCAwKTtcbiAgICBjb25zdCBtYXhDb2xXaXRoRXh0ZW50ID0gTWF0aC5taW4obWF4Q29sICsgZXh0ZW50LCBtYXRbMF0ubGVuZ3RoIC0gMSk7XG5cbiAgICBjb25zdCBtYXhSYW5nZSA9IE1hdGgubWF4KFxuICAgICAgbWF4Um93V2l0aEV4dGVudCAtIG1pblJvd1dpdGhFeHRlbnQsXG4gICAgICBtYXhDb2xXaXRoRXh0ZW50IC0gbWluQ29sV2l0aEV4dGVudFxuICAgICk7XG5cbiAgICBtaW5Sb3cgPSBtaW5Sb3dXaXRoRXh0ZW50O1xuICAgIG1heFJvdyA9IG1pblJvdyArIG1heFJhbmdlO1xuXG4gICAgaWYgKG1heFJvdyA+PSBtYXQubGVuZ3RoKSB7XG4gICAgICBtYXhSb3cgPSBtYXQubGVuZ3RoIC0gMTtcbiAgICAgIG1pblJvdyA9IG1heFJvdyAtIG1heFJhbmdlO1xuICAgIH1cblxuICAgIG1pbkNvbCA9IG1pbkNvbFdpdGhFeHRlbnQ7XG4gICAgbWF4Q29sID0gbWluQ29sICsgbWF4UmFuZ2U7XG4gICAgaWYgKG1heENvbCA+PSBtYXRbMF0ubGVuZ3RoKSB7XG4gICAgICBtYXhDb2wgPSBtYXRbMF0ubGVuZ3RoIC0gMTtcbiAgICAgIG1pbkNvbCA9IG1heENvbCAtIG1heFJhbmdlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBtaW5Sb3cgPSBNYXRoLm1heCgwLCBtaW5Sb3cgLSBleHRlbnQpO1xuICAgIG1heFJvdyA9IE1hdGgubWluKG1hdC5sZW5ndGggLSAxLCBtYXhSb3cgKyBleHRlbnQpO1xuICAgIG1pbkNvbCA9IE1hdGgubWF4KDAsIG1pbkNvbCAtIGV4dGVudCk7XG4gICAgbWF4Q29sID0gTWF0aC5taW4obWF0WzBdLmxlbmd0aCAtIDEsIG1heENvbCArIGV4dGVudCk7XG4gIH1cblxuICByZXR1cm4gW1xuICAgIFttaW5Sb3csIG1heFJvd10sXG4gICAgW21pbkNvbCwgbWF4Q29sXSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmUobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikge1xuICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybiBtYXQ7XG4gIGNvbnN0IG5ld01hdCA9IGNsb25lRGVlcChtYXQpO1xuICBuZXdNYXRbaV1bal0gPSBraTtcbiAgcmV0dXJuIGV4ZWNDYXB0dXJlKG5ld01hdCwgaSwgaiwgLWtpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dLaShtYXQ6IG51bWJlcltdW10sIHN0ZXBzOiBzdHJpbmdbXSwgaXNDYXB0dXJlZCA9IHRydWUpIHtcbiAgbGV0IG5ld01hdCA9IGNsb25lRGVlcChtYXQpO1xuICBsZXQgaGFzTW92ZWQgPSBmYWxzZTtcbiAgc3RlcHMuZm9yRWFjaChzdHIgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAga2ksXG4gICAgfToge1xuICAgICAgeDogbnVtYmVyO1xuICAgICAgeTogbnVtYmVyO1xuICAgICAga2k6IG51bWJlcjtcbiAgICB9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgICBpZiAoaXNDYXB0dXJlZCkge1xuICAgICAgaWYgKGNhbk1vdmUobmV3TWF0LCB4LCB5LCBraSkpIHtcbiAgICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICAgIG5ld01hdCA9IGV4ZWNDYXB0dXJlKG5ld01hdCwgeCwgeSwgLWtpKTtcbiAgICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJyYW5nZW1lbnQ6IG5ld01hdCxcbiAgICBoYXNNb3ZlZCxcbiAgfTtcbn1cblxuLy8gVE9ETzpcbmV4cG9ydCBjb25zdCBoYW5kbGVNb3ZlID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICB0dXJuOiBLaSxcbiAgY3VycmVudE5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBvbkFmdGVyTW92ZTogKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LCBpc01vdmVkOiBib29sZWFuKSA9PiB2b2lkXG4pID0+IHtcbiAgaWYgKHR1cm4gPT09IEtpLkVtcHR5KSByZXR1cm47XG4gIGlmIChjYW5Nb3ZlKG1hdCwgaSwgaiwgdHVybikpIHtcbiAgICAvLyBkaXNwYXRjaCh1aVNsaWNlLmFjdGlvbnMuc2V0VHVybigtdHVybikpO1xuICAgIGNvbnN0IHZhbHVlID0gU0dGX0xFVFRFUlNbaV0gKyBTR0ZfTEVUVEVSU1tqXTtcbiAgICBjb25zdCB0b2tlbiA9IHR1cm4gPT09IEtpLkJsYWNrID8gJ0InIDogJ1cnO1xuICAgIGNvbnN0IHNoYSA9IGNhbGNTSEEoY3VycmVudE5vZGUsIFtNb3ZlUHJvcC5mcm9tKGAke3Rva2VufVske3ZhbHVlfV1gKV0pO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gY3VycmVudE5vZGUuY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgKG46IGFueSkgPT4gbi5tb2RlbC5pZCA9PT0gc2hhXG4gICAgKTtcbiAgICBsZXQgbm9kZTtcbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgbm9kZSA9IGZpbHRlcmVkWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gYnVpbGRNb3ZlTm9kZShgJHt0b2tlbn1bJHt2YWx1ZX1dYCwgY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGlmIChvbkFmdGVyTW92ZSkgb25BZnRlck1vdmUobm9kZSwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9uQWZ0ZXJNb3ZlKSBvbkFmdGVyTW92ZShjdXJyZW50Tm9kZSwgZmFsc2UpO1xuICB9XG59O1xuXG4vKipcbiAqIENsZWFyIHN0b25lIGZyb20gdGhlIGN1cnJlbnROb2RlXG4gKiBAcGFyYW0gY3VycmVudE5vZGVcbiAqIEBwYXJhbSB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgY2xlYXJTdG9uZUZyb21DdXJyZW50Tm9kZSA9IChcbiAgY3VycmVudE5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICB2YWx1ZTogc3RyaW5nXG4pID0+IHtcbiAgY29uc3QgcGF0aCA9IGN1cnJlbnROb2RlLmdldFBhdGgoKTtcbiAgcGF0aC5mb3JFYWNoKG5vZGUgPT4ge1xuICAgIGNvbnN0IHtzZXR1cFByb3BzfSA9IG5vZGUubW9kZWw7XG4gICAgaWYgKHNldHVwUHJvcHMuZmlsdGVyKChzOiBTZXR1cFByb3ApID0+IHMudmFsdWUgPT09IHZhbHVlKS5sZW5ndGggPiAwKSB7XG4gICAgICBub2RlLm1vZGVsLnNldHVwUHJvcHMgPSBzZXR1cFByb3BzLmZpbHRlcigoczogYW55KSA9PiBzLnZhbHVlICE9PSB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldHVwUHJvcHMuZm9yRWFjaCgoczogU2V0dXBQcm9wKSA9PiB7XG4gICAgICAgIHMudmFsdWVzID0gcy52YWx1ZXMuZmlsdGVyKHYgPT4gdiAhPT0gdmFsdWUpO1xuICAgICAgICBpZiAocy52YWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgbm9kZS5tb2RlbC5zZXR1cFByb3BzID0gbm9kZS5tb2RlbC5zZXR1cFByb3BzLmZpbHRlcihcbiAgICAgICAgICAgIChwOiBTZXR1cFByb3ApID0+IHAudG9rZW4gIT09IHMudG9rZW5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBBZGRzIGEgc3RvbmUgdG8gdGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqXG4gKiBAcGFyYW0gY3VycmVudE5vZGUgVGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIEBwYXJhbSBtYXQgVGhlIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIGJvYXJkLlxuICogQHBhcmFtIGkgVGhlIHJvdyBpbmRleCBvZiB0aGUgc3RvbmUuXG4gKiBAcGFyYW0gaiBUaGUgY29sdW1uIGluZGV4IG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSBraSBUaGUgY29sb3Igb2YgdGhlIHN0b25lIChLaS5XaGl0ZSBvciBLaS5CbGFjaykuXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBzdG9uZSB3YXMgcmVtb3ZlZCBmcm9tIHByZXZpb3VzIG5vZGVzLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRTdG9uZVRvQ3VycmVudE5vZGUgPSAoXG4gIGN1cnJlbnROb2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBpOiBudW1iZXIsXG4gIGo6IG51bWJlcixcbiAga2k6IEtpXG4pID0+IHtcbiAgY29uc3QgdmFsdWUgPSBTR0ZfTEVUVEVSU1tpXSArIFNHRl9MRVRURVJTW2pdO1xuICBjb25zdCB0b2tlbiA9IGtpID09PSBLaS5XaGl0ZSA/ICdBVycgOiAnQUInO1xuICBjb25zdCBwcm9wID0gZmluZFByb3AoY3VycmVudE5vZGUsIHRva2VuKTtcbiAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICBpZiAobWF0W2ldW2pdICE9PSBLaS5FbXB0eSkge1xuICAgIGNsZWFyU3RvbmVGcm9tQ3VycmVudE5vZGUoY3VycmVudE5vZGUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvcCkge1xuICAgICAgcHJvcC52YWx1ZXMgPSBbLi4ucHJvcC52YWx1ZXMsIHZhbHVlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE5vZGUubW9kZWwuc2V0dXBQcm9wcyA9IFtcbiAgICAgICAgLi4uY3VycmVudE5vZGUubW9kZWwuc2V0dXBQcm9wcyxcbiAgICAgICAgbmV3IFNldHVwUHJvcCh0b2tlbiwgdmFsdWUpLFxuICAgICAgXTtcbiAgICB9XG4gICAgcmVzdWx0ID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBBZGRzIGEgbW92ZSB0byB0aGUgZ2l2ZW4gbWF0cml4IGFuZCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBJZiB0aGUga2kgaXMgZW1wdHksIG5vIG1vdmUgaXMgYWRkZWQgYW5kIG51bGwgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIG1hdCAtIFRoZSBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSBnYW1lIGJvYXJkLlxuICogQHBhcmFtIGN1cnJlbnROb2RlIC0gVGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIEBwYXJhbSBpIC0gVGhlIHJvdyBpbmRleCBvZiB0aGUgbW92ZS5cbiAqIEBwYXJhbSBqIC0gVGhlIGNvbHVtbiBpbmRleCBvZiB0aGUgbW92ZS5cbiAqIEBwYXJhbSBraSAtIFRoZSB0eXBlIG9mIG1vdmUgKEtpKS5cbiAqIEByZXR1cm5zIFRoZSBjb3JyZXNwb25kaW5nIG5vZGUgaW4gdGhlIHRyZWUsIG9yIG51bGwgaWYgbm8gbW92ZSBpcyBhZGRlZC5cbiAqL1xuLy8gVE9ETzogVGhlIHBhcmFtcyBoZXJlIGlzIHdlaXJkXG5leHBvcnQgY29uc3QgYWRkTW92ZVRvQ3VycmVudE5vZGUgPSAoXG4gIGN1cnJlbnROb2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBpOiBudW1iZXIsXG4gIGo6IG51bWJlcixcbiAga2k6IEtpXG4pID0+IHtcbiAgaWYgKGtpID09PSBLaS5FbXB0eSkgcmV0dXJuO1xuICBsZXQgbm9kZTtcbiAgaWYgKGNhbk1vdmUobWF0LCBpLCBqLCBraSkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IFNHRl9MRVRURVJTW2ldICsgU0dGX0xFVFRFUlNbal07XG4gICAgY29uc3QgdG9rZW4gPSBraSA9PT0gS2kuQmxhY2sgPyAnQicgOiAnVyc7XG4gICAgY29uc3Qgc2hhID0gY2FsY1NIQShjdXJyZW50Tm9kZSwgW01vdmVQcm9wLmZyb20oYCR7dG9rZW59WyR7dmFsdWV9XWApXSk7XG4gICAgY29uc3QgZmlsdGVyZWQgPSBjdXJyZW50Tm9kZS5jaGlsZHJlbi5maWx0ZXIoXG4gICAgICAobjogYW55KSA9PiBuLm1vZGVsLmlkID09PSBzaGFcbiAgICApO1xuICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICBub2RlID0gZmlsdGVyZWRbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSBidWlsZE1vdmVOb2RlKGAke3Rva2VufVske3ZhbHVlfV1gLCBjdXJyZW50Tm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChub2RlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1ByZXZlbnRNb3ZlTWF0ID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgaWYgKCFub2RlKSByZXR1cm4gemVyb3MoW2RlZmF1bHRCb2FyZFNpemUsIGRlZmF1bHRCb2FyZFNpemVdKTtcbiAgY29uc3Qgc2l6ZSA9IGV4dHJhY3RCb2FyZFNpemUobm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGNvbnN0IHByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgY29uc3QgZm9yY2VOb2RlcyA9IFtdO1xuICBsZXQgcHJldmVudE1vdmVOb2RlcyA9IFtdO1xuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgcHJldmVudE1vdmVOb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT5cbiAgICAgIGlzUHJldmVudE1vdmVOb2RlKG4pXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpc0ZvcmNlTm9kZShub2RlKSkge1xuICAgIHByZXZlbnRNb3ZlTWF0LmZvckVhY2gocm93ID0+IHJvdy5maWxsKDEpKTtcbiAgICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gICAgICAgIG4ubW9kZWwubW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICAgIHByZXZlbnRNb3ZlTWF0W2ldW2pdID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJldmVudE1vdmVOb2Rlcy5mb3JFYWNoKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICAgICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgIHByZXZlbnRNb3ZlTWF0W2ldW2pdID0gMTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcHJldmVudE1vdmVNYXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIG1hcmt1cCBtYXRyaXggZm9yIHZhcmlhdGlvbnMgaW4gYSBnaXZlbiBTR0Ygbm9kZS5cbiAqXG4gKiBAcGFyYW0gbm9kZSAtIFRoZSBTR0Ygbm9kZSB0byBjYWxjdWxhdGUgdGhlIG1hcmt1cCBmb3IuXG4gKiBAcGFyYW0gcG9saWN5IC0gVGhlIHBvbGljeSBmb3IgaGFuZGxpbmcgdGhlIG1hcmt1cC4gRGVmYXVsdHMgdG8gJ2FwcGVuZCcuXG4gKiBAcmV0dXJucyBUaGUgY2FsY3VsYXRlZCBtYXJrdXAgZm9yIHRoZSB2YXJpYXRpb25zLlxuICovXG5leHBvcnQgY29uc3QgY2FsY1ZhcmlhdGlvbnNNYXJrdXAgPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBwb2xpY3k6ICdhcHBlbmQnIHwgJ3ByZXBlbmQnIHwgJ3JlcGxhY2UnID0gJ2FwcGVuZCcsXG4gIGRlZmF1bHRCb2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGNvbnN0IHJlcyA9IGNhbGNNYXRBbmRNYXJrdXAobm9kZSk7XG4gIGNvbnN0IHttYXQsIG1hcmt1cH0gPSByZXM7XG4gIGNvbnN0IHNpemUgPSBleHRyYWN0Qm9hcmRTaXplKG5vZGUsIGRlZmF1bHRCb2FyZFNpemUpO1xuXG4gIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gICAgICBuLm1vZGVsLm1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICBsZXQgbWFyayA9IE1hcmt1cC5OZXV0cmFsTm9kZTtcbiAgICAgICAgICBpZiAoaW5Xcm9uZ1BhdGgobikpIG1hcmsgPSBNYXJrdXAuTmVnYXRpdmVOb2RlO1xuICAgICAgICAgIGlmIChpblJpZ2h0UGF0aChuKSkgbWFyayA9IE1hcmt1cC5Qb3NpdGl2ZU5vZGU7XG4gICAgICAgICAgaWYgKG1hdFtpXVtqXSA9PT0gS2kuRW1wdHkpIHtcbiAgICAgICAgICAgIHN3aXRjaCAocG9saWN5KSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3ByZXBlbmQnOlxuICAgICAgICAgICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcmsgKyAnfCcgKyBtYXJrdXBbaV1bal07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2UnOlxuICAgICAgICAgICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcms7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcGVuZCc6XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbWFya3VwW2ldW2pdICs9ICd8JyArIG1hcms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBtYXJrdXA7XG59O1xuXG5leHBvcnQgY29uc3QgZGV0ZWN0U1QgPSAobm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgLy8gUmVmZXJlbmNlOiBodHRwczovL3d3dy5yZWQtYmVhbi5jb20vc2dmL3Byb3BlcnRpZXMuaHRtbCNTVFxuICBjb25zdCByb290ID0gbm9kZS5nZXRQYXRoKClbMF07XG4gIGNvbnN0IHN0UHJvcCA9IHJvb3QubW9kZWwucm9vdFByb3BzLmZpbmQoKHA6IFJvb3RQcm9wKSA9PiBwLnRva2VuID09PSAnU1QnKTtcbiAgbGV0IHNob3dWYXJpYXRpb25zTWFya3VwID0gZmFsc2U7XG4gIGxldCBzaG93Q2hpbGRyZW5NYXJrdXAgPSBmYWxzZTtcbiAgbGV0IHNob3dTaWJsaW5nc01hcmt1cCA9IGZhbHNlO1xuXG4gIGNvbnN0IHN0ID0gc3RQcm9wPy52YWx1ZSB8fCAnMCc7XG4gIGlmIChzdCkge1xuICAgIGlmIChzdCA9PT0gJzAnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IHRydWU7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzEnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSB0cnVlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gZmFsc2U7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzInKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IHRydWU7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoc3QgPT09ICczJykge1xuICAgICAgc2hvd1NpYmxpbmdzTWFya3VwID0gdHJ1ZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IGZhbHNlO1xuICAgICAgc2hvd1ZhcmlhdGlvbnNNYXJrdXAgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtzaG93VmFyaWF0aW9uc01hcmt1cCwgc2hvd0NoaWxkcmVuTWFya3VwLCBzaG93U2libGluZ3NNYXJrdXB9O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBtYXQgYW5kIG1hcmt1cCBhcnJheXMgYmFzZWQgb24gdGhlIGN1cnJlbnROb2RlIGFuZCBkZWZhdWx0Qm9hcmRTaXplLlxuICogQHBhcmFtIGN1cnJlbnROb2RlIFRoZSBjdXJyZW50IG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBAcGFyYW0gZGVmYXVsdEJvYXJkU2l6ZSBUaGUgZGVmYXVsdCBzaXplIG9mIHRoZSBib2FyZCAob3B0aW9uYWwsIGRlZmF1bHQgaXMgMTkpLlxuICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hdC92aXNpYmxlQXJlYU1hdC9tYXJrdXAvbnVtTWFya3VwIGFycmF5cy5cbiAqL1xuZXhwb3J0IGNvbnN0IGNhbGNNYXRBbmRNYXJrdXAgPSAoXG4gIGN1cnJlbnROb2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgY29uc3QgcGF0aCA9IGN1cnJlbnROb2RlLmdldFBhdGgoKTtcbiAgY29uc3Qgcm9vdCA9IHBhdGhbMF07XG5cbiAgbGV0IGxpLCBsajtcbiAgbGV0IHNldHVwQ291bnQgPSAwO1xuICBjb25zdCBzaXplID0gZXh0cmFjdEJvYXJkU2l6ZShjdXJyZW50Tm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGxldCBtYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICBjb25zdCB2aXNpYmxlQXJlYU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IG1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IG51bU1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG5cbiAgcGF0aC5mb3JFYWNoKChub2RlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHttb3ZlUHJvcHMsIHNldHVwUHJvcHMsIHJvb3RQcm9wc30gPSBub2RlLm1vZGVsO1xuICAgIGlmIChzZXR1cFByb3BzLmxlbmd0aCA+IDApIHNldHVwQ291bnQgKz0gMTtcblxuICAgIHNldHVwUHJvcHMuZm9yRWFjaCgoc2V0dXA6IGFueSkgPT4ge1xuICAgICAgc2V0dXAudmFsdWVzLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMF0pO1xuICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVsxXSk7XG4gICAgICAgIGxpID0gaTtcbiAgICAgICAgbGogPSBqO1xuICAgICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSBzZXR1cC50b2tlbiA9PT0gJ0FCJyA/IDEgOiAtMTtcbiAgICAgICAgICBpZiAoc2V0dXAudG9rZW4gPT09ICdBRScpIG1hdFtpXVtqXSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgbW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm47XG4gICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgbGkgPSBpO1xuICAgICAgICBsaiA9IGo7XG4gICAgICAgIG1hdCA9IG1vdmUobWF0LCBpLCBqLCBtLnRva2VuID09PSAnQicgPyBLaS5CbGFjayA6IEtpLldoaXRlKTtcblxuICAgICAgICBpZiAobGkgIT09IHVuZGVmaW5lZCAmJiBsaiAhPT0gdW5kZWZpbmVkICYmIGxpID49IDAgJiYgbGogPj0gMCkge1xuICAgICAgICAgIG51bU1hcmt1cFtsaV1bbGpdID0gKFxuICAgICAgICAgICAgbm9kZS5tb2RlbC5udW1iZXIgfHwgaW5kZXggLSBzZXR1cENvdW50XG4gICAgICAgICAgKS50b1N0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSBwYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBtYXJrdXBbbGldW2xqXSA9IE1hcmt1cC5DdXJyZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDbGVhciBudW1iZXIgd2hlbiBzdG9uZXMgYXJlIGNhcHR1cmVkXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGlmIChtYXRbaV1bal0gPT09IDApIG51bU1hcmt1cFtpXVtqXSA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gQ2FsY3VsYXRpbmcgdGhlIHZpc2libGUgYXJlYVxuICBpZiAocm9vdCkge1xuICAgIHJvb3QuYWxsKChub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICAgICAgY29uc3Qge21vdmVQcm9wcywgc2V0dXBQcm9wcywgcm9vdFByb3BzfSA9IG5vZGUubW9kZWw7XG4gICAgICBpZiAoc2V0dXBQcm9wcy5sZW5ndGggPiAwKSBzZXR1cENvdW50ICs9IDE7XG4gICAgICBzZXR1cFByb3BzLmZvckVhY2goKHNldHVwOiBhbnkpID0+IHtcbiAgICAgICAgc2V0dXAudmFsdWVzLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVswXSk7XG4gICAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMV0pO1xuICAgICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgICB2aXNpYmxlQXJlYU1hdFtpXVtqXSA9IEtpLkJsYWNrO1xuICAgICAgICAgICAgaWYgKHNldHVwLnRva2VuID09PSAnQUUnKSB2aXNpYmxlQXJlYU1hdFtpXVtqXSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBtb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICAgIHZpc2libGVBcmVhTWF0W2ldW2pdID0gS2kuQmxhY2s7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG1hcmt1cFByb3BzID0gY3VycmVudE5vZGUubW9kZWwubWFya3VwUHJvcHM7XG4gIG1hcmt1cFByb3BzLmZvckVhY2goKG06IE1hcmt1cFByb3ApID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IG0udG9rZW47XG4gICAgY29uc3QgdmFsdWVzID0gbS52YWx1ZXM7XG4gICAgdmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMF0pO1xuICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMV0pO1xuICAgICAgaWYgKGkgPCAwIHx8IGogPCAwKSByZXR1cm47XG4gICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgbGV0IG1hcms7XG4gICAgICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgICBjYXNlICdDUic6XG4gICAgICAgICAgICBtYXJrID0gTWFya3VwLkNpcmNsZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1NRJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuU3F1YXJlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnVFInOlxuICAgICAgICAgICAgbWFyayA9IE1hcmt1cC5UcmlhbmdsZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ01BJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuQ3Jvc3M7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBtYXJrID0gdmFsdWUuc3BsaXQoJzonKVsxXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWFya3VwW2ldW2pdID0gbWFyaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gaWYgKFxuICAvLyAgIGxpICE9PSB1bmRlZmluZWQgJiZcbiAgLy8gICBsaiAhPT0gdW5kZWZpbmVkICYmXG4gIC8vICAgbGkgPj0gMCAmJlxuICAvLyAgIGxqID49IDAgJiZcbiAgLy8gICAhbWFya3VwW2xpXVtsal1cbiAgLy8gKSB7XG4gIC8vICAgbWFya3VwW2xpXVtsal0gPSBNYXJrdXAuQ3VycmVudDtcbiAgLy8gfVxuXG4gIHJldHVybiB7bWF0LCB2aXNpYmxlQXJlYU1hdCwgbWFya3VwLCBudW1NYXJrdXB9O1xufTtcblxuLyoqXG4gKiBGaW5kcyBhIHByb3BlcnR5IGluIHRoZSBnaXZlbiBub2RlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAqIEBwYXJhbSBub2RlIFRoZSBub2RlIHRvIHNlYXJjaCBmb3IgdGhlIHByb3BlcnR5LlxuICogQHBhcmFtIHRva2VuIFRoZSB0b2tlbiBvZiB0aGUgcHJvcGVydHkgdG8gZmluZC5cbiAqIEByZXR1cm5zIFRoZSBmb3VuZCBwcm9wZXJ0eSBvciBudWxsIGlmIG5vdCBmb3VuZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGZpbmRQcm9wID0gKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LCB0b2tlbjogc3RyaW5nKSA9PiB7XG4gIGlmICghbm9kZSkgcmV0dXJuO1xuICBpZiAoTU9WRV9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubW92ZVByb3BzLmZpbmQoKHA6IE1vdmVQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcy5maW5kKFxuICAgICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVBbm5vdGF0aW9uUHJvcHMuZmluZChcbiAgICAgIChwOiBNb3ZlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICBpZiAoUk9PVF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwucm9vdFByb3BzLmZpbmQoKHA6IFJvb3RQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKFNFVFVQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5zZXR1cFByb3BzLmZpbmQoKHA6IFNldHVwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1hcmt1cFByb3BzLmZpbmQoKHA6IE1hcmt1cFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoR0FNRV9JTkZPX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5nYW1lSW5mb1Byb3BzLmZpbmQoXG4gICAgICAocDogR2FtZUluZm9Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIEZpbmRzIHByb3BlcnRpZXMgaW4gYSBnaXZlbiBub2RlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAqIEBwYXJhbSBub2RlIC0gVGhlIG5vZGUgdG8gc2VhcmNoIGZvciBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHRva2VuIC0gVGhlIHRva2VuIHRvIG1hdGNoIGFnYWluc3QgdGhlIHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBwcm9wZXJ0aWVzIHRoYXQgbWF0Y2ggdGhlIHByb3ZpZGVkIHRva2VuLlxuICovXG5leHBvcnQgY29uc3QgZmluZFByb3BzID0gKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LCB0b2tlbjogc3RyaW5nKSA9PiB7XG4gIGlmIChNT1ZFX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tb3ZlUHJvcHMuZmlsdGVyKChwOiBNb3ZlUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHMuZmlsdGVyKFxuICAgICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVBbm5vdGF0aW9uUHJvcHMuZmlsdGVyKFxuICAgICAgKHA6IE1vdmVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChST09UX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5yb290UHJvcHMuZmlsdGVyKChwOiBSb290UHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChTRVRVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwuc2V0dXBQcm9wcy5maWx0ZXIoKHA6IFNldHVwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChNQVJLVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1hcmt1cFByb3BzLmZpbHRlcigocDogTWFya3VwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChHQU1FX0lORk9fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLmdhbWVJbmZvUHJvcHMuZmlsdGVyKFxuICAgICAgKHA6IEdhbWVJbmZvUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZW5Nb3ZlID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgb25SaWdodDogKHBhdGg6IHN0cmluZykgPT4gdm9pZCxcbiAgb25Xcm9uZzogKHBhdGg6IHN0cmluZykgPT4gdm9pZCxcbiAgb25WYXJpYW50OiAocGF0aDogc3RyaW5nKSA9PiB2b2lkLFxuICBvbk9mZlBhdGg6IChwYXRoOiBzdHJpbmcpID0+IHZvaWRcbik6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+ID0+IHtcbiAgbGV0IG5leHROb2RlO1xuICBjb25zdCBnZXRQYXRoID0gKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IGNvbXBhY3QoXG4gICAgICBub2RlLmdldFBhdGgoKS5tYXAobiA9PiBuLm1vZGVsLm1vdmVQcm9wc1swXT8udG9TdHJpbmcoKSlcbiAgICApLmpvaW4oJzsnKTtcbiAgICByZXR1cm4gbmV3UGF0aDtcbiAgfTtcblxuICBjb25zdCBjaGVja1Jlc3VsdCA9IChub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICAgIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHJldHVybjtcblxuICAgIGNvbnN0IHBhdGggPSBnZXRQYXRoKG5vZGUpO1xuICAgIGlmIChpc1JpZ2h0Tm9kZShub2RlKSkge1xuICAgICAgaWYgKG9uUmlnaHQpIG9uUmlnaHQocGF0aCk7XG4gICAgfSBlbHNlIGlmIChpc1ZhcmlhbnROb2RlKG5vZGUpKSB7XG4gICAgICBpZiAob25WYXJpYW50KSBvblZhcmlhbnQocGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvbldyb25nKSBvbldyb25nKHBhdGgpO1xuICAgIH1cbiAgfTtcblxuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgY29uc3QgcmlnaHROb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT5cbiAgICAgIGluUmlnaHRQYXRoKG4pXG4gICAgKTtcbiAgICBjb25zdCB3cm9uZ05vZGVzID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PlxuICAgICAgaW5Xcm9uZ1BhdGgobilcbiAgICApO1xuICAgIGNvbnN0IHZhcmlhbnROb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT5cbiAgICAgIGluVmFyaWFudFBhdGgobilcbiAgICApO1xuXG4gICAgbmV4dE5vZGUgPSBub2RlO1xuXG4gICAgaWYgKGluUmlnaHRQYXRoKG5vZGUpICYmIHJpZ2h0Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgbmV4dE5vZGUgPSBzYW1wbGUocmlnaHROb2Rlcyk7XG4gICAgfSBlbHNlIGlmIChpbldyb25nUGF0aChub2RlKSAmJiB3cm9uZ05vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5leHROb2RlID0gc2FtcGxlKHdyb25nTm9kZXMpO1xuICAgIH0gZWxzZSBpZiAoaW5WYXJpYW50UGF0aCh2YXJpYW50Tm9kZXMpICYmIHZhcmlhbnROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBuZXh0Tm9kZSA9IHNhbXBsZSh2YXJpYW50Tm9kZXMpO1xuICAgIH0gZWxzZSBpZiAoaXNSaWdodE5vZGUobm9kZSkpIHtcbiAgICAgIG9uUmlnaHQoZ2V0UGF0aChuZXh0Tm9kZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbldyb25nKGdldFBhdGgobmV4dE5vZGUpKTtcbiAgICB9XG4gICAgY2hlY2tSZXN1bHQobmV4dE5vZGUpO1xuICB9IGVsc2Uge1xuICAgIGNoZWNrUmVzdWx0KG5vZGUpO1xuICB9XG4gIHJldHVybiBuZXh0Tm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0Qm9hcmRTaXplID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgY29uc3Qgcm9vdCA9IG5vZGUuZ2V0UGF0aCgpWzBdO1xuICBjb25zdCBzaXplID0gTWF0aC5taW4oXG4gICAgcGFyc2VJbnQoZmluZFByb3Aocm9vdCwgJ1NaJyk/LnZhbHVlIHx8IGRlZmF1bHRCb2FyZFNpemUpLFxuICAgIE1BWF9CT0FSRF9TSVpFXG4gICk7XG4gIHJldHVybiBzaXplO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpcnN0VG9Nb3ZlQ29sb3JGcm9tUm9vdCA9IChcbiAgcm9vdDogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4gfCB1bmRlZmluZWQgfCBudWxsLFxuICBkZWZhdWx0TW92ZUNvbG9yOiBLaSA9IEtpLkJsYWNrXG4pID0+IHtcbiAgaWYgKHJvb3QpIHtcbiAgICBjb25zdCBzZXR1cE5vZGUgPSByb290LmZpcnN0KG4gPT4gaXNTZXR1cE5vZGUobikpO1xuICAgIGlmIChzZXR1cE5vZGUpIHtcbiAgICAgIGNvbnN0IGZpcnN0TW92ZU5vZGUgPSBzZXR1cE5vZGUuZmlyc3QobiA9PiBpc01vdmVOb2RlKG4pKTtcbiAgICAgIGlmICghZmlyc3RNb3ZlTm9kZSkgcmV0dXJuIGRlZmF1bHRNb3ZlQ29sb3I7XG4gICAgICByZXR1cm4gZ2V0TW92ZUNvbG9yKGZpcnN0TW92ZU5vZGUpO1xuICAgIH1cbiAgfVxuICBjb25zb2xlLndhcm4oJ0RlZmF1bHQgZmlyc3QgdG8gbW92ZSBjb2xvcicsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGaXJzdFRvTW92ZUNvbG9yRnJvbVNnZiA9IChcbiAgc2dmOiBzdHJpbmcsXG4gIGRlZmF1bHRNb3ZlQ29sb3I6IEtpID0gS2kuQmxhY2tcbikgPT4ge1xuICBjb25zdCBzZ2ZQYXJzZXIgPSBuZXcgU2dmKHNnZik7XG4gIGlmIChzZ2ZQYXJzZXIucm9vdClcbiAgICBnZXRGaXJzdFRvTW92ZUNvbG9yRnJvbVJvb3Qoc2dmUGFyc2VyLnJvb3QsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICBjb25zb2xlLndhcm4oJ0RlZmF1bHQgZmlyc3QgdG8gbW92ZSBjb2xvcicsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRNb3ZlQ29sb3IgPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBkZWZhdWx0TW92ZUNvbG9yOiBLaSA9IEtpLkJsYWNrXG4pID0+IHtcbiAgY29uc3QgbW92ZVByb3AgPSBub2RlLm1vZGVsPy5tb3ZlUHJvcHM/LlswXTtcbiAgc3dpdGNoIChtb3ZlUHJvcD8udG9rZW4pIHtcbiAgICBjYXNlICdXJzpcbiAgICAgIHJldHVybiBLaS5XaGl0ZTtcbiAgICBjYXNlICdCJzpcbiAgICAgIHJldHVybiBLaS5CbGFjaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gY29uc29sZS53YXJuKCdEZWZhdWx0IG1vdmUgY29sb3IgaXMnLCBkZWZhdWx0TW92ZUNvbG9yKTtcbiAgICAgIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xuICB9XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvbmUge1xuICBwcm90ZWN0ZWQgZ2xvYmFsQWxwaGEgPSAxO1xuICBwcm90ZWN0ZWQgc2l6ZSA9IDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQga2k6IG51bWJlclxuICApIHt9XG4gIGRyYXcoKSB7XG4gICAgY29uc29sZS5sb2coJ1RCRCcpO1xuICB9XG5cbiAgc2V0R2xvYmFsQWxwaGEoYWxwaGE6IG51bWJlcikge1xuICAgIHRoaXMuZ2xvYmFsQWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIHNldFNpemUoc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgfVxufVxuIiwiaW1wb3J0IFN0b25lIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBDb2xvclN0b25lIGV4dGVuZHMgU3RvbmUge1xuICBjb25zdHJ1Y3RvcihjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpIHtcbiAgICBzdXBlcihjdHgsIHgsIHksIGtpKTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgc2l6ZSwga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgaWYgKHNpemUgPD0gMCkgcmV0dXJuO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICBjdHgubGluZVdpZHRoID0gMTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgaWYgKGtpID09PSAxKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmYnO1xuICAgIH1cbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgU3RvbmUgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGNsYXNzIEltYWdlU3RvbmUgZXh0ZW5kcyBTdG9uZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAga2k6IG51bWJlcixcbiAgICBwcml2YXRlIG1vZDogbnVtYmVyLFxuICAgIHByaXZhdGUgYmxhY2tzOiBhbnksXG4gICAgcHJpdmF0ZSB3aGl0ZXM6IGFueVxuICApIHtcbiAgICBzdXBlcihjdHgsIHgsIHksIGtpKTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgc2l6ZSwga2ksIGJsYWNrcywgd2hpdGVzLCBtb2R9ID0gdGhpcztcbiAgICBpZiAoc2l6ZSA8PSAwKSByZXR1cm47XG4gICAgbGV0IGltZztcbiAgICBpZiAoa2kgPT09IDEpIHtcbiAgICAgIGltZyA9IGJsYWNrc1ttb2QgJSBibGFja3MubGVuZ3RoXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW1nID0gd2hpdGVzW21vZCAlIHdoaXRlcy5sZW5ndGhdO1xuICAgIH1cbiAgICBpZiAoaW1nKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKGltZywgeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtBbmFseXNpc1BvaW50VGhlbWUsIE1vdmVJbmZvLCBSb290SW5mb30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgY2FsY0FuYWx5c2lzUG9pbnRDb2xvcixcbiAgY2FsY1Njb3JlRGlmZixcbiAgY2FsY1Njb3JlRGlmZlRleHQsXG4gIG5Gb3JtYXR0ZXIsXG4gIHJvdW5kMyxcbn0gZnJvbSAnLi4vaGVscGVyJztcbmltcG9ydCB7XG4gIExJR0hUX0dSRUVOX1JHQixcbiAgTElHSFRfUkVEX1JHQixcbiAgTElHSFRfWUVMTE9XX1JHQixcbiAgWUVMTE9XX1JHQixcbn0gZnJvbSAnLi4vY29uc3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmFseXNpc1BvaW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBwcml2YXRlIHg6IG51bWJlcixcbiAgICBwcml2YXRlIHk6IG51bWJlcixcbiAgICBwcml2YXRlIHI6IG51bWJlcixcbiAgICBwcml2YXRlIHJvb3RJbmZvOiBSb290SW5mbyxcbiAgICBwcml2YXRlIG1vdmVJbmZvOiBNb3ZlSW5mbyxcbiAgICBwcml2YXRlIHRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWUgPSBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCxcbiAgICBwcml2YXRlIG91dGxpbmVDb2xvcj86IHN0cmluZ1xuICApIHt9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm8sIHRoZW1lfSA9IHRoaXM7XG4gICAgaWYgKHIgPCAwKSByZXR1cm47XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcbiAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDA7XG4gICAgY3R4LnNoYWRvd0NvbG9yID0gJyNmZmYnO1xuICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcblxuICAgIC8vIHRoaXMuZHJhd0RlZmF1bHRBbmFseXNpc1BvaW50KCk7XG4gICAgaWYgKHRoZW1lID09PSBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCkge1xuICAgICAgdGhpcy5kcmF3RGVmYXVsdEFuYWx5c2lzUG9pbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoZW1lID09PSBBbmFseXNpc1BvaW50VGhlbWUuUHJvYmxlbSkge1xuICAgICAgdGhpcy5kcmF3UHJvYmxlbUFuYWx5c2lzUG9pbnQoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3UHJvYmxlbUFuYWx5c2lzUG9pbnQgPSAoKSA9PiB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgciwgcm9vdEluZm8sIG1vdmVJbmZvLCBvdXRsaW5lQ29sb3J9ID0gdGhpcztcbiAgICBjb25zdCB7b3JkZXJ9ID0gbW92ZUluZm87XG5cbiAgICBsZXQgcENvbG9yID0gY2FsY0FuYWx5c2lzUG9pbnRDb2xvcihyb290SW5mbywgbW92ZUluZm8pO1xuXG4gICAgaWYgKG9yZGVyIDwgNSkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gMDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIHIgKiAwLjksIHgsIHksIHIpO1xuICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHBDb2xvcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45LCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwJyk7XG4gICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBjdHguZmlsbCgpO1xuICAgICAgaWYgKG91dGxpbmVDb2xvcikge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMoeCwgeSwgciwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgICBjdHgubGluZVdpZHRoID0gNDtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gb3V0bGluZUNvbG9yO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvbnRTaXplID0gciAvIDEuNTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggVGFob21hYDtcbiAgICAgIGNvbnN0IHNjb3JlVGV4dCA9IGNhbGNTY29yZURpZmZUZXh0KHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgICBjdHguZmlsbFRleHQoc2NvcmVUZXh0LCB4LCB5KTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHguZmlsbFRleHQobkZvcm1hdHRlcihtb3ZlSW5mby52aXNpdHMpLCB4LCB5ICsgciAvIDIgKyBmb250U2l6ZSAvIDgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXdDYW5kaWRhdGVQb2ludCgpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGRyYXdEZWZhdWx0QW5hbHlzaXNQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm99ID0gdGhpcztcbiAgICBjb25zdCB7b3JkZXJ9ID0gbW92ZUluZm87XG5cbiAgICBsZXQgcENvbG9yID0gY2FsY0FuYWx5c2lzUG9pbnRDb2xvcihyb290SW5mbywgbW92ZUluZm8pO1xuXG4gICAgaWYgKG9yZGVyIDwgNSkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gMDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIHIgKiAwLjksIHgsIHksIHIpO1xuICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHBDb2xvcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45LCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwJyk7XG4gICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBjdHguZmlsbCgpO1xuXG4gICAgICBjb25zdCBmb250U2l6ZSA9IHIgLyAxLjU7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemUgKiAwLjh9cHggVGFob21hYDtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICBjb25zdCB3aW5yYXRlID1cbiAgICAgICAgcm9vdEluZm8uY3VycmVudFBsYXllciA9PT0gJ0InXG4gICAgICAgICAgPyBtb3ZlSW5mby53aW5yYXRlXG4gICAgICAgICAgOiAxIC0gbW92ZUluZm8ud2lucmF0ZTtcblxuICAgICAgY3R4LmZpbGxUZXh0KHJvdW5kMyh3aW5yYXRlLCAxMDAsIDEpLCB4LCB5IC0gciAvIDIgKyBmb250U2l6ZSAvIDUpO1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplfXB4IFRhaG9tYWA7XG4gICAgICBjb25zdCBzY29yZVRleHQgPSBjYWxjU2NvcmVEaWZmVGV4dChyb290SW5mbywgbW92ZUluZm8pO1xuICAgICAgY3R4LmZpbGxUZXh0KHNjb3JlVGV4dCwgeCwgeSArIGZvbnRTaXplIC8gMyk7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemUgKiAwLjh9cHggVGFob21hYDtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgY3R4LmZpbGxUZXh0KG5Gb3JtYXR0ZXIobW92ZUluZm8udmlzaXRzKSwgeCwgeSArIHIgLyAyICsgZm9udFNpemUgLyAzKTtcblxuICAgICAgY29uc3Qgb3JkZXIgPSBtb3ZlSW5mby5vcmRlcjtcbiAgICAgIGN0eC5maWxsVGV4dCgob3JkZXIgKyAxKS50b1N0cmluZygpLCB4ICsgciwgeSAtIHIgLyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kcmF3Q2FuZGlkYXRlUG9pbnQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBkcmF3Q2FuZGlkYXRlUG9pbnQgPSAoKSA9PiB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgciwgcm9vdEluZm8sIG1vdmVJbmZvfSA9IHRoaXM7XG4gICAgY29uc3QgcENvbG9yID0gY2FsY0FuYWx5c2lzUG9pbnRDb2xvcihyb290SW5mbywgbW92ZUluZm8pO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKHgsIHksIHIgKiAwLjYsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICBjdHgubGluZVdpZHRoID0gMDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG4gICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuNCwgeCwgeSwgcik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIHBDb2xvcik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuOTUsICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrdXAge1xuICBwcm90ZWN0ZWQgZ2xvYmFsQWxwaGEgPSAxO1xuICBwcm90ZWN0ZWQgY29sb3IgPSAnJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcHJvdGVjdGVkIHg6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgeTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBzOiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIGtpOiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHZhbDogc3RyaW5nIHwgbnVtYmVyID0gJydcbiAgKSB7fVxuXG4gIGRyYXcoKSB7XG4gICAgY29uc29sZS5sb2coJ1RCRCcpO1xuICB9XG5cbiAgc2V0R2xvYmFsQWxwaGEoYWxwaGE6IG51bWJlcikge1xuICAgIHRoaXMuZ2xvYmFsQWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIENpcmNsZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhLCBjb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjY1O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgIGlmIChraSA9PT0gMSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBpZiAoY29sb3IpIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIENyb3NzTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC41O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGlmIChraSA9PT0gMSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpemUgPSByYWRpdXMgKiAwLjU4O1xuICAgIH1cbiAgICBjdHgubW92ZVRvKHggLSBzaXplLCB5IC0gc2l6ZSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgc2l6ZSwgeSArIHNpemUpO1xuICAgIGN0eC5tb3ZlVG8oeCArIHNpemUsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggLSBzaXplLCB5ICsgc2l6ZSk7XG5cbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIFRleHRNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCB2YWwsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3Qgc2l6ZSA9IHMgKiAwLjg7XG4gICAgbGV0IGZvbnRTaXplID0gc2l6ZSAvIDEuNTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuXG4gICAgaWYgKGtpID09PSAxKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICAgIH1cbiAgICAvLyBlbHNlIHtcbiAgICAvLyAgIGN0eC5jbGVhclJlY3QoeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIC8vIH1cbiAgICBpZiAodmFsLnRvU3RyaW5nKCkubGVuZ3RoID09PSAxKSB7XG4gICAgICBmb250U2l6ZSA9IHNpemUgLyAxLjU7XG4gICAgfSBlbHNlIGlmICh2YWwudG9TdHJpbmcoKS5sZW5ndGggPT09IDIpIHtcbiAgICAgIGZvbnRTaXplID0gc2l6ZSAvIDEuODtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9udFNpemUgPSBzaXplIC8gMi4wO1xuICAgIH1cbiAgICBjdHguZm9udCA9IGBib2xkICR7Zm9udFNpemV9cHggVGFob21hYDtcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgIGN0eC5maWxsVGV4dCh2YWwudG9TdHJpbmcoKSwgeCwgeSArIDIpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIFNxdWFyZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgbGV0IHNpemUgPSBzICogMC41NTtcbiAgICBpZiAoa2kgPT09IDEpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjZmZmJztcbiAgICB9IGVsc2UgaWYgKGtpID09PSAtMSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMwMDAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgICBjdHgubGluZVdpZHRoID0gMztcbiAgICB9XG4gICAgY3R4LnJlY3QoeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBUcmlhbmdsZU1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNzU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4Lm1vdmVUbyh4LCB5IC0gc2l6ZSk7XG4gICAgY3R4LmxpbmVUbyh4IC0gc2l6ZSAqIE1hdGguY29zKDAuNTIzKSwgeSArIHNpemUgKiBNYXRoLnNpbigwLjUyMykpO1xuICAgIGN0eC5saW5lVG8oeCArIHNpemUgKiBNYXRoLmNvcygwLjUyMyksIHkgKyBzaXplICogTWF0aC5zaW4oMC41MjMpKTtcblxuICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgIGlmIChraSA9PT0gMSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgICAgc2l6ZSA9IHJhZGl1cyAqIDAuNztcbiAgICB9XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBOb2RlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgY29sb3IsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNDtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gNDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGl2ZU5vZGVNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBjb2xvciwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC41O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5saW5lV2lkdGggPSA0O1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplICogMC40LCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBDaXJjbGVTb2xpZE1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIGdsb2JhbEFscGhhLCBjb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjI1O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC42NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICBpZiAoa2kgPT09IDEpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZic7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gLTEpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBpZiAoY29sb3IpIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtjb21wYWN0fSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgY2FsY1Zpc2libGVBcmVhLFxuICByZXZlcnNlT2Zmc2V0LFxuICB6ZXJvcyxcbiAgZW1wdHksXG4gIGExVG9Qb3MsXG4gIG9mZnNldEExTW92ZSxcbn0gZnJvbSAnLi9oZWxwZXInO1xuaW1wb3J0IHtcbiAgQTFfTEVUVEVSUyxcbiAgQTFfTlVNQkVSUyxcbiAgREVGQVVMVF9PUFRJT05TLFxuICBNQVhfQk9BUkRfU0laRSxcbiAgVEhFTUVfUkVTT1VSQ0VTLFxufSBmcm9tICcuL2NvbnN0JztcbmltcG9ydCB7XG4gIEN1cnNvcixcbiAgTWFya3VwLFxuICBUaGVtZSxcbiAgS2ksXG4gIEFuYWx5c2lzLFxuICBHaG9zdEJhbk9wdGlvbnMsXG4gIEdob3N0QmFuT3B0aW9uc1BhcmFtcyxcbiAgQ2VudGVyLFxuICBBbmFseXNpc1BvaW50VGhlbWUsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQge0ltYWdlU3RvbmUsIENvbG9yU3RvbmV9IGZyb20gJy4vc3RvbmVzJztcbmltcG9ydCBBbmFseXNpc1BvaW50IGZyb20gJy4vc3RvbmVzL0FuYWx5c2lzUG9pbnQnO1xuLy8gaW1wb3J0IHtjcmVhdGUsIG1lYW5EZXBlbmRlbmNpZXMsIHN0ZERlcGVuZGVuY2llc30gZnJvbSAnbWF0aGpzJztcblxuLy8gY29uc3QgY29uZmlnID0ge307XG4vLyBjb25zdCB7c3RkLCBtZWFufSA9IGNyZWF0ZSh7bWVhbkRlcGVuZGVuY2llcywgc3RkRGVwZW5kZW5jaWVzfSwgY29uZmlnKTtcblxuaW1wb3J0IHtcbiAgQ2lyY2xlTWFya3VwLFxuICBDcm9zc01hcmt1cCxcbiAgVGV4dE1hcmt1cCxcbiAgU3F1YXJlTWFya3VwLFxuICBUcmlhbmdsZU1hcmt1cCxcbiAgTm9kZU1hcmt1cCxcbiAgUG9zaXRpdmVOb2RlTWFya3VwLFxuICBDaXJjbGVTb2xpZE1hcmt1cCxcbn0gZnJvbSAnLi9tYXJrdXBzJztcblxuY29uc3QgaW1hZ2VzOiB7XG4gIFtrZXk6IHN0cmluZ106IEhUTUxJbWFnZUVsZW1lbnQ7XG59ID0ge307XG5cbmZ1bmN0aW9uIGlzTW9iaWxlRGV2aWNlKCkge1xuICByZXR1cm4gL01vYml8QW5kcm9pZHxpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QoXG4gICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICApO1xufVxuXG5mdW5jdGlvbiBwcmVsb2FkKHVybHM6IHN0cmluZ1tdLCBkb25lOiAoKSA9PiB2b2lkKSB7XG4gIGxldCBsb2FkZWQgPSAwO1xuICBjb25zdCBpbWFnZUxvYWRlZCA9ICgpID0+IHtcbiAgICBsb2FkZWQrKztcbiAgICBpZiAobG9hZGVkID09PSB1cmxzLmxlbmd0aCkge1xuICAgICAgZG9uZSgpO1xuICAgIH1cbiAgfTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cmxzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFpbWFnZXNbdXJsc1tpXV0pIHtcbiAgICAgIGltYWdlc1t1cmxzW2ldXSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2VzW3VybHNbaV1dLnNyYyA9IHVybHNbaV07XG4gICAgICBpbWFnZXNbdXJsc1tpXV0ub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZUxvYWRlZCgpO1xuICAgICAgfTtcbiAgICAgIGltYWdlc1t1cmxzW2ldXS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZUxvYWRlZCgpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cblxubGV0IGRwciA9IDEuMDtcbi8vIGJyb3dzZXIgY29kZVxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEuMDtcbn1cblxuZXhwb3J0IGNsYXNzIEdob3N0QmFuIHtcbiAgZGVmYXVsdE9wdGlvbnM6IEdob3N0QmFuT3B0aW9ucyA9IHtcbiAgICBib2FyZFNpemU6IDE5LFxuICAgIGR5bmFtaWNQYWRkaW5nOiBmYWxzZSxcbiAgICBwYWRkaW5nOiAxMCxcbiAgICBleHRlbnQ6IDMsXG4gICAgaW50ZXJhY3RpdmU6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGU6IHRydWUsXG4gICAgdGhlbWU6IFRoZW1lLkJsYWNrQW5kV2hpdGUsXG4gICAgYW5hbHlzaXNQb2ludFRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCxcbiAgICBiYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICBzaG93QW5hbHlzaXM6IGZhbHNlLFxuICAgIGFkYXB0aXZlQm9hcmRMaW5lOiB0cnVlLFxuICAgIGJvYXJkRWRnZUxpbmVXaWR0aDogNSxcbiAgICBib2FyZExpbmVXaWR0aDogMSxcbiAgICBib2FyZExpbmVFeHRlbnQ6IDAuNSxcbiAgICB0aGVtZUZsYXRCb2FyZENvbG9yOiAnI0VDQjU1QScsXG4gICAgcG9zaXRpdmVOb2RlQ29sb3I6ICcjNGQ3YzBmJyxcbiAgICBuZWdhdGl2ZU5vZGVDb2xvcjogJyNiOTFjMWMnLFxuICAgIG5ldXRyYWxOb2RlQ29sb3I6ICcjYTE2MjA3JyxcbiAgICBkZWZhdWx0Tm9kZUNvbG9yOiAnIzQwNDA0MCcsXG4gICAgdGhlbWVSZXNvdXJjZXM6IFRIRU1FX1JFU09VUkNFUyxcbiAgICBtb3ZlU291bmQ6IGZhbHNlLFxuICAgIGFkYXB0aXZlU3RhclNpemU6IHRydWUsXG4gICAgc3RhclNpemU6IDMsXG4gIH07XG4gIG9wdGlvbnM6IEdob3N0QmFuT3B0aW9ucztcbiAgZG9tOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcbiAgY2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGJvYXJkPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGFuYWx5c2lzQ2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGN1cnNvckNhbnZhcz86IEhUTUxDYW52YXNFbGVtZW50O1xuICBtYXJrdXBDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgbW92ZVNvdW5kQXVkaW8/OiBIVE1MQXVkaW9FbGVtZW50O1xuICB0dXJuOiBLaTtcbiAgcHJpdmF0ZSBjdXJzb3I6IEN1cnNvciA9IEN1cnNvci5Ob25lO1xuICBwcml2YXRlIGN1cnNvclZhbHVlOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSB0b3VjaE1vdmluZyA9IGZhbHNlO1xuICBwcml2YXRlIHRvdWNoU3RhcnRQb2ludDogRE9NUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgcHVibGljIGN1cnNvclBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdO1xuICBwdWJsaWMgY3Vyc29yUG9pbnQ6IERPTVBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gIHB1YmxpYyBtYXQ6IG51bWJlcltdW107XG4gIHB1YmxpYyBtYXJrdXA6IHN0cmluZ1tdW107XG4gIHB1YmxpYyB2aXNpYmxlQXJlYU1hdDogbnVtYmVyW11bXSB8IHVuZGVmaW5lZDtcbiAgcHVibGljIHByZXZlbnRNb3ZlTWF0OiBudW1iZXJbXVtdO1xuICBtYXhodjogbnVtYmVyO1xuICB0cmFuc01hdDogRE9NTWF0cml4O1xuICBhbmFseXNpczogQW5hbHlzaXMgfCBudWxsO1xuICB2aXNpYmxlQXJlYTogbnVtYmVyW11bXTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBHaG9zdEJhbk9wdGlvbnNQYXJhbXMgPSB7fSkge1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMuZGVmYXVsdE9wdGlvbnMsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMub3B0aW9ucy5ib2FyZFNpemU7XG4gICAgdGhpcy5tYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMucHJldmVudE1vdmVNYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMubWFya3VwID0gZW1wdHkoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLnR1cm4gPSBLaS5CbGFjaztcbiAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gWy0xLCAtMV07XG4gICAgdGhpcy5tYXhodiA9IHNpemU7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICB0aGlzLmFuYWx5c2lzID0gbnVsbDtcbiAgICB0aGlzLnZpc2libGVBcmVhID0gW1xuICAgICAgWzAsIHNpemUgLSAxXSxcbiAgICAgIFswLCBzaXplIC0gMV0sXG4gICAgXTtcbiAgfVxuXG4gIHNldFR1cm4odHVybjogS2kpIHtcbiAgICB0aGlzLnR1cm4gPSB0dXJuO1xuICB9XG5cbiAgc2V0Qm9hcmRTaXplKHNpemU6IG51bWJlcikge1xuICAgIHRoaXMub3B0aW9ucy5ib2FyZFNpemUgPSBNYXRoLm1pbihzaXplLCBNQVhfQk9BUkRfU0laRSk7XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuY2FudmFzIHx8XG4gICAgICAhdGhpcy5jdXJzb3JDYW52YXMgfHxcbiAgICAgICF0aGlzLmRvbSB8fFxuICAgICAgIXRoaXMuYm9hcmQgfHxcbiAgICAgICF0aGlzLm1hcmt1cENhbnZhcyB8fFxuICAgICAgIXRoaXMuYW5hbHlzaXNDYW52YXNcbiAgICApXG4gICAgICByZXR1cm47XG4gICAgY29uc3Qge2JvYXJkLCBjYW52YXMsIG1hcmt1cENhbnZhcywgY3Vyc29yQ2FudmFzLCBhbmFseXNpc0NhbnZhc30gPSB0aGlzO1xuICAgIGNvbnN0IHtzaXplLCB6b29tfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAoc2l6ZSkge1xuICAgICAgYm9hcmQud2lkdGggPSBzaXplICogZHByO1xuICAgICAgYm9hcmQuaGVpZ2h0ID0gc2l6ZSAqIGRwcjtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHNpemUgKiBkcHI7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gc2l6ZSAqIGRwcjtcbiAgICAgIG1hcmt1cENhbnZhcy53aWR0aCA9IHNpemUgKiBkcHI7XG4gICAgICBtYXJrdXBDYW52YXMuaGVpZ2h0ID0gc2l6ZSAqIGRwcjtcbiAgICAgIGN1cnNvckNhbnZhcy53aWR0aCA9IHNpemUgKiBkcHI7XG4gICAgICBjdXJzb3JDYW52YXMuaGVpZ2h0ID0gc2l6ZSAqIGRwcjtcbiAgICAgIGFuYWx5c2lzQ2FudmFzLndpZHRoID0gc2l6ZSAqIGRwcjtcbiAgICAgIGFuYWx5c2lzQ2FudmFzLmhlaWdodCA9IHNpemUgKiBkcHI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHtjbGllbnRXaWR0aH0gPSB0aGlzLmRvbTtcbiAgICAgIGJvYXJkLnN0eWxlLndpZHRoID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgYm9hcmQuc3R5bGUuaGVpZ2h0ID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgYm9hcmQud2lkdGggPSBNYXRoLmZsb29yKGNsaWVudFdpZHRoICogZHByKTtcbiAgICAgIGJvYXJkLmhlaWdodCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGNsaWVudFdpZHRoICsgJ3B4JztcbiAgICAgIGNhbnZhcy53aWR0aCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgY2FudmFzLmhlaWdodCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgbWFya3VwQ2FudmFzLnN0eWxlLndpZHRoID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgbWFya3VwQ2FudmFzLnN0eWxlLmhlaWdodCA9IGNsaWVudFdpZHRoICsgJ3B4JztcbiAgICAgIG1hcmt1cENhbnZhcy53aWR0aCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgbWFya3VwQ2FudmFzLmhlaWdodCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgY3Vyc29yQ2FudmFzLnN0eWxlLndpZHRoID0gY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgY3Vyc29yQ2FudmFzLnN0eWxlLmhlaWdodCA9IGNsaWVudFdpZHRoICsgJ3B4JztcbiAgICAgIGN1cnNvckNhbnZhcy53aWR0aCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgY3Vyc29yQ2FudmFzLmhlaWdodCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgYW5hbHlzaXNDYW52YXMuc3R5bGUud2lkdGggPSBjbGllbnRXaWR0aCArICdweCc7XG4gICAgICBhbmFseXNpc0NhbnZhcy5zdHlsZS5oZWlnaHQgPSBjbGllbnRXaWR0aCArICdweCc7XG4gICAgICBhbmFseXNpc0NhbnZhcy53aWR0aCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgYW5hbHlzaXNDYW52YXMuaGVpZ2h0ID0gTWF0aC5mbG9vcihjbGllbnRXaWR0aCAqIGRwcik7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGluaXQoZG9tOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplO1xuICAgIHRoaXMubWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLm1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcblxuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgYm9hcmQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGJvYXJkLmlkID0gJ2dob3N0YmFuLWJvYXJkJztcbiAgICB0aGlzLmJvYXJkID0gYm9hcmQ7XG5cbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGNhbnZhcy5pZCA9ICdnaG9zdGJhbi1jYW52YXMnO1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gICAgY29uc3QgbWFya3VwQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgbWFya3VwQ2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBtYXJrdXBDYW52YXMuaWQgPSAnZ2hvc3RiYW4tbWFya3VwJztcbiAgICBtYXJrdXBDYW52YXMuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICB0aGlzLm1hcmt1cENhbnZhcyA9IG1hcmt1cENhbnZhcztcblxuICAgIGNvbnN0IGN1cnNvckNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGN1cnNvckNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgY3Vyc29yQ2FudmFzLmlkID0gJ2dob3N0YmFuLWN1cnNvcic7XG4gICAgdGhpcy5jdXJzb3JDYW52YXMgPSBjdXJzb3JDYW52YXM7XG5cbiAgICBjb25zdCBhbmFseXNpc0NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGFuYWx5c2lzQ2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBhbmFseXNpc0NhbnZhcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIGFuYWx5c2lzQ2FudmFzLmlkID0gJ2dob3N0YmFuLWFuYWx5c2lzJztcbiAgICB0aGlzLmFuYWx5c2lzQ2FudmFzID0gYW5hbHlzaXNDYW52YXM7XG5cbiAgICB0aGlzLmRvbSA9IGRvbTtcblxuICAgIGRvbS5maXJzdENoaWxkPy5yZW1vdmUoKTtcbiAgICBkb20uZmlyc3RDaGlsZD8ucmVtb3ZlKCk7XG4gICAgZG9tLmZpcnN0Q2hpbGQ/LnJlbW92ZSgpO1xuICAgIGRvbS5maXJzdENoaWxkPy5yZW1vdmUoKTtcbiAgICBkb20uZmlyc3RDaGlsZD8ucmVtb3ZlKCk7XG5cbiAgICBkb20uYXBwZW5kQ2hpbGQoYm9hcmQpO1xuICAgIGRvbS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIGRvbS5hcHBlbmRDaGlsZChtYXJrdXBDYW52YXMpO1xuICAgIGRvbS5hcHBlbmRDaGlsZChhbmFseXNpc0NhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKGN1cnNvckNhbnZhcyk7XG5cbiAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIHRoaXMucmVuZGVySW50ZXJhY3RpdmUoKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNldE9wdGlvbnMob3B0aW9uczogR2hvc3RCYW5PcHRpb25zUGFyYW1zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gey4uLnRoaXMub3B0aW9ucywgLi4ub3B0aW9uc307XG4gICAgLy8gVGhlIG9uTW91c2VNb3ZlIGV2ZW50IG5lZWRzIHRvIGJlIHJlLWFkZGVkIGFmdGVyIHRoZSBvcHRpb25zIGFyZSB1cGRhdGVkXG4gICAgdGhpcy5yZW5kZXJJbnRlcmFjdGl2ZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBzZXRNYXQobWF0OiBudW1iZXJbXVtdKSB7XG4gICAgdGhpcy5tYXQgPSBtYXQ7XG4gICAgaWYgKCF0aGlzLnZpc2libGVBcmVhTWF0KSB7XG4gICAgICB0aGlzLnZpc2libGVBcmVhTWF0ID0gbWF0O1xuICAgIH1cbiAgfVxuXG4gIHNldFZpc2libGVBcmVhTWF0KG1hdDogbnVtYmVyW11bXSkge1xuICAgIHRoaXMudmlzaWJsZUFyZWFNYXQgPSBtYXQ7XG4gIH1cblxuICBzZXRQcmV2ZW50TW92ZU1hdChtYXQ6IG51bWJlcltdW10pIHtcbiAgICB0aGlzLnByZXZlbnRNb3ZlTWF0ID0gbWF0O1xuICB9XG5cbiAgc2V0TWFya3VwKG1hcmt1cDogc3RyaW5nW11bXSkge1xuICAgIHRoaXMubWFya3VwID0gbWFya3VwO1xuICB9XG5cbiAgc2V0Q3Vyc29yKGN1cnNvcjogQ3Vyc29yLCB2YWx1ZSA9ICcnKSB7XG4gICAgdGhpcy5jdXJzb3IgPSBjdXJzb3I7XG4gICAgdGhpcy5jdXJzb3JWYWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgc2V0Q3Vyc29yV2l0aFJlbmRlciA9IChkb21Qb2ludDogRE9NUG9pbnQsIG9mZnNldFkgPSAwKSA9PiB7XG4gICAgLy8gc3BhY2UgbmVlZCByZWNhbGN1bGF0ZSBldmVyeSB0aW1lXG4gICAgY29uc3Qge3BhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHtzcGFjZX0gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMudHJhbnNNYXQuaW52ZXJzZSgpLnRyYW5zZm9ybVBvaW50KGRvbVBvaW50KTtcbiAgICBjb25zdCBpZHggPSBNYXRoLnJvdW5kKChwb2ludC54IC0gcGFkZGluZyArIHNwYWNlIC8gMikgLyBzcGFjZSk7XG4gICAgY29uc3QgaWR5ID0gTWF0aC5yb3VuZCgocG9pbnQueSAtIHBhZGRpbmcgKyBzcGFjZSAvIDIpIC8gc3BhY2UpICsgb2Zmc2V0WTtcbiAgICBjb25zdCB4eCA9IGlkeCAqIHNwYWNlO1xuICAgIGNvbnN0IHl5ID0gaWR5ICogc3BhY2U7XG4gICAgY29uc3QgcCA9IHRoaXMudHJhbnNNYXQudHJhbnNmb3JtUG9pbnQobmV3IERPTVBvaW50KHh4LCB5eSkpO1xuICAgIGlmICh0aGlzLnByZXZlbnRNb3ZlTWF0Py5baWR4IC0gMV0/LltpZHkgLSAxXSA9PT0gMSkge1xuICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IFstMSwgLTFdO1xuICAgICAgdGhpcy5jdXJzb3JQb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICAgICAgdGhpcy5kcmF3Q3Vyc29yKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChcbiAgICAgICFpc01vYmlsZURldmljZSgpIHx8XG4gICAgICAoaXNNb2JpbGVEZXZpY2UoKSAmJiB0aGlzLm1hdFtpZHggLSAxXVtpZHkgLSAxXSA9PT0gMClcbiAgICApIHtcbiAgICAgIHRoaXMuY3Vyc29yUG9pbnQgPSBwO1xuICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IFtpZHggLSAxLCBpZHkgLSAxXTtcbiAgICB9XG4gICAgdGhpcy5kcmF3Q3Vyc29yKCk7XG5cbiAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgfTtcblxuICBwcml2YXRlIG9uTW91c2VNb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHBvaW50ID0gbmV3IERPTVBvaW50KGUub2Zmc2V0WCAqIGRwciwgZS5vZmZzZXRZICogZHByKTtcbiAgICB0aGlzLnNldEN1cnNvcldpdGhSZW5kZXIocG9pbnQpO1xuICB9O1xuXG4gIHByaXZhdGUgY2FsY1RvdWNoUG9pbnQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgIGxldCBwb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm4gcG9pbnQ7XG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0b3VjaGVzID0gZS5jaGFuZ2VkVG91Y2hlcztcbiAgICBwb2ludCA9IG5ldyBET01Qb2ludChcbiAgICAgICh0b3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQpICogZHByLFxuICAgICAgKHRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wKSAqIGRwclxuICAgICk7XG4gICAgcmV0dXJuIHBvaW50O1xuICB9O1xuXG4gIHByaXZhdGUgb25Ub3VjaFN0YXJ0ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudG91Y2hNb3ZpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHBvaW50ID0gdGhpcy5jYWxjVG91Y2hQb2ludChlKTtcbiAgICB0aGlzLnRvdWNoU3RhcnRQb2ludCA9IHBvaW50O1xuICAgIHRoaXMuc2V0Q3Vyc29yV2l0aFJlbmRlcihwb2ludCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBvblRvdWNoTW92ZSA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnRvdWNoTW92aW5nID0gdHJ1ZTtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMuY2FsY1RvdWNoUG9pbnQoZSk7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgbGV0IGRpc3RhbmNlID0gMTA7XG4gICAgaWYgKFxuICAgICAgTWF0aC5hYnMocG9pbnQueCAtIHRoaXMudG91Y2hTdGFydFBvaW50LngpID4gZGlzdGFuY2UgfHxcbiAgICAgIE1hdGguYWJzKHBvaW50LnkgLSB0aGlzLnRvdWNoU3RhcnRQb2ludC55KSA+IGRpc3RhbmNlXG4gICAgKSB7XG4gICAgICBvZmZzZXQgPSAtMztcbiAgICB9XG4gICAgdGhpcy5zZXRDdXJzb3JXaXRoUmVuZGVyKHBvaW50LCBvZmZzZXQpO1xuICB9O1xuXG4gIHByaXZhdGUgb25Ub3VjaEVuZCA9ICgpID0+IHtcbiAgICB0aGlzLnRvdWNoTW92aW5nID0gZmFsc2U7XG4gIH07XG5cbiAgcmVuZGVySW50ZXJhY3RpdmUoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQpO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXJDdXJzb3JDYW52YXMoKTtcbiAgfVxuXG4gIHNldEFuYWx5c2lzKGFuYWx5c2lzOiBBbmFseXNpcyB8IG51bGwpIHtcbiAgICB0aGlzLmFuYWx5c2lzID0gYW5hbHlzaXM7XG4gICAgaWYgKCFhbmFseXNpcykge1xuICAgICAgdGhpcy5jbGVhckFuYWx5c2lzQ2FudmFzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0FuYWx5c2lzKSB0aGlzLmRyYXdBbmFseXNpcyhhbmFseXNpcyk7XG4gIH1cblxuICBzZXRUaGVtZSh0aGVtZTogVGhlbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHt0aGVtZVJlc291cmNlc30gPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKCF0aGVtZVJlc291cmNlc1t0aGVtZV0pIHJldHVybjtcbiAgICBjb25zdCB7Ym9hcmQsIGJsYWNrcywgd2hpdGVzfSA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXTtcbiAgICB0aGlzLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgICB0aGVtZSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcbiAgICBwcmVsb2FkKGNvbXBhY3QoW2JvYXJkLCAuLi5ibGFja3MsIC4uLndoaXRlc10pLCAoKSA9PiB7XG4gICAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBjYWxjQ2VudGVyID0gKCk6IENlbnRlciA9PiB7XG4gICAgY29uc3Qge3Zpc2libGVBcmVhfSA9IHRoaXM7XG4gICAgY29uc3Qge2JvYXJkU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAoXG4gICAgICAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiYgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbiAgICB9XG5cbiAgICBpZiAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDApIHtcbiAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCkgcmV0dXJuIENlbnRlci5Ub3BMZWZ0O1xuICAgICAgZWxzZSBpZiAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHJldHVybiBDZW50ZXIuQm90dG9tTGVmdDtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5MZWZ0O1xuICAgIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCkgcmV0dXJuIENlbnRlci5Ub3BSaWdodDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbVJpZ2h0O1xuICAgICAgZWxzZSByZXR1cm4gQ2VudGVyLlJpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wO1xuICAgICAgZWxzZSBpZiAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHJldHVybiBDZW50ZXIuQm90dG9tO1xuICAgICAgZWxzZSByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbiAgICB9XG4gIH07XG5cbiAgY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZTogbnVtYmVyKSB7XG4gICAgY29uc3Qge2Nvb3JkaW5hdGV9ID0gdGhpcy5vcHRpb25zO1xuICAgIGxldCBwYWRkaW5nID0gMzA7XG4gICAgaWYgKHZpc2libGVBcmVhU2l6ZSA8PSAzKSB7XG4gICAgICBwYWRkaW5nID0gY29vcmRpbmF0ZSA/IDEyMCA6IDEwMDtcbiAgICB9IGVsc2UgaWYgKHZpc2libGVBcmVhU2l6ZSA8PSA2KSB7XG4gICAgICBwYWRkaW5nID0gY29vcmRpbmF0ZSA/IDgwIDogNjA7XG4gICAgfSBlbHNlIGlmICh2aXNpYmxlQXJlYVNpemUgPD0gOSkge1xuICAgICAgcGFkZGluZyA9IGNvb3JkaW5hdGUgPyA2MCA6IDUwO1xuICAgIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFTaXplIDw9IDEyKSB7XG4gICAgICBwYWRkaW5nID0gY29vcmRpbmF0ZSA/IDUwIDogNDA7XG4gICAgfSBlbHNlIGlmICh2aXNpYmxlQXJlYVNpemUgPD0gMTUpIHtcbiAgICAgIHBhZGRpbmcgPSBjb29yZGluYXRlID8gNDAgOiAzMDtcbiAgICB9IGVsc2UgaWYgKHZpc2libGVBcmVhU2l6ZSA8PSAxNykge1xuICAgICAgcGFkZGluZyA9IGNvb3JkaW5hdGUgPyAzNSA6IDI1O1xuICAgIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFTaXplIDw9IDE5KSB7XG4gICAgICBwYWRkaW5nID0gY29vcmRpbmF0ZSA/IDMwIDogMjA7XG4gICAgfVxuICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gcGFkZGluZztcbiAgICAvLyB0aGlzLnJlbmRlckludGVyYWN0aXZlKCk7XG4gIH1cblxuICB6b29tQm9hcmQoem9vbSA9IGZhbHNlKSB7XG4gICAgY29uc3Qge2NhbnZhcywgYW5hbHlzaXNDYW52YXMsIGJvYXJkLCBjdXJzb3JDYW52YXMsIG1hcmt1cENhbnZhc30gPSB0aGlzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3Qge2JvYXJkU2l6ZSwgZXh0ZW50LCBib2FyZExpbmVFeHRlbnQsIHBhZGRpbmcsIGR5bmFtaWNQYWRkaW5nfSA9XG4gICAgICB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qgem9vbWVkVmlzaWJsZUFyZWEgPSBjYWxjVmlzaWJsZUFyZWEoXG4gICAgICB0aGlzLnZpc2libGVBcmVhTWF0LFxuICAgICAgZXh0ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBib2FyZEN0eCA9IGJvYXJkPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGN1cnNvckN0eCA9IGN1cnNvckNhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBtYXJrdXBDdHggPSBtYXJrdXBDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgYW5hbHlzaXNDdHggPSBhbmFseXNpc0NhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCB2aXNpYmxlQXJlYSA9IHpvb21cbiAgICAgID8gem9vbWVkVmlzaWJsZUFyZWFcbiAgICAgIDogW1xuICAgICAgICAgIFswLCBib2FyZFNpemUgLSAxXSxcbiAgICAgICAgICBbMCwgYm9hcmRTaXplIC0gMV0sXG4gICAgICAgIF07XG5cbiAgICB0aGlzLnZpc2libGVBcmVhID0gdmlzaWJsZUFyZWE7XG4gICAgY29uc3QgdmlzaWJsZUFyZWFTaXplID0gTWF0aC5tYXgoXG4gICAgICB2aXNpYmxlQXJlYVswXVsxXSAtIHZpc2libGVBcmVhWzBdWzBdLFxuICAgICAgdmlzaWJsZUFyZWFbMV1bMV0gLSB2aXNpYmxlQXJlYVsxXVswXVxuICAgICk7XG5cbiAgICBpZiAoZHluYW1pY1BhZGRpbmcpIHtcbiAgICAgIHRoaXMuY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gREVGQVVMVF9PUFRJT05TLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgaWYgKHpvb20pIHtcbiAgICAgIGNvbnN0IHtzcGFjZX0gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuY2FsY0NlbnRlcigpO1xuXG4gICAgICBpZiAoZHluYW1pY1BhZGRpbmcpIHtcbiAgICAgICAgdGhpcy5jYWxjRHluYW1pY1BhZGRpbmcodmlzaWJsZUFyZWFTaXplKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gREVGQVVMVF9PUFRJT05TLnBhZGRpbmc7XG4gICAgICB9XG5cbiAgICAgIGxldCBleHRyYVZpc2libGVTaXplID0gYm9hcmRMaW5lRXh0ZW50ICogMiArIDE7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCB8fFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0XG4gICAgICApIHtcbiAgICAgICAgZXh0cmFWaXNpYmxlU2l6ZSA9IGJvYXJkTGluZUV4dGVudCArIDAuNTtcbiAgICAgIH1cbiAgICAgIGxldCB6b29tZWRCb2FyZFNpemUgPSB2aXNpYmxlQXJlYVNpemUgKyBleHRyYVZpc2libGVTaXplO1xuXG4gICAgICBpZiAoem9vbWVkQm9hcmRTaXplIDwgYm9hcmRTaXplKSB7XG4gICAgICAgIGxldCBzY2FsZSA9IChjYW52YXMud2lkdGggLSBwYWRkaW5nICogMikgLyAoem9vbWVkQm9hcmRTaXplICogc3BhY2UpO1xuXG4gICAgICAgIGxldCBvZmZzZXRYID1cbiAgICAgICAgICB2aXNpYmxlQXJlYVswXVswXSAqIHNwYWNlICogc2NhbGUgK1xuICAgICAgICAgIC8vIGZvciBwYWRkaW5nXG4gICAgICAgICAgcGFkZGluZyAqIHNjYWxlIC1cbiAgICAgICAgICBwYWRkaW5nIC1cbiAgICAgICAgICAvLyBmb3IgYm9hcmQgbGluZSBleHRlbnRcbiAgICAgICAgICAoc3BhY2UgKiBleHRyYVZpc2libGVTaXplICogc2NhbGUpIC8gMiArXG4gICAgICAgICAgKHNwYWNlICogc2NhbGUpIC8gMjtcblxuICAgICAgICBsZXQgb2Zmc2V0WSA9XG4gICAgICAgICAgdmlzaWJsZUFyZWFbMV1bMF0gKiBzcGFjZSAqIHNjYWxlICtcbiAgICAgICAgICAvLyBmb3IgcGFkZGluZ1xuICAgICAgICAgIHBhZGRpbmcgKiBzY2FsZSAtXG4gICAgICAgICAgcGFkZGluZyAtXG4gICAgICAgICAgLy8gZm9yIGJvYXJkIGxpbmUgZXh0ZW50XG4gICAgICAgICAgKHNwYWNlICogZXh0cmFWaXNpYmxlU2l6ZSAqIHNjYWxlKSAvIDIgK1xuICAgICAgICAgIChzcGFjZSAqIHNjYWxlKSAvIDI7XG5cbiAgICAgICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICAgICAgdGhpcy50cmFuc01hdC50cmFuc2xhdGVTZWxmKC1vZmZzZXRYLCAtb2Zmc2V0WSk7XG4gICAgICAgIHRoaXMudHJhbnNNYXQuc2NhbGVTZWxmKHNjYWxlLCBzY2FsZSk7XG4gICAgICAgIGN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBib2FyZEN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBhbmFseXNpc0N0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBjdXJzb3JDdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgICAgbWFya3VwQ3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICB9XG4gIH1cblxuICBjYWxjQm9hcmRWaXNpYmxlQXJlYSh6b29tID0gZmFsc2UpIHtcbiAgICB0aGlzLnpvb21Cb2FyZCh0aGlzLm9wdGlvbnMuem9vbSk7XG4gIH1cblxuICByZXNldFRyYW5zZm9ybSgpIHtcbiAgICBjb25zdCB7Y2FudmFzLCBhbmFseXNpc0NhbnZhcywgYm9hcmQsIGN1cnNvckNhbnZhcywgbWFya3VwQ2FudmFzfSA9IHRoaXM7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGJvYXJkQ3R4ID0gYm9hcmQ/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgY3Vyc29yQ3R4ID0gY3Vyc29yQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IG1hcmt1cEN0eCA9IG1hcmt1cENhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBhbmFseXNpc0N0eCA9IGFuYWx5c2lzQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMudHJhbnNNYXQgPSBuZXcgRE9NTWF0cml4KCk7XG4gICAgY3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGJvYXJkQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGFuYWx5c2lzQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGN1cnNvckN0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICBtYXJrdXBDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hdH0gPSB0aGlzO1xuICAgIGlmICh0aGlzLm1hdCAmJiBtYXRbMF0pIHRoaXMub3B0aW9ucy5ib2FyZFNpemUgPSBtYXRbMF0ubGVuZ3RoO1xuXG4gICAgLy8gVE9ETzogY2FsYyB2aXNpYmxlIGFyZWEgdHdpY2UgaXMgbm90IGdvb2QsIG5lZWQgdG8gcmVmYWN0b3JcbiAgICB0aGlzLnpvb21Cb2FyZCh0aGlzLm9wdGlvbnMuem9vbSk7XG4gICAgdGhpcy56b29tQm9hcmQodGhpcy5vcHRpb25zLnpvb20pO1xuICAgIHRoaXMuY2xlYXJBbGxDYW52YXMoKTtcbiAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgIHRoaXMuZHJhd1N0b25lcygpO1xuICAgIHRoaXMuZHJhd01hcmt1cCgpO1xuICAgIHRoaXMuZHJhd0N1cnNvcigpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0FuYWx5c2lzKSB0aGlzLmRyYXdBbmFseXNpcygpO1xuICB9XG5cbiAgcmVuZGVySW5PbmVDYW52YXMoY2FudmFzID0gdGhpcy5jYW52YXMpIHtcbiAgICB0aGlzLmNsZWFyQWxsQ2FudmFzKCk7XG4gICAgdGhpcy5kcmF3Qm9hcmQoY2FudmFzLCBmYWxzZSk7XG4gICAgdGhpcy5kcmF3U3RvbmVzKHRoaXMubWF0LCBjYW52YXMsIGZhbHNlKTtcbiAgICB0aGlzLmRyYXdNYXJrdXAodGhpcy5tYXQsIHRoaXMubWFya3VwLCBjYW52YXMsIGZhbHNlKTtcbiAgfVxuXG4gIGNsZWFyQWxsQ2FudmFzID0gKCkgPT4ge1xuICAgIHRoaXMuY2xlYXJDYW52YXModGhpcy5ib2FyZCk7XG4gICAgdGhpcy5jbGVhckNhbnZhcygpO1xuICAgIHRoaXMuY2xlYXJDYW52YXModGhpcy5tYXJrdXBDYW52YXMpO1xuICAgIHRoaXMuY2xlYXJDdXJzb3JDYW52YXMoKTtcbiAgICB0aGlzLmNsZWFyQW5hbHlzaXNDYW52YXMoKTtcbiAgfTtcblxuICBjbGVhckJvYXJkID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5ib2FyZCkgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIC8vIFdpbGwgYWx3YXlzIGNsZWFyIHRoZSByaWdodCBzcGFjZVxuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhckNhbnZhcyA9IChjYW52YXMgPSB0aGlzLmNhbnZhcykgPT4ge1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhck1hcmt1cENhbnZhcyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMubWFya3VwQ2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gdGhpcy5tYXJrdXBDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5tYXJrdXBDYW52YXMud2lkdGgsIHRoaXMubWFya3VwQ2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhckN1cnNvckNhbnZhcyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuY3Vyc29yQ2FudmFzKSByZXR1cm47XG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMub3B0aW9ucy5ib2FyZFNpemU7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdXJzb3JDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jdXJzb3JDYW52YXMud2lkdGgsIHRoaXMuY3Vyc29yQ2FudmFzLmhlaWdodCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfTtcblxuICBjbGVhckFuYWx5c2lzQ2FudmFzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5hbmFseXNpc0NhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuYW5hbHlzaXNDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRoaXMuYW5hbHlzaXNDYW52YXMud2lkdGgsXG4gICAgICAgIHRoaXMuYW5hbHlzaXNDYW52YXMuaGVpZ2h0XG4gICAgICApO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH07XG5cbiAgZHJhd0FuYWx5c2lzID0gKGFuYWx5c2lzID0gdGhpcy5hbmFseXNpcykgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuYW5hbHlzaXNDYW52YXM7XG4gICAgY29uc3Qge1xuICAgICAgdGhlbWUgPSBUaGVtZS5CbGFja0FuZFdoaXRlLFxuICAgICAgYW5hbHlzaXNQb2ludFRoZW1lLFxuICAgICAgYm9hcmRTaXplLFxuICAgICAgZm9yY2VBbmFseXNpc0JvYXJkU2l6ZSxcbiAgICB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IHttYXQsIG1hcmt1cH0gPSB0aGlzO1xuICAgIGlmICghY2FudmFzIHx8ICFhbmFseXNpcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmICghY3R4KSByZXR1cm47XG4gICAgdGhpcy5jbGVhckFuYWx5c2lzQ2FudmFzKCk7XG4gICAgY29uc3Qge3Jvb3RJbmZvfSA9IGFuYWx5c2lzO1xuXG4gICAgYW5hbHlzaXMubW92ZUluZm9zLmZvckVhY2gobSA9PiB7XG4gICAgICBpZiAobS5tb3ZlID09PSAncGFzcycpIHJldHVybjtcbiAgICAgIGNvbnN0IGlkT2JqID0gSlNPTi5wYXJzZShhbmFseXNpcy5pZCk7XG4gICAgICAvLyBjb25zdCB7eDogb3gsIHk6IG95fSA9IHJldmVyc2VPZmZzZXQobWF0LCBpZE9iai5ieCwgaWRPYmouYnkpO1xuICAgICAgLy8gbGV0IHt4OiBpLCB5OiBqfSA9IGExVG9Qb3MobS5tb3ZlKTtcbiAgICAgIC8vIGkgKz0gb3g7XG4gICAgICAvLyBqICs9IG95O1xuICAgICAgLy8gbGV0IGFuYWx5c2lzQm9hcmRTaXplID0gZm9yY2VBbmFseXNpc0JvYXJkU2l6ZSB8fCBib2FyZFNpemU7XG4gICAgICBsZXQgYW5hbHlzaXNCb2FyZFNpemUgPSBib2FyZFNpemU7XG4gICAgICBjb25zdCBvZmZzZXRlZE1vdmUgPSBvZmZzZXRBMU1vdmUoXG4gICAgICAgIG0ubW92ZSxcbiAgICAgICAgMCxcbiAgICAgICAgYW5hbHlzaXNCb2FyZFNpemUgLSBpZE9iai5ieVxuICAgICAgKTtcbiAgICAgIGxldCB7eDogaSwgeTogan0gPSBhMVRvUG9zKG9mZnNldGVkTW92ZSk7XG4gICAgICBpZiAobWF0W2ldW2pdICE9PSAwKSByZXR1cm47XG4gICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgY29uc3QgcmF0aW8gPSAwLjQ2O1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGlmIChcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLlN1YmR1ZWQgJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgJiZcbiAgICAgICAgdGhlbWUgIT09IFRoZW1lLkZsYXRcbiAgICAgICkge1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDM7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMztcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gJyM1NTUnO1xuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDA7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gJyNmZmYnO1xuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDA7XG4gICAgICB9XG5cbiAgICAgIGxldCBvdXRsaW5lQ29sb3I7XG4gICAgICBpZiAobWFya3VwW2ldW2pdLmluY2x1ZGVzKE1hcmt1cC5Qb3NpdGl2ZU5vZGUpKSB7XG4gICAgICAgIG91dGxpbmVDb2xvciA9IHRoaXMub3B0aW9ucy5wb3NpdGl2ZU5vZGVDb2xvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKG1hcmt1cFtpXVtqXS5pbmNsdWRlcyhNYXJrdXAuTmVnYXRpdmVOb2RlKSkge1xuICAgICAgICBvdXRsaW5lQ29sb3IgPSB0aGlzLm9wdGlvbnMubmVnYXRpdmVOb2RlQ29sb3I7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXJrdXBbaV1bal0uaW5jbHVkZXMoTWFya3VwLk5ldXRyYWxOb2RlKSkge1xuICAgICAgICBvdXRsaW5lQ29sb3IgPSB0aGlzLm9wdGlvbnMubmV1dHJhbE5vZGVDb2xvcjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcG9pbnQgPSBuZXcgQW5hbHlzaXNQb2ludChcbiAgICAgICAgY3R4LFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICBzcGFjZSAqIHJhdGlvLFxuICAgICAgICByb290SW5mbyxcbiAgICAgICAgbSxcbiAgICAgICAgYW5hbHlzaXNQb2ludFRoZW1lLFxuICAgICAgICBvdXRsaW5lQ29sb3JcbiAgICAgICk7XG4gICAgICBwb2ludC5kcmF3KCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGRyYXdNYXJrdXAgPSAoXG4gICAgbWF0ID0gdGhpcy5tYXQsXG4gICAgbWFya3VwID0gdGhpcy5tYXJrdXAsXG4gICAgbWFya3VwQ2FudmFzID0gdGhpcy5tYXJrdXBDYW52YXMsXG4gICAgY2xlYXIgPSB0cnVlXG4gICkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IG1hcmt1cENhbnZhcztcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoY2FudmFzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3VwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWFya3VwW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gbWFya3VwW2ldW2pdO1xuICAgICAgICAgIHZhbHVlcz8uc3BsaXQoJ3wnKS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgICAgICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3QgeSA9IHNjYWxlZFBhZGRpbmcgKyBqICogc3BhY2U7XG4gICAgICAgICAgICAgIGNvbnN0IGtpID0gbWF0W2ldW2pdO1xuICAgICAgICAgICAgICBsZXQgbWFya3VwO1xuICAgICAgICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuQ2lyY2xlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBDaXJjbGVNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkN1cnJlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IENpcmNsZVNvbGlkTWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Qb3NpdGl2ZU5vZGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IFBvc2l0aXZlTm9kZU1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIE1hcmt1cC5DaXJjbGVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwLnNldENvbG9yKHRoaXMub3B0aW9ucy5wb3NpdGl2ZU5vZGVDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Ob2RlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb2xvciA9IHRoaXMub3B0aW9ucy5kZWZhdWx0Tm9kZUNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IE1hcmt1cC5OZWdhdGl2ZU5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHRoaXMub3B0aW9ucy5uZWdhdGl2ZU5vZGVDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gTWFya3VwLk5ldXRyYWxOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB0aGlzLm9wdGlvbnMubmV1dHJhbE5vZGVDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBOb2RlTWFya3VwKFxuICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAga2ksXG4gICAgICAgICAgICAgICAgICAgICAgTWFya3VwLkNpcmNsZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAuc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLlNxdWFyZToge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgU3F1YXJlTWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5UcmlhbmdsZToge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgVHJpYW5nbGVNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkNyb3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBDcm9zc01hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IFRleHRNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2ksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWFya3VwPy5kcmF3KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBkcmF3Qm9hcmQgPSAoYm9hcmQgPSB0aGlzLmJvYXJkLCBjbGVhciA9IHRydWUpID0+IHtcbiAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoYm9hcmQpO1xuICAgIHRoaXMuZHJhd0Jhbihib2FyZCk7XG4gICAgdGhpcy5kcmF3Qm9hcmRMaW5lKGJvYXJkKTtcbiAgICB0aGlzLmRyYXdTdGFycyhib2FyZCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb29yZGluYXRlKSB7XG4gICAgICB0aGlzLmRyYXdDb29yZGluYXRlKCk7XG4gICAgfVxuICB9O1xuXG4gIGRyYXdCYW4gPSAoYm9hcmQgPSB0aGlzLmJvYXJkKSA9PiB7XG4gICAgY29uc3Qge3RoZW1lLCB0aGVtZVJlc291cmNlc30gPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKGJvYXJkKSB7XG4gICAgICBib2FyZC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnMnB4JztcbiAgICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBpZiAoY3R4KSB7XG4gICAgICAgIGlmICh0aGVtZSA9PT0gVGhlbWUuQmxhY2tBbmRXaGl0ZSkge1xuICAgICAgICAgIGJvYXJkLnN0eWxlLmJveFNoYWRvdyA9ICcwcHggMHB4IDBweCAjMDAwMDAwJztcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xuICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCBib2FyZC53aWR0aCwgYm9hcmQuaGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGVtZSA9PT0gVGhlbWUuRmxhdCkge1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLm9wdGlvbnMudGhlbWVGbGF0Qm9hcmRDb2xvcjtcbiAgICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgYm9hcmQud2lkdGgsIGJvYXJkLmhlaWdodCk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLldhbG51dCAmJlxuICAgICAgICAgIHRoZW1lUmVzb3VyY2VzW3RoZW1lXS5ib2FyZCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IGJvYXJkVXJsID0gdGhlbWVSZXNvdXJjZXNbdGhlbWVdLmJvYXJkIHx8ICcnO1xuICAgICAgICAgIGNvbnN0IGJvYXJkUmVzID0gaW1hZ2VzW2JvYXJkVXJsXTtcbiAgICAgICAgICBpZiAoYm9hcmRSZXMpIHtcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoYm9hcmRSZXMsIDAsIDAsIGJvYXJkLndpZHRoLCBib2FyZC5oZWlnaHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBib2FyZFVybCA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXS5ib2FyZCB8fCAnJztcbiAgICAgICAgICBjb25zdCBpbWFnZSA9IGltYWdlc1tib2FyZFVybF07XG4gICAgICAgICAgaWYgKGltYWdlKSB7XG4gICAgICAgICAgICBjb25zdCBwYXR0ZXJuID0gY3R4LmNyZWF0ZVBhdHRlcm4oaW1hZ2UsICdyZXBlYXQnKTtcbiAgICAgICAgICAgIGlmIChwYXR0ZXJuKSB7XG4gICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBwYXR0ZXJuO1xuICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgYm9hcmQud2lkdGgsIGJvYXJkLmhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRyYXdCb2FyZExpbmUgPSAoYm9hcmQgPSB0aGlzLmJvYXJkKSA9PiB7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGNvbnN0IHt2aXNpYmxlQXJlYSwgb3B0aW9uc30gPSB0aGlzO1xuICAgIGNvbnN0IHtcbiAgICAgIHpvb20sXG4gICAgICBib2FyZFNpemUsXG4gICAgICBib2FyZExpbmVXaWR0aCxcbiAgICAgIGJvYXJkRWRnZUxpbmVXaWR0aCxcbiAgICAgIGJvYXJkTGluZUV4dGVudCxcbiAgICAgIGFkYXB0aXZlQm9hcmRMaW5lLFxuICAgIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuXG4gICAgICBjb25zdCBleHRlbmRTcGFjZSA9IHpvb20gPyBib2FyZExpbmVFeHRlbnQgKiBzcGFjZSA6IDA7XG5cbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG5cbiAgICAgIGxldCBlZGdlTGluZVdpZHRoID0gYWRhcHRpdmVCb2FyZExpbmVcbiAgICAgICAgPyBib2FyZC53aWR0aCAqIDAuMDAyXG4gICAgICAgIDogYm9hcmRFZGdlTGluZVdpZHRoO1xuXG4gICAgICAvLyBpZiAoYWRhcHRpdmVCb2FyZExpbmUgfHwgKCFhZGFwdGl2ZUJvYXJkTGluZSAmJiAhaXNNb2JpbGVEZXZpY2UoKSkpIHtcbiAgICAgIC8vICBlZGdlTGluZVdpZHRoICo9IGRwcjtcbiAgICAgIC8vIH1cblxuICAgICAgbGV0IGxpbmVXaWR0aCA9IGFkYXB0aXZlQm9hcmRMaW5lID8gYm9hcmQud2lkdGggKiAwLjAwMSA6IGJvYXJkTGluZVdpZHRoO1xuXG4gICAgICAvLyBpZiAoYWRhcHRpdmVCb2FyZExpbmUgfHwgICghYWRhcHRpdmVCb2FyZExpbmUgJiYgIWlzTW9iaWxlRGV2aWNlKCkpKSB7XG4gICAgICAvLyAgIGxpbmVXaWR0aCAqPSBkcHI7XG4gICAgICAvLyB9XG5cbiAgICAgIC8vIHZlcnRpY2FsXG4gICAgICBmb3IgKGxldCBpID0gdmlzaWJsZUFyZWFbMF1bMF07IGkgPD0gdmlzaWJsZUFyZWFbMF1bMV07IGkrKykge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiYgaSA9PT0gMCkgfHxcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEgJiYgaSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGVkZ2VMaW5lV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNNb2JpbGVEZXZpY2UoKSAmJlxuICAgICAgICAgIGkgPT09IHRoaXMuY3Vyc29yUG9zaXRpb25bMF0gJiZcbiAgICAgICAgICB0aGlzLnRvdWNoTW92aW5nXG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBjdHgubGluZVdpZHRoICogMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3RhcnRQb2ludFkgPVxuICAgICAgICAgIGkgPT09IDAgfHwgaSA9PT0gYm9hcmRTaXplIC0gMVxuICAgICAgICAgICAgPyBzY2FsZWRQYWRkaW5nICsgdmlzaWJsZUFyZWFbMV1bMF0gKiBzcGFjZSAtIGVkZ2VMaW5lV2lkdGggLyAyXG4gICAgICAgICAgICA6IHNjYWxlZFBhZGRpbmcgKyB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlO1xuICAgICAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgIHN0YXJ0UG9pbnRZICs9IGRwciAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVuZFBvaW50WSA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNwYWNlICogdmlzaWJsZUFyZWFbMV1bMV0gKyBzY2FsZWRQYWRkaW5nICsgZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc3BhY2UgKiB2aXNpYmxlQXJlYVsxXVsxXSArIHNjYWxlZFBhZGRpbmc7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgZW5kUG9pbnRZIC09IGRwciAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzFdWzBdID4gMCkgc3RhcnRQb2ludFkgLT0gZXh0ZW5kU3BhY2U7XG4gICAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVsxXSA8IGJvYXJkU2l6ZSAtIDEpIGVuZFBvaW50WSArPSBleHRlbmRTcGFjZTtcbiAgICAgICAgY3R4Lm1vdmVUbyhpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nLCBzdGFydFBvaW50WSk7XG4gICAgICAgIGN0eC5saW5lVG8oaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZywgZW5kUG9pbnRZKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBob3Jpem9udGFsXG4gICAgICBmb3IgKGxldCBpID0gdmlzaWJsZUFyZWFbMV1bMF07IGkgPD0gdmlzaWJsZUFyZWFbMV1bMV07IGkrKykge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDAgJiYgaSA9PT0gMCkgfHxcbiAgICAgICAgICAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEgJiYgaSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGVkZ2VMaW5lV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNNb2JpbGVEZXZpY2UoKSAmJlxuICAgICAgICAgIGkgPT09IHRoaXMuY3Vyc29yUG9zaXRpb25bMV0gJiZcbiAgICAgICAgICB0aGlzLnRvdWNoTW92aW5nXG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBjdHgubGluZVdpZHRoICogMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3RhcnRQb2ludFggPVxuICAgICAgICAgIGkgPT09IDAgfHwgaSA9PT0gYm9hcmRTaXplIC0gMVxuICAgICAgICAgICAgPyBzY2FsZWRQYWRkaW5nICsgdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZSAtIGVkZ2VMaW5lV2lkdGggLyAyXG4gICAgICAgICAgICA6IHNjYWxlZFBhZGRpbmcgKyB2aXNpYmxlQXJlYVswXVswXSAqIHNwYWNlO1xuICAgICAgICBsZXQgZW5kUG9pbnRYID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc3BhY2UgKiB2aXNpYmxlQXJlYVswXVsxXSArIHNjYWxlZFBhZGRpbmcgKyBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzcGFjZSAqIHZpc2libGVBcmVhWzBdWzFdICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICBzdGFydFBvaW50WCArPSBkcHIgLyAyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgZW5kUG9pbnRYIC09IGRwciAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmlzaWJsZUFyZWFbMF1bMF0gPiAwKSBzdGFydFBvaW50WCAtPSBleHRlbmRTcGFjZTtcbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzBdWzFdIDwgYm9hcmRTaXplIC0gMSkgZW5kUG9pbnRYICs9IGV4dGVuZFNwYWNlO1xuICAgICAgICBjdHgubW92ZVRvKHN0YXJ0UG9pbnRYLCBpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nKTtcbiAgICAgICAgY3R4LmxpbmVUbyhlbmRQb2ludFgsIGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRyYXdTdGFycyA9IChib2FyZCA9IHRoaXMuYm9hcmQpID0+IHtcbiAgICBpZiAoIWJvYXJkKSByZXR1cm47XG4gICAgaWYgKHRoaXMub3B0aW9ucy5ib2FyZFNpemUgIT09IDE5KSByZXR1cm47XG5cbiAgICBsZXQge3N0YXJTaXplOiBzdGFyU2l6ZU9wdGlvbnMsIGFkYXB0aXZlU3RhclNpemV9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgY29uc3QgdmlzaWJsZUFyZWEgPSB0aGlzLnZpc2libGVBcmVhO1xuICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgbGV0IHN0YXJTaXplID0gYWRhcHRpdmVTdGFyU2l6ZSA/IGJvYXJkLndpZHRoICogMC4wMDM1IDogc3RhclNpemVPcHRpb25zO1xuICAgIC8vIGlmICghaXNNb2JpbGVEZXZpY2UoKSB8fCAhYWRhcHRpdmVTdGFyU2l6ZSkge1xuICAgIC8vICAgc3RhclNpemUgPSBzdGFyU2l6ZSAqIGRwcjtcbiAgICAvLyB9XG4gICAgaWYgKGN0eCkge1xuICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgLy8gRHJhd2luZyBzdGFyXG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBbMywgOSwgMTVdLmZvckVhY2goaSA9PiB7XG4gICAgICAgIFszLCA5LCAxNV0uZm9yRWFjaChqID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBpID49IHZpc2libGVBcmVhWzBdWzBdICYmXG4gICAgICAgICAgICBpIDw9IHZpc2libGVBcmVhWzBdWzFdICYmXG4gICAgICAgICAgICBqID49IHZpc2libGVBcmVhWzFdWzBdICYmXG4gICAgICAgICAgICBqIDw9IHZpc2libGVBcmVhWzFdWzFdXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguYXJjKFxuICAgICAgICAgICAgICBpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nLFxuICAgICAgICAgICAgICBqICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nLFxuICAgICAgICAgICAgICBzdGFyU2l6ZSxcbiAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgMiAqIE1hdGguUEksXG4gICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBkcmF3Q29vcmRpbmF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7Ym9hcmQsIG9wdGlvbnMsIHZpc2libGVBcmVhfSA9IHRoaXM7XG4gICAgaWYgKCFib2FyZCkgcmV0dXJuO1xuICAgIGNvbnN0IHtib2FyZFNpemUsIHpvb20sIHBhZGRpbmcsIGJvYXJkTGluZUV4dGVudH0gPSBvcHRpb25zO1xuICAgIGxldCB6b29tZWRCb2FyZFNpemUgPSB2aXNpYmxlQXJlYVswXVsxXSAtIHZpc2libGVBcmVhWzBdWzBdICsgMTtcbiAgICBjb25zdCBjdHggPSBib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xuICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke3NwYWNlIC8gMi44fXB4IEhlbHZldGljYWA7XG5cbiAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuY2FsY0NlbnRlcigpO1xuICAgICAgbGV0IG9mZnNldCA9IHNwYWNlIC8gMjtcblxuICAgICAgaWYgKFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5DZW50ZXIgJiZcbiAgICAgICAgdmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiZcbiAgICAgICAgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICkge1xuICAgICAgICBvZmZzZXQgLT0gc2NhbGVkUGFkZGluZyAvIDI7XG4gICAgICB9XG5cbiAgICAgIEExX0xFVFRFUlMuZm9yRWFjaCgobCwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgeCA9IHNwYWNlICogaW5kZXggKyBzY2FsZWRQYWRkaW5nO1xuICAgICAgICBsZXQgb2Zmc2V0VG9wID0gb2Zmc2V0O1xuICAgICAgICBsZXQgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0O1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wXG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldFRvcCAtPSBzcGFjZSAqIGJvYXJkTGluZUV4dGVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tXG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldEJvdHRvbSAtPSAoc3BhY2UgKiBib2FyZExpbmVFeHRlbnQpIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeTEgPSB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlICsgcGFkZGluZyAtIG9mZnNldFRvcDtcbiAgICAgICAgbGV0IHkyID0geTEgKyB6b29tZWRCb2FyZFNpemUgKiBzcGFjZSArIG9mZnNldEJvdHRvbSAqIDI7XG4gICAgICAgIGlmIChpbmRleCA+PSB2aXNpYmxlQXJlYVswXVswXSAmJiBpbmRleCA8PSB2aXNpYmxlQXJlYVswXVsxXSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbVJpZ2h0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLCB4LCB5MSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wTGVmdCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGwsIHgsIHkyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBBMV9OVU1CRVJTLnNsaWNlKC10aGlzLm9wdGlvbnMuYm9hcmRTaXplKS5mb3JFYWNoKChsOiBudW1iZXIsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHkgPSBzcGFjZSAqIGluZGV4ICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgbGV0IG9mZnNldExlZnQgPSBvZmZzZXQ7XG4gICAgICAgIGxldCBvZmZzZXRSaWdodCA9IG9mZnNldDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICBvZmZzZXRMZWZ0IC09IHNwYWNlICogYm9hcmRMaW5lRXh0ZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbVJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuUmlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2Zmc2V0UmlnaHQgLT0gKHNwYWNlICogYm9hcmRMaW5lRXh0ZW50KSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHgxID0gdmlzaWJsZUFyZWFbMF1bMF0gKiBzcGFjZSArIHBhZGRpbmcgLSBvZmZzZXRMZWZ0O1xuICAgICAgICBsZXQgeDIgPSB4MSArIHpvb21lZEJvYXJkU2l6ZSAqIHNwYWNlICsgMiAqIG9mZnNldFJpZ2h0O1xuICAgICAgICBpZiAoaW5kZXggPj0gdmlzaWJsZUFyZWFbMV1bMF0gJiYgaW5kZXggPD0gdmlzaWJsZUFyZWFbMV1bMV0pIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BSaWdodCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuQm90dG9tUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlJpZ2h0XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobC50b1N0cmluZygpLCB4MSwgeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkxlZnRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLnRvU3RyaW5nKCksIHgyLCB5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBjYWxjU3BhY2VBbmRQYWRkaW5nID0gKGNhbnZhcyA9IHRoaXMuY2FudmFzKSA9PiB7XG4gICAgbGV0IHNwYWNlID0gMDtcbiAgICBsZXQgc2NhbGVkUGFkZGluZyA9IDA7XG4gICAgbGV0IHNjYWxlZEJvYXJkRXh0ZW50ID0gMDtcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBjb25zdCB7cGFkZGluZywgYm9hcmRTaXplLCBib2FyZExpbmVFeHRlbnQsIHpvb219ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3Qge3Zpc2libGVBcmVhfSA9IHRoaXM7XG5cbiAgICAgIGlmIChcbiAgICAgICAgKHZpc2libGVBcmVhWzBdWzBdICE9PSAwICYmIHZpc2libGVBcmVhWzBdWzFdID09PSBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAodmlzaWJsZUFyZWFbMV1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgICApIHtcbiAgICAgICAgc2NhbGVkQm9hcmRFeHRlbnQgPSBib2FyZExpbmVFeHRlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgICh2aXNpYmxlQXJlYVswXVswXSAhPT0gMCAmJiB2aXNpYmxlQXJlYVswXVsxXSAhPT0gYm9hcmRTaXplIC0gMSkgfHxcbiAgICAgICAgKHZpc2libGVBcmVhWzFdWzBdICE9PSAwICYmIHZpc2libGVBcmVhWzFdWzFdICE9PSBib2FyZFNpemUgLSAxKVxuICAgICAgKSB7XG4gICAgICAgIHNjYWxlZEJvYXJkRXh0ZW50ID0gYm9hcmRMaW5lRXh0ZW50ICogMjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGl2aXNvciA9IHpvb20gPyBib2FyZFNpemUgKyBzY2FsZWRCb2FyZEV4dGVudCA6IGJvYXJkU2l6ZTtcbiAgICAgIC8vIGNvbnN0IGRpdmlzb3IgPSBib2FyZFNpemU7XG4gICAgICBzcGFjZSA9IChjYW52YXMud2lkdGggLSBwYWRkaW5nICogMikgLyBNYXRoLmNlaWwoZGl2aXNvcik7XG4gICAgICBzY2FsZWRQYWRkaW5nID0gcGFkZGluZyArIHNwYWNlIC8gMjtcbiAgICB9XG4gICAgcmV0dXJuIHtzcGFjZSwgc2NhbGVkUGFkZGluZywgc2NhbGVkQm9hcmRFeHRlbnR9O1xuICB9O1xuXG4gIGRyYXdDdXJzb3IgPSAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgdGhpcy5jbGVhckN1cnNvckNhbnZhcygpO1xuICAgICAgaWYgKHRoaXMuY3Vyc29yID09PSBDdXJzb3IuTm9uZSkgcmV0dXJuO1xuICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkgJiYgIXRoaXMudG91Y2hNb3ZpbmcpIHJldHVybjtcblxuICAgICAgY29uc3Qge3BhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBjb25zdCB7c3BhY2V9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICBjb25zdCB7dmlzaWJsZUFyZWEsIGN1cnNvciwgY3Vyc29yVmFsdWV9ID0gdGhpcztcblxuICAgICAgY29uc3QgW2lkeCwgaWR5XSA9IHRoaXMuY3Vyc29yUG9zaXRpb247XG4gICAgICBpZiAoaWR4IDwgdmlzaWJsZUFyZWFbMF1bMF0gfHwgaWR4ID4gdmlzaWJsZUFyZWFbMF1bMV0pIHJldHVybjtcbiAgICAgIGlmIChpZHkgPCB2aXNpYmxlQXJlYVsxXVswXSB8fCBpZHkgPiB2aXNpYmxlQXJlYVsxXVsxXSkgcmV0dXJuO1xuICAgICAgY29uc3QgeCA9IGlkeCAqIHNwYWNlICsgc3BhY2UgLyAyICsgcGFkZGluZztcbiAgICAgIGNvbnN0IHkgPSBpZHkgKiBzcGFjZSArIHNwYWNlIC8gMiArIHBhZGRpbmc7XG4gICAgICBjb25zdCBraSA9IHRoaXMubWF0Py5baWR4XT8uW2lkeV0gfHwgS2kuRW1wdHk7XG5cbiAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgbGV0IGN1cjtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHNwYWNlICogMC44O1xuICAgICAgICBpZiAoY3Vyc29yID09PSBDdXJzb3IuQ2lyY2xlKSB7XG4gICAgICAgICAgY3VyID0gbmV3IENpcmNsZU1hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuU3F1YXJlKSB7XG4gICAgICAgICAgY3VyID0gbmV3IFNxdWFyZU1hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuVHJpYW5nbGUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgVHJpYW5nbGVNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLkNyb3NzKSB7XG4gICAgICAgICAgY3VyID0gbmV3IENyb3NzTWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5UZXh0KSB7XG4gICAgICAgICAgY3VyID0gbmV3IFRleHRNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2ksIGN1cnNvclZhbHVlKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChraSA9PT0gS2kuRW1wdHkgJiYgY3Vyc29yID09PSBDdXJzb3IuQmxhY2tTdG9uZSkge1xuICAgICAgICAgIGN1ciA9IG5ldyBDb2xvclN0b25lKGN0eCwgeCwgeSwgS2kuQmxhY2spO1xuICAgICAgICAgIGN1ci5zZXRTaXplKHNpemUpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtpID09PSBLaS5FbXB0eSAmJiBjdXJzb3IgPT09IEN1cnNvci5XaGl0ZVN0b25lKSB7XG4gICAgICAgICAgY3VyID0gbmV3IENvbG9yU3RvbmUoY3R4LCB4LCB5LCBLaS5XaGl0ZSk7XG4gICAgICAgICAgY3VyLnNldFNpemUoc2l6ZSk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuNSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuQ2xlYXIpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgQ29sb3JTdG9uZShjdHgsIHgsIHksIEtpLkVtcHR5KTtcbiAgICAgICAgICBjdXIuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgfVxuICAgICAgICBjdXI/LmRyYXcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZHJhd1N0b25lcyA9IChcbiAgICBtYXQ6IG51bWJlcltdW10gPSB0aGlzLm1hdCxcbiAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICBjbGVhciA9IHRydWVcbiAgKSA9PiB7XG4gICAgY29uc3Qge3RoZW1lID0gVGhlbWUuQmxhY2tBbmRXaGl0ZSwgdGhlbWVSZXNvdXJjZXN9ID0gdGhpcy5vcHRpb25zO1xuICAgIGlmIChjbGVhcikgdGhpcy5jbGVhckNhbnZhcygpO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBtYXRbaV1bal07XG4gICAgICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgICAgICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgICAgICAgICAgY29uc3QgeSA9IHNjYWxlZFBhZGRpbmcgKyBqICogc3BhY2U7XG5cbiAgICAgICAgICAgICAgY29uc3QgcmF0aW8gPSAwLjQ1O1xuICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLlN1YmR1ZWQgJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuQmxhY2tBbmRXaGl0ZSAmJlxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5GbGF0XG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMztcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDM7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gJyM1NTUnO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gODtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDA7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAwO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgc3RvbmU7XG4gICAgICAgICAgICAgIHN3aXRjaCAodGhlbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFRoZW1lLkJsYWNrQW5kV2hpdGU6XG4gICAgICAgICAgICAgICAgY2FzZSBUaGVtZS5GbGF0OiB7XG4gICAgICAgICAgICAgICAgICBzdG9uZSA9IG5ldyBDb2xvclN0b25lKGN0eCwgeCwgeSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgc3RvbmUuc2V0U2l6ZShzcGFjZSAqIHJhdGlvICogMik7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgY29uc3QgYmxhY2tzID0gdGhlbWVSZXNvdXJjZXNbdGhlbWVdLmJsYWNrcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgIGkgPT4gaW1hZ2VzW2ldXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgY29uc3Qgd2hpdGVzID0gdGhlbWVSZXNvdXJjZXNbdGhlbWVdLndoaXRlcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgIGkgPT4gaW1hZ2VzW2ldXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgY29uc3QgbW9kID0gaSArIDEwICsgajtcbiAgICAgICAgICAgICAgICAgIHN0b25lID0gbmV3IEltYWdlU3RvbmUoY3R4LCB4LCB5LCB2YWx1ZSwgbW9kLCBibGFja3MsIHdoaXRlcyk7XG4gICAgICAgICAgICAgICAgICBzdG9uZS5zZXRTaXplKHNwYWNlICogcmF0aW8gKiAyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RvbmUuZHJhdygpO1xuICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJLaSIsIlRoZW1lIiwiQW5hbHlzaXNQb2ludFRoZW1lIiwiQ2VudGVyIiwiTWFya3VwIiwiQ3Vyc29yIiwiUHJvYmxlbUFuc3dlclR5cGUiLCJQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kiLCJfX2V4dGVuZHMiLCJfX3NwcmVhZEFycmF5IiwiX19yZWFkIiwiY2xvbmVEZWVwIiwicmVwbGFjZSIsImNvbXBhY3QiLCJmaWx0ZXIiLCJmaW5kTGFzdEluZGV4IiwiZmxhdHRlbkRlcHRoIiwic3VtIiwiY2xvbmUiLCJfX3ZhbHVlcyIsInNhbXBsZSIsIl9fYXNzaWduIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQTBJWUEsb0JBSVg7QUFKRCxDQUFBLFVBQVksRUFBRSxFQUFBO0FBQ1osSUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLE9BQVMsQ0FBQTtBQUNULElBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLE9BQVUsQ0FBQTtBQUNWLElBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxPQUFTLENBQUE7QUFDWCxDQUFDLEVBSldBLFVBQUUsS0FBRkEsVUFBRSxHQUliLEVBQUEsQ0FBQSxDQUFBLENBQUE7QUFFV0MsdUJBUVg7QUFSRCxDQUFBLFVBQVksS0FBSyxFQUFBO0FBQ2YsSUFBQSxLQUFBLENBQUEsZUFBQSxDQUFBLEdBQUEsaUJBQWlDLENBQUE7QUFDakMsSUFBQSxLQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsTUFBYSxDQUFBO0FBQ2IsSUFBQSxLQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsU0FBbUIsQ0FBQTtBQUNuQixJQUFBLEtBQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxhQUEwQixDQUFBO0FBQzFCLElBQUEsS0FBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLGlCQUFpQyxDQUFBO0FBQ2pDLElBQUEsS0FBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLFFBQWlCLENBQUE7QUFDakIsSUFBQSxLQUFBLENBQUEsZ0JBQUEsQ0FBQSxHQUFBLGdCQUFpQyxDQUFBO0FBQ25DLENBQUMsRUFSV0EsYUFBSyxLQUFMQSxhQUFLLEdBUWhCLEVBQUEsQ0FBQSxDQUFBLENBQUE7QUFFV0Msb0NBR1g7QUFIRCxDQUFBLFVBQVksa0JBQWtCLEVBQUE7QUFDNUIsSUFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxHQUFBLFNBQW1CLENBQUE7QUFDbkIsSUFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxHQUFBLFNBQW1CLENBQUE7QUFDckIsQ0FBQyxFQUhXQSwwQkFBa0IsS0FBbEJBLDBCQUFrQixHQUc3QixFQUFBLENBQUEsQ0FBQSxDQUFBO0FBRVdDLHdCQVVYO0FBVkQsQ0FBQSxVQUFZLE1BQU0sRUFBQTtBQUNoQixJQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxHQUFVLENBQUE7QUFDVixJQUFBLE1BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxHQUFXLENBQUE7QUFDWCxJQUFBLE1BQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxHQUFTLENBQUE7QUFDVCxJQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxHQUFZLENBQUE7QUFDWixJQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxJQUFlLENBQUE7QUFDZixJQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxJQUFjLENBQUE7QUFDZCxJQUFBLE1BQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxJQUFpQixDQUFBO0FBQ2pCLElBQUEsTUFBQSxDQUFBLGFBQUEsQ0FBQSxHQUFBLElBQWtCLENBQUE7QUFDbEIsSUFBQSxNQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsR0FBWSxDQUFBO0FBQ2QsQ0FBQyxFQVZXQSxjQUFNLEtBQU5BLGNBQU0sR0FVakIsRUFBQSxDQUFBLENBQUEsQ0FBQTtBQUVXQyx3QkFnQlg7QUFoQkQsQ0FBQSxVQUFZLE1BQU0sRUFBQTtBQUNoQixJQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxJQUFjLENBQUE7QUFDZCxJQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxJQUFhLENBQUE7QUFDYixJQUFBLE1BQUEsQ0FBQSxhQUFBLENBQUEsR0FBQSxLQUFtQixDQUFBO0FBQ25CLElBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLElBQWEsQ0FBQTtBQUNiLElBQUEsTUFBQSxDQUFBLGFBQUEsQ0FBQSxHQUFBLEtBQW1CLENBQUE7QUFDbkIsSUFBQSxNQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsS0FBZ0IsQ0FBQTtBQUNoQixJQUFBLE1BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxJQUFZLENBQUE7QUFDWixJQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxLQUFjLENBQUE7QUFDZCxJQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxJQUFhLENBQUE7QUFDYixJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsR0FBQSxLQUFvQixDQUFBO0FBQ3BCLElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxHQUFBLEtBQW9CLENBQUE7QUFDcEIsSUFBQSxNQUFBLENBQUEsYUFBQSxDQUFBLEdBQUEsS0FBbUIsQ0FBQTtBQUNuQixJQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxNQUFhLENBQUE7QUFFYixJQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxFQUFTLENBQUE7QUFDWCxDQUFDLEVBaEJXQSxjQUFNLEtBQU5BLGNBQU0sR0FnQmpCLEVBQUEsQ0FBQSxDQUFBLENBQUE7QUFFV0Msd0JBVVg7QUFWRCxDQUFBLFVBQVksTUFBTSxFQUFBO0FBQ2hCLElBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEVBQVMsQ0FBQTtBQUNULElBQUEsTUFBQSxDQUFBLFlBQUEsQ0FBQSxHQUFBLEdBQWdCLENBQUE7QUFDaEIsSUFBQSxNQUFBLENBQUEsWUFBQSxDQUFBLEdBQUEsR0FBZ0IsQ0FBQTtBQUNoQixJQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxHQUFZLENBQUE7QUFDWixJQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxHQUFZLENBQUE7QUFDWixJQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxLQUFnQixDQUFBO0FBQ2hCLElBQUEsTUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLElBQVksQ0FBQTtBQUNaLElBQUEsTUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLElBQVksQ0FBQTtBQUNaLElBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEdBQVUsQ0FBQTtBQUNaLENBQUMsRUFWV0EsY0FBTSxLQUFOQSxjQUFNLEdBVWpCLEVBQUEsQ0FBQSxDQUFBLENBQUE7QUFFV0MsbUNBSVg7QUFKRCxDQUFBLFVBQVksaUJBQWlCLEVBQUE7QUFDM0IsSUFBQSxpQkFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQVcsQ0FBQTtBQUNYLElBQUEsaUJBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxHQUFXLENBQUE7QUFDWCxJQUFBLGlCQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsR0FBYSxDQUFBO0FBQ2YsQ0FBQyxFQUpXQSx5QkFBaUIsS0FBakJBLHlCQUFpQixHQUk1QixFQUFBLENBQUEsQ0FBQSxDQUFBO0FBRVdDLHVDQUlYO0FBSkQsQ0FBQSxVQUFZLHFCQUFxQixFQUFBO0FBQy9CLElBQUEscUJBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxNQUFhLENBQUE7QUFDYixJQUFBLHFCQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsS0FBVyxDQUFBO0FBQ1gsSUFBQSxxQkFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLE1BQWEsQ0FBQTtBQUNmLENBQUMsRUFKV0EsNkJBQXFCLEtBQXJCQSw2QkFBcUIsR0FJaEMsRUFBQSxDQUFBLENBQUE7OztBQ2hORCxJQUFNLFFBQVEsR0FBRyxFQUFDLEdBQUcsRUFBRSxzQkFBc0IsRUFBQyxDQUFDO0FBRXhDLElBQU0sY0FBYyxHQUFHLEdBQUc7QUFDMUIsSUFBTSxrQkFBa0IsR0FBRyxHQUFHO0FBQ3hCLElBQUEsVUFBVSxHQUFHO0lBQ3hCLEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7RUFDSDtBQUNXLElBQUEsaUJBQWlCLEdBQUc7SUFDL0IsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztFQUNIO0FBQ1csSUFBQSxVQUFVLEdBQUc7QUFDeEIsSUFBQSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0VBQ2pFO0FBQ1csSUFBQSxXQUFXLEdBQUc7SUFDekIsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztFQUNIO0FBQ0Y7QUFDTyxJQUFNLFFBQVEsR0FBRyxFQUFFO0FBQ25CLElBQU0sUUFBUSxHQUFHLEVBQUU7QUFDbkIsSUFBTSxRQUFRLEdBQUcsRUFBRTtBQUNuQixJQUFNLGFBQWEsR0FBRyxJQUFJO0FBRXBCLElBQUEsZUFBZSxHQUFHO0FBQzdCLElBQUEsU0FBUyxFQUFFLEVBQUU7QUFDYixJQUFBLE9BQU8sRUFBRSxFQUFFO0FBQ1gsSUFBQSxNQUFNLEVBQUUsQ0FBQztBQUNULElBQUEsV0FBVyxFQUFFLEtBQUs7QUFDbEIsSUFBQSxVQUFVLEVBQUUsSUFBSTtJQUNoQixLQUFLLEVBQUVOLGFBQUssQ0FBQyxJQUFJO0FBQ2pCLElBQUEsVUFBVSxFQUFFLEtBQUs7QUFDakIsSUFBQSxJQUFJLEVBQUUsS0FBSztBQUNYLElBQUEsWUFBWSxFQUFFLEtBQUs7RUFDbkI7SUFFVyxlQUFlLElBQUEsRUFBQSxHQUFBLEVBQUE7SUFHMUIsRUFBQyxDQUFBQSxhQUFLLENBQUMsYUFBYSxDQUFHLEdBQUE7QUFDckIsUUFBQSxNQUFNLEVBQUUsRUFBRTtBQUNWLFFBQUEsTUFBTSxFQUFFLEVBQUU7QUFDWCxLQUFBO0lBQ0QsRUFBQyxDQUFBQSxhQUFLLENBQUMsT0FBTyxDQUFHLEdBQUE7QUFDZixRQUFBLEtBQUssRUFBRSxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQWlDLGlDQUFBLENBQUE7QUFDdkQsUUFBQSxNQUFNLEVBQUUsQ0FBQyxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsQ0FBQyxHQUFHLG9DQUFpQyxDQUFDO0FBQzFELFFBQUEsTUFBTSxFQUFFLENBQUMsRUFBQSxDQUFBLE1BQUEsQ0FBRyxRQUFRLENBQUMsR0FBRyxvQ0FBaUMsQ0FBQztBQUMzRCxLQUFBO0lBQ0QsRUFBQyxDQUFBQSxhQUFLLENBQUMsVUFBVSxDQUFHLEdBQUE7QUFDbEIsUUFBQSxLQUFLLEVBQUUsRUFBQSxDQUFBLE1BQUEsQ0FBRyxRQUFRLENBQUMsR0FBRyxFQUFxQyxxQ0FBQSxDQUFBO0FBQzNELFFBQUEsTUFBTSxFQUFFLENBQUMsRUFBQSxDQUFBLE1BQUEsQ0FBRyxRQUFRLENBQUMsR0FBRyx3Q0FBcUMsQ0FBQztBQUM5RCxRQUFBLE1BQU0sRUFBRTtZQUNOLEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxDQUFDLEdBQUcsRUFBc0Msc0NBQUEsQ0FBQTtZQUNyRCxFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQXNDLHNDQUFBLENBQUE7WUFDckQsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLENBQUMsR0FBRyxFQUFzQyxzQ0FBQSxDQUFBO1lBQ3JELEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxDQUFDLEdBQUcsRUFBc0Msc0NBQUEsQ0FBQTtZQUNyRCxFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQXNDLHNDQUFBLENBQUE7QUFDdEQsU0FBQTtBQUNGLEtBQUE7SUFDRCxFQUFDLENBQUFBLGFBQUssQ0FBQyxhQUFhLENBQUcsR0FBQTtBQUNyQixRQUFBLEtBQUssRUFBRSxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQXlDLHlDQUFBLENBQUE7QUFDL0QsUUFBQSxNQUFNLEVBQUU7WUFDTixFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQTBDLDBDQUFBLENBQUE7WUFDekQsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLENBQUMsR0FBRyxFQUEwQywwQ0FBQSxDQUFBO1lBQ3pELEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxDQUFDLEdBQUcsRUFBMEMsMENBQUEsQ0FBQTtZQUN6RCxFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQTBDLDBDQUFBLENBQUE7WUFDekQsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLENBQUMsR0FBRyxFQUEwQywwQ0FBQSxDQUFBO0FBQzFELFNBQUE7QUFDRCxRQUFBLE1BQU0sRUFBRTtZQUNOLEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxDQUFDLEdBQUcsRUFBMEMsMENBQUEsQ0FBQTtZQUN6RCxFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQTBDLDBDQUFBLENBQUE7WUFDekQsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLENBQUMsR0FBRyxFQUEwQywwQ0FBQSxDQUFBO1lBQ3pELEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxDQUFDLEdBQUcsRUFBMEMsMENBQUEsQ0FBQTtZQUN6RCxFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQTBDLDBDQUFBLENBQUE7QUFDMUQsU0FBQTtBQUNGLEtBQUE7SUFDRCxFQUFDLENBQUFBLGFBQUssQ0FBQyxNQUFNLENBQUcsR0FBQTtBQUNkLFFBQUEsS0FBSyxFQUFFLEVBQUEsQ0FBQSxNQUFBLENBQUcsUUFBUSxDQUFDLEdBQUcsRUFBZ0MsZ0NBQUEsQ0FBQTtBQUN0RCxRQUFBLE1BQU0sRUFBRSxDQUFDLEVBQUEsQ0FBQSxNQUFBLENBQUcsUUFBUSxDQUFDLEdBQUcsbUNBQWdDLENBQUM7QUFDekQsUUFBQSxNQUFNLEVBQUUsQ0FBQyxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsQ0FBQyxHQUFHLG1DQUFnQyxDQUFDO0FBQzFELEtBQUE7SUFDRCxFQUFDLENBQUFBLGFBQUssQ0FBQyxjQUFjLENBQUcsR0FBQTtBQUN0QixRQUFBLEtBQUssRUFBRSxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQXdDLHdDQUFBLENBQUE7QUFDOUQsUUFBQSxNQUFNLEVBQUUsQ0FBQyxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsQ0FBQyxHQUFHLDJDQUF3QyxDQUFDO0FBQ2pFLFFBQUEsTUFBTSxFQUFFLENBQUMsRUFBQSxDQUFBLE1BQUEsQ0FBRyxRQUFRLENBQUMsR0FBRywyQ0FBd0MsQ0FBQztBQUNsRSxLQUFBO0lBQ0QsRUFBQyxDQUFBQSxhQUFLLENBQUMsSUFBSSxDQUFHLEdBQUE7QUFDWixRQUFBLE1BQU0sRUFBRSxFQUFFO0FBQ1YsUUFBQSxNQUFNLEVBQUUsRUFBRTtBQUNYLEtBQUE7UUFDRDtBQUVLLElBQU0sZUFBZSxHQUFHLHdCQUF3QjtBQUNoRCxJQUFNLGdCQUFnQixHQUFHLHdCQUF3QjtBQUNqRCxJQUFNLFVBQVUsR0FBRyx3QkFBd0I7QUFDM0MsSUFBTSxhQUFhLEdBQUc7O0FDdEpoQixJQUFBLGNBQWMsR0FBRztJQUM1QixHQUFHOzs7SUFHSCxJQUFJO0lBQ0osR0FBRztFQUNIO0FBQ1csSUFBQSxlQUFlLEdBQUc7SUFDN0IsSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJOzs7RUFHSjtBQUNXLElBQUEseUJBQXlCLEdBQUc7SUFDdkMsR0FBRztJQUNILEdBQUc7SUFDSCxJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osR0FBRztJQUNILElBQUk7SUFDSixHQUFHO0VBQ0g7QUFDVyxJQUFBLHlCQUF5QixHQUFHO0lBQ3ZDLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTs7O0VBR0o7QUFDVyxJQUFBLGdCQUFnQixHQUFHO0lBQzlCLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0VBQ0o7QUFFVyxJQUFBLGNBQWMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3RELElBQUEsbUJBQW1CLEdBQUc7O0lBRWpDLElBQUk7O0lBRUosSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtFQUNKO0FBQ0ssSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtBQUM1QyxJQUFBLHVCQUF1QixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7QUFFbkQsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUUvQyxJQUFBLG1CQUFtQixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBRTlFLElBQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFFekQsSUFBQSxXQUFBLGtCQUFBLFlBQUE7SUFNRSxTQUFZLFdBQUEsQ0FBQSxLQUFhLEVBQUUsS0FBd0IsRUFBQTtRQUo1QyxJQUFJLENBQUEsSUFBQSxHQUFXLEdBQUcsQ0FBQztRQUNoQixJQUFNLENBQUEsTUFBQSxHQUFXLEVBQUUsQ0FBQztRQUNwQixJQUFPLENBQUEsT0FBQSxHQUFhLEVBQUUsQ0FBQztBQUcvQixRQUFBLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssWUFBWSxNQUFNLEVBQUU7QUFDeEQsWUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQWUsQ0FBQztTQUM5QjtBQUFNLGFBQUEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQy9CLFlBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDckI7S0FDRjtBQUVELElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBSSxXQUFLLENBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQTtBQUFULFFBQUEsR0FBQSxFQUFBLFlBQUE7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDcEI7QUFFRCxRQUFBLEdBQUEsRUFBQSxVQUFVLFFBQWdCLEVBQUE7QUFDeEIsWUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztZQUN2QixJQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNwQztpQkFBTTtBQUNMLGdCQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUMzQjtTQUNGOzs7QUFUQSxLQUFBLENBQUEsQ0FBQTtBQVdELElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBSSxXQUFNLENBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQTtBQUFWLFFBQUEsR0FBQSxFQUFBLFlBQUE7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7QUFFRCxRQUFBLEdBQUEsRUFBQSxVQUFXLFNBQW1CLEVBQUE7QUFDNUIsWUFBQSxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkM7OztBQUxBLEtBQUEsQ0FBQSxDQUFBO0FBT0QsSUFBQSxXQUFBLENBQUEsU0FBQSxDQUFBLFFBQVEsR0FBUixZQUFBO1FBQ0UsT0FBTyxFQUFBLENBQUEsTUFBQSxDQUFHLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQSxNQUFBLENBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLEVBQUksRUFBQSxPQUFBLEdBQUksQ0FBQSxNQUFBLENBQUEsQ0FBQyxFQUFHLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO0tBQ25FLENBQUE7SUFDSCxPQUFDLFdBQUEsQ0FBQTtBQUFELENBQUMsRUFBQSxFQUFBO0FBRUQsSUFBQSxRQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQThCTyxlQUFXLENBQUEsUUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0lBQ3ZDLFNBQVksUUFBQSxDQUFBLEtBQWEsRUFBRSxLQUFhLEVBQUE7QUFDdEMsUUFBQSxJQUFBLEtBQUEsR0FBQSxNQUFLLENBQUMsSUFBQSxDQUFBLElBQUEsRUFBQSxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUMsSUFBQSxDQUFBO0FBQ3BCLFFBQUEsS0FBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7O0tBQ3BCO0lBRU0sUUFBSSxDQUFBLElBQUEsR0FBWCxVQUFZLEdBQVcsRUFBQTtRQUNyQixJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDbEQsSUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFBLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixZQUFBLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixZQUFBLE9BQU8sSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ2pDO0FBQ0QsUUFBQSxPQUFPLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM3QixDQUFBO0FBR0QsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFJLFFBQUssQ0FBQSxTQUFBLEVBQUEsT0FBQSxFQUFBOztBQUFULFFBQUEsR0FBQSxFQUFBLFlBQUE7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDcEI7QUFFRCxRQUFBLEdBQUEsRUFBQSxVQUFVLFFBQWdCLEVBQUE7QUFDeEIsWUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztZQUN2QixJQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNwQztpQkFBTTtBQUNMLGdCQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUMzQjtTQUNGOzs7QUFUQSxLQUFBLENBQUEsQ0FBQTtBQVdELElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBSSxRQUFNLENBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQTtBQUFWLFFBQUEsR0FBQSxFQUFBLFlBQUE7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7QUFFRCxRQUFBLEdBQUEsRUFBQSxVQUFXLFNBQW1CLEVBQUE7QUFDNUIsWUFBQSxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkM7OztBQUxBLEtBQUEsQ0FBQSxDQUFBO0lBTUgsT0FBQyxRQUFBLENBQUE7QUFBRCxDQXRDQSxDQUE4QixXQUFXLENBc0N4QyxFQUFBO0FBRUQsSUFBQSxTQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQStCQSxlQUFXLENBQUEsU0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0lBQ3hDLFNBQVksU0FBQSxDQUFBLEtBQWEsRUFBRSxLQUF3QixFQUFBO0FBQ2pELFFBQUEsSUFBQSxLQUFBLEdBQUEsTUFBSyxDQUFDLElBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFDLElBQUEsQ0FBQTtBQUNwQixRQUFBLEtBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDOztLQUNyQjtJQUVNLFNBQUksQ0FBQSxJQUFBLEdBQVgsVUFBWSxHQUFXLEVBQUE7UUFDckIsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFbkQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBQSxJQUFNLElBQUksR0FBR0MsbUJBQUEsQ0FBQSxFQUFBLEVBQUFDLFlBQUEsQ0FBSSxVQUFVLENBQUUsRUFBQSxLQUFBLENBQUEsQ0FBQSxHQUFHLENBQUMsVUFBQSxDQUFDLEVBQUksRUFBQSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBSixFQUFJLENBQUMsQ0FBQztBQUM1QyxRQUFBLElBQUksVUFBVTtBQUFFLFlBQUEsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxRQUFBLE9BQU8sSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ25DLENBQUE7QUFHRCxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUksU0FBSyxDQUFBLFNBQUEsRUFBQSxPQUFBLEVBQUE7O0FBQVQsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVUsUUFBZ0IsRUFBQTtBQUN4QixZQUFBLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3ZCLElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNO0FBQ0wsZ0JBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7OztBQVRBLEtBQUEsQ0FBQSxDQUFBO0FBV0QsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFJLFNBQU0sQ0FBQSxTQUFBLEVBQUEsUUFBQSxFQUFBO0FBQVYsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVcsU0FBbUIsRUFBQTtBQUM1QixZQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQzs7O0FBTEEsS0FBQSxDQUFBLENBQUE7SUFNSCxPQUFDLFNBQUEsQ0FBQTtBQUFELENBdENBLENBQStCLFdBQVcsQ0FzQ3pDLEVBQUE7QUFFRCxJQUFBLGtCQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQXdDRixlQUFXLENBQUEsa0JBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtJQUNqRCxTQUFZLGtCQUFBLENBQUEsS0FBYSxFQUFFLEtBQWEsRUFBQTtBQUN0QyxRQUFBLElBQUEsS0FBQSxHQUFBLE1BQUssQ0FBQyxJQUFBLENBQUEsSUFBQSxFQUFBLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBQyxJQUFBLENBQUE7QUFDcEIsUUFBQSxLQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDOztLQUMvQjtJQUNNLGtCQUFJLENBQUEsSUFBQSxHQUFYLFVBQVksR0FBVyxFQUFBO1FBQ3JCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNsRCxJQUFJLEtBQUssRUFBRTtBQUNULFlBQUEsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFlBQUEsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLFlBQUEsT0FBTyxJQUFJLGtCQUFrQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUMzQztBQUNELFFBQUEsT0FBTyxJQUFJLGtCQUFrQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUN2QyxDQUFBO0FBR0QsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFJLGtCQUFLLENBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQTs7QUFBVCxRQUFBLEdBQUEsRUFBQSxZQUFBO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3BCO0FBRUQsUUFBQSxHQUFBLEVBQUEsVUFBVSxRQUFnQixFQUFBO0FBQ3hCLFlBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7WUFDdkIsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEM7aUJBQU07QUFDTCxnQkFBQSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDM0I7U0FDRjs7O0FBVEEsS0FBQSxDQUFBLENBQUE7QUFXRCxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUksa0JBQU0sQ0FBQSxTQUFBLEVBQUEsUUFBQSxFQUFBO0FBQVYsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVcsU0FBbUIsRUFBQTtBQUM1QixZQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQzs7O0FBTEEsS0FBQSxDQUFBLENBQUE7SUFNSCxPQUFDLGtCQUFBLENBQUE7QUFBRCxDQXJDQSxDQUF3QyxXQUFXLENBcUNsRCxFQUFBO0FBRUQsSUFBQSxrQkFBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUF3Q0EsZUFBVyxDQUFBLGtCQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7SUFDakQsU0FBWSxrQkFBQSxDQUFBLEtBQWEsRUFBRSxLQUFhLEVBQUE7QUFDdEMsUUFBQSxJQUFBLEtBQUEsR0FBQSxNQUFLLENBQUMsSUFBQSxDQUFBLElBQUEsRUFBQSxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUMsSUFBQSxDQUFBO0FBQ3BCLFFBQUEsS0FBSSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQzs7S0FDL0I7SUFDTSxrQkFBSSxDQUFBLElBQUEsR0FBWCxVQUFZLEdBQVcsRUFBQTtRQUNyQixJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDbEQsSUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFBLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixZQUFBLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixZQUFBLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDM0M7QUFDRCxRQUFBLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDdkMsQ0FBQTtBQUdELElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBSSxrQkFBSyxDQUFBLFNBQUEsRUFBQSxPQUFBLEVBQUE7O0FBQVQsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVUsUUFBZ0IsRUFBQTtBQUN4QixZQUFBLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3ZCLElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNO0FBQ0wsZ0JBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7OztBQVRBLEtBQUEsQ0FBQSxDQUFBO0FBV0QsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFJLGtCQUFNLENBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQTtBQUFWLFFBQUEsR0FBQSxFQUFBLFlBQUE7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7QUFFRCxRQUFBLEdBQUEsRUFBQSxVQUFXLFNBQW1CLEVBQUE7QUFDNUIsWUFBQSxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkM7OztBQUxBLEtBQUEsQ0FBQSxDQUFBO0lBTUgsT0FBQyxrQkFBQSxDQUFBO0FBQUQsQ0FyQ0EsQ0FBd0MsV0FBVyxDQXFDbEQsRUFBQTtBQUVELElBQUEsY0FBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFvQ0EsZUFBVyxDQUFBLGNBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUEvQyxJQUFBLFNBQUEsY0FBQSxHQUFBOztLQUFrRDtJQUFELE9BQUMsY0FBQSxDQUFBO0FBQUQsQ0FBakQsQ0FBb0MsV0FBVyxDQUFHLEVBQUE7QUFDbEQsSUFBQSxVQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQWdDQSxlQUFXLENBQUEsVUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0lBQ3pDLFNBQVksVUFBQSxDQUFBLEtBQWEsRUFBRSxLQUF3QixFQUFBO0FBQ2pELFFBQUEsSUFBQSxLQUFBLEdBQUEsTUFBSyxDQUFDLElBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFDLElBQUEsQ0FBQTtBQUNwQixRQUFBLEtBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDOztLQUN0QjtJQUNNLFVBQUksQ0FBQSxJQUFBLEdBQVgsVUFBWSxHQUFXLEVBQUE7UUFDckIsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFbkQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBQSxJQUFNLElBQUksR0FBR0MsbUJBQUEsQ0FBQSxFQUFBLEVBQUFDLFlBQUEsQ0FBSSxVQUFVLENBQUUsRUFBQSxLQUFBLENBQUEsQ0FBQSxHQUFHLENBQUMsVUFBQSxDQUFDLEVBQUksRUFBQSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBSixFQUFJLENBQUMsQ0FBQztBQUM1QyxRQUFBLElBQUksVUFBVTtBQUFFLFlBQUEsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxRQUFBLE9BQU8sSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3BDLENBQUE7QUFHRCxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUksVUFBSyxDQUFBLFNBQUEsRUFBQSxPQUFBLEVBQUE7O0FBQVQsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVUsUUFBZ0IsRUFBQTtBQUN4QixZQUFBLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3ZCLElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNO0FBQ0wsZ0JBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7OztBQVRBLEtBQUEsQ0FBQSxDQUFBO0FBV0QsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFJLFVBQU0sQ0FBQSxTQUFBLEVBQUEsUUFBQSxFQUFBO0FBQVYsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVcsU0FBbUIsRUFBQTtBQUM1QixZQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQzs7O0FBTEEsS0FBQSxDQUFBLENBQUE7SUFNSCxPQUFDLFVBQUEsQ0FBQTtBQUFELENBckNBLENBQWdDLFdBQVcsQ0FxQzFDLEVBQUE7QUFFRCxJQUFBLFFBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBOEJGLGVBQVcsQ0FBQSxRQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7SUFDdkMsU0FBWSxRQUFBLENBQUEsS0FBYSxFQUFFLEtBQWEsRUFBQTtBQUN0QyxRQUFBLElBQUEsS0FBQSxHQUFBLE1BQUssQ0FBQyxJQUFBLENBQUEsSUFBQSxFQUFBLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBQyxJQUFBLENBQUE7QUFDcEIsUUFBQSxLQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQzs7S0FDcEI7SUFDTSxRQUFJLENBQUEsSUFBQSxHQUFYLFVBQVksR0FBVyxFQUFBO1FBQ3JCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNsRCxJQUFJLEtBQUssRUFBRTtBQUNULFlBQUEsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFlBQUEsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLFlBQUEsT0FBTyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDakM7QUFDRCxRQUFBLE9BQU8sSUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzdCLENBQUE7QUFHRCxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUksUUFBSyxDQUFBLFNBQUEsRUFBQSxPQUFBLEVBQUE7O0FBQVQsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVUsUUFBZ0IsRUFBQTtBQUN4QixZQUFBLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3ZCLElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNO0FBQ0wsZ0JBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7OztBQVRBLEtBQUEsQ0FBQSxDQUFBO0FBV0QsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFJLFFBQU0sQ0FBQSxTQUFBLEVBQUEsUUFBQSxFQUFBO0FBQVYsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVcsU0FBbUIsRUFBQTtBQUM1QixZQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQzs7O0FBTEEsS0FBQSxDQUFBLENBQUE7SUFNSCxPQUFDLFFBQUEsQ0FBQTtBQUFELENBckNBLENBQThCLFdBQVcsQ0FxQ3hDLEVBQUE7QUFFRCxJQUFBLFlBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBa0NBLGVBQVcsQ0FBQSxZQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7SUFDM0MsU0FBWSxZQUFBLENBQUEsS0FBYSxFQUFFLEtBQWEsRUFBQTtBQUN0QyxRQUFBLElBQUEsS0FBQSxHQUFBLE1BQUssQ0FBQyxJQUFBLENBQUEsSUFBQSxFQUFBLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBQyxJQUFBLENBQUE7QUFDcEIsUUFBQSxLQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQzs7S0FDekI7SUFDTSxZQUFJLENBQUEsSUFBQSxHQUFYLFVBQVksR0FBVyxFQUFBO1FBQ3JCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNsRCxJQUFJLEtBQUssRUFBRTtBQUNULFlBQUEsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFlBQUEsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLFlBQUEsT0FBTyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDckM7QUFDRCxRQUFBLE9BQU8sSUFBSSxZQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2pDLENBQUE7QUFFRCxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUksWUFBSyxDQUFBLFNBQUEsRUFBQSxPQUFBLEVBQUE7QUFBVCxRQUFBLEdBQUEsRUFBQSxZQUFBO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3BCO0FBRUQsUUFBQSxHQUFBLEVBQUEsVUFBVSxRQUFnQixFQUFBO0FBQ3hCLFlBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7WUFDdkIsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEM7aUJBQU07QUFDTCxnQkFBQSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDM0I7U0FDRjs7O0FBVEEsS0FBQSxDQUFBLENBQUE7QUFXRCxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUksWUFBTSxDQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUE7QUFBVixRQUFBLEdBQUEsRUFBQSxZQUFBO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JCO0FBRUQsUUFBQSxHQUFBLEVBQUEsVUFBVyxTQUFtQixFQUFBO0FBQzVCLFlBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25DOzs7QUFMQSxLQUFBLENBQUEsQ0FBQTtJQU1ILE9BQUMsWUFBQSxDQUFBO0FBQUQsQ0FwQ0EsQ0FBa0MsV0FBVyxDQW9DNUMsRUFBQTtBQUVELElBQUEsVUFBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFnQ0EsZUFBVyxDQUFBLFVBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtJQUN6QyxTQUFZLFVBQUEsQ0FBQSxLQUFhLEVBQUUsS0FBYSxFQUFBO0FBQ3RDLFFBQUEsSUFBQSxLQUFBLEdBQUEsTUFBSyxDQUFDLElBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFDLElBQUEsQ0FBQTtBQUNwQixRQUFBLEtBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDOztLQUN0QjtJQUNNLFVBQUksQ0FBQSxJQUFBLEdBQVgsVUFBWSxHQUFXLEVBQUE7UUFDckIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ2xELElBQUksS0FBSyxFQUFFO0FBQ1QsWUFBQSxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsWUFBQSxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsWUFBQSxPQUFPLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNuQztBQUNELFFBQUEsT0FBTyxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDL0IsQ0FBQTtBQUVELElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBSSxVQUFLLENBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQTtBQUFULFFBQUEsR0FBQSxFQUFBLFlBQUE7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDcEI7QUFFRCxRQUFBLEdBQUEsRUFBQSxVQUFVLFFBQWdCLEVBQUE7QUFDeEIsWUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztZQUN2QixJQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNwQztpQkFBTTtBQUNMLGdCQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUMzQjtTQUNGOzs7QUFUQSxLQUFBLENBQUEsQ0FBQTtBQVdELElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBSSxVQUFNLENBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQTtBQUFWLFFBQUEsR0FBQSxFQUFBLFlBQUE7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7QUFFRCxRQUFBLEdBQUEsRUFBQSxVQUFXLFNBQW1CLEVBQUE7QUFDNUIsWUFBQSxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkM7OztBQUxBLEtBQUEsQ0FBQSxDQUFBO0lBTUgsT0FBQyxVQUFBLENBQUE7QUFBRCxDQXBDQSxDQUFnQyxXQUFXLENBb0MxQyxFQUFBO0FBRUQsSUFBQSxVQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQWdDQSxlQUFXLENBQUEsVUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0lBQ3pDLFNBQVksVUFBQSxDQUFBLEtBQWEsRUFBRSxLQUFhLEVBQUE7QUFDdEMsUUFBQSxJQUFBLEtBQUEsR0FBQSxNQUFLLENBQUMsSUFBQSxDQUFBLElBQUEsRUFBQSxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUMsSUFBQSxDQUFBO0FBQ3BCLFFBQUEsS0FBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7O0tBQ3RCO0FBRUQsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFJLFVBQUssQ0FBQSxTQUFBLEVBQUEsT0FBQSxFQUFBO0FBQVQsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVUsUUFBZ0IsRUFBQTtBQUN4QixZQUFBLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3ZCLElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNO0FBQ0wsZ0JBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7OztBQVRBLEtBQUEsQ0FBQSxDQUFBO0FBV0QsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFJLFVBQU0sQ0FBQSxTQUFBLEVBQUEsUUFBQSxFQUFBO0FBQVYsUUFBQSxHQUFBLEVBQUEsWUFBQTtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQjtBQUVELFFBQUEsR0FBQSxFQUFBLFVBQVcsU0FBbUIsRUFBQTtBQUM1QixZQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQzs7O0FBTEEsS0FBQSxDQUFBLENBQUE7SUFNSCxPQUFDLFVBQUEsQ0FBQTtBQUFELENBM0JBLENBQWdDLFdBQVcsQ0EyQjFDLEVBQUE7QUFFRCxJQUFBLGlCQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQXVDQSxlQUFXLENBQUEsaUJBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUFsRCxJQUFBLFNBQUEsaUJBQUEsR0FBQTs7S0FBcUQ7SUFBRCxPQUFDLGlCQUFBLENBQUE7QUFBRCxDQUFwRCxDQUF1QyxXQUFXLENBQUc7O0FDN2NyRCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsSUFBSSxhQUFhLEdBQWEsRUFBRSxDQUFDO0FBRWpDOzs7O0FBSUc7QUFDSCxJQUFNLFFBQVEsR0FBRyxVQUFDLEdBQWUsRUFBQTtBQUMvQixJQUFBLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDdkQsSUFBQSxPQUFPLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ2pDLENBQUMsQ0FBQztBQUVGOzs7Ozs7QUFNRztBQUNILElBQU0sZUFBZSxHQUFHLFVBQUMsR0FBZSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBVSxFQUFBO0FBQ3hFLElBQUEsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNsRCxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUcsQ0FBQSxNQUFBLENBQUEsQ0FBQyxjQUFJLENBQUMsQ0FBRSxDQUFDLEVBQUU7WUFDNUQsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFBLENBQUEsTUFBQSxDQUFHLENBQUMsRUFBSSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQyxDQUFFLENBQUMsQ0FBQztZQUNoQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbkMsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNuQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3BDO2FBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLFNBQVMsSUFBSSxDQUFDLENBQUM7U0FDaEI7S0FDRjtBQUNILENBQUMsQ0FBQztBQUVGLElBQU0sV0FBVyxHQUFHLFVBQUMsR0FBZSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBVSxFQUFBO0FBQ3BFLElBQUEsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDZCxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBRW5CLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3hELE9BQU87QUFDTCxZQUFBLE9BQU8sRUFBRSxDQUFDO0FBQ1YsWUFBQSxhQUFhLEVBQUUsRUFBRTtTQUNsQixDQUFDO0tBQ0g7SUFFRCxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbkIsT0FBTztBQUNMLFlBQUEsT0FBTyxFQUFFLENBQUM7QUFDVixZQUFBLGFBQWEsRUFBRSxFQUFFO1NBQ2xCLENBQUM7S0FDSDtJQUNELGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQixPQUFPO0FBQ0wsUUFBQSxPQUFPLEVBQUUsU0FBUztBQUNsQixRQUFBLGFBQWEsRUFBQSxhQUFBO0tBQ2QsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVXLElBQUEsV0FBVyxHQUFHLFVBQ3pCLEdBQWUsRUFDZixDQUFTLEVBQ1QsQ0FBUyxFQUNULEVBQVUsRUFBQTtJQUVWLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUNmLElBQUEsSUFBQSxLQUF1RCxXQUFXLENBQ3RFLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxHQUFHLENBQUMsRUFDTCxFQUFFLENBQ0gsRUFMZSxTQUFTLGFBQUEsRUFBaUIsZUFBZSxtQkFLeEQsQ0FBQztBQUNJLElBQUEsSUFBQSxLQUEyRCxXQUFXLENBQzFFLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxHQUFHLENBQUMsRUFDTCxFQUFFLENBQ0gsRUFMZSxXQUFXLGFBQUEsRUFBaUIsaUJBQWlCLG1CQUs1RCxDQUFDO0FBQ0ksSUFBQSxJQUFBLEtBQTJELFdBQVcsQ0FDMUUsR0FBRyxFQUNILENBQUMsR0FBRyxDQUFDLEVBQ0wsQ0FBQyxFQUNELEVBQUUsQ0FDSCxFQUxlLFdBQVcsYUFBQSxFQUFpQixpQkFBaUIsbUJBSzVELENBQUM7QUFDSSxJQUFBLElBQUEsS0FDSixXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQURoQixZQUFZLGFBQUEsRUFBaUIsa0JBQWtCLG1CQUMvQixDQUFDO0FBQ2pDLElBQUEsSUFBSSxTQUFTLEtBQUssQ0FBQyxFQUFFO0FBQ25CLFFBQUEsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBQTtZQUMxQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkQsU0FBQyxDQUFDLENBQUM7S0FDSjtBQUNELElBQUEsSUFBSSxXQUFXLEtBQUssQ0FBQyxFQUFFO0FBQ3JCLFFBQUEsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFBO1lBQzVCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2RCxTQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0QsSUFBQSxJQUFJLFdBQVcsS0FBSyxDQUFDLEVBQUU7QUFDckIsUUFBQSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUE7WUFDNUIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QixRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZELFNBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFDRCxJQUFBLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtBQUN0QixRQUFBLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBQTtZQUM3QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkQsU0FBQyxDQUFDLENBQUM7S0FDSjtBQUNELElBQUEsT0FBTyxRQUFRLENBQUM7QUFDbEIsRUFBRTtBQUVGLElBQU0sVUFBVSxHQUFHLFVBQUMsR0FBZSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBVSxFQUFBO0FBQzdELElBQUEsSUFBQSxLQUF1RCxXQUFXLENBQ3RFLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxHQUFHLENBQUMsRUFDTCxFQUFFLENBQ0gsRUFMZSxTQUFTLGFBQUEsRUFBaUIsZUFBZSxtQkFLeEQsQ0FBQztBQUNJLElBQUEsSUFBQSxLQUEyRCxXQUFXLENBQzFFLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxHQUFHLENBQUMsRUFDTCxFQUFFLENBQ0gsRUFMZSxXQUFXLGFBQUEsRUFBaUIsaUJBQWlCLG1CQUs1RCxDQUFDO0FBQ0ksSUFBQSxJQUFBLEtBQTJELFdBQVcsQ0FDMUUsR0FBRyxFQUNILENBQUMsR0FBRyxDQUFDLEVBQ0wsQ0FBQyxFQUNELEVBQUUsQ0FDSCxFQUxlLFdBQVcsYUFBQSxFQUFpQixpQkFBaUIsbUJBSzVELENBQUM7QUFDSSxJQUFBLElBQUEsS0FDSixXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQURoQixZQUFZLGFBQUEsRUFBaUIsa0JBQWtCLG1CQUMvQixDQUFDO0lBQ2pDLElBQUksU0FBUyxLQUFLLENBQUMsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNqRCxRQUFBLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFJLFdBQVcsS0FBSyxDQUFDLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyRCxRQUFBLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFJLFdBQVcsS0FBSyxDQUFDLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyRCxRQUFBLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFJLFlBQVksS0FBSyxDQUFDLElBQUksa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN2RCxRQUFBLE9BQU8sSUFBSSxDQUFDO0tBQ2I7QUFDRCxJQUFBLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRVcsSUFBQSxPQUFPLEdBQUcsVUFBQyxHQUFlLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxFQUFVLEVBQUE7QUFDdkUsSUFBQSxJQUFNLFFBQVEsR0FBR0csZ0JBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxJQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUFFLFFBQUEsT0FBTyxLQUFLLENBQUM7SUFDakMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ25CLFFBQUEsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDYixJQUFBLElBQUEsT0FBTyxHQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBbkMsQ0FBb0M7QUFDbEQsSUFBQSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLFFBQUEsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ2xDLFFBQUEsT0FBTyxLQUFLLENBQUM7S0FDZDtBQUNELElBQUEsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQ2pCLFFBQUEsT0FBTyxLQUFLLENBQUM7S0FDZDtBQUNELElBQUEsT0FBTyxJQUFJLENBQUM7QUFDZDs7QUN6S3dCLElBQUksU0FBUyxHQUFHO1NBRXhCLGlCQUFpQixDQUMvQixHQUFXLEVBQ1gsQ0FBUyxFQUNULEtBQXlCLEVBQUE7QUFBekIsSUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVMsR0FBQSxDQUFBLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUEsRUFBQTtBQUV6QixJQUFBLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUE7QUFDeEIsUUFBQSxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDO0FBQUUsWUFBQSxPQUFPLEtBQUssQ0FBQztBQUVqQyxRQUFBLElBQU0sVUFBVSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pDLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTlDLElBQUksUUFBUSxLQUFLLENBQUMsQ0FBQztBQUFFLFlBQUEsT0FBTyxLQUFLLENBQUM7QUFFbEMsUUFBQSxPQUFPLENBQUMsSUFBSSxVQUFVLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQztBQUMxQyxLQUFDLENBQUMsQ0FBQztBQUVILElBQUEsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCOztBQ0dBOztBQUVHO0FBQ0gsSUFBQSxHQUFBLGtCQUFBLFlBQUE7QUE4QkU7Ozs7QUFJRztJQUNILFNBQ1UsR0FBQSxDQUFBLE9BQTBDLEVBQzFDLFlBRVAsRUFBQTtBQUZPLFFBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxZQUFBLEdBQUE7QUFDTixZQUFBLGNBQWMsRUFBRSxFQUFFO0FBQ25CLFNBQUEsQ0FBQSxFQUFBO1FBSE8sSUFBTyxDQUFBLE9BQUEsR0FBUCxPQUFPLENBQW1DO1FBQzFDLElBQVksQ0FBQSxZQUFBLEdBQVosWUFBWSxDQUVuQjtRQXRDSCxJQUFRLENBQUEsUUFBQSxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUEsSUFBQSxDQUFBLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2QixRQUFBLElBQUEsQ0FBQSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEIsUUFBQSxJQUFBLENBQUEsZUFBZSxHQUFHO1lBQ2hCLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtTQUNMLENBQUM7QUFDRixRQUFBLElBQUEsQ0FBQSxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUV6RCxRQUFBLElBQUEsQ0FBQSxJQUFJLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUEsSUFBQSxHQUFtQyxJQUFJLENBQUM7UUFDNUMsSUFBSSxDQUFBLElBQUEsR0FBbUMsSUFBSSxDQUFDO1FBQzVDLElBQVcsQ0FBQSxXQUFBLEdBQW1DLElBQUksQ0FBQztRQUNuRCxJQUFVLENBQUEsVUFBQSxHQUFtQyxJQUFJLENBQUM7QUFDbEQsUUFBQSxJQUFBLENBQUEsU0FBUyxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO0FBYXpDLFFBQUEsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7QUFDL0IsWUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JCO0FBQU0sYUFBQSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtBQUN0QyxZQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkI7S0FDRjtBQUVEOzs7OztBQUtHO0lBQ0gsR0FBTyxDQUFBLFNBQUEsQ0FBQSxPQUFBLEdBQVAsVUFBUSxJQUE2QixFQUFBO0FBQ25DLFFBQUEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBQSxPQUFPLElBQUksQ0FBQztLQUNiLENBQUE7QUFFRDs7O0FBR0c7QUFDSCxJQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsS0FBSyxHQUFMLFlBQUE7UUFDRSxPQUFPLEdBQUEsQ0FBQSxNQUFBLENBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUEsR0FBQSxDQUFHLENBQUM7S0FDNUMsQ0FBQTtBQUVEOzs7O0FBSUc7QUFDSCxJQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsb0JBQW9CLEdBQXBCLFlBQUE7QUFDRSxRQUFBLElBQU0sR0FBRyxHQUFHLEdBQUksQ0FBQSxNQUFBLENBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUEsR0FBQSxDQUFHLENBQUM7UUFDaEQsT0FBT0MsY0FBTyxDQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDMUMsQ0FBQTtBQUVEOzs7O0FBSUc7SUFDSCxHQUFLLENBQUEsU0FBQSxDQUFBLEtBQUEsR0FBTCxVQUFNLEdBQVcsRUFBQTtBQUNmLFFBQUEsSUFBSSxDQUFDLEdBQUc7WUFBRSxPQUFPO1FBQ2pCLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBTSxLQUFLLEdBQThCLEVBQUUsQ0FBQztnQ0FFbkMsQ0FBQyxFQUFBO0FBQ1IsWUFBQSxJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsWUFBQSxJQUFJLE9BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDbEUsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEMsZ0JBQUEsSUFBSSxPQUFPLEtBQUssRUFBRSxFQUFFO29CQUNsQixJQUFNLFdBQVMsR0FBZSxFQUFFLENBQUM7b0JBQ2pDLElBQU0sWUFBVSxHQUFnQixFQUFFLENBQUM7b0JBQ25DLElBQU0sV0FBUyxHQUFlLEVBQUUsQ0FBQztvQkFDakMsSUFBTSxhQUFXLEdBQWlCLEVBQUUsQ0FBQztvQkFDckMsSUFBTSxlQUFhLEdBQW1CLEVBQUUsQ0FBQztvQkFDekMsSUFBTSxxQkFBbUIsR0FBeUIsRUFBRSxDQUFDO29CQUNyRCxJQUFNLHFCQUFtQixHQUF5QixFQUFFLENBQUM7b0JBQ3JELElBQU0sYUFBVyxHQUFpQixFQUFFLENBQUM7QUFFckMsb0JBQUEsSUFBTSxPQUFPLEdBQUFILG1CQUFBLENBQUEsRUFBQSxFQUFBQyxZQUFBLENBQ1IsT0FBTyxDQUFDLFFBQVE7Ozs7O0FBS2pCLG9CQUFBLE1BQU0sQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLENBQUMsQ0FDeEQsU0FDRixDQUFDO0FBRUYsb0JBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsRUFBQTt3QkFDZixJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO3dCQUM1QyxJQUFJLFVBQVUsRUFBRTtBQUNkLDRCQUFBLElBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1Qiw0QkFBQSxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbEMsZ0NBQUEsV0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ3JDO0FBQ0QsNEJBQUEsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ25DLGdDQUFBLFlBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUN2QztBQUNELDRCQUFBLElBQUksY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNsQyxnQ0FBQSxXQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDckM7QUFDRCw0QkFBQSxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNwQyxnQ0FBQSxhQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDekM7QUFDRCw0QkFBQSxJQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN2QyxnQ0FBQSxlQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDN0M7QUFDRCw0QkFBQSxJQUFJLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM3QyxnQ0FBQSxxQkFBbUIsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ3pEO0FBQ0QsNEJBQUEsSUFBSSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDN0MsZ0NBQUEscUJBQW1CLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUN6RDtBQUNELDRCQUFBLElBQUksZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3BDLGdDQUFBLGFBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUN6Qzt5QkFDRjtBQUNILHFCQUFDLENBQUMsQ0FBQztBQUVILG9CQUFBLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ3RCLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFLLFdBQVcsRUFBRSxXQUFTLENBQUMsQ0FBQztBQUNqRCx3QkFBQSxJQUFNLElBQUksR0FBRyxNQUFBLENBQUssSUFBSSxDQUFDLEtBQUssQ0FBVTtBQUNwQyw0QkFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLDRCQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsNEJBQUEsS0FBSyxFQUFFLE9BQU87QUFDZCw0QkFBQSxNQUFNLEVBQUUsQ0FBQztBQUNULDRCQUFBLFNBQVMsRUFBQSxXQUFBO0FBQ1QsNEJBQUEsVUFBVSxFQUFBLFlBQUE7QUFDViw0QkFBQSxTQUFTLEVBQUEsV0FBQTtBQUNULDRCQUFBLFdBQVcsRUFBQSxhQUFBO0FBQ1gsNEJBQUEsYUFBYSxFQUFBLGVBQUE7QUFDYiw0QkFBQSxtQkFBbUIsRUFBQSxxQkFBQTtBQUNuQiw0QkFBQSxtQkFBbUIsRUFBQSxxQkFBQTtBQUNuQiw0QkFBQSxXQUFXLEVBQUEsYUFBQTtBQUNaLHlCQUFBLENBQUMsQ0FBQzt3QkFFSCxJQUFJLE1BQUEsQ0FBSyxXQUFXLEVBQUU7QUFDcEIsNEJBQUEsTUFBQSxDQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBRWhDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7NEJBRXhDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7eUJBQzlCOzZCQUFNOzRCQUNMLE1BQUssQ0FBQSxJQUFJLEdBQUcsSUFBSSxDQUFDOzRCQUNqQixNQUFLLENBQUEsVUFBVSxHQUFHLElBQUksQ0FBQzt5QkFDeEI7d0JBQ0QsTUFBSyxDQUFBLFdBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ3hCLE9BQU8sSUFBSSxDQUFDLENBQUM7cUJBQ2Q7aUJBQ0Y7YUFDRjtBQUNELFlBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQUssV0FBVyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFOztBQUUvRCxnQkFBQSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQUssQ0FBQSxXQUFXLENBQUMsQ0FBQzthQUM5QjtBQUNELFlBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQy9ELGdCQUFBLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxJQUFJLEVBQUU7b0JBQ1IsTUFBSyxDQUFBLFdBQVcsR0FBRyxJQUFJLENBQUM7aUJBQ3pCO2FBQ0Y7QUFFRCxZQUFBLElBQUksT0FBSyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNsRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO2FBQ2Y7OztBQXBHSCxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFBO29CQUExQixDQUFDLENBQUEsQ0FBQTtBQXFHVCxTQUFBO0tBQ0YsQ0FBQTtBQUVEOzs7OztBQUtHO0lBQ0ssR0FBWSxDQUFBLFNBQUEsQ0FBQSxZQUFBLEdBQXBCLFVBQXFCLElBQVMsRUFBQTtRQUE5QixJQW1DQyxLQUFBLEdBQUEsSUFBQSxDQUFBO1FBbENDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUEwQixFQUFBO0FBQzdCLFlBQUEsSUFBQSxFQVNGLEdBQUEsQ0FBQyxDQUFDLEtBQUssRUFSVCxTQUFTLEdBQUEsRUFBQSxDQUFBLFNBQUEsRUFDVCxTQUFTLEdBQUEsRUFBQSxDQUFBLFNBQUEsRUFDVCxXQUFXLEdBQUEsRUFBQSxDQUFBLFdBQUEsRUFDWCxVQUFVLEdBQUEsRUFBQSxDQUFBLFVBQUEsRUFDVixXQUFXLEdBQUEsRUFBQSxDQUFBLFdBQUEsRUFDWCxtQkFBbUIsR0FBQSxFQUFBLENBQUEsbUJBQUEsRUFDbkIsbUJBQW1CLEdBQUEsRUFBQSxDQUFBLG1CQUFBLEVBQ25CLGFBQWEsR0FBQSxFQUFBLENBQUEsYUFDSixDQUFDO1lBQ1osSUFBTSxLQUFLLEdBQUdHLGNBQU8sQ0FDaEJKLG1CQUFBLENBQUFBLG1CQUFBLENBQUFBLG1CQUFBLENBQUFBLG1CQUFBLENBQUFBLG1CQUFBLENBQUFBLG1CQUFBLENBQUFBLG1CQUFBLENBQUFBLG1CQUFBLENBQUEsRUFBQSxFQUFBQyxZQUFBLENBQUEsU0FBUyxDQUNULEVBQUEsS0FBQSxDQUFBLEVBQUFBLFlBQUEsQ0FBQSxXQUFXLENBQ1gsRUFBQSxLQUFBLENBQUEsRUFBQUEsWUFBQSxDQUFBLFNBQVMsQ0FDVCxFQUFBLEtBQUEsQ0FBQSxFQUFBQSxZQUFBLENBQUEsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQ2hDLEVBQUEsS0FBQSxDQUFBLEVBQUFBLFlBQUEsQ0FBQSxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBQSxZQUFBLENBQ2pDLGFBQWEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBQSxZQUFBLENBQ2IsbUJBQW1CLENBQUEsRUFBQSxLQUFBLENBQUEsRUFBQUEsWUFBQSxDQUNuQixtQkFBbUIsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxDQUN0QixDQUFDO1lBQ0gsT0FBTyxJQUFJLEdBQUcsQ0FBQztBQUNmLFlBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQWMsRUFBQTtBQUMzQixnQkFBQSxPQUFPLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFCLGFBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsZ0JBQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFrQixFQUFBO29CQUNwQyxPQUFPLElBQUksV0FBSSxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFBLEdBQUEsQ0FBRyxDQUFDO0FBQzdDLGlCQUFDLENBQUMsQ0FBQzthQUNKO0FBQ0QsWUFBQSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUMvQixTQUFDLENBQUMsQ0FBQztBQUNILFFBQUEsT0FBTyxPQUFPLENBQUM7S0FDaEIsQ0FBQTtJQUNILE9BQUMsR0FBQSxDQUFBO0FBQUQsQ0FBQyxFQUFBOztBQzlNRDtBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBS3BDLElBQU0sK0JBQStCLEdBQUcsVUFBQyxTQUFpQixFQUFBOztBQUUvRCxJQUFBLElBQUksU0FBUyxJQUFJLEVBQUUsRUFBRTtRQUNuQixPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3pELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN4RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO0FBQzFELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN4RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDeEQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUdELElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3pELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQ3pELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN4RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDM0QsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQzNELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3BDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDdkQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxDQUFDLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTtRQUNuQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7SUFDRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1FBQ3pELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztRQUN6RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFFBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFFBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztLQUNwRCxDQUFDO0FBQ0osRUFBRTtJQUVXLE1BQU0sR0FBRyxVQUFDLENBQVMsRUFBRSxLQUFTLEVBQUUsS0FBUyxFQUFBO0FBQXBCLElBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFTLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFBRSxJQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBUyxHQUFBLENBQUEsQ0FBQSxFQUFBO0lBQ3BELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlELEVBQUU7SUFFVyxNQUFNLEdBQUcsVUFBQyxDQUFTLEVBQUUsS0FBUyxFQUFFLEtBQVMsRUFBQTtBQUFwQixJQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBUyxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQUUsSUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVMsR0FBQSxDQUFBLENBQUEsRUFBQTtJQUNwRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksS0FBSyxFQUFF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LENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLElBQUEsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELElBQUEsT0FBTyxFQUFDLENBQUMsRUFBQSxDQUFBLEVBQUUsQ0FBQyxFQUFBLENBQUEsRUFBQyxDQUFDO0FBQ2hCLEVBQUU7QUFFVyxJQUFBLFNBQVMsR0FBRyxVQUFDLElBQVksRUFBRSxTQUFjLEVBQUE7QUFBZCxJQUFBLElBQUEsU0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsU0FBYyxHQUFBLEVBQUEsQ0FBQSxFQUFBO0lBQ3BELElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsSUFBQSxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsSUFBQSxPQUFPLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLEVBQUU7QUFFVyxJQUFBLFNBQVMsR0FBRyxVQUFDLEdBQVEsRUFBRSxNQUFVLEVBQUE7QUFBVixJQUFBLElBQUEsTUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsTUFBVSxHQUFBLENBQUEsQ0FBQSxFQUFBO0lBQzVDLElBQUksTUFBTSxLQUFLLENBQUM7QUFBRSxRQUFBLE9BQU8sR0FBRyxDQUFDO0FBQzdCLElBQUEsSUFBTSxHQUFHLEdBQUdDLFlBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixJQUFBLElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3ZELE9B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
