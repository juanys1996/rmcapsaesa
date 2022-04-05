import { Component, OnInit, ViewChild } from '@angular/core';
import { EventNavbarService } from 'src/app/services/event-navbar.service';
import { NavigationService } from '../../services/navigation.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
    selector: 'app-dashboard-contratista',
    templateUrl: './dashboard-contratista.component.html',
    styleUrls: ['./dashboard-contratista.component.scss']
  })

export class DashboardContratistaComponent implements OnInit{
    loginData = JSON.parse(sessionStorage.getItem('loginData'));
    listaCapacitacionesRealizadas : [] = [];
    listaCapacitacionesMes : [] = [];
    listaCapacitacionesNoRealizadas : [] = [];
    pageActualRealizadas : number = 1;
    pageActualPendientes : number = 1;
    pageActualNoRealizadas : number = 1;

    constructor(private navigationService: NavigationService,
        private eventNavbarService: EventNavbarService,
        private dashboardService : DashboardService) { }

    ngOnInit() {
        this.openNavbar();
        this.findCapacitacionesRealizadas();
        this.findCapacitacionesMes();
        this.findCapacitacionesNoRealizadas();
        let isRedirected = sessionStorage.getItem('isRedirected');
        if (!isRedirected) {
          sessionStorage.setItem('isRedirected', 'true');
          window.location.reload();
        }
        if (!this.navigationService.getValidLogin()) { this.navigationService.goTo('/login'); }
    }

    openNavbar() {
        this.eventNavbarService.openNavbar();
    }

    findCapacitacionesRealizadas(){
        this.dashboardService.getListaCapacitacionesRealizadas(this.loginData.usertableentity.nombreContratista)
        .then(response => {
          this.listaCapacitacionesRealizadas = response;
        })
        .catch(error => {
          console.log(error);
        });
    }

    findCapacitacionesMes(){
        this.dashboardService.getListaCapacitacionesMes(this.loginData.usertableentity.nombreContratista)
        .then(response => {
          this.listaCapacitacionesMes = response;
        })
        .catch(error => {
          console.log(error);
        });
    }

    findCapacitacionesNoRealizadas(){
        this.dashboardService.getListaCapacitacionesNoRealizadas(this.loginData.usertableentity.nombreContratista)
        .then(response => {
          this.listaCapacitacionesNoRealizadas = response;
        })
        .catch(error => {
          console.log(error);
        });
    }
}