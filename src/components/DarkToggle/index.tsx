/**
 * @author 陆劲涛
 * @description 暗黑模式
 */
import React from 'react'

import { Switch, useDarkreader } from 'react-darkreader'

export class DarkToggleProps {}

const DarkToggle: React.FC<DarkToggleProps> = (props) => {
    const [isDark, { toggle }] = useDarkreader(true)

    return <Switch checked={isDark} onChange={toggle} />
}

DarkToggle.defaultProps = new DarkToggleProps()
export default DarkToggle
