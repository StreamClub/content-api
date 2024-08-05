import { OtherStreamProviders } from "@entities";
import { OtherStreamProvidersModel } from "./otherProvidersModel";
import moment from "moment";

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

    async addWatchedTime(userId: number, watchedTime: number, year: number, month: number): Promise<void> {
        await this.createIfWatchlistDoesNotExist(userId);
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

    async removeWatchedTime(userId: number, watchedTime: number, year: number, month: number): Promise<void> {
        await OtherStreamProvidersModel.updateOne(
            {
                userId,
                'watchedTime.year': year,
                'watchedTime.month': month,
                'watchedTime.timeWatched': { $gte: watchedTime }
            },
            {
                $inc: {
                    'watchedTime.$[inner].timeWatched': -watchedTime
                }
            },
            {
                arrayFilters: [
                    { 'inner.year': year, 'inner.month': month }
                ]
            }
        );
    }

    async getStats(userId: number, months: number): Promise<any> {
        const then = moment().subtract(months - 1, 'months').toDate();
        const timeWatched = await OtherStreamProvidersModel.aggregate([
            {
                $match: {
                    userId
                }
            },
            {
                $unwind: '$watchedTime'
            },
            {
                $match: {
                    'watchedTime.year': {
                        $gte: then.getFullYear()
                    },
                    'watchedTime.month': {
                        $gte: then.getMonth()
                    }
                }
            },
            {
                $group: {
                    _id: 'userId',
                    watchedTime: { $sum: '$watchedTime.timeWatched' }
                }
            }
        ]);
        return timeWatched.length === 0 ? 0 : timeWatched[0].watchedTime;
    }

}

export const otherStreamProvidersRepository = new OtherStreamProvidersRepository();
