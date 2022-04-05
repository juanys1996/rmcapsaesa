import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
    providedIn: 'root'
})

export class EventAprobacionMasivaService {
    invokeFirstComponentFunction = new EventEmitter();
    subsVar: Subscription;

    constructor() { }
  
    onAprobacionMasivaComponentButtonClick() {
      this.invokeFirstComponentFunction.emit();
    }
}
