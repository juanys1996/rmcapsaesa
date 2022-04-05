import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ContratistasService {

  
  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  public getContatistas(): Promise<any> {
    const userid =  sessionStorage.getItem('userid'); 
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken'), User: userid });
    return this.http.get(`${this.configService.API_URL}/contratistas/listacontratistas?user=${userid}`, { headers }).toPromise();
  }

  public getContratistaByZona(zona : string): Promise<any> {
    const userid =  sessionStorage.getItem('userid'); 
    const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken'), User: userid });
    return this.http.get(`${this.configService.API_URL}/contratistas/listacontratistasByZona?zona=${zona}`, { headers }).toPromise();
  }
}
