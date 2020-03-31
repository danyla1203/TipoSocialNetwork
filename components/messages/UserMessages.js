import React, { useState }  from 'react';
import propTypes from "prop-types";

import Message from "./Message";

function UserMessages(props) {
    const [ messages, setMessages ] = useState(props.messages);
    
    let getMessage = (data) => {
        let className;
        
        if (data.recipient_id == props.user_data.user_id) {
            className = "user_message";
        } else {
            className = "my_message";
        }

        return (
            <Message text={ data.text }
                     key={ data.message_id } 
                     className={ className }
            />
        )
    }

    let sendMessage = (form_id) => {
        let forms = document.querySelectorAll("form");
        let form;
        for (let i = 0; i < forms.length; i++) {
            
            if (parseInt(forms[i].id) == form_id){
                form = forms[i];
                break;
            }
            
        }
        console.log(form);
        let formData = new FormData(form);
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", `/data/messages/add/${props.user2.user_id}/${props.user2.name}`);
        xhr.send(formData);
        
        let id = messages[messages.length - 1].key ? messages[messages.length - 1].key + 1 : 0
        let recipient_id = messages[0].recipient_id == props.user_data.id ? messages[0].sender_id : messages[0].recipient_id;
        
        let message = {
            message_id: id,
            name: props.user_data.name,
            text: form.elements.text.value,
            date: "2009-05-12 10:10:23",
            recipient_id: props.user2.user_id,
            sender_id: props.user_data.id
        }

        let newMessageArray = messages.concat([message]);
        setMessages(newMessageArray);
    }

    // props match isn't valid. Remake
    if (!messages) {
        let xhr = new XMLHttpRequest();
       
        xhr.open("GET", "/data/user/" + props.match.params.user_id);
        xhr.send()
    
        xhr.onload = () => {
            let req = new XMLHttpRequest();
            req.open("GET", "/data/messages/" + JSON.parse(xhr.response)[0].user_id);
            req.send();
            req.onload = () => {
                let result = JSON.parse(req.response);

                let list = result.map((element) => {
                    return getMessage(element);
                });

                setMessages(list);
                setRecipient(JSON.parse(xhr.response)[0].user_id);
            }
        }
    }

    let rendered = messages.map((element) => {
        return getMessage(element);
    });
    let user = props.user2;
    return (
        <div className="message_prev">
            <div id='user_info'>
                <img src={ "/assets/img/" + user.avatar_url }/>
                <h3>{ user.name }</h3>
            </div>
            <div className="messages">
                <div id="send">
                    { rendered }
                </div>
                <form name="send_message" id={ props.user2.user_id }>
                    <input name="text"></input>
                    <button type="button" onClick={ () => sendMessage(props.user2.user_id) }>Send</button>
                </form>
            </div>
        </div>
    )
}

UserMessages.propTypes = {
    user_data: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        gender: propTypes.string,
        email: propTypes.string,
        country: propTypes.string,
        avatar_url_icon: propTypes.string,
    }),
    user2: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        avatar_url: propTypes.string,
    }),
    messages: propTypes.array.isRequired
}

export default UserMessages;