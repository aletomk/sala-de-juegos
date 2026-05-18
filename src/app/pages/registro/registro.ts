import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  // Signals para cada campo del formulario
  nombre = signal('');
  apellido = signal('');
  edad = signal('');
  email = signal('');
  password = signal('');

  // Signal para mensajes
  errorMessage = signal('');
  successMessage = signal('');

  onRegistro() {
    // Validamos que todos los campos estén completos
    if (!this.nombre() || !this.apellido() || !this.edad() || !this.email() || !this.password()) {
      this.errorMessage.set('Por favor completá todos los campos');
      this.successMessage.set('');
      return;
    }

    // Validamos que la edad sea un número válido
    const edadNum = Number(this.edad());
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 99) {
      this.errorMessage.set('Ingresá una edad válida');
      this.successMessage.set('');
      return;
    }

    // Por ahora solo mostramos los datos en consola
    // En Sprint 2 conectamos con Supabase
    console.log('Registro con:', {
      nombre: this.nombre(),
      apellido: this.apellido(),
      edad: this.edad(),
      email: this.email()
      // la contraseña NO se loguea por seguridad
    });

    this.errorMessage.set('');
    this.successMessage.set('¡Registro exitoso! Ya podés iniciar sesión.');
  }
}
