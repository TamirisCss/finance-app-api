import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z
        .string({
            required_error: 'first name is required',
        })
        .trim()
        .min(1, {
            message: 'first name must be at least 1 character',
        }),
    last_name: z
        .string({
            required_error: 'last name is required',
        })
        .trim()
        .min(1, {
            message: 'last name must be at least 1 character',
        }),
    email: z
        .string({
            required_error: 'email is required',
        })
        .email({
            message: 'Please provide a valid email',
        })
        .trim()
        .min(1, {
            message: 'email must be at least 1 character',
        }),
    password: z
        .string({
            required_error: 'password is required',
        })
        .trim()
        .min(6, {
            message: 'password must be at least 6 characters',
        }),
})

export const updateUserSchema = createUserSchema.partial().strict({
    message: 'Some provided fields are invalid',
})
