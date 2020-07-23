import {MessagesGroup} from "./MessagesRouter";

export class MessagesStorage {
    private messageGroups: MessagesGroup[];

    constructor(messages: MessagesGroup[] = []) {
        this.messageGroups = messages;
    }

    getMessageGroup(user_id: number): MessagesGroup {
        for (let i = 0; i < this.messageGroups.length; i++) {
            if (this.messageGroups[i].user.id = user_id) {
                return this.messageGroups[i];
            }
        }
    }

    getAll() {
        return this.messageGroups;
    }

    setGroups(messages: MessagesGroup[]) {
        this.messageGroups = messages;
        return this;
    }
}