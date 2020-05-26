import React, { useState } from "react";
import propTypes from "prop-types";
import { Redirect } from "react-router";

import { formHandler as textProcess } from "../user_func/textProcess";
import PhotosList from "./PhotosList";

function AddArticle(props) {
    const [ isDone, setDone ] = useState(false);
    const [ articleData, setArticleData ] = useState(false);

    let oldStringArray = [];

    let addArticle = () => {
        let xhr = new XMLHttpRequest();

        let body = new FormData();
        body.append("text", document.getElementById("text").value);
        body.append("title", document.getElementById("title").value);

        if (articleData.photos) {
            if (articleData.photos.length < 3) {
                let photos = articleData.photos.map((el) => {
                    return el.fileName;
                });
                body.append("photos_list", photos.join());
            }
        }

        if (props.isEdit) {
            xhr.open("PUT", `/data/article/${props.match.params.article_id}`);
            xhr.setRequestHeader("Authentication", props.token);
            xhr.send(body);
        } else {
            xhr.open("POST", `/data/article/${props.user_id}`);
            xhr.setRequestHeader("Authentication", props.token);
            xhr.send(body);
        }
        xhr.onload = () => {
            setDone(true);
        };
    };

    let formHandler = (event) => {
        event.persist();
        textProcess(event);
    };

    let uploadPhoto = (e) => {
        let target = e.target;
        let formData = new FormData();
        formData.append("picture-to-article", target.files[0]);
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/data/add-picture");
        xhr.setRequestHeader("Authentication", props.token);
        xhr.send(formData);
        
        xhr.onload = () => {
            let buttons = articleData.photos ? [...articleData.photos] : [];
            let referenceId = buttons.length > 0 ? buttons[buttons.length - 1].id + 1: 0;
            buttons.push({
                id: referenceId,
                fileName: xhr.response
            });
            let newState = Object.assign({}, articleData);
            newState.photos = buttons;
            setArticleData(newState);
        };
    };
    let deleteImg = (filename) => {
        let newState = Object.assign({}, articleData);
        let newPhotosList = newState.photos.filter((el) => {
            if (el.fileName != filename) {
                return el;
            }
        });
        newState.photos = newPhotosList;
        setArticleData(newState);
    };

    let getDeleteButtons = () => {
        let result;
        if (articleData.photos) {
            result = articleData.photos.map((el) => {
                return (
                    <button key={ el.id } onClick={ () => { deleteImg(el.fileName); } }>Delete img</button>
                );
            });
        } else {
            result = "";
        }
        return result;
    };
    let getImgTags = () => {
        let result;
        if (articleData.photos) {
            result = articleData.photos.map((el) => {
                return el.fileName;
            });
            result = result.join();
        } else {
            result = "";
        }
        return result;
    };


    if (isDone) {
        return <Redirect to="/user" />;
    }

    if (props.isEdit & !articleData) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/data/article/${props.match.params.article_id}`, false);
        xhr.setRequestHeader("Authentication", props.token);
        xhr.send();

        let result = JSON.parse(xhr.response);
        let title = result.title;
        let textOut = result.text;
        let photosList = result.path || "";

        let i = 0;
        photosList = photosList.split(",").map((el) => {
            i++;
            return {
                id: i,
                fileName: el,
            };
        });

        setArticleData({
            title: title,
            text: textOut,
            photos: photosList[0].fileName.length > 2 ? photosList : []
        });
    } else if (!props.isEdit & Object.keys(articleData).length > 1) {
        setArticleData([]);
    }

    let deleteBtns = getDeleteButtons();
    let imgString = getImgTags();

    let buttonText = props.isEdit ? "Change" : "Create";
    return (
        <div>
            <div id="create">
                <form id="addArticle" name="addArticles" onChange={ formHandler }>
                    <input 
                        id="title" 
                        type="text" 
                        name="title" 
                        placeholder="Title:"
                        value={ articleData.title }
                    />
                    <textarea id="text" name="text" defaultValue={ articleData.text } ></textarea>
                    <button type="button" onClick={ addArticle }>{ buttonText }</button>
                </form>
                <input type="file" onChange={ uploadPhoto } />
                <div id="img-container">
                    { deleteBtns } 
                </div>
            </div>
            <div id="output">
                <PhotosList photosString={ imgString } article_id={ 0 }/>
                <div id="content">
                    <h3 id="titleOut">{ articleData.title }</h3>
                    <div id="textOut"></div>
                </div>
            </div>
        </div>
    );
} 

AddArticle.propTypes = {
    token: propTypes.string.isRequired,

    user_id: propTypes.number.isRequired,
    isEdit: propTypes.bool.isRequired
};

export default AddArticle;