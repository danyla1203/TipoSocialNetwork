import React from "react";

export function ErrorAlert(props: { message: string }) {
    return (
        <div id="error">
            <h3>{ props.message }</h3>  
        </div>
    );
}