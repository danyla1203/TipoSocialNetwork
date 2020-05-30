import { Model } from "./Model";
import { MysqlError, OkPacket } from "mysql";
import { Message } from "../types/SqlTypes";

export class MessagesModel extends Model {

    /**
     * @param {number} user_id
     * @param {Function} callback
     * get messages
     */
    getMessages(user_id: number, callback: Function) {
        let messages = this.sqlMaker
            .select([
                "message_id", 
                "recipient_id", 
                "sender_id", 
                "text", 
                "time", 
                "user_id", 
                "name", 
                "avatar_url_icon"
            ])
            .from("messages") 
            .join("users")
            .on("messages.sender_id = users.user_id OR messages.recipient_id = users.user_id")
            .where(`(recipient_id = ${user_id} OR sender_id = ${user_id}) AND users.user_id <> ${user_id} ORDER BY message_id ASC`);
        this.pool.query(messages, (err: MysqlError, result: Message[]) => {
            if (err) throw err;
            callback(result);
        })
    }

    /**
     * @param {number} recipient_id
     * @param {number} sender_id
     * @param {string} text
     * @param {string} date
     * @param {Function} callback
     * send message
     */
    addMessage(
        recipient_id: number, 
        sender_id: number,
        text: string,
        date: string,
        callback: Function
    ) 
    {
        let sql = this.sqlMaker
            .insert("messages")
            .set({
                sender_id: sender_id,
                recipient_id: recipient_id,
                text: text,
                time: date
            })
        this.pool.query(sql, (err: MysqlError, result: OkPacket[]) => {
            if (err) throw err;
            callback("We did it!");
        })
    }

}