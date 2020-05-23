const jwtKey = require("../index").jwtKey;
const jwt = require("jsonwebtoken");

class UserCheck {
    constructor(model) {
        this.model = model;
    }

    generateJwt(id, name, email) {
        return jwt.sign({
            id: id,
            name: name,
            email: email
        }, jwtKey, { expiresIn: "30m" });
    }

    run(req, res) {
        if (req.user) {
            this.model.getSecretUserData(req.user.user_id, (err, result) => {
                if (err) throw err;
                res.end(result);
            });
        }
        if ( !(req.body.name && req.body.password) ) {  
            res.status(400);
            res.end("{}");
        }
        this.model.checkUser(req.body.name, req.body.password)
            .then(
                (result) => {
                    let token = this.generateJwt(result.user_id, result.name, result.email);
                    res.setHeader("Authentication", token);
                    res.end(JSON.stringify(result));
                },
                () => {
                    res.status(404);
                    res.end("{}");
                }
            );
    }
}

module.exports = UserCheck;