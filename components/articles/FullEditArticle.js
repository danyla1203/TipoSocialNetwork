import React, { useState } from 'react'
import propTypes from 'prop-types';


function FullEditArticle(props) {
    let getArticle = () => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/data/article/${props.match.params.article_id}`, false);
        xhr.setRequestHeader("Authentication", props.token);
        xhr.send();
    }
}

FullEditArticle.propTypes = {

}

export default FullEditArticle;