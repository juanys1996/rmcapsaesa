import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventMantenedorRelatorService } from 'src/app/services/event-mantenedor-relator.service';
import { RelatorService } from 'src/app/services/relator.service';
import { EJECUTOR_OTHERS_ID } from '../../utils/constants';

@Component({
  selector: 'app-relator-modal',
  templateUrl: './relator-modal.component.html',
  styleUrls: ['./relator-modal.component.scss']
})
export class RelatorModalComponent implements OnInit {
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
  @Input() ejecutores: {
    ejecutorId: number; ejecutorDescription: string;
  }[] = [];
  @Input() relatorEjecutores: any[] = [];
  @Input() ejecutoresWithRelatores: {
    ejecutorId: number,
    ejecutorDescription: string,
    relatores: { relatorId: number, relatorDescription: string }[]
  }[] = [];
  @Input() users: any;
  @Input() categoria: {
    relatorId: number,
    descripcion: string,
    estado: boolean
  } = {
      relatorId: null,
      descripcion: '',
      estado: true
    };
  errors = {
    estado: false,
    zona: false,
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
  selectedIdZone: any = null;
  confirmationModalMessage: string;
  confirmationModalHasComment = false;
  confirmationModalHasOptions = false;
  @Input() confirmationModalOptionLabel: string;
  @Input() confirmationModalOptions: { label: string, value: any }[];
  confirmationModalAccept: any;
  confirmationModalisCommentObligatory = false;
  actionComment: string;
  actionOption: any;
  ultimoId: any;
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
  constructor(
    public fb: FormBuilder,
    private relatorService: RelatorService,
    private eventMantenedorRelatorService: EventMantenedorRelatorService,
  ) {
    this.form = this.fb.group({
      evidenceFile: [null]
    });
  }

  ngOnInit() {
    this.getUltimoId();
    this.selectedIdZone = this.relatorEjecutores.length > 0 ? Object.values(this.relatorEjecutores).map(value => value.ejecutorId) : [];
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
          newRelator:
          {
            relatorId: categoria.relatorId,
            descripcion: categoria.descripcion,
            estado: categoria.estado,
            ejecutores: this.selectedIdZone
          }
        } as unknown as JSON;
        this.relatorService.update(request)
          .then(response => {
            this.createEdit.emit();
            this.eventMantenedorRelatorService.refreshTable();
            this.loading = false;
            this.modalCategoria.dismiss('Cancel');
          })
          .catch(error => console.error(error));

      } else {
        const categoria = this.categoria;
        const request: JSON = {
          newRelator:
          {
            relatorId: this.ultimoId + 1,
            descripcion: categoria.descripcion,
            estado: categoria.estado,
            ejecutores: this.selectedIdZone
          }
        } as unknown as JSON;
        this.relatorService.create(request)
          .then(response => {
            this.createEdit.emit();
            this.eventMantenedorRelatorService.refreshTable();
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

    const isZonaValid = this.selectedIdZone != null && this.selectedIdZone != '';
    isValid = isValid ? isZonaValid : false;
    this.errors.zona = !isZonaValid;

    return isValid;
  }
  getUltimoId(): any {
    return new Promise((resolve, reject) => {
      this.relatorService.getUltimoId()
        .then(response => {
          this.ultimoId = response;
        })
        .catch(error => reject(error));
    });
  }
}
