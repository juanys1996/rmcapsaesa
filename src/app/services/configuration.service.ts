import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private jsonContent = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionStorage.getItem('batoken'),
      'User': sessionStorage.getItem('userid')
    })
  };

  constructor(
    private http: HttpClient,
    private configService: ConfigService){ }

    public getConfigurationByCode(code:string): Promise<any> {
      const userid =  sessionStorage.getItem('userid'); 
      //const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken'), User: userid });
      return this.http.get(`${this.configService.API_URL}/configuration/values?code=${code}`, { ...this.jsonContent }).toPromise();
    }

    public updateConfiguracion(config: any): Promise<any> {
      const userid =  sessionStorage.getItem('userid'); 
      const body = JSON.stringify({ config });
      return this.http.post(`${this.configService.API_URL}/configuration/`, body.replace('{"config":', '').slice(0, -1),  { ...this.jsonContent,  responseType: 'text'}).toPromise();
    }

    public getAllConfiguraciones(): Promise<any>{
      const userid =  sessionStorage.getItem('userid'); 
      //const headers = new HttpHeaders({ Authorization: sessionStorage.getItem('batoken'), User: userid });
      return this.http.get(`${this.configService.API_URL}/configuration/obtener-configuraciones`, { ...this.jsonContent }).toPromise();
    }

    public deletePlanificacion(idPlanificacion : number) : Promise<any> {
      const userid =  sessionStorage.getItem('userid'); 
      const body = JSON.stringify({idPlanificacion : idPlanificacion});
        return this.http.post(
          `${this.configService.API_URL}/configuration/delete-configuration`,
          body,
          { ...this.jsonContent, responseType: 'text' }).toPromise();
    }

    public create(request : any) : Promise<any> {
      const userid =  sessionStorage.getItem('userid'); 
        return this.http.post(
          `${this.configService.API_URL}/configuration/create-configuration`,
          request,
          { ...this.jsonContent, responseType: 'text' }).toPromise();
    }

    public update(request : any) : Promise<any> {
      const userid =  sessionStorage.getItem('userid'); 
        return this.http.post(
          `${this.configService.API_URL}/configuration/update-configuration`,
          request,
          { ...this.jsonContent, responseType: 'text' }).toPromise();
    }
    
}
