import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule} from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';

import appInitializer from './appInitializer';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { CapacitacionesComponent } from './modules/capacitaciones/capacitaciones.component';
import { AprobacionMasivaComponent } from './modules/aprobacion-masiva/aprobacion-masiva.component';
import { CargaMasivaComponent } from './modules/carga-masiva/carga-masiva.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DashboardContratistaComponent } from './modules/dashboard-contratista/dashboard-contratista.component';
import { MantenedoresComponent } from './modules/mantenedores/mantenedores.component';
import { NavbarComponent } from './modules/navbar/navbar.component';
import { ConfigService } from './services/config.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CargaPlanModalComponent } from './components/carga-plan-modal/carga-plan-modal.component';
import { CalendarViewComponent } from './modules/capacitaciones/calendar-view/calendar-view.component';
import { TableViewComponent } from './modules/mantenedores/table-view/table-view.component';
import { CapacitacionesTableComponent } from './modules/mantenedores/table-view/capacitaciones-table/capacitaciones-table.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { CapacitacionModalComponent } from './components/capacitacion-modal/capacitacion-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PronexoWorkersModalComponent } from './components/capacitacion-modal/pronexo-workers-modal/pronexo-workers-modal.component';
import { MonthCardComponent } from './modules/capacitaciones/calendar-view/month-card/month-card.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { EventEmitterService } from './services/event-emitter.service';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { NgxMaskModule } from 'ngx-mask';
import { Ng2Rut } from 'ng2-rut';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZonaModalComponent } from './components/zona-modal/zona-modal.component';
import { TableZonaComponent } from './modules/mantenedores/table-zona/table-zona.component';
import { CategoriaModalComponent } from './components/categoria-modal/categoria-modal.component';
import { TableCategoriaComponent } from './modules/mantenedores/table-categoria/table-categoria.component';
import { TableEjecutorComponent } from './modules/mantenedores/table-ejecutor/table-ejecutor.component';
import { TableEnfoqueComponent } from './modules/mantenedores/table-enfoque/table-enfoque.component';
import { TableRelatorComponent } from './modules/mantenedores/table-relator/table-relator.component';
import { TableFocoComponent } from './modules/mantenedores/table-foco/table-foco.component';
import { EnfoqueModalComponent } from './components/enfoque-modal/enfoque-modal.component';
import { EjecutorModalComponent } from './components/ejecutor-modal/ejecutor-modal.component';
import { FocoModalComponent } from './components/foco-modal/foco-modal.component';
import { RelatorModalComponent } from './components/relator-modal/relator-modal.component';
import { PlanificacionModalComponent } from './components/planificacion-modal/planificacion-modal.component';
import { PeriodoPlanificacionComponent } from './modules/configuration/periodo-planificacion/periodo-planificacion.component';

//BORRAR EN CASO DE ERROR
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { SearchfilterPipe } from './searchfilter.pipe';
import {NgApexchartsModule } from 'ng-apexcharts';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CapacitacionesComponent,
    AprobacionMasivaComponent,
    CargaMasivaComponent,
    DashboardComponent,
    DashboardContratistaComponent,
    MantenedoresComponent,
    NavbarComponent,
    CalendarViewComponent,
    TableViewComponent,
    CapacitacionesTableComponent,
    ConfirmationModalComponent,
    CapacitacionModalComponent,
    UserModalComponent,
    ZonaModalComponent,
    PronexoWorkersModalComponent,
    MonthCardComponent,
    TableZonaComponent,
    CategoriaModalComponent,
    TableCategoriaComponent,
    TableEjecutorComponent,
    TableEnfoqueComponent,
    TableRelatorComponent,
    TableFocoComponent,
    EnfoqueModalComponent,
    EjecutorModalComponent,
    FocoModalComponent,
    RelatorModalComponent,
    PlanificacionModalComponent,
    PeriodoPlanificacionComponent,
    CargaPlanModalComponent,
    SearchfilterPipe
  ],
  imports: [
    DlDateTimeDateModule,  
    DlDateTimePickerModule,
    NgApexchartsModule,
    OrderModule,
    NgxPaginationModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    Ng2Rut,
    FormsModule,
    ReactiveFormsModule,
    FilterPipeModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgSelectModule,
    //Borrar en caso de error
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer.load,
      deps: [HttpClient, ConfigService],
      multi: true
    },
    EventEmitterService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
