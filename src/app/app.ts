import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Supabase } from './shared/services/supabase';
import { UsuarioAuth } from './shared/interfaces/usuario.interface';

/**
 * Componente raíz de la aplicación.
 * Sprint 3: signal<any> reemplazado por interface UsuarioAuth.
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

  // Reemplazamos signal<any> por signal<UsuarioAuth | null>
  usuarioActual = signal<UsuarioAuth | null>(null);

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