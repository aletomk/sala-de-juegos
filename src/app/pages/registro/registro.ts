import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Componente Registro - Registro de nuevos usuarios.
 * 
 * Sprint 1: Validación de campos y formato, sin conexión a Supabase.
 * Sprint 2: Se conectará con Supabase Auth para crear la cuenta
 *           y guardar los datos personales en la base de datos.
 *           La contraseña NO se guarda en la DB, solo en Supabase Auth.
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  /**
   * Signals para cada campo del formulario.
   * Se actualizan desde el template con el evento (input)
   * usando la sintaxis: (input)="campo.set($any($event.target).value)"
   * que es la forma Angular 21 de manejar inputs sin ngModel.
   */
  nombre = signal('');
  apellido = signal('');
  edad = signal('');
  email = signal('');
  password = signal('');

  // Signals para mensajes de feedback al usuario
  errorMessage = signal('');
  successMessage = signal('');

  /**
   * Maneja el intento de registro.
   * Valida todos los campos antes de proceder.
   * En Sprint 2 se conectará con supabase.auth.signUp()
   * y guardará los datos en la tabla usuarios de Supabase.
   */
  onRegistro() {
    // Validación de campos vacíos
    if (!this.nombre() || !this.apellido() || !this.edad() || !this.email() || !this.password()) {
      this.errorMessage.set('Por favor completá todos los campos');
      this.successMessage.set('');
      return;
    }

    // Validación de edad: debe ser un número entre 1 y 99
    const edadNum = Number(this.edad());
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 99) {
      this.errorMessage.set('Ingresá una edad válida');
      this.successMessage.set('');
      return;
    }

    // En Sprint 2 este console.log se reemplaza por la llamada a Supabase
    console.log('Registro con:', {
      nombre: this.nombre(),
      apellido: this.apellido(),
      edad: this.edad(),
      email: this.email()
      // la contraseña NO se loguea ni se guardará en la DB
    });

    this.errorMessage.set('');
    this.successMessage.set('¡Registro exitoso! Ya podés iniciar sesión.');
  }
}