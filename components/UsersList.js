import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function UsersList() {
    const [ usersList, setUsers ] = useState("Nothing here");

    let addFriend = (user_id) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/data/add/friends/${user_id}`);
        xhr.send();
    }

    let renderUser = (user) => {
        return (
            <div className="user_small" key={ user.user_id }>
                <h3>{ user.name }</h3>
                <div className="img">
                    <img src={ "/assets/img/" + user.avatar_url_icon } />
                </div>
                <Link to={"/users/" + user.user_id}>Go to profile</Link>
                <button onClick={ addFriend }>Add friend</button>
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