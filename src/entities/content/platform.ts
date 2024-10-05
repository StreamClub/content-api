
import { WatchProvider } from "moviedb-promise";

export class Platform {
    displayPriority?: number;
    logoPath?: string;
    providerId?: number;
    providerName?: string;
    link: string;
    doesUserHaveAccess: boolean;

    constructor(platform: WatchProvider) {
        if (platform) console.log(`${platform.provider_name} ${platform.logo_path}`);
        else console.log('no platform');
        this.displayPriority = platform.display_priority;
        this.logoPath = platform.logo_path;
        this.providerId = platform.provider_id;
        this.providerName = platform.provider_name;
    }

}
