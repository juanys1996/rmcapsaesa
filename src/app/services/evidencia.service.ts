import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {
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


  public list(capacitacionId: any): Promise<any> {
    return this.http.get(
      `${this.configService.API_URL}/evidencia/list/${capacitacionId}`,
      { ...this.jsonContent }).toPromise();
  }

  public listTemp(tempId: any): Promise<any> {
    return this.http.get(
      `${this.configService.API_URL}/evidencia/listTemp/${tempId}`,
      { ...this.jsonContent }).toPromise();
  }

  public delete(fileId: number): Promise<any> {
    return this.http.post(
      `${this.configService.API_URL}/evidencia/delete?id=${fileId}`,
      { ...this.jsonContent }).toPromise();
  }

  public download(fileId: number): Promise<any> {
    return this.http.get(
      `${this.configService.API_URL}/evidencia/download/${fileId}`,
      { ...this.jsonContent }).toPromise();
  }

  public downloadFile(fileId: number, name: string): void {
    this.http.get(`${this.configService.API_URL}/evidencia/download/${fileId}`,
      { ...this.jsonContent, responseType: 'blob' }).subscribe(
        (response: any) => {
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.download = name
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();
        },
        error => console.log(error),
        () => { console.log("completed") }
      )
  }

  public upload(capacitacionId: number, file: FormData) {
    return this.http.post(`${this.configService.API_URL}/evidencia/upload?capacitacionId=${capacitacionId}`, file).toPromise()
  }

  public uploadTemp(uuid: string, file: FormData) {
    return this.http.post(`${this.configService.API_URL}/evidencia/uploadTemp${uuid == null ? '' : '?tempFolder=' + uuid }`, file).toPromise()
  }

  public saveTemp(uuid: string, id: number) {
    return this.http.post(`${this.configService.API_URL}/evidencia/rename?tempFolder=${uuid}&capacitacionId=${id}`, {...this.jsonContent}).toPromise()
  }
}
