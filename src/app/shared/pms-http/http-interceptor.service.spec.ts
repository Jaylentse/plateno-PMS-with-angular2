import { TestBed, inject } from '@angular/core/testing';

import { HttpInterceptor } from './http-interceptor.service';

describe('HttpInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ HttpInterceptor]
    });
  });

  it('should ...', inject([ HttpInterceptor ], (service: HttpInterceptor) => {
    expect(service).toBeTruthy();
  }));
});
