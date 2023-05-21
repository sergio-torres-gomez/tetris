import React from 'react'
import { useSwipeable } from 'react-swipeable'

const imagen = process.env.PUBLIC_URL + '/assets/instrucciones.png'
const InstruccionesMovil = () => {

    const deslizadorHandle = useSwipeable({
        onSwiped: () => cerrarInstrucciones(),
        onTap: () => cerrarInstrucciones()
    });

    const cerrarInstrucciones = () => {
        document.getElementById("instrucciones-movil").classList.add("no-visible")
    }

    return (<div id="instrucciones-movil" {...deslizadorHandle}>
        <div>
            <img src={imagen} alt="Desliza para jugar" />
            <p>Desliza para jugar</p>
        </div>
    </div>)
}

export { InstruccionesMovil }