import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class RelatorService {
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
    return this.http.get(`${this.configService.API_URL}/relatores`, { headers }).toPromise();
  }
  public update(user: any): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/relatores/update`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public create(user: any): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/relatores`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public getAllCategorias(): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/relatores`, { headers }).toPromise();
  }
  public getUltimoId(): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/relatores/ultimoId`, { headers }).toPromise();
  }
  public delete(user: any, relatorId: number): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/relatores/delete/${relatorId}`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
}
