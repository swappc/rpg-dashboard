import { Injectable } from '@angular/core';
import { Crate, LibraryService } from './library.service';
import { DeckPlayer } from './deck-player';
import { Subject, Observer, PartialObserver } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistAudioService {
  currentPlaylist: string;
  playlists: Crate[];
  currentTrack: string;
  currentPlayer: DeckPlayer;
  otherPlayer: DeckPlayer;
  volume: number;
  currentProgress = 0;
  trackDuration = 0;
  eventSubject: Subject<PlaylistAudioEvent>;


  constructor(
    private libraryService: LibraryService
  ) {
    this.eventSubject = new Subject<PlaylistAudioEvent>();
    this.getPlaylists();
    this.setVolume(100);
  }

  getPlaylists(): void {
    this.libraryService.getCrates()
      .subscribe(playlists => {
        this.playlists = playlists;
        var event = new PlaylistAudioEvent(PlaylistAudioEventType.PLAYLISTS_LOADED);
        event.data.playlists = playlists;
        this.eventSubject.next(event);
      });
  }

  setPlaylist(playlist: Crate): void {
    this.currentPlaylist = playlist.name;

    if (this.currentPlayer) {
      this.currentPlayer.timeUpdate = function (currentTime, duration) {
      }
      this.currentPlayer.onTrackLoaded = function () {

      }
      this.currentPlayer.fadeOut();
    }
    var tempPlayer = this.otherPlayer;
    this.otherPlayer = this.currentPlayer;
    this.currentPlayer = tempPlayer;
    if (!this.currentPlayer) {
      this.currentPlayer = new DeckPlayer();
    }
    this.currentPlayer.onTrackLoaded = function () {
      this.currentTrack = this.currentPlayer.currentTrack.name;
      this.emitTrackChange();
    }.bind(this);
    this.currentPlayer.timeUpdate = this.progressUpdate.bind(this);

    this.libraryService.getCrateTracks(playlist.id).subscribe(playlistTracks => {
      this.currentPlayer.setPlaylist(playlistTracks);
      this.currentPlayer.fadeIn(this.volume);
      this.eventSubject.next(new PlaylistAudioEvent(PlaylistAudioEventType.PLAY));
    });

    var event = new PlaylistAudioEvent(PlaylistAudioEventType.PLAYLIST_SET)
    event.data.playlistName = playlist.name;
    this.eventSubject.next(event);
  }

  pause() {
    this.currentPlayer.pause();
    this.eventSubject.next(new PlaylistAudioEvent(PlaylistAudioEventType.PAUSE));
  }

  play() {
    this.currentPlayer.play();
    this.eventSubject.next(new PlaylistAudioEvent(PlaylistAudioEventType.PLAY));
  }
  next() {
    this.currentPlayer.playNext();
  }
  previous() {
    this.currentPlayer.playPrevious();
  }

  emitTrackChange() {
    var event = new PlaylistAudioEvent(PlaylistAudioEventType.TRACK_CHANGE);
    event.data.trackName = this.currentPlayer.currentTrack.name;
    this.eventSubject.next(event);
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

  setVolume(targetVolume) {
    if (this.currentPlaylist) {
      this.currentPlayer.fadeToTarget(targetVolume, false);
    }
    this.volume = targetVolume;
    var event = new PlaylistAudioEvent(PlaylistAudioEventType.VOLUME_CHANGE)
    event.data.targetVolume = targetVolume;
    this.eventSubject.next(event);
  }

  progressUpdate(currentTime, duration) {
    if (duration) {
      this.trackDuration = Math.floor(duration);
      this.currentProgress = Math.floor(currentTime);
      var event = new PlaylistAudioEvent(PlaylistAudioEventType.PROGRESS_UPDATE);
      event.data.trackDuration = Math.floor(duration);
      event.data.currentProgress = Math.floor(currentTime);
      this.eventSubject.next(event);
    }

  }
  setPosition(value: number) {
    if (this.currentPlayer) {
      this.currentPlayer.setPosition(value);
      this.currentProgress = value;
    }
  }

  subscribe(test: PartialObserver<PlaylistAudioEvent>) {
    this.eventSubject.subscribe(test);
  }

  getObservable() {
    return this.eventSubject;
  }
}

export class PlaylistAudioEvent {
  data: any;
  constructor(public eventType: PlaylistAudioEventType) {
    this.data = {};
  }
}

export enum PlaylistAudioEventType {
  PLAYLIST_SET,
  PLAY,
  PAUSE,
  TRACK_CHANGE,
  VOLUME_CHANGE,
  PROGRESS_UPDATE,
  PLAYLISTS_LOADED
}
