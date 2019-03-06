import { Injectable } from '@angular/core';
import { NLM, CallbackKey, SliderKey, PlayKey, KeyColor, GroupKey } from './midi-controller';
import { PlaylistAudioService, PlaylistAudioEvent, PlaylistAudioEventType } from './playlist-audio.service';
import { Crate } from './library.service';

@Injectable({
  providedIn: 'root'
})
export class MidiService {
  controller: NLM;
  playlistKeyGroup = "playlists";
  currentPlaylistKey: GroupKey;
  midiPlayKey: PlayKey;
  volumeKeys: SliderKey[]


  constructor(
    private playlistAudioService: PlaylistAudioService
  ) {
    this.controller = new NLM();

    this.controller.setupBtn(0, 0, 8, new CallbackKey(() => this.playlistAudioService.previous(), KeyColor.hi_green, KeyColor.lo_amber));
    this.midiPlayKey = new PlayKey(() => this.playlistAudioService.togglePlay());
    this.controller.setupBtn(0, 1, 8, this.midiPlayKey);
    this.controller.setupBtn(0, 2, 8, new CallbackKey(() => this.playlistAudioService.next(), KeyColor.hi_green, KeyColor.lo_amber));

    this.volumeKeys = new Array();
    for (var i = 0; i < 8; i++) {
      var tempKey = new SliderKey('volume', i);
      tempKey.onPushCallback = function (value) {
        this.playlistAudioService.setVolume(value);
      }.bind(this);
      this.controller.setupBtn(0, 3, 7 - i, tempKey);
      this.volumeKeys.push(tempKey);
    }
    this.onVolumeChange(this.playlistAudioService.volume);



    if (navigator.requestMIDIAccess) {
      console.log('Browser supports MIDI!');
      navigator.requestMIDIAccess().then(
        (midi) => this.midiInit(midi), () => this.midiFailure()
      );
    }
    this.playlistAudioService.getObservable().subscribe(event => this.handleServiceEvent(event));

  }

  midiInit(midi) {
    var inputs = midi.inputs.values();
    for (var input = inputs.next();
      input && !input.done;
      input = inputs.next()) {
      if (input.value.name.startsWith('Launchpad Mini')) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = (message) => { this.controller.incomingData(message) };
        break;
      }
    }

    var outputs = midi.outputs.values();
    for (var output = outputs.next();
      output && !output.done;
      output = outputs.next()) {
      if (output.value.name.startsWith('Launchpad Mini')) {
        // each time there is a midi message call the onMIDIMessage function
        console.log('Found output midi');
        this.controller.sendToDevice = function (data) {
          output.value.send(data);
        }
        this.controller.drawPage();
        break;
      }
    }

  }

  handleServiceEvent(event: PlaylistAudioEvent) {
    switch (event.eventType) {
      case PlaylistAudioEventType.PAUSE:
        //Change key color
        this.onPause();
        break;
      case PlaylistAudioEventType.PLAY:
        //Change key color
        this.onPlay();
        break;
      case PlaylistAudioEventType.PLAYLIST_SET:
        GroupKey.setGroupSelected(this.playlistKeyGroup, event.data.playlistName);
        break;
      case PlaylistAudioEventType.TRACK_CHANGE:

        break;
      case PlaylistAudioEventType.VOLUME_CHANGE:
        this.onVolumeChange(event.data.targetVolume);
        break;
      case PlaylistAudioEventType.PROGRESS_UPDATE:
        break;
      case PlaylistAudioEventType.PLAYLISTS_LOADED:
        this.initPlaylistButtons(event.data.playlists);
        break;


    }
  }

  initPlaylistButtons(playlists: Crate[]) {
    playlists.forEach((element, index) => {
      var tempKey = new GroupKey(this.playlistKeyGroup, element.name);
      tempKey.onSelectedPush = () => {
        this.currentPlaylistKey = tempKey;
        this.playlistAudioService.togglePlay();
      };
      tempKey.onUnSelectedPush = () => {

        this.currentPlaylistKey = tempKey;
        this.playlistAudioService.setPlaylist(element);
      };
      this.controller.setupBtn(0, 0, index, tempKey);
    });
  }

  onPause() {
    this.midiPlayKey.playing = false;
    this.midiPlayKey.setled();
    this.currentPlaylistKey.active=false;
    this.currentPlaylistKey.setled();

  }

  onPlay() {
    this.midiPlayKey.playing = true;
    this.midiPlayKey.setled();
    this.currentPlaylistKey.active=true;
    this.currentPlaylistKey.setled();
  }

  onVolumeChange(newVolume) {
    this.volumeKeys.forEach((e) => {
      e.setValue(newVolume);
    })
  }


  midiFailure() {
    console.log('Error initializing MIDI');

  }
}

export class Controller{
  id: number;
  name: string;
  hardwareName: string;
}
