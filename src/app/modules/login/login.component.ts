import { Component, OnInit, Input } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { LoginService } from '../../services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as sha512 from 'js-sha512';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  success = true;
  @Input() loginData: {
    user: string,
    password: string,
  } = {
      user: "",
      password: ""
    };

  constructor(private navigationService: NavigationService,
    private loginService: LoginService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  changeInput(field: string, value: any, type: string = ''): void {

    if (field == 'password') {
      this.loginData[field] = sha512.sha512(value);
    }
    else this.loginData[field] = value;

  }
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loginService.login(this.loginData).then((val) => {
      let response = JSON.parse(val);
      if (response.usertableentity.status == true) {
        sessionStorage.setItem('batoken', response.token);
        sessionStorage.setItem('userid', response.usertableentity.userId);
        sessionStorage.setItem('loginData', JSON.stringify(response));
        sessionStorage.setItem('rolid', response.usertableentity.roleId);
        sessionStorage.setItem('reglas', response.reglaTableEntity);
        if(response.usertableentity.roleId == 3){
          this.navigationService.goTo('/dashboard-contratista');
        }else if (response.usertableentity.roleId == 1 || response.usertableentity.roleId == 2){
          this.navigationService.goTo('/dashboard');
        }
      }
      else {
        this.success = false;
      }
    }).catch((error) => {
      console.log("error login: " + error);
      this.success = false;
    });
  }

}
