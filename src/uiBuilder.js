import UIBuilderHelpers from "./uiBuilderHelpers";

const UIBuilder_defaults = {
  baseName: "UI",
  autoID: false,
  nestedStyles: false
};
const UIBuilder_attrs = {
  tg: "div",
  id: "",
  ns: false,
  cl: [],
  st: {},
  ar: {},
  dt: {},
  tx: "",
  ac: {},
  sc: {}
};

export default class UIBuilder {  
  constructor(options) {
    (Object).assign(this, UIBuilder_defaults, options);
    this._style = [];
    this._elementCount = this._lvl = 0;
  }
  _parseStyle(el, style) {

  }
  _buildElement(attrs, parent) {
    try {
      let _attrs = (Object).assign({}, UIBuilder_attrs, attrs);
      //assign unique element id
      this.autoID &&
        _attrs.id === "" &&
        (_attrs.id = this.getNextID());
      //handle string element
      UIBuilderHelpers.isString(attrs) &&
      (_attrs.tg = "span", _attrs.tx = attrs.valueOf());
      //create base element:
      let el = _attrs.ns ? document.createElementNS(_attrs.ns, _attrs.tg) :
        document.createElement(_attrs.tg);
      //set element ID:
      _attrs.id !== "" && (el.id = _attrs.id);
      //set element classes (if any):
      (v => {
        return UIBuilderHelpers.isObject(v) ?
          v :
          v.split(" ");
      })(_attrs.cl)
        .forEach((cls) => el.classList.add(cls));
      //set element attributes (if any):
      Object
        .keys(_attrs.ar)
        .forEach((key) => el.setAttribute(key, _attrs.ar[key]));
      //set element data attributes (if any):
      Object
        .keys(_attrs.dt)
        .forEach((key) => el.setAttribute("data-" + key, _attrs.ar[key]));
      //set element styles (if any):
      Object.assign(el.style, _attrs.st);
      //set element actions (if any):
      Object
        .keys(_attrs.ac)
        .forEach((key) => el.addEventListener(key, _attrs.ac[key].bind(_attrs.sc)));
      //set element inner HTML (if any)
      el.innerHTML = UIBuilderHelpers.printf(_attrs.tx, _attrs.sc);
      //append element to the parent element (if set)
      parent &&
        UIBuilderHelpers.isObject(parent) &&
        (parent.appendChild(el));
      return el;
    } catch (e) {
      throw new Error("UIBuilder._buildElement internal error. Details: " + e);
    }
  }
  _build(node, root) {
    let el;
    let worker = (node => {
      var children = node.cn;
      el = this._buildElement(node, root);
      children &&
        UIBuilderHelpers.isDefined(children) &&
        (this._build(children, el));
    }).bind(this);
    this._lvl++;
    try {
      switch (true) {
        case UIBuilderHelpers.isArray(node):
          for (var i = 0; i < node.length; i++) worker(node[i]);
          break;
        case UIBuilderHelpers.isObject(node):
          worker(node);
          break;
      }
      this._lvl--;
      return root || el || new HTMLElement;
    } catch (e) {
      throw new Error("UIBuilder._build internal error. Details: " + e);
    }
  }
  getElementCount() {
    return this._elementCount;
  }
  getNextID() {
    return this.baseName + "-" + this._elementCount++;
  }
  getBaseName() {
    return this.baseName;
  }

  build(spec, parent) {
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
