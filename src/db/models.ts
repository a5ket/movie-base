import { 
    Association, 
    BelongsToManyAddAssociationMixin, 
    BelongsToManyAddAssociationsMixin, 
    BelongsToManyGetAssociationsMixin, 
    BelongsToManySetAssociationsMixin, 
    CreationOptional, 
    DataTypes, 
    InferAttributes, 
    InferCreationAttributes, 
    Model, 
    NonAttribute, 
    Sequelize 
} from 'sequelize'


export class Movie extends Model<InferAttributes<Movie>, InferCreationAttributes<Movie>> {
    declare id: CreationOptional<number>
    declare title: string
    declare year: number
    declare format: string

    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>

    declare actors: NonAttribute<Actor[]>

    declare getActors: BelongsToManyGetAssociationsMixin<Actor>
    declare addActor: BelongsToManyAddAssociationMixin<Actor, number>
    declare addActors: BelongsToManyAddAssociationsMixin<Actor, number>
    declare setActors: BelongsToManySetAssociationsMixin<Actor, number>

    declare static associations: {
        actors: Association<Movie, Actor>
    }
}


export function initMovieModel(sequelize: Sequelize) {
    Movie.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            title: { type: DataTypes.STRING, allowNull: false },
            year: { type: DataTypes.INTEGER, allowNull: false },
            format: { type: DataTypes.STRING, allowNull: false },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        {
            sequelize,
            tableName: 'movie',
            modelName: 'Movie',
            freezeTableName: true
        }
    )
}


export class Actor extends Model<InferAttributes<Actor, { omit: 'movies' }>, InferCreationAttributes<Actor, { omit: 'movies' }>> {
    declare id: CreationOptional<number>
    declare name: string

    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>

    declare movies?: NonAttribute<Movie[]>

    declare static associations: {
        movies: Association<Actor, Movie>
    }
}

export function initActorModel(sequelize: Sequelize) {
    Actor.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        {
            sequelize,
            tableName: 'actor',
            modelName: 'Actor',
            freezeTableName: true
        }
    )
}