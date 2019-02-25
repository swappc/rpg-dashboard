import { Injectable } from '@angular/core';
import { Playlist } from './playlist'
import { HttpClient }    from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PlaylistService{

  constructor(
    private http: HttpClient
  ) { }

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>('http://localhost:3000/playlists');
  }

}
