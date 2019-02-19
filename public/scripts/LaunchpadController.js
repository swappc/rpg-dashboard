NLM = Object;

NLM.init = function (device, buttonDefs) {
    NLM.page = 0;
    console.log('MIDI initialized!');

    //Setup btnstate which is for phy. state
    NLM.btns = new Array();
    for (page = 0; page < 8; page++) {
        NLM.btns[page] = new Array();
        for (x = 0; x < 9; x++) {
            NLM.btns[page][x] = new Array();
            for (y = 0; y < 9; y++) {
                var tmp = new Key;
                if (x == 8) {
                    tmp = PageSelectKey();
                }
                NLM.setupBtn(page, x, y, device, tmp);
            }
        }
    }

    buttonDefs.forEach(element => {
        NLM.setupBtn(element.page,element.x,element.y,device,element.key);
    });
    // NLM.setupBtn(0, 0, 0, device, new PushKey("hi_green", "hi_amber"));

    // NLM.setupBtn(1, 0, 1, device, new PushKey("hi_green", "hi_amber"));

    //Set default page led
    NLM.btns[NLM.page][8][0].setColor("hi_amber");


    this.drawPage();
};

NLM.setupBtn = function (page, x, y, device, btn) {
    NLM.btns[page][x][y] = btn;
    NLM.btns[page][x][y].init(page, x, y, device);
}

NLM.incomingData = function (message) {
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

    NLM.btns[NLM.page][x][y].pressed = pressed;
    NLM.btns[NLM.page][x][y].callback();
};

NLM.drawPage = function () {
    for (x = 0; x < 9; x++) {
        for (y = 0; y < 9; y++) {
            NLM.btns[NLM.page][x][y].draw();
        }
    }
}





