/*
 * mix.js
 * version: 0.1.5 (2011/06/14)
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

    base.has = function(parent) {
        var child = clone(this);
        for (var pprop in parent) {
            var isMixed = (function() {
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
            
            if (!isMixed) {
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
            // 自分の祖先が持っているメソッドを子供に受け継がせる
            var ancestors = children.concat(parents);
            for (var k = ancestors.length - 1; k > 0; k--) {
                var parentNo = k,
                    childNo = parentNo - 1;

                var c = ancestors[childNo],
                    p = ancestors[parentNo];

                ancestors[childNo].parent = ancestors[parentNo];

                for (var prop in p) if (!c.hasOwnProperty(prop)) {
                    c[prop] = p[prop];
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
            
            for (var node = child;;) {
                if (node.__proto__ !== null) {
                    node = node.parent = node.__proto__;
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