import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../services/supabase';

/**
 * Componente Login - Inicio de sesión de usuarios.
 * 
 * Sprint 2: Conectado con Supabase Auth para autenticación real.
 * Incluye 3 botones de acceso rápido para testing.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // Inyección de servicios
  private supabaseService = inject(Supabase);
  private router = inject(Router);

  // Signals para los campos del formulario
  email = signal('');
  password = signal('');

  // Signals para feedback y estado de carga
  errorMessage = signal('');
  cargando = signal(false);

  /**
   * Usuarios de prueba para los 3 botones de acceso rápido.
   * Permiten testear la app sin tener que escribir credenciales.
   * Estos usuarios deben estar registrados previamente en Supabase.
   */
  usuariosRapidos = [
    { nombre: 'Usuario 1', email: 'usuario1@test.com', password: 'test1234' },
    { nombre: 'Usuario 2', email: 'usuario2@test.com', password: 'test1234' },
    { nombre: 'Usuario 3', email: 'usuario3@test.com', password: 'test1234' },
  ];

  /**
   * Maneja el inicio de sesión con email y contraseña.
   * Usa signInWithPassword de Supabase Auth.
   * En caso de éxito navega al Home automáticamente.
   */
  async onLogin() {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Por favor completá todos los campos');
      return;
    }

    this.cargando.set(true);
    this.errorMessage.set('');

    const { error } = await this.supabaseService.login(
      this.email(),
      this.password()
    );

    if (error) {
      this.errorMessage.set('Email o contraseña incorrectos');
      this.cargando.set(false);
      return;
    }

    this.cargando.set(false);
    this.router.navigate(['/home']);
  }

  /**
   * Maneja el inicio de sesión rápido con usuarios de prueba.
   * Recibe el objeto del usuario y llama al mismo método de login.
   * @param usuario - Objeto con email y password del usuario de prueba
   */
  async loginRapido(usuario: { email: string; password: string }) {
    this.email.set(usuario.email);
    this.password.set(usuario.password);
    await this.onLogin();
  }
}