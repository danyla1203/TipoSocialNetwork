import React, { useState } from 'react'
import propsTypes from "prop-types";

function Comments(props) {
    const [ comments, setComments ] = useState(props.comments);

    let sendComment = () => {
        let article_id = props.article_id;
        let sender = props.guestData;

        let forms = document.querySelectorAll("form");

        let form;
        for (let i = 0; i < forms.length; i++) {
            if (forms[i].id == article_id) form = forms[i];
        }
        
        let formData = new FormData(form);
        
        let xhr = new XMLHttpRequest();        
        xhr.open("POST", "/data/comments/add/" + props.article_id);
        xhr.setRequestHeader("Authentication", props.token);
        xhr.send(formData);

        xhr.onload = (result) => {
            let text = formData.getAll("text");

            let comment_id = JSON.parse(result.currentTarget.response).insertId;
            let obj = {
                comment_id: comment_id,
                autor_id: sender.id,
                avatar_url_icon: sender.avatar_url_icon,
                date: "2009-12-30T09:30:23.000Z",
                text: text,
                article_id: article_id
            };

            let newComments
            if (props.comments) {
                let arrayedComments = [...comments];
                arrayedComments.unshift(obj);
                newComments = arrayedComments;
            } else {
                newComments = [obj];
            }
            
            setComments(newComments);
        }
    }

    let renderedComments;
    if (props.comments || comments) {
        
        renderedComments = comments.map((element) => {
            return (
                <div className="comment" key={ element.comment_id }>
                    <img src={"/assets/img/" + element.avatar_url_icon}></img>
                    <p>{ element.text }</p>
                    <h4>{ element.date }</h4>
                </div>
            )
        })
        return (
            <div className="comments">
                 <form className="comment" name="send_comment" id={ props.article_id }>
                    <input name="text" placeholder="Send Comment"></input>
                    <button type="button" onClick={ sendComment }>Send</button>
                </form>
                { renderedComments }
            </div>
        )

    } else {
        return (
            <div></div>
        )
    }
}

Comments.propsTypes = {
    article_id: propsTypes.number.isRequired,
    comments: propsTypes.array.isRequired,
    guestData: propsTypes.exact({
        id: propsTypes.number,
        name: propsTypes.string,
        avatar_url_icon: propsTypes.string
    })
}

export default Comments