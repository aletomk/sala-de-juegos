import { Component, signal, inject, OnInit } from '@angular/core';
import { GitHub } from '../../services/github';

/**
 * Componente Quién Soy.
 * Muestra los datos personales del alumno obtenidos desde la API de GitHub,
 * incluyendo avatar, estadísticas, gráfico de actividad y descripción
 * del juego propio desarrollado en el TP.
 * 
 * Implementa OnInit para ejecutar la llamada a la API
 * una vez que el componente está inicializado en el DOM.
 */
@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {

  // Inyección del servicio de GitHub usando la forma moderna de Angular 21
  private githubService = inject(GitHub);

  /**
   * Signals para manejar el estado del componente de forma reactiva.
   * Cuando un signal cambia, Angular actualiza automáticamente
   * solo las partes del DOM que dependen de ese signal.
   * 
   * usuario → almacena los datos del perfil de GitHub
   * cargando → controla la visibilidad del spinner de carga
   * error → controla la visibilidad del mensaje de error
   */
  usuario = signal<any>(null);
  cargando = signal<boolean>(true);
  error = signal<boolean>(false);

  /**
   * Hook del ciclo de vida de Angular.
   * Se ejecuta una sola vez cuando el componente termina de inicializarse.
   * Es el lugar ideal para realizar llamadas a APIs externas.
   */
  ngOnInit() {
    this.githubService.getUser('aletomk').subscribe({
      // next → se ejecuta cuando la API responde exitosamente
      next: (data) => {
        this.usuario.set(data);    // guardamos los datos en el signal
        this.cargando.set(false);  // ocultamos el spinner
      },
      // error → se ejecuta si la API falla o no hay conexión
      error: () => {
        this.error.set(true);      // mostramos el mensaje de error
        this.cargando.set(false);  // ocultamos el spinner
      }
    });
  }

  /**
   * Formatea una fecha ISO 8601 (formato de GitHub) a formato legible en español.
   * @param fecha - String de fecha en formato ISO (ej: "2020-03-15T00:00:00Z")
   * @returns String con la fecha formateada (ej: "15 de marzo de 2020")
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}