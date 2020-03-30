const app = require("./server").app;
const upload = require("./server").upload;
const pool = require("./server").pool;
const makeSql = require("./server").makeSql;

app.get("/data/friends", (req, res) => {
    let sql = makeSql
                .select(["id", "user_id", "avatar_url_icon", "name"])
                .from("friends")
                .join("users")
                .on("friends.user2_id = users.user_id")
                .where(`user1_id = ${req.session.user.user_id}`);
                
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });
})

app.get("/data/is-friend/:user2_id", (req ,res) => {
    let sql = makeSql
                .select()
                .from("friends")
                .where(`user1_id = ${req.session.user.user_id} AND user2_id = ${req.params.user2_id}`);


    pool.query(sql, (err, result) => {
        if (err) throw err;
    
        if (result.length > 0) {
            res.end("true");
        } else {
            res.end("false");
        }
    })
});

app.get("/data/add/friends/:user_id", (req, res) => {
    let sql = makeSql
                .select()
                .from("friends")
                .where(`user1_id = ${req.session.user.user_id}`);

    pool.query(sql, (err, result) => {
        if (err) throw err;
    
        for (let i = 0; i < result.length; i++) {
            if (parseInt(result[i].user2_id) == parseInt(req.params.user_id)) {
                res.end("User already your friend");
                return; 
            }
        }

        let sql = makeSql
                    .insert("friends")
                    .set({
                        user1_id: req.session.user.user_id,
                        user2_id: req.params.user_id    
                    })
        pool.query(sql, (err) => {
            if (err) throw err;
            res.end("Friend added");
        });
    })
});

app.get("/data/delete/friends/:user_id", (req, res) => {
    let sql = makeSql
                .delete("friends")
                .where(`user1_id = ${req.session.user.user_id} AND user2_id = ${req.params.user_id}`);
    
    pool.query(sql, (err) => {
        if (err) throw err;
        res.end();
    })
})