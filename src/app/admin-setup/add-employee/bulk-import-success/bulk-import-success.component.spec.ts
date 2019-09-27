import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkImportSuccessComponent } from './bulk-import-success.component';

describe('BulkImportSuccessComponent', () => {
  let component: BulkImportSuccessComponent;
  let fixture: ComponentFixture<BulkImportSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkImportSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkImportSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
