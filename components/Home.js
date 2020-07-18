import React from "react";
import propTypes from "prop-types";

import ArticleList from "./articles/ArticleList";
import UserData from "./UserData";

function Home(props) {
    let userData = props.user;
    return (
        <div>
            <UserData
                user={ userData }
            />
            <ArticleList
                user={ userData } 
            />
        </div>
    );
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
};

export default Home;