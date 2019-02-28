import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Playlist, PlaylistTrack } from '../playlist'
import { MatOptionSelectionChange, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSelectionListChange } from '@angular/material';
import { LibraryService } from '../library.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

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
  libraryTracks: PlaylistTrack[];
  playlistTracks: PlaylistTrack[];
  currentPlaylist = null;
  selectedOptions: PlaylistTrack[];

  name: string;

  constructor(
    public dialog: MatDialog,
    private libraryService: LibraryService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.getPlaylists();
  }

  playlistNotSelected() {
    return this.currentPlaylist == null;
  }

  getPlaylists() {
    this.libraryService.getPlaylists()
      .subscribe(playlists => {
        this.playlists = playlists;
        if (playlists.length > 0) {
          this.selected = this.playlists[0].name;
        }
      });
  }

  playlistChanged(event: MatOptionSelectionChange, playlist: any) {
    if (event.source.selected) {
      this.currentPlaylist = playlist;
      this.populateTrackList();
      this.populateLibrary();
    }
  }

  libraryClicked(playlistTrack: PlaylistTrack) {
    this.libraryTracks = this.libraryTracks.filter((value, index, array) => {
        return value.name != playlistTrack.name;
    });
    this.playlistTracks.push(playlistTrack);
    this.sortArrayByName(this.playlistTracks);
  }

  playlistClicked(playlistTrack: PlaylistTrack) {
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

  newPlaylistClicked(): void {
    const dialogRef = this.dialog.open(PlaylistManagerNewPlaylistDialog, {
      width: '250px',
      data: { name: this.name,
              method: "Create" }
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
      data: { name: this.selected,
              method: "Update" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var playlist = new Playlist();
        playlist.name = result;
        playlist.id = this.currentPlaylist.id;
        this.libraryService.updatePlaylist(playlist)
          .subscribe(playlist => {
            console.log(playlist.name);
            this.currentPlaylist.name = playlist.name;
            this.sortPlaylists();
          });
      }
    });
  }

  deletePlaylistClicked(): void {
    if (!this.currentPlaylist) {
      return;
    }

    const dialogConf = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { confirm: false, 
              message: "Are you certain you want to delete this playlist?"}
    });

    dialogConf.afterClosed().subscribe(result => {
      console.log(result);
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
