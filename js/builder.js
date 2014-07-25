var UIBuilder = (function () {
    //Constructor
    var _UIBuilder = function (options) {
    
        var defaults = {
            baseName: "UI",
            autoID: false,
            onBuildStart: function () {
                console.log("Started building");
            },
            onBuildComplete: function () {
                console.log("Finished building");
            }
        },
            opts = this._extend(options, defaults);

        this._elementCount = 0;
        this._lvl = 0;

        this._baseName = opts.baseName;
        this._autoID = opts.autoID;

        this._onBuildStart = opts.onBuildStart;
        this._onBuildComplete = opts.onBuildComplete;
    };

    var prototype = _UIBuilder.prototype;

    //Internal FNs
    prototype._isValid = function (v) {
        return (v !== undefined && v !== null);
    }

    prototype._isObject = function (v) {
        return (this._isValid(v) && typeof v == "object");
    }

    prototype._extend = function (o, d) {
        var r = {};
        o = o || {};
        d = d || {};
        for (var key in d) {
            if (d.hasOwnProperty(key) && o.hasOwnProperty(key)) r[key] = o[key];
            else r[key] = d[key];
        }
        return r;
    }

    prototype._build = function (node, root) {
        this._lvl++;
        var el = null;
        if (this._isObject(node)) {
            for (var i = 0; i < node.length; i++) {
                var e = node[i];
                el = this.Element(e, root);
                if (this._isValid(e.cn)) this._build(e.cn, el);
            }
        }
        this._lvl--;
        if (this._lvl === 0) this._onBuildComplete(root || el);
        return root || el;
    }

    //Getters & setters
    prototype.getElementCount = function () {
        return this._elementCount;
    }

    prototype.getNextID = function () {
        return this._baseName + "-" + this._elementCount++;
    }

    prototype.setBaseName = function (name) {
        if (this._isValid(name)) this._baseName = name;
        else return false;
        return this;
    }

    prototype.getBaseName = function () {
        return this._baseName;
    }

    prototype.onBuildStart = function (fn) {
        if (typeof fn == "function") this._onBuildStart = fn;
        else return false;
        return this;
    }

    prototype.onBuildComplete = function (fn) {
        if (typeof fn == "function") this._onBuildComplete = fn;
        else return false;
        return this;
    }

    //Element builders
    prototype.Element = function (attrs, appendTo) {
        if (!this._isObject(attrs))
            return false;
        //Default element attributes
        //        var defaults = {
        //            tag: 'div', //tg
        //            id: this.getNextID(), //id
        //            classes: [], //cl
        //            attrs: {}, //ar
        //            datas: {}, //dt
        //            text: "", //tx
        //            actions: {} //ac
        //            // children: []		  //cn
        //        };
        var defaults = {
            tg: 'div', //tag
            id: this._autoID ? this.getNextID() : "", //id
            cl: [], //classes
            ar: {}, //attributes
            dt: {}, //data attributes
            tx: "", //text/HTML
            ac: {} //actions such as on click etc.
            // cn: []		  //children contains element child elements and is optional
        },
            opts = this._extend(attrs, defaults);
        //create base element:
        var el = document.createElement(opts.tg);
        //set element ID:
        if (opts.id != "")
            el.id = opts.id;
        //set element calsses (if any):
        if (this._isObject(opts.cl)) {
            for (var i = 0; i < opts.cl.length; i++)
                el.className += (i > 0 ? " " : "") + opts.cl[i];
        } else el.className = opts.cl;
        //ser element attributes (if any):
        if (this._isObject(opts.ar))
            for (var key in opts.ar)
                if (opts.ar.hasOwnProperty(key))
                    el.setAttribute(key, opts.ar[key]);
                //ser element data attributes (if any):
        if (this._isObject(opts.dt))
            for (var key in opts.dt)
                if (opts.dt.hasOwnProperty(key))
                    el.setAttribute("data-" + key, opts.dt[key]);
                //set element inner HTML (if any)
        if (opts.tx != "")
            el.innerHTML = opts.tx;
        //append element to the parent element (if set)
        if (this._isObject(appendTo))
            appendTo.appendChild(el);
        return el;
    }

    prototype.build = function (spec, parent) {
        if (this._isObject(spec)) {
            this._onBuildStart(parent);
            this._lvl = 0;
            return this._build(spec, parent);
        } else return false;
    }

    return _UIBuilder;
})(window);