import { Platform, ProvidersDictionary } from "@entities";
import { Cast, Video } from "moviedb-promise";
import { TmdbContent } from "./tmdbContent";


export abstract class Content {
    id: number;
    title: string;
    overview: string;
    poster: string;
    backdrop: string;
    genres: string[];
    platforms: Platform[];
    cast: Cast[];
    releaseDate: string;
    trailers: Video[];

    constructor(content: TmdbContent, country: string, provider: ProvidersDictionary) {
        this.id = content.id;
        this.overview = content.overview;
        this.poster = content.poster_path;
        this.backdrop = content.backdrop_path;
        this.genres = content.genres.map((genre) => genre.name);
        this.cast = content.credits.cast.slice(0, 10);
        this.getPlatforms(content, country, provider);
        this.trailers = this.getTrailers(content);
    }

    protected getPlatforms(tmdbContent: TmdbContent, country: string, provider: ProvidersDictionary) {
        const countryPlatforms = Object.entries(tmdbContent["watch/providers"].results).filter(([key, _]) => {
            return key === country;
        });
        const platforms = [];
        if (countryPlatforms.length > 0 && countryPlatforms[0][1].flatrate) {
            for (const platform of countryPlatforms[0][1].flatrate) {
                platforms.push(new Platform(platform));
            }
        }
        this.platforms = platforms;
        this.setProvidersData(provider)
    }

    protected getTrailers(tmdbContent: TmdbContent) {
        const youtubeTrailers = tmdbContent.videos.results.filter((video) => video.site === 'YouTube' && video.type === 'Trailer');
        return youtubeTrailers.length > 0 ? youtubeTrailers : null;
    }

    protected setProvidersData(provider: ProvidersDictionary) {
        for (const platform of this.platforms) {
            const logoPath = platform.logoPath;
            const matchingKey = Object.keys(provider).find(key => key.endsWith(logoPath));
            if (matchingKey) {
                platform.link = provider[matchingKey].link;
            }
        }
    }

}