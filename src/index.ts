export type SchemaO = { [x: string | number]: SchemaT };
export type SchemaT = SchemaO | StringConstructor | NumberConstructor | SchemaT[] | Schema | null;

export class Schema {
  constructor(protected _schema?: SchemaT) { }

  test(target?: any) {
    return this._test(target, this._schema);
  }

  parse(target?: any): SchemaT {
    return this._parse(target, this._schema);
  }

  private _test(target?: any, schema?: SchemaT) {
    if (target == undefined) return false;
    switch (this._type(schema)) {
      case String:
        if (typeof target != 'string') return false;
        break;
      case Number:
        if (typeof target != 'number') return false;
        break;
      case Array:
        if (!(target instanceof Array)) return false;
        for (const key of target) {
          if (typeof key == 'string') {
            if ((schema as SchemaT[]).indexOf(String) < 0) return false;
          }
          if (typeof key == 'number') {
            if ((schema as SchemaT[]).indexOf(Number) < 0) return false;
          }
          if (typeof key == 'object') {
            if ((schema as SchemaT[]).findIndex(val => {
              if (this._test(key, val)) return true;
            }) < 0) return false;
          }
        }
        break;
      case Schema:
        if (!(schema as Schema).test(target)) return false;
        break;
      case Object:
        if (typeof target != 'object') return false;
        for (const key of Object.keys(schema as SchemaO)) {
          if (!(key in target)) return false;
          if (!this._test(target[key], (schema as SchemaO)[key])) return false;
        }
        break;
    }
    return true;
  }

  private _parse(target?: any, schema?: SchemaT) {
    let parsed: any;
    switch (this._type(schema)) {
      case String:
        if (typeof target == 'string') parsed = target
        else parsed = ''
        break;
      case Number:
        if (typeof target == 'number') parsed = target
        else parsed = 0
        break;
      case Array:
        parsed = [];
        if (target instanceof Array) {
          for (const key of target) {
            if (typeof key == 'string') {
              if ((schema as SchemaT[]).indexOf(String) >= 0) parsed.push(key);
            }
            if (typeof key == 'number') {
              if ((schema as SchemaT[]).indexOf(Number) >= 0) parsed.push(key);
            }
            if (typeof key == 'object') {
              let found = false;
              let _schema: SchemaT;
              for (const idx in schema as SchemaT[]) {
                if ((schema as SchemaT[])[idx] instanceof Schema) {
                  _schema = ((schema as SchemaT[])[idx] as Schema)._schema as SchemaT;
                } else {
                  _schema = (schema as SchemaT[])[idx];
                }
                for (const val of Object.keys(_schema as object)) {
                  if (val in key) {
                    found = true;
                    if ((schema as SchemaT[])[idx] instanceof Schema) {
                      (parsed as any[]).push(((schema as SchemaT[])[idx] as Schema).parse(key));
                    } else {
                      (parsed as any[]).push(this._parse(key, _schema));
                    }
                    break;
                  }
                }
                if (found) break;
              }
            }
          }
        }
        break;
      case Schema:
        console.log(schema, target)
        parsed = (schema as Schema).parse(target);
        break;
      case Object:
        parsed = {};
        for (const key of Object.keys(schema as SchemaO)) {
          parsed[key] = this._parse(target?.[key], (schema as SchemaO)[key]);
        }
        break;
    }
    return parsed;
  }

  private _type(schema?: SchemaT) {
    if (schema == String) return String;
    if (schema == Number) return Number;
    if (schema instanceof Array) return Array;
    if (schema instanceof Schema) return Schema;
    if (typeof schema == 'object') return Object;
  }
}

export default Schema;
