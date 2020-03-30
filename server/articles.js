const app = require("./server").app;
const upload = require("./server").upload;
const pool = require("./server").pool;
const makeSql = require("./server").makeSql;

app.post("/data/insert/:user_id", upload.none(),  (req, res) => {
    let title = req.body.title;
    let text = req.body.text;
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    let insertDate = `${year}-${month}-${date} ${hour}:${minutes}:${seconds}.00`;
    
    if (req.session.user.user_id == req.params.user_id) {
        let sql = makeSql.insert("articles")
                        .set({
                            title: title,
                            text: text,
                            user_id: req.session.user.user_id,
                            date: insertDate
                        })
                        
        pool.query(sql, (err) => {
            if (err) throw err;
            res.end("Added");
        });
    }
})
app.get("/data/article/delete/:article_id", (req, res) => {
    let sql = makeSql
                    .delete("articles")
                    .where(`article_id = ${req.params.article_id}`);

    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.end("deleted");
    })
})

app.post("/data/article/update/:article_id", upload.none(), (req, res) => {
    let sql = makeSql
                    .select(["*"])
                    .from("articles")
                    .where(`article_id = ${req.params.article_id} AND user_id = ${req.session.user.user_id}`);
    
    pool.query(sql, (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            let title = req.body.title;
            let text = req.body.text;
            console.log(title);
            let sql = makeSql
                        .update("articles")
                        .set({title: title, text: text})
                        .where(`article_id = ${req.params.article_id}`);


            pool.query(sql, (err) => { if(err) throw err; res.end("Updated") });
            
        }
    })
})

app.get("/data/article/:article_id", (req, res) => {
    let sql = makeSql
                .select(["*"])
                .from("articles")
                .where(`article_id = ${req.params.article_id} AND user_id = ${req.session.user.user_id}`);
    pool.query(sql, (err, result) => {
        if (err) throw err;
        
        res.end(JSON.stringify(result));
    })
})

app.get("/data/articles/:user_id", (req, res) => { 
    let sql = makeSql
                .select(["*"])
                .from("articles")
                .where(`user_id = ${req.params.user_id} ORDER BY article_id DESC`);

    pool.query(sql, (err, result) => {
        if (err) throw err;
        
        res.setHeader("Cache-Control", "public, max-age=60");
        res.end(JSON.stringify(result));
    });
})

app.get("/data/article/likes/:article_id", (req, res) => {
    let sql = makeSql
                .select(["*"])
                .from("likes")
                where(`article_id = ${article_id}`);
    
    pool.query(sql, (err, result) => {
        if (err) throw err;

        res.end(JSON.stringify(result));
    })
});

app.get("/data/article/set-like/:article_id", (req, res) => {
    let sql = `INSERT INTO likes(article_id, user_id)` + 
              `VALUES(${req.params.article_id}, ${req.session.user.user_id})`;

    pool.query(sql, (err, result) => {
        if (err) throw err;
    });
});