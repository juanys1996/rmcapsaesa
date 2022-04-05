import { TestBed } from '@angular/core/testing';
import { ZonasService } from './zonas.service';

describe('ZonasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZonasService = TestBed.get(ZonasService);
    expect(service).toBeTruthy();
  });
});
