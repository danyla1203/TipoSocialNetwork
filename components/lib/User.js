class User {
    #user;
    constructor(user) {
        this.user = user;
    }

    getFull() {
        return this.user;
    }
    getShort() {
        return {
            user_id: this.#user.user_id,
            name: this.user.name,
            icon: this.user.avatar_url_icon
        }
    }
    changeData(newData) {

    }
}

export default User;