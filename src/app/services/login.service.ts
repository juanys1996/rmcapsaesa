import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private jsonContent = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('user' + ':' + 'password')
    })
  };

  constructor(private http: HttpClient,
    private configService: ConfigService) { }

  public login(login: any): Promise<any> {
    let username = 'javainuse'
    let password = 'password'
    const body = JSON.stringify(login);
    return this.http.post(
      `${this.configService.PUB_URL}/login`,
      body,
      { ...this.jsonContent, responseType: 'text' },
    ).toPromise();
  }
  
}
