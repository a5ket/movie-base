import express, { NextFunction, Request, Response } from 'express'
import path from 'node:path'
import { apiRouter } from './routes/v1'


export function logRequest(req: Request, res: Response, next: NextFunction) {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start
        const log = [
            `${req.method} ${req.originalUrl}`,
            res.statusCode,
            `${duration}ms`
        ]

        if (req.is('application/json') && req.body && Object.keys(req.body).length) {
            log.push(`body: ${JSON.stringify(req.body)}`)
        }

        console.log(log.join(' | '))
    })

    next()
}


export const app = express()

app.use(logRequest)

app.use('/api/v1/', apiRouter)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})