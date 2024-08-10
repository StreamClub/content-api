import { StreamProvider } from "./streamProvider";

export class StreamProviders {
    public userId: number;
    public streamProviders: StreamProvider[];

    constructor(providers: StreamProviders) {
        this.userId = providers.userId;
        this.streamProviders = providers.streamProviders.map(provider => new StreamProvider(provider));
    }
}