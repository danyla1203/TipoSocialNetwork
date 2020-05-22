import React, { Component }  from 'react';

import RegForm from "./RegForm";
import ErrorAlert from './ErrorAlert';
import UserRouter from './UserRouter';

class App extends Component {
    constructor() {
        super();
        this.state = {  
            errors: [],
            userData: {}
        }
        this.check = this.check.bind(this);
        this.changeUserData = this.changeUserData.bind(this);
        this.setError = this.setError.bind(this);
        this.setUser = this.setUser.bind(this);
    }

    check() {
        let form = document.forms.test;
        let userData = new FormData(form);

        let xhr = new XMLHttpRequest();        
        xhr.open("POST", "/user/check");

        xhr.send(userData);
        xhr.onload = () => {
            let result = JSON.parse(xhr.response);
            if (xhr.status == 400) {
                this.setError("Login Error");
            } else {
                let token = xhr.getResponseHeader("Authentication");
                this.setState({isLogin: true, userData: result, token: token});
            }
        }
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
                let token = xhr.getResponseHeader("Authentication")
                this.setState({
                    isLogin: true,
                    userData: result,
                    token: token
                })
            }
        }
    }

    render() {
        let stateUser = this.state.userData;
        let renderedErrors;

        if (this.state.errors.length > 0) {
            renderedErrors = this.state.errors.map((el) => {
                return <ErrorAlert message={el} />
            });
        }

        if (this.state.isLogin) { 
            let smallUser = Object.assign({}, stateUser);
            let fullUser = Object.assign({}, stateUser);   
            
            delete fullUser.avatar_url_icon;
            delete smallUser.avatar_url_full;
            return (
                <UserRouter 
                    fullUser={ fullUser } 
                    smallUser = { smallUser } 
                    changeUserData = { this.changeUserData }
                    token = { this.state.token }
                />
            )
        }

        return (
            <div id="autorisation">
                <div id="errors">
                    { renderedErrors }
                </div>
                <form action="/admin/check" method="POST" name="test">
                    <fieldset>
                        <legend>Войдите</legend>
                        <input type="name" name="name" placeholder="Name:"/>
                        <input type="password" name="password" placeholder="Password"/>
                        <button type="button" onClick={ this.check }>Go</button> 
                    </fieldset>
                </form>
                <RegForm 
                    sendError = { this.setError } 
                    setUser={ this.setUser }
                />
            </div>
        )
    }    
}

//no props
export default App;