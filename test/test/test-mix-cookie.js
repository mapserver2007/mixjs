module("mix.cookie.js");

test("Cookieを設定できること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "key-" + ~~(new Date() / 1000);
    var value = "value";
    obj.cookie(key, value);
    same(obj.cookie(key), value, "Cookieが取得できること");
});

test("ホワイトスペースを含む値をCookieを設定できること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "key-" + ~~(new Date() / 1000);
    var value = "test value";
    obj.cookie(key, value);
    same(obj.cookie(key), value, "ホワイトスペースを含むCookieが取得できること");
});

test("有効期間内の場合、Cookieを取得できること", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "in-expire";
    var value = "value with expire";
    var expires = {min: 1}; // 1分間有効
    obj.cookie(key, value, {expires: expires});
    same(obj.cookie(key), value, "Cookieが取得できること");
});

asyncTest("有効期間を過ぎた場合、Cookieが取得できないこと", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "out-expire";
    var value = "value with expire";
    var expires = {sec: 1}; // 1秒間有効
    obj.cookie(key, value, {expires: expires});
    setTimeout(function() {
        start();
        same(obj.cookie(key), null, "Cookieが取得できないこと");
    }, 2000);
});

test("外部ドメインを設定した場合、Cookieを取得できないこと", function() {
    Mixjs.module("Test", {});
    var obj = Test.mix(Cookie);
    var key = "external-domain";
    var value = "value";
    obj.cookie(key, value, {domain: "www.yahoo.co.jp"});
    same(obj.cookie(key), null, "Cookieが取得できないこと");
});
