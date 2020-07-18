import React from "react";
import propTypes from "prop-types";

function LoginForm(props) {
    const check = () => {
        let form = document.forms.test;
        let userData = new FormData(form);

        let xhr = new XMLHttpRequest();        
        xhr.open("POST", "/user/check");

        xhr.send(userData);
        xhr.onload = () => {
            let result = JSON.parse(xhr.response);
            if (xhr.status == 400) {
                props.setError("Login Error");
            } else {
                let token = xhr.getResponseHeader("Authentication");
                window.token = token;
                props.setUser(result, token);
            }
        };
    }


    return (
        <form action="/admin/check" method="POST" name="test">
            <fieldset>
                <legend>Войдите</legend>
                <input type="name" name="name" placeholder="Name:"/>
                <input type="password" name="password" placeholder="Password"/>
                <button type="button" onClick={ check }>Go</button> 
            </fieldset>
        </form>
    )
}

LoginForm.propTypes = {
    sendError: propTypes.func.isRequired,
    setUser: propTypes.func.isRequired
}

export default LoginForm;