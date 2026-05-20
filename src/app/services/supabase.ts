import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/**
 * Servicio principal de Supabase.
 * Centraliza la conexión con Supabase y expone métodos
 * para autenticación y operaciones con la base de datos.
 * 
 * Al ser providedIn: 'root' existe una única instancia
 * del cliente de Supabase en toda la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class Supabase {

  /**
   * Cliente de Supabase inicializado con las credenciales
   * del proyecto. Es la puerta de entrada a todos los
   * servicios: auth, database, storage, realtime.
   */
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // ─── AUTH ────────────────────────────────────────────────

  /**
   * Registra un nuevo usuario en Supabase Auth.
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   */
  async registrar(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  /**
   * Inicia sesión con email y contraseña.
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   */
  async login(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  async logout() {
    return await this.supabase.auth.signOut();
  }

  /**
   * Retorna el usuario actualmente logueado.
   * Retorna null si no hay sesión activa.
   */
  async getUsuarioActual() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  /**
   * Permite suscribirse a los cambios de estado de autenticación.
   * Se usa en el componente Home para detectar si el usuario
   * inicia o cierra sesión en tiempo real.
   */
  onAuthChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // ─── DATABASE ────────────────────────────────────────────

  /**
   * Guarda los datos personales del usuario en la tabla 'usuarios'.
   * La contraseña NO se guarda, solo los datos personales.
   * @param datos - Objeto con los datos del usuario
   */
  async guardarUsuario(datos: {
    authId: string;
    nombre: string;
    apellido: string;
    edad: number;
    email: string;
  }) {
    return await this.supabase
      .from('usuarios')
      .insert([datos]);
  }
}