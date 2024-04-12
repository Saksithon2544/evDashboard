export type Station = {
    id?: string,
    stationId: string,
    name: string,
    location: [number, number]
    status: string,
    created_at: string,
    total_charging_rate: number;
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

export type Charging = {
    booth_id: string
    booth_name: string
    station_id: string
    status: string
    charging_rate: number
    created_at: string
    updated_at: string
}


export interface MergedData {
    id: string
    name: string
    location: number[]
    created_at: string
    adminInStation: User[]
}


