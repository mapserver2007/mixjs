module("mix.cookie.js");

test("Cookieを設定できること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "key-" + ~~(new Date() / 1000);
    var value = "value";
    obj.setCookie(key, value);
    deepEqual(obj.getCookie(key), value, "Cookieが取得できること");
});

test("ホワイトスペースを含む値をCookieを設定できること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "key-" + ~~(new Date() / 1000);
    var value = "test value";
    obj.setCookie(key, value);
    deepEqual(obj.getCookie(key), value, "ホワイトスペースを含むCookieが取得できること");
});

test("有効期間内の場合、Cookieを取得できること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "in-expire";
    var value = "value with expire";
    var expires = {min: 1}; // 1分間有効
    obj.setCookie(key, value, expires);
    deepEqual(obj.getCookie(key), value, "Cookieが取得できること");
});

test("有効期間を数値でも指定可能なこと", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "in-expire";
    var value = "value with expire";
    var expires = 3; // 3秒
    obj.setCookie(key, value, expires);
    deepEqual(obj.getCookie(key), value, "Cookieが取得できること");
});

asyncTest("有効期間を過ぎた場合、Cookieが取得できないこと", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "out-expire";
    var value = "value with expire";
    var expires = {sec: 1}; // 1秒間有効
    obj.setCookie(key, value, expires);
    setTimeout(function() {
        start();
        deepEqual(obj.getCookie(key), null, "Cookieが取得できないこと");
    }, 2000);
});

test("外部ドメインを設定した場合、Cookieを取得できないこと", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "external-domain";
    var value = "value";
    obj.setCookie(key, value, null, "www.yahoo.co.jp");
    deepEqual(obj.getCookie(key), null, "Cookieが取得できないこと");
});

test("データが4097バイト以上の場合、Cookieを保存できないこと", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var str = "";
    for (var i = 0; i < 4041; i++) { // この時点で4096バイト
        str += "a";
    }
    obj.setCookie("oksize", str, 3);
    notDeepEqual(obj.getCookie("oksize"), null, "Cookieが設定できること");
    str += "a"; // 4097バイト
    obj.setCookie("ngsize", str, 3);
    deepEqual(obj.getCookie("ngsize"), null, "Cookieが設定できないこと");
});