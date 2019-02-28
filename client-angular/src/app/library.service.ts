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
    return this.http.post<Playlist>('/api/playlists', playlist, httpOptions);
  }

  deletePlaylist(playlist: Playlist): Observable<Playlist> {
    return this.http.delete<Playlist>('/api/playlists/' + playlist.id);
  }

  savePlaylistTracks(playlist: Playlist, tracks: PlaylistTrack[]): Observable<PlaylistTrack[]> {
    return this.http.put<PlaylistTrack[]>('/api/playlists/' + playlist.id + '/tracks', tracks, httpOptions);
  }

  updatePlaylist(playlist: Playlist): Observable<Playlist> {
    return this.http.patch<Playlist>('/api/playlists/' + playlist.id, playlist, httpOptions);
  }

  getPlaylistTracks(playlistId: number): Observable<PlaylistTrack[]>{
    return this.http.get<PlaylistTrack[]>('/api/playlists/'+playlistId+'/tracks')
  }

  getLibraryTracks(): Observable<PlaylistTrack[]>{
    return this.http.get<PlaylistTrack[]>('/api/library');
  }
}
