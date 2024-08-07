import { Express } from 'express'
import AppDependencies from 'appDependencies'
import {
    MovieRouter, WatchlistRouter, SeriesRouter,
    ArtistRouter, SeenContentRouter, StreamProviderRouter, ReviewRouter,
    PrivacyRouter,
    TriviaRouter
} from '@routes';

export function registerRouters(app: Express, dependencies: AppDependencies) {
    app.get('/health', (_, res) => res.status(200).send());
    app.use('/movies', MovieRouter(dependencies));
    app.use('/watchlist', WatchlistRouter(dependencies));
    app.use("/series", SeriesRouter(dependencies));
    app.use("/artists", ArtistRouter(dependencies));
    app.use("/seenContent", SeenContentRouter(dependencies));
    app.use("/streamProviders", StreamProviderRouter(dependencies));
    app.use("/reviews", ReviewRouter(dependencies));
    app.use("/privacy", PrivacyRouter(dependencies));
    app.use("/trivias", TriviaRouter(dependencies));
}
