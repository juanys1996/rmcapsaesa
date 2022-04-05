import { Component, OnInit, ViewChild } from '@angular/core';
import { EventNavbarService } from 'src/app/services/event-navbar.service';
import { NavigationService } from '../../services/navigation.service';
import { AprobacionMasivaService } from 'src/app/services/aprobacion-masiva.service';
import { MONTHS_BD } from 'src/app/utils/constants'
import { IndicadoresService } from 'src/app/services/indicadores.service';

import { ApexNonAxisChartSeries, 
  ApexResponsive, 
  ChartComponent, 
  ApexAxisChartSeries, 
  ApexChart, 
  ApexXAxis, 
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend} from "ng-apexcharts";
import { DashboardService} from 'src/app/services/dashboard.service';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
    responsive: ApexResponsive[];
};

export type ChartOptions3 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

export type ChartOptions4 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

export type ChartOptions5 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
  })

export class DashboardComponent implements OnInit{
    @ViewChild("chart", {static : false}) chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    public chartOptions3: Partial<ChartOptions3>;
    public chartOptions4: Partial<ChartOptions4>;
    public chartOptions5: Partial<ChartOptions5>;
    categorias = [];
    series  = [];
    categoriasFoco = [];
    seriesFoco  = [];
    categoriasRelator = [];
    seriesRelator  = [];
    categoriasOk = [];
    seriesOk  = [];
    categoriasRenNoRend = [];
    arrRealizadas = [];
    arrNoRealizadas = [];
    cantidadCapacitaciones : number = 0;
    resumenCapacitaciones : any = [];
    //Filtros
    listaAnio : any = [];
    listaZonas : any = [];
    listaMeses : any = [];
    anioSelected : string = "";
    mesSelected : string = "";
    zonaSelected : string = "";
    tipoCapacitacionSelected : string = "";
    pageActual: number = 1;
    //Indicadores
    showIndicators = false;
    indicadores: any;
    isIndicatorsCollapsed = false;
    indicatorRealizadas = 'indicator-card';
	  indicatorPlanificadas = 'indicator-card';
	  indicatorReforzamiento = 'indicator-card';

    constructor(private navigationService: NavigationService,
        private eventNavbarService: EventNavbarService,
        private dashboardService : DashboardService,
        private aprobacionService: AprobacionMasivaService,
        private indicadoresService: IndicadoresService
    ) { }

    ngOnInit() {
        this.openNavbar();
        this.listaMeses = MONTHS_BD;
        this.getIndicadores();
        this.getAnnio();
        this.getZonas();
        this.cantidadCapacitaciones = 0;
        this.anioSelected = "0";
        this.mesSelected = "0";
        this.zonaSelected = "0";
        this.tipoCapacitacionSelected = "0";
        this.getHorasZona();
        this.getHorasFoco();
        this.getHorasRealizadas();
        this.getCapacRealizadasNoRealizadas();
        this.getResumenCapacitaciones();
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

    mostrarGraficosFiltrados(){
      this.categorias = [];
      this.series  = [];
      this.categoriasFoco = [];
      this.seriesFoco  = [];
      this.categoriasRelator = [];
      this.seriesRelator  = [];
      this.categoriasOk = [];
      this.seriesOk  = []   
      this.categoriasRenNoRend = [];
      this.arrRealizadas = [];
      this.arrNoRealizadas = [];
      this.resumenCapacitaciones = [];   
      this.getHorasZona();
      this.getHorasFoco();
      this.getHorasRealizadas();
      this.getCapacRealizadasNoRealizadas();
      this.getResumenCapacitaciones();
    }

    getAnnio(): void {
      this.aprobacionService.getAnnioPlanes()
        .then(response => {
          this.listaAnio = response;
        })
        .catch(error => {
          error = true;
        });
    }

    getZonas(): void {
      this.dashboardService.getZonas()
        .then(response => {
          this.listaZonas = response;
        })
        .catch(error => {
          error = true;
        });
    }

    //Cambio de opción - Select Año
    onAnioChange(event: any) {
      this.anioSelected = event.target.value;
    }

    //Cambio de opción - Select Mes
    onMesChange(event: any) {
      this.mesSelected = event.target.value;
    }

    //Cambio de opción - Select Zona
    onZonaChange(event: any) {
      this.zonaSelected = event.target.value;
    }

    //Cambio de opción - Select Zona
    onTipoCapacitacionChange(event: any) {
      this.tipoCapacitacionSelected = event.target.value;
    }

    graficoHHZona(){
      this.chartOptions = {
        series: [
          {
            name: "Cantidad HH",
            data : this.series
          }
        ],
        chart: {
          height: 300,
          width: '75%',
          type: "bar"
        },
        title: {
          text: "HH Total Por Zona",
          align: 'center',
        },
        xaxis: {
          categories:  this.categorias,
          labels: {
            show: true,
            rotateAlways: true,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
          },
        },
        responsive: [{
          breakpoint: undefined,
          options: {},
        }]
      };
    }

    graficoHHFoco(){
      this.chartOptions3 = {
        series: [
          {
            name: "Cantidad HH",
            data : this.seriesFoco
          }
        ],
        chart: {
          height: 300,
          width: '75%',
          type: "bar"
        },
        title: {
          text: "HH Total Por Foco",
          align: 'center',
        },
        xaxis: {
          categories:  this.categoriasFoco,
          labels: {
            show: true,
            rotateAlways: true,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
          },
        },
        responsive: [{
          breakpoint: undefined,
          options: {},
        }]
      };
    }

    graficoHHFRealizadas(){
      this.chartOptions4 = {
        series: [
          {
            name: "Cantidad HH",
            data : this.seriesOk
          }
        ],
        chart: {
          height: 300,
          width: '75%',
          type: "bar"
        },
        title: {
          text: "HH Total Capac. Realizadas",
          align: 'center',
        },
        xaxis: {
          categories:  this.categoriasOk,
          labels: {
            show: true,
            rotateAlways: true,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
          },
        },
        responsive: [{
          breakpoint: undefined,
          options: {},
        }]
      };
    }

    graficoRealizadosNoRealizados(){
      this.chartOptions5 = {
        series: [
          {
            name: "Rendidas",
            data: this.arrRealizadas
          },
          {
            name: "No Rendidas",
            data: this.arrNoRealizadas
          },
        ],
        chart: {
          type: "bar",
          height: 300,
          width: '75%',
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        title: {
          text: "Realizado y No Realizado por Mes (En relación al mes de realización tentativo)",
          align: 'center'
        },
        xaxis: {
          categories: this.categoriasRenNoRend,
          labels: {
            formatter: function(val) {
              return val;
            }
          }
        },
        yaxis: {
          title: {
            text: undefined
          },
          min: 0,
          max: this.cantidadCapacitaciones + 2,
          forceNiceScale: true
        },

        tooltip: {
          y: {
            formatter: function(val) {
              return String(val);
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40
        }
      };
    }

    getHorasZona(){
      this.dashboardService.getHorasZona(this.anioSelected, this.mesSelected, this.zonaSelected, this.tipoCapacitacionSelected)
        .then(response => {
          let map = new Map(Object.entries(response));
          if(map.size > 0){
            for(let key of map.keys()){
              this.categorias.push(key);
              this.series.push(map.get(key));
            }
          }
          this.graficoHHZona();
        })
        .catch(error => {
          error = true;
        });
        
    }

    getHorasFoco(){
      this.dashboardService.getHorasFoco(this.anioSelected, this.mesSelected, this.zonaSelected, this.tipoCapacitacionSelected)
        .then(response => {
          let map = new Map(Object.entries(response));
          if(map.size > 0){
            for(let key of map.keys()){
              this.categoriasFoco.push(key);
              this.seriesFoco.push(map.get(key));
            }
          }
          this.graficoHHFoco();
        })
        .catch(error => {
          error = true;
        });
    }

    getHorasRealizadas(){
      this.dashboardService.getHorasRealizadas(this.anioSelected, this.mesSelected, this.zonaSelected, this.tipoCapacitacionSelected)
        .then(response => {
          let map = new Map(Object.entries(response));
          if(map.size > 0){
            for(let key of map.keys()){
              this.categoriasOk.push(key);
              this.seriesOk.push(map.get(key));
            }
          }
          this.graficoHHFRealizadas();
        })
        .catch(error => {
          error = true;
        });
    }

    getCapacRealizadasNoRealizadas(){
      this.cantidadCapacitaciones = 0;
      this.dashboardService.getCapacRealizadasNoRealizadas(this.anioSelected, this.mesSelected, this.zonaSelected, this.tipoCapacitacionSelected)
        .then(response => {
          let map = new Map(Object.entries(response));
          if(map.size > 0){
            for(let key of map.keys()){
              this.categoriasRenNoRend.push(key);
              let cantidad : string = map.get(key);
              let cant = cantidad.split("-");
              this.arrNoRealizadas.push(Number(cant[0]));
              this.arrRealizadas.push(Number(cant[1]));
              if((Number(cant[1]) + Number(cant[0])) > this.cantidadCapacitaciones){
                this.cantidadCapacitaciones = Number(cant[1]) + Number(cant[0])
              }
            }
          }
          this.graficoRealizadosNoRealizados();
        })
        .catch(error => {
          error = true;
        });
    }
  
    getResumenCapacitaciones(){
      this.dashboardService.getResumenCapacitaciones(this.anioSelected, this.mesSelected, this.zonaSelected, this.tipoCapacitacionSelected)
        .then(response => {
          this.resumenCapacitaciones = response;
        })
        .catch(error => {
          error = true;
        });
    }

    //Indicadores
    getIndicadores(): any {
      Promise.all([
        this.loadIndicadores()
      ])
        .then(results => {
          this.indicadores = results[0];
          this.showIndicators = true;
        })
        .catch(error => console.error(error));
    }

    loadIndicadores(): any {
      return new Promise((resolve, reject) => {
        this.indicadoresService.getIndicadoresValues()
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    }

    collapseIndicators(): void {
      this.isIndicatorsCollapsed = !this.isIndicatorsCollapsed;
    }

}