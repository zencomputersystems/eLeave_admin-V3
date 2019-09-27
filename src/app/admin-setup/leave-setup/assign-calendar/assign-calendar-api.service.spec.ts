import { TestBed } from '@angular/core/testing';

import { AssignCalendarApiService } from './assign-calendar-api.service';

describe('AssignCalendarApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssignCalendarApiService = TestBed.get(AssignCalendarApiService);
    expect(service).toBeTruthy();
  });
});
