const app = require("../index").app;
const upload = require("../index").upload;
const fs = require("fs");

const Endpoint = require("./Endpoint");

class Articles extends Endpoint{
    getDate() {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hour = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let insertDate = `${year}-${month}-${date} ${hour}:${minutes}:${seconds}.00`;
        return insertDate;
    }

    updateArticle(article, user_id) {
        this.model.getArticle(article, user_id, (err, result) => {
            if (err) throw err;
    
            if (result.length > 0) {
                let title = req.body.title;
                let text = req.body.text;
                let article_id = req.params.article_id;
                let photos_list = req.body.photos_list;
    
                this.model.updatePhotos(article_id, photos_list, (err) => { if(err) throw err });
                this.model.updateArticle(article_id, title, text, (err) => { if(err) throw err });
            }
        })
    }
    run() {
        app.post("/data/article/:user_id", upload.none(),  (req, res) => {
            let title = req.body.title;
            let text = req.body.text;
            let photos_list = req.body.photos_list.split(",");
            let date = this.getDate();
            
            if (req.user.user_id == req.params.user_id) {
                this.model.insertArticle(title, text, req.params.user_id, photos_list,  date, (err, result) => {
                    if (err) throw err;
                });
            }
            res.end();
        })
        
        app.delete("/data/article/:article_id", (req, res) => {
            this.model.deleteArticle(req.params.article_id, (err) => {
                if (err) res.setStatus(404);
                res.end("Deleted");
            })
        })
        
        app.put("/data/article/:article_id", upload.none(), (req, res) => {
            let article = req.params.article_id;
            let user = req.user;
            this.updateArticle(article, user.user_id, (err) => {
                if (err) res.sendStatus(404);
                res.end("Updated");
            });
        })
        
        app.get("/data/article/:article_id", (req, res) => {
            this.model.getArticle(req.params.article_id, req.user.user_id, (err, result) => {
                if (err) throw err;
                res.end(JSON.stringify(result));
            })
        })
        
        app.post("/data/add-picture", upload.single("picture-to-article"), (req, res) => {
            let oldPath = `/home/daniil/Desktop/NodeProjects/AuthTest/server/uploads/${req.file.filename}`;
            let newPath = `/home/daniil/Desktop/NodeProjects/AuthTest/public/img/${req.file.filename}_article.webp`;
            fs.rename(oldPath, newPath, (err) => {
                if (err) throw err;
            });
            res.end(`${req.file.filename}_article`);
        })
        
        app.get("/data/articles/:user_id", (req, res) => { 
            this.model.getArticles(req.params.user_id, (err, result) => {
                if (err) throw err;
                res.setHeader("Cache-Control", "public, max-age=60");
                res.end(JSON.stringify(result));
            })
        })
        
    }
}
module.exports = Articles;