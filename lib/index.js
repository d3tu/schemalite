export class Schema {
    _schema;
    constructor(_schema) {
        this._schema = _schema;
    }
    test(target) {
        return this._test(target, this._schema);
    }
    parse(target) {
        return this._parse(target, this._schema);
    }
    _test(target, schema) {
        if (target == undefined)
            return false;
        switch (this._type(schema)) {
            case String:
                if (typeof target != 'string')
                    return false;
                break;
            case Number:
                if (typeof target != 'number')
                    return false;
                break;
            case Array:
                if (!(target instanceof Array))
                    return false;
                for (const key of target) {
                    if (typeof key == 'string') {
                        if (schema.indexOf(String) < 0)
                            return false;
                    }
                    if (typeof key == 'number') {
                        if (schema.indexOf(Number) < 0)
                            return false;
                    }
                    if (typeof key == 'object') {
                        if (schema.findIndex(val => {
                            if (this._test(key, val))
                                return true;
                        }) < 0)
                            return false;
                    }
                }
                break;
            case Schema:
                if (!schema.test(target))
                    return false;
                break;
            case Object:
                if (typeof target != 'object')
                    return false;
                for (const key of Object.keys(schema)) {
                    if (!(key in target))
                        return false;
                    if (!this._test(target[key], schema[key]))
                        return false;
                }
                break;
        }
        return true;
    }
    _parse(target, schema) {
        let parsed;
        switch (this._type(schema)) {
            case String:
                if (typeof target == 'string')
                    parsed = target;
                else
                    parsed = '';
                break;
            case Number:
                if (typeof target == 'number')
                    parsed = target;
                else
                    parsed = 0;
                break;
            case Array:
                parsed = [];
                if (target instanceof Array) {
                    for (const key of target) {
                        if (typeof key == 'string') {
                            if (schema.indexOf(String) >= 0)
                                parsed.push(key);
                        }
                        if (typeof key == 'number') {
                            if (schema.indexOf(Number) >= 0)
                                parsed.push(key);
                        }
                        if (typeof key == 'object') {
                            let found = false;
                            let _schema;
                            for (const idx in schema) {
                                if (schema[idx] instanceof Schema) {
                                    _schema = schema[idx]._schema;
                                }
                                else {
                                    _schema = schema[idx];
                                }
                                for (const val of Object.keys(_schema)) {
                                    if (val in key) {
                                        found = true;
                                        if (schema[idx] instanceof Schema) {
                                            parsed.push(schema[idx].parse(key));
                                        }
                                        else {
                                            parsed.push(this._parse(key, _schema));
                                        }
                                        break;
                                    }
                                }
                                if (found)
                                    break;
                            }
                        }
                    }
                }
                break;
            case Schema:
                console.log(schema, target);
                parsed = schema.parse(target);
                break;
            case Object:
                parsed = {};
                for (const key of Object.keys(schema)) {
                    parsed[key] = this._parse(target?.[key], schema[key]);
                }
                break;
        }
        return parsed;
    }
    _type(schema) {
        if (schema == String)
            return String;
        if (schema == Number)
            return Number;
        if (schema instanceof Array)
            return Array;
        if (schema instanceof Schema)
            return Schema;
        if (typeof schema == 'object')
            return Object;
    }
}
export default Schema;
