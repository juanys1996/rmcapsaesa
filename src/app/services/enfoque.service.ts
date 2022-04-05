import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EnfoqueService {
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
    return this.http.get(`${this.configService.API_URL}/enfoques`, { headers }).toPromise();
  }
  public update(user: any, categoriaId: number): Promise<any> {
    return this.http.put(
      `${this.configService.API_URL}/enfoques/${categoriaId}`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public create(user: any): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/enfoques`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public getAllCategorias(): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/enfoques/todos`, { headers }).toPromise();
  }
}
