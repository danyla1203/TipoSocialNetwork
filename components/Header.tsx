import React from "react";
import { Link } from "react-router-dom";

export function Header() {
    let toggleHeaderForMobile = (e: React.MouseEvent) => {
        e.persist();
        let header = document.getElementById("header");
        if (header.className == "close") {
            header.className = "open";
            
        } else {
            header.className = "close";
            
        }
    };
    let test = (e: React.MouseEvent) => {
        if (e.target.id == "header") {
            let header = document.getElementById("header");
            header.className = "close";
        }
    };
    return (
        <header id="header" className="close" onClick={ test }>
            <button onClick={ toggleHeaderForMobile }>X</button>
            <ul>
                <Link to="/user"><li>Home</li></Link>           
                <Link to="/news"><li>News</li></Link> 
                <Link to="/add-article"><li>Add article</li></Link>
                <Link to="/users/list"><li>Find Users</li></Link>
                <Link to="/friends"><li>My friends</li></Link>
                <Link to="/messages"><li>Messages</li></Link>
                <Link to="/settings" ><li>Settings</li></Link>
            </ul>
        </header>
    );
}