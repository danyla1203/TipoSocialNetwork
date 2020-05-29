import { Avatar } from "./Avatar";
import { UserModel } from "../models/UserModel";
import { User } from "../types/SqlTypes";
import { FieldInfo } from "mysql";
import { Request, Response } from "express";

const jwt = require("jsonwebtoken");
const jwtKey = require("../index").jwtKey;
const makeId = require("./generateRand");

export class UserSignin {
    avatar: Avatar;
    model: UserModel;

    constructor(model: UserModel) {
        this.avatar = new Avatar();
        this.model = model;
        this.appendUser = this.appendUser.bind(this);
    }

    generateJwt(id: number, name: string, email: string) {
        return jwt.sign({
            user_id: id,
            name: name,
            email: email
        }, jwtKey, { expiresIn: "7d" });
    }

    makeImgNames(id: number|string) {
        return {
            avatar_url_icon: `${id}_icon.webp`,
            avatar_url_full: `${id}_full.webp`
        };
    }

    appendUser(body: User, newUserId: number, file: any) {
        let images = {};
        if (file) {
            images = this.makeImgNames(newUserId);
            this.avatar.makeAvatar(file.path, newUserId);
        } else {
            images = this.makeImgNames("default");
        }
        body = Object.assign(body, images);
        this.model.setUser(body);
        return body;
    }

    async run(req: Request, res: Response) {
        if (req.session.authCode) {
            res.status(403);
            res.end("{}");
            return;
        }
        
        this.model.checkUserForExist(req.body.name, req.body.email)
            .then(
                (id) => {
                    let body = this.appendUser(req.body, id + 1, req.file);
                    delete body.password;
                    body.user_id = id + 1;
            
                    let code = makeId(20);
                    req.session.authCode = code; 
            
                    res.cookie("refresh_token", this.generateJwt(body.user_id, body.name, body.email));
                    res.setHeader("Authentication", code);
                    res.end(JSON.stringify(body));
                },
                () => {
                    res.sendStatus(400);
                    res.end("{}");
                }
            )
    }
}