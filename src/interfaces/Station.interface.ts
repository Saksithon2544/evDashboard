export type Station = {
    id?: string,
    name: string,
    location: [number, number],
    created_at: string,

};

export type Charging = {
    booth_id: string
    booth_name: string
    station_id: string
    status: string
    charging_rate: number
    created_at: string
    updated_at: string
}