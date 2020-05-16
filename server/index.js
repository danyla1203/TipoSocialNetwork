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

module.exports.userModel = userModel;
module.exports.app = app;
module.exports.upload = upload;
module.exports.pool = pool;
module.exports.makeSql = sqlMaker;

app.use(cookieParser());
app.use(session({ secret: 'danyla1203' }));
app.use("/assets", (req, res, next) => { res.setHeader("Cache-Control", "public, max-age=3600"); next()});
app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/data/*", (req, res, next) => {
    if (req.session.user.name && req.session.user.password || req.baseUrl == "/data/user/signin") {
        next();
    } else {
        res.status(403);
        res.end();
    }
});

//require handlers
require("./articles");
require("./comments");
require("./friends");
require("./messages");
require("./user");
require("./users");

app.get("/favicon.ico", (req, res) => { res.setHeader("Cache-Control", "public, max-age=14400"); res.end() })

app.all("*", (req, res) => {
    fs.readFile("public/index.html", "utf8", (err, file) => {
        if (err) throw err;
        res.setHeader("Cache-Control", "public, max-age=7200");
        res.send(file);
    });
})

app.listen(3001);