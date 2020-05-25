const Model = require("./Model");
class ArticleModel extends Model {
    getArticle(article_id, user_id, callback) {
        let article = this.sqlMaker
            .select(["articles.article_id", "user_id", "title", "text", "date", "path"])
            .from("articles")
            .join("article_photos")
            .on("articles.article_id = article_photos.article_id")
            .where(`articles.article_id = ${article_id} AND articles.user_id = ${user_id}`);
            
        this.pool.query(article, (err, result) => {
            if (err) throw err;
            let returnData = result[0];
            for (let i = 1; i < result.length; i++) {
                returnData.path += `,${result[i].path}`;
            }
            callback(returnData);
        });
    }

    getArticles(user_id, callback) {
        let articles = this.sqlMaker
            .select(["articles.article_id", "user_id", "title", "text", "date", "path"])
            .from("articles")
            .leftJoin("article_photos")
            .on("articles.article_id = article_photos.article_id")
            .where(`articles.user_id = ${user_id} ORDER BY articles.article_id DESC`);
        
        this.pool.query(articles, (err, result) => {
            if (err) throw err;
            let returnData = [];
            if (result.length > 1) {
                for (let i = 0; i < result.length; i++) {
                    let currentRecord = result[i];
                    for (let j = i + 1; j < result.length; j++) {
                        if (result[j].article_id != currentRecord.article_id) {
                            break;
                        } else {
                            currentRecord.path += `,${result[j].path}`;
                            i++;
                        }
                    }
                    returnData.push(currentRecord);
                }
            }
            callback(returnData);
        });
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
                date: date
            });
        this.pool.query(insertArticle, (err, result) => {
            if (err) throw err;
            if (!photos) {
                return;
            }
            
            let imgs = photos.map((el) => {
                return {
                    article_id: result.insertId,
                    path: el
                };
            });
            let insertImgSql = this.sqlMaker
                .insert("article_photos")
                .setMany(imgs);
            this.pool.query(insertImgSql, callback);
        });

    }

}

module.exports.ArticleModel = ArticleModel;