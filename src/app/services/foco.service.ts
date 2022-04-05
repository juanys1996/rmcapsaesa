import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class FocoService {
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

  public list(): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/focos`, { headers }).toPromise();
  }

  public create(user: any): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/focos`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public update(user: any): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/focos/update`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public delete(user: any, focoId: number): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/focos/delete/${focoId}`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public getAllCategorias(): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/focos`, { headers }).toPromise();
  }
  public getUltimoId(): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/focos/ultimoId`, { headers }).toPromise();
  }
}
