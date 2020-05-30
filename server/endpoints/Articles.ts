import * as fs from "fs";
import { app, upload } from "../index";

import { Article, User } from "../types/SqlTypes";
import { MysqlError } from "mysql";
import { ArticleModel } from "../models/ArticleModel";
import { Request, Response } from "express";
import { Endpoint } from "./Endpoint";

export class Articles implements Endpoint {
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
    run() {
        app.post("/data/article/:user_id", upload.none(),  (req: Request, res: Response) => {
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
        });
        
        app.delete("/data/article/:article_id", (req: Request, res: Response) => {
            this.model.deleteArticle(parseInt(req.params.user_id), (err: MysqlError) => {
                if (err) res.sendStatus(404);
                res.end("Deleted");
            });
        });
        
        app.put("/data/article/:article_id", upload.none(), (req: Request, res: Response) => {
            let article_id = parseInt(req.params.user_id)
            let user = req.user;
            this.updateArticle(article_id, user.user_id, req.body, (err: MysqlError) => {
                if (err) res.sendStatus(404);
                res.end("Updated");
            });
        });
        
        app.get("/data/article/:article_id", (req: Request, res: Response) => {
            this.model.getArticle(parseInt(req.params.user_id), req.user.user_id, (result: Article) => {
                res.end(JSON.stringify(result));
            });
        });
        
        app.post("/data/add-picture", upload.single("picture-to-article"), (req: Request, res: Response) => {
            let oldPath = `/home/daniil/Desktop/NodeProjects/AuthTest/server/uploads/${req.file.filename}`;
            let newPath = `/home/daniil/Desktop/NodeProjects/AuthTest/public/img/${req.file.filename}_article.webp`;
            fs.rename(oldPath, newPath, (err: Error) => {
                if (err) throw err;
            });
            res.end(`${req.file.filename}_article`);
        });
        
        app.get("/data/articles/:user_id", (req: Request, res: Response) => { 
            this.model.getArticles(parseInt(req.params.user_id), (result: User) => {
                res.setHeader("Cache-Control", "30");
                res.end(JSON.stringify(result));
            });
        });
        
    }
}