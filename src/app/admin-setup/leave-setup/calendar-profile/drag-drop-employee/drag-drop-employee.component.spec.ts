import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropEmployeeComponent } from './drag-drop-employee.component';

describe('DragDropEmployeeComponent', () => {
  let component: DragDropEmployeeComponent;
  let fixture: ComponentFixture<DragDropEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragDropEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
