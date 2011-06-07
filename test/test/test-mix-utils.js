module("mix.utils.js");

test("定数からGetterメソッドを動的に定義できること", function() {
    var obj = Iphone.mix(Utils);
    var value = "iphone";
    obj.generateGetter({
        PHONE_NAME: value
    });
    same(typeof obj.getPhoneName, "function", "動的にGetterメソッドが生成できる");
    same(obj.getPhoneName(), value, "生成したGetterメソッドから値が取得できる");
});

(function() {
    var obj = Iphone.mix(Utils);
    obj.loadJQuery();
    setTimeout(function() {
        test("ホスティングjQueryをインポートできること", function() {
            same(typeof jQuery, "function", "ホスティングjQueryがインポートされている");
        });
    }, 1000);
})();