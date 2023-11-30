import { PostgresDeleteUserRepository } from '../repositories/postgres/index.js'

export class DeleteUserUseCase {
    async execute(userId) {
        const PostgresdeleteUserRepository = new PostgresDeleteUserRepository()

        const deletedUser = await PostgresdeleteUserRepository.execute(userId)

        return deletedUser
    }
}
