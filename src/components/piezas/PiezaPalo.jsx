import React, { useState } from "react"

const PiezaPalo = ({alturaMaxima}) => {
    const matriz = [[1], [1], [1]];
    const [alturaActual, setAlturaActual] = useState(alturaMaxima - matriz.length)
}

export { PiezaPalo }