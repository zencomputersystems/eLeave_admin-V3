import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubmitConfirmationComponent } from './dialog-submit-confirmation.component';

describe('DialogSubmitConfirmationComponent', () => {
  let component: DialogSubmitConfirmationComponent;
  let fixture: ComponentFixture<DialogSubmitConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSubmitConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSubmitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
