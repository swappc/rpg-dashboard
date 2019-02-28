
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatMenuModule,
  MatIconModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTabsModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatSliderModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({

  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatTooltipModule,
    MatGridListModule,
    MatSliderModule,
    MatMenuModule,
    ScrollingModule],
  exports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatGridListModule,
    MatSliderModule,
    MatMenuModule,
    ScrollingModule],
})
export class CustomMaterialModule { }