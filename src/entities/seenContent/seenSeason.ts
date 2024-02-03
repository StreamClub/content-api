

export class SeenSeason {
    public id: number;
    public episodes: number[];

    public constructor(seenSeason: SeenSeason) {
        this.id = seenSeason.id;
        this.episodes = seenSeason.episodes;
    }
}
