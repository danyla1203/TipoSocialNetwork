const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const multer = require("multer");
const path = require("path");
const createDb = require("./test_liba").createDb;

//create instance of bd, express etc.
const upload = multer({ dest: path.join(__dirname, "/uploads") });
const app = express();
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "danyla1203",
    database: "Test",
    password: "root"
})
const testPool = createDb();

module.exports.app = app;
module.exports.upload = upload;
module.exports.pool = pool;
module.exports.makeSql = testPool;

//middlewares
app.use(cookieParser());
app.use(session({ secret: 'danyla1203' }));
app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/assets/*", (req, res, next) => { res.setHeader("Cache-Control", "public, max-age=14400"); next()});
app.use("/data/*", (req, res, next) => {
    console.log(req.session);
    if (req.session.user.name && req.session.user.password || req.baseUrl == "/data/user/signin") {
        next();
    } else {
        res.status(403);
        res.end();
    }
})

//require handlers
require("./articles");
require("./comments");
require("./friends");
require("./messages");
require("./user");

//handlers
app.get("/favicon.ico", (req, res) => { res.setHeader("Cache-Control", "public, max-age=14400"); res.end() })

app.get("/data/news", (req, res) => {
    let sql = testPool
        .select(["id", "article_id", "user2_id", "avatar_url_icon", "title", "text", "name", "date"])
        .from("friends")
        .join("articles")
        .on("user2_id = articles.user_id")
        .join("users")
        .on("user2_id = users.user_id")
        .where(`user1_id = ${req.session.user.user_id}`);
    console.log(sql)
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify(result));
    })
})

app.get("/data/users", (req, res) => {   
    let sql = testPool
        .select(["user_id", "name", "avatar_url_icon"])
        .from("users")
        .where(`user_id <> ${req.session.user.user_id}`);
   
    pool.query(sql, (err, usersList) => {
        if (err) throw err;
        //select friends from userList
        let sql = testPool
                    .select(["id", "user_id", "avatar_url_icon", "name"])
                    .from("friends")
                    .join("users")
                    .on("friends.user2_id = users.user_id")
                    .where(`user1_id = ${req.session.user.user_id}`);
        pool.query(sql, (err, friendsList) => {
            if (err) throw err;
            for (let i = 0; i < usersList.length; i++) {
                for (let j = 0; j < friendsList.length; j++) {
                    if (usersList[i].user_id == friendsList[j].user_id) {
                        usersList[i].isFriend = true;
                        break;
                    }
                }
            }
            res.setHeader("Cache-Control", "public, max-age=3600");
            res.end(JSON.stringify(usersList));
        });
    });
})

app.get("/data/user/:user_id", (req, res) => {
    let id =  parseInt(req.params.user_id);
    if (id == req.session.user.user_id){
        res.end();
    } 
    let sql = testPool
                .select(["user_id", "name", "country", "gender", "avatar_url_full"])
                .from("users")
                .where(`user_id = ${id}`);

    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.setHeader("Cache-Control", "public, max-age=900");
        res.end(JSON.stringify(result));
    });
    
})

app.all("*", (req, res) => {
    fs.readFile("public/index.html", "utf8", (err, file) => {
        if (err) throw err;
        res.setHeader("Cache-Control", "public, max-age=7200");
        res.send(file);
    });
})

app.listen(3001);