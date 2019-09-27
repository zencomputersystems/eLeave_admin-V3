import { TestBed } from '@angular/core/testing';

import { AdminInvitesApiService } from './admin-invites-api.service';

describe('AdminInvitesApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminInvitesApiService = TestBed.get(AdminInvitesApiService);
    expect(service).toBeTruthy();
  });
});
