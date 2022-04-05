import { Component, OnInit} from "@angular/core";
import * as XLSX from "xlsx";
import { EventPlanCapacitacionService } from "src/app/services/plan-capacitacion-service"; 
import { isUndefined } from 'util';

const CABECERAS = ["AÑO", "PROCESO", "FOCO", "CATEGORIA","CANTIDAD"];

@Component({
  selector: "app-carga-plan-modal",
  templateUrl: "./carga-plan-modal.component.html",
  styleUrls: ["./carga-plan-modal.component.scss"],
})
export class CargaPlanModalComponent implements OnInit{
  file!: File;
  arrayBuffer: any;
  error : boolean;
  exitoInsercion : boolean;
  mensajeError : string;
  coincideCabecera = true;
  dataRange: any = [];

  constructor(private eventPlanCapacitacionService: EventPlanCapacitacionService){}

  ngOnInit(): void {
    this.error = false;
    this.exitoInsercion = false;
    this.mensajeError = ""; 
  }

  cargarPlanCapacitacion(value: any, element) {
    let tipoError = "";
    let fileReader = new FileReader();
    this.file = value.target.files[0];
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onloadend = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      var rangeCabecera = {
        s: { c: 0, r: 0 },
        e: { c: CABECERAS.length - 1, r: 0 },
      }; //A1:A9
      var rangeCuerpo = {
        s: { c: 0, r: 1 },
        e: { c: CABECERAS.length - 1, r: arraylist.length },
      };
      if (arraylist.length > 100) {
        this.error = true;
        this.mensajeError =
          "La carga masiva soporta solo 100 registros. El archivo posee " + arraylist.length + " registros.";
      } else {
        /* Iterate through each element in the structure */
        for (var R = rangeCabecera.s.r; R <= rangeCabecera.e.r; ++R) {
          for (var C = rangeCabecera.s.c; C <= rangeCabecera.e.c; ++C) {
            var cell_address = { c: C, r: R };
            var datos = XLSX.utils.encode_cell(cell_address);
            try{
              if (!CABECERAS.includes(worksheet[datos].v)) {
                this.coincideCabecera = false;
                break;
              }
            }catch(error){
              this.coincideCabecera = false;
              break;
            }
          }
        }
        if (this.coincideCabecera) {
          for (var R = rangeCuerpo.s.r; R <= rangeCuerpo.e.r; ++R) {
            var dataCell = [];
            let foco = "";
            let capacitacion = "";
            for (var C = rangeCuerpo.s.c; C <= rangeCuerpo.e.c; ++C) {
              var cell_address = { c: C, r: R };
              var datos = XLSX.utils.encode_cell(cell_address);
              if (isUndefined(worksheet[datos])) {
                this.error = true;
                tipoError = "vacio";
                break;
              }else if((datos.includes("A") || datos.includes("E")) && isNaN(worksheet[datos].v)){
                this.error = true;
                tipoError = "numerico";
                break;
              }else if(datos.includes("C")){
                foco = worksheet[datos].v
              }else if(datos.includes("D") && ((foco != "NA" && String(worksheet[datos].v) != "NA") 
              || (foco == "NA" && String(worksheet[datos].v) == "NA"))){
                this.error = true;
                tipoError = "texto";
                break;
              } else {
                dataCell.push(worksheet[datos].v);
              }
            }
            this.dataRange.push(dataCell);
          }
          if(tipoError === "vacio"){
            this.dataRange = [];
            this.mensajeError = "El archivo cargado posee campos sin completar, favor revisar antes de continuar.";
          }else if(tipoError === "numerico"){
            this.mensajeError = "Los campos AÑO - CANTIDAD solo aceptan valores numéricos, favor revisar antes de continuar.";
            this.dataRange = [];
          }else if(tipoError === "texto"){
            this.mensajeError = "Si el campo 'FOCO' viene con un valor distinto a 'NA', el campo 'CATEGORIA' debe ser 'NA' o Viceversa.";
            this.dataRange = [];
          }else{
            this.onSave();
          }
        } else {
          this.error = true;
          this.mensajeError =
            "El archivo cargado no corresponde al esperado, favor descargar la plantilla base y volver a intentar.";
        }
      }
    };
    element.value = "";
  }

  onSave(): void {
    this.eventPlanCapacitacionService.insertPlanCapacitacion(this.dataRange, sessionStorage.getItem("userid"))
      .then((response) => {
        this.exitoInsercion = true;
        this.mensajeError = response;
      })
      .catch((error) => {
        this.error = true;
        this.mensajeError =
          "Ha ocurrido un error en la inserción, comuniquese con el administrador";
      });
  }
}
