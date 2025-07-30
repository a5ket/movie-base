import express from 'express'
import { authMiddleware } from '../../middlewares'
import { router as moviesRouter } from './movies'
import { router as sessionsRouter } from './sessions'
import { router as usersRouter } from './users'


export const apiRouter = express.Router()

apiRouter.use('/users', usersRouter)
apiRouter.use('/sessions', sessionsRouter)
apiRouter.use('/movies', authMiddleware, moviesRouter)