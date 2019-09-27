import { TestBed } from '@angular/core/testing';

import { LeaveEntitlementByBatchApiService } from './leave-entitlement-by-batch-api.service';

describe('LeaveEntitlementByBatchApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeaveEntitlementByBatchApiService = TestBed.get(LeaveEntitlementByBatchApiService);
    expect(service).toBeTruthy();
  });
});
