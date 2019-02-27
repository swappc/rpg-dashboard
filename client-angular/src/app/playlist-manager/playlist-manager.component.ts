import { Component, OnInit, Inject } from '@angular/core';
import { Playlist } from '../playlist'
import { MatOptionSelectionChange, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { LibraryService } from '../library.service';

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
  // playlists = [
  //   {code: '1', name: 'Toby'},
  //   {code: '2', name: 'Sarah'},
  //   {code: '3', name: 'Frank'},
  //   {code: '4', name: 'Leslie'},
  //   {code: '5', name: 'Kyle'},
  //   {code: '6', name: 'Megan'},
  //   {code: '7', name: 'Rod'}
  // ]

  name: string;

  constructor(
    public dialog: MatDialog,
    private libraryService: LibraryService) { }

  ngOnInit() {
    this.getPlaylists();
  }

  getPlaylists() {
    this.libraryService.getPlaylists()
      .subscribe(playlists => {
        this.playlists = playlists;
        this.playlists.forEach((element, index) => {
          //TODO populate the track list.
        });
        if (playlists.length > 0) {
          this.selected = this.playlists[0].name;
        }
      });
  }

  playlistChanged(event: MatOptionSelectionChange, playlist: any) {
    if (event.source.selected) {
      console.log("Why hello " + playlist.name + "!");
    }
  }

  newPlaylistClicked(): void {
    const dialogRef = this.dialog.open(PlaylistManagerNewPlaylistDialog, {
      width: '250px',
      data: { name: this.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var playlist = new Playlist();
        playlist.name = result;
        this.libraryService.createPlaylist(playlist)
          .subscribe(playlist => {
            this.playlists.push(playlist);
            this.playlists.sort((a, b) => {
              if (a.name > b.name) {
                return 1;
              }
              if (a.name < b.name) {
                return -1;
              }
              return 0;
            });
            this.selected = playlist.name;
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
  constructor(
    public dialogRef: MatDialogRef<PlaylistManagerNewPlaylistDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
