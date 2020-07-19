import React, { useState } from "react";
import propTypes from "prop-types";

import countries from "./countryList";
import { User } from "./lib/User";
import { FormProps } from "./App";

export function RegForm(props: FormProps) {

    const checkError = (name: string, email: string, password: string) => {
        let isError = false; 
        if (name.length <= 2) {
            isError = true;

        } else if (email.length <= 2) {
            isError = true;

        } else if (password.length <= 2) {
            isError = true;
        }
        if (isError) { 
            props.sendError("Something wrong in registration's fields"); 
        }
        return isError;
    }

    const sendRegistrationData = (data: FormData) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/user/signin");
        xhr.send(data);

        xhr.onload = () => {
            if (xhr.status !== 200) {
                props.sendError("Registration failed");
            } else {
                let token = xhr.getResponseHeader("Authentication");
                window.token = token
                props.setUser(new User(JSON.parse(xhr.response)), token);
            }
        };
    }

    const registration = () => {
        let form = document.querySelector<HTMLFormElement>("#reg")
        let formData = new FormData(form);
        let name = formData.get("name").toString();
        let email = formData.get("email").toString()
        let password = formData.get("password").toString();

        let wasError = checkError(name, email, password);
        if (!wasError) {
            sendRegistrationData(formData);
        } 
    };

    return (
        <div>   
            <form method="POST" id="reg">
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
    );
}