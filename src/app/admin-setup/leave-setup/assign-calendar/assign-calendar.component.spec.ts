import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCalendarComponent } from './assign-calendar.component';

describe('AssignCalendarComponent', () => {
  let component: AssignCalendarComponent;
  let fixture: ComponentFixture<AssignCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
