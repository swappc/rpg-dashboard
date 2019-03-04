import { Track } from './track';

export class SamplerPlayer {
    currentTrack: Track;
    playerElement = new Audio();
  
    constructor() { 
        this.playerElement.onended = ()=>this.onEnded();
    }
  
    setTrack(track: Track) {
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

    onEnded(){

    }
  
}
