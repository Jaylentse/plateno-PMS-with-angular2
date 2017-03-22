import { TestBed, inject } from '@angular/core/testing';

import { HttpInterceptorBackendService } from './http-interceptor-backend.service';

describe('HttpInterceptorBackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpInterceptorBackendService]
    });
  });

  it('should ...', inject([HttpInterceptorBackendService], (service: HttpInterceptorBackendService) => {
    expect(service).toBeTruthy();
  }));
});
