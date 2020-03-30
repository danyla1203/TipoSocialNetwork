import React from 'react'
import { Link } from "react-router-dom";

function Header(e) {
    let toggleHeaderForMobile = (e) => {
        e.persist();
        console.log(e);
        let ul = document.getElementById("header-ul");
        let header = document.getElementsByTagName("header")[0];

        if (e.target.id == "header-ul") {
            ul.className = "";
            header.className = "";
            return;
        }
        if (window.screen.width <= 1300) {
            ul.className = "open";
            header.className = "open"
                
        }
    }
    return (
        <header onClick={ toggleHeaderForMobile }>
            <ul id="header-ul" onClick={ toggleHeaderForMobile }>
                <Link to="/user"><li>Home</li></Link>           
                <Link to="/news"><li>News</li></Link> 
                <Link to="/add-article"><li>Add article</li></Link>
                <Link to="/users/list"><li>Find Users</li></Link>
                <Link to="/friends"><li>My friends</li></Link>
                <Link to="/messages"><li>Messages</li></Link>
                <Link to="/settings" ><li>Settings</li></Link>
            </ul>
        </header>
    )
}
export default Header;