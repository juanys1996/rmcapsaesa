import { TestBed } from '@angular/core/testing';

import { IndicadoresService } from './indicadores.service';

describe('IndicadoresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndicadoresService = TestBed.get(IndicadoresService);
    expect(service).toBeTruthy();
  });
});
