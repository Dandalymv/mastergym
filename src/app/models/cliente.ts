import { DocumentReference } from "@angular/fire/compat/firestore";

export class Cliente{
    id: string;
    ref: DocumentReference;
    nombre: string;
    apellido: string;
    correo: string;
    fechaNacimiento: Date;
    imgURL: string;
    telefono: number;
    cedula: string;
    visible: boolean;

    construnctor(){
        
    }
}