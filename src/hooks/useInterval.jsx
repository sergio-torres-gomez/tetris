import React, { useEffect, useRef } from 'react'

const useInterval = (fn, tiempo) => {

    const fnRef = useRef()

    useEffect(() => {
        fnRef.current = fn
    }, [fn])

    useEffect(() => {
        if(tiempo !== false){
            const interval = setInterval(() => fnRef.current(), tiempo)
            return () => clearInterval(interval)
        }
    }, [tiempo])

}

export { useInterval }