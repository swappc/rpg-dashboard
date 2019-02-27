import { Component, OnInit, Inject } from '@angular/core';
import { MatOptionSelectionChange, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager.component.html',
  styleUrls: ['./playlist-manager.component.css']
})
export class PlaylistManagerComponent implements OnInit {
  selected = 'option1';
  playlists = [
    {code: '1', name: 'Toby'},
    {code: '2', name: 'Sarah'},
    {code: '3', name: 'Frank'},
    {code: '4', name: 'Leslie'},
    {code: '5', name: 'Kyle'},
    {code: '6', name: 'Megan'},
    {code: '7', name: 'Rod'}
  ]

  name: string;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  playlistChanged(event: MatOptionSelectionChange, playlist: any) {
    if (event.source.selected) {
      console.log("Why hello " + playlist.name + "!");
    }
  }

  newPlaylistClicked(): void {
    const dialogRef = this.dialog.open(PlaylistManagerNewPlaylistDialog, {
    width: '250px',
    data: {name: this.name}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    this.playlists.push({code: String(this.playlists.length + 1), name: result});
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
