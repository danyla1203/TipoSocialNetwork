import React from 'react'

function Message(props) {
    return (
        <div className={ props.className }>
            <p>{ props.text }</p>
        </div>
    )
}

export default Message;