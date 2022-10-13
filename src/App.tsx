/**
 * @author 陆劲涛
 * @description App
 */
import React from 'react'
import ZustandExample from './components/Example/zustand'

const App: React.FC = (props) => {
    return (
        <div className="App">
            {/* <KnowledgeGraph></KnowledgeGraph> */}
            <ZustandExample />
            {/* <Login></Login> */}
        </div>
    )
}

export default App
