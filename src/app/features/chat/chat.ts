import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Supabase } from '../../shared/services/supabase';
import { MensajeChat } from '../../shared/interfaces/juegos.interface';

/**
 * Componente Chat.
 * Usa polling cada 3 segundos para simular tiempo real
 * sin necesitar Supabase Realtime (función de pago).
 */
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {

  private supabaseService = inject(Supabase);

  mensajes = signal<MensajeChat[]>([]);
  nuevoMensaje = signal<string>('');
  usuarioEmail = signal<string>('');

  // Referencia al intervalo para cancelarlo en OnDestroy
  private intervalo: any;

  async ngOnInit() {
    const usuario = await this.supabaseService.getUsuarioActual();
    if (usuario) {
      this.usuarioEmail.set(usuario.email ?? '');
    }

    await this.cargarMensajes();

    // Polling cada 3 segundos
    this.intervalo = setInterval(() => {
      this.cargarMensajes();
    }, 3000);
  }

  ngOnDestroy() {
    // Cancelamos el intervalo cuando el componente se destruye
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  async cargarMensajes() {
    const { data, error } = await this.supabaseService.getMensajes();
    if (!error && data) {
      this.mensajes.set(data);
    }
  }

  async enviarMensaje() {
    const texto = this.nuevoMensaje().trim();
    if (!texto) return;

    await this.supabaseService.enviarMensaje(this.usuarioEmail(), texto);
    this.nuevoMensaje.set('');

    // Cargamos inmediatamente después de enviar sin esperar el intervalo
    await this.cargarMensajes();
  }

  /**
   * Formatea la hora del mensaje de forma corta.
   */
  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  esMensajePropio(email: string): boolean {
    return email === this.usuarioEmail();
  }
}