import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveSetupTabComponent } from './leave-setup-tab.component';

describe('LeaveSetupTabComponent', () => {
  let component: LeaveSetupTabComponent;
  let fixture: ComponentFixture<LeaveSetupTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveSetupTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveSetupTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
