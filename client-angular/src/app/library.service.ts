import { Injectable } from '@angular/core';
import { Playlist, PlaylistTrack } from './playlist';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(

    private http: HttpClient
  ) { }

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>('/api/playlists');
  }

  createPlaylist(playlist: Playlist): Observable<Playlist> {
    console.log(playlist);
    return this.http.post<Playlist>('/api/playlists', playlist, httpOptions);
  } 

  getPlaylistTracks(playlistId: number): Observable<PlaylistTrack[]>{
    return this.http.get<PlaylistTrack[]>('/api/playlists/'+playlistId+'/tracks')
  }
}
