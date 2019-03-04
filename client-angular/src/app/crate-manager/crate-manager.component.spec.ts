import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrateManagerComponent } from './crate-manager.component';

describe('CrateManagerComponent', () => {
  let component: CrateManagerComponent;
  let fixture: ComponentFixture<CrateManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrateManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrateManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
