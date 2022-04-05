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
import * as sha512 from 'js-sha512';
import {
  EJECUTOR_OTHERS_ID,
} from '../../utils/constants';
import { stream } from 'xlsx/types';
import { ToastrService } from 'ngx-toastr';
import { ZoneService } from 'src/app/services/zone.service';
import { UserService } from 'src/app/services/user.service';
import { EventMantenedorZonaService } from 'src/app/services/event-mantenedor-zona.service';
import { CategoryService } from 'src/app/services/category.service';
import { EventMantenedorCategoriaService } from 'src/app/services/event-mantenedor-categoria.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-categoria-modal',
  templateUrl: './categoria-modal.component.html',
  styleUrls: ['./categoria-modal.component.scss']
})
export class CategoriaModalComponent implements OnInit {
  @Output() createEdit: EventEmitter<void> = new EventEmitter<void>();
  @Output() accept: EventEmitter<any> = new EventEmitter<any>();
  @Output() reject: EventEmitter<void> = new EventEmitter<void>();
  @Input() modalCategoria: any;
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
  @Input() categoria: {
    categoriaId: number,
    codigo : string,
    descripcion: string,
    fechaInicio : string,
    fechaTermino : string,
    estado: boolean
  } = {
      categoriaId: null,
      codigo: '',
      descripcion: '',
      fechaInicio: '',
      fechaTermino: '',
      estado: true
    };
  errors = {
    estado: false,
    name: false
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
  categoriaCombo: any;
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
  usersEnteprise: any[];
  form: FormGroup;
  error = false;
  errorMessage = '';
  listClass = false;
  flagZona = false;
  selectedIdEmpresa: any;
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
    private categoriaService: CategoryService,
    private eventMantenedorCategoriaService: EventMantenedorCategoriaService
  ) {
    this.form = this.fb.group({
      evidenceFile: [null]
    });
  }

  ngOnInit() {
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
          categoria:
          {
            categoriaId: categoria.categoriaId,
            descripcion: categoria.descripcion,
            estado: categoria.estado
          }

        } as unknown as JSON;
        this.categoriaService.update(request, categoria.categoriaId)
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
          newCategoria:
          {
            descripcion: categoria.descripcion,
            estado: categoria.estado
          }
        } as unknown as JSON;
        this.categoriaService.create(request)
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

    const isNameValid = this.categoria.descripcion && this.categoria.descripcion.length <= 50;
    isValid = isValid ? isNameValid : false;
    this.errors.name = !isNameValid;

    if (this.mode == 'Editar') {
      const isEstadoIdValid = this.categoria.estado != null;
      isValid = isValid ? isEstadoIdValid : false;
      this.errors.estado = !isEstadoIdValid;
    }

    return isValid;
  }
}
