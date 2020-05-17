const Model = require("./Model");

class FriendsModel extends Model {
    getFriends(user_id, callback) {
        let sql = this.sqlMaker
                .select(["id", "user_id", "avatar_url_icon", "name"])
                .from("friends")
                .join("users")
                .on("friends.user2_id = users.user_id")
                .where(`user1_id = ${user_id}`);
                
        this.pool.query(sql, callback);
    }

    isFriend(user1_id, user2_id, callback) {
        let sql = this.sqlMaker
                .select()
                .from("friends")
                .where(`user1_id = ${user1_id} AND user2_id = ${user2_id}`);

        this.pool.query(sql, callback);
    }
    
    addFriend(user1_id, user2_id, callback) {
        let isFriend;
        this.getFriends(user1_id, (err, result) => {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                if (parseInt(result[i].user2_id) == parseInt(user2_id)) {
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
                })
            
            this.pool.query(sql, callback);
        } else {
            callback(null, "User is your friend already");
        }
    }

    deleteFriend(user1_id, user2_id, callback) {
        let sql = this.sqlMaker
            .delete("friends")
            .where(`user1_id = ${user1_id} AND user2_id = ${user2_id}`);
    
        this.pool.query(sql, callback);
    }
}

module.exports.FriendsModel = FriendsModel;