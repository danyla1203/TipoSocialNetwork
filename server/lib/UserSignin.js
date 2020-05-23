const jwt = require("jsonwebtoken");

const Avatar = require("./Avatar");
const jwtToken = require("../index").jwtKey;

class UserSignin {
    constructor(model) {
        this.avatar = new Avatar();
        this.model = model;
        this.appendUser = this.appendUser.bind(this);
    }

    async generateJwt(id, email) {
        let token = jwt.sign({
            id: id,
            email: email
        }, jwtToken, { expiresIn: "30m" });
        return token;
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
        let token = await this.generateJwt(lastUserId + 1, body.email);

        res.setHeader("Authentication", token);
        res.end(JSON.stringify(body));
    }
}

module.exports = UserSignin;