import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Componente Login - Inicio de sesión de usuarios.
 * 
 * Sprint 1: Validación básica de campos vacíos, sin conexión a Supabase.
 * Sprint 2: Se conectará con Supabase Auth para autenticación real
 *           con email y contraseña, y se agregarán 3 botones de acceso rápido.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  /**
   * Signals para los campos del formulario.
   * Usamos signals en lugar de [(ngModel)] que es la forma
   * moderna de Angular 21 para manejar estado reactivo.
   * Cada vez que el usuario escribe, el signal se actualiza
   * con email.set() y password.set() desde el template.
   */
  email = signal('');
  password = signal('');

  // Signal para mostrar mensajes de error sin usar alert()
  errorMessage = signal('');

  /**
   * Maneja el intento de inicio de sesión.
   * En Sprint 1 solo valida que los campos no estén vacíos.
   * En Sprint 2 se conectará con supabase.auth.signInWithPassword()
   */
  onLogin() {
    // Validación básica de campos vacíos
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Por favor completá todos los campos');
      return;
    }

    console.log('Login con:', this.email(), this.password());
  }
}