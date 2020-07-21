import React, { useState } from "react";    
import { Redirect } from "react-router-dom";

import countries from "./countryList";
import { UserType } from "./lib/User";

type SettingsProps = {
    userData: UserType,
    changeUserData: Function
}
export function Settings(props: SettingsProps) {
    const [isSend, setSendState] = useState(false);

    const formCheck = (name: string, email: string): boolean => {
        let returnValue = true;
        if (!email.match(/[A-z].+@[A-z]+(.[A-z]+)+/) && email.length < 5) {
            document.getElementsByName("email")[0].style.border = "2px solid red";  
            returnValue = false;  
        }
        if (!name.match(/[A-z]+/) && name.length < 3) {
            document.getElementsByName("name")[0].style.border = "2px solid red";
            returnValue = false;
        }
        return returnValue
    }

    const changeData = () => {
        let editForm = document.querySelector<HTMLFormElement>("form#edit");
        let data = new FormData(editForm);
        let email = data.get("email").toString();
        let name = data.get("name").toString();

        let isValid = formCheck(name, email);
        if (!isValid) {
            return;    
        }

        let xhr = new XMLHttpRequest();
        xhr.open("PUT", `/data/user/${ props.userData.id }`);
        xhr.setRequestHeader("Authentication", window.token);
        xhr.send(data);
        xhr.onload = () => {
            window.token = xhr.getResponseHeader("Authentication");
            props.changeUserData(JSON.parse(xhr.response));
            setSendState(true);
        };
    };

    if (isSend) {
        return <Redirect to="/user" />;
    }

    return (
        <div>
            <div id="edit-data">
                <img src={ "/assets/img/" + props.userData.bigIcon  } />
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
    );
}