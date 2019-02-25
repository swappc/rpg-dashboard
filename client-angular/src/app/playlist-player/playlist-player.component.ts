import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Playlist, DeckPlayer } from '../playlist'
import { PlaylistService } from '../playlist-service.service';

@Component({
  selector: 'app-playlist-player',
  templateUrl: './playlist-player.component.html',
  styleUrls: ['./playlist-player.component.css']
})
export class PlaylistPlayerComponent implements OnInit {
  currentPlaylist: string;
  playlists: Playlist[];
  currentTrack: string;
  currentPlayer: DeckPlayer;
  volume = 1;
  currentProgress = 0;


  constructor(
    private playlistService: PlaylistService
  ) {
  }

  ngOnInit() {
    this.getPlaylists();
  }

  getPlaylists(): void {
    this.playlistService.getPlaylists()
      .subscribe(playlists => this.playlists = playlists);
  }

  setPlaylist(playlist: Playlist): void {
    this.currentPlaylist = playlist.name;
    this.currentTrack = playlist.files[0].file.substr(2);

    if (this.currentPlayer) {
      this.currentPlayer.timeUpdate = function (currentTime, duration) {
      }
      this.currentPlayer.fadeOut();
    }
    this.currentPlayer = new DeckPlayer();
    var fadeInPlayer = this.currentPlayer;
    fadeInPlayer.timeUpdate = function (currentTime, duration) {
      this.progressUpdate(currentTime / duration);
    }.bind(this);
    fadeInPlayer.setPlaylist(playlist);
    fadeInPlayer.fadeIn(this.volume);

    this.onPlay();
  }

  pause() {
    this.currentPlayer.pause();
    this.onPause();
  }

  play() {
    this.currentPlayer.play();
    this.onPlay();
  }
  next() {
    this.currentPlayer.playNext();
  }
  previous() {
    this.currentPlayer.playPrevious();
  }
  isPlaying() {
    if (this.currentPlayer) {
      return this.currentPlayer.isPlaying();
    }
    return false;
  }

  togglePlay() {
    if (this.currentPlayer.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  onPause() {

  }

  onPlay() {

  }


  setVolume(targetVolume) {
    this.currentPlayer.fadeToTarget(targetVolume);
    this.volume = targetVolume;
    this.onVolumeChange(targetVolume);

  }

  onVolumeChange(newVolume) {

  }

  progressUpdate(percentage) {
    this.currentProgress = percentage * 100;

  }
  setPosition(event: any) {
    if (this.currentPlayer) {
      this.currentPlayer.setPosition(event.value / 100);
      this.currentProgress = event.value;
    }
  }
}
