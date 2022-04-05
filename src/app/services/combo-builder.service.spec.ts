import { TestBed } from '@angular/core/testing';

import { ComboBuilderService } from './combo-builder.service';

describe('ComboBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComboBuilderService = TestBed.get(ComboBuilderService);
    expect(service).toBeTruthy();
  });
});
