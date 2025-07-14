import { app } from './app'
import { sequelize } from './config/database'
import { initModels } from './db'
import { APP_PORT } from './config/consts'


async function main() {
    initModels(sequelize)
    await sequelize.sync()

    app.listen(APP_PORT, () => {
        console.log(`Server is listening on port ${APP_PORT}`)
    })
}

main()