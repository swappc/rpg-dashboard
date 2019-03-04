import { Component, OnInit, Inject } from '@angular/core';
import { MatOptionSelectionChange, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSelectionListChange } from '@angular/material';
import { LibraryService, Crate, CrateType} from '../library.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Track } from '../track';
import { EnumHelpers } from '../enum-helper';

export interface DialogData {
  name: string;
  type: CrateType;
}

@Component({
  selector: 'app-crate-manager',
  templateUrl: './crate-manager.component.html',
  styleUrls: ['./crate-manager.component.css']
})
export class CrateManagerComponent implements OnInit {
  crates: Crate[];
  libraryTracks: Track[];
  crateTracks: Track[];
  currentCrate = null;
  selectedOptions: Track[];
  name: string;

  constructor(
    public dialog: MatDialog,
    private libraryService: LibraryService) { }

  ngOnInit() {
    this.getCrates();
  }

  crateNotSelected() {
    return this.currentCrate == null;
  }

  getCrates() {
    this.libraryService.getCrates()
      .subscribe(crates => {
        this.crates = crates;
        if (crates.length > 0) {
          this.currentCrate = this.crates[0];
        }
      });
  }

  crateChanged(event: MatOptionSelectionChange, crate: any) {
    if (event.source.selected) {
      this.currentCrate = crate;
      this.populateTrackList();
      this.populateLibrary();
    }
  }

  libraryClicked(crateTrack: Track) {
    this.libraryTracks = this.libraryTracks.filter((value, index, array) => {
        return value.name != crateTrack.name;
    });
    this.crateTracks.push(crateTrack);
    this.sortArrayByName(this.crateTracks);
  }

  crateClicked(crateTrack: Track) {
    this.crateTracks = this.crateTracks.filter((value, index, array) => {
        return value.name != crateTrack.name;
    });
    this.libraryTracks.push(crateTrack);
    this.sortArrayByName(this.libraryTracks);
  }

  populateTrackList(): void {
    this.libraryService.getCrateTracks(this.currentCrate.id).subscribe(crateTracks => {
      this.crateTracks = crateTracks;
    });
  }

  populateLibrary(): void {
    this.libraryService.getLibraryTracks().subscribe(libraryTracks => {

      var dict = {};
      for (var i = 0; i < this.crateTracks.length; ++i) {
        dict[this.crateTracks[i].name] = true;
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

  sortCrates(): void {
    this.sortArrayByName(this.crates);
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

  newCrateClicked(): void {
    const dialogRef = this.dialog.open(CrateManagerNewCrateDialog, {
      width: '250px',
      data: { name: this.name,
              method: "Create" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var crate = new Crate();
        crate.name = result.name;
        crate.type = result.type;
        this.libraryService.createCrate(crate)
          .subscribe(crate => {
            this.crates.push(crate);
            this.sortCrates();
            this.currentCrate = crate;
          });
      }
    });
  }

  editCrateClicked(): void {
    if (!this.currentCrate) {
      return;
    }
    
    const dialogRef = this.dialog.open(CrateManagerNewCrateDialog, {
      width: '250px',
      data: { name: this.currentCrate.name,
              type: this.currentCrate.type,
              method: "Update" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var crate = new Crate();
        crate.name = result.name;
        crate.type = result.type;
        crate.id = this.currentCrate.id;
        this.libraryService.updateCrate(crate)
          .subscribe(crate => {
            console.log(crate.name);
            this.currentCrate.name = crate.name;
            this.sortCrates();
          });
      }
    });
  }

  saveCrateTracksClicked(): void {
    if (!this.currentCrate) {
      return;
    }

    this.libraryService.saveCrateTracks(this.currentCrate, this.crateTracks).subscribe(savedTracks => {
      this.populateTrackList();
      this.populateLibrary();
    })

  }

  resetTracksClicked(): void {
    this.populateTrackList();
    this.populateLibrary();
  }

  deleteCrateClicked(): void {
    if (!this.currentCrate) {
      return;
    }

    const dialogConf = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { confirm: false, 
              message: "Are you certain you want to delete this crate?"}
    });

    dialogConf.afterClosed().subscribe(result => {
      if (result == true) {
        console.log("Deleting Crate: " + this.currentCrate.name)
        this.libraryService.deleteCrate(this.currentCrate).subscribe(noReponse => {
          this.crates = this.crates.filter((value, index, arr) => {
            return value.name != this.currentCrate.name;
          });
          this.currentCrate = this.crates.length > 0 ? this.crates[0].name:null;
        });
      }

    });
  }
}

@Component({
  selector: 'app-crate-manager',
  templateUrl: './crate-manager-new-crate-dialog.html'
})
export class CrateManagerNewCrateDialog {
  method: string;
  keys = EnumHelpers.keys(CrateType);


  constructor(
    public dialogRef: MatDialogRef<CrateManagerNewCrateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
