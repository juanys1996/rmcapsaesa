import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventMantenedorFocoService } from 'src/app/services/event-mantenedor-foco.service';
import { FocoService } from 'src/app/services/foco.service';
import { EJECUTOR_OTHERS_ID } from '../../utils/constants';

@Component({
  selector: 'app-foco-modal',
  templateUrl: './foco-modal.component.html',
  styleUrls: ['./foco-modal.component.scss']
})
export class FocoModalComponent implements OnInit {
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
  @Input() categorias: {
    categoryId: number; categoryDescription: string;
  }[] = [];
  @Input() focoCategorias: {
    categoryId: number; categoryDescription: string;
  }[] = [];
  @Input() ejecutoresWithRelatores: {
    ejecutorId: number,
    ejecutorDescription: string,
    relatores: { relatorId: number, relatorDescription: string }[]
  }[] = [];
  @Input() users: any;
  @Input() categoria: {
    focoId: number,
    descripcion: string,
    estado: boolean
  } = {
      focoId: null,
      descripcion: '',
      estado: true
    };
  errors = {
    zona: false,
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
  ultimoId: any;
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
  selectedIdZone: any = null;
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
  constructor(
    public fb: FormBuilder,
    private focoService: FocoService,
    private eventMantenedorFocoService: EventMantenedorFocoService
  ) {
    this.form = this.fb.group({
      evidenceFile: [null]
    });
  }

  ngOnInit() {
    this.getUltimoId();
    this.selectedIdZone = this.focoCategorias.length > 0 ? Object.values(this.focoCategorias).map(value => value.categoryId) : [];
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
          newFoco:
          {
            focoId: categoria.focoId,
            descripcion: categoria.descripcion,
            estado: categoria.estado,
            categorias: this.selectedIdZone
          }
        } as unknown as JSON;
        this.focoService.update(request)
          .then(response => {
            this.createEdit.emit();
            this.eventMantenedorFocoService.refreshTable();
            this.loading = false;
            this.modalCategoria.dismiss('Cancel');
          })
          .catch(error => console.error(error));
      } else {
        const categoria = this.categoria;
        const request: JSON = {
          newFoco:
          {
            focoId: this.ultimoId + 1,
            descripcion: categoria.descripcion,
            estado: categoria.estado,
            categorias: this.selectedIdZone
          }
        } as unknown as JSON;
        this.focoService.create(request)
          .then(response => {
            this.createEdit.emit();
            this.eventMantenedorFocoService.refreshTable();
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
      this.focoService.getUltimoId()
        .then(response => {
          this.ultimoId = response;
        })
        .catch(error => reject(error));
    });
  }
}
