import React from "react";
import { MessagesGroup } from "./MessagesRouter";
import { Link } from "react-router-dom";

export function MessagePreview(props: MessagesGroup) {
    return (
        <div>
            <Link to={`/users/messages/${props.user.id}`}>
                <img src={ props.user.icon } alt="user icon"/>
            </Link>
            <h3>{ props.user.name }</h3>
        </div>
    )
}