import { Request, Response } from "express";
import { ArticleModel } from "../models/ArticleModel";
import { MysqlError } from "mysql";

export class ArticleAppend {
    model: ArticleModel;
    constructor(model: ArticleModel) {
        this.model = model;
    }

    getDate(): string {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hour = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let insertDate = `${year}-${month}-${date} ${hour}:${minutes}:${seconds}.00`;
        return insertDate;
    }

    run(req: Request, res: Response) {
        let photos_list;
        if (req.body.photos_list) {
            photos_list = req.body.photos_list.split(",");
        }
        let title = req.body.title;
        let text = req.body.text;
        let date = this.getDate();
        if (req.user.user_id == parseInt(req.params.user_id)) {
            this.model.insertArticle(title, text, parseInt(req.params.user_id), photos_list,  date, (err: MysqlError) => {
                if (err) throw err;
            });
        }
        res.end();
    }
}