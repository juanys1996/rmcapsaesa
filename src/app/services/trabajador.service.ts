import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private jsonContent = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionStorage.getItem('batoken')
    })
  };

  private rolId = sessionStorage.getItem('rolid');
  private loginData = JSON.parse(sessionStorage.getItem('loginData'));
  private rutContratista = this.loginData.usertableentity.empresa.rut;
  
  constructor(
    private http: HttpClient,
    private configService: ConfigService) {

  }

  public list(offset: number, quantity: number): Promise<any> {
    return this.http.get(
      `${this.configService.API_URL}/trabajadores?offset=${offset.toString(10)}&quantity=${quantity.toString(10)}
      &rolId=${this.rolId}&rutContratista=${this.rutContratista}`,
      this.jsonContent).toPromise();
  }

  public listEmpresa(offset: number, quantity: number, planCapacitacion : string): Promise<any> {
    return this.http.get(
      `${this.configService.API_URL}/trabajadores/plan?offset=${offset.toString(10)}&quantity=${quantity.toString(10)}
      &rolId=${this.rolId}&planCapacitacion=${planCapacitacion}`,
      this.jsonContent).toPromise();
  }

  public getTotalAmmount(): Promise<any> {
    return this.http.get(`${this.configService.API_URL}/trabajadores/total?rolId=${this.rolId}
    &rutContratista=${this.rutContratista}`).toPromise();
  }

  public getTotalAmmountEmpresa(planCapacitacion : string): Promise<any> {
    return this.http.get(`${this.configService.API_URL}/trabajadores/total-empresa?rolId=${this.rolId}
    &planCapacitacion=${planCapacitacion}`).toPromise();
  }

  public searchContratista(rutContratista: string): Promise<any> {
    return this.http.get(
      `${this.configService.API_URL}/trabajadores/searchContratista?rutContratista=${rutContratista}`,
      this.jsonContent).toPromise();
  }

  public search(rutTrabajador: string): Promise<any> {
    return this.http.get(
      `${this.configService.API_URL}/trabajadores/search?rutTrabajador=${rutTrabajador}`,
      this.jsonContent).toPromise();
  }


}
