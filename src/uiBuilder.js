import UIBuilderHelpers from "./uiBuilderHelpers";
import UIComponent from "./uiComponent";

class UIBuilder {
  _defaults = {
    baseName: "UI",
    autoID: false
  };
  _attrs = {
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
  constructor(options) {
    (Object).assign(this, this._defaults, options);
    this._elementCount = this._lvl = 0;
  }
  _buildElement(attrs, parent) {
    try {
      let _attrs = (Object).assign({}, this._attrs, attrs);
      //assign unique element id
      this.autoID &&
        _attrs.id === "" &&
        (_attrs.id = this.getNextID());
      //create base element:
      let el = document.createElement(_attrs.tg);
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
    this._lvl++;
    try {
      for (let i = 0; i < node.length; i++) {
        let children = node[i].cn;
        el = this._buildElement(node[i], root);
        children &&
          UIBuilderHelpers.isDefined(children) &&
          (this._build(children, el));
      }
      node.forEach((attrs) => {
      });
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