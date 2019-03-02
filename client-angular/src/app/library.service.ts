import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
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

  savePlaylistTracks(playlist: Playlist, tracks: LibraryTrack[]): Observable<LibraryTrack[]> {
    return this.http.put<LibraryTrack[]>('/api/playlists/' + playlist.id + '/tracks', tracks, httpOptions);
  }

  updatePlaylist(playlist: Playlist): Observable<Playlist> {
    return this.http.patch<Playlist>('/api/playlists/' + playlist.id, playlist, httpOptions);
  }

  getPlaylistTracks(playlistId: number): Observable<LibraryTrack[]> {
    return this.http.get<LibraryTrack[]>('/api/playlists/' + playlistId + '/tracks')
  }

  getLibraryTracks(): Observable<LibraryTrack[]> {
    return this.http.get<LibraryTrack[]>('/api/library');
  }

  getSampler(): Observable<SamplerTrack[]> {
    return this.http.get<SamplerTrack[]>('/api/sampler');
  }

  saveSampler(sampler: SamplerTrack[]): Observable<any[]> {
    return this.http.put<SamplerTrack[]>('/api/sampler', sampler, httpOptions);
  }
}

export class SamplerTrack {
  constructor(public page: number,
    public row: number,
    public col: number,
    public track: LibraryTrack) {

  }

}


export class LibraryTrack {
  name: string;
  file: string;
  id: number;
}

export class Playlist {
  name: string;
  id: number;
  priority: number;
}
