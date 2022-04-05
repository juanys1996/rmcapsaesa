import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PronexoService {
  private jsonContent = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  public listActiveWorkers(): Promise<any> {
    return this.http.get(`${this.configService.API_URL}/pronexo/active-workers`, this.jsonContent).toPromise();
  }
}
