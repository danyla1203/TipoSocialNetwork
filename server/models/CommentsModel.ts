import { Model } from "./Model";
import { MysqlError, OkPacket } from "mysql";
import { Comment } from "../types/SqlTypes";

export class CommentsModel extends Model {
    /**
     * @param {number} article_id
     * @param {Function} callback
     * select article's comments
     */
    selectComments(article_id: number, callback: Function) {
        let comments = this.sqlMaker
            .select(["comment_id", "autor_id", "text", "date", "article_id", "name", "avatar_url_icon"])
            .from("comments")
            .join("users")
            .on("autor_id = user_id")
            .where(`article_id = ${article_id} ORDER BY comment_id DESC`)
        this.pool.query(comments, (err: MysqlError, result: Comment[]) => {
            if (err) throw err;
            callback(result)
        });
    }
    
    /**
     * @param {number} article_id
     * @param {number} autor
     * @param {string} date
     * @param {string} text
     * @param {Function} callback
     * add comment ( to article )
     */
    addComment(
        article_id: number, 
        autor: number, 
        date: string, 
        text: string, 
        callback: Function) 
    {
        let sql = this.sqlMaker
            .insert("comments")
            .set({
                article_id: article_id,
                autor_id: autor,
                date: date,
                text: text
            })
        this.pool.query(sql, (err: MysqlError, result: OkPacket[]) => {
            if (err) throw err;
            callback("Congrats! We did it!");
        })
    }
}