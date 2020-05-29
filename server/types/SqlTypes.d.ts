export interface Article {
    article_id: number,
    user_id: number,
    title: string,
    text: string,
    path: string,
    date: string,
    photos_list: string
}

export interface Friend {
    id: number,
    user1_id: number,
    user2_id: number
}

export interface Users {
    user_id: number,
    name: string,
    avatar_url_icon: string,
    user1_id: number
    isFriend?: boolean
}

export interface User {
    user_id: number,
    name: string,
    gender: string,
    country: string,
    avatar_url_full: string,
    avatar_url_icon: string,
    user1_id: number,
    isFriend?: boolean,
    password?: string
}

export interface CheckUserForExist {
    user_id: number,
    email: string,
    name: string,
}
export interface ChangeUserData {
    name?: string,
    gender?: string,
    country?: string,
    avatar_url_full?: string,
    avatar_url_icon?: string,
}

export interface Comments {
    comment_id: number,
    autor_id: number,
    text: string,
    date: string,
    article_id: number,
    name: string,
    avatar_url_icon: string
}