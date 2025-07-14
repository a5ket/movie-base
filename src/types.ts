export interface NewMovie {
    title: string
    year: number
    format: string
    actors: string[]
}


export interface MoviesQuery {
    sort: "title" | "id" | "year"
    order: "DESC" | "ASC"
    limit: number
    offset: number
    actor?: string | undefined
    title?: string | undefined
    search?: string | undefined
}


export interface SignInRequest {
    email: string
    password: string
}


export interface SignUpRequest extends SignInRequest {
    name: string
    confirmPassword: string
}