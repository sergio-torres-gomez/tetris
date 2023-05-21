import React from "react"
import Tablero from "./Tablero"
import { InstruccionesMovil } from "./InstruccionesMovil"
import { MobileView } from 'react-device-detect'

const Tetris = () => {
    return (
        <React.Fragment>
            <Tablero />
            <MobileView>
                <InstruccionesMovil />
            </MobileView>
        </React.Fragment>
    )
}

export { Tetris }