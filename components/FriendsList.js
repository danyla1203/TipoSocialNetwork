import React, { useState } from 'react'
import { Link } from "react-router-dom";

function FriendsList() {
    const [ friendsList, setFriends ] = useState(false);

    let getFriend = (data) => {
        console.log(data);
        return (
            <div key={ data.id } className="user_small">
                <h3>{ data.name }</h3>
                <div className="img">
                    <img src={ "/assets/img/" + data.avatar_url_icon } />
                </div>
                <Link to={ "/users/" + data.user_id }>Go to profile</Link>
            </div>
        )
    }

    let getFriendsList = () => {
        if (friendsList) {
            return;
        } else {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "/data/friends");
            xhr.send();
            
            xhr.onload = () => {
                let list = [];
                let res = JSON.parse(xhr.response)
                for (let i = 0; i < res.length; i++) {
                    let friend = getFriend(res[i]);
                    list.push(friend);
                };
                setFriends(list);
            }
        }
    }

    getFriendsList();
    let result = friendsList.length >= 1 ? friendsList : <h3>Nothing here</h3>;
    return (
        <div>
            { result }
        </div>
    )
}

//no props
export default FriendsList