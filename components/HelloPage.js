import React from 'react'
import propTypes from "prop-types";

import Header from './Header';

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

HelloPage.propTypes = {
    name: propTypes.string.isRequired
}

export default HelloPage;