import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Cliente } from '../models/cliente';
import { Inscripcion } from '../models/inscripcion';
import { Precio } from '../models/precio';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {

  inscripcion: Inscripcion = new Inscripcion();
  clienteSeleccionado: Cliente = new Cliente();
  precioSeleccionado: Precio = new Precio();   
  precios: Precio[] = new Array<Precio>()
  idPrecio: string = 'null';

  constructor(private db: AngularFirestore, private msj: MensajesService) { }

  ngOnInit(): void {
    this.db.collection('precios').get().subscribe((resultado)=>{
      resultado.docs.forEach((item)=>{
        let precio:any = item.data() as Precio;
        precio.id = item.id;
        precio.ref = item.ref;
        this.precios.push(precio)

      })
    })
  }

  asginarCliente(cliente: Cliente){
    this.inscripcion.cliente = cliente.ref;
    this.clienteSeleccionado = cliente;
  }

  eliminarCliente(){
    this.clienteSeleccionado = new Cliente();
    this.inscripcion.cliente = undefined;
  }

  guardar(){
    if(this.inscripcion.validar().esValido){
      let inscripcionAgregar = {
        fecha: this.inscripcion.fecha,
        fechaFinal: this.inscripcion.fechaFinal,
        cliente: this.inscripcion.cliente,
        precios: this.inscripcion.precios,
        subTotal: this.inscripcion.subTotal,
        iva: this.inscripcion.iva,
        total: this.inscripcion.total
      }
      this.db.collection('inscripciones').add(inscripcionAgregar).then((resultado)=>{
        this.inscripcion = new Inscripcion();
        this.clienteSeleccionado = new Cliente();
        this.precioSeleccionado = new Precio();
        this.idPrecio = 'null';
        this.msj.mensajeCorrecto('Guardado', 'Inscripción registrada con éxito')
        this.ngOnInit();
      })
      
    } else{
      this.msj.mensajeAdvertencia('Advertencia', this.inscripcion.validar().mensaje)
    }
    
  }

  selecionarPrecio(id: any){

    if(id.target.value != "null"){
      this.precioSeleccionado = this.precios.find(x=> x.id ==id.target.value )
      this.inscripcion.precios = this.precioSeleccionado.ref;  
      this.inscripcion.subTotal = this.precioSeleccionado.costo;
      this.inscripcion.iva = this.inscripcion.subTotal * 0.19;
      this.inscripcion.total = this.inscripcion.subTotal +  this.inscripcion.iva;
  
      // Los meses en JavaScript comprenden el rango desde el 0 hasta el 11, 
      // siendo 0 enero y 11 diciembre.
      this.inscripcion.fecha = new Date();
      if(this.precioSeleccionado.tipoDuracion == 1){
        //Día == 1
        let dias: number = this.precioSeleccionado.duracion;
        let fechaFinal = new Date(this.inscripcion.fecha.getFullYear(),
                                  this.inscripcion.fecha.getMonth(),
                                  this.inscripcion.fecha.getDate()+dias);
        this.inscripcion.fechaFinal = fechaFinal
      }
      if(this.precioSeleccionado.tipoDuracion == 2){
        //Semana == 2
        let dias: number = this.precioSeleccionado.duracion * 7;
        let fechaFinal = new Date(this.inscripcion.fecha.getFullYear(),
                                  this.inscripcion.fecha.getMonth(),
                                  this.inscripcion.fecha.getDate()+dias);
        this.inscripcion.fechaFinal = fechaFinal
      }
      if(this.precioSeleccionado.tipoDuracion == 3){
        //Quincena == 3
        let dias: number = this.precioSeleccionado.duracion * 15;
        let fechaFinal = new Date(this.inscripcion.fecha.getFullYear(),
                                  this.inscripcion.fecha.getMonth(),
                                  this.inscripcion.fecha.getDate()+dias);
        this.inscripcion.fechaFinal = fechaFinal
      }
      if(this.precioSeleccionado.tipoDuracion == 4){
        //Mes == 4
        let anio = this.inscripcion.fecha.getFullYear();
        let mes = this.inscripcion.fecha.getMonth() + this.precioSeleccionado.duracion;
        let dia = this.inscripcion.fecha.getDate()
        let fechaFinal = new Date(anio,mes,dia)
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if(this.precioSeleccionado.tipoDuracion == 5){
        //Año == 5
        let anio = this.inscripcion.fecha.getFullYear() + this.precioSeleccionado.duracion;
        let mes = this.inscripcion.fecha.getMonth();
        let dia = this.inscripcion.fecha.getDate()
        let fechaFinal = new Date(anio,mes,dia)
        this.inscripcion.fechaFinal = fechaFinal;
      }
    } else{
        this.inscripcion.fecha = null;
        this.inscripcion.fechaFinal = null;
        this.inscripcion.precios = null;
        this.inscripcion.subTotal = 0
        this.inscripcion.iva = 0
        this.inscripcion.total = 0
    }
  }

  
}
