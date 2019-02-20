function PlaylistPlayer(controlsDiv) {
    this.currentPlayer = 0;
    this.players = [new DeckPlayer(), new DeckPlayer()];
    this.players[1].setVolume(0);
    var controlsDiv = document.getElementById('controlsDiv');
    this.volume=1;

    this.setPlaylist = function (newPlaylist) {
        var fadeOutPlayer = this.getActivePlayer();
        this.currentPlayer+=1;
        var fadeInPlayer = this.getActivePlayer();
        fadeInPlayer.setPlaylist(newPlaylist);
        fadeInPlayer.fadeIn(this.volume);
        fadeOutPlayer.fadeOut();
        this.onPlay();
    }

    this.pause = function(){
        this.getActivePlayer().pause();
        this.onPause();
    }.bind(this);

    this.play = function(){
        this.getActivePlayer().play();
        this.onPlay();
    }.bind(this);

    this.togglePlay = function(){
        var activePlayer = this.getActivePlayer();
        if(activePlayer.isPlaying()){
            this.pause();
        }else{
            this.play();
        }
    }.bind(this);

    this.onPause = function(){

    }

    this.onPlay = function(){

    }

    this.getActivePlayer = function(){
        return this.players[this.currentPlayer%2];
    }

    this.setVolume = function(targetVolume){
        this.getActivePlayer().setVolume(targetVolume);
        this.volume = targetVolume;
        this.onVolumeChange(targetVolume);

    }

    this.onVolumeChange = function(newVolume){

    }





}