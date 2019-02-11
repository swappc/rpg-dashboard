function DeckPlayer(elementId) {
    var _this = this;
    this.playlist = [];
    this.currentSong = 0;
    this.playerElement = document.getElementById(elementId);
    this.loadTrack = function (trackNum) {
        _this.playerElement.src = _this.playlist[trackNum].file;
        document.getElementById('nowPlayingLabel').textContent=_this.playlist[trackNum].name;
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
}