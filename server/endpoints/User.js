const jwt = require("jsonwebtoken");
const app = require("../index").app;
const upload = require("../index").upload;
const jwtKey = require("../index").jwtKey;

const Endpoint = require("./Endpoint");
const isLogin = require("../middlewares/isLogin");
const UserSignin = require("../lib/UserSignin");
const UserUpdate = require("../lib/UserSignin");

class User extends Endpoint {
    constructor(model) {
        super(model);
        this.signin = new UserSignin(model);
        this.updateUser = new UserUpdate(model);
        this.updateUser.run = this.updateUser.run.bind(this.updateUser);
        this.signin.run = this.signin.run.bind(this.signin);
    }

    setNewUserData(body, userData) {
        let userDataCopy = Object.assign({}, userData);
        for (let column in body) {
            if (typeof body[column] == "string" && body[column].length < 1) {
                continue;
            }
            userDataCopy[column] = body[column]
        }
        return userDataCopy;
    }

    extendBody(body) {
        let img_names = {};
        if (body.name.length > 1) {
            img_names = {
                avatar_url_full: `${body.name}_full.webp`,
                avatar_url_icon: `${body.name}_icon.webp`
            }
        }
        
        let values = Object.assign({}, body, img_names);
        let data = this.setNewUserData(values, {});
        return data;
    }

    updateUser(body, user_id) {
        return new Promise((resolve, reject) => {
            console.log(body);
            let dataToInsert = this.extendBody(body);
            console.log(dataToInsert);
            this.model.updateUserData(dataToInsert, user_id, (err, result) => {
                if (err) throw err;
                let token = jwt.sign({
                    id: result.insertId,
                    email: body.email
                }, jwtKey, { expiresIn: "30m" });
                resolve(token);
            });
        })
    }

    checkUnique(name, email) {
        return new Promise((resolve, reject) => {
            this.model.getEmails((err, result) => {
                if (err) throw err;
                
                for (let i = 0; i < result.length; i++) {
                    if (result[i].name == name || result[i].email == email) {
                        reject(false);
                    }
                }
                resolve(true);
            })
        })
    }

    setUser(body) {
        return new Promise((resolve) => {
            let data = this.extendBody(body);
            this.model.setUser(data, (err, result) => {
                if (err) throw err; 
                let token = jwt.sign({
                    id: result.insertId,
                    email: body.email 
                }, jwtKey, { expiresIn: "30m" })
                
                resolve(token);
            }); 
        })
    }

    async checkUser(body) {
        let check = await this.checkUnique(body.name, body.email);
        if (check) {
            let token = await this.setUser(body);
            return token;
        } else {
            return Promise.reject();
        }
    } 

    checkUserByBody(name, pass, res) {
        this.model.checkUser(name, pass, (err, result) => {
            if (err) throw err;
    
            if (result[0]) {
                let token = jwt.sign({
                    id: result[0].user_id,
                    email: result[0].email
                }, jwtKey, { expiresIn: "30m" });
    
                delete result[0].password;
                res.set("Authentication", token);
                console.log(result, 'return data');
                res.end(JSON.stringify(result[0]));
    
            } else {
                res.status(404);
                res.end("{}");
            }
        })  
    }

    run() {
        app.post("/user/signin", upload.single("avatar"), this.signin.run);
        app.put("/data/user/:user_id", upload.single("avatar"), this.updateUser.run);

        app.put("/data/user/:user_id", upload.single("avatar"), (req, res) => {
            if (req.params.user_id != req.user.user_id) {
                res.sendStatus(403);
                res.end("Go to hell, хацкер");
            }
            if (req.file) {
                this.avatar.makeAvatar(req.file.path, req.body.name, req.user.name);
            } else if (!req.file && req.body.name.length > 1) {                
                this.avatar.renameAvatars(req.user.name, req.body.name, req.file.path || nullrs);
            }
            //update user data and return to cliend new token
            let token = this.updateUser(req.body, req.user.user_id);
            token.then(
                (token) => {
                    res.setHeader("Authentication", token);
                    res.end();
                }
            )
        })

        app.all("/user/check", isLogin, upload.none(), (req, res) => {          
            if (req.user) {
                this.model.getSecretUserData(req.userData.id, (err, result) => {
                    if (err) throw err;
                    res.end(result);
                })
            }
            if ( !(req.body.name && req.body.password) ) {  
                res.status(400);
                res.end("{}");
            }
            this.checkUserByBody(req.body.name, req.body.password, res);
        })
    }
}

module.exports = User;