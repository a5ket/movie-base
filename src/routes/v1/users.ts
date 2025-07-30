import express from 'express'
import { UniqueValueError } from '../../db/errors'
import { createUser } from '../../db/users'
import { internalErrorMiddleware, validationErrorMiddleware } from '../../middlewares'
import { sendError, sendToken } from '../../responses'
import { createToken } from '../../tokens'
import { validateNewUser } from '../../validation'


export const router = express.Router()


router.post('/', async (req, res) => {
    const user = validateNewUser(req.body)

    try {
        const createdUser = await createUser(user)
        const token = createToken({ userId: createdUser.id, email: createdUser.email })

        return sendToken(res, token)
    } catch (error) {
        console.error('User post error', error)
        if (error instanceof UniqueValueError) {
            return sendError(res, 'Email must be unique', 409)
        }

        throw error
    }
})


router.use(validationErrorMiddleware, internalErrorMiddleware)