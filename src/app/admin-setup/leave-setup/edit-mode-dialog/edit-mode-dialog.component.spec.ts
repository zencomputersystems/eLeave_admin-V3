import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModeDialogComponent } from './edit-mode-dialog.component';

describe('EditModeDialogComponent', () => {
  let component: EditModeDialogComponent;
  let fixture: ComponentFixture<EditModeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
