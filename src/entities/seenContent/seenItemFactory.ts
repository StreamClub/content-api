import { SeenItem } from "./seenItem";
import { SeenMovieItem } from "./seenMovieItem";
import { SeenSeriesItem } from "./seenSeriesItem";


export class SeenItemFactory {
    public static create(contentType: string, seenItem: any): SeenItem {
        switch (contentType) {
            case "series":
                return new SeenSeriesItem(seenItem);
            case "movie":
                return new SeenMovieItem(seenItem);
            default:
                throw new Error("Unknown content type");
        }
    }
}