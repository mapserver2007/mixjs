module("mix.js");

test("Mix-inができること", function() {
    var obj = Iphone.mix(Telephone);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "kurodenwa", "親オブジェクトにアクセスできること");
});

test("Mix-inが連続でできること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
});

test("多重継承ができること", function() {
    var obj = Iphone.mix(Feature, Telephone);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
});

test("多重継承が連続でできること", function() {
    var obj = Iphone.mix(Feature, Telephone).mix(Android, Ipad);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.parent.getPhoneName(), "ipad", "親の親の親の親オブジェクトにアクセスできること");
});

test("Mix-inした後のオブジェクトに対してMix-inできること", function() {
    var obj = Iphone.mix(Feature);
    obj = obj.mix(Telephone);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
});

test("Mix-inした後のオブジェクトを子にしたMix-inができること", function() {
    var obj = Iphone.mix(Feature);
    obj = obj.mix(Telephone);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
});

test("Mix-inした後のオブジェクトを子にした多重継承ができること", function() {
    var obj = Iphone.mix(Feature);
    obj = obj.mix(Telephone, Android);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
});

test("Mix-inした後のオブジェクトを親にした多重継承ができること", function() {
    var obj = Iphone.mix(Feature);
    obj = Android.mix(obj, Telephone);
    deepEqual(obj.getPhoneName(), "android", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "iphone", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "garake-", "親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.getPhoneName(), "kurodenwa", "親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトに対してMix-inができること", function() {
    var obj = Iphone.mix(Feature, Telephone).mix(Android);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトを子にしたMix-inができること", function() {
    var obj = Iphone.mix(Feature, Telephone);
    obj = obj.mix(Android);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトを親にしたMix-inができること", function() {
    var obj = Iphone.mix(Feature, Telephone);
    obj = Android.mix(obj);
    deepEqual(obj.getPhoneName(), "android", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "iphone", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "garake-", "親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.getPhoneName(), "kurodenwa", "親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトを子にした多重継承ができること", function() {
    var obj = Ipad.mix(Feature, Telephone);
    obj = obj.mix(Android, Iphone);
    deepEqual(obj.getPhoneName(), "ipad", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "garake-", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "kurodenwa", "親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.getPhoneName(), "android", "親の親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.parent.getPhoneName(), "iphone", "親の親の親の親オブジェクトにアクセスできること");
});

test("多重継承した後のオブジェクトを親にした多重継承ができること", function() {
    var obj = Ipad.mix(Feature, Telephone);
    obj = Iphone.mix(obj, Android);
    deepEqual(obj.getPhoneName(), "iphone", "子オブジェクトにアクセスできること");
    deepEqual(obj.parent.getPhoneName(), "ipad", "親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.getPhoneName(), "garake-", "親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.getPhoneName(), "kurodenwa", "親の親の親オブジェクトにアクセスできること");
    deepEqual(obj.parent.parent.parent.parent.getPhoneName(), "android", "親の親の親の親オブジェクトにアクセスできること");
});

test("Mixjs.module()で生成したオブジェクト自身はMix-inの影響を受けないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    deepEqual(obj.getType(), "old type", "Mix-inしたオブジェクトは継承したメソッドを取得できる");
    raises(function() {
        Iphone.getType();
    }, "多重継承の影響をうけていなければで未継承オブジェクトのメソッドは取得できない");
});

test("Mix-inしたオブジェクトの親からその親のメソッドを参照できること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    deepEqual(obj.parent.getType(), "old type", "親がその親のメソッドを参照できること");
});

test("多重継承したオブジェクトの親からその親のメソッドを参照できること", function() {
    var obj = Iphone.mix(Feature, Telephone);
    deepEqual(obj.parent.getType(), "old type", "親がその親のメソッドを参照できること");
});

test("Mix-inしたオブジェクトの親からその祖先のメソッドを参照できること", function() {
    var obj = Iphone.mix(Feature).mix(Android).mix(Telephone);
    deepEqual(obj.parent.getType(), "old type", "親がその親のメソッドを参照できること");
});

test("多重継承したオブジェクトの親からその祖先のメソッドを参照できること", function() {
    var obj = Iphone.mix(Feature, Android, Telephone);
    deepEqual(obj.parent.getType(), "old type", "親がその親のメソッドを参照できること");
});

test("Mix-in済みオブジェクトの親にMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone).mix(Android);
    deepEqual(obj.has(Telephone), true, "親オブジェクトにMix-inモジュールが含まれること");
});

test("Mix-in済みオブジェクトの親の親にMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone).mix(Android);
    deepEqual(obj.has(Android), true, "親の親オブジェクトにMix-inモジュールが含まれること");
});

test("多重継承済みオブジェクトにMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone, Android);
    deepEqual(obj.has(Iphone), true, "子オブジェクトにMix-inモジュールが含まれること");
});

test("多重継承済みオブジェクトの親にMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone, Android);
    deepEqual(obj.has(Telephone), true, "親オブジェクトにMix-inモジュールが含まれること");
});

test("多重継承済みオブジェクトの親の親にMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone, Android);
    deepEqual(obj.has(Android), true, "親の親オブジェクトにMix-inモジュールが含まれること");
});

test("Mix-in済みオブジェクトにMix-inしていないモジュールは含まれないこと", function() {
    var obj = Iphone.mix(Telephone);
    deepEqual(obj.has(Android), false, "Mix-inしていないモジュールは含まれないこと");
});

test("多重継承済みオブジェクトにMix-inしていないモジュールは含まれないこと", function() {
    var obj = Iphone.mix(Telephone, Android);
    deepEqual(obj.has(Ipad), false, "Mix-inしていないモジュールは含まれないこと");
});

test("hasによる所有判定ができること", function() {
   var obj = Iphone.mix(Feature).mix(Telephone),
       obj2 = Feature.mix(Telephone);
   deepEqual(obj.has(obj2), true, "所有判定ができること");
});

test("比較対象のモジュールのほうが多く継承している場合、hasによる所有判定ができないこと", function() {
   var obj = Iphone.mix(Feature),
       obj2 = Iphone.mix(Feature).mix(Telephone);
   deepEqual(obj.has(obj2), false, "比較対象のモジュールのほうが多く継承している場合、所有判定ができないこと");
});

test("equalによる一致判定ができること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone),
        obj2 = Iphone.mix(Feature, Telephone);
    deepEqual(obj.equal(obj2), true, "モジュールの一致判定ができること");
});

test("順序が異なる場合、equalによる一致判定ができないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone),
        obj2 = Telephone.mix(Feature).mix(Iphone);
    deepEqual(obj.equal(obj2), false, "順序が異なる場合、モジュールの一致判定ができないこと");
});

test("同じモジュールはMix-inされないこと", function() {
    var obj = Iphone.mix(Feature).mix(Iphone);
    deepEqual(obj.parent.hasOwnProperty("parent"), false, "親の親にモジュールへの参照はつかない");
});

test("includeを使ってインクルードする場合、同じモジュールはMix-inされないこと", function() {
    var scope = {};
    Mixjs.module("Test", scope, {
        include: Iphone
    });
    obj = scope.Test.mix(Iphone);
    deepEqual(obj.parent.hasOwnProperty("parent"), false, "親の親にモジュールへの参照はつかない");
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
    deepEqual(message, "'mix' can't be defined.", "mixメソッドは定義不可");
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
    deepEqual(message, "'parent' can't be defined.", "parentメソッドは定義不可");
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
    deepEqual(message, "'has' can't be defined.", "hasメソッドは定義不可");
});

test("モジュールにequalメソッドを定義した場合は例外が発生すること", function() {
    var message;
    try {
        Mixjs.module("ChinaPad", {
            equal: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "'equal' can't be defined.", "equalメソッドは定義不可");
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
    deepEqual(message, "'base' can't be defined.", "baseメソッドは定義不可");
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
    deepEqual(message, "'__moduleName__' can't be defined.", "__moduleName__プロパティは定義不可");
});

test("includeメソッドにMixjs#moduleで作成したオブジェクトが指定された場合、定義したモジュールにMix-inされること", function() {
    var scope = {};
    Mixjs.module("Test", scope, {
        include: Iphone
    });
    deepEqual(scope.Test.has(Iphone), true, "includeでMix-inが実行可能");
});

test("includeメソッドにMixjs#moduleで作成したオブジェクトが配列で指定された場合、定義したモジュールに順番にMix-inされること", function() {
    var scope = {};
    Mixjs.module("Test", scope, {
        include: [Iphone, Feature]
    });
    deepEqual(scope.Test.parent.getPhoneName(), "iphone", "includeでMix-inが実行可能で、親は1番目のモジュールになる");
    deepEqual(scope.Test.parent.parent.getPhoneName(), "garake-", "includeでMix-inが実行可能で、親は2番目のモジュールになる");
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
    deepEqual(message, "include method value must be mixjs module object.", "includeメソッドは関数による定義が不可");
    
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
    
    deepEqual(message, "include method value must be mixjs module object.", 
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
    deepEqual(message, "include method value must be mixjs module object.", "includeメソッドは関数による定義が不可");
    
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
    
    deepEqual(message, "include method value must be mixjs module object.", 
            "includeメソッドはmixjsオブジェクト以外定義が不可");
});

test("baseプロパティを使用するとレシーバが子モジュールになること", function() {
    var obj = PsVita.mix(PspGo, Psp);
    deepEqual(obj.parent.parent.getName(), "PSP", "baseプロパティを使わなければ呼ばれるのはPsp#getName");
    deepEqual(obj.parent.parent.getBaseName(), "PSVITA", "baseプロパティを使えば呼ばれるのはPsVita#getName");
});

test("baseプロパティを使用してレシーバを子モジュールに戻したとき、プロトタイプチェーンで子モジュールの親を呼べること", function() {
    var obj = PsVita.mix(PspGo, Psp);
    deepEqual(obj.parent.parent.getChainName(), "PSPGO", "Psp#getChainNameからPspGo#getChainNameを呼び出すがレシーバはPspGo");
});

test("スコープを指定してモジュールを定義できること", function() {
    var scope = {};
    Mixjs.module("Test1", scope, {name: "test1"});
    Mixjs.module("Test2", document, {name: "test2"});
    deepEqual(scope.Test1.name, "test1", "オブジェクトに対してモジュールをセットすることができる");
    deepEqual(document.Test2.name, "test2", "documentオブジェクトに対してモジュールをセットすることができる");
});

test("モジュール定義で引数を1つしか指定しない場合、例外が発生すること", function() {
    var message;
    try {
        var obj = Mixjs.module({});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of name must be string.", "第一引数にはモジュール名を文字列で指定しなければならない");
});

test("モジュール定義で引数を2つ指定するとき、戻り値がないこと", function() {
    var obj = Mixjs.module("Test", {});
    deepEqual(obj, undefined, "戻り値はundefined");
});

test("モジュール定義で引数を2つ指定するとき、第一引数(name)が文字列以外の場合、エラーが発生すること", function() {
    var message;
    try {
        Mixjs.module(100, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of name must be string.", "第一引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module(function() {}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of name must be string.", "第一引数に関数の指定は不可");
    
    message = null;
    try {
        Mixjs.module({}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of name must be string.", "第一引数にオブジェクトの指定は不可");
});

test("モジュール定義で引数を2つ指定するとき、第二引数(base)がオブジェクト以外の場合、エラーが発生すること", function() {
    var message;
    try {
        Mixjs.module("Test", "string");
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of base must be object.", "第二引数に文字列の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", 111);
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of base must be object.", "第二引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", function() {});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of base must be object.", "第二引数に関数の指定は不可");
});

test("モジュール定義で引数を3つ指定するとき、戻り値がないこと", function() {
    var obj = Mixjs.module("Test", {}, {});
    deepEqual(obj, undefined, "戻り値はundefined");
});

test("モジュール定義で引数を3つ指定するとき、第一引数(name)が文字列以外の場合、エラーが発生すること", function() {
    var message;
    try {
        Mixjs.module(100, {}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of name must be string.", "第一引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module(function() {}, {}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of name must be string.", "第一引数に関数の指定は不可");
    
    message = null;
    try {
        Mixjs.module({}, {}, {name: "test1"});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of name must be string.", "第一引数にオブジェクトの指定は不可");
});

test("モジュール定義で引数を3つ指定するとき、第二引数(scope)がオブジェクト以外の場合、エラーが発生すること", function() {
    var message;
    try {
        Mixjs.module("Test", "string", {});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of scope must be object.", "第二引数に文字列の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", 111, {});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of scope must be object.", "第三引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", function() {}, {});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of scope must be object.", "第三引数に関数の指定は不可");
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
    deepEqual(message, "Invalid argument: type of base must be object.", "第三引数に文字列の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", scope, 111);
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of base must be object.", "第三引数に数値の指定は不可");
    
    message = null;
    try {
        Mixjs.module("Test", scope, function() {});
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Invalid argument: type of base must be object.", "第三引数に関数の指定は不可");
});

test("Mix-inでモジュールの循環参照が発生した場合、例外が発生すること", function() {
    var message;
    try {
        Windows95.mix(WindowsXP).mix(Windows98.mix(WindowsXP))
    }
    catch (e) {
        message = e.message;
    }
    if ([,]!=0) {
        deepEqual(message, "The module cyclic reference error.", "循環参照エラーが起きる");
    }
    else {
        ok(true, "IE678以外では循環参照エラーは発生しない");
    }    
});

test("親にプリミティブ値を返すプロパティがあり、子にはそのプロパティがない場合、関数でラップされず値をそのまま返却すること", function() {
    var obj = Ds.mix(Dsi).mix(Ds3d);
    deepEqual(typeof obj.generation, "number", "Dsi#generationはnumberである");
    deepEqual(obj.generation, 2, "プロトタイプチェーンで値を取得できる");
});

test("モジュール自体に対してフックできること", function() {
    var obj = Iphone;
    var message = null, moduleName = null;
    obj.hook("getPhoneOS", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.getPhoneOS("hoge");
    deepEqual(message, "hoge", "Iphone#getPhoneOSをフックできる");
    deepEqual(moduleName, "Iphone", "フックしたモジュールのレシーバはIphone");
});

test("実行するメソッドは子、フック対象のメソッドのレシーバが子で実体メソッドが子にある場合、フックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook("getPhoneName", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.getPhoneName("hoge");
    deepEqual(message, "hoge", "Iphone#getPhoneNameをフックできる");
    deepEqual(moduleName, "Iphone", "フックしたモジュールのレシーバはIphone");
});

test("実行するメソッドは親、フック対象のメソッドのレシーバが子で実体メソッドが親にある場合、プロトタイプチェーンで辿って親をフックできること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook("setPhoneType", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.parent.setPhoneType("hoge");
    deepEqual(message, "hoge", "Feature#setPhoneTypeをフックできない");
    deepEqual(moduleName, "Feature", "モジュールのレシーバは取得できない");
});

test("実行するメソッドは親、フック対象のメソッドのレシーバが子で実体メソッドが子にある場合、フックされないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook("getPhoneName", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.parent.getPhoneName("hoge");
    deepEqual(message, null, "Feature#getPhoneNameをフックできない");
    deepEqual(moduleName, null, "モジュールのレシーバは取得できない");
});

test("実行するメソッドは親、フック対象のメソッドのレシーバが子で実体メソッドが親にある場合、chainフラグでもフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook("setPhoneType", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    }, true);
    obj.parent.setPhoneType("hoge");
    deepEqual(message, "hoge", "Feature#setPhoneTypeをフックできる");
    deepEqual(moduleName, "Feature", "フックしたモジュールのレシーバはFeature");
});

test("実行するメソッドは親、フック対象のメソッドのレシーバが子で実体メソッドが子にある場合、chainフラグでもフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook("getPhoneName", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    }, true);
    obj.parent.getPhoneName("hoge");
    deepEqual(message, "hoge", "Feature#getPhoneNameをフックできる");
    deepEqual(moduleName, "Feature", "フックしたモジュールのレシーバはFeature");
});

test("実行するメソッドは子、フック対象のメソッドのレシーバが親の場合、フックされないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.parent.hook("getPhoneOS", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.getPhoneOS("hoge");
    deepEqual(message, null, "Iphone#getPhoneOSをフックできない");
    deepEqual(moduleName, null, "モジュールのレシーバは取得できない");
});

test("実行するメソッドは子、フック対象のメソッドのレシーバが親の場合、子と親に同じメソッドがあってもフックされないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.parent.hook("getPhoneName", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.getPhoneName("hoge");
    deepEqual(message, null, "Iphone#getPhoneNameをフックできない");
    deepEqual(moduleName, null, "モジュールのレシーバは取得できない");
});

test("実行するメソッドは子、フック対象のメソッドのレシーバが親の場合、chainフラグを立ててもフックされないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.parent.hook("getPhoneOS", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    }, true);
    obj.getPhoneOS("hoge");
    deepEqual(message, null, "Iphone#getPhoneOSをフックできる");
    deepEqual(moduleName, null, "モジュールのレシーバは取得はIphone");
});

test("実行するメソッドは子、フック対象のメソッドのレシーバが親の場合、子と親に同一名のメソッドがありchainフラグを立ててもフックされないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.parent.hook("getPhoneName", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    }, true);
    obj.getPhoneName("hoge");
    deepEqual(message, null, "Iphone#getPhoneNameをフックできない");
    deepEqual(moduleName, null, "モジュールのレシーバは取得できない");
});

test("実行するメソッドは子、フック対象のメソッドの実体が親の親でフック時のレシーバが子の場合、プロトタイプチェーンをたどってフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook("getType", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.getType("hoge");
    deepEqual(message, "hoge", "Telephone#ggetTypeをフックできること");
    deepEqual(moduleName, "Telephone", "モジュールのレシーバは取得できる");
});

test("実行するメソッドは子、フック対象のメソッドの実体が親の親でフック時のレシーバが子の場合、chainフラグが立っててもプロトタイプチェーンをたどってフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook("getType", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    }, true);
    obj.getType("hoge");
    deepEqual(message, "hoge", "Telephone#getTypeをフックできること");
    deepEqual(moduleName, "Telephone", "モジュールのレシーバは取得はTelephone");
});

test("実行するメソッドは子、フック対象のメソッドの実体が親の親でフック時のレシーバが親の場合、プロトタイプチェーンをたどってフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.parent.hook("getType", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.getType("hoge");
    deepEqual(message, "hoge", "Telephone#getTypeをフックできること");
    deepEqual(moduleName, "Telephone", "モジュールのレシーバは取得はTelephone");
});

test("実行するメソッドは子、フック対象のメソッドの実体が親の親でフック時のレシーバが親の場合、chainフラグが立っててもプロトタイプチェーンをたどってフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.parent.hook("getType", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    }, true);
    obj.getType("hoge");
    deepEqual(message, "hoge", "Telephone#getTypeをフックできること");
    deepEqual(moduleName, "Telephone", "モジュールのレシーバは取得はTelephone");
});

test("実行するメソッドは子、フック対象のメソッドの実体が親の親でフック時のレシーバが親の親の場合、プロトタイプチェーンをたどってフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.parent.parent.hook("getType", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.getType("hoge");
    deepEqual(message, "hoge", "Telephone#getTypeをフックできること");
    deepEqual(moduleName, "Telephone", "モジュールのレシーバは取得はTelephone");
});

test("実行するメソッドは子、フック対象のメソッドの実体が親の親でフック時のレシーバが親の親の場合、chainフラグが立っててもプロトタイプチェーンをたどってフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.parent.parent.hook("getType", function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    }, true);
    obj.getType("hoge");
    deepEqual(message, "hoge", "Telephone#getTypeをフックできること");
    deepEqual(moduleName, "Telephone", "モジュールのレシーバは取得はTelephone");
});

test("正規表現によるフックができること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook(/get.*?/, function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.getPhoneName("hoge");
    deepEqual(message, "hoge", "Iphone#getPhoneNameをフックできること");
    deepEqual(moduleName, "Iphone", "モジュールのレシーバは取得はIphone");
});

test("正規表現によるフックをしたとき、プロトタイプチェーンを辿ってフックできること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook(/getT.*?/, function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.getType("hoge");
    deepEqual(message, "hoge", "Telephone#getTypeをフックできること");
    deepEqual(moduleName, "Telephone", "モジュールのレシーバは取得はTelephone");
});

test("正規表現によるフックで、chainフラグを立てない場合、フックしたメソッドと同一名の親メソッドはフックされないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook(/getPhone.*?/, function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.parent.getPhoneName("hoge");
    deepEqual(message, null, "Feature#getPhoneNameはフックできないこと");
    deepEqual(moduleName, null, "モジュールのレシーバは取得はできない");
});

test("正規表現によるフックで、chainフラグを立てない場合、フックしたメソッドと同一名の親の親メソッドはフックされないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook(/getPhone.*?/, function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    });
    obj.parent.parent.getPhoneName("hoge");
    deepEqual(message, null, "Feature#getPhoneNameはフックできないこと");
    deepEqual(moduleName, null, "モジュールのレシーバは取得はできない");
});

test("正規表現によるフックで、chainフラグを立てた場合、フックしたメソッドと同一名の親メソッドがフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook(/getPhone.*?/, function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    }, true);
    obj.parent.getPhoneName("hoge");
    deepEqual(message, "hoge", "Feature#getPhoneNameをフックできること");
    deepEqual(moduleName, "Feature", "モジュールのレシーバは取得はFeature");
});

test("正規表現によるフックで、chainフラグを立てた場合、フックしたメソッドと同一名の親の親メソッドがフックされること", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var message = null, moduleName = null;
    obj.hook(/getPhone.*?/, function(arg) {
        moduleName = this.__moduleName__;
        message = arg;
    }, true);
    obj.parent.parent.getPhoneName("hoge");
    deepEqual(message, "hoge", "Telephone#getPhoneNameをフックできること");
    deepEqual(moduleName, "Telephone", "モジュールのレシーバは取得はTelephone");
});

test("予約済みメソッドに対してはフックできないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    var prohibits = ['mix', 'parent', 'has', 'equal', 'base', 'hook', '__hookStack__', '__moduleName__'];
    var message;
    for (var i in prohibits) {
        try {
            obj.hook(prohibits[i], function() {});
        }
        catch (e) {
            message = e.message;
        }
        deepEqual(message, "'" + prohibits[i] + "' can't be hooking.", "Mixjs予約済みプロパティ「" + prohibits[i] + "」に対してはフックはできない");
        message = "";
    }
});

test("Interfaceにモジュールを指定してモジュール定義ができること", function() {
    var obj = Iphone4s;
    deepEqual(obj.hasOwnProperty("getPhoneOS"), true, "Iphone#getPhoneOSを実装している");
    deepEqual(obj.category, "AdvancedSmartPhone", "Interfaceのプロパティをモジュールに定義したプロパティで上書きされる");
});

test("Interfaceに複数モジュールを指定してモジュール定義ができること", function() {
    var obj = Iphone5;
    deepEqual(obj.hasOwnProperty("getPhoneOS"), true, "Iphone#getPhoneOSを実装している");
    deepEqual(obj.hasOwnProperty("setPhoneType"), true, "Feature#setPhoneTypeを実装している");
    deepEqual(obj.category, "SuperAdvancedSmartPhone", "Interfaceのプロパティをモジュールに定義したプロパティで上書きされる");
});

test("引数にMixjsモジュール以外のオブジェクトを指定した場合、例外が発生すること", function() {
    var scope = {}, message;
    try {
        Mixjs.interface(scope).module("Test11", scope, {
            type: "LL"
        });
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Arguments must be mixjs module object.", "Mixjs#interfaceにMixjsオブジェクト意外を渡すと例外");
});

test("無名関数でラップまたは明示的にレシーバを指定してcallしたとき、正常に実行出来ること", function() {
    deepEqual(Galaxy.phoneCallOk1(), "push 110", "明示的にレシーバを指定するときは正常に実行出来る");
    deepEqual(Galaxy.phoneCallOk2(), "push 110", "無名関数でラップしたときは正常に実行出来る");
});

test("無名関数でラップせずに引数に関数を指定したとき、レシーバが特定できずに例外が発生すること", function() {
    var message;
    try {
        Galaxy.phoneCall();
    }
    catch (e) {
        message = e.message;
    }
    deepEqual(message, "Unknown properties of receiver: pushNumber", "イベントに直接関数を渡すとレシーバが特定できない");
});

test("初めてメソッドが呼ばれたとき、initializeメソッドが実行されること", function() {
    var obj = SpecialWeek.mix(SundaySilence);
    deepEqual(obj.getCountry(), "JPN", "Mix-inされたモジュールのinitializeメソッドが実行されること");
    deepEqual(obj.parent.getCountry(), "USA", "Mix-inされたモジュールのinitializeメソッドが実行されること");
});

test("intiialize実行後、initialize用にフックした内容がクリアされること", function() {
    var obj = SpecialWeek.mix(SundaySilence);
    // IEではプロトタイプチェーンでたどれないので処理を入れる
    var hookStack = null;
    if ([,]!=0) {
        var _obj = obj;
        while (_obj.hasOwnProperty('parent')) {
            _obj = _obj.parent;
        }
        hookStack = _obj.__hookStack__;
    }
    else {
        hookStack = obj.__hookStack__;
    }

    notDeepEqual(hookStack, {}, "Mix-inされたモジュールのinitializeメソッドが実行されること");
    obj.getCountry();
    obj.parent.getCountry();

    if ([,]!=0) {
        var _obj = obj;
        while (_obj.hasOwnProperty('parent')) {
            _obj = _obj.parent;
        }
        hookStack = _obj.__hookStack__;
    }
    else {
        hookStack = obj.__hookStack__;
    }

    deepEqual(hookStack, {}, "Mix-inされたモジュールのinitializeメソッドが実行されること");
});

test("initializeメソッド実行前にフックした処理が、inititalizeメソッド実行後に実行可能なこと", function() {
    var obj = BuenaVista;
    var country = null;
    obj.hook("getCountry", function() {
        country = "JPN";
    });
    obj.getCountry();
    deepEqual(country, "JPN", "通常のhookが実行されること");
});

test("Mix-inしたとき、Mix-inしたモジュールのmixedメソッドが実行されること", function() {
    var obj = Ubuntu.mix(Fedora);
    var name = obj.getName();
    deepEqual(name, "fedora", "Mix-inされたモジュールのmixedメソッドが実行されること");
});

test("多重継承したとき、継承したモジュールのmixedメソッドが実行されること", function() {
    var obj = Ubuntu.mix(Fedora, Debian);
    var list = obj.getName();
    deepEqual(list[0], "fedora", "多重継承されたモジュールのmixedメソッドが実行されること");
    deepEqual(list[1], "debian", "多重継承されたモジュールのmixedメソッドが実行されること");
});

test("内部Mix-inしたとき、Mix-inしたモジュールのmixedメソッドが実行されること", function() {
    var obj = Ubuntu.mix(CentOS);
    var list = obj.getName();
    deepEqual(list[0], "fedora", "内部Mix-inされたモジュールのmixedメソッドが実行されること");
});

test("内部Mix-inしたとき、Mix-inしたモジュールのinitializeメソッドが実行されること", function() {
    var obj = Ubuntu.mix(RedHat);
    var list = obj.getName();
    deepEqual(list[0], "fedora", "内部Mix-inされたモジュールのinitializeメソッドが実行されること");
    deepEqual(list[1], "debian", "内部Mix-inされたモジュールのinitializeメソッドが実行されること");
});
