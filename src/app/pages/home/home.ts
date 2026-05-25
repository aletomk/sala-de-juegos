import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../shared/services/supabase';
import { UsuarioAuth } from '../../shared/interfaces/usuario.interface';

/**
 * Componente Home - Página principal de la Sala de Juegos.
 * Sprint 3: Migrado a arquitectura features, signal<any> reemplazado por interfaces.
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

  // Reemplazamos signal<any> por signal<UsuarioAuth | null>
  usuarioActual = signal<UsuarioAuth | null>(null);

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
    { 
      nombre: 'Chat', 
      icono: 'bi-chat-dots', 
      ruta: '/chat', 
      descripcion: 'Chateá en tiempo real con otros jugadores' 
    },
  ];

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

  async onLogout() {
    await this.supabaseService.logout();
    this.router.navigate(['/login']);
  }
}