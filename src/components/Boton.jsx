import React from "react"

const Boton = ( props ) => {

    return (
        <button onClick={props.eventoClick} className={props.className}>
            {props.children}
        </button>
    )
}

export { Boton }
