function DeckPlayer() {
    var _this = this;
    this.playlist = [];
    this.currentSong = 0;
    this.playerElement = new Audio();
    this.loadTrack = function (trackNum) {
        _this.playerElement.src = _this.playlist[trackNum].file;
        document.getElementById('nowPlayingLabel').textContent = _this.playlist[trackNum].name;
    }

    this.playNext = function () {
        if (_this.playlist.length === 0) {
            return;
        }
        _this.currentSong++;
        if (_this.currentSong === _this.playlist.length) {
            _this.currentSong = 0;
        }
        this.loadTrack(this.currentSong);
        this.playerElement.play();

    }

    this.setPlaylist = function (newPlaylist) {
        if (typeof this.playerElement.stop !== "undefined") {
            this.playerElement.stop();
        }
        this.playlist = newPlaylist.files;
        this.loadTrack(0);
        this.playerElement.play();
    }

    this.playerElement.onended = function () {
        _this.playNext();
    }

    this.fadeIn = function () {
        var distance = 1 - this.playerElement.volume;
        var iterations = Math.ceil(distance / 0.01)
        this.playerElement.play();
        this.fade(.01, iterations);
    }

    this.fade = function (stepSize, iterations) {
        if (iterations <= 1) {
            if (stepSize < 0) {
                this.playerElement.volume = 0;
                this.playerElement.pause();
            } else {
                this.playerElement.volume = 1;
            }
        } else {
            this.playerElement.volume += stepSize;
            setTimeout(() => { this.fade(stepSize, iterations - 1) },10);
        }
    }

    this.fadeOut = function () {
        var distance = this.playerElement.volume;
        var iterations = Math.ceil(distance / 0.01)
        this.fade(-.01, iterations);
    }

    this.setVolume = function(targetVolume){
        this.playerElement.volume = targetVolume;
    }

    this.pause = function(){
        this.playerElement.pause();
    }

    this.play = function (){
        this.playerElement.play();
    }
}