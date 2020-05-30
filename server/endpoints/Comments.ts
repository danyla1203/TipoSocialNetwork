import { Request, Response } from "express";
import { Comment } from "../types/SqlTypes";

import { app, upload, pool } from "../index";
import { Endpoint } from "./Endpoint";
import { CommentsModel } from "../models/CommentsModel";

export class Comments implements Endpoint {
    model: CommentsModel;
    constructor(model: CommentsModel) {
        this.model = model;
    }
    
    run() {
        app.get("/data/comments/:article_id", (req: Request, res: Response) => {
            this.model.selectComments(parseInt(req.params.article_id), (result: Comment[]) => {
                res.json(result);
            })
        });
        
        app.post("/data/comments/add/:article_id", upload.none(), (req: Request, res: Response) => {
            let article_id = parseInt(req.params.article_id);
            let autor = req.user.user_id;
            let date = "2009-12-30 12:30:23";
            let text = req.body.text;
            this.model.addComment(article_id, autor, date, text, (result: string) => {
                res.end(JSON.stringify(result));
            })
        });
    }
}