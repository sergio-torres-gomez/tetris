import React from "react"

const BotonIniciaJuego = ( props ) => {

    return (
        <button onClick={props.eventoClick}>
            {props.children}
        </button>
    )
}

export { BotonIniciaJuego }
