import React, { useState } from 'react';
import propTypes from "prop-types";
import { Redirect } from "react-router-dom";

import countries from "./countryList";

function Settings(props) {
    const [isSend, setSendState] = useState(false);

    let changeData = () => {
        let data = new FormData(edit);
        let email = data.get("email");
        let name = data.get("name");

        if (!email.match(/[A-z].+@[A-z]+(.[A-z]+)+/) && email.length > 1) {
            document.getElementsByName("email")[0].style.border = "2px solid red";    
        }
        if (!name.match(/[A-z]+/) && name.length > 0) {
            document.getElementsByName("name")[0].style.border = "2px solid red";
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.open("PUT", `/data/user/${ props.userData.user_id }`);
        xhr.setRequestHeader("Authentication", props.token);
        xhr.send(data);
        xhr.onload = () => {
            props.changeUserData(JSON.parse(xhr.response));
            setSendState(true);
        };
    };

    if (isSend) {
        return <Redirect to="/user" />
    }

    return (
        <div>
            <div id="edit-data">
                <img src={ "/assets/img/" + props.userData.avatar_url_full  } />
                <h4>{ props.userData.name }</h4>
                <h4>{ props.userData.country }</h4>
                <h4>{ props.userData.gender }</h4>
                <h4>{ props.userData.email }</h4>

                <form id="edit">
                    <input placeholder="Input name:" name="name"></input>
                    { countries }
                    <input placeholder="Input gender:" name="gender"></input>
                    <input placeholder="Input email:" name="email"></input>
                    <input type="file" name="avatar"></input>
                    
                    <button type="button" onClick={ changeData }>Save it, dude!</button>    
                </form>
            </div>
        </div>
    )
}

Settings.propTypes = {
    userData: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        gender: propTypes.string,
        email: propTypes.string,
        country: propTypes.string,
        avatar_url_full: propTypes.string,
    }),
    changeUserData: propTypes.func.isRequired
}

export default Settings