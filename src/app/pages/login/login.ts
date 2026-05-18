import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // Signals para los campos del formulario
  email = signal('');
  password = signal('');

  // Signal para manejar errores
  errorMessage = signal('');

  onLogin() {
    // Por ahora solo validamos que los campos no estén vacíos
    // En Sprint 2 conectamos con Supabase
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Por favor completá todos los campos');
      return;
    }

    console.log('Login con:', this.email(), this.password());
  }
}
