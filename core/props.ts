import matchAll from 'string.prototype.matchall';

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

export class SgfPropBase {
  public token: string;
  public type: string = '-';
  private _value: string = '';
  private _values: string[] = [];

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
}

export class SetupProp extends SgfPropBase {
  constructor(token: string, value: string | string[]) {
    super(token, value);
    this.type = 'setup';
  }

  static from(str: string) {
    const tokenMatch = str.match(TOKEN_REGEX);
    const valMatches = matchAll(str, /\[([\s\S]*?)\]/g);

    let token = '';
    const vals = [...valMatches].map(m => m[1]);
    if (tokenMatch) token = tokenMatch[1];
    return new SetupProp(token, vals);
  }
}

export class NodeAnnotationProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'node-annotation';
  }
  static from(str: string) {
    const match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new NodeAnnotationProp(token, val);
    }
    return new NodeAnnotationProp('', '');
  }
}

export class MoveAnnotationProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'move-annotation';
  }
  static from(str: string) {
    const match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new MoveAnnotationProp(token, val);
    }
    return new MoveAnnotationProp('', '');
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
    const valMatches = matchAll(str, /\[([\s\S]*?)\]/g);

    let token = '';
    const vals = [...valMatches].map(m => m[1]);
    if (tokenMatch) token = tokenMatch[1];
    return new MarkupProp(token, vals);
  }
}

export class RootProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'root';
  }
  static from(str: string) {
    const match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new RootProp(token, val);
    }
    return new RootProp('', '');
  }
}

export class GameInfoProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'game-info';
  }
  static from(str: string) {
    const match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new GameInfoProp(token, val);
    }
    return new GameInfoProp('', '');
  }
}

export class CustomProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'custom';
  }
  static from(str: string) {
    const match = str.match(/([A-Z]*)\[([\s\S]*?)\]/);
    if (match) {
      const token = match[1];
      const val = match[2];
      return new CustomProp(token, val);
    }
    return new CustomProp('', '');
  }
}

export class TimingProp extends SgfPropBase {
  constructor(token: string, value: string) {
    super(token, value);
    this.type = 'Timing';
  }
}

export class MiscellaneousProp extends SgfPropBase {}
