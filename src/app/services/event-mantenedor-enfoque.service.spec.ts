import { TestBed } from '@angular/core/testing';
import { EventMantenedorCategoriaService } from './event-mantenedor-categoria.service';
import { EventMantenedorEnfoqueService } from './event-mantenedor-enfoque.service';


describe('EventMantenedorEnfoqueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventMantenedorEnfoqueService = TestBed.get(EventMantenedorEnfoqueService);
    expect(service).toBeTruthy();
  });
});
