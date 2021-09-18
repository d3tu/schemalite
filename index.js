module.exports = class Schema {
  constructor(schema = {}) {
    this.schema = schema;
  }

  test(obj = {}) {
    return this._test(obj, this.schema);
  }

  parse(obj = {}) {
    return this._parse(obj, this.schema);
  }

  _test(obj, schema = {}, test) {
    for (const key of Object.keys(schema)) {
      if (typeof obj[key] === "undefined") {
        test = true;
        break;
      } else if (typeof schema[key] !== "function") {
        test = this._test(obj[key], schema[key]);
        if (!test) {
          test = true;
          break;
        } else {
          obj[key] = test;
          test = false;
        }
      } else if (typeof schema[key] === "function") {
        const value = (new schema[key]).valueOf();
        if (typeof value !== typeof obj[key] || Array.isArray(value) && !Array.isArray(obj[key])) {
          test = true;
          break;
        }
      }
    }
    return test ? false : Object.assign(...Object.entries(obj).filter(([k]) => schema[k]).map(([k, v]) => ({ [k]: v })));
  }
  
  _parse(obj, schema = {}) {
    for (const key of Object.keys(schema)) {
      if (typeof schema[key] !== "function") {
        if (!obj) obj = {};
        obj[key] = this._parse(obj[key], schema[key]);
      }
      else if (typeof schema[key] === "function") {
        const value = (new schema[key]).valueOf();
        if (!obj) obj = { [key]: value };
        else if (typeof value !== typeof obj[key] || Array.isArray(value) && !Array.isArray(obj[key])) obj[key] = value;
      }
    }
    return Object.assign(...Object.entries(obj).filter(([k]) => schema[k]).map(([k, v]) => ({ [k]: v })));
  }
};