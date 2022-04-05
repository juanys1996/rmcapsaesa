import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from './modules/login/login.component';
import {CapacitacionesComponent} from './modules/capacitaciones/capacitaciones.component';
import {AprobacionMasivaComponent} from './modules/aprobacion-masiva/aprobacion-masiva.component';
import {CargaMasivaComponent} from './modules/carga-masiva/carga-masiva.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {DashboardContratistaComponent} from './modules/dashboard-contratista/dashboard-contratista.component';
import {MantenedoresComponent} from './modules/mantenedores/mantenedores.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full', runGuardsAndResolvers: 'always'},
  { path: 'login', component: LoginComponent, runGuardsAndResolvers: 'always'},
  { path: 'capacitaciones', component: CapacitacionesComponent, runGuardsAndResolvers: 'always'},
  { path: 'aprobacion', component: AprobacionMasivaComponent, runGuardsAndResolvers: 'always'},
  { path: 'carga-masiva', component: CargaMasivaComponent, runGuardsAndResolvers: 'always'},
  { path: 'dashboard', component: DashboardComponent, runGuardsAndResolvers: 'always'},
  { path: 'dashboard-contratista', component: DashboardContratistaComponent, runGuardsAndResolvers: 'always'},
  { path: 'mantenedores', component: MantenedoresComponent, runGuardsAndResolvers: 'always'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
