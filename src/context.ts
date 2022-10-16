/**
 * @author 陆劲涛
 * @description 示例context
 */
import { createContext } from 'react'

interface UserData {
    isLoggedIn: boolean
}

export const UserContext = createContext({
    userData: {} as UserData,
    setUserData: null,
})
