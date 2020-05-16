const app = require("./index").app;
const userModel = require("./index").userModel;

app.get("/data/users", (req, res) => { 
    userModel.getUsers(req.session.user.user_id, (err, usersList) => {
        if (err) throw err;

        userModel.getFriendsList(req.session.user.user_id, (err, friendsList) => {
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
        })
    })
})

app.get("/data/user/:user_id", (req, res) => {
    let id =  parseInt(req.params.user_id);
    if (id == req.session.user.user_id){
        res.end();
    } 
    userModel.getUserData(id, (err, result) => {
        if (err) throw err;
        res.setHeader("Cache-Control", "public, max-age=900");
        res.end(JSON.stringify(result));
    })
})