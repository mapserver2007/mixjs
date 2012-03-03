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
    category: "SmartPhone",
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

var hookFunction = function() {
    var hookInfo;
    var self = this;
    if (isIE678) {
        while (self.hasOwnProperty('parent')) {
            self = self.parent;
        }
    }
    hookInfo = self.__hookStack__[prop];
    if (typeof hookInfo !== 'undefined') {
        var receiver = hookInfo.receiver,
            callback = hookInfo.callback,
            isRef = hookInfo.isRef;
        
        while (typeof receiver !== 'undefined') {
            callback.apply(receiver, arguments);
            if (isRef !== true) break;
            receiver = receiver.parent;
        }
    }
    
    return f.apply(this, arguments);
};
