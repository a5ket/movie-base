import { col, fn, Op, Transaction, where } from 'sequelize'
import { sequelize } from '../config/database'
import { MoviesQuery, NewMovie } from '../types'
import { Actor, Movie } from './models'


const includeActors = [{ model: Actor, as: 'actors', through: { attributes: [] } }]


interface CreateMovieOptions {
    transaction?: Transaction
    withActors?: boolean
}

async function updateMovieActorsByNames(movie: Movie, actors: string[], transaction?: Transaction) {
    const foundActors = await Promise.all(
        actors.map(
            star => Actor.findOrCreate({ where: { name: star }, transaction }).then(res => res[0])
        )
    )

    await movie.setActors(foundActors, { transaction })
}


async function createMovieWithActors({ title, year, format, actors }: NewMovie, { transaction, withActors }: CreateMovieOptions) {
    const movie = await Movie.create({ title, year, format }, { transaction })

    await updateMovieActorsByNames(movie, actors, transaction)

    if (withActors) {
        await movie.reload({ include: includeActors, transaction })
    }

    return movie
}


export async function createMovie(movie: NewMovie) {
    return sequelize.transaction(async (transaction) => {
        return createMovieWithActors(movie, { transaction, withActors: true })
    })
}


export async function createMovies(movies: NewMovie[]) {
    return sequelize.transaction(async (transaction) => {
        return Promise.all(movies.map(movie => createMovieWithActors(movie, { transaction })))
    })
}


export async function getMovie(movieId: number) {
    return Movie.findByPk(movieId, { include: includeActors })
}


export async function getMovies(query: MoviesQuery) {
    const options: any = {
        limit: query.limit,
        offset: query.offset,
        order: [],
        where: {},
        include: []
    }
    
    options.order.push(
        ['title', 'format'].includes(query.sort)
            ? [fn('lower', col(query.sort)), query.order]
            : [query.sort, query.order]
    )

    if (query.search) {
        const searchTerm = `%${query.search.toLowerCase()}%`

        options.where[Op.or] = [
            where(fn('lower', col('title')), { [Op.like]: searchTerm }),
            {
                '$actors.name$': { [Op.like]: searchTerm }
            }
        ]
        options.include.push({
            model: Actor,
            as: 'actors',
            attributes: [],
            required: false
        })
    } else {
        if (query.title) {
            options.where = {
                ...options.where,
                [Op.and]: [
                    options.where[Op.and] || {},
                    where(fn('lower', col('title')), { [Op.like]: `%${query.title.toLowerCase()}%` })
                ]
            }
        }

        if (query.actor) {
            options.include.push({
                model: Actor,
                as: 'actors',
                attributes: [],
                required: true,
                where: where(fn('lower', col('name')), { [Op.like]: `%${query.actor.toLowerCase()}%` })
            })
        }
    }

    console.log(options, query)

    return Movie.findAll(options)
}



export async function deleteMovie(movieId: number) {
    return Boolean(await Movie.destroy({ where: { id: movieId } }))
}


export async function updateMovie(movieId: number, updatedMovie: NewMovie) {
    return sequelize.transaction(async (transaction) => {
        const movie = await Movie.findByPk(movieId, { transaction })

        if (!movie) {
            return null
        }

        await movie.update({ ...updatedMovie }, { transaction })
        await updateMovieActorsByNames(movie, updatedMovie.actors, transaction)

        return movie.reload({ transaction, include: includeActors })
    })
}