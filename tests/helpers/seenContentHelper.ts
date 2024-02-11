import { seenContentRepository } from "@dal"

export const createSeenContentList = async (userId: number) => {
    await seenContentRepository.create(userId.toString());
}

export const seeMovie = async (userId: number, movieId: number) => {
    await seenContentRepository.addMovie(userId.toString(), movieId);
}
