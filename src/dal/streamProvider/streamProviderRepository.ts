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
            {
                $skip: (page - 1) * pageSize,
            },
            {
                $limit: pageSize,
            }
        ]);
        const userServices = founded.map((provider: any) => {
            return streamServices.find(platform => platform.providerId === provider.providerId);
        });
        const length = await this.getStreamProvidersAmount(userId);
        return new Page(page, pageSize, length, userServices);
    }

    async addProvider(userId: number, providerId: string): Promise<void> {
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

    async getStreamProvidersAmount(userId: number): Promise<number> {
        const size = await StreamProvidersModel.aggregate([
            {
                $match: {
                    userId: userId,
                },
            },
            {
                $project: {
                    length: { $size: "$providerId" },
                },
            },
        ]);
        return size[0] ? size[0].length : 0;
    }

}

export const streamProviderRepository = new StreamProviderRepository();
