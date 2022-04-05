import { TestBed } from '@angular/core/testing';
import { EventMantenedoresService } from './event-mantenedores.service';


describe('EventMantenedoresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventMantenedoresService = TestBed.get(EventMantenedoresService);
    expect(service).toBeTruthy();
  });
});
