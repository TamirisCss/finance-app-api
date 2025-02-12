import bcrypt from 'bcrypt'

export class PasswordCompareAdapter {
    async execute(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword)
    }
}
