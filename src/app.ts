import express from 'express'
import path from 'node:path'
import { logginMiddleware } from './middlewares'
import { apiRouter } from './routes/v1'


export const app = express()

app.use(logginMiddleware)

app.use(express.json())

app.use('/api/v1/', apiRouter)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})