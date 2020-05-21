const app = require("../index").app;
const upload = require("../index").upload;

const Endpoint = require("./Endpoint");
const isLogin = require("../middlewares/isLogin");
const UserSignin = require("../lib/UserSignin");
const UserUpdate = require("../lib/UserUpdate");
const UserCheck = require("../lib/UserCheck");

class User extends Endpoint {
    constructor(model) {
        super(model);

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

module.exports = User;