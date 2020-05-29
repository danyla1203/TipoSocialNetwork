import { MysqlError, OkPacket } from "mysql";
import { Users, User, CheckUserForExist, ChangeUserData } from "../types/SqlTypes";

const Model = require("./Model");

export class UserModel extends Model {
    getUsers(user_id: number, start: number, end: number, callback: Function) {
        let users = this.sqlMaker
            .select(["user_id", "name", "avatar_url_icon", "user1_id"])
            .from("users")
            .leftJoin("friends")
            .on(`users.user_id = friends.user2_id and friends.user1_id = ${user_id}`)
            .where(`user_id <> ${user_id}`);
        users = `${users} LIMIT ${start}, ${end}`;
        this.pool.query(users, (err: MysqlError, result: Users[]) => {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                if (result[i].user1_id) {
                    result[i].isFriend = true;
                } else {
                    result[i].isFriend = false;
                }
            }
            callback(result);
        });
    }

    getUserData(user_id: number, id: number, callback: Function) {
        let user = this.sqlMaker
            .select(["user_id", "name", "country", "gender", "avatar_url_full", "avatar_url_icon", "user1_id"])
            .from("users")
            .leftJoin("friends")
            .on("users.user_id = friends.user2_id")
            .where(`users.user_id = ${user_id}`);
        this.pool.query(user, (err: MysqlError, result: User[]) => {
            if (err) throw err;
            if (result[0].user1_id) {
                result[0].isFriend = true;
            } else {
                result[0].isFriend = false;
            }
            delete result[0].user1_id;
            callback(result[0]);
        });
    }

    getSecretUserData(user_id: number, callback: Function) {
        let user = this.sqlMaker
            .select()
            .from("users")
            .where(`user_id = ${user_id}`);
        this.pool.query(user, callback);
    }

    getFriendsList(user_id: number, callback: Function) {
        let frinendsList = this.sqlMaker
            .select(["id", "user_id", "avatar_url_icon", "name"])
            .from("friends")
            .join("users")
            .on("friends.user2_id = users.user_id")
            .where(`user1_id = ${user_id}`);
        this.pool.query(frinendsList, callback);
    }

    setUser(data: ChangeUserData) {
        return new Promise((resolve) => {
            let user = this.sqlMaker
                .insert("users")
                .set(data);
            return this.pool.query(user, (err: MysqlError, result: OkPacket[]) => {
                if (err) throw err;
                resolve(result);
            });
        });
    }

    getEmails(callback: Function) {
        let emails = this.sqlMaker
            .select(["email", "name"])
            .from("users");
        this.pool.query(emails, callback);
    }

    checkUserForExist(name: string, email: string) {
        let data = this.sqlMaker
                .select(["user_id", "email", "name"])
                .from("users");

        return new Promise((resolve, reject) => {
            this.pool.query(data, (err: MysqlError, result: CheckUserForExist[]) => {
                if (err) throw err;
                for (let i = 0; i < result.length; i++) {
                    if (result[i].name == name || result[i].email == email) {
                        reject("exist");
                    }
                } 
                resolve(result[result.length -1].user_id);
            });
        });
    }

    updateUserData(newData: Object, user_id: number, callback: Function) {
        let newUser = this.sqlMaker
            .update("users")
            .set(newData)
            .where(`user_id = ${user_id}`);
        this.pool.query(newUser, callback);
    }

    checkUser(name: string, pass: string) {
        let sql = this.sqlMaker
            .select()
            .from("users")
            .where(`name = "${name}" AND password = "${pass}"`);
        return new Promise<User>((resolve, reject) => {
            this.pool.query(sql, (err: MysqlError, result: User[]) => {
                if (err) throw err;
                if (result.length == 1) {
                    delete result[0].password;
                    resolve(result[0]);
                } else {
                    reject();
                }
            });
        });
    }
}

module.exports.UserModel = UserModel;