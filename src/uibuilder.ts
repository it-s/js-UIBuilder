import UIBuilderHelpers from "./uibuilderHelpers";

interface IUIBuilderOptions {
  baseName: string;
  autoID: boolean;
}

interface IUIBuilderElementAttributes {
  tg?: string; // tag name
  id?: string; // element id
  st?: object; // element styles as object
  cl?: Array<string> | string; // class list
  ar?: Object; // attributes
  dt?: Object; // data attributres
  tx?: string; // innerText
  ac?: Object; // actions
  sc?: Object; // element scope
  cn?: Array<IUIBuilderElementAttributes>; // element children
}

class UIBuilder {
  private _defaults: IUIBuilderOptions = {
    baseName: "UI",
    autoID: false
  };
  private _attrs: IUIBuilderElementAttributes = {
    tg: "div",
    id: "",
    cl: [],
    st: {},
    ar: {},
    dt: {},
    tx: "",
    ac: {},
    sc: {}
  };
  private _elementCount: number;
  private _lvl: number;
  private baseName: string;
  private autoID: boolean;
  constructor(options?: IUIBuilderOptions) {
    (<any>Object).assign(this, this._defaults, options);
    this._elementCount = this._lvl = 0;
  }
  private _buildElement(attrs: IUIBuilderElementAttributes, parent?: HTMLElement): HTMLElement {
    try {
      let _attrs = (<any>Object).assign({}, this._attrs, attrs);
      //assign unique element id
      this.autoID &&
        _attrs.id === "" &&
        (_attrs.id = this.getNextID());
      //create base element:
      let el: HTMLElement = document.createElement(_attrs.tg);
      //set element ID:
      _attrs.id !== "" && (el.id = _attrs.id);
      //set element classes (if any):
      ((v: any): Array<any> => {
        return UIBuilderHelpers.isObject(v) ?
          v :
          v.split(" ");
      })(_attrs.cl)
        .forEach((cls) => el.classList.add(cls));
      //set element attributes (if any):
      (<any>Object)
        .keys(_attrs.ar)
        .forEach((key: string) => el.setAttribute(key, _attrs.ar[key]));
      //set element data attributes (if any):
      (<any>Object)
        .keys(_attrs.dt)
        .forEach((key: string) => el.setAttribute("data-" + key, _attrs.ar[key]));
      //set element styles (if any):
      (<any>Object).assign(el.style, _attrs.st);
      //set element actions (if any):
      (<any>Object)
        .keys(_attrs.ac)
        .forEach((key: string) => el.addEventListener(key, _attrs.ac[key].bind(_attrs.sc)));
      //set element inner HTML (if any)
      el.innerHTML = UIBuilderHelpers.printf(_attrs.tx, _attrs.sc);
      //append element to the parent element (if set)
      parent &&
        UIBuilderHelpers.isObject(parent) &&
        (parent.appendChild(el));
      return el;
    } catch (e) {
      console.error("UIBuilder._buildElement internal error. Details: " + e);
    }
    return new HTMLElement;
  }
  private _build(node: Array<IUIBuilderElementAttributes>, root?: HTMLElement): HTMLElement {
    let el: HTMLElement;
    this._lvl++;
    try {
      for (let i = 0; i < node.length; i++) {
        let children = node[i].cn;
        el = this._buildElement(node[i], root);
        children &&
          UIBuilderHelpers.isDefined(children) &&
          (this._build(children, el));
      }
      node.forEach((attrs: IUIBuilderElementAttributes) => {
      });
      this._lvl--;
      return root || el || new HTMLElement;
    } catch (e) {
      console.error("UIBuilder._build internal error. Details: " + e);
    }
    return new HTMLElement;
  }
  public getElementCount() {
    return this._elementCount;
  }
  public getNextID() {
    return this.baseName + "-" + this._elementCount++;
  }
  public getBaseName() {
    return this.baseName;
  }

  public build(spec: any, parent?: HTMLElement): Promise<HTMLElement> {
    if (!UIBuilderHelpers.isObject(spec))
      throw new TypeError("UIBuilder.build(spec, parent): spec must be an array");
    this._lvl = 0;
    return new Promise((resolve, reject) => {
      try {
        resolve(this._build(spec, parent));
      } catch (e) {
        reject(e);
      }
    });
  }
}

interface IUIComponentAttributes {
  "id": String,
  "className": String,
  "style": Object,
  "attributes": Array<String> | string,
  "html": String,
  "data": Array<String> | string,
  "scope": Object,
  "actions": Object
}

class UIComponent implements IUIBuilderElementAttributes {
  private static attributes: IUIComponentAttributes = {
    "id": "id",
    "className": "cl",
    "style": "st",
    "attributes": "ar",
    "html": "tx",
    "data": "dt",
    "scope": "sc",
    "actions": "ac"
  }
  tg?: string; // tag name
  id?: string; // element id
  st?: object; // element styles as object
  cl?: Array<string> | string; // class list
  ar?: Object; // attributes
  dt?: Object; // data attributres
  tx?: string; // innerText
  ac?: Object; // actions
  sc?: Object; // element scope
  cn?: Array<IUIBuilderElementAttributes>; // element children
  constructor(tag?: string, attributes?: IUIComponentAttributes, children?: Array<UIComponent>) {
    tag &&
      (this.tg = tag);
    attributes &&
      UIBuilderHelpers.isObject(attributes) &&
      (this.map(attributes));
    children &&
      (this.cn = children);
  }
  private map(attributes?: IUIComponentAttributes): void {
    if (attributes)
      for (let key in attributes)
        this[UIComponent.attributes[key]] = <any>attributes[key];
  }
}