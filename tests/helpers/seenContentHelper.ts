import { seenContentRepository } from "@dal"

export const createSeenContentList = async (userId: number) => {
    await seenContentRepository.create(userId.toString());
}
