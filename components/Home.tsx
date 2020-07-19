import React from "react";
import propTypes from "prop-types";

import ArticleList from "./articles/ArticleList";
import UserData from "./UserData";
import { User } from "./lib/User";

export function Home(props: { user: User }) {
    let userData = props.user;
    return (
        <div>
            <UserData user={ userData.getFull() } />
            <ArticleList user={ userData.getShort() } />
        </div>
    );
}