export type Station= {
    id?: string,
    stationId: string,
    name: string,
    location: string
    status: string,
    created_at: string,

};

export type Admin = {
    id?: string,
    userId: string,
    stationId: string,
    created_at: string,
};

export type User = {
    id?: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword:string,
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