
import { WatchProvider } from "moviedb-promise";

export class Platform {
    displayPriority?: number;
    logoPath?: string;
    providerId?: number;
    providerName?: string;
    link: string;

    constructor(platform: WatchProvider) {
        this.displayPriority = platform.display_priority;
        this.logoPath = platform.logo_path;
        this.providerId = platform.provider_id;
        this.providerName = platform.provider_name;
    }

}
