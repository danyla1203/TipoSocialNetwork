import React, { useState }  from 'react';
import propTypes from "prop-types";

import { formatText, findAffectedRow } from "../user_func/textProcess";
import { Redirect } from 'react-router';

function AddArticle(props) {
    const [ isDone, setDone ] = useState(false);
    let oldStringArray = [];

    let toSend = "";
    let addArticle = () => {
        let xhr = new XMLHttpRequest();

        let body = new FormData();
        body.append("text", document.getElementById("text").value);
        body.append("title", document.getElementById("title").value);

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


    let formHandler = (event) => {
        let lable;
        event.persist();
        let titleOutput = document.getElementById("titleOut");
        let textOutput = document.getElementById("textOut");
        
        if (event.target.name == "title") {
            titleOutput.innerHTML = event.target.value;

        } else if (event.target.name == "text") {
            let inputText = event.target.value;
            let splitedText = inputText.split("\n");
            
            console.log(oldStringArray, splitedText);

            if (oldStringArray.length >= 1) {              
                if (splitedText.length > oldStringArray.length) {
                    let pIndexForAdd = findAffectedRow(splitedText, oldStringArray);
                    debugger;

                    let pBefore = document.querySelector(`p[data_id="${pIndexForAdd - 1}"]`);
                    pBefore.insertAdjacentHTML("afterend", `<p data_id="${pIndexForAdd}" class="output_p"></p>`);
                    normalizeNameForP();

                } else if (splitedText.length < oldStringArray.length) {
                    //done for 50%. If user will delete many p tags?
                    let pIndexForDelete = findAffectedRow(oldStringArray, splitedText);e
                    let p = document.querySelectorAll(`p[data_id="${pIndexForDelete}"`)[0];
                    p.remove();
                    normalizeNameForP();
                    

                } else if (splitedText.length == oldStringArray.length) {
                    //done
                    for (let i = 0; i < splitedText.length; i++) {
                        if (splitedText[i] != oldStringArray[i]) {
                            let formatedText = formatText(splitedText[i]);
                            
                            let pTags = document.getElementsByTagName("p");
                            pTags[i].innerHTML = formatedText === undefined ? "" : formatedText;
                        }
                    }
                    
                    
                }
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

    let buttonText = props.isEdit ? "Change" : "Create";
    return (
        <div>
            <div id="create">
                <form id="addArticle" name="addArticles" onChange={ formHandler }>
                    <input id="title" type="text" name="title" placeholder="Title:" defaultValue={ title }/>
                    <textarea id="text" name="text" defaultValue={ textOut } ></textarea>
                    <button type="button" onClick={ addArticle }>{ buttonText }</button>
                </form>
            </div>
            <div id="output">
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