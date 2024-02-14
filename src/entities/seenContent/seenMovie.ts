export class SeenMovie {
    public movieId: number;
    public updatedAt: Date;

    public constructor(movie: SeenMovie) {
        this.movieId = movie.movieId
        this.updatedAt = movie.updatedAt
    }
}
