import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLeavePolicyComponent } from './general-leave-policy.component';

describe('GeneralLeavePolicyComponent', () => {
  let component: GeneralLeavePolicyComponent;
  let fixture: ComponentFixture<GeneralLeavePolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
