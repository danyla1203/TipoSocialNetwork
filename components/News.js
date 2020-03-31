import React, { useState } from "react";
import propTypes from "prop-types";

import UserArticle from "./articles/UserArticle";

function News(props) {
    const [newsList, setNews] = useState();
    const [article, setArticle] = useState(false);

    let showFull = (article_id) => {
        let article = newsList.map((el) => {
            if (el.article_id == article_id) {
                return el;
            }
        });
        
        setArticle(article[0]);
    }
    let closeArticle = () => {
        setArticle(false);
    }

    if (!newsList) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/news");
        xhr.send();

        xhr.onload = () => {
            setNews(JSON.parse(xhr.response));
        }
    }

    let news = "";
    if (newsList) {
        if (newsList.length < 1) {
            return (
                <div id="news">
                    <h2>Nothing here</h2>
                </div>
            )
        }

        if(article) {
            let date = article.date.split(/[A-z]{1}/);
            date[1] = date[1].split(":");
            let toRender = `Date: ${date[0]}, Time: ${parseInt(date[1][0]) + 2}:${date[1][1]}`;
            
            let autorObj = {
                user_id: article.user2_id,
                name: article.name, 
                avatar_url: article.avatar_url_icon
            }

            return (
                <UserArticle
                    isFull={ true }
                    userData={ autorObj }
                    guest_user={ props.guest_user }
                    closeArticle = { closeArticle }
                    openArticle = { showFull }
                    article_id={ article.article_id } 
                    title={ article.title } 
                    text={ article.text } 
                    date={ toRender }
                    key={ article.article_id } 
                    like_count={ article.likes }
                />
            )
        }

        news = newsList.map( (element) => {
            let user = {
                user_id: element.user2_id,
                name: element.name,
                avatar_url: element.avatar_url_icon
            }

            return <UserArticle 
                        userData={ user }
                        closeArticle={ closeArticle }
                        openArticle={ showFull }
                        guestData={ props.guest_user }
                        article_id={ element.article_id }
                        title={ element.title }
                        text={ element.text }
                        like_count={ element.likes }
                        key={ element.id }
                    />
        });
    }

    return (
        <div>
            { news }
        </div>
    )
}

News.propTypes = {
    guest_user: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        gender: propTypes.string,
        email: propTypes.string,
        country: propTypes.string,
        avatar_url_icon: propTypes.string,
    })
}

export default News;


