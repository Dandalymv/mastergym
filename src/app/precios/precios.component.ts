import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MensajesService } from '../services/mensajes.service';
import { Precio } from '../models/precio';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss']
})
export class PreciosComponent implements OnInit {

  formularioPrecio: FormGroup;
  precios: Precio[] = new Array<Precio>();
  esEditar: boolean = false;
  id: string;


  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private msj: MensajesService) { }

  ngOnInit(): void {

    this.formularioPrecio = this.fb.group({
      nombre: ['', Validators.required],
      costo: ['', Validators.required],
      duracion: ['', Validators.required],
      tipoDuracion: ['', Validators.required],
    })

    this.mostrarPrecios();

  }

  mostrarPrecios(){
    this.precios.length = 0;
    this.db.collection<Precio>('precios').get().subscribe((resultado)=>{
      resultado.docs.forEach((dato)=>{
        let precio:any = dato.data() as Precio;
        precio.id = dato.id;
        precio.ref = dato.id;
        this.precios.push(precio)
      })
    })
  }

  agregar(){
    this.db.collection('precios').add(this.formularioPrecio.value).then(()=>{
      this.msj.mensajeCorrecto('Agregar', 'Precio agregado correctamente');
      this.formularioPrecio.reset();
      this.mostrarPrecios();
    }).catch(()=>{
      this.msj.mensajeError('Error', 'Ocurrio un error')
    })
  }

  editarPrecio(precio: Precio){
    this.esEditar = true;
    this.formularioPrecio.setValue({
      nombre: precio.nombre,
      costo: precio.costo,
      duracion: precio.duracion,
      tipoDuracion: precio.tipoDuracion
    })
    this.id = precio.id;


  }

  editar(){
    this.db.doc('precios/'+this.id).update(this.formularioPrecio.value).then(()=>{
      this.msj.mensajeCorrecto('Editado', 'Editado correctamente');
      this.formularioPrecio.reset();
      this.esEditar = false;
      this.mostrarPrecios();
    }).catch(()=>{
      this.msj.mensajeError('Error', 'Se ha producido un error')
    })
  }

  eliminarPrecio(){

    let eliminar = this.db.doc('precios/'+this.id);
    Swal.fire({
      title: '¿Está seguro de que desea eliminar el registro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar registro!'
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar.delete(),
        Swal.fire(
          'Eliminado!',
          'El registro ha sido borrado.',
          'success'
        ),
        this.mostrarPrecios();
      }
    })

  }

}
