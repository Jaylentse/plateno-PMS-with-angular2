import { TestBed, inject } from '@angular/core/testing';

import { PmsHttp } from './pms-http.service';

describe('PmsHttpServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PmsHttp]
    });
  });

  it('should ...', inject([ PmsHttp ], (service: PmsHttp) => {
    expect(service).toBeTruthy();
  }));
});
