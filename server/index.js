const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const multer = require("multer");
const path = require("path");
const sqlMaker = require("./test_liba").createDb();
const jwt = require("jsonwebtoken");

const UserModel = require("./models/UserModel").UserModel;
const ArticleModel = require("./models/ArticleModel").ArticleModel;
const FriendsModel = require("./models/FriendsModel").FriendsModel;

const jwtKey = "myKey";

const upload = multer({ dest: path.join(__dirname, "/uploads") });
const app = express();
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "danyla1203",
    database: "Test",
    password: "root"
})

let userModel = new UserModel(pool, sqlMaker);
let articleModel = new ArticleModel(pool, sqlMaker);
let friendsModel = new FriendsModel(pool, sqlMaker);

module.exports.userModel = userModel;
module.exports.articleModel = articleModel;
module.exports.friendsModel = friendsModel;
module.exports.app = app;
module.exports.upload = upload;
module.exports.pool = pool;
module.exports.makeSql = sqlMaker;
module.exports.jwtKey = jwtKey;

app.use(cookieParser());
app.use(session({ secret: 'danyla1203' }));
app.use("/assets", (req, res, next) => { res.setHeader("Cache-Control", "public, max-age=3600"); next()});
app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/data/*", (req, res, next) => {
    let token = req.headers.authentication;
    if (token) {
        try {
            let data = jwt.verify(token, jwtKey);
            userModel.getSecretUserData(data.id, (err, result) => {
                if (err) throw err;
                delete result.password;
                console.log(result);
                req.user = result[0];
                next();
            })
        } catch(err) { throw err }
    } else {
        res.sendStatus(403);
        res.end("");
    }
});

//require handlers
let Articles = require("./endpoints/Articles");
let Comments = require("./endpoints/Comments");
let Friends = require("./endpoints/Friends");
require("./messages");
require("./user");
require("./users");

let handelrs = [
    new Articles(articleModel),
    new Comments(articleModel),
    new Friends(friendsModel)
];
handelrs.map((el) => { el.run() });  

app.get("/favicon.ico", (req, res) => { res.setHeader("Cache-Control", "public, max-age=14400"); res.end() })

app.all("*", (req, res) => {
    fs.readFile("public/index.html", "utf8", (err, file) => {
        if (err) throw err;
        res.setHeader("Cache-Control", "public, max-age=7200");
        res.send(file);
    });
})

app.listen(3001);