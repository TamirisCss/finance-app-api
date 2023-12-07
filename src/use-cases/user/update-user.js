import bcrypt from 'bcrypt'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserUseCase) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserUseCase = updateUserUseCase
    }
    async execute(userId, updateUserParams) {
        //1- if email is being  updated, verify if email already exists
        if (updateUserParams.email) {
            const userWithProvidedEmail =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }
        const user = {
            ...updateUserParams,
        }

        //2- if password is being updated, crypt password
        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )
            user.password = hashedPassword
        }
        //2- call repository to update user
        const updatedUser = await this.updateUserUseCase.execute(userId, user)

        return updatedUser
    }
}
