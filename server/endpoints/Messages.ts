import { Request, Response } from "express";
import { Message } from "../types/SqlTypes";

import { app, upload, pool, sqlMaker } from "../index";
import { Endpoint } from "./Endpoint";
import { MessagesModel } from "../models/MessagesModel";

export class Messages implements Endpoint {
    model: MessagesModel;
    constructor(model: MessagesModel) {
        this.model = model;
    }

    run() {
        app.get("/data/messages/list", (req: Request, res: Response) => {
            this.model.getMessages(req.user.user_id, (result: Message[]) => {
                res.json(result);
            })
        })
        
        app.post("/data/messages/add/:user_id/:user_name", upload.none(), (req: Request, res: Response) => {
            let sender_id = req.user.user_id;
            let recipient_id = parseInt(req.params.user_id);
        
            let text = req.body.text;
            let date = "2009-05-12 10:10:23";
            this.model.addMessage(recipient_id, sender_id, text, date, (result: string) => {
                res.end(JSON.stringify(result));
            })
        })
    }
}
