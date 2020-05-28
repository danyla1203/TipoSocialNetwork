import React from "react";
import propTypes from "prop-types";

function PhotosList(props) {

    function selectCurrentDiv (divs) {
        let currentDiv;
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].hasAttribute("data-current")) {
                currentDiv = i;
            }
        }
        return currentDiv || 0;
    }
    function nextImg (article_id) {
        let divs = document.getElementsByClassName(`slider_img|${article_id}`);
        let currentDiv = selectCurrentDiv(divs);
        
        if (currentDiv == divs.length - 1) {
            divs[currentDiv].removeAttribute("data-current");
            divs[0].setAttribute("data-current", "");
            return;
        }
        divs[currentDiv].removeAttribute("data-current");
        divs[currentDiv + 1].setAttribute("data-current", "");
    }
    function prevImg (article_id) {
        let divs = document.getElementsByClassName(`slider_img|${article_id}`);
        let currentDiv = selectCurrentDiv(divs);
        
        if (currentDiv == 0) {
            divs[currentDiv].removeAttribute("data-current");
            divs[divs.length - 1].setAttribute("data-current", "");
            return;
        }
        divs[currentDiv].removeAttribute("data-current");
        divs[currentDiv - 1].setAttribute("data-current", "");
    }
    
    if (!props.photosString) {
        return "";
    }

    let i = 0;
    let renderedPhotos = props.photosString.split(",").map((el) => {     
        if (i == 0) {
            i++;
            return (
                <div className={"slider_img|" + props.article_id} data-current key={ i }>
                    <img src={ "/assets/img/" + el + ".webp" }/>
                </div>
            );
        }
        i++;
        return(
            <div className={ "slider_img|" + props.article_id} key={ i }>
                <img src={ "/assets/img/" + el + ".webp" }/>
            </div>
        );
    });

    return (
        <div id="slider_img">
            <div>{ renderedPhotos }</div>
            <div id="buttons">
                <button onClick={ () => { nextImg(props.article_id); } }>Next</button>
                <button onClick={ () => { prevImg(props.article_id); } }>Prev</button>
            </div>
        </div>
    );
}

PhotosList.propTypes = {
    photosString: propTypes.string,
    article_id: propTypes.number.isRequired
};
export default PhotosList;