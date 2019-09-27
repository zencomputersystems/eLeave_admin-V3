import { TestBed } from '@angular/core/testing';

import { EmployeeTreeviewService } from './employee-treeview.service';

describe('EmployeeTreeviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmployeeTreeviewService = TestBed.get(EmployeeTreeviewService);
    expect(service).toBeTruthy();
  });
});
