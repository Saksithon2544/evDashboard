export type Transaction = {
    id? : string;
    userId: string;
    amount: number;
    transactionType: string;
    description: string;
}