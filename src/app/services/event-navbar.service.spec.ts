import { TestBed } from '@angular/core/testing';
import { EventNavbarService } from './event-navbar.service';


describe('EventNavbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventNavbarService = TestBed.get(EventNavbarService);
    expect(service).toBeTruthy();
  });
});
