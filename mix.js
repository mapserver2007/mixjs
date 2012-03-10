/**
 * mix.js
 * version: 0.4.2 (2012/03/10)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

var Mixjs = {};
/**
 * モジュールを定義する
 *
 * 名前空間スコープを指定しない場合、グローバル領域にモジュールが追加される。
 * 名前空間スコープを指定する場合、ローカルオブジェクト内にモジュールが追加される。
 *
 * @example
 *   Mixjs.module('Iphone', {});
 *   Mixjs.module('Iphone', scope, {});
 *
 * @param {String} モジュール名
 * @param {Object} 名前空間スコープ(省略可能)
 * @param {Object} モジュールの要素
 *
 * @static
 */
Mixjs.module = function() {
    'use strict';
    var MODULE_DEFINE_WITH_NAME           = arguments.length === 2,
        MODULE_DEFINE_WITH_NAME_AND_SCOPE = arguments.length === 3,
        PROTOTYPE_CHAIN_TOKEN             = 'd945f6fc3d7f10c65ad54a82d7e2a1b8',
        PROTOTYPE_CHAIN_TOKEN_POSITION    = 12;
    var isIE678 = [,]!=0,
        prohibits = ['mix', 'parent', 'has', 'base', 'hook', '__hookStack__', '__moduleName__'],
        onlyFounder = ['hook', '__hookStack__', 'base'],
        modules = [];

    /**
     * オブジェクトをディープコピーする
     * @param {Object} o コピー元オブジェクト
     * @returns {Object} コピー後オブジェクト
     */
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

    /**
     * 内部Mix-inを実行する
     * @param {MixjsObject} obj include先のmixjsオブジェクト
     * @param {Array.<MixjsObject>} incObjArray includeするmixjsオブジェクト
     * @returns {MixjsObject} include済みmixjsオブジェクト
     */
    var include = function(obj, incObjArray) {
        for (var i = 0, len = incObjArray.length; i < len; i++) {
            var incObj = incObjArray[i];
            if (!obj.has(incObj)) {
                obj = obj.mix(incObj);
            }
        }
        return obj;
    };

    /**
     * 配列の中に要素が含まれるかどうか検出する
     * @param {*} elem 要素
     * @param {Array} array 検索対象の配列
     * @returns {Number} キー番号
     */
    var inArray = function(elem, array) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === elem) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Mixjsオブジェクトかどうか検出する
     * @param {Object} obj 対象オブジェクト
     * @returns {Boolean}
     */
    var isMixjsModule = function(obj) {
        if (typeof obj === 'undefined') return false;
        var scope = {};
        Mixjs.module('Dummy', scope, {});
        return obj.mix.toString() === scope.Dummy.mix.toString() &&
               obj.has.toString() === scope.Dummy.has.toString();
    };

    /**
     * include対象でないオブジェクトかどうか検出する
     * @param {Object} obj 対象オブジェクト
     * @returns {Boolean}
     */
    var isIncludeError = function(obj) {
        return typeof obj !== 'object' || (typeof obj === 'object' && !isMixjsModule(obj));
    };
    
    /**
     * フック処理を実行する
     * @param {Srting} フック対象のメソッド名
     * @param {Function} フック時に実行する関数
     * @param {Boolean} フックを親方向に連鎖的に検索するかどうか
     */
    var hook = function(prop, callback, isChain) {
        var self = this;
        if (inArray(prop, prohibits) !== -1) {
            throw new Error("'" + prop + "' can't be hooking.");
        }
        // isChain=trueの場合、hookのレシーバを親方向に辿り、マッチするメソッド全てをフックする
        // isChain=trueでない場合、フックするレシーバとフック対象のメソッドのレシーバが
        // 一致した場合のみフック処理を実行する
        while (typeof self !== 'undefined') {
            for (var func in self) if (self.hasOwnProperty(func)) {
                if ((typeof prop === 'string' && func === prop) ||
                    (typeof prop === 'object' && prop.test(func))) {
                        pushHookStack(self, func, callback, isChain === true);
                }
            }
            // isChain=trueでない場合、最初にマッチしたメソッドのみフックするので抜ける
            if (isChain !== true) return;
            self = self.parent;
        }
    };
    
    /**
     * フック処理に必要なパラメータをセットする
     * @param {MixjsObject} hookメソッド実行時のレシーバ
     * @param {Srting} フック対象のメソッド名
     * @param {Function} フック時に実行する関数
     * @param {Boolean} フックを親方向に連鎖的に検索するかどうか
     */
    var pushHookStack = function(receiver, prop, callback, isChain) {
        var self = receiver;
        // IE678の場合、始祖に対して__hookStack__を作成する
        if (isIE678) {
            while (self.hasOwnProperty('parent')) {
                self = self.parent;
            }
        }
        if (typeof self.__hookStack__[prop] === 'undefined') {
            self.__hookStack__[prop] = [];
        }
        self.__hookStack__[prop].push({
            receiver: receiver,
            callback: callback,
            isChain: isChain
        });
    };

    /**
     * 指定したメソッドをフックする
     * @param {String} prop メソッド名
     * @param {Function} f メソッド
     * @returns {Function} フックしたメソッド
     */
    var methodHook = function(prop, f) {
        return function() {
            var self = this, target = this;
            if (isIE678) {
                // IE678の場合はプロトタイプチェーンで辿れないので
                // 明示的に始祖まで辿る
                while (self.hasOwnProperty('parent')) {
                    self = self.parent;
                }
                // IE678の場合、同じ名前のメソッド(中身は違うが)が各子供へコピーされているため、
                // 単純にparentを辿るだけだと実体レシーバを取得できない
                // コピーされたメソッドの中身はラップ関数で、トークンが埋めこまれているのでそれを検知する
                while (typeof target !== 'undefined') {
                    if (!isCopied(target[prop])) break;
                    target = target.parent;
                }
            }
            else {
                // 呼び出し元のメソッドの実体レシーバを取得
                while (typeof target !== 'undefined' && !target.hasOwnProperty(prop)) {
                    target = target.parent;
                }
            }
            
            var hookInfo = self.__hookStack__[prop];
            
            if (hookInfo instanceof Array) {
                for (var i = 0; i < hookInfo.length; i++) {
                    var receiver = hookInfo[i].receiver,
                        callback = hookInfo[i].callback,
                        isChain  = hookInfo[i].isChain;
                    if (receiver === target) {
                        callback.apply(receiver, arguments);
                        if (!isChain) break;
                    }
                }
            }

            return f.apply(this, arguments);
        };
    };
    
    /**
     * 循環参照エラーを検出する
     * @param {MixjsObject} obj 対象オブジェクト
     * @returns {Boolean}
     */
    var isCyclic = function(obj) {
        var ca = {}, parent = clone(obj);
        ca[parent.__moduleName__] = parent.__moduleName__;

        var cyclicCount = ca[parent.__moduleName__].length,
            cyclicDepth = 0,
            cyclicFlg = false;

        while (parent.hasOwnProperty('parent')) {
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
    
    /**
     * 親からコピーされた関数であるかどうか(IE6,7,8のみ使用)
     * @param {Function} 対象関数
     * @return {Boolean} 検証結果
     */
    var isCopied = function(func) {
        return func.toString().replace(/\s/g, '').indexOf(PROTOTYPE_CHAIN_TOKEN, 0) === PROTOTYPE_CHAIN_TOKEN_POSITION;
    };

    /**
     * 配列から重複する要素を取り除く
     * @param {Array} ary 対象配列
     * @returns {Array} 重複する要素を取り除いた配列
     */
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
            if (typeof arguments[0] !== 'string') {
                throw "type of name must be string.";
            }
            if (typeof arguments[1] !== 'object') {
                throw "type of base must be object.";
            }
            name = arguments[0];
            base = arguments[1];
        }
        else if (MODULE_DEFINE_WITH_NAME_AND_SCOPE) {
            if (typeof arguments[0] !== 'string') {
                throw "type of name must be string.";
            }
            if (typeof arguments[1] !== 'object') {
                throw "type of scope must be object.";
            }
            if (typeof arguments[2] !== 'object') {
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
        // プロパティが関数の場合のみフックする
        if (typeof base[prop] === "function") {
            base[prop] = methodHook(prop, base[prop]);
        }
    }

    /**
     * 内部Mix-in対象モジュールが存在するか検出する
     * @type {Boolean}
     */
    var isInclude = modules.length !== 0;

    /**
     * モジュール名
     * @type {String}
     */
    base.__moduleName__ = arguments[0];

    /**
     * モジュールがMix-in済みかどうか検出する
     * @param {MixjsObject} parent 対象オブジェクト
     * @returns {Boolean}
     */
    base.has = function(parent) {
        var child = clone(this);

        // 親がmix-in済みの場合分離する
        var parents = [parent];
        while (parent.hasOwnProperty('parent')) {
            parent = parent.parent;
            parents.push(parent);
            if (!parent.hasOwnProperty('parent')) {
                break;
            }
        }

        // 親の階層を辿り比較する。
        // 階層が続く限り連続でマッチしない場合は所有していないとみなす
        var hasModule = false;
        for (var i = 0; i < parents.length; i++) {
            parent = parents[i];
            while (typeof child !== 'undefined') {
                for (var prop in child) if (child.hasOwnProperty(prop)) {
                    if (inArray(prop, prohibits) !== -1) {
                        continue;
                    }
                    // IE678の場合、プロパティをすべて子供にコピーするため、
                    // 親とプロパティ比較すると元のモジュールのプロパティと差異が生じる
                    // コピーしたメソッドの場合は、実体メソッドに該当するまで親を参照し続ける
                    if (typeof child[prop] === 'function' && isCopied(child[prop])) {
                        continue;
                    }
                    // 比較対象のモジュール
                    if (typeof parent[prop] === 'undefined') {
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
                child = child['parent'];
            }
        }

        return hasModule;
    };

    /**
     * モジュールをMix-inする
     * @param {...Object} Mix-in対象オブジェクト
     * @returns {MixjsObject} Mix-in済みオブジェクト
     */
    base.mix = (function() {
        /**
         * レガシーブラウザ(IE6,7,8)向けMix-in処理
         */
        var legacyMix = function() {
            var ancestors = [], parents = [], child = clone(this), i;
            parents.push.apply(parents, arguments);
            parents = uniq(parents);
            ancestors.push(child);

            for (i = 0, len = parents.length; i < len; i++) {
                var parent = clone(parents[i]);
                if (!child.has(parent)) {
                    ancestors.push(parent);
                }
            }
            
            for (i = ancestors.length - 1; i > 0; i--) {
                var parentNo = i,
                    childNo = parentNo - 1;
                var c = ancestors[childNo],
                    p = ancestors[parentNo];

                // 自分の祖先が持っているメソッドを子供に受け継がせる
                // ただし実体をコピーするのではなく、親への参照をラップした関数をコピーする
                for (;;) {
                    for (var prop in p) if (!c.hasOwnProperty(prop)) {
                        if (inArray(prop, prohibits) === -1 && !c.hasOwnProperty(prop)) {
                            if (typeof p[prop] === 'function') {
                                c[prop] = (function(p, c, prop) {
                                    // 受け継ぐメソッドの実体レシーバまで辿る
                                    // 自分自身のレシーバから親方向へpropを検索し、初めに見つかった時点の
                                    // メソッドを実行する
                                    while (!p.hasOwnProperty(prop) && p.hasOwnProperty('parent')) {
                                        p = p.parent;
                                    }
                                    return function() {
                                        "d945f6fc3d7f10c65ad54a82d7e2a1b8";
                                        return p[prop].apply(c, arguments);
                                    };
                                })(p, c, prop);
                            }
                            else {
                                // 関数以外の場合はラップせずそのままコピーする
                                c[prop] = p[prop];
                            }
                        }
                    }
                    if (!c.hasOwnProperty('parent')) {
                        break;
                    }
                    c = c.parent;
                }
                c.parent = p;
                c.base = p.base = ancestors[0];
                c.hook = p.hook = hook;
            }

            child = ancestors[0];
            if (isCyclic(child)) {
                throw new Error("The module cyclic reference error.");
            }
            while (child.hasOwnProperty('parent')) {
                if (child.hasOwnProperty('__hookStack__')) {
                    delete child.__hookStack__;
                }
                child = child.parent;
            }
            child.__hookStack__ = {};

            return ancestors[0];
        };

        /**
         * モダンブラウザ向けMix-in処理
         */
        var modernMix = function() {
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
                    // onlyFounderの各プロパティはプロトタイプチェーンで辿るため
                    // 一番最後の親以外にコピーしない
                    if (inArray(prop, onlyFounder) === -1) {
                        obj[prop] = c[prop];
                    }
                }
                ancestors[i-1] = obj;
            }

            child = ancestors[0];
            for (c = child; Object.getPrototypeOf(c).hasOwnProperty('mix');) {
                c = c.parent = Object.getPrototypeOf(c);
            }
            c.base = child;
            c.hook = hook;
            c.__hookStack__ = {};

            return child;
        };

        return isIE678 ? legacyMix : modernMix;
    })();

    if (MODULE_DEFINE_WITH_NAME) {
        window[name] = isInclude ? include(base, modules) : base;
    }
    else if (MODULE_DEFINE_WITH_NAME_AND_SCOPE) {
        arguments[1][name] = isInclude ? include(base, modules) : base;
    }
};