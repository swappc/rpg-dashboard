import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlaylistTrack } from '../playlist';
import { LibraryService } from '../library.service';
import { SamplerPlayer } from '../sampler';
import { MidiService } from '../midi.service';
import { NLM, CallbackKey, PlayKey } from '../midi-controller';

@Component({
  selector: 'app-sampler-manager',
  templateUrl: './sampler-manager.component.html',
  styleUrls: ['./sampler-manager.component.css']
})
export class SamplerManagerComponent implements OnInit {
  allTracks: PlaylistTrack[];
  filteredTracks: PlaylistTrack[];
  searchText: string;
  samplers: SamplerPlayer[][][];
  page = 0;
  controller: NLM;

  constructor(
    private libraryService: LibraryService,
    private changeDetector: ChangeDetectorRef,
    private midiService: MidiService
  ) {
    this.libraryService.getLibraryTracks().subscribe(tracks => {
      this.allTracks = tracks;
      this.filteredTracks = tracks.slice(0, 30);
    })

    this.controller = midiService.getController();

    this.samplers = new Array();
    for (var page = 0; page < 1; page++) {
      this.samplers[page] = new Array();
      for (var row = 0; row < 8; row++) {
        this.samplers[page][row] = new Array();
        for (var col = 0; col < 4; col++) {
          var tempPlayer  = new SamplerPlayer();

          tempPlayer.onEnded = function () {
            this.changeDetector.markForCheck();
          }.bind(this);

          const playDelegate = (player: SamplerPlayer)=>{
            return ()=>{player.togglePlay();
            this.changeDetector.markForCheck();}
          }

          var tempKey = new PlayKey(playDelegate(tempPlayer));
          this.controller.setupBtn(page, col+4, row,tempKey);

          const onPauseDelegate = (key: PlayKey)=>{
            return ()=>{
              key.playing = false;
              key.setled();
            }
          }

          const onPlayDelegate = (key: PlayKey)=>{
            return ()=>{
              key.playing = true;
              key.setled();
            }
          }

          tempPlayer.onPause = onPauseDelegate(tempKey);

          tempPlayer.onPlay = onPlayDelegate(tempKey);

          this.samplers[page][row][col] = tempPlayer;
        }
      }
    }

  }

  getColor(sampler: SamplerPlayer) {
    if (sampler.isPlaying()) {
      return 'lightgreen';
    } else if (sampler.playerElement.src) {
      return '#FFC200';
    } else {
      return 'lightgray';
    }
  }

  changePage(page:number){
    this.page = page;
  }

  drop(event) {
    console.log(event);
  }

  ngOnInit() {
  }

}
