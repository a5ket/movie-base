import { z, ZodError } from 'zod'
import { MoviesQuery, NewMovie, SignInRequest, SignUpRequest } from './types'


export const isValidationError = (error: any) => error instanceof ZodError


const movieSchema = z.object({
    title: z.string(),
    year: z.number(),
    format: z.string(),
    actors: z.array(z.string())
})

const moviesQuerySchema = z.object({
    actor: z.string().optional(),
    title: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['id', 'title', 'year']).default('id'),
    order: z.enum(['DESC', 'ASC']).default('ASC'),
    limit: z.coerce.number().int().nonnegative().default(20),
    offset: z.coerce.number().int().nonnegative().default(0)
}) satisfies z.ZodType<MoviesQuery>


const userSchema = z.object({
    email: z.email().toLowerCase(),
    password: z.string()
})


const newUserSchema = userSchema.extend({
    name: z.string(),
    confirmPassword: z.string()
}).refine((val) => val.password === val.confirmPassword) satisfies z.ZodType<SignUpRequest>


const moviesSchema = z.array(movieSchema)


export function validateNewMovie(movie: NewMovie) {
    return movieSchema.parse(movie)
}


export function validateNewMovies(movies: NewMovie[]) {
    return moviesSchema.parse(movies)
}


export function parseMoviesQuerySchema(query: object) {
    return moviesQuerySchema.parse(query)
}

export function validateNewUser(user: SignUpRequest) {
    return newUserSchema.parse(user)
}


export function validateUser(user: SignInRequest) {
    return userSchema.parse(user)
}