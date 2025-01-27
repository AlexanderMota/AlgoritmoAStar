# Algoritmo A* - Aplicación Web para Búsqueda de Caminos

Este proyecto es una aplicación web diseñada para encontrar el camino más corto entre dos puntos en una cuadrícula utilizando el **algoritmo A***. Fue desarrollado con **Eclipse IDE** y utiliza **Spring** para implementar un servidor **JAVA** que lanza la aplicación como contenido estático en el navegador. La aplicación permite colocar obstáculos en el plano, que son considerados por el algoritmo al calcular el camino más eficiente.

## Características principales

- **Implementación del Algoritmo A***: Encuentra el camino más corto de un punto A a un punto B en una cuadrícula.
- **Interactividad**: Posibilidad de colocar obstáculos manualmente en el plano.
- **Precisión**: El algoritmo calcula rutas optimizadas incluso con la presencia de obstáculos.
- **Servidor con Spring**: Sirve la aplicación en el navegador como contenido estático.
- **Frontend en HTML, CSS y JavaScript**: Interfaz simple y funcional para interactuar con la cuadrícula.

## Estructura del proyecto

### Backend
- **Spring Framework**: Configurado como un servidor para alojar y servir los archivos estáticos.
- **Gestión eficiente del algoritmo**: La lógica del A* se encuentra estructurada para garantizar precisión y rapidez.

### Frontend
- **HTML, CSS y JavaScript**: Componentes del diseño visual e interacción de la aplicación.
- **Cuadrícula interactiva**: Permite al usuario seleccionar los puntos A y B, así como agregar obstáculos al plano.
- **Visualización en tiempo real**: Muestra el proceso y resultado del algoritmo.

## Futuras funcionalidades

- **Mejoras visuales**: Actualización del diseño con CSS puro (o posibles frameworks en el futuro).
- **Opciones avanzadas**: Permitir personalizar parámetros del algoritmo (por ejemplo, pesos de los nodos).
- **Optimización del rendimiento**: Mejorar la velocidad del cálculo para cuadrículas más grandes.
- **Compatibilidad móvil**: Adaptar el diseño para una mejor experiencia en dispositivos móviles.

## Cómo iniciar

1. Clona el repositorio:

   ```bash
   git clone https://github.com/AlexanderMota/AlgoritmoAStar.git
   
2. Abre el proyecto en Eclipse IDE.

3. Inicia el servidor con Spring:

- Asegúrate de que el entorno esté configurado para ejecutar aplicaciones Spring (con Java y Maven instalados).

4. Accede a la aplicación en el navegador:

- Abre http://localhost:4500 para interactuar con la aplicación.

## Contribuciones

Si deseas colaborar en el proyecto, puedes abrir un issue o enviar un pull request con tus mejoras o sugerencias. ¡Cualquier aporte será bienvenido! 😊
