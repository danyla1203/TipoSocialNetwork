declare namespace Express {
    interface UserData {
        user_id: number,

    }
    export interface Request {
       user: UserData
    }
}