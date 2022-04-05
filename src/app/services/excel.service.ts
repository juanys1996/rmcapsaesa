import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ConfigService } from './config.service';
import { CapacitacionService } from './capacitacion.service';
import { MONTHS } from '../utils/constants';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const WORK_SHEET_NAMES = {
  REPORTE_INICIAL: 'Tabla',
  ASISTENCIA: 'Asistencia'
}
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  rows: any;
  rowsAssitance: any;
  private jsonContent = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionStorage.getItem('batoken'),
      'User': sessionStorage.getItem('userid')
    })
  };

  private headers = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private capacitacionService: CapacitacionService) { }

  public async exportAsExcelFile() {
    await this.capacitacionService.list(0, 100000000, "", "", "", "", "")
      .then(capacitacionesWithAssistances => {
        this.rows = capacitacionesWithAssistances.map(capacitacionWithAssistances => this.buildRow(capacitacionWithAssistances));
        this.rowsAssitance = capacitacionesWithAssistances.map(capacitacionWithAssistances => capacitacionWithAssistances.assistanceRegistries);
      })
      .catch(error => {
        console.error(error);
      });
      const rowsnonull =  this.rowsAssitance.filter(value => JSON.stringify(value) !== '[]');
      let cleanJSON = "[" + JSON.stringify(rowsnonull).replace(/[\[\]&]+/g, '') + "]";
      const assitanceReady = JSON.parse(cleanJSON);
      const rowsfinal = assitanceReady.map(assitanceReady => this.buildRowAssitances(assitanceReady));
    const wsReportInic: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rows);
    const wsReportAsist: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rowsfinal);
    const workbook: XLSX.WorkBook = {
      Sheets: {
        'Tabla': wsReportInic,
        'Asistencia': wsReportAsist,
      }, SheetNames: [WORK_SHEET_NAMES.REPORTE_INICIAL, WORK_SHEET_NAMES.ASISTENCIA]
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Reporte');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_tabla_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  buildRow(capacitacionWithAssistances: any): any {
    return {
      "ID": capacitacionWithAssistances.capacitacion.capacitacionId,
      "Rut Empresa": capacitacionWithAssistances.capacitacion.rutContratista,
      "Nombre Empresa": capacitacionWithAssistances.capacitacion.nombreContratista,
      "Nombre Contratista": capacitacionWithAssistances.capacitacion.nombreTrabajador + " " + capacitacionWithAssistances.capacitacion.apellidoPaterno,
      "Tipo de capacitación": capacitacionWithAssistances.capacitacion.capacitacionTypeDescription,
      "Nombre": capacitacionWithAssistances.capacitacion.name,
      "Categoría": capacitacionWithAssistances.capacitacion.categoryDescription,
      "Foco": capacitacionWithAssistances.capacitacion.focoDescription,
      "Enfoque": capacitacionWithAssistances.capacitacion.enfoqueDescription,
      "Zona": capacitacionWithAssistances.capacitacion.zoneDescription,
      "Ejecutor": capacitacionWithAssistances.capacitacion.ejecutorDescription,
      "Relator": capacitacionWithAssistances.capacitacion.relatorDescription,
      "Observación": capacitacionWithAssistances.capacitacion.observation,
      "Mes de planificación": this.getMonthLabel(capacitacionWithAssistances.capacitacion.month),
      "Fecha de ejecución real": capacitacionWithAssistances.capacitacion.realExecutionDate,
      "Cantidad de asistentes": capacitacionWithAssistances.capacitacion.realAssistants,
      "Duración real (HH)": `${capacitacionWithAssistances.capacitacion.realHours}hs`,
      "Horas Estimadas": `${capacitacionWithAssistances.capacitacion.estimatedHours == null ? "- " : capacitacionWithAssistances.capacitacion.estimatedHours}hs`,
      "Horas Teoricas Real": `${capacitacionWithAssistances.capacitacion.realTheoryHours == null ? "- " : capacitacionWithAssistances.capacitacion.realTheoryHours}hs`,
      "Horas Prácticas Real": `${capacitacionWithAssistances.capacitacion.realPracticeHours == null ? "- " : capacitacionWithAssistances.capacitacion.realPracticeHours}hs`,
      "Asistentes Estimados": capacitacionWithAssistances.capacitacion.estimatedAssistants,
      "Asistentes Reales": capacitacionWithAssistances.capacitacion.realAssistants,
      "Fecha de creación": capacitacionWithAssistances.capacitacion.creationDate,
      "Fecha de cierre": capacitacionWithAssistances.capacitacion.cierreDate,
      "Estado": capacitacionWithAssistances.capacitacion.stateShortDescription,

    };
  }

  buildRowAssitances(capacitacionWithAssistances: any): any {
    //const assitance = capacitacionWithAssistances;
    if (capacitacionWithAssistances != null && capacitacionWithAssistances != undefined)
    return {
      "ID Capacitacion": capacitacionWithAssistances.capacitacionId,
      "ID Asistencia": capacitacionWithAssistances.assistanceRegistryId,
      "Rut Trabajador": capacitacionWithAssistances.rutTrabajador,
      "Nombre Trabajador": capacitacionWithAssistances.nombreTrabajador + " " + capacitacionWithAssistances.apellidoPaterno
    };
  }


  getMonthLabel(id: number): string {
    return MONTHS[id - 1].label;
  }
}
