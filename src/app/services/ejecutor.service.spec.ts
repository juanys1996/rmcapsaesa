import { TestBed } from '@angular/core/testing';

import { EjecutorService } from './ejecutor.service';

describe('EjecutorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EjecutorService = TestBed.get(EjecutorService);
    expect(service).toBeTruthy();
  });
});
