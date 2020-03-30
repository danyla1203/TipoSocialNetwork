import React, { useState } from 'react'
import propTypes from "prop-types";
import DOMPurify from 'dompurify'
import { Link } from "react-router-dom";

import Comments from "../Comments";
import ArticleEditForm from "./ArticleEditForm";
import { processInputData, boldHandler } from "../user_func/textProcess";

function Article(props) {
    const [comments, setComments] = useState(null);
    const [ buttonState, setButton ] = useState("Show");
    const [ isEdit, setMode ] = useState("Read");
    
    const [ title, setTitle ] = useState(props.title);
    const [ text, setText ] = useState(props.text);

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

    let closeArticleEdit = () => {
        setMode("Read");
    }
    
    let saveChangedArticle = (title, text) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", `/data/article/update/${props.article_id}`);
        let body = new FormData();
        body.append("title", title);
        body.append("text", text);

        xhr.send(body);

        setTitle(title);
        setText(text);
        setMode("Read");
    }

    if (isEdit == "Edit") {
        return (
            <ArticleEditForm 
                title={ title } 
                text={ text } 
                saveChanges={ saveChangedArticle }
                closeWithoutChanges={ closeArticleEdit }
            />
        )
    }

    //show Comments?
    let commentsList;
    if (comments && buttonState == "Close") {
        commentsList = <Comments guestData={ props.user } 
                                 comments={ comments } 
                                 article_id={ props.article_id }
                                 
                        />;
    } else {
        commentsList = "";
    }

    let btnGetComments = <button onClick={ getComments }>{ buttonState}</button>

    let textDiv = props.isFull ? <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(processInputData(text, false))}}></div> : 
                              <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(processInputData(text, true))}}></div>
    
    let showFullBtn = props.isFull ? <button onClick={ () => props.closeArticle (props.article_id) }>Close</button> :
                                     <button onClick={ () => props.openArticle(props.article_id) }>Show full</button>

    return (
        <div className="article">
            <h4>Autor: { props.user.name }</h4>
            <h3>{ title }</h3>
            { textDiv }
            <h5>{ props.date }</h5>
            <div className="buttons">
                { showFullBtn }
                <button onClick={ () => props.delete(props.article_id)   }>DELETE THIS CRAP</button>
                <button onClick={ () => isEdit == "Read" ? setMode("Edit") : setMode("Read") }>Add some changes to article</button>
                <button><Link to={"/edit-article/" + props.article_id}>Full edit</Link></button>
                { btnGetComments }
            </div>
            { commentsList }
        </div>
    )
}

Article.propTypes = {
    isFull: propTypes.bool.isRequired,
    article_id: propTypes.number.isRequired,
    text: propTypes.string.isRequired,
    title: propTypes.string.isRequired,
    user: propTypes.exact({
        id: propTypes.number,
        name: propTypes.string,
        avatar_url: propTypes.string,
    })
}

export default Article;