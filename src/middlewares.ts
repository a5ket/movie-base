import { NextFunction, Request, Response } from 'express'
import { verifyToken } from './tokens'


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