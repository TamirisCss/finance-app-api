import { v4 as uuidv4 } from 'uuid'
import { UserNotFoundError } from '../../errors/user'

export class CreateTransactionUseCase {
    constructor(createTransatiocRepository, getUserByIdRepository) {
        this.createTransatiocRepository = createTransatiocRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(createTransactionParams) {
        //validate if user exists in order to create a transaction
        const userId = createTransactionParams.userId

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = uuidv4()

        //create transaction
        const transaction = await this.createTransatiocRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
