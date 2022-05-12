import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {

  clientes: any[] = new Array<any>();

  //  clientes: Observable<any[]>;
  constructor(private db: AngularFirestore) {
    // this.clientes = firestore.collection('clientes').valueChanges();
  }
    
  ngOnInit() {
    this.clientes.length = 0;
    this.db.collection('clientes').get().subscribe((resultado)=>{
      console.log(resultado.docs)

      resultado.docs.forEach((item)=>{

          let cliente:any = item.data();
          cliente.id = item.id;
          cliente.ref = item.ref;
          this.clientes.push(cliente)
          
        })
     })
   

  }

}
