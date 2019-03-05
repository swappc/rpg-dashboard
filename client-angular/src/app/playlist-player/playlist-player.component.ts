import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MidiService } from '../midi.service';
import { GroupKey, CallbackKey, KeyColor, PlayKey, SliderKey, NLM } from '../midi-controller';
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
  midiPlayKey: PlayKey;
  midiController: NLM;
  volumeKeys: SliderKey[]
  playlistKeyGroup = "playlists";
  currentPlaylistKey: GroupKey;
  trackDuration = 0;


  constructor(
    midiService: MidiService,
    private changeDetector: ChangeDetectorRef,
    private playlistAudioService: PlaylistAudioService
  ) {
    this.playlistAudioService.getObservable().subscribe(event => this.handleServiceEvent(event));

    this.midiController = midiService.getController();
    this.midiController.setupBtn(0, 0, 8, new CallbackKey(() => this.playlistAudioService.previous(), KeyColor.hi_green, KeyColor.lo_amber));
    this.midiPlayKey = new PlayKey(() => this.playlistAudioService.togglePlay());
    this.midiController.setupBtn(0, 1, 8, this.midiPlayKey);
    this.midiController.setupBtn(0, 2, 8, new CallbackKey(() => this.playlistAudioService.next(), KeyColor.hi_green, KeyColor.lo_amber));

    this.volumeKeys = new Array();
    for (var i = 0; i < 8; i++) {
      var tempKey = new SliderKey('volume', i);
      tempKey.onPushCallback = function (value) {
        this.setVolume(value);
        this.changeDetector.detectChanges();
      }.bind(this);
      this.midiController.setupBtn(0, 3, 7 - i, tempKey);
      this.volumeKeys.push(tempKey);
    }
    this.playlistAudioService.setVolume(100);
  }

  handleServiceEvent(event: PlaylistAudioEvent) {
    switch (event.eventType) {
      case PlaylistAudioEventType.PAUSE:
        this.onPause();
        break;
      case PlaylistAudioEventType.PLAY:
        this.onPlay();
        break;
      case PlaylistAudioEventType.PLAYLIST_SET:
        this.currentPlaylist = event.data.playlistName;
        break;
      case PlaylistAudioEventType.TRACK_CHANGE:
        this.currentTrack = event.data.trackName;

        break;
      case PlaylistAudioEventType.VOLUME_CHANGE:
        this.onVolumeChange(event.data.targetVolume);
        break;
      case PlaylistAudioEventType.PROGRESS_UPDATE:
        this.progressUpdate(event.data.currentProgress, event.data.trackDuration);
        break;

    }
  }

  ngOnInit() {
    this.playlistAudioService.playlists.forEach((element, index) => {
      var tempKey = new GroupKey(this.playlistKeyGroup, element.name);
      tempKey.onSelectedPush = () => {
        this.currentPlaylistKey = tempKey;
        this.playlistAudioService.togglePlay();
        this.changeDetector.detectChanges();
      };
      tempKey.onUnSelectedPush = () => {

        this.currentPlaylistKey = tempKey;
        this.playlistAudioService.setPlaylist(element);
        this.changeDetector.detectChanges();
      };
      this.midiController.setupBtn(0, 0, index, tempKey);
    });
  }



onPlaylistSet(playlist: Crate): void {
  this.currentPlaylist = playlist.name;
  this.playlistAudioService.setPlaylist(playlist);
  GroupKey.setGroupSelected(this.playlistKeyGroup, playlist.name);
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
