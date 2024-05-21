// import { TransactionNotFoundError } from '../../errors'
import { DeleteTransactionController } from './delete-transaction'
import { faker } from '@faker-js/faker'
import { transaction } from '../../tests'

describe('DeleteTransactionController', () => {
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

    it('should return 200 when delete transaction with success', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: { transactionId: 'invalid_id' },
        })

        expect(result.statusCode).toBe(400)
    })

    // it('should return 404 when transaction is not found', async () => {
    //     const { sut, deleteTransactionUseCase } = makeSut()

    //     import.meta.jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
    //         new TransactionNotFoundError()
    //     )

    //     const result = await sut.execute({
    //         params: { transactionId: faker.string.uuid() },
    //     })

    //     expect(result.statusCode).toBe(404)
    // })

    it('should return 500 when use case throws', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()

        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionUseCase,
            'execute',
        )

        const transactionId = faker.string.uuid()

        await sut.execute({
            params: {
                transactionId,
            },
        })

        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })
})
