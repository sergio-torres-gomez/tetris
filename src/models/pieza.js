const piezas = [
    {
        nombre: "PiezaCuadrado",
        matriz: [[1, 1], [1, 1]]
    },
    {
        nombre: "PiezaPalo",
        matriz: [[1], [1], [1], [1]]
    },
    {
        nombre: "PiezaL",
        matriz: [[1, 0], [1, 0], [1, 1]]
    },
    {
        nombre: "PiezaLInversa",
        matriz: [[0, 1], [0, 1], [1, 1]]
    },
    {
        nombre: "PiezaT",
        matriz: [[0, 1, 0], [1, 1, 1]]
    },
    {
        nombre: "PiezaZigzag",
        matriz: [[1, 1, 0], [0, 1, 1]]
    },
    {
        nombre: "PiezaZigzagINversa",
        matriz: [[0, 1, 1], [1, 1, 0]]
    }
]

const piezaFin = [
    [2, 2, 1, 2, 1, 2, 1, 1, 2],
    [2, 1, 1, 2, 1, 2, 2, 1, 2],
    [2, 2, 1, 2, 1, 2, 1, 2, 2],
    [2, 1, 1, 2, 1, 2, 1, 1, 2],
]

class Pieza {
    tipoPieza
    posicionY
    posicionX
    tamanoX
    tamanoY

    // posicionY corresponde a la posición de la matriz en la fila [0]
    // posicionX corresponde a la posición de la matriz en la columna [0]
    // es decir, el conjunto [posicionY, posicionX] apunta a la esquina superior izquierda de la pieza
    constructor(tipoPieza){
        this.tipoPieza = tipoPieza
        this.tamanoY = this.tipoPieza.matriz.length
        this.tamanoX = this.tipoPieza.matriz[0].length
        this.posicionY = 0
        this.posicionX = 0
    }
}

const piezaAleatoria = () => {
    let numAleatorio = Math.floor(Math.random() * piezas.length)
    let pieza = new Pieza(piezas[numAleatorio])

    return pieza
}

export { piezaAleatoria, piezaFin }
