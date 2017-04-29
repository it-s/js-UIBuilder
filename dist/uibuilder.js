var UIBuilderHelpers = (function () {
    function UIBuilderHelpers() {
    }
    UIBuilderHelpers.isDefined = function (v) {
        return v != undefined;
    };
    UIBuilderHelpers.isObject = function (v) {
        return (this.isDefined(v) && typeof v == "object");
    };
    UIBuilderHelpers.printf = function (str, scope) {
        var regex = /\{\{(\w+)\}\}/g;
        var instance = str;
        var from, to, m;
        if (this.isObject(scope))
            while ((m = regex.exec(str)) !== null) {
                from = m[0];
                to = scope[m[1]];
                this.isDefined(to) &&
                    (instance = instance.replace(from, to));
            }
        else
            return str;
        return instance;
    };
    return UIBuilderHelpers;
}());
var UIBuilder = (function () {
    function UIBuilder(options) {
        this._defaults = {
            baseName: "UI",
            autoID: false
        };
        this._attrs = {
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
        Object.assign(this, this._defaults, options);
        this._elementCount = this._lvl = 0;
    }
    UIBuilder.prototype._buildElement = function (attrs, parent) {
        try {
            var _attrs_1 = Object.assign({}, this._attrs, attrs);
            this.autoID &&
                _attrs_1.id === "" &&
                (_attrs_1.id = this.getNextID());
            var el_1 = document.createElement(_attrs_1.tg);
            _attrs_1.id !== "" && (el_1.id = _attrs_1.id);
            (function (v) {
                return UIBuilderHelpers.isObject(v) ?
                    v :
                    v.split(" ");
            })(_attrs_1.cl)
                .forEach(function (cls) { return el_1.classList.add(cls); });
            Object
                .keys(_attrs_1.ar)
                .forEach(function (key) { return el_1.setAttribute(key, _attrs_1.ar[key]); });
            Object
                .keys(_attrs_1.dt)
                .forEach(function (key) { return el_1.setAttribute("data-" + key, _attrs_1.ar[key]); });
            Object.assign(el_1.style, _attrs_1.st);
            Object
                .keys(_attrs_1.ac)
                .forEach(function (key) { return el_1.addEventListener(key, _attrs_1.ac[key].bind(_attrs_1.sc)); });
            el_1.innerHTML = _attrs_1.tx;
            parent &&
                UIBuilderHelpers.isObject(parent) &&
                (parent.appendChild(el_1));
            return el_1;
        }
        catch (e) {
            console.error("UIBuilder._buildElement internal error. Details: " + e);
        }
        return new HTMLElement;
    };
    UIBuilder.prototype._build = function (node, root) {
        var el;
        this._lvl++;
        try {
            for (var i = 0; i < node.length; i++) {
                var children = node[i].cn;
                el = this._buildElement(node[i], root);
                children &&
                    UIBuilderHelpers.isDefined(children) &&
                    (this._build(children, el));
            }
            node.forEach(function (attrs) {
            });
            this._lvl--;
            return root || el || new HTMLElement;
        }
        catch (e) {
            console.error("UIBuilder._build internal error. Details: " + e);
        }
        return new HTMLElement;
    };
    UIBuilder.prototype.getElementCount = function () {
        return this._elementCount;
    };
    UIBuilder.prototype.getNextID = function () {
        return this.baseName + "-" + this._elementCount++;
    };
    UIBuilder.prototype.getBaseName = function () {
        return this.baseName;
    };
    UIBuilder.prototype.build = function (spec, parent) {
        var _this = this;
        if (!UIBuilderHelpers.isObject(spec))
            throw new TypeError("UIBuilder.build(spec, parent): spec must be an array");
        this._lvl = 0;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._build(spec, parent));
            }
            catch (e) {
                reject(e);
            }
        });
    };
    return UIBuilder;
}());
var UIComponent = (function () {
    function UIComponent(tag, attributes, children) {
        tag &&
            (this.tg = tag);
        attributes &&
            UIBuilderHelpers.isObject(attributes) &&
            (this.map(attributes));
        children &&
            (this.cn = children);
    }
    UIComponent.prototype.map = function (attributes) {
        if (attributes)
            for (var key in attributes)
                this[UIComponent.attributes[key]] = attributes[key];
    };
    return UIComponent;
}());
UIComponent.attributes = {
    "id": "id",
    "className": "cl",
    "style": "st",
    "attributes": "ar",
    "html": "tx",
    "data": "dt",
    "actions": "ac"
};
