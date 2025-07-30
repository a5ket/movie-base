import express from 'express'
import multer from 'multer'
import { UniqueValueError } from '../../db/errors'
import { createMovie, createMovies, deleteMovie, getMovie, getMovies, updateMovie } from '../../db/movies'
import { internalErrorMiddleware, validationErrorMiddleware } from '../../middlewares'
import { sendData, sendError, sendNotFoundError, sendUniqueError } from '../../responses'
import { NewMovie } from '../../types'
import { parseMoviesFromText } from '../../utils/movie-parser'
import { validateMoviesQuerySchema, validateNewMovie, validateNewMovies } from '../../validation'


export const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })


router.get('/', async (req, res) => {
    const query = validateMoviesQuerySchema(req.query)
    const movies = await getMovies(query)

    return sendData(res, movies, { total: movies.length })
})


router.post('/', async (req, res) => {
    const movie = validateNewMovie(req.body)

    try {
        const createdMovie = await createMovie(movie)

        return sendData(res, createdMovie)
    } catch (error) {
        console.error('Error creating new movie', error)

        if (error instanceof UniqueValueError) {
            return sendError(res, 'Duplicate movie title, year and format', 409)
        }

        throw error
    }
})


router.get('/:id', async (req, res) => {
    const movieId = Number(req.params.id)
    const movie = await getMovie(movieId)

    if (!movie) {
        return sendNotFoundError(res, 'Movie not found')
    }

    return sendData(res, movie)
})


router.patch('/:id', async (req, res) => {
    const movieId = Number(req.params.id)
    const movie = validateNewMovie(req.body)
    const updatedMovie = await updateMovie(movieId, movie)

    if (!updatedMovie) {
        return sendNotFoundError(res, 'Movie not found')
    }

    return sendData(res, updatedMovie)
})


router.delete('/:id', async (req, res) => {
    const movieId = Number(req.params.id)
    const isDeleted = await deleteMovie(movieId)

    if (!isDeleted) {
        return sendNotFoundError(res, 'Movie not found')
    }

    return sendData(res)
})


router.post('/import', upload.single('movies'), async (req, res) => {
    if (!req.file) {
        return sendError(res, 'Missing uploaded file', 400)
    }

    let parsedMovies: NewMovie[]

    try {
        const fileContent = req.file.buffer.toString('utf-8')
        parsedMovies = parseMoviesFromText(fileContent)
    } catch (error) {
        console.error('Parsing file error', error)
        return sendError(res, 'Failed to process file', 500)
    }

    if (parsedMovies.length < 1) {
        return sendError(res, 'Failed to find movies in file', 400)
    }

    const validatedMovies = validateNewMovies(parsedMovies)

    try {
        const createdMovies = await createMovies(validatedMovies)

        return sendData(res, createdMovies, { imported: createdMovies.length, total: parsedMovies.length })
    } catch (error) {
        if (error instanceof UniqueValueError) {
            return sendUniqueError(res, 'Duplicate movie title, year and format')
        }

        throw error
    }
})


router.use(validationErrorMiddleware, internalErrorMiddleware)