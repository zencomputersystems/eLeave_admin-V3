import { TestBed } from '@angular/core/testing';

import { WorkingHourApiService } from './working-hour-api.service';

describe('WorkingHourApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkingHourApiService = TestBed.get(WorkingHourApiService);
    expect(service).toBeTruthy();
  });
});
