import { TransactionNotFoundError } from '../../errors'
import { transaction } from '../../tests'
import { DeleteTransactionController } from './delete-transaction'
import { faker } from '@faker-js/faker'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { sut, deleteTransactionUseCase }
    }
    it('should return 200 when deleting a transaction successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
                user_id: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: {
                transactionId: 'invalid_id',
                user_id: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when transaction is not found', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
                user_id: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
                user_id: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(500)
    })
    it('should call DeleteTransactionUseCase with correct params', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionUseCase,
            'execute',
        )

        const transactionId = faker.string.uuid()
        const userId = faker.string.uuid()

        await sut.execute({
            params: {
                transactionId,
                user_id: userId,
            },
        })

        expect(executeSpy).toHaveBeenCalledWith(transactionId, userId)
    })
})
