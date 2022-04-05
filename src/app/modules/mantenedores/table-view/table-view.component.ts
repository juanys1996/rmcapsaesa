import { Component, OnInit, Input } from '@angular/core';
import { CapacitacionService } from '../../../services/capacitacion.service';
import { NavigationService } from '../../../services/navigation.service';
import { MONTHS } from '../../../utils/constants';
import { ZoneService } from 'src/app/services/zone.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { EventYearService } from 'src/app/services/event-year.service';
import { EventMonthService } from 'src/app/services/event-month.service';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements OnInit {
  @Input() searchText: any;
  rolid: any = sessionStorage.getItem('rolid');
  zonas: any;
  rows: any;
  page = 0;
  pageSize = 50;
  totalAmmount: number;
  loading = false;
  year = new Date().getFullYear().toString();
  month = "";
  contratista = "";
  empresa = "";
  zona = "";

  constructor(
    private capacitacionService: CapacitacionService,
    private navigationService: NavigationService,
    private zoneService: ZoneService,
    private eventEmitterService: EventEmitterService,
    private eventMonthService: EventMonthService,
    private eventYearService: EventYearService) { }

  ngOnInit() {
    if (this.eventEmitterService.subsFirst == undefined) {
      this.eventEmitterService.subsFirst = this.eventEmitterService.
        invokeFirstComponentFunction.subscribe((name: string) => {
          this.fetchCapacitaciones(this.year, this.month, this.contratista, this.empresa, this.zona);
        });
    }
    if (this.eventYearService.subsVar == undefined) {
      this.eventYearService.subsVar = this.eventYearService.
        invokeFirstComponentFunction.subscribe((year: string) => {
          this.year = year
          this.fetchCapacitaciones(this.year, this.month, this.contratista, this.empresa, this.zona);
        });
    }
    if (this.eventMonthService.subsVar == undefined) {
      this.eventMonthService.subsVar = this.eventMonthService.
        invokeFirstComponentFunction.subscribe((month: string) => {
          this.month = month
          this.fetchCapacitaciones(this.year, this.month, this.contratista, this.empresa, this.zona);
        });
    }
    this.getZonas()
    if (!this.navigationService.getValidLogin()) this.navigationService.goTo('/login');
    this.fetchCapacitaciones(this.year, this.month, this.contratista, this.empresa, this.zona);

  }

  fetchCapacitaciones(year: string, month: string, contratista: string, empresa: string, zona: string): void {
    this.loading = true;
    this.capacitacionService.getTotalAmmout(year, month, contratista, empresa, zona)
      .then(ammount => this.totalAmmount = ammount)
      .catch(error => console.error(error));
    this.capacitacionService.list(this.page, this.pageSize, year, month, contratista, empresa, zona)
      .then(capacitacionesWithAssistances => {
        this.rows = capacitacionesWithAssistances.map(capacitacionWithAssistances => this.buildRow(capacitacionWithAssistances));
        this.loading = false;
      })
      .catch(error => {
        console.error(error);
        this.loading = false;
      });
  }

  buildRow(capacitacionWithAssistances: any): any {
    if (this.rolid == 2) {
      return {
        capacitacion: capacitacionWithAssistances.capacitacion,
        workers: capacitacionWithAssistances.assistanceRegistries,
        id: capacitacionWithAssistances.capacitacion.capacitacionId,
        status: capacitacionWithAssistances.capacitacion.stateShortDescription,
        type: capacitacionWithAssistances.capacitacion.capacitacionTypeDescription,
        month: this.getMonthLabel(capacitacionWithAssistances.capacitacion.month),
        year: capacitacionWithAssistances.capacitacion.year,
        zone: capacitacionWithAssistances.capacitacion.zone,
        enterprise: capacitacionWithAssistances.capacitacion.year,
        contractor: capacitacionWithAssistances.capacitacion.year,
        cells: [
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.capacitacionId },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.zoneDescription },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.nombreTrabajador + " " + capacitacionWithAssistances.capacitacion.apellidoPaterno },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.capacitacionTypeDescription },
          { class: 'td-truncated', tooltip: true, content: capacitacionWithAssistances.capacitacion.name },
          { class: 'td-truncated', tooltip: true, content: capacitacionWithAssistances.capacitacion.categoryDescription },
          { class: 'td-truncated', tooltip: true, content: capacitacionWithAssistances.capacitacion.focoDescription },
          { class: 'td-full', tooltip: false, content: capacitacionWithAssistances.capacitacion.ejecutorDescription },
          { class: 'td-centered', tooltip: false, content: this.getMonthLabel(capacitacionWithAssistances.capacitacion.month) },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.stateShortDescription }
        ]
      };
    }
    if (this.rolid == 3) {
      return {
        capacitacion: capacitacionWithAssistances.capacitacion,
        workers: capacitacionWithAssistances.assistanceRegistries,
        id: capacitacionWithAssistances.capacitacion.capacitacionId,
        status: capacitacionWithAssistances.capacitacion.stateShortDescription,
        type: capacitacionWithAssistances.capacitacion.capacitacionTypeDescription,
        month: this.getMonthLabel(capacitacionWithAssistances.capacitacion.month),
        year: capacitacionWithAssistances.capacitacion.year,
        zone: capacitacionWithAssistances.capacitacion.zone,
        enterprise: capacitacionWithAssistances.capacitacion.year,
        contractor: capacitacionWithAssistances.capacitacion.year,
        cells: [
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.capacitacionId },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.zoneDescription },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.capacitacionTypeDescription },
          { class: 'td-truncated', tooltip: true, content: capacitacionWithAssistances.capacitacion.name },
          { class: 'td-truncated', tooltip: true, content: capacitacionWithAssistances.capacitacion.categoryDescription },
          { class: 'td-truncated', tooltip: true, content: capacitacionWithAssistances.capacitacion.focoDescription },
          { class: 'td-full', tooltip: false, content: capacitacionWithAssistances.capacitacion.ejecutorDescription },
          { class: 'td-centered', tooltip: false, content: this.getMonthLabel(capacitacionWithAssistances.capacitacion.month) },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.stateShortDescription }
        ]
      };
    } else {
      return {
        capacitacion: capacitacionWithAssistances.capacitacion,
        workers: capacitacionWithAssistances.assistanceRegistries,
        id: capacitacionWithAssistances.capacitacion.capacitacionId,
        status: capacitacionWithAssistances.capacitacion.stateShortDescription,
        type: capacitacionWithAssistances.capacitacion.capacitacionTypeDescription,
        month: this.getMonthLabel(capacitacionWithAssistances.capacitacion.month),
        year: capacitacionWithAssistances.capacitacion.year,
        zone: capacitacionWithAssistances.capacitacion.zone,
        enterprise: capacitacionWithAssistances.capacitacion.year,
        contractor: capacitacionWithAssistances.capacitacion.year,
        cells: [
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.capacitacionId },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.zoneDescription },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.nombreContratista },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.nombreTrabajador + " " + capacitacionWithAssistances.capacitacion.apellidoPaterno },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.capacitacionTypeDescription },
          { class: 'td-truncated', tooltip: true, content: capacitacionWithAssistances.capacitacion.name },
          { class: 'td-truncated', tooltip: true, content: capacitacionWithAssistances.capacitacion.categoryDescription },
          { class: 'td-truncated', tooltip: true, content: capacitacionWithAssistances.capacitacion.focoDescription },
          { class: 'td-full', tooltip: false, content: capacitacionWithAssistances.capacitacion.ejecutorDescription },
          { class: 'td-centered', tooltip: false, content: this.getMonthLabel(capacitacionWithAssistances.capacitacion.month) },
          { class: 'td-centered', tooltip: false, content: capacitacionWithAssistances.capacitacion.stateShortDescription }
        ]
      };
    }
  }

  getMonthLabel(id: number): string {
    return MONTHS[id - 1].label;
  }

  onChangePage(page: number): void {
    this.page = page;
    this.fetchCapacitaciones(this.year, this.month, this.contratista, this.empresa, this.zona);
  }

  onChangeSize(size: number): void {
    this.pageSize = size;
    this.fetchCapacitaciones(this.year, this.month, this.contratista, this.empresa, this.zona);
  }
  getZonas(): any {
    return new Promise((resolve, reject) => {
      this.zoneService.getZonas()
        .then(response => {
          this.zonas = response
        })
        .catch(error => reject(error));
    });
  }
  getZoneLabel(id: number): string {
    let descripcion
    this.zonas.forEach(element => {
      if (element.zoneId == id) {
        descripcion = element.descripcion
      }
    });
    return descripcion;
  }
}
