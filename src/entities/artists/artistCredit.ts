export class ArtistCastCredit {
    public id: number;
    public title: string;
    public poster: string;
    public character: string;
    public mediaType: string;

    public constructor(castCredits: any) {
        this.id = castCredits.id;
        this.title = castCredits.title;
        this.poster = castCredits.poster_path;
        this.character = castCredits.character;
        this.mediaType = castCredits.media_type;
    }

}

export class ArtistCrewCredit {
    public id: number;
    public title: string;
    public poster: string;
    public department: string;
    public job: string;
    public mediaType: string;

    public constructor(crewCredits: any) {
        this.id = crewCredits.id;
        this.title = crewCredits.title;
        this.poster = crewCredits.poster_path;
        this.department = crewCredits.department;
        this.job = crewCredits.job;
        this.mediaType = crewCredits.media_type;
    }

}
