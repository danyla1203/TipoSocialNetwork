import { UserModel } from "../models/UserModel";
import { Request, Response } from "express";
import { Avatar } from "./Avatar";
import { MysqlError } from "mysql";
import { User } from "../types/SqlTypes";

export class UserUpdate {
    model: UserModel;
    avatar: Avatar;
    constructor(model: UserModel) {
        this.avatar = new Avatar();
        this.model = model;
    }

    run(req: Request, res: Response) {
        if (parseInt(req.params.user_id) != req.user.user_id) {
            res.sendStatus(403);
            res.end("Go to hell, хацкер");
        }

        let dataToInsert: any = {};
        if (req.file) {
            this.avatar.deleteOldAvatars(req.user.user_id);
            this.avatar.makeAvatar(req.file.path, req.user.user_id);
            dataToInsert.avatar_url_full = `${req.user.user_id}_full.webp`;
            dataToInsert.avatar_url_icon = `${req.user.user_id}_icon.webp`;
        }

        for (let field in req.body) {
            if (req.body[field].length > 1) {
                dataToInsert[field] = req.body[field];
            }
        }
        this.model.updateUserData(dataToInsert, req.user.user_id, (err: MysqlError) => {
            if (err) throw err;

            this.model.getSecretUserData(req.user.user_id, (err: MysqlError, result: User[]) => {
                if (err) throw err;
                delete result[0].password;
                res.end(JSON.stringify(result[0]));
            });
        });
        
    }
}