import { UserNotFoundError } from '../../errors/user'
import { CreateTransactionUseCase } from './create-transaction'
import { transaction, user } from '../../tests'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        ...transaction,
        id: undefined,
    }

    class CreateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random_id'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            idGeneratorAdapter,
            getUserByIdRepository,
        }
    }

    it('should create transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(createTransactionParams)

        expect(result).toEqual(transaction)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(createTransactionParams)

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })

    it('should call IdGeneratorAdapter', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        const idGeneratorAdapterSpy = import.meta.jest.spyOn(
            idGeneratorAdapter,
            'execute',
        )

        await sut.execute(createTransactionParams)

        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
    })

    it('should call CreateUserRepository with correct params', async () => {
        const { sut, createTransactionRepository } = makeSut()
        const createTransactionRepositorySpy = import.meta.jest.spyOn(
            createTransactionRepository,
            'execute',
        )

        await sut.execute(createTransactionParams)

        expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_id',
        })
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)

        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        import.meta.jest
            .spyOn(idGeneratorAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateTransactionRepository throws', async () => {
        const { sut, createTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(createTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow()
    })
})
