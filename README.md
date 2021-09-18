# schemalite
### Filter objects.
```javascript
const Schema = require("schemalite"),
  schema = new Schema({
    abc: {
      xyz: String
    }
  }),
  obj = {
    abc: {
      xyz: "123"
    },
    xyz: {
      abc: 123
    }
  };

// types: String, Number, Boolean, Object, Array

console.log("0:", schema.test(obj));

console.log("1:", schema.parse(obj));

obj.abc.xyz = 123;

console.log("2:", schema.test(obj));

console.log("3:", schema.parse(obj));

/*
0: { abc: { xyz: '123' } }
1: { abc: { xyz: '123' } }
2: false
3: { abc: { xyz: '' } }
*/
```