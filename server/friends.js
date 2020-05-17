const app = require("./index").app;
const friendsModel = require("./index").friendsModel;

app.get("/data/friends", (req, res) => {
    friendsModel.getFriends(req.session.user.user_id, (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify(result));
    })    
})

app.get("/data/is-friend/:user2_id", (req ,res) => {
    friendsModel.isFriend(req.session.user.user_id, req.params.user2_id, (err, result) => {
        if (err) throw err;
        
        if (result.length > 0) {
            res.end("true");
        } else {
            res.end("false");
        }
    })
});

app.get("/data/add/friends/:user_id", (req, res) => {
    friendsModel.addFriend(req.session.user.user_id, req.params.user_id, (err, result) => {
        if (err) throw err;
        res.end("added");
    })
});

app.get("/data/delete/friends/:user_id", (req, res) => {
    friendsModel.deleteFriend(req.session.user.user_id, req.params.user_id, (err, result) => {
        if (err) throw err;
        res.end("deleted");
    });
})