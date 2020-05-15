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
    }

    check() {
        let form = document.forms.test;
        let userData = new FormData(form);

        let xhr = new XMLHttpRequest();        
        xhr.open("POST", "/user/check");

        xhr.send(userData);
        xhr.onload = () => {
            let result = JSON.parse(xhr.response);
            if (xhr.status == 404) {
                this.setError("Login Error");
            } else {
                this.setState({isLogin: true, userData: result});
            }
        }
    }

    setError(message) {
        let errorsCopy = Object.assign([], this.state.errors);
        for (let i = 0; i < errorsCopy.length; i++) {
            if (errorsCopy[i] == message) {
                return;
            }
        }
        errorsCopy.push(message);
        this.setState({ errors: errorsCopy });
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
        newUserData.avatar_url_full = `${newUserData.name}_full.webp`;
        newUserData.avatar_url_icon = `${newUserData.name}_icon.webp`;

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
                this.setState({
                    isLogin: true,
                    userData: result
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
                <UserRouter fullUser={ fullUser } smallUser = { smallUser } changeUserData = { this.changeUserData }/>
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
                <RegForm sendError = { this.setError } />
            </div>
        )
    }    
}

//no props
export default App;