export interface UserType {
    id: number;
    name: string,
    email: string,
    gendert: string
    avatar_url_icon: string,
    avatar_full_icon: string
}

export class User {
    private user: UserType;
    constructor(user: UserType) {
        this.user = user;
    }

    getFull() {
        return this.user;
    }
    getShort() {
        return {
            user_id: this.user.id,
            name: this.user.name,
            icon: this.user.avatar_url_icon
        }
    }
    getField(fieldName: string) {
        if (fieldName in this.user) {
            return this.user[fieldName];
        } else {
            return false;
        }
    }

    changeData() {

    }
}