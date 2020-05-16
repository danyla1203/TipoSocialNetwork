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
}

module.exports.UserModel = UserModel;