/*
 * mix.js
 * version: 0.3.1 (2012/02/26)
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
    var isIE678 = [,]!=0,
        prohibits = ["mix", "parent", "has", "base", "__moduleName__"],
        modules = [];
    var clone = function(o) {
        var c, prop;
        if (isIE678) {
            c = {};
            for (prop in o) if (o.hasOwnProperty(prop)) {
                c[prop] = o[prop];
            }
            return c;
        }
        else {
            c = Object.create(Object.getPrototypeOf(o));
            var props = Object.getOwnPropertyNames(o);
            for (var name in props) {
                prop = props[name];
                Object.defineProperty(c, prop, Object.getOwnPropertyDescriptor(o, prop));
            }
            return c;
        }
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
            // 同じモジュールが連続してcyclicCount回検出されたら循環
            if (cyclicFlg && cyclicDepth === cyclicCount) {
                return true;
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
        var child = clone(this);

        // 親がmix-in済みの場合分離する
        var parents = [parent];
        while (parent.hasOwnProperty("parent")) {
            parent = parent.parent;
            parents.push(parent);
            if (!parent.hasOwnProperty("parent")) {
                break;
            }
        }
        
        // 親の階層を辿り比較する。
        // 階層が続く限り連続でマッチしない場合は所有していないとみなす
        var hasModule = false;
        for (var i = 0; i < parents.length; i++) {
            parent = parents[i];
            while (typeof child !== "undefined") {
                for (var prop in child) if (child.hasOwnProperty(prop)) {
                    // parentプロパティは検査対象としない
                    // 実体が同じ場合でもmix-inされていると同一と判定されないため
                    if (inArray(prop, prohibits) !== -1) {
                        continue;
                    }
                    // IE678の場合、プロパティをすべて子供にコピーするため、
                    // 親とプロパティ比較すると元のモジュールのプロパティと差異が生じる
                    // 元のモジュールに含まれないプロパティの場合は比較対象としない
                    var cp = child["parent"];
                    if (typeof cp !== "undefined" && cp[prop] === child[prop]) {
                        continue;
                    }
                    // 同じメソッドを持っているかどうか
                    if (child[prop] !== parent[prop]) {
                        hasModule = false;
                        break;
                    }
                    else {
                        hasModule = true;
                    }
                }
                if (hasModule) break;
                child = child["parent"];
            }
        }
        
        return hasModule;
    };

    if (isIE678) {
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
                var c = ancestors[childNo],
                    p = ancestors[parentNo];

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
            var child, i, c, p, obj;
            var modules = [this], ancestors = [];
            modules.push.apply(modules, arguments);
            
            // すべてのモジュールに対して若い世代から順にバラしてancestorsに格納する
            for (i = 0; i < modules.length; i++) {
                child = modules[i];
                while (Object.getPrototypeOf(child)) {
                    ancestors.push(child);
                    child = Object.getPrototypeOf(child);
                }
            }
            
            ancestors = uniq(ancestors);
            for (i = ancestors.length - 1; i > 0; i--) {
                p = ancestors[i], c = ancestors[i-1];
                obj = Object.create(p);
                for (var prop in c) if (c.hasOwnProperty(prop)) {
                    obj[prop] = c[prop];
                }
                ancestors[i-1] = obj;
            }
            
            child = ancestors[0];
            for (c = child; Object.getPrototypeOf(c).hasOwnProperty("mix");) {
                c.base = child;
                c = c.parent = Object.getPrototypeOf(c);
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