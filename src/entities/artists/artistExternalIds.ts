import { PersonExternalIdsResponse } from "moviedb-promise";


export class ArtistExternalIds {
    public instagramId: string;
    public twitterId: string;

    public constructor(externalIds: PersonExternalIdsResponse) {
        this.instagramId = externalIds.instagram_id && externalIds.instagram_id !== '' ? externalIds.instagram_id : null;
        this.twitterId = externalIds.twitter_id && externalIds.twitter_id !== '' ? externalIds.twitter_id : null;
    }

}
