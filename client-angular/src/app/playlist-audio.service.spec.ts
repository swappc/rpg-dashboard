import { TestBed } from '@angular/core/testing';

import { PlaylistAudioService } from './playlist-audio.service';

describe('PlaylistAudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlaylistAudioService = TestBed.get(PlaylistAudioService);
    expect(service).toBeTruthy();
  });
});
