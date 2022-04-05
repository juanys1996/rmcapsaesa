import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CapacitacionService {
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
    private configService: ConfigService) { }

  public create(
    capacitacion: {
      capacitacionTypeId: number,
      name: string,
      categoryId: number,
      focoId: number,
      enfoqueId: number,
      zone: string,
      observation: string,
      ejecutorId: number,
      ejecutorOthers: string,
      relatorId: number,
      month: string,
      year: string,
      estimatedTheoryHours: number,
      estimatedPracticeHours: number,
      estimatedHours: number,
      realTheoryHours: number,
      realPracticeHours: number,
      realHours: number,
      estimatedAssistants: number,
      realAssistants: number,
      userId: string
    },
    rutTrabajadores: string[]): Promise<any> {

    const body = JSON.stringify({ newCapacitacion: capacitacion, rutTrabajadores });
    return this.http.post(
      `${this.configService.API_URL}/capacitaciones/reforzamiento`,
      body,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }

  public update(capacitacion: any, capacitacionId: number, rutTrabajadores: string[]): Promise<any> {
    const body = JSON.stringify({ capacitacion, rutTrabajadores });
    return this.http.put(
      `${this.configService.API_URL}/capacitaciones/${capacitacionId}`,
      body,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }

  public delete(capacitacionId: number): Promise<any> {
    return this.http.delete(
      `${this.configService.API_URL}/capacitaciones/${capacitacionId}`,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }

  public list(offset: number, quantity: number, year: string, month: string, contratista: string, empresa: string, zona: string): Promise<any> {
    const userid = sessionStorage.getItem('userid');
    return this.http.get(
      `${this.configService.API_URL}/capacitaciones?offset=${offset}&quantity=${quantity}&user=${userid}&year=${year}&month=${month}&contratista=${contratista}&empresa=${empresa}&zona=${zona}`,
      { ...this.jsonContent }).toPromise();
  }

  public getTotalAmmout(year: string, month: string, contratista: string, empresa: string, zona: string): Promise<any> {
    const userid = sessionStorage.getItem('userid');
    return this.http.get(`${this.configService.API_URL}/capacitaciones/ammount?user=${userid}&year=${year}&month=${month}&contratista=${contratista}&empresa=${empresa}&zona=${zona}`,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }

  public accept(capacitacionId: number, userID: string, motivoID: string, comentario: string): Promise<any> {
    const body = JSON.stringify({ userID, motivoID, comentario });
    return this.http.patch(
      `${this.configService.API_URL}/capacitaciones/${capacitacionId}/accept`,
      body,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }

  public reject(capacitacionId: number, userID: string, motivoID: string, comentario: string): Promise<any> {
    const body = JSON.stringify({ userID, motivoID, comentario });
    return this.http.patch(
      `${this.configService.API_URL}/capacitaciones/${capacitacionId}/reject`,
      body,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }

  public getCapacitacionesCalendario(userId : number, rolId : number): Promise<any> {
    return this.http.get(`${this.configService.API_URL}/capacitaciones/find-capacitaciones-calendario?userId=${userId}&rol=${rolId}`,
      { ...this.jsonContent, responseType: 'json' }).toPromise();
  }
}
