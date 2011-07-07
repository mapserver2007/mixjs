/*
 * mix.js
 * version: 0.1.9 (2011/07/07)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

var Module = {};
Module.create = function(base) {
    var isIE = [,]!=0;
    var prohibits = ["mix", "parent", "has", "__parent__"];
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
    
    var inArray = function(elem, array) {
        for (var i = 0, length = array.length; i < length; i++) {
            if (array[i] === elem) {
                return i;
            }
        }
        return -1;
    };
    
    var hook = function(self, f) {
        return function() {
            return f.apply(self, arguments);
        }
    };
    
    for (var prop in base) {
        for (var i = 0, len = prohibits.length; i < len; i++)  {
            if (inArray(prop, prohibits) !== -1) {
                throw new Error(prop + " method can't be defined.");
            }
        }
    }

    base.has = function(parent) {
        var isMixed = true,
            child = clone(this);

        for (var pprop in parent) {
            isMixed *= (function() {
                for (var cprop in child) {
                    for (var c = clone(child); typeof c !== "undefined";) {
                        // メソッドを持っていない場合
                        if (c[cprop] !== parent[pprop]) {
                            c = c.__parent__;
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
            var orgChildren = this,
                orgParents = arguments;

            var createAncestor = function(pprop, f) {
                // 親が継承済みの場合を考慮するため親の階層を辿る
                var parents = [];
                for (var i = 0, len = orgParents.length; i < len; i++) {
                    var parent = clone(orgParents[i]);
                    while(parent) {
                        for (var prop in parent) {
                            if (typeof f === "function" && inArray(prop, prohibits) === -1) {
                                parent[prop] = f(orgChildren, parent[prop]);
                            }
                        }
                        parents.push(parent);
                        parent = parent[pprop];
                    }
                }
                
                // 子が継承済みの場合を考慮するため子の階層を辿る
                var children = [];
                var child = clone(orgChildren);
                while (child) {
                    for (var prop in child) {
                        if (typeof f === "function" && inArray(prop, prohibits) === -1) {
                            child[prop] = f(orgChildren, child[prop]);
                        }
                    }
                    children.push(child);
                    child = child[pprop];
                }

                var ancestors = children.concat(parents),
                    len = ancestors.length;
                
                var isSameModule = function(m1, m2) {
                    // オブジェクトには親(__parent__)が残っているとhasメソッドで親を参照し続け
                    // 異なるオブジェクトでも同じと判定することがある。単なるオブジェクト同士を比較
                    // する場合はparentで参照しないようにする必要がある。
                    delete m1.__parent__;
                    delete m2.__parent__;
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
                // プロトタイプチェーンが効かないための処置
                for (var k = ancestors.length - 1; k > 0; k--) {
                    var parentNo = k,
                        childNo = parentNo - 1;
                    var child = ancestors[childNo],
                        parent = ancestors[parentNo];
                    
                    child[pprop] = parent;
                    for (var prop in parent) if (!child.hasOwnProperty(prop)) {
                        child[prop] = parent[prop];
                    }
                }

                return ancestors;
            };
            
            var joinAncestors = function(inner, outer) {
                inner[0].parent = outer[0].parent;
                return inner[0];
            };
            
            // 内部用親参照プロパティ(__parent__)を含むオブジェクトに
            // 外部用親参照プロパティ(parent)を結合する。
            return joinAncestors(createAncestor("__parent__"), createAncestor("parent", hook));
        };
    }
    else {
        base.mix = function() {
            var parents = arguments,
                child = clone(this);
                
            var c, cc;

            for (var i = 0, len = parents.length; i < len; i++) {
                var __parent__ = clone(parents[i]);
                    depth = 0;
                
                if (child.has(__parent__)) {
                    throw new Error("mix-in the same module.");
                }
                
                for (c = child; c.__proto__ !== null;) {
                    c = c.__proto__;
                    depth++;
                }

                var propList = ["child"];
                for (var d = 1; d <= depth; d++) {
                    propList[d] = "__proto__";
                };
                
                eval(propList.join(".") + " = __parent__");
            }
            
            for (c = child; c.__proto__ !== null;) {
                c = c.__parent__ = c.__proto__;
            }
            
            for (c = child, cc = clone(child); cc.hasOwnProperty("__parent__");) {
                var cp = clone(cc.__parent__);
                c.parent = {};
                for (var prop in cp) {
                    if (inArray(prop, prohibits) === -1) {
                        c.parent[prop] = hook(child, cp[prop])
                    }
                    else if (prop !== "__parent__") {
                        c.parent[prop] = cp[prop];
                    }
                }
                c = c.parent;
                cc = cc.__parent__;
            }
            
            return child;
        };
    }

    return base;
};