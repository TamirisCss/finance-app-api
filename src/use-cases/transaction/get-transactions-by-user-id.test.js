import { UserNotFoundError } from '../../errors/user'
import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id'

describe('GetTransactionsByUserIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        }
    }

    it('should get transactions by user id successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual([])
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
        const id = faker.string.uuid()

        const promise = sut.execute(id)

        await expect(promise).rejects.toThrow(new UserNotFoundError(id))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const id = faker.string.uuid()

        await sut.execute(id)

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(id)
    })

    it('should call GetTransactionsByUserIdRepository with correct params', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        const getTransactionsByUserIdRepositorySpy = jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        )
        const id = faker.string.uuid()

        await sut.execute(id)

        expect(getTransactionsByUserIdRepositorySpy).toHaveBeenCalledWith(id)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const id = faker.string.uuid()

        const promise = sut.execute(id)

        await expect(promise).rejects.toThrow()
    })
})
