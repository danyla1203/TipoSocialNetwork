import { UserModel } from "../models/UserModel";
import { Request, Response } from "express";
import { MysqlError } from "mysql";
import { User } from "../types/SqlTypes";

const jwtKey = require("../index").jwtKey;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const makeId = require("./generateRand");

export class UserCheck {
    model: UserModel;
    constructor(model: UserModel) {
        this.model = model;
    }

    generateJwt(id: number, name: string, email: string) {
        return jwt.sign({
            user_id: id,
            name: name,
            email: email
        }, jwtKey, { expiresIn: "7d" });
    }

    run(req: Request, res: Response) {
        if (req.user) {
            this.model.getSecretUserData(req.user.user_id, (err: MysqlError, result: User[]) => {
                if (err) throw err;
                let hash = crypto.createHash('md5').update(makeId(20)).digest("hex");
                req.session.authCode = hash;
                let returnObj = {
                    token: hash,
                }
                Object.assign(returnObj, result);
                req.session.user_id = result[0].user_id;
                res.set("Authentication", hash);
                delete result[0].password;
                res.json(result[0]);
            });
            return;
        }
        if ( !(req.body.name && req.body.password) ) {  
            res.status(400);
            res.end("{}");
        }

        this.model.checkUser(req.body.name, req.body.password)
            .then(
                (result) => {
                    let refreshToken = this.generateJwt(result.user_id, result.name, result.email);
                    res.cookie("refresh_token", refreshToken);
                    let hash = crypto.createHash('md5').update(makeId(20)).digest("hex");
                    req.session.authCode = hash;
                    req.session.user_id = result.user_id;
                    res.set("Authentication", hash);
                    res.json(result);
                },
                () => {
                    res.status(400);
                    res.end("{}");
                }
            );
    }
}