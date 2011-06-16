/*
 * mix.js
 * version: 0.1.7 (2011/06/16)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

var Module = {};
Module.create = function(base) {
    var isIE = function() { return !!document.attachEvent; };
    var clone = function(o) {
        var c = {};
        for (var prop in o) if (o.hasOwnProperty(prop)) {
            c[prop] = o[prop];
        }
        if (!isIE()) {
            c.__proto__ = o.__proto__;
        }
        return c;
    };
    
    // 禁止メソッドを定義した場合は例外を起こす
    var prohibit = (function(obj) {
        var prohibits = ["mix", "parent", "has"];
        for (var prop in obj) {
            for (var i = 0, len = prohibits.length; i < len; i++)  {
                var prohibitProp = prohibits[i];
                if (prohibitProp === prop) {
                    return prop;
                }
            }
        }
    })(base);

    if (prohibit) { 
        throw new Error(prohibit + " method can't be defined.");
    };
    
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
    
    if (isIE()) {
        base.mix = function() {
            // 親が継承済みの場合を考慮するため親の階層を辿る
            var parents = [];
            for (var i = 0, len = arguments.length; i < len; i++) {
                for (var parent = clone(arguments[i]);;) {
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
            
            var ancestors = children.concat(parents),
                len = ancestors.length;
            var isSameModule = function(m1, m2) {
                // オブジェクトには親(parent)が残っているとhasメソッドで親を参照し続け
                // 異なるオブジェクトでも同じと判定することがある。単なるオブジェクト同士を比較
                // する場合はparentで参照しないようにする必要がある。
                delete m1.parent;
                delete m2.parent;
                return m1.has(m2);
            }
            
            for (var i = 0; i < len; i++) {
                var module1 = ancestors[i];
                for (var j = 0; j < len; j++) {
                    var module2 = ancestors[j];
                    if (i !== j && isSameModule(module1, module2)) {
                        throw new Error("mix-in the same module.");
                    }
                }
            }
            
            // 自分の祖先が持っているメソッドを子供に受け継がせる
            for (var k = ancestors.length - 1; k > 0; k--) {
                var parentNo = k,
                    childNo = parentNo - 1;
                var child = ancestors[childNo],
                    parent = ancestors[parentNo];
                
                child.parent = parent;
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

            for (var i = 0, len = parents.length; i < len; i++) {
                var parent = clone(parents[i]),
                    depth = 0;
                
                if (child.has(parent)) {
                    throw new Error("mix-in the same module.");
                }
                
                for (var _c = child;;) {
                    _c = _c.__proto__;
                    if (_c !== null) {
                        depth++;
                    }
                    else {
                        break;
                    }
                }
                
                var propList = ["child"];
                for (var d = 1; d <= depth; d++) {
                    propList[d] = "__proto__";
                };
                eval(propList.join(".") + " = parent");
            }
            
            for (var _c = child;;) {
                if (_c.__proto__ !== null) {
                    _c = _c.parent = _c.__proto__;
                }
                else {
                    break;
                }
            }
            return child;
        };
    }

    return base;
};