import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ZoneService } from 'src/app/services/zone.service';
import { EventMantenedorZonaService } from 'src/app/services/event-mantenedor-zona.service';
import { EventMantenedorCategoriaService } from 'src/app/services/event-mantenedor-categoria.service';
import { CategoryService } from 'src/app/services/category.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import moment from 'moment';

@Component({
  selector: 'app-periodo-planificacion',
  templateUrl: './periodo-planificacion.component.html',
  styleUrls: ['./periodo-planificacion.component.scss']
})
export class PeriodoPlanificacionComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElementPlanificacion: DataTableDirective;
  dtTriggerPlanificacion: Subject<any> = new Subject();
  loadingPlanificacion = false;
  /*dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    language: {
      processing: 'Procesando...',
      search: 'Buscar:',
      lengthMenu: 'Mostrar _MENU_ registros',
      info: 'Mostrando desde _START_ al _END_ de _TOTAL_ registros',
      infoEmpty: 'Mostrando ningún registro.',
      infoFiltered: '(filtrado _MAX_ registros en total)',
      infoPostFix: '',
      loadingRecords: 'Cargando registros...',
      zeroRecords: 'No se encontraron registros',
      emptyTable: 'No hay datos disponibles en la tabla',
      paginate: {
        first: 'Primero',
        previous: 'Anterior',
        next: 'Siguiente',
        last: 'Último'
      },
      aria: {
        sortAscending: ': Activar para ordenar la tabla en orden ascendente',
        sortDescending: ': Activar para ordenar la tabla en orden descendente'
      }
    },
    responsive: true
  };*/
  pageActualPlanificacion = 1;
  planificacionMantenedor: any;
  planificacion: any;
  planificacionSelected: any;
  planificacionIdSelected: number;
  creationMode: string;
  confirmationModalTittle: string;
  confirmationModalMessage: string;
  confirmationModalHasComment = false;
  confirmationModalHasOptions = false;
  confirmationModalisCommentObligatory = false;
  confirmationModalAccept: any;
  confirmationModalOptionLabel: string;
  confirmationModalOptions: { label: string, value: any }[];

  constructor(private categoriaService: CategoryService,
    private configuracionService : ConfigurationService,
    private modalService: NgbModal,
    private eventMantenedorCategoriaService: EventMantenedorCategoriaService) { }

  ngOnInit() {
    this.refreshPlanificaciones();

    if (this.eventMantenedorCategoriaService.subsVar == undefined) {
      this.eventMantenedorCategoriaService.subsVar = this.eventMantenedorCategoriaService.
        invokeFirstComponentFunction.subscribe((name: string) => {
          this.refreshPlanificaciones();
        });
    }
  }

  ngAfterViewInit(): void {
    this.dtTriggerPlanificacion.next();
  }

  ngOnDestroy(): void {
    this.dtTriggerPlanificacion.unsubscribe();
  }

  refreshPlanificaciones() {
    Promise.all([
      this.getPlanificacionMantenedor()
    ])
      .then(results => {
        this.planificacionMantenedor = results[0];
        this.loadingPlanificacion = false;
        this.rerenderPlanificacion();
      })
      .catch(error => {
        this.loadingPlanificacion = false;
        console.error(error);
      });
  }
  getPlanificacionMantenedor(): any {
    this.loadingPlanificacion = true;
    return new Promise((resolve, reject) => {
      this.configuracionService.getAllConfiguraciones()
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }
  rerenderPlanificacion(): void {
    this.dtElementPlanificacion.dtInstance.then((dtInstancePlanificacion: DataTables.Api) => {
      dtInstancePlanificacion.destroy();
      this.dtTriggerPlanificacion.next();
    });
  }
  onCreatePlanificacion(modal: any, mode: string, planificacion: any) {
    if (mode === 'Editar') {
      const request: JSON = {
        categoriaId: planificacion.idPlanificacion,
        codigo: planificacion.codigoPlanificacion,
        descripcion: planificacion.descripcion,
        fechaInicio: planificacion.fechaInicio,
        fechaTermino: planificacion.fechaTermino,
        empresas : planificacion.empresas,
        estado: planificacion.statusPlanificacion
      } as unknown as JSON;
      this.planificacionSelected = request;
    } else {
      const request: JSON = {
        categoriaId: null,
        codigo:"",
        descripcion: "",
        fechaInicio:"",
        fechaTermino:"",
        empresas: null,
        estado: 1// Estado habilitado para la zona que se creará
      } as unknown as JSON;
      this.planificacionSelected = request;
    }
    const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
    this.creationMode = mode;
    this.modalService.open(modal, modalOptions);
  }
  openDeleteModalPlanificacion(modal: any, planificacion: any): void {
    this.planificacion = planificacion;
    this.confirmationModalHasComment = false;
    this.confirmationModalHasOptions = false;
    this.confirmationModalisCommentObligatory = false;
    this.planificacionIdSelected = Number(planificacion.idPlanificacion);
    this.confirmationModalTittle = 'Eliminar Planificación';
    this.confirmationModalMessage = `¿Seguro que desea eliminar la planificación seleccionada?`;
    this.confirmationModalAccept = this.onDeletePlanificacion;
    this.openModal(modal);
  }
  openModal(modal: any, options: any = {}): void {
    const modalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, ...options };
    this.modalService.open(modal, modalOptions);
  }
  onDeletePlanificacion(): void {
    this.configuracionService.deletePlanificacion( this.planificacionIdSelected)
      .then(response => {
        this.refreshPlanificaciones();
      })
      .catch(error => console.error(error));
  }
  getEstadoLabel(estado: boolean): string {
    if (estado) {
      return 'Habilitado';
    } else {
      return 'Deshabilitado';
    }
  }
}
