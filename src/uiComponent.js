import UIBuilderHelpers from "./uiBuilderHelpers";

export default class UIComponent {
  static attributes = {
    "id": "id",
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