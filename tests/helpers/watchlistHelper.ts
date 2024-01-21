import { watchlistRepository } from "@dal"

export const createWatchlist = async (userId: number) => {
    watchlistRepository.create(userId.toString());
}
