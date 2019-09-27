import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarNotificationComponent } from './snackbar-notification.component';

describe('SnackbarNotificationComponent', () => {
  let component: SnackbarNotificationComponent;
  let fixture: ComponentFixture<SnackbarNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
