import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusConfimationComponent } from './change-status-confimation.component';

describe('ChangeStatusConfimationComponent', () => {
  let component: ChangeStatusConfimationComponent;
  let fixture: ComponentFixture<ChangeStatusConfimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeStatusConfimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStatusConfimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
