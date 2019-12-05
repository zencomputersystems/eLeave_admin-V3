import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearEndClosingComponent } from './year-end-closing.component';

describe('YearEndClosingComponent', () => {
  let component: YearEndClosingComponent;
  let fixture: ComponentFixture<YearEndClosingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearEndClosingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearEndClosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
