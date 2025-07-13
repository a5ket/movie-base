import { z } from 'zod'
import { NewMovie } from './types'


const movieSchema = z.object({
    title: z.string(),
    year: z.string(),
    format: z.string(),
    actors: z.array(z.string())
})

const moviesSchema = z.array(movieSchema)


export function validateNewMovie(movie: NewMovie) {
    movieSchema.parse(movie)
}


export function validateNewMovies(movies: NewMovie[]) {
    moviesSchema.parse(movies)
}