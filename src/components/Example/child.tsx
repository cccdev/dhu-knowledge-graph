import { ExampleContext } from '@/context/example'
import React, { useContext } from 'react'

export const Child: React.FC = () => {
    const message = useContext(ExampleContext)
    return <h1>{message}</h1>
}
