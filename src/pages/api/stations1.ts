import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string
}

export type Station = {
    stationId: string,
    name: string,
    location: {
        lat: number,
        lng: number
    },
    status: string,
    created: string,
    adminStationId: string,
    isDeleted?: boolean
}


let stations: Station[] = [
    {
        stationId: '60bb0414-ce25-528d-98d6-b01857edae7b',
        name: 'Station 1',
        location: {
            lat: 13.7563,
            lng: 100.5018
        },
        status: 'online',
        created: '2021-09-01T00:00:00.000Z',
        adminStationId: '1',
        isDeleted: false
    },
    {
        stationId: 'e3479296-96a5-5c77-892a-61b01d095e17',
        name: 'Station 2',
        location: {
            lat: 13.7563,
            lng: 100.5018
        },
        status: 'online',
        created: '2021-09-01T00:00:00.000Z',
        adminStationId: '1',
        isDeleted: false
    },
    {
        stationId: '32c8cb91-d589-5d94-962e-41f56185ddd5',
        name: 'Station 3',
        location: {
            lat: 13.7563,
            lng: 100.5018
        },
        status: 'offline',
        created: '2021-09-01T00:00:00.000Z',
        adminStationId: '1',
        isDeleted: false
    }
];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Station[]>
) {
    //delay 1000ms
    setTimeout(() => {
        res.status(200).json(stations)
    }, 500)
}