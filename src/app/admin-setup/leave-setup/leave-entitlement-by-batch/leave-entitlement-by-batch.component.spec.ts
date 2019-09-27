import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEntitlementByBatchComponent } from './leave-entitlement-by-batch.component';

describe('LeaveEntitlementByBatchComponent', () => {
  let component: LeaveEntitlementByBatchComponent;
  let fixture: ComponentFixture<LeaveEntitlementByBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveEntitlementByBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveEntitlementByBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
