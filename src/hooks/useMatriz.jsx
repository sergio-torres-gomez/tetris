import { useRef, useState, useMemo, useEffect } from 'react'
import { piezaAleatoria, piezaFin } from "../models/pieza"

const tableroInicial = Array(15).fill().map((arr) => arr = Array(9).fill(0))

const useMatriz = () => {

    // TODO: Refactorizar, controlar renderizados innecesarios
    
    const [matriz, setMatriz] = useState(tableroInicial)
    const [partidaActual, setPartidaActual] = useState(tableroInicial)
    const [piezaActual, setPiezaActual] = useState(false)
    const [juegoPausado, setJuegoPausado] = useState(false)
    const finPartida = useRef(false)

    useEffect(() => {
        console.log("ENTRA")
        setMatriz(partidaActual)
    }, [partidaActual])

    // Pinta una pieza nueva pasada por parámetro
    const pintarPiezaEnJuego = () => {
        
        if(!piezaActual || Object.keys(piezaActual) == 0) {
            let nuevaMatriz = acabarPieza()
            nuevaMatriz = comprobarFilasLlenas(nuevaMatriz)
            comprobarFinPartida(nuevaMatriz)
            nuevaMatriz = quitarPiezaActualEnJuego(nuevaMatriz)
            
            return nuevaMatriz
        }
        
        /////// PINTANDO EN LA MATRIZ
        let contador_fila = 0
        let nuevaMatriz = comprobarFilasLlenas([...matriz])
        nuevaMatriz = quitarPiezaActualEnJuego(nuevaMatriz)

        nuevaMatriz.map((fila, num_fila) => {
            // si estamos evaluando la matriz dentro del contenido vertical de la pieza
            if(num_fila >= piezaActual.posicionY && num_fila < piezaActual.posicionY + piezaActual.tamanoY){
                // ahora comprobar el horizontal
                let contador_columna = 0
                fila.map((celda, num_columna) => {
                    // antes comprobamos si la celda está en blanco
                    if(num_columna >= piezaActual.posicionX && num_columna < piezaActual.posicionX + piezaActual.tamanoX){
                        if(celda == 0){
                            let celda_ocupada = piezaActual.tipoPieza.matriz[contador_fila][contador_columna] == 1
                            nuevaMatriz[num_fila][num_columna] = (celda_ocupada) ? 2 : 0
                        }
                        contador_columna++
                    }
                })
                contador_fila++
            }
        })

        return nuevaMatriz
    }

    const acabarPieza = () => {
        let nuevaMatriz = [...matriz]
        nuevaMatriz.map((fila, num_fila) => {
            fila.map((celda, num_columna) => {
                nuevaMatriz[num_fila][num_columna] = (celda != 0) ? 1 : 0
            })
        })

        return nuevaMatriz
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

    const comprobarFinPartida = (nuevaMatriz) => {
        let hay_ficha_primera_fila = nuevaMatriz[0].filter((valorCelda) => valorCelda == 1).length > 0
        if(hay_ficha_primera_fila)
            // setFinPartida(true)
            finPartida.current = true
    }

    // Quita la pieza que se está jugando actualmente
    const quitarPiezaActualEnJuego = (nuevaMatriz) => {
        // Inicializar la matriz para eliminar el movimiento anterior
        nuevaMatriz.map((fila, num_fila) => {
            fila.map((celda, num_columna) => {
                nuevaMatriz[num_fila][num_columna] = (nuevaMatriz[num_fila][num_columna] == 1) ? 1 : 0
            })
        })

        return nuevaMatriz
    }

    useMemo(() => {
        console.log("pasa")
        setPartidaActual(pintarPiezaEnJuego())
    }, [piezaActual])

    const generarNuevaPieza = () => {
        return piezaAleatoria()
    }

    const avanzarPieza = (posicion) => {
        let nuevaPieza = {...piezaActual}

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
        
        nuevaPieza = comprobarMovimientoValido(nuevaPieza)

        return nuevaPieza
    }

    const colisionPiezas = (pieza) => {
        let colision = false
        pieza.tipoPieza.matriz.map((filaPieza, indexFilaPieza) => {
            filaPieza.map((celdaPieza, indexColumnaPieza) => {
                let posYMatriz = indexFilaPieza + pieza.posicionY
                let posXMatriz = indexColumnaPieza + pieza.posicionX

                if(celdaPieza == 1 && matriz[posYMatriz] !== 'undefined' && matriz[posYMatriz][posXMatriz] == 1){
                    colision = true
                }
            })
        })

        return colision
    }

    const handleKeyDown = (ev) => {
        if(juegoPausado) return

        let nuevaPieza = {...piezaActual}
        
        if((Object.keys(nuevaPieza).length == 0)){
            nuevaPieza = generarNuevaPieza()
        }else{
            if(ev.keyCode == 37 && nuevaPieza.posicionX > 0){
                nuevaPieza = avanzarPieza("izquierda")
            }else if(ev.keyCode == 38){
                nuevaPieza = transponerMatriz()
                nuevaPieza = comprobarMovimientoValido(nuevaPieza)
            }else if(ev.keyCode == 39 && nuevaPieza.posicionX + nuevaPieza.tamanoX < matriz[0].length){
                nuevaPieza = avanzarPieza("derecha")
            }else if(ev.keyCode == 40){
                nuevaPieza = avanzarPieza("abajo")
            }
        }
        
        setPiezaActual(nuevaPieza)
    }

    const comprobarMovimientoValido = (nuevaPieza) => {
        let maximo_filas = matriz.length
        let final_pieza = nuevaPieza.posicionY + nuevaPieza.tamanoY 
        // Si llega al final
        let fin_pieza = maximo_filas < final_pieza || colisionPiezas(nuevaPieza)

        return fin_pieza ? false : nuevaPieza
    }

    const transponerMatriz = () => {
        let pieza = {...piezaActual}
        
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

    const pausarJuegoClick = () => {
        setJuegoPausado(!juegoPausado)
    }

    const reiniciarPartidaClick = () => {
        setJuegoPausado(false)
        setPiezaActual(generarNuevaPieza())
        setPartidaActual(tableroInicial)
    }

    const finalizarJuego = () => {
        // Bucle para hacer un efecto de llenado celda a celda
        const intervalFinId = setInterval(() => {
            let todasLasFilasNegras = matriz.filter(fila => { return fila.filter(celda => celda == 0).length > 0 }).length == 0
            let nuevaMatriz = [...matriz]
            if(todasLasFilasNegras){
                // Acabar bucle
                clearInterval(intervalFinId)

                nuevaMatriz = pintaFinTablero(nuevaMatriz)
            }else{
                nuevaMatriz = rellenaSiguienteCelda(nuevaMatriz)
            }

            setPartidaActual(nuevaMatriz)
        }, 20)

        // Rellena la siguiente celda dada una matriz
        const rellenaSiguienteCelda = (nuevaMatriz) => {
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

            return nuevaMatriz
        }

        // Pinta "FIN" en medio de la matriz
        const pintaFinTablero = (nuevaMatriz) => {
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

            return nuevaMatriz
        }
    }

    useMemo(() => {

        if(finPartida.current){
            finalizarJuego()
        }
    }, [finPartida.current])

    return { matriz, juegoPausado, handleKeyDown, pausarJuegoClick, reiniciarPartidaClick }
}

export { useMatriz }