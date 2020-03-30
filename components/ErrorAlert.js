import React from 'react';
import propTypes from "prop-types";

function ErrorAlert(props) {
    return (
        <div id="error">
            <h3>{ props.message }</h3>  
        </div>
    )
}

ErrorAlert.propTypes = {
    message: propTypes.string.isRequired,
}

export default ErrorAlert;