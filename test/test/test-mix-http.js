module("mix.http.js");

asyncTest("XmlHttpRequestが実行出来ること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http);
    obj.xhr({
        url: "ajax.php",
        args: {dataType: "json"},
        success: function(data) {
            start();
            deepEqual(data.name, "hoge", "XHRを実行してデータが取得できる");
        }
    });
});

asyncTest("XmlHttpRequestを複数実行出来ること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http);
    var result = [];
    obj.xhr([{
        url: "ajax.php",
        args: {dataType: "json"},
        success: function(data) {
            result.push(data.name);
        }
    },{
        url: "ajax2.php",
        args: {dataType: "json"},
        success: function(data) {
            result.push(data.name);
        }
    }]);

    setTimeout(function() {
        deepEqual(result[0], "fuga", "XHRを実行してデータが取得できる");
        deepEqual(result[1], "hoge", "XHRを実行してデータが取得できる");
        start();
    }, 2000);
});

asyncTest("XmlHttpRequestを同期的に複数実行出来ること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http);
    var result = [];
    obj.xhr([{
        url: "ajax.php",
        deferred: true,
        args: {dataType: "json"},
        success: function(data) {
            result.push(data.name);
        }
    },{
        url: "ajax2.php",
        deferred: true,
        args: {dataType: "json"},
        success: function(data) {
            result.push(data.name);
        }
    }]);

    setTimeout(function() {
        deepEqual(result[0], "hoge", "XHRを実行してデータが同期的に取得できる");
        deepEqual(result[1], "fuga", "XHRを実行してデータが動的的に取得できる");
        start();
    }, 2000);
});

asyncTest("XmlHttpRequestを非同期的、同期的に複数同時に実行できること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http);
    var result = [];
    obj.xhr([{
        url: "ajax.php",
        deferred: true,
        args: {dataType: "json"},
        success: function(data) {
            result.push(data.name);
        }
    },{
        url: "ajax2.php",
        deferred: true,
        args: {dataType: "json"},
        success: function(data) {
            result.push(data.name);
        }
    },{
        url: "ajax2.php",
        args: {dataType: "json"},
        success: function(data) {
            result.push("hage");
        }
    }]);

    setTimeout(function() {
        deepEqual(result[0], "hage", "XHRを実行してデータが非同期的、同期的で同時に取得できる");
        deepEqual(result[1], "hoge", "XHRを実行してデータが非同期的、同期的で同時に取得できる");
        deepEqual(result[2], "fuga", "XHRを実行してデータが非同期的、同期的で同時に取得できる");
        start();
    }, 2000);
});

asyncTest("連続でXmlHttpRequestを入れ子で実行したときafter処理がそれぞれ順番に正常に実行出来ること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http);
    var result = [];
    obj.xhr({
        url: "ajax.php",
        args: {dataType: "json"},
        success: function(data) {
        },
        after: function() {
            result.push("first");
            obj.xhr({
                url: "ajax.php",
                args: {dataType: "json"},
                success: function(data) {
                },
                after: function() {
                    result.push("second");
                }
            });
        }
    });

    setTimeout(function() {
        deepEqual(result[0], "first", "after1回目が成功");
        deepEqual(result[1], "second", "after2回目が成功");
        start();
    }, 3000);
});

asyncTest("JSONPが実行出来ること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http);
    obj.xhr({
        url: "http://s.hatena.ne.jp/blog.json/http://d.hatena.ne.jp/hatenastar/",
        params: {},
        args: {dataType: "jsonp"},
        success: function(data) {
            setTimeout(function() {
                start();
                deepEqual(typeof data, "object", "JSONPを実行してデータが取得できる");
            }, 1000);
        },
        error: function() {
            setTimeout(function() {
                start();
                ok(false, "JSONPが失敗");
            }, 1000);
        }
    });
});

asyncTest("JSONPでエラーが起きても処理が止まらないこと", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http);
    obj.xhr({
        url: "http://localhost:8080/latest.json",
        params: {},
        args: {dataType: "jsonp"},
        success: function(data) {
            setTimeout(function() {
                start();
                ok(false, "JSONPは成功しない");
            }, 1000);
        },
        error: function(errorData) {
            setTimeout(function() {
                start();
                deepEqual(errorData, null, "エラーが発生してもコールバック実行が可能");
            }, 1000);
        }
    });
});

asyncTest("タイムアウトを設定してJSONPが正常に実行できたとき、タイムアウト処理が実行されないこと", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http);
    obj.xhr({
        url: "http://s.hatena.ne.jp/blog.json/http://d.hatena.ne.jp/hatenastar/",
        params: {},
        args: {dataType: "jsonp", timeout: 3000},
        success: function(data) {
            setTimeout(function() {
                start();
                deepEqual(typeof data, "object", "タイムアウトを設定しても正常実行されればエラーにならない");
            }, 1000);
        },
        error: function() {
            setTimeout(function() {
                start();
                ok(false, "意図せずタイムアウト処理が実行される");
            }, 1000);
        }
    });
});

asyncTest("タイムアウトを設定してJSONPでエラーが起きたとき、エラー処理が実行されること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http);
    obj.xhr({
        url: "http://localhost:8080/latest.json",
        params: {},
        args: {dataType: "jsonp", timeout: 10},
        success: function(data) {
            setTimeout(function() {
                start();
                ok(false, "JSONPは成功しない");
            }, 1000);
        },
        error: function(errorData) {
            setTimeout(function() {
                start();
                deepEqual(errorData, null, "タイムアウトが発生してもコールバック実行が可能");
            }, 1000);
        }
    });
});

asyncTest("beforeを指定した場合、通常のAjax処理の前に任意の処理が実行されること(要PHP)", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http, Cache);
    var isBeforeExecute = false;
    obj.xhr({
        url: "ajax.php",
        args: {dataType: "json"},
        success: function(data) {
            setTimeout(function() {
                start();
                ok(isBeforeExecute, "Ajax処理実行前にbefore処理を実行できる");
            }, 1000);
        },
        before: function() {
            isBeforeExecute = true;
        }
    });
});

asyncTest("afterを指定した場合、通常のAjax処理の後に任意の処理が実行されること(要PHP)", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http, Cache);
    var isAfterExecute = false;
    obj.xhr({
        url: "ajax.php",
        args: {dataType: "json"},
        success: function(data) {
            isAfterExecute = true;
            start();
        },
        after: function() {
            ok(isAfterExecute, "Ajax処理実行後にafter処理を実行できる");
        }
    });
});

asyncTest("beforeを指定した場合、JSONP処理の前に任意の処理が実行されること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http, Cache);
    var isBeforeExecute = false;
    obj.xhr({
        url: "http://s.hatena.ne.jp/blog.json/http://d.hatena.ne.jp/hatenastar/",
        args: {dataType: "jsonp"},
        success: function(data) {
            ok(isAfterExecute, "JSONP処理実行前にbefore処理を実行できる");
            start();
        },
        before: function() {
            isAfterExecute = true;
        }
    });
});

asyncTest("afterを指定した場合、JSONP処理の後に任意の処理が実行されること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Http, Cache);
    var isAfterExecute = false;
    obj.xhr({
        url: "http://s.hatena.ne.jp/blog.json/http://d.hatena.ne.jp/hatenastar/",
        args: {dataType: "jsonp"},
        success: function(data) {
            isAfterExecute = true;
            start();
        },
        after: function() {
            ok(isAfterExecute, "JSONP処理実行後にafter処理を実行できる");
        }
    });
});
