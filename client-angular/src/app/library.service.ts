import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Track } from './track';

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

  getCrates(): Observable<Crate[]> {
    return this.http.get<Crate[]>('/api/crates');
  }

  createCrate(create: Crate): Observable<Crate> {
    return this.http.post<Crate>('/api/crates', create, httpOptions);
  }

  deleteCrate(crate: Crate): Observable<Crate> {
    return this.http.delete<Crate>('/api/crates/' + crate.id);
  }

  saveCrateTracks(crate: Crate, tracks: Track[]): Observable<Track[]> {
    return this.http.put<Track[]>('/api/crates/' + crate.id + '/tracks', tracks, httpOptions);
  }

  updateCrate(crate: Crate): Observable<Crate> {
    return this.http.patch<Crate>('/api/crates/' + crate.id, crate, httpOptions);
  }

  getCrateTracks(crate: number): Observable<Track[]> {
    return this.http.get<Track[]>('/api/crates/' + crate + '/tracks')
  }

  getLibraryTracks(): Observable<Track[]> {
    return this.http.get<Track[]>('/api/library');
  }
}

export class Crate {
  name: string;
  id: number;
  type: CrateType;
  metadata: any;

}

export enum CrateType{
  PLAYLIST=0,
  SAMPLER=1,
  ENVIRONMENT=2
}
