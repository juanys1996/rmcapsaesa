import { Component, EventEmitter, Input, OnInit, Output, Injectable, ViewChild } from '@angular/core';
import { NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbCalendar, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventMantenedorCategoriaService } from 'src/app/services/event-mantenedor-categoria.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';


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
  selector: 'app-planificacion-modal',
  templateUrl: './planificacion-modal.component.html',
  styleUrls: ['./planificacion-modal.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class PlanificacionModalComponent implements OnInit {
  modelInicio: NgbDate;
  modelFin: NgbDate;
  @ViewChild('dp1', {static : true}) dp1: NgbDatepicker;
  @ViewChild('dp2', {static : true}) dp2: NgbDatepicker;  
  @Output() createEdit: EventEmitter<void> = new EventEmitter<void>();
  @Output() accept: EventEmitter<any> = new EventEmitter<any>();
  @Output() reject: EventEmitter<void> = new EventEmitter<void>();
  @Input() modalCategoria: any;
  @Input() mode: string;
  @Input() categoria: {
    categoriaId: number,
    codigo : string,
    descripcion: string,
    fechaInicio : string,
    fechaTermino : string,
    empresas : any,
    estado: boolean
  } = {
      categoriaId: null,
      codigo: "",
      descripcion: "",
      fechaInicio: "",
      fechaTermino: "",
      empresas : [],
      estado: true
    };
    @Input() categorias: {
      categoryId: number; categoryDescription: string;
    }[] = [];
  errors = {
    codigo : false,
    descripcion : false,
    fechaInicio : false,
    fechaTermino : false,
    empresa : false,
    estado: false
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
  categoriaCombo: any;
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
  loading = false;
  form: FormGroup;
  error = false;
  errorMessage = '';
  listClass = false;
  flagZona = false;
  selectedIdEmpresa: any;
  empresas : string[] = [];
  startDate: any;
  finishDate: any;

  constructor(
    public fb: FormBuilder,
    private eventMantenedorCategoriaService: EventMantenedorCategoriaService,
    private empresasService : EmpresasService,
    private configurationService : ConfigurationService,
    private ngbCalendar: NgbCalendar, 
    private dateAdapter: NgbDateAdapter<string>
  ) { }

  ngOnInit() { 
    let fi = this.categoria.fechaInicio.split("-");
    let ft = this.categoria.fechaTermino.split("-");
    this.startDate = { year: Number(fi[2]), month: Number(fi[1]), day: Number(fi[0])}
    this.finishDate = { year: Number(ft[2]), month: Number(ft[1]), day: Number(ft[0])}
    this.dp1.focus = this.startDate
    this.obtenerEmpresas();
    this.selectedIdEmpresa = this.categoria.empresas.length > 0 ? Object.values(this.categoria.empresas).map(value => value) : [];
  }

  obtenerEmpresas(){
    this.empresasService.obtenerEmpresas()
      .then(response => {
        this.empresas = response;
        this.empresas.push("Todas")
      })
      .catch(error => {
        error = true;
      });
  }

  getLabel(value: any, defaultValue: string): any {
    return value ? value.toString() : defaultValue;
  }

  changeInput(field: string, value: any, type: string = ''): void {
    if (field === 'estadoId') {
      if (value === 'true') {
        this.categoria.estado = true;
      } else {
        this.categoria.estado = false;
      }
    }
    this.categoria[field] = value;
  }

  onSave(send: boolean = false): void {

    this.showErrorMessage = false;
    this.showEvidenceMessage = false;
    if (this.isValid()) {
      this.loading = true;
      if (this.mode === 'Editar') {
        const categoria = this.categoria;
        const request: JSON = {
          idPlanificacion : categoria.categoriaId,
          codigoPlanificacion: categoria.codigo,
          descripcion: categoria.descripcion,
          fechaInicio: categoria.fechaInicio,
          fechaTermino: categoria.fechaTermino,
          usuarioId : Number(sessionStorage.getItem('userid')),
          empresas: this.categoria.empresas,
          statusPlanificacion : categoria.estado} as unknown as JSON;
        this.configurationService.update(request)
          .then(response => {
            this.createEdit.emit();
            this.eventMantenedorCategoriaService.refreshTable();
            this.loading = false;
            this.modalCategoria.dismiss('Cancel');
          })
          .catch(error => console.error(error));
      } else {
        const categoria = this.categoria;
        const request: JSON = {
          codigoPlanificacion: categoria.codigo,
          descripcion: categoria.descripcion,
          fechaInicio: categoria.fechaInicio,
          fechaTermino: categoria.fechaTermino,
          usuarioId : Number(sessionStorage.getItem('userid')),
          empresas: this.categoria.empresas,} as unknown as JSON;
        this.configurationService.create(request)
          .then(response => {
            this.createEdit.emit();
            this.eventMantenedorCategoriaService.refreshTable();
            this.loading = false;
            this.modalCategoria.dismiss('Cancel');
          })
          .catch(error => console.error(error));
      }
    }
  }

  isValid(): boolean {
    let isValid = true;
    const isCodigoValid = this.categoria.codigo && this.categoria.codigo.length <= 50;
    isValid = isValid ? isCodigoValid : false;
    this.errors.codigo = !isCodigoValid;

    const isDescripcionValid = this.categoria.descripcion && this.categoria.descripcion.length <= 100;
    isValid = isValid ? isDescripcionValid : false;
    this.errors.descripcion = !isDescripcionValid;

    const isFechaInicioValid = this.modelInicio && String(this.modelInicio) != "";
    isValid = isValid ? isFechaInicioValid : false;
    this.errors.fechaInicio = !isFechaInicioValid;

    const isFechaTerminoValid = this.modelFin && String(this.modelFin) != "" && this.modelFin > this.modelInicio;
    isValid = isValid ? isFechaTerminoValid : false;
    this.errors.fechaTermino = !isFechaTerminoValid;

    const isEmpresaValid = this.selectedIdEmpresa && this.selectedIdEmpresa.lenght != 0;
    isValid = isValid ? isEmpresaValid : false;
    this.errors.empresa = !isEmpresaValid;

    if (this.mode == 'Editar') {
      const isEstadoIdValid = this.categoria.estado != null;
      isValid = isValid ? isEstadoIdValid : false;
      this.errors.estado = !isEstadoIdValid;
    }

    if(!this.errors.fechaInicio){
      this.categoria.fechaInicio = String(this.modelInicio)
    }else{
      this.categoria.fechaInicio = "";
    }

    if(!this.errors.fechaTermino){
      this.categoria.fechaTermino = String(this.modelFin)
    }else{
      this.categoria.fechaTermino = "";
    }

    if(!this.errors.empresa ){
      this.categoria.empresas = this.selectedIdEmpresa
    }else{
      this.categoria.empresas = [];
    }

    return isValid;
  }
}
