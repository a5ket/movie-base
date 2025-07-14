export interface NewMovie {
    title: string
    year: number
    format: string
    actors: string[]
}


export type MoviesQuery = {
    sort: "title" | "id" | "year"
    order: "DESC" | "ASC"
    limit: number
    offset: number
    actor?: string | undefined
    title?: string | undefined
    search?: string | undefined
}