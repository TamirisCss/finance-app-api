import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import { user } from '../../tests'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { sut, updateUserUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        },
    }

    it('should return 200 when updating a user with sucess', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when updating a user with invalid email', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when updating a user with invalid password', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when updating a user with invalid id', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
            body: httpRequest.body,
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when updating a user with invalid field', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                invalid_field: 'invalid_field',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUseCase throws with generic error', async () => {
        const { sut, updateUserUseCase } = makeSut()

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if UpdateUserUseCase throws EmailAlreadyInUseError', async () => {
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(faker.internet.email()),
        )

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 if UpdateUserUseCase throws UserNotFoundError', async () => {
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(faker.string.uuid()),
        )

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(404)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        const { sut, updateUserUseCase } = makeSut()
        const executeSpy = jest.spyOn(updateUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        )
    })
})
