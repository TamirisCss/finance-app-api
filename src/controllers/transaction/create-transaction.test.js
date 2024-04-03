import { CreateTransactionController } from './create-transaction'
import { faker } from '@faker-js/faker'

describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return {
            sut,
            createTransactionUseCase,
        }
    }

    const baseHttpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 201 when transaction is created', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(baseHttpRequest)

        expect(result.statusCode).toBe(201)
    })

    //tests for missing fields
    it('should return 400 when user_id is missing', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                user_id: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when name is missing', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                name: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when date is missing', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is missing', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when amount is missing', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })
})
