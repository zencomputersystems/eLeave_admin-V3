import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHourConfigComponent } from './working-hour-config.component';

describe('WorkingHourConfigComponent', () => {
  let component: WorkingHourConfigComponent;
  let fixture: ComponentFixture<WorkingHourConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingHourConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHourConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
