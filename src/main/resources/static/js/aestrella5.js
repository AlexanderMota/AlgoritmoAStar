const rows = 15;
const cols = 20;

const grid = document.getElementById('grid');
let selectedPartida = null;
let selectedDestino = null;
let isPartidaMode = true;
let isObstaculoMode = false;

const xPartidaInput = document.getElementById('x-partida');
const yPartidaInput = document.getElementById('y-partida');
const xDestinoInput = document.getElementById('x-destino');
const yDestinoInput = document.getElementById('y-destino');
const toggleButton = document.getElementById('toggle-mode');
const toggleObstaculoButton = document.getElementById('toggle-obstaculo');
const calculateButton = document.getElementById('calculate-adjacent');
const cleanButton = document.getElementById('clean-table');

let celdasAbiertas = [];
let celdasCerradas = [];

// Crea la cuadricula inicial
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

// Limpia la cuadricula
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

    // Datos de la celda de partida para poner en marcha el programa
	const datosCeldaInicio = {
        cell: selectedPartida,
        g: 0, // El costo desde el punto de partida hasta el mismo punto es 0
        h: calcularHeuristica(selectedDestino),
        f: calcularHeuristica(selectedDestino),
        parent: null // La celda de partida no tiene celda padre
    };

    // Iniciar el bucle de búsqueda
	examinaDirecciones(datosCeldaInicio);
	setTimeout(realizarBusqueda, 500); // Pausa para visualizar el proceso
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
	if (celdaActual.h < 15) {
	    setTimeout(trazarCamino(celdaActual), 500);
	    alert("¡Ruta encontrada!");
	    return;
	}
		
	/*let resp = */examinaDirecciones(celdaActual);
	
	setTimeout(realizarBusqueda, 500); // Pausa para visualizar el proceso
}


function examinaDirecciones(celdaExaminar){
	const { row: examRow, col: examCol } = obtenerCoordenadas(celdaExaminar.cell);
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
	for (const direccion of direcciones) {
		const cell = grid.querySelector(`[data-row="${examRow + direccion.row}"][data-col="${examCol + direccion.col}"]`);
		
		if(cell && cell !== selectedPartida && cell !== selectedDestino){	
			const g = celdaExaminar.g + direccion.valorG;
			const h = calcularHeuristica(cell);
			const f = g + h;
				
			if (!cell || cell.classList.contains('obstaculo') || celdasCerradas.includes(cell)) {
	            
	        }else{
				// Verificar si la celda ya está en la lista abierta
		        const celdaExistente = celdasAbiertas.find(celda => celda.cell === cell);

		        if (celdaExistente) {
		            // Si la celda ya está en la lista abierta, actualizar si encontramos un mejor camino
		            if (g < celdaExistente.g) {
		                celdaExistente.g = g;
		                celdaExistente.f = f;
		                celdaExistente.parent = celdaExaminar;
		                updateCellDisplay(cell, g, h, f);
		            }
		        } else {
		            // Si no está en la lista abierta, agregarla
		            celdasAbiertas.push({
		                cell: cell,
		                g: g,
		                h: h,
		                f: f,
		                parent: celdaExaminar
		            });

		            cell.classList.add('adyacente');
		            updateCellDisplay(cell, g, h, f);
		        }
			}	
		}
	}
}

function calcularHeuristica(cell) {
    const { row: destinoRow, col: destinoCol } = obtenerCoordenadas(selectedDestino);
    const { row: cellRow, col: cellCol } = obtenerCoordenadas(cell);
    const dx = Math.abs(destinoRow - cellRow);
    const dy = Math.abs(destinoCol - cellCol);

    return dx > dy ? (dy * 14) + ((dx - dy) * 10) : (dx * 14) + ((dy - dx) * 10) // Distancia Manhattan
}

function obtenerCoordenadas(cell) {
    return {
        row: parseInt(cell.getAttribute('data-row')),
        col: parseInt(cell.getAttribute('data-col'))
    };
}


function updateCellDisplay(cell, g, h, f) {
    cell.innerHTML = '';

    const gLabel = document.createElement('div');
    gLabel.classList.add('valueG');
    gLabel.textContent = g;
    cell.appendChild(gLabel);

    const hLabel = document.createElement('div');
    hLabel.classList.add('valueH');
    hLabel.textContent = h;
    cell.appendChild(hLabel);

    const fLabel = document.createElement('div');
    fLabel.classList.add('valueTotal');
    fLabel.textContent = f;
    cell.appendChild(fLabel);
}

function trazarCamino(celdaActual) {
    let currentCell = celdaActual;
    while (currentCell) {
		if(currentCell.cell.classList[1] !== 'partida'){
			currentCell.cell.classList.add('camino');
			currentCell = currentCell.parent;
		}else{
			currentCell = currentCell.parent;
		}
    }
}

// Crear la cuadrícula al cargar la página
crearCuadricula();

