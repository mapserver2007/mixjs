module("mix.js");

test("Module.create()でmixメソッドが追加されること", function() {
    var obj = Module.create({})
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

test("Module.create()で生成したオブジェクト自身はMix-inの影響を受けないこと", function() {
    var obj = Iphone.mix(Feature).mix(Telephone);
    same(obj.getType(), "old type", "Mix-inしたオブジェクトは継承したメソッドを取得できる");
    raises(function() {
        Iphone.getType();
    }, "多重継承の影響をうけていなければで未継承オブジェクトのメソッドは取得できない");
});

test("Module.create()で生成したオブジェクト自身は多重継承の影響を受けないこと", function() {
    var obj = Iphone.mix(Feature, Telephone);
    same(obj.getType(), "old type", "多重継承したオブジェクトは継承したメソッドを取得できる");
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

test("Mix-in済みオブジェクトにMix-inしたモジュールが含まれていること", function() {
    var obj = Iphone.mix(Telephone).mix(Android);
    same(obj.has(Iphone), true, "子オブジェクトにMix-inモジュールが含まれること");
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

test("同じモジュールをMix-inした場合は例外が発生すること", function() {
    var message;
    try {
        var obj = Iphone.mix(Feature).mix(Iphone);
    }
    catch (e) {
        message = e.message;
    }
    same(message, "mix-in the same module.", "同じモジュールをMix-inした場合は例外が発生する");
});

test("モジュールにmixメソッドを定義した場合は例外が発生すること", function() {
    var message;
    try {
        var ChinaPad = Module.create({
            mix: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "mix method can't be defined.", "mixメソッドは定義不可");
});

test("モジュールにparentメソッドを定義した場合は例外が発生すること", function() {
    var message;
    try {
        var ChinaPad = Module.create({
            parent: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "parent method can't be defined.", "parentメソッドは定義不可");
});

test("モジュールに__parent__メソッドを定義した場合は例外が発生すること", function() {
    var message;
    try {
        var ChinaPad = Module.create({
            __parent__: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "__parent__ method can't be defined.", "hasメソッドは定義不可");
});

test("モジュールにhasメソッドを定義した場合は例外が発生すること", function() {
    var message;
    try {
        var ChinaPad = Module.create({
            has: function() {}
        });
    }
    catch (e) {
        message = e.message;
    }
    same(message, "has method can't be defined.", "hasメソッドは定義不可");
});

test("内部用親参照プロパティと外部用親参照プロパティを併用できないこと", function() {
    var obj = Psp.mix(PspGo, PsVita);
    var message;
    
    try {
        obj.parent.__parent__.getName();
    }
    catch (e) {
        message = e.message;
    }
    notStrictEqual(typeof message, "undefined", "__parent__とparentは併用できない");
    
    try {
        obj.__parent__.parent.getName();
    }
    catch (e) {
        message = e.message;
    }
    notStrictEqual(typeof message, "undefined", "parentと__parent__は併用できない");
});

test("メソッドの親参照時に外部用親参照プロパティ経由の場合、子モジュール内のメソッドが呼ばれること", function() {
    var obj = Psp.mix(PspGo, PsVita);
    same(obj.parent.getName(), "PSP", "外部用親参照プロパティ経由時は子モジュールのメソッドが呼ばれる");
    same(obj.parent.myName(), "PSPGO", "外部用親参照プロパティ経由でもレシーバがthisでない場合はそのまま親メソッドが返す値を取得する");
    same(obj.parent.parent.getName(), "PSP", "外部用親参照プロパティ経由時は子モジュールのメソッドが呼ばれる");
    same(obj.parent.parent.myName(), "PSVITA", "外部用親参照プロパティ経由でもレシーバがthisでない場合はそのまま親の親メソッドが返す値を取得する");
});

test("メソッドの親参照時に内部用親参照プロパティ経由の場合、親モジュール内のメソッドが呼ばれること", function() {
    var obj = Psp.mix(PspGo, PsVita);
    same(obj.__parent__.getName(), "PSPGO", "内部用親参照プロパティ経由時は親モジュールのメソッドが呼ばれる");
    same(obj.__parent__.myName(), "PSPGO", "内部用親参照プロパティ経由でもレシーバに関係なく親モジュールのメソッドが呼ばれる");
    same(obj.__parent__.__parent__.getName(), "PSVITA", "内部用親参照プロパティ経由時は子モジュールのメソッドが呼ばれる");
    same(obj.__parent__.__parent__.myName(), "PSVITA", "内部用親参照プロパティ経由でもレシーバに関係なく親の親メソッドが返す値を取得する");
});