import express from 'express'
import path from 'node:path'
import { apiRouter } from './routes/v1'


export const app = express()

app.use('/api/v1/', apiRouter)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})