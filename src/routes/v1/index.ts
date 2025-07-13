import express from 'express'
import { router as usersRouter } from './users'
import { router as moviesRouter } from './movies'
import { router as sessionsRouter } from './sessions'


export const apiRouter = express.Router()

apiRouter.use('/users', usersRouter)
apiRouter.use('/sessions', sessionsRouter)
apiRouter.use('/movies', moviesRouter)