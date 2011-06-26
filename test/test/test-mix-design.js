module("mix.design.js");

asyncTest("指定した領域にフィルタがかかること", function() {
    var obj = Module.create({}).mix(Design, Utils);
    var elem = document.getElementById("qunit-header");
    obj.showFilter({
        target: elem
    });
    setTimeout(function() {
        start();
        same(elem.lastChild.getAttribute("id"), "filter", "指定領域にフィルタがかかっていること");
        obj.hideFilter();
        same(document.getElementById("filter"), null, "指定領域からフィルタが削除されたこと");
    }, 1000);
});

asyncTest("領域を指定しない場合は画面全体にフィルタがかかること", function() {
    var obj = Module.create({}).mix(Design, Utils);
    obj.showFilter();
    setTimeout(function() {
        start();
        same(document.body.lastChild.getAttribute("id"), "filter", "画面全体にフィルタがかかっていること");
        obj.hideFilter();
        same(document.getElementById("filter"), null, "画面全体からフィルタが削除されたこと");
    }, 1000);
});

asyncTest("指定した領域がjQueryオブジェクトの場合、正常にフィルタがかかること", function() {
    var obj = Module.create({}).mix(Design, Utils);
    obj.loadJQuery();
    var elem = $("#qunit-header");
    obj.showFilter({
        target: elem
    });
    setTimeout(function() {
        start();
        same($("#qunit-header").children(":last-child").attr("id"), "filter", "指定領域にフィルタがかかっていること");
        obj.hideFilter();
        same(document.getElementById("filter"), null, "指定領域からフィルタが削除されたこと");
    }, 1000);
});

asyncTest("フィルタに文字列が表示できること", function() {
    var obj = Module.create({}).mix(Design, Utils);
    var elem = document.getElementById("qunit-header");
    var text = "Desing Module Test";
    obj.showFilter({
        target: elem,
        text: text
    });
    setTimeout(function() {
        start();
        same(elem.lastChild.lastChild.innerHTML, text, "フィルタに文字が表示されること");
        obj.hideFilter();
        same(document.getElementById("filter"), null, "指定領域からフィルタが削除されたこと");
    }, 1000);
});

asyncTest("フィルタに画像が表示できること", function() {
    var obj = Module.create({}).mix(Design, Utils);
    var elem = document.getElementById("qunit-header");
    var img = "http://static.jquery.com/files/rocker/images/logo_jquery_215x53.gif";
    obj.showFilter({
        target: elem,
        img: img
    });
    setTimeout(function() {
        start();
        same(elem.lastChild.lastChild.getAttribute("src"), img, "フィルタに画像が表示されること");
        obj.hideFilter();
        same(document.getElementById("filter"), null, "指定領域からフィルタが削除されたこと");
    }, 1000);
});

asyncTest("フィルタに文字列と画像が表示できること", function() {
    var obj = Module.create({}).mix(Design, Utils);
    var elem = document.getElementById("qunit-header");
    var text = "Desing Module Test";
    var img = "http://static.jquery.com/files/rocker/images/logo_jquery_215x53.gif";
    obj.showFilter({
        target: elem,
        text: text,
        img: img
    });
    setTimeout(function() {
        start();
        var _img = elem.lastChild.childNodes[0].getAttribute("src");
        var _text = elem.lastChild.childNodes[1].innerHTML;
        same(_img, img, "フィルタに画像が表示されること");
        same(_text, text, "フィルタに文字列が表示されること");
        obj.hideFilter();
        same(document.getElementById("filter"), null, "指定領域からフィルタが削除されたこと");
    }, 1000);
});

asyncTest("フィルタ名を任意の名前に変更できること", function() {
    var obj = Module.create({}).mix(Design, Utils);
    var filterName = "myFilter";
    obj.showFilter({}, filterName);
    setTimeout(function() {
        start();
        same(document.body.lastChild.getAttribute("id"), filterName, "指定したフィルタ名が適用されること");
        obj.hideFilter(filterName);
        same(document.getElementById(filterName), null, "指定領域からフィルタが削除されたこと");
    }, 1000);
});
