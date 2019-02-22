function DeckPlayer() {
    this.playlist = [];
    this.currentSong = 0;
    this.playerElement = new Audio();
    this.volume = 1;
    this.timer = null;

    this.playerElement.onended = function () {
        this.playNext();
    }.bind(this);
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
        this.playerElement.play();
        this.fadeToTarget(targetVolume);
    },
    fadeToTarget: function (targetVolume) {
        if (this.timer != null) {
          clearTimeout(this.timer);
        }
        this.volume = targetVolume;
        this.fadeToVolume();
    },
    fadeToVolume: function () {
        if (this.volume == this.playerElement.volume) {
            return;
        }

        var stepSize = this.volume > this.playerElement.volume ? .01 : -.01;
        var newVolume = this.playerElement.volume + stepSize;
        if ((stepSize < 0 && this.volume > newVolume) ||
            (stepSize > 0 && this.volume < newVolume)) {
            newVolume = this.volume;
        }
        if (newVolume >= 1) {
            newVolume = 1;
            this.volume = 1;
        } else if (newVolume <= 0) {
            newVolume = 0;
            this.volume = 0;
        }
        this.playerElement.volume = newVolume
        if (this.volume != this.playerElement.volume) {
            this.timer = setTimeout(() => { this.fadeToVolume() }, 10);
        }

    },
    fadeOut: function () {
        console.log("Fading out Volume at: " + this.playerElement.volume);
        this.fadeToTarget(0);
    },
    setVolume: function (targetVolume) {
        this.playerElement.volume = targetVolume;
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