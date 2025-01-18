/* ------------------------------- */ console.log("iniciando programa");
	    const rows = 15;
	    const cols = 20;
	
	    const grid = document.getElementById('grid');
	    let selectedPartida = null;
	    let selectedDestino = null;
	    let isPartidaMode = true;
	    let isObstaculoMode = false;
	
	    const toggleButton = document.getElementById('toggle-mode');
	    const toggleObstaculoButton = document.getElementById('toggle-obstaculo');
	    const calculateButton = document.getElementById('calculate-adjacent');
	    const cleanButton = document.getElementById('clean-table');
	
	    let celdasAbiertas = [];
	    let celdasCerradas = [];
	
	    /* ------------------------------- */ console.log("programa iniciado");
	    
	    // Crear la cuadrícula inicial
	    function crearCuadricula() {
	        grid.innerHTML = '';
	        for (let row = 0; row < rows; row++) {
	            for (let col = 0; col < cols; col++) {
	                const cell = document.createElement('div');
	                cell.classList.add('cell');
	                cell.setAttribute('data-row', row);
	                cell.setAttribute('data-col', col);
	                cell.addEventListener('click', cellClicked);
	                grid.appendChild(cell);
	            }
	        }
	    }
	    
	 // Limpiar la cuadrícula
	    function limpiaCuadricula() {

		    selectedPartida = null;
		    selectedDestino = null;
		    isPartidaMode = true;
		    isObstaculoMode = false;
		    
		    celdasAbiertas = [];
		    celdasCerradas = [];
		    
		    crearCuadricula();
	    }
	
	 	// Al hacer clic en el botón "Limpia tablero"
	    cleanButton.addEventListener('click', function() {
		    selectedPartida = null;
		    selectedDestino = null;
		    isPartidaMode = true;
		    isObstaculoMode = false;
		    
		    celdasAbiertas = [];
		    celdasCerradas = [];
		    
		    crearCuadricula();
	    });
	 
	    // Al hacer clic en el botón "Toggle Mode"
	    toggleButton.addEventListener('click', function() {
	        isPartidaMode = !isPartidaMode;
	        isObstaculoMode = false;
	        toggleButton.textContent = isPartidaMode ? "Modo: Partida" : "Modo: Destino";
	        toggleObstaculoButton.textContent = "Modo: Obstáculo";
	    });
	
	    // Al hacer clic en el botón "Modo Obstáculo"
	    toggleObstaculoButton.addEventListener('click', function() {
	        isObstaculoMode = !isObstaculoMode;
	        isPartidaMode = false;
	        toggleButton.textContent = "Modo: Partida";
	        toggleObstaculoButton.textContent = isObstaculoMode ? "Modo: Obstáculo Activo" : "Modo: Obstáculo";
	    });
	
	    // Función para manejar el clic en las celdas
	    function cellClicked(event) {
	        const clickedCell = event.target;
	        const row = parseInt(clickedCell.getAttribute('data-row'));
	        const col = parseInt(clickedCell.getAttribute('data-col'));
	
	        if (isObstaculoMode) {
	            clickedCell.style.backgroundColor = '#000000';
	            clickedCell.classList.add('obstaculo');
	        } else if (isPartidaMode) {
	            if (selectedPartida) {
	                selectedPartida.classList.remove('partida');
	            }
	            selectedPartida = clickedCell;
	            selectedPartida.classList.add('partida');
	        } else {
	            if (selectedDestino) {
	                selectedDestino.classList.remove('destino');
	            }
	            selectedDestino = clickedCell;
	            selectedDestino.classList.add('destino');
	        }
	    }
	
	    // Función para calcular celdas adyacentes
	    calculateButton.addEventListener('click', function() {
	        if (!selectedPartida || !selectedDestino) {
	            alert("Debe seleccionar un punto de partida y un punto de destino.");
	            return;
	        }
	
	        iniciarBusqueda();
	    });
	
	    function iniciarBusqueda() {
	        // Limpiar las listas abiertas y cerradas
	        celdasAbiertas = [];
	        celdasCerradas = [];
	
	        // Agregar la celda de partida a la lista abierta
	        celdasAbiertas.push({
	            cell: selectedPartida,
	            g: 0, // El costo desde el punto de partida hasta el mismo punto es 0
	            h: calcularHeuristica(selectedDestino), // Cambiado aquí
	            f: calcularHeuristica(selectedDestino), // Al inicio, f = h
	            parent: null // La celda de partida no tiene celda padre
	        });
	
	        // Iniciar el bucle de búsqueda
	        realizarBusqueda();
	    }
	
	    // En el método realizarBusqueda
	    function realizarBusqueda() {
	        if (celdasAbiertas.length === 0) {
	            alert("No se ha encontrado una ruta.");
	            return;
	        }
	
	        // Elegir la celda con el menor valor de f en la lista abierta
	        const celdaActual = celdasAbiertas.reduce((prev, curr) => {
	            if (prev.f === curr.f) {
	                return prev.h < curr.h ? prev : curr; // Priorizar el menor h
	            }
	            return prev.f < curr.f ? prev : curr;
	        });
	
	        // Mover la celda actual a la lista cerrada
	        celdasCerradas.push(celdaActual.cell);
	        celdaActual.cell.classList.remove('adyacente');
	        celdaActual.cell.classList.add('cerrada'); // Pintamos la celda de color gris azulado
	        celdasAbiertas = celdasAbiertas.filter(celda => celda !== celdaActual);
	
	        // Si llegamos al destino, trazamos el camino
	        if (celdaActual.cell === selectedDestino) {
	            trazarCamino(celdaActual);
	            alert("¡Ruta encontrada!");
	            return;
	        }
	
	        const { row: actualRow, col: actualCol } = obtenerCoordenadas(celdaActual.cell);
	
	        // Direcciones y costos
	        const direcciones = [
	            { row: -1, col: 0, valorG: 10 },   // Arriba
	            { row: 1, col: 0, valorG: 10 },    // Abajo
	            { row: 0, col: -1, valorG: 10 },   // Izquierda
	            { row: 0, col: 1, valorG: 10 },    // Derecha
	            { row: -1, col: -1, valorG: 14 },  // Arriba Izquierda
	            { row: -1, col: 1, valorG: 14 },   // Arriba Derecha
	            { row: 1, col: -1, valorG: 14 },   // Abajo Izquierda
	            { row: 1, col: 1, valorG: 14 }     // Abajo Derecha
	        ];
	
	        // Evaluar las celdas adyacentes
	        direcciones.forEach(dir => {
	            const newRow = actualRow + dir.row;
	            const newCol = actualCol + dir.col;
	            const cell = grid.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
	
	            // Ignorar celdas que son obstáculos o que ya están en la lista cerrada
	            if (!cell || cell.classList.contains('obstaculo') || celdasCerradas.includes(cell)) {
	                return;
	            }
	
	            const g = celdaActual.g + dir.valorG;
	            const h = calcularHeuristica(cell); // Usar la nueva heurística
	            const f = g + h;
	
	            const celdaEnAbierta = celdasAbiertas.find(c => c.cell === cell);
	
	            // Si la celda no está en la lista abierta, agregarla
	            if (!celdaEnAbierta) {
	                celdasAbiertas.push({ cell, g, h, f, parent: celdaActual });
	                cell.classList.add('adyacente');
	            } else if (g < celdaEnAbierta.g) {
	                // Si esta ruta es mejor, actualizar la celda
	                celdaEnAbierta.g = g;
	                celdaEnAbierta.h = h;
	                celdaEnAbierta.f = f;
	                celdaEnAbierta.parent = celdaActual;
	            }
	        });
	
	        // Volver a realizar la búsqueda
	        realizarBusqueda();
	    }
	
	    // Función para calcular la heurística utilizando distancia Manhattan
	    function calcularHeuristica(celdaDestino) {
	        const { row: destinoRow, col: destinoCol } = obtenerCoordenadas(celdaDestino);
	        const { row: actualRow, col: actualCol } = obtenerCoordenadas(selectedPartida);
	        return (Math.abs(destinoRow - actualRow) + Math.abs(destinoCol - actualCol)) * 10; // Multiplicador de 10 para el costo
	    }
	
	    // Obtener coordenadas de una celda
	    function obtenerCoordenadas(celda) {
	        const row = parseInt(celda.getAttribute('data-row'));
	        const col = parseInt(celda.getAttribute('data-col'));
	        return { row, col };
	    }
	
	    // Función para trazar el camino encontrado
	    function trazarCamino(celda) {
	        while (celda) {
	            celda.cell.classList.add('camino'); // Pintamos el camino de color verde
	            celda = celda.parent;
	        }
	    }
	
	    crearCuadricula();