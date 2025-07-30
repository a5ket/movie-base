import { app } from './app'
import { sequelize } from './config/database'
import { initModels } from './db'
import { APP_PORT } from './config/consts'


async function main() {
    initModels(sequelize)
    await sequelize.sync()

    const server =  app.listen(APP_PORT, (error) => { 
        if (error) {
            throw error
        }
        
        console.log(`Server is listening on ${JSON.stringify(server.address())}`)
    })
}

main()