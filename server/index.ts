import { Response, Request } from "express";

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv").config();
const redis = require("redis"); 
const RedisStore = require("connect-redis")(session);
const sqlMaker = require("./test_liba").createDb();

const UserModel = require("./models/UserModel").UserModel;
const ArticleModel = require("./models/ArticleModel").ArticleModel;
const FriendsModel = require("./models/FriendsModel").FriendsModel;

const jwtKey = process.env.JWT_KEY;


const app = express();
const upload = multer({ 
    dest: path.join(__dirname, "/uploads") 
});
const pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
});
const redisClient = redis.createClient(6379);
redisClient.on("error", (err: Error) => {
  console.error(err);
});

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
module.exports.redis = redisClient;

const checkToken = require("./middlewares/checkJwtToken");
app.use(session({
    store: new RedisStore({ host: "localhost", port: 6379, client: redisClient, ttl: 260 }),
    secret: "danyla1203",
    saveUninitialized: false,
    resave: false,
}));
app.use(cookieParser());
app.use("/assets", (req: Request, res: Response, next: Function) => { res.setHeader("Cache-Control", "public, max-age=10000000"); next();});
app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/data/*", checkToken);
app.use("/data/*", (req: Request, res: Response, next: Function) => {
    console.log(req.session, "session");
    next();
});
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
handelrs.map((el) => { el.run(); });  

app.get("/favicon.ico", (req: Request, res: Response) => {
     res.setHeader("Cache-Control", "public, max-age=14400"); res.end(); 
});

app.get("/data/news", (req: Request, res: Response) => {
    let sql = sqlMaker
        .select(["id", "article_id", "user2_id", "avatar_url_icon", "title", "text", "name", "date"])
        .from("friends")
        .join("articles")
        .on("user2_id = articles.user_id")
        .join("users")
        .on("user2_id = users.user_id")
        .where(`user1_id = ${req.user.user_id}`);
    pool.query(sql, (err: Error, result: Object[]) => {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });
});


app.all("*", (req: Request, res: Response) => {
    fs.readFile("public/index.html", "utf8", (err: Error, file: string) => {
        if (err) throw err;
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.send(file);
    });
});

app.listen(process.env.PORT, () => {
    console.log("Listen on port " + process.env.PORT);
});