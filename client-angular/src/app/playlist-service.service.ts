import { Injectable } from '@angular/core';
import { Playlist } from './playlist'
import { HttpClient, HttpHeaders }    from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class PlaylistService{

  constructor(
    private http: HttpClient
  ) { }

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>('http://localhost:3000/api/playlists');
  }

  createPlaylist(playlist: Playlist): Observable<Playlist> {
    console.log(playlist);
    return this.http.post<Playlist>('http://localhost:3000/api/playlists', playlist, httpOptions);
  } 

}
