import React from "react";

export function HelloPage(props: { name: string }) {
    return (
        <div>
            <div id="hello">
                <h1>Hello { props.name }!!!</h1>
                <h3>Welcome to my noob site!. I'm glad to see you :D</h3>
            </div>
        </div>
    );
}