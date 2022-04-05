import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ComboBuilderService {

  constructor() { }

  buildMonthsCombo(): {label: string, valueStr: string, valueInt: number}[] {
    return [
      {valueInt: 1, valueStr: '01', label: 'Enero'},
      {valueInt: 2, valueStr: '02', label: 'Febrero'},
      {valueInt: 3, valueStr: '03', label: 'Marzo'},
      {valueInt: 4, valueStr: '04', label: 'Abril'},
      {valueInt: 5, valueStr: '05', label: 'Mayo'},
      {valueInt: 6, valueStr: '06', label: 'Junio'},
      {valueInt: 7, valueStr: '07', label: 'Julio'},
      {valueInt: 8, valueStr: '08', label: 'Agosto'},
      {valueInt: 9, valueStr: '09', label: 'Septiembre'},
      {valueInt: 10, valueStr: '10', label: 'Octubre'},
      {valueInt: 11, valueStr: '11', label: 'Noviembre'},
      {valueInt: 12, valueStr: '12', label: 'Diciembre'}
    ];
  }

  buildYearsCombo(prevYears: number, nextYears: number): {label: string, value: number}[] {
    const actualYear = moment().year();
    const years = [];
    for (let y = actualYear - prevYears; y <= actualYear + nextYears; y++) {
      years.push({label: y.toString(), value: y});
    }
    return years;
  }
}
