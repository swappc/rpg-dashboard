
import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
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
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
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
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
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