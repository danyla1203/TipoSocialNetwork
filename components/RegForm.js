import React, { useState } from 'react';
import propTypes from "prop-types";

import countries from "./countryList";

function RegForm(props) {
    const [isSignIn, setState] = useState(false);

    let registration = (e) => {
        e.preventDefault();
        let formData = new FormData(reg);

        let isError = false; 
        if (formData.get("name").length <= 2) {
            isError = true;

        } else if (formData.get("email").length <= 2) {
            isError = true;

        } else if (formData.get("password").length <= 2) {
            isError = true;
        }
        if (isError) { props.sendError("Something wrong in fields"); return }
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/user/signin");
        xhr.send(formData);

        xhr.onload = () => {
            if (xhr.status == 418) {
                props.sendError("Registration failed");
            } else {
                location.reload();
            }
        }
    }

    

    return (
        <div>   
            <form type="submit" method="POST" id="reg">
                <fieldset>
                    <legend>Регистрация</legend>
                    <input type="text" name="name" placeholder="Name:"></input>
                    <input type="text" name="password" placeholder="Password"></input>
                    { countries }
                    <input type="text" name="email" placeholder="Email"></input>
                    <input type="text" name="gender" placeholder="Gender"></input>
                    <input type="file" name="avatar"></input>

                    <button type="button" onClick={ registration }>Sign in</button>
                </fieldset>
        </form>
        </div>
    )
}

RegForm.propTypes = {
    sendError: propTypes.func.isRequired
}

export default RegForm;