import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAdjustmentComponent } from './leave-adjustment.component';

describe('LeaveAdjustmentComponent', () => {
  let component: LeaveAdjustmentComponent;
  let fixture: ComponentFixture<LeaveAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
