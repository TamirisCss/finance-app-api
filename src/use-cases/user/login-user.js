import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserUseCase {
    constructor(
        getUserByEmailRepository,
        passwordCompareAdapter,
        tokensGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordCompareAdapter = passwordCompareAdapter
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
    }

    async execute(email, password) {
        //verify is email is valid
        const user = await this.getUserByEmailRepository.execute(email)
        if (!user) {
            throw new UserNotFoundError()
        }

        //verify if password is valid
        const isPasswordValid = await this.passwordCompareAdapter.execute(
            password,
            user.password,
        )
        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        //genarete token

        return {
            ...user,
            tokens: this.tokensGeneratorAdapter.execute(user.id),
        }
    }
}
