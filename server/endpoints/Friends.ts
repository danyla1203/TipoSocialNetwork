import { FriendsModel } from "../models/FriendsModel";
import { Request, Response } from "express";
import { MysqlError } from "mysql";
import { Friend } from "../types/SqlTypes";

import { app } from "../index";
import { Endpoint } from "./Endpoint";

export class Friends implements Endpoint{
    model: FriendsModel;
    constructor(model: FriendsModel) {
        this.model = model;
    }

    run() {
        app.get("/data/friends", (req: Request, res: Response) => {
            this.model.getFriends(req.user.user_id, (err: MysqlError, result: Friend[]) => {
                if (err) throw err;
                res.end(JSON.stringify(result));
            });  
        });
        
        app.get("/data/add/friends/:user_id", (req: Request, res: Response) => {
            this.model.addFriend(req.user.user_id, parseInt(req.params.user_id), (err: MysqlError) => {
                if (err) throw err;
                res.end("added");
            });
        });
        
        app.delete("/data/friends/:user_id", (req: Request, res: Response) => {
            this.model.deleteFriend(req.user.user_id, parseInt(req.params.user_id), (err: MysqlError) => {
                if (err) throw err;
                res.end("deleted");
            });
        });
    }
}