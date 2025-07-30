import express from 'express'
import { getUserByEmail } from '../../db/users'
import { internalErrorMiddleware, validationErrorMiddleware } from '../../middlewares'
import { sendError, sendToken } from '../../responses'
import { createToken } from '../../tokens'
import { validateUser } from '../../validation'


export const router = express.Router()


router.post('/', async (req, res) => {
    const user = validateUser(req.body)
    const foundUser = await getUserByEmail(user.email)

    if (!foundUser || !(await foundUser.validatePassword(user.password))) {
        return sendError(res, 'Invalid email or password', 401)
    }

    const token = createToken({ userId: foundUser.id, email: foundUser.email, })

    return sendToken(res, token)
})


router.use(validationErrorMiddleware, internalErrorMiddleware)