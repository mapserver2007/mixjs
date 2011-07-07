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

var Psp = Module.create({
    myName: function() {
        return "PSP";
    },
    getName: function() {
        return this.myName();
    }
});

var PspGo = Module.create({
    myName: function() {
        return "PSPGO";
    },
    getName: function() {
        return this.myName();
    }
});

var PsVita = Module.create({
    myName: function() {
        return "PSVITA";
    },
    getName: function() {
        return this.myName();
    }
});