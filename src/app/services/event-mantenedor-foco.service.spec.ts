import { TestBed } from '@angular/core/testing';
import { EventMantenedorFocoService } from './event-mantenedor-foco.service';


describe('EventMantenedorFocoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventMantenedorFocoService = TestBed.get(EventMantenedorFocoService);
    expect(service).toBeTruthy();
  });
});
