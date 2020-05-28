import React, { useState } from "react";
import UserArticleList from "./articles/UserArticleList";
import propTypes from "prop-types";

function UserHome(props) {
    const [ messageState, setMessageState ] = useState("Close");  
    const [ userData, setUser ] = useState(false);
    const [ isFriend, setFriend ] = useState(false);
 
    let addFriend = () => {
        let id = userData.user_id;

        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/data/add/friends/${id}`);
        xhr.setRequestHeader("Authentication", window.token);
        xhr.send();

        xhr.onload = () => {
            window.token = xhr.getResponseHeader("Authentication");
            console.log(xhr.response);
        };
        setFriend(true);
    };

    let deleteFriend = () => {
        let id = userData.user_id;

        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", `/data/friends/${id}`);
        xhr.setRequestHeader("Authentication", window.token);
        xhr.send();

        xhr.onload = () => {
            window.token = xhr.getResponseHeader("Authentication");
        };
        setFriend(false);
    };

    let sendMessageButton = () => {
        if (messageState == "Close") setMessageState("Show");
        else setMessageState("Close");
    };

    let getForm = () => {
        let sendMessage = () => {
            let form = new FormData(send_message);

            let xhr = new XMLHttpRequest();
            
            xhr.open("POST", `/data/messages/add/${userData.user_id}/${userData.name}`);
            xhr.setRequestHeader("Authentication", window.token);
            xhr.send(form);

            xhr.onload = () => {
                window.token = xhr.getResponseHeader("Authentication");
                console.log("Message added");
            };
        };

        return (
            <form id="send_message">
                <input name="text"></input>
                <button onClick={ sendMessage } type="button">Send!</button>
            </form>
        );
    };

    if (!userData) {
        let xhr = new XMLHttpRequest(); 
        xhr.open("GET", `/data/user/${props.match.params.userID}`, false);
        xhr.setRequestHeader("Authentication", window.token);
        xhr.send();
        window.token = xhr.getResponseHeader("Authentication");
        let response = JSON.parse(xhr.response);
        setUser(response);
        setFriend(response.isFriend);
    }

    let form;
    if (messageState == "Show") {
        form = getForm();
    } else {
        form = "";
    }
    
    let addFriendBtn = isFriend ? <h4>Your friend</h4> : <button onClick={ addFriend }>Add friend</button>;
    let deleteFriendBtn = isFriend ? <button onClick={ deleteFriend }>DISfriend</button> : "";
    return (
        <div>
            
            <div id="user">
                <div>                    
                    <div id="img" >
                        <img src={ "/assets/img/" + userData.avatar_url_full } />    
                    </div>
                    <div>
                        <div id="user-data">
                            <h5>{ userData.name }</h5>
                            <h5>Country: { userData.country }</h5>
                            <h5>Gender: { userData.gender }</h5>
                            { addFriendBtn }
                            { deleteFriendBtn }
                            <button onClick={ sendMessageButton }>Send message!</button>
                        </div>
                        { form }
                    </div>
                    
                </div>
                
            </div>
            <UserArticleList userData={ userData } guest_user={ props.guest_user }/>            
        </div>
    );
}

UserHome.propTypes = {
    token: propTypes.string.isRequired,
    guest_user: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        gender: propTypes.string,
        email: propTypes.string,
        country: propTypes.string,
        avatar_url_full: propTypes.string,
        avatar_url_icon: propTypes.string,
    })
    
};

export default UserHome;
