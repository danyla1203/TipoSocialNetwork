const Model = require("./Model");

class UserModel extends Model {
    getUsers(user_id, callback) {
        let users = this.sqlMaker
            .select(["user_id", "name", "avatar_url_icon"])
            .from("users")
            .where(`user_id <> ${user_id}`);
        this.pool.query(users, callback)
    }

    getSecretUserData(user_id, callback) {
        let user = this.sqlMaker
            .select()
            .from("users")
            .where(`user_id = ${user_id}`);
        this.pool.query(user, callback);
    }

    getUserData(user_id, callback) {
        let user = this.sqlMaker
            .select(["user_id", "name", "country", "gender", "avatar_url_full"])
            .from("users")
            .where(`user_id = ${user_id}`);
        this.pool.query(user, callback);
    }

    getSecretUserData(user_id, callback) {
        let user = this.sqlMaker
            .select()
            .from("users")
            .where(`user_id = ${user_id}`);
        this.pool.query(user, callback);
    }

    getFriendsList(user_id, callback) {
        let frinendsList = this.sqlMaker
            .select(["id", "user_id", "avatar_url_icon", "name"])
            .from("friends")
            .join("users")
            .on("friends.user2_id = users.user_id")
            .where(`user1_id = ${user_id}`);
        this.pool.query(frinendsList, callback);
    }

    setUser(data) {
        return new Promise((resolve) => {
            let user = this.sqlMaker
                .insert("users")
                .set(data);
            return this.pool.query(user, (err, result) => {
                if (err) throw err;
                resolve(result);
            });
        })
    }

    getEmails(callback) {
        let emails = this.sqlMaker
            .select(["email", "name"])
            .from("users")
        this.pool.query(emails, callback)
    }

    checkUserForExist(name, email) {
        let data = this.sqlMaker
                .select(["user_id", "email", "name"])
                .from("users")

        return new Promise((resolve, reject) => {
            this.pool.query(data, (err, result) => {
                if (err) throw err;
                for (let i = 0; i < result.length; i++) {
                    if (result[i].name == name || result[i].email == email) {
                        reject("exist");
                    }
                } 
                resolve(result[result.length -1].user_id);
            })
        })
    }


    updateUserData(newData, user_id, callback) {
        let newUser = this.sqlMaker
            .update("users")
            .set(newData)
            .where(`user_id = ${user_id}`);
        this.pool.query(newUser, callback);
    }

    checkUser(name, pass, callback) {
        let sql = this.sqlMaker
            .select()
            .from("users")
            .where(`name = "${name}" AND password = "${pass}"`);
        return new Promise((resolve, reject) => {
            this.pool.query(sql, (err, result) => {
                if (err) throw err;
                if (result.length == 1) {
                    delete result[0].password;
                    resolve(result[0]);
                } else {
                    reject();
                }
            });
        })
    }
}

module.exports.UserModel = UserModel;