

export class UserStreamProviders {
    public userId: number;
    public providerIds: number[];

    constructor(providers: UserStreamProviders) {
        this.userId = providers.userId;
        this.providerIds = providers.providerIds;
    }
}