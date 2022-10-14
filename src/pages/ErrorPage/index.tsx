import React from 'react'
import { useRouteError } from 'react-router-dom'
import './index.less'

export default function ErrorPage() {
    const error = useRouteError()
    console.error(error)

    return (
        <React.Fragment>
            <div id="error-page">
                <h1>(⊙o⊙)…</h1>
                <p>好像发生了什么不得了的事情</p>
                <p>
                    <i>错误信息：{error.statusText || error.message}</i>
                </p>
            </div>
        </React.Fragment>
    )
}
