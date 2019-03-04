import { Component, OnInit, Inject } from '@angular/core';
import { MatOptionSelectionChange, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { LibraryService, Playlist } from '../library.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Track } from '../track';
import { SamplerPlayer } from '../sampler-player';


export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager.component.html',
  styleUrls: ['./playlist-manager.component.css']
})
export class PlaylistManagerComponent implements OnInit {
  selected = null;
  playlists: Playlist[];
  libraryTracks: Track[];
  playlistTracks: Track[];
  currentPlaylist = null;
  selectedOptions: Track[];
  currentTrack: Track;
  player: SamplerPlayer;
  noPriorityList: Playlist[];
  priorityList: Playlist[];

  name: string;

  constructor(
    public dialog: MatDialog,
    private libraryService: LibraryService) {
    this.player = new SamplerPlayer();
    this.noPriorityList = new Array();
    this.priorityList = new Array();
  }

  ngOnInit() {
    this.getPlaylists();
  }

  playlistNotSelected(): boolean {
    return this.currentPlaylist == null;
  }

  getPlaylists(): void {
    this.libraryService.getPlaylists()
      .subscribe(playlists => {
        this.playlists = playlists;
        if (playlists.length > 0) {
          this.selected = this.playlists[0].name;
          playlists.forEach((list, index, array) => {
            if (list.priority) {
              this.priorityList.push(list);
            } else {
              this.noPriorityList.push(list);
            }
          });
          this.sortArrayByName(this.noPriorityList);
          this.priorityList.sort((a, b) => {
            if (a.priority > b.priority) {
              return 1;
            }
            if (a.priority < b.priority) {
              return -1;
            }
            return 0;
          });
        }
      });
  }

  playlistChanged(event: MatOptionSelectionChange, playlist: any): void {
    if (event.source.selected) {
      this.currentPlaylist = playlist;
      this.populateTrackList();
      this.populateLibrary();
    }
  }

  isPlaying(track: Track): boolean {
    return this.currentTrack == track;
  }

  libraryClicked(playlistTrack: Track): void {
    this.libraryTracks = this.libraryTracks.filter((value, index, array) => {
      return value.name != playlistTrack.name;
    });
    this.playlistTracks.push(playlistTrack);
    this.sortArrayByName(this.playlistTracks);
  }

  playlistClicked(playlistTrack: Track): void {
    this.playlistTracks = this.playlistTracks.filter((value, index, array) => {
      return value.name != playlistTrack.name;
    });
    this.libraryTracks.push(playlistTrack);
    this.sortArrayByName(this.libraryTracks);
  }

  populateTrackList(): void {
    this.libraryService.getPlaylistTracks(this.currentPlaylist.id).subscribe(playlistTracks => {
      this.playlistTracks = playlistTracks;
    });
  }

  populateLibrary(): void {
    this.libraryService.getLibraryTracks().subscribe(libraryTracks => {

      var dict = {};
      for (var i = 0; i < this.playlistTracks.length; ++i) {
        dict[this.playlistTracks[i].name] = true;
      }

      var tempTracks = [];
      for (var i = 0; i < libraryTracks.length; ++i) {
        if (!dict[libraryTracks[i].name]) {
          tempTracks.push(libraryTracks[i]);
        }
      }

      this.libraryTracks = tempTracks;
    });
  }

  sortPlaylists(): void {
    this.sortArrayByName(this.playlists);
  }

  sortArrayByName(array: any[]) {
    array.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }

  togglePlay(track: Track) {
    if (this.currentTrack === track) {
      this.player.pause();
      this.currentTrack = null;
    } else {
      this.currentTrack = track;
      this.player.setTrack(this.currentTrack);
      this.player.play();
    }
  }

  newPlaylistClicked(): void {
    const dialogRef = this.dialog.open(PlaylistManagerNewPlaylistDialog, {
      width: '250px',
      data: {
        name: this.name,
        method: "Create"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var playlist = new Playlist();
        playlist.name = result;
        this.libraryService.createPlaylist(playlist)
          .subscribe(playlist => {
            this.playlists.push(playlist);
            this.sortPlaylists();
            this.selected = playlist.name;
          });
      }
    });
  }

  editPlaylistClicked(): void {
    if (!this.currentPlaylist) {
      return;
    }

    const dialogRef = this.dialog.open(PlaylistManagerNewPlaylistDialog, {
      width: '250px',
      data: {
        name: this.selected,
        method: "Update"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var playlist = new Playlist();
        playlist.name = result;
        playlist.id = this.currentPlaylist.id;
        this.libraryService.updatePlaylist(playlist)
          .subscribe(playlist => {
            this.currentPlaylist.name = playlist.name;
            this.sortPlaylists();
          });
      }
    });
  }

  savePlaylistTracksClicked(): void {
    if (!this.currentPlaylist) {
      return;
    }

    this.libraryService.savePlaylistTracks(this.currentPlaylist, this.playlistTracks).subscribe(savedTracks => {
      this.populateTrackList();
      this.populateLibrary();
    })

  }

  resetTracksClicked(): void {
    this.populateTrackList();
    this.populateLibrary();
  }

  deletePlaylistClicked(): void {
    if (!this.currentPlaylist) {
      return;
    }

    const dialogConf = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        confirm: false,
        message: "Are you certain you want to delete this playlist?"
      }
    });

    dialogConf.afterClosed().subscribe(result => {
      if (result == true) {
        console.log("Deleting Playlist: " + this.currentPlaylist.name)
        this.libraryService.deletePlaylist(this.currentPlaylist).subscribe(noReponse => {
          this.playlists = this.playlists.filter((value, index, arr) => {
            return value.name != this.currentPlaylist.name;
          });
          this.currentPlaylist = null;
          this.selected = this.playlists.length > 0 ? this.playlists[0].name : undefined;
        });
      }

    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.sortArrayByName(this.noPriorityList);
  }

}

@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager-new-playlist-dialog.html'
})
export class PlaylistManagerNewPlaylistDialog {
  method: string;

  constructor(
    public dialogRef: MatDialogRef<PlaylistManagerNewPlaylistDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
