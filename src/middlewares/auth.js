import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    try {
        // Get token from header
        const accessToken = request.headers?.authorization?.split('Bearer ')[1]

        if (!accessToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }

        // Verify access token is valid
        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )
        if (!decodedToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }

        // Add user id to request
        request.userId = decodedToken.userId

        // Continue to next middleware
        next()
    } catch (error) {
        console.error(error)
        return response.status(401).send({ message: 'Unauthorized' })
    }
}
