import { TmdbPerson, ArtistCastCredit, ArtistCrewCredit } from "@entities";
import { ArtistResume } from "./artistResume";
import { ArtistExternalIds } from "./artistExternalIds";

export class Artist extends ArtistResume {
    public knownFor: string;
    public credits: {
        cast: ArtistCastCredit[],
        crew: ArtistCrewCredit[]
    };
    public externalIds: ArtistExternalIds;
    public biography: string;

    public constructor(tmdbPerson: TmdbPerson) {
        super(tmdbPerson);
        this.biography = tmdbPerson.biography;
        this.knownFor = tmdbPerson.known_for_department;
        const cast = tmdbPerson.combined_credits.cast.map(castCredits => new ArtistCastCredit(castCredits));
        const crew = tmdbPerson.combined_credits.crew.map(crewCredits => new ArtistCrewCredit(crewCredits));
        this.credits = { cast, crew };
        this.externalIds = new ArtistExternalIds(tmdbPerson.external_ids);
    }

}
