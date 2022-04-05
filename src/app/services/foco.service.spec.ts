import { TestBed } from '@angular/core/testing';
import { FocoService } from './foco.service';


describe('FocoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FocoService = TestBed.get(FocoService);
    expect(service).toBeTruthy();
  });
});
