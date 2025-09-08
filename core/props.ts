export const MOVE_PROP_LIST = [
  'B',
  // KO is standard in move list but usually be used for komi in gameinfo props
  // 'KO',
  'MN',
  'W',
];
export const SETUP_PROP_LIST = [
  'AB',
  'AE',
  'AW',
  //TODO: PL is a value of color type
  // 'PL'
];
export const NODE_ANNOTATION_PROP_LIST = [
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
export const MOVE_ANNOTATION_PROP_LIST = [
  'BM',
  'DO',
  'IT',
  // TE is standard in move annotation for tesuji
  // 'TE',
];
export const MARKUP_PROP_LIST = [
  'AR',
  'CR',
  'LB',
  'LN',
  'MA',
  'SL',
  'SQ',
  'TR',
];

export const ROOT_PROP_LIST = ['AP', 'CA', 'FF', 'GM', 'ST', 'SZ'];
export const GAME_INFO_PROP_LIST = [
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
export const TIMING_PROP_LIST = ['BL', 'OB', 'OW', 'WL'];
export const MISCELLANEOUS_PROP_LIST = ['FG', 'PM', 'VW'];

export const CUSTOM_PROP_LIST = ['PI', 'PAI', 'NID', 'PAT'];

export const LIST_OF_POINTS_PROP = ['AB', 'AE', 'AW', 'MA', 'SL', 'SQ', 'TR'];

const TOKEN_REGEX = new RegExp(/([A-Z]*)\[([\s\S]*?)\]/);
// Updated regex to handle escaped brackets properly for Text type properties
// (?:[^\]\\]|\\.)* matches any char except ] and \, OR any escaped char
const TOKEN_REGEX_WITH_ESCAPES = new RegExp(/([A-Z]*)\[((?:[^\]\\]|\\.)*)\]/);

export class SgfPropBase {
  public token: string;
  public type: string = '-';
  protected _value: string = '';
  protected _values: string[] = [];

  constructor(token: string, value: string | string[]) {
    this.token = token;
    if (typeof value === 'string' || value instanceof String) {
      this.value = value as string;
    } else if (Array.isArray(value)) {
      this.values = value;
    }
  }

  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }

  toString() {
    return `${this.token}${this._values.map(v => `[${v}]`).join('')}`;
  }
}

export class MoveProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'move';
  }

  static from(str: string) {
    const match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new MoveProp(token, val);
    }
    return new MoveProp('', '');
  }

  // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }
}

export class SetupProp extends SgfPropBase {
  constructor(token: string, value: string | string[]) {
    super(token, value);
    this.type = 'setup';
  }

  static from(str: string) {
    const tokenMatch = str.match(TOKEN_REGEX);
    const valMatches = str.matchAll(/\[([\s\S]*?)\]/g);

    let token = '';
    const vals = [...valMatches].map(m => m[1]);
    if (tokenMatch) token = tokenMatch[1];
    return new SetupProp(token, vals);
  }

  // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }
}

export class NodeAnnotationProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'node-annotation';
  }
  static from(str: string) {
    const match = str.match(TOKEN_REGEX_WITH_ESCAPES);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new NodeAnnotationProp(token, val);
    }
    return new NodeAnnotationProp('', '');
  }

  // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }

  /**
   * Escapes unescaped right brackets in SGF property values
   * Only escapes brackets that are not already escaped
   */
  private escapeValue(value: string): string {
    // Replace ] with \] only if it's not already escaped
    // This regex looks for ] that is NOT preceded by \
    return value.replace(/(?<!\\)\]/g, '\\]');
  }

  toString() {
    return `${this.token}${this._values
      .map(v => `[${this.escapeValue(v)}]`)
      .join('')}`;
  }
}

export class MoveAnnotationProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'move-annotation';
  }
  static from(str: string) {
    const match = str.match(TOKEN_REGEX_WITH_ESCAPES);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new MoveAnnotationProp(token, val);
    }
    return new MoveAnnotationProp('', '');
  }

  // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }
}

export class AnnotationProp extends SgfPropBase {}
export class MarkupProp extends SgfPropBase {
  constructor(token: string, value: string | string[]) {
    super(token, value);
    this.type = 'markup';
  }
  static from(str: string) {
    const tokenMatch = str.match(TOKEN_REGEX);
    const valMatches = str.matchAll(/\[([\s\S]*?)\]/g);

    let token = '';
    const vals = [...valMatches].map(m => m[1]);
    if (tokenMatch) token = tokenMatch[1];
    return new MarkupProp(token, vals);
  }

  // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }
}

export class RootProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'root';
  }
  static from(str: string) {
    const match = str.match(TOKEN_REGEX_WITH_ESCAPES);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new RootProp(token, val);
    }
    return new RootProp('', '');
  }

  // Duplicated code: https://github.com/microsoft/TypeScript/issues/338
  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }
}

export class GameInfoProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'game-info';
  }
  static from(str: string) {
    const match = str.match(TOKEN_REGEX_WITH_ESCAPES);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new GameInfoProp(token, val);
    }
    return new GameInfoProp('', '');
  }

  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }
}

export class CustomProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'custom';
  }
  static from(str: string) {
    const match = str.match(TOKEN_REGEX_WITH_ESCAPES);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new CustomProp(token, val);
    }
    return new CustomProp('', '');
  }

  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }
}

export class TimingProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'Timing';
  }

  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
    if (LIST_OF_POINTS_PROP.includes(this.token)) {
      this._values = newValue.split(',');
    } else {
      this._values = [newValue];
    }
  }

  get values(): string[] {
    return this._values;
  }

  set values(newValues: string[]) {
    this._values = newValues;
    this._value = newValues.join(',');
  }
}

export class MiscellaneousProp extends SgfPropBase {}
