import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOneEmployeeComponent } from './add-one-employee.component';

describe('AddOneEmployeeComponent', () => {
  let component: AddOneEmployeeComponent;
  let fixture: ComponentFixture<AddOneEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOneEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOneEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
