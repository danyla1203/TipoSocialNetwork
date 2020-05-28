import React, { useState } from "react";
import propTypes from "prop-types";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

import Comments from "../Comments";
import { processInputData } from "../user_func/textProcess";
import PhotosList from "./PhotosList";

function Article(props) {
    const [comments, setComments] = useState(null);
    const [ buttonState, setButton ] = useState("Show");

    function getComments () {
        if (comments && buttonState == "Close") {
            setButton("Show");
            return;
        } else if (comments && buttonState == "Show") {
            setButton("Close");
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/comments/" + props.article_id);
        xhr.setRequestHeader("Authentication", window.token);
        xhr.send();
        
        xhr.onload = () => {
            window.token = xhr.getResponseHeader("Authentication");
            setComments(JSON.parse(xhr.response));
            setButton("Close");
        };
    }

    //show Comments?
    let commentsList;
    if (comments && buttonState == "Close") {
        commentsList = <Comments 
                            guestData={ props.user } 
                            comments={ comments } 
                            article_id={ props.article_id } 
                        />;
    } else {
        commentsList = "";
    }

    let btnGetComments = <button onClick={ getComments }>{ buttonState}</button>;
    let textDiv = props.isFull ? <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(processInputData(props.text, false))}}></div> : 
                              <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(processInputData(props.text, true))}}></div>;

    let showFullBtn = props.isFull ? <button onClick={ () => props.closeArticle(props.article_id) }>Close</button> :
                                     <button onClick={ () => props.openArticle(props.article_id) }>Show full</button>;

    return (
        <div className="article">
            <PhotosList photosString={ props.photos } article_id={ props.article_id }/>
            <h4>Autor: { props.user.name }</h4>
            <h3>{ props.title }</h3>
            { textDiv }
            <h5>{ props.date }</h5>
            <div className="buttons">
                { showFullBtn }
                <button onClick={ () => props.delete(props.article_id) }>Delete</button>
                <button><Link to={"/edit-article/" + props.article_id}>Full edit</Link></button>
                { btnGetComments }
            </div>
            { commentsList }
        </div>
    );
}

Article.propTypes = {
    isFull: propTypes.bool.isRequired,
    article_id: propTypes.number.isRequired,
    text: propTypes.string.isRequired,
    title: propTypes.string.isRequired,
    date: propTypes.string.isRequired,
    photos: propTypes.string,

    closeArticle: propTypes.func.isRequired,
    openArticle: propTypes.func.isRequired,
    delete: propTypes.func.isRequired,

    user: propTypes.exact({
        id: propTypes.number,
        name: propTypes.string,
        avatar_url: propTypes.string,
    })
};

export default Article;