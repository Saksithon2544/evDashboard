import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string
}

export type Transactions = {
    transactionId: string,
    userId: string,
    amount: number,
    transactionType: string,
    description: string,
    created: string,
}

let transactions: Transactions[] = [
    {
        transactionId: '60bb0414-ce25-528d-98d6-b01857edae7b',
        userId: '1',
        amount: 1000,
        transactionType: 'deposit',
        description: 'Deposit 1000',
        created: '2021-09-01T00:00:00.000Z',
    },
    {
        transactionId: 'e3479296-96a5-5c77-892a-61b01d095e17',
        userId: '1',
        amount: 500,
        transactionType: 'withdraw',
        description: 'Withdraw 500',
        created: '2021-09-01T00:00:00.000Z',
    },
    {
        transactionId: '32c8cb91-d589-5d94-962e-41f56185ddd5',
        userId: '1',
        amount: 1000,
        transactionType: 'deposit',
        description: 'Deposit 1000',
        created: '2021-09-01T00:00:00.000Z',
    }
];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | Transactions[]>
) {
    if (req.method === 'GET') {
        res.status(200).json(transactions)
    } else {
        res.status(200).json({ message: 'This is a transaction' })
    }
}

