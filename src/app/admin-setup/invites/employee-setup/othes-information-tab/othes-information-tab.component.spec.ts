import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthesInformationTabComponent } from './othes-information-tab.component';

describe('OthesInformationTabComponent', () => {
  let component: OthesInformationTabComponent;
  let fixture: ComponentFixture<OthesInformationTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthesInformationTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthesInformationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
