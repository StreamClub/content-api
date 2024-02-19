import { streamProviderRepository } from "@dal"

export const createStreamProvidersList = async (userId: number) => {
    await streamProviderRepository.create(userId);
}
