export type User = {
    id?: string,
    userId?: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword:string,
    confirm_password: string,
    email: string,
    phoneNumber: string,
    role: string,
    is_deleted?: boolean
    is_active?: boolean
    created_at: string,
    updated: string,
    totp_secret?: string
    top_counter?: number
    balance?: number
    avatar_img_b64?: string
}