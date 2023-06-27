
  /**
   * @license
   * author: BAI TIANLIANG
   * ghostban.js v3.0.0-alpha.29
   * Released under the MIT license.
   */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var TreeModel = require('tree-model');
var lodash = require('lodash');
var matchAll = require('string.prototype.matchall');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var TreeModel__default = /*#__PURE__*/_interopDefaultLegacy(TreeModel);
var matchAll__default = /*#__PURE__*/_interopDefaultLegacy(matchAll);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire (path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice$1(array, start, end) {
  var index = -1,
    length = array.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}
var _baseSlice = baseSlice$1;

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$1(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_1 = eq$1;

var freeGlobal$1 = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;

var freeGlobal = _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();
var _root = root$1;

var root = _root;

/** Built-in value references. */
var _Symbol2 = root.Symbol;
var _Symbol$2 = _Symbol2;

var _Symbol$1 = _Symbol$2;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol$1 ? _Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
    tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var _getRawTag = getRawTag$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}
var _objectToString = objectToString$1;

var _Symbol = _Symbol$2,
  getRawTag = _getRawTag,
  objectToString = _objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
  undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$2(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
var _baseGetTag = baseGetTag$2;

function isObject$3(value) {
  var type = _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}
var isObject_1 = isObject$3;

var baseGetTag$1 = _baseGetTag,
  isObject$2 = isObject_1;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
  funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  if (!isObject$2(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag$1(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_1 = isFunction$1;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$1(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}
var isLength_1 = isLength$1;

var isFunction = isFunction_1,
  isLength = isLength_1;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$1(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
var isArrayLike_1 = isArrayLike$1;

var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$1(value, length) {
  var type = _typeof(value);
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
var _isIndex = isIndex$1;

var eq = eq_1,
  isArrayLike = isArrayLike_1,
  isIndex = _isIndex,
  isObject$1 = isObject_1;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall$1(value, index, object) {
  if (!isObject$1(object)) {
    return false;
  }
  var type = _typeof(index);
  if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
    return eq(object[index], value);
  }
  return false;
}
var _isIterateeCall = isIterateeCall$1;

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex$1(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}
var _trimmedEndIndex = trimmedEndIndex$1;

var trimmedEndIndex = _trimmedEndIndex;

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim$1(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
}
var _baseTrim = baseTrim$1;

function isObjectLike$1(value) {
  return value != null && _typeof(value) == 'object';
}
var isObjectLike_1 = isObjectLike$1;

var baseGetTag = _baseGetTag,
  isObjectLike = isObjectLike_1;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
  return _typeof(value) == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var isSymbol_1 = isSymbol$1;

var baseTrim = _baseTrim,
  isObject = isObject_1,
  isSymbol = isSymbol_1;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var toNumber_1 = toNumber$1;

var toNumber = toNumber_1;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
  MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite$1(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
var toFinite_1 = toFinite$1;

var toFinite = toFinite_1;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger$1(value) {
  var result = toFinite(value),
    remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
var toInteger_1 = toInteger$1;

var baseSlice = _baseSlice,
  isIterateeCall = _isIterateeCall,
  toInteger = toInteger_1;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
  nativeMax = Math.max;

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  if (guard ? isIterateeCall(array, size, guard) : size === undefined) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }
  var length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  var index = 0,
    resIndex = 0,
    result = Array(nativeCeil(length / size));
  while (index < length) {
    result[resIndex++] = baseSlice(array, index, index += size);
  }
  return result;
}
var chunk_1 = chunk;

exports.Ki = void 0;
(function (Ki) {
    Ki[Ki["Black"] = 1] = "Black";
    Ki[Ki["White"] = -1] = "White";
    Ki[Ki["Empty"] = 0] = "Empty";
})(exports.Ki || (exports.Ki = {}));
exports.Theme = void 0;
(function (Theme) {
    Theme["BlackAndWhite"] = "black-and-white";
    Theme["Flat"] = "flat";
    Theme["Subdued"] = "subdued";
    Theme["ShellStone"] = "shell";
    Theme["SlateAndShell"] = "slate-and-shell";
    Theme["Walnut"] = "walnut";
    Theme["Photorealistic"] = "photorealistic";
})(exports.Theme || (exports.Theme = {}));
exports.Center = void 0;
(function (Center) {
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
    Markup["Square"] = "sq";
    Markup["Triangle"] = "tri";
    Markup["Cross"] = "cr";
    Markup["Number"] = "num";
    Markup["Letter"] = "le";
    Markup["None"] = "";
})(exports.Markup || (exports.Markup = {}));
exports.ProblemAnswerType = void 0;
(function (ProblemAnswerType) {
    ProblemAnswerType["Right"] = "1";
    ProblemAnswerType["Wrong"] = "2";
    ProblemAnswerType["Variant"] = "3";
})(exports.ProblemAnswerType || (exports.ProblemAnswerType = {}));

var _a;
var settings = { cdn: 'https://s.shaowq.com' };
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
var BLANK_ARRAY = chunk_1(new Array(361).fill(0), 19);
var GRID$1 = 19;
var DOT_SIZE = 3;
var EXPAND_H = 5;
var EXPAND_V = 5;
var RESPONSE_TIME = 100;
var DEFAULT_OPTIONS = {
    boardSize: 19,
    padding: 15,
    extend: 2,
    interactive: true,
    coordinate: true,
    theme: exports.Theme.Flat,
    background: false,
    zoom: true,
};
var RESOURCES = (_a = {},
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
var LIST_OF_POINTS_PROP = ['AB', 'AE', 'AW'];
var TOKEN_REGEX = new RegExp(/([A-Z]*)\[([\s\S]*?)\]/);
var SgfPropBase = /** @class */ (function () {
    function SgfPropBase(token, value, values) {
        this.token = token;
        this.value = value;
        this.values = values || [value];
        this.type = '-';
    }
    SgfPropBase.prototype.toString = function () {
        return "".concat(this.token).concat(this.values.map(function (v) { return "[".concat(v, "]"); }).join(''));
    };
    return SgfPropBase;
}());
var MoveProp = /** @class */ (function (_super) {
    tslib.__extends(MoveProp, _super);
    function MoveProp(token, value, values) {
        var _this = _super.call(this, token, value, values) || this;
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
    return MoveProp;
}(SgfPropBase));
var SetupProp = /** @class */ (function (_super) {
    tslib.__extends(SetupProp, _super);
    function SetupProp(token, value, values) {
        var _this = _super.call(this, token, value, values) || this;
        _this.type = 'setup';
        return _this;
    }
    SetupProp.from = function (str) {
        var tokenMatch = str.match(TOKEN_REGEX);
        var valMatches = matchAll__default["default"](str, /\[([\s\S]*?)\]/g);
        var token = '';
        var vals = tslib.__spreadArray([], tslib.__read(valMatches), false).map(function (m) { return m[1]; });
        if (tokenMatch)
            token = tokenMatch[1];
        return new SetupProp(token, vals.join(','), vals);
    };
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
        var match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
        if (match) {
            var token = match[1];
            var val = match[2];
            return new MarkupProp(token, val);
        }
        return new MarkupProp('', '');
    };
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
    return CustomProp;
}(SgfPropBase));
var TimingProp = /** @class */ (function (_super) {
    tslib.__extends(TimingProp, _super);
    function TimingProp(token, value) {
        var _this = _super.call(this, token, value) || this;
        _this.type = 'Timing';
        return _this;
    }
    return TimingProp;
}(SgfPropBase));
var MiscellaneousProp = /** @class */ (function (_super) {
    tslib.__extends(MiscellaneousProp, _super);
    function MiscellaneousProp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MiscellaneousProp;
}(SgfPropBase));

var sha256$1 = {exports: {}};

var core = {exports: {}};

(function (module, exports) {
  (function (root, factory) {
    {
      // CommonJS
      module.exports = factory();
    }
  })(commonjsGlobal, function () {
    /*globals window, global, require*/

    /**
     * CryptoJS core components.
     */
    var CryptoJS = CryptoJS || function (Math, undefined$1) {
      var crypto;

      // Native crypto from window (Browser)
      if (typeof window !== 'undefined' && window.crypto) {
        crypto = window.crypto;
      }

      // Native crypto in web worker (Browser)
      if (typeof self !== 'undefined' && self.crypto) {
        crypto = self.crypto;
      }

      // Native crypto from worker
      if (typeof globalThis !== 'undefined' && globalThis.crypto) {
        crypto = globalThis.crypto;
      }

      // Native (experimental IE 11) crypto from window (Browser)
      if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
        crypto = window.msCrypto;
      }

      // Native crypto from global (NodeJS)
      if (!crypto && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
        crypto = commonjsGlobal.crypto;
      }

      // Native crypto import via require (NodeJS)
      if (!crypto && typeof commonjsRequire === 'function') {
        try {
          crypto = require('crypto');
        } catch (err) {}
      }

      /*
       * Cryptographically secure pseudorandom number generator
       *
       * As Math.random() is cryptographically not safe to use
       */
      var cryptoSecureRandomInt = function cryptoSecureRandomInt() {
        if (crypto) {
          // Use getRandomValues method (Browser)
          if (typeof crypto.getRandomValues === 'function') {
            try {
              return crypto.getRandomValues(new Uint32Array(1))[0];
            } catch (err) {}
          }

          // Use randomBytes method (NodeJS)
          if (typeof crypto.randomBytes === 'function') {
            try {
              return crypto.randomBytes(4).readInt32LE();
            } catch (err) {}
          }
        }
        throw new Error('Native crypto module could not be used to get secure random number.');
      };

      /*
       * Local polyfill of Object.create
        */
      var create = Object.create || function () {
        function F() {}
        return function (obj) {
          var subtype;
          F.prototype = obj;
          subtype = new F();
          F.prototype = null;
          return subtype;
        };
      }();

      /**
       * CryptoJS namespace.
       */
      var C = {};

      /**
       * Library namespace.
       */
      var C_lib = C.lib = {};

      /**
       * Base object for prototypal inheritance.
       */
      var Base = C_lib.Base = function () {
        return {
          /**
           * Creates a new object that inherits from this object.
           *
           * @param {Object} overrides Properties to copy into the new object.
           *
           * @return {Object} The new object.
           *
           * @static
           *
           * @example
           *
           *     var MyType = CryptoJS.lib.Base.extend({
           *         field: 'value',
           *
           *         method: function () {
           *         }
           *     });
           */
          extend: function extend(overrides) {
            // Spawn
            var subtype = create(this);

            // Augment
            if (overrides) {
              subtype.mixIn(overrides);
            }

            // Create default initializer
            if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
              subtype.init = function () {
                subtype.$super.init.apply(this, arguments);
              };
            }

            // Initializer's prototype is the subtype object
            subtype.init.prototype = subtype;

            // Reference supertype
            subtype.$super = this;
            return subtype;
          },
          /**
           * Extends this object and runs the init method.
           * Arguments to create() will be passed to init().
           *
           * @return {Object} The new object.
           *
           * @static
           *
           * @example
           *
           *     var instance = MyType.create();
           */
          create: function create() {
            var instance = this.extend();
            instance.init.apply(instance, arguments);
            return instance;
          },
          /**
           * Initializes a newly created object.
           * Override this method to add some logic when your objects are created.
           *
           * @example
           *
           *     var MyType = CryptoJS.lib.Base.extend({
           *         init: function () {
           *             // ...
           *         }
           *     });
           */
          init: function init() {},
          /**
           * Copies properties into this object.
           *
           * @param {Object} properties The properties to mix in.
           *
           * @example
           *
           *     MyType.mixIn({
           *         field: 'value'
           *     });
           */
          mixIn: function mixIn(properties) {
            for (var propertyName in properties) {
              if (properties.hasOwnProperty(propertyName)) {
                this[propertyName] = properties[propertyName];
              }
            }

            // IE won't copy toString using the loop above
            if (properties.hasOwnProperty('toString')) {
              this.toString = properties.toString;
            }
          },
          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = instance.clone();
           */
          clone: function clone() {
            return this.init.prototype.extend(this);
          }
        };
      }();

      /**
       * An array of 32-bit words.
       *
       * @property {Array} words The array of 32-bit words.
       * @property {number} sigBytes The number of significant bytes in this word array.
       */
      var WordArray = C_lib.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function init(words, sigBytes) {
          words = this.words = words || [];
          if (sigBytes != undefined$1) {
            this.sigBytes = sigBytes;
          } else {
            this.sigBytes = words.length * 4;
          }
        },
        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
         */
        toString: function toString(encoder) {
          return (encoder || Hex).stringify(this);
        },
        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function concat(wordArray) {
          // Shortcuts
          var thisWords = this.words;
          var thatWords = wordArray.words;
          var thisSigBytes = this.sigBytes;
          var thatSigBytes = wordArray.sigBytes;

          // Clamp excess bits
          this.clamp();

          // Concat
          if (thisSigBytes % 4) {
            // Copy one byte at a time
            for (var i = 0; i < thatSigBytes; i++) {
              var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
              thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
            }
          } else {
            // Copy one word at a time
            for (var j = 0; j < thatSigBytes; j += 4) {
              thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
            }
          }
          this.sigBytes += thatSigBytes;

          // Chainable
          return this;
        },
        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function clamp() {
          // Shortcuts
          var words = this.words;
          var sigBytes = this.sigBytes;

          // Clamp
          words[sigBytes >>> 2] &= 0xffffffff << 32 - sigBytes % 4 * 8;
          words.length = Math.ceil(sigBytes / 4);
        },
        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function clone() {
          var clone = Base.clone.call(this);
          clone.words = this.words.slice(0);
          return clone;
        },
        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.random(16);
         */
        random: function random(nBytes) {
          var words = [];
          for (var i = 0; i < nBytes; i += 4) {
            words.push(cryptoSecureRandomInt());
          }
          return new WordArray.init(words, nBytes);
        }
      });

      /**
       * Encoder namespace.
       */
      var C_enc = C.enc = {};

      /**
       * Hex encoding strategy.
       */
      var Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function stringify(wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;

          // Convert
          var hexChars = [];
          for (var i = 0; i < sigBytes; i++) {
            var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
            hexChars.push((bite >>> 4).toString(16));
            hexChars.push((bite & 0x0f).toString(16));
          }
          return hexChars.join('');
        },
        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
         */
        parse: function parse(hexStr) {
          // Shortcut
          var hexStrLength = hexStr.length;

          // Convert
          var words = [];
          for (var i = 0; i < hexStrLength; i += 2) {
            words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
          }
          return new WordArray.init(words, hexStrLength / 2);
        }
      };

      /**
       * Latin1 encoding strategy.
       */
      var Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function stringify(wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;

          // Convert
          var latin1Chars = [];
          for (var i = 0; i < sigBytes; i++) {
            var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
            latin1Chars.push(String.fromCharCode(bite));
          }
          return latin1Chars.join('');
        },
        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
         */
        parse: function parse(latin1Str) {
          // Shortcut
          var latin1StrLength = latin1Str.length;

          // Convert
          var words = [];
          for (var i = 0; i < latin1StrLength; i++) {
            words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
          }
          return new WordArray.init(words, latin1StrLength);
        }
      };

      /**
       * UTF-8 encoding strategy.
       */
      var Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function stringify(wordArray) {
          try {
            return decodeURIComponent(escape(Latin1.stringify(wordArray)));
          } catch (e) {
            throw new Error('Malformed UTF-8 data');
          }
        },
        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
         */
        parse: function parse(utf8Str) {
          return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
      };

      /**
       * Abstract buffered block algorithm template.
       *
       * The property blockSize must be implemented in a concrete subtype.
       *
       * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
       */
      var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function reset() {
          // Initial values
          this._data = new WordArray.init();
          this._nDataBytes = 0;
        },
        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function _append(data) {
          // Convert string to WordArray, else assume WordArray already
          if (typeof data == 'string') {
            data = Utf8.parse(data);
          }

          // Append
          this._data.concat(data);
          this._nDataBytes += data.sigBytes;
        },
        /**
         * Processes available data blocks.
         *
         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The processed data.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function _process(doFlush) {
          var processedWords;

          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          var dataSigBytes = data.sigBytes;
          var blockSize = this.blockSize;
          var blockSizeBytes = blockSize * 4;

          // Count blocks ready
          var nBlocksReady = dataSigBytes / blockSizeBytes;
          if (doFlush) {
            // Round up to include partial blocks
            nBlocksReady = Math.ceil(nBlocksReady);
          } else {
            // Round down to include only full blocks,
            // less the number of blocks that must remain in the buffer
            nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
          }

          // Count words ready
          var nWordsReady = nBlocksReady * blockSize;

          // Count bytes ready
          var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

          // Process blocks
          if (nWordsReady) {
            for (var offset = 0; offset < nWordsReady; offset += blockSize) {
              // Perform concrete-algorithm logic
              this._doProcessBlock(dataWords, offset);
            }

            // Remove processed words
            processedWords = dataWords.splice(0, nWordsReady);
            data.sigBytes -= nBytesReady;
          }

          // Return processed words
          return new WordArray.init(processedWords, nBytesReady);
        },
        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function clone() {
          var clone = Base.clone.call(this);
          clone._data = this._data.clone();
          return clone;
        },
        _minBufferSize: 0
      });

      /**
       * Abstract hasher template.
       *
       * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
       */
      C_lib.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        cfg: Base.extend(),
        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function init(cfg) {
          // Apply config defaults
          this.cfg = this.cfg.extend(cfg);

          // Set initial values
          this.reset();
        },
        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function reset() {
          // Reset data buffer
          BufferedBlockAlgorithm.reset.call(this);

          // Perform concrete-hasher logic
          this._doReset();
        },
        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function update(messageUpdate) {
          // Append
          this._append(messageUpdate);

          // Update the hash
          this._process();

          // Chainable
          return this;
        },
        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function finalize(messageUpdate) {
          // Final message update
          if (messageUpdate) {
            this._append(messageUpdate);
          }

          // Perform concrete-hasher logic
          var hash = this._doFinalize();
          return hash;
        },
        blockSize: 512 / 32,
        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function _createHelper(hasher) {
          return function (message, cfg) {
            return new hasher.init(cfg).finalize(message);
          };
        },
        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */
        _createHmacHelper: function _createHmacHelper(hasher) {
          return function (message, key) {
            return new C_algo.HMAC.init(hasher, key).finalize(message);
          };
        }
      });

      /**
       * Algorithm namespace.
       */
      var C_algo = C.algo = {};
      return C;
    }(Math);
    return CryptoJS;
  });
})(core);

(function (module, exports) {
  (function (root, factory) {
    {
      // CommonJS
      module.exports = factory(core.exports);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo;

      // Initialization and round constants tables
      var H = [];
      var K = [];

      // Compute constants
      (function () {
        function isPrime(n) {
          var sqrtN = Math.sqrt(n);
          for (var factor = 2; factor <= sqrtN; factor++) {
            if (!(n % factor)) {
              return false;
            }
          }
          return true;
        }
        function getFractionalBits(n) {
          return (n - (n | 0)) * 0x100000000 | 0;
        }
        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
          if (isPrime(n)) {
            if (nPrime < 8) {
              H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
            }
            K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
            nPrime++;
          }
          n++;
        }
      })();

      // Reusable object
      var W = [];

      /**
       * SHA-256 hash algorithm.
       */
      var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function _doReset() {
          this._hash = new WordArray.init(H.slice(0));
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          // Shortcut
          var H = this._hash.words;

          // Working variables
          var a = H[0];
          var b = H[1];
          var c = H[2];
          var d = H[3];
          var e = H[4];
          var f = H[5];
          var g = H[6];
          var h = H[7];

          // Computation
          for (var i = 0; i < 64; i++) {
            if (i < 16) {
              W[i] = M[offset + i] | 0;
            } else {
              var gamma0x = W[i - 15];
              var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
              var gamma1x = W[i - 2];
              var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
              W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
            }
            var ch = e & f ^ ~e & g;
            var maj = a & b ^ a & c ^ b & c;
            var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
            var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
            var t1 = h + sigma1 + ch + K[i] + W[i];
            var t2 = sigma0 + maj;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
          }

          // Intermediate hash value
          H[0] = H[0] + a | 0;
          H[1] = H[1] + b | 0;
          H[2] = H[2] + c | 0;
          H[3] = H[3] + d | 0;
          H[4] = H[4] + e | 0;
          H[5] = H[5] + f | 0;
          H[6] = H[6] + g | 0;
          H[7] = H[7] + h | 0;
        },
        _doFinalize: function _doFinalize() {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;

          // Add padding
          dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
          data.sigBytes = dataWords.length * 4;

          // Hash final blocks
          this._process();

          // Return final computed hash
          return this._hash;
        },
        clone: function clone() {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();
          return clone;
        }
      });

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA256('message');
       *     var hash = CryptoJS.SHA256(wordArray);
       */
      C.SHA256 = Hasher._createHelper(SHA256);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA256(message, key);
       */
      C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
    })(Math);
    return CryptoJS.SHA256;
  });
})(sha256$1);
var sha256 = sha256$1.exports;

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
var isRooNode = function (n) {
    return n.model.moveProps.length > 0;
};
var isSetupNode = function (n) {
    return n.model.setupProps.length > 0;
};
var isAnswerNode = function (n, kind) {
    var _a;
    var _b, _c;
    var pai = (_b = n.model.customProps) === null || _b === void 0 ? void 0 : _b.find(function (p) { return p.token === 'PAI'; });
    var pat = (_c = n.model.customProps) === null || _c === void 0 ? void 0 : _c.find(function (p) { return p.token === 'PAT'; });
    if (!pai && !pat)
        return false;
    if (pai) {
        var data = JSON.parse(pai.value);
        var paiMap = (_a = {}, _a[exports.ProblemAnswerType.Right] = 'r', _a[exports.ProblemAnswerType.Variant] = 'v', _a[exports.ProblemAnswerType.Wrong] = 'w', _a);
        return (data === null || data === void 0 ? void 0 : data.kind) === paiMap[kind];
    }
    else {
        console.log('vvv', pat.value, kind);
        return (pat === null || pat === void 0 ? void 0 : pat.value) === kind;
    }
};
var getNodeNumber = function (n, parent) {
    var path = n.getPath();
    var movesCount = path.filter(function (n) { return isMoveNode(n); }).length;
    if (parent) {
        movesCount += parent.getPath().filter(function (n) { return isMoveNode(n); }).length;
    }
    return movesCount;
};
var calcSHA = function (node, moveProps, setupProps) {
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
    if (xOffset === void 0) { xOffset = 0; }
    if (yOffset === void 0) { yOffset = 0; }
    var result = '';
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
var reverseOffsetA1Move = function (move, mat, analysis) {
    if (move === 'pass')
        return move;
    var idObj = JSON.parse(analysis.id);
    var _a = reverseOffset(mat, idObj.bx, idObj.by), x = _a.x, y = _a.y;
    var inx = A1_LETTERS.indexOf(move[0]) + x;
    var iny = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0)) + y;
    return "".concat(A1_LETTERS[inx]).concat(A1_NUMBERS[iny]);
};
var calcScoreDiffText = function (prev, curr, fixed, reverse) {
    if (fixed === void 0) { fixed = 1; }
    if (reverse === void 0) { reverse = false; }
    if (!prev || !curr)
        return '';
    var score = calcScoreDiff(prev, curr);
    if (reverse)
        score = -score;
    var fixedScore = score.toFixed(fixed);
    return score > 0 ? "+".concat(fixedScore) : "".concat(fixedScore);
};
var calcWinrateDiffText = function (prev, curr, fixed, reverse) {
    if (fixed === void 0) { fixed = 1; }
    if (reverse === void 0) { reverse = false; }
    if (!prev || !curr)
        return '';
    var winrate = calcWinrateDiff(prev, curr);
    if (reverse)
        winrate = -winrate;
    var fixedWinrate = winrate.toFixed(fixed);
    return winrate >= 0 ? "+".concat(fixedWinrate, "%") : "".concat(fixedWinrate, "%");
};
var calcScoreDiff = function (prevInfo, currInfo) {
    var sign = prevInfo.currentPlayer === 'B' ? 1 : -1;
    var score = Math.round((currInfo.scoreLead - prevInfo.scoreLead) * sign * 1000) / 1000;
    return score;
};
var calcWinrateDiff = function (prevInfo, currInfo) {
    var sign = prevInfo.currentPlayer === 'B' ? 1 : -1;
    var score = Math.round((currInfo.winrate - prevInfo.winrate) * sign * 1000 * 100) /
        1000;
    return score;
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
var extractAnswerKind = function (n) {
    var pat = n.model.customProps.find(function (p) { return p.token === 'PAT'; });
    var pai = n.model.customProps.find(function (p) { return p.token === 'PAI'; });
    if (pai) {
        var data = JSON.parse(pai.value);
        var paiMap = { r: exports.ProblemAnswerType.Right, v: exports.ProblemAnswerType.Variant, w: exports.ProblemAnswerType.Wrong };
        return paiMap[data.kind];
    }
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
var buildMoveNode = function (move, parentNode, props) {
    var tree = new TreeModel__default["default"]();
    var moveProp = MoveProp.from(move);
    var sha = calcSHA(parentNode, [moveProp]);
    var number = 1;
    if (parentNode)
        number = getNodeNumber(parentNode) + 1;
    var nodeData = initNodeData(sha, number);
    nodeData.moveProps = [moveProp];
    nodeData.nodeAnnotationProps = [NodeAnnotationProp.from("N[".concat(sha, "]"))];
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
var calcSpaceAndScaledPadding = function (size, padding, boardSize) {
    var newSpace = (size - padding * 2) / boardSize;
    return { space: newSpace, scaledPadding: padding + newSpace / 2 };
};
var zeros = function (size) {
    return new Array(size[0]).fill(0).map(function () { return new Array(size[1]).fill(0); });
};
var empty = function (size) {
    return new Array(size[0]).fill('').map(function () { return new Array(size[1]).fill(''); });
};
var GRID = 19;
var liberties = 0;
var recursionPath = [];
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
var calcBoardSize = function (mat, boardSize, extend) {
    if (boardSize === void 0) { boardSize = 19; }
    if (extend === void 0) { extend = 2; }
    var result = [19, 19];
    var center = calcCenter(mat);
    var _a = calcMost(mat, boardSize), leftMost = _a.leftMost, rightMost = _a.rightMost, topMost = _a.topMost, bottomMost = _a.bottomMost;
    if (center === exports.Center.TopLeft) {
        result[0] = rightMost + extend + 1;
        result[1] = bottomMost + extend + 1;
    }
    if (center === exports.Center.TopRight) {
        result[0] = boardSize - leftMost + extend;
        result[1] = bottomMost + extend + 1;
    }
    if (center === exports.Center.BottomLeft) {
        result[0] = rightMost + extend + 1;
        result[1] = boardSize - topMost + extend;
    }
    if (center === exports.Center.BottomRight) {
        result[0] = boardSize - leftMost + extend;
        result[1] = boardSize - topMost + extend;
    }
    return result;
};
var calcPartialArea = function (mat, extend) {
    if (extend === void 0) { extend = 2; }
    var _a = calcMost(mat), leftMost = _a.leftMost, rightMost = _a.rightMost, topMost = _a.topMost, bottomMost = _a.bottomMost;
    var x1 = leftMost - extend < 0 ? 0 : leftMost - extend;
    var y1 = topMost - extend < 0 ? 0 : topMost - extend;
    var x2 = rightMost + extend > 18 ? 18 : rightMost + extend;
    var y2 = bottomMost + extend > 18 ? 18 : bottomMost + extend;
    return [
        [x1, y1],
        [x2, y2],
    ];
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
var reverseOffset = function (mat, bx, by) {
    if (bx === void 0) { bx = 19; }
    if (by === void 0) { by = 19; }
    var ox = 19 - bx;
    var oy = 19 - by;
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
var calcVisibleArea = function (mat, boardSize, extend) {
    if (boardSize === void 0) { boardSize = 19; }
    if (extend === void 0) { extend = 2; }
    var center = calcCenter(mat);
    var _a = calcMost(mat, boardSize), leftMost = _a.leftMost, rightMost = _a.rightMost, topMost = _a.topMost, bottomMost = _a.bottomMost;
    var visibleArea = [
        [0, 18],
        [0, 18],
    ];
    var visibleSize = boardSize - 1;
    if (center === exports.Center.TopLeft) {
        visibleSize = Math.min(Math.max(rightMost, bottomMost) + extend, boardSize - 1);
        visibleArea = [
            [0, visibleSize],
            [0, visibleSize],
        ];
    }
    else if (center === exports.Center.TopRight) {
        visibleSize = Math.min(Math.max(bottomMost + extend, boardSize - 1 - (leftMost - extend)), boardSize - 1);
        visibleArea = [
            [boardSize - 1 - visibleSize, 18],
            [0, visibleSize],
        ];
    }
    else if (center === exports.Center.BottomLeft) {
        visibleSize = Math.min(Math.max(boardSize - 1 - (topMost - extend), rightMost + extend), boardSize - 1);
        visibleArea = [
            [0, visibleSize],
            [boardSize - 1 - visibleSize, 18],
        ];
    }
    else if (center === exports.Center.BottomRight) {
        visibleSize = Math.min(Math.max(boardSize - 1 - (topMost - extend), boardSize - 1 - (leftMost - extend)), boardSize - 1);
        visibleArea = [
            [boardSize - 1 - visibleSize, 18],
            [boardSize - 1 - visibleSize, 18],
        ];
    }
    return { visibleArea: visibleArea, center: center };
};
function calcLibertyCore(mat, x, y, ki) {
    if (x >= 0 && x < GRID && y >= 0 && y < GRID) {
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
}
function calcLiberty(mat, x, y, ki) {
    liberties = 0;
    recursionPath = [];
    if (x < 0 || y < 0 || x > GRID - 1 || y > GRID - 1) {
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
}
function execPonnuki(mat, i, j, ki) {
    var newMat = lodash.cloneDeep(mat);
    var _a = calcLiberty(mat, i, j - 1, ki), libertyUp = _a.liberty, recursionPathUp = _a.recursionPath;
    var _b = calcLiberty(mat, i, j + 1, ki), libertyDown = _b.liberty, recursionPathDown = _b.recursionPath;
    var _c = calcLiberty(mat, i - 1, j, ki), libertyLeft = _c.liberty, recursionPathLeft = _c.recursionPath;
    var _d = calcLiberty(mat, i + 1, j, ki), libertyRight = _d.liberty, recursionPathRight = _d.recursionPath;
    if (libertyUp === 0) {
        recursionPathUp.forEach(function (item) {
            var coord = item.split(',');
            newMat[parseInt(coord[0], 10)][parseInt(coord[1], 10)] = 0;
        });
    }
    if (libertyDown === 0) {
        recursionPathDown.forEach(function (item) {
            var coord = item.split(',');
            newMat[parseInt(coord[0], 10)][parseInt(coord[1], 10)] = 0;
        });
    }
    if (libertyLeft === 0) {
        recursionPathLeft.forEach(function (item) {
            var coord = item.split(',');
            newMat[parseInt(coord[0], 10)][parseInt(coord[1], 10)] = 0;
        });
    }
    if (libertyRight === 0) {
        recursionPathRight.forEach(function (item) {
            var coord = item.split(',');
            newMat[parseInt(coord[0], 10)][parseInt(coord[1], 10)] = 0;
        });
    }
    return newMat;
}
function canPonnuki(mat, i, j, ki) {
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
}
function canMove(mat, i, j, ki) {
    if (i < 0 || j < 0)
        return true;
    if (i > 18 || j > 18)
        return true;
    var newMat = lodash.cloneDeep(mat);
    if (newMat[i][j] !== 0) {
        return false;
    }
    newMat[i][j] = ki;
    var liberty = calcLiberty(newMat, i, j, ki).liberty;
    if (canPonnuki(newMat, i, j, -ki)) {
        return true;
    }
    if (canPonnuki(newMat, i, j, ki)) {
        return false;
    }
    if (liberty === 0) {
        return false;
    }
    return true;
}
function move(mat, i, j, ki) {
    if (i < 0 || j < 0)
        return mat;
    var newMat = lodash.cloneDeep(mat);
    newMat[i][j] = ki;
    return execPonnuki(newMat, i, j, -ki);
}
function showKi(mat, steps, isPonnuki) {
    if (isPonnuki === void 0) { isPonnuki = true; }
    var newMat = lodash.cloneDeep(mat);
    var hasMoved = false;
    steps.forEach(function (str) {
        var _a = sgfToPos(str), x = _a.x, y = _a.y, ki = _a.ki;
        if (isPonnuki) {
            if (canMove(newMat, x, y, ki)) {
                newMat[x][y] = ki;
                newMat = execPonnuki(newMat, x, y, -ki);
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
var calcTransform = function (size, mat, options) {
    var boardSize = options.boardSize, extend = options.extend, padding = options.padding, zoom = options.zoom;
    var _a = calcVisibleArea(mat, boardSize, extend), zoomedVisibleArea = _a.visibleArea, center = _a.center;
    var va = zoom
        ? zoomedVisibleArea
        : [
            [0, 18],
            [0, 18],
        ];
    var zoomedBoardSize = va[0][1] - va[0][0] + 1;
    var space = calcSpaceAndScaledPadding(size, padding, boardSize).space;
    // const scale = 1 / (zoomedBoardSize / boardSize);
    var scale = size / (zoomedBoardSize * space + padding);
    var clip = { x: 0, y: 0, width: size / scale, height: size / scale };
    var transform = [];
    if (zoom &&
        !(va[0][0] === 0 && va[0][1] === 18 && va[1][0] === 0 && va[1][1] === 18)) {
        var offsetX = 0;
        var offsetY = 0;
        // const offset = this.options.padding;
        var offset = padding * scale;
        // This offset formula is not accurate, just try many time
        // const offset = (padding * scale - (space * scale) / 2.5) * scale;
        switch (center) {
            case exports.Center.TopLeft:
                break;
            case exports.Center.TopRight:
                clip.x = size - size / scale;
                offsetX = va[0][0] * space * scale + offset;
                break;
            case exports.Center.BottomLeft:
                clip.y = size - size / scale;
                offsetY = va[1][0] * space * scale + offset;
                break;
            case exports.Center.BottomRight:
                clip.x = size - size / scale;
                clip.y = size - size / scale;
                offsetX = va[0][0] * space * scale + offset;
                offsetY = va[1][0] * space * scale + offset;
                break;
        }
        return {
            va: va,
            scale: scale,
            translateX: -offsetX,
            translateY: -offsetY,
            center: center,
            clip: clip,
            space: space,
            // transform: [{translateX: -offsetX, translateY: -offsetY}, {scale}],
            transform: [
                {
                    translateX: -offsetX,
                    // translateX: 0,
                },
                {
                    translateY: -offsetY,
                    // translateY: 0,
                },
                { scale: scale },
            ],
        };
    }
    else {
        return {
            va: va,
            scale: 1,
            translateX: 0,
            translateY: 0,
            center: center,
            clip: clip,
            space: space,
            transform: transform,
        };
    }
};
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

var Sgf = /** @class */ (function () {
    function Sgf() {
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
        this.tree = new TreeModel__default["default"]();
        this.root = null;
        this.node = null;
        this.currentNode = null;
        this.parentNode = null;
        this.nodeProps = new Map();
        this.sgf = '';
    }
    Sgf.prototype.fromRoot = function (root) {
        this.root = root;
        return this;
    };
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
    Sgf.prototype.toSgf = function () {
        return "(".concat(this.nodeToString(this.root), ")");
    };
    Sgf.prototype.toSgfWithoutAnalysis = function () {
        var sgf = "(".concat(this.nodeToString(this.root), ")");
        return lodash.replace(sgf, /](A\[.*?\])/g, ']');
    };
    Sgf.prototype.parse = function (sgf) {
        if (!sgf) {
            return;
        }
        // sgf = sgf.replace(/(\r\n|\n|\r)/gm, '');
        var nodeStart = 0;
        var counter = 0;
        var stack = [];
        var _loop_1 = function (i) {
            var c = sgf[i];
            if (this_1.NODE_DELIMITERS.includes(c)) {
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
                    var matches = tslib.__spreadArray([], tslib.__read(matchAll__default["default"](content, 
                    // RegExp(/([A-Z]+\[[a-z\[\]]*\]+)/, 'g')
                    // RegExp(/([A-Z]+\[.*?\]+)/, 'g')
                    // RegExp(/[A-Z]+(\[.*?\]){1,}/, 'g')
                    RegExp(/[A-Z]+(\[[\s\S]*?\]){1,}/, 'g'))), false);
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
                        var sha = calcSHA(this_1.currentNode, moveProps_1, setupProps_1);
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
            if (c === '(' && this_1.currentNode) {
                stack.push(this_1.currentNode);
            }
            if (c === ')' && stack.length > 0) {
                var node = stack.pop();
                if (node) {
                    this_1.currentNode = node;
                }
            }
            if (this_1.NODE_DELIMITERS.includes(c)) {
                nodeStart = i;
            }
        };
        var this_1 = this;
        for (var i = 0; i < sgf.length; i++) {
            _loop_1(i);
        }
    };
    return Sgf;
}());

var tree = new TreeModel__default["default"]();
var initRootProps = [
    'FF[4]',
    'GM[1]',
    'CA[UTF-8]',
    'AP[ghostgo:0.1.0]',
    'SZ[19]',
    'ST[0]',
].map(function (p) { return RootProp.from(p); });
var initialRoot = function () {
    return tree.parse({
        id: 'root',
        name: 0,
        index: 0,
        number: 0,
        rootProps: initRootProps,
        moveProps: [],
        setupProps: [],
        markupProps: [],
        gameInfoProps: [],
        nodeAnnotationProps: [],
        moveAnnotationProps: [],
        customProps: [],
    });
};

exports.A1_LETTERS = A1_LETTERS;
exports.A1_LETTERS_WITH_I = A1_LETTERS_WITH_I;
exports.A1_NUMBERS = A1_NUMBERS;
exports.AnnotationProp = AnnotationProp;
exports.BLANK_ARRAY = BLANK_ARRAY;
exports.CUSTOM_PROP_LIST = CUSTOM_PROP_LIST;
exports.CustomProp = CustomProp;
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
exports.DOT_SIZE = DOT_SIZE;
exports.EXPAND_H = EXPAND_H;
exports.EXPAND_V = EXPAND_V;
exports.GAME_INFO_PROP_LIST = GAME_INFO_PROP_LIST;
exports.GRID = GRID$1;
exports.GameInfoProp = GameInfoProp;
exports.LIST_OF_POINTS_PROP = LIST_OF_POINTS_PROP;
exports.MARKUP_PROP_LIST = MARKUP_PROP_LIST;
exports.MISCELLANEOUS_PROP_LIST = MISCELLANEOUS_PROP_LIST;
exports.MOVE_ANNOTATION_PROP_LIST = MOVE_ANNOTATION_PROP_LIST;
exports.MOVE_PROP_LIST = MOVE_PROP_LIST;
exports.MarkupProp = MarkupProp;
exports.MiscellaneousProp = MiscellaneousProp;
exports.MoveAnnotationProp = MoveAnnotationProp;
exports.MoveProp = MoveProp;
exports.NODE_ANNOTATION_PROP_LIST = NODE_ANNOTATION_PROP_LIST;
exports.NodeAnnotationProp = NodeAnnotationProp;
exports.RESOURCES = RESOURCES;
exports.RESPONSE_TIME = RESPONSE_TIME;
exports.ROOT_PROP_LIST = ROOT_PROP_LIST;
exports.RootProp = RootProp;
exports.SETUP_PROP_LIST = SETUP_PROP_LIST;
exports.SGF_LETTERS = SGF_LETTERS;
exports.SetupProp = SetupProp;
exports.Sgf = Sgf;
exports.SgfPropBase = SgfPropBase;
exports.TIMING_PROP_LIST = TIMING_PROP_LIST;
exports.TimingProp = TimingProp;
exports.a1ToIndex = a1ToIndex;
exports.a1ToPos = a1ToPos;
exports.a1ToSGF = a1ToSGF;
exports.buildMoveNode = buildMoveNode;
exports.calcBoardSize = calcBoardSize;
exports.calcCenter = calcCenter;
exports.calcDoubtfulMovesThresholdRange = calcDoubtfulMovesThresholdRange;
exports.calcMost = calcMost;
exports.calcOffset = calcOffset;
exports.calcPartialArea = calcPartialArea;
exports.calcSHA = calcSHA;
exports.calcScoreDiff = calcScoreDiff;
exports.calcScoreDiffText = calcScoreDiffText;
exports.calcSpaceAndScaledPadding = calcSpaceAndScaledPadding;
exports.calcTransform = calcTransform;
exports.calcVisibleArea = calcVisibleArea;
exports.calcWinrateDiff = calcWinrateDiff;
exports.calcWinrateDiffText = calcWinrateDiffText;
exports.canMove = canMove;
exports.convertStepsForAI = convertStepsForAI;
exports.convertStoneTypeToString = convertStoneTypeToString;
exports.cutMoveNodes = cutMoveNodes;
exports.empty = empty;
exports.extractAnswerKind = extractAnswerKind;
exports.extractPAI = extractPAI;
exports.extractPI = extractPI;
exports.getDeduplicatedProps = getDeduplicatedProps;
exports.getIndexFromAnalysis = getIndexFromAnalysis;
exports.getLastIndex = getLastIndex;
exports.getNodeNumber = getNodeNumber;
exports.handleMove = handleMove;
exports.initNodeData = initNodeData;
exports.initialRoot = initialRoot;
exports.isAnswerNode = isAnswerNode;
exports.isMainPath = isMainPath;
exports.isMoveNode = isMoveNode;
exports.isRooNode = isRooNode;
exports.isSetupNode = isSetupNode;
exports.matToListOfTuples = matToListOfTuples;
exports.matToPosition = matToPosition;
exports.move = move;
exports.nFormatter = nFormatter;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTbGljZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZXEuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0l0ZXJhdGVlQ2FsbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3RyaW1tZWRFbmRJbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUcmltLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9GaW5pdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvSW50ZWdlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvY2h1bmsuanMiLCIuLi8uLi90eXBlcy50cyIsIi4uLy4uL2NvbnN0LnRzIiwiLi4vLi4vY29yZS9wcm9wcy50cyIsIi4uL25vZGVfbW9kdWxlcy9jcnlwdG8tanMvY29yZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jcnlwdG8tanMvc2hhMjU2LmpzIiwiLi4vLi4vaGVscGVyLnRzIiwiLi4vLi4vY29yZS9zZ2YudHMiLCIuLi8uLi9jb3JlL2hlbHBlcnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zbGljZWAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2xpY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IC1zdGFydCA+IGxlbmd0aCA/IDAgOiAobGVuZ3RoICsgc3RhcnQpO1xuICB9XG4gIGVuZCA9IGVuZCA+IGxlbmd0aCA/IGxlbmd0aCA6IGVuZDtcbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuZ3RoO1xuICB9XG4gIGxlbmd0aCA9IHN0YXJ0ID4gZW5kID8gMCA6ICgoZW5kIC0gc3RhcnQpID4+PiAwKTtcbiAgc3RhcnQgPj4+PSAwO1xuXG4gIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtpbmRleCArIHN0YXJ0XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTbGljZTtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdClcbiAgICAgICkge1xuICAgIHJldHVybiBlcShvYmplY3RbaW5kZXhdLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggYSBzaW5nbGUgd2hpdGVzcGFjZSBjaGFyYWN0ZXIuICovXG52YXIgcmVXaGl0ZXNwYWNlID0gL1xccy87XG5cbi8qKlxuICogVXNlZCBieSBgXy50cmltYCBhbmQgYF8udHJpbUVuZGAgdG8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZVxuICogY2hhcmFjdGVyIG9mIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3Rlci5cbiAqL1xuZnVuY3Rpb24gdHJpbW1lZEVuZEluZGV4KHN0cmluZykge1xuICB2YXIgaW5kZXggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIHdoaWxlIChpbmRleC0tICYmIHJlV2hpdGVzcGFjZS50ZXN0KHN0cmluZy5jaGFyQXQoaW5kZXgpKSkge31cbiAgcmV0dXJuIGluZGV4O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRyaW1tZWRFbmRJbmRleDtcbiIsInZhciB0cmltbWVkRW5kSW5kZXggPSByZXF1aXJlKCcuL190cmltbWVkRW5kSW5kZXgnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbVN0YXJ0ID0gL15cXHMrLztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50cmltYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHRyaW0uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSB0cmltbWVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRyaW0oc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmdcbiAgICA/IHN0cmluZy5zbGljZSgwLCB0cmltbWVkRW5kSW5kZXgoc3RyaW5nKSArIDEpLnJlcGxhY2UocmVUcmltU3RhcnQsICcnKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUcmltO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VUcmltID0gcmVxdWlyZSgnLi9fYmFzZVRyaW0nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IGJhc2VUcmltKHZhbHVlKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG4iLCJ2YXIgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwODtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgZmluaXRlIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTIuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvRmluaXRlKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvRmluaXRlKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b0Zpbml0ZShJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9GaW5pdGUoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvRmluaXRlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgdmFsdWUgPSB0b051bWJlcih2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PT0gSU5GSU5JVFkgfHwgdmFsdWUgPT09IC1JTkZJTklUWSkge1xuICAgIHZhciBzaWduID0gKHZhbHVlIDwgMCA/IC0xIDogMSk7XG4gICAgcmV0dXJuIHNpZ24gKiBNQVhfSU5URUdFUjtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gdmFsdWUgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvRmluaXRlO1xuIiwidmFyIHRvRmluaXRlID0gcmVxdWlyZSgnLi90b0Zpbml0ZScpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzLjIpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9JbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gMFxuICpcbiAqIF8udG9JbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0ludGVnZXIoJzMuMicpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IHRvRmluaXRlKHZhbHVlKSxcbiAgICAgIHJlbWFpbmRlciA9IHJlc3VsdCAlIDE7XG5cbiAgcmV0dXJuIHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlbWFpbmRlciA/IHJlc3VsdCAtIHJlbWFpbmRlciA6IHJlc3VsdCkgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvSW50ZWdlcjtcbiIsInZhciBiYXNlU2xpY2UgPSByZXF1aXJlKCcuL19iYXNlU2xpY2UnKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUNlaWwgPSBNYXRoLmNlaWwsXG4gICAgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBlbGVtZW50cyBzcGxpdCBpbnRvIGdyb3VwcyB0aGUgbGVuZ3RoIG9mIGBzaXplYC5cbiAqIElmIGBhcnJheWAgY2FuJ3QgYmUgc3BsaXQgZXZlbmx5LCB0aGUgZmluYWwgY2h1bmsgd2lsbCBiZSB0aGUgcmVtYWluaW5nXG4gKiBlbGVtZW50cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBwcm9jZXNzLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzaXplPTFdIFRoZSBsZW5ndGggb2YgZWFjaCBjaHVua1xuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGNodW5rcy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5jaHVuayhbJ2EnLCAnYicsICdjJywgJ2QnXSwgMik7XG4gKiAvLyA9PiBbWydhJywgJ2InXSwgWydjJywgJ2QnXV1cbiAqXG4gKiBfLmNodW5rKFsnYScsICdiJywgJ2MnLCAnZCddLCAzKTtcbiAqIC8vID0+IFtbJ2EnLCAnYicsICdjJ10sIFsnZCddXVxuICovXG5mdW5jdGlvbiBjaHVuayhhcnJheSwgc2l6ZSwgZ3VhcmQpIHtcbiAgaWYgKChndWFyZCA/IGlzSXRlcmF0ZWVDYWxsKGFycmF5LCBzaXplLCBndWFyZCkgOiBzaXplID09PSB1bmRlZmluZWQpKSB7XG4gICAgc2l6ZSA9IDE7XG4gIH0gZWxzZSB7XG4gICAgc2l6ZSA9IG5hdGl2ZU1heCh0b0ludGVnZXIoc2l6ZSksIDApO1xuICB9XG4gIHZhciBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcbiAgaWYgKCFsZW5ndGggfHwgc2l6ZSA8IDEpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgdmFyIGluZGV4ID0gMCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG5hdGl2ZUNlaWwobGVuZ3RoIC8gc2l6ZSkpO1xuXG4gIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IGJhc2VTbGljZShhcnJheSwgaW5kZXgsIChpbmRleCArPSBzaXplKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaHVuaztcbiIsImV4cG9ydCB0eXBlIEdob3N0QmFuT3B0aW9ucyA9IHtcbiAgYm9hcmRTaXplOiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIHBhZGRpbmc6IG51bWJlcjtcbiAgem9vbT86IGJvb2xlYW47XG4gIGV4dGVuZDogbnVtYmVyO1xuICB0aGVtZTogVGhlbWU7XG4gIGNvb3JkaW5hdGU6IGJvb2xlYW47XG4gIGludGVyYWN0aXZlOiBib29sZWFuO1xuICBiYWNrZ3JvdW5kOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgR2hvc3RCYW5PcHRpb25zUGFyYW1zID0ge1xuICBib2FyZFNpemU/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIHBhZGRpbmc/OiBudW1iZXI7XG4gIHpvb20/OiBib29sZWFuO1xuICBleHRlbmQ/OiBudW1iZXI7XG4gIHRoZW1lPzogVGhlbWU7XG4gIGNvb3JkaW5hdGU/OiBib29sZWFuO1xuICBpbnRlcmFjdGl2ZT86IGJvb2xlYW47XG4gIGJhY2tncm91bmQ/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgQ29uc3VtZWRBbmFseXNpcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNlcyA9IHtcbiAgcmVzdWx0czogQW5hbHlzaXNbXTtcbiAgcGFyYW1zOiBBbmFseXNpc1BhcmFtcyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaXNEdXJpbmdTZWFyY2g6IGJvb2xlYW47XG4gIG1vdmVJbmZvczogTW92ZUluZm9bXTtcbiAgcm9vdEluZm86IFJvb3RJbmZvO1xuICBwb2xpY3k6IG51bWJlcltdO1xuICBvd25lcnNoaXA6IG51bWJlcltdO1xuICB0dXJuTnVtYmVyOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBBbmFseXNpc1BhcmFtcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaW5pdGlhbFBsYXllcjogc3RyaW5nO1xuICBtb3ZlczogYW55W107XG4gIHJ1bGVzOiBzdHJpbmc7XG4gIGtvbWk6IHN0cmluZztcbiAgYm9hcmRYU2l6ZTogbnVtYmVyO1xuICBib2FyZFlTaXplOiBudW1iZXI7XG4gIGluY2x1ZGVQb2xpY3k6IGJvb2xlYW47XG4gIHByaW9yaXR5OiBudW1iZXI7XG4gIG1heFZpc2l0czogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgTW92ZUluZm8gPSB7XG4gIGlzU3ltbWV0cnlPZjogc3RyaW5nO1xuICBsY2I6IG51bWJlcjtcbiAgbW92ZTogc3RyaW5nO1xuICBvcmRlcjogbnVtYmVyO1xuICBwcmlvcjogbnVtYmVyO1xuICBwdjogc3RyaW5nW107XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZU1lYW46IG51bWJlcjtcbiAgc2NvcmVTZWxmUGxheTogbnVtYmVyO1xuICBzY29yZVN0ZGV2OiBudW1iZXI7XG4gIHV0aWxpdHk6IG51bWJlcjtcbiAgdXRpbGl0eUxjYjogbnVtYmVyO1xuICB2aXNpdHM6IG51bWJlcjtcbiAgd2lucmF0ZTogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgUm9vdEluZm8gPSB7XG4gIGN1cnJlbnRQbGF5ZXI6IHN0cmluZztcbiAgbGNiOiBudW1iZXI7XG4gIHNjb3JlTGVhZDogbnVtYmVyO1xuICBzY29yZVNlbGZwbGF5OiBudW1iZXI7XG4gIHNjb3JlU3RkZXY6IG51bWJlcjtcbiAgc3ltSGFzaDogc3RyaW5nO1xuICB0aGlzSGFzaDogc3RyaW5nO1xuICB1dGlsaXR5OiBudW1iZXI7XG4gIHZpc2l0czogbnVtYmVyO1xuICB3aW5yYXRlOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZW51bSBLaSB7XG4gIEJsYWNrID0gMSxcbiAgV2hpdGUgPSAtMSxcbiAgRW1wdHkgPSAwLFxufVxuXG5leHBvcnQgZW51bSBUaGVtZSB7XG4gIEJsYWNrQW5kV2hpdGUgPSAnYmxhY2stYW5kLXdoaXRlJyxcbiAgRmxhdCA9ICdmbGF0JyxcbiAgU3ViZHVlZCA9ICdzdWJkdWVkJyxcbiAgU2hlbGxTdG9uZSA9ICdzaGVsbCcsXG4gIFNsYXRlQW5kU2hlbGwgPSAnc2xhdGUtYW5kLXNoZWxsJyxcbiAgV2FsbnV0ID0gJ3dhbG51dCcsXG4gIFBob3RvcmVhbGlzdGljID0gJ3Bob3RvcmVhbGlzdGljJyxcbn1cblxuZXhwb3J0IGVudW0gQ2VudGVyIHtcbiAgVG9wUmlnaHQgPSAndHInLFxuICBUb3BMZWZ0ID0gJ3RsJyxcbiAgQm90dG9tTGVmdCA9ICdibCcsXG4gIEJvdHRvbVJpZ2h0ID0gJ2JyJyxcbiAgQ2VudGVyID0gJ2MnLFxufVxuXG5leHBvcnQgZW51bSBNYXJrdXAge1xuICBDdXJyZW50ID0gJ2N1JyxcbiAgQ2lyY2xlID0gJ2NpJyxcbiAgU3F1YXJlID0gJ3NxJyxcbiAgVHJpYW5nbGUgPSAndHJpJyxcbiAgQ3Jvc3MgPSAnY3InLFxuICBOdW1iZXIgPSAnbnVtJyxcbiAgTGV0dGVyID0gJ2xlJyxcbiAgTm9uZSA9ICcnLFxufVxuXG5leHBvcnQgZW51bSBQcm9ibGVtQW5zd2VyVHlwZSB7XG4gIFJpZ2h0ID0gJzEnLFxuICBXcm9uZyA9ICcyJyxcbiAgVmFyaWFudCA9ICczJyxcbn1cbiIsImltcG9ydCBjaHVuayBmcm9tICdsb2Rhc2gvY2h1bmsnO1xuaW1wb3J0IHtUaGVtZX0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IHNldHRpbmdzID0ge2NkbjogJ2h0dHBzOi8vcy5zaGFvd3EuY29tJ307XG5cbmV4cG9ydCBjb25zdCBBMV9MRVRURVJTID0gW1xuICAnQScsXG4gICdCJyxcbiAgJ0MnLFxuICAnRCcsXG4gICdFJyxcbiAgJ0YnLFxuICAnRycsXG4gICdIJyxcbiAgJ0onLFxuICAnSycsXG4gICdMJyxcbiAgJ00nLFxuICAnTicsXG4gICdPJyxcbiAgJ1AnLFxuICAnUScsXG4gICdSJyxcbiAgJ1MnLFxuICAnVCcsXG5dO1xuZXhwb3J0IGNvbnN0IEExX0xFVFRFUlNfV0lUSF9JID0gW1xuICAnQScsXG4gICdCJyxcbiAgJ0MnLFxuICAnRCcsXG4gICdFJyxcbiAgJ0YnLFxuICAnRycsXG4gICdIJyxcbiAgJ0knLFxuICAnSicsXG4gICdLJyxcbiAgJ0wnLFxuICAnTScsXG4gICdOJyxcbiAgJ08nLFxuICAnUCcsXG4gICdRJyxcbiAgJ1InLFxuICAnUycsXG5dO1xuZXhwb3J0IGNvbnN0IEExX05VTUJFUlMgPSBbXG4gIDE5LCAxOCwgMTcsIDE2LCAxNSwgMTQsIDEzLCAxMiwgMTEsIDEwLCA5LCA4LCA3LCA2LCA1LCA0LCAzLCAyLCAxLFxuXTtcbmV4cG9ydCBjb25zdCBTR0ZfTEVUVEVSUyA9IFtcbiAgJ2EnLFxuICAnYicsXG4gICdjJyxcbiAgJ2QnLFxuICAnZScsXG4gICdmJyxcbiAgJ2cnLFxuICAnaCcsXG4gICdpJyxcbiAgJ2onLFxuICAnaycsXG4gICdsJyxcbiAgJ20nLFxuICAnbicsXG4gICdvJyxcbiAgJ3AnLFxuICAncScsXG4gICdyJyxcbiAgJ3MnLFxuXTtcbmV4cG9ydCBjb25zdCBCTEFOS19BUlJBWSA9IGNodW5rKG5ldyBBcnJheSgzNjEpLmZpbGwoMCksIDE5KTtcbmV4cG9ydCBjb25zdCBHUklEID0gMTk7XG5leHBvcnQgY29uc3QgRE9UX1NJWkUgPSAzO1xuZXhwb3J0IGNvbnN0IEVYUEFORF9IID0gNTtcbmV4cG9ydCBjb25zdCBFWFBBTkRfViA9IDU7XG5leHBvcnQgY29uc3QgUkVTUE9OU0VfVElNRSA9IDEwMDtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgYm9hcmRTaXplOiAxOSxcbiAgcGFkZGluZzogMTUsXG4gIGV4dGVuZDogMixcbiAgaW50ZXJhY3RpdmU6IHRydWUsXG4gIGNvb3JkaW5hdGU6IHRydWUsXG4gIHRoZW1lOiBUaGVtZS5GbGF0LFxuICBiYWNrZ3JvdW5kOiBmYWxzZSxcbiAgem9vbTogdHJ1ZSxcbn07XG5cbmV4cG9ydCBjb25zdCBSRVNPVVJDRVM6IHtcbiAgW2tleTogc3RyaW5nXToge2JvYXJkPzogc3RyaW5nOyBibGFja3M6IHN0cmluZ1tdOyB3aGl0ZXM6IHN0cmluZ1tdfTtcbn0gPSB7XG4gIFtUaGVtZS5CbGFja0FuZFdoaXRlXToge1xuICAgIGJsYWNrczogW10sXG4gICAgd2hpdGVzOiBbXSxcbiAgfSxcbiAgW1RoZW1lLlN1YmR1ZWRdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3N1YmR1ZWQvYm9hcmQucG5nYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zdWJkdWVkL2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3N1YmR1ZWQvd2hpdGUucG5nYF0sXG4gIH0sXG4gIFtUaGVtZS5TaGVsbFN0b25lXToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS9ib2FyZC5wbmdgLFxuICAgIGJsYWNrczogW2Ake3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL2JsYWNrLnBuZ2BdLFxuICAgIHdoaXRlczogW1xuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUwLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTEucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NoZWxsLXN0b25lL3doaXRlMi5wbmdgLFxuICAgICAgYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2hlbGwtc3RvbmUvd2hpdGUzLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zaGVsbC1zdG9uZS93aGl0ZTQucG5nYCxcbiAgICBdLFxuICB9LFxuICBbVGhlbWUuU2xhdGVBbmRTaGVsbF06IHtcbiAgICBib2FyZDogYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvc2xhdGUtYW5kLXNoZWxsL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGUxLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGUyLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGUzLnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGU0LnBuZ2AsXG4gICAgICBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS9zbGF0ZS1hbmQtc2hlbGwvc2xhdGU1LnBuZ2AsXG4gICAgXSxcbiAgICB3aGl0ZXM6IFtcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDEucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDIucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDMucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDQucG5nYCxcbiAgICAgIGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3NsYXRlLWFuZC1zaGVsbC9zaGVsbDUucG5nYCxcbiAgICBdLFxuICB9LFxuICBbVGhlbWUuV2FsbnV0XToge1xuICAgIGJvYXJkOiBgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS93YWxudXQvYm9hcmQuanBnYCxcbiAgICBibGFja3M6IFtgJHtzZXR0aW5ncy5jZG59L2Fzc2V0cy90aGVtZS93YWxudXQvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvd2FsbnV0L3doaXRlLnBuZ2BdLFxuICB9LFxuICBbVGhlbWUuUGhvdG9yZWFsaXN0aWNdOiB7XG4gICAgYm9hcmQ6IGAke3NldHRpbmdzLmNkbn0vYXNzZXRzL3RoZW1lL3Bob3RvcmVhbGlzdGljL2JvYXJkLnBuZ2AsXG4gICAgYmxhY2tzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvcGhvdG9yZWFsaXN0aWMvYmxhY2sucG5nYF0sXG4gICAgd2hpdGVzOiBbYCR7c2V0dGluZ3MuY2RufS9hc3NldHMvdGhlbWUvcGhvdG9yZWFsaXN0aWMvd2hpdGUucG5nYF0sXG4gIH0sXG4gIFtUaGVtZS5GbGF0XToge1xuICAgIGJsYWNrczogW10sXG4gICAgd2hpdGVzOiBbXSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgbWF0Y2hBbGwgZnJvbSAnc3RyaW5nLnByb3RvdHlwZS5tYXRjaGFsbCc7XG5cbmV4cG9ydCBjb25zdCBNT1ZFX1BST1BfTElTVCA9IFtcbiAgJ0InLFxuICAvLyBLTyBpcyBzdGFuZGFyZCBpbiBtb3ZlIGxpc3QgYnV0IHVzdWFsbHkgYmUgdXNlZCBmb3Iga29taSBpbiBnYW1laW5mbyBwcm9wc1xuICAvLyAnS08nLFxuICAnTU4nLFxuICAnVycsXG5dO1xuZXhwb3J0IGNvbnN0IFNFVFVQX1BST1BfTElTVCA9IFtcbiAgJ0FCJyxcbiAgJ0FFJyxcbiAgJ0FXJyxcbiAgLy9UT0RPOiBQTCBpcyBhIHZhbHVlIG9mIGNvbG9yIHR5cGVcbiAgLy8gJ1BMJ1xuXTtcbmV4cG9ydCBjb25zdCBOT0RFX0FOTk9UQVRJT05fUFJPUF9MSVNUID0gW1xuICAnQScsXG4gICdDJyxcbiAgJ0RNJyxcbiAgJ0dCJyxcbiAgJ0dXJyxcbiAgJ0hPJyxcbiAgJ04nLFxuICAnVUMnLFxuICAnVicsXG5dO1xuZXhwb3J0IGNvbnN0IE1PVkVfQU5OT1RBVElPTl9QUk9QX0xJU1QgPSBbXG4gICdCTScsXG4gICdETycsXG4gICdJVCcsXG4gIC8vIFRFIGlzIHN0YW5kYXJkIGluIG1vdmUgYW5ub3RhdGlvbiBmb3IgdGVzdWppXG4gIC8vICdURScsXG5dO1xuZXhwb3J0IGNvbnN0IE1BUktVUF9QUk9QX0xJU1QgPSBbXG4gICdBUicsXG4gICdDUicsXG4gICdMQicsXG4gICdMTicsXG4gICdNQScsXG4gICdTTCcsXG4gICdTUScsXG4gICdUUicsXG5dO1xuXG5leHBvcnQgY29uc3QgUk9PVF9QUk9QX0xJU1QgPSBbJ0FQJywgJ0NBJywgJ0ZGJywgJ0dNJywgJ1NUJywgJ1NaJ107XG5leHBvcnQgY29uc3QgR0FNRV9JTkZPX1BST1BfTElTVCA9IFtcbiAgLy9URSBOb24tc3RhbmRhcmRcbiAgJ1RFJyxcbiAgLy9LTyBOb24tc3RhbmRhcmRcbiAgJ0tPJyxcbiAgJ0FOJyxcbiAgJ0JSJyxcbiAgJ0JUJyxcbiAgJ0NQJyxcbiAgJ0RUJyxcbiAgJ0VWJyxcbiAgJ0dOJyxcbiAgJ0dDJyxcbiAgJ09OJyxcbiAgJ09UJyxcbiAgJ1BCJyxcbiAgJ1BDJyxcbiAgJ1BXJyxcbiAgJ1JFJyxcbiAgJ1JPJyxcbiAgJ1JVJyxcbiAgJ1NPJyxcbiAgJ1RNJyxcbiAgJ1VTJyxcbiAgJ1dSJyxcbiAgJ1dUJyxcbl07XG5leHBvcnQgY29uc3QgVElNSU5HX1BST1BfTElTVCA9IFsnQkwnLCAnT0InLCAnT1cnLCAnV0wnXTtcbmV4cG9ydCBjb25zdCBNSVNDRUxMQU5FT1VTX1BST1BfTElTVCA9IFsnRkcnLCAnUE0nLCAnVlcnXTtcblxuZXhwb3J0IGNvbnN0IENVU1RPTV9QUk9QX0xJU1QgPSBbJ1BJJywgJ1BBSScsICdOSUQnLCAnUEFUJ107XG5cbmV4cG9ydCBjb25zdCBMSVNUX09GX1BPSU5UU19QUk9QID0gWydBQicsICdBRScsICdBVyddO1xuXG5jb25zdCBUT0tFTl9SRUdFWCA9IG5ldyBSZWdFeHAoLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG5cbmV4cG9ydCBjbGFzcyBTZ2ZQcm9wQmFzZSB7XG4gIHRva2VuOiBzdHJpbmc7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIHZhbHVlczogc3RyaW5nW107XG4gIHR5cGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCB2YWx1ZXM/OiBzdHJpbmdbXSkge1xuICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXMgfHwgW3ZhbHVlXTtcbiAgICB0aGlzLnR5cGUgPSAnLSc7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYCR7dGhpcy50b2tlbn0ke3RoaXMudmFsdWVzLm1hcCh2ID0+IGBbJHt2fV1gKS5qb2luKCcnKX1gO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZywgdmFsdWVzPzogc3RyaW5nW10pIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUsIHZhbHVlcyk7XG4gICAgdGhpcy50eXBlID0gJ21vdmUnO1xuICB9XG5cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgTW92ZVByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTW92ZVByb3AoJycsICcnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0dXBQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCB2YWx1ZXM/OiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSwgdmFsdWVzKTtcbiAgICB0aGlzLnR5cGUgPSAnc2V0dXAnO1xuICB9XG5cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0b2tlbk1hdGNoID0gc3RyLm1hdGNoKFRPS0VOX1JFR0VYKTtcbiAgICBjb25zdCB2YWxNYXRjaGVzID0gbWF0Y2hBbGwoc3RyLCAvXFxbKFtcXHNcXFNdKj8pXFxdL2cpO1xuXG4gICAgbGV0IHRva2VuID0gJyc7XG4gICAgY29uc3QgdmFscyA9IFsuLi52YWxNYXRjaGVzXS5tYXAobSA9PiBtWzFdKTtcbiAgICBpZiAodG9rZW5NYXRjaCkgdG9rZW4gPSB0b2tlbk1hdGNoWzFdO1xuICAgIHJldHVybiBuZXcgU2V0dXBQcm9wKHRva2VuLCB2YWxzLmpvaW4oJywnKSwgdmFscyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vZGVBbm5vdGF0aW9uUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ25vZGUtYW5ub3RhdGlvbic7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgTm9kZUFubm90YXRpb25Qcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGVBbm5vdGF0aW9uUHJvcCgnJywgJycpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdtb3ZlLWFubm90YXRpb24nO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE1vdmVBbm5vdGF0aW9uUHJvcCh0b2tlbiwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBNb3ZlQW5ub3RhdGlvblByb3AoJycsICcnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW5ub3RhdGlvblByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7fVxuZXhwb3J0IGNsYXNzIE1hcmt1cFByb3AgZXh0ZW5kcyBTZ2ZQcm9wQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcih0b2tlbiwgdmFsdWUpO1xuICAgIHRoaXMudHlwZSA9ICdtYXJrdXAnO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IE1hcmt1cFByb3AodG9rZW4sIHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTWFya3VwUHJvcCgnJywgJycpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb290UHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ3Jvb3QnO1xuICB9XG4gIHN0YXRpYyBmcm9tKHN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goLyhbQS1aXSopXFxbKFtcXHNcXFNdKj8pXFxdLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IG1hdGNoWzFdO1xuICAgICAgY29uc3QgdmFsID0gbWF0Y2hbMl07XG4gICAgICByZXR1cm4gbmV3IFJvb3RQcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJvb3RQcm9wKCcnLCAnJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdhbWVJbmZvUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ2dhbWUtaW5mbyc7XG4gIH1cbiAgc3RhdGljIGZyb20oc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCgvKFtBLVpdKilcXFsoW1xcc1xcU10qPylcXF0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCB2YWwgPSBtYXRjaFsyXTtcbiAgICAgIHJldHVybiBuZXcgR2FtZUluZm9Qcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEdhbWVJbmZvUHJvcCgnJywgJycpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21Qcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB0aGlzLnR5cGUgPSAnY3VzdG9tJztcbiAgfVxuICBzdGF0aWMgZnJvbShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKC8oW0EtWl0qKVxcWyhbXFxzXFxTXSo/KVxcXS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHZhbCA9IG1hdGNoWzJdO1xuICAgICAgcmV0dXJuIG5ldyBDdXN0b21Qcm9wKHRva2VuLCB2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEN1c3RvbVByb3AoJycsICcnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGltaW5nUHJvcCBleHRlbmRzIFNnZlByb3BCYXNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgdGhpcy50eXBlID0gJ1RpbWluZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1pc2NlbGxhbmVvdXNQcm9wIGV4dGVuZHMgU2dmUHJvcEJhc2Uge31cbiIsIjsoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG5cdFx0Ly8gQ29tbW9uSlNcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIEdsb2JhbCAoYnJvd3Nlcilcblx0XHRyb290LkNyeXB0b0pTID0gZmFjdG9yeSgpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuXHQvKmdsb2JhbHMgd2luZG93LCBnbG9iYWwsIHJlcXVpcmUqL1xuXG5cdC8qKlxuXHQgKiBDcnlwdG9KUyBjb3JlIGNvbXBvbmVudHMuXG5cdCAqL1xuXHR2YXIgQ3J5cHRvSlMgPSBDcnlwdG9KUyB8fCAoZnVuY3Rpb24gKE1hdGgsIHVuZGVmaW5lZCkge1xuXG5cdCAgICB2YXIgY3J5cHRvO1xuXG5cdCAgICAvLyBOYXRpdmUgY3J5cHRvIGZyb20gd2luZG93IChCcm93c2VyKVxuXHQgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5jcnlwdG8pIHtcblx0ICAgICAgICBjcnlwdG8gPSB3aW5kb3cuY3J5cHRvO1xuXHQgICAgfVxuXG5cdCAgICAvLyBOYXRpdmUgY3J5cHRvIGluIHdlYiB3b3JrZXIgKEJyb3dzZXIpXG5cdCAgICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmIHNlbGYuY3J5cHRvKSB7XG5cdCAgICAgICAgY3J5cHRvID0gc2VsZi5jcnlwdG87XG5cdCAgICB9XG5cblx0ICAgIC8vIE5hdGl2ZSBjcnlwdG8gZnJvbSB3b3JrZXJcblx0ICAgIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsVGhpcy5jcnlwdG8pIHtcblx0ICAgICAgICBjcnlwdG8gPSBnbG9iYWxUaGlzLmNyeXB0bztcblx0ICAgIH1cblxuXHQgICAgLy8gTmF0aXZlIChleHBlcmltZW50YWwgSUUgMTEpIGNyeXB0byBmcm9tIHdpbmRvdyAoQnJvd3Nlcilcblx0ICAgIGlmICghY3J5cHRvICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5tc0NyeXB0bykge1xuXHQgICAgICAgIGNyeXB0byA9IHdpbmRvdy5tc0NyeXB0bztcblx0ICAgIH1cblxuXHQgICAgLy8gTmF0aXZlIGNyeXB0byBmcm9tIGdsb2JhbCAoTm9kZUpTKVxuXHQgICAgaWYgKCFjcnlwdG8gJiYgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsLmNyeXB0bykge1xuXHQgICAgICAgIGNyeXB0byA9IGdsb2JhbC5jcnlwdG87XG5cdCAgICB9XG5cblx0ICAgIC8vIE5hdGl2ZSBjcnlwdG8gaW1wb3J0IHZpYSByZXF1aXJlIChOb2RlSlMpXG5cdCAgICBpZiAoIWNyeXB0byAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXHQgICAgICAgIH0gY2F0Y2ggKGVycikge31cblx0ICAgIH1cblxuXHQgICAgLypcblx0ICAgICAqIENyeXB0b2dyYXBoaWNhbGx5IHNlY3VyZSBwc2V1ZG9yYW5kb20gbnVtYmVyIGdlbmVyYXRvclxuXHQgICAgICpcblx0ICAgICAqIEFzIE1hdGgucmFuZG9tKCkgaXMgY3J5cHRvZ3JhcGhpY2FsbHkgbm90IHNhZmUgdG8gdXNlXG5cdCAgICAgKi9cblx0ICAgIHZhciBjcnlwdG9TZWN1cmVSYW5kb21JbnQgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgaWYgKGNyeXB0bykge1xuXHQgICAgICAgICAgICAvLyBVc2UgZ2V0UmFuZG9tVmFsdWVzIG1ldGhvZCAoQnJvd3Nlcilcblx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgxKSlbMF07XG5cdCAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHt9XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBVc2UgcmFuZG9tQnl0ZXMgbWV0aG9kIChOb2RlSlMpXG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgY3J5cHRvLnJhbmRvbUJ5dGVzID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBjcnlwdG8ucmFuZG9tQnl0ZXMoNCkucmVhZEludDMyTEUoKTtcblx0ICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge31cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignTmF0aXZlIGNyeXB0byBtb2R1bGUgY291bGQgbm90IGJlIHVzZWQgdG8gZ2V0IHNlY3VyZSByYW5kb20gbnVtYmVyLicpO1xuXHQgICAgfTtcblxuXHQgICAgLypcblx0ICAgICAqIExvY2FsIHBvbHlmaWxsIG9mIE9iamVjdC5jcmVhdGVcblxuXHQgICAgICovXG5cdCAgICB2YXIgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIGZ1bmN0aW9uIEYoKSB7fVxuXG5cdCAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcblx0ICAgICAgICAgICAgdmFyIHN1YnR5cGU7XG5cblx0ICAgICAgICAgICAgRi5wcm90b3R5cGUgPSBvYmo7XG5cblx0ICAgICAgICAgICAgc3VidHlwZSA9IG5ldyBGKCk7XG5cblx0ICAgICAgICAgICAgRi5wcm90b3R5cGUgPSBudWxsO1xuXG5cdCAgICAgICAgICAgIHJldHVybiBzdWJ0eXBlO1xuXHQgICAgICAgIH07XG5cdCAgICB9KCkpO1xuXG5cdCAgICAvKipcblx0ICAgICAqIENyeXB0b0pTIG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIEMgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBMaWJyYXJ5IG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIENfbGliID0gQy5saWIgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBCYXNlIG9iamVjdCBmb3IgcHJvdG90eXBhbCBpbmhlcml0YW5jZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIEJhc2UgPSBDX2xpYi5CYXNlID0gKGZ1bmN0aW9uICgpIHtcblxuXG5cdCAgICAgICAgcmV0dXJuIHtcblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG92ZXJyaWRlcyBQcm9wZXJ0aWVzIHRvIGNvcHkgaW50byB0aGUgbmV3IG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbmV3IG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiAgICAgdmFyIE15VHlwZSA9IENyeXB0b0pTLmxpYi5CYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgZmllbGQ6ICd2YWx1ZScsXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICAgICAgbWV0aG9kOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgfVxuXHQgICAgICAgICAgICAgKiAgICAgfSk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uIChvdmVycmlkZXMpIHtcblx0ICAgICAgICAgICAgICAgIC8vIFNwYXduXG5cdCAgICAgICAgICAgICAgICB2YXIgc3VidHlwZSA9IGNyZWF0ZSh0aGlzKTtcblxuXHQgICAgICAgICAgICAgICAgLy8gQXVnbWVudFxuXHQgICAgICAgICAgICAgICAgaWYgKG92ZXJyaWRlcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHN1YnR5cGUubWl4SW4ob3ZlcnJpZGVzKTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGRlZmF1bHQgaW5pdGlhbGl6ZXJcblx0ICAgICAgICAgICAgICAgIGlmICghc3VidHlwZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdCcpIHx8IHRoaXMuaW5pdCA9PT0gc3VidHlwZS5pbml0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgc3VidHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlLiRzdXBlci5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZXIncyBwcm90b3R5cGUgaXMgdGhlIHN1YnR5cGUgb2JqZWN0XG5cdCAgICAgICAgICAgICAgICBzdWJ0eXBlLmluaXQucHJvdG90eXBlID0gc3VidHlwZTtcblxuXHQgICAgICAgICAgICAgICAgLy8gUmVmZXJlbmNlIHN1cGVydHlwZVxuXHQgICAgICAgICAgICAgICAgc3VidHlwZS4kc3VwZXIgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gc3VidHlwZTtcblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogRXh0ZW5kcyB0aGlzIG9iamVjdCBhbmQgcnVucyB0aGUgaW5pdCBtZXRob2QuXG5cdCAgICAgICAgICAgICAqIEFyZ3VtZW50cyB0byBjcmVhdGUoKSB3aWxsIGJlIHBhc3NlZCB0byBpbml0KCkuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG5ldyBvYmplY3QuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBpbnN0YW5jZSA9IE15VHlwZS5jcmVhdGUoKTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5leHRlbmQoKTtcblx0ICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cblx0ICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIG9iamVjdC5cblx0ICAgICAgICAgICAgICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gYWRkIHNvbWUgbG9naWMgd2hlbiB5b3VyIG9iamVjdHMgYXJlIGNyZWF0ZWQuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICB2YXIgTXlUeXBlID0gQ3J5cHRvSlMubGliLkJhc2UuZXh0ZW5kKHtcblx0ICAgICAgICAgICAgICogICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgICAgIC8vIC4uLlxuXHQgICAgICAgICAgICAgKiAgICAgICAgIH1cblx0ICAgICAgICAgICAgICogICAgIH0pO1xuXHQgICAgICAgICAgICAgKi9cblx0ICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB9LFxuXG5cdCAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgKiBDb3BpZXMgcHJvcGVydGllcyBpbnRvIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllcyBUaGUgcHJvcGVydGllcyB0byBtaXggaW4uXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICBNeVR5cGUubWl4SW4oe1xuXHQgICAgICAgICAgICAgKiAgICAgICAgIGZpZWxkOiAndmFsdWUnXG5cdCAgICAgICAgICAgICAqICAgICB9KTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIG1peEluOiBmdW5jdGlvbiAocHJvcGVydGllcykge1xuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIElFIHdvbid0IGNvcHkgdG9TdHJpbmcgdXNpbmcgdGhlIGxvb3AgYWJvdmVcblx0ICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KCd0b1N0cmluZycpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50b1N0cmluZyA9IHByb3BlcnRpZXMudG9TdHJpbmc7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBjbG9uZSA9IGluc3RhbmNlLmNsb25lKCk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdC5wcm90b3R5cGUuZXh0ZW5kKHRoaXMpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfTtcblx0ICAgIH0oKSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogQW4gYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuXHQgICAgICpcblx0ICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHdvcmRzIFRoZSBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG5cdCAgICAgKiBAcHJvcGVydHkge251bWJlcn0gc2lnQnl0ZXMgVGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBieXRlcyBpbiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgKi9cblx0ICAgIHZhciBXb3JkQXJyYXkgPSBDX2xpYi5Xb3JkQXJyYXkgPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSB3b3JkcyAoT3B0aW9uYWwpIEFuIGFycmF5IG9mIDMyLWJpdCB3b3Jkcy5cblx0ICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gc2lnQnl0ZXMgKE9wdGlvbmFsKSBUaGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGJ5dGVzIGluIHRoZSB3b3Jkcy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKCk7XG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShbMHgwMDAxMDIwMywgMHgwNDA1MDYwN10pO1xuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoWzB4MDAwMTAyMDMsIDB4MDQwNTA2MDddLCA2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBpbml0OiBmdW5jdGlvbiAod29yZHMsIHNpZ0J5dGVzKSB7XG5cdCAgICAgICAgICAgIHdvcmRzID0gdGhpcy53b3JkcyA9IHdvcmRzIHx8IFtdO1xuXG5cdCAgICAgICAgICAgIGlmIChzaWdCeXRlcyAhPSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSBzaWdCeXRlcztcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSB3b3Jkcy5sZW5ndGggKiA0O1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIHRoaXMgd29yZCBhcnJheSB0byBhIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7RW5jb2Rlcn0gZW5jb2RlciAoT3B0aW9uYWwpIFRoZSBlbmNvZGluZyBzdHJhdGVneSB0byB1c2UuIERlZmF1bHQ6IENyeXB0b0pTLmVuYy5IZXhcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHN0cmluZ2lmaWVkIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkgKyAnJztcblx0ICAgICAgICAgKiAgICAgdmFyIHN0cmluZyA9IHdvcmRBcnJheS50b1N0cmluZygpO1xuXHQgICAgICAgICAqICAgICB2YXIgc3RyaW5nID0gd29yZEFycmF5LnRvU3RyaW5nKENyeXB0b0pTLmVuYy5VdGY4KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24gKGVuY29kZXIpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIChlbmNvZGVyIHx8IEhleCkuc3RyaW5naWZ5KHRoaXMpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb25jYXRlbmF0ZXMgYSB3b3JkIGFycmF5IHRvIHRoaXMgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkgdG8gYXBwZW5kLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHdvcmRBcnJheTEuY29uY2F0KHdvcmRBcnJheTIpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIHRoaXNXb3JkcyA9IHRoaXMud29yZHM7XG5cdCAgICAgICAgICAgIHZhciB0aGF0V29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG5cdCAgICAgICAgICAgIHZhciB0aGlzU2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXHQgICAgICAgICAgICB2YXIgdGhhdFNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENsYW1wIGV4Y2VzcyBiaXRzXG5cdCAgICAgICAgICAgIHRoaXMuY2xhbXAoKTtcblxuXHQgICAgICAgICAgICAvLyBDb25jYXRcblx0ICAgICAgICAgICAgaWYgKHRoaXNTaWdCeXRlcyAlIDQpIHtcblx0ICAgICAgICAgICAgICAgIC8vIENvcHkgb25lIGJ5dGUgYXQgYSB0aW1lXG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoYXRTaWdCeXRlczsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXRCeXRlID0gKHRoYXRXb3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpc1dvcmRzWyh0aGlzU2lnQnl0ZXMgKyBpKSA+Pj4gMl0gfD0gdGhhdEJ5dGUgPDwgKDI0IC0gKCh0aGlzU2lnQnl0ZXMgKyBpKSAlIDQpICogOCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAvLyBDb3B5IG9uZSB3b3JkIGF0IGEgdGltZVxuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGF0U2lnQnl0ZXM7IGogKz0gNCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXNXb3Jkc1sodGhpc1NpZ0J5dGVzICsgaikgPj4+IDJdID0gdGhhdFdvcmRzW2ogPj4+IDJdO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgKz0gdGhhdFNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENoYWluYWJsZVxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUmVtb3ZlcyBpbnNpZ25pZmljYW50IGJpdHMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHdvcmRBcnJheS5jbGFtcCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNsYW1wOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSB0aGlzLndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgc2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENsYW1wXG5cdCAgICAgICAgICAgIHdvcmRzW3NpZ0J5dGVzID4+PiAyXSAmPSAweGZmZmZmZmZmIDw8ICgzMiAtIChzaWdCeXRlcyAlIDQpICogOCk7XG5cdCAgICAgICAgICAgIHdvcmRzLmxlbmd0aCA9IE1hdGguY2VpbChzaWdCeXRlcyAvIDQpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gd29yZEFycmF5LmNsb25lKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdmFyIGNsb25lID0gQmFzZS5jbG9uZS5jYWxsKHRoaXMpO1xuXHQgICAgICAgICAgICBjbG9uZS53b3JkcyA9IHRoaXMud29yZHMuc2xpY2UoMCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgd29yZCBhcnJheSBmaWxsZWQgd2l0aCByYW5kb20gYnl0ZXMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbkJ5dGVzIFRoZSBudW1iZXIgb2YgcmFuZG9tIGJ5dGVzIHRvIGdlbmVyYXRlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgcmFuZG9tIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LnJhbmRvbSgxNik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcmFuZG9tOiBmdW5jdGlvbiAobkJ5dGVzKSB7XG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbkJ5dGVzOyBpICs9IDQpIHtcblx0ICAgICAgICAgICAgICAgIHdvcmRzLnB1c2goY3J5cHRvU2VjdXJlUmFuZG9tSW50KCkpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgbkJ5dGVzKTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBFbmNvZGVyIG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIENfZW5jID0gQy5lbmMgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBIZXggZW5jb2Rpbmcgc3RyYXRlZ3kuXG5cdCAgICAgKi9cblx0ICAgIHZhciBIZXggPSBDX2VuYy5IZXggPSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgaGV4IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBoZXggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGV4U3RyaW5nID0gQ3J5cHRvSlMuZW5jLkhleC5zdHJpbmdpZnkod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IHdvcmRBcnJheS53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIHNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENvbnZlcnRcblx0ICAgICAgICAgICAgdmFyIGhleENoYXJzID0gW107XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2lnQnl0ZXM7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgdmFyIGJpdGUgPSAod29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuXHQgICAgICAgICAgICAgICAgaGV4Q2hhcnMucHVzaCgoYml0ZSA+Pj4gNCkudG9TdHJpbmcoMTYpKTtcblx0ICAgICAgICAgICAgICAgIGhleENoYXJzLnB1c2goKGJpdGUgJiAweDBmKS50b1N0cmluZygxNikpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhleENoYXJzLmpvaW4oJycpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIGhleCBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0ciBUaGUgaGV4IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5lbmMuSGV4LnBhcnNlKGhleFN0cmluZyk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIChoZXhTdHIpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRcblx0ICAgICAgICAgICAgdmFyIGhleFN0ckxlbmd0aCA9IGhleFN0ci5sZW5ndGg7XG5cblx0ICAgICAgICAgICAgLy8gQ29udmVydFxuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSBbXTtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZXhTdHJMZW5ndGg7IGkgKz0gMikge1xuXHQgICAgICAgICAgICAgICAgd29yZHNbaSA+Pj4gM10gfD0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cihpLCAyKSwgMTYpIDw8ICgyNCAtIChpICUgOCkgKiA0KTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQod29yZHMsIGhleFN0ckxlbmd0aCAvIDIpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogTGF0aW4xIGVuY29kaW5nIHN0cmF0ZWd5LlxuXHQgICAgICovXG5cdCAgICB2YXIgTGF0aW4xID0gQ19lbmMuTGF0aW4xID0ge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIExhdGluMSBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgTGF0aW4xIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGxhdGluMVN0cmluZyA9IENyeXB0b0pTLmVuYy5MYXRpbjEuc3RyaW5naWZ5KHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG5cdCAgICAgICAgICAgIHZhciBzaWdCeXRlcyA9IHdvcmRBcnJheS5zaWdCeXRlcztcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciBsYXRpbjFDaGFycyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpZ0J5dGVzOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHZhciBiaXRlID0gKHdvcmRzW2kgPj4+IDJdID4+PiAoMjQgLSAoaSAlIDQpICogOCkpICYgMHhmZjtcblx0ICAgICAgICAgICAgICAgIGxhdGluMUNoYXJzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShiaXRlKSk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbGF0aW4xQ2hhcnMuam9pbignJyk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgTGF0aW4xIHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0aW4xU3RyIFRoZSBMYXRpbjEgc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5MYXRpbjEucGFyc2UobGF0aW4xU3RyaW5nKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBwYXJzZTogZnVuY3Rpb24gKGxhdGluMVN0cikge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dFxuXHQgICAgICAgICAgICB2YXIgbGF0aW4xU3RyTGVuZ3RoID0gbGF0aW4xU3RyLmxlbmd0aDtcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhdGluMVN0ckxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB3b3Jkc1tpID4+PiAyXSB8PSAobGF0aW4xU3RyLmNoYXJDb2RlQXQoaSkgJiAweGZmKSA8PCAoMjQgLSAoaSAlIDQpICogOCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHdvcmRzLCBsYXRpbjFTdHJMZW5ndGgpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogVVRGLTggZW5jb2Rpbmcgc3RyYXRlZ3kuXG5cdCAgICAgKi9cblx0ICAgIHZhciBVdGY4ID0gQ19lbmMuVXRmOCA9IHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIHdvcmQgYXJyYXkgdG8gYSBVVEYtOCBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgVVRGLTggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgdXRmOFN0cmluZyA9IENyeXB0b0pTLmVuYy5VdGY4LnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoTGF0aW4xLnN0cmluZ2lmeSh3b3JkQXJyYXkpKSk7XG5cdCAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWFsZm9ybWVkIFVURi04IGRhdGEnKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIFVURi04IHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXRmOFN0ciBUaGUgVVRGLTggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5VdGY4LnBhcnNlKHV0ZjhTdHJpbmcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodXRmOFN0cikge1xuXHQgICAgICAgICAgICByZXR1cm4gTGF0aW4xLnBhcnNlKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudCh1dGY4U3RyKSkpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogQWJzdHJhY3QgYnVmZmVyZWQgYmxvY2sgYWxnb3JpdGhtIHRlbXBsYXRlLlxuXHQgICAgICpcblx0ICAgICAqIFRoZSBwcm9wZXJ0eSBibG9ja1NpemUgbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBhIGNvbmNyZXRlIHN1YnR5cGUuXG5cdCAgICAgKlxuXHQgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IF9taW5CdWZmZXJTaXplIFRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgc2hvdWxkIGJlIGtlcHQgdW5wcm9jZXNzZWQgaW4gdGhlIGJ1ZmZlci4gRGVmYXVsdDogMFxuXHQgICAgICovXG5cdCAgICB2YXIgQnVmZmVyZWRCbG9ja0FsZ29yaXRobSA9IENfbGliLkJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0gPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUmVzZXRzIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgZGF0YSBidWZmZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBJbml0aWFsIHZhbHVlc1xuXHQgICAgICAgICAgICB0aGlzLl9kYXRhID0gbmV3IFdvcmRBcnJheS5pbml0KCk7XG5cdCAgICAgICAgICAgIHRoaXMuX25EYXRhQnl0ZXMgPSAwO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBBZGRzIG5ldyBkYXRhIHRvIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgYnVmZmVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGFwcGVuZC4gU3RyaW5ncyBhcmUgY29udmVydGVkIHRvIGEgV29yZEFycmF5IHVzaW5nIFVURi04LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9hcHBlbmQoJ2RhdGEnKTtcblx0ICAgICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fYXBwZW5kKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX2FwcGVuZDogZnVuY3Rpb24gKGRhdGEpIHtcblx0ICAgICAgICAgICAgLy8gQ29udmVydCBzdHJpbmcgdG8gV29yZEFycmF5LCBlbHNlIGFzc3VtZSBXb3JkQXJyYXkgYWxyZWFkeVxuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcblx0ICAgICAgICAgICAgICAgIGRhdGEgPSBVdGY4LnBhcnNlKGRhdGEpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gQXBwZW5kXG5cdCAgICAgICAgICAgIHRoaXMuX2RhdGEuY29uY2F0KGRhdGEpO1xuXHQgICAgICAgICAgICB0aGlzLl9uRGF0YUJ5dGVzICs9IGRhdGEuc2lnQnl0ZXM7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFByb2Nlc3NlcyBhdmFpbGFibGUgZGF0YSBibG9ja3MuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBUaGlzIG1ldGhvZCBpbnZva2VzIF9kb1Byb2Nlc3NCbG9jayhvZmZzZXQpLCB3aGljaCBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IGEgY29uY3JldGUgc3VidHlwZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZG9GbHVzaCBXaGV0aGVyIGFsbCBibG9ja3MgYW5kIHBhcnRpYWwgYmxvY2tzIHNob3VsZCBiZSBwcm9jZXNzZWQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBwcm9jZXNzZWQgZGF0YS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHByb2Nlc3NlZERhdGEgPSBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9wcm9jZXNzKCk7XG5cdCAgICAgICAgICogICAgIHZhciBwcm9jZXNzZWREYXRhID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fcHJvY2VzcyghISdmbHVzaCcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIF9wcm9jZXNzOiBmdW5jdGlvbiAoZG9GbHVzaCkge1xuXHQgICAgICAgICAgICB2YXIgcHJvY2Vzc2VkV29yZHM7XG5cblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcblx0ICAgICAgICAgICAgdmFyIGRhdGFXb3JkcyA9IGRhdGEud29yZHM7XG5cdCAgICAgICAgICAgIHZhciBkYXRhU2lnQnl0ZXMgPSBkYXRhLnNpZ0J5dGVzO1xuXHQgICAgICAgICAgICB2YXIgYmxvY2tTaXplID0gdGhpcy5ibG9ja1NpemU7XG5cdCAgICAgICAgICAgIHZhciBibG9ja1NpemVCeXRlcyA9IGJsb2NrU2l6ZSAqIDQ7XG5cblx0ICAgICAgICAgICAgLy8gQ291bnQgYmxvY2tzIHJlYWR5XG5cdCAgICAgICAgICAgIHZhciBuQmxvY2tzUmVhZHkgPSBkYXRhU2lnQnl0ZXMgLyBibG9ja1NpemVCeXRlcztcblx0ICAgICAgICAgICAgaWYgKGRvRmx1c2gpIHtcblx0ICAgICAgICAgICAgICAgIC8vIFJvdW5kIHVwIHRvIGluY2x1ZGUgcGFydGlhbCBibG9ja3Ncblx0ICAgICAgICAgICAgICAgIG5CbG9ja3NSZWFkeSA9IE1hdGguY2VpbChuQmxvY2tzUmVhZHkpO1xuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgLy8gUm91bmQgZG93biB0byBpbmNsdWRlIG9ubHkgZnVsbCBibG9ja3MsXG5cdCAgICAgICAgICAgICAgICAvLyBsZXNzIHRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgbXVzdCByZW1haW4gaW4gdGhlIGJ1ZmZlclxuXHQgICAgICAgICAgICAgICAgbkJsb2Nrc1JlYWR5ID0gTWF0aC5tYXgoKG5CbG9ja3NSZWFkeSB8IDApIC0gdGhpcy5fbWluQnVmZmVyU2l6ZSwgMCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBDb3VudCB3b3JkcyByZWFkeVxuXHQgICAgICAgICAgICB2YXIgbldvcmRzUmVhZHkgPSBuQmxvY2tzUmVhZHkgKiBibG9ja1NpemU7XG5cblx0ICAgICAgICAgICAgLy8gQ291bnQgYnl0ZXMgcmVhZHlcblx0ICAgICAgICAgICAgdmFyIG5CeXRlc1JlYWR5ID0gTWF0aC5taW4obldvcmRzUmVhZHkgKiA0LCBkYXRhU2lnQnl0ZXMpO1xuXG5cdCAgICAgICAgICAgIC8vIFByb2Nlc3MgYmxvY2tzXG5cdCAgICAgICAgICAgIGlmIChuV29yZHNSZWFkeSkge1xuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgbldvcmRzUmVhZHk7IG9mZnNldCArPSBibG9ja1NpemUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWFsZ29yaXRobSBsb2dpY1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RvUHJvY2Vzc0Jsb2NrKGRhdGFXb3Jkcywgb2Zmc2V0KTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHByb2Nlc3NlZCB3b3Jkc1xuXHQgICAgICAgICAgICAgICAgcHJvY2Vzc2VkV29yZHMgPSBkYXRhV29yZHMuc3BsaWNlKDAsIG5Xb3Jkc1JlYWR5KTtcblx0ICAgICAgICAgICAgICAgIGRhdGEuc2lnQnl0ZXMgLT0gbkJ5dGVzUmVhZHk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBSZXR1cm4gcHJvY2Vzc2VkIHdvcmRzXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQocHJvY2Vzc2VkV29yZHMsIG5CeXRlc1JlYWR5KTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyBvYmplY3QuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5jbG9uZSgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIHZhciBjbG9uZSA9IEJhc2UuY2xvbmUuY2FsbCh0aGlzKTtcblx0ICAgICAgICAgICAgY2xvbmUuX2RhdGEgPSB0aGlzLl9kYXRhLmNsb25lKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBfbWluQnVmZmVyU2l6ZTogMFxuXHQgICAgfSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogQWJzdHJhY3QgaGFzaGVyIHRlbXBsYXRlLlxuXHQgICAgICpcblx0ICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBibG9ja1NpemUgVGhlIG51bWJlciBvZiAzMi1iaXQgd29yZHMgdGhpcyBoYXNoZXIgb3BlcmF0ZXMgb24uIERlZmF1bHQ6IDE2ICg1MTIgYml0cylcblx0ICAgICAqL1xuXHQgICAgdmFyIEhhc2hlciA9IENfbGliLkhhc2hlciA9IEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uZXh0ZW5kKHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb25maWd1cmF0aW9uIG9wdGlvbnMuXG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2ZnOiBCYXNlLmV4dGVuZCgpLFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIGhhc2hlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjZmcgKE9wdGlvbmFsKSBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHVzZSBmb3IgdGhpcyBoYXNoIGNvbXB1dGF0aW9uLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGFzaGVyID0gQ3J5cHRvSlMuYWxnby5TSEEyNTYuY3JlYXRlKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgaW5pdDogZnVuY3Rpb24gKGNmZykge1xuXHQgICAgICAgICAgICAvLyBBcHBseSBjb25maWcgZGVmYXVsdHNcblx0ICAgICAgICAgICAgdGhpcy5jZmcgPSB0aGlzLmNmZy5leHRlbmQoY2ZnKTtcblxuXHQgICAgICAgICAgICAvLyBTZXQgaW5pdGlhbCB2YWx1ZXNcblx0ICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBSZXNldHMgdGhpcyBoYXNoZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGhhc2hlci5yZXNldCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIFJlc2V0IGRhdGEgYnVmZmVyXG5cdCAgICAgICAgICAgIEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQuY2FsbCh0aGlzKTtcblxuXHQgICAgICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWhhc2hlciBsb2dpY1xuXHQgICAgICAgICAgICB0aGlzLl9kb1Jlc2V0KCk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFVwZGF0ZXMgdGhpcyBoYXNoZXIgd2l0aCBhIG1lc3NhZ2UuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgVGhlIG1lc3NhZ2UgdG8gYXBwZW5kLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7SGFzaGVyfSBUaGlzIGhhc2hlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgaGFzaGVyLnVwZGF0ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICBoYXNoZXIudXBkYXRlKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAvLyBBcHBlbmRcblx0ICAgICAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXG5cdCAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgaGFzaFxuXHQgICAgICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cblx0ICAgICAgICAgICAgLy8gQ2hhaW5hYmxlXG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBGaW5hbGl6ZXMgdGhlIGhhc2ggY29tcHV0YXRpb24uXG5cdCAgICAgICAgICogTm90ZSB0aGF0IHRoZSBmaW5hbGl6ZSBvcGVyYXRpb24gaXMgZWZmZWN0aXZlbHkgYSBkZXN0cnVjdGl2ZSwgcmVhZC1vbmNlIG9wZXJhdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSAoT3B0aW9uYWwpIEEgZmluYWwgbWVzc2FnZSB1cGRhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgpO1xuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGZpbmFsaXplOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAvLyBGaW5hbCBtZXNzYWdlIHVwZGF0ZVxuXHQgICAgICAgICAgICBpZiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1oYXNoZXIgbG9naWNcblx0ICAgICAgICAgICAgdmFyIGhhc2ggPSB0aGlzLl9kb0ZpbmFsaXplKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhhc2g7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIGJsb2NrU2l6ZTogNTEyLzMyLFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIHNob3J0Y3V0IGZ1bmN0aW9uIHRvIGEgaGFzaGVyJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7SGFzaGVyfSBoYXNoZXIgVGhlIGhhc2hlciB0byBjcmVhdGUgYSBoZWxwZXIgZm9yLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIFNIQTI1NiA9IENyeXB0b0pTLmxpYi5IYXNoZXIuX2NyZWF0ZUhlbHBlcihDcnlwdG9KUy5hbGdvLlNIQTI1Nik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX2NyZWF0ZUhlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGNmZykge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBoYXNoZXIuaW5pdChjZmcpLmZpbmFsaXplKG1lc3NhZ2UpO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgc2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtIYXNoZXJ9IGhhc2hlciBUaGUgaGFzaGVyIHRvIHVzZSBpbiB0aGlzIEhNQUMgaGVscGVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIEhtYWNTSEEyNTYgPSBDcnlwdG9KUy5saWIuSGFzaGVyLl9jcmVhdGVIbWFjSGVscGVyKENyeXB0b0pTLmFsZ28uU0hBMjU2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBfY3JlYXRlSG1hY0hlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGtleSkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDX2FsZ28uSE1BQy5pbml0KGhhc2hlciwga2V5KS5maW5hbGl6ZShtZXNzYWdlKTtcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBBbGdvcml0aG0gbmFtZXNwYWNlLlxuXHQgICAgICovXG5cdCAgICB2YXIgQ19hbGdvID0gQy5hbGdvID0ge307XG5cblx0ICAgIHJldHVybiBDO1xuXHR9KE1hdGgpKTtcblxuXG5cdHJldHVybiBDcnlwdG9KUztcblxufSkpOyIsIjsoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG5cdFx0Ly8gQ29tbW9uSlNcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCIuL2NvcmVcIikpO1xuXHR9XG5cdGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gQU1EXG5cdFx0ZGVmaW5lKFtcIi4vY29yZVwiXSwgZmFjdG9yeSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gR2xvYmFsIChicm93c2VyKVxuXHRcdGZhY3Rvcnkocm9vdC5DcnlwdG9KUyk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKENyeXB0b0pTKSB7XG5cblx0KGZ1bmN0aW9uIChNYXRoKSB7XG5cdCAgICAvLyBTaG9ydGN1dHNcblx0ICAgIHZhciBDID0gQ3J5cHRvSlM7XG5cdCAgICB2YXIgQ19saWIgPSBDLmxpYjtcblx0ICAgIHZhciBXb3JkQXJyYXkgPSBDX2xpYi5Xb3JkQXJyYXk7XG5cdCAgICB2YXIgSGFzaGVyID0gQ19saWIuSGFzaGVyO1xuXHQgICAgdmFyIENfYWxnbyA9IEMuYWxnbztcblxuXHQgICAgLy8gSW5pdGlhbGl6YXRpb24gYW5kIHJvdW5kIGNvbnN0YW50cyB0YWJsZXNcblx0ICAgIHZhciBIID0gW107XG5cdCAgICB2YXIgSyA9IFtdO1xuXG5cdCAgICAvLyBDb21wdXRlIGNvbnN0YW50c1xuXHQgICAgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBmdW5jdGlvbiBpc1ByaW1lKG4pIHtcblx0ICAgICAgICAgICAgdmFyIHNxcnROID0gTWF0aC5zcXJ0KG4pO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBmYWN0b3IgPSAyOyBmYWN0b3IgPD0gc3FydE47IGZhY3RvcisrKSB7XG5cdCAgICAgICAgICAgICAgICBpZiAoIShuICUgZmFjdG9yKSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGZ1bmN0aW9uIGdldEZyYWN0aW9uYWxCaXRzKG4pIHtcblx0ICAgICAgICAgICAgcmV0dXJuICgobiAtIChuIHwgMCkpICogMHgxMDAwMDAwMDApIHwgMDtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgbiA9IDI7XG5cdCAgICAgICAgdmFyIG5QcmltZSA9IDA7XG5cdCAgICAgICAgd2hpbGUgKG5QcmltZSA8IDY0KSB7XG5cdCAgICAgICAgICAgIGlmIChpc1ByaW1lKG4pKSB7XG5cdCAgICAgICAgICAgICAgICBpZiAoblByaW1lIDwgOCkge1xuXHQgICAgICAgICAgICAgICAgICAgIEhbblByaW1lXSA9IGdldEZyYWN0aW9uYWxCaXRzKE1hdGgucG93KG4sIDEgLyAyKSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBLW25QcmltZV0gPSBnZXRGcmFjdGlvbmFsQml0cyhNYXRoLnBvdyhuLCAxIC8gMykpO1xuXG5cdCAgICAgICAgICAgICAgICBuUHJpbWUrKztcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIG4rKztcblx0ICAgICAgICB9XG5cdCAgICB9KCkpO1xuXG5cdCAgICAvLyBSZXVzYWJsZSBvYmplY3Rcblx0ICAgIHZhciBXID0gW107XG5cblx0ICAgIC8qKlxuXHQgICAgICogU0hBLTI1NiBoYXNoIGFsZ29yaXRobS5cblx0ICAgICAqL1xuXHQgICAgdmFyIFNIQTI1NiA9IENfYWxnby5TSEEyNTYgPSBIYXNoZXIuZXh0ZW5kKHtcblx0ICAgICAgICBfZG9SZXNldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB0aGlzLl9oYXNoID0gbmV3IFdvcmRBcnJheS5pbml0KEguc2xpY2UoMCkpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBfZG9Qcm9jZXNzQmxvY2s6IGZ1bmN0aW9uIChNLCBvZmZzZXQpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRcblx0ICAgICAgICAgICAgdmFyIEggPSB0aGlzLl9oYXNoLndvcmRzO1xuXG5cdCAgICAgICAgICAgIC8vIFdvcmtpbmcgdmFyaWFibGVzXG5cdCAgICAgICAgICAgIHZhciBhID0gSFswXTtcblx0ICAgICAgICAgICAgdmFyIGIgPSBIWzFdO1xuXHQgICAgICAgICAgICB2YXIgYyA9IEhbMl07XG5cdCAgICAgICAgICAgIHZhciBkID0gSFszXTtcblx0ICAgICAgICAgICAgdmFyIGUgPSBIWzRdO1xuXHQgICAgICAgICAgICB2YXIgZiA9IEhbNV07XG5cdCAgICAgICAgICAgIHZhciBnID0gSFs2XTtcblx0ICAgICAgICAgICAgdmFyIGggPSBIWzddO1xuXG5cdCAgICAgICAgICAgIC8vIENvbXB1dGF0aW9uXG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgaWYgKGkgPCAxNikge1xuXHQgICAgICAgICAgICAgICAgICAgIFdbaV0gPSBNW29mZnNldCArIGldIHwgMDtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGdhbW1hMHggPSBXW2kgLSAxNV07XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGdhbW1hMCAgPSAoKGdhbW1hMHggPDwgMjUpIHwgKGdhbW1hMHggPj4+IDcpKSAgXlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChnYW1tYTB4IDw8IDE0KSB8IChnYW1tYTB4ID4+PiAxOCkpIF5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZ2FtbWEweCA+Pj4gMyk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZ2FtbWExeCA9IFdbaSAtIDJdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBnYW1tYTEgID0gKChnYW1tYTF4IDw8IDE1KSB8IChnYW1tYTF4ID4+PiAxNykpIF5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoZ2FtbWExeCA8PCAxMykgfCAoZ2FtbWExeCA+Pj4gMTkpKSBeXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGdhbW1hMXggPj4+IDEwKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIFdbaV0gPSBnYW1tYTAgKyBXW2kgLSA3XSArIGdhbW1hMSArIFdbaSAtIDE2XTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgdmFyIGNoICA9IChlICYgZikgXiAofmUgJiBnKTtcblx0ICAgICAgICAgICAgICAgIHZhciBtYWogPSAoYSAmIGIpIF4gKGEgJiBjKSBeIChiICYgYyk7XG5cblx0ICAgICAgICAgICAgICAgIHZhciBzaWdtYTAgPSAoKGEgPDwgMzApIHwgKGEgPj4+IDIpKSBeICgoYSA8PCAxOSkgfCAoYSA+Pj4gMTMpKSBeICgoYSA8PCAxMCkgfCAoYSA+Pj4gMjIpKTtcblx0ICAgICAgICAgICAgICAgIHZhciBzaWdtYTEgPSAoKGUgPDwgMjYpIHwgKGUgPj4+IDYpKSBeICgoZSA8PCAyMSkgfCAoZSA+Pj4gMTEpKSBeICgoZSA8PCA3KSAgfCAoZSA+Pj4gMjUpKTtcblxuXHQgICAgICAgICAgICAgICAgdmFyIHQxID0gaCArIHNpZ21hMSArIGNoICsgS1tpXSArIFdbaV07XG5cdCAgICAgICAgICAgICAgICB2YXIgdDIgPSBzaWdtYTAgKyBtYWo7XG5cblx0ICAgICAgICAgICAgICAgIGggPSBnO1xuXHQgICAgICAgICAgICAgICAgZyA9IGY7XG5cdCAgICAgICAgICAgICAgICBmID0gZTtcblx0ICAgICAgICAgICAgICAgIGUgPSAoZCArIHQxKSB8IDA7XG5cdCAgICAgICAgICAgICAgICBkID0gYztcblx0ICAgICAgICAgICAgICAgIGMgPSBiO1xuXHQgICAgICAgICAgICAgICAgYiA9IGE7XG5cdCAgICAgICAgICAgICAgICBhID0gKHQxICsgdDIpIHwgMDtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIEludGVybWVkaWF0ZSBoYXNoIHZhbHVlXG5cdCAgICAgICAgICAgIEhbMF0gPSAoSFswXSArIGEpIHwgMDtcblx0ICAgICAgICAgICAgSFsxXSA9IChIWzFdICsgYikgfCAwO1xuXHQgICAgICAgICAgICBIWzJdID0gKEhbMl0gKyBjKSB8IDA7XG5cdCAgICAgICAgICAgIEhbM10gPSAoSFszXSArIGQpIHwgMDtcblx0ICAgICAgICAgICAgSFs0XSA9IChIWzRdICsgZSkgfCAwO1xuXHQgICAgICAgICAgICBIWzVdID0gKEhbNV0gKyBmKSB8IDA7XG5cdCAgICAgICAgICAgIEhbNl0gPSAoSFs2XSArIGcpIHwgMDtcblx0ICAgICAgICAgICAgSFs3XSA9IChIWzddICsgaCkgfCAwO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBfZG9GaW5hbGl6ZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuXHQgICAgICAgICAgICB2YXIgZGF0YVdvcmRzID0gZGF0YS53b3JkcztcblxuXHQgICAgICAgICAgICB2YXIgbkJpdHNUb3RhbCA9IHRoaXMuX25EYXRhQnl0ZXMgKiA4O1xuXHQgICAgICAgICAgICB2YXIgbkJpdHNMZWZ0ID0gZGF0YS5zaWdCeXRlcyAqIDg7XG5cblx0ICAgICAgICAgICAgLy8gQWRkIHBhZGRpbmdcblx0ICAgICAgICAgICAgZGF0YVdvcmRzW25CaXRzTGVmdCA+Pj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBuQml0c0xlZnQgJSAzMik7XG5cdCAgICAgICAgICAgIGRhdGFXb3Jkc1soKChuQml0c0xlZnQgKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gTWF0aC5mbG9vcihuQml0c1RvdGFsIC8gMHgxMDAwMDAwMDApO1xuXHQgICAgICAgICAgICBkYXRhV29yZHNbKCgobkJpdHNMZWZ0ICsgNjQpID4+PiA5KSA8PCA0KSArIDE1XSA9IG5CaXRzVG90YWw7XG5cdCAgICAgICAgICAgIGRhdGEuc2lnQnl0ZXMgPSBkYXRhV29yZHMubGVuZ3RoICogNDtcblxuXHQgICAgICAgICAgICAvLyBIYXNoIGZpbmFsIGJsb2Nrc1xuXHQgICAgICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cblx0ICAgICAgICAgICAgLy8gUmV0dXJuIGZpbmFsIGNvbXB1dGVkIGhhc2hcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhc2g7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIHZhciBjbG9uZSA9IEhhc2hlci5jbG9uZS5jYWxsKHRoaXMpO1xuXHQgICAgICAgICAgICBjbG9uZS5faGFzaCA9IHRoaXMuX2hhc2guY2xvbmUoKTtcblxuXHQgICAgICAgICAgICByZXR1cm4gY2xvbmU7XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogU2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIGhhc2hlcidzIG9iamVjdCBpbnRlcmZhY2UuXG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIGhhc2guXG5cdCAgICAgKlxuXHQgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgaGFzaC5cblx0ICAgICAqXG5cdCAgICAgKiBAc3RhdGljXG5cdCAgICAgKlxuXHQgICAgICogQGV4YW1wbGVcblx0ICAgICAqXG5cdCAgICAgKiAgICAgdmFyIGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYoJ21lc3NhZ2UnKTtcblx0ICAgICAqICAgICB2YXIgaGFzaCA9IENyeXB0b0pTLlNIQTI1Nih3b3JkQXJyYXkpO1xuXHQgICAgICovXG5cdCAgICBDLlNIQTI1NiA9IEhhc2hlci5fY3JlYXRlSGVscGVyKFNIQTI1Nik7XG5cblx0ICAgIC8qKlxuXHQgICAgICogU2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBoYXNoLlxuXHQgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBrZXkgVGhlIHNlY3JldCBrZXkuXG5cdCAgICAgKlxuXHQgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgSE1BQy5cblx0ICAgICAqXG5cdCAgICAgKiBAc3RhdGljXG5cdCAgICAgKlxuXHQgICAgICogQGV4YW1wbGVcblx0ICAgICAqXG5cdCAgICAgKiAgICAgdmFyIGhtYWMgPSBDcnlwdG9KUy5IbWFjU0hBMjU2KG1lc3NhZ2UsIGtleSk7XG5cdCAgICAgKi9cblx0ICAgIEMuSG1hY1NIQTI1NiA9IEhhc2hlci5fY3JlYXRlSG1hY0hlbHBlcihTSEEyNTYpO1xuXHR9KE1hdGgpKTtcblxuXG5cdHJldHVybiBDcnlwdG9KUy5TSEEyNTY7XG5cbn0pKTsiLCJpbXBvcnQgVHJlZU1vZGVsIGZyb20gJ3RyZWUtbW9kZWwnO1xuaW1wb3J0IHtcbiAgY2xvbmVEZWVwLFxuICBmbGF0dGVuRGVwdGgsXG4gIGNsb25lLFxuICBzdW0sXG4gIGZpbHRlcixcbiAgZmluZExhc3RJbmRleCxcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7U2dmTm9kZSwgU2dmTm9kZU9wdGlvbnN9IGZyb20gJy4vY29yZS90eXBlcyc7XG5pbXBvcnQge0ExX0xFVFRFUlMsIEExX05VTUJFUlMsIFNHRl9MRVRURVJTfSBmcm9tICcuL2NvbnN0JztcbmltcG9ydCB7XG4gIFNldHVwUHJvcCxcbiAgTW92ZVByb3AsXG4gIEN1c3RvbVByb3AsXG4gIFNnZlByb3BCYXNlLFxuICBOb2RlQW5ub3RhdGlvblByb3AsXG59IGZyb20gJy4vY29yZS9wcm9wcyc7XG5pbXBvcnQge1xuICBBbmFseXNpcyxcbiAgR2hvc3RCYW5PcHRpb25zLFxuICBLaSxcbiAgTW92ZUluZm8sXG4gIFByb2JsZW1BbnN3ZXJUeXBlIGFzIFBBVCxcbiAgUm9vdEluZm8sXG59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHNoYTI1NiBmcm9tICdjcnlwdG8tanMvc2hhMjU2JztcblxuaW1wb3J0IHtDZW50ZXJ9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgY2FsY0RvdWJ0ZnVsTW92ZXNUaHJlc2hvbGRSYW5nZSA9ICh0aHJlc2hvbGQ6IG51bWJlcikgPT4ge1xuICAvLyA4RC05RFxuICBpZiAodGhyZXNob2xkID49IDI1KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMTVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTNdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjE1LCAtMC4xXSwgc2NvcmVSYW5nZTogWy0zLCAtMl19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy0yLCAtMV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTEsIC0wLjVdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDVELTdEXG4gIGlmICh0aHJlc2hvbGQgPj0gMjMgJiYgdGhyZXNob2xkIDwgMjUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC4yXSwgc2NvcmVSYW5nZTogWy0xMDAsIC04XX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4yLCAtMC4xNV0sIHNjb3JlUmFuZ2U6IFstOCwgLTRdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xNSwgLTAuMDVdLCBzY29yZVJhbmdlOiBbLTQsIC0yXX0sXG4gICAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjA1LCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMiwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG5cbiAgLy8gM0QtNURcbiAgaWYgKHRocmVzaG9sZCA+PSAyMCAmJiB0aHJlc2hvbGQgPCAyMykge1xuICAgIHJldHVybiB7XG4gICAgICBldmlsOiB7d2lucmF0ZVJhbmdlOiBbLTEsIC0wLjI1XSwgc2NvcmVSYW5nZTogWy0xMDAsIC0xMl19LFxuICAgICAgYmFkOiB7d2lucmF0ZVJhbmdlOiBbLTAuMjUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTEyLCAtNV19LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy01LCAtMl19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTIsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyAxRC0zRFxuICBpZiAodGhyZXNob2xkID49IDE4ICYmIHRocmVzaG9sZCA8IDIwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuM10sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMTVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjMsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTE1LCAtN119LFxuICAgICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjA1XSwgc2NvcmVSYW5nZTogWy03LCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wNSwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1Sy0xS1xuICBpZiAodGhyZXNob2xkID49IDEzICYmIHRocmVzaG9sZCA8IDE4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuMzVdLCBzY29yZVJhbmdlOiBbLTEwMCwgLTIwXX0sXG4gICAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zNSwgLTAuMTJdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICAgIHBvb3I6IHt3aW5yYXRlUmFuZ2U6IFstMC4xMiwgLTAuMDhdLCBzY29yZVJhbmdlOiBbLTEwLCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4wOCwgLTAuMDJdLCBzY29yZVJhbmdlOiBbLTUsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICAvLyA1Sy0xMEtcbiAgaWYgKHRocmVzaG9sZCA+PSA4ICYmIHRocmVzaG9sZCA8IDEzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuNF0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMjVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjQsIC0wLjE1XSwgc2NvcmVSYW5nZTogWy0yNSwgLTEwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMTUsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTEwLCAtNV19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstNSwgLTFdfSxcbiAgICAgIGdvb2Q6IHt3aW5yYXRlUmFuZ2U6IFstMC4wMiwgMF0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICAgIGdyZWF0OiB7d2lucmF0ZVJhbmdlOiBbMCwgMV0sIHNjb3JlUmFuZ2U6IFswLCAxMDBdfSxcbiAgICB9O1xuICB9XG4gIC8vIDE4Sy0xMEtcbiAgaWYgKHRocmVzaG9sZCA+PSAwICYmIHRocmVzaG9sZCA8IDgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXZpbDoge3dpbnJhdGVSYW5nZTogWy0xLCAtMC40NV0sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMzVdfSxcbiAgICAgIGJhZDoge3dpbnJhdGVSYW5nZTogWy0wLjQ1LCAtMC4yXSwgc2NvcmVSYW5nZTogWy0zNSwgLTIwXX0sXG4gICAgICBwb29yOiB7d2lucmF0ZVJhbmdlOiBbLTAuMiwgLTAuMV0sIHNjb3JlUmFuZ2U6IFstMjAsIC0xMF19LFxuICAgICAgb2s6IHt3aW5yYXRlUmFuZ2U6IFstMC4xLCAtMC4wMl0sIHNjb3JlUmFuZ2U6IFstMTAsIC0xXX0sXG4gICAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgICBncmVhdDoge3dpbnJhdGVSYW5nZTogWzAsIDFdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGV2aWw6IHt3aW5yYXRlUmFuZ2U6IFstMSwgLTAuM10sIHNjb3JlUmFuZ2U6IFstMTAwLCAtMzBdfSxcbiAgICBiYWQ6IHt3aW5yYXRlUmFuZ2U6IFstMC4zLCAtMC4yXSwgc2NvcmVSYW5nZTogWy0zMCwgLTIwXX0sXG4gICAgcG9vcjoge3dpbnJhdGVSYW5nZTogWy0wLjIsIC0wLjFdLCBzY29yZVJhbmdlOiBbLTIwLCAtMTBdfSxcbiAgICBvazoge3dpbnJhdGVSYW5nZTogWy0wLjEsIC0wLjAyXSwgc2NvcmVSYW5nZTogWy0xMCwgLTFdfSxcbiAgICBnb29kOiB7d2lucmF0ZVJhbmdlOiBbLTAuMDIsIDBdLCBzY29yZVJhbmdlOiBbMCwgMTAwXX0sXG4gICAgZ3JlYXQ6IHt3aW5yYXRlUmFuZ2U6IFswLCAxXSwgc2NvcmVSYW5nZTogWzAsIDEwMF19LFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kMiA9ICh2OiBudW1iZXIsIHNjYWxlID0gMSwgZml4ZWQgPSAyKSA9PiB7XG4gIHJldHVybiAoKE1hdGgucm91bmQodiAqIDEwMCkgLyAxMDApICogc2NhbGUpLnRvRml4ZWQoZml4ZWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kMyA9ICh2OiBudW1iZXIsIHNjYWxlID0gMSwgZml4ZWQgPSAzKSA9PiB7XG4gIHJldHVybiAoKE1hdGgucm91bmQodiAqIDEwMDApIC8gMTAwMCkgKiBzY2FsZSkudG9GaXhlZChmaXhlZCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RGVkdXBsaWNhdGVkUHJvcHMgPSAodGFyZ2V0UHJvcHM6IFNnZlByb3BCYXNlW10pID0+IHtcbiAgcmV0dXJuIGZpbHRlcihcbiAgICB0YXJnZXRQcm9wcyxcbiAgICAocHJvcDogU2dmUHJvcEJhc2UsIGluZGV4OiBudW1iZXIpID0+XG4gICAgICBpbmRleCA9PT1cbiAgICAgIGZpbmRMYXN0SW5kZXgoXG4gICAgICAgIHRhcmdldFByb3BzLFxuICAgICAgICAobGFzdFBybzogU2dmUHJvcEJhc2UpID0+XG4gICAgICAgICAgcHJvcC50b2tlbiA9PT0gbGFzdFByby50b2tlbiAmJiBwcm9wLnZhbHVlID09PSBsYXN0UHJvLnZhbHVlXG4gICAgICApXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNNb3ZlTm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICByZXR1cm4gbi5tb2RlbC5tb3ZlUHJvcHMubGVuZ3RoID4gMDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1Jvb05vZGUgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgcmV0dXJuIG4ubW9kZWwubW92ZVByb3BzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnQgY29uc3QgaXNTZXR1cE5vZGUgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgcmV0dXJuIG4ubW9kZWwuc2V0dXBQcm9wcy5sZW5ndGggPiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQW5zd2VyTm9kZSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiwga2luZDogUEFUKSA9PiB7XG4gIGNvbnN0IHBhaSA9IG4ubW9kZWwuY3VzdG9tUHJvcHM/LmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQUknKTtcbiAgY29uc3QgcGF0ID0gbi5tb2RlbC5jdXN0b21Qcm9wcz8uZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BBVCcpO1xuICBpZiAoIXBhaSAmJiAhcGF0KSByZXR1cm4gZmFsc2U7XG4gIGlmIChwYWkpIHtcbiAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShwYWkudmFsdWUpO1xuICAgIGNvbnN0IHBhaU1hcCA9IHtbUEFULlJpZ2h0XTogJ3InLCBbUEFULlZhcmlhbnRdOiAndicsIFtQQVQuV3JvbmddOiAndyd9O1xuICAgIHJldHVybiBkYXRhPy5raW5kID09PSBwYWlNYXBba2luZF07XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coJ3Z2dicsIHBhdC52YWx1ZSwga2luZCk7XG4gICAgcmV0dXJuIHBhdD8udmFsdWUgPT09IGtpbmQ7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlTnVtYmVyID0gKFxuICBuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPixcbiAgcGFyZW50PzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5cbikgPT4ge1xuICBjb25zdCBwYXRoID0gbi5nZXRQYXRoKCk7XG4gIGxldCBtb3Zlc0NvdW50ID0gcGF0aC5maWx0ZXIobiA9PiBpc01vdmVOb2RlKG4pKS5sZW5ndGg7XG4gIGlmIChwYXJlbnQpIHtcbiAgICBtb3Zlc0NvdW50ICs9IHBhcmVudC5nZXRQYXRoKCkuZmlsdGVyKG4gPT4gaXNNb3ZlTm9kZShuKSkubGVuZ3RoO1xuICB9XG4gIHJldHVybiBtb3Zlc0NvdW50O1xufTtcblxuZXhwb3J0IGNvbnN0IGNhbGNTSEEgPSAoXG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgbW92ZVByb3BzOiBhbnkgPSBbXSxcbiAgc2V0dXBQcm9wczogYW55ID0gW11cbikgPT4ge1xuICBsZXQgbm9kZVR5cGUgPSAncic7XG4gIGlmIChtb3ZlUHJvcHMubGVuZ3RoID4gMCkgbm9kZVR5cGUgPSAnbSc7XG4gIGlmIChzZXR1cFByb3BzLmxlbmd0aCA+IDApIG5vZGVUeXBlID0gJ3MnO1xuXG4gIGxldCBuID0gYCR7bm9kZVR5cGV9YDtcbiAgaWYgKG1vdmVQcm9wcy5sZW5ndGggPiAwKSBuICs9IGAke21vdmVQcm9wc1swXS50b2tlbn0ke21vdmVQcm9wc1swXS52YWx1ZX1gO1xuXG4gIGxldCBmdWxsbmFtZSA9IG47XG4gIGlmIChub2RlKSB7XG4gICAgZnVsbG5hbWUgPVxuICAgICAgbm9kZVxuICAgICAgICAuZ2V0UGF0aCgpXG4gICAgICAgIC5tYXAoKG46IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiBuLm1vZGVsLmlkKVxuICAgICAgICAuam9pbignPT4nKSArXG4gICAgICAnPT4nICtcbiAgICAgIG47XG4gIH1cblxuICBjb25zdCBzaGEgPSBzaGEyNTYoZnVsbG5hbWUpLnRvU3RyaW5nKCkuc2xpY2UoMCwgNik7XG4gIHJldHVybiBzaGE7XG59O1xuXG5leHBvcnQgY29uc3QgbkZvcm1hdHRlciA9IChudW06IG51bWJlciwgZml4ZWQgPSAxKSA9PiB7XG4gIGNvbnN0IGxvb2t1cCA9IFtcbiAgICB7dmFsdWU6IDEsIHN5bWJvbDogJyd9LFxuICAgIHt2YWx1ZTogMWUzLCBzeW1ib2w6ICdrJ30sXG4gICAge3ZhbHVlOiAxZTYsIHN5bWJvbDogJ00nfSxcbiAgICB7dmFsdWU6IDFlOSwgc3ltYm9sOiAnRyd9LFxuICAgIHt2YWx1ZTogMWUxMiwgc3ltYm9sOiAnVCd9LFxuICAgIHt2YWx1ZTogMWUxNSwgc3ltYm9sOiAnUCd9LFxuICAgIHt2YWx1ZTogMWUxOCwgc3ltYm9sOiAnRSd9LFxuICBdO1xuICBjb25zdCByeCA9IC9cXC4wKyR8KFxcLlswLTldKlsxLTldKTArJC87XG4gIGNvbnN0IGl0ZW0gPSBsb29rdXBcbiAgICAuc2xpY2UoKVxuICAgIC5yZXZlcnNlKClcbiAgICAuZmluZChpdGVtID0+IHtcbiAgICAgIHJldHVybiBudW0gPj0gaXRlbS52YWx1ZTtcbiAgICB9KTtcbiAgcmV0dXJuIGl0ZW1cbiAgICA/IChudW0gLyBpdGVtLnZhbHVlKS50b0ZpeGVkKGZpeGVkKS5yZXBsYWNlKHJ4LCAnJDEnKSArIGl0ZW0uc3ltYm9sXG4gICAgOiAnMCc7XG59O1xuXG5leHBvcnQgY29uc3QgcGF0aFRvSW5kZXhlcyA9IChwYXRoOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdKTogbnVtYmVyW10gPT4ge1xuICByZXR1cm4gcGF0aC5tYXAobiA9PiBuLm1vZGVsLmlkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9Jbml0aWFsU3RvbmVzID0gKFxuICBwYXRoOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdLFxuICB4T2Zmc2V0ID0gMCxcbiAgeU9mZnNldCA9IDBcbik6IHN0cmluZ1tdW10gPT4ge1xuICBjb25zdCBpbml0cyA9IHBhdGhcbiAgICAuZmlsdGVyKG4gPT4gbi5tb2RlbC5zZXR1cFByb3BzLmxlbmd0aCA+IDApXG4gICAgLm1hcChuID0+IHtcbiAgICAgIHJldHVybiBuLm1vZGVsLnNldHVwUHJvcHMubWFwKChzZXR1cDogU2V0dXBQcm9wKSA9PiB7XG4gICAgICAgIHJldHVybiBzZXR1cC52YWx1ZXMubWFwKCh2OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjb25zdCBhID0gQTFfTEVUVEVSU1tTR0ZfTEVUVEVSUy5pbmRleE9mKHZbMF0pICsgeE9mZnNldF07XG4gICAgICAgICAgY29uc3QgYiA9IEExX05VTUJFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZih2WzFdKSArIHlPZmZzZXRdO1xuICAgICAgICAgIGNvbnN0IHRva2VuID0gc2V0dXAudG9rZW4gPT09ICdBQicgPyAnQicgOiAnVyc7XG4gICAgICAgICAgcmV0dXJuIFt0b2tlbiwgYSArIGJdO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICByZXR1cm4gZmxhdHRlbkRlcHRoKGluaXRzWzBdLCAxKTtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXRoVG9BaU1vdmVzID0gKFxuICBwYXRoOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdLFxuICB4T2Zmc2V0ID0gMCxcbiAgeU9mZnNldCA9IDBcbikgPT4ge1xuICBjb25zdCBtb3ZlcyA9IHBhdGhcbiAgICAuZmlsdGVyKG4gPT4gbi5tb2RlbC5tb3ZlUHJvcHMubGVuZ3RoID4gMClcbiAgICAubWFwKG4gPT4ge1xuICAgICAgY29uc3QgcHJvcCA9IG4ubW9kZWwubW92ZVByb3BzWzBdO1xuICAgICAgY29uc3QgYSA9IEExX0xFVFRFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZihwcm9wLnZhbHVlWzBdKSArIHhPZmZzZXRdO1xuICAgICAgY29uc3QgYiA9IEExX05VTUJFUlNbU0dGX0xFVFRFUlMuaW5kZXhPZihwcm9wLnZhbHVlWzFdKSArIHlPZmZzZXRdO1xuICAgICAgcmV0dXJuIFtwcm9wLnRva2VuLCBhICsgYl07XG4gICAgfSk7XG4gIHJldHVybiBtb3Zlcztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEZyb21BbmFseXNpcyA9IChhOiBBbmFseXNpcykgPT4ge1xuICBpZiAoL2luZGV4ZXMvLnRlc3QoYS5pZCkpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShhLmlkKS5pbmRleGVzWzBdO1xuICB9XG4gIHJldHVybiAnJztcbn07XG5cbmV4cG9ydCBjb25zdCBpc01haW5QYXRoID0gKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIHJldHVybiBzdW0obm9kZS5nZXRQYXRoKCkubWFwKG4gPT4gbi5nZXRJbmRleCgpKSkgPT09IDA7XG59O1xuXG5leHBvcnQgY29uc3Qgc2dmVG9Qb3MgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qga2kgPSBzdHJbMF0gPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3QgdGVtcFN0ciA9IC9cXFsoLiopXFxdLy5leGVjKHN0cik7XG4gIGlmICh0ZW1wU3RyKSB7XG4gICAgY29uc3QgcG9zID0gdGVtcFN0clsxXTtcbiAgICBjb25zdCB4ID0gU0dGX0xFVFRFUlMuaW5kZXhPZihwb3NbMF0pO1xuICAgIGNvbnN0IHkgPSBTR0ZfTEVUVEVSUy5pbmRleE9mKHBvc1sxXSk7XG4gICAgcmV0dXJuIHt4LCB5LCBraX07XG4gIH1cbiAgcmV0dXJuIHt4OiAtMSwgeTogLTEsIGtpOiAwfTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZ2ZUb0ExID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHt4LCB5fSA9IHNnZlRvUG9zKHN0cik7XG4gIHJldHVybiBBMV9MRVRURVJTW3hdICsgQTFfTlVNQkVSU1t5XTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMVRvUG9zID0gKG1vdmU6IHN0cmluZykgPT4ge1xuICBjb25zdCB4ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pO1xuICBjb25zdCB5ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSk7XG4gIHJldHVybiB7eCwgeX07XG59O1xuXG5leHBvcnQgY29uc3QgYTFUb0luZGV4ID0gKG1vdmU6IHN0cmluZywgYm9hcmRTaXplID0gMTkpID0+IHtcbiAgY29uc3QgeCA9IEExX0xFVFRFUlMuaW5kZXhPZihtb3ZlWzBdKTtcbiAgY29uc3QgeSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChtb3ZlLnN1YnN0cigxKSwgMCkpO1xuICByZXR1cm4geCAqIGJvYXJkU2l6ZSArIHk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2dmT2Zmc2V0ID0gKHNnZjogYW55LCBvZmZzZXQgPSAwKSA9PiB7XG4gIGlmIChvZmZzZXQgPT09IDApIHJldHVybiBzZ2Y7XG4gIGNvbnN0IHJlcyA9IGNsb25lKHNnZik7XG4gIGNvbnN0IGNoYXJJbmRleCA9IFNHRl9MRVRURVJTLmluZGV4T2Yoc2dmWzJdKSAtIG9mZnNldDtcbiAgcmV0dXJuIHJlcy5zdWJzdHIoMCwgMikgKyBTR0ZfTEVUVEVSU1tjaGFySW5kZXhdICsgcmVzLnN1YnN0cigyICsgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgYTFUb1NHRiA9IChzdHI6IGFueSwgdHlwZSA9ICdCJywgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwKSA9PiB7XG4gIGlmIChzdHIgPT09ICdwYXNzJykgcmV0dXJuIGAke3R5cGV9W11gO1xuICBjb25zdCBpbnggPSBBMV9MRVRURVJTLmluZGV4T2Yoc3RyWzBdKSArIG9mZnNldFg7XG4gIGNvbnN0IGlueSA9IEExX05VTUJFUlMuaW5kZXhPZihwYXJzZUludChzdHIuc3Vic3RyKDEpLCAwKSkgKyBvZmZzZXRZO1xuICBjb25zdCBzZ2YgPSBgJHt0eXBlfVske1NHRl9MRVRURVJTW2lueF19JHtTR0ZfTEVUVEVSU1tpbnldfV1gO1xuICByZXR1cm4gc2dmO1xufTtcblxuZXhwb3J0IGNvbnN0IHBvc1RvU2dmID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBraTogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGF4ID0gU0dGX0xFVFRFUlNbeF07XG4gIGNvbnN0IGF5ID0gU0dGX0xFVFRFUlNbeV07XG4gIGlmIChraSA9PT0gMCkgcmV0dXJuICcnO1xuICBpZiAoa2kgPT09IDEpIHJldHVybiBgQlske2F4fSR7YXl9XWA7XG4gIGlmIChraSA9PT0gLTEpIHJldHVybiBgV1ske2F4fSR7YXl9XWA7XG4gIHJldHVybiAnJztcbn07XG5cbmV4cG9ydCBjb25zdCBtYXRUb1Bvc2l0aW9uID0gKG1hdDogbnVtYmVyW11bXSwgeE9mZnNldCA9IDAsIHlPZmZzZXQgPSAwKSA9PiB7XG4gIGxldCByZXN1bHQgPSAnJztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBtYXRbaV1bal07XG4gICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgY29uc3QgeCA9IEExX0xFVFRFUlNbaSArIHhPZmZzZXRdO1xuICAgICAgICBjb25zdCB5ID0gQTFfTlVNQkVSU1tqICsgeU9mZnNldF07XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdmFsdWUgPT09IDEgPyAnYicgOiAndyc7XG4gICAgICAgIHJlc3VsdCArPSBgJHtjb2xvcn0gJHt4fSR7eX0gYDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBtYXRUb0xpc3RPZlR1cGxlcyA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICB4T2Zmc2V0ID0gMCxcbiAgeU9mZnNldCA9IDBcbikgPT4ge1xuICBjb25zdCByZXN1bHRzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IHggPSBBMV9MRVRURVJTW2kgKyB4T2Zmc2V0XTtcbiAgICAgICAgY29uc3QgeSA9IEExX05VTUJFUlNbaiArIHlPZmZzZXRdO1xuICAgICAgICBjb25zdCBjb2xvciA9IHZhbHVlID09PSAxID8gJ0InIDogJ1cnO1xuICAgICAgICByZXN1bHRzLnB1c2goW2NvbG9yLCB4ICsgeV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbmV4cG9ydCBjb25zdCBjb252ZXJ0U3RvbmVUeXBlVG9TdHJpbmcgPSAodHlwZTogYW55KSA9PiAodHlwZSA9PT0gMSA/ICdCJyA6ICdXJyk7XG5cbmV4cG9ydCBjb25zdCBjb252ZXJ0U3RlcHNGb3JBSSA9IChzdGVwczogYW55LCBvZmZzZXQgPSAwKSA9PiB7XG4gIGxldCByZXMgPSBjbG9uZShzdGVwcyk7XG4gIHJlcyA9IHJlcy5tYXAoKHM6IGFueSkgPT4gc2dmT2Zmc2V0KHMsIG9mZnNldCkpO1xuICBjb25zdCBoZWFkZXIgPSBgKDtGRls0XUdNWzFdU1pbJHtcbiAgICAxOSAtIG9mZnNldFxuICB9XUdOWzIyNl1QQltCbGFja11IQVswXVBXW1doaXRlXUtNWzcuNV1EVFsyMDE3LTA4LTAxXVRNWzE4MDBdUlVbQ2hpbmVzZV1DUFtDb3B5cmlnaHQgZ2hvc3QtZ28uY29tXUFQW2dob3N0LWdvLmNvbV1QTFtCbGFja107YDtcbiAgbGV0IGNvdW50ID0gMDtcbiAgbGV0IHByZXYgPSAnJztcbiAgc3RlcHMuZm9yRWFjaCgoc3RlcDogYW55LCBpbmRleDogYW55KSA9PiB7XG4gICAgaWYgKHN0ZXBbMF0gPT09IHByZXZbMF0pIHtcbiAgICAgIGlmIChzdGVwWzBdID09PSAnQicpIHtcbiAgICAgICAgcmVzLnNwbGljZShpbmRleCArIGNvdW50LCAwLCAnV1t0dF0nKTtcbiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5zcGxpY2UoaW5kZXggKyBjb3VudCwgMCwgJ0JbdHRdJyk7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHByZXYgPSBzdGVwO1xuICB9KTtcbiAgcmV0dXJuIGAke2hlYWRlcn0ke3Jlcy5qb2luKCc7Jyl9KWA7XG59O1xuXG5leHBvcnQgY29uc3QgcmV2ZXJzZU9mZnNldEExTW92ZSA9IChcbiAgbW92ZTogc3RyaW5nLFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGFuYWx5c2lzOiBBbmFseXNpc1xuKSA9PiB7XG4gIGlmIChtb3ZlID09PSAncGFzcycpIHJldHVybiBtb3ZlO1xuICBjb25zdCBpZE9iaiA9IEpTT04ucGFyc2UoYW5hbHlzaXMuaWQpO1xuICBjb25zdCB7eCwgeX0gPSByZXZlcnNlT2Zmc2V0KG1hdCwgaWRPYmouYngsIGlkT2JqLmJ5KTtcbiAgY29uc3QgaW54ID0gQTFfTEVUVEVSUy5pbmRleE9mKG1vdmVbMF0pICsgeDtcbiAgY29uc3QgaW55ID0gQTFfTlVNQkVSUy5pbmRleE9mKHBhcnNlSW50KG1vdmUuc3Vic3RyKDEpLCAwKSkgKyB5O1xuICByZXR1cm4gYCR7QTFfTEVUVEVSU1tpbnhdfSR7QTFfTlVNQkVSU1tpbnldfWA7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1Njb3JlRGlmZlRleHQgPSAoXG4gIHByZXY/OiBSb290SW5mbyB8IG51bGwsXG4gIGN1cnI/OiBNb3ZlSW5mbyB8IFJvb3RJbmZvIHwgbnVsbCxcbiAgZml4ZWQgPSAxLFxuICByZXZlcnNlID0gZmFsc2VcbikgPT4ge1xuICBpZiAoIXByZXYgfHwgIWN1cnIpIHJldHVybiAnJztcbiAgbGV0IHNjb3JlID0gY2FsY1Njb3JlRGlmZihwcmV2LCBjdXJyKTtcbiAgaWYgKHJldmVyc2UpIHNjb3JlID0gLXNjb3JlO1xuICBjb25zdCBmaXhlZFNjb3JlID0gc2NvcmUudG9GaXhlZChmaXhlZCk7XG5cbiAgcmV0dXJuIHNjb3JlID4gMCA/IGArJHtmaXhlZFNjb3JlfWAgOiBgJHtmaXhlZFNjb3JlfWA7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1dpbnJhdGVEaWZmVGV4dCA9IChcbiAgcHJldj86IFJvb3RJbmZvIHwgbnVsbCxcbiAgY3Vycj86IE1vdmVJbmZvIHwgUm9vdEluZm8gfCBudWxsLFxuICBmaXhlZCA9IDEsXG4gIHJldmVyc2UgPSBmYWxzZVxuKSA9PiB7XG4gIGlmICghcHJldiB8fCAhY3VycikgcmV0dXJuICcnO1xuICBsZXQgd2lucmF0ZSA9IGNhbGNXaW5yYXRlRGlmZihwcmV2LCBjdXJyKTtcbiAgaWYgKHJldmVyc2UpIHdpbnJhdGUgPSAtd2lucmF0ZTtcbiAgY29uc3QgZml4ZWRXaW5yYXRlID0gd2lucmF0ZS50b0ZpeGVkKGZpeGVkKTtcblxuICByZXR1cm4gd2lucmF0ZSA+PSAwID8gYCske2ZpeGVkV2lucmF0ZX0lYCA6IGAke2ZpeGVkV2lucmF0ZX0lYDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjU2NvcmVEaWZmID0gKFxuICBwcmV2SW5mbzogUm9vdEluZm8sXG4gIGN1cnJJbmZvOiBNb3ZlSW5mbyB8IFJvb3RJbmZvXG4pID0+IHtcbiAgY29uc3Qgc2lnbiA9IHByZXZJbmZvLmN1cnJlbnRQbGF5ZXIgPT09ICdCJyA/IDEgOiAtMTtcbiAgY29uc3Qgc2NvcmUgPVxuICAgIE1hdGgucm91bmQoKGN1cnJJbmZvLnNjb3JlTGVhZCAtIHByZXZJbmZvLnNjb3JlTGVhZCkgKiBzaWduICogMTAwMCkgLyAxMDAwO1xuXG4gIHJldHVybiBzY29yZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjV2lucmF0ZURpZmYgPSAoXG4gIHByZXZJbmZvOiBSb290SW5mbyxcbiAgY3VyckluZm86IE1vdmVJbmZvIHwgUm9vdEluZm9cbikgPT4ge1xuICBjb25zdCBzaWduID0gcHJldkluZm8uY3VycmVudFBsYXllciA9PT0gJ0InID8gMSA6IC0xO1xuICBjb25zdCBzY29yZSA9XG4gICAgTWF0aC5yb3VuZCgoY3VyckluZm8ud2lucmF0ZSAtIHByZXZJbmZvLndpbnJhdGUpICogc2lnbiAqIDEwMDAgKiAxMDApIC9cbiAgICAxMDAwO1xuXG4gIHJldHVybiBzY29yZTtcbn07XG5cbi8vIGV4cG9ydCBjb25zdCBHb0JhbkRldGVjdGlvbiA9IChwaXhlbERhdGEsIGNhbnZhcykgPT4ge1xuLy8gY29uc3QgY29sdW1ucyA9IGNhbnZhcy53aWR0aDtcbi8vIGNvbnN0IHJvd3MgPSBjYW52YXMuaGVpZ2h0O1xuLy8gY29uc3QgZGF0YVR5cGUgPSBKc0ZlYXQuVThDMV90O1xuLy8gY29uc3QgZGlzdE1hdHJpeFQgPSBuZXcgSnNGZWF0Lm1hdHJpeF90KGNvbHVtbnMsIHJvd3MsIGRhdGFUeXBlKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmdyYXlzY2FsZShwaXhlbERhdGEsIGNvbHVtbnMsIHJvd3MsIGRpc3RNYXRyaXhUKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmdhdXNzaWFuX2JsdXIoZGlzdE1hdHJpeFQsIGRpc3RNYXRyaXhULCAyLCAwKTtcbi8vIEpzRmVhdC5pbWdwcm9jLmNhbm55KGRpc3RNYXRyaXhULCBkaXN0TWF0cml4VCwgNTAsIDUwKTtcblxuLy8gY29uc3QgbmV3UGl4ZWxEYXRhID0gbmV3IFVpbnQzMkFycmF5KHBpeGVsRGF0YS5idWZmZXIpO1xuLy8gY29uc3QgYWxwaGEgPSAoMHhmZiA8PCAyNCk7XG4vLyBsZXQgaSA9IGRpc3RNYXRyaXhULmNvbHMgKiBkaXN0TWF0cml4VC5yb3dzO1xuLy8gbGV0IHBpeCA9IDA7XG4vLyB3aGlsZSAoaSA+PSAwKSB7XG4vLyAgIHBpeCA9IGRpc3RNYXRyaXhULmRhdGFbaV07XG4vLyAgIG5ld1BpeGVsRGF0YVtpXSA9IGFscGhhIHwgKHBpeCA8PCAxNikgfCAocGl4IDw8IDgpIHwgcGl4O1xuLy8gICBpIC09IDE7XG4vLyB9XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFBBSSA9IChuOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPikgPT4ge1xuICBjb25zdCBwYWkgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQUknKTtcbiAgaWYgKCFwYWkpIHJldHVybjtcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocGFpLnZhbHVlKTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0QW5zd2VyS2luZCA9IChcbiAgbjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT5cbik6IFBBVCB8IHVuZGVmaW5lZCA9PiB7XG4gIGNvbnN0IHBhdCA9IG4ubW9kZWwuY3VzdG9tUHJvcHMuZmluZCgocDogQ3VzdG9tUHJvcCkgPT4gcC50b2tlbiA9PT0gJ1BBVCcpO1xuICBjb25zdCBwYWkgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQQUknKTtcbiAgaWYgKHBhaSkge1xuICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHBhaS52YWx1ZSk7XG4gICAgY29uc3QgcGFpTWFwID0ge3I6IFBBVC5SaWdodCwgdjogUEFULlZhcmlhbnQsIHc6IFBBVC5Xcm9uZ307XG4gICAgcmV0dXJuIHBhaU1hcFtkYXRhLmtpbmQgYXMgJ3InIHwgJ3YnIHwgJ3cnXTtcbiAgfVxuICByZXR1cm4gcGF0Py52YWx1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0UEkgPSAobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgY29uc3QgcGkgPSBuLm1vZGVsLmN1c3RvbVByb3BzLmZpbmQoKHA6IEN1c3RvbVByb3ApID0+IHAudG9rZW4gPT09ICdQSScpO1xuICBpZiAoIXBpKSByZXR1cm47XG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHBpLnZhbHVlKTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbml0Tm9kZURhdGEgPSAoc2hhOiBzdHJpbmcsIG51bWJlcj86IG51bWJlcik6IFNnZk5vZGUgPT4ge1xuICByZXR1cm4ge1xuICAgIGlkOiBzaGEsXG4gICAgbmFtZTogc2hhLFxuICAgIG51bWJlcjogbnVtYmVyIHx8IDAsXG4gICAgcm9vdFByb3BzOiBbXSxcbiAgICBtb3ZlUHJvcHM6IFtdLFxuICAgIHNldHVwUHJvcHM6IFtdLFxuICAgIG1hcmt1cFByb3BzOiBbXSxcbiAgICBnYW1lSW5mb1Byb3BzOiBbXSxcbiAgICBub2RlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBtb3ZlQW5ub3RhdGlvblByb3BzOiBbXSxcbiAgICBjdXN0b21Qcm9wczogW10sXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRNb3ZlTm9kZSA9IChcbiAgbW92ZTogc3RyaW5nLFxuICBwYXJlbnROb2RlPzogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIHByb3BzPzogU2dmTm9kZU9wdGlvbnNcbikgPT4ge1xuICBjb25zdCB0cmVlOiBUcmVlTW9kZWwgPSBuZXcgVHJlZU1vZGVsKCk7XG4gIGNvbnN0IG1vdmVQcm9wID0gTW92ZVByb3AuZnJvbShtb3ZlKTtcbiAgY29uc3Qgc2hhID0gY2FsY1NIQShwYXJlbnROb2RlLCBbbW92ZVByb3BdKTtcbiAgbGV0IG51bWJlciA9IDE7XG4gIGlmIChwYXJlbnROb2RlKSBudW1iZXIgPSBnZXROb2RlTnVtYmVyKHBhcmVudE5vZGUpICsgMTtcbiAgY29uc3Qgbm9kZURhdGEgPSBpbml0Tm9kZURhdGEoc2hhLCBudW1iZXIpO1xuICBub2RlRGF0YS5tb3ZlUHJvcHMgPSBbbW92ZVByb3BdO1xuICBub2RlRGF0YS5ub2RlQW5ub3RhdGlvblByb3BzID0gW05vZGVBbm5vdGF0aW9uUHJvcC5mcm9tKGBOWyR7c2hhfV1gKV07XG5cbiAgY29uc3Qgbm9kZSA9IHRyZWUucGFyc2Uoe1xuICAgIC4uLm5vZGVEYXRhLFxuICAgIC4uLnByb3BzLFxuICB9KTtcbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TGFzdEluZGV4ID0gKHJvb3Q6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSA9PiB7XG4gIGxldCBsYXN0Tm9kZSA9IHJvb3Q7XG4gIHJvb3Qud2Fsayhub2RlID0+IHtcbiAgICAvLyBIYWx0IHRoZSB0cmF2ZXJzYWwgYnkgcmV0dXJuaW5nIGZhbHNlXG4gICAgbGFzdE5vZGUgPSBub2RlO1xuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbiAgcmV0dXJuIGxhc3ROb2RlLm1vZGVsLmluZGV4O1xufTtcblxuZXhwb3J0IGNvbnN0IGN1dE1vdmVOb2RlcyA9IChcbiAgcm9vdDogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4sXG4gIHJldHVyblJvb3Q/OiBib29sZWFuXG4pID0+IHtcbiAgbGV0IG5vZGUgPSBjbG9uZURlZXAocm9vdCk7XG4gIHdoaWxlIChub2RlICYmIG5vZGUuaGFzQ2hpbGRyZW4oKSAmJiBub2RlLm1vZGVsLm1vdmVQcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICBub2RlLmNoaWxkcmVuID0gW107XG4gIH1cblxuICBpZiAocmV0dXJuUm9vdCkge1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUucGFyZW50ICYmICFub2RlLmlzUm9vdCgpKSB7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1NwYWNlQW5kU2NhbGVkUGFkZGluZyA9IChcbiAgc2l6ZTogbnVtYmVyLFxuICBwYWRkaW5nOiBudW1iZXIsXG4gIGJvYXJkU2l6ZTogbnVtYmVyXG4pID0+IHtcbiAgY29uc3QgbmV3U3BhY2UgPSAoc2l6ZSAtIHBhZGRpbmcgKiAyKSAvIGJvYXJkU2l6ZTtcbiAgcmV0dXJuIHtzcGFjZTogbmV3U3BhY2UsIHNjYWxlZFBhZGRpbmc6IHBhZGRpbmcgKyBuZXdTcGFjZSAvIDJ9O1xufTtcblxuZXhwb3J0IGNvbnN0IHplcm9zID0gKHNpemU6IFtudW1iZXIsIG51bWJlcl0pID0+XG4gIG5ldyBBcnJheShzaXplWzBdKS5maWxsKDApLm1hcCgoKSA9PiBuZXcgQXJyYXkoc2l6ZVsxXSkuZmlsbCgwKSk7XG5cbmV4cG9ydCBjb25zdCBlbXB0eSA9IChzaXplOiBbbnVtYmVyLCBudW1iZXJdKTogc3RyaW5nW11bXSA9PlxuICBuZXcgQXJyYXkoc2l6ZVswXSkuZmlsbCgnJykubWFwKCgpID0+IG5ldyBBcnJheShzaXplWzFdKS5maWxsKCcnKSk7XG5cbmNvbnN0IEdSSUQgPSAxOTtcbmxldCBsaWJlcnRpZXMgPSAwO1xubGV0IHJlY3Vyc2lvblBhdGg6IHN0cmluZ1tdID0gW107XG5cbmV4cG9ydCBjb25zdCBjYWxjTW9zdCA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGxldCBsZWZ0TW9zdDogbnVtYmVyID0gYm9hcmRTaXplIC0gMTtcbiAgbGV0IHJpZ2h0TW9zdCA9IDA7XG4gIGxldCB0b3BNb3N0OiBudW1iZXIgPSBib2FyZFNpemUgLSAxO1xuICBsZXQgYm90dG9tTW9zdCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbWF0W2ldW2pdO1xuICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgIGlmIChsZWZ0TW9zdCA+IGkpIGxlZnRNb3N0ID0gaTtcbiAgICAgICAgaWYgKHJpZ2h0TW9zdCA8IGkpIHJpZ2h0TW9zdCA9IGk7XG4gICAgICAgIGlmICh0b3BNb3N0ID4gaikgdG9wTW9zdCA9IGo7XG4gICAgICAgIGlmIChib3R0b21Nb3N0IDwgaikgYm90dG9tTW9zdCA9IGo7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH07XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0NlbnRlciA9IChtYXQ6IG51bWJlcltdW10sIGJvYXJkU2l6ZSA9IDE5KSA9PiB7XG4gIGNvbnN0IHtsZWZ0TW9zdCwgcmlnaHRNb3N0LCB0b3BNb3N0LCBib3R0b21Nb3N0fSA9IGNhbGNNb3N0KG1hdCwgYm9hcmRTaXplKTtcbiAgY29uc3QgdG9wID0gdG9wTW9zdCA8IGJvYXJkU2l6ZSAtIDEgLSBib3R0b21Nb3N0O1xuICBjb25zdCBsZWZ0ID0gbGVmdE1vc3QgPCBib2FyZFNpemUgLSAxIC0gcmlnaHRNb3N0O1xuICBpZiAodG9wICYmIGxlZnQpIHJldHVybiBDZW50ZXIuVG9wTGVmdDtcbiAgaWYgKCF0b3AgJiYgbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21MZWZ0O1xuICBpZiAodG9wICYmICFsZWZ0KSByZXR1cm4gQ2VudGVyLlRvcFJpZ2h0O1xuICBpZiAoIXRvcCAmJiAhbGVmdCkgcmV0dXJuIENlbnRlci5Cb3R0b21SaWdodDtcbiAgcmV0dXJuIENlbnRlci5DZW50ZXI7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY0JvYXJkU2l6ZSA9IChcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBib2FyZFNpemUgPSAxOSxcbiAgZXh0ZW5kID0gMlxuKTogbnVtYmVyW10gPT4ge1xuICBjb25zdCByZXN1bHQgPSBbMTksIDE5XTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQsIGJvYXJkU2l6ZSk7XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0KSB7XG4gICAgcmVzdWx0WzBdID0gcmlnaHRNb3N0ICsgZXh0ZW5kICsgMTtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW5kICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVuZDtcbiAgICByZXN1bHRbMV0gPSBib3R0b21Nb3N0ICsgZXh0ZW5kICsgMTtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCkge1xuICAgIHJlc3VsdFswXSA9IHJpZ2h0TW9zdCArIGV4dGVuZCArIDE7XG4gICAgcmVzdWx0WzFdID0gYm9hcmRTaXplIC0gdG9wTW9zdCArIGV4dGVuZDtcbiAgfVxuICBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQpIHtcbiAgICByZXN1bHRbMF0gPSBib2FyZFNpemUgLSBsZWZ0TW9zdCArIGV4dGVuZDtcbiAgICByZXN1bHRbMV0gPSBib2FyZFNpemUgLSB0b3BNb3N0ICsgZXh0ZW5kO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxjUGFydGlhbEFyZWEgPSAoXG4gIG1hdDogbnVtYmVyW11bXSxcbiAgZXh0ZW5kID0gMlxuKTogW1tudW1iZXIsIG51bWJlcl0sIFtudW1iZXIsIG51bWJlcl1dID0+IHtcbiAgY29uc3Qge2xlZnRNb3N0LCByaWdodE1vc3QsIHRvcE1vc3QsIGJvdHRvbU1vc3R9ID0gY2FsY01vc3QobWF0KTtcblxuICBjb25zdCB4MSA9IGxlZnRNb3N0IC0gZXh0ZW5kIDwgMCA/IDAgOiBsZWZ0TW9zdCAtIGV4dGVuZDtcbiAgY29uc3QgeTEgPSB0b3BNb3N0IC0gZXh0ZW5kIDwgMCA/IDAgOiB0b3BNb3N0IC0gZXh0ZW5kO1xuICBjb25zdCB4MiA9IHJpZ2h0TW9zdCArIGV4dGVuZCA+IDE4ID8gMTggOiByaWdodE1vc3QgKyBleHRlbmQ7XG4gIGNvbnN0IHkyID0gYm90dG9tTW9zdCArIGV4dGVuZCA+IDE4ID8gMTggOiBib3R0b21Nb3N0ICsgZXh0ZW5kO1xuXG4gIHJldHVybiBbXG4gICAgW3gxLCB5MV0sXG4gICAgW3gyLCB5Ml0sXG4gIF07XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY09mZnNldCA9IChtYXQ6IG51bWJlcltdW10pID0+IHtcbiAgY29uc3QgYm9hcmRTaXplID0gY2FsY0JvYXJkU2l6ZShtYXQpO1xuICBjb25zdCBveCA9IDE5IC0gYm9hcmRTaXplWzBdO1xuICBjb25zdCBveSA9IDE5IC0gYm9hcmRTaXplWzFdO1xuICBjb25zdCBjZW50ZXIgPSBjYWxjQ2VudGVyKG1hdCk7XG5cbiAgbGV0IG9veCA9IG94O1xuICBsZXQgb295ID0gb3k7XG4gIHN3aXRjaCAoY2VudGVyKSB7XG4gICAgY2FzZSBDZW50ZXIuVG9wTGVmdDoge1xuICAgICAgb294ID0gMDtcbiAgICAgIG9veSA9IG95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLlRvcFJpZ2h0OiB7XG4gICAgICBvb3ggPSAtb3g7XG4gICAgICBvb3kgPSBveTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21MZWZ0OiB7XG4gICAgICBvb3ggPSAwO1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENlbnRlci5Cb3R0b21SaWdodDoge1xuICAgICAgb294ID0gLW94O1xuICAgICAgb295ID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge3g6IG9veCwgeTogb295fTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXZlcnNlT2Zmc2V0ID0gKG1hdDogbnVtYmVyW11bXSwgYnggPSAxOSwgYnkgPSAxOSkgPT4ge1xuICBjb25zdCBveCA9IDE5IC0gYng7XG4gIGNvbnN0IG95ID0gMTkgLSBieTtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuXG4gIGxldCBvb3ggPSBveDtcbiAgbGV0IG9veSA9IG95O1xuICBzd2l0Y2ggKGNlbnRlcikge1xuICAgIGNhc2UgQ2VudGVyLlRvcExlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSAtb3k7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDZW50ZXIuVG9wUmlnaHQ6IHtcbiAgICAgIG9veCA9IG94O1xuICAgICAgb295ID0gLW95O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLkJvdHRvbUxlZnQ6IHtcbiAgICAgIG9veCA9IDA7XG4gICAgICBvb3kgPSAwO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2VudGVyLkJvdHRvbVJpZ2h0OiB7XG4gICAgICBvb3ggPSBveDtcbiAgICAgIG9veSA9IDA7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt4OiBvb3gsIHk6IG9veX07XG59O1xuXG5leHBvcnQgY29uc3QgY2FsY1Zpc2libGVBcmVhID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGJvYXJkU2l6ZSA9IDE5LFxuICBleHRlbmQgPSAyXG4pID0+IHtcbiAgY29uc3QgY2VudGVyID0gY2FsY0NlbnRlcihtYXQpO1xuICBjb25zdCB7bGVmdE1vc3QsIHJpZ2h0TW9zdCwgdG9wTW9zdCwgYm90dG9tTW9zdH0gPSBjYWxjTW9zdChtYXQsIGJvYXJkU2l6ZSk7XG4gIGxldCB2aXNpYmxlQXJlYSA9IFtcbiAgICBbMCwgMThdLFxuICAgIFswLCAxOF0sXG4gIF07XG4gIGxldCB2aXNpYmxlU2l6ZSA9IGJvYXJkU2l6ZSAtIDE7XG4gIGlmIChjZW50ZXIgPT09IENlbnRlci5Ub3BMZWZ0KSB7XG4gICAgdmlzaWJsZVNpemUgPSBNYXRoLm1pbihcbiAgICAgIE1hdGgubWF4KHJpZ2h0TW9zdCwgYm90dG9tTW9zdCkgKyBleHRlbmQsXG4gICAgICBib2FyZFNpemUgLSAxXG4gICAgKTtcbiAgICB2aXNpYmxlQXJlYSA9IFtcbiAgICAgIFswLCB2aXNpYmxlU2l6ZV0sXG4gICAgICBbMCwgdmlzaWJsZVNpemVdLFxuICAgIF07XG4gIH0gZWxzZSBpZiAoY2VudGVyID09PSBDZW50ZXIuVG9wUmlnaHQpIHtcbiAgICB2aXNpYmxlU2l6ZSA9IE1hdGgubWluKFxuICAgICAgTWF0aC5tYXgoYm90dG9tTW9zdCArIGV4dGVuZCwgYm9hcmRTaXplIC0gMSAtIChsZWZ0TW9zdCAtIGV4dGVuZCkpLFxuICAgICAgYm9hcmRTaXplIC0gMVxuICAgICk7XG4gICAgdmlzaWJsZUFyZWEgPSBbXG4gICAgICBbYm9hcmRTaXplIC0gMSAtIHZpc2libGVTaXplLCAxOF0sXG4gICAgICBbMCwgdmlzaWJsZVNpemVdLFxuICAgIF07XG4gIH0gZWxzZSBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tTGVmdCkge1xuICAgIHZpc2libGVTaXplID0gTWF0aC5taW4oXG4gICAgICBNYXRoLm1heChib2FyZFNpemUgLSAxIC0gKHRvcE1vc3QgLSBleHRlbmQpLCByaWdodE1vc3QgKyBleHRlbmQpLFxuICAgICAgYm9hcmRTaXplIC0gMVxuICAgICk7XG4gICAgdmlzaWJsZUFyZWEgPSBbXG4gICAgICBbMCwgdmlzaWJsZVNpemVdLFxuICAgICAgW2JvYXJkU2l6ZSAtIDEgLSB2aXNpYmxlU2l6ZSwgMThdLFxuICAgIF07XG4gIH0gZWxzZSBpZiAoY2VudGVyID09PSBDZW50ZXIuQm90dG9tUmlnaHQpIHtcbiAgICB2aXNpYmxlU2l6ZSA9IE1hdGgubWluKFxuICAgICAgTWF0aC5tYXgoXG4gICAgICAgIGJvYXJkU2l6ZSAtIDEgLSAodG9wTW9zdCAtIGV4dGVuZCksXG4gICAgICAgIGJvYXJkU2l6ZSAtIDEgLSAobGVmdE1vc3QgLSBleHRlbmQpXG4gICAgICApLFxuICAgICAgYm9hcmRTaXplIC0gMVxuICAgICk7XG4gICAgdmlzaWJsZUFyZWEgPSBbXG4gICAgICBbYm9hcmRTaXplIC0gMSAtIHZpc2libGVTaXplLCAxOF0sXG4gICAgICBbYm9hcmRTaXplIC0gMSAtIHZpc2libGVTaXplLCAxOF0sXG4gICAgXTtcbiAgfVxuICByZXR1cm4ge3Zpc2libGVBcmVhLCBjZW50ZXJ9O1xufTtcblxuZnVuY3Rpb24gY2FsY0xpYmVydHlDb3JlKG1hdDogbnVtYmVyW11bXSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGtpOiBudW1iZXIpIHtcbiAgaWYgKHggPj0gMCAmJiB4IDwgR1JJRCAmJiB5ID49IDAgJiYgeSA8IEdSSUQpIHtcbiAgICBpZiAobWF0W3hdW3ldID09PSBraSAmJiAhcmVjdXJzaW9uUGF0aC5pbmNsdWRlcyhgJHt4fSwke3l9YCkpIHtcbiAgICAgIHJlY3Vyc2lvblBhdGgucHVzaChgJHt4fSwke3l9YCk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4IC0gMSwgeSwga2kpO1xuICAgICAgY2FsY0xpYmVydHlDb3JlKG1hdCwgeCArIDEsIHksIGtpKTtcbiAgICAgIGNhbGNMaWJlcnR5Q29yZShtYXQsIHgsIHkgLSAxLCBraSk7XG4gICAgICBjYWxjTGliZXJ0eUNvcmUobWF0LCB4LCB5ICsgMSwga2kpO1xuICAgIH0gZWxzZSBpZiAobWF0W3hdW3ldID09PSAwKSB7XG4gICAgICBsaWJlcnRpZXMgKz0gMTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsY0xpYmVydHkobWF0OiBudW1iZXJbXVtdLCB4OiBudW1iZXIsIHk6IG51bWJlciwga2k6IG51bWJlcikge1xuICBsaWJlcnRpZXMgPSAwO1xuICByZWN1cnNpb25QYXRoID0gW107XG5cbiAgaWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPiBHUklEIC0gMSB8fCB5ID4gR1JJRCAtIDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGliZXJ0eTogNCxcbiAgICAgIHJlY3Vyc2lvblBhdGg6IFtdLFxuICAgIH07XG4gIH1cblxuICBpZiAobWF0W3hdW3ldID09PSAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpYmVydHk6IDQsXG4gICAgICByZWN1cnNpb25QYXRoOiBbXSxcbiAgICB9O1xuICB9XG4gIGNhbGNMaWJlcnR5Q29yZShtYXQsIHgsIHksIGtpKTtcbiAgcmV0dXJuIHtcbiAgICBsaWJlcnR5OiBsaWJlcnRpZXMsXG4gICAgcmVjdXJzaW9uUGF0aCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZXhlY1Bvbm51a2kobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikge1xuICBjb25zdCBuZXdNYXQgPSBjbG9uZURlZXAobWF0KTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlVcCwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aFVwfSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpLFxuICAgIGogLSAxLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5RG93biwgcmVjdXJzaW9uUGF0aDogcmVjdXJzaW9uUGF0aERvd259ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiArIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlMZWZ0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoTGVmdH0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSAtIDEsXG4gICAgaixcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVJpZ2h0LCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoUmlnaHR9ID1cbiAgICBjYWxjTGliZXJ0eShtYXQsIGkgKyAxLCBqLCBraSk7XG4gIGlmIChsaWJlcnR5VXAgPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoVXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaXRlbS5zcGxpdCgnLCcpO1xuICAgICAgbmV3TWF0W3BhcnNlSW50KGNvb3JkWzBdLCAxMCldW3BhcnNlSW50KGNvb3JkWzFdLCAxMCldID0gMDtcbiAgICB9KTtcbiAgfVxuICBpZiAobGliZXJ0eURvd24gPT09IDApIHtcbiAgICByZWN1cnNpb25QYXRoRG93bi5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdNYXRbcGFyc2VJbnQoY29vcmRbMF0sIDEwKV1bcGFyc2VJbnQoY29vcmRbMV0sIDEwKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIGlmIChsaWJlcnR5TGVmdCA9PT0gMCkge1xuICAgIHJlY3Vyc2lvblBhdGhMZWZ0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGl0ZW0uc3BsaXQoJywnKTtcbiAgICAgIG5ld01hdFtwYXJzZUludChjb29yZFswXSwgMTApXVtwYXJzZUludChjb29yZFsxXSwgMTApXSA9IDA7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGxpYmVydHlSaWdodCA9PT0gMCkge1xuICAgIHJlY3Vyc2lvblBhdGhSaWdodC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBpdGVtLnNwbGl0KCcsJyk7XG4gICAgICBuZXdNYXRbcGFyc2VJbnQoY29vcmRbMF0sIDEwKV1bcGFyc2VJbnQoY29vcmRbMV0sIDEwKV0gPSAwO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBuZXdNYXQ7XG59XG5cbmZ1bmN0aW9uIGNhblBvbm51a2kobWF0OiBudW1iZXJbXVtdLCBpOiBudW1iZXIsIGo6IG51bWJlciwga2k6IG51bWJlcikge1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eVVwLCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoVXB9ID0gY2FsY0xpYmVydHkoXG4gICAgbWF0LFxuICAgIGksXG4gICAgaiAtIDEsXG4gICAga2lcbiAgKTtcbiAgY29uc3Qge2xpYmVydHk6IGxpYmVydHlEb3duLCByZWN1cnNpb25QYXRoOiByZWN1cnNpb25QYXRoRG93bn0gPSBjYWxjTGliZXJ0eShcbiAgICBtYXQsXG4gICAgaSxcbiAgICBqICsgMSxcbiAgICBraVxuICApO1xuICBjb25zdCB7bGliZXJ0eTogbGliZXJ0eUxlZnQsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhMZWZ0fSA9IGNhbGNMaWJlcnR5KFxuICAgIG1hdCxcbiAgICBpIC0gMSxcbiAgICBqLFxuICAgIGtpXG4gICk7XG4gIGNvbnN0IHtsaWJlcnR5OiBsaWJlcnR5UmlnaHQsIHJlY3Vyc2lvblBhdGg6IHJlY3Vyc2lvblBhdGhSaWdodH0gPVxuICAgIGNhbGNMaWJlcnR5KG1hdCwgaSArIDEsIGosIGtpKTtcbiAgaWYgKGxpYmVydHlVcCA9PT0gMCAmJiByZWN1cnNpb25QYXRoVXAubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChsaWJlcnR5RG93biA9PT0gMCAmJiByZWN1cnNpb25QYXRoRG93bi5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGxpYmVydHlMZWZ0ID09PSAwICYmIHJlY3Vyc2lvblBhdGhMZWZ0Lmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobGliZXJ0eVJpZ2h0ID09PSAwICYmIHJlY3Vyc2lvblBhdGhSaWdodC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuTW92ZShtYXQ6IG51bWJlcltdW10sIGk6IG51bWJlciwgajogbnVtYmVyLCBraTogbnVtYmVyKSB7XG4gIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuIHRydWU7XG4gIGlmIChpID4gMTggfHwgaiA+IDE4KSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgbmV3TWF0ID0gY2xvbmVEZWVwKG1hdCk7XG4gIGlmIChuZXdNYXRbaV1bal0gIT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBuZXdNYXRbaV1bal0gPSBraTtcbiAgY29uc3Qge2xpYmVydHl9ID0gY2FsY0xpYmVydHkobmV3TWF0LCBpLCBqLCBraSk7XG4gIGlmIChjYW5Qb25udWtpKG5ld01hdCwgaSwgaiwgLWtpKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChjYW5Qb25udWtpKG5ld01hdCwgaSwgaiwga2kpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChsaWJlcnR5ID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbW92ZShtYXQ6IG51bWJlcltdW10sIGk6IG51bWJlciwgajogbnVtYmVyLCBraTogbnVtYmVyKSB7XG4gIGlmIChpIDwgMCB8fCBqIDwgMCkgcmV0dXJuIG1hdDtcbiAgY29uc3QgbmV3TWF0ID0gY2xvbmVEZWVwKG1hdCk7XG4gIG5ld01hdFtpXVtqXSA9IGtpO1xuICByZXR1cm4gZXhlY1Bvbm51a2kobmV3TWF0LCBpLCBqLCAta2kpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0tpKG1hdDogbnVtYmVyW11bXSwgc3RlcHM6IHN0cmluZ1tdLCBpc1Bvbm51a2kgPSB0cnVlKSB7XG4gIGxldCBuZXdNYXQgPSBjbG9uZURlZXAobWF0KTtcbiAgbGV0IGhhc01vdmVkID0gZmFsc2U7XG4gIHN0ZXBzLmZvckVhY2goc3RyID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIGtpLFxuICAgIH06IHtcbiAgICAgIHg6IG51bWJlcjtcbiAgICAgIHk6IG51bWJlcjtcbiAgICAgIGtpOiBudW1iZXI7XG4gICAgfSA9IHNnZlRvUG9zKHN0cik7XG4gICAgaWYgKGlzUG9ubnVraSkge1xuICAgICAgaWYgKGNhbk1vdmUobmV3TWF0LCB4LCB5LCBraSkpIHtcbiAgICAgICAgbmV3TWF0W3hdW3ldID0ga2k7XG4gICAgICAgIG5ld01hdCA9IGV4ZWNQb25udWtpKG5ld01hdCwgeCwgeSwgLWtpKTtcbiAgICAgICAgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdNYXRbeF1beV0gPSBraTtcbiAgICAgIGhhc01vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJyYW5nZW1lbnQ6IG5ld01hdCxcbiAgICBoYXNNb3ZlZCxcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGNhbGNUcmFuc2Zvcm0gPSAoXG4gIHNpemU6IG51bWJlcixcbiAgbWF0OiBudW1iZXJbXVtdLFxuICBvcHRpb25zOiBHaG9zdEJhbk9wdGlvbnNcbikgPT4ge1xuICBjb25zdCB7Ym9hcmRTaXplLCBleHRlbmQsIHBhZGRpbmcsIHpvb219ID0gb3B0aW9ucztcbiAgY29uc3Qge3Zpc2libGVBcmVhOiB6b29tZWRWaXNpYmxlQXJlYSwgY2VudGVyfSA9IGNhbGNWaXNpYmxlQXJlYShcbiAgICBtYXQsXG4gICAgYm9hcmRTaXplLFxuICAgIGV4dGVuZFxuICApO1xuICBjb25zdCB2YSA9IHpvb21cbiAgICA/IHpvb21lZFZpc2libGVBcmVhXG4gICAgOiBbXG4gICAgICAgIFswLCAxOF0sXG4gICAgICAgIFswLCAxOF0sXG4gICAgICBdO1xuXG4gIGNvbnN0IHpvb21lZEJvYXJkU2l6ZSA9IHZhWzBdWzFdIC0gdmFbMF1bMF0gKyAxO1xuICBjb25zdCB7c3BhY2V9ID0gY2FsY1NwYWNlQW5kU2NhbGVkUGFkZGluZyhzaXplLCBwYWRkaW5nLCBib2FyZFNpemUpO1xuICAvLyBjb25zdCBzY2FsZSA9IDEgLyAoem9vbWVkQm9hcmRTaXplIC8gYm9hcmRTaXplKTtcbiAgY29uc3Qgc2NhbGUgPSBzaXplIC8gKHpvb21lZEJvYXJkU2l6ZSAqIHNwYWNlICsgcGFkZGluZyk7XG4gIGNvbnN0IGNsaXAgPSB7eDogMCwgeTogMCwgd2lkdGg6IHNpemUgLyBzY2FsZSwgaGVpZ2h0OiBzaXplIC8gc2NhbGV9O1xuICBjb25zdCB0cmFuc2Zvcm06IGFueSA9IFtdO1xuXG4gIGlmIChcbiAgICB6b29tICYmXG4gICAgISh2YVswXVswXSA9PT0gMCAmJiB2YVswXVsxXSA9PT0gMTggJiYgdmFbMV1bMF0gPT09IDAgJiYgdmFbMV1bMV0gPT09IDE4KVxuICApIHtcbiAgICBsZXQgb2Zmc2V0WCA9IDA7XG4gICAgbGV0IG9mZnNldFkgPSAwO1xuICAgIC8vIGNvbnN0IG9mZnNldCA9IHRoaXMub3B0aW9ucy5wYWRkaW5nO1xuICAgIGNvbnN0IG9mZnNldCA9IHBhZGRpbmcgKiBzY2FsZTtcblxuICAgIC8vIFRoaXMgb2Zmc2V0IGZvcm11bGEgaXMgbm90IGFjY3VyYXRlLCBqdXN0IHRyeSBtYW55IHRpbWVcbiAgICAvLyBjb25zdCBvZmZzZXQgPSAocGFkZGluZyAqIHNjYWxlIC0gKHNwYWNlICogc2NhbGUpIC8gMi41KSAqIHNjYWxlO1xuXG4gICAgc3dpdGNoIChjZW50ZXIpIHtcbiAgICAgIGNhc2UgQ2VudGVyLlRvcExlZnQ6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDZW50ZXIuVG9wUmlnaHQ6XG4gICAgICAgIGNsaXAueCA9IHNpemUgLSBzaXplIC8gc2NhbGU7XG4gICAgICAgIG9mZnNldFggPSB2YVswXVswXSAqIHNwYWNlICogc2NhbGUgKyBvZmZzZXQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDZW50ZXIuQm90dG9tTGVmdDpcbiAgICAgICAgY2xpcC55ID0gc2l6ZSAtIHNpemUgLyBzY2FsZTtcbiAgICAgICAgb2Zmc2V0WSA9IHZhWzFdWzBdICogc3BhY2UgKiBzY2FsZSArIG9mZnNldDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENlbnRlci5Cb3R0b21SaWdodDpcbiAgICAgICAgY2xpcC54ID0gc2l6ZSAtIHNpemUgLyBzY2FsZTtcbiAgICAgICAgY2xpcC55ID0gc2l6ZSAtIHNpemUgLyBzY2FsZTtcbiAgICAgICAgb2Zmc2V0WCA9IHZhWzBdWzBdICogc3BhY2UgKiBzY2FsZSArIG9mZnNldDtcbiAgICAgICAgb2Zmc2V0WSA9IHZhWzFdWzBdICogc3BhY2UgKiBzY2FsZSArIG9mZnNldDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZhLFxuICAgICAgc2NhbGUsXG4gICAgICB0cmFuc2xhdGVYOiAtb2Zmc2V0WCxcbiAgICAgIHRyYW5zbGF0ZVk6IC1vZmZzZXRZLFxuICAgICAgY2VudGVyLFxuICAgICAgY2xpcCxcbiAgICAgIHNwYWNlLFxuICAgICAgLy8gdHJhbnNmb3JtOiBbe3RyYW5zbGF0ZVg6IC1vZmZzZXRYLCB0cmFuc2xhdGVZOiAtb2Zmc2V0WX0sIHtzY2FsZX1dLFxuICAgICAgdHJhbnNmb3JtOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0cmFuc2xhdGVYOiAtb2Zmc2V0WCxcbiAgICAgICAgICAvLyB0cmFuc2xhdGVYOiAwLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHJhbnNsYXRlWTogLW9mZnNldFksXG4gICAgICAgICAgLy8gdHJhbnNsYXRlWTogMCxcbiAgICAgICAgfSxcbiAgICAgICAge3NjYWxlfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmEsXG4gICAgICBzY2FsZTogMSxcbiAgICAgIHRyYW5zbGF0ZVg6IDAsXG4gICAgICB0cmFuc2xhdGVZOiAwLFxuICAgICAgY2VudGVyLFxuICAgICAgY2xpcCxcbiAgICAgIHNwYWNlLFxuICAgICAgdHJhbnNmb3JtLFxuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVNb3ZlID0gKFxuICBtYXQ6IG51bWJlcltdW10sXG4gIGk6IG51bWJlcixcbiAgajogbnVtYmVyLFxuICB0dXJuOiBLaSxcbiAgY3VycmVudE5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LFxuICBvbkFmdGVyTW92ZTogKG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+LCBpc01vdmVkOiBib29sZWFuKSA9PiB2b2lkXG4pID0+IHtcbiAgaWYgKHR1cm4gPT09IEtpLkVtcHR5KSByZXR1cm47XG4gIGlmIChjYW5Nb3ZlKG1hdCwgaSwgaiwgdHVybikpIHtcbiAgICAvLyBkaXNwYXRjaCh1aVNsaWNlLmFjdGlvbnMuc2V0VHVybigtdHVybikpO1xuICAgIGNvbnN0IHZhbHVlID0gU0dGX0xFVFRFUlNbaV0gKyBTR0ZfTEVUVEVSU1tqXTtcbiAgICBjb25zdCB0b2tlbiA9IHR1cm4gPT09IEtpLkJsYWNrID8gJ0InIDogJ1cnO1xuICAgIGNvbnN0IHNoYSA9IGNhbGNTSEEoY3VycmVudE5vZGUsIFtNb3ZlUHJvcC5mcm9tKGAke3Rva2VufVske3ZhbHVlfV1gKV0pO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gY3VycmVudE5vZGUuY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgKG46IGFueSkgPT4gbi5tb2RlbC5pZCA9PT0gc2hhXG4gICAgKTtcbiAgICBsZXQgbm9kZTtcbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgbm9kZSA9IGZpbHRlcmVkWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gYnVpbGRNb3ZlTm9kZShgJHt0b2tlbn1bJHt2YWx1ZX1dYCwgY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGlmIChvbkFmdGVyTW92ZSkgb25BZnRlck1vdmUobm9kZSwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9uQWZ0ZXJNb3ZlKSBvbkFmdGVyTW92ZShjdXJyZW50Tm9kZSwgZmFsc2UpO1xuICB9XG59O1xuIiwiaW1wb3J0IHtjb21wYWN0LCByZXBsYWNlfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IG1hdGNoQWxsIGZyb20gJ3N0cmluZy5wcm90b3R5cGUubWF0Y2hhbGwnO1xuXG5pbXBvcnQgVHJlZU1vZGVsIGZyb20gJ3RyZWUtbW9kZWwnO1xuaW1wb3J0IHtcbiAgTW92ZVByb3AsXG4gIFNldHVwUHJvcCxcbiAgUm9vdFByb3AsXG4gIEdhbWVJbmZvUHJvcCxcbiAgU2dmUHJvcEJhc2UsXG4gIE5vZGVBbm5vdGF0aW9uUHJvcCxcbiAgTW92ZUFubm90YXRpb25Qcm9wLFxuICBNYXJrdXBQcm9wLFxuICBDdXN0b21Qcm9wLFxuICBST09UX1BST1BfTElTVCxcbiAgTU9WRV9QUk9QX0xJU1QsXG4gIFNFVFVQX1BST1BfTElTVCxcbiAgTUFSS1VQX1BST1BfTElTVCxcbiAgTk9ERV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVCxcbiAgR0FNRV9JTkZPX1BST1BfTElTVCxcbiAgQ1VTVE9NX1BST1BfTElTVCxcbn0gZnJvbSAnLi9wcm9wcyc7XG5pbXBvcnQgdHlwZSB7U2dmTm9kZX0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge2dldERlZHVwbGljYXRlZFByb3BzLCBnZXROb2RlTnVtYmVyfSBmcm9tICcuLi9oZWxwZXInO1xuaW1wb3J0IHtjYWxjU0hBfSBmcm9tICcuLi9oZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgU2dmIHtcbiAgTkVXX05PREUgPSAnOyc7XG4gIEJSQU5DSElORyA9IFsnKCcsICcpJ107XG4gIFBST1BFUlRZID0gWydbJywgJ10nXTtcbiAgTElTVF9JREVOVElUSUVTID0gW1xuICAgICdBVycsXG4gICAgJ0FCJyxcbiAgICAnQUUnLFxuICAgICdBUicsXG4gICAgJ0NSJyxcbiAgICAnREQnLFxuICAgICdMQicsXG4gICAgJ0xOJyxcbiAgICAnTUEnLFxuICAgICdTTCcsXG4gICAgJ1NRJyxcbiAgICAnVFInLFxuICAgICdWVycsXG4gICAgJ1RCJyxcbiAgICAnVFcnLFxuICBdO1xuICBOT0RFX0RFTElNSVRFUlMgPSBbdGhpcy5ORVdfTk9ERV0uY29uY2F0KHRoaXMuQlJBTkNISU5HKTtcblxuICB0cmVlOiBUcmVlTW9kZWwgPSBuZXcgVHJlZU1vZGVsKCk7XG4gIHJvb3Q6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+IHwgbnVsbCA9IG51bGw7XG4gIG5vZGU6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+IHwgbnVsbCA9IG51bGw7XG4gIGN1cnJlbnROb2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiB8IG51bGwgPSBudWxsO1xuICBwYXJlbnROb2RlOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPiB8IG51bGwgPSBudWxsO1xuICBub2RlUHJvcHM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gIHNnZiA9ICcnO1xuXG4gIGZyb21Sb290KHJvb3Q6IFRyZWVNb2RlbC5Ob2RlPFNnZk5vZGU+KSB7XG4gICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG5vZGVUb1N0cmluZyhub2RlOiBhbnkpIHtcbiAgICBsZXQgY29udGVudCA9ICcnO1xuICAgIG5vZGUud2FsaygobjogVHJlZU1vZGVsLk5vZGU8U2dmTm9kZT4pID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcm9vdFByb3BzLFxuICAgICAgICBtb3ZlUHJvcHMsXG4gICAgICAgIGN1c3RvbVByb3BzLFxuICAgICAgICBzZXR1cFByb3BzLFxuICAgICAgICBtYXJrdXBQcm9wcyxcbiAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgbW92ZUFubm90YXRpb25Qcm9wcyxcbiAgICAgICAgZ2FtZUluZm9Qcm9wcyxcbiAgICAgIH0gPSBuLm1vZGVsO1xuICAgICAgY29uc3Qgbm9kZXMgPSBjb21wYWN0KFtcbiAgICAgICAgLi4ucm9vdFByb3BzLFxuICAgICAgICAuLi5jdXN0b21Qcm9wcyxcbiAgICAgICAgLi4ubW92ZVByb3BzLFxuICAgICAgICAuLi5nZXREZWR1cGxpY2F0ZWRQcm9wcyhzZXR1cFByb3BzKSxcbiAgICAgICAgLi4uZ2V0RGVkdXBsaWNhdGVkUHJvcHMobWFya3VwUHJvcHMpLFxuICAgICAgICAuLi5nYW1lSW5mb1Byb3BzLFxuICAgICAgICAuLi5ub2RlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICAuLi5tb3ZlQW5ub3RhdGlvblByb3BzLFxuICAgICAgXSk7XG4gICAgICBjb250ZW50ICs9ICc7JztcbiAgICAgIG5vZGVzLmZvckVhY2goKG46IFNnZlByb3BCYXNlKSA9PiB7XG4gICAgICAgIGNvbnRlbnQgKz0gbi50b1N0cmluZygpO1xuICAgICAgfSk7XG4gICAgICBpZiAobi5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgIG4uY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IFNnZlByb3BCYXNlKSA9PiB7XG4gICAgICAgICAgY29udGVudCArPSBgKCR7dGhpcy5ub2RlVG9TdHJpbmcoY2hpbGQpfSlgO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuLmNoaWxkcmVuLmxlbmd0aCA8IDI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICB0b1NnZigpIHtcbiAgICByZXR1cm4gYCgke3RoaXMubm9kZVRvU3RyaW5nKHRoaXMucm9vdCl9KWA7XG4gIH1cblxuICB0b1NnZldpdGhvdXRBbmFseXNpcygpIHtcbiAgICBjb25zdCBzZ2YgPSBgKCR7dGhpcy5ub2RlVG9TdHJpbmcodGhpcy5yb290KX0pYDtcbiAgICByZXR1cm4gcmVwbGFjZShzZ2YsIC9dKEFcXFsuKj9cXF0pL2csICddJyk7XG4gIH1cblxuICBwYXJzZShzZ2Y6IHN0cmluZykge1xuICAgIGlmICghc2dmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHNnZiA9IHNnZi5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLCAnJyk7XG4gICAgbGV0IG5vZGVTdGFydCA9IDA7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGNvbnN0IHN0YWNrOiBUcmVlTW9kZWwuTm9kZTxTZ2ZOb2RlPltdID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNnZi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYyA9IHNnZltpXTtcbiAgICAgIGlmICh0aGlzLk5PREVfREVMSU1JVEVSUy5pbmNsdWRlcyhjKSkge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gc2dmLnNsaWNlKG5vZGVTdGFydCwgaSk7XG4gICAgICAgIGlmIChjb250ZW50ICE9PSAnJykge1xuICAgICAgICAgIGNvbnN0IG1vdmVQcm9wczogTW92ZVByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IHNldHVwUHJvcHM6IFNldHVwUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3Qgcm9vdFByb3BzOiBSb290UHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3QgbWFya3VwUHJvcHM6IE1hcmt1cFByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IGdhbWVJbmZvUHJvcHM6IEdhbWVJbmZvUHJvcFtdID0gW107XG4gICAgICAgICAgY29uc3Qgbm9kZUFubm90YXRpb25Qcm9wczogTm9kZUFubm90YXRpb25Qcm9wW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBtb3ZlQW5ub3RhdGlvblByb3BzOiBNb3ZlQW5ub3RhdGlvblByb3BbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IGN1c3RvbVByb3BzOiBDdXN0b21Qcm9wW10gPSBbXTtcblxuICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSBbXG4gICAgICAgICAgICAuLi5tYXRjaEFsbChcbiAgICAgICAgICAgICAgY29udGVudCxcblxuICAgICAgICAgICAgICAvLyBSZWdFeHAoLyhbQS1aXStcXFtbYS16XFxbXFxdXSpcXF0rKS8sICdnJylcbiAgICAgICAgICAgICAgLy8gUmVnRXhwKC8oW0EtWl0rXFxbLio/XFxdKykvLCAnZycpXG4gICAgICAgICAgICAgIC8vIFJlZ0V4cCgvW0EtWl0rKFxcWy4qP1xcXSl7MSx9LywgJ2cnKVxuICAgICAgICAgICAgICBSZWdFeHAoL1tBLVpdKyhcXFtbXFxzXFxTXSo/XFxdKXsxLH0vLCAnZycpXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF07XG5cbiAgICAgICAgICBtYXRjaGVzLmZvckVhY2gobSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbk1hdGNoID0gbVswXS5tYXRjaCgvKFtBLVpdKylcXFsvKTtcbiAgICAgICAgICAgIGlmICh0b2tlbk1hdGNoKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5NYXRjaFsxXTtcbiAgICAgICAgICAgICAgaWYgKE1PVkVfUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIG1vdmVQcm9wcy5wdXNoKE1vdmVQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChTRVRVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgc2V0dXBQcm9wcy5wdXNoKFNldHVwUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoUk9PVF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgcm9vdFByb3BzLnB1c2goUm9vdFByb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE1BUktVUF9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbWFya3VwUHJvcHMucHVzaChNYXJrdXBQcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChHQU1FX0lORk9fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvUHJvcHMucHVzaChHYW1lSW5mb1Byb3AuZnJvbShtWzBdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKE5PREVfQU5OT1RBVElPTl9QUk9QX0xJU1QuaW5jbHVkZXModG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgbm9kZUFubm90YXRpb25Qcm9wcy5wdXNoKE5vZGVBbm5vdGF0aW9uUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoTU9WRV9BTk5PVEFUSU9OX1BST1BfTElTVC5pbmNsdWRlcyh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBtb3ZlQW5ub3RhdGlvblByb3BzLnB1c2goTW92ZUFubm90YXRpb25Qcm9wLmZyb20obVswXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChDVVNUT01fUFJPUF9MSVNULmluY2x1ZGVzKHRva2VuKSkge1xuICAgICAgICAgICAgICAgIGN1c3RvbVByb3BzLnB1c2goQ3VzdG9tUHJvcC5mcm9tKG1bMF0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2hhID0gY2FsY1NIQSh0aGlzLmN1cnJlbnROb2RlLCBtb3ZlUHJvcHMsIHNldHVwUHJvcHMpO1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMudHJlZS5wYXJzZTxTZ2ZOb2RlPih7XG4gICAgICAgICAgICAgIGlkOiBzaGEsXG4gICAgICAgICAgICAgIG5hbWU6IHNoYSxcbiAgICAgICAgICAgICAgaW5kZXg6IGNvdW50ZXIsXG4gICAgICAgICAgICAgIG51bWJlcjogMCxcbiAgICAgICAgICAgICAgbW92ZVByb3BzLFxuICAgICAgICAgICAgICBzZXR1cFByb3BzLFxuICAgICAgICAgICAgICByb290UHJvcHMsXG4gICAgICAgICAgICAgIG1hcmt1cFByb3BzLFxuICAgICAgICAgICAgICBnYW1lSW5mb1Byb3BzLFxuICAgICAgICAgICAgICBub2RlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICAgICAgICBtb3ZlQW5ub3RhdGlvblByb3BzLFxuICAgICAgICAgICAgICBjdXN0b21Qcm9wcyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Tm9kZSkge1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlLmFkZENoaWxkKG5vZGUpO1xuXG4gICAgICAgICAgICAgIG5vZGUubW9kZWwubnVtYmVyID0gZ2V0Tm9kZU51bWJlcihub2RlKTtcbiAgICAgICAgICAgICAgbm9kZS5tb2RlbC5jaGlsZHJlbiA9IFtub2RlXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMucm9vdCA9IG5vZGU7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjID09PSAnKCcgJiYgdGhpcy5jdXJyZW50Tm9kZSkge1xuICAgICAgICBzdGFjay5wdXNoKHRoaXMuY3VycmVudE5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKGMgPT09ICcpJyAmJiBzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5OT0RFX0RFTElNSVRFUlMuaW5jbHVkZXMoYykpIHtcbiAgICAgICAgbm9kZVN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBUcmVlTW9kZWwgZnJvbSAndHJlZS1tb2RlbCc7XG5pbXBvcnQge1Jvb3RQcm9wfSBmcm9tICcuL3Byb3BzJztcbmltcG9ydCB7U2dmTm9kZX0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IHRyZWU6IFRyZWVNb2RlbCA9IG5ldyBUcmVlTW9kZWwoKTtcblxuY29uc3QgaW5pdFJvb3RQcm9wcyA9IFtcbiAgJ0ZGWzRdJyxcbiAgJ0dNWzFdJyxcbiAgJ0NBW1VURi04XScsXG4gICdBUFtnaG9zdGdvOjAuMS4wXScsXG4gICdTWlsxOV0nLFxuICAnU1RbMF0nLFxuXS5tYXAocCA9PiBSb290UHJvcC5mcm9tKHApKTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxSb290ID0gKCkgPT5cbiAgdHJlZS5wYXJzZSh7XG4gICAgaWQ6ICdyb290JyxcbiAgICBuYW1lOiAwLFxuICAgIGluZGV4OiAwLFxuICAgIG51bWJlcjogMCxcbiAgICByb290UHJvcHM6IGluaXRSb290UHJvcHMsXG4gICAgbW92ZVByb3BzOiBbXSxcbiAgICBzZXR1cFByb3BzOiBbXSxcbiAgICBtYXJrdXBQcm9wczogW10sXG4gICAgZ2FtZUluZm9Qcm9wczogW10sXG4gICAgbm9kZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgbW92ZUFubm90YXRpb25Qcm9wczogW10sXG4gICAgY3VzdG9tUHJvcHM6IFtdLFxuICB9KTtcbiJdLCJuYW1lcyI6WyJiYXNlU2xpY2UiLCJhcnJheSIsInN0YXJ0IiwiZW5kIiwiaW5kZXgiLCJsZW5ndGgiLCJyZXN1bHQiLCJBcnJheSIsIl9iYXNlU2xpY2UiLCJlcSIsInZhbHVlIiwib3RoZXIiLCJlcV8xIiwiZnJlZUdsb2JhbCIsIl90eXBlb2YiLCJnbG9iYWwiLCJPYmplY3QiLCJfZnJlZUdsb2JhbCIsInJlcXVpcmUkJDAiLCJmcmVlU2VsZiIsInNlbGYiLCJyb290IiwiRnVuY3Rpb24iLCJfcm9vdCIsIlN5bWJvbCIsIl9TeW1ib2wiLCJvYmplY3RQcm90byIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwibmF0aXZlT2JqZWN0VG9TdHJpbmciLCJ0b1N0cmluZyIsInN5bVRvU3RyaW5nVGFnIiwidG9TdHJpbmdUYWciLCJ1bmRlZmluZWQiLCJnZXRSYXdUYWciLCJpc093biIsImNhbGwiLCJ0YWciLCJ1bm1hc2tlZCIsImUiLCJfZ2V0UmF3VGFnIiwib2JqZWN0VG9TdHJpbmciLCJfb2JqZWN0VG9TdHJpbmciLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMiIsIm51bGxUYWciLCJ1bmRlZmluZWRUYWciLCJiYXNlR2V0VGFnIiwiX2Jhc2VHZXRUYWciLCJpc09iamVjdCIsInR5cGUiLCJpc09iamVjdF8xIiwiYXN5bmNUYWciLCJmdW5jVGFnIiwiZ2VuVGFnIiwicHJveHlUYWciLCJpc0Z1bmN0aW9uIiwiaXNGdW5jdGlvbl8xIiwiTUFYX1NBRkVfSU5URUdFUiIsImlzTGVuZ3RoIiwiaXNMZW5ndGhfMSIsImlzQXJyYXlMaWtlIiwiaXNBcnJheUxpa2VfMSIsInJlSXNVaW50IiwiaXNJbmRleCIsInRlc3QiLCJfaXNJbmRleCIsInJlcXVpcmUkJDMiLCJpc0l0ZXJhdGVlQ2FsbCIsIm9iamVjdCIsIl9pc0l0ZXJhdGVlQ2FsbCIsInJlV2hpdGVzcGFjZSIsInRyaW1tZWRFbmRJbmRleCIsInN0cmluZyIsImNoYXJBdCIsIl90cmltbWVkRW5kSW5kZXgiLCJyZVRyaW1TdGFydCIsImJhc2VUcmltIiwic2xpY2UiLCJyZXBsYWNlIiwiX2Jhc2VUcmltIiwiaXNPYmplY3RMaWtlIiwiaXNPYmplY3RMaWtlXzEiLCJzeW1ib2xUYWciLCJpc1N5bWJvbCIsImlzU3ltYm9sXzEiLCJOQU4iLCJyZUlzQmFkSGV4IiwicmVJc0JpbmFyeSIsInJlSXNPY3RhbCIsImZyZWVQYXJzZUludCIsInBhcnNlSW50IiwidG9OdW1iZXIiLCJ2YWx1ZU9mIiwiaXNCaW5hcnkiLCJ0b051bWJlcl8xIiwiSU5GSU5JVFkiLCJNQVhfSU5URUdFUiIsInRvRmluaXRlIiwic2lnbiIsInRvRmluaXRlXzEiLCJ0b0ludGVnZXIiLCJyZW1haW5kZXIiLCJ0b0ludGVnZXJfMSIsIm5hdGl2ZUNlaWwiLCJNYXRoIiwiY2VpbCIsIm5hdGl2ZU1heCIsIm1heCIsImNodW5rIiwic2l6ZSIsImd1YXJkIiwicmVzSW5kZXgiLCJjaHVua18xIiwiS2kiLCJUaGVtZSIsIkNlbnRlciIsIk1hcmt1cCIsIlByb2JsZW1BbnN3ZXJUeXBlIiwiR1JJRCIsIl9fZXh0ZW5kcyIsIm1hdGNoQWxsIiwiX19zcHJlYWRBcnJheSIsIl9fcmVhZCIsImZhY3RvcnkiLCJtb2R1bGUiLCJleHBvcnRzIiwidGhpcyIsIkNyeXB0b0pTIiwiY3J5cHRvIiwid2luZG93IiwiZ2xvYmFsVGhpcyIsIm1zQ3J5cHRvIiwicmVxdWlyZSIsImVyciIsImNyeXB0b1NlY3VyZVJhbmRvbUludCIsImdldFJhbmRvbVZhbHVlcyIsIlVpbnQzMkFycmF5IiwicmFuZG9tQnl0ZXMiLCJyZWFkSW50MzJMRSIsIkVycm9yIiwiY3JlYXRlIiwiRiIsIm9iaiIsInN1YnR5cGUiLCJDIiwiQ19saWIiLCJsaWIiLCJCYXNlIiwiZXh0ZW5kIiwib3ZlcnJpZGVzIiwibWl4SW4iLCJpbml0IiwiJHN1cGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJpbnN0YW5jZSIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eU5hbWUiLCJjbG9uZSIsIldvcmRBcnJheSIsIndvcmRzIiwic2lnQnl0ZXMiLCJlbmNvZGVyIiwiSGV4Iiwic3RyaW5naWZ5IiwiY29uY2F0Iiwid29yZEFycmF5IiwidGhpc1dvcmRzIiwidGhhdFdvcmRzIiwidGhpc1NpZ0J5dGVzIiwidGhhdFNpZ0J5dGVzIiwiY2xhbXAiLCJpIiwidGhhdEJ5dGUiLCJqIiwicmFuZG9tIiwibkJ5dGVzIiwicHVzaCIsIkNfZW5jIiwiZW5jIiwiaGV4Q2hhcnMiLCJiaXRlIiwiam9pbiIsInBhcnNlIiwiaGV4U3RyIiwiaGV4U3RyTGVuZ3RoIiwic3Vic3RyIiwiTGF0aW4xIiwibGF0aW4xQ2hhcnMiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJsYXRpbjFTdHIiLCJsYXRpbjFTdHJMZW5ndGgiLCJjaGFyQ29kZUF0IiwiVXRmOCIsImRlY29kZVVSSUNvbXBvbmVudCIsImVzY2FwZSIsInV0ZjhTdHIiLCJ1bmVzY2FwZSIsImVuY29kZVVSSUNvbXBvbmVudCIsIkJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0iLCJyZXNldCIsIl9kYXRhIiwiX25EYXRhQnl0ZXMiLCJfYXBwZW5kIiwiZGF0YSIsIl9wcm9jZXNzIiwiZG9GbHVzaCIsInByb2Nlc3NlZFdvcmRzIiwiZGF0YVdvcmRzIiwiZGF0YVNpZ0J5dGVzIiwiYmxvY2tTaXplIiwiYmxvY2tTaXplQnl0ZXMiLCJuQmxvY2tzUmVhZHkiLCJfbWluQnVmZmVyU2l6ZSIsIm5Xb3Jkc1JlYWR5IiwibkJ5dGVzUmVhZHkiLCJtaW4iLCJvZmZzZXQiLCJfZG9Qcm9jZXNzQmxvY2siLCJzcGxpY2UiLCJIYXNoZXIiLCJjZmciLCJfZG9SZXNldCIsInVwZGF0ZSIsIm1lc3NhZ2VVcGRhdGUiLCJmaW5hbGl6ZSIsImhhc2giLCJfZG9GaW5hbGl6ZSIsIl9jcmVhdGVIZWxwZXIiLCJoYXNoZXIiLCJtZXNzYWdlIiwiX2NyZWF0ZUhtYWNIZWxwZXIiLCJrZXkiLCJDX2FsZ28iLCJITUFDIiwiYWxnbyIsIkgiLCJLIiwiaXNQcmltZSIsIm4iLCJzcXJ0TiIsInNxcnQiLCJmYWN0b3IiLCJnZXRGcmFjdGlvbmFsQml0cyIsIm5QcmltZSIsInBvdyIsIlciLCJTSEEyNTYiLCJfaGFzaCIsIk0iLCJhIiwiYiIsImMiLCJkIiwiZiIsImciLCJoIiwiZ2FtbWEweCIsImdhbW1hMCIsImdhbW1hMXgiLCJnYW1tYTEiLCJjaCIsIm1haiIsInNpZ21hMCIsInNpZ21hMSIsInQxIiwidDIiLCJuQml0c1RvdGFsIiwibkJpdHNMZWZ0IiwiZmxvb3IiLCJIbWFjU0hBMjU2IiwiZmlsdGVyIiwiZmluZExhc3RJbmRleCIsIlBBVCIsImZsYXR0ZW5EZXB0aCIsInN1bSIsIlRyZWVNb2RlbCIsImNsb25lRGVlcCIsImNvbXBhY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTQSxTQUFTQSxXQUFTQSxDQUFDQyxLQUFLLEVBQUVDLEtBQUssRUFBRUMsR0FBRyxFQUFFO0VBQ3BDLElBQUlDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDVkMsTUFBTSxHQUFHSixLQUFLLENBQUNJLE1BQU0sQ0FBQTtFQUV6QixJQUFJSCxLQUFLLEdBQUcsQ0FBQyxFQUFFO0lBQ2JBLEtBQUssR0FBRyxDQUFDQSxLQUFLLEdBQUdHLE1BQU0sR0FBRyxDQUFDLEdBQUlBLE1BQU0sR0FBR0gsS0FBTSxDQUFBO0FBQy9DLEdBQUE7QUFDREMsRUFBQUEsR0FBRyxHQUFHQSxHQUFHLEdBQUdFLE1BQU0sR0FBR0EsTUFBTSxHQUFHRixHQUFHLENBQUE7RUFDakMsSUFBSUEsR0FBRyxHQUFHLENBQUMsRUFBRTtBQUNYQSxJQUFBQSxHQUFHLElBQUlFLE1BQU0sQ0FBQTtBQUNkLEdBQUE7RUFDREEsTUFBTSxHQUFHSCxLQUFLLEdBQUdDLEdBQUcsR0FBRyxDQUFDLEdBQUtBLEdBQUcsR0FBR0QsS0FBSyxLQUFNLENBQUUsQ0FBQTtBQUNoREEsRUFBQUEsS0FBSyxNQUFNLENBQUMsQ0FBQTtBQUVaLEVBQUEsSUFBSUksTUFBTSxHQUFHQyxLQUFLLENBQUNGLE1BQU0sQ0FBQyxDQUFBO0FBQzFCLEVBQUEsT0FBTyxFQUFFRCxLQUFLLEdBQUdDLE1BQU0sRUFBRTtJQUN2QkMsTUFBTSxDQUFDRixLQUFLLENBQUMsR0FBR0gsS0FBSyxDQUFDRyxLQUFL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QUFNLEVBQUU7WUFDTixFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQTBDLDBDQUFBLENBQUE7WUFDekQsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLENBQUMsR0FBRyxFQUEwQywwQ0FBQSxDQUFBO1lBQ3pELEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxDQUFDLEdBQUcsRUFBMEMsMENBQUEsQ0FBQTtZQUN6RCxFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQTBDLDBDQUFBLENBQUE7WUFDekQsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLENBQUMsR0FBRyxFQUEwQywwQ0FBQSxDQUFBO0FBQzFELFNBQUE7QUFDRCxRQUFBLE1BQU0sRUFBRTtZQUNOLEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxDQUFDLEdBQUcsRUFBMEMsMENBQUEsQ0FBQTtZQUN6RCxFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQTBDLDBDQUFBLENBQUE7WUFDekQsRUFBRyxDQUFBLE1BQUEsQ0FBQSxRQUFRLENBQUMsR0FBRyxFQUEwQywwQ0FBQSxDQUFBO1lBQ3pELEVBQUcsQ0FBQSxNQUFBLENBQUEsUUFBUSxDQUFDLEdBQUcsRUFBMEMsMENBQUEsQ0FBQTtZQUN6RCxFQUFHLENBQUEsTUFBQSxDQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQTBDLDBDQUFBLENBQUE7QUFDMUQsU0FBQTtBQUNGLEtBQUE7SUFDRCxFQUFDLENBQUFBLGFBQUssQ0FBQyxNQUFNLENBQUcsR0FBQTtBQUNkLFFBQUEsS0FBSyxFQUFFLEVBQUEsQ0FBQSxNQUFBLENBQUcsUUFBUSxDQUFDLEdBQUcsRUFBZ0MsZ0NBQUEsQ0FBQTtBQUN0RCxRQUFBLE1BQU0sRUFBRSxDQUFDLEVBQUEsQ0FBQSxNQUFBLENBQUcsUUFBUSxDQUFDLEdBQUcsbUNBQWdDLENBQUM7QUFDekQsUUFBQSxNQUFNLEVBQUUsQ0FBQyxFQUFBLENBQUEsTUFBQSxDQUFHLFFBQVEsQ0FBQyxHQUFHLG1DQUFnQyxDQUFDO0FB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SUFBSSxTQUFTLElBQUksRUFBRSxFQUFFO1FBQ25CLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7QUFDMUQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7QUFDSCxLQUFBOztBQUVELElBQUEsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN4RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDeEQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztBQUNILEtBQUE7O0FBR0QsSUFBQSxJQUFJLFNBQVMsSUFBSSxFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDekQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0FBQ0gsS0FBQTs7QUFFRCxJQUFBLElBQUksU0FBUyxJQUFJLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDekQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ3hELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztZQUN6RCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7QUFDSCxLQUFBOztBQUVELElBQUEsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUU7UUFDckMsT0FBTztZQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDM0QsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQzNELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxZQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxZQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7U0FDcEQsQ0FBQztBQUNILEtBQUE7O0FBRUQsSUFBQSxJQUFJLFNBQVMsSUFBSSxDQUFDLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNwQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQ3pELEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDMUQsRUFBRSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3ZELFlBQUEsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ3RELFlBQUEsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNwRCxDQUFDO0FBQ0gsS0FBQTs7QUFFRCxJQUFBLElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1FBQ25DLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFDMUQsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzFELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUMxRCxFQUFFLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDeEQsWUFBQSxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7QUFDdEQsWUFBQSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO1NBQ3BELENBQUM7QUFDSCxLQUFBO0lBQ0QsT0FBTztRQUNMLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztRQUN6RCxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDekQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1FBQzFELEVBQUUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN4RCxRQUFBLElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztBQUN0RCxRQUFBLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7S0FDcEQsQ0FBQztBQUNKLEVBQUU7SUFFVyxNQUFNLEdBQUcsVUFBQyxDQUFTLEVBQUUsS0FBUyxFQUFFLEtBQVMsRUFBQTtBQUFwQixJQUFBLElBQUEsS0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBUyxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQUUsSUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVMsR0FBQSxDQUFBLENBQUEsRUFBQTtJQUNwRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5RCxFQUFFO0lBRVcsTUFBTSxHQUFHLFVBQUMsQ0FBUyxFQUFFLEtBQVMsRUFBRSxLQUFTLEVBQUE7QUFBcEIsSUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQVMsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUFFLElBQUEsSUFBQSxLQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFTLEdBQUEsQ0FBQSxDQUFBLEVBQUE7SUFDcEQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEUsRUFBRTtBQUVLLElBQU0sb0JBQW9CLEdBQUcsVUFBQyxXQUEwQixFQUFBO0FBQzdELElBQUEsT0FBT3dCLGFBQU0sQ0FDWCxXQUFXLEVBQ1gsVUFBQyxJQUFpQixFQUFFLEtBQWEsRUFBQTtBQUMvQixRQUFBLE9BQUEsS0FBSztBQUNMLFlBQUFDLG9CQUFhLENBQ1gsV0FBVyxFQUNYLFVBQUMsT0FBb0IsRUFBQTtBQUNuQixnQkFBQSxPQUFBLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUE7QUFBNUQsYUFBNEQsQ0FDL0QsQ0FBQTtBQUxELEtBS0MsQ0FDSixDQUFDO0FBQ0osRUFBRTtBQUVLLElBQU0sVUFBVSxHQUFHLFVBQUMsQ0FBMEIsRUFBQTtJQUNuRCxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDdEMsRUFBRTtBQUVLLElBQU0sU0FBUyxHQUFHLFVBQUMsQ0FBMEIsRUFBQTtJQUNsRCxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDdEMsRUFBRTtBQUVLLElBQU0sV0FBVyxHQUFHLFVBQUMsQ0FBMEIsRUFBQTtJQUNwRCxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDdkMsRUFBRTtBQUVXLElBQUEsWUFBWSxHQUFHLFVBQUMsQ0FBMEIsRUFBRSxJQUFTLEVBQUE7OztJQUNoRSxJQUFNLEdBQUcsR0FBRyxDQUFBLEVBQUEsR0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxJQUFJLENBQUMsVUFBQyxDQUFhLEVBQUEsRUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFBLEVBQUEsQ0FBQyxDQUFDO0lBQzVFLElBQU0sR0FBRyxHQUFHLENBQUEsRUFBQSxHQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLElBQUksQ0FBQyxVQUFDLENBQWEsRUFBQSxFQUFLLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUEsRUFBQSxDQUFDLENBQUM7QUFDNUUsSUFBQSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRztBQUFFLFFBQUEsT0FBTyxLQUFLLENBQUM7QUFDL0IsSUFBQSxJQUFJLEdBQUcsRUFBRTtRQUNQLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxD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
