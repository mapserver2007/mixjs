// module define
Mixjs.module("Telephone", {
    getPhoneName: function() {
        return "kurodenwa";
    },
    getType: function() {
        return "old type";
    }
});

Mixjs.module("Feature", {
    getPhoneName: function() {
        return "garake-";
    }
});

Mixjs.module("Iphone", {
    getPhoneName: function() {
        return "iphone";
    }
});

Mixjs.module("Android", {
    getPhoneName: function() {
        return "android";
    }
});

Mixjs.module("Ipad", {
    getPhoneName: function() {
        return "ipad";
    }
});

Mixjs.module("Psp", {
    myName: function() {
        return "PSP";
    },
    getName: function() {
        return this.myName();
    },
    getBaseName: function() {
        return this.base.myName();
    },
    getChainName: function() {
        return this.base.getChainName();
    }
});

Mixjs.module("PspGo", {
    myName: function() {
        return "PSPGO";
    },
    getName: function() {
        return this.myName();
    },
    getChainName: function() {
        return this.myName();
    }
});

Mixjs.module("PsVita", {
    myName: function() {
        return "PSVITA";
    },
    getName: function() {
        return this.myName();
    }
});

Mixjs.module("Windows95", {
    name: function () {
        return "windows95";
    }
});

Mixjs.module("Windows98", {
    include: Windows95,
    name: function () {
        return "windows98";
    }
});

Mixjs.module("WindowsXP", {
    include: Windows98,
    name: function () {
        return "windowsxp";
    }
});
