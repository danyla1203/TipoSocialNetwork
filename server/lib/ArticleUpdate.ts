import { Request, Response } from "express";
import { ArticleModel } from "../models/ArticleModel";
import { Article } from "../types/SqlTypes";
import { MysqlError } from "mysql";

export class ArticleUpdate {
    model: ArticleModel;
    constructor(model: ArticleModel) {
        this.model = model;
    }

    updateArticle(article_id: number, user_id: number, body: Article, callback: Function) {
        this.model.getArticle(article_id, user_id, (result: Article) => {
            if (result) {
                let title = body.title;
                let text = body.text;
                let photos_list: string = body.photos_list;
            
                this.model.updatePhotos(article_id, photos_list, (err: MysqlError) => { if(err) throw err; });
                this.model.updateArticle(article_id, title, text, callback);
            }
        });
    }

    run(req: Request, res: Response) {
        let article_id = parseInt(req.params.user_id)
        let user = req.user;
        this.updateArticle(article_id, user.user_id, req.body, (err: MysqlError) => {
            if (err) res.sendStatus(404);
            res.end("Updated");
        });
    }
}