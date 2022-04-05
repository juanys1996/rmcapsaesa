import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild, ElementRef, Output, QueryList } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from 'src/app/services/navigation.service';
import { ZoneService } from 'src/app/services/zone.service';
import { EventNavbarService } from 'src/app/services/event-navbar.service';
import { ContratistasService } from 'src/app/services/contratistas.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ROL } from 'src/app/utils/constants';
import { CategoryService } from 'src/app/services/category.service';
import { EjecutorService } from 'src/app/services/ejecutor.service';

@Component({
	selector: 'app-mantenedores',
	templateUrl: './mantenedores.component.html',
	styleUrls: ['./mantenedores.component.scss']
})
export class MantenedoresComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective, { static: false })
	dtElementUsuario: DataTableDirective;
	dtTriggerUsuario: Subject<any> = new Subject();
	/*dtInstanceUsuario: DataTables.Api;
	dtOptions: DataTables.Settings = {
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
	userIdSelected: number;
	zonaIdSelected: number;
	confirmationModalTittle: string;
	confirmationModalMessage: string;
	confirmationModalHasComment = false;
	confirmationModalHasOptions = false;
	confirmationModalisCommentObligatory = false;
	confirmationModalOptionLabel: string;
	usuarioSelected: any;
	zonaSelected: any;
	categoriaSelected: any;
	confirmationModalOptions: { label: string, value: any }[];
	loadingUsuarios = false;
	loadingZonas = false;
	confirmationModalAccept: any;
	message = '';
	zonasMantenedor: any;
	zonas: any;
	categorias: any;
	ejecutores: any;
	userZonas: any;
	focoCategorias: any;
	relatorEjecutores: any;
	allZonas: any;
	allCategorias: any;
	allEjecutores: any;
	allEmpresas : any;
	contratistas: any;
	usuarios: any;
	visible = false;
	usuario: any;
	zona: any;
	categoria: any;
	enfoque: any;
	ejecutor: any;
	relator: any;
	planificacion : any;
	foco: any;
	empresas: any;
	flagRealizadas = false;
	flagPlanificadas = false;
	flagUsuarios = true;
	flagZonas = false;
	flagCategorias = false;
	flagEnfoques = false;
	flagEjecutores = false;
	flagFocos = false;
	flagRelatores = false;
	flagPlanificacion = false;
	rolid: any = sessionStorage.getItem('rolid');
	flagReforzamiento = false;
	creationMode: string;
	pageActual: number = 1;

	constructor(private navigationService: NavigationService,
		private modalService: NgbModal,
		private httpClient: HttpClient,
		private changeDetectorRefs: ChangeDetectorRef,
		private contratistasService: ContratistasService,
		private empresasService: EmpresasService,
		private userService: UserService,
		private eventNavbarService: EventNavbarService,
		private zoneService: ZoneService,
		private categoriaService: CategoryService,
		private ejecutorService: EjecutorService,) { }

	ngOnInit() {
		this.refresh();
		this.visible = true;
		this.openNavbar();
		if (!sessionStorage.getItem('foo')) {
			sessionStorage.setItem('foo', 'no reload');
			location.reload();
		} else {
			sessionStorage.removeItem('foo');
		}
		if (!this.navigationService.getValidLogin()) { this.navigationService.goTo('/login'); }
	}

	ngAfterViewInit(): void {
		this.dtTriggerUsuario.next();
	}

	ngOnDestroy(): void {
		this.pageActual = 1;
		this.dtTriggerUsuario.unsubscribe();
	}

	rerenderUsuario(): void {
		this.dtElementUsuario.dtInstance.then((dtInstanceUsuario: DataTables.Api) => {
			dtInstanceUsuario.destroy();
			this.dtTriggerUsuario.next();
		});
	}

	filterZone(zone: string) {
	}

	filterContratista(contratista: string) {
	}

	filterEnterprise(empresa: string) {
	}

	getZonas(): any {
		return new Promise((resolve, reject) => {
			this.zoneService.getZonas()
				.then(response => {
					this.zonas = response;
				})
				.catch(error => reject(error));
		});
	}

	getAllZonas(): any {
		return new Promise((resolve, reject) => {
			this.zoneService.getAllZonas()
				.then(response => {
					this.allZonas = response;
				})
				.catch(error => reject(error));
		});
	}

	getAllZonasUser(): any {
		return new Promise((resolve, reject) => {
			this.zoneService.getAllZonas()
				.then(response => resolve(response))
				.catch(error => reject(error));
		});
	}

	getAllCategorias(): any {
		return new Promise((resolve, reject) => {
			this.categoriaService.getAllCategorias()
				.then(response => resolve(response))
				.catch(error => reject(error));
		});
	}

	getAllEjecutores(): any {
		return new Promise((resolve, reject) => {
			this.ejecutorService.getAllCategorias()
				.then(response => resolve(response))
				.catch(error => reject(error));
		});
	}

	getUserZonasByUserId(userid: String): any {
		return new Promise((resolve, reject) => {
			this.zoneService.getZonasbyUserId(userid)
				.then(response => resolve(response))
				.catch(error => reject(error));
		});
	}

	getContratistas(): any {
		return new Promise((resolve, reject) => {
			this.contratistasService.getContatistas()
				.then(response => {
					this.contratistas = response;
				})
				.catch(error => reject(error));
		});
	}

    getUsuarios(): any {
		this.loadingUsuarios = true;
		return new Promise((resolve, reject) => {
			this.userService.listUsuariosZonas()
				.then(response => resolve(response))
				.catch(error => reject(error));
		});
	}

	getEmpresas(): any {
		return new Promise((resolve, reject) => {
			this.empresasService.getEmpresas()
				.then(response => {
					this.empresas = response;
				})
				.catch(error => reject(error));
		});
	}

	openNavbar() {
		this.eventNavbarService.openNavbar();
	}

	openDeleteModalUsuario(modal: any, usuario: any): void {
		this.usuario = usuario;
		this.confirmationModalHasComment = false;
		this.confirmationModalHasOptions = false;
		this.confirmationModalisCommentObligatory = false;
		this.userIdSelected = usuario.userId;
		this.confirmationModalTittle = 'Eliminar Usuario';
		this.confirmationModalMessage = `¿Seguro que desea eliminar al usuario "${usuario.username}"?`;
		this.confirmationModalAccept = this.onDeleteUser;
		this.openModal(modal);
	}

	openModal(modal: any, options: any = {}): void {
		const modalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, ...options };
		this.modalService.open(modal, modalOptions);
	}

	onDeleteUser(): void {
		const usuario = this.usuario;
		const request: JSON = {
			usuario:
			{
				usuarioId: usuario.userId,
				rolId: usuario.roleId,
				userName: usuario.username,
				password: usuario.password,
				email: usuario.email,
				rut_trabajador: usuario.rutTrabajador,
				nombre_trabajador: usuario.nombreTrabajador,
				apellido_paterno: usuario.apellidoPaterno,
				apellido_materno: usuario.apellidoMaterno,
				estado: 0, // Estado deshabilitado para el usuario que se eliminará lógicamente.
				rut_empresa: usuario.rutContratista,
				nombre_empresa: usuario.nombreContratista,
				cargo: usuario.cargo,
				proceso: usuario.proceso,
				gerencia: usuario.gerencia,
				idEmpresa: usuario.idEmpresa,
				zonas: []
			}
		} as unknown as JSON;
		this.userService.update(request, this.userIdSelected)
			.then(response => {
				this.refresh();
			})
			.catch(error => console.error(error));
	}

	onCreate(modal: any, mode: string, usuario: any) {
		if (mode === 'Editar') {
			const request: JSON = {
				userId: usuario.userId,
				rolId: usuario.roleId,
				userName: usuario.username,
				password: usuario.password,
				email: usuario.email,
				rut_trabajador: usuario.rutTrabajador,
				nombre_trabajador: usuario.nombreTrabajador,
				apellido_paterno: usuario.apellidoPaterno,
				apellido_materno: usuario.apellidoMaterno,
				estado: usuario.status,
				rut_empresa: usuario.rutContratista,
				nombre_empresa: usuario.nombreContratista,
				cargo: usuario.cargo,
				proceso: usuario.proceso,
				gerencia: usuario.gerencia,
				idEmpresa: usuario.idEncargado
			} as unknown as JSON;
			this.usuarioSelected = request;
		} else {
			const request: JSON = {
				userId: null,
				rolId: null,
				userName: '',
				password: '',
				email: '',
				rut_trabajador: '',
				nombre_trabajador: '',
				apellido_paterno: '',
				apellido_materno: '',
				estado: 1, // Estado habilitado para el usuario que se creará
				rut_empresa: '',
				nombre_empresa: '',
				cargo: '',
				proceso: '',
				gerencia: ''
			} as unknown as JSON;
			this.usuarioSelected = request;
			this.userZonas = [];
		}
		const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
		this.creationMode = mode;

		if (mode === 'Editar') {
			Promise.all([
				this.getUserZonasByUserId(usuario.userId),
				this.getAllZonasUser()
			])
				.then(results => {
					this.userZonas = results[0];
					this.allZonas = results[1];
					this.modalService.open(modal, modalOptions);
				})
				.catch(error => console.error(error));
		} else {
			Promise.all([
				this.getAllZonasUser()
			])
				.then(results => {
					this.allZonas = results[0];
					this.modalService.open(modal, modalOptions);
				})
				.catch(error => console.error(error));
		}
	}

	onCreateZona(modal: any, mode: string, zona: any) {
		const request: JSON = {
			zoneId: null,
			descripcion: '',
			comuna: '',
			estado: 1
		} as unknown as JSON;
		this.zonaSelected = request;
		const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
		this.creationMode = mode;
		this.modalService.open(modal, modalOptions);
	}

	onCreateEnfoque(modal: any, mode: string, zona: any) {
		const request: JSON = {
			enfoqueId: null,
			descripcion: '',
			estado: 1
		} as unknown as JSON;
		this.categoriaSelected = request;
		const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
		this.creationMode = mode;
		this.modalService.open(modal, modalOptions);
	}

	onCreateEjecutor(modal: any, mode: string, zona: any) {
		const request: JSON = {
			ejecutorId: null,
			descripcion: '',
			estado: 1
		} as unknown as JSON;
		this.categoriaSelected = request;
		const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
		this.creationMode = mode;
		this.modalService.open(modal, modalOptions);
	}

	onCreateFoco(modal: any, mode: string, zona: any) {
		const request: JSON = {
			focoId: null,
			descripcion: '',
			estado: 1
		} as unknown as JSON;
		this.categoriaSelected = request;
		this.focoCategorias = [];
		const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
		this.creationMode = mode;
		Promise.all([
			this.getAllCategorias()
		])
			.then(results => {
				this.allCategorias = results[0];
				this.modalService.open(modal, modalOptions);
			})
			.catch(error => console.error(error));
	}

	onCreateRelator(modal: any, mode: string, zona: any) {
		const request: JSON = {
			relatorId: null,
			descripcion: '',
			estado: 1
		} as unknown as JSON;
		this.categoriaSelected = request;
		this.relatorEjecutores = [];
		const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
		this.creationMode = mode;
		Promise.all([
			this.getAllEjecutores()
		])
			.then(results => {
				this.allEjecutores = results[0];
				this.modalService.open(modal, modalOptions);
			})
			.catch(error => console.error(error));
	}

	onCreatePlanificacion(modal: any, mode: string, zona: any) {
		const request: JSON = {
			codigo: '',
			descripcion: '',
			fechaInicio: '',
			fechaTermino: '',
			estado: 1
		} as unknown as JSON;
		this.categoriaSelected = request;
		this.relatorEjecutores = [];
		const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
		this.creationMode = mode;
		this.modalService.open(modal, modalOptions);
	}

	onCreateCategoria(modal: any, mode: string, zona: any) {
		const request: JSON = {
			categoriaId: null,
			descripcion: '',
			estado: 1
		} as unknown as JSON;
		this.categoriaSelected = request;
		const modalOptions: NgbModalOptions = { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' };
		this.creationMode = mode;
		this.modalService.open(modal, modalOptions);
	}

	refresh() {
		Promise.all([
			this.getUsuarios()
		])
			.then(results => {
				this.usuarios = results[0];
				this.loadingUsuarios = false;
				this.rerenderUsuario();
			})
			.catch(error => {
				this.loadingUsuarios = false;
				console.error(error);
			});
	}

	getRolLabel(id: number): string {
		return ROL[id - 1].label;
	}

	getEstadoLabel(estado: boolean): string {
		if (estado) {
			return 'Habilitado';
		} else {
			return 'Deshabilitado';
		}
	}

	getLabelZonas(zonas: any): string {
		if (zonas.length > 0) {
			let textoZona = '';
			zonas.forEach(element => {
				textoZona += element.descripcion + ', ';
			});
			const textoZonaLimpio = textoZona.substring(0, textoZona.length - 2);
			return textoZonaLimpio;
		} else {
			return '-';
		}
	}

	tablaUsuarios() {
		this.refresh();
		this.flagZonas = false;
		this.flagCategorias = false;
		this.flagUsuarios = true;
		this.flagEnfoques = false;
		this.flagEjecutores = false;
		this.flagPlanificacion = false;
		this.flagRelatores = false;
		this.flagFocos = false;
	}

	tablaZonas() {
		this.ngOnDestroy();
		this.flagZonas = true;
		this.flagUsuarios = false;
		this.flagCategorias = false;
		this.flagEnfoques = false;
		this.flagEjecutores = false;
		this.flagPlanificacion = false;
		this.flagRelatores = false;
		this.flagFocos = false;
	}

	tablaCategorias() {
		this.ngOnDestroy();
		this.flagZonas = false;
		this.flagUsuarios = false;
		this.flagCategorias = true;
		this.flagEnfoques = false;
		this.flagEjecutores = false;
		this.flagPlanificacion = false;
		this.flagRelatores = false;
		this.flagFocos = false;
	}

	tablaEnfoques() {
		this.ngOnDestroy();
		this.flagZonas = false;
		this.flagUsuarios = false;
		this.flagCategorias = false;
		this.flagEnfoques = true;
		this.flagEjecutores = false;
		this.flagPlanificacion = false;
		this.flagRelatores = false;
		this.flagFocos = false;
	}

	tablaEjecutores() {
		this.ngOnDestroy();
		this.flagZonas = false;
		this.flagUsuarios = false;
		this.flagCategorias = false;
		this.flagEnfoques = false;
		this.flagEjecutores = true;
		this.flagPlanificacion = false;
		this.flagRelatores = false;
		this.flagFocos = false;
	}

	tablaFocos() {
		this.ngOnDestroy();
		this.flagZonas = false;
		this.flagUsuarios = false;
		this.flagCategorias = false;
		this.flagEnfoques = false;
		this.flagEjecutores = false;
		this.flagPlanificacion = false;
		this.flagRelatores = false;
		this.flagFocos = true;
	}

	tablaRelatores() {
		this.ngOnDestroy();
		this.flagZonas = false;
		this.flagUsuarios = false;
		this.flagCategorias = false;
		this.flagEnfoques = false;
		this.flagEjecutores = false;
		this.flagPlanificacion = false;
		this.flagRelatores = true;
		this.flagFocos = false;
	}

	tablaPlanificacion() {
		this.ngOnDestroy();
		this.flagZonas = false;
		this.flagUsuarios = false;
		this.flagCategorias = false;
		this.flagEnfoques = false;
		this.flagEjecutores = false;
		this.flagPlanificacion = true;
		this.flagRelatores = false;
		this.flagFocos = false;
	}
}
