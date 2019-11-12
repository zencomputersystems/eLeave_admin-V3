import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeSetupComponent } from './employee-setup.component';


describe('InviteListComponent', () => {
  let component: EmployeeSetupComponent;
  let fixture: ComponentFixture<EmployeeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
