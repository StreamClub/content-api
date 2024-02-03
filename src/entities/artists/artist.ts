import { TmdbPerson, artistCastCredit, artistCrewCredit } from "@entities";
import { PersonExternalIdsResponse } from "moviedb-promise";
import { ArtistResume } from "./artistResume";

export class Artist extends ArtistResume {
    public knownFor: string;
    public credits: {
        cast: artistCastCredit[],
        crew: artistCrewCredit[]
    };
    public externalIds: PersonExternalIdsResponse;

    public constructor(tmdbPerson: TmdbPerson) {
        super(tmdbPerson);
        this.knownFor = tmdbPerson.known_for_department;
        const cast = tmdbPerson.combined_credits.cast.map(castCredits => new artistCastCredit(castCredits));
        const crew = tmdbPerson.combined_credits.crew.map(crewCredits => new artistCrewCredit(crewCredits));
        this.credits = { cast, crew };
        this.externalIds = tmdbPerson.external_ids;
    }

}
