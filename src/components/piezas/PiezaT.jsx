import React, { useState } from "react"

const PiezaT = ({alturaMaxima}) => {
    const matriz = [[0, 1, 0], [1, 1, 1]];
    const [alturaActual, setAlturaActual] = useState(alturaMaxima - matriz.length)
}

export { PiezaT }