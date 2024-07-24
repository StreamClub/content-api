import { StreamProviders } from "./streamProviders";

export class UserStreamProviders {
    public userId: number;
    public providerId: number[];

    constructor(providers: StreamProviders) {
        this.userId = providers.userId;
        this.providerId = providers.streamProviders.map(provider => provider.providerId);
    }
}