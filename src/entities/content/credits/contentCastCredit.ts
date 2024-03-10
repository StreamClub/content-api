import { Cast } from "moviedb-promise";

export class ContentCastCredit {
    public id: number;
    public name: string;
    public poster: string;
    public character: string;

    public constructor(castCredits: Cast) {
        this.id = castCredits.id;
        this.name = castCredits.name;
        this.poster = castCredits.profile_path ? castCredits.profile_path : undefined;
        this.character = castCredits.character;
    }

}
