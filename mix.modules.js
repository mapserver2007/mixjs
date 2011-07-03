/*
 * mix.modules.js
 * version: 0.1.14 (2011/07/03)
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
     * jQueryバージョン
     */
    latestJQueryVersion_: "1.6.1",

    /**
     * ホスティングjQueryを開く
     * @param optVersion バージョン
     */
    loadJQuery: function(optVersion) {
        var url = "https://ajax.googleapis.com/ajax/libs/jquery/"
            + (this.latestJQueryVersion_ || optVersion)
            + "/jquery.min.js";

        if (!this.isLoadedScript(url)) {
            var script = document.createElement("script"),
            body = document.getElementsByTagName("html")[0];
            script.setAttribute("src", url);
            script.setAttribute("charset", "UTF-8");
            body.appendChild(script);
        }
    },

    /**
     * スクリプトがすでに読み込まれているかどうか
     * @param path ファイルパス
     * @return 読み込まれていればtrue
     */
    isLoadedScript: function(path) {
        var script = document.getElementsByTagName("script");
        for (var i = 0, len = script.length; i < len; i++) {
            if (script[i].getAttribute("src") === path) {
                return true;
            }
        }
        return false;
    },

    /**
     * Getterメソッドを動的に定義する
     * @param constants 定義に必要なハッシュ
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
     * @param ary 配列
     * @param key ソートキー
     * @return ソート済みデータ
     * @example
     *  [{name: 'a'}, {name: 'c'}, {name: 'b'}] # 要素がハッシュの場合
     *  -> [{name: 'a'}, {name: 'b'}, {name: 'c'}]
     */
    ascSort: function(ary, key) {
        // 要素がHashの場合
        if (ary.length > 0 && typeof ary[0] === "object" && typeof key !== "undefined") {
            ary.sort(function(a, b) {
                return a[key] > b[key] ? 1 : -1;
            });
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
     * @return ソート済みデータ
     */
    descSort: function(data, key) {
        return this.ascSort(data, key).reverse();
    }
});

/**
 * Cookieモジュール
 */
var Cookie = Module.create({
    /**
     * Cookieを設定、取得する
     * @param key Cookieのキー
     * @param value Cookieの値
     * @param options Cookieの設定
     * @example
     *  {expires: {day: 1, hour: 1, min: 1, sec: 1}
     *   domain: "www.yahoo.co.jp"}
     */
    cookie: function(key, value, options) {
        this.options_ = options || {};
        if (typeof value !== "undefined") {
            this.setCookie(key, value);
        }
        else {
            return this.getCookie(key);
        }
    },
    
    /**
     * Cookieを設定する
     * @param key Cookieのキー
     * @param value Cookieの値
     */
    setCookie: function(key, value) {
        var options = this.options_;
        // 値がnullの場合は有効期限も初期化する
        if (typeof value === null) {
            value = "";
            options.expires = {};
        }
        
        var cookie = [];
        cookie.push(key + "=" + encodeURIComponent(value));
        
        var expireTime = function(expire) {
            var time = 0;
            for (var term in expire) {
                switch (term) {
                    // 現在よりx日後
                    case "day":
                        time += 60 * 60 * 24 * expire[term];
                        break;
                    // 現在よりx時間後
                    case "hour":
                        time += 60 * 60 * expire[term];
                        break;
                    // 現在よりx分後
                    case "min":
                        time += 60 * expire[term];
                        break;
                    // 現在よりx秒後
                    case "sec":
                        time += expire[term];
                        break;
                }
            }
            return time;
        };

        var expireUnixTime = (function(expire) {
            var time = ~~(new Date() / 1000);
            return time + expireTime(expire);
        })(options.expires);
        
        var unixTimeToDate = function(ut, optTimeZone) {
            var tz = optTimeZone || 0;
            var date = new Date(ut * 1000);
            date.setTime(date.getTime() + 60 * 60 * 1000 * tz);
            return date;
        };

        if (options.expires) {
            var date;
            if (typeof expireUnixTime === "number") {
                date = new Date();
                date.setTime(unixTimeToDate(expireUnixTime));
            }
            else {
                throw new Error("Illegal arguments of expires: " + options.expires);
            }
            cookie.push("expires=" + date.toUTCString());
            cookie.push("max-age=" + expireTime(options.expires));
        }
        
        cookie.push(options.path ? "path=" + options.path : "");
        cookie.push(options.domain ? "domain=" + options.domain : "");
        cookie.push(options.secure ? "secure" : "");
        document.cookie = cookie.join(";");
    },
    
    /**
     * Cookieを取得する
     * @param key Cookieのキー
     */
    getCookie: function(key) {
        if (document.cookie && document.cookie !== "") {
            var cookies = document.cookie.split(";");
            for (var i = 0, len = cookies.length; i < len; i++) {
                var cookie = cookies[i].replace(/^[\s\u3000\n]+|[\s\u3000\n]+$/g, "");
                if (cookie.substring(0, key.length + 1) == (key + '=')) {
                    return decodeURIComponent(cookie.substring(key.length + 1));
                }
            }
        }
        return null;
    }
});

/**
 * Designモジュール
 */
var Design = Module.create({
    /**
     * デフォルトフィルタ名
     */
    defaultFilterId_: "filter",

    /**
     * ローディングに使用する画像の幅、高さを設定する
     * @param img 画像オブジェクト
     */
    setFilterImageInfo: function(img) {
        var info = {};
        // for chrome, firefox, safari
        if (typeof img.naturalWidth !== "undefined") {
            info.width = img.naturalWidth;
            info.height = img.naturalHeight;
        }
        // for IE
        else if (typeof img.runtimeStyle !== "undefined") {
            info.width = img.runtimeStyle.width;
            info.height = img.runtimeStyle.height;
        }
        // for opera
        else {
        // TODO
        }
        this.filterImage_ = info;
    },

    /**
     * 指定した領域にローディングフィルタをかける
     * @param config フィルタ設定
     * @param optFilterId フィルタID
     */
    showFilter: function(config, optFilterId) {
        var self = this;
        config = config || {};
        this.filterId = optFilterId || this.defaultFilterId_;

        // 領域指定がない場合は画面全体を指定する
        if (typeof config.target === "undefined") {
            config.target = document.body;
        }

        // jQueryオブジェクトをDOMオブジェクトに変換
        if (typeof config.target.length === "number") {
            config.target = config.target.get(0);
        }

        var filtering = function(filterId) {
            var createTextElement = function(str, elem) {
                if (typeof str !== "undefined") {
                    var height = parseInt(elem.offsetHeight, 10) / 2;
                    var div = document.createElement("div");
                    div.style.textAlign = "center";
                    div.style.marginTop = height + "px";
                    div.innerHTML = str;
                    return div;
                }
                else {
                    return null;
                }
            };

            var createImgElement = function(path, elem) {
                if (typeof path !== "undefined") {
                    var filterImg = self.filterImage_;
                    var img = document.createElement("img"),
                        left = (elem.offsetWidth - filterImg.width) / 2,
                        top = (elem.offsetHeight - filterImg.height) / 2;
    
                    img.setAttribute("src", path);
                    img.style.position = "relative";
                    img.style.left = left + "px";
                    img.style.top  = top + "px";
    
                    return img;
                }
                else {
                    return null;
                }
            };

            if (typeof config === "object") {
                config.color  = config.color || "#ffffff";
                config.transParency = config.transParency || "0.7";
                config.img = createImgElement(config.img, config.target);
                config.text = createTextElement(config.text, config.target);
            }

            // 親要素のoffsetを考慮する
            var offsetParent = (function(elem) {
                var top = 0, left = 0;
                while (elem) {
                    top  += elem.offsetTop  || 0;
                    left += elem.offsetLeft || 0;
                    elem = elem.offsetParent;
                }
                return {
                    top: top,
                    left: left
                };
            })(config.target);

            var _filter = document.createElement("div");
            _filter.setAttribute("id", filterId);
            _filter.style.backgroundColor = "#000000";
            _filter.style.MozOpacity      = config.transParency;
            _filter.style.opacity         = config.transParency;
            _filter.style.filter          = 'alpha(opacity=' + config.transParency * 100 + ')';
            _filter.style.color           = config.color;
            _filter.style.width           = config.target.offsetWidth + "px";
            _filter.style.height          = config.target.offsetHeight + "px";
            _filter.style.position        = "absolute";
            _filter.style.top             = offsetParent.top + "px";
            _filter.style.left            = offsetParent.left + "px";
            _filter.style.textAlign       = "left";

            if (config.img)  {
                _filter.appendChild(config.img);
            }
            if (config.text) {
                _filter.appendChild(config.text);
            }
            config.target.appendChild(_filter);
        };

        // 画像を使用する場合
        if (typeof config.img !== "undefined") {
            var isIE = [,]!=0;
            var cacheImg = document.createElement("img");
            cacheImg.setAttribute("src", config.img);
            if (isIE) {
                cacheImg.onLoad = (function(id) {
                    self.setFilterImageInfo(cacheImg);
                    filtering(id);
                })(this.filterId);
            }
            else {
                cacheImg.onload = function() {
                    self.setFilterImageInfo(this);
                    filtering(self.filterId);
                };
            }
        }
        // それ以外
        else {
            filtering(this.filterId);
        }
    },

    /**
     * ローディングフィルタを消去する
     * @param optFilterId フィルタID
     */
    hideFilter: function(optFilterId) {
        var _filter = document.getElementById(optFilterId || this.filterId);
        _filter.parentNode.removeChild(_filter);
    }
});

/**
 * Cacheモジュール
 */
var Cache = Module.create({
    stack_: {},

    /**
     * ミリ秒まで含んだUnixTime*1000の値を返却する
     * @return UnixTime
     */
    getCurrentDate: function() {
        return new Date() / 1e3 * 1000;
    },

    /**
     * Cacheキーを生成して返却する
     * @param key キャッシュキー
     * @param optExpore 期限オブジェクト
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
     * @param key キャッシュキー
     * @param content キャッシュするデータ
     * @param expire 期限オブジェクト
     */
    setCache: function(key, content, expire) {
        if (typeof this.stack_ === "undefined") {
            this.stack_ = {};
        }
        this.stack_[this.createKey(key, expire)] = content;
    },

    /**
     * Cacheを返却する
     * @param key キャッシュキー
     * @return キャッシュデータ
     */
    getCache: function(key) {
        // keyのsuffixとしてUNIX TIMEが付与されている場合は分離する。
        var content, expireTime;
        for (var keyWithExpire in this.stack_) {
            // keyが先頭で一致した場合、keyとcontentを取り出す
            if (keyWithExpire.search(key) === 0) {
                // 期限付きの場合
                if (keyWithExpire.match(/^(.*?)-(\d{13})$/)) {
                    key = RegExp.$1;
                    expireTime = RegExp.$2;
                    // 期限が切れていないかどうか
                    if (expireTime >= this.getCurrentDate()) {
                        content = this.stack_[keyWithExpire];
                    }
                    // 期限切れの場合はキャッシュを消す
                    else {
                        delete this.stack_[keyWithExpire];
                    }
                }
                // 期限なしの場合
                else {
                    key = keyWithExpire;
                    content = this.stack_[keyWithExpire];
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
     * @param options.url              送信先URL
     * @param options.params           送信パラメータ
     * @param options.args             通信パラメータ
     * @param options.successCallback  成功時コールバック関数
     * @param options.errorCallback    失敗時コールバック関数
     * @param options.startFunc        処理開始前に実行する関数
     * @param options.endFunc          処理完了後に実行する関数
     */
    xhr: function(options) {
        var self = this;
        var url              = options.url,
            params           = options.params || {},
            args             = options.args || {},
            successCallback  = options.successCallback,
            errorCallback    = options.errorCallback;

        // JSONPの場合はmix.js独自処理を実行
        if (args.dataType === "jsonp") {
            this.jsonp(options);
        }
        else {
            this.options = options;
            this.start();

            // jQueryが読み込まれていないときはホスティング先から読み込む
            if (typeof jQuery === "undefined") {
                if (typeof Utils !== "undefined") {
                    if (!self.has(Utils)) {
                        self.mix(Utils);
                    }
                    this.loadJQuery();
                }
                else {
                    throw new Error("require jQuery.");
                }
            }

            // start()処理がonloadがらみの場合、非同期処理になるため
            // start()より早く$.ajax()が実行されるためsetTimeoutでタイミングをあわせる
            setTimeout(function() {
                // 動的にjQueryを読み込んだときは遅延ロードする
                (function() {
                    var f = arguments.callee;
                    try {
                        $.ajax({
                            type: args.type || "post",
                            dataType: args.dataType || "json",
                            data: params,
                            cache: args.cache || true,
                            url: url,
                            success: function(data, dataType) {
                                self.success(successCallback, data, args.args);
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                self.error(errorCallback, textStatus, args);
                            }
                        });
                    }
                    catch(e) {
                        if (e.message === "$ is not defined") {
                            setTimeout(function() {
                                f();
                            }, 100);
                        }
                        else {
                            throw e;
                        }
                    }
                })();
            }, 10);
        }
    },

    /**
     * エラー処理可能なJSONPを実行する
     * @param options.url              送信先URL
     * @param options.params           送信パラメータ
     * @param options.args             通信パラメータ
     * @param options.successCallback  成功時コールバック関数
     * @param options.errorCallback    失敗時コールバック関数
     * @param options.startFunc        処理開始前に実行する関数
     * @param options.endFunc          処理完了後に実行する関数
     */
    jsonp: function(options) {
        var self = this;
        var url              = options.url,
            params           = options.params || {},
            args             = options.args || {},
            successCallback  = options.successCallback,
            errorCallback    = options.errorCallback;

        this.options = options;
        this.start();

        var jsonpCallback = args.jsonp || "callback";
        params[jsonpCallback] = "jsonp" + (~~(new Date() / 1000));

        var iframe = document.createElement("iframe");
        iframe.setAttribute("id", jsonpCallback);
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        var doc = iframe.contentWindow.document;

        var qlist = [];
        for (var key in params) { qlist.push(key + "=" + params[key]); }
        var requestURL = url + "?" + qlist.join("&")

        var remove = function() {
            var elem = document.getElementById(jsonpCallback);
            elem.parentNode.removeChild(elem);
        };

        var onload = function() {
            var jsonObject = getCache(url) || doc["jsonObject"];
            if (jsonObject !== undefined) {
                setCache(url, jsonObject);
                self.success(successCallback, jsonObject, args.args);
            }
            else if (typeof errorCallback !== "undefined") {
                self.error(errorCallback, null, args.args);
            }
            remove();
        };

        var isEnableCache = function() {
            return typeof Cache !== "undefined" && self.has(Cache);
        };

        // timeout
        if (typeof args.timeout !== "undefined") {
            setTimeout(function() {
                if (!!document.getElementById(jsonpCallback)) {
                    onload = function() {};
                    if (typeof errorCallback !== "undefined") {
                        self.error(errorCallback, null, args);
                    }
                    remove();
                }
            }, args.timeout)
        }

        // cache
        var setCache = function(key, value, options) {
            if (args.cache === true) {
                if (!isEnableCache()) {
                    throw new Error("require Cache module.")
                }
                self.setCache(key, value, options);
            }
        };

        var getCache = function(key) {
            var data = null;
            if (args.cache === true) {
                if (!isEnableCache()) {
                    throw new Error("require Cache module.")
                }
                data = self.getCache(key);
            }
            return data;
        }

        // キャッシュが有効で、データがキャッシュされている場合
        if (getCache(url)) {
            onload();
        }
        else {
            // for IE
            if (iframe.readyState) {
                iframe.onreadystatechange = function() {
                    if (this.readyState === "complete") {
                        onload();
                    }
                }
            }
            // for modern browsers
            else {
                iframe.onload = onload;
            }

            doc.open();
            doc.write('<script type="text/javascript">'
                + 'function ' + params[jsonpCallback] + '(response) { document["jsonObject"] = response; }'
                + '</script>'
                + '<script type="text/javascript" src="' + requestURL + '"></script>');
            doc.close();
        }
    },

    /**
     * 通信後のコールバックを実行する
     * @param callback コールバック関数名
     * @param response レスポンス
     * @param args     コールバック関数に渡す引数
     */
    callbackCaller: function(callback, response, args) {
        if (typeof callback === "function") {
            callback.call(this, response, args);
            this.end();
        }
        else {
            this.end();
            throw new Error(response.toString());
        }
    },

    /**
     * 指定した関数を実行する
     * @param f    関数名
     * @param args 関数に渡す引数
     */
    functionCaller: function(f, args) {
        if (typeof f === "function") {
            f.call(null, args);
        }
    },

    /**
     * 通信成功後のコールバックを実行する
     * @param callback コールバック関数名
     * @param response レスポンス
     * @param args     コールバック関数に渡す引数
     */
    success: function(callback, response, args) {
        this.callbackCaller(callback, response, args);
    },

    /**
     * 通信失敗後のコールバックを実行する
     * @param callback コールバック関数名
     * @param response レスポンス
     * @param args     コールバック関数に渡す引数
     */
    error: function(callback, response, args) {
        this.callbackCaller(callback, response, args);
    },

    /**
     * 通信開始前に処理を実行する
     */
    start: function() {
        this.functionCaller(this.options.startFunc, this.options.args);
    },

    /**
     * 通信終了後に処理を実行する
     */
    end: function() {
        this.functionCaller(this.options.endFunc, this.options.args);
    }
});