import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  datosCorrectos: boolean = true;
  formularioLogin!: FormGroup;
  textoErrorLogin: string = '';

  constructor(private creadorFormulario: FormBuilder, public auth: AngularFireAuth, private spinner: NgxSpinnerService) {
  }


  ngOnInit(): void {
    this.formularioLogin = this.creadorFormulario.group({
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      password: ['', Validators.required]
    })
  }

  ingresar(){
    if(this.formularioLogin.valid){
      this.datosCorrectos = true;
      this.spinner.show();
      this.auth.signInWithEmailAndPassword(this.formularioLogin.value.email, this.formularioLogin.value.password).then((usuario)=>{
        console.log(usuario)
        this.spinner.hide();
        
      }).catch((error)=>{
        this.datosCorrectos = false;
        this.textoErrorLogin = error.message;
        this.spinner.hide();      
      })
    }
    else{
      this.datosCorrectos = false;
      this.textoErrorLogin = 'Por favor revisa que los datos ingresados sean correctos'
    }
   
  }

  ingresarGmail(){
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }



}
