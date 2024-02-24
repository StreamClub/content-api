import { watchlistRepository } from "@dal"

export const createWatchlist = async (userId: number) => {
    await watchlistRepository.create(userId);
}

export const addContentToWatchlist = async (userId: number, contentId: number, contentType: string) => {
    await watchlistRepository.addContent(userId, contentId.toString(), contentType);
}
