const jwt = require("jsonwebtoken");

const Avatar = require("./Avatar");
const jwtKey = require("../index").jwtKey;
const makeId = require("./generateRand");

class UserSignin {
    constructor(model) {
        this.avatar = new Avatar();
        this.model = model;
        this.appendUser = this.appendUser.bind(this);
    }

    generateJwt(id, name, email) {
        return jwt.sign({
            user_id: id,
            name: name,
            email: email
        }, jwtKey, { expiresIn: "7d" });
    }

    makeImgNames(id = "default") {
        return {
            avatar_url_icon: `${id}_icon.webp`,
            avatar_url_full: `${id}_full.webp`
        };
    }

    async appendUser(body, newUserId, file) {
        let images = {};
        if (file) {
            images = this.makeImgNames(newUserId);
            this.avatar.makeAvatar(file.path, newUserId);
        } else {
            images = this.makeImgNames();
        }
        body = Object.assign(body, images);
        this.model.setUser(body);
        return body;
    }

    async run(req, res) {
        if (req.session.authCode) {
            res.status(403);
            res.end("{}");
            return;
        }
        let flag = true;
        let lastUserId = await this.model.checkUserForExist(req.body.name, req.body.email).catch(() => {
            flag = false;
            res.status(409);
        });
        
        if (!flag) {
            res.end();
            return;
        }
        let body = await this.appendUser(req.body, lastUserId + 1, req.file);
        delete body.password;
        body.user_id = lastUserId + 1;

        let code = makeId(20);
        req.session.authCode = code; 

        res.cookie("refresh_token", this.generateJwt(body.user_id, body.name, body.email));
        res.setHeader("Authentication", code);
        res.end(JSON.stringify(body));
    }
}

module.exports = UserSignin;