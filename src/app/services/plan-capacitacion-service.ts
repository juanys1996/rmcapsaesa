import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { Subscription } from "rxjs/internal/Subscription";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "./config.service";

@Injectable({
    providedIn: "root",
  })

  export class EventPlanCapacitacionService{
    private jsonContent = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("batoken"),
            User: sessionStorage.getItem("userid"),
        }),
    };

    invokeFirstComponentFunction = new EventEmitter();
    subsVar: Subscription;
    private headers = new HttpHeaders();

    constructor(private http: HttpClient, private configService: ConfigService) {}

    public insertPlanCapacitacion( capacitacion: [], userId: string ): Promise<any> {
        let listaCapacitaciones: any[] = [];
        for (let caps of capacitacion) {
          let cap = new Map();
          cap.set("anio", caps[0]);
          cap.set("proceso", caps[1]);
          cap.set("nombreFoco", caps[2]);
          cap.set("nombreCategoria", caps[3]);
          cap.set("cantidad", caps[4]);
          cap.set("usuarioId", userId);
          let obj = Array.from(cap).reduce(
            (obj, [key, value]) => Object.assign(obj, { [key]: value }),
            {}
          );
          listaCapacitaciones.push(obj);
        }
        let capacitaciones = JSON.stringify(listaCapacitaciones);
        return this.http
          .post(
            `${this.configService.API_URL}/capacitaciones/crear-plan-capacitacion`,
            capacitaciones,
            { ...this.jsonContent, responseType: "text" }
          )
          .toPromise();
      }
}