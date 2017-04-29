interface IUIBuilderOptions {
    baseName: string;
    autoID: boolean;
}
interface IUIBuilderElementAttributes {
    tg?: string;
    id?: string;
    st?: object;
    cl?: Array<string> | string;
    ar?: Object;
    dt?: Object;
    tx?: string;
    ac?: Object;
    sc?: Object;
    cn?: Array<IUIBuilderElementAttributes>;
}
declare class UIBuilderHelpers {
    static isDefined(v: any): boolean;
    static isObject(v: any): boolean;
    static printf(str: string, scope: Object): string;
}
declare class UIBuilder {
    private _defaults;
    private _attrs;
    private _elementCount;
    private _lvl;
    private baseName;
    private autoID;
    constructor(options?: IUIBuilderOptions);
    private _buildElement(attrs, parent?);
    private _build(node, root?);
    getElementCount(): number;
    getNextID(): string;
    getBaseName(): string;
    build(spec: any, parent?: HTMLElement): any;
}
interface IUIComponentAttributes {
    "id": String;
    "className": String;
    "style": Object;
    "attributes": Array<String>;
    "data": Array<String>;
    "actions": Object;
}
declare class UIComponent implements IUIBuilderElementAttributes {
    private static attributes;
    tg?: string;
    id?: string;
    st?: object;
    cl?: Array<string> | string;
    ar?: Object;
    dt?: Object;
    tx?: string;
    ac?: Object;
    sc?: Object;
    cn?: Array<IUIBuilderElementAttributes>;
    constructor(tag?: string, attributes?: IUIComponentAttributes, children?: Array<UIComponent>);
    private map(attributes?);
}
