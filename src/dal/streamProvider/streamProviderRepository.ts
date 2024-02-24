import { Page, Platform, UserStreamProviders } from '@entities'
import { StreamProvidersModel } from './streamProviderModel';

class StreamProviderRepository {
    async create(userId: number): Promise<UserStreamProviders> {
        const providersList = new StreamProvidersModel({ userId });
        await providersList.save();
        return new UserStreamProviders(providersList);
    }

    async doesUserHaveWatchlist(userId: number): Promise<boolean> {
        const count = await StreamProvidersModel.countDocuments({ userId });
        return count > 0;
    }

    async get(userId: number, page: number, pageSize: number, streamServices: Platform[]): Promise<Page> {
        const providerIds = streamServices.map(platform => platform.providerId);
        const founded = await StreamProvidersModel.aggregate([
            {
                $match: {
                    userId: userId,
                    'providerId': { $in: providerIds }
                },
            },
            {
                $project: {
                    _id: 0,
                    providerId: 1,
                },
            },
            {
                $unwind: {
                    'path': '$providerId'
                }
            },
        ]);
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
                'providerId': {
                    $not: {
                        $elemMatch: {
                            $eq: providerId
                        }
                    }
                }
            },
            {
                $push: {
                    providerId: {
                        $each: [providerId],
                        $position: 0
                    }
                }
            }
        );
    }

    async doesUserHaveOneOf(userId: number, providerIds: number[]): Promise<boolean> {
        const count = await StreamProvidersModel.countDocuments({
            userId,
            'providerId': { $in: providerIds }
        });
        return count > 0;
    }

    async deleteProvider(userId: number, providerId: number): Promise<void> {
        await StreamProvidersModel.updateOne(
            {
                userId,
                'providerId': providerId
            },
            {
                $pull: {
                    providerId: providerId
                }
            }
        );
    }

}

export const streamProviderRepository = new StreamProviderRepository();
