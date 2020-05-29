import { Request, Response } from "express";
import { MysqlError, OkPacket } from "mysql";
import { Comment } from "../types/SqlTypes";

const app = require("../index").app;
const upload = require("../index").upload;
const pool = require("../index").pool;

export class Comments {
    run() {
        app.get("/data/comments/:article_id", (req: Request, res: Response) => {
            let sql = "SELECT comment_id, autor_id, text, date, article_id, name, avatar_url_icon FROM comments " +
                      "JOIN users ON autor_id = user_id " +
                      "WHERE article_id = " + req.params.article_id + " ORDER BY comment_id DESC";
            pool.query(sql, (err: MysqlError, result: Comment[]) => {
                if (err) throw err;
                res.end(JSON.stringify(result));
            });
        });
        
        app.post("/data/comments/add/:article_id", upload.none(), (req: Request, res: Response) => {
            let article_id = req.params.article_id;
            let autor = req.user.user_id;
            let date = "2009-12-30 12:30:23";
            let text = req.body.text;
        
            let sql = `INSERT INTO comments(autor_id, text, date, article_id) VALUES(${autor}, "${text}", "${date}", ${article_id})`;
            pool.query(sql, (err: MysqlError, result: OkPacket) => {
                if (err) throw err;
                res.end(JSON.stringify(result));
            });
        });
    }
}