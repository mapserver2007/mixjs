module("mix.utils.js");

test("定数からGetterメソッドを動的に定義できること", function() {
    var obj = Iphone.mix(Utils);
    var value = "iphone";
    obj.generateGetter({
        PHONE_NAME: value
    });
    deepEqual(typeof obj.getPhoneName, "function", "動的にGetterメソッドが生成できる");
    deepEqual(obj.getPhoneName(), value, "生成したGetterメソッドから値が取得できる");
});

asyncTest("ホスティングjQueryをインポートできること", function() {
    var obj = Iphone.mix(Utils);
    deepEqual(typeof jQuery, "undefined", "ホスティングjQueryがインポートされている");
    obj.loadJQuery();
    setTimeout(function() {
        start();
        deepEqual(typeof jQuery, "function", "ホスティングjQueryがインポートされている");
    }, 1000);
});

test("要素が文字列の配列に対して昇順ソートができること", function() {
    var obj = Iphone.mix(Utils);
    var ary  = ['a', 'c', 'b'];
    var sortedAry = obj.ascSort(ary);
    deepEqual(sortedAry[1], 'b', "昇順ソートされること");
});

test("要素が数値の配列に対して昇順ソートができること", function() {
    var obj = Iphone.mix(Utils);
    var ary = [1, 3, 2];
    var sortedAry = obj.ascSort(ary);
    deepEqual(sortedAry[1], 2, "昇順ソートされること");
});

test("要素がハッシュの配列に対して昇順ソートができること", function() {
    var obj = Iphone.mix(Utils);
    var ary = [{name: 'a'}, {name: 'c'}, {name: 'b'}];
    var sortedAry = obj.ascSort(ary, "name");
    deepEqual(sortedAry[1].name, 'b', "昇順ソートされること");
});

test("要素が文字列の配列に対して降順ソートができること", function() {
    var obj = Iphone.mix(Utils);
    var ary  = ['a', 'c', 'b'];
    var sortedAry = obj.descSort(ary);
    deepEqual(sortedAry[0], 'c', "降順ソートされること");
});

test("要素が数値の配列に対して降順ソートができること", function() {
    var obj = Iphone.mix(Utils);
    var ary = [1, 3, 2];
    var sortedAry = obj.descSort(ary);
    deepEqual(sortedAry[0], 3, "降順ソートされること");
});

test("要素がハッシュの配列に対して降順ソートができること", function() {
    var obj = Iphone.mix(Utils);
    var ary = [{name: 'a'}, {name: 'c'}, {name: 'b'}];
    var sortedAry = obj.descSort(ary, "name");
    deepEqual(sortedAry[0].name, 'c', "降順ソートされること");
});

test("空の値を判定できること", function() {
    var obj = Iphone.mix(Utils);
    deepEqual(obj.isBlank(""), true, "空文字");
    deepEqual(obj.isBlank([]), true, "空配列");
    deepEqual(obj.isBlank({}), true, "空ハッシュ");
    deepEqual(obj.isBlank(null), true, "null");
    deepEqual(obj.isBlank(), true, "引数なし");
    deepEqual(obj.isBlank(undefined), true, "undefined");
});