/**
 * @author 陆劲涛
 * @description 暗黑模式
 */
import { darkModeAtom } from '@/App'
import { useAtom } from 'jotai'
import React from 'react'

import { Switch, useDarkreader } from 'react-darkreader'

export class DarkToggleProps {}

const DarkToggle: React.FC<DarkToggleProps> = (props) => {
    const [dark, setDark] = useAtom(darkModeAtom)
    const [isDark, { toggle }] = useDarkreader(dark)
    const saveTheme = (value: boolean) => {
        localStorage.setItem('dark', value.toString())
        setDark(value)
    }
    return (
        <Switch
            checked={isDark}
            onChange={(val) => {
                saveTheme(val)
                toggle()
            }}
        />
    )
}

DarkToggle.defaultProps = new DarkToggleProps()
export default DarkToggle
