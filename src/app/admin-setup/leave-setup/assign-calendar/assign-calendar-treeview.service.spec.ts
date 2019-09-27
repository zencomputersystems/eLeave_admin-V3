import { TestBed } from '@angular/core/testing';

import { AssignCalendarTreeviewService } from './assign-calendar-treeview.service';

describe('AssignCalendarTreeviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssignCalendarTreeviewService = TestBed.get(AssignCalendarTreeviewService);
    expect(service).toBeTruthy();
  });
});
