import { TestBed } from '@angular/core/testing';

import { ApprovalOverrideApiService } from './approval-override-api.service';

describe('ApprovalOverrideApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApprovalOverrideApiService = TestBed.get(ApprovalOverrideApiService);
    expect(service).toBeTruthy();
  });
});
