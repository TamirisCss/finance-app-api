import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction'
import { transaction } from '../../tests'

describe('DeleteTransactionUseCase', () => {
    const user_id = faker.string.uuid()

    class DeleteTransactionRepositoryStub {
        async execute() {
            return { ...transaction, user_id }
        }
    }
    class GetTransactionByIdRepositoryStub {
        async execute() {
            return { ...transaction, user_id }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            deleteTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()
        const id = faker.string.uuid()

        const result = await sut.execute(id, user_id)

        expect(result).toEqual({ ...transaction, user_id })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )
        const id = faker.string.uuid()

        await sut.execute(id, user_id)

        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(id)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        const promise = sut.execute(id, user_id)

        await expect(promise).rejects.toThrow()
    })
})
