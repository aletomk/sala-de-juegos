import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { Supabase } from '../../../shared/services/supabase';
import { ResultadoAhorcado } from '../../../shared/interfaces/juegos.interface';

/**
 * Componente Ahorcado.
 * El jugador debe adivinar una palabra letra por letra
 * usando botones del abecedario (no teclado).
 * Tiene un máximo de 6 intentos fallidos antes de perder.
 * Al finalizar guarda el resultado en Supabase.
 */
@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class Ahorcado implements OnInit {

  private supabaseService = inject(Supabase);

  // Lista de palabras posibles
private palabras = [
  // Tecnología
  'ANGULAR', 'TYPESCRIPT', 'JAVASCRIPT', 'COMPONENTE',
  'SERVICIO', 'INTERFACE', 'SIGNAL', 'ROUTER',
  'SUPABASE', 'FIREBASE', 'PROGRAMACION', 'DESARROLLO',
  'ALGORITMO', 'VARIABLE', 'FUNCION', 'CLASE',
  'OBJETO', 'ARRAY', 'METODO', 'MODULO',
  // Automotriz
  'MOTOR', 'TRANSMISION', 'SUSPENSION', 'CARBURADOR',
  'TURBOCOMPRESOR', 'DIFERENCIAL', 'EMBRAGUE', 'RADIADOR',
  'ALTERNADOR', 'AMORTIGUADOR', 'FRENOS', 'VOLANTE',
  // General
  'INTERNET', 'COMPUTADORA', 'TECLADO', 'MONITOR',
  'IMPRESORA', 'SERVIDOR', 'BASE', 'DATOS',
  'SEGURIDAD', 'SISTEMA', 'PROCESO', 'MEMORIA'
];

  // Estado del juego
  palabraSecreta = signal<string>('');
  letrasUsadas = signal<string[]>([]);
  intentosFallidos = signal<number>(0);
  juegoTerminado = signal<boolean>(false);
  gano = signal<boolean>(false);
  tiempoInicio = signal<number>(0);

  // Máximo de intentos fallidos permitidos
  readonly MAX_INTENTOS = 6;

  // Abecedario completo para los botones
  readonly ABECEDARIO = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  /**
   * computed() → letras de la palabra que el jugador ya adivinó.
   * Muestra '_' para las letras no adivinadas todavía.
   */
  palabraMostrada = computed(() =>
    this.palabraSecreta().split('').map(letra =>
      this.letrasUsadas().includes(letra) ? letra : '_'
    )
  );

  /**
   * computed() → letras incorrectas usadas hasta ahora.
   */
  letrasIncorrectas = computed(() =>
    this.letrasUsadas().filter(l => !this.palabraSecreta().includes(l))
  );

  ngOnInit() {
    this.iniciarJuego();
  }

  /**
   * Inicia o reinicia el juego eligiendo una palabra aleatoria.
   */
  iniciarJuego() {
    const indice = Math.floor(Math.random() * this.palabras.length);
    this.palabraSecreta.set(this.palabras[indice]);
    this.letrasUsadas.set([]);
    this.intentosFallidos.set(0);
    this.juegoTerminado.set(false);
    this.gano.set(false);
    this.tiempoInicio.set(Date.now());
  }

  /**
   * Retorna el dibujo ASCII del ahorcado según los intentos fallidos.
   */
  getDibujo(): string {
    const dibujos = [
      `
    +---+
    |   |
        |
        |
        |
        |
  =========`,
      `
    +---+
    |   |
    O   |
        |
        |
        |
  =========`,
      `
    +---+
    |   |
    O   |
    |   |
        |
        |
  =========`,
      `
    +---+
    |   |
    O   |
  /|   |
        |
        |
  =========`,
      `
    +---+
    |   |
    O   |
  /|\\  |
        |
        |
  =========`,
      `
    +---+
    |   |
    O   |
  /|\\  |
  /    |
        |
  =========`,
      `
    +---+
    |   |
    O   |
  /|\\  |
  / \\  |
        |
  =========`
    ];
    return dibujos[this.intentosFallidos()];
  }

  /**
   * Maneja la selección de una letra por el jugador.
   * Verifica si la letra está en la palabra y actualiza el estado.
   * @param letra - Letra seleccionada por el jugador
   */
  async seleccionarLetra(letra: string) {
    if (this.juegoTerminado() || this.letrasUsadas().includes(letra)) return;

    // Agregamos la letra a las usadas
    this.letrasUsadas.update(letras => [...letras, letra]);

    // Si la letra no está en la palabra, incrementamos los fallos
    if (!this.palabraSecreta().includes(letra)) {
      this.intentosFallidos.update(n => n + 1);
    }

    // Verificamos condición de victoria
    const todasAdivinadas = this.palabraSecreta()
      .split('')
      .every(l => this.letrasUsadas().includes(l));

    if (todasAdivinadas) {
      this.gano.set(true);
      this.juegoTerminado.set(true);
      await this.guardarResultado();
    }

    // Verificamos condición de derrota
    if (this.intentosFallidos() >= this.MAX_INTENTOS) {
      this.gano.set(false);
      this.juegoTerminado.set(true);
      await this.guardarResultado();
    }
  }

  /**
   * Guarda el resultado de la partida en Supabase.
   */
  async guardarResultado() {
    const usuario = await this.supabaseService.getUsuarioActual();
    if (!usuario) return;

    const tiempoSegundos = Math.floor((Date.now() - this.tiempoInicio()) / 1000);

    const resultado: ResultadoAhorcado = {
      usuarioEmail: usuario.email ?? '',
      palabra: this.palabraSecreta(),
      letrasUsadas: this.letrasUsadas().length,
      gano: this.gano(),
      tiempoSegundos
    };

    await this.supabaseService.guardarResultadoAhorcado(resultado);
  }
}