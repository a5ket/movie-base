import express from 'express'
import multer from 'multer'
import { createMovie, createMovies, deleteMovie, getMovie, getMovies, updateMovie } from '../../db/movies'
import { parseMoviesFromText } from '../../utils/movie-parser'
import { isValidationError, parseMoviesQuerySchema, validateNewMovie } from '../../validation'


export const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })


router.get('/', async (req, res) => {
    try {
        const query = parseMoviesQuerySchema(req.query)
        const movies = await getMovies(query)

        res.json({
            data: movies,
            meta: {
                total: movies.length
            },
            status: 1
        })
    } catch (error) {
        return res.status(400).json({
            error: 'Invalid query parameters',
            details: isValidationError(error) ? error.issues : undefined,
            status: 0
        })
    }
})


router.post('/', async (req, res) => {
    const movie = req.body

    try {
        validateNewMovie(movie)
    } catch (error) {
        console.error('Parsing new movie error', error)
        return res.status(422).json({ error: 'Invalid data', details: isValidationError(error) ? error.issues : undefined, status: 0 })
    }

    try {
        const createdMovie = await createMovie(movie)

        return res.json({
            data: createdMovie,
            status: 1
        })
    } catch (error) {
        console.error('Error creating new movie', error)
        return res.status(500).json({ error: 'Internal server error', status: 0 })
    }
})


router.get('/:id', async (req, res) => {
    const movieId = Number(req.params.id)
    const movie = await getMovie(movieId)

    console.log(movie)

    if (!movie) {
        return res.status(404).json({ error: 'Movie not found', status: 0 })
    }

    return res.json({ data: movie, status: 1 })
})


router.patch('/:id', async (req, res) => {
    const movieId = Number(req.params.id)
    const movie = req.body

    try {
        validateNewMovie(movie)
    } catch (error) {
        console.error('Parsing new movie error', error)
        return res.status(422).json({ error: 'Invalid data', status: 0 })
    }

    try {
        const updatedMovie = await updateMovie(movieId, movie)

        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found', status: 0 })
        }

        return res.json({
            data: updatedMovie,
            status: 1
        })
    } catch (error) {
        console.error('Error updating movie', error)
        return res.status(500).json({ error: 'Internal server error', status: 0 })
    }
})


router.delete('/:id', async (req, res) => {
    const movieId = Number(req.params.id)
    const isDeleted = await deleteMovie(movieId)

    if (!isDeleted) {
        return res.status(404).json({
            error: 'Movie not found',
            status: 0
        })
    }

    return res.json({
        status: 1
    })
})


router.post('/import', upload.single('file'), async (req, res) => {
    console.log()

    if (!req.file) {
        return res.status(400).json({ error: 'Missing uploaded file', status: 0 })
    }

    try {
        const fileContent = req.file.buffer.toString('utf-8')
        const movies = parseMoviesFromText(fileContent)

        if (movies.length < 1) {
            return res.status(400).json({ error: 'Failed to find movies in file', status: 0 })
        }

        const createdMovies = await createMovies(movies)

        res.json({
            data: createdMovies,
            meta: {
                imported: createdMovies.length,
                total: movies.length
            },
            status: 1
        })
    } catch (error) {
        console.error('Parsing file error', error)
        res.status(500).json({ error: 'Failed to process file', status: 0 })
    }
})