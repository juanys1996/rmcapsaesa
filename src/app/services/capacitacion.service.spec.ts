import { TestBed } from '@angular/core/testing';

import { CapacitacionService } from './capacitacion.service';

describe('CapacitacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CapacitacionService = TestBed.get(CapacitacionService);
    expect(service).toBeTruthy();
  });
});
