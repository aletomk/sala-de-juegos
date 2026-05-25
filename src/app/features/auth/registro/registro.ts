import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../../shared/services/supabase';
import { Usuario } from '../../../shared/interfaces/usuario.interface';

/**
 * Componente Registro - Registro de nuevos usuarios.
 * Sprint 3: Validaciones por campo con mensajes específicos.
 * La contraseña requiere mínimo 6 caracteres (requerimiento de Supabase).
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  private supabaseService = inject(Supabase);
  private router = inject(Router);

  // Signals para cada campo del formulario
  nombre = signal('');
  apellido = signal('');
  edad = signal('');
  email = signal('');
  password = signal('');

  // Signal para controlar si el usuario ya intentó enviar el formulario
  // Solo mostramos errores por campo después del primer intento
  submitted = signal(false);

  // Signal para errores globales y estado de carga
  errorMessage = signal('');
  cargando = signal(false);

  // ─── Validaciones por campo ───────────────────────────────

  /**
   * computed() → signal derivado de solo lectura.
   * Se recalcula automáticamente cuando cambia el signal del que depende.
   */
  errorNombre = computed(() =>
    this.submitted() && !this.nombre().trim()
      ? 'El nombre es requerido'
      : ''
  );

  errorApellido = computed(() =>
    this.submitted() && !this.apellido().trim()
      ? 'El apellido es requerido'
      : ''
  );

  errorEdad = computed(() => {
    if (!this.submitted()) return '';
    const edadNum = Number(this.edad());
    if (!this.edad()) return 'La edad es requerida';
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 99) return 'Ingresá una edad válida entre 1 y 99';
    return '';
  });

  errorEmail = computed(() => {
    if (!this.submitted()) return '';
    if (!this.email()) return 'El email es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) return 'Ingresá un email válido';
    return '';
  });

  errorPassword = computed(() => {
    if (!this.submitted()) return '';
    if (!this.password()) return 'La contraseña es requerida';
    if (this.password().length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  });

  // Computed que verifica si el formulario completo es válido
  formularioValido = computed(() =>
    !this.errorNombre() &&
    !this.errorApellido() &&
    !this.errorEdad() &&
    !this.errorEmail() &&
    !this.errorPassword()
  );

  async onRegistro() {
    // Marcamos como submitted para mostrar los errores por campo
    this.submitted.set(true);

    if (!this.formularioValido()) return;

    this.cargando.set(true);
    this.errorMessage.set('');

    const { data, error } = await this.supabaseService.registrar(
      this.email(),
      this.password()
    );

    if (error) {
      if (error.message.includes('already registered')) {
        this.errorMessage.set('Este email ya está registrado');
      } else {
        this.errorMessage.set('Error al registrarse. Intentá de nuevo');
      }
      this.cargando.set(false);
      return;
    }

    if (data.user) {
      const usuarioData: Usuario = {
        authId: data.user.id,
        nombre: this.nombre(),
        apellido: this.apellido(),
        edad: Number(this.edad()),
        email: this.email()
      };
      await this.supabaseService.guardarUsuario(usuarioData);
    }

    this.cargando.set(false);
    this.router.navigate(['/home']);
  }
}