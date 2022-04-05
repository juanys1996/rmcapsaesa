import { TestBed } from '@angular/core/testing';

import { ContratistasService } from './contratistas.service';

describe('ContratistasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContratistasService = TestBed.get(ContratistasService);
    expect(service).toBeTruthy();
  });
});
