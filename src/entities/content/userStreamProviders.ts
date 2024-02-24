

export class UserStreamProviders {
    public userId: number;
    public providerId: number[];

    constructor(providers: UserStreamProviders) {
        this.userId = providers.userId;
        this.providerId = providers.providerId;
    }
}