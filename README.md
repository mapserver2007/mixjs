# mix.js
mix.js is a library for prototype based object oriented programming.
# How to use
###definition module
module for mix.js defines the following a method:

    var Iphone = Module.create({
        getName: function() {
            return "iphone";
        },
        getType: function() {
            return "smart phone";
        }
    });

***

###module mix-in
mix.js modules easily can use the mix-in.

    var Feature = Module.create({
        getName: function() {
            return "garake-";
        }
    });

    var obj = Iphone.mix(Feature);
    console.log(obj.getType()); // smart phone

***

###refer to parent
Mix-in object have parent-child relationship between modules.  
(don't be overwrite the properties.)  
Therefore mix-in object can refer to parent method using "parent" property.

    console.log(obj.getName()); // iphone
    console.log(obj.parent.getName()); // garake-

***

###mix-in chain, multiple inheritance
As well as mix-in, mix-in chain and multiple inheritance is possible.

    var Telephone = Module.create({
        getName: function() {
            return "kurodenwa";
        }
    });

    var obj1 = Iphone.mix(Feature).mix(Telephone); // mix-in chain
    var obj2 = Iphone.mix(Feature, Telephone); // multiple inheritance

***

###checking inherited module
mix.js is implemented "has" method can check if an object is mix-in the module.

    console.log(obj.has(Iphone)); // true
    console.log(obj.has(Android)); // false

# Caution
### The same module can't mix-in
Throw exception if define the same module.

    Iphone.mix(Feature).mix(Iphone); // throw exception

### Can't define "mix", "parent", "has" in module.
"mix", "parent", "has" method or property is not used because it is reserved in mix.js.
    
    // throw exception
    var Iphone = Module.create({
        mix: function() {}
    });

# License
Licensed under the MIT
http://www.opensource.org/licenses/mit-license.php