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
export const sqlMaker = require("./test_liba").createDb();

export const jwtKey = process.env.JWT_KEY;
export const app = express();
export const upload = multer({ 
    dest: path.join(__dirname, "/uploads") 
});
export const pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
});
export const redisClient = redis.createClient(6379);
redisClient.on("error", (err: Error) => {
  console.error(err);
});

//models init
import { UserModel } from "./models/UserModel";
import { ArticleModel } from "./models/ArticleModel";
import { FriendsModel } from "./models/FriendsModel";
import { CommentsModel } from "./models/CommentsModel";
import { MessagesModel } from "./models/MessagesModel";
export let userModel = new UserModel(pool, sqlMaker);
export let articleModel = new ArticleModel(pool, sqlMaker);
export let friendsModel = new FriendsModel(pool, sqlMaker);
export let commentsModel = new CommentsModel(pool, sqlMaker);
export let messagesModel = new MessagesModel(pool, sqlMaker);

//middlewares
import { checkToken } from "./middlewares/checkJwtToken";
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

//require handlers.
import { Articles } from "./endpoints/Articles";
import { Comments } from "./endpoints/Comments";
import { Friends } from "./endpoints/Friends";
import { User } from "./endpoints/User";
import { Messages } from "./endpoints/Messages";
import { Users } from "./endpoints/Users";
let handelrs = [
    new Articles(articleModel),
    new Comments(commentsModel),
    new Friends(friendsModel),
    new User(userModel),
    new Messages(messagesModel),
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