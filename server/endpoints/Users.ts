import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import { User } from "../types/SqlTypes";
import { app } from "../index";
import { Endpoint } from "./Endpoint";

export class Users implements Endpoint {
    model: UserModel;
    constructor(model: UserModel) {
        this.model = model;
    }
    run() {        
        app.get("/data/users", (req: Request, res: Response) => {
            if (typeof parseInt(req.query.start) !== "number" || typeof parseInt(req.query.end) !== "number") {
                res.sendStatus(400);
                res.end();
                return;
            }
            let start: number = parseInt(req.query.start);
            let end: number = parseInt(req.query.end);

            this.model.getUsers(req.user.user_id, start, end, (usersList: Users[]) => {
                res.json(usersList);
            });
        });

        app.get("/data/user/:user_id", (req: Request, res: Response) => {
            let id =  parseInt(req.params.user_id);
            if (id == req.user.user_id){
                res.end();
            } 
            this.model.getUserData(id, req.user.user_id, (result: User) => {
                res.setHeader("Cache-Control", "public, max-age=900");
                res.json(result);
            });
        });
    }
}