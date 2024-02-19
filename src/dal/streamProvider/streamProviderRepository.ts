import { Page, UserStreamProviders } from '@entities'
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

    async get(userId: number, page: number, pageSize: number): Promise<Page> {
        const founded = await StreamProvidersModel.aggregate([
            {
                $match: {
                    userId: userId,
                },
            },
            {
                $project: {
                    _id: 0,
                    providerIds: 1,
                },
            },
            {
                $unwind: {
                    'path': '$providerIds'
                }
            },
            {
                $skip: (page - 1) * pageSize,
            },
            {
                $limit: pageSize,
            }
        ]);
        const length = await this.getStreamProvidersAmount(userId);
        return new Page(page, pageSize, length, founded);
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
                    length: { $size: "$providerIds" },
                },
            },
        ]);
        return size[0] ? size[0].length : 0;
    }

}

export const streamProviderRepository = new StreamProviderRepository();
