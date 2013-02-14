/*
 * mix.modules.js
 * version: 0.1.20 (2013/02/14)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

/**
 * Utilsモジュール
 */
Mixjs.module("Utils", {
    /**
     * jQueryバージョン
     */
    latestJQueryVersion_: "1.8.3",

    /**
     * ホスティングjQueryを開く
     * @param {Function} callback コールバック関数
     * @param {String} optVersion バージョン
     */
    loadJQuery: function(callback, optVersion) {
        var url = "https://ajax.googleapis.com/ajax/libs/jquery/"
            + (optVersion || this.latestJQueryVersion_)
            + "/jquery.min.js";
        this.loadScript(url, callback);
    },

    /**
     * scriptファイルを読み込む
     * @param {String} url scriptファイルパスまたはURL
     * @param {Function} callback コールバック関数
     */
    loadScript: function(url, callback) {
        if (!this.isLoadedScript(url)) {
            var script = document.createElement("script"),
            body = document.getElementsByTagName("html")[0];
            script.setAttribute("src", url);
            script.setAttribute("charset", "UTF-8");
            if (typeof callback === "function") {
                // for IE
                if (script.readyState) {
                    script.onreadystatechange = function() {
                        if (this.readyState == 'loaded' || this.readyState == 'complete') {
                            callback();
                        }
                    }
                }
                // for modern browsers
                else {
                    script.onload = callback;
                }
            }
            body.appendChild(script);
        }
    },

    /**
     * jQueryが無い場合は読み込んでから処理を実行する
     * 読み込み済みの場合はそのまま関数を実行する
     * @param {Function} callback 処理する関数
     */
    onLoadJQuery: function(callback) {
        // jQueryが読み込まれていないときはホスティング先から読み込む
        if (typeof jQuery === "undefined") {
            this.loadJQuery(callback);
        }
        else {
            callback();
        }
    },

    /**
     * スクリプトがすでに読み込まれているかどうか
     * @param {String} path ファイルパス
     * @return {Boolean}
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
     * @param {Object} constants 定義に必要なハッシュ
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
     * 空文字かnullかundefinedかどうか判定する
     * @param {Object} constants 定義に必要なハッシュ
     */
    isBlank: function(data) {
        if (typeof data === 'object') {
            var isEmpty = true;
            for (var o in data) { isEmpty = false; }
            return isEmpty;
        }
        else if (typeof data === 'string' || data instanceof Array) {
            return data.length === 0;
        }

        return data === null || typeof data === 'undefined';
    },

    /**
     * 昇順ソートする
     * 要素がHashの場合は指定キーで昇順ソートする
     * @param {Array} ary 配列
     * @param {String} key ソートキー
     * @return {Array} ソート済みデータ
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
     * @return {Array} ソート済みデータ
     */
    descSort: function(data, key) {
        return this.ascSort(data, key).reverse();
    },

    /**
     * バイトサイズを返却する
     * @param {String} 文字列
     * @return {Number} バイトサイズ    
     */
    bytesize: function(str) {
        return unescape(encodeURIComponent(str)).length
    },

    /**
     * データをシリアライズする
     * @param {Object} データ
     * @return {Object} シリアライズデータ
     */
    serialize: function(data) {
        // IE6,7ではjson2.jsが必要
        if (typeof JSON === 'undefined') {
            throw new Error("This browser can't use JSON. Please include 'json2.js'.");
        }
        // object型以外はシリアライズ不要 
        if (typeof data !== 'object') {
            return data;
        }

        return JSON.stringify(data);
    },

    /**
     * データをデシリアライズする
     * @param {Object} シリアライズデータ
     * @return {Object} デシリアライズデータ
     */
    deserialize: function(data) {
        // IE6,7ではjson2.jsが必要
        if (typeof JSON === 'undefined') {
            throw new Error("This browser can't use JSON. Please include 'json2.js'.");
        }
        // object以外はデコードしない
        if (typeof data === 'object') {
            data = JSON.parse(data);
        }

        return data;
    }
});

/**
 * Cookieモジュール
 */
Mixjs.module("Cookie", {
    /** 依存モジュール */
    include: Utils,

    /**
     * Cookieを設定する
     * @param {String} key Cookieのキー
     * @param {String} value Cookieの値
     * @param {Object|Number} expire 有効期限
     * @param {String} domain ドメイン
     * @param {String} path パス
     * @param {Boolean} isSecure secureマークを付けるかどうか
     * @return {Boolean} キャッシュ結果
     */
    setCookie: function(key, value, expire, domain, path, isSecure) {
        // 値がnull,undefinedの場合はキャッシュしない
        if (this.isBlank(value)) {
            return false;
        }

        var cookie = [];
        cookie.push(key + "=" + encodeURIComponent(value));

        var expireTime = function(expire) {
            var time = 0;
            if (typeof expire === 'object') {
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
            }
            else if (typeof expire === 'number') {
                time = expire;
            }

            return time;
        };

        var expireUnixTime = (function(expire) {
            var time = ~~(new Date() / 1000);
            return time + expireTime(expire);
        })(expire);

        var unixTimeToDate = function(ut, optTimeZone) {
            var tz = optTimeZone || 0;
            var date = new Date(ut * 1000);
            date.setTime(date.getTime() + 60 * 60 * 1000 * tz);
            return date;
        };

        if (expire) {
            var date;
            if (typeof expireUnixTime === "number") {
                date = new Date();
                date.setTime(unixTimeToDate(expireUnixTime));
            }
            else {
                throw new Error("Illegal arguments of expires: " + options.expires);
            }
            cookie.push("expires=" + date.toUTCString());
            cookie.push("max-age=" + expireTime(expire));
        }

        if (path) cookie.push("path=" + path);
        if (domain) cookie.push("domain=" + domain);
        if (isSecure) cookie.push("secure");

        var cookieString = cookie.join(";");
        if (this.bytesize(cookieString) > 4096) {
            return false;
        }

        document.cookie = cookieString;
        return true;
    },

    /**
     * Cookieを取得する
     * @param {String} key Cookieのキー
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
Mixjs.module("Design", {
    /**
     * デフォルトフィルタ名
     */
    defaultFilterId_: "filter",

    /**
     * ローディングに使用する画像の幅、高さを設定する
     * @param {Object} img 画像オブジェクト
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
     * @param {Object} config フィルタ設定
     * @param {String} optFilterId フィルタID
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
     * @param {String} optFilterId フィルタID
     */
    hideFilter: function(optFilterId) {
        var _filter = document.getElementById(optFilterId || this.filterId);
        _filter.parentNode.removeChild(_filter);
    }
});

/**
 * Cacheモジュール
 */
Mixjs.module("Cache", {
    /** 依存モジュール */
    include: [Utils, Cookie],

    /**
     * Cacheを設定する
     * @param {String} key キャッシュキー
     * @param {Object} content キャッシュするデータ
     * @param {Object} expire 期限オブジェクト
     * @return {Boolean} キャッシュ結果
     */
    setCache: function(key, content, expire) {
        content = this.serialize(content);
        return this.setCookie(key, this.serialize(content), expire);
    },

    /**
     * Cacheを返却する
     * @param key キャッシュキー
     * @return キャッシュデータ
     */
    getCache: function(key) {
        var content = this.getCookie(key);
        return this.deserialize(content);
    }
});

/**
 * HTTPモジュール
 */
Mixjs.module("Http", {
    /** 依存ライブラリ */
    include: Utils,

    /**
     * 非同期通信を実行する
     * @param {Object} options オプション
     * @example
     *   options.url     送信先URL
     *   options.params  送信パラメータ
     *   options.args    通信パラメータ
     *   options.success 成功時コールバック関数
     *   options.error   失敗時コールバック関数
     *   options.before  処理開始前に実行する関数
     *   options.after   処理完了後に実行する関数
     */
    xhr: function(options) {
        this.options = options;
        var args = options.args || {};
        if (args.dataType === "jsonp") {
            this.jsonp();
        }
        else {
            this.ajax();
        }
    },

    /**
     * 非同期通信を実行する
     */
    ajax: function() {
        var self = this;
        var url              = this.options.url,
            params           = this.options.params || {},
            args             = this.options.args || {},
            successCallback  = this.options.success,
            errorCallback    = this.options.error;

        this.onLoadJQuery(function() {
            $.ajax({
                type: args.type || "post",
                dataType: args.dataType || "json",
                data: params,
                cache: args.cache || true,
                beforeSend: function() {
                    self.before();
                },
                url: url
            })
            .done(function(data, dataType) {
                self.success(successCallback, data, args.args);
                self.after();
            })
            .fail(function(XMLHttpRequest, textStatus, errorThrown) {
                self.error(errorCallback, textStatus, errorThrown);
                self.after();
            });
        });
    },

    /**
     * エラー処理可能なJSONPを実行する
     */
    jsonp: function() {
        var self = this;
        var url              = this.options.url,
            params           = this.options.params || {},
            args             = this.options.args || {},
            successCallback  = this.options.success,
            errorCallback    = this.options.error;

        this.before();

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
            self.after();
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
                    self.after();
                    return;
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
     * @param {String} callback コールバック関数名
     * @param {Object} response レスポンス
     * @param {Object} args     コールバック関数に渡す引数
     */
    callbackCaller: function(callback, response, args) {
        if (typeof callback === "function") {
            callback.call(this, response, args);
        }
        else {
            throw new Error(response.toString());
        }
    },

    /**
     * 指定した関数を実行する
     * @param {Function} f    関数
     * @param {Object}   args 関数に渡す引数
     */
    functionCaller: function(f, args) {
        if (typeof f === "function") {
            f.call(null, args);
        }
    },

    /**
     * 通信成功後のコールバックを実行する
     * @param {String} callback コールバック関数名
     * @param {Object} response レスポンス
     * @param {Object} args     コールバック関数に渡す引数
     */
    success: function(callback, response, args) {
        this.callbackCaller(callback, response, args);
    },

    /**
     * 通信失敗後のコールバックを実行する
     * @param {String} callback コールバック関数名
     * @param {Object} response レスポンス
     * @param {Object} args     コールバック関数に渡す引数
     */
    error: function(callback, response, args) {
        this.callbackCaller(callback, response, args);
    },

    /**
     * 通信開始前に処理を実行する
     */
    before: function() {
        if (typeof this.options.before === 'function') {
            this.functionCaller(this.options.before, this.options.args);
        }
    },

    /**
     * 通信終了後に処理を実行する
     */
    after: function() {
        if (typeof this.options.after === 'function') {
            this.functionCaller(this.options.after, this.options.args);
        }
    }
});
