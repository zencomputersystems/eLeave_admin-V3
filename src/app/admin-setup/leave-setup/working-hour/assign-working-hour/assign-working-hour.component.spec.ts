import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignWorkingHourComponent } from './assign-working-hour.component';

describe('AssignWorkingHourComponent', () => {
  let component: AssignWorkingHourComponent;
  let fixture: ComponentFixture<AssignWorkingHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignWorkingHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignWorkingHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
