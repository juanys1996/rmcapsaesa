import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CapacitacionService } from '../../../../services/capacitacion.service';
import { CategoryService } from '../../../../services/category.service';
import { EnfoqueService } from '../../../../services/enfoque.service';
import { EjecutorService } from '../../../../services/ejecutor.service';
import { ValidationService } from '../../../../services/validation.service';
import { ZoneService } from 'src/app/services/zone.service';
import { ToastrService } from 'ngx-toastr';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-capacitaciones-table',
  templateUrl: './capacitaciones-table.component.html',
  styleUrls: ['./capacitaciones-table.component.scss']
})
export class CapacitacionesTableComponent implements OnInit {
  rolid: any = sessionStorage.getItem('rolid');
  @Input() rows: any;
  @Input() searchText: any;
  @Input() page: number;
  @Input() pageSize: number;
  @Input() totalAmmount: number;
  @Input() loading: boolean;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();
  @Output() changeSize: EventEmitter<number> = new EventEmitter<number>();
  sizeOptions = [
    { value: 50, label: '50 por página' },
    { value: 20, label: '20 por página' },
    { value: 10, label: '10 por página' },
  ];
  capacitacionModalMode: string;
  capacitacionSelected: any;
  capacitacionSelectedWorkers: any;
  capacitacionSelectedWorkersIds: any;
  capacitacionIdSelected: number;
  confirmationModalTittle: string;
  confirmationModalMessage: string;
  confirmationModalHasComment = false;
  confirmationModalHasOptions = false;
  confirmationModalisCommentObligatory = false;
  confirmationModalOptionLabel: string;
  confirmationModalOptions: { label: string, value: any }[];
  confirmationModalAccept: any;
  categoriesWithFocos: any;
  enfoques: any;
  zonas: any;
  ejecutoresWithRelatores: any;
  evidencesCount: any;

  constructor(
    private modalService: NgbModal,
    private capacitacionService: CapacitacionService,
    private categoryService: CategoryService,
    private enfoqueService: EnfoqueService,
    private ejecutorService: EjecutorService,
    private validationService: ValidationService,
    private zoneService: ZoneService,
    private evidenciaService: EvidenciaService,
    private toastr: ToastrService,
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit() {
    this.confirmationModalOptionLabel = 'Motivo';
    this.confirmationModalOptions = [
      { label: 'No corresponde a actividad de capacitación', value: 1 },
      { label: 'Actividad fuera del foco', value: 2 },
      { label: 'Actividad no cumple los requerimientos en la forma', value: 3 },
      { label: 'Cancelado', value: 4 },
      { label: 'Actividad fuera del foco', value: 5 }
    ];

    this.categoryService.listWithFocos()
      .then(response => this.categoriesWithFocos = response)
      .catch(error => console.error(error));

    this.enfoqueService.list()
      .then(response => this.enfoques = response)
      .catch(error => console.error(error));

    this.ejecutorService.listWithRelatores()
      .then(response => this.ejecutoresWithRelatores = response)
      .catch(error => console.error(error));

    this.zoneService.getZonas()
      .then(response => this.zonas = response)
      .catch(error => console.error(error));
  }

  onChangePage(page: number): void {
    this.changePage.emit(page);
    this.eventEmitterService.onIndicatorsRefresh();
  }

  onChangeSize(size: number): void {
    this.changeSize.emit(size);
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
    // return this.validationService.isActiveIconAccept( capacitacion);
    return (this.validationService.canAcceptOrReject(capacitacion) || this.validationService.canClose(capacitacion))
  }

  isIconActiveReject(capacitacion: any): boolean {
    return this.validationService.isActiveIconReject(capacitacion);
  }

  onDeleteCapacitacion(): void {
    this.capacitacionService.delete(this.capacitacionIdSelected)
      .then(response => {
        this.onChangePage(this.page);
        
      })
      .catch(error => console.error(error));
  }

  onAcceptCapacitacion(comment: string): void {
    this.capacitacionService.accept(this.capacitacionIdSelected, sessionStorage.getItem('userid'), "0", comment)
      .then(response => {
        this.onChangePage(this.page);
        
      })
      .catch(error => console.error(error));

  }

  onRejectCapacitacion(comment: string, option: any): void {
    this.capacitacionService.reject(this.capacitacionIdSelected, sessionStorage.getItem('userid'), option, comment)
      .then(response => {
        this.onChangePage(this.page);
        
      })
      .catch(error => console.error(error));

  }

  openInformationModal(modal: any, capacitacion: any, workers: any): void {
    this.capacitacionModalMode = 'read';
    this.capacitacionSelected = JSON.parse(JSON.stringify(capacitacion));
    this.capacitacionSelectedWorkers = JSON.parse(JSON.stringify(workers));
    this.capacitacionSelectedWorkersIds = workers.map(worker => worker.rutTrabajador);
    this.openModal(modal, { size: 'lg' });
  }

  openEditionModal(modal: any, capacitacion: any, workers: any): void {
    if (this.validationService.canEdit(capacitacion)) {
      this.capacitacionModalMode = 'edit';
      this.capacitacionSelected = JSON.parse(JSON.stringify(capacitacion));
      this.capacitacionSelectedWorkers = JSON.parse(JSON.stringify(workers));
      this.capacitacionSelectedWorkersIds = workers.map(worker => worker.rutTrabajador);
      this.openModal(modal, { size: 'lg' });
    }
  }

  openDeleteModal(modal: any, capacitacion: any): void {
    if (this.validationService.canDelete(capacitacion)) {
      this.confirmationModalHasComment = false;
      this.confirmationModalHasOptions = false;
      this.confirmationModalisCommentObligatory = false;
      this.capacitacionIdSelected = capacitacion.capacitacionId;
      this.confirmationModalTittle = 'Eliminar capacitación';
      this.confirmationModalMessage = `¿Seguro que desea eliminar la capacitación "${capacitacion.name}"?`;
      this.confirmationModalAccept = this.onDeleteCapacitacion;
      this.openModal(modal);
    }

  }

  openSendForAcceptanceModal(modal: any, capacitacion: any): void {
    if (this.validationService.canSendForAcceptance(capacitacion)) {
      this.confirmationModalHasComment = false;
      this.confirmationModalHasOptions = false;
      this.confirmationModalisCommentObligatory = false;
      this.capacitacionIdSelected = capacitacion.capacitacionId;
      this.confirmationModalTittle = 'Enviar para aprobación';
      this.confirmationModalMessage = `¿Seguro que desea enviar para aprobación la capacitación "${capacitacion.name}"?`;
      this.confirmationModalAccept = this.onAcceptCapacitacion;
      this.openModal(modal);
    }
  }

  async openAcceptModal(modal: any, capacitacion: any, workers: any, editionModal: any): Promise<void> {
    if (this.validationService.canAcceptOrReject(capacitacion) || this.validationService.canClose(capacitacion)) {
      this.confirmationModalHasOptions = false;
      this.confirmationModalisCommentObligatory = false;
      this.capacitacionIdSelected = capacitacion.capacitacionId;
      if (this.validationService.canAcceptOrReject(capacitacion)) {
        this.confirmationModalTittle = 'Aprobar capacitación';
        this.confirmationModalMessage = `¿Seguro que desea aprobar la capacitación "${capacitacion.name}"?`;
        this.confirmationModalHasComment = true;
        this.confirmationModalAccept = this.onAcceptCapacitacion;
        this.openModal(modal);
        return;
      } else {
        this.evidencesCount = 0;
        await this.fetchEvidencia(capacitacion);
        if ((
          (Number.parseInt(capacitacion.realHours) || 0) > 0 &&
          (Number.parseInt(capacitacion.realAssistants) || 0) > 0 &&
          (this.evidencesCount > 0) &&
          //((this.evidencesCount > 0 && capacitacion.roleId == 3) || capacitacion.roleId != 3) && Valida evidencias solo para contratistas
          capacitacion.realExecutionDate
          ) || capacitacion.capacitacionTypeId == 2) {
          this.confirmationModalTittle = 'Cerrar capacitación';
          this.confirmationModalMessage = `¿Seguro que desea cerrar la capacitación "${capacitacion.name}"?`;
          this.confirmationModalHasComment = true;
          this.confirmationModalAccept = this.onAcceptCapacitacion;
          this.openModal(modal);
          return;
        }
        else {
          if (this.validationService.canEdit(capacitacion)) {
            this.capacitacionModalMode = 'edit';
            this.capacitacionSelected = JSON.parse(JSON.stringify(capacitacion));
            this.capacitacionSelectedWorkers = JSON.parse(JSON.stringify(workers));
            this.capacitacionSelectedWorkersIds = workers.map(worker => worker.rutTrabajador);
            this.openModal(editionModal, { size: 'lg' });
            this.toastr.info('Se deben actualizar los campos:\n Duración Real , Asistentes Reales, Evidencia y Fecha Ejecución Real antes de cerrar', 'Advertencia');
            return;
          }
        }
        

        // this.confirmationModalTittle = 'Cerrar capacitación';
        // this.confirmationModalMessage = `¿Seguro que desea cerrar la capacitación "${capacitacion.name}"?`;
        // this.confirmationModalHasComment = true;
      }

      // this.openModal(modal);
    }
  }

  async fetchEvidencia(capacitacion: any) {
    try {
      const evidencias = await this.evidenciaService.list(capacitacion.capacitacionId);
      this.evidencesCount = evidencias.evidencias.length || 0;
    }
    catch (error) {
      console.error(error);
    }
  }

  openRejectModal(modal: any, capacitacion: any): void {
    if (this.validationService.canAcceptOrReject(capacitacion)) {
      this.confirmationModalHasComment = true;
      this.confirmationModalHasOptions = true;
      this.confirmationModalisCommentObligatory = true;
      this.capacitacionIdSelected = capacitacion.capacitacionId;
      this.confirmationModalTittle = 'Rechazar capacitación';
      this.confirmationModalMessage = `¿Seguro que desea rechazar la capacitación "${capacitacion.name}"?`;
      this.confirmationModalAccept = this.onRejectCapacitacion;
      this.openModal(modal);
    }
  }

  openModal(modal: any, options: any = {}): void {
    const modalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, ...options };
    this.modalService.open(modal, modalOptions);
  }
}
