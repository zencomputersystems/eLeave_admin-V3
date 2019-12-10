import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyOnBehalfComponent } from './apply-on-behalf.component';

describe('ApplyOnBehalfComponent', () => {
  let component: ApplyOnBehalfComponent;
  let fixture: ComponentFixture<ApplyOnBehalfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyOnBehalfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyOnBehalfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
