import { TestDb } from './testDb'
import request from 'supertest'
import { App } from '../../src/app'
import { setUpMocks } from './mocksSetUp'
import { SeenContentService } from '@services'

export let db: TestDb
export let seenContentService: SeenContentService
export let server: request.SuperTest<request.Test>

export function setupBeforeAndAfter() {
    beforeAll(async () => {
        setUpMocks()
        db = new TestDb()
        await db.initTestDb()
        const app = new App({ db })
        seenContentService = new SeenContentService({ db });
        server = request(await app.start(false))
    })
    afterEach(async () => await db.clearDatabase());
    afterAll(async () => await db.closeDatabase());
}
