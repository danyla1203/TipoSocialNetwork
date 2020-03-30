import React, { useState } from 'react';
import UserMessages from "./UserMessages";

function MessagePreview(props) {
    const [isOpen, setMode] = useState("Close");
    let messages = props.all_messages;

    let secondUser = {
        user_id: messages[0].user_id,
        name: messages[0].name,
        avatar_url: messages[0].avatar_url_icon,
    }

    let showMessages = () => {
        if (isOpen == "Close") setMode("Open");
        else setMode("Close");
    }

    let messagesToRender;
    if (isOpen == "Open") {
        
        return <UserMessages messages={ props.all_messages } 
                             user2={ secondUser }    
                             user_data={ props.user_data } 
                             key={ secondUser.user_id }
                            
                />
    } else {
        messagesToRender = "";
    }

    return (
        <div className="message_prev">
            <img src={ "/assets/img/" + secondUser.avatar_url }></img>
            <h4>{ secondUser.name }</h4>
            <button onClick={ showMessages }>See all</button>
            { messagesToRender }
        </div>
    )
}

export default MessagePreview;