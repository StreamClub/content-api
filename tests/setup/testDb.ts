import { MongoMemoryServer } from 'mongodb-memory-server';
import { Db } from '../../src/dal/dbConnection'
import mongoose from 'mongoose';
export class TestDb extends Db {
    private db: MongoMemoryServer;
    public constructor() {
        super('')
    }

    public async start(): Promise<void> {
    }

    public async initTestDb(): Promise<void> {
        this.db = await MongoMemoryServer.create();
        await mongoose.connect(this.db.getUri());
    }

    public async clearDatabase(): Promise<void> {
        await mongoose.connection.dropDatabase();

    }

    public async closeDatabase(): Promise<void> {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.db.stop();

    }
}
