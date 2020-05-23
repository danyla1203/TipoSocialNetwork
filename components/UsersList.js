import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function UsersList(props) {
    const [ usersList, setUsers ] = useState("Nothing here");

    let addFriend = (user_id) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/data/add/friends/${user_id}`);
        xhr.setRequestHeader("Authentication", props.token);
        xhr.send();

        let newState = [];
        for (let i = 0; i < usersList.length; i++) {
            newState.push(usersList[i]);
            if (usersList[i].user_id == user_id) {
                newState[i].isFriend = true;
            }
        }
        setUsers(newState);
    }

    let deleteFriend = (user_id) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/data/delete/friends/${user_id}`);
        xhr.send();

        let newState = [];
        for (let i = 0; i < usersList.length; i++) {
            newState.push(usersList[i]);
            if (usersList[i].user_id == user_id) {
                newState[i].isFriend = false;
            }
        }
        setUsers(newState);
    }

    let renderUser = (user) => {
        let addFriendBtn;
        if (!user.isFriend) {
            addFriendBtn = <button onClick={ () => { addFriend(user.user_id) } }>Add friend</button>;
        } else {
            addFriendBtn =  <button onClick={ () => { deleteFriend(user.user_id) } }>Delete friend</button>;
        }

        return (
            <div className="user_small" key={ user.user_id }>
                <div className="img">
                    <Link to={"/users/" + user.user_id}>
                        <img src={ "/assets/img/" + (user.avatar_url_icon || "default_icon.webp") } />
                    </Link>
                </div>
                <div>
                    <h3>{ user.name }</h3>
                    { addFriendBtn }
                </div>
            </div>
        )
    } 

    let getRenderedUsers = (users) => {
        if (typeof users == "string") {
            return users;
 
        } else {
            let rendered = users.map((el) => {
                return renderUser(el);
            });
            return rendered;
        }
    }

    if (typeof usersList == "string") {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/users");
        xhr.setRequestHeader("Authentication", props.token);
        xhr.send();

        xhr.onload = () => {
            console.log(JSON.parse(xhr.response));
            setUsers(JSON.parse(xhr.response));
        }
    }

    let users = getRenderedUsers(usersList);
    return (
        <div>
            { users }
        </div>
    )
}

//no props
export default UsersList;