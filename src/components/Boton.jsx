import React from "react"

const Boton = ( props ) => {

    return (
        <button onClick={props.eventoClick}>
            {props.children}
        </button>
    )
}

export { Boton }
