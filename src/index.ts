require('module-alias/register')
import * as dotenv from 'dotenv'
import { App } from './app'
import AppDependencies from './appDependencies'
import { Db } from '@dal'
import { config } from '@config'
import http from 'http'
import { logger } from '@utils'

const startServerDependencies = (): AppDependencies => {
    const db = new Db(config.dbUrl)
    return {
        db,
    }
}

dotenv.config()
const dependencies = startServerDependencies()
new App(dependencies).start().then((app) => {
    const server = http.createServer(app)
    server.listen(config.port, () => {
        logger.info(`Content API listening on port ${config.port}`)
    })
})
