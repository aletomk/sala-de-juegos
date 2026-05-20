import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Supabase } from './services/supabase';

/**
 * Componente raíz de la aplicación.
 * 
 * Sprint 2: El navbar ahora es condicional según el estado de auth.
 * - Usuario NO logueado: muestra Login y Registro
 * - Usuario logueado: muestra solo Quién Soy y cerrar sesión
 * 
 * Se suscribe a los cambios de autenticación de Supabase
 * para actualizar el navbar en tiempo real.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  private supabaseService = inject(Supabase);

  // Signal que almacena el usuario logueado, null si no hay sesión
  usuarioActual = signal<any>(null);

  // Referencia a la suscripción para cancelarla en OnDestroy
  private authSubscription: any;

  ngOnInit() {
    this.authSubscription = this.supabaseService.onAuthChange(
      (event, session) => {
        this.usuarioActual.set(session?.user ?? null);
      }
    );
  }

  ngOnDestroy() {
    this.authSubscription?.data?.subscription?.unsubscribe();
  }
}