import { useRef, useState, useMemo, useEffect } from 'react'
import { piezaAleatoria, piezaFin } from "../models/pieza"
import { useInterval } from "./useInterval"

const tableroInicial = () => Array(15).fill().map((arr) => arr = Array(9).fill(0))

const controlesTeclado = {
    37: "izquierda",
    38: "arriba",
    39: "derecha",
    40: "abajo"
}

const useMatriz = () => {

    const _VELOCIDAD_RELOJ_ = 500
    const [matriz, setMatriz] = useState(tableroInicial())
    const [piezaActual, setPiezaActual] = useState(false)
    const [juegoPausado, setJuegoPausado] = useState(false)
    const partidaActual = useRef(tableroInicial())
    const finPartida = useRef(false)
    const relojPartida = useRef(_VELOCIDAD_RELOJ_)
    const partidaNueva = useRef(true)

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
        let matriz_actual = partidaNueva.current ? tableroInicial() : [...matriz]
        let nuevaMatriz = comprobarFilasLlenas(matriz_actual)
        nuevaMatriz = quitarPiezaActualEnJuego(nuevaMatriz)
        partidaNueva.current = false

        nuevaMatriz.map((fila, num_fila) => {
            // estamos evaluando la matriz dentro del contenido vertical de la pieza
            if(num_fila >= piezaActual.posicionY && num_fila < piezaActual.posicionY + piezaActual.tamanoY){
                // ahora comprobar el horizontal
                let contador_columna = 0
                fila.map((celda, num_columna) => {
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


    const generarNuevaPieza = () => {
        return piezaAleatoria()
    }

    const avanzarPiezaAuto = () => {
        return controlUsuario("abajo")
    }

    const avanzarPieza = (posicion) => {
        let nuevaPieza = piezaActual ? {...piezaActual} : generarNuevaPieza()

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
        let control = controlesTeclado[ev.keyCode] || false
        if(control)
            controlUsuario(control)
    }

    const handleSwipe = (ev, direccion) => {
        controlUsuario(direccion)
    }

    const controlUsuario = (direccion) => {
        if(juegoPausado || finPartida.current) return

        let nuevaPieza = {...piezaActual}
        
        if((Object.keys(nuevaPieza).length == 0)){
            nuevaPieza = generarNuevaPieza()
        }else{
            if(direccion == "izquierda" && nuevaPieza.posicionX > 0){
                nuevaPieza = avanzarPieza("izquierda")
            }else if(direccion == "arriba"){
                nuevaPieza = transponerMatriz()
                nuevaPieza = comprobarMovimientoValido(nuevaPieza)
            }else if(direccion == "derecha" && nuevaPieza.posicionX + nuevaPieza.tamanoX < matriz[0].length){
                nuevaPieza = avanzarPieza("derecha")
            }else if(direccion == "abajo"){
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

        // Comprobar que la pieza no se haya salido de la pantalla
        if(pieza.posicionX + pieza.tamanoX > matriz[0].length)
            pieza.posicionX = matriz[0].length - pieza.tamanoX
        
        return pieza
    }

    const pausarJuegoClick = () => {
        setJuegoPausado(!juegoPausado)
    }

    const reiniciarPartidaClick = () => {
        partidaNueva.current = true
        relojPartida.current = juegoPausado ? false : _VELOCIDAD_RELOJ_
        finPartida.current = false
        setJuegoPausado(false)
        setPiezaActual(generarNuevaPieza())
    }

    const finalizarJuego = () => {
        const tieneTodasCeldasOcupadas = (nuevaMatriz) => {
            return nuevaMatriz.filter(fila => { return fila.filter(celda => celda == 0).length > 0 }).length == 0
        }
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
            let inicio_fin = [Math.floor((nuevaMatriz.length - piezaFin.length) / 2), Math.floor((nuevaMatriz[0].length - piezaFin[0].length) / 2)]
            nuevaMatriz = Array(nuevaMatriz.length).fill().map((celda, index) => {
                if(index >= inicio_fin[0] && index < (inicio_fin[0] + piezaFin.length)){
                    return Array(nuevaMatriz[0].length).fill().map((celdaNueva, indexCeldaNueva) => {
                        let filaPiezaFin = index - inicio_fin[0]
                        return (indexCeldaNueva >= inicio_fin[1]) ? piezaFin[filaPiezaFin][indexCeldaNueva] : 1
                    })
                }else{
                    return Array(nuevaMatriz[0].length).fill(1)
                }
            })

            return nuevaMatriz
        }


        // Bucle para hacer un efecto de llenado celda a celda
        if(tieneTodasCeldasOcupadas([...matriz])){
            setMatriz(pintaFinTablero([...matriz]))
            relojPartida.current = false
        }else{
            setMatriz(rellenaSiguienteCelda([...matriz]))
        }
    }

    useMemo(() => {
        if(finPartida.current){
            relojPartida.current = 20
        }
    }, [finPartida.current])

    useMemo(() => {
        relojPartida.current = juegoPausado ? false : _VELOCIDAD_RELOJ_
    }, [juegoPausado])

    useMemo(() => {
        partidaActual.current = pintarPiezaEnJuego()
    }, [piezaActual])

    useEffect(() => {
        setMatriz(partidaActual.current)
    }, [partidaActual.current])

    useInterval(() => {
        if(finPartida.current){
            return finalizarJuego()
        }
        return avanzarPiezaAuto()
    }, relojPartida.current)

    return { matriz, juegoPausado, handleKeyDown, handleSwipe, pausarJuegoClick, reiniciarPartidaClick }
}

export { useMatriz }