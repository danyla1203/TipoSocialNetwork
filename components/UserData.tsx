import React from "react";
import { UserType } from "./lib/User";

export function UserData(props: { user: UserType} ) {
    let userData = props.user;
    return (
        <div id="user">
                <div>
                    <div id="img" >
                        <img src={ "/assets/img/" + userData.avatar_url_full} />    
                    </div>
                        <div>
                            <div id="user-data">
                            <h5>{ userData.name }</h5>
                            <h5>Country: { userData.country }</h5>
                            <h5>Gender: { userData.gender }</h5>
                            <h5>Email: { userData.email }</h5>
                        </div>
                    </div>

                </div>
            </div>
    )
}