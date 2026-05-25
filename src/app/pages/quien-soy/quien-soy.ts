import { Component, signal, inject, OnInit } from '@angular/core';
import { GitHub } from '../../shared/services/github';
import { UsuarioGitHub } from '../../shared/interfaces/usuario.interface';

/**
 * Componente Quién Soy.
 * Muestra los datos personales del alumno obtenidos desde la API de GitHub,
 * incluyendo avatar, estadísticas, gráfico de actividad y descripción
 * del juego propio desarrollado en el TP.
 */
@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {

  private githubService = inject(GitHub);

  // Reemplazamos signal<any> por signal<UsuarioGitHub | null>
  usuario = signal<UsuarioGitHub | null>(null);
  cargando = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit() {
    this.githubService.getUser('aletomk').subscribe({
      next: (data: UsuarioGitHub) => {
        this.usuario.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}