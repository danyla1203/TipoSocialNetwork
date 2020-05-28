const jwtKey = require("../index").jwtKey;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const makeId = require("./generateRand");
class UserCheck {
    constructor(model) {
        this.model = model;
    }

    generateJwt(id, name, email) {
        return jwt.sign({
            user_id: id,
            name: name,
            email: email
        }, jwtKey, { expiresIn: "7d" });
    }

    run(req, res) {
        console.log(req.user);
        if (req.user) {
            this.model.getSecretUserData(req.user.user_id, (err, result) => {
                if (err) throw err;
                let hash = crypto.createHash('md5').update(makeId(20)).digest("hex");
                req.session.authCode = hash;
                result.token = hash;
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

module.exports = UserCheck;