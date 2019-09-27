import { TestBed } from '@angular/core/testing';

import { PolicyApiService } from './policy-api.service';

describe('PolicyApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolicyApiService = TestBed.get(PolicyApiService);
    expect(service).toBeTruthy();
  });
});
