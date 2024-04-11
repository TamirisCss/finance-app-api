import { UpdateTransactionController } from './update-transaction'
import { faker } from '@faker-js/faker'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { sut, updateTransactionUseCase }
    }

    const baseHttpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 200 when updating a transaction with success', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(baseHttpRequest)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when invalid field are provided', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                invalid_field: 'some_value',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when id is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: { transactionId: 'invalid_id' },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(response.statusCode).toBe(400)
    })
})
