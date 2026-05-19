import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../services/supabase';

/**
 * Componente Home - Página principal de la Sala de Juegos.
 * 
 * Sprint 2: Muestra contenido condicional según el estado de auth.
 * - Usuario NO logueado: muestra botones de Login y Registro
 * - Usuario logueado: muestra su nombre y botón de cerrar sesión
 * 
 * Implementa OnDestroy para limpiar la suscripción al auth
 * cuando el componente se destruye y evitar memory leaks.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {

  private supabaseService = inject(Supabase);
  private router = inject(Router);

  // Signal que almacena el usuario logueado, null si no hay sesión
  usuarioActual = signal<any>(null);

  // Referencia a la suscripción para poder cancelarla en OnDestroy
  private authSubscription: any;

  juegos = [
    { 
      nombre: 'Ahorcado', 
      icono: 'bi-alphabet', 
      ruta: '/ahorcado', 
      descripcion: 'Adiviná la palabra letra por letra' 
    },
    { 
      nombre: 'Mayor o Menor', 
      icono: 'bi-suit-spade', 
      ruta: '/mayor-menor', 
      descripcion: 'Adiviná si la próxima carta es mayor o menor' 
    },
    { 
      nombre: 'Preguntados', 
      icono: 'bi-patch-question', 
      ruta: '/preguntados', 
      descripcion: 'Respondé preguntas de cultura general' 
    },
    { 
      nombre: 'Logo Quiz Automotriz', 
      icono: 'bi-car-front', 
      ruta: '/logo-quiz', 
      descripcion: 'Adiviná la marca del auto según su logo' 
    },
  ];

  /**
   * Al iniciar el componente nos suscribimos a los cambios
   * de autenticación de Supabase.
   * Cada vez que el usuario inicia o cierra sesión,
   * el callback se ejecuta y actualizamos el signal.
   */
  ngOnInit() {
    this.authSubscription = this.supabaseService.onAuthChange(
      (event, session) => {
        this.usuarioActual.set(session?.user ?? null);
      }
    );
  }

  /**
   * Al destruir el componente cancelamos la suscripción
   * para evitar memory leaks.
   */
  ngOnDestroy() {
    this.authSubscription?.data?.subscription?.unsubscribe();
  }

  /**
   * Cierra la sesión del usuario actual y navega al Login.
   */
  async onLogout() {
    await this.supabaseService.logout();
    this.router.navigate(['/login']);
  }
}