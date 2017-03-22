import { TestBed, inject } from '@angular/core/testing';

import { UserRequestsService } from './user-requests.service';

describe('UserRequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserRequestsService]
    });
  });

  it('should ...', inject([UserRequestsService], (service: UserRequestsService) => {
    expect(service).toBeTruthy();
  }));
});
