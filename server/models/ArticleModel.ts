import { Model, ModelType } from "./Model";
import { MysqlError } from "mysql";
import { Article } from "../types/SqlTypes";

export class ArticleModel extends Model implements ModelType {
    /**
     * @param {number} article_id
     * @param {number} user_id
     * @param {Function} callback
     *  get article with photos
     */
    getArticle(article_id: number, user_id: number, callback: Function) {
        let article = this.sqlMaker
            .select(["articles.article_id", "user_id", "title", "text", "date", "path"])
            .from("articles")
            .leftJoin("article_photos")
            .on("articles.article_id = article_photos.article_id")
            .where(`articles.article_id = ${article_id} AND articles.user_id = ${user_id}`);
            
        this.pool.query(article, (err: MysqlError, result: Article[]) => {
            if (err) throw err;
            let returnData = result[0];
            for (let i = 1; i < result.length; i++) {
                returnData.path += `,${result[i].path}`;
            }
            callback(returnData);
        });
    }

    /**
     * @param {number} user_id
     * @param {Function} callback
     *  get user's articles with photos
     */
    getArticles(user_id: number, callback: Function) {
        let articles = this.sqlMaker
            .select(["articles.article_id", "user_id", "title", "text", "date", "path"])
            .from("articles")
            .leftJoin("article_photos")
            .on("articles.article_id = article_photos.article_id")
            .where(`articles.user_id = ${user_id} ORDER BY articles.article_id DESC`);
        
        this.pool.query(articles, (err: MysqlError, result: Article[]) => {
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

    /**
     * @param {number} article_id
     * @param {(string|undefined)} title
     * @param {(string|undefined)} text
     * @param {Function} callback
     * update article 
     */
    updateArticle(article_id: number, title: string|undefined, text: string|undefined, callback: Function) {
        let updateArticle = this.sqlMaker
            .update("articles")
            .set({title: title, text: text})
            .where(`article_id = ${article_id}`);
        this.pool.query(updateArticle, callback);
    }

    /**
     * @param {number} article_id
     * @param {string} photosString
     * @param {Function} callback
     * delete article's photo, then insert new ( if new photos exist )
     */
    updatePhotos(article_id: number, photosString: string, callback: Function) {
        let deletePhotos = this.sqlMaker
            .delete("article_photos")
            .where(`article_id = ${article_id}`);
        this.pool.query(deletePhotos, (err) => {
            if (err) throw err;
            
            if (photosString.length > 1) {
                let paths = photosString.split(",");
                paths.map((el) => {
                    let updatePhotosForArticle = this.sqlMaker
                        .insert("article_photos")
                        .set({ path: el, article_id: article_id }); 
                    this.pool.query(updatePhotosForArticle, callback);
                });
            }
        });
    }

    /**
     * @param {number} article_id
     * @param {Function} callback
     * delete article
     */
    deleteArticle(article_id: number, callback: Function) {
        let deleteArticle = this.sqlMaker
            .delete("articles")
            .where(`article_id = ${article_id}`);
        this.pool.query(deleteArticle, callback);
    }
    /**
     * @param {string} title
     * @param {string} text
     * @param {number} user_id
     * @param {string[] | null} photos
     * @param {string} date
     * @param {Function} callback
     * add a new article
     */
    insertArticle(title: string, text: string, user_id: number, photos: string[] | null, date: string, callback: Function) {
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