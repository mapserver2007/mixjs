/*
 * mix.modules.js
 * version: 0.1.3 (2011/06/07)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

/**
 * Utilsモジュール
 */
var Utils = Module.create({
    /**
     * ホスティングjQueryを開く
     */
    latestJQueryVersion: "1.6.1",
    loadJQuery: function(optVersion) {
        var url = "https://ajax.googleapis.com/ajax/libs/jquery/"
                + (this.latestJQueryVersion || optVersion)
                + "/jquery.min.js";
        var script = document.createElement("script"),
            body = document.getElementsByTagName("html")[0];
        script.setAttribute("src", url);
        script.setAttribute("charset", "UTF-8");
        body.appendChild(script);
    },
    
    /**
     * Getterメソッドを動的に定義する
     */
    generateGetter: function(constants) {
        var createMethodName = function(str) {
            var snakeParts = str.split("_");
            var camelParts = [];
            for (var i = 0, len = snakeParts.length; i < len; i++) {
                camelParts[i] = snakeParts[i].replace(/\w+/g, function(word) {
                    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
                });
            }
            return "get" + camelParts.join("");
        };
        for (var name in constants) {
            var methodName = createMethodName(name);
            this[methodName] = (function(key) {
                return function() {
                    return constants[key];
                };
            })(name);
        }
    },
    
    /**
     * 昇順ソートする
     * 要素がHashの場合は指定キーで昇順ソートする
     * example:
     * [{name: 'a'}, {name: 'c'}, {name: 'b'}] # 要素がハッシュの場合
     * -> [{name: 'a'}, {name: 'b'}, {name: 'c'}]
     */
    ascSort: function(ary, key) {
        // 要素がHashの場合
        if (ary.length > 0 && typeof ary[0] === "object" && typeof key !== "undefined") {
            ary.sort(function(a, b) { return a[key] > b[key] ? 1 : -1; });
        }
        // 要素が数値または文字列の場合
        else if (ary.length > 0 && (typeof ary[0] === "number" || typeof ary[0] === "string")) {
            ary.sort();
        }
        return ary;
    },
    
    /**
     * 降順ソートする
     * 要素がHashの場合は指定キーで降順ソートする
     */
    descSort: function(data, key) {
        return this.ascSort(data, key).reverse();
    }
});

/**
 * Cacheモジュール
 */
var Cache = Module.create({
    /**
     * 現在の日付(UnixTime)を返却する
     */
    getCurrentDate: function() {
        return ~~(new Date() / 1000);
    },
    
    /**
     * UnixTimeをDateに変換する
     */
    unixTimeToDate: function(ut, optTimeZone) {
        var tz = optTimeZone || 0;
        var date = new Date(ut * 1000);
        date.setTime(date.getTime() + 60 * 60 * 1000 * tz);
        return date;
    },
    
    /**
     * Cacheキーを生成して返却する
     */
    createKey: function(key, optExpire) {
        if (typeof optExpire === "undefined") {
            return key;
        }

        var expireTime = this.getCurrentDate();

        for (var term in optExpire) {
            switch (term) {
            // 現在よりx日後
            case "day":
                expireTime += 60 * 60 * 24 * optExpire[term];
                break;
            // 現在よりx時間後
            case "hour":
                expireTime += 60 * 60 * optExpire[term];
                break;
            // 現在よりx分後
            case "min":
                expireTime += 60 * optExpire[term];
                break;
            // 現在よりx秒後
            case "sec":
                expireTime += optExpire[term];
                break;
            }
        }

        return key + "-" + expireTime;
    },
    
    /**
     * Cacheを設定する
     */
    setCache: function(key, content, expire) {
        if (typeof this.stack === "undefined") { this.stack = {}; }
        this.stack[this.createKey(key, expire)] = content;
    },
    
    /**
     * Cacheを返却する
     */
    getCache: function(keyName) {
        // keyのsuffixとしてUNIX TIMEが付与されている場合は分離する。
        var key, content, expireTime;
        var stack = this.stack;
        for (var keyWithExpire in stack) {
            // keyが先頭で一致した場合、keyとcontentを取り出す
            if (keyWithExpire.search(key) === 0) {
                // 期限付きの場合
                if (keyWithExpire.match(/^(.*?)-(\d{10})$/)) {
                    key = RegExp.$1;
                    expireTime = RegExp.$2;
                    // 期限が切れていないかどうか
                    if (expireTime >= this.getCurrentDate()) {
                        content = stack[keyWithExpire];
                    }
                    // 期限切れの場合はキャッシュを消す
                    else {
                        delete this.stack[keyWithExpire];
                    }
                }
                // 期限なしの場合
                else {
                    key = keyWithExpire;
                    content = stack[keyWithExpire];
                }
                break;
            }
        }

        return content;
    }
});

/**
 * HTTP関連モジュール
 */
var Http = Module.create({
    /**
     * 非同期通信を実行する
     * @param url 送信先URL
     * @param params 送信パラメータ
     * @param optArgs 通信パラメータ
     * @param successCallback 成功時コールバック関数
     * @param optErrorCallback 失敗時コールバック関数
     * @param optStartFunc 処理開始前に実行する関数
     * @param optEndFunc 処理完了後に実行する関数
     */
    xhr: function(url,
                  params,
                  optArgs,
                  successCallback,
                  optErrorCallback,
                  optStartFunc,
                  optEndFunc) {

        var funcCaller = function(f, args) {
            if (typeof f === "function") {
                f.call(null, args);
            }
        };
        var callbackCaller = function(callback, response, optArgs) {
            end();
            if (typeof callback === "function") {
                callback.call(this, response, optArgs);
            }
            else {
                throw response;
            }
        };
        
        var start   = function() { funcCaller(optStartFunc, optArgs); },
            end     = function() { funcCaller(optEndFunc, optArgs); },
            success = function(callback, response, args) { callbackCaller(callback, response, args); },
            error   = function(callback, response, args) { callbackCaller(callback, response, args); };

        start();
        
        // jQueryが読み込まれていないときはホスティング先から読み込む
        if (typeof jQuery === "undefined") {
            if (typeof this.loadJQuery === "undefined") {
                if (typeof Utils !== "undefined") {
                    Utils.loadJQuery();                    
                }
                else {
                    throw "require jQuery.";
                }
            }
            else {
                this.loadJQuery();
            }
        }

        // 動的にjQueryを読み込んだときは遅延ロードする
        (function() {
            var f = arguments.callee;
            try {
                $.ajax({
                    type: optArgs.type || "post",
                    dataType: optArgs.dataType || "json",
                    data: params || {},
                    cache: optArgs.cache || true,
                    url: url,
                    success: function(data, dataType) {
                        success(successCallback, data, optArgs.args);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        error(optErrorCallback, textStatus, optArgs.args);
                    }
                });
            }
            catch(e) {
                if (e.message === "$ is not defined") {
                    setTimeout(function() { f(); }, 100);
                }
                else {
                    throw e;
                }
            }
        })();
    }
});