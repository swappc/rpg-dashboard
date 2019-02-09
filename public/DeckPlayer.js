function DeckPlayer(elementId) {
    this.playlist = [];
    this.currentSong = 0;
    this.playerElement = document.getElementById(elementId);
    this.loadTrack = function(trackNum){
        playerElement.src=playlist[trackNum].file;
    }

    this.playNext = function () {
        if (playlist.length === 0) {
            return;
        }
        currentSong++;
        if (currentSong === playlist.length) {
            currentSong = 0;
        }

    }

    this.setPlaylist = function(newPlaylist){
        playerElement.stop();
        playlist = newPlaylist;
        loadTrack(0);
        playerElement.play();
    }

    playerElement.onended = function(){
        playNext();
    }
}