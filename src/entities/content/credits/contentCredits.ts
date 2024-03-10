import { CreditsResponse } from "moviedb-promise";
import { ContentCastCredit } from "./contentCastCredit";
import { ContentCrewCredit } from "./contentCrewCredit";

export class ContentCredits {
    public cast: ContentCastCredit[]
    public crew: ContentCrewCredit[]

    public constructor(credits: CreditsResponse) {
        this.cast = credits.cast.map(castCredits => new ContentCastCredit(castCredits));
        this.crew = credits.crew.map(crewCredits => new ContentCrewCredit(crewCredits));
    }

}
