import { TestBed } from '@angular/core/testing';

import { PronexoService } from './pronexo.service';

describe('PronexoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PronexoService = TestBed.get(PronexoService);
    expect(service).toBeTruthy();
  });
});
