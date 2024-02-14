export class SeenEpisode {
    public episodeId: number;
    public seasonId: number;

    public constructor(seenEpisode: SeenEpisode) {
        this.episodeId = seenEpisode.episodeId;
        this.seasonId = seenEpisode.seasonId;
    }
}
