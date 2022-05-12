import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss']
})
export class EncabezadoComponent implements OnInit {
  isCollapsed = true;
  
  constructor(public auth: AngularFireAuth) {
  }

  logout() {
    this.auth.signOut();
  }

  ngOnInit(): void {
  }
  
}

 




