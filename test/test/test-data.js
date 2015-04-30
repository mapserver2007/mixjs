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
    },
    setPhoneType: function(type) {}
});

Mixjs.module("Iphone", {
    category: "SmartPhone",
    getPhoneOS: function(os) {},
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

Mixjs.module("WindowsVista", {
    include: [Windows98],
    name: function () {
        return "windowsvista";
    }
});

Mixjs.module("Windows7", {
    include: [Windows95, WindowsVista],
    name: function () {
        return "windowsvista";
    }
});

Mixjs.module("Ds", {
    name: "DS"
});

Mixjs.module("Dsi", {
    name: "DSi",
    generation: 2
});

Mixjs.module("Ds3d", {
    name: "3DS",
    generation: 3
});

var scope = {};
Mixjs.module("Iphone", scope, {
    getPhoneName: function() {
        return "iphone";
    }
});

Mixjs.module("Feature", scope, {
    getPhoneName: function() {
        return "garake-";
    }
});

Mixjs.interface(Iphone).module("Iphone4s", {
    category: "AdvancedSmartPhone",
    getAppName: function() {
        return "iBook";
    }
});

Mixjs.interface(Iphone, Feature).module("Iphone5", {
    category: "SuperAdvancedSmartPhone",
    getAppName: function() {
        return "Siri";
    }
});

Mixjs.module("Galaxy", {
    alert: function(func) {
        return func.call();
    },
    alert2: function(func) {
        return func.call(this);
    },
    pushNumber: function() {
        return "push 110";
    },
    phoneCall: function() {
        return this.alert(this.pushNumber);
    },
    phoneCallOk1: function() {
        return this.alert2(this.pushNumber);
    },
    phoneCallOk2: function() {
        var self = this;
        return this.alert(function() {
            return self.pushNumber();
        });
    }
});

Mixjs.module("SundaySilence", {
    initialize: function() {
        this.country = "USA";
    },

    getCountry: function() {
        return this.country;
    }
});

Mixjs.module("SpecialWeek", {
    initialize: function() {
        this.country = "JPN";
    },

    getCountry: function() {
        return this.country;
    }
});

Mixjs.module("BuenaVista", {
    getCountry: function() {
        return this.country;
    }
});

Mixjs.module("Ubuntu", {
    mixed: function() {
        this.base.name = "ubuntu";
    },
    getName: function() {
        return this.name;
    }
});

Mixjs.module("Fedora", {
    mixed: function() {
        this.base.name = "fedora";
    },
    getName: function() {
        return this.name;
    }
});

Mixjs.module("Debian", {
    mixed: function() {
        this.base.name = "debian";
    },
    getName: function() {
        return this.name;
    }
});

Mixjs.module("CentOS", {
    include: Fedora,
    getName: function() {
        return this.name;
    }
});

Mixjs.module("RedHat", {
    include: [Fedora, Debian],
    getName: function() {
        return this.name;
    }
});

Mixjs.module("Kindle", {
    staticInitialize: function() {
        this.name = "static";
    },

    initialize: function() {
        this.name += " dynamic";
    },

    getName: function() {
        return this.name;
    }
});

Mixjs.module("Surface", {
    initialize: function() {
        this.name = "setup";
        this.setup();
    },

    setup: function() {
        this.name += " done";
    },

    getName: function() {
        return this.name;
    }
});
