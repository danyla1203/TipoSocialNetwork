import React from "react";

type Message = {
    className: string,
    text: string
}

export function Message(props: Message) {
    return (
        <div className={ props.className }>
            <p>{ props.text }</p>
        </div>
    );
}