import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PlaylistPlayerComponent } from './playlist-player/playlist-player.component';
import { CrateManagerComponent } from './crate-manager/crate-manager.component';
import { ControllerEditorComponent } from './controller-editor/controller-editor.component';


const routes: Routes = [
  // Example
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
  { path: '', redirectTo: '/player', pathMatch: 'full' },
  { path: 'player', component: PlaylistPlayerComponent },
  { path: 'manager', component: CrateManagerComponent},
  { path: 'controller', component: ControllerEditorComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
