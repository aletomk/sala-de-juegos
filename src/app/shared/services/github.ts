import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Servicio para consumir la API pública de GitHub.
 * 
 * @Injectable({ providedIn: 'root' }) → registra el servicio como singleton,
 * es decir, existe una única instancia en toda la aplicación.
 * 
 * inject(HttpClient) → forma moderna de Angular 21 para inyectar dependencias,
 * reemplaza la inyección por constructor que era el estándar anterior.
 */
@Injectable({
  providedIn: 'root'
})
export class GitHub {
  
  // Inyección moderna de HttpClient sin usar constructor
  private http = inject(HttpClient);
  
  /**
   * Obtiene los datos públicos de un usuario de GitHub.
   * @param username - Nombre de usuario de GitHub
   * @returns Observable con los datos del usuario
   * 
   * El método retorna un Observable, que es un flujo de datos asíncrono.
   * El componente que lo consume debe suscribirse con .subscribe()
   * para recibir la respuesta cuando llegue.
   */
  getUser(username: string) {
    return this.http.get<any>(`https://api.github.com/users/${username}`);
  }
}