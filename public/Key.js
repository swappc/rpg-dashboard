//Common helpers
colorCode = function () {
    return {
        black: 4,

        lo_red: 1 + 4,
        mi_red: 2 + 4,
        hi_red: 3 + 4,
        lo_green: 16 + 4,
        mi_green: 32 + 4,
        hi_green: 48 + 4,
        lo_amber: 17 + 4,
        mi_amber: 34 + 4,
        hi_amber: 51 + 4,
        hi_orange: 35 + 4,
        lo_orange: 18 + 4,
        hi_yellow: 50 + 4,
        lo_yellow: 33 + 4,

    }
};


//Define one Key
Key = Object;
Key.prototype.color = colorCode()["black"];
Key.prototype.x = -1;
Key.prototype.y = -1;
Key.prototype.page = -1;
Key.prototype.pressed = false;

Key.prototype.init = function (page, x, y, midi) {
    this.x = x;
    this.y = y;
    this.page = page;
    this.midi = midi;
    // this.draw();
}

Key.prototype.setColor = function (color) {
    //First line is special
    this.color = colorCode()[color];
    this.draw();
};

Key.prototype.draw = function () {
    if (this.midi) {
        if (this.page != NLM.page) return;
        if (this.y == 8) {
            this.midi.send([0xb0, this.x + 0x68, this.color]);
            return;
        }
        this.midi.send([0x90, this.x + this.y * 16, this.color]);
        //midi.sendShortMsg(0xb0, 0x0, 0x28); //Enable buffer cycling
    }
}

Key.prototype.onPush = function () {
}

Key.prototype.onRelease = function () {
}

Key.prototype.callback = function () {
    if (this.pressed) {
        this.onPush();
    } else {
        this.onRelease();
    }
}

function PushKey(colordef, colorpush) {
    var that = new Key;

    that.setColor(colordef);

    that.colordef = colordef;
    that.colorpush = colorpush;

    that.onPush = function () {
        this.setColor(this.colorpush);
    }

    that.onRelease = function () {
        this.setColor(this.colordef);
    }

    return that;
}

function CallbackKey(colordef, colorpush, callback) {
    var that = PushKey(colordef, colorpush);

    that.onPushOrig = that.onPush;
    that.onPush = function () {
        callback();
        this.onPushOrig();
    }
    return that;
}

function PageSelectKey() {
    var that = new Key;

    that.onPush = function () {
        NLM.btns[NLM.page][8][NLM.page].setColor("black");
        NLM.page = this.y;
        NLM.btns[NLM.page][8][NLM.page].setColor("hi_amber");
        NLM.drawPage();
    }
    return that;
}

function PlayKey(onPushCallback) {
    var that = new Key();
    that.playing = false;

    that.setled = function () {
        if (this.pressed) {
            this.setColor("hi_amber");
        } else if (this.playing) {
            this.setColor("hi_green");
        } else {
            this.setColor("hi_yellow");
        }
    }

    that.setled();

    that.onPush = function () {
        onPushCallback();
        this.setled();
    }

    that.onRelease = function () {
        this.setled();
    }

    return that;
}

function SliderKey(ch, pos, onPushCallback) {
    var that = new Key();

    that.pos  = SliderKey.positions[pos];
    that.active=false;

    that.setled = function()
    {
        if (!this.active) {
            this.setColor("hi_red");
        } else {
            this.setColor("lo_green");
        }
    }

    that.setValue = function(percentage){
        this.active = percentage>=this.pos;
        this.setled();
    }

    that.onPush = function()
    {
        var targetValue = this.pos;
        onPushCallback(targetValue);
        SliderKey.keys[ch].forEach(function(e) { 
            e.setValue(targetValue);
            e.setled();
         });
    }

    that.setled();

    if ( SliderKey.keys[ch] == undefined ) SliderKey.keys[ch] = new Array();
    SliderKey.keys[ch][pos] = that;
    return that;
}
SliderKey.keys=new Array();
SliderKey.positions = [0,.17,.335,0.5,0.625,0.75,0.875,1];