export class NLM {
    page = 0;
    btns: Key[][][];

    constructor() {
        console.log('MIDI initialized!');
        this.btns = new Array();
        //Setup btnstate which is for phy. state
        for (var page = 0; page < 8; page++) {
            this.btns[page] = new Array();
            for (var x = 0; x < 9; x++) {
                this.btns[page][x] = new Array();
                for (var y = 0; y < 9; y++) {
                    var tmp = new Key;
                    if (x == 8) {
                        tmp = new PageSelectKey();
                    }
                    this.setupBtn(page, x, y, tmp);
                }
            }
        }

        //Set default page led
        this.btns[this.page][8][0].setColor(KeyColor.hi_amber);
        this.drawPage();
    }
    setupBtn(page: number, x:number, y:number, btn:Key) {
        this.btns[page][x][y] = btn;
        this.btns[page][x][y].init(page, x, y, this);
    }
    incomingData(message) {
        //Just to make life easier
        var pressed = (message.data[2] == 127);
        //Translate midi btn into index
        var y = Math.floor(message.data[1] / 16);
        var x = message.data[1] - y * 16;
        if (y == 6 && x > 8) {
            y = 8;
            x -= 8;
        }
        if (y == 6 && x == 8 && message.data[0] == 176) {
            y = 8; x = 0;
        }

        this.btns[this.page][x][y].pressed = pressed;
        this.btns[this.page][x][y].callback();
    };

    drawPage() {
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                this.btns[this.page][x][y].draw();
            }
        }
    }

    sendToDevice(data: any[]) {

    }

}

enum KeyColor {
    black = 4,

    lo_red = 1 + 4,
    mi_red = 2 + 4,
    hi_red = 3 + 4,
    lo_green = 16 + 4,
    mi_green = 32 + 4,
    hi_green = 48 + 4,
    lo_amber = 17 + 4,
    mi_amber = 34 + 4,
    hi_amber = 51 + 4,
    hi_orange = 35 + 4,
    lo_orange = 18 + 4,
    hi_yellow = 50 + 4,
    lo_yellow = 33 + 4,

}

class Key {
    color = KeyColor.black;
    page = -1;
    x = -1;
    y = -1;
    controller: NLM;
    pressed = false;

    init(page: number, x: number, y: number, controller: NLM) {
        this.page = page;
        this.x = x;
        this.y = y;
        this.controller = controller;
        this.draw();
    }

    setColor(color: KeyColor) {
        this.color = color;
        this.draw();
    }

    draw() {
        if(!this.controller) return;
        if (this.page != this.controller.page) return;
        if (this.y == 8) {
            this.controller.sendToDevice([0xb0, this.x + 0x68, this.color]);
            return;
        }
        this.controller.sendToDevice([0x90, this.x + this.y * 16, this.color]);

    }

    onPush() {

    }

    onRelease() {

    }

    callback() {
        if (this.pressed) {
            this.onPush();
        } else {
            this.onRelease();
        }
    }
}

export class PushKey extends Key {
    constructor(
        private colordef: KeyColor,
        private colorpush: KeyColor
    ) {
        super();
    }

    onPush() {
        this.setColor(this.colorpush);
    }

    onRelease() {
        this.setColor(this.colordef);
    }
}

export class CallbackKey extends PushKey {
    constructor(
        private delegate: Function,
        colordef: KeyColor,
        colorpush: KeyColor) {
        super(colordef, colorpush);
    }

    callback() {
        this.delegate();
        super.callback();
    }
}

export class PageSelectKey extends Key {
    onPush() {
        var currentPage = this.controller.page;
        this.controller.btns[currentPage][8][currentPage].setColor(KeyColor.black);
        this.controller.page = this.y;
        this.controller.btns[this.y][8][this.y].setColor(KeyColor.hi_amber);
        this.controller.drawPage();
    }
}

export class PlayKey extends Key {
    playing = false;
    pressed = false;
    constructor(
        private delegate: Function
    ) {
        super();
        this.setled();
    }
    setled() {
        if (this.pressed) {
            this.setColor(KeyColor.hi_amber);
        } else if (this.playing) {
            this.setColor(KeyColor.hi_green);
        } else {
            this.setColor(KeyColor.hi_yellow);
        }
    }

    onPush() {
        this.delegate();
        this.setled();
    }

    onRelease() {
        this.setled();
    }
}

export class SliderKey extends Key {
    static keys = new Array();
    static positions = [0, .17, .335, 0.5, 0.625, 0.75, 0.875, 1];
    value: number;
    active = false;
    constructor(private group: string, pos: number) {
        super();
        this.value = SliderKey.positions[pos];
        this.setled();
        if (SliderKey.keys[group] == undefined) {
            SliderKey.keys[group] = new Array();
            SliderKey.keys[group][pos] = this;
        }
    }

    setled() {
        if (!this.active) {
            this.setColor(KeyColor.lo_red);
        } else {
            this.setColor(KeyColor.hi_green);
        }
    }

    setValue(percentage) {
        this.active = percentage >= this.value;
        this.setled();
    }

    onPush() {
        var targetValue = this.value;
        this.onPushCallback(targetValue);
        SliderKey.keys[this.group].forEach(function (e: SliderKey) {
            e.setValue(targetValue);
            e.setled();
        });
    }

    onPushCallback(value: number) {

    }
}

export class GroupKey extends Key {
    static keys = new Array();
    active = false;
    constructor(private group: string, private pos: number) {
        super();
        this.setled();
        if (GroupKey.keys[group] == undefined) {
            GroupKey.keys[group] = new Array();
            GroupKey.keys[group][pos] = this;
        }
    }

    setled() {
        if (!this.active) {
            this.setColor(KeyColor.mi_amber);
        } else {
            this.setColor(KeyColor.mi_green);
        }
    }

    setValue(activePos) {
        this.active = activePos == this.pos;
        this.setled();
    }

    onPush() {
        var targetValue = this.pos;
        // Was it already active?
        if(this.active){
            this.onActivePush();
        }else{
            this.onInactivePush();
        }

        // Update all key states (changes which key is active)
        GroupKey.keys[this.group].forEach(function (e) {
            e.setValue(targetValue);
            e.setled();
        });
    }

    onActivePush(){

    }

    onInactivePush(){

    }
}