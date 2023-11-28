import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        //VERIFY IF EMAIL ALREADY EXISTS
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()
        const userWithProvidedEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userWithProvidedEmail) {
            throw new Error('Email already in use')
        }

        //GENARATE USER ID
        const userId = uuidv4()

        //CRYPT PASSWORD
        const passwordHash = await bcrypt.hash(createUserParams.password, 10)

        //INSERT USER ON DB (POSTGRES)
        const user = {
            ...createUserParams,
            id: userId,
            password: passwordHash,
        }

        //CALL REPOSITORY
        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createUser = await postgresCreateUserRepository.execute(user)

        return createUser
    }
}
