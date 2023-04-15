import React, { useState } from "react"

const PiezaL = ({alturaMaxima}) => {
    const matriz = [[1, 0, 0], [1, 0, 0], [1, 1, 1]];
    const [alturaActual, setAlturaActual] = useState(alturaMaxima - matriz.length)
}

export { PiezaL }