import { DocumentReference } from "@angular/fire/compat/firestore";

export class Inscripcion{
    fecha: Date;
    fechaFinal: Date;
    cliente: DocumentReference;
    precios: DocumentReference;
    subTotal: number;
    iva: number;
    total: number;
    constructor(){
        this.fecha = null;
        this.fechaFinal = null;
        this.cliente = this.cliente;
        this.precios = this.precios;
        this.subTotal = this.subTotal;
        this.iva = this.iva;
        this.total = this.total;
    }

    validar(): any{
        let respuesta = {
            esValido: false,
            mensaje: ''
        }
        if(this.cliente == null || this.cliente == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = 'Por favor selecciones un cliente';
            return respuesta;
        }
        if(this.precios == null || this.precios == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = 'No ha seleccionado un precio';
            return respuesta;
        }
        if(this.fecha == null || this.fecha == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = 'No tiene fecha de inicio';
            return respuesta;
        }
        if(this.fechaFinal == null || this.fechaFinal == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = 'No tiene fecha de término';
            return respuesta;
        }
        
        if(this.subTotal <= 0 || this.subTotal == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = 'No se ha podido calcular el subtotal';
            return respuesta;
        }
        if(this.iva <= 0 || this.iva == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = 'No se ha podido calcular el IVA';
            return respuesta;
        }
        if(this.total <= 0 || this.total == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = 'No se ha podido calcular el total';
            return respuesta;
        }
        respuesta.esValido = true;
        return respuesta;
    }

    
}