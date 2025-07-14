import { NewMovie } from '../types'

function parseMovieFromTextBlock(block: string) {
    const movie: Partial<NewMovie> = {}
    const lines = block.split(/\r?\n/)

    for (const line of lines) {
        const [key, ...rest] = line.split(':')

        if (!key || rest.length === 0) {
            continue
        }

        const value = rest.join(':').trim()

        switch (key.trim().toLowerCase()) {
            case 'title':
                movie.title = value
                break
            case 'release year':
                movie.year = parseInt(value, 10)
                break
            case 'format':
                movie.format = value
                break
            case 'stars':
                movie.actors = value.split(',').map(s => s.trim())
                break
        }
    }

    if (movie.title && movie.year && movie.format && movie.actors) {
        return movie as NewMovie
    }

    return null
}


export function parseMoviesFromText(text: string) {
    const blocks = text.split(/\r?\n\r?\n/)
    const parsedMovies = blocks.map(block => parseMovieFromTextBlock(block)).filter(val => val !== null)

    return parsedMovies
}