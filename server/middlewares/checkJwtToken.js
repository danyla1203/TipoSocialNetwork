function checkToken(req, res, next) {
    let token = req.headers.authentication;
    if (token) {
        try {
            let data = jwt.verify(token, jwtKey);
            userModel.getSecretUserData(data.id, (err, result) => {
                if (err) throw err;
                delete result.password;
                req.user = result[0];
                //console.log(req.user, "SUKA TOKENU");
                next();
            })
        } catch(err) { throw err }
    } else {
        res.sendStatus(403);
        res.end("");
    }
}

module.exports = checkToken;