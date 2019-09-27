import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCalendarConfirmationComponent } from './delete-calendar-confirmation.component';

describe('DeleteCalendarConfirmationComponent', () => {
  let component: DeleteCalendarConfirmationComponent;
  let fixture: ComponentFixture<DeleteCalendarConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCalendarConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCalendarConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
