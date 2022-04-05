import { TestBed } from '@angular/core/testing';
import { EventMantenedorCategoriaService } from './event-mantenedor-categoria.service';
import { EventMantenedorEjecutorService } from './event-mantenedor-ejecutor.service';


describe('EventMantenedorEjecutorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventMantenedorEjecutorService = TestBed.get(EventMantenedorEjecutorService);
    expect(service).toBeTruthy();
  });
});
