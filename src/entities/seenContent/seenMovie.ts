export class SeenMovie {
    public movieId: number;
    public updatedAt: Date;

    public constructor(movie: SeenMovie) {
        console.log(movie);
        this.movieId = movie.movieId
        this.updatedAt = movie.updatedAt
    }
}
