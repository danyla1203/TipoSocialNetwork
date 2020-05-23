import React, { useState } from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";

import UserMessages from "./UserMessages";

function MessagePreview(props) {
    const [isOpen, setMode] = useState("Close");
    let messages = props.all_messages;

    let secondUser = {
        user_id: messages[0].user_id,
        name: messages[0].name,
        avatar_url: messages[0].avatar_url_icon,
    };

    let showMessages = () => {
        if (isOpen == "Close") setMode("Open");
        else setMode("Close");
    };

    let messagesToRender;
    if (isOpen == "Open") {
        
        return <UserMessages messages={ props.all_messages } 
                             user2={ secondUser }    
                             user_data={ props.user_data } 
                             key={ secondUser.user_id }
                            
                />;
    } else {
        messagesToRender = "";
    }

    return (
        <div className="message_prev">
            <Link to={ "/users/" + secondUser.user_id }>
                <img src={ "/assets/img/" + secondUser.user_id + "_icon.webp" }/>
            </Link>
            <h4>{ secondUser.name }</h4>
            <button onClick={ showMessages }>See all</button>
            { messagesToRender }
        </div>
    );
}

MessagePreview.propTypes = {
    user_data: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        gender: propTypes.string,
        email: propTypes.string,
        country: propTypes.string,
        avatar_url_icon: propTypes.string,
    }),
    all_messages: propTypes.array.isRequired
};

export default MessagePreview;