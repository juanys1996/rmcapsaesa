import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  public getEmpresas(): Promise<any> {
    const userid = sessionStorage.getItem('userid');
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken'), User: userid });
    return this.http.get(`${this.configService.API_URL}/empresas/listaempresas?user=${userid}`, { headers }).toPromise();
  }

  public obtenerEmpresas(): Promise<any> {
    const userid = sessionStorage.getItem('userid');
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken'), User: userid });
    return this.http.get(`${this.configService.API_URL}/empresas/obtener_empresas`, { headers }).toPromise();
  }
}
