import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { CategoryService } from '../../services/category.service';
import { EnfoqueService } from '../../services/enfoque.service';
import { EjecutorService } from '../../services/ejecutor.service';
import { ZoneService } from '../../services/zone.service';
import { ToastrService } from 'ngx-toastr';
import { EventEmitterService } from '../../services/event-emitter.service';
import { EventBiService } from 'src/app/services/event-bi.service';
import { EventCapacitacionService } from 'src/app/services/event-capacitacion.service';
import { EventNavbarService } from 'src/app/services/event-navbar.service';
import { EventMantenedoresService } from 'src/app/services/event-mantenedores.service';
import { EventCargaMasivaService } from 'src/app/services/carga-masiva.service';
import { EventAprobacionMasivaService } from 'src/app/services/event-aprobacion-masiva.service';
import { UserService } from 'src/app/services/user.service';
import { CapacitacionModalComponent } from 'src/app/components/capacitacion-modal/capacitacion-modal.component';

import{ Router } from '@angular/router' ;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  rolid: any = sessionStorage.getItem('rolid');
  usuarioHabilitado : boolean = true;
  sidebarIsOpen = false;
  creationMode: string;
  categoriesWithFocos: any;
  enfoques: any;
  ejecutoresWithRelatores: any;
  zonas: any;
  loginData: any;
  nombreUsuario: string;
  rutContratista: string;
  valor: any;
  showPlan = true;
  loading = false;
  isIndicatorsCollapsed = false;
  isMobile: boolean = false;
  constructor(
    private modalService: NgbModal,
    private navigationService: NavigationService,
    private categoryService: CategoryService,
    private enfoqueService: EnfoqueService,
    private ejecutorService: EjecutorService,
    private zoneService: ZoneService,
    private toastr: ToastrService,
    private eventEmitterService: EventEmitterService,
    private eventBiService: EventBiService,
    private eventMantenedoresService: EventMantenedoresService,
    private eventCapacitacionService: EventCapacitacionService,
    private eventNavbarService: EventNavbarService,
    private eventCargaMasivaService : EventCargaMasivaService,
    private eventAprobacionMasivaService : EventAprobacionMasivaService,
    private router : Router) {
    this.isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

  }

  ngOnInit() {

    if (this.isMobile) {
      this.sidebarIsOpen = true;
    } else {
      this.sidebarIsOpen = false;
    }

    this.loginData = JSON.parse(sessionStorage.getItem('loginData'))
    this.nombreUsuario = this.loginData.usertableentity.nombreTrabajador;
    this.rutContratista = this.loginData.usertableentity.rutContratista;
    this.hidePlanificar()
    if(sessionStorage.getItem('rolid') == "3"){
      this.estaHabilitado(sessionStorage.getItem('userid'));
    }

    if (this.eventNavbarService.subsVar == undefined) {
      this.eventNavbarService.subsVar = this.eventNavbarService.
        invokeFirstComponentFunction.subscribe((name: string) => {
          this.toggleSidebar();
        });
    }
  }


  getActualPage(): string {
    return this.navigationService.getActualPage();
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      document.getElementById('sidebar').style.width = this.sidebarIsOpen ? '0px' : '100%';
      document.getElementById('sidebar').style['z-index'] = this.sidebarIsOpen ? '0px' : '10';
      document.getElementById('close-arrow').style['z-index'] = this.sidebarIsOpen ? '0px' : '11';
    } else {
      document.getElementById('sidebar').style.width = this.sidebarIsOpen ? '0px' : '230px';
      document.getElementById('sidebar').style.display = !this.sidebarIsOpen ? 'inline' : 'none';
      document.getElementById('app-div').style['margin-left'] = this.sidebarIsOpen ? '0px' : '230px';
    }
    this.sidebarIsOpen = !this.sidebarIsOpen;
  }

  onPageSelected(path: string): void {
    this.navigationService.goTo(path);
  }

  logout(): void {
    if (this.sidebarIsOpen) {
      this.toggleSidebar()
    }
    sessionStorage.removeItem('loginData')
    sessionStorage.clear();
    this.navigationService.goTo('/login');
  }

  getCategories(): any {
    return new Promise((resolve, reject) => {
      this.categoryService.listWithFocos()
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  getEnfoques(): any {
    return new Promise((resolve, reject) => {
      this.enfoqueService.list()
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  getEjecutores(): any {
    return new Promise((resolve, reject) => {
      this.ejecutorService.listWithRelatores()
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  getZonas(): any {
    return new Promise((resolve, reject) => {
      this.zoneService.getZonas()
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  estaHabilitado(user : string): any {
    return new Promise((resolve, reject) => {
      this.categoryService.estaHabilitado(user)
      .then(response => {
        this.usuarioHabilitado = true;
      })
      .catch(error => {
        this.usuarioHabilitado = false;
      });
    });
  }

  openModal(modal: any, mode: string): void {
    this.loading = true;
    const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
    
    Promise.all([
      this.getCategories(),
      this.getEnfoques(),
      this.getEjecutores(),
      this.getZonas(),
    ])
      .then(results => {
        this.categoriesWithFocos = results[0];
        this.enfoques = results[1];
        this.ejecutoresWithRelatores = results[2];
        this.zonas = results[3];
        this.creationMode = mode;
        this.loading = false;
        this.modalService.open(modal, modalOptions);
      })
      .catch(error => console.error(error));

  }

  openModalCargaPlan(modal: any): void {
    const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
    this.modalService.open(modal, modalOptions);
  }

  onSave(): void {
    this.eventEmitterService.onFirstComponentButtonClick();
    this.eventEmitterService.onIndicatorsRefresh();
    this.eventEmitterService.onCalendarRefresh();
  }

  onSaveAccept(): void {
    this.eventEmitterService.onFirstComponentButtonClick();
    this.eventEmitterService.onIndicatorsRefresh();
    this.eventEmitterService.onCalendarRefresh();
  }
  
  openComponenteBi() {
    this.isIndicatorsCollapsed = true;
    if (this.sidebarIsOpen) {
      this.toggleSidebar()
    }
    this.eventBiService.onBiComponentButtonClick();
  }

  openMantenedores() {
    this.eventMantenedoresService.onMantenedoresComponentButtonClick();
    this.router.navigate(['/mantenedores']);
  }

  openComponentDashboard() {
    this.router.navigate(['/dashboard']);
  }

  openComponentDashboardContratista() {
    this.router.navigate(['/dashboard-contratista']);
  }

  openComponentCapacitaciones() {
    this.eventCapacitacionService.onCapacitacionesComponentButtonClick();
    this.router.navigate(['/capacitaciones']);
  }

  openComponentCargaMasiva() {
    const siempre_edita = this.loginData.usertableentity.roleId == 1 ? true : false;
    if(!this.usuarioHabilitado && !siempre_edita){
      this.toastr.info('Lo sentimos, el periodo de creación de capacitaciones ha finalizado', 'Advertencia');
      return;
    }
    this.eventCargaMasivaService.onCargaMasivaComponentButtonClick();
    this.router.navigate(['/carga-masiva']);
  }

  openAprobacion() {
    this.eventAprobacionMasivaService.onAprobacionMasivaComponentButtonClick();
    this.router.navigate(['/aprobacion']);
  }


  hidePlanificar() {
    const configuration = this.loginData.configurationTableEntity;
    const siempre_edita = this.loginData.usertableentity.planificaSiempre;
    const abreModal = configuration.map((x) => x.codigo == "FECHA_PLAN");
    if ((!abreModal || abreModal == "") && !siempre_edita) {
      this.showPlan = false;
    }
  }

  collapseIndicators(): void {
    this.isIndicatorsCollapsed = !this.isIndicatorsCollapsed;
    this.openComponentCapacitaciones();
  }
}
