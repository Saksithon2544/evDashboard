export type User = {
    id?: string,
    userId?: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword:string,
    email: string,
    phone: string,
    role: string,
    is_deleted?: boolean
    is_active?: boolean
    created: string,
    updated: string,
    totp_secret?: string
    top_counter?: number
    balance?: number
}