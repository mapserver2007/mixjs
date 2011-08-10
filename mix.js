/*
 * mix.js
 * version: 0.2.0 (2011/08/10)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

var Mixjs = {};
Mixjs.module = function() {
    var MODULE_DEFINE                     = arguments.length === 1,
        MODULE_DEFINE_WITH_NAME           = arguments.length === 2,
        MODULE_DEFINE_WITH_NAME_AND_SCOPE = arguments.length === 3;
    var isIE = [,]!=0,
        prohibits = ["mix", "parent", "has", "base"],
        modules = [];
    var clone = function(o) {
        var c = {};
        for (var prop in o) if (o.hasOwnProperty(prop)) {
            c[prop] = o[prop];
        }
        if (!isIE) {
            c.__proto__ = o.__proto__;
        }
        return c;
    };

    var include = function(obj, incObjArray) {
        for (var i = 0, len = incObjArray.length; i < len; i++) {
            var incObj = incObjArray[i];
            obj = obj.mix(incObj);
        }
        return obj;
    };

    var inArray = function(elem, array) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === elem) {
                return i;
            }
        }
        return -1;
    };

    var isMixjsModule = function(obj) {
        if (typeof obj === "undefined") return false;
        var mixObj = Mixjs.module({});
        return obj.mix.toString() === mixObj.mix.toString() &&
               obj.has.toString() === mixObj.has.toString();
    };
    
    var isIncludeError = function(obj) {
        return typeof obj !== "object" || (typeof obj === "object" && !isMixjsModule(obj));
    };

    var hook = function(self, f) {
        return function() {
            return f.apply(self, arguments);
        }
    };

    var name, scope, base;
    try {
        if (MODULE_DEFINE) {
            base = arguments[0];
        }
        else if (MODULE_DEFINE_WITH_NAME) {
            if (typeof arguments[0] !== "string") {
                throw "type of name must be string.";
            }
            if (typeof arguments[1] !== "object") {
                throw "type of base must be object.";
            }
            name = arguments[0];
            base = arguments[1];
        }
        else if (MODULE_DEFINE_WITH_NAME_AND_SCOPE) {
            if (typeof arguments[0] !== "string") {
                throw "type of name must be string.";
            }
            if (typeof arguments[1] !== "object") {
                throw "type of scope must be object.";
            }
            if (typeof arguments[2] !== "object") {
                throw "type of base must be object.";
            }
            name = arguments[0];
            base = arguments[2];
        }
    }
    catch (e) {
        throw new Error("Invalid argument: " + e);
    }
    
    for (var prop in base) {
        var i, len;
        for (i = 0, len = prohibits.length; i < len; i++)  {
            if (inArray(prop, prohibits) !== -1) {
                throw new Error(prop + " method can't be defined.");
            }
        }
        if (prop === "include") {
            if (base.include instanceof Array) {
                for (i = 0, len = base.include.length; i < len; i++) {
                    if (isIncludeError(base.include[i])) {
                        throw new Error(prop + " method value must be mixjs module object.");
                    }
                    modules[i] = clone(base.include[i]);
                }
            }
            else {
                if (isIncludeError(base.include)) {
                    throw new Error(prop + " method value must be mixjs module object.");
                }
                modules[0] = clone(base.include);
            }
            delete base.include;
        }
    }

    base.has = function(parent) {
        var isMixed = true,
            child = clone(this);

        for (var pprop in parent) {
            isMixed *= (function() {
                for (var cprop in child) {
                    for (var c = clone(child);;) {
                        if (c[cprop] !== parent[pprop]) {
                            // 親がいる場合
                            if (c.hasOwnProperty("parent")) {
                                c = c.parent;
                            }
                            // 親がいない場合
                            else {
                                break;
                            }
                        }
                        // メソッドを持っている場合
                        else {
                            return true;
                        }
                    }
                }
                // メソッドが見つからなかった場合ここに到達する
                return false;
            })();

            if (!!(!isMixed)) {
                return false;
            }
        }
        return true;
    };

    if (isIE) {
        base.mix = function() {
            // 親が継承済みの場合を考慮するため親の階層を辿る
            var parents = [], parent, child, i;
            for (i = 0, len = arguments.length; i < len; i++) {
                for (parent = clone(arguments[i]);;) {
                    parents.push(parent);
                    if (parent.hasOwnProperty("parent")) {
                        parent = parent.parent;
                    }
                    else {
                        break;
                    }
                }
            }
            // 子が継承済みの場合を考慮するため子の階層を辿る
            var children = [];
            for (var c = clone(this);;) {
                children.push(c);
                if (c.hasOwnProperty("parent")) {
                    c = c.parent;
                }
                else {
                    break;
                }
            }

            var ancestors = children.concat(parents);
            var isSameModule = function(m1, m2) {
                // オブジェクトには親(parent)が残っているとhasメソッドで親を参照し続け
                // 異なるオブジェクトでも同じと判定することがある。単なるオブジェクト同士を比較
                // する場合はparentで参照しないようにする必要がある。
                delete m1.parent;
                delete m2.parent;
                return m1.has(m2);
            }
            
            for (i = 0; i < ancestors.length; i++) {
                var module1 = ancestors[i];
                for (var j = 0; j < ancestors.length; j++) {
                    var module2 = ancestors[j];
                    if (i !== j && isSameModule(module1, module2)) {
                        throw new Error("mix-in the same module.");
                    }
                }
            }

            // 自分の祖先が持っているメソッドを子供に受け継がせる
            for (i = ancestors.length - 1; i > 0; i--) {
                var parentNo = i,
                    childNo = parentNo - 1;
                
                child = ancestors[childNo];
                parent = ancestors[parentNo];

                child.parent = parent;
                child.base = parent.base = ancestors[0];
                for (var prop in parent) if (!child.hasOwnProperty(prop)) {
                    child[prop] = parent[prop];
                }
            }

            return ancestors[0];
        };
    }
    else {
        base.mix = function() {
            var parents = arguments,
            child = clone(this);

            var c, cc;
            for (var i = 0, len = parents.length; i < len; i++) {
                var parent = clone(parents[i]);
                    depth = 0;

                if (child.has(parent)) {
                    throw new Error("mix-in the same module.");
                }

                for (c = child; c.__proto__ !== null;) {
                    c = c.__proto__;
                    depth++;
                }

                var propList = ["child"];
                for (var d = 1; d <= depth; d++) {
                    propList[d] = "__proto__";
                }

                eval(propList.join(".") + " = parent");
            }

            for (c = child; c.__proto__ !== null;) {
                c.base = child;
                c = c.parent = c.__proto__;
            }

            return child;
        };
    }
    
    var isInclude = modules.length !== 0;
    if (MODULE_DEFINE) {
        return isInclude ? include(base, modules) : base;
    }
    else if (MODULE_DEFINE_WITH_NAME) {
        window[name] = isInclude ? include(base, modules) : base;
    }
    else if (MODULE_DEFINE_WITH_NAME_AND_SCOPE) {
        arguments[1][name] = isInclude ? include(base, modules) : base;
    }
};