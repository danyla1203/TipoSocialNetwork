const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const multer = require("multer");
const path = require("path");
const sqlMaker = require("./test_liba").createDb();

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

const checkToken = require("./middlewares/checkJwtToken");
app.use(cookieParser());
app.use(session({ secret: 'danyla1203' }));
app.use("/assets", (req, res, next) => { res.setHeader("Cache-Control", "public, max-age=3600"); next()});
app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/data/*", checkToken)

//require handlers
let Articles = require("./endpoints/Articles");
let Comments = require("./endpoints/Comments");
let Friends = require("./endpoints/Friends");
let Messages = require("./endpoints/Messages");
let User = require("./endpoints/User");
let Users = require("./endpoints/Users");

let handelrs = [
    new Articles(articleModel),
    new Comments(articleModel),
    new Friends(friendsModel),
    new User(userModel),
    new Messages(),
    new Users(userModel)
];
handelrs.map((el) => { el.run() });  

app.get("/favicon.ico", (req, res) => { res.setHeader("Cache-Control", "public, max-age=14400"); res.end() })

app.get("/data/news", (req, res) => {
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


app.all("*", (req, res) => {
    fs.readFile("public/index.html", "utf8", (err, file) => {
        if (err) throw err;
        res.setHeader("Cache-Control", "public, max-age=7200");
        res.send(file);
    });
})

app.listen(3003);