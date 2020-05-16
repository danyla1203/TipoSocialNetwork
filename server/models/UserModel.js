class UserModel {
    constructor(connection, sqlMaker) {
        this.pool = connection;
        this.sqlMaker = sqlMaker;
    }
    getUsers(user_id, callback) {
        let users = this.sqlMaker
            .select(["user_id", "name", "avatar_url_icon"])
            .from("users")
            .where(`user_id <> ${user_id}`);
        this.pool.query(users, callback)
    }
    getUserData(user_id, callback) {
        let user = this.sqlMaker
            .select(["user_id", "name", "country", "gender", "avatar_url_full"])
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

    setUser(data, callback) {
        let user = this.sqlMaker
            .insert("users")
            .set(data);
        this.pool.query(user, callback)
    }

    getEmails(callback) {
        let emails = this.sqlMaker
            .select(["email", "name"])
            .from("users")
        this.pool.query(emails, callback)
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
        this.pool.query(sql, callback);
    }
}

module.exports.UserModel = UserModel;