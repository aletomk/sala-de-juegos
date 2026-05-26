import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { Supabase } from '../../../shared/services/supabase';
import { ResultadoLogoQuiz } from '../../../shared/interfaces/juegos.interface';

/**
 * Componente Logo Quiz Automotriz - Juego Propio.
 * El jugador debe adivinar la marca de auto según su logo.
 * Tiene 3 niveles de dificultad con 5 logos cada uno.
 * Las opciones de respuesta son botones (4 opciones).
 * Al finalizar guarda el resultado en Supabase.
 */
@Component({
  selector: 'app-logo-quiz',
  standalone: true,
  imports: [],
  templateUrl: './logo-quiz.html',
  styleUrl: './logo-quiz.css'
})
export class LogoQuiz implements OnInit {

  private supabaseService = inject(Supabase);

  // Niveles del juego con sus logos
  readonly NIVELES = {
    facil: [
      { marca: 'Ford', logo: 'https://www.carlogos.org/car-logos/ford-logo-2017-download.png', opciones: ['Ford', 'Chevrolet', 'Dodge', 'Jeep'] },
      { marca: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo-2020-gray.png', opciones: ['BMW', 'Mercedes', 'Audi', 'Volkswagen'] },
      { marca: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo-2016.png', opciones: ['Audi', 'BMW', 'Mercedes', 'Volkswagen'] },
      { marca: 'Chevrolet', logo: 'https://cdn.freebiesupply.com/logos/large/2x/chevrolet-logo-png-transparent.png', opciones: ['Chevrolet', 'Ford', 'Dodge', 'Jeep'] },
      { marca: 'Volkswagen', logo: 'https://cdn.freebiesupply.com/logos/large/2x/volkswagen-logo-png-transparent.png', opciones: ['Volkswagen', 'Audi', 'Skoda', 'Seat'] },
    ],
    medio: [
      { marca: 'Mercedes-Benz', logo: 'https://cdn.freebiesupply.com/logos/large/2x/mercedes-benz-logo-png-transparent.png', opciones: ['Mercedes-Benz', 'BMW', 'Porsche', 'Audi'] },
      { marca: 'Ferrari', logo: 'https://cdn.freebiesupply.com/logos/large/2x/ferrari-logo-png-transparent.png', opciones: ['Ferrari', 'Lamborghini', 'Maserati', 'Alfa Romeo'] },
      { marca: 'Lamborghini', logo: 'https://cdn.freebiesupply.com/logos/large/2x/lamborghini-logo-png-transparent.png', opciones: ['Lamborghini', 'Ferrari', 'Bugatti', 'Porsche'] },
      { marca: 'Porsche', logo: 'https://cdn.freebiesupply.com/logos/large/2x/porsche-logo-png-transparent.png', opciones: ['Porsche', 'Ferrari', 'Lamborghini', 'Aston Martin'] },
      { marca: 'Nissan', logo: 'https://cdn.freebiesupply.com/logos/large/2x/nissan-logo-png-transparent.png', opciones: ['Nissan', 'Toyota', 'Honda', 'Mazda'] },
    ],
    dificil: [
      { marca: 'Alfa Romeo', logo: 'https://cdn.freebiesupply.com/logos/large/2x/alfa-romeo-logo-png-transparent.png', opciones: ['Alfa Romeo', 'Ferrari', 'Maserati', 'Lancia'] },
      { marca: 'Maserati', logo: 'https://cdn.freebiesupply.com/logos/large/2x/maserati-logo-png-transparent.png', opciones: ['Maserati', 'Ferrari', 'Alfa Romeo', 'Lamborghini'] },
      { marca: 'Bentley', logo: 'https://cdn.freebiesupply.com/logos/large/2x/bentley-logo-png-transparent.png', opciones: ['Bentley', 'Rolls Royce', 'Aston Martin', 'Jaguar'] },
      { marca: 'Aston Martin', logo: 'https://cdn.freebiesupply.com/logos/large/2x/aston-martin-logo-png-transparent.png', opciones: ['Aston Martin', 'Bentley', 'Rolls Royce', 'Jaguar'] },
      { marca: 'Mitsubishi', logo: 'https://cdn.freebiesupply.com/logos/large/2x/mitsubishi-logo-png-transparent.png', opciones: ['Mitsubishi', 'Mazda', 'Suzuki', 'Honda'] },
    ]
  };

  // Estado del juego
  nivelActual = signal<'facil' | 'medio' | 'dificil'>('facil');
  logoActual = signal<number>(0);
  opcionSeleccionada = signal<string>('');
  respondida = signal<boolean>(false);
  acierto = signal<boolean>(false);
  puntaje = signal<number>(0);
  juegoTerminado = signal<boolean>(false);
  nivelCompletado = signal<boolean>(false);

  // computed que retorna los logos del nivel actual
  logosNivel = computed(() => this.NIVELES[this.nivelActual()]);

  // computed que retorna el logo actual
  logoEnJuego = computed(() => this.logosNivel()[this.logoActual()]);

  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.nivelActual.set('facil');
    this.logoActual.set(0);
    this.opcionSeleccionada.set('');
    this.respondida.set(false);
    this.puntaje.set(0);
    this.juegoTerminado.set(false);
    this.nivelCompletado.set(false);
  }

  /**
   * Maneja la selección de una opción por el jugador.
   */
  async seleccionarOpcion(opcion: string) {
    if (this.respondida()) return;

    this.opcionSeleccionada.set(opcion);
    this.respondida.set(true);

    const esCorrecta = opcion === this.logoEnJuego().marca;
    this.acierto.set(esCorrecta);

    if (esCorrecta) {
      // Puntaje según nivel
      const puntos = this.nivelActual() === 'facil' ? 10 :
                     this.nivelActual() === 'medio' ? 20 : 30;
      this.puntaje.update(p => p + puntos);
    }

    setTimeout(async () => {
      const siguientelogo = this.logoActual() + 1;

      if (siguientelogo >= this.logosNivel().length) {
        // Completamos el nivel actual
        if (this.nivelActual() === 'facil') {
          this.nivelActual.set('medio');
          this.logoActual.set(0);
          this.nivelCompletado.set(true);
          setTimeout(() => this.nivelCompletado.set(false), 2000);
        } else if (this.nivelActual() === 'medio') {
          this.nivelActual.set('dificil');
          this.logoActual.set(0);
          this.nivelCompletado.set(true);
          setTimeout(() => this.nivelCompletado.set(false), 2000);
        } else {
          // Completamos todos los niveles
          this.juegoTerminado.set(true);
          await this.guardarResultado();
        }
      } else {
        this.logoActual.update(n => n + 1);
      }

      this.opcionSeleccionada.set('');
      this.respondida.set(false);
    }, 1500);
  }

  async guardarResultado() {
    const usuario = await this.supabaseService.getUsuarioActual();
    if (!usuario) return;

    const resultado: ResultadoLogoQuiz = {
      usuarioEmail: usuario.email ?? '',
      puntaje: this.puntaje(),
      nivelAlcanzado: this.nivelActual()
    };

    await this.supabaseService.guardarResultadoLogoQuiz(resultado);
  }

  getNombreNivel(): string {
    const nombres = { facil: '🟢 Fácil', medio: '🟡 Medio', dificil: '🔴 Difícil' };
    return nombres[this.nivelActual()];
  }
}