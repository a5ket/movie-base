import express from 'express'
import { getUserByEmail } from '../../db/users'
import { createToken } from '../../tokens'
import { SignInRequest } from '../../types'
import { isValidationError, validateUser } from '../../validation'


export const router = express.Router()


router.post('/', async (req, res) => {
    let user: SignInRequest

    try {
        user = validateUser(req.body)
    } catch (error) {
        return res.status(400).json({
            error: 'Invalid body',
            details: isValidationError(error) ? error.issues : undefined,
            status: 0
        })
    }

    const foundUser = await getUserByEmail(user.email)

    if (!foundUser || !(await foundUser.validatePassword(user.password))) {
        return res.status(401).json({ error: 'Invalid email or password', status: 0 })
    }

    const token = createToken({ userId: foundUser.id, email: foundUser.email, })

    return res.json({ token, status: 1 })
})