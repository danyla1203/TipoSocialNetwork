export interface UserType {
    id: number;
    name: string,
    email: string,
    gender: string,
    country: string,
    avatar_url_icon: string,
    avatar_url_full: string
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