import express from 'express'
import { UniqueValueError } from '../../db/errors'
import { createUser } from '../../db/users'
import { createToken } from '../../tokens'
import { SignUpRequest } from '../../types'
import { isValidationError, validateNewUser } from '../../validation'


export const router = express.Router()


router.post('/', async (req, res) => {
    let user: SignUpRequest

    try {
        user = validateNewUser(req.body)
    } catch (error) {
        return res.status(400).json({
            error: 'Invalid body',
            details: isValidationError(error) ? error.issues : undefined,
            status: 0
        })
    }

    try {
        const createdUser = await createUser(user)
        const token = createToken({ userId: createdUser.id, email: createdUser.email })

        return res.json({
            token,
            status: 1
        })
    } catch (error) {
        console.error('User post error', error)
        if (error instanceof UniqueValueError) {
            return res.status(409).json({ error: 'Email must be unique', status: 0 })
        }

        return res.status(500).json({ error: 'Internal server error', status: 0 })
    }
})