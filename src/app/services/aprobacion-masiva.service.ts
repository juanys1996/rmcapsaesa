import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from './config.service';
import { Console } from 'console';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AprobacionMasivaService {
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

    //Llena Filtros
    //Busca los años de las capacitaciones
    public getAnnio(): Promise<any> {
      return this.http.get(`${this.configService.API_URL}/capacitaciones/find-annio`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getAnnioPlanes(): Promise<any> {
      return this.http.get(`${this.configService.API_URL}/capacitaciones/find-annio-planes`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    //Busca las empresas por año
    public getEmpresa(annio : number, userid : number , rolid : number): Promise<any> {
      return this.http.get(`${this.configService.API_URL}/capacitaciones/find-empresa?annio=${annio}&userid=${userid}&rolid=${rolid}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    //Busca los planes de capacitación
    public getPlanCapacitacion(annio : number, empresa : string, estado : string, userid : number , rolid : number): Promise<any> {
      return this.http.get(`${this.configService.API_URL}/capacitaciones/find-plan?annio=${annio}&empresa=${empresa}&estado=${estado}&userid=${userid}&rolid=${rolid}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    //Busca las capacitaciones Contratista
    public getListaCapacitacionesContratista(anio : number, estado : string, empresa : string, tipoCapacitacion : number){
      return this.http.get(`${this.configService.API_URL}/capacitaciones/find-capacitaciones-contratista?annio=${anio}&estado=${estado}&empresa=${empresa}&tipoCapacitacion=${tipoCapacitacion}`,
      { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    //Busca las capacitaciones Contratista
    public buscarKpiCumplimiento(idPlan : number){
      return this.http.get(`${this.configService.API_URL}/capacitaciones/revision-kpi?idPlanCapacitacion=${idPlan}`,
      { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    //Busca las capacitaciones Contratista
    public getListaCapacitacionesAdmin(anio : number, estado : string, empresa : string, idPlan : string, tipoCapacitacion : number){
      return this.http.get(`${this.configService.API_URL}/capacitaciones/find-capacitaciones-admin?annio=${anio}&empresa=${empresa}&estado=${estado}&plan=${idPlan}&tipoCapacitacion=${tipoCapacitacion}`,
      { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getArchivosAdjuntos(capacitacion : number){
      return this.http.get(`${this.configService.API_URL}/capacitaciones/find-adjuntos?capacitacion=${capacitacion}`,
      { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getDownloadFile(capacitacionId : number, adjunto: string | undefined): Observable<Blob> {
      return this.http.get(`${this.configService.API_URL}/capacitaciones/download?idCapacitacion=${capacitacionId}&adjunto=${adjunto}`, {
        responseType: 'blob'
      });
    }


    //Actualizacion Estado
    public cambioEstadoPlan(plan : any, accion: string, observacion : string, userId : string): Promise<any> {
      let cap = new Map();
      cap.set("planCapacitacion", plan);
      cap.set("accion", accion);
      cap.set("observacion", observacion);
      cap.set("userId", userId);
      let obj = Array.from(cap).reduce(
        (obj, [key, value]) => Object.assign(obj, { [key]: value }),
        {}
      );
      let capacitaciones = JSON.stringify(obj);
      return this.http
        .post(
          `${this.configService.API_URL}/capacitaciones/cambio-estado-plan`,
          capacitaciones,
          { ...this.jsonContent, responseType: "text" }
        )
        .toPromise();
    }

    //Actualizacion Estado
    public cancelacionCapacitacion(idCapacitacion : number, observacion : string, userId : string): Promise<any> {
      let cap = new Map();
      cap.set("idCapacitacion", idCapacitacion);
      cap.set("observacion", observacion);
      cap.set("userId", userId);
      let obj = Array.from(cap).reduce(
        (obj, [key, value]) => Object.assign(obj, { [key]: value }),
        {}
      );
      let capacitaciones = JSON.stringify(obj);
      return this.http
        .post(
          `${this.configService.API_URL}/capacitaciones/cancelacion-capacitacion`,
          capacitaciones,
          { ...this.jsonContent, responseType: "text" }
        )
        .toPromise();
    }

    public updateCapacitacion(capacitacionId : number, horaCapacitacion : string, fechaRealizacion : string, workers : string[], fecha : string): Promise<any> {
        const body = JSON.stringify({ capacitacionId, horaCapacitacion, fechaRealizacion, workers, fecha });
        return this.http.post(
          `${this.configService.API_URL}/capacitaciones/update-capacitacion`,
          body,
          { ...this.jsonContent, responseType: 'text' }).toPromise();
    }
}