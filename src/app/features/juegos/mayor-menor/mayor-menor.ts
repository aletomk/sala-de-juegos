import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { Supabase } from '../../../shared/services/supabase';
import { ResultadoMayorMenor } from '../../../shared/interfaces/juegos.interface';

/**
 * Componente Mayor o Menor.
 * Se muestra una carta de baraja española y el jugador
 * debe adivinar si la próxima carta será mayor o menor.
 * Al finalizar guarda el resultado en Supabase.
 */
@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenor implements OnInit {

  private supabaseService = inject(Supabase);

  // Baraja española: palos y valores
  readonly PALOS = ['oros', 'copas', 'espadas', 'bastos'];
  readonly VALORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  readonly NOMBRES_VALORES: { [key: number]: string } = {
    1: 'As', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
    7: '7', 8: '8', 9: '9', 10: '10', 11: 'Sota', 12: 'Caballo'
  };

  // Estado del juego
  cartaActual = signal<{ valor: number; palo: string } | null>(null);
  cartaSiguiente = signal<{ valor: number; palo: string } | null>(null);
  cartasAcertadas = signal<number>(0);
  juegoTerminado = signal<boolean>(false);
  mensajeResultado = signal<string>('');
  acierto = signal<boolean>(false);
  mostrandoResultado = signal<boolean>(false);

  ngOnInit() {
    this.iniciarJuego();
  }

  /**
   * Genera una carta aleatoria de la baraja española.
   */
  private generarCarta(): { valor: number; palo: string } {
    const valor = this.VALORES[Math.floor(Math.random() * this.VALORES.length)];
    const palo = this.PALOS[Math.floor(Math.random() * this.PALOS.length)];
    return { valor, palo };
  }

  /**
   * Inicia o reinicia el juego.
   */
  iniciarJuego() {
    this.cartaActual.set(this.generarCarta());
    this.cartaSiguiente.set(null);
    this.cartasAcertadas.set(0);
    this.juegoTerminado.set(false);
    this.mensajeResultado.set('');
    this.mostrandoResultado.set(false);
  }

  /**
   * Maneja la elección del jugador (mayor o menor).
   * @param eleccion - 'mayor' o 'menor'
   */
  async elegir(eleccion: 'mayor' | 'menor') {
    if (this.juegoTerminado() || this.mostrandoResultado()) return;

    const siguiente = this.generarCarta();
    this.cartaSiguiente.set(siguiente);
    this.mostrandoResultado.set(true);

    const cartaActualValor = this.cartaActual()!.valor;
    const cartaSiguienteValor = siguiente.valor;

    // Verificamos si acertó
    const acerto =
      (eleccion === 'mayor' && cartaSiguienteValor > cartaActualValor) ||
      (eleccion === 'menor' && cartaSiguienteValor < cartaActualValor);

    if (acerto) {
      this.cartasAcertadas.update(n => n + 1);
      this.acierto.set(true);
      this.mensajeResultado.set('¡Correcto!');

      // Esperamos 1.5 segundos y continuamos
      setTimeout(() => {
        this.cartaActual.set(siguiente);
        this.cartaSiguiente.set(null);
        this.mostrandoResultado.set(false);
        this.mensajeResultado.set('');
      }, 1500);

    } else {
      this.acierto.set(false);
      this.mensajeResultado.set('¡Incorrecto! Fin del juego');
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

    const resultado: ResultadoMayorMenor = {
      usuarioEmail: usuario.email ?? '',
      cartasAcertadas: this.cartasAcertadas()
    };

    await this.supabaseService.guardarResultadoMayorMenor(resultado);
  }

  /**
   * Retorna el nombre legible de una carta.
   */
  getNombreCarta(carta: { valor: number; palo: string }): string {
    return `${this.NOMBRES_VALORES[carta.valor]} de ${carta.palo}`;
  }
}