
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatSidenavModule, MatToolbarModule, MatTabsModule, MatGridListModule, MatFormFieldModule, MatSliderModule, MatButtonToggleModule } from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatTabsModule, MatGridListModule, MatSliderModule],
  exports: [MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatTabsModule, MatGridListModule, MatSliderModule],
})
export class CustomMaterialModule { }