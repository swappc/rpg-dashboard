import { Component, OnInit } from '@angular/core';
import { PlaylistTrack } from '../playlist';
import { LibraryService } from '../library.service';
import { SamplerPlayer } from '../sampler';

@Component({
  selector: 'app-sampler-manager',
  templateUrl: './sampler-manager.component.html',
  styleUrls: ['./sampler-manager.component.css']
})
export class SamplerManagerComponent implements OnInit {
  allTracks: PlaylistTrack[];
  filteredTracks: PlaylistTrack[];
  searchText: string;
  samplers: SamplerPlayer[][]

  constructor(
    private libraryService: LibraryService
  ) {
    this.libraryService.getLibraryTracks().subscribe(tracks => {
      this.allTracks = tracks;
      this.filteredTracks = tracks.slice(0, 30);
    })

    this.samplers = new Array();
    for (var col = 0; col < 4; col++) {
      this.samplers[col] = new Array();
      for (var row = 0; row < 8; row++) {
        this.samplers[col][row] = new SamplerPlayer();
      }
    }

  }

  drop(event) {
    console.log(event);
  }

  ngOnInit() {
  }

}
