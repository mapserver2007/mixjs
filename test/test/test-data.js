// module define
var Telephone = Module.create({
    getPhoneName: function() {
        return "kurodenwa";
    },
    getType: function() {
        return "old type";
    }
});

var Feature = Module.create({
    getPhoneName: function() {
        return "garake-";
    }
});

var Iphone = Module.create({
    getPhoneName: function() {
        return "iphone";
    }
});

var Android = Module.create({
    getPhoneName: function() {
        return "android";
    }
});

var Ipad = Module.create({
    getPhoneName: function() {
        return "ipad";
    }
});
