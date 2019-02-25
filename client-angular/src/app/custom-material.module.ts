
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatListModule,  MatSidenavModule, MatToolbarModule, MatTabsModule, MatGridListModule, MatFormFieldModule, MatSliderModule, MatButtonToggleModule } from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatButtonToggleModule, MatListModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatTabsModule, MatGridListModule, MatSliderModule, MatMenuModule],
  exports: [MatButtonModule, MatButtonToggleModule, MatListModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatTabsModule, MatGridListModule, MatSliderModule, MatMenuModule],
})
export class CustomMaterialModule { }