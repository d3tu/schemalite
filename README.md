```ts
export declare type SchemaO = {
    [x: string | number]: SchemaT;
};
export declare type SchemaT = SchemaO | StringConstructor | NumberConstructor | SchemaT[] | Schema | null;
export declare class Schema {
    protected _schema?: SchemaT | undefined;
    constructor(_schema?: SchemaT | undefined);
    test(target?: any): boolean;
    parse(target?: any): SchemaT;
    private _test;
    private _parse;
    private _type;
}
export default Schema;
```
```js
import Schema from 'schemalite'
const User = new Schema({ username: String })
const Group = new Schema({ name: String, users: [User] })
const user = { username: 'user0' }
const group = { name: 'group0', users: [{ username: 'user0' }, { username: 'user1' }] }
User.test(user) // true
Group.test(group) // true
User.parse(user) // parsed schema
Group.parse(group) // parsed schema
```