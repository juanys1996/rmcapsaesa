import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RutUtils } from '@roddyvitali/rut-utils'
import { IsValid } from '@roddyvitali/rut-utils'
import { CapacitacionService } from '../../services/capacitacion.service';
import { ComboBuilderService } from '../../services/combo-builder.service';
import { ValidationService } from '../../services/validation.service';
import { EvidenciaService } from '../../services/evidencia.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import * as sha512 from 'js-sha512';
import {
  EJECUTOR_OTHERS_ID,
  PLANIFICADA_ID,
  REFORZAMIENTO_ID,
  MONTHS,
  CERRADA_STATE,
  APROBADA_STATE,
  PENDIENTE_STATE,
  PENDIENTE_CON_RETRASO_STATE,
  ESPECIALES
} from '../../utils/constants';
import { stream } from 'xlsx/types';
import { ToastrService } from 'ngx-toastr';
import { ZoneService } from 'src/app/services/zone.service';
import { UserService } from 'src/app/services/user.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
  @Output() createEdit: EventEmitter<void> = new EventEmitter<void>();
  @Output() accept: EventEmitter<any> = new EventEmitter<any>();
  @Output() reject: EventEmitter<void> = new EventEmitter<void>();
  @Input() modal: any;
  @Input() mode: string;
  @Input() enfoques: { enfoqueId: number, enfoqueDescription: string }[] = [];
  @Input() categoriesWithFocos: {
    rolid: number,
    categoryDescription: string,
    focos: { focoId: number, focoDescription: string }[]
  }[] = [];
  @Input() zonas: {
    zoneId: number; descripcion: string;
  }[] = [];
  @Input() userZonas: {
    zoneId: number; descripcion: string;
  }[] = [];
  @Input() ejecutoresWithRelatores: {
    ejecutorId: number,
    ejecutorDescription: string,
    relatores: { relatorId: number, relatorDescription: string }[]
  }[] = [];
  @Input() users: any;
  @Input() usuario: {
    userId: number,
    rolId: number,
    userName: string,
    password: string,
    email: string,
    rut_trabajador: string,
    nombre_trabajador: string,
    apellido_paterno: string,
    apellido_materno: string,
    estado: boolean,
    rut_empresa: string,
    nombre_empresa: string,
    cargo: string,
    proceso: string,
    gerencia: string,
    idEmpresa: string
  } = {
      userId: null,
      rolId: null,
      userName: '',
      password: '',
      email: '',
      rut_trabajador: '',
      nombre_trabajador: '',
      apellido_paterno: '',
      apellido_materno: '',
      estado: true,
      rut_empresa: '',
      nombre_empresa: '',
      cargo: '',
      proceso: '',
      gerencia: '',
      idEmpresa: ''
    };
  errors = {
    zona: false,
    rut_trabajador: false,
    userName: false,
    rut_empresa: false,
    estado: false,
    password: false,
    email: false,
    name: false,
    rolId: false,
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
    fechaEjecucionReal: false,
    Evidencia: false,
    AsignacionParticipantes: false,
    Guardar: false
  };
  isRead = false;
  flagPassword = false;
  showBar = false;
  isReadOnEdit = false;
  focoCombo: { focoId: number, focoDescription: string }[] = [];
  relatorCombo: { relatorId: number, relatorDescription: string }[] = [];
  monthsCombo: { label: string, valueStr: string, valueInt: number }[] = [];
  zoneCombo: any;
  ejecutorOthersId = EJECUTOR_OTHERS_ID;
  showErrorMessage = false;
  showErrorMessageRepeated = false;
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
  usersEnteprise: any[];
  form: FormGroup;
  error = false;
  errorMessage = '';
  listClass = false;
  zona: any;
  flagZona = false;
  selectedIdZone: any = null;
  listaEmpresas : any = [];
  constructor(
    private modalService: NgbModal,
    private capacitacionService: CapacitacionService,
    private comboBuilderService: ComboBuilderService,
    private validationService: ValidationService,
    private evidenciaService: EvidenciaService,
    public fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private zoneService: ZoneService,
    private empresasService : EmpresasService
  ) {
    this.form = this.fb.group({
      evidenceFile: [null]
    });
  }

  ngOnInit() {
    this.obtenerEmpresas();
    this.usersEnteprise = this.users.filter(x => x.usuario.roleId == 2);
    if (this.mode == 'Editar') {
      this.usuario.idEmpresa = this.usuario.idEmpresa == undefined ? this.usersEnteprise[0].usuario.userId : this.usuario.idEmpresa;
    } else {
      this.usuario.idEmpresa = this.usersEnteprise[0].usuario.userId;
    }
    this.selectedIdZone = this.userZonas.length > 0 ? Object.values(this.userZonas).map(value => value.zoneId) : [];
  }

  obtenerEmpresas(){
    this.empresasService.obtenerEmpresas()
      .then(response => {
        this.listaEmpresas = response;
      })
      .catch(error => {
        error = true;
      });
  }

  getLabel(value: any, defaultValue: string): any {
    return value ? value.toString() : defaultValue;
  }

  changeInput(field: string, value: any, type: string = ''): void {
    if (field === 'rolid') {
      const rolid = parseInt(value, 10);
      this.usuario.rolId = rolid;
    }
    if (field === 'estadoId') {
      if (value === 'true') {
        this.usuario.estado = true;
      } else {
        this.usuario.estado = false;
      }
    }
    if (field === 'password') {

      if (this.mode === 'Editar' && (this.usuario.password != value)) {
        this.flagPassword = true;
      } else {
        this.usuario.password = value;
      }
    }
    this.usuario[field] = value;
  }

  onSave(send: boolean = false): void {
    this.showErrorMessage = false;
    this.showEvidenceMessage = false;
    if (this.isValid()) {
      this.loading = true;
      if (this.mode === 'Editar') {
        const usuario = this.usuario;
        const request: JSON = {
          usuario:
          {
            usuarioId: usuario.userId,
            rolId: usuario.rolId,
            userName: usuario.userName,
            password: this.flagPassword ? sha512.sha512(usuario.password) : usuario.password,
            email: usuario.email,
            rut_trabajador: usuario.rut_trabajador,
            nombre_trabajador: usuario.nombre_trabajador,
            apellido_paterno: usuario.apellido_paterno,
            apellido_materno: usuario.apellido_materno,
            estado: usuario.estado,
            nombre_empresa: usuario.nombre_empresa,
            idEmpresa: usuario.idEmpresa,
            zonas: this.selectedIdZone
          }

        } as unknown as JSON;
        this.userService.update(request, usuario.userId)
          .then(response => {
            if (response == '-1') {
              this.showErrorMessageRepeated = true;
            }
            else {
              this.createEdit.emit();
              this.modal.dismiss('Cancel');
            }
            this.loading = false;
          })
          .catch(error => console.error(error));
      } else {
        const usuario = this.usuario;
        const request: JSON = {
          newUsuario:
          {
            rolId: usuario.rolId,
            userName: usuario.userName,
            password: sha512.sha512(usuario.password),
            email: usuario.email,
            rut_trabajador: usuario.rut_trabajador,
            nombre_trabajador: usuario.nombre_trabajador,
            apellido_paterno: usuario.apellido_paterno,
            apellido_materno: usuario.apellido_materno,
            estado: usuario.estado,
            nombre_empresa: usuario.nombre_empresa,
            idEmpresa: usuario.idEmpresa,
            zonas: this.selectedIdZone
          }
        } as unknown as JSON;
        this.userService.create(request)
          .then(response => {

            if (response == '0') {
              this.showErrorMessageRepeated = true;
            }
            else {
              this.createEdit.emit();
              this.modal.dismiss('Cancel');
            }
            this.loading = false;

            // this.createEdit.emit();
            // this.loading = false;
            // this.modal.dismiss('Cancel');
          })
          .catch(error => console.error(error));
      }
    }
  }

  isValid(): boolean {
    let isValid = true;

    const isNameValid = this.usuario.userName && this.usuario.userName.length <= 50
      && this.isValidUserName(this.usuario.userName);
    isValid = isValid ? isNameValid : false;
    this.errors.name = !isNameValid;

    const isEmailValid = this.usuario.email && this.usuario.email.length <= 100 && this.usuario.email.includes('@')
      && this.usuario.email.includes('.') && this.isValidUserName(this.usuario.email);
    isValid = isValid ? isEmailValid : false;
    this.errors.email = !isEmailValid;

    const isPasswordValid = this.usuario.password.length >= 6 && this.usuario.password.length <= 128;
    isValid = isValid ? isPasswordValid : false;
    this.errors.password = !isPasswordValid;

    const isRolIdValid = this.usuario.rolId != null;
    isValid = isValid ? isRolIdValid : false;
    this.errors.rolId = !isRolIdValid;
    
    const isZonaValid = this.selectedIdZone != null && this.selectedIdZone != '';
    isValid = isValid ? isZonaValid : false;
    this.errors.zona = !isZonaValid;

    const isRutTrabajadorValid = (IsValid(this.usuario.rut_trabajador) && this.usuario.rut_trabajador.length >= 11) || this.usuario.rut_trabajador == '';
    isValid = isValid ? isRutTrabajadorValid : false;
    this.errors.rut_trabajador = !isRutTrabajadorValid;

    if (this.mode == 'Editar') {
      const isEstadoIdValid = this.usuario.estado != null;
      isValid = isValid ? isEstadoIdValid : false;
      this.errors.estado = !isEstadoIdValid;
    }

    return isValid;
  }

  getMonthLabel(id: number): string {
    return MONTHS[id - 1].label;
  }
  getZonas(): any {
    return new Promise((resolve, reject) => {
      this.zoneService.getAllZonas()
        .then(response => {
          this.zonas = response;
        })
        .catch(error => reject(error));
    });
  }
  getUserZonas(): any {
    return new Promise((resolve, reject) => {
      this.zoneService.getZonas()
        .then(response => {
          this.userZonas = response;
          this.getZonas();
        })
        .catch(error => reject(error));
    });
  }

  getUserZonasByUserId(userid: String): any {
    return new Promise((resolve, reject) => {
      this.zoneService.getZonasbyUserId(userid)
        .then(response => {
          this.userZonas = response;
          this.selectedIdZone = this.selectedIdZone.length > 0 ? Object.values(this.userZonas).map(value => value.zoneId) : [];
        })
        .catch(error => reject(error));
    });
  }
  habilitar() {
    if (IsValid(this.usuario.rut_trabajador)) {
      let str = this.usuario.rut_trabajador;
      let resto = str.substring(0, this.usuario.rut_trabajador.length - 1)
      let digitoVerificador = str.substring(this.usuario.rut_trabajador.length - 1);
      if (digitoVerificador == "-") {
        this.usuario.rut_trabajador = ""
      } else {
        this.usuario.rut_trabajador = resto + "-" + digitoVerificador
      }
    } else {

    }
  }
  isValidUserName(campo: string): boolean {
    let isValid = true;

    ESPECIALES.forEach(element => {
      const isNameValid = !campo.includes(element.label);
      isValid = isValid ? isNameValid : false;
    });
    return isValid;
  }
}
