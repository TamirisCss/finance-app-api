import jwt from 'jsonwebtoken'

export class TokensGeneratorAdapter {
    execute(userId) {
        return {
            accessToken: jwt.sign({ userId }, process.env.JWT_SECRET, {
                expiresIn: '15min',
            }),
            refreshToken: jwt.sign({ userId }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            }),
        }
    }
}
