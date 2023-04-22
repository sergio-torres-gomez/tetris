import React, { useEffect, useState, useRef, useMemo } from "react"
import { Celda } from "./Celda"
import { Boton } from "./Boton"

const tableroInicial = Array(15).fill().map((arr) => arr = Array(9).fill(0))
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
        this.posicionX = Math.round(tableroInicial[0].length / 2) - Math.round(this.tipoPieza.matriz[0].length / 2) 
    }
}


const generarNuevaPieza = () => {
    let numAleatorio = Math.floor(Math.random() * piezas.length)
    let pieza = new Pieza(piezas[numAleatorio])

    return pieza
}

const Tablero = () => {
    const [matriz, setMatriz] = useState(tableroInicial)
    const [piezaActual, setPiezaActual] = useState(false)
    const finPartida = useRef(false)
    const piezaActualRef = useRef(piezaActual)
    const juegoPausado = useRef(false)

    const avanzarPieza = (posicion) => {
        if((Object.keys(piezaActualRef.current).length == 0))
            return generarNuevaPieza()
        
        let nuevaPieza = {...piezaActualRef.current}
        let maximo_filas = matriz.length
        let final_pieza = nuevaPieza.posicionY + nuevaPieza.tamanoY 

        switch(posicion){
            case 'derecha': 
                nuevaPieza.posicionX++
                if(colisionPiezas(nuevaPieza))
                    nuevaPieza.posicionX--
                break
            case 'izquierda': 
                nuevaPieza.posicionX--
                if(colisionPiezas(nuevaPieza))
                    nuevaPieza.posicionX++
                break
            case 'abajo': 
                nuevaPieza.posicionY++
                break
            default:
                throw new Error(posicion+' no está definido como una posición válida de movimiento.')
        }
        

        // Si llega al final
        let fin_pieza = maximo_filas <= final_pieza || colisionPiezas(nuevaPieza)
        if(fin_pieza){
            acabarPieza()
            comprobarFinPartida()

            return false
        }

        return nuevaPieza
    }

    const colisionPiezas = (pieza) => {
        let colision = false
        pieza.tipoPieza.matriz.map((filaPieza, indexFilaPieza) => {
            filaPieza.map((celdaPieza, indexColumnaPieza) => {
                let posYMatriz = indexFilaPieza + pieza.posicionY
                let posXMatriz = indexColumnaPieza + pieza.posicionX
                // console.log("posYMatriz: "+posYMatriz)
                // console.log("posXMatriz: "+posXMatriz)
                if(celdaPieza == 1 && matriz[posYMatriz] !== 'undefined' && matriz[posYMatriz][posXMatriz] == 1){
                    colision = true
                }
            })
        })

        return colision
    }

    const acabarPieza = () => {
        let nuevaMatriz = [...matriz]
        matriz.map((fila, num_fila) => {
            fila.map((celda, num_columna) => {
                nuevaMatriz[num_fila][num_columna] = (celda != 0) ? 1 : 0
            })
        })

        setMatriz(nuevaMatriz)
    }

    const comprobarFinPartida = () => {
        let hay_ficha_primera_fila = matriz[0].filter((valorCelda) => valorCelda == 1).length > 0
        if(hay_ficha_primera_fila)
            // setFinPartida(true)
            finPartida.current = true
    }
    
    const comprobarFilasLlenas = (nuevaMatriz) => {
        nuevaMatriz.map((fila, num_fila) => {
            let completas = fila.filter(celda => celda == 1)
            if(completas.length == nuevaMatriz[0].length){
                nuevaMatriz = [...nuevaMatriz.slice(0, num_fila), ...nuevaMatriz.slice(num_fila + 1)]
                nuevaMatriz.unshift(new Array(nuevaMatriz[0].length).fill(0))
            }
        })
     
        return nuevaMatriz
    }

    const pintarMatriz = (nuevaPieza) => {
        reiniciarMatriz()
        if(!nuevaPieza || Object.keys(nuevaPieza) == 0) return
        
        /////// PINTANDO EN LA MATRIZ
        let contador_fila = 0
        let nuevaMatriz = comprobarFilasLlenas([...matriz])
        
        nuevaMatriz.map((fila, num_fila) => {
            // si estamos evaluando la matriz dentro del contenido vertical de la pieza
            if(num_fila >= nuevaPieza.posicionY && num_fila < nuevaPieza.posicionY + nuevaPieza.tamanoY){
                // ahora comprobar el horizontal
                let contador_columna = 0
                fila.map((celda, num_columna) => {
                    // antes comprobamos si la celda está en blanco
                    if(num_columna >= nuevaPieza.posicionX && num_columna < nuevaPieza.posicionX + nuevaPieza.tamanoX){
                        if(celda == 0){
                            let celda_ocupada = nuevaPieza.tipoPieza.matriz[contador_fila][contador_columna] == 1
                            nuevaMatriz[num_fila][num_columna] = (celda_ocupada) ? 2 : 0
                        }
                        contador_columna++
                    }
                })
                contador_fila++
            }
        })
        //console.log(nuevaMatriz)
        setMatriz(nuevaMatriz)
    }

    const reiniciarMatriz = () => {
        // Inicializar la matriz para eliminar el movimiento anterior
        let nuevaMatriz = [...matriz]
        nuevaMatriz.map((fila, num_fila) => {
            fila.map((celda, num_columna) => {
                nuevaMatriz[num_fila][num_columna] = (nuevaMatriz[num_fila][num_columna] == 1) ? 1 : 0
            })
        })

        setMatriz(nuevaMatriz)
    }

    const handleKeyDown = (ev) => {
        if(juegoPausado.current) return

        let nuevaPieza = {...piezaActualRef.current}
        if(ev.keyCode == 37 && nuevaPieza.posicionX > 0){
            nuevaPieza = avanzarPieza("izquierda")
        }else if(ev.keyCode == 38){
            nuevaPieza = transponerMatriz()
        }else if(ev.keyCode == 39 && nuevaPieza.posicionX + nuevaPieza.tamanoX < matriz[0].length){
            nuevaPieza = avanzarPieza("derecha")
        }else if(ev.keyCode == 40){
            nuevaPieza = avanzarPieza("abajo")
        }
        
        piezaActualRef.current = nuevaPieza
        pintarMatriz(nuevaPieza)
    }

    const transponerMatriz = () => {
        let pieza = {...piezaActualRef.current}
        
        const rotada = []
        for (let i = 0; i < pieza.tipoPieza.matriz[0].length; i++) {
            const row = []
            for (let j = pieza.tipoPieza.matriz.length - 1; j >= 0; j--) {
                row.push(pieza.tipoPieza.matriz[j][i])
            }
            rotada.push(row)
        }
        // Actualizar la matriz
        pieza.tipoPieza.matriz = rotada
        // Actualizar los tamaños de la matriz
        pieza.tamanoY = rotada.length
        pieza.tamanoX = rotada[0].length
        
        return pieza
    }

    const pausarJuego = () => {
        juegoPausado.current = !juegoPausado.current
    }

    const finalizarJuego = () => {
        const intervalFinId = setInterval(() => {
            let todasLasFilasNegras = matriz.filter(fila => { return fila.filter(celda => celda == 0).length > 0 }).length == 0
            let nuevaMatriz = [...matriz]
            if(todasLasFilasNegras){
                // Acabar bucle
                clearInterval(intervalFinId)

                // Pintar FIN en la matriz
                // Fila, columna
                let inicio_fin = [Math.floor((matriz.length - piezaFin.length) / 2), Math.floor((matriz[0].length - piezaFin[0].length) / 2)]
                nuevaMatriz = Array(matriz.length).fill().map((celda, index) => {
                    if(index >= inicio_fin[0] && index < (inicio_fin[0] + piezaFin.length)){
                        return Array(matriz[0].length).fill().map((celdaNueva, indexCeldaNueva) => {
                            let filaPiezaFin = index - inicio_fin[0]
                            return (indexCeldaNueva >= inicio_fin[1]) ? piezaFin[filaPiezaFin][indexCeldaNueva] : 1
                        })
                    }else{
                        return Array(matriz[0].length).fill(1)
                    }
                })
            }else{
                let celda_pintada = false
                nuevaMatriz.map((fila, indexFila) => {
                    if(!celda_pintada && fila.filter(celda => {return celda == 0}).length > 0){
                        for(let i=0; i<fila.length; i++){
                            if(fila[i] == 0){
                                // Pintamos una celda solo y salimos
                                nuevaMatriz[indexFila][i] = 1
                                celda_pintada = true
                                break
                            }
                        }
                    }
                })
            }

            setMatriz(nuevaMatriz)
        }, 20)
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if(finPartida.current){
                clearInterval(intervalId)
                return
            }
            if(juegoPausado.current) return

            let nuevaPieza = avanzarPieza("abajo")
            piezaActualRef.current = nuevaPieza
            pintarMatriz(nuevaPieza)
        }, 500)
        
        return () => clearInterval(intervalId)
    }, [])

    useMemo(() => {

        if(finPartida.current){
            finalizarJuego()
        }
    }, [finPartida.current])
    
    

    return (
        <div id="tablero" onKeyDown={handleKeyDown} tabIndex="0">
            <div id="juego">
                {matriz.map((fila, indexFila) => {
                    
                    return (
                        <div className="fila" key={"Fila-"+indexFila}>
                            {fila.map((celda, index) => {
                                return (
                                    <Celda key={indexFila + "-" +index} valorCelda={celda} />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <div id="extra-juego">
                <Boton eventoClick={pausarJuego}>
                    {juegoPausado.current !== false ? "Pausa" : "Continuar"}
                </Boton>
            </div>
        </div>
    )
}

export { Tablero }
