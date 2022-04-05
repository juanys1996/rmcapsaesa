import { Injectable } from '@angular/core';
import {
  ABIERTA_STATE,
  APROBADA_STATE, CERRADA_STATE,
  ENVIADA_APROBACION_STATE,
  PENDIENTE_STATE,
  CANCELADA_STATE,
  CERRADA_CON_RETRASO_STATE,
  PLANIFICADA_ID,
  RECHAZADA_STATE,
  REFORZAMIENTO_ID,
  ROL_ADMINISTRADOR,
  ROL_CONTRATISTA,
  ROL_EMPRESA,
  PENDIENTE_CON_RETRASO_STATE
} from '../utils/constants';


@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }


  public isActiveIconSend(capacitacion: any): boolean {

    let rolid = this.getRolId();

    if (
      (
        rolid == ROL_CONTRATISTA && capacitacion.roleId == ROL_CONTRATISTA &&
        capacitacion.capacitacionTypeId === PLANIFICADA_ID &&
        (capacitacion.stateId === ABIERTA_STATE || capacitacion.stateId === RECHAZADA_STATE)
      ) ||
      (

        rolid == ROL_ADMINISTRADOR && capacitacion.roleId == ROL_CONTRATISTA &&
        capacitacion.capacitacionTypeId === PLANIFICADA_ID &&
        (capacitacion.stateId === ABIERTA_STATE || capacitacion.stateId === RECHAZADA_STATE)
      ) ||
      (
        rolid == ROL_ADMINISTRADOR && capacitacion.roleId == ROL_CONTRATISTA &&
        (capacitacion.stateId === ABIERTA_STATE || capacitacion.stateId === RECHAZADA_STATE)
      ) ||
      (
        (rolid === ROL_CONTRATISTA) &&
        capacitacion.roleId == ROL_CONTRATISTA &&
        capacitacion.capacitacionTypeId === PLANIFICADA_ID &&
        (capacitacion.stateId === RECHAZADA_STATE && capacitacion.motivoId != 4)
      )
    ) {
      return true;
    }
  }

  public isActiveIconDelete(capacitacion: any): boolean {
    let rolid = this.getRolId();

    if (
      (capacitacion.roleId == ROL_CONTRATISTA &&
        rolid == ROL_CONTRATISTA &&
        (capacitacion.stateId === ABIERTA_STATE || capacitacion.stateId === ENVIADA_APROBACION_STATE)
      )
      ||
      (
        capacitacion.roleId == ROL_CONTRATISTA && rolid == ROL_ADMINISTRADOR
      )
      ||
      (
        rolid == ROL_ADMINISTRADOR
      )
    ) {
      return true;
    }
  }

  public isActiveIconEdit(capacitacion: any): boolean {

    let rolid = this.getRolId();
    if (
      (
        capacitacion.roleId == ROL_CONTRATISTA &&
        (rolid === ROL_CONTRATISTA) &&
        (capacitacion.stateId === PENDIENTE_CON_RETRASO_STATE)
      ) ||
      (
        capacitacion.roleId == ROL_CONTRATISTA &&
        (rolid === ROL_CONTRATISTA) &&
        (capacitacion.stateId === ENVIADA_APROBACION_STATE || capacitacion.stateId === ABIERTA_STATE)
      ) ||
      (capacitacion.roleId == ROL_CONTRATISTA &&
        rolid == ROL_ADMINISTRADOR
      ) ||
      (capacitacion.roleId == ROL_CONTRATISTA &&
        rolid == ROL_EMPRESA &&
        capacitacion.stateId === ENVIADA_APROBACION_STATE || capacitacion.stateId === RECHAZADA_STATE
      ) ||
      (
        capacitacion.roleId == ROL_CONTRATISTA &&
        (rolid == ROL_CONTRATISTA || rolid == ROL_EMPRESA) &&
        (capacitacion.stateId === CERRADA_STATE ||
          capacitacion.stateId === CERRADA_CON_RETRASO_STATE ||
          capacitacion.stateId === CANCELADA_STATE) &&
        (this.isTreintaDias(capacitacion))
      ) ||
      (
        capacitacion.roleId == ROL_EMPRESA && rolid == ROL_EMPRESA && capacitacion.stateId === ABIERTA_STATE
      ) ||
      (
        capacitacion.roleId == ROL_EMPRESA &&
        rolid == ROL_EMPRESA &&
        (capacitacion.stateId === ABIERTA_STATE || (capacitacion.stateId === CERRADA_STATE && this.isTreintaDias(capacitacion)))
      ) ||
      (
        capacitacion.roleId == ROL_CONTRATISTA &&
        (rolid === ROL_CONTRATISTA) &&
        (capacitacion.stateId === RECHAZADA_STATE && capacitacion.motivoId != 4)
      ) ||
      (
        capacitacion.roleId == ROL_CONTRATISTA &&
        (rolid === ROL_CONTRATISTA || rolid === ROL_EMPRESA) &&
        (capacitacion.stateId === APROBADA_STATE || capacitacion.stateId === PENDIENTE_STATE)
      ) ||
      (
        (capacitacion.roleId == ROL_ADMINISTRADOR || capacitacion.roleId == ROL_EMPRESA) &&
        (rolid === ROL_ADMINISTRADOR) &&
        (capacitacion.stateId === ABIERTA_STATE || capacitacion.stateId === CERRADA_STATE)
      )
    ) {
      return true;
    }
  }

  private isTreintaDias(capacitacion: any): boolean {
    if (!capacitacion.cierreDate) return false;
    else {
      let d = new Date(); d.setDate(d.getDate() - 30);
      let datePart = capacitacion.cierreDate.split(" ")[0].split("/");
      let dateUpdate = new Date(+datePart[2], datePart[1] - 1, +datePart[0]);
      return dateUpdate >= d;
    }
  }

  public isActiveEditOnApprove(capacitacion: any): boolean {
    let rolid = this.getRolId();
    if

      (
      capacitacion.roleId == ROL_CONTRATISTA &&
      (rolid === ROL_CONTRATISTA || rolid === ROL_EMPRESA) &&
      (capacitacion.stateId === APROBADA_STATE || capacitacion.stateId === PENDIENTE_STATE
        || capacitacion.stateId === PENDIENTE_CON_RETRASO_STATE) || ((capacitacion.stateId === CERRADA_STATE ||
          capacitacion.stateId === CERRADA_CON_RETRASO_STATE ||
          capacitacion.stateId === CANCELADA_STATE) &&
          (this.isTreintaDias(capacitacion)))
    ) {
      return true;
    }
  }

  public isActiveIconAccept(capacitacion: any): boolean {
    let rolid = this.getRolId();

    if (
      (
        (rolid == ROL_EMPRESA || rolid == ROL_ADMINISTRADOR) &&
        capacitacion.roleId == ROL_CONTRATISTA &&
        capacitacion.capacitacionTypeId === PLANIFICADA_ID &&
        capacitacion.stateId === ENVIADA_APROBACION_STATE
      )
    ) {
      return true;
    }
  }

  public isActiveIconClose(capacitacion: any): boolean {
    let rolid = this.getRolId();

    if (
      (
        capacitacion.roleId == ROL_CONTRATISTA &&
        (rolid === ROL_CONTRATISTA) &&
        (capacitacion.stateId === PENDIENTE_CON_RETRASO_STATE)
      ) ||
      (
        (rolid == ROL_CONTRATISTA || rolid == ROL_EMPRESA || rolid == ROL_ADMINISTRADOR) &&
        capacitacion.roleId == ROL_CONTRATISTA &&
        capacitacion.capacitacionTypeId === PLANIFICADA_ID &&
        (capacitacion.stateId === APROBADA_STATE || capacitacion.stateId === PENDIENTE_STATE)
      ) ||
      (
        (rolid == ROL_EMPRESA || rolid == ROL_ADMINISTRADOR) &&
        capacitacion.roleId == ROL_EMPRESA &&
        capacitacion.capacitacionTypeId === PLANIFICADA_ID &&
        (capacitacion.stateId === ABIERTA_STATE)
      ) ||
      (
        (rolid == ROL_ADMINISTRADOR) &&
        capacitacion.roleId == ROL_ADMINISTRADOR &&
        capacitacion.capacitacionTypeId === PLANIFICADA_ID &&
        (capacitacion.stateId === ABIERTA_STATE)
      ) || (
        capacitacion.capacitacionTypeId === REFORZAMIENTO_ID &&
        (capacitacion.stateId === ABIERTA_STATE)
      )
    ) {
      return true;
    }
  }

  public isActiveIconReject(capacitacion: any): boolean {
    let rolid = this.getRolId();

    if (
      capacitacion.roleId == ROL_CONTRATISTA &&
      capacitacion.stateId === ENVIADA_APROBACION_STATE &&
      (rolid == ROL_EMPRESA || rolid == ROL_ADMINISTRADOR)
    ) {
      return true;
    }
  }

  public canDelete(capacitacion: any): boolean {
    return this.isActiveIconDelete(capacitacion);

  }

  public canEditOnReject(capacitacion: any): boolean {
    let rolid = this.getRolId();
    if (
      capacitacion.roleId == ROL_CONTRATISTA &&
      capacitacion.stateId === RECHAZADA_STATE //FALTA MOTIVO CANCELADO
    ) {
      return true;
    }
  }

  public canEdit(capacitacion: any): boolean {
    return this.isActiveIconEdit(capacitacion);
  }

  public canSendForAcceptance(capacitacion: any): boolean {
    return this.isActiveIconSend(capacitacion);
  }

  public canAcceptOrReject(capacitacion: any): boolean {
    return this.isActiveIconAccept(capacitacion);
  }

  public canClose(capacitacion: any): boolean {
    let rolid = this.getRolId();
    return this.isActiveIconClose(capacitacion);
  }

  public canAssignWorkers(capacitacion: any): boolean {
    if (capacitacion.capacitacionTypeId === PLANIFICADA_ID) {
      return (capacitacion.roleId == ROL_CONTRATISTA && (capacitacion.stateId === APROBADA_STATE
        || capacitacion.stateId === CERRADA_STATE
        || capacitacion.stateId === PENDIENTE_STATE
        || capacitacion.stateId === PENDIENTE_CON_RETRASO_STATE))
        || (capacitacion.roleId == ROL_ADMINISTRADOR);
    }
    return true;
  }

  public getRolId() {
    return sessionStorage.getItem('rolid');
  }

}
