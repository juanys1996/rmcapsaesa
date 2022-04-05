import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
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

  public listWithFocos(): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/categories/with-focos`, { headers }).toPromise();
  }
  public update(user: any, categoriaId: number): Promise<any> {
    return this.http.put(
      `${this.configService.API_URL}/categories/${categoriaId}`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public create(user: any): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/categories`,
      user,
      { ...this.jsonContent, responseType: 'text' }).toPromise();
  }
  public getAllCategorias(): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/categories/todas`, { headers }).toPromise();
  }

  public estaHabilitado(user : string): Promise<any> {
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken') });
    return this.http.get(`${this.configService.API_URL}/capacitaciones/empresa-habilitada?userid=${user}`, { headers }).toPromise();
  }
}

