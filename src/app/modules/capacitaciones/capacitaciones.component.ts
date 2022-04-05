import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild, ElementRef, Output, QueryList } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from 'src/app/services/navigation.service';
import { Session } from 'protractor';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { EventBiService } from 'src/app/services/event-bi.service';
import { EventCapacitacionService } from 'src/app/services/event-capacitacion.service';
import { EventNavbarService } from 'src/app/services/event-navbar.service';
import { range, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from 'src/app/services/config.service';
import { ROL } from 'src/app/utils/constants';
import { Console } from 'console';


@Component({
	selector: 'app-capacitaciones',
	templateUrl: './capacitaciones.component.html',
	styleUrls: ['./capacitaciones.component.scss']
})
export class CapacitacionesComponent implements OnInit {
	flagBi = false;
	flagCapacitaciones = false;
	actualView = 'calendar';
	rolid: any = sessionStorage.getItem('rolid');

	constructor(private navigationService: NavigationService,
		private modalService: NgbModal,
		private httpClient: HttpClient,
		private eventBiService: EventBiService,
		private eventCapacitacionService: EventCapacitacionService,
		private eventNavbarService: EventNavbarService,
		private eventEmitterService: EventEmitterService,
		private configService: ConfigService) { }

	ngOnInit() {
		this.openNavbar();
		this.flagBi = false;
		this.flagCapacitaciones = true;
		if (!sessionStorage.getItem('foo')) {
			sessionStorage.setItem('foo', 'no reload');
			location.reload();
		} else {
			sessionStorage.removeItem('foo');
		}
		if (!this.navigationService.getValidLogin()) { this.navigationService.goTo('/login'); }
	}

	openNavbar() {
		this.eventNavbarService.openNavbar();
	}

}
