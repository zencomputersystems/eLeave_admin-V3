import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuNavigationComponent } from './side-menu-navigation.component';

describe('SideMenuNavigationComponent', () => {
  let component: SideMenuNavigationComponent;
  let fixture: ComponentFixture<SideMenuNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideMenuNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
