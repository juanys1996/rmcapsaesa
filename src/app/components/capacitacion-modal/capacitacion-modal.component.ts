import { Component, EventEmitter, Input, OnInit, Output, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { FormBuilder, FormGroup, FormGroupDirective } from "@angular/forms";
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { CapacitacionService } from '../../services/capacitacion.service';
import { ComboBuilderService } from '../../services/combo-builder.service';
import { ValidationService } from '../../services/validation.service';
import { EvidenciaService } from '../../services/evidencia.service';
import {
  EJECUTOR_OTHERS_ID,
  PLANIFICADA_ID,
  REFORZAMIENTO_ID,
  MONTHS,
  CERRADA_STATE,
  APROBADA_STATE,
  PENDIENTE_STATE,
  PENDIENTE_CON_RETRASO_STATE
} from '../../utils/constants';
import { stream } from 'xlsx/types';
import { ToastrService } from 'ngx-toastr';
import { ZoneService } from 'src/app/services/zone.service';

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
  selector: 'app-capacitacion-modal',
  templateUrl: './capacitacion-modal.component.html',
  styleUrls: ['./capacitacion-modal.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class CapacitacionModalComponent implements OnInit {
  model: NgbDateStruct;
  @Output() save: EventEmitter<void> = new EventEmitter<void>();
  @Output() accept: EventEmitter<any> = new EventEmitter<any>();
  @Output() reject: EventEmitter<void> = new EventEmitter<void>();
  @Input() modal: any;
  @Input() mode: string;
  @Input() enfoques: { enfoqueId: number, enfoqueDescription: string }[] = [];
  @Input() categoriesWithFocos: {
    categoryId: number,
    categoryDescription: string,
    focos: { focoId: number, focoDescription: string }[]
  }[] = [];
  @Input() zonas: {
    zoneId: number; descripcion: string;
  }[] = [];
  @Input() ejecutoresWithRelatores: {
    ejecutorId: number,
    ejecutorDescription: string,
    relatores: { relatorId: number, relatorDescription: string }[]
  }[] = [];
  @Input() capacitacion: {
    capacitacionId: number,
    capacitacionTypeId: number,
    name: string,
    categoryId: number,
    categoryDescription: string,
    focoId: number,
    focoDescription: string,
    enfoqueId: number,
    enfoqueDescription: string,
    zone: string,
    observation: string,
    ejecutorId: number,
    ejecutorDescription: string,
    ejecutorOthers: string,
    relatorId: number,
    relatorDescription: string,
    month: string,
    year: string,
    estimatedTheoryHours: number,
    estimatedPracticeHours: number,
    estimatedHours: number,
    realTheoryHours: number,
    realPracticeHours: number,
    realHours: number,
    estimatedAssistants: number,
    realAssistants: number,
    realExecutionDate: string,
    stateId: number,
    stateShortDescription: string,
    creationDate: string,
    userId: string,
    fecha : string

  } = {
      capacitacionId: null,
      capacitacionTypeId: 1,
      name: null,
      categoryId: -1,
      categoryDescription: '',
      focoId: -1,
      focoDescription: '',
      enfoqueId: -1,
      enfoqueDescription: '',
      zone: "-1",
      observation: null,
      ejecutorId: -1,
      ejecutorDescription: '',
      ejecutorOthers: null,
      relatorId: -1,
      relatorDescription: '',
      month: '-1',
      year: '2020',
      estimatedTheoryHours: null,
      estimatedPracticeHours: null,
      estimatedHours: 0,
      realTheoryHours: null,
      realPracticeHours: null,
      realHours: 0,
      estimatedAssistants: null,
      realAssistants: null,
      realExecutionDate: null,
      stateId: null,
      stateShortDescription: '',
      creationDate: null,
      userId: sessionStorage.getItem('userid'),
      fecha : ''
    };
  errors = {
    name: false,
    categoryId: false,
    focoId: false,
    enfoqueId: false,
    ejecutorId: false,
    zoneId: false,
    ejecutorOthers: false,
    relatorId: false,
    month: false,
    year: false,
    estimatedTheoryHours: false,
    estimatedPracticeHours: false,
    estimatedHours: false,
    realTheoryHours: false,
    realPracticeHours: false,
    realHours: false,
    fechaCapacitacion : false,
    estimatedAssistants: false,
    realAssistants: false,
    realExecutionDate: false,
    observation: false,
    realEvidence: false
  };
  flags = {
    ejecutor: false,
    relator: false,
    duracionTeorica: false,
    duracionPractica: false,
    duracionReal : false,
    fechaEjecucionReal: false,
    Evidencia: false,
    AsignacionParticipantes: false,
    Guardar: false
  }
  isRead = false;
  showBar = false;
  isReadOnEdit = false;
  focoCombo: { focoId: number, focoDescription: string }[] = [];
  relatorCombo: { relatorId: number, relatorDescription: string }[] = [];
  monthsCombo: { label: string, valueStr: string, valueInt: number }[] = [];
  zoneCombo: any;
  ejecutorOthersId = EJECUTOR_OTHERS_ID;
  showErrorMessage = false;
  showEvidenceMessage = false;
  realExecutionDateErrorMessage: string;
  confirmationModalTittle: string;
  confirmationModalMessage: string;
  confirmationModalHasComment = false;
  confirmationModalHasOptions = false;
  @Input() confirmationModalOptionLabel: string;
  @Input() confirmationModalOptions: { label: string, value: any }[];
  confirmationModalAccept: any;
  confirmationModalisCommentObligatory = false;
  actionComment: string;
  actionOption: any;
  @Input() workersIdSelected: string[] = [];
  @Input() workersSelected = [];
  workersColumns = [
    'Rut Trabajador',
    'Nombre',
    'Apellido Paterno',
    'Apellido Materno'
  ];
  workersRows = [];
  rolid: any = sessionStorage.getItem('rolid');
  year: number = new Date().getFullYear();
  yearMax: number = this.year + 4;
  loading = false;
  evidences: any = [];
  fileData: File = null;
  form: FormGroup;
  error: boolean = false;
  errorMessage: string = "";
  listClass: boolean = false;
  zona: any;
  flagZona: boolean = false;
  uuid: string = "";
  constructor(
    private modalService: NgbModal,
    private capacitacionService: CapacitacionService,
    private comboBuilderService: ComboBuilderService,
    private validationService: ValidationService,
    private evidenciaService: EvidenciaService,
    public fb: FormBuilder,
    private toastr: ToastrService,
    private zoneService: ZoneService,
  ) {
    this.form = this.fb.group({
      evidenceFile: [null]
    })
  }

  ngOnInit() {

    this.isRead = this.mode === 'read';
    if (this.mode == 'planificar' || this.mode == 'reforzamiento')
      this.capacitacion.capacitacionTypeId =
        this.mode === 'planificar' ? PLANIFICADA_ID : REFORZAMIENTO_ID;

    if (this.mode !== 'edit' && this.mode !== 'read' && this.rolid != 1) {
      this.capacitacion.capacitacionTypeId = this.mode === 'planificar' ? PLANIFICADA_ID : REFORZAMIENTO_ID;

      //Solucion momentanea a problema de año de planificación, toma el valor del año inicial configurado
      const loginData = JSON.parse(sessionStorage.getItem('loginData'))
      const fechaPlanificacion = loginData.configurationTableEntity.filter((x) => x.codigo == "FECHA_PLAN");
      if (!(fechaPlanificacion[0] === undefined)) {
        const fechaInicio = new Date(fechaPlanificacion[0].inicioDate);
        this.capacitacion.year = this.mode === 'planificar' ? ((fechaInicio.getFullYear()) + 1).toString() : moment().year().toString();
      }
      // lo que está en el else se debe dejar una vez desarrollada solucion a configuración año de planificacion
      else this.capacitacion.year = this.mode === 'planificar' ? (moment().year() + 1).toString() : moment().year().toString();
    }
    if (this.capacitacion.categoryId !== -1) {
      this.focoCombo = this.getFocos(this.capacitacion.categoryId);
    }
    if (this.capacitacion.ejecutorId !== -1) {
      this.relatorCombo = this.getRelatores(this.capacitacion.ejecutorId);
    }
    
    this.capacitacion.realHours = 0;

    this.monthsCombo = this.comboBuilderService.buildMonthsCombo();
    this.workersRows = this.workersSelected.map(worker => this.buildWokerRow(worker));
    this.capacitacion.realAssistants = this.workersRows.length;
    if (this.capacitacion.capacitacionTypeId === REFORZAMIENTO_ID) this.capacitacion.estimatedAssistants = 0;
  
    this.canEditOnApprove();
    //this.showBar = this.showAcceptRejectBar(this.capacitacion);

    this.fetchEvidencia();


  }

  getLabel(value: any, defaultValue: string): any {
    return value ? value.toString() : defaultValue;
  }

  // isIconActive(icon: string, capacitacion: any): boolean {
  //   return this.validationService.isActiveIcon(icon, capacitacion);
  // }

  isIconActiveSend(capacitacion: any): boolean {
    return this.validationService.isActiveIconSend(capacitacion);
  }

  isIconActiveDelete(capacitacion: any): boolean {
    return this.validationService.isActiveIconDelete(capacitacion);
  }

  isIconActiveEdit(capacitacion: any): boolean {
    return this.validationService.isActiveIconEdit(capacitacion);
  }

  isIconActiveAccept(capacitacion: any): boolean {
    //return this.validationService.isActiveIconAccept(capacitacion);

    return (this.validationService.canAcceptOrReject(capacitacion) || this.validationService.canClose(capacitacion));
  }

  isIconActiveReject(capacitacion: any): boolean {
    return this.validationService.isActiveIconReject(capacitacion);
  }

  showAcceptRejectBar(capacitacion: any): boolean {
    return this.isIconActiveReject(capacitacion) || this.isIconActiveAccept(capacitacion);
  }

  canAssignWorkers(): boolean {
    return !this.isRead && this.validationService.canAssignWorkers(this.capacitacion);
  }

  canEditCapacitacion(): boolean {
    //return !this.isReadOnEdit && this.validationService.canEdit(this.capacitacion);
    return this.validationService.canEdit(this.capacitacion);
  }

  onAcceptCapacitacion(isSend: boolean = false): void {
    if (isSend) {
      this.onSave(true);
    } else {
      this.capacitacionService.accept(this.capacitacion.capacitacionId, sessionStorage.getItem('userid'), "0", this.actionComment)
        .then(response => {
          this.accept.emit();
          this.modal.dismiss('accept');
        })
        .catch(error => console.error(error));
    }
  }

  onRejectCapacitacion(): void {
    this.capacitacionService.reject(this.capacitacion.capacitacionId, sessionStorage.getItem('userid'), this.actionOption, this.actionComment)
      .then(response => {
        this.reject.emit();
        this.modal.dismiss('reject');
      })
      .catch(error => console.error(error));
  }

  openAcceptModal(modal: any): void {
    if (this.validationService.canAcceptOrReject(this.capacitacion) || this.validationService.canClose(this.capacitacion)) {
      this.confirmationModalHasComment = true;
      this.confirmationModalHasOptions = false;
      this.confirmationModalisCommentObligatory = false;
      if (this.validationService.canAcceptOrReject(this.capacitacion)) {
        this.confirmationModalTittle = 'Aprobar capacitación';
        this.confirmationModalMessage = `¿Seguro que desea aprobar la capacitación "${this.capacitacion.name}"?`;
      } else {

        if (
          ((this.capacitacion.realHours || 0) > 0 &&
            (this.canAssignWorkers() && (this.capacitacion.realAssistants || 0)) > 0 &&
            this.evidences.length > 0 &&
            this.capacitacion.realExecutionDate)
          || this.capacitacion.capacitacionTypeId == 2) {
          this.confirmationModalTittle = 'Cerrar capacitación';
          this.confirmationModalMessage = `¿Seguro que desea cerrar la capacitación "${this.capacitacion.name}"?`;
          this.confirmationModalHasComment = true;
        }
        else {
          this.toastr.info('Se debe actualizar : Duración Real , Asistentes Reales, Archivos de evidencia y Fecha Ejecución Real antes de cerrar', 'Advertencia');
          return;
        }
        // this.confirmationModalTittle = 'Cerrar capacitación';
        // this.confirmationModalMessage = `¿Seguro que desea cerrar la capacitación "${this.capacitacion.name}"?`;
      }
      this.confirmationModalAccept = (comment, option) => {
        this.actionComment = comment;
        this.actionOption = option;
        this.onAcceptCapacitacion();
      };
      this.openModal(modal);
    }
  }

  openRejectModal(modal: any): void {
    if (this.validationService.canAcceptOrReject(this.capacitacion)) {
      this.confirmationModalHasComment = true;
      this.confirmationModalHasOptions = true;
      this.confirmationModalTittle = 'Rechazar capacitación';
      this.confirmationModalMessage = `¿Seguro que desea rechazar la capacitación "${this.capacitacion.name}"?`;
      this.confirmationModalAccept = (comment, option) => {
        this.actionComment = comment;
        this.actionOption = option;
        this.onRejectCapacitacion();
      };
      this.openModal(modal);
    }
  }

  openSendForAcceptanceModal(modal: any): void {
    if (this.validationService.canSendForAcceptance(this.capacitacion)) {
      this.confirmationModalHasComment = false;
      this.confirmationModalHasOptions = false;
      this.confirmationModalTittle = 'Enviar para aprobación';
      this.confirmationModalMessage = `¿Seguro que desea enviar para aprobación la capacitación "${this.capacitacion.name}"?`;
      this.confirmationModalAccept = () => this.onAcceptCapacitacion(true);
      this.openModal(modal);
    }
  }

  saveAndSend(modal: any): void {
    this.onSave(true);
  }

  openPronexoModal(modal: any): void {
    this.openModal(modal, { size: 'lg' });
  }

  openModal(modal: any, options: any = {}): void {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', ...options });
  }

  changeInput(field: string, value: any, type: string = ''): void {
    if (field === 'categoryId') {
      const categoryId = parseInt(value, 10);
      this.capacitacion.categoryId = categoryId;
      this.capacitacion.focoId = -1;
      this.focoCombo = this.getFocos(categoryId);
    } else if (field === 'year') {
      this.capacitacion.year = value
    } else if (field === 'ejecutorId') {
      const ejecutorId = parseInt(value, 10);
      this.capacitacion.ejecutorId = ejecutorId;
      this.capacitacion.ejecutorOthers = null;
      this.capacitacion.relatorId = -1;
      this.relatorCombo = this.getRelatores(ejecutorId);
    } else if (field === 'zoneId') {
      const zoneId = parseInt(value, 10);
      this.capacitacion.zone = zoneId.toString();
    } else if (type === 'number') {
      this.capacitacion[field] = parseFloat(value);
    } else {
      this.capacitacion[field] = value;
    }
  }

  getFocos(categoryId: number): any {
    let focos = [];
    for (const category of this.categoriesWithFocos) {
      if (category.categoryId === categoryId) {
        focos = category.focos;
        break;
      }
    }
    return focos;
  }




  getRelatores(ejecutorId: number): any {
    let relatores = [];
    for (const ejecutor of this.ejecutoresWithRelatores) {
      if (ejecutor.ejecutorId === ejecutorId) {
        relatores = ejecutor.relatores;
        break;
      }
    }
    return relatores;
  }



  getTotalHours(value1: number, value2: number): number {
    const firstValue = isNaN(value1) ? 0 : value1;
    const secondValue = isNaN(value2) ? 0 : value2;
    return firstValue + secondValue;
  }

  onWorkersSelectedChange(workersIdSelected: string[], workersSelected: any[]): void {
    this.workersIdSelected = workersIdSelected;
    this.workersSelected = workersSelected;
    this.workersRows = workersSelected.map(worker => this.buildWokerRow(worker));
    this.capacitacion.realAssistants = this.workersRows.length;
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

  canEditOnApprove() {

    if (this.validationService.isActiveEditOnApprove(this.capacitacion) && (this.mode == 'edit')) {
      this.isRead = true;
      this.flags.AsignacionParticipantes = true;
      this.flags.Evidencia = true;
      this.flags.duracionPractica = true;
      this.flags.duracionTeorica = true;
      this.flags.duracionReal = true;
      this.flags.ejecutor = true;
      this.flags.fechaEjecucionReal = true;
      this.flags.relator = true;
      this.flags.Guardar = true;
    }
  }

  removeWorker(worker: any): void {
    const idIndex = this.workersIdSelected.findIndex(id => id === worker.rutTrabajador);
    const workerIndex = this.workersSelected.findIndex(workerToAdd => workerToAdd.rutTrabajador === worker.rutTrabajador);
    const rowIndex = this.workersRows.findIndex(row => row.id === worker.rutTrabajador);
    this.workersIdSelected.splice(idIndex, 1);
    this.workersSelected.splice(workerIndex, 1);
    this.workersRows.splice(rowIndex, 1);
    this.capacitacion.realAssistants = this.workersRows.length;
  }

  onSave(send: boolean = false): void {
    this.showErrorMessage = false;
    this.showEvidenceMessage = false;

    if (this.isValid()) {
      if (this.mode === 'edit') {
        this.capacitacionService.update(this.capacitacion, this.capacitacion.capacitacionId, this.workersIdSelected)
          .then(response => {
            if (send) {
              this.onAcceptCapacitacion();
            } else {
              this.save.emit();
              this.modal.dismiss('saved');
            }
          })
          .catch(error => {
            console.error(error);
            this.showErrorMessage = true;
            this.showEvidenceMessage = true;
          });
      } else {
        this.capacitacionService.create(this.capacitacion, this.workersIdSelected)
          .then(response => {
            this.capacitacion.capacitacionId = Number(response);
            if (send) {
              this.onAcceptCapacitacion();
            }
            else {
              this.save.emit();
              this.modal.dismiss('created');
            }
            this.saveEvidence();
          })
          .catch(error => {
            this.showErrorMessage = true;
            console.error(error);
          });
      }
    }
  }


  isValid(): boolean {
    let isValid = true;

    const isNameValid = this.capacitacion.name && this.capacitacion.name.length <= 100;
    isValid = isValid ? isNameValid : false;
    this.errors.name = !isNameValid;

    const isCategoryIdValid = this.capacitacion.categoryId !== -1;
    isValid = isValid ? isCategoryIdValid : false;
    this.errors.categoryId = !isCategoryIdValid;

    const isFocoIdValid = this.capacitacion.focoId !== -1;
    isValid = isValid ? isFocoIdValid : false;
    this.errors.focoId = !isFocoIdValid;

    const isEnfoqueValid = this.capacitacion.enfoqueId !== -1;
    isValid = isValid ? isEnfoqueValid : false;
    this.errors.enfoqueId = !isEnfoqueValid;

    const isEjecutorIdValid = this.capacitacion.ejecutorId !== -1;
    isValid = isValid ? isEjecutorIdValid : false;
    this.errors.ejecutorId = !isEjecutorIdValid;

    if (this.capacitacion.ejecutorId == 4) {
      if (this.capacitacion.ejecutorOthers == null || this.capacitacion.ejecutorOthers == '') {
        const isEjecutorOthersValid = false
        isValid = isValid ? isEjecutorOthersValid : false;
        this.errors.ejecutorOthers = !isEjecutorOthersValid;
      } else {
        const isEjecutorOthersValid = this.capacitacion.ejecutorOthers.substring(0, 1) != ' ';
        isValid = isValid ? isEjecutorOthersValid : false;
        this.errors.ejecutorOthers = !isEjecutorOthersValid;
      }
    } else {
      const isEjecutorOthersValid = this.capacitacion.ejecutorOthers == null || this.capacitacion.ejecutorOthers.length <= 100;
      isValid = isValid ? isEjecutorOthersValid : false;
      this.errors.ejecutorOthers = !isEjecutorOthersValid;
    }

    const isRelatorIdValid = this.capacitacion.relatorId !== -1;
    isValid = isValid ? isRelatorIdValid : false;
    this.errors.relatorId = !isRelatorIdValid;
    

    const isRealHoursValid = this.capacitacion.realHours > 0 && this.capacitacion.realHours > 0.5;
    isValid = isValid ? isRealHoursValid : false;
    this.errors.realHours = !isRealHoursValid;

    const isEstimatedAssistantsValid = this.capacitacion.capacitacionTypeId === REFORZAMIENTO_ID || (this.capacitacion.capacitacionTypeId === PLANIFICADA_ID && this.capacitacion.estimatedAssistants !== null && (0 < this.capacitacion.estimatedAssistants && this.capacitacion.estimatedAssistants.toString().length <= 4));
    isValid = isValid ? isEstimatedAssistantsValid : false;
    this.errors.estimatedAssistants = !isEstimatedAssistantsValid;

    //al guardar en modo editar no debe validar, solo guardar los cambios ::TODO
    if (this.mode != 'edit') {
      if (this.capacitacion.stateId == CERRADA_STATE || this.capacitacion.stateId == APROBADA_STATE
        || this.capacitacion.stateId == PENDIENTE_STATE || this.capacitacion.stateId == PENDIENTE_CON_RETRASO_STATE) {
        const isRealAssistantsValid = this.capacitacion.capacitacionTypeId == REFORZAMIENTO_ID || (this.capacitacion.realAssistants == null || (this.capacitacion.realAssistants > 0 && this.capacitacion.realAssistants.toString().length <= 4));
        isValid = isValid ? isRealAssistantsValid : false;
        this.errors.realAssistants = !isRealAssistantsValid;

        const cantidadEvidencias = this.capacitacion.capacitacionTypeId == REFORZAMIENTO_ID || this.listClass
        isValid = isValid ? cantidadEvidencias : false;
        this.errors.realEvidence = !cantidadEvidencias;
      }
    }

    const isRealExecutionDateValid = this.capacitacion.realExecutionDate == null || this.isValidExecutionDate(this.capacitacion.realExecutionDate);
    isValid = isValid ? isRealExecutionDateValid : false;
    this.errors.realExecutionDate = !isRealExecutionDateValid;

    const isObservationValid = !this.capacitacion.observation || this.capacitacion.observation.length < 500;
    isValid = isValid ? isObservationValid : false;
    this.errors.observation = !isObservationValid;

    const isZonaValid = this.capacitacion.zone != '-1';
    isValid = isValid ? isZonaValid : false;
    this.errors.zoneId = !isZonaValid;

    const isFechaValid = this.model != null;
    isValid = isValid ? isFechaValid : false;
    this.errors.fechaCapacitacion = !isFechaValid;

    if(isFechaValid){
      this.capacitacion.fecha = String(this.model);
    }
    
    return isValid;
  }

  isValidExecutionDate(value: string): boolean {
    const date = moment(value, 'DD/MM/YYYY');

    if (!this.isValidDateFormat(value) || !date.isValid()) {
      this.realExecutionDateErrorMessage = 'Fecha invalida';
      return false;
    }
    if (this.capacitacion.capacitacionTypeId === REFORZAMIENTO_ID) {
      if (date.year() !== moment().year()) {
        this.realExecutionDateErrorMessage = 'En año actual';
        return false;
      }
    }
    if (this.capacitacion.capacitacionTypeId === PLANIFICADA_ID) {

      if (parseInt(date.year().toString()) < parseInt(this.capacitacion.year)) {
        this.realExecutionDateErrorMessage = 'mayor o igual al año planificado';
        return false;
      }

      if (this.capacitacion.realExecutionDate.substring(3,10) < (this.capacitacion.month + '/' + this.capacitacion.year) && (this.rolid != 1)){
        this.realExecutionDateErrorMessage = 'Posterior a fecha de creación';
        return false;
      }

      if(this.capacitacion.realExecutionDate.substring(3,10) == (this.capacitacion.month + '/' + this.capacitacion.year) && (this.rolid != 1)){
        return true;
      }
    }
    return true;
  }

  isValidDateFormat(value: string): boolean {
    const parts = value.split('/');
    return parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4;
  }
  getMonthLabel(id: number): string {
    return MONTHS[id - 1].label;
  }
  getZonas(): any {
    return new Promise((resolve, reject) => {
      this.zoneService.getZonas()
        .then(response => {
          this.zonas = response
          if (this.zonas.length == 1) {
            this.flagZona = true;
            this.capacitacion.zone = this.zonas[0].zoneId.toString();
          }
        })
        .catch(error => reject(error));
    });
  }
  getZoneLabel(id: number): string {
    let descripcion
    this.zonas.forEach(element => {
      if (element.zoneId == id) {
        descripcion = element.descripcion
      }
    });
    return descripcion;
  }

  fetchEvidencia(): void {
    this.evidenciaService.list(this.uuid ? this.uuid : this.capacitacion.capacitacionId)
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

  fetchEvidenciaTemp(): void {
    this.evidenciaService.listTemp(this.uuid ? this.uuid : this.capacitacion.capacitacionId)
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

  deleteFile(id: number): void {
    this.evidenciaService.delete(id).then(res => {
      this.fetchEvidencia();
      this.fetchEvidenciaTemp();
    })
      .catch(error => console.error(error));
  }

  downloadFile(id: number, name: string): void {
    this.evidenciaService.downloadFile(id, name);
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
      try {
        cap = this.capacitacion.capacitacionId
      }
      catch (error) {
        console.log("error cap: " + error)
      }

      if (cap != 0 && cap != null) {
        this.evidenciaService.upload(this.capacitacion.capacitacionId, formData).then((data) => {
          this.fetchEvidencia();
        }).catch((error) => {
          this.errorMessage = error.error.message.includes("Maximum upload size exceeded") ? 'Error al guardar, archivo excede el límite definido.' : 'Error';
        });
      }
      else {
        this.evidenciaService.uploadTemp(this.uuid == "" ? null : this.uuid, formData).then((data: any) => {
          this.uuid = data.resultado;
          //this.fetchEvidencia();
          this.fetchEvidenciaTemp();
        }).catch((error) => {
          this.errorMessage = error.error.message.includes("Maximum upload size exceeded") ? 'Error al guardar, archivo excede el límite definido.' : 'Error';
        });
      }

    } else {
      this.error = true;
      this.errorMessage = 'Error al guardar, debe ingresar un archivo.'
    }

    archivo.value = "";
  }

  saveEvidence() {
    if (this.uuid != "") {
      this.evidenciaService.saveTemp(this.uuid, this.capacitacion.capacitacionId).then((data) => {
        
      }).catch((error) => {
        console.log(error);
      });
    }
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
  estadoCerrada(): boolean {
    if (this.capacitacion.stateId == 5) {
      return false
    } else {
      return true
    }
  }
}
