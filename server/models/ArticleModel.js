class ArticleModel {
    constructor(connection, sqlMaker) {
        this.pool = connection;
        this.sqlMaker = sqlMaker;
    }

    getArticle(article_id, user_id, callback) {
        let article = this.sqlMaker
            .select(["*"])
            .from("articles")
            .where(`article_id = ${article_id} AND user_id = ${user_id}`);
            this.pool.query(article, callback);
    }

    getArticles(user_id, callback) {
        let articles = this.sqlMaker
            .select(["*"])
            .from("articles")
            .where(`user_id = ${user_id} ORDER BY article_id DESC`);
        this.pool.query(articles, callback);
    }

    updateArticle(article_id, title, text, callback) {
        let updateArticle = this.sqlMaker
            .update("articles")
            .set({title: title, text: text})
            .where(`article_id = ${article_id}`);
        this.pool.query(updateArticle, callback);
    }

    updatePhotos(article_id, photos_list, callback) {
        let updatePhotosForArticle = this.sqlMaker
            .update("article_photos")
            .set({ path: photos_list || "" })
            .where(`article_id = ${article_id}`);
        this.pool.query(updatePhotosForArticle, callback);
    }

    deleteArticle(article_id, callback) {
        let deleteArticle = this.sqlMaker
            .delete("articles")
            .where(`article_id = ${article_id}`);
        this.pool.query(deleteArticle, callback);
    }
    insertArticle(title, text, user_id, photos, date, callback) {
        let insertArticle = this.sqlMaker
            .insert("articles")
            .set({
                title: title,
                text: text,
                user_id: user_id,
                photos_list: photos,
                date: date
            })
        this.pool.query(insertArticle, callback)
    }

}

module.exports.ArticleModel = ArticleModel;