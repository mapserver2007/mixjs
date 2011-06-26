/*
 * mix.modules.js
 * version: 0.1.7 (2011/06/26)
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
    latestJQueryVersion_: "1.6.1",
    loadJQuery: function(optVersion) {
        var url = "https://ajax.googleapis.com/ajax/libs/jquery/"
        + (this.latestJQueryVersion_ || optVersion)
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
     */
    descSort: function(data, key) {
        return this.ascSort(data, key).reverse();
    }
});

var Design = Module.create({
    /**
     * デフォルトフィルタ名
     */
    defaultFilterId_: "filter",

    /**
     * 指定した領域にローディングフィルタをかける
     */
    showFilter: function(config, filterId) {
        config = config || {};
        this.filterId = filterId || this.defaultFilterId_;
        
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
                    var height = parseInt(elem.offsetHeight, 10) / 2 - 5;
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
                    var img = document.createElement("img"),
                    left = elem.offsetWidth / 2,
                    top = elem.offsetHeight / 2;
                    
                    img.setAttribute("src", path);
                    img.style.position = "relative";

                    // for chrome, firefox, safari
                    if (typeof img.naturalWidth !== "undefined") {
                        left -= img.naturalWidth / 2;
                        top -= img.naturalHeight / 2;
                    }
                    // for IE
                    else if (typeof img.runtimeStyle !== "undefined") {
                        var tmp = img.runtimeStyle,
                        mem = {
                            width: tmp.width,
                            height: tmp.height
                            };
                        tmp.width = "auto";
                        tmp.height = "auto";
                        var w = img.width,
                        h = img.height;
                        tmp.width = mem.width;
                        tmp.height = mem.height;
                        left -= w;
                        top -= h;
                    }
                    // for opera
                    else {
                    // TODO
                    }
                    
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
            _filter.style.filter          = 'alpha(opacity=' + config.transParency + ')';
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
            var cacheImg = document.createElement("img");
            cacheImg.setAttribute("src", config.img);
            cacheImg.onload = (function(id) {
                return function() {
                    filtering(id);
                }
            })(this.filterId);
        }
        // それ以外
        else {
            filtering(this.filterId);
        }
    },
    
    /**
     * ローディングフィルタを消去する
     */
    hideFilter: function(filterId) {
        var _filter = document.getElementById(filterId || this.filterId);
        _filter.parentNode.removeChild(_filter);
    }
});

/**
 * Cacheモジュール
 */
var Cache = Module.create({
    stack_: {},
    
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
        if (typeof this.stack_ === "undefined") {
            this.stack_ = {};
        }
        this.stack_[this.createKey(key, expire)] = content;
    },
    
    /**
     * Cacheを返却する
     */
    getCache: function(key) {
        // keyのsuffixとしてUNIX TIMEが付与されている場合は分離する。
        var content, expireTime;
        for (var keyWithExpire in this.stack_) {
            // keyが先頭で一致した場合、keyとcontentを取り出す
            if (keyWithExpire.search(key) === 0) {
                // 期限付きの場合
                if (keyWithExpire.match(/^(.*?)-(\d{10})$/)) {
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
     * @param options.optArgs          通信パラメータ
     * @param options.successCallback  成功時コールバック関数
     * @param options.optErrorCallback 失敗時コールバック関数
     * @param options.optStartFunc     処理開始前に実行する関数
     * @param options.optEndFunc       処理完了後に実行する関数
     */
    xhr: function(options) {
        var self = this;
        var url              = options.url,
            params           = options.params,
            optArgs          = options.optArgs || {},
            successCallback  = options.successCallback,
            optErrorCallback = options.optErrorCallback,
            optStartFunc     = options.optStartFunc,
            optEndFunc       = options.optEndFunc;
        
        // JSONPの場合はmix.js独自処理を実行
        if (optArgs.dataType === "jsonp") {
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
                            type: optArgs.type || "post",
                            dataType: optArgs.dataType || "json",
                            data: params || {},
                            cache: optArgs.cache || true,
                            url: url,
                            success: function(data, dataType) {
                                self.success(successCallback, data, optArgs.args);
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                self.error(optErrorCallback, textStatus, optArgs.args);
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
     * @param options.optArgs          通信パラメータ
     * @param options.successCallback  成功時コールバック関数
     * @param options.optErrorCallback 失敗時コールバック関数
     * @param options.optStartFunc     処理開始前に実行する関数
     * @param options.optEndFunc       処理完了後に実行する関数
     */
    jsonp: function(options) {
        var self = this;
        var url              = options.url,
            params           = options.params,
            optArgs          = options.optArgs,
            successCallback  = options.successCallback,
            optErrorCallback = options.optErrorCallback,
            optStartFunc     = options.optStartFunc,
            optEndFunc       = options.optEndFunc;

        this.options = options;
        this.start();
        
        var jsonpCallback = optArgs.jsonp || "callback";
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
                self.success(successCallback, jsonObject, optArgs.args);
            }
            else if (typeof optErrorCallback !== "undefined") {
                self.error(optErrorCallback, null, optArgs.args);
            }
            remove();
        };

        var isEnableCache = function() {
            return typeof Cache !== "undefined" && self.has(Cache);
        };
        
        // timeout
        if (typeof optArgs.timeout !== "undefined") {
            setTimeout(function() {
                if (!!document.getElementById(jsonpCallback)) {
                    onload = function() {};
                    if (typeof optErrorCallback !== "undefined") {
                        self.error(optErrorCallback, null, optArgs.args);
                    }
                    remove();
                }
            }, optArgs.timeout)
        }
        
        // cache
        var setCache = function(key, value, options) {
            if (optArgs.cache === true) {
                if (!isEnableCache()) {
                    throw new Error("require Cache module.")
                }
                self.setCache(key, value, options);
            }
        };
        
        var getCache = function(key) {
            var data = null;
            if (optArgs.cache === true) {
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
        this.functionCaller(this.options.optStartFunc, this.options.optArgs);
    },
    
    /**
     * 通信終了後に処理を実行する
     */
    end: function() {
        this.functionCaller(this.options.optEndFunc, this.options.optArgs);
    }
});