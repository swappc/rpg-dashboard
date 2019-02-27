import { PlaylistTrack } from './playlist';

export class SamplerPlayer {
    currentTrack: PlaylistTrack;
    playerElement = new Audio();
  
    constructor() { }
  
    setTrack(track: PlaylistTrack) {
        this.currentTrack = track;
        this.playerElement.src = this.currentTrack.file;
        this.onTrackLoaded();
    }
  
    loop(enabled: boolean){
        this.playerElement.loop = enabled;
    }
  
    setVolume(volume: number){
        this.playerElement.volume = volume;
    }
   
    pause() {
        this.playerElement.pause();
        this.playerElement.currentTime=0;
        this.onPause();
    }
  
    play() {
        this.playerElement.play();
        this.onPlay();
    }

    togglePlay(){
        if(this.isPlaying()){
            this.pause();
        }else{
            this.play();
        }

    }
  
    isPlaying() {
        return !this.playerElement.paused;
    }
  
    onTrackLoaded(){
    }
  
    onPlay(){
  
    }
  
    onPause(){
  
    }
  
  }
  