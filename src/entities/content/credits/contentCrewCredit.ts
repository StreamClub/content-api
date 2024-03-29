import { Crew } from "moviedb-promise";

export class ContentCrewCredit {
    public id: number;
    public name: string;
    public poster: string;
    public department: string;
    public job: string;

    public constructor(crewCredits: Crew) {
        this.id = crewCredits.id;
        this.name = crewCredits.name;
        this.poster = crewCredits.profile_path ? crewCredits.profile_path : null;
        this.department = crewCredits.department;
        this.job = crewCredits.job;
    }

}
