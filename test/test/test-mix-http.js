module("mix.http.js");

asyncTest("JSONPが実行出来ること", function() {
    var obj = Module.create({}).mix(Http, Utils, Cache);
    obj.xhr({
        url: "http://tepco-usage-api.appspot.com/latest.json",
        params: {},
        args: {dataType: "jsonp"},
        successCallback: function(data) {
            setTimeout(function() {
                start();
                same(typeof data, "object", "JSONPを実行してデータが取得できる");
            }, 1000);
        },
        errorCallback: function() {
            setTimeout(function() {
                start();
                ok(false, "JSONPが失敗");
            }, 1000);
        }
    });
});

asyncTest("JSONPでエラーが起きても処理が止まらないこと", function() {
    var obj = Module.create({}).mix(Http, Utils, Cache);
    obj.xhr({
        url: "http://localhost:8080/latest.json",
        params: {},
        args: {dataType: "jsonp"},
        successCallback: function(data) {
            setTimeout(function() {
                start();
                ok(false, "JSONPは成功しない");
            }, 1000);
        },
        errorCallback: function(errorData) {
            setTimeout(function() {
                start();
                same(errorData, null, "エラーが発生してもコールバック実行が可能");
            }, 1000);
        }
    });
});

asyncTest("タイムアウトを設定してJSONPが正常に実行できたとき、タイムアウト処理が実行されないこと", function() {
    var obj = Module.create({}).mix(Http, Utils, Cache);
    obj.xhr({
        url: "http://tepco-usage-api.appspot.com/latest.json",
        params: {},
        args: {dataType: "jsonp", timeout: 3000},
        successCallback: function(data) {
            setTimeout(function() {
                start();
                same(typeof data, "object", "タイムアウトを設定しても正常実行されればエラーにならない");
            }, 1000);
        },
        errorCallback: function() {
            setTimeout(function() {
                start();
                ok(false, "意図せずタイムアウト処理が実行される");
            }, 1000);
        }
    });
});

asyncTest("タイムアウトを設定してJSONPでエラーが起きたとき、エラー処理が実行されること", function() {
    var obj = Module.create({}).mix(Http, Utils, Cache);
    obj.xhr({
        url: "http://localhost:8080/latest.json",
        params: {},
        args: {dataType: "jsonp", timeout: 10},
        successCallback: function(data) {
            setTimeout(function() {
                start();
                ok(false, "JSONPは成功しない");
            }, 1000);
        },
        errorCallback: function(errorData) {
            setTimeout(function() {
                start();
                same(errorData, null, "タイムアウトが発生してもコールバック実行が可能");
            }, 1000);
        }
    });
});

asyncTest("キャッシュを有効にしたとき、データがキャッシュされること", function() {
    var obj = Module.create({}).mix(Http, Utils, Cache);
    var url = "http://tepco-usage-api.appspot.com/latest.json";
    obj.xhr({
        url: url,
        params: {},
        args: {dataType: "jsonp", cache: true},
        successCallback: function(data) {
            setTimeout(function() {
                start();
                same(typeof data, "object", "1回目は通信して取得する");
                same(typeof obj.getCache(url), "object", "キャッシュデータが保存されていること");
            }, 1000);
        },
        errorCallback: function(errorData) {
            setTimeout(function() {
                start();
                ok(false, "キャッシュ処理が失敗");
            }, 1000);
        }
    });
});