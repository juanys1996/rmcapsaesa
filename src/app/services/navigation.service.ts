import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  public getActualPage(): string {
    return this.router.url;
  }

  public goTo(path: string): void {
    if (this.getValidLogin()){
    this.router.navigate([path])
      .then(response => console.log('Navigation successful'))
      .catch(error => console.error(`Navigation failed\n${error}`));
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  public getValidLogin(){
    const token = sessionStorage.getItem('batoken');
    let valid = false;
    if (token) valid = true;
    else valid = false;
    return valid;
  }
}
