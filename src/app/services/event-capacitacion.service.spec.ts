import { TestBed } from '@angular/core/testing';
import { EventCapacitacionService } from './event-capacitacion.service';

describe('EventCapacitacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventCapacitacionService = TestBed.get(EventCapacitacionService);
    expect(service).toBeTruthy();
  });
});
