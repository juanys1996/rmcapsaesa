import { Component, OnInit, Injectable } from '@angular/core';
import { AprobacionMasivaService } from 'src/app/services/aprobacion-masiva.service';
import { EventNavbarService } from 'src/app/services/event-navbar.service';
import { NavigationService } from '../../services/navigation.service';
import { CANTIDAD_MINIMA } from 'src/app/utils/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from '../../services/validation.service';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormGroupDirective } from "@angular/forms";
import { EvidenciaService } from '../../services/evidencia.service';
import { saveAs } from 'file-saver';
import { ThrowStmt } from '@angular/compiler';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobacion-masiva.component.html',
  styleUrls: ['./aprobacion-masiva.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})

export class AprobacionMasivaComponent implements OnInit {
  capacitacionSelected : any;
  accion : string = '';
  form: FormGroup;
  model: NgbDateStruct;
  loginData: any;
  orderHeader: string = '';
  reverse: boolean = false;
  planIdHabilitado = false;
  planHabilitado = false;
  capacitacionHabilitado = false;
  contratistaHabilitado = false;
  zonaHabilitado = false;
  categoriaHabilitado = false;
  focoHabilitado = false;
  enfoqueHabilitado = false;
  ejecutorHabilitado = false;
  fechaHabilitado = false;
  isKpiCollapsed = false;
  cantidadMinimaCaps = CANTIDAD_MINIMA;
  //Mantenedores
  listaAnio: any = [];
  listaEmpresa: any = [];
  listaPlan: any = [];
  //Lista Capacitaciones
  listaCapacitaciones: any = [];
  listaRechazados: any = [];
  listaKpi: any = [];
  //Respuesta
  error : boolean;
  errorModal : boolean;
  exitoInsercion : boolean;
  //Obtención Mantenedores
  anioSelected: number = 0;
  tipoCapacitacionSelected : string = null;
  empresaSelected: string = null;
  estadoSelected: string = null;
  planSelected: string = null;
  idPlanSelected: number = 0;
  observacionRechazo: string = null;
  observacionCancelacion: string = null;
  //Escritura Mensaje
  mensaje = "";
  //Manejo Selectd
  habilitarBusqueda: boolean = false;
  habilitarAprobacion: boolean = false;
  habilitarIconos: boolean = false;
  habilitarRechazo: boolean = false;
  habilitarTabla: boolean = false;
  habilitarRechazados: boolean = false;
  habilitarAcciones: boolean = false;
  habilitarKpi: boolean = false;
  empresaVisible: boolean = false;
  estadoVisible: boolean = false;
  planVisible: boolean = false;
  rolid: any = sessionStorage.getItem('rolid');
  estados: any = ['Enviada para aprobación', 'Aprobada', 'Rechazada']
  meses: any = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  pageActual: number = 1;
  searchValue: string;
  //Valores Modal Capacitacion
  cancCapacitacionId: number = 0; 
  modCapacitacionId: number = 0; 
  modNombreCapacitacion: string = "";
  modIdPlan: string = "";
  modPlanCapacitacion: string = "";
  modNombreContratista: string = "";
  modZona: string = "";
  modCategoria: string = "";
  modFoco: string = "";
  modEnfoque: string = "";
  modEjecutor: string = "";
  modFecha: string = "";
  modHH: string = "";
  modParticipantes: string = "";
  errorMessage: string = "";
  realAssistance: number = 0;
  workersIdSelected: string[] = [];
  workersSelected = [];
  workersColumns = [
    'Rut Trabajador',
    'Nombre',
    'Apellido Paterno',
    'Apellido Materno'
  ];
  workersRows = [];
  uuid: string = "";
  idsAdjuntos : string[] = [];
  evidences: any = [];
  listClass: boolean = false;
  horaCapacitacion : string =  "";
  listAdjuntos : any = []; 
  downloads : any;
  trustedUrl : any;

  constructor(private navigationService: NavigationService,
    private aprobacionService: AprobacionMasivaService,
    private eventNavbarService: EventNavbarService,
    private modalService: NgbModal,
    private validationService: ValidationService,
    private evidenciaService: EvidenciaService,
    public fb: FormBuilder,
  ) { 
    this.form = this.fb.group({
      evidenceFile: [null]
    })
  }

  ngOnInit() {
    this.loginData = JSON.parse(sessionStorage.getItem('loginData'));
    this.error = false;
    this.errorModal = false;
    this.exitoInsercion = false;
    this.openNavbar();
    this.getAnnio();
    this.tipoCapacitacionSelected = "reforzamiento"
    if (!this.navigationService.getValidLogin()) { this.navigationService.goTo('/login'); }
  }

  openNavbar() {
    this.eventNavbarService.openNavbar();
  }

  clickMethod(name: string) {
    if(confirm("Are you sure to delete "+name)) {
      console.log("Implement delete functionality here");
    }
  }

  //Filtros de Búsqueda

  //Filtros : Find Año
  getAnnio(): void {
    this.aprobacionService.getAnnio()
      .then(response => {
        this.listaAnio = response;
        this.onAnioChange(this.listaAnio[0], true);
      })
      .catch(error => {
        error = true;
      });
  }

  //Filtros : Find empresa
  getEmpresa(): void {
    this.aprobacionService.getEmpresa(this.anioSelected, parseInt(sessionStorage.getItem('userid')), parseInt(sessionStorage.getItem('rolid')))
      .then(response => {
        this.listaEmpresa = response;
        this.onEmpresaChange(this.listaEmpresa[0], true);
      })
      .catch(error => {
        error = true;
      });
  }

  //Filtros : Find plan 
  getPlanCapacitacion(): void {
    this.aprobacionService.getPlanCapacitacion(this.anioSelected, this.empresaSelected, this.estadoSelected, parseInt(sessionStorage.getItem('userid')), parseInt(sessionStorage.getItem('rolid')))
      .then(response => {
        this.listaPlan = response;
      })
      .catch(error => {
        error = true;
      });
  }

  //Cambio de opción - Select Año
  onAnioChange(event: any, interno: boolean) {
    if (interno) {
      this.anioSelected = event;
    } else {
      this.anioSelected = event.target.value;
    }
    this.onTipoCapacitacionChange("plan", true);
    if (this.rolid == 1 || this.rolid == 2) {
      this.getEmpresa();
      this.empresaVisible = true;
    } else {
      this.estadoVisible = true;
      this.onEstadoChange(null, true);
    }
  }

  //Cambio de opción - Select Empresa
  onEmpresaChange(event: any, interno: boolean) {
    if (interno) {
      this.empresaSelected = event;
    } else {
      this.empresaSelected = event.target.value;
    }
    if (this.empresaSelected !== null) {
      this.estadoVisible = true;
      this.onEstadoChange(null, true);
    } else {
      this.planSelected = null;
      this.estadoVisible = false;
      this.habilitarBusqueda = false;
    }
  }

  onTipoCapacitacionChange(event: any, interno: boolean){
    if (interno) {
      this.tipoCapacitacionSelected = event;
    } else {
      this.tipoCapacitacionSelected = event.target.value;
    }
    if(this.tipoCapacitacionSelected === "reforzamiento"){
      this.onEstadoChange(null, true);
      this.onPlanChange(0, true);
    }
  }

  //Cambio de opción - Select Estado
  onEstadoChange(event: any, interno: boolean) {
    this.habilitarBusqueda = true;
    if (interno) {
      this.estadoSelected = this.estados[0];
    } else {
      this.estadoSelected = event.target.value;
    }

    if (this.rolid == 1 || this.rolid == 2) {
      this.planVisible = true;
      this.onPlanChange(0, true);
      this.getPlanCapacitacion();
    }
  }

  //Cambio de opción - Select Plan
  onPlanChange(event: any, interno: boolean) {
    if (interno) {
      this.idPlanSelected = event;
    } else {
      let plan = event.target.value.split(",");
      this.idPlanSelected = plan[0];
    }
  }

  //Cambio Estado Plan
  cambioEstadoPlan(accion: string) {
    this.aprobacionService.cambioEstadoPlan(this.idPlanSelected, accion, this.observacionRechazo, sessionStorage.getItem('userid'))
      .then(response => {
        this.listaCapacitaciones = [];
        this.anioSelected = null;
        this.empresaSelected = null;
        this.planSelected = null;
        this.exitoInsercion = true;
        this.mensaje = response;
        this.habilitarTabla = false;
        this.observacionRechazo === null
        this.getAnnio();
      })
      .catch(error => {
        this.error = true;
        this.mensaje = "Ha ocurrido un error en la inserción, comuniquese con el administrador";
      });

      setTimeout(function(){
        document.getElementById("divMensaje").style.display = 'none';
    },5000)
    
  }

  //Botón buscar Capacitaciones
  buscarCapacitacionesFiltradas() {
    let tipoCapacitacion = this.tipoCapacitacionSelected === "plan" ? 1 : 2;
    if (this.rolid == 1 || this.rolid == 2) {
      let plan = this.idPlanSelected == 0 ? "TODOS" : String(this.idPlanSelected);
      this.getListaCapacitacionesAdmin(this.anioSelected, this.estadoSelected, this.empresaSelected, plan, tipoCapacitacion);
    } else {
      this.getListaCapacitaciones(this.anioSelected, this.estadoSelected, this.loginData.usertableentity.empresa.nombre, tipoCapacitacion);
    }
    this.habilitarTabla = true;
    this.estadoSelected === "Aprobada" ? this.habilitarIconos = true : this.habilitarIconos = false;
    if (this.estadoSelected === 'Enviada para aprobación' && this.idPlanSelected !== 0) {
      this.buscarKpiCumplimiento(this.idPlanSelected);
      this.habilitarAprobacion = true;
      this.habilitarRechazo = true;
      this.habilitarKpi = true;
      this.habilitarAcciones = false;
    } else {
      this.habilitarAprobacion = false;
      this.habilitarRechazo = false;
      this.habilitarKpi = false;
      if ((this.rolid == 1 || this.rolid == 2) && this.estadoSelected === "Rechazada" && this.idPlanSelected !== 0) {
        this.habilitarRechazados = true;
      } else if (this.rolid == 3 && this.estadoSelected === "Rechazada"){
        this.habilitarRechazados = true;
      }else{
        this.habilitarRechazados = false;
      }

      if (this.estadoSelected === "Aprobada" && this.idPlanSelected !== 0) {
        this.habilitarAcciones = true;
      } else if(this.rolid == 3 && this.estadoSelected === "Aprobada"){
        this.habilitarAcciones = true;
      } else {
        this.habilitarAcciones = false;
      }
    }
  }

  //Metodo de búsqueda de capacitaciones - Perfil Contratista
  getListaCapacitaciones(anio: number, estado: string, empresa: string, tipoCapacitacion : number) {
    this.aprobacionService.getListaCapacitacionesContratista(anio, estado, empresa, tipoCapacitacion)
      .then(response => {
        let resp: any = response;
        this.listaRechazados = resp.observacion;
        this.listaCapacitaciones = resp.listaCapacitaciones;
      })
      .catch(error => {
        error = true;
      });
  }

  //Metodo de búsqueda de capacitaciones - Perfil Administrador
  getListaCapacitacionesAdmin(anio: number, estado: string, empresa: string, plan: string, tipoCapacitacion : number) {
    this.aprobacionService.getListaCapacitacionesAdmin(anio, estado, empresa, plan, tipoCapacitacion)
      .then(response => {
        let resp: any = response;
        this.listaRechazados = resp.observacion;
        this.listaCapacitaciones = resp.listaCapacitaciones;
      })
      .catch(error => {
        error = true;
      });
  }

  //Evaluación de KPI
  buscarKpiCumplimiento(idPlan: number) {
    this.aprobacionService.buscarKpiCumplimiento(idPlan)
      .then(response => {
        let resp: any = response;
        this.listaKpi = resp;
      })
      .catch(error => {
        error = true;
      });
  }

  collapseKPI(): void {
    this.isKpiCollapsed = !this.isKpiCollapsed;
  }

  evaluarCantidad(kpi: any, valorComprarable: any) {
    if (Number(kpi) <= Number(valorComprarable)) {
      return true;
    } else if (Number(kpi) > Number(valorComprarable)) {
      return false;
    }
  }

  //Apertura Modales

  openSm(content, accion : string, modalOrigen) {
    this.accion = accion;
    if(accion === 'cancelacion' && (this.observacionCancelacion == null || this.observacionCancelacion.trim() === "")){
      this.mensaje = "La observación no puede ser vacía";
      this.errorModal = true;
    }else if(accion === 'rechazar' && (this.observacionRechazo == null || this.observacionRechazo.trim() === "")){
        this.mensaje = "La observación no puede ser vacía";
        this.errorModal = true;
    }else if(accion === "actualizacion" && (isNaN(this.realAssistance) || this.realAssistance == 0 || (this.horaCapacitacion === null || this.horaCapacitacion.trim() ==="")
    && this.model === null)) {
      this.mensaje = "No es posible realizar la actualización de la capacitación sin especificar las horas y la fecha de capacitación o sin asigar al menos un asistente.";
      this.errorModal = true;
    }else{
      this.errorModal = false;
      this.modalService.dismissAll(modalOrigen);
      this.modalService.open(content, { size: 'sm' });
    }
  }

  open(content, type, element) {
    this.errorModal = false;
    if(type == "cancel"){
      this.datosCancelacion(element);
    }else if(type == "aprobacion"){
      this.datosModal(element);
      this.realAssistance = 0;
      this.workersRows = [];
      this.model = null;
      this.evidences = [];
    }else if(type == "evidencia"){
      this.listAdjuntos = [];
      this.modCapacitacionId = element
      this.nombreAdjuntos(element);
      
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'})
  }

  //Ejecutar acciones - Modal de Confirmación
  ejecutarAccion(){
    if(this.accion == "cancelacion"){
      this.cancelacionCapacitacion();
    }else if(this.accion == "rechazar"){
      this.cambioEstadoPlan('rechazado');
    }else if(this.accion == "actualizacion"){
      this.guardarInformacion();
    }else if(this.accion == "aprobar"){
      this.cambioEstadoPlan('aprobado')
    }
    this.accion = "";

    this.modalService.dismissAll('Successfully created Goal')
  }

  //Cambio Estado Campos Modal
  changeInput(campo : string, value: string) {
    if(campo == "rechazo"){
      this.observacionRechazo = value;
    }else if(campo == "horaCapacitacion"){
      this.horaCapacitacion = value;
    }else if(campo == "cancelacion"){
      this.observacionCancelacion = value;
    }
  }

  //Obtener datos para modal
  datosModal(capacitaciones: any) {
    this.modCapacitacionId = capacitaciones.capacitacionId;
    this.modNombreCapacitacion = capacitaciones.name;
    this.modIdPlan = capacitaciones.planCapacitacionId;
    this.modPlanCapacitacion = capacitaciones.planCapacitacion;
    this.modNombreContratista = capacitaciones.nombreContratista;
    this.modZona = capacitaciones.zoneDescription;
    this.modCategoria = capacitaciones.categoryDescription;
    this.modFoco = capacitaciones.focoDescription;
    this.modEnfoque = capacitaciones.enfoqueDescription;
    this.modEjecutor = capacitaciones.ejecutorDescription;
    this.modFecha = capacitaciones.fecha;
  }

  datosCancelacion(capacitaciones: any) {
    this.cancCapacitacionId = capacitaciones.capacitacionId;
  }

  //Obtener y Descargar Adjuntos

  nombreAdjuntos(capacitacion : number){
    this.aprobacionService.getArchivosAdjuntos(capacitacion)
      .then(response => {
        this.listAdjuntos = response;
      })
      .catch(error => {
        error = true;
        this.listAdjuntos = [];
      });
  }

  descargar(adjuntos): void {
    this.aprobacionService.getDownloadFile(this.modCapacitacionId, adjuntos)
    .subscribe(blob => saveAs(blob, adjuntos));
  }

    //ACCIONES - Cancelación Capacitacion
  cancelacionCapacitacion() {
    this.aprobacionService.cancelacionCapacitacion(this.cancCapacitacionId, this.observacionCancelacion, sessionStorage.getItem('userid'))
      .then(response => {
        this.buscarCapacitacionesFiltradas();
      })
      .catch(error => {
        this.error = true;
        this.mensaje = "Ha ocurrido un error en la inserción, comuniquese con el administrador";
      });
    setTimeout(function(){
      document.getElementById("divMensaje").style.display = 'none';
    },5000)
  }
  
 //Sort elementos de la tabla
  sort(headerName: string) {

    if (this.orderHeader === headerName) {
      this.reverse = !this.reverse;
    }else{
      this.orderHeader = headerName
    }
  
    if (headerName === "planCapacitacionId") {
      this.planIdHabilitado = true;
      this.planHabilitado = this.capacitacionHabilitado = this.contratistaHabilitado = this.zonaHabilitado = this.categoriaHabilitado =
        this.focoHabilitado = this.enfoqueHabilitado = this.ejecutorHabilitado = this.fechaHabilitado = false;
    } else if (headerName === "planCapacitacion") {
      this.planHabilitado = true;
      this.planIdHabilitado = this.capacitacionHabilitado = this.contratistaHabilitado = this.zonaHabilitado = this.categoriaHabilitado =
        this.focoHabilitado = this.enfoqueHabilitado = this.ejecutorHabilitado = this.fechaHabilitado = false;
    } else if (headerName === "name") {
      this.capacitacionHabilitado = true;
      this.planIdHabilitado = this.planHabilitado = this.contratistaHabilitado = this.zonaHabilitado = this.categoriaHabilitado =
        this.focoHabilitado = this.enfoqueHabilitado = this.ejecutorHabilitado = this.fechaHabilitado = false;
    } else if (headerName === "nombreContratista") {
      this.contratistaHabilitado = true;
      this.planIdHabilitado = this.planHabilitado = this.capacitacionHabilitado = this.zonaHabilitado = this.categoriaHabilitado =
        this.focoHabilitado = this.enfoqueHabilitado = this.ejecutorHabilitado = this.fechaHabilitado = false;
    } else if (headerName === "zoneDescription") {
      this.zonaHabilitado = true;
      this.planIdHabilitado = this.planHabilitado = this.capacitacionHabilitado = this.contratistaHabilitado = this.categoriaHabilitado =
        this.focoHabilitado = this.enfoqueHabilitado = this.ejecutorHabilitado = this.fechaHabilitado = false;
    } else if (headerName === "categoryDescription") {
      this.categoriaHabilitado = true;
      this.planIdHabilitado = this.planHabilitado = this.capacitacionHabilitado = this.contratistaHabilitado = this.zonaHabilitado =
        this.focoHabilitado = this.enfoqueHabilitado = this.ejecutorHabilitado = this.fechaHabilitado = false;
    } else if (headerName === "focoDescription") {
      this.focoHabilitado = true;
      this.planIdHabilitado = this.planHabilitado = this.capacitacionHabilitado = this.contratistaHabilitado = this.zonaHabilitado = this.categoriaHabilitado =
        this.enfoqueHabilitado = this.ejecutorHabilitado = this.fechaHabilitado = false;
    } else if (headerName === "enfoqueDescription") {
      this.enfoqueHabilitado = true;
      this.planIdHabilitado = this.planHabilitado = this.capacitacionHabilitado = this.contratistaHabilitado = this.zonaHabilitado = this.categoriaHabilitado =
        this.focoHabilitado = this.ejecutorHabilitado = this.fechaHabilitado = false;
    } else if (headerName === "ejecutorDescription") {
      this.ejecutorHabilitado = true;
      this.planIdHabilitado = this.planHabilitado = this.capacitacionHabilitado = this.contratistaHabilitado = this.zonaHabilitado = this.categoriaHabilitado =
        this.focoHabilitado = this.enfoqueHabilitado = this.fechaHabilitado = false;
    } else if (headerName === "fecha") {
      this.fechaHabilitado = true;
      this.planHabilitado = this.planIdHabilitado = this.contratistaHabilitado = this.capacitacionHabilitado = this.zonaHabilitado = this.categoriaHabilitado =
        this.focoHabilitado = this.enfoqueHabilitado = this.ejecutorHabilitado = false;
    }
  }

  //Acciones Modal de Aprobación de Capacitacion - busqueda de trabajadores y carga de evidencia
  canAssignWorkers(): boolean {
    return true;
  }

  openPronexoModal(modal: any): void {
    const request: JSON = this.modIdPlan as unknown as JSON;
    this.capacitacionSelected = request;
    this.openModal(modal, { size: 'lg' });
  }

  openModal(modal: any, options: any = {}): void {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', ...options });
  }

  onWorkersSelectedChange(workersIdSelected: string[], workersSelected: any[]): void {
    this.workersIdSelected = workersIdSelected;
    this.workersSelected = workersSelected;
    this.workersRows = workersSelected.map(worker => this.buildWokerRow(worker));
    this.realAssistance = this.workersRows.length;
  }

  buildWokerRow(worker: any): any {
    return {
      id: worker.rutTrabajador,
      worker,
      cells: [
        { class: 'td-centered', tooltip: false, content: worker.rutTrabajador },
        { class: 'td-centered', tooltip: false, content: worker.nombreTrabajador },
        { class: 'td-centered', tooltip: false, content: worker.apellidoPaterno },
        { class: 'td-centered', tooltip: false, content: worker.apellidoMaterno }
      ]
    };
  }

  removeWorker(worker: any): void {
    const idIndex = this.workersIdSelected.findIndex(id => id === worker.rutTrabajador);
    const workerIndex = this.workersSelected.findIndex(workerToAdd => workerToAdd.rutTrabajador === worker.rutTrabajador);
    const rowIndex = this.workersRows.findIndex(row => row.id === worker.rutTrabajador);
    this.workersIdSelected.splice(idIndex, 1);
    this.workersSelected.splice(workerIndex, 1);
    this.workersRows.splice(rowIndex, 1);
    this.realAssistance = this.workersRows.length;
  }

  uploadFile(event, formDirective: FormGroupDirective, archivo) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      evidenceFile: file
    });
    this.form.get('evidenceFile').updateValueAndValidity()
    if (this.form.value.evidenceFile != null) {
      const formData = new FormData();
      formData.append('file', this.form.value.evidenceFile, this.form.value.evidenceFile.name);
      formDirective.resetForm();
      this.form.reset();
      let cap = 0;
      this.evidenciaService.uploadTemp(this.uuid == "" ? null : this.uuid, formData).then((data: any) => {
        this.uuid = data.resultado;
        this.idsAdjuntos.push(this.uuid);
        this.fetchEvidenciaTemp();
      }).catch((error) => {
        this.errorMessage = error.error.message.includes("Maximum upload size exceeded") ? 'Error al guardar, archivo excede el límite definido.' : 'Error';
      });
    } else {
      this.error = true;
      this.errorMessage = 'Error al guardar, debe ingresar un archivo.'
    }
    archivo.value = "";

  }

  fetchEvidenciaTemp(): void {
    this.evidenciaService.listTemp(this.uuid)
      .then(evidencias => {
        this.evidences = evidencias.evidencias;
        if (this.evidences.length > 0) {
          this.listClass = true;
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  calculeSvgIcon(file: string) {
    const fileExt = file.split(".");
    let svg: string = "";
    switch (fileExt[fileExt.length - 1]) {
      case "jpg":
        svg = 'assets/icons/jpg_format.svg';
        break;
      case "png":
        svg = 'assets/icons/png_format.svg';
        break;
      case "zip":
        svg = 'assets/icons/zip_format.svg';
        break;
      case "rar":
        svg = 'assets/icons/rar_format.svg';
        break;
      case "ppt":
        svg = 'assets/icons/ppt_format.svg';
        break;
      case "pptx":
        svg = 'assets/icons/ppt_format.svg';
        break;
      case "pdf":
        svg = 'assets/icons/pdf_format.svg';
        break;
      case "xls":
        svg = 'assets/icons/excel_black.svg';
        break;
      case "xlsx":
        svg = 'assets/icons/excel_black.svg';
        break;
      case "doc":
        svg = 'assets/icons/word.svg';
        break;
      case "docx":
        svg = 'assets/icons/word.svg';
        break;
      default:
        svg = 'assets/icons/text_format.svg';
        break;
    }
    return svg;
  }

  downloadFile(id: number, name: string): void {
    this.evidenciaService.downloadFile(id, name);
  }

  deleteFile(id: number): void {
    this.evidenciaService.delete(id).then(res => {
      this.fetchEvidenciaTemp();
    })
      .catch(error => console.error(error));
  }

  guardarInformacion(){
    this.updateCapacitacion();
  }

  saveEvidence(url : string) {
      this.evidenciaService.saveTemp(url, this.modCapacitacionId).then((data) => {
      }).catch((error) => {
        console.log(error);
      });
  }

  updateCapacitacion(): void {
    this.aprobacionService.updateCapacitacion(this.modCapacitacionId, this.horaCapacitacion, String(this.model),
       this.workersIdSelected, this.modFecha)
      .then(response => {
         for(let url of this.idsAdjuntos){
          this.saveEvidence(url);
         }
         this.buscarCapacitacionesFiltradas();
      })
      .catch(error => {
        error = true;
      });
  }
  
}

