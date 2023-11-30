import { badRequest } from './http'
import validator from 'validator'

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters',
    })
}

export const emailIsAlreadyInUseResponse = () => {
    return badRequest({
        message: 'Invalid e-mail. Please provide a valid one.',
    })
}

export const invalidIdResponse = () => {
    return badRequest({
        message: 'The provided id is not valid.',
    })
}

export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (id) => validator.isUUID(id)
