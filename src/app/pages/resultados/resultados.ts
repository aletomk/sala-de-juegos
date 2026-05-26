import { Component, signal, inject, OnInit } from '@angular/core';
import { Supabase } from '../../shared/services/supabase';

/**
 * Componente Resultados.
 * Muestra 4 tablas con los resultados de cada juego
 * ordenados de mejor a peor desempeño.
 */
@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class Resultados implements OnInit {

  private supabaseService = inject(Supabase);

  // Signals para cada tabla de resultados
  resultadosAhorcado = signal<any[]>([]);
  resultadosMayorMenor = signal<any[]>([]);
  resultadosPreguntados = signal<any[]>([]);
  resultadosLogoQuiz = signal<any[]>([]);

  cargando = signal<boolean>(true);

  async ngOnInit() {
    await this.cargarResultados();
  }

  /**
   * Carga todos los resultados desde Supabase en paralelo.
   * Usa Promise.all para hacer las 4 consultas simultáneamente.
   */
  async cargarResultados() {
    this.cargando.set(true);

    const [ahorcado, mayorMenor, preguntados, logoQuiz] = await Promise.all([
      this.supabaseService.getResultadosAhorcado(),
      this.supabaseService.getResultadosMayorMenor(),
      this.supabaseService.getResultadosPreguntados(),
      this.supabaseService.getResultadosLogoQuiz()
    ]);

    if (ahorcado.data) this.resultadosAhorcado.set(ahorcado.data);
    if (mayorMenor.data) this.resultadosMayorMenor.set(mayorMenor.data);
    if (preguntados.data) this.resultadosPreguntados.set(preguntados.data);
    if (logoQuiz.data) this.resultadosLogoQuiz.set(logoQuiz.data);

    this.cargando.set(false);
  }
}