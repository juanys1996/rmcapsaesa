import { TestBed } from '@angular/core/testing';
import { RelatorService } from './relator.service';


describe('RelatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelatorService = TestBed.get(RelatorService);
    expect(service).toBeTruthy();
  });
});
