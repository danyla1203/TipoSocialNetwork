import React from 'react';
import propTypes from "prop-types";

import ArticleList from './articles/ArticleList';

function Home(props) {
    let userData = props.user;
    
    return (
        <div>
            <div id="user">
                <div>
                    <h3>{ userData.name }</h3>
                    <div id="img" >
                        <img src={ "/assets/img/" + userData.avatar_url_full } />    
                    </div>
                    <div id="user-data">
                        <h5>User data:</h5>
                        <h5>Country: { userData.country }</h5>
                        <h5>Gender: { userData.gender }</h5>
                        <h5>Email: { userData.email }</h5>
                    </div>
                </div>
            </div>
            <ArticleList user={ userData }/>
        </div>
    )
}

Home.propTypes = {
    user: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        gender: propTypes.string,
        email: propTypes.string,
        country: propTypes.string,
        avatar_url_full: propTypes.string,
        avatar_url_icon: propTypes.string,
    })
}

export default Home;