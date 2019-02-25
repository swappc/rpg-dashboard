import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Playlist, DeckPlayer } from '../playlist'
import { PlaylistService } from '../playlist-service.service';
import { MidiService } from '../midi.service';
import { GroupKey, CallbackKey, KeyColor, PlayKey } from '../midi-controller';

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
  midiPlayKey: PlayKey;


  constructor(
    private playlistService: PlaylistService,
    private midiService: MidiService
  ) {
    this.midiService.getController().setupBtn(0, 0, 8, new CallbackKey(() => this.previous(), KeyColor.hi_green, KeyColor.lo_amber));
    this.midiPlayKey = new PlayKey(() => this.togglePlay());
    this.midiService.getController().setupBtn(0, 1, 8, this.midiPlayKey);
    this.midiService.getController().setupBtn(0, 2, 8, new CallbackKey(() => this.next(), KeyColor.hi_green, KeyColor.lo_amber));
  }

  ngOnInit() {
    this.getPlaylists();
  }

  getPlaylists(): void {
    this.playlistService.getPlaylists()
      .subscribe(playlists => {
        this.playlists = playlists;
        this.playlists.forEach((element, index) => {
          var tempKey = new GroupKey("playlists", index);
          tempKey.onActivePush = () => {
            this.togglePlay()
          };
          tempKey.onInactivePush = () => { this.setPlaylist(element) };
          this.midiService.getController().setupBtn(0, 0, index, tempKey);
        })

      });
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
    this.currentPlayer.timeUpdate = function (currentTime, duration) {
      this.progressUpdate(currentTime / duration);
    }.bind(this);
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
    this.midiPlayKey.playing=false;
    this.midiPlayKey.setled();
  }

  onPlay() {
    this.midiPlayKey.playing=true;
    this.midiPlayKey.setled();
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
