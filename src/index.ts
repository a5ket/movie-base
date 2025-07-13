import { app } from './app'
import { sequelize } from './config/database'
import { initModels } from './db'


function getEnvVar(name: keyof typeof process.env) {
    const value = process.env[name]

    if (!value) {
        throw new Error(`Environment variable ${name} is not set`)
    }

    return value
}


const APP_PORT = getEnvVar('APP_PORT')


async function main() {
    initModels(sequelize)
    await sequelize.sync({ force: true })

    app.listen(APP_PORT, () => {
        console.log(`Server is listening on port ${APP_PORT}`)
    })
}

main()