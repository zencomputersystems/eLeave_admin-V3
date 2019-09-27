import { TestBed } from '@angular/core/testing';

import { ManageHolidayApiService } from './manage-holiday-api.service';

describe('ManageHolidayApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageHolidayApiService = TestBed.get(ManageHolidayApiService);
    expect(service).toBeTruthy();
  });
});
