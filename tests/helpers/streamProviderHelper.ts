import { streamProviderRepository } from "@dal"

export const createStreamProvidersList = async (userId: number) => {
    await streamProviderRepository.create(userId);
}

export const addStreamProvider = async (userId: number, providerId: number) => {
    await streamProviderRepository.addProvider(userId, providerId);
}