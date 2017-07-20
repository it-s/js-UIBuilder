import UIBuilderHelpers from "./uiBuilderHelpers";

export default class UIComponent {
  static SVG_NS_ATTR = "http://www.w3.org/2000/svg";
  static attributes = {
    "id": "id",
    "ns": "ns",
    "className": "cl",
    "style": "st",
    "attributes": "ar",
    "html": "tx",
    "data": "dt",
    "scope": "sc",
    "actions": "ac"
  };
  tg; // tag name
  id; // element id
  ns; // NS element attr
  st; // element styles as object
  cl; // class list
  ar; // attributes
  dt; // data attributres
  tx; // innerText
  ac; // actions
  sc; // element scope
  cn; // element children
  constructor(tag, attributes, children) {
    tag &&
      (this.tg = tag);
    attributes &&
      UIBuilderHelpers.isObject(attributes) &&
      (this.map(attributes));
    children &&
      (this.cn = children);
  }
  map(attributes) {
    if (attributes)
      for (let key in attributes)
        this[UIComponent.attributes[key]] = attributes[key];
  }
}