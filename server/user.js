const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");

const app = require("./index").app;
const upload = require("./index").upload;
const pool = require("./index").pool;
const sqlMaker = require("./index").makeSql;
const userModel = require("./index").userModel;
const jwtKey = require("./index").jwtKey;

function setSessionData(body, session) {
    let sessionCopy = Object.assign({}, session);
    for (let column in body) {
        if (typeof body[column] == "string" && body[column].length < 1) {
            continue;
        }
        sessionCopy[column] = body[column]
    }
    return sessionCopy;
}

app.post("/user/signin", upload.single("avatar"), (req, res) => {
    let name = req.body.name
    let email = req.body.email;
    
    if (req.file) {
        let filePath = req.file.path;
        let targetPath_icon = path.join("/home/daniil/Desktop/NodeProjects/AuthTest", "/public/img/" + name + "_icon" + ".webp");
        let targetPath_full = path.join("/home/daniil/Desktop/NodeProjects/AuthTest", "/public/img/" + name + "_full" + ".webp");

        sharp(filePath).resize(70, 80).toFile(targetPath_icon);
        sharp(filePath).resize(300, 300).toFile(targetPath_full);
    }
    
    userModel.getEmails((err, result) => {
        if (err) throw err;
        
        for (let i = 0; i < result.length; i++) {
            if (result[i].name == name || result[i].email == email) {
                res.status(409);
            }
        }

        let img_names = {
            avatar_url_full: `${name}_full.webp`,
            avatar_url_icon: `${name}_icon.webp`
        }
        let values = Object.assign({}, req.body, img_names);
        let data = setSessionData(values, {});

        userModel.setUser(data, (err, result) => {
            if (err) throw err;
            
            let token = jwt.sign({
                id: result.insertedId,
                email: email 
            }, jwtKey, { expiresIn: "30m" })
            res.setHeader("Authetication", token);
            res.end("Added user");
        });
    })
})

app.put("/data/user/change-data/:user_id", upload.single("avatar"), (req, res) => {
    if (req.params.user_id != req.user.user_id) {
        res.end("Go to hell, хацкер");
    }
    let name = req.body.name.length > 1 ? req.body.name : req.user.name;
    let filePath;
    let targetPath_icon;
    let targetPath_full

    if (req.file) {
        filePath = req.file.path;
        targetPath_icon = path.join("/home/daniil/Desktop/Node projects/AuthTest", "/public/img/" + name + "_icon" + ".webp");
        targetPath_full = path.join("/home/daniil/Desktop/Node projects/AuthTest", "/public/img/" + name + "_full" + ".webp");

        sharp(filePath).resize(70, 80).toFile(targetPath_icon);
        sharp(filePath).resize(300, 300).toFile(targetPath_full);

    } else if(!req.file && req.body.name.length > 1) {
        let oldPath = `/home/daniil/Desktop/Node projects/AuthTest/public/img/${req.user.name}`;
        let newPath = `/home/daniil/Desktop/Node projects/AuthTest/public/img/${req.body.name}`;

        fs.rename(`${oldPath}_full.webp`, `${newPath}_full.webp`, (err) => {
            if (err) throw err;
        })
        fs.rename(`${oldPath}_icon.webp`, `${newPath}_icon.webp`, (err) => {
            if (err) throw err;
        })
    }

    if (req.file && req.body.name.length > 1) {
        let path = `/home/daniil/Desktop/Node projects/AuthTest/public/img/${req.user.name}`;

        fs.unlink(`${path}_icon.webp`, (err) => {
            if (err) throw err;
        });
        fs.unlink(`${path}_full.webp`, (err) => {
            if (err) throw err;
        });
    }

    let img_names = {
        avatar_url_full: `${name}_full.webp`,
        avatar_url_icon: `${name}_icon.webp`
    }
    let values = Object.assign({}, req.body, img_names);
    let dataToInsert = setSessionData(values, req.user || {});
        
    userModel.updateUserData(dataToInsert, req.user.user_id, (err, result) => {
        if (err) throw err;
        res.end();
    });
    req.user = dataToInsert;
})

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

app.all("/user/check", isLogin, upload.none(), (req, res) => {
    let pass = req.body.password;
    let name = req.body.name;
    
    if (req.user) {
        userModel.getSecretUserData(req.userData.id, (err, result) => {
            if (err) throw err;
            res.end(result);
        })
    }

    if ( !(name && pass) ) {  
        res.status(400);
        res.end("{}");
    }
    userModel.checkUser(name, pass, (err, result) => {
        if (err) throw err;

        if (result[0]) {
            let token = jwt.sign({
                id: result[0].user_id,
                email: result[0].email
            }, jwtKey, { expiresIn: "30m" });

            delete result[0].password;
            res.set("Authentication", token);
            res.end(JSON.stringify(result[0]));

        } else {
            res.status(404);
            res.end("{}");
        }
    })  
})

app.get("/data/news", (req, res) => {
    console.log(req.user);
    let sql = sqlMaker
        .select(["id", "article_id", "user2_id", "avatar_url_icon", "title", "text", "name", "date"])
        .from("friends")
        .join("articles")
        .on("user2_id = articles.user_id")
        .join("users")
        .on("user2_id = users.user_id")
        .where(`user1_id = ${req.user.user_id}`);
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify(result));
    })
})