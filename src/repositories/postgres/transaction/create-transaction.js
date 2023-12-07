import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresCreateTransactionRepository {
    async execute(createTransactiobsParams) {
        const createdTransaction = await PostgresHelper.query(
            `
            INSERT INTO transactions (id, user_id, name, date, amount, type) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `,
            [
                createTransactiobsParams.id,
                createTransactiobsParams.userId,
                createTransactiobsParams.name,
                createTransactiobsParams.date,
                createTransactiobsParams.amount,
                createTransactiobsParams.type,
            ],
        )
        return createdTransaction[0]
    }
}
