import { TestBed } from '@angular/core/testing';
import { EventBiService } from './event-bi.service';


describe('EventBiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventBiService = TestBed.get(EventBiService);
    expect(service).toBeTruthy();
  });
});
