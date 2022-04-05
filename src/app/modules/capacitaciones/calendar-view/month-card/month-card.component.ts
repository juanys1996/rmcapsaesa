import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CapacitacionService } from 'src/app/services/capacitacion.service';
import { MONTHS } from 'src/app/utils/constants';

@Component({
  selector: 'app-month-card',
  templateUrl: './month-card.component.html',
  styleUrls: ['./month-card.component.scss']
})
export class MonthCardComponent implements OnInit {
  rows: any;
  page = 0;
  year = new Date().getFullYear();
  pageSize = 50;
  @Input() month: { id: number, label: string, isCollapsed: boolean, data: any[] };
  @Input() loading: boolean;
  @Output() collapse: EventEmitter<void> = new EventEmitter<void>();

  constructor(private capacitacionService: CapacitacionService) {
  }

  ngOnInit() {
  }

  onCollapse(): void {
    this.collapse.emit();
  }

  getMonthLabel(id: number): string {
    return MONTHS[id - 1].label;
  }
  filtroMes(mes: string) {
  }
  icon(estado: string): string {
    if (estado == "Cerrada") {
      return "icon-cerrada"
    }
    if (estado == "Cerrada con Retraso") {
      return "icon-cerrada-retraso"
    }
    if (estado == "Pendiente") {
      return "icon-pendiente"
    }
    if (estado == "Pendiente con Retraso") {
      return "icon-pendiente-retraso"
    }
    if (estado == "Enviada para aprobación") {
      return "icon-esperando"
    }
    if (estado == "Abierta") {
      return "icon-creada"
    }
  }
}
