import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMoreComponent } from './invite-more.component';

describe('InviteMoreComponent', () => {
  let component: InviteMoreComponent;
  let fixture: ComponentFixture<InviteMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
