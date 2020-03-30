import React, { useState } from 'react';
import DOMPurify from "dompurify";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
        
import Comments from "../Comments";
import { processInputData } from "../user_func/textProcess";

function UserArticle(props) {
    const [ comments, setComments ] = useState(null);
    const [ buttonState, setButton ] = useState("Show");
    
    let getComments = () => {
        if (comments) {
            let button = buttonState == "Show" ? setButton("Close") : setButton("Show");
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/comments/" + props.article_id);
        xhr.send();
        xhr.onload = () => {
            setComments(JSON.parse(xhr.response));
        }
        let button = buttonState == "Show" ? setButton("Close") : setButton("Show");
    }
    
    let addComment = (obj) => {
        let newComments = [...comments];
        newComments.unshift(obj);
        setComments(newComments);
    }

    //show Comments?
    let commentsList;
    if (comments && buttonState == "Close") {
        commentsList = <Comments 
                            user_autor={ props.userData } 
                            comments={ comments }
                            guestData = { props.guest_user }
                            article_id={ props.article_id } 
                            addComment={ addComment }                                
                        />;
    } else {
        commentsList = "";
    }

    let btnGetComments = <button onClick={ getComments }>{ buttonState}</button>
    let showFullBtn = props.isFull ? <button onClick={ () => props.closeArticle (props.article_id) }>Close</button> :
                                     <button onClick={ () => props.openArticle(props.article_id) }>Show full</button>
    
    let textDiv = props.isFull ? <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(processInputData(props.text, false))}}></div> : 
                                 <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(processInputData(props.text, true))}}></div>    
    return (
        <div className="article" >
            <h4>Autor: { props.userData.name }</h4>
            <Link to={ "/users/" + props.userData.user_id }><img src={ "/assets/img/" + props.userData.name + "_icon.webp" }/></Link>
            
            <h3>{ props.title} </h3>
            { textDiv }
            <h5>{ props.date }</h5>

            <div className="buttons">
                { showFullBtn }
                { btnGetComments }
            </div>
            { commentsList }
        </div>
    )
}

UserArticle.propTypes = {
    article_id: propTypes.number.isRequired,
    
    text: propTypes.string.isRequired,
    title: propTypes.string.isRequired,

    userData: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        avatar_url_icon: propTypes.string
    }),
    guestData: propTypes.exact({
        id: propTypes.number,
        name: propTypes.string,
        avatar_url_icon: propTypes.string,
    }),

}
export default UserArticle;
