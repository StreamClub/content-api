import mongoose from 'mongoose'
import { triviaRepository } from './trivias';
import { TRIVIAS } from '@config';

export class Db {
    private dbUrl: string
    public constructor(database: string) {
        this.dbUrl = database
    }

    public async start() {
        await mongoose.connect(this.dbUrl);
        await this.init();
    }

    private async init() {
        const collections = await mongoose.connection.db.collections();
        const triviaCollection = collections.find(collection => collection.collectionName === 'trivias');
        if (triviaCollection) {
            await triviaCollection.drop();
        }
        triviaRepository.insertMany(TRIVIAS);
    }
}
