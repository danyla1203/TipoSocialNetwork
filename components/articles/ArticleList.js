import React, { Component } from 'react';
import { Link } from "react-router-dom";
import propTypes from "prop-types";

import Article from "./Article";

class ArticleList extends Component {
    constructor() {
        super();
        this.state = {
            articles: "Nothing here",
            article: false
        }
        this.addArticle = this.addArticle.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.showFullArticle = this.showFullArticle.bind(this);
        this.closeArticle = this.closeArticle.bind(this);
    }

    componentDidMount() {       
        console.log(this.props);
        let url = "/data/articles/" + this.props.user.user_id;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();

        
        xhr.onload = () => {
            console.log(JSON.parse(xhr.response));    
            this.setState({
                articles: JSON.parse(xhr.response)
            });
        }
    }

    closeArticle() {
        this.setState({article: false});
    }

    showFullArticle(article_id) {
        let article = this.state.articles.filter((el) => {
            if (el.article_id == article_id) {
                return el;
            }
        });
        console.log(article);
        this.setState({article: [article[0]]});
    }

    deleteArticle(id) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/data/article/delete/${id}`);
        xhr.send();

        let newArticles = this.state.articles.filter((el) => {
            if (el.article_id != id) {
                return el;
            }
        });

        console.log(newArticles);
        if (newArticles[0] === undefined) {
            newArticles = [];
        }
        
        this.setState({articles: newArticles});
    } 

    getRenderedArticles(articles, isOne) {
        let userProps = this.props.user;
    
        if (typeof articles == "string"){
            return articles;

        } else {
            let renderedArticles = articles.map((el) => {
                let user = {
                    id: userProps.user_id,
                    name: userProps.name,
                    avatar_url: userProps.avatar_url_full
                }
                console.log(el);
                let date = el.date.split(/[A-z]{1}/);
                date[1] = date[1].split(":");
                let toRender = `Date: ${date[0]}, Time: ${parseInt(date[1][0]) + 2}:${date[1][1]}`;
                
                let isFull = isOne ? true : false;
                return <Article user={ user } 
                                article_id={ el.article_id }
                                openArticle={ this.showFullArticle }
                                closeArticle={ this.closeArticle }
                                isFull={ isFull }
                                title={ el.title } 
                                text={ el.text } 
                                date={ toRender }
                                delete={ this.deleteArticle } 
                                like_count={ el.likes }
                                key={ el.article_id }         
                        />
            });
            return renderedArticles;
        }
    }

    setLike(article_id) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/article/like" + article_id);
        xhr.send();
        xhr.onload = () => {
            console.log(xhr.response);
        }
    }

    addArticle() {
        let articles = this.state.articles;
        let form = document.forms.addArticles;
        let title = form.elements.title.value;
        let text = form.elements.text.value;

        let xhr = new XMLHttpRequest();
        let body = `title=${title}&text=${text}`;
       
        xhr.open("POST", "/data/insert/" + this.props.user.user_id);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
        xhr.send(body);
        
        let id = null;
        if (articles.length == 0) {
            id = 1
        } else {
            id = articles[articles.length - 1].article_id + 1;
        }
        
        let obj = [{
            article_id: id,
            title: title,
            text: text
        }];

        let newArticles = this.state.articles.concat(obj);
        this.setState({ articles: newArticles });
    }

    render() {

        if (this.state.article) {
            return (
                <div id="article_list">
                    <button id="add-article"><Link to="/user/add-article">Add article</Link></button>
                    <div id="articles">
                        { this.getRenderedArticles(this.state.article, true) }
                    </div>

                </div>
            )
        }

        let renderedArticles = this.getRenderedArticles(this.state.articles);
        if (renderedArticles.length < 1) {
            renderedArticles = <h3>Nothing to show</h3>;
        }
        return (
            <div id="article_list">
                <Link to="/add-article">Add article</Link>
                <div id="articles">
                    { renderedArticles }
                </div>

            </div>
        )
    }
}

ArticleList.propTypes = {
    user: propTypes.exact({
        id: propTypes.number,
        name: propTypes.string,
        avatar_url_full: propTypes.string,
        avatar_url_icon: propTypes.string,
    })
}

export default ArticleList;