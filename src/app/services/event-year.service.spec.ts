import { TestBed } from '@angular/core/testing';
import { EventYearService } from './event-year.service';


describe('EventYearService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventYearService = TestBed.get(EventYearService);
    expect(service).toBeTruthy();
  });
});
