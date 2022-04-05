import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EventMantenedorCategoriaService } from 'src/app/services/event-mantenedor-categoria.service';
import { CategoryService } from 'src/app/services/category.service';
import { EnfoqueService } from 'src/app/services/enfoque.service';
import { EventMantenedorEnfoqueService } from 'src/app/services/event-mantenedor-enfoque.service';
import { EventMantenedorRelatorService } from 'src/app/services/event-mantenedor-relator.service';
import { RelatorService } from 'src/app/services/relator.service';
import { EjecutorService } from 'src/app/services/ejecutor.service';
@Component({
  selector: 'app-table-relator',
  templateUrl: './table-relator.component.html',
  styleUrls: ['./table-relator.component.scss']
})
export class TableRelatorComponent implements AfterViewInit, OnDestroy, OnInit {
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
  pageActualRelator = 1
  zonasMantenedor: any;
  zona: any;
  zonaSelected: any;
  categoriaSelected: any;
  zonaIdSelected: number;
  creationMode: string;
  confirmationModalTittle: string;
  confirmationModalMessage: string;
  confirmationModalHasComment = false;
  allEjecutores: any;
  relatorEjecutores: any;
  confirmationModalHasOptions = false;
  confirmationModalisCommentObligatory = false;
  confirmationModalAccept: any;
  confirmationModalOptionLabel: string;
  confirmationModalOptions: { label: string, value: any }[];
  constructor(private relatorService: RelatorService,
    private modalService: NgbModal,
    private ejecutorService: EjecutorService,
    private eventMantenedorRelatorService: EventMantenedorRelatorService
  ) { }

  ngOnInit() {
    this.refreshZonas();

    if (this.eventMantenedorRelatorService.subsVar == undefined) {
      this.eventMantenedorRelatorService.subsVar = this.eventMantenedorRelatorService.
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
      this.relatorService.getAllCategorias()
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
  onCreateZona(modal: any, mode: string, ejecutores: any) {
    const request: JSON = {
      relatorId: ejecutores.relatorId,
      descripcion: ejecutores.relatorDescription,
      estado: 1
    } as unknown as JSON;
    this.categoriaSelected = request;
    const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
    this.creationMode = mode;
    Promise.all([
      this.getAllEjecutores()
    ])
      .then(results => {
        this.allEjecutores = results[0];
        this.relatorEjecutores = ejecutores.ejecutores;
        this.modalService.open(modal, modalOptions);
      })
      .catch(error => console.error(error));
  }

  getLabelEjecutores(zonas: any): string {
    if (zonas.length > 0) {
      let textoZona = '';
      zonas.forEach(element => {
        textoZona += element.ejecutorDescription + ', ';
      });
      const textoZonaLimpio = textoZona.substring(0, textoZona.length - 2);
      return textoZonaLimpio;
    } else {
      return '-';
    }
  }
  getAllEjecutores(): any {
    return new Promise((resolve, reject) => {
      this.ejecutorService.getAllCategorias()
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }
  openDeleteModalZona(modal: any, zona: any): void {
    const request: JSON = {
      newRelator:
      {
        relatorId: zona.relatorId,
        descripcion: zona.relatorDescription,
        estado: 1,
        ejecutores: []
      }
    } as unknown as JSON;
    this.categoriaSelected = request;
    this.zona = zona;
    this.confirmationModalHasComment = false;
    this.confirmationModalHasOptions = false;
    this.confirmationModalisCommentObligatory = false;
    this.zonaIdSelected = zona.relatorId;
    this.confirmationModalTittle = 'Eliminar Relator';
    this.confirmationModalMessage = `¿Seguro que desea eliminar el relator "${zona.relatorDescription}"?`;
    this.confirmationModalAccept = this.onDeleteZona;
    this.openModal(modal);
  }
  openModal(modal: any, options: any = {}): void {
    const modalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, ...options };
    this.modalService.open(modal, modalOptions);
  }
  onDeleteZona(): void {
    this.relatorService.delete(this.categoriaSelected, this.zonaIdSelected)
      .then(response => {
        this.refreshZonas();
      })
      .catch(error => console.error(error));
  }
}
