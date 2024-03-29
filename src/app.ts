import express from 'express'
import cors from 'cors'
import { exceptionToHttpError, loggerMiddleware } from '@middlewares'
import { registerRouters } from '@routes'
import AppDependencies from './appDependencies'
import { toCamelCase } from '@middlewares'

export class App {
    private dependencies: AppDependencies
    public constructor(dependencies: AppDependencies) {
        this.dependencies = dependencies
    }

    public async start(production: boolean = true) {
        await this.dependencies.db.start()
        const app = express()

        app.use(cors())
        app.use(express.json())
        app.use(toCamelCase())
        if (production) {
            app.use(loggerMiddleware);
        };
        registerRouters(app, this.dependencies)
        app.use(exceptionToHttpError)
        return app
    }
}
