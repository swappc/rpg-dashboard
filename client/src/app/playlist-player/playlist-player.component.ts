import { Component, OnInit } from '@angular/core';
import { Crate } from '../library.service';
import { PlaylistAudioService, PlaylistAudioEvent, PlaylistAudioEventType } from '../playlist-audio.service';

@Component({
  selector: 'app-playlist-player',
  templateUrl: './playlist-player.component.html',
  styleUrls: ['./playlist-player.component.css']
})
export class PlaylistPlayerComponent implements OnInit {
  currentPlaylist: string;
  currentTrack: string;
  currentProgress = 0;
  trackDuration = 0;

  constructor(
    private playlistAudioService: PlaylistAudioService
  ) {
    this.playlistAudioService.getObservable().subscribe(event => this.handleServiceEvent(event));
    this.playlistAudioService.setVolume(100);
  }

  handleServiceEvent(event: PlaylistAudioEvent) {
    switch (event.eventType) {
      case PlaylistAudioEventType.PLAYLIST_SET:
        this.currentPlaylist = event.data.playlistName;
        break;
      case PlaylistAudioEventType.TRACK_CHANGE:
        this.currentTrack = event.data.trackName;
        break;
      case PlaylistAudioEventType.PROGRESS_UPDATE:
        this.progressUpdate(event.data.currentProgress, event.data.trackDuration);
        break;
      case PlaylistAudioEventType.PAUSE:
      case PlaylistAudioEventType.PLAY:
      case PlaylistAudioEventType.PLAYLISTS_LOADED:
      case PlaylistAudioEventType.VOLUME_CHANGE:
        break;
    }
  }

  ngOnInit() {

  }

  onPlaylistSet(playlist: Crate): void {
    this.currentPlaylist = playlist.name;
    this.playlistAudioService.setPlaylist(playlist);
  }

  progressUpdate(currentTime, duration) {
    if (duration) {
      this.trackDuration = Math.floor(duration);
      this.currentProgress = Math.floor(currentTime);
    }

  }

  formatVolumeLabel(value: number | null) {
    if (!value) {
      return '0%';
    }
    return Math.floor(value * 100) + '%';
  }

  formatSecondString(value: number) {
    var seconds = value % 60;
    var minutes = Math.floor(value / 60 % 60);
    var hours = Math.floor(value / 3600 % 60);
    var timeParts = [];
    if (hours > 0) {
      timeParts.push(hours.toString().padStart(2, '0'));
    }
    timeParts.push(minutes.toString().padStart(2, '0'));
    timeParts.push(seconds.toString().padStart(2, '0'));
    return timeParts.join(':');

  }
}
