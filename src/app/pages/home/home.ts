import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Componente Home - Página principal de la Sala de Juegos.
 * Muestra las cards de acceso a cada juego disponible.
 * 
 * En Sprint 1 la navegación es libre sin restricciones.
 * En Sprint 2 se agregará lógica condicional según el estado
 * de autenticación del usuario (logueado / no logueado).
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  /**
   * Array con los datos de cada juego disponible en la sala.
   * Se recorre en el template con for para generar las cards dinámicamente.
   * Cada objeto contiene el nombre, ícono de Bootstrap Icons, ruta y descripción.
   */
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
}