import { TestBed } from '@angular/core/testing';
import { EventMantenedorRelatorService } from './event-mantenedor-relator.service';


describe('EventMantenedorRelatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventMantenedorRelatorService = TestBed.get(EventMantenedorRelatorService);
    expect(service).toBeTruthy();
  });
});
