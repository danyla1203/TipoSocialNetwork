export interface UserType {
    [index: string]: string | number,
    id: number,
    name: string,
    email: string,
    gender: string,
    country: string,
    icon: string,
    bigIcon: string
}

export interface ShortUserType {
    id: number,
    name: string,
    icon: string
}
export interface ChangeUser {
    [index: string]: string,
    name?: string
    email?: string,
    gender?: string,
    country?: string,
}

export class User {
    private user: UserType;
    constructor(user: UserType) {
        this.user = user;
    }

    getFull(): UserType {
        return this.user;
    }
    getShort(): ShortUserType  {
        return {
            id: this.user.id,
            name: this.user.name,
            icon: this.user.icon
        }
    }
    getField(fieldName: string) {
        if (fieldName in this.user) {
            return this.user[fieldName];
        } else {
            return false;
        }
    }

    changeData(newData: ChangeUser): User {
        for (let field in newData) {
            if (newData[field].length > 3)  {
                this.user[field] = newData[field];
            }
        }
        return this;
    }
}