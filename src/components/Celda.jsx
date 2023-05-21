import React from "react"

const Celda = (({valorCelda}) => {
    const TipoClase = {
        1: 'ocupada',
        2: 'nueva',
      }

    let clase = TipoClase[valorCelda] || ""
    
    return(
        <span className={clase}></span>
    )
})

export { Celda }