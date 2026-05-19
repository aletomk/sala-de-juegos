import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../services/supabase';

/**
 * Componente Registro - Registro de nuevos usuarios.
 * 
 * Sprint 2: Conectado con Supabase Auth para crear la cuenta
 * y guardar los datos personales en la tabla 'usuarios'.
 * La contraseña NO se guarda en la DB, solo en Supabase Auth.
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  // Inyección de servicios con la forma moderna de Angular 21
  private supabaseService = inject(Supabase);
  private router = inject(Router);

  // Signals para cada campo del formulario
  nombre = signal('');
  apellido = signal('');
  edad = signal('');
  email = signal('');
  password = signal('');

  // Signals para mensajes de feedback
  errorMessage = signal('');
  successMessage = signal('');

  // Signal para controlar el estado de carga
  cargando = signal(false);

  /**
   * Maneja el registro del usuario.
   * 1. Valida los campos del formulario
   * 2. Crea la cuenta en Supabase Auth con signUp()
   * 3. Guarda los datos personales en la tabla 'usuarios'
   * 4. Navega automáticamente al Home
   */
  async onRegistro() {
    // Validación de campos vacíos
    if (!this.nombre() || !this.apellido() || !this.edad() || !this.email() || !this.password()) {
      this.errorMessage.set('Por favor completá todos los campos');
      this.successMessage.set('');
      return;
    }

    // Validación de edad
    const edadNum = Number(this.edad());
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 99) {
      this.errorMessage.set('Ingresá una edad válida');
      this.successMessage.set('');
      return;
    }

    this.cargando.set(true);
    this.errorMessage.set('');

    // Paso 1: Crear cuenta en Supabase Auth
    const { data, error } = await this.supabaseService.registrar(
      this.email(),
      this.password()
    );

    if (error) {
      // Mostramos el error en español
      if (error.message.includes('already registered')) {
        this.errorMessage.set('Este email ya está registrado');
      } else {
        this.errorMessage.set('Error al registrarse. Intentá de nuevo');
      }
      this.cargando.set(false);
      return;
    }

    // Paso 2: Guardar datos personales en la DB
    if (data.user) {
      await this.supabaseService.guardarUsuario({
        authId: data.user.id,
        nombre: this.nombre(),
        apellido: this.apellido(),
        edad: edadNum,
        email: this.email()
      });
    }

    this.cargando.set(false);
    // Paso 3: Navegar al Home
    this.router.navigate(['/home']);
  }
}