import { Platform } from "@entities";

export class StreamServiceStats {
    public providerId: number;
    public timeWatched: number;
    public logoPath?: string;
    public providerName?: string;
    public displayPriority?: number;
    public exists?: boolean;

    constructor(providerId: number, timeWatched: number) {
        this.providerId = providerId;
        this.timeWatched = timeWatched;
    }

    public setPlatform(platform: Platform) {
        this.logoPath = platform.logoPath;
        this.providerName = platform.providerName;
        this.displayPriority = platform.displayPriority;
    }
}
