/**
 * @author 陆劲涛
 * @description 暗黑模式
 */
import React from 'react'

import { Switch, useDarkreader } from 'react-darkreader'

export class DarkToggleProps { }

const DarkToggle: React.FC<DarkToggleProps> = (props) => {
    const [isDark, { toggle }] = useDarkreader(JSON.parse(localStorage.getItem('dark') || 'true'));
    const saveTheme = (value: boolean) => {
        localStorage.setItem('dark', value.toString())
    }
    return <Switch checked={isDark} onChange={(val) => {
        saveTheme(val);
        toggle();
    }} />
}

DarkToggle.defaultProps = new DarkToggleProps()
export default DarkToggle
