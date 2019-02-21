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
        var randomTrackNum = Math.floor((Math.random() * this.playlist.length))
        this.loadTrack(randomTrackNum);
        this.playerElement.play();
    }.bind(this);

    this.playerElement.onended = function () {
        _this.playNext();
    }

    this.fadeIn = function (targetVolume) {
        var distance = targetVolume - this.playerElement.volume;
        var iterations = Math.ceil(distance / 0.01)
        this.playerElement.play();
        this.fade(.01, iterations);
    }

    this.fade = function (stepSize, iterations) {
        var newVolume = this.playerElement.volume + stepSize;
        if (newVolume >= 1) {
            newVolume = 1;
            iterations = 0;
        } else if (newVolume <= 0) {
            newVolume = 0;
            iterations = 0;
        }
        this.playerElement.volume = newVolume;
        if (iterations > 0) {
            setTimeout(() => { this.fade(stepSize, iterations - 1) }, 10);
        }
    }

    this.fadeOut = function () {
        var distance = this.playerElement.volume;
        var iterations = Math.ceil(distance / 0.01)
        this.fade(-.01, iterations);
    }

    this.setVolume = function (targetVolume) {
        var step = targetVolume > this.playerElement.volume ? .01 : -.01;
        this.setVolumeInSteps(targetVolume, step);
    }

    this.setVolumeInSteps = function (targetVolume, stepSize) {
        this.playerElement.volume = this.playerElement.volume + stepSize;
        if ((stepSize > 0 && this.playerElement.volume < targetVolume) ||
            (stepSize < 0 && this.playerElement.volume > targetVolume)) {
            setTimeout(() => { this.setVolumeInSteps(targetVolume, stepSize) }, 10);
        }
    }

    this.pause = function () {
        this.playerElement.pause();
    }

    this.play = function () {
        this.playerElement.play();
    }

    this.isPlaying = function () {
        return !this.playerElement.paused;
    }
}