import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mastergym';
  customClass = 'customClass';
  isFirstOpen = true;
  oneAtATime = true;
  cargando: boolean = true;

  constructor(public auth: AngularFireAuth) {
    this.auth.user.subscribe((usuario)=>{
      setTimeout(() => {
        this.cargando = false;
      }, 2000);
      
    })
  }
  // login() {

  //    this.auth.signInWithEmailAndPassword('ejemplo007@prueba.com', '123456789')
  //   // this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  // }

  
}
