import React from "react";

export function MessageForm(props: { id: number, name: string }) {
    let sendMessage = () => {
        let form = document.querySelector<HTMLFormElement>("#send_message");
        let formData = new FormData(form);

        let xhr = new XMLHttpRequest();
        
        xhr.open("POST", `/data/messages/add/${props.id}/${props.name}`);
        xhr.setRequestHeader("Authentication", window.token);
        xhr.send(formData);

        xhr.onload = () => {
            window.token = xhr.getResponseHeader("Authentication");
            console.log("Message added");
        };
    };

    return (
        <form id="send_message">
            <input name="text"></input>
            <button onClick={ sendMessage } type="button">Send!</button>
        </form
    );
}