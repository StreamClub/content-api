import { Express } from 'express'
import AppDependencies from 'appDependencies'
import { MovieRouter } from './movieRouter'
import { WatchlistRouter } from './watchlistRouter'

export function registerRouters(app: Express, dependencies: AppDependencies) {
    app.get('/health', (_, res) => res.status(200).send())
    app.use('/movies', MovieRouter(dependencies))
    app.use('/watchlist', WatchlistRouter(dependencies))
}
