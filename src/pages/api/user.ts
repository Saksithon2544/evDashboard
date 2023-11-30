import { NextApiRequest, NextApiResponse } from 'next';

export type User = {
    userId: string,
    firstName: string,
    lastName: string,
    password: string,
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

let users: User[] = [
    {
        userId: '73f1b6c4-23f7-5a5b-a0c9-8a234ae63eef',
        firstName: 'John',
        lastName: 'Doe',
        password: '1234',
        email: 'user01@gmail.com',
        phone: '1234567890',
        role: 'admin',
        is_deleted: false,
        is_active: true,
        created: '2021-09-01T00:00:00.000Z',
        updated: '2021-09-01T00:00:00.000Z',
        totp_secret: '',
        top_counter: 0,
        balance: 0
    },
    {
        userId: "43a41aca-ca7e-5636-834d-d0b0ca9cfd63",
        firstName: "สุรสิทธิ์",
        lastName: "ชุติบุตร",
        password: "5678",
        email: "surasit.chutibutr@example.com",
        phone: "0876543210",
        role: "user",
        is_deleted: false,
        is_active: true,
        created: "2021-10-15T00:00:00.000Z",
        updated: "2021-10-15T00:00:00.000Z",
        totp_secret: "",
        top_counter: 0,
        balance: 0
    },
    {
        userId: "c5cef9cb-c4b6-5312-8198-4910801d0bb5",
        firstName: "สมศรี",
        lastName: "ทองดี",
        password: "abcd",
        email: "somsri.thongdee@example.com",
        phone: "0987654321",
        role: "user",
        is_deleted: false,
        is_active: true,
        created: "2021-11-20T00:00:00.000Z",
        updated: "2021-11-20T00:00:00.000Z",
        totp_secret: "",
        top_counter: 0,
        balance: 0
    }
]

interface ResponseData extends NextApiRequest {
    method: string
    body: User
}

export default function handler(
    req: ResponseData,
    res: NextApiResponse<User[]>
) {
    switch (req.method) {
        case 'POST':
            const newUser: User = {
                userId: req.body.userId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                is_deleted: req.body.is_deleted,
                is_active: req.body.is_active,
                created: req.body.created,
                updated: req.body.updated,
                totp_secret: req.body.totp_secret,
                top_counter: req.body.top_counter,
                balance: req.body.balance
            }
            users.push(newUser)
            res.status(201).json(users)
            break
        case 'GET':
            //delay 1000ms
            setTimeout(() => {
                res.status(200).json(users)
            }, 500)
        default:
            break
    }
}