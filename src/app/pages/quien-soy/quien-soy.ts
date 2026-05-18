import { Component, signal, inject, OnInit } from '@angular/core';
import { GitHub } from '../../services/github';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {

  private githubService = inject(GitHub);

  usuario = signal<any>(null);
  cargando = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit() {
    this.githubService.getUser('aletomk').subscribe({
      next: (data) => {
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