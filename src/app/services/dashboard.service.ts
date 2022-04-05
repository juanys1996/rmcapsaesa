import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { Subscription } from "rxjs/internal/Subscription";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "./config.service";

@Injectable({
    providedIn: "root",
})

export class DashboardService {
    private jsonContent = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("batoken"),
            User: sessionStorage.getItem("userid"),
        }),
    };

    invokeFirstComponentFunction = new EventEmitter();
    subsVar: Subscription;

    constructor(private http: HttpClient, private configService: ConfigService) { }

    public getListaCapacitacionesRealizadas(contratista : string): Promise<any> {
        return this.http.get(`${this.configService.API_URL}/capacitaciones/capacitaciones-realizadas?contratista=${contratista}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getListaCapacitacionesMes(contratista : string): Promise<any> {
        return this.http.get(`${this.configService.API_URL}/capacitaciones/capacitaciones-mes?contratista=${contratista}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getListaCapacitacionesNoRealizadas(contratista : string): Promise<any> {
        return this.http.get(`${this.configService.API_URL}/capacitaciones/capacitaciones-no-realizadas?contratista=${contratista}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getZonas(){
        return this.http.get(`${this.configService.API_URL}/capacitaciones/find-zonas`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getHorasZona(anio : string, mes : string, zona : string, tipoCapacitacion : string){
        return this.http.get(`${this.configService.API_URL}/capacitaciones/resumen-hh-zona?anio=${anio}&mes=${mes}&zona=${zona}&tipoCapacitacion=${tipoCapacitacion}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getHorasFoco(anio : string, mes : string, zona : string, tipoCapacitacion : string){
        return this.http.get(`${this.configService.API_URL}/capacitaciones/resumen-hh-foco?anio=${anio}&mes=${mes}&zona=${zona}&tipoCapacitacion=${tipoCapacitacion}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getHorasRealizadas(anio : string, mes : string, zona : string, tipoCapacitacion : string){
        return this.http.get(`${this.configService.API_URL}/capacitaciones/resumen-hh-realizadas?anio=${anio}&mes=${mes}&zona=${zona}&tipoCapacitacion=${tipoCapacitacion}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getCapacRealizadasNoRealizadas(anio : string, mes : string, zona : string, tipoCapacitacion : string){
        return this.http.get(`${this.configService.API_URL}/capacitaciones/resumen-capac-realizadas-norealizadas?anio=${anio}&mes=${mes}&zona=${zona}&tipoCapacitacion=${tipoCapacitacion}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

    public getResumenCapacitaciones(anio : string, mes : string, zona : string, tipoCapacitacion : string){
        return this.http.get(`${this.configService.API_URL}/capacitaciones/resumen-capacitaciones?anio=${anio}&mes=${mes}&zona=${zona}&tipoCapacitacion=${tipoCapacitacion}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }
}