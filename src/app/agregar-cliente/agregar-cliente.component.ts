import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { MensajesService } from '../services/mensajes.service';
import {Router} from "@angular/router";
import Swal from 'sweetalert2';



@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {

  formularioCliente!: FormGroup;
  porcentajeCarga: number = 0;
  urlImagen: string = '';
  esEditable: boolean = false;
  id: string;
  imagenCargada: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private storage: AngularFireStorage, 
    private db : AngularFirestore,
    private activateRoute: ActivatedRoute,
    private msj: MensajesService,
    private router: Router) { }

  ngOnInit(): void {

    this.id = this.activateRoute.snapshot.params['clienteID']

    if(this.id != undefined){

      this.esEditable = true;
      this.db.doc<any>('clientes/' + this.id).valueChanges().subscribe((cliente)=>{
      
        console.log(cliente)
        this.formularioCliente.setValue({
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          correo: cliente.correo,
          fechaNacimiento: new Date(cliente.fechaNacimiento.seconds *1000).toISOString().substring(0,10),
          telefono: cliente.telefono,
          rut: cliente.rut,
          imgURL: ''
        })
        
        this.urlImagen = cliente.imgURL
      });
    }
    this.formularioCliente = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      rut: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: [''],
      imgURL:['', Validators.required]     
    })
  }

  agregar(){
    this.formularioCliente.value.imgURL = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
    console.log(this.formularioCliente.value)
    this.db.collection('clientes').add(this.formularioCliente.value).then(()=>{
      this.msj.mensajeCorrecto('Agregar', 'Cliente '+this.formularioCliente.value.nombre+ ' agregado con éxito')
      this.formularioCliente.reset();
      this.imagenCargada = false;
      this.porcentajeCarga = 0;
    })
  }
  editar(){
    this.formularioCliente.value.imgURL = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
    this.formularioCliente.value; 

    this.db.doc('clientes/'+this.id).update(this.formularioCliente.value).then(()=>{
      this.msj.mensajeCorrecto('Editar', 'Cliente '+this.formularioCliente.value.nombre+ ' editado correctamente');
    }).catch(()=>{
      this.msj.mensajeError('Error', 'Ha ocurrido un error al actualizar el cliente');
    })
  }

  eliminarCliente(){
    let eliminar = this.db.doc('clientes/'+this.id);
    eliminar.delete();
    

    Swal.fire({
      title: '¿Está seguro de que desea eliminar al cliente?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar cliente!'
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar.delete(),
        Swal.fire(
          'Cliente eliminado!',
          'El registro ha sido borrado.',
          'success'
        ),
        this.router.navigate(['listado-clientes'])
      }
    })

    
  }

  imagenCargadaFalse(){
    // this.imagenCargada = false
    console.log(this.imagenCargada)
  }

  uploadFile(event) {
    
    
    const newName = new Date().getTime().toString();
    const file = event.target.files[0];
    const extension = file.toString().substring(file.toString().lastIndexOf('.'))
    
    const filePath = 'clientes/' + newName + extension;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    task.then((objeto)=>{
      console.log('Imagen cargada con éxito.')
      ref.getDownloadURL().subscribe((url)=>{
        this.urlImagen = url
        this.imagenCargada = true;
      })
    })
    task.percentageChanges().subscribe((porcentaje)=>{
      this.porcentajeCarga = parseInt(porcentaje.toString());
    })

    
    
    

  }
  

}
