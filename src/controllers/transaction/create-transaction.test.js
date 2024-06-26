import { CreateTransactionController } from './create-transaction'
import { transaction } from '../../tests'

describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute() {
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
            ...transaction,
            id: undefined,
        },
    }

    it('should return 201 when transaction is created(expense)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(baseHttpRequest)

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when transaction is created(earning)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'EARNING',
            },
        })

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when transaction is created(investment)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'INVESTMENT',
            },
        })

        expect(result.statusCode).toBe(201)
    })

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

    //tests for invalid values date. type and amount
    it('should return 400 when date is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: 'invalid-date',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is is not EXPENSE, EARNING or INVESTMENT', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid-amount',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 when CreateTransactionUseCase throws an error', async () => {
        const { sut, createTransactionUseCase } = makeSut()

        import.meta.jest
            .spyOn(createTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = await sut.execute(baseHttpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call CreateTransactionUseCase with correct params', async () => {
        const { sut, createTransactionUseCase } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            createTransactionUseCase,
            'execute',
        )

        await sut.execute(baseHttpRequest)

        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body)
    })
})
