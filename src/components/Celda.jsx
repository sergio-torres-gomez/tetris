import React from "react"

const Celda = (({valorCelda}) => {
    switch(valorCelda){
        case 1: var clase = "ocupada"; break
        case 2: var clase = "nueva"; break
        default: var clase = ""; break
    }
    console.log("RENDERIZA")
    return(
        <span className={clase}></span>
    )
})

export { Celda }