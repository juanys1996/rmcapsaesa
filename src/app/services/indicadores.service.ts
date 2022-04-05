import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  public getIndicadoresValues(): Promise<any> {
    const userid = sessionStorage.getItem('userid');
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken'), User: userid });
    return this.http.get(`${this.configService.API_URL}/indicadores/values?user=${userid}`, { headers }).toPromise();
  }
}
