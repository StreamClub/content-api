import { Db } from "../../src/dal/dbConnection";
export class TestDb extends Db {

    public constructor() {
        super('sqlite::memory:', false);
    }

    public async initTestDb(): Promise<void> {
    }

    public async clearDatabase(): Promise<void> {
    }

    public async closeDatabase(): Promise<void> {
    }

}
