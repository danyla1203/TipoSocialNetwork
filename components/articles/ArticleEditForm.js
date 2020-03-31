import React, { useState } from "react";
import propTypes from "prop-types";

function ArticleEditForm(props) {
    const [ title, setTitle ] = useState(props.title);
    const [ text, setText ] = useState(props.text);

    let titleHandler = (event) => {
        console.log(event.target);
        setTitle(event.target.value);
    }
    let textHandler = (event) => {
        console.log(event.target);
        setText(event.target.value);
    }

    let saveChanges = () => {
        props.saveChanges(title, text);

    }

    return (
        <form>
            <input defaultValue={ title } onChange={ titleHandler }/>
            <textarea onChange={ textHandler } defaultValue={ text }></textarea>
            <button onClick={ saveChanges } type="button">Save changes!</button>
            <button type="button" onClick={ props.closeWithoutChanges }>Close without changes</button>
        </form>
    )
}

ArticleEditForm.propTypes = {
    title: propTypes.string.isRequired,
    text: propTypes.string.isRequired,
    saveChanges: propTypes.func.isRequired,
    closeWithoutChanges: propTypes.func.isRequired
}

export default ArticleEditForm;