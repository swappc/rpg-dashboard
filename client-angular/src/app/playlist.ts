export class Playlist {
    name: string;
    files: PlaylistTrack[];
}

export class PlaylistTrack {
    name: string;
    file: string;
}

export class DeckPlayer {
    playlist: Playlist;
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
        this.currentTrack = this.playlist.files[this.currentSong];
        this.playerElement.src = this.currentTrack.file;
        this.onTrackLoaded();
    }
    playNext() {
        if (this.playlist.files.length === 0) {
            return;
        }
        this.currentSong++;
        if (this.currentSong === this.playlist.files.length) {
            this.currentSong = 0;
        }
        this.loadTrack(this.currentSong);
        this.playerElement.play();
    }
    playPrevious() {
        if (this.playlist.files.length === 0) {
            return;
        }
        this.currentSong--;
        if (this.currentSong < 0) {
            this.currentSong = this.playlist.files.length - 1;
        }
        this.loadTrack(this.currentSong);
        this.playerElement.play();
    }
    setPlaylist(newPlaylist: Playlist) {
        this.playerElement.pause();
        this.playlist = newPlaylist;
        var randomTrackNum = Math.floor((Math.random() * this.playlist.files.length))
        this.loadTrack(randomTrackNum);
        this.playerElement.play();
    }
    fadeIn(targetVolume: number) {
        this.playerElement.play();
        this.fadeToTarget(targetVolume);
    }
    fadeToTarget(targetVolume:number) {
        if (this.timer != null) {
            clearTimeout(this.timer);
        }
        this.volume = targetVolume;
        this.fadeToVolume();
    }
    fadeToVolume() {
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

    }
    fadeOut() {
        console.log("Fading out Volume at: " + this.playerElement.volume);
        this.fadeToTarget(0);
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
    setPosition(percentage: number) {
        this.playerElement.currentTime = this.playerElement.duration * percentage;
    }
    onTrackLoaded(){

    }



}