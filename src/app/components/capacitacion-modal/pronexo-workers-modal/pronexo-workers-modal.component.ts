import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TrabajadorService } from '../../../services/trabajador.service';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { worker, Worker, workers } from 'cluster';
import { ContratistasService } from 'src/app/services/contratistas.service';
import { error } from 'util';
import { loadavg } from 'os';
import { timingSafeEqual } from 'crypto';
import { ROL } from 'src/app/utils/constants';
import { __importDefault, __values } from 'tslib';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-pronexo-workers-modal',
  templateUrl: './pronexo-workers-modal.component.html',
  styleUrls: ['./pronexo-workers-modal.component.scss']
})
export class PronexoWorkersModalComponent implements OnInit {
  @Input() modal: any;
  @Input() workersIdSelected: string[] = [];
  @Input() workersSelected = [];
  @Output() workersChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() planCapacitacion: string = null;
  workers: any = [];
  columns = [
    'Rut Trabajador',
    'Nombre',
    'Apellido Paterno',
    'Apellido Materno',
    'Rut Contratista'
  ];
  rows = [];
  page = 0;
  prueba: any;
  pageSize = 10;
  totalAmmount = 0;
  loading = false;
  sizeOptions = [
    { label: '10 por página', value: 10 },
    { label: '20 por página', value: 20 },
    { label: '50 por página', value: 50 }
  ];
  workerSearch: string;

  private loginData = JSON.parse(sessionStorage.getItem('loginData'));

  constructor(
    private trabajadorService: TrabajadorService) {
     }
    

/*   rutContratista: string; */
  public rutContratista = this.loginData.usertableentity.rutContratista;
  public rolId = sessionStorage.getItem('rolid');

  ngOnInit() {
    this.workersIdSelected = JSON.parse(JSON.stringify(this.workersIdSelected));
    this.workersSelected = JSON.parse(JSON.stringify(this.workersSelected));
    if(this.planCapacitacion == null){
      this.fetchTrabajadores();
      this.fetchAmmount();
    }else{
      this.fetchTrabajadoresEmpresa();
      this.fetchAmmountEmpresa();
    }
    this.searchWorker();    
  }

  fetchTrabajadores() {
    this.loading = true;
    this.trabajadorService.list(this.page, this.pageSize)
      .then(workers => {
        this.workers = workers;
        this.rows = workers.map(worker => this.buildRow(worker));
        this.loading = false;
      })
      .catch(error => {
        console.error(error);
        this.loading = false;
      });
  }

  fetchTrabajadoresEmpresa() {
    this.loading = true;
    this.trabajadorService.listEmpresa(this.page, this.pageSize, this.planCapacitacion)
      .then(workers => {
        this.workers = workers;
        this.rows = workers.map(worker => this.buildRow(worker));
        this.loading = false;
      })
      .catch(error => {
        console.error(error);
        this.loading = false;
      });
  }


  fetchAmmount() {
    this.trabajadorService.getTotalAmmount()
      .then(ammount => this.totalAmmount = ammount)
      .catch(error => console.error(error));
  }

  fetchAmmountEmpresa() {
    this.trabajadorService.getTotalAmmountEmpresa(this.planCapacitacion)
      .then(ammount => this.totalAmmount = ammount)
      .catch(error => console.error(error));
  }

  buildRow(worker: any): any {
    /* this.prueba = worker.rutTrabajador; */
    return {
      id: worker.rutTrabajador,
      prueba: this.prueba = worker.rutTrabajador,
      worker,
      cells: [
        { class: 'td-centered', tooltip: false, content: worker.rutTrabajador },
        { class: 'td-centered', tooltip: false, content: worker.nombreTrabajador },
        { class: 'td-centered', tooltip: false, content: worker.apellidoPaterno },
        { class: 'td-centered', tooltip: false, content: worker.apellidoMaterno },
        { class: 'td-centered', tooltip: false, content: worker.rutContratista },
      ]
    };
  }

  onChangePage(page: number) {
    this.page = page;
    if(this.planCapacitacion == null){
      this.fetchTrabajadores();
      this.fetchAmmount();
    }else{
      this.fetchTrabajadoresEmpresa();
      this.fetchAmmountEmpresa();
    }
    //this.fetchTrabajadores();
    
  }

  onChangeSize(size: number) {
    this.pageSize = size;
    if(this.planCapacitacion == null){
      this.fetchTrabajadores();
      this.fetchAmmount();
    }else{
      this.fetchTrabajadoresEmpresa();
      this.fetchAmmountEmpresa();
    }
    //this.fetchTrabajadores();
    
  }

  changeWorkerSearch(query: string): void {
    this.workerSearch = this.formatRut(query);
  }

  searchWorker(): void {
    this.loading = true;
    this.rows = [];
    this.totalAmmount = 0;
    this.page = 0;
    
    this.trabajadorService.search(this.workerSearch)
      .then(worker => {
        this.prueba = worker.rutTrabajador;
        
        if (worker != null && (worker.rutTrabajador === this.prueba) && (this.rutContratista === worker.rutContratista) && this.rolId != '1') {
          this.loading = true;
          this.rows = [this.buildRow(worker)];
        }
        else if(worker != null && (worker.rutTrabajador === this.prueba) && this.rolId == '1'){
          this.loading = true;
          this.rows = [this.buildRow(worker)];
        }    
        else{
          console.log("RUT NO TIENE RELACION CON CONTRATISTA ACTIVO")
          this.rows = [];
          this.loading = false;
        }
      })
      .catch(error => {
        console.error(error);
        this.loading = false;
      });
  }

  cleanSearch(): void {
    this.page = 0;
    if(this.planCapacitacion == null){
      this.fetchTrabajadores();
      this.fetchAmmount();
    }else{
      this.fetchTrabajadoresEmpresa();
      this.fetchAmmountEmpresa();
    }
  }

  isIconActive(icon: string, id: string): boolean {
    if (icon === 'add') {
      return !this.workersIdSelected.includes(id);
    }
    return this.workersIdSelected.includes(id);
  }

  addWorker(worker: any) {
    if (this.isIconActive('add', worker.rutTrabajador)) {
      this.workersIdSelected.push(worker.rutTrabajador);
      this.workersSelected.push(worker);
    }
  }

  removeWorker(worker: any) {
    if (this.isIconActive('remove', worker.rutTrabajador)) {
      const idIndex = this.workersIdSelected.findIndex(id => id === worker.rutTrabajador);
      const workerIndex = this.workersSelected.findIndex(workerToAdd => workerToAdd.rutTrabajador === worker.rutTrabajador);
      this.workersIdSelected.splice(idIndex, 1);
      this.workersSelected.splice(workerIndex, 1);
    }
  }

  onAccept(): void {
    this.workersChange.emit({ workersIdSelected: this.workersIdSelected, workersSelected: this.workersSelected });
    this.modal.dismiss('accept');
  }

  formatRut(paramrut): string {
    const actual = (paramrut) ? paramrut.toString().replace(/^0+/, "") : "";
    const withoutPoints = actual.replace(/\./g, "") || "";
    const actualClean = withoutPoints.replace(/-/g, "") || "";
    if (actualClean !== "" && actualClean.length > 1) {
      const start = actualClean.substring(0, actualClean.length - 1);
      let rut = '';
      let i = 0;
      let j = 1;
      for (i = start.length - 1; i >= 0; i--) { // eslint-disable-line no-plusplus
        const letter = start.charAt(i);
        rut = letter + rut;
        if (j % 3 === 0 && j <= start.length - 1) {
          rut = `.${rut}`;
        }
        j++; // eslint-disable-line no-plusplus
      }
      const dv = actualClean.substring(actualClean.length - 1);
      rut = `${rut}-${dv}`;
      return rut.toUpperCase();
    }
    return actualClean.toUpperCase();
  }
}
