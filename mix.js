/**
 * mix.js
 * version: 0.6.1 (2014/08/20)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

(function(window) {
'use strict';

/**
 * 2重読み込みを防止する
 */
if (window.Mixjs) return;
window.Mixjs = {};

/**
 * 擬似プロトタイプチェーンで使用するトークン
 * @type {String}
 */
var PROTOTYPE_CHAIN_TOKEN = 'd945f6fc3d7f10c65ad54a82d7e2a1b8';

/**
 * トークンの出現位置
 * @type {Number}
 */
var PROTOTYPE_CHAIN_TOKEN_POSITION = 12;

/**
 * 初めてメソッドがコールされる直前に自動実行されるメソッド名
 * @type {String}
 */
var INITIALIZE_PROPERTY = 'initialize';

/**
 * モジュールを定義した直後に自動実行されるメソッド名
 * @type {String}
 */
var STATIC_INITIALIZE_PROPERTY = 'staticInitialize';

/**
 * Mix-in後の自動実行されるメソッド名
 * @type {String}
 */
var MIXED_PROPERTY = 'mixed';

/**
 * 定義禁止のプロパティ名
 * @type {Array}
 */
var prohibits = ['mix',
                 'parent',
                 'has',
                 'equal',
                 'base',
                 'hook',
                 '__hookStack__',
                 '__moduleName__'];

/**
 * 予約済みのプロパティ名
 * @type {Array}
 */
var reservations = [INITIALIZE_PROPERTY,
                    STATIC_INITIALIZE_PROPERTY,
                    MIXED_PROPERTY];

/**
 * IE6,7,8かどうか
 * @type {Boolean}
 */
var isIE678 = [,]!=0;

/**
 * Mixjsオブジェクトを格納する内部スコープ
 * @type {Object}
 */
var innerScope = {};

/**
 * Mixjsオブジェクト判定用のベースモジュール
 * @type {String}
 */
var ATOMIC_MODULE = 'AtomicModule';

/**
 * Mixjsオブジェクトかどうか検出する
 * @param {Object} obj 対象オブジェクト
 * @returns {Boolean}
 */
var isMixjsModule = function(obj) {
    if (typeof obj !== 'object') return false;
    var atomicModule = innerScope[ATOMIC_MODULE];
    return typeof obj.mix !== 'undefined' &&
           typeof obj.has !== 'undefined' &&
           obj.mix.toString() === atomicModule.mix.toString() &&
           obj.has.toString() === atomicModule.has.toString();
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
 * Coreメソッドを追加する
 * @param {Object} core MixjsCoreオブジェクト
 * @param {Object} base ユーザ定義オブジェクト
 * @returns {MixjsObject} Mixjsオブジェクト
 */
var append = function(core, base) {
    if (!isIE678) core = Object.create(core);
    for (var prop in base) if (base.hasOwnProperty(prop)) {
        core[prop] = base[prop];
    }
    return core;
};

/**
 * オブジェクトをディープコピーする
 * @param {Object|Array} o コピー元オブジェクト
 * @returns {Object} コピー後オブジェクト
 */
var clone = function(o) {
    var c, prop;
    o = o || {};
    if (isIE678) {
        c = o instanceof Array ? [] : {};
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
 * MixjsCoreオブジェクトかどうか検出する
 * @param {Object} obj 対象オブジェクト
 * @returns {Boolean}
 */
var isMixjsCoreModule = function(obj) {
    return isMixjsModule(obj) && obj.hasOwnProperty('mix') && obj.hasOwnProperty('has');
};

/**
 * フック処理を実行する
 * @param {Srting} prop フック対象のメソッド名
 * @param {Function} callback フック時に実行する関数
 * @param {Boolean} isChain フックを親方向に連鎖的に検索するかどうか
 */
var hook = function(prop, callback, isChain) {
    var self = this, queue = {};
    var hasKey = function(key, hash) {
        for (var str in hash) {
            if (("#" + str).indexOf(key) !== -1) {
                return true;
            }
        }
        return false;
    };

    if (inArray(prop, prohibits) !== -1 || inArray(prop, reservations) !== -1) {
        throw new Error("'" + prop + "' can't be hooking.");
    }
    // isChain=trueの場合、hookのレシーバを親方向に辿り、マッチするメソッド全てをフックする
    // isChain=trueでない場合、フックするレシーバとフック対象のメソッドのレシーバが
    // 一致した場合のみフック処理を実行する
    while (typeof self !== 'undefined') {
        for (var func in self) if (self.hasOwnProperty(func)) {
            if (inArray(func, prohibits) !== -1 || inArray(func, reservations) !== -1) {
                continue;
            }

            var _prop = prop;
            if (typeof prop === 'object' && prop.test(func)) {
                _prop = func;
            }

            if (typeof _prop !== 'string' || func !== _prop) {
                continue;
            }

            if (self.hasOwnProperty(_prop)) {
                if ((isIE678 && !isCopied(self[_prop]) || !isIE678) && (!hasKey(func, queue) || isChain === true)) {
                    queue[self.__moduleName__ + "#" + func] = {
                        receiver: self,
                        prop: func
                    };
                }
            }
        }

        self = self.parent;
    }

    for (prop in queue) {
        pushHookStack(queue[prop].receiver, queue[prop].prop, callback);
    }
};

/**
 * フック処理に必要なパラメータをセットする
 * @param {MixjsObject} receiver hookメソッド実行時のレシーバ
 * @param {Srting} prop フック対象のメソッド名
 * @param {Function} callback フック時に実行する関数
 */
var pushHookStack = function(receiver, prop, callback) {
    var self = receiver;
    // IE678の場合、始祖に対して__hookStack__を作成する
    if (isIE678) {
        self = readAncestor(self);
    }
    if (typeof self.__hookStack__[prop] === 'undefined') {
        self.__hookStack__[prop] = [];
    }
    self.__hookStack__[prop].push({
        receiver: receiver,
        callback: callback
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

        // レシーバが取得できない場合は例外を出力
        if (!isMixjsModule(self)) {
            throw new Error("Unknown properties of receiver: " + prop);
        }

        if (isIE678) {
            // IE678の場合はプロトタイプチェーンで辿れないので
            // 明示的に始祖まで辿る
            self = readAncestor(self);
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

        var hookInfo = clone(self.__hookStack__[prop]);
        if (hookInfo instanceof Array) {
            for (var i = 0; i < hookInfo.length; i++) {
                var receiver = hookInfo[i].receiver,
                    callback = hookInfo[i].callback;
                if (receiver.__moduleName__ === target.__moduleName__) {
                    callback.apply(target, arguments);
                }
            }
        }

        return f.apply(target, arguments);
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
 * @param {Function} func 対象関数
 * @return {Boolean} 検証結果
 */
var isCopied = function(func) {
    return func.toString().replace(/\s/g, '').indexOf(PROTOTYPE_CHAIN_TOKEN, 0) === PROTOTYPE_CHAIN_TOKEN_POSITION;
};

/**
 * 配列から重複する要素を取り除く
 * @param {Array} ary 対象配列
 * @return {Array} 重複する要素を取り除いた配列
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

/**
 * include対象でないオブジェクトかどうか検出する
 * @param {Object} obj 対象オブジェクト
 * @return {Boolean} 検出結果
 */
var isIncludeError = function(obj) {
    return typeof obj !== 'object' || (typeof obj === 'object' && !isMixjsModule(obj));
};

/**
 * Interfaceモジュールを実装する
 * @param {Object} base Interfaceモジュール
 * @param {Object} module 定義モジュール
 */
var implement = function(base, module) {
    for (var prop in module) if (module.hasOwnProperty(prop)) {
        base[prop] = module[prop];
    }
};

/**
 * 親を再帰的に辿る(IE678で使用)
 * @param {MixjsObject} obj Mixjsオブジェクト
 * @return {MixjsObject} 始祖のMixjsオブジェクト
 */
var readAncestor = function(obj) {
    while (obj.hasOwnProperty('parent')) {
        obj = obj.parent;
    }
    return obj;
};

/**
 * 同じオブジェクトかどうか検出する
 * @param {Object} base Interfaceモジュール
 * @param {Object} module 定義モジュール
 */
var isSameObject = function(o1, o2) {
    // オブジェクト以外は検査しない
    if (typeof o1 !== 'object' || typeof o2 !== 'object') {
        return false;
    }

    var isSame = false;
    for (var prop in o1) if (o1.hasOwnProperty(prop)) {
        // メソッドのみ検査対象とする
        if (typeof o1[prop] !== 'function') {
            continue;
        }
        // 定義禁止プロパティは検査対象外
        if (inArray(prop, prohibits) !== -1) {
            continue;
        }
        // IE678の場合、プロパティをすべて子供にコピーするため、
        // 親とプロパティ比較すると元のモジュールのプロパティと差異が生じる
        // コピーしたメソッドの場合は、実体メソッドに該当するまで親を参照し続ける
        if (typeof o1[prop] === 'function' && isCopied(o1[prop])) {
            continue;
        }
        // 親に子と同じメソッドが存在するかどうか(プロトタイプチェーンではなく自身のメソッドに)
        if (!o2.hasOwnProperty(prop) || o1[prop] !== o2[prop]) {
            return false;
        }
        isSame = true;
    }

    return isSame;
};

/**
 * Mixjsオブジェクトを生成する
 * @param {Object} module 定義モジュール
 */
var createModule = function(module) {
    for (var prop in module) {
        if (module.hasOwnProperty(prop) && inArray(prop, prohibits) === -1 && inArray(prop, reservations) === -1) {
            module.hook(prop, function() {
                var hookStack, hookedProp, i;
                var receiver = this;
                var base = receiver.hasOwnProperty('base') ? receiver.base : receiver;
                if (receiver.hasOwnProperty(INITIALIZE_PROPERTY)) {
                    // initializeメソッドを実行
                    receiver[INITIALIZE_PROPERTY].apply(receiver, arguments);
                    hookStack = isIE678 ? readAncestor(base).__hookStack__ : base.__hookStack__;
                    // initialize用のhookを全て解除
                    for (hookedProp in hookStack) if (hookStack.hasOwnProperty(hookedProp)) {
                        for (i = 0; i < hookStack[hookedProp].length; i++) {
                            if (receiver.__moduleName__ === hookStack[hookedProp][i].receiver.__moduleName__) {
                                // initializeを実行したレシーバに属するhookを解除する
                                // 0番目にセットされたhookオブジェクトが必ずinitialize用hookになるため、
                                // 0番目を固定で削除する
                                hookStack[hookedProp].splice(0, 1);
                                break;
                            }
                        }
                        // 空になったhook配列自体を削除
                        if (isIE678) {
                            receiver = readAncestor(receiver);
                        }
                        if (receiver.__hookStack__[hookedProp].length === 0) {
                            delete receiver.__hookStack__[hookedProp];
                        }
                    }
                }
            });
        }
    }

    return module;
};

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
    var MODULE_DEFINE_WITH_NAME           = arguments.length === 2,
        MODULE_DEFINE_WITH_NAME_AND_SCOPE = arguments.length === 3;
    var name, scope, base = clone(this.__interface__), core = {}, modules = [];

    delete this.__interface__;

    try {
        if (MODULE_DEFINE_WITH_NAME) {
            if (typeof arguments[0] !== 'string') {
                throw "type of name must be string.";
            }
            if (typeof arguments[1] !== 'object') {
                throw "type of base must be object.";
            }
            name = arguments[0];
            implement(base, arguments[1]);
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
            implement(base, arguments[2]);
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
        if (prop === 'include') {
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
     * ベースオブジェクト
     * @type {String}
     */
    core.base = append(core, base);

    /**
     * フックメソッド
     * @type {Function}
     */
    core.hook = hook;

    /**
     * フックスタック
     * @type {Object}
     */
    core.__hookStack__ = {};

    /**
     * モジュールがMix-in済みかどうか検出する
     * モジュールのMix-in順序は考慮しない
     * @param {MixjsObject} parent 対象オブジェクト
     * @returns {Boolean}
     */
    core.has = function(parent) {
        var child = clone(this);

        var ancestors = function(obj) {
            var objList = [obj];
            while (obj.hasOwnProperty('parent')) {
                obj = obj.parent;
                objList.push(obj);
                if (!obj.hasOwnProperty('parent')) {
                    break;
                }
            }
            return objList;
        };

        var parents = ancestors(parent),
            children = ancestors(child);

        // 子 >= 親でなければ[子has親]の関係は成り立たない
        // 包含関係にあっても、所有関係になければhasは成り立たないとみなす
        if (children.length < parents.length) {
            return false;
        }

        // 親の階層を辿り比較する。
        // 子が親のモジュールを完全一致で所有しているかどうかを判断する。
        // ただしモジュールのInclude順は考慮しない。
        // [Class1] has [Class2 mix Class1] -> false
        // [Class2 mix Class1] has [Class1] -> true
        // [Class2 mix Class1] has [Class1 mix Class2] -> true
        // [Class2 mix Class1 mix Class3] has [Class1 mix Class2] -> true
        var hasModuleCount = 0, parentModuleCount = parents.length;
        for (var j = 0; j < children.length; j++) {
            child = children[j];
            for (var i = 0; i < parentModuleCount; i++) {
                parent = parents[i];
                if (isSameObject(child, parent)) {
                    hasModuleCount++;
                }
            }

            if (hasModuleCount === parentModuleCount) {
                return true;
            }
        }

        return hasModuleCount === parentModuleCount;
    };

    /**
     * 同一モジュールかどうか検出する
     * モジュールのMix-inにも対応
     * @param {MixjsObject} parent 対象オブジェクト
     * @returns {Boolean}
     */
    core.equal = function(parent) {
        var child = clone(this);

        var ancestors = function(obj) {
            var objList = [obj];
            while (obj.hasOwnProperty('parent')) {
                obj = obj.parent;
                objList.push(obj);
                if (!obj.hasOwnProperty('parent')) {
                    break;
                }
            }
            return objList;
        };

        var parents = ancestors(parent),
            children = ancestors(child);

        // 子 != 親でなければ[子equal親]の関係は成り立たない
        if (children.length !== parents.length) {
            return false;
        }

        for (var i = 0; i < children.length; i++) {
            if (!isSameObject(children[i], parents[i])) {
                return false;
            }
        }

        return true;
    };

    /**
     * モジュールをMix-inする
     * @param {...Object} Mix-in対象オブジェクト
     * @returns {MixjsObject} Mix-in済みオブジェクト
     */
    core.mix = (function() {
        /**
         * Mix-in時にメソッドを実行する
         * @param {MixjsObject} self Mix-in前のモジュール
         * @param {MixjsObject} base Mix-in済みモジュール
         * @param {Array} Mix-inするモジュール
         */
        var mixed = function(self, base, modules) {
            // Mix-inしたモジュールのinitializeメソッドを実行
            for (var i = 0; i < modules.length; i++) {
                var module = modules[i];
                var _base = base;
                if (!self.has(module) && module.hasOwnProperty(MIXED_PROPERTY)) {
                    while (typeof _base !== 'undefined') {
                        if (_base.__moduleName__ === module.__moduleName__) {
                            _base[MIXED_PROPERTY].call(_base);
                        }
                        _base = _base.parent;
                    }
                }
            }
        };

        /**
         * レガシーブラウザ(IE6,7,8)向けMix-in処理
         */
        var legacyMix = function() {
            var ancestors = [], parents = [], child = clone(this), hookStack = {}, prop, i;
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
                    for (prop in p) if (!c.hasOwnProperty(prop)) {
                        if (inArray(prop, prohibits) === -1) {
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

            // hookStackの内容を統合
            while (typeof child !== 'undefined') {
                if (child.hasOwnProperty('__hookStack__')) {
                    for (prop in child.__hookStack__) if (child.hasOwnProperty(prop)) {
                        if (hookStack.hasOwnProperty(prop)) {
                            hookStack[prop] = hookStack[prop].concat(child.__hookStack__[prop]);
                        }
                        else {
                            hookStack[prop] = child.__hookStack__[prop];
                        }
                    }
                    if (child.hasOwnProperty('parent')) {
                        delete child.__hookStack__;
                    }
                    else {
                        child.__hookStack__ = hookStack;
                    }
                }
                child = child.parent;
            }

            mixed(this, ancestors[0], arguments);

            return ancestors[0];
        };

        /**
         * モダンブラウザ向けMix-in処理
         */
        var modernMix = function() {
            var child, i, c, p, prop, obj;
            var modules = [this], ancestors = [], hookStack = {};
            modules.push.apply(modules, arguments);

            // すべてのモジュールに対して若い世代から順にバラしてancestorsに格納する
            for (i = 0; i < modules.length; i++) {
                child = modules[i];
                // Mix-in対象のモジュールの__hookStack__をマージ
                for (prop in child) if (child.hasOwnProperty(prop)) {
                    if (typeof child.__hookStack__[prop] !== 'undefined') {
                        hookStack[prop] = hookStack[prop] || [];
                        hookStack[prop] = hookStack[prop].concat(child.__hookStack__[prop]);
                    }
                }
                while (Object.getPrototypeOf(child) && !isMixjsCoreModule(child)) {
                    ancestors.push(child);
                    child = Object.getPrototypeOf(child);
                }
            }

            core.__hookStack__ = hookStack;

            ancestors = uniq(ancestors);
            ancestors.push(core);

            for (i = ancestors.length - 1; i > 0; i--) {
                p = ancestors[i], c = ancestors[i-1];
                obj = Object.create(p);
                for (prop in c) if (c.hasOwnProperty(prop)) {
                    obj[prop] = c[prop];
                }
                if (!isMixjsCoreModule(p)) {
                    obj.parent = p;
                }
                ancestors[i-1] = obj;
            }

            core.base = child = ancestors[0];
            core.hook = hook;
            mixed(this, child, arguments);

            return child;
        };

        return isIE678 ? legacyMix : modernMix;
    })();

    var module = createModule(core.base);
    module = isInclude ? include(module, modules) : module;

    if (MODULE_DEFINE_WITH_NAME) {
        window[name] = module;
    }
    else if (MODULE_DEFINE_WITH_NAME_AND_SCOPE) {
        arguments[1][name] = module;
    }

    if (typeof module[STATIC_INITIALIZE_PROPERTY] === 'function') {
        module[STATIC_INITIALIZE_PROPERTY].call(module);
    }
};

/**
 * Interfaceモジュールをセットする
 *
 * @example
 *   Mixjs.interface(Iphone).module('Iphone4s', {})
 *
 * @param {..MixjsObject} Mixjsモジュール
 * @returns {Object} Mixjs
 */
Mixjs.interface = function() {
    var obj = {}, base, prop;
    for (var i = 0, len = arguments.length; i < len; i++) {
        base = arguments[i];
        if (!isMixjsModule(base)) {
            throw new Error("Arguments must be mixjs module object.");
        }
        for (prop in base) if (inArray(prop, prohibits) === -1) {
            obj[prop] = base[prop];
        }
    }
    this.__interface__ = obj;

    return this;
};

/**
 * 比較に使用するベースモジュール
 */
Mixjs.module(ATOMIC_MODULE, innerScope, {});

})(window);