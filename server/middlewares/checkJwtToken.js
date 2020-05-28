const jwt = require("jsonwebtoken");
const jwtKey = require("../index").jwtKey;
const userModel = require("../index").userModel;
const makeId = require("../lib/generateRand");
const crypto = require("crypto");

function checkToken(req, res, next) {
    let token = req.headers.authentication;
    if (req.session.authCode == token) {
        let hash = crypto.createHash("md5").update(makeId(20)).digest("hex");
        req.session.authCode = hash;
        res.set("Authentication", req.session.authCode);
        userModel.getSecretUserData(req.session.user_id, (err, result) => {
            if (err) throw err;
            delete result[0].password;
            req.user = result[0];
            next();
        });
    } else if (!token && req.cookies.refresh_token) {
        //generate new authCode and ref token
        let hash = crypto.createHash("md5").update(makeId(20)).digest("hex");
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

module.exports = checkToken;