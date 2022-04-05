import { TestBed } from '@angular/core/testing';
import { EventYearCalendarService } from './event-yearCalendar.service';


describe('EventYearCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventYearCalendarService = TestBed.get(EventYearCalendarService);
    expect(service).toBeTruthy();
  });
});
