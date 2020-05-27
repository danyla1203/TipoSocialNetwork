const jwt = require("jsonwebtoken");
const jwtKey = require("../index").jwtKey;

function isLogin(req, res, next) {
    let token = req.cookies.refresh_token;
    if (token) {
        try {
            let userData = jwt.verify(token, jwtKey);
            req.user = userData;
        } catch(err) { throw err; }
    }
    next();
}
module.exports = isLogin;