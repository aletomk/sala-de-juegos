import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

/**
 * Componente raíz de la aplicación.
 * Es el primer componente que se renderiza cuando la app inicia.
 * Contiene el navbar global y el router-outlet donde se inyectan
 * los componentes de cada ruta activa.
 * 
 * RouterOutlet → directiva que marca el lugar donde Angular
 *                renderiza el componente de la ruta activa
 * RouterLink  → directiva para navegar entre rutas sin recargar la página
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'sala-de-juegos';
}