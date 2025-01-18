const rows = 15;
    const cols = 20;

    const grid = document.getElementById('grid');
    let selectedPartida = null;
    let selectedDestino = null;
    let isPartidaMode = true;
    let isObstaculoMode = false;  // Añadido para el modo obstáculo

    const xPartidaInput = document.getElementById('x-partida');
    const yPartidaInput = document.getElementById('y-partida');
    const xDestinoInput = document.getElementById('x-destino');
    const yDestinoInput = document.getElementById('y-destino');
    const toggleButton = document.getElementById('toggle-mode');
    const toggleObstaculoButton = document.getElementById('toggle-obstaculo');  // Botón de obstáculos
    const validateButton = document.getElementById('validate-selection');
    const calculateButton = document.getElementById('calculate-adjacent');
    const errorMessage = document.getElementById('error-message');

    let celdasAbiertas = [];
    let celdasCerradas = [];

    // Crear la cuadricula inicial
    function crearCuadricula() {
        grid.innerHTML = ''; // Limpiar cualquier contenido previo
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

    // Al hacer clic en el botón "Toggle Mode"
    toggleButton.addEventListener('click', function() {
        isPartidaMode = !isPartidaMode;
        isObstaculoMode = false;  // Desactivar el modo obstáculo cuando se cambia de modo partida/destino
        toggleButton.textContent = isPartidaMode ? "Modo: Partida" : "Modo: Destino";
        toggleObstaculoButton.textContent = "Modo: Obstáculo";
    });

    // Al hacer clic en el botón "Modo Obstáculo"
    toggleObstaculoButton.addEventListener('click', function() {
        isObstaculoMode = !isObstaculoMode;
        isPartidaMode = false;  // Desactivar los modos de partida/destino cuando se activa el modo obstáculo
        toggleButton.textContent = "Modo: Partida";
        toggleObstaculoButton.textContent = isObstaculoMode ? "Modo: Obstáculo Activo" : "Modo: Obstáculo";
    });

    // Al hacer clic en el botón de "Validar selección"
    validateButton.addEventListener('click', function() {
        if (!selectedPartida || !selectedDestino) {
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
            alert("Partida y destino seleccionados correctamente.");
        }
    });

    // Al hacer clic en el botón de "Calcular adyacentes"
    calculateButton.addEventListener('click', function() {
        if (selectedPartida) {
            errorMessage.style.display = 'none';
            reiniciarTablero();  // Reiniciar toda la cuadricula
            iniciarBusquedaCamino();  // Iniciar la búsqueda del camino
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Error: Debe seleccionar un punto de partida.';
        }
    });
/*
 	// Modificación para añadir la propiedad 'padre'
    function iniciarBusquedaCamino() {
        limpiarTablero();  // Limpiar el tablero antes de comenzar la búsqueda
        selectedPartida.setAttribute('data-g', '0');  // Inicializamos el valor G en 0 en la partida
        celdasCerradas.push(selectedPartida);  // Iniciar desde la partida
        continuarBusqueda();
    }
    */
    // Función para manejar el clic en las celdas
    function cellClicked(event) {
        const clickedCell = event.target;
        const row = parseInt(clickedCell.getAttribute('data-row'));
        const col = parseInt(clickedCell.getAttribute('data-col'));

        if (isObstaculoMode) {
            // Si estamos en modo obstáculo, pintar la celda de negro
            clickedCell.style.backgroundColor = '#000000';
            clickedCell.classList.add('obstaculo');  // Marcar la celda como obstáculo
        } else if (isPartidaMode) {
            if (selectedPartida) {
                selectedPartida.classList.remove('partida');
            }
            selectedPartida = clickedCell;
            selectedPartida.classList.add('partida');
            xPartidaInput.value = col;
            yPartidaInput.value = row;
        } else {
            if (selectedDestino) {
                selectedDestino.classList.remove('destino');
            }
            selectedDestino = clickedCell;
            selectedDestino.classList.add('destino');
            xDestinoInput.value = col;
            yDestinoInput.value = row;
        }
    }

    // Función para iniciar la búsqueda del camino
    function iniciarBusquedaCamino() {
        limpiarTablero();  // Limpiar el tablero antes de comenzar la búsqueda
        celdasCerradas.push(selectedPartida);  // Iniciar desde la partida
        continuarBusqueda();
    }

 // Continuar con la búsqueda de la ruta
    function continuarBusqueda() {
        if (!selectedDestino) {
            alert("Error: No hay destino seleccionado.");
            return;
        }

        const ultimaCelda = celdasCerradas[celdasCerradas.length - 1];
        if (ultimaCelda === selectedDestino) {
            // Recorrer la ruta hacia atrás desde el destino usando la propiedad 'padre'
            trazarRutaOptima(ultimaCelda);
            setTimeout(() => {
                alert("¡Camino completo! Se ha llegado al destino.");
            }, 500); // Dar un pequeño retraso para asegurar que las celdas se pinten antes de la alerta
            return;
        }

        const destinoEncontrado = calcularAdyacentes(ultimaCelda);

        // Si encontramos el destino (valorH = 0), detenemos el bucle
        if (destinoEncontrado) {
            //trazarRutaOptima(selectedDestino); // Trazar la ruta óptima
            setTimeout(() => {
                alert("¡Se ha encontrado el destino!");
            }, 500);
            return;
        }

        let mejorCelda = null;
        let minF = Infinity;

        celdasAbiertas.forEach(celda => {
            if (celda.valorF < minF) {
                minF = celda.valorF;
                mejorCelda = document.querySelector(`.cell[data-row='${celda.row}'][data-col='${celda.col}']`);
            }
        });

        if (mejorCelda) {
            mejorCelda.style.backgroundColor = '#A3B7C2';
            celdasCerradas.push(mejorCelda);
        }

        setTimeout(continuarBusqueda, 500);
    }
 /*
    function actualizarValoresVisuales(celda, valorG, valorH) {
        let valorGElemento = celda.querySelector('.valueG');
        if (!valorGElemento) {
            valorGElemento = document.createElement('div');
            valorGElemento.classList.add('valueG');
            celda.appendChild(valorGElemento);
        }
        valorGElemento.textContent = valorG;

        let valorHElemento = celda.querySelector('.valueH');
        if (!valorHElemento) {
            valorHElemento = document.createElement('div');
            valorHElemento.classList.add('valueH');
            celda.appendChild(valorHElemento);
        }
        valorHElemento.textContent = valorH;

        const valorF = valorG + valorH;
        let valorTotalElemento = celda.querySelector('.valueTotal');
        if (!valorTotalElemento) {
            valorTotalElemento = document.createElement('div');
            valorTotalElemento.classList.add('valueTotal');
            celda.appendChild(valorTotalElemento);
        }
        valorTotalElemento.textContent = valorF;
    }
 // Trazar la ruta óptima desde el destino hacia la partida
    function trazarRutaOptima(celda) {
	    while (celda) {
	        celda.style.backgroundColor = '#FFD700';  // Marcar la ruta en color amarillo
	        celda = celda.padre;  // Ir hacia la celda padre
	    }
	}
 */
 // Calcular celdas adyacentes
    function calcularAdyacentes(partidaCell) {
        const partidaRow = parseInt(partidaCell.getAttribute('data-row'));
        const partidaCol = parseInt(partidaCell.getAttribute('data-col'));
        adyacentes = [];

        const direcciones = [
            { row: -1, col: 0, valorG: 10 },
            { row: 1, col: 0, valorG: 10 },
            { row: 0, col: -1, valorG: 10 },
            { row: 0, col: 1, valorG: 10 },
            { row: -1, col: -1, valorG: 14 },
            { row: -1, col: 1, valorG: 14 },
            { row: 1, col: -1, valorG: 14 },
            { row: 1, col: 1, valorG: 14 }
        ];

        for (const dir of direcciones) {
            const newRow = partidaRow + dir.row;
            const newCol = partidaCol + dir.col;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const adyacenteCell = document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);

                if (adyacenteCell.classList.contains('obstaculo')) {
                    continue;
                }

                if (!celdasCerradas.includes(adyacenteCell)) {
                    const valorH = calcularDistanciaConDiagonal(newRow, newCol);
                    const valorGActual = parseInt(partidaCell.getAttribute('data-g')) || 0;
                    const nuevoValorG = valorGActual + dir.valorG;

                    if (valorH === 0) {
                        adyacenteCell.padre = partidaCell;  // Guardar celda padre
                        adyacentes.push({
                            row: newRow,
                            col: newCol,
                            valorG: nuevoValorG,
                            valorH: valorH,
                            valorF: nuevoValorG
                        });
                        return true;
                    }

                    const valorFGActual = parseInt(adyacenteCell.getAttribute('data-g')) || Infinity;
                    if (nuevoValorG < valorFGActual) {
                        adyacenteCell.classList.add('adyacente');

                        adyacenteCell.setAttribute('data-g', nuevoValorG);
                        adyacenteCell.padre = partidaCell;  // Asignar celda padre

                        let valorGElemento = adyacenteCell.querySelector('.valueG');
                        if (!valorGElemento) {
                            valorGElemento = document.createElement('div');
                            valorGElemento.classList.add('valueG');
                            adyacenteCell.appendChild(valorGElemento);
                        }
                        valorGElemento.textContent = nuevoValorG;

                        let valorHElemento = adyacenteCell.querySelector('.valueH');
                        if (!valorHElemento) {
                            valorHElemento = document.createElement('div');
                            valorHElemento.classList.add('valueH');
                            adyacenteCell.appendChild(valorHElemento);
                        }
                        valorHElemento.textContent = valorH;

                        const valorF = nuevoValorG + valorH;
                        let valorTotalElemento = adyacenteCell.querySelector('.valueTotal');
                        if (!valorTotalElemento) {
                            valorTotalElemento = document.createElement('div');
                            valorTotalElemento.classList.add('valueTotal');
                            adyacenteCell.appendChild(valorTotalElemento);
                        }
                        valorTotalElemento.textContent = valorF;

                        adyacentes.push({
                            row: newRow,
                            col: newCol,
                            valorG: nuevoValorG,
                            valorH: valorH,
                            valorF: valorF
                        });
                    }
                }
            }
        }
        return false;
    }

    // Función para reiniciar el tablero, manteniendo las selecciones de partida, destino y obstáculos
    function reiniciarTablero() {
        const partidaCoords = selectedPartida ? { row: selectedPartida.getAttribute('data-row'), col: selectedPartida.getAttribute('data-col') } : null;
        const destinoCoords = selectedDestino ? { row: selectedDestino.getAttribute('data-row'), col: selectedDestino.getAttribute('data-col') } : null;
        const obstaculos = Array.from(document.querySelectorAll('.obstaculo'));

        crearCuadricula();  // Recrear toda la cuadrícula

        if (partidaCoords) {
            const partidaCell = document.querySelector(`.cell[data-row='${partidaCoords.row}'][data-col='${partidaCoords.col}']`);
            selectedPartida = partidaCell;
            partidaCell.classList.add('partida');
        }

        if (destinoCoords) {
            const destinoCell = document.querySelector(`.cell[data-row='${destinoCoords.row}'][data-col='${destinoCoords.col}']`);
            selectedDestino = destinoCell;
            destinoCell.classList.add('destino');
        }

        // Restaurar los obstáculos
        obstaculos.forEach(obstaculo => {
            const row = obstaculo.getAttribute('data-row');
            const col = obstaculo.getAttribute('data-col');
            const obstaculoCell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            obstaculoCell.classList.add('obstaculo');
            obstaculoCell.style.backgroundColor = '#000000';
        });
    }

    // Calcular la distancia heurística con movimientos diagonales
    function calcularDistanciaConDiagonal(row, col) {
        if (selectedDestino) {
            const destinoRow = parseInt(selectedDestino.getAttribute('data-row'));
            const destinoCol = parseInt(selectedDestino.getAttribute('data-col'));

            const diffRow = Math.abs(destinoRow - row);
            const diffCol = Math.abs(destinoCol - col);

            return (Math.min(diffRow, diffCol) * 14 + Math.abs(diffRow - diffCol) * 10);
        }
        return 0;
    }

    // Limpiar celdas adyacentes, cerradas y sus valores
    function limpiarTablero() {
		celdasAbiertas.forEach(celda => {
            const cellElement = document.querySelector(`.cell[data-row='${celda.row}'][data-col='${celda.col}']`);
            cellElement.classList.remove('adyacente');
            cellElement.style.backgroundColor = '';

            const valorG = cellElement.querySelector('.valueG');
            const valorH = cellElement.querySelector('.valueH');
            const valorF = cellElement.querySelector('.valueTotal');
            if (valorG) valorG.remove();
            if (valorH) valorH.remove();
            if (valorF) valorF.remove();
        });

        celdasCerradas.forEach(celda => {
            celda.style.backgroundColor = '';

            const valorG = celda.querySelector('.valueG');
            const valorH = celda.querySelector('.valueH');
            const valorF = celda.querySelector('.valueTotal');
            if (valorG) valorG.remove();
            if (valorH) valorH.remove();
            if (valorF) valorF.remove();
        });

        celdasAbiertas = [];
        celdasCerradas = [];
    }

    // Crear la cuadrícula al cargar la página
    crearCuadricula();