import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalOverrideComponent } from './approval-override.component';

describe('ApprovalOverrideComponent', () => {
  let component: ApprovalOverrideComponent;
  let fixture: ComponentFixture<ApprovalOverrideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalOverrideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
