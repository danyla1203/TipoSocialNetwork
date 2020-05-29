const app = require("../index").app;
const upload = require("../index").upload;

const isLogin = require("../middlewares/isLogin");

import { UserModel } from "../models/UserModel";
import { UserCheck } from "../lib/UserCheck";
import { UserUpdate } from "../lib/UserUpdate";
import { UserSignin } from "../lib/UserSignin";

export class User {
    checkUser: UserCheck;
    updateUser: UserUpdate;
    signin: UserSignin;
    constructor(model: UserModel) {
        this.signin = new UserSignin(model);
        this.updateUser = new UserUpdate(model);
        this.checkUser = new UserCheck(model);

        this.checkUser.run = this.checkUser.run.bind(this.checkUser);
        this.updateUser.run = this.updateUser.run.bind(this.updateUser);
        this.signin.run = this.signin.run.bind(this.signin);
    }

    run() {
        app.post("/user/signin", upload.single("avatar"), this.signin.run);

        app.put("/data/user/:user_id", upload.single("avatar"), this.updateUser.run);

        app.all("/user/check", isLogin, upload.none(), this.checkUser.run);
    }
}