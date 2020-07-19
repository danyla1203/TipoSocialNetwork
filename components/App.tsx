import React, { Component }  from "react";

import RegForm from "./RegForm";
import ErrorAlert from "./ErrorAlert";
import UserRouter from "./UserRouter";
import LoginForm from "./LoginForm";
import { User } from "./lib/User";

type AppState = {
    errors: string[],
    user: User
    isLogin: boolean,
    token: string
}

export type FormProps = {
    sendError: (message: string) => void;
    setUser: (user: User, token: string) => void;
}

export class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        
        this.changeUserData = this.changeUserData.bind(this);
        this.setError = this.setError.bind(this);
        this.setUser = this.setUser.bind(this);
    }

    setUser(user: User, token: string) {
        this.setState({isLogin: true, user: user, token: token});
    }

    setError(message: string) {
        this.setState({ errors: [message] });
    }

    //TODO: write types, but later :)
    changeUserData(userData) {
        let newUserData = {};
        for (let column in userData) {
            if (userData[column].length < 2) {
                newUserData[column] = this.state.userData[column];
            }
            newUserData[column] = userData[column];
        }
        newUserData.user_id = this.state.userData.user_id;
        newUserData.avatar_url_full = `${newUserData.user_id}_full.webp`;
        newUserData.avatar_url_icon = `${newUserData.user_id}_icon.webp`;

        this.setState({
            user: newUserData
        });
    }

    componentDidMount() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/user/check");
        xhr.send();
        xhr.onload = () => {
            let result = JSON.parse(xhr.response);
            if (Object.keys(result).length === 0 && result.constructor === Object) {
                return;
            } else {
                let token = xhr.getResponseHeader("Authentication");
                window.token = token;
                this.setState({
                    isLogin: true,
                    user: new User(result),
                });

            }
        };
    }

    render() {
        let user = this.state.user
        let renderedErrors;

        if (this.state.errors.length > 0) {
            renderedErrors = this.state.errors.map((el: string) => {
                return <ErrorAlert message={el} />;
            });
        }

        if (Object.keys(user).length > 1) { 
            return (
                <UserRouter 
                    user = { user }
                    changeUserData = { this.changeUserData }
                />
            );

        } else {
            return (
                <div id="autorisation">
                    <div id="errors">
                        { renderedErrors }
                    </div>
                    <LoginForm
                        setError={ this.setError }
                        setUser={ this.setUser }
                    />
                    <RegForm 
                        sendError = { this.setError } 
                        setUser={ this.setUser }
                    />
                </div>
            );
        }
    }    
}