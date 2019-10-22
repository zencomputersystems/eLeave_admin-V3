import { TestBed } from '@angular/core/testing';

import { CalendarProfileApiService } from './calendar-profile-api.service';

describe('CalendarProfileApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalendarProfileApiService = TestBed.get(CalendarProfileApiService);
    expect(service).toBeTruthy();
  });
});
