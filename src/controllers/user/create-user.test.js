import { CreateUserController } from './create-user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should return 201 when create a user successfully', async () => {
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )

        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@gmail.com',
                password: '123456',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
        expect(result.body).not.toBeUndefined()
        expect(result.body).not.toBeNull()
    })

    it('should return 400 when first_name is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                last_name: 'Doe',
                email: 'johndoe@gmail.com',
                password: '123456',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})
