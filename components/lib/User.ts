export interface User {
    id: number;
    name: string,
    email: string,
    gendert: string
    avatar_url_icon: string,
    avatar_full_icon: string
}

export class User {
    private user: User;
    constructor(user: User) {
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
    changeData() {

    }
}