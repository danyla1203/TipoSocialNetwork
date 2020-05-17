const app = require("./index").app;
const upload = require("./index").upload;
const pool = require("./index").pool;
const makeSql = require("./index").makeSql;

app.get("/data/messages/list", (req, res) => {
    let user = req.user.user_id;
    let sql = makeSql
                .select(["message_id", "recipient_id", "sender_id", "text", "time", "user_id", "name", "avatar_url_icon"])
                .from("messages") 
                .join("users")
                .on("messages.sender_id = users.user_id OR messages.recipient_id = users.user_id")
                .where(`(recipient_id = ${user} OR sender_id = ${user}) AND users.user_id <> ${user} ORDER BY message_id ASC`);
    
    pool.query(sql, (err, result) => {
        if (err) throw err
        res.end(JSON.stringify(result));
    })
})

app.post("/data/messages/add/:user_id/:user_name", upload.none(), (req, res) => {
    let sender_id = req.user.user_id;
    let recipient_id = req.params.user_id;

    let text = req.body.text;
    let date = "2009-05-12 10:10:23";
    let sql = makeSql
                .insert("messages")
                .set({
                    sender_id: sender_id,
                    recipient_id: parseInt(recipient_id),
                    text: text,
                    time: date
                })

    pool.query(sql, (err) => {
        if (err) throw err;
        res.end("Send");
    })
})