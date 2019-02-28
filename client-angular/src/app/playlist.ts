export class Playlist {
    name: string;
    id: number;
    priority: number;
}

export class PlaylistTrack {
    name: string;
    file: string;
    id: number;
}

export class DeckPlayer {
    playlistTracks: PlaylistTrack[];
    currentSong = 0;
    currentTrack: PlaylistTrack;
    playerElement = new Audio();
    volume = 0;
    timer = null;

    constructor() {
        this.playerElement.onended = function () {
            this.playNext();
        }.bind(this);

        this.playerElement.ontimeupdate = function (event) {
            this.timeUpdate(this.playerElement.currentTime, this.playerElement.duration);
        }.bind(this);

        this.playerElement.volume = this.volume;
    }

    loadTrack(trackNum: number) {
        this.currentSong = trackNum;
        this.currentTrack = this.playlistTracks[this.currentSong];
        this.playerElement.src = this.currentTrack.file;
        this.onTrackLoaded();
    }
    playNext() {
        if (this.playlistTracks.length === 0) {
            return;
        }
        this.currentSong++;
        if (this.currentSong === this.playlistTracks.length) {
            this.currentSong = 0;
        }
        this.loadTrack(this.currentSong);
        this.playerElement.play();
    }
    playPrevious() {
        if (this.playlistTracks.length === 0) {
            return;
        }
        this.currentSong--;
        if (this.currentSong < 0) {
            this.currentSong = this.playlistTracks.length - 1;
        }
        this.loadTrack(this.currentSong);
        this.playerElement.play();
    }
    setPlaylist(newPlaylist: PlaylistTrack[]) {
        this.playerElement.pause();
        this.playlistTracks = newPlaylist;
        var randomTrackNum = Math.floor((Math.random() * this.playlistTracks.length))
        this.loadTrack(randomTrackNum);
        this.playerElement.play();
    }
    fadeIn(targetVolume: number) {
        this.playerElement.play();
        this.fadeToTarget(targetVolume, false);
    }
    fadeToTarget(targetVolume:number, pauseOnComplete: boolean) {
        if (this.timer != null) {
            clearTimeout(this.timer);
        }
        this.volume = targetVolume;
        this.fadeToVolume(pauseOnComplete);
    }
    fadeToVolume(pauseOnComplete: boolean) {
        if (this.volume == this.playerElement.volume) {
            if(pauseOnComplete){
                this.playerElement.pause();
            }
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
            this.timer = setTimeout(() => { this.fadeToVolume(pauseOnComplete) }, 10);
        }

    }
    fadeOut() {
        console.log("Fading out Volume at: " + this.playerElement.volume);
        this.fadeToTarget(0, true);
    }
    setVolume(targetVolume:number) {
        this.playerElement.volume = targetVolume;
    }
    pause() {
        this.playerElement.pause();
    }

    play() {
        this.playerElement.play();
    }

    isPlaying() {
        return !this.playerElement.paused;
    }
    timeUpdate(currentTime:number, duration:number) {

    }
    setPosition(position: number) {
        this.playerElement.currentTime = position;
    }
    onTrackLoaded(){

    }



}