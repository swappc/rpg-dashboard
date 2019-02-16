function PlaylistPlayer(controlsDiv) {
    this.currentPlayer = 0;
    this.players = [new DeckPlayer(), new DeckPlayer()];
    this.players[1].setVolume(0);
    var controlsDiv = document.getElementById('controlsDiv');
    var onPauseCallbacks = [];
    var onPlayCallbacks = [];




    this.setPlaylist = function (newPlaylist) {
        var fadeOutPlayer = this.players[this.currentPlayer%2];
        this.currentPlayer+=1;
        var fadeInPlayer = this.players[this.currentPlayer%2];
        fadeInPlayer.setPlaylist(newPlaylist);
        fadeInPlayer.fadeIn();
        fadeOutPlayer.fadeOut();
    }

    this.pause = function(){
        this.players[this.currentPlayer%2].pause();
        this.onPause();
    }

    this.play = function(){
        this.players[this.currentPlayer%2].play();
        this.onPlay();
    }

    this.onPause = function(){
        this.onPauseCallbacks.forEach((element)=>{
            element();
        });
    }

    this.onPlay = function(){
        this.onPlayCallbacks.forEach((element)=>{
            element();
        });
    }



}