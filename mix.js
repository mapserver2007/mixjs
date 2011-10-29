/*
 * mix.js
 * version: 0.2.1 (2011/10/29)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

var Mixjs = {};
Mixjs.module = function() {
    var MODULE_DEFINE_WITH_NAME           = arguments.length === 2,
        MODULE_DEFINE_WITH_NAME_AND_SCOPE = arguments.length === 3;
    var isIE = [,]!=0,
        prohibits = ["mix", "parent", "has", "base", "__moduleName__"],
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
            if (!obj.has(incObj)) {
                obj = obj.mix(incObj);
            }
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
        var scope = {};
        Mixjs.module("Dummy", scope, {});
        return obj.mix.toString() === scope.Dummy.mix.toString() &&
               obj.has.toString() === scope.Dummy.has.toString();
    };

    var isIncludeError = function(obj) {
        return typeof obj !== "object" || (typeof obj === "object" && !isMixjsModule(obj));
    };

    var hook = function(self, f) {
        return function() {
            return f.apply(self, arguments);
        }
    };
    
    var isCyclic = function(obj) {
        var ca = {}, parent = clone(obj);
        ca[parent.__moduleName__] = parent.__moduleName__;
        
        var cyclicCount = ca[parent.__moduleName__].length,
            cyclicDepth = 0,
            cyclicFlg = false;
        
        while (parent.hasOwnProperty("parent")) {
            // 循環チェック用配列を更新
            ca[parent.__moduleName__] = parent.__moduleName__;
            cyclicDepth++;
            
            // 同じモジュールがcyclicCount回連続で検出されなければ循環可能性が消滅するのでフラグを消す
            if (ca[parent.__moduleName__].length > cyclicCount) {
                cyclicCount = ca[parent.__moduleName__].length;
                cyclicFlg = false;
            }
             
            // 循環が起きている可能性がある場合
            if (cyclicFlg) {
                // 同じモジュールが連続してcyclicCount回検出されたら循環
                if (cyclicDepth === cyclicCount) {
                    return true;
                }
            }
             
            // 同じモジュールが検知された場合は循環が発生した可能性がある
            // この時点では循環になっているかは不明なのでフラグを立てるだけ
            if (cyclicCount < cyclicDepth) {
                // 同じモジュールが検出されたので深さは1
                cyclicDepth = 1;
                cyclicFlg = true;
            }
            
            parent = parent.parent;
        }
        
        return false;
    };

    var uniq = function(ary){
        var o = {}, a = [];
        for (var i = 0; i < ary.length; i++) {
            o[ary[i].__moduleName__] = ary[i];
        }
        for (var key in o) {
            a.push(o[key]);
        }
        return a;
    };

    var name, scope, base;
    try {
        if (MODULE_DEFINE_WITH_NAME) {
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
        else {
            throw "type of name must be string.";
        }
    }
    catch (e) {
        throw new Error("Invalid argument: " + e);
    }

    for (var prop in base) {
        var i, j, len;
        for (i = 0, len = prohibits.length; i < len; i++)  {
            if (inArray(prop, prohibits) !== -1) {
                throw new Error("'" + prop + "' can't be defined.");
            }
        }
        if (prop === "include") {
            if (base[prop] instanceof Array) {
                for (i = 0, len = base[prop].length; i < len; i++) {
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

    base.__moduleName__ = arguments[0];

    base.has = function(parent) {
        var isMixed = true,
            child = clone(this);

        for (var pprop in parent) {
            // 組み込みプロパティは検査対象としない
            if (inArray(pprop, prohibits) !== -1) {
                continue;
            }

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
            var ancestors = [], parents = [], child = clone(this);
            parents.push.apply(parents, arguments);
            parents = uniq(parents);

            ancestors.push(child);
            for (var i = 0, len = parents.length; i < len; i++) {
                var parent = clone(parents[i]);
                if (!child.has(parent)) {
                    ancestors.push(parent);
                }
            }

            for (var j = ancestors.length - 1; j > 0; j--) {
                var parentNo = j,
                    childNo = parentNo - 1;

                var c = ancestors[childNo];
                var p = ancestors[parentNo];

                // 自分の祖先が持っているメソッドを子供に受け継がせる
                for (;;) {
                    for (var prop in p) if (!c.hasOwnProperty(prop)) {
                        if (inArray(prop, prohibits) === -1) {
                            c[prop] = p[prop];
                        }
                    }
                    if (!c.hasOwnProperty("parent")) {
                        break;
                    }
                    c = c.parent;
                }

                c.parent = p;
                c.base = p.base = ancestors[0];
            }
            
            if (isCyclic(ancestors[0])) {
                throw new Error("The module cyclic reference error.");
            }

            return ancestors[0];
        };
    }
    else {
        base.mix = function() {
            var c, cc, p;
            var parents = [], child = clone(this);
            parents.push.apply(parents, arguments);
            parents = uniq(parents);

            for (var i = 0, len = parents.length; i < len; i++) {
                var parent = clone(parents[i]);
                    depth = 0;

                if (child.has(parent)) continue;  

                for (c = child; c.__proto__ !== null;) {
                    c = c.__proto__;
                    depth++;
                }

                var propList = ["child"];
                for (var d = 1; d <= depth; d++) {
                    propList[d] = "__proto__";
                }

                try {
                    eval(propList.join(".") + " = parent");
                }
                catch (e) {
                    // 循環参照エラー
                    if (e.message === "Cyclic __proto__ value") {
                        throw new Error("The module cyclic reference error.");
                    }
                    else {
                        throw e;
                    }
                }
            }

            for (c = child; c.__proto__.hasOwnProperty("mix");) {
                c.base = child;
                c = c.parent = c.__proto__;
            }
            c.base = child;

            return child;
        };
    }

    var isInclude = modules.length !== 0;
    if (MODULE_DEFINE_WITH_NAME) {
        window[name] = isInclude ? include(base, modules) : base;
    }
    else if (MODULE_DEFINE_WITH_NAME_AND_SCOPE) {
        arguments[1][name] = isInclude ? include(base, modules) : base;
    }
};