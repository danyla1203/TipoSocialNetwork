const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const app = require(".").app;
const upload = require(".").upload;
const pool = require(".").pool;
const userModel = require("./index").userModel;

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
                res.status(418);
                res.end("User already exist");
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
            
            req.session.user = data;
            req.session.user.user_id = result.insertId;
            req.session.user.avatar_url_full = `${name}_full.webp`;
            req.session.user.avatar_url_icon = `${name}_icon.webp`;

            res.end("Added user");
        });
    })
})

app.post("/data/user/change-data/:user_id", upload.single("avatar"), (req, res) => {
    if (req.params.user_id != req.session.user.user_id) {
        res.end("Go to hell, хацкер");
    }
    let name = req.body.name.length > 1 ? req.body.name : req.session.user.name;
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
        let oldPath = `/home/daniil/Desktop/Node projects/AuthTest/public/img/${req.session.user.name}`;
        let newPath = `/home/daniil/Desktop/Node projects/AuthTest/public/img/${req.body.name}`;

        fs.rename(`${oldPath}_full.webp`, `${newPath}_full.webp`, (err) => {
            if (err) throw err;
        })
        fs.rename(`${oldPath}_icon.webp`, `${newPath}_icon.webp`, (err) => {
            if (err) throw err;
        })
    }

    if (req.file && req.body.name.length > 1) {
        let path = `/home/daniil/Desktop/Node projects/AuthTest/public/img/${req.session.user.name}`;

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
    let dataToInsert = setSessionData(values, req.session.user || {});
        
    userModel.updateUserData(dataToInsert, req.session.user.user_id, (err, result) => {
        if (err) throw err;
        res.end("Succesfull");
    });
    req.session.user = dataToInsert;
})

app.all("/user/check", upload.none(), (req, res) => {
    let user = req.session.user || {};
    let pass = req.body.password;
    let name = req.body.name;
    
    if ( !(name && pass) && !(user.name && user.password) ) {  
        res.status(404);
        res.end();

    } else if (user.name && user.password) {
        let user = Object.assign({}, req.session.user);
        delete user.password;
        res.end(JSON.stringify(user));

    } else if (pass && name) {
        userModel.checkUser(name, pass, (err, result) => {
            if (err) throw err;

            if (result[0]) {
                req.session.user = setSessionData(result[0], user);
                console.log(req.session.user);
                delete result[0].password;
                res.end(JSON.stringify(result[0]));

            } else {
                res.status(404);
                res.end();
            }
        });
    }    
})

app.get("/data/news", (req, res) => {
    let sql = testPool
        .select(["id", "article_id", "user2_id", "avatar_url_icon", "title", "text", "name", "date"])
        .from("friends")
        .join("articles")
        .on("user2_id = articles.user_id")
        .join("users")
        .on("user2_id = users.user_id")
        .where(`user1_id = ${req.session.user.user_id}`);
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify(result));
    })
})