module("mix.cache.js");

asyncTest("期限が切れたキャッシュデータは取得できないこと", function() {
    var key = "testkey", value = "testvalue", expireSec = 1;
    Mixjs.module("Test", {});
    var obj = Test.mix(Cache);
    obj.setCache(key, value, {sec: expireSec});
    setTimeout(function() {
        start();
        deepEqual(obj.getCache(key), null, "期限切れならばキャッシュデータは取得できない");
    }, (expireSec + 1) * 1000);
});

test("データをキャッシュできること", function() {
    var key = "testkey", value = "testvalue";
    Mixjs.module("Test", {});
    var obj = Test.mix(Cache);
    obj.setCache(key, value);
    deepEqual(obj.getCache(key), value, "キャッシュデータを取得できること");
});

test("データを期限付きでキャッシュできること", function() {
    var key = "testkey", value = "testvalue", expireSec = 1;
    Mixjs.module("Test", {});
    var obj = Test.mix(Cache);
    obj.setCache(key, value, {sec: expireSec});
    deepEqual(obj.getCache(key), value, "期限切れでなければキャッシュデータを取得できること");
});