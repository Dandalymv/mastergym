import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Inscripcion } from '../models/inscripcion';
import { MensajesService } from '../services/mensajes.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-listado-inscripciones',
  templateUrl: './listado-inscripciones.component.html',
  styleUrls: ['./listado-inscripciones.component.scss']
})
export class ListadoInscripcionesComponent implements OnInit {

  inscripciones: any[] = [];
  listadoInscripcion: AngularFirestoreDocument<Inscripcion>;
  constructor(private db: AngularFirestore) { 
    
  }

  ngOnInit(): void {
    this.inscripciones.length = 0;
    this.db.collection('inscripciones').get().subscribe((resultado)=>{
      resultado.forEach((inscripcion)=>{
        // console.log(inscripcion.data())

        let inscripcionObtenida: any = inscripcion.data();
        inscripcionObtenida.id = inscripcion.id
        // console.log(inscripcionObtenida)

        this.db.doc(inscripcionObtenida.cliente.path).get().subscribe((cliente)=>{
          // console.log(cliente.data());
          inscripcionObtenida.clienteObtenido = cliente.data();
          inscripcionObtenida.fecha = new Date(inscripcionObtenida.fecha.seconds * 1000 ); 
          inscripcionObtenida.fechaFinal = new Date(inscripcionObtenida.fechaFinal.seconds * 1000); 

          this.inscripciones.push(inscripcionObtenida);
          console.log(inscripcionObtenida);

        })
        
      })
    })
  }

  
  eliminarInscripcion(id: string){
    this.listadoInscripcion = this.db.doc<Inscripcion>(`inscripciones/${id}`); 
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
        this.listadoInscripcion.delete(),
        Swal.fire(
          'Eliminado!',
          'El registro ha sido borrado.',
          'success'
        ),
        this.ngOnInit()
      }
    })

    
  }

 

}
