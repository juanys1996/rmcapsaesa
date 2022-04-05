import { TestBed } from '@angular/core/testing';
import { EventMantenedorCategoriaService } from './event-mantenedor-categoria.service';


describe('EventMantenedorCategoriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventMantenedorCategoriaService = TestBed.get(EventMantenedorCategoriaService);
    expect(service).toBeTruthy();
  });
});
