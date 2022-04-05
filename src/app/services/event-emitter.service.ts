import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeFirstComponentFunction = new EventEmitter();
  invokeIndicatorsRefresh = new EventEmitter();
  invokeCalendarRefresh = new EventEmitter();
  subsVar: Subscription;
  subsFirst :Subscription;
  subsIndicators :Subscription;
  subsCalendar:  Subscription;

  constructor() { }

  onFirstComponentButtonClick() {
    this.invokeFirstComponentFunction.emit();
  }
  onIndicatorsRefresh() {
    this.invokeIndicatorsRefresh.emit();
  }
  onCalendarRefresh() {
    this.invokeCalendarRefresh.emit();
  }
}
