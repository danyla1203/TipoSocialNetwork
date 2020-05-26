import React from "react";
import propTypes from "prop-types";

function Message(props) {
    return (
        <div className={ props.className }>
            <p>{ props.text }</p>
        </div>
    );
}

Message.propTypes = {
    className: propTypes.string.isRequired,
    text: propTypes.string.isRequired
};

export default Message;