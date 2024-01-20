import mongoose from 'mongoose'

export class Db {
    private dbUrl: string
    public constructor(database: string) {
        this.dbUrl = database
    }

    public async start() {
        await mongoose.connect(this.dbUrl)
    }
}
