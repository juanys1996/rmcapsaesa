import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private jsonContent = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionStorage.getItem('batoken'),
      'User': sessionStorage.getItem('userid')
    })
  };

  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  

  public getZonas(): Promise<any> {
    const userid = sessionStorage.getItem('userid');
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken'), User: userid });
    return this.http.get(`${this.configService.API_URL}/zonas/listazonas?user=${userid}`, { headers }).toPromise();
  }
  public getAllZonas(): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/zonas`, { headers }).toPromise();
  }
  public getZonasbyUserId(user: String): Promise<any> {
    const userid = sessionStorage.getItem('userid');
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken'), User: userid });
    return this.http.get(`${this.configService.API_URL}/zonas/listazonas?user=${user}`, { headers }).toPromise();
  }
  public update(user: any, zonaId: number): Promise<any> {
    return this.http.put(
      `${this.configService.API_URL}/zonas/${zonaId}`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public create(user: any): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/zonas`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }

  public getZonasDisponibles() : Promise<any> {
      return this.http.get(`${this.configService.API_URL}/zonas/find-zonas-disponibles`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
    }

  public getZonaUsuario(userId : number) : Promise<any>{
    return this.http.get(`${this.configService.API_URL}/zonas/find-zonas-usuario?userId=${userId}`,
        { ...this.jsonContent, responseType: 'json' }).toPromise();
  }
}
