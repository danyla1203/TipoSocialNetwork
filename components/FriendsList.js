import React, { useState } from "react";
import { propTypes } from "prop-types";
import { Link } from "react-router-dom";

function FriendsList(props) {
    const [ friendsList, setFriends ] = useState(false);

    let getFriend = (data) => {
        return (
            <div key={ data.id } className="user_small">
                <div className="img">
                <Link to={ "/users/" + data.user_id }>
                    <img src={ "/assets/img/" + data.avatar_url_icon } />
                </Link>
                </div>
                <div>
                    <h3>{ data.name }</h3>
                </div>
            </div>
        );
    };

    let getFriendsList = () => {
        if (friendsList) {
            return;
        } else {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "/data/friends");
            xhr.setRequestHeader("Authentication", props.token);
            xhr.send();
            
            xhr.onload = () => {
                let list = [];
                let res = JSON.parse(xhr.response);
                for (let i = 0; i < res.length; i++) {
                    let friend = getFriend(res[i]);
                    list.push(friend);
                };
                setFriends(list);
            };
        }
    };

    getFriendsList();
    let result = friendsList.length >= 1 ? friendsList : <h3>Nothing here</h3>;
    return (
        <div>
            { result }
        </div>
    );
}

FriendsList.propTypes = {
    token: propTypes.string.isRequired
};

export default FriendsList;