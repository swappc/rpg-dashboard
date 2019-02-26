import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplerManagerComponent } from './sampler-manager.component';

describe('SamplerManagerComponent', () => {
  let component: SamplerManagerComponent;
  let fixture: ComponentFixture<SamplerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
