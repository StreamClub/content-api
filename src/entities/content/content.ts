import { Platform, ProvidersDictionary, Review } from "@entities";
import { Cast } from "moviedb-promise";
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
    public userReview: Review;

    constructor(content: TmdbContent, country: string) {
        this.id = content.id;
        this.overview = content.overview;
        this.poster = content.poster_path;
        this.backdrop = content.backdrop_path;
        this.genres = content.genres.map((genre) => genre.name);
        this.cast = content.credits.cast.slice(0, 10);
        this.setPlatforms(content, country);
    }

    public setPlatforms(tmdbContent: TmdbContent, country: string) {
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
    }

    public setProviders(provider: ProvidersDictionary, userPlatforms: number[]) {
        for (const platform of this.platforms) {
            const logoPath = platform.logoPath;
            const matchingKey = Object.keys(provider).find(key => key.endsWith(logoPath));
            if (matchingKey) {
                platform.link = provider[matchingKey].link;
            }
            platform.doesUserHaveAccess = userPlatforms.includes(platform.providerId);
        }
    }

}
