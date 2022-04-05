import { TestBed } from '@angular/core/testing';
import { EventMonthService } from './event-month.service';


describe('EventMonthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventMonthService = TestBed.get(EventMonthService);
    expect(service).toBeTruthy();
  });
});
