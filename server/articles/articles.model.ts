import { Model, ModelType } from "../models/Model";
import { Article } from "../types/SqlTypes";
import { Injectable, BadRequestException } from "@nestjs/common";
import { MysqlError, OkPacket, Connection } from "mysql";
import { SqlMaker } from "../test_liba";

@Injectable()
export class ArticlesModel {
    constructor( private sqlMaker: SqlMaker) {}
    /**
     * @param {number} article_id
     * @param {number} user_id
     * @param {Function} callback
     *  get article with photos
     */
    async getArticle(article_id: number, user_id: number) {
            
        let article = this.sqlMaker
            .select(["articles.article_id", "user_id", "title", "text", "date", "path"])
            .from("articles")
            .leftJoin("article_photos")
            .on("articles.article_id = article_photos.article_id")
            .where(`articles.article_id = ${article_id} AND articles.user_id = ${user_id}`);
        
        try {
            let result: Article[] = await this.pool.query(article);
            let returnData = result[0];
            for (let i = 1; i < result.length; i++) {
                returnData.path += `,${result[i].path}`;
            }
            return returnData;

        } catch(err) {
            throw new BadRequestException();
        }
    }

    /**
     * @param {number} user_id
     * @param {Function} callback
     *  get all user's articles with photos
     */
    async getArticles(user_id: number) {
        console.log(this.sqlMaker
            .select(["articles.article_id", "user_id", "title", "text", "date", "path"])
            .from("articles"));
        let articles = this.sqlMaker
            .select(["articles.article_id", "user_id", "title", "text", "date", "path"])
            .from("articles")
            .leftJoin("article_photos")
            .on("articles.article_id = article_photos.article_id")
            .where(`articles.user_id = ${user_id} ORDER BY articles.article_id DESC`);
        
        try {
            let result: Article[] = await this.pool.query(articles);
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
            return returnData;

        } catch(err) {
            throw new BadRequestException();
        }
    }

    /**
     * @param {number} article_id
     * @param {(string|undefined)} title
     * @param {(string|undefined)} text
     * @param {Function} callback
     * update article 
     */
    updateArticle(article_id: number, title: string|undefined, text: string|undefined, ) {
        let updateArticle = this.sqlMaker
            .update("articles")
            .set({title: title, text: text})
            .where(`article_id = ${article_id}`);

        try {
            this.pool.query(updateArticle);
            return "Updated";
        } catch(err) {
            throw new BadRequestException();
        }
    }

    /**
     * @param {number} article_id
     * @param {string} photosString
     * @param {Function} callback
     * delete article's photo, then insert new ( if new photos exist )
     */
    updatePhotos(article_id: number, photosString: string) {
        //delete old photos
        let deletePhotos = this.sqlMaker
            .delete("article_photos")
            .where(`article_id = ${article_id}`);
        this.pool.query(deletePhotos);

        if (photosString.length > 1) {
            let paths = photosString.split(",");
            paths.map((el) => {
                let updatePhotosForArticle = this.sqlMaker
                    .insert("article_photos")
                    .set({ path: el, article_id: article_id }); 
                this.pool.query(updatePhotosForArticle);
            });
        }
    }

    /**
     * @param {number} article_id
     * @param {Function} callback
     * delete article
     */
    async deleteArticle(article_id: number) {
        let deleteArticle = this.sqlMaker
            .delete("articles")
            .where(`article_id = ${article_id}`);
        try {
            this.pool.query(deleteArticle);

        } catch(err) {
            throw new BadRequestException();
        }
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
    async insertArticle(title: string, text: string, user_id: number, photos: string[] | null, date: string) {
        let insertArticle = this.sqlMaker
            .insert("articles")
            .set({
                title: title,
                text: text,
                user_id: user_id,
                date: date
            });
        
        try {
            let result: OkPacket = await this.pool.query(insertArticle);
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
            this.pool.query(insertImgSql);

        } catch(err) {
            throw new BadRequestException();
        }
    }
}