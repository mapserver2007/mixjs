module("mix.cache.js");

test("データをキャッシュできること", function() {
    var key = "testkey", value = "testvalue";
    var obj = Module.create({}).mix(Cache);
    obj.setCache(key, value);
    same(obj.getCache(key), value, "キャッシュデータを取得できること");
});

test("データを期限付きでキャッシュできること", function() {
    var key = "testkey", value = "testvalue", expireSec = 1;
    var obj = Module.create({}).mix(Cache);
    obj.setCache(key, value, {sec: expireSec});
    same(obj.getCache(key), value, "期限切れでなければキャッシュデータを取得できること");
});

asyncTest("期限が切れたキャッシュデータは取得できないこと", function() {
    var key = "testkey", value = "testvalue", expireSec = 1;
    var obj = Module.create({}).mix(Cache);
    obj.setCache(key, value, {sec: expireSec});
    setTimeout(function() {
        start();
        same(obj.getCache(key), undefined, "期限切れならばキャッシュデータは取得できない");
    }, (expireSec + 1) * 1000);
});