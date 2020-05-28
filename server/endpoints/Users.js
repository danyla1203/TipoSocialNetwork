const app = require("../index").app;

const Endpoint = require("./Endpoint");

class Users extends Endpoint {
    run() {        
        app.get("/data/users", (req, res) => {
            let start = req.query.start;
            let end = req.query.end;

            this.model.getUsers(req.user.user_id, start, end, (usersList) => {
                res.json(usersList);
            });
        });

        app.get("/data/user/:user_id", (req, res) => {
            let id =  parseInt(req.params.user_id);
            if (id == req.user.user_id){
                res.end();
            } 
            this.model.getUserData(id, req.user.user_id, (result) => {
                res.setHeader("Cache-Control", "public, max-age=900");
                res.json(result);
            });
        });
    }
}

module.exports = Users;