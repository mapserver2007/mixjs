module("mix.js");

test("Mixjs.module()でmixメソッドが追加されること", function() {
    Mixjs.module("obj", {})
    same(obj.hasOwnProperty("mix"), true, "mixメソッドが追加されること");
});

test("Mix-inができること", function() {
    var obj = Iphone.mix(Telephone);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "kurodenwa", "親オブジェクトにアクセスできること");
});

test("Mix-inが連続でできること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
});

test("多重継承ができること", function() {
    var obj = Iphone.mix(Feature, Telephone);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
});

test("多重継承が連続でできること", function() {
    var obj = Iphone.mix(Feature, Telephone).mix(Android, Ipad);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.parent.getPhoneName(), "ipad", "親の親の親の親オブジェクトにアクセスできること");
});

test("Mix-inした後のオブジェクトに対してMix-inできること", function() {
    var obj = Iphone.mix(Feature);
    obj = obj.mix(Telephone);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
});

test("Mix-inした後のオブジェクトを子にしたMix-inができること", function() {
    var obj = Iphone.mix(Feature);
    obj = obj.mix(Telephone);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
});

test("Mix-inした後のオブジェクトを子にした多重継承ができること", function() {
    var obj = Iphone.mix(Feature);
    obj = obj.mix(Telephone, Android);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
});

test("Mix-inした後のオブジェクトを親にした多重継承ができること", function() {
    var obj = Iphone.mix(Feature);
    obj = Android.mix(obj, Telephone);
    same(obj.getPhoneName(), "android", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "iphone", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "garake-", "親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.getPhoneName(), "kurodenwa", "親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトに対してMix-inができること", function() {
    var obj = Iphone.mix(Feature, Telephone).mix(Android);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトを子にしたMix-inができること", function() {
    var obj = Iphone.mix(Feature, Telephone);
    obj = obj.mix(Android);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトを親にしたMix-inができること", function() {
    var obj = Iphone.mix(Feature, Telephone);
    obj = Android.mix(obj);
    same(obj.getPhoneName(), "android", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "iphone", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "garake-", "親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.getPhoneName(), "kurodenwa", "親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトを子にした多重継承ができること", function() {
    var obj = Ipad.mix(Feature, Telephone);
    obj = obj.mix(Android, Iphone);
    same(obj.getPhoneName(), "ipad", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.parent.getPhoneName(), "iphone", "親の親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトを親にした多重継承ができること", function() {
    var obj = Ipad.mix(Feature, Telephone);
    obj = Iphone.mix(obj, Android);
    same(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    same(obj.parent.getPhoneName(), "ipad", "親オブジェクトにアクセスできること");
    same(obj.parent.parent.getPhoneName(), "garake-", "親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.getPhoneName(), "kurodenwa", "親の親の親オブジェクトにアクセスできること");
    same(obj.parent.parent.parent.parent.getPhoneName(), "android", "親の親の親の親オブジェクトにアクセスできること");
});

test("Mixjs.module()で生成したオブジェクト自身はMix-inの影響を受けないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    same(obj.getType(), "old type", "Mix-inしたオブジェクトは継承したメソッドを取得できる");
    raises(function() {
        Iphone.getType();
    }, "多重継承の影響をうけていなければで未継承オブジェクトのメソッドは取得できない");
});

test("Mix-inしたオブジェクトの親からその親のメソッドを参照できること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    same(obj.parent.getType(), "old type", "親がその親のメソッドを参照できること");
});

test("多重継承したオブジェクトの親からその親のメソッドを参照できること", function() {
    var obj = Iphone.mix(Feature, Telephone);
    same(obj.parent.getType(), "old type", "親がその親のメソッドを参照できること");
});

test("Mix-inしたオブジェクトの親からその祖先のメソッドを参照できること", function() {
    var obj = Iphone.mix(Feature).mix(Android).mix(Telephone);
    same(obj.parent.getType(), "old type", "親がその親のメソッドを参照できること");
});

test("多重継承したオブジェクトの親からその祖先のメソッドを参照できること", function() {
    var obj = Iphone.mix(Feature, Android, Telephone);
    same(obj.parent.getType(), "old type", "親がその親のメソッドを参照できること");
});

test("Mix-in済みオブジェクトの親にMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone).mix(Android);
    same(obj.has(Telephone), true, "親オブジェクトにMix-inモジュールが含まれること");
});

test("Mix-in済みオブジェクトの親の親にMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone).mix(Android);
    same(obj.has(Android), true, "親の親オブジェクトにMix-inモジュールが含まれること");
});

test("多重継承済みオブジェクトにMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone, Android);
    same(obj.has(Iphone), true, "子オブジェクトにMix-inモジュールが含まれること");
});

test("多重継承済みオブジェクトの親にMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone, Android);
    same(obj.has(Telephone), true, "親オブジェクトにMix-inモジュールが含まれること");
});

test("多重継承済みオブジェクトの親の親にMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone, Android);
    same(obj.has(Android), true, "親の親オブジェクトにMix-inモジュールが含まれること");
});

test("Mix-in済みオブジェクトにMix-inしていないモジュールは含まれないこと", function() {
    var obj = Iphone.mix(Telephone);
    same(obj.has(Android), false, "Mix-inしていないモジュールは含まれないこと");
});

test("多重継承済みオブジェクトにMix-inしていないモジュールは含まれないこと", function() {
    var obj = Iphone.mix(Telephone, Android);
    same(obj.has(Ipad), false, "Mix-inしていないモジュールは含まれないこと");
});

test("Mix-inの順序を考慮してhasによる所有判定ができること", function() {
   var obj = Iphone.mix(Feature).mix(Telephone),
       obj2 = Feature.mix(Telephone);
   same(obj.has(obj2), true, "順序を考慮した所有判定ができること");
});

test("Mix-inの順序を考慮しない場合、hasによる所有判定ができないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone),
        obj2 = Telephone.mix(Feature);
    same(obj.has(obj2), false, "順序を考慮しない場合、所有判定ができないこと");
});

test("同じモジュールはMix-inされないこと", function() {
    var obj = Iphone.mix(Feature).mix(Iphone);
    same(obj.parent.hasOwnProperty("parent"), false, "親の親にモジュールへの参照はつかない");
});

test("includeを使ってインクルードする場合、同じモジュールはMix-inされないこと", function() {
    var scope = {};
    Mixjs.module("Test", scope, {
        include: Iphone
    });
    obj = scope.Test.mix(Iphone);
    same(obj.parent.hasOwnProperty("parent"), false, "親の親にモジュールへの参照はつかない");
});

test("モジュールにmixメソッドを定義した場合は例外が発生すること", function() {
    var message;
    try {
        Mixjs.module("ChinaPad", {
            mix: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "'mix' can't be defined.", "mixメソッドは定義不可");
});

test("モジュールにparentメソッドを定義した場合は例外が発生すること", function() {
    var message;
    try {
        Mixjs.module("ChinaPad", {
            parent: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "'parent' can't be defined.", "parentメソッドは定義不可");
});

test("モジュールにhasメソッドを定義した場合は例外が発生すること", function() {
    var message;
    try {
        Mixjs.module("ChinaPad", {
            has: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "'has' can't be defined.", "hasメソッドは定義不可");
});

test("モジュールにbaseメソッドを定義した場合は例外が発生すること", function() {
    var message;
    try {
        Mixjs.module("ChinaPad", {
            base: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "'base' can't be defined.", "baseメソッドは定義不可");
});

test("モジュールに__moduleName__プロパティを定義した場合は例外が発生すること", function() {
    var message;
    try {
        Mixjs.module("ChinaPad", {
            __moduleName__: ""
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "'__moduleName__' can't be defined.", "__moduleName__プロパティは定義不可");
});

test("includeメソッドにMixjs#moduleで作成したオブジェクトが指定された場合、定義したモジュールにMix-inされること", function() {
    var scope = {};
    Mixjs.module("Test", scope, {
        include: Iphone
    });
    same(scope.Test.has(Iphone), true, "includeでMix-inが実行可能");
});

test("includeメソッドにMixjs#moduleで作成したオブジェクトが配列で指定された場合、定義したモジュールに順番にMix-inされること", function() {
    var scope = {};
    Mixjs.module("Test", scope, {
        include: [Iphone, Feature]
    });
    same(scope.Test.parent.getPhoneName(), "iphone", "includeでMix-inが実行可能で、親は1番目のモジュールになる");
    same(scope.Test.parent.parent.getPhoneName(), "garake-", "includeでMix-inが実行可能で、親は2番目のモジュールになる");
});

test("includeメソッドにMixjs#moduleで作成したオブジェクト以外が指定された場合、例外が発生すること", function() {
    var message;
    var scope = {};
    try {
        Mixjs.module("Test", scope, {
            include: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "include method value must be mixjs module object.", "includeメソッドは関数による定義が不可");
    
    message = null;
    try {
        var ChinaPad = {
            mix: function() {},
            has: function() {}
        };
        Mixjs.module("Test", scope, {
            include: ChinaPad
        });
    }
    catch (e) {
        message = e.message;
    }
    
    same(message, "include method value must be mixjs module object.", 
            "includeメソッドはmixjsオブジェクト以外定義が不可");
});

test("includeメソッドに配列としてMixjs#moduleで作成したオブジェクト以外が１つでも指定された場合、例外が発生すること", function() {
    var message;
    var scope = {};
    try {
        Mixjs.module("Test", scope, {
            include: [Iphone, function() {}]
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "include method value must be mixjs module object.", "includeメソッドは関数による定義が不可");
    
    message = null;
    try {
        var ChinaPad = {
            mix: function() {},
            has: function() {}
        };
        Mixjs.module("Test", scope, {
            include: [Iphone, ChinaPad]
        });
    }
    catch (e) {
        message = e.message;
    }
    
    same(message, "include method value must be mixjs module object.", 
            "includeメソッドはmixjsオブジェクト以外定義が不可");
});

test("baseプロパティを使用するとレシーバが子モジュールになること", function() {
    var obj = PsVita.mix(PspGo, Psp);
    same(obj.parent.parent.getName(), "PSP", "baseプロパティを使わなければ呼ばれるのはPsp#getName");
    same(obj.parent.parent.getBaseName(), "PSVITA", "baseプロパティを使えば呼ばれるのはPsVita#getName");
});

test("baseプロパティを使用してレシーバを子モジュールに戻したとき、プロトタイプチェーンで子モジュールの親を呼べること", function() {
    var obj = PsVita.mix(PspGo, Psp);
    same(obj.parent.parent.getChainName(), "PSVITA", "Psp#getChainNameからPspGo#getChainNameを呼び出すがレシーバはPsVita");
});

test("スコープを指定してモジュールを定義できること", function() {
    var scope = {};
    Mixjs.module("Test1", scope, {name: "test1"});
    Mixjs.module("Test2", document, {name: "test2"});
    same(scope.Test1.name, "test1", "オブジェクトに対してモジュールをセットすることができる");
    same(document.Test2.name, "test2", "documentオブジェクトに対してモジュールをセットすることができる");
});

test("モジュール定義で引数を1つしか指定しない場合、例外が発生すること", function() {
    var message;
    try {
        var obj = Mixjs.module({});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of name must be string.", "第一引数にはモジュール名を文字列で指定しなければならない");
});

test("モジュール定義で引数を2つ指定するとき、戻り値がないこと", function() {
    var obj = Mixjs.module("Test", {});
    same(obj, undefined, "戻り値はundefined");
});

test("モジュール定義で引数を2つ指定するとき、第一引数(name)が文字列以外の場合、エラーが発生すること", function() {
    var message;
    try {
        Mixjs.module(100, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of name must be string.", "第一引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module(function() {}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of name must be string.", "第一引数に関数の指定は不可");
    
    message = null;
    try {
        Mixjs.module({}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of name must be string.", "第一引数にオブジェクトの指定は不可");
});

test("モジュール定義で引数を2つ指定するとき、第二引数(base)がオブジェクト以外の場合、エラーが発生すること", function() {
    var message;
    try {
        Mixjs.module("Test", "string");
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of base must be object.", "第二引数に文字列の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", 111);
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of base must be object.", "第二引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", function() {});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of base must be object.", "第二引数に関数の指定は不可");
});

test("モジュール定義で引数を3つ指定するとき、戻り値がないこと", function() {
    var obj = Mixjs.module("Test", {}, {});
    same(obj, undefined, "戻り値はundefined");
});

test("モジュール定義で引数を3つ指定するとき、第一引数(name)が文字列以外の場合、エラーが発生すること", function() {
    var message;
    try {
        Mixjs.module(100, {}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of name must be string.", "第一引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module(function() {}, {}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of name must be string.", "第一引数に関数の指定は不可");
    
    message = null;
    try {
        Mixjs.module({}, {}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of name must be string.", "第一引数にオブジェクトの指定は不可");
});

test("モジュール定義で引数を3つ指定するとき、第二引数(scope)がオブジェクト以外の場合、エラーが発生すること", function() {
    var message;
    try {
        Mixjs.module("Test", "string", {});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of scope must be object.", "第二引数に文字列の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", 111, {});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of scope must be object.", "第三引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", function() {}, {});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of scope must be object.", "第三引数に関数の指定は不可");
});

test("モジュール定義で引数を3つ指定するとき、第三引数(base)がオブジェクト以外の場合、エラーが発生すること", function() {
    var message,
        scope = {};
    try {
        Mixjs.module("Test", scope, "string");
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of base must be object.", "第三引数に文字列の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", scope, 111);
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of base must be object.", "第三引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", scope, function() {});
    }
    catch (e) {
        message = e.message;
    }
    same(message, "Invalid argument: type of base must be object.", "第三引数に関数の指定は不可");
});

test("Mix-inでモジュールの循環参照が発生した場合、例外が発生すること", function() {
    var message;
    try {
        Windows95.mix(WindowsXP).mix(Windows98.mix(WindowsXP))
    }
    catch (e) {
        message = e.message;
    }
    same(message, "The module cyclic reference error.", "循環参照エラーが起きる");
});
