export class SeenEpisode {
    public episodeId: number;
    public seasonId: number;
    public runtime: string;
    public createdAt: Date;

    public constructor(seenEpisode: SeenEpisode) {
        this.episodeId = seenEpisode.episodeId;
        this.seasonId = seenEpisode.seasonId;
        this.runtime = seenEpisode.runtime;
        this.createdAt = seenEpisode.createdAt;
    }
}
