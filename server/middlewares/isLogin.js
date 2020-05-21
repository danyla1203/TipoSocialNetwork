function isLogin(req, res, next) {
    let token = req.headers.authorization;
    if (token) {
        try {
            let userData = jwt.verify(token, jswKey);
            req.user = userData;
        } catch(err) { throw err }
    }
    next();
}
module.exports = isLogin;