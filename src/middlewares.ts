import { NextFunction, Request, Response } from 'express'
import { sendInternalError, sendValidationError } from './responses'
import { verifyToken } from './tokens'
import { isValidationError } from './validation'


export function logginMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start
        const log = [
            `${req.method} ${req.originalUrl}`,
            res.statusCode,
            `${duration}ms`
        ]

        console.log(log.join(' | '))
    })

    next()
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: 'Authorization header missing', status: 0 })
    }

    try {
        verifyToken(token)
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token', status: 0 })
    }
}


export function validationErrorMiddleware(error: unknown, req: Request, res: Response, next: NextFunction) {
    if (isValidationError(error)) {
        console.error('Validation error', error.issues)
        return sendValidationError(res, error)
    }

    next(error)
}


export function internalErrorMiddleware(error: unknown, req: Request, res: Response) {
    console.error('Internal server error', error)
    return sendInternalError(res)
}