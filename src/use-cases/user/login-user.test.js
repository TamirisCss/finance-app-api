import { LoginUserUseCase } from './login-user'
import { user } from '../../tests/fixtures/user.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'

describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordCompareAdapterStub {
        async execute() {
            return true
        }
    }

    class TokensGeneratorAdapterStub {
        async execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const passwordCompareAdapterStub = new PasswordCompareAdapterStub()
        const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub()
        const sut = new LoginUserUseCase(
            getUserByEmailRepositoryStub,
            passwordCompareAdapterStub,
            tokensGeneratorAdapterStub,
        )
        return {
            sut,
            getUserByEmailRepositoryStub,
            passwordCompareAdapterStub,
            tokensGeneratorAdapterStub,
        }
    }

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepositoryStub, 'execute')
            .mockResolvedValueOnce(null)

        const promise = sut.execute('any_email', 'any_password')
        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordCompareAdapterStub } = makeSut()
        import.meta.jest
            .spyOn(passwordCompareAdapterStub, 'execute')
            .mockReturnValue(false)

        const promise = sut.execute('any_email', 'any_password')
        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens', async () => {
        const { sut, tokensGeneratorAdapterStub } = makeSut()
        import.meta.jest
            .spyOn(tokensGeneratorAdapterStub, 'execute')
            .mockReturnValue({
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            })

        const result = await sut.execute('any_email', 'any_password')
        expect(result.tokens.accessToken).toBe('any_access_token')
        expect(result.tokens.refreshToken).toBe('any_refresh_token')
    })
})
