import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EventMantenedorCategoriaService } from 'src/app/services/event-mantenedor-categoria.service';
import { CategoryService } from 'src/app/services/category.service';
import { EnfoqueService } from 'src/app/services/enfoque.service';
import { EventMantenedorEnfoqueService } from 'src/app/services/event-mantenedor-enfoque.service';
@Component({
  selector: 'app-table-enfoque',
  templateUrl: './table-enfoque.component.html',
  styleUrls: ['./table-enfoque.component.scss']
})
export class TableEnfoqueComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElementZona: DataTableDirective;
  dtTriggerZona: Subject<any> = new Subject();
  loadingZonas = false;
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
  pageActualEnfoque = 1
  zonasMantenedor: any;
  zona: any;
  zonaSelected: any;
  zonaIdSelected: number;
  creationMode: string;
  confirmationModalTittle: string;
  confirmationModalMessage: string;
  confirmationModalHasComment = false;
  confirmationModalHasOptions = false;
  confirmationModalisCommentObligatory = false;
  confirmationModalAccept: any;
  confirmationModalOptionLabel: string;
  confirmationModalOptions: { label: string, value: any }[];
  constructor(private enfoqueService: EnfoqueService,
    private modalService: NgbModal,
    private eventMantenedorEnfoqueService: EventMantenedorEnfoqueService) { }

  ngOnInit() {
    this.refreshZonas();

    if (this.eventMantenedorEnfoqueService.subsVar == undefined) {
      this.eventMantenedorEnfoqueService.subsVar = this.eventMantenedorEnfoqueService.
        invokeFirstComponentFunction.subscribe(() => {
          this.refreshZonas();
        });
    }
  }

  ngAfterViewInit(): void {
    this.dtTriggerZona.next();
  }

  ngOnDestroy(): void {
    this.dtTriggerZona.unsubscribe();
  }

  refreshZonas() {
    Promise.all([
      this.getZonasMantenedor()
    ])
      .then(results => {
        this.zonasMantenedor = results[0];
        this.loadingZonas = false;
        this.rerenderZona();
      })
      .catch(error => {
        this.loadingZonas = false;
        console.error(error);
      });
  }
  getZonasMantenedor(): any {
    this.loadingZonas = true;
    return new Promise((resolve, reject) => {
      this.enfoqueService.getAllCategorias()
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }
  rerenderZona(): void {
    this.dtElementZona.dtInstance.then((dtInstanceZona: DataTables.Api) => {
      dtInstanceZona.destroy();
      this.dtTriggerZona.next();
    });
  }
  onCreateZona(modal: any, mode: string, zona: any) {
    if (mode === 'Editar') {
      const request: JSON = {
        enfoqueId: zona.enfoqueId,
        descripcion: zona.enfoqueDescription,
        estado: zona.status
      } as unknown as JSON;
      this.zonaSelected = request;
    } else {
      const request: JSON = {
        enfoqueId: null,
        descripcion: "",
        estado: 1// Estado habilitado para la zona que se creará
      } as unknown as JSON;
      this.zonaSelected = request;
    }
    const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
    this.creationMode = mode;
    this.modalService.open(modal, modalOptions);
  }
  openDeleteModalZona(modal: any, zona: any): void {
    this.zona = zona;
    this.confirmationModalHasComment = false;
    this.confirmationModalHasOptions = false;
    this.confirmationModalisCommentObligatory = false;
    this.zonaIdSelected = zona.enfoqueId;
    this.confirmationModalTittle = 'Eliminar Zona';
    this.confirmationModalMessage = `¿Seguro que desea eliminar el enfoque "${zona.enfoqueDescription}"?`;
    this.confirmationModalAccept = this.onDeleteZona;
    this.openModal(modal);
  }
  openModal(modal: any, options: any = {}): void {
    const modalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, ...options };
    this.modalService.open(modal, modalOptions);
  }
  onDeleteZona(): void {
    const zona = this.zona;
    const request: JSON = {
      enfoque:
      {
        enfoqueId: zona.enfoqueId,
        descripcion: zona.enfoqueDescription,
        estado: 0
      }
    } as unknown as JSON;
    this.enfoqueService.update(request, this.zonaIdSelected)
      .then(() => {
        this.refreshZonas();
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
