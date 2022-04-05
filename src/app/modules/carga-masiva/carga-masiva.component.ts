import { Component, OnInit } from '@angular/core';
import { EventCargaMasivaService } from 'src/app/services/carga-masiva.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { EventNavbarService } from 'src/app/services/event-navbar.service';
import { ZoneService } from 'src/app/services/zone.service';
import * as XLSX from 'xlsx';
import { isUndefined } from 'util';
import moment from 'moment';

const FILESAVER = require('file-saver');
const CABECERAS = ['NOMBRE', 'ZONA', 'CATEGORIA', 'FOCO', 'ENFOQUE', 'OBSERVACION', 'EJECUTOR', 'RELATOR', 'FECHA CAPACITACION', 'Q PERSONA', 'DURACION (HH)', 'PROCESO'];
const CABECERAS_ADMIN = ['NOMBRE', 'ZONA', 'CATEGORIA', 'FOCO', 'ENFOQUE', 'OBSERVACION', 'EJECUTOR', 'RELATOR', 'FECHA CAPACITACION', 'Q PERSONA', 'DURACION (HH)', 'CONTRATISTA', 'PROCESO'];

@Component({
    selector: 'app-carga-masiva',
    templateUrl: './carga-masiva.component.html',
    styleUrls: ['./carga-masiva.component.scss']
})

export class CargaMasivaComponent implements OnInit {
    rolid: any = sessionStorage.getItem('rolid');
	error : boolean;
	exitoInsercion : boolean;
    existeError : boolean;
	mensajeError = "";
	file!: File;
	arrayBuffer: any;
	filelist: any;
	coincideCabecera: boolean = true;
	dataRange : any = [];
	loginData: any;
	selectedMonth: string = "";
    zona : any = [];

    constructor(private navigationService: NavigationService,
        private eventCargaMasivaService: EventCargaMasivaService,
        private eventNavbarService: EventNavbarService,
        private zonaService : ZoneService) { }

    ngOnInit() {
        this.openNavbar();
        this.existeError = true;
        this.error = false;
	    this.exitoInsercion = false;
        this.loginData = JSON.parse(sessionStorage.getItem('loginData'));
        if(this.rolid == 3){
            this.findZonaUsuario(parseInt(sessionStorage.getItem('userid')));
        }
        if (!this.navigationService.getValidLogin()) { this.navigationService.goTo('/login'); }
    }

    findZonaUsuario(userId : number){
        this.zonaService.getZonaUsuario(userId)
      .then(response => {
        this.zona = response;
      })
      .catch(error => {
        error = true;
      });
    }

    //Carga Masiva - Descarga de Plantilla
    downloadXslx() {
        const xlsxUrl = this.rolid === "1" ? './assets/plantillas/CapacitacionesAdmin.xlsx' : './assets/plantillas/Capacitaciones.xlsx';
        const xlsxName = 'plantilla_capacitaciones';
        FILESAVER.saveAs(xlsxUrl, xlsxName);
    }

    //Carga Masiva - Lectura de CSV - EXCEL
    addfile(value: any, element) {
        this.coincideCabecera = true;
        this.error = false;
        this.exitoInsercion = false;
        this.existeError = false;
        this.dataRange = [];
        this.file = value.target.files[0];
        let fileReader = new FileReader();
        let tipoError = "";
        let cabecera: any = [];
        let cantidadProcesos : any = [];
        if (this.rolid === "3") {
            cabecera = CABECERAS;
        } else if (this.rolid === "1" || this.rolid === "2") {
            cabecera = CABECERAS_ADMIN;
        }
        fileReader.readAsArrayBuffer(this.file);
        fileReader.onloadend = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            var bstr = arr.join('');
            var workbook = XLSX.read(bstr, { type: 'binary' });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            worksheet['!ref'] = "A5:L25"
            var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            var rangeCabecera = { s: { c: 0, r: 4 }, e: { c: cabecera.length - 1, r: 4 } };
            var rangeCuerpo = { s: { c: 0, r: 5 }, e: { c: cabecera.length - 1, r: 5 + (arraylist.length - 1) } };
            if (arraylist.length > 20) {
                this.error = true;
                this.mensajeError = "La carga masiva soporta solo 20 registros. El archivo posee " + arraylist.length + " registros.";
            } else if (arraylist.length == 0) {
                this.error = true;
                this.mensajeError = "El archivo cargado no posee registros para ser procesado, favor revisar.";
            } else {
                for (var R = rangeCabecera.s.r; R <= rangeCabecera.e.r; ++R) {
                    for (var C = rangeCabecera.s.c; C <= rangeCabecera.e.c; ++C) {
                        var cell_address = { c: C, r: R };
                        var datos = XLSX.utils.encode_cell(cell_address);
                        try{
                            let value = worksheet[datos].v
                            if (!cabecera.includes(String(value))) {
                                this.coincideCabecera = false;
                                break;
                            }
                        }catch (error){
                            this.coincideCabecera = false;
                            break;
                        }
                    }
                }
                if (this.coincideCabecera) {
                    let i = 0;
                    let expresion = /^\d{2}\-\d{2}\-\d{4}$/;
                    for (var R = rangeCuerpo.s.r; R <= rangeCuerpo.e.r; ++R) {
                        var dataCell = [];
                        dataCell.push(i);
                        for (var C = rangeCuerpo.s.c; C <= rangeCuerpo.e.c; ++C) {
                            var cell_address = { c: C, r: R };
                            var datos = XLSX.utils.encode_cell(cell_address);
                            if (isUndefined(worksheet[datos])) {
                                this.error = true;
                                tipoError = "vacio";
                                break;
                            } else if ((datos.includes("J") || datos.includes("K")) && isNaN(worksheet[datos].v)) {
                                this.error = true;
                                tipoError = "numerico";
                                break;
                            } else if (datos.includes("I") && (!(String(worksheet[datos].v).match(expresion)) || !moment(worksheet[datos].v, 'DD-MM-YYYY').isValid())) {
                                this.error = true;
                                tipoError = "fecha";
                                break;
                            }else if (datos.includes("B") && this.rolid == 3 && !this.zona.includes(worksheet[datos].v)){
                                this.error = true;
                                tipoError = "zona";
                                break;
                            } else {
                                if((this.rolid == 1 || this.rolid == 2) && datos.includes("M") && !cantidadProcesos.includes(String(worksheet[datos].v))){
                                    cantidadProcesos.push(String(worksheet[datos].v));
                                }else if(this.rolid == 3 && datos.includes("L") && !cantidadProcesos.includes(String(worksheet[datos].v))){
                                    cantidadProcesos.push(String(worksheet[datos].v));
                                }
                                dataCell.push(worksheet[datos].v);
                            }
                        }
                        this.dataRange.push(dataCell);
                        i++;
                    }

                    if(cantidadProcesos.lenght > 1){
                        this.error = true;
                        this.mensajeError = "Las capacitaciones del plan cargado deben estar asociadas a un único proceso.'";
                        this.dataRange = [];
                    }else{
                        if (tipoError === "vacio") {
                            this.error = true;
                            this.mensajeError = "El archivo cargado posee campos sin completar, favor revisar antes de continuar.";
                            this.dataRange = [];
                        } else if (tipoError === "numerico") {
                            this.error = true;
                            this.mensajeError = "Los campos Q PERSONA - DURACION (HH) solo aceptan valores numéricos, favor revisar antes de continuar.";
                            this.dataRange = [];
                        }else if(tipoError === 'fecha'){
                            this.error = true;
                            this.mensajeError = "El formato de la fecha permitido es 'dd-mm-aaaa.'";
                            this.dataRange = [];
                        }else if(tipoError === 'zona'){
                            this.error = true;
                            this.mensajeError = "La zona ingresada no coincide con la zona del contratista.'";
                            this.dataRange = [];
                        }
                    }
                } else {
                    this.error = true;
                    this.mensajeError = "El archivo cargado no corresponde al esperado, favor descargar la plantilla base y volver a intentar.";
                }
            }
        };
        element.value = "";
    }

    //Carga Masiva - Edición Valores en Tabla
    updateList(id: number, property: number, event: any) {
        this.error = false;
        this.existeError = false;
        let sinError = true;
        if(property === 1){
            if(String(event.target.textContent).trim() === ""){
                sinError = false;
                this.error = true;
                this.mensajeError = "El campo Nombre no puede ser vacío";
            }
        } else if ((property === 10 || property === 11)) {
            if(isNaN(event.target.textContent)){
                sinError = false;
                this.error = true;
                this.mensajeError = "El campo Año - Dur. Estimada (HH) y Cant. Asistentes solo acepta valores numéricos";
            }
        }else if(property === 9){
            let fecha = String(event.target.textContent).split("-")
            let m = moment(event.target.textContent, 'DD-MM-YYYY');

            if(!m.isValid() || fecha.length != 3 || isNaN(Number(fecha[0])) || isNaN(Number(fecha[1])) 
            || isNaN(Number(fecha[2])) || String(fecha[0]).length != 2 || String(fecha[1]).length != 2 
            || String(fecha[2]).length != 4){
                sinError = false;
                this.error = true;
                this.mensajeError = "La fecha ingresada no es correcta, favor revisar";
            }
        } 
        if(sinError){
            this.dataRange[id][property] = event.target.textContent;
            this.existeError = false;
        }else{
            this.existeError = true;
        }
    }

    onOptionChange(event : any, id : number, property : number){
        this.dataRange[id][property] = event.target.value;
    }

    //Carga Masiva - Insertar datos en BD (Nexo con Backend)
    onSave(estado: number): void {
       this.error = false;
       this.exitoInsercion = false;
       this.eventCargaMasivaService.insertCargaMasiva(this.dataRange,
            sessionStorage.getItem('userid'), estado, this.loginData.usertableentity.empresa.nombre,
            this.rolid)
            .then(response => {
                this.dataRange = [];
                this.exitoInsercion = true;
                this.mensajeError = response;
            })
            .catch(error => {
                this.error = true;
                this.mensajeError = "Ha ocurrido un error en la inserción, comuniquese con el administrador";
        });
        setTimeout(function(){
            document.getElementById("divMensaje").style.display = 'none';
            this.error = false;
            this.exitoInsercion = false;
        },3000)
    }

    openNavbar() {
		this.eventNavbarService.openNavbar();
	}

    
}