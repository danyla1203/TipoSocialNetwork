const app = require("../indexx").app;
const Endpoint = require("./Enpoint");

class Friends extends Endpoint {
    run() {
        app.get("/data/friends", (req, res) => {
            this.model.getFriends(req.user.user_id, (err, result) => {
                if (err) throw err;
                res.end(JSON.stringify(result));
            })    
        })
        
        app.get("/data/is-friend/:user2_id", (req ,res) => {
            this.model.isFriend(req.user.user_id, req.params.user2_id, (err, result) => {
                if (err) throw err;
                
                if (result.length > 0) {
                    res.end("true");
                } else {
                    res.end("false");
                }
            })
        });
        
        app.post("/data/friends/:user_id", (req, res) => {
            this.model.addFriend(req.user.user_id, req.params.user_id, (err, result) => {
                if (err) throw err;
                res.end("added");
            })
        });
        
        app.delete("/data/friends/:user_id", (req, res) => {
            this.model.deleteFriend(req.user.user_id, req.params.user_id, (err, result) => {
                if (err) throw err;
                res.end("deleted");
            });
        })
    }
}
module.exports = Friends;