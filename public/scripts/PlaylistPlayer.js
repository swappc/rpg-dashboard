function PlaylistPlayer() {
    this.currentPlayer = 0;
    this.players = [new DeckPlayer(), new DeckPlayer()];
    this.players[1].setVolume(0);
    this.volume = 1;

}

PlaylistPlayer.prototype = {

    setPlaylist: function (newPlaylist) {


        var fadeOutPlayer = this.getActivePlayer();
        fadeOutPlayer.timeUpdate = function(currentTime, duration){
        }
        this.currentPlayer += 1;
        var fadeInPlayer = this.getActivePlayer();
        fadeInPlayer.timeUpdate = function(currentTime, duration){
            this.progressUpdate(currentTime/duration);
        }.bind(this);
        fadeInPlayer.setPlaylist(newPlaylist);
        fadeInPlayer.fadeIn(this.volume);
        fadeOutPlayer.fadeOut();
        this.onPlay();
    },

    pause: function () {
        this.getActivePlayer().pause();
        this.onPause();
    },

    play: function () {
        this.getActivePlayer().play();
        this.onPlay();
    },

    togglePlay: function () {
        var activePlayer = this.getActivePlayer();
        if (activePlayer.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    },

    onPause: function () {

    },

    onPlay: function () {

    },

    getActivePlayer: function () {
        return this.players[this.currentPlayer % 2];
    },

    this.setVolume = function(targetVolume){
        this.getActivePlayer().fadeToTarget(targetVolume);
        this.volume = targetVolume;
        this.onVolumeChange(targetVolume);

    },

    onVolumeChange: function (newVolume) {

    },

    progressUpdate: function(percentage){

    }
}