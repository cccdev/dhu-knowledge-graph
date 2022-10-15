import { UserContext } from 'context'
import React, { useContext } from 'react'

export const Child: React.FC = () => {
    const message = useContext(UserContext)
    return <h1>{message}</h1>
}
