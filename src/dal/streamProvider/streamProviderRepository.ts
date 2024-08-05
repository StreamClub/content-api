import { Page, Platform, StreamServiceStats, UserStreamProviders, WatchedTime } from '@entities'
import { StreamProvidersModel } from './streamProvidersModel';
import moment from 'moment';

class StreamProviderRepository {
    async create(userId: number): Promise<UserStreamProviders> {
        const providersList = new StreamProvidersModel({ userId });
        await providersList.save();
        return new UserStreamProviders(providersList);
    }

    async doesUserHaveProviderList(userId: number): Promise<boolean> {
        const count = await StreamProvidersModel.countDocuments({ userId });
        return count > 0;
    }

    async get(userId: number, page: number, pageSize: number, streamServices: Platform[]): Promise<Page> {
        const providerIds = streamServices.map(platform => platform.providerId);
        const founded = (await StreamProvidersModel.findOne({ userId }))
            .streamProviders.filter(provider => providerIds.includes(provider.providerId));
        //TODO: revisar si esto es necesario o se puede realizar desde la consulta de mongo
        const userServices = streamServices.filter(platform => founded.some(provider => provider.providerId === platform.providerId));
        const results = userServices.slice((page - 1) * pageSize, page * pageSize);
        return new Page(page, pageSize, userServices.length, results);
    }

    async getAll(userId: number): Promise<UserStreamProviders> {
        const providersList = await StreamProvidersModel.findOne({ userId });
        return new UserStreamProviders(providersList);
    }

    async addProvider(userId: number, providerId: number): Promise<void> {
        await StreamProvidersModel.updateOne(
            {
                userId,
                'streamProviders.providerId': {
                    $ne: providerId

                }
            },
            {
                $push: {
                    streamProviders: {
                        $each: [{ providerId: providerId }],
                        $position: 0
                    }
                }
            }
        );
    }

    async doesUserHaveOneOf(userId: number, providerIds: number[]): Promise<boolean> {
        const count = await StreamProvidersModel.countDocuments({
            userId,
            'streamProviders.providerId': { $in: providerIds }
        });
        return count > 0;
    }

    async getWatchedTimes(userId: number, providerId: number): Promise<WatchedTime[]> {
        const user = await StreamProvidersModel.findOne({
            userId
        });
        const provider = user.streamProviders.find(provider => provider.providerId === providerId);
        return provider.watchedTime
    }

    async deleteProvider(userId: number, providerId: number): Promise<void> {
        await StreamProvidersModel.updateOne(
            {
                userId: userId,
                'streamProviders.providerId': providerId
            },
            {
                $pull: {
                    streamProviders: {
                        providerId: providerId
                    }
                }
            }
        );
    }

    async addWatchedTime(userId: number, watchedTime: number, providerIds: number[]): Promise<boolean> {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        let added = false;
        for (const providerId of providerIds) {
            let modified = await StreamProvidersModel.updateOne(
                {
                    userId,
                    'streamProviders.providerId': providerId,
                    'streamProviders.watchedTime.year': year,
                    'streamProviders.watchedTime.month': month
                },
                {
                    $inc: {
                        'streamProviders.$[outer].watchedTime.$[inner].timeWatched': watchedTime
                    }
                },
                {
                    arrayFilters: [
                        { 'outer.providerId': providerId },
                        { 'inner.year': year, 'inner.month': month }
                    ]
                }
            );
            if (modified.modifiedCount === 0 && watchedTime > 0) {
                modified = await StreamProvidersModel.updateOne(
                    {
                        userId,
                        'streamProviders.providerId': providerId
                    },
                    {
                        $push: {
                            'streamProviders.$.watchedTime': {
                                year,
                                month,
                                timeWatched: watchedTime
                            }
                        }
                    }
                );
            }
            if (modified.modifiedCount > 0) {
                added = true;
            }
        }
        return added;
    }

    async removeWatchedTime(userId: number, watchedTime: number, providerIds: number[],
        year: number, month: number): Promise<boolean> {
        let removed = false;
        for (const providerId of providerIds) {
            const modified = await StreamProvidersModel.updateOne(
                {
                    userId,
                    'streamProviders.providerId': providerId,
                    'streamProviders.watchedTime.year': year,
                    'streamProviders.watchedTime.month': month,
                    'streamProviders.watchedTime.timeWatched': { $gte: watchedTime }
                },
                {
                    $inc: {
                        'streamProviders.$[outer].watchedTime.$[inner].timeWatched': -watchedTime
                    }
                },
                {
                    arrayFilters: [
                        { 'outer.providerId': providerId },
                        { 'inner.year': year, 'inner.month': month }
                    ]
                }
            );
            if (modified.modifiedCount > 0) {
                removed = true;
            }
        }
        return removed;
    }

    async getStats(userId: number, months: number): Promise<StreamServiceStats[]> {
        const then = moment().subtract(months - 1, 'months').toDate();
        const timeWatched = await StreamProvidersModel.aggregate([
            {
                $match: {
                    userId
                }
            },
            {
                $unwind: '$streamProviders'
            },
            {
                $unwind: '$streamProviders.watchedTime'
            },
            {
                $match: {
                    'streamProviders.watchedTime.year': {
                        $gte: then.getFullYear()
                    },
                    'streamProviders.watchedTime.month': {
                        $gte: then.getMonth()
                    }
                }
            },
            {
                $group: {
                    _id: '$streamProviders.providerId',
                    watchedTime: { $sum: '$streamProviders.watchedTime.timeWatched' }
                }
            }
        ]);
        return timeWatched.map((time: any) => {
            return new StreamServiceStats(time._id, time.watchedTime);
        });
    }


}

export const streamProviderRepository = new StreamProviderRepository();
