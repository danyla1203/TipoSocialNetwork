import React, { useState } from 'react'
import UserArticle from './UserArticle';
import propTypes from "prop-types";

function UserArticleList(props) {
    const [articles, setArticles] = useState();
    const [article, setArticle] = useState(false);
    
    let showFullArticle = (article_id) => {
        let article = articles.map((el) => {
            if (el.article_id == article_id) {
                return el;
            }
        });
        setArticle(article[0]);
    }

    let closeArticle = () => {
        setArticle(false);
    }

    if(!articles) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/articles/" + props.userData.user_id);
        xhr.setRequestHeader("Authentication", props.token);
        xhr.send();

        xhr.onload = () => {
            let result = JSON.parse(xhr.response);
            setArticles(result);
        }
        return (
            <div>
                <h3>Loading...</h3>
            </div>  
        )
    }

    let renderedArticles;
    if (!article) {
        renderedArticles = articles.map((el) => {
            let date = el.date.split(/[A-z]{1}/);
            date[1] = date[1].split(":");
            let toRender = `Date: ${date[0]}, Time: ${date[1][0]}:${date[1][1]}`;
            
            return <UserArticle
                        isFull={ false }
                        userData={ props.userData }
                        guest_user={ props.guest_user }
                        closeArticle = { closeArticle }
                        openArticle = { showFullArticle }
                        article_id={ el.article_id } 
                        title={ el.title } 
                        text={ el.text } 
                        date={ toRender }
                        key={ el.article_id } 
                        like_count={ el.likes }
                    />
        });
    } else {
        let date = article.date.split(/[A-z]{1}/);
        date[1] = date[1].split(":");
        let toRender = `Date: ${date[0]}, Time: ${parseInt(date[1][0]) + 2}:${date[1][1]}`;

        renderedArticles = <UserArticle
                                isFull={ true }
                                userData={ props.userData }
                                guest_user={ props.guest_user }
                                closeArticle = { closeArticle }
                                openArticle = { showFullArticle }
                                article_id={ article.article_id } 
                                title={ article.title } 
                                text={ article.text } 
                                date={ toRender }
                                key={ article.article_id } 
                                like_count={ article.likes }
                            />
    }

    return (
        <div id="articles">
            { renderedArticles }
        </div>
    )
}
UserArticleList.propTypes = {
    userData: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        avatar_url_full: propTypes.string,
        country: propTypes.string,
        gender: propTypes.string
    }),
    guest_user: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        gender: propTypes.string,
        email: propTypes.string,
        country: propTypes.string,
        avatar_url_icon: propTypes.string,
    })
}
export default UserArticleList; 