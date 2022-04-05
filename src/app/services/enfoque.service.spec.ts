import { TestBed } from '@angular/core/testing';

import { EnfoqueService } from './enfoque.service';

describe('EnfoqueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnfoqueService = TestBed.get(EnfoqueService);
    expect(service).toBeTruthy();
  });
});
