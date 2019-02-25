import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistManagerComponent } from './playlist-manager.component';

describe('PlaylistManagerComponent', () => {
  let component: PlaylistManagerComponent;
  let fixture: ComponentFixture<PlaylistManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
