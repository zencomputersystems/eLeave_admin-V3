import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvitesComponent } from './admin-invites.component';

describe('AdminInvitesComponent', () => {
  let component: AdminInvitesComponent;
  let fixture: ComponentFixture<AdminInvitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
