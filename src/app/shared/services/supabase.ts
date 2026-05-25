import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ResultadoAhorcado, ResultadoMayorMenor } from '../interfaces/juegos.interface';

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

  // ─── JUEGOS ──────────────────────────────────────────────

  /**
   * Guarda el resultado de una partida de Ahorcado en la DB.
   */
  async guardarResultadoAhorcado(resultado: ResultadoAhorcado) {
    return await this.supabase
      .from('ahorcado_resultados')
      .insert([resultado]);
  }

  /**
   * Guarda el resultado de una partida de Mayor o Menor en la DB.
   */
  async guardarResultadoMayorMenor(resultado: ResultadoMayorMenor) {
    return await this.supabase
      .from('mayor_menor_resultados')
      .insert([resultado]);
  }

  // ─── CHAT ────────────────────────────────────────────────

  /**
   * Interface para los mensajes del chat.
   */

  /**
   * Obtiene todos los mensajes del chat ordenados por fecha.
   */
  async getMensajes() {
    return await this.supabase
      .from('chat_mensajes')
      .select('*')
      .order('created_at', { ascending: true });
  }

  /**
   * Envía un mensaje al chat y lo guarda en la DB.
   */
  async enviarMensaje(usuarioEmail: string, mensaje: string) {
    return await this.supabase
      .from('chat_mensajes')
      .insert([{ usuarioEmail, mensaje }]);
  }

  /**
   * Se suscribe a los mensajes nuevos del chat en tiempo real.
   * Cada vez que se inserta un mensaje nuevo en la DB,
   * el callback se ejecuta automáticamente sin recargar la página.
   */
  suscribirseAlChat(callback: (mensaje: any) => void) {
    return this.supabase
      .channel('chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_mensajes'
      }, payload => callback(payload.new))
      .subscribe();
  }
}