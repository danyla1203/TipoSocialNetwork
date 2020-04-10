import React, { useState }  from 'react';
import propTypes from "prop-types";

import { formatText, findAffectedRow } from "../user_func/textProcess";
import { Redirect } from 'react-router';

function AddArticle(props) {
    const [ isDone, setDone ] = useState(false);
    const [ uploadedPhotos, setUploadedPhotos ] = useState([]);

    let oldStringArray = [];
    let toSend = "";

    let addArticle = () => {
        let xhr = new XMLHttpRequest();

        let body = new FormData();
        body.append("text", document.getElementById("text").value);
        body.append("title", document.getElementById("title").value);

        let photos = uploadedPhotos.map((el) => {
            return el.fileName;
        });
        body.append("photos_list", photos.join());
        if (props.isEdit) {
            xhr.open("POST", `/data/article/update/${props.match.params.article_id}`);
            xhr.send(body);

        } else {
            xhr.open("POST", `/data/insert/${props.user_id}`);
            xhr.send(body);
        }
        xhr.onload = () => {
            setDone(true);
        }
    }

    let normalizeNameForP = () => {
        let pTags = document.getElementsByClassName("output_p");
        for (let i = 0; i < pTags.length; i++) {    
            pTags[i].attributes[0].value = i;
        }
    }
    let searchChangesInNextP = () => {

    }

    let formHandler = (event) => {
        let lable;
        event.persist();
        let titleOutput = document.getElementById("titleOut");
        let textOutput = document.getElementById("textOut");
        
        if (event.target.name == "title") {
            titleOutput.innerHTML = event.target.value;

        } else if (event.target.name == "text") {
            let inputText = event.target.value;
            if (inputText == "") {
                textOutput.value = ""; 
            }

            let splitedText = inputText.split("\n");
            
            console.log(oldStringArray, splitedText);

            if (oldStringArray.length >= 1) {              
                if (splitedText.length > oldStringArray.length) {
                    //many bugs...
                    let pIndexForAdd = findAffectedRow(splitedText, oldStringArray);
                    let pBefore = document.querySelector(`p[data_id="${pIndexForAdd - 1}"]`);
                    pBefore.insertAdjacentHTML("afterend", `<p data_id="${pIndexForAdd}" class="output_p"></p>`);

                } else if (splitedText.length < oldStringArray.length) {
                    //done for 85%.
                    let pIndexForDelete = findAffectedRow(oldStringArray, splitedText);
                    let pTags = document.getElementsByClassName(`output_p`);
                    let nextPTagIndex = pIndexForDelete + countPForDelete;
                    console.log(nextPTagIndex, splitedText);
                    debugger;

                    let countPForDelete = oldStringArray.length - splitedText.length;
                    for (let i = 0; i < countPForDelete; i++) {
                        pTags[pIndexForDelete].remove();
                    }

                
                } else if (splitedText.length == oldStringArray.length) {
                    //done 100%
                    for (let i = 0; i < splitedText.length; i++) {
                        if (splitedText[i] != oldStringArray[i]) {
                            let formatedText = formatText(splitedText[i]);
                            
                            let pTags = document.getElementsByTagName("p");
                            pTags[i].innerHTML = formatedText === undefined ? "" : formatedText;
                        }
                    }
                    
                    
                }
                normalizeNameForP();
                oldStringArray = splitedText;

            } else {
                let pTags = "";
                for (let i = 0; i < splitedText.length; i++) {
                    pTags += `<p data_id="${i}" class="output_p"></p>`;
                }
                textOutput.innerHTML = pTags;

                for (let i = 0; i < splitedText.length; i++) {
                    let dataToP = formatText(splitedText[i]);
                    let p = document.querySelector(`p[data_id="${i}"]`);
                    p.innerHTML = dataToP;
                }
                oldStringArray = splitedText;
            }

        }
    }

    let uploadPhoto = (e) => {
        let target = e.target;
        let formData = new FormData();
        formData.append("picture-to-article", target.files[0]);
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", `/data/add-picture`);
        xhr.send(formData);
        
        xhr.onload = () => {
            let buttons = [...uploadedPhotos];
            let referenceId = buttons.length > 0 ? buttons[buttons.length - 1] : 0;
            buttons.push({
                id: referenceId,
                fileName: xhr.response
            });
            setUploadedPhotos(buttons);
        }
    }
    let deleteImg = (filename) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/data/delete-picture/${filename}`);
        xhr.send();

    } 

    if (isDone) {
        return <Redirect to="/user" />
    }

    let title = "";
    let textOut = "";

    if (props.isEdit) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/data/article/${props.match.params.article_id}`, false);
        xhr.send();

        let result = JSON.parse(xhr.response)[0];
        title = result.title;
        textOut = result.text;  
    }


    let uploadedPhotosRendered = uploadedPhotos.map((el) => {
        return (
            <button key={ el.id } onClick={ () => { deleteImg(el.filename) } }>Delete img</button>
        )
    });

    let imgTags = uploadedPhotos.map((el) => {
        return (
            <img src={ "/assets/img/" + el.fileName + ".webp" }/>
        )
    })

    let buttonText = props.isEdit ? "Change" : "Create";
    return (
        <div>
            <div id="create">
                <form id="addArticle" name="addArticles" onChange={ formHandler }>
                    <input 
                        id="title" 
                        type="text" 
                        name="title" 
                        placeholder="Title:" defaultValue={ title }
                    />
                    <textarea id="text" name="text" defaultValue={ textOut } ></textarea>
                    <button type="button" onClick={ addArticle }>{ buttonText }</button>
                </form>
                <input type="file" onChange={ uploadPhoto } />
                <div id="img-container">
                    { uploadedPhotosRendered }
                </div>
            </div>
            <div id="output">
                <div>
                    { imgTags }
                </div>
                <div id="content">
                    <h3 id="titleOut">{ title }</h3>
                    <div id="textOut"></div>
                </div>
            </div>
        </div>
    )
} 

AddArticle.propTypes = {
    user_id: propTypes.number.isRequired,
    isEdit: propTypes.bool.isRequired
}

export default AddArticle;