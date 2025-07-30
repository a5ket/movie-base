import { z, ZodError } from 'zod'
import { MoviesQuery, NewMovie, SignInRequest, SignUpRequest } from './types'


export type ValidationError = ZodError


export const isValidationError = (error: any) => error instanceof ZodError


const actorValidator = z
    .string()
    .trim()
    .min(1, "Each actor name must not be empty or only spaces.")
    .regex(
        /^[\p{L}\d\s.,'’\-]+$/u,
        "Actor names can only contain letters, numbers, spaces, and the following symbols: . , ' -"
    )

const movieSchema = z
    .object({
        title: z.string()
            .trim()
            .min(1, "Movie title is required and cannot be empty or only spaces."),

        year: z.number()
            .int("Year must be an integer.")
            .gte(1850, "Year must be no earlier than 1850.")
            .lte(2025, "Year must be no later than 2025."),

        format: z.enum(["DVD", "Blu-Ray", "VHS"], "Format must be one of: DVD, Blu-Ray, or VHS."),

        actors: z
            .array(actorValidator)
            .min(1, "You must add at least one actor.")
            .refine((arr) => {
                const seen = new Set()
                return arr.every(actor => {
                    const norm = actor.trim().toLowerCase()
                    if (seen.has(norm)) return false
                    seen.add(norm)
                    return true
                })
            }, {
                message: "Actor names must be unique (case-insensitive).",
            })
    })

const moviesQuerySchema = z
    .object({
        actor: z.string().trim().optional(),
        title: z.string().trim().optional(),
        search: z.string().trim().optional(),
        sort: z.enum(['id', 'title', 'year'], "Sort must be one of: id, title, or year.").default('id'),
        order: z.enum(['DESC', 'ASC'], "Order must be either 'ASC' or 'DESC'.").default('ASC'),
        limit: z.coerce.number()
            .int("Limit must be a whole number.")
            .nonnegative("Limit cannot be negative.")
            .default(20),
        offset: z.coerce.number()
            .int("Offset must be a whole number.")
            .nonnegative("Offset cannot be negative.")
            .default(0)
    })
    .refine(() => true, {
        message: "Query validation error",
        path: [],
    }) satisfies z.ZodType<MoviesQuery>

const userSchema = z
    .object({
        email: z
            .email("Please enter a valid email address.")
            .toLowerCase(),
        password: z
            .string()
            .trim()
            .min(1, "Password is required and cannot be empty or spaces only.")
    })

const newUserSchema = userSchema
    .extend({
        name: z.string()
            .trim()
            .min(1, "Name is required and cannot be empty or spaces only."),
        confirmPassword: z.string()
    })
    .refine((val) => val.password === val.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"]
    }) satisfies z.ZodType<SignUpRequest>

const moviesSchema = z.array(movieSchema)


export function validateNewMovie(movie: NewMovie) {
    return movieSchema.parse(movie)
}


export function validateNewMovies(movies: NewMovie[]) {
    return moviesSchema.parse(movies)
}


export function validateMoviesQuerySchema(query: object) {
    return moviesQuerySchema.parse(query)
}

export function validateNewUser(user: SignUpRequest) {
    return newUserSchema.parse(user)
}


export function validateUser(user: SignInRequest) {
    return userSchema.parse(user)
}