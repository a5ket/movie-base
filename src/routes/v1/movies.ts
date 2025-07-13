import express from 'express'
import multer from 'multer'
import { Movie } from '../../db/models'
import { createMovies } from '../../db/movies'
import { parseMoviesFromText } from '../../utils/movie-parser'


export const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })


router.get('/', async (req, res) => {
    res.json({ data: await Movie.findAll() })
})

router.post('/', (req, res) => {

})

router.get('/:id', (req, res) => {

})

router.put('/:id', (req, res) => {

})

router.delete('/:id', (req, res) => {

})

router.post('/import', upload.single('file'), async (req, res) => {
    console.log()

    if (!req.file) {
        return res.status(400).json({ error: 'Missing uploaded file' })
    }

    try {
        const fileContent = req.file.buffer.toString('utf-8')
        const movies = parseMoviesFromText(fileContent)

        if (movies.length < 1) {
            return res.status(400).json({ error: 'Failed to find movies in file' })
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
        res.status(500).json({ error: 'Failed to process file' })
    }
})