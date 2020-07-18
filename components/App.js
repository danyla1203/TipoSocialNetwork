import React, { Component }  from "react";

import RegForm from "./RegForm";
import ErrorAlert from "./ErrorAlert";
import UserRouter from "./UserRouter";
import LoginForm from "./LoginForm";

class App extends Component {
    constructor() {
        super();
        this.state = {  
            errors: [],
            userData: {}
        };
        this.check = this.check.bind(this);
        this.changeUserData = this.changeUserData.bind(this);
        this.setError = this.setError.bind(this);
        this.setUser = this.setUser.bind(this);
    }

    setUser(user, token) {
        this.setState({isLogin: true, userData: user, token: token});
    }

    setError(message) {
        this.setState({ errors: [message] });
    }

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
            userData: newUserData
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
                    userData: result,
                });

            }
        };
    }

    render() {
        let stateUser = this.state.userData;
        let renderedErrors;

        if (this.state.errors.length > 0) {
            renderedErrors = this.state.errors.map((el) => {
                return <ErrorAlert message={el} />;
            });
        }

        if (this.state.isLogin) { 
            return (
                <UserRouter 
                    user = { stateUser }
                    changeUserData = { this.changeUserData }
                />
            );
        }

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

//no props
export default App;