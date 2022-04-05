import { HttpClient } from '@angular/common/http';
import { ConfigService } from './services/config.service';

export default { load };

function load(http: HttpClient, config: ConfigService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      http.get('assets/config/config.json').toPromise()
        .then((result: { backend: { host: string, port: string } }) => {
          config.API_URL = `http://${result.backend.host}:${result.backend.port}/api`;
          config.PUB_URL = `http://${result.backend.host}:${result.backend.port}/pub`;
          resolve(true);
        })
        .catch(error => {
          config.API_URL = 'http://localhost:8081/api';
          config.PUB_URL = 'http://localhost:8081/pub';
          resolve(true);
        });
    });
  };
}
