# mix.js
mix.jsはプロトタイプベースオブジェクト指向プログラミング(OOP)用ライブラリです。 
クラスベースOOPのようにクラスを定義してインスタンスを作る方法ではなく、オブジェクトのみによるOOPを実現します。 
最大の特長はMix-inによって親子関係を維持する機能を持っている点です。
***
###モジュールの定義方法
mix.jsでは「モジュール」という単位でオブジェクトを定義します。  
モジュールの定義方法は2通りあります。

Mixjs#moduleの第一引数にモジュールのメソッドを定義します。戻り値がmix.jsのオブジェクトとなります。  
戻り値を変数に代入するので、ローカル変数にモジュールを定義したときにこの方法を使います。

#####モジュール定義方法その1

    Mixjs.module("Iphone", {
        name: "iphone",
        getPhoneName: function() {
            return this.name;
        }
    });

Mixjs#moduleの第一引数にモジュール名を文字列で、第二引数にモジュールのメソッドを定義します。  
第一引数に指定した変数はグローバル変数となるので、どこからでもモジュールを参照したい場合などにこの方法を使います。 

#####モジュール定義方法その2

    var scope = {};
    Mixjs.module("Iphone", scope, {
        name: "iphone",
        getPhoneName: function() {
            return this.name;
        }
    });

Mixjs#moduleの第一引数にモジュール名を文字列で、第二引数にモジュールを格納するオブジェクト、第三引数にモジュールのメソッドを定義します。  
第二引数にはオブジェクトを指定すると、オブジェクトの中にモジュールが定義されます。  
グローバルの名前を汚染したくない場合やひとつのオブジェクトにモジュールを集約して定義した場合などにこの方法を使います。

***
###Interfaceモジュールを使う
Mixjs#interfaceに定義済みモジュールを指定すると、指定したモジュールのプロパティをベースにモジュールを定義することができます。  
使用するときは以下のように記述します。

    Mixjs.interface(Iphone).module("Iphone4s", {
        name: "iphone4s"
    });

    var obj = Iphone4s;
    obj.getPhoneName(); // Iphone#getPhoneNameをIphone4sに実装
    obj.name; // iphone4s
    
同じモジュールが指定された場合、Interfaceモジュールは直後に定義したモジュールのプロパティで上書きされます。  
また、Mixjs#interfaceには複数のモジュールの指定も可能です。

    Mixjs.interface(Iphone, Iphone4).module("Iphone5", {
        name: "iphone5"
    });

Interfaceモジュールに指定したモジュール同士に同じメソッド名が定義してあった場合、あとに指定したメソッド名が有効になります。  
上記例の場合、Iphone#getNameとIphone4#getNameが重複した場合、Iphone5にはIphone4#getNameが実装されます。

***
###Mix-inと多重継承(mix)
mix.jsではクラスベースの単一継承にあたる処理を「Mix-in」と呼びます。定義したモジュールをMix-inすることで親子関係を持ったオブジェクトを作成できます。

    Mixjs.module("Iphone", {
        name: function() {
            return "iphone";
        }
    });

    Mixjs.module("Feature", {
        name: function() {
            return "garake-";
        }
    });

    Mixjs.module("Telephone", {
        name: function() {
            return "kurodenwa";
        }
    });

    var obj1 = Iphone.mix(Feature); // Mix-in
    var obj2 = Iphone.mix(Feature).mix(Telephone); // Mix-inのチェーン
    var obj3 = Iphone.mix(Feature, Telephone); // 多重継承

Mix-inはmixメソッドを使って行います。Mixjs#moduleで作成したオブジェクトには自動的にmixメソッドが追加されます。  
Min-inを実行すると親子関係を持ったオブジェクトが作成されます。上記の場合、Iphoneモジュールが子、Featureモジュールが親としたオブジェクトobj1が作成されます。  
また、mixメソッドはチェーンを使って連続で実行することが可能です。そして、チェーンさせず一気に多重継承させることも可能です。  
多重継承の場合は、mixメソッドの引数に継承させたいモジュールを列挙します。多重継承させたいモジュールの指定数に制限はありません。 

***
###親を参照する(parent)
継承関係が維持されているため、Mix-inや多重継承を行った後に親モジュールのメソッドを参照することができます。

    Mixjs.module("Iphone", {
        name: function() {
            return "iphone";
        },
        parentName: function() {
            return this.parent.name();
        }
    });

    Mixjs.module("Feature", {
        name: function() {
            return "garake-";
        }
    });

    var obj = Iphone.mix(Feature); // Mix-in
    console.log(obj.name()); // iphone
    console.log(obj.parent.name()); // garake-
    console.log(obj.parentName()); // garake-

parentプロパティを使うことで親を参照することができます。parentプロパティもmixメソッドと同様にMixjs#moduleで作成したモジュールに自動的に定義されます。parentプロパティはMix-inして作成したオブジェクトからだけでなく、モジュール定義の中でも使用可能です。ただしその場合は当該モジュールがMix-inされていなければエラーとなります。

***
###内部Mix-in、内部多重継承(include)
mixメソッドを使ったMix-inはモジュールを定義したあとに行う「外部Mix-in」と呼ぶことができる機能ですが、includeプロパティを使うことでモジュール定義時にMix-inを実行することができます。ここでは「内部Mix-in」と呼びます。

    Mixjs.module("Iphone", {
        include: Feature,
        name: function() {
            return "iphone";
        },
        parentName: function() {
            return this.parent.name();
        }
    });

includeプロパティにMix-inしたい親モジュールを定義します。Iphoneモジュールの親はFeatureモジュールになります。  
includeによるMix-inは定義したモジュールがあるモジュールに依存している場合、includeによる内部Mix-inであらかじめMix-inしておくなどの用途で使用します。また、includeプロパティには複数のモジュールを指定する「内部多重継承」も可能です。

    Mixjs.module("Iphone", {
        include: [Feature, Telephone],
        name: function() {
            return "iphone";
        },
        parentName: function() {
            return this.parent.name();
        }
    });

内部多重継承したいモジュールをincludeプロパティに配列で指定します。配列として指定したモジュールの順番にMix-inされます。上記の場合、Iphoneの親はFeature、Featureの親はTelephoneとなります。

***
###Mix-in済みかどうか調べる(has)
多くのモジュールを定義し、Mix-inしたときにどのモジュールをMix-inしてあるのか調べることができます。

    var obj = Iphone.mix(Feature);
    console.log(obj.has(Iphone)); // true;
    console.log(obj.has(Telephone)); // false

Mixjs#moduleで定義したモジュールには自動的にhasメソッドが定義されます。

***
###親から子を参照する(base)
複数のモジュールを定義し、再利用性を高めたい場合、以下のような問題があります。

    Mixjs.module("Iphone", {
        name: function() {
            return "iphone";
        }
    });

    Mixjs.module("Telephone", {
        name: function() {
            return "kurodenwa";
        },
        getName: function() {
            return this.name(); // ←これが指す先が問題
        }
    });

Telephone#getName内のthisはTelephone#nameを指します。しかし、これではTelephoneを親としてgetNameメソッドを他の子モジュールでも再利用したい場合に不都合が生じます。

    var obj = Iphone.mix(Telephone);
    console.log(obj.getName()); // kurodenwa

getNameメソッド内のthisがTelephoneと等しいためこのような結果になります。ですが、直感的にはこのような場合getNameメソッド内のthisはIphoneを指すと思うでしょう(Javaなどではこの動きです)。baseプロパティを使うことでこの問題を解決することができます。

    Mixjs.module("Iphone", {
        name: function() {
            return "iphone";
        }
    });

    Mixjs.module("Telephone", {
        name: function() {
            return "kurodenwa";
        },
        getName: function() {
            return this.base.name();
        }
    });

    var obj = Iphone.mix(Telephone);
    console.log(obj.getName()); // iphone;

baseプロパティを使ってメソッド呼び出しすることで、thisが継承階層の一番下(子)を指すように変更されます。上記の場合、baseプロパティによりthisはTelephoneからIphoneに変更されます。従ってgetNameメソッドを実行するとiphoneが表示されます。  
こうすることで、親モジュールのメソッドを子モジュールのメソッドで流用することができるようになります。

***
###任意のメソッドをフックする(hook)
モジュール内で定義したメソッド(関数のみ)に対してフック処理を掛けることができます。フック処理により、メソッドを実行する前に任意の処理を挟むことができます。  
引数のバリデーション、特定のメソッドのみに対して共通処理を行いたい場合などに有効です。 

    var obj = Iphone.mix(Feature).mix(Telephone);
    obj.hook("name", function() {
        // フック処理
    });
    obj.name();

obj.name()により、Iphone#nameが実行されますが、Iphone#nameの実行の直前にhookメソッドに登録した関数が実行されます。  
この場合、Iphone#nameに対してのみフックされますが、親に同一名のメソッドが定義されていた場合、まとめてフックすることができます。 

    var obj = Iphone.mix(Feature).mix(Telephone);
    obj.hook("name", function() {
        // フック処理
    }, true);
    obj.name(); // Iphone#name
    obj.parent.name(); // Feature#name

hookメソッドの第三引数にtrueをセットすると、親も含め全てのnameメソッドに対してフックされます。  
Feature#nameが実行された時もhookメソッドに登録した関数が実行されるようになります。

hook関数の第一引数であるメソッド名の指定には正規表現も使用できます。 

    var obj = Iphone.mix(Feature).mix(Telephone);
    obj.hook(/get*/, function() {
        // フック処理
    });
    obj.getName(); // Iphone#getName
    obj.getType(); // Telephone#getType

getから始まるメソッド名に対してフックを掛けることができます。  
また、Telephone#getTypeのようにプロトタイプチェーンで辿るタイプのメソッドについてもフックすることができます。 

***
###モジュール定義における制約
mix.jsで使用している名前空間「Mixjs」はグローバル変数として定義しているため、同じ名前をグローバル領域で定義できません。  
また、Mixjs#moduleを使ってモジュール定義したときに以下のメソッド名またはプロパティ名は使うことができません。これらのメソッド名とプロパティ名と同じ名前が使われた場合、例外が発生します。 

* mix
* parent
* include
* has
* base
* hook
* \_\_moduleName\_\_
* \_\_hookStack\_\_

***
###メソッド呼び出しにおける制約
mix.jsにより定義した各メソッドはフック可能状態になっています。これが影響しメソッド呼び出し時に制約が生じます。  
引数に関数を渡す場合、以下の方法を取る必要があります。

    Mixjs.module("Iphone", {
        click: function(func) {
            func(); // ← このようにしない(例外が発生)
            func.call(this); // ← こうする
        },
        name: function() {}
    });

    var obj = Iphone.mix(Feature);
    obj.click(obj.name); // Iphone#clickにIphone#name(関数)を渡す

または、以下のようにします。

    Mixjs.module("Iphone", {
        click: function(func) {
            func(); // ← このようにしてもよい
            func.call(this); // ← このようにしてもよい
        },
        name: function() {}
    });

    var obj = Iphone.mix(Feature);
    obj.click(function() {
        obj.name();  // Iphone#clickに無名関数でラップしたIphone#nameを渡す
    });

引数に関数を渡し、呼び出し先でその関数を実行する場合、レシーバを明示的に指定するか(前者)、無名関数でラップすることでレシーバをmix.js内部で特定できる状態(後者)にして下さい。
この問題は、イベント処理などでよく発生すると思われます。例えば、jQueryのclickメソッドなどでは、上記の後者のパターンを実施してください。
    
    var obj = Iphone.mix(Feature);
    // $("#container").click(obj.name); ← 例外が発生
    $("#container").click(function() {
        obj.name();
    });

***
###モジュールMix-in時の注意
同じモジュールをMix-inすると、エラーは発生しませんがMix-inされません。
    
    var obj = Iphone.mix(Iphone);
    console.log(obj.__moduleName__); // Iphone
    console.log(obj.parent.__moduleName__); // error

ただし次の場合はMix-inされます。 
上記の例だと、子と親は全く同じモジュールなのでMix-inは実行されません。

    var obj = Iphone.mix(Feature.mix(Iphone));
    console.log(obj.__moduleName__); // Iphone
    console.log(obj.parent.__moduleName__); // Feature
    console.log(obj.parent.parent.__moduleName__); // Iphone

Mix-inはmixメソッドに渡されるオブジェクト単位(Mix-in済みモジュール含む)で実行されます。  
つまり、渡されるオブジェクトが同じでない限りMix-inは可能です。  
上記の例だと、子と親の親が同じモジュールですが、子の親はMix-in済みのオブジェクトなので子と親は異なるオブジェクトとみなします。従ってMix-inが実行されます。  
また、モジュールがお互いを参照しあう状態(循環参照)が発生すると例外が発生します(IE6,7,8の場合のみ)。  
発生してしまった場合はMix-inの順序に問題がありますので見直してください。

***
###mix.js用拡張モジュール
mix.js用の機能拡張モジュールが予め用意されています(mix.modules.js)。用意されているモジュールは以下のとおりです。

* Utils(ソート機能、jQueryローダなどを提供)
* Cache(キャッシュ機能を提供)
* Cookie(cookie機能を提供)
* Design(デザインに関するモジュールを提供)
* Http(HTTP通信関連機能を提供)

##License
Licensed under the MIT
http://www.opensource.org/licenses/mit-license.php