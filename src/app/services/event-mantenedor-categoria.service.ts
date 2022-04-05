import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventMantenedorCategoriaService {

  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  refreshTable() {
    this.invokeFirstComponentFunction.emit();
  }
}
