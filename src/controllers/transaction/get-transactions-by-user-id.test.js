import { UserNotFoundError } from '../../errors/user'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { faker } from '@faker-js/faker'
import { transaction } from '../../tests'

describe('Get Transaction By User ID Controller', () => {
    const from = '2024-01-01'
    const to = '2024-01-31'
    class GetUserByIdUseCaseStub {
        async execute() {
            return [transaction]
        }
    }
    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            query: { userId: faker.string.uuid(), from, to },
        })

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when userId is missing', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            query: { userId: undefined },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when userId is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            query: { userId: 'invalid_user_id', from, to },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const result = await sut.execute({
            query: { userId: faker.string.uuid(), from, to },
        })

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when GetUserByIdUseCase throws generic error', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const response = await sut.execute({
            query: { userId: faker.string.uuid(), from, to },
        })

        expect(response.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, 'execute')
        const userId = faker.string.uuid()

        await sut.execute({
            query: { userId: userId, from, to },
        })

        expect(executeSpy).toHaveBeenCalledWith(userId, from, to)
    })
})
