import { DeleteUserUseCase } from '../use-cases/index.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
} from './helpers/index.js'

export class DeleteUserController {
    async execute(htttpRequest) {
        try {
            const userId = htttpRequest.params.userId

            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedUserUseCase = new DeleteUserUseCase()

            const deletedUser = await deletedUserUseCase.execute(userId)

            return ok(deletedUser)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
