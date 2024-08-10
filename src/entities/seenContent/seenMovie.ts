export class SeenMovie {
    public movieId: number;
    public updatedAt: Date;
    public createdAt: Date;

    public constructor(movie: SeenMovie) {
        this.movieId = movie.movieId;
        this.updatedAt = movie.updatedAt;
        this.createdAt = movie.createdAt;
    }
}
