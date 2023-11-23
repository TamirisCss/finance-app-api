import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        //TODO: VERIFY IF EMAIL ALREADY EXISTS

        //GENARATE USER ID
        const userId = uuidv4()

        //CRYPT PASSWORD
        const passwordHash = await bcrypt.hash(createUserParams.password, 10)

        //INSERT UDER ON DB (POSTGRES)
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
