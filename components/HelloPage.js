import React from 'react'
import Header from './Header'

function HelloPage(props) {
    return (
        <div>
            <div id="hello">
                <h1>Hello { props.name }!!!</h1>
                <h3>Welcome to my noob site!. I'm glad to see you :D</h3>
            </div>
        </div>
    )
}

export default HelloPage;