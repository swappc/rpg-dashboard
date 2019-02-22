function DeckPlayer() {
    this.playlist = [];
    this.currentSong = 0;
    this.playerElement = new Audio();

    this.playerElement.onended = function () {
        this.playNext();
    }
}

DeckPlayer.prototype = {
    loadTrack: function (trackNum) {
        this.playerElement.src = this.playlist[trackNum].file;
        document.getElementById('nowPlayingLabel').textContent = this.playlist[trackNum].name;
    },
    playNext: function () {
        if (this.playlist.length === 0) {
            return;
        }
        this.currentSong++;
        if (this.currentSong === this.playlist.length) {
            this.currentSong = 0;
        }
        this.loadTrack(this.currentSong);
        this.playerElement.play();
    },
    playPrevious: function () {
        if (this.playlist.length === 0) {
            return;
        }
        this.currentSong--;
        if (this.currentSong < 0) {
            this.currentSong = this.playlist.length - 1;
        }
        this.loadTrack(this.currentSong);
        this.playerElement.play();
    },
    setPlaylist: function (newPlaylist) {
        if (typeof this.playerElement.stop !== "undefined") {
            this.playerElement.stop();
        }
        this.playlist = newPlaylist.files;
        var randomTrackNum = Math.floor((Math.random() * this.playlist.length))
        this.loadTrack(randomTrackNum);
        this.playerElement.play();
    },
    fadeIn: function (targetVolume) {
        var distance = targetVolume - this.playerElement.volume;
        var iterations = Math.ceil(distance / 0.01)
        this.playerElement.play();
        this.fade(.01, iterations);
    },
    fade: function (stepSize, iterations) {
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
    },
    fadeOut: function () {
        var distance = this.playerElement.volume;
        var iterations = Math.ceil(distance / 0.01)
        this.fade(-.01, iterations);
    },
    setVolume: function (targetVolume) {
        this.playerElement.volume = targetVolume;

        // var step = targetVolume > this.playerElement.volume ? .01 : -.01;
        // this.setVolumeInSteps(targetVolume, step);
    },
    setVolumeInSteps: function (targetVolume, stepSize) {
        this.playerElement.volume = this.playerElement.volume + stepSize;
        if ((stepSize > 0 && this.playerElement.volume < targetVolume) ||
            (stepSize < 0 && this.playerElement.volume > targetVolume)) {
            setTimeout(() => { this.setVolumeInSteps(targetVolume, stepSize) }, 10);
        }
    },

    pause: function () {
        this.playerElement.pause();
    },

    play: function () {
        this.playerElement.play();
    },

    isPlaying: function () {
        return !this.playerElement.paused;
    }

}