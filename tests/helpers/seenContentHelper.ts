import { seenContentRepository } from "@dal"
import { seenContentService } from "../setup/testsSetup";

export const createSeenContentList = async (userId: number) => {
    await seenContentRepository.create(userId.toString());
}

export const seeMovie = async(userId: number, movieId: number) => {
    await seenContentRepository.addMovie(userId.toString(), movieId);
}

export const seeEpisode = async(userId: number, seriesId: number, seasonNumber: number, episodeNumber: number) => {
    await seenContentService.addEpisode(userId.toString(), seriesId, seasonNumber, episodeNumber);
}

export const getSeenContentList = async(userId: number) => {
    return await seenContentRepository.get(userId.toString());
}