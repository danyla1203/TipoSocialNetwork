import * as fs from "fs";
import { app, upload } from "../index";

import { Article, User } from "../types/SqlTypes";
import { MysqlError } from "mysql";
import { ArticleModel } from "../models/ArticleModel";
import { Request, Response } from "express";
import { Endpoint } from "./Endpoint";
import { ArticleUpdate } from "../lib/ArticleUpdate";
import { ArticleAppend } from "../lib/ArticleAppend";

export class Articles implements Endpoint {
    model: ArticleModel;

    updateArticle: ArticleUpdate;
    insertArticle: ArticleAppend;
    constructor(model: ArticleModel) {
        this.model = model;

        this.updateArticle = new ArticleUpdate(model);
        this.insertArticle = new ArticleAppend(model);
    }

    run() {
        app.post("/data/article/:user_id", upload.none(), this.insertArticle.run);
        app.put("/data/article/:article_id", upload.none(), this.updateArticle.run);

        app.delete("/data/article/:article_id", (req: Request, res: Response) => {
            this.model.deleteArticle(parseInt(req.params.user_id), (err: MysqlError) => {
                if (err) res.sendStatus(404);
                res.end("Deleted");
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