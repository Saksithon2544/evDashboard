export type Station = {
    id?: string,
    stationId: string,
    name: string,
    location: string
    status: string,
    created_at: string,

};

export type Admin = {
    created_at?: string
    id?: string
    user_id?: string
    stationId?: string
};

export type User = {
    id?: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string,
    email: string,
    phoneNumber: string,
    role: string,
    is_deleted?: boolean
    is_active?: boolean
    created: string,
    updated: string,
    totp_secret?: string
    top_counter?: number
    balance?: number
}


export interface MergedData {
    id: string
    name: string
    location: number[]
    created_at: string
    adminInStation: User[]
}


