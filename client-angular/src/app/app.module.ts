import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { CustomMaterialModule } from './custom-material.module';
import { AppComponent } from './app.component';

import { PlaylistPlayerComponent } from './playlist-player/playlist-player.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PlaylistManagerComponent, PlaylistManagerNewPlaylistDialog} from './playlist-manager/playlist-manager.component';
import { SamplerManagerComponent } from './sampler-manager/sampler-manager.component';
import { CustomReuseStrategy } from './CustomRouteReuseStrategy';
import { TrackFilterPipe } from './track-filter.pipe';
import { NgDragDropModule } from 'ng-drag-drop';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PlaylistFilterPipe } from './playlist-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistPlayerComponent,
    PageNotFoundComponent,
    PlaylistManagerComponent,
    PlaylistManagerNewPlaylistDialog,
    SamplerManagerComponent,
    TrackFilterPipe,
    PlaylistFilterPipe,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgDragDropModule.forRoot(),
    ScrollingModule
  ],
  entryComponents: [PlaylistManagerNewPlaylistDialog, ConfirmDialogComponent],
  providers: [{ provide: RouteReuseStrategy, useClass: CustomReuseStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
