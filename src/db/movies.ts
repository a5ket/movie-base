import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { NewMovie } from '../types'
import { Actor, Movie } from './models'


async function createMovieInTransaction({ title, year, format, stars }: NewMovie, transaction: Transaction) {
    const movie = await Movie.create({ title, year, format }, { transaction })

    for (const name of stars) {
        const [actor] = await Actor.findOrCreate({ where: { name }, transaction })
        await movie.addActor(actor, { transaction })
    }

    return movie
}


export async function createMovie(movie: NewMovie) {
    return sequelize.transaction(async (transaction) => {
        await createMovieInTransaction(movie, transaction)
    })
}


export async function createMovies(movies: NewMovie[]) {
    return sequelize.transaction(async (transaction) => {
        return Promise.all(movies.map(movie => createMovieInTransaction(movie, transaction)))
    })
}