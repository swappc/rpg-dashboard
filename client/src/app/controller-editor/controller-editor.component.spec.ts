import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerEditorComponent } from './controller-editor.component';

describe('ControllerEditorComponent', () => {
  let component: ControllerEditorComponent;
  let fixture: ComponentFixture<ControllerEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
