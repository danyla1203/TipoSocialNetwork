import { Model, ModelType } from "./Model";
import { MysqlError } from "mysql";
import { Friend } from "../types/SqlTypes";

export class FriendsModel extends Model implements ModelType {
    /**
     * @param {number} user_id
     * @param {Function} callback
     * get all friends for user
     */
    getFriends(user_id: number, callback: Function) {
        let sql = this.sqlMaker
                .select(["id", "user_id", "avatar_url_icon", "name"])
                .from("friends")
                .join("users")
                .on("friends.user2_id = users.user_id")
                .where(`user1_id = ${user_id}`);
                
        this.pool.query(sql, callback);
    }
    
    /**
     * @param {number} user1_id
     * @param {number} user2_id
     * @param {Function} callback
     * add friend
     */
    addFriend(user1_id: number, user2_id: number, callback: Function) {
        let isFriend;
        this.getFriends(user1_id, (err: MysqlError, result: Friend[]) => {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                if (result[i].user2_id == user2_id) {
                    isFriend = true;
                    return; 
                }
            }
        });

        if (!isFriend) { 
            let sql = this.sqlMaker
                .insert("friends")
                .set({
                    user1_id: user1_id,
                    user2_id: user2_id    
                });
            
            this.pool.query(sql, callback);
        } else {
            callback(null, "User is your friend already");
        }
    }

    /**
     * @param {number} user1_id
     * @param {number} user2_id
     * @param {Function} callback
     * @memberof FriendsModel
     * delete friend
     */
    deleteFriend(user1_id: number, user2_id: number, callback: Function) {
        let sql = this.sqlMaker
            .delete("friends")
            .where(`user1_id = ${user1_id} AND user2_id = ${user2_id}`);
    
        this.pool.query(sql, callback);
    }
}

module.exports.FriendsModel = FriendsModel;