import { otherStreamProvidersRepository, streamProviderRepository } from "@dal";
import { Platform, StreamServiceStats } from "@entities";
import AppDependencies from "appDependencies";

export class StreamProviderService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: number) {
        const providers = await streamProviderRepository.doesUserHaveProviderList(userId);
        if (providers) {
            return;
        }
        return await streamProviderRepository.create(userId);
    }

    public async get(userId: number, pageSize: number, pageNumber: number, streamServices: Platform[]) {
        await this.createIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.get(userId, pageNumber, pageSize, streamServices);
    }

    public async getAll(userId: number) {
        await this.createIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.getAll(userId);
    }

    public async doesUserHaveOneOf(userId: number, providers: number[]) {
        await this.createIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.doesUserHaveOneOf(userId, providers);
    }

    public async addProvider(userId: number, providerId: number) {
        await this.createIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.addProvider(userId, providerId);
    }

    public async deleteProvider(userId: number, providerId: number) {
        await this.createIfWatchlistDoesNotExist(userId);
        const watchedTimes = await streamProviderRepository.getWatchedTimes(userId, providerId);
        for (const watchedTime of watchedTimes) {
            await otherStreamProvidersRepository.addWatchedTime(userId, watchedTime.timeWatched, watchedTime.year, watchedTime.month);
        }
        return await streamProviderRepository.deleteProvider(userId, providerId);
    }

    public async addWatchedTime(userId: number, watchedTime: number, providerIds: number[]) {
        await this.createIfWatchlistDoesNotExist(userId);
        const added = await streamProviderRepository.addWatchedTime(userId, watchedTime / 60, providerIds);
        if (!added) {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            await otherStreamProvidersRepository.addWatchedTime(userId, watchedTime / 60, year, month);
        }
    }

    public async removeWatchedTime(userId: number, watchedTime: number, providerIds: number[],
        seenDate: Date) {
        const year = seenDate.getFullYear();
        const month = seenDate.getMonth();
        await this.createIfWatchlistDoesNotExist(userId);
        const removed = await streamProviderRepository.removeWatchedTime(userId, watchedTime / 60, providerIds, year, month);
        if (!removed) {
            await otherStreamProvidersRepository.removeWatchedTime(userId, watchedTime / 60, year, month);
        }
    }

    public async getStats(userId: number, months: number) {
        await this.createIfWatchlistDoesNotExist(userId);
        const allUserProviders = await streamProviderRepository.getAll(userId);
        const timeWatched = await streamProviderRepository.getStats(userId, months);
        const sortedTimeWatched = timeWatched.sort((a, b) => b.timeWatched - a.timeWatched);
        for (const providerId of allUserProviders.providerId) {
            if (!sortedTimeWatched.find((tw) => tw.providerId === providerId)) {
                sortedTimeWatched.push(new StreamServiceStats(providerId, 0));
            }
        }
        const top = sortedTimeWatched.slice(0, 3);
        const timeInPlatforms = timeWatched.reduce((acc, curr) => acc + curr.timeWatched, 0);
        const others = top.reduce((acc, curr) => acc - curr.timeWatched, timeInPlatforms);
        const timeOutsidePlatforms = await otherStreamProvidersRepository.getStats(userId, months);
        return { top, timeInPlatforms, others, timeOutsidePlatforms, servicesStats: sortedTimeWatched };
    }

    public async getUnsubscribedRecommendations(streamServicesStats: StreamServiceStats[], timeInPlatforms: number) {
        return streamServicesStats.filter((provider) => provider.timeWatched < 0.1 * timeInPlatforms);
    }

    private async createIfWatchlistDoesNotExist(userId: number) {
        const streamProvidersList = await streamProviderRepository.doesUserHaveProviderList(userId);
        if (!streamProvidersList) {
            await this.create(userId);
        }
    }

}