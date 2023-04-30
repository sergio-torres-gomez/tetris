import { memo } from "react"
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
    
    const FilaMemo = memo(({ fila, indexFila }) => {
        return (
            <div className="fila" key={"Fila-"+indexFila}>
                {fila.map((celda, index) => <CeldaMemo key={indexFila + "-" +index} celda={celda} />)}
            </div>
        )})
    const CeldaMemo = memo(({ celda }) => <Celda valorCelda={celda} />)


    return (
        <div id="tablero" onKeyDown={handleKeyDown} tabIndex="0">
            <div id="juego">
                {matriz.map((fila, indexFila) => {
                    return (
                        <FilaMemo fila={fila} key={indexFila} />
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

export default memo(Tablero)
