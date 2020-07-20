import React, { useState } from "react";
import UserArticleList from "./articles/UserArticleList";
import { UserType } from "./lib/User";
import { MessageForm } from "./MessageForm";

export function UserHome(props: { guest_user: UserType }) {
    const [ messageState, setMessageState ]: [ string, Function ] = useState("Close");  
    const [ userData, setUser ]: [ UserType, Function ] = useState();
    const [ isFriend, setFriend ]: [ boolean, Function ] = useState();
 
    let addFriend = () => {
        let id = userData.id;

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
        let id = userData.id;

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
        form = <MessageForm id={ userData.id } name={ userData.name }/>
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