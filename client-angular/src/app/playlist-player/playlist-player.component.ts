import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Playlist, DeckPlayer } from '../playlist'
import { MidiService } from '../midi.service';
import { GroupKey, CallbackKey, KeyColor, PlayKey, SliderKey, NLM } from '../midi-controller';
import { LibraryService } from '../library.service';

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
  otherPlayer: DeckPlayer;
  volume: number;
  currentProgress = 0;
  midiPlayKey: PlayKey;
  midiController: NLM;
  volumeKeys: SliderKey[]
  playlistKeyGroup = "playlists";
  currentPlaylistKey: GroupKey;
  trackDuration = 0;


  constructor(
    private libraryService: LibraryService,
    midiService: MidiService
  ) {
    this.midiController = midiService.getController();
    this.midiController.setupBtn(0, 0, 8, new CallbackKey(() => this.previous(), KeyColor.hi_green, KeyColor.lo_amber));
    this.midiPlayKey = new PlayKey(() => this.togglePlay());
    this.midiController.setupBtn(0, 1, 8, this.midiPlayKey);
    this.midiController.setupBtn(0, 2, 8, new CallbackKey(() => this.next(), KeyColor.hi_green, KeyColor.lo_amber));

    this.volumeKeys = new Array();
    for (var i = 0; i < 8; i++) {
      var tempKey = new SliderKey('volume', i);
      tempKey.onPushCallback = function (value) {
        this.setVolume(value);
      }.bind(this);
      this.midiController.setupBtn(0, 3, 7 - i, tempKey);
      this.volumeKeys.push(tempKey);
    }
    this.setVolume(100);
  }

  ngOnInit() {
    this.getPlaylists();
  }

  getPlaylists(): void {
    this.libraryService.getPlaylists()
      .subscribe(playlists => {
        this.playlists = playlists;
        this.playlists.forEach((element, index) => {
          var tempKey = new GroupKey(this.playlistKeyGroup, element.name);
          tempKey.onSelectedPush = () => {
            this.currentPlaylistKey = tempKey;
            this.togglePlay()
          };
          tempKey.onUnSelectedPush = () => {

            this.currentPlaylistKey = tempKey;
            this.setPlaylist(element);
          };
          this.midiController.setupBtn(0, 0, index, tempKey);
        })

      });
  }

  setPlaylist(playlist: Playlist): void {
    this.currentPlaylist = playlist.name;
    GroupKey.setGroupSelected(this.playlistKeyGroup, playlist.name);

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
    }.bind(this);
    this.currentPlayer.timeUpdate = this.progressUpdate.bind(this);
    this.currentPlayer.setPlaylist(playlist);
    this.currentPlayer.fadeIn(this.volume);

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
    this.midiPlayKey.playing = false;
    this.midiPlayKey.setled();
    if (this.currentPlaylistKey) {
      this.currentPlaylistKey.setActive(false);
    }
  }

  onPlay() {
    this.midiPlayKey.playing = true;
    this.midiPlayKey.setled();
    if (this.currentPlaylistKey) {
      this.currentPlaylistKey.setActive(true);
    }
  }

  changeVolume(event: any) {
    this.setVolume(event.value);
  }
  setVolume(targetVolume) {
    if (this.currentPlaylist) {
      this.currentPlayer.fadeToTarget(targetVolume, false);
    }
    this.volume = targetVolume;
    this.onVolumeChange(targetVolume);

  }

  onVolumeChange(newVolume) {
    this.volumeKeys.forEach((e) => {
      e.setValue(newVolume);
    })
  }

  progressUpdate(currentTime, duration) {
    if (duration) {
      this.trackDuration = Math.floor(duration);
      this.currentProgress = Math.floor(currentTime);
    }

  }
  setPosition(event: any) {
    if (this.currentPlayer) {
      this.currentPlayer.setPosition(event.value);
      this.currentProgress = event.value;
    }
  }

  formatVolumeLabel(value: number | null) {
    if (!value) {
      return '0%';
    }
    return Math.floor(value * 100) + '%';
  }

  formatSecondString(value: number){
    var seconds = value%60;
    var minutes = Math.floor(value/60%60);
    var hours = Math.floor(value/3600%60);
    var timeParts = [];
    if(hours>0)
    {
      timeParts.push(hours.toString().padStart(2,'0'));
    }
    timeParts.push(minutes.toString().padStart(2,'0'));
    timeParts.push(seconds.toString().padStart(2,'0'));
    return timeParts.join(':');

  }
}
