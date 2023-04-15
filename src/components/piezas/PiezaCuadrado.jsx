import React, { useState } from "react"

const PiezaCuarado = ({alturaMaxima}) => {
    const matriz = [[1, 1], [1, 1]];
    const [alturaActual, setAlturaActual] = useState(alturaMaxima - matriz.length)
}

export { PiezaCuarado }