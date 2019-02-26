
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatListModule, MatSelectModule, MatSidenavModule, MatToolbarModule, MatTabsModule, MatGridListModule, MatFormFieldModule, MatInputModule, MatSliderModule, MatButtonToggleModule, MatDialogModule } from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatButtonToggleModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatListModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatSelectModule, MatSidenavModule, MatTabsModule, MatGridListModule, MatSliderModule, MatMenuModule],
  exports: [MatButtonModule, MatButtonToggleModule, MatDialogModule, MatFormFieldModule, MatInputModule,  MatListModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatSelectModule, MatSidenavModule, MatTabsModule, MatGridListModule, MatSliderModule, MatMenuModule],
})
export class CustomMaterialModule { }