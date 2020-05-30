import { makeid } from "../lib/generateRand";
import { Request, Response } from "express";
import { MysqlError } from "mysql";
import { User } from "../types/SqlTypes";
import { userModel, jwtKey } from "../index";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";


export function checkToken(req: Request, res: Response, next: Function) {
    let token = req.headers.authentication;
    if (req.session.authCode == token) {
        let hash = crypto.createHash("md5").update(makeid(20)).digest("hex");
        req.session.authCode = hash;
        res.set("Authentication", req.session.authCode);
        userModel.getSecretUserData(req.session.user_id, (err: MysqlError, result: User[]) => {
            if (err) throw err;
            delete result[0].password;
            req.user = result[0];
            next();
        });
    } else if (!token && req.cookies.refresh_token) {
        //generate new authCode and ref token
        let hash = crypto.createHash("md5").update(makeid(20)).digest("hex");
        req.session.authCode = hash;
        let refresh = jwt.sign({
            user_id: req.session.user_id,
            hash: hash
        }, jwtKey);
        res.set("Authentication", req.session.authCode);
        res.cookie("refresh_token", refresh);
        
        next();
    } else {
        res.status(400);
        res.json({});
    }
}