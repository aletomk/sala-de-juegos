import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

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
      nombre: 'Juego Propio', 
      icono: 'bi-star', 
      ruta: '/juego-propio', 
      descripcion: 'Próximamente...' 
    },
  ];
}