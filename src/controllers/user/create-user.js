import { EmailAlreadyInUseError } from '../../errors/user.js'
import { createUserSchema } from '../../schemas/index.js'
import { badRequest, created, serverError } from '../helpers/index.js'
import { ZodError } from 'zod'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(hhtpRequest) {
        try {
            const params = hhtpRequest.body

            await createUserSchema.parseAsync(params)

            //call use case
            const createdUser = await this.createUserUseCase.execute(params)

            //return user status code 201
            return created(createdUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.log('error', error)
            return serverError()
        }
    }
}
