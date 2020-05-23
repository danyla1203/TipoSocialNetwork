import React, { useState, useEffect } from "react";
import propTypes from "prop-types";

import MessagePreview from "./MessagePreview";

function UserMessagesList(props) {
    const [messages, setMessages] = useState(null);
    const [socketInstance, setSocket] = useState(null);

    let getMessages = () => {
        if (messages) return;

        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/messages/list");
        xhr.setRequestHeader("Authentication", props.token);
        xhr.send();

        xhr.onload = () => {
            let result = JSON.parse(xhr.response);
            console.log(result);
            setMessages(result);
        };
    };

    let getMessagesToRender = () => {
        let messagesCopy = Object.assign([], messages);
        let returnArray = [];
    
        for (let i = 0; i < messagesCopy.length; i++) {
            let sender_id = messagesCopy[i].sender_id;
            let recipient_id = messagesCopy[i].recipient_id;
            let message_history = [];

            for (let j = i + 1; j < messagesCopy.length; j++ ) {
                if (messagesCopy[j].sender_id == sender_id && messagesCopy[j].recipient_id == recipient_id) {
                    message_history.push(messagesCopy[j]);
                    messagesCopy.splice(j, 1);
                    j--;
                    
                }
                if (messagesCopy[j].sender_id == recipient_id && messagesCopy[j].recipient_id == sender_id) {
                    message_history.push(messagesCopy[j]);
                    messagesCopy.splice(j, 1);
                    j--;
                    
                } else {
            
                }
            }
            message_history.unshift(messagesCopy[i]);
            returnArray.push(message_history);
            messagesCopy.splice(i, 1);
            i--;
        }
        return returnArray;
    };

    if (messages) {
        let groupMessages = getMessagesToRender();
        console.log(groupMessages);
        
        let i = 0;
        let messages2Render = groupMessages.map((element) => {
            i++;   
            return <MessagePreview
                        all_messages={ element }
                        user_data={ props.user_data }
                        key={ i }
                   />;
        });

        messages2Render = messages2Render.length >= 1 ? messages2Render : <h3>Nothing here</h3>;
        return (
            <div>
                { messages2Render }
            </div>
        );

    } else {
        getMessages();
        return <h3>Loading...</h3>;
    }
}

UserMessagesList.propTypes = {
    user_data: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        gender: propTypes.string,
        email: propTypes.string,
        country: propTypes.string,
        avatar_url_icon: propTypes.string,
    })
};

export default UserMessagesList;