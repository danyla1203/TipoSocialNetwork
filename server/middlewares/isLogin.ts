import { jwtKey } from "../index";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export function isLogin(req: Request, res: Response, next: Function) {
    let token = req.cookies.refresh_token;
    if (token) {
        try {
            let userData = jwt.verify(token, jwtKey);
            req.user = userData;
        } catch(err) { throw err; }
    }
    next();
}