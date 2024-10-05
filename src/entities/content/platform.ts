
import { WatchProvider } from "moviedb-promise";

export class Platform {
    displayPriority?: number;
    logoPath?: string;
    providerId?: number;
    providerName?: string;
    link: string;
    doesUserHaveAccess: boolean;

    constructor(platform: WatchProvider) {
        console.log(platform.provider_name);
        console.log(platform.logo_path);
        this.displayPriority = platform.display_priority;
        this.logoPath = platform.logo_path;
        this.providerId = platform.provider_id;
        this.providerName = platform.provider_name;
    }

}
