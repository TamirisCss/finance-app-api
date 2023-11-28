export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`Email ${email} is already in use.`)
        this.name = 'EmailAlreadyInUseError'
    }
}
