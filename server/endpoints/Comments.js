const app = require("../index").app;
const upload = require("../index").upload;
const pool = require("../index").pool;

const Endpoint = require("./Endpoint");

class Comments extends Endpoint{
    run() {
        app.get("/data/comments/:article_id", (req, res) => {
            let sql = "SELECT comment_id, autor_id, text, date, article_id, name, avatar_url_icon FROM comments " +
                      "JOIN users ON autor_id = user_id " +
                      "WHERE article_id = " + req.params.article_id + " ORDER BY comment_id DESC";
            pool.query(sql, (err, result) => {
                if (err) throw err;
                if(result == "[]") return;
        
                res.end(JSON.stringify(result));
            })
        })
        
        app.post("/data/comments/add/:article_id", upload.none(), (req, res) => {
            //insert into comments table sql
            let article_id = req.params.article_id;
            let autor = req.user.user_id;
            let date = "2009-12-30 12:30:23";
            let text = req.body.text;
        
            let sql = `INSERT INTO comments(autor_id, text, date, article_id) VALUES(${autor}, "${text}", "${date}", ${article_id})`;
            pool.query(sql, (err, result) => {
                if (err) throw err;
                res.end(JSON.stringify(result));
            });
        })
    }
}
module.exports = Comments;