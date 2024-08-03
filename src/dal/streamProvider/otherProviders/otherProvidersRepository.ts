import { OtherStreamProviders } from "@entities";
import { OtherStreamProvidersModel } from "./otherProvidersModel";

class OtherStreamProvidersRepository {
    private async create(userId: number): Promise<OtherStreamProviders> {
        const providersList = new OtherStreamProvidersModel({ userId });
        await providersList.save();
        return new OtherStreamProviders(providersList);
    }

    private async doesUserHaveProviderList(userId: number): Promise<boolean> {
        const count = await OtherStreamProvidersModel.countDocuments({ userId });
        return count > 0;
    }

    private async createIfWatchlistDoesNotExist(userId: number): Promise<void> {
        const streamProvidersList = await this.doesUserHaveProviderList(userId);
        if (!streamProvidersList) {
            await this.create(userId);
        }
    }

    async addWatchedTime(userId: number, watchedTime: number): Promise<void> {
        await this.createIfWatchlistDoesNotExist(userId);
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const modified = await OtherStreamProvidersModel.updateOne(
            {
                userId,
                'watchedTime.year': year,
                'watchedTime.month': month
            },
            {
                $inc: {
                    'watchedTime.$[inner].timeWatched': watchedTime
                }
            },
            {
                arrayFilters: [
                    { 'inner.year': year, 'inner.month': month }
                ]
            }
        );
        if (modified.modifiedCount === 0 && watchedTime > 0) {
            await OtherStreamProvidersModel.updateOne(
                {
                    userId,
                },
                {
                    $push: {
                        'watchedTime': {
                            year,
                            month,
                            timeWatched: watchedTime
                        }
                    }
                }
            );
        }
    }

    // async removeWatchedTime(userId: number, watchedTime: number, providerIds: number[], year: number, month: number): Promise<void> {
    //     for (const providerId of providerIds) {
    //         await StreamProvidersModel.updateOne(
    //             {
    //                 userId,
    //                 'streamProviders.providerId': providerId,
    //                 'streamProviders.watchedTime.year': year,
    //                 'streamProviders.watchedTime.month': month,
    //                 'streamProviders.watchedTime.timeWatched': { $gte: watchedTime }
    //             },
    //             {
    //                 $inc: {
    //                     'streamProviders.$[outer].watchedTime.$[inner].timeWatched': -watchedTime
    //                 }
    //             },
    //             {
    //                 arrayFilters: [
    //                     { 'outer.providerId': providerId },
    //                     { 'inner.year': year, 'inner.month': month }
    //                 ]
    //             }
    //         );
    //     }
    // }

}

export const otherStreamProvidersRepository = new OtherStreamProvidersRepository();
