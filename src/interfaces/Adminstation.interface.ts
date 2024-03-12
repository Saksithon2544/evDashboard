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
    name: string,
    email: string,
    role: string,
    created_at: string,
};

export type User = {
    id?: string,
    userId?: string,
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