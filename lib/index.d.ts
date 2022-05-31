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
