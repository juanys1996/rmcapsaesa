import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { Subscription } from "rxjs/internal/Subscription";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
})
export class EventCargaMasivaService{
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
  
  onCargaMasivaComponentButtonClick() {
    this.invokeFirstComponentFunction.emit();
  }

  public insertCargaMasiva(
    capacitacion: [],
    userId: string,
    estado: number,
    empresa : string,
    rolId : any,
  ): Promise<any> {
    let listaCapacitaciones: any[] = [];
    for (let caps of capacitacion) {
      let fecha = String(caps[9]).split("-");
      let cap = new Map();
      cap.set("nombreCapacitacion", caps[1]);
      cap.set("zona", caps[2]);
      cap.set("categoria", caps[3]);
      cap.set("foco", caps[4]);
      cap.set("enfoque", caps[5]);
      cap.set("observacion", caps[6]);
      cap.set("ejecutor", caps[7]);
      cap.set("relator", caps[8]);
      cap.set("fecha", caps[9]);
      cap.set("cantidadAsistentes", caps[10]);
      cap.set("duracionEstimada", caps[11]);
      cap.set("userId", userId);
      cap.set("estadoId", estado);
      cap.set("planCapacitacion", rolId === "1" || rolId === "2" ? caps[12]+"-"+caps[2]+"-"+fecha[2] : empresa+"-"+caps[2]+"-"+fecha[2]);
      cap.set("contratista", (rolId === "1" || rolId === "2"? caps[12] : empresa));
      cap.set("tipoCreacion", (rolId === "1" || rolId === "2"? "administrador" : "contratista"));
      cap.set("proceso", (rolId === "1" || rolId === "2"? caps[13] : caps[12]));
      let obj = Array.from(cap).reduce(
        (obj, [key, value]) => Object.assign(obj, { [key]: value }),
        {}
      );
      listaCapacitaciones.push(obj);
    }
    let capacitaciones = JSON.stringify(listaCapacitaciones);
    return this.http
      .post(
        `${this.configService.API_URL}/capacitaciones/carga-masiva`,
        capacitaciones,
        { ...this.jsonContent, responseType: "text" }
      )
      .toPromise();
  }
}
