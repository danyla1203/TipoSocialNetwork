import React from "react";
import { User } from "./lib/User";
import { FormProps } from "./App";

export function LoginForm(props: FormProps) {
    const check = () => {
        let form = document.querySelector<HTMLFormElement>("#login");
        let userData = new FormData(form);

        let xhr = new XMLHttpRequest();        
        xhr.open("POST", "/user/check");

        xhr.send(userData);
        xhr.onload = () => {
            let result = JSON.parse(xhr.response);
            if (xhr.status == 400) {
                props.sendError("Login Error");
            } else {
                let token = xhr.getResponseHeader("Authentication");
                window.token = token;
                props.setUser(new User(result), token);
            }
        };
    }


    return (
        <form action="/admin/check" method="POST" id="login">
            <fieldset>
                <legend>Войдите</legend>
                <input type="name" name="name" placeholder="Name:"/>
                <input type="password" name="password" placeholder="Password"/>
                <button type="button" onClick={ check }>Go</button> 
            </fieldset>
        </form>
    )
}