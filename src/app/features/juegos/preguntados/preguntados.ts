import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supabase } from '../../../shared/services/supabase';
import { PreguntaTrivia, ResultadoPreguntados } from '../../../shared/interfaces/juegos.interface';

/**
 * Componente Preguntados.
 * Obtiene preguntas de cultura general desde la API de Open Trivia DB.
 * El jugador debe elegir la respuesta correcta entre 4 opciones.
 * Al finalizar guarda el resultado en Supabase.
 */
@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit {

  private supabaseService = inject(Supabase);
  private http = inject(HttpClient);

  // Estado del juego
  preguntas = signal<PreguntaTrivia[]>([]);
  preguntaActual = signal<number>(0);
  opcionSeleccionada = signal<string>('');
  respondida = signal<boolean>(false);
  correctas = signal<number>(0);
  juegoTerminado = signal<boolean>(false);
  cargando = signal<boolean>(true);
  error = signal<boolean>(false);

  readonly TOTAL_PREGUNTAS = 10;

  ngOnInit() {
    this.cargarPreguntas();
  }

  /**
   * Carga las preguntas desde la API de Open Trivia DB.
   * Mezcla las opciones de respuesta para que no siempre
   * aparezca la correcta en la misma posición.
   */
  cargarPreguntas() {
    this.cargando.set(true);
    this.error.set(false);

    this.http.get<any>(
      `https://opentdb.com/api.php?amount=${this.TOTAL_PREGUNTAS}&type=multiple`
    ).subscribe({
      next: (data) => {
        const preguntas = data.results.map((p: any) => ({
          ...p,
          opciones: this.mezclarOpciones([
            p.correct_answer,
            ...p.incorrect_answers
          ])
        }));
        this.preguntas.set(preguntas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  /**
   * Mezcla un array de opciones aleatoriamente.
   * Usa el algoritmo Fisher-Yates shuffle.
   */
  mezclarOpciones(opciones: string[]): string[] {
    const arr = [...opciones];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Maneja la selección de una opción por el jugador.
   * Muestra si fue correcta o incorrecta antes de continuar.
   */
  async seleccionarOpcion(opcion: string) {
    if (this.respondida()) return;

    this.opcionSeleccionada.set(opcion);
    this.respondida.set(true);

    if (opcion === this.preguntas()[this.preguntaActual()].correct_answer) {
      this.correctas.update(n => n + 1);
    }

    // Esperamos 1.5 segundos antes de pasar a la siguiente pregunta
    setTimeout(async () => {
      if (this.preguntaActual() + 1 >= this.TOTAL_PREGUNTAS) {
        this.juegoTerminado.set(true);
        await this.guardarResultado();
      } else {
        this.preguntaActual.update(n => n + 1);
        this.opcionSeleccionada.set('');
        this.respondida.set(false);
      }
    }, 1500);
  }

  /**
   * Decodifica caracteres HTML especiales que vienen de la API.
   * La API devuelve entidades HTML como &quot; &#039; etc.
   */
  decodificarHTML(texto: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = texto;
    return txt.value;
  }

  /**
   * Retorna la clase CSS según el estado de la opción.
   */
  getClaseOpcion(opcion: string): string {
    if (!this.respondida()) return '';
    if (opcion === this.preguntas()[this.preguntaActual()].correct_answer) {
      return 'opcion-correcta';
    }
    if (opcion === this.opcionSeleccionada()) {
      return 'opcion-incorrecta';
    }
    return '';
  }

  /**
   * Guarda el resultado de la partida en Supabase.
   */
  async guardarResultado() {
    const usuario = await this.supabaseService.getUsuarioActual();
    if (!usuario) return;

    const resultado: ResultadoPreguntados = {
      usuarioEmail: usuario.email ?? '',
      preguntasCorrectas: this.correctas(),
      totalPreguntas: this.TOTAL_PREGUNTAS
    };

    await this.supabaseService.guardarResultadoPreguntados(resultado);
  }

  /**
   * Reinicia el juego cargando nuevas preguntas.
   */
  reiniciarJuego() {
    this.preguntaActual.set(0);
    this.opcionSeleccionada.set('');
    this.respondida.set(false);
    this.correctas.set(0);
    this.juegoTerminado.set(false);
    this.cargarPreguntas();
  }
}