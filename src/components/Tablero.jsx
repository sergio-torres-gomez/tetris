import { memo } from "react"
import { Celda } from "./Celda"
import { Boton } from "./Boton"
import { useMatriz } from "../hooks/useMatriz"
import { useSwipeable } from 'react-swipeable'

const Tablero = () => {
    const { matriz, juegoPausado, handleKeyDown, handleSwipe, pausarJuegoClick, reiniciarPartidaClick } = useMatriz()

    const deslizadorHandle = useSwipeable({
        onSwipedLeft: (ev) => handleSwipe(ev, "izquierda"),
        onSwipedRight: (ev) => handleSwipe(ev, "derecha"),
        onSwipedUp:(ev) => handleSwipe(ev, "arriba")
    });

    return (
        <div id="tablero" onKeyDown={handleKeyDown} {...deslizadorHandle} tabIndex="0">
            <div id="juego">
                {matriz.map((fila, indexFila) => {
                    return (
                        <Fila key={indexFila} fila={fila} indexFila={indexFila} />
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

const Fila = ({ fila, indexFila }) => {
    return (
        <div className="fila" key={"Fila-"+indexFila}>
            {fila.map((celda, index) => <CeldaMemo key={indexFila + "-" +index} celda={celda} />)}
        </div>
    )
}
    
const CeldaMemo = memo(({ celda }) => <Celda valorCelda={celda} />)

export default memo(Tablero)
