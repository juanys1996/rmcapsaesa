import { TestBed } from '@angular/core/testing';
import { EventMantenedorZonaService } from './event-mantenedor-zona.service';


describe('EventMantenedorZonaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventMantenedorZonaService = TestBed.get(EventMantenedorZonaService);
    expect(service).toBeTruthy();
  });
});
