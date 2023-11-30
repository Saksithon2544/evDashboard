import { NextApiRequest, NextApiResponse } from 'next';

export type User = {
    userId?: string,
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
    },
    {
        userId: "d2f1a8e7-afb3-42e9-b3b7-394c5d6f4a22",
        firstName: "วิชัย",
        lastName: "รักษา",
        password: "1234",
        email: "wichai.raksa@example.com",
        phone: "0876543210",
        role: "user",
        is_deleted: false,
        is_active: true,
        created: "2022-03-15T00:00:00.000Z",
        updated: "2022-03-15T00:00:00.000Z",
        totp_secret: "",
        top_counter: 0,
        balance: 0
    },
    {
        userId: "e4d7b6c9-8a1f-53d2-c4e5-678901abcde1",
        firstName: "ณัฐพงศ์",
        lastName: "สุขใจ",
        password: "P@ssw0rd",
        email: "nattapong.sukjai@example.com",
        phone: "0954321098",
        role: "user",
        is_deleted: false,
        is_active: true,
        created: "2022-05-10T00:00:00.000Z",
        updated: "2022-05-10T00:00:00.000Z",
        totp_secret: "",
        top_counter: 0,
        balance: 0
    },
    {
        userId: "f5e8d3c7-b2a9-48c1-90d6-123456abcdef",
        firstName: "ประเสริฐ",
        lastName: "สุขสวัสดิ์",
        password: "securePass",
        email: "prasert.suksawat@example.com",
        phone: "0812345678",
        role: "user",
        is_deleted: false,
        is_active: true,
        created: "2022-07-20T00:00:00.000Z",
        updated: "2022-07-20T00:00:00.000Z",
        totp_secret: "",
        top_counter: 0,
        balance: 0
    },
    {
        userId: "g6h9j2k3-l4m5-n6o7-p8q9-r0s1t2u3v4w5",
        firstName: "ศุภชัย",
        lastName: "รัตนเดช",
        password: "sUp3rP@ss",
        email: "supachai.rattanadech@example.com",
        phone: "0998877665",
        role: "user",
        is_deleted: false,
        is_active: true,
        created: "2022-09-05T00:00:00.000Z",
        updated: "2022-09-05T00:00:00.000Z",
        totp_secret: "",
        top_counter: 0,
        balance: 0
    },
    {
        userId: "h2i3j4k5-l6m7-n8o9-p0q1-r2s3t4u5v6w7",
        firstName: "สุชาดา",
        lastName: "สุขสาธุ์",
        password: "pass123!",
        email: "suchada.sukasat@example.com",
        phone: "0887654321",
        role: "user",
        is_deleted: false,
        is_active: true,
        created: "2022-11-12T00:00:00.000Z",
        updated: "2022-11-12T00:00:00.000Z",
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
                userId: makeid(36),
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
            res.status(200).json(users)
        default:
            break
    }
}

//make function random guid simulate
function makeid(length: number) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    var i;
    for (i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
