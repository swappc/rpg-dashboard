function Launchpad() {


    function getRow(message) {
        if (message.data[0] === 144) {
            return Math.floor(message.data[1] / 16);
        }
        return 8;
    }

    function getColumn(message) {
        if (message.data[0] === 144) {
            return message.data[1] % 16;
        }
        return message.data[1] - 104;
    }

    this.handlers=[];
    this.initHandlers= function() {
        this.handlers.length=0;
        for (row = 0; row < 9; row++) {
            var rowHandlers = [];

            for (col = 0; col < 9; col++) {
                rowHandlers.push(() => { });
            }
            this.handlers.push(rowHandlers);
        }
    }
    this.initHandlers();

    this.addHandler = function(row, col, handler){
        this.handlers[row][col] = handler;
    }

    this.handleMessage = function (message) {
        var handler = this.handlers[getRow(message)][getColumn(message)];
        handler(message);
        console.log(message.data);

    }.bind(this);
}