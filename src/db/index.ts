import { Sequelize } from 'sequelize'
import { Actor, initActorModel, initMovieModel, Movie } from './models'


export function initModels(sequelize: Sequelize) {
    initMovieModel(sequelize)
    initActorModel(sequelize)

    Movie.belongsToMany(Actor, {
        through: 'movie_actor',
        as: 'actors'
    })

    Actor.belongsToMany(Movie, {
        through: 'movie_actor',
        as: 'movies'
    })
}