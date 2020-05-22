const app = require("../index").app;

const Endpoint = require("./Endpoint");

class Users extends Endpoint {
    run() {
        app.get("/data/users", (req, res) => { 
            this.model.getUsers(req.user.user_id, (err, usersList) => {
                if (err) throw err;
        
                this.model.getFriendsList(req.user.user_id, (err, friendsList) => {
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
            if (id == req.user.user_id){
                res.end();
            } 
            this.model.getUserData(id, (err, result) => {
                if (err) throw err;
                res.setHeader("Cache-Control", "public, max-age=900");
                res.end(JSON.stringify(result));
            })
        })
    }
}

module.exports = Users;