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
    obj.mix(Telephone);
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
    raises(function() {
        var obj = Iphone.mix(Feature).mix(Iphone);
    }, "mix-in the same module.","同じモジュールをMix-inした場合は例外が発生する");
});