import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return {
            sut,
            getUserByIdUseCase,
        }
    }

    it('should return 200 if user is found', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if an invalid id is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: { userId: 'invalid_id' },
        })

        expect(result.statusCode).toBe(400)
    })
})
