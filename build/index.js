
  /**
   * @license
   * author: BAI TIANLIANG
   * ghostban.js v3.0.0-alpha.119
   * Released under the MIT license.
   */

'use strict';

var tslib = require('tslib');
var TreeModel = require('tree-model');
var lodash = require('lodash');
var jsBase64 = require('js-base64');

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

function isCharacterInNode(sgf, n, nodes) {
    if (nodes === void 0) { nodes = ['C', 'TM', 'GN']; }
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
    if (keys === void 0) { keys = ['C', 'TM', 'GN']; }
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

// export * from './boardcore';
// es6 import style sometimes trigger error 'gg/ghostban/build/index.js" contains a reference to the file "crypto'
// use require instead
// import sha256 from 'crypto-js/sha256';
var sha256 = require('crypto-js/sha256');
var MD5 = require('crypto-js/MD5');
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
var calcHash = function (node, moveProps) {
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
    var hash = MD5(fullname).toString().slice(0, 6);
    return hash;
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
exports.TimingProp = TimingProp;
exports.YELLOW_RGB = YELLOW_RGB;
exports.__calcSHA_Deprecated = __calcSHA_Deprecated;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzLnRzIiwiLi4vLi4vY29uc3QudHMiLCIuLi8uLi9jb3JlL3Byb3BzLnRzIiwiLi4vLi4vYm9hcmRjb3JlLnRzIiwiLi4vLi4vY29yZS9oZWxwZXJzLnRzIiwiLi4vLi4vY29yZS9zZ2YudHMiLCIuLi8uLi9oZWxwZXIudHMiLCIuLi8uLi9zdG9uZXMvYmFzZS50cyIsIi4uLy4uL3N0b25lcy9Db2xvclN0b25lLnRzIiwiLi4vLi4vc3RvbmVzL0ltYWdlU3RvbmUudHMiLCIuLi8uLi9zdG9uZXMvQW5hbHlzaXNQb2ludC50cyIsIi4uLy4uL21hcmt1cHMvTWFya3VwQmFzZS50cyIsIi4uLy4uL21hcmt1cHMvQ2lyY2xlTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9Dcm9zc01hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvVGV4dE1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvU3F1YXJlTWFya3VwLnRzIiwiLi4vLi4vbWFya3Vwcy9UcmlhbmdsZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvTm9kZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvQWN0aXZlTm9kZU1hcmt1cC50cyIsIi4uLy4uL21hcmt1cHMvQ2lyY2xlU29saWRNYXJrdXAudHMiLCIuLi8uLi9lZmZlY3RzL0VmZmVjdEJhc2UudHMiLCIuLi8uLi9lZmZlY3RzL0JhbkVmZmVjdC50cyIsIi4uLy4uL2dob3N0YmFuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogT3B0aW9ucyBmb3IgY29uZmlndXJpbmcgR2hvc3RCYW4uXG4gKi9cbmV4cG9ydCB0eXBlIEdob3N0QmFuT3B0aW9ucyA9IHtcbiAgYm9hcmRTaXplOiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIGR5bmFtaWNQYWRkaW5nOiBib29sZWFuO1xuICBwYWRkaW5nOiBudW1iZXI7XG4gIHpvb20/OiBib29sZWFuO1xuICBleHRlbnQ6IG51bWJlcjtcbiAgdGhlbWU6IFRoZW1lO1xuICBhbmFseXNpc1BvaW50VGhlbWU6IEFuYWx5c2lzUG9pbnRUaGVtZTtcbiAgY29vcmRpbmF0ZTogYm9vbGVhbjtcbiAgaW50ZXJhY3RpdmU6IGJvb2xlYW47XG4gIGJhY2tncm91bmQ6IGJvb2xlYW47XG4gIHNob3dBbmFseXNpczogYm9vbGVhbjtcbiAgYWRhcHRpdmVCb2FyZExpbmU6IGJvb2xlYW47XG4gIGJvYXJkRWRnZUxpbmVXaWR0aDogbnVtYmVyO1xuICBib2FyZExpbmVXaWR0aDogbnVtYmVyO1xuICBib2FyZExpbmVFeHRlbnQ6IG51bWJlcjtcbiAgdGhlbWVGbGF0Qm9hcmRDb2xvcjogc3RyaW5nO1xuICBwb3NpdGl2ZU5vZGVDb2xvcjogc3RyaW5nO1xuICBuZWdhdGl2ZU5vZGVDb2xvcjogc3RyaW5nO1xuICBuZXV0cmFsTm9kZUNvbG9yOiBzdHJpbmc7XG4gIGRlZmF1bHROb2RlQ29sb3I6IHN0cmluZztcbiAgd2FybmluZ05vZGVDb2xvcjogc3RyaW5nO1xuICB0aGVtZVJlc291cmNlczogVGhlbWVSZXNvdXJjZXM7XG4gIG1vdmVTb3VuZDogYm9vbGVhbjtcbiAgc3RhclNpemU6IG51bWJlcjtcbiAgYWRhcHRpdmVTdGFyU2l6ZTogYm9vbGVhbjtcbiAgbW9iaWxlSW5kaWNhdG9yT2Zmc2V0OiBudW1iZXI7XG4gIGZvcmNlQW5hbHlzaXNCb2FyZFNpemU/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBHaG9zdEJhbk9wdGlvbnNQYXJhbXMgPSB7XG4gIGJvYXJkU2l6ZT86IG51bWJlcjtcbiAgc2l6ZT86IG51bWJlcjtcbiAgZHluYW1pY1BhZGRpbmc/OiBib29sZWFuO1xuICBwYWRkaW5nPzogbnVtYmVyO1xuICB6b29tPzogYm9vbGVhbjtcbiAgZXh0ZW50PzogbnVtYmVyO1xuICB0aGVtZT86IFRoZW1lO1xuICBhbmFseXNpc1BvaW50VGhlbWU/OiBBbmFseXNpc1BvaW50VGhlbWU7XG4gIGNvb3JkaW5hdGU/OiBib29sZWFuO1xuICBpbnRlcmFjdGl2ZT86IGJvb2xlYW47XG4gIGJhY2tncm91bmQ/OiBib29sZWFuO1xuICBzaG93QW5hbHlzaXM/OiBib29sZWFuO1xuICBhZGFwdGl2ZUJvYXJkTGluZT86IGJvb2xlYW47XG4gIGJvYXJkRWRnZUxpbmVXaWR0aD86IG51bWJlcjtcbiAgYm9hcmRMaW5lV2lkdGg/OiBudW1iZXI7XG4gIHRoZW1lRmxhdEJvYXJkQ29sb3I/OiBzdHJpbmc7XG4gIHBvc2l0aXZlTm9kZUNvbG9yPzogc3RyaW5nO1xuICBuZWdhdGl2ZU5vZGVDb2xvcj86IHN0cmluZztcbiAgbmV1dHJhbE5vZGVDb2xvcj86IHN0cmluZztcbiAgZGVmYXVsdE5vZGVDb2xvcj86IHN0cmluZztcbiAgd2FybmluZ05vZGVDb2xvcj86IHN0cmluZztcbiAgdGhlbWVSZXNvdXJjZXM/OiBUaGVtZVJlc291cmNlcztcbiAgbW92ZVNvdW5kPzogYm9vbGVhbjtcbiAgc3RhclNpemU/OiBudW1iZXI7XG4gIGFkYXB0aXZlU3RhclNpemU/OiBib29sZWFuO1xuICBmb3JjZUFuYWx5c2lzQm9hcmRTaXplPzogbnVtYmVyO1xuICBtb2JpbGVJbmRpY2F0b3JPZmZzZXQ/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBUaGVtZVJlc291cmNlcyA9IHtcbiAgW2tleSBpbiBUaGVtZV06IHtib2FyZD86IHN0cmluZzsgYmxhY2tzOiBzdHJpbmdbXTsgd2hpdGVzOiBzdHJpbmdbXX07XG59O1xuXG5leHBvcnQgdHlwZSBDb25zdW1lZEFuYWx5c2lzID0ge1xuICByZXN1bHRzOiBBbmFseXNpc1tdO1xuICBwYXJhbXM6IEFuYWx5c2lzUGFyYW1zIHwgbnVsbDtcbn07XG5cbmV4cG9ydCB0eXBlIEFuYWx5c2VzID0ge1xuICByZXN1bHRzOiBBbmFseXNpc1tdO1xuICBwYXJhbXM6IEFuYWx5c2lzUGFyYW1zIHwgbnVsbDtcbn07XG5cbmV4cG9ydCB0eXBlIEFuYWx5c2lzID0ge1xuICBpZDogc3RyaW5nO1xuICBpc0R1cmluZ1NlYXJjaDogYm9vbGVhbjtcbiAgbW92ZUluZm9zOiBNb3ZlSW5mb1tdO1xuICByb290SW5mbzogUm9vdEluZm87XG4gIHBvbGljeTogbnVtYmVyW107XG4gIG93bmVyc2hpcDogbnVtYmVyW107XG4gIHR1cm5OdW1iZXI6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEFuYWx5c2lzUGFyYW1zID0ge1xuICBpZDogc3RyaW5nO1xuICBpbml0aWFsUGxheWVyOiBzdHJpbmc7XG4gIG1vdmVzOiBhbnlbXTtcbiAgcnVsZXM6IHN0cmluZztcbiAga29taTogc3RyaW5nO1xuICBib2FyZFhTaXplOiBudW1iZXI7XG4gIGJvYXJkWVNpemU6IG51bWJlcjtcbiAgaW5jbHVkZVBvbGljeTogYm9vbGVhbjtcbiAgcHJpb3JpdHk6IG51bWJlcjtcbiAgbWF4VmlzaXRzOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBNb3ZlSW5mbyA9IHtcbiAgaXNTeW1tZXRyeU9mOiBzdHJpbmc7XG4gIGxjYjogbnVtYmVyO1xuICBtb3ZlOiBzdHJpbmc7XG4gIG9yZGVyOiBudW1iZXI7XG4gIHByaW9yOiBudW1iZXI7XG4gIHB2OiBzdHJpbmdbXTtcbiAgc2NvcmVMZWFkOiBudW1iZXI7XG4gIHNjb3JlTWVhbjogbnVtYmVyO1xuICBzY29yZVNlbGZQbGF5OiBudW1iZXI7XG4gIHNjb3JlU3RkZXY6IG51bWJlcjtcbiAgdXRpbGl0eTogbnVtYmVyO1xuICB1dGlsaXR5TGNiOiBudW1iZXI7XG4gIHZpc2l0czogbnVtYmVyO1xuICB3aW5yYXRlOiBudW1iZXI7XG4gIHdlaWdodDogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgUm9vdEluZm8gPSB7XG4gIC8vIGN1cnJlbnRQbGF5ZXIgaXMgbm90IG9mZmljaWFsbHkgcGFydCBvZiB0aGUgR1RQIHJlc3VsdHMgYnV0IGl0IGlzIGhlbHBmdWwgdG8gaGF2ZSBpdCBoZXJlIHRvIGF2b2lkIHBhc3NpbmcgaXQgdGhyb3VnaCB0aGUgYXJndW1lbnRzXG4gIGN1cnJlbnRQbGF5ZXI6IHN0cmluZztcbiAgc2NvcmVMZWFkOiBudW1iZXI7XG4gIHNjb3JlU2VsZnBsYXk6IG51bWJlcjtcbiAgc2NvcmVTdGRldjogbnVtYmVyO1xuICB1dGlsaXR5OiBudW1iZXI7XG4gIHZpc2l0czogbnVtYmVyO1xuICB3aW5yYXRlOiBudW1iZXI7XG4gIHdlaWdodD86IG51bWJlcjtcbiAgcmF3U3RXckVycm9yPzogbnVtYmVyO1xuICByYXdTdFNjb3JlRXJyb3I/OiBudW1iZXI7XG4gIHJhd1ZhclRpbWVMZWZ0PzogbnVtYmVyO1xuICAvLyBHVFAgcmVzdWx0cyBkb24ndCBpbmNsdWRlIHRoZSBmb2xsb3dpbmcgZmllbGRzXG4gIGxjYj86IG51bWJlcjtcbiAgc3ltSGFzaD86IHN0cmluZztcbiAgdGhpc0hhc2g/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpc1BvaW50T3B0aW9ucyA9IHtcbiAgc2hvd09yZGVyPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBlbnVtIEtpIHtcbiAgQmxhY2sgPSAxLFxuICBXaGl0ZSA9IC0xLFxuICBFbXB0eSA9IDAsXG59XG5cbmV4cG9ydCBlbnVtIFRoZW1lIHtcbiAgQmxhY2tBbmRXaGl0ZSA9ICdibGFja19hbmRfd2hpdGUnLFxuICBGbGF0ID0gJ2ZsYXQnLFxuICBTdWJkdWVkID0gJ3N1YmR1ZWQnLFxuICBTaGVsbFN0b25lID0gJ3NoZWxsX3N0b25lJyxcbiAgU2xhdGVBbmRTaGVsbCA9ICdzbGF0ZV9hbmRfc2hlbGwnLFxuICBXYWxudXQgPSAnd2FsbnV0JyxcbiAgUGhvdG9yZWFsaXN0aWMgPSAncGhvdG9yZWFsaXN0aWMnLFxufVxuXG5leHBvcnQgZW51bSBBbmFseXNpc1BvaW50VGhlbWUge1xuICBEZWZhdWx0ID0gJ2RlZmF1bHQnLFxuICBQcm9ibGVtID0gJ3Byb2JsZW0nLFxufVxuXG5leHBvcnQgZW51bSBDZW50ZXIge1xuICBMZWZ0ID0gJ2wnLFxuICBSaWdodCA9ICdyJyxcbiAgVG9wID0gJ3QnLFxuICBCb3R0b20gPSAnYicsXG4gIFRvcFJpZ2h0ID0gJ3RyJyxcbiAgVG9wTGVmdCA9ICd0bCcsXG4gIEJvdHRvbUxlZnQgPSAnYmwnLFxuICBCb3R0b21SaWdodCA9ICdicicsXG4gIENlbnRlciA9ICdjJyxcbn1cblxuZXhwb3J0IGVudW0gRWZmZWN0IHtcbiAgTm9uZSA9ICcnLFxuICBCYW4gPSAnYmFuJyxcbiAgRGltID0gJ2RpbScsXG4gIEhpZ2hsaWdodCA9ICdoaWdobGlnaHQnLFxufVxuXG5leHBvcnQgZW51bSBNYXJrdXAge1xuICBDdXJyZW50ID0gJ2N1JyxcbiAgQ2lyY2xlID0gJ2NpJyxcbiAgQ2lyY2xlU29saWQgPSAnY2lzJyxcbiAgU3F1YXJlID0gJ3NxJyxcbiAgU3F1YXJlU29saWQgPSAnc3FzJyxcbiAgVHJpYW5nbGUgPSAndHJpJyxcbiAgQ3Jvc3MgPSAnY3InLFxuICBOdW1iZXIgPSAnbnVtJyxcbiAgTGV0dGVyID0gJ2xlJyxcbiAgUG9zaXRpdmVOb2RlID0gJ3BvcycsXG4gIFBvc2l0aXZlQWN0aXZlTm9kZSA9ICdwb3NhJyxcbiAgUG9zaXRpdmVEYXNoZWROb2RlID0gJ3Bvc2RhJyxcbiAgUG9zaXRpdmVEb3R0ZWROb2RlID0gJ3Bvc2R0JyxcbiAgUG9zaXRpdmVEYXNoZWRBY3RpdmVOb2RlID0gJ3Bvc2RhYScsXG4gIFBvc2l0aXZlRG90dGVkQWN0aXZlTm9kZSA9ICdwb3NkdGEnLFxuICBOZWdhdGl2ZU5vZGUgPSAnbmVnJyxcbiAgTmVnYXRpdmVBY3RpdmVOb2RlID0gJ25lZ2EnLFxuICBOZWdhdGl2ZURhc2hlZE5vZGUgPSAnbmVnZGEnLFxuICBOZWdhdGl2ZURvdHRlZE5vZGUgPSAnbmVnZHQnLFxuICBOZWdhdGl2ZURhc2hlZEFjdGl2ZU5vZGUgPSAnbmVnZGFhJyxcbiAgTmVnYXRpdmVEb3R0ZWRBY3RpdmVOb2RlID0gJ25lZ2R0YScsXG4gIE5ldXRyYWxOb2RlID0gJ25ldScsXG4gIE5ldXRyYWxBY3RpdmVOb2RlID0gJ25ldWEnLFxuICBOZXV0cmFsRGFzaGVkTm9kZSA9ICduZXVkYScsXG4gIE5ldXRyYWxEb3R0ZWROb2RlID0gJ25ldWR0JyxcbiAgTmV1dHJhbERhc2hlZEFjdGl2ZU5vZGUgPSAnbmV1ZHRhJyxcbiAgTmV1dHJhbERvdHRlZEFjdGl2ZU5vZGUgPSAnbmV1ZGFhJyxcbiAgV2FybmluZ05vZGUgPSAnd2EnLFxuICBXYXJuaW5nQWN0aXZlTm9kZSA9ICd3YWEnLFxuICBXYXJuaW5nRGFzaGVkTm9kZSA9ICd3YWRhJyxcbiAgV2FybmluZ0RvdHRlZE5vZGUgPSAnd2FkdCcsXG4gIFdhcm5pbmdEYXNoZWRBY3RpdmVOb2RlID0gJ3dhZGFhJyxcbiAgV2FybmluZ0RvdHRlZEFjdGl2ZU5vZGUgPSAnd2FkdGEnLFxuICBEZWZhdWx0Tm9kZSA9ICdkZScsXG4gIERlZmF1bHRBY3RpdmVOb2RlID0gJ2RlYScsXG4gIERlZmF1bHREYXNoZWROb2RlID0gJ2RlZGEnLFxuICBEZWZhdWx0RG90dGVkTm9kZSA9ICdkZWR0JyxcbiAgRGVmYXVsdERhc2hlZEFjdGl2ZU5vZGUgPSAnZGVkYWEnLFxuICBEZWZhdWx0RG90dGVkQWN0aXZlTm9kZSA9ICdkZWR0YScsXG4gIE5vZGUgPSAnbm9kZScsXG4gIERhc2hlZE5vZGUgPSAnZGFub2RlJyxcbiAgRG90dGVkTm9kZSA9ICdkdG5vZGUnLFxuICBBY3RpdmVOb2RlID0gJ2Fub2RlJyxcbiAgRGFzaGVkQWN0aXZlTm9kZSA9ICdkYW5vZGUnLFxuICBOb25lID0gJycsXG59XG5cbmV4cG9ydCBlbnVtIEN1cnNvciB7XG4gIE5vbmUgPSAnJyxcbiAgQmxhY2tTdG9uZSA9ICdiJyxcbiAgV2hpdGVTdG9uZSA9ICd3JyxcbiAgQ2lyY2xlID0gJ2MnLFxuICBTcXVhcmUgPSAncycsXG4gIFRyaWFuZ2xlID0gJ3RyaScsXG4gIENyb3NzID0gJ2NyJyxcbiAgQ2xlYXIgPSAnY2wnLFxuICBUZXh0ID0gJ3QnLFxufVxuXG5leHBvcnQgZW51bSBQcm9ibGVtQW5zd2VyVHlwZSB7XG4gIFJpZ2h0ID0gJzEnLFxuICBXcm9uZyA9ICcyJyxcbiAgVmFyaWFudCA9ICczJyxcbn1cblxuZXhwb3J0IGVudW0gUGF0aERldGVjdGlvblN0cmF0ZWd5IHtcbiAgUG9zdCA9ICdwb3N0JyxcbiAgUHJlID0gJ3ByZScsXG4gIEJvdGggPSAnYm90aCcsXG59XG4iLCJpbXBvcnQge2NodW5rfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtUaGVtZX0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IHNldHRpbmdzID0ge2NkbjogJ2h0dHBzOi8vcy5zaGFvd3EuY29tJ307XG5cbmV4cG9ydCBjb25zdCBNQVhfQk9BUkRfU0laRSA9IDI5O1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQk9BUkRfU0laRSA9IDE5O1xuZXhwb3J0IGNvbnN0IEExX0xFVFRFUlMgPSBbXG4gICdBJyxcbiAgJ0InLFxuICAnQycsXG4gICdEJyxcbiAgJ0UnLFxuICAnRicsXG4gICdHJyxcbiAgJ0gnLFxuICAnSicsXG4gICdLJyxcbiAgJ0wnLFxuICAnTScsXG4gICdOJyxcbiAgJ08nLFxuICAnUCcsXG4gICdRJyxcbiAgJ1InLFxuICAnUycsXG4gICdUJyxcbl07XG5leHBvcnQgY29uc3QgQTFfTEVUVEVSU19XSVRIX0kgPSBbXG4gICdBJyxcbiAgJ0InLFxuICAnQycsXG4gICdEJyxcbiAgJ0UnLFxuICAnRicsXG4gICdHJyxcbiAgJ0gnLFxuICAnSScsXG4gICdKJyxcbiAgJ0snLFxuICAnTCcsXG4gICdNJyxcbiAgJ04nLFxuICAnTycsXG4gICdQJyxcbiAgJ1EnLFxuICAnUicsXG4gICdTJyxcbl07XG5leHBvcnQgY29uc3QgQTFfTlVNQkVSUyA9IFtcbiAgMTksIDE4LCAxNywgMTYsIDE1LCAxNCwgMTMsIDEyLCAxMSwgMTAsIDksIDgsIDcsIDYsIDUsIDQsIDMsIDIsIDEsXG5dO1xuZXhwb3J0IGNvbnN0IFNHRl9MRVRURVJTID0gW1xuICAnYScsXG4gICdiJyxcbiAgJ2MnLFxuICAnZCcsXG4gICdlJyxcbiAgJ2YnLFxuICAnZycsXG4gICdoJyxcbiAgJ2knLFxuICAnaicsXG4gICdrJyxcbiAgJ2wnLFxuICAnbScsXG4gICduJyxcbiAgJ28nLFxuICAncCcsXG4gICdxJyxcbiAgJ3InLFxuICAncycsXG5dO1xuLy8gZXhwb3J0IGNvbnN0IEJMQU5LX0FSUkFZID0gY2h1bmsobmV3IEFycmF5KDM2MSkuZmlsbCgwKSwgMTkpO1xuZXhwb3J0IGNvbnN0IERPVF9TSVpFID0gMztcbmV4cG9ydCBjb25zdCBFWFBBTkRfSCA9IDU7XG5leHBvcnQgY29uc3QgRVhQQU5EX1YgPSA1O1xuZXhwb3J0IGNvbnN0IFJFU1BPTlNFX1RJTUUgPSAxMDA7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIGJvYXJkU2l6ZTogMTksXG4gIHBhZGRpbmc6IDE1LFxuICBleHRlbnQ6IDIsXG4gIGludGVyYWN0aXZlOiBmYWxzZSxcbiAgY29vcmRpbmF0ZTogdHJ1ZSxcbiAgdGhlbWU6IFRoZW1lLkZsYXQsXG4gIGJhY2tncm91bmQ6IGZhbHNlLFxuICB6b29tOiBmYWxzZSxcbiAgc2hvd0FuYWx5c2lzOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBjb25zdCBUSEVNRV9SRVNPVVJDRVM6IHtcbiAgW2tleSBpbiBUaGVtZV06IHtib2FyZD86IHN0cmluZzsgYmxhY2tzOiBzdHJpbmdbXTsgd2hpdGVzOiBzdHJpbmdbXX07XG59ID0ge1xuICBbVGhlbWUuQmxhY2tBbmRXaGl0ZV06IHtcbiAgICBibGFja3M6IFtdLFxuICAgIHdoaXRlczogW10sXG4gIH0sXG4gIFtUaGVtZS5TdWJkdWVkXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zdWJkdWVkL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc3ViZHVlZC9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zdWJkdWVkL3doaXRlLnBuZ2BdLFxuICB9LFxuICBbVGhlbWUuU2hlbGxTdG9uZV06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS9ibGFjay5wbmdgXSxcbiAgICB3aGl0ZXM6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMC5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUxLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTIucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMy5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGU0LnBuZ2AsXG4gICAgXSxcbiAgfSxcbiAgW1RoZW1lLlNsYXRlQW5kU2hlbGxdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlMS5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlMi5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlMy5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlNC5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL3NsYXRlNS5wbmdgLFxuICAgIF0sXG4gICAgd2hpdGVzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGwxLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGwyLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGwzLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGw0LnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2hlbGw1LnBuZ2AsXG4gICAgXSxcbiAgfSxcbiAgW1RoZW1lLldhbG51dF06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvd2FsbnV0L2JvYXJkLmpwZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvd2FsbnV0L2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3dhbG51dC93aGl0ZS5wbmdgXSxcbiAgfSxcbiAgW1RoZW1lLlBob3RvcmVhbGlzdGljXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9waG90b3JlYWxpc3RpYy9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3Bob3RvcmVhbGlzdGljL2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3Bob3RvcmVhbGlzdGljL3doaXRlLnBuZ2BdLFxuICB9LFxuICBbVGhlbWUuRmxhdF06IHtcbiAgICBibGFja3M6IFtdLFxuICAgIHdoaXRlczogW10sXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgTElHSFRfR1JFRU5fUkdCID0gJ3JnYmEoMTM2LCAxNzAsIDYwLCAxKSc7XG5leHBvcnQgY29uc3QgTElHSFRfWUVMTE9XX1JHQiA9ICdyZ2JhKDIwNiwgMjEwLCA4MywgMSknO1xuZXhwb3J0IGNvbnN0IFlFTExPV19SR0IgPSAncmdiYSgyNDIsIDIxNywgNjAsIDEpJztcbmV4cG9ydCBjb25zdCBMSUdIVF9SRURfUkdCID0gJ3JnYmEoMjM2LCAxNDYsIDczLCAxKSc7XG4iLCJleHBvcnQgY29uc3QgTU9WRV9QUk9QX0xJU1QgPSBbXG4gICdCJyxcbiAgLy8gS08gaXMgc3RhbmRhcmQgaW4gbW92ZSBsaXN0IGJ1dCB1c3VhbGx5IGJlIHVzZWQgZm9yIGtvbWkgaW4gZ2FtZWluZm8gcHJvcHNcbiAgLy8gJ0tPJyxcbiAgJ01OJyxcbiAgJ1cnLFxuXTtcbmV4cG9ydCBjb25zdCBTRVRVUF9QUk9QX0xJU1QgPSBbXG4gICdBQicsXG4gICdBRScsXG4gICdBVycsXG4gIC8vVE9ETzogUEwgaXMgYSB2YWx1ZSBvZiBjb2xvciB0eXBlXG4gIC8vICdQTCdcbl07XG5leHBvcnQgY29uc3QgTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVCA9IFtcbiAgJ0EnLFxuICAnQycsXG4gICdETScsXG4gICdHQicsXG4gICdHVycsXG4gICdITycsXG4gICdOJyxcbiAgJ1VDJyxcbiAgJ1YnLFxuXTtcbmV4cG9ydCBjb25zdCBNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNUID0gW1xuICAnQk0nLFxuICAnRE8nLFxuICAnSVQnLFxuICAvLyBURSBpcyBzdGFuZGFyZCBpbiBtb3ZlIGFubm90YXRpb24gZm9yIHRlc3VqaVxuICAvLyAnVEUnLFxuXTtcbmV4cG9ydCBjb25zdCBNQVJLVVBfUFJPUF9MSVNUID0gW1xuICAnQVInLFxuICAnQ1InLFxuICAnTEInLFxuICAnTE4nLFxuICAnTUEnLFxuICAnU0wnLFxuICAnU1EnLFxuICAnVFInLFxuXTtcblxuZXhwb3J0IGNvbnN0IFJPT1RfUFJPUF9MSVNUID0gWydBUCcsICdDQScsICdGRicsICdHTScsICdTVCcsICdTWiddO1xuZXhwb3J0IGNvbnN0IEdBTUVfSU5GT19QUk9QX0xJU1QgPSBbXG4gIC8vVEUgTm9uLXN0YW5kYXJkXG4gICdURScsXG4gIC8vS08gTm9uLXN0YW5kYXJkXG4gICdLTycsXG4gICdBTicsXG4gICdCUicsXG4gICdCVCcsXG4gICdDUCcsXG4gICdEVCcsXG4gICdFVicsXG4gICdHTicsXG4gICdHQycsXG4gICdPTicsXG4gICdPVCcsXG4gICdQQicsXG4gICdQQycsXG4gICdQVycsXG4gICdSRScsXG4gICdSTycsXG4gICdSVScsXG4gICdTTycsXG4gICdUTScsXG4gICdVUycsXG4gICdXUicsXG4gICdXVCcsXG5dO1xuZXhwb3J0IGNvbnN0IFRJTUlOR19QUk9QX0xJU1QgPSBbJ0JMJywgJ09CJywgJ09XJywgJ1dMJ107XG5leHBvcnQgY29uc3QgTUlTQ0VMTEFORU9VU19QUk9QX0xJU1QgPSBbJ0ZHJywgJ1BNJywgJ1ZXJ107XG5cbmV4cG9ydCBjb25zdCBDVVNUT01fUFJPUF9MSVNUID0gWydQSScsICdQQUknLCAnTklEJywgJ1BBVCddO1xuXG5leHBvcnQgY29uc3QgTElTVF9PRl9QT0lOVFNfUFJPUCA9IFsnQUInLCAnQUUnLCAnQVcnLCAnTUEnLCAnU0wnLCAnU1EnLCAnVFInXTtcblxuY29uc3QgVE9LRU5fUkVHRVggPSBuZXcgUmVnRXhwKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuXG5leHBvcnQgY2xhc3MgU2dmUHJvcEJhc2Uge1xuICBwdWJsaWMgdG9rZW46IHN0cmluZztcbiAgcHVibGljIHR5cGU6IHN0cmluZyA9ICctJztcbiAgcHJvdGVjdGVkIF92YWx1ZTogc3RyaW5nID0gJyc7XG4gIHByb3RlY3RlZCBfdmFsdWVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIGFzIHN0cmluZztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgJHt0aGlzLnRva2VufSR7dGhpcy5fdmFsdWVzLm1hcCh2ID0+IGBbJHt2fV1gKS5qb2luKCcnKX1gO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ21vdmUnO1xuICB9XG5cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgTW92ZVByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTW92ZVByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXR1cFByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ3NldHVwJztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgdG9rZW5NYXRjaCA9IHN0ci5tYXRjaChUT0tFTl9SRUdFWCk7XG4gICAgY29uc3QgdmFsTWF0Y2hlcyA9IHN0ci5tYXRjaEFsbCgvXFxbKFtcXHNcXFNdKj8pXFxdL2cpO1xuXG4gICAgbGV0IHRva2VuID0gJyc7XG4gICAgY29uc3QgdmFscyA9IFsuLi52YWxNYXRjaGVzXS5tYXAobSA9PiBtWzFdKTtcbiAgICBpZiAodG9rZW5NYXRjaCkgdG9rZW4gPSB0b2tlbk1hdGNoWzFdO1xuICAgIHJldHVybiBuZXcgU2V0dXBQcm9wKHRva2VuLCB2YWxzKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb2RlQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdub2RlLWFubm90YXRpb24nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE5vZGVBbm5vdGF0aW9uUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOb2RlQW5ub3RhdGlvblByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdtb3ZlLWFubm90YXRpb24nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE1vdmVBbm5vdGF0aW9uUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBNb3ZlQW5ub3RhdGlvblByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBbm5vdGF0aW9uUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHt9XG5leHBvcnQgY2xhc3MgTWFya3VwUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnbWFya3VwJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IHRva2VuTWF0Y2ggPSBzdHIubWF0Y2goVE9LRU5fUkVHRVgpO1xuICAgIGNvbnN0IHZhbE1hdGNoZXMgPSBzdHIubWF0Y2hBbGwoL1xcWyhbXFxzXFxTXSo/KVxcXS9nKTtcblxuICAgIGxldCB0b2tlbiA9ICcnO1xuICAgIGNvbnN0IHZhbHMgPSBbLi4udmFsTWF0Y2hlc10ubWFwKG0gPT4gbVsxXSk7XG4gICAgaWYgKHRva2VuTWF0Y2gpIHRva2VuID0gdG9rZW5NYXRjaFsxXTtcbiAgICByZXR1cm4gbmV3IE1hcmt1cFByb3AodG9rZW4sIHZhbHMpO1xuICB9XG5cbiAgLy8gRHVwbGljYXRlZCBjb2RlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzMzOFxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvb3RQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAncm9vdCc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgUm9vdFByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUm9vdFByb3AoJycsICcnKTtcbiAgfVxuXG4gIC8vIER1cGxpY2F0ZWQgY29kZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzhcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHYW1lSW5mb1Byb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdnYW1lLWluZm8nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IEdhbWVJbmZvUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBHYW1lSW5mb1Byb3AoJycsICcnKTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBpZiAoTElTVF9PRl9QT0lOVFNfUFJPUC5pbmNsdWRlcyh0aGlzLnRva2VuKSkge1xuICAgICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWUuc3BsaXQoJywnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmFsdWVzID0gW25ld1ZhbHVlXTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG5cbiAgc2V0IHZhbHVlcyhuZXdWYWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWVzLmpvaW4oJywnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ2N1c3RvbSc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgQ3VzdG9tUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDdXN0b21Qcm9wKCcnLCAnJyk7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKExJU1RfT0ZfUE9JTlRTX1BST1AuaW5jbHVkZXModGhpcy50b2tlbikpIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgfVxuXG4gIHNldCB2YWx1ZXMobmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlcy5qb2luKCcsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRpbWluZ1Byb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdUaW1pbmcnO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChMSVNUX09GX1BPSU5UU19QUk9QLmluY2x1ZGVzKHRoaXMudG9rZW4pKSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZS5zcGxpdCgnLCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl92YWx1ZXMgPSBbbmV3VmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gIH1cblxuICBzZXQgdmFsdWVzKG5ld1ZhbHVlczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZXMuam9pbignLCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNaXNjZWxsYW5lb3VzUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHt9XG4iLCJpbXBvcnQge2Nsb25lRGVlcH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7c2dmVG9Qb3N9IGZyb20gJy4vaGVscGVyJztcblxubGV0IGxpYmVydGllcyA9IDA7XG5sZXQgcmVjdXJzaW9uUGF0aDogc3RyaW5nW10gPSBbXTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzaXplIG9mIGEgbWF0cml4LlxuICogQHBhcmFtIG1hdCBUaGUgbWF0cml4IHRvIGNhbGN1bGF0ZSB0aGUgc2l6ZSBvZi5cbiAqIEByZXR1cm5zIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIG51bWJlciBvZiByb3dzIGFuZCBjb2x1bW5zIGluIHRoZSBtYXRyaXguXG4gKi9cbmNvbnN0IGNhbGNTaXplID0gKG1hdDogbnVtYmVyW11bXSkgPT4ge1xuICBjb25zdCByb3dzU2l6ZSA9IG1hdC5sZW5ndGg7XG4gIGNvbnN0IGNvbHVtbnNTaXplID0gbWF0Lmxlbmd0aCA+IDAgPyBtYXRbMF0ubGVuZ3RoIDogMDtcbiAgcmV0dXJuIFtyb3dzU2l6ZSwgY29sdW1uc1NpemVdO1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBsaWJlcnR5IG9mIGEgc3RvbmUgb24gdGhlIGJvYXJkLlxuICogQHBhcmFtIG1hdCAtIFRoZSBib2FyZCBtYXRyaXguXG4gKiBAcGFyYW0geCAtIFRoZSB4LWNvb3JkaW5hdGUgb2YgdGhlIHN0b25lLlxuICogQHBhcmFtIHkgLSBUaGUgeS1jb29yZGluYXRlIG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSBraSAtIFRoZSB2YWx1ZSBvZiB0aGUgc3RvbmUuXG4gKi9cbmNvbnN0IGNhbGNMaWJlcnR5Q29yZSA9IChtYXQ6IG51bWJlcltdW10sIHg6IG51bWJlciwgeTogbnVtYmVyLCBraTogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IHNpemUgPSBjYWxjU2l6ZShtYXQpO1xuICBpZiAoeCA+PSAwICYmIHggPCBzaXplWzFdICYmIHkgPj0gMCAmJiB5IDwgc2l6ZVswXSkge1xuICAgIGlmIChtYXRbeF1beV0gPT09IGtpICYmICFyZWN1cnNpb25QYXRoLmluY2x1ZGVzKGAke3h9LCR7eX1gKSkge1xuICAgICAgcmVjdXJzaW9uUGF0aC5wdXNoKGAke3h9LCR7eX1gKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHggLSAxLCB5LCBraSk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4ICsgMSwgeSwga2kpO1xuICAgICAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCwgeSAtIDEsIGtpKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHgsIHkgKyAxLCBraSk7XG4gICAgfSBlbHNlIGlmIChtYXRbeF1beV0gPT09IDApIHtcbiAgICAgIGxpYmVydGllcyArPSAxO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgY2FsY0xpYmVydHkgPSAobWF0OiBudW1iZXJbXVtdLCB4OiBudW1iZXIsIHk6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCBzaXplID0gY2FsY1NpemUobWF0KTtcbiAgbGliZXJ0aWVzID0gMDtcbiAgcmVjdXJzaW9uUGF0aCA9IFtdO1xuXG4gIGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID4gc2l6ZVsxXSAtIDEgfHwgeSA+IHNpemVbMF0gLSAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpYmVydHk6IDQsXG4gICAgICByZWN1cnNpb25QYXRoOiBbXSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKG1hdFt4XVt5XSA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBsaWJlcnR5OiA0LFxuICAgICAgcmVjdXJzaW9uUGF0aDogW10sXG4gICAgfTtcbiAgfVxuICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4LCB5LCBraSk7XG4gIHJldHVybiB7XG4gICAgbGliZXJ0eTogbGliZXJ0aWVzLFxuICAgIHJlY3Vyc2lvblBhdGgsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgZXhlY0NhcHR1cmUgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgaTogbnVtYmVyLFxuICBqOiBudW1iZXIsXG4gIGtpOiBudW1iZXJcbikgPT4ge1xuICBjb25zdCBuZXdBcnJheSA9IG1hdDtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlVcCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFVwfSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogLSAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5RG93biwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aERvd259ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiArIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlMZWZ0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoTGVmdH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSAtIDEsXG4gICAgaixcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVJpZ2h0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoUmlnaHR9ID1cbiAgICBjYWxjTGliZXJ0eShtYXQsIGkgKyAxLCBqLCBraSk7XG4gIGlmIChsaWJlcnR5VXAgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoVXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3QXJyYXlbcGFyc2VJbnQoY29vcmRbMF0pXVtwYXJzZUludChjb29yZFsxXSldID0gMDtcbiAgICB9KTtcbiAgfVxuICBpZiAobGliZXJ0eURvd24gPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoRG93bi5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdBcnJheVtwYXJzZUludChjb29yZFswXSldW3BhcnNlSW50KGNvb3JkWzFdKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIGlmIChsaWJlcnR5TGVmdCA9PT0gMCkge1xuICAgIHJlY3Vyc2lvblBhdGhMZWZ0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGl0ZW0uc3BsaXQoJywnKTtcbiAgICAgIG5ld0FycmF5W3BhcnNlSW50KGNvb3JkWzBdKV1bcGFyc2VJbnQoY29vcmRbMV0pXSA9IDA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGxpYmVydHlSaWdodCA9PT0gMCkge1xuICAgIHJlY3Vyc2lvblBhdGhSaWdodC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdBcnJheVtwYXJzZUludChjb29yZFswXSldW3BhcnNlSW50KGNvb3JkWzFdKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBuZXdBcnJheTtcbn07XG5cbmNvbnN0IGNhbkNhcHR1cmUgPSAobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVVwLCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoVXB9ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiAtIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlEb3duLCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoRG93bn0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSxcbiAgICBqICsgMSxcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eUxlZnQsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhMZWZ0fSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpIC0gMSxcbiAgICBqLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5UmlnaHQsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhSaWdodH0gPVxuICAgIGNhbGNMaWJlcnR5KG1hdCwgaSArIDEsIGosIGtpKTtcbiAgaWYgKGxpYmVydHlVcCA9PT0gMCAmJiByZWN1cnNpb25QYXRoVXAubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChsaWJlcnR5RG93biA9PT0gMCAmJiByZWN1cnNpb25QYXRoRG93bi5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGxpYmVydHlMZWZ0ID09PSAwICYmIHJlY3Vyc2lvblBhdGhMZWZ0Lmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobGliZXJ0eVJpZ2h0ID09PSAwICYmIHJlY3Vyc2lvblBhdGhSaWdodC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbk1vdmUgPSAobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikgPT4ge1xuICBjb25zdCBuZXdBcnJheSA9IGNsb25lRGVlcChtYXQpO1xuICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybiBmYWxzZTtcbiAgaWYgKG1hdFtpXVtqXSAhPT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG5ld0FycmF5W2ldW2pdID0ga2k7XG4gIGNvbnN0IHtsaWJlcnR5fSA9IGNhbGNMaWJlcnR5KG5ld0FycmF5LCBpLCBqLCBraSk7XG4gIGlmIChjYW5DYXB0dXJlKG5ld0FycmF5LCBpLCBqLCAta2kpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGNhbkNhcHR1cmUobmV3QXJyYXksIGksIGosIGtpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAobGliZXJ0eSA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBzaG93S2kgPSAoXG4gIGFycmF5OiBudW1iZXJbXVtdLFxuICBzdGVwczogc3RyaW5nW10sXG4gIGlzQ2FwdHVyZWQgPSB0cnVlXG4pID0+IHtcbiAgbGV0IG5ld01hdCA9IGNsb25lRGVlcChhcnJheSk7XG4gIGxldCBoYXNNb3ZlZCA9IGZhbHNlO1xuICBzdGVwcy5mb3JFYWNoKHN0ciA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBraSxcbiAgICB9OiB7XG4gICAgICB4OiBudW1iZXI7XG4gICAgICB5OiBudW1iZXI7XG4gICAgICBraTogbnVtYmVyO1xuICAgIH0gPSBzZ2ZUb1BvcyhzdHIpO1xuICAgIGlmIChpc0NhcHR1cmVkKSB7XG4gICAgICBpZiAoY2FuTW92ZShuZXdNYXQsIHgsIHksIGtpKSkge1xuICAgICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgICAgbmV3TWF0ID0gZXhlY0NhcHR1cmUobmV3TWF0LCB4LCB5LCAta2kpO1xuICAgICAgICBoYXNNb3ZlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld01hdFt4XVt5XSA9IGtpO1xuICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBhcnJhbmdlbWVudDogbmV3TWF0LFxuICAgIGhhc01vdmVkLFxuICB9O1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBpc0NoYXJhY3RlckluTm9kZShcbiAgc2dmOiBzdHJpbmcsXG4gIG46IG51bWJlcixcbiAgbm9kZXMgPSBbJ0MnLCAnVE0nLCAnR04nXVxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKGAoJHtub2Rlcy5qb2luKCd8Jyl9KVxcXFxbKFteXFxcXF1dKilcXFxcXWAsICdnJyk7XG4gIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcblxuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKHNnZikpICE9PSBudWxsKSB7XG4gICAgY29uc3QgY29udGVudFN0YXJ0ID0gbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGggKyAxOyAvLyArMSBmb3IgdGhlICdbJ1xuICAgIGNvbnN0IGNvbnRlbnRFbmQgPSBjb250ZW50U3RhcnQgKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgaWYgKG4gPj0gY29udGVudFN0YXJ0ICYmIG4gPD0gY29udGVudEVuZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG50eXBlIFJhbmdlID0gW251bWJlciwgbnVtYmVyXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTm9kZVJhbmdlcyhcbiAgc2dmOiBzdHJpbmcsXG4gIGtleXM6IHN0cmluZ1tdID0gWydDJywgJ1RNJywgJ0dOJ11cbik6IFJhbmdlW10ge1xuICBjb25zdCByYW5nZXM6IFJhbmdlW10gPSBbXTtcbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoYFxcXFxiKCR7a2V5cy5qb2luKCd8Jyl9KVxcXFxbKFteXFxcXF1dKilcXFxcXWAsICdnJyk7XG5cbiAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKHNnZikpICE9PSBudWxsKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBtYXRjaC5pbmRleCArIG1hdGNoWzFdLmxlbmd0aCArIDE7XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgcmFuZ2VzLnB1c2goW3N0YXJ0LCBlbmRdKTtcbiAgfVxuXG4gIHJldHVybiByYW5nZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luQW55UmFuZ2UoaW5kZXg6IG51bWJlciwgcmFuZ2VzOiBSYW5nZVtdKTogYm9vbGVhbiB7XG4gIC8vIHJhbmdlcyBtdXN0IGJlIHNvcnRlZFxuICBsZXQgbGVmdCA9IDA7XG4gIGxldCByaWdodCA9IHJhbmdlcy5sZW5ndGggLSAxO1xuXG4gIHdoaWxlIChsZWZ0IDw9IHJpZ2h0KSB7XG4gICAgY29uc3QgbWlkID0gKGxlZnQgKyByaWdodCkgPj4gMTtcbiAgICBjb25zdCBbc3RhcnQsIGVuZF0gPSByYW5nZXNbbWlkXTtcblxuICAgIGlmIChpbmRleCA8IHN0YXJ0KSB7XG4gICAgICByaWdodCA9IG1pZCAtIDE7XG4gICAgfSBlbHNlIGlmIChpbmRleCA+IGVuZCkge1xuICAgICAgbGVmdCA9IG1pZCArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbiIsImltcG9ydCB7Y29tcGFjdCwgcmVwbGFjZX0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7YnVpbGROb2RlUmFuZ2VzLCBpc0luQW55UmFuZ2V9IGZyb20gJy4vaGVscGVycyc7XG5cbmltcG9ydCBUcmVlTW9kZWwgZnJvbSAndHJlZS1tb2RlbCc7XG5pbXBvcnQge1xuICBNb3ZlUHJvcCxcbiAgU2V0dXBQcm9wLFxuICBSb290UHJvcCxcbiAgR2FtZUluZm9Qcm9wLFxuICBTZ2ZQcm9wQmFzZSxcbiAgTm9kZUFubm90YXRpb25Qcm9wLFxuICBNb3ZlQW5ub3RhdGlvblByb3AsXG4gIE1hcmt1cFByb3AsXG4gIEN1c3RvbVByb3AsXG4gIFJPT1RfUFJPUF9MSVNULFxuICBNT1ZFX1BST1BfTElTVCxcbiAgU0VUVVBfUFJPUF9MSVNULFxuICBNQVJLVVBfUFJPUF9MSVNULFxuICBOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBHQU1FX0lORk9fUFJPUF9MSVNULFxuICBDVVNUT01fUFJPUF9MSVNULFxufSBmcm9tICcuL3Byb3BzJztcbmltcG9ydCB0eXBlIHtTZ2ZOb2RlfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7Y2FsY0hhc2gsIGdldERlZHVwbGljYXRlZFByb3BzLCBnZXROb2RlTnVtYmVyfSBmcm9tICcuLi9oZWxwZXInO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gU0dGIChTbWFydCBHYW1lIEZvcm1hdCkgZmlsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNnZiB7XG4gIE5FV19OT0RFID0gJzsnO1xuICBCUkFOQ0hJTkcgPSBbJygnLCAnKSddO1xuICBQUk9QRVJUWSA9IFsnWycsICddJ107XG4gIExJU1RfSURFTlRJVElFUyA9IFtcbiAgICAnQVcnLFxuICAgICdBQicsXG4gICAgJ0FFJyxcbiAgICAnQVInLFxuICAgICdDUicsXG4gICAgJ0REJyxcbiAgICAnTEInLFxuICAgICdMTicsXG4gICAgJ01BJyxcbiAgICAnU0wnLFxuICAgICdTUScsXG4gICAgJ1RSJyxcbiAgICAnVlcnLFxuICAgICdUQicsXG4gICAgJ1RXJyxcbiAgXTtcbiAgTk9ERV9ERUxJTUlURVJTID0gW3RoaXMuTkVXX05PREVdLmNvbmNhdCh0aGlzLkJSQU5DSElORyk7XG5cbiAgdHJlZTogVHJlZU1vZGVsID0gbmV3IFRyZWVNb2RlbCgpO1xuICByb290OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiB8IG51bGwgPSBudWxsO1xuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiB8IG51bGwgPSBudWxsO1xuICBjdXJyZW50Tm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4gfCBudWxsID0gbnVsbDtcbiAgcGFyZW50Tm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4gfCBudWxsID0gbnVsbDtcbiAgbm9kZVByb3BzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBTZ2YgY2xhc3MuXG4gICAqIEBwYXJhbSBjb250ZW50IFRoZSBjb250ZW50IG9mIHRoZSBTZ2YsIGVpdGhlciBhcyBhIHN0cmluZyBvciBhcyBhIFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KFJvb3Qgbm9kZSkuXG4gICAqIEBwYXJhbSBwYXJzZU9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHBhcnNpbmcgdGhlIFNnZiBjb250ZW50LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjb250ZW50Pzogc3RyaW5nIHwgVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gICAgcHJpdmF0ZSBwYXJzZU9wdGlvbnMgPSB7XG4gICAgICBpZ25vcmVQcm9wTGlzdDogW10sXG4gICAgfVxuICApIHtcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnBhcnNlKGNvbnRlbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLnNldFJvb3QoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgU0dGIHRyZWUuXG4gICAqXG4gICAqIEBwYXJhbSByb290IFRoZSByb290IG5vZGUgdG8gc2V0LlxuICAgKiBAcmV0dXJucyBUaGUgdXBkYXRlZCBTR0YgaW5zdGFuY2UuXG4gICAqL1xuICBzZXRSb290KHJvb3Q6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSB7XG4gICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgY3VycmVudCBTR0YgdHJlZSB0byBhbiBTR0Ygc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgKiBAcmV0dXJucyBUaGUgU0dGIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJlZS5cbiAgICovXG4gIHRvU2dmKCkge1xuICAgIHJldHVybiBgKCR7dGhpcy5ub2RlVG9TdHJpbmcodGhpcy5yb290KX0pYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgZ2FtZSB0cmVlIHRvIFNHRiBmb3JtYXQgd2l0aG91dCBpbmNsdWRpbmcgYW5hbHlzaXMgZGF0YS5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIFNHRiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZSB0cmVlLlxuICAgKi9cbiAgdG9TZ2ZXaXRob3V0QW5hbHlzaXMoKSB7XG4gICAgY29uc3Qgc2dmID0gYCgke3RoaXMubm9kZVRvU3RyaW5nKHRoaXMucm9vdCl9KWA7XG4gICAgcmV0dXJuIHJlcGxhY2Uoc2dmLCAvXShBXFxbLio/XFxdKS9nLCAnXScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlcyB0aGUgZ2l2ZW4gU0dGIChTbWFydCBHYW1lIEZvcm1hdCkgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gc2dmIC0gVGhlIFNHRiBzdHJpbmcgdG8gcGFyc2UuXG4gICAqL1xuICBwYXJzZShzZ2Y6IHN0cmluZykge1xuICAgIGlmICghc2dmKSByZXR1cm47XG4gICAgc2dmID0gc2dmLnJlcGxhY2UoL1xccysoPyFbXlxcW1xcXV0qXSkvZ20sICcnKTtcbiAgICBsZXQgbm9kZVN0YXJ0ID0gMDtcbiAgICBsZXQgY291bnRlciA9IDA7XG4gICAgY29uc3Qgc3RhY2s6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10gPSBbXTtcblxuICAgIGNvbnN0IGluTm9kZVJhbmdlcyA9IGJ1aWxkTm9kZVJhbmdlcyhzZ2YpLnNvcnQoKGEsIGIpID0+IGFbMF0gLSBiWzBdKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2dmLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjID0gc2dmW2ldO1xuICAgICAgY29uc3QgaW5zaWRlUHJvcCA9IGlzSW5BbnlSYW5nZShpLCBpbk5vZGVSYW5nZXMpO1xuXG4gICAgICBpZiAodGhpcy5OT0RFX0RFTElNSVRFUlMuaW5jbHVkZXMoYykgJiYgIWluc2lkZVByb3ApIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHNnZi5zbGljZShub2RlU3RhcnQsIGkpO1xuICAgICAgICBpZiAoY29udGVudCAhPT0gJycpIHtcbiAgICAgICAgICBjb25zdCBtb3ZlUHJvcHM6IE1vdmVQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBzZXR1cFByb3BzOiBTZXR1cFByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IHJvb3RQcm9wczogUm9vdFByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IG1hcmt1cFByb3BzOiBNYXJrdXBQcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBnYW1lSW5mb1Byb3BzOiBHYW1lSW5mb1Byb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IG5vZGVBbm5vdGF0aW9uUHJvcHM6IE5vZGVBbm5vdGF0aW9uUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgbW92ZUFubm90YXRpb25Qcm9wczogTW92ZUFubm90YXRpb25Qcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBjdXN0b21Qcm9wczogQ3VzdG9tUHJvcFtdID0gW107XG5cbiAgICAgICAgICBjb25zdCBtYXRjaGVzID0gW1xuICAgICAgICAgICAgLi4uY29udGVudC5tYXRjaEFsbChcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC8oW0EtWl0rXFxbW2EtelxcW1xcXV0qXFxdKykvLCAnZycpXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvKFtBLVpdK1xcWy4qP1xcXSspLywgJ2cnKVxuICAgICAgICAgICAgICAvLyBSZWdFeHAoL1tBLVpdKyhcXFsuKj9cXF0pezEsfS8sICdnJylcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC9bQS1aXSsoXFxbW1xcc1xcU10qP1xcXSl7MSx9LywgJ2cnKSxcbiAgICAgICAgICAgICAgUmVnRXhwKC9cXHcrKFxcW1teXFxdXSo/XFxdKD86XFxyP1xcbj9cXHNbXlxcXV0qPykqKXsxLH0vLCAnZycpXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF07XG5cbiAgICAgICAgICBtYXRjaGVzLmZvckVhY2gobSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbk1hdGNoID0gbVswXS5tYXRjaCgvKFtBLVpdKylcXFsvKTtcbiAgICAgICAgICAgIGlmICh0b2tlbk1hdGNoKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5NYXRjaFsxXTtcbiAgICAgICAgICAgICAgaWYgKE1PVkVfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG1vdmVQcm9wcy5wdXNoKE1vdmVQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChTRVRVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgc2V0dXBQcm9wcy5wdXNoKFNldHVwUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoUk9PVF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgcm9vdFByb3BzLnB1c2goUm9vdFByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE1BUktVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbWFya3VwUHJvcHMucHVzaChNYXJrdXBQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChHQU1FX0lORk9fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvUHJvcHMucHVzaChHYW1lSW5mb1Byb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcy5wdXNoKE5vZGVBbm5vdGF0aW9uUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBtb3ZlQW5ub3RhdGlvblByb3BzLnB1c2goTW92ZUFubm90YXRpb25Qcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChDVVNUT01fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIGN1c3RvbVByb3BzLnB1c2goQ3VzdG9tUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgaGFzaCA9IGNhbGNIYXNoKHRoaXMuY3VycmVudE5vZGUsIG1vdmVQcm9wcyk7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy50cmVlLnBhcnNlPFNnZk5vZGU+KHtcbiAgICAgICAgICAgICAgaWQ6IGhhc2gsXG4gICAgICAgICAgICAgIG5hbWU6IGhhc2gsXG4gICAgICAgICAgICAgIGluZGV4OiBjb3VudGVyLFxuICAgICAgICAgICAgICBudW1iZXI6IDAsXG4gICAgICAgICAgICAgIG1vdmVQcm9wcyxcbiAgICAgICAgICAgICAgc2V0dXBQcm9wcyxcbiAgICAgICAgICAgICAgcm9vdFByb3BzLFxuICAgICAgICAgICAgICBtYXJrdXBQcm9wcyxcbiAgICAgICAgICAgICAgZ2FtZUluZm9Qcm9wcyxcbiAgICAgICAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgICAgICAgY3VzdG9tUHJvcHMsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICAgICAgICBub2RlLm1vZGVsLm51bWJlciA9IGdldE5vZGVOdW1iZXIobm9kZSk7XG4gICAgICAgICAgICAgIC8vIFRPRE86IG1heWJlIHVubmVjZXNzYXJ5P1xuICAgICAgICAgICAgICBub2RlLm1vZGVsLmNoaWxkcmVuID0gW25vZGVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5yb290ID0gbm9kZTtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcoJyAmJiB0aGlzLmN1cnJlbnROb2RlICYmICFpbnNpZGVQcm9wKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3NnZltpXX0ke3NnZltpICsgMV19JHtzZ2ZbaSArIDJdfWApO1xuICAgICAgICBzdGFjay5wdXNoKHRoaXMuY3VycmVudE5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcpJyAmJiAhaW5zaWRlUHJvcCAmJiBzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5OT0RFX0RFTElNSVRFUlMuaW5jbHVkZXMoYykgJiYgIWluc2lkZVByb3ApIHtcbiAgICAgICAgbm9kZVN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBub2RlIHRvIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSAtIFRoZSBub2RlIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5vZGUuXG4gICAqL1xuICBwcml2YXRlIG5vZGVUb1N0cmluZyhub2RlOiBhbnkpIHtcbiAgICBsZXQgY29udGVudCA9ICcnO1xuICAgIG5vZGUud2FsaygobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcm9vdFByb3BzLFxuICAgICAgICBtb3ZlUHJvcHMsXG4gICAgICAgIGN1c3RvbVByb3BzLFxuICAgICAgICBzZXR1cFByb3BzLFxuICAgICAgICBtYXJrdXBQcm9wcyxcbiAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgZ2FtZUluZm9Qcm9wcyxcbiAgICAgIH0gPSBuLm1vZGVsO1xuICAgICAgY29uc3Qgbm9kZXMgPSBjb21wYWN0KFtcbiAgICAgICAgLi4ucm9vdFByb3BzLFxuICAgICAgICAuLi5jdXN0b21Qcm9wcyxcbiAgICAgICAgLi4ubW92ZVByb3BzLFxuICAgICAgICAuLi5nZXREZWR1cGxpY2F0ZWRQcm9wcyhzZXR1cFByb3BzKSxcbiAgICAgICAgLi4uZ2V0RGVkdXBsaWNhdGVkUHJvcHMobWFya3VwUHJvcHMpLFxuICAgICAgICAuLi5nYW1lSW5mb1Byb3BzLFxuICAgICAgICAuLi5ub2RlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICAuLi5tb3ZlQW5ub3RhdGlvblByb3BzLFxuICAgICAgXSk7XG4gICAgICBjb250ZW50ICs9ICc7JztcbiAgICAgIG5vZGVzLmZvckVhY2goKG46IFNnZlByb3BCYXNlKSA9PiB7XG4gICAgICAgIGNvbnRlbnQgKz0gbi50b1N0cmluZygpO1xuICAgICAgfSk7XG4gICAgICBpZiAobi5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgIG4uY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IFNnZlByb3BCYXNlKSA9PiB7XG4gICAgICAgICAgY29udGVudCArPSBgKCR7dGhpcy5ub2RlVG9TdHJpbmcoY2hpbGQpfSlgO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuLmNoaWxkcmVuLmxlbmd0aCA8IDI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbn1cbiIsImltcG9ydCBUcmVlTW9kZWwgZnJvbSAndHJlZS1tb2RlbCc7XG5pbXBvcnQge1xuICBjbG9uZURlZXAsXG4gIGZsYXR0ZW5EZXB0aCxcbiAgY2xvbmUsXG4gIHN1bSxcbiAgZmlsdGVyLFxuICBmaW5kTGFzdEluZGV4LFxuICBjb21wYWN0LFxuICBzYW1wbGUsXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1NnZk5vZGUsIFNnZk5vZGVPcHRpb25zLCBUTm9kZX0gZnJvbSAnLi9jb3JlL3R5cGVzJztcbmltcG9ydCB7XG4gIEExX0xFVFRFUlMsXG4gIEExX05VTUJFUlMsXG4gIFNHRl9MRVRURVJTLFxuICBNQVhfQk9BUkRfU0laRSxcbiAgTElHSFRfR1JFRU5fUkdCLFxuICBMSUdIVF9ZRUxMT1dfUkdCLFxuICBMSUdIVF9SRURfUkdCLFxuICBZRUxMT1dfUkdCLFxuICBERUZBVUxUX0JPQVJEX1NJWkUsXG59IGZyb20gJy4vY29uc3QnO1xuaW1wb3J0IHtcbiAgU2V0dXBQcm9wLFxuICBNb3ZlUHJvcCxcbiAgQ3VzdG9tUHJvcCxcbiAgU2dmUHJvcEJhc2UsXG4gIE5vZGVBbm5vdGF0aW9uUHJvcCxcbiAgR2FtZUluZm9Qcm9wLFxuICBNb3ZlQW5ub3RhdGlvblByb3AsXG4gIFJvb3RQcm9wLFxuICBNYXJrdXBQcm9wLFxuICBNT1ZFX1BST1BfTElTVCxcbiAgU0VUVVBfUFJPUF9MSVNULFxuICBOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBNT1ZFX0FOTk9UQVRJT05fUFJPUF9MSVNULFxuICBNQVJLVVBfUFJPUF9MSVNULFxuICBST09UX1BST1BfTElTVCxcbiAgR0FNRV9JTkZPX1BST1BfTElTVCxcbiAgVElNSU5HX1BST1BfTElTVCxcbiAgTUlTQ0VMTEFORU9VU19QUk9QX0xJU1QsXG4gIENVU1RPTV9QUk9QX0xJU1QsXG59IGZyb20gJy4vY29yZS9wcm9wcyc7XG5pbXBvcnQge1xuICBBbmFseXNpcyxcbiAgR2hvc3RCYW5PcHRpb25zLFxuICBLaSxcbiAgTW92ZUluZm8sXG4gIFByb2JsZW1BbnN3ZXJUeXBlIGFzIFBBVCxcbiAgUm9vdEluZm8sXG4gIE1hcmt1cCxcbiAgUGF0aERldGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICcuL3R5cGVzJztcblxuaW1wb3J0IHtDZW50ZXJ9IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQge2Nhbk1vdmUsIGV4ZWNDYXB0dXJlfSBmcm9tICcuL2JvYXJkY29yZSc7XG5leHBvcnQge2Nhbk1vdmUsIGV4ZWNDYXB0dXJlfTtcbi8vIGV4cG9ydCAqIGZyb20gJy4vYm9hcmRjb3JlJztcblxuLy8gZXM2IGltcG9ydCBzdHlsZSBzb21ldGltZXMgdHJpZ2dlciBlcnJvciAnZ2cvZ2hvc3RiYW4vYnVpbGQvaW5kZXguanNcIiBjb250YWlucyBhIHJlZmVyZW5jZSB0byB0aGUgZmlsZSBcImNyeXB0bydcbi8vIHVzZSByZXF1aXJlIGluc3RlYWRcbi8vIGltcG9ydCBzaGEyNTYgZnJvbSAnY3J5cHRvLWpzL3NoYTI1Nic7XG5jb25zdCBzaGEyNTYgPSByZXF1aXJlKCdjcnlwdG8tanMvc2hhMjU2Jyk7XG5jb25zdCBNRDUgPSByZXF1aXJlKCdjcnlwdG8tanMvTUQ1Jyk7XG5cbmltcG9ydCB7U2dmfSBmcm9tICcuL2NvcmUvc2dmJztcblxudHlwZSBTdHJhdGVneSA9ICdwb3N0JyB8ICdwcmUnIHwgJ2JvdGgnO1xuXG5leHBvcnQgY29uc3QgY2FsY0RvdWJ0ZnVsTW92ZXNUaHJlc2hvbGRSYW5nZSA9ICh0aHJlc2hvbGQ6IG51bWJlcikgPT4ge1xuICAvLyA4RC05RFxuICBpZiAodGhyZXNob2xkID49IDI1KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMTVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTNdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjE1LCAtMC4xXSwgc2NvcmVSYW5nZTogWy0zLCAtMl19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy0yLCAtMV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTEsIC0wLjVdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDVELTdEXG4gIGlmICh0aHJlc2hvbGQgPj0gMjMgJiYgdGhyZXNob2xkIDwgMjUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4yXSwgc2NvcmVSYW5nZTogWy0xMDAsIC04XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4yLCAtMC4xNV0sIHNjb3JlUmFuZ2U6IFstOCwgLTRdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xNSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTQsIC0yXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMiwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG5cbiAgLy8gM0QtNURcbiAgaWYgKHRocmVzaG9sZCA+PSAyMCAmJiB0aHJlc2hvbGQgPCAyMykge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjI1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0xMl19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMjUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTEyLCAtNV19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy01LCAtMl19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTIsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyAxRC0zRFxuICBpZiAodGhyZXNob2xkID49IDE4ICYmIHRocmVzaG9sZCA8IDIwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuM10sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMTVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjMsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTE1LCAtN119LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy03LCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1Sy0xS1xuICBpZiAodGhyZXNob2xkID49IDEzICYmIHRocmVzaG9sZCA8IDE4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMzVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTIwXX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zNSwgLTAuMTJdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xMiwgLTAuMDhdLCBzY29yZVJhbmdlOiBbLTEwLCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wOCwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1Sy0xMEtcbiAgaWYgKHRocmVzaG9sZCA+PSA4ICYmIHRocmVzaG9sZCA8IDEzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuNF0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMjVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjQsIC0wLjE1XSwgc2NvcmVSYW5nZTogWy0yNSwgLTEwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTEwLCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstNSwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDE4Sy0xMEtcbiAgaWYgKHRocmVzaG9sZCA+PSAwICYmIHRocmVzaG9sZCA8IDgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC40NV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMzVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjQ1LCAtMC4yXSwgc2NvcmVSYW5nZTogWy0zNSwgLTIwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMiwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMjAsIC0xMF19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMTAsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuM10sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMzBdfSxcbiAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zLCAtMC4yXSwgc2NvcmVSYW5nZTogWy0zMCwgLTIwXX0sXG4gICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjIsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0xMCwgLTFdfSxcbiAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kMiA9ICh2OiBudW1iZXIsIHNjYWxlID0gMSwgZml4ZWQgPSAyKSA9PiB7XG4gIHJldHVybiAoKE1hdGgucm91bmQodiAqIDEwMCkgLyAxMDApICogc2NhbGUpLnRvRml4ZWQoZml4ZWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kMyA9ICh2OiBudW1iZXIsIHNjYWxlID0gMSwgZml4ZWQgPSAzKSA9PiB7XG4gIHJldHVybiAoKE1hdGgucm91bmQodiAqIDEwMDApIC8gMTAwMCkgKiBzY2FsZSkudG9GaXhlZChmaXhlZCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RGVkdXBsaWNhdGVkUHJvcHMgPSAodGFyZ2V0UHJvcHM6IFNnZlByb3BCYXNlW10pID0+IHtcbiAgcmV0dXJuIGZpbHRlcihcbiAgICB0YXJnZXRQcm9wcyxcbiAgICAocHJvcDogU2dmUHJvcEJhc2UsIGluZGV4OiBudW1iZXIpID0+XG4gICAgICBpbmRleCA9PT1cbiAgICAgIGZpbmRMYXN0SW5kZXgoXG4gICAgICAgIHRhcmdldFByb3BzLFxuICAgICAgICAobGFzdFBybzogU2dmUHJvcEJhc2UpID0+XG4gICAgICAgICAgcHJvcC50b2tlbiA9PT0gbGFzdFByby50b2tlbiAmJiBwcm9wLnZhbHVlID09PSBsYXN0UHJvLnZhbHVlXG4gICAgICApXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNNb3ZlTm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICByZXR1cm4gbi5tb2RlbC5tb3ZlUHJvcHMubGVuZ3RoID4gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1Jvb3ROb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIHJldHVybiBuLm1vZGVsLnJvb3RQcm9wcy5sZW5ndGggPiAwIHx8IG4uaXNSb290KCk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNTZXR1cE5vZGUgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgcmV0dXJuIG4ubW9kZWwuc2V0dXBQcm9wcy5sZW5ndGggPiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQW5zd2VyTm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiwga2luZDogUEFUKSA9PiB7XG4gIGNvbnN0IHBhdCA9IG4ubW9kZWwuY3VzdG9tUHJvcHM/LmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQVQnKTtcbiAgcmV0dXJuIHBhdD8udmFsdWUgPT09IGtpbmQ7XG59O1xuXG5leHBvcnQgY29uc3QgaXNDaG9pY2VOb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnQ0hPSUNFJyk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNUYXJnZXROb2RlID0gaXNDaG9pY2VOb2RlO1xuXG5leHBvcnQgY29uc3QgaXNGb3JjZU5vZGUgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgY29uc3QgYyA9IG4ubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcz8uZmluZChcbiAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSAnQydcbiAgKTtcbiAgcmV0dXJuIGM/LnZhbHVlLmluY2x1ZGVzKCdGT1JDRScpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUHJldmVudE1vdmVOb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnTk9UVEhJUycpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzUmlnaHRMZWFmID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4vLyAgIHJldHVybiBpc1JpZ2h0Tm9kZShuKSAmJiAhbi5oYXNDaGlsZHJlbigpO1xuLy8gfTtcblxuZXhwb3J0IGNvbnN0IGlzUmlnaHROb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnUklHSFQnKTtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBpc0ZpcnN0UmlnaHRMZWFmID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4vLyAgIGNvbnN0IHJvb3QgPSBuLmdldFBhdGgoKVswXTtcbi8vICAgY29uc3QgZmlyc3RSaWdodExlYXZlID0gcm9vdC5maXJzdCgobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+XG4vLyAgICAgaXNSaWdodExlYWYobilcbi8vICAgKTtcbi8vICAgcmV0dXJuIGZpcnN0UmlnaHRMZWF2ZT8ubW9kZWwuaWQgPT09IG4ubW9kZWwuaWQ7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaXNGaXJzdFJpZ2h0Tm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICBjb25zdCByb290ID0gbi5nZXRQYXRoKClbMF07XG4gIGNvbnN0IGZpcnN0UmlnaHROb2RlID0gcm9vdC5maXJzdCgobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+XG4gICAgaXNSaWdodE5vZGUobilcbiAgKTtcbiAgcmV0dXJuIGZpcnN0UmlnaHROb2RlPy5tb2RlbC5pZCA9PT0gbi5tb2RlbC5pZDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ZhcmlhbnROb2RlID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGNvbnN0IGMgPSBuLm1vZGVsLm5vZGVBbm5vdGF0aW9uUHJvcHM/LmZpbmQoXG4gICAgKHA6IE5vZGVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gJ0MnXG4gICk7XG4gIHJldHVybiBjPy52YWx1ZS5pbmNsdWRlcygnVkFSSUFOVCcpO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IGlzVmFyaWFudExlYWYgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbi8vICAgcmV0dXJuIGlzVmFyaWFudE5vZGUobikgJiYgIW4uaGFzQ2hpbGRyZW4oKTtcbi8vIH07XG5cbmV4cG9ydCBjb25zdCBpc1dyb25nTm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICBjb25zdCBjID0gbi5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzPy5maW5kKFxuICAgIChwOiBOb2RlQW5ub3RhdGlvblByb3ApID0+IHAudG9rZW4gPT09ICdDJ1xuICApO1xuICByZXR1cm4gKCFjPy52YWx1ZS5pbmNsdWRlcygnVkFSSUFOVCcpICYmICFjPy52YWx1ZS5pbmNsdWRlcygnUklHSFQnKSkgfHwgIWM7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgaXNXcm9uZ0xlYWYgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbi8vICAgcmV0dXJuIGlzV3JvbmdOb2RlKG4pICYmICFuLmhhc0NoaWxkcmVuKCk7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgaW5QYXRoID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgZGV0ZWN0aW9uTWV0aG9kOiAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IGJvb2xlYW4sXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdLFxuICBwb3N0Tm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdXG4pID0+IHtcbiAgY29uc3QgcGF0aCA9IHByZU5vZGVzID8/IG5vZGUuZ2V0UGF0aCgpO1xuICBjb25zdCBwb3N0UmlnaHROb2RlcyA9XG4gICAgcG9zdE5vZGVzPy5maWx0ZXIoKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiBkZXRlY3Rpb25NZXRob2QobikpID8/XG4gICAgbm9kZS5hbGwoKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiBkZXRlY3Rpb25NZXRob2QobikpO1xuICBjb25zdCBwcmVSaWdodE5vZGVzID0gcGF0aC5maWx0ZXIoKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PlxuICAgIGRldGVjdGlvbk1ldGhvZChuKVxuICApO1xuXG4gIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0OlxuICAgICAgcmV0dXJuIHBvc3RSaWdodE5vZGVzLmxlbmd0aCA+IDA7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUHJlOlxuICAgICAgcmV0dXJuIHByZVJpZ2h0Tm9kZXMubGVuZ3RoID4gMDtcbiAgICBjYXNlIFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Cb3RoOlxuICAgICAgcmV0dXJuIHByZVJpZ2h0Tm9kZXMubGVuZ3RoID4gMCB8fCBwb3N0UmlnaHROb2Rlcy5sZW5ndGggPiAwO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpblJpZ2h0UGF0aCA9IChcbiAgbm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkXG4pID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc1JpZ2h0Tm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGluRmlyc3RSaWdodFBhdGggPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlBvc3QsXG4gIHByZU5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZCxcbiAgcG9zdE5vZGVzPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5bXSB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpblBhdGgobm9kZSwgaXNGaXJzdFJpZ2h0Tm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGluRmlyc3RCcmFuY2hSaWdodFBhdGggPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBzdHJhdGVneTogUGF0aERldGVjdGlvblN0cmF0ZWd5ID0gUGF0aERldGVjdGlvblN0cmF0ZWd5LlByZSxcbiAgcHJlTm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgaWYgKCFpblJpZ2h0UGF0aChub2RlKSkgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IHBhdGggPSBwcmVOb2RlcyA/PyBub2RlLmdldFBhdGgoKTtcbiAgY29uc3QgcG9zdFJpZ2h0Tm9kZXMgPSBwb3N0Tm9kZXMgPz8gbm9kZS5hbGwoKCkgPT4gdHJ1ZSk7XG5cbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdDpcbiAgICAgIHJlc3VsdCA9IHBvc3RSaWdodE5vZGVzLmZpbHRlcihuID0+IG4uZ2V0SW5kZXgoKSA+IDApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUHJlOlxuICAgICAgcmVzdWx0ID0gcGF0aC5maWx0ZXIobiA9PiBuLmdldEluZGV4KCkgPiAwKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUGF0aERldGVjdGlvblN0cmF0ZWd5LkJvdGg6XG4gICAgICByZXN1bHQgPSBwYXRoLmNvbmNhdChwb3N0UmlnaHROb2RlcykuZmlsdGVyKG4gPT4gbi5nZXRJbmRleCgpID4gMCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQubGVuZ3RoID09PSAwO1xufTtcblxuZXhwb3J0IGNvbnN0IGluQ2hvaWNlUGF0aCA9IChcbiAgbm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc0Nob2ljZU5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpblRhcmdldFBhdGggPSBpbkNob2ljZVBhdGg7XG5cbmV4cG9ydCBjb25zdCBpblZhcmlhbnRQYXRoID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgc3RyYXRlZ3k6IFBhdGhEZXRlY3Rpb25TdHJhdGVneSA9IFBhdGhEZXRlY3Rpb25TdHJhdGVneS5Qb3N0LFxuICBwcmVOb2Rlcz86IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10gfCB1bmRlZmluZWQsXG4gIHBvc3ROb2Rlcz86IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gaW5QYXRoKG5vZGUsIGlzVmFyaWFudE5vZGUsIHN0cmF0ZWd5LCBwcmVOb2RlcywgcG9zdE5vZGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbldyb25nUGF0aCA9IChcbiAgbm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIHN0cmF0ZWd5OiBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kgPSBQYXRoRGV0ZWN0aW9uU3RyYXRlZ3kuUG9zdCxcbiAgcHJlTm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkLFxuICBwb3N0Tm9kZXM/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdIHwgdW5kZWZpbmVkXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGluUGF0aChub2RlLCBpc1dyb25nTm9kZSwgc3RyYXRlZ3ksIHByZU5vZGVzLCBwb3N0Tm9kZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5vZGVOdW1iZXIgPSAoXG4gIG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBwYXJlbnQ/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPlxuKSA9PiB7XG4gIGNvbnN0IHBhdGggPSBuLmdldFBhdGgoKTtcbiAgbGV0IG1vdmVzQ291bnQgPSBwYXRoLmZpbHRlcihuID0+IGlzTW92ZU5vZGUobikpLmxlbmd0aDtcbiAgaWYgKHBhcmVudCkge1xuICAgIG1vdmVzQ291bnQgKz0gcGFyZW50LmdldFBhdGgoKS5maWx0ZXIobiA9PiBpc01vdmVOb2RlKG4pKS5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIG1vdmVzQ291bnQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0hhc2ggPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgbW92ZVByb3BzOiBNb3ZlUHJvcFtdID0gW11cbikgPT4ge1xuICBsZXQgZnVsbG5hbWUgPSAnbic7XG4gIGlmIChtb3ZlUHJvcHMubGVuZ3RoID4gMCkge1xuICAgIGZ1bGxuYW1lICs9IGAke21vdmVQcm9wc1swXS50b2tlbn0ke21vdmVQcm9wc1swXS52YWx1ZX1gO1xuICB9XG5cbiAgaWYgKG5vZGUpIHtcbiAgICBjb25zdCBwYXRoID0gbm9kZS5nZXRQYXRoKCk7XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICBmdWxsbmFtZSA9XG4gICAgICAgIHBhdGgubWFwKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4gbi5tb2RlbC5pZCkuam9pbignPT4nKSArXG4gICAgICAgIGA9PiR7ZnVsbG5hbWV9YDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYXNoID0gTUQ1KGZ1bGxuYW1lKS50b1N0cmluZygpLnNsaWNlKDAsIDYpO1xuICByZXR1cm4gaGFzaDtcbn07XG5cbmV4cG9ydCBjb25zdCBfX2NhbGNTSEFfRGVwcmVjYXRlZCA9IChcbiAgbm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICBtb3ZlUHJvcHM6IGFueSA9IFtdLFxuICBzZXR1cFByb3BzOiBhbnkgPSBbXVxuKSA9PiB7XG4gIGxldCBub2RlVHlwZSA9ICdyJztcbiAgaWYgKG1vdmVQcm9wcy5sZW5ndGggPiAwKSBub2RlVHlwZSA9ICdtJztcbiAgaWYgKHNldHVwUHJvcHMubGVuZ3RoID4gMCkgbm9kZVR5cGUgPSAncyc7XG5cbiAgbGV0IG4gPSBgJHtub2RlVHlwZX1gO1xuICBpZiAobW92ZVByb3BzLmxlbmd0aCA+IDApIG4gKz0gYCR7bW92ZVByb3BzWzBdLnRva2VufSR7bW92ZVByb3BzWzBdLnZhbHVlfWA7XG5cbiAgbGV0IGZ1bGxuYW1lID0gbjtcbiAgaWYgKG5vZGUpIHtcbiAgICBmdWxsbmFtZSA9XG4gICAgICBub2RlXG4gICAgICAgIC5nZXRQYXRoKClcbiAgICAgICAgLm1hcCgobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IG4ubW9kZWwuaWQpXG4gICAgICAgIC5qb2luKCc9PicpICtcbiAgICAgICc9PicgK1xuICAgICAgbjtcbiAgfVxuXG4gIGNvbnN0IHNoYSA9IHNoYTI1NihmdWxsbmFtZSkudG9TdHJpbmcoKS5zbGljZSgwLCA2KTtcbiAgcmV0dXJuIHNoYTtcbn07XG5cbmV4cG9ydCBjb25zdCBuRm9ybWF0dGVyID0gKG51bTogbnVtYmVyLCBmaXhlZCA9IDEpID0+IHtcbiAgY29uc3QgbG9va3VwID0gW1xuICAgIHt2YWx1ZTogMSwgc3ltYm9sOiAnJ30sXG4gICAge3ZhbHVlOiAxZTMsIHN5bWJvbDogJ2snfSxcbiAgICB7dmFsdWU6IDFlNiwgc3ltYm9sOiAnTSd9LFxuICAgIHt2YWx1ZTogMWU5LCBzeW1ib2w6ICdHJ30sXG4gICAge3ZhbHVlOiAxZTEyLCBzeW1ib2w6ICdUJ30sXG4gICAge3ZhbHVlOiAxZTE1LCBzeW1ib2w6ICdQJ30sXG4gICAge3ZhbHVlOiAxZTE4LCBzeW1ib2w6ICdFJ30sXG4gIF07XG4gIGNvbnN0IHJ4ID0gL1xcLjArJHwoXFwuWzAtOV0qWzEtOV0pMCskLztcbiAgY29uc3QgaXRlbSA9IGxvb2t1cFxuICAgIC5zbGljZSgpXG4gICAgLnJldmVyc2UoKVxuICAgIC5maW5kKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIG51bSA+PSBpdGVtLnZhbHVlO1xuICAgIH0pO1xuICByZXR1cm4gaXRlbVxuICAgID8gKG51bSAvIGl0ZW0udmFsdWUpLnRvRml4ZWQoZml4ZWQpLnJlcGxhY2UocngsICckMScpICsgaXRlbS5zeW1ib2xcbiAgICA6ICcwJztcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9JbmRleGVzID0gKHBhdGg6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10pOiBudW1iZXJbXSA9PiB7XG4gIHJldHVybiBwYXRoLm1hcChuID0+IG4ubW9kZWwuaWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhdGhUb0luaXRpYWxTdG9uZXMgPSAoXG4gIHBhdGg6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10sXG4gIHhPZmZzZXQgPSAwLFxuICB5T2Zmc2V0ID0gMFxuKTogc3RyaW5nW11bXSA9PiB7XG4gIGNvbnN0IGluaXRzID0gcGF0aFxuICAgIC5maWx0ZXIobiA9PiBuLm1vZGVsLnNldHVwUHJvcHMubGVuZ3RoID4gMClcbiAgICAubWFwKG4gPT4ge1xuICAgICAgcmV0dXJuIG4ubW9kZWwuc2V0dXBQcm9wcy5tYXAoKHNldHVwOiBTZXR1cFByb3ApID0+IHtcbiAgICAgICAgcmV0dXJuIHNldHVwLnZhbHVlcy5tYXAoKHY6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IGEgPSBBMV9MRVRURVJTW1NHRl9MRVRURVJTLmluZGV4T2YodlswXSkgKyB4T2Zmc2V0XTtcbiAgICAgICAgICBjb25zdCBiID0gQTFfTlVNQkVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHZbMV0pICsgeU9mZnNldF07XG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBzZXR1cC50b2tlbiA9PT0gJ0FCJyA/ICdCJyA6ICdXJztcbiAgICAgICAgICByZXR1cm4gW3Rva2VuLCBhICsgYl07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIHJldHVybiBmbGF0dGVuRGVwdGgoaW5pdHNbMF0sIDEpO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhdGhUb0FpTW92ZXMgPSAoXG4gIHBhdGg6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+W10sXG4gIHhPZmZzZXQgPSAwLFxuICB5T2Zmc2V0ID0gMFxuKSA9PiB7XG4gIGNvbnN0IG1vdmVzID0gcGF0aFxuICAgIC5maWx0ZXIobiA9PiBuLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPiAwKVxuICAgIC5tYXAobiA9PiB7XG4gICAgICBjb25zdCBwcm9wID0gbi5tb2RlbC5tb3ZlUHJvcHNbMF07XG4gICAgICBjb25zdCBhID0gQTFfTEVUVEVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHByb3AudmFsdWVbMF0pICsgeE9mZnNldF07XG4gICAgICBjb25zdCBiID0gQTFfTlVNQkVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHByb3AudmFsdWVbMV0pICsgeU9mZnNldF07XG4gICAgICByZXR1cm4gW3Byb3AudG9rZW4sIGEgKyBiXTtcbiAgICB9KTtcbiAgcmV0dXJuIG1vdmVzO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4RnJvbUFuYWx5c2lzID0gKGE6IEFuYWx5c2lzKSA9PiB7XG4gIGlmICgvaW5kZXhlcy8udGVzdChhLmlkKSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGEuaWQpLmluZGV4ZXNbMF07XG4gIH1cbiAgcmV0dXJuICcnO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTWFpblBhdGggPSAobm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgcmV0dXJuIHN1bShub2RlLmdldFBhdGgoKS5tYXAobiA9PiBuLmdldEluZGV4KCkpKSA9PT0gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZUb1BvcyA9IChzdHI6IHN0cmluZykgPT4ge1xuICBjb25zdCBraSA9IHN0clswXSA9PT0gJ0InID8gMSA6IC0xO1xuICBjb25zdCB0ZW1wU3RyID0gL1xcWyguKilcXF0vLmV4ZWMoc3RyKTtcbiAgaWYgKHRlbXBTdHIpIHtcbiAgICBjb25zdCBwb3MgPSB0ZW1wU3RyWzFdO1xuICAgIGNvbnN0IHggPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1swXSk7XG4gICAgY29uc3QgeSA9IFNHRl9MRVRURVJTLmluZGV4T2YocG9zWzFdKTtcbiAgICByZXR1cm4ge3gsIHksIGtpfTtcbiAgfVxuICByZXR1cm4ge3g6IC0xLCB5OiAtMSwga2k6IDB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHNnZlRvQTEgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qge3gsIHl9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgcmV0dXJuIEExX0xFVFRFUlNbeF0gKyBBMV9OVU1CRVJTW3ldO1xufTtcblxuZXhwb3J0IGNvbnN0IGExVG9Qb3MgPSAobW92ZTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHggPSBBMV9MRVRURVJTLmluZGV4T2YobW92ZVswXSk7XG4gIGNvbnN0IHkgPSBBMV9OVU1CRVJTLmluZGV4T2YocGFyc2VJbnQobW92ZS5zdWJzdHIoMSksIDApKTtcbiAgcmV0dXJuIHt4LCB5fTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvSW5kZXggPSAobW92ZTogc3RyaW5nLCBib2FyZFNpemUgPSAxOSkgPT4ge1xuICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pO1xuICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSk7XG4gIHJldHVybiB4ICogYm9hcmRTaXplICsgeTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZPZmZzZXQgPSAoc2dmOiBhbnksIG9mZnNldCA9IDApID0+IHtcbiAgaWYgKG9mZnNldCA9PT0gMCkgcmV0dXJuIHNnZjtcbiAgY29uc3QgcmVzID0gY2xvbmUoc2dmKTtcbiAgY29uc3QgY2hhckluZGV4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihzZ2ZbMl0pIC0gb2Zmc2V0O1xuICByZXR1cm4gcmVzLnN1YnN0cigwLCAyKSArIFNHRl9MRVRURVJTW2NoYXJJbmRleF0gKyByZXMuc3Vic3RyKDIgKyAxKTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvU0dGID0gKHN0cjogYW55LCB0eXBlID0gJ0InLCBvZmZzZXRYID0gMCwgb2Zmc2V0WSA9IDApID0+IHtcbiAgaWYgKHN0ciA9PT0gJ3Bhc3MnKSByZXR1cm4gYCR7dHlwZX1bXWA7XG4gIGNvbnN0IGlueCA9IEExX0xFVFRFUlMuaW5kZXhPZihzdHJbMF0pICsgb2Zmc2V0WDtcbiAgY29uc3QgaW55ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KHN0ci5zdWJzdHIoMSksIDApKSArIG9mZnNldFk7XG4gIGNvbnN0IHNnZiA9IGAke3R5cGV9WyR7U0dGX0xFVFRFUlNbaW54XX0ke1NHRl9MRVRURVJTW2lueV19XWA7XG4gIHJldHVybiBzZ2Y7XG59O1xuXG5leHBvcnQgY29uc3QgcG9zVG9TZ2YgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpID0+IHtcbiAgY29uc3QgYXggPSBTR0ZfTEVUVEVSU1t4XTtcbiAgY29uc3QgYXkgPSBTR0ZfTEVUVEVSU1t5XTtcbiAgaWYgKGtpID09PSAwKSByZXR1cm4gJyc7XG4gIGlmIChraSA9PT0gMSkgcmV0dXJuIGBCWyR7YXh9JHtheX1dYDtcbiAgaWYgKGtpID09PSAtMSkgcmV0dXJuIGBXWyR7YXh9JHtheX1dYDtcbiAgcmV0dXJuICcnO1xufTtcblxuZXhwb3J0IGNvbnN0IG1hdFRvUG9zaXRpb24gPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgeE9mZnNldD86IG51bWJlcixcbiAgeU9mZnNldD86IG51bWJlclxuKSA9PiB7XG4gIGxldCByZXN1bHQgPSAnJztcbiAgeE9mZnNldCA9IHhPZmZzZXQgPz8gMDtcbiAgeU9mZnNldCA9IHlPZmZzZXQgPz8gREVGQVVMVF9CT0FSRF9TSVpFIC0gbWF0Lmxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBtYXRbaV1bal07XG4gICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgY29uc3QgeCA9IEExX0xFVFRFUlNbaSArIHhPZmZzZXRdO1xuICAgICAgICBjb25zdCB5ID0gQTFfTlVNQkVSU1tqICsgeU9mZnNldF07XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdmFsdWUgPT09IDEgPyAnYicgOiAndyc7XG4gICAgICAgIHJlc3VsdCArPSBgJHtjb2xvcn0gJHt4fSR7eX0gYDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBtYXRUb0xpc3RPZlR1cGxlcyA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICB4T2Zmc2V0ID0gMCxcbiAgeU9mZnNldCA9IDBcbikgPT4ge1xuICBjb25zdCByZXN1bHRzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IHggPSBBMV9MRVRURVJTW2kgKyB4T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgeSA9IEExX05VTUJFUlNbaiArIHlPZmZzZXRdO1xuICAgICAgICBjb25zdCBjb2xvciA9IHZhbHVlID09PSAxID8gJ0InIDogJ1cnO1xuICAgICAgICByZXN1bHRzLnB1c2goW2NvbG9yLCB4ICsgeV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbmV4cG9ydCBjb25zdCBjb252ZXJ0U3RvbmVUeXBlVG9TdHJpbmcgPSAodHlwZTogYW55KSA9PiAodHlwZSA9PT0gMSA/ICdCJyA6ICdXJyk7XG5cbmV4cG9ydCBjb25zdCBjb252ZXJ0U3RlcHNGb3JBSSA9IChzdGVwczogYW55LCBvZmZzZXQgPSAwKSA9PiB7XG4gIGxldCByZXMgPSBjbG9uZShzdGVwcyk7XG4gIHJlcyA9IHJlcy5tYXAoKHM6IGFueSkgPT4gc2dmT2Zmc2V0KHMsIG9mZnNldCkpO1xuICBjb25zdCBoZWFkZXIgPSBgKDtGRls0XUdNWzFdU1pbJHtcbiAgICAxOSAtIG9mZnNldFxuICB9XUdOWzIyNl1QQltCbGFja11IQVswXVBXW1doaXRlXUtNWzcuNV1EVFsyMDE3LTA4LTAxXVRNWzE4MDBdUlVbQ2hpbmVzZV1DUFtDb3B5cmlnaHQgZ2hvc3QtZ28uY29tXUFQW2dob3N0LWdvLmNvbV1QTFtCbGFja107YDtcbiAgbGV0IGNvdW50ID0gMDtcbiAgbGV0IHByZXYgPSAnJztcbiAgc3RlcHMuZm9yRWFjaCgoc3RlcDogYW55LCBpbmRleDogYW55KSA9PiB7XG4gICAgaWYgKHN0ZXBbMF0gPT09IHByZXZbMF0pIHtcbiAgICAgIGlmIChzdGVwWzBdID09PSAnQicpIHtcbiAgICAgICAgcmVzLnNwbGljZShpbmRleCArIGNvdW50LCAwLCAnV1t0dF0nKTtcbiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5zcGxpY2UoaW5kZXggKyBjb3VudCwgMCwgJ0JbdHRdJyk7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHByZXYgPSBzdGVwO1xuICB9KTtcbiAgcmV0dXJuIGAke2hlYWRlcn0ke3Jlcy5qb2luKCc7Jyl9KWA7XG59O1xuXG5leHBvcnQgY29uc3Qgb2Zmc2V0QTFNb3ZlID0gKG1vdmU6IHN0cmluZywgb3ggPSAwLCBveSA9IDApID0+IHtcbiAgaWYgKG1vdmUgPT09ICdwYXNzJykgcmV0dXJuIG1vdmU7XG4gIC8vIGNvbnNvbGUubG9nKCdveHknLCBveCwgb3kpO1xuICBjb25zdCBpbnggPSBBMV9MRVRURVJTLmluZGV4T2YobW92ZVswXSkgKyBveDtcbiAgY29uc3QgaW55ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSkgKyBveTtcbiAgLy8gY29uc29sZS5sb2coJ2lueHknLCBpbngsIGlueSwgYCR7QTFfTEVUVEVSU1tpbnhdfSR7QTFfTlVNQkVSU1tpbnldfWApO1xuICByZXR1cm4gYCR7QTFfTEVUVEVSU1tpbnhdfSR7QTFfTlVNQkVSU1tpbnldfWA7XG59O1xuXG5leHBvcnQgY29uc3QgcmV2ZXJzZU9mZnNldEExTW92ZSA9IChcbiAgbW92ZTogc3RyaW5nLFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGFuYWx5c2lzOiBBbmFseXNpcyxcbiAgYm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBpZiAobW92ZSA9PT0gJ3Bhc3MnKSByZXR1cm4gbW92ZTtcbiAgY29uc3QgaWRPYmogPSBKU09OLnBhcnNlKGFuYWx5c2lzLmlkKTtcbiAgY29uc3Qge3gsIHl9ID0gcmV2ZXJzZU9mZnNldChtYXQsIGlkT2JqLmJ4LCBpZE9iai5ieSwgYm9hcmRTaXplKTtcbiAgY29uc3QgaW54ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pICsgeDtcbiAgY29uc3QgaW55ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSkgKyB5O1xuICByZXR1cm4gYCR7QTFfTEVUVEVSU1tpbnhdfSR7QTFfTlVNQkVSU1tpbnldfWA7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1Njb3JlRGlmZlRleHQgPSAoXG4gIHJvb3RJbmZvPzogUm9vdEluZm8gfCBudWxsLFxuICBjdXJySW5mbz86IE1vdmVJbmZvIHwgUm9vdEluZm8gfCBudWxsLFxuICBmaXhlZCA9IDEsXG4gIHJldmVyc2UgPSBmYWxzZVxuKSA9PiB7XG4gIGlmICghcm9vdEluZm8gfHwgIWN1cnJJbmZvKSByZXR1cm4gJyc7XG4gIGxldCBzY29yZSA9IGNhbGNTY29yZURpZmYocm9vdEluZm8sIGN1cnJJbmZvKTtcbiAgaWYgKHJldmVyc2UpIHNjb3JlID0gLXNjb3JlO1xuICBjb25zdCBmaXhlZFNjb3JlID0gc2NvcmUudG9GaXhlZChmaXhlZCk7XG5cbiAgcmV0dXJuIHNjb3JlID4gMCA/IGArJHtmaXhlZFNjb3JlfWAgOiBgJHtmaXhlZFNjb3JlfWA7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1dpbnJhdGVEaWZmVGV4dCA9IChcbiAgcm9vdEluZm8/OiBSb290SW5mbyB8IG51bGwsXG4gIGN1cnJJbmZvPzogTW92ZUluZm8gfCBSb290SW5mbyB8IG51bGwsXG4gIGZpeGVkID0gMSxcbiAgcmV2ZXJzZSA9IGZhbHNlXG4pID0+IHtcbiAgaWYgKCFyb290SW5mbyB8fCAhY3VyckluZm8pIHJldHVybiAnJztcbiAgbGV0IHdpbnJhdGUgPSBjYWxjV2lucmF0ZURpZmYocm9vdEluZm8sIGN1cnJJbmZvKTtcbiAgaWYgKHJldmVyc2UpIHdpbnJhdGUgPSAtd2lucmF0ZTtcbiAgY29uc3QgZml4ZWRXaW5yYXRlID0gd2lucmF0ZS50b0ZpeGVkKGZpeGVkKTtcblxuICByZXR1cm4gd2lucmF0ZSA+PSAwID8gYCske2ZpeGVkV2lucmF0ZX0lYCA6IGAke2ZpeGVkV2lucmF0ZX0lYDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjU2NvcmVEaWZmID0gKFxuICByb290SW5mbzogUm9vdEluZm8sXG4gIGN1cnJJbmZvOiBNb3ZlSW5mbyB8IFJvb3RJbmZvXG4pID0+IHtcbiAgY29uc3Qgc2lnbiA9IHJvb3RJbmZvLmN1cnJlbnRQbGF5ZXIgPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3Qgc2NvcmUgPVxuICAgIE1hdGgucm91bmQoKGN1cnJJbmZvLnNjb3JlTGVhZCAtIHJvb3RJbmZvLnNjb3JlTGVhZCkgKiBzaWduICogMTAwMCkgLyAxMDAwO1xuXG4gIHJldHVybiBzY29yZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjV2lucmF0ZURpZmYgPSAoXG4gIHJvb3RJbmZvOiBSb290SW5mbyxcbiAgY3VyckluZm86IE1vdmVJbmZvIHwgUm9vdEluZm9cbikgPT4ge1xuICBjb25zdCBzaWduID0gcm9vdEluZm8uY3VycmVudFBsYXllciA9PT0gJ0InID8gMSA6IC0xO1xuICBjb25zdCBzY29yZSA9XG4gICAgTWF0aC5yb3VuZCgoY3VyckluZm8ud2lucmF0ZSAtIHJvb3RJbmZvLndpbnJhdGUpICogc2lnbiAqIDEwMDAgKiAxMDApIC9cbiAgICAxMDAwO1xuXG4gIHJldHVybiBzY29yZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQW5hbHlzaXNQb2ludENvbG9yID0gKFxuICByb290SW5mbzogUm9vdEluZm8sXG4gIG1vdmVJbmZvOiBNb3ZlSW5mb1xuKSA9PiB7XG4gIGNvbnN0IHtwcmlvciwgb3JkZXJ9ID0gbW92ZUluZm87XG4gIGNvbnN0IHNjb3JlID0gY2FsY1Njb3JlRGlmZihyb290SW5mbywgbW92ZUluZm8pO1xuICBsZXQgcG9pbnRDb2xvciA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSknO1xuICBpZiAoXG4gICAgcHJpb3IgPj0gMC41IHx8XG4gICAgKHByaW9yID49IDAuMSAmJiBvcmRlciA8IDMgJiYgc2NvcmUgPiAtMC4zKSB8fFxuICAgIG9yZGVyID09PSAwIHx8XG4gICAgc2NvcmUgPj0gMFxuICApIHtcbiAgICBwb2ludENvbG9yID0gTElHSFRfR1JFRU5fUkdCO1xuICB9IGVsc2UgaWYgKChwcmlvciA+IDAuMDUgJiYgc2NvcmUgPiAtMC41KSB8fCAocHJpb3IgPiAwLjAxICYmIHNjb3JlID4gLTAuMSkpIHtcbiAgICBwb2ludENvbG9yID0gTElHSFRfWUVMTE9XX1JHQjtcbiAgfSBlbHNlIGlmIChwcmlvciA+IDAuMDEgJiYgc2NvcmUgPiAtMSkge1xuICAgIHBvaW50Q29sb3IgPSBZRUxMT1dfUkdCO1xuICB9IGVsc2Uge1xuICAgIHBvaW50Q29sb3IgPSBMSUdIVF9SRURfUkdCO1xuICB9XG4gIHJldHVybiBwb2ludENvbG9yO1xufTtcblxuLy8gZXhwb3J0IGNvbnN0IEdvQmFuRGV0ZWN0aW9uID0gKHBpeGVsRGF0YSwgY2FudmFzKSA9PiB7XG4vLyBjb25zdCBjb2x1bW5zID0gY2FudmFzLndpZHRoO1xuLy8gY29uc3Qgcm93cyA9IGNhbnZhcy5oZWlnaHQ7XG4vLyBjb25zdCBkYXRhVHlwZSA9IEpzRmVhdC5VOEMxX3Q7XG4vLyBjb25zdCBkaXN0TWF0cml4VCA9IG5ldyBKc0ZlYXQubWF0cml4X3QoY29sdW1ucywgcm93cywgZGF0YVR5cGUpO1xuLy8gSnNGZWF0LmltZ3Byb2MuZ3JheXNjYWxlKHBpeGVsRGF0YSwgY29sdW1ucywgcm93cywgZGlzdE1hdHJpeFQpO1xuLy8gSnNGZWF0LmltZ3Byb2MuZ2F1c3NpYW5fYmx1cihkaXN0TWF0cml4VCwgZGlzdE1hdHJpeFQsIDIsIDApO1xuLy8gSnNGZWF0LmltZ3Byb2MuY2FubnkoZGlzdE1hdHJpeFQsIGRpc3RNYXRyaXhULCA1MCwgNTApO1xuXG4vLyBjb25zdCBuZXdQaXhlbERhdGEgPSBuZXcgVWludDMyQXJyYXkocGl4ZWxEYXRhLmJ1ZmZlcik7XG4vLyBjb25zdCBhbHBoYSA9ICgweGZmIDw8IDI0KTtcbi8vIGxldCBpID0gZGlzdE1hdHJpeFQuY29scyAqIGRpc3RNYXRyaXhULnJvd3M7XG4vLyBsZXQgcGl4ID0gMDtcbi8vIHdoaWxlIChpID49IDApIHtcbi8vICAgcGl4ID0gZGlzdE1hdHJpeFQuZGF0YVtpXTtcbi8vICAgbmV3UGl4ZWxEYXRhW2ldID0gYWxwaGEgfCAocGl4IDw8IDE2KSB8IChwaXggPDwgOCkgfCBwaXg7XG4vLyAgIGkgLT0gMTtcbi8vIH1cbi8vIH07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0UEFJID0gKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGNvbnN0IHBhaSA9IG4ubW9kZWwuY3VzdG9tUHJvcHMuZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BBSScpO1xuICBpZiAoIXBhaSkgcmV0dXJuO1xuICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShwYWkudmFsdWUpO1xuXG4gIHJldHVybiBkYXRhO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RBbnN3ZXJUeXBlID0gKFxuICBuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPlxuKTogUEFUIHwgdW5kZWZpbmVkID0+IHtcbiAgY29uc3QgcGF0ID0gbi5tb2RlbC5jdXN0b21Qcm9wcy5maW5kKChwOiBDdXN0b21Qcm9wKSA9PiBwLnRva2VuID09PSAnUEFUJyk7XG4gIHJldHVybiBwYXQ/LnZhbHVlO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RQSSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICBjb25zdCBwaSA9IG4ubW9kZWwuY3VzdG9tUHJvcHMuZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BJJyk7XG4gIGlmICghcGkpIHJldHVybjtcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocGkudmFsdWUpO1xuXG4gIHJldHVybiBkYXRhO1xufTtcblxuZXhwb3J0IGNvbnN0IGluaXROb2RlRGF0YSA9IChzaGE6IHN0cmluZywgbnVtYmVyPzogbnVtYmVyKTogU2dmTm9kZSA9PiB7XG4gIHJldHVybiB7XG4gICAgaWQ6IHNoYSxcbiAgICBuYW1lOiBzaGEsXG4gICAgbnVtYmVyOiBudW1iZXIgfHwgMCxcbiAgICByb290UHJvcHM6IFtdLFxuICAgIG1vdmVQcm9wczogW10sXG4gICAgc2V0dXBQcm9wczogW10sXG4gICAgbWFya3VwUHJvcHM6IFtdLFxuICAgIGdhbWVJbmZvUHJvcHM6IFtdLFxuICAgIG5vZGVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIG1vdmVBbm5vdGF0aW9uUHJvcHM6IFtdLFxuICAgIGN1c3RvbVByb3BzOiBbXSxcbiAgfTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgaW5pdGlhbCByb290IG5vZGUgb2YgdGhlIHRyZWUuXG4gKlxuICogQHBhcmFtIHJvb3RQcm9wcyAtIFRoZSByb290IHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyBUaGUgaW5pdGlhbCByb290IG5vZGUuXG4gKi9cbmV4cG9ydCBjb25zdCBpbml0aWFsUm9vdE5vZGUgPSAoXG4gIHJvb3RQcm9wcyA9IFtcbiAgICAnRkZbNF0nLFxuICAgICdHTVsxXScsXG4gICAgJ0NBW1VURi04XScsXG4gICAgJ0FQW2dob3N0Z286MC4xLjBdJyxcbiAgICAnU1pbMTldJyxcbiAgICAnU1RbMF0nLFxuICBdXG4pID0+IHtcbiAgY29uc3QgdHJlZTogVHJlZU1vZGVsID0gbmV3IFRyZWVNb2RlbCgpO1xuICBjb25zdCByb290ID0gdHJlZS5wYXJzZSh7XG4gICAgLy8gJzFiMTZiMScgaXMgdGhlIFNIQTI1NiBoYXNoIG9mIHRoZSAnbidcbiAgICBuYW1lOiAwLFxuICAgIGluZGV4OiAwLFxuICAgIG51bWJlcjogMCxcbiAgICByb290UHJvcHM6IHJvb3RQcm9wcy5tYXAocCA9PiBSb290UHJvcC5mcm9tKHApKSxcbiAgICBtb3ZlUHJvcHM6IFtdLFxuICAgIHNldHVwUHJvcHM6IFtdLFxuICAgIG1hcmt1cFByb3BzOiBbXSxcbiAgICBnYW1lSW5mb1Byb3BzOiBbXSxcbiAgICBub2RlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBtb3ZlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBjdXN0b21Qcm9wczogW10sXG4gIH0pO1xuICBjb25zdCBoYXNoID0gY2FsY0hhc2gocm9vdCk7XG4gIHJvb3QubW9kZWwuaWQgPSBoYXNoO1xuXG4gIHJldHVybiByb290O1xufTtcblxuLyoqXG4gKiBCdWlsZHMgYSBuZXcgdHJlZSBub2RlIHdpdGggdGhlIGdpdmVuIG1vdmUsIHBhcmVudCBub2RlLCBhbmQgYWRkaXRpb25hbCBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSBtb3ZlIC0gVGhlIG1vdmUgdG8gYmUgYWRkZWQgdG8gdGhlIG5vZGUuXG4gKiBAcGFyYW0gcGFyZW50Tm9kZSAtIFRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgbmV3IG5vZGUuIE9wdGlvbmFsLlxuICogQHBhcmFtIHByb3BzIC0gQWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRvIGJlIGFkZGVkIHRvIHRoZSBuZXcgbm9kZS4gT3B0aW9uYWwuXG4gKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCB0cmVlIG5vZGUuXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZE1vdmVOb2RlID0gKFxuICBtb3ZlOiBzdHJpbmcsXG4gIHBhcmVudE5vZGU/OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgcHJvcHM/OiBTZ2ZOb2RlT3B0aW9uc1xuKSA9PiB7XG4gIGNvbnN0IHRyZWU6IFRyZWVNb2RlbCA9IG5ldyBUcmVlTW9kZWwoKTtcbiAgY29uc3QgbW92ZVByb3AgPSBNb3ZlUHJvcC5mcm9tKG1vdmUpO1xuICBjb25zdCBoYXNoID0gY2FsY0hhc2gocGFyZW50Tm9kZSwgW21vdmVQcm9wXSk7XG4gIGxldCBudW1iZXIgPSAxO1xuICBpZiAocGFyZW50Tm9kZSkgbnVtYmVyID0gZ2V0Tm9kZU51bWJlcihwYXJlbnROb2RlKSArIDE7XG4gIGNvbnN0IG5vZGVEYXRhID0gaW5pdE5vZGVEYXRhKGhhc2gsIG51bWJlcik7XG4gIG5vZGVEYXRhLm1vdmVQcm9wcyA9IFttb3ZlUHJvcF07XG4gIC8vIFRPRE86IFNob3VsZCBJIGFkZCB0aGlzP1xuICAvLyBub2RlRGF0YS5ub2RlQW5ub3RhdGlvblByb3BzID0gW05vZGVBbm5vdGF0aW9uUHJvcC5mcm9tKGBOWyR7c2hhfV1gKV07XG5cbiAgY29uc3Qgbm9kZSA9IHRyZWUucGFyc2Uoe1xuICAgIC4uLm5vZGVEYXRhLFxuICAgIC4uLnByb3BzLFxuICB9KTtcbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TGFzdEluZGV4ID0gKHJvb3Q6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGxldCBsYXN0Tm9kZSA9IHJvb3Q7XG4gIHJvb3Qud2Fsayhub2RlID0+IHtcbiAgICAvLyBIYWx0IHRoZSB0cmF2ZXJzYWwgYnkgcmV0dXJuaW5nIGZhbHNlXG4gICAgbGFzdE5vZGUgPSBub2RlO1xuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbiAgcmV0dXJuIGxhc3ROb2RlLm1vZGVsLmluZGV4O1xufTtcblxuZXhwb3J0IGNvbnN0IGN1dE1vdmVOb2RlcyA9IChcbiAgcm9vdDogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIHJldHVyblJvb3Q/OiBib29sZWFuXG4pID0+IHtcbiAgbGV0IG5vZGUgPSBjbG9uZURlZXAocm9vdCk7XG4gIHdoaWxlIChub2RlICYmIG5vZGUuaGFzQ2hpbGRyZW4oKSAmJiBub2RlLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICBub2RlLmNoaWxkcmVuID0gW107XG4gIH1cblxuICBpZiAocmV0dXJuUm9vdCkge1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUucGFyZW50ICYmICFub2RlLmlzUm9vdCgpKSB7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Um9vdCA9IChub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICBsZXQgcm9vdCA9IG5vZGU7XG4gIHdoaWxlIChyb290ICYmIHJvb3QucGFyZW50ICYmICFyb290LmlzUm9vdCgpKSB7XG4gICAgcm9vdCA9IHJvb3QucGFyZW50O1xuICB9XG4gIHJldHVybiByb290O1xufTtcblxuZXhwb3J0IGNvbnN0IHplcm9zID0gKHNpemU6IFtudW1iZXIsIG51bWJlcl0pOiBudW1iZXJbXVtdID0+XG4gIG5ldyBBcnJheShzaXplWzBdKS5maWxsKDApLm1hcCgoKSA9PiBuZXcgQXJyYXkoc2l6ZVsxXSkuZmlsbCgwKSk7XG5cbmV4cG9ydCBjb25zdCBlbXB0eSA9IChzaXplOiBbbnVtYmVyLCBudW1iZXJdKTogc3RyaW5nW11bXSA9PlxuICBuZXcgQXJyYXkoc2l6ZVswXSkuZmlsbCgnJykubWFwKCgpID0+IG5ldyBBcnJheShzaXplWzFdKS5maWxsKCcnKSk7XG5cbmV4cG9ydCBjb25zdCBjYWxjTW9zdCA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGxldCBsZWZ0TW9zdDogbnVtYmVyID0gYm9hcmRTaXplIC0gMTtcbiAgbGV0IHJpZ2h0TW9zdCA9IDA7XG4gIGxldCB0b3BNb3N0OiBudW1iZXIgPSBib2FyZFNpemUgLSAxO1xuICBsZXQgYm90dG9tTW9zdCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGlmIChsZWZ0TW9zdCA+IGkpIGxlZnRNb3N0ID0gaTtcbiAgICAgICAgaWYgKHJpZ2h0TW9zdCA8IGkpIHJpZ2h0TW9zdCA9IGk7XG4gICAgICAgIGlmICh0b3BNb3N0ID4gaikgdG9wTW9zdCA9IGo7XG4gICAgICAgIGlmIChib3R0b21Nb3N0IDwgaikgYm90dG9tTW9zdCA9IGo7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH07XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0NlbnRlciA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGNvbnN0IHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fSA9IGNhbGNNb3N0KG1hdCwgYm9hcmRTaXplKTtcbiAgY29uc3QgdG9wID0gdG9wTW9zdCA8IGJvYXJkU2l6ZSAtIDEgLSBib3R0b21Nb3N0O1xuICBjb25zdCBsZWZ0ID0gbGVmdE1vc3QgPCBib2FyZFNpemUgLSAxIC0gcmlnaHRNb3N0O1xuICBpZiAodG9wICYmIGxlZnQpIHJldHVybiBDZW50ZXIuVG9wTGVmdDtcbiAgaWYgKCF0b3AgJiYgbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21MZWZ0O1xuICBpZiAodG9wICYmICFsZWZ0KSByZXR1cm4gQ2VudGVyLlRvcFJpZ2h0O1xuICBpZiAoIXRvcCAmJiAhbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21SaWdodDtcbiAgcmV0dXJuIENlbnRlci5DZW50ZXI7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0JvYXJkU2l6ZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBib2FyZFNpemUgPSAxOSxcbiAgZXh0ZW50ID0gMlxuKTogbnVtYmVyW10gPT4ge1xuICBjb25zdCByZXN1bHQgPSBbMTksIDE5XTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQsIGJvYXJkU2l6ZSk7XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0KSB7XG4gICAgcmVzdWx0WzBdID0gcmlnaHRNb3N0ICsgZXh0ZW50ICsgMTtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW50ICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVudDtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW50ICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCkge1xuICAgIHJlc3VsdFswXSA9IHJpZ2h0TW9zdCArIGV4dGVudCArIDE7XG4gICAgcmVzdWx0WzFdID0gYm9hcmRTaXplIC0gdG9wTW9zdCArIGV4dGVudDtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVudDtcbiAgICByZXN1bHRbMV0gPSBib2FyZFNpemUgLSB0b3BNb3N0ICsgZXh0ZW50O1xuICB9XG4gIHJlc3VsdFswXSA9IE1hdGgubWluKHJlc3VsdFswXSwgYm9hcmRTaXplKTtcbiAgcmVzdWx0WzFdID0gTWF0aC5taW4ocmVzdWx0WzFdLCBib2FyZFNpemUpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1BhcnRpYWxBcmVhID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGV4dGVudCA9IDIsXG4gIGJvYXJkU2l6ZSA9IDE5XG4pOiBbW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXV0gPT4ge1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQpO1xuXG4gIGNvbnN0IHNpemUgPSBib2FyZFNpemUgLSAxO1xuICBjb25zdCB4MSA9IGxlZnRNb3N0IC0gZXh0ZW50IDwgMCA/IDAgOiBsZWZ0TW9zdCAtIGV4dGVudDtcbiAgY29uc3QgeTEgPSB0b3BNb3N0IC0gZXh0ZW50IDwgMCA/IDAgOiB0b3BNb3N0IC0gZXh0ZW50O1xuICBjb25zdCB4MiA9IHJpZ2h0TW9zdCArIGV4dGVudCA+IHNpemUgPyBzaXplIDogcmlnaHRNb3N0ICsgZXh0ZW50O1xuICBjb25zdCB5MiA9IGJvdHRvbU1vc3QgKyBleHRlbnQgPiBzaXplID8gc2l6ZSA6IGJvdHRvbU1vc3QgKyBleHRlbnQ7XG5cbiAgcmV0dXJuIFtcbiAgICBbeDEsIHkxXSxcbiAgICBbeDIsIHkyXSxcbiAgXTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjQXZvaWRNb3Zlc0ZvclBhcnRpYWxBbmFseXNpcyA9IChcbiAgcGFydGlhbEFyZWE6IFtbbnVtYmVyLCBudW1iZXJdLCBbbnVtYmVyLCBudW1iZXJdXSxcbiAgYm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3QgW1t4MSwgeTFdLCBbeDIsIHkyXV0gPSBwYXJ0aWFsQXJlYTtcblxuICBmb3IgKGNvbnN0IGNvbCBvZiBBMV9MRVRURVJTLnNsaWNlKDAsIGJvYXJkU2l6ZSkpIHtcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiBBMV9OVU1CRVJTLnNsaWNlKC1ib2FyZFNpemUpKSB7XG4gICAgICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKGNvbCk7XG4gICAgICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHJvdyk7XG5cbiAgICAgIGlmICh4IDwgeDEgfHwgeCA+IHgyIHx8IHkgPCB5MSB8fCB5ID4geTIpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYCR7Y29sfSR7cm93fWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1RzdW1lZ29GcmFtZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBleHRlbnQ6IG51bWJlcixcbiAgYm9hcmRTaXplID0gMTksXG4gIGtvbWkgPSA3LjUsXG4gIHR1cm46IEtpID0gS2kuQmxhY2ssXG4gIGtvID0gZmFsc2Vcbik6IG51bWJlcltdW10gPT4ge1xuICBjb25zdCByZXN1bHQgPSBjbG9uZURlZXAobWF0KTtcbiAgY29uc3QgcGFydGlhbEFyZWEgPSBjYWxjUGFydGlhbEFyZWEobWF0LCBleHRlbnQsIGJvYXJkU2l6ZSk7XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcbiAgY29uc3QgcHV0Qm9yZGVyID0gKG1hdDogbnVtYmVyW11bXSkgPT4ge1xuICAgIGNvbnN0IFt4MSwgeTFdID0gcGFydGlhbEFyZWFbMF07XG4gICAgY29uc3QgW3gyLCB5Ml0gPSBwYXJ0aWFsQXJlYVsxXTtcbiAgICBmb3IgKGxldCBpID0geDE7IGkgPD0geDI7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IHkxOyBqIDw9IHkyOyBqKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcExlZnQgJiZcbiAgICAgICAgICAoKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCAmJlxuICAgICAgICAgICgoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQgJiZcbiAgICAgICAgICAoKGkgPT09IHgyICYmIGkgPCBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAgICAgKGogPT09IHkxICYmIGogPiAwKSB8fFxuICAgICAgICAgICAgKGkgPT09IHgxICYmIGkgPiAwKSB8fFxuICAgICAgICAgICAgKGogPT09IHkyICYmIGogPCBib2FyZFNpemUgLSAxKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWF0W2ldW2pdID0gdHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCAmJlxuICAgICAgICAgICgoaSA9PT0geDEgJiYgaSA+IDApIHx8XG4gICAgICAgICAgICAoaiA9PT0geTEgJiYgaiA+IDApIHx8XG4gICAgICAgICAgICAoaSA9PT0geDIgJiYgaSA8IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICAgICAoaiA9PT0geTIgJiYgaiA8IGJvYXJkU2l6ZSAtIDEpKVxuICAgICAgICApIHtcbiAgICAgICAgICBtYXRbaV1bal0gPSB0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGNlbnRlciA9PT0gQ2VudGVyLkNlbnRlcikge1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHB1dE91dHNpZGUgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gICAgY29uc3Qgb2ZmZW5jZVRvV2luID0gMTA7XG4gICAgY29uc3Qgb2ZmZW5zZUtvbWkgPSB0dXJuICoga29taTtcbiAgICBjb25zdCBbeDEsIHkxXSA9IHBhcnRpYWxBcmVhWzBdO1xuICAgIGNvbnN0IFt4MiwgeTJdID0gcGFydGlhbEFyZWFbMV07XG4gICAgLy8gVE9ETzogSGFyZCBjb2RlIGZvciBub3dcbiAgICAvLyBjb25zdCBibGFja1RvQXR0YWNrID0gdHVybiA9PT0gS2kuQmxhY2s7XG4gICAgY29uc3QgYmxhY2tUb0F0dGFjayA9IHR1cm4gPT09IEtpLkJsYWNrO1xuICAgIGNvbnN0IGlzaXplID0geDIgLSB4MTtcbiAgICBjb25zdCBqc2l6ZSA9IHkyIC0geTE7XG4gICAgLy8gVE9ETzogMzYxIGlzIGhhcmRjb2RlZFxuICAgIC8vIGNvbnN0IGRlZmVuc2VBcmVhID0gTWF0aC5mbG9vcihcbiAgICAvLyAgICgzNjEgLSBpc2l6ZSAqIGpzaXplIC0gb2ZmZW5zZUtvbWkgLSBvZmZlbmNlVG9XaW4pIC8gMlxuICAgIC8vICk7XG4gICAgY29uc3QgZGVmZW5zZUFyZWEgPVxuICAgICAgTWF0aC5mbG9vcigoMzYxIC0gaXNpemUgKiBqc2l6ZSkgLyAyKSAtIG9mZmVuc2VLb21pIC0gb2ZmZW5jZVRvV2luO1xuXG4gICAgLy8gY29uc3QgZGVmZW5zZUFyZWEgPSAzMDtcblxuICAgIC8vIG91dHNpZGUgdGhlIGZyYW1lXG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkU2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkU2l6ZTsgaisrKSB7XG4gICAgICAgIGlmIChpIDwgeDEgfHwgaSA+IHgyIHx8IGogPCB5MSB8fCBqID4geTIpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIGxldCBraSA9IEtpLkVtcHR5O1xuICAgICAgICAgIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0IHx8IGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQpIHtcbiAgICAgICAgICAgIGtpID0gYmxhY2tUb0F0dGFjayAhPT0gY291bnQgPD0gZGVmZW5zZUFyZWEgPyBLaS5XaGl0ZSA6IEtpLkJsYWNrO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BSaWdodCB8fFxuICAgICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGtpID0gYmxhY2tUb0F0dGFjayAhPT0gY291bnQgPD0gZGVmZW5zZUFyZWEgPyBLaS5CbGFjayA6IEtpLldoaXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKGkgKyBqKSAlIDIgPT09IDAgJiYgTWF0aC5hYnMoY291bnQgLSBkZWZlbnNlQXJlYSkgPiBib2FyZFNpemUpIHtcbiAgICAgICAgICAgIGtpID0gS2kuRW1wdHk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWF0W2ldW2pdID0ga2k7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8vIFRPRE86XG4gIGNvbnN0IHB1dEtvVGhyZWF0ID0gKG1hdDogbnVtYmVyW11bXSwga286IGJvb2xlYW4pID0+IHt9O1xuXG4gIHB1dEJvcmRlcihyZXN1bHQpO1xuICBwdXRPdXRzaWRlKHJlc3VsdCk7XG5cbiAgLy8gY29uc3QgZmxpcFNwZWMgPVxuICAvLyAgIGltaW4gPCBqbWluXG4gIC8vICAgICA/IFtmYWxzZSwgZmFsc2UsIHRydWVdXG4gIC8vICAgICA6IFtuZWVkRmxpcChpbWluLCBpbWF4LCBpc2l6ZSksIG5lZWRGbGlwKGptaW4sIGptYXgsIGpzaXplKSwgZmFsc2VdO1xuXG4gIC8vIGlmIChmbGlwU3BlYy5pbmNsdWRlcyh0cnVlKSkge1xuICAvLyAgIGNvbnN0IGZsaXBwZWQgPSBmbGlwU3RvbmVzKHN0b25lcywgZmxpcFNwZWMpO1xuICAvLyAgIGNvbnN0IGZpbGxlZCA9IHRzdW1lZ29GcmFtZVN0b25lcyhmbGlwcGVkLCBrb21pLCBibGFja1RvUGxheSwga28sIG1hcmdpbik7XG4gIC8vICAgcmV0dXJuIGZsaXBTdG9uZXMoZmlsbGVkLCBmbGlwU3BlYyk7XG4gIC8vIH1cblxuICAvLyBjb25zdCBpMCA9IGltaW4gLSBtYXJnaW47XG4gIC8vIGNvbnN0IGkxID0gaW1heCArIG1hcmdpbjtcbiAgLy8gY29uc3QgajAgPSBqbWluIC0gbWFyZ2luO1xuICAvLyBjb25zdCBqMSA9IGptYXggKyBtYXJnaW47XG4gIC8vIGNvbnN0IGZyYW1lUmFuZ2U6IFJlZ2lvbiA9IFtpMCwgaTEsIGowLCBqMV07XG4gIC8vIGNvbnN0IGJsYWNrVG9BdHRhY2sgPSBndWVzc0JsYWNrVG9BdHRhY2soXG4gIC8vICAgW3RvcCwgYm90dG9tLCBsZWZ0LCByaWdodF0sXG4gIC8vICAgW2lzaXplLCBqc2l6ZV1cbiAgLy8gKTtcblxuICAvLyBwdXRCb3JkZXIobWF0LCBbaXNpemUsIGpzaXplXSwgZnJhbWVSYW5nZSwgYmxhY2tUb0F0dGFjayk7XG4gIC8vIHB1dE91dHNpZGUoXG4gIC8vICAgc3RvbmVzLFxuICAvLyAgIFtpc2l6ZSwganNpemVdLFxuICAvLyAgIGZyYW1lUmFuZ2UsXG4gIC8vICAgYmxhY2tUb0F0dGFjayxcbiAgLy8gICBibGFja1RvUGxheSxcbiAgLy8gICBrb21pXG4gIC8vICk7XG4gIC8vIHB1dEtvVGhyZWF0KFxuICAvLyAgIHN0b25lcyxcbiAgLy8gICBbaXNpemUsIGpzaXplXSxcbiAgLy8gICBmcmFtZVJhbmdlLFxuICAvLyAgIGJsYWNrVG9BdHRhY2ssXG4gIC8vICAgYmxhY2tUb1BsYXksXG4gIC8vICAga29cbiAgLy8gKTtcbiAgLy8gcmV0dXJuIHN0b25lcztcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNPZmZzZXQgPSAobWF0OiBudW1iZXJbXVtdKSA9PiB7XG4gIGNvbnN0IGJvYXJkU2l6ZSA9IGNhbGNCb2FyZFNpemUobWF0KTtcbiAgY29uc3Qgb3ggPSAxOSAtIGJvYXJkU2l6ZVswXTtcbiAgY29uc3Qgb3kgPSAxOSAtIGJvYXJkU2l6ZVsxXTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuXG4gIGxldCBvb3ggPSBveDtcbiAgbGV0IG9veSA9IG95O1xuICBzd2l0Y2ggKGNlbnRlcikge1xuICAgIGNhc2UgQ2VudGVyLlRvcExlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSBveTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Ub3BSaWdodDoge1xuICAgICAgb294ID0gLW94O1xuICAgICAgb295ID0gb3k7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tTGVmdDoge1xuICAgICAgb294ID0gMDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuQm90dG9tUmlnaHQ6IHtcbiAgICAgIG9veCA9IC1veDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt4OiBvb3gsIHk6IG9veX07XG59O1xuXG5leHBvcnQgY29uc3QgcmV2ZXJzZU9mZnNldCA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBieCA9IDE5LFxuICBieSA9IDE5LFxuICBib2FyZFNpemUgPSAxOVxuKSA9PiB7XG4gIGNvbnN0IG94ID0gYm9hcmRTaXplIC0gYng7XG4gIGNvbnN0IG95ID0gYm9hcmRTaXplIC0gYnk7XG4gIGNvbnN0IGNlbnRlciA9IGNhbGNDZW50ZXIobWF0KTtcblxuICBsZXQgb294ID0gb3g7XG4gIGxldCBvb3kgPSBveTtcbiAgc3dpdGNoIChjZW50ZXIpIHtcbiAgICBjYXNlIENlbnRlci5Ub3BMZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gLW95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLlRvcFJpZ2h0OiB7XG4gICAgICBvb3ggPSBveDtcbiAgICAgIG9veSA9IC1veTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21MZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21SaWdodDoge1xuICAgICAgb294ID0gb3g7XG4gICAgICBvb3kgPSAwO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB7eDogb294LCB5OiBvb3l9O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNWaXNpYmxlQXJlYShcbiAgbWF0OiBudW1iZXJbXVtdID0gemVyb3MoWzE5LCAxOV0pLFxuICBleHRlbnQ6IG51bWJlcixcbiAgYWxsb3dSZWN0YW5nbGUgPSBmYWxzZVxuKTogbnVtYmVyW11bXSB7XG4gIGxldCBtaW5Sb3cgPSBtYXQubGVuZ3RoO1xuICBsZXQgbWF4Um93ID0gMDtcbiAgbGV0IG1pbkNvbCA9IG1hdFswXS5sZW5ndGg7XG4gIGxldCBtYXhDb2wgPSAwO1xuXG4gIGxldCBlbXB0eSA9IHRydWU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFswXS5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKG1hdFtpXVtqXSAhPT0gMCkge1xuICAgICAgICBlbXB0eSA9IGZhbHNlO1xuICAgICAgICBtaW5Sb3cgPSBNYXRoLm1pbihtaW5Sb3csIGkpO1xuICAgICAgICBtYXhSb3cgPSBNYXRoLm1heChtYXhSb3csIGkpO1xuICAgICAgICBtaW5Db2wgPSBNYXRoLm1pbihtaW5Db2wsIGopO1xuICAgICAgICBtYXhDb2wgPSBNYXRoLm1heChtYXhDb2wsIGopO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChlbXB0eSkge1xuICAgIHJldHVybiBbXG4gICAgICBbMCwgbWF0Lmxlbmd0aCAtIDFdLFxuICAgICAgWzAsIG1hdFswXS5sZW5ndGggLSAxXSxcbiAgICBdO1xuICB9XG5cbiAgaWYgKCFhbGxvd1JlY3RhbmdsZSkge1xuICAgIGNvbnN0IG1pblJvd1dpdGhFeHRlbnQgPSBNYXRoLm1heChtaW5Sb3cgLSBleHRlbnQsIDApO1xuICAgIGNvbnN0IG1heFJvd1dpdGhFeHRlbnQgPSBNYXRoLm1pbihtYXhSb3cgKyBleHRlbnQsIG1hdC5sZW5ndGggLSAxKTtcbiAgICBjb25zdCBtaW5Db2xXaXRoRXh0ZW50ID0gTWF0aC5tYXgobWluQ29sIC0gZXh0ZW50LCAwKTtcbiAgICBjb25zdCBtYXhDb2xXaXRoRXh0ZW50ID0gTWF0aC5taW4obWF4Q29sICsgZXh0ZW50LCBtYXRbMF0ubGVuZ3RoIC0gMSk7XG5cbiAgICBjb25zdCBtYXhSYW5nZSA9IE1hdGgubWF4KFxuICAgICAgbWF4Um93V2l0aEV4dGVudCAtIG1pblJvd1dpdGhFeHRlbnQsXG4gICAgICBtYXhDb2xXaXRoRXh0ZW50IC0gbWluQ29sV2l0aEV4dGVudFxuICAgICk7XG5cbiAgICBtaW5Sb3cgPSBtaW5Sb3dXaXRoRXh0ZW50O1xuICAgIG1heFJvdyA9IG1pblJvdyArIG1heFJhbmdlO1xuXG4gICAgaWYgKG1heFJvdyA+PSBtYXQubGVuZ3RoKSB7XG4gICAgICBtYXhSb3cgPSBtYXQubGVuZ3RoIC0gMTtcbiAgICAgIG1pblJvdyA9IG1heFJvdyAtIG1heFJhbmdlO1xuICAgIH1cblxuICAgIG1pbkNvbCA9IG1pbkNvbFdpdGhFeHRlbnQ7XG4gICAgbWF4Q29sID0gbWluQ29sICsgbWF4UmFuZ2U7XG4gICAgaWYgKG1heENvbCA+PSBtYXRbMF0ubGVuZ3RoKSB7XG4gICAgICBtYXhDb2wgPSBtYXRbMF0ubGVuZ3RoIC0gMTtcbiAgICAgIG1pbkNvbCA9IG1heENvbCAtIG1heFJhbmdlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBtaW5Sb3cgPSBNYXRoLm1heCgwLCBtaW5Sb3cgLSBleHRlbnQpO1xuICAgIG1heFJvdyA9IE1hdGgubWluKG1hdC5sZW5ndGggLSAxLCBtYXhSb3cgKyBleHRlbnQpO1xuICAgIG1pbkNvbCA9IE1hdGgubWF4KDAsIG1pbkNvbCAtIGV4dGVudCk7XG4gICAgbWF4Q29sID0gTWF0aC5taW4obWF0WzBdLmxlbmd0aCAtIDEsIG1heENvbCArIGV4dGVudCk7XG4gIH1cblxuICByZXR1cm4gW1xuICAgIFttaW5Sb3csIG1heFJvd10sXG4gICAgW21pbkNvbCwgbWF4Q29sXSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmUobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikge1xuICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybiBtYXQ7XG4gIGNvbnN0IG5ld01hdCA9IGNsb25lRGVlcChtYXQpO1xuICBuZXdNYXRbaV1bal0gPSBraTtcbiAgcmV0dXJuIGV4ZWNDYXB0dXJlKG5ld01hdCwgaSwgaiwgLWtpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dLaShtYXQ6IG51bWJlcltdW10sIHN0ZXBzOiBzdHJpbmdbXSwgaXNDYXB0dXJlZCA9IHRydWUpIHtcbiAgbGV0IG5ld01hdCA9IGNsb25lRGVlcChtYXQpO1xuICBsZXQgaGFzTW92ZWQgPSBmYWxzZTtcbiAgc3RlcHMuZm9yRWFjaChzdHIgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAga2ksXG4gICAgfToge1xuICAgICAgeDogbnVtYmVyO1xuICAgICAgeTogbnVtYmVyO1xuICAgICAga2k6IG51bWJlcjtcbiAgICB9ID0gc2dmVG9Qb3Moc3RyKTtcbiAgICBpZiAoaXNDYXB0dXJlZCkge1xuICAgICAgaWYgKGNhbk1vdmUobmV3TWF0LCB4LCB5LCBraSkpIHtcbiAgICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICAgIG5ld01hdCA9IGV4ZWNDYXB0dXJlKG5ld01hdCwgeCwgeSwgLWtpKTtcbiAgICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJyYW5nZW1lbnQ6IG5ld01hdCxcbiAgICBoYXNNb3ZlZCxcbiAgfTtcbn1cblxuLy8gVE9ETzpcbmV4cG9ydCBjb25zdCBoYW5kbGVNb3ZlID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICB0dXJuOiBLaSxcbiAgY3VycmVudE5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBvbkFmdGVyTW92ZTogKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LCBpc01vdmVkOiBib29sZWFuKSA9PiB2b2lkXG4pID0+IHtcbiAgaWYgKHR1cm4gPT09IEtpLkVtcHR5KSByZXR1cm47XG4gIGlmIChjYW5Nb3ZlKG1hdCwgaSwgaiwgdHVybikpIHtcbiAgICAvLyBkaXNwYXRjaCh1aVNsaWNlLmFjdGlvbnMuc2V0VHVybigtdHVybikpO1xuICAgIGNvbnN0IHZhbHVlID0gU0dGX0xFVFRFUlNbaV0gKyBTR0ZfTEVUVEVSU1tqXTtcbiAgICBjb25zdCB0b2tlbiA9IHR1cm4gPT09IEtpLkJsYWNrID8gJ0InIDogJ1cnO1xuICAgIGNvbnN0IGhhc2ggPSBjYWxjSGFzaChjdXJyZW50Tm9kZSwgW01vdmVQcm9wLmZyb20oYCR7dG9rZW59WyR7dmFsdWV9XWApXSk7XG4gICAgY29uc3QgZmlsdGVyZWQgPSBjdXJyZW50Tm9kZS5jaGlsZHJlbi5maWx0ZXIoXG4gICAgICAobjogVE5vZGUpID0+IG4ubW9kZWwuaWQgPT09IGhhc2hcbiAgICApO1xuICAgIGxldCBub2RlO1xuICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICBub2RlID0gZmlsdGVyZWRbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSBidWlsZE1vdmVOb2RlKGAke3Rva2VufVske3ZhbHVlfV1gLCBjdXJyZW50Tm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChub2RlKTtcbiAgICB9XG4gICAgaWYgKG9uQWZ0ZXJNb3ZlKSBvbkFmdGVyTW92ZShub2RlLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob25BZnRlck1vdmUpIG9uQWZ0ZXJNb3ZlKGN1cnJlbnROb2RlLCBmYWxzZSk7XG4gIH1cbn07XG5cbi8qKlxuICogQ2xlYXIgc3RvbmUgZnJvbSB0aGUgY3VycmVudE5vZGVcbiAqIEBwYXJhbSBjdXJyZW50Tm9kZVxuICogQHBhcmFtIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBjbGVhclN0b25lRnJvbUN1cnJlbnROb2RlID0gKFxuICBjdXJyZW50Tm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIHZhbHVlOiBzdHJpbmdcbikgPT4ge1xuICBjb25zdCBwYXRoID0gY3VycmVudE5vZGUuZ2V0UGF0aCgpO1xuICBwYXRoLmZvckVhY2gobm9kZSA9PiB7XG4gICAgY29uc3Qge3NldHVwUHJvcHN9ID0gbm9kZS5tb2RlbDtcbiAgICBpZiAoc2V0dXBQcm9wcy5maWx0ZXIoKHM6IFNldHVwUHJvcCkgPT4gcy52YWx1ZSA9PT0gdmFsdWUpLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vZGUubW9kZWwuc2V0dXBQcm9wcyA9IHNldHVwUHJvcHMuZmlsdGVyKChzOiBhbnkpID0+IHMudmFsdWUgIT09IHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dXBQcm9wcy5mb3JFYWNoKChzOiBTZXR1cFByb3ApID0+IHtcbiAgICAgICAgcy52YWx1ZXMgPSBzLnZhbHVlcy5maWx0ZXIodiA9PiB2ICE9PSB2YWx1ZSk7XG4gICAgICAgIGlmIChzLnZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBub2RlLm1vZGVsLnNldHVwUHJvcHMgPSBub2RlLm1vZGVsLnNldHVwUHJvcHMuZmlsdGVyKFxuICAgICAgICAgICAgKHA6IFNldHVwUHJvcCkgPT4gcC50b2tlbiAhPT0gcy50b2tlblxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBzdG9uZSB0byB0aGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICpcbiAqIEBwYXJhbSBjdXJyZW50Tm9kZSBUaGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICogQHBhcmFtIG1hdCBUaGUgbWF0cml4IHJlcHJlc2VudGluZyB0aGUgYm9hcmQuXG4gKiBAcGFyYW0gaSBUaGUgcm93IGluZGV4IG9mIHRoZSBzdG9uZS5cbiAqIEBwYXJhbSBqIFRoZSBjb2x1bW4gaW5kZXggb2YgdGhlIHN0b25lLlxuICogQHBhcmFtIGtpIFRoZSBjb2xvciBvZiB0aGUgc3RvbmUgKEtpLldoaXRlIG9yIEtpLkJsYWNrKS5cbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHN0b25lIHdhcyByZW1vdmVkIGZyb20gcHJldmlvdXMgbm9kZXMsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGFkZFN0b25lVG9DdXJyZW50Tm9kZSA9IChcbiAgY3VycmVudE5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogS2lcbikgPT4ge1xuICBjb25zdCB2YWx1ZSA9IFNHRl9MRVRURVJTW2ldICsgU0dGX0xFVFRFUlNbal07XG4gIGNvbnN0IHRva2VuID0ga2kgPT09IEtpLldoaXRlID8gJ0FXJyA6ICdBQic7XG4gIGNvbnN0IHByb3AgPSBmaW5kUHJvcChjdXJyZW50Tm9kZSwgdG9rZW4pO1xuICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gIGlmIChtYXRbaV1bal0gIT09IEtpLkVtcHR5KSB7XG4gICAgY2xlYXJTdG9uZUZyb21DdXJyZW50Tm9kZShjdXJyZW50Tm9kZSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChwcm9wKSB7XG4gICAgICBwcm9wLnZhbHVlcyA9IFsuLi5wcm9wLnZhbHVlcywgdmFsdWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50Tm9kZS5tb2RlbC5zZXR1cFByb3BzID0gW1xuICAgICAgICAuLi5jdXJyZW50Tm9kZS5tb2RlbC5zZXR1cFByb3BzLFxuICAgICAgICBuZXcgU2V0dXBQcm9wKHRva2VuLCB2YWx1ZSksXG4gICAgICBdO1xuICAgIH1cbiAgICByZXN1bHQgPSB0cnVlO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBtb3ZlIHRvIHRoZSBnaXZlbiBtYXRyaXggYW5kIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgbm9kZSBpbiB0aGUgdHJlZS5cbiAqIElmIHRoZSBraSBpcyBlbXB0eSwgbm8gbW92ZSBpcyBhZGRlZCBhbmQgbnVsbCBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0gbWF0IC0gVGhlIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIGdhbWUgYm9hcmQuXG4gKiBAcGFyYW0gY3VycmVudE5vZGUgLSBUaGUgY3VycmVudCBub2RlIGluIHRoZSB0cmVlLlxuICogQHBhcmFtIGkgLSBUaGUgcm93IGluZGV4IG9mIHRoZSBtb3ZlLlxuICogQHBhcmFtIGogLSBUaGUgY29sdW1uIGluZGV4IG9mIHRoZSBtb3ZlLlxuICogQHBhcmFtIGtpIC0gVGhlIHR5cGUgb2YgbW92ZSAoS2kpLlxuICogQHJldHVybnMgVGhlIGNvcnJlc3BvbmRpbmcgbm9kZSBpbiB0aGUgdHJlZSwgb3IgbnVsbCBpZiBubyBtb3ZlIGlzIGFkZGVkLlxuICovXG4vLyBUT0RPOiBUaGUgcGFyYW1zIGhlcmUgaXMgd2VpcmRcbmV4cG9ydCBjb25zdCBhZGRNb3ZlVG9DdXJyZW50Tm9kZSA9IChcbiAgY3VycmVudE5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICBraTogS2lcbikgPT4ge1xuICBpZiAoa2kgPT09IEtpLkVtcHR5KSByZXR1cm47XG4gIGxldCBub2RlO1xuICBpZiAoY2FuTW92ZShtYXQsIGksIGosIGtpKSkge1xuICAgIGNvbnN0IHZhbHVlID0gU0dGX0xFVFRFUlNbaV0gKyBTR0ZfTEVUVEVSU1tqXTtcbiAgICBjb25zdCB0b2tlbiA9IGtpID09PSBLaS5CbGFjayA/ICdCJyA6ICdXJztcbiAgICBjb25zdCBoYXNoID0gY2FsY0hhc2goY3VycmVudE5vZGUsIFtNb3ZlUHJvcC5mcm9tKGAke3Rva2VufVske3ZhbHVlfV1gKV0pO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gY3VycmVudE5vZGUuY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgKG46IFROb2RlKSA9PiBuLm1vZGVsLmlkID09PSBoYXNoXG4gICAgKTtcbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgbm9kZSA9IGZpbHRlcmVkWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gYnVpbGRNb3ZlTm9kZShgJHt0b2tlbn1bJHt2YWx1ZX1dYCwgY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNQcmV2ZW50TW92ZU1hdEZvckRpc3BsYXlPbmx5ID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgaWYgKCFub2RlKSByZXR1cm4gemVyb3MoW2RlZmF1bHRCb2FyZFNpemUsIGRlZmF1bHRCb2FyZFNpemVdKTtcbiAgY29uc3Qgc2l6ZSA9IGV4dHJhY3RCb2FyZFNpemUobm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGNvbnN0IHByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcblxuICBwcmV2ZW50TW92ZU1hdC5mb3JFYWNoKHJvdyA9PiByb3cuZmlsbCgxKSk7XG4gIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gICAgICBuLm1vZGVsLm1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgcHJldmVudE1vdmVNYXRbaV1bal0gPSAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcHJldmVudE1vdmVNYXQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1ByZXZlbnRNb3ZlTWF0ID0gKFxuICBub2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgaWYgKCFub2RlKSByZXR1cm4gemVyb3MoW2RlZmF1bHRCb2FyZFNpemUsIGRlZmF1bHRCb2FyZFNpemVdKTtcbiAgY29uc3Qgc2l6ZSA9IGV4dHJhY3RCb2FyZFNpemUobm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGNvbnN0IHByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgY29uc3QgZm9yY2VOb2RlcyA9IFtdO1xuICBsZXQgcHJldmVudE1vdmVOb2RlcyA9IFtdO1xuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgcHJldmVudE1vdmVOb2RlcyA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT5cbiAgICAgIGlzUHJldmVudE1vdmVOb2RlKG4pXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpc0ZvcmNlTm9kZShub2RlKSkge1xuICAgIHByZXZlbnRNb3ZlTWF0LmZvckVhY2gocm93ID0+IHJvdy5maWxsKDEpKTtcbiAgICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gICAgICAgIG4ubW9kZWwubW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICAgIHByZXZlbnRNb3ZlTWF0W2ldW2pdID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJldmVudE1vdmVOb2Rlcy5mb3JFYWNoKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICAgIG4ubW9kZWwubW92ZVByb3BzLmZvckVhY2goKG06IE1vdmVQcm9wKSA9PiB7XG4gICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgcHJldmVudE1vdmVNYXRbaV1bal0gPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJldmVudE1vdmVNYXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIG1hcmt1cCBtYXRyaXggZm9yIHZhcmlhdGlvbnMgaW4gYSBnaXZlbiBTR0Ygbm9kZS5cbiAqXG4gKiBAcGFyYW0gbm9kZSAtIFRoZSBTR0Ygbm9kZSB0byBjYWxjdWxhdGUgdGhlIG1hcmt1cCBmb3IuXG4gKiBAcGFyYW0gcG9saWN5IC0gVGhlIHBvbGljeSBmb3IgaGFuZGxpbmcgdGhlIG1hcmt1cC4gRGVmYXVsdHMgdG8gJ2FwcGVuZCcuXG4gKiBAcmV0dXJucyBUaGUgY2FsY3VsYXRlZCBtYXJrdXAgZm9yIHRoZSB2YXJpYXRpb25zLlxuICovXG5leHBvcnQgY29uc3QgY2FsY1ZhcmlhdGlvbnNNYXJrdXAgPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBwb2xpY3k6ICdhcHBlbmQnIHwgJ3ByZXBlbmQnIHwgJ3JlcGxhY2UnID0gJ2FwcGVuZCcsXG4gIGFjdGl2ZUluZGV4OiBudW1iZXIgPSAwLFxuICBkZWZhdWx0Qm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBjb25zdCByZXMgPSBjYWxjTWF0QW5kTWFya3VwKG5vZGUpO1xuICBjb25zdCB7bWF0LCBtYXJrdXB9ID0gcmVzO1xuICBjb25zdCBzaXplID0gZXh0cmFjdEJvYXJkU2l6ZShub2RlLCBkZWZhdWx0Qm9hcmRTaXplKTtcblxuICBpZiAobm9kZS5oYXNDaGlsZHJlbigpKSB7XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICAgICAgbi5tb2RlbC5tb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVswXSk7XG4gICAgICAgIGNvbnN0IGogPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMV0pO1xuICAgICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgICAgaWYgKGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgbGV0IG1hcmsgPSBNYXJrdXAuTmV1dHJhbE5vZGU7XG4gICAgICAgICAgaWYgKGluV3JvbmdQYXRoKG4pKSB7XG4gICAgICAgICAgICBtYXJrID1cbiAgICAgICAgICAgICAgbi5nZXRJbmRleCgpID09PSBhY3RpdmVJbmRleFxuICAgICAgICAgICAgICAgID8gTWFya3VwLk5lZ2F0aXZlQWN0aXZlTm9kZVxuICAgICAgICAgICAgICAgIDogTWFya3VwLk5lZ2F0aXZlTm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluUmlnaHRQYXRoKG4pKSB7XG4gICAgICAgICAgICBtYXJrID1cbiAgICAgICAgICAgICAgbi5nZXRJbmRleCgpID09PSBhY3RpdmVJbmRleFxuICAgICAgICAgICAgICAgID8gTWFya3VwLlBvc2l0aXZlQWN0aXZlTm9kZVxuICAgICAgICAgICAgICAgIDogTWFya3VwLlBvc2l0aXZlTm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1hdFtpXVtqXSA9PT0gS2kuRW1wdHkpIHtcbiAgICAgICAgICAgIHN3aXRjaCAocG9saWN5KSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3ByZXBlbmQnOlxuICAgICAgICAgICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcmsgKyAnfCcgKyBtYXJrdXBbaV1bal07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2UnOlxuICAgICAgICAgICAgICAgIG1hcmt1cFtpXVtqXSA9IG1hcms7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcGVuZCc6XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbWFya3VwW2ldW2pdICs9ICd8JyArIG1hcms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBtYXJrdXA7XG59O1xuXG5leHBvcnQgY29uc3QgZGV0ZWN0U1QgPSAobm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgLy8gUmVmZXJlbmNlOiBodHRwczovL3d3dy5yZWQtYmVhbi5jb20vc2dmL3Byb3BlcnRpZXMuaHRtbCNTVFxuICBjb25zdCByb290ID0gbm9kZS5nZXRQYXRoKClbMF07XG4gIGNvbnN0IHN0UHJvcCA9IHJvb3QubW9kZWwucm9vdFByb3BzLmZpbmQoKHA6IFJvb3RQcm9wKSA9PiBwLnRva2VuID09PSAnU1QnKTtcbiAgbGV0IHNob3dWYXJpYXRpb25zTWFya3VwID0gZmFsc2U7XG4gIGxldCBzaG93Q2hpbGRyZW5NYXJrdXAgPSBmYWxzZTtcbiAgbGV0IHNob3dTaWJsaW5nc01hcmt1cCA9IGZhbHNlO1xuXG4gIGNvbnN0IHN0ID0gc3RQcm9wPy52YWx1ZSB8fCAnMCc7XG4gIGlmIChzdCkge1xuICAgIGlmIChzdCA9PT0gJzAnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IHRydWU7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzEnKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSB0cnVlO1xuICAgICAgc2hvd0NoaWxkcmVuTWFya3VwID0gZmFsc2U7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzdCA9PT0gJzInKSB7XG4gICAgICBzaG93U2libGluZ3NNYXJrdXAgPSBmYWxzZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IHRydWU7XG4gICAgICBzaG93VmFyaWF0aW9uc01hcmt1cCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoc3QgPT09ICczJykge1xuICAgICAgc2hvd1NpYmxpbmdzTWFya3VwID0gdHJ1ZTtcbiAgICAgIHNob3dDaGlsZHJlbk1hcmt1cCA9IGZhbHNlO1xuICAgICAgc2hvd1ZhcmlhdGlvbnNNYXJrdXAgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtzaG93VmFyaWF0aW9uc01hcmt1cCwgc2hvd0NoaWxkcmVuTWFya3VwLCBzaG93U2libGluZ3NNYXJrdXB9O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBtYXQgYW5kIG1hcmt1cCBhcnJheXMgYmFzZWQgb24gdGhlIGN1cnJlbnROb2RlIGFuZCBkZWZhdWx0Qm9hcmRTaXplLlxuICogQHBhcmFtIGN1cnJlbnROb2RlIFRoZSBjdXJyZW50IG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBAcGFyYW0gZGVmYXVsdEJvYXJkU2l6ZSBUaGUgZGVmYXVsdCBzaXplIG9mIHRoZSBib2FyZCAob3B0aW9uYWwsIGRlZmF1bHQgaXMgMTkpLlxuICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hdC92aXNpYmxlQXJlYU1hdC9tYXJrdXAvbnVtTWFya3VwIGFycmF5cy5cbiAqL1xuZXhwb3J0IGNvbnN0IGNhbGNNYXRBbmRNYXJrdXAgPSAoXG4gIGN1cnJlbnROb2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgZGVmYXVsdEJvYXJkU2l6ZSA9IDE5XG4pID0+IHtcbiAgY29uc3QgcGF0aCA9IGN1cnJlbnROb2RlLmdldFBhdGgoKTtcbiAgY29uc3Qgcm9vdCA9IHBhdGhbMF07XG5cbiAgbGV0IGxpLCBsajtcbiAgbGV0IHNldHVwQ291bnQgPSAwO1xuICBjb25zdCBzaXplID0gZXh0cmFjdEJvYXJkU2l6ZShjdXJyZW50Tm9kZSwgZGVmYXVsdEJvYXJkU2l6ZSk7XG4gIGxldCBtYXQgPSB6ZXJvcyhbc2l6ZSwgc2l6ZV0pO1xuICBjb25zdCB2aXNpYmxlQXJlYU1hdCA9IHplcm9zKFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IG1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gIGNvbnN0IG51bU1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG5cbiAgcGF0aC5mb3JFYWNoKChub2RlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHttb3ZlUHJvcHMsIHNldHVwUHJvcHMsIHJvb3RQcm9wc30gPSBub2RlLm1vZGVsO1xuICAgIGlmIChzZXR1cFByb3BzLmxlbmd0aCA+IDApIHNldHVwQ291bnQgKz0gMTtcblxuICAgIHNldHVwUHJvcHMuZm9yRWFjaCgoc2V0dXA6IGFueSkgPT4ge1xuICAgICAgc2V0dXAudmFsdWVzLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgaSA9IFNHRl9MRVRURVJTLmluZGV4T2YodmFsdWVbMF0pO1xuICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuO1xuICAgICAgICBpZiAoaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICBsaSA9IGk7XG4gICAgICAgICAgbGogPSBqO1xuICAgICAgICAgIG1hdFtpXVtqXSA9IHNldHVwLnRva2VuID09PSAnQUInID8gMSA6IC0xO1xuICAgICAgICAgIGlmIChzZXR1cC50b2tlbiA9PT0gJ0FFJykgbWF0W2ldW2pdID0gMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBtb3ZlUHJvcHMuZm9yRWFjaCgobTogTW92ZVByb3ApID0+IHtcbiAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKG0udmFsdWVbMF0pO1xuICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgIGlmIChpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICBsaSA9IGk7XG4gICAgICAgIGxqID0gajtcbiAgICAgICAgbWF0ID0gbW92ZShtYXQsIGksIGosIG0udG9rZW4gPT09ICdCJyA/IEtpLkJsYWNrIDogS2kuV2hpdGUpO1xuXG4gICAgICAgIGlmIChsaSAhPT0gdW5kZWZpbmVkICYmIGxqICE9PSB1bmRlZmluZWQgJiYgbGkgPj0gMCAmJiBsaiA+PSAwKSB7XG4gICAgICAgICAgbnVtTWFya3VwW2xpXVtsal0gPSAoXG4gICAgICAgICAgICBub2RlLm1vZGVsLm51bWJlciB8fCBpbmRleCAtIHNldHVwQ291bnRcbiAgICAgICAgICApLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5kZXggPT09IHBhdGgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIG1hcmt1cFtsaV1bbGpdID0gTWFya3VwLkN1cnJlbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENsZWFyIG51bWJlciB3aGVuIHN0b25lcyBhcmUgY2FwdHVyZWRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgaWYgKG1hdFtpXVtqXSA9PT0gMCkgbnVtTWFya3VwW2ldW2pdID0gJyc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBDYWxjdWxhdGluZyB0aGUgdmlzaWJsZSBhcmVhXG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5hbGwoKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gICAgICBjb25zdCB7bW92ZVByb3BzLCBzZXR1cFByb3BzLCByb290UHJvcHN9ID0gbm9kZS5tb2RlbDtcbiAgICAgIGlmIChzZXR1cFByb3BzLmxlbmd0aCA+IDApIHNldHVwQ291bnQgKz0gMTtcbiAgICAgIHNldHVwUHJvcHMuZm9yRWFjaCgoc2V0dXA6IGFueSkgPT4ge1xuICAgICAgICBzZXR1cC52YWx1ZXMuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHZhbHVlWzBdKTtcbiAgICAgICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVsxXSk7XG4gICAgICAgICAgaWYgKGkgPj0gMCAmJiBqID49IDAgJiYgaSA8IHNpemUgJiYgaiA8IHNpemUpIHtcbiAgICAgICAgICAgIHZpc2libGVBcmVhTWF0W2ldW2pdID0gS2kuQmxhY2s7XG4gICAgICAgICAgICBpZiAoc2V0dXAudG9rZW4gPT09ICdBRScpIHZpc2libGVBcmVhTWF0W2ldW2pdID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIG1vdmVQcm9wcy5mb3JFYWNoKChtOiBNb3ZlUHJvcCkgPT4ge1xuICAgICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZihtLnZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgaiA9IFNHRl9MRVRURVJTLmluZGV4T2YobS52YWx1ZVsxXSk7XG4gICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPCBzaXplICYmIGogPCBzaXplKSB7XG4gICAgICAgICAgdmlzaWJsZUFyZWFNYXRbaV1bal0gPSBLaS5CbGFjaztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgbWFya3VwUHJvcHMgPSBjdXJyZW50Tm9kZS5tb2RlbC5tYXJrdXBQcm9wcztcbiAgbWFya3VwUHJvcHMuZm9yRWFjaCgobTogTWFya3VwUHJvcCkgPT4ge1xuICAgIGNvbnN0IHRva2VuID0gbS50b2tlbjtcbiAgICBjb25zdCB2YWx1ZXMgPSBtLnZhbHVlcztcbiAgICB2YWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICBjb25zdCBpID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVswXSk7XG4gICAgICBjb25zdCBqID0gU0dGX0xFVFRFUlMuaW5kZXhPZih2YWx1ZVsxXSk7XG4gICAgICBpZiAoaSA8IDAgfHwgaiA8IDApIHJldHVybjtcbiAgICAgIGlmIChpIDwgc2l6ZSAmJiBqIDwgc2l6ZSkge1xuICAgICAgICBsZXQgbWFyaztcbiAgICAgICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgICAgIGNhc2UgJ0NSJzpcbiAgICAgICAgICAgIG1hcmsgPSBNYXJrdXAuQ2lyY2xlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnU1EnOlxuICAgICAgICAgICAgbWFyayA9IE1hcmt1cC5TcXVhcmU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdUUic6XG4gICAgICAgICAgICBtYXJrID0gTWFya3VwLlRyaWFuZ2xlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnTUEnOlxuICAgICAgICAgICAgbWFyayA9IE1hcmt1cC5Dcm9zcztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIG1hcmsgPSB2YWx1ZS5zcGxpdCgnOicpWzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtYXJrdXBbaV1bal0gPSBtYXJrO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAvLyBpZiAoXG4gIC8vICAgbGkgIT09IHVuZGVmaW5lZCAmJlxuICAvLyAgIGxqICE9PSB1bmRlZmluZWQgJiZcbiAgLy8gICBsaSA+PSAwICYmXG4gIC8vICAgbGogPj0gMCAmJlxuICAvLyAgICFtYXJrdXBbbGldW2xqXVxuICAvLyApIHtcbiAgLy8gICBtYXJrdXBbbGldW2xqXSA9IE1hcmt1cC5DdXJyZW50O1xuICAvLyB9XG5cbiAgcmV0dXJuIHttYXQsIHZpc2libGVBcmVhTWF0LCBtYXJrdXAsIG51bU1hcmt1cH07XG59O1xuXG4vKipcbiAqIEZpbmRzIGEgcHJvcGVydHkgaW4gdGhlIGdpdmVuIG5vZGUgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHRva2VuLlxuICogQHBhcmFtIG5vZGUgVGhlIG5vZGUgdG8gc2VhcmNoIGZvciB0aGUgcHJvcGVydHkuXG4gKiBAcGFyYW0gdG9rZW4gVGhlIHRva2VuIG9mIHRoZSBwcm9wZXJ0eSB0byBmaW5kLlxuICogQHJldHVybnMgVGhlIGZvdW5kIHByb3BlcnR5IG9yIG51bGwgaWYgbm90IGZvdW5kLlxuICovXG5leHBvcnQgY29uc3QgZmluZFByb3AgPSAobm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sIHRva2VuOiBzdHJpbmcpID0+IHtcbiAgaWYgKCFub2RlKSByZXR1cm47XG4gIGlmIChNT1ZFX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5tb3ZlUHJvcHMuZmluZCgocDogTW92ZVByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5ub2RlQW5ub3RhdGlvblByb3BzLmZpbmQoXG4gICAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgaWYgKE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubW92ZUFubm90YXRpb25Qcm9wcy5maW5kKFxuICAgICAgKHA6IE1vdmVBbm5vdGF0aW9uUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW5cbiAgICApO1xuICB9XG4gIGlmIChST09UX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5yb290UHJvcHMuZmluZCgocDogUm9vdFByb3ApID0+IHAudG9rZW4gPT09IHRva2VuKTtcbiAgfVxuICBpZiAoU0VUVVBfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLnNldHVwUHJvcHMuZmluZCgocDogU2V0dXBQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKE1BUktVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubWFya3VwUHJvcHMuZmluZCgocDogTWFya3VwUHJvcCkgPT4gcC50b2tlbiA9PT0gdG9rZW4pO1xuICB9XG4gIGlmIChHQU1FX0lORk9fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLmdhbWVJbmZvUHJvcHMuZmluZChcbiAgICAgIChwOiBHYW1lSW5mb1Byb3ApID0+IHAudG9rZW4gPT09IHRva2VuXG4gICAgKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogRmluZHMgcHJvcGVydGllcyBpbiBhIGdpdmVuIG5vZGUgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHRva2VuLlxuICogQHBhcmFtIG5vZGUgLSBUaGUgbm9kZSB0byBzZWFyY2ggZm9yIHByb3BlcnRpZXMuXG4gKiBAcGFyYW0gdG9rZW4gLSBUaGUgdG9rZW4gdG8gbWF0Y2ggYWdhaW5zdCB0aGUgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHByb3BlcnRpZXMgdGhhdCBtYXRjaCB0aGUgcHJvdmlkZWQgdG9rZW4uXG4gKi9cbmV4cG9ydCBjb25zdCBmaW5kUHJvcHMgPSAobm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sIHRva2VuOiBzdHJpbmcpID0+IHtcbiAgaWYgKE1PVkVfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLm1vdmVQcm9wcy5maWx0ZXIoKHA6IE1vdmVQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubm9kZUFubm90YXRpb25Qcm9wcy5maWx0ZXIoXG4gICAgICAocDogTm9kZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgaWYgKE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubW92ZUFubm90YXRpb25Qcm9wcy5maWx0ZXIoXG4gICAgICAocDogTW92ZUFubm90YXRpb25Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgaWYgKFJPT1RfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgIHJldHVybiBub2RlLm1vZGVsLnJvb3RQcm9wcy5maWx0ZXIoKHA6IFJvb3RQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKFNFVFVQX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICByZXR1cm4gbm9kZS5tb2RlbC5zZXR1cFByb3BzLmZpbHRlcigocDogU2V0dXBQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKE1BUktVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwubWFya3VwUHJvcHMuZmlsdGVyKChwOiBNYXJrdXBQcm9wKSA9PiBwLnRva2VuID09PSB0b2tlbik7XG4gIH1cbiAgaWYgKEdBTUVfSU5GT19QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgcmV0dXJuIG5vZGUubW9kZWwuZ2FtZUluZm9Qcm9wcy5maWx0ZXIoXG4gICAgICAocDogR2FtZUluZm9Qcm9wKSA9PiBwLnRva2VuID09PSB0b2tlblxuICAgICk7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuZXhwb3J0IGNvbnN0IGdlbk1vdmUgPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBvblJpZ2h0OiAocGF0aDogc3RyaW5nKSA9PiB2b2lkLFxuICBvbldyb25nOiAocGF0aDogc3RyaW5nKSA9PiB2b2lkLFxuICBvblZhcmlhbnQ6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQsXG4gIG9uT2ZmUGF0aDogKHBhdGg6IHN0cmluZykgPT4gdm9pZFxuKTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4gPT4ge1xuICBsZXQgbmV4dE5vZGU7XG4gIGNvbnN0IGdldFBhdGggPSAobm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgICBjb25zdCBuZXdQYXRoID0gY29tcGFjdChcbiAgICAgIG5vZGUuZ2V0UGF0aCgpLm1hcChuID0+IG4ubW9kZWwubW92ZVByb3BzWzBdPy50b1N0cmluZygpKVxuICAgICkuam9pbignOycpO1xuICAgIHJldHVybiBuZXdQYXRoO1xuICB9O1xuXG4gIGNvbnN0IGNoZWNrUmVzdWx0ID0gKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gICAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgcGF0aCA9IGdldFBhdGgobm9kZSk7XG4gICAgaWYgKGlzUmlnaHROb2RlKG5vZGUpKSB7XG4gICAgICBpZiAob25SaWdodCkgb25SaWdodChwYXRoKTtcbiAgICB9IGVsc2UgaWYgKGlzVmFyaWFudE5vZGUobm9kZSkpIHtcbiAgICAgIGlmIChvblZhcmlhbnQpIG9uVmFyaWFudChwYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9uV3JvbmcpIG9uV3JvbmcocGF0aCk7XG4gICAgfVxuICB9O1xuXG4gIGlmIChub2RlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICBjb25zdCByaWdodE5vZGVzID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PlxuICAgICAgaW5SaWdodFBhdGgobilcbiAgICApO1xuICAgIGNvbnN0IHdyb25nTm9kZXMgPSBub2RlLmNoaWxkcmVuLmZpbHRlcigobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+XG4gICAgICBpbldyb25nUGF0aChuKVxuICAgICk7XG4gICAgY29uc3QgdmFyaWFudE5vZGVzID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PlxuICAgICAgaW5WYXJpYW50UGF0aChuKVxuICAgICk7XG5cbiAgICBuZXh0Tm9kZSA9IG5vZGU7XG5cbiAgICBpZiAoaW5SaWdodFBhdGgobm9kZSkgJiYgcmlnaHROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBuZXh0Tm9kZSA9IHNhbXBsZShyaWdodE5vZGVzKTtcbiAgICB9IGVsc2UgaWYgKGluV3JvbmdQYXRoKG5vZGUpICYmIHdyb25nTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgbmV4dE5vZGUgPSBzYW1wbGUod3JvbmdOb2Rlcyk7XG4gICAgfSBlbHNlIGlmIChpblZhcmlhbnRQYXRoKHZhcmlhbnROb2RlcykgJiYgdmFyaWFudE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5leHROb2RlID0gc2FtcGxlKHZhcmlhbnROb2Rlcyk7XG4gICAgfSBlbHNlIGlmIChpc1JpZ2h0Tm9kZShub2RlKSkge1xuICAgICAgb25SaWdodChnZXRQYXRoKG5leHROb2RlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uV3JvbmcoZ2V0UGF0aChuZXh0Tm9kZSkpO1xuICAgIH1cbiAgICBjaGVja1Jlc3VsdChuZXh0Tm9kZSk7XG4gIH0gZWxzZSB7XG4gICAgY2hlY2tSZXN1bHQobm9kZSk7XG4gIH1cbiAgcmV0dXJuIG5leHROb2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RCb2FyZFNpemUgPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBkZWZhdWx0Qm9hcmRTaXplID0gMTlcbikgPT4ge1xuICBjb25zdCByb290ID0gbm9kZS5nZXRQYXRoKClbMF07XG4gIGNvbnN0IHNpemUgPSBNYXRoLm1pbihcbiAgICBwYXJzZUludChmaW5kUHJvcChyb290LCAnU1onKT8udmFsdWUgfHwgZGVmYXVsdEJvYXJkU2l6ZSksXG4gICAgTUFYX0JPQVJEX1NJWkVcbiAgKTtcbiAgcmV0dXJuIHNpemU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Rmlyc3RUb01vdmVDb2xvckZyb21Sb290ID0gKFxuICByb290OiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiB8IHVuZGVmaW5lZCB8IG51bGwsXG4gIGRlZmF1bHRNb3ZlQ29sb3I6IEtpID0gS2kuQmxhY2tcbikgPT4ge1xuICBpZiAocm9vdCkge1xuICAgIGNvbnN0IHNldHVwTm9kZSA9IHJvb3QuZmlyc3QobiA9PiBpc1NldHVwTm9kZShuKSk7XG4gICAgaWYgKHNldHVwTm9kZSkge1xuICAgICAgY29uc3QgZmlyc3RNb3ZlTm9kZSA9IHNldHVwTm9kZS5maXJzdChuID0+IGlzTW92ZU5vZGUobikpO1xuICAgICAgaWYgKCFmaXJzdE1vdmVOb2RlKSByZXR1cm4gZGVmYXVsdE1vdmVDb2xvcjtcbiAgICAgIHJldHVybiBnZXRNb3ZlQ29sb3IoZmlyc3RNb3ZlTm9kZSk7XG4gICAgfVxuICB9XG4gIC8vIGNvbnNvbGUud2FybignRGVmYXVsdCBmaXJzdCB0byBtb3ZlIGNvbG9yJywgZGVmYXVsdE1vdmVDb2xvcik7XG4gIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpcnN0VG9Nb3ZlQ29sb3JGcm9tU2dmID0gKFxuICBzZ2Y6IHN0cmluZyxcbiAgZGVmYXVsdE1vdmVDb2xvcjogS2kgPSBLaS5CbGFja1xuKSA9PiB7XG4gIGNvbnN0IHNnZlBhcnNlciA9IG5ldyBTZ2Yoc2dmKTtcbiAgaWYgKHNnZlBhcnNlci5yb290KVxuICAgIGdldEZpcnN0VG9Nb3ZlQ29sb3JGcm9tUm9vdChzZ2ZQYXJzZXIucm9vdCwgZGVmYXVsdE1vdmVDb2xvcik7XG4gIC8vIGNvbnNvbGUud2FybignRGVmYXVsdCBmaXJzdCB0byBtb3ZlIGNvbG9yJywgZGVmYXVsdE1vdmVDb2xvcik7XG4gIHJldHVybiBkZWZhdWx0TW92ZUNvbG9yO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE1vdmVDb2xvciA9IChcbiAgbm9kZTogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIGRlZmF1bHRNb3ZlQ29sb3I6IEtpID0gS2kuQmxhY2tcbikgPT4ge1xuICBjb25zdCBtb3ZlUHJvcCA9IG5vZGUubW9kZWw/Lm1vdmVQcm9wcz8uWzBdO1xuICBzd2l0Y2ggKG1vdmVQcm9wPy50b2tlbikge1xuICAgIGNhc2UgJ1cnOlxuICAgICAgcmV0dXJuIEtpLldoaXRlO1xuICAgIGNhc2UgJ0InOlxuICAgICAgcmV0dXJuIEtpLkJsYWNrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ0RlZmF1bHQgbW92ZSBjb2xvciBpcycsIGRlZmF1bHRNb3ZlQ29sb3IpO1xuICAgICAgcmV0dXJuIGRlZmF1bHRNb3ZlQ29sb3I7XG4gIH1cbn07XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9uZSB7XG4gIHByb3RlY3RlZCBnbG9iYWxBbHBoYSA9IDE7XG4gIHByb3RlY3RlZCBzaXplID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcHJvdGVjdGVkIHg6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgeTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge31cbiAgZHJhdygpIHtcbiAgICBjb25zb2xlLmxvZygnVEJEJyk7XG4gIH1cblxuICBzZXRHbG9iYWxBbHBoYShhbHBoYTogbnVtYmVyKSB7XG4gICAgdGhpcy5nbG9iYWxBbHBoYSA9IGFscGhhO1xuICB9XG5cbiAgc2V0U2l6ZShzaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLnNpemUgPSBzaXplO1xuICB9XG59XG4iLCJpbXBvcnQgU3RvbmUgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGNsYXNzIENvbG9yU3RvbmUgZXh0ZW5kcyBTdG9uZSB7XG4gIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB4OiBudW1iZXIsIHk6IG51bWJlciwga2k6IG51bWJlcikge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwga2kpO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBpZiAoc2l6ZSA8PSAwKSByZXR1cm47XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgY3R4LmFyYyh4LCB5LCBzaXplIC8gMiwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgIGN0eC5saW5lV2lkdGggPSAxO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjMDAwJztcbiAgICBpZiAoa2kgPT09IDEpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gLTEpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZic7XG4gICAgfVxuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBTdG9uZSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgY2xhc3MgSW1hZ2VTdG9uZSBleHRlbmRzIFN0b25lIHtcbiAgY29uc3RydWN0b3IoXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBraTogbnVtYmVyLFxuICAgIHByaXZhdGUgbW9kOiBudW1iZXIsXG4gICAgcHJpdmF0ZSBibGFja3M6IGFueSxcbiAgICBwcml2YXRlIHdoaXRlczogYW55XG4gICkge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwga2kpO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBraSwgYmxhY2tzLCB3aGl0ZXMsIG1vZH0gPSB0aGlzO1xuICAgIGlmIChzaXplIDw9IDApIHJldHVybjtcbiAgICBsZXQgaW1nO1xuICAgIGlmIChraSA9PT0gMSkge1xuICAgICAgaW1nID0gYmxhY2tzW21vZCAlIGJsYWNrcy5sZW5ndGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbWcgPSB3aGl0ZXNbbW9kICUgd2hpdGVzLmxlbmd0aF07XG4gICAgfVxuICAgIGlmIChpbWcpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCB4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0FuYWx5c2lzUG9pbnRUaGVtZSwgTW92ZUluZm8sIFJvb3RJbmZvfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICBjYWxjQW5hbHlzaXNQb2ludENvbG9yLFxuICBjYWxjU2NvcmVEaWZmLFxuICBjYWxjU2NvcmVEaWZmVGV4dCxcbiAgbkZvcm1hdHRlcixcbiAgcm91bmQzLFxufSBmcm9tICcuLi9oZWxwZXInO1xuaW1wb3J0IHtcbiAgTElHSFRfR1JFRU5fUkdCLFxuICBMSUdIVF9SRURfUkdCLFxuICBMSUdIVF9ZRUxMT1dfUkdCLFxuICBZRUxMT1dfUkdCLFxufSBmcm9tICcuLi9jb25zdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuYWx5c2lzUG9pbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByaXZhdGUgeDogbnVtYmVyLFxuICAgIHByaXZhdGUgeTogbnVtYmVyLFxuICAgIHByaXZhdGUgcjogbnVtYmVyLFxuICAgIHByaXZhdGUgcm9vdEluZm86IFJvb3RJbmZvLFxuICAgIHByaXZhdGUgbW92ZUluZm86IE1vdmVJbmZvLFxuICAgIHByaXZhdGUgdGhlbWU6IEFuYWx5c2lzUG9pbnRUaGVtZSA9IEFuYWx5c2lzUG9pbnRUaGVtZS5EZWZhdWx0LFxuICAgIHByaXZhdGUgb3V0bGluZUNvbG9yPzogc3RyaW5nXG4gICkge31cblxuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHIsIHJvb3RJbmZvLCBtb3ZlSW5mbywgdGhlbWV9ID0gdGhpcztcbiAgICBpZiAociA8IDApIHJldHVybjtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICBjdHguc2hhZG93Q29sb3IgPSAnI2ZmZic7XG4gICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xuXG4gICAgLy8gdGhpcy5kcmF3RGVmYXVsdEFuYWx5c2lzUG9pbnQoKTtcbiAgICBpZiAodGhlbWUgPT09IEFuYWx5c2lzUG9pbnRUaGVtZS5EZWZhdWx0KSB7XG4gICAgICB0aGlzLmRyYXdEZWZhdWx0QW5hbHlzaXNQb2ludCgpO1xuICAgIH0gZWxzZSBpZiAodGhlbWUgPT09IEFuYWx5c2lzUG9pbnRUaGVtZS5Qcm9ibGVtKSB7XG4gICAgICB0aGlzLmRyYXdQcm9ibGVtQW5hbHlzaXNQb2ludCgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdQcm9ibGVtQW5hbHlzaXNQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm8sIG91dGxpbmVDb2xvcn0gPSB0aGlzO1xuICAgIGNvbnN0IHtvcmRlcn0gPSBtb3ZlSW5mbztcblxuICAgIGxldCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG5cbiAgICBpZiAob3JkZXIgPCA1KSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuOSwgeCwgeSwgcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjksICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBpZiAob3V0bGluZUNvbG9yKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSA0O1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBvdXRsaW5lQ29sb3I7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm9udFNpemUgPSByIC8gMS41O1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplICogMC44fXB4IFRhaG9tYWA7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZX1weCBUYWhvbWFgO1xuICAgICAgY29uc3Qgc2NvcmVUZXh0ID0gY2FsY1Njb3JlRGlmZlRleHQocm9vdEluZm8sIG1vdmVJbmZvKTtcbiAgICAgIGN0eC5maWxsVGV4dChzY29yZVRleHQsIHgsIHkpO1xuXG4gICAgICBjdHguZm9udCA9IGAke2ZvbnRTaXplICogMC44fXB4IFRhaG9tYWA7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgIGN0eC5maWxsVGV4dChuRm9ybWF0dGVyKG1vdmVJbmZvLnZpc2l0cyksIHgsIHkgKyByIC8gMiArIGZvbnRTaXplIC8gOCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhd0NhbmRpZGF0ZVBvaW50KCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgZHJhd0RlZmF1bHRBbmFseXNpc1BvaW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHIsIHJvb3RJbmZvLCBtb3ZlSW5mb30gPSB0aGlzO1xuICAgIGNvbnN0IHtvcmRlcn0gPSBtb3ZlSW5mbztcblxuICAgIGxldCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG5cbiAgICBpZiAob3JkZXIgPCA1KSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgciAqIDAuOSwgeCwgeSwgcik7XG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjksICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGN0eC5maWxsKCk7XG5cbiAgICAgIGNvbnN0IGZvbnRTaXplID0gciAvIDEuNTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgIGNvbnN0IHdpbnJhdGUgPVxuICAgICAgICByb290SW5mby5jdXJyZW50UGxheWVyID09PSAnQidcbiAgICAgICAgICA/IG1vdmVJbmZvLndpbnJhdGVcbiAgICAgICAgICA6IDEgLSBtb3ZlSW5mby53aW5yYXRlO1xuXG4gICAgICBjdHguZmlsbFRleHQocm91bmQzKHdpbnJhdGUsIDEwMCwgMSksIHgsIHkgLSByIC8gMiArIGZvbnRTaXplIC8gNSk7XG5cbiAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggVGFob21hYDtcbiAgICAgIGNvbnN0IHNjb3JlVGV4dCA9IGNhbGNTY29yZURpZmZUZXh0KHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgICBjdHguZmlsbFRleHQoc2NvcmVUZXh0LCB4LCB5ICsgZm9udFNpemUgLyAzKTtcblxuICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZSAqIDAuOH1weCBUYWhvbWFgO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHguZmlsbFRleHQobkZvcm1hdHRlcihtb3ZlSW5mby52aXNpdHMpLCB4LCB5ICsgciAvIDIgKyBmb250U2l6ZSAvIDMpO1xuXG4gICAgICBjb25zdCBvcmRlciA9IG1vdmVJbmZvLm9yZGVyO1xuICAgICAgY3R4LmZpbGxUZXh0KChvcmRlciArIDEpLnRvU3RyaW5nKCksIHggKyByLCB5IC0gciAvIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXdDYW5kaWRhdGVQb2ludCgpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGRyYXdDYW5kaWRhdGVQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCByLCByb290SW5mbywgbW92ZUluZm99ID0gdGhpcztcbiAgICBjb25zdCBwQ29sb3IgPSBjYWxjQW5hbHlzaXNQb2ludENvbG9yKHJvb3RJbmZvLCBtb3ZlSW5mbyk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoeCwgeSwgciAqIDAuNiwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgIGN0eC5saW5lV2lkdGggPSAwO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICBjb25zdCBncmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCByICogMC40LCB4LCB5LCByKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgcENvbG9yKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC45NSwgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCcpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmt1cCB7XG4gIHByb3RlY3RlZCBnbG9iYWxBbHBoYSA9IDE7XG4gIHByb3RlY3RlZCBjb2xvciA9ICcnO1xuICBwcm90ZWN0ZWQgbGluZURhc2g6IG51bWJlcltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgczogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCB2YWw6IHN0cmluZyB8IG51bWJlciA9ICcnXG4gICkge31cblxuICBkcmF3KCkge1xuICAgIGNvbnNvbGUubG9nKCdUQkQnKTtcbiAgfVxuXG4gIHNldEdsb2JhbEFscGhhKGFscGhhOiBudW1iZXIpIHtcbiAgICB0aGlzLmdsb2JhbEFscGhhID0gYWxwaGE7XG4gIH1cblxuICBzZXRDb2xvcihjb2xvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgc2V0TGluZURhc2gobGluZURhc2g6IG51bWJlcltdKSB7XG4gICAgdGhpcy5saW5lRGFzaCA9IGxpbmVEYXNoO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBDaXJjbGVNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYSwgY29sb3J9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC42NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICBjdHguc2V0TGluZURhc2godGhpcy5saW5lRGFzaCk7XG4gICAgaWYgKGtpID09PSAxKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gLTEpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjMDAwJztcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgfVxuICAgIGlmIChjb2xvcikgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgQ3Jvc3NNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBnbG9iYWxBbHBoYX0gPSB0aGlzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHMgKiAwLjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjU7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG4gICAgaWYgKGtpID09PSAxKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gLTEpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjMDAwJztcbiAgICB9IGVsc2Uge1xuICAgICAgc2l6ZSA9IHJhZGl1cyAqIDAuNTg7XG4gICAgfVxuICAgIGN0eC5tb3ZlVG8oeCAtIHNpemUsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggKyBzaXplLCB5ICsgc2l6ZSk7XG4gICAgY3R4Lm1vdmVUbyh4ICsgc2l6ZSwgeSAtIHNpemUpO1xuICAgIGN0eC5saW5lVG8oeCAtIHNpemUsIHkgKyBzaXplKTtcblxuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgVGV4dE1hcmt1cCBleHRlbmRzIE1hcmt1cCB7XG4gIGRyYXcoKSB7XG4gICAgY29uc3Qge2N0eCwgeCwgeSwgcywga2ksIHZhbCwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCBzaXplID0gcyAqIDAuODtcbiAgICBsZXQgZm9udFNpemUgPSBzaXplIC8gMS41O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gZ2xvYmFsQWxwaGE7XG5cbiAgICBpZiAoa2kgPT09IDEpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZic7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gLTEpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG4gICAgfVxuICAgIC8vIGVsc2Uge1xuICAgIC8vICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgLy8gfVxuICAgIGlmICh2YWwudG9TdHJpbmcoKS5sZW5ndGggPT09IDEpIHtcbiAgICAgIGZvbnRTaXplID0gc2l6ZSAvIDEuNTtcbiAgICB9IGVsc2UgaWYgKHZhbC50b1N0cmluZygpLmxlbmd0aCA9PT0gMikge1xuICAgICAgZm9udFNpemUgPSBzaXplIC8gMS44O1xuICAgIH0gZWxzZSB7XG4gICAgICBmb250U2l6ZSA9IHNpemUgLyAyLjA7XG4gICAgfVxuICAgIGN0eC5mb250ID0gYGJvbGQgJHtmb250U2l6ZX1weCBUYWhvbWFgO1xuICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgY3R4LmZpbGxUZXh0KHZhbC50b1N0cmluZygpLCB4LCB5ICsgMik7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmt1cCBmcm9tICcuL01hcmt1cEJhc2UnO1xuXG5leHBvcnQgY2xhc3MgU3F1YXJlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBsZXQgc2l6ZSA9IHMgKiAwLjU1O1xuICAgIGlmIChraSA9PT0gMSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAgIH0gZWxzZSBpZiAoa2kgPT09IC0xKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjMDAwJztcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBjdHgucmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC43NTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubW92ZVRvKHgsIHkgLSBzaXplKTtcbiAgICBjdHgubGluZVRvKHggLSBzaXplICogTWF0aC5jb3MoMC41MjMpLCB5ICsgc2l6ZSAqIE1hdGguc2luKDAuNTIzKSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgc2l6ZSAqIE1hdGguY29zKDAuNTIzKSwgeSArIHNpemUgKiBNYXRoLnNpbigwLjUyMykpO1xuXG4gICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgaWYgKGtpID09PSAxKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gLTEpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjMDAwJztcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgICBzaXplID0gcmFkaXVzICogMC43O1xuICAgIH1cbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIE5vZGVNYXJrdXAgZXh0ZW5kcyBNYXJrdXAge1xuICBkcmF3KCkge1xuICAgIGNvbnN0IHtjdHgsIHgsIHksIHMsIGtpLCBjb2xvciwgZ2xvYmFsQWxwaGF9ID0gdGhpcztcbiAgICBjb25zdCByYWRpdXMgPSBzICogMC41O1xuICAgIGxldCBzaXplID0gcmFkaXVzICogMC40O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5saW5lV2lkdGggPSA0O1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5zZXRMaW5lRGFzaCh0aGlzLmxpbmVEYXNoKTtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTWFya3VwIGZyb20gJy4vTWFya3VwQmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBBY3RpdmVOb2RlTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgY29sb3IsIGdsb2JhbEFscGhhfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuNTtcbiAgICBsZXQgc2l6ZSA9IHJhZGl1cyAqIDAuNTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSBnbG9iYWxBbHBoYTtcbiAgICBjdHgubGluZVdpZHRoID0gNDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgY3R4LnNldExpbmVEYXNoKHRoaXMubGluZURhc2gpO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY3R4LmFyYyh4LCB5LCBzaXplLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBjdHguYXJjKHgsIHksIHNpemUgKiAwLjQsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBNYXJrdXAgZnJvbSAnLi9NYXJrdXBCYXNlJztcblxuZXhwb3J0IGNsYXNzIENpcmNsZVNvbGlkTWFya3VwIGV4dGVuZHMgTWFya3VwIHtcbiAgZHJhdygpIHtcbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzLCBraSwgZ2xvYmFsQWxwaGEsIGNvbG9yfSA9IHRoaXM7XG4gICAgY29uc3QgcmFkaXVzID0gcyAqIDAuMjU7XG4gICAgbGV0IHNpemUgPSByYWRpdXMgKiAwLjY1O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdsb2JhbEFscGhhO1xuICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgIGN0eC5zZXRMaW5lRGFzaCh0aGlzLmxpbmVEYXNoKTtcbiAgICBpZiAoa2kgPT09IDEpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZic7XG4gICAgfSBlbHNlIGlmIChraSA9PT0gLTEpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIH1cbiAgICBpZiAoY29sb3IpIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGN0eC5hcmMoeCwgeSwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWZmZWN0QmFzZSB7XG4gIHByb3RlY3RlZCBnbG9iYWxBbHBoYSA9IDE7XG4gIHByb3RlY3RlZCBjb2xvciA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBwcm90ZWN0ZWQgeDogbnVtYmVyLFxuICAgIHByb3RlY3RlZCB5OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHNpemU6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQga2k6IG51bWJlclxuICApIHt9XG5cbiAgcGxheSgpIHtcbiAgICBjb25zb2xlLmxvZygnVEJEJyk7XG4gIH1cbn1cbiIsImltcG9ydCBFZmZlY3RCYXNlIGZyb20gJy4vRWZmZWN0QmFzZSc7XG5pbXBvcnQge2VuY29kZX0gZnJvbSAnanMtYmFzZTY0JztcblxuY29uc3QgYmFuU3ZnID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBjbGFzcz1cImJpIGJpLWJhblwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj5cbiAgPHBhdGggZD1cIk0xNSA4YTYuOTcgNi45NyAwIDAgMC0xLjcxLTQuNTg0bC05Ljg3NCA5Ljg3NUE3IDcgMCAwIDAgMTUgOE0yLjcxIDEyLjU4NGw5Ljg3NC05Ljg3NWE3IDcgMCAwIDAtOS44NzQgOS44NzRaTTE2IDhBOCA4IDAgMSAxIDAgOGE4IDggMCAwIDEgMTYgMFwiLz5cbjwvc3ZnPmA7XG5cbmV4cG9ydCBjbGFzcyBCYW5FZmZlY3QgZXh0ZW5kcyBFZmZlY3RCYXNlIHtcbiAgcHJpdmF0ZSBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgcHJpdmF0ZSBhbHBoYSA9IDA7XG4gIHByaXZhdGUgZmFkZUluRHVyYXRpb24gPSAyMDA7XG4gIHByaXZhdGUgZmFkZU91dER1cmF0aW9uID0gMTUwO1xuICBwcml2YXRlIHN0YXlEdXJhdGlvbiA9IDQwMDtcbiAgcHJpdmF0ZSBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICBwcml2YXRlIGlzRmFkaW5nT3V0ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHByb3RlY3RlZCB4OiBudW1iZXIsXG4gICAgcHJvdGVjdGVkIHk6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgc2l6ZTogbnVtYmVyLFxuICAgIHByb3RlY3RlZCBraTogbnVtYmVyXG4gICkge1xuICAgIHN1cGVyKGN0eCwgeCwgeSwgc2l6ZSwga2kpO1xuXG4gICAgLy8gQ29udmVydCBTVkcgc3RyaW5nIHRvIGEgZGF0YSBVUkxcbiAgICBjb25zdCBzdmdCbG9iID0gbmV3IEJsb2IoW2JhblN2Z10sIHt0eXBlOiAnaW1hZ2Uvc3ZnK3htbCd9KTtcblxuICAgIGNvbnN0IHN2Z0RhdGFVcmwgPSBgZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwke2VuY29kZShiYW5TdmcpfWA7XG5cbiAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgIHRoaXMuaW1nLnNyYyA9IHN2Z0RhdGFVcmw7XG4gIH1cblxuICBwbGF5ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5pbWcuY29tcGxldGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7Y3R4LCB4LCB5LCBzaXplLCBpbWcsIGZhZGVJbkR1cmF0aW9uLCBmYWRlT3V0RHVyYXRpb259ID0gdGhpcztcblxuICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgaWYgKCF0aGlzLnN0YXJ0VGltZSkge1xuICAgICAgdGhpcy5zdGFydFRpbWUgPSBub3c7XG4gICAgfVxuXG4gICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5hbHBoYTtcbiAgICBjdHguZHJhd0ltYWdlKGltZywgeCAtIHNpemUgLyAyLCB5IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XG5cbiAgICBjb25zdCBlbGFwc2VkID0gbm93IC0gdGhpcy5zdGFydFRpbWU7XG5cbiAgICBpZiAoIXRoaXMuaXNGYWRpbmdPdXQpIHtcbiAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1pbihlbGFwc2VkIC8gZmFkZUluRHVyYXRpb24sIDEpO1xuICAgICAgaWYgKGVsYXBzZWQgPj0gZmFkZUluRHVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaXNGYWRpbmdPdXQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIH0sIHRoaXMuc3RheUR1cmF0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZmFkZUVsYXBzZWQgPSBub3cgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1heCgxIC0gZmFkZUVsYXBzZWQgLyBmYWRlT3V0RHVyYXRpb24sIDApO1xuICAgICAgaWYgKGZhZGVFbGFwc2VkID49IGZhZGVPdXREdXJhdGlvbikge1xuICAgICAgICB0aGlzLmFscGhhID0gMDtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCh4IC0gc2l6ZSAvIDIsIHkgLSBzaXplIC8gMiwgc2l6ZSwgc2l6ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wbGF5KTtcbiAgfTtcbn1cbiIsImltcG9ydCB7Y29tcGFjdH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGNhbGNWaXNpYmxlQXJlYSxcbiAgcmV2ZXJzZU9mZnNldCxcbiAgemVyb3MsXG4gIGVtcHR5LFxuICBhMVRvUG9zLFxuICBvZmZzZXRBMU1vdmUsXG59IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB7XG4gIEExX0xFVFRFUlMsXG4gIEExX05VTUJFUlMsXG4gIERFRkFVTFRfT1BUSU9OUyxcbiAgTUFYX0JPQVJEX1NJWkUsXG4gIFRIRU1FX1JFU09VUkNFUyxcbn0gZnJvbSAnLi9jb25zdCc7XG5pbXBvcnQge1xuICBDdXJzb3IsXG4gIE1hcmt1cCxcbiAgVGhlbWUsXG4gIEtpLFxuICBBbmFseXNpcyxcbiAgR2hvc3RCYW5PcHRpb25zLFxuICBHaG9zdEJhbk9wdGlvbnNQYXJhbXMsXG4gIENlbnRlcixcbiAgQW5hbHlzaXNQb2ludFRoZW1lLFxuICBFZmZlY3QsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQge0ltYWdlU3RvbmUsIENvbG9yU3RvbmV9IGZyb20gJy4vc3RvbmVzJztcbmltcG9ydCBBbmFseXNpc1BvaW50IGZyb20gJy4vc3RvbmVzL0FuYWx5c2lzUG9pbnQnO1xuLy8gaW1wb3J0IHtjcmVhdGUsIG1lYW5EZXBlbmRlbmNpZXMsIHN0ZERlcGVuZGVuY2llc30gZnJvbSAnbWF0aGpzJztcblxuLy8gY29uc3QgY29uZmlnID0ge307XG4vLyBjb25zdCB7c3RkLCBtZWFufSA9IGNyZWF0ZSh7bWVhbkRlcGVuZGVuY2llcywgc3RkRGVwZW5kZW5jaWVzfSwgY29uZmlnKTtcblxuaW1wb3J0IHtcbiAgQ2lyY2xlTWFya3VwLFxuICBDcm9zc01hcmt1cCxcbiAgVGV4dE1hcmt1cCxcbiAgU3F1YXJlTWFya3VwLFxuICBUcmlhbmdsZU1hcmt1cCxcbiAgTm9kZU1hcmt1cCxcbiAgQWN0aXZlTm9kZU1hcmt1cCxcbiAgQ2lyY2xlU29saWRNYXJrdXAsXG59IGZyb20gJy4vbWFya3Vwcyc7XG5pbXBvcnQge0JhbkVmZmVjdH0gZnJvbSAnLi9lZmZlY3RzJztcblxuY29uc3QgaW1hZ2VzOiB7XG4gIFtrZXk6IHN0cmluZ106IEhUTUxJbWFnZUVsZW1lbnQ7XG59ID0ge307XG5cbmZ1bmN0aW9uIGlzTW9iaWxlRGV2aWNlKCkge1xuICByZXR1cm4gL01vYml8QW5kcm9pZHxpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QoXG4gICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICApO1xufVxuXG5mdW5jdGlvbiBwcmVsb2FkKHVybHM6IHN0cmluZ1tdLCBkb25lOiAoKSA9PiB2b2lkKSB7XG4gIGxldCBsb2FkZWQgPSAwO1xuICBjb25zdCBpbWFnZUxvYWRlZCA9ICgpID0+IHtcbiAgICBsb2FkZWQrKztcbiAgICBpZiAobG9hZGVkID09PSB1cmxzLmxlbmd0aCkge1xuICAgICAgZG9uZSgpO1xuICAgIH1cbiAgfTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cmxzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFpbWFnZXNbdXJsc1tpXV0pIHtcbiAgICAgIGltYWdlc1t1cmxzW2ldXSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2VzW3VybHNbaV1dLnNyYyA9IHVybHNbaV07XG4gICAgICBpbWFnZXNbdXJsc1tpXV0ub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZUxvYWRlZCgpO1xuICAgICAgfTtcbiAgICAgIGltYWdlc1t1cmxzW2ldXS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbWFnZUxvYWRlZCgpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cblxubGV0IGRwciA9IDEuMDtcbi8vIGJyb3dzZXIgY29kZVxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEuMDtcbn1cblxuZXhwb3J0IGNsYXNzIEdob3N0QmFuIHtcbiAgZGVmYXVsdE9wdGlvbnM6IEdob3N0QmFuT3B0aW9ucyA9IHtcbiAgICBib2FyZFNpemU6IDE5LFxuICAgIGR5bmFtaWNQYWRkaW5nOiBmYWxzZSxcbiAgICBwYWRkaW5nOiAxMCxcbiAgICBleHRlbnQ6IDMsXG4gICAgaW50ZXJhY3RpdmU6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGU6IHRydWUsXG4gICAgdGhlbWU6IFRoZW1lLkJsYWNrQW5kV2hpdGUsXG4gICAgYW5hbHlzaXNQb2ludFRoZW1lOiBBbmFseXNpc1BvaW50VGhlbWUuRGVmYXVsdCxcbiAgICBiYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICBzaG93QW5hbHlzaXM6IGZhbHNlLFxuICAgIGFkYXB0aXZlQm9hcmRMaW5lOiB0cnVlLFxuICAgIGJvYXJkRWRnZUxpbmVXaWR0aDogNSxcbiAgICBib2FyZExpbmVXaWR0aDogMSxcbiAgICBib2FyZExpbmVFeHRlbnQ6IDAuNSxcbiAgICB0aGVtZUZsYXRCb2FyZENvbG9yOiAnI0VDQjU1QScsXG4gICAgcG9zaXRpdmVOb2RlQ29sb3I6ICcjNGQ3YzBmJyxcbiAgICBuZWdhdGl2ZU5vZGVDb2xvcjogJyNiOTFjMWMnLFxuICAgIG5ldXRyYWxOb2RlQ29sb3I6ICcjYTE2MjA3JyxcbiAgICBkZWZhdWx0Tm9kZUNvbG9yOiAnIzQwNDA0MCcsXG4gICAgd2FybmluZ05vZGVDb2xvcjogJyNmZmRmMjAnLFxuICAgIHRoZW1lUmVzb3VyY2VzOiBUSEVNRV9SRVNPVVJDRVMsXG4gICAgbW92ZVNvdW5kOiBmYWxzZSxcbiAgICBhZGFwdGl2ZVN0YXJTaXplOiB0cnVlLFxuICAgIHN0YXJTaXplOiAzLFxuICAgIG1vYmlsZUluZGljYXRvck9mZnNldDogMCxcbiAgfTtcbiAgb3B0aW9uczogR2hvc3RCYW5PcHRpb25zO1xuICBkb206IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuICBjYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgYm9hcmQ/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgYW5hbHlzaXNDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgY3Vyc29yQ2FudmFzPzogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIG1hcmt1cENhbnZhcz86IEhUTUxDYW52YXNFbGVtZW50O1xuICBlZmZlY3RDYW52YXM/OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgbW92ZVNvdW5kQXVkaW8/OiBIVE1MQXVkaW9FbGVtZW50O1xuICB0dXJuOiBLaTtcbiAgcHJpdmF0ZSBjdXJzb3I6IEN1cnNvciA9IEN1cnNvci5Ob25lO1xuICBwcml2YXRlIGN1cnNvclZhbHVlOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSB0b3VjaE1vdmluZyA9IGZhbHNlO1xuICBwcml2YXRlIHRvdWNoU3RhcnRQb2ludDogRE9NUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgcHVibGljIGN1cnNvclBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdO1xuICBwdWJsaWMgYWN0dWFsQ3Vyc29yUG9zaXRpb246IFtudW1iZXIsIG51bWJlcl07XG4gIHB1YmxpYyBjdXJzb3JQb2ludDogRE9NUG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgcHVibGljIGFjdHVhbEN1cnNvclBvaW50OiBET01Qb2ludCA9IG5ldyBET01Qb2ludCgpO1xuICBwdWJsaWMgbWF0OiBudW1iZXJbXVtdO1xuICBwdWJsaWMgbWFya3VwOiBzdHJpbmdbXVtdO1xuICBwdWJsaWMgdmlzaWJsZUFyZWFNYXQ6IG51bWJlcltdW10gfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBwcmV2ZW50TW92ZU1hdDogbnVtYmVyW11bXTtcbiAgcHVibGljIGVmZmVjdE1hdDogc3RyaW5nW11bXTtcbiAgbWF4aHY6IG51bWJlcjtcbiAgdHJhbnNNYXQ6IERPTU1hdHJpeDtcbiAgYW5hbHlzaXM6IEFuYWx5c2lzIHwgbnVsbDtcbiAgdmlzaWJsZUFyZWE6IG51bWJlcltdW107XG4gIG5vZGVNYXJrdXBTdHlsZXM6IHtcbiAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICBjb2xvcjogc3RyaW5nO1xuICAgICAgbGluZURhc2g6IG51bWJlcltdO1xuICAgIH07XG4gIH07XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogR2hvc3RCYW5PcHRpb25zUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLmRlZmF1bHRPcHRpb25zLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplO1xuICAgIHRoaXMubWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLnByZXZlbnRNb3ZlTWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLm1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy5lZmZlY3RNYXQgPSBlbXB0eShbc2l6ZSwgc2l6ZV0pO1xuICAgIHRoaXMudHVybiA9IEtpLkJsYWNrO1xuICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBbLTEsIC0xXTtcbiAgICB0aGlzLmFjdHVhbEN1cnNvclBvc2l0aW9uID0gWy0xLCAtMV07XG4gICAgdGhpcy5tYXhodiA9IHNpemU7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICB0aGlzLmFuYWx5c2lzID0gbnVsbDtcbiAgICB0aGlzLnZpc2libGVBcmVhID0gW1xuICAgICAgWzAsIHNpemUgLSAxXSxcbiAgICAgIFswLCBzaXplIC0gMV0sXG4gICAgXTtcblxuICAgIGNvbnN0IGRlZmF1bHREYXNoZWRMaW5lRGFzaCA9IFs4LCA2XTtcbiAgICBjb25zdCBkZWZhdWx0RG90dGVkTGluZURhc2ggPSBbNCwgNF07XG5cbiAgICB0aGlzLm5vZGVNYXJrdXBTdHlsZXMgPSB7XG4gICAgICBbTWFya3VwLlBvc2l0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5wb3NpdGl2ZU5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLm5lZ2F0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5uZXV0cmFsTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5EZWZhdWx0Tm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5kZWZhdWx0Tm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy53YXJuaW5nTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogW10sXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZURhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMucG9zaXRpdmVOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZURhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMubmVnYXRpdmVOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsRGFzaGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5uZXV0cmFsTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdERhc2hlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdEYXNoZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLndhcm5pbmdOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZURvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMucG9zaXRpdmVOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZWdhdGl2ZURvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMubmVnYXRpdmVOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5OZXV0cmFsRG90dGVkTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5uZXV0cmFsTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdERvdHRlZE5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLldhcm5pbmdEb3R0ZWROb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLndhcm5pbmdOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5Qb3NpdGl2ZUFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMucG9zaXRpdmVOb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBbXSxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLk5lZ2F0aXZlQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5uZWdhdGl2ZU5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMubmV1dHJhbE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuRGVmYXVsdEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMuZGVmYXVsdE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuV2FybmluZ0FjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMud2FybmluZ05vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IFtdLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVEYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLnBvc2l0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVEYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLm5lZ2F0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbERhc2hlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMubmV1dHJhbE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREYXNoZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHREYXNoZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RGFzaGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nRGFzaGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy53YXJuaW5nTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERhc2hlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuUG9zaXRpdmVEb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLnBvc2l0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmVnYXRpdmVEb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLm5lZ2F0aXZlTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICAgIFtNYXJrdXAuTmV1dHJhbERvdHRlZEFjdGl2ZU5vZGVdOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMubmV1dHJhbE5vZGVDb2xvcixcbiAgICAgICAgbGluZURhc2g6IGRlZmF1bHREb3R0ZWRMaW5lRGFzaCxcbiAgICAgIH0sXG4gICAgICBbTWFya3VwLkRlZmF1bHREb3R0ZWRBY3RpdmVOb2RlXToge1xuICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLmRlZmF1bHROb2RlQ29sb3IsXG4gICAgICAgIGxpbmVEYXNoOiBkZWZhdWx0RG90dGVkTGluZURhc2gsXG4gICAgICB9LFxuICAgICAgW01hcmt1cC5XYXJuaW5nRG90dGVkQWN0aXZlTm9kZV06IHtcbiAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy53YXJuaW5nTm9kZUNvbG9yLFxuICAgICAgICBsaW5lRGFzaDogZGVmYXVsdERvdHRlZExpbmVEYXNoLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc2V0VHVybih0dXJuOiBLaSkge1xuICAgIHRoaXMudHVybiA9IHR1cm47XG4gIH1cblxuICBzZXRCb2FyZFNpemUoc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5vcHRpb25zLmJvYXJkU2l6ZSA9IE1hdGgubWluKHNpemUsIE1BWF9CT0FSRF9TSVpFKTtcbiAgfVxuXG4gIHJlc2l6ZSgpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5jYW52YXMgfHxcbiAgICAgICF0aGlzLmN1cnNvckNhbnZhcyB8fFxuICAgICAgIXRoaXMuZG9tIHx8XG4gICAgICAhdGhpcy5ib2FyZCB8fFxuICAgICAgIXRoaXMubWFya3VwQ2FudmFzIHx8XG4gICAgICAhdGhpcy5hbmFseXNpc0NhbnZhcyB8fFxuICAgICAgIXRoaXMuZWZmZWN0Q2FudmFzXG4gICAgKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgY2FudmFzZXMgPSBbXG4gICAgICB0aGlzLmJvYXJkLFxuICAgICAgdGhpcy5jYW52YXMsXG4gICAgICB0aGlzLm1hcmt1cENhbnZhcyxcbiAgICAgIHRoaXMuY3Vyc29yQ2FudmFzLFxuICAgICAgdGhpcy5hbmFseXNpc0NhbnZhcyxcbiAgICAgIHRoaXMuZWZmZWN0Q2FudmFzLFxuICAgIF07XG5cbiAgICBjb25zdCB7c2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3Qge2NsaWVudFdpZHRofSA9IHRoaXMuZG9tO1xuXG4gICAgY2FudmFzZXMuZm9yRWFjaChjYW52YXMgPT4ge1xuICAgICAgaWYgKHNpemUpIHtcbiAgICAgICAgY2FudmFzLndpZHRoID0gc2l6ZSAqIGRwcjtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IHNpemUgKiBkcHI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBjbGllbnRXaWR0aCArICdweCc7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBjbGllbnRXaWR0aCArICdweCc7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IE1hdGguZmxvb3IoY2xpZW50V2lkdGggKiBkcHIpO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gTWF0aC5mbG9vcihjbGllbnRXaWR0aCAqIGRwcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG4gIHByaXZhdGUgY3JlYXRlQ2FudmFzKGlkOiBzdHJpbmcsIHBvaW50ZXJFdmVudHMgPSB0cnVlKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgY2FudmFzLmlkID0gaWQ7XG4gICAgaWYgKCFwb2ludGVyRXZlbnRzKSB7XG4gICAgICBjYW52YXMuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICB9XG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxuXG4gIGluaXQoZG9tOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplO1xuICAgIHRoaXMubWF0ID0gemVyb3MoW3NpemUsIHNpemVdKTtcbiAgICB0aGlzLm1hcmt1cCA9IGVtcHR5KFtzaXplLCBzaXplXSk7XG4gICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcblxuICAgIHRoaXMuYm9hcmQgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tYm9hcmQnKTtcbiAgICB0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1jYW52YXMnKTtcbiAgICB0aGlzLm1hcmt1cENhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1tYXJrdXAnLCBmYWxzZSk7XG4gICAgdGhpcy5jdXJzb3JDYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygnZ2hvc3RiYW4tY3Vyc29yJyk7XG4gICAgdGhpcy5hbmFseXNpc0NhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1hbmFseXNpcycsIGZhbHNlKTtcbiAgICB0aGlzLmVmZmVjdENhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCdnaG9zdGJhbi1lZmZlY3QnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmRvbSA9IGRvbTtcbiAgICBkb20uaW5uZXJIVE1MID0gJyc7IC8vIENsZWFyIGV4aXN0aW5nIGNoaWxkcmVuXG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuYm9hcmQpO1xuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMubWFya3VwQ2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5hbmFseXNpc0NhbnZhcyk7XG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuY3Vyc29yQ2FudmFzKTtcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5lZmZlY3RDYW52YXMpO1xuXG4gICAgdGhpcy5yZXNpemUoKTtcbiAgICB0aGlzLnJlbmRlckludGVyYWN0aXZlKCk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXRPcHRpb25zKG9wdGlvbnM6IEdob3N0QmFuT3B0aW9uc1BhcmFtcykge1xuICAgIHRoaXMub3B0aW9ucyA9IHsuLi50aGlzLm9wdGlvbnMsIC4uLm9wdGlvbnN9O1xuICAgIC8vIFRoZSBvbk1vdXNlTW92ZSBldmVudCBuZWVkcyB0byBiZSByZS1hZGRlZCBhZnRlciB0aGUgb3B0aW9ucyBhcmUgdXBkYXRlZFxuICAgIHRoaXMucmVuZGVySW50ZXJhY3RpdmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2V0TWF0KG1hdDogbnVtYmVyW11bXSkge1xuICAgIHRoaXMubWF0ID0gbWF0O1xuICAgIGlmICghdGhpcy52aXNpYmxlQXJlYU1hdCkge1xuICAgICAgdGhpcy52aXNpYmxlQXJlYU1hdCA9IG1hdDtcbiAgICB9XG4gIH1cblxuICBzZXRWaXNpYmxlQXJlYU1hdChtYXQ6IG51bWJlcltdW10pIHtcbiAgICB0aGlzLnZpc2libGVBcmVhTWF0ID0gbWF0O1xuICB9XG5cbiAgc2V0UHJldmVudE1vdmVNYXQobWF0OiBudW1iZXJbXVtdKSB7XG4gICAgdGhpcy5wcmV2ZW50TW92ZU1hdCA9IG1hdDtcbiAgfVxuXG4gIHNldEVmZmVjdE1hdChtYXQ6IHN0cmluZ1tdW10pIHtcbiAgICB0aGlzLmVmZmVjdE1hdCA9IG1hdDtcbiAgfVxuXG4gIHNldE1hcmt1cChtYXJrdXA6IHN0cmluZ1tdW10pIHtcbiAgICB0aGlzLm1hcmt1cCA9IG1hcmt1cDtcbiAgfVxuXG4gIHNldEN1cnNvcihjdXJzb3I6IEN1cnNvciwgdmFsdWUgPSAnJykge1xuICAgIHRoaXMuY3Vyc29yID0gY3Vyc29yO1xuICAgIHRoaXMuY3Vyc29yVmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldEN1cnNvcldpdGhSZW5kZXIgPSAoZG9tUG9pbnQ6IERPTVBvaW50LCBvZmZzZXRZID0gMCkgPT4ge1xuICAgIC8vIHNwYWNlIG5lZWQgcmVjYWxjdWxhdGUgZXZlcnkgdGltZVxuICAgIGNvbnN0IHtwYWRkaW5nfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCB7c3BhY2V9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLnRyYW5zTWF0LmludmVyc2UoKS50cmFuc2Zvcm1Qb2ludChkb21Qb2ludCk7XG4gICAgY29uc3QgaWR4ID0gTWF0aC5yb3VuZCgocG9pbnQueCAtIHBhZGRpbmcgKyBzcGFjZSAvIDIpIC8gc3BhY2UpO1xuICAgIGNvbnN0IGlkeSA9IE1hdGgucm91bmQoKHBvaW50LnkgLSBwYWRkaW5nICsgc3BhY2UgLyAyKSAvIHNwYWNlKSArIG9mZnNldFk7XG4gICAgY29uc3QgeHggPSBpZHggKiBzcGFjZTtcbiAgICBjb25zdCB5eSA9IGlkeSAqIHNwYWNlO1xuICAgIGNvbnN0IHBvaW50T25DYW52YXMgPSBuZXcgRE9NUG9pbnQoeHgsIHl5KTtcbiAgICBjb25zdCBwID0gdGhpcy50cmFuc01hdC50cmFuc2Zvcm1Qb2ludChwb2ludE9uQ2FudmFzKTtcbiAgICB0aGlzLmFjdHVhbEN1cnNvclBvaW50ID0gcDtcbiAgICB0aGlzLmFjdHVhbEN1cnNvclBvc2l0aW9uID0gW2lkeCAtIDEsIGlkeSAtIDFdO1xuXG4gICAgaWYgKHRoaXMucHJldmVudE1vdmVNYXQ/LltpZHggLSAxXT8uW2lkeSAtIDFdID09PSAxKSB7XG4gICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gWy0xLCAtMV07XG4gICAgICB0aGlzLmN1cnNvclBvaW50ID0gbmV3IERPTVBvaW50KCk7XG4gICAgICB0aGlzLmRyYXdDdXJzb3IoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpZiAoXG4gICAgLy8gICAhaXNNb2JpbGVEZXZpY2UoKSB8fFxuICAgIC8vICAgKGlzTW9iaWxlRGV2aWNlKCkgJiYgdGhpcy5tYXQ/LltpZHggLSAxXT8uW2lkeSAtIDFdID09PSAwKVxuICAgIC8vICkge1xuICAgIC8vIH1cbiAgICB0aGlzLmN1cnNvclBvaW50ID0gcDtcbiAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gW2lkeCAtIDEsIGlkeSAtIDFdO1xuICAgIHRoaXMuZHJhd0N1cnNvcigpO1xuXG4gICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHRoaXMuZHJhd0JvYXJkKCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBvbk1vdXNlTW92ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBwb2ludCA9IG5ldyBET01Qb2ludChlLm9mZnNldFggKiBkcHIsIGUub2Zmc2V0WSAqIGRwcik7XG4gICAgdGhpcy5zZXRDdXJzb3JXaXRoUmVuZGVyKHBvaW50KTtcbiAgfTtcblxuICBwcml2YXRlIGNhbGNUb3VjaFBvaW50ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBsZXQgcG9pbnQgPSBuZXcgRE9NUG9pbnQoKTtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN1cnNvckNhbnZhcztcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuIHBvaW50O1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdG91Y2hlcyA9IGUuY2hhbmdlZFRvdWNoZXM7XG4gICAgcG9pbnQgPSBuZXcgRE9NUG9pbnQoXG4gICAgICAodG91Y2hlc1swXS5jbGllbnRYIC0gcmVjdC5sZWZ0KSAqIGRwcixcbiAgICAgICh0b3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcCkgKiBkcHJcbiAgICApO1xuICAgIHJldHVybiBwb2ludDtcbiAgfTtcblxuICBwcml2YXRlIG9uVG91Y2hTdGFydCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnRvdWNoTW92aW5nID0gdHJ1ZTtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMuY2FsY1RvdWNoUG9pbnQoZSk7XG4gICAgdGhpcy50b3VjaFN0YXJ0UG9pbnQgPSBwb2ludDtcbiAgICB0aGlzLnNldEN1cnNvcldpdGhSZW5kZXIocG9pbnQpO1xuICB9O1xuXG4gIHByaXZhdGUgb25Ub3VjaE1vdmUgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy50b3VjaE1vdmluZyA9IHRydWU7XG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLmNhbGNUb3VjaFBvaW50KGUpO1xuICAgIGxldCBvZmZzZXQgPSAwO1xuICAgIGxldCBkaXN0YW5jZSA9IDEwO1xuICAgIGlmIChcbiAgICAgIE1hdGguYWJzKHBvaW50LnggLSB0aGlzLnRvdWNoU3RhcnRQb2ludC54KSA+IGRpc3RhbmNlIHx8XG4gICAgICBNYXRoLmFicyhwb2ludC55IC0gdGhpcy50b3VjaFN0YXJ0UG9pbnQueSkgPiBkaXN0YW5jZVxuICAgICkge1xuICAgICAgb2Zmc2V0ID0gdGhpcy5vcHRpb25zLm1vYmlsZUluZGljYXRvck9mZnNldDtcbiAgICB9XG4gICAgdGhpcy5zZXRDdXJzb3JXaXRoUmVuZGVyKHBvaW50LCBvZmZzZXQpO1xuICB9O1xuXG4gIHByaXZhdGUgb25Ub3VjaEVuZCA9ICgpID0+IHtcbiAgICB0aGlzLnRvdWNoTW92aW5nID0gZmFsc2U7XG4gIH07XG5cbiAgcmVuZGVySW50ZXJhY3RpdmUoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jdXJzb3JDYW52YXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQpO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXJDdXJzb3JDYW52YXMoKTtcbiAgfVxuXG4gIHNldEFuYWx5c2lzKGFuYWx5c2lzOiBBbmFseXNpcyB8IG51bGwpIHtcbiAgICB0aGlzLmFuYWx5c2lzID0gYW5hbHlzaXM7XG4gICAgaWYgKCFhbmFseXNpcykge1xuICAgICAgdGhpcy5jbGVhckFuYWx5c2lzQ2FudmFzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0FuYWx5c2lzKSB0aGlzLmRyYXdBbmFseXNpcyhhbmFseXNpcyk7XG4gIH1cblxuICBzZXRUaGVtZSh0aGVtZTogVGhlbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHt0aGVtZVJlc291cmNlc30gPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKCF0aGVtZVJlc291cmNlc1t0aGVtZV0pIHJldHVybjtcbiAgICBjb25zdCB7Ym9hcmQsIGJsYWNrcywgd2hpdGVzfSA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXTtcbiAgICB0aGlzLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgICB0aGVtZSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcbiAgICBwcmVsb2FkKGNvbXBhY3QoW2JvYXJkLCAuLi5ibGFja3MsIC4uLndoaXRlc10pLCAoKSA9PiB7XG4gICAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgICB0aGlzLmRyYXdCb2FyZCgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBjYWxjQ2VudGVyID0gKCk6IENlbnRlciA9PiB7XG4gICAgY29uc3Qge3Zpc2libGVBcmVhfSA9IHRoaXM7XG4gICAgY29uc3Qge2JvYXJkU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAoXG4gICAgICAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDAgJiYgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbiAgICB9XG5cbiAgICBpZiAodmlzaWJsZUFyZWFbMF1bMF0gPT09IDApIHtcbiAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCkgcmV0dXJuIENlbnRlci5Ub3BMZWZ0O1xuICAgICAgZWxzZSBpZiAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHJldHVybiBDZW50ZXIuQm90dG9tTGVmdDtcbiAgICAgIGVsc2UgcmV0dXJuIENlbnRlci5MZWZ0O1xuICAgIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgIGlmICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCkgcmV0dXJuIENlbnRlci5Ub3BSaWdodDtcbiAgICAgIGVsc2UgaWYgKHZpc2libGVBcmVhWzFdWzFdID09PSBib2FyZFNpemUgLSAxKSByZXR1cm4gQ2VudGVyLkJvdHRvbVJpZ2h0O1xuICAgICAgZWxzZSByZXR1cm4gQ2VudGVyLlJpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPT09IDApIHJldHVybiBDZW50ZXIuVG9wO1xuICAgICAgZWxzZSBpZiAodmlzaWJsZUFyZWFbMV1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHJldHVybiBDZW50ZXIuQm90dG9tO1xuICAgICAgZWxzZSByZXR1cm4gQ2VudGVyLkNlbnRlcjtcbiAgICB9XG4gIH07XG5cbiAgY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZTogbnVtYmVyKSB7XG4gICAgY29uc3Qge2Nvb3JkaW5hdGV9ID0gdGhpcy5vcHRpb25zO1xuICAgIC8vIGxldCBwYWRkaW5nID0gMzA7XG4gICAgLy8gaWYgKHZpc2libGVBcmVhU2l6ZSA8PSAzKSB7XG4gICAgLy8gICBwYWRkaW5nID0gY29vcmRpbmF0ZSA/IDEyMCA6IDEwMDtcbiAgICAvLyB9IGVsc2UgaWYgKHZpc2libGVBcmVhU2l6ZSA8PSA2KSB7XG4gICAgLy8gICBwYWRkaW5nID0gY29vcmRpbmF0ZSA/IDgwIDogNjA7XG4gICAgLy8gfSBlbHNlIGlmICh2aXNpYmxlQXJlYVNpemUgPD0gOSkge1xuICAgIC8vICAgcGFkZGluZyA9IGNvb3JkaW5hdGUgPyA2MCA6IDUwO1xuICAgIC8vIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFTaXplIDw9IDEyKSB7XG4gICAgLy8gICBwYWRkaW5nID0gY29vcmRpbmF0ZSA/IDUwIDogNDA7XG4gICAgLy8gfSBlbHNlIGlmICh2aXNpYmxlQXJlYVNpemUgPD0gMTUpIHtcbiAgICAvLyAgIHBhZGRpbmcgPSBjb29yZGluYXRlID8gNDAgOiAzMDtcbiAgICAvLyB9IGVsc2UgaWYgKHZpc2libGVBcmVhU2l6ZSA8PSAxNykge1xuICAgIC8vICAgcGFkZGluZyA9IGNvb3JkaW5hdGUgPyAzNSA6IDI1O1xuICAgIC8vIH0gZWxzZSBpZiAodmlzaWJsZUFyZWFTaXplIDw9IDE5KSB7XG4gICAgLy8gICBwYWRkaW5nID0gY29vcmRpbmF0ZSA/IDMwIDogMjA7XG4gICAgLy8gfVxuXG4gICAgY29uc3Qge2NhbnZhc30gPSB0aGlzO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgcGFkZGluZyA9IGNhbnZhcy53aWR0aCAvICh2aXNpYmxlQXJlYVNpemUgKyAyKSAvIDI7XG4gICAgY29uc3QgcGFkZGluZ1dpdGhvdXRDb29yZGluYXRlID0gY2FudmFzLndpZHRoIC8gKHZpc2libGVBcmVhU2l6ZSArIDIpIC8gNDtcblxuICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gY29vcmRpbmF0ZSA/IHBhZGRpbmcgOiBwYWRkaW5nV2l0aG91dENvb3JkaW5hdGU7XG4gICAgLy8gdGhpcy5yZW5kZXJJbnRlcmFjdGl2ZSgpO1xuICB9XG5cbiAgem9vbUJvYXJkKHpvb20gPSBmYWxzZSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNhbnZhcyxcbiAgICAgIGFuYWx5c2lzQ2FudmFzLFxuICAgICAgYm9hcmQsXG4gICAgICBjdXJzb3JDYW52YXMsXG4gICAgICBtYXJrdXBDYW52YXMsXG4gICAgICBlZmZlY3RDYW52YXMsXG4gICAgfSA9IHRoaXM7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcbiAgICBjb25zdCB7Ym9hcmRTaXplLCBleHRlbnQsIGJvYXJkTGluZUV4dGVudCwgcGFkZGluZywgZHluYW1pY1BhZGRpbmd9ID1cbiAgICAgIHRoaXMub3B0aW9ucztcbiAgICBjb25zdCB6b29tZWRWaXNpYmxlQXJlYSA9IGNhbGNWaXNpYmxlQXJlYShcbiAgICAgIHRoaXMudmlzaWJsZUFyZWFNYXQsXG4gICAgICBleHRlbnQsXG4gICAgICBmYWxzZVxuICAgICk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGJvYXJkQ3R4ID0gYm9hcmQ/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgY3Vyc29yQ3R4ID0gY3Vyc29yQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IG1hcmt1cEN0eCA9IG1hcmt1cENhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBhbmFseXNpc0N0eCA9IGFuYWx5c2lzQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGVmZmVjdEN0eCA9IGVmZmVjdENhbnZhcz8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCB2aXNpYmxlQXJlYSA9IHpvb21cbiAgICAgID8gem9vbWVkVmlzaWJsZUFyZWFcbiAgICAgIDogW1xuICAgICAgICAgIFswLCBib2FyZFNpemUgLSAxXSxcbiAgICAgICAgICBbMCwgYm9hcmRTaXplIC0gMV0sXG4gICAgICAgIF07XG5cbiAgICB0aGlzLnZpc2libGVBcmVhID0gdmlzaWJsZUFyZWE7XG4gICAgY29uc3QgdmlzaWJsZUFyZWFTaXplID0gTWF0aC5tYXgoXG4gICAgICB2aXNpYmxlQXJlYVswXVsxXSAtIHZpc2libGVBcmVhWzBdWzBdLFxuICAgICAgdmlzaWJsZUFyZWFbMV1bMV0gLSB2aXNpYmxlQXJlYVsxXVswXVxuICAgICk7XG5cbiAgICBpZiAoZHluYW1pY1BhZGRpbmcpIHtcbiAgICAgIHRoaXMuY2FsY0R5bmFtaWNQYWRkaW5nKHZpc2libGVBcmVhU2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gREVGQVVMVF9PUFRJT05TLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgaWYgKHpvb20pIHtcbiAgICAgIGNvbnN0IHtzcGFjZX0gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuY2FsY0NlbnRlcigpO1xuXG4gICAgICBpZiAoZHluYW1pY1BhZGRpbmcpIHtcbiAgICAgICAgdGhpcy5jYWxjRHluYW1pY1BhZGRpbmcodmlzaWJsZUFyZWFTaXplKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wYWRkaW5nID0gREVGQVVMVF9PUFRJT05TLnBhZGRpbmc7XG4gICAgICB9XG5cbiAgICAgIGxldCBleHRyYVZpc2libGVTaXplID0gYm9hcmRMaW5lRXh0ZW50ICogMiArIDE7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQgfHxcbiAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21SaWdodCB8fFxuICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0XG4gICAgICApIHtcbiAgICAgICAgZXh0cmFWaXNpYmxlU2l6ZSA9IGJvYXJkTGluZUV4dGVudCArIDAuNTtcbiAgICAgIH1cbiAgICAgIGxldCB6b29tZWRCb2FyZFNpemUgPSB2aXNpYmxlQXJlYVNpemUgKyBleHRyYVZpc2libGVTaXplO1xuXG4gICAgICBpZiAoem9vbWVkQm9hcmRTaXplIDwgYm9hcmRTaXplKSB7XG4gICAgICAgIGxldCBzY2FsZSA9IChjYW52YXMud2lkdGggLSBwYWRkaW5nICogMikgLyAoem9vbWVkQm9hcmRTaXplICogc3BhY2UpO1xuXG4gICAgICAgIGxldCBvZmZzZXRYID1cbiAgICAgICAgICB2aXNpYmxlQXJlYVswXVswXSAqIHNwYWNlICogc2NhbGUgK1xuICAgICAgICAgIC8vIGZvciBwYWRkaW5nXG4gICAgICAgICAgcGFkZGluZyAqIHNjYWxlIC1cbiAgICAgICAgICBwYWRkaW5nIC1cbiAgICAgICAgICAvLyBmb3IgYm9hcmQgbGluZSBleHRlbnRcbiAgICAgICAgICAoc3BhY2UgKiBleHRyYVZpc2libGVTaXplICogc2NhbGUpIC8gMiArXG4gICAgICAgICAgKHNwYWNlICogc2NhbGUpIC8gMjtcblxuICAgICAgICBsZXQgb2Zmc2V0WSA9XG4gICAgICAgICAgdmlzaWJsZUFyZWFbMV1bMF0gKiBzcGFjZSAqIHNjYWxlICtcbiAgICAgICAgICAvLyBmb3IgcGFkZGluZ1xuICAgICAgICAgIHBhZGRpbmcgKiBzY2FsZSAtXG4gICAgICAgICAgcGFkZGluZyAtXG4gICAgICAgICAgLy8gZm9yIGJvYXJkIGxpbmUgZXh0ZW50XG4gICAgICAgICAgKHNwYWNlICogZXh0cmFWaXNpYmxlU2l6ZSAqIHNjYWxlKSAvIDIgK1xuICAgICAgICAgIChzcGFjZSAqIHNjYWxlKSAvIDI7XG5cbiAgICAgICAgdGhpcy50cmFuc01hdCA9IG5ldyBET01NYXRyaXgoKTtcbiAgICAgICAgdGhpcy50cmFuc01hdC50cmFuc2xhdGVTZWxmKC1vZmZzZXRYLCAtb2Zmc2V0WSk7XG4gICAgICAgIHRoaXMudHJhbnNNYXQuc2NhbGVTZWxmKHNjYWxlLCBzY2FsZSk7XG4gICAgICAgIGN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBib2FyZEN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBhbmFseXNpc0N0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgICBjdXJzb3JDdHg/LnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zTWF0KTtcbiAgICAgICAgbWFya3VwQ3R4Py5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc01hdCk7XG4gICAgICAgIGVmZmVjdEN0eD8uc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNNYXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXNldFRyYW5zZm9ybSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgfVxuICB9XG5cbiAgY2FsY0JvYXJkVmlzaWJsZUFyZWEoem9vbSA9IGZhbHNlKSB7XG4gICAgdGhpcy56b29tQm9hcmQodGhpcy5vcHRpb25zLnpvb20pO1xuICB9XG5cbiAgcmVzZXRUcmFuc2Zvcm0oKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2FudmFzLFxuICAgICAgYW5hbHlzaXNDYW52YXMsXG4gICAgICBib2FyZCxcbiAgICAgIGN1cnNvckNhbnZhcyxcbiAgICAgIG1hcmt1cENhbnZhcyxcbiAgICAgIGVmZmVjdENhbnZhcyxcbiAgICB9ID0gdGhpcztcbiAgICBjb25zdCBjdHggPSBjYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgYm9hcmRDdHggPSBib2FyZD8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBjdXJzb3JDdHggPSBjdXJzb3JDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgbWFya3VwQ3R4ID0gbWFya3VwQ2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IGFuYWx5c2lzQ3R4ID0gYW5hbHlzaXNDYW52YXM/LmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgZWZmZWN0Q3R4ID0gZWZmZWN0Q2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMudHJhbnNNYXQgPSBuZXcgRE9NTWF0cml4KCk7XG4gICAgY3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGJvYXJkQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGFuYWx5c2lzQ3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICAgIGN1cnNvckN0eD8ucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICBtYXJrdXBDdHg/LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgZWZmZWN0Q3R4Py5yZXNldFRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXR9ID0gdGhpcztcbiAgICBpZiAodGhpcy5tYXQgJiYgbWF0WzBdKSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplID0gbWF0WzBdLmxlbmd0aDtcblxuICAgIC8vIFRPRE86IGNhbGMgdmlzaWJsZSBhcmVhIHR3aWNlIGlzIG5vdCBnb29kLCBuZWVkIHRvIHJlZmFjdG9yXG4gICAgdGhpcy56b29tQm9hcmQodGhpcy5vcHRpb25zLnpvb20pO1xuICAgIHRoaXMuem9vbUJvYXJkKHRoaXMub3B0aW9ucy56b29tKTtcbiAgICB0aGlzLmNsZWFyQWxsQ2FudmFzKCk7XG4gICAgdGhpcy5kcmF3Qm9hcmQoKTtcbiAgICB0aGlzLmRyYXdTdG9uZXMoKTtcbiAgICB0aGlzLmRyYXdNYXJrdXAoKTtcbiAgICB0aGlzLmRyYXdDdXJzb3IoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dBbmFseXNpcykgdGhpcy5kcmF3QW5hbHlzaXMoKTtcbiAgfVxuXG4gIHJlbmRlckluT25lQ2FudmFzKGNhbnZhcyA9IHRoaXMuY2FudmFzKSB7XG4gICAgdGhpcy5jbGVhckFsbENhbnZhcygpO1xuICAgIHRoaXMuZHJhd0JvYXJkKGNhbnZhcywgZmFsc2UpO1xuICAgIHRoaXMuZHJhd1N0b25lcyh0aGlzLm1hdCwgY2FudmFzLCBmYWxzZSk7XG4gICAgdGhpcy5kcmF3TWFya3VwKHRoaXMubWF0LCB0aGlzLm1hcmt1cCwgY2FudmFzLCBmYWxzZSk7XG4gIH1cblxuICBjbGVhckFsbENhbnZhcyA9ICgpID0+IHtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKHRoaXMuYm9hcmQpO1xuICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKHRoaXMubWFya3VwQ2FudmFzKTtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKHRoaXMuZWZmZWN0Q2FudmFzKTtcbiAgICB0aGlzLmNsZWFyQ3Vyc29yQ2FudmFzKCk7XG4gICAgdGhpcy5jbGVhckFuYWx5c2lzQ2FudmFzKCk7XG4gIH07XG5cbiAgY2xlYXJCb2FyZCA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuYm9hcmQpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSB0aGlzLmJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICAvLyBXaWxsIGFsd2F5cyBjbGVhciB0aGUgcmlnaHQgc3BhY2VcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH07XG5cbiAgY2xlYXJDYW52YXMgPSAoY2FudmFzID0gdGhpcy5jYW52YXMpID0+IHtcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH07XG5cbiAgY2xlYXJNYXJrdXBDYW52YXMgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLm1hcmt1cENhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMubWFya3VwQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMubWFya3VwQ2FudmFzLndpZHRoLCB0aGlzLm1hcmt1cENhbnZhcy5oZWlnaHQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH07XG5cbiAgY2xlYXJDdXJzb3JDYW52YXMgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmN1cnNvckNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuYm9hcmRTaXplO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3Vyc29yQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY3Vyc29yQ2FudmFzLndpZHRoLCB0aGlzLmN1cnNvckNhbnZhcy5oZWlnaHQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH07XG5cbiAgY2xlYXJBbmFseXNpc0NhbnZhcyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuYW5hbHlzaXNDYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSB0aGlzLmFuYWx5c2lzQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKGN0eCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB0aGlzLmFuYWx5c2lzQ2FudmFzLndpZHRoLFxuICAgICAgICB0aGlzLmFuYWx5c2lzQ2FudmFzLmhlaWdodFxuICAgICAgKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9O1xuXG4gIGRyYXdBbmFseXNpcyA9IChhbmFseXNpcyA9IHRoaXMuYW5hbHlzaXMpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmFuYWx5c2lzQ2FudmFzO1xuICAgIGNvbnN0IHtcbiAgICAgIHRoZW1lID0gVGhlbWUuQmxhY2tBbmRXaGl0ZSxcbiAgICAgIGFuYWx5c2lzUG9pbnRUaGVtZSxcbiAgICAgIGJvYXJkU2l6ZSxcbiAgICAgIGZvcmNlQW5hbHlzaXNCb2FyZFNpemUsXG4gICAgfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCB7bWF0LCBtYXJrdXB9ID0gdGhpcztcbiAgICBpZiAoIWNhbnZhcyB8fCAhYW5hbHlzaXMpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoIWN0eCkgcmV0dXJuO1xuICAgIHRoaXMuY2xlYXJBbmFseXNpc0NhbnZhcygpO1xuICAgIGNvbnN0IHtyb290SW5mb30gPSBhbmFseXNpcztcblxuICAgIGFuYWx5c2lzLm1vdmVJbmZvcy5mb3JFYWNoKG0gPT4ge1xuICAgICAgaWYgKG0ubW92ZSA9PT0gJ3Bhc3MnKSByZXR1cm47XG4gICAgICBjb25zdCBpZE9iaiA9IEpTT04ucGFyc2UoYW5hbHlzaXMuaWQpO1xuICAgICAgLy8gY29uc3Qge3g6IG94LCB5OiBveX0gPSByZXZlcnNlT2Zmc2V0KG1hdCwgaWRPYmouYngsIGlkT2JqLmJ5KTtcbiAgICAgIC8vIGxldCB7eDogaSwgeTogan0gPSBhMVRvUG9zKG0ubW92ZSk7XG4gICAgICAvLyBpICs9IG94O1xuICAgICAgLy8gaiArPSBveTtcbiAgICAgIC8vIGxldCBhbmFseXNpc0JvYXJkU2l6ZSA9IGZvcmNlQW5hbHlzaXNCb2FyZFNpemUgfHwgYm9hcmRTaXplO1xuICAgICAgbGV0IGFuYWx5c2lzQm9hcmRTaXplID0gYm9hcmRTaXplO1xuICAgICAgY29uc3Qgb2Zmc2V0ZWRNb3ZlID0gb2Zmc2V0QTFNb3ZlKFxuICAgICAgICBtLm1vdmUsXG4gICAgICAgIDAsXG4gICAgICAgIGFuYWx5c2lzQm9hcmRTaXplIC0gaWRPYmouYnlcbiAgICAgICk7XG4gICAgICBsZXQge3g6IGksIHk6IGp9ID0gYTFUb1BvcyhvZmZzZXRlZE1vdmUpO1xuICAgICAgaWYgKG1hdFtpXVtqXSAhPT0gMCkgcmV0dXJuO1xuICAgICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgY29uc3QgeCA9IHNjYWxlZFBhZGRpbmcgKyBpICogc3BhY2U7XG4gICAgICBjb25zdCB5ID0gc2NhbGVkUGFkZGluZyArIGogKiBzcGFjZTtcbiAgICAgIGNvbnN0IHJhdGlvID0gMC40NjtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBpZiAoXG4gICAgICAgIHRoZW1lICE9PSBUaGVtZS5TdWJkdWVkICYmXG4gICAgICAgIHRoZW1lICE9PSBUaGVtZS5CbGFja0FuZFdoaXRlICYmXG4gICAgICAgIHRoZW1lICE9PSBUaGVtZS5GbGF0XG4gICAgICApIHtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAzO1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDM7XG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICcjNTU1JztcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSA4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDA7XG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICcjZmZmJztcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xuICAgICAgfVxuXG4gICAgICBsZXQgb3V0bGluZUNvbG9yO1xuICAgICAgaWYgKG1hcmt1cFtpXVtqXS5pbmNsdWRlcyhNYXJrdXAuUG9zaXRpdmVOb2RlKSkge1xuICAgICAgICBvdXRsaW5lQ29sb3IgPSB0aGlzLm9wdGlvbnMucG9zaXRpdmVOb2RlQ29sb3I7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXJrdXBbaV1bal0uaW5jbHVkZXMoTWFya3VwLk5lZ2F0aXZlTm9kZSkpIHtcbiAgICAgICAgb3V0bGluZUNvbG9yID0gdGhpcy5vcHRpb25zLm5lZ2F0aXZlTm9kZUNvbG9yO1xuICAgICAgfVxuXG4gICAgICBpZiAobWFya3VwW2ldW2pdLmluY2x1ZGVzKE1hcmt1cC5OZXV0cmFsTm9kZSkpIHtcbiAgICAgICAgb3V0bGluZUNvbG9yID0gdGhpcy5vcHRpb25zLm5ldXRyYWxOb2RlQ29sb3I7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBvaW50ID0gbmV3IEFuYWx5c2lzUG9pbnQoXG4gICAgICAgIGN0eCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgc3BhY2UgKiByYXRpbyxcbiAgICAgICAgcm9vdEluZm8sXG4gICAgICAgIG0sXG4gICAgICAgIGFuYWx5c2lzUG9pbnRUaGVtZSxcbiAgICAgICAgb3V0bGluZUNvbG9yXG4gICAgICApO1xuICAgICAgcG9pbnQuZHJhdygpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9KTtcbiAgfTtcblxuICBkcmF3TWFya3VwID0gKFxuICAgIG1hdCA9IHRoaXMubWF0LFxuICAgIG1hcmt1cCA9IHRoaXMubWFya3VwLFxuICAgIG1hcmt1cENhbnZhcyA9IHRoaXMubWFya3VwQ2FudmFzLFxuICAgIGNsZWFyID0gdHJ1ZVxuICApID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBtYXJrdXBDYW52YXM7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgaWYgKGNsZWFyKSB0aGlzLmNsZWFyQ2FudmFzKGNhbnZhcyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcmt1cC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hcmt1cFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IG1hcmt1cFtpXVtqXTtcbiAgICAgICAgICB2YWx1ZXM/LnNwbGl0KCd8JykuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgICAgICAgICAgY29uc3QgeCA9IHNjYWxlZFBhZGRpbmcgKyBpICogc3BhY2U7XG4gICAgICAgICAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuICAgICAgICAgICAgICBjb25zdCBraSA9IG1hdFtpXVtqXTtcbiAgICAgICAgICAgICAgbGV0IG1hcmt1cDtcbiAgICAgICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkNpcmNsZToge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgQ2lyY2xlTWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5DdXJyZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBDaXJjbGVTb2xpZE1hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEYXNoZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEYXNoZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ0FjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nRGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdEb3R0ZWRBY3RpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdEFjdGl2ZU5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0RGFzaGVkQWN0aXZlTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHREb3R0ZWRBY3RpdmVOb2RlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7Y29sb3IsIGxpbmVEYXNofSA9IHRoaXMubm9kZU1hcmt1cFN0eWxlc1t2YWx1ZV07XG5cbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IEFjdGl2ZU5vZGVNYXJrdXAoXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICBraSxcbiAgICAgICAgICAgICAgICAgICAgICBNYXJrdXAuQ2lyY2xlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIG1hcmt1cC5zZXRMaW5lRGFzaChsaW5lRGFzaCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuUG9zaXRpdmVEb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVOb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEYXNoZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmVnYXRpdmVEb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTmV1dHJhbE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5OZXV0cmFsRGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLk5ldXRyYWxEb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuV2FybmluZ05vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5XYXJuaW5nRGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLldhcm5pbmdEb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuRGVmYXVsdE5vZGU6XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5EZWZhdWx0RGFzaGVkTm9kZTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgTWFya3VwLkRlZmF1bHREb3R0ZWROb2RlOlxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuTm9kZToge1xuICAgICAgICAgICAgICAgICAgICBsZXQge2NvbG9yLCBsaW5lRGFzaH0gPSB0aGlzLm5vZGVNYXJrdXBTdHlsZXNbdmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgTm9kZU1hcmt1cChcbiAgICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgIGtpLFxuICAgICAgICAgICAgICAgICAgICAgIE1hcmt1cC5DaXJjbGVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwLnNldExpbmVEYXNoKGxpbmVEYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5TcXVhcmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IFNxdWFyZU1hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FzZSBNYXJrdXAuVHJpYW5nbGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFya3VwID0gbmV3IFRyaWFuZ2xlTWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXNlIE1hcmt1cC5Dcm9zczoge1xuICAgICAgICAgICAgICAgICAgICBtYXJrdXAgPSBuZXcgQ3Jvc3NNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgIG1hcmt1cCA9IG5ldyBUZXh0TWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1hcmt1cD8uZHJhdygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZHJhd0JvYXJkID0gKGJvYXJkID0gdGhpcy5ib2FyZCwgY2xlYXIgPSB0cnVlKSA9PiB7XG4gICAgaWYgKGNsZWFyKSB0aGlzLmNsZWFyQ2FudmFzKGJvYXJkKTtcbiAgICB0aGlzLmRyYXdCYW4oYm9hcmQpO1xuICAgIHRoaXMuZHJhd0JvYXJkTGluZShib2FyZCk7XG4gICAgdGhpcy5kcmF3U3RhcnMoYm9hcmQpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29vcmRpbmF0ZSkge1xuICAgICAgdGhpcy5kcmF3Q29vcmRpbmF0ZSgpO1xuICAgIH1cbiAgfTtcblxuICBkcmF3QmFuID0gKGJvYXJkID0gdGhpcy5ib2FyZCkgPT4ge1xuICAgIGNvbnN0IHt0aGVtZSwgdGhlbWVSZXNvdXJjZXMsIHBhZGRpbmd9ID0gdGhpcy5vcHRpb25zO1xuICAgIGlmIChib2FyZCkge1xuICAgICAgYm9hcmQuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzJweCc7XG4gICAgICBjb25zdCBjdHggPSBib2FyZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgaWYgKGN0eCkge1xuICAgICAgICBpZiAodGhlbWUgPT09IFRoZW1lLkJsYWNrQW5kV2hpdGUpIHtcbiAgICAgICAgICBib2FyZC5zdHlsZS5ib3hTaGFkb3cgPSAnMHB4IDBweCAwcHggIzAwMDAwMCc7XG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJztcbiAgICAgICAgICBjdHguZmlsbFJlY3QoXG4gICAgICAgICAgICAtcGFkZGluZyxcbiAgICAgICAgICAgIC1wYWRkaW5nLFxuICAgICAgICAgICAgYm9hcmQud2lkdGggKyBwYWRkaW5nLFxuICAgICAgICAgICAgYm9hcmQuaGVpZ2h0ICsgcGFkZGluZ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhlbWUgPT09IFRoZW1lLkZsYXQpIHtcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5vcHRpb25zLnRoZW1lRmxhdEJvYXJkQ29sb3I7XG4gICAgICAgICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICAgICAgLXBhZGRpbmcsXG4gICAgICAgICAgICAtcGFkZGluZyxcbiAgICAgICAgICAgIGJvYXJkLndpZHRoICsgcGFkZGluZyxcbiAgICAgICAgICAgIGJvYXJkLmhlaWdodCArIHBhZGRpbmdcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRoZW1lID09PSBUaGVtZS5XYWxudXQgJiZcbiAgICAgICAgICB0aGVtZVJlc291cmNlc1t0aGVtZV0uYm9hcmQgIT09IHVuZGVmaW5lZFxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCBib2FyZFVybCA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXS5ib2FyZCB8fCAnJztcbiAgICAgICAgICBjb25zdCBib2FyZFJlcyA9IGltYWdlc1tib2FyZFVybF07XG4gICAgICAgICAgaWYgKGJvYXJkUmVzKSB7XG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgICBib2FyZFJlcyxcbiAgICAgICAgICAgICAgLXBhZGRpbmcsXG4gICAgICAgICAgICAgIC1wYWRkaW5nLFxuICAgICAgICAgICAgICBib2FyZC53aWR0aCArIHBhZGRpbmcsXG4gICAgICAgICAgICAgIGJvYXJkLmhlaWdodCArIHBhZGRpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGJvYXJkVXJsID0gdGhlbWVSZXNvdXJjZXNbdGhlbWVdLmJvYXJkIHx8ICcnO1xuICAgICAgICAgIGNvbnN0IGltYWdlID0gaW1hZ2VzW2JvYXJkVXJsXTtcbiAgICAgICAgICBpZiAoaW1hZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdHRlcm4gPSBjdHguY3JlYXRlUGF0dGVybihpbWFnZSwgJ3JlcGVhdCcpO1xuICAgICAgICAgICAgaWYgKHBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHBhdHRlcm47XG4gICAgICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCBib2FyZC53aWR0aCwgYm9hcmQuaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZHJhd0JvYXJkTGluZSA9IChib2FyZCA9IHRoaXMuYm9hcmQpID0+IHtcbiAgICBpZiAoIWJvYXJkKSByZXR1cm47XG4gICAgY29uc3Qge3Zpc2libGVBcmVhLCBvcHRpb25zfSA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgem9vbSxcbiAgICAgIGJvYXJkU2l6ZSxcbiAgICAgIGJvYXJkTGluZVdpZHRoLFxuICAgICAgYm9hcmRFZGdlTGluZVdpZHRoLFxuICAgICAgYm9hcmRMaW5lRXh0ZW50LFxuICAgICAgYWRhcHRpdmVCb2FyZExpbmUsXG4gICAgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoY3R4KSB7XG4gICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG5cbiAgICAgIGNvbnN0IGV4dGVuZFNwYWNlID0gem9vbSA/IGJvYXJkTGluZUV4dGVudCAqIHNwYWNlIDogMDtcblxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcblxuICAgICAgbGV0IGVkZ2VMaW5lV2lkdGggPSBhZGFwdGl2ZUJvYXJkTGluZVxuICAgICAgICA/IGJvYXJkLndpZHRoICogMC4wMDJcbiAgICAgICAgOiBib2FyZEVkZ2VMaW5lV2lkdGg7XG5cbiAgICAgIC8vIGlmIChhZGFwdGl2ZUJvYXJkTGluZSB8fCAoIWFkYXB0aXZlQm9hcmRMaW5lICYmICFpc01vYmlsZURldmljZSgpKSkge1xuICAgICAgLy8gIGVkZ2VMaW5lV2lkdGggKj0gZHByO1xuICAgICAgLy8gfVxuXG4gICAgICBsZXQgbGluZVdpZHRoID0gYWRhcHRpdmVCb2FyZExpbmUgPyBib2FyZC53aWR0aCAqIDAuMDAxIDogYm9hcmRMaW5lV2lkdGg7XG5cbiAgICAgIC8vIGlmIChhZGFwdGl2ZUJvYXJkTGluZSB8fCAgKCFhZGFwdGl2ZUJvYXJkTGluZSAmJiAhaXNNb2JpbGVEZXZpY2UoKSkpIHtcbiAgICAgIC8vICAgbGluZVdpZHRoICo9IGRwcjtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gdmVydGljYWxcbiAgICAgIGZvciAobGV0IGkgPSB2aXNpYmxlQXJlYVswXVswXTsgaSA8PSB2aXNpYmxlQXJlYVswXVsxXTsgaSsrKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICh2aXNpYmxlQXJlYVswXVswXSA9PT0gMCAmJiBpID09PSAwKSB8fFxuICAgICAgICAgICh2aXNpYmxlQXJlYVswXVsxXSA9PT0gYm9hcmRTaXplIC0gMSAmJiBpID09PSBib2FyZFNpemUgLSAxKVxuICAgICAgICApIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gZWRnZUxpbmVXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc01vYmlsZURldmljZSgpICYmXG4gICAgICAgICAgaSA9PT0gdGhpcy5jdXJzb3JQb3NpdGlvblswXSAmJlxuICAgICAgICAgIHRoaXMudG91Y2hNb3ZpbmdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGN0eC5saW5lV2lkdGggKiAyO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdGFydFBvaW50WSA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNjYWxlZFBhZGRpbmcgKyB2aXNpYmxlQXJlYVsxXVswXSAqIHNwYWNlIC0gZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzFdWzBdICogc3BhY2U7XG4gICAgICAgIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgc3RhcnRQb2ludFkgKz0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kUG9pbnRZID1cbiAgICAgICAgICBpID09PSAwIHx8IGkgPT09IGJvYXJkU2l6ZSAtIDFcbiAgICAgICAgICAgID8gc3BhY2UgKiB2aXNpYmxlQXJlYVsxXVsxXSArIHNjYWxlZFBhZGRpbmcgKyBlZGdlTGluZVdpZHRoIC8gMlxuICAgICAgICAgICAgOiBzcGFjZSAqIHZpc2libGVBcmVhWzFdWzFdICsgc2NhbGVkUGFkZGluZztcbiAgICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICBlbmRQb2ludFkgLT0gZHByIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlzaWJsZUFyZWFbMV1bMF0gPiAwKSBzdGFydFBvaW50WSAtPSBleHRlbmRTcGFjZTtcbiAgICAgICAgaWYgKHZpc2libGVBcmVhWzFdWzFdIDwgYm9hcmRTaXplIC0gMSkgZW5kUG9pbnRZICs9IGV4dGVuZFNwYWNlO1xuICAgICAgICBjdHgubW92ZVRvKGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcsIHN0YXJ0UG9pbnRZKTtcbiAgICAgICAgY3R4LmxpbmVUbyhpICogc3BhY2UgKyBzY2FsZWRQYWRkaW5nLCBlbmRQb2ludFkpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGhvcml6b250YWxcbiAgICAgIGZvciAobGV0IGkgPSB2aXNpYmxlQXJlYVsxXVswXTsgaSA8PSB2aXNpYmxlQXJlYVsxXVsxXTsgaSsrKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICh2aXNpYmxlQXJlYVsxXVswXSA9PT0gMCAmJiBpID09PSAwKSB8fFxuICAgICAgICAgICh2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSAmJiBpID09PSBib2FyZFNpemUgLSAxKVxuICAgICAgICApIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gZWRnZUxpbmVXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc01vYmlsZURldmljZSgpICYmXG4gICAgICAgICAgaSA9PT0gdGhpcy5jdXJzb3JQb3NpdGlvblsxXSAmJlxuICAgICAgICAgIHRoaXMudG91Y2hNb3ZpbmdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGN0eC5saW5lV2lkdGggKiAyO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdGFydFBvaW50WCA9XG4gICAgICAgICAgaSA9PT0gMCB8fCBpID09PSBib2FyZFNpemUgLSAxXG4gICAgICAgICAgICA/IHNjYWxlZFBhZGRpbmcgKyB2aXNpYmxlQXJlYVswXVswXSAqIHNwYWNlIC0gZWRnZUxpbmVXaWR0aCAvIDJcbiAgICAgICAgICAgIDogc2NhbGVkUGFkZGluZyArIHZpc2libGVBcmVhWzBdWzBdICogc3BhY2U7XG4gICAgICAgIGxldCBlbmRQb2ludFggPVxuICAgICAgICAgIGkgPT09IDAgfHwgaSA9PT0gYm9hcmRTaXplIC0gMVxuICAgICAgICAgICAgPyBzcGFjZSAqIHZpc2libGVBcmVhWzBdWzFdICsgc2NhbGVkUGFkZGluZyArIGVkZ2VMaW5lV2lkdGggLyAyXG4gICAgICAgICAgICA6IHNwYWNlICogdmlzaWJsZUFyZWFbMF1bMV0gKyBzY2FsZWRQYWRkaW5nO1xuICAgICAgICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgIHN0YXJ0UG9pbnRYICs9IGRwciAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICBlbmRQb2ludFggLT0gZHByIC8gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2aXNpYmxlQXJlYVswXVswXSA+IDApIHN0YXJ0UG9pbnRYIC09IGV4dGVuZFNwYWNlO1xuICAgICAgICBpZiAodmlzaWJsZUFyZWFbMF1bMV0gPCBib2FyZFNpemUgLSAxKSBlbmRQb2ludFggKz0gZXh0ZW5kU3BhY2U7XG4gICAgICAgIGN0eC5tb3ZlVG8oc3RhcnRQb2ludFgsIGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcpO1xuICAgICAgICBjdHgubGluZVRvKGVuZFBvaW50WCwgaSAqIHNwYWNlICsgc2NhbGVkUGFkZGluZyk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZHJhd1N0YXJzID0gKGJvYXJkID0gdGhpcy5ib2FyZCkgPT4ge1xuICAgIGlmICghYm9hcmQpIHJldHVybjtcbiAgICBpZiAodGhpcy5vcHRpb25zLmJvYXJkU2l6ZSAhPT0gMTkpIHJldHVybjtcblxuICAgIGxldCB7c3RhclNpemU6IHN0YXJTaXplT3B0aW9ucywgYWRhcHRpdmVTdGFyU2l6ZX0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBjb25zdCB2aXNpYmxlQXJlYSA9IHRoaXMudmlzaWJsZUFyZWE7XG4gICAgY29uc3QgY3R4ID0gYm9hcmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBsZXQgc3RhclNpemUgPSBhZGFwdGl2ZVN0YXJTaXplID8gYm9hcmQud2lkdGggKiAwLjAwMzUgOiBzdGFyU2l6ZU9wdGlvbnM7XG4gICAgLy8gaWYgKCFpc01vYmlsZURldmljZSgpIHx8ICFhZGFwdGl2ZVN0YXJTaXplKSB7XG4gICAgLy8gICBzdGFyU2l6ZSA9IHN0YXJTaXplICogZHByO1xuICAgIC8vIH1cbiAgICBpZiAoY3R4KSB7XG4gICAgICBjb25zdCB7c3BhY2UsIHNjYWxlZFBhZGRpbmd9ID0gdGhpcy5jYWxjU3BhY2VBbmRQYWRkaW5nKCk7XG4gICAgICAvLyBEcmF3aW5nIHN0YXJcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIFszLCA5LCAxNV0uZm9yRWFjaChpID0+IHtcbiAgICAgICAgWzMsIDksIDE1XS5mb3JFYWNoKGogPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGkgPj0gdmlzaWJsZUFyZWFbMF1bMF0gJiZcbiAgICAgICAgICAgIGkgPD0gdmlzaWJsZUFyZWFbMF1bMV0gJiZcbiAgICAgICAgICAgIGogPj0gdmlzaWJsZUFyZWFbMV1bMF0gJiZcbiAgICAgICAgICAgIGogPD0gdmlzaWJsZUFyZWFbMV1bMV1cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5hcmMoXG4gICAgICAgICAgICAgIGkgKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcsXG4gICAgICAgICAgICAgIGogKiBzcGFjZSArIHNjYWxlZFBhZGRpbmcsXG4gICAgICAgICAgICAgIHN0YXJTaXplLFxuICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAyICogTWF0aC5QSSxcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGRyYXdDb29yZGluYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtib2FyZCwgb3B0aW9ucywgdmlzaWJsZUFyZWF9ID0gdGhpcztcbiAgICBpZiAoIWJvYXJkKSByZXR1cm47XG4gICAgY29uc3Qge2JvYXJkU2l6ZSwgem9vbSwgcGFkZGluZywgYm9hcmRMaW5lRXh0ZW50fSA9IG9wdGlvbnM7XG4gICAgbGV0IHpvb21lZEJvYXJkU2l6ZSA9IHZpc2libGVBcmVhWzBdWzFdIC0gdmlzaWJsZUFyZWFbMF1bMF0gKyAxO1xuICAgIGNvbnN0IGN0eCA9IGJvYXJkLmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3Qge3NwYWNlLCBzY2FsZWRQYWRkaW5nfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG4gICAgICBjdHguZm9udCA9IGBib2xkICR7c3BhY2UgLyAzfXB4IEhlbHZldGljYWA7XG5cbiAgICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuY2FsY0NlbnRlcigpO1xuICAgICAgbGV0IG9mZnNldCA9IHNwYWNlIC8gMS41O1xuXG4gICAgICBpZiAoXG4gICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkNlbnRlciAmJlxuICAgICAgICB2aXNpYmxlQXJlYVswXVswXSA9PT0gMCAmJlxuICAgICAgICB2aXNpYmxlQXJlYVswXVsxXSA9PT0gYm9hcmRTaXplIC0gMVxuICAgICAgKSB7XG4gICAgICAgIG9mZnNldCAtPSBzY2FsZWRQYWRkaW5nIC8gMjtcbiAgICAgIH1cblxuICAgICAgQTFfTEVUVEVSUy5mb3JFYWNoKChsLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCB4ID0gc3BhY2UgKiBpbmRleCArIHNjYWxlZFBhZGRpbmc7XG4gICAgICAgIGxldCBvZmZzZXRUb3AgPSBvZmZzZXQ7XG4gICAgICAgIGxldCBvZmZzZXRCb3R0b20gPSBvZmZzZXQ7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Ub3BcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2Zmc2V0VG9wIC09IHNwYWNlICogYm9hcmRMaW5lRXh0ZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21MZWZ0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5Cb3R0b21cbiAgICAgICAgKSB7XG4gICAgICAgICAgb2Zmc2V0Qm90dG9tIC09IChzcGFjZSAqIGJvYXJkTGluZUV4dGVudCkgLyAyO1xuICAgICAgICB9XG4gICAgICAgIGxldCB5MSA9IHZpc2libGVBcmVhWzFdWzBdICogc3BhY2UgKyBwYWRkaW5nIC0gb2Zmc2V0VG9wO1xuICAgICAgICBsZXQgeTIgPSB5MSArIHpvb21lZEJvYXJkU2l6ZSAqIHNwYWNlICsgb2Zmc2V0Qm90dG9tICogMjtcbiAgICAgICAgaWYgKGluZGV4ID49IHZpc2libGVBcmVhWzBdWzBdICYmIGluZGV4IDw9IHZpc2libGVBcmVhWzBdWzFdKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuQm90dG9tTGVmdCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuQm90dG9tUmlnaHQgJiZcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLkJvdHRvbVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGwsIHgsIHkxKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BMZWZ0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Ub3BSaWdodCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQobCwgeCwgeTIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIEExX05VTUJFUlMuc2xpY2UoLXRoaXMub3B0aW9ucy5ib2FyZFNpemUpLmZvckVhY2goKGw6IG51bWJlciwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgeSA9IHNwYWNlICogaW5kZXggKyBzY2FsZWRQYWRkaW5nO1xuICAgICAgICBsZXQgb2Zmc2V0TGVmdCA9IG9mZnNldDtcbiAgICAgICAgbGV0IG9mZnNldFJpZ2h0ID0gb2Zmc2V0O1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuVG9wTGVmdCB8fFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLkJvdHRvbUxlZnQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5MZWZ0XG4gICAgICAgICkge1xuICAgICAgICAgIG9mZnNldExlZnQgLT0gc3BhY2UgKiBib2FyZExpbmVFeHRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNlbnRlciA9PT0gQ2VudGVyLlRvcFJpZ2h0IHx8XG4gICAgICAgICAgY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQgfHxcbiAgICAgICAgICBjZW50ZXIgPT09IENlbnRlci5SaWdodFxuICAgICAgICApIHtcbiAgICAgICAgICBvZmZzZXRSaWdodCAtPSAoc3BhY2UgKiBib2FyZExpbmVFeHRlbnQpIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeDEgPSB2aXNpYmxlQXJlYVswXVswXSAqIHNwYWNlICsgcGFkZGluZyAtIG9mZnNldExlZnQ7XG4gICAgICAgIGxldCB4MiA9IHgxICsgem9vbWVkQm9hcmRTaXplICogc3BhY2UgKyAyICogb2Zmc2V0UmlnaHQ7XG4gICAgICAgIGlmIChpbmRleCA+PSB2aXNpYmxlQXJlYVsxXVswXSAmJiBpbmRleCA8PSB2aXNpYmxlQXJlYVsxXVsxXSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNlbnRlciAhPT0gQ2VudGVyLlRvcFJpZ2h0ICYmXG4gICAgICAgICAgICBjZW50ZXIgIT09IENlbnRlci5Cb3R0b21SaWdodCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuUmlnaHRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsLnRvU3RyaW5nKCksIHgxLCB5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuVG9wTGVmdCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuQm90dG9tTGVmdCAmJlxuICAgICAgICAgICAgY2VudGVyICE9PSBDZW50ZXIuTGVmdFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGwudG9TdHJpbmcoKSwgeDIsIHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGNhbGNTcGFjZUFuZFBhZGRpbmcgPSAoY2FudmFzID0gdGhpcy5jYW52YXMpID0+IHtcbiAgICBsZXQgc3BhY2UgPSAwO1xuICAgIGxldCBzY2FsZWRQYWRkaW5nID0gMDtcbiAgICBsZXQgc2NhbGVkQm9hcmRFeHRlbnQgPSAwO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIGNvbnN0IHtwYWRkaW5nLCBib2FyZFNpemUsIGJvYXJkTGluZUV4dGVudCwgem9vbX0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBjb25zdCB7dmlzaWJsZUFyZWF9ID0gdGhpcztcblxuICAgICAgaWYgKFxuICAgICAgICAodmlzaWJsZUFyZWFbMF1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMF1bMV0gPT09IGJvYXJkU2l6ZSAtIDEpIHx8XG4gICAgICAgICh2aXNpYmxlQXJlYVsxXVswXSAhPT0gMCAmJiB2aXNpYmxlQXJlYVsxXVsxXSA9PT0gYm9hcmRTaXplIC0gMSlcbiAgICAgICkge1xuICAgICAgICBzY2FsZWRCb2FyZEV4dGVudCA9IGJvYXJkTGluZUV4dGVudDtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgKHZpc2libGVBcmVhWzBdWzBdICE9PSAwICYmIHZpc2libGVBcmVhWzBdWzFdICE9PSBib2FyZFNpemUgLSAxKSB8fFxuICAgICAgICAodmlzaWJsZUFyZWFbMV1bMF0gIT09IDAgJiYgdmlzaWJsZUFyZWFbMV1bMV0gIT09IGJvYXJkU2l6ZSAtIDEpXG4gICAgICApIHtcbiAgICAgICAgc2NhbGVkQm9hcmRFeHRlbnQgPSBib2FyZExpbmVFeHRlbnQgKiAyO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkaXZpc29yID0gem9vbSA/IGJvYXJkU2l6ZSArIHNjYWxlZEJvYXJkRXh0ZW50IDogYm9hcmRTaXplO1xuICAgICAgLy8gY29uc3QgZGl2aXNvciA9IGJvYXJkU2l6ZTtcbiAgICAgIHNwYWNlID0gKGNhbnZhcy53aWR0aCAtIHBhZGRpbmcgKiAyKSAvIE1hdGguY2VpbChkaXZpc29yKTtcbiAgICAgIHNjYWxlZFBhZGRpbmcgPSBwYWRkaW5nICsgc3BhY2UgLyAyO1xuICAgIH1cbiAgICByZXR1cm4ge3NwYWNlLCBzY2FsZWRQYWRkaW5nLCBzY2FsZWRCb2FyZEV4dGVudH07XG4gIH07XG5cbiAgcGxheUVmZmVjdCA9IChtYXQgPSB0aGlzLm1hdCwgZWZmZWN0TWF0ID0gdGhpcy5lZmZlY3RNYXQsIGNsZWFyID0gdHJ1ZSkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuZWZmZWN0Q2FudmFzO1xuXG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgaWYgKGNsZWFyKSB0aGlzLmNsZWFyQ2FudmFzKGNhbnZhcyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVmZmVjdE1hdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVmZmVjdE1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gZWZmZWN0TWF0W2ldW2pdO1xuICAgICAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgICAgICBjb25zdCB4ID0gc2NhbGVkUGFkZGluZyArIGkgKiBzcGFjZTtcbiAgICAgICAgICBjb25zdCB5ID0gc2NhbGVkUGFkZGluZyArIGogKiBzcGFjZTtcbiAgICAgICAgICBjb25zdCBraSA9IG1hdFtpXVtqXTtcbiAgICAgICAgICBsZXQgZWZmZWN0O1xuICAgICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgICAgICBjYXNlIEVmZmVjdC5CYW46IHtcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSBuZXcgQmFuRWZmZWN0KGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICAgICAgICBlZmZlY3QucGxheSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlZmZlY3RNYXRbaV1bal0gPSBFZmZlY3QuTm9uZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHtib2FyZFNpemV9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgdGhpcy5zZXRFZmZlY3RNYXQoZW1wdHkoW2JvYXJkU2l6ZSwgYm9hcmRTaXplXSkpO1xuICAgIH1cbiAgfTtcblxuICBkcmF3Q3Vyc29yID0gKCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY3Vyc29yQ2FudmFzO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIHRoaXMuY2xlYXJDdXJzb3JDYW52YXMoKTtcbiAgICAgIGlmICh0aGlzLmN1cnNvciA9PT0gQ3Vyc29yLk5vbmUpIHJldHVybjtcbiAgICAgIGlmIChpc01vYmlsZURldmljZSgpICYmICF0aGlzLnRvdWNoTW92aW5nKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHtwYWRkaW5nfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY29uc3Qge3NwYWNlfSA9IHRoaXMuY2FsY1NwYWNlQW5kUGFkZGluZygpO1xuICAgICAgY29uc3Qge3Zpc2libGVBcmVhLCBjdXJzb3IsIGN1cnNvclZhbHVlfSA9IHRoaXM7XG5cbiAgICAgIGNvbnN0IFtpZHgsIGlkeV0gPSB0aGlzLmN1cnNvclBvc2l0aW9uO1xuICAgICAgaWYgKGlkeCA8IHZpc2libGVBcmVhWzBdWzBdIHx8IGlkeCA+IHZpc2libGVBcmVhWzBdWzFdKSByZXR1cm47XG4gICAgICBpZiAoaWR5IDwgdmlzaWJsZUFyZWFbMV1bMF0gfHwgaWR5ID4gdmlzaWJsZUFyZWFbMV1bMV0pIHJldHVybjtcbiAgICAgIGNvbnN0IHggPSBpZHggKiBzcGFjZSArIHNwYWNlIC8gMiArIHBhZGRpbmc7XG4gICAgICBjb25zdCB5ID0gaWR5ICogc3BhY2UgKyBzcGFjZSAvIDIgKyBwYWRkaW5nO1xuICAgICAgY29uc3Qga2kgPSB0aGlzLm1hdD8uW2lkeF0/LltpZHldIHx8IEtpLkVtcHR5O1xuXG4gICAgICBpZiAoY3R4KSB7XG4gICAgICAgIGxldCBjdXI7XG4gICAgICAgIGNvbnN0IHNpemUgPSBzcGFjZSAqIDAuODtcbiAgICAgICAgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLkNpcmNsZSkge1xuICAgICAgICAgIGN1ciA9IG5ldyBDaXJjbGVNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLlNxdWFyZSkge1xuICAgICAgICAgIGN1ciA9IG5ldyBTcXVhcmVNYXJrdXAoY3R4LCB4LCB5LCBzcGFjZSwga2kpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLlRyaWFuZ2xlKSB7XG4gICAgICAgICAgY3VyID0gbmV3IFRyaWFuZ2xlTWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC44KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IgPT09IEN1cnNvci5Dcm9zcykge1xuICAgICAgICAgIGN1ciA9IG5ldyBDcm9zc01hcmt1cChjdHgsIHgsIHksIHNwYWNlLCBraSk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yID09PSBDdXJzb3IuVGV4dCkge1xuICAgICAgICAgIGN1ciA9IG5ldyBUZXh0TWFya3VwKGN0eCwgeCwgeSwgc3BhY2UsIGtpLCBjdXJzb3JWYWx1ZSk7XG4gICAgICAgICAgY3VyLnNldEdsb2JhbEFscGhhKDAuOCk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2kgPT09IEtpLkVtcHR5ICYmIGN1cnNvciA9PT0gQ3Vyc29yLkJsYWNrU3RvbmUpIHtcbiAgICAgICAgICBjdXIgPSBuZXcgQ29sb3JTdG9uZShjdHgsIHgsIHksIEtpLkJsYWNrKTtcbiAgICAgICAgICBjdXIuc2V0U2l6ZShzaXplKTtcbiAgICAgICAgICBjdXIuc2V0R2xvYmFsQWxwaGEoMC41KTtcbiAgICAgICAgfSBlbHNlIGlmIChraSA9PT0gS2kuRW1wdHkgJiYgY3Vyc29yID09PSBDdXJzb3IuV2hpdGVTdG9uZSkge1xuICAgICAgICAgIGN1ciA9IG5ldyBDb2xvclN0b25lKGN0eCwgeCwgeSwgS2kuV2hpdGUpO1xuICAgICAgICAgIGN1ci5zZXRTaXplKHNpemUpO1xuICAgICAgICAgIGN1ci5zZXRHbG9iYWxBbHBoYSgwLjUpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvciA9PT0gQ3Vyc29yLkNsZWFyKSB7XG4gICAgICAgICAgY3VyID0gbmV3IENvbG9yU3RvbmUoY3R4LCB4LCB5LCBLaS5FbXB0eSk7XG4gICAgICAgICAgY3VyLnNldFNpemUoc2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VyPy5kcmF3KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRyYXdTdG9uZXMgPSAoXG4gICAgbWF0OiBudW1iZXJbXVtdID0gdGhpcy5tYXQsXG4gICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgY2xlYXIgPSB0cnVlXG4gICkgPT4ge1xuICAgIGNvbnN0IHt0aGVtZSA9IFRoZW1lLkJsYWNrQW5kV2hpdGUsIHRoZW1lUmVzb3VyY2VzfSA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAoY2xlYXIpIHRoaXMuY2xlYXJDYW52YXMoKTtcbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICAgIGNvbnN0IHtzcGFjZSwgc2NhbGVkUGFkZGluZ30gPSB0aGlzLmNhbGNTcGFjZUFuZFBhZGRpbmcoKTtcbiAgICAgICAgICAgICAgY29uc3QgeCA9IHNjYWxlZFBhZGRpbmcgKyBpICogc3BhY2U7XG4gICAgICAgICAgICAgIGNvbnN0IHkgPSBzY2FsZWRQYWRkaW5nICsgaiAqIHNwYWNlO1xuXG4gICAgICAgICAgICAgIGNvbnN0IHJhdGlvID0gMC40NTtcbiAgICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoZW1lICE9PSBUaGVtZS5TdWJkdWVkICYmXG4gICAgICAgICAgICAgICAgdGhlbWUgIT09IFRoZW1lLkJsYWNrQW5kV2hpdGUgJiZcbiAgICAgICAgICAgICAgICB0aGVtZSAhPT0gVGhlbWUuRmxhdFxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDM7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAzO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICcjNTU1JztcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDg7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IHN0b25lO1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoZW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBUaGVtZS5CbGFja0FuZFdoaXRlOlxuICAgICAgICAgICAgICAgIGNhc2UgVGhlbWUuRmxhdDoge1xuICAgICAgICAgICAgICAgICAgc3RvbmUgPSBuZXcgQ29sb3JTdG9uZShjdHgsIHgsIHksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIHN0b25lLnNldFNpemUoc3BhY2UgKiByYXRpbyAqIDIpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGJsYWNrcyA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXS5ibGFja3MubWFwKFxuICAgICAgICAgICAgICAgICAgICBpID0+IGltYWdlc1tpXVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHdoaXRlcyA9IHRoZW1lUmVzb3VyY2VzW3RoZW1lXS53aGl0ZXMubWFwKFxuICAgICAgICAgICAgICAgICAgICBpID0+IGltYWdlc1tpXVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZCA9IGkgKyAxMCArIGo7XG4gICAgICAgICAgICAgICAgICBzdG9uZSA9IG5ldyBJbWFnZVN0b25lKGN0eCwgeCwgeSwgdmFsdWUsIG1vZCwgYmxhY2tzLCB3aGl0ZXMpO1xuICAgICAgICAgICAgICAgICAgc3RvbmUuc2V0U2l6ZShzcGFjZSAqIHJhdGlvICogMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN0b25lLmRyYXcoKTtcbiAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiS2kiLCJUaGVtZSIsIkFuYWx5c2lzUG9pbnRUaGVtZSIsIkNlbnRlciIsIkVmZmVjdCIsIk1hcmt1cCIsIkN1cnNvciIsIlByb2JsZW1BbnN3ZXJUeXBlIiwiUGF0aERldGVjdGlvblN0cmF0ZWd5IiwiX19leHRlbmRzIiwiX19zcHJlYWRBcnJheSIsIl9fcmVhZCIsImNsb25lRGVlcCIsInJlcGxhY2UiLCJjb21wYWN0IiwiZmlsdGVyIiwiZmluZExhc3RJbmRleCIsImZsYXR0ZW5EZXB0aCIsInN1bSIsImNsb25lIiwiX192YWx1ZXMiLCJzYW1wbGUiLCJlbmNvZGUiLCJfX2Fzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBOElZQSxvQkFJWDtBQUpELENBQUEsVUFBWSxFQUFFLEVBQUE7QUFDWixJQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsT0FBUyxDQUFBO0FBQ1QsSUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsT0FBVSxDQUFBO0FBQ1YsSUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FB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QUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDeEQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFHRCxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUN6RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDeEQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3pELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzNELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUMzRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7S0FDSDs7SUFFRCxJQUFJLFNBQVMsSUFBSSxDQUFDLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNwQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQ3pELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3ZELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0tBQ0g7O0lBRUQsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7UUFDbkMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztLQUNIO0lBQ0QsT0FBTztRQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztRQUN6RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDekQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1FBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxRQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxRQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFB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RSxTQUFTLENBQUMsRUFBcEUsUUFBUSxjQUFBLEVBQUUsU0FBUyxlQUFBLEVBQUUsT0FBTyxhQUFBLEVBQUUsVUFBVSxnQkFBNEIsQ0FBQztBQUM1RSxJQUFBLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsT0FBTyxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDckM7QUFDRCxJQUFBLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsUUFBUSxFQUFFO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDckM7QUFDRCxJQUFBLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsVUFBVSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7S0FDMUM7QUFDRCxJQUFBLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsV0FBVyxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7S0FDMUM7QUFDRCxJQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzQyxJQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUUzQyxJQUFBLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLEVBQUU7SUFFVyxlQUFlLEdBQUcsVUFDN0IsR0FBZSxFQUNmLE1BQVUsRUFDVixTQUFjLEVBQUE7QUFEZCxJQUFBLElBQUEsTUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsTUFBVSxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ1YsSUFBQSxJQUFBLFNBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFNBQWMsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUVSLElBQUEsSUFBQSxLQUE2QyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQXpELFFBQVEsR0FBQSxFQUFBLENBQUEsUUFBQSxFQUFFLFNBQVMsZUFBQSxFQUFFLE9BQU8sYUFBQSxFQUFFLFVBQVUsZ0JBQWlCLENBQUM7QUFFakUsSUFBQSxJQUFNLElBQUksR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLElBQUEsSUFBTSxFQUFFLEdBQUcsUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDekQsSUFBQSxJQUFNLEVBQUUsR0FBRyxPQUFPLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN2RCxJQUFBLElBQU0sRUFBRSxHQUFHLFNBQVMsR0FBRyxNQUFNLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQ2pFLElBQUEsSUFBTSxFQUFFLEdBQUcsVUFBVSxHQUFHLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUM7SUFFbkUsT0FBTztRQUNMLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUNSLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztLQUNULENBQUM7QUFDSixFQUFFO0FBRVcsSUFBQSxnQ0FBZ0MsR0FBRyxVQUM5QyxXQUFpRCxFQUNqRCxTQUFjLEVBQUE7O0FBQWQsSUFBQSxJQUFBLFNBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFNBQWMsR0FBQSxFQUFBLENBQUEsRUFBQTtJQUVkLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUV0QixJQUFBLEVBQUEsR0FBQVEsYUFBdUIsV0FBVyxFQUFBLENBQUEsQ0FBQSxFQUFqQyxFQUFBLEdBQUFBLFlBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFRLEVBQVAsRUFBRSxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBRSxFQUFFLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFHLEtBQUFBLFlBQVEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQVAsRUFBRSxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBRSxFQUFFLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBQzs7QUFFekMsUUFBQSxLQUFrQixJQUFBLEVBQUEsR0FBQVMsY0FBQSxDQUFBLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxJQUFBLEVBQUEsNEJBQUU7QUFBN0MsWUFBQSxJQUFNLEdBQUcsR0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBOztBQUNaLGdCQUFBLEtBQWtCLElBQUEsRUFBQSxJQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsRUFBQUEsY0FBQSxDQUFBLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQSxDQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxJQUFBLEVBQUEsNEJBQUU7QUFBM0Msb0JBQUEsSUFBTSxHQUFHLEdBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQTtvQkFDWixJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNsQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRWxDLG9CQUFBLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTt3QkFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFBLENBQUEsTUFBQSxDQUFHLEdBQUcsQ0FBRyxDQUFBLE1BQUEsQ0FBQSxHQUFHLENBQUUsQ0FBQyxDQUFDO3FCQUM3QjtpQkFDRjs7Ozs7Ozs7O1NBQ0Y7Ozs7Ozs7OztBQUVELElBQUEsT0FBTyxNQUFNLENBQUM7QUFDaEIsRUFBRTtBQUVLLElBQU0sZ0JBQWdCLEdBQUcsVUFDOUIsR0FBZSxFQUNmLE1BQWMsRUFDZCxTQUFjLEVBQ2QsSUFBVSxFQUNWLElBQW1CLEVBQ25CLEVBQVUsRUFBQTtBQUhWLElBQUEsSUFBQSxTQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxTQUFjLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFDZCxJQUFBLElBQUEsSUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsSUFBVSxHQUFBLEdBQUEsQ0FBQSxFQUFBO0FBQ1YsSUFBQSxJQUFBLElBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLElBQUEsR0FBV3BCLFVBQUUsQ0FBQyxLQUFLLENBQUEsRUFBQTtBQUduQixJQUFBLElBQU0sTUFBTSxHQUFHWSxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLElBQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzVELElBQUEsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLElBQU0sU0FBUyxHQUFHLFVBQUMsR0FBZSxFQUFBO0FBQzFCLFFBQUEsSUFBQSxFQUFBLEdBQUFELFlBQUEsQ0FBVyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUEsQ0FBQSxDQUFBLEVBQXhCLEVBQUUsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUUsRUFBRSxRQUFrQixDQUFDO0FBQzFCLFFBQUEsSUFBQSxFQUFBLEdBQUFBLFlBQUEsQ0FBVyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUEsQ0FBQSxDQUFBLEVBQXhCLEVBQUUsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUUsRUFBRSxRQUFrQixDQUFDO0FBQ2hDLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM3QixZQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0IsZ0JBQUEsSUFDRSxNQUFNLEtBQUtSLGNBQU0sQ0FBQyxPQUFPO3FCQUN4QixDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDO3lCQUM1QixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLHlCQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDbEIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFDdEI7b0JBQ0EsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDbEI7QUFBTSxxQkFBQSxJQUNMLE1BQU0sS0FBS0EsY0FBTSxDQUFDLFFBQVE7cUJBQ3pCLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQzt5QkFDaEIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQzt5QkFDOUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQzt5QkFDOUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFDdEI7b0JBQ0EsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDbEI7QUFBTSxxQkFBQSxJQUNMLE1BQU0sS0FBS0EsY0FBTSxDQUFDLFVBQVU7cUJBQzNCLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUM7QUFDN0IseUJBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLHlCQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQix5QkFBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFDbEM7b0JBQ0EsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDbEI7QUFBTSxxQkFBQSxJQUNMLE1BQU0sS0FBS0EsY0FBTSxDQUFDLFdBQVc7cUJBQzVCLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNqQix5QkFBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQ2xCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDL0IseUJBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQ2xDO29CQUNBLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ2xCO0FBQU0scUJBQUEsSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxNQUFNLEVBQUU7b0JBQ25DLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ2xCO2FBQ0Y7U0FDRjtBQUNILEtBQUMsQ0FBQztJQUNGLElBQU0sVUFBVSxHQUFHLFVBQUMsR0FBZSxFQUFBO1FBQ2pDLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN4QixRQUFBLElBQU0sV0FBVyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBQSxJQUFBLEVBQUEsR0FBQVEsWUFBQSxDQUFXLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQSxDQUFBLENBQUEsRUFBeEIsRUFBRSxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBRSxFQUFFLFFBQWtCLENBQUM7QUFDMUIsUUFBQSxJQUFBLEVBQUEsR0FBQUEsWUFBQSxDQUFXLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQSxDQUFBLENBQUEsRUFBeEIsRUFBRSxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBRSxFQUFFLFFBQWtCLENBQUM7OztBQUdoQyxRQUFBLElBQU0sYUFBYSxHQUFHLElBQUksS0FBS1gsVUFBRSxDQUFDLEtBQUssQ0FBQztBQUN4QyxRQUFBLElBQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBQSxJQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDOzs7OztRQUt0QixJQUFNLFdBQVcsR0FDZixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxHQUFHLFlBQVksQ0FBQzs7O1FBS3JFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsQyxZQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEMsZ0JBQUEsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO0FBQ3hDLG9CQUFBLEtBQUssRUFBRSxDQUFDO0FBQ1Isb0JBQUEsSUFBSSxFQUFFLEdBQUdBLFVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDbEIsb0JBQUEsSUFBSSxNQUFNLEtBQUtHLGNBQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsVUFBVSxFQUFFO0FBQzdELHdCQUFBLEVBQUUsR0FBRyxhQUFhLEtBQUssS0FBSyxJQUFJLFdBQVcsR0FBR0gsVUFBRSxDQUFDLEtBQUssR0FBR0EsVUFBRSxDQUFDLEtBQUssQ0FBQztxQkFDbkU7QUFBTSx5QkFBQSxJQUNMLE1BQU0sS0FBS0csY0FBTSxDQUFDLFFBQVE7QUFDMUIsd0JBQUEsTUFBTSxLQUFLQSxjQUFNLENBQUMsV0FBVyxFQUM3QjtBQUNBLHdCQUFBLEVBQUUsR0FBRyxhQUFhLEtBQUssS0FBSyxJQUFJLFdBQVcsR0FBR0gsVUFBRSxDQUFDLEtBQUssR0FBR0EsVUFBRSxDQUFDLEtBQUssQ0FBQztxQkFDbkU7b0JBQ0QsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxTQUFTLEVBQUU7QUFDbEUsd0JBQUEsRUFBRSxHQUFHQSxVQUFFLENBQUMsS0FBSyxDQUFDO3FCQUNmO29CQUVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQ2hCO2FBQ0Y7U0FDRjtBQUNILEtBQUMsQ0FBQztJQUlGLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQixVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQ25CLElBQUEsT0FBTyxNQUFNLENBQUM7QUFDaEIsRUFBRTtBQUVLLElBQU0sVUFBVSxHQUFHLFVBQUMsR0FBZSxFQUFBO0FBQ3hDLElBQUEsSUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLElBQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsSUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixJQUFBLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUUvQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixRQUFRLE1BQU07QUFDWixRQUFBLEtBQUtHLGNBQU0sQ0FBQyxPQUFPLEVBQUU7WUFDbkIsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNSLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDVCxNQUFNO1NBQ1A7QUFDRCxRQUFBLEtBQUtBLGNBQU0sQ0FBQyxRQUFRLEVBQUU7WUFDcEIsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ1YsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNULE1BQU07U0FDUDtBQUNELFFBQUEsS0FBS0EsY0FBTSxDQUFDLFVBQVUsRUFBRTtZQUN0QixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNSLE1BQU07U0FDUDtBQUNELFFBQUEsS0FBS0EsY0FBTSxDQUFDLFdBQVcsRUFBRTtZQUN2QixHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDVixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsTUFBTTtTQUNQO0tBQ0Y7SUFDRCxPQUFPLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUM7QUFDMUIsRUFBRTtBQUVXLElBQUEsYUFBYSxHQUFHLFVBQzNCLEdBQWUsRUFDZixFQUFPLEVBQ1AsRUFBTyxFQUNQLFNBQWMsRUFBQTtBQUZkLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxFQUFPLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFDUCxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBTyxHQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQ1AsSUFBQSxJQUFBLFNBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLFNBQWMsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUVkLElBQUEsSUFBTSxFQUFFLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFBLElBQU0sRUFBRSxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBQSxJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFL0IsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsUUFBUSxNQUFNO0FBQ1osUUFBQSxLQUFLQSxjQUFNLENBQUMsT0FBTyxFQUFFO1lBQ25CLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDUixHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDVixNQUFNO1NBQ1A7QUFDRCxRQUFBLEtBQUtBLGNBQU0sQ0FBQyxRQUFRLEVBQUU7WUFDcEIsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNULEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNWLE1BQU07U0FDUDtBQUNELFFBQUEsS0FBS0EsY0FBTSxDQUFDLFVBQVUsRUFBRTtZQUN0QixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNSLE1BQU07U0FDUDtBQUNELFFBQUEsS0FBS0EsY0FBTSxDQUFDLFdBQVcsRUFBRTtZQUN2QixHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ1QsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNSLE1BQU07U0FDUDtLQUNGO0lBQ0QsT0FBTyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDO0FBQzFCLEVBQUU7U0FFYyxlQUFlLENBQzdCLEdBQWlDLEVBQ2pDLE1BQWMsRUFDZCxjQUFzQixFQUFBO0lBRnRCLElBQUEsR0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsTUFBa0IsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUEsRUFBQTtBQUVqQyxJQUFBLElBQUEsY0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsY0FBc0IsR0FBQSxLQUFBLENBQUEsRUFBQTtBQUV0QixJQUFBLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUMzQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFFakIsSUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuQyxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDbkIsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDZCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDOUI7U0FDRjtLQUNGO0lBRUQsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPO0FBQ0wsWUFBQSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUN2QixDQUFDO0tBQ0g7SUFFRCxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ25CLFFBQUEsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsUUFBQSxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ25FLFFBQUEsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsUUFBQSxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRXRFLFFBQUEsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDdkIsZ0JBQWdCLEdBQUcsZ0JBQWdCLEVBQ25DLGdCQUFnQixHQUFHLGdCQUFnQixDQUNwQyxDQUFDO1FBRUYsTUFBTSxHQUFHLGdCQUFnQixDQUFDO0FBQzFCLFFBQUEsTUFBTSxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFFM0IsUUFBQSxJQUFJLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQ3hCLFlBQUEsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFlBQUEsTUFBTSxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUM7U0FDNUI7UUFFRCxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7QUFDMUIsUUFBQSxNQUFNLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUMzQixJQUFJLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQzNCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUMzQixZQUFBLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO1NBQzVCO0tBQ0Y7U0FBTTtRQUNMLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDdEMsUUFBQSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDbkQsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztBQUN0QyxRQUFBLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztLQUN2RDtJQUVELE9BQU87UUFDTCxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDaEIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0tBQ2pCLENBQUM7QUFDSixDQUFDO0FBRUssU0FBVSxJQUFJLENBQUMsR0FBZSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBVSxFQUFBO0FBQ3BFLElBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQUUsUUFBQSxPQUFPLEdBQUcsQ0FBQztBQUMvQixJQUFBLElBQU0sTUFBTSxHQUFHUyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbEIsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QyxDQUFDO1NBRWUsTUFBTSxDQUFDLEdBQWUsRUFBRSxLQUFlLEVBQUUsVUFBaUIsRUFBQTtBQUFqQixJQUFBLElBQUEsVUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsVUFBaUIsR0FBQSxJQUFBLENBQUEsRUFBQTtBQUN4RSxJQUFBLElBQUksTUFBTSxHQUFHQSxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztBQUNyQixJQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUE7QUFDVCxRQUFBLElBQUEsRUFRRixHQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFQZixDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFDRCxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFDRCxFQUFFLFFBS2EsQ0FBQztRQUNsQixJQUFJLFVBQVUsRUFBRTtZQUNkLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLGdCQUFBLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEMsUUFBUSxHQUFHLElBQUksQ0FBQzthQUNqQjtTQUNGO2FBQU07WUFDTCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDakI7QUFDSCxLQUFDLENBQUMsQ0FBQztJQUVILE9BQU87QUFDTCxRQUFBLFdBQVcsRUFBRSxNQUFNO0FBQ25CLFFBQUEsUUFBUSxFQUFBLFFBQUE7S0FDVCxDQUFDO0FBQ0osQ0FBQztBQUVEO0FBQ08sSUFBTSxVQUFVLEdBQUcsVUFDeEIsR0FBZSxFQUNmLENBQVMsRUFDVCxDQUFTLEVBQ1QsSUFBUSxFQUNSLFdBQW9DLEVBQ3BDLFdBQXNFLEVBQUE7QUFFdEUsSUFBQSxJQUFJLElBQUksS0FBS1osVUFBRSxDQUFDLEtBQUs7UUFBRSxPQUFPO0lBQzlCLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFOztRQUU1QixJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFFBQUEsSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLQSxVQUFFLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDNUMsUUFBQSxJQUFNLE1BQUksR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFBLENBQUEsTUFBQSxDQUFHLEtBQUssRUFBSSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsS0FBSyxNQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQzFDLFVBQUMsQ0FBUSxFQUFBLEVBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxNQUFJLENBQUEsRUFBQSxDQUNsQyxDQUFDO1FBQ0YsSUFBSSxJQUFJLFNBQUEsQ0FBQztBQUNULFFBQUEsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN2QixZQUFBLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEI7YUFBTTtZQUNMLElBQUksR0FBRyxhQUFhLENBQUMsRUFBRyxDQUFBLE1BQUEsQ0FBQSxLQUFLLEVBQUksR0FBQSxDQUFBLENBQUEsTUFBQSxDQUFBLEtBQUssRUFBRyxHQUFBLENBQUEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN4RCxZQUFBLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7QUFDRCxRQUFBLElBQUksV0FBVztBQUFFLFlBQUEsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMxQztTQUFNO0FBQ0wsUUFBQSxJQUFJLFdBQVc7QUFBRSxZQUFBLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDbEQ7QUFDSCxFQUFFO0FBRUY7Ozs7QUFJRztBQUNVLElBQUEseUJBQXlCLEdBQUcsVUFDdkMsV0FBb0MsRUFDcEMsS0FBYSxFQUFBO0FBRWIsSUFBQSxJQUFNLElBQUksR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkMsSUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFBO0FBQ1IsUUFBQSxJQUFBLFVBQVUsR0FBSSxJQUFJLENBQUMsS0FBSyxXQUFkLENBQWU7UUFDaEMsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBWSxFQUFBLEVBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssR0FBQSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBTSxFQUFLLEVBQUEsT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQSxFQUFBLENBQUMsQ0FBQztTQUMxRTthQUFNO0FBQ0wsWUFBQSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBWSxFQUFBO0FBQzlCLGdCQUFBLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLEVBQUEsRUFBSSxPQUFBLENBQUMsS0FBSyxLQUFLLENBQVgsRUFBVyxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ2xELFVBQUMsQ0FBWSxFQUFLLEVBQUEsT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUEsRUFBQSxDQUN0QyxDQUFDO2lCQUNIO0FBQ0gsYUFBQyxDQUFDLENBQUM7U0FDSjtBQUNILEtBQUMsQ0FBQyxDQUFDO0FBQ0wsRUFBRTtBQUVGOzs7Ozs7Ozs7QUFTRztBQUNJLElBQU0scUJBQXFCLEdBQUcsVUFDbkMsV0FBb0MsRUFDcEMsR0FBZSxFQUNmLENBQVMsRUFDVCxDQUFTLEVBQ1QsRUFBTSxFQUFBO0lBRU4sSUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxJQUFBLElBQU0sS0FBSyxHQUFHLEVBQUUsS0FBS0EsVUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQzVDLElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUMsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ25CLElBQUEsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUtBLFVBQUUsQ0FBQyxLQUFLLEVBQUU7QUFDMUIsUUFBQSx5QkFBeUIsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDL0M7U0FBTTtRQUNMLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBT1UsbUJBQUEsQ0FBQUEsbUJBQUEsQ0FBQSxFQUFBLEVBQUFDLFlBQUEsQ0FBQSxJQUFJLENBQUMsTUFBTSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUEsQ0FBRSxLQUFLLENBQUEsRUFBQSxLQUFBLENBQUMsQ0FBQztTQUN2QzthQUFNO1lBQ0wsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLDREQUN2QixXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBO0FBQy9CLGdCQUFBLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7cUJBQzVCLENBQUM7U0FDSDtRQUNELE1BQU0sR0FBRyxJQUFJLENBQUM7S0FDZjtBQUNELElBQUEsT0FBTyxNQUFNLENBQUM7QUFDaEIsRUFBRTtBQUVGOzs7Ozs7Ozs7O0FBVUc7QUFDSDtBQUNPLElBQU0sb0JBQW9CLEdBQUcsVUFDbEMsV0FBb0MsRUFDcEMsR0FBZSxFQUNmLENBQVMsRUFDVCxDQUFTLEVBQ1QsRUFBTSxFQUFBO0FBRU4sSUFBQSxJQUFJLEVBQUUsS0FBS1gsVUFBRSxDQUFDLEtBQUs7UUFBRSxPQUFPO0FBQzVCLElBQUEsSUFBSSxJQUFJLENBQUM7SUFDVCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUMxQixJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFFBQUEsSUFBTSxLQUFLLEdBQUcsRUFBRSxLQUFLQSxVQUFFLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDMUMsUUFBQSxJQUFNLE1BQUksR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFBLENBQUEsTUFBQSxDQUFHLEtBQUssRUFBSSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsS0FBSyxNQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQzFDLFVBQUMsQ0FBUSxFQUFBLEVBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxNQUFJLENBQUEsRUFBQSxDQUNsQyxDQUFDO0FBQ0YsUUFBQSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZCLFlBQUEsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQjthQUFNO1lBQ0wsSUFBSSxHQUFHLGFBQWEsQ0FBQyxFQUFHLENBQUEsTUFBQSxDQUFBLEtBQUssRUFBSSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsS0FBSyxFQUFHLEdBQUEsQ0FBQSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3hELFlBQUEsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtLQUNGO0FBQ0QsSUFBQSxPQUFPLElBQUksQ0FBQztBQUNkLEVBQUU7QUFFVyxJQUFBLGdDQUFnQyxHQUFHLFVBQzlDLElBQTZCLEVBQzdCLGdCQUFxQixFQUFBO0FBQXJCLElBQUEsSUFBQSxnQkFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsZ0JBQXFCLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFFckIsSUFBQSxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQzlELElBQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RELElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTNDLElBQUEsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQVgsRUFBVyxDQUFDLENBQUM7QUFDM0MsSUFBQSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN0QixRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBMEIsRUFBQTtZQUMvQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFXLEVBQUE7QUFDcEMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO29CQUM1QyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUMxQjtBQUNILGFBQUMsQ0FBQyxDQUFDO0FBQ0wsU0FBQyxDQUFDLENBQUM7S0FDSjtBQUNELElBQUEsT0FBTyxjQUFjLENBQUM7QUFDeEIsRUFBRTtBQUVXLElBQUEsa0JBQWtCLEdBQUcsVUFDaEMsSUFBNkIsRUFDN0IsZ0JBQXFCLEVBQUE7QUFBckIsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBcUIsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUVyQixJQUFBLElBQUksQ0FBQyxJQUFJO1FBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDOUQsSUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDdEQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFM0MsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBQSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtRQUN0QixnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQTBCLEVBQUE7WUFDakUsT0FBQSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUFwQixTQUFvQixDQUNyQixDQUFDO0tBQ0g7QUFFRCxJQUFBLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3JCLFFBQUEsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQVgsRUFBVyxDQUFDLENBQUM7QUFDM0MsUUFBQSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN0QixZQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBMEIsRUFBQTtnQkFDL0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBVyxFQUFBO0FBQ3BDLG9CQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLG9CQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLG9CQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTt3QkFDNUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDMUI7QUFDSCxpQkFBQyxDQUFDLENBQUM7QUFDTCxhQUFDLENBQUMsQ0FBQztTQUNKO0tBQ0Y7QUFFRCxJQUFBLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQTBCLEVBQUE7UUFDbEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBVyxFQUFBO0FBQ3BDLFlBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsWUFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxZQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtnQkFDNUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMxQjtBQUNILFNBQUMsQ0FBQyxDQUFDO0FBQ0wsS0FBQyxDQUFDLENBQUM7QUFFSCxJQUFBLE9BQU8sY0FBYyxDQUFDO0FBQ3hCLEVBQUU7QUFFRjs7Ozs7O0FBTUc7QUFDVSxJQUFBLG9CQUFvQixHQUFHLFVBQ2xDLElBQTZCLEVBQzdCLE1BQW1ELEVBQ25ELFdBQXVCLEVBQ3ZCLGdCQUFxQixFQUFBO0FBRnJCLElBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFtRCxHQUFBLFFBQUEsQ0FBQSxFQUFBO0FBQ25ELElBQUEsSUFBQSxXQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxXQUF1QixHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ3ZCLElBQUEsSUFBQSxnQkFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsZ0JBQXFCLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFFckIsSUFBQSxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixJQUFBLEdBQUcsR0FBWSxHQUFHLENBQUEsR0FBZixFQUFFLE1BQU0sR0FBSSxHQUFHLENBQUEsTUFBUCxDQUFRO0lBQzFCLElBQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRXRELElBQUEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDdEIsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQTBCLEVBQUE7WUFDL0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBVyxFQUFBO0FBQ3BDLGdCQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLGdCQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLGdCQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPO2dCQUMzQixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtBQUN4QixvQkFBQSxJQUFJLElBQUksR0FBR0ssY0FBTSxDQUFDLFdBQVcsQ0FBQztBQUM5QixvQkFBQSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDbEIsSUFBSTtBQUNGLDRCQUFBLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxXQUFXO2tDQUN4QkEsY0FBTSxDQUFDLGtCQUFrQjtBQUMzQixrQ0FBRUEsY0FBTSxDQUFDLFlBQVksQ0FBQztxQkFDM0I7QUFDRCxvQkFBQSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDbEIsSUFBSTtBQUNGLDRCQUFBLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxXQUFXO2tDQUN4QkEsY0FBTSxDQUFDLGtCQUFrQjtBQUMzQixrQ0FBRUEsY0FBTSxDQUFDLFlBQVksQ0FBQztxQkFDM0I7QUFDRCxvQkFBQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBS0wsVUFBRSxDQUFDLEtBQUssRUFBRTt3QkFDMUIsUUFBUSxNQUFNO0FBQ1osNEJBQUEsS0FBSyxTQUFTO0FBQ1osZ0NBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUN6QyxNQUFNO0FBQ1IsNEJBQUEsS0FBSyxTQUFTO2dDQUNaLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7Z0NBQ3BCLE1BQU07QUFDUiw0QkFBQSxLQUFLLFFBQVEsQ0FBQztBQUNkLDRCQUFBO2dDQUNFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO3lCQUM5QjtxQkFDRjtpQkFDRjtBQUNILGFBQUMsQ0FBQyxDQUFDO0FBQ0wsU0FBQyxDQUFDLENBQUM7S0FDSjtBQUVELElBQUEsT0FBTyxNQUFNLENBQUM7QUFDaEIsRUFBRTtBQUVLLElBQU0sUUFBUSxHQUFHLFVBQUMsSUFBNkIsRUFBQTs7SUFFcEQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQVcsRUFBSyxFQUFBLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUEsRUFBQSxDQUFDLENBQUM7SUFDNUUsSUFBSSxvQkFBb0IsR0FBRyxLQUFLLENBQUM7SUFDakMsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDL0IsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFFL0IsSUFBQSxJQUFNLEVBQUUsR0FBRyxDQUFBLE1BQU0sS0FBTixJQUFBLElBQUEsTUFBTSxLQUFOLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLE1BQU0sQ0FBRSxLQUFLLEtBQUksR0FBRyxDQUFDO0lBQ2hDLElBQUksRUFBRSxFQUFFO0FBQ04sUUFBQSxJQUFJLEVBQUUsS0FBSyxHQUFHLEVBQUU7WUFDZCxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDM0Isa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQzFCLG9CQUFvQixHQUFHLElBQUksQ0FBQztTQUM3QjtBQUFNLGFBQUEsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFO1lBQ3JCLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMxQixrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDM0Isb0JBQW9CLEdBQUcsSUFBSSxDQUFDO1NBQzdCO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBSyxHQUFHLEVBQUU7WUFDckIsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQzNCLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMxQixvQkFBb0IsR0FBRyxLQUFLLENBQUM7U0FDOUI7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRTtZQUNyQixrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFDMUIsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQzNCLG9CQUFvQixHQUFHLEtBQUssQ0FBQztTQUM5QjtLQUNGO0lBQ0QsT0FBTyxFQUFDLG9CQUFvQixFQUFBLG9CQUFBLEVBQUUsa0JBQWtCLG9CQUFBLEVBQUUsa0JBQWtCLEVBQUEsa0JBQUEsRUFBQyxDQUFDO0FBQ3hFLEVBQUU7QUFFRjs7Ozs7QUFLRztBQUNVLElBQUEsZ0JBQWdCLEdBQUcsVUFDOUIsV0FBb0MsRUFDcEMsZ0JBQXFCLEVBQUE7QUFBckIsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBcUIsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUVyQixJQUFBLElBQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuQyxJQUFBLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyQixJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDWCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbkIsSUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDN0QsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDOUIsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDM0MsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkMsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFdEMsSUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQTtBQUNqQixRQUFBLElBQUEsRUFBcUMsR0FBQSxJQUFJLENBQUMsS0FBSyxDQUE5QyxDQUFBLFNBQVMsR0FBQSxFQUFBLENBQUEsU0FBQSxDQUFBLENBQUUsVUFBVSxHQUFBLEVBQUEsQ0FBQSxVQUFBLENBQUUsY0FBd0I7QUFDdEQsUUFBQSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUFFLFVBQVUsSUFBSSxDQUFDLENBQUM7QUFFM0MsUUFBQSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVSxFQUFBO0FBQzVCLFlBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFVLEVBQUE7Z0JBQzlCLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsZ0JBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO29CQUFFLE9BQU87Z0JBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO29CQUN4QixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNQLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ1AsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxQyxvQkFBQSxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSTt3QkFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN6QztBQUNILGFBQUMsQ0FBQyxDQUFDO0FBQ0wsU0FBQyxDQUFDLENBQUM7QUFFSCxRQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFXLEVBQUE7QUFDNUIsWUFBQSxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxZQUFBLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUFFLE9BQU87WUFDM0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7Z0JBQ3hCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ1AsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDUCxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxHQUFHQSxVQUFFLENBQUMsS0FBSyxHQUFHQSxVQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFN0QsZ0JBQUEsSUFBSSxFQUFFLEtBQUssU0FBUyxJQUFJLEVBQUUsS0FBSyxTQUFTLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUM5RCxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxHQUFHLFVBQVUsRUFDdkMsUUFBUSxFQUFFLENBQUM7aUJBQ2Q7Z0JBRUQsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzdCLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBR0ssY0FBTSxDQUFDLE9BQU8sQ0FBQztpQkFDakM7YUFDRjtBQUNILFNBQUMsQ0FBQyxDQUFDOztBQUdILFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM3QixZQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzdCLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUMzQztTQUNGO0FBQ0gsS0FBQyxDQUFDLENBQUM7O0lBR0gsSUFBSSxJQUFJLEVBQUU7QUFDUixRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUE2QixFQUFBO0FBQy9CLFlBQUEsSUFBQSxFQUFxQyxHQUFBLElBQUksQ0FBQyxLQUFLLENBQTlDLENBQUEsU0FBUyxHQUFBLEVBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBRSxVQUFVLEdBQUEsRUFBQSxDQUFBLFVBQUEsQ0FBRSxjQUF3QjtBQUN0RCxZQUFBLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUFFLFVBQVUsSUFBSSxDQUFDLENBQUM7QUFDM0MsWUFBQSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVSxFQUFBO0FBQzVCLGdCQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVSxFQUFBO29CQUM5QixJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLG9CQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTt3QkFDNUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHTCxVQUFFLENBQUMsS0FBSyxDQUFDO0FBQ2hDLHdCQUFBLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJOzRCQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3BEO0FBQ0gsaUJBQUMsQ0FBQyxDQUFDO0FBQ0wsYUFBQyxDQUFDLENBQUM7QUFFSCxZQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFXLEVBQUE7QUFDNUIsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO29CQUM1QyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUdBLFVBQUUsQ0FBQyxLQUFLLENBQUM7aUJBQ2pDO0FBQ0gsYUFBQyxDQUFDLENBQUM7QUFFSCxZQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsU0FBQyxDQUFDLENBQUM7S0FDSjtBQUVELElBQUEsSUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7QUFDbEQsSUFBQSxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBYSxFQUFBO0FBQ2hDLFFBQUEsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN0QixRQUFBLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsUUFBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxFQUFBO1lBQ2xCLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFBRSxPQUFPO1lBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO2dCQUN4QixJQUFJLElBQUksU0FBQSxDQUFDO2dCQUNULFFBQVEsS0FBSztBQUNYLG9CQUFBLEtBQUssSUFBSTtBQUNQLHdCQUFBLElBQUksR0FBR0ssY0FBTSxDQUFDLE1BQU0sQ0FBQzt3QkFDckIsTUFBTTtBQUNSLG9CQUFBLEtBQUssSUFBSTtBQUNQLHdCQUFBLElBQUksR0FBR0EsY0FBTSxDQUFDLE1BQU0sQ0FBQzt3QkFDckIsTUFBTTtBQUNSLG9CQUFBLEtBQUssSUFBSTtBQUNQLHdCQUFBLElBQUksR0FBR0EsY0FBTSxDQUFDLFFBQVEsQ0FBQzt3QkFDdkIsTUFBTTtBQUNSLG9CQUFBLEtBQUssSUFBSTtBQUNQLHdCQUFBLElBQUksR0FBR0EsY0FBTSxDQUFDLEtBQUssQ0FBQzt3QkFDcEIsTUFBTTtvQkFDUixTQUFTO3dCQUNQLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM1QjtpQkFDRjtnQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQ3JCO0FBQ0gsU0FBQyxDQUFDLENBQUM7QUFDTCxLQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7OztBQVlILElBQUEsT0FBTyxFQUFDLEdBQUcsRUFBQSxHQUFBLEVBQUUsY0FBYyxFQUFBLGNBQUEsRUFBRSxNQUFNLEVBQUEsTUFBQSxFQUFFLFNBQVMsRUFBQSxTQUFBLEVBQUMsQ0FBQztBQUNsRCxFQUFFO0FBRUY7Ozs7O0FBS0c7QUFDVSxJQUFBLFFBQVEsR0FBRyxVQUFDLElBQTZCLEVBQUUsS0FBYSxFQUFBO0FBQ25FLElBQUEsSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPO0FBQ2xCLElBQUEsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBVyxJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQUMsQ0FBQztLQUN0RTtBQUNELElBQUEsSUFBSSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDN0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FDeEMsVUFBQyxDQUFxQixJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQzdDLENBQUM7S0FDSDtBQUNELElBQUEsSUFBSSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDN0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FDeEMsVUFBQyxDQUFxQixJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQzdDLENBQUM7S0FDSDtBQUNELElBQUEsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBVyxJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQUMsQ0FBQztLQUN0RTtBQUNELElBQUEsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25DLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBWSxJQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQWpCLEVBQWlCLENBQUMsQ0FBQztLQUN4RTtBQUNELElBQUEsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFhLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQzFFO0FBQ0QsSUFBQSxJQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN2QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDbEMsVUFBQyxDQUFlLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FDdkMsQ0FBQztLQUNIO0FBQ0QsSUFBQSxPQUFPLElBQUksQ0FBQztBQUNkLEVBQUU7QUFFRjs7Ozs7QUFLRztBQUNVLElBQUEsU0FBUyxHQUFHLFVBQUMsSUFBNkIsRUFBRSxLQUFhLEVBQUE7QUFDcEUsSUFBQSxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFXLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQ3hFO0FBQ0QsSUFBQSxJQUFJLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUMxQyxVQUFDLENBQXFCLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FDN0MsQ0FBQztLQUNIO0FBQ0QsSUFBQSxJQUFJLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUMxQyxVQUFDLENBQXFCLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FDN0MsQ0FBQztLQUNIO0FBQ0QsSUFBQSxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFXLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQ3hFO0FBQ0QsSUFBQSxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFZLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBakIsRUFBaUIsQ0FBQyxDQUFDO0tBQzFFO0FBQ0QsSUFBQSxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQWEsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUFDLENBQUM7S0FDNUU7QUFDRCxJQUFBLElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUNwQyxVQUFDLENBQWUsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFqQixFQUFpQixDQUN2QyxDQUFDO0tBQ0g7QUFDRCxJQUFBLE9BQU8sRUFBRSxDQUFDO0FBQ1osRUFBRTtBQUVLLElBQU0sT0FBTyxHQUFHLFVBQ3JCLElBQTZCLEVBQzdCLE9BQStCLEVBQy9CLE9BQStCLEVBQy9CLFNBQWlDLEVBQ2pDLFNBQWlDLEVBQUE7QUFFakMsSUFBQSxJQUFJLFFBQVEsQ0FBQztJQUNiLElBQU0sT0FBTyxHQUFHLFVBQUMsSUFBNkIsRUFBQTtBQUM1QyxRQUFBLElBQU0sT0FBTyxHQUFHUyxjQUFPLENBQ3JCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLEVBQUksRUFBQSxJQUFBLEVBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxRQUFRLEVBQUUsQ0FBQSxFQUFBLENBQUMsQ0FDMUQsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWixRQUFBLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLEtBQUMsQ0FBQztJQUVGLElBQU0sV0FBVyxHQUFHLFVBQUMsSUFBNkIsRUFBQTtRQUNoRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFBRSxPQUFPO0FBRS9CLFFBQUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLFFBQUEsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDckIsWUFBQSxJQUFJLE9BQU87Z0JBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0FBQU0sYUFBQSxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM5QixZQUFBLElBQUksU0FBUztnQkFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEM7YUFBTTtBQUNMLFlBQUEsSUFBSSxPQUFPO2dCQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtBQUNILEtBQUMsQ0FBQztBQUVGLElBQUEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7UUFDdEIsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUEwQixFQUFBO1lBQ2pFLE9BQUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQWQsU0FBYyxDQUNmLENBQUM7UUFDRixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQTBCLEVBQUE7WUFDakUsT0FBQSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFBZCxTQUFjLENBQ2YsQ0FBQztRQUNGLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBMEIsRUFBQTtZQUNuRSxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUFoQixTQUFnQixDQUNqQixDQUFDO1FBRUYsUUFBUSxHQUFHLElBQUksQ0FBQztRQUVoQixJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM5QyxZQUFBLFFBQVEsR0FBR08sYUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQy9CO2FBQU0sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDckQsWUFBQSxRQUFRLEdBQUdBLGFBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMvQjthQUFNLElBQUksYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2pFLFlBQUEsUUFBUSxHQUFHQSxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDakM7QUFBTSxhQUFBLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzVCLFlBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQzVCO2FBQU07QUFDTCxZQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUM1QjtRQUNELFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN2QjtTQUFNO1FBQ0wsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CO0FBQ0QsSUFBQSxPQUFPLFFBQVEsQ0FBQztBQUNsQixFQUFFO0FBRVcsSUFBQSxnQkFBZ0IsR0FBRyxVQUM5QixJQUE2QixFQUM3QixnQkFBcUIsRUFBQTs7QUFBckIsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBcUIsR0FBQSxFQUFBLENBQUEsRUFBQTtJQUVyQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDbkIsUUFBUSxDQUFDLENBQUEsQ0FBQSxFQUFBLEdBQUEsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxLQUFLLEtBQUksZ0JBQWdCLENBQUMsRUFDekQsY0FBYyxDQUNmLENBQUM7QUFDRixJQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsRUFBRTtBQUVXLElBQUEsMkJBQTJCLEdBQUcsVUFDekMsSUFBZ0QsRUFDaEQsZ0JBQStCLEVBQUE7QUFBL0IsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUF1QnJCLFVBQUUsQ0FBQyxLQUFLLENBQUEsRUFBQTtJQUUvQixJQUFJLElBQUksRUFBRTtBQUNSLFFBQUEsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUMsRUFBSSxFQUFBLE9BQUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFkLEVBQWMsQ0FBQyxDQUFDO1FBQ2xELElBQUksU0FBUyxFQUFFO0FBQ2IsWUFBQSxJQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQyxFQUFJLEVBQUEsT0FBQSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQWIsRUFBYSxDQUFDLENBQUM7QUFDMUQsWUFBQSxJQUFJLENBQUMsYUFBYTtBQUFFLGdCQUFBLE9BQU8sZ0JBQWdCLENBQUM7QUFDNUMsWUFBQSxPQUFPLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNwQztLQUNGOztBQUVELElBQUEsT0FBTyxnQkFBZ0IsQ0FBQztBQUMxQixFQUFFO0FBRVcsSUFBQSwwQkFBMEIsR0FBRyxVQUN4QyxHQUFXLEVBQ1gsZ0JBQStCLEVBQUE7QUFBL0IsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUF1QkEsVUFBRSxDQUFDLEtBQUssQ0FBQSxFQUFBO0FBRS9CLElBQUEsSUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsSUFBSSxTQUFTLENBQUMsSUFBSTtBQUNoQixRQUFBLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFaEUsSUFBQSxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLEVBQUU7QUFFVyxJQUFBLFlBQVksR0FBRyxVQUMxQixJQUE2QixFQUM3QixnQkFBK0IsRUFBQTs7QUFBL0IsSUFBQSxJQUFBLGdCQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUF1QkEsVUFBRSxDQUFDLEtBQUssQ0FBQSxFQUFBO0FBRS9CLElBQUEsSUFBTSxRQUFRLEdBQUcsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsSUFBSSxDQUFDLEtBQUssTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxTQUFTLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsUUFBUSxRQUFRLGFBQVIsUUFBUSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFSLFFBQVEsQ0FBRSxLQUFLO0FBQ3JCLFFBQUEsS0FBSyxHQUFHO1lBQ04sT0FBT0EsVUFBRSxDQUFDLEtBQUssQ0FBQztBQUNsQixRQUFBLEtBQUssR0FBRztZQUNOLE9BQU9BLFVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDbEIsUUFBQTs7QUFFRSxZQUFBLE9BQU8sZ0JBQWdCLENBQUM7S0FDM0I7QUFDSDs7QUM3NERBLElBQUEsS0FBQSxrQkFBQSxZQUFBO0FBSUUsSUFBQSxTQUFBLEtBQUEsQ0FDWSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULEVBQVUsRUFBQTtRQUhWLElBQUcsQ0FBQSxHQUFBLEdBQUgsR0FBRyxDQUEwQjtRQUM3QixJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsSUFBRSxDQUFBLEVBQUEsR0FBRixFQUFFLENBQVE7UUFQWixJQUFXLENBQUEsV0FBQSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUEsSUFBQSxHQUFHLENBQUMsQ0FBQztLQU9mO0FBQ0osSUFBQSxLQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO0FBQ0UsUUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3BCLENBQUE7SUFFRCxLQUFjLENBQUEsU0FBQSxDQUFBLGNBQUEsR0FBZCxVQUFlLEtBQWEsRUFBQTtBQUMxQixRQUFBLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0tBQzFCLENBQUE7SUFFRCxLQUFPLENBQUEsU0FBQSxDQUFBLE9BQUEsR0FBUCxVQUFRLElBQVksRUFBQTtBQUNsQixRQUFBLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCLENBQUE7SUFDSCxPQUFDLEtBQUEsQ0FBQTtBQUFELENBQUMsRUFBQSxDQUFBOztBQ25CRCxJQUFBLFVBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBZ0NTLGVBQUssQ0FBQSxVQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFDbkMsSUFBQSxTQUFBLFVBQUEsQ0FBWSxHQUE2QixFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBVSxFQUFBO1FBQ3pFLE9BQUEsTUFBSyxDQUFDLElBQUEsQ0FBQSxJQUFBLEVBQUEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUMsSUFBQSxDQUFBO0tBQ3RCO0FBRUQsSUFBQSxVQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQXFDLElBQUksRUFBeEMsR0FBRyxTQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsSUFBSSxVQUFBLEVBQUUsRUFBRSxRQUFBLEVBQUUsV0FBVyxpQkFBUSxDQUFDO1FBQ2hELElBQUksSUFBSSxJQUFJLENBQUM7WUFBRSxPQUFPO1FBQ3RCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5QyxRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDekIsUUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDWixZQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1NBQ3hCO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNwQixZQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1NBQ3hCO1FBQ0QsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2YsQ0FBQTtJQUNILE9BQUMsVUFBQSxDQUFBO0FBQUQsQ0F2QkEsQ0FBZ0MsS0FBSyxDQXVCcEMsQ0FBQTs7QUN2QkQsSUFBQSxVQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQWdDQSxlQUFLLENBQUEsVUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQ25DLElBQUEsU0FBQSxVQUFBLENBQ0UsR0FBNkIsRUFDN0IsQ0FBUyxFQUNULENBQVMsRUFDVCxFQUFVLEVBQ0YsR0FBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQUE7UUFFbkIsSUFBQSxLQUFBLEdBQUEsTUFBSyxDQUFDLElBQUEsQ0FBQSxJQUFBLEVBQUEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUMsSUFBQSxDQUFBO1FBSmIsS0FBRyxDQUFBLEdBQUEsR0FBSCxHQUFHLENBQVE7UUFDWCxLQUFNLENBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBSztRQUNYLEtBQU0sQ0FBQSxNQUFBLEdBQU4sTUFBTSxDQUFLOztLQUdwQjtBQUVELElBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUE2QyxJQUFJLEVBQWhELEdBQUcsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLEVBQUUsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFFLE1BQU0sR0FBQSxFQUFBLENBQUEsTUFBQSxFQUFFLE1BQU0sR0FBQSxFQUFBLENBQUEsTUFBQSxFQUFFLEdBQUcsR0FBQSxFQUFBLENBQUEsR0FBUSxDQUFDO1FBQ3hELElBQUksSUFBSSxJQUFJLENBQUM7WUFBRSxPQUFPO0FBQ3RCLFFBQUEsSUFBSSxHQUFHLENBQUM7QUFDUixRQUFBLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNaLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuQzthQUFNO1lBQ0wsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxHQUFHLEVBQUU7WUFDUCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDNUQ7S0FDRixDQUFBO0lBQ0gsT0FBQyxVQUFBLENBQUE7QUFBRCxDQTFCQSxDQUFnQyxLQUFLLENBMEJwQyxDQUFBOztBQ2JELElBQUEsYUFBQSxrQkFBQSxZQUFBO0FBQ0UsSUFBQSxTQUFBLGFBQUEsQ0FDVSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxRQUFrQixFQUNsQixRQUFrQixFQUNsQixLQUFzRCxFQUN0RCxZQUFxQixFQUFBO0FBRHJCLFFBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLEdBQTRCUCwwQkFBa0IsQ0FBQyxPQUFPLENBQUEsRUFBQTtRQVBoRSxJQVNJLEtBQUEsR0FBQSxJQUFBLENBQUE7UUFSTSxJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBMEI7UUFDN0IsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsSUFBUSxDQUFBLFFBQUEsR0FBUixRQUFRLENBQVU7UUFDbEIsSUFBUSxDQUFBLFFBQUEsR0FBUixRQUFRLENBQVU7UUFDbEIsSUFBSyxDQUFBLEtBQUEsR0FBTCxLQUFLLENBQWlEO1FBQ3RELElBQVksQ0FBQSxZQUFBLEdBQVosWUFBWSxDQUFTO0FBdUJ2QixRQUFBLElBQUEsQ0FBQSx3QkFBd0IsR0FBRyxZQUFBO1lBQzNCLElBQUEsRUFBQSxHQUFtRCxLQUFJLEVBQXRELEdBQUcsU0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLFFBQVEsR0FBQSxFQUFBLENBQUEsUUFBQSxFQUFFLFFBQVEsR0FBQSxFQUFBLENBQUEsUUFBQSxFQUFFLFlBQVksR0FBQSxFQUFBLENBQUEsWUFBUSxDQUFDO0FBQ3ZELFlBQUEsSUFBQSxLQUFLLEdBQUksUUFBUSxDQUFBLEtBQVosQ0FBYTtZQUV6QixJQUFJLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFeEQsWUFBQSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLGdCQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcscUJBQXFCLENBQUM7Z0JBQ3hDLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRSxnQkFBQSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNqQyxnQkFBQSxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3BELGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUN6QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1gsSUFBSSxZQUFZLEVBQUU7b0JBQ2hCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixvQkFBQSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2QyxvQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixvQkFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztvQkFDL0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUNkO0FBRUQsZ0JBQUEsSUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFFekIsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsR0FBRyxHQUFHLGNBQVcsQ0FBQztBQUN4QyxnQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUN4QixnQkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUV6QixnQkFBQSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxjQUFXLENBQUM7Z0JBQ2xDLElBQU0sU0FBUyxHQUFHLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDeEQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUU5QixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUEsQ0FBQSxNQUFBLENBQUcsUUFBUSxHQUFHLEdBQUcsY0FBVyxDQUFDO0FBQ3hDLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQ3hCLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUN6QixHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4RTtpQkFBTTtnQkFDTCxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzthQUMzQjtBQUNILFNBQUMsQ0FBQztBQUVNLFFBQUEsSUFBQSxDQUFBLHdCQUF3QixHQUFHLFlBQUE7WUFDM0IsSUFBQSxFQUFBLEdBQXFDLEtBQUksRUFBeEMsR0FBRyxTQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsUUFBUSxjQUFBLEVBQUUsUUFBUSxjQUFRLENBQUM7QUFDekMsWUFBQSxJQUFBLEtBQUssR0FBSSxRQUFRLENBQUEsS0FBWixDQUFhO1lBRXpCLElBQUksTUFBTSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUV4RCxZQUFBLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtnQkFDYixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsZ0JBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsZ0JBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQztnQkFDeEMsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLGdCQUFBLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLGdCQUFBLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFDcEQsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUVYLGdCQUFBLElBQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBRXpCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBQSxDQUFBLE1BQUEsQ0FBRyxRQUFRLEdBQUcsR0FBRyxjQUFXLENBQUM7QUFDeEMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDeEIsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFFekIsZ0JBQUEsSUFBTSxPQUFPLEdBQ1gsUUFBUSxDQUFDLGFBQWEsS0FBSyxHQUFHO3NCQUMxQixRQUFRLENBQUMsT0FBTztBQUNsQixzQkFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztnQkFFM0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRW5FLGdCQUFBLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLGNBQVcsQ0FBQztnQkFDbEMsSUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELGdCQUFBLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUU3QyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUEsQ0FBQSxNQUFBLENBQUcsUUFBUSxHQUFHLEdBQUcsY0FBVyxDQUFDO0FBQ3hDLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQ3hCLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUN6QixHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUV2RSxnQkFBQSxJQUFNLE9BQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUM3QixHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBSyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7aUJBQU07Z0JBQ0wsS0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7YUFDM0I7QUFDSCxTQUFDLENBQUM7QUFFTSxRQUFBLElBQUEsQ0FBQSxrQkFBa0IsR0FBRyxZQUFBO1lBQ3JCLElBQUEsRUFBQSxHQUFxQyxLQUFJLEVBQXhDLEdBQUcsU0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLFFBQVEsY0FBQSxFQUFFLFFBQVEsY0FBUSxDQUFDO1lBQ2hELElBQU0sTUFBTSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxRCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdDLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDO1lBQ3hDLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRSxZQUFBLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLFlBQUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztBQUNyRCxZQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNYLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNmLFNBQUMsQ0FBQztLQTVIRTtBQUVKLElBQUEsYUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUE0QyxJQUFJLENBQS9DLENBQUEsR0FBRyxTQUFBLENBQUUsQ0FBQyxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsRUFBQSxDQUFBLENBQUEsTUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBRSxDQUFRLEVBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBVSxFQUFBLENBQUEsUUFBQSxDQUFBLEtBQUUsS0FBSyxHQUFBLEVBQUEsQ0FBQSxNQUFTO1FBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPO1FBRWxCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFFBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsUUFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLFFBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7O0FBR25CLFFBQUEsSUFBSSxLQUFLLEtBQUtBLDBCQUFrQixDQUFDLE9BQU8sRUFBRTtZQUN4QyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztTQUNqQztBQUFNLGFBQUEsSUFBSSxLQUFLLEtBQUtBLDBCQUFrQixDQUFDLE9BQU8sRUFBRTtZQUMvQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztTQUNqQztRQUVELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUF5R0gsT0FBQyxhQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUN0SkQsSUFBQSxNQUFBLGtCQUFBLFlBQUE7SUFLRSxTQUNZLE1BQUEsQ0FBQSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxFQUFVLEVBQ1YsR0FBeUIsRUFBQTtBQUF6QixRQUFBLElBQUEsR0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBeUIsR0FBQSxFQUFBLENBQUEsRUFBQTtRQUx6QixJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBMEI7UUFDN0IsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsSUFBRSxDQUFBLEVBQUEsR0FBRixFQUFFLENBQVE7UUFDVixJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBc0I7UUFWM0IsSUFBVyxDQUFBLFdBQUEsR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSyxDQUFBLEtBQUEsR0FBRyxFQUFFLENBQUM7UUFDWCxJQUFRLENBQUEsUUFBQSxHQUFhLEVBQUUsQ0FBQztLQVM5QjtBQUVKLElBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtBQUNFLFFBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQixDQUFBO0lBRUQsTUFBYyxDQUFBLFNBQUEsQ0FBQSxjQUFBLEdBQWQsVUFBZSxLQUFhLEVBQUE7QUFDMUIsUUFBQSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztLQUMxQixDQUFBO0lBRUQsTUFBUSxDQUFBLFNBQUEsQ0FBQSxRQUFBLEdBQVIsVUFBUyxLQUFhLEVBQUE7QUFDcEIsUUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQixDQUFBO0lBRUQsTUFBVyxDQUFBLFNBQUEsQ0FBQSxXQUFBLEdBQVgsVUFBWSxRQUFrQixFQUFBO0FBQzVCLFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7S0FDMUIsQ0FBQTtJQUNILE9BQUMsTUFBQSxDQUFBO0FBQUQsQ0FBQyxFQUFBLENBQUE7O0FDM0JELElBQUEsWUFBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFrQ08sZUFBTSxDQUFBLFlBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUF4QyxJQUFBLFNBQUEsWUFBQSxHQUFBOztLQXdCQztBQXZCQyxJQUFBLFlBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBeUMsSUFBSSxFQUE1QyxHQUFHLFNBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxFQUFFLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBRSxXQUFXLEdBQUEsRUFBQSxDQUFBLFdBQUEsRUFBRSxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQVEsQ0FBQztBQUNwRCxRQUFBLElBQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdkIsUUFBQSxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQzlCLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDMUI7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3BCLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDMUI7YUFBTTtBQUNMLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDbkI7QUFDRCxRQUFBLElBQUksS0FBSztBQUFFLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDbkMsUUFBQSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7QUFDWixZQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNkO1FBQ0QsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2YsQ0FBQTtJQUNILE9BQUMsWUFBQSxDQUFBO0FBQUQsQ0F4QkEsQ0FBa0MsTUFBTSxDQXdCdkMsQ0FBQTs7QUN4QkQsSUFBQSxXQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQWlDQSxlQUFNLENBQUEsV0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQXZDLElBQUEsU0FBQSxXQUFBLEdBQUE7O0tBeUJDO0FBeEJDLElBQUEsV0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUFrQyxJQUFJLEVBQXJDLEdBQUcsU0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBQSxFQUFFLEVBQUUsUUFBQSxFQUFFLFdBQVcsaUJBQVEsQ0FBQztBQUM3QyxRQUFBLElBQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdkIsUUFBQSxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDWixZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQzFCO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNwQixZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQzFCO2FBQU07QUFDTCxZQUFBLElBQUksR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3RCO1FBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUMvQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUUvQixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2YsQ0FBQTtJQUNILE9BQUMsV0FBQSxDQUFBO0FBQUQsQ0F6QkEsQ0FBaUMsTUFBTSxDQXlCdEMsQ0FBQTs7QUN6QkQsSUFBQSxVQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQWdDQSxlQUFNLENBQUEsVUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQXRDLElBQUEsU0FBQSxVQUFBLEdBQUE7O0tBNkJDO0FBNUJDLElBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUF1QyxJQUFJLEVBQTFDLEdBQUcsU0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLEVBQUUsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFFLEdBQUcsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFFLFdBQVcsR0FBQSxFQUFBLENBQUEsV0FBUSxDQUFDO0FBQ2xELFFBQUEsSUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNyQixRQUFBLElBQUksUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7UUFDMUIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUU5QixRQUFBLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7U0FDeEI7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3BCLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7U0FDeEI7Ozs7UUFJRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQy9CLFlBQUEsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7U0FDdkI7YUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3RDLFlBQUEsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7U0FDdkI7YUFBTTtBQUNMLFlBQUEsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7U0FDdkI7QUFDRCxRQUFBLEdBQUcsQ0FBQyxJQUFJLEdBQUcsT0FBUSxDQUFBLE1BQUEsQ0FBQSxRQUFRLGNBQVcsQ0FBQztBQUN2QyxRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUEsR0FBRyxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7QUFDNUIsUUFBQSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUFDSCxPQUFDLFVBQUEsQ0FBQTtBQUFELENBN0JBLENBQWdDLE1BQU0sQ0E2QnJDLENBQUE7O0FDN0JELElBQUEsWUFBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFrQ0EsZUFBTSxDQUFBLFlBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUF4QyxJQUFBLFNBQUEsWUFBQSxHQUFBOztLQW9CQztBQW5CQyxJQUFBLFlBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBa0MsSUFBSSxFQUFyQyxHQUFHLFNBQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxFQUFFLFFBQUEsRUFBRSxXQUFXLGlCQUFRLENBQUM7UUFDN0MsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM5QixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDWixZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQzFCO0FBQU0sYUFBQSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNwQixZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQzFCO2FBQU07QUFDTCxZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDbkI7QUFDRCxRQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUFDSCxPQUFDLFlBQUEsQ0FBQTtBQUFELENBcEJBLENBQWtDLE1BQU0sQ0FvQnZDLENBQUE7O0FDcEJELElBQUEsY0FBQSxrQkFBQSxVQUFBLE1BQUEsRUFBQTtJQUFvQ0EsZUFBTSxDQUFBLGNBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUExQyxJQUFBLFNBQUEsY0FBQSxHQUFBOztLQXlCQztBQXhCQyxJQUFBLGNBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFlBQUE7UUFDUSxJQUFBLEVBQUEsR0FBa0MsSUFBSSxFQUFyQyxHQUFHLFNBQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUEsRUFBRSxFQUFFLFFBQUEsRUFBRSxXQUFXLGlCQUFRLENBQUM7QUFDN0MsUUFBQSxJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFFBQUEsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN6QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFFbkUsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFBLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDMUI7QUFBTSxhQUFBLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3BCLFlBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDMUI7YUFBTTtBQUNMLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBQSxJQUFJLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztTQUNyQjtRQUNELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxjQUFBLENBQUE7QUFBRCxDQXpCQSxDQUFvQyxNQUFNLENBeUJ6QyxDQUFBOztBQ3pCRCxJQUFBLFVBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUE7SUFBZ0NBLGVBQU0sQ0FBQSxVQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFBdEMsSUFBQSxTQUFBLFVBQUEsR0FBQTs7S0FpQkM7QUFoQkMsSUFBQSxVQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBQXlDLElBQUksQ0FBNUMsQ0FBQSxHQUFHLFNBQUEsQ0FBRSxDQUFBLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBRSxFQUFBLENBQUEsRUFBQSxDQUFBLEtBQUUsS0FBSyxHQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBRSxXQUFXLEdBQUEsRUFBQSxDQUFBLFlBQVM7QUFDcEQsUUFBQSxJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFFBQUEsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUN4QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM5QixRQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDeEIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7UUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxVQUFBLENBQUE7QUFBRCxDQWpCQSxDQUFnQyxNQUFNLENBaUJyQyxDQUFBOztBQ2pCRCxJQUFBLGdCQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQXNDQSxlQUFNLENBQUEsZ0JBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUE1QyxJQUFBLFNBQUEsZ0JBQUEsR0FBQTs7S0EyQkM7QUExQkMsSUFBQSxnQkFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUF5QyxJQUFJLENBQTVDLENBQUEsR0FBRyxTQUFBLENBQUUsQ0FBQSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFFLENBQUUsRUFBQSxDQUFBLEVBQUEsQ0FBQSxLQUFFLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBLENBQUUsV0FBVyxHQUFBLEVBQUEsQ0FBQSxZQUFTO0FBQ3BELFFBQUEsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN2QixRQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDeEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdEIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7UUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFZCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN0QixRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNaLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDWjtRQUNELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmLENBQUE7SUFDSCxPQUFDLGdCQUFBLENBQUE7QUFBRCxDQTNCQSxDQUFzQyxNQUFNLENBMkIzQyxDQUFBOztBQzNCRCxJQUFBLGlCQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQXVDQSxlQUFNLENBQUEsaUJBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUE3QyxJQUFBLFNBQUEsaUJBQUEsR0FBQTs7S0F3QkM7QUF2QkMsSUFBQSxpQkFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtRQUNRLElBQUEsRUFBQSxHQUF5QyxJQUFJLEVBQTVDLEdBQUcsU0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLENBQUMsR0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFFLEVBQUUsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFFLFdBQVcsR0FBQSxFQUFBLENBQUEsV0FBQSxFQUFFLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBUSxDQUFDO0FBQ3BELFFBQUEsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFBLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDekIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFBLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLFFBQUEsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ1osWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztTQUN4QjtBQUFNLGFBQUEsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDcEIsWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztTQUN4QjthQUFNO0FBQ0wsWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztTQUNuQjtBQUNELFFBQUEsSUFBSSxLQUFLO0FBQUUsWUFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUNqQyxRQUFBLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNaLFlBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ1o7UUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZixDQUFBO0lBQ0gsT0FBQyxpQkFBQSxDQUFBO0FBQUQsQ0F4QkEsQ0FBdUMsTUFBTSxDQXdCNUMsQ0FBQTs7QUMxQkQsSUFBQSxVQUFBLGtCQUFBLFlBQUE7SUFJRSxTQUNZLFVBQUEsQ0FBQSxHQUE2QixFQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULElBQVksRUFDWixFQUFVLEVBQUE7UUFKVixJQUFHLENBQUEsR0FBQSxHQUFILEdBQUcsQ0FBMEI7UUFDN0IsSUFBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxJQUFDLENBQUEsQ0FBQSxHQUFELENBQUMsQ0FBUTtRQUNULElBQUksQ0FBQSxJQUFBLEdBQUosSUFBSSxDQUFRO1FBQ1osSUFBRSxDQUFBLEVBQUEsR0FBRixFQUFFLENBQVE7UUFSWixJQUFXLENBQUEsV0FBQSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFLLENBQUEsS0FBQSxHQUFHLEVBQUUsQ0FBQztLQVFqQjtBQUVKLElBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFJLEdBQUosWUFBQTtBQUNFLFFBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQixDQUFBO0lBQ0gsT0FBQyxVQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUNaRCxJQUFNLE1BQU0sR0FBRyw4U0FFUixDQUFDO0FBRVIsSUFBQSxTQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBO0lBQStCQSxlQUFVLENBQUEsU0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0lBVXZDLFNBQ1ksU0FBQSxDQUFBLEdBQTZCLEVBQzdCLENBQVMsRUFDVCxDQUFTLEVBQ1QsSUFBWSxFQUNaLEVBQVUsRUFBQTtBQUVwQixRQUFBLElBQUEsS0FBQSxHQUFBLE1BQUssQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBQyxJQUFBLENBQUE7UUFOakIsS0FBRyxDQUFBLEdBQUEsR0FBSCxHQUFHLENBQTBCO1FBQzdCLEtBQUMsQ0FBQSxDQUFBLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsS0FBQyxDQUFBLENBQUEsR0FBRCxDQUFDLENBQVE7UUFDVCxLQUFJLENBQUEsSUFBQSxHQUFKLElBQUksQ0FBUTtRQUNaLEtBQUUsQ0FBQSxFQUFBLEdBQUYsRUFBRSxDQUFRO0FBZGQsUUFBQSxLQUFBLENBQUEsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDbEIsS0FBSyxDQUFBLEtBQUEsR0FBRyxDQUFDLENBQUM7UUFDVixLQUFjLENBQUEsY0FBQSxHQUFHLEdBQUcsQ0FBQztRQUNyQixLQUFlLENBQUEsZUFBQSxHQUFHLEdBQUcsQ0FBQztRQUN0QixLQUFZLENBQUEsWUFBQSxHQUFHLEdBQUcsQ0FBQztBQUNuQixRQUFBLEtBQUEsQ0FBQSxTQUFTLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRTlCLEtBQVcsQ0FBQSxXQUFBLEdBQUcsS0FBSyxDQUFDO0FBb0I1QixRQUFBLEtBQUEsQ0FBQSxJQUFJLEdBQUcsWUFBQTtBQUNMLFlBQUEsSUFBSSxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUN0QixPQUFPO2FBQ1I7WUFFSyxJQUFBLEVBQUEsR0FBMEQsS0FBSSxFQUE3RCxHQUFHLFNBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBRSxJQUFJLEdBQUEsRUFBQSxDQUFBLElBQUEsRUFBRSxHQUFHLEdBQUEsRUFBQSxDQUFBLEdBQUEsRUFBRSxjQUFjLEdBQUEsRUFBQSxDQUFBLGNBQUEsRUFBRSxlQUFlLEdBQUEsRUFBQSxDQUFBLGVBQVEsQ0FBQztBQUVyRSxZQUFBLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUU5QixZQUFBLElBQUksQ0FBQyxLQUFJLENBQUMsU0FBUyxFQUFFO0FBQ25CLGdCQUFBLEtBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO2FBQ3RCO0FBRUQsWUFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RCxZQUFBLEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQztZQUM3QixHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsWUFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUVwQixZQUFBLElBQU0sT0FBTyxHQUFHLEdBQUcsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDO0FBRXJDLFlBQUEsSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUU7QUFDckIsZ0JBQUEsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkQsZ0JBQUEsSUFBSSxPQUFPLElBQUksY0FBYyxFQUFFO0FBQzdCLG9CQUFBLEtBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2Ysb0JBQUEsVUFBVSxDQUFDLFlBQUE7QUFDVCx3QkFBQSxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4Qix3QkFBQSxLQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQyxxQkFBQyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDdkI7YUFDRjtpQkFBTTtBQUNMLGdCQUFBLElBQU0sV0FBVyxHQUFHLEdBQUcsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3pDLGdCQUFBLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxHQUFHLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1RCxnQkFBQSxJQUFJLFdBQVcsSUFBSSxlQUFlLEVBQUU7QUFDbEMsb0JBQUEsS0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixvQkFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdEQsT0FBTztpQkFDUjthQUNGO0FBRUQsWUFBQSxxQkFBcUIsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsU0FBQyxDQUFDOztBQWhEQSxRQUFnQixJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLGVBQWUsRUFBQyxFQUFFO1FBRTVELElBQU0sVUFBVSxHQUFHLDRCQUE2QixDQUFBLE1BQUEsQ0FBQWEsZUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFFLENBQUM7QUFFakUsUUFBQSxLQUFJLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDdkIsUUFBQSxLQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUM7O0tBQzNCO0lBMkNILE9BQUMsU0FBQSxDQUFBO0FBQUQsQ0FyRUEsQ0FBK0IsVUFBVSxDQXFFeEMsQ0FBQTs7QUM1QkQsSUFBTSxNQUFNLEdBRVIsRUFBRSxDQUFDO0FBRVAsU0FBUyxjQUFjLEdBQUE7SUFDckIsT0FBTywrREFBK0QsQ0FBQyxJQUFJLENBQ3pFLFNBQVMsQ0FBQyxTQUFTLENBQ3BCLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsSUFBYyxFQUFFLElBQWdCLEVBQUE7SUFDL0MsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsSUFBQSxJQUFNLFdBQVcsR0FBRyxZQUFBO0FBQ2xCLFFBQUEsTUFBTSxFQUFFLENBQUM7QUFDVCxRQUFBLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDMUIsWUFBQSxJQUFJLEVBQUUsQ0FBQztTQUNSO0FBQ0gsS0FBQyxDQUFDO0FBQ0YsSUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQzlCLFlBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxZQUFBO0FBQ3ZCLGdCQUFBLFdBQVcsRUFBRSxDQUFDO0FBQ2hCLGFBQUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsWUFBQTtBQUN4QixnQkFBQSxXQUFXLEVBQUUsQ0FBQztBQUNoQixhQUFDLENBQUM7U0FDSDtLQUNGO0FBQ0gsQ0FBQztBQUVELElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNkO0FBQ0EsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDakMsSUFBQSxHQUFHLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixJQUFJLEdBQUcsQ0FBQztBQUN2QyxDQUFDO0FBRUQsSUFBQSxRQUFBLGtCQUFBLFlBQUE7QUE4REUsSUFBQSxTQUFBLFFBQUEsQ0FBWSxPQUFtQyxFQUFBOztBQUFuQyxRQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBbUMsR0FBQSxFQUFBLENBQUEsRUFBQTtRQUEvQyxJQWtKQyxLQUFBLEdBQUEsSUFBQSxDQUFBO0FBL01ELFFBQUEsSUFBQSxDQUFBLGNBQWMsR0FBb0I7QUFDaEMsWUFBQSxTQUFTLEVBQUUsRUFBRTtBQUNiLFlBQUEsY0FBYyxFQUFFLEtBQUs7QUFDckIsWUFBQSxPQUFPLEVBQUUsRUFBRTtBQUNYLFlBQUEsTUFBTSxFQUFFLENBQUM7QUFDVCxZQUFBLFdBQVcsRUFBRSxLQUFLO0FBQ2xCLFlBQUEsVUFBVSxFQUFFLElBQUk7WUFDaEIsS0FBSyxFQUFFckIsYUFBSyxDQUFDLGFBQWE7WUFDMUIsa0JBQWtCLEVBQUVDLDBCQUFrQixDQUFDLE9BQU87QUFDOUMsWUFBQSxVQUFVLEVBQUUsS0FBSztBQUNqQixZQUFBLFlBQVksRUFBRSxLQUFLO0FBQ25CLFlBQUEsaUJBQWlCLEVBQUUsSUFBSTtBQUN2QixZQUFBLGtCQUFrQixFQUFFLENBQUM7QUFDckIsWUFBQSxjQUFjLEVBQUUsQ0FBQztBQUNqQixZQUFBLGVBQWUsRUFBRSxHQUFHO0FBQ3BCLFlBQUEsbUJBQW1CLEVBQUUsU0FBUztBQUM5QixZQUFBLGlCQUFpQixFQUFFLFNBQVM7QUFDNUIsWUFBQSxpQkFBaUIsRUFBRSxTQUFTO0FBQzVCLFlBQUEsZ0JBQWdCLEVBQUUsU0FBUztBQUMzQixZQUFBLGdCQUFnQixFQUFFLFNBQVM7QUFDM0IsWUFBQSxnQkFBZ0IsRUFBRSxTQUFTO0FBQzNCLFlBQUEsY0FBYyxFQUFFLGVBQWU7QUFDL0IsWUFBQSxTQUFTLEVBQUUsS0FBSztBQUNoQixZQUFBLGdCQUFnQixFQUFFLElBQUk7QUFDdEIsWUFBQSxRQUFRLEVBQUUsQ0FBQztBQUNYLFlBQUEscUJBQXFCLEVBQUUsQ0FBQztTQUN6QixDQUFDO0FBV00sUUFBQSxJQUFBLENBQUEsTUFBTSxHQUFXSSxjQUFNLENBQUMsSUFBSSxDQUFDO1FBQzdCLElBQVcsQ0FBQSxXQUFBLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLElBQVcsQ0FBQSxXQUFBLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFFBQUEsSUFBQSxDQUFBLGVBQWUsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBRzVDLFFBQUEsSUFBQSxDQUFBLFdBQVcsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ3ZDLFFBQUEsSUFBQSxDQUFBLGlCQUFpQixHQUFhLElBQUksUUFBUSxFQUFFLENBQUM7QUFnU3BELFFBQUEsSUFBQSxDQUFBLG1CQUFtQixHQUFHLFVBQUMsUUFBa0IsRUFBRSxPQUFXLEVBQUE7O0FBQVgsWUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQVcsR0FBQSxDQUFBLENBQUEsRUFBQTs7QUFFN0MsWUFBQSxJQUFBLE9BQU8sR0FBSSxLQUFJLENBQUMsT0FBTyxRQUFoQixDQUFpQjtBQUN4QixZQUFBLElBQUEsS0FBSyxHQUFJLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxNQUE5QixDQUErQjtBQUMzQyxZQUFBLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9ELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO1lBQ2hFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUMxRSxZQUFBLElBQU0sRUFBRSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDdkIsWUFBQSxJQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQU0sYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzQyxJQUFNLENBQUMsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN0RCxZQUFBLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDM0IsWUFBQSxLQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUUvQyxZQUFBLElBQUksQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxLQUFJLENBQUMsY0FBYywwQ0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFLLENBQUMsRUFBRTtnQkFDbkQsS0FBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsZ0JBQUEsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNsQyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xCLE9BQU87YUFDUjs7Ozs7O0FBT0QsWUFBQSxLQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNyQixZQUFBLEtBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6QyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFFbEIsWUFBQSxJQUFJLGNBQWMsRUFBRTtnQkFBRSxLQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDekMsU0FBQyxDQUFDO1FBRU0sSUFBVyxDQUFBLFdBQUEsR0FBRyxVQUFDLENBQWEsRUFBQTtBQUNsQyxZQUFBLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsWUFBQSxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRXBCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQixZQUFBLElBQU0sS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDN0QsWUFBQSxLQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEMsU0FBQyxDQUFDO1FBRU0sSUFBYyxDQUFBLGNBQUEsR0FBRyxVQUFDLENBQWEsRUFBQTtBQUNyQyxZQUFBLElBQUksS0FBSyxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDM0IsWUFBQSxJQUFNLE1BQU0sR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDO0FBQ2pDLFlBQUEsSUFBSSxDQUFDLE1BQU07QUFBRSxnQkFBQSxPQUFPLEtBQUssQ0FBQztBQUMxQixZQUFBLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzVDLFlBQUEsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQztBQUNqQyxZQUFBLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FDbEIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUN0QyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQ3RDLENBQUM7QUFDRixZQUFBLE9BQU8sS0FBSyxDQUFDO0FBQ2YsU0FBQyxDQUFDO1FBRU0sSUFBWSxDQUFBLFlBQUEsR0FBRyxVQUFDLENBQWEsRUFBQTtBQUNuQyxZQUFBLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsWUFBQSxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRXBCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQixZQUFBLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsWUFBQSxLQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztBQUM3QixZQUFBLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxTQUFDLENBQUM7UUFFTSxJQUFXLENBQUEsV0FBQSxHQUFHLFVBQUMsQ0FBYSxFQUFBO0FBQ2xDLFlBQUEsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQztBQUNqQyxZQUFBLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU87WUFFcEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLFlBQUEsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDZixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsWUFBQSxJQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVE7QUFDckQsZ0JBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUNyRDtBQUNBLGdCQUFBLE1BQU0sR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO2FBQzdDO0FBQ0QsWUFBQSxLQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLFNBQUMsQ0FBQztBQUVNLFFBQUEsSUFBQSxDQUFBLFVBQVUsR0FBRyxZQUFBO0FBQ25CLFlBQUEsS0FBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDM0IsU0FBQyxDQUFDO0FBa0RGLFFBQUEsSUFBQSxDQUFBLFVBQVUsR0FBRyxZQUFBO0FBQ0osWUFBQSxJQUFBLFdBQVcsR0FBSSxLQUFJLENBQUEsV0FBUixDQUFTO0FBQ3BCLFlBQUEsSUFBQSxTQUFTLEdBQUksS0FBSSxDQUFDLE9BQU8sVUFBaEIsQ0FBaUI7WUFFakMsSUFDRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDO2lCQUM5RCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQ2hFO2dCQUNBLE9BQU9ILGNBQU0sQ0FBQyxNQUFNLENBQUM7YUFDdEI7WUFFRCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzNCLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQUUsT0FBT0EsY0FBTSxDQUFDLE9BQU8sQ0FBQztxQkFDOUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUM7b0JBQUUsT0FBT0EsY0FBTSxDQUFDLFVBQVUsQ0FBQzs7b0JBQ2xFLE9BQU9BLGNBQU0sQ0FBQyxJQUFJLENBQUM7YUFDekI7QUFBTSxpQkFBQSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQyxFQUFFO2dCQUM5QyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUFFLE9BQU9BLGNBQU0sQ0FBQyxRQUFRLENBQUM7cUJBQy9DLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDO29CQUFFLE9BQU9BLGNBQU0sQ0FBQyxXQUFXLENBQUM7O29CQUNuRSxPQUFPQSxjQUFNLENBQUMsS0FBSyxDQUFDO2FBQzFCO2lCQUFNO2dCQUNMLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQUUsT0FBT0EsY0FBTSxDQUFDLEdBQUcsQ0FBQztxQkFDMUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUM7b0JBQUUsT0FBT0EsY0FBTSxDQUFDLE1BQU0sQ0FBQzs7b0JBQzlELE9BQU9BLGNBQU0sQ0FBQyxNQUFNLENBQUM7YUFDM0I7QUFDSCxTQUFDLENBQUM7QUFzTEYsUUFBQSxJQUFBLENBQUEsY0FBYyxHQUFHLFlBQUE7QUFDZixZQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixZQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFlBQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEMsS0FBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDekIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDN0IsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsVUFBVSxHQUFHLFlBQUE7WUFDWCxJQUFJLENBQUMsS0FBSSxDQUFDLEtBQUs7Z0JBQUUsT0FBTztZQUN4QixJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxnQkFBQSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRW5DLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6RCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDZjtBQUNILFNBQUMsQ0FBQztRQUVGLElBQVcsQ0FBQSxXQUFBLEdBQUcsVUFBQyxNQUFvQixFQUFBO0FBQXBCLFlBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFBLEdBQVMsS0FBSSxDQUFDLE1BQU0sQ0FBQSxFQUFBO0FBQ2pDLFlBQUEsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUNwQixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLElBQUksR0FBRyxFQUFFO2dCQUNQLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLGdCQUFBLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQyxnQkFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2pELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNmO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsaUJBQWlCLEdBQUcsWUFBQTtZQUNsQixJQUFJLENBQUMsS0FBSSxDQUFDLFlBQVk7Z0JBQUUsT0FBTztZQUMvQixJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxnQkFBQSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3ZFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNmO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsaUJBQWlCLEdBQUcsWUFBQTtZQUNsQixJQUFJLENBQUMsS0FBSSxDQUFDLFlBQVk7Z0JBQUUsT0FBTztBQUMvQixZQUFhLEtBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNwQyxJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxnQkFBQSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3ZFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNmO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsbUJBQW1CLEdBQUcsWUFBQTtZQUNwQixJQUFJLENBQUMsS0FBSSxDQUFDLGNBQWM7Z0JBQUUsT0FBTztZQUNqQyxJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxnQkFBQSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsZ0JBQUEsR0FBRyxDQUFDLFNBQVMsQ0FDWCxDQUFDLEVBQ0QsQ0FBQyxFQUNELEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUN6QixLQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FDM0IsQ0FBQztnQkFDRixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDZjtBQUNILFNBQUMsQ0FBQztRQUVGLElBQVksQ0FBQSxZQUFBLEdBQUcsVUFBQyxRQUF3QixFQUFBO0FBQXhCLFlBQUEsSUFBQSxRQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLEdBQVcsS0FBSSxDQUFDLFFBQVEsQ0FBQSxFQUFBO0FBQ3RDLFlBQUEsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQztZQUM3QixJQUFBLEVBQUEsR0FLRixLQUFJLENBQUMsT0FBTyxFQUpkLEVBQTJCLEdBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUEzQixLQUFLLEdBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFHRixhQUFLLENBQUMsYUFBYSxHQUFBLEVBQUEsQ0FBQSxDQUMzQixrQkFBa0IsR0FBQSxFQUFBLENBQUEsa0JBQUEsQ0FBQSxDQUNsQixTQUFTLEdBQUEsRUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUNhLEVBQUEsQ0FBQSx1QkFDUDtZQUNYLElBQUEsRUFBQSxHQUFnQixLQUFJLEVBQW5CLEdBQUcsU0FBQSxFQUFFLE1BQU0sWUFBUSxDQUFDO0FBQzNCLFlBQUEsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVE7Z0JBQUUsT0FBTztZQUNqQyxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLFlBQUEsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTztZQUNqQixLQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUNwQixZQUFBLElBQUEsUUFBUSxHQUFJLFFBQVEsQ0FBQSxRQUFaLENBQWE7QUFFNUIsWUFBQSxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsRUFBQTtBQUMxQixnQkFBQSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTTtvQkFBRSxPQUFPO2dCQUM5QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7Ozs7O2dCQU10QyxJQUFJLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztBQUNsQyxnQkFBQSxJQUFNLFlBQVksR0FBRyxZQUFZLENBQy9CLENBQUMsQ0FBQyxJQUFJLEVBQ04sQ0FBQyxFQUNELGlCQUFpQixHQUFHLEtBQUssQ0FBQyxFQUFFLENBQzdCLENBQUM7Z0JBQ0UsSUFBQSxFQUFBLEdBQWUsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFoQyxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQUEsRUFBSyxDQUFDLEdBQUEsRUFBQSxDQUFBLENBQXlCLENBQUM7Z0JBQ3pDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQUUsT0FBTztnQkFDdEIsSUFBQSxFQUFBLEdBQXlCLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFsRCxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxhQUFhLEdBQUEsRUFBQSxDQUFBLGFBQThCLENBQUM7QUFDMUQsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsYUFBYSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDcEMsZ0JBQUEsSUFBTSxDQUFDLEdBQUcsYUFBYSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3BDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDbkIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsZ0JBQUEsSUFDRSxLQUFLLEtBQUtBLGFBQUssQ0FBQyxPQUFPO29CQUN2QixLQUFLLEtBQUtBLGFBQUssQ0FBQyxhQUFhO0FBQzdCLG9CQUFBLEtBQUssS0FBS0EsYUFBSyxDQUFDLElBQUksRUFDcEI7QUFDQSxvQkFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixvQkFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixvQkFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUN6QixvQkFBQSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztpQkFDcEI7cUJBQU07QUFDTCxvQkFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixvQkFBQSxHQUFHLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixvQkFBQSxHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUN6QixvQkFBQSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztpQkFDcEI7QUFFRCxnQkFBQSxJQUFJLFlBQVksQ0FBQztBQUNqQixnQkFBQSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNJLGNBQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUM5QyxvQkFBQSxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztpQkFDL0M7QUFFRCxnQkFBQSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNBLGNBQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUM5QyxvQkFBQSxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztpQkFDL0M7QUFFRCxnQkFBQSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNBLGNBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUM3QyxvQkFBQSxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDOUM7Z0JBRUQsSUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFhLENBQzdCLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxFQUNELEtBQUssR0FBRyxLQUFLLEVBQ2IsUUFBUSxFQUNSLENBQUMsRUFDRCxrQkFBa0IsRUFDbEIsWUFBWSxDQUNiLENBQUM7Z0JBQ0YsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQixhQUFDLENBQUMsQ0FBQztBQUNMLFNBQUMsQ0FBQztRQUVGLElBQVUsQ0FBQSxVQUFBLEdBQUcsVUFDWCxHQUFjLEVBQ2QsTUFBb0IsRUFDcEIsWUFBZ0MsRUFDaEMsS0FBWSxFQUFBO0FBSFosWUFBQSxJQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEdBQUEsR0FBTSxLQUFJLENBQUMsR0FBRyxDQUFBLEVBQUE7QUFDZCxZQUFBLElBQUEsTUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsTUFBQSxHQUFTLEtBQUksQ0FBQyxNQUFNLENBQUEsRUFBQTtBQUNwQixZQUFBLElBQUEsWUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsWUFBQSxHQUFlLEtBQUksQ0FBQyxZQUFZLENBQUEsRUFBQTtBQUNoQyxZQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBWSxHQUFBLElBQUEsQ0FBQSxFQUFBO1lBRVosSUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDO1lBQzVCLElBQUksTUFBTSxFQUFFO0FBQ1YsZ0JBQUEsSUFBSSxLQUFLO0FBQUUsb0JBQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3Q0FDM0IsQ0FBQyxFQUFBOzRDQUNDLENBQUMsRUFBQTt3QkFDUixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsd0JBQUEsTUFBTSxLQUFOLElBQUEsSUFBQSxNQUFNLEtBQU4sS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQSxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUE7NEJBQzlCLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO2dDQUM1QixJQUFBLEVBQUEsR0FBeUIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEVBQWxELEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGFBQWEsR0FBQSxFQUFBLENBQUEsYUFBOEIsQ0FBQztBQUMxRCxnQ0FBQSxJQUFNLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNwQyxnQ0FBQSxJQUFNLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQ0FDcEMsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLGdDQUFBLElBQUksUUFBTSxDQUFDO2dDQUNYLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBRXBDLElBQUksR0FBRyxFQUFFO29DQUNQLFFBQVEsS0FBSztBQUNYLHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxNQUFNLEVBQUU7QUFDbEIsNENBQUEsUUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0Q0FDaEQsTUFBTTt5Q0FDUDtBQUNELHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxPQUFPLEVBQUU7QUFDbkIsNENBQUEsUUFBTSxHQUFHLElBQUksaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzRDQUNyRCxNQUFNO3lDQUNQO3dDQUNELEtBQUtBLGNBQU0sQ0FBQyxrQkFBa0IsQ0FBQzt3Q0FDL0IsS0FBS0EsY0FBTSxDQUFDLHdCQUF3QixDQUFDO3dDQUNyQyxLQUFLQSxjQUFNLENBQUMsd0JBQXdCLENBQUM7d0NBQ3JDLEtBQUtBLGNBQU0sQ0FBQyxrQkFBa0IsQ0FBQzt3Q0FDL0IsS0FBS0EsY0FBTSxDQUFDLHdCQUF3QixDQUFDO3dDQUNyQyxLQUFLQSxjQUFNLENBQUMsd0JBQXdCLENBQUM7d0NBQ3JDLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLHVCQUF1QixDQUFDO3dDQUNwQyxLQUFLQSxjQUFNLENBQUMsdUJBQXVCLENBQUM7d0NBQ3BDLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLHVCQUF1QixDQUFDO3dDQUNwQyxLQUFLQSxjQUFNLENBQUMsdUJBQXVCLENBQUM7d0NBQ3BDLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLHVCQUF1QixDQUFDO0FBQ3BDLHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyx1QkFBdUIsRUFBRTtBQUMvQiw0Q0FBQSxJQUFBLEVBQW9CLEdBQUEsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUEvQyxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxRQUFRLGNBQWdDLENBQUM7QUFFckQsNENBQUEsUUFBTSxHQUFHLElBQUksZ0JBQWdCLENBQzNCLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxFQUNELEtBQUssRUFDTCxFQUFFLEVBQ0ZBLGNBQU0sQ0FBQyxNQUFNLENBQ2QsQ0FBQztBQUNGLDRDQUFBLFFBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsNENBQUEsUUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0Q0FDN0IsTUFBTTt5Q0FDUDt3Q0FDRCxLQUFLQSxjQUFNLENBQUMsWUFBWSxDQUFDO3dDQUN6QixLQUFLQSxjQUFNLENBQUMsa0JBQWtCLENBQUM7d0NBQy9CLEtBQUtBLGNBQU0sQ0FBQyxrQkFBa0IsQ0FBQzt3Q0FDL0IsS0FBS0EsY0FBTSxDQUFDLFlBQVksQ0FBQzt3Q0FDekIsS0FBS0EsY0FBTSxDQUFDLGtCQUFrQixDQUFDO3dDQUMvQixLQUFLQSxjQUFNLENBQUMsa0JBQWtCLENBQUM7d0NBQy9CLEtBQUtBLGNBQU0sQ0FBQyxXQUFXLENBQUM7d0NBQ3hCLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLGlCQUFpQixDQUFDO3dDQUM5QixLQUFLQSxjQUFNLENBQUMsV0FBVyxDQUFDO3dDQUN4QixLQUFLQSxjQUFNLENBQUMsaUJBQWlCLENBQUM7d0NBQzlCLEtBQUtBLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQzt3Q0FDOUIsS0FBS0EsY0FBTSxDQUFDLFdBQVcsQ0FBQzt3Q0FDeEIsS0FBS0EsY0FBTSxDQUFDLGlCQUFpQixDQUFDO3dDQUM5QixLQUFLQSxjQUFNLENBQUMsaUJBQWlCLENBQUM7QUFDOUIsd0NBQUEsS0FBS0EsY0FBTSxDQUFDLElBQUksRUFBRTtBQUNaLDRDQUFBLElBQUEsRUFBb0IsR0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQS9DLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLFFBQVEsY0FBZ0MsQ0FBQztBQUNyRCw0Q0FBQSxRQUFNLEdBQUcsSUFBSSxVQUFVLENBQ3JCLEdBQUcsRUFDSCxDQUFDLEVBQ0QsQ0FBQyxFQUNELEtBQUssRUFDTCxFQUFFLEVBQ0ZBLGNBQU0sQ0FBQyxNQUFNLENBQ2QsQ0FBQztBQUNGLDRDQUFBLFFBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsNENBQUEsUUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0Q0FDN0IsTUFBTTt5Q0FDUDtBQUNELHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxNQUFNLEVBQUU7QUFDbEIsNENBQUEsUUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0Q0FDaEQsTUFBTTt5Q0FDUDtBQUNELHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxRQUFRLEVBQUU7QUFDcEIsNENBQUEsUUFBTSxHQUFHLElBQUksY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0Q0FDbEQsTUFBTTt5Q0FDUDtBQUNELHdDQUFBLEtBQUtBLGNBQU0sQ0FBQyxLQUFLLEVBQUU7QUFDakIsNENBQUEsUUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0Q0FDL0MsTUFBTTt5Q0FDUDt3Q0FDRCxTQUFTO0FBQ1AsNENBQUEsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO0FBQ2hCLGdEQUFBLFFBQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOzZDQUN0RDs0Q0FDRCxNQUFNO3lDQUNQO3FDQUNGO0FBQ0Qsb0NBQUEsUUFBTSxhQUFOLFFBQU0sS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBTixRQUFNLENBQUUsSUFBSSxFQUFFLENBQUM7aUNBQ2hCOzZCQUNGO0FBQ0gseUJBQUMsQ0FBQyxDQUFDOztBQXJHTCxvQkFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQTtnQ0FBaEMsQ0FBQyxDQUFBLENBQUE7QUFzR1QscUJBQUE7O0FBdkdILGdCQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFBOzRCQUE3QixDQUFDLENBQUEsQ0FBQTtBQXdHVCxpQkFBQTthQUNGO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsU0FBUyxHQUFHLFVBQUMsS0FBa0IsRUFBRSxLQUFZLEVBQUE7QUFBaEMsWUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsR0FBUSxLQUFJLENBQUMsS0FBSyxDQUFBLEVBQUE7QUFBRSxZQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBWSxHQUFBLElBQUEsQ0FBQSxFQUFBO0FBQzNDLFlBQUEsSUFBSSxLQUFLO0FBQUUsZ0JBQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxZQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEIsWUFBQSxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLFlBQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QixZQUFBLElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQzNCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN2QjtBQUNILFNBQUMsQ0FBQztRQUVGLElBQU8sQ0FBQSxPQUFBLEdBQUcsVUFBQyxLQUFrQixFQUFBO0FBQWxCLFlBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLEdBQVEsS0FBSSxDQUFDLEtBQUssQ0FBQSxFQUFBO0FBQ3JCLFlBQUEsSUFBQSxFQUFtQyxHQUFBLEtBQUksQ0FBQyxPQUFPLEVBQTlDLEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGNBQWMsR0FBQSxFQUFBLENBQUEsY0FBQSxFQUFFLE9BQU8sYUFBZ0IsQ0FBQztZQUN0RCxJQUFJLEtBQUssRUFBRTtBQUNULGdCQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDakMsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxHQUFHLEVBQUU7QUFDUCxvQkFBQSxJQUFJLEtBQUssS0FBS0osYUFBSyxDQUFDLGFBQWEsRUFBRTtBQUNqQyx3QkFBQSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztBQUM5Qyx3QkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzt3QkFDMUIsR0FBRyxDQUFDLFFBQVEsQ0FDVixDQUFDLE9BQU8sRUFDUixDQUFDLE9BQU8sRUFDUixLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sRUFDckIsS0FBSyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQ3ZCLENBQUM7cUJBQ0g7QUFBTSx5QkFBQSxJQUFJLEtBQUssS0FBS0EsYUFBSyxDQUFDLElBQUksRUFBRTt3QkFDL0IsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO3dCQUNqRCxHQUFHLENBQUMsUUFBUSxDQUNWLENBQUMsT0FBTyxFQUNSLENBQUMsT0FBTyxFQUNSLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxFQUNyQixLQUFLLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FDdkIsQ0FBQztxQkFDSDtBQUFNLHlCQUFBLElBQ0wsS0FBSyxLQUFLQSxhQUFLLENBQUMsTUFBTTt3QkFDdEIsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQ3pDO3dCQUNBLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQ25ELHdCQUFBLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDbEMsSUFBSSxRQUFRLEVBQUU7NEJBQ1osR0FBRyxDQUFDLFNBQVMsQ0FDWCxRQUFRLEVBQ1IsQ0FBQyxPQUFPLEVBQ1IsQ0FBQyxPQUFPLEVBQ1IsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLEVBQ3JCLEtBQUssQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUN2QixDQUFDO3lCQUNIO3FCQUNGO3lCQUFNO3dCQUNMLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQ25ELHdCQUFBLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxLQUFLLEVBQUU7NEJBQ1QsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7NEJBQ25ELElBQUksT0FBTyxFQUFFO0FBQ1gsZ0NBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDeEIsZ0NBQUEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzZCQUMvQzt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO0FBQ0gsU0FBQyxDQUFDO1FBRUYsSUFBYSxDQUFBLGFBQUEsR0FBRyxVQUFDLEtBQWtCLEVBQUE7QUFBbEIsWUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsR0FBUSxLQUFJLENBQUMsS0FBSyxDQUFBLEVBQUE7QUFDakMsWUFBQSxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPO1lBQ2IsSUFBQSxFQUFBLEdBQXlCLEtBQUksRUFBNUIsV0FBVyxpQkFBQSxFQUFFLE9BQU8sYUFBUSxDQUFDO0FBRWxDLFlBQUEsSUFBQSxJQUFJLEdBTUYsT0FBTyxDQUFBLElBTkwsRUFDSixTQUFTLEdBS1AsT0FBTyxDQUxBLFNBQUEsRUFDVCxjQUFjLEdBSVosT0FBTyxDQUFBLGNBSkssRUFDZCxrQkFBa0IsR0FHaEIsT0FBTyxDQUhTLGtCQUFBLEVBQ2xCLGVBQWUsR0FFYixPQUFPLENBQUEsZUFGTSxFQUNmLGlCQUFpQixHQUNmLE9BQU8sa0JBRFEsQ0FDUDtZQUNaLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsSUFBSSxHQUFHLEVBQUU7Z0JBQ0QsSUFBQSxFQUFBLEdBQXlCLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFsRCxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxhQUFhLEdBQUEsRUFBQSxDQUFBLGFBQThCLENBQUM7QUFFMUQsZ0JBQUEsSUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLGVBQWUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBRXZELGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUUxQixJQUFJLGFBQWEsR0FBRyxpQkFBaUI7QUFDbkMsc0JBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLO3NCQUNuQixrQkFBa0IsQ0FBQzs7OztBQU12QixnQkFBQSxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxjQUFjLENBQUM7Ozs7O2dCQU96RSxLQUFLLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUMzRCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsb0JBQUEsSUFDRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDbkMseUJBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFDNUQ7QUFDQSx3QkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztxQkFDL0I7eUJBQU07QUFDTCx3QkFBQSxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztxQkFDM0I7QUFDRCxvQkFBQSxJQUNFLGNBQWMsRUFBRTtBQUNoQix3QkFBQSxDQUFDLEtBQUssS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQzVCLEtBQUksQ0FBQyxXQUFXLEVBQ2hCO3dCQUNBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7cUJBQ25DO29CQUNELElBQUksV0FBVyxHQUNiLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDO0FBQzVCLDBCQUFFLGFBQWEsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLGFBQWEsR0FBRyxDQUFDO0FBQy9ELDBCQUFFLGFBQWEsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUNoRCxJQUFJLGNBQWMsRUFBRSxFQUFFO0FBQ3BCLHdCQUFBLFdBQVcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO3FCQUN4QjtvQkFDRCxJQUFJLFNBQVMsR0FDWCxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQztBQUM1QiwwQkFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsR0FBRyxhQUFhLEdBQUcsQ0FBQztBQUMvRCwwQkFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztvQkFDaEQsSUFBSSxjQUFjLEVBQUUsRUFBRTtBQUNwQix3QkFBQSxTQUFTLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztxQkFDdEI7b0JBQ0QsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFBRSxXQUFXLElBQUksV0FBVyxDQUFDO29CQUN0RCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQzt3QkFBRSxTQUFTLElBQUksV0FBVyxDQUFDO29CQUNoRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO29CQUNuRCxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUNqRCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2Q7O2dCQUdELEtBQUssSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzNELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixvQkFBQSxJQUNFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNuQyx5QkFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUM1RDtBQUNBLHdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO3FCQUMvQjt5QkFBTTtBQUNMLHdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO3FCQUMzQjtBQUNELG9CQUFBLElBQ0UsY0FBYyxFQUFFO0FBQ2hCLHdCQUFBLENBQUMsS0FBSyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsS0FBSSxDQUFDLFdBQVcsRUFDaEI7d0JBQ0EsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztxQkFDbkM7b0JBQ0QsSUFBSSxXQUFXLEdBQ2IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUM7QUFDNUIsMEJBQUUsYUFBYSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxHQUFHLENBQUM7QUFDL0QsMEJBQUUsYUFBYSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7b0JBQ2hELElBQUksU0FBUyxHQUNYLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDO0FBQzVCLDBCQUFFLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxHQUFHLGFBQWEsR0FBRyxDQUFDO0FBQy9ELDBCQUFFLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO29CQUNoRCxJQUFJLGNBQWMsRUFBRSxFQUFFO0FBQ3BCLHdCQUFBLFdBQVcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO3FCQUN4QjtvQkFDRCxJQUFJLGNBQWMsRUFBRSxFQUFFO0FBQ3BCLHdCQUFBLFNBQVMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO3FCQUN0QjtvQkFFRCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUFFLFdBQVcsSUFBSSxXQUFXLENBQUM7b0JBQ3RELElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDO3dCQUFFLFNBQVMsSUFBSSxXQUFXLENBQUM7b0JBQ2hFLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDLENBQUM7b0JBQ2pELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDZDthQUNGO0FBQ0gsU0FBQyxDQUFDO1FBRUYsSUFBUyxDQUFBLFNBQUEsR0FBRyxVQUFDLEtBQWtCLEVBQUE7QUFBbEIsWUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsR0FBUSxLQUFJLENBQUMsS0FBSyxDQUFBLEVBQUE7QUFDN0IsWUFBQSxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPO0FBQ25CLFlBQUEsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFO2dCQUFFLE9BQU87WUFFdEMsSUFBQSxFQUFBLEdBQWdELEtBQUksQ0FBQyxPQUFPLEVBQWpELGVBQWUsR0FBQSxFQUFBLENBQUEsUUFBQSxFQUFFLGdCQUFnQixHQUFBLEVBQUEsQ0FBQSxnQkFBZ0IsQ0FBQztBQUVqRSxZQUFBLElBQU0sV0FBVyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUM7WUFDckMsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQyxZQUFBLElBQUksUUFBUSxHQUFHLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLGVBQWUsQ0FBQzs7OztZQUl6RSxJQUFJLEdBQUcsRUFBRTtnQkFDRCxJQUFBLEVBQUEsR0FBeUIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEVBQWxELE9BQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGVBQWEsR0FBQSxFQUFBLENBQUEsYUFBOEIsQ0FBQzs7Z0JBRTFELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDYixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxFQUFBO29CQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxFQUFBO3dCQUNsQixJQUNFLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLDRCQUFBLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLDRCQUFBLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN0QixDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN0Qjs0QkFDQSxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7NEJBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQ0wsQ0FBQyxHQUFHLE9BQUssR0FBRyxlQUFhLEVBQ3pCLENBQUMsR0FBRyxPQUFLLEdBQUcsZUFBYSxFQUN6QixRQUFRLEVBQ1IsQ0FBQyxFQUNELENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUNYLElBQUksQ0FDTCxDQUFDO0FBQ0YsNEJBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7NEJBQ3hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt5QkFDWjtBQUNILHFCQUFDLENBQUMsQ0FBQztBQUNMLGlCQUFDLENBQUMsQ0FBQzthQUNKO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsY0FBYyxHQUFHLFlBQUE7WUFDVCxJQUFBLEVBQUEsR0FBZ0MsS0FBSSxFQUFuQyxLQUFLLEdBQUEsRUFBQSxDQUFBLEtBQUEsRUFBRSxPQUFPLEdBQUEsRUFBQSxDQUFBLE9BQUEsRUFBRSxXQUFXLEdBQUEsRUFBQSxDQUFBLFdBQVEsQ0FBQztBQUMzQyxZQUFBLElBQUksQ0FBQyxLQUFLO2dCQUFFLE9BQU87QUFDWixZQUFBLElBQUEsU0FBUyxHQUFvQyxPQUFPLFVBQTNDLENBQUUsQ0FBa0MsT0FBTyxDQUFBLElBQXJDLE1BQUUsT0FBTyxHQUFxQixPQUFPLENBQTVCLE9BQUEsQ0FBQSxDQUFFLGVBQWUsR0FBSSxPQUFPLGlCQUFDO0FBQzVELFlBQUEsSUFBSSxlQUFlLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEUsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFBLEVBQUEsR0FBeUIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEVBQWxELEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGFBQWEsR0FBQSxFQUFBLENBQUEsYUFBOEIsQ0FBQztZQUMxRCxJQUFJLEdBQUcsRUFBRTtBQUNQLGdCQUFBLEdBQUcsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO0FBQzVCLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLGdCQUFBLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUMxQixHQUFHLENBQUMsSUFBSSxHQUFHLE9BQUEsQ0FBQSxNQUFBLENBQVEsS0FBSyxHQUFHLENBQUMsaUJBQWMsQ0FBQztBQUUzQyxnQkFBQSxJQUFNLFFBQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDakMsZ0JBQUEsSUFBSSxRQUFNLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUV6QixnQkFBQSxJQUNFLFFBQU0sS0FBS0UsY0FBTSxDQUFDLE1BQU07QUFDeEIsb0JBQUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ3ZCLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQyxFQUNuQztBQUNBLG9CQUFBLFFBQU0sSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO2lCQUM3QjtBQUVELGdCQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFBO0FBQzFCLG9CQUFBLElBQU0sQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDO29CQUN4QyxJQUFJLFNBQVMsR0FBRyxRQUFNLENBQUM7b0JBQ3ZCLElBQUksWUFBWSxHQUFHLFFBQU0sQ0FBQztBQUMxQixvQkFBQSxJQUNFLFFBQU0sS0FBS0EsY0FBTSxDQUFDLE9BQU87d0JBQ3pCLFFBQU0sS0FBS0EsY0FBTSxDQUFDLFFBQVE7QUFDMUIsd0JBQUEsUUFBTSxLQUFLQSxjQUFNLENBQUMsR0FBRyxFQUNyQjtBQUNBLHdCQUFBLFNBQVMsSUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDO3FCQUN0QztBQUNELG9CQUFBLElBQ0UsUUFBTSxLQUFLQSxjQUFNLENBQUMsVUFBVTt3QkFDNUIsUUFBTSxLQUFLQSxjQUFNLENBQUMsV0FBVztBQUM3Qix3QkFBQSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxNQUFNLEVBQ3hCO3dCQUNBLFlBQVksSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLElBQUksQ0FBQyxDQUFDO3FCQUMvQztBQUNELG9CQUFBLElBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztvQkFDekQsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLGVBQWUsR0FBRyxLQUFLLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztvQkFDekQsSUFBSSxLQUFLLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDNUQsd0JBQUEsSUFDRSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxVQUFVOzRCQUM1QixRQUFNLEtBQUtBLGNBQU0sQ0FBQyxXQUFXO0FBQzdCLDRCQUFBLFFBQU0sS0FBS0EsY0FBTSxDQUFDLE1BQU0sRUFDeEI7NEJBQ0EsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3lCQUN4QjtBQUVELHdCQUFBLElBQ0UsUUFBTSxLQUFLQSxjQUFNLENBQUMsT0FBTzs0QkFDekIsUUFBTSxLQUFLQSxjQUFNLENBQUMsUUFBUTtBQUMxQiw0QkFBQSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxHQUFHLEVBQ3JCOzRCQUNBLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzt5QkFDeEI7cUJBQ0Y7QUFDSCxpQkFBQyxDQUFDLENBQUM7QUFFSCxnQkFBQSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFTLEVBQUUsS0FBSyxFQUFBO0FBQ2pFLG9CQUFBLElBQU0sQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDO29CQUN4QyxJQUFJLFVBQVUsR0FBRyxRQUFNLENBQUM7b0JBQ3hCLElBQUksV0FBVyxHQUFHLFFBQU0sQ0FBQztBQUN6QixvQkFBQSxJQUNFLFFBQU0sS0FBS0EsY0FBTSxDQUFDLE9BQU87d0JBQ3pCLFFBQU0sS0FBS0EsY0FBTSxDQUFDLFVBQVU7QUFDNUIsd0JBQUEsUUFBTSxLQUFLQSxjQUFNLENBQUMsSUFBSSxFQUN0QjtBQUNBLHdCQUFBLFVBQVUsSUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDO3FCQUN2QztBQUNELG9CQUFBLElBQ0UsUUFBTSxLQUFLQSxjQUFNLENBQUMsUUFBUTt3QkFDMUIsUUFBTSxLQUFLQSxjQUFNLENBQUMsV0FBVztBQUM3Qix3QkFBQSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxLQUFLLEVBQ3ZCO3dCQUNBLFdBQVcsSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLElBQUksQ0FBQyxDQUFDO3FCQUM5QztBQUNELG9CQUFBLElBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLFVBQVUsQ0FBQztvQkFDMUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLGVBQWUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztvQkFDeEQsSUFBSSxLQUFLLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDNUQsd0JBQUEsSUFDRSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxRQUFROzRCQUMxQixRQUFNLEtBQUtBLGNBQU0sQ0FBQyxXQUFXO0FBQzdCLDRCQUFBLFFBQU0sS0FBS0EsY0FBTSxDQUFDLEtBQUssRUFDdkI7QUFDQSw0QkFBQSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ25DO0FBQ0Qsd0JBQUEsSUFDRSxRQUFNLEtBQUtBLGNBQU0sQ0FBQyxPQUFPOzRCQUN6QixRQUFNLEtBQUtBLGNBQU0sQ0FBQyxVQUFVO0FBQzVCLDRCQUFBLFFBQU0sS0FBS0EsY0FBTSxDQUFDLElBQUksRUFDdEI7QUFDQSw0QkFBQSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ25DO3FCQUNGO0FBQ0gsaUJBQUMsQ0FBQyxDQUFDO2FBQ0o7QUFDSCxTQUFDLENBQUM7UUFFRixJQUFtQixDQUFBLG1CQUFBLEdBQUcsVUFBQyxNQUFvQixFQUFBO0FBQXBCLFlBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFBLEdBQVMsS0FBSSxDQUFDLE1BQU0sQ0FBQSxFQUFBO1lBQ3pDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztZQUN0QixJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLE1BQU0sRUFBRTtBQUNKLGdCQUFBLElBQUEsS0FBOEMsS0FBSSxDQUFDLE9BQU8sRUFBekQsT0FBTyxHQUFBLEVBQUEsQ0FBQSxPQUFBLEVBQUUsU0FBUyxHQUFBLEVBQUEsQ0FBQSxTQUFBLEVBQUUsZUFBZSxHQUFBLEVBQUEsQ0FBQSxlQUFBLEVBQUUsSUFBSSxVQUFnQixDQUFDO0FBQzFELGdCQUFBLElBQUEsV0FBVyxHQUFJLEtBQUksQ0FBQSxXQUFSLENBQVM7Z0JBRTNCLElBQ0UsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQztxQkFDOUQsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUNoRTtvQkFDQSxpQkFBaUIsR0FBRyxlQUFlLENBQUM7aUJBQ3JDO2dCQUNELElBQ0UsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsQ0FBQztxQkFDOUQsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUNoRTtBQUNBLG9CQUFBLGlCQUFpQixHQUFHLGVBQWUsR0FBRyxDQUFDLENBQUM7aUJBQ3pDO0FBRUQsZ0JBQUEsSUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLFNBQVMsR0FBRyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7O0FBRWpFLGdCQUFBLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFELGdCQUFBLGFBQWEsR0FBRyxPQUFPLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUNyQztZQUNELE9BQU8sRUFBQyxLQUFLLEVBQUEsS0FBQSxFQUFFLGFBQWEsZUFBQSxFQUFFLGlCQUFpQixFQUFBLGlCQUFBLEVBQUMsQ0FBQztBQUNuRCxTQUFDLENBQUM7QUFFRixRQUFBLElBQUEsQ0FBQSxVQUFVLEdBQUcsVUFBQyxHQUFjLEVBQUUsU0FBMEIsRUFBRSxLQUFZLEVBQUE7QUFBeEQsWUFBQSxJQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEdBQUEsR0FBTSxLQUFJLENBQUMsR0FBRyxDQUFBLEVBQUE7QUFBRSxZQUFBLElBQUEsU0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsU0FBQSxHQUFZLEtBQUksQ0FBQyxTQUFTLENBQUEsRUFBQTtBQUFFLFlBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFZLEdBQUEsSUFBQSxDQUFBLEVBQUE7QUFDcEUsWUFBQSxJQUFNLE1BQU0sR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDO1lBRWpDLElBQUksTUFBTSxFQUFFO0FBQ1YsZ0JBQUEsSUFBSSxLQUFLO0FBQUUsb0JBQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxnQkFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxvQkFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDNUMsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixJQUFBLEVBQUEsR0FBeUIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEVBQWxELEtBQUssR0FBQSxFQUFBLENBQUEsS0FBQSxFQUFFLGFBQWEsR0FBQSxFQUFBLENBQUEsYUFBOEIsQ0FBQztBQUMxRCx3QkFBQSxJQUFNLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNwQyx3QkFBQSxJQUFNLENBQUMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQzt3QkFDcEMsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixJQUFJLE1BQU0sU0FBQSxDQUFDO3dCQUNYLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRXBDLElBQUksR0FBRyxFQUFFOzRCQUNQLFFBQVEsS0FBSztBQUNYLGdDQUFBLEtBQUtDLGNBQU0sQ0FBQyxHQUFHLEVBQUU7QUFDZixvQ0FBQSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29DQUM3QyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ2QsTUFBTTtpQ0FDUDs2QkFDRjs0QkFDRCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUdBLGNBQU0sQ0FBQyxJQUFJLENBQUM7eUJBQy9CO3FCQUNGO2lCQUNGO0FBQ00sZ0JBQUEsSUFBQSxTQUFTLEdBQUksS0FBSSxDQUFDLE9BQU8sVUFBaEIsQ0FBaUI7QUFDakMsZ0JBQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xEO0FBQ0gsU0FBQyxDQUFDO0FBRUYsUUFBQSxJQUFBLENBQUEsVUFBVSxHQUFHLFlBQUE7O0FBQ1gsWUFBQSxJQUFNLE1BQU0sR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDO1lBQ2pDLElBQUksTUFBTSxFQUFFO2dCQUNWLEtBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3pCLGdCQUFBLElBQUksS0FBSSxDQUFDLE1BQU0sS0FBS0UsY0FBTSxDQUFDLElBQUk7b0JBQUUsT0FBTztBQUN4QyxnQkFBQSxJQUFJLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVc7b0JBQUUsT0FBTztBQUUzQyxnQkFBQSxJQUFBLE9BQU8sR0FBSSxLQUFJLENBQUMsT0FBTyxRQUFoQixDQUFpQjtnQkFDL0IsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixnQkFBQSxJQUFBLEtBQUssR0FBSSxLQUFJLENBQUMsbUJBQW1CLEVBQUUsTUFBOUIsQ0FBK0I7Z0JBQ3JDLElBQUEsRUFBQSxHQUFxQyxLQUFJLEVBQXhDLFdBQVcsR0FBQSxFQUFBLENBQUEsV0FBQSxFQUFFLE1BQU0sR0FBQSxFQUFBLENBQUEsTUFBQSxFQUFFLFdBQVcsR0FBQSxFQUFBLENBQUEsV0FBUSxDQUFDO0FBRTFDLGdCQUFBLElBQUEsRUFBQSxHQUFBSyxZQUFBLENBQWEsS0FBSSxDQUFDLGNBQWMsRUFBQSxDQUFBLENBQUEsRUFBL0IsR0FBRyxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBRSxHQUFHLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBdUIsQ0FBQztBQUN2QyxnQkFBQSxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUUsT0FBTztBQUMvRCxnQkFBQSxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUUsT0FBTztnQkFDL0QsSUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDNUMsSUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUM1QyxnQkFBQSxJQUFNLEVBQUUsR0FBRyxDQUFBLE1BQUEsQ0FBQSxFQUFBLEdBQUEsS0FBSSxDQUFDLEdBQUcsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRyxHQUFHLENBQUMsMENBQUcsR0FBRyxDQUFDLEtBQUlYLFVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBRTlDLElBQUksR0FBRyxFQUFFO29CQUNQLElBQUksR0FBRyxTQUFBLENBQUM7QUFDUixvQkFBQSxJQUFNLElBQUksR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLG9CQUFBLElBQUksTUFBTSxLQUFLTSxjQUFNLENBQUMsTUFBTSxFQUFFO0FBQzVCLHdCQUFBLEdBQUcsR0FBRyxJQUFJLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDN0Msd0JBQUEsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDekI7QUFBTSx5QkFBQSxJQUFJLE1BQU0sS0FBS0EsY0FBTSxDQUFDLE1BQU0sRUFBRTtBQUNuQyx3QkFBQSxHQUFHLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLHdCQUFBLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3pCO0FBQU0seUJBQUEsSUFBSSxNQUFNLEtBQUtBLGNBQU0sQ0FBQyxRQUFRLEVBQUU7QUFDckMsd0JBQUEsR0FBRyxHQUFHLElBQUksY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvQyx3QkFBQSxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN6QjtBQUFNLHlCQUFBLElBQUksTUFBTSxLQUFLQSxjQUFNLENBQUMsS0FBSyxFQUFFO0FBQ2xDLHdCQUFBLEdBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDNUMsd0JBQUEsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDekI7QUFBTSx5QkFBQSxJQUFJLE1BQU0sS0FBS0EsY0FBTSxDQUFDLElBQUksRUFBRTtBQUNqQyx3QkFBQSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN4RCx3QkFBQSxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN6QjtBQUFNLHlCQUFBLElBQUksRUFBRSxLQUFLTixVQUFFLENBQUMsS0FBSyxJQUFJLE1BQU0sS0FBS00sY0FBTSxDQUFDLFVBQVUsRUFBRTtBQUMxRCx3QkFBQSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUVOLFVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyx3QkFBQSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xCLHdCQUFBLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3pCO0FBQU0seUJBQUEsSUFBSSxFQUFFLEtBQUtBLFVBQUUsQ0FBQyxLQUFLLElBQUksTUFBTSxLQUFLTSxjQUFNLENBQUMsVUFBVSxFQUFFO0FBQzFELHdCQUFBLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRU4sVUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLHdCQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsd0JBQUEsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDekI7QUFBTSx5QkFBQSxJQUFJLE1BQU0sS0FBS00sY0FBTSxDQUFDLEtBQUssRUFBRTtBQUNsQyx3QkFBQSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUVOLFVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyx3QkFBQSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNuQjtBQUNELG9CQUFBLEdBQUcsYUFBSCxHQUFHLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUgsR0FBRyxDQUFFLElBQUksRUFBRSxDQUFDO2lCQUNiO2FBQ0Y7QUFDSCxTQUFDLENBQUM7QUFFRixRQUFBLElBQUEsQ0FBQSxVQUFVLEdBQUcsVUFDWCxHQUEwQixFQUMxQixNQUFvQixFQUNwQixLQUFZLEVBQUE7QUFGWixZQUFBLElBQUEsR0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBQSxHQUFrQixLQUFJLENBQUMsR0FBRyxDQUFBLEVBQUE7QUFDMUIsWUFBQSxJQUFBLE1BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE1BQUEsR0FBUyxLQUFJLENBQUMsTUFBTSxDQUFBLEVBQUE7QUFDcEIsWUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVksR0FBQSxJQUFBLENBQUEsRUFBQTtBQUVOLFlBQUEsSUFBQSxLQUFnRCxLQUFJLENBQUMsT0FBTyxFQUEzRCxhQUEyQixFQUEzQixLQUFLLEdBQUcsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBQyxhQUFLLENBQUMsYUFBYSxHQUFBLEVBQUEsRUFBRSxjQUFjLG9CQUFnQixDQUFDO0FBQ25FLFlBQUEsSUFBSSxLQUFLO2dCQUFFLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM5QixJQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLG9CQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUN0QyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsd0JBQUEsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFOzRCQUNmLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ3BDLElBQUksR0FBRyxFQUFFO2dDQUNELElBQUEsRUFBQSxHQUF5QixLQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBbEQsS0FBSyxHQUFBLEVBQUEsQ0FBQSxLQUFBLEVBQUUsYUFBYSxHQUFBLEVBQUEsQ0FBQSxhQUE4QixDQUFDO0FBQzFELGdDQUFBLElBQU0sQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3BDLGdDQUFBLElBQU0sQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dDQUVwQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7Z0NBQ25CLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLGdDQUFBLElBQ0UsS0FBSyxLQUFLQSxhQUFLLENBQUMsT0FBTztvQ0FDdkIsS0FBSyxLQUFLQSxhQUFLLENBQUMsYUFBYTtBQUM3QixvQ0FBQSxLQUFLLEtBQUtBLGFBQUssQ0FBQyxJQUFJLEVBQ3BCO0FBQ0Esb0NBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsb0NBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsb0NBQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDekIsb0NBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7aUNBQ3BCO3FDQUFNO0FBQ0wsb0NBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsb0NBQUEsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsb0NBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7aUNBQ3BCO2dDQUNELElBQUksS0FBSyxTQUFBLENBQUM7Z0NBQ1YsUUFBUSxLQUFLO29DQUNYLEtBQUtBLGFBQUssQ0FBQyxhQUFhLENBQUM7QUFDekIsb0NBQUEsS0FBS0EsYUFBSyxDQUFDLElBQUksRUFBRTtBQUNmLHdDQUFBLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3Q0FDekMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dDQUNqQyxNQUFNO3FDQUNQO29DQUNELFNBQVM7d0NBQ1AsSUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQzdDLFVBQUEsQ0FBQyxFQUFBLEVBQUksT0FBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUEsRUFBQSxDQUNmLENBQUM7d0NBQ0YsSUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQzdDLFVBQUEsQ0FBQyxFQUFBLEVBQUksT0FBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUEsRUFBQSxDQUNmLENBQUM7QUFDRix3Q0FBQSxJQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2Qix3Q0FBQSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7d0NBQzlELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztxQ0FDbEM7aUNBQ0Y7Z0NBQ0QsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dDQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs2QkFDZjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO0FBQ0gsU0FBQyxDQUFDO1FBajJDQSxJQUFJLENBQUMsT0FBTyxHQUNQc0IsY0FBQSxDQUFBQSxjQUFBLENBQUEsRUFBQSxFQUFBLElBQUksQ0FBQyxjQUFjLENBQUEsRUFDbkIsT0FBTyxDQUNYLENBQUM7QUFDRixRQUFBLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDckMsUUFBQSxJQUFJLENBQUMsSUFBSSxHQUFHdkIsVUFBRSxDQUFDLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFFBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7QUFDaEMsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHO0FBQ2pCLFlBQUEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNiLFlBQUEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNkLENBQUM7QUFFRixRQUFBLElBQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckMsUUFBQSxJQUFNLHFCQUFxQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBRXJDLFFBQUEsSUFBSSxDQUFDLGdCQUFnQixJQUFBLEVBQUEsR0FBQSxFQUFBO1lBQ25CLEVBQUMsQ0FBQUssY0FBTSxDQUFDLFlBQVksQ0FBRyxHQUFBO0FBQ3JCLGdCQUFBLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQjtBQUNyQyxnQkFBQSxRQUFRLEVBQUUsRUFBRTtBQUNiLGFBQUE7WUFDRCxFQUFDLENBQUFBLGNBQU0sQ0FBQyxZQUFZLENBQUcsR0FBQTtBQUNyQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsV0FBVyxDQUFHLEdBQUE7QUFDcEIsZ0JBQUEsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCO0FBQ3BDLGdCQUFBLFFBQVEsRUFBRSxFQUFFO0FBQ2IsYUFBQTtZQUNELEVBQUMsQ0FBQUEsY0FBTSxDQUFDLFdBQVcsQ0FBRyxHQUFBO0FBQ3BCLGdCQUFBLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtBQUNwQyxnQkFBQSxRQUFRLEVBQUUsRUFBRTtBQUNiLGFBQUE7WUFDRCxFQUFDLENBQUFBLGNBQU0sQ0FBQyxXQUFXLENBQUcsR0FBQTtBQUNwQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsa0JBQWtCLENBQUcsR0FBQTtBQUMzQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsaUJBQWlCLENBQUcsR0FBQTtBQUMxQixnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLEVBQUU7QUFDYixhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtBQUNqQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtBQUNqQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtBQUNqQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsd0JBQXdCLENBQUcsR0FBQTtBQUNqQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7QUFDckMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO1lBQ0QsRUFBQyxDQUFBQSxjQUFNLENBQUMsdUJBQXVCLENBQUcsR0FBQTtBQUNoQyxnQkFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDcEMsZ0JBQUEsUUFBUSxFQUFFLHFCQUFxQjtBQUNoQyxhQUFBO2VBQ0YsQ0FBQztLQUNIO0lBRUQsUUFBTyxDQUFBLFNBQUEsQ0FBQSxPQUFBLEdBQVAsVUFBUSxJQUFRLEVBQUE7QUFDZCxRQUFBLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCLENBQUE7SUFFRCxRQUFZLENBQUEsU0FBQSxDQUFBLFlBQUEsR0FBWixVQUFhLElBQVksRUFBQTtBQUN2QixRQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQ3pELENBQUE7QUFFRCxJQUFBLFFBQUEsQ0FBQSxTQUFBLENBQUEsTUFBTSxHQUFOLFlBQUE7UUFDRSxJQUNFLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDWixDQUFDLElBQUksQ0FBQyxZQUFZO1lBQ2xCLENBQUMsSUFBSSxDQUFDLEdBQUc7WUFDVCxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ1gsQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUNsQixDQUFDLElBQUksQ0FBQyxjQUFjO1lBQ3BCLENBQUMsSUFBSSxDQUFDLFlBQVk7WUFFbEIsT0FBTztBQUVULFFBQUEsSUFBTSxRQUFRLEdBQUc7QUFDZixZQUFBLElBQUksQ0FBQyxLQUFLO0FBQ1YsWUFBQSxJQUFJLENBQUMsTUFBTTtBQUNYLFlBQUEsSUFBSSxDQUFDLFlBQVk7QUFDakIsWUFBQSxJQUFJLENBQUMsWUFBWTtBQUNqQixZQUFBLElBQUksQ0FBQyxjQUFjO0FBQ25CLFlBQUEsSUFBSSxDQUFDLFlBQVk7U0FDbEIsQ0FBQztBQUVLLFFBQUEsSUFBQSxJQUFJLEdBQUksSUFBSSxDQUFDLE9BQU8sS0FBaEIsQ0FBaUI7QUFDckIsUUFBQSxJQUFBLFdBQVcsR0FBSSxJQUFJLENBQUMsR0FBRyxZQUFaLENBQWE7QUFFL0IsUUFBQSxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxFQUFBO1lBQ3JCLElBQUksSUFBSSxFQUFFO0FBQ1IsZ0JBQUEsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQzFCLGdCQUFBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQzthQUM1QjtpQkFBTTtnQkFDTCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN6QyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQy9DO0FBQ0gsU0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZixDQUFBO0FBQ08sSUFBQSxRQUFBLENBQUEsU0FBQSxDQUFBLFlBQVksR0FBcEIsVUFBcUIsRUFBVSxFQUFFLGFBQW9CLEVBQUE7QUFBcEIsUUFBQSxJQUFBLGFBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLGFBQW9CLEdBQUEsSUFBQSxDQUFBLEVBQUE7UUFDbkQsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoRCxRQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUNuQyxRQUFBLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUNsQixZQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztTQUNyQztBQUNELFFBQUEsT0FBTyxNQUFNLENBQUM7S0FDZixDQUFBO0lBRUQsUUFBSSxDQUFBLFNBQUEsQ0FBQSxJQUFBLEdBQUosVUFBSyxHQUFnQixFQUFBO1FBQXJCLElBOEJDLEtBQUEsR0FBQSxJQUFBLENBQUE7QUE3QkMsUUFBQSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFFaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFFaEUsUUFBQSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixRQUFBLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFFBQUEsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkMsUUFBQSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyQyxRQUFBLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25DLFFBQUEsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFFekIsUUFBQSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtBQUNqQyxZQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBQTtnQkFDaEMsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2hCLGFBQUMsQ0FBQyxDQUFDO1NBQ0o7S0FDRixDQUFBO0lBRUQsUUFBVSxDQUFBLFNBQUEsQ0FBQSxVQUFBLEdBQVYsVUFBVyxPQUE4QixFQUFBO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQU9rQixjQUFBLENBQUFBLGNBQUEsQ0FBQSxFQUFBLEVBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQSxFQUFLLE9BQU8sQ0FBQyxDQUFDOztRQUU3QyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZixDQUFBO0lBRUQsUUFBTSxDQUFBLFNBQUEsQ0FBQSxNQUFBLEdBQU4sVUFBTyxHQUFlLEVBQUE7QUFDcEIsUUFBQSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDeEIsWUFBQSxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztTQUMzQjtLQUNGLENBQUE7SUFFRCxRQUFpQixDQUFBLFNBQUEsQ0FBQSxpQkFBQSxHQUFqQixVQUFrQixHQUFlLEVBQUE7QUFDL0IsUUFBQSxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztLQUMzQixDQUFBO0lBRUQsUUFBaUIsQ0FBQSxTQUFBLENBQUEsaUJBQUEsR0FBakIsVUFBa0IsR0FBZSxFQUFBO0FBQy9CLFFBQUEsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7S0FDM0IsQ0FBQTtJQUVELFFBQVksQ0FBQSxTQUFBLENBQUEsWUFBQSxHQUFaLFVBQWEsR0FBZSxFQUFBO0FBQzFCLFFBQUEsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7S0FDdEIsQ0FBQTtJQUVELFFBQVMsQ0FBQSxTQUFBLENBQUEsU0FBQSxHQUFULFVBQVUsTUFBa0IsRUFBQTtBQUMxQixRQUFBLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3RCLENBQUE7QUFFRCxJQUFBLFFBQUEsQ0FBQSxTQUFBLENBQUEsU0FBUyxHQUFULFVBQVUsTUFBYyxFQUFFLEtBQVUsRUFBQTtBQUFWLFFBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFVLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFDbEMsUUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFBLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0tBQzFCLENBQUE7QUEwRkQsSUFBQSxRQUFBLENBQUEsU0FBQSxDQUFBLGlCQUFpQixHQUFqQixZQUFBO0FBQ0UsUUFBQSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ2pDLFFBQUEsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPO1FBRXBCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXhELFFBQUEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM1QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN2RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN0RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN2RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN0RDtRQUVELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0tBQzFCLENBQUE7SUFFRCxRQUFXLENBQUEsU0FBQSxDQUFBLFdBQUEsR0FBWCxVQUFZLFFBQXlCLEVBQUE7QUFDbkMsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDM0IsT0FBTztTQUNSO0FBQ0QsUUFBQSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWTtBQUFFLFlBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM1RCxDQUFBO0FBRUQsSUFBQSxRQUFBLENBQUEsU0FBQSxDQUFBLFFBQVEsR0FBUixVQUFTLEtBQVksRUFBRSxPQUFZLEVBQUE7UUFBbkMsSUFnQkMsS0FBQSxHQUFBLElBQUEsQ0FBQTtBQWhCc0IsUUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQVksR0FBQSxFQUFBLENBQUEsRUFBQTtBQUMxQixRQUFBLElBQUEsY0FBYyxHQUFJLElBQUksQ0FBQyxPQUFPLGVBQWhCLENBQWlCO0FBQ3RDLFFBQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPO0FBQzdCLFFBQUEsSUFBQSxFQUEwQixHQUFBLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBOUMsS0FBSyxHQUFBLEVBQUEsQ0FBQSxLQUFBLEVBQUUsTUFBTSxHQUFBLEVBQUEsQ0FBQSxNQUFBLEVBQUUsTUFBTSxZQUF5QixDQUFDO0FBQ3RELFFBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzNCLFFBQUEsSUFBSSxDQUFDLE9BQU8sR0FDUEEsY0FBQSxDQUFBQSxjQUFBLENBQUFBLGNBQUEsQ0FBQSxFQUFBLEVBQUEsSUFBSSxDQUFDLE9BQU8sQ0FDZixFQUFBLEVBQUEsS0FBSyxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQ0YsT0FBTyxDQUNYLENBQUM7UUFDRixPQUFPLENBQUNULGNBQU8sQ0FBRUosbUJBQUEsQ0FBQUEsbUJBQUEsQ0FBQSxDQUFBLEtBQUssZ0JBQUssTUFBTSxDQUFBLEVBQUEsS0FBQSxDQUFBLEVBQUFDLFlBQUEsQ0FBSyxNQUFNLENBQUEsRUFBQSxLQUFBLENBQUEsQ0FBRSxFQUFFLFlBQUE7WUFDOUMsS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQixTQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZixDQUFBO0lBNEJELFFBQWtCLENBQUEsU0FBQSxDQUFBLGtCQUFBLEdBQWxCLFVBQW1CLGVBQXVCLEVBQUE7QUFDakMsUUFBQSxJQUFBLFVBQVUsR0FBSSxJQUFJLENBQUMsT0FBTyxXQUFoQixDQUFpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQjNCLFFBQUEsSUFBQSxNQUFNLEdBQUksSUFBSSxDQUFBLE1BQVIsQ0FBUztBQUN0QixRQUFBLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTztBQUNwQixRQUFBLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RCxRQUFBLElBQU0sd0JBQXdCLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRTFFLFFBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQzs7S0FFeEUsQ0FBQTtJQUVELFFBQVMsQ0FBQSxTQUFBLENBQUEsU0FBQSxHQUFULFVBQVUsSUFBWSxFQUFBO0FBQVosUUFBQSxJQUFBLElBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLElBQVksR0FBQSxLQUFBLENBQUEsRUFBQTtRQUNkLElBQUEsRUFBQSxHQU9GLElBQUksRUFOTixNQUFNLFlBQUEsRUFDTixjQUFjLG9CQUFBLEVBQ2QsS0FBSyxXQUFBLEVBQ0wsWUFBWSxrQkFBQSxFQUNaLFlBQVksa0JBQUEsRUFDWixZQUFZLGtCQUNOLENBQUM7QUFDVCxRQUFBLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTztBQUNkLFFBQUEsSUFBQSxLQUNKLElBQUksQ0FBQyxPQUFPLEVBRFAsU0FBUyxlQUFBLEVBQUUsTUFBTSxZQUFBLEVBQUUsZUFBZSxxQkFBQSxFQUFFLE9BQU8sYUFBQSxFQUFFLGNBQWMsb0JBQ3BELENBQUM7QUFDZixRQUFBLElBQU0saUJBQWlCLEdBQUcsZUFBZSxDQUN2QyxJQUFJLENBQUMsY0FBYyxFQUNuQixNQUFNLEVBQ04sS0FBSyxDQUNOLENBQUM7QUFDRixRQUFBLElBQU0sR0FBRyxHQUFHLE1BQU0sS0FBQSxJQUFBLElBQU4sTUFBTSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFOLE1BQU0sQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsUUFBQSxJQUFNLFFBQVEsR0FBRyxLQUFLLEtBQUEsSUFBQSxJQUFMLEtBQUssS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBTCxLQUFLLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFFBQUEsSUFBTSxTQUFTLEdBQUcsWUFBWSxLQUFBLElBQUEsSUFBWixZQUFZLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVosWUFBWSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxRQUFBLElBQU0sU0FBUyxHQUFHLFlBQVksS0FBQSxJQUFBLElBQVosWUFBWSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFaLFlBQVksQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsUUFBQSxJQUFNLFdBQVcsR0FBRyxjQUFjLEtBQUEsSUFBQSxJQUFkLGNBQWMsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBZCxjQUFjLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JELFFBQUEsSUFBTSxTQUFTLEdBQUcsWUFBWSxLQUFBLElBQUEsSUFBWixZQUFZLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVosWUFBWSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFNLFdBQVcsR0FBRyxJQUFJO0FBQ3RCLGNBQUUsaUJBQWlCO0FBQ25CLGNBQUU7QUFDRSxnQkFBQSxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFBLENBQUMsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLENBQUM7YUFDbkIsQ0FBQztBQUVOLFFBQUEsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDL0IsUUFBQSxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUM5QixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNyQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN0QyxDQUFDO1FBRUYsSUFBSSxjQUFjLEVBQUU7QUFDbEIsWUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUM7U0FDaEQ7UUFFRCxJQUFJLElBQUksRUFBRTtBQUNELFlBQUEsSUFBQSxLQUFLLEdBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLE1BQTlCLENBQStCO0FBQzNDLFlBQUEsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRWpDLElBQUksY0FBYyxFQUFFO0FBQ2xCLGdCQUFBLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUMxQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDO2FBQ2hEO0FBRUQsWUFBQSxJQUFJLGdCQUFnQixHQUFHLGVBQWUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRS9DLFlBQUEsSUFDRSxNQUFNLEtBQUtSLGNBQU0sQ0FBQyxRQUFRO2dCQUMxQixNQUFNLEtBQUtBLGNBQU0sQ0FBQyxPQUFPO2dCQUN6QixNQUFNLEtBQUtBLGNBQU0sQ0FBQyxXQUFXO0FBQzdCLGdCQUFBLE1BQU0sS0FBS0EsY0FBTSxDQUFDLFVBQVUsRUFDNUI7QUFDQSxnQkFBQSxnQkFBZ0IsR0FBRyxlQUFlLEdBQUcsR0FBRyxDQUFDO2FBQzFDO0FBQ0QsWUFBQSxJQUFJLGVBQWUsR0FBRyxlQUFlLEdBQUcsZ0JBQWdCLENBQUM7QUFFekQsWUFBQSxJQUFJLGVBQWUsR0FBRyxTQUFTLEVBQUU7QUFDL0IsZ0JBQUEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE9BQU8sR0FBRyxDQUFDLEtBQUssZUFBZSxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBRXJFLGdCQUFBLElBQUksT0FBTyxHQUNULFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSzs7QUFFakMsb0JBQUEsT0FBTyxHQUFHLEtBQUs7b0JBQ2YsT0FBTzs7QUFFUCxvQkFBQSxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsR0FBRyxLQUFLLElBQUksQ0FBQztBQUN0QyxvQkFBQSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBRXRCLGdCQUFBLElBQUksT0FBTyxHQUNULFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSzs7QUFFakMsb0JBQUEsT0FBTyxHQUFHLEtBQUs7b0JBQ2YsT0FBTzs7QUFFUCxvQkFBQSxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsR0FBRyxLQUFLLElBQUksQ0FBQztBQUN0QyxvQkFBQSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBRXRCLGdCQUFBLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLEtBQUEsSUFBQSxJQUFILEdBQUcsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBSCxHQUFHLENBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakMsUUFBUSxLQUFBLElBQUEsSUFBUixRQUFRLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVIsUUFBUSxDQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RDLFdBQVcsS0FBQSxJQUFBLElBQVgsV0FBVyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFYLFdBQVcsQ0FBRSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QyxTQUFTLEtBQUEsSUFBQSxJQUFULFNBQVMsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBVCxTQUFTLENBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkMsU0FBUyxLQUFBLElBQUEsSUFBVCxTQUFTLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVQsU0FBUyxDQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZDLFNBQVMsS0FBQSxJQUFBLElBQVQsU0FBUyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFULFNBQVMsQ0FBRSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3hDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN2QjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdkI7S0FDRixDQUFBO0lBRUQsUUFBb0IsQ0FBQSxTQUFBLENBQUEsb0JBQUEsR0FBcEIsVUFBcUIsSUFBWSxFQUFBO1FBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQyxDQUFBO0FBRUQsSUFBQSxRQUFBLENBQUEsU0FBQSxDQUFBLGNBQWMsR0FBZCxZQUFBO1FBQ1EsSUFBQSxFQUFBLEdBT0YsSUFBSSxFQU5OLE1BQU0sWUFBQSxFQUNOLGNBQWMsb0JBQUEsRUFDZCxLQUFLLFdBQUEsRUFDTCxZQUFZLGtCQUFBLEVBQ1osWUFBWSxrQkFBQSxFQUNaLFlBQVksa0JBQ04sQ0FBQztBQUNULFFBQUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFBLElBQUEsSUFBTixNQUFNLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQU4sTUFBTSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxRQUFBLElBQU0sUUFBUSxHQUFHLEtBQUssS0FBQSxJQUFBLElBQUwsS0FBSyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFMLEtBQUssQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsUUFBQSxJQUFNLFNBQVMsR0FBRyxZQUFZLEtBQUEsSUFBQSxJQUFaLFlBQVksS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBWixZQUFZLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFFBQUEsSUFBTSxTQUFTLEdBQUcsWUFBWSxLQUFBLElBQUEsSUFBWixZQUFZLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVosWUFBWSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxRQUFBLElBQU0sV0FBVyxHQUFHLGNBQWMsS0FBQSxJQUFBLElBQWQsY0FBYyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFkLGNBQWMsQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsUUFBQSxJQUFNLFNBQVMsR0FBRyxZQUFZLEtBQUEsSUFBQSxJQUFaLFlBQVksS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBWixZQUFZLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQ2hDLFFBQUEsR0FBRyxhQUFILEdBQUcsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBSCxHQUFHLENBQUUsY0FBYyxFQUFFLENBQUM7QUFDdEIsUUFBQSxRQUFRLGFBQVIsUUFBUSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFSLFFBQVEsQ0FBRSxjQUFjLEVBQUUsQ0FBQztBQUMzQixRQUFBLFdBQVcsYUFBWCxXQUFXLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVgsV0FBVyxDQUFFLGNBQWMsRUFBRSxDQUFDO0FBQzlCLFFBQUEsU0FBUyxhQUFULFNBQVMsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBVCxTQUFTLENBQUUsY0FBYyxFQUFFLENBQUM7QUFDNUIsUUFBQSxTQUFTLGFBQVQsU0FBUyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFULFNBQVMsQ0FBRSxjQUFjLEVBQUUsQ0FBQztBQUM1QixRQUFBLFNBQVMsYUFBVCxTQUFTLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQVQsU0FBUyxDQUFFLGNBQWMsRUFBRSxDQUFDO0tBQzdCLENBQUE7QUFFRCxJQUFBLFFBQUEsQ0FBQSxTQUFBLENBQUEsTUFBTSxHQUFOLFlBQUE7QUFDUyxRQUFBLElBQUEsR0FBRyxHQUFJLElBQUksQ0FBQSxHQUFSLENBQVM7QUFDbkIsUUFBQSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7O1FBRy9ELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixRQUFBLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZO1lBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3BELENBQUE7SUFFRCxRQUFpQixDQUFBLFNBQUEsQ0FBQSxpQkFBQSxHQUFqQixVQUFrQixNQUFvQixFQUFBO0FBQXBCLFFBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQSxFQUFBO1FBQ3BDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN0QixRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekMsUUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDdkQsQ0FBQTtJQWd3QkgsT0FBQyxRQUFBLENBQUE7QUFBRCxDQUFDLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
