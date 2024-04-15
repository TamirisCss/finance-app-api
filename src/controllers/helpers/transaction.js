import { notFound } from './http.js'

export const transactionNotFoundResponse = () => {
    notFound({ message: 'Transaction not found.' })
}
