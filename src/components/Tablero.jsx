import React, { useEffect, useState, useRef, useMemo } from "react"
import { Celda } from "./Celda"
import { Boton } from "./Boton"
import { useMatriz } from "../hooks/useMatriz"

const Tablero = () => {
    const { matriz, juegoPausado, handleKeyDown, pausarJuegoClick, reiniciarPartidaClick } = useMatriz()

    /*useEffect(() => {
        const intervalId = setInterval(() => {
            if(finPartida.current){
                clearInterval(intervalId)
                return
            }
            if(juegoPausado) return

            let nuevaPieza = avanzarPieza("abajo")
            piezaActualRef.current = nuevaPieza
            pintarPiezaEnJuego(nuevaPieza)
        }, 500)
        
        return () => clearInterval(intervalId)
    }, [])*/
    

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
                <Boton eventoClick={pausarJuegoClick}>
                    {juegoPausado !== false ? "Continuar" : "Pausa"}
                </Boton>

                <Boton className="reiniciarPartida" eventoClick={reiniciarPartidaClick}>
                    Reiniciar
                </Boton>
            </div>
        </div>
    )
}

export { Tablero }
